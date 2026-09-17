using Newtonsoft.Json;
using System;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Un échantillon de position du joueur, enregistré en continu quand la
    /// correction de chemin est active.
    ///
    /// Convention d'axes IDENTIQUE à GatheredNode : X = pos.X, Y = pos.Z
    /// (altitude), Z = pos.Y. Elle vient du remappage fait à la capture
    /// (cf. OnCaptureKeyActivated) et permet de comparer un point de trace
    /// et un node sans conversion, et d'écrire le .trl avec le même ordre
    /// xpos/ypos/zpos que les POI.
    ///
    /// Ce n'est PAS une variante de GatheredNode : un node est un gisement
    /// permanent, un point de trace est un passage horodaté. Structures
    /// séparées, fichiers séparés.
    /// </summary>
    public class TracePoint
    {
        [JsonProperty("map_id")]
        public int MapId { get; set; }

        [JsonProperty("x")]
        public double X { get; set; }

        [JsonProperty("y")]
        public double Y { get; set; }

        [JsonProperty("z")]
        public double Z { get; set; }

        /// <summary>Horodatage ISO 8601 -- sert à préférer la trace la plus récente.</summary>
        [JsonProperty("t")]
        public string RecordedAt { get; set; }

        /// <summary>
        /// Monture en cours ("none" à pied). Un tronçon parcouru en skyscale
        /// ou en griffon est une trajectoire aérienne : on l'enregistre, on
        /// le signale, on ne le refuse pas.
        /// </summary>
        [JsonProperty("mount")]
        public string Mount { get; set; }

        /// <summary>
        /// Identifiant de segment continu. Il change à chaque rupture :
        /// changement de map, téléportation (waypoint), ou reprise après une
        /// coupure d'enregistrement. Deux points de segments différents ne
        /// sont JAMAIS reliés -- c'est ce qui empêche une route de traverser
        /// la map sur un saut de waypoint.
        /// </summary>
        [JsonProperty("seg")]
        public int Segment { get; set; }

        public double DistanceTo(double ox, double oy, double oz)
        {
            double dx = X - ox, dy = Y - oy, dz = Z - oz;
            return Math.Sqrt(dx * dx + dy * dy + dz * dz);
        }

        public double DistanceTo(TracePoint other) => DistanceTo(other.X, other.Y, other.Z);
    }
}
