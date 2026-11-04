#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Envoy Armor I : conseils `how_jsx` decales d'un cran sur les bits 2 a 14 (04/11).

Usage : python3 scripts_tracker/integration/gw2_conseils_envoy_v1.py SRC DST

Le conseil redige (`how_jsx`) de chaque bit de 3 a 14 decrit l'objet du bit
precedent, et celui du bit 2 decrit le bit 14 (rotation). Constat contre le
`how` de chaque bit, lu dans le tableau « Collection items » de
envoy_armor_i_experimental_armor.html :
- bit 3 Spirit Weave porte « Energy Crystal : Vale Guardian... Glint's Egg »,
  qui est l'Auric Energy Crystal (bit 2) ;
- bit 14 Tormented Aurillium porte « Stone Soul : Keep Construct », qui est
  Soul of the Keep (bit 13) ;
- bit 2 Auric Energy Crystal porte « Polished Aurillium... Twisted Castle »,
  qui est Tormented Aurillium (bit 14).
Les bits 0, 1, 15, 16, 17 sont en place. Un detecteur par recouvrement de mots
(conseil redige contre conseil du wiki) n'a trouve aucune autre collection
touchee (Selachimorpha « Diver » : conseil generique repete, faux positif).
Aucun cout ne bouge : seuls les textes changent de bit.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
items = {it["bit"]: it for it in d["legendaries"]["perfected_envoy"]["collections"]["envoy_1"]["items"]}
avant = {b: items[b]["how_jsx"] for b in range(2, 15)}
assert "Glint" in avant[3]["en"] and "Stone Soul" in avant[14]["en"] and "Polished Aurillium" in avant[2]["en"]
for b in range(2, 14):
    items[b]["how_jsx"] = avant[b + 1]
items[14]["how_jsx"] = avant[2]
assert "Glint" in items[2]["how_jsx"]["en"] and "Polished Aurillium" in items[14]["how_jsx"]["en"]
assert "Stone Soul" in items[13]["how_jsx"]["en"]
d["_meta"]["last_updated"] = "2026-11-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("13 conseils reattribues ; ecrit", DST)
