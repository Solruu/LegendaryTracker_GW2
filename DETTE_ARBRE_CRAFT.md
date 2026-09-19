# Dette — arbre de craft chiffre

**Etat courant : 3 aretes.** Derniere mesure le 17/09/2026 sur `gw2_sources_v292.json`,
controle `check_needed_for_chiffre` (audit v43) : **plus aucune arete declaree
sans quantite**. La section N raconte la derniere.

Mesure d'origine du 05/09/2026 sur `gw2_sources_v203.json` (audit v29) : 100 aretes.
Les sections A a J ci-dessous sont le journal de la reduction et restent telles
qu'elles ont ete ecrites — elles decrivent l'etat du jour ou elles datent, pas
l'etat courant.

## Le constat

`craft_components.qty` accepte deja un identifiant de COMPOSANT comme cle, et `computeGrandTotal` propage ces liens en cascade sur six passes. L'arbre de craft existe donc, chiffre, a profondeur arbitraire — 110 composants sur 319 portent deja un lien parent. Ce qui manque n'est ni une structure ni un champ : ce sont **100 quantites**.

La divergence est unidirectionnelle : 100 aretes declarees dans `needed_for` sans quantite dans `qty`, et **zero** dans l'autre sens. `needed_for` porte le graphe complet, `qty` son sous-ensemble chiffre. Une fois les 100 aretes chiffrees, `needed_for` devient exactement derivable et sort des sources : le JSX le recalculera par index inverse, et la regle d'audit passera d'avertissement a erreur.

Effet deja visible : l'onglet Composants construit son arbre sur `needed_for` tandis que les totaux se calculent sur `qty`. `gift_of_battle` et `bloodstone_shard` s'affichent sous `gift_of_mastery` en pesant zero dans le cout annonce.


## A — 49 quantites deja presentes en prose

Le nombre figure deja dans le parent, en `recipe`, en `sub_components` ou dans un `sources[].tip`. Aucune capture requise : c'est exactement la duplication prose/structure que le chiffrage supprime. A relire une fois avant integration — la prose n'a jamais ete auditee.

| parent | enfant | qty lue | ou |
|---|---|---|---|
| `draconic_tribute` | `amalgamated_draconic_lodestone` | 5 | recipe |
| `gift_of_castoran_mastery` | `gift_of_adventure_voe` | 1 | recipe |
| `gift_of_castoran_mastery` | `gift_of_the_seas` | 1 | recipe |
| `gift_of_expertise` | `amalgamated_rift_essence` | 12 | recipe |
| `gift_of_expertise` | `cube_stabilized_dark_energy` | 1 | recipe |
| `gift_of_expertise` | `obsidian_shard` | 50 | recipe |
| `gift_of_fortune` | `glob_of_ectoplasm` | 250 | sub_components |
| `gift_of_fortune` | `mystic_clover` | 77 | sub_components |
| `gift_of_insights` | `gift_of_gliding` | 1 | sources[].tip |
| `gift_of_insights` | `gift_of_the_exalted` | 1 | sources[].tip |
| `gift_of_insights` | `gift_of_the_itzel` | 1 | sources[].tip |
| `gift_of_insights` | `gift_of_the_nuhoch` | 1 | sources[].tip |
| `gift_of_jade_mastery` | `gift_of_cantha` | 1 | sources[].tip |
| `gift_of_jade_mastery` | `gift_of_the_dragon_empire` | 1 | sources[].tip |
| `gift_of_janthir_wilds` | `gift_of_expertise_jw` | 1 | sources[].tip |
| `gift_of_janthir_wilds` | `gift_of_gatherer_of_the_hunt` | 1 | sources[].tip |
| `gift_of_janthir_wilds` | `gift_of_uncovered_grounds` | 1 | sources[].tip |
| `gift_of_maguuma_mastery` | `crystalline_ingot_gen2` | 250 | sources[].tip |
| `gift_of_maguuma_mastery` | `gift_of_insights` | 1 | sources[].tip |
| `gift_of_maguuma_mastery` | `gift_of_maguuma` | 1 | sources[].tip |
| `gift_of_mastery` | `bloodstone_shard` | 1 | sources[].tip |
| `gift_of_mastery` | `gift_of_battle` | 1 | sources[].tip |
| `gift_of_mastery` | `gift_of_exploration` | 1 | sources[].tip |
| `gift_of_mastery` | `obsidian_shard` | 250 | sources[].tip |
| `gift_of_prosperity` | `gift_of_craftsmanship` | 1 | recipe |
| `gift_of_prosperity` | `mystic_clover` | 9 | recipe |
| `gift_of_rays` | `gift_of_infused_gems` | 1 | sources[].tip |
| `gift_of_rays` | `gift_of_the_beach` | 1 | sources[].tip |
| `gift_of_rays` | `gift_of_the_sun` | 1 | sources[].tip |
| `gift_of_relics` | `mystic_facet` | 25 | recipe |
| `gift_of_research` | `exotic_essence_of_luck` | 250 | recipe |
| `gift_of_research` | `hydrocatalytic_reagent` | 500 | recipe |
| `gift_of_research` | `thermocatalytic_reagent` | 250 | recipe |
| `gift_of_runes` | `mystic_aspect` | 50 | recipe |
| `gift_of_sigils` | `mystic_mote` | 75 | recipe |
| `gift_of_stormy_skies` | `case_of_captured_lightning` | 5 | recipe |
| `gift_of_stormy_skies` | `clot_of_congealed_screams` | 5 | recipe |
| `gift_of_stormy_skies` | `gift_of_the_astral_ward` | 1 | recipe |
| `gift_of_stormy_skies` | `pouch_of_stardust` | 5 | recipe |
| `gift_of_the_champion` | `gift_of_competitive_dedication` | 1 | sources[].tip |
| `gift_of_the_champion` | `salt_forged_mist_diamond` | 1 | sources[].tip |
| `gift_of_the_champion` | `tome_of_the_mists` | 1 | sources[].tip |
| `gift_of_the_dragon_empire` | `antique_summoning_stone` | 100 | sources[].tip |
| `gift_of_the_dragon_empire` | `jade_runestone` | 100 | sources[].tip |
| `gift_of_the_elders` | `gift_of_the_tides` | 1 | sources[].tip |
| `gift_of_the_mistburned_isles` | `shards_of_bava_nisos` | 100 | sources[].tip |
| `gift_of_the_mistburned_isles` | `shards_of_mistburned_barrens` | 100 | sources[].tip |
| `mystic_tribute` | `mystic_coin` | 250 | sources[].tip |
| `wings_of_ascension` | `wings_of_glory_elite` | 1 | sources[].tip |

## B — 51 quantites a capturer (32 pages)

Aucune prose exploitable cote parent. Les 345 pages de `ressources/wiki/` couvrent les collections, les precurseurs et les materiaux de base — aucune page de gift.

| page wiki a capturer | deja archivee | aretes debloquees |
|---|---|---|
| Warcry | **non** | 4 — `commanders_wings_of_war`, `generals_wings_of_war`, `recruits_wings_of_war`, `soldiers_wings_of_war` |
| Gift of Energy | **non** | 4 — `dust_crystalline`, `dust_incandescent`, `dust_luminous`, `dust_radiant` |
| Amalgamated Rift Essence | **non** | 4 — `fine_rift_essence`, `glob_of_ectoplasm`, `masterwork_rift_essence`, `rare_rift_essence` |
| Fulgurite | **non** | 3 — `bottle_airship_oil`, `ley_line_spark`, `pile_auric_dust` |
| Gift of Conquering | **non** | 3 — `gift_of_battle`, `legendary_spike`, `vision_crystal` |
| Wings of Ascension | **non** | 3 — `wings_of_glory_champion`, `wings_of_glory_recruit`, `wings_of_glory_veteran` |
| Mist Band (Infused) | **non** | 2 — `ascended_shard_of_glory`, `shard_of_glory` |
| Gift of the Mistburned Isles | **non** | 2 — `curious_mursaat_remnant`, `vial_of_titan_melted_obsidian` |
| Gift of the Mists | **non** | 2 — `gift_of_battle`, `gift_of_glory` |
| Gift of Desert Mastery | **non** | 2 — `gift_of_the_desert`, `gift_of_the_rider` |
| Gift of the Itzel | **non** | 1 — `airship_part` |
| Gift of Infused Gems | **non** | 1 — `amalgamated_gemstone` |
| Crystalline Ingot | **non** | 1 — `crystalline_ore` |
| War Commendation | **non** | 1 — `emblem_of_the_conqueror` |
| Gift of Ascension | **non** | 1 — `fractal_relic` |
| Gift of the Feast | **non** | 1 — `fruits_of_the_shadow` |
| Gift of War Dedication | **non** | 1 — `glob_condensed_spirit_energy` |
| Gift of Research | **non** | 1 — `glob_of_ectoplasm` |
| Gift of Prescience | **non** | 1 — `icy_runestone` |
| Gift of Sentience | **non** | 1 — `icy_runestone` |
| Gift of the World | **non** | 1 — `icy_runestone` |
| Gift of the Nuhoch | **non** | 1 — `ley_line_crystal` |
| Gift of the Exalted | **non** | 1 — `lump_of_aurillium` |
| Gift of Patience | **non** | 1 — `magnetite_shard` |
| Gift of Uncovered Grounds | **non** | 1 — `shards_of_janthir_syntri` |
| Gift of Gatherer of the Hunt | **non** | 1 — `shards_of_lowland_shore` |
| Mist-Enhanced Mithril | **non** | 1 — `skirmish_claim_tickets` |
| Mist Pearl | **non** | 1 — `skirmish_claim_tickets` |
| Certificate of Heroics | **non** | 1 — `testimony_of_heroics` |
| Essence of Animosity | **non** | 1 — `testimony_of_heroics` |
| Gift of the Rider | **non** | 1 — `trade_contract` |
| Spark of Sentience | **non** | 1 — `xunlai_electrum_ingot` |

## C — ce que les tables « Full material list » du wiki apportent

52 pages archivees portent une section `Full material list` : les 21 gen1, les
gen2, les 16 lames d'Aurene, plus Eternity. Ce n'est pas la boite « Recipe » de
la meme page, qui s'arrete au premier niveau et dont le bouton « Show base
ingredients » est rendu cote client, donc absent du HTML capture. C'est une
vraie table a trois colonnes, et elle porte l'arbre chiffre sur trois niveaux.

`gw2_parse_material_list_v1.py` l'extrait. Resultat sur les 52 pages :
**490 aretes distinctes, dont 250 portent un nombre ecrit**.

Trois choses en sortent, par ordre d'importance.

### C1. Huit quantites fausses dans la base, toutes dans le meme sens

Les quatre dons de `gift_of_condensed_magic` et les quatre de
`gift_of_condensed_might` sont a **1** dans `qty`. Le wiki en demande **2** :

> Mystic Tribute -> 2 Gifts of Condensed Magic -> 2 Gift of Blood, 2 Gift of
> Venom, 2 Gift of Totems, 2 Gift of Dust

| arete | base | wiki |
|---|---|---|
| `gift_of_blood` -> `gift_of_condensed_magic` | 1 | **2** |
| `gift_of_venom` -> `gift_of_condensed_magic` | 1 | **2** |
| `gift_of_totems` -> `gift_of_condensed_magic` | 1 | **2** |
| `gift_of_dust` -> `gift_of_condensed_magic` | 1 | **2** |
| `gift_of_claws` -> `gift_of_condensed_might` | 1 | **2** |
| `gift_of_scales` -> `gift_of_condensed_might` | 1 | **2** |
| `gift_of_bones` -> `gift_of_condensed_might` | 1 | **2** |
| `gift_of_fangs` -> `gift_of_condensed_might` | 1 | **2** |

`mystic_tribute` demande deja 2 dons condenses de chaque cote : la chaine
complete vaut donc 4 Gift of Blood, la base en compte 2. Chaque Gift of Blood
valant 100 fioles de sang puissant, **tout gen2 passant par un Mystic Tribute
annonce la moitie de son cout en T6** — 200 fioles au lieu de 400, et de meme
sur les sept autres lignes. C'est le chiffre qui alimente la matrice des
trophees et le grand total.

### C2. Une prose fausse, et invisible

`gift_of_fortune.sub_components` decrit Gift of Magic comme « 250x Vicious Claw
+ 250x Large Fang + 250x Vial of Powerful Blood + 250x Potent Venom Sac ». Le
wiki donne Vial of Powerful Blood, Powerful Venom Sac, Elaborate Totem, Pile of
Crystalline Dust — et Gift of Might vaut Vicious Fang, Armored Scale, Vicious
Claw, Ancient Bone. La prose melange des noms T5 (Large Fang, Large Scale,
Potent Venom Sac) a des T6, sur les deux dons.

Le champ `sub_components` n'est lu nulle part dans le JSX : cette erreur ne
s'affiche pas. Elle disparait avec le chiffrage, qui la remplace par des aretes
auditables.

### C3. 14 aretes de la dette chiffrees, et une profondeur entiere qui manque

Sur les 100 aretes du bloc B, 14 sont directement chiffrees par ces tables :
`glob_of_ectoplasm -> gift_of_fortune` 250, `mystic_clover -> gift_of_fortune`
77, `obsidian_shard -> gift_of_mastery` 250, les quatre poussieres vers
`gift_of_energy` 250, `mystic_coin -> mystic_tribute` 250,
`jade_runestone -> gift_of_the_dragon_empire` 100,
`crystalline_ingot_gen2 -> gift_of_maguuma_mastery` 250,
`amalgamated_draconic_lodestone -> draconic_tribute` 5, et les trois vers
`gift_of_research` 250.

Le reste du bloc B concerne des dons de colifichets, d'armures et de
legendaires recents, absents de ces 52 pages.

Mais l'apport principal est ailleurs : **231 des cibles citees par ces tables
n'existent pas du tout dans `craft_components`**. C'est la branche propre a
chaque arme, entierement absente de la base :

    Gift of Bolt -> 100 Icy Runestone, Superior Sigil of Air, Gift of Metal, Gift of Lightning
    Gift of Metal -> 250 Orichalcum Ingot, 250 Mithril Ingot, 250 Darksteel Ingot, 250 Platinum Ingot
    Gift of Lightning -> 100 Charged Lodestone, 250 Orichalcum Ingot, 250 Bolt of Gossamer

Aujourd'hui l'onglet Composants ne chiffre que le tronc commun. La moitie du
cout d'une gen1 — lingots, tissus, pierres de foudre — n'y figure pas.

### Controle de lecture

Eternity a servi de temoin. Etant la fusion de Sunrise et Twilight, sa table
porte le cout des deux armes : le parseur y a retrouve onze aretes exactement
doublees (500 ectoplasmes, 154 trefles, 500 sur chaque ligne T6) et **aucune
autre divergence** sur les 52 pages. L'agregation l'ecarte, `DOUBLES` dans le
script.


## D — correction de mon propre diagnostic : les 100 aretes ne sont pas des trous

En preparant l'integration des 14 quantites du bloc C3, la verification a
montre que treize d'entre elles auraient **double** le cout au lieu de le
completer.

`obsidian_shard` porte deja `250` sur chacun des 38 legendaires gen1, en direct.
Lui ajouter `gift_of_mastery: 250` ferait remonter 250 de plus par la cascade,
puisque `gift_of_mastery` vaut 1 sur chaque gen1. Meme chose pour
`glob_of_ectoplasm` (38 cles directes), `mystic_clover` (59), `mystic_coin`
(54), `jade_runestone` (11), `crystalline_ingot_gen2` (21).

La base suit donc une convention **aplatie** pour les materiaux communs : `qty`
rattache le materiau directement au legendaire, en court-circuitant le don qui
le consomme, tandis que `needed_for` conserve l'arbre reel. Les deux champs ne
divergent pas par negligence — ils repondent a deux questions differentes,
« combien pour ce legendaire » et « par quoi ca transite ».

Ce qui invalide la formule du bloc B ci-dessus : ce ne sont pas 100 quantites
manquantes, ce sont 100 aretes **aplaties**. Le travail n'est pas de les
remplir, c'est de les **deplier** : deplacer la quantite des cles legendaires
vers l'arete, puis laisser la cascade recalculer. Sur `obsidian_shard`, cela
veut dire supprimer 38 cles `gen1_*` et ne garder que `gift_of_mastery: 250`.

C'est un refactor arete par arete, verifiable a chaque etape par comparaison des
totaux avant/apres — un depliage correct laisse le total inchange. Aucune de ces
14 quantites n'est donc integree ici.

Les 4 aretes restantes du bloc C3 sont de vrais trous : `gift_of_energy` (les
quatre poussieres), `gift_of_research` (`exotic_essence_of_luck`,
`hydrocatalytic_reagent`, `thermocatalytic_reagent`) et
`amalgamated_draconic_lodestone -> draconic_tribute`. Elles attendent le meme
passage, pour ne pas melanger deux regimes dans le meme commit.

## Applique en v204

Seules les corrections sans ambiguite ni effet de bord :

- **C1** — les 8 quantites `1 -> 2` des dons condenses. Effet mesure : 40 lignes
  changees sur gen2_astralaria (`ancient_bone` 200 -> 400, `dust_incandescent`
  500 -> 1000, `gift_of_blood` 2 -> 4...), **0 ligne** sur gen1_bolt. Les
  chaines concernees ne portent aucune cle legendaire directe : pas de risque
  de double comptage.
- **C2** — suppression de `gift_of_fortune.sub_components`. La prose etait
  fausse et la structure sous-jacente exacte : `gift_of_magic` porte bien
  `vial_of_powerful_blood`, `powerful_venom_sac`, `elaborate_totem`,
  `dust_crystalline` a 250 chacun. `gift_of_shadows_orrax` garde le sien, dont
  le contenu n'est structure nulle part.


## E — v205 : premier depliage, 17 aretes

Regle appliquee : **tout ou rien par composant**. Une arete n'est depliee que si
le parent couvre TOUTES les cles a plat du composant. Un depliage partiel
laisserait le composant compte en direct sur certains legendaires et par la
cascade sur d'autres — deux comptages paralleles dans la meme entree, exactement
ce qu'on cherche a supprimer. Le controle `check_qty_levels` de l'audit l'a
confirme en levant l'alerte sur un premier jet partiel (`crystalline_ingot_gen2`
et `gift_of_cantha` atteints a la fois en direct et par le don).

Controle de neutralite : les totaux de chaque cible ont ete recalcules avant et
apres, cascade comprise, suffixes `__per_piece` / `__onetime` / `__per_unit` /
`__full_set` compris. **Zero ecart.** Un depliage correct ne change aucun
chiffre affiche ; il remplace une valeur en dur par un produit.

Les 17 : `gift_of_cantha -> gift_of_jade_mastery` 1 (16 cles retirees),
`fractal_relic -> gift_of_ascension_fractal` 4650,
`mystic_mote -> gift_of_sigils` 75, `mystic_aspect -> gift_of_runes` 50,
`mystic_facet -> gift_of_relics` 25,
`amalgamated_rift_essence -> gift_of_expertise` 12,
les trois `-> gift_of_stormy_skies` a 5, les trois `-> gift_of_rays` a 1,
les trois `-> gift_of_the_mistburned_isles` (100, 100, 150),
`cube_stabilized_dark_energy -> gift_of_expertise` 1,
`gift_of_the_astral_ward -> gift_of_stormy_skies` 1.

**83 aretes restantes**, dont deux ecartees pour arbitrage plutot que par manque
de donnee :

- `legendary_spike -> gift_of_conquering` : le pic est a plat sur Warbringer
  seul, alors que le don sert aussi a Conflux. Deplier donnerait a Conflux un
  pic qu'il ne porte pas — probablement la bonne valeur, mais c'est une
  correction, pas un depliage neutre. Le controle l'a arretee.
- `xunlai_electrum_ingot -> spark_of_sentience` : rapport nul, parce que le
  composant porte `aurora: 0`. Un zero en dur n'est pas une quantite.

Les pages a capturer pour la suite sont listees dans
`PAGES_A_CAPTURER.md`.


## F — v206 : lot 7 integre, 43 aretes chiffrees

159 captures recues, dont 58 recaptures de pages deja versees. Le depot passe a
446 pages, INDEX.md remis a jour et reconcilie fichier par fichier.

`gw2_parse_wiki_recipe_v1.py` lit la page de l'objet lui-meme, la ou
`gw2_parse_material_list_v1.py` lisait les tables des pages d'armes. Deux blocs :
`div.recipe-box` porte la recette, et l'infobox porte l'apiId de l'objet dans un
`span.gamelink` de type `item`. Le gamelink de type `recipe` du meme bloc est
ignore : il identifie la recette, pas l'objet, et le confondre remplirait la base
d'identifiants qui ne resolvent rien contre l'inventaire.

**183 pages avec recette, 805 aretes, 228 apiId.** Sur les 83 aretes en dette,
60 sont chiffrees par ces recettes.

### Ce qui est entre

- **42 vrais trous combles.** Le composant ne comptait vers ce parent nulle part.
  Les quatre poussieres vers `gift_of_energy` a 250, les trois reactifs vers
  `gift_of_research` a 250, les quatre `wings_of_glory_*` vers
  `wings_of_ascension`, les quatre essences de faille, les dons de maitrise HoT
  vers `gift_of_insights` et `gift_of_maguuma_mastery`.
- **1 depliage neutre** : `legendary_spike -> gift_of_conquering` = 1. Le wiki
  confirme la valeur que la division impliquait, et Conflux recupere le pic qui
  lui manquait.
- **41 apiId** recuperes sur des composants qui n'en avaient aucun — dont
  `gift_of_energy`, `gift_of_the_mists`, `gift_of_sentience`, les lodestones et
  la famille mursaat. Il en reste 53 sans identifiant.

**191 lignes de total montent, aucune ne descend.** C'est attendu : combler un
trou ne peut qu'augmenter un cout sous-estime. Zero alerte `comptee deux fois`.

### La regle qui a evite le double comptage

Un premier jet testait la couverture sur les seules cles directes du parent. Il
ajoutait `emblem_of_the_conqueror -> war_commendation` alors que l'embleme etait
deja a plat sur Conflux, et faisait passer `skirmish_claim_tickets` de 1850 a
3350 sur ce meme legendaire. Le test correct porte sur la **portee transitive**
du parent : l'ensemble des legendaires qu'il atteint en suivant les cles `qty`,
de proche en proche. Trois cas :

- aucune cle a plat du composant dans cette portee : comblement sur
- toutes dedans : depliage, avec verification que la quantite du wiki egale le
  rapport qu'impliquait la table a plat
- une partie seulement : refus, arbitrage requis

Les 17 refus sont dans `PAGES_A_CAPTURER.md`. Ils ne demandent
aucune capture : la quantite est connue. Ils demandent de deplier `obsidian_shard`,
`mystic_clover`, `glob_of_ectoplasm`, `mystic_coin` et `bloodstone_shard` en
chiffrant toutes leurs aretes d'un coup, pas une par une.

### Trois noms en double

Le rapprochement par nom a bute sur trois collisions : `crystalline_ingot` et
`crystalline_ingot_gen2`, `gift_of_expertise` et `gift_of_expertise_jw`,
`skirmish_claim_ticket` et `skirmish_claim_tickets` portent deux a deux le meme
nom d'affichage. Le parseur refuse de trancher plutot que de deviner ; la
troisieme paire ressemble a un doublon pur et vaut un examen.

**40 aretes restantes**, dont 17 en arbitrage et 23 sans recette lisible sur la
page du parent — ces objets ne s'obtiennent pas par recette.


## G — v218 : les neuf arbitrages, et le blocage suivant

Les deux pages qui manquaient sont versees. Elles tranchent huit cas sur neuf.

**Transcendence : les huit chevauchements sont legitimes.** Sa table porte deux
branches distinctes pour les memes trophees. Le Mystic Tribute descend vers deux
Gifts of Condensed Might et deux Gifts of Condensed Magic, eux-memes vers deux
dons de trophees chacun : c'est la cascade. Le Gift of the Champion descend vers
les Essences mystiques, qui demandent 20 os anciens et 50 gros os selon le
palier : c'est la cle a plat. Deux exigences reelles, declarees dans
`qty_overlap_verified` avec la provenance versee dans `note`.

L'arbre gw2efficiency, lui, montrait « 20 » et « 200 » sans dire d'ou venait
quoi. Il ne pouvait pas trancher ; la table du wiki le fait en une ligne.

**Klobjarne Geirr : la page repond, et ouvre une question plus grosse.** Le cube
d'energie sombre stabilisee y figure DEUX fois, une par branche — Gift of
Expertise sous Gift of Janthir Wilds, Gift of Research sous Gift of Klobjarne
Geirr — a 75 matrices chacun.

Mais integrer l'arbre complet de Klobjarne ouvre **34 chevauchements** avec les
cles a plat en place, et dans 28 cas l'arbre vaut exactement le double du plat :
100 ecailles blindees a plat contre 200 par la branche Homesteader, 250 fioles
de sang epais contre 500. Le facteur deux est trop regulier pour etre un hasard
et trop general pour etre tranche au jugé : soit la base sous-compte les T5/T6
de Klobjarne depuis toujours, soit la colonne « 2 Gifts of Condensed Might » de
la table se lit comme un total et non comme un multiplicateur.

C'est la meme ambiguite de lecture que sur Transcendence, ou elle s'etait
resolue parce que deux branches distinctes existaient. Ici elles n'existent pas.
L'integration est prete (`gw2_integre_branche_arme_v1.py` la produit en une
passe) mais n'est pas versee : elle changerait 34 couts affiches sur une lecture
incertaine.


## H — v220 : la correction C1 etait l'erreur

La boite Recipe de la page Gift of Condensed Might dit : 1 Gift of Claws,
1 Gift of Scales, 1 Gift of Bones, 1 Gift of Fangs. Un de chaque.

Ma toute premiere correction de cette serie, C1, avait mis ces huit quantites
a 2 en lisant la table d'Eureka : « 2 Gifts of Condensed Magic » en colonne 2,
« 2 Gift of Blood » en colonne 3. J'en avais conclu deux dons de sang PAR don
condense. C'etait l'agregat des deux.

Les quantites de la colonne 3 de ces tables sont AGREGEES sur celle de la
colonne 2. La regle est maintenant ecrite en tete de
`gw2_parse_material_list_v1.py`, la ou elle aurait du etre des la premiere
lecture.

Consequence : toutes les gen2 passant par un Mystic Tribute ont annonce le
DOUBLE de leur cout en T6 pendant six versions, de la v204 a la v219. Astralaria
redescend de 400 a 200 fioles de sang puissant.

Et le blocage de la v218 se dissout : sur les 33 chevauchements que l'arbre de
Klobjarne ouvrait, 25 etaient l'effet de ce doublement. Une fois C1 annulee,
l'arbre reproduit exactement la cle a plat et les 25 cles partent. Il en reste
huit, ou le plat depasse l'arbre — Klobjarne exige plus que la branche
Homesteader ne fournit, il y manque une source.

## I — Ce qui aurait du m'eviter tout ca

Correction du message de commit de la v220, qui affirmait que
`mystic_tribute.html` donnait la reponse. Il ne la donne pas. Il donne la
recette du tribut — 2 Gift of Condensed Magic + 2 Gift of Condensed Might +
77 Mystic Clover + 250 Mystic Coin — mais pas le contenu d'un don condense.
`INDEX_CONTENU.json` le confirme : sur 448 pages et 230 boites de recette,
**aucune** ne produit un Gift of Condensed Might ou Magic. La page manquait
vraiment, et la capture d'ecran etait necessaire.

Ce que le depot permettait, en revanche, c'etait de DOUTER. Le tribut demande
2 dons condenses ; les tables annoncent « 2 Gift of Bones » sous « 2 Gifts of
Condensed Might ». Deux fois deux ne fait quatre que si le second 2 est
unitaire, ce qu'aucune page n'affirmait. J'ai choisi la lecture qui doublait
sans jamais chercher a la confirmer.

Les deux pages sont donc ajoutees a `PAGES_A_CAPTURER.md` : la quantite est
juste mais sa source n'est pas rejouable, et celle du Gift of Condensed Magic
est deduite de son jumeau, pas lue.

`ressources/INDEX.md` dit quelles pages on a. Il ne dit pas ce qu'elles
CONTIENNENT. Chercher « ai-je la recette de X ? » demandait de fouiller 448
fichiers, ce que je n'ai pas fait : j'ai suppose, quatre fois, et declare un
blocage a chaque fois.

`gw2_index_contenu_v1.py` repond desormais a la question. Il produit
`ressources/INDEX_CONTENU.json` : pour chaque page, l'apiId atteste, les boites
de recette AVEC l'objet qu'elles produisent — une page en porte souvent
plusieurs, pour des objets qui n'ont pas de page a eux — les couts vendeur et
les aretes de la table. 230 recettes portant 191 objets distincts, la ou l'index
des noms de fichiers n'en annoncait aucune.

Il se cherche : `python3 gw2_index_contenu_v1.py "Condensed Might"` sort en une
seconde les pages qui en parlent et ce qu'elles en disent.


## J — v223 : le tout-ou-rien etait mal cadre, et ca ne debloque presque rien

La v1 du depliage travaillait par COMPOSANT : elle ne retirait les cles a plat
que si l'arbre reproduisait TOUTES les cles du composant. `bloodstone_shard` en
porte 57, `mystic_clover` 73 ; un seul legendaire non modelise bloquait tous
les autres. Sur les six plus gros, elle depliait zero.

Ce tout-ou-rien repondait a une vraie crainte mal cadree. Le double comptage se
produit pour UN legendaire donne, quand la meme depense y arrive par deux
chemins. Deux legendaires differents ne peuvent pas se doubler l'un l'autre. La
condition juste est donc par paire (composant, legendaire), et
`gw2_deplie_wiki_v2.py` l'applique.

Deux gardes ont ete necessaires. La premiere passe retirait les cles des
chevauchements DECLARES legitimes — l'arbre y vaut 1, le plat 1, mais les deux
sont reels : gen2_eureka perdait la moitie de tout, l'eclat de sang comme le
lingot cristallin. `qty_overlap_verified` est desormais consulte avant de
retirer quoi que ce soit.

Resultat honnete : **deux cles**. Transcendence perd son doublon de Gift of
Battle et de Memory of Battle, la chaine Gift of the Champion -> Gift of the
Mists -> Gift of Battle n'existant pas encore quand les dix-neuf autres
legendaires ont ete corriges.

**Le refactor ne debloque pas les six gros, et le diagnostic est net.** Ce
n'etait pas la methode :

    mystic_clover      73 cles — 73 sans aucun chemin modelise
    mystic_coin        67 cles — 67 sans aucun chemin modelise
    bloodstone_shard   57 cles — 53 sans aucun chemin modelise
    gift_of_battle     36 cles — 36 sans aucun chemin modelise
    obsidian_shard     39 cles — 37 sans aucun chemin modelise
    glob_of_ectoplasm  39 cles — 37 sans aucun chemin modelise

Pour la quasi-totalite de ces cles, l'arbre ne contribue RIEN : il n'existe
aucun chemin entre le composant et le legendaire. Les depliages successifs ont
epuise ce que les captures permettent de chainer. Ce qui manque maintenant,
ce sont les recettes des dons intermediaires par lesquels ces materiaux
transitent — un don de maitrise par extension, la ou une seule page couvre
souvent seize legendaires.


## K — 16/09/2026 : les 8 aretes restantes (v288, audit v42)

Trois passes ont fait tomber la liste de 17 a 8. Deux n'ont chiffre aucune
quantite : les aretes concernees n'etaient pas des trous.

**Six orbes sortis par correction de la regle, pas des donnees.** Les six
options de `alt_groups.gemmes_infusees` (beryl, chrysocolle, emeraude, opale,
rubis, saphir vers `gift_of_infused_gems`) portent leur quantite dans
`alt_groups[gid].qty` — 250, une seule fois pour les six. Le JSX **interdit**
qu'une option porte une cle `qty` sur la cible du groupe : `computeGrandTotal`
ne compte que l'option choisie, et une cle `qty` ferait compter l'option non
retenue en plus. La regle reclamait donc exactement ce que le calcul interdit.
Exemption ajoutee en audit v42.

**Deux aretes retirees comme fausses**, contredites par la boite Recipe de leur
parent : `amalgamated_gemstone -> gift_of_infused_gems` (les six recettes
demandent 250 eclats d'obsidienne + 250 orbes + 1 eclat de pierre de sang +
100 pierres runiques mystiques, aucune gemme amalgamee) et
`curious_mursaat_remnant -> gift_of_the_mistburned_isles` (la recette est
1 Don des ruines mursaat + 1 Don de l'errance de Janthir + 250 pierres runiques
mursaat + 250 mystiques). Dans les deux cas le `tip` de la source portait une
recette inexistante — celle de `gift_of_the_mursaat_ruins` pour la seconde,
decalee d'un cran. Les deux tips ont ete remplaces par la recette reelle.

**Une arete chiffree : `trade_contract -> gift_of_the_rider` = 300.** Aucune
valeur a plat ne la concurrencait (`trade_contract.qty` etait vide), et trois
sources concordent : la boite Recipe du don (4 esprits de monture), la page de
chaque esprit (75 contrats commerciaux), et le champ `cost_trade_contracts: 300`
que la source portait deja. Ce champ portait la meme information en parallele :
il a ete retire, la chaine la porte maintenant. Le tracker affichait zero
contrat commercial pour Coalescence et pour les douze gen2 en voie Desert.

### Ce qui reste, et pourquoi

| arete | quantite lisible | ce qui bloque |
|---|---|---|
| `fine_rift_essence -> amalgamated_rift_essence` | 250 | double comptage |
| `masterwork_rift_essence -> amalgamated_rift_essence` | 100 | double comptage |
| `rare_rift_essence -> amalgamated_rift_essence` | 50 | double comptage |
| `testimony_of_jade_heroics -> essence_of_animosity` | 500 | double comptage |
| `skirmish_claim_ticket -> essence_of_annihilation` | 350 | double comptage |
| `xunlai_electrum_ingot -> spark_of_sentience` | 21 | `qty.aurora` vaut un 0 explicite, pose deliberement |
| `gift_of_craftsmanship -> gift_of_prosperity` | 1 | doublon d'entite a trancher |
| `glob_of_ectoplasm -> gift_of_research` | 10 | surcout de voie, pas un ingredient |

**Cinq sur huit ont leur quantite disponible et ne sont pas chiffrables pour
autant.** Le chiffre existe — boite Recipe pour les trois essences de faille
(250/100/50/50 ecto, craft 400) et pour `essence_of_animosity` (500), prose
sourcee pour les autres. Mais l'enfant porte deja, sur le legendaire racine,
une valeur a plat qui couvre le meme besoin : `fine_rift_essence` vaut 3000
pour `obsidian__per_piece` et 6750 pour `orrax_manifested`. Brancher l'arete
sans retirer le plat correspondant double la depense — exactement le motif des
94 doublons retires en v286. Chaque cas demande donc de confronter le plat au
produit de la chaine et de ne retirer que si les deux disent la meme chose ;
la ou ils different (2500 pour Endless Summer contre 12 x 250 = 3000), aucune
des deux valeurs ne fait autorite sans une table wiki qui tranche.

`gift_of_craftsmanship -> gift_of_prosperity` est un cas a part :
`gift_of_prosperity` coexiste avec `gift_of_magical_prosperity` et
`gift_of_mighty_prosperity`, et `gift_of_craftsmanship` est deja chaine sur les
deux seconds **et** sur `perfected_envoy__per_piece`. C'est une suppression
d'entite a arbitrer, pas une quantite a poser.

`xunlai_electrum_ingot -> spark_of_sentience` porte un `qty.aurora` a **0
explicite**, pas absent. La collection Aurora II demande bien 21 lingots, et la
prose de la source le dit ; mais un zero pose a la main est une decision, pas
un trou, et la remplacer par 21 deplace un chiffre affiche sans savoir ce que
ce zero voulait dire. A trancher.

`glob_of_ectoplasm -> gift_of_research` n'est pas un ingredient : la recette de
la Forge est 500 hydrocatalytique + 250 thermocatalytique + 250 essence de
chance exotique, sans ecto. Les 10 ectos sont le surcout du craft assiste par
Lyhr, une voie alternative. L'arete elle-meme est donc discutable ; elle est
laissee en place tant que la voie Lyhr est decrite dans les sources.


## Suite

1. Les 5 aretes a double comptage : confronter plat et chaine cas par cas,
   retirer le plat quand les deux coincident, documenter l'ecart sinon.
2. Arbitrer le triplet `gift_of_prosperity` / `_magical_` / `_mighty_`.
3. Brancher `upgrades_combined` sur la chaine unitaire
   (`legendary_rune`/`_sigil`/`_relic`) et supprimer la table codee en dur du
   JSX — bloque sur le choix de la cible de confort (6r/2s/1rel contre les
   7r/8s affiches par ailleurs dans le meme bloc).
4. Capturer les pages du bloc B restantes.
5. Supprimer `needed_for` des sources, index inverse calcule cote JSX, regle
   d'audit en erreur.
6. Rendu recursif n niveaux dans l'onglet Composants, chaque noeud affichant
   besoin / stock / manque — le calcul existe deja (`totals[compId]` +
   `gtStocks[apiId]`).
7. Integrer les 231 cibles absentes (branche propre a chaque arme : Gift of
   Metal, Gift of Wood, lingots, tissus, pierres) depuis
   `gw2_material_lists_v1.json`.
8. `recipe` ne conserve que ce qui n'est pas chiffrable : voies alternatives de
   la Forge mystique.


## L — 16/09/2026, seconde passe : 8 -> 3 aretes

**Les trois essences de faille, invariance exacte.** La boite Recipe donne
250 Fine + 100 Masterwork + 50 Rare + 50 Ecto par Amalgamated Rift Essence.
Les valeurs a plat d'Orrax (27 ARE), Klobjarne (12) et Obsidian (72, soit 12
par piece) valaient EXACTEMENT ARE x ce nombre : 6750/2700/1350,
3000/1200/600, 18000/7200/3600. Plats retires, aretes posees, **aucun total
ne bouge**. Endless Summer garde ses plats : sa chaine ne contient aucune ARE,
et ses 2500/1000/500 correspondraient a 10 ARE que rien ne declare — arete
manquante, pas doublon.

**Essence of Annihilation = 350 tickets d'escarmouche**, atteste noir sur
blanc par la page Warbringer (« Essence of Annihilation (costs: WvW Skirmish
Claim Ticket x350) »). Aucun plat ne la concurrencait : Warbringer passe de
2450 a 2800 tickets, Conflux de 1850 a 2200. Les `required` codes en dur du
JSX ont ete alignes (l'audit bloquait sinon).

**Le meme achat facture dans trois devises.** `testimony_of_jade_heroics`
(apiId 65) et `testimony_of_heroics` (26464) portaient des plats qui doublaient
la chaine Castoran : Warbringer affichait 500 Castoran + 500 Jade + 250
Heroics, Conflux 750 + 250 + 500, Triumphant Hero 1500 + 1500. Or les deux
pages concernees (Essence of Animosity, Certificate of Heroics) n'ont plus que
DEUX lignes de vendeur disponibles, toutes deux en Testimony of **Castoran**
Heroics ; les lignes Jade et Desert y sont marquees « item currently
unavailable ». Une devise retiree du jeu ne s'additionne pas a celle qui la
remplace. Plats retires, la chaine Castoran les portait deja.

### Ce qui reste

| arete | quantite lisible | ce qui bloque |
|---|---|---|
| `gift_of_craftsmanship -> gift_of_prosperity` | 1 | l'entite `gift_of_prosperity` reste a trancher |
| `xunlai_electrum_ingot -> spark_of_sentience` | 21 | `qty.aurora` vaut un 0 explicite, pose deliberement |
| `glob_of_ectoplasm -> gift_of_research` | 10 | surcout de la voie Lyhr, pas un ingredient |

**`gift_of_prosperity` : moitie du probleme reglee.** Le wiki le tranche pour
l'armure Obsidienne : chaque piece consomme un Gift of **Magical** Prosperity
(torse, tete, epaules) ou **Mighty** (jambes, gants, bottes), a 9 trefles
chacun — 3 + 3 par set. `gift_of_prosperity`, lui, porte 15 trefles : c'est la
variante raid, pas celle d'Obsidienne. Obsidienne etait donc facturee deux
fois, a deux tarifs differents : 54 trefles par la cle a plat **et** 90 par le
mauvais don. Le lien Obsidienne -> `gift_of_prosperity` est retire, les vrais
dons sont chaines, et les plats devenus doublons (`gift_of_craftsmanship`,
`gift_of_research`, `gift_of_condensed_magic`/`_might`, `mystic_clover`)
retires. Obsidienne passe de **144 a 54 trefles mystiques** ; tout le reste est
invariant.

Il reste le versant Perfected Envoy, ou `gift_of_prosperity` se contredit
lui-meme : son nom dit « Magical / Mighty », sa prose de recette annonce 9
trefles, et `mystic_clover` lui en declare 15. Sans capture de la page du don
du raid, je ne sais pas lequel des deux chiffres est le sien.


### Orphelins crees par cette passe, a trancher

- `testimony_of_jade_heroics` : `qty` et `needed_for` vides.
- `testimony_of_heroics` : il ne reste que `warbringer: 250`, sans contrepartie
  Castoran identifiee — seule valeur de cette famille que je n'ai pas su
  rattacher.
- `curious_mursaat_remnant` (passe precedente) : `qty` vide, apiId 104800
  introuvable dans tout le corpus.


## M — 16/09/2026, troisieme passe : 8 -> 1 arete

Feu vert d'Antoine sur les arbitrages en attente.

**`gift_of_insight` fusionne.** La capture du lot 19 annonce API 105875, soit
l'identifiant exact de `gift_of_insight_voe` : meme objet. L'entree sans apiId
portait les ingredients, celle avec portait la source vendeur ; les deux
declaraient `aetheric_anchor: 1`, donc Aetheric Anchor comptait DEUX dons au
lieu d'un. Fusionnees sur `gift_of_insight`.

**Aurora : le 0 explicite etait un oubli, pas une decision.** `qty.aurora`
valait 0 sur `xunlai_electrum_ingot`, ce qui rendait invisibles les 21 lingots
de la collection Aurora II *et toute leur chaine*. Remplace par
`spark_of_sentience: 21` : Aurora gagne 21 lingots, 21 lingots de mithrillium,
1050 lingots de mithril, 420 de platine, 210 reactifs thermocatalytiques et
21 ectos qui n'apparaissaient nulle part.

**L'arete Lyhr retiree.** `glob_of_ectoplasm -> gift_of_research` n'etait pas
un ingredient. Le parseur de couts vendeur sort le meme « Glob_of_Ectoplasm,
10 » sur `bloodstone_brick`, `gift_of_blood`, `gift_of_condensed_magic` et une
dizaine d'autres : c'est le tarif fixe du service de forge de Lyhr, lu sur la
ligne « Sold by », pas une recette. La divergence 10/6 signalee sur les Gifts
of Condensed venait de la meme lecture.

**Deux orphelins supprimes** : `testimony_of_jade_heroics` et
`curious_mursaat_remnant`, tous deux avec `qty` et `needed_for` vides apres les
passes precedentes. `testimony_of_heroics` est CONSERVE : il porte encore
`warbringer: 250`, la seule valeur de cette famille que je n'aie pas su
rattacher a une contrepartie Castoran. Le supprimer aurait fait disparaitre un
cout sans savoir ce qu'il payait.

### Les upgrades ne pesent plus zero

`upgrades_combined` n'avait AUCUN composant : son total valait zero dans le
grand total, pendant que le JSX affichait cinq monnaies codees en dur a cote,
sans rien pour les tenir a jour. La structure n'avait pas de forme pour « cette
cible vaut N exemplaires d'autres cibles » : c'est `composition`, declaree dans
`legendaries.upgrades_combined` et lue a l'identique par les deux moteurs.
6 runes + 2 cachets + 1 relique, l'objectif confort deja affiche -- les 7 runes
et 8 cachets cites ailleurs dans le meme bloc sont les caps d'armurerie
(6 armure + 1 respirateur ; toutes armes terrestres et aquatiques), pas une
cible.

Il manquait un maillon pour que la chaine reproduise la table : `Mystic Aspect`
et `Mystic Mote` consomment 10 Piles of Lucent Crystal chacun, ce que leur
`recipe` disait sans que `pile_of_lucent_crystal` le porte. Chaine posee. La
cible calcule maintenant 23 250 piles, 205 trefles, 1 050 ectos et 450 eclats
d'obsidienne -- exactement la table supprimee, mais derivee.

### Ce qui reste

| arete | quantite lisible | ce qui bloque |
|---|---|---|
| `gift_of_craftsmanship -> gift_of_prosperity` | 1 | l'entite `gift_of_prosperity` cote raid reste a trancher |

Et un trou hors compteur : `provisioner_token` declare
`needed_for: [upgrades_combined]` sans quantite. La table supprimee disait 450,
soit 50 par Gift of Craftsmanship (9 exemplaires pour 6r/2s/1rel) -- mais
`gift_of_craftsmanship` n'a **pas de capture**, donc cette division est une
deduction, pas une source. La page est dans la file.


## N — 17/09/2026 : la derniere arete, et la fin de la dette

Antoine a capture les deux pages manquantes. Elles ont tranche trois choses
d'un coup.

**`gift_of_prosperity` n'est pas ce que la base croyait.** Elle l'appelait
« Gift of Magical / Mighty Prosperity », sans apiId, avec une recette en prose
annoncant 9 trefles et un Gift of Research. La page dit : objet a part entiere,
API 78866, et la recette est **1 Don d'artisanat + 15 Trefles + 1 Don de magie
condensee + 1 Don de puissance condensee** — pas de Gift of Research, et 15
trefles, pas 9. C'est la contradiction interne signalee en section L : c'est
bien la variante raid, et `mystic_clover` avait raison contre la prose.

**Et il s'en consomme SIX, pas un.** La section « Used in » de la page liste
Perfected Envoy Boots, Breastplate, Cowl... — un par piece. La base portait
`perfected_envoy: 1`, pour le set entier. Les ingredients, eux, etaient
factures a plat par piece : Perfected Envoy payait donc 6 jeux d'ingredients
PLUS un septieme don complet. Corrige : le don est chaine par piece, les
plats devenus doublons sont retires, et Perfected Envoy passe de **105 a 90
trefles**.

**Les 450 jetons de ravitaillement sont confirmes.** Le Gift of Craftsmanship
se vend **50 Provisioner Tokens** chez une trentaine de PNJ. Neuf dons pour
6 runes + 2 cachets + 1 relique : 450. C'est exactement ce qu'annoncait la
table parallele supprimee en section M — sauf que la valeur est maintenant
derivee, et qu'elle remonte partout ou le don apparait : 300 jetons pour
Perfected Envoy, 300 pour l'Obsidienne, 100 pour Eikasia, qui n'en affichaient
aucun.

Sa page donne aussi son identifiant : **API 77451**, quand la base portait
68551. La regle `check_api_id_contre_capture` posee la veille l'a signale des
que la capture est arrivee.

Six derniers apiId poses au passage (`ars_goetia`, `banner_of_the_commander`,
`hateful_sworl`, `mistwalker_infusion`, `standing_stones_timepiece`,
`unbound`) : leur page n'a pas d'infobox « Item type », ce qui les avait fait
ecarter du lot precedent par prudence. Le titre de chaque page correspond au
nom du composant, l'identifiant est lu dans les liens externes de la page
elle-meme.

### Il ne reste rien dans ce compteur

`check_needed_for_chiffre` ne signale plus aucune arete. La dette ouverte le
05/09/2026 a 100 aretes est soldee.

Ce qui subsiste ailleurs, et n'appartient pas a ce document :

- **Regle le 17/09/2026 (audit v44).** Les cinq monnaies de l'onglet `upgrades`
  n'etaient confrontees a RIEN : `check_qty_vs_jsx` cherchait les totaux de la
  cible « upgrades », qui n'existe pas — la cible du calcul s'appelle
  `upgrades_combined`, le JSX passant par `SOURCES_ALIAS`. Le dictionnaire rendu
  etait vide, le total valait 0, et tout le bloc sortait par la porte « cout que
  l'arbre ne porte pas encore ». Le seul bloc de monnaies du fichier qui n'avait
  jamais ete verifie etait donc celui qui restait code en dur le plus longtemps.
  L'alias est desormais lu dans le JSX lui-meme — pas recopie dans l'audit, une
  troisieme copie se serait desynchronisee comme les autres — et les cinq
  valeurs sont confirmees identiques a la chaine (450 jetons, 23 250 piles,
  205 trefles, 1 050 ectos, 450 eclats). Garde-fou teste en le faisant echouer :
  205 change en 204 fait tomber l'audit en erreur.
- `testimony_of_heroics` porte toujours `warbringer: 250` sans contrepartie
  Castoran identifiee.
- `endless_summer` garde ses plats d'essences de faille : 2 500/1 000/500
  correspondraient a 10 Amalgamated Rift Essence que rien ne declare.

## O — 17/09/2026 : deux verrous transversaux qui ne couvraient pas leur cas

Aucune capture nouvelle. Cette passe corrige des controles qui se croyaient
poses et ne l'etaient pas.

**Le bloc des ameliorations legendaires n'etait toujours pas confronte**, la
veille de l'avoir declare tel. Deux causes empilees.

La premiere est l'alias : `check_qty_vs_jsx` traduisait `upgrades` en
`upgrades_combined`, `check_missing_qty` non. Une transversale posee sur un
seul de ses appelants n'est pas posee.

La seconde est plus grave. `_atteint()` — la fonction qui decide si un
composant remonte jusqu'a un legendaire — etait une ONZIEME implementation de
la cascade, ecrite a la main, qui remontait de cle `qty` en cle `qty`. Or
`upgrades_combined` n'est la cle `qty` d'aucun composant : la cible se COMPOSE
de six runes, deux cachets et une relique, par le champ `composition` que les
deux moteurs lisent depuis le 16/09. Le marcheur ne le connaissait pas. Il
declarait donc les cinq monnaies « invisibles du grand total » alors qu'elles
y sont — et il l'aurait fait pour toute cible composee a venir. Remplace par un
appel au moteur, avec cache.

**Et les 450 jetons de fournisseur n'avaient jamais ete verifies**, contre ce
qu'annonce la section N. Le JSX declare `apiId: 29` pour ce poste : c'est
l'identifiant de MONNAIE du portefeuille. Le composant porte 88926, celui de
l'OBJET consommable qui la donne. Deux identifiants justes, du meme objet, dans
deux espaces differents — et aucune traduction entre les deux, donc la ligne ne
se resolvait a rien et l'audit la sautait en silence. La resolution passe
desormais par le NOM, lu dans `gw2_currencies_ref.json` deja au depot : aucun
champ nouveau, aucune table a tenir a jour a cote. Garde-fou teste en le faisant
echouer — 459 au lieu de 450 fait tomber l'audit en erreur. Le 450 est
maintenant confirme identique a la chaine, pour de bon.

**`check_lecture_colonne3` fait enfin la confrontation qu'elle reclamait.** Elle
disait « confronter a la boite Recipe du parent » et laissait l'humain le faire ;
quatre avertissements revenaient donc a chaque passe et il fallait rouvrir les
memes pages. Elle lit maintenant cette boite dans la capture. Les quatre cas
sont de vraies coincidences, confirmees page par page : deux eclats d'obsidienne
par Bloodstone Brick ET deux briques par Lesser Vision Crystal, meme motif pour
Dragonite Ingot et Empyreal Star, et cinq tickets PvP par Certificate of Support
ET cinq certificats par Gift of Skirmishing. Le controle devient bloquant quand
la boite contredit — teste dans les deux sens.

**Le couple pluriel se leve sur preuve.** Quand chaque membre d'une famille de
noms a sa propre capture et que ces captures annoncent des identifiants API
differents, ce sont deux objets du jeu, pas une coquille. `gift_of_insight` /
`gift_of_insights` sort ainsi du rapport. `gift_of_the_desert` /
`gift_of_the_dessert` y reste : le premier n'a pas de capture, et c'est
exactement ce que l'avertissement doit dire.

### Ce que la passe a fait sortir, et qu'elle ne comble pas

**Aurene's Rending ne porte que trois des six clés de ses quinze soeurs** : il
lui manque `mystic_clover: 39`, `mystic_coin: 250` et `crystalline_ingot: 250`.
Sa table de materiaux est structurellement identique aux quinze autres, au nom
de l'objet propre a l'arme pres. Rien ne le signalait : l'arme affichait
simplement moins, et un total trop bas ne ressemble a rien.

Les trois valeurs ne sont ecrites dans AUCUNE table — les tables gen3 donnent
38 trefles via le Draconic Tribute et s'arretent la. Elles viennent de saisies a
plat par legendaire, sans provenance. Les completer serait une deduction par
patron generationnel, et ce patron s'est revele faux quatre fois ici : Eternity,
douze gen3, Shooshadoo, Xiuquatl. Elles restent donc vides.

`check_fratrie_incomplete` rend le trou visible : un composant porte par au
moins n-2 membres d'une generation et absent d'un membre est signale. Mesuree
sur tout le fichier, gabarits `*_weapon_generic` exclus, elle ne designe que ce
cas — zero bruit.

Corrige au passage sur la meme arme : son champ `wiki` pointait vers
`Aurene%27s_Fang`, la page d'une AUTRE arme.

### Deux restes de fusion

- `aetheric_anchor.components` citait encore `gift_of_insight_voe`, supprime par
  la fusion du 17/09. Seule occurrence restante dans le fichier.
- `mystic_clover.qty_overlap_verified` declarait le chevauchement trefle/tribut
  draconique pour onze gen3 sur quinze. Les quatre manquantes sont celles
  ecrites sous l'autre convention d'apostrophe (`gen3_aurene_s_*`) : meme cle
  39, meme `draconic_tribute` 1, meme table. Ajoutees.

Audit v45 : 0 erreur, 56 avertissements (64 avant, dont 10 faux leves et 3 vrais
ajoutes par la nouvelle regle). Moteurs confrontes : 84 cibles, 4 994 totaux,
aucun ecart.

## P — 17/09/2026 : le parseur de tables lisait quatre fois le meme fait

Toujours aucune capture nouvelle. Ce coup-ci c'est le parseur qui se trompait,
et il se trompait depuis assez longtemps pour que 24 des 31 « trous » du
rapport de confrontation soient de son fait.

**Une cellule qui couvre plusieurs lignes sortait une fois par ligne
couverte.** Dans la table de Vision, « Gift of Condensed Might » ouvre quatre
sous-dons — Claws, Scales, Bones, Fangs. La cellule porte donc `rowspan=4`, et
`aretes()` rendait quatre fois le triplet
`(Mystic Tribute, Gift of Condensed Might, 2)`. Tout consommateur qui SOMME les
lignes lisait 8 la ou le wiki ecrit 2.

C'est ce qui produisait le bloc le plus visible du rapport : onze legendaires
annonces a 2 dons condenses contre 8 « au wiki », Aetheric Anchor a 4 contre 16,
les cristaux de vision de Conflux et Transcendence a 2 contre 8, et les 250
reactifs hydrocatalytiques contre 500 sur les quatre gen3 et la relique
legendaire. Vingt-quatre lignes, un seul defaut, et toutes accusaient la donnee.
**Le wiki n'est jamais faux, notre lecture l'est** — la regle a encore eu raison.

Le detail qui aggrave le cas : `main()` du parseur dedupliquait DEJA, par son
dictionnaire `(parent, enfant)`. Le fichier JSON qu'il produit etait donc juste,
et les consommateurs qui appellent `aretes()` directement, faux. Un seul des
deux chemins etait correct, ce qui est la pire des situations : le rapport
disait une chose, l'export une autre, et rien ne les confrontait. La
deduplication remonte dans `aretes()`, ou les deux chemins la partagent.

Effet mesure sur `CONFRONTATION_TOTAUX.md` :

| | avant | apres |
|---|---:|---:|
| accords | 834 | **857** |
| trous | 31 | **7** |
| excedents nus | 22 | 23 |

Les sept trous restants sont de vrais trous : la branche de tesson de
The HMS Divinity (4 000 lingots de mithril, 3 250 planches, 100 Mystic Curio)
n'est pas modelisee, et les quatre gen3 en `gen3_aurene_s_*` ne portent pas
leurs 10 Tale of Adventure. L'excedent nu supplementaire etait masque par le
bruit.

Sept fichiers ont suivi la version du parseur, un par consommateur :
`gw2_confronte_tables_v3`, `gw2_confronte_totaux_v3`, `gw2_edges_wiki_v11`,
`gw2_index_contenu_v4`, `gw2_index_wiki_v2`, `gw2_integre_branche_arme_v3`,
`gw2_tessons_gen2_v3`.

Ni les sources ni le JSX ne bougent : aucun total affiche ne change. C'est le
rapport qui disait faux, pas le tracker.

## Q — 17/09/2026 : les trous du rapport tombent a zero

Suite directe de la section P. Toujours aucune capture nouvelle : tout ce qui
suit se lit dans le depot.

**Douze des seize tables gen3 n'etaient confrontees a rien.** Le champ `wiki`
est percent-encode — `Aurene%27s_Claw` — et le rattachement page → legendaire
normalisait sans decoder : le `%27` laissait un « 27 » dans la forme comparee,
qui ne tombait jamais sur `aurenes_claw.html`. Le rapport ne montrait quatre
ecarts gen3 que parce que quatre entrees portaient l'AUTRE convention,
`Aurene's Fang` — avec apostrophe litterale et un ESPACE, donc une URL cassee
pour qui s'en sert pour batir une adresse. Les quatre sont ramenees a la
convention percent-encodee, et le rattachement decode desormais. Tables
orphelines : **17 → 4**, et les quatre restantes sont des composants, pas des
legendaires — les quatre dons du festin d'Orrax.

**Le douzieme tesson gen2 manquait.** Les onze crees le 08/09 laissaient de
cote `Shard o' War`, celui de The HMS Divinity — encore l'apostrophe, encodee
`Shard_o%27_War` dans la table. Deux sources concordantes le posent : la boite
Recipe du Gift of Divinity (100 Shard o' War) et la table de l'arme (1 Tribute
to the Man o' War + 1 Mystic Curio + 40 lingots de mithril + 30 planches de
bois ancien par tesson). Cree avec son tribut, cout inconnu comme les onze
autres. C'est ce qui manquait aux 4 000 lingots, 3 000 planches et 100 Mystic
Curio annonces en trou depuis le debut.

**La chaine des Poemes des seize gen3 n'existait pas.** Chaque
`Gift of Aurene's X` consomme un `Poem on <type d'arme>`, qui coute 10 Tale of
Adventure et 10 Lamplighter's Badge. Seize tables le disent a l'identique.
Seize poemes crees, plus `lamplighters_badge` — dont la provenance reste
inconnue, la table ne donnant que la quantite. Au passage la table confirme la
singularite deja notee : Aurene's Voice passe par le `Gift of Aurene's Horn`.

**Un doublon non source sur les seize gen3.** `antique_summoning_stone`
portait 100 vers `gift_of_jade_mastery` ET 100 vers `gift_of_the_dragon_empire`.
Les deux boites Recipe tranchent : le Gift of the Dragon Empire demande 100
runestones de jade, 200 blocs de jade pur, 100 d'ambre gris et 5 benedictions,
et **aucune pierre d'invocation**. La seconde arete est retiree, les seize
armes passent de 200 a 100.

**Une table d'armure est ecrite POUR UNE PIECE, et rien ne le disait a l'outil.**
`ARMOR` et `SUF` existaient dans `gw2_confronte_totaux` depuis longtemps et
n'etaient branches nulle part : les cinq postes de l'Envoy parfait sortaient
donc en excedent a exactement six fois le nombre ecrit — un artefact d'unite.
L'echelle branchee, un vrai trou apparait dessous : **les Legendary Insight
etaient comptes 25 pour le set entier au lieu de 150.** Le Gift of Prosperity
etait chaine par piece (`perfected_envoy__per_piece`), le Gift of Prowess et le
Gift of Dedication au niveau du set. Les trois sont par piece au wiki ; les
deux retardataires suivent. **125 LI manquaient a l'affichage.**

**Le chevauchement declare n'est plus un excedent nu.**
`qty_overlap_verified` dit, legendaire par legendaire, que l'exigence directe
et la chaine sont toutes deux reelles. L'outil ne lisait pas ce champ : seize
gen3 remplissaient la colonne « rien ne l'explique » sur le trefle mystique,
ce qui noyait les vrais cas.

### Etat du rapport

| | debut de journee | fin |
|---|---:|---:|
| accords | 834 | **1 038** |
| trous | 31 | **0** |
| excedents nus | 22 | **1** |
| tables orphelines | 17 | **4** |

Le seul excedent restant est Warbringer, +350 tickets d'escarmouche : c'est
l'Essence of Annihilation confirmee le 17/09, que la table du precurseur
n'inclut pas. Connue, datee, chiffree.

Audit v45 : 0 erreur, 56 avertissements. Moteurs confrontes : aucun ecart.

## R — 18/09/2026 : lot 20, la chaine des Poemes se ferme

Vingt-quatre captures, exactement celles qui manquaient a la section Q.

**Les seize Poemes portaient un identifiant bricole.** Faute de page, ils
avaient ete nommes depuis le lien de la table — `Poem_on_Pistols`, underscores
compris — d'ou des identifiants en `poem_on_poem_on_pistols` et un `name` qui
n'etait pas le nom de l'objet. Chaque page du lot donne son titre et son apiId :
les seize sont renommes et identifies.

**Les recettes completent la chaine.** Chaque Poeme coute, en plus des 10 Tale
of Adventure et 10 Lamplighter's Badge deja poses hier, une piece d'arme et une
Sheet of Premium Paper. Onze pieces en acier de Deldrimor pour les armes de
metal, cinq en bois d'esprit pour les armes de bois — Spiritwood Focus Core,
Longbow Stave, Scepter Core, Short-Bow Stave, Staff Head. Dix-huit composants
crees, exigence sourcee, cout de fabrication inconnu faute de page.

**Cinq apiId poses** : Lamplighter's Badge 97790, Shard o' War 80380, Tribute to
the Man o' War 80201, et surtout `gift_of_exploration` 19677 et `gift_of_glory`
70528, en attente depuis le 17/09.

**La recette du Shard o' War confirme la saisie d'hier au chiffre pres** : 1
Tribute to the Man o' War, 1 Mystic Curio, 40 lingots de mithril, 30 planches de
bois ancien, Huntsman 450. Elle avait ete posee sur la seule table de l'arme et
la boite Recipe du Gift of Divinity ; sa propre page les rejoint.

### Encore l'apostrophe

Deux fois dans la meme passe.

Le slug tire de `Lamplighter%27s_Badge` donne `lamplighter_s_badge`, quand la
capture s'appelle `lamplighters_badge` : un composant en double s'est cree avant
d'etre fusionne. Et la page etait **deja au depot depuis le lot 7**, sous
`lamplighter_s_badge.html` — le composant, lui, n'existait pas. Le depot porte
donc maintenant deux fichiers pour la meme page wiki. Rien ne les compte deux
fois, aucune des deux ne porte de table, mais `INDEX_CONTENU` les signale et
c'est le genre de doublon qui trompe une lecture future. **Aucune n'est
supprimee sans ton accord.**

### Deux choses vues et laissees

- **`gift_of_glory` coute 250 Shard of Glory**, sa page le dit. La chaine ne le
  porte pas : les 250 sont ecrits en direct sur chaque legendaire qui prend le
  Gift of the Mists. Brancher la chaine sans retirer les cles directes
  doublerait tout. C'est le bon modele — l'information doit descendre la
  chaine — mais c'est un refactor structurel qui deplace des totaux affiches.
- **`karma` porte `aurora: 0`.** Un zero n'est pas une quantite ; le JSX declare
  pourtant le karma pour Aurora, donc l'audit le signale invisible du grand
  total. Le vrai nombre n'est nulle part au depot.

## S — 18/09/2026 : l'apostrophe tranchee, le Gift of Glory branche

### La convention est fixee : le « s » colle a son proprietaire

`Aurene's Claw` donne `aurenes_claw`, jamais `aurene_s_claw`. Les deux formes
cohabitaient et ont coute cher en trois jours : douze tables gen3 ne se
rattachaient a aucun legendaire, un composant s'est cree en double sur le
Lamplighter's Badge, et la capture en double de ce badge dormait au depot depuis
le lot 7.

Deux cent une occurrences corrigees dans les sources, seize captures renommees,
la capture en double supprimee. La regle ne touche QUE le possessif :
`box_o_fun`, `shard_o_war` et `tribute_to_the_man_o_war` contractent un « of »,
pas un « 's », et gardent leur forme.

**Le renommage a decouvert deux apiId qui n'avaient jamais pu etre lus.**
`gift_of_eternitys_garden_exploration` (109114) et `survivors_enchanted_compass`
(106370) avaient leur capture au depot sous la forme contractee et leur
composant sous la forme eclatee : le controle qui rapproche les deux ne tombait
jamais dessus. Ils sont poses.

`check_apostrophe_contractee` rend la derive BLOQUANTE, pas seulement signalee.

### Le Gift of Glory descend enfin la chaine

Sa boite Recipe demande 250 Shard of Glory, exactement comme le Gift of War
demande 250 Memory of Battle. Le Memory of Battle etait chaine ; le Shard of
Glory, non — ses 250 etaient recopies a la main sur cinq legendaires. Asymetrie
pure, dans deux branches voisines du meme Gift of the Mists.

Branchement verifie a totaux constants : les cinq cles directes retirees et la
chaine posee, conflux (420), vision, aetheric_anchor, klobjarne_geirr et
strife_unending (500) ne bougent pas d'une unite. **Et trente-trois legendaires
gagnent les 250 qui leur manquaient** — les seize gen3, seize gen2, Aurora.
Transcendence passe de 2 250 a 2 500 : ses 2 000 couvrent les essences du Mist
Pendant, le Gift of the Mists loge dans son Gift of the Champion et n'avait
jamais ete compte.

### Une fausse piste, et ce qu'elle a coute

En cherchant un detecteur general — confronter chaque boite Recipe capturee a
la chaine — j'ai cru trouver trois ecarts. Deux etaient des erreurs de mon
propre detecteur : `gw2_parse_wiki_recipe_v1` additionne les nombres qui
trainent apres la liste d'ingredients (prix, section « Used in »), d'ou un
Mystic Facet a 750 cristaux au lieu de 250 et un Gift of Research a 500 reactifs
au lieu de 250.

**L'audit a arrete le mauvais chiffre**, `check_qty_vs_jsx` refusant 35 750
cristaux la ou le JSX en declare 23 250. Sans lui, la valeur passait.

Au passage j'ai failli casser la deduplication de la section P : la table
d'Aurene's Rending liste bien deux fois le reactif hydrocatalytique a 250, et
j'ai cru a deux exigences reelles. La page de l'objet, elle, ne la liste qu'une
fois. **La page de l'objet prime sur la liste agregee d'une arme** — la
deduplication reste globale, comme en v3.

Le seul vrai ecart des trois tient : `unbound` demande **5** Pristine Mist
Essence, pas 1. Ad Infinitum suivait.

Le detecteur general n'est pas ajoute : sur les 162 « manques » qu'il sort, la
quasi-totalite sont des recettes de raffinage volontairement non decomposees.
Il faudrait d'abord fiabiliser la lecture des boites.

### Le karma d'Aurora etait la depuis le debut

Ta lecture etait la bonne. Le karma n'est pas absent d'Aurora : il y est comme
**monnaie d'echange**, et il y est deja modelise — neuf entrees `qty_extras`
couvrant la Plage des sirenes, le Lac Doric, la Baie des braises, les Confins de
Givramer et le Mont Draconis, plus deux routes d'achat sur la chaine elle-meme
(eclat d'obsidienne a 2 100 karma piece au Temple de Balthazar, perles orriennes
a 2 688 le lot de trois).

Ce qui manquait, c'est que le controle ne regardait que les totaux et ignorait
les surcouts conditionnels : il declarait donc le karma « invisible du grand
total » alors qu'il est declare neuf fois. **Troisieme fois que cette meme
transversale rate un cas** : `composition` en section O, l'echelle par piece des
armures en section Q, `qty_extras` aujourd'hui. Le `required: 0` du JSX est
correct — le karma d'Aurora n'a pas de socle, seulement des surcouts.

Audit v46 : 0 erreur, 54 avertissements. Moteurs confrontes : aucun ecart.

## T — 18/09/2026 : les etapes de collection deviennent cliquables

« Sold by BUY-2046 PFR in the Mistlock Observatory for 20 Pristine Fractal
Relic » : la description d'une etape repond rarement a la question qu'on se pose
devant elle. La page de l'objet, si.

**Le lien n'est pas construit, il est lu.** La capture d'une page de collection
porte, pour chaque case, un bloc `data-id="achievement<id>-bit<n>"` contenant
l'icone de l'objet et son lien. `gw2_liens_collection_v1.py` l'extrait et le
pose dans le champ `wiki` de l'etape — le meme champ que portent deja les
legendaires et les composants, a la meme forme percent-encodee. Aucun champ
parallele, aucune URL devinee : une page absente du depot ne donne pas de lien,
et c'est preferable a un lien mort.

**2 376 etapes sur 2 504 recoivent leur lien.** Les 128 restantes n'ont pas
d'icone d'objet dans leur case.

### Le filtre qui a evite 382 liens inutiles

La premiere version prenait le premier lien de la case. Sur les collections a
etapes — « Parler au chaman hylek », « Vaincre Tequatl le Sans-Soleil » — ce
premier lien est ce que la description cite au passage : un point de passage,
une espece. Dix-neuf des vingt cases de Sungod's Shard pointaient vers
« Waypoint ». Le lien n'est desormais pris que dans l'icone d'objet du widget.

Des 267 divergences nom/page restantes, l'echantillon lu est legitime :
`Prototype Fractal Capacitor` pointe vers `Prototype_Fractal_Capacitor_(skin)`
(homonymie wiki), `Beta Fractal Capacitor (Infused)` vers la page de base
(redirection), et `Amalgamated Rift Essence` vers `Amalgamated_Kryptis_Essence`
(l'objet a ete renomme en jeu). Ce sont les liens que le wiki lui-meme rend.

Cote JSX, un seul composant `NomEtape` sert les trois endroits qui affichent un
nom d'etape. Sans lien, il rend le nom tel quel.

## U — 18/09/2026 : Vision — les couts etaient la, l'etape ne les disait pas

Ton impression de « decouvrir » ces couts est exacte, mais pas pour la raison
attendue : **ils etaient deja dans l'arbre**. Vision compte 3 100 minerais de
kralkatite, 3 000 poudres de quartz rose, 460 masses marquees, 18 joyaux de
serpentite, 300 mosaiques d'elegie. Rien ne manquait au grand total.

Ce qui manquait, c'est le LIEN entre l'etape et son cout. Une etape « Vision of
Equipment » affichait « Purchased from Yasna for 5 after crafting 6 Astral
weapons » et s'arretait la. Les 300 lingots derriere — donc 3 000 minerais et
3 000 poudres — vivaient dans le grand total, sans rien pour dire d'ou ils
venaient. On les decouvre donc en jeu, ce qui est exactement ce qu'un tracker
doit eviter.

Le champ existait pourtant : `component` sur une etape, deja pose sur la seule
Banner of the Commander de Kourna. Trois autres le recoivent — Istan, Ventesable,
Chef-Tonnerre.

**Les armes Astral n'avaient aucun palier.** Leur cout pendait en direct sur
Vision (300 lingots), sans porteur. Un composant `astral_weapons` est cree sur
le modele exact de son jumeau `dragonsblood_weapons` de Chef-Tonnerre, et les
lingots s'y accrochent : 50 par arme, six armes. **Totaux inchanges** — 3 100
minerais, 3 000 poudres, 300 lingots avant comme apres. Le cout change de
porteur, pas de valeur.

Cote JSX, `FactureEtape` lit la facture DANS la chaine : les composants dont une
cle `qty` vise celui de l'etape. **Un cran, pas de recursion** — la cascade a son
moteur, et ce projet a deja paye cher ses reimplementations a la main. Rien
n'est recopie : le jour ou la chaine change, la ligne change avec elle.

### Ce qui reste a capturer sur Vision

Deux etapes « Vision of Equipment » sur six n'ont aucun palier, et aucune page
au depot :

- **Jahai — Elegy Armor.** L'etape renvoie a la collection The Convergence of
  Sorrow I: Elegy, dont le cout en mosaiques d'elegie n'est rattache a rien.
- **Chute draconique — Mist Shard armor de rang 1.** Absent de l'arbre.

Et une troisieme zone d'ombre : les 200 ressources de carte que tu cites pour
Kourna n'apparaissent nulle part dans la chaine de la Banner of the Commander,
qui ne montre que 25 lingots d'orichalque, 1 hampe laquee et 1 fanion.

## V — 18/09/2026 : l'onglet Composants de Vision etait vide de ses cartes

Correction de la section U, qui n'avait vu que la moitie du probleme. J'avais
rattache les etapes de collection a leur composant ; tu cherchais les couts dans
l'onglet **Composants**, et ils n'y etaient pas.

**Ils n'y etaient pas parce que cet onglet ne rend PAS l'arbre de craft.** Il
rend le tableau `currencies` declare dans le JSX, legendaire par legendaire.
Aurora y liste ses six monnaies de LW3 — rubis de sang, baie d'hiver, bois
petrifie, eclat de jade, fleur d'orchidee, perle orrienne. Vision n'en listait
QUE trois : mosaique d'elegie, gemme amalgamee, magie volatile. Les six monnaies
de LW4 n'y figuraient pas.

D'ou l'impression exacte de decouvrir ces couts : ils etaient dans l'arbre,
dans le grand total, et invisibles a l'endroit ou on les cherche.

Sept entrees ajoutees, chacune au total que le moteur calcule :

| monnaie | requis | carte |
|---|---:|---|
| Kralkatite Ore | 3 100 | Domain of Istan |
| Powdered Rose Quartz | 3 000 | Domain of Istan |
| Branded Mass | 460 | Thunderhead Peaks |
| Inscribed Shard | 100 | Domain of Kourna |
| Difluorite Crystal | 100 | Sandswept Isles |
| Lump of Mistonium | 100 | Jahai Bluffs |
| Funerary Incense | 100 | cartes de Path of Fire |

Les cartes ne sont pas devinees : elles sont lues dans le champ `map` des
sources de chaque composant. Ta lecture inversait difluorite et mistonium — le
difluorite est de Ventesable, le mistonium de Jahai.

**L'audit a refuse le premier jet**, et il avait raison : sept erreurs, une par
monnaie, parce qu'un apiId declare cote JSX doit figurer dans
`_meta.direct_sync.leg_currency_ids`. Sans cela l'onglet aurait affiche sept
lignes a zero possede, sans jamais lire le stock.

### Ce n'est pas propre a Vision

La meme lacune court sur **presque tout le depot** :

- les 16 gen2 : 800 pieces d'aeronef, 800 cristaux de ligne de force, 800
  lingots d'aurillium, plus les quatre monnaies de HoT a 250, aucune declaree ;
- les 16 gen3 : minerai cristallin, huile d'aeronef, poussiere aurique, etincelle
  de ligne de force, 250 chacune ;
- **Klobjarne Geirr : 20 250 pieces anciennes** et 250 eclats du Foyer ;
- **Orrax Manifested : 50 000 pieces anciennes**, 750 blocs d'obsidienne mursaat,
  750 pierres de chaleur de titan, 725 vestiges mursaat ;
- Perfected Envoy : les trois monnaies de HoT a 1 500 ;
- Selachimorpha et Aetheric Anchor : 500 ducats antiques ;
- Stella Radians : 500 fragments de pierre d'ombre.

Toutes sont dans l'arbre et dans le grand total, aucune dans son onglet
Composants. Le correctif est mecanique — `required` vaut le total du moteur,
l'apiId vient du composant, la carte de son champ `map` — et
`check_qty_vs_jsx` refuse toute divergence. Il n'est pas applique ici : tu as
demande de concentrer sur Vision, et une trentaine de blocs en une passe merite
son propre feu vert.

Aucune regle d'audit ne peut le detecter seule : le tableau `currencies` est une
selection editoriale, et un detecteur naif sort les materiaux T6 de tout le
depot — mesure, il crie sur 70 legendaires.

## W — 18/09/2026 : les quatre blocs restants, apres trois ratages

La passe precedente avait echoue trois fois de suite : mes inserts atterrissaient
dans le bloc du voisin — `triumphant_hero` au lieu de `perfected_envoy`,
`trinkets` au lieu d'Orrax. Cause : je reperais un legendaire par l'indentation
de sa cle, `\n  <leg>: {`, alors que les definitions sont imbriquees a des
profondeurs variables. **L'audit avait attrape le premier jet** — « airship_part
declare pour triumphant_hero, invisible du grand total ».

Le repere juste est le marqueur `id: "<leg>"` du bloc lui-meme, avec le bloc
suivant pour borne, et une verification apres coup que chaque ligne ajoutee est
bien tombee entre ces bornes.

Quatre blocs, sept entrees :

| legendaire | monnaie | requis | carte |
|---|---|---:|---|
| Orrax Manifested | Ancient Coin | 50 000 | Janthir Wilds |
| Orrax Manifested | Mursaat Obsidian Chunk | 750 | Mistburned Barrens |
| Orrax Manifested | Titan Heatstone | 750 | Mistburned Barrens |
| Orrax Manifested | Curious Mursaat Remnants | 725 | Bava Nisos |
| Perfected Envoy | Airship Part | 250/piece | Verdant Brink |
| Perfected Envoy | Lump of Aurillium | 250/piece | Auric Basin |
| Selachimorpha | Antiquated Ducat | 500 | Castora |
| Stella Radians | Shadowstone Fragment | 500 | Eternity's Garden |

**Perfected Envoy ne compte pas comme les autres** : son tableau s'appelle
`currenciesPerPiece` et porte `perPiece`, pas `required`. Ses 1 500 pieces
d'aeronef et 1 500 lingots d'aurillium s'y ecrivent 250 par piece — l'echelle par
six, encore elle, deja croisee en section Q sur la table wiki.

### Le chiffre annonce etait faux

J'avais dit « une trentaine de blocs ». Mesure au critere large — un apiId deja
reconnu comme monnaie ailleurs et present au total d'un autre legendaire —
**1 155 entrees sur 70 legendaires**, parce que le critere ramasse les T6, les
ectoplasmes et les pieces mystiques, qui relevent du grand total et pas de la
bande de monnaies. Restreint aux vraies monnaies de carte ou d'extension, avec un
plancher a 100 : 167 entrees sur 37 legendaires, dont 33 sans bloc propre. D'ou
ces quatre-la seulement, et le reste au backlog.

## X — 18/09/2026 : les 200 ressources de Kourna trouvees, le cout retroactif bloque

Six captures integrees et indexees. Deux remplacent des pages deja au depot
(`lacquered_banner_pole`, `the_convergence_of_sorrow_i_elegy`), quatre sont
nouvelles.

**Tes « 200 ressources de carte pour Kourna » existent, et les voici.** La hampe
laquee ne se fabrique pas : elle s'ACHETE chez Lady Camilla, au Domaine de
Kourna, contre 1 Vial of Awakened Blood, 10 Ancient Wood Log, 10 Globes
d'ectoplasme et **100 Inscribed Shard**. Le fanion en demande vraisemblablement
autant — sa page manque encore. Chaine posee, et le total d'eclats graves de
Vision passe de 100 a **200**, exactement ton chiffre.

L'audit a arrete au passage un apiId invente : j'avais ecrit 19726 pour l'Ancient
Wood Log, le referentiel donne 19725. Deux regles ont crie en meme temps, celle
du referentiel et celle de la capture.

**L'etape Elegy Armor de Jahai ne coute aucun materiau** : l'objet s'achete 80
pieces de cuivre chez Amira, au Refuge du Soleil, une fois la collection The
Convergence of Sorrow I: Elegy terminee. Le cout est la collection, pas la
matiere. Reference posee sur l'etape.

**L'armure Mist Shard de Chute draconique non plus, ou presque** : un set entier
se gagne en recompense de six succes. Les pieces supplementaires coutent 25
Mistborn Mote chacune, mais l'etape ne demande qu'un poids de rang 1, donc rien
a farmer si les succes sont faits.

### Le cout retroactif ne rentre pas dans la structure actuelle

Ta demande — qu'un cout disparaisse quand son etape est validee — est la bonne,
et le mecanisme `qty_extras` semblait fait pour elle. Il ne l'est pas, pour deux
raisons lues dans le moteur :

1. **Il n'AJOUTE que.** `add += x["amount"]` tant que l'etape n'est pas faite. Il
   n'y a pas de decompte.
2. **Il ne s'applique qu'aux cles a plat.** « Il ne s'ajoute QUE la ou le
   composant porte une cle a plat pour la cible » — or le kralkatite arrive par
   la cascade, minerai → lingot → armes Astral → Vision. Un surcout ne peut pas
   le toucher.

Pour que tes six armes Astral fassent tomber les 3 000 minerais et les 3 000
poudres, il faudrait recopier toute la branche a plat sur Vision — donc detruire
le palier `astral_weapons` pose en section U et remettre une table parallele.
C'est exactement ce que la regle du projet interdit.

**La voie propre existe et tient en une phrase** : une etape de collection qui
pointe vers un composant, et qui est validee, satisfait ce composant — sa
quantite tombe a zero, et toute sa sous-chaine avec elle. La donnee est deja la,
c'est le champ `component` pose en section U sur les quatre etapes « Vision of
Equipment ». La regle serait generale, pas propre a Vision, et vaudrait pour
toute etape reliee a un composant.

Ce n'est pas une insertion : c'est une regle de calcul nouvelle, a poser dans les
deux moteurs et a couvrir par le test de conformite, et elle deplace des nombres
affiches. Elle attend ton feu vert.

## Y — 18/09/2026 : une etape validee satisfait son composant

La regle proposee en section X est posee, dans les deux moteurs.

**Enonce** : quand une etape de collection pointe vers un composant — champ
`component` — et que cette etape est cochee, ce composant est fabrique. Sa
quantite tombe a zero, et toute sa sous-chaine avec elle.

Ce que cela donne sur Vision, etapes « Vision of Equipment » d'Istan et de
Chef-Tonnerre validees :

| | avant | apres |
|---|---:|---:|
| Kralkatite Ore | 3 100 | **100** |
| Powdered Rose Quartz | 3 000 | **0** |
| Branded Mass | 460 | **100** |
| Exquisite Serpentite Jewel | 18 | **0** |
| Globe d'ectoplasme | 1 017 | 687 |

Les restes ne sont pas des oublis : les 100 minerais du Gift of Crystalline
Magic et les 100 masses du Gift of Ephemeral Magic ne passent pas par les armes,
donc ils restent dus. C'est precisement ce qu'on veut lire.

**Pourquoi pas `qty_extras`**, qui semblait fait pour : il n'AJOUTE que
(`add += x["amount"]`), et seulement la ou le composant porte une cle a plat
pour la cible. Le kralkatite arrive par la cascade — minerai, lingot, armes
Astral, Vision — donc aucun surcout ne peut l'atteindre. Le neutraliser par ce
biais aurait demande de recopier la branche a plat sur Vision, c'est-a-dire de
reconstruire la table parallele que le palier `astral_weapons` venait de
supprimer.

**La regle ne concerne pas que Vision.** Le garde-fou, teste en retirant la
regle du seul cote JSX, a fait tomber le test sur les armes gen1 : leurs etapes
de collection pointent deja vers `gift_of_mastery` et `gift_of_fortune`. La
regle les couvre du meme coup, sans rien ajouter aux donnees.

### Le test de conformite ne voyait pas ce genre de regle

Il ne comparait les deux moteurs que sur des collections VIERGES. Deux moteurs
d'accord sur zero et en desaccord des la premiere case cochee auraient passe.
Il rejoue desormais tout le jeu de cibles une seconde fois, **toutes les etapes
portant `component` validees** : 5 114 totaux dans la premiere situation,
4 548 dans la seconde — le nombre baisse parce que des composants disparaissent,
ce qui est la preuve que la regle a joue. Aucun ecart dans les deux.

Sept fichiers suivent la version du moteur : `gw2_arbitrages_v7`,
`gw2_audit_v47`, `gw2_conformite_moteurs_v2`, `gw2_confronte_totaux_v6`,
`gw2_confronte_v3`, `gw2_deplie_wiki_v12`.

**Un rebut supprime au passage** : `gw2_confronte_totaux_v6.py` etait entre dans
le depot au commit precedent par ma faute — un reste de la tentative de parseur
v4 abandonnee en section S. Il importait `gw2_parse_material_list_v4`, qui
n'existe pas : le fichier ne pouvait pas tourner. Le v6 porte desormais la vraie
suite du v5.

## Z — 18/09/2026 : le groupe d'armes montre enfin ses monnaies de carte

Point 2 du backlog. Seize gen2 et seize gen3 reclamaient en silence des
ressources de Heart of Thorns : elles etaient dans l'arbre et dans le grand
total, absentes de l'onglet Composants du groupe d'armes.

Le groupe ne se declare pas comme les autres : pas de bloc `currencies`, mais
`currenciesPerWeaponByGen`, un cout UNITAIRE par generation multiplie par le
nombre d'armes restantes. Et une subtilite qui m'a coute deux tentatives : **il
n'y a pas de cle `gen3`**. Le commentaire du fichier le dit — « gen3 =
currenciesPerWeapon » — la generation 3 retombe sur la liste par defaut.

Six entrees pour la gen2 (800 pieces d'aeronef, 800 lingots d'aurillium, et les
quatre monnaies de HoT a 250), quatre pour la gen3 (les memes quatre a 250).
Chaque `perUnit` est le total que le moteur calcule pour UNE arme, identique sur
les seize de la generation.

**L'audit a refuse le premier jet**, quatre erreurs, une par monnaie absente de
`_meta.direct_sync.leg_currency_ids`. Meme garde-fou qu'en section V : sans lui,
l'onglet aurait affiche des lignes a zero possede sans jamais lire le stock.

### Ce qui reste, et pourquoi je ne l'ai pas force

**Klobjarne Geirr et ses 20 250 pieces anciennes restent invisibles.** Il tombe
dans le seau `other` du groupe d'armes, partage avec les autres armes hors
generation — or il est le seul a porter cette monnaie. Y ecrire 20 250 les
ferait toutes mentir.

La bonne forme n'est pas un tableau de plus indexe par arme : ce serait une
table parallele de plus, et c'est precisement ce que la regle du projet
interdit. La chaine sait deja tout. La voie propre est de faire lire au groupe
d'armes le total du moteur pour l'arme selectionnee, au lieu d'une liste ecrite
a la main par generation — ce qui supprimerait du meme coup
`currenciesPerWeapon`, `currenciesPerWeaponByGen` et le risque de derive que
`check_qty_vs_jsx` doit surveiller aujourd'hui.

C'est un remplacement de mecanisme, pas une insertion. Il attend un feu vert.

**`ley_line_crystal` manque partout** : 800 par arme gen2 selon la chaine, mais
son composant n'a pas d'apiId, donc son stock ne peut pas etre lu et l'audit
refuserait la ligne. Sa page est a capturer.

## AA — 18/09/2026 : le suivi d'armes lit le moteur, deux tables parallelles en moins

### Le pont manquait

Le suivi d'armes raisonne en identifiants d'objets de l'API, decouverts via
`/v2/legendaryarmory`. Le moteur raisonne en cles de legendaires. Rien ne
traduisait les uns en les autres : **trois legendaires sur 84 portaient un
apiId**. Ni Astralaria, ni Aurene's Claw, ni Klobjarne Geirr.

**Soixante-huit apiId poses**, tous lus dans la propre capture wiki du
legendaire, aucun devine. Les dix qui restent sans sont les quatre sets
d'armure, Eikasia, Selachimorpha, le Fractal Capacitor et les trois pseudo-
cibles (`t6_tracker`, `upgrades_combined`, `weapons_tracker`) : aucune arme ne
manque a l'appel.

### La mecanique

`currenciesPerWeapon` et `currenciesPerWeaponByGen` portaient des `perUnit`
ecrits a la main. Table parallele, avec sa derive possible et son angle mort :
les 20 250 pieces anciennes de Klobjarne Geirr etaient introuvables parce qu'il
tombait dans le seau « other », partage avec les autres armes hors generation,
et qu'il est le seul a porter cette monnaie — y ecrire son chiffre aurait fait
mentir les autres.

Les deux tableaux sont remplaces par un `currencyCatalog` **sans aucun nombre** :
nom, icone, apiId, composant, carte. De quoi AFFICHER une ligne. Ce qu'elle vaut,
le moteur le dit, pour les armes reellement ciblees et non possedees, via
`computeGrandTotal` — le meme moteur que le grand total et que le confrontateur
Python. Une monnaie que les armes ciblees ne demandent pas ne s'affiche pas.

Effet immediat :

| | avant | apres |
|---|---|---|
| Klobjarne Geirr | rien | **20 250 pieces anciennes**, 250 eclats du Foyer, 38 trefles |
| Astralaria | 800 + 800 ecrits a la main | 800 + 800 calcules |
| une gen3 non ciblee | lignes a zero | rien |

Et `check_qty_vs_jsx` n'a plus rien a surveiller de ce cote : il n'y a plus de
nombre ecrit a la main pour les armes.

### Deux apiId que j'avais inventes

J'avais ecrit 103351 pour la piece ancienne et 102952 pour l'eclat du Foyer, de
memoire. Les composants disent 100477 et 103587. **Corriges depuis la donnee, pas
depuis ma memoire** — c'est la troisieme fois cette semaine qu'un identifiant
invente se fait prendre, apres l'Ancient Wood Log en section X.

Reste a capturer : `Ley_Line_Crystal`, 800 par arme gen2 selon la chaine, dont le
composant n'a pas d'apiId — sa ligne ne peut donc pas s'afficher.

**Rattrapage immediat (JSX v215)** : deux endroits collectaient encore les apiId
a synchroniser depuis `currenciesPerWeapon` et `currenciesPerWeaponByGen`. Les
tableaux ayant disparu, ils ne ramenaient plus rien — le stock des monnaies
d'armes n'aurait plus ete lu du tout, et toutes les lignes auraient affiche zero
possede. Ils lisent desormais le catalogue. Un `grep` des deux anciens noms ne
laisse plus qu'une occurrence, dans le commentaire qui raconte leur suppression.
