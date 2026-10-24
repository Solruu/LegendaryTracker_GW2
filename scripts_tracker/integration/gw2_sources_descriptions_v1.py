#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Composants du 24/10 a voie « unknown » : le type lu dans la description du jeu.

Usage : python3 scripts_tracker/integration/gw2_sources_descriptions_v1.py SRC DST

Les 46 composants crees par gw2_collections_armes_v1 sans recette portent la
description /v2/items en conseil. Quand elle dit d'ou vient l'objet, le type
de source le dit aussi (couleur de farm, projection) :
« Dropped by / dropped by / Taken from » -> drop ; « Gathered from / Found by
mining » -> gathering ; « Purchased from » -> vendor. Le reste attend le wiki.
Sauts de ligne de la description remplaces par des espaces.
"""
import json, re, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
REGLES = ((r"\b(Dropped by|dropped by|Taken from)\b", "drop"),
          (r"\b(Gathered from|Found by mining)\b", "gathering"),
          (r"\bPurchased from\b", "vendor"))
n = 0
for k, c in cc.items():
    s = c.get("sources") or []
    if not s or s[0].get("type") != "unknown" or c.get("checked") != "2026-10-24":
        continue
    for lang in ("fr", "en"):
        s[0]["tip"][lang] = re.sub(r"\s*\n\s*", " ", s[0]["tip"][lang])
    for motif, typ in REGLES:
        if re.search(motif, s[0]["tip"]["en"]):
            s[0]["type"] = typ
            n += 1
            break
d["_meta"]["last_updated"] = "2026-10-24"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST, "| types poses", n)
