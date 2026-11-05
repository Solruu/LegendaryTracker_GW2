#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prix lus sur le lot de captures du 05/11 (5 pages).

Usage : python3 scripts_tracker/integration/gw2_prix_captures_0511_v1.py SRC DST

- harpy_feathers_consumable.html : Forager Hitkiti (Arca Lake, Harathi
  Hinterlands), 40 pc, apres l'evenement « Defend the skritt thieves while
  they steal harpy eggs » ; lies a l'ame, achetes avec l'Artificier qui
  fabrique les Nesting Materials (Nevermore IV). Composant sans consommateur
  au tracker : prix en conseil, aucune arete.
- recollection_of_the_bearkins_{adversaries,hunts,victories}.html : Unending
  Tribute (Tideland Outlet, Lowland Shore), 25 Amalgamated Gemstones chacune,
  pour reinitialiser le succes et obtenir une copie DE PLUS. Le tracker n'en
  demande qu'une : option non comptee.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
C = d["craft_components"]
J = "2026-11-05"
W = "ressources/wiki/"
h = Path(W + "harpy_feathers_consumable.html").read_text(encoding="utf-8")
assert "Forager Hitkiti" in h and 'alt="Copper coin"' in h and "Defend the skritt thieves" in h
s = [x for x in C["harpy_feathers"]["sources"] if x.get("type") == "vendor"][0]
s.update({"cost": {"fr": "40 pc", "en": "40 copper"},
          "tip": {"fr": "Forager Hitkiti (Lac d'Arca, Hinterlands harathis) : 40 pc, après l'événement « Defend the skritt thieves while they steal harpy eggs ». Lié à l'âme : à acheter avec l'Artificier qui fabrique les Nesting Materials (Nevermore IV).",
                  "en": "Forager Hitkiti (Arca Lake, Harathi Hinterlands): 40 copper, after the event 'Defend the skritt thieves while they steal harpy eggs'. Soulbound: buy it with the Artificer who crafts the Nesting Materials (Nevermore IV)."},
          "checked": J, "ref": W + "harpy_feathers_consumable.html, Acquisition"})
for cid, page in (("memory_of_bearkins_adversaries", "recollection_of_the_bearkins_adversaries"),
                  ("memory_of_the_bearkins_hunts", "recollection_of_the_bearkins_hunts"),
                  ("memory_of_the_bearkins_victories", "recollection_of_the_bearkins_victories")):
    h = Path(W + page + ".html").read_text(encoding="utf-8")
    assert "Unending Tribute" in h and 'alt="Amalgamated Gemstone"' in h and ">25&#160;" in h, page
    s = [x for x in C[cid]["sources"] if x.get("type") == "achievement"][0]
    for k in ("fr", "en"):
        s["tip"][k] = s["tip"][k].replace(" (prix non capturé)", "").replace(" (price not captured)", "")
    s["tip"]["fr"] += " Option, non comptée : Unending Tribute (Tideland Outlet, Lowland Shore), 25 Amalgamated Gemstones."
    s["tip"]["en"] += " Option, not counted: Unending Tribute (Tideland Outlet, Lowland Shore), 25 Amalgamated Gemstones."
    s["ref"] += f" ; {W}{page}.html, Sold by"
    s["checked"] = J
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("4 prix poses en conseil")
