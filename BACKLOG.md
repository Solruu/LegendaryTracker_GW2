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

## 1 ter. Nœuds de difluorite : par compte ou par personnage ?

44 nœuds au maximum aux Îles de Ventesable, environ 33 % de chance de cristal
par nœud — soit une quinzaine par circuit. **Quotidien, régime non tranché.**

L'enjeu est le même que pour la kralkatite : si c'est par personnage, monter des
alts multiplie le rendement ; si c'est par compte, refaire le circuit ne rapporte
rien. Les sources se contredisent — un guide dit qu'on peut se connecter avec
chaque personnage pour miner, un joueur rapporte l'inverse sur cette carte
précise.

**Compté comme par COMPTE en attendant** : c'est le plancher prudent, celui qui
n'annonce pas un délai qu'on ne tiendra pas.

Vérification : faire le circuit de nœuds, changer de personnage, regarder s'ils
sont encore là. Trente secondes sur place.

Constats déjà acquis en jeu (22/08/2026) : **Istan et Kourna n'ont aucun nœud**
de ressource, le mistonium est à **25 nœuds/jour/compte** (3 coups chacun,
chance à chaque coup).

---

## 2. Familles de créatures — partiellement vérifié, tableaux complets attendus

Vérifiées contre les tableaux *Dropped by*, **mais sur des captures tronquées** :
elles montrent le haut de chaque liste, triée alphabétiquement. Ce qui y figure
est confirmé ; ce qui n'y figure pas ne l'est pas pour autant.

**Erreur de méthode corrigée en v134** : j'avais écrit des négations —
« ni humains ni bandits ni centaures » — en lisant une absence dans une vue
partielle. Une absence dans une liste tronquée n'est pas une absence. Les
négations sont retirées, les constats positifs conservés, et chaque tip précise
que la liste n'est pas exhaustive.

Antoine extrait le rendu complet des tableaux dès son retour sur PC. À ce
moment-là, les familles pourront être complétées plutôt que corrigées.

**Ce qui est acquis et ne bougera pas** — les concentrations par carte, qui ne
se voient qu'en croisant les huit lignes :

- **Marches de Bjora** → Sang **et** Totems (Forêt aberrante : six types
  d'Aberrants sur une zone étroite, plus les chamans déchus).
- **Désert de cristal / Désolation** → Venin **et** Écailles (dévoreurs).
- **Terres sauvages d'argent** → Venin **et** Crocs (Mordrem).
- **Rivage maudit / Bond de Malchor** → Os, le farm le plus dense des huit.
- La **Poussière** se farme gratuitement pendant le circuit Vision : les Marqués
  vivent sur Jahai, Chef-Tonnerre, Rivages d'Elon et Oasis de cristal.

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

## 5. Répartition des gifts condensés — ✅ **RÉSOLU le 22/08/2026**

Le total d'un set complet était juste (3 Might + 3 Magic), mais le coût d'une
**pièce isolée** ne l'était pas : demander les gants seuls annonçait 3 de chaque
au lieu de 1 Might et 0 Magic.

Corrigé sans dupliquer la table : la correspondance emplacement → type vit déjà
dans `LEGENDARIES.obsidian.arcanum`, liée aux identifiants de succès
(`gift: "mighty"` / `"magical"`). Le JSX la **lit** plutôt que de la redire, et
calcule le restant par type à partir des pièces visées et possédées.

Deux modes, honnêtes tous les deux :
- **exact** quand une correspondance emplacement → identifiant d'armurerie
  existe — on sait quelle pièce est possédée ;
- **au prorata** sinon, avec la mention affichée. Exact sur un set complet,
  approché et signalé comme tel sur un set partiel.

L'audit v14 vérifie que `qty['obsidian__full_set']` égale le nombre
d'emplacements portant ce type dans le JSX, et que les deux types couvrent
exactement 6 emplacements. C'est précisément le contrôle qui aurait attrapé
l'erreur de facteur 2 corrigée le 20/08.

---

## 6. Conflits de valeur restants

Aucun à ce jour. Les trois derniers (`selachimorpha` 10 vs 55,
`obsidian__per_piece` 15 vs 9 et 250 vs 600) ont été tranchés par capture wiki,
et **`qty` avait raison les trois fois**.

Si un nouveau conflit apparaît entre `_meta.common_required` et
`craft_components[].qty`, l'audit le signale en avertissement. Le réflexe à
avoir : **ne pas trancher en faveur de `common_required`**, qui n'a pas suivi
les mises à jour du jeu.
