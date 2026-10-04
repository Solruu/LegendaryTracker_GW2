# Arbitrages de l'arbre de craft

Source : `gw2_sources_v357.json` — 33 desaccords sur 10 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `volatile_magic` — Volatile Magic | 1 | 4250 | cout vendeur x1 |
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `trade_contract` — Trade Contract | 2 | 1250 | cout vendeur x2 |
| `shard_of_glory` — Shard of Glory | 1 | 500 | deja compte par cascade x1 |
| `tales_of_dungeon_delving` — Tales of Dungeon Delving | 20 | 500 | cout vendeur x20 |
| `crystalline_ingot` — Crystalline Ingot | 2 | 250 | cout vendeur x2 |
| `ascended_shard_of_glory` — Ascended Shards of Glory | 1 | 100 | ecart de compte x1 |
| `pvp_league_ticket` — PvP League Ticket | 2 | 60 | deja compte par cascade x2 |
| `dragonite_ore` — Dragonite Ore | 1 | 25 | cout vendeur x1 |
| `vision_crystal` — Vision Crystal | 2 | 2 | cout vendeur x2 |

## ECART DE COMPTE — 1 cas

La cle a plat et l'arete donnent deux nombres differents : l'un des deux
est faux. Se tranche sur la page du PARENT, boite Recipe.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `ascended_shard_of_glory` — Ascended Shards of Glory | `transcendence` | 500 | 400 | 100 | star_of_glory (recette) |

## DEJA COMPTE PAR CASCADE — 4 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `shard_of_glory` — Shard of Glory | `transcendence` | 500 | 1000 | 500 | jar_of_distilled_glory (recette) |
| `pvp_league_ticket` — PvP League Ticket | `ardent_glorious` | 180 | 120 | 60 | record_of_league_participation (recette) |
| `pvp_league_ticket` — PvP League Ticket | `transcendence` | 25 | 20 | 5 | record_of_league_participation (recette) |

## COUT VENDEUR — 28 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `volatile_magic` — Volatile Magic | `vision` | 0 | 4250 | 4250 | olmakhan_latigo_strap (vendeur) |
| `trade_contract` — Trade Contract | `coalescence` | 0 | 1250 | 1250 | funerary_incense (vendeur) |
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
| `trade_contract` — Trade Contract | `vision` | 0 | 500 | 500 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `coalescence` | 0 | 250 | 250 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `vision` | 0 | 100 | 100 | funerary_incense (vendeur) |
| `dragonite_ore` — Dragonite Ore | `orrax_manifested` | 0 | 25 | 25 | binding_of_the_dragon (vendeur) |
| `vision_crystal` — Vision Crystal | `selachimorpha` | 0 | 2 | 2 | gift_of_adventure (vendeur), unbound_wings (recette) |
| `vision_crystal` — Vision Crystal | `ad_infinitum` | 0 | 1 | 1 | gift_of_adventure (vendeur), unbound_wings (recette) |
