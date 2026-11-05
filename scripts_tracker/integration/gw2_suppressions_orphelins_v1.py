#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Suppression de trois composants sans consommateur (05/11, accord d'Antoine).

Usage : python3 scripts_tracker/integration/gw2_suppressions_orphelins_v1.py SRC DST

- legendary_insight_consumable : objet retire du jeu, converti 1 pour 1 en
  monnaie (legendary_insight.html) ; plus consomme depuis v438. Il entretenait
  les 2 ecarts de CONFRONTATION et les 2 NON_RELIE de RELECTURE (le resolveur
  apparie la recette du wiki par apiId de page).
- symbol_ingredient, charm_ingredient : pages de desambiguisation, aucun objet ;
  sans consommateur depuis v441 (`gw2_symboles_charmes_hasard_v1`). L'arete
  restante philosophers_stone -> charm_ingredient part avec.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
C = d["craft_components"]
for cid in ("legendary_insight_consumable", "symbol_ingredient", "charm_ingredient"):
    assert not C[cid].get("qty"), cid
    for k, v in C.items():
        q = v.get("qty") or {}
        if cid in q:
            del q[cid]
        if cid in (v.get("needed_for") or []):
            v["needed_for"].remove(cid)
    del C[cid]
out = json.dumps(d, ensure_ascii=False, indent=1)
assert not any(x in out for x in ('"legendary_insight_consumable"', '"symbol_ingredient"', '"charm_ingredient"'))
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("3 composants supprimes")
