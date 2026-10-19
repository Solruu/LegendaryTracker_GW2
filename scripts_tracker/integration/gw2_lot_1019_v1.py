#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Integration du lot de captures du 19/10 (17 pages).

Usage : python3 scripts_tracker/integration/gw2_lot_1019_v1.py SRC DST

1. Precurseurs d'Ad Infinitum poses en chaine. Unbound Wings demande Spirit of
   the Upper Bound, qui se recupere en recyclant Upper Bound, qui demande Bound
   Wings, qui demande Spirit of the Finite Result, recupere sur Finite Result.
   Recettes lues sur finite_result, upper_bound, finite_wings, bound_wings,
   first_order_mist_frame, second_order_mist_frame, mithril_plated_dowel ;
   recyclages sur spirit_of_the_finite_result et spirit_of_the_upper_bound ;
   Solutions dans les Proofs des collections I et II (solution_*.html). Les
   cles a plat d'Ad Infinitum qui portaient ces branches sortent : dragonite,
   empyreal, bloodstone 1 000 et obsidienne 60 (les deux Vision Crystals),
   Pristine Mist Essence 3, ecto 10 (Bound Wings), thermocatalytique 310 ->
   10 (reste : la +10 Agony Infusion de la collection IV, arbre gw2efficiency).
   Ce qui manquait entre : 5 Vials, 10 poussieres cristallines, 5 Globs of
   Coagulated, les deux Mist Frames (soie, cuirs, chevilles).
2. Vial of Condensed Mists Essence : voie lue (butin de fractale, coffre
   hebdomadaire, vendeur INFUZ-5959 en alternative payante).
3. Hydrocatalytic Reagent : prix lu sur sa page (50 notes les 10).
5. Legendary War Insight : apiId 83309 (une epee rare) -> 83584.
4. Aurora : magie non liee des etapes Pristine Blood Ruby (5 000, Natto) et
   Sentient Seed (1 000, Gleam of Sentience) en `cost` d'etape.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-19"
W = "ressources/wiki/"


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = c.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


def cree(cid, nom, api, kind, sources, ref):
    assert cid not in cc, cid
    cc[cid] = {"name": nom, "apiId": api, "kind": kind, "farmable": True, "qty": {},
               "needed_for": [], "sources": sources, "verified": True, "checked": J, "ref": ref}


def craft(page, fr, en):
    return [{"type": "craft_500", "tip": {"fr": fr, "en": en}, "verified": True, "checked": J,
             "ref": f"{W}{page}.html, Recipe"}]


# 1. chaine des precurseurs
cree("finite_result", "Finite Result", 73624, "intermediate",
     craft("finite_result", "Artisanat 500 (dos élevé) : Solution: Finite Result + Pristine Mist Essence + Finite Wings + First Order Mist Frame. Se recycle ensuite (kit élevé) en Spirit of the Finite Result + 5 Balls of Dark Energy.",
           "Crafting 500 (ascended back): Solution: Finite Result + Pristine Mist Essence + Finite Wings + First Order Mist Frame. Then salvaged (ascended kit) into Spirit of the Finite Result + 5 Balls of Dark Energy."),
     f"{W}finite_result.html")
cree("upper_bound", "Upper Bound", 73251, "intermediate",
     craft("upper_bound", "Artisanat 500 (dos élevé) : Solution: Upper Bound + 2 Pristine Mist Essence + Bound Wings + Second Order Mist Frame. Se recycle ensuite en Spirit of the Upper Bound + 9 Balls of Dark Energy.",
           "Crafting 500 (ascended back): Solution: Upper Bound + 2 Pristine Mist Essence + Bound Wings + Second Order Mist Frame. Then salvaged into Spirit of the Upper Bound + 9 Balls of Dark Energy."),
     f"{W}upper_bound.html")
cree("finite_wings", "Finite Wings", 76292, "advanced_craft",
     craft("finite_wings", "Artisanat 500 : Vision Crystal + 5 Vials of Condensed Mists Essence + 10 Piles of Crystalline Dust.",
           "Crafting 500: Vision Crystal + 5 Vials of Condensed Mists Essence + 10 Piles of Crystalline Dust."),
     f"{W}finite_wings.html")
cree("bound_wings", "Bound Wings", 75847, "advanced_craft",
     craft("bound_wings", "Artisanat 500 : 10 ectos + 5 Globs of Coagulated Mists Essence + Vision Crystal + Spirit of the Finite Result.",
           "Crafting 500: 10 ectos + 5 Globs of Coagulated Mists Essence + Vision Crystal + Spirit of the Finite Result."),
     f"{W}bound_wings.html")
cree("first_order_mist_frame", "First Order Mist Frame", 74890, "advanced_craft",
     craft("first_order_mist_frame", "Artisanat 500 : 50 Bolts of Silk + 100 Cured Thick Leather Squares + 75 Mithril Plated Dowels.",
           "Crafting 500: 50 Bolts of Silk + 100 Cured Thick Leather Squares + 75 Mithril Plated Dowels."),
     f"{W}first_order_mist_frame.html")
cree("second_order_mist_frame", "Second Order Mist Frame", 76502, "advanced_craft",
     craft("second_order_mist_frame", "Artisanat 500 : 25 Bolts of Gossamer + 75 Cured Rugged Leather Squares + 50 Orichalcum Plated Dowels.",
           "Crafting 500: 25 Bolts of Gossamer + 75 Cured Rugged Leather Squares + 50 Orichalcum Plated Dowels."),
     f"{W}second_order_mist_frame.html")
cree("mithril_plated_dowel", "Mithril Plated Dowel", 12989, "refined",
     [{"type": "craft", "tip": {"fr": "Raffinage (artisan 350) : 3 Mithril Ingots + 2 Elder Wood Planks.",
                                "en": "Refinement (crafter 350): 3 Mithril Ingots + 2 Elder Wood Planks."},
       "verified": True, "checked": J, "ref": f"{W}mithril_plated_dowel.html, Recipe"}],
     f"{W}mithril_plated_dowel.html")
cree("spirit_of_the_finite_result", "Spirit of the Finite Result", 75066, "acquire",
     [{"type": "salvage", "tip": {"fr": "Récupéré en recyclant Finite Result (seule voie lue sur la page).",
                                  "en": "Salvaged from Finite Result (only route on the page)."},
       "verified": True, "checked": J, "ref": f"{W}spirit_of_the_finite_result.html"}],
     f"{W}spirit_of_the_finite_result.html")
for cid, nom, api, n, coll in (("solution_finite_result", "Solution: Finite Result", 70435, 5, "Ad Infinitum I"),
                               ("solution_upper_bound", "Solution: Upper Bound", 73201, 9, "Ad Infinitum II")):
    cree(cid, nom, api, "acquire",
         [{"type": "achievement_collection",
           "tip": {"fr": f"Dans la Proof de la collection {coll} (garanti). Alternative : Aetherblade Quartermaster (fractale Captain Mai Trin) pour {n} Balls of Dark Energy.",
                   "en": f"Inside the Proof from the {coll} collection (guaranteed). Alternative: Aetherblade Quartermaster (Captain Mai Trin fractal) for {n} Balls of Dark Energy."},
           "verified": True, "checked": J, "ref": f"{W}{cid}.html, Acquisition"}],
         f"{W}{cid}.html")

arete("upper_bound", "spirit_of_the_upper_bound", 1)
arete("solution_upper_bound", "upper_bound", 1)
arete("pristine_mist_essence", "upper_bound", 2)
arete("bound_wings", "upper_bound", 1)
arete("second_order_mist_frame", "upper_bound", 1)
arete("glob_of_ectoplasm", "bound_wings", 10)
arete("glob_of_coagulated_mists_essence", "bound_wings", 5)
arete("vision_crystal", "bound_wings", 1)
arete("spirit_of_the_finite_result", "bound_wings", 1)
arete("finite_result", "spirit_of_the_finite_result", 1)
arete("solution_finite_result", "finite_result", 1)
arete("pristine_mist_essence", "finite_result", 1)
arete("finite_wings", "finite_result", 1)
arete("first_order_mist_frame", "finite_result", 1)
arete("vision_crystal", "finite_wings", 1)
arete("vial_of_condensed_mists_essence", "finite_wings", 5)
arete("dust_crystalline", "finite_wings", 10)
arete("bolt_of_silk", "first_order_mist_frame", 50)
arete("cured_thick_leather_square", "first_order_mist_frame", 100)
arete("mithril_plated_dowel", "first_order_mist_frame", 75)
arete("bolt_of_gossamer", "second_order_mist_frame", 25)
arete("cured_rugged_leather_square", "second_order_mist_frame", 75)
arete("orichalcum_plated_dowel", "second_order_mist_frame", 50)
arete("mithril_ingot", "mithril_plated_dowel", 3)
arete("elder_wood_plank", "mithril_plated_dowel", 2)
su = cc["spirit_of_the_upper_bound"]
su["sources"][0]["tip"] = {"fr": "Récupéré en recyclant Upper Bound (seule voie lue sur la page) ; Upper Bound est posé en chaîne depuis le 19/10.",
                           "en": "Salvaged from Upper Bound (only route on the page); Upper Bound is chained since 19/10."}

LEG = "ad_infinitum"
for cid, v in (("dragonite_ore", 1000), ("empyreal_fragment", 1000), ("bloodstone_dust", 1000),
               ("obsidian_shard", 60), ("pristine_mist_essence", 3), ("glob_of_ectoplasm", 10)):
    c = cc[cid]
    assert c["qty"].pop(LEG) == v, cid
    ov = c.get("qty_overlap_verified") or []
    if LEG in ov:
        ov.remove(LEG)
    if not ov:
        c.pop("qty_overlap_verified", None)
    note = c.get("qty_overlap_note")
    if isinstance(note, dict):
        for lang in ("fr", "en"):
            t = note.get(lang) or ""
            i = t.find("Ad Infinitum")
            if i >= 0:
                note[lang] = t[:i].strip()
        if not any((note.get(l) or "").strip() for l in ("fr", "en")):
            c.pop("qty_overlap_note", None)
    nf = c.get("needed_for")
    if isinstance(nf, list) and LEG in nf and not any(k.split("__")[0] == LEG for k in c["qty"]):
        nf.remove(LEG)
th = cc["thermocatalytic_reagent"]
assert th["qty"][LEG] == 310
th["qty"][LEG] = 10
ec = cc["glob_of_ectoplasm"]
ec["qty_note"]["fr"] += " 19/10 : les 10 de Bound Wings passent par la chaîne (Upper Bound posé), la clé d'Ad Infinitum sort."
ec["qty_note"]["en"] += " 19/10: the 10 from Bound Wings now come through the chain (Upper Bound chained), Ad Infinitum's flat key is gone."

# 2. Vial
v = cc["vial_of_condensed_mists_essence"]
v["sources"] = [
    {"type": "drop", "free_repeatable": True, "cadence": "à volonté", "verified": True, "checked": J,
     "tip": {"fr": "Butin de tout ennemi en fractale (échelle 1+), récompense des modes défi Nightmare et Shattered Observatory, et garanti dans le Fractal Fighter's Cache.",
             "en": "Dropped by any enemy in Fractals (scale 1+), Nightmare and Shattered Observatory CM reward, and guaranteed in the Fractal Fighter's Cache."},
     "ref": f"{W}vial_of_condensed_mists_essence.html, Acquisition"},
    {"type": "vendor", "npc": "INFUZ-5959", "paid_repeatable": True, "verified": True, "checked": J,
     "tip": {"fr": "Alternative payante : INFUZ-5959 (Observatoire de Gardebrume), 30 reliques fractales + 32 pa, maîtrise Follows Advice.",
             "en": "Paid alternative: INFUZ-5959 (Mistlock Observatory), 30 Fractal Relics + 32s, Follows Advice mastery."},
     "ref": f"{W}vial_of_condensed_mists_essence.html, Sold by"}]
v["best"] = "drop"
v["verified"] = True
v["ref"] = f"{W}vial_of_condensed_mists_essence.html"

# 3. Hydrocatalytic
h = cc["hydrocatalytic_reagent"]["sources"][0]
h["tip"] = {"fr": "Acheté chez les maîtres artisans (sauf cuisinier et bijoutier) et le Research Merchant : 50 Research Notes les 10, soit 5 l'unité. Lié au compte : pas de comptoir.",
            "en": "Bought from master craftspeople (except chef and jeweler) and the Research Merchant: 50 Research Notes per 10, i.e. 5 each. Account bound: no trading post."}
h["ref"] = f"{W}hydrocatalytic_reagent.html, Acquisition"

# 4. Aurora, magie non liee
A = d["legendaries"]["aurora"]["collections"]["aurora_1"]
seed = next(i for i in A["items"] if i["bit"] == 0)
assert seed["name"] == "Sentient Seed" and not seed.get("cost")
seed["cost"] = {"unbound_magic": 1000}
seed["cost_ref"] = f"{W}sentient_seed.html, Acquisition (Gleam of Sentience, 1 par compte)"
pbr = next(i for i in A["subcollections"]["aurora_bf"]["items"] if i["name"] == "Pristine Blood Ruby")
assert pbr["cost"] == {"blood_ruby": 50}
pbr["cost"]["unbound_magic"] = 5000
pbr["cost_ref"] = f"{W}pristine_blood_ruby.html, Acquisition (Natto, 1 par compte)"

# 5. Legendary War Insight : l'apiId pointait sur une epee rare (83309,
# « Épée d'éveillé » a l'API) ; la page capturee et l'API disent 83584.
lw = cc["legendary_war_insight"]
assert lw["apiId"] == 83309
lw["apiId"] = 83584
lw["apiId_fix"] = {"was": 83309, "checked": J, "verified": True,
                   "ref": f"{W}legendary_war_insight.html (API 83584) + /v2/items?ids=83309,83584 lu le 19/10"}

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
