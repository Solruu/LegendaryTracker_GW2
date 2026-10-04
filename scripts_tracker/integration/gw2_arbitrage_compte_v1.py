#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lot C2 du PLAN_RESTANT : les trois « ecarts de compte » d'ARBITRAGES.

Usage : python3 scripts_tracker/integration/gw2_arbitrage_compte_v1.py SRC DST

Deux sur trois sont des cles a plat qui agregeaient deux noeuds distincts ;
on les decompose, aucun total ne bouge.

- ancient_coin : 20 250 sur Klobjarne Geirr = 250 du Gift of the Ursus (table
  vendeur : 25 Honeycomb + 25 Curious Mursaat Currency + 250 Ancient Coin +
  1 250 Ursus Oblige) + 100 Mursaat Runestones a 200 Ancient Coin piece
  (mursaat_runestone.html : quatre vendeurs, 200 chacun). Les 50 000 d'Orrax
  sont exactement 250 runestones a 200. Deux aretes remplacent les deux cles.
  Les caches kodan donnent aussi des runestones (~70 %) : le vendeur reste la
  voie comptee, comme avant.
- curious_mursaat_currency : 125 sur Klobjarne = 25 du Gift of the Ursus + 100
  pour les Shards of Janthir Syntri (table de Klobjarne). L'arete Ursus prend
  ses 25, la cle garde 100.

Laisse ouvert : ascended_shard_of_glory / Transcendence via Star of Glory, qui
passe par Gift of Competitive Dedication et donc par Ardent Glorious, bloque.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]


def pose(e, p, n):
    cc[e].setdefault("qty", {})[p] = n
    cc[e]["needed_for"] = sorted(set(cc[e].get("needed_for") or []) | {p})


ac = cc["ancient_coin"]["qty"]
assert ac == {"klobjarne_geirr": 20250, "orrax_manifested": 50000}
del ac["klobjarne_geirr"], ac["orrax_manifested"]
pose("ancient_coin", "gift_of_the_ursus", 250)
pose("ancient_coin", "mursaat_runestone", 200)
cmc = cc["curious_mursaat_currency"]["qty"]
assert cmc["klobjarne_geirr"] == 125
cmc["klobjarne_geirr"] = 100
pose("curious_mursaat_currency", "gift_of_the_ursus", 25)
cc["curious_mursaat_currency"]["qty_overlap_verified"] = ["klobjarne_geirr"]
cc["curious_mursaat_currency"]["qty_overlap_note"] = {
    "fr": "Table de Klobjarne Geirr : deux nœuds distincts, 100 sous les Shards of Janthir Syntri et 25 sous le Gift of the Ursus.",
    "en": "Klobjarne Geirr table: two distinct nodes, 100 under the Shards of Janthir Syntri and 25 under the Gift of the Ursus."}
cc["curious_mursaat_currency"]["qty_note"] = {
    "fr": "Klobjarne : 100 à plat pour les Shards of Janthir Syntri (version à prix réduit), les 25 du Gift of the Ursus passent par l'arête.",
    "en": "Klobjarne: 100 flat for the Shards of Janthir Syntri (discounted version), the 25 from the Gift of the Ursus go through the edge."}
d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
