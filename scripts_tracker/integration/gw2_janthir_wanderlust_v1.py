#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gift of Janthir Wanderlust (Orrax) : deux de ses quatre dons relies.

Usage : python3 scripts_tracker/integration/gw2_janthir_wanderlust_v1.py SRC DST

Recette (capture) : Gift of Lowland Shore + Gift of Janthir Syntri + Gift of
Mistburned Barrens + Gift of Bava Nisos. Les deux premiers existent (Klobjarne
les prend deja via Gift of Uncovered Grounds) : relies ici, 1 chacun — ce qui
ferme les deux lignes Orrax de CONFRONTATION. Les deux autres n'ont ni page
ni composant : a capturer.

Voie d'obtention des deux dons, lue sur leurs pages : recompense de la
completion de la carte (par defaut, gratuite) ; vendeur en alternative, tres
cher (15 jetons de renommee + 100 monnaie de carte + 250 Ancient Coin + 2 000
Ursus Oblige + 51 000 karma), seulement pour un personnage ayant deja fini la
carte. Meme regle que les trefles : la voie couteuse n'est jamais par defaut,
et son cout ne s'ajoute pas aux totaux.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
def t(fr, en): return {"fr": fr, "en": en}
for cid, carte, monnaie in [("gift_of_lowland_shore", "Lowland Shore", "Curious Lowland Honeycomb"),
                            ("gift_of_janthir_syntri", "Janthir Syntri", "Curious Mursaat Currency")]:
    c = cc[cid]
    assert "gift_of_janthir_wanderlust" not in c["qty"]
    c["qty"]["gift_of_janthir_wanderlust"] = 1
    c["needed_for"].append("gift_of_janthir_wanderlust")
    assert [s["type"] for s in c["sources"]] == ["unknown"]
    ref = f"ressources/wiki/{cid}.html, Acquisition"
    c["best"] = "map_completion"
    c["best_reason"] = t("voie par défaut : la complétion de la carte, gratuite. Le vendeur est une alternative très coûteuse.",
                         "default route: map completion, free. The vendor is a very costly alternative.")
    c["sources"] = [
        {"type": "map_completion", "tip": t(
            f"Voie par défaut. Récompense de la complétion de la carte {carte}, par personnage.",
            f"Default route. Reward for completing the {carte} map, per character."),
         "verified": True, "checked": "2026-10-07", "ref": ref},
        {"type": "vendor", "tip": t(
            f"Alternative, jamais par défaut : vendeurs de cœur de {carte}, 15 jetons de renommée + 100 {monnaie} + 250 Ancient Coin + 2 000 Ursus Oblige + 51 000 karma, pour un personnage ayant déjà fini la carte.",
            f"Alternative, never the default: {carte} heart vendors, 15 Renown Tokens + 100 {monnaie} + 250 Ancient Coin + 2,000 Ursus Oblige + 51,000 karma, for a character that already completed the map."),
         "verified": True, "checked": "2026-10-07", "ref": ref}]
d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
