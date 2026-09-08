#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Confronte le TOTAL affiche par legendaire au total ecrit dans sa table.

Les deux confrontations existantes comparent des ARETES : `gw2_confronte_v1`
oppose l'etat actuel a une lecture de bas en haut, `gw2_confronte_tables_v2`
oppose chaque arete de `qty` a la ligne correspondante du wiki. Aucune ne
regarde le nombre que le joueur lit en haut de l'ecran.

Or c'est ce nombre-la qui decide des 84 refus du deplieur. Le deplieur refuse
de poser une arete quand la cascade apporte deja quelque chose au meme
legendaire : il ne sait pas distinguer un doublon d'un complement. La table du
wiki, elle, le dit — ses quantites sont des TOTAUX pour le legendaire, a
n'importe quelle profondeur.

CE QUE LA TABLE PEUT ET NE PEUT PAS TRANCHER. Elle developpe l'arbre jusqu'ou
elle veut et s'arrete. The Binding of Ipos ecrit 2 000 lingots de mithril sous
le tesson, et n'ouvre pas le Mystic Curio, qui en coute 1 500 de plus. Le total
de la table est donc un PLANCHER, pas une egalite :

    total affiche < total de la table  ->  trou certain, la chaine perd un cout
    total affiche = total de la table  ->  accord
    total affiche > total de la table  ->  a expliquer : soit un doublon, soit
                                           une branche que la table n'ouvre pas

Le troisieme cas se departage en regardant si l'ecart s'explique par une
branche fermee de la table. Ce script ne devine pas : il chiffre les trois cas
et nomme, pour le troisieme, les composants de la donnee dont le parent est
cite par la table sans etre developpe.
"""
import collections
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import gw2_parse_material_list_v2 as P  # noqa: E402

SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
d = json.load(open(SRC, encoding="utf-8"))
cc = d["craft_components"]
L = d["legendaries"]
groupes = d.get("alt_groups") or {}
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))


def norm(s):
    return "".join(ch for ch in str(s).lower() if ch.isalnum())


def nom(cid):
    n = (cc.get(cid) or {}).get("name")
    return (n.get("en") or n.get("fr")) if isinstance(n, dict) else (n or cid)


# --- resolution des noms wiki vers les identifiants de la base ----------------
by = collections.defaultdict(set)
for cid in cc:
    for v in (nom(cid), cid.replace("_", " ")):
        by[norm(v)].add(cid)
        by[norm(v).replace("s", "")].add(cid)


def to_id(t):
    base = norm(str(t).replace("_", " ").replace("%27", "'"))
    for k in (base, base.rstrip("s"), base + "s", base.replace("s", "")):
        s = by.get(k)
        if s and len(s) == 1:
            return next(iter(s))
    return None


# page du wiki -> legendaire
page_leg = {}
for leg, v in L.items():
    w = v.get("wiki")
    if w:
        page_leg[norm(w)] = leg


def totaux(leg):
    """Ce que le tracker affiche : cles a plat plus cascade."""
    t, exp = {}, {}
    for cid, c in cc.items():
        q = c.get("qty") or {}
        for suf, mm in SUF:
            mult = mm if (suf not in ("__per_piece", "__full_set") or leg in ARMOR) else 0
            v = q.get(leg + suf)
            if isinstance(v, int) and mult:
                t[cid] = t.get(cid, 0) + v * mult
    for g in groupes.values():
        if leg in (g.get("targets") or []):
            t[g["default"]] = t.get(g["default"], 0) + g["qty"]
    for _ in range(12):
        add = {}
        for cid, c in cc.items():
            for k, v in (c.get("qty") or {}).items():
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
    return t


# Les options d'un `alt_groups` que le calcul ne retient pas : un choix, pas
# une somme. Le tracker ne compte que le `default`, la table les ecrit toutes.
non_defaut = {o for g in groupes.values()
              for o in (g.get("options") or []) if o != g.get("default")}

trous, accords, excedents, sans_leg = [], [], [], []
for page in sorted(P.WIKI.glob("*.html")):
    if P._debut(page.read_text(encoding="utf-8", errors="ignore")) < 0:
        continue
    if page.stem in P.DOUBLES:
        continue
    leg = page_leg.get(norm(page.stem))
    if not leg:
        sans_leg.append(page.stem)
        continue
    brut = P.aretes(page)
    # UNE TABLE ECRIT LES DEUX VOIES D'UN CHOIX. Les armes gen2 y portent
    # Gift of Maguuma Mastery ET Gift of Desert Mastery, Endless Summer ses six
    # orbes : le joueur n'en fait qu'un. Additionner les lignes des deux voies
    # ferait du choix une exigence, et la table annoncerait 500 lingots
    # cristallins la ou l'affichage en compte 250 — un faux trou.
    # On coupe donc, dans la table, la branche de toute option non retenue par
    # son `alt_groups`, et tout ce qui pend dessous.
    enfants = collections.defaultdict(list)
    for t, e, _q in brut:
        enfants[t].append(e)
    coupes, pile = set(), []
    # L'option ecartee est souvent une TETE de la table — Gift of Desert Mastery
    # ouvre la colonne 1 et n'apparait jamais comme enfant. Amorcer la coupe sur
    # les seuls enfants ne coupait donc rien.
    for _t, _e, _q in brut:
        for n in (_t, _e):
            cid = to_id(n)
            if cid and cid in non_defaut:
                pile.append(n)
    while pile:
        n = pile.pop()
        if n in coupes:
            continue
        coupes.add(n)
        pile.extend(enfants.get(n, ()))
    brut = [(t, e, q) for t, e, q in brut if e not in coupes and t not in coupes]
    # Total ecrit par la table : la somme des lignes ou l'item est enfant. Une
    # ligne sans nombre vaut 1 par convention du wiki, mais on ne l'additionne
    # pas — elle ne dit rien de plus que « il en faut ».
    ecrit = collections.defaultdict(int)
    ouverts = {t for t, _e, _q in brut}
    for _t, e, q in brut:
        if q is not None:
            ecrit[e] += q
    T = totaux(leg)
    # Les branches que la table cite sans les ouvrir : leurs enfants a nous
    # expliquent legitimement un excedent.
    fermes = {to_id(e) for _t, e, _q in brut if e not in ouverts}
    fermes.discard(None)
    for item, tot_table in ecrit.items():
        cid = to_id(item)
        if not cid:
            continue
        aff = T.get(cid, 0)
        if aff == tot_table:
            accords.append((leg, cid))
        elif aff < tot_table:
            trous.append((tot_table - aff, leg, cid, aff, tot_table))
        else:
            # l'excedent vient-il d'un parent que la table n'ouvre pas ?
            via = sorted(p for p in (cc[cid].get("qty") or {})
                         if p in fermes and T.get(p, 0))
            excedents.append((aff - tot_table, leg, cid, aff, tot_table, via))

trous.sort(key=lambda x: -x[0])
excedents.sort(key=lambda x: -x[0])
explique = [x for x in excedents if x[5]]
nu = [x for x in excedents if not x[5]]

out = ["# Confrontation des TOTAUX — ce qui s'affiche contre ce qu'ecrit la table\n",
       f"Source : `{SRC.name}`, {len(accords) + len(trous) + len(excedents)} totaux "
       f"compares sur les tables rattachees a un legendaire.\n",
       "Les quantites d'une table « Full material list » sont des totaux pour le",
       "legendaire. Mais la table s'arrete ou elle veut : elle ecrit 2 000 lingots",
       "sous le tesson d'Ipos et n'ouvre pas le Mystic Curio, qui en coute 1 500 de",
       "plus. **Son total est donc un plancher, pas une egalite.**\n",
       f"- **{len(accords)} accords** — le nombre affiche est celui de la table.",
       f"- **{len(trous)} trous** — l'affichage est SOUS le plancher. Certains.",
       f"- **{len(explique)} excedents expliques** — le surplus vient d'une branche",
       "  que la table cite sans l'ouvrir.",
       f"- **{len(nu)} excedents nus** — rien dans la donnee ne les explique : soit",
       "  un double comptage, soit une branche legitime qu'il faut nommer.\n",
       "\n## Trous — le total affiche est inferieur a celui de la table\n",
       "| legendaire | composant | affiche | table | manque |", "|---|---|---:|---:|---:|"]
for e, leg, cid, a, b in trous[:60]:
    out.append(f"| `{leg}` | `{cid}` — {nom(cid)} | {a} | {b} | -{e} |")

out.append("\n## Excedents nus — a expliquer ou a corriger\n")
out.append("| legendaire | composant | affiche | table | excedent |")
out.append("|---|---|---:|---:|---:|")
for e, leg, cid, a, b, _v in nu[:60]:
    out.append(f"| `{leg}` | `{cid}` — {nom(cid)} | {a} | {b} | +{e} |")

out.append("\n## Excedents expliques par une branche fermee de la table\n")
out.append("| legendaire | composant | affiche | table | par |")
out.append("|---|---|---:|---:|---|")
for e, leg, cid, a, b, via in explique[:40]:
    out.append(f"| `{leg}` | `{cid}` | {a} | {b} | {', '.join(f'`{x}`' for x in via)} |")

Path(HERE / "CONFRONTATION_TOTAUX.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"accords : {len(accords)} | trous : {len(trous)} | "
      f"excedents expliques : {len(explique)} | excedents nus : {len(nu)}")
print(f"tables sans legendaire rattache : {len(sans_leg)}")
print("CONFRONTATION_TOTAUX.md ecrit")
