#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recettes du tracker contre recettes de l'API (24/10).

Usage : python3 scripts_tracker/controle/gw2_confronte_api_v1.py

Regle d'Antoine (09/10) : pour un id confirme, l'API a raison. Ce controle
lit ressources/api/api_recettes_composants_20261024.json (/v2/recipes/search
sur les apiId des composants : recettes d'artisanat, pas la Forge mystique)
et compare, composant par composant, les enfants declares (aretes `qty`) aux
ingredients de la recette (quantite / nombre produit).

Classes :
- ACCORD : memes enfants, memes quantites ;
- ECART : un ingredient manque, une quantite differe ou un enfant est en trop ;
- FEUILLE_MULTI : feuille alors que sa recette a plusieurs ingredients (regle
  C7 : a decomposer, sauf voie retenue hors artisanat) ;
- FEUILLE_RAFFINAGE : feuille a recette a un ingredient (C7 : reste feuille) ;
- VOIE_RETENUE : ecart sous une voie retenue hors artisanat (`best`) ;
- CHOIX : cible d'un `alt_groups`, ses options sont la recette ;
- PLUSIEURS : plusieurs recettes API, comparaison a la plus proche.
Les enfants « account_unlock » (recette achetee) ne sont pas des ingredients.
Ecrit CONFRONTATION_API.md.
"""
import json, collections
from pathlib import Path

R = Path(__file__).resolve().parents[2]
SRC = max(R.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
A = json.loads((R / "ressources/api/api_recettes_composants_20261024.json").read_text(encoding="utf-8"))
api = collections.defaultdict(list)
for k, c in cc.items():
    if isinstance(c.get("apiId"), int) and c["apiId"] > 100:
        api[c["apiId"]].append(k)
enfants = collections.defaultdict(dict)
for k, c in cc.items():
    for p, n in (c.get("qty") or {}).items():
        if p in cc:
            enfants[p][k] = n
CHOIX = collections.defaultdict(set)
for g in (d.get("alt_groups") or {}).values():
    for tg in g.get("targets") or []:
        CHOIX[tg] |= set(g.get("options") or [])
FAB = {"craft", "craft_400", "craft_500", "craft_weaponsmith", "advanced_craft", "lyhr_assisted", "refine", "auto_refine"}


def nom(i):
    return (A["items"].get(str(i)) or {}).get("name", str(i))


def lire(rid, lot=None):
    r = A["recipes"][str(rid)]
    div = 1 if lot == r["n"] else r["n"]  # aretes par fabrication quand `lot` vaut la sortie
    att, inconnus = {}, []
    for g in r["ing"]:
        ks = api.get(g["item_id"])
        if not ks:
            inconnus.append(f"{g['count']} {nom(g['item_id'])}")
            continue
        q = g["count"] / div
        att[ks[0]] = att.get(ks[0], 0) + q
    return r, att, inconnus


lignes = collections.defaultdict(list)
for k, c in sorted(cc.items()):
    a = c.get("apiId")
    rids = A["rec"].get(str(a)) if isinstance(a, int) else None
    if not rids:
        continue
    # une option de choix et un deblocage de compte (recette achetee) ne sont
    # pas des ingredients de la recette : on les laisse de cote.
    have = {x: n for x, n in enfants.get(k, {}).items()
            if x not in CHOIX.get(k, ()) and (cc.get(x) or {}).get("kind") != "account_unlock"}
    if CHOIX.get(k):
        lignes["CHOIX"].append((k, "", "options : " + ", ".join(sorted(CHOIX[k])), ""))
        continue
    best = None
    for rid in rids:
        r, att, inc = lire(rid, c.get("lot"))
        diff = set(att) ^ set(have)
        score = len(diff) + sum(1 for x in set(att) & set(have) if abs(att[x] - have[x]) > 1e-9) + len(inc)
        if best is None or score < best[0]:
            best = (score, rid, r, att, inc)
    _, rid, r, att, inc = best
    meta = f"{'/'.join(r['disc'])} {r['rating']}" + (f", x{r['n']}" if r["n"] > 1 else "")
    if not have:
        b = c.get("best")
        types = {s.get("type") for s in c.get("sources") or [] if isinstance(s, dict)} - {"trading_post"}
        hors = (b is not None and b not in FAB) or (bool(types) and not (types & FAB))
        cl = "FEUILLE_RAFFINAGE" if len(r["ing"]) == 1 else ("FEUILLE_VOIE" if hors else "FEUILLE_MULTI")
        lignes[cl].append((k, meta, ", ".join(f"{g['count']} {nom(g['item_id'])}" for g in r["ing"]), b or ""))
        continue
    pb = []
    for x in sorted(set(att) | set(have)):
        if x not in have:
            pb.append(f"manque {att[x]:g} {x}")
        elif x not in att:
            pb.append(f"en trop {have[x]} {x}")
        elif abs(att[x] - have[x]) > 1e-9:
            pb.append(f"{x} : {have[x]} au lieu de {att[x]:g}")
    pb += [f"ingredient sans composant : {s}" for s in inc]
    b = c.get("best")
    cl = "ECART" if pb else "ACCORD"
    if pb and b is not None and b not in FAB:
        cl = "VOIE_RETENUE"
    if len(rids) > 1:
        lignes["PLUSIEURS"].append((k, meta, f"{len(rids)} recettes, comparee : {rid}", ""))
    lignes[cl].append((k, meta, " ; ".join(pb), c.get("best") or ""))

out = ["# Confrontation des recettes avec l'API", "",
       f"Source : `{SRC.name}` contre `ressources/api/api_recettes_composants_20261024.json` "
       "(recettes d'artisanat ; la Forge mystique n'est pas dans l'API). Regle : pour un id confirme, l'API a raison.", "",
       "| classe | nombre |", "|---|---:|"]
for cl in ("ACCORD", "ECART", "VOIE_RETENUE", "CHOIX", "FEUILLE_MULTI", "FEUILLE_VOIE", "FEUILLE_RAFFINAGE", "PLUSIEURS"):
    out.append(f"| {cl} | {len(lignes[cl])} |")
for cl in ("ECART", "FEUILLE_MULTI", "VOIE_RETENUE", "FEUILLE_VOIE", "PLUSIEURS"):
    out += ["", f"## {cl}", "", "| composant | recette | detail | best |", "|---|---|---|---|"]
    out += [f"| `{a}` | {b} | {c_} | {e} |" for a, b, c_, e in lignes[cl]]
(R / "CONFRONTATION_API.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(" | ".join(f"{cl} {len(v)}" for cl, v in lignes.items()))
print("CONFRONTATION_API.md ecrit")
