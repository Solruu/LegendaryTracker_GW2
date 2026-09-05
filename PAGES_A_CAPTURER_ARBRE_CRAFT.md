# Pages wiki à capturer — arbre de craft chiffré

État au 05/09/2026, après `gw2_sources_v205.json`.

Le titre de la colonne « page wiki » est le titre exact de l'article sur le wiki EN. `●` = une capture existe déjà au dépôt ; `○` = jamais capturée.

Ce fichier ne recouvre pas `PAGES_A_CAPTURER_HORS_ARMES.md`, qui traite des collections et de leurs étapes. Ici il n'est question que de quantités : combien d'un composant entre dans un autre.


## A — 45 recettes de dons (83 arêtes non chiffrées)

Chaque page donne la recette du don, donc la quantité de chacune de ses arêtes. Triées par nombre d'arêtes débloquées.

| | page wiki | arêtes | composants concernés |
|---|---|---|---|
| ○ | `Amalgamated Rift Essence` | 4 | `fine_rift_essence`, `glob_of_ectoplasm`, `masterwork_rift_essence`, `rare_rift_essence` |
| ○ | `Gift of Energy` | 4 | `dust_crystalline`, `dust_incandescent`, `dust_luminous`, `dust_radiant` |
| ○ | `Gift of Insights` | 4 | `gift_of_gliding`, `gift_of_the_exalted`, `gift_of_the_itzel`, `gift_of_the_nuhoch` |
| ○ | `Gift of Mastery` | 4 | `bloodstone_shard`, `gift_of_battle`, `gift_of_exploration`, `obsidian_shard` |
| ○ | `Gift of Research` | 4 | `exotic_essence_of_luck`, `glob_of_ectoplasm`, `hydrocatalytic_reagent`, `thermocatalytic_reagent` |
| ○ | `Warcry` | 4 | `commanders_wings_of_war`, `generals_wings_of_war`, `recruits_wings_of_war`, `soldiers_wings_of_war` |
| ○ | `Wings of Ascension` | 4 | `wings_of_glory_champion`, `wings_of_glory_elite`, `wings_of_glory_recruit`, `wings_of_glory_veteran` |
| ○ | `Fulgurite` | 3 | `bottle_airship_oil`, `ley_line_spark`, `pile_auric_dust` |
| ○ | `Gift of Conquering` | 3 | `gift_of_battle`, `legendary_spike`, `vision_crystal` |
| ○ | `Gift of Janthir Wilds` | 3 | `gift_of_expertise_jw`, `gift_of_gatherer_of_the_hunt`, `gift_of_uncovered_grounds` |
| ○ | `Gift of Maguuma Mastery` | 3 | `crystalline_ingot_gen2`, `gift_of_insights`, `gift_of_maguuma` |
| ○ | `Gift of the Champion` | 3 | `gift_of_competitive_dedication`, `salt_forged_mist_diamond`, `tome_of_the_mists` |
| ○ | `Gift of Castoran Mastery` | 2 | `gift_of_adventure_voe`, `gift_of_the_seas` |
| ○ | `Gift of Desert Mastery` | 2 | `gift_of_the_desert`, `gift_of_the_rider` |
| ○ | `Gift of Fortune` | 2 | `glob_of_ectoplasm`, `mystic_clover` |
| ○ | `Gift of Magical / Mighty Prosperity` | 2 | `gift_of_craftsmanship`, `mystic_clover` |
| ○ | `Gift of the Dragon Empire` | 2 | `antique_summoning_stone`, `jade_runestone` |
| ○ | `Gift of the Mists` | 2 | `gift_of_battle`, `gift_of_glory` |
| ○ | `Mist Band (Infused)` | 2 | `ascended_shard_of_glory`, `shard_of_glory` |
| ○ | `Certificate of Heroics` | 1 | `testimony_of_heroics` |
| ○ | `Crystalline Ingot` | 1 | `crystalline_ore` |
| ○ | `Draconic Tribute` | 1 | `amalgamated_draconic_lodestone` |
| ○ | `Essence of Animosity` | 1 | `testimony_of_heroics` |
| ○ | `Gift of Expertise` | 1 | `obsidian_shard` |
| ○ | `Gift of Gatherer of the Hunt` | 1 | `shards_of_lowland_shore` |
| ○ | `Gift of Infused Gems` | 1 | `amalgamated_gemstone` |
| ○ | `Gift of Jade Mastery` | 1 | `gift_of_the_dragon_empire` |
| ○ | `Gift of Patience` | 1 | `magnetite_shard` |
| ○ | `Gift of Prescience` | 1 | `icy_runestone` |
| ○ | `Gift of Sentience` | 1 | `icy_runestone` |
| ○ | `Gift of Uncovered Grounds` | 1 | `shards_of_janthir_syntri` |
| ○ | `Gift of War Dedication` | 1 | `glob_condensed_spirit_energy` |
| ○ | `Gift of the Elders` | 1 | `gift_of_the_tides` |
| ○ | `Gift of the Exalted` | 1 | `lump_of_aurillium` |
| ○ | `Gift of the Feast` | 1 | `fruits_of_the_shadow` |
| ○ | `Gift of the Itzel` | 1 | `airship_part` |
| ○ | `Gift of the Mistburned Isles` | 1 | `curious_mursaat_remnant` |
| ○ | `Gift of the Nuhoch` | 1 | `ley_line_crystal` |
| ○ | `Gift of the Rider` | 1 | `trade_contract` |
| ○ | `Gift of the World` | 1 | `icy_runestone` |
| ○ | `Mist Pearl` | 1 | `skirmish_claim_tickets` |
| ○ | `Mist-Enhanced Mithril` | 1 | `skirmish_claim_tickets` |
| ○ | `Mystic Tribute` | 1 | `mystic_coin` |
| ○ | `Spark of Sentience` | 1 | `xunlai_electrum_ingot` |
| ○ | `War Commendation` | 1 | `emblem_of_the_conqueror` |

## B — 31 dons d'arme absents de la base

La branche propre à chaque arme. Les quantités sont déjà extraites dans `gw2_material_lists_v1.json` ; ce qu'il manque sur ces pages, c'est l'**apiId** (absent de `gw2_materials_ref.json`, qui ne couvre que le stockage de matériaux) et la prose d'acquisition.

| | page wiki | cité par |
|---|---|---|
| ○ | `Gift of Arah` | sharur |
| ○ | `Gift of Astralaria` | astralaria |
| ○ | `Gift of Aurene's Argument` | aurenes_argument |
| ○ | `Gift of Aurene's Bite` | aurenes_bite |
| ○ | `Gift of Aurene's Breath` | aurenes_breath |
| ○ | `Gift of Aurene's Claw` | aurenes_claw |
| ○ | `Gift of Aurene's Fang` | aurenes_fang |
| ○ | `Gift of Aurene's Flight` | aurenes_flight |
| ○ | `Gift of Aurene's Gaze` | aurenes_gaze |
| ○ | `Gift of Aurene's Horn` | aurenes_voice |
| ○ | `Gift of Aurene's Insight` | aurenes_insight |
| ○ | `Gift of Aurene's Persuasion` | aurenes_persuasion |
| ○ | `Gift of Aurene's Rending` | aurenes_rending |
| ○ | `Gift of Aurene's Scale` | aurenes_scale |
| ○ | `Gift of Aurene's Tail` | aurenes_tail |
| ○ | `Gift of Aurene's Weight` | aurenes_weight |
| ○ | `Gift of Aurene's Wing` | aurenes_wing |
| ○ | `Gift of Aurene's Wisdom` | aurenes_wisdom |
| ○ | `Gift of Balthazar` | flames_of_war |
| ○ | `Gift of Chuka and Champawat` | chuka_and_champawat |
| ○ | `Gift of Divinity` | the_hms_divinity |
| ○ | `Gift of Eureka` | eureka |
| ○ | `Gift of Exordium` | exordium |
| ○ | `Gift of HOPE` | hope |
| ○ | `Gift of Nevermore` | nevermore |
| ○ | `Gift of Pharus` | pharus |
| ○ | `Gift of Shooshadoo` | shooshadoo |
| ○ | `Gift of Verdarach` | verdarach |
| ○ | `Gift of Xiuquatl` | xiuquatl |
| ○ | `Gift of the Blade` | the_shining_blade |
| ○ | `Gift of the Four Legions` | claw_of_the_khan_ur |

## C — 25 matériaux absents de la base

Lingots, planches, tissus, cuirs, orbes : le volume réel du coût d'une arme. 35 d'entre eux ont un apiId récupérable depuis `gw2_materials_ref.json` ; la capture sert alors uniquement aux sources d'acquisition.

| | page wiki | cité par |
|---|---|---|
| ○ | `Ancient Wood Plank` | chuka_and_champawat, flames_of_war, frenzy (+9) |
| ○ | `Blessing of the Jade Empress` | aurenes_argument, aurenes_bite, aurenes_breath (+13) |
| ○ | `Bolt of Gossamer` | bolt, quip, the_minstrel (+1) |
| ○ | `Box o' Fun` | quip, the_moot |
| ○ | `Chrysocola Orb` | the_dreamer |
| ○ | `Chunk of Ancient Ambergris` | aurenes_argument, aurenes_bite, aurenes_breath (+13) |
| ○ | `Chunk of Pure Jade` | aurenes_argument, aurenes_bite, aurenes_breath (+13) |
| ○ | `Cured Hardened Leather Square` | eternity, howler, kraitkin (+4) |
| ○ | `Darksteel Ingot` | astralaria, bolt, claw_of_the_khan_ur (+14) |
| ○ | `Elder Wood Plank` | chuka_and_champawat, claw_of_the_khan_ur, eureka (+17) |
| ○ | `Ghost Pepper` | incinerator, rodgort |
| ● | `Glacial Lodestone` | frenzy, frostfang |
| ○ | `Hard Wood Plank` | chuka_and_champawat, flames_of_war, frenzy (+9) |
| ○ | `Hardened Leather Section` | meteorlogicus |
| ○ | `Lamplighter's Badge` | aurenes_argument, aurenes_bite, aurenes_breath (+13) |
| ○ | `Mithril Ingot` | astralaria, bolt, claw_of_the_khan_ur (+20) |
| ● | `Molten Lodestone` | frenzy, incinerator, rodgort (+1) |
| ○ | `Mystic Curio` | claw_of_the_khan_ur, eureka, exordium (+9) |
| ○ | `Omnomberry` | kudzu |
| ○ | `Opal Orb` | the_bifrost, the_dreamer, the_minstrel |
| ○ | `Orichalcum Ingot` | astralaria, bolt, claw_of_the_khan_ur (+21) |
| ○ | `Platinum Ingot` | astralaria, bolt, claw_of_the_khan_ur (+14) |
| ○ | `Seasoned Wood Plank` | chuka_and_champawat, flames_of_war, frenzy (+9) |
| ○ | `Silver Doubloon` | the_juggernaut |
| ○ | `Steel Ingot` | the_juggernaut |

## Ce qui n'est PAS ici, et pourquoi

Ces familles sont citées par les tables du wiki mais n'ont pas leur place dans l'arbre de craft : elles sont portées par `collections{}`, avec leur propre chemin de rendu. Les ajouter ici créerait le double comptage qu'on cherche à supprimer.

| famille | nombre | déjà porté par |
|---|---|---|
| précurseurs (Dawn, Dusk, Zap, Carcharias…) | 72 | `collections{}`, palier III |
| fiches `Recipe:` | 36 | étapes de collection gen2 |
| `Poem on …` | 16 | étapes de collection gen2 |
| `Tribute to …` et `Shard of …` | 24 | étapes de collection gen2 |
| cachets supérieurs | 16 | achetés à l'HDV, hors arbre |

## Total

**101 pages**, dont 2 déjà au dépôt.
