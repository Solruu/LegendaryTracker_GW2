# Plan du restant — LegendaryTracker_GW2

Etabli le 04/10/2026 sur `gw2_sources_v355.json` / `gw2_legendary_tracker_v243.jsx`,
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
| `ARBITRAGES.md` | `controle/gw2_arbitrages_v7` (apres `parseurs/gw2_edges_wiki_v14`) | ~~81 / 37~~ → **35 desaccords / 12 composants** apres C1 (v356) : 4 « deja compte par cascade », 28 « cout vendeur », 3 « ecart de compte » |
| `CONFRONTATION.md` | `controle/gw2_confronte_v3` ~~370~~ → **248 ecarts** apres C1 (166 hausses, 82 baisses) — colonne « wiki » indicative, pas verite |
| `CONFRONTATION_TOTAUX.md` | `controle/gw2_confronte_totaux_v8` 943 accords, 0 trou, 94 excedents expliques, **76 excedents nus** apres C1 (+5 : orbes d'opale de Bifrost/Minstrel, precurseur d'Ipos — branches que la table n'ouvre pas, voir C1) |
| `CONFRONTATION_TABLES.md` | `controle/gw2_confronte_tables_v4` | 2 noms non resolus (Tribute to the Exitare, Tribute to the Call of the Void) |
| `CONFRONTATION_AGREGATS_v2.md` | `controle/gw2_confronte_agregats_v1` | 53 accords, 0 depassement |
| `RELECTURE_RECETTES_v8.md` | `controle/gw2_relecture_recettes_v4` | 0 manquant, **4 non relies, 36 en trop**, 1 732 occurrences non decomposees |
| `COHERENCE_CONSEILS_METAS_v5.md` | `controle/gw2_coherence_conseils_metas_v2` | 6 constats (5 codes de point de passage, 1 ressource) |
| `PAGES_A_CAPTURER.md` | `captures/gw2_pages_a_capturer_v14` | 1 URL |
| audit | `controle/gw2_audit_v58` | 0 erreur, 69 avertissements |

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

### W6 — Six doubles comptes · W
- [ ] captures qui tranchent `stabilizing_matrix`/Klobjarne Geirr,
      `shard_of_glory`/Conflux et les quatre autres (liste par l'audit).

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
`integration/gw2_arbitrage_cascade_v1` ; detail dans sa docstring. Presque aucun
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

### C2 — « Ecart de compte » (3 cas) · C
`ancient_coin` (20 000), `ascended_shard_of_glory` (100),
`curious_mursaat_currency` (100). Relire la capture, decomposer la difference.

### C3 — Confrontation des totaux, 370 ecarts · C
Par legendaire, du plus expose au moins : Klobjarne Geirr (15 composants,
26 822), Binding of Ipos (43, 25 458), Pharus / HMS Divinity (24 756 chacun),
Sharur, Claw of the Khan-Ur, Eureka… Les gen2 partagent le meme motif : traiter
le groupe d'un coup. La colonne wiki n'est qu'un indice.

### C4 — Excedents nus (71) et relecture des recettes · C
71 excedents sans explication (`CONFRONTATION_TOTAUX.md`) ; 4 ingredients non
relies et 36 en trop (`RELECTURE_RECETTES_v8.md`).

### C5 — Bits de collection · C
`qty_extras` ne retranche les etapes validees que sur 5 composants. Generaliser
a tous les composants dont une collection consomme l'objet.

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
- [ ] `RELECTURE_RECETTES` : le script numerotait sa sortie `_v1` au lieu de
      reprendre la suite — corrige a la main le 04/10, script a corriger

---

## Ordre propose

1. ~~C1~~ fait, **C2** (autonome) — en parallele **W1, W2,
   W3** cote captures et **A1, A2** cote Antoine.
2. **W4** puis C sur les 31 couts vendeur.
3. **C3, C4** par groupes de legendaires.
4. **S1** (petit, visible), puis **S5**, puis **S3**.
5. **S2** une fois C1–C4 epuises ; **S4, S6** ensuite.
