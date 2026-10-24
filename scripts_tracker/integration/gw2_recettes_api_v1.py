#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ce que l'API tranche dans CONFRONTATION_API.md (24/10).

Usage : python3 scripts_tracker/integration/gw2_recettes_api_v1.py SRC DST

Regle d'Antoine (09/10) : pour un id confirme, l'API a raison.
Source : ressources/api/api_recettes_composants_20261024.json.

1. Purified Rift Essence (recette 100569 a tous les metiers 400) : 1
   Amalgamated Rift Essence + 1 Mystic Clover. La feuille portait la seule
   consigne « ne pas raffiner plus que necessaire » : ni l'essence amalgamee
   ni le trefle n'etaient comptes pour Obsidian (12) ; Endless Summer (Gift
   of Rays, 10) les portait en cles a plat, retirees.
2. Sapphire Orb (Jeweler 350) : 2 Sapphire Crystal + 5 Incandescent Dust ; le
   cristal manquait (les cinq autres orbes l'ont). Sapphire Crystal (24475,
   vendable au comptoir, lu le 24/10) cree.
3. Gift of Souls (Artificer 400, recette 6509) : 250 Orichalcum Ingots +
   20 ectos + 1 Gift of Knowledge + 100 Crystal Lodestones ; le don de
   connaissance manquait et la source disait « Forge mystique ».
4. Wings of Glory (Elite) : l'apiId 77223 est, a l'API, « Practical Scribe's
   Backpack » (lu le 24/10). L'id faux est range dans `apiId_fix` (structure
   existante) et retire : synchro et comptoir lisaient un autre objet. Le bon
   id reste a lire sur le wiki.
5. Meme controle sur tous les composants (noms de /v2/items lus le 24/10,
   ressources/api/api_noms_composants_20261024.json) : 18 apiId designent un
   autre objet. Deux sont des monnaies du portefeuille dont l'id est au
   referentiel (Trade Contract 34, PvP League Ticket 30 : meme convention que
   karma, magie non liee) ; les seize autres passent dans `apiId_fix`, leur
   bon id a lire sur le wiki. Les sources comptoir posees le 20/10 sur ces
   faux ids sont retirees (elles decrivaient l'autre objet).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-24"
REF = "ressources/api/api_recettes_composants_20261024.json"


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = c.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


# 1.
p = cc["purified_rift_essence"]
assert p["apiId"] == 100569
arete("amalgamated_rift_essence", "purified_rift_essence", 1)
arete("mystic_clover", "purified_rift_essence", 1)
p["sources"] = [{"type": "craft_400", "verified": True, "checked": J, "ref": f"{REF} (recette 100569)",
                 "tip": {"fr": "Tous métiers 400 : 1 Amalgamated Rift Essence + 1 Mystic Clover. Ne pas en fabriquer plus que nécessaire.",
                         "en": "Any discipline 400: 1 Amalgamated Rift Essence + 1 Mystic Clover. Don't craft more than needed."}}] + \
               [s for s in p["sources"] if s.get("type") == "trading_post"]

# Endless Summer portait ce chemin en cles a plat recopiees de sa table
# (10 Purified = 10 Amalgamated : 2 500 Fine, 1 000 Masterwork, 500 Rare,
# 500 ectos, + 10 trefles) : l'arete les porte desormais, les cles tombent
# (15 ectos restent, hors de ce chemin). Total d'Endless Summer inchange.
for k, v, reste in (("fine_rift_essence", 2500, 0), ("masterwork_rift_essence", 1000, 0),
                    ("rare_rift_essence", 500, 0), ("glob_of_ectoplasm", 515, 15), ("mystic_clover", 10, 0)):
    q = cc[k]["qty"]
    assert q.get("endless_summer") == v, (k, q.get("endless_summer"))
    if reste:
        q["endless_summer"] = reste
    else:
        del q["endless_summer"]
        nf = cc[k].get("needed_for")
        if isinstance(nf, list) and "endless_summer" in nf:
            nf.remove("endless_summer")

e = cc["glob_of_ectoplasm"]
e.setdefault("qty_overlap_verified", []).append("endless_summer")
e["qty_overlap_note"] = {"fr": "Endless Summer : 500 par les 10 Purified Rift Essences (arête, via Amalgamated) ; 15 restent en clé à plat, reste de la table d'Endless Summer hors de ce chemin.",
                         "en": "Endless Summer: 500 through the 10 Purified Rift Essences (edge, via Amalgamated); 15 remain as a flat key, the rest of Endless Summer's table outside that path."}

# 2.
assert "sapphire_crystal" not in cc
cc["sapphire_crystal"] = {
    "name": "Sapphire Crystal", "apiId": 24475, "kind": "material", "farmable": True, "qty": {}, "needed_for": [],
    "sources": [{"type": "unknown", "verified": True, "checked": J, "ref": f"{REF} (ingredient de la recette 3435)",
                 "tip": {"fr": "Gemme : voie de jeu à lire sur le wiki (hors ligne le 24/10).",
                         "en": "Gemstone: in-game route to read on the wiki (offline on 24/10)."}},
                {"type": "trading_post", "paid_repeatable": True, "verified": True, "checked": J,
                 "ref": "/v2/commerce/prices?ids=24475 (24/10)",
                 "tip": {"fr": "Achetable au comptoir — raccourci en or, jamais compté.",
                         "en": "Sold on the trading post — a gold shortcut, never counted."}}],
    "verified": True, "checked": J, "ref": REF}
arete("sapphire_crystal", "sapphire_orb", 2)

# 3.
g = cc["gift_of_souls"]
assert g["apiId"] == 36072
arete("gift_of_knowledge", "gift_of_souls", 1)
g["sources"] = [{"type": "craft_400", "verified": True, "checked": J, "ref": f"{REF} (recette 6509)",
                 "tip": {"fr": "Artificier 400 : 250 Orichalcum Ingots + 20 ectos + 1 Gift of Knowledge + 100 Crystal Lodestones.",
                         "en": "Artificer 400: 250 Orichalcum Ingots + 20 ectos + 1 Gift of Knowledge + 100 Crystal Lodestones."}}] + \
               [s for s in g["sources"] if s.get("type") == "trading_post"]

# 4.
w = cc["wings_of_glory_elite"]
assert w["apiId"] == 77223
w["apiId_fix"] = {"was": 77223, "checked": J, "verified": True,
                  "ref": "/v2/items?ids=77223 (24/10) : « Practical Scribe's Backpack » — bon id a lire sur le wiki"}
del w["apiId"]
w["sources"] = [s for s in w["sources"] if s.get("type") != "trading_post"]

# 5.
N = json.loads(Path("ressources/api/api_noms_composants_20261024.json").read_text(encoding="utf-8"))
MONNAIES = {"trade_contract": 34, "pvp_league_ticket": 30}
FAUX = ["glob_condensed_spirit_energy", "testimony_of_heroics", "trade_contract", "exotic_essence_of_luck",
        "pvp_league_ticket", "memories_of_aurene", "mist_pendant", "wings_of_glory_recruit",
        "wings_of_glory_champion", "gift_of_ascension_fractal", "gift_of_infinity", "gift_of_the_hylek",
        "gift_of_shadows_orrax", "fruits_of_the_shadow", "gift_of_the_seas", "gift_of_the_obscure", "glimpse"]
for k in FAUX:
    c = cc[k]
    a = c["apiId"]
    fix = {"was": a, "checked": J, "verified": True,
           "ref": f"ressources/api/api_noms_composants_20261024.json : /v2/items {a} = « {N[str(a)]} »"}
    if k in MONNAIES:
        c["apiId"] = MONNAIES[k]
        fix["ref"] += f" ; monnaie du portefeuille {MONNAIES[k]} (gw2_currencies_ref.json)"
    else:
        fix["ref"] += " — bon id a lire sur le wiki"
        del c["apiId"]
    c["apiId_fix"] = fix
    c["sources"] = [s for s in c["sources"] if not (s.get("type") == "trading_post" and str(s.get("ref", "")).startswith("ressources/api/comptoir_2026"))]

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
