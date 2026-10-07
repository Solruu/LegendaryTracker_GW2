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

Sept fichiers suivent la version du moteur : `gw2_arbitrages_v8`,
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

## AB — 18/09/2026 : la regle de la section Y s'applique a 56 etapes de plus

La regle « une etape validee satisfait son composant » ne servait qu'aux
etapes qui portaient deja le champ `component` : les quatre « Vision of
Equipment » posees en section U, et celles des armes gen1 que le garde-fou
avait revelees. Une regle generale branchee sur une poignee de cas.

**Cinquante-six etapes de plus sont rattachees**, par identite de nom : une
etape appelee « Gift of Frostfang » EST le composant `gift_of_frostfang`. Le
rapprochement se fait sur le nom normalise, et un garde-fou refuse le lien si
l'etape et le composant portent des liens wiki differents — aucun homonyme n'a
eu a etre ecarte, mais la porte est fermee.

Ce que cela donne, en cochant « Gift of Ice » sur Frostfang :

| | avant | apres |
|---|---:|---:|
| Corrupted Lodestone | 100 | **0** |
| Glacial Lodestone | 100 | **0** |
| Orichalcum Ingot | 500 | **250** |

**Les totaux a collections vierges ne bougent pas d'une unite** — verifie sur
les 84 cibles avant ecriture. Le lien ne cree aucun cout : il dit seulement a
quoi une etape correspond.

Les 2 173 etapes restantes sans correspondance sont normales : ce sont des
etapes d'action (« Vaincre Tequatl », « Parler au chaman hylek »), pas des
objets de l'arbre de craft.

## AC — 20/09/2026 : lot 21, la branche des Poemes descend jusqu'au bout

Vingt captures, exactement les composants poses a nu en section R : les onze
pieces en acier de Deldrimor, les cinq en bois d'esprit, la Sheet of Premium
Paper, les armes Astral, le Vial of Awakened Blood et la magie volatile.

**Dix-neuf apiId poses, cinquante-deux aretes chiffrees.** Les pieces d'arme
n'etaient plus des culs-de-sac : chacune coute 5 poudres cristallines, du
lingot d'acier de Deldrimor ou de la planche de bois d'esprit, et 50 reactifs
thermocatalytiques. La feuille de papier premium descend sur pulpe de bois
ancien, cruche d'eau et rouleau de gossamer.

Deux composants crees au passage — `ancient_wood_pulp` et `jug_of_water` —
et `Pile of Crystalline Dust` reconnue comme la `dust_crystalline` deja au
depot, sans doublon.

**131 totaux augmentent**, tous sur les seize gen3 : c'est du cout reel qui
manquait, pas une derive. Les deux moteurs restent d'accord partout.

### Un excedent uniforme, sourcé, que l'outil ne sait pas encore expliquer

Les seize gen3 sortent desormais a 300 reactifs thermocatalytiques contre 250
au tableau. Les 50 d'ecart sont ceux de la piece d'arme du Poeme, et ils sont
justes : la boite Recipe de chaque lame ou de chaque fut les demande.

Le tableau de l'arme cite le Poeme sans l'ouvrir — branche fermee — donc
l'ecart devrait tomber dans « excedents expliques ». Il n'y tombe pas parce que
`gw2_confronte_totaux` ne regarde qu'UN cran : le reactif pend sous la lame, la
lame sous le Poeme, et le Poeme seul figure dans les branches fermees du
tableau. Approfondir la recherche a la sous-chaine entiere reglerait les seize
d'un coup. Non fait ici.

`accords 1038 -> 1022`, `excedents nus 1 -> 17`. La baisse des accords et la
hausse des excedents disent la meme chose : l'arbre en sait maintenant plus que
la table agregee de l'arme.

## AD — 20/09/2026 : l'index decrivait des fichiers disparus

Deux defauts, tous deux invisibles tant qu'on ne les cherchait pas.

**`ressources/INDEX.md` portait dix-sept lignes orphelines.** Les seize captures
`gift_of_aurene_s_*` renommees a la contraction de l'apostrophe, plus
`lamplighter_s_badge.html` supprimee comme doublon. Leurs nouvelles lignes
s'etaient ajoutees, les anciennes etaient restees : pendant deux jours l'index a
decrit des fichiers qui n'existaient plus, en double de ceux qui existaient.

La cause est dans l'outil. Il DETECTAIT les orphelines — il les listait meme —
mais les annoncait « NON retirees, a trancher a la main », et surtout il ne
reecrivait le fichier que s'il manquait des lignes. Aucune ligne manquante,
donc « Tableau complet », donc aucune ecriture, donc les orphelines eternelles.

`gw2_index_wiki_v3` les retire. Une ligne dont le fichier n'est plus la ne
decrit plus rien : la supprimer n'est pas reecrire une ligne existante, c'est la
supprimer avec son sujet. Les tableaux des autres sources ne sont pas touches —
le calcul des orphelines ne regarde que le bloc `wiki/`, et les deux lignes
`gw2efficiency/` qui semblaient orphelines pointent bien vers des fichiers
presents dans leur propre dossier.

Apres purge : **834 lignes pour 834 fichiers, zero orpheline, zero manquante.**

**`PAGES_A_CAPTURER.md` se disait genere par `gw2_pages_a_capturer_v1.py`.** Le
script s'ecrit son propre nom dans l'entete, et ce nom n'avait pas suivi son
passage en v2. Corrige en v3, ou il se nomme juste.

## AE — 20/09/2026 : la recherche de branche fermee ne regardait qu'un cran

`gw2_confronte_totaux` expliquait un excedent en cherchant, parmi les PARENTS
DIRECTS du composant, une branche que la table cite sans l'ouvrir. Un cran,
donc aveugle a tout ce qui pend deux crans plus bas.

`v7` remonte la chaine de parent en parent, bornee a six crans pour qu'un cycle
ne boucle pas, et ne retient qu'un ancetre ferme que la cible demande vraiment.

Effet : **Warbringer quitte la colonne des excedents nus.** Ses +350 tickets
d'escarmouche pendaient sous l'Essence of Annihilation, elle-meme sous une
branche fermee — la remontee d'un cran ne les atteignait pas. C'etait le dernier
excedent nu connu avant le lot 21.

### Les seize gen3 restent nus, et ce n'est pas le meme probleme

Je pensais que la meme correction reglerait les seize reactifs thermocatalytiques
a +50. Non, et la raison est instructive : **la table de l'arme ne cite pas du
tout la piece d'arme du Poeme.** Elle ouvre le Poeme et n'y liste que ses 10
Tale of Adventure et ses 10 Lamplighter's Badge ; la lame et la feuille de papier
premium n'y figurent pas. Il n'y a donc aucune branche fermee a trouver, a un
cran comme a six.

Nos 300 sont justes : la boite Recipe de chaque lame demande 50 reactifs, et le
principe pose en section S tranche — **la page de l'objet prime sur la liste
agregee d'une arme**. C'est la table qui est incomplete.

Declarer ces seize-la demanderait un champ nouveau : `qty_overlap_verified` dit
autre chose (l'exigence directe ET la chaine sont toutes deux reelles), et s'en
servir ici serait detourner sa semantique. Je ne l'ai pas fait. Seize lignes
uniformes, sourcees et expliquees ici valent mieux qu'un champ bricole.

## AF — 20/09/2026 : la file de captures redemandait ce qui etait deja la

Tu avais raison de trouver `PAGES_A_CAPTURER.md` faux, et c'etait pire que perime.

**Il redemandait des pages deja au depot.** Astral Weapons, Augur's Stone,
Bloodstone Shard, Spark of Sentience : leur capture dormait dans
`ressources/wiki/`, mais comme leur page ne porte ni boite Recipe ni cout
vendeur — page de categorie, de monnaie, objet non fabricable — la section
« trous de l'arbre » les re-reclamait a chaque generation. Aucune capture ne
pouvait jamais y ajouter une recette : la demande ne pouvait pas aboutir. Ils
passent dans une sous-section « 0 ter », sans URL.

**Et moi je redemandais deux pages que tu m'avais donnees.** Depuis trois passes
je reclamais `Ley_Line_Crystal` et `Banner_Pennon` comme manquantes. Les deux
etaient au depot. Je n'avais pas interroge `INDEX_CONTENU.json` avant de les
declarer absentes — exactement l'erreur que le projet note deja dans ses
principes. Lues aujourd'hui :

- **Ley Line Crystal est une monnaie de portefeuille**, pas un objet : sa page le
  dit (« stored in the Account Wallet ») et ne porte aucun identifiant d'objet.
  D'ou l'apiId introuvable. Id 20 pose, lu dans le referentiel des monnaies.
- **Banner Pennon se fabrique** : 5 Bolt of Gossamer, 100 Spool of Gossamer
  Thread, 5 Globes d'ectoplasme, 5 Olmakhan Latigo Strap. **Aucun eclat grave** :
  tes 200 ressources de Kourna sont bien les 100 du Gift of Crystalline Magic et
  les 100 de la hampe, deja comptes.

**Une categorie manquait.** Ni les trous (il faut des enfants) ni la section 3 (il
faut ne pas avoir d'apiId) ne voyaient un composant FEUILLE, identifie, dont on
ignore comment il s'obtient. Section « 3 bis » ajoutee : cinq composants.

**`PAGES_A_CAPTURER.txt` est supprime**, et le generateur ne l'ecrit plus. Il
repetait les memes pages en URLs brutes : une redondance a tenir en phase. Les
URLs vivent desormais dans le dernier bloc du `.md`, une fois.

File : **11 URLs**, contre 16 avant — et toutes reellement absentes du depot.

Deux choses que je n'ai PAS reglees et que je signale :

- `Olmakhan_Bandolier` reste demande, et ne sera sans doute jamais trouve : la
  chaine s'appelle ainsi dans la donnee, mais le wiki n'a que les quatre paliers
  (Simple, Handwoven, Pocketed, Reinforced), deja au depot. C'est un nom de
  composant qui ne correspond a aucune page.
- **Airship Part et Lump of Aurillium sont AUSSI des monnaies de portefeuille**
  (ids 19 et 22 au referentiel), mais les composants portent les ids d'objet
  74494 et 75012 — que leurs pages wiki affichent bien. Les deux formes existent.
  Si ton stock vit dans le portefeuille, le tracker lit l'objet et affiche zero.
  Je ne sais pas lequel des deux porte ton stock : c'est a verifier en jeu avant
  de toucher.

## AG — 20/09/2026 : l'Olmakhan Bandolier, ou j'ai confondu un defaut de donnee avec une fatalite

### Ce qui a merde

`olmakhan_bandolier_chain` etait un **agregat synthetique** : un composant
invente, nomme « Olmakhan Bandolier (chaîne) », avec `qty: {vision: 5}`, une
note disant « 5 charmes, 1 ectoplasme chacun », et pour toute reference
« arbre GW2Efficiency (Vision) ». Aucune page wiki ne porte ce nom, et pour
cause : il n'existe pas dans le jeu.

Le generateur de file en derivait un titre de page — « Olmakhan Bandolier » —
et le redemandait a chaque passe. Jusque-la, c'est une consequence mecanique.

**L'erreur est ce que j'en ai conclu.** J'avais liste les quatre vraies pages
deux messages plus tot — Simple, Handwoven, Pocketed, Reinforced, toutes au
depot depuis longtemps. Et j'ai ecrit « ne sera sans doute jamais trouve : le
wiki n'a que les quatre paliers ». La bonne conclusion etait l'inverse exact :
**les quatre pages existent, donc l'agregat synthetique doit disparaitre.** J'ai
classe en fatalite de nommage ce qui etait un defaut de modelisation, et je l'ai
range dans la colonne « signale, non regle » au lieu de le corriger.

Le principe du projet le disait deja, noir sur blanc : *les arbres GW2Efficiency
sont des plans d'achat, pas des nomenclatures*. Un composant dont la seule
reference est un arbre GW2Efficiency aurait du me sauter aux yeux.

### La vraie chaine

Les quatre boites Recipe la donnent entierement :

| palier | recette |
|---|---|
| Simple | 10 Bolt of Gossamer + 1 Superior Rune of Holding + 1 Olmakhan Charm |
| Handwoven | **2 Simple** + 4 Latigo Strap + 1 Supreme Rune of Holding + 1 Charm |
| Pocketed | 1 Handwoven + 4 Latigo Strap + 5 Supreme Rune + 1 Charm |
| Reinforced | 1 Pocketed + 4 Latigo Strap + 12 Supreme Rune + 1 Charm |

Deplie : **5 Olmakhan Charms** — exactement ce que l'ancienne note annoncait, ce
qui confirme que le chiffre etait juste et seule la structure etait fausse. Et
17 sangles, 18 runes supremes, 25 rouleaux de gossamer, qui n'apparaissaient
nulle part.

Les 5 ectoplasmes, eux, disparaissent : **aucune des quatre recettes n'en
demande**. Ils venaient du plan d'achat, pas du jeu.

### Ce que les trois succes ajoutent

Les captures de `Lasting Bonds: Where We Come From`, `What We Do Here` et
`What Comes Next` sont sans equivoque : **Efi DONNE les bandouliers** pour
chaque collection terminee, la suivante etant debloquee par la precedente. Le
palier renforce s'obtient donc gratuitement au bout des trois collections.

La chaine artisanale reste modelisee — elle existe, ses recettes sont reelles —
et la voie par collection est notee dans `sources`. **Laquelle prendre est une
decision de jeu, pas une donnee** : je ne tranche pas, les deux sont visibles.

Reste a faire, que je ne fais pas ici : rattacher les trois collections a la
donnee (achievements 4144, 4106, 4112) pour que la regle « une etape validee
satisfait son composant » les couvre. Elles ne sont pas dans les collections de
Vision : ce sont des succes de A Bug in the System, prerequis de l'etape.

## AH — 20/09/2026 : les trois Lasting Bonds rejoignent la donnee

Les trois collections prerequises de l'etape « Vision of Equipment: Olmakhan
Bandolier » entrent dans `vision.collections` : `lb_where_we_come_from` (succes
4144, 6 etapes), `lb_what_we_do_here` (4106, 9) et `lb_what_comes_next` (4112,
8).

**Aucune regle nouvelle n'a ete necessaire.** La premiere etape de chaque
collection EST le palier de bandoulier qu'Efi donne : bit 0 de 4144 est le
Simple, bit 0 de 4106 le Handwoven, bit 0 de 4112 le Pocketed. Le rattachement
par identite de nom — celui pose le 18/09 — les relie tout seul, et la regle
« une etape validee satisfait son composant » fait le reste.

Cocher le bit 0 de « What Comes Next », c'est-a-dire posseder le bandoulier a
poches :

| | avant | apres |
|---|---:|---:|
| Simple Olmakhan Bandolier | 2 | 0 |
| Handwoven | 1 | 0 |
| Pocketed | 1 | 0 |
| Olmakhan Charm | 5 | **1** |
| Olmakhan Latigo Strap | 17 | **9** |
| Supreme Rune of Holding | 18 | **12** |
| Bolt of Gossamer | 25 | **5** |

Ne reste que le dernier palier : 4 sangles, 12 runes supremes, 1 charme. C'est
exactement ce qu'on veut lire quand on a deja les trois quarts du travail.

**Totaux a collections vierges inchanges**, verifie sur les 84 cibles avant
ecriture.

### Deux pieges de lecture dans les captures

Chaque case de collection est rendue DEUX fois dans la page — une fois en icone,
une fois en ligne — donc une lecture naive doublait chaque etape : 12 au lieu de
6, 18 au lieu de 9. Deduplique par numero de bit.

Et la page de « What Comes Next » porte le widget d'une AUTRE collection, le
renvoi vers Visions of Sandswept Isles (succes 4774). Une premiere passe a donc
donne l'identifiant 4774 a `lb_what_comes_next` — le meme que `vis_sandswept`,
deja dans la donnee. L'audit a refuse. On ne garde desormais que les cases du
succes de la page.

## AI — 20/09/2026 : trois pages reclamees en 404, toutes trois au depot

Le nom d'un composant n'est pas toujours celui de sa page. Trois cas :

| composant | titre reclame | vrai titre wiki |
|---|---|---|
| `spinal_blade_perfected` | Spinal Blade Back Pack (Perfected) | **Spinal Blade Pack** |
| `tribute_to_call_of_the_void` | Tribute to Call of the Void | **Tribute to the Call of the Void** |
| `tribute_to_exitare` | Tribute to Exitare | **Tribute to the Exitare** |

Les trois pages etaient au depot sous leur vrai titre. Les URLs reclamees
pointaient dans le vide — un 404 a chaque fois qu'on les suivait.

**La cause est un champ absent.** Ces trois composants n'avaient pas de `wiki`,
donc le titre de page etait DERIVE de leur nom. Le champ est pose, avec les
apiId que leurs pages donnent — 50060, 87627 et 90776, qu'aucun des trois ne
portait.

**Et un garde-fou, parce que la donnee seule ne suffit pas.** Le generateur ne
cherchait une capture que par le slug du titre demande. Il cherche desormais
aussi par le TITRE des pages indexees : une page presente sous un autre nom de
fichier ou un autre libelle est reconnue. Sans ce second index, le prochain
composant mal nomme repartirait en 404 sans que rien ne le dise.

File : **10 URLs**, contre 13.

## AJ — 24/09/2026 : la livraison cowork rejoint le depot

Quatre archives, dont deux redondantes : `gw2_X.zip` porte la livraison
complete (documents, index, captures) et `gw2_wiki_X.zip` les memes captures
seules. **Vingt-sept captures, toutes nouvelles** — aucune n'etait deja au
depot : les 23 feuilles `Recipe: Gift of <nom>`, `gift_of_the_sun`, `sun_bead`,
`commanders_compendium` et `catmanders_compendium`.

`ACHATS_UNIQUES.md` passe de la v1 du depot (65 lignes) a la v3 de la session
cowork (112 lignes). Les index et la file de captures de l'archive n'ont PAS
ete repris : ils ont ete regeneres ici par les outils du depot, plus recents.

### La correction que la session avait laissee non appliquee

`gift_of_the_sun` portait l'apiId **107030**, qui est le **Relic of Fog** :
la colonne « possede » de ce don lisait le stock d'un objet sans rapport. Sa
page, capturee le 24/09, n'annonce qu'un identifiant, **107136**. L'audit l'a
refuse des que la capture est entree au depot — c'etait le blocage decrit en fin
de la v3. Corrige.

La session avait raison de ne pas l'appliquer de son cote : elle changeait un
chiffre affiche. Elle avait la source qui tranche, elle l'a documentee, et la
correction s'applique ici en une ligne.

### Ce que la v3 etablit, et qui ne rentre pas encore dans l'arbre

- **Les 23 feuilles de recette a 10 po**, soit 230 po, payees une fois pour le
  compte. Le suffixe `__onetime` existe deja mais il est indexe sur une CIBLE :
  « une fois pour cette armure », pas « une fois pour le compte ». Il manque un
  etat par compte, du meme genre que « collection faite ».
- **Le Commander Tag a 250 Badge of Honor + 300 po**, sans alternative : le
  Catmander coute le meme prix, et la ligne a 150 po est une remise croisee qui
  exige de posseder deja l'autre compendium.
- **`gift_of_the_sun` n'a pas de feuille** : les deux pages `Recipe:` renvoient
  404. Les « 10 po » de la v1 venaient soit du « + 10 » de la ligne vendeur, qui
  est 10 ectoplasmes, soit du `Recipe: Gift of Light` un cran plus bas.

### Un point de coordination a surveiller

La session cowork a fait avancer les outils de son cote — le depot porte
`gw2_audit_v49`, `gw2_index_contenu_v5`, `gw2_pages_a_capturer_v6`. Les archives
ne contiennent aucun `.py` : seuls les documents et les captures voyagent. Les
deux cotes numerotent donc les memes fichiers sans se voir. Ici, j'ai relance
les versions du depot, pas celles de l'archive.

## AK — 24/09/2026 : un garde-fou de concurrence, et ce qu'il trouve du premier coup

Plusieurs conversations travaillent sur ce depot en parallele. Le 24/09, trois
commits d'une autre session se sont intercales entre deux passes de celle-ci,
en vingt minutes. Git protege du pire — un push non force est refuse quand
l'historique a avance — mais pas du travail ecrit entre-temps sur une base
perimee.

`gw2_garde_concurrence_v1.py` se lance deux fois, juste apres le clone et juste
avant le push. Il ne modifie rien et sort en 1 quand il faut s'arreter :

- **retard** : des commits sont arrives depuis le clone. Recloner et rejouer,
  jamais fusionner — un merge melerait deux lignees de versions.
- **divergence** : chaque cote a des commits propres. Recloner, jamais forcer.
- **collision de numerotation** : une famille versionnee est plus avancee en
  amont qu'ici.
- **doublon** : une famille porte plusieurs fichiers.

### Ce qu'il signale des le premier passage

Six familles portent deux fichiers a la fois. La plus grave :

| famille | versions | cite par |
|---|---|---|
| `gw2_parse_material_list` | **v3 et v4** | 6 fichiers / 5 fichiers |
| `gw2_confronte_tables` | v3 et v4 | 1 / 0 |
| `gw2_index_contenu` | v4 et v5 | 1 / 0 |
| `gw2_edges_wiki` | v11 et v12 | 0 / 0 |
| `gw2_integre_branche_arme` | v3 et v4 | 0 / 0 |
| `gw2_tessons_gen2` | v3 et v4 | 0 / 0 |

**Le parseur de tables vit en deux exemplaires, tous deux utilises.** Six outils
lisent la v3, cinq la v4. Or ces deux versions ne dedupliquent pas pareil : la
section S a montre que la v3 collapse les sous-items repetes d'une meme cellule
— ce qui donne 250 reactifs hydrocatalytiques pour le Gift of Research — tandis
que la piste v4, ouverte puis abandonnee ici le 18/09, les gardait et donnait
500. Deux outils du meme depot peuvent donc rendre deux nombres differents sur
la meme page.

**Rien n'est supprime.** Trancher demande de savoir laquelle des deux lignees
fait foi, et cette decision appartient a Antoine. Les quatre familles sans
aucun appelant sont du code mort des deux cotes ; les deux autres sont a
arbitrer.

## AL — 24/09/2026 : la v3 du parseur avait tort, et moi avec

Le garde-fou de concurrence avait trouve deux lignees du parseur de tables,
toutes deux utilisees. Verification faite, **c'est la v4 qui a raison** — celle
que j'avais ouverte puis abandonnee le 18/09 en section S.

### La difference

- **v3** : toute repetition d'un triplet (parent, enfant, quantite) est un
  doublon de lecture, et elle l'ecrase.
- **v4** : seule l'arete de tete est dedupliquee ; les sous-items d'une cellule
  sont gardes tels quels, meme repetes.

Sur 77 pages a table, elles ne divergent que sur trois familles de cas. Les
trois ont ete verifiees a la source, et les trois donnent raison a la v4.

**1. Gift of Research → reactif hydrocatalytique, sur 17 pages.** Sa page le
liste DEUX fois a 250 :

> Ingredients 250 Thermocatalytic Reagent **250 Hydrocatalytic Reagent
> 250 Hydrocatalytic Reagent** 250 Exotic Essence of Luck
> Notes: *The Hydrocatalytic Reagents cost a total of 2,500.*

2 500 pieces d'argent a 5 l'unite : **500 reactifs**, pas 250. La note de prix
tranche arithmetiquement.

Mon erreur du 18/09 : j'avais compte les occurrences de nombres dans le HTML
avec une expression reguliere grossiere, vu « trois 250 », conclu « trois
ingredients ». Je n'avais lu ni le texte rendu, qui liste le reactif deux fois,
ni la note de prix. Sur cette base j'ai annule le parseur v4 et ses sept
consommateurs. `hydrocatalytic_reagent → gift_of_research` passe de 250 a 500.

**2. Bloodstone Shard → 200 Spirit Shards, sur 12 pages gen2.** Ce n'est pas une
repetition du tout : l'eclat apparait sous DEUX parents differents —
`Gift of Maguuma Mastery` et `Gift of Desert Mastery` — chacun avec son propre
cout. Deux exigences distinctes que la v3 fusionnait en une.

**3. Gift of Metal → les quatre lingots, sur la page d'Eternity.** Eternity,
c'est Sunrise ET Twilight : chacune apporte son Gift of Metal. Le doublement est
juste, et `DOUBLES` traite deja cette page a part.

### Consolidation

La lignee v4 avait deja son jumeau pour chaque outil sauf un. `gw2_confronte_
totaux` passe en v8 et rejoint la v4 ; les sept fichiers de la lignee v3 sont
supprimes. **44 familles versionnees, une seule version chacune** — le garde-fou
ne signale plus rien.

### Deux surprises, non corrigees

- **`spirit_shards` n'existe pas comme composant.** Les 200 eclats spirituels par
  Bloodstone Shard ne sont nulle part dans l'arbre, alors que douze pages gen2 en
  demandent 400 chacune. Trou complet.
- **Les douze gen2 ne totalisent qu'UN Bloodstone Shard** alors que leur table en
  montre deux, un par don de maitrise. Et `gift_of_maguuma_mastery` n'est
  rattache qu'a quatre armes gen2, `gift_of_desert_mastery` a un seul don. La
  branche des maitrises gen2 est incomplete — a reprendre page par page, ce que
  je n'ai pas fait ici.

## AM — 24/09/2026 : les deux « surprises » de la section AL n'existent pas

Verification page par page des seize armes gen2. **Les deux trous annonces en
fin de section AL sont faux, et les deux viennent de mes propres recherches.**

### « Les douze gen2 ne totalisent qu'un Bloodstone Shard »

Elles en demandent bien un seul. Leur page porte **deux recettes**, pas deux
exigences :

| arme | recettes de la Forge mystique |
|---|---|
| Verdarach | Call of the Void + Gift of Verdarach + Mystic Tribute + **Gift of Maguuma Mastery** |
| — ou — | Call of the Void + Gift of Verdarach + Mystic Tribute + **Gift of Desert Mastery** |

Un don de maitrise **au choix**. La table agregee rend les deux branches, d'ou
les deux Bloodstone Shards que j'ai pris pour deux exigences. Les quatre armes
de Heart of Thorns — Astralaria, HOPE, Nevermore, Chuka and Champawat — n'ont
que la variante Maguuma, ce qui explique l'asymetrie que j'avais relevee.

Et c'est **deja modelise** : `alt_groups.gen2_mastery` porte les deux options,
les douze cibles concernees, et Maguuma par defaut. Rien a corriger.

### « `spirit_shards` n'existe pas comme composant »

Le composant s'appelle **`spirit_shard`**, au singulier. J'ai cherche le
pluriel, que la table du wiki affiche (`Spirit_Shards`), et conclu a un trou. Il
est chaine depuis toujours : 200 par Bloodstone Shard, 20 par Augur's Stone, et
les totaux affichent bien 200 eclats spirituels sur chaque arme gen2 et gen3.

### Ce que ca dit

Deux fausses alertes dans le meme message, et la meme cause : j'ai cherche un
nom que je supposais au lieu du nom qui existe. C'est exactement ce qui m'avait
fait reclamer `Ley_Line_Crystal` et `Banner_Pennon` alors qu'ils etaient au
depot, et declarer l'Olmakhan Bandolier introuvable.

**La regle a appliquer avant d'annoncer un trou** : chercher le composant par
son apiId ou par sous-chaine, jamais par le nom exact suppose. Un `in cc` qui
rend False n'est pas une preuve d'absence.

## AN — 24/09/2026 : les feuilles de recette, vues partout, comptees une fois

Les 23 feuilles `Recipe: Gift of <nom>` entrent dans la donnee. Chacune coute
10 po et se paie **une fois pour le compte** : la deuxieme arme qui demande le
meme don ne la repaie pas.

### La forme : aucun `qty`

Un composant `recipe_gift_of_*` de genre `account_unlock`, **sans la moindre
cle `qty`**. N'etant l'enfant d'aucune cible, il ne peut pas entrer dans un
total par legendaire. **Pas de duplication par precaution : par construction.**
Verifie — aucune feuille n'apparait dans les 116 composants du total de Vision.

C'etait le point dur. Les chainer naivement les aurait comptees autant de fois
qu'il y a de cibles, et huit d'entre elles servent a **52 legendaires**.

### La pertinence se deduit, elle ne s'ecrit pas

Chaque feuille porte `enseigne`, le don qu'elle debloque. Elle concerne une
legendaire si et seulement si ce don figure a son total. Aucune liste de cibles
a tenir a jour — la lecon des monnaies de carte, ou les listes ecrites a la main
avaient un angle mort sur Klobjarne.

Ce que ca donne, sans qu'une seule association ait ete ecrite :

| legendaire | feuilles | cout |
|---|---:|---:|
| `gen1_frostfang` | 2 — ice, metal | 20 po |
| `gen1_the_bifrost` | 2 — color, energy | 20 po |
| `gen3_aurenes_claw` | 8 — les dons condenses | 80 po |
| `vision` | 9 — + energy | 90 po |
| `orrax_manifested` | 9 — + darkness | 90 po |

Le partage mesure : huit feuilles pour 52 legendaires, `metal` pour 17, `wood`
pour 13, `energy` pour 9, `darkness` et `entertainment` pour 2, et dix feuilles
pour une seule arme chacune.

### L'affichage

Une section dediee en bas de l'onglet Composants, qui ne liste que les feuilles
utiles a la cible affichee, avec le reste a payer. L'etat est **par compte**,
persiste sous `gw2_feuilles_acquises` : cocher une feuille la montre cochee sur
les 52 armes concernees, et le compte ne la retire qu'une fois.

Le prix vient de la table « Acquisition » de chaque page — `data-sort-value`
100000 cuivre, identique sur les 23. **Ne pas lire l'infobox** : elle donne la
valeur de revente, 1 po 25 s sur 22 des 23.

### Ce qui reste

Le Commander Tag — 250 Badge of Honor + 300 po, prerequis de
`commanders_wings_of_war` — n'est pas pose. Meme forme a prevoir, mais il n'est
rattache a aucun don : sa pertinence ne se deduit pas, elle se declare.

## AO — 24/09/2026 : le compendium de commandant n'est pas un cas a part

J'avais ecrit en fin de section AN que le Commander Tag demanderait un autre
traitement, « parce qu'il n'est rattache a aucun don : sa pertinence ne se
deduit pas, elle se declare ». **C'est faux, et l'erreur est dans ma lecture de
mon propre champ.**

`enseigne` ne veut pas dire « le don que la feuille apprend ». Il veut dire
**« le composant que ce deblocage rend accessible »**. Le compendium debloque
les `Commander's Wings of War`, qui remontent a `warcry`, qui remonte a
`warbringer`. La pertinence se deduit donc exactement comme pour les feuilles,
sans rien declarer — et le moteur confirme : le tag ne s'affiche que sur
Warbringer, sur les 81 cibles.

Aucun mecanisme nouveau. Un `account_unlock` de plus, 300 po, `enseigne`
pointant sur les Wings.

### Une seule addition : le prix en monnaie

Le compendium coute **250 insignes d'honneur EN PLUS de ses 300 po**.
`prix_monnaie` rejoint `prix_cuivre` — meme nature, ce que coute le deblocage,
une fois. La section affiche la ligne « + 250 Insigne d'honneur » sous le prix
en or, et reste vide pour les 23 feuilles qui n'ont pas de monnaie.

La section s'appelle desormais **« Achats uniques par compte »** et non plus
« Feuilles de recette » : elle n'est plus reservee a une famille.

### Verification

| legendaire | achats uniques |
|---|---|
| `warbringer` | compendium — 300 po + 250 insignes |
| `gen1_frostfang` | ice, metal — 20 po |
| `vision` | les huit dons condenses + energy — 90 po |

Et la propriete qui compte : **aucun de ces composants n'apparait dans un total
par legendaire**. Verifie sur Warbringer apres ajout.

### Ce que ca m'apprend

J'ai invente une difficulte en relisant mon propre champ a travers l'exemple
qui l'avait fait naitre. Les 23 premiers `account_unlock` etaient des feuilles
enseignant un don, donc j'ai lu `enseigne` comme « le don » au lieu de « ce que
ca debloque » — et conclu a un cas particulier la ou il n'y avait qu'une
instance de plus. Quand un champ semble ne pas couvrir un cas, relire sa
definition avant de conclure.

## AP — 24/09/2026 : la regle etait juste, l'affichage ne l'ecoutait pas

Antoine a termine les six armes Astral et lisait toujours « Kralkatite Ore,
requis 3 100 » dans l'onglet Composants de Vision. Le moteur, lui, disait 100.
**Deux defauts empiles, aucun dans la regle elle-meme.**

### 1. Le requis etait ecrit a la main

Le bloc `currencies` d'un legendaire portait ses `required` en dur — 3 100 pour
le minerai de kralkatite. La regle « une etape validee satisfait son composant »
n'avait aucun moyen de les atteindre : le grand total obeissait, la colonne par
legendaire non.

Les deux valeurs etaient pourtant **deja prouvees egales** a collections
vierges : c'est exactement ce que `check_qty_vs_jsx` verifie a chaque audit. Le
nombre ecrit a la main ne servait donc qu'a figer un etat. Il vient desormais du
moteur, via un index `apiId → composant`, comme le groupe d'armes depuis le
22/09.

### 2. Les collections de Vision n'arrivaient pas au moteur

La progression vit dans **deux** etats : `auroraCollections`
(`gw2_aurora_collections`) pour la plupart des cibles, `visionCollections`
(`gw2_vision_collections`) pour l'onglet Vision, qui a son rendu propre. Le
moteur ne lisait que le premier.

Cocher « Vision of Equipment: Astral Weapons » n'avait donc aucun effet, meme
apres le premier correctif. Les deux espaces de cles sont disjoints — celles de
Vision sont en `vis_*` — donc la fusion est sans ambiguite. `legTotals` et le
groupe d'armes lisent maintenant les deux.

### Ce que ca dit du 18/09

La regle posee ce jour-la etait correcte, et le test de conformite la couvrait
des deux cotes. Mais il compare **moteur contre moteur** : il ne pouvait pas
voir qu'un troisieme chemin — le bloc `currencies` ecrit a la main — ignorait
les deux. Un test qui compare deux implementations ne dit rien d'une valeur qui
n'en traverse aucune.

### Reste : cocher les feuilles automatiquement

Les 23 feuilles ne se cochent pas toutes seules. La capture ne porte que
l'identifiant d'OBJET de la feuille (75645 pour Gift of Blood), pas celui de la
RECETTE, et `/v2/account/recipes` rend des identifiants de recettes. Le pont
existe cote API : `/v2/recipes/search?output=<id du don>` donne la recette qui
produit ce don, qu'on confronte ensuite aux recettes debloquees du compte.
Aucune donnee nouvelle a saisir — mais une requete de plus par feuille, et une
gestion d'echec reseau. Non fait ici.

## AQ — 24/09/2026 : les feuilles se cochent toutes seules

Le pont manquait entre deux espaces d'identifiants. La capture d'une feuille ne
porte que celui de l'**objet** — 75645 pour Recipe: Gift of Blood — alors que
`/v2/account/recipes` rend des identifiants de **recettes**. Les deux ne se
croisent jamais. C'est le meme motif que le Jeton de fournisseur en section O :
deux identifiants justes, du meme objet, dans deux espaces differents.

`/v2/recipes/search?output=<id du don>` fait la jonction : il rend les recettes
qui produisent ce don, qu'on confronte aux recettes debloquees du compte. La
correspondance est statique, donc mise en cache sous `gw2_recette_par_don` —
une requete par don, jamais rejouee.

Verifie avant d'ecrire : la page d'une feuille annonce « Recipe sheet,
Disciplines 400 ». C'est une recette d'artisanat, donc presente dans l'API.

**Limite connue et voulue** : les recettes de la Forge mystique ne sont PAS dans
l'API. Une recherche vide laisse la case en manuel, ce qui est le bon
comportement — le compendium de commandant, qui n'est pas une recette, reste
coche a la main.

La detection l'emporte, sauf si la case a ete cochee a la main : `acquises[cid]
?? auto`. Sans cle API — chez qui passe par Flask — tout reste manuel comme
avant.

## AR — 25/09/2026 : « Item type: Service », ou lire zero a vie

Antoine : « je suis certain de n'avoir jamais eu de Airship Part dans mon
inventaire ». Il avait raison, et ma regle etait fausse.

Ces pages portent bien un identifiant d'objet — 74494 pour Airship Part — mais
elles disent aussi **« Item type: Service »** et **« Takes effect immediately
upon receipt »**. L'objet se convertit a la reception : il ne sejourne JAMAIS en
inventaire. Le stock vit au portefeuille, sous un identifiant de MONNAIE.

Ma regle « l'apiId de la page fait foi » confondait deux choses : **l'identifiant
d'une page designe SON SUJET, pas l'endroit ou le stock se trouve.**

Cinq composants etaient dans ce cas :

| composant | lu | reel |
|---|---:|---:|
| `airship_part` | 74494 | **19** |
| `lump_of_aurillium` | 75012 | **22** |
| `provisioner_token` | 88926 | **29** |
| `ancient_coin` | 100477 | **66** |
| `unusual_coin` | 96046 | **62** |

`ancient_coin` est le plus couteux : il cachait les **20 250 de Klobjarne Geirr**
et les **50 000 d'Orrax Manifested**, les deux plus gros nombres du depot,
affiches a zero possede quoi qu'il arrive.

Deux autres pages de type Service portaient deja le bon identifiant —
`magnetite_shard` 28 et `research_note` 61 — ce qui explique que le defaut soit
passe inapercu : il n'etait pas systematique.

### Ce que ca dit de la section O

Le 17/09 j'avais decouvert que le Jeton de fournisseur portait 88926 cote
sources et 29 cote JSX. J'ai conclu « deux identifiants justes, du meme objet,
dans deux espaces differents » et **construit un pont par le nom** dans l'audit
pour accommoder les deux. C'etait traiter le symptome : un seul des deux lisait
le stock, et ce n'etait pas celui des sources. Le pont reste utile — le JSX
declare bien des monnaies — mais la donnee porte desormais le bon identifiant.

`apiId_objet` conserve celui de la page pour que le lien reste tracable.

### Le garde-fou

`check_service_vers_portefeuille` croise trois choses : la page dit « Item type
Service », le nom correspond a une monnaie du referentiel, et l'apiId n'est pas
celui de cette monnaie. Bloquant. Teste en remettant 74494 : il crie.

Et `check_api_id_contre_capture` sait desormais lire `apiId_objet` au lieu de
crier sur une divergence voulue.

### Reste : le compendium de commandant

Il ne se coche pas tout seul, et c'est attendu — ce n'est pas une recette, donc
`/v2/recipes/search` rend vide. Mais une meilleure voie existe : **`/v2/account`
rend un booleen `commander`**, vrai des qu'un tag est achete. Scope `account`,
que la cle d'Antoine porte deja. Non fait ici.

## AS — 25/09/2026 : les liens wiki n'etaient pas casses, ils n'etaient jamais branches

Antoine : « soit je n'ai pas compris comment tu l'as implemente, soit c'est
casse ». Ni l'un ni l'autre : **ils n'apparaissaient que sur Aurora.**

`NomEtape`, pose le 18/09, servait les TROIS rendus qui lisent leurs etapes
dans `SOURCES_DB` — les deux collections d'Aurora et un bloc voisin. Or le rendu
GENERIQUE, celui de Vision et de toutes les autres cibles, construit ses
libelles depuis la **definition de succes de l'API** : il n'a pas d'objet
`item`, donc pas de champ `wiki`. J'avais verifie que les trois occurrences de
`{NX(item.name)}` etaient couvertes, et conclu que tous les rendus l'etaient.
Elles l'etaient ; il existait un quatrieme chemin qui n'affiche pas
`item.name` du tout.

Les 2 399 liens etaient donc invisibles partout sauf sur une cible.

`WIKI_PAR_BIT` fait la jonction : une table batie une fois,
**(id de succes, numero de case) → page**, que le rendu generique interroge avec
`a.achievementId` et l'indice de la case. Le lien s'affiche desormais sur
toutes les cibles.

Deux corrections au passage :

- `LienWiki` remplace le `<a>` ecrit deux fois. Il porte un
  `stopPropagation` : dans les rendus ou la ligne est cliquable, cliquer le nom
  cochait l'etape au lieu d'ouvrir le wiki.
- Une page absente laisse le libelle tel quel, sans lien mort.

### Le tag de commandant se coche tout seul

`/v2/recipes/search` rend vide pour lui — ce n'est pas une recette — donc la
detection des feuilles ne pouvait pas l'atteindre. **`/v2/account` porte un
booleen `commander`**, vrai des qu'un tag est achete, sous le scope `account`.

Pose des DEUX cotes le meme jour, comme l'exige ROUTES.md : Flask v41 rend
`_commander`, la synchro directe aussi, et `null` quand l'appel echoue — une
porte inconnue n'est pas une porte fermee. Le controle de symetrie valide.

## AT — 25/09/2026 : les liens marchaient, ce sont les noms qui manquaient

Non, les liens ne demandent aucun serveur : `WIKI_PAR_BIT` est batie depuis
`SOURCES_DB`, embarque dans le HTML. Et la capture d'Antoine le montre — les
sept etapes de Chef-Tonnerre sont bien **soulignees, donc cliquables**.

Le probleme est ailleurs : elles s'appellent « STEP 1 » a « STEP 7 ». Un lien
dont le libelle ne dit rien ne ressemble pas a un lien vers quelque chose.

Le rendu generique tire ses libelles de la definition de succes de l'API. Quand
elle n'en donne pas — cas des collections de Vision — il retombait sur
`t("bits_step")`, alors que **nos sources portent le vrai nom de chaque case** :
« Vision of Equipment: Dragonsblood Weapons », « Vision of Allies: Caithe »…
Les noms etaient la, personne ne les lisait.

`NOM_PAR_BIT`, batie dans la meme passe que `WIKI_PAR_BIT`, est interrogee
juste avant le repli. Les sept « STEP n » redeviennent des noms.

La seconde capture montre le comportement attendu ailleurs : la meta « All or
Nothing » affiche de vrais noms **sans lien**, parce que `vis_ep_allornothing`
n'a aucun `items` dans les sources. Pas de page, pas de lien — comme voulu.

## AT — 25/09/2026 : les liens wiki des metas ne passaient pas par WIKI_PAR_BIT

Les cinq `vis_ep_*` de Vision ont leur capture au depot et zero `items`. Le
reflexe etait d'alimenter `WIKI_PAR_BIT` / `NOM_PAR_BIT`, qui couvrent deja
2 399 etapes. **Ces deux tables ne pouvaient pas servir ici** : elles sont
indexees par `(id de succes, numero de case)`, et l'API n'expose aucun bit pour
ces metas — le rendu prend la branche `def.subs`, jamais la branche `def.bits`.
Les y ecrire aurait construit une table que personne n'interroge.

La liste d'objectifs vit dans `meta_eligible`, en couples `[id, nom]`. La page
est une donnee de meme nature que le nom, pour le meme objectif : elle rejoint
la meme ligne, qui devient `[id, nom, page]`. Rien a resynchroniser, pas de
seconde liste.

**Indexe par id de succes enfant, jamais par nom.** La capture du meta pointe
chaque objectif par une ancre `/wiki/PAGE#achievementNNNN` ou NNNN est l'id :
l'appariement est exact par construction. Un appariement par nom aurait casse au
premier renommage wiki, et `Domain of Kourna Griffon Expert: Gold` et `: Silver`
partagent deja leur page.

`gw2_meta_pages_v1.py` : 367 pages posees sur 586 objectifs, 11 metas sur 20
couvertes a 100 %, zero nom divergent. Le nom n'est jamais reecrit — une
divergence se signale et laisse la source en place.

Transversal verifie, pas seulement l'affichage :
- `ACH_DEFS_SCHEMA` 18 -> 19 : la forme de `out` change, sans quoi le cache
  localStorage aurait resservi des subs sans page.
- Le scoring (volume / prerequis / AP) enrichit les subs par spread : `wiki`
  survit.
- Les DEUX rendus qui affichent des subs sont branches — le generique (Vision)
  et celui des masteries d'Aurora. La branche `bits` des masteries recoit sa
  page depuis `WIKI_PAR_BIT`, la ou cette table a un sens.
- Audit v51 : le triplet est accepte, la page doit etre une chaine non vide et
  sans espace. L'absence de 3e element reste valide (capture sans ancre).

## AU — 25/09/2026 : trois lectures, dont une ou le wiki avait raison deux fois

### 1. Le meta 3516 cherchait une page qui n'existe pas

`gw2_meta_pages_v1.py` derive le nom de la capture du champ `source`. Celui du
meta « One Path Ends » disait `wiki:One_Path_Ends_Mastery` — un titre qui
redirige. La capture, nommee d'apres le titre ATTEINT comme le veut la
convention du depot, s'appelle `one_path_ends_achievements.html` : le script
declarait « capture manquante » alors que la page etait la.

Corrige dans la table, pas dans une capture : `source` devient
`wiki:One_Path_Ends_(achievements)`. Un titre stocke doit etre celui d'arrivee,
jamais celui de depart — une redirection est un alias, pas une adresse.

### 2. Icy / Mystic Runestone : ni cycle faux, ni « Currency for » a l'envers

La piste etait la section « Currency for » lue dans le mauvais sens. Elle ne
tient pas : `gw2_parse_vendor_cost_v1.py` borne deja son scan au premier H2
apres `Acquisition`, precisement pour ca (cf. emblem_of_the_avenger).

Les deux echanges sont REELS et tous deux dans les tables d'acquisition. Rojan
the Penitent vend l'Icy Runestone **1 or OU 1 Mystic Runestone**. Miyani, le
prepose et le gardien de la Forge vendent le Mystic Runestone **1 or OU
1 Icy Runestone**. Le wiki ne se contredit pas : il decrit une conversion a
double sens, chaque item ayant par ailleurs son propre prix en or.

Notre lecture, elle, etait fausse : les lignes payees en or sont filtrees
(`HORS_ARBRE`), donc un achat qui a une alternative en or ressemble a un achat
a prix unique — et son prix en objet devient une EXIGENCE. `gw2_edges_wiki_v12`
proposait bien l'arete `mystic_runestone -> icy_runestone`, ce qui aurait fait
dependre de l'Icy Runestone les cent Mystic Runestones de chaque don gen2.

`gw2_edges_wiki_v13.py` ajoute la garde `achat_au_choix()`, de meme nature que
les deux voisines (`autre_voie`, `_voies_multiples`) : si la table d'acquisition
melange des lignes chiffrees en objet et des lignes chiffrees en or, le prix en
objet est une option, pas une exigence. Dix pages melangent les deux formes,
huit tombaient deja sous les gardes existantes ; **deux restaient**,
`mystic_runestone` et `philosophers_stone`. 1 066 aretes -> 1 065, une seule
retiree : le cycle.

### 3. Le nom en capitales de titre n'est pas une divergence

`Broodmother Down By The Bay` au wiki, `Broodmother Down by the Bay` a l'API.
L'appariement se fait sur l'id de l'ancre, le nom stocke reste celui du
referentiel API — seul a faire foi pour un nom de succes.
`gw2_meta_pages_v2.py` compare desormais casse et espaces normalises, signale
ces cas a part, et garde le refus strict pour une vraie divergence.

### Resultat

Pages posees 367 -> **550 sur 586**. Les 36 restantes sont Year of the Ascension
II a IV, dont les captures n'ont pas d'ancre par succes (mise en page
differente) — a reprendre si la page change de forme.

Sept apiId poses depuis les captures (ancient_wood_pulp 74681, jug_of_water
12156, olmakhan_charm 87150, olmakhan_latigo_strap 87153,
superior_rune_of_holding 13009, supreme_rune_of_holding 83410,
valkyrie_bearkin_war_helm 103257). Avertissements 59 -> 53, file de capture a
**0 URL**.

### Reste a trancher

La capture `gift_of_the_desert` apporte une recette — les quatre dons regionaux
(Oasis, Highlands, Riverlands, Desolation), 1 chacun. Trois ne sont pas des
composants, donc l'arete proposee est partielle : `gift_of_the_desert ->
gift_of_the_desolation` seul, ce qui serait pire que rien. Les creer decomposera
un achat aujourd'hui decrit par un `tip` karma (~23 331 par sous-don). Decision
de modelisation, non prise ici.

## AV — 25/09/2026 : le Gift of the Desert decompose, et une periode qui manquait

J'avais pose la question au lieu de faire le travail. Antoine : « je ne comprends
pas le blocage ? Je me serais attendu a "donne-moi les pages des sous-gift pour
que je lise et integre les couts" ». Il a raison : un composant qu'on decouvre a
l'analyse change les couts, c'est le principe meme de l'analyse.

### Les quatre sous-dons

`Gift of the Desert` n'est pas un achat, c'est une Forge mystique : 1 Oasis +
1 Highlands + 1 Riverlands + 1 Desolation. Trois n'existaient pas en composants,
le quatrieme (`gift_of_the_desolation`) etait rattache directement a
`gen2_the_binding_of_ipos` — un raccourci : la recette d'Ipos ne le cite pas,
elle passe par `Gift of Desert Mastery`, donc par le Gift of the Desert.

Pire, sa source disait « Forge mystique, composants de la Desolation » alors que
sa propre capture au depot dit : Kisha Odili, The Bonestrand, 23 331 karma,
completion de carte requise, 1 par personnage. Corrige.

Les quatre, tous identiques dans leur forme : 23 331 karma chez un vendeur de
coeur, completion de la carte exigee, **coeur a refaire le jour de l'achat**,
un seul par personnage. Highlands a deux vendeurs (Melilla, Stampede Uplands ;
Tendaji, Diviner's Reach) pour un seul achat.

### Le total ne bouge pas d'un karma

`karma.qty` portait `gift_of_the_desert: 93 324` — un bloc pose sur le don final.
Il se repartit en quatre fois 23 331, sur les sous-dons qui le paient vraiment.
**93 324 des deux cotes** : la decomposition n'ajoute pas de cout, elle dit ou il
se paie. Ce qu'elle ajoute, c'est ce qu'on ne voyait pas : quatre completions de
carte et quatre coeurs.

### Une periode manquait : `character`

L'audit a bloque, a raison : « Limite 1 » ecrit en prose sans cadence
structuree. Mais aucune des trois periodes (`day`, `week`, `season`) ne dit
« une fois par personnage, definitivement ». Le drapeau `per_character` existait
deja, il CORRIGE une cadence, il n'en tient pas lieu.

JSX v226 ajoute `period: "character"` :
- la cle de case devient `once` — sans elle le plafond tombait dans le seau
  `season` et la case se serait decochee a la saison suivante, alors qu'un achat
  unique ne se refait jamais ;
- la projection l'ignore par une branche EXPLICITE (aucun debit), pas par chute
  silencieuse ;
- i18n des deux cotes.

Audit v52 refuse desormais toute `period` hors des quatre que le JSX sait lire :
une periode inconnue se diluait en zero sans rien dire.

### File de capture

Remonte a 3 URLs — les trois sous-dons, qui n'ont pas de capture et donc pas
d'apiId. Les valeurs ci-dessus sont lues sur le wiki en ligne le 25/09 ; la
capture reste a faire pour l'apiId (lecture de stock) et pour que les parseurs
travaillent sur la source du depot.

## AW — 25/09/2026 : les trois captures confirment la lecture en ligne

Les trois sous-dons sont au depot. Confrontation avec ce qui avait ete lu sur le
wiki en ligne le meme jour : **aucun ecart**. 23 331 karma, completion de carte,
1 par personnage, et les memes vendeurs — Melilla et Tendaji pour Highlands,
Follower Xunn pour Riverlands.

Un seul apport : la lecture en ligne masquait le vendeur de l'Oasis derriere une
image, la capture le nomme — **Priestess Karima** (Amnoon Farms). Et les trois
apiId, que seule la capture porte : Oasis 85961, Highlands 86018, Riverlands
86241. Le stock des trois est desormais lisible.

Les `ref` passent de « lecture en ligne » a « captures Antoine 25/09/2026 » : la
source citee est celle du depot, pas une page consultee une fois.

File de capture a **0 URL**, sections 0 a 3 bis toutes a zero.

## AX — 25/09/2026 : la section 4 reclamait des captures deja lues

`gw2_pages_a_capturer_v6.py` declarait « sans etapes » toute collection dont
`items` est vide. Or une collection `metaSubs` ne porte PAS ses etapes dans
`items` : elles vivent dans `meta_eligible`, indexees par l'id du meta, parce
que l'API n'expose ni bits ni liste d'enfants pour ces succes (cf. AT).

Resultat : 14 des 31 lignes reclamaient une lecture pour des pages deja
capturees, deja posees — 550 objectifs avec leur page wiki — et deja rendues
dans l'appli. Les quatre « Path of the Ascension » disparaissent entierement de
la liste, les dix autres ne gardent que leur vrai manque.

`gw2_pages_a_capturer_v7.py` : une collection est « sans etapes » seulement si
`items` est vide ET que son id n'est pas un meta a objectifs. **31 -> 27
lignes.**

### Ce que les 27 restantes ont en commun

Toutes manquent d'`unlock`, et seulement d'`unlock`. Mais la lecture des
captures montre que ce manque n'est pas toujours reel non plus. Les six
`Incursive Investigation` d'Eikasia sont des compteurs : « gagner 150 poussieres
fractalines », « 300 », etc. Aucun PNJ declencheur, aucun objet de deblocage,
aucun prerequis — le modele Ad Infinitum (`prerequisite` / `unlock_item` /
`reward`) n'a rien a decrire la.

Il manque donc une facon d'ecrire « ce succes ne se debloque pas », distincte de
« on n'a pas encore lu ». Sans elle, la section 4 restera peuplee de lignes que
personne ne peut fermer. A trancher avant de capturer quoi que ce soit pour
elles.

## AY — 25/09/2026 : `unlock_none_ref`, ou comment ecrire une absence sans l'inventer

La section 4 reclamait un bloc `unlock` pour 27 collections. Le modele Ad
Infinitum — `prerequisite` / `unlock_item` / `reward` — n'a rien a y decrire
pour beaucoup d'entre elles : les six `Incursive Investigation` sont des
compteurs (« gagner 150 poussieres fractalines », puis 300), les masteries sont
le meta de leur categorie, `Legendary Rune Collector` demande de lier 7 runes.
Rien ne les debloque.

Sans facon d'ecrire cette absence, la file gardait des lignes que personne ne
pouvait fermer, et la seule sortie etait d'inventer un bloc vide. Mais une
absence affirmee sans preuve vaut l'invention qu'elle remplace : le drapeau
porte donc la capture qui l'etablit, et l'audit verifie qu'elle est au depot.
Meme marche que `cadence_ref`.

- `unlock_none_ref: "wiki:<Titre>"` sur la collection ;
- audit v53 : forme `wiki:Titre`, capture presente au depot, et interdiction de
  porter `unlock` ET `unlock_none_ref` — l'un dit comment ca se debloque,
  l'autre que ca ne se debloque pas. Teste en negatif : un titre bidon echoue ;
- `gw2_pages_a_capturer_v8.py` compte la ligne comme fermee.

**20 collections flaguees, 3 vrais `unlock` poses.** Les trois Lasting Bonds
avaient bien une chaine, lisible dans leurs captures : `Where We Come From`
exige le chapitre « The Charge » et rend la Handwoven Olmakhan Bandolier ;
`What We Do Here` rend la Pocketed ; `What Comes Next` rend la Reinforced. Pour
ces deux dernieres, seule la recompense est ecrite : le bandoulier precedent
ouvre visiblement la suivante, mais la capture ne le DIT pas, donc on ne
l'ecrit pas.

Section 4 : **27 -> 11**.

### La meme question se repose pour `items`

Sur les 11 restantes, 7 sont marquees « sans etapes » et sont exactement les
memes compteurs : un objectif numerique unique, aucune etape a lister. C'est le
symetrique exact de ce qui vient d'etre regle, et le meme drapeau resoudrait le
reste de la liste. Forme non tranchee : second champ (`items_none_ref`) ou un
drapeau unique couvrant les deux absences.

## AZ — 25/09/2026 : `absences_ref` — un drapeau, deux faits

J'avais propose « un drapeau unique couvrant les deux absences ». En
l'implementant : **faux**. Les treize masteries n'ont pas de deblocage ET ont
des etapes — elles vivent dans `meta_eligible`. Un drapeau unique les aurait
declarees sans etapes alors qu'elles en portent 550 a elles toutes.

Donc un seul mecanisme, deux faits nommes separement :

```json
"absences_ref": {
  "unlock": "wiki:Incursive_Investigation",
  "items":  "wiki:Incursive_Investigation"
}
```

`unlock_none_ref` (pose une heure plus tot) est migre et supprime : deux champs
pour la meme idee, c'est exactement la table parallele qu'on s'interdit.

Audit v54 verifie, pour chaque absence declaree : la cle est dans
`{unlock, items}`, la valeur a la forme `wiki:Titre`, la capture est au depot,
et l'entite ne porte pas ce qu'elle nie — `unlock` avec `absences_ref.unlock`,
ou dix etapes avec `absences_ref.items`. Teste en negatif sur les trois cas.

Les sept `items` absents sont des compteurs a objectif unique, verifies un par
un dans leur capture : « gagner 150 poussieres fractalines » (puis 300, puis
Infinite), « decouvrir les Agony-Torn Gloves », « lier 7 runes legendaires »,
« lier 8 cachets legendaires ». Aucun n'a de liste a afficher.

**Section 4 : 11 -> 4.** Les quatre restants sont de vrais trous, pas des
artefacts de lecture : `Helping Hylek: Kill Krait`, `Legendary Backpack and
Glider: Orrax`, `Return to Living World`, `Legendary Weapon: Eternity`.

## BA — 25/09/2026 : la liste ne demandait rien, et renvoyait ou il n'y a rien

Deux defauts dans la section 4, invisibles tant qu'elle etait pleine de faux
manques :

**Elle ne demandait aucune capture.** L'en-tete disait « RIEN À CAPTURER » et
citait en exemple « Incursive Investigation: Infinite Recursion » et « Helping
Hylek: Kill Krait » comme des succes sans article a eux. C'etait vrai quand la
liste comptait 31 lignes dont la plupart n'en avaient effectivement pas. Une
fois les faux manques regles, les lignes restantes SONT de vraies pages a
capturer — et la section les gardait hors de la liste d'URLs.

**Elle renvoyait a la page du legendaire, sans verifier.** Les trois derniers
trous pointaient `Endless Summer`, `Orrax Manifested` et `Prismatic Champion's
Regalia`. Aucune des trois captures ne contient le bloc du succes concerne. Un
renvoi qu'on ne peut pas suivre vaut une ligne vide.

`gw2_pages_a_capturer_v10.py` indexe les ancres `#achievementNNNN` de tout le
depot et nomme la capture qui porte VRAIMENT le bloc. Ce que ca revele
aussitot : `Return to Living World` etait lisible depuis le debut, dans
`living_world_return.html`. Les lignes sans bloc au depot passent en URLs.

Deux absences posees, prouvees par leur capture : `Legendary Weapon: Eternity`
(7250) est une collection de quatre objets sans chaine de deblocage, et le
succes 5790 est un evenement courant « disponible en permanence une fois
introduit ».

**Section 4 : 4 -> 3, dont 2 a capturer.**

### Deux choses vues sur le succes 5790, non tranchees

Les sources l'appellent `Return to Living World`. Le wiki nomme le succes 5790
**« Seasons of the Dragons »**, categorie Current Events, titre « Returning
Champion ». Le nom stocke est a reprendre sur le referentiel.

Ses etapes existent et sont extractibles : la capture ancre 23 succes enfants
`Return to ...`, exactement la forme de `meta_eligible`. Mais le texte dit
« completer les 24 meta-succes Return » — il en manque donc un a l'appel. On ne
pose pas une liste dont on sait qu'elle est incomplete.

## BB — 25/09/2026 : une absence d'ancre n'est pas une absence de contenu

Le correctif precedent est alle un cran trop loin. v10 ne cherchait qu'une
chose, l'ancre `id="achievementNNNN"` qui marque le bloc, et concluait « a
capturer » des qu'elle manquait. Deux lignes ont bascule dans les URLs pour
rien : **les deux pages renvoient 404**, et leur contenu etait au depot depuis
le debut. L'ancien en-tete « RIEN À CAPTURER » avait le bon argument — ce ne
sont pas des articles, ce sont des LIGNES d'une collection — et v10 l'a perdu
en meme temps qu'il corrigeait le vrai defaut.

`gw2_pages_a_capturer_v11.py` cherche trois formes, de la plus sure a la plus
faible, et dit laquelle a repondu :

| mode | ce qu'on a trouve |
|---|---|
| `bloc` | `id="achievementNNNN"` — le bloc lui-meme |
| `cité` | `href=...#achievementNNNN` — la page le cite avec son identifiant |
| `nommé` | son titre exact, sans ancre |

`Helping Hylek: Kill Krait` etait `cité` dans `radiance_of_the_sun_god.html` —
v10 ratait cette forme alors que l'identifiant y figure noir sur blanc.
`Legendary Backpack and Glider: Orrax` est `nommé` dans `orrax_manifested.html`,
sans ancre, comme Year of the Ascension II a IV.

Une ligne sans aucune des trois traces n'est plus envoyee en URLs : elle part
dans un encadre qui demande de VERIFIER que la page existe avant d'en reclamer
la capture. Un titre de ligne de collection n'est pas une URL.

Les deux lectures posees dans la foulee, depuis les captures existantes :
- 9180 : « Defeat krait at Nonmoa Lake », objectif unique avec son waypoint,
  aucune chaine de deblocage — `absences_ref` sur les deux ;
- 8714 : la page le dit en toutes lettres, il faut d'abord finir le
  pre-succes « Salvation's Cost », le chapitre d'histoire du 3 juin 2025.
  C'est un vrai `unlock`, avec son prerequis.

**Section 4 : 3 -> 1**, et 0 URL. Le dernier est le succes 5790, dont les
etapes attendent le 24e meta-succes Return manquant a l'appel.

## BC — 25/09/2026 : le 24e bit de Prismatic, et la section 4 a zero

Antoine se souvenait bien : **le 24e bit n'est pas un succes « Return to »**.
`_meta.direct_sync.prismatic.bit_map` le dit depuis le debut —

```
[22, 5861, "Return to the Dragonstorm"]
[23, null, "Return to Champions"]
```

Bit 23 n'a pas d'identifiant de succes parce qu'il n'en a pas : « Return to
Champions » est la COLLECTION qui heberge les autres, pas un succes de plus.
C'est pour ca que la capture n'ancre que 23 enfants alors que le texte en
annonce 24, et le JSX le sait deja : sans `achId`, il lit le bit brut du compte
(`bits.includes(bit)`) au lieu d'interroger un succes.

Il ne manquait donc rien a chercher. Ce qui manquait, c'est que la file le
sache.

### Les etapes de Prismatic vivent dans `bit_map`

Comme celles des metaSubs vivent dans `meta_eligible`. `bit_map` est la table
que lit la synchro du compte : recopier ses 24 noms dans `items` creerait deux
listes a tenir en phase pour un seul fait — exactement la table parallele qu'on
s'interdit. `gw2_pages_a_capturer_v12.py` reconnait les deux hebergements.

**Section 4 : 1 -> 0.** Les cinq sections de la file sont a zero.

### Un ecart a trancher, non corrige

`bit_map` donne `[9, 5748, "Return to Siren's Landing"]`. La capture
`living_world_return.html` ancre ce meme nom sur **9991**, sur la page
`Return_to_One_Path_Ends`. L'un des deux identifiants est perime.

Non corrige ici : `bit_map` pilote la lecture du compte, et changer un id
change une progression affichee. Le repli du JSX (bit brut) masque l'erreur si
5748 ne repond pas, ce qui rend l'ecart invisible a l'usage — mais fausse le
detail « x/y » de cette ligne. A confirmer sur le compte d'Antoine, qui
tranchera mieux que le wiki : si 5748 ne renvoie rien alors que la ligne est
faite, c'est 9991.

## BD — 25/09/2026 : le bit_map confronte au wiki, et une regle pour qu'il y reste

Regle d'Antoine, tranchee : **si une source wiki donne un identifiant, c'est le
bon.** Les 24 bits de `bit_map` sont donc confrontes aux ancres
`#achievementNNNN` des captures. Resultat : 21 exacts, 1 ecart, 2 noms a
reprendre, 1 bit legitimement sans identifiant.

- bit 9 « Return to Siren's Landing » : **5748 -> 9991**. `bit_map` vient de
  l'ancien serveur Flask, pas d'une lecture du wiki, et il avait derive.
  L'erreur etait invisible a l'usage — sans reponse de l'API, le JSX se replie
  sur le bit brut du compte — mais faussait le detail « x/y » de la ligne.
- bit 11 : « Return to the Sandswept Isles » -> « Return to Sandswept Isles » ;
  bit 19 : « Return to the Eye of the North » -> « Return to Eye of the
  North ». Le wiki fait autorite sur le nom comme sur l'identifiant.
- bit 23 reste `null` : « Return to Champions » est la collection, pas un
  succes (cf. BC). La regle ne confronte pas un bit sans identifiant.

Ce que la confrontation revele en passant : la page d'un « Return to » porte le
nom de l'EPISODE, pas de la carte. `Return to Siren's Landing` vit sur
`Return_to_One_Path_Ends`, `Return to Sandswept Isles` sur
`Return_to_A_Bug_in_the_System`. Chercher ces succes par leur nom de carte ne
donne rien — c'est la meme famille d'erreur que les deux 404 de BB.

Audit v55 : la regle tourne a chaque passe, sur tout bloc `direct_sync` portant
un `bit_map`. Un nom qu'aucune capture n'ancre devient un avertissement
(identifiant inverifiable), un nom ancre sur un autre identifiant devient une
erreur. Teste en negatif : remettre 5748 fait echouer l'audit.

## BE — 25/09/2026 : Ardent Glorious n'etait plus bloque, et un vrai trou a cote

Question posee : ajouter les pieces d'Ardent Glorious a la file. Reponse :
**non, et il ne faut pas.** Les dix-neuf pages de pieces sont au depot, les
dix-neuf de Triumphant Hero aussi, et les deux sets sont decomposes depuis un
moment : trois dons chacun, poses en `__per_piece`, recettes et enfants
compris. `Gift of War Prowess` a sa recette. Le point « Ardent Glorious bloque,
il faut une page de piece individuelle » etait perime — et il n'y a jamais eu
de piece individuelle a modeliser, puisqu'une piece coute les memes trois dons
quel que soit son emplacement. C'est exactement ce que dit `__per_piece`.

### Le vrai trou etait a cote

`gift_of_competitive_dedication` portait `recipe: null` et un seul enfant sur
quatre. Sa capture donne la recette complete : 1 Record of League Participation
+ 1 Star of Glory + 1 Glob of Condensed Spirit Energy + 1 Jar of Distilled
Glory. **Trois ingredients sur quatre n'existaient pas dans l'arbre.** Poses en
feuilles, recette ecrite, et leurs trois pages partent en file par le mecanisme
normal (section 3 : sans apiId ni page).

### Ce que ca revele, et qui depasse cette passe

La file ne detecte pas cette classe de trou. Section 0 affichait 0 pendant que
quatre ingredients manquaient, parce qu'elle part des composants presents et de
leurs aretes, jamais des recettes lues dans `INDEX_CONTENU` pour un composant
dont le champ `recipe` est vide.

Mesure brute : **196 composants dont la recette capturee cite au moins un
ingredient absent de l'arbre, 171 ingredients distincts**. Chiffre a prendre
avec des pincettes — le rapprochement se fait par slug, donc les pluriels
(`Obsidian_Shards`, `Mystic_Clovers`) et les apostrophes encodees
(`Philosopher%27s_Stone`) comptent a tort. Il faut un vrai appariement, par
apiId quand il existe, avant d'en faire une section de la file. A faire, pas
fait ici.

## BF — 25/09/2026 : la relecture des recettes, par legendaire

Remarque d'Antoine : cette relecture aurait du etre la base du travail. Elle
l'est maintenant. `gw2_relecture_recettes_v1.py` descend depuis chaque
legendaire et compare, a chaque noeud, les enfants declares a la recette lue
sur sa capture. Il ne modifie rien.

### Pourquoi la mesure a plat ne valait rien

196 composants en defaut, 171 ingredients absents : chiffre obtenu en
comparant des slugs. Il comptait `Obsidian_Shards` contre `obsidian_shard`,
`Philosopher%27s_Stone` contre `philosophers_stone`, et ignorait qu'un
ingredient peut etre un legendaire (Eternity coute Sunrise et Twilight).

L'appariement se fait donc par **apiId** d'abord — 591 des 601 composants en
portent un, 635 des 886 pages aussi — puis par nom, puis par titre de page.
Deux formes de pluriel sont rattrapees, le mot entier et la tete d'un groupe
`X of Y` (`Piles_of_Bloodstone_Dust` -> `pile_of_bloodstone_dust`), et un
appariement obtenu ainsi est **signale comme a confirmer** plutot que compte
pour acquis.

### Quatre defauts, qui ne coutent pas la meme chose

| defaut | distincts | ce que ca coute |
|---|---:|---|
| MANQUANT | 128 | la recette cite un ingredient absent de l'arbre : le cout n'existe nulle part |
| NON_RELIE | 33 | l'ingredient EXISTE mais aucune arete `qty` ne le rattache — le cout existe et ne remonte pas. **Le plus sournois** : l'inventaire semble complet, seule la cascade est fausse |
| EN_TROP | 15 | enfant declare hors recette ; souvent legitime |
| NON_DECOMPOSE | 53 | recette lue, aucun enfant : feuille assumee, decision a revoir |

### Deux choix qui font tenir le rapport

Un composant est une unite de craft, pas une ligne par cible : chaque defaut
est compte **une fois**, avec la liste des legendaires qui le rencontrent.
1 847 lignes brutes deviennent **229 decisions**. `mystic_clover` est atteint
par 80 cibles et n'a qu'un seul defaut.

Un noeud sans AUCUN enfant est une feuille assumee, pas un bug : une ligne, pas
une par ingredient. `obsidian_shard` et `mystic_clover` produisaient a eux
seuls huit lignes pour une seule decision de modelisation. Et la racine d'un
legendaire porte en plus les totaux agreges de sa « Full material list » : ses
enfants depassent legitimement sa recette de Forge, on ne les compte pas en
trop.

### Ce que ca sort deja

`spiritwood_plank` manque Soft Wood Plank et Glob of Elder Spirit Residue, et
il est atteint par huit legendaires. `certificate_of_heroics` et
`essence_of_animosity` reclament un `Testimony_of_Jade_Heroics` qui a sa
capture au depot mais aucun composant — a ne pas confondre avec
`testimony_of_heroics`, qui existe et est un autre objet.
`deldrimor_steel_ingot` a ses enfants a moitie poses. `gen1_eternity` ne
declare ni Sunrise ni Twilight.

Le rapport n'est pas branche sur l'audit : 229 defauts bloqueraient tout push.
Il se lit, se travaille, et l'audit prendra le relais famille par famille.

## BG — 25/09/2026 : Vision II rendait sa liste deux fois, chacune a moitie

Constat d'Antoine : deux tableaux pour les memes 24 sanctuaires. Le premier
joli — points de passage, codes de chat copiables, conseils de terrain, cartes
— mais dont les cases restent vides quoi qu'on fasse. Le second synchronise
avec le compte, et sans rien de tout cela.

Ce n'etait pas lie a la relecture des recettes. C'est un chemin de rendu
parallele, exactement ce que le projet s'interdit.

`WaypointList` accepte depuis toujours un `isDone(i)`. **Le site d'appel ne le
passait pas.** Les cases n'etaient donc pas des cases a cocher qui ne
sauvegardent pas : elles affichaient un etat que personne ne leur donnait,
toujours faux. En dessous, le rendu generique des bits refaisait la liste avec
le bon etat et aucune information.

Correction en trois points, JSX v227 :

1. la liste de lieux est calculee **une fois**, au niveau de la carte, au lieu
   d'etre cherchee dans une IIFE que le second bloc ne voyait pas ;
2. elle recoit `isDone={i => done || doneBits.has(items[i].bit ?? i)}` — l'etat
   vient du compte, indexe par le `bit` que chaque etape porte deja, pas par sa
   position dans la liste ;
3. la liste brute ne se repete plus sous elle.

Le bandeau de seuil reste — « 20 requis sur 24 objectifs eligibles » est une
information du meta, pas une repetition de la liste.

**Garde** : la liste brute n'est masquee que si la liste de lieux couvre tous
ses bits. Une liste partielle masquerait des etapes ; mieux vaut la redite que
le trou. Quatre collections portent une liste de lieux et la passent toutes :
`vision_2` (24), `selachi_agaleus` (24), `aurora_2` (21), `summer_sungod` (20).
Les trois autres gagnent la synchronisation au passage.

## BH — 25/09/2026 : le correctif deploye partout, et une copie manuelle retiree

Trois endroits rendaient une liste d'etapes. `WaypointList` (le composant),
les sous-collections d'Aurora I (avec leurs barres de maitrise — un autre
widget, laisse tel quel), et **une copie manuelle de `WaypointList` pour
aurora_2 dans l'onglet Aurora** : memes champs, meme mise en forme, meme
markup, ecrit une seconde fois.

Elle etait synchronisee, mais **a l'index** (`bits2.has(i)`) au lieu du `bit`
que chaque etape porte. Tant que la liste est dans l'ordre des bits, personne
ne voit rien ; le jour ou une etape est retiree ou reordonnee, les coches
glissent d'un cran. C'est le meme defaut que Vision II, un cran plus discret.

Remplacee par `<WaypointList>`, qui lit `item.bit ?? i`.

Deux pertes evitees au passage :
- le badge de trajet portait une infobulle (`wp_order_title`) que le composant
  n'avait pas : ajoutee en prop `orderTitle` plutot que perdue ;
- la carte generique n'affichait aucun badge de trajet faute de passer
  `orderLabel`. `aurora_2` est la seule collection a porter des `wp_order`, et
  elle s'affiche aux DEUX endroits : le trajet le moins couteux etait donc
  visible dans l'onglet Aurora et invisible dans la carte. Corrige.

Il ne reste qu'un rendu de liste d'etapes generique, et un widget dedie aux
maitrises d'Aurora I qui, lui, affiche autre chose.

## BI — 25/09/2026 : les 33 « non relies » etaient 6, et 4 sont corriges

Avant de poser la moindre arete, il fallait savoir lesquelles manquaient
vraiment. Sur 33 signalements, **27 n'en etaient pas** :

- **14 sont un CHOIX.** `alt_groups.gen2_mastery` offre Maguuma OU Desert aux
  douze armes gen2. La capture ne montre que la premiere variante de recette,
  et l'arbre porte le choix, pas l'option. Le detecteur ignore desormais un
  ingredient qui est une option d'un `alt_group` dont la cible est ce noeud.
- **13 sont une PLACE differente.** Le cout d'`eldritch_scroll` pour
  `gift_of_prowess` est rattache a `perfected_envoy__per_piece` : six pieces,
  six exemplaires, meme total. C'est un arbitrage deja rendu (ARBITRAGES.md,
  « deja compte par cascade »), pas un oubli. Nouvelle categorie **AILLEURS** :
  le total est probablement juste, la forme ne suit pas la recette. A relire un
  jour, pas a corriger a l'aveugle.

`gw2_relecture_recettes_v2.py` porte ces deux distinctions.

### Les 4 aretes posees

| enfant | parent | qte | ce qui manquait |
|---|---|---:|---|
| `iron_ingot` | `deldrimor_steel_ingot` | 20 | la recette en cite quatre, l'arbre en portait deux |
| `lump_of_mithrillium` | `deldrimor_steel_ingot` | 1 | idem |
| `cube_stabilized_dark_energy` | `pristine_mist_essence` | 1 | l'arbre ne portait que le reactif thermocatalytique |
| `philosophers_stone` | `gen1_eternity` | 10 | `philosophers_stone` n'avait AUCUN parent |

Portee reelle : `deldrimor_steel_ingot` est consomme par treize pieces d'armes,
elles-memes atteintes par treize legendaires. Le cout existait et ne remontait
pas — c'est tout l'interet de cette categorie.

### Les 2 qui restent, et pourquoi je n'y ai pas touche

`gen1_eternity` doit couter **un Sunrise ET un Twilight**. L'arbre lui donne a
la place les enfants d'UNE arme gen1 (5 poussieres cristallines, Don de
Maitrise, Don de Fortune, 250 pieces mystiques) : il sous-compte a peu pres une
legendaire entiere.

Le corriger demande qu'une legendaire puisse etre l'enfant d'une autre. **Aucune
ne l'est aujourd'hui** — verifie, la liste est vide — donc le moteur n'a jamais
eu a le faire, et rien ne dit qu'il le ferait juste. Ce n'est pas une arete a
poser, c'est une capacite a ajouter et a tester des deux cotes. Laisse ouvert.

## BJ — 25/09/2026 : les 128 manquants poses, et une apostrophe qui cachait 17 recettes

Objectif : avoir l'ensemble des couts. Un ingredient qu'aucun composant ne
represente, c'est un cout qui n'existe nulle part — un Sunrise sans Dawn, un
`spiritwood_plank` sans Soft Wood Plank.

### Ce qui est ecrit, et d'ou ca vient

Trois choses seulement, chacune sourcee. **La quantite**, lue dans la recette
capturee du parent : c'est elle qui fait remonter le cout, et la seule qui
compte pour les totaux. **Le nom**, le titre wiki que cette meme recette donne
a l'ingredient. **L'apiId**, quand une capture au depot ou
`gw2_materials_ref.json` (genere depuis /v2/materials et /v2/items) porte un
objet de ce nom — 20 des 124.

Ce qui n'est PAS ecrit : la voie d'obtention. Chaque composant cree porte une
source `unknown` qui dit ou sa quantite a ete lue et que sa page manque. Il part
alors en file par le mecanisme normal. **Le cout remonte des aujourd'hui, la
decomposition suivra.**

`gw2_completion_arbre_v1.py` : **124 composants, 140 aretes**. MANQUANT
128 -> **0**.

### Une apostrophe cachait dix-sept recettes entieres

En corrigeant les slugs (`Rodgort's Flame` -> `rodgorts_flame`, la convention du
depot que l'audit exige deja), le nombre de manquants a AUGMENTE : 109 -> 125.
Ce n'etait pas une regression. La relecture derivait le nom de page d'un
legendaire de son champ `wiki` : `Aurene%27s_Argument` donnait
`aurene_s_argument`, une page qui n'existe pas. **Les dix-sept armes gen3
n'avaient donc jamais eu leur recette lue** — leurs precurseurs (Dragon's
Argument, Dragon's Bite, Dragon's Voice…) n'etaient reclames par personne parce
que personne ne lisait la recette qui les reclame.

### Deux doublons evites, l'audit ayant attrape le premier

`Piles of Bloodstone Dust` allait devenir un composant alors que
`bloodstone_dust` porte deja l'apiId 46731 : **l'audit a refuse**, un objet ne
peut pas avoir deux entrees sans compter son cout deux fois. `Fruit of the
Shadow` allait doubler `Fruits of the Shadow` (104820) au pluriel pres.

Les deux resolutions sont desormais dans le resolveur — apiId via le
referentiel des materiaux, nom insensible au pluriel du mot de tete — ET en
garde dans l'outil de completion, qui refuse de creer et dit pourquoi. Une
correction dans le detecteur seul aurait laisse l'outil libre de recommencer.

### Ou en est la file

Section 3 (sans apiId ni page) : 107. Section 3 bis (cout d'obtention inconnu) :
123. **126 URLs.** Le chiffre a explose et c'est le but : il mesure enfin ce qui
manque vraiment, et non ce qui manquait a l'arbre qu'on avait sous les yeux.

Les familles, pour capturer par lots : ~34 precurseurs gen1/gen2/gen3, 16 sigils
superieurs, 11 dons, 11 plats et ingredients de cuisine, 4 Spirit of the *,
3 Refined Homestead *, 3 Memory of the Bearkin's *, et le reste en materiaux
isoles.

## BK — 27/09/2026 : les 126 captures integrees, et le palier suivant rendu visible

Lot de 126 pages, aucune 404. Integration, index regeneres, puis trois choses.

### 105 apiId poses

Chaque capture annonce l'identifiant de son objet ; 105 composants n'en avaient
pas. Poses en confrontant capture et composant, zero conflit. Les 105
avertissements « la capture annonce API xxx, le composant n'en a pas »
disparaissent : 172 -> 67.

### Dark Matter : un titre qui redirige, et un doublon evite

`Dark_Matter` renvoie vers `Glob of Dark Matter`, au depot depuis le 12/09.
Le composant `dark_matter` que la passe precedente avait cree etait donc un
doublon : fusionne dans `glob_of_dark_matter`, avec sa quantite (10 pour
`mystic_essence_of_annihilation`). Son nom reprend le titre du wiki — « Glob of
Dark Matter », pas « Glob Of Dark Matter ».

Reste le probleme de fond : la recette CITE « Dark Matter », et on ne peut pas
corriger une boite de recette. Le composant declare donc
`wiki_redirects: ["Dark_Matter"]` — les titres par lesquels on l'atteint. Meme
principe que le titre d'arrivee du meta 3516 (§ BB). Sans lui, cette ligne
serait restee dans la file pour toujours.

### 43 composants decomposes, 106 aretes

Les composants poses le 25/09 disaient « voie d'obtention non lue : la page
n'est pas au depot ». Elle y est. Leur recette se lit, leurs ingredients
existent : 43 ont ete decomposes, 106 aretes posees, et le tip corrige — il ne
pouvait plus dire l'inverse de la realite.

Restreint aux composants que cette chaine a crees, reconnus a leur source
`unknown`. `mystic_clover` a une recette et reste une feuille : c'est une
decision de modelisation, la defaire a l'aveugle changerait des totaux que
personne n'a demande de changer.

**Un seul resolveur pour toute la chaine**, celui de la relecture. Le premier
jet de `--relier` en avait un second, plus faible : il ratait cinquante
decompositions. Deux resolveurs qui repondent differemment sur le meme titre,
c'est le chemin parallele qu'on s'interdit.

### Ce que le raccourci « feuille assumee » cachait

Une feuille donne UNE ligne au lieu d'une par ingredient — bon pour la
lisibilite, mais ses ingredients n'etaient pas verifies. **Cinquante recettes du
lot en reclamaient 181 sans que le rapport en dise un mot.**

`gw2_relecture_recettes_v5.py` ajoute la categorie **PALIER_SUIVANT** : un
ingredient absent, cite par la recette d'une feuille. Ce n'est pas un defaut de
la feuille, c'est l'etage d'en dessous. **243 aujourd'hui.**

### Ou en est l'arbre

601 -> **762 composants**. MANQUANT **0**. La file demande **38 pages**, le
palier d'en dessous des 38 composants poses dans la foulee. Sections 0, 1, 2 et
4 a zero.

Le compte des composants va continuer de monter tant qu'on descendra : les
chaines de cuisine (Nopal, Avocado, Bowl of Ascalonian Salad…) sont profondes.
**Jusqu'ou descendre est une decision de modelisation, pas une question de
donnees** — les couts du palier courant sont complets et remontent des
maintenant.

## BL — 27/09/2026 : le lot des 38, et le report des apiId enfin automatise

### Le seul reste systematique de chaque lot

Chaque livraison laissait la meme trainee : des avertissements « la capture
annonce API xxx, le composant n'en a pas ». 105 apres le lot des 126, 16 apres
celui des 38. Un report a la main a chaque fois, donc une occasion de se
tromper a chaque fois.

`gw2_completion_arbre_v3.py --apiids` le fait, avec la meme garde que la
creation : un apiId deja porte par un autre composant n'est pas repose, il est
signale. Deux entrees pour un objet, c'est son cout compte deux fois — c'est
comme ca que `Piles of Bloodstone Dust` avait failli passer. **16 poses, zero
conflit**, audit 84 -> 68.

La chaine se lance maintenant d'un trait :
`--apiids --relier --ecrire`, puis une seconde passe pour creer le palier
decouvert.

### Ce que le lot a ouvert

24 composants decomposes, 47 aretes : les plats du festin d'Orrax descendent
maintenant vers leurs bases (Bowl of Ascalonian Salad, Jar of Red Curry Paste,
Ball of Dough, Slab of Poultry Meat…).

19 nouveaux composants poses dans la foulee, dont **16 identifies par le
referentiel des materiaux** — ce qui dit ou on en est : Onion, Mushroom, Head
of Garlic, Bag of Flour, Packet of Salt, Shallot, Saffron Thread. **On touche
le fond de la chaine de cuisine** : ce sont les ingredients bruts, achetes au
marchand ou recoltes.

### Ou en est l'arbre

762 -> **781 composants**. MANQUANT **0**. PALIER_SUIVANT 243 -> **240**, et il
baisse pour la premiere fois : chaque palier pose en resout plus qu'il n'en
ouvre, desormais. File : **19 pages**, toutes des matieres premieres.

Rappel de ce qui justifie cette branche : Orrax Manifested reclame un Gift of
the Feast, soit quatre dons de service, soit **1 252 plats**. C'est le plus gros
bloc de craft d'une legendaire du depot, et sans decomposition ces 1 252 plats
etaient des objets sans cout.

## BM — 27/09/2026 : d'où viennent les cadences, et ce que l'API en dit

Question d'Antoine : comment les « timers » sont attribués, et peut-on les lire
depuis l'API.

### Comment ils sont attribues aujourd'hui

Chaque composant peut porter un bloc `cadence.sources[]`, ou chaque source dit
`period` (day / week / season / character), `cap`, `per_character`, `rng`,
`cost`, et sa `ref`. **Tout est saisi a la main**, depuis une capture wiki ou
une observation en jeu d'Antoine. Aucun outil ne les deduit.

Le JSX en tire un debit : il additionne les `cap` de toutes les sources
plafonnees, exclut celles sans plafond et les RNG (leur plafond borne les
tentatives, pas les gains), projette sur UN personnage meme quand le plafond est
par personnage, et signale les saisons au lieu de les lisser.

**C'est la que se trouve la fragilite** : additionner les sources suppose qu'on
les farme toutes le meme jour. Pour `difluorite_crystal`, 21/jour/perso +
44/jour/perso + 5/jour font 70/jour, soit 490/semaine — un plafond theorique
que personne n'atteint. Le delai affiche est donc un plancher optimiste, pas une
estimation. A trancher : additionner, prendre la meilleure source, ou demander
au joueur laquelle il emprunte.

### Ce que l'API donne, et ce qu'elle ne donne pas

**Elle donne la liste des crafts a porte quotidienne**, et c'est tout ce qu'elle
donne en matiere de cadence :

- `/v2/dailycrafting` — public, sans cle : les cinq recettes a porte
  quotidienne (`charged_quartz_crystal`, `glob_of_elder_spirit_residue`,
  `lump_of_mithrilium`, `spool_of_silk_weaving_thread`,
  `spool_of_thick_elonian_cord`) ;
- `/v2/account/dailycrafting` — avec cle, portee `progression` : celles deja
  faites depuis le reset. De quoi cocher la case du jour automatiquement.

**Elle ne donne pas** les plafonds vendeur (75 Kralkatite/jour au Bundle), les
plafonds de piste de recompense, ni ceux des trefles et pieces mystiques.
Aucun endpoint ne publie de metadonnee de cadence : ces valeurs restent
wiki-sourcees, et le resteront.

Pour les activites, trois endpoints disent « fait ce reset » sans dire le
plafond : `/v2/account/raids` (hebdomadaire), `/v2/account/mapchests` et
`/v2/account/worldbosses` (quotidiens).

### Ce que la verification a trouve

Des cinq crafts a porte quotidienne que l'API atteste, **un seul portait une
cadence** — `lump_of_mithrillium`, et sans `ref`. Trois n'en avaient aucune :
`glob_of_elder_spirit_residue`, `spool_of_thick_elonian_cord`,
`spool_of_silk_weaving_thread`. Le cinquieme, `charged_quartz_crystal`, n'est
pas un composant du depot (aucune recette lue ne le reclame).

Les trois cadences sont posees, 1 par jour et **par compte** — la porte est
posee sur le compte, changer de personnage ne la rouvre pas — et
`lump_of_mithrillium` recoit enfin la source qui l'etablit.

Portee : ces trois portes commandent Bolt of Damask, Elonian Leather Square et
Spiritwood Plank, donc tout ce qui passe par un tissu, un cuir ou un bois
ascendus. **Pas Vision**, qui n'en consomme aucun — son delai vient d'ailleurs.

## BN — 27/09/2026 : deux magasins pour un seul fait, et une table jamais remplie

Antoine : six armes Astral terminees, collection marquee faite, synchro OK, et
l'onglet Vision affichant toujours « Kralkatite Ore requis 3 100 ». Le
mecanisme etait pourtant branche — `vis_istan` bit 5 porte
`component: astral_weapons`, et depuis la v218 le `required` vient du moteur.

**La cause est en amont : `_meta.collection_key_ids` est vide.** La synchro
construisait les statuts de collection en parcourant cette table, donc ne
construisait rien. `satisfaits` restait vide, et rien n'etait jamais deduit.

Ce qui rendait le symptome trompeur : l'onglet Collections lit `_sub_status`,
indexe par id de succes, et le calcul lisait `_collections`, indexe par cle et
vide. **L'etape s'affichait faite pendant que le moteur ne la voyait pas** —
deux magasins pour un seul fait, la meme maladie que les deux tables de metas
et que la liste de Vision II.

### La correction ne remplit pas la table, elle la remplace

Le lien cle -> id de succes est DEJA dans les sources, sur chaque collection.
La v229 le derive au lieu de le recopier, et pour toutes les cibles — pas
seulement Aurora, Vision et Obsidian, les trois qui avaient jadis leur endpoint
Flask. Les deux indexations sont posees, par cle et par id, parce que
`satisfaits` essaie l'une puis l'autre.

Portee reelle : la regle « une etape validee satisfait son composant » n'avait
jamais rien satisfait nulle part. Orrax porte 20 etapes avec `component`, elles
non plus n'etaient pas comptees.

`collection_key_ids` devient mort. Il n'est pas supprime tout de suite : tant
que la derivation n'est pas verifiee en jeu, le chemin de repli reste.

## BO — 27/09/2026 : zéro est une réponse

Suite de BN. Apres la v229, le kralkatite tombait bien de 3 100 a 100 — il lui
restait les 100 du Gift of Crystalline Magic — mais **la poudre de quartz rose
restait a 3 000**.

Elle ne sert QU'aux armes Astral : 10 par lingot, 300 lingots. Les armes
terminees, son total tombe a zero. Et un total a zero **disparait de la table**
— il n'y a pas de cle a zero dans `totals`. La ligne
`typeof n === "number" ? { ...c, required: n } : c` retombait donc sur le nombre
ecrit a la main, et le 3 000 reprenait sa place.

Le composant est pourtant CONNU : son apiId resout vers `powdered_rose_quartz`.
Absent de la table veut dire zero, pas « inconnu ».

La v230 distingue les deux cas la ou il le faut : `legTotals` vaut `null` quand
le moteur n'a pas tourne, et une table quand il a tourne. Si le moteur a repondu
et que le composant est identifie, `legTotals[cid] ?? 0` fait foi — zero
compris. Sinon, et seulement sinon, le nombre ecrit a la main reste.

C'est la meme faute de lecture que partout cette semaine : une valeur absente
lue comme une absence d'information. Une ancre manquante n'etait pas une absence
de contenu (§ BB), une table vide n'etait pas un compte a jour (§ BN), et un
total absent n'est pas un total inconnu.

## BP — 27/09/2026 : le Flask portait la QUATRIÈME table de clés

Question d'Antoine : le Flask a-t-il ete mis a jour, la v41 ne synchronise plus
rien. **Non, il n'a pas ete touche** — et il portait sa propre liste
cle -> id de succes, ecrite a la main, jamais rapprochee des sources.

Quatre listes pour un seul fait :

| ou | etat |
|---|---|
| `collections[*].id` dans les sources | fait foi |
| `_meta.collection_key_ids` | **vide** (§ BN) |
| table `metas`/collections du JSX | derivee depuis la v229 |
| `*_ACHIEVEMENT_IDS` du Flask | ecrite a la main, derivee |

La derive mesuree : **2 cles communes avec les sources pour Vision** (16 contre
20), 2 pour Aurora (18 contre 6), **aucune pour Obsidian**. Le Flask nommait
`vision_istan` ce que les sources appellent `vis_istan`. Rien ne pouvait
s'apparier.

### v42 : derivation, repli, et double indexation

Les trois tables sont derivees des sources au demarrage. Elles ne sont pas
supprimees : elles gardent ce que les sources n'ont pas — les Requiem
Experiments, les Arcanum d'Obsidienne — et servent de repli si le fichier de
sources est introuvable. En cas de conflit sur une cle, les sources gagnent.
Vision passe de 16 a 34 cles.

La reponse porte desormais chaque statut **sous sa cle ET sous `str(id)`**. Le
consommateur cherche par cle puis par id : lui donner les deux evite qu'un
renommage casse a nouveau l'appariement en silence. C'est la meme double
indexation que la v229 pose cote synchro directe.

Teste hors ligne — chargement des sources, derivation, double indexation —
mais **pas en service** : il faut une cle API et le reseau GW2, que le conteneur
n'a pas.

### Ce qui reste a verifier avec Antoine

Sur GitHub Pages, `127.0.0.1:5000` est injoignable : les trois `fetch` echouent
et le code retombe sur `data._collections`, produit par la synchro directe.
**Le Flask n'intervient pas depuis un telephone.** Si « ca ne synchronise sur
rien » se voit aussi sur mobile, la cause est ailleurs que dans le Flask — et la
v229 plus la v230 viennent de corriger deux causes de ce genre.

## BQ — 28/09/2026 : les deux horaires tranchés, et une cinquième table de clés

### Les horaires

`Casino Blitz` : la page dit 00:05 puis toutes les deux heures. **Offset 21 ->
5.** L'anomalie que j'avais signalee — « le seul offset qui ne soit pas un
multiple de 5 » — disparait : c'etait la faute elle-meme, pas son indice.

`Convergence: Outer Nayos` : XX:30 toutes les 3 h depuis 01:30, pendant
10 minutes. **Offset 90 -> 30 cote sources, duree 20 -> 10 des deux cotes.** Le
JSX avait raison sur l'heure, tort sur la duree ; les sources avaient tort sur
les deux. Les deux tables sont corrigees, avec leur `ref`.

Ce que ca dit du plan § 12 : corriger une table sur deux n'aurait rien change a
l'ecran pour l'heure, et rien change du tout pour la duree.

`Event_timers` ne servira pas : la page est rendue par un widget Lua, son HTML
ne contient ni « Casino Blitz » ni « Convergence ». La capture est versee pour
que le constat soit tracable. Les 18 horaires restants se prendront page par
page, en visant le titre precis — `Convergence` seul redirige vers `Public
instance`, et il existe aussi Mount Balrior et Nexus of Eternity.

### La cinquieme table : les monnaies du Flask

`_meta.direct_sync.leg_currency_ids` porte, pour dix-huit cibles, la liste
complete cle -> identifiant. Le chemin direct du JSX s'en sert deja. **Les blocs
du Flask, eux, etaient ecrits a la main et incomplets** : Vision n'avait que
trois entrees — `elegy`, `gems`, `vm` — sur les DIX que les sources declarent.
L'eclat inscrit, la difluorite, le mistonium, la kralkatite, la masse marquee,
le quartz et l'encens n'avaient **aucune valeur** par ce chemin.

C'est le contexte du compteur a 10 signale par Antoine avec plus de 60 eclats
inscrits en poche. L'identifiant 87645 est bon, verifie contre
`gw2_materials_ref`, et les deux chemins agregent bien les cinq emplacements —
portefeuille, stockage, banque, inventaire partage, sacs. Ce qui manquait,
c'etait la cle elle-meme.

`gw2_flask_server_v43.py` derive les seize blocs des sources ; ce qui etait
ecrit a la main ne sert plus que de complement, et les sources tranchent en cas
de conflit. Meme correction que pour les cles de collection en v42, sur la
table d'a cote.

### Et une regle d'audit qui inventait une erreur

La regle 33 confronte une arete a la boite Recipe du parent. Mais **une boite
chiffre son LOT, pas l'unite** : Pile of Vile Essence a deux variantes, 2 Filthy
pour 1 essence et 4 Filthy pour 2. Meme ratio. Lire le 4 tel quel faisait
reclamer le double — le controle ecrit pour attraper une quantite agregee lue
comme unitaire en fabriquait une.

L'audit v56 divise par `sortie` avant de comparer, et se tait si la division ne
tombe pas juste plutot que de deviner. J'avais commence par « corriger » la
donnee vers 4 : c'etait suivre l'outil contre la source.

## BR — 28/09/2026 : la clé API dans les journaux, et pourquoi le 10 était figé

### La clé en clair

Antoine : « l'utilisation de l'API directe web, alors que le Flask est allumé,
envoie dans les logs la clé complète, en clair ». C'est exact, et la cause n'est
pas celle qu'on croit.

**Avec Flask allumé, l'API directe n'est pas empruntee.** Le client appelle
Flask d'abord et ne bascule en direct que s'il est injoignable. Les URL
appelees portent la cle en clair — `/api/achievements/obsidian?key=...` — et
Werkzeug journalise la ligne de requete entiere, chaine de requete comprise.

`gw2_flask_server_v44.py` filtre `key`, `access_token` et `token` dans TOUT ce
que le serveur journalise, traces d'exception comprises. Huit caracteres
restent, assez pour reconnaitre quelle cle a servi, pas assez pour s'en servir.

**Ce filtre masque, il ne corrige pas.** La vraie correction est que la cle
cesse de voyager dans l'URL : sa place est dans un en-tete, qui ne se
journalise pas. C'est un changement cote client, porte au backlog.

### Pourquoi le compteur restait a 10

La persistance des monnaies fait `{ ...cur, ...vals }` : **une monnaie que la
charge ne porte plus garde sa derniere valeur, indefiniment**. Le Flask
n'envoyait pas `inscribed_shard` (§ BQ), donc rien ne venait ecraser le 10 pose
un jour par une autre synchro. Zero aurait au moins ete visible ; un vieux
nombre ne se distingue pas d'un nombre frais.

Le marqueur existe pourtant — `__notSent` liste les monnaies declarees que la
synchro n'a pas rendues, et la carte affiche `cur_not_sent` en rouge. Il
dependait que `declared` soit non vide, ce qui est le cas pour Vision.

Le melange n'est pas supprime : **manuel et synchronise partagent le meme
magasin**, et les boutons -10/+50 ecrivent au meme endroit. Effacer une monnaie
non envoyee detruirait un comptage tenu a la main — qui est justement l'usage
prevu pour ce que l'API ne rend pas. La vraie sortie est de separer les deux,
au backlog.

Ce qui se verifie des maintenant : avec le Flask v43, `inscribed_shard` est
envoye. Si le compteur reste a 10 apres une synchro sur v43+, la cause est
ailleurs et il faudra lire `__syncedAt` et `__notSent` du magasin.

## BS — 28/09/2026 : la recette est complète, et le 200 se lit en deux moitiés

Antoine : « j'en ai encore besoin de 100 pour le Gift of Crystalline Magic, donc
cette recette n'est pas totalement traitee ? ». Elle l'est.

`Gift of Crystalline Magic` = 100 Kralkatite + 100 Difluorite + **100 Eclats
inscrits** + 1 Bouteille de vin elonien. L'arbre porte les quatre, la capture
les confirme, aucun ecart.

**Le 200 affiche est la somme de deux besoins distincts** : 100 pour ce don, et
100 pour le `Lacquered Banner Pole`, qui fait la `Banner of the Commander` que
reclame la collection « Visions of Kourna ». La difluorite, elle, n'a qu'un
consommateur — d'ou 100. Rien ne manque : deux moities, une seule affichee comme
un total.

Et la moitie « banniere » est deja cablee : `vis_kourna` bit 5 porte
`component: banner_of_the_commander`. Une fois cette etape validee, ses 100
eclats disparaissent, exactement comme les 3 000 kralkatite des armes Astral.
**Si Antoine n'a plus besoin que de 100, c'est que cette etape est faite** — et
le 200 encore affiche voudrait dire que son statut ne remonte pas au calcul.

### D'ou une lacune trouvee en verifiant

La regle « une etape validee satisfait son composant » a deux chemins
d'alimentation, et **un seul la connaissait**. Le chemin direct derive la table
des sources depuis la v229. Par Flask, elle n'existait pas : seules Aurora,
Vision et Obsidian ont une route dediee, donc **les vingt etapes d'Orrax qui
portent un `component` ne rendaient jamais rien**.

`_sub_status` ne pouvait pas y suppleer : il laisse tomber les `bits`, et une
collection a moitie faite se juge bit par bit.

`gw2_flask_server_v46.py` renvoie `_collections.all` — 340 entrees, indexees par
cle ET par id, bits compris — derivees des sources comme cote JSX. Vision et
Aurora marchaient deja par leur route dediee ; c'est Orrax et les autres qui
gagnent la regle.

## BT — 28/09/2026 : j'ai vérifié la pièce et conclu sur l'ensemble

Antoine : il en faut **300**, pas 200 — 200 pour la bannière, 100 pour le Gift
of Crystalline Magic. Il a raison, et la preuve était au dépôt.

`vision_i_awakening.html` écrit noir sur blanc : « Banner of the Commander,
crafted using recipe from Lady Camilla, which requires **Inscribed Shard x 200**,
Orichalcum Ingot x 25, Unidentified Dye x 20, Glob of Ectoplasm x 15, Ancient
Wood Log x 10, Bolt of Gossamer x 5, Spool of Gossamer Thread… ». Les autres
quantités de cette liste tombent juste avec l'arbre — ectoplasme 10 + 5 = 15,
bois ancien 10, gossamer 5. **Seuls les éclats sont à moitié.**

### Comment j'en suis arrivé là

J'ai lu la recette du `Gift of Crystalline Magic` sur sa capture, vérifié qu'elle
portait bien ses quatre ingrédients, puis lu `inscribed_shard.qty` dans l'arbre :
100 pour le don, 100 pour le mât. J'ai additionné et répondu « 200, la recette
est complète ».

**J'ai vérifié la pièce qu'on me montrait et conclu sur l'ensemble.** La question
portait sur un total, et un total ne se vérifie pas en relisant un de ses
termes. La page qui donne l'agrégat était au dépôt depuis le début.

### Ce qui manque, et pourquoi je ne l'écris pas

Le `Lacquered Banner Pole` coûte 100 éclats chez Lady Camilla — sourcé. Le
`Banner Pennon` se fabrique, et sa boîte Recipe ne contient aucun éclat —
sourcé. Le candidat pour les 100 restants est la **feuille de recette**, achetée
chez la même vendeuse, dont la page n'est pas au dépôt. Ni celle de Lady
Camilla.

Les deux URLs sont en file. Tant qu'elles manquent, l'arbre compte 200 là où le
wiki annonce 300 : le manque est documenté, pas comblé. Écrire la ligne pour
faire coller le total serait inventer un coût qu'aucune page ne porte.

### Le trou d'outillage que ça révèle

Rien dans la chaîne ne pouvait attraper ça. La relecture des recettes compare
**nœud par nœud** : les enfants de `banner_of_the_commander` correspondent
exactement à sa boîte Recipe — mât, pennon, orichalque, teinture — donc aucun
défaut. L'achat manquant n'est dans aucune boîte de recette, il est dans un
agrégat rédigé en prose sur une page de collection.

`gw2_confronte_totaux_v8.py` confronte bien des totaux, mais seulement les
tables « Full material list ». `vision_i_awakening` n'en est pas une : zéro
mention des éclats inscrits dans son rapport. **Les agrégats en prose des pages
de collection ne sont lus par personne.** C'est une famille de contrôle à
écrire, et elle aurait attrapé celui-ci.

## BU — 28/09/2026 : la famille de contrôle qui manquait, et sa première prise

`gw2_confronte_agregats_v1.py` lit la troisieme forme d'agregat du wiki, celle
que personne ne lisait : les listes de courses **redigees en prose** sur les
pages de collection. Les deux autres sont deja couvertes — tables « Full
material list » par `gw2_confronte_totaux_v8.py`, boites Recipe noeud par noeud
par `gw2_relecture_recettes_v5.py`.

Quatre pages en portent : `warbringer`, `vision_i_awakening`, `ad_infinitum`,
`the_ascension`. **56 quantites confrontees, 1 depassement, 51 accords.**

Deux signaux, de force inegale, et l'outil le dit : **DEPASSE** — une occurrence
seule exige plus que le total de la cible, une partie ne peut pas exceder le
tout ; **SOMME** — le cumul depasse, a arbitrer, parce que deux agregats peuvent
se recouvrir.

### Sa prise : 3 000 magies volatiles contre 1 000

`vision_i_awakening` ecrit : « Exquisite Serpentite Jewel x 18, Glob of
Ectoplasm x 30, Laurel x 30 **and Volatile Magic x 3000 in total for weapon
recipes** ». L'arbre porte `volatile_magic: 1000` sur Vision, et **le laurier
n'est pas un composant du tout**.

Ce sont les recettes des six armes de sang de dragon, achetees aux lauriers et a
la magie volatile. A arbitrer avant de toucher : un achat de recette est unique
par compte, et le depot a deja un mecanisme pour ca (`recettesCompte`, les
feuilles « Recipe: Gift of … » cochees automatiquement). Il se peut que le 1 000
soit deliberement autre chose. **Non corrige.**

### Ce que l'outil N'a PAS attrape

Le cas qui l'a fait ecrire. Sur `vision_i_awakening`, la banniere annonce
200 eclats et l'arbre en totalise 200 pour Vision : egalite, donc aucun signal.
Les 100 du Gift of Crystalline Magic ne figurent pas en prose sur cette page, le
cumul ne se forme jamais.

Autrement dit : cet outil couvre une famille reelle, il en a sorti un defaut des
sa premiere passe, et il **ne remplace pas** la lecture des agregats page par
page. Le dire evite de croire la chaine complete parce qu'un rapport de plus
affiche zero.

## BV — 28/09/2026 : décomposer ce qu'on a, au lieu de réclamer ce qu'on n'a pas

Antoine : « une page ne sert qu'une fois lue. Ne peux-tu pas rajouter un "une
fois par compte" pour les recettes, en décomposant CE QUE TU AS DÉJÀ AU WIKI ? »

Il a raison, et mon refus etait mal place. Je tenais a la capture de la feuille
de recette alors que l'agregat qui donne son cout etait deja au depot. **Une
soustraction entre deux valeurs sourcees n'est pas une invention.**

### Les éclats : 200 annoncés − 100 sourcés = 100

`vision_i_awakening` annonce 200 eclats pour la Banner of the Commander. La page
du `Lacquered Banner Pole` en source 100 chez Lady Camilla, celle du
`Banner Pennon` aucun. Les 100 restants sont la feuille de recette, achetee chez
la meme vendeuse — et elle s'achete **une fois pour le compte**.

`inscribed_shard.qty` recoit `vision__onetime: 100`, a cote de ses deux aretes
en cascade. Total Vision : **300**, comme Antoine le disait.

### Les recettes d'armes : 3 000 et non 1 000

La meme page ecrit « Any six Dragonsblood weapons, requiring a minimum of …
Laurel x 30 **and Volatile Magic x 3000 in total for weapon recipes** ». L'arbre
portait `volatile_magic: {vision: 1000}` — un nombre qu'aucune page ne soutient
— et **le laurier n'existait pas**.

Les deux passent en `vision__onetime` : 3 000 magies volatiles et 30 lauriers,
une seule fois pour le compte. Le suffixe existait deja (`obsidian__onetime`),
aucun champ nouveau.

### Ce que ca a demande autour

- `laurel` cree, apiId 3, monnaie de portefeuille ;
- `_meta.direct_sync.leg_currency_ids.vision` le declare, sans quoi l'audit
  refuse une carte que la synchro ne sait pas remplir ;
- trois cartes du JSX mises d'accord avec l'arbre — 300, 3 000, et une carte
  laurier — chacune avec l'`aside` qui dit d'ou vient le nombre. L'audit avait
  bloque sur les deux premieres : la table ecrite a la main doit suivre.

**`gw2_confronte_agregats_v1.py` passe de 1 depassement a 0.** Le controle ecrit
hier pour cette famille valide aujourd'hui sa propre correction.

### Un avertissement attendu, qu'on garde

L'audit signale que `inscribed_shard` atteint Vision en direct ET par deux
cascades, donc « risque d'etre compte deux fois ». Ici c'est faux : ce sont
trois exigences distinctes, le don, le mat et la feuille. La regle ne peut pas
le savoir sans qu'on le lui dise, et l'affaiblir pour faire taire un cas juste
lui ferait rater les vrais. On garde l'avertissement.

## BW — 28/09/2026 : la bonne page, et ce que l'avertissement disait vraiment

Antoine : « si l'audit couine, quelle sera ta réaction dans 2 h ? » — puis
« ajoute simplement la bonne page au dépôt, elle passera avec le reste ».

Les deux remarques se rejoignent, et elles ont raison contre ma reponse
precedente.

### L'avertissement n'etait pas du bruit

J'avais ecrit qu'on le gardait parce qu'il etait faux ici. C'est la reponse qui
use un signal : dans deux heures, sur une autre section, je l'aurais lu comme
« connu, accepte ».

Le depot a pourtant une declaration prevue pour ca — `qty_overlap_verified`,
utilisee par `emblem_of_the_conqueror` pour Conflux. **Je ne l'emploie pas
ici**, et c'est le fond de l'affaire : l'avertissement ne signale pas un
chevauchement legitime, il signale une **modelisation raccourcie**. Les
100 eclats de la feuille de recette pendent directement a `vision__onetime`
parce que le noeud qui devrait les porter n'existe pas.

Declarer le chevauchement aurait fige le raccourci. Poser la page le supprime.

### Ce que je ferai quand la page arrivera

`recipe_banner_of_the_commander`, achat unique pour le compte, enfant
`inscribed_shard: 100`, rattache a `banner_of_the_commander`. L'arete directe
`vision__onetime` disparait, les trois exigences repassent toutes par des
parents, **et l'avertissement s'eteint sans qu'on lui ait rien dit**. Le total
reste 300.

Meme traitement pour les 3 000 magies volatiles et les 30 lauriers : ils
pendent aussi a `vision__onetime` faute d'un noeud « les six recettes d'armes ».
Ils ne declenchent rien aujourd'hui — aucune cascade concurrente — mais c'est le
meme raccourci.

### Et un defaut de ma main, corrige

J'ai ajoute deux fois une section a la main dans `PAGES_A_CAPTURER.md`. C'est un
fichier **genere** : les deux ont ete effacees a la regeneration suivante, sans
un mot. Une page qu'aucun composant ne reclame — une feuille de recette, un
horaire de meta — n'y apparaitra jamais toute seule.

`ressources/PAGES_MANUELLES.md` est l'entree tenue a la main, une ligne par URL,
que `gw2_pages_a_capturer_v13.py` fusionne dans la sortie. Editer la sortie ne
sert a rien ; editer l'entree marche. La file passe a 7 URLs, les deux pages de
la banniere comprises.

## BX — 29/09/2026 : le bon nœud était le pennon, pas la bannière

J'avais ecrit, noir sur blanc, ce que je ferais quand la page arriverait :
`recipe_banner_of_the_commander` portant 100 eclats inscrits. **C'etait faux.**
La table vendeur de Lady Camilla le dit :

| objet | cout |
|---|---|
| Lacquered Banner Pole | 1 Vial of Awakened Blood + 10 Ectoplasme + 10 Bois ancien + **100 Eclats** |
| **Recipe: Banner Pennon** | **100 Eclats** |
| Recipe: Banner of the Commander | **1 po**, zero eclat |

Les 200 annonces par `vision_i_awakening` se decomposent en 100 (le mat) +
100 (**la feuille du pennon**) — le pennon que j'avais classe « n'en demande
aucun » apres avoir lu sa seule boite Recipe, sans chercher si sa RECETTE
s'achetait.

Mon erreur d'origine n'etait donc pas de reclamer une capture : c'etait de
deduire QUELLE page reclamer a partir d'une elimination incomplete. J'avais
deux candidats, j'en ai elimine un sur une lecture partielle, et j'ai designe
l'autre par defaut.

### Ce qui est pose

- `recipe_banner_pennon` (apiId 87988), enfant `inscribed_shard: 100`, parent
  `banner_pennon`. Le parseur vendeur en tirait deja la ligne.
- `recipe_banner_of_the_commander` (apiId 87865), `account_unlock`,
  `prix_cuivre: 10000` — meme famille que les 23 feuilles a 10 po
  d'ACHATS_UNIQUES. Un poste en or, pas en eclats.
- L'arete directe `vision__onetime: 100` est retiree. Les trois exigences
  passent desormais toutes par des parents, **et l'avertissement de double
  comptage s'est eteint sans qu'on lui ait rien declare** — c'est ce qui etait
  annonce, pour une raison qui ne l'etait pas.

Total Vision : **300 eclats**, inchange. 100 pour le Gift of Crystalline Magic —
qu'Antoine maintient et que l'arbre porte depuis le debut —, 100 pour le mat,
100 pour la feuille du pennon.

### La liste manuelle n'etait pas verifiee

`PAGES_MANUELLES.md` fusionnait ses URL sans consulter l'index de contenu,
contrairement a toutes les sections calculees. Resultat : une page capturee
restait dans la file et la redemandait indefiniment. **Une entree tenue a la
main n'a pas le droit d'etre moins verifiee qu'une entree deduite.**

`gw2_pages_a_capturer_v14.py` la filtre par `capturee()`, et signale en fin de
passe les URL devenues inutiles pour qu'on les efface de l'entree. Les deux de
la banniere sont sorties ainsi. Le piege attendait les 18 horaires de meta.

## BY — 29/09/2026 : la file à zéro pendant qu'il manque 33 sources

Antoine : « s'il attend les pages, et que les URLs de capture sont à 0… on fait
quoi ? ». Rien, tant que la file ne les demande pas.

Le § 12 attend les horaires de meta depuis deux jours, et la file affichait 0.
Elle ne pouvait pas faire autrement : **elle deduit ses lignes de l'arbre**, et
aucun composant ne reclame la page d'un horaire. Un besoin reel restait
invisible a l'outil cense le rendre visible — et je venais de construire
l'entree qui sert exactement a ca sans y mettre le besoin qui l'avait motivee.

`ressources/PAGES_MANUELLES.md` porte donc les 33 entrees a horaire sans `ref`,
en trois groupes, parce qu'elles ne demandent pas le meme travail :

- **15 URLs posees.** Les titres sont DEDUITS du nom de la meta. Deux 404 et une
  redirection ont deja coute une passe : ils sont annonces comme deduits, pas
  comme verifies.
- **7 metas dont je ne sais pas nommer la page.** Leur libelle au depot est une
  description — « Full meta », « Public Instance », « Nodes LW3 + vendor » — pas
  un titre. Les inventer produirait exactement les 404 d'avant-hier. Elles sont
  listees en clair, avec les deux sens du couple `name`/`subname` puisque la
  convention s'inverse d'une entree a l'autre.
- **16 entrees `isTimeless`.** Fermes de noeuds ou de vendeurs : aucun horaire a
  sourcer, leur source est une page de carte ou de vendeur. Elles n'ont rien a
  faire dans une file d'horaires, et c'etait le piege signale hier.

File : 0 -> **15 URLs**.

## BZ — 30/09/2026 : les horaires ne sont pas dans le HTML, sauf un

20 pages capturees. **Une seule porte son horaire** : `The Frozen Maw`, dont le
tableau est ecrit en wikitexte — les heures vivent dans des attributs
`data-time-hh` / `data-time-mm`. Les dix-neuf autres affichent leur section
« Event schedule » par **le meme widget Lua qu'`Event_timers`** : le HTML ne
contient que la feuille de style, aucune heure.

Capturer les pages de meta une par une ne donne donc pas les horaires. C'est le
meme mur qu'avant-hier, un cran plus loin : on a change de page, pas de
mecanisme de rendu.

### Ce que ca a quand meme donne

`bf_meta`, le Frozen Maw : le JSX disait offset **0**, le wiki dit **15**.
Corrige — « toutes les deux heures a partir de 00:15 », douze departs listes,
ecart constant de 120 minutes. Premier horaire du depot a etre sourcé.

### Quatre captures qui ne servent pas a ca

Quatre titres de ma liste du 29/09 pointaient le mauvais TYPE de page : un boss
ou une carte, pas la meta. `Octovine` et `Legendary Chak Gerent` sont des
creatures, `Palawadan, Jewel of Istan` et `Dragon's Stand` des lieux. Elles
repondent 200, elles n'ont pas de section horaire du tout. Elles restent au
depot — elles ne servent juste pas a ca, et `PAGES_MANUELLES.md` le dit
desormais pour qu'on ne les redemande pas.

### Avant d'en redemander

La question a trancher n'est pas « quelle page », c'est **si le harnais peut
enregistrer le DOM APRES execution du widget**. Antoine a mentionne un
classificateur qui autorise l'execution JS : si la capture se fait avant que le
widget ait tourne, une attente suffirait. Sinon cette voie est fermee et il faut
une autre source. Rien n'est remis en file tant que ce point n'est pas regle.

### Un effet du rangement, corrige

Le deplacement des outils dans `scripts_tracker/<domaine>/` a rendu la garde de
concurrence **decorative sans rien dire** : elle parcourait la racine sans
descendre, et `ls-tree` sans `-r` ne rend que le premier niveau. Elle annoncait
« 3 familles versionnees » au lieu de 52 — donc elle ne surveillait plus ni les
doublons de version ni les collisions de numerotation sur quarante-neuf
familles.

`gw2_garde_concurrence_v2.py` descend des deux cotes. **52 familles**, une seule
version chacune.

## CA — 01/10/2026 : la méthode des horaires tient, son périmètre non

La methode trouvee en cowork est bonne et je la reformule pour qu'elle survive a
cette session : **`Widget:Event timer/data.json` est une page du wiki, pas un
rendu**. C'est la table que le widget lit pour dessiner la frise. Elle donne,
pour chaque evenement, la suite de ses phases avec leur duree ; le decalage d'un
segment se **calcule** — on additionne les durees qui le precedent, modulo
l'intervalle. Les horaires n'etaient pas lisibles, ils sont deductibles.

Verifie : 17 accords, **zero ecart** sur les 20 metas de `meta_events`. La
methode est juste.

### Ce qu'elle a corrige chez moi

`conv` : j'avais ramene l'offset de 90 a 30 le 28/09 en lisant « opens every
3 hours at XX:30, starting from **01:30** ». 01:30, c'est **90 minutes**, pas 30.
J'ai lu les minutes de l'heure affichee comme un decalage. Le widget redonne 90,
et le JSX l'avait depuis toujours.

### Les incoherences qui restent

**1. Le perimetre.** La confrontation couvre les 20 metas de `meta_events`. Le
JSX en porte **35**, dont **19 que rien ne confronte** — et elles cachent de
vraies erreurs :

- `obs_conv_on` portait 30 pour Outer Nayos quand `conv`, la MEME meta,
  portait 90. Deux entrees, deux horaires, aucune comparaison. **30 -> 90.**
- `shackles` portait 70 ; le widget dit **75** pour « Shackles of the Ancients »
  dans `voe-eg`. **70 -> 75.**

**2. Les durees n'etaient pas confrontees.** La v1 jetait le `d` de chaque
segment. `gw2_confronte_horaires_v2.py` le garde, et sort **huit desaccords** :
co 10/16, de2 45/60, ds 60/120, dv 20/30, er 15/25, ew 35/20, mb 20/10,
vb 15/25.

**A NE PAS CORRIGER EN BLOC.** La duree du widget est la longueur de la PHASE
dans la frise ; la notre semble etre la fenetre utile au joueur. Ce ne sont
peut-etre pas la meme grandeur — `ew` est d'ailleurs plus long chez nous que
chez le widget, ce qu'une simple sous-estimation n'expliquerait pas. A trancher
avant de toucher. Seul `conv` est corrige, parce que la base editoriale et le
widget disaient tous deux 10 et que seul le JSX portait 20.

**3. Rien dans l'audit ne compare les deux tables.** La v2 le fait et sort
aujourd'hui zero desaccord, mais c'est un rapport, pas un garde-fou : la
divergence peut revenir sans bloquer un push. A brancher sur l'audit quand les
deux tables auront fusionne (§ 12).

### Ce que le widget donne et qu'on n'exploite pas

28 evenements du widget ne sont rattaches a rien chez nous, dont exactement les
metas que le JSX porte seul : Starlit Weald, Eternity's Garden, Shipwreck
Strand, Domain of Istan, Lake Doric, Wizard's Tower, Eye of the North, Janthir
Syntri. **La fusion des deux tables sourcerait d'un coup une dizaine
d'horaires de plus**, sans une capture supplementaire.

## CB — 01/10/2026 : la fenêtre et le temps de jeu sont deux choses

Antoine a tranche : `durationMin` doit dire **combien de temps la fenetre reste
ouverte**, pas combien de temps la meta prend. Le raisonnement tient tout seul —
une meta finie en quinze minutes ne raccourcit pas sa fenetre, et c'est la
fenetre qui fixe le depart de la suivante. Un `durationMin` qui vaudrait le
temps de jeu fausserait tout enchainement, et l'enchainement est **le besoin** :
combien de metas tenir dans deux heures pour maximiser les gemmes.

Les huit valeurs passent donc a celles du widget. **Et on ne jette pas les
anciennes** : ce sont la seule estimation de temps de jeu qu'on ait, et Antoine
la veut pour planifier. Elles vivent en `playtimeMin`, annoncees pour ce
qu'elles sont — editoriales, non sourcees.

| cle | fenetre | temps de jeu garde |
|---|---:|---:|
| vb | 15 -> **25** | 15 |
| ds | 60 -> **120** | 60 |
| co | 10 -> **16** | 10 |
| er | 15 -> **25** | 15 |
| dv | 20 -> **30** | 20 |
| ew | 35 -> **20** | 35 |
| de2 | 45 -> **60** | 45 |
| mb | 20 -> **10** | 20 |

`ew` etait le cas qui m'avait fait hesiter : 35 chez nous pour une fenetre de 20.
Avec la distinction, il n'a plus rien d'etrange — c'est une estimation de temps
de jeu qui depassait la fenetre, donc fausse comme fenetre et discutable comme
estimation. Elle est conservee telle quelle, a reprendre.

L'affichage dit maintenant « ⏱ 25 min · ~15 min de jeu », sans le `~` sur la
fenetre, qui n'est plus une approximation.

### Un appariement, pas deux

Mon premier jet de `gw2_fenetres_metas_v1.py` avait son propre appariement
meta → segment, par couple (decalage, intervalle). **Des dizaines d'evenements
partagent ce couple** : il a joint `er` a « Defending Tarir (Pylons) », `nk` a
« Shards and Construct », et la monnaie `karma` au Death-Branded Shatterer. Les
25 « corrections » qu'il proposait auraient ecrit n'importe quoi.

L'appariement valide existait — celui de la confrontation, 17 accords. Il etait
enferme dans son `main()`. Il en sort en `apparie()` (v3) et les deux outils
l'appellent. Meme faute que le resolveur de la relecture il y a trois jours,
meme correction.

Deux gardes posees au passage : le JSX n'est touche que pour les cles que la
base editoriale porte deja — les 18 cles qu'il porte seul n'ont pas
d'appariement valide et restent intactes — et le decoupage du JSX se fait par
entree, parce qu'un `finditer` non gourmand avalait l'entree suivante et faisait
disparaitre `vb` du lot.

### Etat

Confrontation : **0 ecart de decalage, 0 ecart de fenetre, 0 desaccord entre les
deux tables.** Les 18 cles du JSX hors base restent non confrontees — c'est la
fusion du § 12 qui les ouvrira, et le widget les porte deja.

## CC — 01/10/2026 : § 12, premier pas — et la table n'était pas ce que je disais

### Ce que la mesure a corrigé d'abord

J'ai decrit le tableau `metas:` du JSX comme « une seconde table d'horaires ».
C'est faux. C'est une liste d'**activites par legendaire** : 112 entrees,
78 cles distinctes, trois natures melangees.

| nature | nombre | ce que c'est |
|---|---:|---|
| metas a horaire | **27** | un `offsetUTC` reel |
| fermes `isTimeless` | 12 | noeuds, vendeurs — pas d'horaire |
| postes de farm | 38 | `clovers`, `ectos`, `tier1`, `lodestones`, `provisioner`… |

Fusionner les 78 dans `meta_events` aurait melange trois choses. Seules les 27
relevent d'un catalogue d'horaires — dix-sept y etaient deja, **dix n'y
etaient pas**.

### Les dix, posées avec leur source

`gw2_catalogue_metas_v1.py` les ajoute a `meta_events`, horaire lu dans le
widget via l'appariement partage. Neuf sur dix trouvent leur segment ; seul
`bf_meta` n'en a pas, le Frozen Maw etant un boss de monde — son horaire reste
celui de sa page, deja sourcé.

Ce que ca a corrige, et qu'aucun outil ne regardait :

- **`di` Palawadan : decalage 0 -> 105.** Palawadan part a 01:45, pas a minuit.
  Une heure quarante-cinq d'erreur sur une meta qu'Antoine farme.
- `di` fenetre 20 -> 30, `obs_conv_mb` 20 -> 10, `weald` 25 -> 35,
  `shackles` 50 -> 25.

La confrontation passe de 17 a **26 accords**, et le desaccord JSX/base retombe
a zero.

### Deux pièges du côté des noms

`apparie` cherche la carte dans `map`. Les entrees venues du JSX n'en avaient
pas : il a fallu leur poser la carte du widget, sans quoi les neuf nouvelles
redevenaient invisibles a la confrontation **apres** y etre entrees.

Et la convention `name`/`subname` s'inverse d'une entree a l'autre : Starlit
Weald, Eternity's Garden et Shipwreck Strand sont des CARTES rangees en
`subname`, leurs metas etant « Secrets of the Weald », « Shackles of the
Ancients », « Hammerhart Rumble! ». L'outil tente donc les deux sens — cinq
appariements sur dix en dependaient.

### Ce qui reste du § 12

1. **14 cles du JSX restent hors base** — les 12 `isTimeless` et deux autres.
   Elles n'ont pas d'horaire, donc pas leur place ici ; leur sort se decide avec
   le filtre par ressource, pas avec le catalogue.
2. **Le JSX porte toujours sa table.** Le catalogue existe et concorde, mais
   l'affichage lit encore ses propres valeurs. Tant que les deux existent, la
   confrontation est le seul garde-fou — et c'est un rapport, pas un audit.
3. **`rewards` et le filtre** ne sont pas commences.

## CD — 01/10/2026 : vingt coffres, pas dix — et je m'étais trompé de liste

Antoine veut le croisement pour **toutes** les ressources de l'arbre, pas les
seules gemmes, avec mention explicite de quelle meta sert a quoi et pour quelle
cible.

### D'abord, une correction de ma main

J'ai annonce hier que dix coffres rendaient une gemme amalgamee, et j'ai conclu
de cette liste que `de` (Junundu Rising, The Desolation) declarait une gemme a
tort — en disant qu'Antoine soupconnait justement les vers geants.

**La liste etait tronquee.** Je l'avais lue sur 9 000 caracteres a partir d'une
ancre ; la section « Contained in » est plus longue. Elle en compte **vingt**,
et **The Desolation y figure**. Le soupcon ne tient pas, et notre `rewards`
etait juste.

> Amnytas · Auric Basin · Citadel of Zakiros · Convergence · Crystal Oasis ·
> Domain of Vabbi · Dragon's End · Dragon's Stand · Echovald Wilds ·
> Elon Riverlands · Gyala Delve · Inner Nayos · New Kaineng City ·
> Seitung Province · Skywatch Archipelago · Tangled Depths · The Desolation ·
> Verdant Brink · Janthir Syntri · Castora

Et Castora y est : les metas VoE **donnent** bien une gemme. L'exclusion de
depart tombe entierement.

### Le croisement, pose

`gw2_metas_ressources_v1.py` croise dans les deux sens — la capture d'une meta
nomme ses coffres, celle d'une ressource nomme les coffres qui la contiennent —
puis l'arbre dit quelles cibles la reclament encore. **10 metas documentees,
22 coffres connus, 19 metas encore muettes.**

Trois pieges rencontres, tous de lecture :

- **Une mention n'est pas une appartenance.** Sans bornage, la page de la gemme
  rendait des coffres cites ailleurs que dans « Contained in ».
- **Le sommaire cite les titres avant les sections.** Partir de la premiere
  occurrence de « Acquisition » decoupait le sommaire, 195 caracteres, zero
  resultat. On prend la derniere.
- **« Prioritaire » ne veut pas dire « sans source ».** La gemme est
  `free_repeatable` — parce que la meta la rend. Le critere retenu : **toutes
  ses voies renouvelables sont des metas**. Si tu sautes la meta, il ne reste
  que la forge, au cout prohibitif. Huit ressources sortent prioritaires.

### Ce qui manque pour que ce soit utilisable

19 metas sans ressource identifiee, pour deux raisons distinctes que le rapport
separe : **six n'ont pas de capture** sous un nom qu'on sache deduire
(`am`, `de2`, `di`, `ds`, `er`, `ew`…), et les autres ont leur capture mais ne
citent aucun coffre — leur page nomme la recompense autrement.

C'est la prochaine passe : elargir la lecture cote meta au-dela du seul mot
« Hero's Choice Chest », et rattacher les six captures manquantes par leur titre
reel plutot que par deduction.

## CE — 01/10/2026 : Castora n'a jamais rendu de gemme, c'était mon regex

Antoine : « c'est faux, aucune source liee aux metas de VoE ». Il a raison, et
la faute est dans ma lecture, pas dans le wiki.

Ma liste de vingt comportait **« the Janthir Syntri »** et **« and Castora »**.
Les articles en tete etaient le signe, et je les ai publies sans les voir : ils
viennent d'une phrase sur les plafonds partages — « shared daily limit with the
Janthir Syntri and Castora: Hero's Choice Chest » — ou le nom qui precede les
deux points n'est pas celui d'un coffre contenant la ressource.

Un nom de carte commence par une majuscule. Le filtre tient en une ligne ; la
liste tombe a **dix-huit**, et ni Castora ni Janthir Syntri n'y sont.

J'ai donc produit deux listes fausses de suite sur la meme question : dix par
troncature, vingt par artefact. Dans les deux cas j'ai conclu avant de regarder
ce que la liste contenait vraiment.

### L'autorite, maintenant au depot

`Amalgamated Gemstone/Events and Timers` est une **sous-page dediee du wiki**,
et elle repond directement a la question. Sa section « Event timers » cite
quinze entrees :

> **HoT** Verdant Brink · Auric Basin · Tangled Depths · Dragon's Stand —
> **PoF** Crystal Oasis · Elon Riverlands · The Desolation · **Domain of
> Vabbi** — **EoD** Seitung Province · New Kaineng City · The Echovald Wilds ·
> Dragon's End — **SotO** Skywatch Archipelago · Amnytas — **Janthir** Bava
> Nisos — plus **Convergence**

Sa section « Events » ajoute les evenements **sans timer** : Gyala Delve
(Destroy the ravenous wanderer) et Inner Nayos (The Road to Heitor, The Fangs
That Gnash, Defeat Eparch). Aucun VoE, comme annonce.

**Une seule difference avec la liste recopiee a la main : `Domain of Vabbi`**,
que la page cite (Forged with Fire, Serpents' Ire) et que la recopie a sautee.

### Le nom du fichier

La capture etait versee sous `amalgamated_gemstone_events_reward_wiki.html`. Le
titre de la page est `Amalgamated Gemstone/Events and Timers`, donc la
convention du depot — le slug du titre atteint — donne
`amalgamated_gemstone_events_and_timers.html`. Renommee.

## CF — 01/10/2026 : la liste des sous-pages, et le garde-fou qui manquait

### Ce qui est factuellement verifiable, et ce qui ne l'est pas

Antoine demande la liste **exhaustive et verifiee** des autres sous-pages
`<Ressource>/Events and Timers`. Je ne peux pas l'etablir : enumerer les
sous-pages d'un wiki demande de l'interroger, et le conteneur n'y a pas acces.
Ce que je peux verifier, je l'ai verifie :

- sur les **690 composants captures**, **une seule** page renvoie vers une
  sous-page de ce type — `Amalgamated Gemstone` ;
- c'est la page de la ressource qui porte le lien quand la sous-page existe.
  Le test est donc local, une fois la page au depot.

Donc la liste exhaustive ne se demande pas au wiki par deduction : **elle se
lit sur les pages des ressources concernees**, et onze d'entre elles manquent.

### Les ressources concernees

27 ressources encore demandees par l'arbre sont rendues par une meta. Seize ont
leur page au depot et **aucune ne porte de sous-page** — branded_mass,
inscribed_shard, mystic_coin, obsidian_shard, chromatic_sap,
raw_enchanting_stone, titan_heatstone, shard_of_bava_nisos, pouch_of_stardust,
clot_of_congealed_screams, case_of_captured_lightning, shadowstone_fragment,
mursaat_obsidian_chunk, mystic_runestone, charged_lodestone.

Onze n'ont pas de page : kralkatite_ore, difluorite_crystal, lump_of_mistonium,
blood_ruby, crystalline_ore, dragonite_ore, chak_egg, orrian_pearl_lw3,
reclaimed_metal_plate, antique_summoning_stone, bottle_airship_oil. **Ce sont
elles qu'il faut capturer** — avec quelques voisines des memes familles, quinze
URLs en file.

### Le garde-fou — ce qui a produit deux listes fausses

Les deux erreurs ont la meme forme, et ce n'est pas un hasard : **elles
viennent toutes deux d'une commande jetable**, tapee dans le terminal, dont la
sortie a servi d'argument sans etre relue. Troncature a 9 000 caracteres la
premiere fois, articles en tete d'item la seconde.

Les outils **commites** du depot n'ont jamais produit cette classe d'erreur, et
la raison est mecanique : ils sont relus, relances, et leur sortie est
confrontee a autre chose. `gw2_confronte_horaires` a 26 accords ; la relecture
des recettes a trouve ses propres faux positifs. Un script jetable n'a ni
relecture, ni confrontation, ni trace.

**Regle que je m'applique a partir d'ici** : une liste qui sert a affirmer un
fait ou a justifier une modification de donnee ne vient pas d'une commande
jetable. Elle vient d'un script commite, et elle est confrontee a une seconde
source avant d'etre annoncee. Si les deux ne concordent pas, c'est le desaccord
qu'on annonce, pas une des deux listes.

Et un reflexe de verification, celui qui aurait suffi deux fois : **regarder la
forme des elements extraits avant leur contenu**. « the Janthir Syntri » et
« and Castora » n'ont pas la forme d'un nom de carte. Une liste dont un element
commence par un article est une liste mal extraite, quel que soit son contenu.

## CG — 02/10/2026 : la question des sous-pages est close

Les quinze ressources a recompense de meta sont au depot. Verdict, verifie sur
chacune : **aucune ne porte de sous-page « /Events and Timers »**.

Sur **705 composants captures, une seule en a une** — la gemme amalgamee. Ce
n'est donc pas un patron du wiki qu'il faudrait suivre ressource par ressource :
c'est une page unique, faite pour celle-la. La question posee le 01/10 est
close, et la reponse est « il n'y en a pas d'autres a demander ».

### Ce que le lot a apporte par ailleurs

Zero apiId a poser — les quinze etaient deja identifiees. Un composant
decompose, trois aretes, puis `pile_of_foul_essence` pose au palier suivant.
Relecture a **0 manquant**, file a **1 URL**.

### Un avertissement d'Antoine qui evite un faux diagnostic

Trois des quinze pages n'ont **aucun `data-sort-value`** —
`antique_summoning_stone`, `bottle_of_airship_oil`, `fresh_winterberry` : leur
acquisition est decrite en texte, pas en table chiffree. Le parseur de couts
vendeur ne rendra donc rien sur elles, et ce n'est pas une panne. Sans cette
precision, le `couts_vendeur: []` aurait ete lu comme un defaut d'extraction —
exactement la confusion « absence de donnee / absence d'information » qui a
coute quatre passes cette semaine.

## CH — 02/10/2026 : les 19 métas muettes, réglées par la source, pas par le croisement

Le croisement par coffre plafonnait a 10 metas sur 29 et m'a fait publier deux
listes fausses. **La bonne source etait unique et deja au depot** :
`Amalgamated Gemstone/Events and Timers`.

`gw2_rewards_metas_v1.py` l'exploite, avec la confrontation que la regle du
01/10 impose : un nom retenu doit figurer **dans la sous-page ET dans le
widget**. Les 104 titres que la sous-page cite sans que le widget les connaisse
— liens de navigation, objets, phrases — tombent d'eux-memes. C'est le filtre
qui manquait a mes deux listes.

**Seize cartes retenues**, exactement celles qu'Antoine avait recopiees, Domain
of Vabbi compris :

> Verdant Brink · Auric Basin · Tangled Depths · Dragon's Stand · Crystal Oasis ·
> Elon Riverlands · The Desolation · Domain of Vabbi · Seitung Province ·
> New Kaineng City · The Echovald Wilds · Dragon's End · Skywatch Archipelago ·
> Amnytas · Bava Nisos · Convergence

### Une exception assumee

Les evenements **sans timer** — Gyala Delve, Inner Nayos — ne peuvent pas etre
confirmes par le widget : par definition il ne liste que ce qui a un horaire.
Exiger cette confirmation reviendrait a demander une preuve que la nature du cas
interdit. Leur seconde source est notre propre base, qui les porte en metas
conditionnelles (`offsetUTC: null`). `gy`, `in` et `zak` sont rattaches par leur
carte, avec un `rewards_ref` qui dit « section Events (sans timer) ».

### Resultat

**25 metas sur 29 rendent une gemme**, chacune avec son `rewards_ref`.
Cinq ajouts — `obs_sw`, `obs_am`, `obs_conv_mb`, `obs_conv_on`, `titanic` — et
**zero retrait** : aucune des vingt d'origine n'etait mal taguee. Mon soupcon
sur `de` (Junundu Rising) etait infonde, et je l'avais presente comme confirmant
celui d'Antoine.

Les quatre sans gemme : `di` Palawadan, et les trois VoE `hammerhart`, `weald`,
`shackles`. L'exclusion VoE d'Antoine etait donc juste **sauf pour les
Convergences**, qui en rendent.

### Ce que ca ne couvre pas

La sous-page n'existe que pour la gemme. Pour les 26 autres ressources a
recompense de meta, il n'y a pas d'equivalent — verifie sur les 705 captures.
Leur tagage demandera une autre methode, et le croisement par coffre reste
disponible pour ca, avec ses limites connues.

## CI — 02/10/2026 : les autres ressources, et la moitié du filtre d'extensions

### Les 26 autres ressources — 14 rattachements, 12 composants

La sous-page n'existe que pour la gemme. Pour les autres, la seule trace est la
mention « <Carte>: Hero's Choice Chest » dans leur section d'acquisition. Les
deux memes filtres qu'ailleurs, et pour les memes raisons : **majuscule en
tete** — sans quoi une phrase sur les plafonds partages rend « and Castora » —
et **la carte doit exister dans le widget**, qui sert de seconde source.

Douze composants passent les deux filtres, pour **14 rattachements** : trade
contract sur quatre cartes PoF, chunk of pure jade sur deux cartes EoD, pouch of
stardust, case of captured lightning, chak egg, reclaimed metal plate, antique
summoning stone, chunk of ancient ambergris. Chacun avec son `rewards_refs`
nommant la page et la carte.

**25 metas sur 29 portent desormais au moins une ressource** ; treize en
portent deux ou trois. Les quatre sans sont `di` Palawadan et les trois VoE.

### Le filtre d'extensions — la moitié qui est de l'ordre du fait

**`categorie` et `acces` poses sur 26 metas**, depuis le champ `category` du
widget : quatre HoT, quatre PoF, quatre EoD, quatre SotO, trois VoE, deux
Janthir, une LW4, et le reste.

La traduction en condition d'acces est directe quand la categorie est une
extension — `HeartOfThorns`, `PathOfFire`, `EndOfDragons`,
`SecretsOfTheObscure`, `JanthirWilds`, `VisionsOfEternity` sont exactement les
valeurs que `/v2/account.access` rend.

**Quatre entrees sont marquees `a_preciser`** : les instances publiques. Leur
condition depend de la convergence — Mount Balrior tient de Janthir, Outer Nayos
de SotO, Nexus of Eternity de VoE — et la categorie du widget ne les distingue
pas. Les trancher au jugé serait filtrer sur une supposition.

Trois metas restent sans categorie : `gy`, `in`, `zak`, les conditionnelles sans
horaire, que le widget ne porte pas.

### `access` est lu et conserve, rien ne le consomme encore

Le JSX lit `access` dans `/v2/account` — l'appel existait deja, `commander` en
vient — et le persiste. **Aucun affichage ne s'en sert** : le filtre n'est pas
ecrit. Il est conserve quand meme, parce qu'une synchro qui passe sans rien
garder oblige a en relancer une pour une donnee qu'on avait deja eue.

### Ce qui reste, et pourquoi je m'arrête là

Le filtre lui-meme — masquer les metas dont l'extension manque — touche
l'affichage. Les cases a cocher des episodes de Living World aussi : nouveau
sous-menu, nouvel etat persistant, et un defaut « tout decoche » a assumer. Ce
sont des choix d'interface, et les faire de nuit sans retour d'Antoine
produirait un ecran qu'il faudrait defaire.

## CJ — 02/10/2026 : les convergences pérennisées, et une règle que je venais d'enfreindre

### Les convergences

Antoine confirme ce que j'avais avance sans le poser : **chaque convergence
s'ouvre depuis une carte d'extension**, donc pas d'acces sans elle. Mount
Balrior tient de Janthir Wilds, Outer Nayos de Secrets of the Obscure, Nexus of
Eternity de Visions of Eternity.

Il demande que ce soit **perenne**. La reponse tient en une table,
`CONVERGENCES`, dans `gw2_acces_metas_v1.py`, avec sa source : le widget range
toutes les instances publiques sous « Public Instances » sans distinguer
l'extension, et c'est cette table qui comble le trou. Relancer le script la
reapplique ; une quatrieme convergence ajoutee au jeu ressortirait
`a_preciser` jusqu'a ce qu'on l'y inscrive. **Zero `a_preciser` aujourd'hui.**

### La règle que je venais d'enfreindre

Les champs `categorie` et `acces` avaient ete poses hier soir par **une commande
jetable** — la classe exacte d'operation que je m'etais interdite le 01/10, deux
entrees plus haut dans ce meme fichier. Ils n'etaient ni reproductibles ni
relisibles : si les convergences avaient ete corrigees a la main par-dessus, la
correction aurait ete perdue au prochain passage.

`gw2_acces_metas_v1.py` les **remplace et les regenere**. C'est aussi ce qui rend
la correction des convergences perenne : sans script, il n'y avait rien ou la
poser.

Et l'audit l'a rappele au passage : la provenance d'un `acces` sourcé exige
`verified` et `checked`. Ajoutes **dans le script**, pas a la main sur le
fichier produit — sinon la regeneration suivante les aurait perdus.

### Ce qui reste sans condition

`gy`, `in`, `zak` : les metas conditionnelles, sans horaire, que le widget ne
porte pas. Leurs cartes sont connues — Gyala Delve, Inner Nayos — mais rien au
depot ne dit leur extension. Pas devine.

`di` Palawadan est la **seule meta Living World** du catalogue (LW4). Toutes les
autres metas a horaire dependent d'une extension, que `access` sait dire.

## CK — 02/10/2026 : les étapes de collection consomment, et personne ne le compte

Question d'Antoine : « si une etape active demande encore des ressources de
carte, est-ce qu'elles sont prises en compte ? » **Non.**

Une etape de collection porte son mode d'obtention en **texte libre** (`how`).
Sept seulement portent un `component`, et il sert a l'inverse : rendre un
composant inutile une fois l'etape validee. Rien, nulle part, ne dit qu'une
etape non faite **consomme** des materiaux.

### L'exemple le plus net : les miroirs de Vision

`vis_astral_purif` — **sept** miroirs, chacun « Bring 10 Orichalcum Ingots, 10
Powdered Rose Quartz, 5 Glob of Ectoplasm and 3 <type> Lodestones ». Soit, pour
la collection : **70 lingots d'orichalque, 70 poudres de quartz rose, 35
ectoplasmes, 21 magnetites** de sept sortes. Aucun n'est dans le total de
Vision. (J'avais d'abord ecrit « huit » de memoire ; le controle en compte sept
— corrige avant publication.)

Meme famille cote Aurora : les bouquets de Draconis Mons demandent des Fire
Orchid Blossoms et des magnetites par dizaines, a des etapes que l'arbre ne voit
pas.

### Le contrôle, et ce qu'il ne faut PAS lui faire dire

`gw2_couts_etapes_v1.py` repere les etapes sans `component` dont le texte cite
une quantite d'une ressource de l'arbre : **114 etapes**.

**Son cumul n'est pas un manque a additionner.** Il est gonfle par les etapes
qui DECRIVENT la recette d'un objet deja compte ailleurs — d'ou « 2 400
obsidian shards » ou « 10 000 tales of dungeon delving », qui sont les recettes
des dons gen1, deja dans l'arbre. Il signale, la lecture tranche, et c'est ecrit
en tete du script. J'ai failli publier ce cumul comme un trou.

Il sous-compte aussi : « 10 Fire Orchids » ne correspond pas au nom
« Fire Orchid Blossom ». Une premiere version, qui capturait « nombre + mots »,
s'arretait au premier mot et ne trouvait rien du tout.

### La correction a faire — décision de structure, non prise

Il faut a l'etape un champ symetrique de `component` : `cost`, une table
`{composant: quantite}` que le moteur compte **tant que l'etape n'est pas
validee**, et qui disparait quand elle l'est. Ca change des totaux partout ou des
etapes coutent, et la regle de satisfaction existante doit etre etendue des deux
cotes (direct et Flask). A instruire avec Antoine.

## CL — 02/10/2026 : `cost`, le sens direct que `component` ne portait pas

Antoine a donne son accord. Une etape de collection porte desormais, quand elle
consomme des materiaux, un champ **`cost`** : `{composant: quantite}`, compte
**tant que l'etape n'est pas validee**, et qui tombe a la validation.

C'est le symetrique exact de `component`. L'un dit « cette etape faite rend ce
composant inutile », l'autre « cette etape non faite reclame ces materiaux ».

### Dans les deux moteurs, au même endroit

JSX v239 et `gw2_moteur_v3.py` posent la regle **apres les choix, avant la
cascade** : un lingot d'orichalque apporte a un miroir se developpe ensuite en
minerai comme n'importe quel autre besoin. Sans statut connu, l'etape est
reputee non faite — compter trop vaut mieux que promettre un total trop bas.
Le test de conformite compare les deux : **aucun ecart**, coûts reels compris.

### Ce qui est posé, et seulement ça

`gw2_pose_couts_etapes_v1.py` ne retient qu'une forme de texte : celle ou
l'etape **apporte** quelque chose (« Bring … »). Les recettes decrites — « Created
by a master craftsman with 100 Crystalline Ingots » — ne sont pas des
consommations, et c'est ce qui gonflait le cumul du controle a 2 400 obsidian
shards. Un nom doit correspondre exactement a un composant.

**21 etapes chiffrees** :

- les **sept miroirs** de `vis_astral_purif` : 10 orichalque, 10 quartz rose,
  5 ectoplasmes, 3 magnetites chacun ;
- **quatorze etapes d'Aurora** : fleurs, bouquets et bouquets charges des
  druides de Draconis Mons, la Druid Runestone, le Vision Crystal.

Effet mesure : Vision **3 000 -> 3 070** poudres de quartz rose, Aurora
**250 -> 286** Fire Orchid Blossoms. Les cartes du JSX suivent, avec un `aside`
qui dit d'ou viennent les nombres.

### Ce qui reste, non posé à moitié

Quatre bouquets d'Aurora disent « Bring 10 **Fire Orchids** and 5 Charged
Lodestones ». « Fire Orchids » n'est pas le nom du composant, « Fire Orchid
Blossom ». C'est vraisemblablement le meme objet — les etapes soeurs disent
« Blossoms » — mais **un texte qui ne se resout pas entierement n'est pas pose
a moitie** : il aurait compte les magnetites et oublie les fleurs. Listees, a
trancher. Soit 40 fleurs et 20 magnetites encore hors du total.

### Et une asymétrie de ma main, attrapée par le test

Le test de symetrie des synchros a refuse le passage : `_access`, ajoute hier
soir au chemin direct, n'existait pas cote Flask. Avec le serveur allume, le
filtre d'extensions n'aurait rien recu. `gw2_flask_server_v46.py` le pose aussi.
J'avais lance ce test hier — il est passe parce que je l'avais lance avant
d'ajouter le champ, pas apres.

## CM — 02/10/2026 : les fleurs assimilées, les accès complets, et les ressources enfin visibles

### Fire Orchids = Fire Orchid Blossom

Antoine confirme que c'est le meme objet, nomme autrement. `gw2_pose_couts_etapes_v2`
porte une table `SYNONYMES`, chaque entree disant qui l'a confirmee : un synonyme
ne se devine pas. Les quatre bouquets d'orage se posent entierement — 10 fleurs
et 5 magnetites chacun. Aurora : **286 -> 326** Fire Orchid Blossoms.

### Les trois métas sans timer ont leur accès

`gw2_acces_metas_v2` porte une table `SANS_TIMER`, lue par la carte puisque le
widget ignore ces metas : **Gyala Delve -> End of Dragons**, **Inner Nayos ->
Secrets of the Obscure**. La seconde est notee « il me semble » par Antoine, et
la nuance est gardee : `verified: false`, reference qui le dit. On sait ainsi a
quelle confiance on filtrera. **29 metas sur 29 ont desormais une condition
d'acces.**

### Ce qu'une méta rend, sur sa carte

Chaque carte de meta de l'onglet Activites affiche sous son nom **les ressources
qu'elle rend**, avec le besoin restant pour la legendaire affichee :

- ★ et liseré dore : **prioritaire** — toutes les voies renouvelables de la
  ressource sont des metas, sauter la meta c'est payer la forge ;
- besoin a zero : la ressource reste affichee, **estompee**. La masquer ferait
  croire que la meta ne rend rien ;
- tri : ce qui sert encore passe devant, la priorite ensuite.

Teste sur les vraies donnees : Verdant Brink rend une gemme ★ et une Reclaimed
Metal Plate ★, Casino Blitz une gemme ★ et un Trade Contract non prioritaire
(il a une source vendeur), Palawadan rien. Textes passes par les cles i18n du
projet, pas en dur.

Rien n'est encore masque ni filtre : c'est l'affichage, pas le tri. Le filtre
par extension s'ajoutera par-dessus quand le menu existera.

## CN — 03/10/2026 : le filtre d'accès, et pourquoi le catalogue attend

### Le panneau « Accès au contenu »

En tete de l'onglet Activites, un bouton ⚙ ouvre le panneau convenu le 02/10 :

- **Extensions** : lues sur le compte (`/v2/account.access`) quand l'API a
  repondu — affichees, non modifiables. Sinon modifiables a la main, avec la
  mention de la provenance. Si l'API repond apres une saisie manuelle, elle
  l'emporte et l'ecart est affiche.
- **Living World** : par saison, toujours a la main (l'API ne l'expose pas),
  defaut decoche, bouton « Je possede toutes les saisons ».
- Les deux listes se **derivent du catalogue** (`meta_events[*].acces`) : aucune
  extension ni saison ecrite a la main dans le JSX. Aujourd'hui : six
  extensions, une saison (LW4, pour Palawadan).

**Inconnu n'est pas « non possede ».** Sans API et sans aucune declaration, les
extensions ne filtrent rien — sinon un premier lancement masquerait tout le
contenu d'extension. Une meta sans `acces` (les 12 fermes `isTimeless`,
`bf_meta`) n'est jamais masquee.

Le filtre est pose au point d'entree des calculs (`allTimedMetas`,
`timelessMetas`) : le chainage `getBestNext` et la liste « a venir » en heritent,
donc une meta masquee ne reapparait pas comme « suivante ». Le nombre de metas
masquees est affiche, leurs noms en infobulle.

Non fait : le depliage **par episode** — aucune capture au depot ne liste les
episodes, et aucune donnee ne porte une condition plus fine que la saison.

### Le catalogue : la mesure contredit « 0 desaccord »

Avant de remplacer les 20 tableaux `metas:` du JSX, confrontation champ par
champ des 26 entrees communes. Le JSX en porte **39** (une par cle, aucun
doublon entre legendaires) : 26 au catalogue, `bf_meta`, 12 fermes sans horaire.

La confrontation des horaires disait zero ecart ; elle ne regardait que les
horaires appaires au widget. Champ par champ :

| champ | ecarts | nature |
|---|---:|---|
| `name` / `subname` | 18 / 21 | conventions inversees, et le `subname` des sources est un LIEU (« Wyvern Matriarch », « Grand Sahil Casino », « 4 lanes ») |
| `tip` | 17 | deux redactions du meme conseil |
| `next` | 17 | forme (chaine contre liste) ; une vraie divergence : `nk` -> `ew` cote sources, rien cote JSX |
| `durationMin` | 1 | `shackles` : JSX 50, sources **25** (widget) — l'ecran affiche faux |
| `wpCode` | 1 | `ew` : JSX `[&BLsNAAA=]`, sources `[&BNMMAAA=]` |

La fusion n'est donc pas mecanique : elle choisit des valeurs affichees. En
attente d'arbitrage.

## CO — 03/10/2026 : le catalogue des métas est la seule table

Arbitrages d'Antoine du 03/10 : `map` + `name`, conseils des sources, `wpCode`
de `ew` au backlog, `shackles` a 25. `gw2_fusion_catalogue_metas_v1.py` fait la
passe ; le JSX v242 ne declare plus que des cles (`metas: ["vb", "td", …]`), et
`metaDuCatalogue()` donne au rendu son titre (`map`) et son sous-titre (`name`).

**Six metas avaient deux cles**, une par legendaire : `obs_sw`/`sw`,
`obs_am`/`am`, `obs_conv_mb`/`mb`, `obs_conv_on`/`conv`, `titanic`/`bn`,
`obs_spider`/`zak`. Horaires identiques, verifies avant fusion ; la canonique
garde son texte (plus complet) et ses champs, la copie comble ses trous.
**36 metas** au catalogue : 24 a horaire, 12 sans (`isTimeless`).

### Ce qui change a l'ecran (76 champs, mesures par `metaDuCatalogue`)

- titres/sous-titres harmonises — les convergences s'affichent sous leur carte
  d'entree (La Tour du sorcier, Lowland Shore) ;
- `shackles` : fenetre 50 -> **25**, et 50 passe en temps de jeu ;
- temps de jeu affiche la ou le catalogue en portait (Palawadan, convergences,
  Weald) ;
- copies des onglets Obsidienne et Orrax alignees sur la canonique :
  Titanic Voyage efficience B -> A, population LFG -> bon ; convergences avec
  leur vrai point de passage et code au lieu d'un code vide ;
- les trois entrees d'Ad Infinitum et Mistburned sans carte : le rendement
  (« ~3 pages/jour ») rejoint le nom.

### Retire, a restituer si besoin

- `ew.wpCode` = `[&BNMMAAA=]` (sources). **Indice** : c'est exactement le code
  de `gy`, Gyala Delve — probablement une copie, ce qui donnerait raison au JSX.
- `zak` : `Citadel of Zakiros Waypoint` / `[&BHMMAAA=]` (sources) ; garde la
  valeur affichee de l'onglet Obsidienne, `[&BHYOAAA=]`. A verifier en jeu.
- `nk.next` = `["ew"]`, `nextDelayMin` 40 — en attente d'Antoine.

### Transversal

- **Confrontation des horaires v4** : un seul appariement (`main()` en portait
  une copie), plus de section JSX, plus de `subname`. `er` epingle sur son
  segment, son nom anglais etant devenu « Doppelganger ». **21 accords, 0 ecart,
  0 duree contredite** ; 3 sans segment (`bf_meta`, `gy`, `in`), 12 sans horaire.
- `gw2_acces_metas_v3`, `gw2_rewards_metas_v3`, `gw2_metas_ressources_v2` : chemin
  de la confrontation et `subname` retires. Relances a blanc : **aucun
  changement** des acces ni des recompenses.
- **Audit v57** : `check_catalogue_metas` (cle citee absente, `subname`,
  decalage hors intervalle, horaire sur une ferme, `next`/`rewards` inconnus) —
  teste en negatif. Et `meta_events` rejoint les familles de la regle des
  plafonds en prose : les conseils des fermes, invisibles a l'audit tant qu'ils
  vivaient dans le JSX, sont lus. Elle a sorti quatre cas :
  - `lw4_istan`, `lw4_dragonfall` : « 50 noeuds/compte/jour », deja structure
    sur `volatile_magic` et `mistborn_mote` -> `cadence_ref` ;
  - `eb`, `dm`, `ld` : « vendeur 5/jour/perso », structure **nulle part**. Le
    poser sur le composant changerait les delais projetes sans source : remonte
    en cadence sur la ferme, ou aucun calcul ne le lit, `verified: false`.
    A trancher.
- 80 avertissements contre 68 : les 12 nouveaux sont « horaire sans `ref` »
  (vb, td, ab…) — vrais, ces horaires sont confirmes par la confrontation mais
  ne citent pas leur source.

## CP — 03/10/2026 : vendeurs de cœur LW3, et conseils contre champs

Antoine confirme le mecanisme : ballots de la ressource de la carte, coeur
fini, par personnage. Le wiki donne les nombres — et le « 5/jour/perso » des
conseils etait faux : 5 etait le nombre de vendeurs d'Ember Bay.

| carte | coeurs | ballot | par perso et par jour | source |
|---|---:|---:|---:|---|
| Ember Bay | 5 | 3 Petrified Wood | 15 | wiki:Ember_Bay |
| Draconis Mons | 4 | 3 Fire Orchid Blossom | 12 | wiki:Draconis_Mons, Tactician_Tunelle |
| Lake Doric | 6 | 3 Jade Shard | 18 | wiki:Bundle_of_Jade_Shards |

Ces sources rejoignent la cadence des composants (`per_character`, format de
la kralkatite) : **les delais projetes changent**, sur un personnage. La
cadence provisoire des fermes disparait (`cadence_ref`). Le wiki corrige aussi
les conseils : « Seimur Oxbone » est le sous-chef de Grawnk Munch, Ember Bay ne
vend pas de Fire Orchid, « Savage Rise » est a Draconis Mons. Les trois fermes
passent en `per_char_hearts`.

### Coherence conseils / champs

Nouveau controle `gw2_coherence_conseils_metas_v1` (horaire, chainage, acces,
ressource, priorite). Premiere passe : **9 constats**, horaires et chainages
tous coherents. Tous des ressources nommees dans le texte et absentes de
`rewards` — la puce de priorite ne pouvait pas les voir :

- fermes LW3, Istan (Magie volatile, et la kralkatite des trois coeurs),
  Dragonfall : ajoutees, chacune avec sa source ;
- Hammerhart, Weald : monnaies de carte de Castora, la capture dit « par les
  evenements de la carte » ;
- reste 1 : Petrified Wood a Draconis Mons, que le wiki ne confirme pas.

`co` disait « priorite absolue » en dur ; la priorite affichee se calcule sur
ce qu'il reste a farmer. Retire, l'efficience S porte deja l'information.
`nk -> ew` restitue.

Transversal : les fermes declarant maintenant leur ressource, leurs cartes
affichent les puces. Le rendu des puces devient un composant unique
(`PucesRessources`), utilise par les deux cartes, et le nom passe par `NX`
(il s'affichait en anglais cote francais). rewards_metas et acces_metas
relances a blanc : rien a changer.

## CQ — 03/10/2026 : un champ mort, une provenance en double

Accord d'Antoine sur les deux.

- **`nextDelayMin` supprime** des 21 metas qui le portaient
  (`gw2_purge_next_delay_v1`). Rien ne le lisait depuis la fusion ; `nk` en
  portait deja un faux (40 min pour un ecart de 60).
- **`rewards_ref` fondu dans `rewards_refs`** : la provenance de la gemme
  amalgamee devient `rewards_refs["amalgamated_gemstone"]`, comme celle de
  toute autre recompense. Fait par `gw2_rewards_metas_v4`, qui l'ecrit
  desormais la ; verifie sans perte (chaque ancienne reference retrouvee mot
  pour mot, aucune recompense modifiee, rien hors `meta_events` n'a bouge).
- Toutes les recompenses du catalogue ont maintenant une provenance : l'audit
  **v58** en fait une erreur, et refuse le retour des deux champs. Teste en
  negatif sur les trois regles.
- `gw2_vendeurs_coeurs_lw3_v2` ne pose plus `nextDelayMin`.

## CR — 03/10/2026 : accès des fermes, références d'horaire, points de passage

**Accès des fermes** (`gw2_acces_metas_v4`). Les fermes `isTimeless` n'avaient
aucune condition : le filtre Living World ne masquait que Palawadan. Leur
condition se lit sur la page de leur carte (« zone available via Living World
Season N episode … »), relue sur le wiki le 03/10 :

- LW3 : Ember Bay, Bitterfrost Frontier, Lake Doric, Draconis Mons, Siren's Landing ;
- LW4 : Domain of Istan, Dragonfall ;
- Janthir Wilds : Mistburned Barrens (zone de l'extension, mise a jour Repentance).

Le panneau d'acces derive maintenant **LW3 et LW4**. Les trois entrees
d'Ad Infinitum (fractales) restent sans condition : contenu de base.

**`bf_meta` exclue volontairement.** Elle est rangee a Bitterfrost Frontier,
mais son horaire vient de la page « The Frozen Maw » — boss de monde de
Wayfarer Foothills, contenu de base (DETTE § BZ). La carte et la source se
contredisent : la marquer LW3 la masquerait peut-etre a tort. A trancher par
Antoine.

**References d'horaire** (`gw2_refs_horaires_v1`). Les 11 metas en accord avec
le widget citent maintenant leur segment, avec `checked` et `verified` : 80 -> 69
avertissements. Seule `bf_meta` reste sans reference (pas de segment).

**Points de passage** (`gw2_coherence_conseils_metas_v2`, regle W : un meme code
sur deux cartes). Trois metas partagent `[&BNMMAAA=]` (Seitung Province,
Dragon's End, Gyala Delve) — le code que portait deja `ew` a tort ; `am` et `in`
partagent `[&BDQOAAA=]` (Amnytas, Inner Nayos). Au moins quatre de ces cinq codes
sont faux. Le wiki n'expose pas les codes de lien dans son texte (rendus par
script) : verification en jeu necessaire. Le nom aussi : le wiki dit
« Monastery Waypoint », pas « Shing Jea Monastery Waypoint ».
