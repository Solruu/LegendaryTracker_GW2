#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Funerary Incense : retour a la voie Primeval Steward / Elegy Mosaics (Antoine, 09/10/2026, 15 h).

Usage : python3 scripts_tracker/integration/gw2_encens_steward_v1.py SRC DST

Regle precisee par Antoine : a prix equivalent, privilegier l'absence de
timegate, et tenir compte de la facilite d'obtention. Les voies ne different
que par la ressource et le plafond : 5 Trade Contracts (coeurs, 1 par jour),
3 Elegy Mosaics (Primeval Steward, sans plafond, mosaiques liees aux primes,
efficientes), 1 Crystalline Ingot (5 par jour, couteux). Voie par defaut :
Steward / Elegy Mosaics. Annule le choix des coeurs de
`gw2_decisions_a1_0910_v1` (v394).
Projection : les coeurs et le lingot portent `paid_repeatable` (alternatives),
le Steward non : sans plafond, il ne promet pas de delai.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
fi, em, tc = cc["funerary_incense"], cc["elegy_mosaic"], cc["trade_contract"]

assert tc["qty"].pop("funerary_incense") == 5
tc["needed_for"] = [x for x in tc["needed_for"] if x != "funerary_incense"]
em["qty"]["funerary_incense"] = 3
if "funerary_incense" not in em["needed_for"]:
    em["needed_for"].append("funerary_incense")

fi.pop("best", None)
fi["best_reason"] = {
    "fr": "voie par défaut : l'Intendant primitif contre 3 Mosaïques d'élégie, sans plafond. À prix comparable, l'absence de timegate l'emporte, et les mosaïques tombent des primes. Les cœurs (5 Contrats commerciaux, 1 par jour) et le Lingot cristallin restent des alternatives.",
    "en": "default route: the Primeval Steward for 3 Elegy Mosaics, uncapped. At a comparable price, no timegate wins, and mosaics drop from bounties. Heart vendors (5 Trade Contracts, 1 per day) and the Crystalline Ingot remain alternatives."}
fi["ref"] = ("ressources/wiki/funerary_incense.html (tableau Acquisition) — voie retenue par Antoine le 09/10 : "
             "à prix équivalent, pas de timegate, puis facilité d'obtention")
for s in fi["cadence"]["sources"]:
    en = s["label"]["en"]
    if en.startswith("Primeval Steward"):
        s.pop("paid_repeatable", None)
    else:
        s["paid_repeatable"] = True
fi["cadence"]["paid_repeatable_ref"] = "décision d'Antoine du 09/10 : Intendant primitif / Mosaïques d'élégie par défaut ; cœurs et lingot = alternatives"

lci = d["_meta"]["direct_sync"]["leg_currency_ids"]["vision"]
lci.pop("trade_contract", None)
lci["elegy"] = 35
d["_meta"]["last_updated"] = "2026-10-09"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("encens : voie Steward / Elegy Mosaics retablie")
