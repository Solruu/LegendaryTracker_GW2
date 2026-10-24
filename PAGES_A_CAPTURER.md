# Pages wiki à capturer

Calculé depuis `gw2_sources_v424.json` et `ressources/INDEX_CONTENU.json` par
`gw2_pages_a_capturer_v14.py`. **Ne pas éditer à la main** : régénérer.

Une page déjà au dépôt n'est jamais redemandée — l'index de contenu est
interrogé avant toute ligne. Chaque page à capturer figure une seule fois,
avec son URL, dans la section « URLs » en fin de fichier.


## 0 — 84 trous de l'arbre — LA PRIORITÉ

Ces composants ont des enfants dans la donnée, mais ni boîte Recipe ni
coût vendeur au dépôt : l'arbre sait qu'il faut les fabriquer, il ne sait
pas avec quoi. Tant qu'ils manquent, le calcul de bas en haut s'arrête là
et les totaux restent tributaires des coûts recopiés à plat.

| page wiki | composants qui en dépendent |
|---|---:|
| `Advanced Ammunition Cylinder` | 4 |
| `Balanced Counterweight` | 4 |
| `Bowl of Mushroom Paste` | 4 |
| `Colored Paper` | 4 |
| `Engraver's Tools` | 4 |
| `Experimental Harpoon` | 4 |
| `Experimental Horn` | 4 |
| `Finely Tuned Firing Pin` | 4 |
| `Jar of Luminesce Polish` | 4 |
| `Legendary Underwater Inscription` | 4 |
| `Prismatic Lodestone` | 4 |
| `Quiche of Darkness Vegetable Mix` | 4 |
| `Raven Statue` | 4 |
| `Rune Carving Tools` | 4 |
| `Soros' Assassin Inscription` | 4 |
| `Stonecleaver's Valkyrie Inscription` | 4 |
| `Vial of Cadmium Salts` | 4 |
| `Visage of Champawat` | 4 |
| `Visage of Chuka` | 4 |
| `Assassin's Orichalcum Imbued Inscription` | 3 |
| `Experimental Axe Blade` | 3 |
| `Experimental Axe Haft` | 3 |
| `Experimental Dagger Blade` | 3 |
| `Experimental Dagger Hilt` | 3 |
| `Experimental Daysword Blade` | 3 |
| `Experimental Daysword Hilt` | 3 |
| `Experimental Focus Casing` | 3 |
| `Experimental Focus Core` | 3 |
| `Experimental Hammer Haft` | 3 |
| `Experimental Hammer Head` | 3 |
| `Experimental Harpoon Gun Stock` | 3 |
| `Experimental Longbow Stave` | 3 |
| `Experimental Longbow String` | 3 |
| `Experimental Mace Haft` | 3 |
| `Experimental Mace Head` | 3 |
| `Experimental Nightsword Blade` | 3 |
| `Experimental Nightsword Hilt` | 3 |
| `Experimental Pistol Barrel` | 3 |
| `Experimental Pistol Frame` | 3 |
| `Experimental Rifle Barrel` | 3 |
| `Experimental Rifle Stock` | 3 |
| `Experimental Scepter Core` | 3 |
| `Experimental Scepter Rod` | 3 |
| `Experimental Shield Backing` | 3 |
| `Experimental Shield Boss` | 3 |
| `Experimental Short Bow Stave` | 3 |
| `Experimental Short Bow String` | 3 |
| `Experimental Spear Haft` | 3 |
| `Experimental Spear Head` | 3 |
| `Experimental Staff Head` | 3 |
| `Experimental Staff Shaft` | 3 |
| `Experimental Sword Blade` | 3 |
| `Experimental Sword Hilt` | 3 |
| `Experimental Torch Handle` | 3 |
| `Experimental Torch Head` | 3 |
| `Experimental Trident Head` | 3 |
| `Experimental Trident Shaft` | 3 |
| `Experimental Warhorn Mouthpiece` | 3 |
| `Hunter's Short-Bow Stave` | 3 |
| `Hunter's Short-Bow String` | 3 |
| `Sheet of Coarse Paper` | 3 |
| `Sheet of Quality Paper` | 3 |
| `Sunstone Nugget` | 3 |
| `Valkyrie Orichalcum Imbued Inscription` | 3 |
| `Deldrimor Steel Plated Dowel` | 2 |
| `Elder Harpoon` | 2 |
| `Purified Rift Essence` | 2 |
| `Sheet of Ambrite` | 2 |
| `Sunstone Lump` | 2 |

### 0 ter — 15 trous dont la page est DÉJÀ au dépôt

Leur page existe mais ne porte ni boîte Recipe ni coût vendeur :
page de catégorie, de monnaie, ou objet non fabricable. Aucune
capture n'y changera rien — le trou se règle dans la donnée.

- `Astral Weapons`
- `Augur's Stone`
- `Bloodstone Shard`
- `Druid Runestone`
- `Fractal Journal`
- `Fractalline Spark`
- `Gift of the Desolation`
- `Gift of the Highlands`
- `Gift of the Oasis`
- `Gift of the Riverlands`
- `Hydrocatalytic Reagent`
- `Perfect Mist Core`
- `Spirit of the Finite Result`
- `Spirit of the Upper Bound`
- `Sun Bead`

## 1 — 0 tables « Full material list » manquantes

Ces cibles portent des coûts à plat mais leur page n'est pas capturée avec
sa table de matériaux. Sans elle, l'arbre ne peut pas se déplier : il
ignore ce que la cible contient réellement.

| page wiki | coûts à plat concernés |
|---|---:|

## 2 — 0 composants en arbitrage sans page au dépôt

Cités dans `ARBITRAGES.md`. Leur boîte Recipe et leur table vendeur
tranchent une partie des désaccords — en particulier si le vendeur propose
un **choix** ou une **liste**, ce que la capture aplatie ne dit pas.

| page wiki | désaccords portés |
|---|---:|

## 3 — 11 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Exotic Essence of Luck` |
| `Fruits of the Shadow` |
| `Gift of Infinity` |
| `Gift of the Hylek` |
| `Gift of the Obscure` |
| `Gift of the Seas` |
| `Glimpse` |
| `Glob of Condensed Spirit Energy` |
| `Memories of Aurene` |
| `Mist Pendant` |
| `Testimony of Heroics` |

## 3 bis — 31 composants dont le coût d'obtention est inconnu

Exigés par l'arbre, identifiés, mais sans page : on sait combien il en
faut, pas comment on les obtient.

| page wiki |
|---|
| `Black Diamond` |
| `Cheese Wedge` |
| `Cherry` |
| `Copper Doubloon` |
| `Corrupted Core` |
| `Crystal Core` |
| `Destroyer Core` |
| `Drop of Indigo Mushroom Milk` |
| `Glacial Core` |
| `Gossamer Scrap` |
| `Green Onion` |
| `Harpy Feathers` |
| `Indigo Mushroom` |
| `Jar of Paint Base` |
| `Karka Shell` |
| `Piece of Ambrite` |
| `Pile of Glittering Dust` |
| `Pouch of Blue Pigment` |
| `Pouch of Green Pigment` |
| `Pouch of Orange Pigment` |
| `Pouch of Purple Pigment` |
| `Pouch of Red Pigment` |
| `Pouch of Yellow Pigment` |
| `Purple Potato` |
| `Rice Ball` |
| `Sapphire Crystal` |
| `Seaweed` |
| `Sheet of Aurillium` |
| `Spinach Leaf` |
| `Tarragon Leaves` |
| `Tiger's Eye Pebble` |

## 4 — 0 collections incomplètes — 0 introuvables au dépôt

Une collection est incomplète tant qu'elle n'a ni ses étapes ni sa chaîne
de déblocage, et qu'elle ne déclare pas leur absence avec `absences_ref`
— drapeau qui exige la capture prouvant qu'il n'y a rien à décrire.

La colonne « où le lire » nomme la capture qui porte l'information, et
comment elle s'y trouve : `bloc` pour l'ancre `#achievementNNNN`, `cité`
pour un lien vers cette ancre, `nommé` pour une page qui en parle sans
ancre. Beaucoup de ces succès sont des LIGNES d'une collection, pas des
articles : leur titre n'est pas une URL, et les chercher sur le wiki
renvoie 404. Rien ici ne part dans la section « URLs ».

| | succès | légendaire | id | ce qui manque | où le lire | comment |
|---|---|---|---:|---|---|---|

## URLs — 111 pages à capturer

```
https://wiki.guildwars2.com/wiki/Advanced_Ammunition_Cylinder
https://wiki.guildwars2.com/wiki/Balanced_Counterweight
https://wiki.guildwars2.com/wiki/Bowl_of_Mushroom_Paste
https://wiki.guildwars2.com/wiki/Colored_Paper
https://wiki.guildwars2.com/wiki/Engraver%27s_Tools
https://wiki.guildwars2.com/wiki/Experimental_Harpoon
https://wiki.guildwars2.com/wiki/Experimental_Horn
https://wiki.guildwars2.com/wiki/Finely_Tuned_Firing_Pin
https://wiki.guildwars2.com/wiki/Jar_of_Luminesce_Polish
https://wiki.guildwars2.com/wiki/Legendary_Underwater_Inscription
https://wiki.guildwars2.com/wiki/Prismatic_Lodestone
https://wiki.guildwars2.com/wiki/Quiche_of_Darkness_Vegetable_Mix
https://wiki.guildwars2.com/wiki/Raven_Statue
https://wiki.guildwars2.com/wiki/Rune_Carving_Tools
https://wiki.guildwars2.com/wiki/Soros%27_Assassin_Inscription
https://wiki.guildwars2.com/wiki/Stonecleaver%27s_Valkyrie_Inscription
https://wiki.guildwars2.com/wiki/Vial_of_Cadmium_Salts
https://wiki.guildwars2.com/wiki/Visage_of_Champawat
https://wiki.guildwars2.com/wiki/Visage_of_Chuka
https://wiki.guildwars2.com/wiki/Assassin%27s_Orichalcum_Imbued_Inscription
https://wiki.guildwars2.com/wiki/Experimental_Axe_Blade
https://wiki.guildwars2.com/wiki/Experimental_Axe_Haft
https://wiki.guildwars2.com/wiki/Experimental_Dagger_Blade
https://wiki.guildwars2.com/wiki/Experimental_Dagger_Hilt
https://wiki.guildwars2.com/wiki/Experimental_Daysword_Blade
https://wiki.guildwars2.com/wiki/Experimental_Daysword_Hilt
https://wiki.guildwars2.com/wiki/Experimental_Focus_Casing
https://wiki.guildwars2.com/wiki/Experimental_Focus_Core
https://wiki.guildwars2.com/wiki/Experimental_Hammer_Haft
https://wiki.guildwars2.com/wiki/Experimental_Hammer_Head
https://wiki.guildwars2.com/wiki/Experimental_Harpoon_Gun_Stock
https://wiki.guildwars2.com/wiki/Experimental_Longbow_Stave
https://wiki.guildwars2.com/wiki/Experimental_Longbow_String
https://wiki.guildwars2.com/wiki/Experimental_Mace_Haft
https://wiki.guildwars2.com/wiki/Experimental_Mace_Head
https://wiki.guildwars2.com/wiki/Experimental_Nightsword_Blade
https://wiki.guildwars2.com/wiki/Experimental_Nightsword_Hilt
https://wiki.guildwars2.com/wiki/Experimental_Pistol_Barrel
https://wiki.guildwars2.com/wiki/Experimental_Pistol_Frame
https://wiki.guildwars2.com/wiki/Experimental_Rifle_Barrel
https://wiki.guildwars2.com/wiki/Experimental_Rifle_Stock
https://wiki.guildwars2.com/wiki/Experimental_Scepter_Core
https://wiki.guildwars2.com/wiki/Experimental_Scepter_Rod
https://wiki.guildwars2.com/wiki/Experimental_Shield_Backing
https://wiki.guildwars2.com/wiki/Experimental_Shield_Boss
https://wiki.guildwars2.com/wiki/Experimental_Short_Bow_Stave
https://wiki.guildwars2.com/wiki/Experimental_Short_Bow_String
https://wiki.guildwars2.com/wiki/Experimental_Spear_Haft
https://wiki.guildwars2.com/wiki/Experimental_Spear_Head
https://wiki.guildwars2.com/wiki/Experimental_Staff_Head
https://wiki.guildwars2.com/wiki/Experimental_Staff_Shaft
https://wiki.guildwars2.com/wiki/Experimental_Sword_Blade
https://wiki.guildwars2.com/wiki/Experimental_Sword_Hilt
https://wiki.guildwars2.com/wiki/Experimental_Torch_Handle
https://wiki.guildwars2.com/wiki/Experimental_Torch_Head
https://wiki.guildwars2.com/wiki/Experimental_Trident_Head
https://wiki.guildwars2.com/wiki/Experimental_Trident_Shaft
https://wiki.guildwars2.com/wiki/Experimental_Warhorn_Mouthpiece
https://wiki.guildwars2.com/wiki/Hunter%27s_Short-Bow_Stave
https://wiki.guildwars2.com/wiki/Hunter%27s_Short-Bow_String
https://wiki.guildwars2.com/wiki/Sheet_of_Coarse_Paper
https://wiki.guildwars2.com/wiki/Sheet_of_Quality_Paper
https://wiki.guildwars2.com/wiki/Sunstone_Nugget
https://wiki.guildwars2.com/wiki/Valkyrie_Orichalcum_Imbued_Inscription
https://wiki.guildwars2.com/wiki/Deldrimor_Steel_Plated_Dowel
https://wiki.guildwars2.com/wiki/Elder_Harpoon
https://wiki.guildwars2.com/wiki/Purified_Rift_Essence
https://wiki.guildwars2.com/wiki/Sheet_of_Ambrite
https://wiki.guildwars2.com/wiki/Sunstone_Lump
https://wiki.guildwars2.com/wiki/Exotic_Essence_of_Luck
https://wiki.guildwars2.com/wiki/Fruits_of_the_Shadow
https://wiki.guildwars2.com/wiki/Gift_of_Infinity
https://wiki.guildwars2.com/wiki/Gift_of_the_Hylek
https://wiki.guildwars2.com/wiki/Gift_of_the_Obscure
https://wiki.guildwars2.com/wiki/Gift_of_the_Seas
https://wiki.guildwars2.com/wiki/Glimpse
https://wiki.guildwars2.com/wiki/Glob_of_Condensed_Spirit_Energy
https://wiki.guildwars2.com/wiki/Memories_of_Aurene
https://wiki.guildwars2.com/wiki/Mist_Pendant
https://wiki.guildwars2.com/wiki/Testimony_of_Heroics
https://wiki.guildwars2.com/wiki/Black_Diamond
https://wiki.guildwars2.com/wiki/Cheese_Wedge
https://wiki.guildwars2.com/wiki/Cherry
https://wiki.guildwars2.com/wiki/Copper_Doubloon
https://wiki.guildwars2.com/wiki/Corrupted_Core
https://wiki.guildwars2.com/wiki/Crystal_Core
https://wiki.guildwars2.com/wiki/Destroyer_Core
https://wiki.guildwars2.com/wiki/Drop_of_Indigo_Mushroom_Milk
https://wiki.guildwars2.com/wiki/Glacial_Core
https://wiki.guildwars2.com/wiki/Gossamer_Scrap
https://wiki.guildwars2.com/wiki/Green_Onion
https://wiki.guildwars2.com/wiki/Harpy_Feathers
https://wiki.guildwars2.com/wiki/Indigo_Mushroom
https://wiki.guildwars2.com/wiki/Jar_of_Paint_Base
https://wiki.guildwars2.com/wiki/Karka_Shell
https://wiki.guildwars2.com/wiki/Piece_of_Ambrite
https://wiki.guildwars2.com/wiki/Pile_of_Glittering_Dust
https://wiki.guildwars2.com/wiki/Pouch_of_Blue_Pigment
https://wiki.guildwars2.com/wiki/Pouch_of_Green_Pigment
https://wiki.guildwars2.com/wiki/Pouch_of_Orange_Pigment
https://wiki.guildwars2.com/wiki/Pouch_of_Purple_Pigment
https://wiki.guildwars2.com/wiki/Pouch_of_Red_Pigment
https://wiki.guildwars2.com/wiki/Pouch_of_Yellow_Pigment
https://wiki.guildwars2.com/wiki/Purple_Potato
https://wiki.guildwars2.com/wiki/Rice_Ball
https://wiki.guildwars2.com/wiki/Sapphire_Crystal
https://wiki.guildwars2.com/wiki/Seaweed
https://wiki.guildwars2.com/wiki/Sheet_of_Aurillium
https://wiki.guildwars2.com/wiki/Spinach_Leaf
https://wiki.guildwars2.com/wiki/Tarragon_Leaves
https://wiki.guildwars2.com/wiki/Tiger%27s_Eye_Pebble
```
