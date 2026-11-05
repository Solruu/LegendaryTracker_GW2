> **Plan du restant** : `PLAN_RESTANT_v99.md` (03/11/2026) regroupe tout ce qui reste, par lot. Ce fichier-ci garde l'historique.

# Backlog

## Sommaire — sections ouvertes

Trié le 08/10/2026 (27 ouvertes, 19 closes déplacées), puis le 19/10/2026 : 3 closes de plus déplacées (régionalisation, clé dans l'URL, magasin partagé) ; 24 ouvertes, puis le 24/10/2026 : 19 closes de plus déplacées ; 5 ouvertes
**sans modification** dans `BACKLOG_CLOS.md`. Une section est close si son titre
porte ✅ sans réserve (« sauf », « reste », « ouvert »), et qu'elle n'a ni sous-section
« Reste » ni case `- [ ]` ouverte. Dans le doute, elle reste ici.

- Deux arbitrages d'interface — ouverts le 02/09/2026
- Interface — notes d'Antoine du 05/11/2026
- 12 nonies. Restes de la fusion du catalogue (03/10/2026)

## Deux arbitrages d'interface — ouverts le 02/09/2026

### ① Vision s'affiche deux fois — ✅ **RÉGLÉ le 02/09/2026**

L'onglet dédié ne rend plus Vision I, les six `Visions of`, Vision II ni les deux
Convergence : tout passe par le rendu générique. Il ne garde que le craft de
l'Encapsulator et les six Requiem Experiments.

✅ **05/11 : clos autrement.** a_star_to_guide_us_achievements.html montre que chaque Requiem: Experiment récompense une « Historic <pièce> Collection », pas 50 Elegy Mosaics : le compteur était sans source, il est retiré (JSX v280). Ancien constat — **Reste une donnée manquante** : les six Requiem Experiments vivent en dur dans le
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

## Interface — notes d'Antoine du 05/11/2026 (a traiter plus tard, pas maintenant)

- **Polices trop petites, en general.** Antoine ne veut pas gerer la mise en
  page tout de suite : a reprendre dans une passe JSX dediee.
- **Onglet Armes, Misc (0/3)** : Aetheric Anchor n'apparait pas en tant que tel ;
  seules ses deux sorties, Ancora Bellum et Ancora Pax, sont listees (la note du
  panneau le dit, mais Antoine attend l'Anchor lui-meme). Les lances terrestres
  (Klobjarne Geirr, Ancora Bellum) sont etiquetees « Harpoon » : type rendu par
  l'API, a confirmer avant de renommer (incertain).

## 12 nonies. Restes de la fusion du catalogue (03/10/2026)

- `ew.wpCode` : JSX `[&BLsNAAA=]` (garde) contre sources `[&BNMMAAA=]` — ce
  dernier est le code de Gyala Delve, indice de copie. A verifier en jeu.
- `zak` : point de passage `Forward Bivouac` `[&BHYOAAA=]` (garde) contre
  `Citadel of Zakiros Waypoint` `[&BHMMAAA=]`. A verifier en jeu.
- Depliage LW par episode : aucune capture ne liste les episodes.
- ✅ `dm` (05/11, sources v449, `gw2_dm_petrified_v1`) : petrified_wood.html ne cite
  qu'Ember Bay ; le Petrified Wood est retire du conseil de Draconis Mons.
- `eb.vendorWp` retire : « Savage Rise » est une zone de Draconis Mons. Le bon
  point de passage d'Ember Bay reste a poser.
- ✅ `bf_meta` (constat du 05/11) : deja tranche dans les sources — « Beacons of
  Koda », meta de carte de Bitterfrost Frontier (LW3), sans horaire fixe (cycle
  jour-nuit), verifiee le 09/10 sur bitterfrost_frontier.html. Le Frozen Maw n'y
  figure plus ; seul l'ancien rapport METAS_RESSOURCES_v2 garde ce libelle.
- Codes de point de passage partages (COHERENCE_CONSEILS_METAS, regle W) :
  `[&BNMMAAA=]` sur sp / de2 / gy, `[&BDQOAAA=]` sur am / in. A relever en jeu.
