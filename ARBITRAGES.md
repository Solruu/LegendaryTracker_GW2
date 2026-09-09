# Arbitrages de l'arbre de craft

Source : `gw2_sources_v261.json` — 93 desaccords sur 26 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | 3 | 1650 | deja compte par cascade x3 |
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `dust_crystalline` — Pile of Crystalline Dust | 13 | 1250 | deja compte par cascade x12, ecart de compte x1 |
| `trade_contract` — Trade Contract | 2 | 1250 | cout vendeur x2 |
| `crystalline_ingot` — Crystalline Ingot | 2 | 250 | cout vendeur x2 |
| `dust_incandescent` — Pile of Incandescent Dust | 3 | 250 | deja compte par cascade x3 |
| `orichalcum_ingot` — Orichalcum Ingot | 2 | 250 | deja compte par cascade x2 |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | 1 | 250 | deja compte par cascade x1 |
| `obsidian_shard` — Obsidian Shard | 1 | 228 | deja compte par cascade x1 |
| `magnetite_shard` — Magnetite Shard | 1 | 200 | cout vendeur x1 |
| `branded_mass` — Branded Mass | 1 | 160 | deja compte par cascade x1 |
| `darksteel_ingot` — Darksteel Ingot | 1 | 110 | deja compte par cascade x1 |
| `mystic_clover` — Mystic Clover | 3 | 90 | cout vendeur x2, deja compte par cascade x1 |
| `pvp_league_ticket` — PvP League Ticket | 1 | 75 | deja compte par cascade x1 |
| `vision_crystal` — Vision Crystal | 2 | 2 | cout vendeur x2 |
| `gift_of_battle` — Gift of Battle | 1 | 1 | deja compte par cascade x1 |
| `airship_part` — Airship Part | 16 | 0 | deja compte par cascade x16 |
| `exquisite_serpentite_jewel` — Exquisite Serpentite Jewel | 1 | 0 | deja compte par cascade x1 |
| `gift_of_bones` — Gift of Bones | 1 | 0 | deja compte par cascade x1 |
| `inscribed_shard` — Inscribed Shard | 1 | 0 | deja compte par cascade x1 |
| `ley_line_crystal` — Ley Line Crystal | 16 | 0 | deja compte par cascade x16 |
| `lump_of_aurillium` — Lump of Aurillium | 16 | 0 | deja compte par cascade x16 |
| `shard_of_bava_nisos` — Shard of Bava Nisos | 1 | 0 | deja compte par cascade x1 |
| `shard_of_mistburned_barrens` — Shard of Mistburned Barrens | 1 | 0 | deja compte par cascade x1 |
| `shard_of_the_dark_arts` — Shard of the Dark Arts | 1 | 0 | deja compte par cascade x1 |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | 1 | 0 | deja compte par cascade x1 |

## ECART DE COMPTE — 1 cas

La cle a plat et l'arete donnent deux nombres differents : l'un des deux
est faux. Se tranche sur la page du PARENT, boite Recipe.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `dust_crystalline` — Pile of Crystalline Dust | `orrax_manifested` | 100 | 350 | 250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |

## DEJA COMPTE PAR CASCADE — 83 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

Les 60 plus gros ecarts sur 83. Le reste se
recalcule en relancant le script.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `glob_of_ectoplasm` — Glob of Ectoplasm | `orrax_manifested` | 150 | 1800 | 1650 | amalgamated_rift_essence (recette), unbound_wings (recette), vial_of_titan_melted_obsidian (recette) |
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `dust_crystalline` — Pile of Crystalline Dust | `aetheric_anchor` | 400 | 1650 | 1250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_meteorlogicus` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_flameseeker_prophecies` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `klobjarne_geirr` | 300 | 600 | 300 | amalgamated_rift_essence (recette), unbound_wings (recette), vial_of_titan_melted_obsidian (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_bifrost` | 250 | 500 | 250 | opal_orb (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_minstrel` | 250 | 500 | 250 | opal_orb (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `klobjarne_geirr` | 250 | 500 | 250 | neutralized_titan_alloy (recette) |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | `conflux` | 250 | 500 | 250 | essence_of_animosity (recette) |
| `obsidian_shard` — Obsidian Shard | `obsidian` | 72 | 300 | 228 | gift_of_expertise (recette), gift_of_prowess (recette) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ad_infinitum` | 250 | 25 | 225 | amalgamated_rift_essence (recette), unbound_wings (recette), vial_of_titan_melted_obsidian (recette) |
| `branded_mass` — Branded Mass | `vision` | 460 | 300 | 160 | diviners_orichalcum_imbued_inscription (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_bolt` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_sunrise` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_predator` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_twilight` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `darksteel_ingot` — Darksteel Ingot | `klobjarne_geirr` | 250 | 360 | 110 | deldrimor_steel_ingot (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_juggernaut` | 250 | 150 | 100 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `pvp_league_ticket` — PvP League Ticket | `the_ascension` | 25 | 100 | 75 | wings_of_glory_champion (table), wings_of_glory_elite (table), wings_of_glory_recruit (table) +1 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_frenzy` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_frostfang` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_incinerator` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_rodgort` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `mystic_clover` — Mystic Clover | `orrax_manifested` | 38 | 30 | 8 | gift_of_prosperity (table), gift_of_the_side_course (recette) |
| `gift_of_battle` — Gift of Battle | `strife_unending` | 2 | 3 | 1 | gift_of_war_prosperity (recette) |
| `airship_part` — Airship Part | `gen2_astralaria` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_chuka_and_champawat` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_claw_of_the_khan_ur` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_eureka` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_exordium` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_flames_of_war` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_hope` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_nevermore` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_pharus` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_sharur` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_shooshadoo` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_the_binding_of_ipos` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_the_hms_divinity` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_the_shining_blade` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_verdarach` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `airship_part` — Airship Part | `gen2_xiuquatl` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_itzel (vendeur) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_dreamer` | 500 | 500 | 0 | opal_orb (recette) |
| `exquisite_serpentite_jewel` — Exquisite Serpentite Jewel | `vision` | 18 | 18 | 0 | diviners_orichalcum_imbued_inscription (recette) |
| `gift_of_bones` — Gift of Bones | `klobjarne_geirr` | 1 | 1 | 0 | gift_of_recollector_of_memories (recette) |
| `inscribed_shard` — Inscribed Shard | `vision` | 100 | 100 | 0 | lacquered_banner_pole (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_astralaria` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_chuka_and_champawat` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_claw_of_the_khan_ur` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_eureka` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_exordium` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_flames_of_war` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_hope` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_nevermore` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_pharus` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_sharur` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_shooshadoo` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_the_binding_of_ipos` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_the_hms_divinity` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |
| `ley_line_crystal` — Ley Line Crystal | `gen2_the_shining_blade` | 800 | 800 | 0 | gift_of_gliding (vendeur), gift_of_the_nuhoch (vendeur) |

## COUT VENDEUR — 9 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `trade_contract` — Trade Contract | `coalescence` | 0 | 1250 | 1250 | funerary_incense (vendeur) |
| `trade_contract` — Trade Contract | `vision` | 0 | 500 | 500 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `coalescence` | 0 | 250 | 250 | funerary_incense (vendeur) |
| `magnetite_shard` — Magnetite Shard | `coalescence` | 0 | 200 | 200 | gift_of_complex_emotions (vendeur), gift_of_patience (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `vision` | 0 | 100 | 100 | funerary_incense (vendeur) |
| `mystic_clover` — Mystic Clover | `obsidian` | 0 | 90 | 90 | gift_of_prosperity (table), gift_of_the_side_course (recette) |
| `mystic_clover` — Mystic Clover | `perfected_envoy` | 0 | 15 | 15 | gift_of_prosperity (table), gift_of_the_side_course (recette) |
| `vision_crystal` — Vision Crystal | `selachimorpha` | 0 | 2 | 2 | gift_of_adventure (vendeur), unbound_wings (recette) |
| `vision_crystal` — Vision Crystal | `ad_infinitum` | 0 | 1 | 1 | gift_of_adventure (vendeur), unbound_wings (recette) |
