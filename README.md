# LegendaryTracker_GW2

Tracker personnel de craft d'objets légendaires Guild Wars 2 (Aurora, Vision, Conflux, Warbringer, Coalescence, Prismatic Champion's Regalia, Obsidian Armor, Grand Total).

## Architecture
- `gw2_flask_server_v3.py` — backend Flask, pont vers l'API officielle GW2 (clé API via `.env`, jamais committée)
- `gw2_legendary_tracker_v7.jsx` — frontend React (Babel standalone), i18n EN/FR
- `gw2_sources_v4.json` — base de données éditoriale (SOURCES_DB)
- `gw2_build_html_v1.py` — génère le HTML standalone (injection SOURCES_DB via `// __SOURCES_DB_INJECT__`)
- `gw2_*_ref.json` — références canoniques (currencies, materials, achievements)

## GitHub Pages
Le rendu statique est publié depuis `/docs` (`docs/index.html`, buildé depuis le JSX).
⚠️ Pages est statique : les données live nécessitent le serveur Flask en local (`http://localhost:5000`).

## Build local
```
python gw2_build_html_v1.py --jsx gw2_legendary_tracker_v7.jsx --out docs/index.html
```
