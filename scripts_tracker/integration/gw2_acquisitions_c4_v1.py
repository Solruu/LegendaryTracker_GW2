#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""C4 suite : voies d'obtention lues sur les captures du 06/10 + titre reel.

Usage : python3 scripts_tracker/integration/gw2_acquisitions_c4_v1.py SRC DST

1. `ascended_shard_of_glory.name` passe au titre reel du wiki, au singulier
   (« Ascended Shard of Glory ») : la file de captures derive le titre du
   `name`, et le pluriel la renvoyait vers une redirection. Id et apiId
   inchanges ; les textes de conseil gardent le pluriel, c'est de la prose.
2. `sources[]` des six objets captures le 06/10, `unknown` jusqu'ici :
   Foxfire Cluster, Fury-Scorched Stone, Ley-Infused Sand, Opal Crystal,
   Shard of Crystallized Mists Essence, Pile of Foul Essence. Types existants
   seulement (gathering, drop, event, vendor, mystic_forge, chest).
   Fury-Scorched Stone : la page est courte mais porte bien une section
   Acquisition (evenements de la meta Gathering Storms, rarement les primes).
   Le vendeur INFUZ-5959 : monnaies en icones illisibles, montants non poses.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]

g = cc["ascended_shard_of_glory"]
assert g["name"] == "Ascended Shards of Glory"
g["name"] = "Ascended Shard of Glory"

def t(fr, en): return {"fr": fr, "en": en}
REF = lambda f: f"ressources/wiki/{f}.html, Acquisition (capture du 06/10/2026)"
S = {
 "foxfire_cluster": [
  {"type": "gathering", "free_repeatable": True, "tip": t(
   "Récolte, par chance, sur les jeunes arbres de nombreuses cartes (Ancient, Baoba, Cypress, Orrian, Palm, Red Oak...) et le bois flotté sinistre. Aucun vendeur ni coût trié sur la page.",
   "Harvested, by chance, from saplings on many maps (Ancient, Baoba, Cypress, Orrian, Palm, Red Oak...) and Eerie Driftwood. No vendor or sorted cost on the page."), "ref": REF("foxfire_cluster")},
  {"type": "drop", "free_repeatable": True, "tip": t(
   "Butin des Mordrem Husk champions et élites (Silverwastes, Verdant Brink, Dragon's Stand) et des Dust Mites du Désert de cristal.",
   "Dropped by champion and elite Mordrem Husks (Silverwastes, Verdant Brink, Dragon's Stand) and Crystal Desert Dust Mites."), "ref": REF("foxfire_cluster")}],
 "fury_scorched_stone": [
  {"type": "event", "free_repeatable": True, "tip": t(
   "Trophée : événements de la méta Gathering Storms (LW4), rarement les primes. Aucune table vendeur.",
   "Trophy: events of the Gathering Storms meta (LW4), rarely bounties. No vendor table."), "ref": REF("fury_scorched_stone")}],
 "ley_infused_sand": [
  {"type": "drop", "free_repeatable": True, "tip": t(
   "Primes et Dust Mites du Désert de cristal ; garanti dans plusieurs coffres de collection (Bounty Hunter, Legendary Belongings of the Great Zehtuka : 50).",
   "Bounties and Crystal Desert Dust Mites; guaranteed in several collection chests (Bounty Hunter, Legendary Belongings of the Great Zehtuka: 50)."), "ref": REF("ley_infused_sand")}],
 "opal_crystal": [
  {"type": "chest", "free_repeatable": True, "tip": t(
   "Par chance dans de nombreux coffres de méta et de boss (Karka Queen, Tequatl, Shatterer, Dragon's End, Cantha...) et les caches de minage.",
   "By chance from many meta and boss chests (Karka Queen, Tequatl, Shatterer, Dragon's End, Cantha...) and mining caches."), "ref": REF("opal_crystal")}],
 "shard_of_crystallized_mists_essence": [
  {"type": "drop", "free_repeatable": True, "tip": t(
   "Fractales niveau 51-100 : chance sur tout ennemi ; récompense possible des modes défi Nightmare et Shattered Observatory.",
   "Fractals scale 51-100: chance from any enemy; possible reward from the Nightmare and Shattered Observatory challenge modes."), "ref": REF("shard_of_crystallized_mists_essence")},
  {"type": "vendor", "npc": "INFUZ-5959", "map": "Mistlock Sanctuary", "paid_repeatable": True, "verified": False, "tip": t(
   "Vendu par INFUZ-5959 (Mistlock Observatory), avec la maîtrise Follows Advice. Monnaies affichées en icônes sur la capture : montants à confirmer.",
   "Sold by INFUZ-5959 (Mistlock Observatory), requires the Follows Advice mastery. Currencies shown as icons on the capture: amounts to confirm."), "ref": REF("shard_of_crystallized_mists_essence")},
  {"type": "mystic_forge", "tip": t(
   "Promotion en Forge : 5 Glob of Coagulated Mists Essence + 1 ecto + 1 écu mystique + 1 poussière cristalline.",
   "Forge promotion: 5 Glob of Coagulated Mists Essence + 1 ecto + 1 Mystic Coin + 1 Pile of Crystalline Dust."), "ref": REF("shard_of_crystallized_mists_essence")}],
 "pile_of_foul_essence": [
  {"type": "drop", "free_repeatable": True, "tip": t(
   "Butin des Risen Thrall (Orr, Timberline Falls) et, par chance, de nombreux sacs et boîtes.",
   "Dropped by Risen Thralls (Orr, Timberline Falls) and, by chance, many bags and boxes."), "ref": REF("pile_of_foul_essence")}],
}
for cid, src in S.items():
    c = cc[cid]
    assert all(s.get("type") == "unknown" for s in c["sources"]), cid
    for x in src:
        x.setdefault("verified", True)
        x["checked"] = "2026-10-06"
    c["sources"] = src
d["_meta"]["last_updated"] = "2026-10-06"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
