"""Coalescence II, Bottle of Fear (Filled) : la faille se rouvre (15/11/2026).

Source : Antoine, en jeu le 15/11/2026 — ayant deja eu acces a la Dark Library
(quete du griffon), il a pu « Reopen rift » en arrivant au bout de la Tomb of
Primeval Kings et remplir la bouteille. Personnage ou compte : non tranche
(observe sur un personnage qui avait deja l'acces).
"""
import json, re, glob
src = max(glob.glob("gw2_sources_v*.json"), key=lambda p: int(re.findall(r"v(\d+)", p)[0]))
num = int(re.findall(r"v(\d+)", src)[0])
d = json.load(open(src, encoding="utf-8"))
it = d["legendaries"]["coalescence"]["collections"]["coalescence_2"]["items"][8]
assert it["name"] == "Bottle of Fear (Filled)"
it["how_jsx"]["fr"] += (" 💡 Si tu as déjà eu accès à la Bibliothèque sombre, l'option « Reopen rift » apparaît en "
                        "arrivant au bout du Tombeau : pas besoin de refaire la quête (constaté en jeu par Antoine le "
                        "15/11/2026 ; personnage ou compte, non vérifié).")
it["how_jsx"]["en"] += (" 💡 If you already had access to the Dark Library, a 'Reopen rift' option shows up when you "
                        "reach the end of the Tomb: no need to redo the quest (seen in game by Antoine on 2026-11-15; "
                        "character or account-wide, not verified).")
dst = f"gw2_sources_v{num+1}.json"
json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(src, "->", dst)
