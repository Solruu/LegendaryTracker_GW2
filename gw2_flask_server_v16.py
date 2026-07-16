"""
GW2 Legendary Tracker — Serveur Flask local
============================================
Fait le pont entre le tracker React (Claude.ai) et l'API GW2.
La cle API ne transite jamais par internet — tout reste sur votre machine.

Usage :
    python gw2_flask_server.py
    python gw2_flask_server.py --port 5000
    python gw2_flask_server.py --env         # charge la cle depuis .env
"""

import argparse
import json
import os
import sys
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

# ─── Configuration ───────────────────────────────────────────────────────────

DEFAULT_PORT = 5000
GW2_API_BASE = "https://api.guildwars2.com/v2"

# Langues supportées pour les libellés localisés (noms d'items, currencies, achievements)
SUPPORTED_LANGS = {"en", "fr"}
DEFAULT_LANG = "en"

# Langue par défaut du serveur, résolue au démarrage (CLI > .env GW2_LANG > DEFAULT_LANG).
# Un paramètre par requête (?lang= ou header X-Lang) reste prioritaire sur cette valeur.
SERVER_LANG = DEFAULT_LANG

# IDs des currencies dans le wallet GW2
CURRENCY_IDS = {
    "elegy_mosaic":        35,      # vérifié API
    "amalgamated_gemstone": None,   # item, pas currency — dans materials
    "volatile_magic":      45,      # vérifié API
    "mystic_coin":         19976,   # material
    "winterberry":         79899,   # Fresh Winterberry — vérifié materials
    "petrified_wood":      79469,   # Petrified Wood — vérifié materials
    "jade_shard":          80332,   # Jade Shard — vérifié materials
    "fire_orchid":         81127,   # Fire Orchid Blossom — vérifié materials
    "orrian_pearl":        81706,   # Orrian Pearl — vérifié materials
    "skirmish_tickets":    26,      # vérifié API
    "memory_of_battle":    71581,   # Memory of Battle (material) — vérifié API
    "testimony_heroics":   82,      # vérifié API (Castoran Heroics)
    "badge_of_honor":      15,      # vérifié API
    "karma":               2,       # vérifié API
    "gold":                1,       # vérifié API
}

# IDs des materials GW2
MATERIAL_IDS = {
    "mystic_clover":        19675,
    "mystic_coin":          19976,
    "glob_ectoplasm":       19721,
    "obsidian_shard":       19925,
    "amalgamated_gemstone": 74189,
}

# IDs des achievements pour les collections legendaires
ACHIEVEMENT_IDS = {
    "vision_1":        4762,   # Vision I: Awakening — vérifié refs
    "vision_2":        4771,   # Vision II: Farsight — vérifié refs
    "aurora_1":        3522,   # Aurora: Awakening — vérifié refs
    "aurora_2":        3489,   # Aurora II: Empowering — vérifié refs
    "prismatic":       5790,   # Seasons of the Dragons (24 Return meta-achis)
    "coalescence_1":   4035,   # Coalescence I: Unbridled — vérifié API
    "coalescence_2":   4412,   # Coalescence II: The Gift — vérifié API
    "coalescence_3":   4805,   # Coalescence III: Culmination — vérifié API
    "selachi_agaleus":   8869,   # Acquiring Agaleus (24 étapes, précurseur) — vérifié refs
    "selachi_shipwreck": 8880,   # Shipwreck Strand Mastery (requis Gift of Castoran Mastery)
    "selachi_starlit":   9057,   # Starlit Weald Mastery (requis Gift of Castoran Mastery)
    "selachi_diver":     4177,   # Master Diver (étape 4 de la collection Agaleus)
    "eikasia_meta":     8826,   # Incursive Investigation (meta → gants, choix du poids)
    "eikasia_relic":    8823,   # Relic in the Mists (étape 1)
    "eikasia_r1":       8840,   # First Recursion (150 Fractalline Dust)
    "eikasia_r2":       8841,   # Second Recursion (300 Dust cumulés)
    "eikasia_r3":       8835,   # Third Recursion
    "eikasia_working":  8830,   # Working Together (fil conducteur Dust)
    "eikasia_infinite": 8814,   # Infinite Recursion (150 Dust — poids supplémentaires)
    "rune_collector":   7796,   # Legendary Rune Collector (bind 7)
    "sigil_collector":  7788,   # Legendary Sigil Collector (bind 8)
    "relic_components": 7829,   # Legendary Relics: Components (guide des gifts)
    # ── Trinkets (onglet Trinkets, tracker v33) ──
    "ascension_path_1":   2738,   # Path of the Ascension I: The Thrill of Battle — vérifié refs
    "ascension_path_2":   2752,   # Path of the Ascension II: Tapestry of Sacrifice — vérifié refs
    "ascension_path_3":   2725,   # Path of the Ascension III: Monument of Legends — vérifié refs
    "ascension_path_4":   2715,   # Path of the Ascension IV: Hymn of Glory — vérifié refs
    "adinf_1":            2351,   # Ad Infinitum I: Finite Result — vérifié refs
    "adinf_2":            2557,   # Ad Infinitum II: Upper Bound — vérifié refs
    "adinf_3":            2368,   # Ad Infinitum III: Unbound — vérifié refs
    "adinf_4":            2295,   # Legendary Backpack: Ad Infinitum — vérifié refs
    "orrax_experiments":  8761,   # Unknown Nightmares: Experiments in the Shadows — vérifié refs
    "orrax_shadows":      8723,   # Unknown Nightmares: Gift of Shadows — vérifié refs
    "orrax_feast":        8750,   # Unknown Nightmares: Gift of the Feast — vérifié refs
    "orrax_isles":        8743,   # Unknown Nightmares: Gift of the Mistburned Isles — vérifié refs
    "orrax_contained":    8730,   # Unknown Nightmares: Orrax Contained — vérifié refs
    "orrax_final":        8714,   # Legendary Backpack and Glider: Orrax — vérifié refs
    "strife_mists_research": 6933, # Mists Research (prérequis Mistwalker Infusion) — vérifié refs
    "strife_unending":    9244,   # Mists Research: Strife Unending (10 étapes) — vérifié wiki/gw2treasures
    "summer_krait":       9180,   # Helping Hylek: Kill Krait (prérequis Gift of the Hylek) — vérifié refs
    "summer_sungod":      9183,   # Radiance of the Sun God (chaîne Gift of the Hylek) — vérifié refs
    "stella_forge_guard": 9330,   # Forge Guard's Armor Collection (6 skins) — vérifié gw2treasures
    "stella_resin":       9344,   # Glimmering Resin Weapon Collector (17 skins) — vérifié gw2treasures
    "orrax_mistburned_mastery": 8582,  # Mistburned Barrens Mastery (→ Salmon of Knowledge) — vérifié refs
    "orrax_bava_mastery":       8769,  # Bava Nisos Mastery (→ Askur Camping Cookout) — vérifié refs
}

# IDs des 4 pré-collections Aurora + 6 sous-collections Master
# (à vérifier via /debug/achievements si des IDs semblent erronés)
AURORA_ACHIEVEMENT_IDS = {
    "aurora_pre_conspiracy": 3053,   # Conspiracy of Dunces (Bloodstone Fen) — vérifié API
    "aurora_pre_token":      3129,   # Token Collector (Ember Bay) — vérifié API
    "aurora_pre_cin":        3383,   # Cin Business (Lake Doric) — vérifié API
    "aurora_pre_lessons":    3429,   # Lessons Learned (Draconis Mons) — vérifié API
    "aurora_bf":             3500,   # Bloodstone Fen Master — vérifié API
    "aurora_eb":             3529,   # Ember Bay Master — vérifié API
    "aurora_bfr":            3499,   # Bitterfrost Frontier Master — vérifié API
    "aurora_ld":             3491,   # Lake Doric Master — vérifié API
    "aurora_dm":             3547,   # Draconis Mons Master — vérifié API
    "aurora_sl":             3495,   # Siren's Landing Master — vérifié API
    "aurora_1":              3522,   # Aurora: Awakening (méta) — vérifié refs
    "aurora_2":              3489,   # Aurora II: Empowering — vérifié refs
    # Story Masteries LW3 — prérequis pour l'item armure (bit 0) de chaque sous-collection
    "mastery_bf":            3050,   # "Out of the Shadows" Mastery  → Bloodstone Crown
    "mastery_eb":            3123,   # "Rising Flames" Mastery       → Heavy Dragonscale Epaulets
    "mastery_bfr":           3171,   # "A Crack in the Ice" Mastery  → Heavy Glacial Gauntlets
    "mastery_ld":            3348,   # "The Head of the Snake" Mastery → White Mantle Elite Guard Mask
    "mastery_dm":            3442,   # "Flashpoint" Mastery          → Heavy Houndskin Mantle
    "mastery_sl":            3516,   # "One Path Ends" Mastery       → Heavy Mursaat Brogans
}

# IDs wallet/mat pour Warbringer et Coalescence
WARBRINGER_IDS = {
    "tickets":   26,      # Skirmish Claim Tickets (wallet) — vérifié API
    "memory":    71581,    # Memory of Battle (material) — vérifié API
    "badges":    15,      # Badge of Honor (wallet) — vérifié API
    "testimony": 82,      # Testimony of Heroics (wallet) — vérifié API
}
COALESCENCE_IDS = {
    "insights":  70,      # Legendary Insight (wallet) — vérifié API
    "magnetite": 28,      # Magnetite Shard (wallet) — vérifié API
    # Gift of Patience = 100 Magnetite Shard, Gift of Compassion = 150 Legendary Insight
    # Gaeting Crystal (vendor indisponible) et Provisioner Token ne sont plus requis
}

VISION_ACHIEVEMENT_IDS = {
    # Vision I: Awakening — 6 sous-collections "Visions of [map]"
    "vision_istan":             4765,   # Visions of Istan
    "vision_kourna":            4760,   # Visions of Kourna
    "vision_jahai":             4770,   # Visions of Jahai
    "vision_sandswept":         4774,   # Visions of Sandswept Isles
    "vision_thunderhead":       4764,   # Visions of Thunderhead Peaks
    "vision_dragonfall":        4757,   # Visions of Dragonfall
    "vision_1":                 4762,   # Vision I: Awakening (méta)
    # Vision II: Farsight — Convergence of Sorrow
    "vision_convergence_1":     4376,   # The Convergence of Sorrow I: Elegy
    "vision_convergence_2":     4362,   # The Convergence of Sorrow II: Requiem
    "vision_2":                 4771,   # Vision II: Farsight (méta)
    # Requiem Experiments (source Elegy Mosaic — 50 par experiment)
    "requiem_1":                4344,   # Requiem: Experiment 1
    "requiem_2":                4432,   # Requiem: Experiment 2
    "requiem_3":                4420,   # Requiem: Experiment 3
    "requiem_4":                4354,   # Requiem: Experiment 4
    "requiem_5":                4356,   # Requiem: Experiment 5
    "requiem_6":                4357,   # Requiem: Experiment 6
}

OBSIDIAN_ACHIEVEMENT_IDS = {
    # Achievements "Legendary Armor: Astral X" — débloquent l'achat de l'Arcanum du slot chez Lyhr
    "arcanum_head":      7214,   # Astral Thought (boss: Ignaxious)
    "arcanum_shoulders": 7098,   # Astral Bearing (boss: Galene the Seething)
    "arcanum_chest":     7096,   # Astral Heartbeat (boss: Nourys)
    "arcanum_gloves":    7219,   # Astral Grasp (boss: Pherus the Subjugator)
    "arcanum_legs":      7240,   # Astral Stride (boss: Knaebelag the Terror)
    "arcanum_boots":     7051,   # Astral Footprints (boss: Myros the Spiteful)
    # Meta / collections
    "astral_gifts":      7128,   # A Legendary Path: Astral Gifts
    "quality_armor":     7802,   # That's Quality Armor (18 skins)
    "suffused_t2":       8064,   # Tier 2 Legendary Armor: Suffused Obsidian
}


# ─── App Flask ────────────────────────────────────────────────────────────────

app = Flask(__name__)

# CORS : autoriser file://, localhost et claude.ai
CORS(app, origins=[
    "https://claude.ai",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "null",  # origine file:// vue par le navigateur
], supports_credentials=False)

# Header CORS manuel pour les requêtes file:// (origine "null")
@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin", "")
    if origin in ("null", "") or origin.startswith("http://localhost") or origin.startswith("http://127.0.0.1"):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-API-Key, X-Lang"
    return response


# ─── Helpers API GW2 ─────────────────────────────────────────────────────────

def get_lang():
    """Résout la langue d'une requête.

    Précédence : ?lang= ou header X-Lang (ponctuel) > SERVER_LANG (défaut serveur,
    lui-même résolu au démarrage via CLI > .env > 'en').
    """
    raw = (request.args.get("lang") or request.headers.get("X-Lang") or "").strip().lower()
    return raw if raw in SUPPORTED_LANGS else SERVER_LANG


def gw2_get(endpoint, api_key, params=None, lang=None):
    """Appel GET vers l'API GW2 avec gestion d'erreur.

    lang : code langue ('en'/'fr') injecté en query param. Pertinent uniquement
    pour les endpoints renvoyant du texte localisé (items, currencies, achievements) ;
    ignoré sans effet par l'API sur les endpoints de données de compte.
    """
    headers = {"Authorization": f"Bearer {api_key}"}
    url = f"{GW2_API_BASE}/{endpoint}"
    if lang:
        params = {**(params or {}), "lang": lang}
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=10)
        resp.raise_for_status()
        return resp.json(), None
    except requests.exceptions.Timeout:
        return None, "Timeout — l'API GW2 ne repond pas"
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            return None, "Cle API invalide ou permissions insuffisantes"
        if e.response.status_code == 403:
            return None, "Permissions manquantes sur la cle API"
        return None, f"Erreur HTTP {e.response.status_code}"
    except Exception as e:
        return None, str(e)


def parse_wallet(wallet_data):
    """Transforme la liste de wallet en dict id→value, en sommant les doublons."""
    result = {}
    for entry in wallet_data:
        if entry:
            result[entry["id"]] = result.get(entry["id"], 0) + entry["value"]
    return result


def parse_materials(materials_data):
    """Transforme la liste de materials en dict id→count, en sommant les doublons."""
    result = {}
    for entry in materials_data:
        if entry and entry.get("count", 0) > 0:
            item_id = entry["id"]
            result[item_id] = result.get(item_id, 0) + entry["count"]
    return result


# ─── Routes ──────────────────────────────────────────────────────────────────



@app.route("/debug/resolve_name")
def resolve_name():
    """
    Recherche un item GW2 par nom et retourne son ID API.
    Query param : q=nom (ex: /debug/resolve_name?q=Auric+Ingot)
    Utilise /v2/items?text= (recherche textuelle GW2 API).
    Pas de clé API requise.
    """
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({"error": "Parametre q requis. Ex: /debug/resolve_name?q=Auric+Ingot"}), 400

    import urllib.request as ur, urllib.parse as up
    lang = get_lang()

    # Endpoint recherche textuelle GW2 (public, pas de clé)
    search_url = f"https://api.guildwars2.com/v2/items?lang={lang}&input={up.quote(query)}"
    try:
        with ur.urlopen(search_url, timeout=8) as r:
            ids = json.loads(r.read())
        if not ids or not isinstance(ids, list):
            return jsonify({"query": query, "results": [], "note": "Aucun résultat"})
        # Récupérer les détails des 10 premiers
        detail_url = f"https://api.guildwars2.com/v2/items?ids={','.join(str(i) for i in ids[:10])}&lang={lang}"
        with ur.urlopen(detail_url, timeout=8) as r:
            items = json.loads(r.read())
        results = [{"id": it["id"], "name": it["name"], "type": it.get("type",""),
                    "rarity": it.get("rarity",""), "binding": "AccountBound" if "AccountBound" in it.get("flags",[]) else ""}
                   for it in items]
        # Trier : exact match en premier
        results.sort(key=lambda x: (0 if x["name"].lower() == query.lower() else 1, x["name"]))
        return jsonify({"query": query, "count": len(results), "results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/debug/item/<int:item_id>")
def debug_item(item_id):
    """Debug — cherche un item ID dans toutes les sources possibles."""
    import time
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle manquante"}), 400

    found = {}

    # Wallet
    wallet, _ = gw2_get("account/wallet", api_key)
    for e in (wallet or []):
        if e and e.get("id") == item_id:
            found["wallet"] = e.get("value", 0)

    # Materials
    mats, _ = gw2_get("account/materials", api_key)
    for e in (mats or []):
        if e and e.get("id") == item_id:
            found["materials"] = e.get("count", 0)

    # Bank
    bank, _ = gw2_get("account/bank", api_key)
    bank_count = sum(s.get("count", 0) for s in (bank or []) if s and s.get("id") == item_id)
    if bank_count: found["bank"] = bank_count

    # Shared inventory
    shared, _ = gw2_get("account/inventory", api_key)
    shared_count = sum(s.get("count", 0) for s in (shared or []) if s and s.get("id") == item_id)
    if shared_count: found["shared_inventory"] = shared_count

    total = sum(found.values())
    return jsonify({"item_id": item_id, "found_in": found, "total": total,
                    "note": "Characters inventory NOT checked (requires extra API calls)"})


@app.route("/debug/prismatic")
def debug_prismatic():
    """Debug — affiche la progression détaillée de Seasons of the Dragons."""
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle manquante"}), 400

    ach_data, err = gw2_get("account/achievements", api_key)
    if err:
        return jsonify({"error": err}), 500

    ach = next((a for a in ach_data if a["id"] == 5790), None)
    if not ach:
        return jsonify({"error": "Achievement 5790 non trouvé — pas encore démarré ?"})

    # Récupérer la définition de l'achievement pour voir les bits
    ach_def, _ = gw2_get("achievements/5790", api_key, lang=get_lang())

    return jsonify({
        "progression": ach,
        "definition_bits": ach_def.get("bits", []) if ach_def else [],
        "bits_completed": ach.get("bits", []),
        "current": ach.get("current", 0),
        "max": ach.get("max", 0),
        "done": ach.get("done", False),
    })


@app.route("/debug/achievements")
def debug_achievements():
    """Debug — cherche des achievements par mot-clé dans leur nom."""
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    query = request.args.get("q", "").lower()
    if not api_key:
        return jsonify({"error": "Cle manquante"}), 400
    if not query:
        return jsonify({"error": "Parametre q requis. Ex: /debug/achievements?q=seasons"}), 400

    # Lire la progression du compte
    ach_data, err = gw2_get("account/achievements", api_key)
    if err:
        return jsonify({"error": err}), 500

    lang = get_lang()

    # Chercher les IDs ayant une progression non-nulle (pour limiter les appels)
    ids_with_progress = [str(a["id"]) for a in ach_data if a.get("current", 0) > 0 or a.get("done", False)]

    # Récupérer les noms par batch
    matches = []
    for i in range(0, len(ids_with_progress), 50):
        batch = ids_with_progress[i:i+50]
        items, _ = gw2_get(f"achievements?ids={','.join(batch)}", api_key, lang=lang)
        if items:
            for item in items:
                if query in item.get("name", "").lower() or query in item.get("description", "").lower():
                    prog = next((a for a in ach_data if a["id"] == item["id"]), {})
                    matches.append({
                        "id": item["id"],
                        "name": item["name"],
                        "done": prog.get("done", False),
                        "current": prog.get("current", 0),
                        "max": prog.get("max", 0),
                    })

    matches.sort(key=lambda x: x["name"])
    return jsonify({"query": query, "count": len(matches), "results": matches})


@app.route("/debug/dump")
def debug_dump():
    """
    Dump complet du compte en une passe : wallet, materials, achievements (avec noms), bank.
    Retourne un dict avec 4 sections, chacune exportable comme fichier JSON de référence.
    Usage: /debug/dump  (clé depuis .env ou header X-API-Key)
    """
    import concurrent.futures, time

    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle API manquante"}), 400

    # ── Fetch en parallèle
    def fetch(ep): return gw2_get(ep, api_key)
    lang = get_lang()

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        fw = ex.submit(fetch, "account/wallet")
        fm = ex.submit(fetch, "account/materials")
        fa = ex.submit(fetch, "account/achievements")
        fb = ex.submit(fetch, "account/bank")

    wallet_raw,   _ = fw.result()
    materials_raw, _ = fm.result()
    ach_raw,      _ = fa.result()
    bank_raw,     _ = fb.result()

    # ── Wallet : toutes currencies avec valeur > 0, enrichies par noms
    wallet_ids = [str(e["id"]) for e in (wallet_raw or []) if e.get("value", 0) > 0]
    currency_names = {}
    for i in range(0, len(wallet_ids), 50):
        batch = ",".join(wallet_ids[i:i+50])
        data, _ = gw2_get(f"currencies?ids={batch}", api_key, lang=lang)
        if data:
            for c in data:
                currency_names[c["id"]] = c.get("name", "?")

    wallet_dump = sorted([
        {"id": e["id"], "name": currency_names.get(e["id"], "?"), "value": e["value"]}
        for e in (wallet_raw or []) if e.get("value", 0) > 0
    ], key=lambda x: x["name"])

    # ── Materials : tous stacks > 0, enrichis par noms
    mat_ids = [str(e["id"]) for e in (materials_raw or []) if e.get("count", 0) > 0]
    mat_names = {}
    for i in range(0, len(mat_ids), 50):
        batch = ",".join(mat_ids[i:i+50])
        data, _ = gw2_get(f"items?ids={batch}", api_key, lang=lang)
        if data:
            for item in data:
                mat_names[item["id"]] = item.get("name", "?")

    materials_dump = sorted([
        {"id": e["id"], "name": mat_names.get(e["id"], "?"), "count": e["count"]}
        for e in (materials_raw or []) if e.get("count", 0) > 0
    ], key=lambda x: x["name"])

    # ── Achievements avec progression, enrichis par noms
    ach_ids = [str(e["id"]) for e in (ach_raw or []) if e.get("current", 0) > 0 or e.get("done")]
    ach_names = {}
    for i in range(0, len(ach_ids), 50):
        batch = ",".join(ach_ids[i:i+50])
        data, _ = gw2_get(f"achievements?ids={batch}", api_key, lang=lang)
        if data:
            for item in data:
                ach_names[item["id"]] = item.get("name", "?")

    achievements_dump = sorted([
        {
            "id": e["id"],
            "name": ach_names.get(e["id"], "?"),
            "done": e.get("done", False),
            "current": e.get("current", 0),
            "max": e.get("max", 0),
        }
        for e in (ach_raw or []) if e.get("current", 0) > 0 or e.get("done")
    ], key=lambda x: x["name"])

    # ── Bank : slots non-null avec count > 0
    bank_item_ids = [str(s["id"]) for s in (bank_raw or []) if s and s.get("count", 0) > 0]
    bank_names = {}
    for i in range(0, len(bank_item_ids), 50):
        batch = ",".join(bank_item_ids[i:i+50])
        data, _ = gw2_get(f"items?ids={batch}", api_key, lang=lang)
        if data:
            for item in data:
                bank_names[item["id"]] = item.get("name", "?")

    bank_dump = sorted([
        {"id": s["id"], "name": bank_names.get(s["id"], "?"), "count": s["count"]}
        for s in (bank_raw or []) if s and s.get("count", 0) > 0
    ], key=lambda x: x["name"])

    return jsonify({
        "_meta": {"generated_at": int(time.time()), "note": "Dump de référence — IDs vérifiés compte réel"},
        "wallet":       wallet_dump,
        "materials":    materials_dump,
        "achievements": achievements_dump,
        "bank":         bank_dump,
    })


@app.route("/debug/reference_dump")
def reference_dump():
    """
    Dump de référence complet (nom/ID) — sans données de compte.
    3 sections :
      - currencies  : tous les IDs wallet via /v2/currencies
      - materials   : tous les items du material storage via /v2/materials (catégories)
      - achievements: tous les achievements structurés par catégorie via /v2/achievements/categories
    Prend ~15-30s (beaucoup de calls API publique).
    """
    import requests as req, concurrent.futures, time

    GW2 = GW2_API_BASE
    lang = get_lang()

    def pub_get(endpoint):
        try:
            sep = "&" if "?" in endpoint else "?"
            r = req.get(f"{GW2}/{endpoint}{sep}lang={lang}", timeout=15)
            return r.json() if r.ok else None
        except Exception:
            return None

    # ── 1. Currencies
    def fetch_currencies():
        data = pub_get("currencies?ids=all")
        if not data:
            return []
        return sorted([
            {"id": c["id"], "name": c.get("name","?"), "description": c.get("description","")}
            for c in data
        ], key=lambda x: x["name"])

    # ── 2. Materials (storage categories → items)
    def fetch_materials():
        # /v2/materials sans params → liste d'IDs de catégories
        cat_ids = pub_get("materials")
        if not cat_ids:
            return []
        # Fetcher les détails des catégories
        batch = ",".join(str(x) for x in cat_ids)
        cats = pub_get(f"materials?ids={batch}")
        if not cats:
            return []
        # Collecter tous les item IDs
        all_ids = []
        cat_map = {}  # item_id → category name
        for cat in cats:
            cat_name = cat.get("name", "?") if isinstance(cat, dict) else "?"
            for iid in (cat.get("items", []) if isinstance(cat, dict) else []):
                iid = iid if isinstance(iid, int) else iid.get("id")
                if iid:
                    all_ids.append(iid)
                    cat_map[iid] = cat_name

        # Enrichir par batch
        items_out = []
        for i in range(0, len(all_ids), 50):
            batch = ",".join(str(x) for x in all_ids[i:i+50])
            items = pub_get(f"items?ids={batch}")
            if items:
                for item in items:
                    items_out.append({
                        "id": item["id"],
                        "name": item.get("name", "?"),
                        "category": cat_map.get(item["id"], "?"),
                        "rarity": item.get("rarity", "?"),
                        "type": item.get("type", "?"),
                    })
        return sorted(items_out, key=lambda x: (x["category"], x["name"]))

    # ── 3. Achievements (par catégorie)
    def fetch_achievements():
        # Récupérer tous les groupes
        groups = pub_get("achievements/groups?ids=all")
        cats_all = pub_get("achievements/categories?ids=all")
        if not cats_all:
            return []

        # Index groupes
        group_map = {}
        if groups:
            for g in groups:
                for cid in g.get("categories", []):
                    group_map[cid] = g.get("name", "?")

        # Collecter tous les achievement IDs par catégorie
        all_ach_ids = []
        ach_cat_map = {}   # ach_id → category name
        ach_group_map = {} # ach_id → group name
        for cat in cats_all:
            cat_name = cat.get("name", "?")
            grp_name = group_map.get(cat["id"], "?")
            for ach in cat.get("achievements", []):
                aid = ach if isinstance(ach, int) else ach.get("id")
                if aid:
                    all_ach_ids.append(aid)
                    ach_cat_map[aid] = cat_name
                    ach_group_map[aid] = grp_name

        # Enrichir par batch (noms)
        ach_out = []
        for i in range(0, len(all_ach_ids), 50):
            batch = ",".join(str(x) for x in all_ach_ids[i:i+50])
            items = pub_get(f"achievements?ids={batch}")
            if items:
                for item in items:
                    ach_out.append({
                        "id": item["id"],
                        "name": item.get("name", "?"),
                        "group": ach_group_map.get(item["id"], "?"),
                        "category": ach_cat_map.get(item["id"], "?"),
                        "description": item.get("requirement", ""),
                    })

        return sorted(ach_out, key=lambda x: (x["group"], x["category"], x["name"]))

    # ── Fetch en parallèle
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
        fc = ex.submit(fetch_currencies)
        fm = ex.submit(fetch_materials)
        fa = ex.submit(fetch_achievements)

    currencies   = fc.result()
    materials    = fm.result()
    achievements = fa.result()

    return jsonify({
        "_meta": {
            "generated_at": int(time.time()),
            "note": "Base de référence complète — IDs publics GW2, sans données de compte",
            "counts": {
                "currencies": len(currencies),
                "materials": len(materials),
                "achievements": len(achievements),
            }
        },
        "currencies":   currencies,
        "materials":    materials,
        "achievements": achievements,
    })


@app.route("/debug/achievements/byname")
def debug_achievements_byname():
    """
    Cherche des achievements par nom dans l'API publique GW2 (sans auth).
    Teste une plage d'IDs et filtre par mot-clé.
    Usage: /debug/achievements/byname?q=bloodstone+fen+master&start=3400&end=3600
    """
    import requests as req
    query = request.args.get("q", "").lower()
    start = int(request.args.get("start", 3400))
    end   = int(request.args.get("end",   3600))
    if not query:
        return jsonify({"error": "Parametre q requis"}), 400

    lang = get_lang()
    matches = []
    for i in range(start, end, 50):
        batch = list(range(i, min(i + 50, end)))
        ids_str = ",".join(str(x) for x in batch)
        try:
            r = req.get(f"{GW2_API_BASE}/achievements?ids={ids_str}&lang={lang}", timeout=10)
            if r.ok:
                for item in r.json():
                    name = item.get("name", "")
                    desc = item.get("description", "")
                    if query in name.lower() or query in desc.lower():
                        matches.append({"id": item["id"], "name": name, "description": desc})
        except Exception:
            pass

    matches.sort(key=lambda x: x["id"])
    return jsonify({"query": query, "range": f"{start}-{end}", "count": len(matches), "results": matches})


@app.route("/debug/lw3")
def debug_lw3():
    """Debug — cherche les currencies LW3 par nom dans les materials."""
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle manquante"}), 400

    mat_data, err = gw2_get("account/materials", api_key)
    if err:
        return jsonify({"error": err}), 500

    # Récupérer les noms des materials non-zéro
    non_zero_ids = [str(m["id"]) for m in mat_data if m.get("count", 0) > 0]
    lang = get_lang()

    # Chercher par batch de 50
    results = []
    for i in range(0, len(non_zero_ids), 50):
        batch = non_zero_ids[i:i+50]
        items, _ = gw2_get(f"items?ids={','.join(batch)}", api_key, lang=lang)
        if items:
            results.extend(items)

    # Filtrer les currencies LW3 par mots-clés
    keywords = ["winterberry", "petrified", "jade shard", "fire orchid", "lava drop", "orrian pearl", "blood ruby", "unbound magic", "lava"]
    matches = [
        {"id": item["id"], "name": item["name"],
         "count": next((m["count"] for m in mat_data if m["id"] == item["id"]), 0)}
        for item in results
        if any(kw in item["name"].lower() for kw in keywords)
    ]
    matches.sort(key=lambda x: x["name"])
    return jsonify(matches)



@app.route("/debug/wallet")
def debug_wallet():
    """Debug — affiche le wallet avec les noms des currencies."""
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle manquante"}), 400
    
    wallet_data, err = gw2_get("account/wallet", api_key)
    if err:
        return jsonify({"error": err}), 500

    # Récupérer les noms des currencies
    currency_ids = [str(entry["id"]) for entry in wallet_data if entry["value"] > 0]
    names_data, err2 = gw2_get(f"currencies?ids={','.join(currency_ids[:50])}", api_key, lang=get_lang())
    names = {str(c["id"]): c["name"] for c in (names_data or [])}

    result = [
        {"id": e["id"], "value": e["value"], "name": names.get(str(e["id"]), "?")}
        for e in wallet_data if e["value"] > 0
    ]
    result.sort(key=lambda x: x["name"])
    return jsonify(result)


@app.route("/debug/materials")
def debug_materials():
    """Debug — affiche les materials bruts pour trouver les bons IDs."""
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle manquante"}), 400
    data, err = gw2_get("account/materials", api_key)
    if err:
        return jsonify({"error": err}), 500
    # Filtrer uniquement les items avec count > 0
    non_zero = [m for m in data if m.get("count", 0) > 0]
    # Chercher spécifiquement l'obsidian
    obsidian = [m for m in data if m.get("id") == 19925]
    return jsonify({"non_zero_count": len(non_zero), "items": non_zero, "obsidian_search": obsidian})


@app.route("/health")
def health():
    """Ping — verifie que le serveur tourne."""
    return jsonify({
        "status": "ok",
        "message": "GW2 Legendary Tracker Server",
        "supported_langs": sorted(SUPPORTED_LANGS),
        "default_lang": DEFAULT_LANG,
        "server_lang": SERVER_LANG,
    })


@app.route("/api/progression")
def progression():
    """
    Retourne la progression complete du compte pour tous les legendaires.
    Param : key=VOTRE_CLE_API (dans l'URL ou header X-API-Key)
    """
    api_key = (
        request.args.get("key")
        or request.headers.get("X-API-Key")
        or os.environ.get("GW2_API_KEY")
    )

    if not api_key:
        return jsonify({
            "error": "Cle API manquante",
            "hint": "Passez la cle en parametre : /api/progression?key=VOTRE_CLE"
        }), 400

    result = {}
    errors = []

    # ── Wallet (currencies)
    wallet_raw, err = gw2_get("account/wallet", api_key)
    if err:
        errors.append(f"wallet: {err}")
        wallet_dict = {}
    else:
        wallet_dict = parse_wallet(wallet_raw)

    # ── Materials (mats communs + gemstones)
    materials_raw, err = gw2_get("account/materials", api_key)
    if err:
        errors.append(f"materials: {err}")
        mat_dict = {}
    else:
        mat_dict = parse_materials(materials_raw)

    # ── Achievements
    achievements_raw, err = gw2_get("account/achievements", api_key)
    if err:
        errors.append(f"achievements: {err}")
        ach_list = []
    else:
        ach_list = achievements_raw

    # ── Bank (Obsidian Shards sont account-bound, stockés dans le bank)
    bank_raw, err = gw2_get("account/bank", api_key)
    if err:
        errors.append(f"bank: {err}")
        bank_raw = []

    # ── Personnages
    characters_raw, err = gw2_get("characters", api_key, params={"ids": "all"})
    if err:
        errors.append(f"characters: {err}")
        characters_raw = []

    # ── Construction de la reponse normalisee

    # Currencies Vision
    vision = {
        "elegy": wallet_dict.get(35, 0),
        "gems":  mat_dict.get(68063, 0),
        "vm":    wallet_dict.get(45, 0),
    }

    # Currencies Aurora (LW3 — dans les materials)
    aurora = {
        "winterberry":  mat_dict.get(79899, 0),
        "petrified":    mat_dict.get(79469, 0),
        "jade":         mat_dict.get(80332, 0),
        "fire_orchid":  mat_dict.get(81127, 0),
        "orrian":       mat_dict.get(81706, 0),
    }

    # Currencies Conflux (WvW)
    conflux = {
        "tickets":   wallet_dict.get(26, 0),
        "memory":    mat_dict.get(71581, 0),   # Memory of Battle — material ID 71581
        "testimony": wallet_dict.get(82, 0),   # Testimony of Heroics — wallet ID 82
        "badges":    wallet_dict.get(15, 0),
    }

    # Mats communs — banque + material storage pour les 4
    # (les inventaires de personnages ne sont pas comptés : 1 appel API/perso, hors périmètre)
    def bank_count(item_id):
        return sum(
            slot["count"] for slot in (bank_raw or [])
            if slot and slot.get("id") == item_id
        )
    obsidian_bank = bank_count(19925)  # conservé pour les currencies Obsidian Armor
    common = {
        "clovers":   mat_dict.get(19675, 0) + bank_count(19675),
        "coins":     mat_dict.get(19976, 0) + bank_count(19976),
        "ectos":     mat_dict.get(19721, 0) + bank_count(19721),
        "obsidian":  mat_dict.get(19925, 0) + obsidian_bank,
    }

    # Achievements collections
    ach_dict = {a["id"]: a for a in ach_list}
    achievements = {}
    for key, ach_id in ACHIEVEMENT_IDS.items():
        if ach_id in ach_dict:
            a = ach_dict[ach_id]
            achievements[key] = {
                "done": a.get("done", False),
                "current": a.get("current", 0),
                "max": a.get("max", 0),
                "bits": a.get("bits", []),
            }
        else:
            achievements[key] = {"done": False, "current": 0, "max": 0, "bits": []}

    # Currencies Warbringer (WvW — mêmes sources que Conflux)
    warbringer = {
        "tickets": wallet_dict.get(26, 0),
        "memory":  mat_dict.get(71581, 0),
        "badges":  wallet_dict.get(15, 0),
        "jade":    wallet_dict.get(65, 0),   # Testimony of Jade Heroics (recette actuelle) — 82=Castoran, 36=Desert
    }

    # Currencies Strife Unending (WvW — accessoire VoE)
    strife_unending = {
        "tickets": wallet_dict.get(26, 0),     # Skirmish Claim Tickets (objectif 3000)
        "clovers": mat_dict.get(19675, 0),     # Mystic Clover (objectif 45)
        "memory":  mat_dict.get(71581, 0),     # Memory of Battle
    }

    # Currencies Endless Summer (anneau VoE — monnaies de carte Castora)
    endless_summer = {
        "sap":     wallet_dict.get(83, 0),     # Aether-Rich Sap (Shipwreck Strand) — objectif 500
        "ducat":   wallet_dict.get(81, 0),     # Antiquated Ducat (Starlit Weald) — objectif 500
        "obsidian": mat_dict.get(19925, 0),    # Obsidian Shard (Gift of Infused Gems ×250)
        "gems":    mat_dict.get(68063, 0),     # Amalgamated Gemstone (×250)
        "clovers": mat_dict.get(19675, 0),     # Mystic Clover (Purified Rift Essences ×10)
    }

    # Currencies Stella Radians (accessoire VoE — karma-intensif)
    stella_radians = {
        "karma":   wallet_dict.get(2, 0),      # Karma — budget ~7M
        "coins":   mat_dict.get(19976, 0),     # Mystic Coin (Mystic Tribute ×250)
        "clovers": mat_dict.get(19675, 0),     # Mystic Clover (Mystic Tribute ×77)
    }

    # Currencies Orrax Manifested (dos JW)
    orrax_manifested = {
        "tales":   wallet_dict.get(69, 0),     # Tales of Dungeon Delving (Gift of Ascalon ×500)
        "clovers": mat_dict.get(19675, 0),     # Mystic Clover (Draconic Tribute ×38)
        "oblige":  wallet_dict.get(76, 0),     # Ursus Oblige (achats vendeurs JW — indicatif)
    }

    # Currencies Ad Infinitum (dos fractales)
    ad_infinitum = {
        "relics":   wallet_dict.get(7, 0),     # Fractal Relic (Gift of Ascension ×500 + achats collections)
        "pristine": wallet_dict.get(24, 0),    # Pristine Fractal Relic (achats BUY-2046 ×50)
        "clovers":  mat_dict.get(19675, 0),    # Mystic Clover (Gift of Fortune ×77)
        "coins":    mat_dict.get(19976, 0),    # Mystic Coin (Gift of Fortune ×250)
    }

    # Currencies Coalescence (Raids)
    coalescence = {
        "insights":  wallet_dict.get(70, 0),   # Legendary Insight
        "magnetite": wallet_dict.get(28, 0),   # Magnetite Shard (W1-4)
        "gaeting":   wallet_dict.get(39, 0),   # Gaeting Crystal PoF (W5-7) — 20=Ley Line Crystal était FAUX, 77=Gaeting Janthir
        "coins":     mat_dict.get(19976, 0),   # Mystic Coin (Mystic Tribute ×250)
    }

    # Currencies T6 (onglet Matériaux T6)
    t6 = {
        "blood":   mat_dict.get(24295, 0),   # Vial of Powerful Blood
        "venom":   mat_dict.get(24283, 0),   # Powerful Venom Sac
        "totem":   mat_dict.get(24300, 0),   # Elaborate Totem
        "dust":    mat_dict.get(24277, 0),   # Pile of Crystalline Dust
        "claw":    mat_dict.get(24351, 0),   # Vicious Claw
        "bone":    mat_dict.get(24358, 0),   # Ancient Bone
        "fang":    mat_dict.get(24357, 0),   # Vicious Fang
        "scale":   mat_dict.get(24289, 0),   # Armored Scale
        "volatile": wallet_dict.get(45, 0),  # Volatile Magic
        "ice":     mat_dict.get(92272, 0),   # Eternal Ice Shard (item, pas wallet)
    }

    # Currencies Armes gen3 (tracker Armes)
    weapons_gen3 = {
        "antique":    mat_dict.get(96978, 0),   # Antique Summoning Stone (vérifié ref — pas 91024)
        "runestones": mat_dict.get(96722, 0),   # Jade Runestone (vérifié ref — pas 97264)
        "lodestones": mat_dict.get(92687, 0),   # Amalgamated Draconic Lodestone
        "clovers":    mat_dict.get(19675, 0),
        "notes":      wallet_dict.get(61, 0),   # Research Note
    }

    # Currencies Upgrades légendaires (runes/sigils/relique)
    upgrades = {
        "provisioner": wallet_dict.get(29, 0),
        "lucent":      mat_dict.get(89140, 0),   # Lucent Mote
        "lucent_pile": mat_dict.get(89271, 0),   # Pile of Lucent Crystal
        "clovers":     mat_dict.get(19675, 0),
        "ectos":       mat_dict.get(19721, 0),
    }

    # Currencies Selachimorpha (VoE)
    selachimorpha = {
        "notes":   wallet_dict.get(61, 0),   # Research Note (wallet)
        "unusual": wallet_dict.get(62, 0),   # Unusual Coin (monnaie maps VoE)
        "clovers": mat_dict.get(19675, 0),
        "shards":  mat_dict.get(19925, 0) + obsidian_bank,
    }

    # Currencies Obsidian Armor (SotO — essences Rift converties wallet juin 2025)
    obsidian_armor = {
        "fine":        wallet_dict.get(78, 0),   # Fine Rift Essence — wallet ID 78
        "masterwork":  wallet_dict.get(80, 0),   # Masterwork Rift Essence — wallet ID 80 (79=Rare !)
        "rare":        wallet_dict.get(79, 0),   # Rare Rift Essence — wallet ID 79
        "amalgamated": mat_dict.get(100081, 0),
        "provisioner": wallet_dict.get(29, 0),
        "clovers":     mat_dict.get(19675, 0),
        "shards":      mat_dict.get(19925, 0) + obsidian_bank,
        "ectos":       mat_dict.get(19721, 0),
    }

    # Prismatic — progression achievement Seasons of the Dragons
    # Mapping exact : bit → achievement ID de la map correspondante
    PRISMATIC_BIT_MAP = [
        (0,  5773, "Return to Dry Top 1"),
        (1,  5804, "Return to Dry Top 2"),
        (2,  5829, "Return to Silverwastes 1"),
        (3,  5758, "Return to Silverwastes 2"),
        (4,  5742, "Return to Bloodstone Fen"),
        (5,  5743, "Return to Ember Bay"),
        (6,  5779, "Return to Bitterfrost Frontier"),
        (7,  5756, "Return to Lake Doric"),
        (8,  5751, "Return to Draconis Mons"),
        (9,  5748, "Return to Siren's Landing"),
        (10, 5948, "Return to the Domain of Istan"),
        (11, 5884, "Return to the Sandswept Isles"),
        (12, 6005, "Return to the Domain of Kourna"),
        (13, 5901, "Return to Jahai Bluffs"),
        (14, 6023, "Return to Thunderhead Peaks"),
        (15, 5995, "Return to Dragonfall"),
        (16, 5888, "Return to Grothmar Valley"),
        (17, 5991, "Return to Bjora Marches 1"),
        (18, 6024, "Return to Bjora Marches 2"),
        (19, 5886, "Return to the Eye of the North"),
        (20, 5869, "Return to Drizzlewood Coast 1"),
        (21, 5926, "Return to Drizzlewood Coast 2"),
        (22, 5861, "Return to the Dragonstorm"),
        (23, None, "Return to Champions"),  # ID à confirmer
    ]

    prismatic_ach = ach_dict.get(5790, {})
    bits = prismatic_ach.get("bits", [])

    # Tiers basés sur le vrai mapping
    tier_ranges = {
        "tier1": [0, 1, 2, 3],           # LW S2 : Dry Top 1&2, Silverwastes 1&2
        "tier2": [4, 5, 6, 7, 8, 9],     # LW S3 : Bloodstone Fen, Ember Bay, Bitterfrost, Lake Doric, Draconis Mons, Siren's Landing
        "tier3": [10, 11, 12, 13, 14, 15], # LW S4 : Istan, Sandswept, Kourna, Jahai, Thunderhead, Dragonfall
        "tier4": [16, 17, 18, 19, 20, 21, 22, 23],  # Icebrood : Grothmar, Bjora 1&2, EotN, Drizzlewood 1&2, Dragonstorm, Champions
    }

    # Progression par map individuelle
    map_progress = {}
    for bit, ach_id, name in PRISMATIC_BIT_MAP:
        if ach_id and ach_id in ach_dict:
            a = ach_dict[ach_id]
            map_progress[bit] = {
                "name": name,
                "done": a.get("done", False),
                "current": a.get("current", 0),
                "max": a.get("max", 0),
            }
        else:
            map_progress[bit] = {
                "name": name,
                "done": bit in bits,
                "current": 1 if bit in bits else 0,
                "max": 1,
            }

    tier_status = {}
    for tier, bit_list in tier_ranges.items():
        completed = sum(1 for b in bit_list if b in bits)
        tier_status[tier] = {
            "completed": completed,
            "total": len(bit_list),
            "done": completed == len(bit_list),
        }

    prismatic_progress = {
        "return_completed": len(bits),
        "return_max":       24,
        "done":             prismatic_ach.get("done", False),
        "bits_raw":         bits,
        "tiers":            tier_status,
        "maps":             map_progress,
    }

    # Personnages niveau 80
    chars_80 = []
    for char in (characters_raw or []):
        if char.get("level") == 80:
            chars_80.append({
                "name": char.get("name"),
                "profession": char.get("profession"),
                "crafting": [
                    {"discipline": c["discipline"], "rating": c["rating"], "active": c.get("active", False)}
                    for c in char.get("crafting", [])
                ],
            })

    result = {
        "currencies": {
            "vision":       vision,
            "aurora":       aurora,
            "conflux":      conflux,
            "warbringer":   warbringer,
            "strife_unending": strife_unending,
            "endless_summer": endless_summer,
            "stella_radians": stella_radians,
            "orrax_manifested": orrax_manifested,
            "ad_infinitum": ad_infinitum,
            "coalescence":  coalescence,
            "obsidian":     obsidian_armor,
            "selachimorpha": selachimorpha,
            "upgrades":     upgrades,
            "weapons":      weapons_gen3,
            "t6":           t6,
        },
        "common": common,
        "achievements": achievements,
        "prismatic":    prismatic_progress,
        "characters_80": chars_80,
        "errors": errors,
    }

    return jsonify(result)




@app.route("/api/materials/bulk", methods=["GET", "POST"])
def materials_bulk():
    """
    Agrège wallet + material storage + bank pour une liste d'apiIds.
    Query param : ids=19675,19721,... (virgule-séparés)
    Retourne : {"stocks": {"19675": 42, "19721": 1250, ...}, "synced_at": <unix_ts>}
    """
    import time, concurrent.futures

    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle API manquante"}), 400

    # Accepter ids en GET query param ou en POST JSON body
    if request.method == "POST":
        body = request.get_json(silent=True) or {}
        raw_ids = ",".join(str(i) for i in body.get("ids", []))
    else:
        raw_ids = request.args.get("ids", "")
    if not raw_ids:
        return jsonify({"error": "Parametre ids requis (GET: ?ids=x,y ou POST: {ids:[x,y]})"}), 400

    requested = set()
    for s in raw_ids.split(","):
        s = s.strip()
        if s.isdigit():
            requested.add(int(s))

    if not requested:
        return jsonify({"error": "Aucun ID valide"}), 400

    # Fetch en parallèle : wallet + materials + bank
    results = {}
    errors = []

    def fetch_wallet():
        data, err = gw2_get("account/wallet", api_key)
        return ("wallet", data, err)

    def fetch_materials():
        data, err = gw2_get("account/materials", api_key)
        return ("materials", data, err)

    def fetch_bank():
        data, err = gw2_get("account/bank", api_key)
        return ("bank", data, err)

    def fetch_shared():
        data, err = gw2_get("account/inventory", api_key)
        return ("shared", data, err)

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        futures = [ex.submit(fetch_wallet), ex.submit(fetch_materials), ex.submit(fetch_bank), ex.submit(fetch_shared)]
        for f in concurrent.futures.as_completed(futures):
            source, data, err = f.result()
            if err:
                errors.append(f"{source}: {err}")
            else:
                results[source] = data

    stocks = {}  # apiId (str) → qty

    # Wallet : currency ids
    for entry in (results.get("wallet") or []):
        if entry and entry.get("id") in requested:
            sid = str(entry["id"])
            stocks[sid] = stocks.get(sid, 0) + entry.get("value", 0)

    # Materials storage
    for entry in (results.get("materials") or []):
        if entry and entry.get("id") in requested:
            sid = str(entry["id"])
            stocks[sid] = stocks.get(sid, 0) + entry.get("count", 0)

    # Bank (slots peuvent être null)
    for slot in (results.get("bank") or []):
        if slot and slot.get("id") in requested:
            sid = str(slot["id"])
            stocks[sid] = stocks.get(sid, 0) + slot.get("count", 0)

    # Shared inventory slots
    for slot in (results.get("shared") or []):
        if slot and slot.get("id") in requested:
            sid = str(slot["id"])
            stocks[sid] = stocks.get(sid, 0) + slot.get("count", 0)

    return jsonify({
        "stocks": stocks,
        "synced_at": int(time.time()),
        "errors": errors,
        "requested_count": len(requested),
        "found_count": len(stocks),
    })


@app.route("/api/achievements/aurora")
def aurora_achievements():
    """
    Retourne la progression des collections Aurora (pré-collections + sous-collections Master + Aurora I/II).
    Retourne un dict { key: { done, current, max, bits } } pour chaque collection dans AURORA_ACHIEVEMENT_IDS.
    """
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle API manquante"}), 400

    ach_raw, err = gw2_get("account/achievements", api_key)
    if err:
        return jsonify({"error": err}), 500

    # Index par ID
    ach_index = {}
    for entry in (ach_raw or []):
        ach_index[entry["id"]] = entry

    result = {}
    for key, ach_id in AURORA_ACHIEVEMENT_IDS.items():
        entry = ach_index.get(ach_id)
        if entry:
            result[key] = {
                "done":    entry.get("done", False),
                "current": entry.get("current", 0),
                "max":     entry.get("max", 0),
                "bits":    entry.get("bits", []),
            }
        else:
            result[key] = {"done": False, "current": 0, "max": 0, "bits": []}

    return jsonify(result)


@app.route("/api/achievements/vision")
def vision_achievements():
    """
    Retourne la progression des collections Vision (Visions of [map] + Convergence of Sorrow + Requiem Experiments).
    Retourne un dict { key: { done, current, max, bits } } pour chaque entrée dans VISION_ACHIEVEMENT_IDS.
    """
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle API manquante"}), 400

    ach_raw, err = gw2_get("account/achievements", api_key)
    if err:
        return jsonify({"error": err}), 500

    ach_index = {}
    for entry in (ach_raw or []):
        ach_index[entry["id"]] = entry

    result = {}
    for key, ach_id in VISION_ACHIEVEMENT_IDS.items():
        entry = ach_index.get(ach_id)
        if entry:
            result[key] = {
                "done":    entry.get("done", False),
                "current": entry.get("current", 0),
                "max":     entry.get("max", 0),
                "bits":    entry.get("bits", []),
            }
        else:
            result[key] = {"done": False, "current": 0, "max": 0, "bits": []}

    return jsonify(result)


@app.route("/api/achievements/obsidian")
def obsidian_achievements():
    """
    Progression des achievements Obsidian Armor (6 Arcanum "Astral X" + collections).
    Retourne { key: { done, current, max, bits } } pour chaque entrée dans OBSIDIAN_ACHIEVEMENT_IDS.
    """
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle API manquante"}), 400

    ach_raw, err = gw2_get("account/achievements", api_key)
    if err:
        return jsonify({"error": err}), 500

    ach_index = {}
    for entry in (ach_raw or []):
        ach_index[entry["id"]] = entry

    result = {}
    for key, ach_id in OBSIDIAN_ACHIEVEMENT_IDS.items():
        entry = ach_index.get(ach_id)
        if entry:
            result[key] = {
                "done":    entry.get("done", False),
                "current": entry.get("current", 0),
                "max":     entry.get("max", 0),
                "bits":    entry.get("bits", []),
            }
        else:
            result[key] = {"done": False, "current": 0, "max": 0, "bits": []}

    return jsonify(result)


@app.route("/api/achievements/status")
def achievements_status():
    """
    Statut de complétion pour une liste arbitraire d'IDs d'achievements.
    Params : ids=1,2,3 (max 200). Retourne { id: { done, current, max } }.
    Sert aux méta-achievements (masteries de cartes) dont les étapes sont
    d'autres achievements et non des bits.
    """
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle API manquante"}), 400
    ids_param = request.args.get("ids", "")
    try:
        wanted = [int(x) for x in ids_param.split(",") if x.strip()][:200]
    except ValueError:
        return jsonify({"error": "ids invalides"}), 400
    if not wanted:
        return jsonify({})
    ach_raw, err = gw2_get("account/achievements", api_key)
    if err:
        return jsonify({"error": err}), 500
    idx = {e["id"]: e for e in (ach_raw or [])}
    result = {}
    for i in wanted:
        e = idx.get(i)
        result[str(i)] = {
            "done":    e.get("done", False) if e else False,
            "current": e.get("current", 0) if e else 0,
            "max":     e.get("max", 0) if e else 0,
        }
    return jsonify(result)


@app.route("/api/legendaryarmory")
def legendary_armory():
    """Proxy vers /v2/account/legendaryarmory — clé reste côté machine."""
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("GW2_API_KEY")
    if not api_key:
        return jsonify({"error": "Cle API manquante"}), 400

    data, err = gw2_get("account/legendaryarmory", api_key)
    if err:
        return jsonify({"error": err}), 500

    return jsonify(data)


@app.route("/api/validate")
def validate_key():
    """Valide une cle API sans charger toutes les donnees."""
    api_key = request.args.get("key") or request.headers.get("X-API-Key")
    if not api_key:
        return jsonify({"valid": False, "error": "Cle manquante"}), 400

    data, err = gw2_get("account", api_key)
    if err:
        return jsonify({"valid": False, "error": err}), 401

    return jsonify({
        "valid": True,
        "account_name": data.get("name"),
        "world": data.get("world"),
    })


# ─── Entrypoint ──────────────────────────────────────────────────────────────

def load_env():
    """Charge automatiquement le .env depuis le dossier du .exe ou du script."""
    base = os.path.dirname(sys.executable if getattr(sys, 'frozen', False) else os.path.abspath(__file__))
    env_path = os.path.join(base, ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())
        print(f"[GW2] Cle API chargee depuis {env_path}")
    else:
        print(f"[GW2] Pas de .env trouve — cle API a passer via le tracker")


def resolve_server_lang(cli_lang):
    """Résout la langue par défaut du serveur : CLI > .env GW2_LANG > 'en'.

    .env est déjà chargé dans os.environ par load_env() (y compris pour le .exe gelé,
    où le .env est lu à côté de l'exécutable). Une valeur non supportée → fallback 'en'.
    """
    raw = (cli_lang or os.environ.get("GW2_LANG") or "").strip().lower()
    if raw in SUPPORTED_LANGS:
        return raw
    if raw:
        print(f"[GW2] Langue '{raw}' non supportee — fallback '{DEFAULT_LANG}'")
    return DEFAULT_LANG


def main():
    global SERVER_LANG

    load_env()  # Toujours charger .env au démarrage (inclut GW2_LANG si présent)

    parser = argparse.ArgumentParser(description="GW2 Legendary Tracker Server")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Port d'ecoute (defaut: 5000)")
    parser.add_argument("--lang", choices=sorted(SUPPORTED_LANGS), default=None,
                        help="Langue par defaut des libelles (en/fr). Defaut: GW2_LANG du .env, sinon en")
    parser.add_argument("--env", action="store_true", help="(obsolete, .env charge automatiquement)")
    args = parser.parse_args()

    SERVER_LANG = resolve_server_lang(args.lang)

    print("=" * 50)
    print("  GW2 Legendary Tracker Server")
    print(f"  Ecoute sur : http://localhost:{args.port}")
    print(f"  Langue     : {SERVER_LANG}  (override par requete: ?lang=fr)")
    print(f"  Test       : http://localhost:{args.port}/health")
    print("  Arret      : Ctrl+C ou fermer la fenetre")
    print("=" * 50)

    app.run(host="127.0.0.1", port=args.port, debug=False)


if __name__ == "__main__":
    main()
