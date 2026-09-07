# Pages wiki à capturer

Calculé depuis `gw2_sources_v231.json` et `ressources/INDEX_CONTENU.json` par
`gw2_pages_a_capturer_v1.py`. **Ne pas éditer à la main** : régénérer.

Une page déjà au dépôt n'est jamais redemandée — l'index de contenu est
interrogé avant toute ligne. `PAGES_A_CAPTURER.txt` porte les mêmes
pages en URLs brutes, une par ligne, pour l'automatisation.


## 0 — 15 cibles citees par l'arbre sans entree connue

Ces cles portent des couts a plat mais ne correspondent ni a un legendaire,
ni a une piece d'armure, ni a un composant. Ce n'est pas une capture qui
manque, c'est une entree — souvent une variante d'ecriture d'une cle
existante. A regler avant de capturer quoi que ce soit pour elles.

- `gen2_caladbolg`
- `gen2_elegy`
- `gen2_eordas_grip`
- `gen2_hope_scepter`
- `gen2_itzels_boon`
- `gen2_lorekeeper`
- `gen2_reaver_of_the_mists`
- `gen2_tigris`
- `gen3`
- `gen3_aurenes_fang`
- `gen3_aurenes_guard`
- `gen3_aurenes_reckoning`
- `gen3_aurenes_tenderness`
- `gen3_aurenes_wrath`
- `upgrades`

## 1 — 5 tables « Full material list » manquantes

Ces cibles portent des coûts à plat mais leur page n'est pas capturée avec
sa table de matériaux. Sans elle, l'arbre ne peut pas se déplier : il
ignore ce que la cible contient réellement.

| page wiki | coûts à plat concernés |
|---|---:|
| `Obsidian armor` | 15 |
| `Ardent Glorious armor` | 3 |
| `Triumphant Hero's armor` | 3 |
| `Legendary Upgrades` | 2 |
| `Fractal Capacitor` | 1 |

## 2 — 6 composants en arbitrage sans page au dépôt

Cités dans `ARBITRAGES.md`. Leur boîte Recipe et leur table vendeur
tranchent une partie des désaccords — en particulier si le vendeur propose
un **choix** ou une **liste**, ce que la capture aplatie ne dit pas.

| page wiki | désaccords portés |
|---|---:|
| `Magnetite Shard` | 2 |
| `Branded Mass` | 1 |
| `Gift of Battle` | 1 |
| `Inscribed Shard` | 1 |
| `PvP League Ticket` | 1 |
| `Vision Crystal` | 1 |

## 3 — 7 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Gift of Fractals` |
| `Gift of Magical / Mighty Prosperity` |
| `Legendary Shards (Gen2)` |
| `Legendary Shards (Gen3 / Aurene)` |
| `Olmakhan Bandolier (chaîne)` |
| `Spinal Blade Back Pack (Perfected)` |
| `Valkyrie Bearkin War Helm` |

## 4 — 32 collections incomplètes, dont 26 sans capture

| | page wiki | légendaire | id succès | ce qui manque |
|---|---|---|---:|---|
| ○ | `Incursive Investigation: First Recursion` | Eikasia, Mists-Grasper | 8840 | sans etapes, sans unlock |
| ○ | `Incursive Investigation: Infinite Recursion` | Eikasia, Mists-Grasper | 8814 | sans etapes, sans unlock |
| ○ | `Incursive Investigation: Relic in the Mists` | Eikasia, Mists-Grasper | 8823 | sans etapes, sans unlock |
| ○ | `Incursive Investigation: Second Recursion` | Eikasia, Mists-Grasper | 8841 | sans etapes, sans unlock |
| ○ | `Incursive Investigation: Third Recursion` | Eikasia, Mists-Grasper | 8835 | sans etapes, sans unlock |
| ○ | `Incursive Investigation: Working Together` | Eikasia, Mists-Grasper | 8830 | sans unlock |
| ○ | `Helping Hylek: Kill Krait` | Endless Summer | 9180 | sans etapes, sans unlock |
| ○ | `Shipwreck Strand Mastery` | Endless Summer | 8880 | sans etapes, sans unlock |
| ○ | `Starlit Weald Mastery` | Endless Summer | 9057 | sans etapes, sans unlock |
| ○ | `Legendary Rune Collector` | Legendary Upgrades | 7796 | sans etapes, sans unlock |
| ○ | `Legendary Sigil Collector` | Legendary Upgrades | 7788 | sans etapes, sans unlock |
| ○ | `Bava Nisos Mastery` | Orrax Manifested | 8769 | sans etapes, sans unlock |
| ○ | `Legendary Backpack and Glider: Orrax` | Orrax Manifested | 8714 | sans unlock |
| ○ | `Mistburned Barrens Mastery` | Orrax Manifested | 8582 | sans etapes, sans unlock |
| ○ | `Return to Living World` | Prismatic Champion's Regalia | 5790 | sans etapes, sans unlock |
| ○ | `Shipwreck Strand Mastery` | Selachimorpha | 8880 | sans etapes, sans unlock |
| ○ | `Starlit Weald Mastery` | Selachimorpha | 9057 | sans etapes, sans unlock |
| ○ | `Path of the Ascension I: The Thrill of Battle` | The Ascension | 2738 | sans etapes, sans unlock |
| ○ | `Path of the Ascension II: Tapestry of Sacrifice` | The Ascension | 2752 | sans etapes, sans unlock |
| ○ | `Path of the Ascension III: Monument of Legends` | The Ascension | 2725 | sans etapes, sans unlock |
| ○ | `Path of the Ascension IV: Hymn of Glory` | The Ascension | 2715 | sans etapes, sans unlock |
| ○ | `"A Bug in the System" Mastery` | Vision | 4093 | sans etapes, sans unlock |
| ○ | `"A Star to Guide Us" Mastery` | Vision | 4359 | sans etapes, sans unlock |
| ○ | `"All or Nothing" Mastery` | Vision | 4544 | sans etapes, sans unlock |
| ○ | `"Long Live the Lich" Mastery` | Vision | 4195 | sans etapes, sans unlock |
| ○ | `"War Eternal" Mastery` | Vision | 4689 | sans etapes, sans unlock |
| ● | `Incursive Investigation` | Eikasia, Mists-Grasper | 8826 | sans etapes, sans unlock |
| ● | `Legendary Weapon: Eternity` | Eternity | 7250 | sans unlock |
| ● | `Forge Guard's Armor Collection` | Stella Radians | 9330 | sans unlock |
| ● | `Glimmering Resin Weapon Collector` | Stella Radians | 9344 | sans unlock |
| ● | `Vision I: Awakening` | Vision | 4762 | sans unlock |
| ● | `Vision II: Farsight` | Vision | 4771 | sans unlock |
