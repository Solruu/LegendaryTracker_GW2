#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Agony Infusions impaires : la voie retenue est le vendeur (20/10).

Usage : python3 scripts_tracker/integration/gw2_voies_infusions_v1.py SRC DST

gw2_infusions_agonie_v1 compte les +3/+5/+7/+9 chez INFUZ-5959 (4 de la
precedente impaire), sans artisanat ; leurs pages portent aussi une recette
(2 de la paire precedente + 1 thermocatalytique). Sans `best`, les outils de
rapprochement lisaient cette recette comme un cout manquant. `best: vendor`
le dit, comme pour les autres voies tranchees.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
for n in (3, 5, 7, 9):
    c = d["craft_components"][f"agony_infusion_{n}"]
    assert c["sources"][0]["type"] == "vendor"
    c["best"] = "vendor"
d["_meta"]["last_updated"] = "2026-10-20"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
