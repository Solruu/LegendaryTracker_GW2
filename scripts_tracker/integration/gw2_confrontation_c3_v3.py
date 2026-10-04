#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lot C3 du PLAN_RESTANT, troisieme passe : Klobjarne Geirr et une arete fausse.

Usage : python3 scripts_tracker/integration/gw2_confrontation_c3_v3.py SRC DST

(La 2e passe, Ad Infinitum, est dans l'historique git : v2 de ce script.)

1. ARETE FAUSSE cube_stabilized_dark_energy <- gift_of_research. La recette du
   Gift of Research (gift_of_research.html) est 250 Thermocatalytic + 2 x 250
   Hydrocatalytic + 250 Exotic Essence of Luck : aucun cube. La page du cube
   (cube_of_stabilized_dark_energy.html) ne le cite que dans la NAVBOX, pas
   dans « Used in ». Les arbres le confirment : Aetheric Anchor 1 cube (Gift of
   the Mists), Stella Radians 0, Klobjarne 2 (Gift of Expertise + Gift of the
   Mists). L'arete retiree, 23 legendaires perdent 1 cube, 1 balle, 75
   matrices (les 16 gen3, Aetheric Anchor, Klobjarne, Eikasia, ...).
2. Klobjarne, Stabilizing Matrix : arbre 150 (2 cubes). La chaine en porte
   desormais 150 ; la cle a plat de 150 doublait. Retiree.
3. Klobjarne, Glob of Ectoplasm : arbre 1 041 = 600 (12 Amalgamated Rift
   Essence) + 300 (Sweet-Treated Pine) + 123 (38 trefles) + 18 (Mithrillium).
   La cle a plat de 741 = 600 + 123 + 18 recopiait deux noeuds deja chaines.
   741 -> 123 (le trefle, seul noeud hors chaine ; chevauchement maintenu).
   Total 1 971 -> 1 353 = arbre + 300 (Neutralized Titan Alloy par sa recette,
   3 ectos, quand l'arbre l'achete au vendeur) + 12 (Elder Spirit Residue).
4. Endless Summer, Gift of the Sun (gift_of_the_sun.html) : 2 Gift of Light +
   2 Gift of Condensed Might + 2 Gift of Condensed Magic + 250 Sun Bead. Le
   noeud n'avait aucun enfant ; ses 32 couts T5/T6, lodestones et Tales
   etaient recopies a plat. Les trois aretes posees, chaque cle a plat qui
   egale EXACTEMENT l'apport de la chaine est retiree (echange, total
   inchange) ; le script refuse sinon. Ce que la chaine ajoute est ce que les
   cles oubliaient, et l'arbre gw2efficiency le confirme : poussiere
   incandescente +500, lumineuse +100, radiante +100 (2 Gift of Dust),
   Orichalcum Ingot 500 et Cured Hardened Leather Square 500 (2 Gift of
   Light). Sun Bead n'existe pas dans le tracker : non pose.
5. Transcendence, Stabilizing Matrix : arbre 95 = 75 (cube du Gift of the
   Mists, chaine) + 20 (2 Integrated Fractal Matrix). La cle a plat de 95
   doublait le cube ; 95 -> 20. Signale par l'audit (atteint en direct et via
   le cube) des que Klobjarne a cesse de masquer la ligne.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-04"
K = "klobjarne_geirr"

cube = cc["cube_stabilized_dark_energy"]
assert cube["qty"].pop("gift_of_research") == 1
cube["needed_for"] = [x for x in (cube.get("needed_for") or []) if x != "gift_of_research"]

assert cc["stabilizing_matrix"]["qty"].pop(K) == 150
t = cc["stabilizing_matrix"]["qty"]
assert t["transcendence"] == 95
t["transcendence"] = 20
sm = cc["stabilizing_matrix"]
sm["qty_overlap_verified"] = sorted(set(sm.get("qty_overlap_verified") or []) | {"transcendence"})
sm["qty_overlap_note"] = {
    "fr": "Transcendence : 75 par le cube du Gift of the Mists (arête) + 20 pour les 2 Integrated Fractal Matrix (clé à plat) — arbre gw2efficiency, 95.",
    "en": "Transcendence: 75 through the Gift of the Mists cube (edge) + 20 for the 2 Integrated Fractal Matrix (flat key) — gw2efficiency tree, 95."}
e = cc["glob_of_ectoplasm"]["qty"]
assert e[K] == 741
e[K] = 123

import copy as _c
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from moteur.gw2_moteur_v3 import Modele
ES = "endless_summer"
avant = Modele.depuis(_c.deepcopy(d)).totaux(ES)
for g in ("gift_of_light", "gift_of_condensed_might", "gift_of_condensed_magic"):
    assert "gift_of_the_sun" not in cc[g]["qty"]
    cc[g]["qty"]["gift_of_the_sun"] = 2
    if "needed_for" in cc[g]:
        cc[g]["needed_for"] = sorted(set(cc[g]["needed_for"]) | {"gift_of_the_sun"})
apres = Modele.depuis(_c.deepcopy(d)).totaux(ES)
retirees = 0
for cid in set(avant) | set(apres):
    q = cc[cid].get("qty") or {}
    if ES in q and apres.get(cid, 0) != avant.get(cid, 0):
        assert apres.get(cid, 0) - avant.get(cid, 0) == q[ES], (cid, q[ES])
        del q[ES]
        retirees += 1
print("Endless Summer : cles a plat echangees", retirees)

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
