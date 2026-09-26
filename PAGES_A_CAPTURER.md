# Pages wiki à capturer

Calculé depuis `gw2_sources_v323.json` et `ressources/INDEX_CONTENU.json` par
`gw2_pages_a_capturer_v10.py`. **Ne pas éditer à la main** : régénérer.

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

## 4 — 3 collections incomplètes — 2 à capturer

Une collection est incomplète tant qu'elle n'a ni ses étapes ni sa chaîne
de déblocage, et qu'elle ne déclare pas leur absence avec `absences_ref`
— drapeau qui exige la capture prouvant qu'il n'y a rien à décrire.

La colonne « où le lire » nomme la capture qui porte le bloc du succès,
vérifiée par son ancre `#achievementNNNN`. Les lignes sans capture sont
reprises dans la section « URLs » : leur page n'est pas au dépôt.

| | succès | légendaire | id | ce qui manque | où le lire |
|---|---|---|---:|---|---|
| ● | `Return to Living World` | Prismatic Champion's Regalia | 5790 | sans etapes | `living_world_return.html` |
| ○ | `Helping Hylek: Kill Krait` | Endless Summer | 9180 | sans etapes, sans unlock | — |
| ○ | `Legendary Backpack and Glider: Orrax` | Orrax Manifested | 8714 | sans unlock | — |

## URLs — 2 pages à capturer

```
https://wiki.guildwars2.com/wiki/Helping_Hylek:_Kill_Krait
https://wiki.guildwars2.com/wiki/Legendary_Backpack_and_Glider:_Orrax
```
