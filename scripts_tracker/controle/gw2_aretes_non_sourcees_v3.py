#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Aretes de la donnee qu'aucune capture ne propose. Lecture seule.

Usage : python3 scripts_tracker/parseurs/gw2_edges_wiki_v15.py  (ecrit /tmp/edges2.json)
        python3 scripts_tracker/controle/gw2_aretes_non_sourcees_v3.py

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

v3 — VOIES CONCURRENTES. Une arete juste peut cacher sa jumelle fausse :
Certificate of Heroics portait 250 Castoran (vendeur, non proposee) ET 250
Jade (recette, proposee) ; la Castoran sortait ici comme suspecte, la Jade
passait pour sourcee, et le double compte restait invisible. Est signalee
toute arete non proposee dont un frere du meme parent EST propose, a la
meme quantite, avec un nom qui ne differe que d'un mot. Mesure : exactement
les 2 lignes Jade sur v361, 0 sur v363 ; la regle a plat sans la condition
« proposee / non proposee » en donnait 130 (recettes paralleles legitimes).
Sortie 1 si une voie concurrente est trouvee : c'est un double compte tant
qu'on n'a pas prouve que la recette exige les deux.
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


def _nom(c):
    n = cc[c].get("name")
    return ((n.get("en") or n.get("fr")) if isinstance(n, dict) else n) or c


enf = collections.defaultdict(dict)
for c, comp in cc.items():
    for k, q in (comp.get("qty") or {}).items():
        p = k.split("__")[0]
        if p in cc:
            enf[p][c] = q
jumelles = []
for p, c, q, _ in lignes:
    for b, qb in enf[p].items():
        if b == c or b not in lus[p] or qb != q:
            continue
        wa, wb = _nom(c).split(), _nom(b).split()
        if len(wa) == len(wb) and sum(x != y for x, y in zip(wa, wb)) == 1:
            jumelles.append((p, c, b, q))

out = ["# Aretes non sourcees\n",
       f"Source : `{SRC.name}`. **{len(lignes)} aretes** sur "
       f"{len({x[0] for x in lignes})} parents dont les captures lisent la composition,",
       "mais qui ne proposent pas cette arete. A lire page en main : seconde recette,",
       "cout en or, ambiguite de nom, ou arete fausse (le cas du cube et du Gift of",
       "Research, retire le 04/10).\n",
       "| parent | enfant (donnee) | qty | ce que les captures proposent |",
       "|---|---|---:|---|"]
out += [f"| `{p}` | `{c}` | {q} | {lu} |" for p, c, q, lu in lignes]
out += ["", f"## Voies concurrentes — {len(jumelles)}\n",
        "Arete non proposee dont un frere du meme parent l'est, a quantite egale,",
        "nom a un mot pres : deux voies d'acquisition comptees ensemble (le cas",
        "Jade / Castoran Heroics, v361). Doit rester a zero.\n"]
if jumelles:
    out += ["| parent | non proposee | proposee | qty |", "|---|---|---|---:|"]
    out += [f"| `{p}` | `{a}` | `{b}` | {q} |" for p, a, b, q in jumelles]
(HERE / "ARETES_NON_SOURCEES.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"{len(lignes)} aretes non sourcees sur {len({x[0] for x in lignes})} parents")
print(f"voies concurrentes : {len(jumelles)}")
print("ARETES_NON_SOURCEES.md ecrit")
if jumelles:
    raise SystemExit(1)
