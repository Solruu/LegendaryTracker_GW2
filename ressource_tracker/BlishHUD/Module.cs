using Blish_HUD;
using Blish_HUD.Controls;
using Blish_HUD.Input;
using Blish_HUD.Modules;
using Blish_HUD.Modules.Managers;
using Blish_HUD.Settings;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace GW2_NodeTracker
{
    [Export(typeof(Blish_HUD.Modules.Module))]
    public class Module : Blish_HUD.Modules.Module
    {
        private static readonly Logger Logger = Logger.GetLogger<Module>();

        // Rayon par défaut du "node le plus proche" (correction, suppression,
        // upsert à la capture). 3 m et non 5 : sur les clusters denses, 5 m
        // attrapait le voisin et corrigeait le mauvais node.
        private const float DefaultUpsertRadiusMeters = 3.0f;
        private const float MinUpsertRadiusMeters = 0.5f;
        private const float MaxUpsertRadiusMeters = 20.0f;
        private const double DeleteConfirmSeconds = 3.0;
        private const int ButtonHeight = 26;

        // Correction de chemin / routes
        private const double SampleIntervalMs = 200.0;        // 5 Hz -- suffisant à la vitesse de course
        private const double TraceSaveIntervalMs = 30000.0;   // écriture disque périodique
        private const double AutoRefineIntervalMs = 60000.0;  // réaffinage automatique des tronçons
        private const float DefaultSimplifyTolerance = 8.0f;
        private const float DefaultTraceMinStep = 3.0f;
        private const float DefaultTeleportThreshold = 50.0f;
        private const float DefaultRouteSnapRadius = 12.0f;
        private const double PurgeRadiusMeters = 30.0;   // rayon d'oubli des traces autour du joueur
        private const double LegPickRadiusMeters = 40.0; // au-delà, on considère qu'aucun tronçon n'est visé
        private const int PanelWidth = 260;
        private const int PanelMaxHeight = 600;
        private const int ScrollbarWidth = 20;

        #region Service Managers
        internal SettingsManager SettingsManager => this.ModuleParameters.SettingsManager;
        internal ContentsManager ContentsManager => this.ModuleParameters.ContentsManager;
        internal DirectoriesManager DirectoriesManager => this.ModuleParameters.DirectoriesManager;
        internal Gw2ApiManager Gw2ApiManager => this.ModuleParameters.Gw2ApiManager;
        #endregion

        #region Settings
        private SettingEntry<KeyBinding> _captureKey;
        private SettingEntry<KeyBinding> _cycleTypeKey;
        private SettingEntry<KeyBinding> _togglePanelKey;
        private SettingEntry<KeyBinding> _forceIconRefreshKey;
        private SettingEntry<KeyBinding> _correctKey;
        private SettingEntry<KeyBinding> _deleteKey;
        private SettingEntry<KeyBinding> _undoKey;
        private SettingEntry<float> _upsertRadius;
        private SettingEntry<bool> _autoUpsertOnCapture;
        private SettingEntry<string> _nodesFilePath;
        private SettingEntry<bool> _verboseNotifications;

        private SettingEntry<bool> _autoRegenerateTaco;
        private SettingEntry<string> _tacoOutputPath;
        private SettingEntry<string> _iconsFolderPath;

        private SettingEntry<bool> _pathCorrectionEnabled;
        private SettingEntry<KeyBinding> _buildRouteKey;
        private SettingEntry<KeyBinding> _refinePathKey;
        private SettingEntry<KeyBinding> _togglePathCorrectionKey;
        private SettingEntry<KeyBinding> _invalidateLegKey;
        private SettingEntry<KeyBinding> _purgeTracesKey;
        private SettingEntry<float> _simplifyTolerance;
        private SettingEntry<float> _traceMinStep;
        private SettingEntry<float> _traceTeleportThreshold;
        private SettingEntry<float> _routeSnapRadius;
        private SettingEntry<string> _tracesFilePath;
        private SettingEntry<string> _routesFilePath;
        #endregion

        private List<GatheredNode> _nodes = new List<GatheredNode>();
        private List<NodeType> _filteredTypes = new List<NodeType>();
        private NodeType? _selectedType = null;
        private int _lastKnownMapId = -1;
        private bool _nodesLoaded = false;

        private readonly TraceRecorder _traces = new TraceRecorder();
        private List<Route> _routes = new List<Route>();
        private double _sampleAccumMs = 0;
        private double _saveAccumMs = 0;
        private double _refineAccumMs = 0;
        private int _refineBusy = 0; // 0/1 via Interlocked -- un seul affinage à la fois

        // Annulation : un seul niveau, sur la dernière action destructrice
        // ou modificatrice. Suffit pour rattraper une fausse manip de touche.
        private enum LastActionKind { None, Added, Corrected, Deleted }
        private LastActionKind _lastActionKind = LastActionKind.None;
        private GatheredNode _lastActionNode;
        private string _prevType, _prevGroup, _prevLabel, _prevUpdatedAt;
        private int _lastDeletedIndex = -1;

        // Suppression : première pression = demande, seconde = exécution.
        private GatheredNode _pendingDelete;
        private DateTime _pendingDeleteAt = DateTime.MinValue;

        private Panel _selectionPanel;
        private bool _showingFullList = false;
        private readonly System.Collections.Concurrent.ConcurrentQueue<string> _pendingNotifications
            = new System.Collections.Concurrent.ConcurrentQueue<string>();

        // Empêche deux régénérations .taco de tourner en même temps --
        // sinon elles se marchent dessus sur le même fichier temporaire,
        // avec un résultat corrompu selon qui écrit en dernier.
        private readonly System.Threading.SemaphoreSlim _regenLock = new System.Threading.SemaphoreSlim(1, 1);

        [ImportingConstructor]
        public Module([Import("ModuleParameters")] ModuleParameters moduleParameters) : base(moduleParameters) { }

        protected override void DefineSettings(SettingCollection settings)
        {
            _captureKey = settings.DefineSetting(
                "CaptureKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.F12),
                () => "Capturer un node",
                () => "Enregistre un node du type sélectionné à ta position actuelle.");

            _cycleTypeKey = settings.DefineSetting(
                "CycleTypeKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.T),
                () => "Changer de type (cycle)",
                () => "Passe au type suivant dans la liste filtrée par map courante.");

            _togglePanelKey = settings.DefineSetting(
                "TogglePanelKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.L),
                () => "Afficher/masquer la liste",
                () => "Ouvre un panneau cliquable listant les types filtrés par map courante.");

            _forceIconRefreshKey = settings.DefineSetting(
                "ForceIconRefreshKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.F),
                () => "Forcer le re-téléchargement des icônes",
                () => "Re-télécharge TOUTES les icônes utilisées (pas seulement celles manquantes), même si le fichier existe déjà. Utile si une icône existante est fausse.");

            _correctKey = settings.DefineSetting(
                "CorrectKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.C),
                () => "Corriger le node le plus proche",
                () => "Applique le type sélectionné au node le plus proche dans le rayon, tous groupes confondus. Geste explicite : contrairement à la capture, ne crée jamais de node.");

            _deleteKey = settings.DefineSetting(
                "DeleteKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.S),
                () => "Supprimer le node le plus proche",
                () => "Deux pressions : la première demande confirmation, la seconde supprime. La demande expire au bout de 3 secondes.");

            _undoKey = settings.DefineSetting(
                "UndoKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.U),
                () => "Annuler la dernière action",
                () => "Annule le dernier ajout, la dernière correction ou la dernière suppression. Un seul niveau.");

            _upsertRadius = settings.DefineSetting(
                "UpsertRadiusMeters",
                DefaultUpsertRadiusMeters,
                () => "Rayon du node le plus proche (m)",
                () => "Distance en dessous de laquelle un node existant est considéré comme étant celui que tu vises. Baisse-le sur les clusters denses, monte-le si tu corriges de loin. Borné entre 0,5 et 20 m.");

            _autoUpsertOnCapture = settings.DefineSetting(
                "AutoUpsertOnCapture",
                true,
                () => "Réétiqueter au lieu d'ajouter (végétaux)",
                () => "À la capture, si un node végétal existe déjà dans le rayon, le réétiqueter au lieu d'en créer un second. Désactive-le si tu préfères piloter les corrections uniquement avec la touche dédiée.");

            _nodesFilePath = settings.DefineSetting(
                "NodesFilePath",
                "",
                () => "Chemin de gw2_nodes.json",
                () => "Chemin complet vers le fichier gw2_nodes.json partagé avec le reste du pipeline Python.");

            _verboseNotifications = settings.DefineSetting(
                "VerboseNotifications",
                false,
                () => "Notifications détaillées",
                () => "Affiche aussi les notifications de changement de map et de régénération .taco. Désactivé : seules la capture (F12) et le changement de type (T) restent visibles à l'écran.");

            var tacoSettings = settings.AddSubCollection("Régénération .taco", true, false);

            _autoRegenerateTaco = tacoSettings.DefineSetting(
                "AutoRegenerateTaco",
                true,
                () => "Régénérer le pack .taco après chaque capture",
                () => "Génère le .taco directement en C# (pas d'appel externe à Python), à partir du JSON relu sur disque -- pas de la copie en mémoire.");

            _tacoOutputPath = tacoSettings.DefineSetting(
                "TacoOutputPath",
                "",
                () => "Chemin de sortie du .taco",
                () => "Chemin complet vers le .taco à écraser à chaque régénération -- typiquement dans Documents\\Guild Wars 2\\addons\\blishhud\\markers\\.");

            _iconsFolderPath = tacoSettings.DefineSetting(
                "IconsFolderPath",
                "",
                () => "Dossier icons/",
                () => "Chemin complet vers le dossier icons/ produit par gw2_fetch_icons_v4.py.");

            var routeSettings = settings.AddSubCollection("Routes et correction de chemin", true, false);

            _pathCorrectionEnabled = routeSettings.DefineSetting(
                "PathCorrectionEnabled",
                false,
                () => "Correction de chemin active",
                () => "Enregistre ton déplacement et remplace les lignes droites des routes par le trajet réellement parcouru. Désactivé : rien n'est enregistré, les routes existantes restent telles quelles. Coupe-le dès que tu ne fais pas une route, sinon tu enregistres n'importe quoi.");

            _buildRouteKey = routeSettings.DefineSetting(
                "BuildRouteKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.R),
                () => "Construire les routes de la map",
                () => "(Re)calcule l'ordre de passage pour chaque groupe présent sur la map courante, puis applique les chemins connus. Écrase les routes existantes de cette map -- les traces, elles, ne sont jamais perdues.");

            _togglePathCorrectionKey = routeSettings.DefineSetting(
                "TogglePathCorrectionKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.O),
                () => "Correction de chemin : activer/désactiver",
                () => "Bascule le réglage ci-dessus sans passer par le menu. Coupe le segment en cours à l'extinction et écrit les traces sur disque immédiatement.");

            _refinePathKey = routeSettings.DefineSetting(
                "RefinePathKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.V),
                () => "Appliquer les chemins parcourus",
                () => "Force tout de suite la reprise des tronçons par le trajet réellement parcouru, sans attendre la passe automatique. Ne touche jamais à l'ordre de passage, contrairement à la construction.");

            _invalidateLegKey = routeSettings.DefineSetting(
                "InvalidateLegKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.X),
                () => "Rejeter le tronçon où je me tiens",
                () => "Remet en ligne droite le tronçon le plus proche et refuse la trace qui l'avait produit. Seul un passage PLUS RÉCENT pourra le revérifier : refais le trajet correctement juste après.");

            _purgeTracesKey = routeSettings.DefineSetting(
                "PurgeTracesKey2",
                new KeyBinding(ModifierKeys.Ctrl | ModifierKeys.Alt, Keys.K),
                () => "Oublier les traces autour de moi",
                () => "Supprime les points enregistrés dans un rayon de 30 m. À utiliser quand un passage a été fait n'importe comment (chute, skyscale, détour) : le reste de l'historique n'est pas touché.");

            _simplifyTolerance = routeSettings.DefineSetting(
                "SimplifyToleranceMeters",
                DefaultSimplifyTolerance,
                () => "Tolérance de simplification (m)",
                () => "Écart maximal garanti entre ton trajet réel et le tracé affiché. 8 m est un compromis : plus haut, le tracé coupe les virages et peut passer dans le vide sur une corniche ; plus bas, il garde plus de points.");

            _traceMinStep = routeSettings.DefineSetting(
                "TraceMinStepMeters",
                DefaultTraceMinStep,
                () => "Pas minimum entre deux points (m)",
                () => "En dessous, l'échantillon est ignoré. Évite d'enregistrer des milliers de points en restant immobile.");

            _traceTeleportThreshold = routeSettings.DefineSetting(
                "TeleportThresholdMeters",
                DefaultTeleportThreshold,
                () => "Seuil de téléportation (m)",
                () => "Écart entre deux échantillons au-delà duquel on considère que tu n'as pas parcouru la distance (waypoint, écran de chargement) : la trace est coupée et les deux points ne seront jamais reliés.");

            _routeSnapRadius = routeSettings.DefineSetting(
                "RouteSnapRadiusMeters",
                DefaultRouteSnapRadius,
                () => "Rayon d'accroche node/trace (m)",
                () => "Distance en dessous de laquelle un point de trace compte comme un passage sur un node. Trop petit, aucun tronçon ne se vérifie ; trop grand, des tronçons se vérifient avec un trajet qui ne passait pas vraiment par le node.");

            _tracesFilePath = routeSettings.DefineSetting(
                "TracesFilePath",
                "",
                () => "Chemin de gw2_traces.json",
                () => "Fichier des déplacements enregistrés. Distinct de gw2_nodes.json : un node est un gisement, une trace est un passage.");

            _routesFilePath = routeSettings.DefineSetting(
                "RoutesFilePath",
                "",
                () => "Chemin de gw2_routes.json",
                () => "Fichier des routes calculées (ordre de passage + géométrie des tronçons).");
        }

        protected override void Initialize()
        {
            _captureKey.Value.Enabled = true;
            _captureKey.Value.Activated += OnCaptureKeyActivated;

            _cycleTypeKey.Value.Enabled = true;
            _cycleTypeKey.Value.Activated += OnCycleTypeKeyActivated;

            _togglePanelKey.Value.Enabled = true;
            _togglePanelKey.Value.Activated += OnTogglePanelKeyActivated;

            _forceIconRefreshKey.Value.Enabled = true;
            _forceIconRefreshKey.Value.Activated += OnForceIconRefreshKeyActivated;

            _correctKey.Value.Enabled = true;
            _correctKey.Value.Activated += OnCorrectKeyActivated;

            _deleteKey.Value.Enabled = true;
            _deleteKey.Value.Activated += OnDeleteKeyActivated;

            _undoKey.Value.Enabled = true;
            _undoKey.Value.Activated += OnUndoKeyActivated;

            _buildRouteKey.Value.Enabled = true;
            _buildRouteKey.Value.Activated += OnBuildRouteKeyActivated;

            _refinePathKey.Value.Enabled = true;
            _refinePathKey.Value.Activated += OnRefinePathKeyActivated;

            _togglePathCorrectionKey.Value.Enabled = true;
            _togglePathCorrectionKey.Value.Activated += OnTogglePathCorrectionKeyActivated;

            _invalidateLegKey.Value.Enabled = true;
            _invalidateLegKey.Value.Activated += OnInvalidateLegKeyActivated;

            _purgeTracesKey.Value.Enabled = true;
            _purgeTracesKey.Value.Activated += OnPurgeTracesKeyActivated;
        }

        protected override async Task LoadAsync()
        {
            await LoadNodesAsync();
            _traces.Load(CleanPath(_tracesFilePath.Value));
            _routes = RouteBuilder.Load(CleanPath(_routesFilePath.Value));
            _nodesLoaded = true; // débloque Update() -- évite la course avec le premier changement de map détecté

            // Passe de précaution au démarrage : régénère le .taco et va
            // chercher les icônes manquantes historiques, même si aucune
            // capture n'a lieu cette session -- le .taco doit refléter le
            // JSON existant dès le chargement, pas seulement après un F12.
            TriggerTacoRegeneration();
        }

        protected override void OnModuleLoaded(EventArgs e)
        {
            base.OnModuleLoaded(e);
        }

        protected override void Update(GameTime gameTime)
        {
            // Vide les notifications mises en file depuis un thread d'arrière-plan
            // (régénération .taco) -- ShowNotification doit rester appelée
            // depuis le thread principal uniquement.
            while (_pendingNotifications.TryDequeue(out string pending))
                ShowNotification(pending);

            if (!_nodesLoaded) return;

            int currentMapId = GameService.Gw2Mumble.CurrentMap.Id;
            if (currentMapId != _lastKnownMapId)
            {
                _lastKnownMapId = currentMapId;
                RefreshFilteredTypes(currentMapId);
                _traces.CutSegment(); // on ne relie jamais deux maps
            }

            UpdatePathCorrection(gameTime, currentMapId);
        }

        // -------------------------------------------------------------
        // Enregistrement du déplacement -- entièrement conditionné au
        // réglage "Correction de chemin active". Coupé, ce bloc ne fait
        // rien du tout : pas d'échantillon, pas d'écriture, pas
        // d'affinage. Les routes déjà calculées restent affichées telles
        // quelles.
        // -------------------------------------------------------------
        private void UpdatePathCorrection(GameTime gameTime, int mapId)
        {
            if (!_pathCorrectionEnabled.Value)
            {
                _traces.CutSegment(); // reprise = nouveau segment, jamais de raccord
                return;
            }

            if (!GameService.GameIntegration.Gw2Instance.IsInGame) return;

            double elapsed = gameTime.ElapsedGameTime.TotalMilliseconds;
            _sampleAccumMs += elapsed;
            _saveAccumMs += elapsed;
            _refineAccumMs += elapsed;

            if (_sampleAccumMs >= SampleIntervalMs)
            {
                _sampleAccumMs = 0;

                Vector3 pos = GameService.Gw2Mumble.PlayerCharacter.Position;
                string mount = GameService.Gw2Mumble.PlayerCharacter.CurrentMount.ToString();

                // Même remappage qu'à la capture : y = altitude.
                _traces.Sample(mapId, pos.X, pos.Z, pos.Y, mount,
                               _traceMinStep.Value, _traceTeleportThreshold.Value);
            }

            if (_saveAccumMs >= TraceSaveIntervalMs)
            {
                _saveAccumMs = 0;
                if (_traces.Dirty)
                {
                    string path = CleanPath(_tracesFilePath.Value);
                    Task.Run(() => _traces.Save(path));
                }
            }

            if (_refineAccumMs >= AutoRefineIntervalMs)
            {
                _refineAccumMs = 0;
                TriggerRefine(mapId, notify: true);
            }
        }

        protected override void Unload()
        {
            if (_captureKey?.Value != null)
                _captureKey.Value.Activated -= OnCaptureKeyActivated;
            if (_cycleTypeKey?.Value != null)
                _cycleTypeKey.Value.Activated -= OnCycleTypeKeyActivated;
            if (_togglePanelKey?.Value != null)
                _togglePanelKey.Value.Activated -= OnTogglePanelKeyActivated;
            if (_forceIconRefreshKey?.Value != null)
                _forceIconRefreshKey.Value.Activated -= OnForceIconRefreshKeyActivated;
            if (_correctKey?.Value != null)
                _correctKey.Value.Activated -= OnCorrectKeyActivated;
            if (_deleteKey?.Value != null)
                _deleteKey.Value.Activated -= OnDeleteKeyActivated;
            if (_undoKey?.Value != null)
                _undoKey.Value.Activated -= OnUndoKeyActivated;
            if (_buildRouteKey?.Value != null)
                _buildRouteKey.Value.Activated -= OnBuildRouteKeyActivated;
            if (_refinePathKey?.Value != null)
                _refinePathKey.Value.Activated -= OnRefinePathKeyActivated;
            if (_togglePathCorrectionKey?.Value != null)
                _togglePathCorrectionKey.Value.Activated -= OnTogglePathCorrectionKeyActivated;
            if (_invalidateLegKey?.Value != null)
                _invalidateLegKey.Value.Activated -= OnInvalidateLegKeyActivated;
            if (_purgeTracesKey?.Value != null)
                _purgeTracesKey.Value.Activated -= OnPurgeTracesKeyActivated;

            // Dernière écriture avant déchargement -- sinon jusqu'à 30 s de
            // déplacement enregistré seraient perdues.
            if (_traces.Dirty)
                _traces.Save(CleanPath(_tracesFilePath.Value));

            _selectionPanel?.Dispose();
            _selectionPanel = null;
        }

        // -------------------------------------------------------------
        // Nettoyage des chemins -- un copier "en tant que chemin d'accès"
        // depuis l'explorateur Windows entoure le résultat de guillemets,
        // qui atterrissent tels quels dans un champ de settings texte brut.
        // -------------------------------------------------------------
        private static string CleanPath(string raw) => raw?.Trim().Trim('"');

        // -------------------------------------------------------------
        // Chargement / sauvegarde JSON -- même schéma que le pipeline Python
        // -------------------------------------------------------------
        private async Task LoadNodesAsync()
        {
            string path = CleanPath(_nodesFilePath.Value);

            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
            {
                Logger.Warn("NodesFilePath non défini ou introuvable ({0}) -- démarrage avec une liste vide.", path);
                _nodes = new List<GatheredNode>();
                return;
            }

            try
            {
                string json = await Task.Run(() => File.ReadAllText(path));
                _nodes = JsonConvert.DeserializeObject<List<GatheredNode>>(json) ?? new List<GatheredNode>();
                Logger.Info("{0} nodes chargés depuis {1}.", _nodes.Count, path);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Échec du chargement de {0}", path);
                _nodes = new List<GatheredNode>();
            }
        }

        private void SaveNodes()
        {
            string path = CleanPath(_nodesFilePath.Value);

            if (string.IsNullOrWhiteSpace(path))
            {
                Logger.Warn("NodesFilePath non défini -- capture non sauvegardée.");
                return;
            }

            try
            {
                string json = JsonConvert.SerializeObject(_nodes, Formatting.Indented);
                File.WriteAllText(path, json);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Échec de l'écriture de {0}", path);
            }
        }

        // -------------------------------------------------------------
        // Régénération du .taco -- toujours depuis une relecture fraîche
        // du JSON sur disque, JAMAIS depuis _nodes en mémoire seule.
        // Si un autre outil (l'ancien script Python, une édition manuelle)
        // a écrit dans le même fichier entre-temps, on doit refléter TOUT
        // son contenu, pas seulement ce que ce module connaît en RAM.
        // Tâche de fond, ne bloque jamais la capture.
        // -------------------------------------------------------------
        private void TriggerTacoRegeneration()
        {
            if (!_autoRegenerateTaco.Value) return;

            string nodesPath = CleanPath(_nodesFilePath.Value);
            string output = CleanPath(_tacoOutputPath.Value);
            string iconsDir = CleanPath(_iconsFolderPath.Value);

            if (string.IsNullOrWhiteSpace(output))
            {
                Logger.Warn("TacoOutputPath non défini -- régénération ignorée.");
                return;
            }
            if (string.IsNullOrWhiteSpace(nodesPath) || !File.Exists(nodesPath))
            {
                Logger.Warn("NodesFilePath introuvable ({0}) -- régénération ignorée.", nodesPath);
                return;
            }

            Task.Run(async () =>
            {
                await _regenLock.WaitAsync(); // une seule régénération à la fois
                try
                {
                    // Relecture fraîche depuis le disque, indépendante de _nodes.
                    // Idem pour les routes : le pack doit refléter le disque.
                    List<Route> freshRoutes = RouteBuilder.Load(CleanPath(_routesFilePath.Value));
                    string json = File.ReadAllText(nodesPath);
                    List<GatheredNode> freshNodes = JsonConvert.DeserializeObject<List<GatheredNode>>(json)
                                                     ?? new List<GatheredNode>();

                    if (freshNodes.Count == 0)
                    {
                        Logger.Warn("Aucun node dans {0} -- régénération ignorée.", nodesPath);
                        return;
                    }

                    var (foundIcons, missing) = TacoGenerator.Generate(freshNodes, output, iconsDir, freshRoutes);

                    Logger.Info(
                        "Pack .taco régénéré : {0} nodes, {1} icônes trouvées, {2} manquantes.",
                        freshNodes.Count, foundIcons, missing.Count);

                    if (missing.Count > 0)
                    {
                        Logger.Debug("Icônes manquantes : {0}", string.Join(", ", missing));

                        int fetched = await IconFetcher.FetchMissingAsync(missing, iconsDir);
                        if (fetched > 0)
                        {
                            // Icônes obtenues -- deuxième passe pour les inclure sans attendre
                            // la prochaine capture.
                            var (foundIcons2, stillMissing2) = TacoGenerator.Generate(freshNodes, output, iconsDir, freshRoutes);
                            if (_verboseNotifications.Value)
                                _pendingNotifications.Enqueue(
                                    $"📦 .taco régénéré ({freshNodes.Count} nodes, {foundIcons2} icônes, {fetched} icône(s) téléchargée(s))");
                            if (stillMissing2.Count > 0)
                                Logger.Debug("Toujours manquantes après téléchargement : {0}", string.Join(", ", stillMissing2));
                            return;
                        }
                    }

                    if (_verboseNotifications.Value)
                        _pendingNotifications.Enqueue($"📦 .taco régénéré ({freshNodes.Count} nodes, {foundIcons} icônes)");
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "Échec de la régénération du .taco");
                    _pendingNotifications.Enqueue($"⚠️ Échec régénération .taco : {ex.Message}");
                }
                finally
                {
                    _regenLock.Release();
                }
            });
        }

        // -------------------------------------------------------------
        // Filtrage du menu par map courante -- port de types_known_on_map()
        // -------------------------------------------------------------
        private void RefreshFilteredTypes(int mapId, bool resetSelection = true)
        {
            List<GatheredNode> onThisMap = _nodes.Where(n => n.MapId == mapId).ToList();
            HashSet<string> knownSlugs = onThisMap.Select(n => n.Type).ToHashSet();

            _filteredTypes = knownSlugs.Count > 0
                ? NodeType.All.Where(t => knownSlugs.Contains(t.Slug)).ToList()
                : NodeType.All.ToList(); // map neuve -> liste complète, comme en Python

            if (resetSelection)
            {
                // Vrai changement de map : nouvelle sélection par défaut, repart en mode filtré.
                _selectedType = _filteredTypes.Count > 0 ? _filteredTypes[0] : (NodeType?)null;
                _showingFullList = false;
            }
            else
            {
                // Rafraîchissement après capture, même map : on garde la sélection en
                // cours si elle est toujours valide -- sinon seulement, repli sur le
                // premier élément.
                bool stillValid = _selectedType.HasValue
                    && _filteredTypes.Any(t => t.Slug == _selectedType.Value.Slug);
                if (!stillValid)
                    _selectedType = _filteredTypes.Count > 0 ? _filteredTypes[0] : (NodeType?)null;
            }

            RebuildSelectionPanel();

            if (resetSelection && _selectedType.HasValue && _verboseNotifications.Value)
            {
                ShowNotification($"[{_selectedType.Value.Label}] ({_filteredTypes.Count}/{NodeType.All.Length} types sur cette map)");
            }
        }

        // -------------------------------------------------------------
        // Panneau cliquable -- reconstruit à chaque changement de map,
        // et à chaque bascule filtré/liste complète.
        // -------------------------------------------------------------
        private void RebuildSelectionPanel()
        {
            bool wasVisible = _selectionPanel?.Visible ?? false;
            _selectionPanel?.Dispose();

            List<NodeType> displayList = _showingFullList ? NodeType.All.ToList() : _filteredTypes;

            // Compte les en-têtes de groupe nécessaires (un par groupe distinct
            // présent dans la liste) pour dimensionner le panneau correctement.
            int groupHeaderCount = displayList.Select(t => t.Group).Distinct().Count();

            int headerRows = 2; // Fermer + bascule filtré/complet
            int totalRows = headerRows + groupHeaderCount + displayList.Count;
            int contentHeight = totalRows * ButtonHeight + 10;

            _selectionPanel = new Panel
            {
                Parent = GameService.Graphics.SpriteScreen,
                Size = new Point(PanelWidth, PanelMaxHeight),
                Location = new Point(100, 150),
                Title = "GW2 Node Tracker",
                ShowBorder = true,
                CanScroll = true,
                Visible = wasVisible,
            };

            // La barre de titre et la bordure ne font pas partie de la zone
            // utile : ContentRegion est plus petit que Size. Dimensionner le
            // panneau sur la hauteur du contenu sans en tenir compte coupait
            // les dernières lignes et faisait apparaître un ascenseur alors
            // que tout aurait dû tenir. On mesure l'écart plutôt que de le
            // deviner -- si Blish renvoie un ContentRegion égal à Size, les
            // écarts valent zéro et le comportement reste l'ancien.
            int chromeY = Math.Max(0, _selectionPanel.Size.Y - _selectionPanel.ContentRegion.Height);
            int chromeX = Math.Max(0, _selectionPanel.Size.X - _selectionPanel.ContentRegion.Width);

            int visibleHeight = Math.Min(contentHeight, PanelMaxHeight - chromeY);
            bool willScroll = contentHeight > visibleHeight;

            _selectionPanel.Size = new Point(PanelWidth + chromeX, visibleHeight + chromeY);

            // Quand l'ascenseur est là, il mord sur la droite de la zone
            // utile : les boutons pleine largeur passaient dessous.
            int buttonWidth = PanelWidth - 20 - (willScroll ? ScrollbarWidth : 0);

            var closeButton = new StandardButton
            {
                Text = "✕ Fermer",
                Size = new Point(buttonWidth, ButtonHeight - 2),
                Location = new Point(10, 5),
                Parent = _selectionPanel,
            };
            closeButton.Click += (s, e) => { _selectionPanel.Visible = false; };

            var toggleButton = new StandardButton
            {
                Text = _showingFullList
                    ? $"↩ Revenir au filtre ({_filteredTypes.Count})"
                    : $"⊞ Voir tout ({NodeType.All.Length})",
                Size = new Point(buttonWidth, ButtonHeight - 2),
                Location = new Point(10, ButtonHeight + 5),
                Parent = _selectionPanel,
            };
            toggleButton.Click += (s, e) =>
            {
                _showingFullList = !_showingFullList;
                RebuildSelectionPanel();
                _selectionPanel.Visible = true;
            };

            int row = headerRows;
            string lastGroup = null;

            for (int i = 0; i < displayList.Count; i++)
            {
                NodeType type = displayList[i];

                if (type.Group != lastGroup)
                {
                    lastGroup = type.Group;
                    var groupHeader = new StandardButton
                    {
                        Text = $"── {type.Group.ToUpperInvariant()} ──",
                        Size = new Point(buttonWidth, ButtonHeight - 2),
                        Location = new Point(10, row * ButtonHeight + 5),
                        Parent = _selectionPanel,
                        Enabled = false, // en-tête, pas un vrai bouton
                    };
                    row++;
                }

                string tag = type.Rand ? " [variable]" : "";

                var button = new StandardButton
                {
                    Text = $"{type.Label}{tag}",
                    Size = new Point(buttonWidth, ButtonHeight - 2),
                    Location = new Point(10, row * ButtonHeight + 5),
                    Parent = _selectionPanel,
                };
                row++;

                NodeType capturedType = type; // capture correcte dans la closure
                button.Click += (s, e) =>
                {
                    _selectedType = capturedType;
                    // Un type choisi depuis "voir tout" et pas encore dans le
                    // filtre de cette map rejoint le filtre -- disponible
                    // tout de suite au cycle (T) sans repasser par "voir tout".
                    if (!_filteredTypes.Any(t => t.Slug == capturedType.Slug))
                        _filteredTypes.Add(capturedType);

                    _selectionPanel.Visible = false;
                    ShowNotification($"{capturedType.Label} sélectionné.");
                };
            }
        }

        private void OnTogglePanelKeyActivated(object sender, EventArgs e)
        {
            if (_selectionPanel == null) RebuildSelectionPanel();
            _selectionPanel.Visible = !_selectionPanel.Visible;
        }

        private void OnForceIconRefreshKeyActivated(object sender, EventArgs e)
        {
            string nodesPath = CleanPath(_nodesFilePath.Value);
            string output = CleanPath(_tacoOutputPath.Value);
            string iconsDir = CleanPath(_iconsFolderPath.Value);

            if (string.IsNullOrWhiteSpace(iconsDir) || string.IsNullOrWhiteSpace(nodesPath) || !File.Exists(nodesPath))
            {
                _pendingNotifications.Enqueue("⚠️ Chemins non configurés -- impossible de forcer le refresh.");
                return;
            }

            _pendingNotifications.Enqueue("🔄 Re-téléchargement forcé de toutes les icônes en cours...");

            Task.Run(async () =>
            {
                await _regenLock.WaitAsync();
                try
                {
                    string json = File.ReadAllText(nodesPath);
                    List<GatheredNode> freshNodes = JsonConvert.DeserializeObject<List<GatheredNode>>(json)
                                                     ?? new List<GatheredNode>();
                    if (freshNodes.Count == 0) return;

                    List<string> usedSlugs = freshNodes.Select(n => n.Type).Distinct().ToList();
                    int fetched = await IconFetcher.FetchMissingAsync(usedSlugs, iconsDir, force: true);

                    // Les routes repassent aussi : sans elles, le refresh forcé
                    // des icônes retirerait les trails du pack.
                    List<Route> freshRoutes = RouteBuilder.Load(CleanPath(_routesFilePath.Value));
                    var (foundIcons, missing) = TacoGenerator.Generate(freshNodes, output, iconsDir, freshRoutes);
                    _pendingNotifications.Enqueue(
                        $"📦 Refresh forcé terminé : {fetched} icône(s) re-téléchargée(s), {foundIcons} au total, {missing.Count} toujours manquantes.");
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "Échec du refresh forcé des icônes");
                    _pendingNotifications.Enqueue($"⚠️ Échec du refresh forcé : {ex.Message}");
                }
                finally
                {
                    _regenLock.Release();
                }
            });
        }

        // -------------------------------------------------------------
        // Handlers touches
        // -------------------------------------------------------------
        private void OnCycleTypeKeyActivated(object sender, EventArgs e)
        {
            if (_filteredTypes.Count == 0) return;

            int currentIdx = _selectedType.HasValue
                ? _filteredTypes.FindIndex(t => t.Slug == _selectedType.Value.Slug)
                : -1;
            int nextIdx = (currentIdx + 1) % _filteredTypes.Count;

            _selectedType = _filteredTypes[nextIdx];
            string tag = _selectedType.Value.Rand ? " [variable]" : "";
            ShowNotification($"{_selectedType.Value.Label}{tag}  ({_selectedType.Value.Group})");
        }

        private void OnCaptureKeyActivated(object sender, EventArgs e)
        {
            if (!GameService.GameIntegration.Gw2Instance.IsInGame || GameService.Gw2Mumble.UI.IsMapOpen)
            {
                Logger.Debug("Capture ignorée -- pas en jeu ou carte plein écran ouverte.");
                return;
            }

            if (!_selectedType.HasValue)
            {
                ShowNotification("Aucun type sélectionné.");
                return;
            }

            NodeType selected = _selectedType.Value;
            int mapId = GameService.Gw2Mumble.CurrentMap.Id;

            // Confirmé par compilation contre BlishHUD 1.3.0 (03/09/2026).
            Vector3 pos = GameService.Gw2Mumble.PlayerCharacter.Position;

            GatheredNode nearby = null;
            if (_autoUpsertOnCapture.Value && selected.Group == "Vegetal")
                nearby = NearestNode(mapId, pos, n => n.Group == "Vegetal");

            if (nearby != null)
            {
                string oldLabel = nearby.Label;
                RememberCorrection(nearby);
                nearby.Type = selected.Slug;
                nearby.Group = selected.Group;
                nearby.Label = selected.Label;
                nearby.UpdatedAt = DateTime.Now.ToString("o");
                ShowNotification($"🔄 [{oldLabel}] → [{selected.Label}]");
            }
            else
            {
                var added = new GatheredNode
                {
                    Type = selected.Slug,
                    Group = selected.Group,
                    Label = selected.Label,
                    MapId = mapId,
                    // GameService.Gw2Mumble.PlayerCharacter.Position a Z = altitude
                    // (confirmé par comparaison jeu/JSON le 10/09/2026), pas Y --
                    // on remappe ici pour que Y du JSON reste bien l'altitude,
                    // cohérent avec gw2_nodes.json et TacO (ypos=altitude).
                    X = Math.Round(pos.X, 4),
                    Y = Math.Round(pos.Z, 4),
                    Z = Math.Round(pos.Y, 4),
                    CapturedAt = DateTime.Now.ToString("o"),
                };
                _nodes.Add(added);
                InsertIntoRoutes(added);
                _lastActionKind = LastActionKind.Added;
                _lastActionNode = added;
                ShowNotification($"✅ [{selected.Label}]  (total: {_nodes.Count})");
            }

            SaveNodes();
            TriggerTacoRegeneration(); // relit le disque, pas _nodes -- cf. commentaire de la méthode
            RefreshFilteredTypes(mapId, resetSelection: false); // le nouveau type capturé doit apparaître dans le filtre tout de suite,
                                                                // pas seulement au prochain changement de map
        }

        // -------------------------------------------------------------
        // Correction / suppression / annulation
        // -------------------------------------------------------------

        /// <summary>Rayon courant, borné -- le champ de settings est libre.</summary>
        private float CurrentRadius =>
            Math.Min(MaxUpsertRadiusMeters, Math.Max(MinUpsertRadiusMeters, _upsertRadius.Value));

        /// <summary>
        /// Node le plus proche de pos sur la map courante, dans le rayon.
        /// filter null = tous groupes confondus.
        /// </summary>
        private GatheredNode NearestNode(int mapId, Vector3 pos, Func<GatheredNode, bool> filter = null)
        {
            double radius = CurrentRadius;
            return _nodes
                .Where(n => n.MapId == mapId && (filter == null || filter(n)))
                .OrderBy(n => n.DistanceTo(pos.X, pos.Z, pos.Y))
                .FirstOrDefault(n => n.DistanceTo(pos.X, pos.Z, pos.Y) < radius);
        }

        private bool CanAct()
        {
            if (!GameService.GameIntegration.Gw2Instance.IsInGame || GameService.Gw2Mumble.UI.IsMapOpen)
            {
                Logger.Debug("Action ignorée -- pas en jeu ou carte plein écran ouverte.");
                return false;
            }
            return true;
        }

        private void RememberCorrection(GatheredNode n)
        {
            _lastActionKind = LastActionKind.Corrected;
            _lastActionNode = n;
            _prevType = n.Type;
            _prevGroup = n.Group;
            _prevLabel = n.Label;
            _prevUpdatedAt = n.UpdatedAt;
        }

        /// <summary>Écrit sur disque, régénère le pack et rafraîchit le filtre.</summary>
        private void PersistAndRefresh(int mapId)
        {
            SaveNodes();
            TriggerTacoRegeneration();
            RefreshFilteredTypes(mapId, resetSelection: false);
        }

        private void OnCorrectKeyActivated(object sender, EventArgs e)
        {
            if (!CanAct()) return;

            if (!_selectedType.HasValue)
            {
                ShowNotification("Aucun type sélectionné.");
                return;
            }

            NodeType selected = _selectedType.Value;
            int mapId = GameService.Gw2Mumble.CurrentMap.Id;
            Vector3 pos = GameService.Gw2Mumble.PlayerCharacter.Position;

            // Tous groupes confondus : l'intention est explicite, contrairement
            // à l'upsert de la capture qui reste limité aux végétaux.
            GatheredNode target = NearestNode(mapId, pos);
            if (target == null)
            {
                ShowNotification($"Aucun node à moins de {CurrentRadius:0.#} m.");
                return;
            }

            if (target.Type == selected.Slug)
            {
                ShowNotification($"Déjà [{selected.Label}], rien à corriger.");
                return;
            }

            string oldLabel = target.Label;
            RememberCorrection(target);
            target.Type = selected.Slug;
            target.Group = selected.Group;
            target.Label = selected.Label;
            target.UpdatedAt = DateTime.Now.ToString("o");

            ShowNotification($"🔄 [{oldLabel}] → [{selected.Label}]");
            PersistAndRefresh(mapId);
        }

        private void OnDeleteKeyActivated(object sender, EventArgs e)
        {
            if (!CanAct()) return;

            int mapId = GameService.Gw2Mumble.CurrentMap.Id;
            Vector3 pos = GameService.Gw2Mumble.PlayerCharacter.Position;

            GatheredNode target = NearestNode(mapId, pos);
            if (target == null)
            {
                ShowNotification($"Aucun node à moins de {CurrentRadius:0.#} m.");
                _pendingDelete = null;
                return;
            }

            bool confirmed = ReferenceEquals(_pendingDelete, target)
                && (DateTime.Now - _pendingDeleteAt).TotalSeconds <= DeleteConfirmSeconds;

            if (!confirmed)
            {
                _pendingDelete = target;
                _pendingDeleteAt = DateTime.Now;
                ShowNotification($"⚠️ Supprimer [{target.Label}] ? Appuie à nouveau sous {DeleteConfirmSeconds:0} s.");
                return;
            }

            _lastDeletedIndex = _nodes.IndexOf(target);
            _nodes.Remove(target);
            RemoveFromRoutes(target);
            _lastActionKind = LastActionKind.Deleted;
            _lastActionNode = target;
            _pendingDelete = null;

            ShowNotification($"🗑️ [{target.Label}] supprimé  (total: {_nodes.Count})");
            PersistAndRefresh(mapId);
        }

        private void OnUndoKeyActivated(object sender, EventArgs e)
        {
            if (!CanAct()) return;

            if (_lastActionKind == LastActionKind.None || _lastActionNode == null)
            {
                ShowNotification("Rien à annuler.");
                return;
            }

            int mapId = GameService.Gw2Mumble.CurrentMap.Id;
            string label = _lastActionNode.Label;

            switch (_lastActionKind)
            {
                case LastActionKind.Added:
                    _nodes.Remove(_lastActionNode);
                    RemoveFromRoutes(_lastActionNode);
                    ShowNotification($"↩️ Ajout annulé : [{label}] retiré  (total: {_nodes.Count})");
                    break;

                case LastActionKind.Corrected:
                    _lastActionNode.Type = _prevType;
                    _lastActionNode.Group = _prevGroup;
                    _lastActionNode.Label = _prevLabel;
                    _lastActionNode.UpdatedAt = _prevUpdatedAt;
                    ShowNotification($"↩️ Correction annulée : [{label}] → [{_prevLabel}]");
                    break;

                case LastActionKind.Deleted:
                    // Réinsertion à sa place d'origine quand elle est encore
                    // valide -- l'ordre du JSON reste ainsi inchangé.
                    if (_lastDeletedIndex >= 0 && _lastDeletedIndex <= _nodes.Count)
                        _nodes.Insert(_lastDeletedIndex, _lastActionNode);
                    else
                        _nodes.Add(_lastActionNode);
                    InsertIntoRoutes(_lastActionNode);
                    ShowNotification($"↩️ Suppression annulée : [{label}] restauré  (total: {_nodes.Count})");
                    break;
            }

            _lastActionKind = LastActionKind.None;
            _lastActionNode = null;
            _lastDeletedIndex = -1;
            _pendingDelete = null;

            PersistAndRefresh(mapId);
        }

        // -------------------------------------------------------------
        // Routes
        // -------------------------------------------------------------

        /// <summary>
        /// Toutes les routes de la map qui couvrent ce groupe. Un node bois
        /// appartient à la route Bois, à Minerai+Bois, à Bois+Vegetal et à la
        /// route complète : il doit entrer dans les quatre.
        /// </summary>
        private List<Route> RoutesCovering(int mapId, string group) =>
            _routes.Where(r => r.MapId == mapId && r.Covers(group)).ToList();

        private void SaveRoutes() => RouteBuilder.Save(_routes, CleanPath(_routesFilePath.Value));

        /// <summary>
        /// Un node vient d'être créé : s'il existe déjà une route pour sa map
        /// et son groupe, il s'y insère au moindre détour plutôt que de
        /// déclencher un recalcul complet. Sans route existante, on ne fait
        /// rien -- on n'en crée pas une dans le dos d'Antoine.
        /// </summary>
        private void InsertIntoRoutes(GatheredNode n)
        {
            if (n == null) return;

            var routes = RoutesCovering(n.MapId, n.Group);
            if (routes.Count == 0) return;

            int touched = 0;
            foreach (var route in routes)
                if (RouteBuilder.Insert(route, RoutePoint.FromNode(n))) touched++;

            if (touched > 0)
            {
                SaveRoutes();
                Logger.Debug("Node insere dans {0} route(s) de la map {1}.", touched, n.MapId);
            }
        }

        private void RemoveFromRoutes(GatheredNode n)
        {
            if (n == null) return;

            var routes = RoutesCovering(n.MapId, n.Group);
            if (routes.Count == 0) return;

            int touched = 0;
            foreach (var route in routes)
                if (RouteBuilder.Remove(route, RoutePoint.FromNode(n), CurrentRadius)) touched++;

            if (touched > 0)
            {
                SaveRoutes();
                Logger.Debug("Node retire de {0} route(s) de la map {1}.", touched, n.MapId);
            }
        }

        /// <summary>
        /// (Re)construit une route par groupe présent sur la map courante,
        /// puis y applique immédiatement les chemins déjà connus.
        /// </summary>
        private void OnBuildRouteKeyActivated(object sender, EventArgs e)
        {
            if (!CanAct()) return;

            int mapId = GameService.Gw2Mumble.CurrentMap.Id;

            var groups = _nodes.Where(n => n.MapId == mapId)
                               .Select(n => n.Group)
                               .Distinct()
                               .OrderBy(g => { int i = Array.IndexOf(TacoGenerator.GroupOrder, g); return i >= 0 ? i : 99; })
                               .ToList();

            if (groups.Count == 0)
            {
                ShowNotification("Aucun node sur cette map -- rien à router.");
                return;
            }

            _routes.RemoveAll(r => r.MapId == mapId);

            // Toutes les combinaisons sont construites d'un coup, une bonne
            // fois pour la map. C'est ce qui permet de basculer de « Minerai »
            // à « Minerai + Bois » depuis le menu sans jamais relancer un
            // calcul -- et donc sans jamais perdre une vérification acquise.
            var combos = RouteBuilder.Combinations(groups);

            int stops = 0;
            foreach (var combo in combos)
            {
                var route = RouteBuilder.Build(_nodes, mapId, combo);
                if (route.Stops.Count < 2) continue;

                // Le réglage coupé, on construit quand même la route : le
                // calcul de l'ordre ne dépend pas des traces, seule la
                // géométrie des tronçons en dépend.
                if (_pathCorrectionEnabled.Value)
                    RouteBuilder.Refine(route, _traces, _simplifyTolerance.Value, _routeSnapRadius.Value);

                _routes.Add(route);
                stops += route.Stops.Count;
            }

            SaveRoutes();
            TriggerTacoRegeneration();

            var built = _routes.Where(r => r.MapId == mapId).ToList();
            int verified = built.Sum(r => r.VerifiedCount());
            int legs = built.Sum(r => r.Legs.Count);

            ShowNotification(
                $"🧭 {built.Count} composition(s), {stops} arrets -- {verified}/{legs} troncons verifies");
        }

        /// <summary>
        /// Position du joueur dans la convention de stockage (y = altitude).
        /// </summary>
        private static RoutePoint PlayerPoint()
        {
            Vector3 pos = GameService.Gw2Mumble.PlayerCharacter.Position;
            return new RoutePoint(pos.X, pos.Z, pos.Y);
        }

        /// <summary>
        /// Rejette le tronçon sur lequel le joueur se tient.
        ///
        /// C'est la réponse au « comment je corrige une donnée fausse » : on
        /// ne touche pas au JSON, on se place sur le tronçon fautif et on
        /// appuie. Aucune coordonnée à lire, aucun identifiant à retrouver.
        /// </summary>
        private void OnInvalidateLegKeyActivated(object sender, EventArgs e)
        {
            if (!CanAct()) return;

            int mapId = GameService.Gw2Mumble.CurrentMap.Id;
            var me = PlayerPoint();

            Route bestRoute = null;
            int bestLeg = -1;
            double bestDist = LegPickRadiusMeters;

            foreach (var route in _routes.Where(r => r.MapId == mapId))
            {
                for (int i = 0; i < route.Legs.Count; i++)
                {
                    if (!route.Legs[i].Verified) continue; // rien à rejeter sur une ligne droite

                    double d = RouteBuilder.DistanceToLeg(route.Legs[i], me);
                    if (d < bestDist) { bestDist = d; bestRoute = route; bestLeg = i; }
                }
            }

            if (bestRoute == null)
            {
                ShowNotification("Aucun troncon verifie a moins de 40 m.");
                return;
            }

            RouteBuilder.Invalidate(bestRoute, bestLeg);
            SaveRoutes();
            TriggerTacoRegeneration();

            ShowNotification($"🧭 Troncon rejete sur {bestRoute.Label()} ({bestDist:0} m) -- refais le trajet pour le revalider");
        }

        /// <summary>
        /// Oublie les traces autour du joueur. Le pendant du rejet de
        /// tronçon : l'un annule une conclusion, l'autre efface la preuve qui
        /// y menait.
        /// </summary>
        private void OnPurgeTracesKeyActivated(object sender, EventArgs e)
        {
            if (!CanAct()) return;

            int mapId = GameService.Gw2Mumble.CurrentMap.Id;
            int removed = _traces.PurgeNear(mapId, PlayerPoint(), PurgeRadiusMeters);

            if (removed == 0)
            {
                ShowNotification("Aucun point de trace a moins de 30 m.");
                return;
            }

            string path = CleanPath(_tracesFilePath.Value);
            Task.Run(() => _traces.Save(path));

            ShowNotification($"🧭 {removed} point(s) de trace oublie(s) dans un rayon de 30 m");
        }

        /// <summary>
        /// Bascule l'enregistrement sans passer par le menu. C'est un geste de
        /// terrain : on l'allume en partant faire un tour, on l'éteint en
        /// arrivant, sans lâcher le jeu.
        /// </summary>
        private void OnTogglePathCorrectionKeyActivated(object sender, EventArgs e)
        {
            if (!CanAct()) return;

            bool enabled = !_pathCorrectionEnabled.Value;
            _pathCorrectionEnabled.Value = enabled;

            if (enabled)
            {
                // Reprise : nouveau segment, jamais de raccord avec ce qui
                // précède l'extinction.
                _traces.CutSegment();
                _sampleAccumMs = 0;
                ShowNotification("🧭 Correction de chemin ACTIVEE -- enregistrement en cours");
            }
            else
            {
                _traces.CutSegment();
                if (_traces.Dirty)
                {
                    string path = CleanPath(_tracesFilePath.Value);
                    Task.Run(() => _traces.Save(path));
                }
                ShowNotification($"🧭 Correction de chemin coupee ({_traces.Count} points enregistres)");
            }
        }

        private void OnRefinePathKeyActivated(object sender, EventArgs e)
        {
            if (!CanAct()) return;

            if (!_pathCorrectionEnabled.Value)
            {
                ShowNotification("Correction de chemin désactivée -- active-la d'abord (touche dédiée).");
                return;
            }

            TriggerRefine(GameService.Gw2Mumble.CurrentMap.Id, notify: true);
        }

        /// <summary>
        /// Réaffinage en tâche de fond : cherche, pour chaque tronçon des
        /// routes de la map courante, un trajet réel plus récent que celui
        /// déjà retenu. Ne touche jamais à l'ordre de passage.
        /// </summary>
        private void TriggerRefine(int mapId, bool notify)
        {
            if (System.Threading.Interlocked.CompareExchange(ref _refineBusy, 1, 0) != 0)
                return; // affinage déjà en cours

            float epsilon = _simplifyTolerance.Value;
            float snap = _routeSnapRadius.Value;

            Task.Run(() =>
            {
                try
                {
                    int added = 0, refreshed = 0;
                    foreach (var route in _routes.Where(r => r.MapId == mapId).ToList())
                    {
                        var res = RouteBuilder.Refine(route, _traces, epsilon, snap);
                        added += res.added;
                        refreshed += res.refreshed;
                    }

                    if (added + refreshed > 0)
                    {
                        SaveRoutes();
                        TriggerTacoRegeneration();

                        if (notify || _verboseNotifications.Value)
                        {
                            string msg = added > 0 && refreshed > 0
                                ? $"🧭 {added} troncon(s) corrige(s), {refreshed} reconfirme(s)"
                                : added > 0
                                    ? $"🧭 {added} troncon(s) corrige(s) par le trajet parcouru"
                                    : $"🧭 {refreshed} troncon(s) reconfirme(s)";
                            _pendingNotifications.Enqueue(msg);
                        }

                        Logger.Info("Affinage map {0} : {1} nouveau(x), {2} reconfirme(s).", mapId, added, refreshed);
                    }
                    else if (notify)
                    {
                        // Sur demande explicite, le silence serait ambigu : on
                        // ne saurait pas distinguer « rien de neuf » de « la
                        // touche n'a rien déclenché ».
                        _pendingNotifications.Enqueue("🧭 Aucun nouveau troncon a corriger.");
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "Échec de l'affinage des routes.");
                }
                finally
                {
                    System.Threading.Interlocked.Exchange(ref _refineBusy, 0);
                }
            });
        }

        // -------------------------------------------------------------
        // Notification à l'écran
        // -------------------------------------------------------------
        private void ShowNotification(string text)
        {
            try
            {
                ScreenNotification.ShowNotification(text);
            }
            catch (Exception ex)
            {
                Logger.Warn(ex, "ShowNotification a échoué pour : {0}", text);
            }
        }
    }
}