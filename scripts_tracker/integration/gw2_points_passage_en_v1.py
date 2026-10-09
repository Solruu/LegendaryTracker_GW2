#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Points de passage d'Aurora II et Vision II : nom ANGLAIS sourcé (accord d'Antoine, 09/10/2026).

Usage : python3 scripts_tracker/integration/gw2_points_passage_en_v1.py SRC DST

Les 45 lieux portaient leur point de passage et leur carte en francais seul, et
le texte anglais citait ces noms francais (« Nearest waypoint: Route grise »).
Source des noms anglais : les tableaux « Nearest Waypoint » des captures
`aurora_ii_empowering.html` (par objet) et `vision_ii_farsight.html` (par
sanctuaire), lus dans l'ordre des lignes. Controle : deux lieux qui partagent
un nom anglais partagent aussi leur code de chat.
Structure : `waypoint.name` et `map` passent en { fr, en }, la forme des cartes
deja employee ailleurs (le rendu passe par NX, qui lit les deux formes).
Les noms francais ne changent pas.
"""
import json, re, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
W = Path("ressources/wiki")

def texte(nom):
    raw = (W / f"{nom}.html").read_text(encoding="utf-8")
    raw = re.sub(r"<img[^>]*alt=\"([^\"]*)\"[^>]*>", r" [\1] ", raw)
    raw = re.sub(r"<script.*?</script>", " ", raw, flags=re.S)
    raw = re.sub(r"<[^>]+>", " ", raw)
    import html
    return re.sub(r"\s+", " ", html.unescape(raw))

def lignes(nom):
    t = texte(nom)
    return re.findall(r"([A-Z][^\[\]]{2,60}?) \[Waypoint \(map icon\)\.png\]\s+(.+?) Waypoint", t)

aur = {}
for objet, wp in lignes("aurora_ii_empowering"):
    m = re.search(r"\[[^\]]+\.png\] (.+?) Item", objet)
    aur[(m.group(1) if m else objet.split(" Item")[0]).strip()] = wp
vis = {}
for ins, wp in lignes("vision_ii_farsight"):
    vis[ins.strip()] = wp

# nom de carte : FR (API, W8) -> EN (API)
sys.path.insert(0, str(Path(__file__).parent))
from gw2_noms_cartes_fr_v2 import API, EN_DE
CARTE_EN = {nom: EN_DE[mid] for mid, (nom, art) in API.items() if mid in EN_DE}
CARTE_EN["Domaine d'Istan"] = "Domain of Istan"

d = json.loads(SRC.read_text(encoding="utf-8"))
codes, n, manque = {}, 0, []
for leg, col, cle in (("aurora", "aurora_2", "name"), ("vision", "vision_2", "name")):
    for it in d["legendaries"][leg]["collections"][col]["items"]:
        w = it["waypoint"]; fr = w["name"]
        nom = it[cle]
        if col == "aurora_2":
            en = aur.get(nom)
        else:
            en = next((v for k, v in vis.items() if k.endswith(nom.split(": ", 1)[-1])), None)
            if not en:  # « Thunderhead Peaks Niles » au wiki, « Insight: Niles — Honored Ritual » chez nous
                en = next((v for k, v in vis.items() if "Insight:" not in k
                           and nom.split(": ", 1)[-1].startswith(k.split()[-1])), None)
        if not en:
            manque.append(nom); continue
        suffixe = {" (jour)": " (day)"}
        for sf, se in suffixe.items():
            if fr.endswith(sf): en += se
        assert codes.setdefault(en, w["chat_code"]) == w["chat_code"], (en, w["chat_code"], codes[en])
        w["name"] = {"fr": fr, "en": en}
        frb = fr.replace(" (jour)", ""); enb = en.replace(" (day)", "")
        it["how"]["en"] = it["how"]["en"].replace(frb, enb)
        carte = it["map"]
        if isinstance(carte, str):
            assert carte in CARTE_EN, carte
            it["map"] = {"fr": carte, "en": CARTE_EN[carte]}
        n += 1
    d["legendaries"][leg]["collections"][col]["waypoints_en_ref"] = (
        "wiki, colonne « Nearest Waypoint » — ressources/wiki/"
        + ("aurora_ii_empowering" if col == "aurora_2" else "vision_ii_farsight") + ".html (lu le 09/10/2026)")
assert not manque, manque
d["_meta"]["last_updated"] = "2026-10-09"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{n} lieux : point de passage et carte en {{fr, en}}")
