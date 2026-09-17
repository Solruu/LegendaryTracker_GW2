using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace GW2_NodeTracker
{
    /// <summary>Point de géométrie pure (même convention d'axes que GatheredNode).</summary>
    public class RoutePoint
    {
        [JsonProperty("x")] public double X { get; set; }
        [JsonProperty("y")] public double Y { get; set; }
        [JsonProperty("z")] public double Z { get; set; }

        public RoutePoint() { }

        public RoutePoint(double x, double y, double z) { X = x; Y = y; Z = z; }

        public static RoutePoint FromNode(GatheredNode n) => new RoutePoint(n.X, n.Y, n.Z);

        public static RoutePoint FromTrace(TracePoint p) => new RoutePoint(p.X, p.Y, p.Z);

        public double DistanceTo(RoutePoint o)
        {
            double dx = X - o.X, dy = Y - o.Y, dz = Z - o.Z;
            return Math.Sqrt(dx * dx + dy * dy + dz * dz);
        }
    }

    /// <summary>
    /// Un tronçon entre deux arrêts consécutifs.
    ///
    /// Points contient TOUJOURS les deux extrémités. Tant qu'aucune trace ne
    /// couvre le tronçon, il n'y a que ces deux points et Verified = false :
    /// la route y passe en ligne droite, donc potentiellement à travers le
    /// décor. Une fois le chemin réellement parcouru, les points
    /// intermédiaires issus de la trace simplifiée s'insèrent entre les deux
    /// et Verified passe à true.
    /// </summary>
    public class RouteLeg
    {
        [JsonProperty("verified")]
        public bool Verified { get; set; }

        /// <summary>Monture dominante relevée sur la trace ("none" = à pied).</summary>
        [JsonProperty("mount")]
        public string Mount { get; set; }

        /// <summary>Horodatage de la trace qui a servi -- la plus récente gagne.</summary>
        [JsonProperty("trace_at")]
        public string TraceAt { get; set; }

        [JsonProperty("points")]
        public List<RoutePoint> Points { get; set; } = new List<RoutePoint>();

        public double Length()
        {
            double total = 0;
            for (int i = 0; i + 1 < Points.Count; i++)
                total += Points[i].DistanceTo(Points[i + 1]);
            return total;
        }
    }

    /// <summary>
    /// Une route fermée sur une map et un groupe (Minerai / Bois / Vegetal).
    ///
    /// Les arrêts sont stockés en coordonnées, pas en référence vers un node :
    /// GatheredNode n'a pas d'identifiant et on n'en ajoute pas un pour ça. Le
    /// rattachement à un node se refait par proximité quand c'est nécessaire.
    /// </summary>
    public class Route
    {
        [JsonProperty("map_id")]
        public int MapId { get; set; }

        [JsonProperty("group")]
        public string Group { get; set; }

        [JsonProperty("built_at")]
        public string BuiltAt { get; set; }

        [JsonProperty("stops")]
        public List<RoutePoint> Stops { get; set; } = new List<RoutePoint>();

        /// <summary>
        /// Legs[i] va de Stops[i] à Stops[i+1], et le dernier referme la
        /// boucle sur Stops[0]. Donc Legs.Count == Stops.Count dès que la
        /// route contient au moins deux arrêts.
        /// </summary>
        [JsonProperty("legs")]
        public List<RouteLeg> Legs { get; set; } = new List<RouteLeg>();

        public double Length()
        {
            double total = 0;
            foreach (var leg in Legs) total += leg.Length();
            return total;
        }

        public int VerifiedCount()
        {
            int n = 0;
            foreach (var leg in Legs) if (leg.Verified) n++;
            return n;
        }
    }
}
