# Pages wiki à capturer

Calculé depuis `gw2_sources_v237.json` et `ressources/INDEX_CONTENU.json` par
`gw2_pages_a_capturer_v1.py`. **Ne pas éditer à la main** : régénérer.

Une page déjà au dépôt n'est jamais redemandée — l'index de contenu est
interrogé avant toute ligne. `PAGES_A_CAPTURER.txt` porte les mêmes
pages en URLs brutes, une par ligne, pour l'automatisation.


## 0 bis — 14 cibles citees par l'arbre sans entree connue

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

## 0 — 5 trous de l'arbre — LA PRIORITÉ

Ces composants ont des enfants dans la donnée, mais ni boîte Recipe ni
coût vendeur au dépôt : l'arbre sait qu'il faut les fabriquer, il ne sait
pas avec quoi. Tant qu'ils manquent, le calcul de bas en haut s'arrête là
et les totaux restent tributaires des coûts recopiés à plat.

| page wiki | composants qui en dépendent |
|---|---:|
| `Dragonsblood Weapons` | 3 |
| `Augur's Stone` | 1 |
| `Bloodstone Shard` | 1 |
| `Fractalline Spark` | 1 |
| `Olmakhan Bandolier` | 1 |

## 1 — 3 tables « Full material list » manquantes

Ces cibles portent des coûts à plat mais leur page n'est pas capturée avec
sa table de matériaux. Sans elle, l'arbre ne peut pas se déplier : il
ignore ce que la cible contient réellement.

| page wiki | coûts à plat concernés |
|---|---:|
| `Obsidian armor` | 15 |
| `Ardent Glorious armor` | 3 |
| `Triumphant Hero's armor` | 3 |

## 2 — 3 composants en arbitrage sans page au dépôt

Cités dans `ARBITRAGES.md`. Leur boîte Recipe et leur table vendeur
tranchent une partie des désaccords — en particulier si le vendeur propose
un **choix** ou une **liste**, ce que la capture aplatie ne dit pas.

| page wiki | désaccords portés |
|---|---:|
| `Trade Contract` | 3 |
| `Elegy Mosaic` | 2 |
| `Shard of Glory` | 2 |

## 3 — 4 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Gift of Magical / Mighty Prosperity` |
| `Olmakhan Bandolier` |
| `Spinal Blade Back Pack (Perfected)` |
| `Valkyrie Bearkin War Helm` |

## 4 — 32 collections incomplètes — RIEN À CAPTURER

Ces succès n'ont pas d'article à eux : « Incursive Investigation:
Infinite Recursion » est une ligne de la page de catégorie, « Helping
Hylek: Kill Krait » est un compteur de kills sans étapes par nature. Ils
vivent dans le méta global. La liste reste parce qu'elle est utile ; la
colonne « où le lire » dit où regarder. Aucune de ces lignes n'est dans
`PAGES_A_CAPTURER.txt`.

| | succès | légendaire | id | ce qui manque | où le lire |
|---|---|---|---:|---|---|
| ○ | `Incursive Investigation: First Recursion` | Eikasia, Mists-Grasper | 8840 | sans etapes, sans unlock | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Infinite Recursion` | Eikasia, Mists-Grasper | 8814 | sans etapes, sans unlock | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Relic in the Mists` | Eikasia, Mists-Grasper | 8823 | sans etapes, sans unlock | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Second Recursion` | Eikasia, Mists-Grasper | 8841 | sans etapes, sans unlock | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Third Recursion` | Eikasia, Mists-Grasper | 8835 | sans etapes, sans unlock | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Working Together` | Eikasia, Mists-Grasper | 8830 | sans unlock | `Eikasia, Mists-Grasper` |
| ○ | `Helping Hylek: Kill Krait` | Endless Summer | 9180 | sans etapes, sans unlock | `Endless Summer` |
| ○ | `Shipwreck Strand Mastery` | Endless Summer | 8880 | sans etapes, sans unlock | `Endless Summer` |
| ○ | `Starlit Weald Mastery` | Endless Summer | 9057 | sans etapes, sans unlock | `Endless Summer` |
| ○ | `Legendary Rune Collector` | Legendary Upgrades | 7796 | sans etapes, sans unlock | `Legendary Upgrades` |
| ○ | `Legendary Sigil Collector` | Legendary Upgrades | 7788 | sans etapes, sans unlock | `Legendary Upgrades` |
| ○ | `Bava Nisos Mastery` | Orrax Manifested | 8769 | sans etapes, sans unlock | `Orrax Manifested` |
| ○ | `Legendary Backpack and Glider: Orrax` | Orrax Manifested | 8714 | sans unlock | `Orrax Manifested` |
| ○ | `Mistburned Barrens Mastery` | Orrax Manifested | 8582 | sans etapes, sans unlock | `Orrax Manifested` |
| ○ | `Return to Living World` | Prismatic Champion's Regalia | 5790 | sans etapes, sans unlock | `Prismatic Champion's Regalia` |
| ○ | `Shipwreck Strand Mastery` | Selachimorpha | 8880 | sans etapes, sans unlock | `Selachimorpha` |
| ○ | `Starlit Weald Mastery` | Selachimorpha | 9057 | sans etapes, sans unlock | `Selachimorpha` |
| ○ | `Path of the Ascension I: The Thrill of Battle` | The Ascension | 2738 | sans etapes, sans unlock | `The Ascension` |
| ○ | `Path of the Ascension II: Tapestry of Sacrifice` | The Ascension | 2752 | sans etapes, sans unlock | `The Ascension` |
| ○ | `Path of the Ascension III: Monument of Legends` | The Ascension | 2725 | sans etapes, sans unlock | `The Ascension` |
| ○ | `Path of the Ascension IV: Hymn of Glory` | The Ascension | 2715 | sans etapes, sans unlock | `The Ascension` |
| ○ | `"A Bug in the System" Mastery` | Vision | 4093 | sans etapes, sans unlock | `Vision` |
| ○ | `"A Star to Guide Us" Mastery` | Vision | 4359 | sans etapes, sans unlock | `Vision` |
| ○ | `"All or Nothing" Mastery` | Vision | 4544 | sans etapes, sans unlock | `Vision` |
| ○ | `"Long Live the Lich" Mastery` | Vision | 4195 | sans etapes, sans unlock | `Vision` |
| ○ | `"War Eternal" Mastery` | Vision | 4689 | sans etapes, sans unlock | `Vision` |
| ● | `Incursive Investigation` | Eikasia, Mists-Grasper | 8826 | sans etapes, sans unlock | — |
| ● | `Legendary Weapon: Eternity` | Eternity | 7250 | sans unlock | — |
| ● | `Forge Guard's Armor Collection` | Stella Radians | 9330 | sans unlock | — |
| ● | `Glimmering Resin Weapon Collector` | Stella Radians | 9344 | sans unlock | — |
| ● | `Vision I: Awakening` | Vision | 4762 | sans unlock | — |
| ● | `Vision II: Farsight` | Vision | 4771 | sans unlock | — |
