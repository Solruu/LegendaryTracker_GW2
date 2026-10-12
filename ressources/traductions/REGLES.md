# Traduction EN → FR des textes du tracker GW2 — règles

Tu traduis des descriptions courtes (étapes de collection Guild Wars 2, conseils
d'obtention) de l'anglais vers le français, pour un joueur francophone.

## Style
- Français naturel, concis, tutoiement (« Parle à… », « Tue… »), comme les textes existants :
  - EN « Step 1. The Mist Stranger waits at the fractal entrance, in the Lion's Arch Aerodrome. »
    FR « Étape 1. L'Étranger des Brumes t'attend à l'entrée des fractales, à l'Aérodrome de l'Arche du Lion. »
  - EN « Infuse a Xunlai Electrum Ingot at the 'Dostoev Sky Peak' mastery insight, in Dredgehaunt Cliffs. »
    FR « Infuser un lingot d'electrum Xunlai au sanctuaire de maîtrise « Dostoev Sky Peak », aux Falaises de Hantedraguerre. »
- « Hint: » → « Indice : ». Ponctuation française (espace avant « : ; ? ! », guillemets « »).
- Termes de jeu génériques traduits : renown heart → cœur de renommée ; waypoint → point de passage ;
  Mystic Forge → Forge mystique ; vista → panorama ; mastery insight → sanctuaire de maîtrise ;
  jumping puzzle → puzzle de saut ; achievement → succès ; collection → collection ; event → événement ;
  meta event → méta ; reward track → piste de récompense ; strike mission → mission d'attaque ;
  raid → raid ; fractal → fractale ; champion / veteran → champion / vétéran.

## Noms propres — NE JAMAIS les traduire de tête
- **Noms de cartes et de zones** : utilise UNIQUEMENT `glossaire_cartes.json` (EN → FR officiel).
  Un nom de lieu absent du glossaire (zone, point d'intérêt, donjon, fractale, région) RESTE EN ANGLAIS,
  tel quel. Accorde l'article autour (« aux Falaises de Hantedraguerre », « à la Côte des basses terres »).
- **Noms d'objets, de monnaies, de succès, de PNJ, de boss, de skins** : RESTENT EN ANGLAIS, à l'identique
  (casse et orthographe), y compris au pluriel anglais s'il y est. Le site les traduit lui-même par l'API ;
  un nom modifié ne serait plus reconnu. Ex. « Capacitive Bottle », « Karka Queen », « Cardinal Adina »,
  « Shard of Lowland Shore », « Mystic Clover ».
- Les noms entre guillemets ou apostrophes ('Dostoev Sky Peak') restent en anglais, entourés de « ».
- Codes de chat `[&B…]`, nombres, pourcentages : recopiés à l'identique.

## Sortie
Écris un fichier JSON `out_N.json` (N = numéro du lot) : un objet `{ "id": "traduction", ... }`
avec EXACTEMENT un id par entrée du lot, aucune omission. Pas d'autre texte dans le fichier.
Vérifie à la fin que le nombre de clés = nombre d'entrées du lot, et que chaque `[&…]` et chaque nombre
de l'anglais figure dans la traduction.
