#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Aretes de la donnee qu'aucune capture ne propose. Lecture seule.

Usage : python3 scripts_tracker/parseurs/gw2_edges_wiki_v15.py  (ecrit /tmp/edges2.json)
        python3 scripts_tracker/controle/gw2_aretes_non_sourcees_v2.py

Ne de C3 (04/10/2026) : `cube_stabilized_dark_energy <- gift_of_research`
etait posee depuis des semaines alors que la recette du Gift of Research n'a
aucun cube — la page du cube ne le cite que dans sa navbox. 23 legendaires
comptaient un cube et 75 matrices de trop, et aucun controle ne le voyait.

Regle : si les captures LISENT la composition d'un parent (recette, cout
vendeur ou table de materiaux : au moins une arete proposee pour lui), toute
arete de la donnee vers ce parent doit figurer parmi les propositions. Sinon
elle est listee. Un parent sans aucune proposition n'est pas juge : rien ne
dit ce qu'il contient.

Une ligne listee n'est pas forcement fausse : seconde recette (sigils,
Mystic Forge contre artisanat), cout en or, ambiguite de nom non resolue par
le parseur, chaine posee depuis un arbre gw2efficiency. Elle demande une
lecture de page. Ecrit ARETES_NON_SOURCEES.md a la racine.
"""
import collections
import json
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
cc = json.loads(SRC.read_text(encoding="utf-8"))["craft_components"]
E = json.load(open("/tmp/edges2.json"))
lus = collections.defaultdict(dict)
for k, v in E.items():
    p, c = k.split("|")
    lus[p][c] = v

lignes = []
for c, comp in cc.items():
    for k, q in (comp.get("qty") or {}).items():
        p = k.split("__")[0]
        if p in cc and p in lus and c not in lus[p]:
            lignes.append((p, c, q, ", ".join(f"{x} {v[0]}" for x, v in sorted(lus[p].items()))))
lignes.sort()

out = ["# Aretes non sourcees\n",
       f"Source : `{SRC.name}`. **{len(lignes)} aretes** sur "
       f"{len({x[0] for x in lignes})} parents dont les captures lisent la composition,",
       "mais qui ne proposent pas cette arete. A lire page en main : seconde recette,",
       "cout en or, ambiguite de nom, ou arete fausse (le cas du cube et du Gift of",
       "Research, retire le 04/10).\n",
       "| parent | enfant (donnee) | qty | ce que les captures proposent |",
       "|---|---|---:|---|"]
out += [f"| `{p}` | `{c}` | {q} | {lu} |" for p, c, q, lu in lignes]
(HERE / "ARETES_NON_SOURCEES.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"{len(lignes)} aretes non sourcees sur {len({x[0] for x in lignes})} parents")
print("ARETES_NON_SOURCEES.md ecrit")
