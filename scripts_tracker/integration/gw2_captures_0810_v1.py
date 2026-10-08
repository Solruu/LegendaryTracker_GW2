#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Captures du 08/10 : fin d'Orrax (herbes, sorbet, pudding) et Janthir Wanderlust.

Usage : python3 scripts_tracker/integration/gw2_captures_0810_v1.py SRC DST

Lu sur les captures (icones par leur `alt`), apiId des pages ou du
referentiel :
- herbes : origan, persil, thym recoltes ; basilic vendu 6 karma (ou en
  conteneurs) — deux voies, karma laisse en texte ;
- Prickly Pear recolte ; Glacial Shard en butin par defaut, promotion en Forge
  en alternative (meme regle que le Foul Essence) ;
- Bowl of Ice Cream Base (Chef 0) = Glass of Buttermilk + Egg + Bag of Sugar +
  Vanilla Bean ;
- pudding d'Orrax : Bowl of Tapioca Pudding (Chef 400) = Bowl of Baker's Wet
  Ingredients + Bag of Cassava Flour + 5 Pile of Cinnamon and Sugar (ce
  dernier sans apiId : non pose) ; Raspberry Passion Fruit Compote (Chef 350)
  = Bag of Sugar + Vanilla Bean + Raspberry + Passion Fruit ;
- Gift of Mistburned Barrens et Gift of Bava Nisos, sous Wanderlust :
  completion de carte par defaut, vendeur tres cher en alternative.
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
def inconnu(): return [{"type": "unknown", "tip": t(
    "Ingrédient posé depuis la recette de son plat (08/10/2026). Voie d'obtention à lire sur sa page.",
    "Ingredient added from its dish's recipe (08/10/2026). Acquisition path to read on its page.")}]
def nouveau(cid, nom, api, kind, sources, ref, farmable=True):
    assert cid not in cc and api not in apis, (cid, apis.get(api))
    cc[cid] = {"name": nom, "apiId": api, "kind": kind, "farmable": farmable,
               "needed_for": [], "qty": {}, "sources": sources, **ref}
    apis[api] = cid
def remplace(cid, sources):
    assert all(s.get("type") == "unknown" for s in cc[cid]["sources"]), cid
    cc[cid]["sources"] = sources
def chef(r, f): return [{"type": "craft", "tip": t(f"Cuisine (Chef {r}). Recette lue sur sa page.",
                                                     f"Cooking (Chef {r}). Recipe read from its page."), **prov(f)}]

# --- voies d'obtention
for cid, fr, en in [
        ("oregano_leaf", "Récolte sur les herbes (par chance) ; 2 garanties sur l'origan de domaine.", "Harvested from herbs (by chance); 2 guaranteed from homegrown oregano."),
        ("parsley_leaf", "Récolte sur les herbes (par chance) ; 2 garanties sur le persil de domaine.", "Harvested from herbs (by chance); 2 guaranteed from homegrown parsley."),
        ("thyme_leaf", "Récolte sur les herbes (par chance) ; 2 garanties sur le thym de domaine.", "Harvested from herbs (by chance); 2 guaranteed from homegrown thyme."),
        ("prickly_pear", "Récolte sur les cactus (1-2, par chance) ; 10 garanties dans les Store of Edible Cactus.", "Harvested from cacti (1-2, by chance); 10 guaranteed in Store of Edible Cactus.")]:
    remplace(cid, [{"type": "gathering", "free_repeatable": True, "tip": t(fr, en), **prov(cid)}])
remplace("basil_leaf", [
    {"type": "vendor_karma", "npc": "marchands de cuisine des capitales", "paid_repeatable": True,
     "cost": t("6 karma", "6 karma"), "tip": t("Vendu 6 karma l'unité par les marchands de cuisine des capitales.",
                                               "Sold for 6 karma each by cooking vendors in the capitals."), **prov("basil_leaf")},
    {"type": "chest", "tip": t("Par chance dans certains conteneurs de cuisine.", "By chance from some cooking containers."), **prov("basil_leaf")}])
gs = cc["glacial_shard"]
remplace("glacial_shard", [
    {"type": "drop", "free_repeatable": True, "tip": t("Matériau fin T5 : butin des créatures de glace et coffres enchantés.",
                                                       "T5 fine material: dropped by ice creatures and enchanted chests."), **prov("glacial_shard")},
    {"type": "mystic_forge", "tip": t(
        "Alternative coûteuse, jamais par défaut. Promotion en Forge : 2 Glacial Fragment + 1 Bottle of Elonian Wine + 1 Pile of Luminous Dust + 1 Mystic Crystal (ou 6 fragments + 1 Mystic Binding Agent).",
        "Costly alternative, never the default. Forge promotion: 2 Glacial Fragments + 1 Bottle of Elonian Wine + 1 Pile of Luminous Dust + 1 Mystic Crystal (or 6 fragments + 1 Mystic Binding Agent)."),
     **prov("glacial_shard")}])
gs["best"] = "drop"
gs["best_reason"] = t("voie par défaut : butin. La promotion en Forge est une alternative coûteuse.",
                      "default route: drop. The Forge promotion is a costly alternative.")

# --- glace : base
bic = cc["bowl_of_ice_cream_base"]
remplace("bowl_of_ice_cream_base", chef(0, "bowl_of_ice_cream_base"))
bic["kind"] = "intermediate"; bic["farmable"] = False
for cid, nom, api in [("glass_of_buttermilk", "Glass of Buttermilk", 12137), ("egg", "Egg", 12143),
                      ("bag_of_sugar", "Bag of Sugar", 12155), ("vanilla_bean", "Vanilla Bean", 12234)]:
    nouveau(cid, nom, api, "material", inconnu(),
            {"verified": True, "checked": "2026-10-08", "ref": "boite Recipe de bowl_of_ice_cream_base (ressources/wiki)"})
    arete(cid, "bowl_of_ice_cream_base", 1)

# --- pudding au fruit de la passion
nouveau("bowl_of_tapioca_pudding", "Bowl of Tapioca Pudding", 76840, "intermediate",
        chef(400, "bowl_of_tapioca_pudding"), prov("bowl_of_tapioca_pudding"), False)
nouveau("raspberry_passion_fruit_compote", "Raspberry Passion Fruit Compote", 36782, "intermediate",
        chef(350, "raspberry_passion_fruit_compote"), prov("raspberry_passion_fruit_compote"), False)
arete("bowl_of_tapioca_pudding", "bowl_of_passion_fruit_tapioca_pudding", 1)
arete("raspberry_passion_fruit_compote", "bowl_of_passion_fruit_tapioca_pudding", 1)
cc["bowl_of_passion_fruit_tapioca_pudding"]["kind"] = "intermediate"
for cid, nom, api, parent, n in [
        ("bowl_of_bakers_wet_ingredients", "Bowl of Baker's Wet Ingredients", 12170, "bowl_of_tapioca_pudding", 1),
        ("bag_of_cassava_flour", "Bag of Cassava Flour", 74242, "bowl_of_tapioca_pudding", 1),
        ("raspberry", "Raspberry", 12254, "raspberry_passion_fruit_compote", 1),
        ("passion_fruit", "Passion Fruit", 36731, "raspberry_passion_fruit_compote", 1)]:
    nouveau(cid, nom, api, "material", inconnu(),
            {"verified": True, "checked": "2026-10-08", "ref": f"boite Recipe de {parent} (ressources/wiki)"})
    arete(cid, parent, n)
arete("bag_of_sugar", "raspberry_passion_fruit_compote", 1)
arete("vanilla_bean", "raspberry_passion_fruit_compote", 1)

# --- Janthir Wanderlust : les deux dons manquants
for cid, nom, api, carte, cout in [
        ("gift_of_mistburned_barrens", "Gift of Mistburned Barrens", 104313, "Mistburned Barrens",
         ("2 Vial of Titan Melted Liquid Obsidian + 100 Curious Mursaat Ruin Shard + 250 Ancient Coin + 2 000 Ursus Oblige + 51 000 karma, cœur de renommée terminé",
          "2 Vials of Titan Melted Liquid Obsidian + 100 Curious Mursaat Ruin Shards + 250 Ancient Coins + 2,000 Ursus Oblige + 51,000 karma, renown heart completed")),
        ("gift_of_bava_nisos", "Gift of Bava Nisos", 104896, "Bava Nisos",
         ("125 Curious Mursaat Remnants + 250 Ancient Coin + 2 500 Ursus Oblige + 51 000 karma, carte complétée",
          "125 Curious Mursaat Remnants + 250 Ancient Coins + 2,500 Ursus Oblige + 51,000 karma, map completed"))]:
    nouveau(cid, nom, api, "acquire", [
        {"type": "map_completion", "tip": t(f"Voie par défaut. Récompense de la complétion de la carte {carte}, par personnage.",
                                            f"Default route. Reward for completing the {carte} map, per character."), **prov(cid)},
        {"type": "vendor", "tip": t(f"Alternative, jamais par défaut : {cout[0]}.", f"Alternative, never the default: {cout[1]}."), **prov(cid)}],
        prov(cid))
    cc[cid]["best"] = "map_completion"
    cc[cid]["best_reason"] = t("voie par défaut : la complétion de la carte, gratuite. Le vendeur est une alternative très coûteuse.",
                               "default route: map completion, free. The vendor is a very costly alternative.")
    arete(cid, "gift_of_janthir_wanderlust", 1)

d["_meta"]["last_updated"] = "2026-10-08"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
