#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""C4 : ingredients cites par une recette capturee et absents de l'arbre.

Usage : python3 scripts_tracker/integration/gw2_ingredients_manquants_v1.py SRC DST

Sun Bead : voie vendeur Cuadinti Astrozintli lue sur sa capture ; la monnaie
(icone) n'est pas lisible, `verified: false`.

Releve de `controle/gw2_relecture_recettes_v6` sur v368 (MANQUANT = « le cout
n'existe nulle part »). Ne sont poses ici que les ingredients dont la recette
est lue sur la capture du parent ET dont l'apiId est connu
(gw2_materials_ref.json, ou la capture pour le Sun Bead) :

  gift_of_the_sun  <- 250 Sun Bead        (endless_summer)
  opal_orb         <- 2 Opal Crystal      (Bifrost, Dreamer, Minstrel)
  olmakhan_charm   <- 50 Ley-Infused Sand, 100 Foxfire Cluster,
                      10 Fury-Scorched Stone (vision)
  unbound_wings    <- 5 Shard of Crystallized Mists Essence (ad_infinitum)

Non poses, a capturer ou a trancher : Spiritwood Focus Casing (ars_goetia),
Spirit of the Upper Bound (unbound_wings) — pas d'apiId ni de page ; les
plats d'Orrax — recettes a intermediaires cuisines sans page (decision de
palier). Testimony of Jade Heroics : ecarte volontairement (C3, voie
Castoran).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
NOUVEAUX = [
    ("sun_bead", "Sun Bead", 19717, {"gift_of_the_sun": 250}),
    ("opal_crystal", "Opal Crystal", 24521, {"opal_orb": 2}),
    ("ley_infused_sand", "Ley-Infused Sand", 83284, {"olmakhan_charm": 50}),
    ("foxfire_cluster", "Foxfire Cluster", 66933, {"olmakhan_charm": 100}),
    ("fury_scorched_stone", "Fury-Scorched Stone", 86967, {"olmakhan_charm": 10}),
    ("shard_of_crystallized_mists_essence", "Shard of Crystallized Mists Essence", 38024,
     {"unbound_wings": 5}),
]
apis = {v.get("apiId"): k for k, v in cc.items() if v.get("apiId")}
for cid, nom, api, qty in NOUVEAUX:
    assert cid not in cc and api not in apis, (cid, apis.get(api))
    for p in qty:
        assert p in cc, p
    cc[cid] = {
        "name": nom, "apiId": api, "kind": "material", "needed_for": sorted(qty),
        "farmable": True,
        "sources": [{"type": "unknown", "tip": {
            "fr": "Ingrédient posé depuis la recette du parent (C4, 04/10/2026). Voie d'obtention à lire sur sa page.",
            "en": "Ingredient added from the parent's recipe (C4, 04/10/2026). Acquisition path to read on its page."}}],
        "qty": qty, "verified": True, "checked": "2026-10-04",
        "ref": "boite Recipe de " + ", ".join(sorted(qty)) + " (ressources/wiki)"}
d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("6 ingredients poses ; ecrit", DST)
