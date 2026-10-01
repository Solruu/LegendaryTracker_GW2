#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lit le tableau « Collection items » d'une page de collection du wiki.

Chaque ligne donne `numero | nom | type | sous-type | notes`. La colonne Notes
est exactement ce qui manque au tracker : le « comment » de l'etape.

Le v1 prenait toute ligne dont la premiere cellule etait un chiffre. Il ramassait
donc le tableau des MATERIAUX (« Quantity | Material | Buy price ») au lieu de
celui des objets, et manquait les collections dont l'en-tete n'est pas
« Collectible » mais « Objective ». Le v2 s'ancre sur l'EN-TETE du tableau et
n'accepte que les formes connues.

Trois formes coexistent sur le wiki :
    Collectible | Type | Subtype | Notes
    Collectible | Type | Subtype | Map | Notes
    Objective   | Nearest Waypoint | Notes          (et variantes avec Map, Area)

Deux pieges du HTML wiki, tous deux rencontres :
- les liens de point de passage sont suivis d'un `<script>` inline qui les
  active ; sans le retirer, la note se termine par du JavaScript ;
- le code de chatlink `[&BMUJAAA=]` est utile et doit etre garde, mais il est
  entoure d'entites HTML a decoder.
"""
import argparse, html, json, re, sys

LIGNE = re.compile(r"<tr[^>]*>(.*?)</tr>", re.S)
CELL = re.compile(r"<t[dh][^>]*>(.*?)</t[dh]>", re.S)
SCRIPT = re.compile(r"<script.*?</script>", re.S)
STYLE = re.compile(r"<style.*?</style>", re.S)
BALISE = re.compile(r"<[^>]+>")


def texte(fragment):
    f = SCRIPT.sub(" ", STYLE.sub(" ", fragment))
    f = BALISE.sub(" ", f)
    f = html.unescape(f)
    f = f.replace("\u00a0", " ")
    # Le JS residuel des gamelinks survit parfois au retrait des balises.
    f = re.sub(r"!function\(\).*?\}\(\);?", " ", f, flags=re.S)
    f = re.sub(r"const [a-z]=document\.getElementById.*", " ", f, flags=re.S)
    return re.sub(r"\s+", " ", f).strip(" .;|")


TABLE = re.compile(r"<table.*?</table>", re.S)
TH = re.compile(r"<th[^>]*>(.*?)</th>", re.S)


def entetes(t):
    return [texte(x) for x in TH.findall(t)]


def items(chemin):
    h = open(chemin, encoding="utf-8", errors="replace").read()
    titre = re.search(r'mw-page-title-main">([^<]*)', h)
    for t in TABLE.findall(h):
        en = entetes(t)
        if "Notes" not in en:
            continue
        # Le tableau des materiaux porte lui aussi une colonne chiffree : on
        # l'ecarte explicitement plutot que d'esperer qu'il ne matche pas.
        if "Material" in en or "Buy price" in en:
            continue
        if "Collectible" not in en and "Objective" not in en:
            continue
        nom_col = en.index("Collectible") if "Collectible" in en else en.index("Objective")
        notes_col = en.index("Notes")
        out = []
        for r in LIGNE.findall(t):
            cells = [texte(c) for c in CELL.findall(r)]
            if len(cells) <= max(nom_col, notes_col) or not cells[0].isdigit():
                continue
            out.append({
                "n": int(cells[0]),
                "name": cells[nom_col],
                "notes": cells[notes_col],
                "colonnes": {en[i]: cells[i] for i in range(1, len(en))
                             if i < len(cells) and i not in (nom_col, notes_col) and cells[i]},
            })
        if out:
            return (titre.group(1) if titre else "?"), out
    return (titre.group(1) if titre else "?"), []


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("fichiers", nargs="+")
    ap.add_argument("--json", help="ecrit le resultat dans ce fichier")
    args = ap.parse_args()
    tout = {}
    for f in args.fichiers:
        nom, its = items(f)
        vides = sum(1 for i in its if not i["notes"])
        print(f"{nom:34s} {len(its):3d} objets"
              + (f"  ⚠ {vides} sans note" if vides else ""))
        tout[nom] = its
    if args.json:
        json.dump(tout, open(args.json, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        print(f"\n→ {args.json}")


if __name__ == "__main__":
    main()
