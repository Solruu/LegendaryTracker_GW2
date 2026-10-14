#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""S5 (14/10/2026) : Stella Radians lit ses Research Notes (monnaie 61) a la synchro.

Usage : python3 scripts_tracker/integration/gw2_s5_stella_notes_v1.py SRC DST

L'arbre en demandait 2 500 (research_note -> stella_radians), l'onglet ne
les affichait pas et la synchro ne les lisait pas pour cette cible.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
assert d["craft_components"]["research_note"]["qty"]["stella_radians"] == 2500
d["_meta"]["direct_sync"]["leg_currency_ids"]["stella_radians"]["notes"] = 61
d["_meta"]["last_updated"] = "2026-10-14"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("stella_radians : notes = 61")
