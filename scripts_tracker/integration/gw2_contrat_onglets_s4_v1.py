#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""S4 (option B, accord d'Antoine du 14/10/2026) : l'onglet Collections s'ouvre sur la cible Armes.

Usage : python3 scripts_tracker/integration/gw2_contrat_onglets_s4_v1.py SRC DST

Le contrat d'onglets ouvrait Collections seulement si la cible portait des
collections. La cible `weapons` n'en porte pas : ce sont ses 53 armes qui en
ont (1 978 etapes). Le JSX v255 affiche, au-dessus de l'onglet, un selecteur
d'arme qui charge les collections de l'arme choisie dans le rendu generique.
Le contrat gagne donc une condition : le drapeau `isWeaponTracker`.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
w = d["tab_contract"]["tabs"]["collections"]["when"]["any_of"]
if {"flag": "isWeaponTracker"} not in w:
    w.append({"flag": "isWeaponTracker"})
d["_meta"]["last_updated"] = "2026-10-14"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("contrat : Collections ouvert pour la cible Armes")
