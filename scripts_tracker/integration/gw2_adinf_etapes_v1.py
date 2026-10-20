#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ad Infinitum : ce que les etapes consomment encore sans etre compte (20/10).

Usage : python3 scripts_tracker/integration/gw2_adinf_etapes_v1.py SRC DST

Decision d'Antoine (20/10) : les Balls of Dark Energy se comptent — c'est un
cout, il s'affiche — et leurs contournements sont dits a cote.

1. Balls of Dark Energy : `cost` des quatre etapes Aetherblade (1 / 2 / 3 / 3,
   icone lue sur les captures des collections). Conseil du composant : 14 sont
   rendues par les recyclages de Finite Result (5) et Upper Bound (9), que la
   chaine fabrique de toute facon (ball_of_dark_energy.html, « Guaranteed
   amounts »).
2. Fractal Journal : les quatre « Field Research Paper » s'achetent chacun
   contre un journal (captures des collections) ; un journal = 28 Fractal
   Research Pages (fractal_journal.html). La cle a plat 112 devient
   l'arete 28 : les pages tombent quand l'etape est faite.
3. Gift of Wood et Gift of Metal : « Lessons in Arbology » et « Lessons in
   Metallurgy » (collection IV) les consomment (lessons_in_*.html ; « The Gift
   of Metal is consumed in the process »). Ils n'etaient comptes nulle part.
4. Fractal Research Page : sources lues sur fractal_journal.html (6 fractales
   CM, coffre hebdomadaire), au lieu des trois CM de la note d'origine.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
A = d["legendaries"]["ad_infinitum"]["collections"]
J = "2026-10-20"
W = "ressources/wiki/"
CAP = {"adinf_1": "ad_infinitum_i_finite_result", "adinf_2": "ad_infinitum_ii_upper_bound",
       "adinf_3": "ad_infinitum_iii_unbound", "adinf_4": "legendary_backpack_ad_infinitum"}


def pose(col, bit, debut, cout, ref=None):
    it = next(i for i in A[col]["items"] if i["bit"] == bit)
    assert it["name"].startswith(debut), (col, bit, it["name"])
    c = it.setdefault("cost", {})
    for k, v in cout.items():
        assert k not in c
        c[k] = v
    it["cost_ref"] = ref or f"{W}{CAP[col]}.html, tableau « Collection items »"


# 1.
for col, bit, nom, n in (("adinf_1", 10, "Aetherblade Recruitment Form", 1),
                         ("adinf_2", 10, "Aetherblade Handbook", 2),
                         ("adinf_3", 10, "Aetherblade Secret Handshake", 3),
                         ("adinf_4", 9, "Aetherblade Diploma", 3)):
    pose(col, bit, nom, {"ball_dark_energy": n})
b = cc["ball_dark_energy"]
b["sources"][0]["tip"] = {
    "fr": "Recycler une pièce élevée (arme ou armure : garanti) avec un kit de recyclage élevé. Ad Infinitum : la chaîne fabrique Finite Result puis Upper Bound, dont le recyclage (obligatoire pour leurs Spirits) rend 5 puis 9 Balls — 14 en tout, à déduire de ce que réclament les collections et les cubes. Option rapide : une pièce élevée chez Smoxxi (vendeur de raid) pour 250 Magnetite Shards + 15 po, puis la recycler.",
    "en": "Salvage an ascended piece (weapon or armor: guaranteed) with an ascended salvage kit. Ad Infinitum: the chain crafts Finite Result then Upper Bound, whose salvage (required for their Spirits) returns 5 then 9 Balls — 14 in all, to set against what the collections and cubes require. Quick option: an ascended piece from Smoxxi (raid vendor) for 250 Magnetite Shards + 15g, then salvage it."}
b["sources"][0]["verified"] = True
b["sources"][0]["checked"] = J
b["sources"][0]["ref"] = f"{W}ball_of_dark_energy.html, Acquisition"
b["best"] = "salvage"

# 2.
assert "fractal_journal" not in cc
cc["fractal_journal"] = {
    "name": "Fractal Journal", "apiId": 75439, "kind": "intermediate", "farmable": True,
    "qty": {}, "needed_for": [],
    "sources": [{"type": "craft", "tip": {"fr": "28 Fractal Research Pages, combinées par double-clic sur la pile.",
                                          "en": "28 Fractal Research Pages, combined by double-clicking the stack."},
                 "verified": True, "checked": J, "ref": f"{W}fractal_journal.html, Acquisition"}],
    "verified": True, "checked": J, "ref": f"{W}fractal_journal.html"}
for col, bit, nom in (("adinf_1", 5, "Ascalonian Fractal Field Research Paper"),
                      ("adinf_2", 5, "Molten Alliance Fractal Field Research Paper"),
                      ("adinf_3", 5, "Thaumanova Fractal Field Research Paper"),
                      ("adinf_4", 5, "Aetherblade Fractal Field Research Paper")):
    pose(col, bit, nom, {"fractal_journal": 1})
p = cc["fractal_research_page"]
assert p["qty"] == {"ad_infinitum": 112}
p["qty"] = {"fractal_journal": 28}
p["needed_for"] = ["fractal_journal"]
cc["fractal_journal"]["needed_for"] = []
p["sources"] = [{"type": "fractals_recommended", "free_repeatable": True, "cadence": "quotidienne",
                 "verified": True, "checked": J, "ref": f"{W}fractal_journal.html, Acquisition",
                 "tip": {"fr": "1 par fractale recommandée quotidienne (3 par jour dès le palier 3), 1 par fractale en mode défi parmi six (Kinfall, Nightmare, Shattered Observatory, Sunqua Peak, Silent Surf, Lonely Tower : jusqu'à 6 par jour au palier 4), et 2 par Fractal Fighter's Cache hebdomadaire (jusqu'à 8 par semaine au palier 4).",
                         "en": "1 per daily recommended fractal (3 a day from tier 3), 1 per challenge-mode fractal out of six (Kinfall, Nightmare, Shattered Observatory, Sunqua Peak, Silent Surf, Lonely Tower: up to 6 a day at tier 4), and 2 per weekly Fractal Fighter's Cache (up to 8 a week at tier 4)."}}]

# 3.
pose("adinf_4", 10, "Lessons in Arbology", {"gift_of_wood": 1}, f"{W}lessons_in_arbology.html, Acquisition")
pose("adinf_4", 11, "Lessons in Metallurgy", {"gift_of_metal": 1}, f"{W}lessons_in_metallurgy.html, Acquisition (« consumed »)")

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
