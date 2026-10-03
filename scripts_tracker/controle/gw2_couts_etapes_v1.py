#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Étapes de collection qui consomment une ressource que l'arbre ne compte pas.

Question d'Antoine, le 02/10 : « si une étape active demande encore des
ressources de carte (Palawadan : kralkatite), est-ce qu'elles sont prises en
compte ? »

Reponse : **non**. Une etape de collection porte son mode d'obtention en TEXTE
libre (`how`), et seules sept d'entre elles portent un `component` — qui sert a
l'inverse : rendre un composant inutile une fois l'etape validee. Rien ne dit,
nulle part, qu'une etape non faite CONSOMME 10 minerais de kralkatite.

Ce controle repere les etapes sans `component` dont le texte cite une
ressource de l'arbre. Il ne decide pas : un texte qui nomme une ressource peut
la consommer (« Collect 10 Kralkatite Ores and bring them to Yasna ») ou
seulement la mentionner (« la carte qui alimente aussi la Masse marquee »). Il
signale, la lecture tranche.

    python scripts_tracker/controle/gw2_couts_etapes_v1.py
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]

# Un nombre suivi d'un nom de ressource : la forme d'une consommation.
QUANTITE = re.compile(r"\b(\d{1,4})\s+([A-Z][A-Za-z' ]{3,40}?)(?:s\b|\b)")


def derniere(motif):
    fs = sorted(RACINE.glob(motif),
                key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    return fs[-1] if fs else None


def main():
    data = json.loads(derniere("gw2_sources_v*.json").read_text(encoding="utf-8"))
    cc = data["craft_components"]
    par_nom = {}
    for cid, c in cc.items():
        n = str(c.get("name") or "").strip().lower()
        if n:
            par_nom[n] = cid
            par_nom[n.rstrip("s")] = cid

    motifs = []
    for cid, c in cc.items():
        n = str(c.get("name") or "").strip()
        if len(n) >= 4:
            motifs.append((re.compile(r"\b(\d{1,4})\s+" + re.escape(n) + r"s?\b",
                                      re.IGNORECASE), cid))
    lignes, total = [], defaultdict(int)
    for lk, lv in sorted(data["legendaries"].items()):
        for ck, cv in sorted((lv.get("collections") or {}).items()):
            for it in (cv.get("items") or []):
                if it.get("component"):
                    continue
                h = it.get("how") or {}
                txt = h.get("en") if isinstance(h, dict) else str(h or "")
                if not txt:
                    continue
                # On part des NOMS de composants, pas d'une capture libre du
                # texte : un motif « nombre + mots » s'arretait au premier mot
                # (« 10 Kralkatite ») et ne retrouvait plus « Kralkatite Ore ».
                conso = []
                for nom, cid in motifs:
                    for m in nom.finditer(txt):
                        conso.append((cid, int(m.group(1))))
                        total[cid] += int(m.group(1))
                if conso:
                    lignes.append((lk, ck, it.get("bit"), it.get("name"), conso))

    print(f"etapes sans component qui consomment une ressource de l'arbre : {len(lignes)}")
    for lk, ck, b, nom, conso in lignes:
        print(f"  {lk:12} {ck:18} b{b:<3} {str(nom)[:34]:36} "
              + ", ".join(f"{q} {c}" for c, q in conso))
    print("\ncumul non compte, toutes cibles confondues :")
    for cid, q in sorted(total.items(), key=lambda x: -x[1]):
        print(f"  {cid:28} {q}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
