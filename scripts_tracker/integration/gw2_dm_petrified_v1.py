#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Draconis Mons : le conseil promettait du Petrified Wood (05/11).

Usage : python3 scripts_tracker/integration/gw2_dm_petrified_v1.py SRC DST

BACKLOG « 12 nonies » : le conseil de la meta `dm` disait « ~40 Fire Orchid +
Petrified Wood/compte/jour via nodes », mais draconis_mons.html ne cite que
Fire Orchid. petrified_wood.html tranche : Petrified Stump et Ancient Chests
d'Ember Bay, completion de la carte Ember Bay — aucune source a Draconis
Mons. Le Petrified Wood reste porte par la meta `eb` (Ember Bay), qui le
recompense deja ; on le retire du conseil de `dm`. Aucune recompense ni total.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
t = Path("ressources/wiki/petrified_wood.html").read_text(encoding="utf-8")
assert "Ancient Chest (Ember Bay)" in t and "Draconis" not in t
assert "Petrified" not in Path("ressources/wiki/draconis_mons.html").read_text(encoding="utf-8")
tip = d["meta_events"]["dm"]["tip"]
assert "Fire Orchid + Petrified Wood/compte" in tip["fr"]
tip["fr"] = tip["fr"].replace("~40 Fire Orchid + Petrified Wood/compte/jour via nodes.", "~40 Fire Orchid/compte/jour via nodes (le Petrified Wood se récolte à Ember Bay, pas ici).")
tip["en"] = tip["en"].replace("~40 Fire Orchid + Petrified Wood/account/day via nodes.", "~40 Fire Orchid/account/day via nodes (Petrified Wood is gathered in Ember Bay, not here).")
d["meta_events"]["dm"]["ref"] = "ressources/wiki/petrified_wood.html (Gathered from : Ember Bay) ; ressources/wiki/draconis_mons.html"
d["meta_events"]["dm"]["checked"] = "2026-11-05"
d["meta_events"]["dm"]["verified"] = True
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("dm : Petrified Wood retire du conseil")
