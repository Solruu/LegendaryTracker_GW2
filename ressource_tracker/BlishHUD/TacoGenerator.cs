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
            "Festival",
        };

        public static readonly Dictionary<string, string[]> TypeOrder = new Dictionary<string, string[]>
        {
            ["Minerai"] = new[] { "copper", "rich_copper", "iron", "rich_iron", "silver", "rich_silver", "gold", "rich_gold", "platinum", "rich_platinum", "darksteel", "mithril", "rich_mithril", "orichalcum", "rich_orichalcum", "quartz", "fulgurite", "difluorite", "jade", "prismaticite", "somnorite", "rich_somnorite", "vesperite", "rich_vesperite" },
            ["Bois"] = new[] { "green_wood", "soft_wood", "seasoned_wood", "hard_wood", "elder_wood", "ancient_wood", "aspen", "ekku", "kertch", "gummo", "mimosa", "snow_cherry", "fir", "tukawa", "pine", "banyan", "inglewood", "cypress", "palm", "red_oak", "baoba", "mebahya", "spiderknot_tree", "ancient_sapling", "ancient_spiderknot_tree", "orrian_sapling", "petrified" },
            ["Vegetal"] = new[] { "blueberry", "mushroom_button", "carrot", "herb_seedlings", "onion", "potato", "lettuce", "strawberry", "herb_sprouts", "spinach", "taproots", "grapes", "cabbage", "young_herbs", "zucchini", "root_vegetables", "kale", "mushroom_varied", "mature_herbs", "scallions", "portobello", "blackberries", "sugar_pumpkin", "cauliflower", "variegated_taproot", "verdant_herbs", "leeks", "winter_root", "raspberries", "asparagus", "cayenne_pepper", "butternut", "artichoke", "cluster_herbs", "cluster_desert_herbs", "blooming_passiflora", "lotus", "omnomberry", "orrian_truffle", "snow_truffle", "ghost_pepper", "mussel", "seaweed", "cactus", "jungle_plants", "flax", "sawgill", "lentils", "passiflora", "orrian_oyster", "haresfoot", "coral", "shing_jea_orchid", "primordial_orchid", "hatched_chili", "black_crocus", "clam", "herb_patch", "mixed_harvesting", "sunflower", "toxic_seedling", "truffle", "varietal_mint", "vegetal_unknown", "desert_vegetables" },
            ["Special"] = new[] { "quartz_formation", "rich_quartz_formation", "sprocket_generator", "aurillium", "bloodstone_crystals", "petrified_stump", "winterberry", "brandstone", "mistonium", "dragon_crystal", "mistborn_mote", "eternal_ice" },
            // Catégorie TacO distincte : désactivable indépendamment hors événement
            ["Festival"] = new[] { "candy_corn", "rich_candy_corn", "bauble" },
        };

        /// <summary>
        /// Couleur du ruban par groupe, au format TacO AARRGGBB.
        ///
        /// La couleur porte l'identité du groupe, pas l'état du tronçon : les
        /// lignes droites non vérifiées restent rouges quel que soit le
        /// groupe, parce que c'est un avertissement, pas une catégorie. Une
        /// route rouge veut dire « ça traverse peut-être le décor », et ça
        /// doit se lire pareil sur du minerai et sur du bois.
        /// </summary>
        public static readonly Dictionary<string, string> GroupTrailColors = new Dictionary<string, string>
        {
            ["Minerai"] = "ffb0b7bd",   // gris acier
            ["Bois"] = "ffc98b3a",      // brun
            ["Vegetal"] = "ff5cc45c",   // vert
            ["Special"] = "ffb05ce0",   // violet
            ["Festival"] = "ffe05ca8",  // magenta
        };

        /// <summary>
        /// Couleur des routes multi-groupes : aucun groupe ne domine, donc une
        /// teinte à part plutôt qu'un choix arbitraire parmi les siens.
        /// </summary>
        public const string MixedTrailColor = "ff4d9de0";  // bleu

        /// <summary>Rouge d'avertissement des tronçons non vérifiés, commun à tous les groupes.</summary>
        public const string UnverifiedTrailColor = "ffcc3333";

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

        /// <summary>
        /// Un fichier .trl prêt à être zippé, avec la catégorie TacO dans
        /// laquelle il doit s'afficher.
        /// </summary>
        public class TrailFile
        {
            public string FileName { get; set; }   // ex. "trails/r25_minerai_bois_0.trl"
            public string Slug { get; set; }       // "minerai", "minerai_bois", ...
            public string Label { get; set; }      // "Minerai", "Minerai + Bois", ...
            public string Color { get; set; }      // couleur du ruban vérifié
            public int Rank { get; set; }          // ordre d'affichage dans le menu
            public int GroupCount { get; set; }    // nombre de groupes couverts
            public string Kind { get; set; }       // "verifie" ou "direct"
            public byte[] Data { get; set; }
        }

        /// <summary>Couleur d'une route : celle du groupe si elle est seule, la teinte mixte sinon.</summary>
        public static string ColorFor(Route route)
        {
            if (route.Groups.Count == 1
                && GroupTrailColors.TryGetValue(route.Groups[0], out string c))
                return c;
            return MixedTrailColor;
        }

        public const string PackLuaPath = "pack.lua";
        public const string RoutesLuaPath = "scripts/routes.lua";

        /// <summary>
        /// Point d'entrée des scripts du pack. Pathing charge `pack.lua` à la
        /// racine et c'est lui qui déclare les scripts à exécuter.
        /// </summary>
        public static string BuildPackLua() =>
            "-- Genere par GW2 Node Tracker. Ne pas editer a la main.\n" +
            "Debug:Print(\"GW2 Node Tracker : chargement du menu de composition...\")\n" +
            // Le chemin porte l'extension .lua : c'est la forme qu'utilisent
            // les packs qui fonctionnent, et sans elle le require echoue en
            // silence.
            "Pack:Require(\"scripts/routes.lua\")\n";

        /// <summary>
        /// Trois cases à cocher dans le menu de Pathing (une par groupe) qui
        /// composent la route affichée.
        ///
        /// Le format de pack ne sait pas rendre deux catégories mutuellement
        /// exclusives : c'est le script qui le fait, en appelant Show() sur la
        /// composition correspondant aux cases cochées et Hide() sur les
        /// autres. Toutes les compositions existent déjà dans le pack, donc
        /// basculer de l'une à l'autre n'est qu'un changement d'affichage --
        /// aucun recalcul, aucune vérification perdue.
        ///
        /// Si le script échoue à charger, rien n'est cassé : les catégories
        /// restent cochables une par une dans le menu normal.
        /// </summary>
        public static string BuildRoutesLua(List<Route> routes)
        {
            var groups = routes.SelectMany(r => r.Groups)
                               .Distinct()
                               .OrderBy(g => { int i = Array.IndexOf(GroupOrder, g); return i >= 0 ? i : 99; })
                               .ToList();

            var slugs = routes.Select(r => r.Slug()).Distinct().ToList();

            var sb = new StringBuilder();
            sb.AppendLine("-- Genere par GW2 Node Tracker. Ne pas editer a la main.");
            sb.AppendLine("Debug:Print(\"GW2 Node Tracker : menu de composition actif.\")");
            sb.AppendLine("local GROUPS = {");
            foreach (string g in groups)
                sb.AppendLine($"  {{ name = \"{g}\", slug = \"{g.ToLowerInvariant()}\" }},");
            sb.AppendLine("}");
            sb.AppendLine();
            sb.AppendLine("local COMPOSITIONS = {");
            foreach (string slug in slugs)
                sb.AppendLine($"  \"{slug}\",");
            sb.AppendLine("}");
            sb.AppendLine(@"
local state = {}
for _, g in ipairs(GROUPS) do state[g.slug] = false end

-- Le slug d'une composition est la concatenation des groupes coches, dans
-- l'ordre canonique : il doit correspondre exactement a celui calcule cote
-- module (Route.Slug).
local function wantedSlug()
  local parts = {}
  for _, g in ipairs(GROUPS) do
    if state[g.slug] then parts[#parts + 1] = g.slug end
  end
  return table.concat(parts, ""_"")
end

local function apply()
  local wanted = wantedSlug()
  for _, slug in ipairs(COMPOSITIONS) do
    local ok, cat = pcall(function()
      return Category:GetOrAddCategoryFromNamespace(""gw2farm.routes."" .. slug)
    end)
    if ok and cat then
      if slug == wanted then pcall(function() cat:Show() end)
      else pcall(function() cat:Hide() end) end
    else
      Debug:Print(""routes: categorie introuvable "" .. slug)
    end
  end
end

local root = Menu:Add(""Composition de route"", nil, false, false,
                      ""Coche les types de ressources : la route correspondante s'affiche."")

for _, g in ipairs(GROUPS) do
  local slug = g.slug
  -- On bascule NOTRE etat plutot que de lire une propriete de l'objet menu :
  -- son nom n'est pas garanti, et une erreur dans le delegue fait echouer
  -- tout le clic (Failed to invoke menu delegate).
  -- Le delegue DOIT prendre le parametre menu, meme inutilise : Pathing le
  -- convertit en Action<Menu> et une fonction sans parametre echoue a
  -- l'invocation (Failed to invoke menu delegate), avant meme d'executer la
  -- moindre ligne de notre code.
  root:Add(g.name, function(menu)
    state[slug] = not state[slug]
    local ok, err = pcall(apply)
    if not ok then Debug:Print(""routes: "" .. tostring(err)) end
  end, true, false,
  ""Inclure "" .. g.name .. "" dans la route affichee"")
end

pcall(apply)");
            return sb.ToString();
        }

        /// <summary>Ordre d'affichage : les routes simples d'abord, puis les combinaisons par taille.</summary>
        private static int RankFor(Route route)
        {
            int first = route.Groups.Count == 0 ? 99 : Array.IndexOf(GroupOrder, route.Groups[0]);
            if (first < 0) first = 90;
            return route.Groups.Count * 100 + first;
        }

        /// <summary>
        /// Découpe chaque route en suites de tronçons de même nature
        /// (vérifié / ligne droite) et produit un .trl par suite.
        ///
        /// Le regroupement par suite, plutôt qu'un fichier par tronçon, évite
        /// de multiplier les fichiers tout en gardant les deux natures dans
        /// des catégories distinctes : Antoine voit d'un coup d'œil, en jeu,
        /// ce qui est un chemin réellement parcouru et ce qui est encore une
        /// ligne droite à travers le décor.
        /// </summary>
        public static List<TrailFile> BuildTrails(List<Route> routes)
        {
            var trails = new List<TrailFile>();
            if (routes == null) return trails;

            foreach (var route in routes)
            {
                if (route.Legs == null || route.Legs.Count == 0) continue;

                string slug = route.Slug();
                string label = route.Label();
                string color = ColorFor(route);
                int rank = RankFor(route);
                int fileIdx = 0;
                int i = 0;

                while (i < route.Legs.Count)
                {
                    bool kind = route.Legs[i].Verified;
                    var points = new List<RoutePoint>();

                    while (i < route.Legs.Count && route.Legs[i].Verified == kind)
                    {
                        var legPoints = route.Legs[i].Points;
                        for (int k = 0; k < legPoints.Count; k++)
                        {
                            // On ne réécrit pas le point de jonction déjà posé
                            // par le tronçon précédent.
                            if (points.Count > 0 && k == 0) continue;
                            points.Add(legPoints[k]);
                        }
                        i++;
                    }

                    if (points.Count < 2) continue;

                    trails.Add(new TrailFile
                    {
                        FileName = $"trails/r{route.MapId}_{slug}_{fileIdx++}.trl",
                        Slug = slug,
                        Label = label,
                        Color = color,
                        Rank = rank,
                        GroupCount = route.Groups.Count,
                        Kind = kind ? "verifie" : "direct",
                        Data = TrlWriter.Build(route.MapId, points),
                    });
                }
            }

            return trails;
        }

        private static void WriteText(ZipArchive zip, string path, string content)
        {
            var entry = zip.CreateEntry(path);
            using (var stream = entry.Open())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(content);
                stream.Write(bytes, 0, bytes.Length);
            }
        }

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
        public static string GenerateXml(List<GatheredNode> nodes, HashSet<string> availableIcons,
                                         List<TrailFile> trails = null)
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

            if (trails != null && trails.Count > 0)
            {
                sb.AppendLine("    <MarkerCategory name=\"routes\" DisplayName=\"Routes\">");

                // Une catégorie par COMPOSITION (minerai, minerai_bois, ...).
                // Elles coexistent : basculer de l'une à l'autre dans le menu
                // ne recalcule rien et ne perd aucune vérification.
                var compositions = trails
                    .GroupBy(t => t.Slug)
                    .Select(g => g.First())
                    .OrderBy(t => t.Rank)
                    .ToList();

                // UNE SEULE composition est visible par défaut : la plus
                // complète. Les sept se superposent sur le terrain -- elles
                // partagent la plupart de leurs nodes -- et chaque boucle a sa
                // propre orientation, donc tout affichier donnait des rubans
                // doublés, fléchés en sens contraires, illisibles. Les autres
                // restent à un clic dans le menu.
                int fullest = compositions.Max(c => c.GroupCount);

                foreach (var comp in compositions)
                {
                    string shown = comp.GroupCount == fullest ? "1" : "0";
                    sb.AppendLine($"      <MarkerCategory name=\"{comp.Slug}\" DisplayName=\"{comp.Label}\" defaulttoggle=\"{shown}\">");

                    // texture= est OBLIGATOIRE pour Pathing : sans elle, la
                    // catégorie se coche dans le menu mais aucun ruban n'est
                    // dessiné. animSpeed fait défiler les chevrons, ce qui
                    // donne son sens de parcours à la route.
                    // defaulttoggle=1 : « Chemin parcouru » n'existe qu'au
                    // premier tronçon corrigé ; si elle naissait décochée, le
                    // tronçon disparaîtrait au moment même où il est corrigé.
                    // Les trois visibilites sont explicites : un trail n'est
                    // dessine sur la carte et la minicarte que si on le
                    // demande. Sans elles, la route n'existe qu'en 3D et le
                    // menu laisse croire qu'elle est affichee partout.
                    const string vis = "ingameVisibility=\"1\" mapVisibility=\"1\" minimapVisibility=\"1\"";

                    sb.AppendLine("        <MarkerCategory name=\"verifie\" DisplayName=\"Chemin parcouru\" " +
                                  $"texture=\"{TrailTexture.PackPath}\" " +
                                  $"color=\"{comp.Color}\" animSpeed=\"1\" trailScale=\"1\" defaulttoggle=\"1\" " +
                                  $"{vis} fadeNear=\"3000\" fadeFar=\"8000\"/>");
                    sb.AppendLine("        <MarkerCategory name=\"direct\" DisplayName=\"Ligne droite (non vérifiée)\" " +
                                  $"texture=\"{TrailTexture.PackPath}\" " +
                                  $"color=\"{UnverifiedTrailColor}\" animSpeed=\"1\" trailScale=\"1\" defaulttoggle=\"1\" " +
                                  $"{vis} fadeNear=\"3000\" fadeFar=\"8000\"/>");
                    sb.AppendLine("      </MarkerCategory>");
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

            if (trails != null && trails.Count > 0)
            {
                sb.AppendLine("    <!-- Routes de farm -->");
                foreach (var t in trails)
                {
                    string cat = $"gw2farm.routes.{t.Slug}.{t.Kind}";
                    sb.AppendLine($"    <Trail trailData=\"{t.FileName}\" type=\"{cat}\"/>");
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
            List<GatheredNode> nodes, string outputPath, string iconsDir, List<Route> routes = null)
        {
            var trails = BuildTrails(routes);

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

            string xml = GenerateXml(nodes, new HashSet<string>(icons.Keys), trails);

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

                foreach (var t in trails)
                {
                    var entry = zip.CreateEntry(t.FileName);
                    using (var stream = entry.Open())
                        stream.Write(t.Data, 0, t.Data.Length);
                }

                if (trails.Count > 0)
                {
                    byte[] trailPng = TrailTexture.BuildPng();
                    var texEntry = zip.CreateEntry(TrailTexture.PackPath);
                    using (var stream = texEntry.Open())
                        stream.Write(trailPng, 0, trailPng.Length);

                    WriteText(zip, PackLuaPath, BuildPackLua());
                    WriteText(zip, RoutesLuaPath, BuildRoutesLua(routes));
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
