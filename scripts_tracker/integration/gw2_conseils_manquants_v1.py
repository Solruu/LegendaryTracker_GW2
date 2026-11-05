#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Conseils d'etape manquants, lus au tableau « Collection items » (05/11).

Usage : python3 scripts_tracker/integration/gw2_conseils_manquants_v1.py SRC DST

36 etapes n'avaient pas de `how`. 25 ont une note au tableau de leur page de
collection (lasting_bonds_*.html pour les trois paliers du bandoulier de
Vision, legendary_weapon_eternity.html) : note anglaise reprise telle quelle,
traduction francaise faite ici (noms d'objets, de PNJ et de lieux laisses en
anglais, comme `ressources/traductions/REGLES.md`). Les 10 plats d'Orrax et la
poussiere d'Eternity n'ont pas de note au tableau : ce sont des recettes
(Cuisine, Forge), deja decomposees en ingredients.
"""
import html as H
import json
import re
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
J = "2026-11-05"
PAGES = {"lb_where_we_come_from": "lasting_bonds_where_we_come_from", "lb_what_we_do_here": "lasting_bonds_what_we_do_here",
         "lb_what_comes_next": "lasting_bonds_what_comes_next", "legendary_weapon_eternity": "legendary_weapon_eternity"}
FR = {
 ("gen1_eternity", 0): "Se combine à la Forge mystique avec Twilight, 5 Piles of Crystalline Dust et 10 Philosopher's Stones pour créer Eternity.",
 ("gen1_eternity", 1): "Se combine à la Forge mystique avec Sunrise, 5 Piles of Crystalline Dust et 10 Philosopher's Stones pour créer Eternity.",
 ("lb_where_we_come_from", 0): "Indice : obtenu en terminant l'épisode d'histoire « A Bug in the System ».",
 ("lb_where_we_come_from", 1): "Indice : remets un Simple Olmakhan Bandolier à Efi, près de la porte sud d'Atholma.",
 ("lb_where_we_come_from", 2): "Indice : parle à Lorekeeper Rhosan, au nord d'Atholma.",
 ("lb_where_we_come_from", 3): "Indice : parle à Marlen, près de Jemandi Market.",
 ("lb_where_we_come_from", 4): "Indice : trouve la retraite d'Ewyn, à l'est d'Olma's Legacy.",
 ("lb_where_we_come_from", 5): "Indice : explore au-dessus de la Specimen Chamber avec ton chacal.",
 ("lb_what_we_do_here", 0): "Indice : récompense de Lasting Bonds: Where We Come From.",
 ("lb_what_we_do_here", 1): "Indice : remets un Handwoven Olmakhan Bandolier à Efi, près de la porte sud d'Atholma.",
 ("lb_what_we_do_here", 2): "Indice : vaincs la gazelle Old Stonehoof et encaisse sa prime.",
 ("lb_what_we_do_here", 3): "Indice : vaincs le karka Ironshell et encaisse sa prime.",
 ("lb_what_we_do_here", 4): "Indice : vaincs le Spirit of the Storm dans les Ruined Paths.",
 ("lb_what_we_do_here", 5): "Indice : vaincs les élémentaires qui errent dans les Hunting Grounds. Butin possible des événements « Defeat the rampaging elementals! », « Destroy the stormcaller echoes » et « Help Elder Rhona track down the source of the storm » (80, groupe).",
 ("lb_what_we_do_here", 6): "Indice : récolte le bois flotté rejeté après la tempête — abats les eerie driftwoods après la méta Gathering Storms.",
 ("lb_what_we_do_here", 7): "Indice : trouve l'endroit où Zohaqan regardait le lever du soleil.",
 ("lb_what_we_do_here", 8): "Indice : achat chez Researcher Thale, près du Magnetics Lab.",
 ("lb_what_comes_next", 0): "Indice : récompense de Lasting Bonds: What We Do Here.",
 ("lb_what_comes_next", 1): "Indice : remets un Pocketed Olmakhan Bandolier à Efi, près de la porte sud d'Atholma.",
 ("lb_what_comes_next", 2): "Indice : vaincs l'hydre légendaire Starcaller et encaisse sa prime.",
 ("lb_what_comes_next", 3): "Indice : vaincs la momie légendaire Seneb the Desecrated et encaisse sa prime.",
 ("lb_what_comes_next", 4): "Indice : accède à la Specimen Chamber et fouille-la.",
 ("lb_what_comes_next", 5): "Indice : dans un coffre au fond d'une grotte des Whispering Grottos, Elon Riverlands.",
 ("lb_what_comes_next", 6): "Indice : vaincs les deux boss de la Specimen Chamber. Rapporte l'arc à Efi pour « Shadow and Sun ».",
 ("lb_what_comes_next", 7): "Indice : rapporte Mom's Bow à Efi, puis l'Olmakhan Bow of Force. L'arc reste ensuite dans l'inventaire et ne peut pas être recyclé.",
}


def norm(s):
    return re.sub(r"[^a-z0-9]", "", H.unescape(s.replace("%27", "'").replace("%22", '"')).lower())


def tableau(page):
    t = Path(f"ressources/wiki/{page}.html").read_text(encoding="utf-8")
    i = t.find('id="Collection_items"')
    tb = t[t.find("<table", i):t.find("</table>", i)]
    out = {}
    for r in re.findall(r"<tr[^>]*>(.*?)</tr>", tb, re.S):
        cs = re.findall(r"<td[^>]*>(.*?)</td>", r, re.S)
        if len(cs) < 5:
            continue
        lien = re.findall(r'href="/wiki/([^"#]+)"', cs[1])
        if lien:
            out[norm(lien[0])] = re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", cs[-1]))).strip()
    return out


n = 0
for l, L in d["legendaries"].items():
    for ck, col in (L.get("collections") or {}).items():
        if ck not in PAGES:
            continue
        tab = tableau(PAGES[ck])
        for it in col["items"]:
            if it.get("how"):
                continue
            en = tab.get(norm(it["wiki"]))
            if not en:
                continue
            en = re.sub(r" ([.,])", r"\1", en)
            fr = FR[(ck if ck != "legendary_weapon_eternity" else l, it["bit"])]
            it["how"] = {"fr": fr, "en": en}
            it["how_verified"], it["how_checked"] = True, J
            it["how_ref"] = f"ressources/wiki/{PAGES[ck]}.html, Collection items"
            n += 1
miss=[(l,ck,it["bit"]) for l,L in d["legendaries"].items() for ck,col in (L.get("collections") or {}).items() if ck in PAGES for it in col["items"] if not it.get("how")]
assert n == 25, (n, miss)
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print(n, "conseils poses")
