#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Suppressions accordees par Antoine le 04/10/2026.

Usage : python3 scripts_tracker/integration/gw2_suppressions_v1.py SRC DST

- `legendaries.*.shared_components` (44 fiches) : lu par aucun outil ni par
  le JSX, et faux pour Eternity, ou il listait le patron gen1 retire en v364.
- `gift_of_adventure_voe` (106700) : aucune page, aucun enfant, aucun
  consommateur depuis integration/gw2_aretes_fausses_v1 ; doublon d'import de
  `gift_of_adventure` (105979, celui de la recette).
- `testimony_of_jade_heroics` (97457) : aucun consommateur depuis
  integration/gw2_aretes_fausses_v2 (voie Jade retiree au profit de la
  Castoran).
Le script refuse si l'un des deux composants a regagne un consommateur, un
enfant ou une reference ailleurs dans la donnee.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]

n = 0
for leg in d["legendaries"].values():
    if isinstance(leg, dict) and "shared_components" in leg:
        del leg["shared_components"]
        n += 1
assert n == 44, n

for cid in ("gift_of_adventure_voe", "testimony_of_jade_heroics"):
    assert not cc[cid].get("qty"), (cid, cc[cid].get("qty"))
    assert not any(cid in (v.get("qty") or {}) for v in cc.values()), cid
    del cc[cid]
    assert f'"{cid}"' not in json.dumps(d), cid

d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST, "| shared_components retire de", n, "fiches")
