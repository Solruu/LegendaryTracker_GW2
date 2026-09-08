#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Miyani et Lyhr : la voie que j'avais declaree illisible, et la fin de l'arbitrage Conflux.

DEUX ERREURS DE MA PART, MEME CAUSE.

1. J'ai ecrit que la page du trefle citait Miyani et Lyhr « avec quatre icones
   que la capture ne nomme pas ». Faux. J'avais lu la version detexturee, ou
   une icone se reduit a un nombre orphelin. Le HTML, lui, porte le lien :

       3 <a href="/wiki/Mystic_Coin">  + 5 <a href="/wiki/Glob_of_Ectoplasm">
       + 3 <a href="/wiki/Obsidian_Shard"> + 3 <a href="/wiki/Spirit_Shard">

   Exactement ce qu'Antoine annoncait. Et la page de Conflux le confirme une
   seconde fois : « Bought from Lyhr for a total of 231 + 385 + 231 + 231 »,
   soit 77 x (3, 5, 3, 3). Une absence constatee dans une vue appauvrie n'est
   pas une absence.

2. J'ai declare les deux ecarts de Conflux non tranchables et je les ai mis en
   qty_conflict. La page porte pourtant une section « Required currencies »
   qui les tranche, ligne par ligne, avec le lien de chaque monnaie :

       1 850 WvW Skirmish Claim Ticket    (2 200 avec la Mist Band McM)
       1 750 Memory of Battle             (2 000 avec la Mist Band McM)
       1 500 Badges of Honor
         750 Testimony of Castoran Heroics
         250 Shard of Glory
         100 Spirit Shard

   La chaine donnait deja 1 850, 1 750, 1 500 et 750 : quatre lignes sur six au
   nombre pres. C'est le JSX qui portait 750 insignes et 250 temoignages, pas
   la chaine. Je n'avais pas lu le tableau, j'avais lu une fenetre de 160
   caracteres autour du mot « Badge », ou la phrase voisine parlait de la
   version Infused — et j'ai pris ce voisinage pour une ambiguite.

Les qty_conflict tombent. Le JSX est corrige dans la passe de rendu.

CE QUI RESTE OUVERT, ET QUE JE NE DEVINE PAS : la Mist Band (Infused) s'achete
de trois facons, et la donnee les compte TOUTES LES TROIS. D'ou 420 eclats de
gloire affiches contre 250 au wiki. C'est le meme motif que le trefle et il
appelle le meme traitement, mais l'arithmetique des tickets ne se referme pas
encore (le wiki annonce 1 850 hors option McM, et nos 1 850 incluent deja les
350 de cette option) : je le laisse chiffre dans le BACKLOG plutot que de
choisir un defaut au juge.
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
groupes = d["alt_groups"]

# --- 1. les deux voies manquantes du trefle ----------------------------------
PRIX = {"mystic_coin": 3, "glob_of_ectoplasm": 5, "obsidian_shard": 3, "spirit_shard": 3}
VOIES = [
    ("clover_miyani", "Mystic Clover — Miyani / préposés à la Forge",
     ("week", 10, "Miyani et préposés à la Forge mystique",
      "Miyani and Mystic Forge Attendants"),
     {"fr": "3 pièces mystiques + 5 ectoplasmes + 3 éclats d'obsidienne + 3 éclats "
            "d'esprit par trèfle. Plafond de 10 par semaine, commun à tous les préposés.",
      "en": "3 Mystic Coins + 5 Globs of Ectoplasm + 3 Obsidian Shards + 3 Spirit "
            "Shards per clover. Combined weekly limit of 10 across all attendants."}),
    ("clover_lyhr", "Mystic Clover — Lyhr / Lucirae", None,
     {"fr": "Même prix que Miyani — 3 pièces mystiques + 5 ectoplasmes + 3 éclats "
            "d'obsidienne + 3 éclats d'esprit — mais SANS plafond. C'est la voie "
            "payante à privilégier dès qu'on dépasse 10 trèfles par semaine.",
      "en": "Same price as Miyani — 3 Mystic Coins + 5 Globs of Ectoplasm + 3 "
            "Obsidian Shards + 3 Spirit Shards — but with NO cap. The paid route to "
            "prefer beyond 10 clovers a week."}),
]

for cid, nom, cad, tip in VOIES:
    if cid in cc:
        continue
    cc[cid] = collections.OrderedDict([
        ("name", nom), ("kind", "acquisition"), ("needed_for", ["mystic_clover"]),
        ("qty", {}),
        ("sources", [{"type": "choice", "tip": tip}]),
        ("ref", "wiki Mystic Clover — section Acquisition ; confirme par la table de "
                "Conflux (« Bought from Lyhr for a total of 231 + 385 + 231 + 231 », "
                "soit 77 x 3, 5, 3, 3)"),
        ("checked", "2026-09-08"),
        ("verified", "prix lu sur les liens du HTML, confirme par Antoine et par une "
                     "seconde page"),
    ])
    if cad:
        per, cap, lfr, len_ = cad
        cc[cid]["cadence"] = {"sources": [{
            "label": {"fr": lfr, "en": len_}, "period": per, "cap": cap,
            "cost": {"fr": tip["fr"], "en": tip["en"]},
            "verified": True, "checked": "2026-09-08",
            "ref": "wiki:Mystic_Clover — section Acquisition"}]}
    for enfant, q in PRIX.items():
        cc[enfant].setdefault("qty", {})[cid] = q
        nf = cc[enfant].get("needed_for")
        if isinstance(nf, list):
            cc[enfant]["needed_for"] = sorted(set(nf) | {cid})
    print(f"voie posee : {cid}")

g = groupes["acquisition_trefle"]
i = g["options"].index("clover_forge") + 1
for cid, *_ in reversed(VOIES):
    if cid not in g["options"]:
        g["options"].insert(i, cid)
g["note"]["fr"] = g["note"]["fr"].replace(
    " Miyani et Lyhr en vendent aussi, à un prix que la capture ne permet pas de lire.",
    " Miyani et Lyhr vendent au même prix ; seul Miyani est plafonné. La cadence "
    "de chaque voie est portée par la voie elle-même, pas par cette note.")
g["note"]["en"] = g["note"]["en"].replace(
    " Miyani and Lyhr sell them too, at a price the capture does not let us read.",
    " Miyani and Lyhr sell at the same price; only Miyani is capped. Each route "
    "carries its own cadence, not this note.")

# --- 2. Conflux : l'arbitrage n'avait pas lieu d'etre ------------------------
for cid in ("badge_of_honor", "testimony_of_castoran_heroics"):
    conf = cc[cid].get("qty_conflict") or {}
    if "conflux" in conf:
        del conf["conflux"]
        if not conf:
            cc[cid].pop("qty_conflict", None)
        cc[cid]["ref"] = ((cc[cid].get("ref") or "") +
                          " | wiki Conflux, section « Required currencies » : "
                          "1 500 insignes et 750 temoignages de Castoran, sans "
                          "reserve sur la version Infused").strip(" |")
        print(f"qty_conflict leve : {cid}/conflux")

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{DST.name} ecrit")
