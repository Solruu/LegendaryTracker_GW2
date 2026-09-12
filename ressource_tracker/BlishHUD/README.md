# BlishHUD

Module Blish HUD (C#/.NET) pour la capture de nodes, en remplacement de
`gw2_node_ID_v9.py` (usage perso, pas de publication au répertoire officiel
Blish HUD).

## Statut (11/09/2026) : fonctionnel, confirmé en jeu

Compile et tourne contre BlishHUD 1.3.0. Testé en conditions réelles par
Antoine (capture, filtre par map, panneau cliquable, régénération .taco,
téléchargement d'icônes, reload Pathing) -- confirmé "bullseye" après la
dernière série de correctifs.

## Fichiers

- `NodeType.cs` -- 109 types, généré mécaniquement depuis `NODE_TYPES_LIST`
  de `gw2_node_ID_v9.py`
- `GatheredNode.cs` -- même schéma JSON que `gw2_nodes.json`
- `TacoGenerator.cs` -- génère le `.taco` (XML + zip) directement en C#,
  port fidèle de `gw2_taco_gen_v6.py`. Écrit en place (pas de delete+rename)
  pour rester compatible avec un éventuel observateur de fichiers côté Pathing.
- `IconFetcher.cs` -- télécharge les icônes manquantes (ou toutes, en mode
  forcé) depuis l'API GW2 + repli wiki. Téléchargements en parallèle
  (max 6), User-Agent requis pour wiki.guildwars2.com.
- `Module.cs` -- logique complète : filtre par map, panneau catégorisé
  (en-têtes de groupe), seuil de fusion 5m sur les nodes Vegetal, capture
  F12, cycle T, panneau L, refresh forcé des icônes I.
- `manifest.json` -- dépendance `bh.blishhud >=1.3.0`

## Réglages du module (en jeu)

- Chemin de `gw2_nodes.json`, chemin de sortie du `.taco`, dossier `icons/`
- Régénération auto du `.taco` après chaque capture (activable/désactivable)
- Notifications détaillées (désactivées par défaut -- seules capture/type
  restent visibles à l'écran)

## Bugs corrigés pendant le développement (pour référence)

- Course entre chargement JSON async et premier changement de map détecté
  (filtre par map bloqué sur "liste complète")
- Chemins de settings pollués par des guillemets ("Copier en tant que
  chemin d'accès" Windows) -- nettoyage automatique à la lecture
- Écritures `.taco` concurrentes non sérialisées (icônes/contenu incohérents
  d'une régénération à l'autre) -- verrou ajouté
- **Axes Y/Z inversés à la capture** : `GameService.Gw2Mumble.PlayerCharacter.Position`
  a Z=altitude (pas Y comme le reste du pipeline/JSON) -- confirmé le
  10/09/2026 par comparaison directe jeu/JSON. Remappé à la capture ET dans
  le calcul de distance du seuil de fusion.
- Sélection réinitialisée au premier élément de la liste à chaque capture
  (RefreshFilteredTypes remettait `_selectedType` à zéro même hors
  changement de map réel)
