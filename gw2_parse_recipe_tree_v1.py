# -*- coding: utf-8 -*-
"""Extrait « Nx <objet> » d'un arbre gw2efficiency exporte en HTML.

Les arbres donnent des quantites ABSOLUES par noeud (pas des cascades
multiplicatives) et omettent entierement les etapes verrouillees par
collection : une absence ici n'est pas une absence dans le jeu.

Ancrage sur le libelle, pas sur le conteneur : le HTML Angular exporte est
truffe de commentaires ngIf, et le couple quantite/nom se lit en remontant
depuis le nom.
"""
import re, sys, collections

NOM = re.compile(
    r"component\.id === 1\)\"\>\s*([^<]{2,60}?)\s*</span>")
QTE = re.compile(r'\>\s*([\d,]+)x\s*</span>')

def noeuds(path):
    h = open(path, encoding="utf-8", errors="replace").read()
    out = []
    for m in NOM.finditer(h):
        nom = m.group(1).strip()
        if not nom or nom.startswith("{{"):
            continue
        amont = h[max(0, m.start() - 900): m.start()]
        q = None
        for qm in QTE.finditer(amont):
            q = qm.group(1)
        if q is None:
            continue
        out.append((nom, int(q.replace(",", "")), m.start()))
    return out

if __name__ == "__main__":
    ns = noeuds(sys.argv[1])
    filtre = sys.argv[2] if len(sys.argv) > 2 else ""
    agg = collections.defaultdict(list)
    for nom, q, pos in ns:
        agg[nom].append(q)
    print(f"{len(ns)} noeuds, {len(agg)} objets distincts")
    for nom in sorted(agg):
        if filtre and filtre.lower() not in nom.lower():
            continue
        print(f"  {nom:36s} {agg[nom]}  total={sum(agg[nom])}")
