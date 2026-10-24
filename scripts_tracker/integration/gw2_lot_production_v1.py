#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lot de production : Master Maintenance Oil, 5 par fabrication (24/10).

Usage : python3 scripts_tracker/integration/gw2_lot_production_v1.py SRC DST

Decision d'Antoine (24/10) : une recette qui rend plusieurs unites se compte
par lot, pas en fractions. Champ `lot` (unites par fabrication) ; les aretes
enfants du composant sont alors par fabrication, comme la recette les lit, et
les moteurs (Python v7, JSX v269) comptent ceil(besoin / lot) fabrications.
Recette API 4485 (Huntsman 400) : 3 Pile of Crystalline Dust + 20 Jug of
Water -> 5 Master Maintenance Oil (ressources/api/api_ingredients_armes_
20261024.json). Seul composant a recette multiple selon l'API (24/10).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = c.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


o = cc["master_maintenance_oil"]
assert o["apiId"] == 9461 and "lot" not in o
o["lot"] = 5
o["kind"] = "intermediate"
arete("dust_crystalline", "master_maintenance_oil", 3)
arete("jug_of_water", "master_maintenance_oil", 20)
d["_meta"]["last_updated"] = "2026-10-24"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
