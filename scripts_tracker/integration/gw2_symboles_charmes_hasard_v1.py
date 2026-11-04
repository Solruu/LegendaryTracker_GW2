#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Symboles et charmes : la conversion de Forge au hasard n'est pas une recette (05/11).

Usage : python3 scripts_tracker/integration/gw2_symboles_charmes_hasard_v1.py SRC DST

Les six pages (symbol_of_control / _of_enhancement / _of_pain, charm_of_
brilliance / _of_potence / _of_skill) ecrivent, sous « Recipe » :
« Combining any three Symbols (Charms) with a Philosopher's Stone will yield
a random symbol (charm) ». La sortie est TIREE AU HASARD : ce n'est pas la
recette du symbole demande, c'est une conversion entre symboles.
La donnee en avait fait une recette : 3 « Symbol (ingredient) » (page de
desambiguisation, aucun objet) + 1 Philosopher's Stone par symbole. Le
moteur comptait donc 675 « Symbol (ingredient) » et 225 pierres de plus pour
le Legendary Sigil, 9 symboles fantomes sur une dizaine d'armes gen1, etc.
On retire les aretes `symbol_ingredient` / `charm_ingredient` /
`philosophers_stone` -> symbole ou charme ; la conversion reste citee en
option non comptee. Voie par defaut : le recyclage (source deja en tete).
Les composants `symbol_ingredient` et `charm_ingredient` deviennent sans
consommateur : non supprimes ici (suppression soumise a Antoine).
"""
import json
import re
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
cc = d["craft_components"]
J = "2026-11-05"
CIBLES = {"symbol_ingredient": ["symbol_of_control", "symbol_of_enhancement", "symbol_of_pain"],
          "charm_ingredient": ["charm_of_brilliance", "charm_of_potence", "charm_of_skill"]}
for generique, cibles in CIBLES.items():
    mot = "Symbols" if generique.startswith("symbol") else "Charms"
    for cid in cibles:
        h = re.sub(r"<[^>]+>", "", Path(f"ressources/wiki/{cid}.html").read_text(encoding="utf-8"))
        assert f"Combining any three {mot} with a Philosoph" in h and "random" in h, cid
        for enfant in (generique, "philosophers_stone"):
            e = cc[enfant]
            assert cid in e["qty"], (enfant, cid)
            del e["qty"][cid]
            if cid in e.get("needed_for", []):
                e["needed_for"].remove(cid)
        c = cc[cid]
        nom = "symbole" if mot == "Symbols" else "charme"
        for s in c["sources"]:
            if s.get("type") == "craft":
                s["type"] = "mystic_forge"
                s["tip"] = {
                    "fr": f"Option, non comptée : en Forge mystique, 3 {nom}s quelconques + 1 Philosopher's Stone donnent un {nom} AU HASARD (plus souvent un autre que ceux mis dans la Forge). Conversion, pas une recette.",
                    "en": f"Option, not counted: in the Mystic Forge, any 3 {mot.lower()} + 1 Philosopher's Stone yield a RANDOM {mot.lower()[:-1]} (more often one not used in the recipe). A conversion, not a recipe."}
                s["verified"], s["checked"] = True, J
                s["ref"] = f"ressources/wiki/{cid}.html, Recipe"
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("symboles / charmes : 18 aretes retirees")
