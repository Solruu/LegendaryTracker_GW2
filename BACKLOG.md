# Backlog

Points en attente d'une vérification en jeu ou sur le wiki. Chacun est **connu,
localisé et chiffré** — ce ne sont pas des inconnues, ce sont des arbitrages
qui demandent une source que le conteneur ne peut pas atteindre.

Règle : tant qu'un point est ici, la donnée reste **en l'état** dans le fichier.
On ne devine pas à la place de la vérification — trois conflits de valeur
tranchés au jugé auraient donné trois erreurs (voir `selachimorpha`, où
l'intuition « la référence fait foi » aurait été fausse).

---

## 1. Branded Mass : 6 ou 16 armes Dragonsblood ? — *Antoine vérifie, a priori 6*

**Enjeu : 660 vs 960 Branded Mass, soit 12 jours de farm à 25/jour.**

Trois nombres coexistent :

| valeur | emplacement | sens |
|---|---|---|
| 300 | `branded_mass.qty.vision` | total à plat, exigence directe |
| 6 | `dragonsblood_weapons.qty.vision` | nombre d'armes |
| 60 | `branded_mass.qty.dragonsblood_weapons` | par arme |
| 960 | `bitTips` du succès 4577 (`vis_forge`) | « 60 par arme, 960 pour les 16 » |

La cascade calcule `6 × 60 + 300 = 660`. La prose dit `16 × 60 = 960`.

Indice contradictoire : les `bitTips` du succès 4577 comptent **16 entrées**
(bits 0 à 15), ce qui suggère 16 armes. Mais Antoine penche pour 6 après
lecture en jeu.

À vérifier :
1. **Journeyman of the Forge** (succès 4577) — combien d'armes faut-il
   réellement fabriquer ?
2. **Dragonsblood Spear** → *Recipe* — le « environ 60 » mérite un chiffre ferme.
3. **Vision I: Awakening** — une étape consomme-t-elle de la Branded Mass
   **hors** des armes ? Si non, le 300 à plat est un doublon périmé.

Si 6 est confirmé : corriger la prose des `bitTips` (960 → 360) et trancher le
sort du 300. Si 16 : corriger `qty.vision` et supprimer le 300.

---

## 2. Familles de créatures des 8 lignes de trophées — `verified: false`

Les 32 composants de trophées portent une source « butin direct » citant des
familles de créatures (morts-vivants pour le sang, araignées pour le venin,
hylek pour les totems…). Elles sont **marquées non vérifiées** : elles viennent
de connaissances générales, pas d'une page consultée.

À vérifier sur la page wiki de chaque trophée, section *Dropped by*. Les pages
sont longues ; l'objectif n'est pas l'exhaustivité mais **deux ou trois familles
statistiquement bonnes** par ligne.

---

## 3. Identifiants d'objets manquants

- `ancient_cipher` — aucun `apiId`. Sans lui, le stock reste silencieusement à
  zéro. À relever en jeu (lien de discussion ou GW2Efficiency).
- `spirit_thread` — même situation.

Rappel : un `apiId` faux est **pire** qu'un `apiId` absent, parce qu'il produit
un stock plausible et faux. Ne rien mettre plutôt que deviner.

---

## 4. Portes de maîtrise : les noms sont-ils bons ?

`collection_unlocks` pose des portes `mastery` nommées **« Rift Repair »**
(Vision I) et **« Astral Craft »** (les 6 Arcanum). Le conteneur ne peut pas
joindre l'API GW2, donc **ces deux noms n'ont pas été confrontés à la table**
`/v2/masteries`.

Le tracker le dira lui-même : si un nom est introuvable, il affiche
**« ⚠ nom introuvable dans la table des maîtrises »** et non un cadenas — un
faux verrou masquerait une collection jouable. À regarder à la première synchro
avec le scope `progression` actif.

---

## 5. Répartition des gifts condensés par emplacement

L'armure d'Obsidienne demande 3 Gifts of Condensed Might (gants, jambières,
bottes) et 3 of Condensed Magic (coiffe, épaulières, plastron). C'est modélisé
en `obsidian__full_set: 3`, ce qui donne le bon total pour un **set complet**.

Mais le tracker ne sait pas dire ce que coûte **une pièce précise** : demander
les gants seuls devrait annoncer 1 Might et 0 Magic. Modéliser la répartition
par emplacement demanderait un suffixe par emplacement, ou un champ `slots` sur
le composant. Non fait, faute de besoin exprimé.

---

## 6. Conflits de valeur restants

Aucun à ce jour. Les trois derniers (`selachimorpha` 10 vs 55,
`obsidian__per_piece` 15 vs 9 et 250 vs 600) ont été tranchés par capture wiki,
et **`qty` avait raison les trois fois**.

Si un nouveau conflit apparaît entre `_meta.common_required` et
`craft_components[].qty`, l'audit le signale en avertissement. Le réflexe à
avoir : **ne pas trancher en faveur de `common_required`**, qui n'a pas suivi
les mises à jour du jeu.
