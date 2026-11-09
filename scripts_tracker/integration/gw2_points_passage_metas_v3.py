#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Codes de chat des metas confrontes a l'API (09/11).

Usage : python3 scripts_tracker/integration/gw2_points_passage_metas_v3.py SRC DST

En verifiant les 215 points de passage des etapes (tous conformes), les codes
des metas ont ete decodes et confrontes a /v2/continents/1/floors (regle
« l'API a raison », 09/10) : ressources/api/api_points_de_passage_20261109.json.
Le nom du point de passage est garde, le code est recalcule depuis l'id de
l'API de ce nom :
- ab   Forgotten City   2007 (repere « Inner Chamber »)        -> 1990
- co   Amnoon           1714 (panorama de Malchor's Leap)      -> 2747
- er   Augury's Shadow  code mal forme (5 octets)              -> 2643
- dm   Heathen's Hold   2531 (repere de Siren's Landing)       -> 2509
- dv   Vehjin Palace    2575 (Vehtendi Academy Waypoint)       -> 2797
- lw4_dragonfall  Pact Command  2784 (absent de l'API)         -> 3038
Codes supprimes, aucun point de passage de ce nom dans l'API :
- ds   « Mordremoth's Bane Waypoint » : 2003 est le repere Quazupl Grounds
  d'Auric Basin ;
- adinf_dailies / adinf_cms / adinf_kelvei « Mistlock Observatory » : 1612
  est le repere Dwarves' Gloaming (Titan Research) ; l'observatoire est un
  hub de fractales sans point de passage du monde.
Non verifiables (nom absent de l'API) : de (Shattered Ravines), ld (Noran's
Homestead) — laisses tels quels.
"""
import base64
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
API = json.loads(Path("ressources/api/api_points_de_passage_20261109.json").read_text(encoding="utf-8"))["waypoints"]
J = "2026-11-09"


def code(i):
    return "[&" + base64.b64encode(bytes([4]) + int(i).to_bytes(4, "little")).decode() + "]"


me = d["meta_events"]
for k, poi in (("ab", 1990), ("co", 2747), ("er", 2643), ("dm", 2509), ("dv", 2797), ("lw4_dragonfall", 3038)):
    assert API[str(poi)] == me[k]["waypoint"], (k, API[str(poi)], me[k]["waypoint"])
    me[k]["wpCode"] = code(poi)
for k in ("ds", "adinf_dailies", "adinf_cms", "adinf_kelvei"):
    assert me[k].get("wpCode")
    del me[k]["wpCode"]
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("metas : 6 codes corriges, 4 supprimes")
