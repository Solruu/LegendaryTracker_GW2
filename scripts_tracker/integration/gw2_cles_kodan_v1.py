#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kodan Cache Key : le cout des cles de la voie coffres, et l'or renouvelable.

Usage : python3 scripts_tracker/integration/gw2_cles_kodan_v1.py SRC DST

1. Depuis la v455, les Mursaat Runestones se comptent par les coffres de
   Janthir. Chaque coffre demande une Kodan Cache Key, que le tracker ne
   comptait pas. Decision d'Antoine (05/11/2026) : integrer ce cout, sans
   rien changer d'autre.
   - Taux : ~70 % de runestone par Major Kodan Cache / Mursaat Ruins Cache
     (captures major_kodan_cache.html, mursaat_ruins_cache.html).
   - Nombre de coffres = ceil(runestones / 0,7) : 250 -> 358 (Gift of the
     Mistburned Isles), 100 -> 143 (Gift of Uncovered Grounds). L'arete est
     posee sur le don, la ou le nombre de coffres est entier.
   - Prix : 2 Curious Mursaat Remnants + 2 100 karma, 21 par jour tous
     vendeurs confondus (kodan_cache_key.html, Sold by). Le palier a
     1 + 1 050 (maitrise Janthir Explorer Proficiency, 4 par jour) reste en
     source : il ne couvre pas le volume.
   - Non compte, en conseil : la Locked Mythical Kodan Cache (deterree au
     warclaw, 3 a 5 par jour selon la carte) rend 1-2 runestones GARANTIS
     pour une cle (mythical_kodan_cache.html, locked_mythical_kodan_cache.html),
     soit le meilleur emploi d'une cle.
2. gold_coin : sa source « account » ne portait pas `free_repeatable`, d'ou
   l'avertissement « aucune piste renouvelable ». Meme forme que le karma.
"""
import json
import math
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


kk, mk, mr = texte("kodan_cache_key"), texte("major_kodan_cache"), texte("mursaat_ruins_cache")
my, lm = texte("mythical_kodan_cache"), texte("locked_mythical_kodan_cache")
assert 'title="Curious Mursaat Remnants"' in kk and "2,100" in kk and "Limit 21 per day." in kk
assert "(~70%)" in mk and "(~70%)" in mr
assert "(1-2)" in my and "Mursaat Runestone" in my
assert "per day per account" in lm

TAUX = 0.7
rs = C["mursaat_runestone"]["qty"]
aretes = {g: math.ceil(n / TAUX) for g, n in rs.items()}
assert aretes == {"gift_of_the_mistburned_isles": 358, "gift_of_uncovered_grounds": 143}, aretes

assert "kodan_cache_key" not in C
refs = f"{W}kodan_cache_key.html, Sold by ; {W}major_kodan_cache.html ; {W}mursaat_ruins_cache.html"
C["kodan_cache_key"] = {
    "name": "Kodan Cache Key",
    "kind": "acquire",
    "farmable": True,
    "qty": dict(aretes),
    "sources": [
        {"type": "vendor", "paid_repeatable": True, "paid_cap": {"n": 21, "period": "day", "per": "compte"}, "verified": True, "checked": J, "ref": refs,
         "cost": {"fr": "2 Curious Mursaat Remnants + 2 100 karma", "en": "2 Curious Mursaat Remnants + 2,100 karma"},
         "tip": {"fr": "Davo Zes (Bava Nisos), Emlyn Digby (Côte des basses terres), Parting Kindness (Syntri de Janthir), Patches (Landes de Feu-de-Brume) : 2 Curious Mursaat Remnants + 2 100 karma, 21 par jour tous vendeurs confondus. Avec la maîtrise Janthir Explorer Proficiency : 4 de plus par jour à 1 + 1 050. Compté au premier tarif : le second ne couvre pas le volume.",
                 "en": "Davo Zes (Bava Nisos), Emlyn Digby (Lowland Shore), Parting Kindness (Janthir Syntri), Patches (Mistburned Barrens): 2 Curious Mursaat Remnants + 2,100 karma, 21 per day across all vendors. With the Janthir Explorer Proficiency mastery: 4 more per day at 1 + 1,050. Counted at the first price: the second does not cover the volume."}},
        {"type": "achievement", "verified": True, "checked": J, "ref": f"{W}kodan_cache_key.html, Achievements",
         "tip": {"fr": "Janthiri Treasure Hunter (ouvrir 100 caches kodan) : 2 clés, une seule fois.",
                 "en": "Janthiri Treasure Hunter (open 100 kodan caches): 2 keys, once."}},
    ],
    "note": {"fr": "Une clé par coffre. Comptées sur la voie Major Kodan Cache / Mursaat Ruins Cache : ~70 % de runestone, donc ceil(runestones / 0,7) coffres — 358 pour les 250 du Gift of the Mistburned Isles, 143 pour les 100 du Gift of Uncovered Grounds. 💡 Meilleur emploi d'une clé : la Locked Mythical Kodan Cache, déterrée au warclaw (1 à 3 par jour en Côte des basses terres, 1 en Syntri, 1 dans les Landes), rend 1-2 runestones garantis. Non comptée : son rendement moyen n'est pas donné par la source.",
             "en": "One key per chest. Counted on the Major Kodan Cache / Mursaat Ruins Cache route: ~70% runestone, so ceil(runestones / 0.7) chests — 358 for the 250 of the Gift of the Mistburned Isles, 143 for the 100 of the Gift of Uncovered Grounds. 💡 Best use of a key: the Locked Mythical Kodan Cache, dug up by the warclaw (1-3 per day in Lowland Shore, 1 in Syntri, 1 in the Barrens), yields 1-2 guaranteed runestones. Not counted: the source gives no average yield."},
    "cadence": {"sources": [{
        "label": {"fr": "Vendeurs de pièces insolites de Janthir — 21 par jour (+4 avec Janthir Explorer Proficiency)",
                  "en": "Janthir Unusual Coin vendors — 21 per day (+4 with Janthir Explorer Proficiency)"},
        "period": "day", "cap": 21,
        "cost": {"fr": "2 Curious Mursaat Remnants + 2 100 karma la clé ; plafond partagé entre les 4 vendeurs.",
                 "en": "2 Curious Mursaat Remnants + 2,100 karma per key; cap shared across the 4 vendors."},
        "verified": True, "checked": J, "ref": f"{W}kodan_cache_key.html, Sold by"}],
        "verified": True, "checked": J, "ref": f"{W}kodan_cache_key.html, Sold by"},
    "verified": True, "checked": J, "ref": refs,
    "needed_for": sorted(aretes),
    "apiId": 103530,
}
for mid, v in (("karma", 2100), ("curious_mursaat_remnants", 2)):
    assert "kodan_cache_key" not in C[mid]["qty"]
    C[mid]["qty"]["kodan_cache_key"] = v
    nf = C[mid].setdefault("needed_for", [])
    if "kodan_cache_key" not in nf:
        nf.append("kodan_cache_key")

# Note de la monnaie : elle chiffrait 725 pour Orrax
n = C["curious_mursaat_remnants"]["note"]
assert n["fr"].startswith("⏳ 725 pour Orrax Manifested.") and n["en"].startswith("⏳ 725 for Orrax Manifested.")
n["fr"] = n["fr"].replace("⏳ 725 pour Orrax Manifested.", "⏳ 1 441 pour Orrax Manifested : 725 pour ses dons, 716 pour les 358 Kodan Cache Keys de ses runestones.", 1)
n["en"] = n["en"].replace("⏳ 725 for Orrax Manifested.", "⏳ 1,441 for Orrax Manifested: 725 for its gifts, 716 for the 358 Kodan Cache Keys of its runestones.", 1)
n["fr"] = n["fr"].replace("soit environ 23 passages", "soit environ 45 passages pour l'ensemble")
n["en"] = n["en"].replace("so about 23 runs", "so about 45 runs in all")

# 2. Or renouvelable
g = [s for s in C["gold_coin"]["sources"] if s.get("type") == "account"]
assert len(g) == 1 and "free_repeatable" not in g[0]
g[0]["free_repeatable"] = True
g[0]["cadence"] = "à volonté"

out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("kodan_cache_key cree (358 + 143 cles) ; or renouvelable")
