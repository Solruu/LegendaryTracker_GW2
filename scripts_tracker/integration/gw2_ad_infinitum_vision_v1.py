#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ad Infinitum : Vision Crystal relie sous Unbound Wings, aretes plates reduites.

Usage : python3 scripts_tracker/integration/gw2_ad_infinitum_vision_v1.py SRC DST

Accord d'Antoine (07/10/2026). La recette d'Unbound Wings (capture, et
section precurseur d'ad_infinitum.html) cite 1 Vision Crystal. Les aretes
directes `-> ad_infinitum` des materiaux T7, de l'obsidienne et du reactif
ont ete posees le 22/08 pour que le total egale l'arbre GW2Efficiency, qui
contient ce cristal : le relier sans les reduire comptait deux fois (+500
bloodstone / dragonite / empyreal, +30 obsidienne, +150 reactif ; audit
« atteint a la fois en direct et via »).

Methode, sans chiffre saisi a la main : on relie le cristal, on mesure avec
le moteur la hausse de chaque total, et on retire exactement cette hausse de
l'arete plate du meme materiau quand elle existe. Les totaux de ces
materiaux restent donc ceux de GW2Efficiency ; seuls montent les couts que
l'arbre plat n'avait pas (Augur's Stone : +20 eclats spirituels) et les
intermediaires desormais visibles (briques, lingots, etoiles, cristal).
"""
import json, sys, copy, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from moteur.gw2_moteur_v4 import Modele

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
LEG = "ad_infinitum"

avant = Modele(str(SRC)).totaux(LEG)
vc = cc["vision_crystal"]
assert "unbound_wings" not in vc["qty"]
vc["qty"]["unbound_wings"] = 1
if "unbound_wings" not in vc.setdefault("needed_for", []):
    vc["needed_for"].append("unbound_wings")
with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
    json.dump(d, f)
apres = Modele(f.name).totaux(LEG)

for cid in sorted(apres):
    hausse = apres.get(cid, 0) - avant.get(cid, 0)
    plat = (cc.get(cid) or {}).get("qty", {}).get(LEG)
    if hausse and plat is not None:
        assert 0 < hausse <= plat, (cid, hausse, plat)
        cc[cid]["qty"][LEG] = plat - hausse
        print(f"{cid}: arete plate {plat} -> {plat - hausse} (cristal : {hausse})")
    elif hausse:
        print(f"{cid}: +{hausse} (nouveau, pas d'arete plate)")

d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
