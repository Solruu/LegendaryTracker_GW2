"""Corrige les ids d'armurerie des legendaires (10/11/2026).

Source : ressources/api/api_armurerie_ids_20261110.json, lu dans l'API GW2
(/v2/legendaryarmory + /v2/items, lang=en). Une arete est fausse quand le nom
API de l'id ne correspond pas au nom EN du legendaire. Pour ces cas, l'apiId
du legendaire (verifie par son nom) devient l'id d'armurerie, dans les deux
structures existantes : legendaries[].armory_api_id et
_meta.armory_apiid_to_legid. Aetheric Anchor est un conteneur : ses deux
sorties d'armurerie (Ancora Pax 105653, Ancora Bellum 106273) rejoignent
_meta.armory_apiid_to_legid, comme les pieces d'un set d'armure.
"""
import json, re, sys, glob

def derniere():
    return max(glob.glob("gw2_sources_v*.json"), key=lambda p: int(re.findall(r"v(\d+)", p)[0]))

def nom_en(n):
    n = n.get("en") if isinstance(n, dict) else n
    return re.split(r" \(| —| -", n)[0].strip().lower()

src = derniere()
num = int(re.findall(r"v(\d+)", src)[0])
d = json.load(open(src, encoding="utf-8"))
A = json.load(open("ressources/api/api_armurerie_ids_20261110.json", encoding="utf-8"))
nom = {i[0]: i[1].lower() for i in A["items"]}
arm = set(A["arm"])
L, M = d["legendaries"], d["_meta"]["armory_apiid_to_legid"]
REF = "ressources/api/api_armurerie_ids_20261110.json"
corr = []
for k, v in L.items():
    i, a = v.get("apiId"), v.get("armory_api_id")
    if not isinstance(a, int) or nom.get(a) == nom_en(v["name"]):
        continue
    if not (isinstance(i, int) and nom.get(i) == nom_en(v["name"]) and i in arm):
        print("NON TRANCHE", k, a, nom.get(a)); continue
    v["armory_api_id"] = i
    v["armory_api_id_ref"] = (f"API /v2/items + /v2/legendaryarmory, 10/11/2026 — {REF} "
                              f"(ancien id {a} = {nom.get(a, 'absent de l API')})")
    corr.append((k, a, i))
# _meta : retirer les aretes dont le nom API ne correspond pas, ajouter les bonnes
retire = []
for sid, ks in list(M.items()):
    garde = [k for k in ks if k not in L or k == "obsidian" or nom.get(int(sid)) == nom_en(L[k]["name"])
             or k == "legendary_relic"]
    if garde != ks:
        retire.append((sid, [k for k in ks if k not in garde]))
        if garde: M[sid] = garde
        else: del M[sid]
for k, a, i in corr:
    M.setdefault(str(i), [])
    if k not in M[str(i)]: M[str(i)].append(k)
for sid in ("105653", "106273"):
    M.setdefault(sid, [])
    if "aetheric_anchor" not in M[sid]: M[sid].append("aetheric_anchor")
aa = L["aetheric_anchor"]
aa["armory_note"] = {
    "fr": "Conteneur (105497) : l'armurerie enregistre ses deux sorties, Ancora Pax 105653 (baton) et Ancora Bellum 106273 (lance). Source : API /v2/items et /v2/legendaryarmory, 10/11/2026.",
    "en": "Container (105497): the armory records its two outputs, Ancora Pax 105653 (staff) and Ancora Bellum 106273 (spear). Source: API /v2/items and /v2/legendaryarmory, 2026-11-10."}
for k, a, i in corr: print("CORRIGE", k, a, "->", i)
for sid, ks in retire: print("RETIRE _meta", sid, ks)
dst = f"gw2_sources_v{num+1}.json"
json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(src, "->", dst, len(corr), "corrections,", len(retire), "aretes retirees")
