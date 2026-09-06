# Dette — arbre de craft chiffre

Mesure du 05/09/2026 sur `gw2_sources_v203.json`, controle `check_needed_for_chiffre` (audit v29).

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


## Suite

1. Deplier les 100 aretes aplatie, par famille, en verifiant l'invariance des
   totaux a chaque etape.
2. Chiffrer les 4 vrais trous du bloc C3.
3. Capturer les pages du bloc B restantes.
4. Supprimer `needed_for` des sources, index inverse calcule cote JSX, regle
   d'audit en erreur.
5. Rendu recursif n niveaux dans l'onglet Composants, chaque noeud affichant
   besoin / stock / manque — le calcul existe deja (`totals[compId]` +
   `gtStocks[apiId]`).
6. Integrer les 231 cibles absentes (branche propre a chaque arme : Gift of
   Metal, Gift of Wood, lingots, tissus, pierres) depuis
   `gw2_material_lists_v1.json`.
7. `recipe` ne conserve que ce qui n'est pas chiffrable : voies alternatives de
   la Forge mystique.
