#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ce que demandent les requisitions et les livres « The Art of … » (03/11).

Usage : python3 scripts_tracker/parseurs/gw2_parse_requisitions_v1.py
        -> ressources/api/requisitions_lues_20261103.json

Etapes des collections gen1 / gen2 dont la page (champ `wiki` de l'etape) a
pour titre « … Requisition » ou « The Art of … ». La section Acquisition est
du texte, sans table ni lien sur les pieces, sous trois formes :
- « Trade 250 Basic Mithril Axe to a Master Weaponsmith… » ;
- « Trade the following items … : 5 Bronze Axe Blades 5 Iron Axe Blades … » ;
- « Give the following items … : Bronze Sword Blade (10) Iron Sword Blade (10) … ».
Le texte s'arrete a « Notes », « Base materials » ou au cartouche de la
collection (« Frostfang II: … »). Chaque nom est ramene au singulier (le nom
de l'objet : « Blades » -> « Blade », « Staves » -> « Stave ») et rogne des
mots qui suivent le dernier nom de piece.
Toute page dont la lecture ne donne ni 1-2 lignes (requisition) ni 6-7
(un livre, un palier par ligne) fait echouer le script.
"""
import html as H
import json, re, sys, unicodedata
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
SRC = max(RACINE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
WK = RACINE / "ressources" / "wiki"
OUT = RACINE / "ressources" / "api" / "requisitions_lues_20261103.json"

SING = {"Staves": "Stave", "Staffs": "Staff", "Blades": "Blade", "Hafts": "Haft", "Hilts": "Hilt",
        "Heads": "Head", "Backings": "Backing", "Strings": "String", "Cores": "Core", "Rods": "Rod",
        "Casings": "Casing", "Frames": "Frame", "Barrels": "Barrel", "Stocks": "Stock", "Horns": "Horn",
        "Mouthpieces": "Mouthpiece", "Daggers": "Dagger", "Pistols": "Pistol", "Hammers": "Hammer",
        "Greatswords": "Greatsword", "Swords": "Sword", "Handles": "Handle", "Shafts": "Shaft",
        "Axes": "Axe", "Maces": "Mace", "Rifles": "Rifle", "Longbows": "Longbow", "Warhorns": "Warhorn"}
NOMS = set(SING) | set(SING.values()) | {"Axe", "Mace", "Focus", "Longbow", "Bow", "Rifle", "Warhorn", "Boss"}


def slug(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"['’]", "", t)
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", t.lower())).strip("_")


def nettoie(n):
    w = n.split()
    while w and w[-1] not in NOMS:
        w.pop()
    if w and w[-1] in SING:
        w[-1] = SING[w[-1]]
    return " ".join(w)


def lire(page):
    t = (WK / f"{page}.html").read_text(encoding="utf-8", errors="ignore")
    titre = H.unescape(re.sub(r"<[^>]+>", "", re.search(r'id="firstHeading"[^>]*>(.*?)</h1>', t, re.S).group(1))).strip()
    i = t.find('id="Acquisition"')
    s = re.split(r"<table", t[i:i + 8000])[0]
    txt = re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", s))).split("Acquisition [ edit ]", 1)[1]
    txt = re.split(r" Notes \[ edit \]| Base materials \[ edit \]| (?:I|II|III|IV): ", txt)[0]
    items = []
    if re.search(r"[A-Za-z] \(\d+\)", txt):
        for n, q in re.findall(r"([A-Z][A-Za-z' -]+?)\s*\((\d+)\)", txt.split(":", 1)[1]):
            items.append((int(q), nettoie(n)))
    elif re.search(r":\s*\d+ [A-Z]", txt):
        for ch in re.split(r"(?=\b\d+ [A-Z])", txt.split(":", 1)[1]):
            m = re.match(r"(\d+) (.+)", ch.strip())
            if m:
                items.append((int(m.group(1)), nettoie(m.group(2))))
    else:
        for q, n in re.findall(r"(?:[Tt]rade|Give) (\d+) ([A-Z][A-Za-z' -]+?)(?: \(| to )", txt):
            items.append((int(q), nettoie(n)))
    return titre, items, txt.strip()


d = json.loads(SRC.read_text(encoding="utf-8"))
pages = set()
for l, L in d["legendaries"].items():
    if not l.startswith(("gen1_", "gen2_")):
        continue
    for c in (L.get("collections") or {}).values():
        for st in c.get("items", []):
            w = (st.get("wiki") or "").replace("_", " ").replace("%27", "'")
            if w.endswith("Requisition") or w.startswith("The Art of"):
                pages.add(slug(w))
res, manque = {}, []
for p in sorted(pages):
    if not (WK / f"{p}.html").exists():
        manque.append(p)
        continue
    titre, items, txt = lire(p)
    assert len(items) in (1, 2, 6, 7), (p, items)
    assert all(n for _, n in items), (p, items)
    res[p] = {"titre": titre, "items": items, "texte": txt[:600]}
OUT.write_text(json.dumps({"lu_le": "2026-11-03", "source": "ressources/wiki/<page>.html, Acquisition",
                           "etapes": res, "pages_absentes": manque}, ensure_ascii=False, indent=1) + "\n",
               encoding="utf-8")
print(f"{len(res)} pages lues, {len(manque)} absentes : {manque}")
print("objets distincts :", len({n for v in res.values() for _, n in v["items"]}))
print("ecrit", OUT)
