#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pages wiki des objectifs de meta, extraites des captures du depot.

Les metas d'episode (les cinq `vis_ep_*` de Vision, et leurs equivalents
Janthir / Visions of Eternity) n'ont ni bits ni liste d'enfants cote API : leur
liste d'objectifs vit dans `meta_eligible`, curee depuis le wiki. Chaque
objectif y etait un couple [id, nom] — sans page, donc sans lien cliquable dans
le rendu, alors que WIKI_PAR_BIT couvrait deja toutes les collections a bits.

La page se lit dans la capture elle-meme : le tableau du meta pointe chaque
objectif par une ancre `/wiki/PAGE#achievementNNNN`. NNNN EST l'id du succes
enfant — on indexe donc par id, jamais par nom : deux objectifs peuvent porter
le meme libelle, et un renommage cote wiki casserait un appariement par nom.

Le couple devient un triplet [id, nom, page]. Meme structure, meme liste, pas
de table parallele : rien a resynchroniser, l'absence de 3e element signifie
seulement « capture sans ancre » (cf. Year of the Ascension II a IV).

Le nom n'est jamais reecrit : si la capture nomme l'objectif autrement que la
liste curee, on le signale et on laisse la source en place — c'est une lecture
a reprendre a la main, pas une correction automatique.

Usage : python3 gw2_meta_pages_v2.py [--ecrire]
Sans --ecrire, le script mesure et ne touche a rien.
"""
import argparse
import html
import json
import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent
CAPTURES = RACINE / "ressources" / "wiki"
ANCRE = re.compile(r'href="/wiki/([^"#]+)#achievement(\d+)"[^>]*>([^<]{1,120})</a>')


def _cle(x):
    """Forme comparable d'un libelle : casse et espaces.

    Le wiki titre ses liens en capitales de titre — « Broodmother Down By The
    Bay » la ou l'API nomme le succes « Broodmother Down by the Bay ». Ce n'est
    pas une divergence, c'est une convention de titrage : l'appariement se fait
    sur l'id de toute facon, et le nom stocke reste celui du referentiel API,
    seul a faire foi pour un nom de succes. On ne compare donc que ce qui
    distinguerait vraiment deux objectifs.
    """
    return re.sub(r"\s+", " ", x).strip().casefold()


def derniere(motif):
    fs = sorted(RACINE.glob(motif), key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    if not fs:
        sys.exit(f"aucun fichier {motif}")
    return fs[-1]


def fichier_capture(source):
    """`wiki:Long_Live_the_Lich_(achievements)` -> chemin de la capture."""
    page = source.split("wiki:", 1)[-1].split(" ")[0]
    nom = re.sub(r"[^a-z0-9]+", "_", page.lower()).strip("_") + ".html"
    return CAPTURES / nom


def pages_par_id(chemin):
    """id de succes -> page portant son ancre, premiere occurrence."""
    texte = chemin.read_text(encoding="utf-8")
    trouve = {}
    for page, aid, libelle in ANCRE.findall(texte):
        trouve.setdefault(aid, (html.unescape(page), html.unescape(libelle).strip()))
    return trouve


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ecrire", action="store_true", help="ecrire la version suivante des sources")
    args = ap.parse_args()

    src = derniere("gw2_sources_v*.json")
    data = json.loads(src.read_text(encoding="utf-8"))
    metas = data.get("meta_eligible") or {}
    if not metas:
        sys.exit("meta_eligible absent")

    poses = deja = sans_capture = sans_ancre = 0
    divergences, manquantes, casse = [], [], []

    for mid, entree in metas.items():
        capture = fichier_capture(entree.get("source", ""))
        if not capture.exists():
            sans_capture += 1
            manquantes.append((mid, entree.get("name", ""), entree.get("source", "")))
            continue
        trouve = pages_par_id(capture)
        if not trouve:
            sans_ancre += 1
        lignes = entree.get("achievements") or []
        for i, ligne in enumerate(lignes):
            if not (isinstance(ligne, list) and len(ligne) >= 2):
                continue
            aid, nom = ligne[0], ligne[1]
            if len(ligne) >= 3 and ligne[2]:
                deja += 1
                continue
            hit = trouve.get(str(aid))
            if not hit:
                continue
            page, libelle = hit
            if libelle and _cle(libelle) != _cle(nom):
                divergences.append((mid, aid, nom, libelle))
                continue
            if libelle and libelle != nom:
                casse.append((mid, aid, nom, libelle))
            lignes[i] = [aid, nom, f"{page}#achievement{aid}"]
            poses += 1

    total = sum(len(e.get("achievements") or []) for e in metas.values())
    couverts = sum(
        1 for e in metas.values() for l in (e.get("achievements") or [])
        if isinstance(l, list) and len(l) >= 3 and l[2]
    )
    print(f"objectifs {total} | pages posees {poses} | deja posees {deja} | couverts {couverts}/{total}")
    print(f"metas {len(metas)} | sans capture {sans_capture} | capture sans ancre {sans_ancre}")
    for mid, nom, source in manquantes:
        print(f"  capture manquante : meta {mid} {nom} — {source}")
    for mid, aid, nom, libelle in divergences:
        print(f"  NOM DIVERGENT meta {mid} id {aid} : sources '{nom}' vs capture '{libelle}' — non pose")
    if casse:
        print(f"  {len(casse)} libelle(s) en capitales de titre cote wiki — page posee, nom API conserve")
        for mid, aid, nom, libelle in casse[:5]:
            print(f"    meta {mid} id {aid} : '{nom}' / '{libelle}'")

    if not args.ecrire:
        print("(lecture seule — relancer avec --ecrire)")
        return 0

    n = int(re.search(r"_v(\d+)", src.name).group(1)) + 1
    dest = RACINE / f"gw2_sources_v{n}.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"ecrit : {dest.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
