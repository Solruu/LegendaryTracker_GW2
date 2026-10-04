#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lot C3 du PLAN_RESTANT, premiere passe : les ecarts que tranchent une page ou
un arbre gw2efficiency lu en hierarchie (gw2_parse_recipe_tree_v2).

Usage : python3 scripts_tracker/integration/gw2_confrontation_c3_v1.py SRC DST

1. Dons de donjon des gen1. Les huit (Ascalon, Baelfire, Knowledge, Forgeman,
   Nobleman, Sanctuary, Thorns, Zhaitan) s'achetent 500 Tales of Dungeon
   Delving, meme prix chez tous les vendeurs : une liste, pas un choix. Les
   21 gen1 n'en comptaient aucun. La cle a plat d'Orrax (500) est exactement le
   Gift of Ascalon de son Gift of Darkness : elle part, l'arete la remplace.
2. Dragonite / Bloodstone Dust / Empyreal Fragment sur Conflux et Warbringer.
   Arbre : 1 250 = 250 sous l'Essence mystique + 1 000 sous les 10 lingots.
   Les deux noeuds sont dans la chaine ; la cle a plat de 1 000 en etait un
   troisieme, garde par un chevauchement declare sur la foi de ces deux memes
   noeuds. 2 250 -> 1 250.
3. Hydrocatalytic Reagent d'Aetheric Anchor et Stella Radians : 500, tous dans
   le Gift of Research (recette 250 + 250). La cle a plat de 500 doublait.
4. Thermocatalytic Reagent de Klobjarne : la cle a plat de 1 080 doublait une
   chaine qui porte deja les 1 930 de l'arbre (lances, hampes, 90 lingots,
   Gift of Research, Mithrillium) plus 120 par le Glob of Elder Spirit
   Residue. 3 130 -> 2 050.
5. Transcendence, arbre lu en hierarchie : Shard of Glory 2 250 (et non 2 500 :
   la cle passe de 2 000 a 1 750, le reste etant dans la chaine) ; Ascended
   Shard of Glory 900 = 400 Star of Glory + 250 Mist Diamond + 250
   Mist-Enhanced Orichalcum (la cle passe de 500 a 900). La Star of Glory
   reste a plat : son arete passerait par Ardent Glorious, bloque.
6. Memory of Battle de Triumphant Hero : 250 par piece au vendeur
   (triumphant_heros_masque.html) + 250 dans le Gift of War Dedication.
   Deux noeuds distincts, chevauchement declare, total inchange.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-04"


def pose(e, p, n):
    cc[e].setdefault("qty", {})[p] = n
    cc[e]["needed_for"] = sorted(set(cc[e].get("needed_for") or []) | {p})


def plat(c, leg, attendu, nouveau=None):
    q = cc[c]["qty"]
    assert q.get(leg) == attendu, (c, leg, q.get(leg))
    if nouveau is None:
        del q[leg]
    else:
        q[leg] = nouveau


def sans_chevauchement(c, legs):
    ov = [x for x in (cc[c].get("qty_overlap_verified") or []) if x not in legs]
    if ov:
        cc[c]["qty_overlap_verified"] = ov
    else:
        cc[c].pop("qty_overlap_verified", None)
        cc[c].pop("qty_overlap_note", None)


DONJONS = {"gift_of_ascalon": "Ascalonian Catacombs", "gift_of_baelfire": "Citadel of Flame",
           "gift_of_knowledge": "Crucible of Eternity", "gift_of_the_forgeman": "Sorrow's Embrace",
           "gift_of_the_nobleman": "Caudecus's Manor", "gift_of_the_sanctuary": "Honor of the Waves",
           "gift_of_thorns": "Twilight Arbor", "gift_of_zhaitan": "The Ruined City of Arah"}
for g, donjon in DONJONS.items():
    pose("tales_of_dungeon_delving", g, 500)
    cc[g]["sources"] = [{"type": "vendor", "tip": {
        "fr": f"Achat 500 Tales of Dungeon Delving chez les marchands de donjon, après 5 explorations de {donjon}.",
        "en": f"Bought for 500 Tales of Dungeon Delving from dungeon merchants, after 5 explorable runs of {donjon}."},
        "verified": True, "checked": J, "ref": f"{g}.html, table Acquisition"}]
    cc[g].update(verified=True, checked=J, ref=f"{g}.html")
plat("tales_of_dungeon_delving", "orrax_manifested", 500)

for c in ("dragonite_ore", "bloodstone_dust", "empyreal_fragment"):
    plat(c, "conflux", 1000)
    plat(c, "warbringer", 1000)
    sans_chevauchement(c, {"conflux", "warbringer"})

plat("hydrocatalytic_reagent", "aetheric_anchor", 500)
plat("hydrocatalytic_reagent", "stella_radians", 500)
plat("thermocatalytic_reagent", "klobjarne_geirr", 1080)
sans_chevauchement("thermocatalytic_reagent", {"klobjarne_geirr"})

plat("shard_of_glory", "transcendence", 2000, 1750)
plat("ascended_shard_of_glory", "transcendence", 500, 900)
for c, note in (("shard_of_glory", "Transcendence : 2 250 à l'arbre gw2efficiency — 250 Gift of Glory et 250 Gift of Skirmishing par la chaîne, 1 750 à plat (Jar of Distilled Glory 1 000, essences 250, Mist Diamond 250, Mist-Enhanced Orichalcum 250)."),
                ("ascended_shard_of_glory", "Transcendence : 900 à l'arbre gw2efficiency — Star of Glory 400, Mist Diamond 250, Mist-Enhanced Orichalcum 250. La Star of Glory reste à plat tant qu'Ardent Glorious est bloqué.")):
    cc[c]["qty_note"] = {"fr": note, "en": None}

m = cc["memory_of_battle"]
m["qty_overlap_verified"] = sorted(set(m.get("qty_overlap_verified") or []) | {"triumphant_hero"})
m["qty_overlap_note"] = {"fr": "Triumphant Hero : 250 par pièce au vendeur de la pièce élevée (triumphant_heros_masque.html) et 250 dans le Gift of War Dedication — deux nœuds distincts.",
                         "en": "Triumphant Hero: 250 per piece at the ascended piece vendor (triumphant_heros_masque.html) and 250 in the Gift of War Dedication — two distinct nodes."}

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
