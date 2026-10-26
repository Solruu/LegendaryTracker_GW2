# Confrontation des recettes avec l'API

Source : `gw2_sources_v428.json` contre `ressources/api/api_recettes_composants_20261024.json` (recettes d'artisanat ; la Forge mystique n'est pas dans l'API). Regle : pour un id confirme, l'API a raison.

| classe | nombre |
|---|---:|
| ACCORD | 339 |
| ECART | 1 |
| VOIE_RETENUE | 4 |
| CHOIX | 1 |
| FEUILLE_MULTI | 0 |
| FEUILLE_VOIE | 33 |
| FEUILLE_RAFFINAGE | 31 |
| PLUSIEURS | 5 |

## ECART

| composant | recette | detail | best |
|---|---|---|---|
| `banner_pennon` | Leatherworker/Armorsmith/Tailor 400 | en trop 1 recipe_banner_pennon |  |

## FEUILLE_MULTI

| composant | recette | detail | best |
|---|---|---|---|

## VOIE_RETENUE

| composant | recette | detail | best |
|---|---|---|---|
| `agony_infusion_3` | Artificer 100 | en trop 4 agony_infusion_1 ; manque 2 agony_infusion_2 ; manque 1 thermocatalytic_reagent | vendor |
| `agony_infusion_5` | Artificer 100 | en trop 4 agony_infusion_3 ; manque 2 agony_infusion_4 ; manque 1 thermocatalytic_reagent | vendor |
| `agony_infusion_7` | Artificer 100 | en trop 4 agony_infusion_5 ; manque 2 agony_infusion_6 ; manque 1 thermocatalytic_reagent | vendor |
| `agony_infusion_9` | Artificer 100 | en trop 4 agony_infusion_7 ; manque 2 agony_infusion_8 ; manque 1 thermocatalytic_reagent | vendor |

## FEUILLE_VOIE

| composant | recette | detail | best |
|---|---|---|---|
| `amalgamated_draconic_lodestone` | Leatherworker/Armorsmith/Tailor/Artificer/Weaponsmith/Huntsman/Jeweler 400 | 10 Crystal Lodestone, 10 Destroyer Lodestone, 10 Corrupted Lodestone, 10 Mordrem Lodestone |  |
| `amethyst_nugget` | Jeweler 50 | 1 Garnet Pebble, 1 Turquoise Pebble, 1 Pile of Glittering Dust |  |
| `auric_ingot` | Artificer/Weaponsmith/Huntsman 400 | 30 Pile of Auric Dust, 30 Auric Sliver | craft_or_vendor |
| `carcharias` | Weaponsmith 500 | 1 Essence of Diving, 1 Spirit of the Perfected Spear, 1 Shark Figurine, 1 Serrated Harpoon | achievement_collection |
| `carnelian_nugget` | Jeweler 50 | 1 Garnet Pebble, 1 Tiger's Eye Pebble, 1 Pile of Glittering Dust |  |
| `chaos_gun` | Huntsman 500 | 1 Essence of Mischief, 1 Spirit of the Perfected Pistol, 1 Ornate Pistol Frame, 1 Confetti Bullets | achievement_collection |
| `coral_orb` | Jeweler 350 | 2 Coral Tentacle, 5 Pile of Incandescent Dust |  |
| `dawn` | Weaponsmith 500 | 1 Essence of Illumination, 1 Spirit of the Perfected Daysword, 1 Mirror, 1 Dimensional Destabilizer | achievement_collection |
| `dusk` | Weaponsmith 500 | 1 Essence of Gloom, 1 Spirit of the Perfected Nightsword, 1 Mirror, 1 Dimensional Destabilizer | achievement_collection |
| `howl` | Huntsman 500 | 1 Essence of Spirit, 1 Spirit of the Perfected Warhorn, 1 Wolf Statue, 1 Mithril Snake | achievement_collection |
| `lapis_nugget` | Jeweler 50 | 1 Turquoise Pebble, 1 Malachite Pebble, 1 Pile of Glittering Dust |  |
| `leaf_of_kudzu` | Huntsman 500 | 1 Essence of the Garden, 1 Spirit of the Perfected Longbow, 1 Lattice, 1 Pruning Shears | achievement_collection |
| `opal_crystal` | Jeweler 275 | 2 Opal Shard, 1 Pile of Luminous Dust |  |
| `peridot_nugget` | Jeweler 50 | 1 Turquoise Pebble, 1 Tiger's Eye Pebble, 1 Pile of Glittering Dust |  |
| `prototype` | Huntsman 500 | 1 Essence of Anomaly, 1 Spirit of Development, 1 Finely Tuned Firing Pin, 1 Advanced Ammunition Cylinder | achievement_collection |
| `rage_weapon` | Huntsman 500 | 1 Essence of Quaggan Friendship, 1 Spirit of the Perfected Harpoon Gun, 1 Fish Figurine, 1 Aerator | achievement_collection |
| `relic_of_the_sunless` | Leatherworker/Armorsmith/Tailor 400 | 48 Pile of Lucent Crystal, 30 Sun Bead, 3 Charm of Skill, 15 Glob of Ectoplasm |  |
| `rodgorts_flame` | Huntsman 500 | 1 Essence of Burning, 1 Spirit of the Perfected Torch, 1 Everburning Flame, 1 Dragon Statue | achievement_collection |
| `spark_weapon` | Weaponsmith 500 | 1 Essence of Chemistry, 1 Spirit of the Perfected Dagger, 1 Fuel Cannister, 1 Regulator Nozzle | achievement_collection |
| `storm` | Artificer 500 | 1 Essence of Control, 1 Spirit of the Perfected Scepter, 1 Globe, 1 Spinning Mechanism | achievement_collection |
| `the_bard` | Artificer 500 | 1 Essence of Performance, 1 Spirit of the Perfected Focus, 1 Harp, 1 Rooster Statues | achievement_collection |
| `the_chosen` | Weaponsmith 500 | 1 Essence of Heroes, 1 Spirit of the Perfected Shield, 1 Tome of Heroes, 1 Shield of Legend | achievement_collection |
| `the_colossus` | Weaponsmith 500 | 1 Essence of the Ooze, 1 Spirit of the Perfected Hammer, 1 Ooze Reservoir, 1 Colossus Statue | achievement_collection |
| `the_energizer` | Weaponsmith 500 | 1 Essence of the Celebration, 1 Spirit of the Perfected Mace, 1 Party Ball, 1 Party Stick | achievement_collection |
| `the_hunter` | Huntsman 500 | 1 Essence of Bounty Hunting, 1 Spirit of the Perfected Rifle, 1 Living Flame, 1 Scope | achievement_collection |
| `the_legend` | Artificer 500 | 1 Essence of Rainbows, 1 Spirit of the Perfected Staff, 1 Carved Tear Drop, 1 Carved Beam | achievement_collection |
| `the_lover` | Huntsman 500 | 1 Essence of Dreams, 1 Spirit of the Perfected Short Bow, 1 Horse Figure, 1 Bow Wings | achievement_collection |
| `the_mechanism` | Weaponsmith 500 | 1 Essence of Time and Space, 1 Spirit of The Apparatus, 1 Balanced Counterweight, 1 Engraver's Tools | achievement_collection |
| `the_raven_staff` | Artificer 500 | 1 Essence of the Wild Spirit, 1 Spirit of the Ravenswood Staff, 1 Raven Statue, 1 Rune Carving Tools | achievement_collection |
| `tigris` | Huntsman 500 | 1 Spirit of the Tiger, 1 Spirit of the Ambush, 1 Visage of Chuka, 1 Visage of Champawat | achievement_collection |
| `tooth_of_frostfang` | Weaponsmith 500 | 1 Essence of Freezing, 1 Spirit of the Perfected Axe, 1 Freezing Core, 1 Dragon Mold | achievement_collection |
| `venom_weapon` | Artificer 500 | 1 Essence of the Krait, 1 Spirit of the Perfected Trident, 1 Snake Statue, 1 Congealed Water | achievement_collection |
| `zap` | Weaponsmith 500 | 1 Essence of Energy, 1 Spirit of the Perfected Sword, 1 Engraver's Tools, 1 Energy Source | achievement_collection |

## PLUSIEURS

| composant | recette | detail | best |
|---|---|---|---|
| `bloodstone_brick` | Leatherworker/Armorsmith/Tailor/Artificer/Weaponsmith/Huntsman 450 | 2 recettes, comparee : 7314 |  |
| `dragonite_ingot` | Leatherworker/Armorsmith/Tailor/Artificer/Weaponsmith/Huntsman 450 | 2 recettes, comparee : 7316 |  |
| `empyreal_star` | Leatherworker/Armorsmith/Tailor/Artificer/Weaponsmith/Huntsman 450 | 2 recettes, comparee : 7317 |  |
| `lump_of_mithrillium` | Jeweler 400 | 2 recettes, comparee : 12053 |  |
| `simple_olmakhan_bandolier` | Tailor 400 | 3 recettes, comparee : 12655 |  |
