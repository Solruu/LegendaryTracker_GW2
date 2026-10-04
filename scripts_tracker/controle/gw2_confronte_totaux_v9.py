#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Confronte le TOTAL affiche par legendaire au total ecrit dans sa table.

Les deux confrontations existantes comparent des ARETES : `gw2_confronte_v1`
oppose l'etat actuel a une lecture de bas en haut, `gw2_confronte_tables_v4`
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
from urllib.parse import unquote as _unquote
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]  # racine du depot
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from parseurs import gw2_parse_material_list_v4 as P  # noqa: E402

SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
d = json.load(open(SRC, encoding="utf-8"))
cc = d["craft_components"]
L = d["legendaries"]
groupes = d.get("alt_groups") or {}
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))


def norm(s):
    # v4 : le champ `wiki` est percent-encode (« Aurene%27s_Claw ») tandis que
    # le nom de fichier de la capture ne l'est pas (« aurenes_claw.html »).
    # Sans decodage, « %27 » laissait un « 27 » dans la forme normalisee et
    # DOUZE des seize tables gen3 ne se rattachaient a aucun legendaire : elles
    # n'etaient pas confrontees du tout. Le rapport n'annoncait quatre ecarts
    # sur les gen3 que parce que quatre entrees portaient l'autre convention.
    return "".join(ch for ch in _unquote(str(s)).lower() if ch.isalnum())


def _remonte_vers_ferme(cid, cc, fermes, T, profondeur=6, cites=frozenset()):
    """Les branches fermees de la table qui expliquent un excedent sur `cid`.

    v7 : la recherche ne regardait qu'UN cran — les parents directs de `cid`.
    Elle ratait donc tout ce qui pend a deux crans ou plus d'une branche que la
    table cite sans l'ouvrir.

    Cas qui l'a revele, le 20/09 : les seize gen3 sortent a 300 reactifs
    thermocatalytiques contre 250 au tableau. Les 50 d'ecart sont justes, ils
    viennent de la piece d'arme du Poeme — 50 par lame ou par fut, leur boite
    Recipe le dit. Mais le reactif pend sous la LAME, la lame sous le POEME, et
    seul le Poeme figure dans les branches fermees du tableau. Seize lignes
    tombaient donc en « rien ne l'explique » alors qu'une remontee de deux
    crans repondait.

    On remonte de parent en parent, borne pour qu'un cycle ne boucle pas, et on
    ne retient qu'un ancetre ferme REELLEMENT demande par la cible (T > 0) :
    une branche que le legendaire ne prend pas n'explique rien.
    """
    trouves, vus, pile = set(), {cid}, [(cid, 0)]
    while pile:
        courant, d = pile.pop()
        if d >= profondeur:
            continue
        for parent in (cc.get(courant, {}).get("qty") or {}):
            base = parent.split("__")[0]
            if base in fermes and T.get(base, 0):
                trouves.add(base)
                continue
            # v9 : BRANCHE OMISE. La table ouvre le Poeme des gen3 (10 Tales,
            # 10 Badges) mais tait la piece d'arme, 50 reactifs et ses planches.
            # Le Poeme n'est donc pas ferme, et pourtant le surplus est juste :
            # la recette capturee du Poeme cite la piece. On l'admet SEULEMENT si
            # l'arete parent <- courant est proposee par une capture : sans
            # cette condition, une arete inventee (le cube sous le Gift of
            # Research, C3) redeviendrait invisible.
            if (base in cites and courant not in cites and T.get(base, 0)
                    and f"{base}|{courant}" in SOURCEES):
                trouves.add(f"{base} (omis : {courant})")
                continue
            if base in cc and base not in vus:
                vus.add(base)
                pile.append((base, d + 1))
    return trouves


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


from moteur.gw2_moteur_v3 import Modele  # noqa: E402

# Les options d'un choix que le calcul ne retient pas : la table les ecrit
# toutes, le tracker n'en compte qu'une.
# v9 : PAR CIBLE. Un choix ne vaut que sous ses `targets` — principe deja tenu
# par le moteur. La v8 ecartait l'option partout : `opal_orb`, option non
# retenue des gemmes infusees (cible `gift_of_infused_gems`), etait aussi
# coupee sous le Gift of Color du Bifrost, ou elle est une exigence fixe ; ses
# 500 poussieres incandescentes sortaient alors en excedent nu.
non_defaut = collections.defaultdict(set)
for g in (d.get("alt_groups") or {}).values():
    for o in (g.get("options") or []):
        if o != g.get("default"):
            non_defaut[o].update(g.get("targets") or [])

# v9 : aretes que les captures proposent (recette, vendeur, table), ecrites par
# parseurs/gw2_edges_wiki. Sert a reconnaitre une branche que la table OMET.
_E = Path("/tmp/edges2.json")
SOURCEES = set(json.load(open(_E))) if _E.exists() else set()

# La cascade n'est plus ecrite ici : un seul moteur pour tous les outils.
_M = Modele.depuis(d, SRC)


def totaux(leg):
    return _M.totaux(leg)


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
    tetes = {t for t, _e, _q in brut} - {e for _t, e, _q in brut}
    # La table range parfois les options a cote de leur cible plutot que
    # dessous : Endless Summer ecrit les quatre orbes sous Gift of Rays, a cote
    # du Gift of Infused Gems qu'elles composent. Le parent d'une cible vaut
    # donc la cible.
    for _t, _e, _q in brut:
        cid = to_id(_e)
        if cid in non_defaut:
            cibles = non_defaut[cid]
            if to_id(_t) in cibles or any(t2 == _t and to_id(e2) in cibles for t2, e2, _q2 in brut):
                pile.append(_e)
        cid = to_id(_t)
        if _t in tetes and cid in non_defaut and leg in non_defaut[cid]:
            pile.append(_t)
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
    # v9 : une branche n'est OUVERTE que si la table chiffre au moins un de ses
    # enfants. Le precurseur des gen2 (Endeavor sous Eureka) est une tete de la
    # table : la v8 le croyait ouvert parce que sa note cite, sans nombre, les
    # recettes et le Shard of Endeavor. Il etait donc hors des « fermes » (tete,
    # jamais enfant) — et les 100 tessons, 100 tributs, 100 curios du
    # precurseur tombaient en « excedent nu » sur les douze gen2, alors que la
    # page ecrit « Endeavor — Requires 500 Weaponsmith » sans rien chiffrer.
    ouverts = {t for t, _e, q in brut if q is not None}
    # Une table d'ARMURE est ecrite POUR UNE PIECE : le Gift of Prosperity y
    # coute 15 trefles, et il en faut un par piece. Le tracker, lui, totalise
    # le set de six. Sans cette echelle, les cinq postes de l'Envoy parfait
    # sortaient en excedent a exactement six fois le nombre ecrit — un artefact
    # d'unite, pas un double compte. ARMOR et SUF existaient deja pour dire
    # cela et n'etaient branches nulle part.
    echelle = dict(SUF)["__per_piece"] if leg in ARMOR else 1
    for _t, e, q in brut:
        if q is not None:
            ecrit[e] += q * echelle
    T = totaux(leg)
    # Les branches que la table cite sans les ouvrir : leurs enfants a nous
    # expliquent legitimement un excedent.
    fermes = {to_id(n) for t, e, _q in brut for n in (t, e) if n not in ouverts}
    cites = {to_id(n) for t, e, _q in brut for n in (t, e)} - {None}
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
            via = sorted(_remonte_vers_ferme(cid, cc, fermes, T, cites=cites))
            # v5 : un chevauchement DECLARE et VERIFIE n'est pas un excedent
            # nu. `qty_overlap_verified` dit, legendaire par legendaire, que
            # l'exigence directe et la chaine sont toutes deux reelles — c'est
            # la structure posee pour Vision le 22/08. Seize gen3 le portaient
            # sur le trefle mystique et remplissaient quand meme la colonne
            # « rien ne l'explique », ce qui noyait les vrais cas.
            if not via and leg in (cc[cid].get("qty_overlap_verified") or []):
                via = ["qty_overlap_verified"]
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
       "  que la table cite sans l'ouvrir, ou d'un chevauchement declare en",
       "  `qty_overlap_verified`.",
       f"- **{len(nu)} excedents nus** — rien dans la donnee ne les explique : soit",
       "  un double comptage, soit une branche legitime qu'il faut nommer.\n",
       "\n## Trous — le total affiche est inferieur a celui de la table\n",
       "| legendaire | composant | affiche | table | manque |", "|---|---|---:|---:|---:|"]
for e, leg, cid, a, b in trous:
    out.append(f"| `{leg}` | `{cid}` — {nom(cid)} | {a} | {b} | -{e} |")

out.append("\n## Excedents nus — a expliquer ou a corriger\n")
out.append("| legendaire | composant | affiche | table | excedent |")
out.append("|---|---|---:|---:|---:|")
for e, leg, cid, a, b, _v in nu:
    out.append(f"| `{leg}` | `{cid}` — {nom(cid)} | {a} | {b} | +{e} |")

out.append("\n## Excedents expliques par une branche fermee de la table\n")
out.append("| legendaire | composant | affiche | table | par |")
out.append("|---|---|---:|---:|---|")
for e, leg, cid, a, b, via in explique:
    out.append(f"| `{leg}` | `{cid}` | {a} | {b} | {', '.join(f'`{x}`' for x in via)} |")

Path(HERE / "CONFRONTATION_TOTAUX.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"accords : {len(accords)} | trous : {len(trous)} | "
      f"excedents expliques : {len(explique)} | excedents nus : {len(nu)}")
print(f"tables sans legendaire rattache : {len(sans_leg)}")
print("CONFRONTATION_TOTAUX.md ecrit")
