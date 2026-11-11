"""Coalescence : l'Alembic Apparatus se paie en Magnetite Shards (11/11/2026).

Source : Antoine, en jeu chez Scholar Glenna (11/11/2026) ; concordant avec
ressources/wiki/alembic_apparatus.html (vendeurs « Magnetite Shard Exchange »).
Le besoin en Magnetite est deja porte par le bit 0 de coalescence_2
(cost alembic_apparatus -> magnetite_shard 100 + 10 or).

SUPPRESSIONS : craft_components.gaeting_crystal (qty coalescence 100 : besoin
inexistant, compte en double avec la Magnetite) ; cle « gaeting » de
_meta.direct_sync (monnaies coalescence) ; totals.gaeting_alembic /
gaeting_note, remplaces par magnetite_alembic / magnetite_note.
CORRIGE : note de coalescence_2 et collection_unlocks["4412"] (Gaeting ->
Magnetite ; les bouteilles se trouvent en Tyrie, pas pendant les kills de W6).
"""
import json, re, glob
src = max(glob.glob("gw2_sources_v*.json"), key=lambda p: int(re.findall(r"v(\d+)", p)[0]))
num = int(re.findall(r"v(\d+)", src)[0])
d = json.load(open(src, encoding="utf-8"))
C, M = d["craft_components"], d["_meta"]
g = C.pop("gaeting_crystal")
assert g["qty"] == {"coalescence": 100}, g["qty"]
for v in C.values():
    if "gaeting_crystal" in (v.get("needed_for") or []): v["needed_for"].remove("gaeting_crystal")
def purge(o):
    if isinstance(o, dict):
        if o.get("gaeting") == 39 and "magnetite" in o: del o["gaeting"]
        for v in o.values(): purge(v)
    elif isinstance(o, list):
        for v in o: purge(v)
purge(M)
co = d["legendaries"]["coalescence"]
t = co["totals"]
t.pop("gaeting_alembic"); t.pop("gaeting_note")
t["magnetite_alembic"] = 100
t["magnetite_note"] = ("Alembic Apparatus (Coalescence II) : 100 Magnetite Shards + 10 po chez Scholar Glenna "
                       "(W6) ou un Magnetite Shard Exchange portable. Confirme en jeu par Antoine le 11/11/2026.")
c2 = co["collections"]["coalescence_2"]
c2["note"] = {
    "fr": "Requiert Coalescence I. Alembic Apparatus : 100 Magnetite Shards + 10 po chez Scholar Glenna (W6, après un boss de l'aile) ou un Magnetite Shard Exchange portable. Les bouteilles vides se ramassent en Tyrie (une seule en raid : Surprise, après Qadim) ; chaque bouteille remplie demande sa vide. Double-cliquer l'Alembic à la fin.",
    "en": "Requires Coalescence I. Alembic Apparatus: 100 Magnetite Shards + 10g from Scholar Glenna (W6, after one boss of the wing) or a portable Magnetite Shard Exchange. Empty bottles are picked up around Tyria (only one in a raid: Surprise, after Qadim); each filled bottle needs its empty one. Double-click the Alembic at the end."}
c2["note_ref"] = "ressources/wiki/coalescence_ii_the_gift.html (Notes) + alembic_apparatus.html ; monnaie confirmee en jeu par Antoine le 11/11/2026"
u = d["collection_unlocks"]["4412"]["text"]
for k in ("fr", "en"):
    assert "Gaeting Crystals" in u[k]
    u[k] = u[k].replace("Gaeting Crystals", "Magnetite Shards")
s = json.dumps(d, ensure_ascii=False)
print("references gaeting restantes :", [m.start() for m in re.finditer(r"[Gg]aeting", s)][:5])
dst = f"gw2_sources_v{num+1}.json"
json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(src, "->", dst)
