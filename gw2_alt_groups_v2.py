#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Deuxieme groupe de choix : les gemmes du Gift of Infused Gems.

CE QUE LA PAGE CAPTUREE TRANCHE. La recette de Gift of Rays tient en quatre
lignes : 1 Gift of the Sun, 1 Gift of the Beach, 1 Gift of Infused Gems,
10 Purified Rift Essence. UN seul don de gemmes. Et Gift of Infused Gems
demande 250 unites d'UNE gemme — sa page porte six recettes, une par gemme,
sous la phrase « any core game gemstones can be used in these recipes ».

La donnee, elle, portait `gift_of_rays: 250` sur QUATRE orbes a la fois —
emeraude, opale, rubis, saphir. Mille orbes la ou il en faut deux cent
cinquante, et le choix de la couleur efface. C'est le meme defaut que les dons
de maitrise gen2, ne de la meme cause : `qty` ne sait pas ecrire « un parmi ».

CE QUI CHANGE. Les quatre cles `gift_of_rays` quittent les orbes. Un groupe
`gemmes_infusees` prend le relais, avec pour cible le COMPOSANT
`gift_of_infused_gems` — premiere cible non legendaire, le mecanisme etant
prevu pour : la presence vaut alors le total deja calcule, et la cascade porte
la quantite jusqu'aux legendaires concernes.

BERYL ORB EST CREE. La sixieme option manquait a la base. Elle n'est pas
inventee : la boite Recipe de Gift of Infused Gems la nomme au meme titre que
les cinq autres. L'entree est calquee sur `ruby_orb`, sans apiId — aucun de ses
cinq freres n'en porte.

Le total baisse. C'est une correction, pas une perte : le joueur n'a jamais eu
besoin de mille orbes.
"""
import collections
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
VER = f"v{int(SRC.stem.split('_v')[-1]) + 1}"
DST = HERE / f"gw2_sources_{VER}.json"

d = json.load(open(SRC, encoding="utf-8"), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]

ORBES = ["beryl_orb", "chrysocola_orb", "emerald_orb", "opal_orb",
         "ruby_orb", "sapphire_orb"]

if "beryl_orb" not in cc:
    cc["beryl_orb"] = collections.OrderedDict([
        ("name", "Beryl Orb"),
        ("kind", "acquire"),
        ("farmable", True),
        ("needed_for", ["gift_of_infused_gems"]),
        ("sources", [{"type": "acquire", "tip": {
            "fr": None,
            "en": "Core game gemstone — crafted by jewelers or bought on the "
                  "Trading Post, like the five other orbs."}}]),
    ])

# Les 250 portes par les orbes visaient gift_of_rays. Or Gift of Rays ne
# consomme pas d'orbe : il consomme UN Gift of Infused Gems, qui lui en
# consomme 250. La cle etait posee un cran trop haut, et quatre fois.
retires = []
for o in ORBES:
    q = cc[o].get("qty") or {}
    if "gift_of_rays" in q:
        retires.append((o, q.pop("gift_of_rays")))
    nf = cc[o].get("needed_for")
    if isinstance(nf, list):
        cc[o]["needed_for"] = sorted(set(nf) - {"gift_of_rays"} | {"gift_of_infused_gems"})

groupes = d.setdefault("alt_groups", collections.OrderedDict())
groupes["gemmes_infusees"] = collections.OrderedDict([
    ("qty", 250),
    ("options", ORBES),
    ("default", "ruby_orb"),
    ("targets", ["gift_of_infused_gems"]),
    ("label", {
        "fr": "Gemme du don de gemmes infusées — une seule des six",
        "en": "Gemstone for the Gift of Infused Gems — one of the six",
    }),
    ("note", {
        "fr": "La page indique que n'importe quelle gemme du jeu de base "
              "convient : six recettes, une par couleur. Choisis celle que tu as "
              "en stock ou la moins chère au comptoir.",
        "en": "The page states any core game gemstone works: six recipes, one "
              "per colour. Pick whichever you have in stock, or the cheapest on "
              "the Trading Post.",
    }),
    ("ref", "wiki Gift of Infused Gems — six boites Recipe sous « any core game "
            "gemstones can be used in these recipes » ; wiki Gift of Rays — "
            "1 Gift of Infused Gems, pas quatre orbes"),
])

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"groupe gemmes_infusees : cible gift_of_infused_gems, {len(ORBES)} options")
print(f"cles gift_of_rays retirees : {retires}")
print(f"{DST.name} ecrit")
