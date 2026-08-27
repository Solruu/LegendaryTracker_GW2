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
gw2_dump_bits_v3.py — Dump des définitions d'achievements du tracker.

Contexte : les `bitTips` du tracker sont indexés par NUMÉRO DE BIT. Rédiger un
conseil sans connaître l'ordre exact des bits revient à l'accrocher à la
mauvaise étape. L'API GW2 est la seule source de cet ordre, et elle n'est pas
joignable depuis l'environnement de Claude — d'où ce script, à lancer en local.

Il extrait automatiquement TOUS les `achievementId` du JSX (aucune liste à
maintenir à la main), interroge /v2/achievements et écrit un dump JSON.

Le v6 rend le dump BILINGUE en une seule passe : anglais et francais, pour les
noms de succes comme pour les noms de bits. Les sources du tracker nomment les
objets en anglais — c'est la langue du client d'Antoine et celle du wiki — et
gardent le francais pour la prose. Un dump monolingue oblige a relancer.

Le v5 resout les bits de type `Item` et `Skin`. L'API ne rend que leur
identifiant : un dump non resolu donne « bit 3 = objet 76918 », inexploitable
pour ecrire une etape. Le v5 interroge /v2/items et /v2/skins et ecrit le nom a
cote. Sur les 147 succes des collections legendaires, cela represente environ
2 100 identifiants distincts.

Le v4 ajoute `--catalogue` : au lieu de partir du JSX, il part des quatre
catégories de collections légendaires de `gw2_achievements_ref.json` — Legendary
Trinkets, Backpacks, Armor, Weapons. C'est ce qu'il faut pour ÉCRIRE les
collections manquantes : le JSX ne peut pas référencer ce qui n'y est pas encore.
Les deux modes se combinent, les identifiants sont fusionnés et dédupliqués.

Usage :
    python3 gw2_dump_bits_v4.py
    python3 gw2_dump_bits_v4.py --catalogue            # les 4 categories legendaires
    python3 gw2_dump_bits_v4.py --catalogue --jsx ""   # catalogue seul, sans le JSX
    python3 gw2_dump_bits_v4.py --ids 2351,2557,2368   # une liste explicite

Sortie : gw2_bits_dump.json  (à committer ou à coller dans le chat)

Le dump répond à trois questions d'un coup :
  1. quels achievements exposent des `bits` (donc éligibles aux bitTips) ;
  2. lesquels sont des compteurs `tiers` sans bits (bitTips inapplicable —
     c'est le détecteur `counterNoSteps` en version hors ligne) ;
  3. le total de points d'achèvement, pour le scoring d'effort.
"""

import argparse
import glob
import json
import os
import re
import sys
import urllib.request

API = "https://api.guildwars2.com/v2/achievements"
API_ITEMS = "https://api.guildwars2.com/v2/items"
API_SKINS = "https://api.guildwars2.com/v2/skins"
API_MINIS = "https://api.guildwars2.com/v2/minis"

# Filet de sécurité : liste gelée des achievementId du tracker v98. Utilisée
# seulement si aucun JSX n'est trouvable, pour que le script reste utilisable
# depuis n'importe quel dossier. Le JSX reste la source de vérité.
FALLBACK_IDS = [
    2295, 2351, 2368, 2557, 2646, 3012, 3402, 3436, 3445, 3447, 3964, 4000,
    4035, 4093, 4177, 4195, 4359, 4376, 4412, 4544, 4577, 4689, 4757, 4760,
    4762, 4764, 4765, 4770, 4771, 4774, 4805, 5790, 6933, 7051, 7096, 7098,
    7214, 7219, 7240, 7788, 7796, 7829, 8582, 8714, 8723, 8730, 8743, 8750,
    8761, 8769, 8814, 8823, 8826, 8830, 8835, 8840, 8841, 8869, 8880, 9057,
    9180, 9183, 9244, 9330, 9344,
]


# Les quatre categories de collections legendaires du referentiel. Ce sont
# elles qui portent les etapes des trinkets, dos, armures et armes.
CATEGORIES_LEGENDAIRES = [
    "Legendary Trinkets", "Legendary Backpacks", "Legendary Armor", "Legendary Weapons",
]


def ids_du_catalogue(chemin_ref):
    """Identifiants des succes des quatre categories legendaires du referentiel.

    Rend aussi un index id -> (categorie, nom) pour que le dump soit lisible
    sans rouvrir le referentiel.
    """
    if not os.path.isfile(chemin_ref):
        print(f"[!] referentiel introuvable : {chemin_ref}", file=sys.stderr)
        return [], {}
    ref = json.load(open(chemin_ref, encoding="utf-8"))
    groupe = (ref.get("by_group") or {}).get("Collections") or {}
    ids, index = [], {}
    for cat in CATEGORIES_LEGENDAIRES:
        for entree in groupe.get(cat, []):
            aid = entree.get("id")
            if aid is None:
                continue
            ids.append(aid)
            index[aid] = (cat, entree.get("name", ""))
    return sorted(set(ids)), index


def find_jsx(explicit):
    """Localise le JSX : chemin explicite, sinon version la plus haute trouvée
    dans le dossier courant puis dans celui du script."""
    if explicit:
        if os.path.isfile(explicit):
            return explicit
        print(f"[!] JSX introuvable au chemin fourni : {explicit}", file=sys.stderr)
        return None

    seen = []
    for folder in (os.getcwd(), os.path.dirname(os.path.abspath(__file__))):
        seen.extend(glob.glob(os.path.join(folder, "gw2_legendary_tracker_v*.jsx")))
    if not seen:
        return None

    def version(path):
        m = re.search(r"_v(\d+)\.jsx$", os.path.basename(path))
        return int(m.group(1)) if m else -1

    return max(seen, key=version)


def extract_ids(jsx_path):
    """Récupère tous les achievementId littéraux du JSX, dédupliqués."""
    src = open(jsx_path, encoding="utf-8").read()
    return sorted({int(m) for m in re.findall(r"achievementId:\s*(\d+)", src)})


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


def resoudre(ids, endpoint, lang, etiquette):
    """Rend {id: nom} pour une liste d'identifiants, par lots de 150."""
    noms = {}
    ids = sorted(set(ids))
    for i in range(0, len(ids), 150):
        chunk = ids[i:i + 150]
        url = f"{endpoint}?ids={','.join(map(str, chunk))}&lang={lang}"
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                for obj in json.load(r):
                    noms[obj["id"]] = obj.get("name", "")
        except Exception as exc:
            print(f"  [!] {etiquette} lot {i // 150 + 1} en echec : {exc}", file=sys.stderr)
    manquants = [i for i in ids if i not in noms]
    print(f"{len(noms)}/{len(ids)} {etiquette} resolus"
          + (f" — {len(manquants)} sans nom, ex. {manquants[:5]}" if manquants else ""))
    return noms


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--jsx", default=None,
                    help="chemin du JSX ; par défaut, détection automatique "
                         "de la version la plus haute")
    ap.add_argument("--lang", default="both", choices=["fr", "en", "both"],
                    help="'both' (defaut) ecrit les deux langues en une passe")
    ap.add_argument("--out", default="gw2_bits_dump.json")
    ap.add_argument("--catalogue", action="store_true",
                    help="ajoute les succes des 4 categories de collections legendaires "
                         "du referentiel (necessaire pour ecrire des collections absentes du JSX)")
    ap.add_argument("--ref", default="gw2_achievements_ref.json")
    ap.add_argument("--ids", default=None, help="liste explicite, separee par des virgules")
    args = ap.parse_args()

    ids, index = [], {}
    if args.ids:
        ids = sorted({int(x) for x in args.ids.split(",") if x.strip()})
        print(f"{len(ids)} achievements fournis en ligne de commande")
    if args.catalogue:
        cat_ids, index = ids_du_catalogue(args.ref)
        print(f"{len(cat_ids)} achievements dans les 4 categories legendaires du referentiel")
        ids = sorted(set(ids) | set(cat_ids))

    jsx = None if args.jsx == "" else find_jsx(args.jsx)
    if jsx:
        du_jsx = extract_ids(jsx)
        nouveaux = sorted(set(du_jsx) - set(ids))
        print(f"{len(du_jsx)} achievements référencés dans {os.path.basename(jsx)} "
              f"({len(nouveaux)} en plus du catalogue)")
        ids = sorted(set(ids) | set(du_jsx))
    elif ids:
        pass
    else:
        ids = FALLBACK_IDS
        print("[!] Aucune source d'identifiants : ni --ids, ni --catalogue, ni JSX.")
        print(f"    Repli sur la liste gelée : {len(ids)} achievements (tracker v98).")
        print("    Pour repartir du JSX : --jsx \"chemin\\vers\\le_fichier.jsx\"")

    langues = ["en", "fr"] if args.lang == "both" else [args.lang]
    principale = langues[0]
    par_langue = {}
    for lg in langues:
        par_langue[lg] = fetch(ids, lg)
        print(f"{len(par_langue[lg])} définitions récupérées en {lg}")
    defs = par_langue[principale]
    noms_alt, bits_alt = {}, {}
    for lg in langues[1:]:
        noms_alt[lg] = {d["id"]: d.get("name", "") for d in par_langue[lg]}
        # Certains bits portent un texte fourni par l'API (une phrase d'action,
        # pas un nom d'objet) : les collections d'armes gen1 en sont pleines.
        # Ce texte n'est pas dans /v2/items — il faut le prendre dans la
        # definition du succes de la langue voulue, sinon 909 bits restent
        # unilingues.
        bits_alt[lg] = {d["id"]: [b.get("text") for b in d.get("bits", [])]
                        for d in par_langue[lg]}

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
        if d["id"] in index:
            entry["categorie"], entry["nom_referentiel"] = index[d["id"]]
        payload[str(d["id"])] = entry
        if bits:
            with_bits += 1
        elif tier_max > 1:
            counters.append(f'{d["id"]} — {entry["name"]}')

    # Les bits Item et Skin ne portent qu'un identifiant. Sans nom, une etape
    # se lit « objet 76918 » et ne sert a rien pour rediger un how.
    besoin_items, besoin_skins, besoin_minis = set(), set(), set()
    for entry in payload.values():
        for b in entry["bits"]:
            if b.get("id") is None:
                continue
            if b["type"] == "Item":
                besoin_items.add(b["id"])
            elif b["type"] == "Skin":
                besoin_skins.add(b["id"])
            elif b["type"] == "Minipet":
                besoin_minis.add(b["id"])
    tables = {}
    for lg in langues:
        tables[lg] = {
            "Item": resoudre(besoin_items, API_ITEMS, lg, f"objets ({lg})"),
            "Skin": resoudre(besoin_skins, API_SKINS, lg, f"apparences ({lg})"),
            "Minipet": resoudre(besoin_minis, API_MINIS, lg, f"miniatures ({lg})"),
        }
    noms_items = tables[principale]["Item"]
    noms_skins = tables[principale]["Skin"]
    noms_minis = tables[principale]["Minipet"]
    non_resolus = 0
    for entry in payload.values():
        for b in entry["bits"]:
            if b.get("text"):
                continue
            table = {"Item": noms_items, "Skin": noms_skins,
                     "Minipet": noms_minis}.get(b["type"], {})
            nom = table.get(b.get("id"))
            if nom:
                b["text"] = nom
            elif b.get("id") is not None:
                non_resolus += 1
    if non_resolus:
        print(f"[!] {non_resolus} bits restent sans nom")
    # Langues secondaires : un champ text_<lg> a cote, jamais a la place.
    for lg in langues[1:]:
        for aid, entry in payload.items():
            alt = noms_alt.get(lg, {}).get(int(aid))
            if alt:
                entry[f"name_{lg}"] = alt
            textes = bits_alt.get(lg, {}).get(int(aid), [])
            for b in entry["bits"]:
                direct = textes[b["index"]] if b["index"] < len(textes) else None
                if direct:
                    b[f"text_{lg}"] = direct
                    continue
                if b.get("id") is None:
                    continue
                nom = tables[lg].get(b["type"], {}).get(b["id"])
                if nom:
                    b[f"text_{lg}"] = nom

    missing = [i for i in ids if i not in got]

    json.dump(
        {"_meta": {"source": API, "lang": args.lang, "jsx": os.path.basename(jsx) if jsx else "FALLBACK_IDS",
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
