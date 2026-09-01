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

`trophy_matrix.farm_hubs.hubs[].zones[].name.fr` vaut `null` sur les 37 sous-zones.
Le rendu se replie sur l'anglais, qui est le nom du wiki et reste cherchable.

Ces noms sont des noms propres de lieux : les traduire de tête reviendrait à
fabriquer 38 toponymes. Ils attendent une source vérifiée (wiki FR ou client de
jeu en français).

**Enjeu** : cosmétique en français, nul en anglais. Le bloc « Où farmer » est
exploitable en l'état dans les deux langues.

## Foyers de farm : paliers T3 et T4 — ✅ **FAIT le 27/08/2026**

Les 16 captures T3/T4 des huit lignes sont versées dans `ressources/wiki/` et
parsées par `gw2_parse_dropped_by_v2.py`, mais **ne sont pas exposées** dans le
bloc « Où farmer ».

**Pourquoi c'est écarté** : 50 T3 + 50 T4 sur 450 unités par gift, soit 11 %
chacun. `farm_hubs.tiers` déclare les paliers exposés et leur poids ; ajouter
`t3` et `t4` à cette liste suffirait à les faire apparaître, une fois leurs
compteurs calculés. Les tableaux sont maigres — les Totems T3 alignent 8 créatures, le T4
en aligne 11 — et les mobs concernés sont de bas niveau, croisés en passant.

**Fait.** `farm_hubs.tiers` passe de deux à quatre paliers, `counts` et `lines`
gagnent leurs entrées t3/t4. Six foyers de bas paliers ont dû être **ajoutés** —
Kessex Hills, Queensdale, Gendarran Fields, Iron Marches, la Désolation, le
Labyrinthe du Roi Fou : la liste était bâtie sur les seuls T5 et T6, donc
sélectionner T3 vidait le bloc. Même structure, même seuil relatif de 8 %.

Rendu : T3 → 5 foyers, T4 → 6, T5 → 15, T6 → 16.

## common_required supprimé — ✅ **RÉSOLU le 27/08/2026**

La table parallèle est morte. Le bloc « Matériaux communs » lit désormais
`computeGrandTotal`, comme le grand total. **Une seule source.**

**Pourquoi elle était fausse** : elle portait des exigences *directes* de recette
là où l'affichage attendait des *totaux*, et posait un gabarit générique de
250/250/250/77 sur des légendaires qui n'ont pas ces exigences. The Ascension n'a
aucun Tribut mystique, Transcendence aucune exigence directe en ectoplasmes.

**Diff exhaustif sur les 85 légendaires** : 64 affichages changent, **aucun ne
disparaît**.

- Vision : obsidienne 250 → **421**, ectos 250 → **1 017**, pièces 250 → **499**
- Coalescence : 250 → **499** sur trois matériaux
- 62 armes gen1/gen2/gen3 n'affichaient **rien** faute d'entrée dans la table.
  Elles affichent maintenant leurs 77 trèfles et 250 pièces.

**Performance** : 1 ms par appel, sur 319 composants et 1 108 clés `qty`. Aucun
sujet.

`gw2_audit_v20.py` porte un garde qui **échoue** si `_meta.common_required`
réapparaît. `_meta.common_required_scope` garde l'historique et la règle : si une
exigence manque à l'affichage, c'est un maillon absent de la chaîne — à ajouter
là, jamais dans une table à côté.

### Les six écarts — ✅ **INSTRUITS le 27/08/2026, les six valeurs sont justes**

Décomposition sur les arbres versés. **Aucune donnée n'a changé** : `qty` avait
raison partout, c'est l'ancienne table qui se trompait.

| légendaire | matériau | total | décomposition |
|---|---|---|---|
| Ad Infinitum | ectos | 1 039 | 250 Beta Fractal Capacitor + 250 Fractal Capacitor + 25 Unbound Wings + 10 Bound Wings + 5 Mithrillium + 249 trèfles + 250 Gift of Fortune |
| Ad Infinitum | obsidienne | 339 | 90 (Dragonite, Empyreal, Bloodstone) + 249 trèfles |
| Selachimorpha | obsidienne | 488 | 60 + 178 trèfles + 250 Gift of Castoran Mastery |
| Endless Summer | obsidienne | 283 | 250 Gift of Infused Gems + 33 trèfles |
| Orrax Manifested | trèfles | 68 | 30 Gift of the Side Course + 38 Draconic Tribute |
| Vision | obsidienne | 421 | 249 trèfles + 100 Fulgurite + 72 |

**Orrax est le cas le plus parlant** : l'ancienne table annonçait 38 trèfles, en
ne comptant que le Tribut draconique. Elle ignorait purement et simplement la
branche du Gift of the Side Course, soit 30 trèfles — près de la moitié.

**Coût unitaire du trèfle, recoupé sur cinq arbres** : environ **3,23** pièces,
ectoplasmes et obsidiennes par trèfle. 77 → 249, 55 → 178, 38 → 123, 30 → 97,
10 → 33. Le rapport tient partout à l'arrondi près. Documenté dans
`_meta.common_required_scope` pour servir de recoupement rapide.

## Vision — chaîne complétée le 27/08/2026, `common_required` reste à revoir

Les 167 ectoplasmes manquants sont rentrés. **Total Vision : 850 → 1 017**,
conforme à l'arbre une fois réintégrés les 300 du kralkatite que l'arbre omet
(branche de collection).

Six maillons créés : `lump_of_mithrillium`, `crystalline_ingot`, `fulgurite`,
`diviners_orichalcum_imbued_inscription`, `banner_of_the_commander` (+ pôle et
pennon), `olmakhan_bandolier_chain`.

**Les totaux à plat ont été retranchés de ce que la chaîne apporte** — sinon les
deux se cumulent (`_meta.flat_vs_chain_rule`). Vision : ectos 250 → 249,
obsidienne 421 → 321. Coalescence : 499 → 249 sur les deux. **Les totaux
calculés ne bougent pas** : Vision 421 d'obsidienne, Coalescence 499 partout.
Seule la répartition entre plat et chaîne change.

Diff exhaustif passé sur tous les légendaires : **seuls Vision et Coalescence
bougent**, et uniquement là où c'était voulu.

### Reste ouvert : `common_required` de Vision

`obsidian = 250` ne correspond toujours à rien — la vraie exigence directe vaut
**172** (100 Fulgurite + 3 × 24). Et `ectos = 250` face à un total de 1 017.
Ces deux valeurs sont des reliquats du gabarit générique.

## Les bits de collection ne réduisent pas les besoins — 5 composants sur N câblés

Le mécanisme existe : `craft_components[].qty_extras` porte `sub` + `bit` +
`amount`, et `pendingExtra` dans `computeGrandTotal` retranche ce qui est déjà
validé. Il était câblé sur quatre composants : `blood_ruby`, `jade_shard_lw3`,
`orrian_pearl_lw3`, `karma` — tous sur Aurora. **`xunlai_electrum_ingot` a été
ajouté le 27/08/2026** (21 bits d'Aurora II, un lingot par sanctuaire infusé).

**Un piège d'implémentation à connaître** : `pendingExtra` n'est atteint que si
le composant porte une entrée `qty` pour le légendaire sélectionné. Les 21
lingots étaient portés à plat par `qty['spark_of_sentience'] = 21`, donc par la
chaîne — et `qty_extras` n'aurait jamais été lu. Il faut ramener la base à
`qty['<legendaire>'] = 0` et passer la quantité en `qty_extras`, sinon les deux
se cumulent.

**Revue faite le 27/08/2026** : les sources ne déclarent que **quatre**
`currency_cost` sur des bits, et les quatre sont câblés (Natto, Lieutenant Bran,
Exemplar Ylan, la Relique d'un dieu). Rien à rattraper de ce côté.

**Balayage fait le 27/08/2026.** Les 64 collections ont été passées au crible :
**74 mentions chiffrées de consommation** vivent en prose. Soixante-treize sont
déjà portées par la chaîne — ectoplasmes et notes de recherche de Stella
Radians, éclats de magnétite de Coalescence, essences de Coalescence III.

**Une seule manquait vraiment** : les runes et sigils légendaires consomment
**300 trèfles mystiques et 600 jetons de fournisseur**, et `provisioner_token`
n'existait dans aucun composant. Créé, avec son plafond de 105 par semaine, et
marqué `verified: false` — le compte vient de la prose, pas d'une source
vérifiée. À confirmer en jeu.

## Complétude — état réel au 27/08/2026

### Armes gen1/gen2 — le code existait, l'onglet était mort

Le sélecteur de génération, `genOf` et les notes de coût par génération étaient
tous écrits. **Ils n'étaient jamais rendus** : `tab_contract` demandait les flags
`isWeapons` et `isTrinkets`, qui n'existent nulle part. Les vrais s'appellent
`isWeaponTracker` et `isTrinketTracker`.

Zéro occurrence contre 4 pour `isArmorSet`, qui fonctionnait — d'où une panne
limitée à deux hubs, et silencieuse : un flag inconnu vaut `undefined`, donc
faux, donc l'onglet ne s'affiche pas et rien ne le signale.

Corrigé dans le contrat, pas dans le JSX : les flags du JSX sont les noms
d'origine, c'est le contrat qui les avait mal recopiés. `gw2_audit_v21.py`
**échoue** désormais si un flag demandé par `tab_contract` n'existe pas dans le
JSX.

**Un point à vérifier en jeu, non tranché** : la découverte filtre sur
`it.type !== "Weapon"`. Aetheric Anchor est décrit dans les sources comme
`container → legendary spear + legendary staff` (apiId 105497). Si l'API le rend
comme conteneur et non comme arme, il n'apparaît pas dans la liste. À regarder
dans l'onglet Armes, catégorie Divers : il doit y avoir Klobjarne Geirr **et**
Aetheric Anchor.

### Les collections — le vrai chantier

**3 légendaires sur 85 portent un bloc `collections`** : Prismatic, Aurora,
Vision. Les 26 autres ont leur recette et leur chaîne de composants — vérifiées
contre les arbres — mais aucune étape.

Il faut deux choses, de nature différente :

**a) Les définitions de bits.** `gw2_dump_bits_v4.py --catalogue` part désormais
des quatre catégories de collections légendaires de `gw2_achievements_ref.json`
(**147 succès**) au lieu du seul JSX, qui ne peut pas référencer ce qui n'y est
pas encore. Le JSX en apporte 35 de plus ; les deux modes fusionnent.

⚠ **À lancer en local par Antoine** : l'API GW2 renvoie **403 Forbidden** depuis
l'environnement de Claude, et `web_fetch` réécrit les URL — une requête sur le
succès 2351 rend le 4949. Aucun contournement.

**b) Le « comment » de chaque bit.** L'API donne l'ordre et le libellé des
étapes, jamais où ni comment les obtenir. C'est ce qui fait la valeur du
tracker — sur Aurora, chaque bit porte un `how`, un `how_ref`, parfois un
`unlock_first` ou un `currency_cost`. Wiki, guides, et vérification en jeu.

**Ordre proposé** : Ad Infinitum (en cours), puis Endless Summer (anneau).

## Migration vers collections{} — Ad Infinitum validé, 10 restants

**Ad Infinitum migré le 27/08/2026**, forme validée avant de généraliser :
4 collections, **46 étapes nommées, 46 `how`**, totaux comptés sur les bits du
dump au lieu d'être écrits à la main.

Les trois structures ont fusionné en une :
`raidAchievements[]` du JSX a donné les `bitTips` par étape, `achievements[]`
des sources la note et l'identifiant, le dump les noms d'étapes.

**Marquage** : les 46 `how` portent `how_verified: false` et un `how_ref` disant
d'où ils viennent. Ce sont des conseils éditoriaux repris tels quels, pas des
instructions revérifiées étape par étape.

**Divergence conservée** : la note d'`adinf_4` différait entre le JSX et les
sources. La version JSX chiffre les murs d'échelle (Complexe souterrain 53,
Étherlame 65, Mai Trin en T4), elle est retenue ; l'autre passe en `note_alt`
plutôt que d'être perdue. `note_alt` n'est pas encore rendu — un avertissement
d'audit le signale.

**JSX** : le bloc `raidAchievements` d'Ad Infinitum est supprimé, et la garde du
bloc « Collections & succès » masque désormais aussi quand `T.collections`
existe — sans quoi Ad Infinitum aurait affiché les deux chemins.

**Restent 10 légendaires** : Vision, Aurora, Coalescence, Selachimorpha, Eikasia,
Upgrades, Perfected Envoy, Endless Summer, Stella Radians, Orrax Manifested,
Strife Unending — moins Vision et Aurora qui ont déjà `collections{}` et
demandent une fusion plutôt qu'une création.

## (ancien) Migration achievements[] → collections{} — décidée, en cours

**Décision d'Antoine le 27/08/2026, option B** : une seule source de vérité. Les
onze légendaires qui décrivent leurs collections en `legendaries[].achievements[]`
passent à `legendaries[].collections{}`, la structure riche déjà utilisée par
Prismatic, Aurora et Vision.

| | `collections{}` | `achievements[]` |
|---|---|---|
| qui | Prismatic, Aurora, Vision | 11 autres |
| forme | `items[]` avec `bit`, `name`, `how`, `how_ref`, `unlock_first`, `currency_cost` | `key`, `id`, `name`, `total`, `note` |
| conseils | par étape, dans l'item | `bitTips` **dans le JSX**, indexés par bit |

Aucun légendaire n'a les deux aujourd'hui.

### Dump complet le 27/08/2026 — 163 succès, bilingue, zéro bit sans nom

Un seul absent : **9330 `stella_forge_guard`**, que l'API ne renvoie pas
(`not_returned: [9330]`). À instruire à part — succès retiré ou non exposé.

### État par collection avant migration

**13 collections sont des compteurs sans étapes** — l'API ne leur donne aucun
bit. Ce n'est pas un trou : ce sont des succès à progression numérique (les
quatre Path of the Ascension, les quatre Mastery d'Orrax et d'Endless Summer,
Legendary Armorer, Vision II, les collecteurs de runes et de cachets). En
`collections{}` elles auront un `total` mais pas d'`items[]`.

**Neuf totaux divergent du dump, tous par sous-compte :**

| légendaire | collection | `total` écrit | bits réels |
|---|---|---|---|
| Strife Unending | `strife_mists_research` | 3 | **8** |
| Strife Unending | `strife_unending` | 10 | **11** |
| Orrax Manifested | `orrax_contained` | absent | 5 |
| Orrax Manifested | `orrax_isles` | absent | 13 |
| Orrax Manifested | `orrax_shadows` | absent | 7 |
| Orrax Manifested | `orrax_feast` | absent | 18 |
| Orrax Manifested | `orrax_final` | absent | 1 |
| Perfected Envoy | `envoy_1` | absent | 18 |
| Perfected Envoy | `envoy_2` | absent | 14 |

Les deux de Strife Unending sont **faux, pas absents** : `Mists Research` a bien
8 étapes (parler à Dugan, puis sept enquêtes en McM), et `Mists Research: Strife
Unending` en a 11. Le tracker en annonçait 3 et 10.

### Ce qui bloquait : 17 succès absents du dump — ✅ résolu

Le dump couvre les quatre catégories « Legendary … » des Collections. Mais 17
succès référencés par les sources vivent **ailleurs** — Visions of Eternity,
Janthir Wilds, PvP :

The Ascension (4), Endless Summer (2), Stella Radians (2), Strife Unending (2),
Orrax Manifested (7).

`gw2_dump_bits_v7.py --sources` lit désormais `legendaries[].achievements[].id`
et les ajoute : **26 identifiants** que le catalogue seul ne voyait pas.

```
python3 gw2_dump_bits_v7.py --catalogue --sources
```

### Quatre totaux à revérifier une fois le dump complet

| légendaire | collection | `total` déclaré | bits |
|---|---|---|---|
| Endless Summer | `summer_krait` | absent | 0 |
| Orrax Manifested | `orrax_final` | absent | 1 |
| Perfected Envoy | `envoy_1` | absent | 18 |
| Perfected Envoy | `envoy_2` | absent | 14 |

Les autres concordent exactement — les totaux écrits à la main sont bons.

### Ce que la migration devra préserver

- `note` de collection → `note` de collection.
- `bitTips[i]` du JSX → `items[i].how`, avec `how_verified: false` et un
  `how_ref` disant d'où ça vient. Ce sont des conseils, pas des instructions
  vérifiées : les promouvoir sans marqueur serait une généralisation.
- `collection_unlocks` est indexé par `achievementId` et reste valable.
- **JSX en dernier, une seule passe** : suppression du chemin `achievements[]`
  et des 38 blocs `bitTips`, une fois les sources migrées et vérifiées.

## Sources payantes contre sources introuvables — ✅ **RÉSOLU le 27/08/2026**

La règle d'audit disait « aucune source `free_repeatable` — le joueur sans stock
n'a aucune piste ». C'était faux pour cinq composants : ils ont une piste, elle
est payante et plafonnée.

`paid_repeatable` + `paid_cap` posés sur cinq d'entre eux, d'après les sections
Acquisition des captures : Bava Nisos 20/semaine, Janthir Syntri et Lowland
Shore 7 par PNJ et par semaine, Homestead et Seer Runestone sans plafond chiffré.

**Les deux cas ouverts sont clos le 27/08/2026.** Recapturés, et l'absence
venait bien de la capture :

- **Alliage de titan neutralisé** : quatre vendeurs — Arid Esker, Vigilant Dawn
  et Whispers of Wind à Janthir Syntri (cœur à **compléter**), plus Ward Trader
  Sampaguita à Bava Nisos, sans condition. Aucun plafond hebdomadaire annoncé.
- **Éclat des Landes calcinées** : Kodan Landspeaker, **20 par semaine et par
  PNJ**, éclats normaux et réduits confondus. ⚠ Exige le cœur de renom
  **INCOMPLET** — le compléter ferme la source, ce qui confirme la règle déjà
  notée pour cette famille d'éclats.

`free_sources_note` est retiré des deux : il n'a plus lieu d'être.

## Les blocs `currencies` du JSX — ✅ **RÉSOLU le 27/08/2026**

Deuxième table parallèle, même maladie que `common_required` : des exigences en
doublon de `craft_components[].qty`, restées au gabarit de 250. Huit valeurs
alignées sur les sources, toutes vérifiées sur les arbres.

| légendaire | composant | JSX | réel |
|---|---|---|---|
| Orrax Manifested | Ursus Oblige | 300 | **1 250** |
| Strife Unending | Mémoire de bataille | 250 | **500** |
| Coalescence, Stella Radians | Pièce mystique | 250 | **499** |
| Selachimorpha | Obsidienne | 250 | **488** |
| Endless Summer | Obsidienne | 250 | **283** |
| Orrax Manifested | Trèfle mystique | 38 | **68** |
| Ad Infinitum | Relique fractale immaculée | 240 | **140** |

**Ursus Oblige affichait 300 pour 1 250 réellement nécessaires** — un facteur
quatre sur la ressource principale d'Orrax.

## Doubles comptes — 1 sur 3 tranché le 27/08/2026

### ✅ Fragment de pierre de sang — corrigé

Aurora, Vision et Coalescence portaient **1 à plat** en plus du Don de maîtrise
qui l'exige déjà : total de **2 pour 1 requis**. L'arbre est net — Vision
`1 <- Gift of Arid Mastery`, Coalescence `1 <- Gift of Desert Mastery`, aucun
nœud direct. Les trois totaux à plat sont retirés, la chaîne suffit.

### ✅ Ball of Dark Energy et Stabilizing Matrix — tranchés le 27/08/2026

Les deux portent une exigence **à plat sur `obsidian__per_piece`** ET une
exigence **via `cube_stabilized_dark_energy`**, qui lui-même vaut 1 par pièce :

| composant | à plat / pièce | via le cube | total calculé |
|---|---|---|---|
| Ball of Dark Energy | 1 | 1 × 1 | **2** |
| Stabilizing Matrix | 75 | 1 × 75 | **150** |

**L'arbre de la cuirasse tranche** : par pièce, tout passe par le cube.
`75 Stabilizing Matrix <- Cube`, `1 Ball of Dark Energy <- Cube`, **aucun nœud
direct sur la pièce**. Les entrées à plat étaient bien un doublon.

Corrigé : la matrice repasse de 150 à **75** par pièce, la boule de 2 à **1**.
Sur les six pièces d'un set, **450 matrices de trop** disparaissent.

## Jeton de fournisseur — ✅ **VÉRIFIÉ le 27/08/2026 sur le wiki**

Le plafond n'est **pas** de 105 par compte : c'est **7 par semaine et par
VENDEUR**. Le 105 de la prose était un total de quinze vendeurs présenté comme
un plafond déclaré. Cadence corrigée, `verified: true`.

**Repère global relevé sur la page** : **2 600 jetons** suffisent aux 52 Dons
d'artisanat de TOUS les légendaires de l'Armurerie — 8 cachets, 7 runes, la
relique, 36 pièces d'armure. Ce total compte l'armure d'obsidienne ET celle de
l'Émissaire, dont les fonctions se recouvrent : une seule par classe d'armure
ramène le besoin à **1 700**. Inscrit dans la note du composant.

### Reste : 450 contre 600

Troisième table parallèle, dernière du genre : le bloc `currencies` du JSX
déclare **450** pour `upgrades` (apiId 29), la chaîne en calcule **600**
(6 runes × 50 + 6 sigils × 50, d'après la prose des deux collections).

Ni l'un ni l'autre n'est sourcé. Le 600 vient de ma lecture de la prose, le 450
d'une saisie plus ancienne. **À vérifier en jeu avant d'aligner quoi que ce
soit** — aligner sur un nombre non vérifié ne ferait que figer une erreur.

## Armes — ✅ liste réconciliée le 27/08/2026, deux patterns identifiés

### Douze fiches inventées remplacées

Chacune portait un `precursor` et un `gift_unique` **absents des 53 lignes de la
table du wiki** : Sword of Wrath, Elegy Mosaic, Ancient Tome, Gleaming Blade,
Sacred Jungle Defender, Keeper of the Wilds, Hope's Last Spark, Claw of
Retribution, et quatre « of Aurene's Power ». Aucun n'existe.

À leur place, les armes réelles que le tracker ne montrait pas :

| gen2 | précurseur | gen3 | précurseur |
|---|---|---|---|
| Claw of the Khan-Ur | Claw of Resolution | Aurene's Fang | Dragon's Fang |
| Flames of War | Liturgy | Aurene's Flight | Dragon's Flight |
| Pharus | Spero | Aurene's Tail | Dragon's Tail |
| Sharur | Might of Arah | Aurene's Wing | Dragon's Wing |
| The HMS Divinity | Man o' War | | |
| The Shining Blade | Save the Queen | | |
| Verdarach | Call of the Void | | |

**Tigris disparaît** : la table la donne en Final tier de Chuka and Champawat,
c'est un précurseur. **The Binding of Ipos** passe sous le préfixe `gen2_` —
vraie gen2, elle vivait hors préfixe et n'entrait donc pas dans le sélecteur du
Grand Total. Ses références dans `craft_components` ont suivi.

**Réconciliation complète** : gen1 21 (les 20 du wiki + Eternity), gen2 16/16,
gen3 16/16, aucune manquante, aucune en trop.

⚠ Les onze fiches créées portent `recipe_verified: false` : leur recette est
reprise du gabarit de génération. **Les composants propres à chaque arme restent
à établir** — c'est le prochain chantier.

### Deux patterns pour les collections d'armes

- **Pattern A** — chaîne `X I: … / II: … / III: …` dans « Legendary Weapons »,
  plus un `Legendary Weapon: X` final. 25 armes.
- **Pattern B** — arme d'histoire hors de cette catégorie. Caladbolg s'obtient
  par **Knight of the Thorn**, groupe **Side Stories** : `Dreams of a Thorn`
  (3390), `Shards of a Thorn` (3388), `Sword Taxonomy` (3389), `The Sword
  Regrown` (3387), `Knight of the Thorn` (3391), plus `Forms of the Thorn`
  (9221) et `Reverie of a Thorn` (9223).

**Une table de correspondance ne doit donc pas se limiter à « Legendary
Weapons »** : elle doit accepter des identifiants de n'importe quel groupe.

### ✅ Collections des armes posées le 27/08/2026

**25 armes en ont** — les 21 gen1 et les quatre gen2 de HoT (Astralaria, Chuka
and Champawat, HOPE, Nevermore) — soit **87 collections et 1 978 étapes
nommées**.

**Les 28 autres n'en ont AUCUNE, et c'est un vide établi** : les douze gen2 de
PoF (Eureka, Exordium, Sharur, Verdarach, Xiuquatl, Pharus, Shooshadoo, Claw of
the Khan-Ur, Flames of War, The HMS Divinity, The Shining Blade, The Binding of
Ipos) et les seize gen3 **fabriquent leur précurseur à la Forge mystique** au
lieu de le gagner par une chaîne de succès. Aucun des 6 785 succès du
référentiel ne les mentionne.

`collections_none` le dit explicitement et **s'affiche dans l'onglet** : sans
ça, l'onglet vide serait indiscernable d'une donnée manquante, et on relancerait
le rapprochement à chaque session.

⚠ **Aucun `how` n'est écrit sur ces 1 978 étapes.** Elles sont nommées, leur mode
d'obtention reste à documenter — c'est le plus gros chantier éditorial restant,
loin devant tout le reste.

### Reste : les armes d'histoire comme cinquième catégorie

Caladbolg, Itzel's Boon, Lorekeeper, Elegy, Reaver of the Mists, H.O.P.E.
(Scepter) sont de vraies armes à suivre — collections, farm de composants,
déblocages. Elles ont été **retirées** parce que leurs fiches étaient inventées,
pas parce qu'elles n'ont pas leur place. À recréer proprement, sur leurs vraies
chaînes de succès.

**`Eordas Grip` n'existe pas** : aucune page wiki, absente de la table. Ne pas
la recréer.

## Étapes documentées — Wayfarer's Henge fait le 27/08/2026

**339 étapes sur 468 (72 %)**, contre 284 (60 %) avant.

Les quatre collections d'Aurora sont complètes : **55 conseils ajoutés**, tirés
de la colonne Notes du tableau « Collection items » du wiki. Ce sont les
**premiers `how` marqués `how_verified: true`** — les 284 autres viennent des
anciens `bitTips` et restent à `false`.

`gw2_parse_collection_v1.py` fait le travail. Deux pièges du HTML wiki traités :
le JavaScript inline des liens de point de passage, qui finissait sinon dans la
note, et les entités des chatlinks `[&BMUJAAA=]`, qu'il faut au contraire garder.

**Rapprochement par rang, avec garde-fou** : tenté seulement si les deux listes
ont la même longueur. Le contrôle par nom ne vaut rien ici — l'API rend une
phrase d'action (« Bring a Fire Orchid to Kodama… ») là où le wiki rend le nom
de l'objet (« A Flower for Kodama »). Deux vocabulaires, un seul ordre.

42 étapes prennent le libellé du wiki, plus lisible ; l'ancien reste en `name_api`.

### Bilinguisme : les noms oui, les conseils non

- **Les `name` sont des chaînes anglaises**, comme partout ailleurs dans
  `collections{}` — `NXS` les traduit au rendu par le dictionnaire de termes.
  Rien ne change, la convention est respectée.
- **Les 55 `how` du wiki sont en anglais seul.** Leur champ `fr` vaut `null`,
  pas une copie de l'anglais : recopier ferait croire à une traduction qui
  n'existe pas. `L()` se replie sur l'anglais, même convention que les noms de
  sous-zones. `how_fr_missing: true` les rend dénombrables.

**À faire un jour** : traduire ces 55 conseils. Cosmétique en anglais, nul en
français — le contenu est là, seule la langue manque. Les 6 autres `how` dont
le français est identique à l'anglais viennent des anciens `bitTips` et sont
sans doute dans le même cas.

### Reste : 10 étapes sur 468, toutes sans objet — **458/458 utiles**

| collection | légendaire | sans conseil | pourquoi |
|---|---|---|---|
| Unknown Nightmares: Gift of the Feast | Orrax | 10 | **rien à écrire** : ce sont des plats de cuisine, le wiki ne met pas de note sur ces lignes et le nom suffit |

**`Incursive Investigation: Working Together` est fait** (succès 8830). Ce
n'était pas une redirection à contourner : la collection **est documentée dans
la page de catégorie**, section Objectives, sans tableau d'objets. Les quatre
rendez-vous avec le Mist Stranger ont leur `how` — la zone instanciée dédiée,
accessible depuis l'Arche du Lion.

### ⚠ Piège découvert : l'ordre des bits n'est pas celui du wiki

Sur cette collection, **le bit 9 porte l'objectif 2**. Un rapprochement par rang
aurait tout décalé d'un cran. Le champ `note_ordering` le signale sur la
collection concernée.

**Vérification faite sur les 20 collections déjà traitées** : aucun nom d'étape
ne correspond au texte d'un autre bit — le rapprochement par rang y était sain.
Mais la garde « même longueur » ne suffit pas à le garantir : il faudrait
comparer les contenus, pas seulement les comptes.

## Étapes des armes — lots identifiés, palier IV fait

Les quatre paliers ne coûtent pas la même chose :

| palier | étapes | libellés **distincts** | mutualisation |
|---|---|---|---|
| **IV — succès final** | 324 | 84 | ✅ **fait** — 234 liées à un composant |
| **II — Perfected** | 317 | **79** | 265 étapes partagées entre 24 armes |
| I — Experimental | 382 | 348 | quasi nulle |
| III — Précurseur | 731 | 673 | quasi nulle |

### ✅ Palier IV — 234 étapes sans une seule capture

Ses étapes ne sont pas des actions mais des **composants** : Icy Runestone,
Gift of Mastery, Gift of Exploration, Bloodstone Shard, Obsidian Shard, Gift of
Fortune, Mystic Clover… chacun ×20.

Quatorze existent déjà dans `craft_components`. Elles portent désormais un champ
`component` — une **référence, pas une copie** : sources, cadence et prix se
lisent dans le composant, et un `how` paraphrasé aurait divergé dès la première
mise à jour. Le rendu retombe sur le `tip` du composant.

### Palier II — ⚠ **la mutualisation était un mirage**, capture d'essai du 27/08/2026

`The Moot II: The Perfected Mace` a tranché. Ce que le wiki apporte, ce sont les
**noms d'objets** — « Weighted Mace Head », « Desert Magics: Mace Edition »,
« The Moot Vol. 2 » — que l'API ne donne pas : elle rend la phrase d'action à
leur place. Les notes du wiki, elles, **répètent le plus souvent cette même
phrase** ; seules 4 des 14 apportent autre chose.

**Or les 79 libellés partagés étaient les DESCRIPTIONS, déjà dans le tracker.**
Les noms, eux, sont propres à chaque arme : « Mace Edition » contre « Hammer
Edition ». Le palier II n'est donc **pas** un lot bon marché — il faut ses
24 pages, comme les paliers I et III.

Le gain reste réel mais modeste : lisibilité des libellés. 14 noms et 14 `how`
posés sur The Moot II.

### Paliers I et III — au fil des cibles

1 021 libellés distincts pour 1 113 étapes. Chaque arme a ses objets et ses
lieux : il faut les pages, arme par arme, comme tu joues.

## Le champ `unlock` — ✅ amorcé le 27/08/2026 depuis l'encadré du wiki

Antoine a repéré que l'encadré d'un succès porte trois champs que ni l'API ni le
tableau des objets ne donnent :

| champ | ce qu'il dit |
|---|---|
| `prerequisite` | le succès à terminer avant |
| `unlock_item` | l'objet qui déclenche l'ouverture |
| `reward` | ce que la collection rend |

**Astralaria III le résume** : prérequis *Historian of the Armaments*, objet
déclencheur *The Apparatus* — le précurseur du palier II — et récompense le
*Chest of Time and Space*, qui **contient la recette** du Mechanism.

L'ordre entre paliers devient donc une **donnée** au lieu d'une note en prose :
`unlock_item` porte le précurseur du palier précédent.

`gw2_parse_achievement_box_v1.py` fait le travail. Posé sur **16 collections**,
celles dont la capture porte l'encadré — les autres l'auront au fur et à mesure.

**Un piège de bornage rencontré** : quand `Unlock Item` manque, le champ
précédent déborde et ramène « Salvation's Cost Title: ». Le parseur borne
désormais sur le **premier** intitulé rencontré, quel qu'il soit, et écarte les
valeurs qui ressemblent à une phrase plutôt qu'à un nom.

**Reste** : les 87 collections d'armes non encore capturées, et la fusion avec
`collection_unlocks`, qui porte déjà des portes de déblocage (niveau de fractale,
maîtrises) pour quelques succès. Les deux coexistent aujourd'hui sans se
contredire — le bloc du wiki ne s'affiche que si `collection_unlocks` ne dit rien.

---

## Quelle pierre runique, arme par arme — ouvert le 01/09/2026

`Icy Runestone` (19676) et `Mystic Runestone` (79418) sont **deux objets
distincts, échangeables 1 pour 1 chez le même PNJ**, au même prix — 1 po pièce.
Même schéma que les Ancient Coins et Curious Coins. Le coût ne dépend donc pas
de laquelle des deux l'arme demande, mais **la donnée doit dire la bonne**.

`gen2_craft_note` affirme que la gen2 utilise la Mystic Runestone à la place de
l'Icy Runestone de la gen1, et `shared_components` porte `mystic_runestone` pour
les seize armes gen2. Les captures contredisent cela pour les deux armes lues à
ce jour :

| arme | génération | ce que dit sa page wiki | source |
|---|---|---|---|
| Astralaria | gen2 | **100 Icy Runestones**, chez Rojan the Penitent | `ressources/wiki/astralaria.html` |
| HOPE | gen2 | **100 Icy Runestones**, chez Rojan the Penitent | `ressources/wiki/hope.html` |
| Nevermore | gen2 | **100 Icy Runestones**, chez Rojan the Penitent | `ressources/wiki/nevermore.html` |
| Bolt | gen1 | **100 Icy Runestones** — témoin, conforme à `gen1_craft_note` | `ressources/wiki/bolt.html` |
| Chuka and Champawat | gen2 | **100 Icy Runestones**, chez Rojan the Penitent | `ressources/wiki/chuka_and_champawat.html` |
| Sunrise | gen1 | **100 Icy Runestones** | `ressources/wiki/sunrise.html` |
| Twilight | gen1 | **100 Icy Runestones** | `ressources/wiki/twilight.html` |

« Mystic Runestone » n'apparaît dans aucune de ces pages. **Les quatre gen2 à
collections nomment toutes l'Icy Runestone**, et trois gen1 servent de témoins —
Bolt, Sunrise, Twilight — qui la nomment aussi. Les deux générations lisent donc pareil, ce qui rend
`gen2_craft_note` suspect plutôt que la lecture.

⚠ Ces quatre-là sont précisément les armes que `gift_of_desert_mastery` exclut
(voir `gen2_craft_note`). Il reste possible que les douze autres gen2, elles,
demandent bien la Mystic Runestone — auquel cas la note ne serait pas fausse mais
trop générale. **Rien ne le tranche avant leurs pages.**

**En attente** : les douze autres pages gen2 — celles des armes SANS collection,
craftées via Hobbs, qui sont aussi celles que la note oppose aux quatre ci-dessus. La règle est donc de **relever
la runestone nommée à chaque intégration d'une page d'arme**, et de ne trancher
`gen2_craft_note` et les `shared_components` qu'une fois la série complète —
un correctif partiel ferait cohabiter deux conventions.

La donnée reste **en l'état** d'ici là : le prix étant identique, le grand total
n'est pas faux, seule l'étiquette l'est.


---

## Régionalisation complète du tracker — ouvert le 01/09/2026

Objectif : le tracker entier en français, pas quelques champs. État des lieux
chiffré sur `gw2_sources_v192.json` :

| catégorie | textes distincts | emplacements | état |
|---|---|---|---|
| `how` en anglais, `fr: null` | 666 | 744 | proposition FR fournie |
| `tip` / `note` en français seul | 69 | 96 | proposition EN fournie |
| `name` de secteur / collection | 57 | 57 | **à résoudre par API** |

Livrable : `gw2_traductions_v1.xlsx`, trois onglets plus une légende. Colonne
jaune « Traduction validée » à remplir par Antoine ; vide = la proposition convient.

**Convention retenue** (arbitrage du 01/09) : les noms propres GW2 restent en
anglais dans les propositions françaises. Leur forme officielle viendra de
`/v2/*?lang=fr` lors d'une passe ultérieure — les traduire à la main produirait
des noms introuvables en jeu. Seule la prose est traduite.

**Reste à faire après retour du tableur** : injecter les colonnes validées dans
les sources, puis écrire la passe API qui résout les 57 noms propres et, plus
largement, substitue les noms propres anglais des `how`.

**Non traité ici** : les 3 258 `name` d'objets et d'étapes, qui sont des chaînes
simples par convention et relèvent de la même passe API, pas d'une traduction.
