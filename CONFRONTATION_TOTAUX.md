# Confrontation des TOTAUX — ce qui s'affiche contre ce qu'ecrit la table

Source : `gw2_sources_v369.json`, 1135 totaux compares sur les tables rattachees a un legendaire.

Les quantites d'une table « Full material list » sont des totaux pour le
legendaire. Mais la table s'arrete ou elle veut : elle ecrit 2 000 lingots
sous le tesson d'Ipos et n'ouvre pas le Mystic Curio, qui en coute 1 500 de
plus. **Son total est donc un plancher, pas une egalite.**

- **969 accords** — le nombre affiche est celui de la table.
- **0 trous** — l'affichage est SOUS le plancher. Certains.
- **166 excedents expliques** — le surplus vient d'une branche
  que la table cite sans l'ouvrir, ou d'un chevauchement declare en
  `qty_overlap_verified`.
- **0 excedents nus** — rien dans la donnee ne les explique : soit
  un double comptage, soit une branche legitime qu'il faut nommer.


## Trous — le total affiche est inferieur a celui de la table

| legendaire | composant | affiche | table | manque |
|---|---|---:|---:|---:|

## Excedents nus — a expliquer ou a corriger

| legendaire | composant | affiche | table | excedent |
|---|---|---:|---:|---:|

## Excedents expliques par une branche fermee de la table

| legendaire | composant | affiche | table | par |
|---|---|---:|---:|---|
| `gen2_exordium` | `mithril_ingot` | 11550 | 4250 | `exitare`, `mystic_curio` |
| `gen2_sharur` | `mithril_ingot` | 11400 | 4250 | `might_of_arah`, `mystic_curio` |
| `gen2_the_hms_divinity` | `mithril_ingot` | 11150 | 4000 | `man_o_war`, `mystic_curio` |
| `gen2_pharus` | `mithril_ingot` | 11000 | 4000 | `mystic_curio`, `spero` |
| `gen2_the_shining_blade` | `mithril_ingot` | 9550 | 3250 | `mystic_curio`, `save_the_queen` |
| `gen2_claw_of_the_khan_ur` | `mithril_ingot` | 9500 | 3250 | `claw_of_resolution`, `mystic_curio` |
| `gen2_eureka` | `mithril_ingot` | 9400 | 3250 | `endeavor`, `mystic_curio` |
| `gen2_xiuquatl` | `mithril_ingot` | 9000 | 3000 | `mystic_curio`, `tlehco` |
| `gen2_pharus` | `elder_wood_plank` | 8450 | 3250 | `mystic_curio`, `spero` |
| `gen2_shooshadoo` | `mithril_ingot` | 7450 | 2250 | `friendship`, `mystic_curio` |
| `gen2_the_hms_divinity` | `elder_wood_plank` | 8400 | 3250 | `man_o_war`, `mystic_curio` |
| `gen2_flames_of_war` | `mithril_ingot` | 7100 | 2000 | `liturgy`, `mystic_curio` |
| `gen2_sharur` | `elder_wood_plank` | 8100 | 3000 | `might_of_arah`, `mystic_curio` |
| `gen2_verdarach` | `mithril_ingot` | 7100 | 2000 | `call_of_the_void`, `mystic_curio` |
| `gen2_exordium` | `elder_wood_plank` | 8000 | 3000 | `exitare`, `mystic_curio` |
| `gen2_the_binding_of_ipos` | `mithril_ingot` | 7000 | 2000 | `ars_goetia`, `mystic_curio` |
| `gen2_xiuquatl` | `elder_wood_plank` | 6250 | 2000 | `mystic_curio`, `tlehco` |
| `gen2_eureka` | `elder_wood_plank` | 6100 | 2000 | `endeavor`, `mystic_curio` |
| `gen2_claw_of_the_khan_ur` | `elder_wood_plank` | 6000 | 2000 | `claw_of_resolution`, `mystic_curio` |
| `gen2_the_shining_blade` | `elder_wood_plank` | 6000 | 2000 | `mystic_curio`, `save_the_queen` |
| `gen2_flames_of_war` | `elder_wood_plank` | 4350 | 1250 | `liturgy`, `mystic_curio` |
| `gen2_verdarach` | `elder_wood_plank` | 4350 | 1250 | `call_of_the_void`, `mystic_curio` |
| `gen2_shooshadoo` | `elder_wood_plank` | 4000 | 1000 | `friendship`, `mystic_curio` |
| `gen2_the_binding_of_ipos` | `elder_wood_plank` | 4000 | 1000 | `ars_goetia`, `mystic_curio` |
| `transcendence` | `shard_of_glory` | 2250 | 250 | `gift_of_the_mists` |
| `conflux` | `memory_of_battle` | 1750 | 250 | `gift_of_the_mists`, `gift_of_war_dedication`, `war_commendation` |
| `gen2_nevermore` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `gen1_the_bifrost` | `dust_incandescent` | 750 | 250 | `opal_orb` |
| `gen2_the_binding_of_ipos` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `gen1_the_minstrel` | `dust_incandescent` | 750 | 250 | `opal_orb` |
| `gen2_xiuquatl` | `dust_incandescent` | 750 | 250 | `gift_of_dust` |
| `warbringer` | `skirmish_claim_ticket` | 2800 | 2450 | `mystic_essence_of_annihilation`, `warcry` |
| `gen2_xiuquatl` | `dust_crystalline` | 465 | 250 | `gift_of_dust`, `tlehco` |
| `gen2_nevermore` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_crystalline` | 450 | 250 | `gift_of_dust` |
| `gen2_exordium` | `darksteel_ingot` | 370 | 250 | `exitare` |
| `gen2_the_shining_blade` | `darksteel_ingot` | 370 | 250 | `save_the_queen` |
| `gen2_claw_of_the_khan_ur` | `shard_of_resolution` | 200 | 100 | `claw_of_resolution` |
| `gen2_claw_of_the_khan_ur` | `tribute_to_resolution` | 200 | 100 | `claw_of_resolution` |
| `gen2_claw_of_the_khan_ur` | `mystic_curio` | 200 | 100 | `claw_of_resolution` |
| `gen2_claw_of_the_khan_ur` | `darksteel_ingot` | 350 | 250 | `claw_of_resolution` |
| `gen2_eureka` | `shard_of_endeavor` | 200 | 100 | `endeavor` |
| `gen2_eureka` | `tribute_to_endeavor` | 200 | 100 | `endeavor` |
| `gen2_eureka` | `mystic_curio` | 200 | 100 | `endeavor` |
| `gen2_exordium` | `shard_of_exitare` | 200 | 100 | `exitare` |
| `gen2_exordium` | `mystic_curio` | 200 | 100 | `exitare` |
| `gen2_flames_of_war` | `shard_of_liturgy` | 200 | 100 | `liturgy` |
| `gen2_flames_of_war` | `tribute_to_liturgy` | 200 | 100 | `liturgy` |
| `gen2_flames_of_war` | `mystic_curio` | 200 | 100 | `liturgy` |
| `gen2_nevermore` | `dust_luminous` | 350 | 250 | `gift_of_dust` |
| `gen2_nevermore` | `dust_radiant` | 350 | 250 | `gift_of_dust` |
| `gen2_pharus` | `shard_of_spero` | 200 | 100 | `spero` |
| `gen2_pharus` | `tribute_to_spero` | 200 | 100 | `spero` |
| `gen2_pharus` | `mystic_curio` | 200 | 100 | `spero` |
| `gen2_sharur` | `shard_of_arah` | 200 | 100 | `might_of_arah` |
| `gen2_sharur` | `tribute_to_arah` | 200 | 100 | `might_of_arah` |
| `gen2_sharur` | `mystic_curio` | 200 | 100 | `might_of_arah` |
| `gen2_shooshadoo` | `shard_of_friendship` | 200 | 100 | `friendship` |
| `gen2_shooshadoo` | `tribute_to_friendship` | 200 | 100 | `friendship` |
| `gen2_shooshadoo` | `mystic_curio` | 200 | 100 | `friendship` |
| `the_ascension` | `pvp_league_ticket` | 225 | 125 | `gift_of_skirmishing`, `wings_of_ascension` |
| `gen2_the_binding_of_ipos` | `shard_of_the_dark_arts` | 200 | 100 | `ars_goetia` |
| `gen2_the_binding_of_ipos` | `tribute_to_the_dark_arts` | 200 | 100 | `ars_goetia` |
| `gen2_the_binding_of_ipos` | `mystic_curio` | 200 | 100 | `ars_goetia` |
| `gen2_the_binding_of_ipos` | `dust_luminous` | 350 | 250 | `gift_of_dust` |
| `gen2_the_binding_of_ipos` | `dust_radiant` | 350 | 250 | `gift_of_dust` |
| `gen2_the_hms_divinity` | `shard_o_war` | 200 | 100 | `man_o_war` |
| `gen2_the_hms_divinity` | `tribute_to_the_man_o_war` | 200 | 100 | `man_o_war` |
| `gen2_the_hms_divinity` | `mystic_curio` | 200 | 100 | `man_o_war` |
| `gen2_the_shining_blade` | `shard_of_the_crown` | 200 | 100 | `save_the_queen` |
| `gen2_the_shining_blade` | `tribute_to_the_queen` | 200 | 100 | `save_the_queen` |
| `gen2_the_shining_blade` | `mystic_curio` | 200 | 100 | `save_the_queen` |
| `gen2_verdarach` | `shard_of_call_of_the_void` | 200 | 100 | `call_of_the_void` |
| `gen2_verdarach` | `mystic_curio` | 200 | 100 | `call_of_the_void` |
| `gen2_xiuquatl` | `shard_of_tlehco` | 200 | 100 | `tlehco` |
| `gen2_xiuquatl` | `tribute_to_tlehco` | 200 | 100 | `tlehco` |
| `gen2_xiuquatl` | `mystic_curio` | 200 | 100 | `tlehco` |
| `gen2_xiuquatl` | `dust_luminous` | 350 | 250 | `gift_of_dust` |
| `gen2_xiuquatl` | `dust_radiant` | 350 | 250 | `gift_of_dust` |
| `gen3_aurenes_flight` | `thermocatalytic_reagent` | 340 | 250 | `poem_on_longbows (omis : spiritwood_longbow_stave)` |
| `gen3_aurenes_wing` | `thermocatalytic_reagent` | 340 | 250 | `poem_on_short_bows (omis : spiritwood_short_bow_stave)` |
| `gen3_aurenes_argument` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_pistols (omis : deldrimor_steel_pistol_barrel)` |
| `gen3_aurenes_bite` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_greatswords (omis : deldrimor_steel_greatsword_blade)` |
| `gen3_aurenes_claw` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_daggers (omis : deldrimor_steel_dagger_blade)` |
| `gen3_aurenes_fang` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_swords (omis : deldrimor_steel_sword_blade)` |
| `gen3_aurenes_persuasion` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_rifles (omis : deldrimor_steel_rifle_barrel)` |
| `gen3_aurenes_rending` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_axes (omis : deldrimor_steel_axe_blade)` |
| `gen3_aurenes_tail` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_maces (omis : deldrimor_steel_mace_head)` |
| `gen3_aurenes_voice` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_warhorns (omis : deldrimor_steel_horn)` |
| `gen3_aurenes_weight` | `thermocatalytic_reagent` | 330 | 250 | `poem_on_hammers (omis : deldrimor_steel_hammer_head)` |
| `gen2_pharus` | `hard_wood_plank` | 330 | 250 | `spero` |
| `gen2_shooshadoo` | `darksteel_ingot` | 330 | 250 | `friendship` |
| `gen3_aurenes_breath` | `thermocatalytic_reagent` | 320 | 250 | `poem_on_torches (omis : deldrimor_steel_torch_head)` |
| `gen3_aurenes_gaze` | `thermocatalytic_reagent` | 320 | 250 | `poem_on_foci (omis : spiritwood_focus_core)` |
| `gen3_aurenes_insight` | `thermocatalytic_reagent` | 320 | 250 | `poem_on_staves (omis : spiritwood_staff_head)` |
| `gen3_aurenes_scale` | `thermocatalytic_reagent` | 320 | 250 | `poem_on_shields (omis : deldrimor_steel_shield_boss)` |
| `gen3_aurenes_wisdom` | `thermocatalytic_reagent` | 320 | 250 | `poem_on_scepters (omis : spiritwood_scepter_core)` |
| `gen2_eureka` | `darksteel_ingot` | 310 | 250 | `endeavor` |
| `selachimorpha` | `obsidian_shard` | 310 | 250 | `qty_overlap_verified` |
| `gen2_sharur` | `darksteel_ingot` | 310 | 250 | `might_of_arah` |
| `gen2_the_hms_divinity` | `hard_wood_plank` | 310 | 250 | `man_o_war` |
| `gen2_flames_of_war` | `hard_wood_plank` | 290 | 250 | `liturgy` |
| `gen2_pharus` | `seasoned_wood_plank` | 290 | 250 | `spero` |
| `gen2_verdarach` | `hard_wood_plank` | 290 | 250 | `call_of_the_void` |
| `gen3_aurenes_argument` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_bite` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_breath` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_claw` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_fang` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_flight` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_gaze` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_insight` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_persuasion` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_scale` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_tail` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_voice` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_weight` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_wing` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen3_aurenes_wisdom` | `mystic_clover` | 77 | 38 | `qty_overlap_verified` |
| `gen2_the_hms_divinity` | `seasoned_wood_plank` | 280 | 250 | `man_o_war` |
| `gen1_kraitkin` | `dust_incandescent` | 275 | 250 | `superior_sigil_of_venom` |
| `gen1_meteorlogicus` | `dust_incandescent` | 275 | 250 | `superior_sigil_of_air` |
| `gen2_flames_of_war` | `seasoned_wood_plank` | 270 | 250 | `liturgy` |
| `gen1_kraitkin` | `dust_radiant` | 270 | 250 | `superior_sigil_of_venom` |
| `gen1_meteorlogicus` | `dust_radiant` | 270 | 250 | `superior_sigil_of_air` |
| `gen2_verdarach` | `seasoned_wood_plank` | 270 | 250 | `call_of_the_void` |
| `warbringer` | `vial_of_powerful_blood` | 270 | 250 | `gift_of_fortune`, `mystic_essence_of_strategy` |
| `warbringer` | `armored_scale` | 270 | 250 | `gift_of_fortune`, `mystic_essence_of_carnage` |
| `warbringer` | `vicious_claw` | 270 | 250 | `gift_of_fortune`, `mystic_essence_of_annihilation` |
| `warbringer` | `ancient_bone` | 270 | 250 | `gift_of_fortune`, `mystic_essence_of_animosity` |
| `gen1_frenzy` | `glob_of_ectoplasm` | 265 | 250 | `superior_sigil_of_rage` |
| `gen1_bolt` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_air` |
| `gen1_frostfang` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_ice` |
| `gen1_howler` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_accuracy` |
| `gen1_incinerator` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_fire` |
| `gen1_kraitkin` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_venom` |
| `gen1_kraitkin` | `dust_luminous` | 260 | 250 | `superior_sigil_of_venom` |
| `gen1_kudzu` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_celerity` |
| `gen1_meteorlogicus` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_air` |
| `gen1_meteorlogicus` | `dust_luminous` | 260 | 250 | `superior_sigil_of_air` |
| `gen1_quip` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_stamina` |
| `gen1_quip` | `vicious_claw` | 260 | 250 | `superior_sigil_of_stamina` |
| `gen1_rodgort` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_fire` |
| `gen1_sunrise` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_strength` |
| `gen1_the_bifrost` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_nullification` |
| `gen1_the_bifrost` | `elaborate_totem` | 260 | 250 | `superior_sigil_of_nullification` |
| `gen1_the_dreamer` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_purity` |
| `gen1_the_flameseeker_prophecies` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_battle` |
| `gen1_the_juggernaut` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_benevolence` |
| `gen1_the_minstrel` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_energy` |
| `gen1_the_moot` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_energy` |
| `gen1_the_predator` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_force` |
| `gen1_twilight` | `glob_of_ectoplasm` | 260 | 250 | `superior_sigil_of_blood` |
| `gen1_the_dreamer` | `chrysocola_orb` | 105 | 100 | `superior_sigil_of_purity` |
| `gen2_claw_of_the_khan_ur` | `orichalcum_ingot` | 253 | 250 | `claw_of_resolution` |
| `gen2_eureka` | `orichalcum_ingot` | 253 | 250 | `endeavor` |
| `gen2_exordium` | `orichalcum_ingot` | 253 | 250 | `exitare` |
| `gen2_sharur` | `orichalcum_ingot` | 253 | 250 | `might_of_arah` |
| `gen2_shooshadoo` | `orichalcum_ingot` | 253 | 250 | `friendship` |
| `gen2_the_shining_blade` | `orichalcum_ingot` | 253 | 250 | `save_the_queen` |
| `gen2_flames_of_war` | `ancient_wood_plank` | 252 | 250 | `liturgy` |
| `gen2_pharus` | `ancient_wood_plank` | 252 | 250 | `spero` |
| `gen2_the_hms_divinity` | `ancient_wood_plank` | 252 | 250 | `man_o_war` |
| `gen2_verdarach` | `ancient_wood_plank` | 252 | 250 | `call_of_the_void` |
| `conflux` | `gift_of_battle` | 5 | 4 | `gift_of_the_mists` |
| `gen1_kudzu` | `dust_crystalline` | 251 | 250 | `superior_sigil_of_celerity` |
