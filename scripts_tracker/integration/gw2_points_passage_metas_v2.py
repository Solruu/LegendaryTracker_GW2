#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A2 (v2) : points de passage des metas, releves par Antoine le 12/10/2026.

Usage : python3 scripts_tracker/integration/gw2_points_passage_metas_v1.py SRC DST

Chaque code a ete decode (octet 0x04 + id) et confronte a l'id du point lu
sur /v2/continents/1/floors/1/regions/{37,48,20}/maps/{m}/pois : les six
concordent.
- de2 : Jade Quarry (3234) — rendez-vous a Quarry Passage (wiki).
- gy  : Park Mining Ops (3498) — la meta part du nord (Antoine).
- in  : Astral Ward Camp (3686) pour Road to Heitor ; Fangs That Gnash part
        de Forward Bivouac (3702), cite dans le conseil.
- nk  : Ministry Ward (3353).
- eb  : Promontory (2399) — depart des routes BlishHUD du bois petrifie.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
me = d["meta_events"]
REF = "releve d'Antoine du 12/10/2026, code confronte a l'id du point sur /v2/continents/…/pois"
POINTS = {
    "de2": ("Jade Quarry Waypoint", "[&BKIMAAA=]"),
    "gy": ("Park Mining Ops Waypoint", "[&BKoNAAA=]"),
    "in": ("Astral Ward Camp Waypoint", "[&BGYOAAA=]"),
    "nk": ("Ministry Ward Waypoint", "[&BBkNAAA=]"),
    "eb": ("Promontory Waypoint", "[&BF8JAAA=]"),
}
for k, (nom, code) in POINTS.items():
    m = me[k]
    m["waypoint"], m["wpCode"] = nom, code
    # v2 : une entree sans `ref` n'en recoit pas — l'audit exigerait alors
    # checked/verified pour TOUTE l'entree, dont l'horaire (gy) n'est pas
    # confirme. La source du point reste ici, dans l'en-tete du script.
    if m.get("ref"):
        m["ref"] += " ; point de passage : " + REF
tip = me["in"]["tip"]
tip["fr"] += " Road to Heitor part d'Astral Ward Camp ; Les crocs qui grincent, de Forward Bivouac [&BHYOAAA=]."
tip["en"] += " Road to Heitor starts at Astral Ward Camp; Fangs That Gnash at Forward Bivouac [&BHYOAAA=]."
d["_meta"]["last_updated"] = "2026-10-12"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("5 metas : point de passage pose")
