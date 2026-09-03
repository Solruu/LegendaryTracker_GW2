"""
GW2 Fetch Icons (v1)
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
    # ── Minerais standards ──────────────────────────────────────────────────
    "copper":           19697,
    "iron":             19699,
    "silver":           19698,
    "gold":             19700,
    "platinum":         19701,
    "darksteel":        19702,
    "mithril":          19703,
    "orichalcum":       19704,
    # Minerais extension
    "quartz":           43773,
    "ambrite":          62949,
    "fulgurite":        48807,
    "difluorite":       73248,
    "jade":             97263,
    "prismaticite":     96978,
    "somnorite":        105986,
    "vesperite":        105990,
    # Rich veins — même icône que le minerai de base
    "rich_iron":        19699,
    "rich_silver":      19698,
    "rich_gold":        19700,
    "rich_mithril":     19703,
    "rich_orichalcum":  19704,
    # ── Bois ────────────────────────────────────────────────────────────────
    "green_wood":       19723,
    "soft_wood":        19724,
    "seasoned_wood":    19725,
    "hard_wood":        19726,
    "elder_wood":       19727,
    "ancient_wood":     19728,
    "fir":              20011,
    "tukawa":           88000,   # Tukawa Sapling
    "cypress":          20013,
    "orrian_sapling":   20014,
    "snow_cherry":      46739,
    "palm":             20015,
    "petrified":        97166,
    "red_oak":          20010,
    # ── Végétaux tier 1 ─────────────────────────────────────────────────────
    "blueberry":        36730,
    "mushroom_button":  36729,
    "carrot":           36728,
    "herb_seedlings":   36726,
    "onion":            36727,
    "potato":           36725,
    "lettuce":          36724,
    # Tier 2
    "strawberry":       36737,
    "herb_sprouts":     36735,
    "spinach":          36736,
    "grapes":           36734,
    "cabbage":          36733,
    # Tier 3
    "young_herbs":      36743,
    "zucchini":         36744,
    "root_vegetables":  36742,
    "kale":             36741,
    "mushroom_varied":  36745,
    # Tier 4
    "mature_herbs":     36751,
    "scallions":        36752,
    "portobello":       36753,
    "blackberries":     36750,
    "sugar_pumpkin":    36749,
    "cauliflower":      36748,
    "taproot":          36747,
    # Tier 5
    "verdant_herbs":    36759,
    "leeks":            36760,
    "winter_root":      36758,
    "raspberries":      36757,
    "asparagus":        36761,
    "cayenne":          36756,
    "butternut":        36755,
    "artichoke":        36754,
    # Tier 6
    "lotus":            36767,
    "omnomberry":       36765,
    "orrian_truffle":   36766,
    "snow_truffle":     36764,
    "ghost_pepper":     36763,
    "mussel":           36762,
    "seaweed":          36768,
    # Extensions HoT / PoF / IBS / EoD / SotO
    "flax":             67015,
    "sawgill":          66521,
    "lentils":          70838,
    "passiflora":       72936,
    "orrian_oyster":    87828,
    "haresfoot":        66522,
    "coral":            66526,
    "shing_jea_orchid": 97166,   # fallback
    "primordial_orchid":105980,
    "hatched_chili":    105977,
    # ── Spécial ─────────────────────────────────────────────────────────────
    "mawdrey_target":   68996,   # Mawdrey II
    "quartz_formation": 43773,   # Quartz Crystal
}

# ---------------------------------------------------------------------------
# Slugs présents dans gw2_node_ID_v2.py (NODE_TYPES_LIST) mais SANS item_id
# vérifié ci-dessus → reçoivent l'icône générique de secours (FALLBACK_ICON_URL)
# plutôt que rien du tout. À compléter au fil des sessions si un item_id
# fiable est trouvé (jamais d'ID deviné — cf. règle "ne pas inventer de donnée").
# ---------------------------------------------------------------------------
FALLBACK_SLUGS = [
    "black_crocus", "clam", "herb_patch", "mixed_harvesting",
    "rich_copper", "rich_platinum", "saffron", "sunflower",
    "sunstone", "toxic_seedling", "truffle", "varietal_mint",
    "vegetal_unknown",
]

# Fallback pour les slugs sans item_id connu (icône générique GW2)
FALLBACK_ICON_URL = (
    "https://render.guildwars2.com/file/"
    "3A394ABBBF329388CFBF43BA45AAEF82FDBF0E4/1302744.png"
)

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