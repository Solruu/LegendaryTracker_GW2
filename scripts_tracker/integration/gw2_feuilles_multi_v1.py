#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Feuilles a plusieurs matieres premieres : decomposees (regle d'Antoine, 14/10/2026).

Usage : python3 scripts_tracker/integration/gw2_feuilles_multi_v1.py SRC DST

Regle : une feuille dont la recette est lue reste une feuille, SAUF si elle se
fabrique a partir de plus d'une matiere premiere. Une planche (3 rondins) ou
un lingot d'une seule mine reste feuille ; l'acier (minerai de fer + charbon)
se decompose.
Decomposees, recette d'artisanat deterministe lue sur leur page :
- steel_ingot : 3 Iron Ore + 1 Lump of Coal ;
- darksteel_ingot : 2 Platinum Ore + 1 Lump of Primordium ;
- amethyst / carnelian / lapis / peridot lump : 1 Pile of Shimmering Dust + 2 nuggets ;
- charged_fossil : 50 Leaf Fossil + 1 Charged Quartz Crystal ;
- charged_thorn : 50 Barbed Thorn + 1 Charged Quartz Crystal.
Gardees, avec la raison :
- promotions de la Forge (trophees T2-T6, Hardened Leather Section, Ancient
  Wood Log) : voie alternative, on farme ou on achete l'objet ;
- lodestones : deux recettes concurrentes (vin / agent liant), noyaux non
  modelises, on les farme ou on les achete (BACKLOG, « Les lodestones ») ;
- opal_crystal : voie par defaut deja tranchee (coffre, v370) ;
- precurseurs gen1 et autres recettes de Forge aleatoires ou a voies
  multiples : hors regle.
Matieres premieres creees avec l'id du referentiel (gw2_materials_ref.json).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
ref = json.loads(Path("gw2_materials_ref.json").read_text(encoding="utf-8"))["flat"]
par_nom = {v: int(k) for k, v in ref.items()}
JOUR = "2026-10-14"

RECETTES = {
    "steel_ingot": {"Iron Ore": 3, "Lump of Coal": 1},
    "darksteel_ingot": {"Platinum Ore": 2, "Lump of Primordium": 1},
    "amethyst_lump": {"Pile of Shimmering Dust": 1, "Amethyst Nugget": 2},
    "carnelian_lump": {"Pile of Shimmering Dust": 1, "Carnelian Nugget": 2},
    "lapis_lump": {"Pile of Shimmering Dust": 1, "Lapis Nugget": 2},
    "peridot_lump": {"Pile of Shimmering Dust": 1, "Peridot Nugget": 2},
    "charged_fossil": {"Leaf Fossil": 50, "Charged Quartz Crystal": 1},
    "charged_thorn": {"Barbed Thorn": 50, "Charged Quartz Crystal": 1},
}
cle_par_nom = {}
for k, v in cc.items():
    n = v.get("name"); n = n.get("en") if isinstance(n, dict) else n
    if n: cle_par_nom.setdefault(n, k)

def matiere(nom):
    if nom in cle_par_nom:
        return cle_par_nom[nom]
    cle = nom.lower().replace(" ", "_")
    api = par_nom[nom]
    cc[cle] = {"name": nom, "apiId": api, "kind": "material", "farmable": True, "qty": {}, "needed_for": [],
               "sources": [{"type": "gather" if any(w in nom for w in ("Ore", "Coal", "Primordium", "Nugget", "Quartz")) else "drop",
                            "tip": {"fr": "Matière première : récolte, butin ou comptoir.",
                                    "en": "Raw material: gathering, loot or trading post."},
                            "free_repeatable": True}],
               "ref": f"gw2_materials_ref.json (id {api})", "verified": True, "checked": JOUR}
    cle_par_nom[nom] = cle
    return cle

crees_avant = set(cc)
for parent, ings in RECETTES.items():
    p = cc[parent]
    assert not any(parent in (c.get("qty") or {}) for c in cc.values()), parent
    for nom, n in ings.items():
        e = matiere(nom)
        cc[e]["qty"][parent] = n
        if parent not in cc[e]["needed_for"]:
            cc[e]["needed_for"].append(parent)
    p["sources"] = [{"type": "craft", "tip": {"fr": "Raffinage : " + " + ".join(f"{n} {m}" for m, n in ings.items()) + ".",
                                               "en": "Refinement: " + " + ".join(f"{n} {m}" for m, n in ings.items()) + "."}}]
    p["ref"] = f"ressources/wiki/{parent}.html (boîte Recipe) — décomposé : plusieurs matières premières (règle d'Antoine, 14/10)"
    p["verified"] = True; p["checked"] = JOUR
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{len(RECETTES)} feuilles decomposees ; matieres creees : {sorted(set(cc) - crees_avant)}")
