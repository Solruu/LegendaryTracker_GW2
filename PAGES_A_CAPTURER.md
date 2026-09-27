# Pages wiki à capturer

Calculé depuis `gw2_sources_v331.json` et `ressources/INDEX_CONTENU.json` par
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

## 3 — 18 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Bowl of Fancy Tangy Sautee Mix` |
| `Charm (ingredient)` |
| `Deldrimor Steel Dagger Hilt` |
| `Deldrimor Steel Greatsword Hilt` |
| `Deldrimor Steel Shield Backing` |
| `Deldrimor Steel Sword Hilt` |
| `Deldrimor Steel Warhorn Mouthpiece` |
| `Elonian String` |
| `Exquisite Passion Flower` |
| `Grilled Mushroom` |
| `Grilled Portobello Mushroom` |
| `Pile of Zesty Herbs` |
| `Small Spiritwood Haft` |
| `Spiritwood Rifle Stock` |
| `Spiritwood Scepter Rod` |
| `Spiritwood Torch Handle` |
| `Symbol (ingredient)` |
| `Visionary Inscription` |

## 3 bis — 38 composants dont le coût d'obtention est inconnu

Exigés par l'arbre, identifiés, mais sans page : on sait combien il en
faut, pas comment on les obtient.

| page wiki |
|---|
| `Azurite Orb` |
| `Ball of Dough` |
| `Beryl Crystal` |
| `Bowl of Fancy Tangy Sautee Mix` |
| `Cayenne Pepper` |
| `Charged Fossil` |
| `Charged Thorn` |
| `Charm (ingredient)` |
| `Chrysocola Shard` |
| `Deldrimor Steel Dagger Hilt` |
| `Deldrimor Steel Greatsword Hilt` |
| `Deldrimor Steel Shield Backing` |
| `Deldrimor Steel Sword Hilt` |
| `Deldrimor Steel Warhorn Mouthpiece` |
| `Elonian String` |
| `Emerald Crystal` |
| `Exquisite Passion Flower` |
| `Eye of Kormir` |
| `Giant Eye` |
| `Grilled Mushroom` |
| `Grilled Portobello Mushroom` |
| `Handful of Red Lentils` |
| `Honey Flower` |
| `Jar of Vegetable Oil` |
| `Lowland Pine Log` |
| `Pile of Putrid Essence` |
| `Pile of Zesty Herbs` |
| `Ruby Crystal` |
| `Slab of Poultry Meat` |
| `Slab of Red Meat` |
| `Small Spiritwood Haft` |
| `Snow Truffle` |
| `Spiritwood Rifle Stock` |
| `Spiritwood Scepter Rod` |
| `Spiritwood Torch Handle` |
| `Stick of Butter` |
| `Symbol (ingredient)` |
| `Visionary Inscription` |

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

## URLs — 38 pages à capturer

```
https://wiki.guildwars2.com/wiki/Bowl_of_Fancy_Tangy_Sautee_Mix
https://wiki.guildwars2.com/wiki/Charm_(ingredient)
https://wiki.guildwars2.com/wiki/Deldrimor_Steel_Dagger_Hilt
https://wiki.guildwars2.com/wiki/Deldrimor_Steel_Greatsword_Hilt
https://wiki.guildwars2.com/wiki/Deldrimor_Steel_Shield_Backing
https://wiki.guildwars2.com/wiki/Deldrimor_Steel_Sword_Hilt
https://wiki.guildwars2.com/wiki/Deldrimor_Steel_Warhorn_Mouthpiece
https://wiki.guildwars2.com/wiki/Elonian_String
https://wiki.guildwars2.com/wiki/Exquisite_Passion_Flower
https://wiki.guildwars2.com/wiki/Grilled_Mushroom
https://wiki.guildwars2.com/wiki/Grilled_Portobello_Mushroom
https://wiki.guildwars2.com/wiki/Pile_of_Zesty_Herbs
https://wiki.guildwars2.com/wiki/Small_Spiritwood_Haft
https://wiki.guildwars2.com/wiki/Spiritwood_Rifle_Stock
https://wiki.guildwars2.com/wiki/Spiritwood_Scepter_Rod
https://wiki.guildwars2.com/wiki/Spiritwood_Torch_Handle
https://wiki.guildwars2.com/wiki/Symbol_(ingredient)
https://wiki.guildwars2.com/wiki/Visionary_Inscription
https://wiki.guildwars2.com/wiki/Azurite_Orb
https://wiki.guildwars2.com/wiki/Ball_of_Dough
https://wiki.guildwars2.com/wiki/Beryl_Crystal
https://wiki.guildwars2.com/wiki/Cayenne_Pepper
https://wiki.guildwars2.com/wiki/Charged_Fossil
https://wiki.guildwars2.com/wiki/Charged_Thorn
https://wiki.guildwars2.com/wiki/Chrysocola_Shard
https://wiki.guildwars2.com/wiki/Emerald_Crystal
https://wiki.guildwars2.com/wiki/Eye_of_Kormir
https://wiki.guildwars2.com/wiki/Giant_Eye
https://wiki.guildwars2.com/wiki/Handful_of_Red_Lentils
https://wiki.guildwars2.com/wiki/Honey_Flower
https://wiki.guildwars2.com/wiki/Jar_of_Vegetable_Oil
https://wiki.guildwars2.com/wiki/Lowland_Pine_Log
https://wiki.guildwars2.com/wiki/Pile_of_Putrid_Essence
https://wiki.guildwars2.com/wiki/Ruby_Crystal
https://wiki.guildwars2.com/wiki/Slab_of_Poultry_Meat
https://wiki.guildwars2.com/wiki/Slab_of_Red_Meat
https://wiki.guildwars2.com/wiki/Snow_Truffle
https://wiki.guildwars2.com/wiki/Stick_of_Butter
```
