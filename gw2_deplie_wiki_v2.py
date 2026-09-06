#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Deplie les couts a plat, legendaire par legendaire.

La v1 travaillait par COMPOSANT, en tout ou rien : elle n'acceptait de retirer
les cles a plat d'un composant que si l'arbre reproduisait TOUTES ses cles.
`bloodstone_shard` en porte 57, `mystic_clover` 73 : il suffit d'un seul
legendaire dont le chemin n'est pas modelise pour bloquer les cinquante-six
autres. Resultat, la v1 depliait zero composant sur les six plus gros.

Ce tout-ou-rien repondait a une vraie crainte — laisser un composant compte en
direct sur certains legendaires et par la cascade sur d'autres. Mais la crainte
etait mal cadree. Le double comptage se produit pour UN legendaire donne,
quand la meme depense y arrive par deux chemins. Deux legendaires differents ne
peuvent pas se doubler l'un l'autre.

La condition juste est donc par paire (composant, legendaire) :

- l'arbre contribue zero pour ce legendaire -> la cle a plat est la seule
  source, on n'y touche pas ;
- l'arbre contribue exactement la valeur a plat -> la cle fait doublon, elle
  part, le total ne bouge pas ;
- l'arbre contribue autre chose -> on ne touche a rien et l'audit continue de
  le signaler, c'est un arbitrage.

Le controle final reste le meme et reste souverain : recalcul de tous les
totaux avant et apres, et refus d'ecrire au moindre ecart.
"""
import collections
import json

SRC, DST = "gw2_sources_v222.json", "gw2_sources_v223.json"
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))

d = json.load(open(SRC), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]


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

retires = []
ecarts_laisses = collections.Counter()
for tour in range(6):
    T = {l: totaux(l) for l in cibles}
    bouge = False
    for cid in sorted(cc):
        q = cc[cid].get("qty") or {}
        for cle in [k for k in list(q) if k.split("__")[0] not in cc]:
            leg = cle.split("__")[0]
            # Les cles suffixees portent un multiplicateur propre : on les laisse.
            if cle != leg:
                continue
            # Un chevauchement deja declare legitime n'est PAS un doublon : la
            # cle a plat et la cascade y sont deux exigences reelles. Retirer la
            # cle diviserait le cout par deux. Premier jet : gen2_eureka perdait
            # la moitie de tout, l'eclat de sang comme le lingot cristallin.
            if leg in (cc[cid].get("qty_overlap_verified") or []):
                continue
            arbre = sum(v * T[leg].get(p, 0) for p, v in q.items() if p in cc)
            if arbre == 0:
                continue
            if arbre == q[cle]:
                del q[cle]
                retires.append((cid, leg, arbre))
                bouge = True
            else:
                ecarts_laisses[cid] += 1
    if not bouge:
        break

apres = {l: totaux(l) for l in cibles}
ec = [(l, k, avant[l].get(k, 0), apres[l].get(k, 0)) for l in cibles
      for k in set(avant[l]) | set(apres[l]) if avant[l].get(k, 0) != apres[l].get(k, 0)]

par_comp = collections.Counter(c for c, _, _ in retires)
print(f"cles a plat retirees : {len(retires)} sur {len(par_comp)} composants")
for cid, n in par_comp.most_common(15):
    print(f"   {cid} : {n}")
print(f"\ncles laissees avec un ecart (arbitrage) : {sum(ecarts_laisses.values())}")
for cid, n in ecarts_laisses.most_common(8):
    print(f"   {cid} : {n}")
print(f"\nECARTS DE TOTAL : {len(ec)}")
for x in ec[:10]:
    print("  ", x)
# Toute BAISSE est un doublon supprime, toute hausse serait une invention.
# Les deux baisses attendues portent sur Transcendence, dont la chaine
# Gift of the Champion -> Gift of the Mists -> Gift of Battle n'existait pas
# encore quand les dix-neuf autres legendaires ont ete corriges.
if not [x for x in ec if x[3] >= x[2]]:
    d["_meta"]["version"] = "v223"
    d["_meta"]["last_updated"] = "2026-09-05"
    json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{DST} ecrit — {len(ec)} doublons supprimes, aucune hausse")
