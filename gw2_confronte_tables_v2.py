#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Confronte la donnee aux tables « Full material list », arete par arete.

Ces 77 tables sont la seule source du depot qui donne l'arbre DEVELOPPE d'un
legendaire : la boite Recipe s'arrete au premier niveau, la table descend a
trois. Elles sont parsees depuis longtemps — 757 aretes dans
gw2_material_lists_v1.json — et elles ne servaient a rien : l'extracteur
d'aretes ne lit que les boites Recipe et les tables vendeur.

Ce script les confronte a `qty`, une arete a la fois. Il ne modifie rien.

LE PIEGE DE LA COLONNE 3, que le parseur documente et que j'aurais reproduit
si je l'avais ignore : les quantites de la troisieme colonne sont AGREGEES sur
celle de la deuxieme. Quand la colonne 2 dit « 2 Gift of Condensed Might » et
la colonne 3 « 2 Gift of Bones », la recette du don condense demande UN Gift of
Bones. La quantite unitaire s'obtient donc en divisant par la quantite de la
colonne 2 — et une division qui ne tombe pas juste est signalee plutot que
arrondie.

TROIS VERDICTS PAR ARETE :

- ACCORD — la table et `qty` disent le meme nombre.
- ABSENTE — la table chiffre une arete que `qty` ne porte pas. C'est un cout
  manquant, pas un desaccord.
- DESACCORD — les deux se prononcent et divergent. L'un des deux est faux.

Les aretes sans nombre ecrit sont ignorees : le wiki y sous-entend 1, mais ce
script ne devine pas.
"""
import collections
import json
import re
import sys
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import gw2_parse_material_list_v2 as P  # noqa: E402

SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
d = json.load(open(SRC, encoding="utf-8"))
cc = d["craft_components"]


def en(v):
    return (v.get("en") or v.get("fr")) if isinstance(v, dict) else v


def norm(s):
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", str(s))
                  .encode("ascii", "ignore").decode().lower())


by = collections.defaultdict(set)
for cid, c in cc.items():
    for v in (en(c.get("name")) or cid, cid.replace("_", " ")):
        by[norm(v)].add(cid)


def to_id(t):
    k = norm(str(t).replace("_", " ").replace("%27", "'"))
    for x in (k, k.rstrip("s"), k + "s"):
        s = by.get(x)
        if s and len(s) == 1:
            return next(iter(s))
    return None


accord, absente, desaccord, non_resolus = [], [], [], collections.Counter()
divisions, ambigus_div = [], []
for page in sorted(P.WIKI.glob("*.html")):
    if P._debut(page.read_text(encoding="utf-8", errors="ignore")) < 0:
        continue
    if page.stem in P.DOUBLES:
        continue
    # La division des totaux est faite par le parseur, une fois pour tous les
    # consommateurs. Cette boucle en portait sa propre version, voisine mais
    # pas identique a celle de l'extracteur d'aretes : deux lectures possibles
    # de la meme table, dont le desaccord ne pouvait pas se voir.
    brut, refusees, ambigus = P.aretes_unitaires(page)
    divisions += [(page.stem,) + x for x in refusees]
    ambigus_div += [(page.stem,) + x for x in ambigus]
    for tete, enfant, unitaire in brut:
        if unitaire is None:
            continue
        pid, eid = to_id(tete), to_id(enfant)
        if not pid or not eid:
            non_resolus[tete if not pid else enfant] += 1
            continue
        cur = (cc[eid].get("qty") or {}).get(pid)
        if cur is None:
            absente.append((page.stem, eid, pid, unitaire))
        elif cur == unitaire:
            accord.append((eid, pid, unitaire))
        else:
            desaccord.append((page.stem, eid, pid, cur, unitaire))

# une meme arete apparait sur plusieurs pages : on ne la compte qu'une fois
uniq = lambda xs, n: sorted({x[1:n] if n else x for x in xs})  # noqa: E731
abs_u = sorted({(e, p, q) for _pg, e, p, q in absente})
des_u = sorted({(e, p, a, b) for _pg, e, p, a, b in desaccord})
acc_u = sorted(set(accord))

out = [f"# Confrontation aux tables « Full material list »\n",
       f"Source : `{SRC.name}` contre les 77 tables capturées, arête par arête.\n",
       f"- **{len(acc_u)} accords** — la table et `qty` disent le même nombre.",
       f"- **{len(abs_u)} arêtes absentes** de `qty` — un coût manquant, pas un désaccord.",
       f"- **{len(des_u)} désaccords** — les deux se prononcent et divergent.\n",
       "Les quantités de troisième colonne sont divisées par celles de la deuxième :",
       "le wiki les agrège. Une division qui ne tombe pas juste est signalée, pas",
       "arrondie. Les arêtes sans nombre écrit sont ignorées.\n"]

out.append(f"\n## Désaccords — {len(des_u)}\n")
out.append("| composant | parent | `qty` | table |")
out.append("|---|---|---:|---:|")
for e, p, a, b in sorted(des_u, key=lambda x: -abs(x[3] - x[2])):
    out.append(f"| `{e}` | `{p}` | {a} | {b} |")

out.append(f"\n## Arêtes chiffrées par la table et absentes de `qty` — {len(abs_u)}\n")
out.append("| composant | parent | table |")
out.append("|---|---|---:|")
for e, p, q in sorted(abs_u, key=lambda x: -x[2]):
    out.append(f"| `{e}` | `{p}` | {q} |")

if divisions:
    out.append(f"\n## Divisions qui ne tombent pas juste — {len(divisions)}\n")
    out.append("La colonne 3 devrait être un multiple de la colonne 2. Quand elle ne")
    out.append("l'est pas, la lecture d'une des deux est fausse.\n")
    out.append("| page | tête | enfant | colonne 3 | colonne 2 |")
    out.append("|---|---|---|---:|---:|")
    for pg, t, e, q, dv in sorted(set(divisions)):
        out.append(f"| `{pg}` | `{t}` | `{e}` | {q} | {dv} |")

Path(HERE / "CONFRONTATION_TABLES.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"accords : {len(acc_u)} | absentes : {len(abs_u)} | desaccords : {len(des_u)}")
print(f"divisions non entieres : {len(set(divisions))}")
print(f"parents a diviseur ambigu : {len(set(ambigus_div))}")
print(f"noms non resolus : {len(non_resolus)} — {non_resolus.most_common(8)}")
print("CONFRONTATION_TABLES.md ecrit")
