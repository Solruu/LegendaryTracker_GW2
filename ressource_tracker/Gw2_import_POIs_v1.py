"""
GW2 — Import POIs XML vers gw2_nodes.json
==========================================
Convertit des lignes de type :
  <POI MapID="20" xpos="..." ypos="..." zpos="..." GUID="..."/> tukawa
en entrées JSON compatibles avec le système de capture.

Usage :
  1. Colle tes POIs dans le fichier "import_pois.txt" (un par ligne)
  2. Lance : python gw2_import_pois.py
  3. Les nodes sont ajoutés à gw2_nodes.json (sans écraser l'existant)
"""

import json
import os
import re
from datetime import datetime

# ---------------------------------------------------------------------------
# Mapping label → (slug, groupe)
# Ajoute ici tout nouveau type rencontré
# ---------------------------------------------------------------------------
LABEL_MAP = {
    # ── Minerais standards ─────────────────────────────────────────────────
    "copper":              ("copper",           "Minerai"),
    "iron":                ("iron",             "Minerai"),
    "silver":              ("silver",           "Minerai"),
    "gold":                ("gold",             "Minerai"),
    "platinum":            ("platinum",         "Minerai"),
    "darksteel":           ("darksteel",        "Minerai"),
    "mithril":             ("mithril",          "Minerai"),
    "orichalcum":          ("orichalcum",       "Minerai"),
    # Minerais d'extension
    "quartz":              ("quartz",           "Minerai"),
    "quartz crystal":      ("quartz",           "Minerai"),
    "ambrite":             ("ambrite",          "Minerai"),
    "fulgurite":           ("fulgurite",        "Minerai"),
    "difluorite":          ("difluorite",       "Minerai"),
    "difluorite crystal":  ("difluorite",       "Minerai"),
    "jade":                ("jade",             "Minerai"),
    "prismaticite":        ("prismaticite",     "Minerai"),
    "prismaticite crystal":("prismaticite",     "Minerai"),
    "somnorite":           ("somnorite",        "Minerai"),
    "vesperite":           ("vesperite",        "Minerai"),
    # Rich veins
    "rich iron":           ("rich_iron",        "Minerai"),
    "rich silver":         ("rich_silver",      "Minerai"),
    "rich gold":           ("rich_gold",        "Minerai"),
    "rich mithril":        ("rich_mithril",     "Minerai"),
    "rich orichalcum":     ("rich_orichalcum",  "Minerai"),
    # ── Bois ───────────────────────────────────────────────────────────────
    "green wood":          ("green_wood",       "Bois"),
    "soft wood":           ("soft_wood",        "Bois"),
    "seasoned wood":       ("seasoned_wood",    "Bois"),
    "hard wood":           ("hard_wood",        "Bois"),
    "elder wood":          ("elder_wood",       "Bois"),
    "ancient wood":        ("ancient_wood",     "Bois"),
    "fir":                 ("fir",              "Bois"),
    "tukawa":              ("tukawa",           "Bois"),
    "cypress":             ("cypress",          "Bois"),
    "orrian sapling":      ("orrian_sapling",   "Bois"),
    "snow cherry":         ("snow_cherry",      "Bois"),
    "snow cherry sapling": ("snow_cherry",      "Bois"),
    "palm":                ("palm",             "Bois"),
    "petrified":           ("petrified",        "Bois"),
    "petrified echovald":  ("petrified",        "Bois"),
    "red oak":             ("red_oak",          "Bois"),
    # ── Végétaux tier 1 ────────────────────────────────────────────────────
    "blueberry":           ("blueberry",        "Vegetal"),
    "blueberry bush":      ("blueberry",        "Vegetal"),
    "button mushroom":     ("mushroom_button",  "Vegetal"),
    "button mushrooms":    ("mushroom_button",  "Vegetal"),
    "carrot":              ("carrot",           "Vegetal"),
    "carrots":             ("carrot",           "Vegetal"),
    "herb seedlings":      ("herb_seedlings",   "Vegetal"),
    "onion":               ("onion",            "Vegetal"),
    "onions":              ("onion",            "Vegetal"),
    "potato":              ("potato",           "Vegetal"),
    "lettuce":             ("lettuce",          "Vegetal"),
    # Végétaux tier 2
    "strawberry":          ("strawberry",       "Vegetal"),
    "strawberry patch":    ("strawberry",       "Vegetal"),
    "herb sprouts":        ("herb_sprouts",     "Vegetal"),
    "spinach":             ("spinach",          "Vegetal"),
    "grapes":              ("grapes",           "Vegetal"),
    "cabbage":             ("cabbage",          "Vegetal"),
    # Végétaux tier 3
    "young herbs":         ("young_herbs",      "Vegetal"),
    "herb":                ("young_herbs",      "Vegetal"),
    "herbs":               ("young_herbs",      "Vegetal"),
    "zucchini":            ("zucchini",         "Vegetal"),
    "root vegetables":     ("root_vegetables",  "Vegetal"),
    "root vegetable":      ("root_vegetables",  "Vegetal"),
    "kale":                ("kale",             "Vegetal"),
    "varied mushrooms":    ("mushroom_varied",  "Vegetal"),
    # Végétaux tier 4
    "mature herbs":        ("mature_herbs",     "Vegetal"),
    "scallions":           ("scallions",        "Vegetal"),
    "portobello":          ("portobello",       "Vegetal"),
    "portobello mushrooms":("portobello",       "Vegetal"),
    "blackberries":        ("blackberries",     "Vegetal"),
    "blackberry":          ("blackberries",     "Vegetal"),
    "sugar pumpkin":       ("sugar_pumpkin",    "Vegetal"),
    "cauliflower":         ("cauliflower",      "Vegetal"),
    "taproot":             ("taproot",          "Vegetal"),
    "variegated taproot":  ("taproot",          "Vegetal"),
    # Végétaux tier 5
    "verdant herbs":       ("verdant_herbs",    "Vegetal"),
    "leeks":               ("leeks",            "Vegetal"),
    "winter root":         ("winter_root",      "Vegetal"),
    "winter root vegetables":("winter_root",    "Vegetal"),
    "raspberries":         ("raspberries",      "Vegetal"),
    "raspberry":           ("raspberries",      "Vegetal"),
    "asparagus":           ("asparagus",        "Vegetal"),
    "cayenne":             ("cayenne_pepper",   "Vegetal"),
    "cayenne peppers":     ("cayenne_pepper",   "Vegetal"),
    "butternut":           ("butternut",        "Vegetal"),
    "butternut squash":    ("butternut",        "Vegetal"),
    "artichoke":           ("artichoke",        "Vegetal"),
    "artichokes":          ("artichoke",        "Vegetal"),
    # Végétaux tier 6 + extension
    "lotus":               ("lotus",            "Vegetal"),
    "omnomberry":          ("omnomberry",       "Vegetal"),
    "omnomberry bush":     ("omnomberry",       "Vegetal"),
    "orrian truffle":      ("orrian_truffle",   "Vegetal"),
    "snow truffle":        ("snow_truffle",     "Vegetal"),
    "ghost pepper":        ("ghost_pepper",     "Vegetal"),
    "mussel":              ("mussel",           "Vegetal"),
    "seaweed":             ("seaweed",          "Vegetal"),
    "flax":                ("flax",             "Vegetal"),
    "sawgill":             ("sawgill",          "Vegetal"),
    "sawgill mushrooms":   ("sawgill",          "Vegetal"),
    "lentils":             ("lentils",          "Vegetal"),
    "passiflora":          ("passiflora",       "Vegetal"),
    "orrian oyster":       ("orrian_oyster",    "Vegetal"),
    "haresfoot":           ("haresfoot",        "Vegetal"),
    "haresfoot herb":      ("haresfoot",        "Vegetal"),
    "coral":               ("coral",            "Vegetal"),
    "shing jea orchid":    ("shing_jea_orchid", "Vegetal"),
    "primordial orchid":   ("primordial_orchid","Vegetal"),
    "hatched chili":       ("hatched_chili",    "Vegetal"),
    "hatched chili pepper":("hatched_chili",    "Vegetal"),
    # ── Spécial ────────────────────────────────────────────────────────────
    "mawdrey":             ("mawdrey_target",   "Special"),
    "mawdrey target":      ("mawdrey_target",   "Special"),
    "quartz formation":    ("quartz_formation", "Special"),
    "quartz crystal formation": ("quartz_formation", "Special"),
    "vegetal unknown":     ("vegetal_unknown",  "Vegetal"),
}

LABEL_DISPLAY = {
    # Minerais standards
    "copper":            "Copper Ore",
    "iron":              "Iron Ore",
    "silver":            "Silver Ore",
    "gold":              "Gold Ore",
    "platinum":          "Platinum Ore",
    "darksteel":         "Darksteel Ore",
    "mithril":           "Mithril Ore",
    "orichalcum":        "Orichalcum Ore",
    # Minerais extension
    "quartz":            "Quartz Crystal",
    "ambrite":           "Ambrite",
    "fulgurite":         "Fulgurite",
    "difluorite":        "Difluorite Crystal",
    "jade":              "Jade",
    "prismaticite":      "Prismaticite Crystal",
    "somnorite":         "Somnorite Ore",
    "vesperite":         "Vesperite Ore",
    # Rich veins
    "rich_iron":         "Rich Iron Vein",
    "rich_silver":       "Rich Silver Vein",
    "rich_gold":         "Rich Gold Vein",
    "rich_mithril":      "Rich Mithril Vein",
    "rich_orichalcum":   "Rich Orichalcum Vein",
    # Bois
    "green_wood":        "Green Wood Sapling",
    "soft_wood":         "Soft Wood Sapling",
    "seasoned_wood":     "Seasoned Wood Log",
    "hard_wood":         "Hard Wood Log",
    "elder_wood":        "Elder Wood Log",
    "ancient_wood":      "Ancient Wood Log",
    "fir":               "Fir Sapling",
    "tukawa":            "Tukawa Sapling",
    "cypress":           "Cypress Sapling",
    "orrian_sapling":    "Orrian Sapling",
    "snow_cherry":       "Snow Cherry Sapling",
    "palm":              "Palm Sapling",
    "petrified":         "Petrified Echovald Sapling",
    "red_oak":           "Red Oak Sapling",
    # Végétaux tier 1
    "blueberry":         "Blueberry Bush",
    "mushroom_button":   "Button Mushrooms",
    "carrot":            "Carrots",
    "herb_seedlings":    "Herb Seedlings",
    "onion":             "Onions",
    "potato":            "Potato",
    "lettuce":           "Lettuce",
    # Végétaux tier 2
    "strawberry":        "Strawberry Patch",
    "herb_sprouts":      "Herb Sprouts",
    "spinach":           "Spinach",
    "grapes":            "Grapes",
    "cabbage":           "Cabbage",
    # Végétaux tier 3
    "young_herbs":       "Young Herbs",
    "zucchini":          "Zucchini",
    "root_vegetables":   "Root Vegetables",
    "kale":              "Kale",
    "mushroom_varied":   "Varied Mushrooms",
    # Végétaux tier 4
    "mature_herbs":      "Mature Herbs",
    "scallions":         "Scallions",
    "portobello":        "Portobello Mushrooms",
    "blackberries":      "Blackberries",
    "sugar_pumpkin":     "Sugar Pumpkin",
    "cauliflower":       "Cauliflower",
    "taproot":           "Variegated Taproot",
    # Végétaux tier 5
    "verdant_herbs":     "Verdant Herbs",
    "leeks":             "Leeks",
    "winter_root":       "Winter Root Vegetables",
    "raspberries":       "Raspberries",
    "asparagus":         "Asparagus",
    "cayenne_pepper":    "Cayenne Peppers",
    "butternut":         "Butternut Squash",
    "artichoke":         "Artichokes",
    # Végétaux tier 6 + extension
    "lotus":             "Lotus",
    "omnomberry":        "Omnomberry Bush",
    "orrian_truffle":    "Orrian Truffle",
    "snow_truffle":      "Snow Truffle",
    "ghost_pepper":      "Ghost Pepper",
    "mussel":            "Mussel",
    "seaweed":           "Seaweed",
    "flax":              "Flax",
    "sawgill":           "Sawgill Mushrooms",
    "lentils":           "Lentils",
    "passiflora":        "Passiflora",
    "orrian_oyster":     "Orrian Oyster",
    "haresfoot":         "Haresfoot Herb",
    "coral":             "Coral",
    "shing_jea_orchid":  "Shing Jea Orchid",
    "primordial_orchid": "Primordial Orchid",
    "hatched_chili":     "Hatched Chili Pepper Bush",
    "vegetal_unknown":   "Végétal (type variable)",
    # Spécial
    "mawdrey_target":    "Mawdrey Target",
    "quartz_formation":  "Quartz Crystal Formation",
}

NODES_FILE  = "gw2_nodes.json"
INPUT_FILE  = "import_pois.txt"

POI_RE = re.compile(
    r'MapID="(\d+)"\s+xpos="([^"]+)"\s+ypos="([^"]+)"\s+zpos="([^"]+)"[^/]*/>\s*(.*)',
    re.IGNORECASE
)

def load_nodes():
    if os.path.exists(NODES_FILE):
        with open(NODES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_nodes(nodes):
    with open(NODES_FILE, "w", encoding="utf-8") as f:
        json.dump(nodes, f, indent=2, ensure_ascii=False)

def parse_label(raw):
    raw = raw.strip().lower()
    if raw in LABEL_MAP:
        return LABEL_MAP[raw]
    # Recherche partielle
    for key, val in LABEL_MAP.items():
        if key in raw or raw in key:
            return val
    return None

def make_key(node):
    """Clé unique d'un node pour déduplication (mapid + coords arrondies à 1 décimale)."""
    return f"{node['map_id']}_{round(node['x'],1)}_{round(node['y'],1)}_{round(node['z'],1)}"

def main():
    if not os.path.exists(INPUT_FILE):
        with open(INPUT_FILE, "w", encoding="utf-8") as f:
            f.write('# Colle tes lignes POI ici, une par ligne\n')
            f.write('# Exemple :\n')
            f.write('# <POI MapID="20" xpos="80.5" ypos="53.8" zpos="-413.7" GUID="xxx"/> tukawa\n')
        print(f"Fichier '{INPUT_FILE}' créé — colle tes POIs dedans et relance le script.")
        return

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    nodes    = load_nodes()
    existing = {make_key(n) for n in nodes}  # pour déduplication
    imported = 0
    skipped  = 0
    dupes    = 0
    unknown  = []

    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue

        m = POI_RE.search(line)
        if not m:
            print(f"  ⚠️  Ligne non reconnue : {line[:80]}")
            skipped += 1
            continue

        map_id = int(m.group(1))
        x      = float(m.group(2))
        y      = float(m.group(3))
        z      = float(m.group(4))
        label  = m.group(5).strip()

        parsed = parse_label(label)
        if parsed is None:
            print(f"  ❓ Type inconnu : '{label}' — ignoré (ajoute-le dans LABEL_MAP)")
            unknown.append(label)
            skipped += 1
            continue

        slug, group = parsed
        node = {
            "type":        slug,
            "group":       group,
            "label":       LABEL_DISPLAY.get(slug, label),
            "map_id":      map_id,
            "x":           round(x, 4),
            "y":           round(y, 4),
            "z":           round(z, 4),
            "captured_at": datetime.now().isoformat(),
        }
        key = make_key(node)
        if key in existing:
            dupes += 1
            continue
        existing.add(key)
        nodes.append(node)
        imported += 1
        print(f"  ✅ [{LABEL_DISPLAY.get(slug, slug)}] Map {map_id} | x={x:.2f} z={z:.2f}")

    save_nodes(nodes)

    print(f"\n{'='*45}")
    print(f"  Importé  : {imported} nodes")
    print(f"  Doublons : {dupes} (ignorés)")
    print(f"  Ignoré   : {skipped}")
    print(f"  Total JSON : {len(nodes)} nodes")
    if unknown:
        print(f"\n  Types inconnus à ajouter dans LABEL_MAP :")
        for u in set(unknown):
            print(f"    '{u}'")
    print(f"\n  → Lance maintenant : python gw2_taco_generator.py")

if __name__ == "__main__":
    main()