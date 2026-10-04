#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Retire les aretes que controle/gw2_aretes_non_sourcees montre fausses.

Usage : python3 scripts_tracker/integration/gw2_aretes_fausses_v1.py SRC DST

Premier tri du rapport (04/10/2026, 30 lignes) : 29 sont justes et expliquees
dans PLAN_RESTANT ; une seule est fausse.

- gift_of_adventure_voe -> gift_of_castoran_mastery. La recette du Gift of
  Castoran Mastery (gift_of_castoran_mastery.html) demande UN Gift of
  Adventure, et la page gift_of_adventure.html porte l'id 105979, celui de
  `gift_of_adventure` (55 trefles, 500 Unusual Coins, 100 Tales). Le
  composant `_voe` (106700) vient de l'import initial : aucune page, aucun
  enfant, une description ecrite de tete. L'arbre de Selachimorpha compte 1
  Gift of Adventure. L'arete part ; aucun total materiel ne bouge, le don
  fantome disparait de la liste de Selachimorpha. Le composant reste, sans
  consommateur : sa suppression attend l'accord d'Antoine.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
v = cc["gift_of_adventure_voe"]
assert v["qty"].pop("gift_of_castoran_mastery") == 1
v["needed_for"] = [x for x in (v.get("needed_for") or []) if x != "gift_of_castoran_mastery"]
d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
