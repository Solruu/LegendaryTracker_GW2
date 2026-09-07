# Arbitrages de l'arbre de craft

Source : `gw2_sources_v229.json` — 181 desaccords sur 26 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `unusual_coin` — Unusual Coin | 2 | 50000 | cout vendeur x2 |
| `curious_mursaat_remnants` — Curious Mursaat Remnants | 2 | 18100 | ecart de compte x1, cout vendeur x1 |
| `curious_mursaat_ruin_shard` — Curious Mursaat Ruin Shard | 2 | 9175 | ecart de compte x1, cout vendeur x1 |
| `chromatic_sap` — Chromatic Sap | 1 | 5000 | cout vendeur x1 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | 47 | 3720 | deja compte par cascade x28, ecart de compte x13, cout vendeur x6 |
| `research_note` — Research Note | 1 | 2500 | ecart de compte x1 |
| `aether_rich_sap` — Aether-Rich Sap | 3 | 2000 | ecart de compte x3 |
| `antiquated_ducat` — Antiquated Ducat | 3 | 2000 | ecart de compte x3 |
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `dust_crystalline` — Pile of Crystalline Dust | 13 | 1250 | deja compte par cascade x12, ecart de compte x1 |
| `amalgamated_gemstone` — Amalgamated Gemstone | 43 | 500 | cout vendeur x41, ecart de compte x2 |
| `mursaat_obsidian_chunk` — Mursaat Obsidian Chunk | 2 | 375 | cout vendeur x1, ecart de compte x1 |
| `titan_heatstone` — Titan Heatstone | 2 | 375 | cout vendeur x1, ecart de compte x1 |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | 1 | 360 | ecart de compte x1 |
| `obsidian_shard` — Obsidian Shard | 3 | 303 | ecart de compte x3 |
| `ancient_coin` — Ancient Coin | 1 | 250 | ecart de compte x1 |
| `dust_incandescent` — Pile of Incandescent Dust | 2 | 250 | deja compte par cascade x2 |
| `orichalcum_ingot` — Orichalcum Ingot | 2 | 250 | deja compte par cascade x2 |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | 1 | 250 | deja compte par cascade x1 |
| `mystic_coin` — Mystic Coin | 5 | 249 | ecart de compte x5 |
| `curious_mursaat_currency` — Curious Mursaat Currency | 1 | 175 | ecart de compte x1 |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | 1 | 100 | deja compte par cascade x1 |
| `emblem_of_the_conqueror` — Emblem of the Conqueror | 1 | 99 | ecart de compte x1 |
| `mystic_clover` — Mystic Clover | 17 | 39 | ecart de compte x17 |
| `bloodstone_shard` — Bloodstone Shard | 12 | 0 | deja compte par cascade x12 |
| `crystalline_ingot` — Crystalline Ingot | 12 | 0 | deja compte par cascade x12 |

## ECART DE COMPTE — 56 cas

La cle a plat et l'arete donnent deux nombres differents : l'un des deux
est faux. Se tranche sur la page du PARENT, boite Recipe.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `curious_mursaat_remnants` — Curious Mursaat Remnants | `orrax_manifested` | 725 | 18825 | 18100 | curious_mursaat_currency (vendeur), curious_mursaat_ruin_shard (vendeur), mists_gate_residue (vendeur) +3 autres |
| `curious_mursaat_ruin_shard` — Curious Mursaat Ruin Shard | `orrax_manifested` | 125 | 9300 | 9175 | curious_mursaat_currency (vendeur), mursaat_obsidian_chunk (vendeur), shard_of_mistburned_barrens (vendeur) +1 autres |
| `research_note` — Research Note | `stella_radians` | 52500 | 50000 | 2500 | seer_runestone (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `orrax_manifested` | 2170 | 150 | 2020 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `aether_rich_sap` — Aether-Rich Sap | `aetheric_anchor` | 500 | 2500 | 2000 | chromatic_sap (vendeur) |
| `aether_rich_sap` — Aether-Rich Sap | `endless_summer` | 500 | 2500 | 2000 | chromatic_sap (vendeur) |
| `aether_rich_sap` — Aether-Rich Sap | `selachimorpha` | 500 | 2500 | 2000 | chromatic_sap (vendeur) |
| `antiquated_ducat` — Antiquated Ducat | `aetheric_anchor` | 500 | 2500 | 2000 | raw_enchanting_stone (vendeur) |
| `antiquated_ducat` — Antiquated Ducat | `endless_summer` | 500 | 2500 | 2000 | raw_enchanting_stone (vendeur) |
| `antiquated_ducat` — Antiquated Ducat | `selachimorpha` | 500 | 2500 | 2000 | raw_enchanting_stone (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ad_infinitum` | 1039 | 250 | 789 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `endless_summer` | 548 | 10 | 538 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `mursaat_obsidian_chunk` — Mursaat Obsidian Chunk | `orrax_manifested` | 750 | 375 | 375 | curious_mursaat_currency (vendeur), curious_mursaat_ruin_shard (vendeur) |
| `titan_heatstone` — Titan Heatstone | `orrax_manifested` | 750 | 375 | 375 | curious_mursaat_currency (vendeur), curious_mursaat_ruin_shard (vendeur) |
| `thermocatalytic_reagent` — Thermocatalytic Reagent | `vision` | 540 | 180 | 360 | lump_of_mithrillium (recette) |
| `amalgamated_gemstone` — Amalgamated Gemstone | `klobjarne_geirr` | 275 | 600 | 325 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `aetheric_anchor` | 323 | 11 | 312 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `obsidian_shard` — Obsidian Shard | `klobjarne_geirr` | 353 | 50 | 303 | gift_of_castoran_mastery (recette), gift_of_expertise (recette), gift_of_infused_gems (recette) |
| `ancient_coin` — Ancient Coin | `klobjarne_geirr` | 20250 | 20000 | 250 | mursaat_runestone (vendeur) |
| `dust_crystalline` — Pile of Crystalline Dust | `orrax_manifested` | 100 | 350 | 250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `aurora` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `the_ascension` | 499 | 250 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `warbringer` | 499 | 250 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `mystic_coin` — Mystic Coin | `coalescence` | 499 | 250 | 249 | mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `conflux` | 499 | 250 | 249 | mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `stella_radians` | 499 | 250 | 249 | mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `transcendence` | 499 | 250 | 249 | mystic_tribute (recette) |
| `mystic_coin` — Mystic Coin | `vision` | 499 | 250 | 249 | mystic_tribute (recette) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `conflux` | 249 | 1 | 248 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `transcendence` | 249 | 1 | 248 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `stella_radians` | 2249 | 2010 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `obsidian_shard` — Obsidian Shard | `selachimorpha` | 488 | 250 | 238 | gift_of_castoran_mastery (recette), gift_of_expertise (recette), gift_of_infused_gems (recette) |
| `amalgamated_gemstone` — Amalgamated Gemstone | `orrax_manifested` | 200 | 400 | 200 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `curious_mursaat_currency` — Curious Mursaat Currency | `klobjarne_geirr` | 125 | 300 | 175 | shard_of_janthir_syntri (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `strife_unending` | 146 | 2 | 144 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `klobjarne_geirr` | 1041 | 928 | 113 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `emblem_of_the_conqueror` — Emblem of the Conqueror | `conflux` | 100 | 1 | 99 | war_commendation (recette) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `eikasia` | 80 | 40 | 40 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_argument` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_bite` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_breath` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_claw` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_fang` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_gaze` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_guard` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_insight` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_persuasion` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_reckoning` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_scale` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_tenderness` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_voice` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_weight` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_wisdom` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `mystic_clover` — Mystic Clover | `gen3_aurenes_wrath` | 77 | 38 | 39 | draconic_tribute (recette), mystic_tribute (recette) |
| `obsidian_shard` — Obsidian Shard | `endless_summer` | 283 | 250 | 33 | gift_of_castoran_mastery (recette), gift_of_expertise (recette), gift_of_infused_gems (recette) |
| `mystic_clover` — Mystic Clover | `orrax_manifested` | 68 | 38 | 30 | draconic_tribute (recette), mystic_tribute (recette) |

## DEJA COMPTE PAR CASCADE — 71 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `dust_crystalline` — Pile of Crystalline Dust | `aetheric_anchor` | 400 | 1650 | 1250 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `vision` | 768 | 1 | 767 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_eureka` | 500 | 1 | 499 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_exordium` | 500 | 1 | 499 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_shooshadoo` | 500 | 1 | 499 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_xiuquatl` | 500 | 1 | 499 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_meteorlogicus` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_flameseeker_prophecies` | 500 | 100 | 400 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_bifrost` | 250 | 500 | 250 | chrysocola_orb (recette), opal_orb (recette) |
| `dust_incandescent` — Pile of Incandescent Dust | `gen1_the_minstrel` | 250 | 500 | 250 | chrysocola_orb (recette), opal_orb (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `klobjarne_geirr` | 250 | 500 | 250 | neutralized_titan_alloy (recette) |
| `testimony_of_jade_heroics` — Testimony of Jade Heroics | `conflux` | 250 | 500 | 250 | essence_of_animosity (recette) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_astralaria` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_chuka_and_champawat` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_claw_of_the_khan_ur` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_flames_of_war` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_hope` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_nevermore` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_pharus` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_sharur` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_the_binding_of_ipos` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_the_hms_divinity` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_the_shining_blade` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen2_verdarach` | 250 | 1 | 249 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_argument` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_bite` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_breath` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_claw` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_gaze` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_insight` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_persuasion` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_scale` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_voice` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_weight` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_wisdom` | 250 | 11 | 239 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_bolt` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_sunrise` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_predator` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_twilight` | 250 | 100 | 150 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_the_juggernaut` | 250 | 150 | 100 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `vial_of_titan_melted_obsidian` — Vial of Titan Melted Liquid Obsidian | `orrax_manifested` | 150 | 50 | 100 | mists_gate_residue (vendeur) |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_frenzy` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_frostfang` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_incinerator` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `dust_crystalline` — Pile of Crystalline Dust | `gen1_rodgort` | 250 | 200 | 50 | charged_lodestone (recette), corrupted_lodestone (recette), crystal_lodestone (recette) +4 autres |
| `bloodstone_shard` — Bloodstone Shard | `gen2_claw_of_the_khan_ur` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_eureka` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_exordium` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_flames_of_war` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_pharus` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_sharur` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_shooshadoo` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_the_binding_of_ipos` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_the_hms_divinity` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_the_shining_blade` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_verdarach` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `bloodstone_shard` — Bloodstone Shard | `gen2_xiuquatl` | 1 | 1 | 0 | gift_of_infused_gems (recette), gift_of_jade_mastery (recette), gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_claw_of_the_khan_ur` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_eureka` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_exordium` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_flames_of_war` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_pharus` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_sharur` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_shooshadoo` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_the_binding_of_ipos` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_the_hms_divinity` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_the_shining_blade` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_verdarach` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `crystalline_ingot` — Crystalline Ingot | `gen2_xiuquatl` | 250 | 250 | 0 | gift_of_maguuma_mastery (recette) |
| `orichalcum_ingot` — Orichalcum Ingot | `orrax_manifested` | 250 | 250 | 0 | neutralized_titan_alloy (recette) |

## COUT VENDEUR — 54 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `unusual_coin` — Unusual Coin | `orrax_manifested` | 0 | 50000 | 50000 | ancient_coin (vendeur) |
| `unusual_coin` — Unusual Coin | `klobjarne_geirr` | 0 | 20250 | 20250 | ancient_coin (vendeur) |
| `chromatic_sap` — Chromatic Sap | `stella_radians` | 0 | 5000 | 5000 | shadowstone_fragment (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `obsidian` | 0 | 3720 | 3720 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_eureka` | 0 | 500 | 500 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_exordium` | 0 | 500 | 500 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_shooshadoo` | 0 | 500 | 500 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_xiuquatl` | 0 | 500 | 500 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `mursaat_obsidian_chunk` — Mursaat Obsidian Chunk | `klobjarne_geirr` | 0 | 375 | 375 | curious_mursaat_currency (vendeur), curious_mursaat_ruin_shard (vendeur) |
| `titan_heatstone` — Titan Heatstone | `klobjarne_geirr` | 0 | 375 | 375 | curious_mursaat_currency (vendeur), curious_mursaat_ruin_shard (vendeur) |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_astralaria` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_caladbolg` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_chuka_and_champawat` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_claw_of_the_khan_ur` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_elegy` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_eordas_grip` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_flames_of_war` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_hope` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_hope_scepter` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_itzels_boon` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_lorekeeper` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_nevermore` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_pharus` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_reaver_of_the_mists` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_sharur` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_the_binding_of_ipos` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_the_hms_divinity` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_the_shining_blade` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_tigris` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen2_verdarach` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_argument` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_bite` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_breath` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_claw` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_fang` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_gaze` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_guard` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_insight` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_persuasion` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_reckoning` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_scale` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_tenderness` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_voice` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_weight` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_wisdom` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `gen3_aurenes_wrath` | 0 | 250 | 250 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
| `curious_mursaat_remnants` — Curious Mursaat Remnants | `klobjarne_geirr` | 0 | 125 | 125 | curious_mursaat_currency (vendeur), curious_mursaat_ruin_shard (vendeur), mists_gate_residue (vendeur) +3 autres |
| `curious_mursaat_ruin_shard` — Curious Mursaat Ruin Shard | `klobjarne_geirr` | 0 | 125 | 125 | curious_mursaat_currency (vendeur), mursaat_obsidian_chunk (vendeur), shard_of_mistburned_barrens (vendeur) +1 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurene_s_fang` | 0 | 11 | 11 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurene_s_flight` | 0 | 11 | 11 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurene_s_tail` | 0 | 11 | 11 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurene_s_wing` | 0 | 11 | 11 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `gen3_aurenes_rending` | 0 | 11 | 11 | amalgamated_rift_essence (recette), gift_of_expertise (vendeur), gift_of_fortune (recette) +10 autres |
| `amalgamated_gemstone` — Amalgamated Gemstone | `aurora` | 0 | 1 | 1 | crystalline_ingot (recette), shard_of_bava_nisos (vendeur), shard_of_janthir_syntri (vendeur) +2 autres |
