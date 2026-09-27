# Pages wiki à capturer

Calculé depuis `gw2_sources_v333.json` et `ressources/INDEX_CONTENU.json` par
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

## 3 — 3 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Legendary Inscription` |
| `Mystic Crystal` |
| `Pile of Ascalonian Herbs` |

## 3 bis — 19 composants dont le coût d'obtention est inconnu

Exigés par l'arbre, identifiés, mais sans page : on sait combien il en
faut, pas comment on les obtient.

| page wiki |
|---|
| `Amethyst Lump` |
| `Azurite Crystal` |
| `Bag of Flour` |
| `Beryl Shard` |
| `Emerald Shard` |
| `Head of Garlic` |
| `Legendary Inscription` |
| `Mushroom` |
| `Mystic Crystal` |
| `Onion` |
| `Packet of Salt` |
| `Passion Flower` |
| `Pile of Ascalonian Herbs` |
| `Pile of Salt and Pepper` |
| `Pile of Vile Essence` |
| `Portobello Mushroom` |
| `Ruby Shard` |
| `Saffron Thread` |
| `Shallot` |

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

## URLs — 19 pages à capturer

```
https://wiki.guildwars2.com/wiki/Legendary_Inscription
https://wiki.guildwars2.com/wiki/Mystic_Crystal
https://wiki.guildwars2.com/wiki/Pile_of_Ascalonian_Herbs
https://wiki.guildwars2.com/wiki/Amethyst_Lump
https://wiki.guildwars2.com/wiki/Azurite_Crystal
https://wiki.guildwars2.com/wiki/Bag_of_Flour
https://wiki.guildwars2.com/wiki/Beryl_Shard
https://wiki.guildwars2.com/wiki/Emerald_Shard
https://wiki.guildwars2.com/wiki/Head_of_Garlic
https://wiki.guildwars2.com/wiki/Mushroom
https://wiki.guildwars2.com/wiki/Onion
https://wiki.guildwars2.com/wiki/Packet_of_Salt
https://wiki.guildwars2.com/wiki/Passion_Flower
https://wiki.guildwars2.com/wiki/Pile_of_Salt_and_Pepper
https://wiki.guildwars2.com/wiki/Pile_of_Vile_Essence
https://wiki.guildwars2.com/wiki/Portobello_Mushroom
https://wiki.guildwars2.com/wiki/Ruby_Shard
https://wiki.guildwars2.com/wiki/Saffron_Thread
https://wiki.guildwars2.com/wiki/Shallot
```

## Horaires de métas — à capturer (27/09/2026)

Aucun endpoint de l'API ne publie les horaires de métas : `/v1/events` a été
désactivé aux mégaserveurs, la v2 n'a jamais eu d'équivalent. Le wiki est la
seule autorité, et aucune des 20 entrées de `meta_events` ne porte de `ref`.

```
https://wiki.guildwars2.com/wiki/Event_timers
https://wiki.guildwars2.com/wiki/Event_timers/API
https://wiki.guildwars2.com/wiki/Casino_Blitz
https://wiki.guildwars2.com/wiki/Convergence
```

Priorité : `Casino Blitz` (offset 21, seul des vingt à ne pas être un multiple
de 5) et `Convergence` (Outer Nayos — le JSX dit 30, les sources 90, une heure
d'écart). Voir BACKLOG.md § 12.
