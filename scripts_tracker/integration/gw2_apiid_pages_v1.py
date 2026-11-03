#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""apiId et pages des composants dont la cle ne porte pas le titre reel (03/11).

Usage : python3 scripts_tracker/integration/gw2_apiid_pages_v1.py SRC DST

Six des seize `apiId_fix` de C16 avaient leur page au depot sous un autre nom
que la cle (glob_condensed_spirit_energy -> glob_of_condensed_spirit_energy,
wings_of_glory_recruit -> recruits_wings_of_glory…) : l'id se lit sur la
capture (lien API et gamelink) et /v2/items le confirme par le nom
(ressources/api/api_ids_wiki_20261103_b.json). Le champ `wiki` est pose pour
que l'index et la file trouvent la page.
Deux titres corriges (redirection ou 404 du 03/11) : Fruits of the Shadow ->
Fruit of the Shadow ; Harpy Feathers -> Harpy Feather.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-11-03"
IX = {e["page"]: e for e in json.loads(Path("ressources/INDEX_CONTENU.json").read_text(encoding="utf-8"))}
API = json.loads(Path("ressources/api/api_ids_wiki_20261103_b.json").read_text(encoding="utf-8"))["items"]
POSER = {"glob_condensed_spirit_energy": ("glob_of_condensed_spirit_energy", "Glob_of_Condensed_Spirit_Energy"),
         "wings_of_glory_recruit": ("recruits_wings_of_glory", "Recruit%27s_Wings_of_Glory"),
         "wings_of_glory_champion": ("champions_wings_of_glory", "Champion%27s_Wings_of_Glory"),
         "wings_of_glory_elite": ("elites_wings_of_glory", "Elite%27s_Wings_of_Glory"),
         "gift_of_shadows_orrax": ("gift_of_shadows", "Gift_of_Shadows"),
         "gift_of_ascension_fractal": ("gift_of_ascension", "Gift_of_Ascension")}
for k, (page, wiki) in POSER.items():
    c = cc[k]
    ident = IX[page]["api_id"]
    assert ident and str(ident) in API and c.get("apiId") is None, k
    c["apiId"] = ident
    c["wiki"] = wiki
    c["apiId_fix"].update({"checked": J, "ref": f"ressources/wiki/{page}.html (API {ident}) + /v2/items?ids={ident} lu le 03/11 (« {API[str(ident)]} », ressources/api/api_ids_wiki_20261103_b.json)"})
    print(k, ident)
for k, wiki in (("fruits_of_the_shadow", "Fruit_of_the_Shadow"), ("harpy_feathers", "Harpy_Feather")):
    cc[k]["wiki"] = wiki
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
