#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verification des etapes des 61 collections retrouvees par leur NOM (09/11).

Usage : python3 scripts_tracker/integration/gw2_verif_etapes_par_nom_v1.py SRC DST

Question d'Antoine : les collections dont la page n'etait retrouvee que par
son nom avaient echappe a `gw2_libelles_etapes_v2` (qui cherchait la page par
la cle). Confrontation case par case (numero de ligne du tableau, ou
`data-id=...-bit<n>` sur les pages de succes a etapes) : 621 etapes conformes,
51 etapes d'action dont le libelle est exactement le texte de la ligne, 24 sans
lien d'objet, 1 ecart : adinf_2 case 8, « Beta Fractal Capacitor (Infused) »,
pointait la page de la version NON infusee. Le lien est corrige ; rien d'autre.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
t = Path("ressources/wiki/ad_infinitum_ii_upper_bound.html").read_text(encoding="utf-8")
assert 'href="/wiki/Beta_Fractal_Capacitor_(Infused)"' in t
st = [it for it in d["legendaries"]["ad_infinitum"]["collections"]["adinf_2"]["items"] if it["bit"] == 8][0]
assert st["name"] == "Beta Fractal Capacitor (Infused)" and st["wiki"] == "Beta_Fractal_Capacitor"
st["wiki"] = "Beta_Fractal_Capacitor_(Infused)"
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("adinf_2 case 8 : lien corrige")
