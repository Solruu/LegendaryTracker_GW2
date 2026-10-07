#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Jar of Vinegar : voie d'obtention lue sur la capture du 07/10 (lot 5).

Usage : python3 scripts_tracker/integration/gw2_vinaigre_v1.py SRC DST

Vendu par les marchands de cuisine, 80 cuivre les 10 — meme modele que la
sauce soja (cout en cuivre laisse en texte). Aucune quantite.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
c = d["craft_components"]["jar_of_vinegar"]
assert all(s.get("type") == "unknown" for s in c["sources"])
c["farmable"] = False
c["sources"] = [{"type": "vendor", "npc": "marchands de cuisine (Chef, Apprentice...)", "paid_repeatable": True,
    "cost": {"fr": "80 cuivre les 10", "en": "80 copper per 10"},
    "tip": {"fr": "Vendu par les marchands de cuisine des capitales et de nombreuses cartes : 80 cuivre les 10. Négligeable en or.",
            "en": "Sold by cooking vendors in capitals and many maps: 80 copper per 10. Negligible in gold."},
    "verified": True, "checked": "2026-10-07",
    "ref": "ressources/wiki/jar_of_vinegar.html, Acquisition (capture du 07/10/2026)"}]
d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
