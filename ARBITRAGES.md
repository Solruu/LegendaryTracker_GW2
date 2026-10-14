# Arbitrages de l'arbre de craft

Source : `gw2_sources_v404.json` — 10 desaccords sur 6 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `memory_of_battle` — Memory of Battle | 1 | 1500 | deja compte par cascade x1 |
| `trade_contract` — Trade Contract | 2 | 1250 | cout vendeur x2 |
| `glob_of_ectoplasm` — Glob of Ectoplasm | 1 | 290 | deja compte par cascade x1 |
| `crystalline_ingot` — Crystalline Ingot | 2 | 250 | cout vendeur x2 |
| `dust_crystalline` — Pile of Crystalline Dust | 1 | 245 | deja compte par cascade x1 |
| `dust_luminous` — Pile of Luminous Dust | 3 | 50 | deja compte par cascade x3 |

## DEJA COMPTE PAR CASCADE — 6 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `memory_of_battle` — Memory of Battle | `conflux` | 1750 | 250 | 1500 | mist_band_infused (vendeur) |
| `glob_of_ectoplasm` — Glob of Ectoplasm | `ad_infinitum` | 295 | 5 | 290 | shard_of_crystallized_mists_essence (recette) |
| `dust_crystalline` — Pile of Crystalline Dust | `ad_infinitum` | 250 | 5 | 245 | shard_of_crystallized_mists_essence (recette) |
| `dust_luminous` — Pile of Luminous Dust | `gen1_the_bifrost` | 250 | 200 | 50 | opal_crystal (recette) |
| `dust_luminous` — Pile of Luminous Dust | `gen1_the_minstrel` | 250 | 200 | 50 | opal_crystal (recette) |
| `dust_luminous` — Pile of Luminous Dust | `gen1_the_dreamer` | 210 | 200 | 10 | opal_crystal (recette) |

## COUT VENDEUR — 4 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `trade_contract` — Trade Contract | `coalescence` | 0 | 1250 | 1250 | funerary_incense (vendeur) |
| `trade_contract` — Trade Contract | `vision` | 0 | 500 | 500 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `coalescence` | 0 | 250 | 250 | funerary_incense (vendeur) |
| `crystalline_ingot` — Crystalline Ingot | `vision` | 0 | 100 | 100 | funerary_incense (vendeur) |
