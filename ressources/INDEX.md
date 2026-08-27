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

## Manquent encore

**Rien.** Les 32 pages des huit lignes de trophées sont versées, du T3 au T6.
