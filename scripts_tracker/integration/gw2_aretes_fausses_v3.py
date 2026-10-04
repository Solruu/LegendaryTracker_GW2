#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Retire les aretes montrees fausses par les controles.

Usage : python3 scripts_tracker/integration/gw2_aretes_fausses_v3.py SRC DST

(v1 : Gift of Adventure (VoE) ; v2 : double monnaie Jade / Castoran — historique git.)

v3 — LE PATRON GEN1 RECOPIE SUR ETERNITY. La recette d'Eternity
(eternity.html, boite « Recipes ») est 1 Sunrise + 1 Twilight + 5 Pile of
Crystalline Dust + 10 Philosopher's Stone, et la fiche le dit elle-meme
(`recipe_verified` du 01/09 : « Eternity ne consomme ni gift d'arme ni gift de
maitrise »). La donnee portait pourtant, depuis l'import initial du 08/07,
une troisieme copie du patron des armes gen1 : gift_of_mastery 1,
gift_of_fortune 1, mystic_coin 250 — exactement ce que portent deja
gen1_sunrise et gen1_twilight, qui sont deux legendaires du tracker que la
collection d'Eternity designe par `legendary_ref`. Les trois cles partent.
Trouve par l'avertissement d'audit « dust_crystalline atteint en direct et
via ... » : les 250 poussieres du Gift of Magic n'avaient rien a faire la.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
E = "gen1_eternity"
for cid, q in (("gift_of_mastery", 1), ("gift_of_fortune", 1), ("mystic_coin", 250)):
    assert cc[cid]["qty"].pop(E) == q, cid
    if "needed_for" in cc[cid]:
        cc[cid]["needed_for"] = [x for x in cc[cid]["needed_for"] if x != E]
reste = {c: v["qty"][E] for c, v in cc.items() if E in (v.get("qty") or {})}
assert reste == {"dust_crystalline": 5, "philosophers_stone": 10}, reste
d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
