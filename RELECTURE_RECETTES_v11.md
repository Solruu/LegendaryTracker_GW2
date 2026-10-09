# Relecture des recettes, légendaire par légendaire

Source : `gw2_sources_v391.json` — généré par `gw2_relecture_recettes_v6.py`.
L'outil descend depuis chaque légendaire et compare, à chaque nœud, les
enfants déclarés à la recette lue sur sa capture. Appariement par apiId
d'abord (591 composants sur 601 en portent un), par nom en dernier recours,
un appariement au singulier étant signalé comme à confirmer.

Chaque défaut est compté **une fois**, avec la liste des légendaires qui le
rencontrent : un composant est une unité de craft, pas une ligne par cible.

| défaut | ce que ça veut dire | ce que ça coûte | nombre |
|---|---|---|---:|
| MANQUANT | la recette cite un ingrédient absent de l'arbre | le coût n'existe nulle part | 2 |
| NON_RELIÉ | l'ingrédient existe mais aucune arête `qty` ne le rattache | le coût existe et ne remonte pas — le plus sournois | 2 |
| EN_TROP | enfant déclaré hors recette | souvent légitime (voie alternative, coût d'acquisition) | 5 |
| AILLEURS | l'ingrédient est rattaché à un autre nœud du même légendaire | le total est probablement juste, la forme ne suit pas la recette | 5 |
| PALIER SUIVANT | la recette d'une feuille cite un ingrédient absent | le palier d'en dessous, à créer si on veut descendre | 224 |
| NON_DÉCOMPOSÉ | recette lue, aucun enfant | décision de modélisation à revoir, pas un bug | 111 |

Écartés sans être comptés : 25 options d'`alt_groups` — un choix, pas un oubli.

## Ingrédients qu'aucun composant ne représente — 2

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `certificate_of_heroics` | `Testimony_of_Jade_Heroics` | 250 | `certificate_of_heroics` | — | `conflux`, `triumphant_hero` |
| `essence_of_animosity` | `Testimony_of_Jade_Heroics` | 500 | `essence_of_animosity` | — | `conflux`, `warbringer` |

## Ingrédients présents dans l'arbre mais non rattachés au parent — 2

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `gen1_eternity` | `Sunrise` | 1 | `eternity` | légendaire | `gen1_eternity` |
| `gen1_eternity` | `Twilight` | 1 | `eternity` | légendaire | `gen1_eternity` |

## Ingrédients rattachés ailleurs sous le même légendaire — 5

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `gift_of_dedication` | `Auric_Ingot` | 5 | `gift_of_dedication` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_dedication` | `Chak_Egg` | 5 | `gift_of_dedication` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_dedication` | `Reclaimed_Metal_Plate` | 5 | `gift_of_dedication` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_prowess` | `Eldritch_Scroll` | 1 | `gift_of_prowess` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |
| `gift_of_prowess` | `Obsidian_Shard` | 50 | `gift_of_prowess` | rattaché à perfected_envoy__per_piece | `perfected_envoy` |

## Enfants déclarés que la recette ne cite pas — 5

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `certificate_of_heroics` | `testimony_of_castoran_heroics` | 250 | `certificate_of_heroics` | direct | `conflux`, `triumphant_hero` |
| `essence_of_animosity` | `testimony_of_castoran_heroics` | 500 | `essence_of_animosity` | direct | `conflux`, `warbringer` |
| `banner_pennon` | `recipe_banner_pennon` | 1 | `banner_pennon` | direct | `vision` |
| `gift_of_compassion` | `legendary_insight` | 150 | `gift_of_compassion` | direct | `coalescence` |
| `gift_of_prowess` | `legendary_insight` | 25 | `gift_of_prowess` | direct | `perfected_envoy` |

## Ingrédients absents, cités par la recette d'une feuille — 224

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `obsidian_shard` | `Mini_Risen_Priest_of_Balthazar` |  | `obsidian_shard` | sous une feuille | `ad_infinitum`, `ardent_glorious`, `aurora` … (+50) |
| `bone` | `Bone_Shard` |  | `bone` | sous une feuille | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `claw` | `Small_Claw` |  | `claw` | sous une feuille | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `fang` | `Small_Fang` |  | `fang` | sous une feuille | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `scale` | `Small_Scale` |  | `scale` | sous une feuille | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `totem` | `Small_Totem` |  | `totem` | sous une feuille | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `venom_sac` | `Small_Venom_Sac` |  | `venom_sac` | sous une feuille | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `vial_of_blood` | `Vial_of_Thin_Blood` |  | `vial_of_blood` | sous une feuille | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+49) |
| `mithril_ingot` | `Mithril_Ore` |  | `mithril_ingot` | sous une feuille | `ad_infinitum`, `gen1_bolt`, `gen1_frostfang` … (+34) |
| `orichalcum_ingot` | `Orichalcum_Ore` |  | `orichalcum_ingot` | sous une feuille | `endless_summer`, `gen1_bolt`, `gen1_frenzy` … (+31) |
| `darksteel_ingot` | `Lump_of_Primordium` |  | `darksteel_ingot` | sous une feuille | `ad_infinitum`, `gen1_bolt`, `gen1_frostfang` … (+29) |
| `darksteel_ingot` | `Platinum_Ore` |  | `darksteel_ingot` | sous une feuille | `ad_infinitum`, `gen1_bolt`, `gen1_frostfang` … (+29) |
| `elder_wood_plank` | `Elder_Wood_Log` |  | `elder_wood_plank` | sous une feuille | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+27) |
| `hard_wood_plank` | `Hard_Wood_Log` |  | `hard_wood_plank` | sous une feuille | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+22) |
| `seasoned_wood_plank` | `Seasoned_Wood_Log` |  | `seasoned_wood_plank` | sous une feuille | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+22) |
| `steel_ingot` | `Iron_Ore` |  | `steel_ingot` | sous une feuille | `ad_infinitum`, `gen1_the_juggernaut`, `gen2_claw_of_the_khan_ur` … (+20) |
| `steel_ingot` | `Lump_of_Coal` |  | `steel_ingot` | sous une feuille | `ad_infinitum`, `gen1_the_juggernaut`, `gen2_claw_of_the_khan_ur` … (+20) |
| `bolt_of_gossamer` | `Gossamer_Scrap` |  | `bolt_of_gossamer` | sous une feuille | `gen1_bolt`, `gen1_quip`, `gen1_the_flameseeker_prophecies` … (+19) |
| `iron_ingot` | `Iron_Ore` |  | `iron_ingot` | sous une feuille | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+19) |
| `platinum_ingot` | `Platinum_Ore` |  | `platinum_ingot` | sous une feuille | `gen1_bolt`, `gen1_frostfang`, `gen1_incinerator` … (+15) |
| `soft_wood_plank` | `Soft_Wood_Log` |  | `soft_wood_plank` | sous une feuille | `ad_infinitum`, `gen2_eureka`, `gen2_flames_of_war` … (+13) |
| `cured_thick_leather_square` | `Thick_Leather_Section` |  | `cured_thick_leather_square` | sous une feuille | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+11) |
| `cured_coarse_leather_square` | `Coarse_Leather_Section` |  | `cured_coarse_leather_square` | sous une feuille | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+10) |
| `cured_rugged_leather_square` | `Rugged_Leather_Section` |  | `cured_rugged_leather_square` | sous une feuille | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+10) |
| `cured_thin_leather_square` | `Thin_Leather_Section` |  | `cured_thin_leather_square` | sous une feuille | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+10) |
| `hardened_leather_section` | `Thick_Leather_Section` |  | `hardened_leather_section` | sous une feuille | `endless_summer`, `gen1_howler`, `gen1_kraitkin` … (+6) |
| `onyx_lodestone` | `Onyx_Core` |  | `onyx_lodestone` | sous une feuille | `gen1_sunrise`, `gen1_the_flameseeker_prophecies`, `gen1_the_predator` … (+2) |
| `charged_lodestone` | `Charged_Core` |  | `charged_lodestone` | sous une feuille | `endless_summer`, `gen1_bolt`, `gen1_meteorlogicus` … (+1) |
| `destroyer_lodestone` | `Destroyer_Core` |  | `destroyer_lodestone` | sous une feuille | `aetheric_anchor`, `gen1_incinerator`, `gen1_rodgort` … (+1) |
| `gift_of_maguuma` | `Gift_of_Tarir` |  | `gift_of_maguuma` | sous une feuille | `gen2_astralaria`, `gen2_chuka_and_champawat`, `gen2_hope` … (+1) |
| `gift_of_maguuma` | `Gift_of_the_Chak` |  | `gift_of_maguuma` | sous une feuille | `gen2_astralaria`, `gen2_chuka_and_champawat`, `gen2_hope` … (+1) |
| `gift_of_maguuma` | `Gift_of_the_Fleet` |  | `gift_of_maguuma` | sous une feuille | `gen2_astralaria`, `gen2_chuka_and_champawat`, `gen2_hope` … (+1) |
| `gift_of_maguuma` | `Gift_of_the_Jungle` |  | `gift_of_maguuma` | sous une feuille | `gen2_astralaria`, `gen2_chuka_and_champawat`, `gen2_hope` … (+1) |
| `molten_lodestone` | `Molten_Core` |  | `molten_lodestone` | sous une feuille | `gen1_frenzy`, `gen1_incinerator`, `gen1_rodgort` … (+1) |
| `corrupted_lodestone` | `Corrupted_Core` |  | `corrupted_lodestone` | sous une feuille | `aetheric_anchor`, `gen1_frostfang`, `orrax_manifested` |
| `crystal_lodestone` | `Crystal_Core` |  | `crystal_lodestone` | sous une feuille | `aetheric_anchor`, `gen1_the_juggernaut`, `orrax_manifested` |
| `opal_crystal` | `Opal_Shard` |  | `opal_crystal` | sous une feuille | `gen1_the_bifrost`, `gen1_the_dreamer`, `gen1_the_minstrel` |
| `peridot_lump` | `Peridot_Nugget` |  | `peridot_lump` | sous une feuille | `gen1_bolt`, `gen1_kraitkin`, `gen1_meteorlogicus` |
| `peridot_lump` | `Pile_of_Shimmering_Dust` |  | `peridot_lump` | sous une feuille | `gen1_bolt`, `gen1_kraitkin`, `gen1_meteorlogicus` |
| `bolt_of_silk` | `Silk_Scrap` |  | `bolt_of_silk` | sous une feuille | `ad_infinitum`, `stella_radians` |
| `carnelian_lump` | `Carnelian_Nugget` |  | `carnelian_lump` | sous une feuille | `gen1_incinerator`, `gen1_rodgort` |
| `carnelian_lump` | `Pile_of_Shimmering_Dust` |  | `carnelian_lump` | sous une feuille | `gen1_incinerator`, `gen1_rodgort` |
| `glacial_lodestone` | `Glacial_Core` |  | `glacial_lodestone` | sous une feuille | `gen1_frenzy`, `gen1_frostfang` |
| `lapis_lump` | `Lapis_Nugget` |  | `lapis_lump` | sous une feuille | `gen1_bolt`, `gen1_meteorlogicus` |
| `lapis_lump` | `Pile_of_Shimmering_Dust` |  | `lapis_lump` | sous une feuille | `gen1_bolt`, `gen1_meteorlogicus` |
| `amethyst_lump` | `Amethyst_Nugget` |  | `amethyst_lump` | sous une feuille | `gen1_the_dreamer` |
| `amethyst_lump` | `Pile_of_Shimmering_Dust` |  | `amethyst_lump` | sous une feuille | `gen1_the_dreamer` |
| `ancient_wood_log` | `Elder_Wood_Log` |  | `ancient_wood_log` | sous une feuille | `vision` |
| `bolt_of_cotton` | `Cotton_Scrap` |  | `bolt_of_cotton` | sous une feuille | `ad_infinitum` |
| `bolt_of_linen` | `Linen_Scrap` |  | `bolt_of_linen` | sous une feuille | `ad_infinitum` |
| `bolt_of_wool` | `Wool_Scrap` |  | `bolt_of_wool` | sous une feuille | `ad_infinitum` |
| `carcharias` | `Essence_of_Diving` |  | `carcharias` | sous une feuille | `gen1_kamohoalii_kotaki` |
| `carcharias` | `Serrated_Harpoon` |  | `carcharias` | sous une feuille | `gen1_kamohoalii_kotaki` |
| `carcharias` | `Shark_Figurine` |  | `carcharias` | sous une feuille | `gen1_kamohoalii_kotaki` |
| `carcharias` | `Spirit_of_the_Perfected_Spear` |  | `carcharias` | sous une feuille | `gen1_kamohoalii_kotaki` |
| `chaos_gun` | `Confetti_Bullets` |  | `chaos_gun` | sous une feuille | `gen1_quip` |
| `chaos_gun` | `Essence_of_Mischief` |  | `chaos_gun` | sous une feuille | `gen1_quip` |
| `chaos_gun` | `Ornate_Pistol_Frame` |  | `chaos_gun` | sous une feuille | `gen1_quip` |
| `chaos_gun` | `Spirit_of_the_Perfected_Pistol` |  | `chaos_gun` | sous une feuille | `gen1_quip` |
| `charged_fossil` | `Charged_Quartz_Crystal` |  | `charged_fossil` | sous une feuille | `gen1_howler` |
| `charged_fossil` | `Leaf_Fossil` |  | `charged_fossil` | sous une feuille | `gen1_howler` |
| `charged_thorn` | `Barbed_Thorn` |  | `charged_thorn` | sous une feuille | `gen1_twilight` |
| `charged_thorn` | `Charged_Quartz_Crystal` |  | `charged_thorn` | sous une feuille | `gen1_twilight` |
| `dawn` | `Dimensional_Destabilizer` |  | `dawn` | sous une feuille | `gen1_sunrise` |
| `dawn` | `Essence_of_Illumination` |  | `dawn` | sous une feuille | `gen1_sunrise` |
| `dawn` | `Mirror_(item)` |  | `dawn` | sous une feuille | `gen1_sunrise` |
| `dawn` | `Spirit_of_the_Perfected_Daysword` |  | `dawn` | sous une feuille | `gen1_sunrise` |
| `dragons_argument` | `Fortified_Precursor_Pistol_Barrel` |  | `dragons_argument` | sous une feuille | `gen3_aurenes_argument` |
| `dragons_argument` | `Fortified_Precursor_Pistol_Frame` |  | `dragons_argument` | sous une feuille | `gen3_aurenes_argument` |
| `dragons_argument` | `Memory_of_Aurene` |  | `dragons_argument` | sous une feuille | `gen3_aurenes_argument` |
| `dragons_argument` | `Transcendent_Crystal` |  | `dragons_argument` | sous une feuille | `gen3_aurenes_argument` |
| `dragons_bite` | `Fortified_Precursor_Greatsword_Blade` |  | `dragons_bite` | sous une feuille | `gen3_aurenes_bite` |
| `dragons_bite` | `Fortified_Precursor_Greatsword_Hilt` |  | `dragons_bite` | sous une feuille | `gen3_aurenes_bite` |
| `dragons_bite` | `Memory_of_Aurene` |  | `dragons_bite` | sous une feuille | `gen3_aurenes_bite` |
| `dragons_bite` | `Transcendent_Crystal` |  | `dragons_bite` | sous une feuille | `gen3_aurenes_bite` |
| `dragons_breath` | `Fortified_Precursor_Torch_Handle` |  | `dragons_breath` | sous une feuille | `gen3_aurenes_breath` |
| `dragons_breath` | `Fortified_Precursor_Torch_Head` |  | `dragons_breath` | sous une feuille | `gen3_aurenes_breath` |
| `dragons_breath` | `Memory_of_Aurene` |  | `dragons_breath` | sous une feuille | `gen3_aurenes_breath` |
| `dragons_breath` | `Transcendent_Crystal` |  | `dragons_breath` | sous une feuille | `gen3_aurenes_breath` |
| `dragons_claw_weapon` | `Fortified_Precursor_Dagger_Blade` |  | `dragons_claw_weapon` | sous une feuille | `gen3_aurenes_claw` |
| `dragons_claw_weapon` | `Fortified_Precursor_Dagger_Hilt` |  | `dragons_claw_weapon` | sous une feuille | `gen3_aurenes_claw` |
| `dragons_claw_weapon` | `Memory_of_Aurene` |  | `dragons_claw_weapon` | sous une feuille | `gen3_aurenes_claw` |
| `dragons_claw_weapon` | `Transcendent_Crystal` |  | `dragons_claw_weapon` | sous une feuille | `gen3_aurenes_claw` |
| `dragons_fang` | `Fortified_Precursor_Sword_Blade` |  | `dragons_fang` | sous une feuille | `gen3_aurenes_fang` |
| `dragons_fang` | `Fortified_Precursor_Sword_Hilt` |  | `dragons_fang` | sous une feuille | `gen3_aurenes_fang` |
| `dragons_fang` | `Memory_of_Aurene` |  | `dragons_fang` | sous une feuille | `gen3_aurenes_fang` |
| `dragons_fang` | `Transcendent_Crystal` |  | `dragons_fang` | sous une feuille | `gen3_aurenes_fang` |
| `dragons_flight` | `Fortified_Precursor_Longbow_Stave` |  | `dragons_flight` | sous une feuille | `gen3_aurenes_flight` |
| `dragons_flight` | `Fortified_Precursor_String` |  | `dragons_flight` | sous une feuille | `gen3_aurenes_flight` |
| `dragons_flight` | `Memory_of_Aurene` |  | `dragons_flight` | sous une feuille | `gen3_aurenes_flight` |
| `dragons_flight` | `Transcendent_Crystal` |  | `dragons_flight` | sous une feuille | `gen3_aurenes_flight` |
| `dragons_gaze` | `Fortified_Precursor_Focus_Casing` |  | `dragons_gaze` | sous une feuille | `gen3_aurenes_gaze` |
| `dragons_gaze` | `Fortified_Precursor_Focus_Core` |  | `dragons_gaze` | sous une feuille | `gen3_aurenes_gaze` |
| `dragons_gaze` | `Memory_of_Aurene` |  | `dragons_gaze` | sous une feuille | `gen3_aurenes_gaze` |
| `dragons_gaze` | `Transcendent_Crystal` |  | `dragons_gaze` | sous une feuille | `gen3_aurenes_gaze` |
| `dragons_insight` | `Fortified_Precursor_Staff_Head` |  | `dragons_insight` | sous une feuille | `gen3_aurenes_insight` |
| `dragons_insight` | `Fortified_Precursor_Staff_Shaft` |  | `dragons_insight` | sous une feuille | `gen3_aurenes_insight` |
| `dragons_insight` | `Memory_of_Aurene` |  | `dragons_insight` | sous une feuille | `gen3_aurenes_insight` |
| `dragons_insight` | `Transcendent_Crystal` |  | `dragons_insight` | sous une feuille | `gen3_aurenes_insight` |
| `dragons_persuasion` | `Fortified_Precursor_Rifle_Barrel` |  | `dragons_persuasion` | sous une feuille | `gen3_aurenes_persuasion` |
| `dragons_persuasion` | `Fortified_Precursor_Rifle_Stock` |  | `dragons_persuasion` | sous une feuille | `gen3_aurenes_persuasion` |
| `dragons_persuasion` | `Memory_of_Aurene` |  | `dragons_persuasion` | sous une feuille | `gen3_aurenes_persuasion` |
| `dragons_persuasion` | `Transcendent_Crystal` |  | `dragons_persuasion` | sous une feuille | `gen3_aurenes_persuasion` |
| `dragons_rending` | `Fortified_Precursor_Axe_Head` |  | `dragons_rending` | sous une feuille | `gen3_aurenes_rending` |
| `dragons_rending` | `Memory_of_Aurene` |  | `dragons_rending` | sous une feuille | `gen3_aurenes_rending` |
| `dragons_rending` | `Small_Fortified_Precursor_Haft` |  | `dragons_rending` | sous une feuille | `gen3_aurenes_rending` |
| `dragons_rending` | `Transcendent_Crystal` |  | `dragons_rending` | sous une feuille | `gen3_aurenes_rending` |
| `dragons_scale` | `Fortified_Precursor_Shield_Backing` |  | `dragons_scale` | sous une feuille | `gen3_aurenes_scale` |
| `dragons_scale` | `Fortified_Precursor_Shield_Boss` |  | `dragons_scale` | sous une feuille | `gen3_aurenes_scale` |
| `dragons_scale` | `Memory_of_Aurene` |  | `dragons_scale` | sous une feuille | `gen3_aurenes_scale` |
| `dragons_scale` | `Transcendent_Crystal` |  | `dragons_scale` | sous une feuille | `gen3_aurenes_scale` |
| `dragons_tail` | `Fortified_Precursor_Mace_Head` |  | `dragons_tail` | sous une feuille | `gen3_aurenes_tail` |
| `dragons_tail` | `Memory_of_Aurene` |  | `dragons_tail` | sous une feuille | `gen3_aurenes_tail` |
| `dragons_tail` | `Small_Fortified_Precursor_Haft` |  | `dragons_tail` | sous une feuille | `gen3_aurenes_tail` |
| `dragons_tail` | `Transcendent_Crystal` |  | `dragons_tail` | sous une feuille | `gen3_aurenes_tail` |
| `dragons_voice` | `Fortified_Precursor_Horn` |  | `dragons_voice` | sous une feuille | `gen3_aurenes_voice` |
| `dragons_voice` | `Fortified_Precursor_Warhorn_Mouthpiece` |  | `dragons_voice` | sous une feuille | `gen3_aurenes_voice` |
| `dragons_voice` | `Memory_of_Aurene` |  | `dragons_voice` | sous une feuille | `gen3_aurenes_voice` |
| `dragons_voice` | `Transcendent_Crystal` |  | `dragons_voice` | sous une feuille | `gen3_aurenes_voice` |
| `dragons_weight` | `Fortified_Precursor_Hammer_Head` |  | `dragons_weight` | sous une feuille | `gen3_aurenes_weight` |
| `dragons_weight` | `Large_Fortified_Precursor_Haft` |  | `dragons_weight` | sous une feuille | `gen3_aurenes_weight` |
| `dragons_weight` | `Memory_of_Aurene` |  | `dragons_weight` | sous une feuille | `gen3_aurenes_weight` |
| `dragons_weight` | `Transcendent_Crystal` |  | `dragons_weight` | sous une feuille | `gen3_aurenes_weight` |
| `dragons_wing` | `Fortified_Precursor_Short_Bow_Stave` |  | `dragons_wing` | sous une feuille | `gen3_aurenes_wing` |
| `dragons_wing` | `Fortified_Precursor_String` |  | `dragons_wing` | sous une feuille | `gen3_aurenes_wing` |
| `dragons_wing` | `Memory_of_Aurene` |  | `dragons_wing` | sous une feuille | `gen3_aurenes_wing` |
| `dragons_wing` | `Transcendent_Crystal` |  | `dragons_wing` | sous une feuille | `gen3_aurenes_wing` |
| `dragons_wisdom` | `Fortified_Precursor_Scepter_Core` |  | `dragons_wisdom` | sous une feuille | `gen3_aurenes_wisdom` |
| `dragons_wisdom` | `Fortified_Precursor_Scepter_Rod` |  | `dragons_wisdom` | sous une feuille | `gen3_aurenes_wisdom` |
| `dragons_wisdom` | `Memory_of_Aurene` |  | `dragons_wisdom` | sous une feuille | `gen3_aurenes_wisdom` |
| `dragons_wisdom` | `Transcendent_Crystal` |  | `dragons_wisdom` | sous une feuille | `gen3_aurenes_wisdom` |
| `dusk` | `Dimensional_Destabilizer` |  | `dusk` | sous une feuille | `gen1_twilight` |
| `dusk` | `Essence_of_Gloom` |  | `dusk` | sous une feuille | `gen1_twilight` |
| `dusk` | `Mirror_(item)` |  | `dusk` | sous une feuille | `gen1_twilight` |
| `dusk` | `Spirit_of_the_Perfected_Nightsword` |  | `dusk` | sous une feuille | `gen1_twilight` |
| `gift_of_the_astral_ward` | `Gift_of_Amnytas` |  | `gift_of_the_astral_ward` | sous une feuille | `obsidian` |
| `gift_of_the_astral_ward` | `Gift_of_Inner_Nayos` |  | `gift_of_the_astral_ward` | sous une feuille | `obsidian` |
| `gift_of_the_astral_ward` | `Gift_of_Persistence` |  | `gift_of_the_astral_ward` | sous une feuille | `obsidian` |
| `gift_of_the_astral_ward` | `Gift_of_Skywatch_Archipelago` |  | `gift_of_the_astral_ward` | sous une feuille | `obsidian` |
| `glacial_shard` | `Glacial_Fragment` |  | `glacial_shard` | sous une feuille | `orrax_manifested` |
| `gold_ingot` | `Gold_Ore` |  | `gold_ingot` | sous une feuille | `vision` |
| `howl` | `Essence_of_Spirit` |  | `howl` | sous une feuille | `gen1_howler` |
| `howl` | `Mithril_Snake` |  | `howl` | sous une feuille | `gen1_howler` |
| `howl` | `Spirit_of_the_Perfected_Warhorn` |  | `howl` | sous une feuille | `gen1_howler` |
| `howl` | `Wolf_Statue_(exotic)` |  | `howl` | sous une feuille | `gen1_howler` |
| `leaf_of_kudzu` | `Essence_of_the_Garden` |  | `leaf_of_kudzu` | sous une feuille | `gen1_kudzu` |
| `leaf_of_kudzu` | `Lattice_(component)` |  | `leaf_of_kudzu` | sous une feuille | `gen1_kudzu` |
| `leaf_of_kudzu` | `Pruning_Shears` |  | `leaf_of_kudzu` | sous une feuille | `gen1_kudzu` |
| `leaf_of_kudzu` | `Spirit_of_the_Perfected_Longbow` |  | `leaf_of_kudzu` | sous une feuille | `gen1_kudzu` |
| `pile_of_foul_essence` | `Pile_of_Soiled_Essence` |  | `pile_of_foul_essence` | sous une feuille | `gen1_kudzu` |
| `prototype` | `Advanced_Ammunition_Cylinder` |  | `prototype` | sous une feuille | `gen2_hope` |
| `prototype` | `Essence_of_Anomaly` |  | `prototype` | sous une feuille | `gen2_hope` |
| `prototype` | `Finely_Tuned_Firing_Pin` |  | `prototype` | sous une feuille | `gen2_hope` |
| `prototype` | `Spirit_of_Development` |  | `prototype` | sous une feuille | `gen2_hope` |
| `rage_weapon` | `Aerator` |  | `rage_weapon` | sous une feuille | `gen1_frenzy` |
| `rage_weapon` | `Essence_of_Quaggan_Friendship` |  | `rage_weapon` | sous une feuille | `gen1_frenzy` |
| `rage_weapon` | `Fish_Figurine` |  | `rage_weapon` | sous une feuille | `gen1_frenzy` |
| `rage_weapon` | `Spirit_of_the_Perfected_Harpoon_Gun` |  | `rage_weapon` | sous une feuille | `gen1_frenzy` |
| `rare_essence_of_luck` | `Masterwork_Essence_of_Luck` |  | `rare_essence_of_luck` | sous une feuille | `ad_infinitum` |
| `rodgorts_flame` | `Dragon_Statue` |  | `rodgorts_flame` | sous une feuille | `gen1_rodgort` |
| `rodgorts_flame` | `Essence_of_Burning` |  | `rodgorts_flame` | sous une feuille | `gen1_rodgort` |
| `rodgorts_flame` | `Everburning_Flame` |  | `rodgorts_flame` | sous une feuille | `gen1_rodgort` |
| `rodgorts_flame` | `Spirit_of_the_Perfected_Torch` |  | `rodgorts_flame` | sous une feuille | `gen1_rodgort` |
| `silver_ingot` | `Silver_Ore` |  | `silver_ingot` | sous une feuille | `vision` |
| `spark_weapon` | `Essence_of_Chemistry` |  | `spark_weapon` | sous une feuille | `gen1_incinerator` |
| `spark_weapon` | `Fuel_Cannister` |  | `spark_weapon` | sous une feuille | `gen1_incinerator` |
| `spark_weapon` | `Regulator_Nozzle` |  | `spark_weapon` | sous une feuille | `gen1_incinerator` |
| `spark_weapon` | `Spirit_of_the_Perfected_Dagger` |  | `spark_weapon` | sous une feuille | `gen1_incinerator` |
| `storm` | `Essence_of_Control` |  | `storm` | sous une feuille | `gen1_meteorlogicus` |
| `storm` | `Globe` |  | `storm` | sous une feuille | `gen1_meteorlogicus` |
| `storm` | `Spinning_Mechanism` |  | `storm` | sous une feuille | `gen1_meteorlogicus` |
| `storm` | `Spirit_of_the_Perfected_Scepter` |  | `storm` | sous une feuille | `gen1_meteorlogicus` |
| `the_bard` | `Essence_of_Performance` |  | `the_bard` | sous une feuille | `gen1_the_minstrel` |
| `the_bard` | `Harp` |  | `the_bard` | sous une feuille | `gen1_the_minstrel` |
| `the_bard` | `Rooster_Statues` |  | `the_bard` | sous une feuille | `gen1_the_minstrel` |
| `the_bard` | `Spirit_of_the_Perfected_Focus` |  | `the_bard` | sous une feuille | `gen1_the_minstrel` |
| `the_chosen` | `Essence_of_Heroes` |  | `the_chosen` | sous une feuille | `gen1_the_flameseeker_prophecies` |
| `the_chosen` | `Shield_of_Legend` |  | `the_chosen` | sous une feuille | `gen1_the_flameseeker_prophecies` |
| `the_chosen` | `Spirit_of_the_Perfected_Shield` |  | `the_chosen` | sous une feuille | `gen1_the_flameseeker_prophecies` |
| `the_chosen` | `Tome_of_Heroes` |  | `the_chosen` | sous une feuille | `gen1_the_flameseeker_prophecies` |
| `the_colossus` | `Colossus_Statue` |  | `the_colossus` | sous une feuille | `gen1_the_juggernaut` |
| `the_colossus` | `Essence_of_the_Ooze` |  | `the_colossus` | sous une feuille | `gen1_the_juggernaut` |
| `the_colossus` | `Ooze_Reservoir` |  | `the_colossus` | sous une feuille | `gen1_the_juggernaut` |
| `the_colossus` | `Spirit_of_the_Perfected_Hammer` |  | `the_colossus` | sous une feuille | `gen1_the_juggernaut` |
| `the_energizer` | `Essence_of_the_Celebration` |  | `the_energizer` | sous une feuille | `gen1_the_moot` |
| `the_energizer` | `Party_Ball` |  | `the_energizer` | sous une feuille | `gen1_the_moot` |
| `the_energizer` | `Party_Stick` |  | `the_energizer` | sous une feuille | `gen1_the_moot` |
| `the_energizer` | `Spirit_of_the_Perfected_Mace` |  | `the_energizer` | sous une feuille | `gen1_the_moot` |
| `the_hunter` | `Essence_of_Bounty_Hunting` |  | `the_hunter` | sous une feuille | `gen1_the_predator` |
| `the_hunter` | `Living_Flame` |  | `the_hunter` | sous une feuille | `gen1_the_predator` |
| `the_hunter` | `Scope` |  | `the_hunter` | sous une feuille | `gen1_the_predator` |
| `the_hunter` | `Spirit_of_the_Perfected_Rifle` |  | `the_hunter` | sous une feuille | `gen1_the_predator` |
| `the_legend` | `Carved_Beam` |  | `the_legend` | sous une feuille | `gen1_the_bifrost` |
| `the_legend` | `Carved_Tear_Drop` |  | `the_legend` | sous une feuille | `gen1_the_bifrost` |
| `the_legend` | `Essence_of_Rainbows` |  | `the_legend` | sous une feuille | `gen1_the_bifrost` |
| `the_legend` | `Spirit_of_the_Perfected_Staff` |  | `the_legend` | sous une feuille | `gen1_the_bifrost` |
| `the_lover` | `Bow_Wings` |  | `the_lover` | sous une feuille | `gen1_the_dreamer` |
| `the_lover` | `Essence_of_Dreams` |  | `the_lover` | sous une feuille | `gen1_the_dreamer` |
| `the_lover` | `Horse_Figure` |  | `the_lover` | sous une feuille | `gen1_the_dreamer` |
| `the_lover` | `Spirit_of_the_Perfected_Short_Bow` |  | `the_lover` | sous une feuille | `gen1_the_dreamer` |
| `the_mechanism` | `Balanced_Counterweight` |  | `the_mechanism` | sous une feuille | `gen2_astralaria` |
| `the_mechanism` | `Engraver's_Tools` |  | `the_mechanism` | sous une feuille | `gen2_astralaria` |
| `the_mechanism` | `Essence_of_Time_and_Space` |  | `the_mechanism` | sous une feuille | `gen2_astralaria` |
| `the_mechanism` | `Spirit_of_The_Apparatus` |  | `the_mechanism` | sous une feuille | `gen2_astralaria` |
| `the_raven_staff` | `Essence_of_the_Wild_Spirit` |  | `the_raven_staff` | sous une feuille | `gen2_nevermore` |
| `the_raven_staff` | `Raven_Statue_(Legendary_Component)` |  | `the_raven_staff` | sous une feuille | `gen2_nevermore` |
| `the_raven_staff` | `Rune_Carving_Tools` |  | `the_raven_staff` | sous une feuille | `gen2_nevermore` |
| `the_raven_staff` | `Spirit_of_the_Ravenswood_Staff` |  | `the_raven_staff` | sous une feuille | `gen2_nevermore` |
| `tigris` | `Spirit_of_the_Ambush` |  | `tigris` | sous une feuille | `gen2_chuka_and_champawat` |
| `tigris` | `Spirit_of_the_Tiger` |  | `tigris` | sous une feuille | `gen2_chuka_and_champawat` |
| `tigris` | `Visage_of_Champawat` |  | `tigris` | sous une feuille | `gen2_chuka_and_champawat` |
| `tigris` | `Visage_of_Chuka` |  | `tigris` | sous une feuille | `gen2_chuka_and_champawat` |
| `tooth_of_frostfang` | `Dragon_Mold` |  | `tooth_of_frostfang` | sous une feuille | `gen1_frostfang` |
| `tooth_of_frostfang` | `Essence_of_Freezing` |  | `tooth_of_frostfang` | sous une feuille | `gen1_frostfang` |
| `tooth_of_frostfang` | `Freezing_Core` |  | `tooth_of_frostfang` | sous une feuille | `gen1_frostfang` |
| `tooth_of_frostfang` | `Spirit_of_the_Perfected_Axe` |  | `tooth_of_frostfang` | sous une feuille | `gen1_frostfang` |
| `venom_weapon` | `Congealed_Water` |  | `venom_weapon` | sous une feuille | `gen1_kraitkin` |
| `venom_weapon` | `Essence_of_the_Krait` |  | `venom_weapon` | sous une feuille | `gen1_kraitkin` |
| `venom_weapon` | `Snake_Statue` |  | `venom_weapon` | sous une feuille | `gen1_kraitkin` |
| `venom_weapon` | `Spirit_of_the_Perfected_Trident` |  | `venom_weapon` | sous une feuille | `gen1_kraitkin` |
| `zap` | `Energy_Source` |  | `zap` | sous une feuille | `gen1_bolt` |
| `zap` | `Engraver's_Tools` |  | `zap` | sous une feuille | `gen1_bolt` |
| `zap` | `Essence_of_Energy` |  | `zap` | sous une feuille | `gen1_bolt` |
| `zap` | `Spirit_of_the_Perfected_Sword` |  | `zap` | sous une feuille | `gen1_bolt` |

## Nœuds ayant une recette et aucun enfant (feuilles assumées) — 111

| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |
|---|---|---:|---|---|---|
| `mystic_clover` | `4 ingrédients` |  | `mystic_clover` | feuille assumée | `ad_infinitum`, `aetheric_anchor`, `ardent_glorious` … (+72) |
| `large_bone` | `3 ingrédients` |  | `large_bone` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+50) |
| `large_claw` | `3 ingrédients` |  | `large_claw` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+50) |
| `large_scale` | `3 ingrédients` |  | `large_scale` | feuille assumée | `aetheric_anchor`, `ardent_glorious`, `aurora` … (+50) |
| `obsidian_shard` | `3 ingrédients` |  | `obsidian_shard` | feuille assumée | `ad_infinitum`, `ardent_glorious`, `aurora` … (+50) |
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
| `mithril_ingot` | `1 ingrédients` |  | `mithril_ingot` | feuille assumée | `ad_infinitum`, `gen1_bolt`, `gen1_frostfang` … (+34) |
| `orichalcum_ingot` | `1 ingrédients` |  | `orichalcum_ingot` | feuille assumée | `endless_summer`, `gen1_bolt`, `gen1_frenzy` … (+31) |
| `darksteel_ingot` | `2 ingrédients` |  | `darksteel_ingot` | feuille assumée | `ad_infinitum`, `gen1_bolt`, `gen1_frostfang` … (+29) |
| `elder_wood_plank` | `1 ingrédients` |  | `elder_wood_plank` | feuille assumée | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+27) |
| `hard_wood_plank` | `1 ingrédients` |  | `hard_wood_plank` | feuille assumée | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+22) |
| `seasoned_wood_plank` | `1 ingrédients` |  | `seasoned_wood_plank` | feuille assumée | `ad_infinitum`, `gen1_frenzy`, `gen1_howler` … (+22) |
| `ancient_wood_plank` | `1 ingrédients` |  | `ancient_wood_plank` | feuille assumée | `gen1_frenzy`, `gen1_howler`, `gen1_kudzu` … (+20) |
| `steel_ingot` | `2 ingrédients` |  | `steel_ingot` | feuille assumée | `ad_infinitum`, `gen1_the_juggernaut`, `gen2_claw_of_the_khan_ur` … (+20) |
| `bolt_of_gossamer` | `1 ingrédients` |  | `bolt_of_gossamer` | feuille assumée | `gen1_bolt`, `gen1_quip`, `gen1_the_flameseeker_prophecies` … (+19) |
| `iron_ingot` | `1 ingrédients` |  | `iron_ingot` | feuille assumée | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+19) |
| `platinum_ingot` | `1 ingrédients` |  | `platinum_ingot` | feuille assumée | `gen1_bolt`, `gen1_frostfang`, `gen1_incinerator` … (+15) |
| `ancient_wood_pulp` | `1 ingrédients` |  | `ancient_wood_pulp` | feuille assumée | `gen3_aurenes_argument`, `gen3_aurenes_bite`, `gen3_aurenes_breath` … (+13) |
| `soft_wood_plank` | `1 ingrédients` |  | `soft_wood_plank` | feuille assumée | `ad_infinitum`, `gen2_eureka`, `gen2_flames_of_war` … (+13) |
| `cured_thick_leather_square` | `1 ingrédients` |  | `cured_thick_leather_square` | feuille assumée | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+11) |
| `cured_coarse_leather_square` | `1 ingrédients` |  | `cured_coarse_leather_square` | feuille assumée | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+10) |
| `cured_rugged_leather_square` | `1 ingrédients` |  | `cured_rugged_leather_square` | feuille assumée | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+10) |
| `cured_thin_leather_square` | `1 ingrédients` |  | `cured_thin_leather_square` | feuille assumée | `ad_infinitum`, `gen2_claw_of_the_khan_ur`, `gen2_eureka` … (+10) |
| `hardened_leather_section` | `3 ingrédients` |  | `hardened_leather_section` | feuille assumée | `endless_summer`, `gen1_howler`, `gen1_kraitkin` … (+6) |
| `onyx_lodestone` | `4 ingrédients` |  | `onyx_lodestone` | feuille assumée | `gen1_sunrise`, `gen1_the_flameseeker_prophecies`, `gen1_the_predator` … (+2) |
| `charged_lodestone` | `4 ingrédients` |  | `charged_lodestone` | feuille assumée | `endless_summer`, `gen1_bolt`, `gen1_meteorlogicus` … (+1) |
| `destroyer_lodestone` | `4 ingrédients` |  | `destroyer_lodestone` | feuille assumée | `aetheric_anchor`, `gen1_incinerator`, `gen1_rodgort` … (+1) |
| `gift_of_maguuma` | `4 ingrédients` |  | `gift_of_maguuma` | feuille assumée | `gen2_astralaria`, `gen2_chuka_and_champawat`, `gen2_hope` … (+1) |
| `molten_lodestone` | `4 ingrédients` |  | `molten_lodestone` | feuille assumée | `gen1_frenzy`, `gen1_incinerator`, `gen1_rodgort` … (+1) |
| `corrupted_lodestone` | `4 ingrédients` |  | `corrupted_lodestone` | feuille assumée | `aetheric_anchor`, `gen1_frostfang`, `orrax_manifested` |
| `crystal_lodestone` | `4 ingrédients` |  | `crystal_lodestone` | feuille assumée | `aetheric_anchor`, `gen1_the_juggernaut`, `orrax_manifested` |
| `opal_crystal` | `2 ingrédients` |  | `opal_crystal` | feuille assumée | `gen1_the_bifrost`, `gen1_the_dreamer`, `gen1_the_minstrel` |
| `peridot_lump` | `2 ingrédients` |  | `peridot_lump` | feuille assumée | `gen1_bolt`, `gen1_kraitkin`, `gen1_meteorlogicus` |
| `bolt_of_silk` | `1 ingrédients` |  | `bolt_of_silk` | feuille assumée | `ad_infinitum`, `stella_radians` |
| `carnelian_lump` | `2 ingrédients` |  | `carnelian_lump` | feuille assumée | `gen1_incinerator`, `gen1_rodgort` |
| `glacial_lodestone` | `4 ingrédients` |  | `glacial_lodestone` | feuille assumée | `gen1_frenzy`, `gen1_frostfang` |
| `jar_of_distilled_glory` | `1 ingrédients` |  | `jar_of_distilled_glory` | feuille assumée | `ardent_glorious`, `transcendence` |
| `lapis_lump` | `2 ingrédients` |  | `lapis_lump` | feuille assumée | `gen1_bolt`, `gen1_meteorlogicus` |
| `record_of_league_participation` | `1 ingrédients` |  | `record_of_league_participation` | feuille assumée | `ardent_glorious`, `transcendence` |
| `star_of_glory` | `1 ingrédients` |  | `star_of_glory` | feuille assumée | `ardent_glorious`, `transcendence` |
| `amethyst_lump` | `2 ingrédients` |  | `amethyst_lump` | feuille assumée | `gen1_the_dreamer` |
| `ancient_wood_log` | `3 ingrédients` |  | `ancient_wood_log` | feuille assumée | `vision` |
| `bolt_of_cotton` | `1 ingrédients` |  | `bolt_of_cotton` | feuille assumée | `ad_infinitum` |
| `bolt_of_linen` | `1 ingrédients` |  | `bolt_of_linen` | feuille assumée | `ad_infinitum` |
| `bolt_of_wool` | `1 ingrédients` |  | `bolt_of_wool` | feuille assumée | `ad_infinitum` |
| `carcharias` | `4 ingrédients` |  | `carcharias` | feuille assumée | `gen1_kamohoalii_kotaki` |
| `chaos_gun` | `4 ingrédients` |  | `chaos_gun` | feuille assumée | `gen1_quip` |
| `charged_fossil` | `2 ingrédients` |  | `charged_fossil` | feuille assumée | `gen1_howler` |
| `charged_thorn` | `2 ingrédients` |  | `charged_thorn` | feuille assumée | `gen1_twilight` |
| `dawn` | `4 ingrédients` |  | `dawn` | feuille assumée | `gen1_sunrise` |
| `dragons_argument` | `4 ingrédients` |  | `dragons_argument` | feuille assumée | `gen3_aurenes_argument` |
| `dragons_bite` | `4 ingrédients` |  | `dragons_bite` | feuille assumée | `gen3_aurenes_bite` |
| `dragons_breath` | `4 ingrédients` |  | `dragons_breath` | feuille assumée | `gen3_aurenes_breath` |
| `dragons_claw_weapon` | `4 ingrédients` |  | `dragons_claw_weapon` | feuille assumée | `gen3_aurenes_claw` |
| `dragons_fang` | `4 ingrédients` |  | `dragons_fang` | feuille assumée | `gen3_aurenes_fang` |
| `dragons_flight` | `4 ingrédients` |  | `dragons_flight` | feuille assumée | `gen3_aurenes_flight` |
| `dragons_gaze` | `4 ingrédients` |  | `dragons_gaze` | feuille assumée | `gen3_aurenes_gaze` |
| `dragons_insight` | `4 ingrédients` |  | `dragons_insight` | feuille assumée | `gen3_aurenes_insight` |
| `dragons_persuasion` | `4 ingrédients` |  | `dragons_persuasion` | feuille assumée | `gen3_aurenes_persuasion` |
| `dragons_rending` | `4 ingrédients` |  | `dragons_rending` | feuille assumée | `gen3_aurenes_rending` |
| `dragons_scale` | `4 ingrédients` |  | `dragons_scale` | feuille assumée | `gen3_aurenes_scale` |
| `dragons_tail` | `4 ingrédients` |  | `dragons_tail` | feuille assumée | `gen3_aurenes_tail` |
| `dragons_voice` | `4 ingrédients` |  | `dragons_voice` | feuille assumée | `gen3_aurenes_voice` |
| `dragons_weight` | `4 ingrédients` |  | `dragons_weight` | feuille assumée | `gen3_aurenes_weight` |
| `dragons_wing` | `4 ingrédients` |  | `dragons_wing` | feuille assumée | `gen3_aurenes_wing` |
| `dragons_wisdom` | `4 ingrédients` |  | `dragons_wisdom` | feuille assumée | `gen3_aurenes_wisdom` |
| `dusk` | `4 ingrédients` |  | `dusk` | feuille assumée | `gen1_twilight` |
| `gift_of_the_astral_ward` | `4 ingrédients` |  | `gift_of_the_astral_ward` | feuille assumée | `obsidian` |
| `glacial_shard` | `4 ingrédients` |  | `glacial_shard` | feuille assumée | `orrax_manifested` |
| `gold_ingot` | `1 ingrédients` |  | `gold_ingot` | feuille assumée | `vision` |
| `howl` | `4 ingrédients` |  | `howl` | feuille assumée | `gen1_howler` |
| `leaf_of_kudzu` | `4 ingrédients` |  | `leaf_of_kudzu` | feuille assumée | `gen1_kudzu` |
| `pile_of_foul_essence` | `4 ingrédients` |  | `pile_of_foul_essence` | feuille assumée | `gen1_kudzu` |
| `prototype` | `4 ingrédients` |  | `prototype` | feuille assumée | `gen2_hope` |
| `rage_weapon` | `4 ingrédients` |  | `rage_weapon` | feuille assumée | `gen1_frenzy` |
| `rare_essence_of_luck` | `1 ingrédients` |  | `rare_essence_of_luck` | feuille assumée | `ad_infinitum` |
| `rodgorts_flame` | `4 ingrédients` |  | `rodgorts_flame` | feuille assumée | `gen1_rodgort` |
| `shard_of_crystallized_mists_essence` | `4 ingrédients` |  | `shard_of_crystallized_mists_essence` | feuille assumée | `ad_infinitum` |
| `silver_ingot` | `1 ingrédients` |  | `silver_ingot` | feuille assumée | `vision` |
| `spark_weapon` | `4 ingrédients` |  | `spark_weapon` | feuille assumée | `gen1_incinerator` |
| `storm` | `4 ingrédients` |  | `storm` | feuille assumée | `gen1_meteorlogicus` |
| `the_bard` | `4 ingrédients` |  | `the_bard` | feuille assumée | `gen1_the_minstrel` |
| `the_chosen` | `4 ingrédients` |  | `the_chosen` | feuille assumée | `gen1_the_flameseeker_prophecies` |
| `the_colossus` | `4 ingrédients` |  | `the_colossus` | feuille assumée | `gen1_the_juggernaut` |
| `the_energizer` | `4 ingrédients` |  | `the_energizer` | feuille assumée | `gen1_the_moot` |
| `the_hunter` | `4 ingrédients` |  | `the_hunter` | feuille assumée | `gen1_the_predator` |
| `the_legend` | `4 ingrédients` |  | `the_legend` | feuille assumée | `gen1_the_bifrost` |
| `the_lover` | `4 ingrédients` |  | `the_lover` | feuille assumée | `gen1_the_dreamer` |
| `the_mechanism` | `4 ingrédients` |  | `the_mechanism` | feuille assumée | `gen2_astralaria` |
| `the_raven_staff` | `4 ingrédients` |  | `the_raven_staff` | feuille assumée | `gen2_nevermore` |
| `tigris` | `4 ingrédients` |  | `tigris` | feuille assumée | `gen2_chuka_and_champawat` |
| `tooth_of_frostfang` | `4 ingrédients` |  | `tooth_of_frostfang` | feuille assumée | `gen1_frostfang` |
| `venom_weapon` | `4 ingrédients` |  | `venom_weapon` | feuille assumée | `gen1_kraitkin` |
| `zap` | `4 ingrédients` |  | `zap` | feuille assumée | `gen1_bolt` |

## Palier suivant — 181 ingrédients, et qui les réclame

- `Advanced_Ammunition_Cylinder` — réclamé par `prototype`
- `Aerator` — réclamé par `rage_weapon`
- `Amethyst_Nugget` — réclamé par `amethyst_lump`
- `Balanced_Counterweight` — réclamé par `the_mechanism`
- `Barbed_Thorn` — réclamé par `charged_thorn`
- `Bone_Shard` — réclamé par `bone`
- `Bow_Wings` — réclamé par `the_lover`
- `Carnelian_Nugget` — réclamé par `carnelian_lump`
- `Carved_Beam` — réclamé par `the_legend`
- `Carved_Tear_Drop` — réclamé par `the_legend`
- `Charged_Core` — réclamé par `charged_lodestone`
- `Charged_Quartz_Crystal` — réclamé par `charged_fossil`, `charged_thorn`
- `Coarse_Leather_Section` — réclamé par `cured_coarse_leather_square`
- `Colossus_Statue` — réclamé par `the_colossus`
- `Confetti_Bullets` — réclamé par `chaos_gun`
- `Congealed_Water` — réclamé par `venom_weapon`
- `Corrupted_Core` — réclamé par `corrupted_lodestone`
- `Cotton_Scrap` — réclamé par `bolt_of_cotton`
- `Crystal_Core` — réclamé par `crystal_lodestone`
- `Destroyer_Core` — réclamé par `destroyer_lodestone`
- `Dimensional_Destabilizer` — réclamé par `dawn`, `dusk`
- `Dragon_Mold` — réclamé par `tooth_of_frostfang`
- `Dragon_Statue` — réclamé par `rodgorts_flame`
- `Elder_Wood_Log` — réclamé par `ancient_wood_log`, `elder_wood_plank`
- `Energy_Source` — réclamé par `zap`
- `Engraver's_Tools` — réclamé par `the_mechanism`, `zap`
- `Essence_of_Anomaly` — réclamé par `prototype`
- `Essence_of_Bounty_Hunting` — réclamé par `the_hunter`
- `Essence_of_Burning` — réclamé par `rodgorts_flame`
- `Essence_of_Chemistry` — réclamé par `spark_weapon`
- `Essence_of_Control` — réclamé par `storm`
- `Essence_of_Diving` — réclamé par `carcharias`
- `Essence_of_Dreams` — réclamé par `the_lover`
- `Essence_of_Energy` — réclamé par `zap`
- `Essence_of_Freezing` — réclamé par `tooth_of_frostfang`
- `Essence_of_Gloom` — réclamé par `dusk`
- `Essence_of_Heroes` — réclamé par `the_chosen`
- `Essence_of_Illumination` — réclamé par `dawn`
- `Essence_of_Mischief` — réclamé par `chaos_gun`
- `Essence_of_Performance` — réclamé par `the_bard`
- `Essence_of_Quaggan_Friendship` — réclamé par `rage_weapon`
- `Essence_of_Rainbows` — réclamé par `the_legend`
- `Essence_of_Spirit` — réclamé par `howl`
- `Essence_of_Time_and_Space` — réclamé par `the_mechanism`
- `Essence_of_the_Celebration` — réclamé par `the_energizer`
- `Essence_of_the_Garden` — réclamé par `leaf_of_kudzu`
- `Essence_of_the_Krait` — réclamé par `venom_weapon`
- `Essence_of_the_Ooze` — réclamé par `the_colossus`
- `Essence_of_the_Wild_Spirit` — réclamé par `the_raven_staff`
- `Everburning_Flame` — réclamé par `rodgorts_flame`
- `Finely_Tuned_Firing_Pin` — réclamé par `prototype`
- `Fish_Figurine` — réclamé par `rage_weapon`
- `Fortified_Precursor_Axe_Head` — réclamé par `dragons_rending`
- `Fortified_Precursor_Dagger_Blade` — réclamé par `dragons_claw_weapon`
- `Fortified_Precursor_Dagger_Hilt` — réclamé par `dragons_claw_weapon`
- `Fortified_Precursor_Focus_Casing` — réclamé par `dragons_gaze`
- `Fortified_Precursor_Focus_Core` — réclamé par `dragons_gaze`
- `Fortified_Precursor_Greatsword_Blade` — réclamé par `dragons_bite`
- `Fortified_Precursor_Greatsword_Hilt` — réclamé par `dragons_bite`
- `Fortified_Precursor_Hammer_Head` — réclamé par `dragons_weight`
- `Fortified_Precursor_Horn` — réclamé par `dragons_voice`
- `Fortified_Precursor_Longbow_Stave` — réclamé par `dragons_flight`
- `Fortified_Precursor_Mace_Head` — réclamé par `dragons_tail`
- `Fortified_Precursor_Pistol_Barrel` — réclamé par `dragons_argument`
- `Fortified_Precursor_Pistol_Frame` — réclamé par `dragons_argument`
- `Fortified_Precursor_Rifle_Barrel` — réclamé par `dragons_persuasion`
- `Fortified_Precursor_Rifle_Stock` — réclamé par `dragons_persuasion`
- `Fortified_Precursor_Scepter_Core` — réclamé par `dragons_wisdom`
- `Fortified_Precursor_Scepter_Rod` — réclamé par `dragons_wisdom`
- `Fortified_Precursor_Shield_Backing` — réclamé par `dragons_scale`
- `Fortified_Precursor_Shield_Boss` — réclamé par `dragons_scale`
- `Fortified_Precursor_Short_Bow_Stave` — réclamé par `dragons_wing`
- `Fortified_Precursor_Staff_Head` — réclamé par `dragons_insight`
- `Fortified_Precursor_Staff_Shaft` — réclamé par `dragons_insight`
- `Fortified_Precursor_String` — réclamé par `dragons_flight`, `dragons_wing`
- `Fortified_Precursor_Sword_Blade` — réclamé par `dragons_fang`
- `Fortified_Precursor_Sword_Hilt` — réclamé par `dragons_fang`
- `Fortified_Precursor_Torch_Handle` — réclamé par `dragons_breath`
- `Fortified_Precursor_Torch_Head` — réclamé par `dragons_breath`
- `Fortified_Precursor_Warhorn_Mouthpiece` — réclamé par `dragons_voice`
- `Freezing_Core` — réclamé par `tooth_of_frostfang`
- `Fuel_Cannister` — réclamé par `spark_weapon`
- `Gift_of_Amnytas` — réclamé par `gift_of_the_astral_ward`
- `Gift_of_Inner_Nayos` — réclamé par `gift_of_the_astral_ward`
- `Gift_of_Persistence` — réclamé par `gift_of_the_astral_ward`
- `Gift_of_Skywatch_Archipelago` — réclamé par `gift_of_the_astral_ward`
- `Gift_of_Tarir` — réclamé par `gift_of_maguuma`
- `Gift_of_the_Chak` — réclamé par `gift_of_maguuma`
- `Gift_of_the_Fleet` — réclamé par `gift_of_maguuma`
- `Gift_of_the_Jungle` — réclamé par `gift_of_maguuma`
- `Glacial_Core` — réclamé par `glacial_lodestone`
- `Glacial_Fragment` — réclamé par `glacial_shard`
- `Globe` — réclamé par `storm`
- `Gold_Ore` — réclamé par `gold_ingot`
- `Gossamer_Scrap` — réclamé par `bolt_of_gossamer`
- `Hard_Wood_Log` — réclamé par `hard_wood_plank`
- `Harp` — réclamé par `the_bard`
- `Horse_Figure` — réclamé par `the_lover`
- `Iron_Ore` — réclamé par `iron_ingot`, `steel_ingot`
- `Lapis_Nugget` — réclamé par `lapis_lump`
- `Large_Fortified_Precursor_Haft` — réclamé par `dragons_weight`
- `Lattice_(component)` — réclamé par `leaf_of_kudzu`
- `Leaf_Fossil` — réclamé par `charged_fossil`
- `Linen_Scrap` — réclamé par `bolt_of_linen`
- `Living_Flame` — réclamé par `the_hunter`
- `Lump_of_Coal` — réclamé par `steel_ingot`
- `Lump_of_Primordium` — réclamé par `darksteel_ingot`
- `Masterwork_Essence_of_Luck` — réclamé par `rare_essence_of_luck`
- `Memory_of_Aurene` — réclamé par `dragons_argument`, `dragons_bite`, `dragons_breath`, `dragons_claw_weapon`, `dragons_fang`, `dragons_flight`, `dragons_gaze`, `dragons_insight`, `dragons_persuasion`, `dragons_rending`, `dragons_scale`, `dragons_tail`, `dragons_voice`, `dragons_weight`, `dragons_wing`, `dragons_wisdom`
- `Mini_Risen_Priest_of_Balthazar` — réclamé par `obsidian_shard`
- `Mirror_(item)` — réclamé par `dawn`, `dusk`
- `Mithril_Ore` — réclamé par `mithril_ingot`
- `Mithril_Snake` — réclamé par `howl`
- `Molten_Core` — réclamé par `molten_lodestone`
- `Onyx_Core` — réclamé par `onyx_lodestone`
- `Ooze_Reservoir` — réclamé par `the_colossus`
- `Opal_Shard` — réclamé par `opal_crystal`
- `Orichalcum_Ore` — réclamé par `orichalcum_ingot`
- `Ornate_Pistol_Frame` — réclamé par `chaos_gun`
- `Party_Ball` — réclamé par `the_energizer`
- `Party_Stick` — réclamé par `the_energizer`
- `Peridot_Nugget` — réclamé par `peridot_lump`
- `Pile_of_Shimmering_Dust` — réclamé par `amethyst_lump`, `carnelian_lump`, `lapis_lump`, `peridot_lump`
- `Pile_of_Soiled_Essence` — réclamé par `pile_of_foul_essence`
- `Platinum_Ore` — réclamé par `darksteel_ingot`, `platinum_ingot`
- `Pruning_Shears` — réclamé par `leaf_of_kudzu`
- `Raven_Statue_(Legendary_Component)` — réclamé par `the_raven_staff`
- `Regulator_Nozzle` — réclamé par `spark_weapon`
- `Rooster_Statues` — réclamé par `the_bard`
- `Rugged_Leather_Section` — réclamé par `cured_rugged_leather_square`
- `Rune_Carving_Tools` — réclamé par `the_raven_staff`
- `Scope` — réclamé par `the_hunter`
- `Seasoned_Wood_Log` — réclamé par `seasoned_wood_plank`
- `Serrated_Harpoon` — réclamé par `carcharias`
- `Shark_Figurine` — réclamé par `carcharias`
- `Shield_of_Legend` — réclamé par `the_chosen`
- `Silk_Scrap` — réclamé par `bolt_of_silk`
- `Silver_Ore` — réclamé par `silver_ingot`
- `Small_Claw` — réclamé par `claw`
- `Small_Fang` — réclamé par `fang`
- `Small_Fortified_Precursor_Haft` — réclamé par `dragons_rending`, `dragons_tail`
- `Small_Scale` — réclamé par `scale`
- `Small_Totem` — réclamé par `totem`
- `Small_Venom_Sac` — réclamé par `venom_sac`
- `Snake_Statue` — réclamé par `venom_weapon`
- `Soft_Wood_Log` — réclamé par `soft_wood_plank`
- `Spinning_Mechanism` — réclamé par `storm`
- `Spirit_of_Development` — réclamé par `prototype`
- `Spirit_of_The_Apparatus` — réclamé par `the_mechanism`
- `Spirit_of_the_Ambush` — réclamé par `tigris`
- `Spirit_of_the_Perfected_Axe` — réclamé par `tooth_of_frostfang`
- `Spirit_of_the_Perfected_Dagger` — réclamé par `spark_weapon`
- `Spirit_of_the_Perfected_Daysword` — réclamé par `dawn`
- `Spirit_of_the_Perfected_Focus` — réclamé par `the_bard`
- `Spirit_of_the_Perfected_Hammer` — réclamé par `the_colossus`
- `Spirit_of_the_Perfected_Harpoon_Gun` — réclamé par `rage_weapon`
- `Spirit_of_the_Perfected_Longbow` — réclamé par `leaf_of_kudzu`
- `Spirit_of_the_Perfected_Mace` — réclamé par `the_energizer`
- `Spirit_of_the_Perfected_Nightsword` — réclamé par `dusk`
- `Spirit_of_the_Perfected_Pistol` — réclamé par `chaos_gun`
- `Spirit_of_the_Perfected_Rifle` — réclamé par `the_hunter`
- `Spirit_of_the_Perfected_Scepter` — réclamé par `storm`
- `Spirit_of_the_Perfected_Shield` — réclamé par `the_chosen`
- `Spirit_of_the_Perfected_Short_Bow` — réclamé par `the_lover`
- `Spirit_of_the_Perfected_Spear` — réclamé par `carcharias`
- `Spirit_of_the_Perfected_Staff` — réclamé par `the_legend`
- `Spirit_of_the_Perfected_Sword` — réclamé par `zap`
- `Spirit_of_the_Perfected_Torch` — réclamé par `rodgorts_flame`
- `Spirit_of_the_Perfected_Trident` — réclamé par `venom_weapon`
- `Spirit_of_the_Perfected_Warhorn` — réclamé par `howl`
- `Spirit_of_the_Ravenswood_Staff` — réclamé par `the_raven_staff`
- `Spirit_of_the_Tiger` — réclamé par `tigris`
- `Thick_Leather_Section` — réclamé par `cured_thick_leather_square`, `hardened_leather_section`
- `Thin_Leather_Section` — réclamé par `cured_thin_leather_square`
- `Tome_of_Heroes` — réclamé par `the_chosen`
- `Transcendent_Crystal` — réclamé par `dragons_argument`, `dragons_bite`, `dragons_breath`, `dragons_claw_weapon`, `dragons_fang`, `dragons_flight`, `dragons_gaze`, `dragons_insight`, `dragons_persuasion`, `dragons_rending`, `dragons_scale`, `dragons_tail`, `dragons_voice`, `dragons_weight`, `dragons_wing`, `dragons_wisdom`
- `Vial_of_Thin_Blood` — réclamé par `vial_of_blood`
- `Visage_of_Champawat` — réclamé par `tigris`
- `Visage_of_Chuka` — réclamé par `tigris`
- `Wolf_Statue_(exotic)` — réclamé par `howl`
- `Wool_Scrap` — réclamé par `bolt_of_wool`

## Ingrédients à créer, et qui les réclame

- `Testimony_of_Jade_Heroics` — réclamé par `certificate_of_heroics`, `essence_of_animosity`

