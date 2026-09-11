#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rattache les recettes des LEGENDAIRES a leurs composants.

L'extracteur d'aretes ne voyait que les recettes de composants : il resout le
titre de la page en identifiant de composant, et une page de legendaire ne
resout pas, faute d'entree dans `craft_components`. Les 69 boites Recipe des
legendaires capturees etaient donc lues, comptees dans l'index, et jetees.

Ce script les pose : pour chaque ingredient de la recette d'un legendaire, la
cle `qty[legendaire]` du composant correspondant.

LE RESULTAT VALIDE LA DONNEE PLUS QU'IL NE LA CORRIGE. Sur les 69 recettes
resolues, la comparaison avec les cles deja presentes donne ZERO conflit : la
ou les deux sources se prononcent, elles disent le meme nombre. Ce sont donc 31
cles reellement absentes qui s'ajoutent, et rien qui se contredise.

UNE GARDE INDISPENSABLE. Vingt-quatre des vingt-huit ajouts du premier jet
reintroduisaient `gift_of_maguuma_mastery` et `gift_of_desert_mastery` sur les
douze armes gen2 — exactement les cles que `alt_groups` venait de retirer,
puisque la Forge n'en demande qu'UN des deux. La recette du wiki les liste
toutes les deux parce qu'elle decrit deux recettes concurrentes ; posees a
plat, elles redonnaient le double comptage. Toute cible couverte par un groupe
de choix est donc ignoree, et l'audit `check_alt_groups` echouerait sinon.

CE QUI N'EST PAS RESOLU. 63 ingredients ne trouvent pas de composant : ce sont
pour l'essentiel les precurseurs eux-memes (Endeavor, Exitare, Friendship,
Liturgy, Spero, Tlehco, Claw of Resolution, Might of Arah...), que la base ne
modelise pas comme composants, et deux catalyseurs de la Forge — Philosopher's
Stone et Unidentified Dye — qui n'entrent dans aucun cout suivi. Ils sont
listes plutot que forces.
"""
import collections
import json
import re
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
VER = f"v{int(SRC.stem.split('_v')[-1]) + 1}"
DST = HERE / f"gw2_sources_{VER}.json"

d = json.load(open(SRC, encoding="utf-8"), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]
legs = d["legendaries"]
# gw2_wiki_recipes_v1.json etait un extrait fige de ressources/INDEX_CONTENU.json, jamais
# regenere -- 682 pages contre 720 dans l'index maitre, aujourd'hui supprime. Meme champ
# "recettes", meme forme : rien d'autre a changer que la source.
R = {r["page"]: r for r in json.load(open(HERE / "ressources" / "INDEX_CONTENU.json",
                                          encoding="utf-8")) if r.get("recettes")}


def slug(t):
    t = unicodedata.normalize("NFKD", str(t)).encode("ascii", "ignore").decode()
    t = re.sub(r"['\u2019]", "", t)
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", t.lower())).strip("_")


def en(v):
    return (v.get("en") or v.get("fr")) if isinstance(v, dict) else v


def norm(s):
    return re.sub(r"[^a-z0-9]", "", str(s).lower())


by = collections.defaultdict(set)
for cid, c in cc.items():
    for v in (en(c.get("name")) or cid, cid.replace("_", " ")):
        by[norm(v)].add(cid)


def to_id(t):
    k = norm(t.replace("_", " ").replace("%27", "'"))
    for x in (k, k.rstrip("s"), k + "s"):
        s = by.get(x)
        if s and len(s) == 1:
            return next(iter(s))
    return None


# (composant, legendaire) deja arbitres par un choix un-parmi-N
COUVERT = {(o, t) for g in (d.get("alt_groups") or {}).values()
           for o in (g.get("options") or []) for t in (g.get("targets") or [])}

ajouts, conflits, inconnus, ignores = [], [], collections.Counter(), 0
for lk, lv in legs.items():
    r = None
    for cand in (slug(lv.get("wiki") or ""), slug(en(lv.get("name")) or lk), lk):
        if R.get(cand, {}).get("recettes"):
            r = R[cand]
            break
    if r is None:
        continue
    for rc in r["recettes"]:
        if rc["sortie"] > 1:
            continue
        for ing, q in rc["ingredients"]:
            cid = to_id(ing)
            if not cid:
                inconnus[ing] += 1
                continue
            if (cid, lk) in COUVERT:
                ignores += 1
                continue
            qty = cc[cid].setdefault("qty", {})
            cur = qty.get(lk)
            if cur is None:
                # Un legendaire porte parfois deja la cle sous une forme
                # suffixee (__per_piece pour les armures) : dans ce cas la
                # recette ne dit rien de neuf et on ne double pas.
                if any(f"{lk}__{s}" in qty for s in
                       ("per_piece", "onetime", "per_unit", "full_set")):
                    continue
                qty[lk] = q
                nf = cc[cid].get("needed_for")
                if isinstance(nf, list) and lk not in nf:
                    cc[cid]["needed_for"] = sorted(set(nf) | {lk})
                ajouts.append((cid, lk, q))
            elif cur != q:
                conflits.append((cid, lk, cur, q))

assert not conflits, f"conflits inattendus : {conflits[:5]}"
print(f"recettes de legendaires posees : {len(ajouts)} cles ajoutees, 0 conflit")
for cid, lk, q in sorted(ajouts):
    print(f"   {cid} -> {lk} = {q}")
print(f"ignores car deja couverts par un alt_group : {ignores}")
print(f"ingredients non resolus : {len(inconnus)}")
print("   " + ", ".join(f"{k} x{v}" for k, v in inconnus.most_common(12)))

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{DST.name} ecrit")
