#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Endless Summer : prix vendeur des deux pieces de don, et compte d'armurerie.

Usage : python3 scripts_tracker/integration/gw2_endless_summer_vendeurs_v1.py SRC DST

Trouve en testant le plan de farm du 05/11 contre le tracker.

1. Concentrated Chromatic Sap (Sharpwhisker, Glimmering Arches, Shipwreck
   Strand) et Patron of the Magical Arts Plaque (Huntmaster Arnorr, Untamed
   Crags, Starlit Weald) coutent chacun 250 po + 500 de la monnaie de carte +
   300 000 karma. Le tracker portait l'arete de la monnaie (500 seve / 500
   pierre) mais ni l'or ni le karma : Endless Summer, Aetheric Anchor et
   Selachimorpha etaient sous-comptes de 500 po et 600 000 karma chacun.
2. armory_max_count des trinkets : valeurs inversees. Les captures disent
   « non-unique » / « Up to two » pour Endless Summer, Conflux, Stella Radians,
   Strife Unending, et « Unique : Yes » pour Aurora, Vision, Coalescence.
   Champ lu par aucun script ni par le JSX : aucun total ne bouge.
3. coalescence.note disait « Composant requis pour Vision » : la recette de
   Vision (Glimpse + Mystic Tribute + Gift of Prescience + Gift of Arid
   Mastery) ne la contient pas, et la note de Vision le dit deja.
"""
import json
import re
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
C, L = d["craft_components"], d["legendaries"]
J = "2026-11-05"
W = "ressources/wiki/"


def texte(page):
    return Path(W + page + ".html").read_text(encoding="utf-8")


# 1. Prix vendeur
VENDEURS = {
    "concentrated_chromatic_sap": ("Tyrian Alliance Representative Sharpwhisker", "Glimmering Arches",
                                   "Shipwreck Strand", "Chromatic Sap", "Shipwreck Strand Mastery",
                                   "Grève du Naufrage", "Shipwreck Strand Mastery"),
    "patron_of_the_magical_arts_plaque": ("Huntmaster Arnorr", "Untamed Crags", "Starlit Weald",
                                          "Raw Enchanting Stone", "Starlit Weald Mastery",
                                          "Bois étoilé", "Starlit Weald Mastery"),
}
for cid, (pnj, aire, zone, monnaie, succes, zone_fr, _) in VENDEURS.items():
    h = texte(cid)
    assert pnj in h and 'alt="Gold coin"' in h and 'title="Karma"' in h and f'title="{monnaie}"' in h, cid
    assert re.search(r'>250&#160;<a href="/wiki/Coin" title="Gold coin">.*?&#160;\+&#160;500&#160;<a href="/wiki/[^"]+" title="'
                     + re.escape(monnaie) + r'">.*?&#160;\+&#160;300,000&#160;', h, re.S), cid
    c = C[cid]
    for mid, v in (("gold_coin", 250), ("karma", 300000)):
        q = C[mid]["qty"]
        assert cid not in q, (mid, cid)
        q[cid] = v
        nf = C[mid].setdefault("needed_for", [])
        if cid not in nf:
            nf.append(cid)
    c["sources"] = [{
        "type": "vendor", "verified": True, "checked": J,
        "ref": f"{W}{cid}.html, Acquisition",
        "cost": {"fr": f"250 po + 500 {monnaie} + 300 000 karma",
                 "en": f"250 gold + 500 {monnaie} + 300,000 karma"},
        "tip": {"fr": f"{pnj} ({aire}, {zone_fr}) : 250 po + 500 {monnaie} + 300 000 karma. Requiert le succès {succes}.",
                "en": f"{pnj} ({aire}, {zone}): 250 gold + 500 {monnaie} + 300,000 karma. Requires the {succes} achievement."},
    }]

# 2. Compte d'armurerie des trinkets
ARMURERIE = {"endless_summer": 2, "conflux": 2, "stella_radians": 2, "strife_unending": 2,
             "aurora": 1, "vision": 1, "coalescence": 1}
for lid, n in ARMURERIE.items():
    h = texte(lid)
    if n == 2:
        assert "non-unique" in h, lid
    else:
        assert re.search(r'title="Unique">Unique</a></dt>\s*<dd>Yes</dd>', h), lid
    L[lid]["armory_max_count"] = n

# 3. Note de Coalescence
n = L["coalescence"]["note"]
assert "Composant requis pour Vision. " in n["fr"] and "Required component for Vision. " in n["en"]
n["fr"] = n["fr"].replace("Composant requis pour Vision. ", "")
n["en"] = n["en"].replace("Required component for Vision. ", "")

out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("2 prix vendeur, 7 comptes d'armurerie, 1 note")
