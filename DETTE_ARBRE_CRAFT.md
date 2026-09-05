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
`PAGES_A_CAPTURER_ARBRE_CRAFT.md`.


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
