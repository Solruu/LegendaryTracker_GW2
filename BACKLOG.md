# Backlog

Points en attente d'une vérification en jeu ou sur le wiki. Chacun est **connu,
localisé et chiffré** — ce ne sont pas des inconnues, ce sont des arbitrages
qui demandent une source que le conteneur ne peut pas atteindre.

Règle : tant qu'un point est ici, la donnée reste **en l'état** dans le fichier.
On ne devine pas à la place de la vérification — trois conflits de valeur
tranchés au jugé auraient donné trois erreurs (voir `selachimorpha`, où
l'intuition « la référence fait foi » aurait été fausse).

---

## 1. Branded Mass : 6 armes — ✅ **RÉSOLU le 22/08/2026**

**Vision demande 6 armes Dragonsblood, pas 16.** Antoine avait raison.

Deux succès portaient sur les armes Dragonsblood, et le tracker confondait
les deux :

- **Vision of Equipment: Dragonsblood Weapons** — l'étape réelle de Vision.
  Fabriquer **six armes de six types différents** (six torches ne comptent pas),
  puis **retourner voir Forge Master Hilina et acheter l'objet 5 po** : la
  collection ne se valide pas toute seule.
- **Journeyman of the Forge** — succès **distinct** de « All or Nothing »,
  demandant les **16** armes. **Facultatif pour Vision.**

Le tracker présentait Journeyman comme l'étape Equipment, annonçant donc
**960 Masse marquée au lieu de 360**.

Corrigé : le total à plat de 300 sur `qty['vision']` était bien le doublon
périmé soupçonné — l'étape ne demande aucune Masse marquée hors des armes.
Vision passe de **660 à 360**, soit **12 jours de farm en moins** au plafond
de 25/jour.

Gotchas encodés dans la prose : les armes héroïques et le Dragonsblood Impaler
ne comptent pas ; un Guaranteed Wardrobe Unlock, si.

---

## 1 bis. Ectoplasmes de Vision — ✅ **RÉSOLU le 22/08/2026 : additifs**

La page de l'**Encapsulateur d'essence mnésique** tranche : objet à usage
unique, **6 requis**, acheté 1 Cristal de vision mineur + 3 Lingots d'électrum
+ 10 Filigranes d'orichalque + **50 Globes d'ectoplasme** pièce.

Les deux chemins sont donc **bien additifs** :

- **250** — l'exigence commune que porte *tout* légendaire (elle figure à
  l'identique sur les 21 gen1, Aurora, Conflux, Coalescence…) ;
- **300** — le coût des 6 encapsulateurs.

**Total : 550.** Contrairement à la Masse marquée, où le total à plat était un
doublon. Deux cas de forme identique, deux conclusions opposées — d'où l'intérêt
d'avoir vérifié plutôt que d'extrapoler du premier au second.

Le chevauchement est déclaré dans la donnée via `qty_overlap_verified`, entité
par entité et avec provenance, plutôt qu'en assouplissant la règle d'audit :
sinon le prochain vrai doublon passerait aussi.

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
