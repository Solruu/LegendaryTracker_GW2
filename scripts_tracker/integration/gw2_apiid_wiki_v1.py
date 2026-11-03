#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""apiId lus sur les captures wiki du 03/11 (lot du retour du wiki).

Usage : python3 scripts_tracker/integration/gw2_apiid_wiki_v1.py SRC DST

C16 (24/10, wiki hors ligne) avait retire 16 apiId qui designaient un autre
objet et pose `apiId_fix` « bon id a lire sur le wiki ». Sept pages capturees
le 03/11 portent l'id deux fois (lien API et gamelink concordants,
INDEX_CONTENU.json), et /v2/items le confirme par le nom
(ressources/api/api_ids_wiki_20261103.json). Meme forme que
legendary_war_insight : apiId pose, `apiId_fix.was` garde l'ancien faux id,
`ref` cite la capture et l'API. L'audit le reclamait (« pas d'apiId alors que
sa capture wiki annonce API N »).

Restent sans id : Fruits of the Shadow, Gift of the Obscure, Memories of
Aurene (404 sur le wiki, titre a trouver), Glob of Condensed Spirit Energy,
Wings of Glory x3, Gift of Ascension, Gift of Shadows, astral_weapons
(groupe, pas d'objet).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
IX = {e["page"]: e for e in json.loads(Path("ressources/INDEX_CONTENU.json").read_text(encoding="utf-8"))}
API = json.loads(Path("ressources/api/api_ids_wiki_20261103.json").read_text(encoding="utf-8"))["items"]
POSER = ["testimony_of_heroics", "exotic_essence_of_luck", "mist_pendant", "gift_of_infinity",
         "gift_of_the_hylek", "gift_of_the_seas", "glimpse"]
for k in POSER:
    c = cc[k]
    ident = IX[k]["api_id"]
    assert ident and str(ident) in API, k
    assert c.get("apiId") is None and "apiId_fix" in c, k
    c["apiId"] = ident
    c["apiId_fix"].update({"checked": "2026-11-03",
                           "ref": f"ressources/wiki/{k}.html (API {ident}) + /v2/items?ids={ident} lu le 03/11 "
                                  f"(« {API[str(ident)]} », ressources/api/api_ids_wiki_20261103.json)"})
    print(k, ident)
d["_meta"]["version"] = "v250"
d["_meta"]["last_updated"] = "2026-11-03"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
