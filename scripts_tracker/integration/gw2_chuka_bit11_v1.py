#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Chuka and Champawat III, bit 11 (Vigil Cat Sitter) : 2 Slabs of Poultry Meat (05/11).

Usage : python3 scripts_tracker/integration/gw2_chuka_bit11_v1.py SRC DST

`gw2_couts_chuka_v1` (09/10) avait pose les bits 12 (3 chats de Caer Aval) et
13 (Shadow), mais laisse le bit 11 faute de connaitre le nombre des chats
d'Elena. elenas_kitty.html (capture du 05/11) : « Two cats referred to as
Elena's Kitties can be found in a tent on Oxbow Isle » ; vigil_cat_sitter.html :
« Give a Slab of Poultry Meat to each of Elena's Kitties ». Cout : 2 Slabs.
"""
import json
import re
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
W = "ressources/wiki/"
t = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", Path(W + "elenas_kitty.html").read_text(encoding="utf-8")))
assert "Two cats referred to as Elena's Kitties" in t
assert "each of Elena's Kitties" in Path(W + "vigil_cat_sitter.html").read_text(encoding="utf-8")
col = d["legendaries"]["gen2_chuka_and_champawat"]["collections"]["chuka_and_champawat_iii_tigris"]
st = [it for it in col["items"] if it["bit"] == 11]
assert len(st) == 1 and not st[0].get("cost")
ref12 = [it for it in col["items"] if it["bit"] == 12][0]
assert "slab_of_poultry_meat" in d["craft_components"]
st[0]["cost"] = {"slab_of_poultry_meat": 2}
st[0]["cost_ref"] = W + "elenas_kitty.html (deux chats) + vigil_cat_sitter.html ; compte le 2026-11-05"
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("bit 11 : 2 Slabs of Poultry Meat")
