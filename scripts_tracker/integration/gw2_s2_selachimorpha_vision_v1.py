"""S2, suite : Selachimorpha par ses Gifts of Research, Volatile Magic de Vision.

Usage : python3 scripts_tracker/integration/gw2_s2_selachimorpha_vision_v1.py SRC DST

1. Selachimorpha (selachimorpha.html, « Full material list ») : « 2 Gifts of
   Research : 500 Thermocatalytic, 500 + 500 Hydrocatalytic, 500 Exotic
   Essence of Luck ». Les cles a plat recopiaient les deux premiers et
   oubliaient l'essence. On pose 2 x gift_of_research (recette capturee :
   250 / 500 / 250) et on retire les deux cles : +500 Exotic Essence of Luck,
   le reste inchange.
2. Vision : les 3 000 Volatile Magic de `vision__onetime` sont les six armes
   Dragonsblood exigees par la collection (vision.html : « Volatile Magic x
   3000 in total for weapon recipes »), distinctes des Olmakhan Latigo Straps
   de la chaine -> `qty_overlap_verified`.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
JOUR = "2026-10-14"

for cid, v in (("thermocatalytic_reagent", 500), ("hydrocatalytic_reagent", 1000)):
    assert cc[cid]["qty"].get("selachimorpha") == v, cid
    del cc[cid]["qty"]["selachimorpha"]
    ov = cc[cid].get("qty_overlap_verified")
    if ov and "selachimorpha" in ov:
        ov.remove("selachimorpha")
gr = cc["gift_of_research"]
assert "selachimorpha" not in gr["qty"]
gr["qty"]["selachimorpha"] = 2
nf = gr.setdefault("needed_for", [])
if "selachimorpha" not in nf:
    nf.append("selachimorpha")

vm = cc["volatile_magic"]
ov = vm.setdefault("qty_overlap_verified", [])
if "vision" not in ov:
    ov.append("vision")
vm["qty_overlap_note"] = {
    "fr": "Vision : 3 000 pour les six armes Dragonsblood exigées par la collection (vision.html), en plus des Olmakhan Latigo Straps de la chaîne — deux nœuds distincts.",
    "en": "Vision: 3,000 for the six Dragonsblood weapons required by the collection (vision.html), on top of the chain's Olmakhan Latigo Straps — two distinct nodes."}
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("Selachimorpha : 2 Gifts of Research ; Vision : chevauchement declare")
