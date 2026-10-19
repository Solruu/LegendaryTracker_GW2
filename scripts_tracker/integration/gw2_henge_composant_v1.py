#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Henge : l'etape « Druid Runestone » ne rend pas la pierre inutile (19/10).

Usage : python3 scripts_tracker/integration/gw2_henge_composant_v1.py SRC DST

`component` sur une etape dit : etape faite = composant fabrique, plus rien a
farmer, ni lui ni ce qui le compose. Vrai pour un objet unique (arme Astral,
miroir de Vision). Faux pour la Druid Runestone, consommee 16 fois (`cost` de
16 etapes depuis v409) : valider la premiere etape (henge_3402, bit 1) faisait
disparaitre les 15 pierres restantes, et leur karma, de tous les totaux. Seul
cas du corpus ou le composant d'une etape est aussi consomme par des `cost`.
Le champ est retire ; la pierre de cette etape est comptee par l'etape
suivante qui la consomme (bit 2, « The Druid's Story »).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
it = next(i for i in d["legendaries"]["aurora"]["collections"]["henge_3402"]["items"] if i["bit"] == 1)
assert it.pop("component") == "druid_runestone"
d["_meta"]["last_updated"] = "2026-10-19"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
