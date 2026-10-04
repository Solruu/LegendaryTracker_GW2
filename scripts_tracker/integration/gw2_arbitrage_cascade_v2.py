#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lot C1 du PLAN_RESTANT : les 47 cas « deja compte par cascade » d'ARBITRAGES.

Usage : python3 scripts_tracker/integration/gw2_arbitrage_cascade_v2.py SRC DST

Relus un par un sur les captures. La famille melangeait cinq situations, et
presque aucune n'etait un double compte.

1. GROUPE DE CHOIX INCOMPLET. Tribute to the Man o' War a exactement la table
   vendeur de Tribute to Arah (20 au choix de six monnaies) mais manquait a
   `alt_groups.tribut_20`. Il y entre. Les tips « recette non capturee » des
   tributs deja groupes sont remplaces par celui de Tribute to the Queen.

2. ARETE FAUSSE. Les quatre esprits de monture coutent 75 Elegy Mosaic chacun
   (spirit_of_the_{raptor,springer,skimmer,jackal}.html, lot du 27/09), pas
   75 Trade Contracts. `trade_contract -> gift_of_the_rider 300` est retiree,
   `elegy_mosaic -> spirit_* 75` posee.

3. ARETE ACCROCHEE AU GRAND-PARENT (total inchange). La recette du parent
   reel porte la meme quantite :
   - tessons Bava Nisos / Mistburned, fioles : Gift of the Mursaat Ruins, pas
     Gift of the Mistburned Isles ; 50 des 150 fioles passent par le Mists Gate
     Residue (1 alliage + 1 planche + 1 fiole + 10 remnants, Ward Trader
     Sampaguita) ;
   - joyau de serpentite et 50 des 60 masses marquees : l'inscription de
     Diviner, pas l'arme Dragonsblood (dragonsblood_weapons.html : « 10 Branded
     Masses + une inscription (3 joyaux, 50 masses) ») ;
   - trefles d'Orrax : la cle a plat 30 devient l'arete Gift of the Side
     Course (recette : 30 Mystic Clovers).

4. DEUX NOEUDS DISTINCTS (hausse sourcee) :
   - refined_homestead_* : 250 dans Gift of Embracing Refuge + 250 Shards of
     the Homestead a 5 chacun. Table de Klobjarne Geirr : 1 250 par shard ;
   - orichalque -> Neutralized Titan Alloy 5 (Klobjarne : 500 par les
     planches + 500 par les alliages ; Orrax : 50 alliages) ;
   - Shard of the Dark Arts : 100 dans Gift of Ipos ET 100 dans Ars Goetia ;
   - Gift of Bones : Gift of Condensed Might ET Gift of Recollector of Memories ;
   - nourriture d'Orrax : satay (3 volailles), brochette et frites (1 viande),
     salade au poivre (5 grains) — table de Gift of the Feast ;
   - Opal Orb -> 5 poussieres incandescentes, comme les cinq autres orbes ;
   - Sweet-Treated Pine Plank -> Mists Gate Residue 1 (table d'Orrax : 50).

5. ECTOPLASME D'ORRAX DECOMPOSE. L'arbre gw2efficiency, lu en hierarchie
   (gw2_parse_recipe_tree_v2), donne 300 + 150 par les fioles, 150 par les
   planches, 1 250 + 100 par les essences de faille amalgamees, 97 + 123 par
   les trefles. La cle a plat de 2 020 valait exactement fioles (450) +
   essences (1 350) + trefles (220) ; or les essences etaient deja portees par
   la chaine : 1 350 comptes deux fois. La cle passe a 220 (trefles seuls),
   les fioles prennent leur arete. Total 3 520 -> 2 320 (= arbre 2 170 + les
   150 des alliages, que gw2efficiency achete au comptoir).
   Meme reliquat, total inchange, pour Ad Infinitum (Unbound Wings 25 sorti
   de la cle 789) ; Vision gagne les 5 ectos des Olmakhan Charms, absents de
   sa cle (249 = trefles seuls).

Laisses ouverts, documentes dans ARBITRAGES : les lodestones et le raffinage
(regle d'extraction, gw2_edges_wiki_v15), Memory of Battle / Mist Band
(choix vendeur), et les deux cas qui passent par Gift of Competitive
Dedication — tickets PvP et Shard of Glory — tant qu'Ardent Glorious est
bloque : poser l'arete y ajouterait 6 000 tessons sans source.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
JOUR = "2026-10-04"


def q(cid):
    return cc[cid].setdefault("qty", {})


def nf_add(cid, parent):
    cc[cid]["needed_for"] = sorted(set(cc[cid].get("needed_for") or []) | {parent})


def nf_del(cid, parent):
    q_ = cc[cid].get("qty") or {}
    if parent not in q_:
        cc[cid]["needed_for"] = [p for p in (cc[cid].get("needed_for") or []) if p != parent]


def pose(enfant, parent, n):
    assert parent in cc, parent
    q(enfant)[parent] = n
    nf_add(enfant, parent)


def retire(enfant, parent):
    del q(enfant)[parent]
    nf_del(enfant, parent)


# 1. tributs ---------------------------------------------------------------
ag = d["alt_groups"]
assert "tribute_to_the_man_o_war" not in ag["tribut_20"]["targets"]
ag["tribut_20"]["targets"].append("tribute_to_the_man_o_war")
ag["tribut_20"]["ref"] += " ; tribute_to_the_man_o_war.html (meme table, 04/10/2026)"
groupe = {t: (k, g["qty"]) for k, g in ag.items() if k.startswith("tribut_") for t in g["targets"]}
for t, (k, n) in groupe.items():
    c = cc[t]
    if c["sources"][0].get("type") == "vendor":
        continue
    c["sources"] = [{"type": "vendor", "tip": {
        "fr": f"Achat pour {n} au choix de six monnaies identiques aux autres Tribute to X (voir alt_groups {k}).",
        "en": f"Purchase for {n} of any of six currencies, same as the other Tribute to X (see alt_groups {k})."},
        "verified": True, "checked": JOUR, "ref": f"{t}.html, table Acquisition"}]

# 2. Gift of the Rider ------------------------------------------------------
retire("trade_contract", "gift_of_the_rider")
ESPRITS = ["spirit_of_the_raptor", "spirit_of_the_springer", "spirit_of_the_skimmer", "spirit_of_the_jackal"]
for s in ESPRITS:
    pose("elegy_mosaic", s, 75)
    cc[s]["sources"] = [{"type": "vendor", "tip": {
        "fr": "Achat 75 Elegy Mosaic, une fois la maîtrise de la monture montée au maximum.",
        "en": "Bought for 75 Elegy Mosaic once the mount mastery is maxed."},
        "verified": True, "checked": JOUR, "ref": f"{s}.html, table Acquisition"}]
    cc[s].update(verified=True, checked=JOUR, ref=f"{s}.html")
r = cc["gift_of_the_rider"]
r["sources"][0]["tip"] = {
    "fr": "MF : 4 Spirits de montures (Raptor/Springer/Skimmer/Jackal). Chaque Spirit coûte 75 Elegy Mosaic. Sans limite.",
    "en": "MF: 4 mount Spirits (Raptor/Springer/Skimmer/Jackal). Each Spirit costs 75 Elegy Mosaic. No limit."}
r["sources"][0]["ref"] = "wiki Gift of the Rider — boite Recipe (4 esprits) + page de chaque esprit (75 Elegy Mosaic, captures du 27/09)"
r["sources"][0]["checked"] = JOUR
r["recipe"] = {
    "fr": "MF : 1 Esprit du raptor + 1 Esprit du sauteur + 1 Esprit du raieon + 1 Esprit du chacal. Chaque esprit s'achete 75 Mosaiques d'elegie, sans limite.",
    "en": "MF: 1 Spirit of the Raptor + 1 Spirit of the Springer + 1 Spirit of the Skimmer + 1 Spirit of the Jackal. Each spirit costs 75 Elegy Mosaic, no cap."}

# 3. deplacements (total inchange) ----------------------------------------
for t in ("shard_of_bava_nisos", "shard_of_mistburned_barrens"):
    assert q(t)["gift_of_the_mistburned_isles"] == 100
    retire(t, "gift_of_the_mistburned_isles")
    pose(t, "gift_of_the_mursaat_ruins", 100)
assert q("vial_of_titan_melted_obsidian")["gift_of_the_mistburned_isles"] == 150
retire("vial_of_titan_melted_obsidian", "gift_of_the_mistburned_isles")
pose("vial_of_titan_melted_obsidian", "gift_of_the_mursaat_ruins", 100)
pose("vial_of_titan_melted_obsidian", "mists_gate_residue", 1)
INS = "diviners_orichalcum_imbued_inscription"
assert q("exquisite_serpentite_jewel") == {"dragonsblood_weapons": 3}
retire("exquisite_serpentite_jewel", "dragonsblood_weapons")
pose("exquisite_serpentite_jewel", INS, 3)
assert q("branded_mass")["dragonsblood_weapons"] == 60
q("branded_mass")["dragonsblood_weapons"] = 10
pose("branded_mass", INS, 50)
mc = cc["mystic_clover"]
assert q("mystic_clover")["orrax_manifested"] == 30
del q("mystic_clover")["orrax_manifested"]
pose("mystic_clover", "gift_of_the_side_course", 30)
mc["qty_overlap_verified"] = [x for x in mc["qty_overlap_verified"] if x != "orrax_manifested"]

# 4. deux noeuds distincts ------------------------------------------------
for m in ("fiber", "metal", "wood"):
    pose(f"refined_homestead_{m}", "shard_of_the_homestead", 5)
pose("orichalcum_ingot", "neutralized_titan_alloy", 5)
pose("shard_of_the_dark_arts", "ars_goetia", 100)
pose("gift_of_bones", "gift_of_recollector_of_memories", 1)
pose("slab_of_poultry_meat", "bowl_of_poultry_satay", 3)
pose("slab_of_red_meat", "meaty_asparagus_skewer", 1)
pose("slab_of_red_meat", "plate_of_orrian_steak_frittes", 1)
pose("black_peppercorn", "bowl_of_black_pepper_cactus_salad", 5)
pose("dust_incandescent", "opal_orb", 5)
pose("sweet_treated_pine_plank", "mists_gate_residue", 1)

# 5. ectoplasme -----------------------------------------------------------
g = q("glob_of_ectoplasm")
assert g["orrax_manifested"] == 2020 and g["ad_infinitum"] == 789
pose("glob_of_ectoplasm", "vial_of_titan_melted_obsidian", 3)
pose("glob_of_ectoplasm", "unbound_wings", 25)
pose("glob_of_ectoplasm", "olmakhan_charm", 1)
g["orrax_manifested"] = 220
g["ad_infinitum"] = 764
cc["glob_of_ectoplasm"]["qty_note"] = {
    "fr": "Orrax : la clé à plat ne porte plus que l'ecto des trèfles (97 + 123, arbre gw2efficiency lu en hiérarchie). Elle valait 2 020 et recomptait les 1 350 des essences de faille amalgamées, déjà portées par la chaîne ; les fioles (450) ont leur arête. Ad Infinitum : les 25 des Unbound Wings sortent de la clé (789 -> 764), total inchangé.",
    "en": "Orrax: the flat key now carries only the clover ecto (97 + 123, gw2efficiency tree read by hierarchy). It was 2,020 and recounted the 1,350 from Amalgamated Rift Essences already carried by the chain; the vials (450) have their own edge. Ad Infinitum: the 25 from Unbound Wings leave the key (789 -> 764), total unchanged."}

d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
