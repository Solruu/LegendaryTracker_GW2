# BlishHUD — GW2 Node Tracker

Module Blish HUD (C#/.NET Framework 4.8) pour la capture de nodes de récolte
Guild Wars 2. Usage perso, pas de publication au répertoire officiel Blish HUD.

## Statut (15/09/2026) : fonctionnel, confirmé en jeu

Compile et tourne contre BlishHUD 1.3.0. Testé en conditions réelles par
Antoine : capture, filtre par map, panneau cliquable, régénération `.taco`,
téléchargement d'icônes, reload Pathing.

**Ce module est la source de vérité du projet.** Les scripts Python d'origine
sont conservés dans `../archives/` : ils restent autonomes et fonctionnels,
mais ne pilotent plus rien. Toute modification de la liste des types ou de
l'ordre des catégories se fait ici, en C#.

## Fichiers

### Sources
- `NodeType.cs` — 131 types de nodes (slug, groupe, libellé, sortie variable).
  Groupes : Minerai, Bois, Vegetal, Special, Festival.
- `GatheredNode.cs` — schéma JSON de `../gw2_nodes.json`
- `TacoGenerator.cs` — génère le `.taco` (XML + zip). `GroupOrder` et
  `TypeOrder` doivent couvrir tous les slugs de `NodeType.All`, sinon les
  marqueurs concernés sont absents du pack.
- `IconFetcher.cs` — icônes depuis l'API GW2, repli sur les icônes de carte
  Plante/Minerai du wiki pour les nodes à sortie variable
- `Module.cs` — logique complète : filtre par map, panneau catégorisé,
  capture, régénération du pack

### Projet Visual Studio
- `GW2_NodeTracker.slnx` — solution (format XML, VS 2026)
- `GW2_NodeTracker.csproj` — projet, cible net48, plateforme x64
- `packages.config` — dépendances NuGet (BlishHUD 1.3.0, Gw2Sharp 1.7.4,
  MonoGame 3.8, SharpDX 4.0.1, Newtonsoft.Json 13.0.1)
- `App.config` — redirections de liaison d'assembly
- `manifest.json` — manifeste du module Blish HUD

## Build

Ouvrir `GW2_NodeTracker.slnx` dans Visual Studio, restaurer les paquets NuGet,
compiler en x64. Le `.bhm` produit va dans
`Documents\Guild Wars 2\addons\blishhud\modules\`.

Les dossiers `bin/`, `obj/`, `packages/`, `ref/`, `Content/` et les binaires
restaurés à la racine (SharpDX, CppNet, mgfxc, libmojoshader) sont exclus du
dépôt : ils sont régénérés par la restauration NuGet et le build.
