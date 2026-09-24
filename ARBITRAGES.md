# Arbitrages de l'arbre de craft

Source : `gw2_sources_v314.json` — 41 desaccords sur 21 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `trade_contract` — Trade Contract | 3 | 2000 | cout vendeur x2, deja compte par cascade x1 |
| `unbound_magic` — Unbound Magic | 1 | 2000 | cout vendeur x1 |
| `volatile_magic` — Volatile Magic | 1 | 2000 | cout vendeur x1 |
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `dust_crystalline` — Pile of Crystalline Dust | 13 | 1250 | deja compte par cascade x13 |
| `airship_part` — Airship Part | 1 | 1200 | deja compte par cascade x1 |
| `ley_line_crystal` — Ley Line Crystal | 1 | 1200 | deja compte par cascade x1 |
| `lump_of_aurillium` — Lump of Aurillium | 1 | 1200 | deja compte par cascade x1 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | 2 | 1050 | deja compte par cascade x2 |
| `crystalline_ingot` — Crystalline Ingot | 2 | 250 | cout vendeur x2 |
| `dust_incandescent` — Pile of Incandescent Dust | 3 | 250 | deja compte par cascade x3 |
| `orichalcum_ingot` — Orichalcum Ingot | 2 | 250 | deja compte par cascade x2 |
| `branded_mass` — Branded Mass | 1 | 160 | deja compte par cascade x1 |
| `mystic_clover` — Mystic Clover | 1 | 8 | deja compte par cascade x1 |
| `vision_crystal` — Vision Crystal | 2 | 2 | cout vendeur x2 |
| `exquisite_serpentite_jewel` — Exquisite Serpentite Jewel | 1 | 0 | deja compte par cascade x1 |
| `gift_of_bones` — Gift of Bones | 1 | 0 | deja compte par cascade x1 |
| `shard_of_bava_nisos` — Shard of Bava Nisos | 1 | 0 | deja compte par cascade x1 |
| `shard_of_mistburned_barrens` — Shard of Mistburned Barrens | 1 | 0 | deja compte par cascade x1 |
| `shard_of_the_dark_arts` — Shard of the Dark Arts | 1 | 0 | deja compte par cascade x1 |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | 1 | 0 | deja compte par cascade x1 |

## DEJA COMPTE PAR CASCADE — 33 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `dust_crystalline` — Pile of Crystalline Dust | `aetheric_anchor` | 400 | 1650 | 1250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `airship_part` — Airship Part | `gen2_the_hms_divinity` | 800 | 2000 | 1200 | tribute_to_the_man_o_war (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_the_hms_divinity` | 800 | 2000 | 1200 | tribute_to_the_man_o_war (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_the_hms_divinity` | 800 | 2000 | 1200 | tribute_to_the_man_o_war (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `orrax_manifested` | 1500 | 450 | 1050 | unbound_wings (recette), vial_of_titan_melted_obsidian (recette) |
| `trade_contract` — Trade Contract | `coalescence` | 300 | 1250 | 950 | funerary_incense (vendeur), tribute_to_the_man_o_war (vendeur) |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_meteorlogicus` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_flameseeker_prophecies` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_bifrost` | 250 | 500 | 250 | opal_orb (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_minstrel` | 250 | 500 | 250 | opal_orb (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `klobjarne_geirr` | 250 | 500 | 250 | neutralized_titan_alloy (recette) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ad_infinitum` | 250 | 25 | 225 | unbound_wings (recette), vial_of_titan_melted_obsidian (recette) |
| `branded_mass` — Branded Mass | `vision` | 460 | 300 | 160 | diviners_orichalcum_imbued_inscription (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_bolt` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_sunrise` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_predator` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_twilight` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `orrax_manifested` | 100 | 250 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_juggernaut` | 250 | 150 | 100 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_frenzy` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_frostfang` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_incinerator` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_rodgort` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `mystic_clover` — Mystic Clover | `orrax_manifested` | 38 | 30 | 8 | gift_of_the_side_course (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_dreamer` | 500 | 500 | 0 | opal_orb (recette) |
| `exquisite_serpentite_jewel` — Exquisite Serpentite Jewel | `vision` | 18 | 18 | 0 | diviners_orichalcum_imbued_inscription (recette) |
| `gift_of_bones` — Gift of Bones | `klobjarne_geirr` | 1 | 1 | 0 | gift_of_recollector_of_memories (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `orrax_manifested` | 250 | 250 | 0 | neutralized_titan_alloy (recette) |
| `shard_of_bava_nisos` — Shard of Bava Nisos | `orrax_manifested` | 100 | 100 | 0 | gift_of_the_mursaat_ruins (recette) |
| `shard_of_mistburned_barrens` — Shard of Mistburned Barrens | `orrax_manifested` | 100 | 100 | 0 | gift_of_the_mursaat_ruins (recette) |
| `shard_of_the_dark_arts` — Shard of the Dark Arts | `gen2_the_binding_of_ipos` | 100 | 100 | 0 | ars_goetia (recette) |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | `orrax_manifested` | 150 | 150 | 0 | gift_of_the_mursaat_ruins (recette), mists_gate_residue (vendeur) |

## COUT VENDEUR — 8 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `trade_contract` — Trade Contract | `gen2_the_hms_divinity` | 0 | 2000 | 2000 | funerary_incense (vendeur), tribute_to_the_man_o_war (vendeur) |
| `unbound_magic` — Unbound Magic | `gen2_the_hms_divinity` | 0 | 2000 | 2000 | tribute_to_the_man_o_war (vendeur) |
| `volatile_magic` — Volatile Magic | `gen2_the_hms_divinity` | 0 | 2000 | 2000 | tribute_to_the_man_o_war (vendeur) |
| `trade_contract` — Trade Contract | `vision` | 0 | 500 | 500 | funerary_incense (vendeur), tribute_to_the_man_o_war (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `coalescence` | 0 | 250 | 250 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `vision` | 0 | 100 | 100 | funerary_incense (vendeur) |
| `vision_crystal` — Vision Crystal | `selachimorpha` | 0 | 2 | 2 | gift_of_adventure (vendeur), unbound_wings (recette) |
| `vision_crystal` — Vision Crystal | `ad_infinitum` | 0 | 1 | 1 | gift_of_adventure (vendeur), unbound_wings (recette) |
