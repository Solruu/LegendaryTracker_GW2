# Confrontation des TOTAUX — ce qui s'affiche contre ce qu'ecrit la table

Source : `gw2_sources_v314.json`, 1105 totaux compares sur les tables rattachees a un legendaire.

Les quantites d'une table « Full material list » sont des totaux pour le
legendaire. Mais la table s'arrete ou elle veut : elle ecrit 2 000 lingots
sous le tesson d'Ipos et n'ouvre pas le Mystic Curio, qui en coute 1 500 de
plus. **Son total est donc un plancher, pas une egalite.**

- **1023 accords** — le nombre affiche est celui de la table.
- **0 trous** — l'affichage est SOUS le plancher. Certains.
- **66 excedents expliques** — le surplus vient d'une branche
  que la table cite sans l'ouvrir, ou d'un chevauchement declare en
  `qty_overlap_verified`.
- **16 excedents nus** — rien dans la donnee ne les explique : soit
  un double comptage, soit une branche legitime qu'il faut nommer.


## Trous — le total affiche est inferieur a celui de la table

| legendaire | composant | affiche | table | manque |
|---|---|---:|---:|---:|

## Excedents nus — a expliquer ou a corriger

| legendaire | composant | affiche | table | excedent |
|---|---|---:|---:|---:|
| `gen3_aurenes_argument` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_bite` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_breath` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_claw` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_fang` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_flight` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_gaze` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_insight` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_persuasion` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_rending` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_scale` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_tail` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_voice` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_weight` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_wing` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |
| `gen3_aurenes_wisdom` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 300 | 250 | +50 |

## Excedents expliques par une branche fermee de la table

| legendaire | composant | affiche | table | par |
|---|---|---:|---:|---|
| `transcendence` | `shard_of_glory` | 2500 | 250 | `gift_of_the_mists` |
| `gen2_claw_of_the_khan_ur` | `mithril_ingot` | 4750 | 3250 | `mystic_curio` |
| `conflux` | `memory_of_battle` | 1750 | 250 | `gift_of_the_mists`, `gift_of_war_dedication`, `war_commendation` |
| `gen2_eureka` | `mithril_ingot` | 4750 | 3250 | `mystic_curio` |
| `gen2_exordium` | `mithril_ingot` | 5750 | 4250 | `mystic_curio` |
| `gen2_flames_of_war` | `mithril_ingot` | 3500 | 2000 | `mystic_curio` |
| `gen2_pharus` | `mithril_ingot` | 5500 | 4000 | `mystic_curio` |
| `gen2_sharur` | `mithril_ingot` | 5750 | 4250 | `mystic_curio` |
| `gen2_shooshadoo` | `mithril_ingot` | 3750 | 2250 | `mystic_curio` |
| `gen2_the_binding_of_ipos` | `mithril_ingot` | 3500 | 2000 | `mystic_curio` |
| `gen2_the_hms_divinity` | `mithril_ingot` | 5500 | 4000 | `mystic_curio` |
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
| `gen2_the_hms_divinity` | `elder_wood_plank` | 4250 | 3250 | `mystic_curio` |
| `gen2_the_shining_blade` | `elder_wood_plank` | 3000 | 2000 | `mystic_curio` |
| `gen2_verdarach` | `elder_wood_plank` | 2250 | 1250 | `mystic_curio` |
| `gen2_xiuquatl` | `elder_wood_plank` | 3000 | 2000 | `mystic_curio` |
| `gen2_nevermore` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `gen2_xiuquatl` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `warbringer` | `skirmish_claim_ticket` | 2800 | 2450 | `mystic_essence_of_annihilation` |
| `coalescence` | `mystic_coin` | 499 | 250 | `qty_overlap_verified` |
| `conflux` | `mystic_coin` | 499 | 250 | `qty_overlap_verified` |
| `stella_radians` | `mystic_coin` | 499 | 250 | `qty_overlap_verified` |
| `transcendence` | `mystic_coin` | 499 | 250 | `qty_overlap_verified` |
| `vision` | `mystic_coin` | 499 | 250 | `qty_overlap_verified` |
| `selachimorpha` | `obsidian_shard` | 488 | 250 | `qty_overlap_verified` |
| `gen2_nevermore` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_xiuquatl` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_nevermore` | `dust_luminous` | 350 | 250 | `gift_of_dust` |
