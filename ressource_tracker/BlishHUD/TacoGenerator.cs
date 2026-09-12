using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Génère le pack .taco (markers.xml + icônes, zippés) directement en C#,
    /// sans dépendre d'un interpréteur Python externe. Port fidèle de
    /// gw2_taco_gen_v6.py -- constantes générées mécaniquement depuis le
    /// script source, pas retapées à la main.
    /// </summary>
    public static class TacoGenerator
    {
        public static readonly string[] GroupOrder = {
            "Minerai",
            "Bois",
            "Vegetal",
            "Special",
        };

        public static readonly Dictionary<string, string[]> TypeOrder = new Dictionary<string, string[]>
        {
            ["Minerai"] = new[] { "copper", "rich_copper", "iron", "rich_iron", "silver", "rich_silver", "gold", "rich_gold", "platinum", "rich_platinum", "darksteel", "mithril", "rich_mithril", "orichalcum", "rich_orichalcum", "quartz", "fulgurite", "difluorite", "jade", "prismaticite", "somnorite", "vesperite" },
            ["Bois"] = new[] { "green_wood", "soft_wood", "seasoned_wood", "hard_wood", "elder_wood", "ancient_wood", "aspen", "ekku", "kertch", "gummo", "mimosa", "snow_cherry", "fir", "tukawa", "pine", "banyan", "inglewood", "cypress", "palm", "red_oak", "baoba", "mebahya", "spiderknot_tree", "ancient_sapling", "ancient_spiderknot_tree", "orrian_sapling", "petrified" },
            ["Vegetal"] = new[] { "blueberry", "mushroom_button", "carrot", "herb_seedlings", "onion", "potato", "lettuce", "strawberry", "herb_sprouts", "spinach", "grapes", "cabbage", "young_herbs", "zucchini", "root_vegetables", "kale", "mushroom_varied", "mature_herbs", "scallions", "portobello", "blackberries", "sugar_pumpkin", "cauliflower", "taproot", "verdant_herbs", "leeks", "winter_root", "raspberries", "asparagus", "cayenne_pepper", "butternut", "artichoke", "lotus", "omnomberry", "orrian_truffle", "snow_truffle", "ghost_pepper", "mussel", "seaweed", "flax", "sawgill", "lentils", "passiflora", "orrian_oyster", "haresfoot", "coral", "shing_jea_orchid", "primordial_orchid", "hatched_chili", "black_crocus", "clam", "herb_patch", "mixed_harvesting", "sunflower", "toxic_seedling", "truffle", "varietal_mint", "vegetal_unknown", "desert_vegetables" },
            ["Special"] = new[] { "quartz_formation" },
        };

        public static readonly Dictionary<int, string> MapNames = new Dictionary<int, string>
        {
            [15] = "Queensdale",
            [17] = "Harathi Hinterlands",
            [18] = "Divinity's Reach",
            [19] = "Plains of Ashford",
            [20] = "Blazeridge Steppes",
            [21] = "Fields of Ruin",
            [22] = "Fireheart Rise",
            [23] = "Kessex Hills",
            [24] = "Gendarran Fields",
            [25] = "Iron Marches",
            [26] = "Dredgehaunt Cliffs",
            [27] = "Lornar's Pass",
            [28] = "Wayfarer Foothills",
            [29] = "Timberline Falls",
            [30] = "Frostgorge Sound",
            [31] = "Snowden Drifts",
            [32] = "Diessa Plateau",
            [34] = "Caledon Forest",
        };

        private static int TypeSortKey(string slug, string group)
        {
            if (TypeOrder.TryGetValue(group, out string[] order))
            {
                int idx = Array.IndexOf(order, slug);
                return idx >= 0 ? idx : 999;
            }
            return 999;
        }

        /// <summary>group -> slug -> liste de nodes (port de group_nodes()).</summary>
        private static Dictionary<string, Dictionary<string, List<GatheredNode>>> GroupNodes(List<GatheredNode> nodes)
        {
            var result = new Dictionary<string, Dictionary<string, List<GatheredNode>>>();
            foreach (var n in nodes)
            {
                if (!result.TryGetValue(n.Group, out var byType))
                {
                    byType = new Dictionary<string, List<GatheredNode>>();
                    result[n.Group] = byType;
                }
                if (!byType.TryGetValue(n.Type, out var list))
                {
                    list = new List<GatheredNode>();
                    byType[n.Type] = list;
                }
                list.Add(n);
            }
            return result;
        }

        /// <summary>Port fidèle de generate_xml().</summary>
        public static string GenerateXml(List<GatheredNode> nodes, HashSet<string> availableIcons)
        {
            var grouped = GroupNodes(nodes);
            var sb = new StringBuilder();
            sb.AppendLine("<OverlayData>");
            sb.AppendLine("  <MarkerCategory name=\"gw2farm\" DisplayName=\"GW2 Node Farm\">");

            foreach (string group in GroupOrder)
            {
                if (!grouped.TryGetValue(group, out var typesInGroup)) continue;

                string grpSafe = group.ToLowerInvariant();
                sb.AppendLine($"    <MarkerCategory name=\"{grpSafe}\" DisplayName=\"{group}\">");

                var sortedSlugs = typesInGroup.Keys.OrderBy(s => TypeSortKey(s, group)).ToList();
                foreach (string slug in sortedSlugs)
                {
                    string label = typesInGroup[slug][0].Label;
                    string iconAttr = availableIcons.Contains(slug) ? $"iconFile=\"icons/{slug}.png\" " : "";
                    sb.AppendLine(
                        $"      <MarkerCategory name=\"{slug}\" DisplayName=\"{label}\" " +
                        $"{iconAttr}fadeNear=\"3000\" fadeFar=\"5000\" minSize=\"20\" maxSize=\"30\"/>");
                }
                sb.AppendLine("    </MarkerCategory>");
            }

            sb.AppendLine("  </MarkerCategory>");
            sb.AppendLine("  <POIs>");

            var byMap = nodes.GroupBy(n => n.MapId).OrderBy(g => g.Key);
            foreach (var mapGroup in byMap)
            {
                string mapName = MapNames.TryGetValue(mapGroup.Key, out string name) ? name : $"Map {mapGroup.Key}";
                sb.AppendLine($"    <!-- {mapName} (MapID {mapGroup.Key}) -->");

                var sortedNodes = mapGroup.OrderBy(n =>
                {
                    int groupIdx = Array.IndexOf(GroupOrder, n.Group);
                    return groupIdx >= 0 ? groupIdx : 99;
                }).ThenBy(n => TypeSortKey(n.Type, n.Group));

                foreach (var n in sortedNodes)
                {
                    string grpSafe = n.Group.ToLowerInvariant();
                    string cat = $"gw2farm.{grpSafe}.{n.Type}";
                    sb.AppendLine(
                        $"    <POI MapID=\"{n.MapId}\" xpos=\"{n.X.ToString(System.Globalization.CultureInfo.InvariantCulture)}\" " +
                        $"ypos=\"{n.Y.ToString(System.Globalization.CultureInfo.InvariantCulture)}\" " +
                        $"zpos=\"{n.Z.ToString(System.Globalization.CultureInfo.InvariantCulture)}\" type=\"{cat}\"/>");
                }
            }

            sb.AppendLine("  </POIs>");
            sb.AppendLine("</OverlayData>");
            return sb.ToString();
        }

        /// <summary>
        /// Port de generate_taco() -- écrit directement le .taco (zip).
        /// Retourne (icônes trouvées, slugs manquants) pour info/log côté appelant.
        /// </summary>
        public static (int foundIcons, List<string> missingSlugs) Generate(
            List<GatheredNode> nodes, string outputPath, string iconsDir)
        {
            var grouped = GroupNodes(nodes);
            var usedSlugs = grouped.Values.SelectMany(byType => byType.Keys).Distinct().ToList();

            var icons = new Dictionary<string, byte[]>();
            var missing = new List<string>();
            foreach (string slug in usedSlugs)
            {
                string iconPath = Path.Combine(iconsDir ?? "", $"{slug}.png");
                if (!string.IsNullOrEmpty(iconsDir) && File.Exists(iconPath))
                    icons[slug] = File.ReadAllBytes(iconPath);
                else
                    missing.Add(slug);
            }

            string xml = GenerateXml(nodes, new HashSet<string>(icons.Keys));

            // On écrit dans un fichier temporaire puis on remplace -- évite
            // de livrer un .taco à moitié écrit si Blish HUD le relit pile
            // au mauvais moment (le fichier est écrasé "en place" à chaque
            // capture).
            string tempPath = outputPath + ".tmp";
            if (File.Exists(tempPath)) File.Delete(tempPath); // reste d'un plantage précédent
            using (var fileStream = new FileStream(tempPath, FileMode.Create))
            using (var zip = new ZipArchive(fileStream, ZipArchiveMode.Create))
            {
                var xmlEntry = zip.CreateEntry("markers.xml");
                using (var writer = new StreamWriter(xmlEntry.Open(), Encoding.UTF8))
                    writer.Write(xml);

                foreach (var kv in icons)
                {
                    var entry = zip.CreateEntry($"icons/{kv.Key}.png");
                    using (var stream = entry.Open())
                        stream.Write(kv.Value, 0, kv.Value.Length);
                }
            }

            // Écrasement en place plutôt que supprimer+renommer : sur
            // Windows, delete+move déclenche des événements Supprimé puis
            // Renommé, pas Modifié -- un observateur de fichiers qui
            // n'écoute que "Modifié" (cas plausible pour Pathing) ne
            // serait jamais notifié du changement, même si le contenu sur
            // disque est correct.
            using (var destStream = new FileStream(outputPath, FileMode.Create))
            using (var srcStream = new FileStream(tempPath, FileMode.Open))
            {
                srcStream.CopyTo(destStream);
            }
            File.Delete(tempPath);

            return (icons.Count, missing);
        }
    }
}
