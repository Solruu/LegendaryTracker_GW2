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

## 1 ter. Nœuds de difluorite — ✅ **RÉSOLU le 22/08/2026 : par PERSONNAGE**

Vérifié en jeu par Antoine. **44 nœuds, ~33 % de chance, par personnage et par
jour.** Le plancher prudent (« par compte ») était le mauvais pari.

**Conséquence : les Îles de Ventesable sont la carte LW4 la plus rentable par
personnage.** Les coffres de méta (21/jour) **et** les nœuds (44/jour) s'y
démultiplient tous deux avec les alts — aucune autre monnaie de la Saison 4 ne
cumule deux sources par personnage.

Et la règle n'est pas uniforme : le **mistonium** reste à 25 nœuds **par
compte**. Deux cartes, deux régimes — c'est exactement ce qui interdisait
d'extrapoler de l'une à l'autre, et pourquoi ce point attendait une observation
plutôt qu'une déduction.

**Récapitulatif des régimes de nœuds**, désormais complet :

| carte | nœuds | régime |
|---|---|---|
| Îles de Ventesable | 44 | **par personnage** |
| Falaises de Jahai | 25 | par compte |
| Domaine d'Istan | *aucun* | — |
| Domaine de Kourna | *aucun* | — |

---

## 2. Familles de créatures — ✅ **RÉSOLU le 22/08/2026, sur tableaux entiers**

Les 8 tableaux *Dropped by* complets, chiffrés par famille et par carte. Les 32
sources portent désormais des fréquences réelles, pas des estimations.

| ligne | familles dominantes | carte de tête |
|---|---|---|
| Os | Risen **56/120** | Bond de Malchor 23 |
| Poussière | Risen 28, élémentaires 20, Marqués 18 (143 NPC) | Étendues fragmentées 14 |
| Crocs | Mordrem 21, guivres 11 | Terres sauvages d'argent 16 |
| Venin | Mordrem 19, araignées 16, dévoreurs 13 | Terres sauvages d'argent 15 |
| Griffes | destructeurs 16, drakes 10 | Brumes 20, DRM Champs de Ruine 8 |
| Totems | Déchus 15, Aberrants 7, Svanir 6 (56 NPC) | Ruines déchues 11 |
| Sang | Risen 16, Aberrants 8, skelks 7 | quatre cartes à 8 ex æquo |
| Écailles | drakes 14, dévoreurs 13, Toxiques 12 | aucune au-dessus de 14 |

**Deux enseignements que les vues partielles cachaient :**

- **Les totems sont la ligne la plus concentrée des huit** — la moitié de ses 56
  créatures vit aux Marches de Bjora. Une seule carte suffit.
- **Les écailles sont la plus dispersée** — aucune carte ne dépasse 14 sources,
  et le McM en fournit autant que la jungle. Il n'y a pas de bon spot.

Les croisements tiennent et se précisent : Terres sauvages d'argent pour **Venin
+ Crocs** (Mordrem en tête des deux), Orr pour **Os + Sang + Poussière**, Bjora
pour **Totems + Sang**.

---

## 3. Identifiants d'objets — un posé, un contredit

- **`ancient_cipher`** → ✅ `apiId: 81722`. Le 404 annoncé le 22/08 était un
  **artefact de l'outil de récupération**, qui renvoyait une réponse en cache
  pour une autre URL — pas une réponse de l'API. Vérifié indépendamment en
  décodant le code de discussion de la fiche, `[&AgE6PwEA]` : type 2 (objet),
  quantité 1, identifiant 81722 en petit-boutiste.
  **Leçon de méthode** : un échec d'outil n'est pas un fait sur le monde. Quand
  un identifiant fourni « n'existe pas », le vérifier par un second chemin
  avant de l'écrire dans la donnée.

- **`spirit_thread`** → ✅ `apiId: 77372`, et **la cadence Gorseval est
  rétablie**. La fiche d'Envoy I est sans ambiguïté : le fil vient de
  **Gorseval** (Val des esprits), et le **chak gerent** sert à l'**imprégner**
  d'énergie de ligne de faille. Le texte de l'objet ne décrit que cette
  imprégnation — j'y avais lu une contradiction et dégradé une entrée correcte.
  **Deuxième fois** qu'une lecture partielle me fait défaire du travail juste.

---

## 3 bis. Six « Gift of… » spécifiques — ✅ **RÉSOLU le 22/08/2026**

Créés d'après les arbres GW2Efficiency, plus **deux maillons partagés découverts
au passage** :

- **`gift_of_energy`** — 250 de chacun des 4 paliers de poussière, soit 1 000
  unités. Partagé par **Aurora et Vision**. La ligne des poussières sert donc
  deux fois : ici, et dans les gifts condensés du Mystic Tribute.
- **`gift_of_the_mists`** — partagé par **Aurora, Vision ET Conflux**. Exige du
  **PvP** (Gift of Glory, 250 Éclats) *et* du **McM** (Gift of Battle) : aucune
  voie purement PvE.

**Trouvaille majeure : `warcry`, le précurseur de Warbringer, coûte 2 450
Tickets d'escarmouche McM** — 350 + 525 + 700 + 875 pour les quatre Wings of
War. À 455/semaine (365 de la piste + 90 des hebdomadaires), c'est **6 semaines
pour le seul précurseur**, avant le reste de Warbringer. Le plus lourd timegate
McM du fichier, et il n'était modélisé nulle part.

À noter aussi : `gift_of_conquering` demande **4 Gift of Battle**, soit quatre
pistes de récompense McM complètes. Timegate de fait, invisible tant qu'on ne
compte que les monnaies.

---

## 3 ter. Divergences Coalescence — ✅ **RÉSOLUES**, et une erreur de v131 corrigée

Deux pages concordantes (fiche de l'Encens funéraire + liste complète de
Coalescence) tranchent :

- **Funerary Incense : 250**, pas 300. Dans le `Gift of Desert Mastery`.
- **Ball of Dark Energy : 6**, pas 100. Dans le `Gift of Compassion`.

Les deux totaux à plat sont supprimés, la chaîne les porte.

### L'erreur que ces fiches révèlent — de mon fait, en v131

`Gift of Arid Mastery = 100 Encens + 1 Éclat de pierre de sang + **1** Gift of
Crystalline Magic + **1** Gift of Ephemeral Magic`, et Vision en demande **un
seul**.

J'avais écrit **3 de chaque**, déduits du fait que cinq des six monnaies LW4
portaient 300 et que chaque gift en demande 100. **Déduction à partir d'un
nombre non vérifié** — le 300 était lui-même faux.

Vision passe donc de **300 à 100** sur chacune des six monnaies. Facteur 3 sur
six lignes, introduit par moi en construisant une structure autour d'un chiffre
que je n'avais pas cherché à confirmer.

### Ce qui reste ouvert — ✅ **plus rien, résolu le 22/08/2026**

`ball_dark_energy` : les **50 d'Aurora et Vision sont supprimés**. L'arbre de
recette d'Aurora est explicite — Gift of Sentience → 1 Gift of the Mists →
1 Cube of Stabilized Dark Energy → **1 boule**. Vision suit le même chemin par
son Gift of Prescience. Aucune recette ne justifiait 50.

---

## 3 quater. Conflux — ✅ **RÉSOLU : chaîne complète, 8 lignes sur 8**

Le postulat d'Antoine est validé et le mien réfuté : **GW2Efficiency couvre
fidèlement les chaînes de craft, pas les collections.** L'absence des armes
Astral dans l'arbre de Vision vient de là — c'est une collection, pas un craft.

Mon diagnostic « l'arbre substitue les chemins » était **faux** : les Éclats de
glace éternelle apparaissent sous chaque monnaie comme **coût d'achat affiché**,
pas comme substitution. Et les armes Dragonsblood, elles, sont bien dans l'arbre,
entières.

**Ce qui débloque tout : lire la hiérarchie, pas additionner à plat.** Le
maillon manquant apparaît alors — le **Gift of Warfare** et ses quatre
**Essences mystiques** :

| essence | T6 | T5 | socle |
|---|---|---|---|
| Strategy | 20 sang | 50 | 1 000 Insignes d'honneur |
| Animosity | 20 os | 50 | 500 Témoignages castoran |
| Carnage | 20 écailles | 50 | 500 Mémoires de bataille |
| Annihilation | 20 griffes | 50 | **350 Tickets d'escarmouche** |

Il explique **les trois anomalies d'un coup** : les +20 T6 sur exactement ces
quatre lignes, les 350 tickets manquants de Warbringer, et les écarts sur
insignes, témoignages et mémoires.

Avec les derniers parents (Mist Pearl, Mist-Enhanced Mithril, Gift of War, Gift
of War Dedication, les deux Certificates), **les huit lignes tombent au chiffre
près** : 220 / 220 / 220 / 220 T6, 1 500 insignes, 750 témoignages, 1 750
mémoires, 1 850 tickets.

Plus aucun total à plat sur ces postes.

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
