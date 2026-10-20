#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ad Infinitum : les quatre Agony Infusions chargees aux geysers (20/10).

Usage : python3 scripts_tracker/integration/gw2_infusions_agonie_v1.py SRC DST

Les etapes « Magically Charged Infusion Sample » consomment une +4, +6, +8 puis
+10 Agony Infusion (collections I a IV). Rien ne les comptait ; la cle a plat
de 10 thermocatalytiques sur Ad Infinitum etait la seule trace de la +10
(arbre gw2efficiency). Captures du 20/10 (+1 a +10) :
- impaires : INFUZ-5959 les vend 4 de la precedente impaire + 4 pa 48 pc
  (+3 = 4 x +1, +5 = 4 x +3, +7 = 4 x +5, +9 = 4 x +7) — voie retenue, sans
  artisanat ; la recette (2 de la precedente + 1 thermocatalytique) est une
  alternative ;
- paires : seulement la recette d'Artificier (2 de l'impaire precedente + 1
  thermocatalytique).
Soit 8 / 32 / 128 / 512 x +1 et 1 thermocatalytique par palier pair. La +1
s'achete au Reliquaire fractal ou au comptoir. Les pieces de monnaie ne sont
pas posees (meme regle que les achats de collection d'Ad Infinitum).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
A = d["legendaries"]["ad_infinitum"]["collections"]
J = "2026-10-20"
W = "ressources/wiki/"
API = {n: 49423 + n for n in range(1, 11)}


def cid(n):
    return f"agony_infusion_{n}"


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = c.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


for n in range(1, 11):
    k = cid(n)
    assert k not in cc
    if n == 1:
        src = [{"type": "vendor", "npc": "Fractal Reliquary", "verified": True, "checked": J,
                "tip": {"fr": "Reliquaire fractal (contre reliques fractales), coffre du Molten Boss Fractal, et comptoir.",
                        "en": "Fractal Reliquary (for Fractal Relics), Molten Boss Fractal chest, and the trading post."},
                "ref": f"{W}1_agony_infusion.html, Acquisition"}]
    elif n % 2:
        src = [{"type": "vendor", "npc": "INFUZ-5959", "verified": True, "checked": J,
                "tip": {"fr": f"INFUZ-5959 (Observatoire de Gardebrume) : 4 × +{n-2} + 4 pa 48 pc. Alternative : recette d'Artificier, 2 × +{n-1} + 1 thermocatalytique.",
                        "en": f"INFUZ-5959 (Mistlock Observatory): 4 × +{n-2} + 4s 48c. Alternative: Artificer recipe, 2 × +{n-1} + 1 Thermocatalytic Reagent."},
                "ref": f"{W}{n}_agony_infusion.html, Sold by"}]
    else:
        src = [{"type": "craft", "verified": True, "checked": J,
                "tip": {"fr": f"Artificier (100) : 2 × +{n-1} + 1 thermocatalytique.",
                        "en": f"Artificer (100): 2 × +{n-1} + 1 Thermocatalytic Reagent."},
                "ref": f"{W}{n}_agony_infusion.html, Recipe"}]
    cc[k] = {"name": f"+{n} Agony Infusion", "apiId": API[n], "kind": "acquire" if n == 1 else "intermediate",
             "farmable": True, "qty": {}, "needed_for": [], "wiki": f"+{n}_Agony_Infusion",
             "sources": src, "verified": True, "checked": J, "ref": f"{W}{n}_agony_infusion.html"}
for n in range(3, 11):
    if n % 2:
        arete(cid(n - 2), cid(n), 4)
    else:
        arete(cid(n - 1), cid(n), 2)
        arete("thermocatalytic_reagent", cid(n), 1)
# +2 n'entre dans aucune chaine retenue (les impaires s'achetent) : posee
# quand meme, pour que sa recette soit lisible et la page reliee.
arete(cid(1), cid(2), 2)
arete("thermocatalytic_reagent", cid(2), 1)

for col, bit, n in (("adinf_1", 9, 4), ("adinf_2", 9, 6), ("adinf_3", 9, 8), ("adinf_4", 8, 10)):
    it = next(i for i in A[col]["items"] if i["bit"] == bit)
    assert "Infusion Sample" in it["name"] and f"+{n} Agony" in it["how"]["en"].replace("+ ", "+"), (col, it["name"])
    assert not it.get("cost")
    it["cost"] = {cid(n): 1}
    it["cost_ref"] = f"{W}{n}_agony_infusion.html ; étape « {it['name']} »"

th = cc["thermocatalytic_reagent"]
assert th["qty"].pop("ad_infinitum") == 10
ov = th.get("qty_overlap_verified") or []
if "ad_infinitum" in ov:
    ov.remove("ad_infinitum")
nf = th.get("needed_for")
if isinstance(nf, list) and "ad_infinitum" in nf and not any(k.split("__")[0] == "ad_infinitum" for k in th["qty"]):
    nf.remove("ad_infinitum")

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
