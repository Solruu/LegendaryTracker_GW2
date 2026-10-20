#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Comptoir : raccourci signale, jamais voie par defaut (20/10).

Usage : python3 scripts_tracker/integration/gw2_comptoir_v1.py SRC DST

Decision d'Antoine (20/10) : tout se compte par les voies de jeu (collections
comprises) ; l'or et le comptoir sont un raccourci possible mais pas souhaite.
Une mention « achetable au comptoir » doit en revanche separer les composants
lies au compte des autres, pour savoir si un raccourci existe.

Structure existante : une source de type `trading_post` (l'audit range deja
« tp » et « trading_post » ensemble, `check_tp_last`). Aucune nouvelle cle par
composant. Lecture du 20/10 : /v2/commerce/prices sur les 888 apiId des
composants (ressources/api/comptoir_20261020.json) — un id present est vendable.

1. « tp » devient « trading_post » (une seule orthographe).
2. Source comptoir ajoutee, en dernier et `paid_repeatable`, aux composants
   vendables qui n'en avaient pas ; celles qui existaient passent aussi en
   `paid_repeatable` et en derniere position.
3. Sources comptoir retirees des 8 composants que l'API ne liste pas (lies au
   compte) : leur « Buy on TP » etait faux.
4. `best` ne vaut plus jamais le comptoir : Memory of Battle -> McM, Shard of
   Glory -> JcJ, Pile of Lucent Crystal -> raffinage, Auric Ingot -> artisanat
   ou vendeur.
5. `_meta.comptoir` : date, reference et ids absents de l'API. Un composant a
   apiId d'objet (> 100, hors absents) sans source comptoir est lie au compte.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-20"
REF = "ressources/api/comptoir_20261020.json"
snap = json.loads(Path(REF).read_text(encoding="utf-8"))
TP = set(snap["au_comptoir"])
INCONNUS = set(snap["inconnus_api"])
COMPTOIR = {"tp", "trading_post"}
LIES = ["vision_crystal", "trade_contract", "exotic_essence_of_luck", "chak_egg", "auric_ingot",
        "reclaimed_metal_plate", "memories_of_aurene", "crystalline_ingot"]
BEST = {"memory_of_battle": "wvw", "shard_of_glory": "pvp",
        "pile_of_lucent_crystal": "auto_refine", "auric_ingot": "craft_or_vendor"}

ajoutes = retires = 0
for k, c in cc.items():
    srcs = c.get("sources")
    if not isinstance(srcs, list):
        continue
    for s in srcs:
        if isinstance(s, dict) and s.get("type") == "tp":
            s["type"] = "trading_post"
    a = c.get("apiId")
    objet = isinstance(a, int) and a > 100 and a not in INCONNUS
    tps = [s for s in srcs if isinstance(s, dict) and s.get("type") == "trading_post"]
    if objet and a not in TP and tps:
        assert k in LIES, k
        c["sources"] = [s for s in srcs if s not in tps]
        retires += len(tps)
        continue
    if objet and a in TP:
        if not tps:
            tps = [{"type": "trading_post",
                    "tip": {"fr": "Achetable au comptoir — raccourci en or, jamais compté.",
                            "en": "Sold on the trading post — a gold shortcut, never counted."}}]
            ajoutes += 1
        for s in tps:
            s["paid_repeatable"] = True
            s.setdefault("verified", True)
            s["checked"] = J
            s["ref"] = f"{REF} (/v2/commerce/prices)"
        c["sources"] = [s for s in srcs if s not in tps] + tps
for k in LIES:
    assert not any(s.get("type") == "trading_post" for s in cc[k]["sources"]), k
for k, b in BEST.items():
    assert cc[k].get("best") in COMPTOIR, (k, cc[k].get("best"))
    assert any(s.get("type") == b for s in cc[k]["sources"]), (k, b)
    cc[k]["best"] = b
for k, c in cc.items():
    assert c.get("best") not in COMPTOIR, k

d["_meta"]["comptoir"] = {
    "checked": J, "verified": True, "ref": REF,
    "regle": {"fr": "Un composant a apiId d'objet (> 100) sans source `trading_post` est lié au compte, sauf ids absents de l'API (`inconnus_api`).",
              "en": "A component with an item apiId (> 100) and no `trading_post` source is account bound, except ids missing from the API (`inconnus_api`)."},
    "inconnus_api": sorted(INCONNUS)}
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST, "| ajoutees", ajoutes, "| retirees", retires)
