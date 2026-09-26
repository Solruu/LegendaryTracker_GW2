#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Completion de l'arbre : creer les composants que les recettes reclament.

`gw2_relecture_recettes_v2.py` liste les ingredients qu'aucun composant ne
represente. Tant qu'ils n'existent pas, leur cout n'est nulle part : un
Sunrise sans Dawn, un `spiritwood_plank` sans Soft Wood Plank. L'objectif est
d'avoir l'ensemble des couts, donc ces noeuds doivent exister, meme si leur
propre voie d'obtention reste a lire.

Rien n'est invente. Trois choses seulement, chacune sourcee :

  la QUANTITE   lue dans la recette capturee du parent -- c'est elle qui fait
                remonter le cout, et c'est la seule qui compte pour les totaux ;
  le NOM        le titre wiki que cette meme recette donne a l'ingredient ;
  l'apiId       quand `gw2_materials_ref.json` (genere depuis /v2/materials et
                /v2/items) porte un materiau de ce nom. Le referentiel fait
                autorite sur l'orthographe : « Piles of Bloodstone Dust » dans
                une recette, « Pile of Bloodstone Dust » a l'API.

Ce qu'on n'ecrit PAS : la voie d'obtention. Un composant cree ici porte une
source `unknown` qui dit ou sa quantite a ete lue et que sa page manque. Il
part alors en file de capture par le mecanisme normal, et sa decomposition
suivra.

Usage : python3 gw2_completion_arbre_v1.py [--ecrire]
Sans --ecrire, le script mesure et ne touche a rien.
"""
import argparse
import json
import re
import sys
import unicodedata
from collections import OrderedDict, defaultdict
from pathlib import Path
from urllib.parse import unquote

HERE = Path(__file__).resolve().parent


def derniere(motif):
    fs = sorted(HERE.glob(motif), key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    if not fs:
        sys.exit(f"aucun fichier {motif}")
    return fs[-1]


def slugifie(titre):
    t = unquote(str(titre))
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    # « Rodgort's Flame » -> rodgorts_flame : le « s » colle a son proprietaire,
    # comme le veut la convention du depot, et comme l'audit l'exige.
    t = re.sub(r"'s\b", "s", t).replace("'", "")
    return re.sub(r"[^a-z0-9]+", "_", t.lower()).strip("_")


def clef_sing(x):
    """Nom comparable, insensible au pluriel du mot de tete."""
    n = re.sub(r"\s+", " ", unquote(str(x)).replace("_", " ")).strip().casefold()
    tete, _, reste = n.partition(" ")
    if tete.endswith("s") and len(tete) > 3:
        tete = tete[:-1]
    return (tete + " " + reste).strip()


def lisible(titre):
    return re.sub(r"\s+", " ", unquote(str(titre)).replace("_", " ")).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ecrire", action="store_true")
    args = ap.parse_args()

    src = derniere("gw2_sources_v*.json")
    data = json.loads(src.read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    cc = data["craft_components"]
    legs = data["legendaries"]

    rapport = derniere("RELECTURE_RECETTES_v*.md").read_text(encoding="utf-8")
    bloc = rapport.split("## Ingrédients qu'aucun composant ne représente", 1)
    if len(bloc) < 2:
        sys.exit("le rapport ne contient pas la table des manquants")
    table = bloc[1].split("\n## ", 1)[0]
    lignes = re.findall(r"^\| `([^`]+)` \| `([^`]+)` \| (\d+) \| `([^`]+)` \|", table, re.M)
    if not lignes:
        sys.exit("aucune ligne MANQUANT lue dans le rapport")

    mat = json.loads((HERE / "gw2_materials_ref.json").read_text(encoding="utf-8"))
    par_nom = {}
    for ident, nom in (mat.get("flat") or {}).items():
        par_nom.setdefault(str(nom).strip().casefold(), (int(ident), str(nom).strip()))

    # Une capture au depot vaut mieux qu'un referentiel : elle porte l'apiId ET
    # le titre exact de la page. `Testimony_of_Jade_Heroics` est dans ce cas —
    # sa page est la, son composant n'existait pas.
    par_page = {e["page"]: e for e in json.loads(
        (HERE / "ressources" / "INDEX_CONTENU.json").read_text(encoding="utf-8"))}

    def au_referentiel(titre):
        """(apiId, nom officiel) si le referentiel des materiaux connait ce nom."""
        page = par_page.get(slugifie(titre))
        if page and isinstance(page.get("api_id"), int):
            return page["api_id"], (page.get("titre") or lisible(titre))
        n = lisible(titre)
        for essai in (n, re.sub(r"^Piles of ", "Pile of ", n), n[:-1] if n.endswith("s") else n):
            hit = par_nom.get(essai.casefold())
            if hit:
                return hit
        return None, None

    # Un ingredient peut etre reclame par plusieurs parents, avec des quantites
    # differentes. On rassemble d'abord, on cree ensuite : un composant, autant
    # d'aretes que de parents.
    demandes = defaultdict(list)
    for parent, ingredient, qte, page in lignes:
        demandes[ingredient].append((parent, int(qte), page))

    deja_api = {c["apiId"]: cid for cid, c in cc.items() if isinstance(c.get("apiId"), int)}
    deja_nom = {}
    for cid, c in cc.items():
        if c.get("name"):
            deja_nom.setdefault(clef_sing(c["name"]), cid)
    doublons = []
    crees, aretes, avec_api = 0, 0, 0
    apercu = []
    for ingredient, reclamations in sorted(demandes.items()):
        cid = slugifie(ingredient)
        if cid in cc:
            continue  # deja la : une autre passe l'a pose entre-temps
        # Deux gardes contre le doublon, parce qu'un doublon compte le cout
        # deux fois. L'apiId d'abord : « Piles of Bloodstone Dust » et
        # `bloodstone_dust` sont le meme objet 46731. Le nom ensuite, au
        # pluriel pres : « Fruit of the Shadow » et « Fruits of the Shadow ».
        aid_test, _ = au_referentiel(ingredient)
        if aid_test and aid_test in deja_api:
            doublons.append((ingredient, deja_api[aid_test], f"apiId {aid_test}"))
            continue
        if clef_sing(ingredient) in deja_nom:
            doublons.append((ingredient, deja_nom[clef_sing(ingredient)], "nom au pluriel près"))
            continue
        aid, nom_api = au_referentiel(ingredient)
        nom = nom_api or lisible(ingredient)
        parents = [p for p, _q, _pg in reclamations]
        pages = sorted({pg for _p, _q, pg in reclamations})
        precurseur = all(
            p in legs and (p.startswith("gen1_") or p.startswith("gen2_")) and q == 1
            for p, q, _pg in reclamations
        )
        c = OrderedDict([("name", nom)])
        if aid:
            c["apiId"] = aid
            avec_api += 1
        c["kind"] = "precursor" if precurseur else ("material" if aid else "acquire")
        c["needed_for"] = parents
        c["farmable"] = True
        c["sources"] = [OrderedDict([
            ("type", "unknown"),
            ("tip", {
                "fr": "Voie d'obtention non lue : la page de cet objet n'est pas au dépôt. "
                      "Seule sa quantité est sourcée, depuis la recette de "
                      + ", ".join(pages) + ".",
                "en": "Acquisition path unread: this item's page is not in the repo. "
                      "Only its quantity is sourced, from the recipe on "
                      + ", ".join(pages) + ".",
            }),
            ("verified", False),
            ("checked", "2026-09-25"),
            ("ref", "recette de " + ", ".join(f"{pg}.html" for pg in pages)
                    + (f" ; identite depuis gw2_materials_ref.json (apiId {aid})" if aid else "")),
        ])]
        c["qty"] = OrderedDict((p, q) for p, q, _pg in reclamations)
        cc[cid] = c
        crees += 1
        aretes += len(reclamations)
        apercu.append((cid, nom, aid, c["kind"], len(reclamations)))

    print(f"composants a creer {crees} | aretes {aretes} | avec apiId {avec_api}")
    for ing, cid, pourquoi in doublons:
        print(f"   DOUBLON evite : {ing} est deja {cid} ({pourquoi})")
    for cid, nom, aid, kind, n in apercu[:12]:
        print(f"   {cid:42} {kind:10} api {str(aid):7} parents {n}")
    if crees > 12:
        print(f"   … et {crees - 12} autres")

    if not args.ecrire:
        print("(lecture seule — relancer avec --ecrire)")
        return 0

    n = int(re.search(r"_v(\d+)", src.name).group(1)) + 1
    dest = HERE / f"gw2_sources_v{n}.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"ecrit : {dest.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
