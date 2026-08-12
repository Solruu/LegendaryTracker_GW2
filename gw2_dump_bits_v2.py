#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# =============================================================================
#  FONCTION : outil de collecte de données, à lancer EN LOCAL uniquement.
#
#  Rôle    : interroge l'API GW2 et produit `gw2_bits_dump.json`, le dump des
#            définitions d'achievements (bits ordonnés, tiers, points).
#  Sert à  : rédiger les `bitTips` du tracker avec le bon index de bit, et
#            repérer hors ligne les achievements-compteurs sans étapes.
#  Ne fait PAS partie du build : n'écrit ni dans le JSX, ni dans les sources,
#            ni dans docs/index.html. Aucune clé API requise (endpoint public).
#
#  À ne pas confondre avec :
#    · gw2_refresh_refs_v2.py  → régénère les 3 gw2_*_ref.json (référentiels)
#    · gw2_build_html_v2.py    → génère docs/index.html (build de publication)
# =============================================================================
"""
gw2_dump_bits_v2.py — Dump des définitions d'achievements du tracker.

Contexte : les `bitTips` du tracker sont indexés par NUMÉRO DE BIT. Rédiger un
conseil sans connaître l'ordre exact des bits revient à l'accrocher à la
mauvaise étape. L'API GW2 est la seule source de cet ordre, et elle n'est pas
joignable depuis l'environnement de Claude — d'où ce script, à lancer en local.

Il extrait automatiquement TOUS les `achievementId` du JSX (aucune liste à
maintenir à la main), interroge /v2/achievements et écrit un dump JSON.

Usage :
    python3 gw2_dump_bits_v2.py
    python3 gw2_dump_bits_v2.py --jsx gw2_legendary_tracker_v98.jsx --lang fr

Sortie : gw2_bits_dump.json  (à committer ou à coller dans le chat)

Le dump répond à trois questions d'un coup :
  1. quels achievements exposent des `bits` (donc éligibles aux bitTips) ;
  2. lesquels sont des compteurs `tiers` sans bits (bitTips inapplicable —
     c'est le détecteur `counterNoSteps` en version hors ligne) ;
  3. le total de points d'achèvement, pour le scoring d'effort.
"""

import argparse
import json
import re
import sys
import urllib.request

API = "https://api.guildwars2.com/v2/achievements"


def extract_ids(jsx_path):
    """Récupère tous les achievementId littéraux du JSX, dédupliqués."""
    src = open(jsx_path, encoding="utf-8").read()
    ids = {int(m) for m in re.findall(r"achievementId:\s*(\d+)", src)}
    ids |= {int(m) for m in re.findall(r"ACHIEVEMENT_SEED\s*=\s*\[([^\]]*)\]", src)
            for m in re.findall(r"\d+", m)}
    return sorted(ids)


def fetch(ids, lang):
    """Interroge l'API par lots de 150 (limite de l'endpoint)."""
    out = []
    for i in range(0, len(ids), 150):
        chunk = ids[i:i + 150]
        url = f"{API}?ids={','.join(map(str, chunk))}&lang={lang}"
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                out.extend(json.load(r))
        except Exception as exc:
            print(f"  [!] lot {i // 150 + 1} en échec : {exc}", file=sys.stderr)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--jsx", default="gw2_legendary_tracker_v98.jsx")
    ap.add_argument("--lang", default="fr", choices=["fr", "en"])
    ap.add_argument("--out", default="gw2_bits_dump.json")
    args = ap.parse_args()

    ids = extract_ids(args.jsx)
    print(f"{len(ids)} achievements référencés dans {args.jsx}")

    defs = fetch(ids, args.lang)
    print(f"{len(defs)} définitions récupérées")

    payload, with_bits, counters, missing = {}, 0, [], []
    got = {d["id"] for d in defs}
    for d in sorted(defs, key=lambda x: x["id"]):
        bits = d.get("bits", [])
        tiers = d.get("tiers", [])
        tier_max = max((t.get("count", 0) for t in tiers), default=0)
        entry = {
            "name": d.get("name", ""),
            "requirement": d.get("requirement", ""),
            "description": d.get("description", ""),
            "locked_text": d.get("locked_text", ""),
            "points": sum(t.get("points", 0) for t in tiers),
            "tier_max": tier_max,
            "prerequisites": d.get("prerequisites", []),
            "flags": d.get("flags", []),
            # bits dans l'ORDRE de l'API = l'index attendu par bitTips
            "bits": [
                {"index": i, "type": b.get("type"),
                 "text": b.get("text"), "id": b.get("id")}
                for i, b in enumerate(bits)
            ],
        }
        payload[str(d["id"])] = entry
        if bits:
            with_bits += 1
        elif tier_max > 1:
            counters.append(f'{d["id"]} — {entry["name"]}')

    missing = [i for i in ids if i not in got]

    json.dump(
        {"_meta": {"source": API, "lang": args.lang, "jsx": args.jsx,
                   "count": len(payload), "with_bits": with_bits,
                   "counters_without_bits": counters, "not_returned": missing},
         "achievements": payload},
        open(args.out, "w", encoding="utf-8"),
        ensure_ascii=False, indent=2)

    print(f"\n→ {args.out}")
    print(f"   {with_bits} avec bits (bitTips possibles)")
    print(f"   {len(counters)} compteurs sans bits (bitTips inapplicable) :")
    for c in counters:
        print(f"     · {c}")
    if missing:
        print(f"   ⚠ {len(missing)} id(s) non renvoyés par l'API : {missing}")


if __name__ == "__main__":
    main()
