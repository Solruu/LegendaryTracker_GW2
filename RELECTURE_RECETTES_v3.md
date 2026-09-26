# Relecture des recettes, légendaire par légendaire

Source : `gw2_sources_v328.json` — généré par `gw2_relecture_recettes_v3.py`.
L'outil descend depuis chaque légendaire et compare, à chaque nœud, les
enfants déclarés à la recette lue sur sa capture. Appariement par apiId
d'abord (591 composants sur 601 en portent un), par nom en dernier recours,
un appariement au singulier étant signalé comme à confirmer.

Chaque défaut est compté **une fois**, avec la liste des légendaires qui le
rencontrent : un composant est une unité de craft, pas une ligne par cible.

| défaut | ce que ça veut dire | ce que ça coûte | nombre |
|---|---|---|---:|
| MANQUANT | la recette cite un ingrédient absent de l'arbre | le coût n'existe nulle part | 0 |
| NON_RELIÉ | l'ingrédient existe mais aucune arête `qty` ne le rattache | le coût existe et ne remonte pas — le plus sournois | 2 |
| EN_TROP | enfant déclaré hors recette | souvent légitime (voie alternative, coût d'acquisition) | 10 |
| AILLEURS | l'ingrédient est rattaché à un autre nœud du même légendaire | le total est probablement juste, la forme ne suit pas la recette | 13 |
| NON_DÉCOMPOSÉ | recette lue, aucun enfant | décision de modélisation à revoir, pas un bug | 54 |

Écartés sans être comptés : 25 options d'`alt_groups` — un choix, pas un oubli.

## Ingrédients présents dans l'arbre mais non rattachés au parent — 2

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `gen1_eternity` | `Sunrise` | 1 | `eternity` | légendaire | `gen1_eternity` |
| `gen1_eternity` | `Twilight` | 1 | `eternity` | légendaire | `gen1_eternity` |

## Ingrédients rattachés ailleurs sous le même légendaire — 13

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `neutralized_titan_alloy` | `Orichalcum_Ingot` | 5 | `neutralized_titan_alloy` | rattaché à gift_of_metal | `klobjarne_geirr`, `orrax_manifested` |
| `diviners_orichalcum_imbued_inscription` | `Branded_Mass` | 50 | `diviners_orichalcum_imbued_inscription` | rattaché à dragonsblood_weapons, gift_of_ephemeral_magic | `vision` |
| `diviners_orichalcum_imbued_inscription` | `Exquisite_Serpentite_Jewel` | 3 | `diviners_orichalcum_imbued_inscription` | rattaché à dragonsblood_weapons | `vision` |
| `gift_of_dedication` | `Auric_Ingot` | 5 | `gift_of_dedication` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_dedication` | `Chak_Egg` | 5 | `gift_of_dedication` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_dedication` | `Reclaimed_Metal_Plate` | 5 | `gift_of_dedication` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_prowess` | `Eldritch_Scroll` | 1 | `gift_of_prowess` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_prowess` | `Obsidian_Shard` | 50 | `gift_of_prowess` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_recollector_of_memories` | `Gift_of_Bones` | 1 | `gift_of_recollector_of_memories` | rattaché à gift_of_condensed_might | `klobjarne_geirr` |
| `gift_of_the_mursaat_ruins` | `Shard_of_Bava_Nisos` | 100 | `gift_of_the_mursaat_ruins` | rattaché à gift_of_the_mistburned_isles | `orrax_manifested` |
| `gift_of_the_mursaat_ruins` | `Shard_of_Mistburned_Barrens` | 100 | `gift_of_the_mursaat_ruins` | rattaché à gift_of_the_mistburned_isles | `orrax_manifested` |
| `gift_of_the_mursaat_ruins` | `Vial_of_Titan_Melted_Liquid_Obsidian` | 100 | `gift_of_the_mursaat_ruins` | rattaché à gift_of_the_mistburned_isles | `orrax_manifested` |
| `gift_of_the_side_course` | `Mystic_Clovers` | 30 | `gift_of_the_side_course` | rattaché à orrax_manifested | `orrax_manifested` |

## Enfants déclarés que la recette ne cite pas — 10

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `gift_of_research` | `cube_stabilized_dark_energy` | 1 | `gift_of_research` | direct | `aetheric_anchor`, `eikasia`, `gen3_aurenes_argument` … (+19) |
| `certificate_of_heroics` | `testimony_of_castoran_heroics` | 250 | `certificate_of_heroics` | direct | `conflux`, `triumphant_hero` |
| `essence_of_animosity` | `testimony_of_castoran_heroics` | 500 | `essence_of_animosity` | direct | `conflux`, `warbringer` |
| `gift_of_castoran_mastery` | `gift_of_adventure_voe` | 1 | `gift_of_castoran_mastery` | direct | `selachimorpha` |
| `gift_of_compassion` | `legendary_insight` | 150 | `gift_of_compassion` | direct | `coalescence` |
| `gift_of_prowess` | `legendary_insight` | 25 | `gift_of_prowess` | direct | `perfected_envoy` |
| `gift_of_the_mistburned_isles` | `shard_of_bava_nisos` | 100 | `gift_of_the_mistburned_isles` | direct | `orrax_manifested` |
| `gift_of_the_mistburned_isles` | `shard_of_mistburned_barrens` | 100 | `gift_of_the_mistburned_isles` | direct | `orrax_manifested` |
| `gift_of_the_mistburned_isles` | `vial_of_titan_melted_obsidian` | 150 | `gift_of_the_mistburned_isles` | direct | `orrax_manifested` |
| `gift_of_the_rider` | `trade_contract` | 300 | `gift_of_the_rider` | direct | `coalescence` |

## Nœuds ayant une recette et aucun enfant (feuilles assumées) — 54

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
| `mithril_ingot` | `1 ingrédients` |  | `mithril_ingot` | feuille assumée | `ad_infinitum`, `aurora`, `gen1_bolt` … (+35) |
| `darksteel_ingot` | `2 ingrédients` |  | `darksteel_ingot` | feuille assumée | `ad_infinitum`, `gen1_bolt`, `gen1_frostfang` … (+26) |
| `orichalcum_ingot` | `1 ingrédients` |  | `orichalcum_ingot` | feuille assumée | `gen1_bolt`, `gen1_frenzy`, `gen1_frostfang` … (+24) |
| `elder_wood_plank` | `1 ingrédients` |  | `elder_wood_plank` | feuille assumée | `gen1_frenzy`, `gen1_howler`, `gen1_kudzu` … (+19) |
| `bolt_of_gossamer` | `1 ingrédients` |  | `bolt_of_gossamer` | feuille assumée | `gen1_bolt`, `gen1_quip`, `gen1_the_minstrel` … (+18) |
| `hard_wood_plank` | `1 ingrédients` |  | `hard_wood_plank` | feuille assumée | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+18) |
| `seasoned_wood_plank` | `1 ingrédients` |  | `seasoned_wood_plank` | feuille assumée | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+18) |
| `platinum_ingot` | `1 ingrédients` |  | `platinum_ingot` | feuille assumée | `aurora`, `gen1_bolt`, `gen1_frostfang` … (+16) |
| `ancient_wood_pulp` | `1 ingrédients` |  | `ancient_wood_pulp` | feuille assumée | `gen3_aurenes_argument`, `gen3_aurenes_bite`, `gen3_aurenes_breath` … (+13) |
| `ancient_wood_plank` | `1 ingrédients` |  | `ancient_wood_plank` | feuille assumée | `gen1_frenzy`, `gen1_howler`, `gen1_kudzu` … (+11) |
| `steel_ingot` | `2 ingrédients` |  | `steel_ingot` | feuille assumée | `ad_infinitum`, `gen1_the_juggernaut`, `gen3_aurenes_argument` … (+11) |
| `iron_ingot` | `1 ingrédients` |  | `iron_ingot` | feuille assumée | `ad_infinitum`, `gen3_aurenes_argument`, `gen3_aurenes_bite` … (+10) |
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

