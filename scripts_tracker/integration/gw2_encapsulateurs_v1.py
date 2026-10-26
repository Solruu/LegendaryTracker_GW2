#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Vision : les 6 Memory Essence Encapsulators tombent avec leurs etapes (26/10).

Usage : python3 scripts_tracker/integration/gw2_encapsulateurs_v1.py SRC DST

Signale par Antoine (26/10) : collections terminees, l'onglet Composants
reclamait toujours 6 encapsulateurs. Ils etaient une cle a plat sur Vision
(6), alors que chacun est consomme par une etape : « Vision of Enemies » (bit 3)
des six collections de carte (vis_istan, vis_kourna, vis_jahai,
vis_sandswept, vis_thunderhead, vis_dragonfall) — « consumed on the boss
kill » (note du composant). La cle devient un `cost` de 1 sur chacune
(structure existante) : meme total a collections vierges, et chaque
encapsulateur disparait quand son etape est faite.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
m = cc["memory_essence_encapsulator"]
assert m["qty"].pop("vision") == 6
if isinstance(m.get("needed_for"), list) and "vision" in m["needed_for"]:
    m["needed_for"].remove("vision")
V = d["legendaries"]["vision"]["collections"]
for col in ("vis_istan", "vis_kourna", "vis_jahai", "vis_sandswept", "vis_thunderhead", "vis_dragonfall"):
    it = next(i for i in V[col]["items"] if i["bit"] == 3)
    assert it["name"].startswith("Vision of Enemies") and "Memory Essence Encapsulator" in it["how"]["en"], (col, it["name"])
    assert not it.get("cost")
    it["cost"] = {"memory_essence_encapsulator": 1}
    it["cost_ref"] = f"how de l'etape (wiki, « holding a Memory Essence Encapsulator ») ; note du composant : consomme au kill"
d["_meta"]["last_updated"] = "2026-10-26"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
