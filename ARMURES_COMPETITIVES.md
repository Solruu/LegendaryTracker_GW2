# Ardent Glorious et Triumphant Hero's — le coût, pièce par pièce

Relevé le 24/09/2026 sur les 36 captures de `ressources/wiki/` (18 pièces par
set, 6 emplacements × 3 poids). Pas sur la page de set : `ardent_glorious_armor`
et `triumphant_heros_armor` n'ont **structurellement** ni boîte Recipe ni table
« Full material list », et quatre recaptures l'ont confirmé (lots 15, 18, 20,
24).

Source du relevé : l'attribut `data-sort-value` de la cellule de coût de chaque
ligne vendeur. Il porte le coût déjà normalisé — monnaie et quantité sur huit
chiffres — là où le texte rendu n'affiche que des icônes et des « + ». Le lire
évite de deviner à quoi se rattache chaque nombre.

## Ce que la note du lot 15 disait de trop

Elle annonçait un coût variant « par POIDS **et** par EMPLACEMENT ». C'est plus
simple :

- **le poids ne change que le TYPE de marque** — Tailor (léger), Leatherworker
  (moyen), Armorsmith (lourd) ;
- **l'emplacement seul change les QUANTITÉS**, et il n'y a que **trois** paliers
  par set : torse, jambes, et les quatre autres emplacements ensemble.

Donc **3 coûts distincts par set**, pas 18. Vérifié sur les 36 : le regroupement
par coût identique donne exactement 3 groupes par set, aux étiquettes de marque
près.

## Étape légendaire — identique sur les 36 pièces

Une recette et une seule par page, aucune variation de poids ni d'emplacement.

| set | recette |
|---|---|
| Ardent Glorious | 1 `Gift of Competitive Prosperity` + 1 `Gift of Competitive Prowess` + 1 `Gift of Competitive Dedication` |
| Triumphant Hero's | 1 `Gift of War Prosperity` + 1 `Gift of War Prowess` + 1 `Gift of War Dedication` |

## Étape ascendue — 3 paliers par set

`M` = la marque Grandmaster du poids de la pièce (Tailor / Leatherworker /
Armorsmith).

**Ardent Glorious (PvP)** — 250 `Shard of Glory` sur les 18, plus :

| emplacement | marques | Ascended Shard of Glory | or |
|---|---:|---:|---:|
| torse (Raiment / Brigandine / Breastplate) | 4 M | 250 | 3 |
| jambes (Leggings / Legguards / Legplates) | 4 M | 150 | 2 |
| casque, épaulières, gants, bottes | 3 M | 100 | 2 |

**Triumphant Hero's (McM)** — 250 `Memory of Battle` sur les 18, plus :

| emplacement | marques | WvW Skirmish Claim Ticket | or |
|---|---:|---:|---:|
| torse | 4 M | 350 | 3 |
| jambes | 4 M | 260 | 2 |
| casque, épaulières, gants, bottes | 3 M | 175 | 2 |

Les deux sets sont symétriques : une monnaie constante, une monnaie qui dépend
de l'emplacement, une marque qui dépend du poids, et l'or.

### L'or n'est pas dans l'arbre

Chaque achat coûte en plus **3 pièces d'or sur le torse, 2 sur les cinq autres
emplacements** — 13 or par set, 26 pour les deux. Le tracker n'a aucun composant
de type pièce d'or : `mystic_coin`, `ancient_coin` et `unusual_coin` sont des
matériaux, pas la monnaie. Cette colonne est donc relevée ici mais **pas
intégrée** : introduire l'or comme composant le ferait remonter dans tout
l'arbre, et c'est une décision de modélisation, pas une lecture de wiki.

## Ce que la donnée porte déjà

Les 36 coûts sont **déjà en base** depuis la décomposition par pièce, sur les
cibles `ardent_glorious__piece_<poids>_<emplacement>` et
`triumphant_hero__piece_<poids>_<emplacement>`, plus la constante sur
`__per_piece`. Confrontation faite le 24/09 entre ce relevé et
`gw2_sources_v310.json` : **aucun écart**. Le moteur calcule, pour un set
complet d'un poids donné, 800 Ascended Shards of Glory et 20 marques côté
Ardent, 1 310 tickets et 20 marques côté Triumphant — ce que donne la somme des
trois paliers (250 + 150 + 4×100, 4 + 4 + 4×3).

## Les apiId de ces pages demandent une précaution

**Une page de pièce porte plusieurs identifiants d'objet**, pas un : deux sur
les pages Ardent Glorious (p. ex. 67131 et 83162 pour les Armguards), **trois**
sur les pages Triumphant Hero's (6604, 81428, 84629). Ce sont les variantes de
rareté du même emplacement. Prendre le premier identifiant rencontré dans la
page donne donc un résultat arbitraire — c'est ce qui produit la série
« 6602 à 6619 » pour Triumphant, qui ne désigne pas les pièces ascendues.

Conséquence pour `check_api_id_contre_capture` (audit) : la règle lit le premier
`items?ids=` de la capture. Elle est juste sur une page mono-objet, fragile sur
une page de variantes. Aucun composant de l'arbre n'est aujourd'hui concerné —
ces 36 pièces ne sont pas des `craft_components` — mais la limite est à garder
en tête avant d'y rattacher des identifiants.

## Pages citées par les pièces et non capturées — volontairement

Le dépouillement des sections « Acquisition » des 36 pièces donne 39 pages
citées. Quatre manquaient, versées le 24/09 : `Shard of Glory`,
`WvW Skirmish Claim Ticket`, `Legendary Trunk`, `Legendary Mistforged Trunk`.

Les deux coffres ne portent aucun coût — seulement « Acquisition » et
« Contents ». Ils ne débloquent rien pour l'arbre ; ils sont versés pour la
traçabilité de la voie d'obtention.

Les 27 restantes n'ont pas à revenir dans la file :

- **18 pages `Triumphant … (skin)`** : apparences, aucun coût ;
- **8 lieux et institutions** (`Armistice Bastion`, `Champion's Rest`,
  `Fort Marriner`, `Hall of Memories`, `Heart of the Mists`, `Lion's Arch`,
  `Mystic Forge`, `World vs. World`) : emplacements de vendeur ;
- **`Gold coin`** : la monnaie, voir la section sur l'or ci-dessus.
