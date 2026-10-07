#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Orrax : trois recettes encore « feuilles assumees » (relecture v5).

Usage : python3 scripts_tracker/integration/gw2_orrax_desserts_v1.py SRC DST

Decision d'Antoine (06/10) : decomposer la cuisine d'Orrax. Recettes lues sur
les captures du depot :
  bowl_of_prickly_pear_sorbet (200)  <- 5 Prickly Pear, 1 Bowl of Ice Cream
                                        Base, 1 Glacial Shard, 1 Lime
  pile_of_ascalonian_herbs           <- 1 Oregano, 1 Basil, 1 Parsley, 1 Thyme Leaf
  bowl_of_passion_fruit_tapioca_pudding : Bowl of Tapioca Pudding + Raspberry
                                        Passion Fruit Compote — sans apiId au
                                        referentiel, NON poses (a capturer).
Nouveaux ingredients : apiId de gw2_materials_ref ; voie d'obtention a lire
sur leur page.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
apis = {v.get("apiId"): k for k, v in cc.items() if v.get("apiId")}
def arete(e, p, n):
    q = cc[e].setdefault("qty", {}); assert p not in q, (e, p); q[p] = n
    nf = cc[e].setdefault("needed_for", [])
    if p not in nf: nf.append(p)
for cid, nom, api, parent, n in [
        ("prickly_pear", "Prickly Pear", 66522, "bowl_of_prickly_pear_sorbet", 5),
        ("bowl_of_ice_cream_base", "Bowl of Ice Cream Base", 38216, "bowl_of_prickly_pear_sorbet", 1),
        ("glacial_shard", "Glacial Shard", 24318, "bowl_of_prickly_pear_sorbet", 1),
        ("oregano_leaf", "Oregano Leaf", 12244, "pile_of_ascalonian_herbs", 1),
        ("basil_leaf", "Basil Leaf", 12245, "pile_of_ascalonian_herbs", 1),
        ("parsley_leaf", "Parsley Leaf", 12246, "pile_of_ascalonian_herbs", 1),
        ("thyme_leaf", "Thyme Leaf", 12248, "pile_of_ascalonian_herbs", 1)]:
    assert cid not in cc and api not in apis, (cid, apis.get(api))
    cc[cid] = {"name": nom, "apiId": api, "kind": "material", "farmable": True,
               "needed_for": [], "qty": {}, "sources": [{"type": "unknown", "tip": {
                   "fr": "Ingrédient posé depuis la recette de son plat (07/10/2026). Voie d'obtention à lire sur sa page.",
                   "en": "Ingredient added from its dish's recipe (07/10/2026). Acquisition path to read on its page."}}],
               "verified": True, "checked": "2026-10-07",
               "ref": f"boite Recipe de {parent} (ressources/wiki)"}
    arete(cid, parent, n)
arete("lime", "bowl_of_prickly_pear_sorbet", 1)
for p in ("bowl_of_prickly_pear_sorbet", "pile_of_ascalonian_herbs"):
    c = cc[p]
    if c.get("kind") == "material":
        c["kind"] = "intermediate"
d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
