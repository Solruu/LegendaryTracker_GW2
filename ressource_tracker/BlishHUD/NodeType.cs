using System.Linq;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Un type de node capturable (slug, groupe, libellé affiché, variable ou non).
    /// Port fidèle de NODE_TYPES_LIST dans gw2_node_ID_v9.py -- généré
    /// mécaniquement depuis le fichier source vérifié, pas retapé à la main.
    /// </summary>
    public readonly struct NodeType
    {
        public readonly string Slug;
        public readonly string Group;   // "Minerai" | "Bois" | "Vegetal" | "Special"
        public readonly string Label;
        public readonly bool Rand;      // sortie variable (affichée avec un tag [variable])

        public NodeType(string slug, string group, string label, bool rand)
        {
            Slug = slug;
            Group = group;
            Label = label;
            Rand = rand;
        }

        // ---------------------------------------------------------------
        // Généré depuis gw2_node_ID_v9.py (NODE_TYPES_LIST) -- 109 entrées
        // ---------------------------------------------------------------
        public static readonly NodeType[] All = {
            new NodeType("copper", "Minerai", "Copper Ore", false),
            new NodeType("darksteel", "Minerai", "Darksteel Ore", false),
            new NodeType("difluorite", "Minerai", "Difluorite Crystal", false),
            new NodeType("fulgurite", "Minerai", "Fulgurite", false),
            new NodeType("gold", "Minerai", "Gold Ore", false),
            new NodeType("iron", "Minerai", "Iron Ore", false),
            new NodeType("jade", "Minerai", "Jade", false),
            new NodeType("mithril", "Minerai", "Mithril Ore", false),
            new NodeType("orichalcum", "Minerai", "Orichalcum Ore", false),
            new NodeType("platinum", "Minerai", "Platinum Ore", false),
            new NodeType("prismaticite", "Minerai", "Prismaticite Crystal", false),
            new NodeType("quartz", "Minerai", "Quartz Crystal", false),
            new NodeType("rich_copper", "Minerai", "Rich Copper Vein", false),
            new NodeType("rich_gold", "Minerai", "Rich Gold Vein", false),
            new NodeType("rich_iron", "Minerai", "Rich Iron Vein", false),
            new NodeType("rich_mithril", "Minerai", "Rich Mithril Vein", false),
            new NodeType("rich_orichalcum", "Minerai", "Rich Orichalcum Vein", false),
            new NodeType("rich_platinum", "Minerai", "Rich Platinum Vein", false),
            new NodeType("rich_silver", "Minerai", "Rich Silver Vein", false),
            new NodeType("silver", "Minerai", "Silver Ore", false),
            new NodeType("somnorite", "Minerai", "Somnorite Ore", false),
            new NodeType("vesperite", "Minerai", "Vesperite Ore", false),
            new NodeType("ancient_sapling", "Bois", "Ancient Sapling", false),
            new NodeType("ancient_spiderknot_tree", "Bois", "Ancient Spiderknot Tree", false),
            new NodeType("ancient_wood", "Bois", "Ancient Wood Log", false),
            new NodeType("aspen", "Bois", "Aspen Sapling", false),
            new NodeType("banyan", "Bois", "Banyan Sapling", false),
            new NodeType("baoba", "Bois", "Baoba Sapling", false),
            new NodeType("cypress", "Bois", "Cypress Sapling", false),
            new NodeType("ekku", "Bois", "Ekku Sapling", false),
            new NodeType("elder_wood", "Bois", "Elder Wood Log", false),
            new NodeType("fir", "Bois", "Fir Sapling", false),
            new NodeType("green_wood", "Bois", "Green Wood Sapling", false),
            new NodeType("gummo", "Bois", "Gummo Sapling", false),
            new NodeType("hard_wood", "Bois", "Hard Wood Log", false),
            new NodeType("inglewood", "Bois", "Inglewood Sapling", false),
            new NodeType("kertch", "Bois", "Kertch Sapling", false),
            new NodeType("mebahya", "Bois", "Mebahya Sapling", false),
            new NodeType("mimosa", "Bois", "Mimosa Sapling", false),
            new NodeType("orrian_sapling", "Bois", "Orrian Sapling", false),
            new NodeType("palm", "Bois", "Palm Sapling", false),
            new NodeType("petrified", "Bois", "Petrified Echovald Sapling", false),
            new NodeType("pine", "Bois", "Pine Sapling", false),
            new NodeType("red_oak", "Bois", "Red Oak Sapling", false),
            new NodeType("seasoned_wood", "Bois", "Seasoned Wood Log", false),
            new NodeType("snow_cherry", "Bois", "Snow Cherry Sapling", false),
            new NodeType("soft_wood", "Bois", "Soft Wood Sapling", false),
            new NodeType("spiderknot_tree", "Bois", "Spiderknot Tree", false),
            new NodeType("tukawa", "Bois", "Tukawa Sapling", false),
            new NodeType("artichoke", "Vegetal", "Artichokes", true),
            new NodeType("asparagus", "Vegetal", "Asparagus", true),
            new NodeType("black_crocus", "Vegetal", "Black Crocus", false),
            new NodeType("blackberries", "Vegetal", "Blackberries", true),
            new NodeType("blueberry", "Vegetal", "Blueberry Bush", true),
            new NodeType("butternut", "Vegetal", "Butternut Squash", true),
            new NodeType("mushroom_button", "Vegetal", "Button Mushrooms", true),
            new NodeType("cabbage", "Vegetal", "Cabbage", true),
            new NodeType("carrot", "Vegetal", "Carrots", true),
            new NodeType("cauliflower", "Vegetal", "Cauliflower", true),
            new NodeType("cayenne_pepper", "Vegetal", "Cayenne Pepper", false),
            new NodeType("clam", "Vegetal", "Clam", false),
            new NodeType("coral", "Vegetal", "Coral", false),
            new NodeType("desert_vegetables", "Vegetal", "Desert Vegetables", true),
            new NodeType("flax", "Vegetal", "Flax", false),
            new NodeType("ghost_pepper", "Vegetal", "Ghost Pepper", false),
            new NodeType("grapes", "Vegetal", "Grapes", true),
            new NodeType("haresfoot", "Vegetal", "Haresfoot Herb", false),
            new NodeType("hatched_chili", "Vegetal", "Hatched Chili Pepper Bush", false),
            new NodeType("herb_patch", "Vegetal", "Herb Patch", true),
            new NodeType("herb_seedlings", "Vegetal", "Herb Seedlings", true),
            new NodeType("herb_sprouts", "Vegetal", "Herb Sprouts", true),
            new NodeType("kale", "Vegetal", "Kale", true),
            new NodeType("leeks", "Vegetal", "Leeks", true),
            new NodeType("lentils", "Vegetal", "Lentils", true),
            new NodeType("lettuce", "Vegetal", "Lettuce", true),
            new NodeType("lotus", "Vegetal", "Lotus", false),
            new NodeType("mature_herbs", "Vegetal", "Mature Herbs", true),
            new NodeType("mixed_harvesting", "Vegetal", "Mixed Harvesting Node", true),
            new NodeType("mussel", "Vegetal", "Mussel", false),
            new NodeType("omnomberry", "Vegetal", "Omnomberry Bush", false),
            new NodeType("onion", "Vegetal", "Onions", true),
            new NodeType("orrian_oyster", "Vegetal", "Orrian Oyster", false),
            new NodeType("orrian_truffle", "Vegetal", "Orrian Truffle", false),
            new NodeType("passiflora", "Vegetal", "Passiflora", false),
            new NodeType("portobello", "Vegetal", "Portobello Mushrooms", true),
            new NodeType("potato", "Vegetal", "Potato", true),
            new NodeType("primordial_orchid", "Vegetal", "Primordial Orchid", false),
            new NodeType("raspberries", "Vegetal", "Raspberries", true),
            new NodeType("root_vegetables", "Vegetal", "Root Vegetables", true),
            new NodeType("sawgill", "Vegetal", "Sawgill Mushrooms", false),
            new NodeType("scallions", "Vegetal", "Scallions", true),
            new NodeType("seaweed", "Vegetal", "Seaweed", false),
            new NodeType("shing_jea_orchid", "Vegetal", "Shing Jea Orchid", false),
            new NodeType("snow_truffle", "Vegetal", "Snow Truffle", false),
            new NodeType("spinach", "Vegetal", "Spinach", true),
            new NodeType("strawberry", "Vegetal", "Strawberry Patch", true),
            new NodeType("sugar_pumpkin", "Vegetal", "Sugar Pumpkin", true),
            new NodeType("sunflower", "Vegetal", "Sunflower", false),
            new NodeType("toxic_seedling", "Vegetal", "Toxic Seedling", false),
            new NodeType("truffle", "Vegetal", "Truffle", false),
            new NodeType("mushroom_varied", "Vegetal", "Varied Mushrooms", true),
            new NodeType("taproot", "Vegetal", "Variegated Taproot", true),
            new NodeType("varietal_mint", "Vegetal", "Varietal Mint Seed", true),
            new NodeType("verdant_herbs", "Vegetal", "Verdant Herbs", true),
            new NodeType("vegetal_unknown", "Vegetal", "Végétal (type variable)", true),
            new NodeType("winter_root", "Vegetal", "Winter Root Vegetables", true),
            new NodeType("young_herbs", "Vegetal", "Young Herbs", true),
            new NodeType("zucchini", "Vegetal", "Zucchini", true),
            new NodeType("quartz_formation", "Special", "Quartz Crystal Formation", false),
        };

        public static NodeType? BySlug(string slug) =>
            All.Where(t => t.Slug == slug).Select(t => (NodeType?)t).FirstOrDefault();
    }
}
