#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Legendary Insight comptee deux fois sur Gift of Prowess et Gift of Compassion (04/11).

Usage : python3 scripts_tracker/integration/gw2_insight_double_v1.py SRC DST

Les deux dons portaient le meme ingredient sous deux composants :
`legendary_insight` (monnaie de portefeuille, id 70) ET
`legendary_insight_consumable` (objet 77302), 25 chacun pour Gift of Prowess,
150 chacun pour Gift of Compassion. RELECTURE_RECETTES les classait EN_TROP.

legendary_insight.html (capture du 04/11) : la monnaie est ce que les raids
donnent aujourd'hui (jusqu'a 77 par semaine) et ce que vendent Scholar Glenna
et les Magnetite Shard Exchange contre « 1 + 1 + 25 + 50 » (Prowess) et
« 1 + 1 + 6 + 150 » (Compassion). legendary_insight_consumable.html : objet
retire du jeu (« discontinued »), converti en monnaie par double-clic ou chez
ces memes vendeurs. Un seul ingredient, donc un seul cout : la monnaie reste,
les deux aretes du consommable sont retirees. Le stock d'objets encore detenus
reste lisible par son apiId ; il se convertit 1 pour 1.

Effet : -150 sur Perfected Envoy (25 x 6 pieces), -150 sur Coalescence.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
J = "2026-11-04"
C = d["craft_components"]
cons, mon = C["legendary_insight_consumable"], C["legendary_insight"]
assert cons["qty"] == {"gift_of_compassion": 150, "gift_of_prowess": 25}, cons["qty"]
assert mon["qty"].get("gift_of_prowess") == 25 and mon["qty"].get("gift_of_compassion") == 150, mon["qty"]
cons["qty"] = {}
for p in ("gift_of_compassion", "gift_of_prowess"):
    if p in cons.get("needed_for", []):
        cons["needed_for"].remove(p)
cons["sources"] = [{
    "type": "conversion", "verified": True, "checked": J,
    "ref": "ressources/wiki/legendary_insight_consumable.html (« discontinued », « Double-click to add to wallet »)",
    "tip": {"fr": "Objet retiré du jeu : un double-clic le convertit en Legendary Insight du portefeuille, 1 pour 1. "
                  "Les recettes se comptent en monnaie.",
            "en": "Discontinued item: double-click converts it to wallet Legendary Insight, 1 for 1. "
                  "Recipes are counted in the currency."},
}]
cons["note"] = {"fr": "Ne se compte plus : la monnaie `legendary_insight` porte le coût des dons (04/11).",
                "en": "No longer counted: the `legendary_insight` currency carries the gifts' cost (04/11)."}
mon["ref"] = "ressources/wiki/legendary_insight.html (Acquisition, Currency for)"
mon["checked"] = J
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("2 aretes du consommable retirees ; ecrit", DST)
