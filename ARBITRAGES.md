# Arbitrages de l'arbre de craft

Source : `gw2_sources_v248.json` — 136 desaccords sur 28 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | 6 | 3600 | deja compte par cascade x5, cout vendeur x1 |
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | 7 | 1140 | ecart de compte x4, deja compte par cascade x3 |
| `trade_contract` — Trade Contract | 2 | 950 | ecart de compte x1, cout vendeur x1 |
| `dust_crystalline` — Pile of Crystalline Dust | 13 | 850 | deja compte par cascade x12, ecart de compte x1 |
| `skirmish_claim_ticket` — WvW Skirmish Claim Ticket | 1 | 700 | deja compte par cascade x1 |
| `elegy_mosaic` — Elegy Mosaic | 1 | 450 | ecart de compte x1 |
| `obsidian_shard` — Obsidian Shard | 9 | 372 | ecart de compte x5, cout vendeur x2, deja compte par cascade x2 |
| `dust_incandescent` — Pile of Incandescent Dust | 3 | 250 | deja compte par cascade x3 |
| `orichalcum_ingot` — Orichalcum Ingot | 2 | 250 | deja compte par cascade x2 |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | 1 | 250 | deja compte par cascade x1 |
| `airship_part` — Airship Part | 24 | 200 | deja compte par cascade x24 |
| `ley_line_crystal` — Ley Line Crystal | 24 | 200 | deja compte par cascade x24 |
| `lump_of_aurillium` — Lump of Aurillium | 24 | 200 | deja compte par cascade x24 |
| `branded_mass` — Branded Mass | 1 | 160 | deja compte par cascade x1 |
| `darksteel_ingot` — Darksteel Ingot | 1 | 110 | deja compte par cascade x1 |
| `mystic_clover` — Mystic Clover | 3 | 90 | cout vendeur x2, deja compte par cascade x1 |
| `pvp_league_ticket` — PvP League Ticket | 1 | 75 | deja compte par cascade x1 |
| `vision_crystal` — Vision Crystal | 2 | 2 | cout vendeur x2 |
| `gift_of_battle` — Gift of Battle | 1 | 1 | deja compte par cascade x1 |
| `amalgamated_gemstone` — Amalgamated Gemstone | 2 | 0 | deja compte par cascade x2 |
| `exquisite_serpentite_jewel` — Exquisite Serpentite Jewel | 1 | 0 | deja compte par cascade x1 |
| `gift_of_bones` — Gift of Bones | 1 | 0 | deja compte par cascade x1 |
| `inscribed_shard` — Inscribed Shard | 1 | 0 | deja compte par cascade x1 |
| `shard_of_bava_nisos` — Shard of Bava Nisos | 1 | 0 | deja compte par cascade x1 |
| `shard_of_mistburned_barrens` — Shard of Mistburned Barrens | 1 | 0 | deja compte par cascade x1 |
| `shard_of_the_dark_arts` — Shard of the Dark Arts | 1 | 0 | deja compte par cascade x1 |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | 1 | 0 | deja compte par cascade x1 |

## ECART DE COMPTE — 12 cas

La cle a plat et l'arete donnent deux nombres differents : l'un des deux
est faux. Se tranche sur la page du PARENT, boite Recipe.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `trade_contract` — Trade Contract | `coalescence` | 300 | 1250 | 950 | funerary_incense (vendeur) |
| `elegy_mosaic` — Elegy Mosaic | `coalescence` | 300 | 750 | 450 | funerary_incense (vendeur) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `conflux` | 300 | 600 | 300 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `the_ascension` | 300 | 600 | 300 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `transcendence` | 300 | 600 | 300 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `warbringer` | 300 | 600 | 300 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `orrax_manifested` | 100 | 350 | 250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `conflux` | 309 | 120 | 189 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +3 autres |
| `obsidian_shard` — Obsidian Shard | `the_ascension` | 309 | 120 | 189 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +3 autres |
| `obsidian_shard` — Obsidian Shard | `transcendence` | 309 | 120 | 189 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +3 autres |
| `obsidian_shard` — Obsidian Shard | `warbringer` | 309 | 120 | 189 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +3 autres |
| `obsidian_shard` — Obsidian Shard | `klobjarne_geirr` | 353 | 410 | 57 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +3 autres |

## DEJA COMPTE PAR CASCADE — 116 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

Les 60 plus gros ecarts sur 116. Le reste se
recalcule en relancant le script.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `orrax_manifested` | 150.0 | 1800 | 1650.0 | amalgamated_rift_essence (recette), funerary_incense (vendeur), unbound_wings (recette) +1 autres |
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `obsidian` | 1500 | 360 | 1140 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `klobjarne_geirr` | 850 | 1800 | 950 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `aetheric_anchor` | 800 | 1650 | 850 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `skirmish_claim_ticket` — WvW Skirmish Claim Ticket | `warbringer` | 875 | 1575 | 700 | generals_wings_of_war (table), recruits_wings_of_war (table), soldiers_wings_of_war (table) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `vision` | 768.0 | 100 | 668.0 | amalgamated_rift_essence (recette), funerary_incense (vendeur), unbound_wings (recette) +1 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_meteorlogicus` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_flameseeker_prophecies` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `klobjarne_geirr` | 300.0 | 600 | 300.0 | amalgamated_rift_essence (recette), funerary_incense (vendeur), unbound_wings (recette) +1 autres |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_bifrost` | 250 | 500 | 250 | opal_orb (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_minstrel` | 250 | 500 | 250 | opal_orb (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `klobjarne_geirr` | 250 | 500 | 250 | neutralized_titan_alloy (recette) |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | `conflux` | 250 | 500 | 250 | essence_of_animosity (recette) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ad_infinitum` | 250.0 | 25 | 225.0 | amalgamated_rift_essence (recette), funerary_incense (vendeur), unbound_wings (recette) +1 autres |
| `airship_part` — Airship Part | `gen2_astralaria` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_caladbolg` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_chuka_and_champawat` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_claw_of_the_khan_ur` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_elegy` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_eordas_grip` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_eureka` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_exordium` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_flames_of_war` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_hope` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_hope_scepter` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_itzels_boon` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_lorekeeper` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_nevermore` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_pharus` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_reaver_of_the_mists` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_sharur` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_shooshadoo` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_the_binding_of_ipos` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_the_hms_divinity` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_the_shining_blade` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_tigris` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_verdarach` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_xiuquatl` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_astralaria` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_caladbolg` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_chuka_and_champawat` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_claw_of_the_khan_ur` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_elegy` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_eordas_grip` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_eureka` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_exordium` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_flames_of_war` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_hope` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_hope_scepter` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_itzels_boon` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_lorekeeper` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_nevermore` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_pharus` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_reaver_of_the_mists` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_sharur` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_shooshadoo` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_the_binding_of_ipos` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_the_hms_divinity` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_the_shining_blade` | 500 | 300 | 200 | gift_of_gliding (vendeur) |

## COUT VENDEUR — 8 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `obsidian` | 0 | 3600 | 3600 | amalgamated_rift_essence (recette), funerary_incense (vendeur), unbound_wings (recette) +1 autres |
| `trade_contract` — Trade Contract | `vision` | 0 | 500 | 500 | funerary_incense (vendeur) |
| `obsidian_shard` — Obsidian Shard | `obsidian` | 0 | 372 | 372 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +3 autres |
| `mystic_clover` — Mystic Clover | `obsidian` | 0 | 90 | 90 | gift_of_prosperity (table), gift_of_the_side_course (recette) |
| `obsidian_shard` — Obsidian Shard | `perfected_envoy` | 0 | 50 | 50 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +3 autres |
| `mystic_clover` — Mystic Clover | `perfected_envoy` | 0 | 15 | 15 | gift_of_prosperity (table), gift_of_the_side_course (recette) |
| `vision_crystal` — Vision Crystal | `selachimorpha` | 0 | 2 | 2 | gift_of_adventure (vendeur), unbound_wings (recette) |
| `vision_crystal` — Vision Crystal | `ad_infinitum` | 0 | 1 | 1 | gift_of_adventure (vendeur), unbound_wings (recette) |
