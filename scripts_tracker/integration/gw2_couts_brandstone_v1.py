#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Vision : ce que la collection Brandstone Research consomme (20/10).

Usage : python3 scripts_tracker/integration/gw2_couts_brandstone_v1.py SRC DST

Candidat C5 tranche sur captures (20/10, un seul lot) : trois etapes remettent
des materiaux a Yasna, que ni la donnee ni la table du wiki (vision.html, pas
de Powdered Rose Quartz) ne comptaient.
- Kralkatite Research (bit 0) : 10 Kralkatite Ore (kralkatite_research.html) ;
- Powdered Gemstone Research (bit 3) : 10 Powdered Rose Quartz
  (powdered_gemstone_research.html) ;
- Blazing Kralkatite (bit 6) : 10 Kralkatite Ore + 5 Powdered Rose Quartz
  combines au Beam of Light (blazing_kralkatite.html).
Branded Residue (bit 1) : butin d'objet de quete, ne tombe que pendant
l'etape (branded_residue.html) — pas un cout.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
W = "ressources/wiki/"
B = d["legendaries"]["vision"]["collections"]["vis_brandstone"]["items"]
for bit, nom, cout, page in ((0, "Kralkatite Research", {"kralkatite_ore": 10}, "kralkatite_research"),
                             (3, "Powdered Gemstone Research", {"powdered_rose_quartz": 10}, "powdered_gemstone_research"),
                             (6, "Blazing Kralkatite", {"kralkatite_ore": 10, "powdered_rose_quartz": 5}, "blazing_kralkatite")):
    it = next(i for i in B if i["bit"] == bit)
    assert it["name"] == nom and not it.get("cost"), (bit, it["name"])
    for k in cout:
        assert k in cc, k
    it["cost"] = cout
    it["cost_ref"] = f"{W}{page}.html, Acquisition"

d["_meta"]["last_updated"] = "2026-10-20"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
