#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Plats d'Orrax : decomposition, premier niveau (decision d'Antoine, 06/10/2026).

Usage : python3 scripts_tracker/integration/gw2_orrax_plats_v1.py SRC DST

Antoine : « les decomposer. Je me mefie des recettes, et si on s'apercoit
que le volume est negligeable, alors on avisera. »

Recettes lues sur les captures des quatre plats. Chacun ne portait qu'un de
ses ingredients (la viande, ou le poivre). Ne sont poses ici que les
ingredients dont l'apiId est connu (gw2_materials_ref.json) :
  bowl_of_black_pepper_cactus_salad <- 5 Nopal, 1 Avocado
  meaty_asparagus_skewer            <- 2 Asparagus Spear, 1 Bottle of Soy Sauce
Restent, faute de page et d'apiId (intermediaires cuisines) : Bowl of
Ascalonian Salad (3/salade), Jar of Red Curry Paste (2/satay), Pile of Tangy
Seasoning (1), Bottle of Coconut Milk (1), Bottle of Rice Wine (1/brochette),
Cup of Lotus Fries (1/steak). A capturer, puis a decomposer a leur tour.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
NOUVEAUX = [
    ("nopal", "Nopal", 66524, {"bowl_of_black_pepper_cactus_salad": 5}),
    ("avocado", "Avocado", 12340, {"bowl_of_black_pepper_cactus_salad": 1}),
    ("asparagus_spear", "Asparagus Spear", 12505, {"meaty_asparagus_skewer": 2}),
    ("bottle_of_soy_sauce", "Bottle of Soy Sauce", 12271, {"meaty_asparagus_skewer": 1}),
]
apis = {v.get("apiId"): k for k, v in cc.items() if v.get("apiId")}
for cid, nom, api, qty in NOUVEAUX:
    assert cid not in cc and api not in apis, (cid, apis.get(api))
    cc[cid] = {
        "name": nom, "apiId": api, "kind": "material", "needed_for": sorted(qty),
        "farmable": True,
        "sources": [{"type": "unknown", "tip": {
            "fr": "Ingrédient posé depuis la recette du plat (06/10/2026). Voie d'obtention à lire sur sa page.",
            "en": "Ingredient added from the dish's recipe (06/10/2026). Acquisition path to read on its page."}}],
        "qty": qty, "verified": True, "checked": "2026-10-06",
        "ref": "boite Recipe de " + ", ".join(sorted(qty)) + " (ressources/wiki)"}
d["_meta"]["last_updated"] = "2026-10-06"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
