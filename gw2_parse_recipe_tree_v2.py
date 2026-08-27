#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lit un arbre de recette GW2Efficiency exporte en HTML.

Le v1 attribuait chaque feuille au noeud qui la PRECEDAIT dans le texte. C'est
faux : l'ordre de lecture n'est pas la hierarchie. Il attribuait ainsi 100
ectoplasmes a la Bouteille d'huile de dirigeable, qui n'en demande aucun ; ils
appartiennent au Lingot cristallin, plus haut dans l'arbre.

Le v2 mesure la profondeur reelle au solde des <div>, et le parent d'un noeud
est le dernier noeud de profondeur strictement inferieure.

Rappels sur ces arbres :
- les quantites sont ABSOLUES par noeud, pas des cascades multiplicatives ;
- les etapes verrouillees par COLLECTION sont entierement omises. Une absence
  ici n'est pas une absence dans le jeu.
"""
import argparse, collections, re

NOM = re.compile(r"component\.id === 1\)\"\>\s*([^<]{2,60}?)\s*</span>")
QTE = re.compile(r'\>\s*([\d,]+)x\s*</span>')
OUV = re.compile(r"<div\b")
FER = re.compile(r"</div>")


def noeuds(html):
    """Rend [(nom, quantite, profondeur)] dans l'ordre du document."""
    out, last, prof = [], 0, 0
    for m in NOM.finditer(html):
        tranche = html[last:m.start()]
        prof += len(OUV.findall(tranche)) - len(FER.findall(tranche))
        last = m.start()
        amont = html[max(0, m.start() - 900): m.start()]
        q = None
        for qm in QTE.finditer(amont):
            q = qm.group(1)          # la derniere avant le nom
        if q is None:
            continue
        out.append((m.group(1).strip(), int(q.replace(",", "")), prof))
    return out


def parent(ns, i):
    """Dernier noeud de profondeur strictement inferieure."""
    for j in range(i - 1, -1, -1):
        if ns[j][2] < ns[i][2]:
            return ns[j]
    return None


def racines(html, noms):
    """Bornes de chaque legendaire dans un export multi-arbres."""
    pos = {}
    for n in noms:
        m = re.search(r"component\.id === 1\)\"\>\s*" + re.escape(n) + r"\s*</span>", html)
        if m:
            pos[n] = m.start()
    ordre = sorted(pos.items(), key=lambda x: x[1])
    return {n: (p, ordre[k + 1][1] if k + 1 < len(ordre) else len(html))
            for k, (n, p) in enumerate(ordre)}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("fichier")
    ap.add_argument("--racine", help="borne l'analyse a ce legendaire")
    ap.add_argument("--racines", help="liste separee par des virgules pour un export multi-arbres")
    ap.add_argument("--objet", help="detaille ce composant et ses parents")
    args = ap.parse_args()

    html = open(args.fichier, encoding="utf-8", errors="replace").read()
    if args.racines and args.racine:
        b = racines(html, [x.strip() for x in args.racines.split(",")])
        if args.racine not in b:
            raise SystemExit(f"racine '{args.racine}' absente ; trouvees : {sorted(b)}")
        a, z = b[args.racine]
        html = html[a:z]

    ns = noeuds(html)
    if args.objet:
        total = 0
        for i, (nom, q, _) in enumerate(ns):
            if nom != args.objet:
                continue
            p = parent(ns, i)
            total += q
            print(f"  {q:6d}  <- {p[0]} (x{p[1]})" if p else f"  {q:6d}  <- RACINE")
        print(f"  {'':6s}  total = {total}")
        return

    agg = collections.defaultdict(int)
    for nom, q, _ in ns:
        agg[nom] += q
    print(f"{len(ns)} noeuds, {len(agg)} objets distincts")
    for nom, q in sorted(agg.items(), key=lambda x: -x[1])[:30]:
        print(f"  {q:8d}  {nom}")


if __name__ == "__main__":
    main()
