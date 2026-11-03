#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Couts lus sur les captures du 03/11 (retour du wiki).

Usage : python3 scripts_tracker/integration/gw2_retour_wiki_couts_v1.py SRC DST

1. Gift of the Seas (gift_of_the_seas.html, Sold by : onze vendeurs, un seul
   prix) = 1 Gift of the Tides + 2 Gift of Condensed Magic + 2 Gift of
   Condensed Might + 2 Gift of Research. Selachimorpha portait les trois dons
   en cles a plat (« via its Gift of the Seas », note de gift_of_condensed_
   magic) : ils descendent sur le don, total inchange, et le Gift of the
   Tides, oublie, s'ajoute (+1).
2. Dons rendus par un succes, revendus ensuite. Trois pages disent la meme
   chose : la table vendeur exige le succes (« Requires the achievement X »),
   et ce succes REND l'objet (« Reward: »). Le premier exemplaire est donc la
   recompense de la collection, deja suivie dans le tracker ; le vendeur ne
   sert qu'aux copies suivantes. Le cout vendeur sort du total et devient une
   alternative payante :
   - Gift of the Hylek — Radiance of the Sun God (summer_sungod) ; vendeur
     Shaman Palak : 200 or + 250 Sun Beads + 300 000 karma ;
   - Binding of the Dragon — Unknown Nightmares: Experiments in the Shadows
     (orrax_experiments) ; la passe W4 du 08/10 avait compte le vendeur
     (25 Dragonite Ore + 22 500 karma + 5 or) : retire ;
   - Gift of Patience — Coalescence III: Culmination (coalescence_3) ;
     100 Magnetite Shards + 1 or : retire.
3. Mist Pendant (mist_pendant.html) : quatre prix, un seul achat — meme
   modele que Mist Band (`alt_groups`, defaut fractales, joueur PvE). La voie
   fractale (2 Integrated Fractal Matrix + 100 Pristine Fractal Relics) etait
   a plat sur Transcendence (100 reliques immaculees, 20 Stabilizing Matrix
   pour les deux matrices), sans les 30 Fractal Relics des matrices : elle
   passe sur l'option, et les reliques s'ajoutent (+30).
4. Sheet of Aurillium (sheet_of_aurillium.html) : 5 Lump of Aurillium chez
   l'Exalted Mastery Vendor (+ 21 pa 12 pc, pieces non posees comme partout).
   Sapphire Crystal (sapphire_crystal.html, boite Recipe) : 1 Pile of
   Luminous Dust + 2 Sapphire Shard, meme forme que Ruby / Emerald Crystal ;
   Sapphire Shard cree (gw2_materials_ref.json, id 24876).
5. Couts d'etape des collections gen1 / gen2 : gw2_collections_armes_v1
   ecartait tout ingredient qui est un objet d'etape QUELQUE PART — or la
   Boule d'ectoplasme, l'Eclat d'obsidienne et la Poussiere cristalline sont
   des objets d'etape des collections « Legendary Weapon » d'AUTRES armes.
   Ecarte a tort sur 16 lignes de 14 etapes (Aurillium Capsule : 100 feuilles
   + 1 lingot + 10 reactifs, sans ses 5 boules). La regle devient : seul un
   objet d'etape des collections de precurseur du MEME legendaire est ecarte
   (pas ceux deposes dans sa collection « Legendary Weapon »).
"""
import json, re, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-11-03"
W = "ressources/wiki/"
AP = "ressources/api/"


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = c.setdefault("needed_for", [])
    if isinstance(nf, list) and parent not in nf:
        nf.append(parent)


def retire(enfant, parent, n):
    c = cc[enfant]
    assert c["qty"].pop(parent) == n, (enfant, parent)
    nf = c.get("needed_for")
    if isinstance(nf, list) and parent in nf:
        nf.remove(parent)


# 1. Gift of the Seas
for k in ("gift_of_research", "gift_of_condensed_magic", "gift_of_condensed_might"):
    retire(k, "selachimorpha", 2)
    arete(k, "gift_of_the_seas", 2)
arete("gift_of_the_tides", "gift_of_the_seas", 1)
cc["gift_of_the_seas"]["sources"] = [{
    "type": "vendor", "npc": "Acolyte of Balance Dexx / Astral Ward Agent Snarlcrow / Canach / …",
    "map": "Leyspring Hollows, Shipwreck Strand, Starlit Weald, Eternity's Garden",
    "tip": {"fr": "1 Gift of the Tides + 2 Gift of Condensed Magic + 2 Gift of Condensed Might + 2 Gift of Research, même prix chez les onze vendeurs (Dexx et Snarlcrow à Leyspring Hollows, Canach et Castaway Agnes à la Rive aux épaves, Captain Emund au Bois étoilé…).",
            "en": "1 Gift of the Tides + 2 Gift of Condensed Magic + 2 Gift of Condensed Might + 2 Gift of Research, same price at all eleven vendors (Dexx and Snarlcrow in Leyspring Hollows, Canach and Castaway Agnes in Shipwreck Strand, Captain Emund in Starlit Weald…)."},
    "verified": True, "checked": J, "ref": f"{W}gift_of_the_seas.html, Sold by"}]
cc["gift_of_the_seas"]["ref"] = f"{W}gift_of_the_seas.html"
n = cc["gift_of_condensed_magic"].get("note")
if isinstance(n, dict) and n.get("fr"):
    n["fr"] = n["fr"].replace("Selachimorpha consomme 2 gifts condenses de chaque via son Gift of the Seas",
                              "Selachimorpha consomme 2 gifts condenses de chaque via son Gift of the Seas (arete posee le 03/11)")

# 2. Dons rendus par un succes
RECOMPENSES = {
    "gift_of_the_hylek": ("summer_sungod", "Radiance of the Sun God", "Shaman Palak (Hullgarden, Shipwreck Strand)",
                          {}, "200 or + 250 Sun Beads + 300 000 karma", "200 gold + 250 Sun Beads + 300,000 karma"),
    "binding_of_the_dragon": ("orrax_experiments", "Unknown Nightmares: Experiments in the Shadows",
                              "Gharr Leadclaw / Portable Wizard's Tower Exchange / Wizard's Gobbler",
                              {"dragonite_ore": 25, "karma": 22500, "gold_coin": 5},
                              "25 Dragonite Ore + 22 500 karma + 5 or", "25 Dragonite Ore + 22,500 karma + 5 gold"),
    "gift_of_patience": ("coalescence_3", "Coalescence III: Culmination",
                         "Scholar Glenna / Qadim's Portable Magnetite Shard Exchange / Wizard's Gobbler",
                         {"magnetite_shard": 100}, "100 Magnetite Shards + 1 or", "100 Magnetite Shards + 1 gold"),
}
for k, (col, succes, pnj, enfants, fr, en) in RECOMPENSES.items():
    for e, q in enfants.items():
        retire(e, k, q)
    cc[k]["sources"] = [
        {"type": "achievement_collection", "collection": col, "verified": True, "checked": J,
         "ref": f"{W}{k}.html, Achievements (« Reward: »)",
         "tip": {"fr": f"Récompense de la collection « {succes} » (onglet Collections) : le premier exemplaire ne coûte que la collection.",
                 "en": f"Reward of the \"{succes}\" collection (Collections tab): the first copy costs only the collection."}},
        {"type": "vendor", "npc": pnj, "paid_repeatable": True, "verified": True, "checked": J,
         "ref": f"{W}{k}.html, Sold by (« Requires the achievement {succes} »)",
         "tip": {"fr": f"Copies suivantes, une fois la collection faite : {fr}. Alternative, jamais comptée.",
                 "en": f"Further copies, once the collection is done: {en}. Alternative, never counted."}}]
    cc[k]["best"] = "achievement_collection"
    cc[k]["ref"] = f"{W}{k}.html"

# 3. Mist Pendant
TR, MP = "transcendence", "mist_pendant"
retire("pristine_fractal_relic", TR, 100)
retire("stabilizing_matrix", TR, 20)
sm = cc["stabilizing_matrix"]
ov = sm.get("qty_overlap_verified")
if isinstance(ov, list) and TR in ov:
    ov.remove(TR)
    if not ov:
        sm.pop("qty_overlap_verified")
        sm.pop("qty_overlap_note", None)
assert "pvp_tournament_voucher" not in cc
cc["pvp_tournament_voucher"] = {
    "name": "PvP Tournament Voucher", "apiId": 46, "kind": "currency", "farmable": True,
    "qty": {}, "needed_for": [],
    "sources": [{"type": "pvp", "verified": True, "checked": J, "ref": "gw2_currencies_ref.json (id 46, description)",
                 "tip": {"fr": "Gagné dans les tournois automatisés mensuels (JcJ).",
                         "en": "Earned in monthly automated tournaments (PvP)."}}],
    "verified": True, "checked": J, "ref": "gw2_currencies_ref.json (id 46)"}
VOIES = {
    "mist_pendant_route_fractals": ({"fr": "Mist Pendant — fractales (BUY-2046 PFR)", "en": "Mist Pendant — fractals (BUY-2046 PFR)"},
                                    {"pristine_fractal_relic": 100, "integrated_fractal_matrix": 2},
                                    "BUY-2046 PFR, Observatoire de Gardebrume : 100 reliques immaculées + 2 Integrated Fractal Matrix.",
                                    "BUY-2046 PFR, Mistlock Observatory: 100 Pristine Fractal Relics + 2 Integrated Fractal Matrix."),
    "mist_pendant_route_pvp": ({"fr": "Mist Pendant — JcJ (vendeurs de ligue)", "en": "Mist Pendant — PvP (league vendors)"},
                               {"ascended_shard_of_glory": 125, "shard_of_glory": 170},
                               "Ascended Armor League Vendor / League Armor Vendor (Hall of Memories) : 125 Ascended Shards of Glory + 170 Shards of Glory.",
                               "Ascended Armor League Vendor / League Armor Vendor (Hall of Memories): 125 Ascended Shards of Glory + 170 Shards of Glory."),
    "mist_pendant_route_tournament": ({"fr": "Mist Pendant — JcJ (tournois automatisés)", "en": "Mist Pendant — PvP (automated tournaments)"},
                                      {"pvp_tournament_voucher": 4},
                                      "Harald / Lambdin the Latish (Hall of Memories) : 4 PvP Tournament Vouchers.",
                                      "Harald / Lambdin the Latish (Hall of Memories): 4 PvP Tournament Vouchers."),
    "mist_pendant_route_wvw": ({"fr": "Mist Pendant — McM (Skirmish Supervisor)", "en": "Mist Pendant — WvW (Skirmish Supervisor)"},
                               {"memory_of_battle": 250, "skirmish_claim_ticket": 260},
                               "Skirmish Supervisor (McM), Lionguard (Arche du Lion) ou Mercenary (Armistice Bastion) : 250 Memory of Battle + 260 tickets d'escarmouche.",
                               "Skirmish Supervisor (WvW), Lionguard (Lion's Arch) or Mercenary (Armistice Bastion): 250 Memory of Battle + 260 Skirmish Claim Tickets."),
}
for cid, (nom, cout, fr, en) in VOIES.items():
    assert cid not in cc
    cc[cid] = {"name": nom, "kind": "purchase", "farmable": True, "qty": {}, "needed_for": [],
               "wiki": "Mist_Pendant",
               "sources": [{"type": "vendor", "tip": {"fr": fr, "en": en}, "verified": True,
                            "checked": J, "ref": f"{W}mist_pendant.html, Acquisition"}],
               "verified": True, "checked": J, "ref": f"{W}mist_pendant.html"}
    for enfant, q in cout.items():
        arete(enfant, cid, q)
assert "mist_pendant_route" not in d["alt_groups"]
d["alt_groups"]["mist_pendant_route"] = {
    "qty": 1, "options": list(VOIES), "default": "mist_pendant_route_fractals", "targets": [MP],
    "label": {"fr": "Mist Pendant — un seul achat, selon ton mode de jeu",
              "en": "Mist Pendant — one purchase, by game mode"},
    "note": {"fr": "Quatre prix pour le même pendentif. Fractales par défaut (joueur PvE, même choix que Mist Band).",
             "en": "Four prices for the same pendant. Fractals by default (PvE player, same choice as Mist Band)."},
    "ref": f"{W}mist_pendant.html, Acquisition (neuf vendeurs, quatre prix)",
    "verified": True, "checked": J}
cc[MP]["sources"] = [{"type": "vendor", "tip": {
    "fr": "Un seul achat, quatre prix au choix : fractales, JcJ (ligue ou tournois) ou McM (choix « mode de jeu »).",
    "en": "One purchase, four prices to pick from: fractals, PvP (league or tournaments) or WvW (\"game mode\" choice)."},
    "verified": True, "checked": J, "ref": f"{W}mist_pendant.html, Acquisition"}]
cc[MP]["ref"] = f"{W}mist_pendant.html"

# 4. Sheet of Aurillium, Sapphire Crystal
arete("lump_of_aurillium", "sheet_of_aurillium", 5)
cc["sheet_of_aurillium"]["sources"] = [{
    "type": "vendor", "npc": "Exalted Mastery Vendor", "map": "Noble Ledges (Auric Basin), Verdant Brink",
    "tip": {"fr": "5 Lump of Aurillium + 21 pa 12 pc l'unité. Maîtrise Exalted Acceptance requise, et seulement pendant la collection Astralaria III: The Mechanism.",
            "en": "5 Lump of Aurillium + 21 s 12 c each. Requires the Exalted Acceptance mastery, and only while the Astralaria III: The Mechanism collection is active."},
    "verified": True, "checked": J, "ref": f"{W}sheet_of_aurillium.html, Acquisition"}]
cc["sheet_of_aurillium"]["ref"] = f"{W}sheet_of_aurillium.html"
assert "sapphire_shard" not in cc
cc["sapphire_shard"] = {
    "name": "Sapphire Shard", "apiId": 24876, "kind": "material", "farmable": True, "qty": {}, "needed_for": [],
    "sources": [{"type": "unknown", "verified": True, "checked": J,
                 "ref": f"{W}sapphire_crystal.html (boite Recipe) ; identite depuis gw2_materials_ref.json (apiId 24876)",
                 "tip": {"fr": "Ingrédient de la recette du Sapphire Crystal ; voie d'obtention à lire sur sa page.",
                         "en": "Ingredient of the Sapphire Crystal recipe; acquisition route to read on its page."}}],
    "verified": True, "checked": J, "ref": "gw2_materials_ref.json (id 24876)"}
arete("dust_luminous", "sapphire_crystal", 1)
arete("sapphire_shard", "sapphire_crystal", 2)
cc["sapphire_crystal"]["sources"][0] = {
    "type": "craft", "verified": True, "checked": J, "ref": f"{W}sapphire_crystal.html, Recipe",
    "tip": {"fr": "Joaillier 275 : 2 Sapphire Shard + 1 Pile of Luminous Dust (même forme que Ruby et Emerald Crystal). Tombe aussi de nombreux coffres et nœuds (Gathered from).",
            "en": "Jeweler 275: 2 Sapphire Shard + 1 Pile of Luminous Dust (same shape as Ruby and Emerald Crystal). Also drops from many chests and nodes (Gathered from)."}}

# 5. Couts d'etape : ingredients ecartes a tort
WA = json.loads(Path(AP + "api_collections_armes_20261020.json").read_text(encoding="utf-8"))
api = {c["apiId"]: k for k, c in cc.items() if isinstance(c.get("apiId"), int) and c["apiId"] > 100}
ARMES = [l for l in d["legendaries"] if l.startswith(("gen1_", "gen2_"))]
bits_de = {}
for l in ARMES:
    s = set()
    for ck, c in (d["legendaries"][l].get("collections") or {}).items():
        if ck.startswith("legendary_weapon_"):
            continue  # objets deposes pour l'arme finale, pas des objets d'etape
        s |= {b for b in WA["bitItems"][str(c["id"])] if isinstance(b, int)}
    bits_de[l] = s
# l'ensemble que la v1 ecartait : objets d'etape de TOUTES les collections
tous = {b for l in ARMES for c in (d["legendaries"][l].get("collections") or {}).values()
        for b in WA["bitItems"][str(c["id"])] if isinstance(b, int)}
ajouts = []
for l in ARMES:
    for ck, col in (d["legendaries"][l].get("collections") or {}).items():
        if ck.startswith("legendary_weapon_"):
            continue
        bl = WA["bitItems"][str(col["id"])]
        for st in col["items"]:
            b = bl[st["bit"]] if st["bit"] < len(bl) else None
            r = WA["rec"].get(str(b)) if isinstance(b, int) else None
            if not isinstance(r, list) or str(r[0]) not in WA["recipes"]:
                continue
            for g in WA["recipes"][str(r[0])]["ing"]:
                x = g["item_id"]
                if x in tous and x not in bits_de[l] and x in api:
                    k = api[x]
                    cost = st.setdefault("cost", {})
                    assert k not in cost, (l, ck, st["bit"], k)
                    cost[k] = g["count"]
                    st["cost_ref"] = (st.get("cost_ref", "") + f" ; {k} : ingredient de la recette {r[0]}, ecarte a tort le 24/10").lstrip(" ;")
                    ajouts.append((l, ck, st["bit"], k, g["count"]))
for a in ajouts:
    print("etape", *a)
assert len(ajouts) == 16, len(ajouts)

for k in ("gift_of_the_seas", "gift_of_the_hylek", "binding_of_the_dragon", "gift_of_patience", MP):
    cc[k]["verified"], cc[k]["checked"] = True, J
d["_meta"]["version"] = "v251"
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
