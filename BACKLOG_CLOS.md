# Backlog — sections closes

Déplacées telles quelles depuis `BACKLOG.md` le 08/10/2026. Historique : rien n'y est
à faire. Les sections encore ouvertes, et le plan, sont dans `BACKLOG.md` et
`PLAN_RESTANT_v*.md`.

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

## Les bits de collection ne réduisent pas les besoins — ✅ **RÉSOLU le 07/10/2026 (C5)**

> Clos par C5 (sources v380, JSX v246) : `qty_extras` et `karma_budget` sont devenus des `cost` d'étape, lus par les deux moteurs y compris dans les sous-collections ; l'arête `xunlai -> spark_of_sentience` a été retirée. Le texte ci-dessous décrit l'ancien mécanisme.


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

## Quelle pierre runique, arme par arme — ✅ **TRANCHÉ le 01/09/2026**

`Icy Runestone` (19676) et `Mystic Runestone` (79418) sont deux objets distincts,
échangeables 1 pour 1 chez le même PNJ, au même prix — 1 po pièce.

**La ligne de partage n'est pas la génération, c'est le mode d'obtention du
précurseur.**

| famille | armes | runestone |
|---|---|---|
| gen1 — précurseur par collection | 20 | **Icy** |
| gen2 — précurseur par collection | 4 (Astralaria, HOPE, Nevermore, Chuka) | **Icy** |
| gen2 — précurseur acheté chez Hobbs | 12 | **Mystic** |
| gen3 — précurseur de Forge mystique | 16 | **Mystic** |

`gen2_craft_note` disait « la gen2 utilise la Mystic Runestone » : vrai pour douze
armes sur seize, faux pour les quatre à collections. La note est corrigée et
`shared_components` de ces quatre passe à `icy_runestone`, `needed_for` des deux
composants suit.

**Le grand total est inchangé** : même prix, même marchand. Seule l'étiquette
était fausse.

Reste à lire : 8 des 12 gen2 via Hobbs (Pharus, Sharur, Shooshadoo, The Binding of
Ipos, The HMS Divinity, The Shining Blade, Verdarach, Xiuquatl). Quatre ont été
lues — Claw of the Khan-Ur, Eureka, Exordium, Flames of War — toutes Mystic.

## Armes — ✅ **TERMINÉ le 01/09/2026**

Les 53 fiches d'armes sont documentées et vérifiées page à page.

| | armes | état |
|---|---|---|
| à collections | 24 | 1 978 étapes sur 1 978 couvertes |
| sans collection | 28 | recette, précurseur, don et type vérifiés |
| Eternity | 1 | recette et chaîne vérifiées |

**Plus une seule `recipe` issue du patron générationnel.** Le patron s'était révélé
faux sur Eternity, puis sur 12 des 16 gen3, puis sur Shooshadoo et Xiuquatl. Toutes
les recettes viennent désormais de l'encadré « Recipes » de la page de l'arme.

Corrections cumulées sur les 28 sans collection : **16 précurseurs, 23 `gift_unique`,
12 `slot`**. L'ancienne valeur est conservée dans `*_erreur`.

Deux singularités relevées et conservées :
- **Aurene's Voice** se forge avec le `Gift of Aurene's Horn`, pas `Gift of Aurene's
  Voice`. Seule des 16 gen3 à ne pas suivre son propre nom.
- **Les 16 gen2 offrent deux recettes**, au choix `Gift of Maguuma Mastery` ou `Gift
  of Desert Mastery`. `gen2_craft_note` le disait par un astérisque ; le champ
  `recipe` ne gardait qu'une branche. Les deux y figurent maintenant.



---

## 12 ter. Vision affichait 3 100 kralkatite — ✅ **RÉSOLU le 27/09/2026**

Antoine : collection terminée, synchro OK, étape marquée faite, et le total
disait toujours 3 100. C'était donc bien notre bug.

**Cause : `_meta.collection_key_ids` est vide.** La synchro construisait les
statuts de collection en parcourant cette table — donc elle ne construisait
rien. Tout ce qui la lisait recevait un objet vide, et la règle « une étape
validée satisfait son composant » ne pouvait rien satisfaire.

Ce qui rendait le symptôme trompeur : l'onglet Collections affiche
`_sub_status`, indexé par id de succès, tandis que le calcul lisait
`_collections`, indexé par clé — **et vide**. L'étape s'affichait donc faite
pendant que le moteur ne la voyait pas. Deux magasins pour un seul fait.

**Correction, JSX v229** : le lien clé → id est déjà dans les sources, sur
chaque collection. On le dérive au lieu de le recopier — et pour TOUTES les
cibles, pas seulement les trois qui avaient jadis un endpoint Flask dédié. Les
deux indexations sont posées, par clé et par id, parce que `satisfaits` essaie
l'une puis l'autre.

Portée : la règle s'applique désormais partout où une étape porte `component`.
Orrax en porte 20, qui n'étaient jamais pris en compte non plus.

`collection_key_ids` devient mort. À supprimer une fois la v229 vérifiée en
jeu — pas avant, pour garder le chemin de repli si la dérivation se comporte
autrement que prévu.
