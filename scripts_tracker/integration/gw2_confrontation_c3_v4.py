#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lot C3 du PLAN_RESTANT, quatrieme passe : Aurora.

Usage : python3 scripts_tracker/integration/gw2_confrontation_c3_v4.py SRC DST

(Passes 1 a 3 : historique git.)

Source : ressources/gw2efficiency/aurora.html (arbre ajoute par Antoine le
04/10), lu par parseurs/gw2_parse_recipe_tree_v2.

L'audit signalait ecto et obsidienne « atteints en direct et via la
chaine ». La cle a plat de 250 est l'estimation des 77 Mystic Clovers du
Mystic Tribute — la prose d'aurora.html : « forged from a total of about
250 ... Globs of Ectoplasm, 250 Obsidian Shards » — et la chaine porte
d'autres noeuds (21 Lump of Mithrillium, Crystalline Ingot, Fulgurite).
Pas de double compte : un chevauchement a declarer.

L'arbre chiffre les trefles a 249 ectos et 249 eclats, la valeur que Vision
et Coalescence portent deja pour la meme chose. Aurora s'aligne : 250 -> 249
sur les deux cles, chevauchement declare.

Klobjarne Geirr, Obsidian Shard — revele par l'audit une fois la ligne
Aurora levee (il ne cite qu'un legendaire par composant). Arbre
(klobjarne_geirr.html) : 353 = 50 (Gift of Expertise) + 123 (38 trefles) +
180 (30 lingots, etoiles, briques). La cle a plat de 50 recopiait le Gift of
Expertise, deja chaine, et les trefles manquaient. 50 -> 123, chevauchement
declare, comme l'ecto de Klobjarne en C3 3e passe. 280 -> 353 = arbre.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
A = "aurora"
NOTES = {
    "glob_of_ectoplasm": ("Aurora : 249 pour les 77 Mystic Clovers du Mystic Tribute (clé à plat) + Lump of Mithrillium et Crystalline Ingot (arêtes) — arbre gw2efficiency.",
                          "Aurora: 249 for the Mystic Tribute's 77 Mystic Clovers (flat key) + Lump of Mithrillium and Crystalline Ingot (edges) — gw2efficiency tree."),
    "obsidian_shard": ("Aurora : 249 pour les 77 Mystic Clovers du Mystic Tribute (clé à plat) + Fulgurite et la chaîne du Vision Crystal (arêtes) — arbre gw2efficiency.",
                       "Aurora: 249 for the Mystic Tribute's 77 Mystic Clovers (flat key) + Fulgurite and the Vision Crystal chain (edges) — gw2efficiency tree."),
}
for cid, (fr, en) in NOTES.items():
    c = cc[cid]
    assert c["qty"][A] == 250, cid
    c["qty"][A] = 249
    c["qty_overlap_verified"] = sorted(set(c.get("qty_overlap_verified") or []) | {A})
    note = c.get("qty_overlap_note")
    if note:
        note["fr"] = note["fr"].rstrip() + " " + fr
        note["en"] = note["en"].rstrip() + " " + en
    else:
        c["qty_overlap_note"] = {"fr": fr, "en": en}
o = cc["obsidian_shard"]
assert o["qty"]["klobjarne_geirr"] == 50
o["qty"]["klobjarne_geirr"] = 123
o["qty_overlap_verified"] = sorted(set(o["qty_overlap_verified"]) | {"klobjarne_geirr"})
o["qty_overlap_note"]["fr"] += " Klobjarne Geirr : 123 pour les 38 Mystic Clovers (clé à plat) + Gift of Expertise et 30 lingots, étoiles, briques (arêtes) — arbre gw2efficiency, 353."
o["qty_overlap_note"]["en"] += " Klobjarne Geirr: 123 for the 38 Mystic Clovers (flat key) + Gift of Expertise and 30 ingots, stars, bricks (edges) — gw2efficiency tree, 353."
d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
