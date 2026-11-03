# Arbitrages de l'arbre de craft

Source : `gw2_sources_v429.json` — 9 desaccords sur 9 composants.

Chaque ligne est une arete que le wiki propose et que la donnee contredit.
Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.


## Par composant, du plus expose au moins expose

| composant | desaccords | plus gros ecart | familles |
|---|---:|---:|---|
| `shard_of_glory` — Shard of Glory | 1 | 1330 | deja compte par cascade x1 |
| `lump_of_aurillium` — Lump of Aurillium | 1 | 300 | deja compte par cascade x1 |
| `ascended_shard_of_glory` — Ascended Shard of Glory | 1 | 275 | deja compte par cascade x1 |
| `skirmish_claim_ticket` — WvW Skirmish Claim Ticket | 1 | 260 | cout vendeur x1 |
| `dust_luminous` — Pile of Luminous Dust | 1 | 98 | deja compte par cascade x1 |
| `integrated_fractal_matrix` — Integrated Fractal Matrix | 1 | 2 | cout vendeur x1 |
| `gift_of_the_tides` — Gift of the Tides | 1 | 1 | cout vendeur x1 |
| `memory_of_battle` — Memory of Battle | 1 | 0 | deja compte par cascade x1 |
| `sun_bead` — Sun Bead | 1 | 0 | deja compte par cascade x1 |

## DEJA COMPTE PAR CASCADE — 6 cas

Le composant arrive deja au legendaire par un chemin modelise, et la table
en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,
soit les deux sont reels et le chevauchement se declare dans
`qty_overlap_verified`.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `shard_of_glory` — Shard of Glory | `transcendence` | 1500 | 170 | 1330 | mist_pendant (vendeur) |
| `lump_of_aurillium` — Lump of Aurillium | `gen2_astralaria` | 800 | 500 | 300 | sheet_of_aurillium (vendeur) |
| `ascended_shard_of_glory` — Ascended Shard of Glory | `transcendence` | 400 | 125 | 275 | mist_pendant (vendeur) |
| `dust_luminous` — Pile of Luminous Dust | `gen2_astralaria` | 100 | 2 | 98 | sapphire_crystal (recette) |
| `memory_of_battle` — Memory of Battle | `transcendence` | 250 | 250 | 0 | mist_pendant (vendeur) |
| `sun_bead` — Sun Bead | `endless_summer` | 250 | 250 | 0 | gift_of_the_hylek (vendeur) |

## COUT VENDEUR — 3 cas

La table vendeur aplatit des options qui s'excluent. Se tranche en
regardant si le vendeur propose un choix ou une liste.

| composant | legendaire | donnee | wiki | ecart | parents proposes |
|---|---|---:|---:|---:|---|
| `skirmish_claim_ticket` — WvW Skirmish Claim Ticket | `transcendence` | 0 | 260 | 260 | mist_pendant (vendeur) |
| `integrated_fractal_matrix` — Integrated Fractal Matrix | `transcendence` | 0 | 2 | 2 | mist_pendant (vendeur) |
| `gift_of_the_tides` — Gift of the Tides | `selachimorpha` | 0 | 1 | 1 | gift_of_the_seas (vendeur) |
