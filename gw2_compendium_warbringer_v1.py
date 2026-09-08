#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pose les 250 insignes du Commander's Compendium, seul ecart reel du Warbringer.

L'audit v37 compare le TOTAL affiche au required du JSX, la ou la v36 ne
regardait que la cle a plat. Trois ecarts sont apparus, invisibles jusque-la.
Deux etaient de vieux nombres du JSX que la chaine a depuis corriges — Conflux,
tranche par sa page : « 1,500 Badge of Honor », contre 750 ecrits dans le JSX.
Le troisieme est l'inverse : c'est la chaine qui manquait quelque chose.

La table du Warbringer met une condition sur le dernier palier :

    Commander's Wings of War   875 WvW Skirmish Claim Tickets
       Must have a World rank of 350
       Must have used a Commander's Compendium (costs: 300 gold and
       Badge of Honor x250)

Le compendium n'est pas un ingredient de la recette, c'est un prerequis a
l'achat du palier — et il coute 250 insignes que personne ne comptait. La
chaine donnait 1 000, le JSX 1 250 : le JSX avait raison, et la difference est
exactement ce compendium.

L'arete se pose sur `commanders_wings_of_war`, pas sur le legendaire : c'est ce
palier-la qui l'exige, et un futur objet qui le demanderait heriterait du cout
sans qu'on ait a le recopier.
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

b = cc["badge_of_honor"]
q = b.setdefault("qty", collections.OrderedDict())
assert "commanders_wings_of_war" not in q, "arete deja posee"
q["commanders_wings_of_war"] = 250
b["needed_for"] = sorted(set(b.get("needed_for") or []) | {"commanders_wings_of_war"})
b["ref"] = ((b.get("ref") or "") +
            " | wiki Warbringer : Commander's Compendium, prerequis du palier "
            "Commander's Wings of War, coute 250 insignes").strip(" |")
b["checked"] = "2026-09-08"

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{DST.name} ecrit — badge_of_honor <- commanders_wings_of_war 250")
