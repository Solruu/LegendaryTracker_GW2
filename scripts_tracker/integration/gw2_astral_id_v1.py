#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Astral Weapons : l'apiId d'une seule arme range a part (24/10).

Usage : python3 scripts_tracker/integration/gw2_astral_id_v1.py SRC DST

`astral_weapons` regroupe les six armes Astral exigees par Vision ; il portait
85760, que /v2/items nomme « Marshal's Astral Cleaver »
(ressources/api/api_noms_composants_20261024.json) : la synchro aurait lu le
stock d'une arme comme celui des six. Accord d'Antoine (24/10) : l'id passe
dans `apiId_fix` (structure existante), sans remplacant — un groupe n'a pas
d'id d'objet.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
a = d["craft_components"]["astral_weapons"]
assert a.get("apiId") == 85760
a["apiId_fix"] = {"was": 85760, "checked": "2026-10-24", "verified": True,
                  "ref": "ressources/api/api_noms_composants_20261024.json : 85760 = « Marshal's Astral Cleaver », une des six armes ; groupe sans id d'objet"}
del a["apiId"]
a["sources"] = [s for s in a.get("sources") or [] if s.get("type") != "trading_post"]
d["_meta"]["last_updated"] = "2026-10-24"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
