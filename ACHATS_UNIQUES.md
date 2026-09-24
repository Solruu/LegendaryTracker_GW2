# Achats uniques par compte — ce que l'arbre ne compte pas encore

Ouvert le 24/09/2026. Certains coûts ne se paient **qu'une fois pour le
compte**, puis servent à toutes les légendaires suivantes. L'arbre, lui, ne
sait compter que par unité produite : ces postes sont donc soit absents, soit
faussement multipliés si on les chaînait naïvement.

Deux familles tiennent après vérification au wiki. La troisième de la v1 — « les
recettes de Forge mystique achetées » — n'en est pas une : voir la section
`gift_of_the_sun`.

1. **Les feuilles de recette.** Chaque « Gift of … » a une recette d'artisanat
   dont la feuille s'achète chez un PNJ. Payée une seule fois : la deuxième arme
   qui demande le même don ne la repaie pas.
2. **Le Commander Tag** — prérequis de `commanders_wings_of_war`. Un achat,
   définitif. Antoine ne l'a pas encore.

## Pourquoi ce n'est pas juste une ligne de plus dans `qty`

Le suffixe `__onetime` existe déjà dans le moteur (`SUFFIXES`), mais il est
indexé sur une **cible** : `obsidian__onetime` veut dire « une fois pour cette
armure », pas « une fois pour le compte ». Une feuille de recette sert
plusieurs légendaires à la fois ; la chaîner sur chacune la compterait autant
de fois qu'il y a de cibles.

Il manque donc un état par compte, du même genre que « collection faite / pas
faite » : le coût entre dans le grand total tant qu'il n'est pas marqué acquis,
et en sort une fois coché.

## Les 23 feuilles — 10 po chacune, 230 po au total

Capturées le 24/09. Le prix se lit dans le `data-sort-value` de la cellule
« Cost » de la table « Acquisition », en cuivre. **Ne pas lire celui de
l'infobox** : c'est la valeur de revente (1 po 25 s sur 22 des 23).

Une seule valeur distincte sur les 23 : `100000` cuivre = **10 po**. Vendeurs :
Miyani (Trader's Forum), Memory of Old (Lion's Arch), Mystic Forge Attendant.

Les 23 dons concernés : `blood`, `bones`, `claws`, `color`, `darkness`, `dust`,
`energy`, `entertainment`, `fangs`, `history`, `ice`, `light`, `lightning`,
`metal`, `music`, `nature`, `scales`, `stealth`, `totems`, `venom`, `water`,
`weather`, `wood` — page `Recipe: Gift of <nom>` pour chacun.

## `gift_of_the_sun` — les 10 po n'existent pas

Vérifié le 24/09 : **la feuille n'existe pas**. `Recipe: Gift of the Sun` et
`Recipe: Gift of Sunshine` renvoient 404. Ce don ne s'apprend pas, il
s'assemble. Deux voies, et une seule à retenir :

**Voie retenue — Forge mystique**, aucun or, aucun prérequis annoncé sur la
page :

> 2 `Gift of Light` + 2 `Gift of Condensed Might` + 2 `Gift of Condensed Magic`
> + 250 `Sun Bead`

**Voie alternative — Shaman Palak** (Hullgarden, Shipwreck Strand), qui
**exige l'exploit `Radiance of the Sun God`** :

> 2 `Gift of Light` + 2 `Gift of Condensed Might` + 2 `Gift of Condensed Magic`
> + **10 `Glob of Ectoplasm`** + 250 `Sun Bead`

Mêmes matériaux, plus 10 ectoplasmes, et sous condition d'exploit : la voie
vendeur est strictement plus chère. Elle n'a donc aucune raison d'entrer dans
l'arbre. Le prérequis `Radiance of the Sun God` ne porte que sur cette ligne —
la page n'attache aucune condition à la recette de Forge.

**D'où venaient les « 10 po » de la v1** : de deux confusions possibles, aucune
imputable à ce don.

- La ligne Palak affiche « + 10 » : c'est **10 Glob of Ectoplasm**, pas 10 or.
  Le nombre nu, sans son icône, se lit comme un montant.
- Et il y a bien 10 po dans cette chaîne, mais un cran plus bas :
  `Recipe: Gift of Light` coûte 10 po, et il en faut 2 `Gift of Light`.

`Sun Bead` est capturé au passage (s'achète en karma, 21 ou 525 selon le
vendeur).

## Le Commander Tag — 300 po, et le Catmander n'est pas un raccourci

Deux pages capturées le 24/09. `Commander Tag` n'est pas un titre wiki.

| compendium | vendeur | coût |
|---|---|---|
| `Commander's Compendium` (67335) | Commander Rupple, Dwayna High Road, Divinity's Reach | 250 `Badge of Honor` + **300 po** |
| `Catmander's Compendium` | Blue Catmander General Sunnyhill, Woodhaven (McM) | 250 `Badge of Honor` + **300 po** |

**Même prix.** L'hypothèse d'un Catmander moins cher qui deviendrait le chemin
principal ne tient pas. La ligne à 150 po de la page `Commander's Compendium`
n'est pas une porte d'entrée moins chère : c'est une **remise croisée**, elle
exige de posséder déjà l'autre compendium. Elle ne sert donc qu'à acheter le
second tag après le premier.

Conclusion pour l'arbre : le prérequis de `commanders_wings_of_war` est
**250 `Badge of Honor` + 300 po**, une seule fois. Pas d'alternative, pas de
branche à arbitrer.

## Ce qui bloque le push aujourd'hui

`gw2_audit_v49.py` échoue sur une **vraie** erreur, révélée par la capture de
`Gift of the Sun` :

> `craft_components/gift_of_the_sun : apiId = 107030 alors que sa page wiki
> annonce API 107136`

Vérifié contre `/v2/items` : **107136 = Gift of the Sun** (Legendary,
CraftingMaterial), **107030 = Relic of Fog**, sans rapport. La page ne porte
qu'un seul identifiant — ce n'est pas la fragilité multi-variantes décrite dans
`ARMURES_COMPETITIVES.md`. La colonne « possédé » de ce don lit le stock d'une
relique.

Correction : `gift_of_the_sun.apiId` 107030 → 107136. **Non appliquée** — elle
change un chiffre affiché.
