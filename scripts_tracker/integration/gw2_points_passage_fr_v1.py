#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Points de passage d'Aurora II / Vision II : nom FRANCAIS aligne sur le client (accord d'Antoine, 09/10/2026).

Usage : python3 scripts_tracker/integration/gw2_points_passage_fr_v1.py SRC DST

Id du point = celui que porte le code de chat (octet 0x04 puis id sur 4
octets). Nom lu sur /v2/continents/1/floors/{f}/regions/{r}/maps/{m}/pois
?ids=…&lang=fr (09/10/2026). La region n'est pas toujours celle que
/v2/maps declare (Mont Maelstrom et Marais de Lumillule sont sous la region 8,
Baie des braises sous la 20, les cartes LW4 hors Istan sous l'etage 49).
Le nom court retire « Point de passage » et l'article qui suit.
"""
import base64, json, re, struct, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
API = {  # id POI -> nom complet du client
    173: "Point de passage du Camp de la barricade", 423: "Point de passage de Remanda",
    591: "Point de passage de Feuilleblanche", 602: "Point de passage de la Route grise",
    535: "Point de passage de fonte brute", 483: "Point de passage du Lac Pourprenage",
    726: "Point de passage magmatique", 947: "Point de passage de Caer Bruyère",
    678: "Point de passage de Pagga", 2005: "Point de passage de la Bravoure de Mellaggan",
    2049: "Point de passage des Ruines sibyllines", 2054: "Point de passage de la Garde de l'Ouest",
    2013: "Point de passage de la Garde du Nord", 2037: "Point de passage de la Confluence des lignes de force",
    2062: "Point de passage du Camp de l'Ordre des Soupirs", 2367: "Point de passage des Profondeurs du Gouffre",
    2424: "Point de passage du Cirque des naufragés", 2429: "Point de passage de l'Éclipse des lamentations",
    2484: "Point de passage du Bazar lacustre", 2517: "Point de passage de la Grotte ancienne",
    2543: "Point de passage de Camp Reconquête", 2842: "Point de passage de l'Aube du Champion",
    2810: "Point de passage de l'Astralarium", 2883: "Point de passage d'Atholma",
    2853: "Point de passage du campement d'Anniogel", 2903: "Point de passage du campement allié",
    2969: "Point de passage de la chapelle récupérée", 2947: "Point de passage de la Vendetta de l'âme",
    2963: "Point de passage du Passage de Venta", 2942: "Point de passage du village de Yatendi",
    2982: "Point de passage du Cœur de la révolution", 3003: "Point de passage de la Fin de l'histoire",
    3001: "Point de passage du Pont d'observation", 3002: "Point de passage de l'Amarrage",
    3038: "Point de passage du haut commandement du Pacte", 3025: "Point de passage de l'Outre-monde",
    3046: "Point de passage de la forêt en feu",
}

def court(nom):
    s = re.sub(r"^Point de passage\s+", "", nom)
    s = re.sub(r"^(?:du |de la |des |de l'|d'|de )", "", s)
    return s[0].upper() + s[1:]

def poi(code):
    b = base64.b64decode(code[2:-1] + "==")
    assert b[0] == 4, code
    return struct.unpack("<I", b[1:5])[0]

d = json.loads(SRC.read_text(encoding="utf-8"))
changes = {}
for leg, col in (("aurora", "aurora_2"), ("vision", "vision_2")):
    c = d["legendaries"][leg]["collections"][col]
    for it in c["items"]:
        w = it["waypoint"]; pid = poi(w["chat_code"])
        ancien = w["name"]["fr"]; suf = " (jour)" if ancien.endswith(" (jour)") else ""
        neuf = court(API[pid]) + suf
        if neuf != ancien:
            changes[ancien.replace(" (jour)", "")] = neuf.replace(" (jour)", "")
        w["name"]["fr"] = neuf
    c["waypoints_fr_ref"] = ("/v2/continents/1/floors/…/maps/…/pois?lang=fr, id tire du code de chat (lu le 09/10/2026)")
    # prose francaise de la collection (how.fr, how_jsx.fr, route_note.fr)
    # Seul le nom qui suit « Point de passage : » est un point de passage ;
    # « la Forêt en flammes de Balthazar » est une region, on n'y touche pas.
    def corrige(s, tout=False):
        for a in sorted(changes, key=len, reverse=True):
            avant = r"(?<![\w])" if tout else r"(?<=Point de passage : )|(?<=Point de passage le plus proche : )"
            s = re.sub("(?:" + avant + ")" + re.escape(a) + r"(?![\w])", changes[a], s)
        return s
    for it in c["items"]:
        for k in ("how", "how_jsx"):
            if isinstance(it.get(k), dict) and it[k].get("fr"):
                it[k]["fr"] = corrige(it[k]["fr"])
    if isinstance(c.get("route_note"), dict):  # ne nomme que des points de passage
        c["route_note"]["fr"] = corrige(c["route_note"]["fr"], tout=True)

# Ailleurs : « point de passage du X [&code] » — le code dit lequel, l'API dit son nom.
RX = re.compile(r"([Pp]oint de passage) (?:du |de la |de l'|des |d'|de )?([^\[\]«»]{2,60}?) (\[&B[A-Za-z0-9+/=]+\])")
def par_code(m):
    try: pid = poi(m.group(3))
    except Exception: return m.group(0)
    if pid not in API: return m.group(0)
    return m.group(1) + API[pid][len("Point de passage"):] + " " + m.group(3)
nb = [0]
def walk(o, fr):
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(v, str) and (fr or k == "fr"):
                nv = RX.sub(par_code, v)
                if nv != v: o[k] = nv; nb[0] += 1
            else: walk(v, fr or k == "fr")
    elif isinstance(o, list):
        for v in o: walk(v, fr)
walk(d["legendaries"], False); walk(d["craft_components"], False)
print(f"{nb[0]} textes « point de passage … [code] » alignes")
d["_meta"]["last_updated"] = "2026-10-09"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
for a, b in changes.items(): print(f"  {a} -> {b}")
print(f"{len(changes)} noms changes")
