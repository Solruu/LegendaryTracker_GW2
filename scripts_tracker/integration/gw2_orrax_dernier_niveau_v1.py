#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Orrax, dernier niveau : captures du 08/10 (lot 2).

Usage : python3 scripts_tracker/integration/gw2_orrax_dernier_niveau_v1.py SRC DST

Voies d'obtention (icones lues par leur `alt`) :
- Egg : nids de grue (garanti) et butin ; le vendeur de karma (Cassie) est
  historique, donc ignore ;
- Bag of Sugar : marchands de cuisine, 80 cuivre les 10 (texte : l'or se
  compte en pieces d'or entieres) ;
- Vanilla Bean, Raspberry, Passion Fruit : recolte ; Glass of Buttermilk :
  Buttermilk in Bulk (25 garantis).
Recettes decomposees :
- Bowl of Baker's Wet Ingredients (Chef 75) = Glass of Buttermilk + Stick of
  Butter + Egg + Vanilla Bean ;
- Bag of Cassava Flour (Chef 400) = 10 Cassava Root + 5 Milling Stone +
  1 Milling Basin ;
- Pile of Cinnamon and Sugar (Chef 0) = Bag of Sugar + Cinnamon Stick, pose
  sous le pudding (5 par Bowl of Tapioca Pudding, boite Recipe du pudding).
Nouveaux ingredients (Cassava Root, Milling Stone, Milling Basin, Cinnamon
Stick) : apiId du referentiel, page a capturer.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
apis = {v.get("apiId"): k for k, v in cc.items() if v.get("apiId")}
def t(fr, en): return {"fr": fr, "en": en}
def prov(f): return {"verified": True, "checked": "2026-10-08",
                     "ref": f"ressources/wiki/{f}.html (capture du 08/10/2026)"}
def arete(e, p, n):
    q = cc[e].setdefault("qty", {}); assert p not in q, (e, p); q[p] = n
    nf = cc[e].setdefault("needed_for", [])
    if p not in nf: nf.append(p)
def remplace(cid, sources):
    assert all(s.get("type") == "unknown" for s in cc[cid]["sources"]), cid
    cc[cid]["sources"] = sources
def chef(r, f): return [{"type": "craft", "tip": t(f"Cuisine (Chef {r}). Recette lue sur sa page.",
                                                     f"Cooking (Chef {r}). Recipe read from its page."), **prov(f)}]
def inconnu(): return [{"type": "unknown", "tip": t(
    "Ingrédient posé depuis la recette de son plat (08/10/2026). Voie d'obtention à lire sur sa page.",
    "Ingredient added from its dish's recipe (08/10/2026). Acquisition path to read on its page.")}]
def nouveau(cid, nom, api, kind, sources, ref, farmable=True):
    assert cid not in cc and api not in apis, (cid, apis.get(api))
    cc[cid] = {"name": nom, "apiId": api, "kind": kind, "farmable": farmable,
               "needed_for": [], "qty": {}, "sources": sources, **ref}
    apis[api] = cid

remplace("egg", [{"type": "gathering", "free_repeatable": True, "tip": t(
    "Nids de grue (garanti) et butin de nombreuses créatures. Le vendeur de karma (Cassie) est retiré du jeu.",
    "Crane nests (guaranteed) and drops from many creatures. The karma vendor (Cassie) is no longer available."), **prov("egg")}])
remplace("bag_of_sugar", [{"type": "vendor", "npc": "marchands de cuisine (Chef, Apprentice...)", "paid_repeatable": True,
    "cost": t("80 cuivre les 10", "80 copper per 10"), "tip": t(
        "Vendu par les marchands de cuisine des capitales et de nombreuses cartes : 80 cuivre les 10. Négligeable en or.",
        "Sold by cooking vendors in capitals and many maps: 80 copper per 10. Negligible in gold."), **prov("bag_of_sugar")}])
cc["bag_of_sugar"]["farmable"] = False
for cid, fr, en in [
        ("vanilla_bean", "Récolte sur les herbes (3-5, par chance), surtout en jungle de Maguuma ; 2 garanties au domaine.",
         "Harvested from herbs (3-5, by chance), mostly in the Maguuma Jungle; 2 guaranteed at the homestead."),
        ("raspberry", "Récolte sur les framboisiers (1-2, garanti) ; 2 garanties au domaine.",
         "Harvested from raspberry bushes (1-2, guaranteed); 2 guaranteed at the homestead."),
        ("passion_fruit", "Récolte sur les passiflores (1-2, garanti) ; 2 garanties au domaine.",
         "Harvested from passiflora (1-2, guaranteed); 2 guaranteed at the homestead.")]:
    remplace(cid, [{"type": "gathering", "free_repeatable": True, "tip": t(fr, en), **prov(cid)}])
remplace("glass_of_buttermilk", [{"type": "chest", "free_repeatable": True, "tip": t(
    "Conteneur Buttermilk in Bulk : 25 garantis.", "Buttermilk in Bulk container: 25 guaranteed."), **prov("glass_of_buttermilk")}])

for cid, r in [("bowl_of_bakers_wet_ingredients", 75), ("bag_of_cassava_flour", 400)]:
    remplace(cid, chef(r, cid))
    cc[cid].update(kind="intermediate", farmable=False)
arete("glass_of_buttermilk", "bowl_of_bakers_wet_ingredients", 1)
arete("stick_of_butter", "bowl_of_bakers_wet_ingredients", 1)
arete("egg", "bowl_of_bakers_wet_ingredients", 1)
arete("vanilla_bean", "bowl_of_bakers_wet_ingredients", 1)

nouveau("pile_of_cinnamon_and_sugar", "Pile of Cinnamon and Sugar", 12177, "intermediate",
        chef(0, "pile_of_cinnamon_and_sugar"), prov("pile_of_cinnamon_and_sugar"), False)
arete("pile_of_cinnamon_and_sugar", "bowl_of_tapioca_pudding", 5)
arete("bag_of_sugar", "pile_of_cinnamon_and_sugar", 1)

for cid, nom, api, parent, n in [
        ("cassava_root", "Cassava Root", 73113, "bag_of_cassava_flour", 10),
        ("milling_stone", "Milling Stone", 77256, "bag_of_cassava_flour", 5),
        ("milling_basin", "Milling Basin", 76839, "bag_of_cassava_flour", 1),
        ("cinnamon_stick", "Cinnamon Stick", 12258, "pile_of_cinnamon_and_sugar", 1)]:
    nouveau(cid, nom, api, "material", inconnu(),
            {"verified": True, "checked": "2026-10-08", "ref": f"boite Recipe de {parent} (ressources/wiki)"})
    arete(cid, parent, n)

d["_meta"]["last_updated"] = "2026-10-08"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
