# Arbitrages de l'arbre de craft

Source : `gw2_sources_v394.json` — 14 desaccords sur 9 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `ascended_shard_of_glory` — Ascended Shard of Glory | 1 | 500 | ecart de compte x1 |
| `shard_of_glory` — Shard of Glory | 1 | 500 | deja compte par cascade x1 |
| `elegy_mosaic` — Elegy Mosaic | 2 | 450 | deja compte par cascade x1, cout vendeur x1 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | 1 | 290 | deja compte par cascade x1 |
| `crystalline_ingot` — Crystalline Ingot | 2 | 250 | cout vendeur x2 |
| `dust_crystalline` — Pile of Crystalline Dust | 1 | 245 | deja compte par cascade x1 |
| `pvp_league_ticket` — PvP League Ticket | 2 | 60 | deja compte par cascade x2 |
| `dust_luminous` — Pile of Luminous Dust | 3 | 50 | deja compte par cascade x3 |

## ECART DE COMPTE — 1 cas

La cle a plat et l'arete donnent deux nombres differents : l'un des deux
est faux. Se tranche sur la page du PARENT, boite Recipe.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `ascended_shard_of_glory` — Ascended Shard of Glory | `transcendence` | 900 | 400 | 500 | star_of_glory (recette) |

## DEJA COMPTE PAR CASCADE — 10 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `shard_of_glory` — Shard of Glory | `transcendence` | 500 | 1000 | 500 | jar_of_distilled_glory (recette) |
| `elegy_mosaic` — Elegy Mosaic | `coalescence` | 300 | 750 | 450 | funerary_incense (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ad_infinitum` | 295 | 5 | 290 | shard_of_crystallized_mists_essence (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `ad_infinitum` | 250 | 5 | 245 | shard_of_crystallized_mists_essence (recette) |
| `pvp_league_ticket` — PvP League Ticket | `ardent_glorious` | 180 | 120 | 60 | record_of_league_participation (recette) |
| `dust_luminous` — Pile of Luminous Dust | `gen1_the_bifrost` | 250 | 200 | 50 | opal_crystal (recette) |
| `dust_luminous` — Pile of Luminous Dust | `gen1_the_minstrel` | 250 | 200 | 50 | opal_crystal (recette) |
| `dust_luminous` — Pile of Luminous Dust | `gen1_the_dreamer` | 210 | 200 | 10 | opal_crystal (recette) |
| `pvp_league_ticket` — PvP League Ticket | `transcendence` | 25 | 20 | 5 | record_of_league_participation (recette) |

## COUT VENDEUR — 3 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `elegy_mosaic` — Elegy Mosaic | `vision` | 0 | 300 | 300 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `coalescence` | 0 | 250 | 250 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `vision` | 0 | 100 | 100 | funerary_incense (vendeur) |
