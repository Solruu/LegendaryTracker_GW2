#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Orrax niveau 4 + vin elonien : captures du 07/10 (lot 4).

Usage : python3 scripts_tracker/integration/gw2_orrax_niveau4_v1.py SRC DST

Ginger Root : recolte (Cluster of Canthan Herbs) ou 9 karma chez les
marchands de cuisine des capitales — deux voies, donc pas d'arete karma.
Chili Pepper : recolte (herbes, 2 garantis au domaine).
Bottle of Simple Dressing (Chef 25) = Jar of Vinegar + Jar of Vegetable Oil
+ Pile of Salt and Pepper.
Bottle of Elonian Wine : la source « Vendors PoF » etait fausse ; la page dit
Miyani et les preposes a la Forge, 25 pa 4 pc (data-sort-value 2504).
Aucune quantite du vin modifiee : l'ecart Kudzu (7 / 8) d'ARBITRAGES reste a
lire — la promotion du Foul Essence couterait 1 vin par essence, pas 1 au total.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
apis = {v.get("apiId"): k for k, v in cc.items() if v.get("apiId")}
def t(fr, en): return {"fr": fr, "en": en}
def prov(f): return {"verified": True, "checked": "2026-10-07",
                     "ref": f"ressources/wiki/{f}.html (capture du 07/10/2026)"}
def arete(e, p, n):
    q = cc[e].setdefault("qty", {}); assert p not in q, (e, p); q[p] = n
    nf = cc[e].setdefault("needed_for", [])
    if p not in nf: nf.append(p)

for cid in ("ginger_root", "chili_pepper", "bottle_of_simple_dressing"):
    assert all(s.get("type") == "unknown" for s in cc[cid]["sources"]), cid
cc["ginger_root"]["sources"] = [
    {"type": "gathering", "free_repeatable": True, "tip": t(
        "Récolte sur les Cluster of Canthan Herbs (par chance).",
        "Harvested from Clusters of Canthan Herbs (by chance)."), **prov("ginger_root")},
    {"type": "vendor_karma", "npc": "marchands de cuisine des capitales", "paid_repeatable": True,
     "cost": t("9 karma", "9 karma"), "tip": t(
        "Vendue 9 karma l'unité par les marchands de cuisine des capitales.",
        "Sold for 9 karma each by cooking vendors in the capitals."), **prov("ginger_root")}]
cc["chili_pepper"]["sources"] = [{"type": "gathering", "free_repeatable": True, "tip": t(
    "Récolte sur les herbes de nombreuses cartes (par chance) ; 2 garantis sur le piment de domaine.",
    "Harvested from herbs on many maps (by chance); 2 guaranteed from homegrown chili peppers."), **prov("chili_pepper")}]
sd = cc["bottle_of_simple_dressing"]
sd.update(kind="intermediate", farmable=False, sources=[{"type": "craft", "tip": t(
    "Cuisine (Chef 25). Recette lue sur sa page.", "Cooking (Chef 25). Recipe read from its page."),
    **prov("bottle_of_simple_dressing")}], **prov("bottle_of_simple_dressing"))
assert "jar_of_vinegar" not in cc and 12157 not in apis
cc["jar_of_vinegar"] = {"name": "Jar of Vinegar", "apiId": 12157, "kind": "material", "farmable": True,
    "needed_for": [], "qty": {}, "sources": [{"type": "unknown", "tip": t(
        "Ingrédient posé depuis la recette de la vinaigrette (07/10/2026). Voie d'obtention à lire sur sa page.",
        "Ingredient added from the dressing's recipe (07/10/2026). Acquisition path to read on its page.")}],
    "verified": True, "checked": "2026-10-07",
    "ref": "boite Recipe de bottle_of_simple_dressing (ressources/wiki, capture du 07/10/2026)"}
arete("jar_of_vinegar", "bottle_of_simple_dressing", 1)
arete("jar_of_vegetable_oil", "bottle_of_simple_dressing", 1)
arete("pile_of_salt_and_pepper", "bottle_of_simple_dressing", 1)

w = cc["bottle_elonian_wine"]
assert w["sources"][0].get("tip") == "Vendors PoF (Crystal Oasis, etc.)."
w["sources"][0] = {"type": "vendor", "npc": "Miyani / Préposés à la Forge mystique / Gardien de la Forge",
    "paid_repeatable": True, "cost": t("25 pa 4 pc", "25s 4c"), "tip": t(
        "Vendue 25 pa 4 pc par Miyani et les préposés à la Forge mystique (Lion's Arch, capitales, McM, nombreuses cartes).",
        "Sold for 25s 4c by Miyani and the Mystic Forge Attendants (Lion's Arch, capitals, WvW, many maps)."),
    **prov("bottle_of_elonian_wine")}
d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
