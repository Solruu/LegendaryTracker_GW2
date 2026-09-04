# BlishHUD

Module Blish HUD (C#/.NET) pour la capture de nodes, en remplacement de
`gw2_node_ID_v9.py` (usage perso, pas de publication au répertoire officiel
Blish HUD — cf. session du 03/09/2026).

Statut : squelette pas encore généré. En attente du template Visual Studio
(blish-hud/Module-Template) + retour du Module.cs / manifest.json générés
avant d'écrire la logique de capture.

Logique à porter depuis le script Python (inchangée, juste le langage/UI) :
- Lecture MumbleLink (position + map_id) via GameService.Gw2Mumble
- Menu de sélection filtré par map courante (types déjà capturés ici)
- Seuil de fusion 5m sur les nodes Vegetal (upsert plutôt que doublon)
- Écriture dans le même gw2_nodes.json (format inchangé, compatible avec
  gw2_taco_gen_v6.py)
