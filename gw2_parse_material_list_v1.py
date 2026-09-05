#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrait l'arbre de craft chiffre des sections « Full material list » du wiki.

Pourquoi cette source plutot que la boite « Recipe » de la meme page : la boite
Recipe ne donne que le premier niveau (1 Zap, 1 Gift of Bolt, 1 Gift of Fortune,
1 Gift of Mastery) et son bouton « Show base ingredients » est rendu cote client
— l'arbre developpe n'existe pas dans le HTML archive. La section Full material
list, elle, est une VRAIE table a trois colonnes :

    colonne 1 (rowspan)  le composant de tete            Gift of Fortune
    colonne 2            ses ingredients, quantifies     250 Globs of Ectoplasm
    colonne 3            le detail d'un ingredient       250 Vials of Powerful Blood

Chaque ligne rend donc deux aretes potentielles : tete -> ingredient, puis
ingredient -> sous-ingredient. La colonne 3 sert aussi de fourre-tout a des
listes d'acquisition en prose (« Lost Bandit Chests », « PvP Reward Tracks ») :
on ne retient d'elle que les <dd> qui COMMENCENT par un nombre, seule forme qui
exprime une quantite plutot qu'une provenance.

Convention du wiki, appliquee ici : un ingredient sans nombre vaut 1. C'est vrai
de Bloodstone Shard, Gift of Exploration, Gift of Battle, Gift of Magic. La
quantite retournee est None quand aucun nombre n'est ecrit, et c'est a
l'appelant de decider — ce script ne devine pas.

Usage :
    python3 gw2_parse_material_list_v1.py                 # toutes les pages
    python3 gw2_parse_material_list_v1.py bolt frostfang  # une selection
    python3 gw2_parse_material_list_v1.py --json out.json
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
WIKI = HERE / "ressources" / "wiki"

CELLULE = re.compile(r"<t([dh])\b([^>]*)>(.*?)</t\1>", re.S)
LIGNE = re.compile(r"<tr\b[^>]*>(.*?)</tr>", re.S)
ICONE = re.compile(r'<span class="small item-icon.*?</span>', re.S)
LIEN = re.compile(r'<a href="/wiki/([^"#?]+)"[^>]*>([^<]*)</a>')
DD = re.compile(r"<dd>(.*?)</dd>", re.S)
NOMBRE = re.compile(r"^\s*([\d,]+)\s")

# Eternity est la fusion de Sunrise et Twilight : sa table porte le cout des DEUX
# armes, 500 ectoplasmes et 154 trefles la ou toute autre gen1 en demande 250 et
# 77. L'agregation l'ecarte donc, sans quoi elle doublerait onze aretes. Les
# onze conflits qu'elle levait servaient de controle : le parseur les retrouvait
# tous exactement doubles, et aucun autre.
DOUBLES = {"eternity"}


def _cible(cellule):
    """(cible_wiki, quantite) du premier lien reel de la cellule."""
    net = ICONE.sub("", cellule)
    m = LIEN.search(net)
    if not m:
        return None, None
    q = NOMBRE.match(m.group(2))
    return m.group(1), int(q.group(1).replace(",", "")) if q else None


def _sous_items(cellule):
    """Les <dd> quantifies de la colonne 3, ignorant les listes de provenance."""
    out = []
    for dd in DD.findall(cellule):
        q = NOMBRE.match(ICONE.sub("", dd))
        if not q:
            continue
        m = LIEN.search(ICONE.sub("", dd))
        if m:
            out.append((m.group(1), int(q.group(1).replace(",", ""))))
    return out


def _grille(tbl):
    """Reconstruit la table en tenant compte des rowspan.

    Un premier jet lisait les cellules dans l'ordre du document en ne suivant le
    rowspan que de la colonne 1. Frostgang le prenait en defaut : quand la
    colonne 2 porte elle aussi un rowspan, les cellules suivantes se decalent
    d'un cran et Gift of Fortune se retrouvait rattache a Gift of Mastery, dont
    il n'est pas un ingredient mais un frere. On reporte donc les rowspan de
    TOUTES les colonnes, comme le ferait un navigateur.
    """
    grille, report = [], {}          # report : index de colonne -> [restant, contenu]
    for ligne in LIGNE.findall(tbl):
        cs = CELLULE.findall(ligne)
        if not cs or cs[0][0] == "h":
            continue
        rang, i = [], 0
        col = 0
        while True:
            if col in report and report[col][0] > 0:
                rang.append(report[col][1])
                report[col][0] -= 1
                col += 1
                continue
            if i >= len(cs):
                break
            _, attrs, corps = cs[i]
            i += 1
            rang.append(corps)
            m = re.search(r'rowspan="(\d+)"', attrs)
            if m and int(m.group(1)) > 1:
                report[col] = [int(m.group(1)) - 1, corps]
            col += 1
        grille.append(rang)
    return grille


def aretes(chemin):
    """[(parent, enfant, quantite_ou_None)] pour une page."""
    html = Path(chemin).read_text(encoding="utf-8", errors="ignore")
    i = html.find('id="Full_material_list"')
    if i < 0:
        return []
    j = html.find("<table", i)
    k = html.find("</table>", j)
    if j < 0 or k < 0:
        return []

    out = []
    for rang in _grille(html[j:k]):
        if len(rang) < 2:
            continue
        tete = _cible(rang[0])[0]
        enfant, q = _cible(rang[1])
        if not tete or not enfant or tete == enfant:
            continue
        out.append((tete, enfant, q))
        if len(rang) > 2:
            for petit, pq in _sous_items(rang[2]):
                if petit != enfant:
                    out.append((enfant, petit, pq))
    return out


def main():
    argv = sys.argv[1:]
    sortie = None
    if "--json" in argv:
        i = argv.index("--json")
        sortie = Path(argv[i + 1])
        del argv[i:i + 2]
    args = [a for a in argv if not a.startswith("--")]

    pages = ([WIKI / f"{a}.html" for a in args] if args
             else sorted(p for p in WIKI.glob("*.html")
                         if 'id="Full_material_list"' in p.read_text(encoding="utf-8", errors="ignore")))

    total = {}
    conflits = []
    for p in pages:
        if p.stem in DOUBLES and not args:
            continue
        for parent, enfant, q in aretes(p):
            cle = (parent, enfant)
            if cle in total and total[cle] != q:
                if total[cle] is None:
                    total[cle] = q
                elif q is not None:
                    conflits.append((parent, enfant, total[cle], q, p.stem))
            else:
                total.setdefault(cle, q)

    print(f"Pages lues : {len(pages)}")
    print(f"Aretes distinctes : {len(total)} "
          f"({sum(1 for v in total.values() if v is not None)} chiffrees, "
          f"{sum(1 for v in total.values() if v is None)} sans nombre ecrit)")
    for c in conflits:
        print(f"  CONFLIT  {c[0]} -> {c[1]} : {c[2]} ici, {c[3]} dans {c[4]}")

    if sortie:
        sortie.write_text(json.dumps(
            [{"parent": p, "enfant": e, "qty": q} for (p, e), q in sorted(total.items())],
            ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"Ecrit : {sortie}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
