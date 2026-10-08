#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""W5 : 39 trefles et 250 lingots cristallins retires de 15 armes gen3 (accord d'Antoine, 08/10/2026).

Usage : python3 scripts_tracker/integration/gw2_gen3_trefles_lingots_v1.py SRC DST

Quinze gen3 portaient en cle a plat `mystic_clover: 39` et
`crystalline_ingot: 250` ; Aurene's Rending, non. Verification complete, dans
l'ordre de la recette (Mystic Forge : Gift of Aurene's X + precurseur + Gift
of Jade Mastery + Draconic Tribute) :
- table « Full material list » d'Aurene's Bite et d'Aurene's Rending :
  identiques, 38 trefles (Draconic Tribute), aucun lingot cristallin ; elle
  s'arrete au precurseur ;
- precurseur (dragons_bite.html) : Fortified Precursor Blade + Hilt +
  Transcendent Crystal + 100 Memory of Aurene ;
- pieces fortifiees (captures du 08/10) : piece Deldrimor/Spiritwood +
  Blessing of the Jade Empress + 20 Chunk of Pure Jade (ou Petrified
  Echovald Resin) ;
- Transcendent Crystal : 10 ecto + Eldritch Scroll + 100 Hydrocatalytic
  Reagent + 10 Amalgamated Gemstone ; Memory of Aurene : coffres et evenements.
Nulle part 39 trefles ni lingot cristallin : les cles sont retirees, et les
quinze armes rejoignent Rending (38 trefles).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
for cid, n in (("mystic_clover", 39), ("crystalline_ingot", 250)):
    c = cc[cid]
    cibles = [k for k in c["qty"] if k.startswith("gen3_")]
    assert len(cibles) == 15 and all(c["qty"][k] == n for k in cibles), (cid, cibles)
    for k in cibles:
        del c["qty"][k]
    c["needed_for"] = [x for x in c.get("needed_for", []) if x not in cibles]
    if c.get("qty_overlap_verified"):
        c["qty_overlap_verified"] = [x for x in c["qty_overlap_verified"] if x not in cibles]
        if not c["qty_overlap_verified"]:
            del c["qty_overlap_verified"]
d["_meta"]["last_updated"] = "2026-10-08"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
