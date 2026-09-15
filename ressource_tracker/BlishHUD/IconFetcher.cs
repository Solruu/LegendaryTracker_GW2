using Blish_HUD;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Télécharge les icônes manquantes dans icons/ -- port fidèle de
    /// gw2_fetch_icons_v8.py. Constantes générées mécaniquement depuis le
    /// script source, pas retapées à la main.
    /// </summary>
    public static class IconFetcher
    {
        private static readonly Logger Logger = Logger.GetLogger<Module>();

        private const string ApiItemsUrl = "https://api.guildwars2.com/v2/items";
        // Icônes de node génériques, par outil de récolte. Le choix se fait
        // par slug via IconSource.Generic(NodeTool), pas d'après le groupe :
        // les groupes Special et Festival mélangent les trois outils.
        private const string SickleIconUrl = "https://wiki.guildwars2.com/images/2/2d/Plant_resource_%28map_icon%29.png";
        private const string AxeIconUrl    = "https://wiki.guildwars2.com/images/f/f1/Wood_resource_%28map_icon%29.png";
        private const string PickIconUrl   = "https://wiki.guildwars2.com/images/3/34/Mine_resource_%28map_icon%29.png";
        private const int BatchSize = 50;

        public enum NodeTool { Pick, Axe, Sickle }

        /// <summary>
        /// D'où vient l'icône d'un slug : l'objet récolté (nodes mono-produit),
        /// une icône de node générique par outil (nodes multi-produit), ou une
        /// URL fixée à la main pour les cas particuliers.
        /// </summary>
        public readonly struct IconSource
        {
            public enum SourceKind { Item, Generic, Url }

            public readonly SourceKind Kind;
            public readonly int ItemId;
            public readonly NodeTool Tool;
            public readonly string DirectUrl;

            private IconSource(SourceKind kind, int itemId, NodeTool tool, string url)
            {
                Kind = kind; ItemId = itemId; Tool = tool; DirectUrl = url;
            }

            public static IconSource Item(int itemId) =>
                new IconSource(SourceKind.Item, itemId, default, null);

            public static IconSource Generic(NodeTool tool) =>
                new IconSource(SourceKind.Generic, 0, tool, null);

            public static IconSource Url(string url) =>
                new IconSource(SourceKind.Url, 0, default, url);
        }

        /// <summary>
        /// Une entrée par slug de NodeType.All. Table unique : pas de
        /// dictionnaire de repli parallèle à tenir en cohérence.
        /// Vérifiable par ValidateCoverage().
        /// </summary>
        public static readonly Dictionary<string, IconSource> Sources = new Dictionary<string, IconSource>
        {
            // -- Minerai -------------------------------------------------
            ["copper"] = IconSource.Item(19697),
            ["darksteel"] = IconSource.Item(19702),
            ["difluorite"] = IconSource.Item(86977),
            ["fulgurite"] = IconSource.Generic(NodeTool.Pick),
            ["gold"] = IconSource.Item(19698),
            ["iron"] = IconSource.Item(19699),
            ["jade"] = IconSource.Item(97102),
            ["mithril"] = IconSource.Item(19700),
            ["orichalcum"] = IconSource.Item(19701),
            ["platinum"] = IconSource.Item(19702),
            ["prismaticite"] = IconSource.Item(94163),
            ["quartz"] = IconSource.Item(43773),
            ["rich_copper"] = IconSource.Item(19697),
            ["rich_gold"] = IconSource.Item(19698),
            ["rich_iron"] = IconSource.Item(19699),
            ["rich_mithril"] = IconSource.Item(19700),
            ["rich_orichalcum"] = IconSource.Item(19701),
            ["rich_platinum"] = IconSource.Item(19702),
            ["rich_silver"] = IconSource.Item(19703),
            ["silver"] = IconSource.Item(19703),
            ["rich_somnorite"] = IconSource.Item(19701),
            ["somnorite"] = IconSource.Item(19701),
            ["rich_vesperite"] = IconSource.Item(19700),
            ["vesperite"] = IconSource.Item(19700),

            // -- Bois ----------------------------------------------------
            ["ancient_sapling"] = IconSource.Item(19725),
            ["ancient_spiderknot_tree"] = IconSource.Item(19725),
            ["ancient_wood"] = IconSource.Item(19725),
            ["aspen"] = IconSource.Item(19723),
            ["banyan"] = IconSource.Item(19724),
            ["baoba"] = IconSource.Item(19722),
            ["cypress"] = IconSource.Item(19722),
            ["ekku"] = IconSource.Item(19723),
            ["elder_wood"] = IconSource.Item(19722),
            ["fir"] = IconSource.Item(19727),
            ["green_wood"] = IconSource.Item(19723),
            ["gummo"] = IconSource.Item(19726),
            ["hard_wood"] = IconSource.Item(19724),
            ["inglewood"] = IconSource.Item(19724),
            ["kertch"] = IconSource.Item(19723),
            ["mebahya"] = IconSource.Item(19722),
            ["mimosa"] = IconSource.Item(19726),
            ["orrian_sapling"] = IconSource.Item(19725),
            ["palm"] = IconSource.Item(19722),
            ["petrified"] = IconSource.Item(96471),
            ["pine"] = IconSource.Item(19724),
            ["red_oak"] = IconSource.Item(19722),
            ["seasoned_wood"] = IconSource.Item(19727),
            ["snow_cherry"] = IconSource.Item(19726),
            ["soft_wood"] = IconSource.Item(19726),
            ["spiderknot_tree"] = IconSource.Item(19722),
            ["tukawa"] = IconSource.Item(19727),

            // -- Vegetal -------------------------------------------------
            ["artichoke"] = IconSource.Item(12512),
            ["asparagus"] = IconSource.Item(12505),
            ["black_crocus"] = IconSource.Item(12547),
            ["blackberries"] = IconSource.Item(12537),
            ["blueberry"] = IconSource.Item(12255),
            ["butternut"] = IconSource.Item(12511),
            ["mushroom_button"] = IconSource.Item(12147),
            ["cabbage"] = IconSource.Item(12332),
            ["carrot"] = IconSource.Item(12134),
            ["cauliflower"] = IconSource.Item(12532),
            ["cayenne_pepper"] = IconSource.Item(12504),
            ["blooming_passiflora"] = IconSource.Item(36731),
            ["cactus"] = IconSource.Generic(NodeTool.Sickle),
            ["clam"] = IconSource.Item(12327),
            ["cluster_desert_herbs"] = IconSource.Generic(NodeTool.Sickle),
            ["cluster_herbs"] = IconSource.Generic(NodeTool.Sickle),
            ["coral"] = IconSource.Generic(NodeTool.Sickle),
            ["desert_vegetables"] = IconSource.Generic(NodeTool.Sickle),
            ["flax"] = IconSource.Generic(NodeTool.Sickle),
            ["ghost_pepper"] = IconSource.Item(12544),
            ["grapes"] = IconSource.Item(12341),
            ["haresfoot"] = IconSource.Generic(NodeTool.Sickle),
            ["hatched_chili"] = IconSource.Generic(NodeTool.Sickle),
            ["herb_patch"] = IconSource.Generic(NodeTool.Sickle),
            ["herb_seedlings"] = IconSource.Generic(NodeTool.Sickle),
            ["herb_sprouts"] = IconSource.Generic(NodeTool.Sickle),
            ["jungle_plants"] = IconSource.Generic(NodeTool.Sickle),
            ["kale"] = IconSource.Item(12333),
            ["leeks"] = IconSource.Item(12508),
            ["lentils"] = IconSource.Generic(NodeTool.Sickle),
            ["lettuce"] = IconSource.Item(12238),
            ["lotus"] = IconSource.Item(12510),
            ["mature_herbs"] = IconSource.Generic(NodeTool.Sickle),
            ["mixed_harvesting"] = IconSource.Generic(NodeTool.Sickle),
            ["mussel"] = IconSource.Item(74266),
            ["omnomberry"] = IconSource.Item(12128),
            ["onion"] = IconSource.Item(12142),
            ["orrian_oyster"] = IconSource.Item(81837),
            ["orrian_truffle"] = IconSource.Item(12545),
            ["passiflora"] = IconSource.Item(36731),
            ["portobello"] = IconSource.Item(12334),
            ["potato"] = IconSource.Item(12135),
            ["primordial_orchid"] = IconSource.Generic(NodeTool.Axe),
            ["raspberries"] = IconSource.Item(12254),
            ["root_vegetables"] = IconSource.Generic(NodeTool.Sickle),
            ["sawgill"] = IconSource.Item(73504),
            ["scallions"] = IconSource.Item(12533),
            ["seaweed"] = IconSource.Item(12509),
            ["shing_jea_orchid"] = IconSource.Generic(NodeTool.Sickle),
            ["snow_truffle"] = IconSource.Item(12144),
            ["spinach"] = IconSource.Item(12241),
            ["strawberry"] = IconSource.Item(12253),
            ["sugar_pumpkin"] = IconSource.Item(12538),
            ["sunflower"] = IconSource.Generic(NodeTool.Sickle),
            ["toxic_seedling"] = IconSource.Generic(NodeTool.Sickle),
            ["truffle"] = IconSource.Generic(NodeTool.Sickle),
            ["mushroom_varied"] = IconSource.Generic(NodeTool.Sickle),
            ["variegated_taproot"] = IconSource.Generic(NodeTool.Sickle),
            ["taproots"] = IconSource.Generic(NodeTool.Sickle),
            ["varietal_mint"] = IconSource.Generic(NodeTool.Sickle),
            ["verdant_herbs"] = IconSource.Generic(NodeTool.Sickle),
            ["vegetal_unknown"] = IconSource.Generic(NodeTool.Sickle),
            ["winter_root"] = IconSource.Generic(NodeTool.Sickle),
            ["young_herbs"] = IconSource.Generic(NodeTool.Sickle),
            ["zucchini"] = IconSource.Item(12330),

            // -- Special -------------------------------------------------
            ["aurillium"] = IconSource.Generic(NodeTool.Pick),
            ["bloodstone_crystals"] = IconSource.Item(46731),
            ["brandstone"] = IconSource.Item(86069),
            ["dragon_crystal"] = IconSource.Item(89537),
            ["eternal_ice"] = IconSource.Item(92272),
            ["mistborn_mote"] = IconSource.Item(90783),
            ["mistonium"] = IconSource.Item(88955),
            ["petrified_stump"] = IconSource.Item(79469),
            ["quartz_formation"] = IconSource.Item(43773),
            ["rich_quartz_formation"] = IconSource.Item(43773),
            ["sprocket_generator"] = IconSource.Item(44941),
            ["winterberry"] = IconSource.Item(79899),

            // -- Festival ------------------------------------------------
            ["bauble"] = IconSource.Generic(NodeTool.Pick),
            ["candy_corn"] = IconSource.Item(36041),
            ["rich_candy_corn"] = IconSource.Item(36041),
        };

        /// <summary>
        /// Slugs de NodeType.All sans entrée dans Sources. Doit être vide.
        /// </summary>
        public static List<string> ValidateCoverage() =>
            NodeType.All.Select(t => t.Slug).Where(s => !Sources.ContainsKey(s)).ToList();

        private static string GenericUrl(NodeTool tool)
        {
            switch (tool)
            {
                case NodeTool.Pick: return PickIconUrl;
                case NodeTool.Axe: return AxeIconUrl;
                default: return SickleIconUrl;
            }
        }

        private class ApiItem
        {
            [JsonProperty("id")]
            public int Id { get; set; }

            [JsonProperty("icon")]
            public string Icon { get; set; }
        }

        /// <summary>
        /// Télécharge dans iconsDir les icônes des slugs demandés qui n'y
        /// sont pas déjà. Retourne le nombre effectivement téléchargé.
        /// Appel réseau -- à lancer depuis une tâche de fond, jamais
        /// depuis le thread principal.
        /// </summary>
        public static async Task<int> FetchMissingAsync(IEnumerable<string> slugs, string iconsDir, bool force = false)
        {
            Directory.CreateDirectory(iconsDir);

            var toFetch = (force ? slugs : slugs.Where(s => !File.Exists(Path.Combine(iconsDir, $"{s}.png"))))
                .Distinct()
                .ToList();
            if (toFetch.Count == 0) return 0;

            using (var http = new HttpClient())
            {
                http.Timeout = TimeSpan.FromSeconds(15);
                // wiki.guildwars2.com renvoie 403 sans User-Agent -- traité
                // comme du scraping sans lui. Nécessaire au moins pour
                // Nécessaire pour les icônes Plant/Mine resource (wiki).
                http.DefaultRequestHeaders.UserAgent.ParseAdd("GW2_NodeTracker/1.0 (Blish HUD module)");

                // 1 -- Slugs avec un vrai item_id connu -> résolution batch via l'API GW2
                var itemIds = toFetch
                    .Where(s => Sources.TryGetValue(s, out var src) && src.Kind == IconSource.SourceKind.Item)
                    .Select(s => Sources[s].ItemId)
                    .Distinct()
                    .ToList();

                var iconUrlByItemId = new Dictionary<int, string>();

                for (int i = 0; i < itemIds.Count; i += BatchSize)
                {
                    var batch = itemIds.Skip(i).Take(BatchSize);
                    string idsParam = string.Join(",", batch);
                    try
                    {
                        string json = await http.GetStringAsync($"{ApiItemsUrl}?ids={idsParam}");
                        var items = JsonConvert.DeserializeObject<List<ApiItem>>(json);
                        foreach (var item in items)
                            if (!string.IsNullOrEmpty(item.Icon))
                                iconUrlByItemId[item.Id] = item.Icon;
                    }
                    catch (Exception ex)
                    {
                        Logger.Warn(ex, "Échec résolution batch API items");
                    }
                }

                // Téléchargements en parallèle (max 6 à la fois) plutôt qu'un
                // par un -- c'était la vraie source de lenteur perçue.
                var throttle = new System.Threading.SemaphoreSlim(6);
                var downloadTasks = toFetch.Select(async slug =>
                {
                    string url = null;
                    if (Sources.TryGetValue(slug, out IconSource source))
                    {
                        switch (source.Kind)
                        {
                            case IconSource.SourceKind.Item:
                                iconUrlByItemId.TryGetValue(source.ItemId, out url);
                                break;
                            case IconSource.SourceKind.Generic:
                                url = GenericUrl(source.Tool);
                                break;
                            case IconSource.SourceKind.Url:
                                url = source.DirectUrl;
                                break;
                        }
                    }

                    if (url == null) return false; // slug inconnu, ou item non résolu par l'API

                    Logger.Debug("Téléchargement icône {0} <- {1}", slug, url);

                    await throttle.WaitAsync();
                    try
                    {
                        byte[] bytes = await http.GetByteArrayAsync(url);
                        string destPath = Path.Combine(iconsDir, $"{slug}.png");
                        File.WriteAllBytes(destPath, bytes);
                        Logger.Debug("Icône {0} écrite ({1} octets) -> {2}", slug, bytes.Length, destPath);
                        return true;
                    }
                    catch (Exception ex)
                    {
                        Logger.Warn(ex, "Échec téléchargement icône pour {0}", slug);
                        return false;
                    }
                    finally
                    {
                        throttle.Release();
                    }
                });

                bool[] results = await Task.WhenAll(downloadTasks);
                int downloaded = results.Count(r => r);

                return downloaded;
            }
        }
    }
}