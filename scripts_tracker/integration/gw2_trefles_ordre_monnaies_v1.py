#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Trefles dans l'ordre d'Antoine + monnaies lues dans les icones.

Usage : python3 scripts_tracker/integration/gw2_trefles_ordre_monnaies_v1.py SRC DST

1. Mystic Clover, ordre fixe par Antoine (06/10/2026) : pistes de recompense
   PvP/McM (principale) ; puis vendeurs a plafond hebdo, Coffre du Sorcier
   (plafond de saison), festivals s'ils sont actifs ; la Forge en dernier.
   `sources[]` et `cadence.sources` sont remis dans cet ordre ; la piste entre
   dans `cadence.sources` en tete, sans plafond (le debit depend du temps de
   jeu) : elle est donc listee mais hors projection, comme Lyhr et la Forge.
   ⚠ les cases cochees de l'onglet sont indexees par position : un
   reordonnancement les decale une fois, jusqu'a leur remise a zero.
2. Monnaies lues dans les attributs `alt` des icones de la capture (le texte
   seul ne les porte pas) : Sun Bead = 21 karma piece (525 les 25) ;
   INFUZ-5959 = 300 Fractal Relic + 2 po 88 pa.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
c = cc["mystic_clover"]

def cle(s):
    return (s.get("type"), s.get("npc"))
ORDRE = [("reward_track", None), ("vendor", "Manfred Njallson"), ("vendor", "BUY-4373"),
         ("vendor", "Miyani / Préposés à la Forge mystique / Gardien de la Forge"),
         ("vendor", "Dugan"), ("vendor", "Vendeur de ligue PvP"),
         ("vendor", "Coffre du Sorcier"), ("vendor", "Lyhr / Tisseuse de garde Lucirae"),
         ("mystic_forge", None)]
par = {cle(s): s for s in c["sources"]}
assert sorted(map(str, par)) == sorted(map(str, ORDRE)), par.keys()
c["sources"] = [par[k] for k in ORDRE]

cad = c["cadence"]["sources"]
lab = {s["label"]["en"]: s for s in cad}
assert "Reward tracks" not in str(lab)
piste = {"label": {"fr": "Pistes de récompense PvP / McM (voie principale)",
                   "en": "PvP / WvW reward tracks (main route)"},
         "period": "week", "cap": None,
         "cost": {"fr": "gratuit : 2 par piste répétable, 7 pour la plupart des pistes non répétables",
                  "en": "free: 2 per repeatable track, 7 for most non-repeatable tracks"},
         "verified": True, "checked": "2026-10-06", "ref": "wiki:Mystic_Clover"}
ORDRE_CAD = ["Manfred Njallson", "BUY-4373 (Fractals)", "Miyani / Forge Attendants",
             "Dugan (WvW)", "PvP league vendor", "Wizard's Vault", "Lunar New Year", "Mystic Forge"]
assert sorted(ORDRE_CAD) == sorted(lab), lab.keys()
c["cadence"]["sources"] = [piste] + [lab[k] for k in ORDRE_CAD]

sb = cc["sun_bead"]["sources"][0]
sb["cost"] = {"fr": "21 karma", "en": "21 karma"}
sb["tip"] = {"fr": "Vendu par Cuadinti Astrozintli (Forelands, Sparkfly Fen) : 21 karma l'unité, ou 525 karma le lot de 25.",
             "en": "Sold by Cuadinti Astrozintli (Forelands, Sparkfly Fen): 21 karma each, or 525 karma per 25."}
sb["verified"] = True; sb["checked"] = "2026-10-06"
inf = [s for s in cc["shard_of_crystallized_mists_essence"]["sources"] if s.get("npc") == "INFUZ-5959"][0]
inf["cost"] = {"fr": "300 Fractal Relic + 2 po 88 pa", "en": "300 Fractal Relics + 2g 88s"}
inf["tip"] = {"fr": "Vendu par INFUZ-5959 (Mistlock Observatory) pour 300 reliques fractales + 2 po 88 pa, avec la maîtrise Follows Advice.",
              "en": "Sold by INFUZ-5959 (Mistlock Observatory) for 300 Fractal Relics + 2g 88s, requires the Follows Advice mastery."}
inf["verified"] = True
d["_meta"]["last_updated"] = "2026-10-06"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
