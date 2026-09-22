using Blish_HUD;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Construit et entretient les routes de farm.
    ///
    /// Trois opérations, volontairement séparées :
    ///  - Build      : ordre de passage complet (plus proche voisin + 2-opt) ;
    ///  - Insert     : ajout d'un node dans une route existante, sans tout
    ///                 recalculer (cheapest insertion) ;
    ///  - Refine     : remplacement des lignes droites par le trajet
    ///                 réellement parcouru, simplifié à epsilon près.
    ///
    /// Refine ne touche jamais à l'ordre, Insert ne touche jamais à la
    /// géométrie des tronçons voisins non concernés. C'est ce qui rend la
    /// route semi-dynamique sans la casser à chaque capture.
    /// </summary>
    public static class RouteBuilder
    {
        private static readonly Logger Logger = Logger.GetLogger(typeof(RouteBuilder));

        /// <summary>Garde-fou sur le 2-opt : au-delà, on garde le meilleur trouvé.</summary>
        private const int MaxTwoOptPasses = 60;

        // -------------------------------------------------------------
        // Construction
        // -------------------------------------------------------------

        /// <summary>
        /// Toutes les combinaisons non vides des groupes fournis, triées par
        /// l'ordre canonique puis par taille. Trois groupes donnent sept
        /// routes ; au-delà de MaxGroupsForFullCombinations, on se limite aux
        /// groupes seuls plus la route complète, sinon le nombre de routes
        /// double à chaque groupe ajouté.
        /// </summary>
        public const int MaxGroupsForFullCombinations = 3;

        public static List<List<string>> Combinations(IList<string> groups)
        {
            var result = new List<List<string>>();
            if (groups == null || groups.Count == 0) return result;

            if (groups.Count > MaxGroupsForFullCombinations)
            {
                foreach (string g in groups) result.Add(new List<string> { g });
                result.Add(new List<string>(groups));
                return result;
            }

            int total = 1 << groups.Count;
            for (int mask = 1; mask < total; mask++)
            {
                var combo = new List<string>();
                for (int i = 0; i < groups.Count; i++)
                    if ((mask & (1 << i)) != 0) combo.Add(groups[i]);
                result.Add(combo);
            }

            return result.OrderBy(c => c.Count).ToList();
        }

        /// <summary>
        /// Longueurs RÉELLES des tronçons déjà parcourus, indexées par couple
        /// d'arrêts.
        ///
        /// C'est ce qui corrige le défaut de fond de l'optimisation : jusqu'ici
        /// l'ordre de passage se calculait sur des distances à vol d'oiseau,
        /// donc optimal sur une carte sans relief. Deux nodes séparés de 20 m
        /// mais reliés par un détour sous l'eau de 300 m étaient traités comme
        /// voisins immédiats. Dès qu'un tronçon a été parcouru, on connaît son
        /// vrai coût et on s'en sert.
        /// </summary>
        public class EdgeCosts
        {
            private readonly Dictionary<string, double> _costs = new Dictionary<string, double>();

            public int Count => _costs.Count;

            private static string Key(RoutePoint a, RoutePoint b)
            {
                string ka = $"{a.X:0.0}|{a.Y:0.0}|{a.Z:0.0}";
                string kb = $"{b.X:0.0}|{b.Y:0.0}|{b.Z:0.0}";
                // Couple non orienté : un chemin vaut le même prix dans les
                // deux sens.
                return string.CompareOrdinal(ka, kb) <= 0 ? ka + "->" + kb : kb + "->" + ka;
            }

            public void Add(RoutePoint a, RoutePoint b, double length)
            {
                string k = Key(a, b);
                // À égalité de couple, on garde le trajet le plus court connu :
                // c'est le meilleur chemin qu'Antoine ait trouvé jusque-là.
                if (!_costs.TryGetValue(k, out double existing) || length < existing)
                    _costs[k] = length;
            }

            public double Between(RoutePoint a, RoutePoint b)
            {
                if (_costs.TryGetValue(Key(a, b), out double c)) return c;
                return a.DistanceTo(b); // jamais parcouru : on retombe sur la ligne droite
            }
        }

        /// <summary>Relève les coûts réels dans les tronçons vérifiés des routes existantes.</summary>
        public static EdgeCosts CollectEdgeCosts(IEnumerable<Route> routes)
        {
            var costs = new EdgeCosts();
            if (routes == null) return costs;

            foreach (var route in routes)
            {
                if (route.Legs == null) continue;
                for (int i = 0; i < route.Legs.Count && i < route.Stops.Count; i++)
                {
                    var leg = route.Legs[i];
                    if (!leg.Verified) continue;

                    var a = route.Stops[i];
                    var b = route.Stops[(i + 1) % route.Stops.Count];
                    costs.Add(a, b, leg.Length());
                }
            }

            return costs;
        }

        /// <summary>
        /// Filtre les routes à publier dans le pack.
        ///
        /// Pathing MÉMORISE l'état des cases du joueur : une catégorie déjà
        /// vue reste cochée même si le pack la déclare décochée. Le seul
        /// moyen fiable de ne pas superposer sept boucles est donc de ne pas
        /// les publier du tout. C'est aussi, en attendant le menu Lua, le
        /// sélecteur de composition : on change ce réglage, le pack est
        /// réécrit avec la seule composition demandée.
        ///
        /// spec : vide ou "auto" = la composition la plus complète de chaque
        /// map ; "*" = toutes ; sinon une liste de groupes séparés par "+"
        /// (par exemple "Minerai+Bois").
        /// </summary>
        public static List<Route> SelectPublished(List<Route> routes, string spec)
        {
            if (routes == null || routes.Count == 0) return new List<Route>();

            spec = (spec ?? "").Trim();
            if (spec == "*") return routes;

            if (spec.Length > 0 && !spec.Equals("auto", StringComparison.OrdinalIgnoreCase))
            {
                var wanted = spec.Split('+')
                                 .Select(g => g.Trim().ToLowerInvariant())
                                 .Where(g => g.Length > 0)
                                 .OrderBy(g => g)
                                 .ToList();

                var matched = routes.Where(r =>
                    r.Groups.Select(g => g.ToLowerInvariant()).OrderBy(g => g).SequenceEqual(wanted)).ToList();

                // Une composition qui n'existe pas sur cette map ne doit pas
                // vider le pack : on retombe sur la plus complète.
                if (matched.Count > 0) return matched;
            }

            // Par map, la route qui couvre le plus de groupes.
            return routes.GroupBy(r => r.MapId)
                         .Select(g => g.OrderByDescending(r => r.Groups.Count).First())
                         .ToList();
        }

        public static Route Build(IEnumerable<GatheredNode> nodes, int mapId, IList<string> groups,
                                  EdgeCosts costs = null)
        {
            var wanted = new HashSet<string>(groups);

            var stops = nodes
                .Where(n => n.MapId == mapId && wanted.Contains(n.Group))
                .Select(RoutePoint.FromNode)
                .ToList();

            var route = new Route
            {
                MapId = mapId,
                Groups = new List<string>(groups),
                BuiltAt = DateTime.Now.ToString("o"),
                Stops = stops,
            };

            if (stops.Count < 2)
            {
                route.Legs = new List<RouteLeg>();
                return route;
            }

            costs = costs ?? new EdgeCosts();
            route.Stops = TwoOpt(NearestNeighbour(stops, costs), costs);
            route.Legs = DirectLegs(route.Stops);
            return route;
        }

        /// <summary>Ordre initial : plus proche voisin depuis le premier arrêt.</summary>
        private static List<RoutePoint> NearestNeighbour(List<RoutePoint> stops, EdgeCosts costs)
        {
            var remaining = new List<RoutePoint>(stops);
            var order = new List<RoutePoint>();

            var current = remaining[0];
            remaining.RemoveAt(0);
            order.Add(current);

            while (remaining.Count > 0)
            {
                int bestIdx = 0;
                double bestDist = double.MaxValue;
                for (int i = 0; i < remaining.Count; i++)
                {
                    double d = costs.Between(current, remaining[i]);
                    if (d < bestDist) { bestDist = d; bestIdx = i; }
                }
                current = remaining[bestIdx];
                remaining.RemoveAt(bestIdx);
                order.Add(current);
            }

            return order;
        }

        /// <summary>
        /// 2-opt sur boucle fermée : tant qu'inverser un sous-segment
        /// raccourcit le tour, on l'inverse. Gain typique de 8 à 11 % sur les
        /// routes d'Iron Marches, pour un coût négligeable à n &lt; 200.
        /// </summary>
        private static List<RoutePoint> TwoOpt(List<RoutePoint> tour, EdgeCosts costs)
        {
            int n = tour.Count;
            if (n < 4) return tour;

            bool improved = true;
            int passes = 0;

            while (improved && passes < MaxTwoOptPasses)
            {
                improved = false;
                passes++;

                for (int i = 0; i < n - 1; i++)
                {
                    for (int j = i + 1; j < n; j++)
                    {
                        var a = tour[(i - 1 + n) % n];
                        var b = tour[i];
                        var c = tour[j];
                        var d = tour[(j + 1) % n];

                        if (ReferenceEquals(a, c) || ReferenceEquals(b, d)) continue;

                        double before = costs.Between(a, b) + costs.Between(c, d);
                        double after = costs.Between(a, c) + costs.Between(b, d);

                        if (after + 1e-9 < before)
                        {
                            tour.Reverse(i, j - i + 1);
                            improved = true;
                        }
                    }
                }
            }

            if (passes >= MaxTwoOptPasses)
                Logger.Debug("2-opt arrêté au plafond de {0} passes.", MaxTwoOptPasses);

            return tour;
        }

        private static List<RouteLeg> DirectLegs(List<RoutePoint> stops)
        {
            var legs = new List<RouteLeg>();
            for (int i = 0; i < stops.Count; i++)
            {
                var from = stops[i];
                var to = stops[(i + 1) % stops.Count];
                legs.Add(DirectLeg(from, to));
            }
            return legs;
        }

        private static RouteLeg DirectLeg(RoutePoint from, RoutePoint to) => new RouteLeg
        {
            Verified = false,
            Mount = null,
            TraceAt = null,
            Points = new List<RoutePoint> { from, to },
        };

        // -------------------------------------------------------------
        // Insertion à la volée
        // -------------------------------------------------------------

        /// <summary>
        /// Insère un nouvel arrêt là où il coûte le moins cher : le couple
        /// (a, b) consécutif qui minimise d(a,n) + d(n,b) - d(a,b).
        ///
        /// Les deux tronçons créés repartent en ligne droite et non vérifiés,
        /// même si celui qu'ils remplacent était vérifié : le détour par le
        /// nouveau node n'a jamais été parcouru. Il le sera au prochain
        /// passage.
        /// </summary>
        public static bool Insert(Route route, RoutePoint p)
        {
            if (route == null) return false;

            if (route.Stops.Count < 2)
            {
                route.Stops.Add(p);
                route.Legs = route.Stops.Count == 2 ? DirectLegs(route.Stops) : new List<RouteLeg>();
                return true;
            }

            int n = route.Stops.Count;
            int bestIdx = -1;
            double bestCost = double.MaxValue;

            for (int i = 0; i < n; i++)
            {
                var a = route.Stops[i];
                var b = route.Stops[(i + 1) % n];
                double cost = a.DistanceTo(p) + p.DistanceTo(b) - a.DistanceTo(b);
                if (cost < bestCost) { bestCost = cost; bestIdx = i; }
            }

            if (bestIdx < 0) return false;

            var from = route.Stops[bestIdx];
            var to = route.Stops[(bestIdx + 1) % n];

            route.Stops.Insert(bestIdx + 1, p);
            route.Legs[bestIdx] = DirectLeg(from, p);
            route.Legs.Insert(bestIdx + 1, DirectLeg(p, to));

            return true;
        }

        /// <summary>
        /// Retire l'arrêt le plus proche de p (node supprimé en jeu) et
        /// recoud les deux tronçons voisins en une ligne droite non vérifiée.
        /// </summary>
        public static bool Remove(Route route, RoutePoint p, double radius)
        {
            if (route == null || route.Stops.Count == 0) return false;

            int idx = -1;
            double best = radius;
            for (int i = 0; i < route.Stops.Count; i++)
            {
                double d = route.Stops[i].DistanceTo(p);
                if (d <= best) { best = d; idx = i; }
            }
            if (idx < 0) return false;

            int n = route.Stops.Count;
            if (n <= 2)
            {
                route.Stops.RemoveAt(idx);
                route.Legs = new List<RouteLeg>();
                return true;
            }

            int prev = (idx - 1 + n) % n;
            var from = route.Stops[prev];
            var to = route.Stops[(idx + 1) % n];

            route.Stops.RemoveAt(idx);
            route.Legs.RemoveAt(idx);
            route.Legs[Math.Min(prev, route.Legs.Count - 1)] = DirectLeg(from, to);

            return true;
        }

        // -------------------------------------------------------------
        // Affinage par les traces
        // -------------------------------------------------------------

        /// <summary>
        /// Remplace les tronçons en ligne droite par le trajet réellement
        /// parcouru, simplifié à epsilon près.
        ///
        /// Retourne deux compteurs distincts : les tronçons qui passent pour
        /// la PREMIÈRE fois en vérifié, et ceux qui étaient déjà vérifiés et
        /// dont on vient de reprendre un passage plus récent. Le second cas
        /// n'est pas une correction, c'est une reconfirmation -- les
        /// confondre donnerait l'impression que la route bouge encore alors
        /// qu'elle ne fait que se rafraîchir.
        ///
        /// Un tronçon déjà vérifié n'est réécrit que si la trace trouvée est
        /// PLUS RÉCENTE que celle qui l'avait produit : refaire le trajet
        /// autrement corrige la route, le relire ne la dégrade pas.
        /// </summary>
        public static (int added, int refreshed) Refine(Route route, TraceRecorder traces, double epsilon, double snapRadius, double detourFactor)
        {
            if (route == null || traces == null || route.Stops.Count < 2) return (0, 0);

            int added = 0;
            int refreshed = 0;

            for (int i = 0; i < route.Legs.Count; i++)
            {
                var from = route.Stops[i];
                var to = route.Stops[(i + 1) % route.Stops.Count];
                var leg = route.Legs[i];

                var match = traces.FindLeg(route.MapId, from, to, snapRadius, detourFactor);
                if (match == null) continue;

                // Le filigrane s'applique que le tronçon soit vérifié ou
                // rejeté : dans les deux cas, seule une trace plus récente
                // peut le réécrire.
                if (!string.IsNullOrEmpty(leg.TraceAt)
                    && string.CompareOrdinal(match.RecordedAt ?? "", leg.TraceAt) <= 0)
                    continue; // rien de plus récent

                var raw = match.Points.Select(RoutePoint.FromTrace).ToList();
                var simplified = Simplify(raw, epsilon);

                // Les extrémités sont les arrêts eux-mêmes, pas les points de
                // trace qui traînent autour : on élague ce qui est collé aux
                // nodes pour éviter le zigzag d'arrivée.
                double trim = snapRadius * 0.5;
                var interior = simplified
                    .Where(pt => pt.DistanceTo(from) > trim && pt.DistanceTo(to) > trim)
                    .ToList();

                var points = new List<RoutePoint> { from };
                points.AddRange(interior);
                points.Add(to);

                bool wasVerified = leg.Verified;

                leg.Points = points;
                leg.Verified = true;
                leg.Mount = match.Mount;
                leg.TraceAt = match.RecordedAt;

                if (wasVerified) refreshed++; else added++;
            }

            return (added, refreshed);
        }

        // -------------------------------------------------------------
        // Ramer-Douglas-Peucker
        // -------------------------------------------------------------

        /// <summary>
        /// Simplification à tolérance garantie : aucun point d'origine ne se
        /// retrouve à plus de epsilon de la polyligne retournée. C'est une
        /// borne, pas une moyenne.
        /// </summary>
        public static List<RoutePoint> Simplify(List<RoutePoint> points, double epsilon)
        {
            if (points == null || points.Count < 3) return new List<RoutePoint>(points ?? new List<RoutePoint>());

            var keep = new bool[points.Count];
            keep[0] = true;
            keep[points.Count - 1] = true;

            SimplifySegment(points, 0, points.Count - 1, epsilon, keep);

            var result = new List<RoutePoint>();
            for (int i = 0; i < points.Count; i++)
                if (keep[i]) result.Add(points[i]);
            return result;
        }

        private static void SimplifySegment(List<RoutePoint> pts, int first, int last, double epsilon, bool[] keep)
        {
            if (last <= first + 1) return;

            double maxDist = -1;
            int maxIdx = -1;

            for (int i = first + 1; i < last; i++)
            {
                double d = PerpendicularDistance(pts[i], pts[first], pts[last]);
                if (d > maxDist) { maxDist = d; maxIdx = i; }
            }

            if (maxDist <= epsilon || maxIdx < 0) return;

            keep[maxIdx] = true;
            SimplifySegment(pts, first, maxIdx, epsilon, keep);
            SimplifySegment(pts, maxIdx, last, epsilon, keep);
        }

        /// <summary>
        /// Distance d'un point à la géométrie d'un tronçon. Sert à désigner
        /// « le tronçon où je me tiens » sans qu'Antoine ait à lire la moindre
        /// coordonnée.
        /// </summary>
        public static double DistanceToLeg(RouteLeg leg, RoutePoint p)
        {
            if (leg == null || leg.Points == null || leg.Points.Count == 0) return double.MaxValue;
            if (leg.Points.Count == 1) return p.DistanceTo(leg.Points[0]);

            double best = double.MaxValue;
            for (int i = 0; i + 1 < leg.Points.Count; i++)
            {
                double d = PerpendicularDistance(p, leg.Points[i], leg.Points[i + 1]);
                if (d < best) best = d;
            }
            return best;
        }

        /// <summary>
        /// Rejette la géométrie d'un tronçon et le remet en ligne droite.
        ///
        /// TraceAt est CONSERVÉ comme filigrane : l'affinage ne reprendra ce
        /// tronçon qu'avec une trace strictement plus récente. Sans ça, la
        /// passe suivante retrouverait le même mauvais trajet et annulerait le
        /// rejet dans la minute.
        /// </summary>
        public static void Invalidate(Route route, int legIndex)
        {
            if (route == null || legIndex < 0 || legIndex >= route.Legs.Count) return;

            var from = route.Stops[legIndex];
            var to = route.Stops[(legIndex + 1) % route.Stops.Count];
            var leg = route.Legs[legIndex];

            leg.Verified = false;
            leg.Mount = null;
            leg.Points = new List<RoutePoint> { from, to };
        }

        /// <summary>Distance 3D d'un point au segment [a, b].</summary>
        private static double PerpendicularDistance(RoutePoint p, RoutePoint a, RoutePoint b)
        {
            double abx = b.X - a.X, aby = b.Y - a.Y, abz = b.Z - a.Z;
            double apx = p.X - a.X, apy = p.Y - a.Y, apz = p.Z - a.Z;

            double abLenSq = abx * abx + aby * aby + abz * abz;
            if (abLenSq < 1e-12) return p.DistanceTo(a);

            double t = (apx * abx + apy * aby + apz * abz) / abLenSq;
            if (t < 0) t = 0; else if (t > 1) t = 1;

            double cx = a.X + t * abx, cy = a.Y + t * aby, cz = a.Z + t * abz;
            double dx = p.X - cx, dy = p.Y - cy, dz = p.Z - cz;
            return Math.Sqrt(dx * dx + dy * dy + dz * dz);
        }

        // -------------------------------------------------------------
        // Persistance
        // -------------------------------------------------------------

        public static List<Route> Load(string path)
        {
            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
                return new List<Route>();

            try
            {
                var loaded = JsonConvert.DeserializeObject<List<Route>>(File.ReadAllText(path))
                             ?? new List<Route>();

                // Les fichiers écrits avant le passage aux compositions
                // portaient un champ "group" unique : désérialisés, ils
                // arrivent sans aucun groupe. Une route sans groupe n'a ni
                // identité ni catégorie, elle produirait un namespace TacO
                // vide. On la jette, R la reconstruira.
                int stale = loaded.RemoveAll(r => r.Groups == null || r.Groups.Count == 0);
                if (stale > 0)
                    Logger.Info("{0} route(s) a l'ancien format ignoree(s) : relance la construction (R) sur ces maps.", stale);

                return loaded;
            }
            catch (Exception ex)
            {
                Logger.Warn(ex, "Lecture des routes impossible ({0}).", path);
                return new List<Route>();
            }
        }

        public static void Save(List<Route> routes, string path)
        {
            if (string.IsNullOrWhiteSpace(path)) return;

            try
            {
                string dir = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                string temp = path + ".tmp";
                File.WriteAllText(temp, JsonConvert.SerializeObject(routes, Formatting.Indented));
                using (var dest = new FileStream(path, FileMode.Create))
                using (var src = new FileStream(temp, FileMode.Open))
                    src.CopyTo(dest);
                File.Delete(temp);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Échec de l'écriture des routes ({0}).", path);
            }
        }
    }
}
