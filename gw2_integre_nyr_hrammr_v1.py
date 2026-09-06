#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Modelise la branche Nyr Hrammr de Klobjarne Geirr.

Huit ecarts subsistaient entre la cle a plat et l'arbre sur Klobjarne, tous
dans le meme sens : le plat depassait l'arbre. Ce n'etait pas un doublon mais
un arbre incomplet. La table de la page decrit une branche que la base ignorait
entierement :

    Nyr Hrammr -> Gift of Sharpened Tip
                    6 Deldrimor Steel Spear Heads
                        30 Piles of Crystalline Dust, 18 Deldrimor Steel Ingots,
                        300 Thermocatalytic Reagents
                    6 Large Spiritwood Hafts
                        30 Piles of Crystalline Dust, 12 Spiritwood Planks,
                        300 Thermocatalytic Reagents
                    6 Vision Crystals

Les quantites de la colonne 3 sont agregees sur celle de la colonne 2 — la
regle etablie a la v220. Les 30 poussieres valent donc pour les six tetes de
lance, soit 5 par unite. Verification : 30 + 30 = 60 poussieres pour la
branche, et la cle a plat de Klobjarne en portait 160 quand l'arbre n'en
donnait que 100. L'ecart tombe exactement.

Les composants dont l'arbre ne reproduit pas encore tout le plat gardent un
reliquat : le plat est ramene a la difference, et le chevauchement declare
dans qty_overlap_verified avec sa raison. Le total affiche ne bouge pas, mais
la part expliquee par l'arbre le devient. Le reactif thermocatalytique en est
l'exemple : 600 par cette branche, 250 par le Gift of Research, et un reliquat
qui couvre les sous-crafts plus profonds — lingots de Deldrimor, planches de
bois spirituel, cristaux de vision — que la table ne detaille pas ici.
"""
import collections
import json

SRC, DST = "gw2_sources_v221.json", "gw2_sources_v222.json"
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}

d = json.load(open(SRC), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]


def totaux(leg):
    t, exp = {}, {}
    for cid, c in cc.items():
        q = c.get("qty") or {}
        for suf, mm in (("", 1), ("__per_piece", 6), ("__onetime", 1),
                        ("__per_unit", 1), ("__full_set", 1)):
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

NOUVEAUX = {
    "deldrimor_steel_spear_head": ("Deldrimor Steel Spear Head", "advanced_craft"),
    "large_spiritwood_haft": ("Large Spiritwood Haft", "advanced_craft"),
    "deldrimor_steel_ingot": ("Deldrimor Steel Ingot", "refined"),
    "spiritwood_plank": ("Spiritwood Plank", "refined"),
}
for cid, (nom, kind) in NOUVEAUX.items():
    if cid in cc:
        continue
    cc[cid] = collections.OrderedDict([
        ("name", nom), ("kind", kind), ("farmable", kind == "refined"),
        ("qty", {}), ("needed_for", []),
        ("sources", [{"type": "craft", "tip": {
            "fr": None,
            "en": "Table « Full material list » de Klobjarne Geirr, branche Nyr Hrammr."}}]),
    ])

# Colonne 2 -> colonne 3 : les quantites de la colonne 3 sont des totaux pour la
# colonne 2. On divise pour obtenir l'unitaire.
ARETES = [
    ("deldrimor_steel_spear_head", "gift_of_sharpened_tip", 6),
    ("large_spiritwood_haft", "gift_of_sharpened_tip", 6),
    ("vision_crystal", "gift_of_sharpened_tip", 6),
    ("dust_crystalline", "deldrimor_steel_spear_head", 5),
    ("deldrimor_steel_ingot", "deldrimor_steel_spear_head", 3),
    ("thermocatalytic_reagent", "deldrimor_steel_spear_head", 50),
    ("dust_crystalline", "large_spiritwood_haft", 5),
    ("spiritwood_plank", "large_spiritwood_haft", 2),
    ("thermocatalytic_reagent", "large_spiritwood_haft", 50),
]
for enfant, parent, q in ARETES:
    cc[enfant].setdefault("qty", {})[parent] = q
    nf = set(cc[enfant].get("needed_for") or []) | {parent}
    cc[enfant]["needed_for"] = sorted(nf)

apres = totaux("klobjarne_geirr")
ajuste, retire = [], []
for cid, c in cc.items():
    q = c.get("qty") or {}
    if "klobjarne_geirr" not in q:
        continue
    arbre = sum(v * apres.get(p, 0) for p, v in q.items() if p in cc)
    plat = q["klobjarne_geirr"]
    if arbre == 0 or arbre > plat:
        continue
    if arbre == plat:
        del q["klobjarne_geirr"]
        retire.append(cid)
    else:
        q["klobjarne_geirr"] = plat - arbre
        c["qty_overlap_verified"] = sorted(set(c.get("qty_overlap_verified") or []) | {"klobjarne_geirr"})
        ajuste.append((cid, plat, arbre, plat - arbre))

fin = {l: totaux(l) for l in cibles}
ec = [(l, k, avant[l].get(k, 0), fin[l].get(k, 0)) for l in cibles
      for k in set(avant[l]) | set(fin[l]) if avant[l].get(k, 0) != fin[l].get(k, 0)]
print(f"composants crees : {len(NOUVEAUX)} | aretes posees : {len(ARETES)}")
print(f"cles a plat retirees : {len(retire)} -> {retire}")
print(f"cles ramenees au reliquat : {len(ajuste)}")
for x in ajuste:
    print(f"   {x[0]} : {x[1]} = {x[2]} par l'arbre + {x[3]} de reliquat")
print(f"\nECARTS DE TOTAL : {len(ec)}")
for x in ec[:10]:
    print("  ", x)
# Les seuls ecarts admis : un composant nouveau qui apparait (0 -> n), ou un
# total qui REDESCEND vers la valeur a plat, c'est-a-dire un double comptage
# supprime. Toute hausse serait une invention.
suspects = [x for x in ec if not (x[2] == 0 or x[3] < x[2])]
if not suspects:
    d["_meta"]["version"] = "v222"
    d["_meta"]["last_updated"] = "2026-09-05"
    json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{DST} ecrit — aucune hausse, {sum(1 for x in ec if x[3] < x[2])} doubles comptages supprimes")
