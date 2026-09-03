"""
GW2 Taco Generator (v3)
========================
Lit gw2_nodes.json et génère un pack .taco (zip contenant markers.xml + icônes PNG).
Hiérarchie Pathing : Catégorie > Groupe > Type de ressource

Les icônes sont les vraies icônes GW2 (dossier icons/, produit par
gw2_fetch_icons_v4.py) — la génération de pastilles colorées a été abandonnée.
Lance gw2_fetch_icons_v4.py AVANT ce script si icons/ est absent ou incomplet.

Usage :
    python gw2_taco_gen_v3.py
    python gw2_taco_gen_v3.py --input mes_nodes.json --output mon_pack.taco --icons icons/

Dépendances : aucune (stdlib uniquement)
"""

import json
import os
import sys
import zipfile
import argparse
from collections import defaultdict

# ---------------------------------------------------------------------------
# Icônes réelles GW2 — chargées depuis le dossier icons/ (produit par
# gw2_fetch_icons_v4.py). Plus de génération de pastilles colorées.
# ---------------------------------------------------------------------------
def load_icon_bytes(slug, icons_dir):
    """Retourne les bytes du PNG icons/<slug>.png, ou None si absent."""
    path = os.path.join(icons_dir, f"{slug}.png")
    if os.path.exists(path):
        with open(path, "rb") as f:
            return f.read()
    return None


# ---------------------------------------------------------------------------
# Génère le XML markers.xml
# ---------------------------------------------------------------------------
MAP_NAMES = {
    15: "Queensdale",
    17: "Harathi Hinterlands",
    18: "Divinity's Reach",
    19: "Plains of Ashford",
    20: "Blazeridge Steppes",
    21: "Fields of Ruin",
    22: "Fireheart Rise",
    23: "Kessex Hills",
    24: "Gendarran Fields",
    25: "Iron Marches",
    26: "Dredgehaunt Cliffs",
    27: "Lornar's Pass",
    28: "Wayfarer Foothills",
    29: "Timberline Falls",
    30: "Frostgorge Sound",
    31: "Snowden Drifts",
    32: "Diessa Plateau",
    34: "Caledon Forest",
    # à compléter au fil des sessions -- vérifié contre
    # wiki.guildwars2.com/wiki/Property:Has_map_id (source officielle, liée à API:2/maps)
    # Les anciennes valeurs (15=Brisban Wildlands, 22=Bloodtide Coast, 29=Iron Marches)
    # étaient fausses -- jamais vérifiées, corrigées le 03/09/2026.
}

GROUP_ORDER = ["Minerai", "Bois", "Vegetal", "Special"]

# Ordre explicite des slugs par groupe pour le tri dans le XML
# Les rich veins sont placées juste après leur minerai de base
TYPE_ORDER = {
    "Minerai": [
        "copper", "rich_copper", "iron", "rich_iron",
        "silver", "rich_silver",
        "gold", "rich_gold",
        "platinum", "rich_platinum", "darksteel",
        "mithril", "rich_mithril",
        "orichalcum", "rich_orichalcum",
        "quartz", "ambrite", "fulgurite", "difluorite",
        "jade", "prismaticite", "somnorite", "vesperite",
        "sunstone",
    ],
    "Bois": [
        "green_wood", "soft_wood", "seasoned_wood", "hard_wood",
        "elder_wood", "ancient_wood",
        "fir", "tukawa", "cypress", "orrian_sapling",
        "snow_cherry", "palm", "petrified", "red_oak",
    ],
    "Vegetal": [
        # Tier 1
        "blueberry", "mushroom_button", "carrot", "herb_seedlings",
        "onion", "potato", "lettuce",
        # Tier 2
        "strawberry", "herb_sprouts", "spinach", "grapes", "cabbage",
        # Tier 3
        "young_herbs", "zucchini", "root_vegetables", "kale", "mushroom_varied",
        # Tier 4
        "mature_herbs", "scallions", "portobello", "blackberries",
        "sugar_pumpkin", "cauliflower", "taproot",
        # Tier 5
        "verdant_herbs", "leeks", "winter_root", "raspberries",
        "asparagus", "cayenne_pepper", "butternut", "artichoke",
        # Tier 6
        "lotus", "omnomberry", "orrian_truffle", "snow_truffle",
        "ghost_pepper", "mussel", "seaweed",
        # Extensions
        "flax", "sawgill", "lentils", "passiflora", "orrian_oyster",
        "haresfoot", "coral", "shing_jea_orchid", "primordial_orchid",
        "hatched_chili", "black_crocus", "clam", "herb_patch",
        "mixed_harvesting", "sunflower", "toxic_seedling",
        "truffle", "varietal_mint", "vegetal_unknown",
    ],
    "Special": [
        "mawdrey_target", "quartz_formation",
    ],
}

def type_sort_key(slug, group):
    """Retourne l'index de tri d'un slug dans son groupe, ou 999 si absent."""
    order = TYPE_ORDER.get(group, [])
    try:
        return order.index(slug)
    except ValueError:
        return 999

def group_nodes(nodes):
    """Retourne {group: {type_slug: [node, ...]}}"""
    result = defaultdict(lambda: defaultdict(list))
    for n in nodes:
        result[n["group"]][n["type"]].append(n)
    return result


def generate_xml(nodes, available_icons):
    """available_icons : set des slugs pour lesquels une vraie icône PNG existe."""
    grouped = group_nodes(nodes)
    lines = ['<OverlayData>',
             '  <MarkerCategory name="gw2farm" DisplayName="GW2 Node Farm">']

    # Catégories — dans l'ordre GROUP_ORDER puis TYPE_ORDER
    for group in GROUP_ORDER:
        if group not in grouped:
            continue
        grp_safe = group.lower()
        lines.append(f'    <MarkerCategory name="{grp_safe}" DisplayName="{group}">')
        sorted_slugs = sorted(
            grouped[group].keys(),
            key=lambda s: type_sort_key(s, group)
        )
        for slug in sorted_slugs:
            slug_nodes = grouped[group][slug]
            label = slug_nodes[0]["label"]
            # iconFile omis si aucune icône réelle disponible (BlishHUD
            # utilisera son marqueur par défaut plutôt qu'un chemin mort)
            icon_attr = f'iconFile="icons/{slug}.png" ' if slug in available_icons else ''
            lines.append(
                f'      <MarkerCategory name="{slug}" DisplayName="{label}" '
                f'{icon_attr}fadeNear="3000" fadeFar="5000" '
                f'minSize="20" maxSize="30"/>'
            )
        lines.append('    </MarkerCategory>')

    lines.append('  </MarkerCategory>')
    lines.append('  <POIs>')

    # POIs triés : map → groupe (GROUP_ORDER) → type (TYPE_ORDER)
    by_map = defaultdict(list)
    for n in nodes:
        by_map[n["map_id"]].append(n)

    for map_id in sorted(by_map.keys()):
        map_nodes = by_map[map_id]
        map_name = MAP_NAMES.get(map_id, f"Map {map_id}")
        lines.append(f'    <!-- {map_name} (MapID {map_id}) -->')
        sorted_nodes = sorted(
            map_nodes,
            key=lambda n: (
                GROUP_ORDER.index(n["group"]) if n["group"] in GROUP_ORDER else 99,
                type_sort_key(n["type"], n["group"])
            )
        )
        for n in sorted_nodes:
            grp_safe = n["group"].lower()
            cat = f'gw2farm.{grp_safe}.{n["type"]}'
            lines.append(
                f'    <POI MapID="{map_id}" xpos="{n["x"]}" ypos="{n["y"]}" '
                f'zpos="{n["z"]}" type="{cat}"/>'
            )

    lines.append('  </POIs>')
    lines.append('</OverlayData>')
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Génère le .taco (zip)
# ---------------------------------------------------------------------------
def generate_taco(input_file, output_file, icons_dir):
    print(f"[1/4] Chargement de {input_file}...")
    with open(input_file, "r", encoding="utf-8") as f:
        nodes = json.load(f)

    if not nodes:
        print("  ⚠️  Aucun node dans le fichier JSON. Rien à générer.")
        sys.exit(0)

    print(f"       {len(nodes)} nodes chargés.")

    print(f"[2/4] Chargement des icônes depuis '{icons_dir}/'...")
    grouped = group_nodes(nodes)
    used_slugs = {slug for group_data in grouped.values() for slug in group_data}
    icons = {}       # slug -> png bytes (icônes trouvées)
    missing = []      # slugs sans icône réelle
    for slug in used_slugs:
        data = load_icon_bytes(slug, icons_dir)
        if data is not None:
            icons[slug] = data
        else:
            missing.append(slug)

    print(f"       {len(icons)}/{len(used_slugs)} icônes trouvées.")
    if missing:
        print(f"  ⚠️  Icônes manquantes ({len(missing)}) — marqueur par défaut BlishHUD utilisé :")
        for slug in sorted(missing):
            print(f"       - {slug}")
        print(f"       → Lance gw2_fetch_icons_v4.py, ou ajoute ces slugs à SLUG_TO_ITEM_ID.")

    print("[3/4] Génération du XML...")
    xml_content = generate_xml(nodes, available_icons=set(icons.keys()))

    print(f"[4/4] Création de {output_file}...")
    with zipfile.ZipFile(output_file, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("markers.xml", xml_content.encode("utf-8"))
        for slug, png_data in icons.items():
            zf.writestr(f"icons/{slug}.png", png_data)

    # Stats
    map_ids = set(n["map_id"] for n in nodes)
    icons_kb = sum(len(d) for d in icons.values()) / 1024
    print(f"\n✅ Pack généré : {output_file}")
    print(f"   Nodes       : {len(nodes)}")
    print(f"   Types       : {len(used_slugs)}")
    print(f"   Icônes      : {len(icons)} fichiers, ~{icons_kb:.1f} KB")
    print(f"   Maps        : {len(map_ids)} ({', '.join(MAP_NAMES.get(m, str(m)) for m in sorted(map_ids))})")
    print(f"\n   → Copie dans : Documents\\Guild Wars 2\\addons\\blishhud\\markers\\")
    print(f"   → Reload Pathing dans Blish HUD")
    print(f"   → Active 'GW2 Node Farm' dans la liste des catégories")


# ---------------------------------------------------------------------------
# Entrée
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Génère un pack .taco depuis gw2_nodes.json")
    parser.add_argument("--input",  default="gw2_nodes.json", help="Fichier JSON source")
    parser.add_argument("--output", default="gw2_farm.taco",   help="Fichier .taco de sortie")
    parser.add_argument("--icons",  default="icons",           help="Dossier des icônes PNG (défaut: icons/)")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"[ERREUR] Fichier introuvable : {args.input}")
        print("         Lance d'abord gw2_node_ID_v4.py pour créer des nodes.")
        sys.exit(1)

    if not os.path.isdir(args.icons):
        print(f"  ⚠️  Dossier icônes '{args.icons}/' introuvable — lance gw2_fetch_icons_v4.py d'abord.")

    generate_taco(args.input, args.output, args.icons)