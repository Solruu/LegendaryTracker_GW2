#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pile of Foul Essence : butin par defaut, promotion en Forge en alternative.

Usage : python3 scripts_tracker/integration/gw2_essence_fetide_v1.py SRC DST

Ecart Kudzu d'ARBITRAGES (vin et cristal mystique, 7 / 8) : le « 8 » n'est
pas un total du wiki. C'est la recette de promotion du Foul Essence (2 Soiled
Essence + 1 vin elonien + 1 poussiere radieuse + 1 cristal mystique, page
capturee) multipliee par les 8 essences fetides de la chaine de Celerity.
L'essence tombe des Risen Thrall et de nombreux sacs : la promotion coute bien
plus cher qu'elle (25 pa de vin par essence). Meme regle que les trefles et les
gifts d'armure : la voie couteuse est proposee, jamais par defaut.
Champs existants : `best` / `best_reason`, et une source `mystic_forge`.
Aucune quantite.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
c = d["craft_components"]["pile_of_foul_essence"]
assert "best" not in c and [s["type"] for s in c["sources"]] == ["drop"]
c["best"] = "drop"
c["best_reason"] = {"fr": "voie par défaut : butin gratuit. La promotion en Forge est une alternative coûteuse.",
                    "en": "default route: free drop. The Forge promotion is a costly alternative."}
c["sources"].append({"type": "mystic_forge", "tip": {
    "fr": "Alternative coûteuse, jamais par défaut. Promotion en Forge : 2 Pile of Soiled Essence + 1 Bottle of Elonian Wine (25 pa) + 1 Pile of Radiant Dust + 1 Mystic Crystal pour 1 essence (ou 8 Soiled + 1 Mystic Binding Agent + 1 poussière radieuse + 1 cristal pour 4).",
    "en": "Costly alternative, never the default. Forge promotion: 2 Piles of Soiled Essence + 1 Bottle of Elonian Wine (25s) + 1 Pile of Radiant Dust + 1 Mystic Crystal for 1 essence (or 8 Soiled + 1 Mystic Binding Agent + 1 Radiant Dust + 1 Crystal for 4)."},
    "verified": True, "checked": "2026-10-07",
    "ref": "ressources/wiki/pile_of_foul_essence.html, Recipes (capture du 06/10/2026)"})
d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
