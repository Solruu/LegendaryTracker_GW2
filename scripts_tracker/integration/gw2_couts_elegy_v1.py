#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Vision : les sept Awakened Memorials de l'Elegy (20/10).

Usage : python3 scripts_tracker/integration/gw2_couts_elegy_v1.py SRC DST

Candidat C5 lu sur la capture de la collection
(the_convergence_of_sorrow_i_elegy.html, « Collection items ») : chaque
memorial s'achete a Amira contre 20 materiaux, consommes. Ni la donnee ni la
table de vision.html ne les comptaient. Bits 10 a 16 :
Soldier / Wanderer 20 Orichalcum Ingots, Laborer / Brother 20 Cured Hardened
Leather Squares, Friend / Wife and Son 20 Bolts of Gossamer, Peacemaker
20 Ancient Wood Planks — 40 / 40 / 40 / 20 en tout.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
REF = "ressources/wiki/the_convergence_of_sorrow_i_elegy.html, Collection items"
E_ = d["legendaries"]["vision"]["collections"]["vis_elegy"]["items"]
for bit, nom, mat in ((10, "Memorial for a Soldier", "orichalcum_ingot"),
                      (11, "Memorial for a Laborer", "cured_hardened_leather_square"),
                      (12, "Memorial for a Friend", "bolt_of_gossamer"),
                      (13, "Memorial for a Peacemaker", "ancient_wood_plank"),
                      (14, "Memorial for a Wanderer", "orichalcum_ingot"),
                      (15, "Memorial for a Brother", "cured_hardened_leather_square"),
                      (16, "Memorial for a Wife and Son", "bolt_of_gossamer")):
    it = next(i for i in E_ if i["bit"] == bit)
    assert it["name"] == nom and not it.get("cost"), (bit, it["name"])
    assert mat in cc, mat
    it["cost"] = {mat: 20}
    it["cost_ref"] = REF

d["_meta"]["last_updated"] = "2026-10-20"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
