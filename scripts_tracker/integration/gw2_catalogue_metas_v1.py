#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Premier pas du § 12 : un seul catalogue d'horaires, dans la base editoriale.

Ce que la mesure a corrige d'abord. Le tableau `metas:` du JSX n'est pas une
table d'horaires : c'est une liste d'ACTIVITES par legendaire, 112 entrees pour
78 cles distinctes, ou cohabitent trois natures — des metas a horaire, des
fermes de noeuds `isTimeless`, et des postes de farm qui n'ont aucun horaire du
tout (`clovers`, `ectos`, `tier1`, `lodestones`, `provisioner`…). Fusionner les
78 dans `meta_events` aurait melange trois choses.

Seules **27 entrees portent un decalage reel**. Dix-sept sont deja dans
`meta_events` ; les dix autres n'y sont pas, et c'est elles que cette passe y
pose, avec l'horaire du widget comme source.

Les 12 `isTimeless` et les 38 postes de farm ne sont pas touches : ils n'ont pas
d'horaire a sourcer, et leur place dans un catalogue d'horaires serait un faux
manque de plus.

L'appariement meta → segment vient de `gw2_confronte_horaires_v3.apparie` : un
seul appariement pour toute la chaine, celui que 17 accords ont valide.

    python scripts_tracker/integration/gw2_catalogue_metas_v1.py
    python scripts_tracker/integration/gw2_catalogue_metas_v1.py --ecrire
"""
import argparse
import importlib.util
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]

_sp = importlib.util.spec_from_file_location(
    "confronte", RACINE / "scripts_tracker" / "controle" / "gw2_confronte_horaires_v3.py")
_cf = importlib.util.module_from_spec(_sp)
_sp.loader.exec_module(_cf)


def derniere(motif):
    fs = sorted(RACINE.glob(motif),
                key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    return (fs[-1], int(re.search(r"_v(\d+)", fs[-1].name).group(1))) if fs else (None, None)


def bilingue(bloc, champ):
    """`champ: { fr: "...", en: "..." }` ou `champ: "..."`."""
    m = re.search(champ + r': \{([^}]*)\}', bloc)
    if m:
        fr = re.search(r'fr:\s*"((?:[^"\\]|\\.)*)"', m.group(1))
        en = re.search(r'en:\s*"((?:[^"\\]|\\.)*)"', m.group(1))
        if fr or en:
            return {"fr": (fr.group(1) if fr else en.group(1)).replace('\\"', '"'),
                    "en": (en.group(1) if en else fr.group(1)).replace('\\"', '"')}
    m = re.search(champ + r':\s*"((?:[^"\\]|\\.)*)"', bloc)
    return m.group(1).replace('\\"', '"') if m else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ecrire", action="store_true")
    args = ap.parse_args()

    src, version = derniere("gw2_sources_v*.json")
    data = json.loads(src.read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    metas = data.setdefault("meta_events", OrderedDict())
    jsx, _ = derniere("gw2_legendary_tracker_v*.jsx")
    texte = jsx.read_text(encoding="utf-8")

    widget = json.loads((RACINE / "ressources" / "widget" / "event_timer_data.json")
                        .read_text(encoding="utf-8"))
    events = widget.get("events") or {}
    par_carte = {}
    for k, ev in events.items():
        par_carte.setdefault(_cf.norm(ev.get("name")), []).append((k, ev))

    # Une entree a horaire : un `offsetUTC` numerique et pas de `isTimeless`.
    candidats = OrderedDict()
    for part in texte.split('{ id: "')[1:]:
        cle = part.split('"', 1)[0]
        tete = part[:1400]
        o = re.search(r"offsetUTC: (-?\d+|null)", tete)
        if not o or o.group(1) == "null" or "isTimeless: true" in tete:
            continue
        if cle in metas or cle in candidats:
            continue
        i = re.search(r"intervalMin: (\d+)", tete)
        d = re.search(r"durationMin: (\d+)", tete)
        candidats[cle] = (int(o.group(1)), int(i.group(1)) if i else None,
                          int(d.group(1)) if d else None, tete)

    # On apparie en presentant les candidats sous la forme que `apparie` lit :
    # la carte dans `name`, le titre de la meta dans `subname`.
    # La convention s'inverse d'une entree a l'autre : `name` est tantot la
    # carte et tantot la meta. Starlit Weald, Eternity's Garden et Shipwreck
    # Strand sont des CARTES rangees en `subname`, leurs metas etant « Secrets
    # of the Weald », « Shackles of the Ancients » et « Hammerhart Rumble! ».
    # On tente donc les deux sens plutot que de parier sur un seul.
    def essaie(sens):
        vue = OrderedDict()
        for cle, (o, i, d, tete) in candidats.items():
            n, sn = bilingue(tete, "name"), bilingue(tete, "subname")
            carte, meta = (n, sn) if sens == "direct" else (sn, n)
            vue[cle] = {"name": carte, "subname": meta, "map": carte,
                        "offsetUTC": o, "intervalMin": i}
        return vue, _cf.apparie(vue, events, par_carte)

    vue, paires = essaie("direct")
    vue2, paires2 = essaie("inverse")
    for cle, pose in paires2.items():
        if pose and pose[3] and not (paires.get(cle) and paires[cle][3]):
            paires[cle] = pose
            vue[cle] = vue2[cle]

    poses, sans = [], []
    for cle, (o, i, d, tete) in candidats.items():
        pose = paires.get(cle)
        if not pose or not pose[3]:
            sans.append(cle)
            continue
        k, r, seg, (dec, inter, fen) = pose
        entree = OrderedDict([
            ("name", vue[cle]["name"]),
            ("subname", vue[cle]["subname"]),
            ("offsetUTC", dec),
            ("intervalMin", inter),
            ("durationMin", fen),
        ])
        if d is not None and d != fen:
            entree["playtimeMin"] = d
        entree["ref"] = (f"Widget:Event timer/data.json — {k}, segment « "
                         f"{seg.get('name')} » : decalage calcule depuis la frise")
        entree["checked"] = "2026-10-01"
        metas[cle] = entree
        poses.append((cle, seg.get("name"), o, dec, d, fen))

    print(f"candidats a horaire hors base : {len(candidats)}")
    print(f"poses {len(poses)} | sans segment {len(sans)}")
    for cle, nom, o, dec, d, fen in poses:
        marq = "" if o == dec else f"   DECALAGE {o} -> {dec}"
        marq += "" if d == fen else f"   FENETRE {d} -> {fen}"
        print(f"   {cle:14} {str(nom)[:34]:36}{marq}")
    if sans:
        print(f"   sans segment au widget : {', '.join(sans)}")

    if not args.ecrire:
        print("(lecture seule — relancer avec --ecrire)")
        return 0

    dest = RACINE / f"gw2_sources_v{version + 1}.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"ecrit : {dest.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
