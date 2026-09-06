#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Indexe le CONTENU des captures wiki, pas seulement leur nom de fichier.

Pourquoi ce script existe : quatre fois de suite, j'ai declare un blocage en
demandant une page que le depot contenait deja. Le dernier cas est le pire —
la recette du Gift of Condensed Might etait lisible dans
`ressources/wiki/mystic_tribute.html` depuis le premier jour, et j'ai passe
trois passes a deduire son contenu de tables d'armes mal lues avant de demander
une capture d'ecran.

`ressources/INDEX.md` liste ce qu'on a capture. Il ne dit pas ce que ces
captures CONTIENNENT. Une page d'arme porte la recette de tous ses dons ; une
page de don porte son apiId, sa recette et son cout vendeur. Chercher « ai-je la
recette de X ? » demande donc de fouiller 448 fichiers, ce que personne ne fait
et que j'ai systematiquement remplace par une supposition.

Cet index repond a la question. Pour chaque page : l'apiId atteste, la recette
produite, les couts vendeur, la presence d'une table « Full material list » et,
surtout, **la liste des objets dont la page donne la recette** — y compris ceux
qui n'ont pas de page a eux.

    python3 gw2_index_contenu_v1.py            # ecrit ressources/INDEX_CONTENU.json
    python3 gw2_index_contenu_v1.py "Condensed Might"   # cherche
"""
import importlib.util
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
WIKI = HERE / "ressources" / "wiki"
SORTIE = HERE / "ressources" / "INDEX_CONTENU.json"


def _charger(nom, fichier):
    spec = importlib.util.spec_from_file_location(nom, HERE / fichier)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


LISTE = _charger("liste", "gw2_parse_material_list_v1.py")
RECETTE = _charger("recette", "gw2_parse_wiki_recipe_v1.py")
VENDEUR = _charger("vendeur", "gw2_parse_vendor_cost_v1.py")

TITRE = re.compile(r'<h1[^>]*id="firstHeading"[^>]*>(?:<[^>]+>)*([^<]+)', re.S)
API = re.compile(r"api\.guildwars2\.com/v2/items\?ids=(\d+)")
GAMELINK = re.compile(r'data-type="item"[^>]*data-id="(\d+)"')
BOITE = re.compile(r'<div class="recipe-box".*?(?=<div class="recipe-box"|\Z)', re.S)
NOM_BOITE = re.compile(r'<div class="recipe-box"[^>]*>\s*(?:<[^>]+>\s*)*([^<]+)')


def indexer(chemin):
    html = Path(chemin).read_text(encoding="utf-8", errors="ignore")
    t = TITRE.search(html)
    a, g = API.search(html), GAMELINK.search(html)
    ident = int(a.group(1)) if a and g and a.group(1) == g.group(1) else None

    # Une page peut porter PLUSIEURS boites de recette, pour des objets qui ne
    # sont pas celui de la page : mystic_tribute.html donne la recette du
    # tribut, mais aussi celles des dons condenses qui y entrent. C'est
    # exactement ce que l'index des noms de fichiers ne pouvait pas dire.
    recettes = []
    boites = BOITE.findall(html)
    for bloc, rec in zip(boites, RECETTE.recettes(html)):
        m = NOM_BOITE.search(bloc)
        rec = dict(rec)
        rec["produit"] = re.sub(r"\s+", " ", m.group(1)).strip() if m else None
        recettes.append(rec)

    couts, _ = VENDEUR.couts(chemin)
    return {
        "page": Path(chemin).stem,
        "titre": re.sub(r"\s+", " ", t.group(1)).strip() if t else None,
        "api_id": ident,
        "table_materiaux": LISTE.a_une_table(html),
        "recettes": recettes,
        "couts_vendeur": [{"objet": o, "qty": q} for o, q in couts],
        "aretes_table": [{"parent": p, "enfant": e, "qty": q}
                         for p, e, q in LISTE.aretes(chemin)] if LISTE.a_une_table(html) else [],
    }


def main():
    pages = sorted(WIKI.glob("*.html"))
    index = [indexer(p) for p in pages]

    if len(sys.argv) > 1:
        besoin = " ".join(sys.argv[1:]).lower()
        for e in index:
            trouve = []
            for r in e["recettes"]:
                if besoin in (r.get("produit") or "").lower():
                    trouve.append(f"recette de {r['produit']} : " +
                                  ", ".join(f"{q} {c}" for c, q in r["ingredients"]))
            for a in e["aretes_table"]:
                if besoin in a["parent"].lower().replace("_", " ") or besoin in a["enfant"].lower().replace("_", " "):
                    trouve.append(f"table : {a['parent']} -> {a['enfant']} = {a['qty']}")
            if besoin in (e["titre"] or "").lower():
                trouve.append(f"page de l'objet, apiId {e['api_id']}")
            for t in trouve[:4]:
                print(f"{e['page']} : {t}")
        return 0

    SORTIE.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
    rec = sum(len(e["recettes"]) for e in index)
    produits = {r["produit"] for e in index for r in e["recettes"] if r["produit"]}
    print(f"Pages indexees : {len(index)}")
    print(f"  avec apiId doublement atteste : {sum(1 for e in index if e['api_id'])}")
    print(f"  boites de recette : {rec}, portant {len(produits)} objets distincts")
    print(f"  tables « Full material list » : {sum(1 for e in index if e['table_materiaux'])}")
    print(f"  couts vendeur : {sum(len(e['couts_vendeur']) for e in index)}")
    print(f"Ecrit : {SORTIE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
