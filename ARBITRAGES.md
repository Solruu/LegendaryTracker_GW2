# Arbitrages de l'arbre de craft

Source : `gw2_sources_v244.json` — 284 desaccords sur 29 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | 84 | 3654 | deja compte par cascade x64, cout vendeur x17, alea du trefle mystique x3 |
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | 7 | 1140 | ecart de compte x4, deja compte par cascade x3 |
| `trade_contract` — Trade Contract | 2 | 950 | ecart de compte x1, cout vendeur x1 |
| `dust_crystalline` — Pile of Crystalline Dust | 13 | 850 | deja compte par cascade x12, ecart de compte x1 |
| `skirmish_claim_ticket` — WvW Skirmish Claim Ticket | 1 | 700 | deja compte par cascade x1 |
| `elegy_mosaic` — Elegy Mosaic | 1 | 450 | ecart de compte x1 |
| `obsidian_shard` — Obsidian Shard | 85 | 426 | deja compte par cascade x59, cout vendeur x19, alea du trefle mystique x7 |
| `dust_incandescent` — Pile of Incandescent Dust | 3 | 250 | deja compte par cascade x3 |
| `orichalcum_ingot` — Orichalcum Ingot | 2 | 250 | deja compte par cascade x2 |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | 1 | 250 | deja compte par cascade x1 |
| `airship_part` — Airship Part | 12 | 200 | deja compte par cascade x12 |
| `ley_line_crystal` — Ley Line Crystal | 12 | 200 | deja compte par cascade x12 |
| `lump_of_aurillium` — Lump of Aurillium | 12 | 200 | deja compte par cascade x12 |
| `mystic_coin` — Mystic Coin | 30 | 173 | deja compte par cascade x30 |
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

## ECART DE COMPTE — 7 cas

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

## DEJA COMPTE PAR CASCADE — 226 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

Les 60 plus gros ecarts sur 226. Le reste se
recalcule en relancant le script.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `stella_radians` | 2000 | 77 | 1923 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `orrax_manifested` | 150 | 1868 | 1718 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `obsidian` | 1500 | 360 | 1140 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `klobjarne_geirr` | 850 | 1800 | 950 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `aetheric_anchor` | 800 | 1650 | 850 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `skirmish_claim_ticket` — WvW Skirmish Claim Ticket | `warbringer` | 875 | 1575 | 700 | generals_wings_of_war (table), recruits_wings_of_war (table), soldiers_wings_of_war (table) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `vision` | 768 | 177 | 591 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_meteorlogicus` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_flameseeker_prophecies` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `klobjarne_geirr` | 300 | 638 | 338 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_bifrost` | 250 | 500 | 250 | opal_orb (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_minstrel` | 250 | 500 | 250 | opal_orb (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `klobjarne_geirr` | 250 | 500 | 250 | neutralized_titan_alloy (recette) |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | `conflux` | 250 | 500 | 250 | essence_of_animosity (recette) |
| `obsidian_shard` — Obsidian Shard | `endless_summer` | 250 | 10 | 240 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `airship_part` — Airship Part | `gen2_astralaria` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_caladbolg` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_chuka_and_champawat` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_elegy` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_eordas_grip` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_hope` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_hope_scepter` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_itzels_boon` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_lorekeeper` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_nevermore` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_reaver_of_the_mists` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `airship_part` — Airship Part | `gen2_tigris` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_astralaria` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_caladbolg` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_chuka_and_champawat` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_elegy` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_eordas_grip` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_hope` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_hope_scepter` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_itzels_boon` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_lorekeeper` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_nevermore` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_reaver_of_the_mists` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_tigris` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_astralaria` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_caladbolg` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_chuka_and_champawat` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_elegy` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_eordas_grip` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_hope` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_hope_scepter` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_itzels_boon` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_lorekeeper` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_nevermore` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_reaver_of_the_mists` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_tigris` | 500 | 300 | 200 | gift_of_gliding (vendeur) |
| `obsidian_shard` — Obsidian Shard | `selachimorpha` | 250 | 55 | 195 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `vision` | 180 | 360 | 180 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_bolt` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_eternity` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_frenzy` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_frostfang` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_howler` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen1_incinerator` | 250 | 77 | 173 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |

## COUT VENDEUR — 41 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `obsidian` | 0 | 3654 | 3654 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `trade_contract` — Trade Contract | `vision` | 0 | 500 | 500 | funerary_incense (vendeur) |
| `obsidian_shard` — Obsidian Shard | `obsidian` | 0 | 426 | 426 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `perfected_envoy` | 0 | 140 | 140 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ardent_glorious` | 0 | 90 | 90 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `perfected_envoy` | 0 | 90 | 90 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `triumphant_hero` | 0 | 90 | 90 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `mystic_clover` — Mystic Clover | `obsidian` | 0 | 90 | 90 | gift_of_prosperity (table), gift_of_the_side_course (recette) |
| `obsidian_shard` — Obsidian Shard | `ardent_glorious` | 0 | 90 | 90 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `triumphant_hero` | 0 | 90 | 90 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_claw_of_the_khan_ur` | 0 | 77 | 77 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_flames_of_war` | 0 | 77 | 77 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_pharus` | 0 | 77 | 77 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_sharur` | 0 | 77 | 77 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_the_binding_of_ipos` | 0 | 77 | 77 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_the_hms_divinity` | 0 | 77 | 77 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_the_shining_blade` | 0 | 77 | 77 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_verdarach` | 0 | 77 | 77 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `obsidian_shard` — Obsidian Shard | `gen2_claw_of_the_khan_ur` | 0 | 77 | 77 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen2_flames_of_war` | 0 | 77 | 77 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen2_pharus` | 0 | 77 | 77 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen2_sharur` | 0 | 77 | 77 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen2_the_binding_of_ipos` | 0 | 77 | 77 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen2_the_hms_divinity` | 0 | 77 | 77 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen2_the_shining_blade` | 0 | 77 | 77 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen2_verdarach` | 0 | 77 | 77 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurene_s_fang` | 0 | 38 | 38 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurene_s_flight` | 0 | 38 | 38 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurene_s_tail` | 0 | 38 | 38 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurene_s_wing` | 0 | 38 | 38 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_rending` | 0 | 38 | 38 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `obsidian_shard` — Obsidian Shard | `gen3_aurene_s_fang` | 0 | 38 | 38 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen3_aurene_s_flight` | 0 | 38 | 38 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen3_aurene_s_tail` | 0 | 38 | 38 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen3_aurene_s_wing` | 0 | 38 | 38 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `gen3_aurenes_rending` | 0 | 38 | 38 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `legendary_relic` | 0 | 25 | 25 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `eikasia` | 0 | 18 | 18 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `mystic_clover` — Mystic Clover | `perfected_envoy` | 0 | 15 | 15 | gift_of_prosperity (table), gift_of_the_side_course (recette) |
| `vision_crystal` — Vision Crystal | `selachimorpha` | 0 | 2 | 2 | gift_of_adventure (vendeur), unbound_wings (recette) |
| `vision_crystal` — Vision Crystal | `ad_infinitum` | 0 | 1 | 1 | gift_of_adventure (vendeur), unbound_wings (recette) |

## ALEA DU TREFLE MYSTIQUE — 10 cas

Le trefle explique une partie de l'ecart, pas tout. La colonne donne
ce qui RESTE une fois la part passant par mystic_clover multipliee
par 3,23 : un cout reel que l'arbre ne modelise pas encore, ou un
chiffre a plat trop genereux. Les cas ou le trefle explique tout
(a 5 % pres) sont clos et listes en fin de fichier.

| composant | legendaire | donnee | wiki | reste apres trefle | parents proposes |
|---|---|---:|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `endless_summer` | 548 | 10 | +516 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `aetheric_anchor` | 323 | 200 | -322 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |
| `obsidian_shard` — Obsidian Shard | `aetheric_anchor` | 323 | 200 | -322 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `klobjarne_geirr` | 353 | 448 | -180 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `ad_infinitum` | 339 | 77 | +91 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `conflux` | 309 | 197 | -59 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `the_ascension` | 309 | 197 | -59 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `transcendence` | 309 | 197 | -59 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `obsidian_shard` — Obsidian Shard | `warbringer` | 309 | 197 | -59 | bloodstone_brick (recette), dragonite_ingot (recette), empyreal_star (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `eikasia` | 80 | 18 | +22 | amalgamated_rift_essence (recette), funerary_incense (vendeur), mystic_clover (recette) +2 autres |

## CLOS PAR L'ALEA DU TREFLE — 9 cas

La cle a plat et la chaine disent la meme chose des lors qu'on paie le
taux d'echec du trefle. Rien a arbitrer, rien a changer : c'est la
verification que la donnee et le wiki concordent.

| composant | legendaire | donnee | attendu |
|---|---|---:|---:|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `aurora` | 250 | 248 |
| `obsidian_shard` — Obsidian Shard | `aurora` | 250 | 248 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `conflux` | 249 | 248 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `transcendence` | 249 | 248 |
| `obsidian_shard` — Obsidian Shard | `stella_radians` | 249 | 248 |
| `obsidian_shard` — Obsidian Shard | `orrax_manifested` | 220 | 219 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `selachimorpha` | 178 | 177 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `strife_unending` | 146 | 145 |
| `obsidian_shard` — Obsidian Shard | `strife_unending` | 146 | 145 |
