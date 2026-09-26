# Relecture des recettes, légendaire par légendaire

Source : `gw2_sources_v326.json` — généré par `gw2_relecture_recettes_v1.py`.
L'outil descend depuis chaque légendaire et compare, à chaque nœud, les
enfants déclarés à la recette lue sur sa capture. Appariement par apiId
d'abord (591 composants sur 601 en portent un), par nom en dernier recours,
un appariement au singulier étant signalé comme à confirmer.

Chaque défaut est compté **une fois**, avec la liste des légendaires qui le
rencontrent : un composant est une unité de craft, pas une ligne par cible.

| défaut | ce que ça veut dire | ce que ça coûte | nombre |
|---|---|---|---:|
| MANQUANT | la recette cite un ingrédient absent de l'arbre | le coût n'existe nulle part | 128 |
| NON_RELIÉ | l'ingrédient existe mais aucune arête `qty` ne le rattache | le coût existe et ne remonte pas — le plus sournois | 33 |
| EN_TROP | enfant déclaré hors recette | souvent légitime (voie alternative, coût d'acquisition) | 15 |
| NON_DÉCOMPOSÉ | recette lue, aucun enfant | décision de modélisation à revoir, pas un bug | 53 |

## Ingrédients qu'aucun composant ne représente — 128

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `spiritwood_plank` | `Glob_of_Elder_Spirit_Residue` | 1 | `spiritwood_plank` | — | `ad_infinitum`, `gen3_aurenes_flight`, `gen3_aurenes_gaze` … (+5) |
| `spiritwood_plank` | `Soft_Wood_Plank` | 20 | `spiritwood_plank` | — | `ad_infinitum`, `gen3_aurenes_flight`, `gen3_aurenes_gaze` … (+5) |
| `certificate_of_heroics` | `Testimony_of_Jade_Heroics` | 250 | `certificate_of_heroics` | — | `conflux`, `triumphant_hero` |
| `essence_of_animosity` | `Testimony_of_Jade_Heroics` | 500 | `essence_of_animosity` | — | `conflux`, `warbringer` |
| `gift_of_darkness` | `Gift_of_Ascalon` | 1 | `gift_of_darkness` | — | `gen1_twilight`, `orrax_manifested` |
| `gift_of_entertainment` | `Gift_of_the_Nobleman` | 1 | `gift_of_entertainment` | — | `gen1_quip`, `gen1_the_moot` |
| `mystic_essence_of_annihilation` | `Dark_Matter` | 10 | `mystic_essence_of_annihilation` | — | `conflux`, `warbringer` |
| `mystic_essence_of_strategy` | `Piles_of_Bloodstone_Dust` | 250 | `mystic_essence_of_strategy` | — | `conflux`, `warbringer` |
| `neutralized_titan_alloy` | `Charged_Titan_Ore` | 5 | `neutralized_titan_alloy` | — | `klobjarne_geirr`, `orrax_manifested` |
| `neutralized_titan_alloy` | `Rotted_Titan_Amber` | 5 | `neutralized_titan_alloy` | — | `klobjarne_geirr`, `orrax_manifested` |
| `vial_of_liquid_flame` | `Gift_of_Baelfire` | 1 | `vial_of_liquid_flame` | — | `gen1_incinerator`, `gen1_rodgort` |
| `xunlai_electrum_ingot` | `Gold_Ingot` | 10 | `xunlai_electrum_ingot` | — | `aurora`, `vision` |
| `xunlai_electrum_ingot` | `Silver_Ingot` | 20 | `xunlai_electrum_ingot` | — | `aurora`, `vision` |
| `banner_of_the_commander` | `Unidentified_Dye` | 20 | `banner_of_the_commander` | — | `vision` |
| `chrysocola_orb` | `Chrysocola_Crystal` | 2 | `chrysocola_orb` | — | `gen1_the_dreamer` |
| `diviners_orichalcum_imbued_inscription` | `Orichalcum_Plated_Dowel` | 5 | `diviners_orichalcum_imbued_inscription` | — | `vision` |
| `eel_statue` | `Gift_of_the_Forgeman` | 1 | `eel_statue` | — | `gen1_kraitkin` |
| `gen1_bolt` | `Zap` | 1 | `bolt` | — | `gen1_bolt` |
| `gen1_frenzy` | `Rage_(weapon)` | 1 | `frenzy` | — | `gen1_frenzy` |
| `gen1_frostfang` | `Tooth_of_Frostfang` | 1 | `frostfang` | — | `gen1_frostfang` |
| `gen1_howler` | `Howl` | 1 | `howler` | — | `gen1_howler` |
| `gen1_incinerator` | `Spark_(weapon)` | 1 | `incinerator` | — | `gen1_incinerator` |
| `gen1_kraitkin` | `Venom_(weapon)` | 1 | `kraitkin` | — | `gen1_kraitkin` |
| `gen1_kudzu` | `Leaf_of_Kudzu` | 1 | `kudzu` | — | `gen1_kudzu` |
| `gen1_meteorlogicus` | `Storm` | 1 | `meteorlogicus` | — | `gen1_meteorlogicus` |
| `gen1_quip` | `Chaos_Gun` | 1 | `quip` | — | `gen1_quip` |
| `gen1_rodgort` | `Rodgort's_Flame` | 1 | `rodgort` | — | `gen1_rodgort` |
| `gen1_sunrise` | `Dawn` | 1 | `sunrise` | — | `gen1_sunrise` |
| `gen1_the_bifrost` | `The_Legend` | 1 | `the_bifrost` | — | `gen1_the_bifrost` |
| `gen1_the_dreamer` | `The_Lover` | 1 | `the_dreamer` | — | `gen1_the_dreamer` |
| `gen1_the_flameseeker_prophecies` | `The_Chosen` | 1 | `the_flameseeker_prophecies` | — | `gen1_the_flameseeker_prophecies` |
| `gen1_the_juggernaut` | `The_Colossus` | 1 | `the_juggernaut` | — | `gen1_the_juggernaut` |
| `gen1_the_minstrel` | `The_Bard` | 1 | `the_minstrel` | — | `gen1_the_minstrel` |
| `gen1_the_moot` | `The_Energizer` | 1 | `the_moot` | — | `gen1_the_moot` |
| `gen1_the_predator` | `The_Hunter` | 1 | `the_predator` | — | `gen1_the_predator` |
| `gen1_twilight` | `Dusk` | 1 | `twilight` | — | `gen1_twilight` |
| `gen2_astralaria` | `The_Mechanism` | 1 | `astralaria` | — | `gen2_astralaria` |
| `gen2_chuka_and_champawat` | `Tigris` | 1 | `chuka_and_champawat` | — | `gen2_chuka_and_champawat` |
| `gen2_claw_of_the_khan_ur` | `Claw_of_Resolution` | 1 | `claw_of_the_khan_ur` | — | `gen2_claw_of_the_khan_ur` |
| `gen2_eureka` | `Endeavor` | 1 | `eureka` | — | `gen2_eureka` |
| `gen2_exordium` | `Exitare` | 1 | `exordium` | — | `gen2_exordium` |
| `gen2_flames_of_war` | `Liturgy` | 1 | `flames_of_war` | — | `gen2_flames_of_war` |
| `gen2_hope` | `Prototype` | 1 | `hope` | — | `gen2_hope` |
| `gen2_nevermore` | `The_Raven_Staff` | 1 | `nevermore` | — | `gen2_nevermore` |
| `gen2_pharus` | `Spero` | 1 | `pharus` | — | `gen2_pharus` |
| `gen2_sharur` | `Might_of_Arah` | 1 | `sharur` | — | `gen2_sharur` |
| `gen2_shooshadoo` | `Friendship` | 1 | `shooshadoo` | — | `gen2_shooshadoo` |
| `gen2_the_hms_divinity` | `Man_o'_War` | 1 | `the_hms_divinity` | — | `gen2_the_hms_divinity` |
| `gen2_the_shining_blade` | `Save_the_Queen` | 1 | `the_shining_blade` | — | `gen2_the_shining_blade` |
| `gen2_verdarach` | `Call_of_the_Void` | 1 | `verdarach` | — | `gen2_verdarach` |
| `gen2_xiuquatl` | `Tlehco` | 1 | `xiuquatl` | — | `gen2_xiuquatl` |
| `gift_of_bolt` | `Superior_Sigil_of_Air` | 1 | `gift_of_bolt` | — | `gen1_bolt` |
| `gift_of_color` | `Gift_of_Zhaitan` | 1 | `gift_of_color` | — | `gen1_the_bifrost` |
| `gift_of_color` | `Unidentified_Dye` | 100 | `gift_of_color` | — | `gen1_the_bifrost` |
| `gift_of_compassion` | `Legendary_Insight_(consumable)` | 150 | `gift_of_compassion` | — | `coalescence` |
| `gift_of_embracing_refuge` | `Refined_Homestead_Fiber` | 250 | `gift_of_embracing_refuge` | — | `klobjarne_geirr` |
| `gift_of_embracing_refuge` | `Refined_Homestead_Metal` | 250 | `gift_of_embracing_refuge` | — | `klobjarne_geirr` |
| `gift_of_embracing_refuge` | `Refined_Homestead_Wood` | 250 | `gift_of_embracing_refuge` | — | `klobjarne_geirr` |
| `gift_of_frenzy` | `Superior_Sigil_of_Rage` | 1 | `gift_of_frenzy` | — | `gen1_frenzy` |
| `gift_of_frostfang` | `Superior_Sigil_of_Ice` | 1 | `gift_of_frostfang` | — | `gen1_frostfang` |
| `gift_of_gatherer_of_the_hunt` | `Sweet-Treated_Pine_Plank` | 100 | `gift_of_gatherer_of_the_hunt` | — | `klobjarne_geirr` |
| `gift_of_history` | `Gift_of_Ascalon` | 1 | `gift_of_history` | — | `gen1_the_flameseeker_prophecies` |
| `gift_of_howler` | `Superior_Sigil_of_Accuracy` | 1 | `gift_of_howler` | — | `gen1_howler` |
| `gift_of_ice` | `Gift_of_the_Sanctuary` | 1 | `gift_of_ice` | — | `gen1_frostfang` |
| `gift_of_incinerator` | `Superior_Sigil_of_Fire` | 1 | `gift_of_incinerator` | — | `gen1_incinerator` |
| `gift_of_kraitkin` | `Superior_Sigil_of_Venom` | 1 | `gift_of_kraitkin` | — | `gen1_kraitkin` |
| `gift_of_kudzu` | `Superior_Sigil_of_Celerity` | 1 | `gift_of_kudzu` | — | `gen1_kudzu` |
| `gift_of_light` | `Gift_of_Ascalon` | 1 | `gift_of_light` | — | `gen1_sunrise` |
| `gift_of_lightning` | `Gift_of_Ascalon` | 1 | `gift_of_lightning` | — | `gen1_bolt` |
| `gift_of_meteorlogicus` | `Superior_Sigil_of_Air` | 1 | `gift_of_meteorlogicus` | — | `gen1_meteorlogicus` |
| `gift_of_music` | `Gift_of_the_Nobleman` | 1 | `gift_of_music` | — | `gen1_the_minstrel` |
| `gift_of_nature` | `Gift_of_Thorns` | 1 | `gift_of_nature` | — | `gen1_kudzu` |
| `gift_of_prowess` | `Legendary_Insight_(consumable)` | 25 | `gift_of_prowess` | — | `perfected_envoy` |
| `gift_of_quip` | `Superior_Sigil_of_Stamina` | 1 | `gift_of_quip` | — | `gen1_quip` |
| `gift_of_recollector_of_memories` | `Memory_of_the_Bearkin's_Hunts` | 1 | `gift_of_recollector_of_memories` | — | `klobjarne_geirr` |
| `gift_of_recollector_of_memories` | `Memory_of_the_Bearkin's_Victories` | 1 | `gift_of_recollector_of_memories` | — | `klobjarne_geirr` |
| `gift_of_rodgort` | `Superior_Sigil_of_Fire` | 1 | `gift_of_rodgort` | — | `gen1_rodgort` |
| `gift_of_sharpened_tip` | `Memory_of_Bearkin's_Adversaries` | 1 | `gift_of_sharpened_tip` | — | `klobjarne_geirr` |
| `gift_of_stealth` | `Gift_of_Knowledge` | 1 | `gift_of_stealth` | — | `gen1_the_predator` |
| `gift_of_sunrise` | `Superior_Sigil_of_Strength` | 1 | `gift_of_sunrise` | — | `gen1_sunrise` |
| `gift_of_the_appetizer` | `Bowl_of_Poultry_Satay` | 200 | `gift_of_the_appetizer` | — | `orrax_manifested` |
| `gift_of_the_appetizer` | `Fruit_of_the_Shadow` | 5 | `gift_of_the_appetizer` | — | `orrax_manifested` |
| `gift_of_the_appetizer` | `Red-Lentil_Saobosa` | 100 | `gift_of_the_appetizer` | — | `orrax_manifested` |
| `gift_of_the_appetizer` | `Spicy_Marinated_Mushroom` | 50 | `gift_of_the_appetizer` | — | `orrax_manifested` |
| `gift_of_the_bifrost` | `Superior_Sigil_of_Nullification` | 1 | `gift_of_the_bifrost` | — | `gen1_the_bifrost` |
| `gift_of_the_dessert` | `Bowl_of_Passion_Fruit_Tapioca_Pudding` | 50 | `gift_of_the_dessert` | — | `orrax_manifested` |
| `gift_of_the_dessert` | `Bowl_of_Prickly_Pear_Sorbet` | 200 | `gift_of_the_dessert` | — | `orrax_manifested` |
| `gift_of_the_dessert` | `Fruit_of_the_Shadow` | 5 | `gift_of_the_dessert` | — | `orrax_manifested` |
| `gift_of_the_dreamer` | `Superior_Sigil_of_Purity` | 1 | `gift_of_the_dreamer` | — | `gen1_the_dreamer` |
| `gift_of_the_entree` | `Fruit_of_the_Shadow` | 5 | `gift_of_the_entree` | — | `orrax_manifested` |
| `gift_of_the_entree` | `Plate_of_Orrian_Steak_Frittes` | 200 | `gift_of_the_entree` | — | `orrax_manifested` |
| `gift_of_the_entree` | `Plate_of_Spicy_Herbed_Chicken` | 50 | `gift_of_the_entree` | — | `orrax_manifested` |
| `gift_of_the_entree` | `Plate_of_Truffle_Steak` | 100 | `gift_of_the_entree` | — | `orrax_manifested` |
| `gift_of_the_flameseeker_prophecies` | `Superior_Sigil_of_Battle` | 1 | `gift_of_the_flameseeker_prophecies` | — | `gen1_the_flameseeker_prophecies` |
| `gift_of_the_juggernaut` | `Superior_Sigil_of_Benevolence` | 1 | `gift_of_the_juggernaut` | — | `gen1_the_juggernaut` |
| `gift_of_the_minstrel` | `Superior_Sigil_of_Energy` | 1 | `gift_of_the_minstrel` | — | `gen1_the_minstrel` |
| `gift_of_the_moot` | `Superior_Sigil_of_Energy` | 1 | `gift_of_the_moot` | — | `gen1_the_moot` |
| `gift_of_the_predator` | `Superior_Sigil_of_Force` | 1 | `gift_of_the_predator` | — | `gen1_the_predator` |
| `gift_of_the_rider` | `Spirit_of_the_Jackal` | 1 | `gift_of_the_rider` | — | `coalescence` |
| `gift_of_the_rider` | `Spirit_of_the_Raptor` | 1 | `gift_of_the_rider` | — | `coalescence` |
| `gift_of_the_rider` | `Spirit_of_the_Skimmer` | 1 | `gift_of_the_rider` | — | `coalescence` |
| `gift_of_the_rider` | `Spirit_of_the_Springer` | 1 | `gift_of_the_rider` | — | `coalescence` |
| `gift_of_the_side_course` | `Bowl_of_Black_Pepper_Cactus_Salad` | 100 | `gift_of_the_side_course` | — | `orrax_manifested` |
| `gift_of_the_side_course` | `Fruit_of_the_Shadow` | 5 | `gift_of_the_side_course` | — | `orrax_manifested` |
| `gift_of_the_side_course` | `Meaty_Asparagus_Skewer` | 200 | `gift_of_the_side_course` | — | `orrax_manifested` |
| `gift_of_twilight` | `Superior_Sigil_of_Blood` | 1 | `gift_of_twilight` | — | `gen1_twilight` |
| `gift_of_uncovered_grounds` | `Gift_of_Janthir_Syntri` | 1 | `gift_of_uncovered_grounds` | — | `klobjarne_geirr` |
| `gift_of_uncovered_grounds` | `Gift_of_Lowland_Shore` | 1 | `gift_of_uncovered_grounds` | — | `klobjarne_geirr` |
| `gift_of_uncovered_grounds` | `Gift_of_the_Ursus` | 1 | `gift_of_uncovered_grounds` | — | `klobjarne_geirr` |
| `gift_of_water` | `Gift_of_the_Sanctuary` | 1 | `gift_of_water` | — | `gen1_frenzy` |
| `gift_of_weather` | `Gift_of_Knowledge` | 1 | `gift_of_weather` | — | `gen1_meteorlogicus` |
| `mystic_aspect` | `Charm_of_Brilliance` | 1 | `mystic_aspect` | — | `legendary_rune` |
| `mystic_aspect` | `Charm_of_Potence` | 1 | `mystic_aspect` | — | `legendary_rune` |
| `mystic_aspect` | `Charm_of_Skill` | 1 | `mystic_aspect` | — | `legendary_rune` |
| `mystic_facet` | `Relic` | 1 | `mystic_facet` | — | `legendary_relic` |
| `mystic_mote` | `Symbol_of_Control` | 1 | `mystic_mote` | — | `legendary_sigil` |
| `mystic_mote` | `Symbol_of_Enhancement` | 1 | `mystic_mote` | — | `legendary_sigil` |
| `mystic_mote` | `Symbol_of_Pain` | 1 | `mystic_mote` | — | `legendary_sigil` |
| `orrax_contained` | `Askur_Camping_Cookout_Backpiece` | 1 | `orrax_contained` | — | `orrax_manifested` |
| `orrax_contained` | `Binding_of_the_Dragon` | 1 | `orrax_contained` | — | `orrax_manifested` |
| `orrax_contained` | `Salmon_of_Knowledge_Backpiece` | 1 | `orrax_contained` | — | `orrax_manifested` |
| `pristine_mist_essence` | `Rare_Essence_of_Luck` | 10 | `pristine_mist_essence` | — | `ad_infinitum` |
| `shark_statue` | `Gift_of_Zhaitan` | 1 | `shark_statue` | — | `gen1_kamohoalii_kotaki` |
| `third_order_mist_frame` | `Bolt_of_Damask` | 5 | `third_order_mist_frame` | — | `ad_infinitum` |
| `third_order_mist_frame` | `Elonian_Leather_Square` | 5 | `third_order_mist_frame` | — | `ad_infinitum` |
| `unicorn_statue` | `Gift_of_Thorns` | 1 | `unicorn_statue` | — | `gen1_the_dreamer` |
| `vial_of_quicksilver` | `Gift_of_the_Forgeman` | 1 | `vial_of_quicksilver` | — | `gen1_the_juggernaut` |
| `wolf_statue` | `Gift_of_Thorns` | 1 | `wolf_statue` | — | `gen1_howler` |

## Ingrédients présents dans l'arbre mais non rattachés au parent — 33

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `deldrimor_steel_ingot` | `Iron_Ingot` | 20 | `deldrimor_steel_ingot` | apiId | `ad_infinitum`, `gen3_aurenes_argument`, `gen3_aurenes_bite` … (+10) |
| `deldrimor_steel_ingot` | `Lump_of_Mithrillium` | 1 | `deldrimor_steel_ingot` | apiId | `ad_infinitum`, `gen3_aurenes_argument`, `gen3_aurenes_bite` … (+10) |
| `mystic_curio` | `Potent_Venom_Sac` | 35 | `mystic_curio` | apiId | `gen2_claw_of_the_khan_ur`, `gen2_eureka`, `gen2_exordium` … (+9) |
| `neutralized_titan_alloy` | `Orichalcum_Ingot` | 5 | `neutralized_titan_alloy` | apiId | `klobjarne_geirr`, `orrax_manifested` |
| `diviners_orichalcum_imbued_inscription` | `Branded_Mass` | 50 | `diviners_orichalcum_imbued_inscription` | apiId | `vision` |
| `diviners_orichalcum_imbued_inscription` | `Exquisite_Serpentite_Jewel` | 3 | `diviners_orichalcum_imbued_inscription` | apiId | `vision` |
| `gen1_eternity` | `Philosopher's_Stone` | 10 | `eternity` | nom | `gen1_eternity` |
| `gen1_eternity` | `Sunrise` | 1 | `eternity` | légendaire | `gen1_eternity` |
| `gen1_eternity` | `Twilight` | 1 | `eternity` | légendaire | `gen1_eternity` |
| `gen2_claw_of_the_khan_ur` | `Gift_of_Maguuma_Mastery` | 1 | `claw_of_the_khan_ur` | apiId | `gen2_claw_of_the_khan_ur` |
| `gen2_eureka` | `Gift_of_Maguuma_Mastery` | 1 | `eureka` | apiId | `gen2_eureka` |
| `gen2_exordium` | `Gift_of_Maguuma_Mastery` | 1 | `exordium` | apiId | `gen2_exordium` |
| `gen2_flames_of_war` | `Gift_of_Maguuma_Mastery` | 1 | `flames_of_war` | apiId | `gen2_flames_of_war` |
| `gen2_pharus` | `Gift_of_Maguuma_Mastery` | 1 | `pharus` | apiId | `gen2_pharus` |
| `gen2_sharur` | `Gift_of_Maguuma_Mastery` | 1 | `sharur` | apiId | `gen2_sharur` |
| `gen2_shooshadoo` | `Gift_of_Maguuma_Mastery` | 1 | `shooshadoo` | apiId | `gen2_shooshadoo` |
| `gen2_the_binding_of_ipos` | `Gift_of_Maguuma_Mastery` | 1 | `the_binding_of_ipos` | apiId | `gen2_the_binding_of_ipos` |
| `gen2_the_hms_divinity` | `Gift_of_Maguuma_Mastery` | 1 | `the_hms_divinity` | apiId | `gen2_the_hms_divinity` |
| `gen2_the_shining_blade` | `Gift_of_Maguuma_Mastery` | 1 | `the_shining_blade` | apiId | `gen2_the_shining_blade` |
| `gen2_verdarach` | `Gift_of_Maguuma_Mastery` | 1 | `verdarach` | apiId | `gen2_verdarach` |
| `gen2_xiuquatl` | `Gift_of_Maguuma_Mastery` | 1 | `xiuquatl` | apiId | `gen2_xiuquatl` |
| `gift_of_dedication` | `Auric_Ingot` | 5 | `gift_of_dedication` | slug | `perfected_envoy` |
| `gift_of_dedication` | `Chak_Egg` | 5 | `gift_of_dedication` | slug | `perfected_envoy` |
| `gift_of_dedication` | `Reclaimed_Metal_Plate` | 5 | `gift_of_dedication` | slug | `perfected_envoy` |
| `gift_of_infused_gems` | `Beryl_Orb` | 250 | `gift_of_infused_gems` | apiId | `endless_summer` |
| `gift_of_prowess` | `Eldritch_Scroll` | 1 | `gift_of_prowess` | slug | `perfected_envoy` |
| `gift_of_prowess` | `Obsidian_Shard` | 50 | `gift_of_prowess` | apiId | `perfected_envoy` |
| `gift_of_recollector_of_memories` | `Gift_of_Bones` | 1 | `gift_of_recollector_of_memories` | apiId | `klobjarne_geirr` |
| `gift_of_the_mursaat_ruins` | `Shard_of_Bava_Nisos` | 100 | `gift_of_the_mursaat_ruins` | apiId | `orrax_manifested` |
| `gift_of_the_mursaat_ruins` | `Shard_of_Mistburned_Barrens` | 100 | `gift_of_the_mursaat_ruins` | apiId | `orrax_manifested` |
| `gift_of_the_mursaat_ruins` | `Vial_of_Titan_Melted_Liquid_Obsidian` | 100 | `gift_of_the_mursaat_ruins` | apiId | `orrax_manifested` |
| `gift_of_the_side_course` | `Mystic_Clovers` | 30 | `gift_of_the_side_course` | singulier (à confirmer) | `orrax_manifested` |
| `pristine_mist_essence` | `Cube_of_Stabilized_Dark_Energy` | 1 | `pristine_mist_essence` | apiId | `ad_infinitum` |

## Enfants déclarés que la recette ne cite pas — 15

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `gift_of_research` | `cube_stabilized_dark_energy` | 1 | `gift_of_research` | direct | `aetheric_anchor`, `eikasia`, `gen3_aurenes_argument` … (+19) |
| `certificate_of_heroics` | `testimony_of_castoran_heroics` | 250 | `certificate_of_heroics` | direct | `conflux`, `triumphant_hero` |
| `essence_of_animosity` | `testimony_of_castoran_heroics` | 500 | `essence_of_animosity` | direct | `conflux`, `warbringer` |
| `mystic_essence_of_strategy` | `bloodstone_dust` | 250 | `mystic_essence_of_strategy` | direct | `conflux`, `warbringer` |
| `gift_of_castoran_mastery` | `gift_of_adventure_voe` | 1 | `gift_of_castoran_mastery` | direct | `selachimorpha` |
| `gift_of_compassion` | `legendary_insight` | 150 | `gift_of_compassion` | direct | `coalescence` |
| `gift_of_prowess` | `legendary_insight` | 25 | `gift_of_prowess` | direct | `perfected_envoy` |
| `gift_of_the_appetizer` | `fruits_of_the_shadow` | 5 | `gift_of_the_appetizer` | direct | `orrax_manifested` |
| `gift_of_the_dessert` | `fruits_of_the_shadow` | 5 | `gift_of_the_dessert` | direct | `orrax_manifested` |
| `gift_of_the_entree` | `fruits_of_the_shadow` | 5 | `gift_of_the_entree` | direct | `orrax_manifested` |
| `gift_of_the_mistburned_isles` | `shard_of_bava_nisos` | 100 | `gift_of_the_mistburned_isles` | direct | `orrax_manifested` |
| `gift_of_the_mistburned_isles` | `shard_of_mistburned_barrens` | 100 | `gift_of_the_mistburned_isles` | direct | `orrax_manifested` |
| `gift_of_the_mistburned_isles` | `vial_of_titan_melted_obsidian` | 150 | `gift_of_the_mistburned_isles` | direct | `orrax_manifested` |
| `gift_of_the_rider` | `trade_contract` | 300 | `gift_of_the_rider` | direct | `coalescence` |
| `gift_of_the_side_course` | `fruits_of_the_shadow` | 5 | `gift_of_the_side_course` | direct | `orrax_manifested` |

## Nœuds ayant une recette et aucun enfant (feuilles assumées) — 53

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `mystic_clover` | `4 ingrédients` |  | `mystic_clover` | feuille assumée | `ad_infinitum`, `aetheric_anchor`, `ardent_glorious` … (+73) |
| `obsidian_shard` | `3 ingrédients` |  | `obsidian_shard` | feuille assumée | `ad_infinitum`, `aetheric_anchor`, `ardent_glorious` … (+58) |
| `large_bone` | `3 ingrédients` |  | `large_bone` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+50) |
| `large_claw` | `3 ingrédients` |  | `large_claw` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+50) |
| `large_scale` | `3 ingrédients` |  | `large_scale` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+50) |
| `vial_of_potent_blood` | `3 ingrédients` |  | `vial_of_potent_blood` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+50) |
| `bone` | `3 ingrédients` |  | `bone` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `claw` | `3 ingrédients` |  | `claw` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `engraved_totem` | `3 ingrédients` |  | `engraved_totem` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `fang` | `3 ingrédients` |  | `fang` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `full_venom_sac` | `3 ingrédients` |  | `full_venom_sac` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `heavy_bone` | `3 ingrédients` |  | `heavy_bone` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `intricate_totem` | `3 ingrédients` |  | `intricate_totem` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `large_fang` | `3 ingrédients` |  | `large_fang` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `potent_venom_sac` | `3 ingrédients` |  | `potent_venom_sac` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `scale` | `3 ingrédients` |  | `scale` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `sharp_claw` | `3 ingrédients` |  | `sharp_claw` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `sharp_fang` | `3 ingrédients` |  | `sharp_fang` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `smooth_scale` | `3 ingrédients` |  | `smooth_scale` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `totem` | `3 ingrédients` |  | `totem` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `venom_sac` | `3 ingrédients` |  | `venom_sac` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `vial_of_blood` | `3 ingrédients` |  | `vial_of_blood` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `vial_of_thick_blood` | `3 ingrédients` |  | `vial_of_thick_blood` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `darksteel_ingot` | `2 ingrédients` |  | `darksteel_ingot` | feuille assumée | `ad_infinitum`, `gen1_bolt`, `gen1_frostfang` … (+26) |
| `orichalcum_ingot` | `1 ingrédients` |  | `orichalcum_ingot` | feuille assumée | `gen1_bolt`, `gen1_frenzy`, `gen1_frostfang` … (+24) |
| `mithril_ingot` | `1 ingrédients` |  | `mithril_ingot` | feuille assumée | `aurora`, `gen1_bolt`, `gen1_frostfang` … (+23) |
| `elder_wood_plank` | `1 ingrédients` |  | `elder_wood_plank` | feuille assumée | `gen1_frenzy`, `gen1_howler`, `gen1_kudzu` … (+19) |
| `bolt_of_gossamer` | `1 ingrédients` |  | `bolt_of_gossamer` | feuille assumée | `gen1_bolt`, `gen1_quip`, `gen1_the_minstrel` … (+18) |
| `hard_wood_plank` | `1 ingrédients` |  | `hard_wood_plank` | feuille assumée | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+18) |
| `seasoned_wood_plank` | `1 ingrédients` |  | `seasoned_wood_plank` | feuille assumée | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+18) |
| `platinum_ingot` | `1 ingrédients` |  | `platinum_ingot` | feuille assumée | `aurora`, `gen1_bolt`, `gen1_frostfang` … (+16) |
| `ancient_wood_pulp` | `1 ingrédients` |  | `ancient_wood_pulp` | feuille assumée | `gen3_aurenes_argument`, `gen3_aurenes_bite`, `gen3_aurenes_breath` … (+13) |
| `ancient_wood_plank` | `1 ingrédients` |  | `ancient_wood_plank` | feuille assumée | `gen1_frenzy`, `gen1_howler`, `gen1_kudzu` … (+11) |
| `steel_ingot` | `2 ingrédients` |  | `steel_ingot` | feuille assumée | `ad_infinitum`, `gen1_the_juggernaut`, `gen3_aurenes_argument` … (+11) |
| `hardened_leather_section` | `3 ingrédients` |  | `hardened_leather_section` | feuille assumée | `gen1_howler`, `gen1_kraitkin`, `gen1_kudzu` … (+5) |
| `charged_lodestone` | `4 ingrédients` |  | `charged_lodestone` | feuille assumée | `endless_summer`, `gen1_bolt`, `gen1_meteorlogicus` … (+1) |
| `destroyer_lodestone` | `4 ingrédients` |  | `destroyer_lodestone` | feuille assumée | `aetheric_anchor`, `gen1_incinerator`, `gen1_rodgort` … (+1) |
| `gift_of_maguuma` | `4 ingrédients` |  | `gift_of_maguuma` | feuille assumée | `gen2_astralaria`, `gen2_chuka_and_champawat`, `gen2_hope` … (+1) |
| `molten_lodestone` | `4 ingrédients` |  | `molten_lodestone` | feuille assumée | `gen1_frenzy`, `gen1_incinerator`, `gen1_rodgort` … (+1) |
| `onyx_lodestone` | `4 ingrédients` |  | `onyx_lodestone` | feuille assumée | `gen1_the_flameseeker_prophecies`, `gen1_the_predator`, `gen1_twilight` … (+1) |
| `corrupted_lodestone` | `4 ingrédients` |  | `corrupted_lodestone` | feuille assumée | `aetheric_anchor`, `gen1_frostfang`, `orrax_manifested` |
| `opal_orb` | `2 ingrédients` |  | `opal_orb` | feuille assumée | `gen1_the_bifrost`, `gen1_the_dreamer`, `gen1_the_minstrel` |
| `crystal_lodestone` | `4 ingrédients` |  | `crystal_lodestone` | feuille assumée | `aetheric_anchor`, `orrax_manifested` |
| `glacial_lodestone` | `4 ingrédients` |  | `glacial_lodestone` | feuille assumée | `gen1_frenzy`, `gen1_frostfang` |
| `ancient_wood_log` | `3 ingrédients` |  | `ancient_wood_log` | feuille assumée | `vision` |
| `ars_goetia` | `4 ingrédients` |  | `ars_goetia` | feuille assumée | `gen2_the_binding_of_ipos` |
| `bolt_of_silk` | `1 ingrédients` |  | `bolt_of_silk` | feuille assumée | `stella_radians` |
| `cured_thick_leather_square` | `1 ingrédients` |  | `cured_thick_leather_square` | feuille assumée | `stella_radians` |
| `gift_of_janthir_wanderlust` | `4 ingrédients` |  | `gift_of_janthir_wanderlust` | feuille assumée | `orrax_manifested` |
| `gift_of_the_astral_ward` | `4 ingrédients` |  | `gift_of_the_astral_ward` | feuille assumée | `obsidian` |
| `gift_of_the_sun` | `4 ingrédients` |  | `gift_of_the_sun` | feuille assumée | `endless_summer` |
| `olmakhan_charm` | `4 ingrédients` |  | `olmakhan_charm` | feuille assumée | `vision` |
| `unbound_wings` | `4 ingrédients` |  | `unbound_wings` | feuille assumée | `ad_infinitum` |

## Ingrédients à créer, et qui les réclame

- `Askur_Camping_Cookout_Backpiece` — réclamé par `orrax_contained`
- `Binding_of_the_Dragon` — réclamé par `orrax_contained`
- `Bolt_of_Damask` — réclamé par `third_order_mist_frame`
- `Bowl_of_Black_Pepper_Cactus_Salad` — réclamé par `gift_of_the_side_course`
- `Bowl_of_Passion_Fruit_Tapioca_Pudding` — réclamé par `gift_of_the_dessert`
- `Bowl_of_Poultry_Satay` — réclamé par `gift_of_the_appetizer`
- `Bowl_of_Prickly_Pear_Sorbet` — réclamé par `gift_of_the_dessert`
- `Call_of_the_Void` — réclamé par `gen2_verdarach`
- `Chaos_Gun` — réclamé par `gen1_quip`
- `Charged_Titan_Ore` — réclamé par `neutralized_titan_alloy`
- `Charm_of_Brilliance` — réclamé par `mystic_aspect`
- `Charm_of_Potence` — réclamé par `mystic_aspect`
- `Charm_of_Skill` — réclamé par `mystic_aspect`
- `Chrysocola_Crystal` — réclamé par `chrysocola_orb`
- `Claw_of_Resolution` — réclamé par `gen2_claw_of_the_khan_ur`
- `Dark_Matter` — réclamé par `mystic_essence_of_annihilation`
- `Dawn` — réclamé par `gen1_sunrise`
- `Dusk` — réclamé par `gen1_twilight`
- `Elonian_Leather_Square` — réclamé par `third_order_mist_frame`
- `Endeavor` — réclamé par `gen2_eureka`
- `Exitare` — réclamé par `gen2_exordium`
- `Friendship` — réclamé par `gen2_shooshadoo`
- `Fruit_of_the_Shadow` — réclamé par `gift_of_the_appetizer`, `gift_of_the_dessert`, `gift_of_the_entree`, `gift_of_the_side_course`
- `Gift_of_Ascalon` — réclamé par `gift_of_darkness`, `gift_of_history`, `gift_of_light`, `gift_of_lightning`
- `Gift_of_Baelfire` — réclamé par `vial_of_liquid_flame`
- `Gift_of_Janthir_Syntri` — réclamé par `gift_of_uncovered_grounds`
- `Gift_of_Knowledge` — réclamé par `gift_of_stealth`, `gift_of_weather`
- `Gift_of_Lowland_Shore` — réclamé par `gift_of_uncovered_grounds`
- `Gift_of_Thorns` — réclamé par `gift_of_nature`, `unicorn_statue`, `wolf_statue`
- `Gift_of_Zhaitan` — réclamé par `gift_of_color`, `shark_statue`
- `Gift_of_the_Forgeman` — réclamé par `eel_statue`, `vial_of_quicksilver`
- `Gift_of_the_Nobleman` — réclamé par `gift_of_entertainment`, `gift_of_music`
- `Gift_of_the_Sanctuary` — réclamé par `gift_of_ice`, `gift_of_water`
- `Gift_of_the_Ursus` — réclamé par `gift_of_uncovered_grounds`
- `Glob_of_Elder_Spirit_Residue` — réclamé par `spiritwood_plank`
- `Gold_Ingot` — réclamé par `xunlai_electrum_ingot`
- `Howl` — réclamé par `gen1_howler`
- `Leaf_of_Kudzu` — réclamé par `gen1_kudzu`
- `Legendary_Insight_(consumable)` — réclamé par `gift_of_compassion`, `gift_of_prowess`
- `Liturgy` — réclamé par `gen2_flames_of_war`
- `Man_o'_War` — réclamé par `gen2_the_hms_divinity`
- `Meaty_Asparagus_Skewer` — réclamé par `gift_of_the_side_course`
- `Memory_of_Bearkin's_Adversaries` — réclamé par `gift_of_sharpened_tip`
- `Memory_of_the_Bearkin's_Hunts` — réclamé par `gift_of_recollector_of_memories`
- `Memory_of_the_Bearkin's_Victories` — réclamé par `gift_of_recollector_of_memories`
- `Might_of_Arah` — réclamé par `gen2_sharur`
- `Orichalcum_Plated_Dowel` — réclamé par `diviners_orichalcum_imbued_inscription`
- `Piles_of_Bloodstone_Dust` — réclamé par `mystic_essence_of_strategy`
- `Plate_of_Orrian_Steak_Frittes` — réclamé par `gift_of_the_entree`
- `Plate_of_Spicy_Herbed_Chicken` — réclamé par `gift_of_the_entree`
- `Plate_of_Truffle_Steak` — réclamé par `gift_of_the_entree`
- `Prototype` — réclamé par `gen2_hope`
- `Rage_(weapon)` — réclamé par `gen1_frenzy`
- `Rare_Essence_of_Luck` — réclamé par `pristine_mist_essence`
- `Red-Lentil_Saobosa` — réclamé par `gift_of_the_appetizer`
- `Refined_Homestead_Fiber` — réclamé par `gift_of_embracing_refuge`
- `Refined_Homestead_Metal` — réclamé par `gift_of_embracing_refuge`
- `Refined_Homestead_Wood` — réclamé par `gift_of_embracing_refuge`
- `Relic` — réclamé par `mystic_facet`
- `Rodgort's_Flame` — réclamé par `gen1_rodgort`
- `Rotted_Titan_Amber` — réclamé par `neutralized_titan_alloy`
- `Salmon_of_Knowledge_Backpiece` — réclamé par `orrax_contained`
- `Save_the_Queen` — réclamé par `gen2_the_shining_blade`
- `Silver_Ingot` — réclamé par `xunlai_electrum_ingot`
- `Soft_Wood_Plank` — réclamé par `spiritwood_plank`
- `Spark_(weapon)` — réclamé par `gen1_incinerator`
- `Spero` — réclamé par `gen2_pharus`
- `Spicy_Marinated_Mushroom` — réclamé par `gift_of_the_appetizer`
- `Spirit_of_the_Jackal` — réclamé par `gift_of_the_rider`
- `Spirit_of_the_Raptor` — réclamé par `gift_of_the_rider`
- `Spirit_of_the_Skimmer` — réclamé par `gift_of_the_rider`
- `Spirit_of_the_Springer` — réclamé par `gift_of_the_rider`
- `Storm` — réclamé par `gen1_meteorlogicus`
- `Superior_Sigil_of_Accuracy` — réclamé par `gift_of_howler`
- `Superior_Sigil_of_Air` — réclamé par `gift_of_bolt`, `gift_of_meteorlogicus`
- `Superior_Sigil_of_Battle` — réclamé par `gift_of_the_flameseeker_prophecies`
- `Superior_Sigil_of_Benevolence` — réclamé par `gift_of_the_juggernaut`
- `Superior_Sigil_of_Blood` — réclamé par `gift_of_twilight`
- `Superior_Sigil_of_Celerity` — réclamé par `gift_of_kudzu`
- `Superior_Sigil_of_Energy` — réclamé par `gift_of_the_minstrel`, `gift_of_the_moot`
- `Superior_Sigil_of_Fire` — réclamé par `gift_of_incinerator`, `gift_of_rodgort`
- `Superior_Sigil_of_Force` — réclamé par `gift_of_the_predator`
- `Superior_Sigil_of_Ice` — réclamé par `gift_of_frostfang`
- `Superior_Sigil_of_Nullification` — réclamé par `gift_of_the_bifrost`
- `Superior_Sigil_of_Purity` — réclamé par `gift_of_the_dreamer`
- `Superior_Sigil_of_Rage` — réclamé par `gift_of_frenzy`
- `Superior_Sigil_of_Stamina` — réclamé par `gift_of_quip`
- `Superior_Sigil_of_Strength` — réclamé par `gift_of_sunrise`
- `Superior_Sigil_of_Venom` — réclamé par `gift_of_kraitkin`
- `Sweet-Treated_Pine_Plank` — réclamé par `gift_of_gatherer_of_the_hunt`
- `Symbol_of_Control` — réclamé par `mystic_mote`
- `Symbol_of_Enhancement` — réclamé par `mystic_mote`
- `Symbol_of_Pain` — réclamé par `mystic_mote`
- `Testimony_of_Jade_Heroics` — réclamé par `certificate_of_heroics`, `essence_of_animosity`
- `The_Bard` — réclamé par `gen1_the_minstrel`
- `The_Chosen` — réclamé par `gen1_the_flameseeker_prophecies`
- `The_Colossus` — réclamé par `gen1_the_juggernaut`
- `The_Energizer` — réclamé par `gen1_the_moot`
- `The_Hunter` — réclamé par `gen1_the_predator`
- `The_Legend` — réclamé par `gen1_the_bifrost`
- `The_Lover` — réclamé par `gen1_the_dreamer`
- `The_Mechanism` — réclamé par `gen2_astralaria`
- `The_Raven_Staff` — réclamé par `gen2_nevermore`
- `Tigris` — réclamé par `gen2_chuka_and_champawat`
- `Tlehco` — réclamé par `gen2_xiuquatl`
- `Tooth_of_Frostfang` — réclamé par `gen1_frostfang`
- `Unidentified_Dye` — réclamé par `banner_of_the_commander`, `gift_of_color`
- `Venom_(weapon)` — réclamé par `gen1_kraitkin`
- `Zap` — réclamé par `gen1_bolt`

