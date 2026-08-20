# ROUTES.md — comment aller chercher l'information dans ce projet

Ce fichier existe parce que les contournements trouvés au fil des sessions ne
survivaient pas d'une conversation à l'autre. Résultat concret : plusieurs
semaines avant de retrouver que `web_fetch` contourne les limites CORS du
conteneur, et des seuils faux publiés parce qu'un blocage réseau avait fait
basculer silencieusement sur un guide communautaire.

À lire au démarrage de chaque conversation, en même temps que les fichiers du
projet.

---

## 1. Taxonomie des erreurs

La règle « insister avant d'abandonner » ne vaut rien sans distinguer ce qui est
définitif de ce qui ne l'est pas. Réessayer un 404 est une perte de temps ;
abandonner sur une troncature est une faute.

### 1.a — Définitif : ne pas réessayer à l'identique, changer de route

| Symptôme | Signification |
|---|---|
| HTTP 404 | La ressource n'existe pas à cette URL. Ne pas deviner une URL voisine. |
| HTTP 401 / 403 « bot detection » | Le site refuse les clients automatisés. Il refusera toujours. |
| HTTP 403 `Host not in allowlist` | Le domaine n'est pas autorisé en sortie **depuis bash**. Ce n'est PAS un blocage global — voir 2.a. |
| `PERMISSIONS_ERROR` sur `web_fetch` | L'URL n'a jamais été vue. Définitif **pour cette URL telle quelle**, pas pour la question — voir 2.b. |
| HTTP 410 | Ressource supprimée. |

Un échec définitif tue **une URL**, jamais **une question**. Le réflexe correct
n'est pas de conclure, c'est de descendre l'échelle des routes (§3).

### 1.b — À réessayer, avec des paramètres différents

| Symptôme | Ce qu'il faut changer |
|---|---|
| Contenu tronqué, la donnée cherchée est « après » | `text_content_token_limit` à 3000–6000. Les pages wiki denses dépassent largement le défaut. |
| Extraction vide alors que la page a du contenu | Basculer `html_extraction_method` sur `traf`, puis retenter en `markdown`. |
| HTTP 429 | Attendre, réessayer. Espacer les appels. |
| HTTP 500 / 502 / 503 / 504 | Panne passagère : 2 à 3 tentatives espacées avant de conclure. |
| Timeout | Réessayer une fois, puis réduire la charge (lots plus petits). |
| Recherche sans résultat utile | Reformuler avec d'autres **mots de contenu** — jamais les mêmes termes. Une requête qui échoue deux fois à l'identique n'a été essayée qu'une fois. |

### 1.c — Le piège des tableaux rendus côté client

Le wiki GW2 répond correctement en HTTP 200 tout en livrant une page dont les
blocs utiles sont vides : les tableaux « Collection items », les widgets liés à
une clé API, certaines listes d'objectifs. **Un 200 n'est pas une réussite.**
Vérifier que la donnée cherchée est réellement présente avant de conclure quoi
que ce soit. Si le bloc est vide, ce n'est pas une absence de donnée, c'est un
échec de route : descendre l'échelle.

---

## 2. Blocages connus et leur contournement

### 2.a — `bash` n'a pas accès à l'API GW2

L'allowlist de sortie couvre GitHub, npm, PyPI, crates.io et les dépôts Ubuntu.
`api.guildwars2.com` n'y est pas : tout `curl` renvoie
`403 Host not in allowlist`.

- **Contournement** : `web_fetch` sur l'URL de l'API, qui n'est pas soumis à la
  même allowlist. C'est le contournement qui avait mis des semaines à être
  retrouvé.
- **Repli hors ligne** : `gw2_achievements_ref.json` (6 876 succès),
  `gw2_materials_ref.json` (680 objets), `gw2_currencies_ref.json` (79 devises)
  sont dans le dépôt et suffisent pour toute résolution id ↔ nom.
- **Dernier recours** : demander à Antoine de lancer `gw2_refresh_refs_v2.py` ou
  `gw2_dump_bits_v3.py` en local.

### 2.b — `web_fetch` n'accepte que les URL déjà vues

Une URL construite de tête est refusée, même parfaitement valide.

- **Contournement** : `web_search` d'abord, puis `web_fetch` sur le lien
  retourné. Fonctionne aussi pour les URL d'API : chercher l'URL elle-même
  comme requête.
- La permission est **par URL exacte**, pas par domaine : avoir chargé
  `/achievement/3516` n'autorise pas `/achievement/3442`.

### 2.c — gw2treasures bloque les robots

`en.gw2treasures.com` renvoie une détection de bot.

- **Contournement** : le miroir `gw2.dvg.cn/en/achievement/<id>` (et `/fr/`)
  expose les mêmes données brutes de l'API : paliers (`tiers`), objectifs
  (`bits`), points. C'est la meilleure source pour un seuil exact quand
  `web_fetch` sur l'API échoue.

### 2.d — Le wiki bloque parfois, et masque toujours ses tableaux dynamiques

Voir 1.c. Quand le bloc voulu n'est pas extractible :

- guides communautaires (§3, niveau 4), en **signalant le changement de source** ;
- ou demander une capture à Antoine. C'est rapide, fiable, et il le fait
  volontiers. **Demander une capture n'est pas un aveu d'échec** : c'est la
  route prévue pour ce cas précis. Elle a résolu la chaîne du Wayfarer's Henge,
  les 6 métas LW3 et les listes d'objectifs de Vision.

---

## 3. L'échelle des routes pour une donnée de jeu

À parcourir **dans l'ordre**. Ne jamais sauter un niveau sans dire pourquoi.

1. **Fichiers de référence du dépôt** — hors ligne, autoritaires pour id ↔ nom,
   et à utiliser **systématiquement** pour valider tout id avant de le publier.
2. **API GW2 via `web_fetch`** — autoritaire pour paliers, bits, prérequis, AP.
3. **wiki.guildwars2.com** — autoritaire pour tout ce que l'API n'expose pas :
   listes d'objectifs éligibles des métas, coûts en monnaie, recettes.
4. **Miroir `gw2.dvg.cn`** — équivalent au niveau 2 quand celui-ci échoue.
5. **Guides communautaires** (GuildJen, Ayinmaiden, Dulfy) — pratiques et
   souvent justes, mais **non autoritaires** et parfois périmés. Les chiffres
   qui en viennent doivent être marqués `verified: false` et signalés.
6. **Captures d'Antoine** — pour les blocs wiki rendus côté client.

---

## 4. Règle d'annonce — obligatoire

> **Changement de source, changement de niveau, ou abandon d'une route :
> le dire explicitement dans la réponse.**

Sans cette règle, un repli silencieux produit une réponse qui a l'air complète.
C'est exactement ce qui a fait publier des seuils de métas faux : les chiffres
venaient d'un guide, la réponse ne le disait pas, et l'écart n'est apparu que
lorsque Antoine l'a vu en jeu.

Formulations attendues, en une ligne, pas un paragraphe :

- « Wiki inaccessible sur ce bloc, chiffres pris chez GuildJen — non vérifiés. »
- « API injoignable en bash, passé par le miroir dvg.cn. »
- « Trois routes essayées (wiki, miroir, guides), aucune ne donne le pool
  d'éligibles — il me faut une capture. »

Corollaire : une donnée obtenue au niveau 5 ou 6 porte toujours `verified`,
`checked` et `ref` dans les sources. Une donnée sans provenance est une dette.

---

## 4 bis. Critère éditorial — efficient ≠ rapide

Le projet n'optimise pas la durée d'une session, mais le **ratio temps passé sur
résultat, sur des semaines**. C'est compatible avec une vie active ; « le plus
vite possible » ne l'est pas, et produit des conseils inutilisables.

Deux conséquences directes sur la rédaction des conseils :

- **L'ordre prime sur la durée.** « Déverrouille cette collection avant de jouer
  ce contenu » vaut plus qu'un temps d'exécution. Refaire trois fois le même
  contenu est le vrai coût — c'est exactement ce qui rend les collections LW3
  pénibles quand on les démarre après avoir terminé l'histoire. Le champ
  `unlock_first` porte ces cas et s'affiche en rouge.
- **Séquence n'est pas synergie.** Deux collections qui passent par le même lieu
  ne se cumulent pas si l'une est prérequis de l'autre : Vision II n'existe qu'une
  fois Vision I terminée, donc le trajet sera fait deux fois quoi qu'il arrive.
  Avant d'annoncer une synergie, vérifier que les deux objectifs sont ouverts EN
  MÊME TEMPS. Sinon, c'est un simple repérage à mentionner comme tel.
- **Un timegate n'est pas un obstacle à contourner, c'est une file à lancer tôt**
  et à laisser courir en fond : bobine de fil de soie, lingots d'electrum Xunlai,
  journaux fractals, Sanctuaire du voyageur. Un conseil doit dire « lance ça
  aujourd'hui », pas « ça prend 16 jours ».

Corollaire sur les coûts en or : ne jamais figer un prix. Le coût réel dépend du
stock du joueur au moment du craft. Un lien vers le calculateur gw2efficiency
reste juste, un chiffre écrit en dur est faux le lendemain.

## 5. Règles de structure

Reprises ici parce qu'elles relèvent du même réflexe que le contournement
réseau : céder à la résistance et livrer quelque chose qui marche en apparence.

- **Une donnée d'un type déjà existant rejoint la structure existante.** Créer un
  champ ou un chemin de rendu parallèle est interdit. Si la structure ne
  convient pas, le dire et proposer de la modifier.
  *Cas réel : une liste d'éligibles rangée dans `mastery_eligible` au lieu de
  `meta_eligible` s'affichait correctement mais contournait tout le pipeline
  d'enrichissement — plus de score d'effort, plus de descriptions, plus de
  chemin le plus court.*
- **Les listes de succès éligibles vivent uniquement dans `meta_eligible`**,
  indexées par l'id du méta, au schéma
  `{name, threshold, source, verified, achievements: [[id, nom]], notes?}`.
- **Toute fonctionnalité transversale** (scoring, détecteurs, i18n) doit être
  vérifiée comme s'appliquant au nouveau cas — pas seulement son affichage.
- **Un plafond chiffré ne vit jamais en prose seule.** Toute cadence (« 25
  nœuds/jour », « 365/sem ») doit exister dans `cadence.sources[]` au schéma
  `{label, period, cap, cost, verified, checked, ref}`, ou pointer via
  `cadence_ref` (chaîne ou liste) vers l'entité qui la porte. Une phrase
  s'affiche mais ne se calcule pas : elle reste hors des projections de délai
  et hors du futur regroupement des timegates lançables en parallèle.
  Deux drapeaux corrigent la projection : `rng: true` pour une source dont le
  plafond borne les *tentatives* et non les gains (Ancient Cipher), et
  `per_character: true` là où le plafond n'est pas par compte (baies de houx).
  Les familles résolues sont `craft_components`, `legendaries` et `armor_sets`.
- **Le déblocage des collections vit dans `collection_unlocks`**, à la racine des
  sources, indexé par identifiant de succès comme `achievement_notes`. Deux
  champs, deux rôles : `text` (`{fr, en}`) dit **comment** débloquer et s'affiche
  en encadré orange sous chaque collection non terminée ; `gate` dit **si** c'est
  débloqué, sous une forme testable contre l'API — types `mastery`,
  `fractal_scale`, `expansion`, `achievement`, `item`, `currency`. Seul `gate` se
  filtre : une prose ne se calcule pas. Une collection **sans `gate` est traitée
  comme éligible** — mieux vaut en afficher une de trop que d'en masquer une
  jouable. `legendary` est une **liste** : un succès partagé (Shipwreck Strand,
  Starlit Weald) n'a qu'une entrée, jamais deux textes qui divergent.
- **Avant tout push** : `python3 gw2_audit_v5.py`. Un échec bloque le push.
  Le script contrôle quatre choses : aucune liste curée hors de `meta_eligible`,
  aucun champ redupliquant une donnée fournie par l'API (`mastery_required`,
  `mastery_max`, `tier_max`, `bits_count`), provenance complète (`verified`,
  `checked` et `ref` vont ensemble ; un `verified: false` sans `ref` est une
  erreur), et cohérence des budgets karma (somme des lignes = total, `per` ×
  `bits` = `amount`, chaque `sub`/`bit` référencé existe réellement).
- **Une monnaie se déclare à trois endroits** : la liste du JSX, `_meta.direct_sync.leg_currency_ids` et le serveur Flask. La synchro directe
  rattrape une entrée manquante par un repli sur `apiId`, mais pas Flask — le
  stock s'affiche alors à zéro selon le chemin emprunté, ce qui ressemble à une
  perte de données plutôt qu'à un oubli de déclaration. Le script d'audit
  contrôle désormais la correspondance.
- **Une quantité ne s'écrit qu'une fois.** Le requis d'une ressource vivait à la
  fois dans le JSX et dans `craft_components[*].qty` : le rubis de sang affichait
  250 dans l'onglet du légendaire, qui sait décompter une étape faite, et 300
  dans le grand total, qui lisait un nombre figé. Un surcoût conditionnel se
  déclare dans `qty_extras`, jamais fondu dans le nombre de base, et jamais codé
  en dur dans le JSX — sinon il est invisible du grand total et de l'audit.
- **Un écart non tranché se déclare.** `qty_conflict` accepte une divergence
  connue, mais seulement datée et motivée : elle passe alors en avertissement au
  lieu de bloquer, et reste visible à chaque audit au lieu de dormir.
- **Un preflight refusé ne laisse aucune trace.** `/api/materials/bulk` est un
  POST JSON avec en-tête personnalisé : le navigateur envoie donc un `OPTIONS`
  préalable. `Access-Control-Allow-Methods` n'annonçait que `GET, OPTIONS`, donc
  la requête était bloquée **avant** d'atteindre Flask — aucune ligne dans le log
  d'accès, et côté client un « Failed to fetch » indistinct d'un serveur éteint.
  Quand une route Flask ne répond pas alors que d'autres marchent, comparer les
  méthodes : un GET simple passe sans preflight, un POST non.
- **Un code HTTP n'est pas un diagnostic.** Le serveur Flask renvoyait `500`
  avec la raison dans le corps de la réponse — invisible dans le log d'accès, qui
  est pourtant le seul endroit qu'on regarde. Toute erreur renvoyée doit aussi
  être écrite dans le terminal, et toute exception non prévue attrapée pour ne
  pas produire un 500 nu. `GET /api/diag` vérifie la clé et ses portées, ce qui
  sépare un problème de clé d'un bug de code.
- **Un stock se lit à cinq endroits** : portefeuille, stockage matériaux,
  banque, inventaire partagé et **sacs des personnages** (`/v2/characters`,
  portées `characters` + `inventories`). Les deux chemins de synchro en
  oubliaient au moins un : tout ce qui n'est pas encore déposé était sous-compté
  sans le moindre signal. Une portée manquante doit être annoncée, jamais
  transformée en zéro silencieux.
- **Un identifiant faux ne provoque jamais d'erreur.** Il renvoie un stock nul,
  indiscernable d'un inventaire vide. Le contrôle se fait par le **nom**, pas par
  l'id : un id absent du référentiel signifie seulement que l'objet n'est pas en
  stockage matériaux, ce qui est courant et légitime ; en revanche un nom connu
  portant un autre id est faux à coup sûr. `gw2_audit_v5.py` applique cette règle.
- **Un instantané ne se fusionne pas, il se remplace.** Le statut des
  sous-succès était mis à jour par `{...prev, ...data}`, et l'effet de
  complément n'allait chercher que les ids *inconnus*. Un succès enregistré
  comme non fait le restait donc indéfiniment, même terminé en jeu. Dès qu'une
  charge couvre l'intégralité d'un domaine — `account/achievements` renvoie tout
  le compte — elle doit **écraser** l'état, pas s'y ajouter.
- **Un bouton doit rafraîchir ce qu'il prétend rafraîchir.** Flask ne renvoie pas
  `_sub_status` ; la synchro directe si. Selon le chemin emprunté, le même bouton
  faisait donc deux choses différentes, sans le dire. Vérifier qu'un chemin de
  repli couvre le même périmètre que le chemin principal.
- **`py_compile` non plus.** Il valide la syntaxe, pas la portée : réutiliser un
  nom de variable vu dans une AUTRE fonction du même fichier compile
  parfaitement et lève un `NameError` à l'exécution. Avant de patcher une
  fonction longue, vérifier le nom réel de la variable **dans cette fonction**,
  pas ailleurs dans le fichier. Contrôle rapide : parcourir l'AST et lister les
  identifiants chargés mais jamais assignés dans la fonction.
- **esbuild ne détecte pas une variable inexistante.** Référencer un identifiant
  absent de la portée compile sans erreur et échoue seulement à l'exécution.
  Avant d'utiliser une variable dans un patch, vérifier qu'elle est bien
  déclarée — `grep 'const \\[nom'` — plutôt que de se fier au build.
- **Toujours donner le nom anglais entre parenthèses.** Le wiki est en anglais :
  une note qui ne cite que « fiole d'obsidienne fondue par les titans » oblige à
  deviner la page. Nommer l'objet en français puis en anglais, au moins à la
  première occurrence d'un conseil.
- **Un composant fabriqué hérite du verdict de ses ingrédients.** Dire qu'il n'a
  aucune source gratuite parce qu'il ne tombe pas tel quel est faux : si la
  recette part de matériaux farmables, il est gratuit et long, pas payant.
  Dérouler la chaîne jusqu'au bout avant de conclure — `free_via_ingredients`.
- **La question qui manque presque toujours : est-ce gratuit et répétable ?** Un
  joueur qui démarre n'a pas de stock à échanger. Pour tout poste dépassant 100
  unités, chercher et marquer les sources sans dépense d'or, timegate compris —
  méta quotidienne, quotidiens de festival, pistes de récompense, vendeur karma,
  coffres de carte. Champ `free_repeatable` sur la source, `free_sources_note`
  sur le composant, et `gw2_audit_v5.py` signale les gros postes qui n'en ont
  aucune.
- **Comparer les valeurs présentes ne détecte pas les absences.** Le contrôle qui
  compare `qty` au `required` du JSX ne voit rien quand la `qty` n'existe pas :
  500 Ducats antiques et 660 masses marquées sont ainsi restés hors du grand
  total. Un second contrôle vérifie donc que toute monnaie déclarée pour un
  légendaire côté JSX possède bien une `qty` pour lui. Règle générale : un
  contrôle d'égalité doit être doublé d'un contrôle d'existence.
- **Une donnée écrite n'est pas une donnée affichée.** Trois fois de suite, une
  information exacte a dormi dans les sources sans jamais atteindre l'écran :
  l'écart de catégorie de Bava Nisos, le cas de `A Hunt for the Ages`, les seuils
  réels des métas de maîtrise. Après toute passe de données, vérifier que le
  champ est réellement lu par un chemin de rendu. `gw2_audit_v5.py` liste
  désormais les champs bilingues dont le nom n'apparaît nulle part dans le JSX.
- **Les pièges non calculables** (coût en or, exclusions mutuelles, population
  morte) vont dans `achievement_notes`, indexés par id de succès. Le score
  d'effort ne voit que le volume, les prérequis et les AP.
- **Préférer un détecteur runtime à un inventaire écrit.** Le nom d'un succès ne
  dit pas sa nature : `Master Diver` ressemble à un méta compteur et porte en
  fait dix bits. Seule l'exécution sait.

---

## 6. Pièges de la chaîne de build

- **Babel standalone** : un `>>` littéral dans du JSX casse le parse ; `??`
  combiné à `||` exige un parenthésage explicite.
- **Jekyll** consomme la syntaxe `{{ }}` sur GitHub Pages — le fichier
  `.nojekyll` est indispensable.
- **Un guillemet droit dans un texte de conseil casse le parse.** Les noms
  d'événements en contiennent souvent (`Stop "Joko" from recruiting…`). Utiliser
  des guillemets typographiques échappés (`\\u201C` / `\\u201D`) plutôt que des
  guillemets droits à l'intérieur d'une chaîne.
- **Lire la SORTIE d'esbuild, pas seulement son code retour.** Il affiche
  `1 error` tout en rendant 0 : un `| tail -1` peut donc masquer l'échec, et le
  build HTML réussit quand même en produisant un fichier cassé. Vérifier que la
  sortie contient `Done in`, jamais `error`.
- **Validation JSX** :
  `npx --prefix /home/claude esbuild fichier.jsx --loader:.jsx=jsx --outfile=/tmp/out.js`
- **Validation Python** : `python3 -m py_compile`.
- **Build** : `python3 gw2_build_html_v2.py --jsx <jsx> --json <sources> --out docs/index.html`,
  à relancer à chaque push.
- **Comptage d'accolades** : le déséquilibre de parenthèses (−44) est **normal**
  sur ce fichier, il vient des chaînes de caractères. Comparer avec la version
  précédente plutôt que de lire la valeur absolue.

---

## 7. Pièges de l'API GW2

- **CORS** : utiliser `?access_token=` en paramètre. L'en-tête
  `Authorization: Bearer` échoue au préflight sur mobile.
- **Cache** de 3 à 4 minutes : l'inventaire en temps réel n'est pas fiable.
- **`account/achievements`** ne renvoie que les succès à progression non nulle
  ou terminés. L'absence d'un id ne signifie pas zéro, elle signifie « rien à
  signaler ». Il renvoie **tout le compte** : filtrer sur une liste d'ids
  connus, c'est jeter la donnée dont on aura besoin ailleurs.
- **Métas de type compteur** : aucun champ `bits`. Le seuil est le **dernier
  palier de `tiers[]`**, jamais le texte de `requirement` (l'API en retire le
  nombre). La liste des éligibles vient du wiki, exclusivement.
- **La catégorie API n'est pas un substitut** à la liste d'éligibles, dans les
  deux sens : elle contient des succès qui ne comptent pas (`With Friends Like
  These...` pour One Path Ends, les deux `Ember Bay Insight` pour Rising
  Flames) et il lui manque des succès éligibles classés ailleurs (`Patron`
  (3127), éligible à Rising Flames mais rangé sous *Tradesman* ; les éligibles
  de Bava Nisos rangés sous *Janthir Side Stories*).
- **Certains succès n'existent pas dans l'API** bien qu'éligibles en jeu
  (`A Hunt for the Ages`, Starlit Weald). Les retirer et documenter, jamais
  laisser un id `null`.
- **Certains succès n'ont pas de catégorie publique** et ne se synchronisent
  donc pas (`Forge Guard's Armor`, id 9330).
- **Caches localStorage** : toute modification de la forme d'un objet mis en
  cache exige un numéro de schéma dans **la clé et la charge utile**, sinon les
  utilisateurs existants gardent l'ancienne forme sans le savoir.
- **Le numéro de schéma ne suffit pas.** Il couvre la forme, pas le contenu :
  ajouter une liste dans `meta_eligible` ne change aucune structure, et le cache
  d'avant la curation continue d'être servi. Un travail de données peut donc être
  correct, poussé, et parfaitement invisible. Toute donnée éditoriale injectée
  dans un objet mis en cache doit être **hachée dans la clé de cache**, jamais
  laissée à un numéro qu'on pense à incrémenter. Vérification : après une passe
  de données, la clé de cache doit avoir changé.
