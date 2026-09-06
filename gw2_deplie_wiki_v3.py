#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pose une arete et retire la cle a plat qu'elle remplace, dans le meme geste.

Deux garde-fous se bloquaient l'un l'autre. L'integration refuse de poser une
arete si l'enfant est deja compte a plat sur les legendaires que le parent
atteint — sinon la depense compterait double. Le depliage, lui, refuse de
retirer une cle a plat tant qu'aucune arete ne la remplace. Chacun a raison
separement, et ensemble ils ne font rien : `Mystic Tribute -> 77 Mystic Clover`
est lisible dans toutes les tables de colifichets, et le trefle gardait ses 73
couts en dur.

Le mouvement manquant est atomique. Pour une arete candidate, on calcule ce que
le total DEVIENDRAIT avec l'arete posee, legendaire par legendaire. Si pour
chaque legendaire concerne ce total egale exactement la cle a plat, alors
l'arete dit la meme chose que la cle : on pose l'une et on retire l'autre. Le
total ne bouge pas, mais il devient un produit au lieu d'un nombre en dur.

Un legendaire ou le compte ne tombe pas juste bloque l'arete entiere : ce
serait la mettre en place a moitie, et le prochain passage la lirait comme un
doublon. Les cas ecartes sont listes avec leur ecart.

Les chevauchements declares dans qty_overlap_verified sont ignores : la cle et
la cascade y sont deux exigences reelles.
"""
import collections
import json

SRC, DST = "gw2_sources_v227.json", "gw2_sources_v228.json"
ARETES = "/tmp/edges2.json"
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))

d = json.load(open(SRC), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]
E = {tuple(k.split("|")): v[0] for k, v in json.load(open(ARETES)).items()}


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

poses, refus = [], []
for tour in range(4):
    T = {l: totaux(l) for l in cibles}
    bouge = False
    for (parent, enfant), q in sorted(E.items()):
        if parent not in cc or enfant not in cc or parent == enfant:
            continue
        qe = cc[enfant].get("qty") or {}
        if parent in qe:
            continue
        declares = set(cc[enfant].get("qty_overlap_verified") or [])
        concernes = [k for k in qe if k.split("__")[0] not in cc
                     and k == k.split("__")[0]
                     and k not in declares
                     and T[k].get(parent, 0) > 0]
        if not concernes:
            continue
        # L'arete ne doit toucher QUE des legendaires ou l'enfant est deja
        # compte a plat. Sinon elle en ajoute ailleurs, et ce n'est plus un
        # echange a somme nulle mais un cout revele qu'il faudrait verifier un
        # par un. Premier jet : « amalgamated_gemstone -> crystalline_ingot »
        # faisait apparaitre 250 gemmes sur douze gen2 qui n'en portaient
        # aucune. Peut-etre juste, mais pas prouve ici.
        portee = {l for l in cibles if T[l].get(parent, 0) > 0}
        hors = portee - set(concernes) - declares
        if hors:
            refus.append((enfant, parent, q, [('hors portee', len(hors), sorted(hors)[:2])], len(concernes)))
            continue
        ecarts = []
        for leg in concernes:
            actuel = sum(v * T[leg].get(p, 0) for p, v in qe.items() if p in cc)
            if actuel + q * T[leg].get(parent, 0) != qe[leg]:
                ecarts.append((leg, qe[leg], actuel + q * T[leg].get(parent, 0)))
        if ecarts:
            refus.append((enfant, parent, q, ecarts[:2], len(concernes)))
            continue
        qe[parent] = q
        cc[enfant]["needed_for"] = sorted(set(cc[enfant].get("needed_for") or []) | {parent})
        for leg in concernes:
            del qe[leg]
        poses.append((enfant, parent, q, len(concernes)))
        bouge = True
    if not bouge:
        break

apres = {l: totaux(l) for l in cibles}
ec = [(l, k, avant[l].get(k, 0), apres[l].get(k, 0)) for l in cibles
      for k in set(avant[l]) | set(apres[l]) if avant[l].get(k, 0) != apres[l].get(k, 0)]
print(f"aretes posees en echange de cles a plat : {len(poses)}")
for e, p, q, n in poses:
    print(f"   {e} -> {p} = {q}, {n} cles retirees")
print(f"\nrefusees : {len(refus)}")
for e, p, q, ec2, n in refus[:12]:
    print(f"   {e} -> {p} = {q} ({n} cles) — ex {ec2}")
print(f"\nECARTS DE TOTAL : {len(ec)}")
for x in ec[:10]:
    print("  ", x)
if not ec:
    d["_meta"]["version"] = "v226"
    d["_meta"]["last_updated"] = "2026-09-06"
    json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{DST} ecrit — totaux strictement inchanges")
