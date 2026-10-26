> **Plan du restant** : `PLAN_RESTANT_v75.md` (20/10/2026) regroupe tout ce qui reste, par lot. Ce fichier-ci garde l'historique.

# Backlog

## Sommaire — sections ouvertes

Trié le 08/10/2026 (27 ouvertes, 19 closes déplacées), puis le 19/10/2026 : 3 closes de plus déplacées (régionalisation, clé dans l'URL, magasin partagé) ; 24 ouvertes, puis le 24/10/2026 : 19 closes de plus déplacées ; 5 ouvertes
**sans modification** dans `BACKLOG_CLOS.md`. Une section est close si son titre
porte ✅ sans réserve (« sauf », « reste », « ouvert »), et qu'elle n'a ni sous-section
« Reste » ni case `- [ ]` ouverte. Dans le doute, elle reste ici.

- Complétude — état réel au 27/08/2026
- Étapes des armes — lots identifiés, palier IV fait
- Deux arbitrages d'interface — ouverts le 02/09/2026
- Ouvert au 18/09/2026
- 12 nonies. Restes de la fusion du catalogue (03/10/2026)

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

## Deux arbitrages d'interface — ouverts le 02/09/2026

### ① Vision s'affiche deux fois — ✅ **RÉGLÉ le 02/09/2026**

L'onglet dédié ne rend plus Vision I, les six `Visions of`, Vision II ni les deux
Convergence : tout passe par le rendu générique. Il ne garde que le craft de
l'Encapsulator et les six Requiem Experiments.

**Reste une donnée manquante** : les six Requiem Experiments vivent en dur dans le
JSX, pas dans les sources. Ce sont les six sources d'Elegy Mosaic, 50 chacune. Tant
qu'elles n'y sont pas, elles ne peuvent pas rejoindre le rendu générique comme le
reste. À capturer : la page wiki `Requiem: Experiment 1` à `6`, ou la page
`The Convergence of Sorrow II: Requiem`.

<details><summary>Constat d'origine</summary>


Vision a un **onglet dédié** écrit à la main (bloc `selectedLeg === "vision"`) et,
depuis la migration de ses collections, ses huit `vis_*` portent une `key` — ce qui
les fait aussi passer dans le **rendu générique** piloté par les sources.

Le commentaire du tracker le dit lui-même : *« le discriminant est la présence de
`key` : seule la forme migrée la porte. Sans ce test, leur onglet afficherait deux
fois. »* L'invariant a été rompu par la migration, pas par le rendu.

**Le générique est le meilleur des deux** : il affiche la progression API réelle
(6/7), les blocs orange de déblocage, les étapes nommées. Le dédié affiche des cases
à cocher à 0/6.

Mais le dédié porte **trois sections que le générique n'a pas** : le craft du
Memory Essence Encapsulator, les six Requiem Experiments, et le compteur d'Elegy
Mosaics.

Choix retenu : retirer les sections en double de l'onglet dédié.
</details>

### ② Les 1 978 étapes d'armes n'ont aucune route dans l'interface

L'onglet Armes est une **matrice de ciblage** : il liste les 16 armes d'une
génération, on en coche, et les onglets T6 et Composants chiffrent la sélection.
C'est cohérent — mais cliquer une arme ne mène nulle part.

Or les 53 fiches d'armes portent maintenant **1 978 étapes documentées**, avec
conseils wiki, conseils de terrain, blocs `unlock` et renvois `component`. Elles
vivent sous `legendaries.gen1_bolt.collections` etc., alors que l'onglet travaille
sur une entrée agrégée `weapons`. **Aucun chemin ne relie les deux.**

C'est le plus gros écart restant entre les données et ce qu'on en voit : tout le
travail des captures est là, et invisible.

**Décision à prendre** : ouvrir la fiche d'une arme au clic (onglet Collections
alimenté par `gen*_<arme>`), ou ajouter un sélecteur d'arme au-dessus de l'onglet
Collections existant. La seconde réutilise le rendu générique qui marche déjà.

### ③ 181 désaccords entre l'arbre de craft et les tables du wiki

Le dépliage des coûts à plat en arêtes s'arrête là où deux sources se
contredisent. Ces cas ne sont **pas** des trous : la donnée reste à plat et le
total affiché ne bouge pas tant que l'arbitrage n'est pas fait.

Le détail est dans **`ARBITRAGES.md`**, régénérable par
`python3 gw2_edges_wiki_v11.py && python3 gw2_arbitrages_v6.py`.

Trois familles, qui ne se tranchent pas de la même façon :

- **Écart de compte (64)** — la clé à plat et l'arête donnent deux nombres
  différents, l'un des deux est faux. Se tranche sur la page du **parent**,
  boîte Recipe.
- **Clos par l'aléa du trèfle (67)** — la clé à plat et la chaîne disent la
  même chose dès qu'on paie le taux d'échec du trèfle. Rien à arbitrer.
- **Aléa du trèfle, reste inexpliqué (50)** — le trèfle explique une partie de
  l'écart, pas tout. Voir l'anomalie ci-dessous.

#### L'anomalie que le calcul du reste a fait sortir

Vingt et une armes gen1 portent `glob_of_ectoplasm: 250` à plat, et la chaîne
en réclame 498 : 250 pour le Don de fortune, 248 pour les 77 trèfles au taux
d'échec. Le reste vaut **−248**, exactement le coût des trèfles.

La même arme porte `mystic_coin: 250`, et là le compte tombe juste — les écus
ne servent qu'aux trèfles, donc la clé les inclut forcément.

**Tranché le 08/09, et la lecture proposée était fausse.** La table « Full
material list » de Klobjarne Geirr écrit : *38 Mystic Clovers — forged from a
total of about 123 Mystic Coins, 123 Globs of Ectoplasm, 123 Obsidian Shards,
and 74 Spirit Shards*. Les tables du wiki **incluent** donc le coût des ratés,
pour l'ectoplasme comme pour les écus. Un total qui vient d'une de ces tables
ne doit pas être remultiplié.

Vérification faite sur Klobjarne Geirr, le tracker reproduit la table à
l'identique : 38 trèfles, 123 écus, et les six lignes de trophées (100 / 250 /
50 / 50) exactes. **Rien à corriger sur les gen1.**
- **Déjà compté par cascade (71)** — le composant arrive déjà au légendaire par
  un chemin modélisé et la table en propose un second. Soit le second ne vaut
  pas pour ce légendaire, soit les deux sont réels et le chevauchement se
  déclare dans `qty_overlap_verified`. `bloodstone_shard` et
  `crystalline_ingot` sont entièrement bloqués par là, avec un écart de 0 :
  poser l'arête doublerait exactement.
- **Coût vendeur (54)** — la table vendeur aplatit des options qui s'excluent.
  Se tranche en regardant si le vendeur propose un **choix** ou une **liste**.
  `amalgamated_gemstone` en concentre 41 à lui seul.

Deux composants portent la moitié du lot : `glob_of_ectoplasm` (47) et
`amalgamated_gemstone` (43).

### ④ `alt_groups` — deux groupes, et les deux autres n'en étaient pas

La structure `alt_groups` existe et calcule (voir `gw2_alt_groups_v1.py`, règle
d'audit `check_alt_groups`). Un seul groupe y est versé : `gen2_mastery`.

Trois autres relèvent du même mécanisme et attendent :

- ~~Les six orbes du Gift of Infused Gems~~ — **fait**. La page capturée le
  08/09 tranche : Gift of Rays consomme **un** Gift of Infused Gems, lequel
  consomme 250 unités d'**une** gemme. Groupe `gemmes_infusees`.
**Les deux autres candidats sont retirés — vérification faite, ils ne relèvent
pas de `alt_groups`.**

- **Les lodestones.** Le choix vin d'Élone / agent liant n'existe que dans la
  recette *Cœur → Lodestone*. Or l'arbre ne modélise pas cette recette :
  `charged_core` et `mystic_binding_agent` ne sont pas des composants, et
  `charged_lodestone` est une feuille qu'on farme ou qu'on achète (200 pour
  Endless Summer). C'est correct — les lodestones tombent. Poser le groupe
  aurait **fabriqué** un coût de cœurs et de vin que personne ne paie.
- **Eternity.** Le choix porte sur des **paires** (Sunrise + Twilight, ou leurs
  deux Memories), pas sur un composant parmi N : `options` ne peut pas
  l'exprimer. Et aucun des quatre n'est un composant — Sunrise et Twilight sont
  des légendaires. Modéliser un légendaire composé de deux autres légendaires
  est une autre affaire, bien plus large que `alt_groups`.


### ⑤ Renverser la primauté : les recettes deviennent la seule source

Les 722 clés à plat de `craft_components[*].qty` ne sont pas une source, ce sont
un **résultat** — recopié à la main, légendaire par légendaire. Une recette est
une propriété de l'**objet**, identique quel que soit le niveau où il apparaît ;
un total par légendaire s'en déduit. Les traiter comme deux sources à
réconcilier produit des arbitrages là où il devrait y avoir un calcul.

**Ce qu'il faut faire :** bâtir le total de bas en haut depuis les recettes,
confronter aux 722 clés existantes, ne garder les clés que là où l'arbre ne
descend pas encore, et publier les trous restants.

**Mesuré le 08/09.** `gw2_confronte_v1.py` compare, légendaire par légendaire,
ce que le tracker affiche et ce que donnerait la lecture de bas en haut :
**567 écarts, 356 hausses et 211 baisses**, sur 89 légendaires.

*(Un premier chiffrage annonçait 3 096 baisses. Il était faux : la simulation
retirait la clé à plat d'un composant dès qu'une arête existait **quelque
part**, sans vérifier qu'elle mène à CE légendaire. `research_note` est relié à
`seer_runestone`, ce qui ne lui rend pas ses 5 000 sur Selachimorpha. Corrigé —
la clé ne cède la place que là où la chaîne rattache vraiment.)*

Les baisses restantes sont concentrées : `empyreal_fragment`, `dragonite_ore`
et `bloodstone_dust` valent 9 000 à plat sur Klobjarne Geirr contre 3 000 par
la chaîne — un facteur 3 net, à confronter à la recette du Vision Crystal.

**Ce qui bloque côté captures :** plus grand-chose. Le lot du 08/09 a comblé 34 des 39 trous.
Restent **cinq** : `Dragonsblood Weapons` (3 dépendants), `Augur's Stone`,
`Bloodstone Shard`, `Fractalline Spark`, `Olmakhan Bandolier`. Section 0 de
`PAGES_A_CAPTURER.md`.


### ⑥ La ligne runes / cachets / reliques est incomplète, et ça se voit enfin

`upgrades` portait 450 obsidiennes, 1050 ectoplasmes, 205 trèfles et 23 250
cristaux luisants, à côté des trois entrées réelles `legendary_rune`,
`legendary_sigil` et `legendary_relic`. Table parallèle **et inerte** :
`upgrades` n'existe pas dans `legendaries`, l'interface ne propose au choix que
des entrées de `legendaries`, donc elle ne pouvait jamais être cochée. Ces
chiffres n'étaient comptés nulle part.

Retirée, elle laisse voir le vrai état : les chaînes des trois entrées réelles
ne descendent pas jusqu'à l'obsidienne et aux ectoplasmes. Les recettes sont
pourtant capturées — `gift_of_runes` (50 Mystic Aspect + 20 trèfles + 100 ecto
+ 50 obsidiennes), `gift_of_sigils` (75 Mystic Mote + 30 trèfles + 150 ecto +
75 obsidiennes), `gift_of_relics` (25 Mystic Facet + 25 trèfles + 150 ecto +
1 Gift of Research). Il manque les arêtes.

**Résolu.** Aucun des deux obstacles que j'avais annoncés n'en était un : `norm()`
met tout en minuscules, donc `Mystic_clover` se résolvait très bien, et
`gift_of_craftsmanship` porte déjà ses arêtes vers les trois entrées. Le vrai
blocage était le grain du déplieur — voir `gw2_deplie_wiki_v9.py`.

Les trois entrées portent désormais leur coût : rune 50 obsidiennes + 100
ectoplasmes + 20 trèfles + 50 Mystic Aspect ; cachet 75 + 150 + 30 + 75 Mystic
Mote ; relique 150 ectoplasmes + 25 trèfles + 25 Mystic Facet.


### ⑦ Les « Legendary Shards » ont un vrai nom, et il est au dépôt

En confrontant les tables de matériaux, 36 noms n'ont pas trouvé de composant.
Huit d'entre eux sont les tessons de précurseur gen3, nommés un par arme :
`Shard of Resolution`, `Shard of Endeavor`, `Shard of Exitare`, `Shard of
Liturgy`, `Shard of Spero`, `Shard of Arah`, `Shard of Friendship`, `Shard of
the Dark Arts`. Cinq occurrences chacun.

**Fait le 08/09** — et ce sont **onze** tessons, tous **gen2**, pas huit gen3 :
Arah, Call of the Void, Endeavor, Exitare, Friendship, Liturgy, Resolution,
Spero, Tlehco, the Crown, the Dark Arts. Créés par `gw2_tessons_gen2_v1.py`
depuis les tables, avec leurs ingrédients.

**Mystic Curio fait** : sa page était au dépôt et porte **sept** recettes, une
par trophée de palier 5 — 35 trophées + 15 lingots de mithril + 10 planches de
bois d'ancêtre. Le trophée est un `alt_groups` de plus (`trophee_mystic_curio`).

**Les onze `Tribute to X` sont créés sans coût** : les tables disent qu'il en
faut un par tesson, aucune page n'est au dépôt, et rien ne détaille leur
recette. L'exigence est sourcée, le coût ne l'est pas. Ils sont désormais en
section 3 de `PAGES_A_CAPTURER.md`, ce qui est le point : un manque qu'on voit
vaut mieux qu'un manque caché dans une phrase de `sources`.

## Ouvert au 18/09/2026

### 1. Les monnaies de carte du groupe d'armes (gen2, gen3, Klobjarne Geirr)

Trente-trois legendaires n'ont **aucun bloc `currencies` propre** : les seize
gen2, les seize gen3 et Klobjarne Geirr passent par le groupe d'armes, avec
decouverte a l'execution. Leur onglet Composants ne peut donc pas recevoir de
monnaie de carte par simple insertion de lignes — c'est le rendu du groupe qu'il
faut faire parler.

Ce qui leur manque, mesure sur la chaine :

- **Klobjarne Geirr : 20 250 pieces anciennes** et 250 eclats du Foyer. Le cas le
  plus gros de la liste.
- les 16 gen2 : 800 pieces d'aeronef, 800 lingots d'aurillium, plus les quatre
  monnaies de HoT a 250 (minerai cristallin, huile d'aeronef, poussiere aurique,
  etincelle de ligne de force).
- les 16 gen3 : les memes quatre monnaies de HoT a 250.

`ley_line_crystal` est ecarte de toute facon : le composant n'a pas d'apiId, donc
son stock ne peut pas etre lu. A capturer avant de pouvoir l'afficher.

### 2. Marquer « fait » ce que la synchro montre deja consomme

Demande d'Antoine du 18/09. Quand une etape de collection est validee — bit a 1,
collection en vert — ce qu'elle coutait n'est plus a farmer. Six armes Astral
terminees, et ni le kralkatite ni le quartz ne servent plus. Aujourd'hui l'onglet
continue de reclamer 3 000 de chaque, sans stock en face, ce qui est decourageant
et faux.

**Le mecanisme existe deja** : `qty_extras` porte des surcouts conditionnels lies
a un bit, que les deux moteurs neutralisent des que l'etape est validee. C'est
exactement la forme voulue, il suffit de la renseigner. Le travail est de
decomposer chaque cout entre son socle et sa part conditionnelle :

| monnaie | socle | conditionnel | etape |
|---|---:|---:|---|
| Kralkatite Ore | 100 (Gift of Crystalline Magic) | 3 000 | vis_istan bit5 |
| Powdered Rose Quartz | 0 | 3 000 | vis_istan bit5 |
| Branded Mass | 100 (Gift of Ephemeral Magic) | 360 | vis_thunderhead bit5 |
| Exquisite Serpentite Jewel | 0 | 18 | vis_thunderhead bit5 |

Le socle reste en `required`, la part conditionnelle passe en `qty_extras` avec
son `legendary`, son `sub` et son `bit` — comme le karma d'Aurora le fait deja
sur neuf entrees. `check_qty_vs_jsx` continuera de confronter le tout a la
chaine, donc la decomposition ne peut pas deriver en silence.

A etendre ensuite aux autres legendaires dont un cout est adosse a une
collection, pas seulement Vision.

## 12 nonies. Restes de la fusion du catalogue (03/10/2026)

- `ew.wpCode` : JSX `[&BLsNAAA=]` (garde) contre sources `[&BNMMAAA=]` — ce
  dernier est le code de Gyala Delve, indice de copie. A verifier en jeu.
- `zak` : point de passage `Forward Bivouac` `[&BHYOAAA=]` (garde) contre
  `Citadel of Zakiros Waypoint` `[&BHMMAAA=]`. A verifier en jeu.
- Depliage LW par episode : aucune capture ne liste les episodes.
- `dm` : le conseil dit « Fire Orchid + Petrified Wood via nodes », mais la page
  Draconis Mons ne cite que Fire Orchid. Petrified Wood non ajoute aux
  recompenses tant qu'une source ne le tient pas (COHERENCE_CONSEILS_METAS).
- `eb.vendorWp` retire : « Savage Rise » est une zone de Draconis Mons. Le bon
  point de passage d'Ember Bay reste a poser.
- `bf_meta` : carte Bitterfrost Frontier (LW3) contre horaire de « The Frozen
  Maw » (Wayfarer Foothills, base). Laquelle est la bonne ? Sans reponse, pas de
  condition d'acces ni de `ref`.
- Codes de point de passage partages (COHERENCE_CONSEILS_METAS, regle W) :
  `[&BNMMAAA=]` sur sp / de2 / gy, `[&BDQOAAA=]` sur am / in. A relever en jeu.
