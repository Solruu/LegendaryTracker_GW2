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

        /// <summary>
        /// L'échantillonnage tourne sur le thread de jeu et l'affinage en
        /// tâche de fond : sans ce verrou, un point ajouté pendant un parcours
        /// de la liste fait tomber l'énumération.
        /// </summary>
        private readonly object _sync = new object();

        private readonly List<TracePoint> _points = new List<TracePoint>();
        private TracePoint _last;
        private int _currentSegment = 0;
        private bool _dirty = false;

        // -------------------------------------------------------------
        // Index spatial
        //
        // Sans lui, chaque tronçon relisait la totalité des points de trace,
        // deux fois (un sens chacun). Avec sept compositions par map, ça fait
        // des centaines de tronçons par passe : le coût devient proportionnel
        // à tout l'historique, pour ne retenir que les quelques points situés
        // près des deux arrêts.
        //
        // La grille range les points par cellule horizontale de CellSize
        // mètres. Chercher un arrêt, c'est alors regarder neuf cellules au
        // lieu de 400 000 points.
        // -------------------------------------------------------------
        private const double CellSize = 32.0;

        /// <summary>Position d'un point dans son segment, pour retrouver l'ordre de parcours.</summary>
        private struct Slot
        {
            public int Segment;
            public int Index;
        }

        private readonly Dictionary<(int Map, int Cx, int Cz), List<Slot>> _grid =
            new Dictionary<(int, int, int), List<Slot>>();
        private readonly Dictionary<int, List<TracePoint>> _bySegment =
            new Dictionary<int, List<TracePoint>>();
        private bool _indexDirty = true;

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
            lock (_sync) { return SampleLocked(mapId, x, y, z, mount, minStep, teleportThreshold); }
        }

        private bool SampleLocked(int mapId, double x, double y, double z, string mount,
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
            _indexDirty = true;

            if (_points.Count > MaxPoints)
            {
                _points.RemoveRange(0, _points.Count - MaxPoints);
                _indexDirty = true;
            }

            return true;
        }

        /// <summary>
        /// Oublie les points enregistrés autour d'un endroit de la map.
        /// Retourne le nombre de points supprimés.
        ///
        /// Les morceaux de segment qui subsistent de part et d'autre du trou
        /// reçoivent des identifiants distincts : sans ça, le point d'avant et
        /// le point d'après se retrouveraient consécutifs dans le même
        /// segment, et la recherche les relierait comme si le trajet avait été
        /// parcouru d'un trait.
        /// </summary>
        public int PurgeNear(int mapId, RoutePoint center, double radius)
        {
            lock (_sync)
            {
                var kept = new List<TracePoint>();
                int removed = 0;
                int nextSegment = _points.Count == 0 ? 0 : _points.Max(p => p.Segment);

                foreach (var group in _points.GroupBy(p => p.Segment))
                {
                    bool cut = false;
                    int currentSegment = group.Key;

                    foreach (var p in group)
                    {
                        bool drop = p.MapId == mapId
                                    && p.DistanceTo(center.X, center.Y, center.Z) <= radius;

                        if (drop) { removed++; cut = true; continue; }

                        if (cut)
                        {
                            currentSegment = ++nextSegment;
                            cut = false;
                        }

                        p.Segment = currentSegment;
                        kept.Add(p);
                    }
                }

                if (removed > 0)
                {
                    _points.Clear();
                    _points.AddRange(kept.OrderBy(p => p.RecordedAt, StringComparer.Ordinal));
                    _currentSegment = Math.Max(_currentSegment, nextSegment);
                    _last = null;          // on ne raccroche pas au trou
                    _dirty = true;
                    _indexDirty = true;
                }

                return removed;
            }
        }

        // -------------------------------------------------------------
        // Persistance
        // -------------------------------------------------------------

        public void Load(string path)
        {
            _points.Clear();
            _last = null;
            _currentSegment = 0;
            _indexDirty = true;

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
                string json;
                lock (_sync) { json = JsonConvert.SerializeObject(_points, Formatting.None); }
                File.WriteAllText(temp, json);
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
        /// Cherche, dans les traces de la map, le sous-trajet reliant
        /// <paramref name="from"/> et <paramref name="to"/> : dernière sortie
        /// du rayon d'accroche de l'un, première entrée dans celui de
        /// l'autre, sans jamais franchir une rupture de segment.
        ///
        /// La recherche se fait DANS LES DEUX SENS. Une route est une boucle
        /// orientée, mais Antoine ne farme pas en suivant son ordre : un
        /// tronçon parcouru à l'envers est le même chemin, et le refuser
        /// laissait des tronçons rouges alors qu'ils venaient d'être faits.
        /// Le trajet retour est simplement retourné avant d'être retenu.
        ///
        /// Départage : la trace la plus récente gagne, puis la plus courte.
        /// Un trajet plus de 4 fois plus long que la ligne droite est rejeté
        /// -- c'est une déambulation, pas un chemin.
        ///
        /// Retourne null si aucune trace ne couvre le tronçon : le tronçon
        /// reste alors en ligne droite et non vérifié.
        /// </summary>
        public TraceMatch FindLeg(int mapId, RoutePoint from, RoutePoint to,
                                  double snapRadius, double detourFactor)
        {
            lock (_sync) { return FindLegLocked(mapId, from, to, snapRadius, detourFactor); }
        }

        private TraceMatch FindLegLocked(int mapId, RoutePoint from, RoutePoint to,
                                         double snapRadius, double detourFactor)
        {
            if (_points.Count == 0) return null;

            // Deux nodes peuvent être voisins à vol d'oiseau et n'être reliés
            // que par un long détour -- une grotte, un passage sous l'eau. Le
            // facteur borne ce qu'on accepte comme chemin plutôt que comme
            // déambulation ; trop bas, ces accès-là ne se vérifient jamais.
            double maxAcceptable = from.DistanceTo(to) * detourFactor + 100.0;

            TraceMatch forward = FindOneWay(mapId, from, to, snapRadius, maxAcceptable);
            TraceMatch backward = FindOneWay(mapId, to, from, snapRadius, maxAcceptable);

            if (backward != null)
            {
                // Même chemin, lu dans l'autre sens.
                backward.Points = Enumerable.Reverse(backward.Points).ToList();
            }

            return IsBetter(forward, backward) ? forward : backward;
        }

        /// <summary>
        /// (Re)construit l'index : les points rangés par segment dans leur
        /// ordre de parcours, et une grille horizontale pointant vers eux.
        /// </summary>
        private void EnsureIndex()
        {
            if (!_indexDirty) return;

            _grid.Clear();
            _bySegment.Clear();

            foreach (var p in _points)
            {
                if (!_bySegment.TryGetValue(p.Segment, out var list))
                {
                    list = new List<TracePoint>();
                    _bySegment[p.Segment] = list;
                }

                var slot = new Slot { Segment = p.Segment, Index = list.Count };
                list.Add(p);

                var key = CellOf(p.MapId, p.X, p.Z);
                if (!_grid.TryGetValue(key, out var cell))
                {
                    cell = new List<Slot>();
                    _grid[key] = cell;
                }
                cell.Add(slot);
            }

            _indexDirty = false;
        }

        private static (int, int, int) CellOf(int mapId, double x, double z) =>
            (mapId, (int)Math.Floor(x / CellSize), (int)Math.Floor(z / CellSize));

        /// <summary>Points de la map situés dans le rayon donné autour de p, via la grille.</summary>
        private List<Slot> AnchorsNear(int mapId, RoutePoint p, double radius)
        {
            var found = new List<Slot>();

            int span = (int)Math.Ceiling(radius / CellSize);
            int cx = (int)Math.Floor(p.X / CellSize);
            int cz = (int)Math.Floor(p.Z / CellSize);

            for (int dx = -span; dx <= span; dx++)
            {
                for (int dz = -span; dz <= span; dz++)
                {
                    if (!_grid.TryGetValue((mapId, cx + dx, cz + dz), out var cell)) continue;

                    foreach (var slot in cell)
                    {
                        var pt = _bySegment[slot.Segment][slot.Index];
                        if (pt.DistanceTo(p.X, p.Y, p.Z) <= radius) found.Add(slot);
                    }
                }
            }

            return found;
        }

        /// <summary>Recherche dans un seul sens, de a vers b.</summary>
        private TraceMatch FindOneWay(int mapId, RoutePoint a, RoutePoint b,
                                      double snapRadius, double maxAcceptable)
        {
            EnsureIndex();

            var anchorsA = AnchorsNear(mapId, a, snapRadius);
            if (anchorsA.Count == 0) return null;

            var anchorsB = AnchorsNear(mapId, b, snapRadius);
            if (anchorsB.Count == 0) return null;

            var startsBySegment = anchorsA.GroupBy(sl => sl.Segment)
                                          .ToDictionary(g => g.Key,
                                                        g => g.Select(sl => sl.Index).OrderBy(i => i).ToList());

            TraceMatch best = null;

            foreach (var segGroup in anchorsB.GroupBy(sl => sl.Segment))
            {
                if (!startsBySegment.TryGetValue(segGroup.Key, out var starts)) continue;

                var points = _bySegment[segGroup.Key];
                int used = -1; // dernier départ déjà consommé

                foreach (int j in segGroup.Select(sl => sl.Index).OrderBy(i => i))
                {
                    // Dernier passage près de A strictement avant ce passage
                    // près de B, et pas déjà utilisé par une arrivée
                    // précédente : c'est le trajet le plus court possible
                    // entre les deux.
                    int i = -1;
                    foreach (int candidate in starts)
                    {
                        if (candidate >= j) break;
                        if (candidate > used) i = candidate;
                    }
                    if (i < 0) continue;

                    var slice = points.GetRange(i, j - i + 1);
                    double len = 0;
                    for (int k = 0; k + 1 < slice.Count; k++)
                        len += slice[k].DistanceTo(slice[k + 1]);

                    used = j;
                    if (len > maxAcceptable) continue;

                    var match = new TraceMatch
                    {
                        Points = slice,
                        Length = len,
                        RecordedAt = slice[slice.Count - 1].RecordedAt,
                        Mount = DominantMount(slice),
                    };

                    if (IsBetter(match, best)) best = match;
                }
            }

            return best;
        }

        private static bool IsBetter(TraceMatch candidate, TraceMatch current)
        {
            if (candidate == null) return false;
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
