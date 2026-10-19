#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Hydrocatalytic Reagent : s'achete en Research Notes (19/10, Antoine).

Usage : python3 scripts_tracker/integration/gw2_hydrocatalytic_notes_v1.py SRC DST

La donnee le disait obtenu par Rift Hunting / Convergences (SotO) et au
comptoir : aucune source. La page wiki (lue le 19/10, lien d'Antoine) n'a ni
butin ni recette ; la description de l'objet dit « Can be purchased from
master craftspeople », et il est lie au compte (pas de comptoir). Le prix est
donne par gift_of_research.html, Notes : « The Hydrocatalytic Reagents cost a
total of 2,500 Research Note » pour les 500 du don, soit 5 notes l'unite.

Les notes sont donc un COMPOSANT du reactif : arete research_note -> 5 par
Hydrocatalytic. Les cles a plat de notes qui recopiaient ce prix sortent :
Selachimorpha 5 000 (2 dons), Aetheric Anchor 2 500, Klobjarne Geirr 2 500,
Stella Radians 2 500 (sur 52 500, le reste vient des Seer Runestones) — leurs
totaux sont inchanges. Les autres porteurs du reactif (14 gen3 ~3 000, Eikasia
5 000, Obsidian 15 000, relique 2 500...) recoivent les notes qui leur
manquaient : le texte des armes gen3 annoncait deja « ~3000 Research Notes ».
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
JOUR = "2026-10-19"

rn = cc["research_note"]
for leg, v in (("selachimorpha", 5000), ("aetheric_anchor", 2500),
               ("klobjarne_geirr", 2500), ("stella_radians", 2500)):
    assert rn["qty"].pop(leg) == v, leg
rn["qty"]["hydrocatalytic_reagent"] = 5
rn.pop("qty_overlap_verified", None)
nf = rn.get("needed_for")
if isinstance(nf, list):
    rn["needed_for"] = [x for x in nf if x not in ("selachimorpha", "aetheric_anchor", "klobjarne_geirr", "stella_radians")]
    rn["needed_for"].append("hydrocatalytic_reagent")
rn["qty_note"] = {
    "fr": "19/10 : 5 notes par Hydrocatalytic Reagent (gift_of_research.html : 2 500 notes pour 500 réactifs). Les clés à plat de Selachimorpha, Aetheric Anchor, Klobjarne Geirr et Stella Radians recopiaient ce prix : retirées, totaux inchangés.",
    "en": "19/10: 5 notes per Hydrocatalytic Reagent (gift_of_research.html: 2,500 notes for 500 reagents). The flat keys of Selachimorpha, Aetheric Anchor, Klobjarne Geirr and Stella Radians copied that price: removed, totals unchanged."}

hy = cc["hydrocatalytic_reagent"]
hy["sources"] = [{
    "type": "vendor", "npc": "Master craftspeople",
    "tip": {"fr": "Acheté chez les maîtres artisans, 5 Research Notes l'unité (2 500 pour les 500 d'un Don de recherche). Lié au compte : pas de comptoir.",
            "en": "Bought from master craftspeople, 5 Research Notes each (2,500 for the 500 of a Gift of Research). Account bound: no trading post."},
    "cost": {"fr": "5 Research Notes", "en": "5 Research Notes"},
    "paid_repeatable": True, "verified": True, "checked": JOUR,
    "ref": "wiki:Hydrocatalytic_Reagent (description, lu le 19/10) + ressources/wiki/gift_of_research.html, Notes"}]
hy["best"] = "vendor"
hy["verified"] = True
hy["checked"] = JOUR
hy["ref"] = hy["sources"][0]["ref"] + " ; boîte Recipe du Don : 2 × 250"
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
