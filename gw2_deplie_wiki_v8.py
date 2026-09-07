#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Deplie les couts a plat en aretes, composant par composant.

La v4 posait les aretes d'un composant d'un bloc, ce qui reglait le cas des
composants a plusieurs parents. Elle avait deux defauts, tous deux corriges ici.

1. Elle comparait la contribution des NOUVELLES aretes a la cle a plat seule,
   en ignorant ce que les aretes DEJA posees apportaient au meme legendaire.
   Quand la cascade contribuait deja, la comparaison etait fausse.

2. Elle traitait tout legendaire sans cle a plat comme un trou a remplir. Mais
   un legendaire peut compter un composant par la cascade sans porter aucune
   cle a plat : y ajouter un second chemin double la depense. `sapphire_orb`
   passait ainsi de 250 a 500 sur Endless Summer.

La condition juste se pose par paire (composant, legendaire), en distinguant ce
que la cascade apporte deja de ce que la cle a plat porte :

    total actuel = cle_a_plat + cascade_actuelle
    total apres  = cascade_actuelle + apport_nouvelles_aretes

- cle a plat presente -> il faut apport == cle_a_plat. La cle part, le total ne
  bouge pas : c'est un ECHANGE.
- pas de cle a plat, et cascade_actuelle == 0 -> le composant n'etait compte
  nulle part pour ce legendaire alors que la table du wiki dit qu'il devrait
  l'etre : c'est un REMPLISSAGE, autorise et affiche.
- pas de cle a plat, mais cascade_actuelle > 0 -> le composant est deja compte
  par un autre chemin. Poser l'arete doublerait. REFUS.

Un seul refus fait tomber tout le composant : on ne laisse pas la moitie de ses
aretes posees et l'autre moitie a plat, ce serait exactement le double comptage
qu'on cherche a eviter.

v6 : LE CONTROLE D'INVARIANCE DESCEND AU NIVEAU DU COMPOSANT.

La v5 posait tous les composants acceptables, puis verifiait l'invariance a la
fin. Une seule arete fautive faisait donc echouer la passe entiere, y compris
les vingt bonnes. Et la condition par paire ne voit que le composant qu'elle
examine : poser `gift_of_condensed_might` sous Strife Unending est valide de son
propre point de vue, mais fait remonter tous les dons de trophees sous lui,
alors que Strife Unending compte deja ces trophees a plat. Les ecailles passent
de 300 a 600 — un composant plus bas, invisible depuis celui qu'on teste.

Chaque composant est donc pose SEUL, les totaux sont recalcules, et il est
REPRIS si un total etabli a bouge ou baisse. Ce qui reste est ce qui tient.

Corrige au passage : un composant sans cle `qty` recevait ses aretes dans un
dictionnaire detache, jamais rattache a la donnee. Il etait redeplie a chaque
tour sans que rien ne soit ecrit — `fruits_of_the_shadow` apparaissait quatre
fois dans le rapport.

Deux gardes heritees, toujours necessaires :

- les chevauchements declares dans `qty_overlap_verified` sont ignores, la cle
  et la cascade y etant deux exigences reelles et non un doublon ;
- une arete qui rendrait le graphe cyclique est refusee. Les recettes de
  PROMOTION sont deja ecartees en amont par gw2_edges_wiki_v3, mais la garde
  reste : elle ne coute rien et rattraperait une autre conversion du meme genre.

Le controle final est souverain : recalcul de tous les totaux avant et apres.
Une baisse, ou une hausse la ou un total existait, interdit l'ecriture.
"""
import collections
import json

# Resolution au plus haut _vN plutot qu'un chemin fige : une version codee en
# dur devient introuvable des la passe suivante, ce qui s'est produit.
HERE = __import__("pathlib").Path(__file__).resolve().parent
SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
VER = f"v{int(SRC.stem.split('_v')[-1]) + 1}"
DST = HERE / f"gw2_sources_{VER}.json"
ARETES = "/tmp/edges2.json"
ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))

d = json.load(open(SRC), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]
E = {tuple(k.split("|")): tuple(v) for k, v in json.load(open(ARETES)).items()}
par_enfant = collections.defaultdict(dict)
origine = {}
for (p, e), (q, org) in E.items():
    if p in cc and e in cc and p != e:
        par_enfant[e][p] = q
        origine[(e, p)] = org


# NOTE. Un premier jet distinguait ici « composant farmable » et « composant
# achetable seulement », pour ne pas faire entrer un raccourci marchand dans
# l'arbre. La distinction est juste, mais les champs sur lesquels elle
# s'appuyait ne la portent pas : `farmable` vaut true sur
# concentrated_chromatic_sap et solution_unbound, dont l'unique source est un
# « extrait de la table de materiaux », et `free_repeatable` n'est renseigne
# quasiment nulle part. Batir une regle de cout dessus, c'etait trancher au
# jugé en croyant lire.

# Le tri se fait desormais en amont, dans gw2_edges_wiki_v4, sur ce que la page
# du wiki montre vraiment : si elle porte une boite Recipe, la recette dit ce
# qu'il FAUT et le vendeur n'est qu'un service — aucune arete. Sinon, l'achat
# est la seule voie documentee, donc c'est l'arete.


def cycle(enfant, parent):
    """Vrai si poser enfant -> parent rend le graphe cyclique.

    On remonte depuis le PARENT : si l'enfant est deja au-dessus de lui, la
    nouvelle arete referme la boucle. Remonter depuis l'enfant ne detecterait
    rien, l'arete n'existant pas encore de ce cote.
    """
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
    """Total de chaque composant pour un legendaire, cle a plat + cascade."""
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

echanges, remplissages, refus = [], [], []
for tour in range(4):
    T = {l: totaux(l) for l in cibles}
    bouge = False
    for enfant, parents in sorted(par_enfant.items()):
        # setdefault et non `.get(...) or {}` : un composant sans cle `qty`
        # recevait sinon ses aretes dans un dictionnaire detache de la donnee.
        q = cc[enfant].setdefault("qty", {})
        neuves = {p: v for p, v in parents.items() if p not in q}
        if not neuves:
            continue
        if any(cycle(enfant, p) for p in neuves):
            refus.append((enfant, "cycle", sorted(neuves)[:2]))
            continue
        declares = set(cc[enfant].get("qty_overlap_verified") or [])
        # ce que les aretes DEJA posees apportent, legendaire par legendaire
        cascade = {l: sum(v * T[l].get(p, 0) for p, v in q.items() if p in cc)
                   for l in cibles}
        apport = {l: sum(v * T[l].get(p, 0) for p, v in neuves.items()) for l in cibles}

        a_retirer, remplis, mauvais = [], [], []
        for leg in cibles:
            if apport[leg] == 0:
                continue
            plat = q.get(leg)
            if leg in declares or not isinstance(plat, int):
                plat = None
            if plat is not None:
                if apport[leg] != plat:
                    mauvais.append((leg, plat, apport[leg]))
                else:
                    a_retirer.append(leg)
            elif cascade[leg] == 0 and not any(
                    isinstance(q.get(leg + s), int) for s, _ in SUF if s):
                remplis.append((leg, apport[leg]))
            else:
                mauvais.append((leg, f"deja {cascade[leg]} par cascade", apport[leg]))
        if mauvais:
            refus.append((enfant, "compte", mauvais[:2]))
            continue
        # Essai reversible : on pose, on recalcule TOUT, on garde si et seulement
        # si aucun total etabli n'a bouge. La condition par paire ne voit pas les
        # composants situes plus bas dans l'arbre ; ce controle-ci les voit.
        avant_essai = dict(q)
        nf_avant = list(cc[enfant].get("needed_for") or [])
        for p, v in neuves.items():
            q[p] = v
        cc[enfant]["needed_for"] = sorted(set(nf_avant) | set(neuves))
        for leg in a_retirer:
            del q[leg]
        essai = {l: totaux(l) for l in cibles}
        casse = [(l, k, avant[l].get(k, 0), essai[l].get(k, 0)) for l in cibles
                 for k in set(avant[l]) | set(essai[l])
                 if avant[l].get(k, 0) != essai[l].get(k, 0)
                 and not (avant[l].get(k, 0) == 0 and essai[l].get(k, 0) > 0)]
        if casse:
            q.clear()
            q.update(avant_essai)
            cc[enfant]["needed_for"] = nf_avant
            refus.append((enfant, "casse un total ailleurs", casse[:2]))
            continue
        if a_retirer:
            echanges.append((enfant, sorted(neuves), a_retirer))
        if remplis:
            remplissages.append((enfant, remplis))
        bouge = True
    if not bouge:
        break

apres = {l: totaux(l) for l in cibles}
ec = [(l, k, avant[l].get(k, 0), apres[l].get(k, 0)) for l in cibles
      for k in set(avant[l]) | set(apres[l]) if avant[l].get(k, 0) != apres[l].get(k, 0)]
suspects = [x for x in ec if not (x[2] == 0 and x[3] > 0)]

print(f"ECHANGES (cle a plat -> arete, total inchange) : {len(echanges)}")
for e, ps, legs in echanges:
    print(f"   {e} : {len(ps)} aretes, {len(legs)} cles retirees")
print(f"\nREMPLISSAGES (composant compte nulle part, la table dit qu'il devrait) : {len(remplissages)}")
for e, r in remplissages:
    print(f"   {e} : {len(r)} legendaires — {r[:3]}")
print(f"\nREFUS : {len(refus)}")
for r in refus[:12]:
    print("  ", r)
print(f"\nVARIATIONS DE TOTAL : {len(ec)} | remplissages (0 -> n) : {len(ec) - len(suspects)} | SUSPECTS : {len(suspects)}")
for x in suspects[:12]:
    print("   SUSPECT", x)
if not suspects:
    d["_meta"]["version"] = VER
    d["_meta"]["last_updated"] = "2026-09-07"
    json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n{DST} ecrit — {len(ec)} remplissages, aucun total existant modifie")
else:
    print("\nRIEN ECRIT")
