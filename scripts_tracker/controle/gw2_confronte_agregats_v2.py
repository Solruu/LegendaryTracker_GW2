#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Confrontation des agregats rediges en prose.

Le depot confronte deja les tables « Full material list »
(`gw2_confronte_totaux_v8.py`) et, noeud par noeud, les boites Recipe
(`gw2_relecture_recettes_v5.py`). Il restait une troisieme forme, que personne
ne lisait : les listes de courses ecrites EN PROSE sur les pages de collection,
du type « Banner of the Commander, crafted using recipe from Lady Camilla,
which requires Inscribed Shard x 200, Orichalcum Ingot x 25… ».

C'est ainsi qu'un achat a echappe a tout : les enfants de
`banner_of_the_commander` correspondent exactement a sa boite Recipe, donc la
relecture ne voyait aucun defaut ; `vision_i_awakening` n'est pas une table
« Full material list », donc la confrontation des totaux ne la lisait pas. Et
la page annonce 200 eclats inscrits la ou l'arbre n'en justifie que 100.

Quatre pages portent ces agregats : warbringer, vision_i_awakening,
ad_infinitum, the_ascension — 61 quantites au total.

Deux signaux, de force tres differente :

  DEPASSE       une occurrence seule exige plus que le total de la cible. Une
                partie ne peut pas exceder le tout : c'est une erreur, dans
                l'arbre ou dans la lecture.
  SOMME         le cumul des occurrences du meme objet sur la page depasse le
                total. A ARBITRER : deux agregats peuvent se recouvrir, auquel
                cas la somme n'a pas de sens. C'est ce signal-la qui attrape le
                cas des eclats inscrits, et c'est aussi celui qui fait du bruit.

L'outil ne modifie rien. Il ecrit un rapport.

Usage : python3 gw2_confronte_agregats_v1.py [--rapport FICHIER]
"""
import argparse
import importlib.util
import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import unquote

HERE = Path(__file__).resolve().parents[2]  # racine du depot

# « <a ...>Nom</a> x 200 », avec les espaces insecables du wiki.
PAIRE = re.compile(
    r'/wiki/([A-Za-z0-9_%\'\.\(\)-]{2,60})"[^>]*>\s*([^<]{2,60}?)\s*</a>'
    r'\s*(?:&#160;|&nbsp;|\s)*x\s*(\d{1,4})')


def derniere(motif, base=None):
    fs = sorted((base or HERE).glob(motif), key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    if not fs:
        sys.exit(f"aucun fichier {motif}")
    return fs[-1]


def charge_relecture():
    """Un seul resolveur pour toute la chaine : celui de la relecture."""
    spec = importlib.util.spec_from_file_location(
        "relecture",
        derniere("gw2_relecture_recettes_v*.py",
                 Path(__file__).resolve().parent))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def total_sous(cc, cible, quoi):
    """Quantite de `quoi` requise par `cible` : le total du MOTEUR.

    v2 : la v1 refaisait sa propre cascade et ne visitait chaque composant
    qu'une fois (`vus`). Un composant atteint par deux chemins — la Pristine
    Mist Essence d'Ad Infinitum, cle a plat 3 ET arete Unbound 5 — ne
    transmettait a ses descendants que le premier : 3 cubes au lieu de 8, et
    deux faux « DEPASSE ». Le moteur est la seule source des totaux.
    """
    return _MODELE.totaux(cible).get(quoi, 0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rapport", default=None)
    args = ap.parse_args()

    src = derniere("gw2_sources_v*.json")
    data = json.loads(src.read_text(encoding="utf-8"))
    global _MODELE
    import sys as _s
    _s.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from moteur.gw2_moteur_v4 import Modele
    _MODELE = Modele.depuis(data, src)
    cc = data["craft_components"]
    legs = data["legendaries"]
    rel = charge_relecture()
    index = json.loads((HERE / "ressources" / "INDEX_CONTENU.json").read_text(encoding="utf-8"))
    materiaux = json.loads((HERE / "gw2_materials_ref.json").read_text(encoding="utf-8"))
    res = rel.Resolveur(cc, index, legs, materiaux)

    # Quelle cible porte cette page ? Par le slug, puis par le champ `wiki`,
    # puis par le prefixe du nom de page — `vision_i_awakening` est a `vision`.
    par_slug = {}
    for lk, lv in legs.items():
        if not isinstance(lv, dict):
            continue
        par_slug[lk] = lk
        if lv.get("wiki"):
            par_slug[rel.slugifie(lv["wiki"])] = lk

    def cible_de(page):
        if page in par_slug:
            return par_slug[page]
        for slug, lk in par_slug.items():
            if page.startswith(slug + "_"):
                return lk
        return None

    lignes = ["# Confrontation des agrégats rédigés en prose", "",
              f"Source : `{src.name}` — généré par `gw2_confronte_agregats_v1.py`.", "",
              "Les listes de courses écrites en prose sur les pages de collection ne sont",
              "lues ni par la confrontation des totaux (qui ne voit que les tables « Full",
              "material list ») ni par la relecture des recettes (qui compare nœud par nœud).",
              "C'est là qu'un achat a échappé à tout : 200 éclats inscrits annoncés pour la",
              "Banner of the Commander, 100 seulement justifiés par les pages.", "",
              "**DÉPASSE** — une occurrence seule exige plus que le total de la cible. Une",
              "partie ne peut pas excéder le tout : c'est une erreur.",
              "",
              "**SOMME** — le cumul des occurrences du même objet dépasse le total. À",
              "arbitrer : deux agrégats peuvent se recouvrir, auquel cas la somme ne veut",
              "rien dire.", ""]

    n_pages = n_depasse = n_somme = n_ok = 0
    for fichier in sorted((HERE / "ressources" / "wiki").glob("*.html")):
        texte = fichier.read_text(encoding="utf-8", errors="ignore")
        paires = PAIRE.findall(texte)
        if len(paires) < 3:
            continue
        cible = cible_de(fichier.stem)
        if not cible:
            lignes.append(f"## {fichier.stem} — aucune cible rattachée, non confronté\n")
            continue
        n_pages += 1
        occurrences = defaultdict(list)
        for titre, _libelle, qte in paires:
            cid, _comment = res.resoudre(titre)
            if cid:
                occurrences[cid].append(int(qte))
        lignes.append(f"## {fichier.stem} → `{cible}` — {len(occurrences)} objets\n")
        lignes.append("| verdict | composant | prose | somme | arbre |")
        lignes.append("|---|---|---|---:|---:|")
        for cid in sorted(occurrences):
            qs = occurrences[cid]
            arbre = total_sous(cc, cible, cid)
            somme = sum(qs)
            if arbre and max(qs) > arbre:
                verdict, n_depasse = "**DÉPASSE**", n_depasse + 1
            elif arbre and somme > arbre:
                verdict, n_somme = "SOMME", n_somme + 1
            else:
                verdict, n_ok = "ok", n_ok + 1
            lignes.append(f"| {verdict} | `{cid}` | {' + '.join(map(str, qs))} | "
                          f"{somme} | {arbre} |")
        lignes.append("")

    lignes.insert(7, f"**{n_pages} pages confrontées — {n_depasse} dépassements, "
                     f"{n_somme} sommes à arbitrer, {n_ok} accords.**\n")
    dest = args.rapport
    if not dest:
        # v2 : suite de la numerotation existante, pas le premier trou.
        nums = [int(re.search(r"_v(\d+)\.md$", f.name).group(1))
                for f in HERE.glob("CONFRONTATION_AGREGATS_v*.md")]
        n = max(nums, default=0) + 1
        dest = f"CONFRONTATION_AGREGATS_v{n}.md"
    (HERE / dest).write_text("\n".join(lignes) + "\n", encoding="utf-8")
    print(f"pages {n_pages} | depassements {n_depasse} | sommes a arbitrer {n_somme} | "
          f"accords {n_ok}")
    print(f"ecrit : {dest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
