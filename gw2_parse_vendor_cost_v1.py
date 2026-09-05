#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrait le cout d'achat d'un objet vendu par un PNJ, sur sa page wiki.

Troisieme source apres `gw2_parse_material_list_v1.py` (tables des pages
d'armes) et `gw2_parse_wiki_recipe_v1.py` (boite de recette). Elle repond au
constat suivant : sur les quarante aretes restees non chiffrees, vingt-deux
concernaient des dons qui **ne se craftent pas**. Gift of the Itzel s'achete
500 Airship Parts + 1 or chez le Itzel Mastery Vendor ; Gift of Research coute
250 Exotic Essence of Luck + 10 or chez Lyhr. La donnee etait la depuis le
debut, dans la table « Vendor / Area / Zone / Cost », pas dans une recette.

Un cout d'achat se multiplie exactement comme un ingredient : s'il faut deux
dons, il faut deux fois la mise. La distinction craft / achat compte pour dire
au joueur ou aller, pas pour compter.

La colonne « Cost » melange trois choses. Les monnaies du portefeuille et l'or
sont ignorees ici — le tracker les traite par ailleurs — et seuls sont retenus
les liens vers un OBJET precede d'un nombre. Le `span.price` qui enveloppe l'or
est retire avant lecture, sans quoi « 1 Coin » passerait pour un ingredient.

Plusieurs lignes decrivent souvent le meme achat chez des vendeurs differents.
Les couts sont donc dedupliques, et une divergence entre deux vendeurs est
signalee plutot que tranchee.

Usage :
    python3 gw2_parse_vendor_cost_v1.py ressources/wiki/gift_of_the_itzel.html
    python3 gw2_parse_vendor_cost_v1.py --dir ressources/wiki --json out.json
"""
import json
import re
import sys
from pathlib import Path

LIGNE = re.compile(r"<tr>(.*?)</tr>", re.S)
CELLULE = re.compile(r"<t([dh])\b([^>]*)>(.*?)</t\1>", re.S)
PRIX = re.compile(r'<span class="price".*?</span>', re.S)
ICONE = re.compile(r"<img[^>]*>", re.S)
COUT = re.compile(r'([\d,]+)\s*(?:&#160;|&nbsp;|\s)*<a href="/wiki/([^"#?]+)"')
TITRE = re.compile(r'<h1[^>]*id="firstHeading"[^>]*>(?:<[^>]+>)*([^<]+)', re.S)

# Monnaies et jetons que le tracker compte ailleurs : les lire ici les ferait
# apparaitre deux fois.
HORS_ARBRE = {"Coin", "Karma", "Gold_coin", "Silver_coin", "Copper_coin",
              "Spirit_Shard", "Laurel"}


def _cout_cellule(cellule):
    """[(objet, quantite)] pour une cellule « Cost »."""
    net = ICONE.sub("", PRIX.sub("", cellule))
    out = []
    for qte, cible in COUT.findall(net):
        if cible in HORS_ARBRE:
            continue
        out.append((cible, int(qte.replace(",", ""))))
    return out


def couts(chemin):
    """[(objet, quantite)] pour la page, dedupliques, et les divergences."""
    html = Path(chemin).read_text(encoding="utf-8", errors="ignore")
    i = html.find('id="Acquisition"')
    if i < 0:
        return [], []
    vus, divergences = {}, []
    for tbl in re.finditer(r"<table[^>]*>(.*?)</table>", html[i:], re.S):
        entete = None
        for ligne in LIGNE.findall(tbl.group(1)):
            cs = CELLULE.findall(ligne)
            if not cs:
                continue
            if cs[0][0] == "h":
                entete = [re.sub(r"<[^>]+>", "", c[2]).strip().lower() for c in cs]
                continue
            if not entete or "cost" not in entete:
                continue
            k = entete.index("cost")
            if k >= len(cs):
                continue
            for cible, q in _cout_cellule(cs[k][2]):
                if cible in vus and vus[cible] != q:
                    divergences.append((cible, vus[cible], q))
                else:
                    vus.setdefault(cible, q)
    return sorted(vus.items()), divergences


def lire(chemin):
    html = Path(chemin).read_text(encoding="utf-8", errors="ignore")
    t = TITRE.search(html)
    c, d = couts(chemin)
    return {
        "page": Path(chemin).stem,
        "titre": re.sub(r"\s+", " ", t.group(1)).strip() if t else None,
        "couts": c,
        "divergences": d,
    }


def main():
    argv = sys.argv[1:]
    sortie = None
    if "--json" in argv:
        i = argv.index("--json")
        sortie = Path(argv[i + 1])
        del argv[i:i + 2]
    if "--dir" in argv:
        i = argv.index("--dir")
        cibles = sorted(Path(argv[i + 1]).glob("*.html"))
        del argv[i:i + 2]
    else:
        cibles = [Path(a) for a in argv]

    res = [lire(c) for c in cibles]
    avec = [r for r in res if r["couts"]]
    print(f"Pages lues : {len(res)}")
    print(f"  avec cout d'achat : {len(avec)}")
    print(f"  couts distincts   : {sum(len(r['couts']) for r in avec)}")
    div = [r for r in res if r["divergences"]]
    for r in div[:10]:
        print(f"  DIVERGENCE {r['page']} : {r['divergences']}")
    if sortie:
        sortie.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"Ecrit : {sortie}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
