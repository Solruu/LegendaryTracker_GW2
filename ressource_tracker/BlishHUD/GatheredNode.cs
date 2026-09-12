using Newtonsoft.Json;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Un node capturé. Même forme que les entrées de gw2_nodes.json produites
    /// par gw2_node_ID_v9.py -- doit rester compatible pour que
    /// gw2_taco_gen_v6.py continue de lire ce fichier sans modification.
    /// </summary>
    public class GatheredNode
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("group")]
        public string Group { get; set; }

        [JsonProperty("label")]
        public string Label { get; set; }

        [JsonProperty("map_id")]
        public int MapId { get; set; }

        [JsonProperty("x")]
        public double X { get; set; }

        [JsonProperty("y")]
        public double Y { get; set; }

        [JsonProperty("z")]
        public double Z { get; set; }

        [JsonProperty("captured_at")]
        public string CapturedAt { get; set; }

        [JsonProperty("updated_at", NullValueHandling = NullValueHandling.Ignore)]
        public string UpdatedAt { get; set; }

        public double DistanceTo(double ox, double oy, double oz)
        {
            double dx = X - ox, dy = Y - oy, dz = Z - oz;
            return System.Math.Sqrt(dx * dx + dy * dy + dz * dz);
        }
    }
}
