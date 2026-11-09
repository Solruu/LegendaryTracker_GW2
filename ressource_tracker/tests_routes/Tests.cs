using System;
using System.Collections.Generic;
using System.Linq;
using GW2_NodeTracker;
using Newtonsoft.Json;

public static class Tests
{
    const int Map = 1288;
    const double MinStep = 3, Tp = 50, Snap = 12, Eps = 1.5, Detour = 4;

    // Avance en ligne droite de (x0,z0) a (x1,z1) par pas de 4 m.
    static void Walk(TraceRecorder t, double x0, double z0, double x1, double z1, string mount = "None")
    {
        double d = Math.Sqrt((x1 - x0) * (x1 - x0) + (z1 - z0) * (z1 - z0));
        int n = Math.Max(1, (int)Math.Ceiling(d / 4.0));
        for (int k = 0; k <= n; k++)
            t.Sample(Map, x0 + (x1 - x0) * k / n, 0, z0 + (z1 - z0) * k / n, mount, MinStep, Tp);
    }

    static Route TwoStopRoute(RoutePoint a, RoutePoint b) => new Route
    {
        MapId = Map, Groups = new List<string> { "Vegetal" },
        Stops = new List<RoutePoint> { a, b },
        Legs = new List<RouteLeg> {
            new RouteLeg { Points = new List<RoutePoint> { a, b } },
            new RouteLeg { Points = new List<RoutePoint> { b, a } } },
    };

    static string Leg(RouteLeg l) =>
        $"verified={l.Verified} pts={l.Points.Count} len={l.Length():0} mount={l.Mount ?? "-"} known={Known(l)}";

    static string Known(RouteLeg l)
    {
        var p = typeof(RouteLeg).GetProperty("KnownLength");
        if (p == null) return "(absent)";
        var v = p.GetValue(l);
        return v == null ? "null" : $"{(double)v:0}";
    }

    static double Cost(Route r) =>
        RouteBuilder.CollectEdgeCosts(new[] { r }, Snap).Between(r.Stops[0], r.Stops[1]);

    public static void Main()
    {
        var A = new RoutePoint(0, 0, 0);
        var B = new RoutePoint(100, 0, 0);

        // 1. Node normal : trajet direct legerement courbe
        {
            var t = new TraceRecorder();
            Walk(t, 0, 0, 50, 10); Walk(t, 50, 10, 100, 0);
            var r = TwoStopRoute(A, B);
            var res = RouteBuilder.Refine(r, t, Eps, Snap, Detour);
            Console.WriteLine($"1 normal      : refine={res} leg0[{Leg(r.Legs[0])}] cout={Cost(r):0}");
        }
        // 2. Contournement de ~600 m (> 4x100+100) entre deux nodes a 100 m
        {
            var t = new TraceRecorder();
            Walk(t, 0, 0, 0, 250); Walk(t, 0, 250, 100, 250); Walk(t, 100, 250, 100, 0);
            var r = TwoStopRoute(A, B);
            var res = RouteBuilder.Refine(r, t, Eps, Snap, Detour);
            Console.WriteLine($"2 detour long : refine={res} leg0[{Leg(r.Legs[0])}] cout={Cost(r):0}");
            // 3. Puis un trajet direct plus recent : verifie, le cout connu disparait
            System.Threading.Thread.Sleep(20);
            t.CutSegment(); Walk(t, 0, 0, 100, 0);
            res = RouteBuilder.Refine(r, t, Eps, Snap, Detour);
            Console.WriteLine($"3 puis direct : refine={res} leg0[{Leg(r.Legs[0])}] cout={Cost(r):0}");
        }
        // 4. Portail de sable : marche au jackal, saut de 200 m, marche au jackal
        {
            var t = new TraceRecorder();
            Walk(t, 0, 0, 20, 0, "Jackal"); Walk(t, 220, 0, 240, 0, "Jackal");
            var b2 = new RoutePoint(240, 0, 0);
            var r = TwoStopRoute(A, b2);
            var res = RouteBuilder.Refine(r, t, Eps, Snap, Detour);
            Console.WriteLine($"4 portail     : refine={res} leg0[{Leg(r.Legs[0])}] cout={Cost(r):0}");
        }
        // 5. Waypoint (pas sur le jackal) : le saut doit rester une coupure
        {
            var t = new TraceRecorder();
            Walk(t, 0, 0, 20, 0); Walk(t, 220, 0, 240, 0);
            var r = TwoStopRoute(A, new RoutePoint(240, 0, 0));
            var res = RouteBuilder.Refine(r, t, Eps, Snap, Detour);
            Console.WriteLine($"5 waypoint    : refine={res} leg0[{Leg(r.Legs[0])}] cout={Cost(r):0}");
        }
        // 6. Jackal, mais saut de 1 500 m : coupure
        {
            var t = new TraceRecorder();
            Walk(t, 0, 0, 20, 0, "Jackal"); Walk(t, 1520, 0, 1540, 0, "Jackal");
            var r = TwoStopRoute(A, new RoutePoint(1540, 0, 0));
            var res = RouteBuilder.Refine(r, t, Eps, Snap, Detour);
            Console.WriteLine($"6 saut enorme : refine={res} leg0[{Leg(r.Legs[0])}] cout={Cost(r):0}");
        }
        // 7. Ordre : 4 nodes, P et Q proches a vol d'oiseau mais separes par un detour de 600 m
        {
            var nodes = new List<GatheredNode> {
                new GatheredNode { MapId = Map, Group = "Vegetal", X = 0,   Y = 0, Z = 0 },   // P
                new GatheredNode { MapId = Map, Group = "Vegetal", X = 60,  Y = 0, Z = 0 },   // Q
                new GatheredNode { MapId = Map, Group = "Vegetal", X = 0,   Y = 0, Z = 120 }, // R
                new GatheredNode { MapId = Map, Group = "Vegetal", X = 60,  Y = 0, Z = 120 }, // S
            };
            string Order(Route r) => string.Join(" ", r.Stops.Select(s => s.X == 0 ? (s.Z == 0 ? "P" : "R") : (s.Z == 0 ? "Q" : "S")));
            bool PQAdjacent(Route r)
            {
                int n = r.Stops.Count;
                for (int i = 0; i < n; i++)
                {
                    var a = r.Stops[i]; var b = r.Stops[(i + 1) % n];
                    if (a.Z == 0 && b.Z == 0) return true;
                }
                return false;
            }
            var groups = new List<string> { "Vegetal" };
            var r0 = RouteBuilder.Build(nodes, Map, groups);
            var t = new TraceRecorder();
            // Seul passage connu entre P et Q : un detour de ~700 m par le sud
            Walk(t, 0, 0, 0, -300); Walk(t, 0, -300, 60, -300); Walk(t, 60, -300, 60, 0);
            RouteBuilder.Refine(r0, t, Eps, Snap, Detour);
            var costs = RouteBuilder.CollectEdgeCosts(new[] { r0 }, Snap);
            var r1 = RouteBuilder.Build(nodes, Map, groups, costs);
            Console.WriteLine($"7 ordre       : avant [{Order(r0)}] P-Q voisins={PQAdjacent(r0)} | apres [{Order(r1)}] P-Q voisins={PQAdjacent(r1)} | couts connus={costs.Count}");
        }
        // 9. Deambulation de 5 km entre deux passages : pas retenue comme cout
        {
            var t = new TraceRecorder();
            Walk(t, 0, 0, 0, 1300); Walk(t, 0, 1300, 1300, 1300); Walk(t, 1300, 1300, 1300, 0); Walk(t, 1300, 0, 100, 0);
            var r = TwoStopRoute(A, B);
            var res = RouteBuilder.Refine(r, t, Eps, Snap, Detour);
            Console.WriteLine($"9 deambulation: refine={res} leg0[{Leg(r.Legs[0])}] cout={Cost(r):0}");
        }
        // 8. Ancien fichier de route sans le nouveau champ
        {
            string json = "[{\"map_id\":1288,\"groups\":[\"Vegetal\"],\"stops\":[{\"x\":0,\"y\":0,\"z\":0},{\"x\":1,\"y\":0,\"z\":0}],\"legs\":[{\"verified\":false,\"points\":[{\"x\":0,\"y\":0,\"z\":0},{\"x\":1,\"y\":0,\"z\":0}]}]}]";
            var routes = JsonConvert.DeserializeObject<List<Route>>(json);
            Console.WriteLine($"8 ancien json : legs={routes[0].Legs.Count} known={Known(routes[0].Legs[0])} reserialise={JsonConvert.SerializeObject(routes[0].Legs[0])}");
        }
    }
}
