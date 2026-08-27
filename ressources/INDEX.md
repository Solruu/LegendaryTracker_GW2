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
- Poids : 18 Mo bruts pour les 20 premières captures, **~570 Ko une fois
  compressées par git**. Le HTML se comprime à 3 %. Aucune raison de trier.

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

## Manquent encore

Pour finir l'affinage des foyers de farm T6, cinq tableaux « Dropped by » :
`pile_of_crystalline_dust`, `powerful_venom_sac`, `vial_of_powerful_blood`,
`vicious_claw`, `vicious_fang`.
