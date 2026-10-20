#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Endless Summer : Gift of the Beach decompose (20/10).

Usage : python3 scripts_tracker/integration/gw2_gift_of_the_beach_v1.py SRC DST

Le don n'avait aucun enfant, et son apiId (107031) designait un « Elixir of
Secrets of the Obscure Mastery » a l'API ; la page capturee et l'API disent
107201. Recette lue (gift_of_the_beach.html, Forge mystique) : 250 Pile of
Coarse Sand + 100 Ley-Infused Sand + 250 Coral Orb + 1 Relic of the Sunless.
Shaman Palak le vend pour les memes ingredients + 10 ectos : alternative plus
chere, non comptee.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-20"
W = "ressources/wiki/"
G = "gift_of_the_beach"


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = c.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


g = cc[G]
assert g["apiId"] == 107031
g["apiId"] = 107201
g["apiId_fix"] = {"was": 107031, "checked": J, "verified": True,
                  "ref": f"{W}gift_of_the_beach.html (API 107201) + /v2/items?ids=107031,107201 lu le 20/10"}
g["sources"] = [
    {"type": "mystic_forge", "verified": True, "checked": J, "ref": f"{W}gift_of_the_beach.html, Recipe",
     "tip": {"fr": "Forge mystique : 250 Piles of Coarse Sand + 100 Ley-Infused Sand + 250 Coral Orbs + 1 Relic of the Sunless.",
             "en": "Mystic Forge: 250 Piles of Coarse Sand + 100 Ley-Infused Sand + 250 Coral Orbs + 1 Relic of the Sunless."}},
    {"type": "vendor", "npc": "Shaman Palak", "paid_repeatable": True, "verified": True, "checked": J,
     "ref": f"{W}gift_of_the_beach.html, Sold by",
     "tip": {"fr": "Alternative : Shaman Palak (Hullgarden, Rive aux épaves) pour les mêmes ingrédients + 10 ectos, succès Radiance of the Sun God requis.",
             "en": "Alternative: Shaman Palak (Hullgarden, Shipwreck Strand) for the same ingredients + 10 ectos, requires the Radiance of the Sun God achievement."}}]
g["best"] = "mystic_forge"
g["verified"] = True
g["checked"] = J
g["ref"] = f"{W}gift_of_the_beach.html"

NOUVEAUX = {
    "pile_of_coarse_sand": ("Pile of Coarse Sand", 71641,
                            [{"type": "drop", "free_repeatable": True,
                              "tip": {"fr": "Butin des Dust Mites du Désert de cristal, et contenu des Piles of Silky Sand.",
                                      "en": "Dropped by Dust Mites in the Crystal Desert, and found in Piles of Silky Sand."},
                              "ref": f"{W}pile_of_coarse_sand.html, Acquisition"}]),
    "coral_orb": ("Coral Orb", 24510,
                  [{"type": "gathering", "free_repeatable": True,
                    "tip": {"fr": "Nœuds de corail et nombreux coffres (chance) ; comptoir.",
                            "en": "Coral nodes and many chests (chance); trading post."},
                    "ref": f"{W}coral_orb.html, Acquisition"}]),
    "relic_of_the_sunless": ("Relic of the Sunless", 100400,
                             [{"type": "chest",
                               "tip": {"fr": "Au choix dans un Core Relic Chest. Alternative : artisanat 400 (48 Piles of Lucent Crystal + 30 Sun Beads + 3 Charms of Skill + 15 ectos).",
                                       "en": "A choice in a Core Relic Chest. Alternative: crafting 400 (48 Piles of Lucent Crystal + 30 Sun Beads + 3 Charms of Skill + 15 ectos)."},
                               "ref": f"{W}relic_of_the_sunless.html, Acquisition"}]),
}
for k, (nom, api, src) in NOUVEAUX.items():
    assert k not in cc
    for s in src:
        s["verified"] = True
        s["checked"] = J
    cc[k] = {"name": nom, "apiId": api, "kind": "material" if k != "relic_of_the_sunless" else "acquire",
             "farmable": True, "qty": {}, "needed_for": [], "sources": src,
             "verified": True, "checked": J, "ref": f"{W}{k}.html"}
arete("pile_of_coarse_sand", G, 250)
arete("ley_infused_sand", G, 100)
arete("coral_orb", G, 250)
arete("relic_of_the_sunless", G, 1)

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
