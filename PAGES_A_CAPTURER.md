# Pages wiki à capturer

Calculé depuis `gw2_sources_v328.json` et `ressources/INDEX_CONTENU.json` par
`gw2_pages_a_capturer_v12.py`. **Ne pas éditer à la main** : régénérer.

Une page déjà au dépôt n'est jamais redemandée — l'index de contenu est
interrogé avant toute ligne. Chaque page à capturer figure une seule fois,
avec son URL, dans la section « URLs » en fin de fichier.


## 0 — 10 trous de l'arbre — LA PRIORITÉ

Ces composants ont des enfants dans la donnée, mais ni boîte Recipe ni
coût vendeur au dépôt : l'arbre sait qu'il faut les fabriquer, il ne sait
pas avec quoi. Tant qu'ils manquent, le calcul de bas en haut s'arrête là
et les totaux restent tributaires des coûts recopiés à plat.

| page wiki | composants qui en dépendent |
|---|---:|

### 0 ter — 10 trous dont la page est DÉJÀ au dépôt

Leur page existe mais ne porte ni boîte Recipe ni coût vendeur :
page de catégorie, de monnaie, ou objet non fabricable. Aucune
capture n'y changera rien — le trou se règle dans la donnée.

- `Astral Weapons`
- `Augur's Stone`
- `Bloodstone Shard`
- `Fractalline Spark`
- `Gift of the Desolation`
- `Gift of the Highlands`
- `Gift of the Oasis`
- `Gift of the Riverlands`
- `Perfect Mist Core`
- `Spark of Sentience`

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

## 3 — 107 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Askur Camping Cookout Backpiece` |
| `Binding of the Dragon` |
| `Bowl of Black Pepper Cactus Salad` |
| `Bowl of Passion Fruit Tapioca Pudding` |
| `Bowl of Poultry Satay` |
| `Bowl of Prickly Pear Sorbet` |
| `Call of the Void` |
| `Carcharias` |
| `Chaos Gun` |
| `Claw of Resolution` |
| `Dark Matter` |
| `Dawn` |
| `Dragon's Argument` |
| `Dragon's Bite` |
| `Dragon's Breath` |
| `Dragon's Claw (weapon)` |
| `Dragon's Fang` |
| `Dragon's Flight` |
| `Dragon's Gaze` |
| `Dragon's Insight` |
| `Dragon's Persuasion` |
| `Dragon's Rending` |
| `Dragon's Scale` |
| `Dragon's Tail` |
| `Dragon's Voice` |
| `Dragon's Weight` |
| `Dragon's Wing` |
| `Dragon's Wisdom` |
| `Dusk` |
| `Endeavor` |
| `Exitare` |
| `Friendship` |
| `Gift of Ascalon` |
| `Gift of Baelfire` |
| `Gift of Janthir Syntri` |
| `Gift of Knowledge` |
| `Gift of Lowland Shore` |
| `Gift of the Forgeman` |
| `Gift of the Nobleman` |
| `Gift of the Sanctuary` |
| `Gift of the Ursus` |
| `Gift of Thorns` |
| `Gift of Zhaitan` |
| `Howl` |
| `Jar of Distilled Glory` |
| `Leaf of Kudzu` |
| `Legendary Insight (consumable)` |
| `Liturgy` |
| `Man o' War` |
| `Meaty Asparagus Skewer` |
| `Memory of Bearkin's Adversaries` |
| `Memory of the Bearkin's Hunts` |
| `Memory of the Bearkin's Victories` |
| `Might of Arah` |
| `Orichalcum Plated Dowel` |
| `Plate of Orrian Steak Frittes` |
| `Plate of Spicy Herbed Chicken` |
| `Plate of Truffle Steak` |
| `Prototype` |
| `Rage (weapon)` |
| `Rare Essence of Luck` |
| `Record of League Participation` |
| `Red-Lentil Saobosa` |
| `Relic` |
| `Rodgort's Flame` |
| `Salmon of Knowledge Backpiece` |
| `Save the Queen` |
| `Spark (weapon)` |
| `Spero` |
| `Spicy Marinated Mushroom` |
| `Spirit of the Jackal` |
| `Spirit of the Raptor` |
| `Spirit of the Skimmer` |
| `Spirit of the Springer` |
| `Star of Glory` |
| `Storm` |
| `Superior Sigil of Accuracy` |
| `Superior Sigil of Air` |
| `Superior Sigil of Battle` |
| `Superior Sigil of Benevolence` |
| `Superior Sigil of Blood` |
| `Superior Sigil of Celerity` |
| `Superior Sigil of Energy` |
| `Superior Sigil of Fire` |
| `Superior Sigil of Force` |
| `Superior Sigil of Ice` |
| `Superior Sigil of Nullification` |
| `Superior Sigil of Purity` |
| `Superior Sigil of Rage` |
| `Superior Sigil of Stamina` |
| `Superior Sigil of Strength` |
| `Superior Sigil of Venom` |
| `The Bard` |
| `The Chosen` |
| `The Colossus` |
| `The Energizer` |
| `The Hunter` |
| `The Legend` |
| `The Lover` |
| `The Mechanism` |
| `The Raven Staff` |
| `Tigris` |
| `Tlehco` |
| `Tooth of Frostfang` |
| `Unidentified Dye` |
| `Venom (weapon)` |
| `Zap` |

## 3 bis — 123 composants dont le coût d'obtention est inconnu

Exigés par l'arbre, identifiés, mais sans page : on sait combien il en
faut, pas comment on les obtient.

| page wiki |
|---|
| `Askur Camping Cookout Backpiece` |
| `Binding of the Dragon` |
| `Bolt of Damask` |
| `Bowl of Black Pepper Cactus Salad` |
| `Bowl of Passion Fruit Tapioca Pudding` |
| `Bowl of Poultry Satay` |
| `Bowl of Prickly Pear Sorbet` |
| `Call of the Void` |
| `Carcharias` |
| `Chaos Gun` |
| `Charged Titan Ore` |
| `Charm of Brilliance` |
| `Charm of Potence` |
| `Charm of Skill` |
| `Chrysocola Crystal` |
| `Claw of Resolution` |
| `Dark Matter` |
| `Dawn` |
| `Dragon's Argument` |
| `Dragon's Bite` |
| `Dragon's Breath` |
| `Dragon's Claw (weapon)` |
| `Dragon's Fang` |
| `Dragon's Flight` |
| `Dragon's Gaze` |
| `Dragon's Insight` |
| `Dragon's Persuasion` |
| `Dragon's Rending` |
| `Dragon's Scale` |
| `Dragon's Tail` |
| `Dragon's Voice` |
| `Dragon's Weight` |
| `Dragon's Wing` |
| `Dragon's Wisdom` |
| `Dusk` |
| `Elonian Leather Square` |
| `Endeavor` |
| `Exitare` |
| `Friendship` |
| `Gift of Ascalon` |
| `Gift of Baelfire` |
| `Gift of Janthir Syntri` |
| `Gift of Knowledge` |
| `Gift of Lowland Shore` |
| `Gift of the Forgeman` |
| `Gift of the Nobleman` |
| `Gift of the Sanctuary` |
| `Gift of the Ursus` |
| `Gift of Thorns` |
| `Gift of Zhaitan` |
| `Glob of Elder Spirit Residue` |
| `Gold Ingot` |
| `Howl` |
| `Leaf of Kudzu` |
| `Legendary Insight (consumable)` |
| `Liturgy` |
| `Man o' War` |
| `Meaty Asparagus Skewer` |
| `Memory of Bearkin's Adversaries` |
| `Memory of the Bearkin's Hunts` |
| `Memory of the Bearkin's Victories` |
| `Might of Arah` |
| `Orichalcum Plated Dowel` |
| `Plate of Orrian Steak Frittes` |
| `Plate of Spicy Herbed Chicken` |
| `Plate of Truffle Steak` |
| `Prototype` |
| `Rage (weapon)` |
| `Rare Essence of Luck` |
| `Red-Lentil Saobosa` |
| `Refined Homestead Fiber` |
| `Refined Homestead Metal` |
| `Refined Homestead Wood` |
| `Relic` |
| `Rodgort's Flame` |
| `Rotted Titan Amber` |
| `Salmon of Knowledge Backpiece` |
| `Save the Queen` |
| `Silver Ingot` |
| `Soft Wood Plank` |
| `Spark (weapon)` |
| `Spero` |
| `Spicy Marinated Mushroom` |
| `Spirit of the Jackal` |
| `Spirit of the Raptor` |
| `Spirit of the Skimmer` |
| `Spirit of the Springer` |
| `Storm` |
| `Superior Sigil of Accuracy` |
| `Superior Sigil of Air` |
| `Superior Sigil of Battle` |
| `Superior Sigil of Benevolence` |
| `Superior Sigil of Blood` |
| `Superior Sigil of Celerity` |
| `Superior Sigil of Energy` |
| `Superior Sigil of Fire` |
| `Superior Sigil of Force` |
| `Superior Sigil of Ice` |
| `Superior Sigil of Nullification` |
| `Superior Sigil of Purity` |
| `Superior Sigil of Rage` |
| `Superior Sigil of Stamina` |
| `Superior Sigil of Strength` |
| `Superior Sigil of Venom` |
| `Sweet-Treated Pine Plank` |
| `Symbol of Control` |
| `Symbol of Enhancement` |
| `Symbol of Pain` |
| `The Bard` |
| `The Chosen` |
| `The Colossus` |
| `The Energizer` |
| `The Hunter` |
| `The Legend` |
| `The Lover` |
| `The Mechanism` |
| `The Raven Staff` |
| `Tigris` |
| `Tlehco` |
| `Tooth of Frostfang` |
| `Unidentified Dye` |
| `Venom (weapon)` |
| `Zap` |

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

## URLs — 126 pages à capturer

```
https://wiki.guildwars2.com/wiki/Askur_Camping_Cookout_Backpiece
https://wiki.guildwars2.com/wiki/Binding_of_the_Dragon
https://wiki.guildwars2.com/wiki/Bowl_of_Black_Pepper_Cactus_Salad
https://wiki.guildwars2.com/wiki/Bowl_of_Passion_Fruit_Tapioca_Pudding
https://wiki.guildwars2.com/wiki/Bowl_of_Poultry_Satay
https://wiki.guildwars2.com/wiki/Bowl_of_Prickly_Pear_Sorbet
https://wiki.guildwars2.com/wiki/Call_of_the_Void
https://wiki.guildwars2.com/wiki/Carcharias
https://wiki.guildwars2.com/wiki/Chaos_Gun
https://wiki.guildwars2.com/wiki/Claw_of_Resolution
https://wiki.guildwars2.com/wiki/Dark_Matter
https://wiki.guildwars2.com/wiki/Dawn
https://wiki.guildwars2.com/wiki/Dragon%27s_Argument
https://wiki.guildwars2.com/wiki/Dragon%27s_Bite
https://wiki.guildwars2.com/wiki/Dragon%27s_Breath
https://wiki.guildwars2.com/wiki/Dragon%27s_Claw_(weapon)
https://wiki.guildwars2.com/wiki/Dragon%27s_Fang
https://wiki.guildwars2.com/wiki/Dragon%27s_Flight
https://wiki.guildwars2.com/wiki/Dragon%27s_Gaze
https://wiki.guildwars2.com/wiki/Dragon%27s_Insight
https://wiki.guildwars2.com/wiki/Dragon%27s_Persuasion
https://wiki.guildwars2.com/wiki/Dragon%27s_Rending
https://wiki.guildwars2.com/wiki/Dragon%27s_Scale
https://wiki.guildwars2.com/wiki/Dragon%27s_Tail
https://wiki.guildwars2.com/wiki/Dragon%27s_Voice
https://wiki.guildwars2.com/wiki/Dragon%27s_Weight
https://wiki.guildwars2.com/wiki/Dragon%27s_Wing
https://wiki.guildwars2.com/wiki/Dragon%27s_Wisdom
https://wiki.guildwars2.com/wiki/Dusk
https://wiki.guildwars2.com/wiki/Endeavor
https://wiki.guildwars2.com/wiki/Exitare
https://wiki.guildwars2.com/wiki/Friendship
https://wiki.guildwars2.com/wiki/Gift_of_Ascalon
https://wiki.guildwars2.com/wiki/Gift_of_Baelfire
https://wiki.guildwars2.com/wiki/Gift_of_Janthir_Syntri
https://wiki.guildwars2.com/wiki/Gift_of_Knowledge
https://wiki.guildwars2.com/wiki/Gift_of_Lowland_Shore
https://wiki.guildwars2.com/wiki/Gift_of_the_Forgeman
https://wiki.guildwars2.com/wiki/Gift_of_the_Nobleman
https://wiki.guildwars2.com/wiki/Gift_of_the_Sanctuary
https://wiki.guildwars2.com/wiki/Gift_of_the_Ursus
https://wiki.guildwars2.com/wiki/Gift_of_Thorns
https://wiki.guildwars2.com/wiki/Gift_of_Zhaitan
https://wiki.guildwars2.com/wiki/Howl
https://wiki.guildwars2.com/wiki/Jar_of_Distilled_Glory
https://wiki.guildwars2.com/wiki/Leaf_of_Kudzu
https://wiki.guildwars2.com/wiki/Legendary_Insight_(consumable)
https://wiki.guildwars2.com/wiki/Liturgy
https://wiki.guildwars2.com/wiki/Man_o%27_War
https://wiki.guildwars2.com/wiki/Meaty_Asparagus_Skewer
https://wiki.guildwars2.com/wiki/Memory_of_Bearkin%27s_Adversaries
https://wiki.guildwars2.com/wiki/Memory_of_the_Bearkin%27s_Hunts
https://wiki.guildwars2.com/wiki/Memory_of_the_Bearkin%27s_Victories
https://wiki.guildwars2.com/wiki/Might_of_Arah
https://wiki.guildwars2.com/wiki/Orichalcum_Plated_Dowel
https://wiki.guildwars2.com/wiki/Plate_of_Orrian_Steak_Frittes
https://wiki.guildwars2.com/wiki/Plate_of_Spicy_Herbed_Chicken
https://wiki.guildwars2.com/wiki/Plate_of_Truffle_Steak
https://wiki.guildwars2.com/wiki/Prototype
https://wiki.guildwars2.com/wiki/Rage_(weapon)
https://wiki.guildwars2.com/wiki/Rare_Essence_of_Luck
https://wiki.guildwars2.com/wiki/Record_of_League_Participation
https://wiki.guildwars2.com/wiki/Red-Lentil_Saobosa
https://wiki.guildwars2.com/wiki/Relic
https://wiki.guildwars2.com/wiki/Rodgort%27s_Flame
https://wiki.guildwars2.com/wiki/Salmon_of_Knowledge_Backpiece
https://wiki.guildwars2.com/wiki/Save_the_Queen
https://wiki.guildwars2.com/wiki/Spark_(weapon)
https://wiki.guildwars2.com/wiki/Spero
https://wiki.guildwars2.com/wiki/Spicy_Marinated_Mushroom
https://wiki.guildwars2.com/wiki/Spirit_of_the_Jackal
https://wiki.guildwars2.com/wiki/Spirit_of_the_Raptor
https://wiki.guildwars2.com/wiki/Spirit_of_the_Skimmer
https://wiki.guildwars2.com/wiki/Spirit_of_the_Springer
https://wiki.guildwars2.com/wiki/Star_of_Glory
https://wiki.guildwars2.com/wiki/Storm
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Accuracy
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Air
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Battle
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Benevolence
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Blood
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Celerity
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Energy
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Fire
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Force
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Ice
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Nullification
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Purity
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Rage
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Stamina
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Strength
https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Venom
https://wiki.guildwars2.com/wiki/The_Bard
https://wiki.guildwars2.com/wiki/The_Chosen
https://wiki.guildwars2.com/wiki/The_Colossus
https://wiki.guildwars2.com/wiki/The_Energizer
https://wiki.guildwars2.com/wiki/The_Hunter
https://wiki.guildwars2.com/wiki/The_Legend
https://wiki.guildwars2.com/wiki/The_Lover
https://wiki.guildwars2.com/wiki/The_Mechanism
https://wiki.guildwars2.com/wiki/The_Raven_Staff
https://wiki.guildwars2.com/wiki/Tigris
https://wiki.guildwars2.com/wiki/Tlehco
https://wiki.guildwars2.com/wiki/Tooth_of_Frostfang
https://wiki.guildwars2.com/wiki/Unidentified_Dye
https://wiki.guildwars2.com/wiki/Venom_(weapon)
https://wiki.guildwars2.com/wiki/Zap
https://wiki.guildwars2.com/wiki/Bolt_of_Damask
https://wiki.guildwars2.com/wiki/Charged_Titan_Ore
https://wiki.guildwars2.com/wiki/Charm_of_Brilliance
https://wiki.guildwars2.com/wiki/Charm_of_Potence
https://wiki.guildwars2.com/wiki/Charm_of_Skill
https://wiki.guildwars2.com/wiki/Chrysocola_Crystal
https://wiki.guildwars2.com/wiki/Elonian_Leather_Square
https://wiki.guildwars2.com/wiki/Glob_of_Elder_Spirit_Residue
https://wiki.guildwars2.com/wiki/Gold_Ingot
https://wiki.guildwars2.com/wiki/Refined_Homestead_Fiber
https://wiki.guildwars2.com/wiki/Refined_Homestead_Metal
https://wiki.guildwars2.com/wiki/Refined_Homestead_Wood
https://wiki.guildwars2.com/wiki/Rotted_Titan_Amber
https://wiki.guildwars2.com/wiki/Silver_Ingot
https://wiki.guildwars2.com/wiki/Soft_Wood_Plank
https://wiki.guildwars2.com/wiki/Sweet-Treated_Pine_Plank
https://wiki.guildwars2.com/wiki/Symbol_of_Control
https://wiki.guildwars2.com/wiki/Symbol_of_Enhancement
https://wiki.guildwars2.com/wiki/Symbol_of_Pain
```
