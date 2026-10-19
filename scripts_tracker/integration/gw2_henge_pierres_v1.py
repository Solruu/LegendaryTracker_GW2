#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Wayfarer's Henge : les 16 Druid Runestones entrent dans le moteur (19/10).

Usage : python3 scripts_tracker/integration/gw2_henge_pierres_v1.py SRC DST

Le bloc Prerequis d'Aurora comptait les 16 pierres a la main (`perUnit`
4 200 karma, 1 000 magie non liee), mais le moteur n'en voyait qu'une
(etape « The Druid's Story ») et pas leur prix : grand total, cadences et
ligne Karma d'Aurora ignoraient 67 200 karma et 16 000 magie non liee.

- `cost` {druid_runestone: 1} sur les 15 etapes « X Runestone » (« Obtained
  by combining a Druid Runestone with the Element of ... ») des trois
  collections suivantes : 3 + 5 + 7, plus la pierre deja posee = 16 ;
- prix d'une pierre : 5 fragments, 4 chez les PNJ des coeurs a 1 050 karma et
  1 chez Supplymaster Hanjo a 1 000 magie non liee (the_druid_stone.html,
  etape « Druid Runestone ») : aretes karma 4 200 et unbound_magic 1 000 ;
- `unbound_magic` recoit son id de portefeuille (32), pour la synchro.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
cols = d["legendaries"]["aurora"]["collections"]
JOUR = "2026-10-19"
CAP = {"henge_3445": "awakening_the_druid_stone", "henge_3447": "sprouting_the_druid_stone",
       "henge_3436": "a_henge_away_from_home"}
BITS = {"henge_3445": [2, 5, 8], "henge_3447": [2, 5, 8, 11, 14],
        "henge_3436": [3, 5, 7, 10, 12, 14, 16]}
n = 0
for col, bits in BITS.items():
    for it in cols[col]["items"]:
        if it.get("bit") in bits:
            assert it["name"].endswith("Runestone") and "combining a Druid Runestone" in it["how"]["en"], it["name"]
            assert not it.get("cost")
            it["cost"] = {"druid_runestone": 1}
            it["cost_ref"] = f"ressources/wiki/{CAP[col]}.html, tableau des étapes (lu le 19/10)"
            n += 1
assert n == 15, n
assert next(i for i in cols["henge_3402"]["items"] if i["bit"] == 2)["cost"] == {"druid_runestone": 1}

for cid, v in (("karma", 4200), ("unbound_magic", 1000)):
    q = cc[cid].setdefault("qty", {})
    assert "druid_runestone" not in q
    q["druid_runestone"] = v
    nf = cc[cid].setdefault("needed_for", [])
    if "druid_runestone" not in nf:
        nf.append("druid_runestone")
um = cc["unbound_magic"]
if um.get("apiId") is None:
    um["apiId"] = 32  # portefeuille, gw2_currencies_ref.json (Unbound Magic)
dr = cc["druid_runestone"]
dr["recipe"] = {"fr": "5 fragments : 4 × 1 050 karma (PNJ des 4 cœurs) + 1 × 1 000 magie non liée (Supplymaster Hanjo).",
                "en": "5 fragments: 4 × 1,050 karma (the 4 heart NPCs) + 1 × 1,000 Unbound Magic (Supplymaster Hanjo)."}
dr["ref"] = dr.get("ref", "") + " ; prix : ressources/wiki/the_druid_stone.html, étape « Druid Runestone »"
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST, "-", n, "etapes")
