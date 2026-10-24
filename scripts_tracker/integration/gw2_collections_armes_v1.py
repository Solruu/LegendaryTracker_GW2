#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Precurseurs gen1 / gen2 : ce que leurs collections consomment (24/10).

Usage : python3 scripts_tracker/integration/gw2_collections_armes_v1.py SRC DST [--ids]

Decision d'Antoine (20/10) : les precurseurs se comptent par leurs
collections, toujours ; le comptoir n'est qu'un raccourci signale. Feu vert
sur le volume le 24/10. Le wiki etant hors ligne (24/10), cette passe ne pose
que ce que les sources deja au depot tranchent :

1. Achats a Scholar Mossi (scholar_mossi.html, colonne Cost) : Bandit Crests,
   Geodes, Obsidian Shards, Karka Shells, Passion Flowers, Stabilizing
   Matrices. Bandit Crest (27) et Geode (25) : monnaies du portefeuille
   (gw2_currencies_ref.json) ; Karka Shell (37897, gw2_materials_ref.json).
2. Achats a Grandmaster Craftsman Hobbs (grandmaster_craftsman_hobbs.html) :
   livres « Vol. N » et recettes des objets d'etape (« Recipe: X » ajoute au
   cout de l'etape X). Karma, eclats d'esprit, magie non liee comptes ; les
   pieces de monnaie ne sont pas posees (meme regle que partout).
3. Objets d'etape fabriques : recette de l'API (api_collections_armes_
   20261020.json, bits des 102 collections et recettes). Ingredients :
   - un autre objet d'etape : ecarte (compte a sa propre etape) ;
   - produits internes a la chaine : Spirit of … (recyclage d'un objet
     d'etape), Expertise in … et Essence of … (recompenses des collections
     precedentes, description de l'API) : ecartes ;
   - composant existant (par apiId) : compte ;
   - sinon : composant cree (api_ingredients_armes_20261024.json), decompose
     selon sa recette API quand elle a plusieurs ingredients (regle C7), le
     raffinage a un ingredient restant une feuille ; sans recette, la
     description de l'API dit d'ou il vient.
4. Precurseurs : la source « unknown » devient la collection (fabrique une
   fois par compte apres la derniere collection, couts comptes aux etapes).

Reste (wiki) : echanges aux maitres artisans (Requisitions, Art of …), achats
des collections gen2 aupres d'autres PNJ, decouvertes payantes.
"""
import json, sys, re
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
IDS = "--ids" in sys.argv
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-24"
WK = "ressources/wiki/"
AP = "ressources/api/"
W = json.loads(Path(AP + "api_collections_armes_20261020.json").read_text(encoding="utf-8"))
I = json.loads(Path(AP + "api_ingredients_armes_20261024.json").read_text(encoding="utf-8"))
TP = set(json.loads(Path(AP + "comptoir_20261020.json").read_text(encoding="utf-8"))["au_comptoir"])
P = Path(AP + "comptoir_armes_20261024.json")
if P.exists():
    TP |= set(json.loads(P.read_text(encoding="utf-8"))["au_comptoir"])


def lignes(page):
    """(objet, [(n, monnaie)]) des tables vendeur d'une capture."""
    import html as H
    t = Path(WK + page + ".html").read_text(encoding="utf-8")
    out = []
    for r in re.findall(r"<tr[^>]*>(.*?)</tr>", t, re.S):
        cells = re.findall(r"<td[^>]*>(.*?)</td>", r, re.S)
        if len(cells) < 2:
            continue
        nom = re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", cells[0]))).strip()
        for c in cells[1:]:
            toks = re.findall(r'([\d,]+)\s*(?:&#160;|&nbsp;|\s)*<(?:span[^>]*>\s*<)?(?:a[^>]*>\s*)?<img[^>]*alt="([^"]+)"', c)
            if toks:
                out.append((nom, [(int(n.replace(",", "")), a) for n, a in toks]))
                break
    return out


MONNAIE = {"Bandit Crest": "bandit_crest", "Geode": "geode", "Obsidian Shard": "obsidian_shard",
           "Karka Shell": "karka_shell", "Passion Flower": "passion_flower",
           "Stabilizing Matrix": "stabilizing_matrix", "Karma": "karma", "Spirit Shard": "spirit_shard",
           "Unbound Magic": "unbound_magic"}
PIECES = {"Gold coin", "Silver coin", "Copper coin"}
MOSSI = {n: c for n, c in lignes("scholar_mossi")}
HOBBS = {n: c for n, c in lignes("grandmaster_craftsman_hobbs")}

api = {c["apiId"]: k for k, c in cc.items() if isinstance(c.get("apiId"), int) and c["apiId"] > 100}
bits = set()
ARMES = [l for l in d["legendaries"] if l.startswith(("gen1_", "gen2_"))]
for l in ARMES:
    for k, c in (d["legendaries"][l].get("collections") or {}).items():
        bits |= {b for b in W["bitItems"][str(c["id"])] if isinstance(b, int)}
IT = I["items"]
RI = {**W["recipes"], **I["recipes"]}
REC = {**{k: v for k, v in W["rec"].items() if isinstance(v, list)}, **I["rec"]}


def interne(x):
    n = (IT.get(str(x)) or {}).get("name", "")
    return n.startswith(("Spirit of ", "Expertise in ", "Essence of "))


def slug(n):
    return re.sub(r"[^a-z0-9]+", "_", n.lower().replace("'", "")).strip("_")


crees = {}
def comp(x):
    """Composant pour l'objet x (cree au besoin, decompose par sa recette)."""
    if x in api:
        return api[x]
    if x in crees:
        return crees[x]
    o = IT[str(x)]
    k = slug(o["name"])
    while k in cc:
        k += "_" + str(x)
    crees[x] = k
    r = REC.get(str(x))
    rr = RI[str(r[0])] if r else None
    srcs = []
    enfants = {}
    if rr:
        ing = [(g["item_id"], g["count"]) for g in rr["ing"]]
        noms = " + ".join(f"{n} {IT.get(str(i), {}).get('name', i)}" for i, n in ing)
        metier = "/".join(rr["disc"])
        srcs.append({"type": "craft", "verified": True, "checked": J,
                     "ref": f"{AP}api_ingredients_armes_20261024.json (recette {r[0]})",
                     "tip": {"fr": f"{metier} {rr['rating']} : {noms}" + (f" (donne {rr['n']})" if rr["n"] > 1 else "") + ".",
                             "en": f"{metier} {rr['rating']}: {noms}" + (f" (makes {rr['n']})" if rr["n"] > 1 else "") + "."}})
        if len(ing) > 1 and all(n % rr["n"] == 0 for _, n in ing):
            enfants = {i: n // rr["n"] for i, n in ing}
    else:
        desc = re.sub(r"<[^>]+>", "", o.get("desc") or "").strip()
        srcs.append({"type": "unknown", "verified": True, "checked": J,
                     "ref": f"{AP}api_ingredients_armes_20261024.json (/v2/items {x}, description)",
                     "tip": {"fr": f"Description du jeu : « {desc} » — voie détaillée à lire sur le wiki." if desc else "Voie à lire sur le wiki (hors ligne le 24/10).",
                             "en": f"In-game description: \"{desc}\" — route to read on the wiki." if desc else "Route to read on the wiki (offline on 24/10)."}})
    if x in TP:
        srcs.append({"type": "trading_post", "paid_repeatable": True, "verified": True, "checked": J,
                     "ref": f"{AP}comptoir_armes_20261024.json (/v2/commerce/prices)",
                     "tip": {"fr": "Achetable au comptoir — raccourci en or, jamais compté.",
                             "en": "Sold on the trading post — a gold shortcut, never counted."}})
    cc[k] = {"name": o["name"], "apiId": x, "kind": "intermediate" if enfants else ("refined" if rr else "material"),
             "farmable": True, "qty": {}, "needed_for": [], "sources": srcs,
             "verified": True, "checked": J, "ref": f"{AP}api_ingredients_armes_20261024.json"}
    for i, n in enfants.items():
        if interne(i):
            continue
        arete(comp(i), k, n)
    return k


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    q[parent] = q.get(parent, 0) + n
    nf = c.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


def cree_monnaie():
    for k, api_id, nom, kind, ref in (("bandit_crest", 27, "Bandit Crest", "currency", "gw2_currencies_ref.json (id 27)"),
                                      ("geode", 25, "Geode", "currency", "gw2_currencies_ref.json (id 25)"),
                                      ("karka_shell", 37897, "Karka Shell", "material", "gw2_materials_ref.json (id 37897)")):
        if k in cc:
            continue
        tips = {"bandit_crest": ("Événements de la Côte d'argent (Silverwastes) ; vendeurs du Camp Resolve et des avant-postes sécurisés.",
                                 "Earned by completing events in the Silverwastes. Accepted by vendors in Camp Resolve and at secured outposts."),
                "geode": ("Événements de Dry Top ; vendeurs de la zone.",
                          "Earned by completing events in Dry Top. Accepted by vendors throughout the area."),
                "karka_shell": ("Matière première (référentiel des matériaux) — voie de jeu à lire sur le wiki (hors ligne le 24/10).",
                                "Raw material (materials reference) — in-game route to read on the wiki (offline on 24/10).")}[k]
        typ, verif = ("map_currency", True) if kind == "currency" else ("unknown", True)
        cc[k] = {"name": nom, "apiId": api_id, "kind": kind, "farmable": True, "qty": {}, "needed_for": [],
                 "sources": [{"type": typ, "verified": verif, "checked": J,
                              "ref": ref + (" (description)" if kind == "currency" else ""),
                              "tip": {"fr": tips[0], "en": tips[1]}}],
                 "verified": True, "checked": J, "ref": ref}
        if api_id in TP and kind != "currency":
            cc[k]["sources"].append({"type": "trading_post", "paid_repeatable": True, "verified": True, "checked": J,
                                     "ref": f"{AP}comptoir_armes_20261024.json (/v2/commerce/prices)",
                                     "tip": {"fr": "Achetable au comptoir — raccourci en or, jamais compté.",
                                             "en": "Sold on the trading post — a gold shortcut, never counted."}})


cree_monnaie()
stats = {"mossi": 0, "hobbs": 0, "fab": 0, "recette_hobbs": 0}
for l in ARMES:
    for ck, col in (d["legendaries"][l].get("collections") or {}).items():
        if ck.startswith("legendary_weapon_"):
            continue
        bl = W["bitItems"][str(col["id"])]
        for i, st in enumerate(col["items"]):
            if st.get("cost"):
                continue
            b = bl[i] if i < len(bl) else None
            nom = st["name"]
            cout, refs = {}, []
            r = REC.get(str(b)) if isinstance(b, int) else None
            if r and str(b) in W["rec"]:
                rr = RI[str(r[0])]
                for g in rr["ing"]:
                    x = g["item_id"]
                    if x in bits or interne(x):
                        continue
                    k = comp(x)
                    cout[k] = cout.get(k, 0) + g["count"]
                refs.append(f"{AP}api_collections_armes_20261020.json (recette {r[0]})")
                stats["fab"] += 1
                if "Recipe: " + nom in HOBBS:
                    for n, m in HOBBS["Recipe: " + nom]:
                        if m in MONNAIE:
                            cout[MONNAIE[m]] = cout.get(MONNAIE[m], 0) + n
                    refs.append(f"{WK}grandmaster_craftsman_hobbs.html (Recipe: {nom})")
                    stats["recette_hobbs"] += 1
            elif nom in MOSSI:
                for n, m in MOSSI[nom]:
                    cout[MONNAIE[m]] = cout.get(MONNAIE[m], 0) + n
                refs.append(f"{WK}scholar_mossi.html, Items offered")
                stats["mossi"] += 1
            elif nom in HOBBS:
                for n, m in HOBBS[nom]:
                    if m in MONNAIE:
                        cout[MONNAIE[m]] = cout.get(MONNAIE[m], 0) + n
                    else:
                        assert m in PIECES, (nom, m)
                refs.append(f"{WK}grandmaster_craftsman_hobbs.html, Items offered")
                stats["hobbs"] += 1
            if cout:
                st["cost"] = cout
                st["cost_ref"] = " ; ".join(refs)

# 4. precurseurs
for l in ARMES:
    L = d["legendaries"][l]
    nom_p = L.get("precursor")
    pk = next((k for k, c in cc.items() if isinstance(nom_p, str) and c.get("name") in (nom_p, nom_p + " (weapon)")
               and l in (c.get("qty") or {})), None)
    if pk:
        s = cc[pk]["sources"]
        if any(x.get("type") == "unknown" for x in s):
            cc[pk]["sources"] = [{"type": "achievement_collection", "verified": True, "checked": J,
                                  "ref": "collections du légendaire (precursor crafting), décision d'Antoine du 20/10",
                                  "tip": {"fr": "Fabriqué une fois par compte au terme de ses collections de précurseur ; leurs coûts sont comptés étape par étape.",
                                          "en": "Crafted once per account at the end of its precursor collections; their costs are counted step by step."}}] + \
                                 [x for x in s if x.get("type") == "trading_post"]
            cc[pk]["best"] = "achievement_collection"

if IDS:
    print(json.dumps(sorted(crees)))
    sys.exit()
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST, stats, "| crees", len(crees))
