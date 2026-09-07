#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Echange TOUTES les aretes d'un composant contre ses cles a plat, d'un bloc.

La v3 echangeait arete par arete. Elle butait sur les composants a plusieurs
parents : `glob_of_ectoplasm` entre dans Gift of Fortune, Gift of Research,
Gift of Infused Gems et l'essence de faille amalgamee. Poser une seule de ces
aretes ne reproduit jamais la cle a plat, qui couvre les quatre chemins a la
fois — la v3 la refusait donc, et refusait aussi les trois autres pour la meme
raison. Trente-cinq aretes bloquees a se regarder.

Ici l'unite d'echange est le COMPOSANT. On pose toutes ses aretes candidates
d'un coup, puis on verifie legendaire par legendaire que la somme des produits
egale exactement la cle a plat. Si oui, les cles partent ; si non, rien ne
bouge et l'ecart est affiche.

Deux conditions heritees de la v3, et toujours necessaires :

- une arete ne doit toucher que des legendaires ou le composant est deja compte
  a plat, sinon elle revele ailleurs des couts que rien ne prouve ;
- les chevauchements declares legitimes sont ignores, la cle et la cascade y
  etant deux exigences reelles.

Le controle final ne change pas : recalcul de tous les totaux, refus d'ecrire
au moindre ecart.

ETAT : ce script N'EST PAS encore utilisable en production, et le controle final
est ce qui l'empeche de nuire. Il deplie bien 29 composants, mais les recettes
de PROMOTION des trophees le font diverger. Un Mystic Curio transforme cinq os
en un os lourd avec de la poussiere cristalline ; la table du wiki la presente
comme une recette ordinaire, et posee telle quelle elle relie les paliers de
trophees entre eux. La poussiere radiante de Coalescence passe alors de 100 a
plus d'un milliard.

Le garde-fou anti-cycle ne suffit pas : ces recettes ne referment pas toujours
une boucle stricte, elles multiplient simplement les chemins. Il faut les
reconnaitre pour ce qu'elles sont — des CONVERSIONS entre paliers, une facon
alternative d'obtenir un materiau, pas une exigence de l'arbre — et les exclure
de l'extraction avant d'aller plus loin. C'est le prochain travail.

En attendant, le refus d'ecrire au moindre total suspect a fait son office : la
version divergente n'a jamais ete versee.
"""
import collections
import json

SRC, DST = "gw2_sources_v228.json", "gw2_sources_v229.json"
ARETES = "/tmp/edges2.json"
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))

d = json.load(open(SRC), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]
E = {tuple(k.split("|")): v[0] for k, v in json.load(open(ARETES)).items()}
par_enfant = collections.defaultdict(dict)
for (p, e), q in E.items():
    if p in cc and e in cc and p != e:
        par_enfant[e][p] = q


def _cycle(enfant, parent):
    """Vrai si poser enfant -> parent rend le graphe cyclique."""
    # On remonte depuis le PARENT. Si l'enfant est deja au-dessus de lui, la
    # nouvelle arete referme la boucle. Un premier jet remontait depuis
    # l'enfant, c'est-a-dire dans le sens ou l'arete n'existe pas encore : il ne
    # detectait rien et la cascade divergeait quand meme.
    vus, pile = set(), [parent]
    while pile:
        cid = pile.pop()
        if cid == enfant:
            return True
        if cid in vus:
            continue
        vus.add(cid)
        for k in (cc.get(cid, {}).get("qty") or {}):
            b = k.split("__")[0]
            if b in cc:
                pile.append(b)
    return False


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
avant = {l: totaux(l) for l in cibles}

faits, refus = [], []
for tour in range(4):
    T = {l: totaux(l) for l in cibles}
    bouge = False
    for enfant, parents in sorted(par_enfant.items()):
        q = cc[enfant].get("qty") or {}
        neuves = {p: v for p, v in parents.items() if p not in q}
        if not neuves:
            continue
        declares = set(cc[enfant].get("qty_overlap_verified") or [])
        plat = {k for k in q if k.split("__")[0] not in cc and k == k.split("__")[0]
                and k not in declares}
        portee = {l for l in cibles if any(T[l].get(p, 0) > 0 for p in neuves)}
        if not portee:
            continue
        # Un legendaire de la portee SANS cle a plat n'est pas un doublon : le
        # composant n'y est compte nulle part et la table du wiki dit qu'il
        # devrait l'etre. Refuser ces cas par prudence revenait a refuser tout
        # remplissage, et le garde-fou devenait l'obstacle. On les autorise et
        # on les affiche ; ce qu'on n'autorise pas, c'est qu'un legendaire DEJA
        # compte a plat voie son total bouger.
        # Les recettes de promotion — un Mystic Curio transforme cinq T5 en un
        # T6 avec de la poussiere — relient les trophees entre eux dans les deux
        # sens. Posees telles quelles, elles referment le graphe sur lui-meme et
        # la cascade diverge : la poussiere radiante de Coalescence est passee
        # de 100 a plus d'un milliard avant que le controle ne l'arrete. Une
        # arete qui rendrait le graphe cyclique est donc refusee.
        if any(_cycle(enfant, p) for p in neuves):
            refus.append((enfant, len(neuves), "cycle", sorted(neuves)[:2]))
            continue
        remplis = sorted(portee - plat)
        ecarts = []
        for leg in portee & plat:
            total = sum(v * T[leg].get(p, 0) for p, v in q.items() if p in cc)
            total += sum(v * T[leg].get(p, 0) for p, v in neuves.items())
            if total != q[leg]:
                ecarts.append((leg, q[leg], total))
        if ecarts:
            refus.append((enfant, len(neuves), "compte", ecarts[:2]))
            continue
        for p, v in neuves.items():
            q[p] = v
        cc[enfant]["needed_for"] = sorted(set(cc[enfant].get("needed_for") or []) | set(neuves))
        for leg in portee & plat:
            del q[leg]
        faits.append((enfant, sorted(neuves), len(portee & plat), remplis))
        bouge = True
    if not bouge:
        break

apres = {l: totaux(l) for l in cibles}
ec = [(l, k, avant[l].get(k, 0), apres[l].get(k, 0)) for l in cibles
      for k in set(avant[l]) | set(apres[l]) if avant[l].get(k, 0) != apres[l].get(k, 0)]
print(f"composants deplies : {len(faits)}")
for e, ps, n, r in faits:
    print(f"   {e} : {len(ps)} aretes, {n} cles retirees, {len(r)} legendaires remplis")
print(f"\nrefuses : {len(refus)}")
for r in refus[:10]:
    print("  ", r)
print(f"\nECARTS DE TOTAL : {len(ec)}")
for x in ec[:10]:
    print("  ", x)
# Toute variation doit etre une HAUSSE sur un legendaire qui ne comptait rien :
# c'est un remplissage. Une baisse, ou une hausse la ou un total existait, serait
# une erreur.
suspects = [x for x in ec if not (x[2] == 0 and x[3] > 0)]
print(f"dont remplissages (0 -> n) : {len(ec) - len(suspects)} | suspects : {len(suspects)}")
for x in suspects[:10]:
    print("   SUSPECT", x)
if not suspects:
    d["_meta"]["version"] = "v229"
    d["_meta"]["last_updated"] = "2026-09-06"
    json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{DST} ecrit — {len(ec)} remplissages, aucun total existant modifie")
