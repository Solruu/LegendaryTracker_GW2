"""
GW2 Fetch Icons (v3)
=====================
Télécharge les icônes officielles de chaque type de node depuis l'API GW2
et les stocke dans le dossier icons/ utilisé par gw2_taco_gen_v1.py.
Les slugs sans item_id connu (FALLBACK_SLUGS) reçoivent l'icône générique
plutôt que d'être ignorés — gw2_taco_gen_v1.py exige un fichier par slug
utilisé pour afficher une icône (sinon marqueur par défaut BlishHUD).

Usage :
    python gw2_fetch_icons.py
    python gw2_fetch_icons.py --output icons/     # dossier personnalisé
    python gw2_fetch_icons.py --size 32           # taille PNG (16, 32, 64)
    python gw2_fetch_icons.py --force             # re-télécharge même si déjà présent

Dépendances : aucune (stdlib uniquement)
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error

# ---------------------------------------------------------------------------
# Mapping slug → item_id GW2 API
# Source : https://api.guildwars2.com/v2/items?ids=...
# ---------------------------------------------------------------------------
SLUG_TO_ITEM_ID = {
    # ── Minerais standards ────────────────────────────────────────────────────
    "copper": 19697,
    "iron": 19699,
    "silver": 19703,
    "gold": 19698,
    "platinum": 19702,
    "darksteel": 19702,
    "mithril": 19700,
    "orichalcum": 19701,
    # ── Minerais extension ────────────────────────────────────────────────────
    "quartz": 43773,
    "ambrite": 66637,
    "difluorite": 86977,
    "jade": 97102,
    "prismaticite": 94163,
    "somnorite": 19701,
    "vesperite": 19700,
    # ── Rich veins (meme icone que le minerai de base) ────────────────────────
    "rich_iron": 19699,
    "rich_silver": 19703,
    "rich_gold": 19698,
    "rich_mithril": 19700,
    "rich_orichalcum": 19701,
    "rich_copper": 19697,
    "rich_platinum": 19702,
    "sunstone": 24471,
    # ── Bois ──────────────────────────────────────────────────────────────────
    "green_wood": 19723,
    "soft_wood": 19726,
    "seasoned_wood": 19727,
    "hard_wood": 19724,
    "elder_wood": 19722,
    "ancient_wood": 19725,
    "cypress": 19722,
    "palm": 19722,
    "red_oak": 19722,
    "sawgill": 73504,
    # ── Vegetal ───────────────────────────────────────────────────────────────
    "blueberry": 12255,
    "mushroom_button": 12147,
    "carrot": 12134,
    "onion": 12142,
    "potato": 12135,
    "lettuce": 12238,
    "strawberry": 12253,
    "spinach": 12241,
    "grapes": 12341,
    "cabbage": 12332,
    "zucchini": 12330,
    "kale": 12333,
    "portobello": 12334,
    "blackberries": 12537,
    "sugar_pumpkin": 12538,
    "cauliflower": 12532,
    "leeks": 12508,
    "raspberries": 12254,
    "asparagus": 12505,
    "cayenne_pepper": 12504,
    "butternut": 12511,
    "artichoke": 12512,
    "lotus": 12510,
    "omnomberry": 12128,
    "orrian_truffle": 12545,
    "snow_truffle": 12144,
    "ghost_pepper": 12544,
    "mussel": 74266,
    "seaweed": 12509,
    "scallions": 12533,
    "saffron": 12547,
    "clam": 12327,
    "orrian_oyster": 81837,
    "passiflora": 36731,
    "black_crocus": 12547,
    # ── Special ───────────────────────────────────────────────────────────────
    "mawdrey_target": 68996,
    "quartz_formation": 43773,
}


# ---------------------------------------------------------------------------
# Slugs présents dans gw2_node_ID_v3.py (NODE_TYPES_LIST) mais SANS item_id
# vérifié ci-dessus → reçoivent l'icône générique de secours (FALLBACK_ICON_URL)
# plutôt que rien du tout. À compléter au fil des sessions si un item_id
# fiable est trouvé (jamais d'ID deviné — cf. règle "ne pas inventer de donnée").
# ---------------------------------------------------------------------------
FALLBACK_SLUGS = [
    "coral",
    "fir",
    "flax",
    "fulgurite",
    "haresfoot",
    "hatched_chili",
    "herb_patch",
    "herb_seedlings",
    "herb_sprouts",
    "lentils",
    "mature_herbs",
    "mixed_harvesting",
    "mushroom_varied",
    "orrian_sapling",
    "petrified",
    "primordial_orchid",
    "root_vegetables",
    "shing_jea_orchid",
    "snow_cherry",
    "sunflower",
    "taproot",
    "toxic_seedling",
    "truffle",
    "tukawa",
    "varietal_mint",
    "vegetal_unknown",
    "verdant_herbs",
    "winter_root",
    "young_herbs",
]


# Fallback pour les slugs sans item_id connu (icône générique GW2)
FALLBACK_ICON_URL = (
    "https://wiki.guildwars2.com/images/9/9b/"
    "Piece_of_Common_Unidentified_Gear.png"
)  # v2 : l'ancienne URL render.guildwars2.com renvoie 500 (03/09/2026).
   # Remplacée par une image hébergée par le wiki lui-même (source fournie),
   # plus stable que le CDN de rendu du jeu qui tourne ses hashs de fichier.

GW2_API_ITEMS  = "https://api.guildwars2.com/v2/items"
GW2_RENDER_CDN = "https://render.guildwars2.com"

BATCH_SIZE = 50   # max ids par appel API
RETRY      = 3
PAUSE      = 0.3  # secondes entre requêtes


# ---------------------------------------------------------------------------
# Helpers HTTP
# ---------------------------------------------------------------------------
def http_get_json(url, retry=RETRY):
    for attempt in range(retry):
        try:
            with urllib.request.urlopen(url, timeout=15) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            if attempt < retry - 1:
                time.sleep(1)
            else:
                raise RuntimeError(f"GET {url} → {e}") from e

def http_get_bytes(url, retry=RETRY):
    for attempt in range(retry):
        try:
            with urllib.request.urlopen(url, timeout=15) as r:
                return r.read()
        except Exception as e:
            if attempt < retry - 1:
                time.sleep(1)
            else:
                raise RuntimeError(f"GET {url} → {e}") from e


# ---------------------------------------------------------------------------
# Résolution item_id → icon_url via l'API GW2
# ---------------------------------------------------------------------------
def resolve_icon_urls(item_ids):
    """Retourne {item_id: icon_url} pour une liste d'item_ids."""
    unique_ids = list(set(item_ids))
    result = {}
    for i in range(0, len(unique_ids), BATCH_SIZE):
        batch = unique_ids[i:i + BATCH_SIZE]
        ids_str = ",".join(str(x) for x in batch)
        url = f"{GW2_API_ITEMS}?ids={ids_str}"
        try:
            items = http_get_json(url)
            for item in items:
                if "icon" in item:
                    result[item["id"]] = item["icon"]
        except RuntimeError as e:
            print(f"  ⚠️  Erreur API batch {i//BATCH_SIZE + 1} : {e}")
        time.sleep(PAUSE)
    return result


# ---------------------------------------------------------------------------
# Téléchargement PNG
# ---------------------------------------------------------------------------
def download_icon(icon_url, dest_path, size):
    """
    Télécharge l'icône depuis render.guildwars2.com.
    L'URL de base est en .png; on peut demander une taille via le CDN
    en remplaçant le nom de fichier, mais render.gw2.com ne supporte pas
    le redimensionnement → on sauvegarde telle quelle (64x64 natif).
    Le paramètre size est réservé pour un futur redimensionnement Pillow.
    """
    try:
        data = http_get_bytes(icon_url)
        with open(dest_path, "wb") as f:
            f.write(data)
        return True
    except RuntimeError as e:
        print(f"  ⚠️  Téléchargement échoué ({icon_url}) : {e}")
        return False


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Télécharge les icônes GW2 pour le pack .taco")
    parser.add_argument("--output", default="icons", help="Dossier de sortie (défaut: icons/)")
    parser.add_argument("--size",   default=32, type=int, choices=[16, 32, 64],
                        help="Taille cible en px (défaut: 32) — informatif, le CDN renvoie du 64x64")
    parser.add_argument("--force",  action="store_true",
                        help="Re-télécharge même si l'icône existe déjà")
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)

    slugs_with_id    = {s: iid for s, iid in SLUG_TO_ITEM_ID.items() if iid}
    slugs_without_id = [s for s in SLUG_TO_ITEM_ID if not SLUG_TO_ITEM_ID[s]]

    print(f"[1/3] Résolution de {len(set(slugs_with_id.values()))} item_ids via l'API GW2...")
    item_icon_map = resolve_icon_urls(list(slugs_with_id.values()))
    print(f"      {len(item_icon_map)} icônes résolues.")

    print(f"\n[2/3] Téléchargement des icônes dans '{args.output}/'...")
    ok = fail = skip = 0

    for slug, item_id in SLUG_TO_ITEM_ID.items():
        dest = os.path.join(args.output, f"{slug}.png")

        if not args.force and os.path.exists(dest):
            skip += 1
            continue

        icon_url = item_icon_map.get(item_id, FALLBACK_ICON_URL)
        sys.stdout.write(f"  {slug:<30} → ")
        sys.stdout.flush()

        if download_icon(icon_url, dest, args.size):
            size_kb = os.path.getsize(dest) / 1024
            print(f"OK ({size_kb:.1f} KB)")
            ok += 1
        else:
            # Essai avec le fallback
            if download_icon(FALLBACK_ICON_URL, dest, args.size):
                print(f"FALLBACK")
                ok += 1
            else:
                print(f"ÉCHEC")
                fail += 1

        time.sleep(PAUSE)

    # Slugs sans item_id connu (FALLBACK_SLUGS) → icône générique de secours
    for slug in FALLBACK_SLUGS:
        dest = os.path.join(args.output, f"{slug}.png")
        if not args.force and os.path.exists(dest):
            skip += 1
            continue
        sys.stdout.write(f"  {slug:<30} → ")
        sys.stdout.flush()
        if download_icon(FALLBACK_ICON_URL, dest, args.size):
            print("OK (fallback générique)")
            ok += 1
        else:
            print("ÉCHEC")
            fail += 1
        time.sleep(PAUSE)

    print(f"\n[3/3] Résumé")
    print(f"  ✅ Téléchargés : {ok}")
    print(f"  ⏭️  Déjà présents (skippés) : {skip}")
    print(f"  ❌ Échecs       : {fail}")
    print(f"  ℹ️  {len(FALLBACK_SLUGS)} slugs sur icône générique (pas d'item_id connu) : "
          f"{', '.join(FALLBACK_SLUGS)}")
    print(f"\n  → Lance maintenant : python gw2_taco_gen_v1.py")
    print(f"     Les icônes dans '{args.output}/' seront embarquées dans le .taco")


if __name__ == "__main__":
    main()