#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ad Infinitum : un seul Unbound (accord d'Antoine, 19/10).

Usage : python3 scripts_tracker/integration/gw2_unbound_doublon_v1.py SRC DST

`unbound_precursor` portait l'apiId 74155, celui d'Ad Infinitum lui-meme, et
n'avait aucun enfant : il doublait `unbound` (72309), dont la chaine est posee
(Solution: Unbound, 5 Pristine Mist Essence, Unbound Wings, Third Order Mist
Frame). Un Unbound etait compte deux fois. Le doublon est supprime ; ce qu'il
portait d'utile (timegate, voie d'obtention) passe sur `unbound`, avec les 28
pages du Fractal Journal (et non ~40).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
JOUR = "2026-10-19"

old = cc.pop("unbound_precursor")
assert old["apiId"] == 74155 and old["qty"] == {"ad_infinitum": 1}
assert not any("unbound_precursor" in (c.get("qty") or {}) for c in cc.values())
u = cc["unbound"]
assert u["apiId"] == 72309 and u["qty"] == {"ad_infinitum": 1}
u["kind"] = "precursor"
u["timegate"] = True
u["timegate_note"] = old["timegate_note"]
u["sources"] = [{"type": "mystic_forge",
                 "tip": {"fr": "Forge mystique : Solution: Unbound + 5 Pristine Mist Essence + Unbound Wings + Third Order Mist Frame. La Solution vient des 3 collections Ad Infinitum I-III (1 Fractal Journal = 28 Fractal Research Pages chacune).",
                         "en": "Mystic Forge: Solution: Unbound + 5 Pristine Mist Essence + Unbound Wings + Third Order Mist Frame. The Solution comes from the 3 Ad Infinitum I-III collections (1 Fractal Journal = 28 Fractal Research Pages each)."},
                 "verified": True, "checked": JOUR,
                 "ref": "ressources/wiki/unbound.html (Recipe) ; ressources/wiki/ad_infinitum.html (Collections)"}]
comps = d["legendaries"]["ad_infinitum"]["components"]
comps[comps.index("unbound_precursor")] = "unbound"
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
