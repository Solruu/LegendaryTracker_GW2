#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sapphire Shard rejoint la forme des autres eclats de gemme (03/11).

Usage : python3 scripts_tracker/integration/gw2_eclats_gemmes_v1.py SRC DST

Ruby, Emerald, Beryl et Chrysocola Shard sont decomposes par leur recette de
joaillier (1 Pile of Radiant Dust + 2 lingots de gemme). Sapphire Shard, cree
le 03/11 avec Sapphire Crystal, n'avait pas encore sa page ; capturee le meme
jour : 1 Pile of Radiant Dust + 2 Lapis Lump (sapphire_shard.html, Recipe).
Meme structure que ses quatre voisins (instruction du projet : une donnee d'un
type existant rejoint la structure existante).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
IX = {e["page"]: e for e in json.loads(Path("ressources/INDEX_CONTENU.json").read_text(encoding="utf-8"))}
rec = IX["sapphire_shard"]["recettes"][0]
assert dict((a, b) for a, b in rec["ingredients"]) == {"Pile_of_Radiant_Dust": 1, "Lapis_Lump": 2}, rec
for enfant, n in (("dust_radiant", 1), ("lapis_lump", 2)):
    q = cc[enfant].setdefault("qty", {})
    assert "sapphire_shard" not in q
    q["sapphire_shard"] = n
    nf = cc[enfant].setdefault("needed_for", [])
    if isinstance(nf, list) and "sapphire_shard" not in nf:
        nf.append("sapphire_shard")
d["_meta"]["last_updated"] = "2026-11-03"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
