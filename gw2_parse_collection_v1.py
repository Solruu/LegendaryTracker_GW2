#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lit le tableau « Collection items » d'une page de collection du wiki.

Chaque ligne donne `numero | nom | type | sous-type | notes`. La colonne Notes
est exactement ce qui manque au tracker : le « comment » de l'etape.

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


def items(chemin):
    h = open(chemin, encoding="utf-8", errors="replace").read()
    titre = re.search(r'mw-page-title-main">([^<]*)', h)
    out = []
    for r in LIGNE.findall(h):
        cells = [texte(c) for c in CELL.findall(r)]
        if len(cells) < 4 or not cells[0].isdigit():
            continue
        out.append({
            "n": int(cells[0]),
            "name": cells[1],
            "type": cells[2],
            "subtype": cells[3] if len(cells) > 3 else "",
            "notes": cells[4] if len(cells) > 4 else "",
        })
    return (titre.group(1) if titre else "?"), out


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
