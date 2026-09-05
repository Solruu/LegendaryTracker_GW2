#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrait la recette et l'apiId d'une page d'objet du wiki GW2.

Complement de `gw2_parse_material_list_v1.py`, qui lit les tables « Full
material list » des pages d'ARMES. Ici on lit la page de l'OBJET lui-meme :
c'est la seule source pour les dons qui n'apparaissent sur aucune arme
archivee, et la seule qui donne l'apiId.

Deux blocs sont exploites.

`div.recipe-box` porte la recette : un `div.ingredients` contenant une liste de
definition ou chaque `<dt>` est une quantite et le `<dd>` qui suit l'ingredient.
Le meme bloc donne la discipline, le niveau requis et l'identifiant de recette.
Une page peut en porter plusieurs quand l'objet a des variantes ; toutes sont
retournees, a l'appelant de choisir.

L'infobox porte l'apiId de l'OBJET, dans un `span.gamelink` avec
`data-type="item"`. Il ne faut pas le confondre avec le gamelink de la
recette-box, qui est `data-type="recipe"` et pointe l'entree de recette, pas
l'objet. `gw2_materials_ref.json` ne couvre que le stockage de materiaux : pour
un don, cet attribut est la seule source d'apiId dont on dispose.

Usage :
    python3 gw2_parse_wiki_recipe_v1.py ressources/wiki/gift_of_energy.html
    python3 gw2_parse_wiki_recipe_v1.py --dir ressources/wiki --json out.json
"""
import json
import re
import sys
from pathlib import Path

BOITE = re.compile(r'<div class="recipe-box".*?(?=<div class="recipe-box"|\Z)', re.S)
INGR = re.compile(r'<div class="ingredients">(.*?)</div>', re.S)
PAIRE = re.compile(r"<dt>\s*([\d,]+)\s*</dt>\s*<dd>(.*?)</dd>", re.S)
LIEN = re.compile(r'<a href="/wiki/([^"#?]+)"[^>]*>([^<]*)</a>')
ICONE = re.compile(r'<span class="small item-icon.*?</span>', re.S)
GAMELINK = re.compile(r'<span class="gamelink"[^>]*data-type="([^"]+)"[^>]*data-id="(\d+)"')
CHAMP = re.compile(r"<dt>([^<]+)</dt>\s*<dd>(.*?)</dd>", re.S)
TITRE = re.compile(r'<h1[^>]*id="firstHeading"[^>]*>(?:<[^>]+>)*([^<]+)', re.S)


def _texte(x):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", x)).strip()


def api_id(html):
    """apiId de l'objet decrit par la page, ou None.

    Les gamelink de type `recipe` sont ignores : ils identifient la recette et
    non l'objet, et les confondre remplirait la base d'identifiants qui ne
    resolvent rien contre l'inventaire du joueur.
    """
    for typ, ident in GAMELINK.findall(html):
        if typ == "item":
            return int(ident)
    return None


def recettes(html):
    """[{sortie, discipline, rating, ingredients:[(cible, qty)]}] pour la page."""
    out = []
    for bloc in BOITE.findall(html):
        m = INGR.search(bloc)
        if not m:
            continue
        # Un ingredient peut apparaitre sur DEUX lignes de la meme recette :
        # Gift of Research demande 250 Hydrocatalytic Reagent deux fois, soit
        # 500. Prendre le maximum au lieu de la somme aurait divise ce cout par
        # deux ; la table du vendeur, qui annonce 500, l'a confirme.
        cumul = {}
        ordre = []
        for qte, corps in PAIRE.findall(m.group(1)):
            lien = LIEN.search(ICONE.sub("", corps))
            if not lien:
                continue
            cible = lien.group(1)
            if cible not in cumul:
                ordre.append(cible)
            cumul[cible] = cumul.get(cible, 0) + int(qte.replace(",", ""))
        ing = [(c, cumul[c]) for c in ordre]
        if not ing:
            continue
        champs = {k.strip(): _texte(v) for k, v in CHAMP.findall(bloc)}
        # Certaines recettes rendent un intervalle ("10 - 40") : on garde alors
        # la borne basse, seule valeur sur laquelle on puisse compter.
        brut = champs.get("Output qty.", "1") or "1"
        chiffres = re.findall(r"\d+", brut)
        out.append({
            "sortie": int(chiffres[0]) if chiffres else 1,
            "discipline": champs.get("Discipline"),
            "rating": champs.get("Req. rating"),
            "ingredients": ing,
        })
    return out


def lire(chemin):
    html = Path(chemin).read_text(encoding="utf-8", errors="ignore")
    t = TITRE.search(html)
    return {
        "page": Path(chemin).stem,
        "titre": _texte(t.group(1)) if t else None,
        "api_id": api_id(html),
        "recettes": recettes(html),
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
    avec = [r for r in res if r["recettes"]]
    print(f"Pages lues : {len(res)}")
    print(f"  avec recette : {len(avec)}")
    print(f"  avec apiId   : {sum(1 for r in res if r['api_id'])}")
    print(f"  aretes       : {sum(len(x['ingredients']) for r in avec for x in r['recettes'])}")
    if sortie:
        sortie.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"Ecrit : {sortie}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
