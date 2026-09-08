# Arbitrages de l'arbre de craft

Source : `gw2_sources_v236.json` — 305 desaccords sur 32 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | 65 | 3654 | deja compte par cascade x34, alea du trefle mystique x24, cout vendeur x7 |
| `research_note` — Research Note | 1 | 2500 | ecart de compte x1 |
| `shard_of_glory` — Shard of Glory | 1 | 2000 | ecart de compte x1 |
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `dust_crystalline` — Pile of Crystalline Dust | 13 | 1250 | deja compte par cascade x12, ecart de compte x1 |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | 7 | 1140 | ecart de compte x5, deja compte par cascade x2 |
| `trade_contract` — Trade Contract | 2 | 950 | ecart de compte x1, cout vendeur x1 |
| `elegy_mosaic` — Elegy Mosaic | 1 | 450 | ecart de compte x1 |
| `obsidian_shard` — Obsidian Shard | 69 | 426 | deja compte par cascade x55, cout vendeur x7, alea du trefle mystique x7 |
| `magnetite_shard` — Magnetite Shard | 1 | 350 | ecart de compte x1 |
| `airship_part` — Airship Part | 13 | 250 | deja compte par cascade x12, cout vendeur x1 |
| `amalgamated_gemstone` — Amalgamated Gemstone | 36 | 250 | cout vendeur x33, ecart de compte x3 |
| `dust_incandescent` — Pile of Incandescent Dust | 2 | 250 | deja compte par cascade x2 |
| `ley_line_crystal` — Ley Line Crystal | 13 | 250 | deja compte par cascade x12, cout vendeur x1 |
| `lump_of_aurillium` — Lump of Aurillium | 13 | 250 | deja compte par cascade x12, cout vendeur x1 |
| `orichalcum_ingot` — Orichalcum Ingot | 2 | 250 | deja compte par cascade x2 |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | 1 | 250 | deja compte par cascade x1 |
| `mystic_coin` — Mystic Coin | 17 | 248 | alea du trefle mystique x17 |
| `branded_mass` — Branded Mass | 1 | 160 | deja compte par cascade x1 |
| `darksteel_ingot` — Darksteel Ingot | 1 | 110 | deja compte par cascade x1 |
| `curious_mursaat_ruin_shard` — Curious Mursaat Ruin Shard | 1 | 100 | ecart de compte x1 |
| `pvp_league_ticket` — PvP League Ticket | 2 | 100 | ecart de compte x2 |
| `emblem_of_the_conqueror` — Emblem of the Conqueror | 1 | 99 | ecart de compte x1 |
| `mystic_clover` — Mystic Clover | 32 | 77 | cout vendeur x16, ecart de compte x16 |
| `vision_crystal` — Vision Crystal | 2 | 2 | cout vendeur x2 |
| `gift_of_battle` — Gift of Battle | 1 | 1 | deja compte par cascade x1 |
| `exquisite_serpentite_jewel` — Exquisite Serpentite Jewel | 1 | 0 | deja compte par cascade x1 |
| `gift_of_bones` — Gift of Bones | 1 | 0 | deja compte par cascade x1 |
| `inscribed_shard` — Inscribed Shard | 1 | 0 | deja compte par cascade x1 |
| `shard_of_bava_nisos` — Shard of Bava Nisos | 1 | 0 | deja compte par cascade x1 |
| `shard_of_mistburned_barrens` — Shard of Mistburned Barrens | 1 | 0 | deja compte par cascade x1 |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | 1 | 0 | deja compte par cascade x1 |

## ECART DE COMPTE — 34 cas

La cle a plat et l'arete donnent deux nombres differents : l'un des deux
est faux. Se tranche sur la page du PARENT, boite Recipe.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `research_note` — Research Note | `stella_radians` | 52500 | 50000 | 2500 | seer_runestone (vendeur) |
| `shard_of_glory` — Shard of Glory | `transcendence` | 2250 | 250 | 2000 | gift_of_skirmishing (recette) |
| `trade_contract` — Trade Contract | `coalescence` | 300 | 1250 | 950 | funerary_incense (vendeur) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `ad_infinitum` | 590 | 10 | 580 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +2 autres |
| `elegy_mosaic` — Elegy Mosaic | `coalescence` | 300 | 750 | 450 | funerary_incense (vendeur) |
| `magnetite_shard` — Magnetite Shard | `coalescence` | 450 | 100 | 350 | gift_of_complex_emotions (vendeur) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `conflux` | 300 | 600 | 300 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +2 autres |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `the_ascension` | 300 | 600 | 300 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +2 autres |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `transcendence` | 300 | 600 | 300 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +2 autres |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `warbringer` | 300 | 600 | 300 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `coalescence` | 250 | 500 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `orrax_manifested` | 100 | 350 | 250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +5 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `orrax_manifested` | 200 | 100 | 100 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `vision` | 100 | 200 | 100 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `curious_mursaat_ruin_shard` — Curious Mursaat Ruin Shard | `orrax_manifested` | 125 | 25 | 100 | discounted_shard_of_mistburned_barrens (vendeur), gift_of_titan_understanding (vendeur) |
| `pvp_league_ticket` — PvP League Ticket | `the_ascension` | 125 | 25 | 100 | certificate_of_support (recette) |
| `emblem_of_the_conqueror` — Emblem of the Conqueror | `conflux` | 100 | 1 | 99 | war_commendation (recette) |
| `pvp_league_ticket` — PvP League Ticket | `transcendence` | 70 | 25 | 45 | certificate_of_support (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_argument` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_bite` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_breath` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_claw` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_fang` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_gaze` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_guard` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_insight` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_persuasion` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_reckoning` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_scale` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_tenderness` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_voice` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_weight` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_wisdom` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_wrath` | 77 | 38 | 39 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |

## DEJA COMPTE PAR CASCADE — 154 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

Les 60 plus gros ecarts sur 154. Le reste se
recalcule en relancant le script.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `dust_crystalline` — Pile of Crystalline Dust | `aetheric_anchor` | 400 | 1650 | 1250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +5 autres |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `obsidian` | 1500 | 360 | 1140 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +2 autres |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `klobjarne_geirr` | 850 | 1800 | 950 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `vision` | 768 | 177 | 591 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_meteorlogicus` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +5 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_flameseeker_prophecies` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +5 autres |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_bifrost` | 250 | 500 | 250 | beryl_orb (recette), chrysocola_orb (recette), emerald_orb (recette) +3 autres |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_minstrel` | 250 | 500 | 250 | beryl_orb (recette), chrysocola_orb (recette), emerald_orb (recette) +3 autres |
| `orichalcum_ingot` — Orichalcum Ingot | `klobjarne_geirr` | 250 | 500 | 250 | banner_of_the_commander (recette), gift_of_souls (recette), neutralized_titan_alloy (recette) |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | `conflux` | 250 | 500 | 250 | essence_of_animosity (recette) |
| `airship_part` — Airship Part | `gen2_astralaria` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_caladbolg` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_chuka_and_champawat` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_elegy` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_eordas_grip` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_hope` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_hope_scepter` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_itzels_boon` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_lorekeeper` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_nevermore` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_reaver_of_the_mists` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `airship_part` — Airship Part | `gen2_tigris` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_astralaria` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_caladbolg` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_chuka_and_champawat` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_elegy` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_eordas_grip` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_hope` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_hope_scepter` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_itzels_boon` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_lorekeeper` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_nevermore` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_reaver_of_the_mists` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_tigris` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_astralaria` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_caladbolg` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_chuka_and_champawat` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_elegy` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_eordas_grip` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_hope` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_hope_scepter` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_itzels_boon` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_lorekeeper` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_nevermore` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_reaver_of_the_mists` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_tigris` | 500 | 300 | 200 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_astralaria` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_caladbolg` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_chuka_and_champawat` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_elegy` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_eordas_grip` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_eureka` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_exordium` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_hope` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_hope_scepter` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_itzels_boon` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_lorekeeper` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_nevermore` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_reaver_of_the_mists` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |

## COUT VENDEUR — 69 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

Les 60 plus gros ecarts sur 69. Le reste se
recalcule en relancant le script.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `obsidian` | 0 | 3654 | 3654 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `trade_contract` — Trade Contract | `vision` | 0 | 500 | 500 | funerary_incense (vendeur) |
| `obsidian_shard` — Obsidian Shard | `obsidian` | 0 | 426 | 426 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `airship_part` — Airship Part | `perfected_envoy` | 0 | 250 | 250 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_astralaria` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_caladbolg` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_chuka_and_champawat` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_elegy` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_eordas_grip` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_eureka` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_exordium` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_hope` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_hope_scepter` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_itzels_boon` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_lorekeeper` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_nevermore` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_reaver_of_the_mists` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_shooshadoo` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_tigris` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_xiuquatl` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_argument` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_bite` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_breath` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_claw` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_fang` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_gaze` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_guard` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_insight` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_persuasion` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_reckoning` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_scale` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_tenderness` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_voice` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_weight` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_wisdom` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_wrath` | 0 | 250 | 250 | crystalline_ingot (recette), discounted_shard_of_janthir_syntri (vendeur), discounted_shard_of_lowland_shore (vendeur) +3 autres |
| `ley_line_crystal` — Ley Line Crystal | `perfected_envoy` | 0 | 250 | 250 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `perfected_envoy` | 0 | 250 | 250 | gift_of_gliding (vendeur), gift_of_the_pact (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `legendary_relic` | 0 | 150 | 150 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `legendary_sigil` | 0 | 150 | 150 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `obsidian_shard` — Obsidian Shard | `perfected_envoy` | 0 | 140 | 140 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `legendary_rune` | 0 | 100 | 100 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ardent_glorious` | 0 | 90 | 90 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `perfected_envoy` | 0 | 90 | 90 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `triumphant_hero` | 0 | 90 | 90 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `obsidian_shard` — Obsidian Shard | `ardent_glorious` | 0 | 90 | 90 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `obsidian_shard` — Obsidian Shard | `triumphant_hero` | 0 | 90 | 90 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `mystic_clover` — Mystic Clover | `gen2_claw_of_the_khan_ur` | 0 | 77 | 77 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen2_flames_of_war` | 0 | 77 | 77 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen2_pharus` | 0 | 77 | 77 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen2_sharur` | 0 | 77 | 77 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen2_the_binding_of_ipos` | 0 | 77 | 77 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen2_the_hms_divinity` | 0 | 77 | 77 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen2_the_shining_blade` | 0 | 77 | 77 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen2_verdarach` | 0 | 77 | 77 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `obsidian_shard` — Obsidian Shard | `legendary_sigil` | 0 | 75 | 75 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `obsidian_shard` — Obsidian Shard | `legendary_rune` | 0 | 50 | 50 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurene_s_fang` | 0 | 38 | 38 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurene_s_flight` | 0 | 38 | 38 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurene_s_tail` | 0 | 38 | 38 | draconic_tribute (recette), gift_of_adventure (vendeur), gift_of_relics (recette) +5 autres |

## ALEA DU TREFLE MYSTIQUE — 48 cas

Le trefle explique une partie de l'ecart, pas tout. La colonne donne
ce qui RESTE une fois la part passant par mystic_clover multipliee
par 3,23 : un cout reel que l'arbre ne modelise pas encore, ou un
chiffre a plat trop genereux. Les cas ou le trefle explique tout
(a 5 % pres) sont clos et listes en fin de fichier.

| composant | legendaire | donnee | wiki | reste apres trefle | parents proposes |
|---|---|---:|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ad_infinitum` | 1039 | 352 | +516 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `endless_summer` | 548 | 10 | +516 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_bolt` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_eternity` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_frenzy` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_frostfang` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_howler` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_incinerator` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_kamohoalii_kotaki` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_kraitkin` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_kudzu` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_meteorlogicus` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_quip` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_rodgort` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_sunrise` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_the_bifrost` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_the_dreamer` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_the_flameseeker_prophecies` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_the_juggernaut` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_the_minstrel` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_the_moot` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_the_predator` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_twilight` | 250 | 327 | -248 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |
| `mystic_coin` — Mystic Coin | `aurora` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_astralaria` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_caladbolg` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_chuka_and_champawat` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_elegy` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_eordas_grip` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_eureka` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_exordium` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_hope` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_hope_scepter` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_itzels_boon` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_lorekeeper` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_nevermore` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_reaver_of_the_mists` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_shooshadoo` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_tigris` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `gen2_xiuquatl` | 250 | 327 | -248 | glob_of_coagulated_mists_essence (recette), mystic_clover (recette), mystic_tribute (recette) |
| `obsidian_shard` — Obsidian Shard | `klobjarne_geirr` | 353 | 448 | -180 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `obsidian_shard` — Obsidian Shard | `ad_infinitum` | 339 | 77 | +91 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `obsidian_shard` — Obsidian Shard | `selachimorpha` | 488 | 305 | +61 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `obsidian_shard` — Obsidian Shard | `conflux` | 309 | 197 | -59 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `obsidian_shard` — Obsidian Shard | `the_ascension` | 309 | 197 | -59 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `obsidian_shard` — Obsidian Shard | `transcendence` | 309 | 197 | -59 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `obsidian_shard` — Obsidian Shard | `warbringer` | 309 | 197 | -59 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +8 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `eikasia` | 80 | 18 | +22 | amalgamated_rift_essence (recette), funerary_incense (vendeur), gift_of_fortune (recette) +10 autres |

## CLOS PAR L'ALEA DU TREFLE — 67 cas

La cle a plat et la chaine disent la meme chose des lors qu'on paie le
taux d'echec du trefle. Rien a arbitrer, rien a changer : c'est la
verification que la donnee et le wiki concordent.

| composant | legendaire | donnee | attendu |
|---|---|---:|---:|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `stella_radians` | 2249 | 2248 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `orrax_manifested` | 2170 | 2169 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `klobjarne_geirr` | 1041 | 1023 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `the_ascension` | 499 | 498 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `warbringer` | 499 | 498 |
| `mystic_coin` — Mystic Coin | `coalescence` | 499 | 498 |
| `mystic_coin` — Mystic Coin | `conflux` | 499 | 498 |
| `mystic_coin` — Mystic Coin | `stella_radians` | 499 | 498 |
| `mystic_coin` — Mystic Coin | `transcendence` | 499 | 498 |
| `mystic_coin` — Mystic Coin | `vision` | 499 | 498 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `aetheric_anchor` | 323 | 323 |
| `mystic_coin` — Mystic Coin | `aetheric_anchor` | 323 | 323 |
| `obsidian_shard` — Obsidian Shard | `aetheric_anchor` | 323 | 323 |
| `obsidian_shard` — Obsidian Shard | `endless_summer` | 283 | 282 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `aurora` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_bolt` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_eternity` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_frenzy` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_frostfang` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_howler` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_incinerator` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_kamohoalii_kotaki` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_kraitkin` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_kudzu` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_meteorlogicus` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_quip` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_rodgort` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_sunrise` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_the_bifrost` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_the_dreamer` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_the_flameseeker_prophecies` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_the_juggernaut` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_the_minstrel` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_the_moot` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_the_predator` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen1_twilight` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_argument` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_bite` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_breath` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_claw` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_fang` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_gaze` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_guard` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_insight` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_persuasion` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_reckoning` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_scale` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_tenderness` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_voice` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_weight` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_wisdom` | 250 | 248 |
| `mystic_coin` — Mystic Coin | `gen3_aurenes_wrath` | 250 | 248 |
| `obsidian_shard` — Obsidian Shard | `aurora` | 250 | 248 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `conflux` | 249 | 248 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `transcendence` | 249 | 248 |
| `mystic_coin` — Mystic Coin | `ad_infinitum` | 249 | 248 |
| `mystic_coin` — Mystic Coin | `the_ascension` | 249 | 248 |
| `mystic_coin` — Mystic Coin | `warbringer` | 249 | 248 |
| `obsidian_shard` — Obsidian Shard | `stella_radians` | 249 | 248 |
| `mystic_coin` — Mystic Coin | `orrax_manifested` | 220 | 219 |
| `obsidian_shard` — Obsidian Shard | `orrax_manifested` | 220 | 219 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `selachimorpha` | 178 | 177 |
| `mystic_coin` — Mystic Coin | `selachimorpha` | 178 | 177 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `strife_unending` | 146 | 145 |
| `mystic_coin` — Mystic Coin | `strife_unending` | 146 | 145 |
| `obsidian_shard` — Obsidian Shard | `strife_unending` | 146 | 145 |
| `mystic_coin` — Mystic Coin | `klobjarne_geirr` | 123 | 123 |
