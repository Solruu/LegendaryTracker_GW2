#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Druid Runestone : les trois voies d'achat des fragments (Antoine, 19/10).

Usage : python3 scripts_tracker/integration/gw2_henge_voies_v1.py SRC DST

Cinq vendeurs, 1 fragment chacun par jour (wiki:Druid_Runestone_Fragment,
capture d'Antoine du 19/10) : 4 a 1 050 karma, Supplymaster Hanjo a 1 000
magie non liee. Voie comptee (gw2_henge_pierres_v1) : les cinq, 1 pierre par
jour, 4 200 karma + 1 000 UM. Les deux autres sont des alternatives, plus
lentes, decrites sans etre chiffrees dans les totaux :
- tout karma : 4 fragments par jour, 16 pierres = 80 fragments en 20 jours,
  84 000 karma ;
- tout UM : 1 fragment par jour, 80 jours, 80 000 UM.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
dr = d["craft_components"]["druid_runestone"]
s = dr["sources"][0]
assert s["type"] == "renown_heart"
s["tip"] = {
    "fr": "5 fragments font 1 pierre. 5 vendeurs du Mont Draconis, 1 fragment chacun par jour et par COMPTE : les 4 PNJ des cœurs à 1 050 karma, Supplymaster Hanjo (Débarcadère du marin) à 1 000 magie déchaînée. Voie comptée : les cinq, 1 pierre par jour pour 4 200 karma + 1 000 magie déchaînée (16 jours). Alternatives plus lentes : tout karma, 4 fragments par jour (20 jours, 84 000 karma) ; tout magie déchaînée, 1 fragment par jour (80 jours, 80 000).",
    "en": "5 fragments make 1 stone. 5 Draconis Mons vendors, 1 fragment each per day per ACCOUNT: the 4 heart NPCs at 1,050 karma, Supplymaster Hanjo (Mariner Landing) at 1,000 Unbound Magic. Counted path: all five, 1 stone a day for 4,200 karma + 1,000 Unbound Magic (16 days). Slower alternatives: karma only, 4 fragments a day (20 days, 84,000 karma); Unbound Magic only, 1 fragment a day (80 days, 80,000)."}
s["checked"] = "2026-10-19"
s["ref"] = "wiki:Druid_Runestone_Fragment (tableau des vendeurs, capture d'Antoine du 19/10) + ressources/wiki/the_druid_stone.html"
d["_meta"]["last_updated"] = "2026-10-19"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
