#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
`rewards` des métas, sourcé par la sous-page de la ressource.

Le croisement par coffre a donne dix metas sur vingt-neuf, et m'a fait publier
deux listes fausses. La bonne source existe et elle est unique :
`Amalgamated Gemstone/Events and Timers`, une sous-page du wiki qui enumere
exactement les cartes et les evenements qui rendent la gemme. Sur les 705
composants captures, c'est la seule ressource qui en a une — donc ce script
traite la gemme, et dira franchement qu'il ne sait rien des autres.

Deux sources se confrontent ici, comme la regle l'impose depuis le 01/10 :

  la sous-page   donne les noms de CARTES de sa section « Event timers » ;
  le widget      donne, pour chaque carte, l'evenement et ses segments.

Un nom retenu doit exister des deux cotes. Un nom qui n'apparait que dans la
prose de la sous-page — « the Janthir Syntri », « and Castora » — ne passe pas
le second filtre, et c'est precisement ce qui manquait a mes deux listes.

    python scripts_tracker/integration/gw2_rewards_metas_v4.py
    python scripts_tracker/integration/gw2_rewards_metas_v4.py --ecrire
"""
import argparse
import importlib.util
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
SOUSPAGE = RACINE / "ressources" / "wiki" / "amalgamated_gemstone_events_and_timers.html"

_sp = importlib.util.spec_from_file_location(
    "confronte", RACINE / "scripts_tracker" / "controle" / "gw2_confronte_horaires_v4.py")
_cf = importlib.util.module_from_spec(_sp)
_sp.loader.exec_module(_cf)


def derniere(motif):
    fs = sorted(RACINE.glob(motif),
                key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    return (fs[-1], int(re.search(r"_v(\d+)", fs[-1].name).group(1))) if fs else (None, None)


def cartes_a_gemme(events):
    """Noms de cartes cites par la sous-page ET connus du widget."""
    raw = SOUSPAGE.read_text(encoding="utf-8")
    i = raw.find('id="Event_timers"')
    if i < 0:
        sys.exit("la sous-page ne porte pas de section Event timers")
    seg = raw[i:]
    connus = {_cf.norm(ev.get("name")): ev.get("name") for ev in events.values()}
    vus, hors = OrderedDict(), []
    for titre in re.findall(r'title="([^"]{3,50})"', seg):
        cle = _cf.norm(titre)
        if cle in connus:
            vus.setdefault(connus[cle], titre)
        else:
            hors.append(titre)
    # Les evenements SANS timer sont dans la section « Events », au-dessus.
    # Le widget ne peut pas servir de seconde source pour eux : par definition
    # il ne liste que ce qui a un horaire. Gyala Delve et Inner Nayos y
    # figurent, et les ecarter faute de confirmation par le widget reviendrait
    # a exiger une preuve que la nature meme du cas interdit. Leur seconde
    # source est notre propre base, qui les porte en metas conditionnelles.
    j = raw.find('id="Events"')
    sans_timer = []
    if 0 <= j < i:
        sans_timer = [t for t in re.findall(r'title="([^"]{3,50})"', raw[j:i])
                      if t and t[0].isupper() and not t.startswith("Edit ")]
    return vus, sans_timer, hors


COFFRE = re.compile(r"([A-Za-z'\u2019\-\. ]{3,34}): Hero's Choice Chest")


def section_acquisition(page):
    """Texte de la section d'acquisition d'une page, sommaire exclu."""
    f = RACINE / "ressources" / "wiki" / f"{page}.html"
    if not f.exists():
        return ""
    t = re.sub(r"<[^>]+>", " ", f.read_text(encoding="utf-8", errors="ignore"))
    i = max(t.rfind("Contained in"), t.rfind("Acquisition"))
    if i < 0:
        return ""
    j = t.find("Used in", i)
    return t[i:j if j > i else i + 9000]


def coffres_par_composant(cc, events):
    """{composant: {cartes}} — le coffre nomme sa carte, le widget la confirme.

    La sous-page « Events and Timers » n'existe que pour la gemme. Pour les
    autres ressources, la seule trace est la mention « <Carte>: Hero's Choice
    Chest » dans leur section d'acquisition. Deux filtres, les memes qu'ailleurs
    et pour les memes raisons : le nom doit commencer par une majuscule — sans
    quoi une phrase sur les plafonds partages rend « and Castora » — et la carte
    doit exister dans le widget, qui sert de seconde source.
    """
    connus = {_cf.norm(ev.get("name")): ev.get("name") for ev in events.values()}
    out = {}
    for cid in cc:
        noms = {n.strip() for n in COFFRE.findall(section_acquisition(cid))
                if n.strip() and n.strip()[0].isupper()}
        cartes = {connus[_cf.norm(n)] for n in noms if _cf.norm(n) in connus}
        if cartes:
            out[cid] = cartes
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ecrire", action="store_true")
    args = ap.parse_args()

    src, version = derniere("gw2_sources_v*.json")
    data = json.loads(src.read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    metas = data["meta_events"]
    widget = json.loads((RACINE / "ressources" / "widget" / "event_timer_data.json")
                        .read_text(encoding="utf-8"))
    events = widget.get("events") or {}

    cartes, sans_timer, hors = cartes_a_gemme(events)
    print(f"cartes a gemme retenues : {len(cartes)}  {sorted(cartes)}")
    if sans_timer:
        print(f"sans timer : {sorted(set(sans_timer))}")
    print(f"titres cites par la sous-page mais inconnus du widget : {len(set(hors))} "
          "(non retenus)")

    # Quelle meta vit sur quelle carte : on relit le `map` de la base, et a
    # defaut le nom du segment apparie.
    par_carte = {}
    for k, ev in events.items():
        par_carte.setdefault(_cf.norm(ev.get("name")), []).append((k, ev))
    paires = _cf.apparie(metas, events, par_carte)

    ajouts, retraits, inchanges, indecis = [], [], [], []
    for cle, m in metas.items():
        if not isinstance(m, dict):
            continue
        pose = paires.get(cle)
        carte = None
        if pose:
            k = pose[0]
            carte = (events.get(k) or {}).get("name")
        if carte is None:
            # Meta conditionnelle, sans horaire : on la rapproche de la section
            # « Events » de la sous-page, par le nom de sa carte.
            for champ in ("map", "name"):
                v = m.get(champ)
                v = v.get("en") if isinstance(v, dict) else v
                if v and any(_cf.norm(v) == _cf.norm(t) for t in sans_timer):
                    carte = v
                    break
        if carte is None:
            indecis.append(cle)
            continue
        rew = [r for r in (m.get("rewards") or []) if r != "amalgamated_gemstone"]
        doit = carte in cartes or any(_cf.norm(carte) == _cf.norm(t) for t in sans_timer)
        a = "amalgamated_gemstone" in (m.get("rewards") or [])
        if doit and not a:
            ajouts.append((cle, carte))
        elif a and not doit:
            retraits.append((cle, carte))
        else:
            inchanges.append(cle)
        if doit:
            rew.append("amalgamated_gemstone")
        m["rewards"] = sorted(set(rew))
        # v4 (03/10/2026, accord d'Antoine) : la provenance de CHAQUE recompense
        # vit dans `rewards_refs`, la gemme comprise. L'ancien `rewards_ref`
        # (texte unique, pour la gemme seule) disparait a la premiere passe.
        legacy = m.pop("rewards_ref", None)
        refs = m.get("rewards_refs") if isinstance(m.get("rewards_refs"), dict) else {}
        if doit:
            section = ("Event timers" if carte in cartes else "Events (sans timer)")
            refs["amalgamated_gemstone"] = ("wiki:Amalgamated_Gemstone/Events_and_Timers, section "
                                            f"« {section} » — carte « {carte} »")
        else:
            refs.pop("amalgamated_gemstone", None)
        if refs:
            m["rewards_refs"] = refs
        else:
            m.pop("rewards_refs", None)
        if legacy and not doit:
            print(f"   ! {cle} : rewards_ref sans gemme, retire : {legacy}")

    # ── Les autres ressources, par le coffre de leur page
    autres = coffres_par_composant(data["craft_components"], events)
    autres.pop("amalgamated_gemstone", None)
    poses_autres = []
    for cle, m in metas.items():
        if not isinstance(m, dict):
            continue
        pose = paires.get(cle)
        carte = (events.get(pose[0]) or {}).get("name") if pose else None
        if not carte:
            continue
        for cid, cartes in autres.items():
            if carte not in cartes:
                continue
            rew = list(m.get("rewards") or [])
            if cid in rew:
                continue
            rew.append(cid)
            m["rewards"] = sorted(set(rew))
            refs = m.setdefault("rewards_refs", {})
            refs[cid] = (f"wiki:{cid} — sa section d'acquisition cite « {carte}: "
                         "Hero's Choice Chest », carte confirmee par le widget")
            poses_autres.append((cle, cid, carte))
    print(f"\nautres ressources posees : {len(poses_autres)} "
          f"(sur {len(autres)} composants a coffre)")
    for cle, cid, carte in sorted(poses_autres):
        print(f"   {cle:14} {cid:28} {carte}")

    print(f"\najouts {len(ajouts)} | retraits {len(retraits)} | "
          f"inchanges {len(inchanges)} | sans carte {len(indecis)}")
    for cle, carte in ajouts:
        print(f"   + {cle:14} {carte}")
    for cle, carte in retraits:
        print(f"   - {cle:14} {carte}  (la sous-page ne la cite pas)")
    if indecis:
        print(f"   sans carte appariee : {', '.join(indecis)}")

    if not args.ecrire:
        print("(lecture seule — relancer avec --ecrire)")
        return 0
    dest = RACINE / f"gw2_sources_v{version + 1}.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"ecrit : {dest.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
