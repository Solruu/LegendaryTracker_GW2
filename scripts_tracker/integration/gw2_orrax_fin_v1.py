#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Orrax, dernieres voies d'obtention : captures du 08/10 (lot 3).

Usage : python3 scripts_tracker/integration/gw2_orrax_fin_v1.py SRC DST

- Cassava Root : recolte (plantes de jungle et de desert, 2 garanties au
  domaine) ;
- Milling Stone : coffres et caches de nombreuses cartes (Desert de cristal,
  Thunderhead Peaks...) ;
- Cinnamon Stick : recolte sur les jeunes arbres (Aspen, Ekku, Gummo...) ;
  10 garantis dans le Chef Starter Kit ;
- Milling Basin : marchands de cuisine, 56 cuivre piece (5 pa 60 pc les 10 :
  le data-sort-value 560 est le prix du lot, pas de l'unite). Texte : l'or se
  compte en pieces d'or entieres.
Aucune quantite. Orrax entierement decompose.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
def t(fr, en): return {"fr": fr, "en": en}
def prov(f): return {"verified": True, "checked": "2026-10-08",
                     "ref": f"ressources/wiki/{f}.html, Acquisition (capture du 08/10/2026)"}
def remplace(cid, sources):
    assert all(s.get("type") == "unknown" for s in cc[cid]["sources"]), cid
    cc[cid]["sources"] = sources
remplace("cassava_root", [{"type": "gathering", "free_repeatable": True, "tip": t(
    "Récolte sur les plantes de jungle et de désert (par chance) ; 2 garanties sur le manioc de domaine.",
    "Harvested from jungle and desert plants (by chance); 2 guaranteed from homegrown cassava."), **prov("cassava_root")}])
remplace("milling_stone", [{"type": "chest", "free_repeatable": True, "tip": t(
    "Coffres et caches de nombreuses cartes (2-4 par coffre, jusqu'à 25 dans certaines caches) : Désert de cristal, Thunderhead Peaks…",
    "Chests and caches on many maps (2-4 per chest, up to 25 in some caches): Crystal Desert, Thunderhead Peaks…"), **prov("milling_stone")}])
remplace("cinnamon_stick", [{"type": "gathering", "free_repeatable": True, "tip": t(
    "Récolte sur les jeunes arbres (Aspen, Ekku, Gummo, Kertch, Mimosa…) ; 10 garantis dans le Chef Starter Kit.",
    "Harvested from saplings (Aspen, Ekku, Gummo, Kertch, Mimosa…); 10 guaranteed in the Chef Starter Kit."), **prov("cinnamon_stick")}])
remplace("milling_basin", [{"type": "vendor", "npc": "marchands de cuisine (Chef, Apprentice...)", "paid_repeatable": True,
    "cost": t("56 cuivre pièce (5 pa 60 pc les 10)", "56 copper each (5s 60c per 10)"), "tip": t(
        "Vendu par les marchands de cuisine des zones d'artisanat : 56 cuivre pièce, ou 5 pa 60 pc les 10. Négligeable en or.",
        "Sold by master chefs in crafting areas: 56 copper each, or 5s 60c per 10. Negligible in gold."), **prov("milling_basin")}])
cc["milling_basin"]["farmable"] = False
d["_meta"]["last_updated"] = "2026-10-08"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
