# scripts_tracker/

Les scripts du tracker, rangés par domaine. Ils se lancent **depuis la racine
du dépôt** :

    python scripts_tracker/controle/gw2_audit_v58.py

| dossier | rôle |
|---|---|
| `moteur/` | le calcul, écrit une fois. Importé par les contrôles et le dépliage. |
| `parseurs/` | lecture des captures : wiki, gw2efficiency, tables de matériaux. |
| `captures/` | gestion du corpus : index de contenu, index de `INDEX.md`, file de captures. |
| `controle/` | audit, confrontations, conformité des deux moteurs. Rien n'y écrit dans les sources. |
| `integration/` | les passes qui **écrivent** dans `gw2_sources_*.json`. Souvent à usage unique, gardées parce que rejouables. |
| `referentiel/` | régénération des trois `*_ref.json` depuis l'API publique. |
| `serveur/` | le serveur Flask local et la génération du HTML autonome. |

Deux ancrages cohabitent dans ces fichiers, à ne pas confondre en les éditant :

- `parents[2]` — la **racine du dépôt**, où vivent les données
  (`gw2_sources_*.json`, `ressources/`, `docs/`) ;
- `parents[1]` — la racine de `scripts_tracker/`, posée sur `sys.path` pour les
  imports croisés, qui sont qualifiés : `from moteur.gw2_moteur_v3 import Modele`.

`gw2_edges_wiki_v15.py` importe ses voisins de `parseurs/` sans qualifier :
Python met le dossier du script sur `sys.path`, et il y est lui-même.
