#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Retire le surcout de l'artisanat assiste de Lyhr : la voie par defaut est la recette.

Usage : python3 scripts_tracker/integration/gw2_surcout_lyhr_v1.py SRC DST

Decision d'Antoine (04/10/2026) : les 8 Gifts (Blood, Bones, Claws, Dust,
Fangs, Scales, Totems, Venom) se font par la recette classique, payee en or.
Note de eikasia_mists_grasper.html : recettes a 10 or (80 au total, une fois
par compte, artisan 400) ou Lyhr, pour 10 ectos de plus par Gift — 80 par
poids d'armure. Les ingredients sont les memes dans les deux cas.

La donnee portait les 80 ectos de Lyhr en cle a plat sur Eikasia. Elle part.
La voie recette est deja modelisee : les composants `recipe_gift_*`
(`kind: account_unlock`, `enseigne`, `prix_cuivre`) que le JSX affiche pour
tout legendaire dont les totaux contiennent le don enseigne.

Verifie ailleurs : Obsidienne ne compte pas de surcout Lyhr (ses 600 ectos
par piece sont la voie « crafted » des Amalgamated Rift Essences, 720 chez
Lyhr), et aucune autre page du depot ne mentionne l'artisanat assiste.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
q = d["craft_components"]["glob_of_ectoplasm"]["qty"]
assert q.pop("eikasia") == 80
d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
