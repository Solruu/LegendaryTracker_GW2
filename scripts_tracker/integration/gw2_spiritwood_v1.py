#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Spiritwood Pistol Frame et Spiritwood Staff Shaft : recettes (captures d'Antoine du 14/10/2026).

Usage : python3 scripts_tracker/integration/gw2_spiritwood_v1.py SRC DST

Boite Recipe des deux pages (ressources/wiki/spiritwood_*.html) :
- Pistol Frame (45835) : 5 Pile of Crystalline Dust + 2 Spiritwood Plank + 50 Thermocatalytic Reagent ;
- Staff Shaft  (45888) : 5 Pile of Crystalline Dust + 4 Spiritwood Plank + 50 Thermocatalytic Reagent.
Meme forme que les douze autres pieces spiritwood deja posees.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
RECETTES = {
    "spiritwood_pistol_frame": (45835, {"dust_crystalline": 5, "spiritwood_plank": 2, "thermocatalytic_reagent": 50}),
    "spiritwood_staff_shaft": (45888, {"dust_crystalline": 5, "spiritwood_plank": 4, "thermocatalytic_reagent": 50}),
}
for cle, (api, ings) in RECETTES.items():
    p = cc[cle]
    p.update({"apiId": api, "verified": True, "checked": "2026-10-14",
              "ref": f"ressources/wiki/{cle}.html (boîte Recipe, capture du 14/10/2026)"})
    p["sources"] = [{"type": "craft", "tip": {"fr": "Pièce d'arme artisanale (artisanat 500).", "en": "Crafted weapon part."}}]
    for enfant, n in ings.items():
        c = cc[enfant]
        c.setdefault("qty", {})[cle] = n
        if cle not in c.setdefault("needed_for", []):
            c["needed_for"].append(cle)
d["_meta"]["last_updated"] = "2026-10-14"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("2 recettes spiritwood posees")
