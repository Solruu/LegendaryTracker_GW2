#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Piles of Essence : une promotion reste une feuille (regle C7, 19/10).

Usage : python3 scripts_tracker/integration/gw2_promotions_essences_v1.py SRC DST

Le Superior Sigil of Celerity (Kudzu) demande 1 Pile of Putrid Essence. Les
recettes de Forge putrid <- vile <- filthy <- foul (boites « Type Promotion »,
lues comme telles par edges_wiki v16) etaient posees en aretes : Kudzu
comptait 8 Foul, 4 Filthy, 2 Vile, 7 Mystic Crystals, 7 Bottles of Elonian
Wine et les poussieres de chaque palier pour UNE pile. La Putrid se ramasse
sur les Risen d'Orr (pile_of_putrid_essence.html, Dropped by) : elle devient
feuille, les 12 aretes de promotion sortent. Vile et Filthy recoivent leur
butin lu sur leur page (pour le jour ou une recette les demandera).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
JOUR = "2026-10-19"
PILES = ("pile_of_putrid_essence", "pile_of_vile_essence", "pile_of_filthy_essence")

n = 0
for cid, c in cc.items():
    for p in PILES:
        if p in (c.get("qty") or {}):
            del c["qty"][p]
            n += 1
            nf = c.get("needed_for")
            if isinstance(nf, list) and p in nf:
                nf.remove(p)
assert n == 12, n

TIPS = {
    "pile_of_putrid_essence": ("Butin des Risen d'Orr (Rivage maudit, Saut de Malchor, Détroit de la Dévastation), champions et élites compris.",
                               "Dropped by Risen in Orr (Cursed Shore, Malchor's Leap, Straits of Devastation), champions and elites included."),
    "pile_of_vile_essence": ("Butin des Risen d'Orr (Saut de Malchor, Rivage maudit, Détroit de la Dévastation).",
                             "Dropped by Risen in Orr (Malchor's Leap, Cursed Shore, Straits of Devastation)."),
    "pile_of_filthy_essence": ("Butin des Risen Thralls et de nombreux sacs de butin (Large Loot Bag, Moldy Bags…).",
                               "Dropped by Risen Thralls and found in many loot bags (Large Loot Bag, Moldy Bags…)."),
}
for p, (fr, en) in TIPS.items():
    cc[p]["sources"] = [{"type": "drop", "free_repeatable": True, "cadence": "à volonté",
                         "tip": {"fr": fr, "en": en}, "verified": True, "checked": JOUR,
                         "ref": f"ressources/wiki/{p}.html, Acquisition (Dropped by / Contained in)"}]
    cc[p]["best"] = "drop"
    cc[p]["note"] = {"fr": "Recette de Forge = promotion de palier : voie alternative, non comptée (règle C7).",
                     "en": "Mystic Forge recipe = tier promotion: alternative path, not counted (rule C7)."}
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST, "-", n, "aretes de promotion retirees")
