using Blish_HUD;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Résultat d'une recherche de tronçon dans les traces : le sous-trajet
    /// réellement parcouru entre deux arrêts.
    /// </summary>
    public class TraceMatch
    {
        public List<TracePoint> Points { get; set; }
        public string Mount { get; set; }
        public string RecordedAt { get; set; }
        public double Length { get; set; }
    }

    /// <summary>
    /// Enregistre le déplacement du joueur et sait en extraire le trajet
    /// réellement emprunté entre deux points.
    ///
    /// Trois règles portent tout le mécanisme :
    ///  1. on ne garde un échantillon que s'il s'éloigne d'au moins
    ///     MinStep du précédent -- rester immobile n'écrit rien ;
    ///  2. un écart supérieur à TeleportThreshold entre deux échantillons
    ///     consécutifs est une téléportation (waypoint, mise à jour de
    ///     position après un écran de chargement) : on coupe le segment.
    ///     C'est l'ancrage sur waypoints, obtenu gratuitement ;
    ///  3. un changement de map coupe aussi le segment.
    /// </summary>
    public class TraceRecorder
    {
        private static readonly Logger Logger = Logger.GetLogger<TraceRecorder>();

        /// <summary>Garde-fou : au-delà, les points les plus anciens sont oubliés.</summary>
        public const int MaxPoints = 400000;

        private readonly List<TracePoint> _points = new List<TracePoint>();
        private TracePoint _last;
        private int _currentSegment = 0;
        private bool _dirty = false;

        public int Count => _points.Count;
        public bool Dirty => _dirty;

        /// <summary>Force une rupture de segment (changement de map, reprise après pause).</summary>
        public void CutSegment()
        {
            _last = null;
        }

        /// <summary>
        /// Échantillonne une position. Retourne true si un point a été retenu.
        /// Coordonnées attendues DÉJÀ remappées (x = pos.X, y = pos.Z, z = pos.Y).
        /// </summary>
        public bool Sample(int mapId, double x, double y, double z, string mount,
                           double minStep, double teleportThreshold)
        {
            if (_last != null && _last.MapId != mapId)
                _last = null; // changement de map : rupture

            if (_last != null)
            {
                double d = _last.DistanceTo(x, y, z);

                if (d < minStep)
                    return false; // immobile ou pas assez avancé

                if (d > teleportThreshold)
                {
                    // Téléportation : on n'a pas parcouru cette distance, on
                    // ne doit surtout pas relier les deux points.
                    _currentSegment++;
                    _last = null;
                }
            }

            if (_last == null)
                _currentSegment++;

            var p = new TracePoint
            {
                MapId = mapId,
                X = Math.Round(x, 3),
                Y = Math.Round(y, 3),
                Z = Math.Round(z, 3),
                RecordedAt = DateTime.Now.ToString("o"),
                Mount = string.IsNullOrEmpty(mount) ? "none" : mount,
                Segment = _currentSegment,
            };

            _points.Add(p);
            _last = p;
            _dirty = true;

            if (_points.Count > MaxPoints)
                _points.RemoveRange(0, _points.Count - MaxPoints);

            return true;
        }

        // -------------------------------------------------------------
        // Persistance
        // -------------------------------------------------------------

        public void Load(string path)
        {
            _points.Clear();
            _last = null;
            _currentSegment = 0;

            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
                return;

            try
            {
                var loaded = JsonConvert.DeserializeObject<List<TracePoint>>(File.ReadAllText(path));
                if (loaded != null && loaded.Count > 0)
                {
                    _points.AddRange(loaded);
                    _currentSegment = _points.Max(p => p.Segment);
                }
                Logger.Info("Traces chargées : {0} points, {1} segments.", _points.Count, _currentSegment);
            }
            catch (Exception ex)
            {
                Logger.Warn(ex, "Lecture des traces impossible ({0}) -- on repart d'un enregistrement vide.", path);
            }

            _dirty = false;
        }

        public void Save(string path)
        {
            if (string.IsNullOrWhiteSpace(path)) return;

            try
            {
                string dir = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                // Écriture atomique : fichier temporaire puis recopie, comme
                // pour le .taco -- une trace à moitié écrite serait illisible
                // au prochain démarrage.
                string temp = path + ".tmp";
                File.WriteAllText(temp, JsonConvert.SerializeObject(_points, Formatting.None));
                using (var dest = new FileStream(path, FileMode.Create))
                using (var src = new FileStream(temp, FileMode.Open))
                    src.CopyTo(dest);
                File.Delete(temp);

                _dirty = false;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Échec de l'écriture des traces ({0}).", path);
            }
        }

        // -------------------------------------------------------------
        // Recherche du trajet réellement emprunté entre deux arrêts
        // -------------------------------------------------------------

        /// <summary>
        /// Cherche, dans les traces de la map, le sous-trajet allant de
        /// <paramref name="from"/> à <paramref name="to"/> : dernière sortie
        /// du rayon d'accroche de l'un, première entrée dans celui de
        /// l'autre, sans jamais franchir une rupture de segment.
        ///
        /// Départage : la trace la plus récente gagne, puis la plus courte.
        /// Un trajet plus de 4 fois plus long que la ligne droite est rejeté
        /// -- c'est une déambulation, pas un chemin.
        ///
        /// Retourne null si aucune trace ne couvre le tronçon : le tronçon
        /// reste alors en ligne droite et non vérifié.
        /// </summary>
        public TraceMatch FindLeg(int mapId, RoutePoint from, RoutePoint to, double snapRadius)
        {
            if (_points.Count == 0) return null;

            double straight = from.DistanceTo(to);
            double maxAcceptable = straight * 4.0 + 100.0;

            TraceMatch best = null;

            foreach (var seg in _points.Where(p => p.MapId == mapId)
                                       .GroupBy(p => p.Segment))
            {
                var pts = seg.ToList();
                int lastNearFrom = -1;

                for (int j = 0; j < pts.Count; j++)
                {
                    var p = pts[j];

                    if (p.DistanceTo(from.X, from.Y, from.Z) <= snapRadius)
                        lastNearFrom = j;

                    if (lastNearFrom < 0 || j <= lastNearFrom) continue;
                    if (p.DistanceTo(to.X, to.Y, to.Z) > snapRadius) continue;

                    var slice = pts.GetRange(lastNearFrom, j - lastNearFrom + 1);
                    double len = 0;
                    for (int k = 0; k + 1 < slice.Count; k++)
                        len += slice[k].DistanceTo(slice[k + 1]);

                    if (len > maxAcceptable) { lastNearFrom = -1; continue; }

                    var candidate = new TraceMatch
                    {
                        Points = slice,
                        Length = len,
                        RecordedAt = slice[slice.Count - 1].RecordedAt,
                        Mount = DominantMount(slice),
                    };

                    if (IsBetter(candidate, best)) best = candidate;

                    lastNearFrom = -1; // on repart en quête d'un nouveau départ
                }
            }

            return best;
        }

        private static bool IsBetter(TraceMatch candidate, TraceMatch current)
        {
            if (current == null) return true;

            // La plus récente l'emporte : si Antoine refait le trajet
            // autrement, c'est le nouveau chemin qui compte.
            int cmp = string.CompareOrdinal(candidate.RecordedAt ?? "", current.RecordedAt ?? "");
            if (cmp != 0) return cmp > 0;

            return candidate.Length < current.Length;
        }

        private static string DominantMount(List<TracePoint> pts)
        {
            var counts = new Dictionary<string, int>();
            foreach (var p in pts)
            {
                string m = string.IsNullOrEmpty(p.Mount) ? "none" : p.Mount;
                counts.TryGetValue(m, out int c);
                counts[m] = c + 1;
            }

            // "none" ne gagne que s'il est seul : savoir qu'un tronçon a été
            // fait en griffon est plus utile que de savoir qu'on a couru les
            // dix derniers mètres.
            var mounted = counts.Where(kv => kv.Key != "none").ToList();
            if (mounted.Count == 0) return "none";
            return mounted.OrderByDescending(kv => kv.Value).First().Key;
        }
    }
}
