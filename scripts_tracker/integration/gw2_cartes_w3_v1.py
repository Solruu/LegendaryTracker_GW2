#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""W3 : bois petrifie — Ember Bay seulement (captures du 08/10).

Usage : python3 scripts_tracker/integration/gw2_cartes_w3_v1.py SRC DST

`draconis_mons.html`, section « Map resources » : Unbound Magic, Fire Orchid
Blossom, Ancient Asuran Power Source — aucun Petrified Wood. `ember_bay.html`
le donne (Petrified Stump, vendeurs de coeur, recompense de completion). Le
libelle de cadence « Ember Bay + Draconis Mons » etait faux pour moitie ; son
plafond de 45 ne citait que le JSX du tracker (reference circulaire) : garde,
mais `verified: false`. Aucune quantite.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
c = d["craft_components"]["petrified_wood_lw3"]
s = c["cadence"]["sources"][0]
assert s["label"]["en"] == "Daily harvest — Ember Bay + Draconis Mons"
s["label"] = {"fr": "Récolte quotidienne — Baie des braises", "en": "Daily harvest — Ember Bay"}
# Le plafond de 45 n'avait pour source que le JSX du tracker lui-meme
# (v150, onglet Persos) : une reference circulaire. Le nombre reste, il n'est
# plus presente comme verifie.
s["cost"] = {"fr": "45 par jour et par compte selon une ancienne note du tracker — plafond non sourcé sur le wiki.",
             "en": "45 per day per account per an old tracker note — cap not sourced on the wiki."}
s["verified"] = False
s["checked"] = "2026-10-08"
s["ref"] = ("gw2_legendary_tracker_v150 onglet Persos (reference circulaire) ; "
            "ember_bay.html et draconis_mons.html « Map resources » (08/10/2026) : "
            "le bois petrifie n'est que sur Ember Bay")
d["_meta"]["last_updated"] = "2026-10-08"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
