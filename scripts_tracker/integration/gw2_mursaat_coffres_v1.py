#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mursaat Runestone : les coffres de Janthir deviennent la voie comptee.

Usage : python3 scripts_tracker/integration/gw2_mursaat_coffres_v1.py SRC DST

Decision d'Antoine (05/11/2026) : la voie par defaut est le farm des coffres,
pas l'achat a 200 Ancient Coins.

SUPPRESSION SIGNALEE : l'arete `ancient_coin -> mursaat_runestone` (200) est
retiree, avec ses lignes `needed_for` (mursaat_runestone, orrax_manifested). Elle imposait l'achat vendeur et
comptait 50 000 Ancient Coins pour Orrax Manifested et 20 000 pour Klobjarne
Geirr. La regle de `gold_coin` vaut ici aussi : un achat qui ne fait
qu'accelerer une source farmable reste en source alternative, hors total.

Captures du 05/11 (ressources/wiki/) :
- mursaat_ruins_cache.html : Landes de Feu-de-Brume, 1 fois par jour et par
  compte, 8 coffres au plus (4 aleatoires + 4 fixes derriere un Miroir
  mursaat, maitrise Mursaat Mirror and Movement), ~70 % de runestone.
- major_kodan_cache.html : Cote des basses terres (10 au plus) et Syntri de
  Janthir (11 au plus), memes regles, ~70 %.
- kodan_cache_key.html : une cle par coffre ; 2 Curious Mursaat Remnants +
  2 100 karma (21/jour, partages entre les 4 vendeurs), ou 1 + 1 050 avec la
  maitrise Janthir Explorer Proficiency (4/jour).
- lowland_expertise.html : 4 et 6 piles ajoutent materiau de carte et pieces,
  pas de runestone.
La cle n'est pas chainee : son cout par runestone dependrait du taux de drop,
une moyenne que la source ne donne pas.
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


def texte(page):
    return Path(W + page + ".html").read_text(encoding="utf-8")


mr, mk, kk = texte("mursaat_ruins_cache"), texte("major_kodan_cache"), texte("kodan_cache_key")
assert "once per day per account" in mr and "maximum of 8 chests" in mr and "Mursaat Mirror and Movement" in mr
assert "Chance for" in mr and "(~70%)" in mr
assert "once per day per account" in mk and "10 for" in mk and "11 for" in mk and "(~70%)" in mk
assert 'title="Curious Mursaat Remnants"' in kk and "Limit 21 per day." in kk and "Limit 4 per day." in kk
assert "Janthir Explorer Proficiency" in kk

# Suppression signalee
ac = C["ancient_coin"]
assert ac["qty"].pop("mursaat_runestone") == 200
# Orrax n'atteignait les Ancient Coins que par cette arete : sa ligne part aussi.
ac["needed_for"] = [x for x in ac.get("needed_for", []) if x not in ("mursaat_runestone", "orrax_manifested")]

rs = C["mursaat_runestone"]
refs = f"{W}mursaat_ruins_cache.html ; {W}major_kodan_cache.html ; {W}kodan_cache_key.html, Sold by"
for s in rs["sources"]:
    if s.get("type") == "chest":
        s["tip"] = {
            "fr": "Voie comptée. Major Kodan Cache (Côte des basses terres, 10 au plus ; Syntri de Janthir, 11 au plus) et Mursaat Ruins Cache (Landes de Feu-de-Brume, 8 au plus, dont 4 fixes derrière un Miroir mursaat) : chaque coffre s'ouvre une fois par jour et par compte, ~70 % de runestone. Une Kodan Cache Key par coffre : 2 Curious Mursaat Remnants + 2 100 karma (21 par jour, tous vendeurs confondus), ou 1 + 1 050 avec la maîtrise Janthir Explorer Proficiency (4 par jour). Repérage : Sniff, ou le Treasure Hunter Protocol. Les 4 coffres fixes des Landes demandent la maîtrise Mursaat Mirror and Movement. Garanti aussi dans le Honeycomb-Covered Gear Bag, la Mythical Kodan Cache (1-2) et le Slime-Encrusted Mursaat Strongbox.",
            "en": "Counted route. Major Kodan Cache (Lowland Shore, up to 10; Janthir Syntri, up to 11) and Mursaat Ruins Cache (Mistburned Barrens, up to 8, 4 of them static behind a Mursaat Mirror): each chest opens once per day per account, ~70% runestone. One Kodan Cache Key per chest: 2 Curious Mursaat Remnants + 2,100 karma (21 per day, shared across vendors), or 1 + 1,050 with the Janthir Explorer Proficiency mastery (4 per day). Locate them with Sniff or the Treasure Hunter Protocol. The 4 static Barrens chests need the Mursaat Mirror and Movement mastery. Also guaranteed from the Honeycomb-Covered Gear Bag, Mythical Kodan Cache (1-2) and Slime-Encrusted Mursaat Strongbox."}
        s["checked"], s["ref"] = J, refs
    elif s.get("type") == "vendor":
        s["tip"]["fr"] += " Raccourci, jamais compté : les coffres sont la voie par défaut (décision d'Antoine, 05/11/2026)."
        s["tip"]["en"] += " Shortcut, never counted: chests are the default route (Antoine's decision, 2026-11-05)."
rs["cadence"] = {"sources": [{
    "label": {"fr": "Coffres kodan et mursaat de Janthir — 1 fois par jour et par coffre",
              "en": "Janthir kodan and mursaat caches — once per day per chest"},
    "period": "day", "cap": 29,
    "cost": {"fr": "29 coffres au plus (10 + 11 + 8), ~70 % de runestone chacun, une Kodan Cache Key par coffre.",
             "en": "Up to 29 chests (10 + 11 + 8), ~70% runestone each, one Kodan Cache Key per chest."},
    "verified": True, "checked": J, "ref": refs}],
    "verified": True, "checked": J, "ref": refs}
rs["checked"], rs["ref"] = J, refs

out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("arete ancient_coin -> mursaat_runestone supprimee ; voie coffres posee")
