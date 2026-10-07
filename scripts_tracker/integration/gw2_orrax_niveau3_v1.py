#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Orrax, troisieme niveau : captures du 07/10 (lot 3).

Usage : python3 scripts_tracker/integration/gw2_orrax_niveau3_v1.py SRC DST

Voies d'obtention lues (icones par leur `alt`) : Lime (conteneurs, Limes in
Bulk 25 garantis), Beet, Head of Lettuce, Lemongrass, Lotus Root (recolte).
Recettes : Pile of Stirfry Spice Mix (Chef 175) = Onion + Head of Garlic +
Ginger Root + Chili Pepper ; Bottle of Ascalonian Dressing (Chef 125) =
Bottle of Simple Dressing + Pile of Ascalonian Herbs, sous la salade
ascalonienne. Nouveaux ingredients poses avec apiId de gw2_materials_ref ;
leur page reste a capturer.
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
def inconnu(): return [{"type": "unknown", "tip": t(
    "Ingrédient posé depuis la recette de son plat (07/10/2026). Voie d'obtention à lire sur sa page.",
    "Ingredient added from its dish's recipe (07/10/2026). Acquisition path to read on its page.")}]
def nouveau(cid, nom, api, kind, sources, ref, farmable=True):
    assert cid not in cc and api not in apis, (cid, apis.get(api))
    cc[cid] = {"name": nom, "apiId": api, "kind": kind, "farmable": farmable,
               "needed_for": [], "qty": {}, "sources": sources, **ref}

RECOLTE = {
 "lime": ("chest", "Conteneurs : Limes in Bulk (25 garantis), Fluctuating / Volatile Mass, Mystery Cooking Ingredient Box. Pas de récolte.",
          "Containers: Limes in Bulk (25 guaranteed), Fluctuating / Volatile Mass, Mystery Cooking Ingredient Box. Not harvested."),
 "beet": ("gathering", "Récolte sur les plantes à racines (1-2, par chance) ; 2 garanties sur les betteraves de domaine.",
          "Harvested from root plants (1-2, by chance); 2 guaranteed from homegrown beets."),
 "head_of_lettuce": ("gathering", "Récolte sur les salades et plantes potagères (par chance) ; 2 garanties sur la laitue de domaine.",
          "Harvested from lettuce and vegetable plants (by chance); 2 guaranteed from homegrown lettuce."),
 "lemongrass": ("gathering", "Récolte sur les touffes d'herbes et plantes de jungle (par chance) ; 2 garanties sur la citronnelle de domaine.",
          "Harvested from herb clusters and jungle plants (by chance); 2 guaranteed from homegrown lemongrass."),
 "lotus_root": ("gathering", "Récolte sur les lotus (1-2, garanti).", "Harvested from lotus (1-2, guaranteed)."),
}
for cid, (ty, fr, en) in RECOLTE.items():
    assert all(s.get("type") == "unknown" for s in cc[cid]["sources"]), cid
    cc[cid]["sources"] = [{"type": ty, "free_repeatable": True, "tip": t(fr, en), **prov(cid)}]

def chef(r, f): return [{"type": "craft", "tip": t(f"Cuisine (Chef {r}). Recette lue sur sa page.",
                                                     f"Cooking (Chef {r}). Recipe read from its page."), **prov(f)}]
sm = cc["pile_of_stirfry_spice_mix"]
assert all(s.get("type") == "unknown" for s in sm["sources"])
sm.update(kind="intermediate", farmable=False, sources=chef(175, "pile_of_stirfry_spice_mix"), **prov("pile_of_stirfry_spice_mix"))
nouveau("bottle_of_ascalonian_dressing", "Bottle of Ascalonian Dressing", 12175, "intermediate",
        chef(125, "bottle_of_ascalonian_dressing"), prov("bottle_of_ascalonian_dressing"), False)
arete("bottle_of_ascalonian_dressing", "bowl_of_ascalonian_salad", 1)

for cid, nom, api, parent in [("ginger_root", "Ginger Root", 12328, "pile_of_stirfry_spice_mix"),
                              ("chili_pepper", "Chili Pepper", 12331, "pile_of_stirfry_spice_mix"),
                              ("bottle_of_simple_dressing", "Bottle of Simple Dressing", 12176, "bottle_of_ascalonian_dressing")]:
    nouveau(cid, nom, api, "material", inconnu(),
            {"verified": True, "checked": "2026-10-07",
             "ref": f"boite Recipe de {parent} (ressources/wiki, capture du 07/10/2026)"})
    arete(cid, parent, 1)
arete("onion", "pile_of_stirfry_spice_mix", 1)
arete("head_of_garlic", "pile_of_stirfry_spice_mix", 1)
arete("pile_of_ascalonian_herbs", "bottle_of_ascalonian_dressing", 1)

d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
