#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Captures du 07/10 : intermediaires d'Orrax, Ars Goetia, Unbound Wings.

Usage : python3 scripts_tracker/integration/gw2_captures_0710_v1.py SRC DST

Recettes et vendeurs lus sur les captures (icones lues par leur `alt`).
Structure existante seulement : les couts vendeur payes dans une monnaie du
modele (karma, Difluorite) sont des aretes, comme `karma -> stella_radians` ;
les couts en cuivre restent en texte (`gold_coin` compte en pieces d'or).

Orrax, deuxieme niveau (decision d'Antoine : decomposer) :
  bowl_of_ascalonian_salad x3/salade  <- Head of Lettuce, Beet,
                                         Bottle of Ascalonian Dressing (a capturer)
  jar_of_red_curry_paste x2/satay     <- Lime, Pile of Stirfry Spice Mix,
                                         Cayenne Pepper, Lemongrass
  pile_of_tangy_seasoning x1/satay    <- 2 Onion, 1 Packet of Salt, 2 Head of Garlic
  bottle_of_coconut_milk x1/satay     <- Malor : 1 Difluorite Crystal + 249 karma
  bottle_of_rice_wine x1/brochette    <- tavernes : 16 cuivre
  cup_of_lotus_fries x1/steak         <- Jar of Vegetable Oil, Pile of Salt and
                                         Pepper, Lotus Root
Ars Goetia (precurseur d'Ipos) : + Spiritwood Focus Casing (5 poussieres
cristallines, 3 planches spiritwood, 50 reactifs), + Spiritwood Focus Core,
+ Visionary Inscription.
Unbound Wings : + Spirit of the Upper Bound (recupere sur Upper Bound) ;
Vision Crystal laisse non relie (double compte, voir plus bas).
Sun Bead : 21 karma deviennent l'arete `karma -> sun_bead` (seule voie).
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

def arete(enfant, parent, n):
    q = cc[enfant].setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = cc[enfant].setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)

def nouveau(cid, nom, api, kind, sources, ref, farmable=True):
    assert cid not in cc and (api is None or api not in apis), (cid, apis.get(api))
    cc[cid] = {"name": nom, "kind": kind, "farmable": farmable, "needed_for": [],
               "qty": {}, "sources": sources, **prov(ref)}
    if api:
        cc[cid]["apiId"] = api

CHEF = lambda r, f: [{"type": "craft", "tip": t(
    f"Cuisine (Chef {r}). Recette lue sur sa page.",
    f"Cooking (Chef {r}). Recipe read from its page."), **prov(f)}]
INCONNU = lambda: [{"type": "unknown", "tip": t(
    "Ingrédient posé depuis la recette de son plat (07/10/2026). Voie d'obtention à lire sur sa page.",
    "Ingredient added from its dish's recipe (07/10/2026). Acquisition path to read on its page.")}]

# --- Orrax, intermediaires
nouveau("bowl_of_ascalonian_salad", "Bowl of Ascalonian Salad", 12196, "intermediate",
        CHEF(125, "bowl_of_ascalonian_salad"), "bowl_of_ascalonian_salad", False)
nouveau("jar_of_red_curry_paste", "Jar of Red Curry Paste", 12542, "intermediate",
        CHEF(400, "jar_of_red_curry_paste"), "jar_of_red_curry_paste", False)
nouveau("pile_of_tangy_seasoning", "Pile of Tangy Seasoning", 12181, "intermediate",
        CHEF(100, "pile_of_tangy_seasoning"), "pile_of_tangy_seasoning", False)
nouveau("cup_of_lotus_fries", "Cup of Lotus Fries", 12472, "intermediate",
        CHEF(400, "cup_of_lotus_fries"), "cup_of_lotus_fries", False)
nouveau("bottle_of_coconut_milk", "Bottle of Coconut Milk", 87289, "acquire", [{
    "type": "vendor", "npc": "Malor", "map": "The Ruined Paths, Sandswept Isles", "paid_repeatable": True,
    "cost": t("1 Difluorite Crystal + 249 karma", "1 Difluorite Crystal + 249 karma"),
    "tip": t("Seule voie : Malor (Sandswept Isles), 1 cristal de difluorite + 249 karma l'unité.",
             "Only route: Malor (Sandswept Isles), 1 Difluorite Crystal + 249 karma each."),
    **prov("bottle_of_coconut_milk")}], "bottle_of_coconut_milk", False)
nouveau("bottle_of_rice_wine", "Bottle of Rice Wine", 8576, "acquire", [{
    "type": "vendor", "npc": "taverniers (Bartender, Barkeep...)", "paid_repeatable": True,
    "cost": t("16 cuivre", "16 copper"),
    "tip": t("Vendue par les taverniers des capitales et de nombreuses cartes : 16 cuivre. Négligeable en or.",
             "Sold by bartenders in capitals and many maps: 16 copper. Negligible in gold."),
    **prov("bottle_of_rice_wine")}], "bottle_of_rice_wine", False)
arete("bowl_of_ascalonian_salad", "bowl_of_black_pepper_cactus_salad", 3)
arete("jar_of_red_curry_paste", "bowl_of_poultry_satay", 2)
arete("pile_of_tangy_seasoning", "bowl_of_poultry_satay", 1)
arete("bottle_of_coconut_milk", "bowl_of_poultry_satay", 1)
arete("bottle_of_rice_wine", "meaty_asparagus_skewer", 1)
arete("cup_of_lotus_fries", "plate_of_orrian_steak_frittes", 1)
arete("difluorite_crystal", "bottle_of_coconut_milk", 1)
arete("karma", "bottle_of_coconut_milk", 249)

# --- Orrax, troisieme niveau
for cid, nom, api, parent, n in [
        ("head_of_lettuce", "Head of Lettuce", 12238, "bowl_of_ascalonian_salad", 1),
        ("beet", "Beet", 12161, "bowl_of_ascalonian_salad", 1),
        ("lime", "Lime", 12339, "jar_of_red_curry_paste", 1),
        ("pile_of_stirfry_spice_mix", "Pile of Stirfry Spice Mix", 12496, "jar_of_red_curry_paste", 1),
        ("lemongrass", "Lemongrass", 12546, "jar_of_red_curry_paste", 1),
        ("lotus_root", "Lotus Root", 12510, "cup_of_lotus_fries", 1)]:
    nouveau(cid, nom, api, "material", INCONNU(), parent)
    cc[cid]["ref"] = f"boite Recipe de {parent} (ressources/wiki, capture du 07/10/2026)"
    arete(cid, parent, n)
for cid, parent, n in [("cayenne_pepper", "jar_of_red_curry_paste", 1),
                       ("onion", "pile_of_tangy_seasoning", 2), ("packet_of_salt", "pile_of_tangy_seasoning", 1),
                       ("head_of_garlic", "pile_of_tangy_seasoning", 2),
                       ("jar_of_vegetable_oil", "cup_of_lotus_fries", 1),
                       ("pile_of_salt_and_pepper", "cup_of_lotus_fries", 1)]:
    arete(cid, parent, n)

# --- Ars Goetia
nouveau("spiritwood_focus_casing", "Spiritwood Focus Casing", 45883, "advanced_craft", [{
    "type": "craft", "tip": t("Artificier 500, appris automatiquement.", "Artificer 500, learned automatically."),
    **prov("spiritwood_focus_casing")}], "spiritwood_focus_casing", False)
arete("spiritwood_focus_casing", "ars_goetia", 1)
arete("dust_crystalline", "spiritwood_focus_casing", 5)
arete("spiritwood_plank", "spiritwood_focus_casing", 3)
arete("thermocatalytic_reagent", "spiritwood_focus_casing", 50)
arete("spiritwood_focus_core", "ars_goetia", 1)
arete("visionary_inscription", "ars_goetia", 1)

# --- Unbound Wings
nouveau("spirit_of_the_upper_bound", "Spirit of the Upper Bound", 70642, "acquire", [{
    "type": "salvage", "tip": t("Récupéré en recyclant Upper Bound (seule voie lue sur la page).",
                                "Salvaged from Upper Bound (only route on the page)."),
    **prov("spirit_of_the_upper_bound")}], "spirit_of_the_upper_bound", False)
arete("spirit_of_the_upper_bound", "unbound_wings", 1)
# Vision Crystal NON relie : les aretes directes d'Ad Infinitum (bloodstone,
# dragonite, empyreal 1500, obsidienne 90), aplaties depuis GW2Efficiency,
# portent deja ses 500 — le relier les compterait deux fois (audit :
# « atteint a la fois en direct et via »). A faire avec la decomposition de
# ces aretes plates.

# --- Sun Bead : karma en arete, comme la noix de coco
arete("karma", "sun_bead", 21)

d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
