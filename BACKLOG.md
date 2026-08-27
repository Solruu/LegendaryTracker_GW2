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

## 3 sexies. Trois arbres appliqués — méthode corrigée

**Correction de méthode :** GW2Efficiency affiche des quantités **absolues** à
chaque nœud, déjà multipliées. Les cumuler en cascade produisait des nombres à
neuf chiffres (3,9 milliards d'éclats d'obsidienne pour Coalescence). **On somme
les occurrences, on ne multiplie pas.**

**12 exigences posées, 10 corrigées** sur Coalescence, Vision et Ad Infinitum.
Les plus notables :

- **Ad Infinitum** : 1 500 Minerai de dragonite, 1 500 Fragments empyréens,
  1 500 Poussière de pierre de sang, 600 Matrices stabilisatrices — **tous
  absents**. Et 1 039 Globes d'ectoplasme au lieu de 250.
- **Coalescence** : 300 Mosaïques d'élégie, 250 Lingots cristallins, 250
  Gemmes amalgamées.
- **Vision** : 540 Réactifs thermocatalytiques, 250 Éclats de gloire, 100
  Pierres runiques glacées.

**Périmètre déclaré** (`_meta.raw_materials_scope`) : les matières premières
génériques de l'artisanat élevé — mithril, argent, or, orichalque, planches,
cuir, soie, essences de chance — ne sont **pas** modélisées. Les arbres en
listent des milliers, mais elles s'achètent sans y penser et ne portent aucun
timegate. Les modéliser doublerait le fichier sans servir la question du
tracker : *que puis-je faire avancer aujourd'hui ?*

**Trois divergences JSX déclarées** en `qty_conflict` : Mystic Coin sur
Ad Infinitum et Coalescence, Pristine Fractal Relic sur Ad Infinitum.

---

## 4. Portes de maîtrise — ✅ **RÉSOLU le 22/08/2026**

**Les deux noms sont exacts** : « Rift Repair » et « Astral Craft » existent tels
quels. Le marqueur « ⚠ nom introuvable » ne se déclenchera pas.

Et les fiches donnent mieux qu'un nom — **la piste et le palier** :

| porte | piste | palier | région |
|---|---|---|---|
| Rift Repair | Skyscale Mount | 2 | Feu Éternel |
| Astral Craft | Astral Ward | 2 | Secrets of the Obscure |

**Ça rend les portes décidables sans table de noms.** `/v2/account/masteries`
rend le niveau atteint **par piste** ; comparer ce niveau au palier requis
suffit. C'est plus robuste que la correspondance par nom de palier, qu'un
renommage casserait.

Attention au détail : `level` est un **index 0-base**, le palier affiché en jeu
vaut donc +1. Flask fait la conversion une fois pour toutes dans
`mastery_levels_by_name`.

L'audit exige désormais que `track` et `tier` se posent **ensemble** — un palier
sans piste ne se compare à rien.

## 4 bis. Composants sans source — ✅ **RÉSOLU : 30 sur 30**

Aucun composant ne porte plus de source « à documenter », et aucun n'est marqué
`verified: false`.

**La dernière fiche a invalidé une déduction, sur les trois points.**
J'avais donné au `Shard of Mistburned Barrens` la structure de ses deux jumeaux
— 3 vendeurs, 21/semaine, cœur complété. La réalité :

| | jumeaux | Mistburned |
|---|---|---|
| vendeurs | 3 | **1** |
| plafond | 21/semaine | **aucun** |
| cœur de renommée | **complété** | **incomplet** |

L'inverse exact sur la condition du cœur. La symétrie parfaite de Janthir Syntri
et Lowland Shore ne s'étendait pas à la troisième carte — et le `verified: false`
posé sur la déduction a fait son travail pour la troisième fois.

**Deux ponts découverts en documentant :**

- **`Unusual Coin` est une monnaie Visions of Eternity**, pas Janthir. Ses
  coffres sont tous derrière la maîtrise **Obscured Riches** — la même qui ouvre
  ceux de la Sève chromatique et de la Pierre d'enchantement brute. Une maîtrise,
  **trois monnaies**. Et elles s'échangent 1 pour 1 contre des Ancient Coins :
  un pont direct vers les 50 000 d'Orrax.
- **`Tale of Adventure`** n'a **aucune source répétable** : c'est une récompense
  d'étape d'histoire, une fois par compte. Au-delà de ce que l'histoire donne,
  il n'y a que le Comptoir.

### Timegates fermés — l'ordre des chantiers

| composant | cadence | délai |
|---|---|---|
| Shard of Bava Nisos | 20/semaine, vendeur unique | 5 semaines |
| Shard of Janthir Syntri | 21/semaine, plafond partagé | 5 semaines |
| Shard of Lowland Shore | 21/semaine, plafond partagé | 5 semaines |
| Ascended Shards of Glory | 400 par saison PvP | **2+ saisons** |

### Murs sans timegate

- **Seer Runestone** : 35 000 karma pièce → **7 millions** pour Stella Radians.
- **Ancient Coin** : 50 000 pour Orrax, aucune source dense.

---

## 4 ter. Six divergences JSX déclarées

`memory_of_battle`/Strife Unending, `obsidian_shard`/Selachimorpha et
Endless Summer, `mystic_clover`/Orrax, `mystic_coin`/Stella Radians,
`ursus_oblige`/Orrax. L'arbre développe la chaîne complète, le JSX porte une
exigence directe — déclarées en `qty_conflict`, visibles à chaque exécution.

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

## Noms français des sous-zones de farm (38 entrées)

`trophy_matrix.farm_hubs.hubs[].zones[].name.fr` vaut `null` sur les 38 sous-zones.
Le rendu se replie sur l'anglais, qui est le nom du wiki et reste cherchable.

Ces noms sont des noms propres de lieux : les traduire de tête reviendrait à
fabriquer 38 toponymes. Ils attendent une source vérifiée (wiki FR ou client de
jeu en français).

**Enjeu** : cosmétique en français, nul en anglais. Le bloc « Où farmer » est
exploitable en l'état dans les deux langues.

## Foyers de farm : paliers T3 et T4 (QoL, optionnel)

Les 16 captures T3/T4 des huit lignes sont versées dans `ressources/wiki/` et
parsées par `gw2_parse_dropped_by_v2.py`, mais **ne sont pas exposées** dans le
bloc « Où farmer ».

**Pourquoi c'est écarté** : 50 T3 + 50 T4 sur 450 unités par gift, soit 11 %
chacun. Les tableaux sont maigres — les Totems T3 alignent 8 créatures, le T4
en aligne 11 — et les mobs concernés sont de bas niveau, croisés en passant.

**Si un jour on l'ajoute** : la donnée est déjà là, il ne resterait que le
rendu. Aucune capture supplémentaire à demander.

## Captures « Dropped by » tronquées au palier T5 (4 sur 32)

Le wiki plafonne ces tableaux à 150 lignes et renvoie le reste derrière un lien
« further results » (`offset=150`). Quatre captures sont concernées :
`large_bone`, `large_claw`, `pile_of_incandescent_dust`, `potent_venom_sac`.

`gw2_parse_dropped_by_v2.py` les marque `tronque: true` et le signale en fin de
passe. **Toute conclusion sur ces quatre lignes au T5 est partielle** tant que
la suite n'est pas versée.

**Enjeu** : les Os, les Griffes, la Poussière et le Venin sont quatre des huit
lignes, et le T5 pèse 56 % du volume. C'est le plus gros trou de données ouvert
sur le sujet.
