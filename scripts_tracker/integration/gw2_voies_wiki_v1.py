#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Voies d'obtention lues sur les captures : remplace les sources « unknown ».

Usage : python3 scripts_tracker/integration/gw2_voies_wiki_v1.py SRC DST

149 composants portaient une source `unknown` (« voie a lire sur le wiki »)
alors que leur page est au depot, la plupart depuis le 24/10 (wiki hors
ligne) ou le lot du 03/11. La section Acquisition de chaque page nomme ses
voies par ses sous-titres (Gathered from, Contained in, Dropped by, Salvaged
from, Sold by, Recipe…). Chaque sous-titre devient une source typee, avec les
trois premiers noms qu'elle cite et la reference de la section.

Rien n'est compte ici : aucune arete n'est posee. Une recette ou un prix que
l'arbre doit compter passe par les aretes (gw2_edges_wiki + integration) ;
ces sources disent seulement d'ou vient la feuille. La source `trading_post`
reste a cote, inchangee.
"""
import html as H
import json, re, sys, unicodedata
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-11-03"
WK = Path("ressources/wiki")

TYPES = {  # sous-titre -> (type, libelle fr, libelle en)
    "Gathered_from": ("gathering", "Récolté sur", "Gathered from"),
    "Contained_in": ("chest", "Contenu dans", "Contained in"),
    "Dropped_by": ("drop", "Butin de", "Dropped by"),
    "Salvaged_from": ("salvage", "Recyclage de", "Salvaged from"),
    "Extracted_from": ("salvage", "Extrait de", "Extracted from"),
    "Sold_by": ("vendor", "Vendu par", "Sold by"),
    "Recipe": ("craft", "Recette", "Recipe"),
    "Recipes": ("craft", "Recettes", "Recipes"),
    "Rewarded_by": ("reward", "Récompense de", "Rewarded by"),
    "Reward_tracks": ("reward_track", "Piste de récompenses", "Reward tracks"),
    "PvP_League_reward_track": ("pvp_reward_track", "Piste de ligue JcJ", "PvP League reward track"),
    "Map_Bonus_Reward": ("map_bonus", "Bonus de carte", "Map bonus reward"),
    "Achievements": ("achievement", "Succès", "Achievements"),
    "Achievement": ("achievement", "Succès", "Achievement"),
}
TITRE = re.compile(r'<h([2-5])\b[^>]*?id="([A-Za-z_]+)"|<span class="mw-headline" id="([A-Za-z_]+)"')
LIEN = re.compile(r'<a href="/wiki/([^"#?]+)"[^>]*title="([^"]+)"')
IGNORE = re.compile(r"^(File:|Category:|Help:|Guild Wars 2 Wiki:|Template:)|(chance|Coin|Karma)$")


def slug(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"['’]", "", t)
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", t.lower())).strip("_")


def sections(page):
    t = (WK / f"{page}.html").read_text(encoding="utf-8", errors="ignore")
    i = t.find('id="Acquisition"')
    if i < 0:
        return []
    fin = re.search(r'<h2\b.*?id="(?!Acquisition)[A-Za-z_]+"', t[i + 1:], re.S)
    seg = t[i:i + 1 + fin.start()] if fin else t[i:]
    marques = [(m.start(), m.group(2) or m.group(3)) for m in TITRE.finditer(seg)]
    out = []
    for n, (pos, sid) in enumerate(marques):
        if sid not in TYPES:
            continue
        bout = seg[pos:marques[n + 1][0] if n + 1 < len(marques) else len(seg)]
        noms = []
        for _, titre in LIEN.findall(bout):
            titre = H.unescape(titre)
            if IGNORE.search(titre) or titre in noms or titre.replace(" ", "_") == page:
                continue
            noms.append(titre)
        out.append((sid, noms))
    return out


IX = {e["page"]: e for e in json.loads(Path("ressources/INDEX_CONTENU.json").read_text(encoding="utf-8"))}


def recette(page):
    rs = (IX.get(page) or {}).get("recettes") or []
    if not rs:
        return None
    r = rs[0]
    ing = " + ".join(f"{q} {c.replace('_', ' ').replace('%27', chr(39))}" for c, q in r["ingredients"])
    lot = f" (donne {r['sortie']})" if (r.get("sortie") or 1) > 1 else ""
    lot_en = f" (makes {r['sortie']})" if (r.get("sortie") or 1) > 1 else ""
    return (f"{r.get('discipline') or ''} {r.get('rating') or ''} : {ing}{lot}".strip(),
            f"{r.get('discipline') or ''} {r.get('rating') or ''}: {ing}{lot_en}".strip())


def vendeur(page):
    cs = (IX.get(page) or {}).get("couts_vendeur") or []
    return " + ".join(f"{x['qty']} {x['objet'].replace('_', ' ').replace('%27', chr(39))}" for x in cs) or None


faits, vides = [], []
for k, c in cc.items():
    srcs = c.get("sources") or []
    idx = [i for i, s in enumerate(srcs) if isinstance(s, dict) and s.get("type") == "unknown"]
    if not idx:
        continue
    nom = c.get("name")
    nom = nom.get("en") if isinstance(nom, dict) else nom
    page = slug(c.get("wiki") or nom or k)
    if not (WK / f"{page}.html").exists():
        vides.append((k, "pas de page"))
        continue
    secs = sections(page)
    if not secs and recette(page):
        secs = [("Recipe", [])]
    if not secs and vendeur(page):
        secs = [("Sold_by", [])]
    if not secs:
        vides.append((k, "pas de sous-titre d'acquisition"))
        continue
    neuves = []
    for sid, noms in secs:
        typ, fr, en = TYPES[sid]
        cite = ", ".join(noms[:3]) + (f" (+{len(noms) - 3})" if len(noms) > 3 else "")
        tfr = f"{fr} : {cite}." if cite else f"{fr} (voir la page)."
        ten = f"{en}: {cite}." if cite else f"{en} (see the page)."
        if typ == "craft" and recette(page):
            tfr, ten = (f"Recette — {x}." for x in recette(page))
            ten = ten.replace("Recette —", "Recipe —")
        if typ == "vendor" and vendeur(page):
            tfr = f"Vendu par : {cite} — {vendeur(page)} (prix lu, non compté)."
            ten = f"Sold by: {cite} — {vendeur(page)} (price read, not counted)."
        neuves.append({"type": typ, "verified": True, "checked": J,
                       "ref": f"ressources/wiki/{page}.html, {sid.replace('_', ' ')}",
                       "tip": {"fr": tfr, "en": ten}})
    i = idx[0]
    c["sources"] = srcs[:i] + neuves + [s for j, s in enumerate(srcs[i + 1:], i + 1) if j not in idx]
    faits.append((k, [s for s, _ in secs]))

for k, v in faits:
    print("voies", k, v)
for k, why in vides:
    print("reste", k, why)
print(f"{len(faits)} composants types, {len(vides)} restent « unknown »")
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
