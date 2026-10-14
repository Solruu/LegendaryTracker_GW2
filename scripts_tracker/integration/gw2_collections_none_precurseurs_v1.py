#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Texte « aucune collection » des 28 armes gen2 (PoF) et gen3 : precurseur fabrique, pas forge.

Usage : python3 scripts_tracker/integration/gw2_collections_none_precurseurs_v1.py SRC DST

Le texte disait « se fabrique a la Forge mystique ». Les captures disent
autrement : les precurseurs gen3 se fabriquent a 500 dans une discipline
(Weaponsmith, Huntsman, Artificer — tableau « Used in » de
memory_of_aurene.html, recette apprise par une Sheaf of Recipes), et ceux des
armes gen2 de PoF de meme (« Endeavor — Requires 500 Weaponsmith », pages des
armes). Le texte devient visible depuis le selecteur d'arme (S4) : on le
corrige avant.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
TXT = {"fr": "Aucune collection : le précurseur de cette arme se fabrique par artisanat (discipline à 500, recette à apprendre), il ne s'obtient pas par une chaîne de succès. Vide établi, pas vide en attente.",
       "en": "No collection: this weapon's precursor is crafted (discipline at 500, recipe to learn), not earned through an achievement chain. Established empty, not pending."}
n = 0
for k, v in d["legendaries"].items():
    cn = v.get("collections_none")
    if isinstance(cn, dict) and "Forge mystique" in (cn.get("fr") or ""):
        v["collections_none"] = dict(TXT); n += 1
        v["collections_none_ref"] = (v.get("collections_none_ref", "") + " ; precurseur fabrique : "
            "ressources/wiki/memory_of_aurene.html (Used in, gen3) et pages des armes gen2 (« Requires 500 »)").lstrip(" ;")
assert n == 28, n
d["_meta"]["last_updated"] = "2026-10-14"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{n} textes corriges")
