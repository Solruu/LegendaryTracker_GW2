#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""S6 : traduction francaise des etapes de collection et des conseils (accord d'Antoine, 12/10/2026).

Usage : python3 scripts_tracker/integration/gw2_traduction_how_v1.py SRC DST

Entree : ressources/traductions/how_tip_fr_1012.json (id -> FR), tous.json
(id -> EN), chemins.json (EN -> chemins dans les sources). 1 869 textes
uniques, 2 622 champs `fr` vides (`how`, `tip`, `name`).
Regles de traduction : ressources/traductions/REGLES.md — noms d'objets, de
succes, de PNJ restes en anglais (le site les traduit par l'API, NXS) ; noms
de cartes par le glossaire API ; lieux hors glossaire en anglais.
Passe finale : les noms de cartes de Tyrie centrale restes en anglais dans le
francais sont remplaces par leur nom client (/v2/maps?lang=fr, 12/10/2026),
article accorde (moteur de `gw2_noms_cartes_fr_v2`).
Garde-fous : chaque code de chat et chaque nom de composant cite en anglais
doit se retrouver dans le francais. `how_fr_missing` tombe des que `how.fr`
est pose.
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
import gw2_noms_cartes_fr_v2 as C

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
T = Path("ressources/traductions")
fr_par_id = json.loads((T / "how_tip_fr_1012.json").read_text(encoding="utf-8"))
en_par_id = {str(x["id"]): x["en"] for x in json.loads((T / "tous.json").read_text(encoding="utf-8"))}
chemins = json.loads((T / "chemins.json").read_text(encoding="utf-8"))

# Cartes de Tyrie centrale : nom client FR (/v2/maps?lang=fr, 12/10/2026)
CORE = {
    18: ("Divinity's Reach", "Promontoire divin", "le"), 19: ("Plains of Ashford", "Plaines d'Ashford", "les"),
    20: ("Blazeridge Steppes", "Steppes de la strie flamboyante", "les"), 21: ("Fields of Ruin", "Champs de ruine", "les"),
    27: ("Lornar's Pass", "Passage de Lornar", "le"), 28: ("Wayfarer Foothills", "Contreforts du voyageur", "les"),
    31: ("Snowden Drifts", "Congères d'Antreneige", "les"), 32: ("Diessa Plateau", "Plateau de Diessa", "le"),
    34: ("Caledon Forest", "Forêt de Caledon", "la"), 35: ("Metrica Province", "Province de Metrica", "la"),
    54: ("Brisban Wildlands", "Terres sauvages de Brisban", "les"), 218: ("Black Citadel", "Citadelle noire", "la"),
    91: ("The Grove", "Bosquet", "le"),
}
for mid, (en, fr, art) in CORE.items():
    C.API[mid] = (fr, art)
    C.EN[en] = mid
    if en.startswith("The "):
        C.EN[en[4:]] = mid

def carte_fr(s):
    return C.remplace(s, C.EN, False)

d = json.loads(SRC.read_text(encoding="utf-8"))
noms = set()
for v in d["craft_components"].values():
    n = v.get("name"); n = n.get("en") if isinstance(n, dict) else n
    if n and len(n) > 6: noms.add(n)

def noeud(chemin):
    o = d
    for part in re.findall(r"/([^/\[]+)|\[(\d+)\]", chemin):
        k, i = part
        o = o[k] if k else o[int(i)]
    return o

poses, controles = 0, []
for i, en in en_par_id.items():
    fr = carte_fr(fr_par_id[i])
    for c in re.findall(r"\[&B[^\]]+\]", en):
        if c not in fr: controles.append((i, c))
    for n in noms:
        if n in en and n not in fr: controles.append((i, n))
    for ch in chemins[en]:
        parent_ch, cle = ch.rsplit("/", 1)
        parent = noeud(parent_ch)
        champ = parent[cle]
        assert champ.get("en") == en and not champ.get("fr"), ch
        champ["fr"] = fr
        if cle == "how":
            parent.pop("how_fr_missing", None)
        poses += 1
assert not controles, controles[:10]
d["_meta"]["last_updated"] = "2026-10-12"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{poses} champs fr poses ({len(en_par_id)} textes uniques)")
