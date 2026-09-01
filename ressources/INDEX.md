# Ressources — captures HTML de référence

Captures brutes servant de source aux données du tracker. Elles sont versées
**telles quelles**, sans nettoyage : une absence dans une capture tronquée n'est
pas une absence, et un extrait dérivé ne permettrait à personne de vérifier ce
que le parseur a laissé tomber.

## Conventions

- Un fichier = une page source. Nom = titre canonique de la page en `snake_case`,
  sans le suffixe de provenance (le dossier le porte déjà).
- Suffixe `__<section>` quand la capture ne couvre **qu'une section** de la page
  et non l'article entier. Exemple : `ancient_bone__dropped_by.html`.
- Pas de suffixe de version : ces fichiers sont des captures datées, pas des
  livrables. Une nouvelle capture **remplace** l'ancienne et la date change
  ci-dessous. L'historique git conserve la précédente.
- Poids : le HTML se comprime à 3 %. Aucune raison de trier ni d'élaguer.

## Portée des captures

Deux profondeurs coexistent, à connaître avant de parser :

| profondeur | contenu | fichiers concernés |
|---|---|---|
| article complet | `#bodyContent` entier : encadré d'objet, acquisition, utilisations, notes | toutes les pages `wiki/` sans suffixe |
| section seule | le tableau `NPC \| Level \| Rank \| Locations \| Quantity` uniquement | les trois `__dropped_by` |

## Les huit lignes de trophées, tous paliers

Les gifts consomment 50 T3 + 50 T4 + 250 T5 + 100 T6 par ligne : **le T5 pèse
plus de la moitié du volume**, le T6 moins d'un quart. Le bloc « Où farmer »
ne couvre aujourd'hui que le T6.

Le palier T6 est versé en **section « Dropped by » seule** (suffixe
`__dropped_by`) ; les paliers T3 à T5 sont versés en **articles complets** : le
tableau des mobs y est noyé au milieu des recettes et des conteneurs. Un
parseur doit localiser la section avant de lire les lignes — `gw2_parse_dropped_by_v1.py`
ne sait pour l'instant traiter que les fragments.

| ligne | T3 | T4 | T5 | T6 |
|---|---|---|---|---|
| Os | `bone` | `heavy_bone` | `large_bone` | `ancient_bone__dropped_by` |
| Griffes | `claw` | `sharp_claw` | `large_claw` | `vicious_claw__dropped_by` |
| Crocs | `fang` | `sharp_fang` | `large_fang` | `vicious_fang__dropped_by` |
| Écailles | `scale` | `smooth_scale` | `large_scale` | `armored_scale__dropped_by` |
| Totems | `totem` | `engraved_totem` | `intricate_totem` | `elaborate_totem__dropped_by` |
| Poussière | `pile_of_radiant_dust` | `pile_of_luminous_dust` | `pile_of_incandescent_dust` | `pile_of_crystalline_dust__dropped_by` |
| Venin | `venom_sac` | `full_venom_sac` | `potent_venom_sac` | `powerful_venom_sac__dropped_by` |
| Sang | `vial_of_blood` | `vial_of_thick_blood` | `vial_of_potent_blood` | `vial_of_powerful_blood__dropped_by` |

Toutes dans `wiki/`, versées le 2026-08-27.

**Pagination.** Le wiki plafonne ces tableaux à 150 lignes et renvoie la suite
derrière un lien « further results » (`offset=150`). Les suites sont versées à
part, suffixe `__dropped_by_pN`. Quatre lignes étaient concernées, toutes au T5 :

| ligne | page 1 | page 2 | total |
|---|---|---|---|
| `large_bone` | 150 | 11 | 161 |
| `large_claw` | 150 | 25 | 175 |
| `pile_of_incandescent_dust` | 150 | 80 | 230 |
| `potent_venom_sac` | 150 | 11 | 161 |

`gw2_parse_dropped_by_v2.py` les recolle tout seul et **lève** si un NPC apparaît
dans deux pages — un recouvrement signalerait un mauvais offset. Aucune page 3 :
les quatre suites sont sous le plafond et ne portent pas de lien « further results ».

**Plus aucune capture tronquée.**

## wiki/ — Guild Wars 2 Wiki (wiki.guildwars2.com)

| fichier | page source | portée | versé le |
|---|---|---|---|
| `ancient_bone__dropped_by.html` | Ancient Bone | section « Dropped by », 120 NPC | 2026-08-27 |
| `armored_scale__dropped_by.html` | Armored Scale | section « Dropped by », 90 NPC | 2026-08-27 |
| `elaborate_totem__dropped_by.html` | Elaborate Totem | section « Dropped by », 56 NPC | 2026-08-27 |
| `pile_of_crystalline_dust__dropped_by.html` | Pile of Crystalline Dust | section « Dropped by », 143 NPC | 2026-08-27 |
| `powerful_venom_sac__dropped_by.html` | Powerful Venom Sac | section « Dropped by », 120 NPC | 2026-08-27 |
| `vial_of_powerful_blood__dropped_by.html` | Vial of Powerful Blood | section « Dropped by », 74 NPC | 2026-08-27 |
| `vicious_claw__dropped_by.html` | Vicious Claw | section « Dropped by », 110 NPC | 2026-08-27 |
| `vicious_fang__dropped_by.html` | Vicious Fang | section « Dropped by », 87 NPC | 2026-08-27 |
| `ancient_coin.html` | Ancient Coin | article complet | 2026-08-27 |
| `ascended_shard_of_glory.html` | Ascended Shard of Glory | article complet | 2026-08-27 |
| `charged_lodestone.html` | Charged Lodestone | article complet | 2026-08-27 |
| `chromatic_sap.html` | Chromatic Sap | article complet | 2026-08-27 |
| `corrupted_lodestone.html` | Corrupted Lodestone | article complet | 2026-08-27 |
| `crystal_lodestone.html` | Crystal Lodestone | article complet | 2026-08-27 |
| `curious_mursaat_currency.html` | Curious Mursaat Currency | article complet | 2026-08-27 |
| `curious_mursaat_remnants.html` | Curious Mursaat Remnants | article complet | 2026-08-27 |
| `curious_mursaat_ruin_shard.html` | Curious Mursaat Ruin Shard | article complet | 2026-08-27 |
| `destroyer_lodestone.html` | Destroyer Lodestone | article complet | 2026-08-27 |
| `evergreen_lodestone.html` | Evergreen Lodestone | article complet | 2026-08-27 |
| `glacial_lodestone.html` | Glacial Lodestone | article complet | 2026-08-27 |
| `lodestone.html` | Lodestone | article complet — page générique des orbes | 2026-08-27 |
| `mists_gate_residue.html` | Mists Gate Residue | article complet | 2026-08-27 |
| `molten_lodestone.html` | Molten Lodestone | article complet | 2026-08-27 |
| `mordrem_lodestone.html` | Mordrem Lodestone | article complet | 2026-08-27 |
| `mursaat_obsidian_chunk.html` | Mursaat Obsidian Chunk | article complet | 2026-08-27 |
| `mursaat_runestone.html` | Mursaat Runestone | article complet | 2026-08-27 |
| `neutralized_titan_alloy.html` | Neutralized Titan Alloy | article complet | 2026-08-27 |
| `onyx_lodestone.html` | Onyx Lodestone | article complet | 2026-08-27 |
| `raw_enchanting_stone.html` | Raw Enchanting Stone | article complet | 2026-08-27 |
| `seer_runestone.html` | Seer Runestone | article complet | 2026-08-27 |
| `shadowstone_fragment.html` | Shadowstone Fragment | article complet | 2026-08-27 |
| `shard_of_bava_nisos.html` | Shard of Bava Nisos | article complet | 2026-08-27 |
| `shard_of_janthir_syntri.html` | Shard of Janthir Syntri | article complet | 2026-08-27 |
| `shard_of_lowland_shore.html` | Shard of Lowland Shore | article complet | 2026-08-27 |
| `shard_of_mistburned_barrens.html` | Shard of Mistburned Barrens | article complet | 2026-08-27 |
| `shard_of_the_homestead.html` | Shard of the Homestead | article complet | 2026-08-27 |
| `tale_of_adventure.html` | Tale of Adventure | article complet | 2026-08-27 |
| `titan_heatstone.html` | Titan Heatstone | article complet | 2026-08-27 |
| `unusual_coin.html` | Unusual Coin | article complet | 2026-08-27 |
| `lump_of_mithrillium.html` | Lump of Mithrillium | article complet | 2026-08-27 |
| `provisioner_token.html` | Provisioner Token | article complet | 2026-08-27 |
| `the_druid_stone.html` | The Druid Stone | collection, 7 objets | 2026-08-27 |
| `awakening_the_druid_stone.html` | Awakening the Druid Stone | collection, 14 objets | 2026-08-27 |
| `sprouting_the_druid_stone.html` | Sprouting the Druid Stone | collection, 21 objets | 2026-08-27 |
| `a_henge_away_from_home.html` | A Henge Away from Home | collection, 32 objets | 2026-08-27 |
| `acquiring_agaleus.html` | Acquiring Agaleus | collection, 24 objets | 2026-08-27 |
| `astral_purification.html` | Astral Purification | collection, 15 objets | 2026-08-27 |
| `radiance_of_the_sun_god.html` | Radiance of the Sun God | collection, 20 objets | 2026-08-27 |
| `the_convergence_of_sorrow_i_elegy.html` | The Convergence of Sorrow I: Elegy | collection, 20 objets | 2026-08-27 |
| `unknown_nightmares_gift_of_the_feast.html` | Unknown Nightmares: Gift of the Feast | collection, 18 objets | 2026-08-27 |
| `legendary_relics_components.html` | Legendary Relics: Components | collection, 20 objets | 2026-08-27 |
| `mists_research.html` | Mists Research | collection, 8 objets | 2026-08-27 |
| `mists_research_strife_unending.html` | Mists Research: Strife Unending | collection, 11 objets | 2026-08-27 |
| `unknown_nightmares_experiments_in_the_shadows.html` | Unknown Nightmares: Experiments in the Shadows | collection, 10 objets | 2026-08-27 |
| `unknown_nightmares_gift_of_shadows.html` | Unknown Nightmares: Gift of Shadows | collection, 7 objets | 2026-08-27 |
| `unknown_nightmares_gift_of_the_mistburned_isles.html` | Unknown Nightmares: Gift of the Mistburned Isles | collection, 13 objets | 2026-08-27 |
| `unknown_nightmares_orrax_contained.html` | Unknown Nightmares: Orrax Contained | collection, 5 objets | 2026-08-27 |
| `visions_of_istan.html` | Visions of Istan | collection, 7 objets | 2026-08-27 |
| `precursor_weapon.html` | Precursor weapon | table des 53 précurseurs, avec génération | 2026-08-27 |
| `caladbolg.html` | Caladbolg | article complet — arme d'histoire, chaîne Knight of the Thorn | 2026-08-27 |
| `the_moot_ii_the_perfected_mace.html` | The Moot II: The Perfected Mace | collection, 14 objets — capture d'essai palier II | 2026-08-27 |
| `eternity.html` | Eternity | article complet — table de recette en cascade | 2026-08-27 |
| `astralaria.html` | Astralaria | article complet — table de recette en cascade | 2026-08-27 |
| `astralaria_i_the_device.html` | Astralaria I: The Device | collection, 19 objets | 2026-08-27 |
| `astralaria_ii_the_apparatus.html` | Astralaria II: The Apparatus | collection, 14 objets | 2026-08-27 |
| `astralaria_iii_the_mechanism.html` | Astralaria III: The Mechanism | collection, 33 objets | 2026-08-27 |
| `astralaria_iv_the_cosmos.html` | Astralaria IV: The Cosmos | collection, 54 objets | 2026-08-27 |
| `hope.html` | HOPE | article complet — table de recette en cascade | 2026-09-01 |
| `hope_i_research.html` | HOPE I: Research | collection, 20 objets | 2026-09-01 |
| `hope_ii_development.html` | HOPE II: Development | collection, 14 objets | 2026-09-01 |
| `hope_iii_prototype.html` | HOPE III: Prototype | collection, 31 objets | 2026-09-01 |
| `hope_iv_the_catalyst.html` | HOPE IV: The Catalyst | collection, 59 objets | 2026-09-01 |
| `bolt.html` | Bolt | article complet — table de recette en cascade | 2026-09-01 |
| `bolt_i_the_experimental_sword.html` | Bolt I: The Experimental Sword | collection, 21 objets | 2026-09-01 |
| `bolt_ii_the_perfected_sword.html` | Bolt II: The Perfected Sword | collection, 13 objets | 2026-09-01 |
| `bolt_iii_zap.html` | Bolt III: Zap | collection, 30 objets | 2026-09-01 |
| `nevermore.html` | Nevermore | article complet — table de recette en cascade | 2026-09-01 |
| `nevermore_i_ravenswood_branch.html` | Nevermore I: Ravenswood Branch | collection, 14 objets | 2026-09-01 |
| `nevermore_ii_ravenswood_staff.html` | Nevermore II: Ravenswood Staff | collection, 14 objets | 2026-09-01 |
| `nevermore_iii_the_raven_staff.html` | Nevermore III: The Raven Staff | collection, 34 objets | 2026-09-01 |
| `nevermore_iv_the_raven_spirit.html` | Nevermore IV: The Raven Spirit | collection, 63 objets | 2026-09-01 |
| `chuka_i_hunters_journal.html` | Chuka and Champawat I: Hunter's Journal | collection, 20 objets | 2026-09-01 |
| `chuka_i_the_hunt.html` | Chuka and Champawat I: The Hunt | collection, 7 objets | 2026-09-01 |
| `chuka_ii_ambush.html` | Chuka and Champawat II: Ambush | collection, 16 objets | 2026-09-01 |
| `chuka_iii_tigris.html` | Chuka and Champawat III: Tigris | collection, 20 objets | 2026-09-01 |
| `chuka_iv_a_nontraditional_family.html` | Chuka and Champawat IV: A Nontraditional Family | collection, 9 objets | 2026-09-01 |
| `chuka_and_champawat.html` | Chuka and Champawat | article complet — table de recette en cascade | 2026-09-01 |
| `chuka_iii_naturalists_journal.html` | Chuka and Champawat III: Naturalist's Journal | collection, 16 objets | 2026-09-01 |
| `chuka_iv_baby_book.html` | Chuka and Champawat IV: Baby Book | collection, 15 objets | 2026-09-01 |
| `chuka_iv_secluded_tour.html` | Chuka and Champawat IV: Secluded Tour | collection, 10 objets | 2026-09-01 |
| `chuka_iv_tiger_training_guide.html` | Chuka and Champawat IV: Tiger Training Guide | collection, 14 objets | 2026-09-01 |
| `spirit_of_the_tiger_achievement.html` | Spirit of the Tiger (achievement) | succès Explorateur, 11 tanières — source du how de l'étape Mini Tiger Spirit | 2026-09-01 |
| `sunrise.html` | Sunrise | article complet — table de recette en cascade | 2026-09-01 |
| `sunrise_i_the_experimental_daysword.html` | Sunrise I: The Experimental Daysword | collection, 15 objets | 2026-09-01 |
| `sunrise_ii_the_perfected_daysword.html` | Sunrise II: The Perfected Daysword | collection, 16 objets | 2026-09-01 |
| `sunrise_iii_dawn.html` | Sunrise III: Dawn | collection, 35 objets | 2026-09-01 |
| `twilight.html` | Twilight | article complet — table de recette en cascade | 2026-09-01 |
| `twilight_i_the_experimental_nightsword.html` | Twilight I: The Experimental Nightsword | collection, 15 objets | 2026-09-01 |
| `twilight_ii_the_perfected_nightsword.html` | Twilight II: The Perfected Nightsword | collection, 16 objets | 2026-09-01 |
| `twilight_iii_dusk.html` | Twilight III: Dusk | collection, 30 objets | 2026-09-01 |
| `frenzy.html` | Frenzy | article complet — table de recette en cascade | 2026-09-01 |
| `frenzy_i_the_experimental_harpoon_gun.html` | Frenzy I: The Experimental Harpoon Gun | collection, 6 objets | 2026-09-01 |
| `frenzy_ii_the_perfected_harpoon_gun.html` | Frenzy II: The Perfected Harpoon Gun | collection, 7 objets | 2026-09-01 |
| `frenzy_iii_rage.html` | Frenzy III: Rage | collection, 18 objets | 2026-09-01 |
| `frostfang.html` | Frostfang | article complet — table de recette en cascade | 2026-09-01 |
| `frostfang_i_the_experimental_axe.html` | Frostfang I: The Experimental Axe | collection, 15 objets | 2026-09-01 |
| `frostfang_ii_the_perfected_axe.html` | Frostfang II: The Perfected Axe | collection, 12 objets | 2026-09-01 |
| `frostfang_iii_tooth_of_frostfang.html` | Frostfang III: Tooth of Frostfang | collection, 34 objets | 2026-09-01 |
| `howler.html` | Howler | article complet — table de recette en cascade | 2026-09-01 |
| `howler_i_the_experimental_warhorn.html` | Howler I: The Experimental Warhorn | collection, 22 objets | 2026-09-01 |
| `howler_ii_the_perfected_warhorn.html` | Howler II: The Perfected Warhorn | collection, 13 objets | 2026-09-01 |
| `howler_iii_howl.html` | Howler III: Howl | collection, 35 objets | 2026-09-01 |
| `incinerator.html` | Incinerator | article complet — table de recette en cascade | 2026-09-01 |
| `incinerator_i_the_experimental_dagger.html` | Incinerator I: The Experimental Dagger | collection, 18 objets | 2026-09-01 |
| `incinerator_ii_the_perfected_dagger.html` | Incinerator II: The Perfected Dagger | collection, 15 objets | 2026-09-01 |
| `incinerator_iii_spark.html` | Incinerator III: Spark | collection, 24 objets | 2026-09-01 |
| `kamohoalii_kotaki.html` | Kamohoali'i Kotaki | article complet — table de recette en cascade | 2026-09-01 |
| `kamohoalii_kotaki_i_the_experimental_spear.html` | Kamohoali'i Kotaki I: The Experimental Spear | collection, 6 objets | 2026-09-01 |
| `kamohoalii_kotaki_ii_the_perfected_spear.html` | Kamohoali'i Kotaki II: The Perfected Spear | collection, 7 objets | 2026-09-01 |
| `kamohoalii_kotaki_iii_carcharias.html` | Kamohoali'i Kotaki III: Carcharias | collection, 28 objets | 2026-09-01 |
| `kraitkin.html` | Kraitkin | article complet — table de recette en cascade | 2026-09-01 |
| `kraitkin_i_the_experimental_trident.html` | Kraitkin I: The Experimental Trident | collection, 7 objets | 2026-09-01 |
| `kraitkin_ii_the_perfected_trident.html` | Kraitkin II: The Perfected Trident | collection, 9 objets | 2026-09-01 |
| `kraitkin_iii_venom.html` | Kraitkin III: Venom | collection, 21 objets | 2026-09-01 |
| `kudzu.html` | Kudzu | article complet — table de recette en cascade | 2026-09-01 |
| `kudzu_i_the_experimental_longbow.html` | Kudzu I: The Experimental Longbow | collection, 13 objets | 2026-09-01 |
| `kudzu_ii_the_perfected_longbow.html` | Kudzu II: The Perfected Longbow | collection, 16 objets | 2026-09-01 |
| `kudzu_iii_leaf_of_kudzu.html` | Kudzu III: Leaf of Kudzu | collection, 29 objets | 2026-09-01 |
| `meteorlogicus.html` | Meteorlogicus | article complet — table de recette en cascade | 2026-09-01 |
| `meteorlogicus_i_the_experimental_scepter.html` | Meteorlogicus I: The Experimental Scepter | collection, 15 objets | 2026-09-01 |
| `meteorlogicus_ii_the_perfected_scepter.html` | Meteorlogicus II: The Perfected Scepter | collection, 11 objets | 2026-09-01 |
| `meteorlogicus_iii_storm.html` | Meteorlogicus III: Storm | collection, 29 objets | 2026-09-01 |
| `quip.html` | Quip | article complet — table de recette en cascade | 2026-09-01 |
| `quip_i_the_experimental_pistol.html` | Quip I: The Experimental Pistol | collection, 16 objets | 2026-09-01 |
| `quip_ii_the_perfected_pistol.html` | Quip II: The Perfected Pistol | collection, 13 objets | 2026-09-01 |
| `quip_iii_chaos_gun.html` | Quip III: Chaos Gun | collection, 35 objets | 2026-09-01 |
| `rodgort.html` | Rodgort | article complet — table de recette en cascade | 2026-09-01 |
| `rodgort_i_the_experimental_torch.html` | Rodgort I: The Experimental Torch | collection, 11 objets | 2026-09-01 |
| `rodgort_ii_the_perfected_torch.html` | Rodgort II: The Perfected Torch | collection, 12 objets | 2026-09-01 |
| `rodgort_iii_rodgorts_flame.html` | Rodgort III: Rodgort's Flame | collection, 31 objets | 2026-09-01 |
| `the_bifrost.html` | The Bifrost | article complet — table de recette en cascade | 2026-09-01 |
| `the_bifrost_i_the_experimental_staff.html` | The Bifrost I: The Experimental Staff | collection, 16 objets | 2026-09-01 |
| `the_bifrost_ii_the_perfected_staff.html` | The Bifrost II: The Perfected Staff | collection, 14 objets | 2026-09-01 |
| `the_bifrost_iii_the_legend.html` | The Bifrost III: The Legend | collection, 32 objets | 2026-09-01 |
| `the_dreamer.html` | The Dreamer | article complet — table de recette en cascade | 2026-09-01 |
| `the_dreamer_i_the_experimental_short_bow.html` | The Dreamer I: The Experimental Short Bow | collection, 14 objets | 2026-09-01 |
| `the_dreamer_ii_the_perfected_short_bow.html` | The Dreamer II: The Perfected Short Bow | collection, 16 objets | 2026-09-01 |
| `the_dreamer_iii_the_lover.html` | The Dreamer III: The Lover | collection, 30 objets | 2026-09-01 |
| `the_flameseeker_prophecies.html` | The Flameseeker Prophecies | article complet — table de recette en cascade | 2026-09-01 |
| `the_flameseeker_prophecies_i_the_experimental_shield.html` | The Flameseeker Prophecies I: The Experimental Shield | collection, 14 objets | 2026-09-01 |
| `the_flameseeker_prophecies_ii_the_perfected_shield.html` | The Flameseeker Prophecies II: The Perfected Shield | collection, 13 objets | 2026-09-01 |
| `the_flameseeker_prophecies_iii_the_chosen.html` | The Flameseeker Prophecies III: The Chosen | collection, 32 objets | 2026-09-01 |
| `the_juggernaut.html` | The Juggernaut | article complet — table de recette en cascade | 2026-09-01 |
| `the_juggernaut_i_the_experimental_hammer.html` | The Juggernaut I: The Experimental Hammer | collection, 32 objets | 2026-09-01 |
| `the_juggernaut_ii_the_perfected_hammer.html` | The Juggernaut II: The Perfected Hammer | collection, 16 objets | 2026-09-01 |
| `the_juggernaut_iii_the_colossus.html` | The Juggernaut III: The Colossus | collection, 32 objets | 2026-09-01 |
| `the_minstrel.html` | The Minstrel | article complet — table de recette en cascade | 2026-09-01 |
| `the_minstrel_i_the_experimental_focus.html` | The Minstrel I: The Experimental Focus | collection, 15 objets | 2026-09-01 |
| `the_minstrel_ii_the_perfected_focus.html` | The Minstrel II: The Perfected Focus | collection, 12 objets | 2026-09-01 |
| `the_minstrel_iii_the_bard.html` | The Minstrel III: The Bard | collection, 33 objets | 2026-09-01 |
| `the_moot.html` | The Moot | article complet — table de recette en cascade | 2026-09-01 |
| `the_moot_i_the_experimental_mace.html` | The Moot I: The Experimental Mace | collection, 14 objets | 2026-09-01 |
| `the_moot_ii_the_perfected_mace.html` | The Moot II: The Perfected Mace | collection, 14 objets | 2026-09-01 |
| `the_moot_iii_the_energizer.html` | The Moot III: The Energizer | collection, 35 objets | 2026-09-01 |
| `the_predator.html` | The Predator | article complet — table de recette en cascade | 2026-09-01 |
| `the_predator_i_the_experimental_rifle.html` | The Predator I: The Experimental Rifle | collection, 17 objets | 2026-09-01 |
| `the_predator_ii_the_perfected_rifle.html` | The Predator II: The Perfected Rifle | collection, 14 objets | 2026-09-01 |
| `the_predator_iii_the_hunter.html` | The Predator III: The Hunter | collection, 24 objets | 2026-09-01 |
| `legendary_weapon_bolt.html` | Legendary Weapon: Bolt | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_frenzy.html` | Legendary Weapon: Frenzy | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_frostfang.html` | Legendary Weapon: Frostfang | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_howler.html` | Legendary Weapon: Howler | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_incinerator.html` | Legendary Weapon: Incinerator | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_kamohoalii_kotaki.html` | Legendary Weapon: Kamohoali'i Kotaki | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_kraitkin.html` | Legendary Weapon: Kraitkin | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_kudzu.html` | Legendary Weapon: Kudzu | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_meteorlogicus.html` | Legendary Weapon: Meteorlogicus | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_quip.html` | Legendary Weapon: Quip | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_rodgort.html` | Legendary Weapon: Rodgort | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_sunrise.html` | Legendary Weapon: Sunrise | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_the_bifrost.html` | Legendary Weapon: The Bifrost | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_the_dreamer.html` | Legendary Weapon: The Dreamer | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_the_flameseeker_prophecies.html` | Legendary Weapon: The Flameseeker Prophecies | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_the_juggernaut.html` | Legendary Weapon: The Juggernaut | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_the_minstrel.html` | Legendary Weapon: The Minstrel | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_the_moot.html` | Legendary Weapon: The Moot | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_the_predator.html` | Legendary Weapon: The Predator | collection, 16 objets | 2026-09-01 |
| `legendary_weapon_twilight.html` | Legendary Weapon: Twilight | collection, 16 objets | 2026-09-01 |
| `aurenes_argument.html` | Aurene's Argument | article — Pistol, recette et précurseur Dragon's Argument | 2026-09-01 |
| `aurenes_bite.html` | Aurene's Bite | article — Greatsword, recette et précurseur Dragon's Bite | 2026-09-01 |
| `aurenes_breath.html` | Aurene's Breath | article — Torch, recette et précurseur Dragon's Breath | 2026-09-01 |
| `aurenes_claw.html` | Aurene's Claw | article — Dagger, recette et précurseur Dragon's Claw | 2026-09-01 |
| `aurenes_fang.html` | Aurene's Fang | article — Sword, recette et précurseur Dragon's Fang | 2026-09-01 |
| `aurenes_flight.html` | Aurene's Flight | article — Longbow, recette et précurseur Dragon's Flight | 2026-09-01 |
| `aurenes_gaze.html` | Aurene's Gaze | article — Focus, recette et précurseur Dragon's Gaze | 2026-09-01 |
| `aurenes_insight.html` | Aurene's Insight | article — Staff, recette et précurseur Dragon's Insight | 2026-09-01 |
| `aurenes_persuasion.html` | Aurene's Persuasion | article — Rifle, recette et précurseur Dragon's Persuasion | 2026-09-01 |
| `aurenes_rending.html` | Aurene's Rending | article — Axe, recette et précurseur Dragon's Rending | 2026-09-01 |
| `aurenes_scale.html` | Aurene's Scale | article — Shield, recette et précurseur Dragon's Scale | 2026-09-01 |
| `aurenes_tail.html` | Aurene's Tail | article — Mace, recette et précurseur Dragon's Tail | 2026-09-01 |
| `aurenes_voice.html` | Aurene's Voice | article — Warhorn, recette et précurseur Dragon's Voice | 2026-09-01 |
| `aurenes_weight.html` | Aurene's Weight | article — Hammer, recette et précurseur Dragon's Weight | 2026-09-01 |
| `aurenes_wing.html` | Aurene's Wing | article — Short bow, recette et précurseur Dragon's Wing | 2026-09-01 |
| `aurenes_wisdom.html` | Aurene's Wisdom | article — Scepter, recette et précurseur Dragon's Wisdom | 2026-09-01 |
| `claw_of_the_khan_ur.html` | Claw of the Khan-Ur | article complet — table de recette en cascade | 2026-09-01 |
| `eureka.html` | Eureka | article complet — table de recette en cascade | 2026-09-01 |
| `exordium.html` | Exordium | article complet — table de recette en cascade | 2026-09-01 |
| `flames_of_war.html` | Flames of War | article complet — table de recette en cascade | 2026-09-01 |
| `pharus.html` | Pharus | article complet — table de recette en cascade | 2026-09-01 |
| `sharur.html` | Sharur | article complet — table de recette en cascade | 2026-09-01 |
| `shooshadoo.html` | Shooshadoo | article complet — table de recette en cascade | 2026-09-01 |
| `the_binding_of_ipos.html` | The Binding of Ipos | article complet — table de recette en cascade | 2026-09-01 |
| `the_hms_divinity.html` | The HMS Divinity | article complet — table de recette en cascade | 2026-09-01 |
| `the_shining_blade.html` | The Shining Blade | article complet — table de recette en cascade | 2026-09-01 |
| `verdarach.html` | Verdarach | article complet — table de recette en cascade | 2026-09-01 |
| `xiuquatl.html` | Xiuquatl | article complet — table de recette en cascade | 2026-09-01 |
| `a_bug_in_the_system_achievements.html` | A Bug in the System (achievements) | méta de maîtrise — 48 succès éligibles, seuil 35 | 2026-09-01 |
| `a_henge_away_from_home.html` | A Henge Away from Home | collection, 32 objets | 2026-09-01 |
| `a_star_to_guide_us_achievements.html` | A Star to Guide Us (achievements) | méta de maîtrise — 55 éligibles, seuil 38 | 2026-09-01 |
| `acquiring_agaleus.html` | Acquiring Agaleus | collection, 24 objets | 2026-09-01 |
| `ad_infinitum_i_finite_result.html` | Ad Infinitum I: Finite Result | collection, 11 objets | 2026-09-01 |
| `ad_infinitum_ii_upper_bound.html` | Ad Infinitum II: Upper Bound | collection, 11 objets | 2026-09-01 |
| `ad_infinitum_iii_unbound.html` | Ad Infinitum III: Unbound | collection, 11 objets | 2026-09-01 |
| `all_or_nothing_achievements.html` | All or Nothing (achievements) | méta de maîtrise — 40 éligibles, seuil 30 | 2026-09-01 |
| `astral_purification.html` | Astral Purification | collection, 15 objets | 2026-09-01 |
| `aurora_awakening.html` | Aurora: Awakening | collection, 7 objets — créée, elle était vide | 2026-09-01 |
| `aurora_ii_empowering.html` | Aurora II: Empowering | collection, 21 objets | 2026-09-01 |
| `awakening_the_druid_stone.html` | Awakening the Druid Stone | collection, 14 objets | 2026-09-01 |
| `bava_nisos_achievements.html` | Bava Nisos (achievements) | méta de maîtrise — 15 éligibles, seuil 10 | 2026-09-01 |
| `brandstone_research.html` | Brandstone Research | collection, 7 objets | 2026-09-01 |
| `coalescence_i_unbridled.html` | Coalescence I: Unbridled | collection, 10 objets | 2026-09-01 |
| `coalescence_ii_the_gift.html` | Coalescence II: The Gift | collection, 18 objets | 2026-09-01 |
| `coalescence_iii_culmination.html` | Coalescence III: Culmination | collection, 8 objets | 2026-09-01 |
| `envoy_armor_i_experimental_armor.html` | Envoy Armor I: Experimental Armor | collection, 18 objets | 2026-09-01 |
| `envoy_armor_ii_refined_armor.html` | Envoy Armor II: Refined Armor | collection, 14 objets | 2026-09-01 |
| `forge_guards_armor_collection.html` | Forge Guard's Armor Collection | collection, 6 objets — table sans colonne Notes | 2026-09-01 |
| `glimmering_resin_weapon_collector.html` | Glimmering Resin Weapon Collector | collection, 17 objets — table sans colonne Notes | 2026-09-01 |
| `incursive_investigation.html` | Incursive Investigation | méta — recoupement de meta_eligible, 5 objectifs | 2026-09-01 |
| `journeyman_of_the_forge.html` | Journeyman of the Forge | collection, 16 objets | 2026-09-01 |
| `legendary_armor_achievements.html` | Legendary Armor (achievements) | page de catégorie — contexte, non parsée | 2026-09-01 |
| `legendary_backpack_ad_infinitum.html` | Legendary Backpack: Ad Infinitum | collection, 13 objets | 2026-09-01 |
| `legendary_relics_components.html` | Legendary Relics: Components | collection, 20 objets — 20 renvois component | 2026-09-01 |
| `legendary_weapons_achievements.html` | Legendary Weapons (achievements) | page de catégorie — contexte, non parsée | 2026-09-01 |
| `living_world_return.html` | Living World Return | page de contexte — 24 méta Return, contenu retiré du jeu | 2026-09-01 |
| `long_live_the_lich_achievements.html` | Long Live the Lich (achievements) | méta — recoupement de meta_eligible, 48 objectifs | 2026-09-01 |
| `master_diver.html` | Master Diver | collection, 10 objets | 2026-09-01 |
| `mistburned_barrens_achievements.html` | Mistburned Barrens (achievements) | méta — recoupement de meta_eligible, 23 objectifs | 2026-09-01 |
| `mists_research.html` | Mists Research | collection, 8 objets | 2026-09-01 |
| `mists_research_strife_unending.html` | Mists Research: Strife Unending | collection, 11 objets | 2026-09-01 |
| `radiance_of_the_sun_god.html` | Radiance of the Sun God | collection, 20 objets | 2026-09-01 |
| `shipwreck_strand_achievements.html` | Shipwreck Strand (achievements) | méta — recoupement de meta_eligible, 53 objectifs | 2026-09-01 |
| `sprouting_the_druid_stone.html` | Sprouting the Druid Stone | collection, 21 objets | 2026-09-01 |
| `starlit_weald_achievements.html` | Starlit Weald (achievements) | méta — 55 au wiki contre 54 à l'API, divergence confirmée | 2026-09-01 |
| `the_convergence_of_sorrow_i_elegy.html` | The Convergence of Sorrow I: Elegy | collection, 20 objets | 2026-09-01 |
| `the_druid_stone.html` | The Druid Stone | collection, 7 objets | 2026-09-01 |
| `unknown_nightmares_experiments_in_the_shadows.html` | Unknown Nightmares: Experiments in the Shadows | collection, 10 objets | 2026-09-01 |
| `bone.html` | Bone | article complet — T3 | 2026-08-27 |
| `claw.html` | Claw | article complet — T3 | 2026-08-27 |
| `fang.html` | Fang | article complet — T3 | 2026-08-27 |
| `scale.html` | Scale | article complet — T3 | 2026-08-27 |
| `totem.html` | Totem | article complet — T3 | 2026-08-27 |
| `pile_of_radiant_dust.html` | Pile of Radiant Dust | article complet — T3 | 2026-08-27 |
| `heavy_bone.html` | Heavy Bone | article complet — T4 | 2026-08-27 |
| `sharp_claw.html` | Sharp Claw | article complet — T4 | 2026-08-27 |
| `sharp_fang.html` | Sharp Fang | article complet — T4 | 2026-08-27 |
| `smooth_scale.html` | Smooth Scale | article complet — T4 | 2026-08-27 |
| `engraved_totem.html` | Engraved Totem | article complet — T4 | 2026-08-27 |
| `full_venom_sac.html` | Full Venom Sac | article complet — T4 | 2026-08-27 |
| `pile_of_luminous_dust.html` | Pile of Luminous Dust | article complet — T4 | 2026-08-27 |
| `large_bone.html` | Large Bone | article complet — T5 | 2026-08-27 |
| `large_claw.html` | Large Claw | article complet — T5 | 2026-08-27 |
| `large_fang.html` | Large Fang | article complet — T5 | 2026-08-27 |
| `large_scale.html` | Large Scale | article complet — T5 | 2026-08-27 |
| `intricate_totem.html` | Intricate Totem | article complet — T5 | 2026-08-27 |
| `potent_venom_sac.html` | Potent Venom Sac | article complet — T5 | 2026-08-27 |
| `pile_of_incandescent_dust.html` | Pile of Incandescent Dust | article complet — T5 | 2026-08-27 |
| `large_bone__dropped_by_p2.html` | Large Bone | suite « Dropped by », 11 NPC | 2026-08-27 |
| `large_claw__dropped_by_p2.html` | Large Claw | suite « Dropped by », 25 NPC | 2026-08-27 |
| `pile_of_incandescent_dust__dropped_by_p2.html` | Pile of Incandescent Dust | suite « Dropped by », 80 NPC | 2026-08-27 |
| `potent_venom_sac__dropped_by_p2.html` | Potent Venom Sac | suite « Dropped by », 11 NPC | 2026-08-27 |
| `venom_sac.html` | Venom Sac | article complet — T3 | 2026-08-27 |
| `vial_of_blood.html` | Vial of Blood | article complet — T3 | 2026-08-27 |
| `vial_of_thick_blood.html` | Vial of Thick Blood | article complet — T4 | 2026-08-27 |
| `vial_of_potent_blood.html` | Vial of Potent Blood | article complet — T5 | 2026-08-27 |

## gw2efficiency/ — arbres de craft (gw2efficiency.com)

Les arbres donnent les **quantités absolues par nœud**, pas des cascades
multiplicatives, et **omettent entièrement les étapes verrouillées par
collection**. Ne jamais en déduire qu'une étape de collection n'existe pas.

| fichier | cible | versé le |
|---|---|---|
| `aetheric_anchor.html` | Aetheric Anchor | 2026-08-27 |
| `coalescence_vision_ad_infinitum.html` | Coalescence + Vision + Ad Infinitum | 2026-08-27 |
| `conflux.html` | Conflux, arbre complet | 2026-08-27 |
| `endless_summer.html` | Endless Summer | 2026-08-27 |
| `klobjarne_geirr.html` | Klobjarne Geirr | 2026-08-27 |
| `orrax_manifested.html` | Orrax Manifested | 2026-08-27 |
| `selachimorpha.html` | Selachimorpha, conteneur | 2026-08-27 |
| `stella_radians.html` | Stella Radians | 2026-08-27 |
| `strife_unending.html` | Strife Unending | 2026-08-27 |
| `the_ascension.html` | The Ascension | 2026-08-27 |
| `transcendence.html` | Transcendence | 2026-08-27 |
| `warbringer.html` | Warbringer, arbre complet | 2026-08-27 |
| `obsidian_armor_breastplate.html` | Cuirasse d'armure d'obsidienne lourde | 2026-08-27 |

## Contrôle d'inventaire

Un fichier présent mais absent de ce tableau est un fichier que personne ne sait
lire. Vérification du 27/08/2026 : **297 captures, 297 lignes, aucun écart** —
7 fichiers manquaient à l'index, ajoutés.

## Manquent encore

**Une seule** : `Incursive Investigation: Working Together` (succès 8830, 4 étapes
sans conseil). Le wiki redirige ce titre vers la page de **catégorie** du groupe
de succès, qui ne contient aucun tableau d'objets. Il faut atteindre la page de
collection elle-même, pas la redirection.

Les 32 pages des huit lignes de trophées sont versées, du T3 au T6.
