#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Liste les aretes que le depliage refuse de poser, triees par enjeu chiffre.

`gw2_deplie_wiki_v5` pose une arete quand elle reproduit exactement ce que la
donnee compte deja, ou quand elle comble un vide. Tout le reste est refuse et
reste a plat : ce ne sont pas des trous, ce sont des DESACCORDS entre deux
sources qui parlent du meme cout.

Ce script ne decide rien. Il sort le desaccord sous la forme la plus courte qui
permette de trancher : le composant, le legendaire, ce que la donnee dit, ce que
la table du wiki dit, et l'ecart. Trois familles, qui ne se tranchent pas de la
meme facon :

- ECART DE COMPTE — la cle a plat et l'arete donnent deux nombres differents.
  L'un des deux est faux. Se tranche sur la page du PARENT, boite Recipe.
- DEJA COMPTE PAR CASCADE — le composant arrive deja au legendaire par un
  chemin modelise, et la table en propose un second. Soit le second chemin
  n'existe pas pour ce legendaire, soit les deux sont reels et le
  chevauchement doit etre declare dans `qty_overlap_verified`.
- COUT VENDEUR — la table vendeur aplatit des options qui s'excluent. Se
  tranche en regardant si le vendeur propose un choix ou une liste.

L'enjeu chiffre est |ce que la donnee dit - ce que l'arete donnerait|, en
valeur absolue. Il classe, il ne juge pas : un ecart de 1 sur un Bloodstone
Shard peut compter plus qu'un ecart de 18 000 sur une monnaie de carte.
"""
import collections
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
ARETES = Path("/tmp/edges2.json")
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))

if not ARETES.exists():
    sys.exit("lance d'abord gw2_edges_wiki_v3.py, qui produit /tmp/edges2.json")

cc = json.load(open(SRC))["craft_components"]
E = {tuple(k.split("|")): tuple(v) for k, v in json.load(open(ARETES)).items()}
par_enfant = collections.defaultdict(dict)
origine = {}
for (p, e), (q, org) in E.items():
    if p in cc and e in cc and p != e:
        par_enfant[e][p] = q
        origine[(e, p)] = org


def nom(cid):
    n = cc.get(cid, {}).get("name")
    return (n.get("en") or n.get("fr")) if isinstance(n, dict) else (n or cid)


def totaux(leg):
    t, exp = {}, {}
    for cid, c in cc.items():
        q = c.get("qty") or {}
        for suf, mm in SUF:
            mult = mm if (suf not in ("__per_piece", "__full_set") or leg in ARMOR) else 0
            v = q.get(leg + suf)
            if isinstance(v, int) and mult:
                t[cid] = t.get(cid, 0) + v * mult
    for _ in range(10):
        add = {}
        for cid, c in cc.items():
            for k, v in (c.get("qty") or {}).items():
                if isinstance(v, int) and k in cc and t.get(k, 0) > 0:
                    add[cid] = add.get(cid, 0) + v * t[k]
        bouge = False
        for cid, v in add.items():
            if exp.get(cid, 0) != v:
                t[cid] = t.get(cid, 0) - exp.get(cid, 0) + v
                exp[cid] = v
                bouge = True
        if not bouge:
            break
    return t


cibles = sorted({k.split("__")[0] for c in cc.values() for k in (c.get("qty") or {})
                 if k.split("__")[0] not in cc})
T = {l: totaux(l) for l in cibles}

FAM = {"compte": "ECART DE COMPTE", "cascade": "DEJA COMPTE PAR CASCADE",
       "vendeur": "COUT VENDEUR"}
lignes = []
for enfant, parents in sorted(par_enfant.items()):
    q = cc[enfant].get("qty") or {}
    neuves = {p: v for p, v in parents.items() if p not in q}
    if not neuves:
        continue
    declares = set(cc[enfant].get("qty_overlap_verified") or [])
    cascade = {l: sum(v * T[l].get(p, 0) for p, v in q.items() if p in cc) for l in cibles}
    apport = {l: sum(v * T[l].get(p, 0) for p, v in neuves.items()) for l in cibles}
    for leg in cibles:
        if apport[leg] == 0:
            continue
        plat = q.get(leg)
        if leg in declares or not isinstance(plat, int):
            plat = None
        if plat is not None:
            if apport[leg] == plat:
                continue
            fam, dit = "compte", plat
        elif cascade[leg] > 0:
            fam, dit = "cascade", cascade[leg]
        elif any(origine.get((enfant, p)) != "recette" for p in neuves):
            fam, dit = "vendeur", 0
        else:
            continue
        lignes.append((abs(apport[leg] - dit), fam, enfant, leg, dit, apport[leg],
                       sorted(neuves), {p: origine.get((enfant, p)) for p in neuves}))

lignes.sort(key=lambda x: -x[0])
par_fam = collections.Counter(x[1] for x in lignes)
composants = {x[2] for x in lignes}

out = [f"# Arbitrages de l'arbre de craft\n",
       f"Source : `{SRC.name}` — {len(lignes)} desaccords sur {len(composants)} composants.\n",
       "Chaque ligne est une arete que le wiki propose et que la donnee contredit.",
       "Elle reste **a plat** tant qu'elle n'est pas tranchee : rien n'a ete devine.\n"]
par_comp = collections.defaultdict(lambda: collections.Counter())
enjeu_comp = collections.Counter()
for enj, f, e, leg, dit, ap, ps, orgs in lignes:
    par_comp[e][f] += 1
    enjeu_comp[e] = max(enjeu_comp[e], enj)
out.append("\n## Par composant, du plus expose au moins expose\n")
out.append("| composant | desaccords | plus gros ecart | familles |")
out.append("|---|---:|---:|---|")
for e, _ in enjeu_comp.most_common():
    fams = ", ".join(f"{FAM[f].lower()} x{n}" for f, n in par_comp[e].most_common())
    out.append(f"| `{e}` — {nom(e)} | {sum(par_comp[e].values())} | {enjeu_comp[e]} | {fams} |")

for f in ("compte", "cascade", "vendeur"):
    sous = [x for x in lignes if x[1] == f]
    if not sous:
        continue
    out.append(f"\n## {FAM[f]} — {len(sous)} cas\n")
    if f == "compte":
        out.append("La cle a plat et l'arete donnent deux nombres differents : l'un des deux")
        out.append("est faux. Se tranche sur la page du PARENT, boite Recipe.\n")
    elif f == "cascade":
        out.append("Le composant arrive deja au legendaire par un chemin modelise, et la table")
        out.append("en propose un second. Soit ce second chemin ne vaut pas pour ce legendaire,")
        out.append("soit les deux sont reels et le chevauchement se declare dans")
        out.append("`qty_overlap_verified`.\n")
    else:
        out.append("La table vendeur aplatit des options qui s'excluent. Se tranche en")
        out.append("regardant si le vendeur propose un choix ou une liste.\n")
    # Le detail est plafonne : une famille a 811 lignes ne se lit pas, et la
    # somme par composant plus haut suffit a decider par ou commencer. Le
    # calcul, lui, porte sur la totalite.
    CAP = 60
    if len(sous) > CAP:
        out.append(f"Les {CAP} plus gros ecarts sur {len(sous)}. Le reste se")
        out.append("recalcule en relancant le script.\n")
    out.append("| composant | legendaire | donnee | wiki | ecart | parents proposes |")
    out.append("|---|---|---:|---:|---:|---|")
    for enj, _, e, leg, dit, ap, ps, orgs in sous[:CAP]:
        # La liste complete des parents est illisible des qu'un composant en a
        # treize (glob_of_ectoplasm). On en montre trois, le compte fait le
        # reste, et le detail se relit dans /tmp/edges2.json.
        pp = ", ".join(f"{p} ({orgs[p]})" for p in ps[:3])
        if len(ps) > 3:
            pp += f" +{len(ps) - 3} autres"
        out.append(f"| `{e}` — {nom(e)} | `{leg}` | {dit} | {ap} | {enj} | {pp} |")

Path(HERE / "ARBITRAGES.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"{len(lignes)} desaccords sur {len(composants)} composants")
for f, n in par_fam.most_common():
    print(f"   {n:4}  {FAM[f]}")
print("ARBITRAGES.md ecrit")
