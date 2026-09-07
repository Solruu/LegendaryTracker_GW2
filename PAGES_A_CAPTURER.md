# Pages wiki à capturer

Calculé depuis `gw2_sources_v229.json` et `ressources/INDEX_CONTENU.json` par
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

## 1 — 8 tables « Full material list » manquantes

Ces cibles portent des coûts à plat mais leur page n'est pas capturée avec
sa table de matériaux. Sans elle, l'arbre ne peut pas se déplier : il
ignore ce que la cible contient réellement.

| page wiki | coûts à plat concernés |
|---|---:|
| `Obsidian armor` | 15 |
| `Legendary Relic` | 6 |
| `Legendary Rune` | 4 |
| `Legendary Sigil` | 4 |
| `Ardent Glorious armor` | 3 |
| `Triumphant Hero's armor` | 3 |
| `Legendary Upgrades` | 2 |
| `Fractal Capacitor` | 1 |

## 2 — 15 composants en arbitrage sans page au dépôt

Cités dans `ARBITRAGES.md`. Leur boîte Recipe et leur table vendeur
tranchent une partie des désaccords — en particulier si le vendeur propose
un **choix** ou une **liste**, ce que la capture aplatie ne dit pas.

| page wiki | désaccords portés |
|---|---:|
| `Glob of Ectoplasm` | 48 |
| `Amalgamated Gemstone` | 44 |
| `Mystic Clover` | 18 |
| `Pile of Crystalline Dust` | 14 |
| `Bloodstone Shard` | 13 |
| `Mystic Coin` | 6 |
| `Aether-Rich Sap` | 4 |
| `Antiquated Ducat` | 4 |
| `Obsidian Shard` | 4 |
| `Emblem of the Conqueror` | 2 |
| `Memory of Battle` | 2 |
| `Research Note` | 2 |
| `Testimony of Jade Heroics` | 2 |
| `Thermocatalytic Reagent` | 2 |
| `Vial of Titan Melted Liquid Obsidian` | 2 |

## 3 — 159 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Airship Part` |
| `Ars Goetia` |
| `Banner of the Commander` |
| `Banner Pennon` |
| `Case of Captured Lightning` |
| `Certificate of Support` |
| `Clot of Congealed Screams` |
| `Concentrated Chromatic Sap` |
| `Deldrimor Steel Ingot` |
| `Deldrimor Steel Spear Head` |
| `Discounted Shard of Janthir Syntri` |
| `Discounted Shard of Lowland Shore` |
| `Discounted Shard of Mistburned Barrens` |
| `Diviner's Orichalcum-Imbued Inscription` |
| `Dragonsblood Weapons` |
| `Eel Statue` |
| `Emblem of the Avenger` |
| `Emerald Orb` |
| `Exquisite Serpentite Jewel` |
| `Fractalline Dust` |
| `Fractalline Spark` |
| `Gift of Adventure` |
| `Gift of Arid Mastery` |
| `Gift of Blood` |
| `Gift of Bloodstone Magic` |
| `Gift of Bolt` |
| `Gift of Bones` |
| `Gift of Claws` |
| `Gift of Color` |
| `Gift of Compassion` |
| `Gift of Competitive Dedication` |
| `Gift of Complex Emotions` |
| `Gift of Crystalline Magic` |
| `Gift of Darkness` |
| `Gift of Dedication` |
| `Gift of Draconic Mastery` |
| `Gift of Dragon Magic` |
| `Gift of Dust` |
| `Gift of Embracing Refuge` |
| `Gift of Entertainment` |
| `Gift of Ephemeral Magic` |
| `Gift of Eternity's Garden Exploration` |
| `Gift of Family` |
| `Gift of Fangs` |
| `Gift of Fractals` |
| `Gift of Frenzy` |
| `Gift of Frostfang` |
| `Gift of Gliding` |
| `Gift of History` |
| `Gift of Howler` |
| `Gift of Ice` |
| `Gift of Incinerator` |
| `Gift of Insight` |
| `Gift of Janthir Wanderlust` |
| `Gift of Kamohoali'i Kotaki` |
| `Gift of Kraitkin` |
| `Gift of Kudzu` |
| `Gift of Light` |
| `Gift of Lightning` |
| `Gift of Magic` |
| `Gift of Maguuma` |
| `Gift of Meteorlogicus` |
| `Gift of Might` |
| `Gift of Music` |
| `Gift of Nature` |
| `Gift of Magical / Mighty Prosperity` |
| `Gift of Prowess` |
| `Gift of Quip` |
| `Gift of Recollector of Memories` |
| `Gift of Regrowth` |
| `Gift of Restoration` |
| `Gift of Rodgort` |
| `Gift of Scales` |
| `Gift of Sharpened Tip` |
| `Gift of Shipwreck Strand Exploration` |
| `Gift of Souls` |
| `Gift of Starlit Weald Exploration` |
| `Gift of Stealth` |
| `Gift of Sunrise` |
| `Gift of the Appetizer` |
| `Gift of the Astral Ward` |
| `Gift of The Bifrost` |
| `Gift of the Catalyst` |
| `Gift of the Cosmos` |
| `Gift of the Desolation` |
| `Gift of the Dessert` |
| `Gift of The Dreamer` |
| `Gift of the Entrée` |
| `Gift of The Flameseeker Prophecies` |
| `Gift of the Homesteader` |
| `Gift of The Juggernaut` |
| `Gift of The Minstrel` |
| `Gift of the Mist Warrior` |
| `Gift of the Mistwalker` |
| `Gift of The Moot` |
| `Gift of the Mursaat Ruins` |
| `Gift of the Pact` |
| `Gift of The Predator` |
| `Gift of the Raven Spirit` |
| `Gift of the Side Course` |
| `Gift of the Warclaw` |
| `Gift of Titan Understanding` |
| `Gift of Totems` |
| `Gift of Twilight` |
| `Gift of Valor` |
| `Gift of Venom` |
| `Gift of War Prosperity` |
| `Gift of Warfare` |
| `Gift of Water` |
| `Gift of Weather` |
| `Gift of Wood` |
| `Glob of Coagulated Mists Essence` |
| `Grandmaster Mark Shard` |
| `Hateful Sworl` |
| `Hymn of Glory` |
| `Lacquered Banner Pole` |
| `Large Spiritwood Haft` |
| `Legendary Shards (Gen2)` |
| `Legendary Shards (Gen3 / Aurene)` |
| `Ley Line Crystal` |
| `Lump of Aurillium` |
| `Mistwalker Infusion` |
| `Monument of Legends` |
| `Mystic Essence of Animosity` |
| `Mystic Essence of Annihilation` |
| `Mystic Essence of Carnage` |
| `Mystic Essence of Strategy` |
| `Olmakhan Bandolier (chaîne)` |
| `Orrian Truffle` |
| `Patron of the Magical Arts Plaque` |
| `Perfect Mist Core` |
| `Pile of Recycled Siege Equipment` |
| `Pouch of Stardust` |
| `Preserved Eidolon Hide` |
| `Pristine Mist Essence` |
| `Refined Envoy armor` |
| `Ruby Orb` |
| `Sapphire Orb` |
| `Seer Wreath of Service` |
| `Shadowstone Containment Frame` |
| `Shadowstone Orb` |
| `Shark Statue` |
| `Shattered Gift of Prescience` |
| `So It Is Written` |
| `Solution: Unbound` |
| `Spinal Blade Back Pack (Perfected)` |
| `Spiritwood Plank` |
| `Standing Stones Timepiece` |
| `Survivor's Enchanted Compass` |
| `Tapestry of Sacrifice` |
| `The Thrill of Battle` |
| `Third Order Mist Frame` |
| `Unbound` |
| `Unbound Wings` |
| `Unicorn Statue` |
| `Valkyrie Bearkin War Helm` |
| `Vial of Liquid Flame` |
| `Vial of Quicksilver` |
| `Wolf Statue` |

## 4 — 32 collections incomplètes, dont 27 sans capture

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
| ○ | `Legendary Weapon: Eternity` | Eternity | 7250 | sans unlock |
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
| ● | `Forge Guard's Armor Collection` | Stella Radians | 9330 | sans unlock |
| ● | `Glimmering Resin Weapon Collector` | Stella Radians | 9344 | sans unlock |
| ● | `Vision I: Awakening` | Vision | 4762 | sans unlock |
| ● | `Vision II: Farsight` | Vision | 4771 | sans unlock |
