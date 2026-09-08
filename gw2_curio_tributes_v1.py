#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Complete les feuilles des onze tessons gen2 : Mystic Curio et les Tributes.

Les tessons crees hier citent deux choses que la base ne portait pas : un
Mystic Curio et un « Tribute to X », un par tesson. Elles etaient listees plutot
qu'inventees, faute de savoir ce qu'elles coutent. La verification de l'index
tranche differemment pour les deux.

LE MYSTIC CURIO EST CAPTURE, et sa page porte SEPT recettes :

    35 <trophee T5> + 15 Mithril Ingot + 10 Elder Wood Plank  ->  1 Mystic Curio

Sept fois la meme, une par trophee de palier 5 — poche de venin potente, totem
intrique, gros os, grosse griffe, gros croc, grosse ecaille, fiole de sang
potent. C'est un choix un-parmi-sept, exactement la forme que `alt_groups`
existe pour ecrire. Le mithril et le bois d'ancetre sont communs aux sept et
deviennent des aretes ordinaires ; le trophee devient un groupe.

LES ONZE TRIBUTES NE SONT PAS CAPTURES. Aucune page au depot, et les tables ne
les developpent pas — elles disent seulement qu'il en faut un par tesson. On
cree donc l'exigence, qui est sourcee, sans inventer son cout, qui ne l'est
pas. Ils apparaitront d'eux-memes dans la file de captures, section 3, faute
d'apiId et de page.

Un composant qui manque et qu'on voit vaut mieux qu'un composant qui manque et
qu'on ne voit pas : jusqu'ici les tessons citaient les Tributes dans une phrase
de `sources`, ou aucun calcul ne pouvait les atteindre.
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
groupes = d.setdefault("alt_groups", collections.OrderedDict())

# Le prefixe `shard_of_` ne suffit pas : la base porte aussi des tessons de
# CARTE — Shard of Glory, Shard of Janthir Syntri, Shard of Lowland Shore,
# Shard of Bava Nisos, Shard of Mistburned Barrens, Shard of the Homestead —
# qui n'ont rien a voir avec les precurseurs. On reconnait les onze a leur
# provenance : eux seuls citent la table de materiaux d'une arme gen2.
TESSONS = sorted(c for c, v in cc.items()
                 if c.startswith("shard_of_")
                 and str(v.get("ref", "")).startswith("table « Full material list »"))
assert len(TESSONS) == 11, f"11 tessons attendus, {len(TESSONS)} trouves : {TESSONS}"

# --- Mystic Curio -------------------------------------------------------------
TROPHEES = ["potent_venom_sac", "intricate_totem", "large_bone", "large_claw",
            "large_fang", "large_scale", "vial_of_potent_blood"]
absents = [t for t in TROPHEES if t not in cc]
assert not absents, f"trophees T5 absents de la base : {absents}"

if "mystic_curio" not in cc:
    cc["mystic_curio"] = collections.OrderedDict([
        ("name", "Mystic Curio"),
        ("kind", "advanced_craft"),
        ("needed_for", TESSONS),
        ("qty", collections.OrderedDict((t, 1) for t in TESSONS)),
        ("sources", [{"type": "mystic_forge", "tip": {
            "fr": "Forge mystique : 35 trophées de palier 5 au choix + 15 lingots de "
                  "mithril + 10 planches de bois d'ancêtre.",
            "en": "Mystic Forge: 35 tier-5 trophies of your choice + 15 Mithril Ingots "
                  "+ 10 Elder Wood Planks."}}]),
        ("ref", "wiki Mystic Curio — sept boîtes Recipe, une par trophée T5"),
        ("checked", "2026-09-08"),
        ("verified", "sept recettes capturées, ingrédients communs identiques"),
    ])
    for cid, n in (("mithril_ingot", 15), ("elder_wood_plank", 10)):
        cc[cid].setdefault("qty", {})["mystic_curio"] = n
        nf = cc[cid].get("needed_for")
        if isinstance(nf, list):
            cc[cid]["needed_for"] = sorted(set(nf) | {"mystic_curio"})
    groupes["trophee_mystic_curio"] = collections.OrderedDict([
        ("qty", 35),
        ("options", TROPHEES),
        ("default", "large_bone"),
        ("targets", ["mystic_curio"]),
        ("label", {"fr": "Trophée du Mystic Curio — un seul des sept",
                   "en": "Mystic Curio trophy — one of the seven"}),
        ("note", {
            "fr": "Sept recettes, une par trophée de palier 5. Prends celui dont tu as "
                  "le plus en stock : c'est le même prix ailleurs.",
            "en": "Seven recipes, one per tier-5 trophy. Use whichever you hold most "
                  "of; the rest of the cost is identical."}),
        ("ref", "wiki Mystic Curio — sept boîtes Recipe ne différant que par le trophée"),
    ])
    print("mystic_curio cree | 1 par tesson, 15 mithril + 10 bois d'ancetre,"
          " trophee en alt_group")

# --- les onze Tributes ---------------------------------------------------------
crees = []
for t in TESSONS:
    nom = cc[t]["name"].replace("Shard of ", "")
    tid = "tribute_to_" + t[len("shard_of_"):]
    if tid in cc:
        continue
    cc[tid] = collections.OrderedDict([
        ("name", f"Tribute to {nom}"),
        ("kind", "advanced_craft"),
        ("needed_for", [t]),
        ("qty", {t: 1}),
        ("sources", [{"type": "unknown", "tip": {
            "fr": "Recette non capturée — la table de matériaux dit qu'il en faut un "
                  "par tesson, sans détailler son coût.",
            "en": "Recipe not captured — the material table states one per shard "
                  "without detailing its cost."}}]),
        ("ref", f"table « Full material list » — 1 Tribute par {cc[t]['name']}"),
        ("checked", "2026-09-08"),
        ("verified", "exigence sourcée, coût inconnu"),
    ])
    cc[t].setdefault("qty", {})
    crees.append(tid)
print(f"tributes crees : {len(crees)}")
for x in crees:
    print(f"   {x}")

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{DST.name} ecrit")
