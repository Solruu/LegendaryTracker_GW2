#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fait tourner les DEUX moteurs sur les memes sources et compare tout.

Le calcul est ecrit deux fois et doit le rester : le moteur Python sert les
outils de donnees, le moteur JSX se refait a chaque clic dans le navigateur.
Ce qui ne doit pas rester, c'est qu'ils puissent diverger sans que rien ne le
dise — la cascade avait deja diverge dans DIX implementations, dont deux qui
ignoraient `alt_groups` en ecrivant la donnee.

Ce test n'unifie pas les deux moteurs. Il les CONFRONTE : pour chaque cible,
pour chaque composant, il exige le meme nombre des deux cotes. Une divergence
tombe en rouge le jour ou elle apparait, pas trois versions plus tard.

COMMENT LE MOTEUR JSX EST APPELE. On decoupe `computeGrandTotal` du fichier
JSX — la vraie fonction, pas une copie — et on l'evalue dans node avec des
bouchons pour ce que le navigateur fournit : `SOURCES_DB`, `localStorage`, et
les deux constantes d'armure. Decouper plutot que recopier est le point : une
copie deriverait, exactement comme les dix autres.

CE QUE MON PREMIER JET FAISAIT DE FAUX. `qty_extras` porte des surcouts qui
dependent des etapes de collection validees, un etat de navigateur. J'ai
d'abord voulu les retirer du cote JSX avant de comparer. C'etait faux : leur
effet SE PROPAGE dans la cascade, et les retirer du seul composant qui les
porte laissait 1 050 lingots de mithril d'ecart sur Aurora, par une chaine de
quatre niveaux. Le moteur Python les calcule donc lui aussi, avec la meme
regle, et on compare les deux totaux entiers sans rien neutraliser.

v3 : `qty_extras` n'existe plus. Ces couts sont des `cost` d'etape, y compris
dans les sous-collections d'Aurora I, lus des deux cotes par une seule
fonction (`etapesCollections` en JSX, `Modele._etapes` en Python). Une
troisieme situation valide toutes les etapes qui portent un cout, sous-
collections comprises : sans elle, deux moteurs d'accord a collections
vierges pourraient diverger des le premier sanctuaire infuse.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]  # racine du depot
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from moteur.courant import Modele  # noqa: E402

JSX = max(HERE.glob("gw2_legendary_tracker_v*.jsx"),
          key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)))


def decouper(nom: str) -> str:
    """Le corps d'une fonction de premier niveau, accolade fermante comprise."""
    txt = JSX.read_text(encoding="utf-8")
    i = txt.index(f"function {nom}(")
    j = txt.index("\n}\n", i) + 3
    return txt[i:j]


def situations(m):
    """Les etats de collections a confronter.

    v2 : la regle « une etape validee satisfait son composant » ne se voit que
    si on COCHE des etapes. Le test ne comparait que des collections vierges,
    donc il aurait laisse passer deux moteurs d'accord sur zero et en desaccord
    des la premiere case cochee. On rejoue donc tout le jeu de cibles une
    seconde fois, toutes les etapes portant `component` validees.
    """
    faites = {}
    for leg in m.legendaires.values():
        for cle, col in (leg.brut.get("collections") or {}).items():
            bits = [it.get("bit") for it in (col.get("items") or [])
                    if isinstance(it, dict) and it.get("component")
                    and it.get("bit") is not None]
            if bits:
                faites[cle] = {"bits": sorted(bits)}
    payees = {}
    for leg in m.legendaires.values():
        for cle, col in (leg.brut.get("collections") or {}).items():
            if not isinstance(col, dict):
                continue
            bits = [it.get("bit") for it in (col.get("items") or [])
                    if isinstance(it, dict) and it.get("cost")]
            if bits:
                payees[cle] = {"bits": sorted(bits)}
            subs = col.get("subcollections") or {}
            if isinstance(subs, dict):
                for sk, sub in subs.items():
                    # un bit sur deux : on veut un etat MELE, pas tout ou rien
                    sb = [it.get("bit") for it in (sub.get("items") or [])
                          if isinstance(it, dict) and it.get("cost")][::2]
                    if sb:
                        payees[sk] = {"bits": sorted(sb)}
    return [("collections vierges", {}),
            ("etapes reliees a un composant validees", faites),
            ("etapes a cout validees (sous-collections comprises)", payees)]


def main() -> int:
    m = Modele.dernier(HERE)
    sources = json.loads(m.chemin.read_text(encoding="utf-8"))
    total_compares, total_ecarts = 0, []
    # v4 : les pieces d'armure restantes passent par le moteur (JSX v258,
    # moteur v5). On rejoue chaque situation avec un set entame — 2 pieces
    # restantes sur 6, et 0 pour une armure finie — pour que les deux moteurs
    # soient compares hors du cas plein, ou le prorata est neutre.
    entame = {"perfected_envoy": 2, "obsidian": 2, "triumphant_hero": 5,
              "ardent_glorious": 0}
    jeux = [(nom, faites, None) for nom, faites in situations(m)]
    jeux += [(nom + " / sets entames", faites, entame)
             for nom, faites in situations(m)]
    for nom, faites, pieces in jeux:
        n, e = une_passe(m, sources, faites, pieces)
        print(f"  {nom} : {n} totaux compares, {len(e)} ecart(s)")
        total_compares += n
        total_ecarts += [(nom,) + x for x in e]
    # v5 : chaque collection seule (`perimetre`), sur les trois situations.
    perims = [(l.id, [cle]) for l in m.legendaires.values()
              for cle in (l.brut.get("collections") or {})]
    for nom, faites in situations(m):
        n, e = une_passe(m, sources, faites, None, perims)
        print(f"  {nom} / par collection ({len(perims)}) : {n} totaux compares, {len(e)} ecart(s)")
        total_compares += n
        total_ecarts += [(nom + " / perimetre",) + x for x in e]
    print(f"moteur Python : {m.chemin.name} | moteur JSX : {JSX.name}")
    print(f"{len(m.cibles)} cibles, {total_compares} totaux compares")
    print("couts d'etape : calcules des deux cotes, sous-collections comprises")
    if not total_ecarts:
        print("AUCUN ECART — les deux moteurs disent le meme nombre partout.")
        return 0
    print(f"\nECARTS : {len(total_ecarts)}")
    for nom, cible, cid, a, b in sorted(total_ecarts,
                                        key=lambda x: -abs(x[3] - x[4]))[:40]:
        print(f"   [{nom}] {cible:28} {cid:26} python {a:>10}  js {b:>10}")
    return 1


def une_passe(m, sources, faites, pieces=None, perimetres=None) -> tuple:
    """`perimetres` (v5) : [(cible, [cle])] — chaque collection seule, moteur
    restreint a ses `cost` (`perimetre`, moteur v6 / JSX v261)."""

    harnais = """
const SOURCES_DB = SOURCES;
const ARMOR_PIECE_COUNT = 6;
const ARMOR_IDS = ["perfected_envoy","obsidian","triumphant_hero","ardent_glorious"];
const ARMOR_SLOTS = ["helm", "shoulders", "chest", "gloves", "legs", "boots"];
const ARMOR_WEIGHT_KEY = "gw2_armor_weights_v1";
const localStorage = { getItem: () => null, setItem: () => {} };
const ALT_KEY = "gw2_cad_alt_v1";
const ALT_GROUPS = SOURCES_DB?.alt_groups ?? {};
const SOURCES_ALIAS = { prismatic: "prismatic_champions_regalia", upgrades: "upgrades_combined" };
%s
%s
%s
const cibles = CIBLES;
const out = {};
if (PERIM) { for (const [c, p] of PERIM) out[c + "|" + p.join(",")] = computeGrandTotal([c], COLLS, PIECES ?? undefined, p).totals; }
else for (const c of cibles) out[c] = computeGrandTotal([c], COLLS, PIECES ?? undefined).totals;
console.log(JSON.stringify(out));
""" % (decouper("readArmorWeightBySlot"), decouper("etapesCollections"), decouper("computeGrandTotal"))

    script = HERE / ".conformite.mjs"
    script.write_text(
        f"const SOURCES = {json.dumps(sources)};\n"
        f"const CIBLES = {json.dumps(m.cibles)};\n"
        f"const COLLS = {json.dumps(faites)};\n"
        f"const PIECES = {json.dumps(pieces)};\n"
        f"const PERIM = {json.dumps(perimetres)};\n" + harnais, encoding="utf-8")
    try:
        r = subprocess.run(["node", str(script)], capture_output=True, text=True)
    finally:
        script.unlink(missing_ok=True)
    if r.returncode:
        print("le moteur JSX n'a pas tourne :")
        print(r.stderr[-2000:])
        return 0, [("node", "n/a", 0, 0)]
    cote_js = json.loads(r.stdout)

    # Les surcouts conditionnels sont desormais dans le moteur Python, avec la
    # meme regle que le JSX : on compare donc les deux totaux entiers, sans rien
    # neutraliser. Les neutraliser etait faux — leur effet se propage dans la
    # cascade, et les retirer du seul composant qui les porte laissait passer
    # 1 050 lingots de mithril d'ecart sur Aurora.
    # Les 6 emplacements d'un set d'armure sans choix explicite comptent tous
    # "light" par defaut cote JSX (readArmorWeightCounts) : meme defaut ici,
    # pour comparer des totaux qui representent la meme situation reelle.
    # Les 6 emplacements d'un set d'armure sans choix explicite valent tous
    # "light" par defaut cote JSX (readArmorWeightBySlot) : meme defaut ici,
    # pour comparer des totaux qui representent la meme situation reelle.
    ARMOR_SLOTS = ("helm", "shoulders", "chest", "gloves", "legs", "boots")
    poids_defaut = {s: "light" for s in ARMOR_SLOTS}
    poids_par_emplacement = {a: dict(poids_defaut) for a in
                              ("perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious")}
    ecarts, compares = [], 0
    for cible, perim in (perimetres or [(c, None) for c in m.cibles]):
        py = m.totaux(cible,
                      collections_faites=faites,
                      poids_par_emplacement=poids_par_emplacement,
                      pieces_restantes=pieces, perimetre=perim)
        js = dict(cote_js.get(cible + "|" + ",".join(perim) if perim else cible) or {})
        for cid in set(py) | set(js):
            a, b = py.get(cid, 0), js.get(cid, 0)
            compares += 1
            # Le JSX arrondit ses totaux au centieme en sortie : un prorata
            # n/6 tombe alors a 0,005 pres, pas a 1e-9.
            if abs(a - b) > 0.005 + 1e-9:
                ecarts.append((cible, cid, a, b))

    return compares, ecarts


if __name__ == "__main__":
    sys.exit(main())
