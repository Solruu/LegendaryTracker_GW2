#!/usr/bin/env python3
"""Les deux chemins de synchro doivent rendre la meme chose.

`ROUTES.md` le pose comme regle : Flask (`/api/progression`) et la synchro
directe navigateur construisent la meme reponse, et toute donnee ajoutee a l'un
doit l'etre a l'autre. Rien ne le verifiait.

Le 24/09/2026, la detection automatique des feuilles de recette a ete posee du
seul cote navigateur. Elle lisait la cle detenue par le client — vide chez qui
passe par Flask, dont la cle vit dans le `.env`. La fonction marchait donc pour
une moitie des utilisateurs, et rien ne l'a dit : le test de conformite des
moteurs compare moteur contre moteur, pas chemin contre chemin.

Ce controle compare les CLES DE PREMIER NIVEAU que les deux cotes posent. Il ne
lance rien et n'appelle aucune API : il lit les deux sources. Une cle presente
d'un seul cote est une asymetrie, et sort en 1.

Limite assumee : il compare la FORME, pas le contenu. Deux cotes peuvent poser
`_recipes` et le remplir differemment — ca, seul un appel reel le dirait.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
# Cles propres a un chemin, par nature, et qui ne sont donc pas des asymetries.
ADMISES = {
    # Le navigateur signe sa reponse pour que le front sache d'ou elle vient.
    "_direct",
    # Etat des sacs, que Flask lit autrement.
    "_bags_ok",
    # Collections : Flask les rend par legendaire, le direct sous `_collections`.
    "_collections",
}


def dernier(motif):
    fichiers = sorted(HERE.glob(motif),
                      key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    if not fichiers:
        print(f"introuvable : {motif}")
        sys.exit(2)
    return fichiers[-1]


def cles_flask(chemin):
    s = chemin.read_text(encoding="utf-8")
    a = s.find("def progression():")
    b = s.find("\n@app.route", a)
    seg = s[a:b]
    j = seg.find("return jsonify(result)")
    i = seg.rfind("result = {", 0, j)
    return set(re.findall(r'^\s+"([a-zA-Z_]+)":', seg[i:j], re.M))


def cles_direct(chemin):
    s = chemin.read_text(encoding="utf-8")
    # La synchro directe rend un objet litteral en une ligne, signe `_direct`.
    m = re.search(r"return \{([^}]*_direct: true[^}]*)\}", s)
    if not m:
        print("objet de la synchro directe introuvable dans le JSX")
        sys.exit(2)
    # JavaScript admet la forme abregee : `{ currencies, common, _gates }`.
    # Ne chercher que `cle:` en ratait cinq sur sept et faisait crier le
    # controle a tort.
    corps = m.group(1)
    cles = set()
    for morceau in corps.split(","):
        morceau = morceau.strip()
        if not morceau:
            continue
        nom = morceau.split(":", 1)[0].strip()
        if re.fullmatch(r"[a-zA-Z_][a-zA-Z0-9_]*", nom):
            cles.add(nom)
    return cles


def main():
    f, j = dernier("gw2_flask_server_v*.py"), dernier("gw2_legendary_tracker_v*.jsx")
    cf, cj = cles_flask(f), cles_direct(j)
    print(f"Flask  : {f.name} — {len(cf)} cles")
    print(f"Direct : {j.name} — {len(cj)} cles")
    # Les cibles nommees (vision, warbringer, …) n'existent que cote Flask, qui
    # rend la progression par legendaire ; le direct les construit ailleurs.
    interessantes = {c for c in (cf | cj) if c.startswith("_")} | {
        "currencies", "common", "achievements", "prismatic", "stocks", "errors"}
    manque_direct = sorted((cf & interessantes) - cj - ADMISES)
    manque_flask = sorted((cj & interessantes) - cf - ADMISES)
    if not manque_direct and not manque_flask:
        print("Les deux chemins posent les memes cles.")
        return 0
    for c in manque_direct:
        print(f"ASYMETRIE : '{c}' est pose par Flask et pas par la synchro directe.")
    for c in manque_flask:
        print(f"ASYMETRIE : '{c}' est pose par la synchro directe et pas par Flask.")
    print("\nToute donnee ajoutee a un chemin doit l'etre a l'autre (ROUTES.md).")
    return 1


if __name__ == "__main__":
    sys.exit(main())
