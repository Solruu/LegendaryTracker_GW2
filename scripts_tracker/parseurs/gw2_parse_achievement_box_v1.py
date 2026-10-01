#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lit l'encadre d'un succes de collection du wiki.

Trois champs y vivent que le tableau des objets ne porte pas, et qui repondent
a « comment j'ouvre cette collection » :

    Prerequisite  le succes a terminer avant
    Unlock Item   l'objet qui declenche l'ouverture — souvent le precurseur du
                  palier precedent, ce qui rend l'ordre entre paliers explicite
    Reward        ce que la collection rend, souvent un coffre contenant la
                  recette de l'etape suivante

L'API ne les expose pas : elle rend `locked_text` en prose, sans structure.
"""
import argparse, html, json, re

BALISE = re.compile(r"<[^>]+>")
LIEN = re.compile(r'<a href="/wiki/([^"#]+)"[^>]*>([^<]+)</a>')


def texte(f):
    f = re.sub(r"<script.*?</script>", " ", f, flags=re.S)
    f = BALISE.sub(" ", f)
    return re.sub(r"\s+", " ", html.unescape(f)).replace("\u00a0", " ").strip(" :|")


# Tous les intitules possibles de l'encadre. Borner sur un seul suffit tant
# qu'il est present ; quand « Unlock Item » manque, le champ precedent deborde
# sur « Reward » ou « Title » et ramene « Salvation's Cost Title: ». On borne
# donc sur le PREMIER intitule rencontre, quel qu'il soit.
LABELS = ["Prerequisite", "Unlock Item", "Reward", "Rewards", "Title", "Achievement",
          "Collection", "Objectives", "Categories"]


def champ(h, etiquette, _suivant=None):
    """Rend {name, wiki} du premier lien apres l'etiquette, borne au champ suivant."""
    i = h.find(etiquette + ":")
    if i < 0:
        return None
    bornes = [h.find(l + ":", i + len(etiquette) + 1) for l in LABELS]
    bornes = [b for b in bornes if b > i]
    j = min(bornes) if bornes else i + 600
    seg = h[i: j]
    m = LIEN.search(seg)
    if not m:
        t = texte(seg[len(etiquette) + 1:])
        return {"name": t} if t else None
    return {"name": html.unescape(m.group(2)).strip(),
            "wiki": html.unescape(m.group(1)).replace("_", " ")}


def infobox(chemin):
    h = open(chemin, encoding="utf-8", errors="replace").read()
    titre = re.search(r'mw-page-title-main">([^<]*)', h)
    return {
        "achievement": titre.group(1) if titre else "?",
        "prerequisite": champ(h, "Prerequisite"),
        "unlock_item": champ(h, "Unlock Item"),
        "reward": champ(h, "Reward"),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("fichiers", nargs="+")
    ap.add_argument("--json")
    args = ap.parse_args()
    out = {}
    for f in args.fichiers:
        d = infobox(f)
        out[d["achievement"]] = d
        vide = [k for k in ("prerequisite", "unlock_item", "reward") if not d[k]]
        print(f"{d['achievement']:40s} "
              f"prereq={(d['prerequisite'] or {}).get('name','—')[:24]:24s} "
              f"unlock={(d['unlock_item'] or {}).get('name','—')[:20]:20s} "
              f"reward={(d['reward'] or {}).get('name','—')[:24]}"
              + (f"   ⚠ absent : {', '.join(vide)}" if vide else ""))
    if args.json:
        json.dump(out, open(args.json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"\n→ {args.json}")


if __name__ == "__main__":
    main()
