# Pages wiki à capturer

Calculé depuis `gw2_sources_v321.json` et `ressources/INDEX_CONTENU.json` par
`gw2_pages_a_capturer_v8.py`. **Ne pas éditer à la main** : régénérer.

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

## 3 — 0 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|

## 3 bis — 0 composants dont le coût d'obtention est inconnu

Exigés par l'arbre, identifiés, mais sans page : on sait combien il en
faut, pas comment on les obtient.

| page wiki |
|---|

## 4 — 11 collections incomplètes — RIEN À CAPTURER

Ces succès n'ont pas d'article à eux : « Incursive Investigation:
Infinite Recursion » est une ligne de la page de catégorie, « Helping
Hylek: Kill Krait » est un compteur de kills sans étapes par nature. Ils
vivent dans le méta global. La liste reste parce qu'elle est utile ; la
colonne « où le lire » dit où regarder. Aucune de ces lignes n'est dans
la section « URLs ».

| | succès | légendaire | id | ce qui manque | où le lire |
|---|---|---|---:|---|---|
| ○ | `Incursive Investigation: First Recursion` | Eikasia, Mists-Grasper | 8840 | sans etapes | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Infinite Recursion` | Eikasia, Mists-Grasper | 8814 | sans etapes | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Relic in the Mists` | Eikasia, Mists-Grasper | 8823 | sans etapes | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Second Recursion` | Eikasia, Mists-Grasper | 8841 | sans etapes | `Eikasia, Mists-Grasper` |
| ○ | `Incursive Investigation: Third Recursion` | Eikasia, Mists-Grasper | 8835 | sans etapes | `Eikasia, Mists-Grasper` |
| ○ | `Helping Hylek: Kill Krait` | Endless Summer | 9180 | sans etapes, sans unlock | `Endless Summer` |
| ○ | `Legendary Rune Collector` | Legendary Upgrades | 7796 | sans etapes | `Legendary Upgrades` |
| ○ | `Legendary Sigil Collector` | Legendary Upgrades | 7788 | sans etapes | `Legendary Upgrades` |
| ○ | `Legendary Backpack and Glider: Orrax` | Orrax Manifested | 8714 | sans unlock | `Orrax Manifested` |
| ○ | `Return to Living World` | Prismatic Champion's Regalia | 5790 | sans etapes, sans unlock | `Prismatic Champion's Regalia` |
| ● | `Legendary Weapon: Eternity` | Eternity | 7250 | sans unlock | — |

## URLs — 0 pages à capturer

```
```
