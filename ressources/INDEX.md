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

**Rien pour le palier T6** : les huit tableaux « Dropped by » sont versés.

Pour étendre le bloc « Où farmer » aux paliers inférieurs — qui pèsent 250 unités
sur 450 par gift contre 100 pour le T6 — il faudrait les mêmes tableaux pour les
huit lignes en T5, T4 et T3, soit 24 pages. Le T5 seul en couvrirait la plus
grosse part.
