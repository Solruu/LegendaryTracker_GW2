#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Petits achats d'etape : Dragonfly Steaks, Itzel Spirit Poison, Polished Aurillium (04/11).

Usage : python3 scripts_tracker/integration/gw2_petits_achats_v1.py SRC DST

Trois etapes de collection demandaient d'acheter un objet sans que son prix
soit compte. Les pages des objets (captures du 04/11) donnent le vendeur et le
prix ; chaque objet devient un composant achete (meme forme que Hydrocatalytic
Reagent), son prix passe par `qty` de la monnaie, et l'etape porte l'objet en
`cost` (meme forme que les 646 couts d'etape existants).

- Endless Summer, Radiance of the Sun God, bit 9 : Dragonfly Steaks, Cook
  Huelic ou Michotl Flycook (Michoan Marsh), 7 000 karma, seulement si la
  collection est active (dragonfly_steaks.html).
- Perfected Envoy, Envoy Armor I, bit 15 (Spirit Strings) : Itzel Spirit
  Poison, Jaka Itzel ou Xochitl, 100 Airship Part + 1 or, maitrise Itzel
  Language requise (itzel_spirit_poison.html).
- Perfected Envoy, Envoy Armor I, bit 14 (Tormented Aurillium) : Polished
  Aurillium, n'importe quel Faction Provisioner (dont Scavenger Rakatin, cite
  par l'etape), 1 Provisioner Token (polished_aurillium.html).
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
J = "2026-11-04"
C = d["craft_components"]

NOUVEAUX = {
    "dragonfly_steaks": dict(
        name="Dragonfly Steaks", apiId=107076, npc="Cook Huelic / Michotl Flycook",
        prix={"karma": 7000},
        tip={"fr": "Cook Huelic ou Michotl Flycook (Marais michéen, Province de Metrica) : 7 000 karma. "
                   "En vente seulement pendant la collection Radiance of the Sun God.",
             "en": "Cook Huelic or Michotl Flycook (Michoan Marsh, Metrica Province): 7,000 karma. "
                   "Only sold while the Radiance of the Sun God collection is active."},
        cout={"fr": "7 000 karma", "en": "7,000 karma"},
        etape=("endless_summer", "summer_sungod", 9)),
    "itzel_spirit_poison": dict(
        name="Itzel Spirit Poison", apiId=78920, npc="Jaka Itzel / Xochitl",
        prix={"airship_part": 100, "gold_coin": 1},
        tip={"fr": "Vendeur de maîtrise Itzel (Jaka Itzel, Tarir) ou Xochitl (Profondeurs Verdoyantes) : "
                   "100 Airship Part + 1 or. Maîtrise Itzel Language requise.",
             "en": "Itzel mastery vendor (Jaka Itzel, Tarir) or Xochitl (Tangled Depths): "
                   "100 Airship Part + 1 gold. Requires the Itzel Language mastery."},
        cout={"fr": "100 Airship Part + 1 or", "en": "100 Airship Part + 1 gold"},
        etape=("perfected_envoy", "envoy_1", 15)),
    "polished_aurillium": dict(
        name="Polished Aurillium", apiId=78846, npc="Faction Provisioner (Scavenger Rakatin, Bassin aurique)",
        prix={"provisioner_token": 1},
        tip={"fr": "N'importe quel Faction Provisioner, dont Scavenger Rakatin (Bassin aurique) : 1 Provisioner Token.",
             "en": "Any Faction Provisioner, including Scavenger Rakatin (Auric Basin): 1 Provisioner Token."},
        cout={"fr": "1 Provisioner Token", "en": "1 Provisioner Token"},
        etape=("perfected_envoy", "envoy_1", 14)),
}

for cid, n in NOUVEAUX.items():
    assert cid not in C, cid
    ref = f"ressources/wiki/{cid}.html, Acquisition"
    C[cid] = {
        "name": n["name"], "apiId": n["apiId"], "kind": "acquire", "farmable": True,
        "qty": {}, "needed_for": [],
        "sources": [{"type": "vendor", "npc": n["npc"], "tip": n["tip"], "cost": n["cout"],
                     "verified": True, "checked": J, "ref": ref}],
        "best": "vendor", "verified": True, "checked": J, "ref": ref,
    }
    for mon, q in n["prix"].items():
        m = C[mon]
        assert cid not in m.setdefault("qty", {}), (mon, cid)
        m["qty"][cid] = q
        nf = m.setdefault("needed_for", [])
        if cid not in nf:
            nf.append(cid)
    leg, col, bit = n["etape"]
    items = [it for it in d["legendaries"][leg]["collections"][col]["items"] if it["bit"] == bit]
    assert len(items) == 1, (leg, col, bit)
    st = items[0]
    assert "cost" not in st, (leg, col, bit, st.get("cost"))
    st["cost"] = {cid: 1}
    st["cost_ref"] = f"{ref} ; prix compte le {J}"

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(len(NOUVEAUX), "composants, 3 couts d'etape ; ecrit", DST)
