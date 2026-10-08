# Plan du restant — LegendaryTracker_GW2

Etabli le 04/10/2026 sur `gw2_sources_v355.json` (mis a jour sur v383) / `gw2_legendary_tracker_v244.jsx`,
apres regeneration de tous les rapports de rapprochement. **Point d'entree unique** :
le detail historique reste dans `BACKLOG.md` et `DETTE_ARBRE_CRAFT.md`, mais ce qui
est a faire est ici, range par lot de travail. Un lot est fini quand sa case est
cochee et le rapport cite regenere.

Qui peut le faire : **C** = Claude seul (session chat) · **A** = Antoine (jeu,
decision) · **W** = capture wiki (session cowork, ou Antoine) · **C+A** = Claude
propose, Antoine valide (refactor structurel, chiffres affiches sans source).

---

## Etat de depart (mesure du 04/10)

| rapport | outil | chiffre |
|---|---|---|
| `ARBITRAGES.md` | `controle/gw2_arbitrages_v8` (apres `parseurs/gw2_edges_wiki_v14`) | ~~81 / 37~~ → **13 desaccords** apres C1-C3 (v358) : 4 « deja compte par cascade », 28 « cout vendeur », 1 « ecart de compte » |
| `CONFRONTATION.md` | `controle/gw2_confronte_v5` ~~370~~ → ~~248~~ → ~~158~~ → ~~116~~ → ~~96~~ → ~~99~~ → ~~98~~ → **92 ecarts** (v365) — colonne « wiki » indicative, pas verite |
| `CONFRONTATION_TOTAUX.md` | `controle/gw2_confronte_totaux_v9` 943 accords, 0 trou, 94 excedents expliques, **76 excedents nus** apres C1 (+5 : orbes d'opale de Bifrost/Minstrel, precurseur d'Ipos — branches que la table n'ouvre pas, voir C1) |
| `CONFRONTATION_TABLES.md` | `controle/gw2_confronte_tables_v4` | 2 noms non resolus (Tribute to the Exitare, Tribute to the Call of the Void) |
| `CONFRONTATION_AGREGATS_v3.md` | `controle/gw2_confronte_agregats_v2` | 53 accords, 0 depassement |
| `RELECTURE_RECETTES_v8.md` | `controle/gw2_relecture_recettes_v5` | 0 manquant, **4 non relies, 36 en trop**, 1 732 occurrences non decomposees |
| `COHERENCE_CONSEILS_METAS_v5.md` | `controle/gw2_coherence_conseils_metas_v2` | 6 constats (5 codes de point de passage, 1 ressource) |
| `ARETES_NON_SOURCEES.md` | `controle/gw2_aretes_non_sourcees_v3` (apres `parseurs/gw2_edges_wiki_v14`) | **22 aretes**, toutes expliquees ; 0 voie concurrente (C6) |
| `PAGES_A_CAPTURER.md` | `captures/gw2_pages_a_capturer_v14` | 1 URL |
| audit | `controle/gw2_audit_v60` | 0 erreur, 62 avertissements (v365), plus aucun « compte deux fois » |

**Migration vers `collections{}` : terminee sauf l'Obsidienne.** Les dix
legendaires que le backlog donnait « restants » (§ Migration) sont tous migres
(Coalescence 3, Selachimorpha 4, Eikasia 7, Perfected Envoy 2, Endless Summer 4,
Stella Radians 2, Orrax 8, Strife Unending 2 ; Vision 20 et Aurora 6 fusionnes) ;
plus aucun `achievements[]` ni `raidAchievements` ne subsiste. Seule
l'Obsidienne a des collections en jeu (6 « Arcanum ») sans `collections{}` :
bloquee par le lot W1.

---

## Lots de captures wiki (W)

### W1 — Obsidienne : les six collections Arcanum · W puis C
Debloque la derniere migration `collections{}`. Pages de collection (tableau
« Collection items ») et bits du dump API pour les identifiants 7214 (tete),
7098 (epaules), 7096 (torse), 7219 (gants), 7240 (jambes), 7051 (bottes).
- [ ] 6 pages de collection Arcanum (titres exacts a lire sur `obsidian_armor.html`)
- [ ] `referentiel/gw2_dump_bits_v8` relance sur ces 6 ids (l'API GW2 n'est pas
      joignable depuis le bac a sable chat : a lancer chez Antoine ou via Flask)
- [ ] puis C : creation des 6 collections au format Ad Infinitum (`how`, `how_ref`)

### W2 — File du detecteur · W
- [ ] `Pile_of_Foul_Essence` (cout d'obtention inconnu)
- [ ] `Tribute_to_the_Exitare`, `Tribute_to_the_Call_of_the_Void` (noms non resolus des tables)

### W3 — Metas et cartes · W
- [ ] `The_Frozen_Maw` et la page meta de `Bitterfrost_Frontier` : trancher ce
      qu'est `bf_meta` (voir A1)
- [ ] `Draconis_Mons` section « Map resources » complete : Petrified Wood y est-il ?
- [ ] point de passage d'Ember Bay pour la ferme `eb` (le champ a ete retire, faux)

### W4 — Arbitrages « cout vendeur » (28 cas apres C1) · W puis C
Les pages de vendeur (cout HTML non standard) qui tranchent chaque cas.
Composants : `tales_of_dungeon_delving` (20), `volatile_magic` (2),
`trade_contract` (2), `crystalline_ingot` (2), `unbound_magic`,
`sweet_treated_pine_plank`, `dragonite_ore`… — liste exacte dans
`ARBITRAGES.md` § COUT VENDEUR. Lire la page AVANT de conclure : « le wiki n'est
jamais faux, notre lecture l'est ».

### W5 — Aurene's Rending · W
- [ ] une table qui porte trefles 39 / pieces 250 / lingots 250 pour la seizieme
      gen3 (BACKLOG Ouvert 24/09 §2). Sans elle, rien n'est pose : deduire du
      patron generationnel est interdit.

### W6 — Doubles comptes signales par l'audit · W
- [x] Klobjarne (matrices), Transcendence (matrices), Eternity (poussiere) :
      tranches le 04/10 par arbre ou recette.
- [x] Aurora (arbre ajoute le 04/10) : la cle 250 est l'estimation des 77
      trefles du Mystic Tribute, distincte de la chaine ; 250 → 249 (arbre,
      comme Vision et Coalescence), chevauchement declare.
- [x] Klobjarne, obsidienne (revele une fois Aurora levee) : cle 50 = Gift of
      Expertise deja chaine, trefles absents ; 50 → 123, total 280 → 353 =
      arbre. `integration/gw2_confrontation_c3_v4`.
- [ ] Aurora, reste a l'arbre : pieces (249) et eclats d'esprit des trefles
      non comptes (convention des autres legendaires a verifier : seuls
      ecto/obsidienne ont une cle « trefles ») ; Gossamer Stuffing et Dragon
      Hatchling Doll Eye (25 ectos chacun, collection → C5) ; Vision Crystal
      present au tracker, absent de l'arbre (30 obsidiennes, 500 dragonite...).

### W7 — Noms francais des sous-zones de farm (56) · W
Source acceptable : wiki FR ou client du jeu. Jamais une traduction de tete.
Noose Road, Compass Plaza, Craven Blight, Cathedral of Silence, Fields of Gold,
Cathedral of Zephyrs, Cathedral of Eternal Radiance, Karst Plains, Drowned Brine,
Valley of Lyss, Blighted Battleground, Plinth Timberland, Signal Peak, Waywarde
Way, Strait of Sacrilege, Fallen Ruins, Fallen Mountains, Aberrant Forest,
Southern Mountains, Frostborn Cascades, Fragmented Wastes, Haunted Canyons, Rata
Arcanum, Golemancer's Tomb, Mariner Landing, Zeta Vault, Savage Rise,
Southwestern / Northwestern / Southeastern / Northern Silverwastes, Sharp Valley,
Chak Nest, Exhumed Delve, Southern Barbed Gate, Northern / Central Blighting
Tower, Cereboth Canyon, Viathan's Arm, The Heartwoods, Queen's Forest, Godslost
Swamp, Phinney Ridge, Overlook Caverns, Provernic Crypt, Cornucopian Fields, The
Bloodfields, Scorched March, Sand Jackal Run, The Darklands, Broken Shelf, Mad
King's Labyrinth, Glory's Steps, Echoslab Arches, Crystalwept Groves, Champion's
Shield.

---

## Lots en jeu et decisions (A)

### A1 — Decisions en attente
- [x] **Cout des trefles mystiques** — tranche le 04/10 par Antoine : voie
      par defaut = pistes de recompenses PvP / McM + Wizard's Vault ; la
      Forge est une alternative. Les cles a plat ne portent plus le cout de
      Forge (`integration/gw2_cout_trefles_v1`, sources v366, JSX v244) :
      15 legendaires a arbre (part « trefles » lue dans l'arbre, reste de la
      cle conserve), 35 armes gen1/gen3 (250 pieces = « ~250 Mystic Coins »
      de la prose). Apres retrait, tracker = arbre - trefles partout ou ils
      etaient egaux. Eikasia : ses 80 ectos n'etaient pas des trefles mais le
      surcout de Lyhr (ci-dessous).
- [x] **Conseils du trefle alignes** (regle confirmee le 04/10 : trop
      couteux, l'alternative est proposee mais jamais par defaut, preferer la
      timegate). `best` vendor → reward_track, conseils Lyhr / Forge /
      `cap_note` / `note` / `free_sources_note` reecrits, aucune quantite
      (`integration/gw2_trefles_voie_defaut_v1`, v368).
      Reste ouvert : l'onglet Timegates projette les semaines sur les vendeurs
      plafonnes payants (45/sem) ; les pistes, sans plafond chiffrable, en
      sont exclues. Changer la projection change un chiffre affiche → A1.
- [x] **Gifts Blood/Bones/.../Venom : voie par defaut = recette en or**
      (decision du 04/10). Recettes 10 or chacune, une fois par compte,
      artisan 400 ; Lyhr = +10 ectos par Gift, 80 par poids. Les 80 ectos
      Lyhr d'Eikasia retires (`integration/gw2_surcout_lyhr_v1`, v367) ; la
      voie recette est deja affichee par les `recipe_gift_*`
      (`account_unlock`). Obsidienne ne comptait pas de surcout Lyhr.
- [x] Neutralized Titan Alloy (Klobjarne) : ferme le 04/10, pas de choix.
      Recette (artisan 400) 3 ectos + 5 minerai + 5 ambre + 5 lingots ;
      vendeur 4 + 7 + 7 + 6 — plus cher sur chaque ingredient. La chaine
      compte la recette, c'est le minimum. L'arbre gw2efficiency traite
      l'alliage en feuille (inventaire ou achat), d'ou son ecart.
- [x] `gift_of_adventure_voe` et `testimony_of_jade_heroics` supprimes
      (accord du 04/10, `integration/gw2_suppressions_v1`).
- [ ] `bf_meta` : meta de Bitterfrost Frontier, ou Frozen Maw (Wayfarer
      Foothills) ? Conditionne son acces et sa `ref`.
- [ ] § 12 quater : « selections de la liste » — nom de l'ecran.
- [ ] 16 excedents gen3 (300 contre 250 reactifs) : ouvrir un champ pour les
      declarer, ou les laisser en excedent signale ?

### A2 — Releves en jeu
- [ ] codes de point de passage : Seitung Province (`sp`), Dragon's End (`de2`),
      Gyala Delve (`gy`) — tous trois `[&BNMMAAA=]` ; Amnytas (`am`) et Inner
      Nayos (`in`) — tous deux `[&BDQOAAA=]` ; Echovald (`ew`) ; Zakiros (`zak`)
- [ ] Inner Nayos = Secrets of the Obscure (« il me semble », 02/10)
- [ ] les 23 feuilles de recette se cochent-elles ? (pont `/v2/account/recipes`,
      scope `unlocks`, jamais appele depuis le bac a sable)

---

## Lots Claude (C) — rapprochement

### C1 — « Deja compte par cascade » · C — ✅ FAIT le 04/10 (sources v356, 47 → 4)
`integration/gw2_arbitrage_cascade_v2` ; detail dans sa docstring. Presque aucun
cas n'etait un double compte :
- [x] groupe de choix incomplet : Tribute to the Man o' War entre dans `tribut_20`
- [x] arete fausse : les esprits du Gift of the Rider coutent 75 **Elegy Mosaic**
      (pas des Trade Contracts) — Coalescence : 300 contrats → 300 mosaiques
- [x] aretes accrochees au grand-parent, total inchange : tessons et fioles de
      Mursaat Ruins, joyau et masse de l'inscription de Diviner, trefles d'Orrax
- [x] deux noeuds distincts (hausses sourcees) : Refined Homestead, alliage titan,
      Ars Goetia, Gift of Bones, nourriture d'Orrax, orbe d'opale, planche du
      Mists Gate Residue
- [x] ecto d'Orrax : 1 350 comptes deux fois (cle a plat + essences amalgamees),
      3 520 → 2 320, arbre gw2efficiency lu en hierarchie
- [x] lodestones (15) et raffinage a un ingredient : regle d'extraction
      (`parseurs/gw2_edges_wiki_v14`), aucun chiffre ne bouge
- [ ] **reste 4** : Memory of Battle / Mist Band de Conflux (choix vendeur a
      trois voies, a classer avec W4) ; tickets PvP et Shard of Glory via Gift
      of Competitive Dedication — poser l'arete toucherait Ardent Glorious
      (+6 000 tessons), bloque tant que ses pieces ne sont pas capturees
- [ ] decouverts en route, pour C4 : `opal_crystal` n'est pas un composant ;
      poivre d'Orrax 1 000 contre 1 500 a la table (piles de l'Entree et du
      Side Course non reliees) ; +100 Ipos du precurseur, absent de la table

### C2 — « Ecart de compte » · C — ✅ 2 sur 3 le 04/10 (sources v357)
`integration/gw2_arbitrage_compte_v1`, aucun total ne bouge :
- [x] `ancient_coin` : 20 250 (Klobjarne) = 250 Gift of the Ursus + 100 Mursaat
      Runestones a 200 ; les 50 000 d'Orrax = 250 runestones. Deux aretes
      remplacent les deux cles.
- [x] `curious_mursaat_currency` : 125 = 25 Ursus (arete) + 100 Shards of
      Janthir Syntri (cle) ; chevauchement declare, deux noeuds a la table.
- [ ] `ascended_shard_of_glory` / Transcendence via Star of Glory : passe par
      Gift of Competitive Dedication, donc par Ardent Glorious — meme blocage
      que les deux restes de C1.

### C3 — Confrontation des totaux · C — 3 passes faites le 04/10 (sources v358 a v360)
247 → **158 ecarts**. `controle/gw2_confronte_v4` applique enfin `alt_groups`
(la v3 additionnait les six monnaies des tributs : 60 faux ecarts gen2), et
`integration/gw2_confrontation_c3_v1` tranche sur pages et arbres lus en
hierarchie :
- [x] 8 dons de donjon gen1 a 500 Tales (liste, pas choix) : +500 sur les 21
      gen1 ; la cle d'Orrax (500) devient l'arete Gift of Ascalon
- [x] Conflux / Warbringer : dragonite, poussiere et fragment 2 250 → 1 250
      (cle a plat en troisieme noeud, chevauchement retire)
- [x] hydrocatalytique d'Aetheric Anchor et Stella 1 000 → 500 ;
      thermocatalytique de Klobjarne 3 130 → 2 050
- [x] Transcendence : Shard of Glory 2 500 → 2 250, Ascended 500 → 900
- [x] Memory of Battle de Triumphant Hero : chevauchement declare (2 noeuds)
- [x] **2e passe (v359)** : Ad Infinitum. Le decoupage `--racine` du parseur
      FONCTIONNAIT (note precedente fausse). L'arbre porte 8 Pristine Mist
      Essence (5 Unbound + 2 Upper Bound + 1 Finite Result), la chaine 5 ;
      les 3 manquantes deviennent une cle a plat de l'essence (chevauchement
      declare). Matrices 975 → 600, reactif 780 → 690, ecto 1 059 → 1 054,
      cubes/balles 5 → 8, Rare Essence of Luck 50 → 80 — tous = arbre, sauf
      +15 ectos / +100 reactifs voulus (Damask, Elonian Leather, Spiritwood
      decomposes par leurs recettes, feuilles dans l'arbre).
      `integration/gw2_confrontation_c3_v2`.
- [x] **outil** : `controle/gw2_confronte_v5` respecte `qty_overlap_verified`
      dans la colonne « recettes » (la v4 retirait la cle d'un noeud distinct).
      158 → 116.
- [x] **3e passe (v360)**, `integration/gw2_confrontation_c3_v3` :
      arete fausse `cube_stabilized_dark_energy <- gift_of_research` retiree
      (recette du Gift of Research sans cube ; la page du cube ne le cite qu'en
      navbox ; arbres AA 1, Stella 0, Klobjarne 2) — 23 legendaires perdent
      1 cube, 1 balle, 75 matrices. Klobjarne : matrices 375 → 150, ecto
      1 971 → 1 353 (= arbre + 300 alliage titan par recette + 12 residu).
      Endless Summer : Gift of the Sun relie a ses 3 dons (2 Light, 2
      Condensed Might, 2 Condensed Magic), 31 cles a plat echangees a total
      egal, + poussieres 500/100/100, orichalque 500, cuir 500 (= arbre).
      Transcendence : matrices 170 → 95 (cle 95 → 20, chevauchement declare).
- [x] **outil** : `controle/gw2_confronte_agregats_v2` lit les totaux du
      moteur (la v1 avait sa propre cascade, un composant a deux chemins ne
      transmettait que le premier : 2 faux « DEPASSE ») et reprend la suite
      de numerotation au lieu du premier trou.
- [ ] **reste** :
  - Ad Infinitum : 9 Ball of Dark Energy des objets de collection Aetherblade
    (17 a l'arbre, 8 en chaine) → C5. Dragonite / fragment / poussiere /
    reliques fractales egalent l'arbre ; l'ecart du rapport est d'outil
    (aretes Vision Crystal / Gift of Ascension non proposees par les captures).
  - Klobjarne : Neutralized Titan Alloy — ferme (A1), la recette est le
    minimum.
  - Endless Summer : orbe du Gift of Infused Gems (une recette par orbe,
    l'arbre prend Emerald, le tracker Ruby) et Gift of the Beach (Coral Orb,
    page non capturee) → W. Sun Bead absent du tracker.
  - Ecto d'Obsidienne par piece : une seule piece lue, pas d'extrapolation → W.
  - Controle transversal : fait, lot C6.

### C6 — Aretes non sourcees · C — ✅ outil, deux passes le 04/10 (sources v361, v363)
`controle/gw2_aretes_non_sourcees_v3` liste toute arete de la donnee vers un
parent dont les captures lisent la composition sans la proposer. Ne du cas
cube <- Gift of Research (C3). 30 lignes au premier passage :
- [x] **1 fausse** : `gift_of_adventure_voe` -> Gift of Castoran Mastery (la
      recette demande UN Gift of Adventure, id 105979 = `gift_of_adventure`).
      Retiree par `integration/gw2_aretes_fausses_v1` ; seul effet, le don
      fantome sort de Selachimorpha. Suppression du composant : A1.
- [x] **29 justes**, raison par famille — a relire si le chiffre bouge :
  - seconde recette ou voie au choix, le parseur ne garde que les
    ingredients communs : 3 Superior Sigils (recette actuelle 15 lucent +
    2 lodestones + 10 ectos + 1 symbole ; « historique » a l'orichalque),
    Simple Olmakhan Bandolier (gossamer / cuir / orichalque), Pile of
    Putrid Essence (vin / Mystic Binding Agent) ;
  - nom que `to_id` ne resout pas : Memory Essence Encapsulator (lien
    « Ectoplasm »), Mystic Essence of Annihilation (Glob of Dark Matter),
    `legendary_insight` contre `legendary_insight_consumable` (Gift of
    Compassion, Gift of Prowess), Gift of Adventure (ambiguite listee par le
    parseur) ;
  - Castoran Heroics (certificate, essence of animosity) : juste, voie
    vendeur active ; la capture ne propose que la recette Jade (voir 2e
    passe). Badge of Honor des Commander's Wings ;
  - or (`gold_coin`), feuilles de recette, objets de collection (Nyr Hrammr,
    Orrax Contained), tributs Exitare / Call of the Void.
- [x] **2e passe** : `parseurs/gw2_edges_wiki_v15` lit les champs `wiki` et
      `wiki_redirects` de la donnee (la relecture des recettes les lisait
      deja) et liste les noms non resolus (317, surtout des objets hors
      tracker). `integration/gw2_redirections_wiki_v1` : glob_of_ectoplasm
      <- « Ectoplasm » (href/title prouves sur 9 pages). 17 propositions
      nouvelles (tributs Exitare / Call of the Void, Dark Matter, Spinal
      Blade), aucun nouveau desaccord. 30 → 25 lignes.
- [x] **double monnaie** (`integration/gw2_aretes_fausses_v2`) : Certificate
      of Heroics et Essence of Animosity portaient la voie vendeur (Castoran)
      ET la recette (Jade), chacune a pleine quantite. Jade retiree :
      inobtenable depuis VoE, echangeable 1:1 contre Castoran ; Conflux et
      les arbres ne comptent que Castoran. Conflux -750, Triumphant Hero
      -1 500, Warbringer -500 Jade. Les 3 lignes « Jade manquante » de
      CONFRONTATION sont attendues (la capture lit la recette).
- [x] `gift_of_castoran_mastery -> gift_of_adventure` : resolue par la
      suppression du composant `_voe`.
- [x] **voies concurrentes** (`controle/gw2_aretes_non_sourcees_v3`) : arete
      non proposee dont un frere du meme parent l'est, a quantite egale, nom
      a un mot pres. Mesure : les 2 lignes Jade sur v361, 0 sur v364 (la
      regle sans condition « proposee » en donnait 130). Sortie 1 si > 0.
- [x] **Eternity** (`integration/gw2_aretes_fausses_v3`, v364) : troisieme
      copie du patron gen1 depuis l'import initial (Gift of Mastery, Gift of
      Fortune, 250 pieces), deja portee par Sunrise et Twilight. Recette
      wiki : 2 legendaires + 5 poussieres + 10 pierres. Eternity perd 21
      lignes (ectos 250, trefles 77, T6 250 x 7...). Trouve par l'audit
      (poussiere en direct et via Gift of Magic). `controle/gw2_audit_v60` :
      la regle « fratrie » exclut un legendaire forge d'autres legendaires
      (`collections.*.items[].legendary`), sinon elle reclamait le patron.

### C4 — Excedents nus et relecture des recettes · C
- [x] **Excedents nus : 76 → 0** (04/10, `controle/gw2_confronte_totaux_v9`,
      aucune donnee touchee). Trois defauts de l'outil, pas de la donnee :
      - branche fermee = sans enfant chiffre, tetes comprises : le precurseur
        gen2 (« Endeavor — Requires 500 Weaponsmith ») passait pour ouvert ;
        58 lignes (tessons, tributs, curios, sigils gen1...) ;
      - `alt_groups` par cible : `opal_orb` etait coupe sous le Gift of Color
        du Bifrost ; 2 lignes, +21 accords, et 3 faux trous evites sur Endless
        Summer (orbes rangees a cote de leur cible) ;
      - branche omise sourcee : la table ouvre le Poeme gen3 mais tait la
        piece d'arme ; admise seulement si l'arete est proposee par une
        capture (`/tmp/edges2.json`) — 16 lignes, une piece par arme.
      Resultat : 969 accords, 0 trou, 166 expliques, 0 nu. Listes non
      tronquees.
- [x] **Relecture des recettes relancee sur v368** (`RELECTURE_RECETTES_v10`,
      le v8 datait de v355) : 20 MANQUANTS, 6 non relies, 6 en trop.
      6 ingredients sources poses (`integration/gw2_ingredients_manquants_v1`,
      v369) : 250 Sun Bead (Endless Summer), 2 Opal Crystal par Opal Orb
      (Bifrost, Dreamer, Minstrel : +200), Ley-Infused Sand / Foxfire Cluster /
      Fury-Scorched Stone par Olmakhan Charm (Vision : +250 / +500 / +50),
      5 Shard of Crystallized Mists Essence (Ad Infinitum). Monnaie du vendeur
      de Sun Bead illisible sur la capture → a confirmer.
- [x] **Captures du 06/10 integrees** (`integration/gw2_acquisitions_c4_v1`,
      v370) : voies d'obtention de Foxfire Cluster, Fury-Scorched Stone,
      Ley-Infused Sand, Opal Crystal, Shard of Crystallized Mists Essence,
      Pile of Foul Essence. `ascended_shard_of_glory.name` au titre reel
      (singulier) : la file le renvoyait vers une redirection. Monnaies du
      vendeur INFUZ-5959 illisibles → `verified: false`.
- [x] **Trefles dans l'ordre d'Antoine + monnaies lues dans les icones**
      (v371, `integration/gw2_trefles_ordre_monnaies_v1`) : pistes PvP/McM en
      tete, vendeurs hebdo, Coffre, festival, Forge en dernier ; Sun Bead =
      21 karma, INFUZ-5959 = 300 reliques + 2 po 88 pa (attribut `alt` des
      icones). Les cases cochees de l'onglet Timegates, indexees par
      position, se decalent une fois.
- [x] **Plats d'Orrax, premier niveau** (decision d'Antoine : decomposer ;
      v372, `integration/gw2_orrax_plats_v1`) : Nopal 500, Avocado 100,
      Asparagus Spear 400, Soy Sauce 200 sur Orrax Manifested — volume non
      negligeable. Reste : 6 intermediaires cuisines a capturer (Bowl of
      Ascalonian Salad, Jar of Red Curry Paste, Pile of Tangy Seasoning,
      Bottle of Coconut Milk, Bottle of Rice Wine, Cup of Lotus Fries).
- [x] **Eternity : rien a modeliser.** `gen1_eternity` porte deja ses
      appoints (5 poussieres, 10 pierres philosophales) et `precursor:
      Sunrise + Twilight`, deux legendaires suivis a part. Le craft ne
      consomme pas l'Armurerie (jetons Memory of). Les lignes Sunrise /
      Twilight de la relecture sont des faux positifs.
- [x] **Captures du 07/10** (`integration/gw2_captures_0710_v1`, v374) :
      Orrax 2e niveau (6 intermediaires) et 3e niveau partiel ; Ars Goetia
      complete (Casing, Core, Inscription — aligne sur ses freres gen2) ;
      Spirit of the Upper Bound ; karma du Sun Bead et de la noix de coco en
      aretes (structure `karma`). Orrax : +49 800 karma, +200 difluorite.
- [x] **Vision Crystal relie sous Unbound Wings** (accord d'Antoine,
      `integration/gw2_ad_infinitum_vision_v1`, v375). Aretes plates
      d'Ad Infinitum reduites de la hausse mesuree par le moteur :
      bloodstone / dragonite / empyreal 1500 → 1000, obsidienne 90 → 60,
      reactif 460 → 310 — totaux inchanges. Seul cout nouveau : +20 eclats
      spirituels (Augur's Stone). Les 1000 restants sortent probablement des
      objets de collection Ad Infinitum I-IV (non captures).
- [x] **Orrax 3e niveau** (v376, `integration/gw2_orrax_niveau3_v1`) : voies
      de Lime, Beet, Head of Lettuce, Lemongrass, Lotus Root ; Stirfry Spice
      Mix (Chef 175) et Ascalonian Dressing (Chef 125) decomposes.
- [x] **Orrax 4e niveau** (v377, `integration/gw2_orrax_niveau4_v1`) : Ginger
      Root (recolte ou 9 karma), Chili Pepper (recolte), Simple Dressing
      decompose (Chef 25). Vin elonien : source vendeur corrigee (Miyani et
      preposes, 25 pa 4 pc ; « Vendors PoF » etait faux).
      JSX v245 : la cascade des intermediaires iterait 6 passes fixes ; Orrax
      en demande 7 — sel et poivre noir sortaient 300 sous le moteur Python.
      Desormais jusqu'a stabilite (borne 20).
- [x] **Jar of Vinegar** (v378) : marchands de cuisine, 80 cuivre les 10. Orrax entierement decompose.
- [x] **Ecart Kudzu vin / cristal mystique (7 / 8)** : faux ecart. Le « 8 »
      etait la promotion du Foul Essence (1 vin + 1 cristal par essence) x 8
      essences. Foul Essence : `best: drop`, promotion en source
      `mystic_forge` alternative (v379) ; `controle/gw2_arbitrages_v8` ne
      compte plus une recette sous un parent dont la voie par defaut n'est
      pas une fabrication. ARBITRAGES : 20 → 18 desaccords.
- [x] **Relecture v5** : `resoudre` rendait le slug d'une redirection au
      lieu du composant (Dark Matter → Glob of Dark Matter sortait non relie
      ET en trop). `RELECTURE_RECETTES_v10`.
- [x] **Orrax, dernieres recettes « feuilles assumees »** (v381) :
      sorbet a la figue de Barbarie (5 Prickly Pear, Ice Cream Base,
      Glacial Shard, Lime) et herbes ascaloniennes (origan, basilic, persil,
      thym) decomposes — l'ecart Lime d'ARBITRAGES (400 / 600) se ferme.
      Gift of Janthir Wanderlust : Lowland Shore et Janthir Syntri relies
      (completion de carte par defaut, vendeur tres cher en alternative).
- [x] **Captures du 08/10** (v382, `integration/gw2_captures_0810_v1`) :
      herbes, Prickly Pear, Glacial Shard (butin par defaut, Forge en
      alternative), Ice Cream Base decompose, pudding d'Orrax (tapioca +
      compote) decompose, Gift of Mistburned Barrens et Gift of Bava Nisos
      sous Wanderlust (completion de carte par defaut). Wanderlust complet.
- [x] **Orrax, captures du 08/10 (lot 2)** (v383,
      `integration/gw2_orrax_dernier_niveau_v1`) : voies de l'oeuf, du sucre,
      de la vanille, du babeurre, de la framboise, du fruit de la passion ;
      Baker's Wet Ingredients, farine de manioc et cannelle-sucre decomposes
      (5 cannelle-sucre par pudding, enfin poses).
- [ ] **Orrax, 4 dernieres pages** (file) : Cassava Root, Milling Stone,
      Milling Basin, Cinnamon Stick.
- [ ] **Reste de la relecture** (W ou A1) :
      - a capturer : Spiritwood Focus Casing (Ars Goetia), Spirit of the Upper
        Bound (Unbound Wings) — ni page ni apiId ;
      - non relies Spiritwood Focus Core + Visionary Inscription sous Ars
        Goetia (precurseur d'Ipos, recette lue) : a relier avec le Casing ;
        Vision Crystal sous Unbound Wings ; Sunrise/Twilight sous Eternity
        (legendaires composes, modele a decider) ;
      - plats d'Orrax (4 plats, 12 ingredients dont 6 intermediaires
        cuisines sans page) : decomposer ou laisser en feuilles → A1 ;
      - faux positifs de l'outil : `Dark_Matter` / `glob_of_dark_matter`
        (meme objet, appariement par slug) ; Castoran, recettes de
        banniere, Legendary Insight = couts d'acquisition legitimes.

### Bandeau « Obtenu » — ✅ 07/10 (JSX v247, accord d'Antoine)
Un legendaire possede (Armurerie synchronisee ou clic droit du grand total)
affiche un bandeau dans ses onglets et n'y compte plus aucun besoin. Constat
d'Antoine : Aurora fabriquee montrait encore des manques (stock consomme par
la Forge, onglet aveugle a la possession). L'Armurerie ne voit l'objet
qu'une fois depose ou equipe.

### C5 — Bits de collection · C — ✅ structure unifiee le 07/10 (sources v380, JSX v246)
Accord d'Antoine sur le plan : une seule structure, `cost` sur l'etape.
- [x] `qty_extras` (5 composants) et `karma_budget` (Aurora I) migres en
      `cost` d'etape : 53 couts poses sur les sous-collections d'Aurora I et
      sur Aurora II (`integration/gw2_couts_collections_v1`), puis retires.
- [x] Les deux moteurs lisent les sous-collections (`etapesCollections` JSX,
      `Modele._etapes`, moteur v4) ; une sous-collection est faite si son
      statut le dit ou si sa mere est terminee.
- [x] Arete `xunlai -> spark_of_sentience : 21` retiree : la meme chose que
      les 21 couts d'Aurora II. Les lingots tombent desormais au fil des
      sanctuaires infuses (avant : jamais).
- [x] Corrige au passage : rubis +50, jade +100, perles +200 n'etaient
      comptes que dans l'onglet d'Aurora, pas au grand total (le surcout ne
      s'appliquait qu'aux cles a plat). Le karma d'Aurora etait, lui, compte
      deux fois dans l'onglet (moteur + surcout rajoute).
- [x] Controles : conformite v3 (3e situation : etapes a cout validees,
      sous-collections comprises), audit v60 (`check_couts_etapes` : interdit
      `qty_extras` / `karma_budget`, exige `cost_ref`).
- [ ] Generaliser au fil des captures. Candidats lus dans les `how`, a
      trancher un par un — la plupart des « Bring » portent un objet de
      quete, pas une consommation :
      - Chuka III bits 11-13 : une Slab of Poultry Meat par chat (3 a Caer
        Aval, 1 Shadow, nombre des chats d'Elena inconnu) ;
      - Vision `vis_brandstone` bit 6 : 10 Kralkatite Ore + 5 Powdered Rose
        Quartz combines au Beam of Light (consommation ? la table du wiki les
        compte-t-elle deja ?).

---

## Lots structurels (C+A — proposition avant execution)

### S1 — § 12 sexies : synchro et saisie manuelle partagent un magasin
Deux espaces (`synced` / `manuel`), un affichage qui dit lequel parle. Base :
`__notSent`, `__syncedAt`. Change ce que voit le joueur : a valider.

### S2 — § ⑤ Primaute des recettes
Les 722 `qty` a plat sont un resultat recopie ; les recettes devraient etre la
seule source et les totaux s'en deduire. Le plus gros refactor ouvert : C1 a C4
le preparent (chaque ecart resolu est un cas de moins a migrer).

### S3 — § ⑥ Runes, cachets, reliques
Table `upgrades` parallele et inerte a resorber dans `legendary_rune` /
`legendary_sigil` / `legendary_relic`.

### S4 — § ② Routes vers les 1 978 etapes d'armes
L'onglet Armes cible, mais cliquer une arme ne mene a rien.

### S5 — Prerequis Coalescence et Stella Radians
Reportes « apres Wayfarer's Henge », qui est fait : debloques. Coalescence :
plafond d'Insight → semaines restantes ; Stella Radians : karma + Research Notes
en stock reel.

### S6 — Regionalisation
Etat chiffre du 01/09 a refaire ; puis traduction des conseils (les noms sont
faits). `note_alt` d'Ad Infinitum n'est toujours pas rendu.

### S7 — Hygiene
- [ ] trier `BACKLOG.md` : sections closes et ouvertes melees, titres perimes
      (« 10 restants » de la migration, par exemple)
- [x] `shared_components` retire des 44 fiches (accord du 04/10).
- [ ] `RELECTURE_RECETTES` : le script numerotait sa sortie `_v1` au lieu de
      reprendre la suite — corrige a la main le 04/10, script a corriger

---

## Ordre propose

1. ~~C1, C2~~ faits (restent 4 + 1 cas, tous lies au Mist Band ou a Ardent Glorious) — en parallele **W1, W2,
   W3** cote captures et **A1, A2** cote Antoine.
2. **W4** puis C sur les 31 couts vendeur.
3. **C3, C4** par groupes de legendaires.
4. **S1** (petit, visible), puis **S5**, puis **S3**.
5. **S2** une fois C1–C4 epuises ; **S4, S6** ensuite.
