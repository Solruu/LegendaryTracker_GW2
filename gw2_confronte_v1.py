#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Confronte les totaux actuels a ceux que donneraient les seules recettes.

Le depliage a atteint son point fixe : plus aucune arete ne peut etre posee
sans faire bouger un total etabli. Ce n'est pas une panne, c'est la limite de
la regle. Le controle refuse toute HAUSSE d'un total existant, parce qu'une
hausse peut etre un double comptage. Mais elle peut aussi etre une correction :
si l'arbre etait incomplet, le completer DOIT faire monter le chiffre.

Exemple, `airship_part` sur Astralaria. La donnee compte 500, apportes par
`gift_of_the_itzel`. Les captures proposent en plus `gift_of_gliding 300`. Or
Gift of Insights demande les deux dons, et chacun coute ses propres pieces de
dirigeable : les 300 s'AJOUTENT. Le controle les refuse pourtant, faute de
pouvoir distinguer cette hausse-la d'un doublon.

Trancher demande de decider qui fait foi. Ce script ne decide pas : il chiffre
l'ecart, legendaire par legendaire, pour que la decision se prenne sur des
nombres.

DEUX LECTURES COMPAREES :

- ACTUELLE — ce que le tracker affiche aujourd'hui : cles a plat plus aretes
  deja posees.
- RECETTES — les aretes proposees par les captures sont toutes posees, et la
  cle a plat d'un composant est ignoree des lors qu'une arete le rattache a
  l'arbre. Ce que la lecture de bas en haut donnerait.

LE RESULTAT EST SANS APPEL, ET CE N'EST PAS CELUI QU'ON ESPERAIT. Sur 3305
ecarts, 3096 sont des BAISSES : ignorer la cle a plat fait perdre le cout, et
la chaine ne le remplace pas. La lecture de bas en haut n'est donc pas encore
tenable — non par manque de cinq pages, mais parce que la plupart des
legendaires n'ont pas leur propre recette reliee a leurs composants. 56
legendaires sur 84 ont une boite Recipe capturee, et meme la, les aretes vers
leurs dons ne sont pas toutes posees.

Ce chiffre est la bonne mesure de ce qui reste a faire. Le renversement de
primaute se fera quand il approchera de zero, pas avant.

Un ecart nul veut dire que les deux sources concordent. Un ecart positif veut
dire que les recettes exigent plus que la table recopiee — soit la table etait
incomplete, soit une arete compte deux fois. Un ecart negatif veut dire que la
chaine ne descend pas assez loin : il reste un trou.

CE QUE LE CHIFFRE NE DIT PAS. La chaine est encore incomplete a cinq endroits
(section 0 de PAGES_A_CAPTURER) et elle ignore le taux d'echec du trefle
mystique, qui multiplie par 3,23 tout ce qui passe par lui. Un ecart negatif
sur l'ectoplasme ou l'obsidienne d'une arme gen1 s'explique donc par le trefle
avant de s'expliquer par autre chose.
"""
import collections
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
ARETES = Path("/tmp/edges2.json")
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))
TAUX = 3.2258

d = json.load(open(SRC, encoding="utf-8"))
cc = d["craft_components"]
groupes = d.get("alt_groups") or {}
E = {tuple(k.split("|")): tuple(v) for k, v in json.load(open(ARETES)).items()}
proposees = collections.defaultdict(dict)
for (p, e), (q, _org) in E.items():
    if p in cc and e in cc and p != e:
        proposees[e][p] = q


def nom(cid):
    n = (cc.get(cid) or {}).get("name")
    return (n.get("en") or n.get("fr")) if isinstance(n, dict) else (n or cid)


def totaux(leg, recettes=False):
    """recettes=False : l'etat actuel. True : toutes les aretes proposees posees,
    et la cle a plat ignoree pour tout composant rattache a l'arbre."""
    qty = {}
    for cid, c in cc.items():
        q = dict(c.get("qty") or {})
        if recettes:
            for p, v in proposees.get(cid, {}).items():
                q[p] = v
        qty[cid] = q
    t = {}
    for cid, q in qty.items():
        for suf, mm in SUF:
            mult = mm if (suf not in ("__per_piece", "__full_set") or leg in ARMOR) else 0
            v = q.get(leg + suf)
            if isinstance(v, int) and mult:
                t[cid] = t.get(cid, 0) + v * mult
    for g in groupes.values():
        if leg in (g.get("targets") or []):
            t[g["default"]] = t.get(g["default"], 0) + g["qty"]
    exp = {}
    for _ in range(12):
        add = {}
        for cid, q in qty.items():
            for k, v in q.items():
                if isinstance(v, int) and k in cc and t.get(k, 0) > 0:
                    add[cid] = add.get(cid, 0) + v * t[k]
        for g in groupes.values():
            n = sum(t.get(x, 0) for x in (g.get("targets") or []) if x in cc)
            if n:
                add[g["default"]] = add.get(g["default"], 0) + g["qty"] * n
        bouge = False
        for cid, v in add.items():
            if exp.get(cid, 0) != v:
                t[cid] = t.get(cid, 0) - exp.get(cid, 0) + v
                exp[cid] = v
                bouge = True
        if not bouge:
            break
    if not recettes:
        return t
    # La cle a plat d'un composant ne cede la place a la chaine que la ou la
    # chaine le rattache VRAIMENT a ce legendaire. Retirer la cle des qu'une
    # arete existe ailleurs faisait tomber a zero des couts que rien ne
    # remplacait — `research_note` est relie a seer_runestone, ce qui ne lui
    # rend pas ses 5 000 sur Selachimorpha.
    return {cid: (exp[cid] if exp.get(cid, 0) > 0 else v) for cid, v in t.items()}


cibles = sorted({k.split("__")[0] for c in cc.values() for k in (c.get("qty") or {})
                 if k.split("__")[0] not in cc})
lignes, par_leg = [], {}
for leg in cibles:
    a, b = totaux(leg), totaux(leg, recettes=True)
    ecarts = []
    for cid in set(a) | set(b):
        va, vb = a.get(cid, 0), b.get(cid, 0)
        if va != vb:
            ecarts.append((abs(vb - va), cid, va, vb))
    ecarts.sort(key=lambda x: -x[0])
    par_leg[leg] = (len(ecarts), sum(x[0] for x in ecarts))
    lignes.extend((leg,) + x for x in ecarts)

lignes.sort(key=lambda x: -x[1])
out = [f"# Confrontation — cles a plat contre recettes\n",
       f"Source : `{SRC.name}`. {len(lignes)} ecarts sur "
       f"{len([l for l, v in par_leg.items() if v[0]])} legendaires.\n",
       "Colonne **actuelle** : ce que le tracker affiche. Colonne **recettes** : ce",
       "que la lecture de bas en haut donnerait, toutes les aretes des captures",
       "posees et les cles a plat ignorees des qu'une arete rattache le composant.\n",
       "Un ecart **positif** : les recettes exigent plus que la table recopiee.",
       "Un ecart **negatif** : la chaine ne descend pas assez loin, il reste un trou.",
       "Le taux d'echec du trefle (x3,23) n'est PAS applique ici — un negatif sur",
       "l'ectoplasme ou l'obsidienne s'explique d'abord par lui.\n",
       "\n## Par legendaire, du plus expose au moins expose\n",
       "| legendaire | composants en ecart | somme des ecarts |", "|---|---:|---:|"]
for leg, (n, s) in sorted(par_leg.items(), key=lambda x: -x[1][1]):
    if n:
        out.append(f"| `{leg}` | {n} | {s} |")

out.append("\n## Les 80 plus gros ecarts\n")
out.append("| legendaire | composant | actuelle | recettes | ecart |")
out.append("|---|---|---:|---:|---:|")
for leg, enj, cid, va, vb in lignes[:80]:
    out.append(f"| `{leg}` | `{cid}` — {nom(cid)} | {va} | {vb} | {vb - va:+} |")

Path(HERE / "CONFRONTATION.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"{len(lignes)} ecarts sur {len([l for l, v in par_leg.items() if v[0]])} legendaires")
print(f"  hausses : {sum(1 for x in lignes if x[4] > x[3])} | "
      f"baisses : {sum(1 for x in lignes if x[4] < x[3])}")
print("CONFRONTATION.md ecrit")
