"""Retire le faux legendaire `fractal_capacitor` (10/11/2026).

Fractal Capacitor (Infused) est l'etape 9 (bit 8) d'Ad Infinitum III : Unbound
— confirme par Antoine et par ressources/wiki/fractal_capacitor.html
(« Collection : Ad Infinitum III: Unbound »). L'etape porte deja son cout et
son conseil dans legendaries.ad_infinitum.collections.adinf_3. L'entree
legendaries.fractal_capacitor, qui se declarait elle-meme « non confirmee »,
portait armory_api_id 74155 (= Ad Infinitum) : posseder Ad Infinitum la
cochait aussi.

SUPPRESSIONS :
- legendaries.fractal_capacitor (et sa place dans _meta.legendary_ids) ;
- le renvoi `legendary: fractal_capacitor` du bit 8 d'adinf_3 (une etape qui
  renvoie a une autre legendaire, comme Eternity ; ici ce n'en est pas une) ;
- fractal_capacitor dans needed_for de glob_of_coagulated_mists_essence ;
- craft_components.spinal_blade_perfected, dont le seul usage etait ce faux
  legendaire (qty vide, needed_for = [fractal_capacitor]).
"""
import json, re, glob

src = max(glob.glob("gw2_sources_v*.json"), key=lambda p: int(re.findall(r"v(\d+)", p)[0]))
num = int(re.findall(r"v(\d+)", src)[0])
d = json.load(open(src, encoding="utf-8"))
L, C, M = d["legendaries"], d["craft_components"], d["_meta"]
del L["fractal_capacitor"]
M["legendary_ids"] = [k for k in M["legendary_ids"] if k != "fractal_capacitor"]
for k, ks in list(M.get("armory_apiid_to_legid", {}).items()):
    if "fractal_capacitor" in ks:
        ks.remove("fractal_capacitor")
        if not ks: del M["armory_apiid_to_legid"][k]
bit = next(i for i in L["ad_infinitum"]["collections"]["adinf_3"]["items"] if i["bit"] == 8)
assert bit.get("legendary") == "fractal_capacitor"; del bit["legendary"]
g = C["glob_of_coagulated_mists_essence"]
g["needed_for"] = [x for x in g["needed_for"] if x != "fractal_capacitor"]
sb = C["spinal_blade_perfected"]
assert sb["needed_for"] == ["fractal_capacitor"] and not sb.get("qty")
del C["spinal_blade_perfected"]
reste = json.dumps(d, ensure_ascii=False).count("fractal_capacitor") + json.dumps(d).count("spinal_blade_perfected")
dst = f"gw2_sources_v{num+1}.json"
json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(src, "->", dst, "| references restantes :", reste)
