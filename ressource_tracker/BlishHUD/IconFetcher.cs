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
        private const string FallbackIconUrl = "https://wiki.guildwars2.com/images/9/9b/Piece_of_Common_Unidentified_Gear.png";
        private const int BatchSize = 50;

        public static readonly Dictionary<string, int> SlugToItemId = new Dictionary<string, int>
        {
            ["copper"] = 19697,
            ["iron"] = 19699,
            ["silver"] = 19703,
            ["gold"] = 19698,
            ["platinum"] = 19702,
            ["darksteel"] = 19702,
            ["mithril"] = 19700,
            ["orichalcum"] = 19701,
            ["quartz"] = 43773,
            ["difluorite"] = 86977,
            ["jade"] = 97102,
            ["prismaticite"] = 94163,
            ["somnorite"] = 19701,
            ["vesperite"] = 19700,
            ["rich_iron"] = 19699,
            ["rich_silver"] = 19703,
            ["rich_gold"] = 19698,
            ["rich_mithril"] = 19700,
            ["rich_orichalcum"] = 19701,
            ["rich_copper"] = 19697,
            ["rich_platinum"] = 19702,
            ["green_wood"] = 19723,
            ["soft_wood"] = 19726,
            ["seasoned_wood"] = 19727,
            ["hard_wood"] = 19724,
            ["elder_wood"] = 19722,
            ["ancient_wood"] = 19725,
            ["sawgill"] = 73504,
            ["aspen"] = 19723,
            ["ekku"] = 19723,
            ["kertch"] = 19723,
            ["gummo"] = 19726,
            ["mimosa"] = 19726,
            ["fir"] = 19727,
            ["tukawa"] = 19727,
            ["pine"] = 19724,
            ["banyan"] = 19724,
            ["inglewood"] = 19724,
            ["cypress"] = 19722,
            ["palm"] = 19722,
            ["red_oak"] = 19722,
            ["baoba"] = 19722,
            ["mebahya"] = 19722,
            ["spiderknot_tree"] = 19722,
            ["ancient_sapling"] = 19725,
            ["ancient_spiderknot_tree"] = 19725,
            ["orrian_sapling"] = 19725,
            ["petrified"] = 96471,
            ["blueberry"] = 12255,
            ["mushroom_button"] = 12147,
            ["carrot"] = 12134,
            ["onion"] = 12142,
            ["potato"] = 12135,
            ["lettuce"] = 12238,
            ["strawberry"] = 12253,
            ["spinach"] = 12241,
            ["grapes"] = 12341,
            ["cabbage"] = 12332,
            ["zucchini"] = 12330,
            ["kale"] = 12333,
            ["portobello"] = 12334,
            ["blackberries"] = 12537,
            ["sugar_pumpkin"] = 12538,
            ["cauliflower"] = 12532,
            ["leeks"] = 12508,
            ["raspberries"] = 12254,
            ["asparagus"] = 12505,
            ["cayenne_pepper"] = 12504,
            ["butternut"] = 12511,
            ["artichoke"] = 12512,
            ["lotus"] = 12510,
            ["omnomberry"] = 12128,
            ["orrian_truffle"] = 12545,
            ["snow_truffle"] = 12144,
            ["ghost_pepper"] = 12544,
            ["mussel"] = 74266,
            ["seaweed"] = 12509,
            ["scallions"] = 12533,
            ["clam"] = 12327,
            ["orrian_oyster"] = 81837,
            ["passiflora"] = 36731,
            ["black_crocus"] = 12547,
            ["quartz_formation"] = 43773,
            ["snow_cherry"] = 19726,
        };

        public static readonly string[] FallbackSlugs = {
            "varietal_mint",
            "coral",
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
            "primordial_orchid",
            "root_vegetables",
            "shing_jea_orchid",
            "sunflower",
            "taproot",
            "toxic_seedling",
            "truffle",
            "vegetal_unknown",
            "verdant_herbs",
            "winter_root",
            "young_herbs",
        };

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
                // FallbackIconUrl (les 24 slugs FALLBACK_SLUGS).
                http.DefaultRequestHeaders.UserAgent.ParseAdd("GW2_NodeTracker/1.0 (Blish HUD module)");

                // 1 -- Slugs avec un vrai item_id connu -> résolution batch via l'API GW2
                var withRealId = toFetch.Where(s => SlugToItemId.ContainsKey(s)).ToList();
                var itemIds = withRealId.Select(s => SlugToItemId[s]).Distinct().ToList();
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
                    if (SlugToItemId.TryGetValue(slug, out int itemId) && iconUrlByItemId.TryGetValue(itemId, out string realUrl))
                        url = realUrl;
                    else if (FallbackSlugs.Contains(slug))
                        url = FallbackIconUrl;

                    if (url == null) return false; // ni item_id connu ni slug de repli -- rien à faire

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
