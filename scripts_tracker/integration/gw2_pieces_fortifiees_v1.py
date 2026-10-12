#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recettes des 26 pieces fortifiees restantes (captures d'Antoine du 12/10/2026).

Usage : python3 scripts_tracker/integration/gw2_pieces_fortifiees_v1.py SRC DST

Lit la boite Recipe de chaque `ressources/wiki/*fortified*.html` (ingredients,
id d'objet) et pose les aretes ingredient -> piece. Les 4 pieces deja posees
(v394) sont verifiees, pas reposees. Deux ingredients n'existaient pas :
Spiritwood Pistol Frame et Spiritwood Staff Shaft — crees en feuilles
d'artisanat, recette non capturee (listes dans PAGES_A_CAPTURER).
"""
import html, json, re, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
W = Path("ressources/wiki")
JOUR = "2026-10-12"

def texte(p):
    raw = p.read_text(encoding="utf-8")
    raw = re.sub(r"<img[^>]*alt=\"([^\"]*)\"[^>]*>", r" [\1] ", raw)
    raw = re.sub(r"<script.*?</script>", " ", raw, flags=re.S)
    raw = re.sub(r"<style.*?</style>", " ", raw, flags=re.S)
    raw = re.sub(r"<[^>]+>", " ", raw)
    t = re.sub(r"\s+", " ", html.unescape(raw))
    return re.sub(r"!function\(\)\{.*?\}\(\);?", "", t)

def slug(n):
    return re.sub(r"[^a-z0-9]+", "_", n.lower().replace("'", "")).strip("_")

d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
par_nom = {}
for k, v in cc.items():
    n = v.get("name"); n = n.get("en") if isinstance(n, dict) else n
    if n: par_nom.setdefault(n, k)

def lien(enfant, parent, n):
    c = cc[enfant]; c.setdefault("qty", {})
    c["qty"][parent] = n
    if parent not in c.setdefault("needed_for", []):
        c["needed_for"].append(parent)

poses, verifiees, crees = 0, 0, []
for page in sorted(W.glob("*fortified*.html")):
    pk = page.stem
    assert pk in cc, pk
    t = texte(page)
    i = t.find("Ingredients")
    seg = t[i + 12:i + 500].split(" Show base")[0].strip()
    ings = [(int(q), nm.strip()) for q, nm in re.findall(r"(\d+) \[[^\]]+\] ([^\[]+?)(?= \d+ \[|$)", seg)]
    assert len(ings) == 3, (pk, ings)
    api = int(re.findall(r"API (\d+)", t)[0])
    piece = cc[pk]
    deja = any(pk in (cc[c].get("qty") or {}) for c in cc)
    for q, nm in ings:
        ck = par_nom.get(nm)
        if not ck:
            ck = slug(nm)
            cc[ck] = {"name": nm, "kind": "advanced_craft", "farmable": False, "qty": {}, "needed_for": [],
                      "sources": [{"type": "craft", "tip": {
                          "fr": "Pièce d'arme artisanale — recette non capturée : page à verser.",
                          "en": "Crafted weapon part — recipe not captured: page to add."}}],
                      "ref": f"nom lu dans {page} (boîte Recipe) ; recette non capturee",
                      "verified": False, "checked": JOUR}
            par_nom[nm] = ck; crees.append(ck)
        if deja:
            assert (cc[ck].get("qty") or {}).get(pk) == q, (pk, ck)
        else:
            lien(ck, pk, q)
    if deja:
        verifiees += 1
        continue
    piece.update({"apiId": api, "verified": True, "checked": JOUR, "ref": f"{page} (boîte Recipe)"})
    piece["sources"] = [{"type": "craft", "tip": {"fr": "Pièce fortifiée (artisanat 500).", "en": "Fortified part (crafted at 500)."}}]
    poses += 1
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"pieces posees : {poses} ; deja posees et verifiees : {verifiees} ; ingredients crees : {crees}")
