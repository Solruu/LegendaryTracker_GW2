# Confrontation des TOTAUX — ce qui s'affiche contre ce qu'ecrit la table

Source : `gw2_sources_v248.json`, 926 totaux compares sur les tables rattachees a un legendaire.

Les quantites d'une table « Full material list » sont des totaux pour le
legendaire. Mais la table s'arrete ou elle veut : elle ecrit 2 000 lingots
sous le tesson d'Ipos et n'ouvre pas le Mystic Curio, qui en coute 1 500 de
plus. **Son total est donc un plancher, pas une egalite.**

- **832 accords** — le nombre affiche est celui de la table.
- **31 trous** — l'affichage est SOUS le plancher. Certains.
- **40 excedents expliques** — le surplus vient d'une branche
  que la table cite sans l'ouvrir.
- **23 excedents nus** — rien dans la donnee ne les explique : soit
  un double comptage, soit une branche legitime qu'il faut nommer.


## Trous — le total affiche est inferieur a celui de la table

| legendaire | composant | affiche | table | manque |
|---|---|---:|---:|---:|
| `gen2_the_hms_divinity` | `mithril_ingot` — Mithril Ingot | 0 | 4000 | -4000 |
| `gen2_the_hms_divinity` | `elder_wood_plank` — Elder Wood Plank | 250 | 3250 | -3000 |
| `stella_radians` | `seer_runestone` — Seer Runestone | 200 | 800 | -600 |
| `gen3_aurene_s_fang` | `hydrocatalytic_reagent` — Hydrocatalytic Reagent | 250 | 500 | -250 |
| `gen3_aurene_s_flight` | `hydrocatalytic_reagent` — Hydrocatalytic Reagent | 250 | 500 | -250 |
| `gen3_aurene_s_tail` | `hydrocatalytic_reagent` — Hydrocatalytic Reagent | 250 | 500 | -250 |
| `gen3_aurene_s_wing` | `hydrocatalytic_reagent` — Hydrocatalytic Reagent | 250 | 500 | -250 |
| `legendary_relic` | `hydrocatalytic_reagent` — Hydrocatalytic Reagent | 250 | 500 | -250 |
| `gen2_the_hms_divinity` | `mystic_curio` — Mystic Curio | 0 | 100 | -100 |
| `strife_unending` | `gift_of_war_prosperity` — Gift of War Prosperity | 3 | 30 | -27 |
| `gen3_aurene_s_fang` | `tale_of_adventure` — Tale of Adventure | 0 | 10 | -10 |
| `gen3_aurene_s_flight` | `tale_of_adventure` — Tale of Adventure | 0 | 10 | -10 |
| `gen3_aurene_s_tail` | `tale_of_adventure` — Tale of Adventure | 0 | 10 | -10 |
| `gen3_aurene_s_wing` | `tale_of_adventure` — Tale of Adventure | 0 | 10 | -10 |
| `aetheric_anchor` | `gift_of_condensed_magic` — Gift of Condensed Magic | 8 | 16 | -8 |
| `aetheric_anchor` | `gift_of_condensed_might` — Gift of Condensed Might | 8 | 16 | -8 |
| `aurora` | `gift_of_condensed_might` — Gift of Condensed Might | 2 | 8 | -6 |
| `aurora` | `gift_of_condensed_magic` — Gift of Condensed Magic | 2 | 8 | -6 |
| `coalescence` | `gift_of_condensed_might` — Gift of Condensed Might | 2 | 8 | -6 |
| `coalescence` | `gift_of_condensed_magic` — Gift of Condensed Magic | 2 | 8 | -6 |
| `conflux` | `gift_of_condensed_might` — Gift of Condensed Might | 2 | 8 | -6 |
| `conflux` | `gift_of_condensed_magic` — Gift of Condensed Magic | 2 | 8 | -6 |
| `conflux` | `vision_crystal` — Vision Crystal | 2 | 8 | -6 |
| `stella_radians` | `gift_of_condensed_might` — Gift of Condensed Might | 2 | 8 | -6 |
| `stella_radians` | `gift_of_condensed_magic` — Gift of Condensed Magic | 2 | 8 | -6 |
| `strife_unending` | `gift_of_the_mists` — Gift of the Mists | 2 | 8 | -6 |
| `transcendence` | `gift_of_condensed_might` — Gift of Condensed Might | 2 | 8 | -6 |
| `transcendence` | `gift_of_condensed_magic` — Gift of Condensed Magic | 2 | 8 | -6 |
| `transcendence` | `vision_crystal` — Vision Crystal | 2 | 8 | -6 |
| `vision` | `gift_of_condensed_might` — Gift of Condensed Might | 2 | 8 | -6 |
| `vision` | `gift_of_condensed_magic` — Gift of Condensed Magic | 2 | 8 | -6 |

## Excedents nus — a expliquer ou a corriger

| legendaire | composant | affiche | table | excedent |
|---|---|---:|---:|---:|
| `transcendence` | `shard_of_glory` — Shard of Glory | 2250 | 250 | +2000 |
| `warbringer` | `skirmish_claim_ticket` — WvW Skirmish Claim Ticket | 2800 | 2450 | +350 |
| `perfected_envoy` | `obsidian_shard` — Obsidian Shard | 300 | 50 | +250 |
| `coalescence` | `mystic_coin` — Mystic Coin | 499 | 250 | +249 |
| `conflux` | `mystic_coin` — Mystic Coin | 499 | 250 | +249 |
| `stella_radians` | `mystic_coin` — Mystic Coin | 499 | 250 | +249 |
| `transcendence` | `mystic_coin` — Mystic Coin | 499 | 250 | +249 |
| `vision` | `mystic_coin` — Mystic Coin | 499 | 250 | +249 |
| `selachimorpha` | `obsidian_shard` — Obsidian Shard | 488 | 250 | +238 |
| `aetheric_anchor` | `mystic_clover` — Mystic Clover | 200 | 100 | +100 |
| `perfected_envoy` | `mystic_clover` — Mystic Clover | 90 | 15 | +75 |
| `aetheric_anchor` | `amalgamated_draconic_lodestone` — Amalgamated Draconic Lodestone | 110 | 55 | +55 |
| `perfected_envoy` | `auric_ingot` — Auric Ingot | 30 | 5 | +25 |
| `perfected_envoy` | `reclaimed_metal_plate` — Reclaimed Metal Plate | 30 | 5 | +25 |
| `perfected_envoy` | `chak_egg` — Chak Egg | 30 | 5 | +25 |
| `the_ascension` | `dragonite_ingot` — Dragonite Ingot | 20 | 10 | +10 |
| `the_ascension` | `empyreal_star` — Empyreal Star | 20 | 10 | +10 |
| `the_ascension` | `bloodstone_brick` — Bloodstone Brick | 20 | 10 | +10 |
| `warbringer` | `dragonite_ingot` — Dragonite Ingot | 20 | 10 | +10 |
| `warbringer` | `empyreal_star` — Empyreal Star | 20 | 10 | +10 |
| `warbringer` | `bloodstone_brick` — Bloodstone Brick | 20 | 10 | +10 |
| `the_ascension` | `augurs_stone` — Augur's Stone | 4 | 2 | +2 |
| `warbringer` | `augurs_stone` — Augur's Stone | 4 | 2 | +2 |

## Excedents expliques par une branche fermee de la table

| legendaire | composant | affiche | table | par |
|---|---|---:|---:|---|
| `gen2_claw_of_the_khan_ur` | `mithril_ingot` | 4750 | 3250 | `mystic_curio` |
| `conflux` | `memory_of_battle` | 1750 | 250 | `gift_of_war_dedication` |
| `gen2_eureka` | `mithril_ingot` | 4750 | 3250 | `mystic_curio` |
| `gen2_exordium` | `mithril_ingot` | 5750 | 4250 | `mystic_curio` |
| `gen2_flames_of_war` | `mithril_ingot` | 3500 | 2000 | `mystic_curio` |
| `gen2_pharus` | `mithril_ingot` | 5500 | 4000 | `mystic_curio` |
| `gen2_sharur` | `mithril_ingot` | 5750 | 4250 | `mystic_curio` |
| `gen2_shooshadoo` | `mithril_ingot` | 3750 | 2250 | `mystic_curio` |
| `gen2_the_binding_of_ipos` | `mithril_ingot` | 3500 | 2000 | `mystic_curio` |
| `gen2_the_shining_blade` | `mithril_ingot` | 4750 | 3250 | `mystic_curio` |
| `gen2_verdarach` | `mithril_ingot` | 3500 | 2000 | `mystic_curio` |
| `gen2_xiuquatl` | `mithril_ingot` | 4500 | 3000 | `mystic_curio` |
| `gen2_claw_of_the_khan_ur` | `elder_wood_plank` | 3000 | 2000 | `mystic_curio` |
| `gen2_eureka` | `elder_wood_plank` | 3000 | 2000 | `mystic_curio` |
| `gen2_exordium` | `elder_wood_plank` | 4000 | 3000 | `mystic_curio` |
| `gen2_flames_of_war` | `elder_wood_plank` | 2250 | 1250 | `mystic_curio` |
| `gen2_pharus` | `elder_wood_plank` | 4250 | 3250 | `mystic_curio` |
| `gen2_sharur` | `elder_wood_plank` | 4000 | 3000 | `mystic_curio` |
| `gen2_shooshadoo` | `elder_wood_plank` | 2000 | 1000 | `mystic_curio` |
| `gen2_the_binding_of_ipos` | `elder_wood_plank` | 2000 | 1000 | `mystic_curio` |
| `gen2_the_shining_blade` | `elder_wood_plank` | 3000 | 2000 | `mystic_curio` |
| `gen2_verdarach` | `elder_wood_plank` | 2250 | 1250 | `mystic_curio` |
| `gen2_xiuquatl` | `elder_wood_plank` | 3000 | 2000 | `mystic_curio` |
| `gen2_nevermore` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `gen2_xiuquatl` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `gen2_nevermore` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_xiuquatl` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_nevermore` | `dust_luminous` | 350 | 250 | `gift_of_dust` |
| `gen2_nevermore` | `dust_radiant` | 350 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_luminous` | 350 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_radiant` | 350 | 250 | `gift_of_dust` |
| `gen2_xiuquatl` | `dust_luminous` | 350 | 250 | `gift_of_dust` |
| `gen2_xiuquatl` | `dust_radiant` | 350 | 250 | `gift_of_dust` |
| `warbringer` | `vial_of_powerful_blood` | 270 | 250 | `mystic_essence_of_strategy` |
| `warbringer` | `armored_scale` | 270 | 250 | `mystic_essence_of_carnage` |
| `warbringer` | `vicious_claw` | 270 | 250 | `mystic_essence_of_annihilation` |
| `warbringer` | `ancient_bone` | 270 | 250 | `mystic_essence_of_animosity` |
| `conflux` | `gift_of_battle` | 5 | 4 | `gift_of_the_mists` |
