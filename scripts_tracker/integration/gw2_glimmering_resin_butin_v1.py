#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Glimmering Resin (Stella Radians) : voie principale = butin, options vendeur et recette (04/11).

Usage : python3 scripts_tracker/integration/gw2_glimmering_resin_butin_v1.py SRC DST

Les 17 etapes du Glimmering Resin Weapon Collector (succes 9344) ne citaient
que la recette et le vendeur. Les pages objet « Berserker's Glimmering Resin
<arme> » (captures du 04/11) donnent trois voies :
- butin : Glimmering Resin Weapon Cache (au choix) ;
- vendeur : Historian Meliza ou Steward Brizio, 1 Berserker's Chromatic Resin
  <arme> + 6 Shadowstone Fragment + 12 Glob of Ectoplasm + 300 Research Note ;
- recette (400) : 1 Berserker's Chromatic Resin <arme> + 1 piece « Oiled » +
  10 Glob of Ectoplasm + 250 Research Note.
Antoine a tranche le 04/11 : « butin principale, options sur les autres ».
Aucun cout d'etape n'est compte (feuille de butin, regle C7) ; le vendeur et
la recette sont cites en option, chiffres lus sur chaque page.
"""
import json
import re
import sys
import urllib.parse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "parseurs"))
import gw2_parse_wiki_recipe_v1 as R  # noqa: E402

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
J = "2026-11-04"
WK = Path("ressources/wiki")
DISC_FR = {"Weaponsmith": "Forgeron d'armes", "Huntsman": "Chasseur", "Artificer": "Artificier"}

col = d["legendaries"]["stella_radians"]["collections"]["stella_resin"]
faits = 0
for st in col["items"]:
    arme = st["name"].replace("Glimmering Resin ", "")
    page = WK / ("berserkers_glimmering_resin_" + re.sub(r"[^a-z0-9]+", "_", arme.lower()) + ".html")
    html = page.read_text(encoding="utf-8")
    assert "Glimmering Resin Weapon Cache" in html, page
    rs = R.recettes(html)
    assert len(rs) == 1, page
    r = rs[0]
    ing = {urllib.parse.unquote(c).replace("_", " "): q for c, q in r["ingredients"]}
    huile = [n for n in ing if n.startswith("Oiled ")]
    assert len(huile) == 1 and ing.get("Glob of Ectoplasm") == 10 and ing.get("Research Note") == 250, (page, ing)
    chroma = f"Berserker's Chromatic Resin {arme}"
    assert ing.get(chroma) == 1, (page, ing)
    disc = r["discipline"]
    st["how"] = {
        "fr": (f"Débloque l'apparence {st['name']}. Voie retenue : butin — Glimmering Resin Weapon Cache (au choix). "
               f"Options : achat chez Historienne Meliza ou Intendant Brizio (Jardin de l'Éternité), "
               f"1 {chroma} + 6 Shadowstone Fragment + 12 Glob of Ectoplasm + 300 Research Note ; "
               f"ou fabrication ({DISC_FR[disc]} {r['rating']}, recette à débloquer) : "
               f"1 {chroma} + 1 {huile[0]} + 10 Glob of Ectoplasm + 250 Research Note."),
        "en": (f"Unlock the {st['name']} skin. Default route: loot — Glimmering Resin Weapon Cache (choice). "
               f"Options: buy from Historian Meliza or Steward Brizio (Eternity's Garden), "
               f"1 {chroma} + 6 Shadowstone Fragment + 12 Glob of Ectoplasm + 300 Research Note; "
               f"or craft ({disc} {r['rating']}, recipe to unlock): "
               f"1 {chroma} + 1 {huile[0]} + 10 Glob of Ectoplasm + 250 Research Note."),
    }
    st["how_verified"] = True
    st["how_ref"] = f"{page.as_posix()} (Contained in, Sold by, Recipe) ; voie butin tranchee par Antoine le {J}"
    jsx = st.get("how_jsx")
    if jsx:
        for lg, pre, a, b in (("fr", "Voie retenue : butin (Glimmering Resin Weapon Cache). ", "Deux voies :", "Options :"),
                              ("en", "Default route: loot (Glimmering Resin Weapon Cache). ", "Two routes:", "Options:")):
            if not jsx[lg].startswith(pre):
                assert jsx[lg].count(a) == 1, (lg, jsx[lg][:80])
                jsx[lg] = pre + jsx[lg].replace(a, b)
    faits += 1
assert faits == 17, faits

for lg, pre in (("fr", "Voie retenue : butin (Glimmering Resin Weapon Cache) ; recettes et achat en option. "),
                ("en", "Default route: loot (Glimmering Resin Weapon Cache); recipes and purchase as options. ")):
    n = col["note"][lg]
    head = n.split("— ", 1)
    assert len(head) == 2, n
    col["note"][lg] = head[0] + "— " + pre + head[1]

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(faits, "etapes Glimmering Resin ; ecrit", DST)
