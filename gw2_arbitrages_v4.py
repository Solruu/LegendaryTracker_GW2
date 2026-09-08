#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Liste les aretes que le depliage refuse de poser, triees par enjeu chiffre.

`gw2_deplie_wiki_v8` pose une arete quand elle reproduit exactement ce que la
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

- ALEA DU TREFLE MYSTIQUE — pas un desaccord, une lecture differente de la
  meme chose. Voir plus bas.

L'enjeu chiffre est |ce que la donnee dit - ce que l'arete donnerait|, en
valeur absolue. Il classe, il ne juge pas : un ecart de 1 sur un Bloodstone
Shard peut compter plus qu'un ecart de 18 000 sur une monnaie de carte.

L'ALEA DU TREFLE, ET POURQUOI CE N'EST PAS UNE ERREUR.

Une arme gen1 demande 250 ecus mystiques a plat, et la chaine de recettes n'en
compte que 77. Le rapport vaut 3,25. Aucune des deux valeurs n'est fausse :
elles repondent a deux questions.

77, c'est le nombre de trefles mystiques. 250, c'est le nombre d'ecus qu'il
faut y consacrer, parce que la recette du trefle ECHOUE. La donnee le dit
elle-meme, dans la note de mystic_clover : « aucune recette de Clover n'est
garantie, toutes tournent autour de ~31 % de reussite ». Et 1 / 0,31 = 3,23,
soit exactement le rapport observe.

LE WIKI L'ECRIT NOIR SUR BLANC, et je ne l'avais pas vu. La table « Full
material list » de Klobjarne Geirr dit : « 38 Mystic Clovers — Forged from a
total of about 123 Mystic Coins, 123 Globs of Ectoplasm, 123 Obsidian Shards,
and 74 Spirit Shards ». 123 / 38 = 3,24. Le taux n'est donc pas une inference
de ma part a partir d'un pourcentage note en marge : c'est un chiffre que le
wiki publie, et que nos totaux reproduisent — le tracker annonce lui aussi 38
trefles et 123 ecus pour Klobjarne Geirr.

Consequence a retenir : les tables de materiaux du wiki INCLUENT deja le cout
des rates. Un total a plat qui vient d'une de ces tables ne doit donc pas etre
remultiplie.

Poser l'arete remplacerait donc un cout espere honnete par un plancher
theorique que personne n'atteint. Ces cas sortent des arbitrages.

Mais le multiplicateur brut ne suffisait pas a les separer. Un composant peut
arriver au legendaire par le trefle ET par ailleurs : l'obsidienne de The
Ascension vaut 309 a plat, dont 77 par les trefles — a multiplier — et le reste
non. Comparer 309 a 77 donnait x4,01 et laissait croire a une anomalie, alors
que la seule question est : que reste-t-il UNE FOIS le trefle paye ?

On separe donc la contribution qui passe par mystic_clover du reste :

    attendu = part_trefle x 3,2258 + part_directe
    reste   = cle_a_plat - attendu

Un reste voisin de zero, et le cas est clos : la donnee et le wiki disent la
meme chose. Un reste franc, et c'est un cout reel que l'arbre ne modelise pas
encore — la, il y a quelque chose a chercher.
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
    sys.exit("lance d'abord gw2_edges_wiki_v5.py, qui produit /tmp/edges2.json")

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
       "vendeur": "COUT VENDEUR", "alea": "ALEA DU TREFLE MYSTIQUE"}

# 1 / 0,31 : la recette du trefle reussit environ une fois sur trois, chiffre
# que porte la note de mystic_clover dans la donnee elle-meme.
TAUX = 3.2258
clos = []
reste = {}
_anc = {}


def ancetres(cid, vus=None):
    """Tous les composants situes au-dessus de cid, aretes posees ou proposees."""
    if cid in _anc:
        return _anc[cid]
    vus = vus if vus is not None else set()
    out = set()
    for p in list(par_enfant.get(cid, {})) + [
            k.split("__")[0] for k in ((cc.get(cid) or {}).get("qty") or {})]:
        if p in vus or p not in cc:
            continue
        vus.add(p)
        out.add(p)
        out |= ancetres(p, vus)
    if not vus:
        _anc[cid] = out
    return out
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
            # Part du chemin qui passe par le trefle : elle seule subit le taux
            # d'echec. Le reste arrive directement et se compte tel quel.
            par_trefle = neuves.get("mystic_clover", 0) * T[leg].get("mystic_clover", 0)
            direct = apport[leg] - par_trefle
            attendu = par_trefle * TAUX + direct
            if par_trefle > 0 and abs(plat - attendu) <= max(5, 0.05 * plat):
                clos.append((enfant, leg, plat, round(attendu)))
                continue
            fam, dit = "compte", plat
            if par_trefle > 0:
                fam = "alea"
                reste[(enfant, leg)] = round(plat - attendu)
        elif cascade[leg] > 0:
            fam, dit = "cascade", cascade[leg]
        elif any(origine.get((enfant, p)) != "recette" for p in neuves):
            fam, dit = "vendeur", 0
        else:
            continue
        lignes.append((abs(apport[leg] - dit), fam, enfant, leg, dit, apport[leg],
                       sorted(neuves), {p: origine.get((enfant, p)) for p in neuves}))

lignes.sort(key=lambda x: -x[0])
if reste:
    for i, x in enumerate(lignes):
        if x[1] == "alea":
            lignes[i] = (abs(reste.get((x[2], x[3]), 0)),) + x[1:]
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

for f in ("compte", "cascade", "vendeur", "alea"):
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
    elif f == "vendeur":
        out.append("La table vendeur aplatit des options qui s'excluent. Se tranche en")
        out.append("regardant si le vendeur propose un choix ou une liste.\n")
    else:
        out.append("Le trefle explique une partie de l'ecart, pas tout. La colonne donne")
        out.append("ce qui RESTE une fois la part passant par mystic_clover multipliee")
        out.append("par 3,23 : un cout reel que l'arbre ne modelise pas encore, ou un")
        out.append("chiffre a plat trop genereux. Les cas ou le trefle explique tout")
        out.append("(a 5 % pres) sont clos et listes en fin de fichier.\n")
    # Le detail est plafonne : une famille a 811 lignes ne se lit pas, et la
    # somme par composant plus haut suffit a decider par ou commencer. Le
    # calcul, lui, porte sur la totalite.
    CAP = 60
    if len(sous) > CAP:
        out.append(f"Les {CAP} plus gros ecarts sur {len(sous)}. Le reste se")
        out.append("recalcule en relancant le script.\n")
    out.append("| composant | legendaire | donnee | wiki | "
               + ("reste apres trefle" if f == "alea" else "ecart")
               + " | parents proposes |")
    out.append("|---|---|---:|---:|---:|---|")
    for enj, _, e, leg, dit, ap, ps, orgs in sous[:CAP]:
        # La liste complete des parents est illisible des qu'un composant en a
        # treize (glob_of_ectoplasm). On en montre trois, le compte fait le
        # reste, et le detail se relit dans /tmp/edges2.json.
        pp = ", ".join(f"{p} ({orgs[p]})" for p in ps[:3])
        if len(ps) > 3:
            pp += f" +{len(ps) - 3} autres"
        if f == "alea":
            out.append(f"| `{e}` — {nom(e)} | `{leg}` | {dit} | {ap} | "
                       f"{reste.get((e, leg), 0):+} | {pp} |")
        else:
            out.append(f"| `{e}` — {nom(e)} | `{leg}` | {dit} | {ap} | {enj} | {pp} |")

if clos:
    out.append(f"\n## CLOS PAR L'ALEA DU TREFLE — {len(clos)} cas\n")
    out.append("La cle a plat et la chaine disent la meme chose des lors qu'on paie le")
    out.append("taux d'echec du trefle. Rien a arbitrer, rien a changer : c'est la")
    out.append("verification que la donnee et le wiki concordent.\n")
    out.append("| composant | legendaire | donnee | attendu |")
    out.append("|---|---|---:|---:|")
    for e, leg, plat, att in sorted(clos, key=lambda x: -x[2]):
        out.append(f"| `{e}` — {nom(e)} | `{leg}` | {plat} | {att} |")

Path(HERE / "ARBITRAGES.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"{len(lignes)} desaccords sur {len(composants)} composants")
for f, n in par_fam.most_common():
    print(f"   {n:4}  {FAM[f]}")
print("ARBITRAGES.md ecrit")
