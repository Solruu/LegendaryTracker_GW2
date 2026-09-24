# Achats uniques par compte — ce que l'arbre ne compte pas encore

Ouvert le 24/09/2026. Certains coûts ne se paient **qu'une fois pour le
compte**, puis servent à toutes les légendaires suivantes. L'arbre, lui, ne
sait compter que par unité produite : ces postes sont donc soit absents, soit
faussement multipliés si on les chaînait naïvement.

Trois familles :

1. **Les feuilles de recette.** Chaque « Gift of … » a une recette d'artisanat
   dont la feuille s'achète chez un PNJ. Le prix est conséquent et récemment
   revu à la hausse, mais il est payé une seule fois : la deuxième arme qui
   demande le même don ne le repaie pas.
2. **Le Commander Tag** — 300 po + 250 Badges of Honor, prérequis de
   `commanders_wings_of_war`. Même principe : un achat, définitif.
   Antoine ne l'a pas encore.
3. **Les recettes de Forge mystique achetées** — `gift_of_metal` et
   `gift_of_the_sun` annoncent 10 po de feuille chacune.

## Pourquoi ce n'est pas juste une ligne de plus dans `qty`

Le suffixe `__onetime` existe déjà dans le moteur (`SUFFIXES`), mais il est
indexé sur une **cible** : `obsidian__onetime` veut dire « une fois pour cette
armure », pas « une fois pour le compte ». Une feuille de recette sert
plusieurs légendaires à la fois ; la chaîner sur chacune la compterait autant
de fois qu'il y a de cibles.

Il manque donc un état par compte, du même genre que « collection faite / pas
faite » : le coût entre dans le grand total tant qu'il n'est pas marqué acquis,
et en sort une fois coché. C'est exactement ce que demande Antoine.

## Ce qui bloque aujourd'hui : les prix ne sont pas au dépôt

Les pages de dons nomment leur feuille de recette mais **n'en donnent pas le
prix**. Celui-ci vit sur la page de la feuille elle-même (`Recipe: Gift of …`),
et aucune n'est capturée. Vingt-trois pages à capturer :

| don | page de la feuille |
|---|---|
| `gift_of_blood` | `Recipe: Gift of Blood` |
| `gift_of_bones` | `Recipe: Gift of Bones` |
| `gift_of_claws` | `Recipe: Gift of Claws` |
| `gift_of_color` | `Recipe: Gift of Color` |
| `gift_of_darkness` | `Recipe: Gift of Darkness` |
| `gift_of_dust` | `Recipe: Gift of Dust` |
| `gift_of_energy` | `Recipe: Gift of Energy` |
| `gift_of_entertainment` | `Recipe: Gift of Entertainment` |
| `gift_of_fangs` | `Recipe: Gift of Fangs` |
| `gift_of_history` | `Recipe: Gift of History` |
| `gift_of_ice` | `Recipe: Gift of Ice` |
| `gift_of_light` | `Recipe: Gift of Light` |
| `gift_of_lightning` | `Recipe: Gift of Lightning` |
| `gift_of_metal` | `Recipe: Gift of Metal` |
| `gift_of_music` | `Recipe: Gift of Music` |
| `gift_of_nature` | `Recipe: Gift of Nature` |
| `gift_of_scales` | `Recipe: Gift of Scales` |
| `gift_of_stealth` | `Recipe: Gift of Stealth` |
| `gift_of_totems` | `Recipe: Gift of Totems` |
| `gift_of_venom` | `Recipe: Gift of Venom` |
| `gift_of_water` | `Recipe: Gift of Water` |
| `gift_of_weather` | `Recipe: Gift of Weather` |
| `gift_of_wood` | `Recipe: Gift of Wood` |

Tant que ces pages manquent, le montant serait inventé — donc rien n'est
chaîné.
