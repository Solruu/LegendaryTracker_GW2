# Confrontation des TOTAUX — ce qui s'affiche contre ce qu'ecrit la table

Source : `gw2_sources_v357.json`, 1113 totaux compares sur les tables rattachees a un legendaire.

Les quantites d'une table « Full material list » sont des totaux pour le
legendaire. Mais la table s'arrete ou elle veut : elle ecrit 2 000 lingots
sous le tesson d'Ipos et n'ouvre pas le Mystic Curio, qui en coute 1 500 de
plus. **Son total est donc un plancher, pas une egalite.**

- **943 accords** — le nombre affiche est celui de la table.
- **0 trous** — l'affichage est SOUS le plancher. Certains.
- **94 excedents expliques** — le surplus vient d'une branche
  que la table cite sans l'ouvrir, ou d'un chevauchement declare en
  `qty_overlap_verified`.
- **76 excedents nus** — rien dans la donnee ne les explique : soit
  un double comptage, soit une branche legitime qu'il faut nommer.


## Trous — le total affiche est inferieur a celui de la table

| legendaire | composant | affiche | table | manque |
|---|---|---:|---:|---:|

## Excedents nus — a expliquer ou a corriger

| legendaire | composant | affiche | table | excedent |
|---|---|---:|---:|---:|
| `gen1_the_bifrost` | `dust_incandescent` — Pile of Incandescent Dust | 750 | 250 | +500 |
| `gen1_the_minstrel` | `dust_incandescent` — Pile of Incandescent Dust | 750 | 250 | +500 |
| `gen2_exordium` | `darksteel_ingot` — Darksteel Ingot | 370 | 250 | +120 |
| `gen2_the_shining_blade` | `darksteel_ingot` — Darksteel Ingot | 370 | 250 | +120 |
| `gen2_claw_of_the_khan_ur` | `shard_of_resolution` — Shard of Resolution | 200 | 100 | +100 |
| `gen2_claw_of_the_khan_ur` | `tribute_to_resolution` — Tribute to Resolution | 200 | 100 | +100 |
| `gen2_claw_of_the_khan_ur` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_claw_of_the_khan_ur` | `darksteel_ingot` — Darksteel Ingot | 350 | 250 | +100 |
| `gen2_eureka` | `shard_of_endeavor` — Shard of Endeavor | 200 | 100 | +100 |
| `gen2_eureka` | `tribute_to_endeavor` — Tribute to Endeavor | 200 | 100 | +100 |
| `gen2_eureka` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_exordium` | `shard_of_exitare` — Shard of Exitare | 200 | 100 | +100 |
| `gen2_exordium` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_flames_of_war` | `shard_of_liturgy` — Shard of Liturgy | 200 | 100 | +100 |
| `gen2_flames_of_war` | `tribute_to_liturgy` — Tribute to Liturgy | 200 | 100 | +100 |
| `gen2_flames_of_war` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_pharus` | `shard_of_spero` — Shard of Spero | 200 | 100 | +100 |
| `gen2_pharus` | `tribute_to_spero` — Tribute to Spero | 200 | 100 | +100 |
| `gen2_pharus` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_sharur` | `shard_of_arah` — Shard of Arah | 200 | 100 | +100 |
| `gen2_sharur` | `tribute_to_arah` — Tribute to Arah | 200 | 100 | +100 |
| `gen2_sharur` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_shooshadoo` | `shard_of_friendship` — Shard of Friendship | 200 | 100 | +100 |
| `gen2_shooshadoo` | `tribute_to_friendship` — Tribute to Friendship | 200 | 100 | +100 |
| `gen2_shooshadoo` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_the_binding_of_ipos` | `shard_of_the_dark_arts` — Shard of the Dark Arts | 200 | 100 | +100 |
| `gen2_the_binding_of_ipos` | `tribute_to_the_dark_arts` — Tribute to the Dark Arts | 200 | 100 | +100 |
| `gen2_the_binding_of_ipos` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_the_hms_divinity` | `shard_o_war` — Shard o' War | 200 | 100 | +100 |
| `gen2_the_hms_divinity` | `tribute_to_the_man_o_war` — Tribute to the Man o' War | 200 | 100 | +100 |
| `gen2_the_hms_divinity` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_the_shining_blade` | `shard_of_the_crown` — Shard of the Crown | 200 | 100 | +100 |
| `gen2_the_shining_blade` | `tribute_to_the_queen` — Tribute to the Queen | 200 | 100 | +100 |
| `gen2_the_shining_blade` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_verdarach` | `shard_of_call_of_the_void` — Shard of Call of the Void | 200 | 100 | +100 |
| `gen2_verdarach` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen2_xiuquatl` | `shard_of_tlehco` — Shard of Tlehco | 200 | 100 | +100 |
| `gen2_xiuquatl` | `tribute_to_tlehco` — Tribute to Tlehco | 200 | 100 | +100 |
| `gen2_xiuquatl` | `mystic_curio` — Mystic Curio | 200 | 100 | +100 |
| `gen3_aurenes_flight` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 340 | 250 | +90 |
| `gen3_aurenes_wing` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 340 | 250 | +90 |
| `gen3_aurenes_argument` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen3_aurenes_bite` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen3_aurenes_claw` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen3_aurenes_fang` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen3_aurenes_persuasion` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen3_aurenes_rending` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen3_aurenes_tail` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen3_aurenes_voice` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen3_aurenes_weight` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 330 | 250 | +80 |
| `gen2_pharus` | `hard_wood_plank` — Hard Wood Plank | 330 | 250 | +80 |
| `gen2_shooshadoo` | `darksteel_ingot` — Darksteel Ingot | 330 | 250 | +80 |
| `gen3_aurenes_breath` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 320 | 250 | +70 |
| `gen3_aurenes_gaze` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 320 | 250 | +70 |
| `gen3_aurenes_insight` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 320 | 250 | +70 |
| `gen3_aurenes_scale` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 320 | 250 | +70 |
| `gen3_aurenes_wisdom` | `thermocatalytic_reagent` — Thermocatalytic Reagent | 320 | 250 | +70 |
| `gen2_eureka` | `darksteel_ingot` — Darksteel Ingot | 310 | 250 | +60 |
| `gen2_sharur` | `darksteel_ingot` — Darksteel Ingot | 310 | 250 | +60 |
| `gen2_the_hms_divinity` | `hard_wood_plank` — Hard Wood Plank | 310 | 250 | +60 |

## Excedents expliques par une branche fermee de la table

| legendaire | composant | affiche | table | par |
|---|---|---:|---:|---|
| `gen2_exordium` | `mithril_ingot` | 11550 | 4250 | `mystic_curio` |
| `gen2_sharur` | `mithril_ingot` | 11400 | 4250 | `mystic_curio` |
| `gen2_the_hms_divinity` | `mithril_ingot` | 11150 | 4000 | `mystic_curio` |
| `gen2_pharus` | `mithril_ingot` | 11000 | 4000 | `mystic_curio` |
| `gen2_the_shining_blade` | `mithril_ingot` | 9550 | 3250 | `mystic_curio` |
| `gen2_claw_of_the_khan_ur` | `mithril_ingot` | 9500 | 3250 | `mystic_curio` |
| `gen2_eureka` | `mithril_ingot` | 9400 | 3250 | `mystic_curio` |
| `gen2_xiuquatl` | `mithril_ingot` | 9000 | 3000 | `mystic_curio` |
| `gen2_pharus` | `elder_wood_plank` | 8450 | 3250 | `mystic_curio` |
| `gen2_shooshadoo` | `mithril_ingot` | 7450 | 2250 | `mystic_curio` |
| `gen2_the_hms_divinity` | `elder_wood_plank` | 8400 | 3250 | `mystic_curio` |
| `gen2_flames_of_war` | `mithril_ingot` | 7100 | 2000 | `mystic_curio` |
| `gen2_sharur` | `elder_wood_plank` | 8100 | 3000 | `mystic_curio` |
| `gen2_verdarach` | `mithril_ingot` | 7100 | 2000 | `mystic_curio` |
| `gen2_exordium` | `elder_wood_plank` | 8000 | 3000 | `mystic_curio` |
| `gen2_the_binding_of_ipos` | `mithril_ingot` | 7000 | 2000 | `mystic_curio` |
| `gen2_xiuquatl` | `elder_wood_plank` | 6250 | 2000 | `mystic_curio` |
| `gen2_eureka` | `elder_wood_plank` | 6100 | 2000 | `mystic_curio` |
| `gen2_claw_of_the_khan_ur` | `elder_wood_plank` | 6000 | 2000 | `mystic_curio` |
| `gen2_the_shining_blade` | `elder_wood_plank` | 6000 | 2000 | `mystic_curio` |
| `gen2_flames_of_war` | `elder_wood_plank` | 4350 | 1250 | `mystic_curio` |
| `gen2_verdarach` | `elder_wood_plank` | 4350 | 1250 | `mystic_curio` |
| `gen2_shooshadoo` | `elder_wood_plank` | 4000 | 1000 | `mystic_curio` |
| `gen2_the_binding_of_ipos` | `elder_wood_plank` | 4000 | 1000 | `mystic_curio` |
| `transcendence` | `shard_of_glory` | 2500 | 250 | `gift_of_the_mists` |
| `conflux` | `memory_of_battle` | 1750 | 250 | `gift_of_the_mists`, `gift_of_war_dedication`, `war_commendation` |
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
| `gen2_xiuquatl` | `dust_crystalline` | 465 | 250 | `gift_of_dust` |
| `gen2_nevermore` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_nevermore` | `dust_luminous` | 350 | 250 | `gift_of_dust` |
