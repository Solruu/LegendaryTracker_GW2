#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""W4 : trois couts vendeur lus sur des pages deja au depot, + deux noms reels.

Usage : python3 scripts_tracker/integration/gw2_couts_vendeur_w4_v1.py SRC DST

ARBITRAGES § COUT VENDEUR signalait ces cas ; les pages tranchent, chacune
n'ayant QU'UNE voie d'obtention (pas de recette, pas de conteneur) :
- Gift of Adventure (Selachimorpha) : 2 Vision Crystal + 55 trefles + 100 Tales
  of Adventure + 500 Unusual Coin chez les vendeurs de Castora. Les trois
  derniers etaient poses, les 2 cristaux manquaient (leur contenu, lui, etait
  deja dans les aretes plates de l'arbre : retire d'autant, voir plus bas).
- Binding of the Dragon (Orrax) : 25 Dragonite Ore + 22 500 karma + 5 or.
  Aucun cout n'etait pose.
- Olmakhan Latigo Strap (Vision, fanion et bandoulieres) : 250 Volatile Magic
  chez Ethall (Sandswept Isles), 300 chez les quatre autres vendeurs. On compte
  250 : le minimum, comme pour l'alliage titan (A1, 04/10).
Noms reels (titre de la page, comme Ascended Shard of Glory le 06/10) :
Tribute to the Exitare, Tribute to the Call of the Void. Id et apiId inchanges.
"""
import json, sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from moteur.gw2_moteur_v4 import Modele

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
def t(fr, en): return {"fr": fr, "en": en}
def prov(f): return {"verified": True, "checked": "2026-10-08",
                     "ref": f"ressources/wiki/{f}.html, Acquisition"}
def arete(e, p, n):
    q = cc[e].setdefault("qty", {}); assert p not in q, (e, p); q[p] = n
    nf = cc[e].setdefault("needed_for", [])
    if p not in nf: nf.append(p)

avant = Modele(str(SRC)).totaux("selachimorpha")
arete("vision_crystal", "gift_of_adventure", 2)
# Comme Ad Infinitum (07/10) : les aretes plates de Selachimorpha (arbre
# GW2Efficiency mis a plat) portent deja les deux cristaux — 1 000 bloodstone,
# dragonite, empyreal = 2 x 500. On retire exactement la hausse mesuree par le
# moteur de l'arete plate du meme materiau ; les totaux restent ceux de l'arbre.
with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
    json.dump(d, f)
apres = Modele(f.name).totaux("selachimorpha")
for cid in sorted(apres):
    h = apres.get(cid, 0) - avant.get(cid, 0)
    plat = (cc.get(cid) or {}).get("qty", {}).get("selachimorpha")
    if h and plat is not None:
        assert 0 < h <= plat, (cid, h, plat)
        if plat - h:
            cc[cid]["qty"]["selachimorpha"] = plat - h
        else:  # entierement porte par les cristaux : l'arete plate disparait
            del cc[cid]["qty"]["selachimorpha"]
            cc[cid]["needed_for"] = [x for x in cc[cid].get("needed_for", []) if x != "selachimorpha"]
            ovl = cc[cid].get("qty_overlap_verified")
            if ovl and "selachimorpha" in ovl:
                ovl.remove("selachimorpha")
        print(f"selachimorpha {cid}: arete plate {plat} -> {plat - h}")
ga = cc["gift_of_adventure"]
ga["sources"] = [{"type": "vendor", "npc": "vendeurs de Castora (Canach, Alliance Field Quartermaster...)", "tip": t(
    "Seule voie : vendeurs de Castora, 2 Vision Crystal + 55 trèfles mystiques + 100 Tales of Adventure + 500 Unusual Coin.",
    "Only route: Castora vendors, 2 Vision Crystals + 55 Mystic Clovers + 100 Tales of Adventure + 500 Unusual Coins."),
    **prov("gift_of_adventure")}]

for cid, n in (("dragonite_ore", 25), ("karma", 22500), ("gold_coin", 5)):
    arete(cid, "binding_of_the_dragon", n)
bd = cc["binding_of_the_dragon"]
bd["sources"] = [{"type": "vendor", "npc": "Gharr Leadclaw / Portable Wizard's Tower Exchange", "tip": t(
    "Seule voie : 25 Dragonite Ore + 22 500 karma + 5 or, après le succès Unknown Nightmares: Experiments in the Shadows.",
    "Only route: 25 Dragonite Ore + 22,500 karma + 5 gold, after the Unknown Nightmares: Experiments in the Shadows achievement."),
    **prov("binding_of_the_dragon")}]

arete("volatile_magic", "olmakhan_latigo_strap", 250)
ol = cc["olmakhan_latigo_strap"]
ol["sources"] = [{"type": "vendor", "npc": "Ethall (Atholma, Sandswept Isles)", "cost": t("250 magie volatile", "250 Volatile Magic"),
    "tip": t("Seule voie : vendeurs, 250 magie volatile chez Ethall (Sandswept Isles), 300 chez Kynon, Nalar, l'intendant olmakhan et Trader Hyacinth. Le tracker compte 250.",
             "Only route: vendors, 250 Volatile Magic from Ethall (Sandswept Isles), 300 from Kynon, Nalar, the Olmakhan Quartermaster and Trader Hyacinth. The tracker counts 250."),
    **prov("olmakhan_latigo_strap")}]

for cid, nom in (("tribute_to_exitare", "Tribute to the Exitare"),
                 ("tribute_to_call_of_the_void", "Tribute to the Call of the Void")):
    cc[cid]["name"] = nom
d["_meta"]["last_updated"] = "2026-10-08"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
