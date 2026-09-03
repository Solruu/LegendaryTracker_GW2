"""
GW2 Node Capture — MumbleLink (v8)
====================================
Sélection manuelle du type de node, capture position via F12.

WORKFLOW :
  1. Lance le script en administrateur
  2. Choisis le type de node dans le menu console
  3. En jeu, approche-toi du node et appuie sur F12
  4. T + Entrée → changer de type | Q + Entrée → quitter

Dépendances : pip install keyboard
"""

import argparse, json, mmap, os, struct, subprocess, sys
from datetime import datetime

try:
    import keyboard
except ImportError:
    print("Module 'keyboard' manquant. Lance : pip install keyboard")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Types de nodes
# ---------------------------------------------------------------------------
NODE_TYPES_LIST = [
    # ── MINERAI ──────────────────────────────────────────────────────────────────
    ("copper", "Minerai", "Copper Ore", False),
    ("darksteel", "Minerai", "Darksteel Ore", False),
    ("difluorite", "Minerai", "Difluorite Crystal", False),
    ("fulgurite", "Minerai", "Fulgurite", False),
    ("gold", "Minerai", "Gold Ore", False),
    ("iron", "Minerai", "Iron Ore", False),
    ("jade", "Minerai", "Jade", False),
    ("mithril", "Minerai", "Mithril Ore", False),
    ("orichalcum", "Minerai", "Orichalcum Ore", False),
    ("platinum", "Minerai", "Platinum Ore", False),
    ("prismaticite", "Minerai", "Prismaticite Crystal", False),
    ("quartz", "Minerai", "Quartz Crystal", False),
    ("rich_copper", "Minerai", "Rich Copper Vein", False),
    ("rich_gold", "Minerai", "Rich Gold Vein", False),
    ("rich_iron", "Minerai", "Rich Iron Vein", False),
    ("rich_mithril", "Minerai", "Rich Mithril Vein", False),
    ("rich_orichalcum", "Minerai", "Rich Orichalcum Vein", False),
    ("rich_platinum", "Minerai", "Rich Platinum Vein", False),
    ("rich_silver", "Minerai", "Rich Silver Vein", False),
    ("silver", "Minerai", "Silver Ore", False),
    ("somnorite", "Minerai", "Somnorite Ore", False),
    ("vesperite", "Minerai", "Vesperite Ore", False),
    # ── BOIS ──────────────────────────────────────────────────────────────────
    ("ancient_sapling", "Bois", "Ancient Sapling", False),
    ("ancient_spiderknot_tree", "Bois", "Ancient Spiderknot Tree", False),
    ("ancient_wood", "Bois", "Ancient Wood Log", False),
    ("aspen", "Bois", "Aspen Sapling", False),
    ("banyan", "Bois", "Banyan Sapling", False),
    ("baoba", "Bois", "Baoba Sapling", False),
    ("cypress", "Bois", "Cypress Sapling", False),
    ("ekku", "Bois", "Ekku Sapling", False),
    ("elder_wood", "Bois", "Elder Wood Log", False),
    ("fir", "Bois", "Fir Sapling", False),
    ("green_wood", "Bois", "Green Wood Sapling", False),
    ("gummo", "Bois", "Gummo Sapling", False),
    ("hard_wood", "Bois", "Hard Wood Log", False),
    ("inglewood", "Bois", "Inglewood Sapling", False),
    ("kertch", "Bois", "Kertch Sapling", False),
    ("mebahya", "Bois", "Mebahya Sapling", False),
    ("mimosa", "Bois", "Mimosa Sapling", False),
    ("orrian_sapling", "Bois", "Orrian Sapling", False),
    ("palm", "Bois", "Palm Sapling", False),
    ("petrified", "Bois", "Petrified Echovald Sapling", False),
    ("pine", "Bois", "Pine Sapling", False),
    ("red_oak", "Bois", "Red Oak Sapling", False),
    ("seasoned_wood", "Bois", "Seasoned Wood Log", False),
    ("snow_cherry", "Bois", "Snow Cherry Sapling", False),
    ("soft_wood", "Bois", "Soft Wood Sapling", False),
    ("spiderknot_tree", "Bois", "Spiderknot Tree", False),
    ("tukawa", "Bois", "Tukawa Sapling", False),
    # ── VEGETAL ──────────────────────────────────────────────────────────────────
    ("artichoke", "Vegetal", "Artichokes", True),
    ("asparagus", "Vegetal", "Asparagus", True),
    ("black_crocus", "Vegetal", "Black Crocus", False),
    ("blackberries", "Vegetal", "Blackberries", True),
    ("blueberry", "Vegetal", "Blueberry Bush", True),
    ("butternut", "Vegetal", "Butternut Squash", True),
    ("mushroom_button", "Vegetal", "Button Mushrooms", True),
    ("cabbage", "Vegetal", "Cabbage", True),
    ("carrot", "Vegetal", "Carrots", True),
    ("cauliflower", "Vegetal", "Cauliflower", True),
    ("cayenne_pepper", "Vegetal", "Cayenne Pepper", False),
    ("clam", "Vegetal", "Clam", False),
    ("coral", "Vegetal", "Coral", False),
    ("flax", "Vegetal", "Flax", False),
    ("ghost_pepper", "Vegetal", "Ghost Pepper", False),
    ("grapes", "Vegetal", "Grapes", True),
    ("haresfoot", "Vegetal", "Haresfoot Herb", False),
    ("hatched_chili", "Vegetal", "Hatched Chili Pepper Bush", False),
    ("herb_patch", "Vegetal", "Herb Patch", True),
    ("herb_seedlings", "Vegetal", "Herb Seedlings", True),
    ("herb_sprouts", "Vegetal", "Herb Sprouts", True),
    ("kale", "Vegetal", "Kale", True),
    ("leeks", "Vegetal", "Leeks", True),
    ("lentils", "Vegetal", "Lentils", True),
    ("lettuce", "Vegetal", "Lettuce", True),
    ("lotus", "Vegetal", "Lotus", False),
    ("mature_herbs", "Vegetal", "Mature Herbs", True),
    ("mixed_harvesting", "Vegetal", "Mixed Harvesting Node", True),
    ("mussel", "Vegetal", "Mussel", False),
    ("omnomberry", "Vegetal", "Omnomberry Bush", False),
    ("onion", "Vegetal", "Onions", True),
    ("orrian_oyster", "Vegetal", "Orrian Oyster", False),
    ("orrian_truffle", "Vegetal", "Orrian Truffle", False),
    ("passiflora", "Vegetal", "Passiflora", False),
    ("portobello", "Vegetal", "Portobello Mushrooms", True),
    ("potato", "Vegetal", "Potato", True),
    ("primordial_orchid", "Vegetal", "Primordial Orchid", False),
    ("raspberries", "Vegetal", "Raspberries", True),
    ("root_vegetables", "Vegetal", "Root Vegetables", True),
    ("sawgill", "Vegetal", "Sawgill Mushrooms", False),
    ("scallions", "Vegetal", "Scallions", True),
    ("seaweed", "Vegetal", "Seaweed", False),
    ("shing_jea_orchid", "Vegetal", "Shing Jea Orchid", False),
    ("snow_truffle", "Vegetal", "Snow Truffle", False),
    ("spinach", "Vegetal", "Spinach", True),
    ("strawberry", "Vegetal", "Strawberry Patch", True),
    ("sugar_pumpkin", "Vegetal", "Sugar Pumpkin", True),
    ("sunflower", "Vegetal", "Sunflower", False),
    ("toxic_seedling", "Vegetal", "Toxic Seedling", False),
    ("truffle", "Vegetal", "Truffle", False),
    ("mushroom_varied", "Vegetal", "Varied Mushrooms", True),
    ("taproot", "Vegetal", "Variegated Taproot", True),
    ("varietal_mint", "Vegetal", "Varietal Mint Seed", True),
    ("verdant_herbs", "Vegetal", "Verdant Herbs", True),
    ("vegetal_unknown", "Vegetal", "Végétal (type variable)", True),
    ("winter_root", "Vegetal", "Winter Root Vegetables", True),
    ("young_herbs", "Vegetal", "Young Herbs", True),
    ("zucchini", "Vegetal", "Zucchini", True),
    # ── SPECIAL ──────────────────────────────────────────────────────────────────
    ("quartz_formation", "Special", "Quartz Crystal Formation", False),
]# ---------------------------------------------------------------------------
# MumbleLink
# ---------------------------------------------------------------------------
MUMBLE_LINK_SIZE  = 5460
OFFSET_AVATAR_POS = 8
OFFSET_MAP_ID     = 1136

class MumbleLink:
    def __init__(self):
        try:
            self._map = mmap.mmap(-1, MUMBLE_LINK_SIZE, "MumbleLink")
        except Exception as e:
            print(f"[ERREUR] MumbleLink : {e}")
            print("         GW2 doit être lancé et ton perso en jeu.")
            sys.exit(1)

    def read(self):
        try:
            self._map.seek(0)
            data = self._map.read(MUMBLE_LINK_SIZE)
            if struct.unpack_from("<I", data, 4)[0] == 0:
                return None
            ax, ay, az = struct.unpack_from("<fff", data, OFFSET_AVATAR_POS)
            map_id     = struct.unpack_from("<I",   data, OFFSET_MAP_ID)[0]
            return ax, ay, az, map_id
        except Exception:
            return None

# ---------------------------------------------------------------------------
# Nodes JSON
# ---------------------------------------------------------------------------
NODES_FILE = "gw2_nodes.json"
UPSERT_THRESHOLD = 5.0

def load_nodes():
    if os.path.exists(NODES_FILE):
        with open(NODES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_nodes(nodes):
    with open(NODES_FILE, "w", encoding="utf-8") as f:
        json.dump(nodes, f, indent=2, ensure_ascii=False)

def dist3d(a, b):
    return ((a["x"]-b["x"])**2 + (a["y"]-b["y"])**2 + (a["z"]-b["z"])**2) ** 0.5

def find_nearby(nodes, x, y, z, map_id):
    probe = {"x": x, "y": y, "z": z}
    best_dist, best = UPSERT_THRESHOLD, (None, None)
    for i, n in enumerate(nodes):
        if n["map_id"] != map_id:
            continue
        d = dist3d(n, probe)
        if d < best_dist:
            best_dist, best = d, (i, n)
    return best

# ---------------------------------------------------------------------------
# Menu
# ---------------------------------------------------------------------------
def print_menu():
    print("\n" + "="*55)
    print("  GW2 Node Capture — choix du type")
    print("="*55)
    group = None
    for i, (slug, grp, label, rand) in enumerate(NODE_TYPES_LIST):
        if grp != group:
            print(f"\n  [{grp}]")
            group = grp
        tag = " ⚠" if rand else ""
        print(f"  {i+1:3d}. {label}{tag}")
    print("\n" + "="*55)

def select_type():
    print_menu()
    while True:
        try:
            idx = int(input(f"\n  Numéro (1-{len(NODE_TYPES_LIST)}) : ").strip()) - 1
            if 0 <= idx < len(NODE_TYPES_LIST):
                slug, group, label, rand = NODE_TYPES_LIST[idx]
                tag = " [variable]" if rand else ""
                print(f"\n  ✔ {label} ({group}){tag}")
                print("  → F12 pour capturer | T pour changer de type")
                return slug, group, label, rand
        except (ValueError, KeyboardInterrupt):
            pass
        print(f"  Entre un nombre entre 1 et {len(NODE_TYPES_LIST)}.")

# ---------------------------------------------------------------------------
# Taco gen
# ---------------------------------------------------------------------------
BLISH_MARKERS = os.path.join(os.path.expanduser("~"), "Documents",
                             "Guild Wars 2", "addons", "blishhud", "markers")
DEFAULT_TACO  = os.path.join(BLISH_MARKERS, "gw2_farm.taco")

def run_taco_gen(output_taco=None):
    if output_taco is None:
        output_taco = DEFAULT_TACO
    here = os.path.dirname(os.path.abspath(__file__))
    taco_script = os.path.join(here, "gw2_taco_gen_v6.py")
    if not os.path.exists(taco_script):
        print("  ⚠️  gw2_taco_gen_v6.py introuvable — génération ignorée.")
        return
    os.makedirs(os.path.dirname(output_taco), exist_ok=True)
    print(f"\n  🔧 Génération du pack .taco → {output_taco}")
    try:
        subprocess.run([sys.executable, taco_script,
                        "--input", NODES_FILE, "--output", output_taco], check=True)
    except subprocess.CalledProcessError as e:
        print(f"  ⚠️  Erreur lors de la génération : {e}")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="GW2 Node Capture — MumbleLink")
    parser.add_argument("--taco", default=None, metavar="CHEMIN.taco",
                        help=f"Chemin du .taco de sortie (défaut: {DEFAULT_TACO})")
    args = parser.parse_args()

    print("\n🗺️  GW2 Node Capture")
    print("   Lance en ADMINISTRATEUR. GW2 doit être en jeu.\n")

    ml    = MumbleLink()
    nodes = load_nodes()
    print(f"  Nodes existants : {len(nodes)}")

    selected = list(select_type())  # [slug, group, label, rand]

    def on_f12():
        pos = ml.read()
        if pos is None:
            print("\n  ⚠️  Position indisponible")
            return
        ax, ay, az, map_id = pos
        slug, group, label, rand = selected

        nearby_idx, nearby = find_nearby(nodes, ax, ay, az, map_id)

        if nearby is not None and nearby["group"] == "Vegetal" and group == "Vegetal":
            old = nearby["label"]
            nodes[nearby_idx].update({"type": slug, "group": group, "label": label,
                                       "updated_at": datetime.now().isoformat()})
            save_nodes(nodes)
            d = dist3d(nearby, {"x": ax, "y": ay, "z": az})
            print(f"\n  🔄 [{old}] → [{label}]  Δ{d:.1f}m  map={map_id}")
        else:
            node = {"type": slug, "group": group, "label": label, "map_id": map_id,
                    "x": round(ax,4), "y": round(ay,4), "z": round(az,4),
                    "captured_at": datetime.now().isoformat()}
            nodes.append(node)
            save_nodes(nodes)
            print(f"\n  ✅ [{label}]  map={map_id} | x={ax:.1f} y={ay:.1f} z={az:.1f}  (total: {len(nodes)})")

    keyboard.add_hotkey("f12", on_f12)
    print("\n  F12 = capturer | T = changer type | Q = quitter\n")

    while True:
        try:
            cmd = input().strip().lower()
            if cmd == "q":
                keyboard.unhook_all()
                save_nodes(nodes)
                run_taco_gen(args.taco)
                sys.exit(0)
            elif cmd in ("t", "type"):
                new = list(select_type())
                selected[:] = new
            else:
                print(f"  [{selected[2]}]  F12=capturer | T=changer | Q=quitter")
        except KeyboardInterrupt:
            save_nodes(nodes)
            run_taco_gen(args.taco)
            sys.exit(0)

if __name__ == "__main__":
    main()