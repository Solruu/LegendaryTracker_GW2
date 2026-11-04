#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Forge Guard (Stella Radians) : voie par defaut = butin ; deux composants supprimes (04/11).

Usage : python3 scripts_tracker/integration/gw2_forge_guard_butin_v1.py SRC DST

1. Les 6 etapes de la collection Forge Guard's Armor (succes 9330) disaient
   seulement « s'achete auprès de l'Alliance Field Quartermaster ». Les pages
   des pieces (captures du 04/11) donnent deux voies :
   - butin : Forge Guard's Armor Box (au choix), contenue dans la Castoran
     Gear Box (forge_guards_armor_box.html) ;
   - vendeur : or + Shadowstone Fragment + karma, ou 1 jeton de la piece.
   Antoine a tranche le 04/11 : voie par defaut = le butin. Aucun cout
   d'etape n'est compte (feuille de butin, regle C7) ; le vendeur est cite
   en alternative avec ses prix lus sur chaque page.
2. `gift_of_the_obscure` (aucune recette du Legendary Relic ne le cite, page
   404) et `memories_of_aurene` (doublon orphelin de `memory_of_aurene`, page
   404) sont supprimes, feu vert d'Antoine du 04/11. Ni l'un ni l'autre n'est
   reference ailleurs dans les sources.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
J = "2026-11-04"

# prix lus dans « Sold by » de chaque page de piece (captures du 04/11)
PRIX = {
    "Helmet": (100, 150, "70 000", "Helmet", "helmet"),
    "Pauldron": (200, 200, "105 000", "Shoulders", "pauldron"),
    "Cuirass": (250, 250, "175 000", "Cuirass", "cuirass"),
    "Gloves": (150, 150, "70 000", "Gloves", "gloves"),
    "Leggings": (200, 200, "105 000", "Leggings", "leggings"),
    "Boots": (150, 150, "70 000", "Boots", "boots"),
}

col = d["legendaries"]["stella_radians"]["collections"]["stella_forge_guard"]
faits = 0
for st in col["items"]:
    piece = st["name"].rsplit(" ", 1)[1]
    o, f, k, jeton, page = PRIX[piece]
    st["how"] = {
        "fr": (f"Débloque l'apparence {st['name']}. Voie retenue : butin — "
               f"Forge Guard's Armor Box (au choix), contenue dans la Castoran Gear Box. "
               f"Alternative : Alliance Field Quartermaster (Jardin de l'Éternité), "
               f"{o} or + {f} Shadowstone Fragment + {k} karma, ou 1 Forge Guard's Token: {jeton}."),
        "en": (f"Unlock the {st['name']} skin. Default route: loot — "
               f"Forge Guard's Armor Box (choice), contained in the Castoran Gear Box. "
               f"Alternative: Alliance Field Quartermaster (Eternity's Garden), "
               f"{o} gold + {f} Shadowstone Fragment + {k} karma, or 1 Forge Guard's Token: {jeton}."),
    }
    st["how_verified"] = True
    st["how_ref"] = (f"ressources/wiki/forge_guards_medium_{page}.html (Contained in, Sold by) ; "
                     f"ressources/wiki/forge_guards_armor_box.html ; voie butin tranchee par Antoine le {J}")
    faits += 1
assert faits == 6, faits

ancien = "Achat chez n'importe quel Alliance Field Quartermaster du Jardin de l'Éternité, plein tarif ou réduit avec un jeton."
nouveau = ("Voie retenue : butin (Forge Guard's Armor Box, dans la Castoran Gear Box). Alternative : achat chez "
           "n'importe quel Alliance Field Quartermaster du Jardin de l'Éternité, plein tarif ou réduit avec un jeton.")
assert col["note"]["fr"].count(ancien) == 1
col["note"]["fr"] = col["note"]["fr"].replace(ancien, nouveau)
ancien_en = "Bought from any Alliance Field Quartermaster in Eternity's Garden, full price or reduced with a token."
nouveau_en = ("Default route: loot (Forge Guard's Armor Box, from the Castoran Gear Box). Alternative: buy from any "
              "Alliance Field Quartermaster in Eternity's Garden, full price or reduced with a token.")
assert col["note"]["en"].count(ancien_en) == 1
col["note"]["en"] = col["note"]["en"].replace(ancien_en, nouveau_en)

C = d["craft_components"]
for k in ("gift_of_the_obscure", "memories_of_aurene"):
    del C[k]
s = json.dumps(d, ensure_ascii=False)
for k in ("gift_of_the_obscure", "memories_of_aurene"):
    assert f'"{k}"' not in s, k

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(faits, "etapes Forge Guard, 2 composants supprimes ; ecrit", DST)
