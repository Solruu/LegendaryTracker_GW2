# Pages wiki à capturer

Calculé depuis `gw2_sources_v273.json` et `ressources/INDEX_CONTENU.json` par
`gw2_pages_a_capturer_v1.py`. **Ne pas éditer à la main** : régénérer.

Une page déjà au dépôt n'est jamais redemandée — l'index de contenu est
interrogé avant toute ligne. `PAGES_A_CAPTURER.txt` porte les mêmes
pages en URLs brutes, une par ligne, pour l'automatisation.


## 0 bis — 1 cibles citees par l'arbre sans entree connue

Ces cles portent des couts a plat mais ne correspondent ni a un legendaire,
ni a une piece d'armure, ni a un composant. Ce n'est pas une capture qui
manque, c'est une entree — souvent une variante d'ecriture d'une cle
existante. A regler avant de capturer quoi que ce soit pour elles.

- `gen3`

## 0 — 6 trous de l'arbre — LA PRIORITÉ

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
| `Perfect Mist Core` | 1 |

## 1 — 3 tables « Full material list » manquantes

Ces cibles portent des coûts à plat mais leur page n'est pas capturée avec
sa table de matériaux. Sans elle, l'arbre ne peut pas se déplier : il
ignore ce que la cible contient réellement.

| page wiki | coûts à plat concernés |
|---|---:|
| `Obsidian armor` | 15 |
| `Ardent Glorious armor` | 10 |
| `Triumphant Hero's armor` | 10 |

### Ajout manuel (non détecté par le générateur) — split poids × emplacement

Le coût brut ascended (Ascended Shard of Glory / Memory of Battle + WvW
Skirmish Claim Ticket, marque Grandmaster) varie par POIDS **et** par
EMPLACEMENT au sein d'un même poids — confirmé le 10/09/2026 (Ardent
Glorious Legplates lourd/jambières ≠ Triumphant Hero Wargreaves
lourd/bottes). Chaque pièce d'un set d'armure légendaire a sa propre page ;
seules 3 des 18 combinaisons poids × emplacement sont capturées par set
(15 manquantes chacun, 30 au total). Le générateur ne détecte pas ce besoin
— ces pages portent déjà des coûts à plat exploitables pour LEUR propre
poids/emplacement, ce n'est pas un « trou » à ses yeux, juste une
combinaison voisine non capturée.

**Ardent Glorious armor** (capturé : léger/casque = Crown, moyen/torse =
Brigandine, lourd/jambières = Legplates)

| emplacement | léger | moyen | lourd |
|---|---|---|---|
| casque | ✅ `Ardent Glorious Crown` | `Ardent Glorious Cap` | `Ardent Glorious Plate Helm` |
| épaulières | `Ardent Glorious Epaulets` | `Ardent Glorious Shoulderguards` | `Ardent Glorious Pauldrons` |
| torse | `Ardent Glorious Raiment` | ✅ `Ardent Glorious Brigandine` | `Ardent Glorious Breastplate` |
| gants | `Ardent Glorious Armguards` | `Ardent Glorious Wristplates` | `Ardent Glorious Gauntlets` |
| jambières | `Ardent Glorious Leggings` | `Ardent Glorious Legguards` | ✅ `Ardent Glorious Legplates` |
| bottes | `Ardent Glorious Footgear` | `Ardent Glorious Shinplates` | `Ardent Glorious Wargreaves` |

**Triumphant Hero's armor** (capturé : léger/casque = Masque, moyen/torse =
Brigandine, lourd/bottes = Wargreaves)

| emplacement | léger | moyen | lourd |
|---|---|---|---|
| casque | ✅ `Triumphant Hero's Masque` | `Triumphant Hero's Faceguard` | `Triumphant Hero's Warhelm` |
| épaulières | `Triumphant Hero's Epaulets` | `Triumphant Hero's Shoulderguards` | `Triumphant Hero's Pauldrons` |
| torse | `Triumphant Hero's Raiment` | ✅ `Triumphant Hero's Brigandine` | `Triumphant Hero's Breastplate` |
| gants | `Triumphant Hero's Armguards` | `Triumphant Hero's Wristplates` | `Triumphant Hero's Gauntlets` |
| jambières | `Triumphant Hero's Leggings` | `Triumphant Hero's Legguards` | `Triumphant Hero's Legplates` |
| bottes | `Triumphant Hero's Footgear` | `Triumphant Hero's Shinplates` | ✅ `Triumphant Hero's Wargreaves` |

## 2 — 0 composants en arbitrage sans page au dépôt

Cités dans `ARBITRAGES.md`. Leur boîte Recipe et leur table vendeur
tranchent une partie des désaccords — en particulier si le vendeur propose
un **choix** ou une **liste**, ce que la capture aplatie ne dit pas.

| page wiki | désaccords portés |
|---|---:|

## 3 — 12 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Gift of Competitive Prosperity` |
| `Gift of Competitive Prowess` |
| `Gift of Magical / Mighty Prosperity` |
| `Gift of War Prowess` |
| `Grandmaster Armorsmith's Mark` |
| `Grandmaster Leatherworker's Mark` |
| `Grandmaster Tailor's Mark` |
| `Olmakhan Bandolier` |
| `Spinal Blade Back Pack (Perfected)` |
| `Tribute to Call of the Void` |
| `Tribute to Exitare` |
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
