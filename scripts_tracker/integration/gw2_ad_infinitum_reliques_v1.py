#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ad Infinitum : les 4 650 Fractal Relics rendues a leurs etapes (S2, 19/10).

Usage : python3 scripts_tracker/integration/gw2_ad_infinitum_reliques_v1.py SRC DST

Accord d'Antoine (19/10) sur la proposition de PLAN_RESTANT_v49 § S2.

1. Le Gift of Ascension coute 500 Fractal Relics + 25 pa 20 pc chez BUY-4373
   (gift_of_ascension.html, Sold by). L'arete `fractal_relic` -> Gift valait
   4 650 : elle recopiait tout le budget de reliques du legendaire. Elle vaut
   desormais 500.
2. Les quatre Gifts : 1 dans la recette du legendaire (arete existante), 2 dans
   l'etape « Beta Fractal Capacitor (Infused) » d'Ad Infinitum II, 1 dans
   l'etape « Fractal Capacitor » d'Ad Infinitum III (textes de ces etapes et
   « Used in » du Gift). Les trois derniers sont un `cost` d'etape : deduits
   quand l'etape est faite.
3. Les achats vendeur des quatre collections deviennent des `cost` d'etape,
   relevees sur les captures (icone de monnaie lue) :
   reliques 100 + 1 350 / 200 / 400 / 600 = 2 650 ;
   reliques immaculees 20 / 30 / 40 / 50 = 140 (la cle a plat 140 sort).
   Les pieces d'argent (80 pa par achat, 21 pa 12 pc) ne sont pas posees.
4. Les deux etapes de Forge portent aussi leurs autres ingredients, seulement
   ceux COMMUNS aux voies (meme regle que gw2_edges_wiki v3) : II = 1 Vial of
   Condensed Mists Essence + 1 Glob of Coagulated Mists Essence + 250 ectos
   (40 Mystic Crystal OU 240 Philosopher's Stone : alternative, non chiffree) ;
   III = 1 Shard of Crystallized Mists Essence + 250 ectos. Les 500 ectos
   sortent de la cle a plat (510 -> 10, reste Bound Wings).
5. Les aretes ecto / ecu / poussiere -> Glob of Coagulated Mists Essence
   sont une recette de PROMOTION (boite « Type Promotion ») : retirees, le
   glob reste feuille (regle C7). Elles ne pesaient rien tant que le glob
   n'etait demande nulle part.
6. Les cles a plat dragonite / empyreal / bloodstone (1 000) et obsidienne (60)
   sont verifiees sur l'export gw2efficiency : deux Vision Crystals, celui de
   Finite Wings (Finite Result) et celui de Bound Wings (Upper Bound), que le
   tracker ne decompose pas. Declarees en chevauchement, comme les 3 Pristine
   Mist Essence des memes precurseurs.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
cols = d["legendaries"]["ad_infinitum"]["collections"]
JOUR = "2026-10-19"
LEG = "ad_infinitum"
CAP = {"adinf_1": "ad_infinitum_i_finite_result", "adinf_2": "ad_infinitum_ii_upper_bound",
       "adinf_3": "ad_infinitum_iii_unbound", "adinf_4": "legendary_backpack_ad_infinitum"}


def etape(col, bit, nom):
    it = next(x for x in cols[col]["items"] if x.get("bit") == bit)
    assert it["name"].startswith(nom), (col, bit, it["name"])
    return it


def pose(col, bit, nom, cout):
    it = etape(col, bit, nom)
    assert not it.get("cost"), (col, bit)
    it["cost"] = cout
    it["cost_ref"] = f"ressources/wiki/{CAP[col]}.html, tableau « Collection items » (lu le {JOUR[8:]}/10)"


# 3. achats vendeur
pose("adinf_1", 0, "Defender of Ascalon", {"pristine_fractal_relic": 20})
pose("adinf_1", 1, "Charr-Nip", {"fractal_relic": 100})
pose("adinf_1", 8, "Prototype Fractal Capacitor", {"fractal_relic": 1350})
pose("adinf_2", 0, "Dredge Spiral Drill", {"pristine_fractal_relic": 30})
pose("adinf_2", 1, "Glob of Molten Fire", {"fractal_relic": 200})
pose("adinf_3", 0, "Inquest Dragon Energy", {"pristine_fractal_relic": 40})
pose("adinf_3", 1, "Essence of Subject 2", {"fractal_relic": 400})
pose("adinf_4", 0, "Aetherblade Pirate Eye Patch", {"pristine_fractal_relic": 50})
pose("adinf_4", 1, "Aetherblade Airship Steering Wheel", {"fractal_relic": 600})

# 4. etapes de Forge (2 + 1 Gifts of Ascension)
VIAL = "vial_of_condensed_mists_essence"
ref = json.loads(Path("gw2_materials_ref.json").read_text(encoding="utf-8"))["flat"]
assert VIAL not in cc and ref.get("38014") == "Vial of Condensed Mists Essence"
cc[VIAL] = {
    "name": "Vial of Condensed Mists Essence", "apiId": 38014, "kind": "material",
    "farmable": True, "qty": {}, "needed_for": [],
    "sources": [{"type": "unknown",
                 "tip": {"fr": "Page non capturée : voie d'obtention à lire sur Vial_of_Condensed_Mists_Essence.",
                         "en": "Page not captured: acquisition path to read on Vial_of_Condensed_Mists_Essence."},
                 "verified": False, "checked": JOUR,
                 "ref": "ressources/wiki/ad_infinitum_ii_upper_bound.html (ingrédient de l'étape Beta Fractal Capacitor)"}],
    "ref": "gw2_materials_ref.json (id 38014)", "verified": False, "checked": JOUR,
}
pose("adinf_2", 8, "Beta Fractal Capacitor", {
    "gift_of_ascension_fractal": 2, VIAL: 1,
    "glob_of_coagulated_mists_essence": 1, "glob_of_ectoplasm": 250})
etape("adinf_2", 8, "Beta")["cost_note"] = {
    "fr": "Deux passages en Forge : Prototype (Élevé) puis Bêta (Infusé), un Don d'ascension chacun. Le premier demande en plus 40 Cristaux mystiques OU 240 Pierres philosophales : voies concurrentes, non chiffrées.",
    "en": "Two Mystic Forge passes: Prototype (Ascended) then Beta (Infused), one Gift of Ascension each. The first also takes 40 Mystic Crystals OR 240 Philosopher's Stones: competing paths, not costed."}
pose("adinf_3", 8, "Fractal Capacitor", {
    "gift_of_ascension_fractal": 1, "shard_of_crystallized_mists_essence": 1,
    "glob_of_ectoplasm": 250})

# 1. le Gift a son prix
fr = cc["fractal_relic"]
assert fr["qty"] == {"gift_of_ascension_fractal": 4650}, fr["qty"]
fr["qty"] = {"gift_of_ascension_fractal": 500}
fr["needed_for"] = ["gift_of_ascension_fractal"]
bd = fr["breakdown"][LEG]
bd["lines"] = [l.replace("500 reliques + 25 immaculées + 20 po chacun, soit 2 000 reliques, 100 immaculées et 80 po",
                         "500 reliques + 25 pa 20 pc chacun, soit 2 000 reliques")
               for l in bd["lines"]]
bd["lines"].append("Depuis le 19/10 : 500 sur l'arête du Don, le reste en coût des étapes (vendeurs des 4 collections, 3 Dons des étapes de Forge des collections II et III).")
bd["checked"] = JOUR
g = cc["gift_of_ascension_fractal"]
for s in g["sources"]:
    if s.get("npc") == "BUY-4373":
        s["tip"] = {"fr": "500 Fractal Relics + 25 pa 20 pc chez BUY-4373.",
                    "en": "500 Fractal Relics + 25s 20c from BUY-4373."}
        s["ref"] = "ressources/wiki/gift_of_ascension.html, Sold by"
        s["verified"] = True; s["checked"] = JOUR
g["note"] = {"fr": "4 Dons pour Ad Infinitum : 1 dans la recette, 2 à l'étape Beta Fractal Capacitor (collection II), 1 à l'étape Fractal Capacitor (collection III).",
             "en": "4 Gifts for Ad Infinitum: 1 in the recipe, 2 at the Beta Fractal Capacitor step (collection II), 1 at the Fractal Capacitor step (collection III)."}

pr = cc["pristine_fractal_relic"]
assert pr["qty"].pop(LEG) == 140
pr["needed_for"] = [x for x in pr.get("needed_for", []) if x != LEG]
pr["breakdown"][LEG]["total"] = 140
pr["breakdown"][LEG]["lines"] = ["20 / 30 / 40 / 50 aux quatre collections (BUY-2046 PFR), coût des étapes depuis le 19/10. Le Don d'ascension se paie en pièces, pas en reliques immaculées (gift_of_ascension.html)."]
pr["breakdown"][LEG]["checked"] = JOUR
pr.get("qty_conflict", {}).pop(LEG, None)
if not pr.get("qty_conflict"):
    pr.pop("qty_conflict", None)

# 4 bis. ectos
ec = cc["glob_of_ectoplasm"]
assert ec["qty"][LEG] == 510
ec["qty"][LEG] = 10
ec["qty_note"]["fr"] += " Ad Infinitum (19/10) : les 2 × 250 des condensateurs fractals sont un coût d'étape (collections II et III) ; reste 10, ceux de Bound Wings (Upper Bound, absent du tracker)."
ec["qty_note"]["en"] += " Ad Infinitum (19/10): the 2 × 250 for the fractal capacitors are a step cost (collections II and III); 10 remain, those of Bound Wings (Upper Bound, not in the tracker)."

# 5. promotion : les trois aretes vers le glob (ecto, ecu, poussiere)
for cid in ("glob_of_ectoplasm", "mystic_coin", "dust_crystalline"):
    assert cc[cid]["qty"].pop("glob_of_coagulated_mists_essence") == 1, cid
    nf = cc[cid].get("needed_for")
    if isinstance(nf, list) and "glob_of_coagulated_mists_essence" in nf:
        nf.remove("glob_of_coagulated_mists_essence")

# 6. chevauchements
NOTE = {"fr": "Ad Infinitum : {n} sous chacun des deux Vision Crystals des précurseurs Finite Result (Finite Wings) et Upper Bound (Bound Wings), absents du tracker (clé à plat), + {c} par la chaîne Unbound Wings — export gw2efficiency lu en hiérarchie, vérifié le 19/10.",
        "en": "Ad Infinitum: {n} under each of the two Vision Crystals of the Finite Result (Finite Wings) and Upper Bound (Bound Wings) precursors, not in the tracker (flat key), + {c} through the Unbound Wings chain — gw2efficiency export read by hierarchy, checked 19/10."}
for cid, flat, n in (("dragonite_ore", 1000, 500), ("empyreal_fragment", 1000, 500),
                     ("bloodstone_dust", 1000, 500), ("obsidian_shard", 60, 30)):
    c = cc[cid]
    assert c["qty"][LEG] == flat, cid
    ov = c.setdefault("qty_overlap_verified", [])
    if LEG not in ov:
        ov.append(LEG)
    note = c.setdefault("qty_overlap_note", {"fr": "", "en": ""})
    for lang in ("fr", "en"):
        t = NOTE[lang].format(n=n, c=n)
        note[lang] = (note.get(lang) + " " if note.get(lang) else "") + t

d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
