#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse les tableaux « Dropped by » des captures de ressources/wiki/.

Deux profondeurs de capture coexistent. Les fragments (*__dropped_by.html) ne
contiennent que le tableau. Les articles complets le noient entre les recettes
et les conteneurs : il faut borner la section avant de lire, sinon on ramasse
des lignes de recette.

Le wiki tronque ces tableaux a 150 lignes et pousse le reste derriere un lien
« further results ». Une capture tronquee est signalee, jamais rendue comme si
elle etait complete : une absence dans une vue partielle n'est pas une absence.

Chaque ligne du wiki est « NPC | Level | Rank | Locations | Quantity ». La
colonne Locations contient soit une carte seule, soit « Sous-zone (Carte) ».
Ce parseur restitue les deux niveaux separement : agreger a la carte perd les
sous-zones, ce qui est exactement l'erreur que ce fichier repare.

Sortie : gw2_dropped_by_dump.json — {ligne: [ {npc, level, rank, spots:[{zone,
map}], qty} ]}. Aucune deduction, aucune agregation : seulement du HTML mis a
plat.
"""
import json, os, re, sys
from html import unescape

DIR = "ressources/wiki"
OUT = "gw2_dropped_by_dump.json"

# Les 32 captures des huit lignes de trophees : fichier -> (ligne, palier).
LIGNES = {
    "bones":  ["bone", "heavy_bone", "large_bone", "ancient_bone__dropped_by"],
    "claws":  ["claw", "sharp_claw", "large_claw", "vicious_claw__dropped_by"],
    "fangs":  ["fang", "sharp_fang", "large_fang", "vicious_fang__dropped_by"],
    "scales": ["scale", "smooth_scale", "large_scale", "armored_scale__dropped_by"],
    "totems": ["totem", "engraved_totem", "intricate_totem", "elaborate_totem__dropped_by"],
    "dust":   ["pile_of_radiant_dust", "pile_of_luminous_dust",
               "pile_of_incandescent_dust", "pile_of_crystalline_dust__dropped_by"],
    "venom":  ["venom_sac", "full_venom_sac", "potent_venom_sac",
               "powerful_venom_sac__dropped_by"],
    "blood":  ["vial_of_blood", "vial_of_thick_blood", "vial_of_potent_blood",
               "vial_of_powerful_blood__dropped_by"],
}
CIBLES = {f"{n}.html": (lig, f"t{i+3}")
          for lig, noms in LIGNES.items() for i, n in enumerate(noms)}

TAG = re.compile(r"<[^>]+>")
HEADLINE = re.compile(r'class="mw-headline" id="([^"]+)"')
COLONNES = ["NPC", "Level", "Rank", "Locations"]
PLAFOND = 150  # limite d'affichage du wiki, au-dela : lien « further results »
ROW = re.compile(r"<tr[^>]*>(.*?)</tr>", re.S)
CELL = re.compile(r"<td[^>]*>(.*?)</td>", re.S)
# « Sous-zone (Carte) » : le lien parenthese qui suit immediatement un lien
SPOT = re.compile(
    r'<a href="/wiki/[^"]+"[^>]*>([^<]+)</a>\s*\(\s*<a href="/wiki/[^"]+"[^>]*>([^<]+)</a>\s*\)'
)
LINK = re.compile(r'<a href="/wiki/[^"]+"[^>]*>([^<]+)</a>')


def txt(h):
    return unescape(TAG.sub("", h)).strip()


def spots(cell):
    """Rend [{zone, map}] ; zone vaut None quand le wiki ne donne que la carte."""
    out, consumed = [], []
    for m in SPOT.finditer(cell):
        out.append({"zone": unescape(m.group(1)).strip(),
                    "map": unescape(m.group(2)).strip()})
        consumed.append((m.start(), m.end()))
    # Les liens hors des couples « zone (carte) » sont des cartes nues.
    for m in LINK.finditer(cell):
        if any(a <= m.start() < b for a, b in consumed):
            continue
        name = unescape(m.group(1)).strip()
        if any(s["zone"] == name or s["map"] == name for s in out):
            continue
        out.append({"zone": None, "map": name})
    return out


def section(html, path):
    """Isole la section « Dropped by ». Echoue bruyamment plutot que de rendre vide."""
    i = html.find('id="Dropped_by"')
    if i < 0:
        raise ValueError(f"{path} : pas de section « Dropped by »")
    m = HEADLINE.search(html, i + 10)
    return html[i:m.start() if m else len(html)]


def verifie_colonnes(bloc, path):
    entetes = [txt(h) for h in re.findall(r"<th[^>]*>(.*?)</th>", bloc, re.S)]
    entetes = [e.replace("[hide]", "").strip() for e in entetes]
    if entetes[:4] != COLONNES:
        raise ValueError(f"{path} : colonnes inattendues {entetes[:5]}, attendu {COLONNES}")


def parse(path):
    html = open(path, encoding="utf-8", errors="replace").read()
    if "__dropped_by" not in os.path.basename(path):
        html = section(html, path)
    verifie_colonnes(html, path)
    tronque = "further results" in html
    rows = []
    for r in ROW.findall(html):
        cells = CELL.findall(r)
        if len(cells) < 5:
            continue  # en-tete ou ligne tronquee
        rows.append({
            "npc": txt(cells[0]),
            "level": txt(cells[1]),
            "rank": txt(cells[2]) or "Normal",
            "spots": spots(cells[3]),
            "qty": txt(cells[4]),
        })
    return rows, tronque


def main():
    if not os.path.isdir(DIR):
        sys.exit(f"repertoire absent : {DIR}")
    data, total = {}, 0
    tronques = []
    for f in sorted(os.listdir(DIR)):
        if f not in CIBLES:
            continue
        ligne, palier = CIBLES[f]
        rows, tronque = parse(os.path.join(DIR, f))
        for r in rows:
            r["page"] = 1
        sources = [f]
        # Suites de pagination : <base>__dropped_by_p2.html, _p3…
        base = f[:-len(".html")].replace("__dropped_by", "")
        p = 2
        while True:
            suite = f"{base}__dropped_by_p{p}.html"
            chemin = os.path.join(DIR, suite)
            if not os.path.exists(chemin):
                break
            srows, stronque = parse(chemin)
            for r in srows:
                r["page"] = p
            connus = {r["npc"] for r in rows}
            doublons = [r["npc"] for r in srows if r["npc"] in connus]
            if doublons:
                raise ValueError(f"{suite} : {len(doublons)} doublons avec la page "
                                 f"precedente, ex. {doublons[0]} — mauvais offset ?")
            rows += srows
            sources.append(suite)
            tronque = stronque
            p += 1
        data.setdefault(ligne, {})[palier] = {
            "sources": sources, "tronque": tronque, "npc": rows,
        }
        total += len(rows)
        if tronque:
            tronques.append(f"{ligne} {palier}")
        sans_zone = sum(1 for r in rows if r["spots"] and all(s["zone"] is None for s in r["spots"]))
        marque = "  ⚠ TRONQUE a 150" if tronque else ""
        pages = f"  ({len(sources)} pages)" if len(sources) > 1 else ""
        print(f"{ligne:10s} {palier}  {len(rows):4d} NPC  {sans_zone:3d} sans sous-zone{pages}{marque}")
    if tronques:
        print("\n⚠ captures tronquees, conclusions partielles : " + ", ".join(tronques))
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n{total} entrees ecrites dans {OUT}")


if __name__ == "__main__":
    main()
