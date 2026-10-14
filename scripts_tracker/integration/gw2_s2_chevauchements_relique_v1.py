"""S2, suite : chevauchements declares et relique legendaire.

Usage : python3 scripts_tracker/integration/gw2_s2_chevauchements_relique_v1.py SRC DST

1. Relique legendaire. La cle a plat `legendary_relic` 12 500 Piles of Lucent
   Crystal completait une arete `mystic_facet` posee a 250 ; la recette en
   pose 750 (mystic_facet.html : 1 relique + 3 x 250 piles). Arete a 750,
   cle a plat retiree : 25 Facets x 750 = 18 750, total inchange
   (legendary_relic.html, « Full material list » : 3 x 6 250).
2. Chevauchements verifies (`qty_overlap_verified`, structure existante) : la
   cle a plat porte une ETAPE distincte de la chaine, pas un doublon.
   - shard_of_glory / ardent_glorious : 250 par piece a l'etape ascendue
     (ARMURES_COMPETITIVES.md, 36 pieces) + 1 000 dans le Jar of Distilled
     Glory du Gift of Competitive Dedication ;
   - ascended_shard_of_glory / ardent_glorious : 100 a 250 par emplacement a
     l'etape ascendue + 400 dans la Star of Glory ;
   - ascended_shard_of_glory / transcendence : Mist Diamond 250 + Mist-Enhanced
     Orichalcum 250 (cle a plat 500) + Star of Glory 400 (transcendence.html) ;
   - skirmish_claim_ticket / triumphant_hero : 175 a 350 par emplacement a
     l'etape ascendue + 1 095 par Legendary War Insight.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
JOUR = "2026-10-14"

lp = cc["pile_of_lucent_crystal"]
assert lp["qty"].get("mystic_facet") == 250 and lp["qty"].get("legendary_relic") == 12500
lp["qty"]["mystic_facet"] = 750
del lp["qty"]["legendary_relic"]
lp["qty_overlap_verified"] = [x for x in lp.get("qty_overlap_verified", []) if x != "legendary_relic"]
if not lp["qty_overlap_verified"]:
    del lp["qty_overlap_verified"]
mf = cc["mystic_facet"]
mf["ref"] = "ressources/wiki/mystic_facet.html (boîte Recipe : 1 Relic + 3 x 250 Pile of Lucent Crystal)"
mf["verified"] = True
mf["checked"] = JOUR

NOTES = {
    "shard_of_glory": ("ardent_glorious",
        {"fr": "Ardent Glorious : 250 par pièce à l'étape élevée (vendeur) et 1 000 dans le Jar of Distilled Glory — deux nœuds distincts. Transcendence : Mist Diamond + Mist-Enhanced Orichalcum (500) en plus du Jar, du Gift of Glory et du Gift of Skirmishing.",
         "en": "Ardent Glorious: 250 per piece at the ascended step (vendor) and 1,000 in the Jar of Distilled Glory — two distinct nodes. Transcendence: Mist Diamond + Mist-Enhanced Orichalcum (500) on top of the Jar, Gift of Glory and Gift of Skirmishing."}),
    "ascended_shard_of_glory": (["ardent_glorious", "transcendence"],
        {"fr": "Ardent Glorious : 100 à 250 par emplacement à l'étape élevée et 400 dans la Star of Glory. Transcendence : Mist Diamond 250 + Mist-Enhanced Orichalcum 250, en plus de la Star of Glory.",
         "en": "Ardent Glorious: 100 to 250 per slot at the ascended step and 400 in the Star of Glory. Transcendence: Mist Diamond 250 + Mist-Enhanced Orichalcum 250, on top of the Star of Glory."}),
    "skirmish_claim_ticket": ("triumphant_hero",
        {"fr": "Triumphant Hero : 175 à 350 par emplacement à l'étape élevée et 1 095 par Legendary War Insight — deux nœuds distincts.",
         "en": "Triumphant Hero: 175 to 350 per slot at the ascended step and 1,095 per Legendary War Insight — two distinct nodes."}),
}
for cid, (legs, note) in NOTES.items():
    c = cc[cid]
    ov = c.setdefault("qty_overlap_verified", [])
    for L in ([legs] if isinstance(legs, str) else legs):
        if L not in ov:
            ov.append(L)
    c["qty_overlap_note"] = note
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("relique : arete 750, cle a plat retiree ; chevauchements declares :", len(NOTES))
