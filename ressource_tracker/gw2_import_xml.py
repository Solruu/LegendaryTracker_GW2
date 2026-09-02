"""
GW2 — Import XML Blish/TacO vers gw2_nodes.json
=================================================
Parse tous les fichiers *.xml d'un dossier (récursif) et injecte
les nodes dans gw2_nodes.json (compatible avec le reste du projet).

Usage :
    python gw2_import_xml.py [--folder <chemin>] [--dry-run]

Options :
    --folder <chemin>   Dossier source (défaut : dossier du script, map*.xml)
    --dry-run           Affiche les stats sans modifier gw2_nodes.json

Exemples :
    python gw2_import_xml.py
    python gw2_import_xml.py --folder "C:/BlishHUD/Markers/MyPack"
    python gw2_import_xml.py --folder "D:/packs/TW_Gathering" --dry-run
"""

import glob, json, os, re, sys
from datetime import datetime

# ---------------------------------------------------------------------------
# Fichiers
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
NODES_FILE = os.path.join(SCRIPT_DIR, "gw2_nodes.json")

def resolve_xml_files():
    """Retourne la liste des fichiers XML à parser selon les arguments."""
    args = sys.argv[1:]
    if "--folder" in args:
        idx = args.index("--folder")
        if idx + 1 >= len(args):
            print("  ⚠️  --folder requiert un chemin en argument")
            sys.exit(1)
        folder = args[idx + 1]
        if not os.path.isdir(folder):
            print(f"  ⚠️  Dossier introuvable : {folder}")
            sys.exit(1)
        # Récursif : tous les *.xml dans le dossier et sous-dossiers
        files = sorted(glob.glob(os.path.join(folder, "**", "*.xml"), recursive=True))
        print(f"  📂 Source : {folder}  ({len(files)} fichiers XML trouvés)")
    else:
        files = sorted(glob.glob(os.path.join(SCRIPT_DIR, "map*.xml")))
        print(f"  📂 Source : {SCRIPT_DIR}  (map*.xml, {len(files)} fichiers)")
    return files

# ---------------------------------------------------------------------------
# Mapping : clé XML → (slug, groupe, label_affichage)
# ---------------------------------------------------------------------------
TYPE_MAP = {
    # ── Végétaux ────────────────────────────────────────────────────────────
    "coral":            ("coral",            "Vegetal", "Coral"),
    "crocus":           ("black_crocus",     "Vegetal", "Black Crocus"),
    "herbs":            ("mixed_harvesting", "Vegetal", "Mixed Harvesting Node"),
    "om":               ("omnomberry",       "Vegetal", "Omnomberry Bush"),
    "potato":           ("potato",           "Vegetal", "Potato"),
    "pumpkins":         ("sugar_pumpkin",    "Vegetal", "Sugar Pumpkin"),
    "strawberry":       ("strawberry",       "Vegetal", "Strawberry Patch"),
    "truffle":          ("truffle",          "Vegetal", "Truffle"),
    "artichoke":        ("artichoke",        "Vegetal", "Artichoke"),
    "asparagus":        ("asparagus",        "Vegetal", "Asparagus"),
    "butternut":        ("butternut",        "Vegetal", "Butternut Squash"),
    "cabbage":          ("cabbage",          "Vegetal", "Cabbage"),
    "cauliflower":      ("cauliflower",      "Vegetal", "Cauliflower"),
    "cayennepepper":    ("cayenne_pepper",   "Vegetal", "Cayenne Pepper"),
    "ghostpepper":      ("ghost_pepper",     "Vegetal", "Ghost Pepper"),
    "grapes":           ("grapes",           "Vegetal", "Grapes"),
    "herbpatch":        ("herb_patch",       "Vegetal", "Herb Patch"),
    "herbseedlings":    ("herb_seedlings",   "Vegetal", "Herb Seedlings"),
    "herbsprouts":      ("herb_sprouts",     "Vegetal", "Herb Sprouts"),
    "lettuce":          ("lettuce",          "Vegetal", "Lettuce"),
    "mushroom":         ("mushroom_button",  "Vegetal", "Button Mushrooms"),
    "onion":            ("onion",            "Vegetal", "Onions"),
    "potatoes":         ("potato",           "Vegetal", "Potato"),
    "saffron":          ("saffron",          "Vegetal", "Saffron"),
    "spinach":          ("spinach",          "Vegetal", "Spinach"),
    "strawberries":     ("strawberry",       "Vegetal", "Strawberry Patch"),
    "sugarpumpkins":    ("sugar_pumpkin",    "Vegetal", "Sugar Pumpkin"),
    "carrots":          ("carrot",           "Vegetal", "Carrots"),
    "clam":             ("clam",             "Vegetal", "Clam"),
    "flax":             ("flax",             "Vegetal", "Flax"),
    "mixed":            ("mixed_harvesting", "Vegetal", "Mixed Harvesting Node"),
    "mussels":          ("mussels",          "Vegetal", "Mussels"),
    "seaweed":          ("seaweed",          "Vegetal", "Seaweed"),
    "sunflower":        ("sunflower",        "Vegetal", "Sunflower"),
    "taproots":         ("taproots",         "Vegetal", "Taproots"),
    "toxicseedling":    ("toxic_seedling",   "Vegetal", "Toxic Seedling"),
    "varietalmint":     ("varietal_mint",    "Vegetal", "Varietal Mint Leaf"),
    # ── Bois ────────────────────────────────────────────────────────────────
    "aspen":            ("soft_wood",        "Bois",    "Aspen Sapling"),
    "cypress":          ("cypress",          "Bois",    "Cypress Sapling"),
    "elderwood":        ("elder_wood",       "Bois",    "Elder Wood Log"),
    "fir":              ("fir",              "Bois",    "Fir Sapling"),
    "gummo":            ("soft_wood",        "Bois",    "Gummo Sapling"),
    "hardwood":         ("hard_wood",        "Bois",    "Hard Wood Log"),
    "inglewood":        ("hard_wood",        "Bois",    "Inglewood Sapling"),
    "kertch":           ("seasoned_wood",    "Bois",    "Kertch Sapling"),
    "mimosa":           ("seasoned_wood",    "Bois",    "Mimosa Sapling"),
    "mun_tuy":          ("seasoned_wood",    "Bois",    "Mun-Tuy Sapling"),
    "orrian":           ("elder_wood",       "Bois",    "Orrian Sapling"),
    "petrified":        ("petrified",        "Bois",    "Petrified Echovald Sapling"),
    "pine":             ("soft_wood",        "Bois",    "Pine Sapling"),
    "redoak":           ("elder_wood",       "Bois",    "Red Oak Sapling"),
    "seasonedwood":     ("seasoned_wood",    "Bois",    "Seasoned Wood Log"),
    "snowcherry":       ("snow_cherry",      "Bois",    "Snow Cherry Sapling"),
    "tukawa":           ("tukawa",           "Bois",    "Tukawa Sapling"),
    "ancientwood":      ("ancient_wood",     "Bois",    "Ancient Wood Log"),
    "ancientsampling":  ("ancient_wood",     "Bois",    "Ancient Sapling"),
    # ── Minerais ────────────────────────────────────────────────────────────
    "copper":           ("copper",           "Minerai", "Copper Ore"),
    "darksteel":        ("darksteel",        "Minerai", "Darksteel Ore"),
    "gold":             ("gold",             "Minerai", "Gold Ore"),
    "iron":             ("iron",             "Minerai", "Iron Ore"),
    "mithril":          ("mithril",          "Minerai", "Mithril Ore"),
    "orichalcum":       ("orichalcum",       "Minerai", "Orichalcum Ore"),
    "platinum":         ("platinum",         "Minerai", "Platinum Ore"),
    "quartz":           ("quartz",           "Minerai", "Quartz Crystal"),
    "richcopper":       ("rich_copper",      "Minerai", "Rich Copper Vein"),
    "richgold":         ("rich_gold",        "Minerai", "Rich Gold Vein"),
    "richiron":         ("rich_iron",        "Minerai", "Rich Iron Vein"),
    "richmithril":      ("rich_mithril",     "Minerai", "Rich Mithril Vein"),
    "richorichalcum":   ("rich_orichalcum",  "Minerai", "Rich Orichalcum Vein"),
    "richplatinum":     ("rich_platinum",    "Minerai", "Rich Platinum Vein"),
    "richsilver":       ("rich_silver",      "Minerai", "Rich Silver Vein"),
    "silver":           ("silver",           "Minerai", "Silver Ore"),
    "sunstone":         ("sunstone",         "Minerai", "Sunstone Nugget"),
    "ambrite":          ("ambrite",          "Minerai", "Ambrite"),
    "fulgurite":        ("fulgurite",        "Minerai", "Fulgurite"),
}

# Regex format TW : tw_guides.tw_gatheringnodes.tw_gatheringnodes_XXX_node
NODE_RE_TW = re.compile(
    r'type="tw_guides\.tw_gatheringnodes\.tw_gatheringnodes_(\w+)\.tw_gatheringnodes_\w+_node"'
    r'\s+mapid="(\d+)"'
    r'\s+xpos="([\-\d.]+)"'
    r'\s+ypos="([\-\d.]+)"'
    r'\s+zpos="([\-\d.]+)"',
    re.IGNORECASE
)

# Regex format LEGS : legs.gathering.{ore|wood|plants}.TYPENAME.node
NODE_RE_LEGS = re.compile(
    r'type="legs\.gathering\.(?:ore|wood|plants|tree|plant|fish|aquatic)\.[^.]*\.(\w+)\.node"'
    r'\s+mapid="(\d+)"'
    r'\s+xpos="([\-\d.]+)"'
    r'\s+ypos="([\-\d.]+)"'
    r'\s+zpos="([\-\d.]+)"',
    re.IGNORECASE
)

# Regex format LEGS simplifié : legs.gathering.XXX.node (3 segments)
NODE_RE_LEGS2 = re.compile(
    r'type="legs\.gathering\.(?:ore|wood|plants|tree|plant|fish|aquatic)\.(\w+)\.node"'
    r'\s+mapid="(\d+)"'
    r'\s+xpos="([\-\d.]+)"'
    r'\s+ypos="([\-\d.]+)"'
    r'\s+zpos="([\-\d.]+)"',
    re.IGNORECASE
)

def extract_nodes_from_content(content):
    """Retourne une liste de (raw_key, map_id, x, y, z) depuis le contenu XML."""
    results = []
    seen_pos = set()

    for pattern in (NODE_RE_TW, NODE_RE_LEGS, NODE_RE_LEGS2):
        for m in pattern.finditer(content):
            pos = (m.group(2), m.group(3), m.group(5))  # mapid, x, z
            if pos in seen_pos:
                continue
            seen_pos.add(pos)
            raw_key = m.group(1).lower().replace("_", "").replace(" ", "")
            results.append((raw_key, int(m.group(2)),
                            float(m.group(3)), float(m.group(4)), float(m.group(5))))
    return results

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def load_nodes():
    if os.path.exists(NODES_FILE):
        with open(NODES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_nodes(nodes):
    with open(NODES_FILE, "w", encoding="utf-8") as f:
        json.dump(nodes, f, indent=2, ensure_ascii=False)

def make_key(n):
    return (n["type"], n["map_id"], round(n["x"]), round(n["z"]))

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    dry_run = "--dry-run" in sys.argv

    xml_files = resolve_xml_files()
    if not xml_files:
        print("  ⚠️  Aucun fichier XML trouvé.")
        return

    nodes    = load_nodes()
    existing = {make_key(n) for n in nodes}

    imported  = 0
    dupes     = 0
    unknown   = set()
    by_type   = {}

    for fname in xml_files:
        try:
            content = open(fname, encoding="utf-8", errors="replace").read()
        except Exception as e:
            print(f"  ⚠️  Erreur lecture {fname}: {e}")
            continue

        for raw_key, map_id, x, y, z in extract_nodes_from_content(content):

            if raw_key not in TYPE_MAP:
                unknown.add(raw_key)
                continue

            slug, group, label = TYPE_MAP[raw_key]
            node = {
                "type":        slug,
                "group":       group,
                "label":       label,
                "map_id":      map_id,
                "x":           round(x, 4),
                "y":           round(y, 4),
                "z":           round(z, 4),
                "source":      "xml_import",
                "captured_at": datetime.now().isoformat(),
            }
            key = make_key(node)
            if key in existing:
                dupes += 1
                continue
            existing.add(key)
            nodes.append(node)
            imported += 1
            by_type[label] = by_type.get(label, 0) + 1

    print(f"\n{'='*50}")
    print(f"  Fichiers XML parsés : {len(xml_files)}")
    print(f"  Nodes importés      : {imported}")
    print(f"  Doublons ignorés    : {dupes}")
    print(f"  Total JSON          : {len(nodes)}")
    print(f"\n  Par type :")
    for label, count in sorted(by_type.items()):
        print(f"    {label:<35} {count:>4}")
    if unknown:
        print(f"\n  Types XML non mappés (à ajouter dans TYPE_MAP) :")
        for u in sorted(unknown):
            print(f"    '{u}'")

    if not dry_run:
        save_nodes(nodes)
        print(f"\n  ✅ Sauvegardé dans {NODES_FILE}")
    else:
        print(f"\n  🔍 Dry-run — aucune modification")

if __name__ == "__main__":
    main()