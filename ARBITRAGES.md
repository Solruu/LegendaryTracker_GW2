# Arbitrages de l'arbre de craft

Source : `gw2_sources_v355.json` — 81 desaccords sur 37 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `ancient_coin` — Ancient Coin | 1 | 20000 | ecart de compte x1 |
| `volatile_magic` — Volatile Magic | 2 | 4250 | cout vendeur x2 |
| `trade_contract` — Trade Contract | 3 | 4000 | cout vendeur x2, deja compte par cascade x1 |
| `unbound_magic` — Unbound Magic | 1 | 4000 | cout vendeur x1 |
| `airship_part` — Airship Part | 1 | 3200 | deja compte par cascade x1 |
| `ley_line_crystal` — Ley Line Crystal | 1 | 3200 | deja compte par cascade x1 |
| `lump_of_aurillium` — Lump of Aurillium | 1 | 3200 | deja compte par cascade x1 |
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `dust_crystalline` — Pile of Crystalline Dust | 15 | 1250 | deja compte par cascade x15 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | 3 | 1050 | deja compte par cascade x3 |
| `refined_homestead_fiber` — Refined Homestead Fiber | 1 | 1000 | deja compte par cascade x1 |
| `refined_homestead_metal` — Refined Homestead Metal | 1 | 1000 | deja compte par cascade x1 |
| `refined_homestead_wood` — Refined Homestead Wood | 1 | 1000 | deja compte par cascade x1 |
| `shard_of_glory` — Shard of Glory | 1 | 500 | deja compte par cascade x1 |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | 20 | 500 | cout vendeur x20 |
| `elegy_mosaic` — Elegy Mosaic | 1 | 450 | deja compte par cascade x1 |
| `slab_of_poultry_meat` — Slab of Poultry Meat | 1 | 450 | deja compte par cascade x1 |
| `slab_of_red_meat` — Slab of Red Meat | 1 | 300 | deja compte par cascade x1 |
| `crystalline_ingot` — Crystalline Ingot | 2 | 250 | cout vendeur x2 |
| `dust_incandescent` — Pile of Incandescent Dust | 3 | 250 | deja compte par cascade x3 |
| `orichalcum_ingot` — Orichalcum Ingot | 2 | 250 | deja compte par cascade x2 |
| `ancient_wood_log` — Ancient Wood Log | 1 | 170 | deja compte par cascade x1 |
| `branded_mass` — Branded Mass | 1 | 160 | deja compte par cascade x1 |
| `ascended_shard_of_glory` — Ascended Shards of Glory | 1 | 100 | ecart de compte x1 |
| `curious_mursaat_currency` — Curious Mursaat Currency | 1 | 100 | ecart de compte x1 |
| `pvp_league_ticket` — PvP League Ticket | 2 | 60 | deja compte par cascade x2 |
| `sweet_treated_pine_plank` — Sweet-Treated Pine Plank | 1 | 50 | cout vendeur x1 |
| `dragonite_ore` — Dragonite Ore | 1 | 25 | cout vendeur x1 |
| `mystic_clover` — Mystic Clover | 1 | 8 | deja compte par cascade x1 |
| `vision_crystal` — Vision Crystal | 2 | 2 | cout vendeur x2 |
| `black_peppercorn` — Black Peppercorn | 1 | 0 | deja compte par cascade x1 |
| `exquisite_serpentite_jewel` — Exquisite Serpentite Jewel | 1 | 0 | deja compte par cascade x1 |
| `gift_of_bones` — Gift of Bones | 1 | 0 | deja compte par cascade x1 |
| `shard_of_bava_nisos` — Shard of Bava Nisos | 1 | 0 | deja compte par cascade x1 |
| `shard_of_mistburned_barrens` — Shard of Mistburned Barrens | 1 | 0 | deja compte par cascade x1 |
| `shard_of_the_dark_arts` — Shard of the Dark Arts | 1 | 0 | deja compte par cascade x1 |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | 1 | 0 | deja compte par cascade x1 |

## ECART DE COMPTE — 3 cas

La cle a plat et l'arete donnent deux nombres differents : l'un des deux
est faux. Se tranche sur la page du PARENT, boite Recipe.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `ancient_coin` — Ancient Coin | `klobjarne_geirr` | 20250 | 250 | 20000 | gift_of_the_ursus (vendeur) |
| `ascended_shard_of_glory` — Ascended Shards of Glory | `transcendence` | 500 | 400 | 100 | star_of_glory (recette) |
| `curious_mursaat_currency` — Curious Mursaat Currency | `klobjarne_geirr` | 125 | 25 | 100 | gift_of_the_ursus (vendeur) |

## DEJA COMPTE PAR CASCADE — 47 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `airship_part` — Airship Part | `gen2_the_hms_divinity` | 800 | 4000 | 3200 | tribute_to_the_man_o_war (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_the_hms_divinity` | 800 | 4000 | 3200 | tribute_to_the_man_o_war (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_the_hms_divinity` | 800 | 4000 | 3200 | tribute_to_the_man_o_war (vendeur) |
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `dust_crystalline` — Pile of Crystalline Dust | `aetheric_anchor` | 400 | 1650 | 1250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `orrax_manifested` | 1500 | 450 | 1050 | olmakhan_charm (recette), unbound_wings (recette), vial_of_titan_melted_obsidian (recette) |
| `refined_homestead_fiber` — Refined Homestead Fiber | `klobjarne_geirr` | 250 | 1250 | 1000 | shard_of_the_homestead (vendeur) |
| `refined_homestead_metal` — Refined Homestead Metal | `klobjarne_geirr` | 250 | 1250 | 1000 | shard_of_the_homestead (vendeur) |
| `refined_homestead_wood` — Refined Homestead Wood | `klobjarne_geirr` | 250 | 1250 | 1000 | shard_of_the_homestead (vendeur) |
| `trade_contract` — Trade Contract | `coalescence` | 300 | 1250 | 950 | funerary_incense (vendeur), tribute_to_the_man_o_war (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `vision` | 763 | 5 | 758 | olmakhan_charm (recette), unbound_wings (recette), vial_of_titan_melted_obsidian (recette) |
| `shard_of_glory` — Shard of Glory | `transcendence` | 500 | 1000 | 500 | jar_of_distilled_glory (recette) |
| `elegy_mosaic` — Elegy Mosaic | `coalescence` | 750 | 300 | 450 | spirit_of_the_jackal (vendeur), spirit_of_the_raptor (vendeur), spirit_of_the_skimmer (vendeur) +1 autres |
| `slab_of_poultry_meat` — Slab of Poultry Meat | `orrax_manifested` | 150 | 600 | 450 | bowl_of_poultry_satay (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `vision` | 450 | 21 | 429 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `aurora` | 450 | 24 | 426 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_meteorlogicus` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_flameseeker_prophecies` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `slab_of_red_meat` — Slab of Red Meat | `orrax_manifested` | 100 | 400 | 300 | meaty_asparagus_skewer (recette), plate_of_orrian_steak_frittes (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_bifrost` | 250 | 500 | 250 | opal_orb (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_minstrel` | 250 | 500 | 250 | opal_orb (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `klobjarne_geirr` | 750 | 500 | 250 | neutralized_titan_alloy (recette) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ad_infinitum` | 270 | 25 | 245 | olmakhan_charm (recette), unbound_wings (recette), vial_of_titan_melted_obsidian (recette) |
| `ancient_wood_log` — Ancient Wood Log | `vision` | 10 | 180 | 170 | ancient_wood_plank (recette) |
| `branded_mass` — Branded Mass | `vision` | 460 | 300 | 160 | diviners_orichalcum_imbued_inscription (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_bolt` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_predator` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_twilight` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `orrax_manifested` | 100 | 250 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_sunrise` | 250 | 102 | 148 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_juggernaut` | 250 | 151 | 99 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `pvp_league_ticket` — PvP League Ticket | `ardent_glorious` | 180 | 120 | 60 | record_of_league_participation (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_frenzy` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_frostfang` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_incinerator` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_rodgort` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_dreamer` | 525 | 500 | 25 | opal_orb (recette) |
| `mystic_clover` — Mystic Clover | `orrax_manifested` | 38 | 30 | 8 | gift_of_the_side_course (recette) |
| `pvp_league_ticket` — PvP League Ticket | `transcendence` | 25 | 20 | 5 | record_of_league_participation (recette) |
| `black_peppercorn` — Black Peppercorn | `orrax_manifested` | 500 | 500 | 0 | bowl_of_black_pepper_cactus_salad (recette) |
| `exquisite_serpentite_jewel` — Exquisite Serpentite Jewel | `vision` | 18 | 18 | 0 | diviners_orichalcum_imbued_inscription (recette) |
| `gift_of_bones` — Gift of Bones | `klobjarne_geirr` | 1 | 1 | 0 | gift_of_recollector_of_memories (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `orrax_manifested` | 250 | 250 | 0 | neutralized_titan_alloy (recette) |
| `shard_of_bava_nisos` — Shard of Bava Nisos | `orrax_manifested` | 100 | 100 | 0 | gift_of_the_mursaat_ruins (recette) |
| `shard_of_mistburned_barrens` — Shard of Mistburned Barrens | `orrax_manifested` | 100 | 100 | 0 | gift_of_the_mursaat_ruins (recette) |
| `shard_of_the_dark_arts` — Shard of the Dark Arts | `gen2_the_binding_of_ipos` | 100 | 100 | 0 | ars_goetia (recette) |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | `orrax_manifested` | 150 | 150 | 0 | gift_of_the_mursaat_ruins (recette), mists_gate_residue (vendeur) |

## COUT VENDEUR — 31 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `volatile_magic` — Volatile Magic | `vision` | 0 | 4250 | 4250 | olmakhan_latigo_strap (vendeur), tribute_to_the_man_o_war (vendeur) |
| `trade_contract` — Trade Contract | `gen2_the_hms_divinity` | 0 | 4000 | 4000 | funerary_incense (vendeur), tribute_to_the_man_o_war (vendeur) |
| `unbound_magic` — Unbound Magic | `gen2_the_hms_divinity` | 0 | 4000 | 4000 | tribute_to_the_man_o_war (vendeur) |
| `volatile_magic` — Volatile Magic | `gen2_the_hms_divinity` | 0 | 4000 | 4000 | olmakhan_latigo_strap (vendeur), tribute_to_the_man_o_war (vendeur) |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_bolt` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_frenzy` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_frostfang` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_howler` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_incinerator` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_kamohoalii_kotaki` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_kraitkin` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_kudzu` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_meteorlogicus` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_quip` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_rodgort` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_sunrise` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_the_bifrost` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_the_dreamer` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_the_flameseeker_prophecies` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_the_juggernaut` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_the_minstrel` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_the_moot` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_the_predator` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | `gen1_twilight` | 0 | 500 | 500 | gift_of_ascalon (vendeur), gift_of_baelfire (vendeur), gift_of_knowledge (vendeur) +5 autres |
| `trade_contract` — Trade Contract | `vision` | 0 | 500 | 500 | funerary_incense (vendeur), tribute_to_the_man_o_war (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `coalescence` | 0 | 250 | 250 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `vision` | 0 | 100 | 100 | funerary_incense (vendeur) |
| `sweet_treated_pine_plank` — Sweet-Treated Pine Plank | `orrax_manifested` | 0 | 50 | 50 | mists_gate_residue (vendeur) |
| `dragonite_ore` — Dragonite Ore | `orrax_manifested` | 0 | 25 | 25 | binding_of_the_dragon (vendeur) |
| `vision_crystal` — Vision Crystal | `selachimorpha` | 0 | 2 | 2 | gift_of_adventure (vendeur), unbound_wings (recette) |
| `vision_crystal` — Vision Crystal | `ad_infinitum` | 0 | 1 | 1 | gift_of_adventure (vendeur), unbound_wings (recette) |
