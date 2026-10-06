#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Plats d'Orrax : voies d'obtention des 4 ingredients captures le 06/10.

Usage : python3 scripts_tracker/integration/gw2_orrax_acquisitions_v1.py SRC DST

Lu sur les captures, icones remplacees par leur attribut `alt` (les tables
n'ont pas de `data-sort-value`). Seule la sauce soja est vendue : 80 cuivre
les 10 chez les marchands de cuisine. Nopal et asperge se recoltent, l'avocat
vient de conteneurs (Avocados in Bulk : 25 garantis). Aucune quantite.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
def t(fr, en): return {"fr": fr, "en": en}
def src(f, **k):
    k.update({"verified": True, "checked": "2026-10-06",
              "ref": f"ressources/wiki/{f}.html, Acquisition (capture du 06/10/2026)"})
    return k
S = {
 "nopal": [src("nopal", type="gathering", free_repeatable=True, tip=t(
   "Récolte sur les cactus (1-2, par chance) et les cactus de domaine. Garanti par 5 dans les Store of Edible Cactus.",
   "Harvested from cacti (1-2, by chance) and homestead cacti. 5 guaranteed in Store of Edible Cactus."))],
 "avocado": [src("avocado", type="chest", free_repeatable=True, tip=t(
   "Conteneurs : Avocados in Bulk (25 garantis), Fluctuating / Volatile Mass, Mystery Cooking Ingredient Box. Pas de récolte.",
   "Containers: Avocados in Bulk (25 guaranteed), Fluctuating / Volatile Mass, Mystery Cooking Ingredient Box. Not harvested."))],
 "asparagus_spear": [src("asparagus_spear", type="gathering", free_repeatable=True, tip=t(
   "Récolte sur les pieds d'asperge (par chance) ; 2 garanties sur l'asperge de domaine.",
   "Harvested from asparagus (by chance); 2 guaranteed from homegrown asparagus."))],
 "bottle_of_soy_sauce": [src("bottle_of_soy_sauce", type="vendor", npc="marchands de cuisine (Chef, Apprentice...)",
   paid_repeatable=True, cost=t("80 cuivre les 10", "80 copper per 10"), tip=t(
   "Vendue par les marchands de cuisine des capitales et de nombreuses cartes : 80 cuivre les 10. Négligeable en or.",
   "Sold by cooking vendors in capitals and many maps: 80 copper per 10. Negligible in gold."))],
}
for cid, s in S.items():
    assert all(x.get("type") == "unknown" for x in cc[cid]["sources"]), cid
    cc[cid]["sources"] = s
cc["bottle_of_soy_sauce"]["farmable"] = False
d["_meta"]["last_updated"] = "2026-10-06"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
