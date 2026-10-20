#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Aurora : la Mini Aurene des Confins de Givramer entre dans le moteur (20/10).

Usage : python3 scripts_tracker/integration/gw2_mini_aurene_v1.py SRC DST

L'etape « Mini Aurene » (aurora_bfr, bit 7) est une collection entiere,
« Gift of Aurene » : cinq pieces de poupee fabriquees (une par jour chacune),
assemblees en Dragon Hatchling Doll et presentees a Aurene. Ses recettes ne
vivaient qu'en prose (`sub_chain`) : 125 ectos... rien n'etait compte.
Captures du 20/10 : les cinq pieces (Recipe), leurs cinq recettes (Slooshoo,
1 000 magie non liee + 5 po chacune), la poupee, la collection.

- cinq composants « piece », recettes lues ; l'etape coute les cinq pieces et
  les cinq recettes ;
- cinq recettes en `account_unlock` (meme structure que recipe_gift_*,
  `enseigne`, `prix_cuivre`), avec l'arete magie non liee 1 000 ;
- Quartz Crystal cree (id 43773, referentiel des materiaux).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-20"
W = "ressources/wiki/"


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = c.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


assert "quartz_crystal" not in cc
cc["quartz_crystal"] = {"name": "Quartz Crystal", "apiId": 43773, "kind": "material", "farmable": True,
                        "qty": {}, "needed_for": [],
                        "sources": [{"type": "gather", "free_repeatable": True,
                                     "tip": {"fr": "Matière première : récolte, butin ou comptoir.",
                                             "en": "Raw material: gathering, loot or trading post."}}],
                        "ref": "gw2_materials_ref.json (id 43773)", "verified": True, "checked": J}

PIECES = {
    # cle : (nom, apiId, metier, recette, id recette, page recette, ingredients)
    "dragon_hatchling_doll_frame": ("Dragon Hatchling Doll Frame", 79817, "Chasseur 450 / Huntsman 450", 79924,
                                    "recipe_dragon_hatchling_doll_frame",
                                    {"ancient_wood_plank": 40, "orichalcum_ingot": 20, "thermocatalytic_reagent": 50, "crystal_lodestone": 5}),
    "dragon_hatchling_doll_hide": ("Dragon Hatchling Doll Hide", 79790, "Travailleur du cuir 450 / Leatherworker 450", 79931,
                                   "recipe_dragon_hatchling_doll_hide",
                                   {"cured_hardened_leather_square": 15, "armored_scale": 15, "thermocatalytic_reagent": 50, "crystal_lodestone": 5}),
    "dragon_hatchling_doll_eye": ("Dragon Hatchling Doll Eye", 79726, "Artificier 450 / Artificer 450", 79935,
                                  "recipe_dragon_hatchling_doll_eyes",
                                  {"quartz_crystal": 20, "glob_of_ectoplasm": 25, "thermocatalytic_reagent": 50, "crystal_lodestone": 5}),
    "dragon_hatchling_doll_adornments": ("Dragon Hatchling Doll Adornments", 79795, "Bijoutier 400 / Jeweler 400", 79888,
                                         "recipe_dragon_hatchling_doll_adornments",
                                         {"vicious_fang": 15, "vicious_claw": 15, "dust_crystalline": 15, "crystal_lodestone": 5}),
    "gossamer_stuffing": ("Gossamer Stuffing", 79763, "Tailleur 450 / Tailor 450", 79820,
                          "recipe_gossamer_stuffing",
                          {"bolt_of_gossamer": 50, "glob_of_ectoplasm": 25, "spool_of_silk_weaving_thread": 1, "crystal_lodestone": 5}),
}
cout = {}
for k, (nom, api, metier, rid, rpage, ings) in PIECES.items():
    assert k not in cc
    m_fr, m_en = metier.split(" / ")
    cc[k] = {"name": nom, "apiId": api, "kind": "advanced_craft", "farmable": True, "qty": {}, "needed_for": [],
             "timegate": True,
             "timegate_note": {"fr": "Fabrication limitée à une par jour.", "en": "Craftable once a day."},
             "sources": [{"type": "craft", "verified": True, "checked": J, "ref": f"{W}{k}.html, Recipe",
                          "tip": {"fr": f"{m_fr} : " + " + ".join(f"{n} {cc[i]['name'] if isinstance(cc[i]['name'], str) else cc[i]['name'].get('en')}" for i, n in ings.items()) + ". Recette à acheter chez Slooshoo (Confins de Givramer).",
                                  "en": f"{m_en}: " + " + ".join(f"{n} {cc[i]['name'] if isinstance(cc[i]['name'], str) else cc[i]['name'].get('en')}" for i, n in ings.items()) + ". Recipe bought from Slooshoo (Bitterfrost Frontier)."}}],
             "verified": True, "checked": J, "ref": f"{W}{k}.html"}
    for i, n in ings.items():
        arete(i, k, n)
    rk = "recipe_" + k
    assert rk not in cc
    cc[rk] = {"name": f"Recipe: {nom}" + ("s" if k.endswith("_eye") else ""), "apiId": rid, "kind": "account_unlock",
              "enseigne": k, "prix_cuivre": 50000, "needed_for": [], "qty": {},
              "sources": [{"type": "vendor", "npc": "Slooshoo",
                           "tip": {"fr": "Slooshoo (Sanctuaire de l'Éclipse des chagrins, Confins de Givramer) : 1 000 magie non liée + 5 po. Une seule fois pour le compte.",
                                   "en": "Slooshoo (Sorrow's Eclipse Sanctuary, Bitterfrost Frontier): 1,000 Unbound Magic + 5g. Once per account."},
                           "verified": True, "checked": J, "ref": f"{W}{rpage}.html, Acquisition"}],
              "ref": f"{W}{rpage}.html", "verified": True, "checked": J}
    arete("unbound_magic", rk, 1000)
    cout[k] = 1
    cout[rk] = 1

A = d["legendaries"]["aurora"]["collections"]["aurora_1"]["subcollections"]["aurora_bfr"]
it = next(i for i in A["items"] if i["bit"] == 7)
assert it["name"] == "Mini Aurene" and not it.get("cost")
it["cost"] = cout
it["cost_ref"] = f"{W}gift_of_aurene.html ; {W}dragon_hatchling_doll.html (les cinq pièces) ; pages des cinq recettes"

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
