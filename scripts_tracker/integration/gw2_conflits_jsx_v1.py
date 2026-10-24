#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""`qty_conflict` : les huit divergences JSX declarees n'existent plus (24/10).

Usage : python3 scripts_tracker/integration/gw2_conflits_jsx_v1.py SRC DST

Declarees le 27/08 (BACKLOG 4 ter et 3 sexies) quand le JSX portait une
exigence directe differente de la chaine. Depuis S2 (14/10, « un seul calcul »)
les ancres du JSX suivent le moteur et l'audit (check_qty_vs_jsx) les y
confronte : aucune n'est plus en ecart (audit v62 du 24/10 : zero « ecart
connu »). Une declaration sans divergence masquerait la prochaine vraie : elles
sont retirees.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
n = 0
for k, c in d["craft_components"].items():
    if "qty_conflict" in c:
        n += len(c["qty_conflict"])
        del c["qty_conflict"]
assert n == 8, n
d["_meta"]["last_updated"] = "2026-10-24"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST, "| declarations retirees", n)
