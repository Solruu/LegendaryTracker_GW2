# Platine (Platinum Ore)

## Constat
Contrairement au cuir et à la soie, le platine **n'est pas une matière de salvage** :
il vient exclusivement de nodes minés (`platinum` et `rich_platinum` dans
`ressource_tracker/gw2_nodes.json`). Le ciblage par map est donc possible et c'est
le seul levier de rendement.

- `Platinum Ore (node)` : minable **3 fois**, zones niveau 45-70, requiert une
  **Darksteel Mining Pick** minimum (sinon Ruined Ore Chunk).
- `Rich Platinum Vein` : minable **10 fois** — un rich vaut plus de 3 nodes normaux,
  c'est lui qui structure la boucle.

## Concentration par map (wiki, section Locations)
Nombre de **zones distinctes** listées comme contenant du platine (proxy de densité,
le wiki ne donne pas de compte de nodes) :

| Map | Zones avec platine | Zones avec rich vein |
|---|---|---|
| Sparkfly Fen | 19 | 4 |
| Iron Marches | 17 | 6 |
| Mount Maelstrom | 17 | 5 |
| Fireheart Rise | 14 | 5 |
| Timberline Falls | 13 | 5 |
| Bloodtide Coast | 6 | 1 |
| Thunderhead Peaks | 3 | 0 |
| Bjora Marches, Black Citadel, Divinity's Reach, Hoelbrak, Rata Sum, The Grove | 1 | 0 |

Rich veins garantis (permanents) annoncés par le wiki :
- **Iron Marches** — 2 garantis + 2 possibles : Ebbing Heart Run (Heartsond Falls) et
  Gladefall Run (à côté de la vista).
- **Mount Maelstrom** — 2 garantis + 2 possibles : Criterion Canyon (temple Rata Pten,
  sud-ouest du WP) et Sunken Droknah (sous l'eau, sous les algues).
- **Fireheart Rise** — Rebel's Seclusion, à l'est du WP.
- **Sparkfly Fen** — Karinn's Passage, dans les deux grottes au sud-ouest de la vista.
- **Bloodtide Coast** — Mole's Head, via la zone verte au sud.

## Croisement avec les captures perso
`gw2_nodes.json` (captures en jeu, 2026-05 → 2026-09, relevé du 17/09/2026) :

| Map (map_id) | platinum | rich_platinum |
|---|---|---|
| Iron Marches (25) | 45 | 4 |
| Timberline Falls (29) | 20 | 1 |
| Mount Maelstrom (39) | 3 | 0 |
| Fireheart Rise (22) | 2 | 0 |
| Sparkfly Fen (53) | 2 | 0 |
| Bloodtide Coast (73) | 1 | 0 |
| map 1310 (probablement Bjora Marches, ID non vérifié) | 1 | 0 |

**Biais de couverture à garder en tête** : les captures ne sont pas exhaustives.
Iron Marches (190 captures tous types) et Timberline Falls (73) ont été balayées,
Sparkfly Fen presque pas (10). Les 2 à 3 nodes relevés sur Fireheart Rise, Mount
Maelstrom et Sparkfly Fen ne contredisent pas le wiki : ils reflètent un passage
partiel.

## Boucle retenue
1. **Iron Marches** — meilleur rapport densité/temps : le plus de zones à rich vein
   du jeu (6), 2 rich garantis, et c'est la seule map où les captures perso
   confirment la densité sur le terrain (45 nodes + 4 rich).
2. **Fireheart Rise** — enchaîne directement (même région, Ascalon). Note wiki :
   plusieurs nodes spawnent ensemble sur l'île au sud-ouest de Pig Iron Waypoint
   (Pig Iron Mine).
3. **Timberline Falls** — 14 nodes relevés, trajets courts entre Gentle River /
   Guilty Tears / Gyre Rapids.

Sparkfly Fen et Mount Maelstrom sont sur le papier aussi denses qu'Iron Marches mais
une grande part de leurs nodes est **sous l'eau** (Ocean's Gullet, Leeshore Gauntlet,
The Mire Sea, Sunken Droknah), ce qui plombe le temps par node. À balayer une fois
avec le tracker pour trancher sur données réelles plutôt que sur le comptage de zones.

## Non retenu
- **Glyph of Bounty / Glyph of the Prospector** : écartés par principe (pas de glyphe
  spécialisé hors Unbound/Volatile Magic) — même règle que pour le cuir et la soie.
- **Darksteel** : pas de node `darksteel` en jeu, aucune capture ; le Darksteel Ore
  n'existe pas comme minerai brut ramassable (cf. corrections `SLUG_TO_ITEM_ID`).

## Sources
- `ressources/wiki/platinum_ore_node.html` — Locations, gathering results.
- `ressources/wiki/rich_platinum_vein.html` — Locations + guide détaillé
  garanti/possible par zone.
- `ressource_tracker/gw2_nodes.json` — captures MumbleLink personnelles.
