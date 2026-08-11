#!/usr/bin/env python3
"""
Régénère les trois fichiers de référence du tracker depuis l'API publique GW2.

  gw2_currencies_ref.json     /v2/currencies
  gw2_materials_ref.json      /v2/materials  (fetch en deux temps : IDs puis détails)
  gw2_achievements_ref.json   /v2/achievements/categories + /v2/achievements

Aucune clé API nécessaire : tous les endpoints utilisés sont publics.

À lancer localement — l'environnement de Claude n'a pas d'accès réseau vers
api.guildwars2.com.

    python3 gw2_refresh_refs_v1.py                  # écrit à côté du script
    python3 gw2_refresh_refs_v1.py --lang fr        # référentiel en français
    python3 gw2_refresh_refs_v1.py --dry-run        # compare sans écrire

Le bloc `legendary_tracker_ids` du référentiel des achievements est de la donnée
éditoriale : ses clés sont préservées, seuls les libellés issus de l'API sont
rafraîchis. Un achievement disparu de l'API est conservé et signalé.
"""

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.guildwars2.com/v2"
CHUNK = 200          # plafond de l'API pour le paramètre ids
RETRIES = 3
PAUSE = 0.25         # courtoisie envers l'API entre deux lots


def get(path: str, tries: int = RETRIES):
    """GET JSON avec quelques tentatives — l'API renvoie parfois des 5xx passagers."""
    url = f"{API}{path}"
    last = None
    for n in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=45) as r:
                return json.loads(r.read().decode("utf-8"))
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            last = e
            time.sleep(1.5 * (n + 1))
    raise SystemExit(f"[ERREUR] {url} — {last}")


def get_many(endpoint: str, ids, lang: str):
    """Récupère des entrées par lots de CHUNK."""
    out = []
    ids = list(ids)
    for i in range(0, len(ids), CHUNK):
        chunk = ids[i:i + CHUNK]
        sep = "&" if "?" in endpoint else "?"
        out += get(f"{endpoint}{sep}ids={','.join(map(str, chunk))}&lang={lang}")
        sys.stderr.write(f"\r  {endpoint} : {min(i + CHUNK, len(ids))}/{len(ids)}")
        sys.stderr.flush()
        time.sleep(PAUSE)
    sys.stderr.write("\n")
    return out


def build_currencies(lang: str, previous: dict | None = None) -> dict:
    cur = get_many("/currencies", get("/currencies"), lang)
    return {
        "_meta": {
            "source": "/v2/currencies",
            "count": len(cur),
            "lang": lang,
            "generated": time.strftime("%Y-%m-%d"),
        },
        # Structure historique : liste 'all', et bloc editorial 'legendary_tracker'.
        "legendary_tracker": (previous or {}).get("legendary_tracker", {}),
        "all": [
            {"id": c["id"], "name": c["name"], "description": c.get("description", "")}
            for c in sorted(cur, key=lambda x: x["id"])
        ],
    }


def build_materials(lang: str, previous: dict | None = None) -> dict:
    # /v2/materials sans paramètre ne renvoie que les IDs de catégories.
    cats = get_many("/materials", get("/materials"), lang)
    item_ids = sorted({i for c in cats for i in c.get("items", [])})
    items = {it["id"]: it for it in get_many("/items", item_ids, lang)}
    out = {}
    for c in sorted(cats, key=lambda x: x.get("order", 0)):
        out[c["name"]] = [
            {"id": i, "name": items[i]["name"]}
            for i in c.get("items", []) if i in items
        ]
    # Blocs editoriaux et index derives : preserves, sinon chaque regeneration
    # les detruit en silence (constate le 11/08/2026).
    flat = {str(i["id"]): i["name"] for rows in out.values() for i in rows}
    return {
        "_meta": {
            "source": "/v2/materials + /v2/items",
            "preserved": "flat + legendary_tracker_ids",
            "categories": len(out),
            "count": sum(len(v) for v in out.values()),
            "lang": lang,
            "generated": time.strftime("%Y-%m-%d"),
            "note": "/v2/materials sans paramètre ne renvoie que des IDs de catégories : "
                    "fetch en deux temps obligatoire.",
        },
        "by_category": out,
        "legendary_tracker_ids": (previous or {}).get("legendary_tracker_ids", {}),
        "flat": flat,
    }


def build_achievements(lang: str, previous: dict | None) -> dict:
    groups = get_many("/achievements/groups", get("/achievements/groups"), lang)
    cats = {c["id"]: c for c in get_many("/achievements/categories",
                                         get("/achievements/categories"), lang)}
    ach_ids = sorted({a if isinstance(a, int) else a["id"]
                      for c in cats.values() for a in c.get("achievements", [])})
    ach = {a["id"]: a for a in get_many("/achievements", ach_ids, lang)}

    by_group = {}
    for g in sorted(groups, key=lambda x: x.get("order", 0)):
        block = {}
        for cid in g.get("categories", []):
            c = cats.get(cid)
            if not c:
                continue
            rows = []
            for a in c.get("achievements", []):
                aid = a if isinstance(a, int) else a["id"]
                d = ach.get(aid)
                if not d:
                    continue
                row = {"id": aid, "name": d["name"]}
                if d.get("description"):
                    row["description"] = d["description"]
                rows.append(row)
            if rows:
                block[c["name"]] = sorted(rows, key=lambda r: r["name"])
        if block:
            by_group[g["name"]] = block

    # Index inverse pour retrouver group/catégorie d'un achievement.
    where = {}
    for gname, block in by_group.items():
        for cname, rows in block.items():
            for r in rows:
                where[r["id"]] = (gname, cname)

    # Bloc éditorial : clés préservées, libellés rafraîchis.
    tracker = {}
    missing = []
    for key, val in ((previous or {}).get("legendary_tracker_ids") or {}).items():
        aid = int(key)
        d = ach.get(aid)
        entry = dict(val)
        if d:
            entry["name"] = d["name"]
            if d.get("description"):
                entry["description"] = d["description"]
            g, c = where.get(aid, (entry.get("api_group"), entry.get("api_category")))
            entry["api_group"], entry["api_category"] = g, c
            entry.pop("_missing_from_api", None)
        else:
            entry["_missing_from_api"] = True
            missing.append((aid, val.get("name", "?")))
        tracker[key] = entry

    return {
        "_meta": {
            "source": "/v2/achievements/categories + /v2/achievements",
            "count": len(ach),
            "groups": len(by_group),
            "lang": lang,
            "generated": time.strftime("%Y-%m-%d"),
            "note": f"Achievements GW2 — {len(ach)} entrées, {len(by_group)} groupes. "
                    "Inclut uniquement les achievements avec catégorie publique. "
                    "Certains achievements existent en jeu sans être exposés par l'API.",
        },
        "legendary_tracker_ids": tracker,
        "by_group": by_group,
    }, missing


def report(label: str, old: dict | None, new: dict, counter):
    o = counter(old) if old else 0
    n = counter(new)
    delta = f"{n - o:+d}" if old else "nouveau"
    print(f"  {label:28} {n:6}  ({delta})")


def main():
    ap = argparse.ArgumentParser(description="Régénère les référentiels GW2 du tracker")
    ap.add_argument("--lang", default="en", help="Langue des libellés (en, fr, de, es)")
    ap.add_argument("--out", default=None, help="Dossier de sortie (défaut : dossier du script)")
    ap.add_argument("--dry-run", action="store_true", help="Compare sans écrire")
    ap.add_argument("--only", choices=["currencies", "materials", "achievements"],
                    help="Ne régénérer qu'un seul référentiel")
    args = ap.parse_args()

    folder = Path(args.out) if args.out else Path(__file__).parent
    folder.mkdir(parents=True, exist_ok=True)

    def load(name):
        p = folder / name
        if not p.exists():
            return None
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return None

    jobs = ["currencies", "materials", "achievements"]
    if args.only:
        jobs = [args.only]

    print(f"Langue : {args.lang} | dossier : {folder}"
          f"{' | DRY-RUN' if args.dry_run else ''}\n")
    results, missing = {}, []

    if "currencies" in jobs:
        print("Devises…")
        results["gw2_currencies_ref.json"] = build_currencies(args.lang, load("gw2_currencies_ref.json"))
    if "materials" in jobs:
        print("Matériaux…")
        results["gw2_materials_ref.json"] = build_materials(args.lang, load("gw2_materials_ref.json"))
    if "achievements" in jobs:
        print("Achievements…")
        prev = load("gw2_achievements_ref.json")
        results["gw2_achievements_ref.json"], missing = build_achievements(args.lang, prev)

    print("\nRésultat :")
    counters = {
        "gw2_currencies_ref.json": lambda d: len(d.get("all", [])),
        "gw2_materials_ref.json": lambda d: d.get("_meta", {}).get("count", 0),
        "gw2_achievements_ref.json": lambda d: d.get("_meta", {}).get("count", 0),
    }
    for name, data in results.items():
        report(name, load(name), data, counters[name])

    # Garde-fou : une regeneration ne doit jamais faire disparaitre un bloc.
    for name, data in results.items():
        prev = load(name)
        if prev:
            lost = set(prev) - set(data)
            if lost:
                print(f"\n\u26a0 {name} : blocs perdus {sorted(lost)} \u2014 ecriture annulee.")
                sys.exit(1)

    if missing:
        print("\n⚠ Suivis par le tracker mais absents de l'API "
              "(conservés, marqués _missing_from_api) :")
        for aid, nm in missing:
            print(f"    {aid}  {nm}")

    if args.dry_run:
        print("\nDry-run : aucun fichier écrit.")
        return

    for name, data in results.items():
        (folder / name).write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n{len(results)} fichier(s) écrit(s).")
    print("Pense à rebuild : python3 gw2_build_html_v2.py --jsx <tracker>.jsx --out docs/index.html")


if __name__ == "__main__":
    main()
