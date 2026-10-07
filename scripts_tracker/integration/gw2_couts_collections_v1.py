#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""C5 : `qty_extras` et `karma_budget` deviennent des `cost` d'etape (accord d'Antoine, 07/10/2026).

Usage : python3 scripts_tracker/integration/gw2_couts_collections_v1.py SRC DST

Un meme fait — « cette etape de collection consomme N objets tant qu'elle
n'est pas faite » — vivait dans TROIS structures :
  - `cost` sur l'etape (Henge, Astral : 25 etapes) ;
  - `qty_extras` sur le composant (5 composants, Aurora) ;
  - `karma_budget` sur Aurora I (le karma, recopie une troisieme fois, lu par
    l'audit seul).
Les deux dernieres passent dans la premiere : chaque entree devient un `cost`
sur l'etape visee (sous-collection d'Aurora I, ou Aurora II), avec sa
reference dans `cost_ref`. Puis `qty_extras` et `karma_budget` disparaissent.
Les references et le statut non verifie (coeurs de Draconis Mons) sont
reportes dans `cost_ref`.

Les surcouts de rubis, jade et perles (+50, +100, +200) n'etaient appliques
que la ou le composant portait une cle a plat `aurora` — il n'en avait pas :
l'onglet du legendaire les affichait, le grand total les ignorait. Ils
comptent desormais partout. Le karma, seul a porter `aurora: 0`, ne bouge pas.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
aur = d["legendaries"]["aurora"]["collections"]
subs = aur["aurora_1"]["subcollections"]
kb = aur["aurora_1"].pop("karma_budget")

def ref_karma(sub, bit):
    for l in kb["lines"]:
        if l.get("sub") == sub and (l.get("bit") == bit or bit in (l.get("bits") or [])):
            r = l.get("ref", "")
            if l.get("verified") is False:
                r += " — NON VERIFIE"
            return r
    raise KeyError((sub, bit))

# Spark of Sentience est la RECOMPENSE d'Aurora II, dont les 21 etapes
# consomment chacune un lingot d'electrum Xunlai. L'arete
# `xunlai -> spark_of_sentience : 21` (arbre GW2Efficiency) et l'entree
# `qty_extras` du lingot disaient la meme chose deux fois — sans se voir, parce
# que le surcout ne s'appliquait qu'aux cles a plat. Le cout passe sur les
# etapes ; l'arete part, sinon les 21 lingots compteraient double.
xu = cc["xunlai_electrum_ingot"]
assert xu["qty"].pop("spark_of_sentience") == 21
xu["needed_for"] = [x for x in xu.get("needed_for", []) if x != "spark_of_sentience"]

poses = 0
for cid in sorted(cc):
    extras = cc[cid].pop("qty_extras", None)
    if not extras:
        continue
    for x in extras:
        assert x["legendary"] == "aurora", (cid, x)
        col = subs.get(x["sub"]) or aur[x["sub"]]
        items = {i["bit"]: i for i in col["items"]}
        bits, n = (x["bits"], x["amountPer"]) if isinstance(x.get("bits"), list) else ([x["bit"]], x["amount"])
        for b in bits:
            it = items[b]
            cout = it.setdefault("cost", {})
            assert cid not in cout, (cid, x["sub"], b)
            cout[cid] = n
            r = ref_karma(x["sub"], b) if cid == "karma" else (x.get("ref") or "")
            lab = (x.get("label") or {}).get("fr") or ""
            ligne = f"{cid} : {lab}" + (f" ({r})" if r else "")
            it["cost_ref"] = (it["cost_ref"] + " ; " + ligne) if it.get("cost_ref") else ligne
            poses += 1

d["_meta"]["last_updated"] = "2026-10-07"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{poses} couts d'etape poses ; qty_extras et karma_budget retires ; ecrit {DST}")
