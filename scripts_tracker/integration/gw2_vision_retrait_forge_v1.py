"""Retire « Compagnon de la forge » (4577) de Vision (11/11/2026, accord d'Antoine).

Journeyman of the Forge est un succes a 16 paliers, termine a 16 armes : il
n'est pas requis par Vision (sa propre note le disait « FACULTATIVE »). Le
besoin reel de Vision est l'etape 6 de Visions of Thunderhead Peaks (bit 5,
Vision of Equipment: Dragonsblood Weapons : 6 armes differentes puis achat
chez Hilina). Affichee a 0/16, la collection laissait croire a une etape due.

SUPPRESSIONS : legendaries.vision.collections.vis_forge ;
collection_unlocks["4577"] ; _meta.direct_sync.achievement_key_ids.vis_forge.
DEPLACE (sources : ressources/wiki/dragonsblood_weapons.html, encadre
d'acquisition) vers how_jsx du bit 5 de vis_thunderhead : prerequis de
l'etape d'histoire Dragonsblood, livres de recettes a 500 Magie volatile +
5 Lauriers piece, Dragonsblood Impaler non fabricable. Les affirmations non
sourcees de l'ancienne note (armes heroiques, deblocage de garde-robe,
plafond de noeuds) ne sont pas reprises.
"""
import json, re, glob
src = max(glob.glob("gw2_sources_v*.json"), key=lambda p: int(re.findall(r"v(\d+)", p)[0]))
num = int(re.findall(r"v(\d+)", src)[0])
d = json.load(open(src, encoding="utf-8"))
V = d["legendaries"]["vision"]["collections"]
del V["vis_forge"]
del d["collection_unlocks"]["4577"]
del d["_meta"]["direct_sync"]["achievement_key_ids"]["vis_forge"]
it = V["vis_thunderhead"]["items"][5]
assert it["name"] == "Vision of Equipment: Dragonsblood Weapons"
it["how_jsx"]["fr"] += (" 🔓 Les livres de recettes s'achètent 500 Magie volatile + 5 Lauriers pièce, "
                        "après l'étape d'histoire « Dragonsblood ». La lance Dragonsblood Impaler n'a pas "
                        "de recette et ne compte pas. La collection « Compagnon de la forge » (16 armes) "
                        "n'est pas requise pour Vision.")
it["how_jsx"]["en"] += (" 🔓 Recipe books cost 500 Volatile Magic + 5 Laurels each, after the "
                        "'Dragonsblood' story step. The Dragonsblood Impaler spear has no recipe and does "
                        "not count. The 'Journeyman of the Forge' collection (16 weapons) is not required "
                        "for Vision.")
dst = f"gw2_sources_v{num+1}.json"
json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(src, "->", dst)
