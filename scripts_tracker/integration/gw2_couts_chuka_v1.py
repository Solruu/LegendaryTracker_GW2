#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""C5 : couts d'etape de Chuka and Champawat III: Tigris (09/10/2026).

Usage : python3 scripts_tracker/integration/gw2_couts_chuka_v1.py SRC DST

« Give a Slab of Poultry Meat to each of … » consomme la viande. Nombre lu
dans le texte de l'etape (chuka_and_champawat_iii_tigris.html) :
- bit 12, Pact Cat Sitter : « each of the three cats in Caer Aval » -> 3 ;
- bit 13, Royal Cat Sitter : « to Shadow » -> 1.
Bit 11 (Vigil Cat Sitter, « each of Elena's Kitties ») : nombre absent de la
capture, rien n'est pose.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
col = d["legendaries"]["gen2_chuka_and_champawat"]["collections"]["chuka_and_champawat_iii_tigris"]
REF = "slab_of_poultry_meat : « Give a Slab of Poultry Meat to … » — ressources/wiki/chuka_and_champawat_iii_tigris.html"
poses = 0
for it in col["items"]:
    n = {12: 3, 13: 1}.get(it["bit"])
    if n:
        assert "Slab of Poultry Meat" in it["how"]["en"], it["bit"]
        it["cost"] = {"slab_of_poultry_meat": n}
        it["cost_ref"] = REF
        poses += 1
assert poses == 2
d["_meta"]["last_updated"] = "2026-10-09"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("Chuka III : 2 couts poses (bits 12 et 13), bit 11 sans nombre")
