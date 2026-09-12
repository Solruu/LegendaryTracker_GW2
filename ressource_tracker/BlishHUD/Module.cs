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

        private const double UpsertThresholdMeters = 5.0;
        private const int ButtonHeight = 26;
        private const int PanelWidth = 260;

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
        private SettingEntry<string> _nodesFilePath;
        private SettingEntry<bool> _verboseNotifications;

        private SettingEntry<bool> _autoRegenerateTaco;
        private SettingEntry<string> _tacoOutputPath;
        private SettingEntry<string> _iconsFolderPath;
        #endregion

        private List<GatheredNode> _nodes = new List<GatheredNode>();
        private List<NodeType> _filteredTypes = new List<NodeType>();
        private NodeType? _selectedType = null;
        private int _lastKnownMapId = -1;
        private bool _nodesLoaded = false;

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
                "CaptureKey",
                new KeyBinding(Keys.F12),
                () => "Capturer un node",
                () => "Enregistre un node du type sélectionné à ta position actuelle.");

            _cycleTypeKey = settings.DefineSetting(
                "CycleTypeKey",
                new KeyBinding(Keys.T),
                () => "Changer de type (cycle)",
                () => "Passe au type suivant dans la liste filtrée par map courante.");

            _togglePanelKey = settings.DefineSetting(
                "TogglePanelKey",
                new KeyBinding(Keys.L),
                () => "Afficher/masquer la liste",
                () => "Ouvre un panneau cliquable listant les types filtrés par map courante.");

            _forceIconRefreshKey = settings.DefineSetting(
                "ForceIconRefreshKey",
                new KeyBinding(Keys.I),
                () => "Forcer le re-téléchargement des icônes",
                () => "Re-télécharge TOUTES les icônes utilisées (pas seulement celles manquantes), même si le fichier existe déjà. Utile si une icône existante est fausse.");

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
        }

        protected override async Task LoadAsync()
        {
            await LoadNodesAsync();
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
                    string json = File.ReadAllText(nodesPath);
                    List<GatheredNode> freshNodes = JsonConvert.DeserializeObject<List<GatheredNode>>(json)
                                                     ?? new List<GatheredNode>();

                    if (freshNodes.Count == 0)
                    {
                        Logger.Warn("Aucun node dans {0} -- régénération ignorée.", nodesPath);
                        return;
                    }

                    var (foundIcons, missing) = TacoGenerator.Generate(freshNodes, output, iconsDir);

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
                            var (foundIcons2, stillMissing2) = TacoGenerator.Generate(freshNodes, output, iconsDir);
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
            int height = Math.Min(totalRows * ButtonHeight + 10, 600);

            _selectionPanel = new Panel
            {
                Parent = GameService.Graphics.SpriteScreen,
                Size = new Point(PanelWidth, height),
                Location = new Point(100, 150),
                Title = "GW2 Node Tracker",
                ShowBorder = true,
                CanScroll = true,
                Visible = wasVisible,
            };

            var closeButton = new StandardButton
            {
                Text = "✕ Fermer",
                Size = new Point(PanelWidth - 20, ButtonHeight - 2),
                Location = new Point(10, 5),
                Parent = _selectionPanel,
            };
            closeButton.Click += (s, e) => { _selectionPanel.Visible = false; };

            var toggleButton = new StandardButton
            {
                Text = _showingFullList
                    ? $"↩ Revenir au filtre ({_filteredTypes.Count})"
                    : $"⊞ Voir tout ({NodeType.All.Length})",
                Size = new Point(PanelWidth - 20, ButtonHeight - 2),
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
                        Size = new Point(PanelWidth - 20, ButtonHeight - 2),
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
                    Size = new Point(PanelWidth - 20, ButtonHeight - 2),
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

                    var (foundIcons, missing) = TacoGenerator.Generate(freshNodes, output, iconsDir);
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
            if (selected.Group == "Vegetal")
            {
                nearby = _nodes
                    .Where(n => n.MapId == mapId && n.Group == "Vegetal")
                    .OrderBy(n => n.DistanceTo(pos.X, pos.Z, pos.Y))
                    .FirstOrDefault(n => n.DistanceTo(pos.X, pos.Z, pos.Y) < UpsertThresholdMeters);
            }

            if (nearby != null)
            {
                string oldLabel = nearby.Label;
                nearby.Type = selected.Slug;
                nearby.Group = selected.Group;
                nearby.Label = selected.Label;
                nearby.UpdatedAt = DateTime.Now.ToString("o");
                ShowNotification($"🔄 [{oldLabel}] → [{selected.Label}]");
            }
            else
            {
                _nodes.Add(new GatheredNode
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
                });
                ShowNotification($"✅ [{selected.Label}]  (total: {_nodes.Count})");
            }

            SaveNodes();
            TriggerTacoRegeneration(); // relit le disque, pas _nodes -- cf. commentaire de la méthode
            RefreshFilteredTypes(mapId, resetSelection: false); // le nouveau type capturé doit apparaître dans le filtre tout de suite,
                                          // pas seulement au prochain changement de map
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
