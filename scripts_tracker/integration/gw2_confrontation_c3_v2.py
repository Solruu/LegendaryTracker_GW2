#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lot C3 du PLAN_RESTANT, deuxieme passe : Ad Infinitum.

Usage : python3 scripts_tracker/integration/gw2_confrontation_c3_v2.py SRC DST

Source : ressources/gw2efficiency/coalescence_vision_ad_infinitum.html, lu en
hierarchie par parseurs/gw2_parse_recipe_tree_v2 avec --racines/--racine. Le
decoupage par racine FONCTIONNE (Coalescence 0-108, Vision 109-692, Ad Infinitum
693-941) : la note du PLAN_RESTANT_v4 qui disait le contraire etait fausse.

L'arbre d'Ad Infinitum porte 8 Pristine Mist Essence, pas 5 : 5 sous Unbound,
2 sous Upper Bound, 1 sous Finite Result (chaque precurseur de la chaine
Finite Result -> Bound Wings -> Upper Bound -> Unbound Wings -> Unbound en
demande). La chaine du tracker ne connait que l'Unbound ; les trois autres
etaient recopiees a plat sur leurs descendants, et la cle a plat de chaque
descendant recopiait AUSSI ce que la chaine portait deja :

- Stabilizing Matrix : cle 600 (= les 8 cubes de l'arbre) + arete 5 cubes x 75
  = 975. Arbre : 600.
- Thermocatalytic Reagent : cle 580 = 450 (3 Vision Crystals, non chaines) +
  80 (8 essences) + 50 (Lump of Mithrillium) ; la chaine reportait deja 50
  (5 essences) et 50 (Mithrillium). Arbre : 590 (dont +10 Agony Infusion, 10).
- Glob of Ectoplasm : cle 764 = 250 + 250 (capacitors) + 10 (Bound Wings) +
  249 (trefles) + 5 (Mithrillium) ; le Mithrillium etait aussi chaine. Arbre :
  1 039.

Correction par la structure : les 3 essences d'Upper Bound et de Finite Result
deviennent une cle a plat de l'essence elle-meme (leurs parents n'existent pas
dans le tracker), chevauchement declare avec l'arete Unbound. La chaine porte
alors 8 cubes, 600 matrices, 80 reactifs, 80 Rare Essence of Luck. Les cles a
plat ne gardent que ce que la chaine ne porte pas :
- stabilizing_matrix : 600 -> retiree ;
- thermocatalytic_reagent : 580 -> 460 (450 Vision Crystals + 10 agonie) ;
- glob_of_ectoplasm : 764 -> 759.

Restent au-dessus de l'arbre, et c'est voulu : Bolt of Damask, Elonian Leather
Square et Spiritwood Plank sont des feuilles dans l'arbre (achat), le tracker
les decompose par leurs recettes wiki (+15 ectos, +100 reactifs).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-04"
L = "ad_infinitum"


def plat(c, attendu, nouveau=None):
    q = cc[c]["qty"]
    assert q.get(L) == attendu, (c, q.get(L))
    if nouveau is None:
        del q[L]
    else:
        q[L] = nouveau


e = cc["pristine_mist_essence"]
assert L not in e["qty"]
e["qty"][L] = 3
e["qty_overlap_verified"] = sorted(set(e.get("qty_overlap_verified") or []) | {L})
e["qty_overlap_note"] = {
    "fr": "Ad Infinitum : 5 sous Unbound (arête) + 2 sous Upper Bound + 1 sous Finite Result (clé à plat, précurseurs absents du tracker) — arbre gw2efficiency, 8 au total.",
    "en": "Ad Infinitum: 5 under Unbound (edge) + 2 under Upper Bound + 1 under Finite Result (flat key, precursors not in the tracker) — gw2efficiency tree, 8 in total."}

plat("stabilizing_matrix", 600)
plat("thermocatalytic_reagent", 580, 460)
plat("glob_of_ectoplasm", 764, 759)

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
