#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse les tableaux « Dropped by » de ressources/wiki/*__dropped_by.html.

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

TAG = re.compile(r"<[^>]+>")
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


def parse(path):
    html = open(path, encoding="utf-8", errors="replace").read()
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
    return rows


def main():
    if not os.path.isdir(DIR):
        sys.exit(f"repertoire absent : {DIR}")
    data, total = {}, 0
    for f in sorted(os.listdir(DIR)):
        if not f.endswith("__dropped_by.html"):
            continue
        key = f[: -len("__dropped_by.html")]
        rows = parse(os.path.join(DIR, f))
        data[key] = rows
        total += len(rows)
        orphelines = sum(1 for r in rows if not r["spots"])
        sans_zone = sum(1 for r in rows if r["spots"] and all(s["zone"] is None for s in r["spots"]))
        print(f"{key:28s} {len(rows):4d} NPC  "
              f"{sans_zone:3d} sans sous-zone  {orphelines:3d} sans lieu")
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n{total} entrees ecrites dans {OUT}")


if __name__ == "__main__":
    main()
