#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Decisions A1/A2 d'Antoine du 09/10/2026.

Usage : python3 scripts_tracker/integration/gw2_decisions_a1_0910_v1.py SRC DST

1. `bf_meta` : la meta de Bitterfrost Frontier est Beacons of Koda, liee au
   cycle jour-nuit de la carte (« Storm arrives » entre 13 h et 15 h, heure
   tyrienne, plus d'horaire fixe). Nom, horaire et coffre de The Frozen Maw
   (Wayfarer Foothills) retires. Source : bitterfrost_frontier.html.
2. Funerary Incense : voie la moins chere, sans compter temps ni plafond.
   Toutes les voies partagent gemme + ecto + obsidienne ; reste 5 Trade
   Contracts (coeurs) contre 3 Elegy Mosaics ou 100 Trade Contracts (Primeval
   Steward) ou 1 Crystalline Ingot. 5 Trade Contracts l'emporte : l'arete
   3 Elegy Mosaics devient 5 Trade Contracts. Source : funerary_incense.html.
3. Precurseurs gen3 decomposes : 2 pieces fortifiees + 1 Transcendent Crystal
   + 100 Memory of Aurene (tableau « Used in » de memory_of_aurene.html, les
   16 lignes). Transcendent Crystal = 10 ectos + 1 Eldritch Scroll + 100
   Hydrocatalytic Reagent + 10 Amalgamated Gemstone (transcendent_crystal.html).
   Pieces fortifiees : recette posee pour les 4 capturees (piece d'arme +
   Blessing of the Jade Empress + 20 jade ou 20 resine) ; les autres restent
   des feuilles a capturer, sans deduction par patron.
4. Trefles : la projection en semaines ne compte que la voie par defaut
   (pistes, gratuites ; Coffre du Sorcier, gratuit, saisonnier). Les vendeurs
   payants, le festival et la Forge portent `paid_repeatable: true` (champ
   existant des sources) sur leur source de cadence et sortent du debit.
5. A2 : Inner Nayos = Secrets of the Obscure (Antoine, 09/10). Points de
   passage sources par la page de la meta et lus sur l'API (code recalcule
   depuis l'id) : `sp` Daigo Ward (aetherblade_assault.html), `ew` Junkyard
   (the_gang_war_of_echovald.html : « Jade Tech Waypoint … at the junkyard »).
"""
import base64, json, re, struct, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc, me = d["craft_components"], d["meta_events"]
JOUR = "2026-10-09"
W = "ressources/wiki/"

def code(i):
    return "[&" + base64.b64encode(bytes([4]) + struct.pack("<I", i)).decode() + "]"

# ── 1. bf_meta ─────────────────────────────────────────────────────────────
bf = me["bf_meta"]
for k in ("offsetUTC", "intervalMin", "durationMin", "resetNote", "farmType"):
    bf.pop(k, None)
bf["name"] = "Beacons of Koda"
bf["isTimeless"] = True
bf["timer_notes"] = {
    "fr": "Pas d'horaire fixe : la meta suit le cycle jour-nuit de la carte. « Storm arrives » tombe entre 13 h et 15 h, heure tyrienne.",
    "en": "No fixed schedule: the meta follows the map's day-night cycle. \"Storm arrives\" lands between 1 PM and 3 PM Tyrian time."}
bf["tip"] = {
    "fr": "Meta de la carte : défendre les braseros kodan, puis vaincre le Champion de Jormag. Des Icebound Chests apparaissent après chaque meta réussie, dont certains une fois par jour et par personnage.",
    "en": "Map meta: defend the kodan braziers, then defeat Jormag's Champion. Icebound Chests spawn after every successful meta, some once per day per character."}
bf["ref"] = W + "bitterfrost_frontier.html (sections Events, Map resources ; cycle jour-nuit)"
bf["verified"] = True; bf["checked"] = JOUR

# ── 2. Funerary Incense ────────────────────────────────────────────────────
fi = cc["funerary_incense"]
em, tc = cc["elegy_mosaic"], cc["trade_contract"]
assert em["qty"].pop("funerary_incense") == 3
em["needed_for"] = [x for x in em["needed_for"] if x != "funerary_incense"]
tc.setdefault("qty", {})["funerary_incense"] = 5
if "funerary_incense" not in tc.setdefault("needed_for", []):
    tc["needed_for"].append("funerary_incense")
fi["best"] = "renown_heart"
fi["verified"] = True; fi["checked"] = JOUR
# Meme regle sur la projection : seule la voie des coeurs promet un delai.
for src_c in fi["cadence"]["sources"]:
    if src_c["label"]["en"].startswith(("Crystalline Ingot exchange", "Primeval Steward")):
        src_c["paid_repeatable"] = True
fi["cadence"]["paid_repeatable_ref"] = "décision d'Antoine du 09/10 : voie des cœurs par défaut ; lingot et Intendant primitif = alternatives payantes"
fi["best_reason"] = {
    "fr": "voie la moins chère, temps non compté : 5 Contrats commerciaux par encens, contre 3 Mosaïques d'élégie ou 100 Contrats chez l'Intendant primitif, ou un Lingot cristallin. Gemme, ecto et obsidienne sont communs à toutes les voies.",
    "en": "cheapest route, time not counted: 5 Trade Contracts per incense, against 3 Elegy Mosaics or 100 Trade Contracts from the Primeval Steward, or a Crystalline Ingot. Gemstone, ecto and obsidian are shared by every route."}
fi["ref"] = ((fi.get("ref") + " ; ") if fi.get("ref") else "") + W + "funerary_incense.html (tableau Acquisition : cœurs = 1 gemme + 1 ecto + 1 obsidienne + 5 Trade Contracts) — voie retenue par décision d'Antoine du 09/10 (le moins cher, sans temps ni plafond)"

# Synchro directe : Vision lit desormais les Contrats commerciaux (monnaie 34),
# plus les Mosaiques d'elegie, que plus rien ne lui demande par defaut.
lci = d["_meta"]["direct_sync"]["leg_currency_ids"]["vision"]
lci.pop("elegy", None)
lci["trade_contract"] = 34

# ── 3. Precurseurs gen3 ────────────────────────────────────────────────────
def slug(n):
    return re.sub(r"[^a-z0-9]+", "_", n.lower().replace("'", "")).strip("_")

PREC = [  # (cle, nom, discipline, piece 1, piece 2) — memory_of_aurene.html, « Used in »
    ("dragons_argument", "Dragon's Argument", "Huntsman", "Fortified Precursor Pistol Barrel", "Fortified Precursor Pistol Frame"),
    ("dragons_bite", "Dragon's Bite", "Weaponsmith", "Fortified Precursor Greatsword Blade", "Fortified Precursor Greatsword Hilt"),
    ("dragons_breath", "Dragon's Breath", "Huntsman", "Fortified Precursor Torch Head", "Fortified Precursor Torch Handle"),
    ("dragons_claw_weapon", "Dragon's Claw", "Weaponsmith", "Fortified Precursor Dagger Blade", "Fortified Precursor Dagger Hilt"),
    ("dragons_fang", "Dragon's Fang", "Weaponsmith", "Fortified Precursor Sword Blade", "Fortified Precursor Sword Hilt"),
    ("dragons_flight", "Dragon's Flight", "Huntsman", "Fortified Precursor Longbow Stave", "Fortified Precursor String"),
    ("dragons_gaze", "Dragon's Gaze", "Artificer", "Fortified Precursor Focus Core", "Fortified Precursor Focus Casing"),
    ("dragons_insight", "Dragon's Insight", "Artificer", "Fortified Precursor Staff Head", "Fortified Precursor Staff Shaft"),
    ("dragons_persuasion", "Dragon's Persuasion", "Huntsman", "Fortified Precursor Rifle Barrel", "Fortified Precursor Rifle Stock"),
    ("dragons_rending", "Dragon's Rending", "Weaponsmith", "Fortified Precursor Axe Head", "Small Fortified Precursor Haft"),
    ("dragons_scale", "Dragon's Scale", "Weaponsmith", "Fortified Precursor Shield Boss", "Fortified Precursor Shield Backing"),
    ("dragons_tail", "Dragon's Tail", "Weaponsmith", "Fortified Precursor Mace Head", "Small Fortified Precursor Haft"),
    ("dragons_voice", "Dragon's Voice", "Huntsman", "Fortified Precursor Horn", "Fortified Precursor Warhorn Mouthpiece"),
    ("dragons_weight", "Dragon's Weight", "Weaponsmith", "Fortified Precursor Hammer Head", "Large Fortified Precursor Haft"),
    ("dragons_wing", "Dragon's Wing", "Huntsman", "Fortified Precursor Short Bow Stave", "Fortified Precursor String"),
    ("dragons_wisdom", "Dragon's Wisdom", "Artificer", "Fortified Precursor Scepter Core", "Fortified Precursor Scepter Rod"),
]
# Pieces dont la recette est capturee : (cle du composant d'arme, materiau, id objet, page)
RECETTES = {
    "Fortified Precursor Axe Head": ("deldrimor_steel_axe_blade", "chunk_of_pure_jade", 96398),
    "Fortified Precursor Greatsword Blade": ("deldrimor_steel_greatsword_blade", "chunk_of_pure_jade", 97235),
    "Fortified Precursor Greatsword Hilt": ("deldrimor_steel_greatsword_hilt", "chunk_of_pure_jade", 97366),
    "Small Fortified Precursor Haft": ("small_spiritwood_haft", "chunk_of_petrified_echovald_resin", 95656),
}

def lien(enfant, parent, n):
    c = cc[enfant]
    c.setdefault("qty", {})
    c["qty"][parent] = c["qty"].get(parent, 0) + n
    if parent not in c.setdefault("needed_for", []):
        c["needed_for"].append(parent)

def feuille(cle, nom, api=None, src=None, ref=None):
    if cle in cc:
        return
    cc[cle] = {"name": nom, "kind": "acquire", "farmable": True, "qty": {}, "needed_for": [],
               "sources": [src] if src else [], "ref": ref, "verified": True, "checked": JOUR}
    if api: cc[cle]["apiId"] = api

feuille("memory_of_aurene", "Memory of Aurene", 96088,
        {"type": "meta_drop", "free_repeatable": True, "tip": {
            "fr": "Coffres de fin de méta (Soo-Won, Kralkatorrik, Dragonstorm : 1 fois par jour et par compte), étapes d'histoire rejouées (LW3, LW4), coffre de récompense d'End of Dragons (25).",
            "en": "Meta finale chests (Soo-Won, Kralkatorrik, Dragonstorm: once per day per account), replayed story steps (LW3, LW4), End of Dragons Reward Coffer (25)."}},
        W + "memory_of_aurene.html (Acquisition)")
feuille("chunk_of_petrified_echovald_resin", "Chunk of Petrified Echovald Resin", 96471,
        {"type": "acquire", "tip": {"fr": "Matériau d'End of Dragons.", "en": "End of Dragons material."}},
        "gw2_materials_ref.json (id 96471)")
cc["transcendent_crystal"] = {
    "name": "Transcendent Crystal", "apiId": 95913, "kind": "advanced_craft", "farmable": False,
    "qty": {}, "needed_for": [],
    "sources": [{"type": "craft", "tip": {"fr": "Artisanat 500 (Artificier, Forgeron d'armes ou Chasseur).", "en": "Crafted at 500 (Artificer, Weaponsmith or Huntsman)."}}],
    "ref": W + "transcendent_crystal.html (boîte Recipe)", "verified": True, "checked": JOUR}
for enfant, n in (("glob_of_ectoplasm", 10), ("eldritch_scroll", 1), ("hydrocatalytic_reagent", 100), ("amalgamated_gemstone", 10)):
    lien(enfant, "transcendent_crystal", n)

pieces = {}
for cle, nom, disc, p1, p2 in PREC:
    pr = cc[cle]
    pr["kind"] = "advanced_craft"; pr["farmable"] = False
    pr["sources"] = [{"type": "craft", "tip": {
        "fr": f"{disc} 500, recette apprise par la Sheaf of Recipes: {nom}. Aussi en coffre (Prismatic Precursor Selection Box, coffres de la Bataille de la Mer de Jade).",
        "en": f"{disc} 500, recipe learned from Sheaf of Recipes: {nom}. Also from chests (Prismatic Precursor Selection Box, Battle for the Jade Sea coffers)."},
        "verified": True, "checked": JOUR, "ref": W + "memory_of_aurene.html (Used in) + " + W + cle.replace("_weapon", "") + ".html"}]
    pr["ref"] = W + "memory_of_aurene.html, tableau « Used in »"
    pr["verified"] = True; pr["checked"] = JOUR
    for p in (p1, p2):
        pk = slug(p)
        pieces.setdefault(pk, p)
        if pk not in cc:
            rec = RECETTES.get(p)
            cc[pk] = {"name": p, "kind": "advanced_craft", "farmable": False, "qty": {}, "needed_for": [],
                      "sources": [{"type": "craft", "tip": {
                          "fr": "Pièce fortifiée (artisanat 500)." + ("" if rec else " Recette non capturée : page à verser."),
                          "en": "Fortified part (crafted at 500)." + ("" if rec else " Recipe not captured: page to add.")}}],
                      "ref": (W + pk + ".html (boîte Recipe)") if rec else
                             ("nom lu dans " + W + "memory_of_aurene.html (Used in) ; recette non capturee, "
                              "aucune deduction par patron — page listee dans PAGES_A_CAPTURER"),
                      "verified": bool(rec), "checked": JOUR}
            if rec:
                arme, mat, api = rec
                cc[pk]["apiId"] = api
                lien(arme, pk, 1); lien("blessing_of_the_jade_empress", pk, 1); lien(mat, pk, 20)
        lien(pk, cle, 1)
    lien("transcendent_crystal", cle, 1)
    lien("memory_of_aurene", cle, 100)

# ── 4. Trefles : voie par defaut seule dans le debit ──────────────────────
for s in cc["mystic_clover"]["cadence"]["sources"]:
    en = s["label"]["en"]
    if en.startswith("PvP / WvW reward tracks") or en == "Wizard's Vault":
        s.pop("paid_repeatable", None)
    else:
        s["paid_repeatable"] = True
cc["mystic_clover"]["cadence"]["paid_repeatable_ref"] = (
    "décision d'Antoine du 09/10 : la voie par défaut est la moins chère sans compter le temps "
    "(pistes gratuites, Coffre du Sorcier) ; les sources payantes sortent du débit hebdomadaire")

# ── 5. A2 ──────────────────────────────────────────────────────────────────
for k in ("in", "zak"):
    me[k]["acces"].update({"ref": "Antoine, 09/10/2026 : Inner Nayos fait partie de Secrets of the Obscure",
                           "verified": True, "checked": JOUR})
me["sp"].update({"waypoint": "Daigo Ward Waypoint", "wpCode": code(3429),
                 "ref": me["sp"].get("ref", "") + " ; point de passage : " + W + "aetherblade_assault.html (canon de rattrapage au nord-ouest du point) ; id 3429 lu sur /v2/continents/1/floors/1/regions/37/maps/1442/pois"})
me["ew"].update({"waypoint": "Junkyard Waypoint", "wpCode": code(3211),
                 "ref": me["ew"].get("ref", "") + " ; point de passage : " + W + "the_gang_war_of_echovald.html (« Jade Tech Waypoint … at the junkyard ») ; id 3211 lu sur /v2/continents/1/floors/1/regions/37/maps/1452/pois"})

d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"precurseurs : 16 ; pieces : {len(pieces)} dont {len(RECETTES)} a recette ; sp {code(3429)} ; ew {code(3211)}")
