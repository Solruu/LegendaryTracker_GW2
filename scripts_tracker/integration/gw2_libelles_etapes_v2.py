#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Noms et conseils d'etape decales d'une ligne dans 12 collections (03/11).

Usage : python3 scripts_tracker/integration/gw2_libelles_etapes_v2.py SRC DST

v2 (05/11) : le nouveau HTML du wiki (captures depuis le 03/11) n'a plus que
CINQ colonnes au tableau « Collection items » (#, objet, type, sous-type,
notes) ; v1 en exigeait six et sautait donc toutes les pages recapturees :
Nevermore IV (16 etapes), Astralaria II (6), The Juggernaut II (4). La note
est desormais lue dans la DERNIERE cellule, quel que soit leur nombre.

Chaque etape porte l'objet du bit (`wiki`, `name_api` : API, fait foi) et un
nom + conseil (`name`, `how`) lus dans le tableau « Collection items » de la
page de collection. Douze collections les avaient apparies par rang : or le
tableau du wiki commence parfois par l'objet de deblocage (The Mechanism pour
Astralaria IV) ou suit un autre ordre que les bits. 194 etapes affichaient le
nom et le conseil d'un autre objet (bit 12 d'Astralaria IV : « Ley-Line Font
Energy » pour un Finely Tuned Watchwork Mechanism). Les couts suivaient les
bits : aucun total ne bouge.

Correction : pour chaque etape, la ligne du tableau dont le lien « Collectible »
est l'objet du bit donne le nom ; le couple (nom, conseil fr/en) deja present
sur une autre etape de la meme collection est repris tel quel. Une etape dont
la ligne n'existait nulle part prend le conseil anglais du tableau, et le
francais reste a traduire (`how_fr_a_traduire`).
"""
import html as H
import json, re, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
J = "2026-11-05"
WK = Path("ressources/wiki")


def norm(s):
    return re.sub(r"[^a-z0-9]", "", H.unescape(s.replace("%27", "'")).lower())


def tableau(page):
    t = (WK / f"{page}.html").read_text(encoding="utf-8", errors="ignore")
    i = t.find('id="Collection_items"')
    if i < 0:
        return {}
    tb = t[t.find("<table", i):t.find("</table>", i)]
    lignes = {}
    for r in re.findall(r"<tr[^>]*>(.*?)</tr>", tb, re.S):
        cs = re.findall(r"<td[^>]*>(.*?)</td>", r, re.S)
        if len(cs) < 5:
            continue
        lien = re.findall(r'href="/wiki/([^"#]+)"', cs[1])
        if not lien:
            continue
        nom = re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", cs[1]))).strip()
        note = re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", cs[-1]))).strip()
        lignes[norm(lien[0])] = (nom, note)
    return lignes


faits = 0
for l, L in d["legendaries"].items():
    for ck, col in (L.get("collections") or {}).items():
        items = col.get("items") or []
        mal = [st for st in items if st.get("wiki") and norm(st["name"]) not in norm(st["wiki"])
               and norm(st["wiki"]) not in norm(st["name"])]
        if len(mal) < 2 or not (WK / f"{ck}.html").exists():
            continue
        tab = tableau(ck)
        if not tab:
            continue
        par_nom = {norm(st["name"]): (st["name"], st.get("how")) for st in items}
        for st in mal:
            ligne = tab.get(norm(st["wiki"]))
            if not ligne:
                continue
            nom, note = ligne
            if norm(nom) in par_nom:
                st["name"], st["how"] = par_nom[norm(nom)][0], par_nom[norm(nom)][1]
            else:
                st["name"] = nom
                st["how"] = {"fr": note, "en": note}
                st["how_fr_a_traduire"] = True
            st["how_ref"] = f"ressources/wiki/{ck}.html, Collection items (ligne de l'objet du bit, {J})"
            faits += 1
        print(l, ck, len(mal))
print(faits, "etapes reetiquetees")
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
