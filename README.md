# LegendaryTracker_GW2

Tracker personnel de craft d'objets légendaires Guild Wars 2 — 13 onglets couvrant les colifichets (Vision, Aurora, Conflux, Coalescence, Prismatic, Selachimorpha, Eikasia, Endless Summer, Stella Radians, Orrax Manifested, Ad Infinitum, Strife Unending), les sets d'armure (Obsidian, Envoy Perfectionné, Triumphant Hero, Ardent Glorious), les armes, les améliorations légendaires et le Grand Total.

## Architecture

### Application
- `gw2_legendary_tracker_v98.jsx` — frontend React (Babel standalone), i18n EN/FR
- `gw2_sources_v71.json` — base de données éditoriale (SOURCES_DB)
- `gw2_flask_server_v28.py` — backend Flask optionnel, pont vers l'API GW2 (clé via `.env`, jamais committée)
- `gw2_*_ref.json` — référentiels canoniques (currencies, materials, achievements)

### Scripts — rôles à ne pas confondre
| Script | Fonction | Écrit |
|---|---|---|
| `gw2_build_html_v2.py` | **Build de publication** : injecte JSX + SOURCES_DB dans le template | `docs/index.html` |
| `gw2_refresh_refs_v2.py` | **Régénération des référentiels** depuis l'API publique | `gw2_currencies_ref.json`, `gw2_materials_ref.json`, `gw2_achievements_ref.json` |
| `gw2_dump_bits_v2.py` | **Collecte de données éditoriales** : dump des bits ordonnés / tiers / points des achievements, pour rédiger les `bitTips` au bon index et repérer les compteurs sans étapes | `gw2_bits_dump.json` (jetable, non consommé par l'app) |

Les trois s'exécutent **en local** : `api.guildwars2.com` n'est pas joignable depuis l'environnement de développement assisté.

## GitHub Pages
Le rendu statique est publié depuis `/docs` (`docs/index.html`, buildé depuis le JSX).
⚠️ Pages est statique : la synchro compte se fait par appel direct à l'API GW2 depuis le navigateur (`?access_token=`), Flask ne servant plus que d'appoint en local.

## Build local
```
python3 gw2_build_html_v2.py --jsx gw2_legendary_tracker_v98.jsx --out docs/index.html
```

## Convention de versions
Chaque fichier modifié est renommé avec un suffixe `_vX` incrémenté, l'ancienne version étant retirée via `git rm`. `docs/index.html` est rebuildé à chaque push.
