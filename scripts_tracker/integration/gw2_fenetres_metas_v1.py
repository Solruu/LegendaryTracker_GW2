#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
`durationMin` devient la FENETRE, et le temps de jeu passe a cote.

Antoine a tranche le 01/10 : le nombre affiche doit dire combien de temps la
fenetre reste ouverte, pas combien de temps la meta prend. Trois raisons, et
elles tiennent :

1. Une meta finie en 15 minutes par les joueurs ne raccourcit pas sa fenetre.
   Le depart de la suivante se calcule sur « debut + fenetre », pas sur la fin
   reelle. Un `durationMin` qui vaudrait le temps de jeu fausserait tout
   enchainement.
2. Ce qu'il cherche, c'est enchainer un maximum de metas dans deux heures de
   jeu. Ca se calcule avec des DEBUTS exacts et des fenetres exactes.
3. Le temps de jeu reste utile pour planifier, mais il peut rester vague — et
   en usage, il suffit de rouvrir le tracker une fois la meta finie.

Donc on ne jette pas nos valeurs : elles sont la seule estimation de temps de
jeu qu'on ait. Elles passent en `playtimeMin`, declarees pour ce qu'elles sont
— une estimation editoriale, non sourcee. `durationMin` recoit la duree du
segment lue dans `Widget:Event timer/data.json`, qui, elle, est sourcee.

Deux passes dans l'ordre impose : la base editoriale d'abord, le JSX en dernier.

    python scripts_tracker/integration/gw2_fenetres_metas_v1.py
    python scripts_tracker/integration/gw2_fenetres_metas_v1.py --ecrire
"""
import argparse
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]


def derniere(motif):
    fs = sorted(RACINE.glob(motif),
                key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    return (fs[-1], int(re.search(r"_v(\d+)", fs[-1].name).group(1))) if fs else (None, None)


# Un seul appariement pour toute la chaine : celui de la confrontation, valide
# par 17 accords. Mon premier jet en avait ecrit un autre, par (decalage,
# intervalle) -- il a joint `er` a « Defending Tarir (Pylons) » et la monnaie
# `karma` au Death-Branded Shatterer, parce que des dizaines d'evenements
# partagent le meme couple. Deux appariements qui repondent differemment sur la
# meme meta, c'est le chemin parallele qu'on s'interdit.
import importlib.util as _ilu

_sp = _ilu.spec_from_file_location(
    "confronte", RACINE / "scripts_tracker" / "controle" / "gw2_confronte_horaires_v3.py")
_cf = _ilu.module_from_spec(_sp)
_sp.loader.exec_module(_cf)
norm, en, frise, apparie = _cf.norm, _cf.en, _cf.frise, _cf.apparie


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ecrire", action="store_true")
    args = ap.parse_args()
    widget = json.loads((RACINE / "ressources" / "widget" / "event_timer_data.json")
                        .read_text(encoding="utf-8"))
    events = widget.get("events") or {}
    par_carte = {}
    for k, ev in events.items():
        par_carte.setdefault(norm(ev.get("name")), []).append((k, ev))

    # ── 1. base editoriale
    src, version = derniere("gw2_sources_v*.json")
    if not src:
        sys.exit("aucun gw2_sources_v*.json")
    data = json.loads(src.read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    metas = data.get("meta_events") or {}
    paires = apparie(metas, events, par_carte)
    faits, inchanges, sans = [], [], []
    for cle, m in metas.items():
        if not isinstance(m, dict):
            continue
        pose = paires.get(cle)
        fen = pose[3][2] if pose and pose[3] else None
        nom = (pose[2] or {}).get("name") if pose else None
        if fen is None:
            sans.append(cle)
            continue
        ancien = m.get("durationMin")
        if ancien == fen:
            inchanges.append(cle)
            continue
        if ancien is not None and "playtimeMin" not in m:
            m["playtimeMin"] = ancien
        m["durationMin"] = fen
        faits.append((cle, ancien, fen, nom))
    print(f"[1/2] base — fenetres posees {len(faits)}, deja justes {len(inchanges)}, "
          f"sans segment {len(sans)}")
    for cle, a, b, nom in faits:
        print(f"      {cle:6} {str(nom)[:34]:36} {a} -> {b}  (playtimeMin={a})")
    if sans:
        print(f"      sans segment : {', '.join(sans)}")

    # ── 2. JSX, en dernier, et SEULEMENT pour les cles que la base porte deja.
    # Les 19 cles que le JSX porte seul n'ont pas d'appariement valide : les
    # joindre au jugé rejouerait l'erreur du premier jet. Elles sont listees.
    jsx, vjsx = derniere("gw2_legendary_tracker_v*.jsx")
    texte = jsx.read_text(encoding="utf-8")
    cibles = {cle: b for cle, _a, b, _n in faits}
    faits_jsx, hors_base = [], []
    # Un `finditer` non gourmand sautait des entrees : une cle sans
    # `durationMin` proche avalait le bloc suivant, et `vb` disparaissait. On
    # decoupe par entree, puis on lit dans chacune.
    for part in texte.split('{ id: "')[1:]:
        cle = part.split('"', 1)[0]
        tete = part[:900]
        md = re.search(r"durationMin: (\d+),", tete)
        if not md:
            continue
        du = int(md.group(1))
        if cle not in metas:
            hors_base.append(cle)
            continue
        if cle in cibles and du != cibles[cle]:
            faits_jsx.append((cle, du, cibles[cle], '{ id: "' + part[:md.end()]))
    print(f"[2/2] JSX — fenetres a poser {len(faits_jsx)} ; "
          f"{len(set(hors_base))} cles hors base, non touchees")
    for cle, a, b, _ in faits_jsx:
        print(f"      {cle:12} {a} -> {b}")

    if not args.ecrire:
        print("(lecture seule — relancer avec --ecrire)")
        return 0

    dest = RACINE / f"gw2_sources_v{version + 1}.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"ecrit : {dest.name}")

    for cle, a, b, extrait in faits_jsx:
        neuf = extrait.replace(f"durationMin: {a},", f"durationMin: {b}, playtimeMin: {a},", 1)
        texte = texte.replace(extrait, neuf, 1)
    djsx = RACINE / f"gw2_legendary_tracker_v{vjsx + 1}.jsx"
    djsx.write_text(texte, encoding="utf-8")
    print(f"ecrit : {djsx.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
