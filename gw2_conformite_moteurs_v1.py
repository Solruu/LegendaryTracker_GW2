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
"""
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from gw2_moteur_v1 import Modele  # noqa: E402

JSX = max(HERE.glob("gw2_legendary_tracker_v*.jsx"),
          key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)))


def decouper(nom: str) -> str:
    """Le corps d'une fonction de premier niveau, accolade fermante comprise."""
    txt = JSX.read_text(encoding="utf-8")
    i = txt.index(f"function {nom}(")
    j = txt.index("\n}\n", i) + 3
    return txt[i:j]


def main() -> int:
    m = Modele.dernier(HERE)
    sources = json.loads(m.chemin.read_text(encoding="utf-8"))

    harnais = """
const SOURCES_DB = SOURCES;
const ARMOR_PIECE_COUNT = 6;
const ARMOR_IDS = ["perfected_envoy","obsidian","triumphant_hero","ardent_glorious"];
const ARMOR_SLOTS = ["helm", "shoulders", "chest", "gloves", "legs", "boots"];
const ARMOR_WEIGHT_KEY = "gw2_armor_weights_v1";
const localStorage = { getItem: () => null, setItem: () => {} };
const ALT_KEY = "gw2_cad_alt_v1";
const ALT_GROUPS = SOURCES_DB?.alt_groups ?? {};
%s
%s
const cibles = CIBLES;
const out = {};
for (const c of cibles) out[c] = computeGrandTotal([c], {}).totals;
console.log(JSON.stringify(out));
""" % (decouper("readArmorWeightBySlot"), decouper("computeGrandTotal"))

    script = HERE / ".conformite.mjs"
    script.write_text(
        f"const SOURCES = {json.dumps(sources)};\n"
        f"const CIBLES = {json.dumps(m.cibles)};\n" + harnais, encoding="utf-8")
    try:
        r = subprocess.run(["node", str(script)], capture_output=True, text=True)
    finally:
        script.unlink(missing_ok=True)
    if r.returncode:
        print("le moteur JSX n'a pas tourne :")
        print(r.stderr[-2000:])
        return 2
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
    for cible in m.cibles:
        py = m.totaux(cible, surcouts=True, poids_par_emplacement=poids_par_emplacement)
        js = dict(cote_js.get(cible) or {})
        for cid in set(py) | set(js):
            a, b = py.get(cid, 0), js.get(cid, 0)
            compares += 1
            if abs(a - b) > 1e-9:
                ecarts.append((cible, cid, a, b))

    print(f"moteur Python : {m.chemin.name} | moteur JSX : {JSX.name}")
    print(f"{len(m.cibles)} cibles, {compares} totaux compares")
    print("surcouts conditionnels : calcules des deux cotes, aucun neutralise")
    if not ecarts:
        print("AUCUN ECART — les deux moteurs disent le meme nombre partout.")
        return 0
    print(f"\nECARTS : {len(ecarts)}")
    for cible, cid, a, b in sorted(ecarts, key=lambda x: -abs(x[2] - x[3]))[:40]:
        print(f"   {cible:32} {cid:28} python {a:>10}  js {b:>10}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
