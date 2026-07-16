import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════
// I18N — libellés de l'interface (chrome). Les libellés issus des
// données (LEGENDARIES.description/type/notes, SOURCES_DB.tip…) relèvent
// de la couche données : format { fr, en } résolu par L() au rendu.
// ═══════════════════════════════════════════════════════════════

const LANGS = { en: "EN", fr: "FR" };

const I18N = {
  en: {
    // Header
    header_reset_weekly: "Reset Mon 07:30 UTC+1",
    header_reset_daily: "Reset 01:00 UTC+1",
    // Tabs
    tab_chars: "Chars ({n})",
    tab_bounties: "Bounties ({n}/5)",
    tab_common: "Materials",
    tab_currencies: "Progress",
    tab_pieces: "⬡ Pieces ({n}/18)",
    tab_collections: "✦ Collections",
    tab_weapons: "⚔ Weapons ({n}/{m})",
    wpn_target_hint: "Tap a weapon to add/remove it from your goal. ✓ = owned (armory). Gen 3 (Aurene) — gen 1/2 coming later.",
    wpn_goal: "Goal: {n} weapon(s) targeted — {o} owned, {r} remaining",
    wpn_goal_default: "No weapon selected — pick your first targets (axe, mace, hammer?).",
    wpn_resolving: "Resolving weapon names via GW2 API…",
    bits_meta_note: "Meta-achievement — its steps are the map achievements below (completion states sync via Flask).",
    bits_meta_nostatus: "Connect the Flask API to see per-achievement completion.",
    t6_demand: "1 Condensed pair (Magic+Might) = 200 of EACH T6. Demands: Obsidian piece = 1 pair · rune/sigil/relic = 1 pair · Coalescence = 2 pairs · gen3 weapon = 1 pair. Bars below = 1 pair; multiply by your planned crafts.",
    t6_src1: "Eternal Ice loop (IBS): daily strikes (~90-100 shards/day, 30-45 min) or Drakkar + Bjora chests. Conversion at Eye of the North (WP [&BBsDAAA=]) via Kjep Corrson — UNLOCK REQUIRED: buy 'Unlock Eternal Ice Trader' from Lady Camilla (hub upgrade vendor). 75 shards → pouch of 25 LW4 map currency, unlimited; also trades directly against Volatile Magic. Note: the Eternal Ice vendor works even without PoF (rare exception in the hub).",
    t6_src2: "Trophy Shipments: 250 Volatile Magic + 1g from the Volatile Magic Collectors on each LW4 map (near the main waypoints) — T5/T6 trophies worth ~2-5g each; THE volume source. Skip Material Shipments (lower tiers). Extra VM: Dragonfall meta, daily LW4 train.",
    t6_src3: "T5→T6 Mystic Forge promotion: 250 T5 + dust + spirit shards → 5-12 T6 (~35-50/stack). Profitability varies — check gw2efficiency (venom sacs and claws are often not worth it). Buy remaining deficits on the TP at the end.",
    bits_tap_hint: "Tap a collection to expand its steps.",
    bits_locked_note: "Collection locked in-game — steps shown for reference; progress will appear once unlocked.",
    bits_loading: "Loading step definitions…",
    bits_step: "Step {n}",
    wpn_note1: "Per weapon: precursor (craft 500) + Gift of Aurene's X + Gift of Jade Mastery + Draconic Tribute. Key totals: 100 Antique Summoning Stones (time-gated ~5/week from EoD vendors, or TP), 100 Jade Runestones, 38 Clovers, 5 Amalgamated Draconic Lodestones, ~3000 Research Notes.",
    wpn_note2: "Gen 3 weapons are tradeable until first equip — a gifted one binds on use. Elder Dragon skin variants unlock via Jade Bot terminals once the base weapon is bound.",
    up_note1: "One unit = Gift of Runes/Sigils/Relics + Gift of Condensed Magic + Gift of Condensed Might + Gift of Craftsmanship (50 Provisioner Tokens each). Tokens: Rend Scorchmaul (Wizard's Tower) trades raw materials with NO limit — best volume source. SotO/JW map provisioners: 1/day each; Core/HoT: 7/week (June 2025 patch).",
    up_note2: "Relic (1 needed): Gift of Relics = 25 Mystic Facets (187,500 Lucent Motes!) + 25 Clovers + 150 Ectos + 1 Gift of Research. Comfort goal overall: 6 runes + 2-4 sigils + 1 relic — pure QoL, no timers, no achievement locks.",
    eik_note1: "Legendary GLOVES only (not a full set). Earned via the fractal quickplay mode (scale 1, LFG panel) — free content, no expansion needed.",
    eik_note2: "Fractalline Dust progress shows in the Recursion achievements below (current/max). Extra weights: Infinite Recursion (150 Dust) + 8 Gifts (craft 400, recipes 10g each) or Lyhr assisted crafting (+80 Ectos/weight).",
    sel_note1: "Precursor Agaleus via the 24-step 'Acquiring Agaleus' collection (VoE maps + old Tyria dive spots).",
    sel_note2: "Gift of Castoran Mastery requires Shipwreck Strand Mastery + Starlit Weald Mastery (30+ sub-achievements each) + 250 Obsidian Shards + 1 Bloodstone Shard.",
    tab_raids: "⚔ Raids",
    raids_li_note: "Cap: 77 Legendary Insights/week (43 weekly clears + encounters + daily bounties + quickplay). 150 needed — minimum 2 weeks.",
    raids_wings_note: "Wings 5–6–7 (PoF) required for the 3 collections. Gift of Compassion sold by Scholar Glenna in any wing.",
    wb_req_note: "Requires WvW rank 350 + Commander's Compendium (300g + 250 Badges) for the last Warcry tier. Minimum 7 weeks (2800 tickets at 365+90/week).",
    ach_locked: "Locked",
    obs_target_hint: "Tap a piece to add/remove it from your goal. ✓ = owned (armory). Default goal: 1 full set (6 pieces).",
    obs_goal: "Goal: {n} piece(s) targeted — {o} owned, {r} remaining",
    obs_goal_default: "No piece selected — costs shown for 1 full set ({r} remaining).",
    obs_sync: "⟳ Sync armory",
    obs_resolving: "Resolving piece names via GW2 API…",
    obs_arcanum_title: "Arcanum achievements — Legendary Armor: Astral X",
    obs_arcanum_note: "Each Arcanum is bought from Lyhr for 1 Lesser Vision Crystal once its achievement is done (Astral Ward + Oneiros-Spun skins of the slot + boss kill). One-time account cost for the skins: 12 Purified Rift Essence (= 12 Amalgamated + 12 Clovers), shared across weights.",
    obs_per_piece_note: "Costs computed for {n} targeted piece(s) remaining. Fine/Masterwork/Rare shown assuming all 12 Amalgamated per piece are crafted.",
    obs_gift_magical: "Gift of Magical Prosperity",
    obs_gift_mighty: "Gift of Mighty Prosperity",
    obs_boss: "Boss: {b}",

    // Grand Total
    gt_detecting: "⟳ Detecting…",
    gt_autodetect: "🔑 Auto-detect via GW2 API key",
    gt_detected: "✓ {n} in armory + {m} manual",
    gt_apikey_pre: "API key (scope ",
    gt_apikey_post: ") — stored locally.",
    gt_apikey_flasknote: "If local Flask is active, the key is passed through it to stay server-side.",
    gt_detect_btn: "Detect",
    gt_syncing: "⟳ Syncing…",
    gt_synced: "✓ {n} items synced",
    gt_sync_btn: "⟳ Sync stocks",
    gt_legs_to_craft: "Legendaries to craft — {n} selected",
    gt_owned_hint_pre: "· Right-click or ",
    gt_owned_hint_post: " = mark as already owned",
    gt_title_api: "{label} — detected in armory",
    gt_title_manual: "{label} — marked as owned (right-click or click to remove)",
    gt_empty: "Select legendaries above to calculate total required resources.",
    gt_summary: "{comp} resources · {n} legendary item{s}",
    gt_no_resources: "No resources for this filter.",
    gt_filter_all: "All",
    gt_uncountable: "⚠ {n} uncountable component{s} {arrow}",
    // Daily / metas
    word_in: "in",
    farm_perchar: "×char (×{n} active)",
    farm_perchar_hearts: "×char (hearts required)",
    farm_account: "×account",
    next_meta: "→ Next: {meta} ({sub}) at {time}",
    btn_done: "Done",
    btn_done_checked: "✓ Done",
    btn_copied: "✓ Copied!",
    sec_upcoming: "⚡ Upcoming",
    sec_scheduled: "[>] Scheduled Metas",
    sec_daily: "[J] Daily Activities",
    sec_weekly: "[c] Weekly Activities",
    sec_bounties: "Legendary Bounties (5)",
    sec_currency: "Currency Progress — {name}",
    sec_common: "Common Materials — all legendaries",
    reset_info_daily: "Saved · Auto-reset at 01h00 UTC+1",
    reset_info_weekly: "Auto-reset Monday 07h30 UTC+1",
    reset_info_bounties: "Manual reset · Elegy saved in Progress",
    reset_info_chars: "Character count saved between sessions",
    reset_info_progress: "Progress saved between sessions",
    reset_info_common: "Shared stock (bank + material storage) · Synced via Flask API",
    per_day: "~{n}/day",
    days_left: "~{n}d left",
    status_completed: "✓ Completed",
    // Chars selector
    chars_title: "Eligible Characters — {name}",
    wvw_label: "World vs World",
    bounty_train_title: "[M] Bounty Train",
    btn_kill: "Kill",
    chars_criteria_pre: "Criteria: ",
    chars_criteria_lvl: "level 80",
    chars_criteria_mid: " + ",
    chars_criteria_ep: "LW3 episode 3",
    chars_criteria_post: " unlocked on the account (A Crack in the Ice). The Grimoire Portal Scroll is enough to bring alts — no need to redo the story.",
    chars_active_label: "Active Bitterfrost chars",
    chars_active_help: "The ones you actually bring to farm each day",
    chars_yield: "Estimated daily yield",
    chars_note_perchar: "{n} char{s} × ~{per}/char",
    chars_note_chests: "{n} char{s} × 2 chests (5 hearts/char required)",
    chars_note_cap: "account cap — alts useless",
    chars_siren_title: "⚠ Siren's Landing — note",
    chars_altswap_pre: "Alt-swap possible but costly: each character must complete the ",
    chars_altswap_hearts: "5 hearts",
    chars_altswap_mid: " before accessing the chests (~20-30 min/char). The 2nd chest costs ",
    chars_altswap_cost: "1.5g",
    chars_altswap_post: ". Only worthwhile if you have spare time or specifically need Orrian Pearls.",
    // WvW / Prismatic
    prismatic_done: "✓ Prismatic Champion's Regalia — Completed!",
    prismatic_title: "✦ Seasons of the Dragons",
    prismatic_synchint: "Sync via the API button above · Or check manually below",
    wvw_reset_note_pre: "Weekly reset on ",
    wvw_reset_note_day: "Monday at 07h30 UTC+1",
    wvw_reset_note_post: ". Max 365 tickets/week via Skirmish. Weeklies add ~150 bonus tickets.",
    // Aurora collections
    aurora_col_title: "Aurora Collections — crafting prerequisites",
    aurora_syncnote: "Progress is synced via the API button.",
    sync_to_see: " · Sync to see your progress.",
    aurora_reward: "Reward: Gift of Valor · 7 items (Sentient Seed + 6 sub-collections)",
    prereq_count: "{n}/4 prerequisites",
    aurora_prereq_help: "Complete these 4 achievements (once per account) to obtain the 4 Sentient* items to forge.",
    aurora_req: "Required: {cur}/{max} achievements · {left} remaining",
    aurora_threshold: "Threshold reached — claim the reward in the Achievements panel",
    aurora2_reward: "Reward: Spark of Sentience · 21 Xunlai Electrum Ingots to infuse",
    aurora2_help: "No RNG or time-gate. Have 21 Xunlai Electrum Ingots in your inventory, then commune with each listed Mastery Insight.",
    aurora2_prereq: "Prerequisite: Aurora: Awakening completed · Sync via API to see checked boxes",
    // Vision collections
    vision_col_title: "Vision Collections — crafting prerequisites",
    vision_reqnote: "The Requiem Experiments provide the necessary Elegy Mosaics.",
    vision_reward_1: "Reward: Gift of Insight · 6 Visions of [map] LW4",
    vision_reward_2: "Reward: Gift of Prescience · The Convergence of Sorrow I: Elegy + The Convergence of Sorrow II: Requiem",
    x6_required: "×6 required",
    vision_mee_craft: "⚠ Artificer 400 · Recipe must be purchased (Arborstone / Juno vendors)",
    vision_mee_note: "Xunlai Electrum Ingot: EoD vendor recipe (Arborstone) · Electrum Ingot + Jade Sliver ×10",
    vision_elegy_label: "Requiem Experiments — Elegy Mosaics",
    vision_elegy_note: "6 experiments × 50 Elegy · Accumulated: {n}/300 Elegy Mosaics",
    // Population badges
    pop_LFG: "LFG active", pop_public: "Public instance", pop_bon: "Well-populated",
    pop_moyen: "Decent population", pop_variable: "Variable pop.", pop_morte: "⚠ Dead pop.",
    // Misc
    req_missing: "Required: {req} · Missing: {miss}",
    bounty_train_desc: `LFG → "Crystal Desert" → "bounty train" or "BT". ~40 min for all 5 maps. No need to take the contract — joining the kill is enough.`,
    bounty_train_elegy: "~40–60 Elegy Mosaic per full train",
    aurora_col_intro: "Two mandatory collections before forging Aurora.",
    sentient_seed_desc: "One-time purchase 1000 UM from Gleam of Sentience · forge the 4 Sentient* in Mystic Forge",
    aurora2_show_insights: "Show 21 Mastery Insights",
    vision_col_intro: "Vision I: Awakening → Gift of Insight · Vision II: Farsight → Gift of Prescience.",
    common_intro: "These materials are part of the Mystic Tribute required for all legendaries. Stock is shared across all your active legendaries.",
    btn_reset_daily: "Reset day",
  },
  fr: {
    header_reset_weekly: "Reset lundi 07h30 UTC+1",
    header_reset_daily: "Reset 01h00 UTC+1",
    tab_chars: "Persos ({n})",
    tab_bounties: "Primes ({n}/5)",
    tab_common: "Matériaux",
    tab_currencies: "Progression",
    tab_pieces: "⬡ Pièces ({n}/18)",
    tab_collections: "✦ Collections",
    sel_note1: "Précurseur Agaleus via la collection 'Acquiring Agaleus' en 24 étapes (cartes VoE + spots de plongée de la vieille Tyrie).",
    sel_note2: "Gift of Castoran Mastery requiert Shipwreck Strand Mastery + Starlit Weald Mastery (30+ sous-achievements chacun) + 250 Obsidian Shards + 1 Bloodstone Shard.",
    eik_note1: "GANTS légendaires uniquement (pas un set complet). Obtenus via le mode quickplay fractales (échelle 1, panneau LFG) — contenu gratuit, aucune extension requise.",
    eik_note2: "La progression Fractalline Dust se lit dans les achievements Recursion ci-dessous (current/max). Poids supplémentaires : Infinite Recursion (150 Dust) + 8 Gifts (craft 400, recettes 10 po pièce) ou craft assisté Lyhr (+80 Ectos/poids).",
    up_note1: "Une unité = Gift of Runes/Sigils/Relics + Gift of Condensed Magic + Gift of Condensed Might + Gift of Craftsmanship (50 Provisioner Tokens chacun). Tokens : Rend Scorchmaul (Wizard's Tower) échange des matériaux bruts SANS limite — meilleure source de volume. Provisioners de carte SotO/JW : 1/jour chacun ; Tyrie centrale/HoT : 7/semaine (patch juin 2025).",
    up_note2: "Relique (1 seule requise) : Gift of Relics = 25 Mystic Facets (187 500 Lucent Motes !) + 25 Clovers + 150 Ectos + 1 Gift of Research. Objectif confort global : 6 runes + 2-4 sigils + 1 relique — pure QoL, aucun timer, aucun verrou d'achievement.",
    tab_weapons: "⚔ Armes ({n}/{m})",
    wpn_target_hint: "Touche une arme pour l'ajouter/retirer de ton objectif. ✓ = possédée (armurerie). Gen 3 (Aurene) — gen 1/2 plus tard.",
    wpn_goal: "Objectif : {n} arme(s) ciblée(s) — {o} possédée(s), {r} restante(s)",
    wpn_goal_default: "Aucune arme sélectionnée — choisis tes premières cibles (hache, masse, marteau ?).",
    wpn_resolving: "Résolution des noms d'armes via l'API GW2…",
    bits_meta_note: "Méta-achievement — ses étapes sont les achievements de carte ci-dessous (statuts synchronisés via Flask).",
    bits_meta_nostatus: "Connecte l'API Flask pour voir la complétion par achievement.",
    t6_demand: "1 paire Condensed (Magic+Might) = 200 de CHAQUE T6. Demandes : pièce Obsidienne = 1 paire · rune/sigil/relique = 1 paire · Coalescence = 2 paires · arme gen3 = 1 paire. Barres ci-dessous = 1 paire ; multiplie par tes crafts prévus.",
    t6_src1: "Circuit Eternal Ice (IBS) : strikes quotidiennes (~90-100 shards/j, 30-45 min) ou Drakkar + coffres Bjora. Conversion à l'Eye of the North (WP [&BBsDAAA=]) via Kjep Corrson — DÉBLOCAGE REQUIS : acheter 'Unlock Eternal Ice Trader' chez Lady Camilla (le PNJ d'améliorations du hub). 75 shards → sachet de 25 monnaies de carte LW4, sans limite ; échange aussi directement contre de la Volatile Magic. Note : le vendor Eternal Ice fonctionne même sans PoF (exception rare du hub).",
    t6_src2: "Trophy Shipments : 250 Volatile Magic + 1 po chez les Volatile Magic Collectors de chaque carte LW4 (près des waypoints principaux) — trophées T5/T6 valant ~2-5 po pièce ; LA source de volume. Éviter les Material Shipments (tiers inférieurs). VM en plus : meta Dragonfall, train LW4 quotidien.",
    t6_src3: "Promotion T5→T6 en Forge : 250 T5 + dust + spirit shards → 5-12 T6 (~35-50/stack). Rentabilité variable — vérifier gw2efficiency (venom sacs et claws souvent non rentables). Acheter les déficits restants au TP en fin de parcours.",
    bits_tap_hint: "Touche une collection pour déplier ses étapes.",
    bits_locked_note: "Collection verrouillée en jeu — étapes affichées à titre indicatif ; la progression apparaîtra une fois débloquée.",
    bits_loading: "Chargement des définitions d'étapes…",
    bits_step: "Étape {n}",
    wpn_note1: "Par arme : précurseur (craft 500) + Gift of Aurene's X + Gift of Jade Mastery + Draconic Tribute. Totaux clés : 100 Antique Summoning Stones (time-gate ~5/sem chez les vendors EoD, ou TP), 100 Jade Runestones, 38 Clovers, 5 Amalgamated Draconic Lodestones, ~3000 Research Notes.",
    wpn_note2: "Les armes gen 3 sont échangeables jusqu'au premier équipement — une arme offerte se lie à l'usage. Les variantes de skins Dragons Ancestraux se débloquent aux terminaux Jade Bot une fois l'arme de base liée.",
    tab_raids: "⚔ Raids",
    raids_li_note: "Cap : 77 Legendary Insights/semaine (43 clears hebdo + encounters + primes daily + quickplay). 150 requis — minimum 2 semaines.",
    raids_wings_note: "Wings 5–6–7 (PoF) obligatoires pour les 3 collections. Gift of Compassion vendu par Scholar Glenna dans n'importe quelle wing.",
    wb_req_note: "Requiert rang McM 350 + Commander's Compendium (300 po + 250 Badges) pour le dernier palier de Warcry. Minimum 7 semaines (2800 tickets à 365+90/sem).",
    ach_locked: "Verrouillé",
    obs_target_hint: "Touche une pièce pour l'ajouter/retirer de ton objectif. ✓ = possédée (armurerie). Objectif par défaut : 1 set complet (6 pièces).",
    obs_goal: "Objectif : {n} pièce(s) ciblée(s) — {o} possédée(s), {r} restante(s)",
    obs_goal_default: "Aucune pièce sélectionnée — coûts affichés pour 1 set complet ({r} restantes).",
    obs_sync: "⟳ Sync armurerie",
    obs_resolving: "Résolution des noms de pièces via l'API GW2…",
    obs_arcanum_title: "Achievements Arcanum — Legendary Armor: Astral X",
    obs_arcanum_note: "Chaque Arcanum s'achète chez Lyhr contre 1 Lesser Vision Crystal une fois son achievement complété (skins Astral Ward + Oneiros-Spun du slot + kill de boss). Coût one-time compte pour les skins : 12 Purified Rift Essence (= 12 Amalgamated + 12 Clovers), partagé entre les poids.",
    obs_per_piece_note: "Coûts calculés pour {n} pièce(s) ciblée(s) restante(s). Fine/Masterwork/Rare affichées en supposant les 12 Amalgamated par pièce craftées.",
    obs_gift_magical: "Don de prospérité magique",
    obs_gift_mighty: "Don de prospérité puissante",
    obs_boss: "Boss : {b}",

    gt_detecting: "⟳ Détection en cours…",
    gt_autodetect: "🔑 Détection automatique via clé API GW2",
    gt_detected: "✓ {n} en armory + {m} manuel(s)",
    gt_apikey_pre: "Clé API (scope ",
    gt_apikey_post: ") — mémorisée localement.",
    gt_apikey_flasknote: "Si Flask local actif, la clé est transmise via lui pour rester côté machine.",
    gt_detect_btn: "Détecter",
    gt_syncing: "⟳ Synchro en cours…",
    gt_synced: "✓ {n} items synchronisés",
    gt_sync_btn: "⟳ Synchroniser les stocks",
    gt_legs_to_craft: "Légendaires à crafter — {n} sélectionné(s)",
    gt_owned_hint_pre: "· Clic droit ou ",
    gt_owned_hint_post: " = marquer déjà possédé",
    gt_title_api: "{label} — détecté en armory",
    gt_title_manual: "{label} — marqué possédé (clic droit ou clic pour retirer)",
    gt_empty: "Sélectionne des légendaires ci-dessus pour calculer le total des ressources nécessaires.",
    gt_summary: "{comp} ressources · {n} légendaire{s}",
    gt_no_resources: "Aucune ressource pour ce filtre.",
    gt_filter_all: "Tout",
    gt_uncountable: "⚠ {n} composant{s} non chiffrable{s} {arrow}",
    word_in: "dans",
    farm_perchar: "×perso (×{n} actif)",
    farm_perchar_hearts: "×perso (hearts requis)",
    farm_account: "×compte",
    next_meta: "→ Ensuite : {meta} ({sub}) à {time}",
    btn_done: "Fait",
    btn_done_checked: "✓ Fait",
    btn_copied: "✓ Copié !",
    sec_upcoming: "⚡ Prochains",
    sec_scheduled: "[>] Metas programmées",
    sec_daily: "[J] Activités quotidiennes",
    sec_weekly: "[c] Activités de la semaine",
    sec_bounties: "Primes — 5 primes légendaires",
    sec_currency: "Progression — {name}",
    sec_common: "Matériaux communs — tous légendaires",
    reset_info_daily: "Sauvegardé · Reset auto à 01h00 UTC+1",
    reset_info_weekly: "Reset auto lundi 07h30 UTC+1",
    reset_info_bounties: "Reset manuel · Élégies sauvegardées dans Progression",
    reset_info_chars: "Nombre de persos sauvegardé entre sessions",
    reset_info_progress: "Progression sauvegardée entre sessions",
    reset_info_common: "Stock commun partagé (banque + stockage) · Synchronisé via API Flask",
    per_day: "~{n}/jour",
    days_left: "~{n}j restants",
    status_completed: "✓ Complété",
    chars_title: "Personnages éligibles — {name}",
    wvw_label: "Monde contre Monde",
    bounty_train_title: "[M] Train de primes",
    btn_kill: "Tuer",
    chars_criteria_pre: "Critères : ",
    chars_criteria_lvl: "niveau 80",
    chars_criteria_mid: " + ",
    chars_criteria_ep: "LW3 épisode 3",
    chars_criteria_post: " débloqué sur le compte (A Crack in the Ice). Le parchemin de portail du tome de saison suffit pour amener les personnages secondaires — inutile de refaire l'histoire.",
    chars_active_label: "Persos Bitterfrost actifs",
    chars_active_help: "Ceux que tu emmènes réellement farmer chaque jour",
    chars_yield: "Rendement quotidien estimé",
    chars_note_perchar: "{n} perso{s} × ~{per}/perso",
    chars_note_chests: "{n} perso{s} × 2 coffres (5 cœurs/perso requis)",
    chars_note_cap: "plafond compte — persos secondaires inutiles",
    chars_siren_title: "⚠ Siren's Landing — spécificité",
    chars_altswap_pre: "Rotation de persos possible mais coûteuse : chaque personnage doit compléter les ",
    chars_altswap_hearts: "5 cœurs",
    chars_altswap_mid: " avant d'accéder aux coffres (~20-30 min/perso). Le 2e coffre coûte ",
    chars_altswap_cost: "1,5 po",
    chars_altswap_post: ". Rentable uniquement si tu as du temps ou manques spécifiquement d'Orrian Pearl.",
    prismatic_done: "✓ Prismatic Champion's Regalia — Complété !",
    prismatic_title: "✦ Seasons of the Dragons",
    prismatic_synchint: "Synchro via le bouton API en haut · Ou cochez manuellement ci-dessous",
    wvw_reset_note_pre: "Reset hebdomadaire le ",
    wvw_reset_note_day: "lundi à 07h30 UTC+1",
    wvw_reset_note_post: ". Max 365 tickets/semaine via Skirmish. Les weeklies ajoutent ~150 tickets bonus.",
    aurora_col_title: "Collections Aurora — prérequis au craft",
    aurora_syncnote: "La progression est synchronisée via le bouton API.",
    sync_to_see: " · Synchronise pour voir ta progression.",
    aurora_reward: "Récompense : Gift of Valor · 7 items (Sentient Seed + 6 sous-collections)",
    prereq_count: "{n}/4 prérequis",
    aurora_prereq_help: "Compléter ces 4 achievements (une fois par compte) pour obtenir les 4 Sentient* à forger.",
    aurora_req: "Requis : {cur}/{max} achievements · encore {left} à compléter",
    aurora_threshold: "Seuil atteint — réclame la récompense dans le panneau Achievements",
    aurora2_reward: "Récompense : Spark of Sentience · 21× Xunlai Electrum Ingot à infuser",
    aurora2_help: "Aucun RNG ni time-gate. Avoir 21× Xunlai Electrum Ingot en inventaire, puis communier avec chaque point de maîtrise (Mastery Insight) listé ci-dessous.",
    aurora2_prereq: "Prérequis : Aurora: Awakening complété · Synchronise via API pour voir les cases cochées",
    vision_col_title: "Collections Vision — prérequis au craft",
    vision_reqnote: "Les succès « Requiem: Experiment 1 » à « Requiem: Experiment 6 » fournissent les Elegy Mosaic nécessaires.",
    vision_reward_1: "Récompense : Gift of Insight · 6 Visions of [map] LW4",
    vision_reward_2: "Récompense : Gift of Prescience · The Convergence of Sorrow I: Elegy + The Convergence of Sorrow II: Requiem",
    x6_required: "×6 requis",
    vision_mee_craft: "⚠ Artificier 400 · Recette à acheter (vendeurs Arborstone / Juno)",
    vision_mee_note: "Xunlai Electrum Ingot : recette de vendeur EoD (Arborstone) · Electrum Ingot + 10× Jade Sliver",
    vision_elegy_label: "Requiem Experiments — Elegy Mosaics",
    vision_elegy_note: "6 experiments × 50 Elegy · Accumulé : {n}/300 Elegy Mosaics",
    pop_LFG: "LFG actif", pop_public: "Instance publique", pop_bon: "Bien peuplé",
    pop_moyen: "Population correcte", pop_variable: "Pop. variable", pop_morte: "⚠ Pop. morte",
    req_missing: "Requis : {req} · Manque : {miss}",
    bounty_train_desc: `LFG → "Crystal Desert" → "bounty train" ou "BT". ~40 min pour les 5 maps. Pas besoin de prendre le contrat — participer au kill suffit.`,
    bounty_train_elegy: "~40–60 Elegy Mosaic par train complet",
    aurora_col_intro: "Deux collections obligatoires avant de pouvoir forger Aurora.",
    sentient_seed_desc: "Achat unique 1000 UM au Gleam of Sentience · forger les 4 Sentient* en Forge mystique",
    aurora2_show_insights: "Voir les 21 Mastery Insights",
    vision_col_intro: "Vision I: Awakening → Gift of Insight · Vision II: Farsight → Gift of Prescience.",
    common_intro: "Ces matériaux font partie du Mystic Tribute requis pour tous les légendaires. Le stock est partagé entre tous tes légendaires actifs.",
    btn_reset_daily: "Reset du jour",
  },
};

const LangContext = createContext("en");
// Résolveur i18n des champs de données : { fr, en } → chaîne selon la langue courante.
// CUR_LANG est synchronisé pendant le render du composant racine (avant les enfants).
let CUR_LANG = "en";
const L = (v) => (v && typeof v === "object" && !Array.isArray(v) && (v.fr !== undefined || v.en !== undefined)) ? (v[CUR_LANG] ?? v.en ?? v.fr) : v;

// Noms FR officiels — légendaires (armory), items & currencies (API GW2 ?lang=fr), cache localStorage.
let FR_LEG_NAMES = {};
let FR_TERM_MAP = {};
// Cache versionné : toute évolution de la récolte (items/currencies/achievements)
// doit incrémenter NAMES_CACHE_VER pour invalider les caches des versions précédentes.
const NAMES_CACHE_KEY = "gw2_names_fr3";
const NAMES_CACHE_VER = 9; // v9 : trinkets (Stella Radians 109070, Endless Summer 107022…)
try {
  const c = JSON.parse(localStorage.getItem(NAMES_CACHE_KEY) || "{}");
  if (c.v === NAMES_CACHE_VER) { FR_LEG_NAMES = c.legs || {}; FR_TERM_MAP = c.terms || {}; }
  localStorage.removeItem("gw2_names_fr"); localStorage.removeItem("gw2_names_fr2"); // purge anciens caches
} catch (_) {}
const NL = (legId, fallback) => (CUR_LANG === "fr" && legId && FR_LEG_NAMES[legId]) || fallback;
// Alias : libellés des données ≠ nom API exact
const NX_ALIAS = { "Winterberry": "Fresh Winterberry", "Skirmish Claim Tickets": "WvW Skirmish Claim Ticket" };
// ── NXS : remplacement terme-à-terme À L'INTÉRIEUR des chaînes (recettes, tips…) ──
// Regex à frontières de mots, reconstruite quand le dictionnaire API change.
let NXS_RE = null, NXS_KEYCOUNT = -1;
function nxsRegex() {
  const keys = Object.keys(FR_TERM_MAP).filter(k => k.length >= 5);
  if (keys.length !== NXS_KEYCOUNT) {
    NXS_KEYCOUNT = keys.length;
    NXS_RE = keys.length
      ? new RegExp("\\b(" + keys.sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b", "g")
      : null;
  }
  return NXS_RE;
}
function NXS(s) {
  if (CUR_LANG !== "fr" || typeof s !== "string") return s;
  const re = nxsRegex();
  // Remplacement par dictionnaire uniquement — pas de motif générique
  // (« Don de <nom EN> » produirait des hybrides pires que l'anglais).
  return re ? s.replace(re, (m) => FR_TERM_MAP[m] || m) : s;
}
// NX : résout objets { fr, en } (via L) puis applique NXS ; chaînes → match exact puis NXS
const NX = (v) => {
  if (v && typeof v === "object") return NXS(L(v));
  if (CUR_LANG === "fr" && typeof v === "string") return FR_TERM_MAP[v] || FR_TERM_MAP[NX_ALIAS[v]] || NXS(v);
  return v;
};
// IDs à traduire — graine statique + récolte automatique dans SOURCES_DB et LEGENDARIES
const NAME_FETCH_IDS = {
  items: [79899, 79469, 80332, 81127, 81706, 68063, 19675, 19976, 19721, 19925, 71581,
    90985 /* Gift of Prescience */, 82008 /* Gift of Valor */, 81729 /* Spark of Sentience */],
  currencies: [35, 45, 15, 26, 82, 70, 28, 2],
};
// Succès vérifiés (Aurora/Vision/Coalescence/Prismatic + masters + pré-collections)
const ACHIEVEMENT_SEED = [3522, 3489, 4762, 4771, 4035, 4412, 4805, 5790,
  3053, 3129, 3383, 3429, 3500, 3529, 3499, 3491, 3547, 3495];
function harvestIds() {
  const items = new Set(NAME_FETCH_IDS.items), curs = new Set(NAME_FETCH_IDS.currencies);
  const achs = new Set(ACHIEVEMENT_SEED);
  const labelToId = {}; // libellé des données → apiId (résiste aux libellés ≠ nom API exact)
  const walk = (o) => {
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (!o || typeof o !== "object") return;
    if (typeof o.apiId === "number") {
      (o.apiId < 100 ? curs : items).add(o.apiId);
      const label = typeof o.name === "string" ? o.name : (o.name && typeof o.name.en === "string" ? o.name.en : null);
      if (label) labelToId[label] = { id: o.apiId, kind: o.apiId < 100 ? "currencies" : "items" };
    }
    if (typeof o.achievementId === "number") achs.add(o.achievementId);
    if (typeof o.mastery_achi_id === "number") achs.add(o.mastery_achi_id);
    if (typeof o.armory_api_id === "number") items.add(o.armory_api_id);
    if (typeof o.id === "number" && typeof o.name === "string" && o.id > 100) achs.add(o.id); // collections
    for (const v of Object.values(o)) walk(v);
  };
  walk(SOURCES_DB); walk(LEGENDARIES);
  return { items: [...items], currencies: [...curs], achievements: [...achs], labelToId };
}
async function fetchPairs(endpoint, ids) {
  // 2 tentatives — l'API GW2 peut renvoyer des erreurs transitoires
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const [en, fr] = await Promise.all(["en", "fr"].map(async (lg) => {
        const res = await fetch(`https://api.guildwars2.com/v2/${endpoint}?ids=${ids.join(",")}&lang=${lg}`);
        if (!res.ok) throw new Error(endpoint + " HTTP " + res.status);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error(endpoint + " non-array");
        return data;
      }));
      const enById = Object.fromEntries(en.map(it => [it.id, it.name]));
      const out = {}, byId = {};
      for (const it of fr) {
        if (it.name) byId[it.id] = it.name;
        if (enById[it.id] && it.name) out[enById[it.id]] = it.name;
      }
      out.__byId = byId;
      return out;
    } catch (e) {
      if (attempt === 1) { console.warn("[i18n]", e.message); throw e; }
      await new Promise(r => setTimeout(r, 800));
    }
  }
}
// onPartial(m) : appelé après chaque phase — persistance progressive (tolérance aux pannes partielles)
async function fetchFrLegNames(onPartial) {
  const stats = { legs: 0, items: 0, currencies: 0, achievements: 0, fails: [] };
  const map = {};
  for (const [apiId, legIds] of Object.entries(SOURCES_DB?._meta?.armory_apiid_to_legid ?? {})) {
    map[apiId] = [...(map[apiId] ?? []), ...legIds];
  }
  for (const [legId, e] of Object.entries(SOURCES_DB?.legendaries ?? {})) {
    if (e?.armory_api_id) map[String(e.armory_api_id)] = [...(map[String(e.armory_api_id)] ?? []), legId];
  }
  const ids = Object.keys(map);
  const legs = {};
  const legTermBlocklist = new Set(["Vision"]); // « Vision » = substring de noms d'items (Lesser Vision Crystal…)
  const legTerms = {};
  for (let i = 0; i < ids.length; i += 150) {
    try {
      const got = await fetchPairs("items", ids.slice(i, i + 150));
      const byId = got.__byId || {};
      delete got.__byId;
      for (const [apiId, legIds] of Object.entries(map)) {
        if (byId[apiId]) for (const legId of legIds) { legs[legId] = byId[apiId]; stats.legs++; }
      }
      // noms EN des légendaires → dictionnaire NXS (traduit « Aurora » dans les descriptions)
      for (const [enName, frName] of Object.entries(got)) {
        if (!legTermBlocklist.has(enName)) legTerms[enName] = frName;
      }
    } catch (e) { stats.fails.push("legs@" + i); console.warn("[i18n]", e.message); }
  }
  Object.assign(legTerms, {});
  if (legs.prismatic_champions_regalia && !legs.prismatic) legs.prismatic = legs.prismatic_champions_regalia;
  const terms = { ...legTerms };
  if (onPartial) onPartial({ legs, terms, stats });
  const h = harvestIds();
  const phases = [
    ["items", () => h.items, 150],
    ["currencies", () => h.currencies, 150],
    ["achievements", () => h.achievements, 150],
  ];
  for (const [endpoint, getIds, size] of phases) {
    const all = getIds();
    for (let i = 0; i < all.length; i += size) {
      try {
        const got = await fetchPairs(endpoint, all.slice(i, i + size));
        const byId = got.__byId || {};
        delete got.__byId;
        Object.assign(terms, got);
        // alias : libellés des données → nom FR de LEUR apiId (même si libellé ≠ nom API)
        for (const [label, ref] of Object.entries(h.labelToId)) {
          if (ref.kind === endpoint && byId[ref.id] && !terms[label]) terms[label] = byId[ref.id];
        }
        stats[endpoint] += Object.keys(got).length;
      } catch (_) { stats.fails.push(endpoint + "@" + i); }
    }
    if (onPartial) onPartial({ legs, terms, stats });
  }
  console.info("[i18n] stats:", JSON.stringify(stats));
  return { legs, terms, stats };
}

function translate(key, lang, vars) {
  const dict = I18N[lang] || I18N.en;
  let s = dict[key] ?? I18N.en[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(String(vars[k]));
  return lang === "fr" ? NXS(s) : s;
}

function useT() {
  const lang = useContext(LangContext);
  return useCallback((key, vars) => translate(key, lang, vars), [lang]);
}


// ═══════════════════════════════════════════════════════════════
// SOURCES DB — inlinée depuis gw2_sources.json (injectée par build)
// ═══════════════════════════════════════════════════════════════

// __SOURCES_DB_INJECT__

// ═══════════════════════════════════════════════════════════════
// BASE DE DONNÉES LÉGENDAIRES
// ═══════════════════════════════════════════════════════════════

const LEGENDARIES = {
  vision: {
    id: "vision",
    name: "Vision",
    type: { fr: "Accessoire", en: "Accessory" },
    expansion: "LW4",
    color: "#a78bfa",
    colorDim: "rgba(167,139,250,0.15)",
    icon: "V",
    description: { fr: "Accessoire légendaire — Désert de Cristal", en: "Legendary Accessory — Crystal Desert" },
    resetType: "daily",
    currencies: [
      { id: "elegy", name: "Elegy Mosaic", required: 300, icon: "EM", apiId: null },
      { id: "gems", name: "Amalgamated Gemstone", required: 100, icon: "AG", apiId: null },
      { id: "vm", name: "Volatile Magic", required: 1000, icon: "EL", apiId: 45 },
    ],
    metas: [
      { id: "vb", name: { fr: "Orée d'émeraude", en: "Verdant Brink" }, subname: { fr: "La nuit et l'ennemi", en: "Night and the Enemy" }, expansion: "HoT", icon: "VB",
        offsetUTC: 105, intervalMin: 120, durationMin: 15,
        efficience: "A", population: "LFG", next: "td", nextDelayMin: 45,
        waypoint: "Pact Encampment Waypoint", wpCode: "[&BAgIAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "Prendre le Pact Chopper → Wyvern Matriarch uniquement. Coffre : hard-reset à 01h (reset fixe, pas de timer 24h tournant).", en: "Take the Pact Chopper → Wyvern Matriarch only. Chest: hard-reset at 01h (fixed reset, no rolling 24h timer)." } },
      { id: "td", name: { fr: "Profondeurs verdoyantes", en: "Tangled Depths" }, subname: { fr: "Roi de la jungle", en: "Chak Gerent" }, expansion: "HoT", icon: "TD",
        offsetUTC: 30, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "LFG", next: "ab", nextDelayMin: 15,
        waypoint: "Ley-Line Confluence Waypoint", wpCode: "[&BPUHAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "Hub central des 4 lanes. Taxi LFG, arriver 20 min avant. Coffre : hard-reset à 01h.", en: "Central hub of the 4 lanes. LFG taxi, arrive 20 min early. Chest: hard-reset at 01h." } },
      { id: "ab", name: { fr: "Bassin aurique", en: "Auric Basin" }, subname: { fr: "Bataille de Tarir", en: "Octovine" }, expansion: "HoT", icon: "AB",
        offsetUTC: 45, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "LFG", next: "ds", nextDelayMin: 0,
        waypoint: "Forgotten City Waypoint", wpCode: "[&BNcHAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "4 lanes simultanées, stack sur la lane la plus peuplée. Coffre : hard-reset à 01h.", en: "4 simultaneous lanes, stack on the most populated one. Chest: hard-reset at 01h." } },
      { id: "ds", name: { fr: "Repli du dragon", en: "Dragon's Stand" }, subname: { fr: "Meta complète", en: "Full meta" }, expansion: "HoT", icon: "DS",
        offsetUTC: 30, intervalMin: 120, durationMin: 60,
        efficience: "B", population: "LFG", next: null, nextDelayMin: null,
        waypoint: "Mordremoth's Bane Waypoint", wpCode: "[&BNMHAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "Longue (~1h). Bonne source de drops en parallèle. Difficile d'enchaîner après.", en: "Long (~1h). Good source of drops in parallel. Hard to chain afterwards." } },
      { id: "co", name: { fr: "Oasis de cristal", en: "Crystal Oasis" }, subname: { fr: "Casino express", en: "Casino Blitz" }, expansion: "PoF", icon: "CO",
        offsetUTC: 21, intervalMin: 120, durationMin: 10,
        efficience: "S", population: "moyen", next: "er", nextDelayMin: 39,
        waypoint: "Amnoon Waypoint", wpCode: "[&BLIGAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "~10 min, ne pas rater le départ. La plus efficiente de toutes — priorité absolue.", en: "~10 min, do not miss the start. The most efficient of all — absolute priority." } },
      { id: "er", name: { fr: "Rives de l'Elon", en: "Elon Riverlands" }, subname: { fr: "Le chemin de l'Ascension", en: "Doppelganger" }, expansion: "PoF", icon: "ER",
        offsetUTC: 60, intervalMin: 120, durationMin: 15,
        efficience: "A", population: "moyen", next: "de", nextDelayMin: 30,
        waypoint: "Augury's Shadow Waypoint", wpCode: "[&BLIKAAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "Faire les pré-events 'Disperse wild magic'. Coffre : hard-reset à 01h.", en: "Do the 'Disperse wild magic' pre-events. Chest: hard-reset at 01h." } },
      { id: "de", name: { fr: "La Désolation", en: "The Desolation" }, subname: { fr: "Le soulèvement des junundus", en: "Junundu Rising" }, expansion: "PoF", icon: "DE",
        offsetUTC: 30, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "moyen", next: "dv", nextDelayMin: 30,
        waypoint: "Shattered Ravines Waypoint", wpCode: "[&BLMKAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "Monture Junundu requise. Skimmer utile pour les zones de soufre. Coffre : hard-reset à 01h.", en: "Junundu mount required. Skimmer useful for sulfur areas. Chest: hard-reset at 01h." } },
      { id: "dv", name: { fr: "Domaine de Vabbi", en: "Domain of Vabbi" }, subname: { fr: "Forgé par le feu", en: "Forged with Fire" }, expansion: "PoF", icon: "FW",
        offsetUTC: 60, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "moyen", next: "co", nextDelayMin: 21,
        waypoint: "Vehjin Palace Waypoint", wpCode: "[&BA8KAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "La meta PoF la plus simple, peu de coordination requise. Coffre : hard-reset à 01h.", en: "Easiest PoF meta, little coordination required. Chest: hard-reset at 01h." } },
      { id: "di", name: { fr: "Domaine d'Istan", en: "Domain of Istan" }, subname: "Palawadan", expansion: "LW4", icon: "DI",
        offsetUTC: 0, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "LFG", next: null, nextDelayMin: null,
        waypoint: "Chalon Docks Waypoint", wpCode: "[&BAkLAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "Très populaire, taxi LFG facile. Coffre : hard-reset à 01h.", en: "Very popular, easy LFG taxi. Chest: hard-reset at 01h." } },
      { id: "sw", name: { fr: "Archipel de l'observatoire céleste", en: "Skywatch Archipelago" }, subname: { fr: "Déverrouiller la Tour du sorcier", en: "Unlocking the Wizard's Tower" }, expansion: "SotO", icon: "SW",
        offsetUTC: 60, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "bon", next: "am", nextDelayMin: 60,
        waypoint: "Droknar's Light Waypoint", wpCode: "[&BL4NAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "1h après le reset. Monture volante requise. Bien peuplé.", en: "1h after reset. Flying mount required. Well-populated." } },
      { id: "am", name: "Amnytas", subname: { fr: "La défense d'Amnytas", en: "Defense of Amnytas" }, expansion: "SotO", icon: "AM",
        offsetUTC: 0, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "bon", next: "sw", nextDelayMin: 60,
        waypoint: "Bastion of the Natural Waypoint", wpCode: "[&BDQOAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "Au reset. Bien peuplé. S'enchaîne avec Skywatch 60 min après.", en: "At reset. Well populated. Chains with Skywatch 60 min later." } },
      { id: "sp", name: { fr: "Province de Seitung", en: "Seitung Province" }, subname: { fr: "Assaut étherlame", en: "Aetherblade Assault" }, expansion: "EoD", icon: "SP",
        offsetUTC: 90, intervalMin: 120, durationMin: 30,
        efficience: "B", population: "moyen", next: "ew", nextDelayMin: 10,
        waypoint: "Shing Jea Monastery Waypoint", wpCode: "[&BNMMAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        timerNote: "Heures impaires uniquement : 01:30 / 03:30...",
        tip: { fr: "Démarre à XX:30 heures impaires UTC. S'enchaîne naturellement avec Echovald.", en: "Starts at XX:30 odd hours UTC. Chains naturally with Echovald." } },
      { id: "nk", name: { fr: "Néo-Kaineng", en: "New Kaineng City" }, subname: "Kaineng Blackout", expansion: "EoD", icon: "NK",
        offsetUTC: 0, intervalMin: 120, durationMin: 40,
        efficience: "C", population: "morte", next: null, nextDelayMin: null,
        waypoint: "Lutgardis Conservatory Waypoint", wpCode: "[&BNQMAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        timerNote: "Heures paires : 00:00 / 02:00...",
        tip: { fr: "⚠ Population quasi-inexistante hors Wizard's Vault. Opportuniste uniquement.", en: "⚠ Nearly nonexistent population outside Wizard's Vault. Opportunistic only." } },
      { id: "ew", name: { fr: "Terres sauvages d'Echovald", en: "Echovald Wilds" }, subname: { fr: "La guerre des gangs d'Echovald", en: "Gang War" }, expansion: "EoD", icon: "EW",
        offsetUTC: 100, intervalMin: 120, durationMin: 35,
        efficience: "B", population: "moyen", next: null, nextDelayMin: null,
        waypoint: "Arborstone Waypoint", wpCode: "[&BLsNAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        timerNote: "Heures paires : 01:40 / 03:40...",
        tip: { fr: "2 phases : Gang War puis Junkyard. S'enchaîne depuis Seitung.", en: "2 phases: Gang War then Junkyard. Chains from Seitung." } },
      { id: "de2", name: { fr: "Trépas du dragon", en: "Dragon's End" }, subname: { fr: "La Bataille de la Mer de Jade", en: "Battle for Jade Sea" }, expansion: "EoD", icon: "DE2",
        offsetUTC: 60, intervalMin: 120, durationMin: 45,
        efficience: "C", population: "variable", next: null, nextDelayMin: null,
        waypoint: "The Jade Flats Waypoint", wpCode: "[&BNMMAAA=]",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        timerNote: "Heures impaires : 01:00 / 03:00...",
        tip: { fr: "Prépa (14 min) → bataille (~30 min). Prépa ne garantit pas la bataille. Long + coordination + risque d'échec.", en: "Prep (14 min) → battle (~30 min). Prep does not guarantee the battle. Long + coordination + failure risk." } },
      { id: "conv", name: { fr: "Convergence : Nayos extérieur", en: "Convergence Outer Nayos" }, subname: "Public Instance", expansion: "SotO", icon: "CV",
        offsetUTC: 90, intervalMin: 180, durationMin: 20,
        efficience: "S", population: "public", next: null, nextDelayMin: null,
        waypoint: "Rift Hunter Lounge", wpCode: "[&BOgNAAA=]",
        resetNote: { fr: "Commander's Choice Chest : hard-reset daily 01h UTC+1", en: "Commander's Choice Chest: daily hard-reset 01h UTC+1" },
        tip: { fr: "Toutes les 3h à XX:30 UTC. Fenêtre de 10 min. Portail dans Rift Hunter Lounge au Wizard's Tower.", en: "Every 3h at XX:30 UTC. 10 min window. Portal in the Rift Hunter Lounge at the Wizard's Tower." } },
      { id: "mb", name: { fr: "Convergence : Mont Balrior", en: "Convergence Mount Balrior" }, subname: "Public Instance", expansion: "JW", icon: "MB",
        offsetUTC: 0, intervalMin: 180, durationMin: 20,
        efficience: "S", population: "public", next: "conv", nextDelayMin: 90,
        waypoint: "Harvest Den Waypoint", wpCode: "[&BK4OAAA=]",
        resetNote: { fr: "Commander's Choice Chest : hard-reset daily 01h UTC+1", en: "Commander's Choice Chest: daily hard-reset 01h UTC+1" },
        tip: { fr: "Toutes les 3h à XX:00 UTC. Fenêtre de 10 min. Portail dans Harvest Den, Lowland Shore. → Outer Nayos 90 min après.", en: "Every 3h at XX:00 UTC. 10 min window. Portal in Harvest Den, Lowland Shore. → Outer Nayos 90 min later." } },
      { id: "bn", name: "Bava Nisos", subname: { fr: "Un voyage titanesque", en: "A Titanic Voyage" }, expansion: "JW", icon: "BN",
        offsetUTC: 80, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "bon", next: null, nextDelayMin: null,
        waypoint: "Mantle's Arrival Waypoint", wpCode: "[&BGEPAAA=]",
        resetNote: { fr: "Commander's Choice Chest : hard-reset daily 01h UTC+1", en: "Commander's Choice Chest: daily hard-reset 01h UTC+1" },
        tip: { fr: "Toutes les 2h à XX:20 UTC. Parler à Livia pour lancer. CC requis sur le boss.", en: "Every 2h at XX:20 UTC. Talk to Livia to start. CC required on the boss." } },
      // ── Nodes LW4 — Vision (Volatile Magic + Mistborn Mote)
      { id: "lw4_istan", name: { fr: "Domaine d'Istan", en: "Domain of Istan" }, subname: { fr: "Nodes de Brandstone + VM", en: "Brandstone nodes + VM" }, expansion: "LW4", icon: "OP",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Chalon Docks Waypoint", wpCode: "[&BAkLAAA=]",
        farmType: "per_account",
        resetNote: { fr: "soft-reset daily 01h UTC+1 (min. 5-15h après récolte)", en: "daily soft-reset 01h UTC+1 (min. 5-15h after harvest)" },
        vendor: { fr: "Traveling Elonian Trader (Chute draconique) — 5 Kralkatite/jour/compte contre VM", en: "Traveling Elonian Trader (Dragonfall) — 5 Kralkatite/day/account for VM" },
        vendorWp: "Pact Command Waypoint [&BOAKAAA=] — Dragonfall",
        tip: { fr: "Nodes de Brandstone → Volatile Magic. Soft-reset à 01h (attendre 5-15h après récolte). Cap 50 nodes/compte/jour. Vendeur Dragonfall : 5 Kralkatite/jour contre VM.", en: "Brandstone nodes → Volatile Magic. Soft-reset at 01h (wait 5-15h after harvest). Cap 50 nodes/account/day. Dragonfall vendor: 5 Kralkatite/day for VM." } },
      { id: "lw4_dragonfall", name: { fr: "Chute draconique", en: "Dragonfall" }, subname: { fr: "Nodes de Mistborn Mote", en: "Mistborn Mote nodes" }, expansion: "LW4", icon: "DF",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Pact Command Waypoint", wpCode: "[&BOAKAAA=]",
        farmType: "per_account",
        resetNote: { fr: "soft-reset daily 01h UTC+1 (min. 5-15h après récolte)", en: "daily soft-reset 01h UTC+1 (min. 5-15h after harvest)" },
        vendor: { fr: "Crystal Bloom Quartermaster — Mistborn Mote contre karma (Chute draconique)", en: "Crystal Bloom Quartermaster — Mistborn Mote for karma (Dragonfall)" },
        vendorWp: "Pact Command Waypoint [&BOAKAAA=]",
        tip: { fr: "Max 50 nodes de Mistborn Mote/compte/jour. Soft-reset à 01h. Le Crystal Bloom Quartermaster sur place vend des Mistborn Motes contre karma (5/jour — léger potentiel alt-swap).", en: "Max 50 Mistborn Mote nodes/account/day. Soft-reset at 01h. Crystal Bloom Quartermaster on-site sells Mistborn Mote for karma (5/day — slight alt-swap potential)." } },
    ],
    bounties: [
      { id: "bt_co", map: { fr: "Oasis de cristal", en: "Crystal Oasis" }, target: "Corrupted Facet", icon: "BT",
        waypoint: "Destiny's Gorge Waypoint", wpCode: "[&BLsKAAA=]",
        tip: { fr: "RDV habituel des bounty trains en LFG.", en: "Usual meeting point of LFG bounty trains." }, elegy: "4–50" },
      { id: "bt_dh", map: { fr: "Hautes-terres du désert", en: "Desert Highlands" }, target: "Ellutherius Wintergust", icon: "BF",
        waypoint: "Fortune's Vale Waypoint", wpCode: "[&BNQKAAA=]",
        tip: { fr: "Springer High Vault requis pour le Palace of Aban.", en: "Springer High Vault required for Palace of Aban." }, elegy: "4–50" },
      { id: "bt_er", map: { fr: "Rives de l'Elon", en: "Elon Riverlands" }, target: "Aetherblaze", icon: "EL",
        waypoint: "Augury's Shadow Waypoint", wpCode: "[&BLIKAAAA=]",
        tip: { fr: "Board de bounty à côté du WP meta.", en: "Bounty board next to the meta WP." }, elegy: "4–50" },
      { id: "bt_de", map: { fr: "La Désolation", en: "The Desolation" }, target: "Plaguelands", icon: "DS",
        waypoint: "Bonestrand Waypoint", wpCode: "[&BKMKAAA=]",
        tip: { fr: "Skimmer recommandé pour les zones de soufre.", en: "Skimmer recommended for the sulfur areas." }, elegy: "4–50" },
      { id: "bt_dv", map: { fr: "Domaine de Vabbi", en: "Domain of Vabbi" }, target: "Forged Rampager", icon: "FW",
        waypoint: "Vehjin Palace Waypoint", wpCode: "[&BA8KAAA=]",
        tip: { fr: "Souvent la plus peuplée grâce aux metas Forged.", en: "Often the most populated thanks to the Forged metas." }, elegy: "4–50" },
    ],
    // ── Collections / achievements de progression ─────────────
    collections: {
      vision_1: {
        id: 4762,
        name: "Vision I: Awakening",
        reward: "Gift of Insight",
        note: { fr: "Compléter les 6 Visions of [map] LW4 — une par zone Crystal Desert + Dragonfall.", en: "Complete the 6 Visions of [map] LW4 — one per Crystal Desert zone + Dragonfall." },
        subcollections: [
          { id: 4765, name: "Visions of Istan",             map: { fr: "Domaine d'Istan", en: "Domain of Istan" },        how: { fr: "Compléter des events + hearts en Domain of Istan", en: "Complete events + hearts in Domain of Istan" } },
          { id: 4760, name: "Visions of Kourna",            map: { fr: "Domaine de Kourna", en: "Domain of Kourna" },       how: { fr: "Compléter des events + hearts en Domain of Kourna", en: "Complete events + hearts in Domain of Kourna" } },
          { id: 4770, name: "Visions of Jahai",             map: { fr: "Promontoire de Jahai", en: "Jahai Bluffs" },           how: { fr: "Compléter des events + hearts en Jahai Bluffs", en: "Complete events + hearts in Jahai Bluffs" } },
          { id: 4774, name: "Visions of Sandswept Isles",   map: { fr: "Îles de Ventesable", en: "Sandswept Isles" },        how: { fr: "Compléter des events + hearts en Sandswept Isles", en: "Complete events + hearts in Sandswept Isles" } },
          { id: 4764, name: "Visions of Thunderhead Peaks", map: { fr: "Pics de Chef-Tonnerre", en: "Thunderhead Peaks" },      how: { fr: "Compléter des events + hearts en Thunderhead Peaks", en: "Complete events + hearts in Thunderhead Peaks" } },
          { id: 4757, name: "Visions of Dragonfall",        map: { fr: "Chute draconique", en: "Dragonfall" },             how: { fr: "Compléter des events + hearts en Dragonfall", en: "Complete events + hearts in Dragonfall" } },
        ],
      },
      vision_2: {
        id: 4771,
        name: "Vision II: Farsight",
        reward: "Gift of Prescience",
        note: { fr: "Compléter les 3 Requiem collections (Convergence of Sorrow I+II + Requiem Experiments 1–6).", en: "Complete the 3 Requiem collections (Convergence of Sorrow I+II + Requiem Experiments 1–6)." },
        subcollections: [
          { id: 4376, name: "The Convergence of Sorrow I: Elegy",   map: { fr: "Promontoire de Jahai", en: "Jahai Bluffs" },  how: { fr: "Collecter les 6 Elegy items — liés aux Requiem Armor collections", en: "Collect the 6 Elegy items — tied to the Requiem Armor collections" } },
          { id: 4362, name: "The Convergence of Sorrow II: Requiem", map: { fr: "Promontoire de Jahai", en: "Jahai Bluffs" }, how: { fr: "Collecter les 6 Requiem items — suite de Elegy", en: "Collect the 6 Requiem items — follow-up to Elegy" } },
        ],
      },
    },
    // ── Requiem collections (source d'Elegy Mosaic) ───────────
    requiem: {
      note: { fr: "Les 6 Requiem Experiments donnent chacun 50 Elegy Mosaics. Total : 300 pour Vision. Chaque collection se complète en Jahai Bluffs via Requiem Armor sets (drop + craft).", en: "The 6 Requiem Experiments each grant 50 Elegy Mosaics. Total: 300 for Vision. Each collection is completed in Jahai Bluffs via Requiem Armor sets (drop + craft)." },
      experiments: [
        { id: 4344, name: "Requiem: Experiment 1", elegy: 50, how: { fr: "Collecter les pièces d'armure Requiem tier 1 (drop Branded, craft)", en: "Collect the Requiem armor pieces tier 1 (Branded drops, craft)" } },
        { id: 4432, name: "Requiem: Experiment 2", elegy: 50, how: { fr: "Collecter les pièces d'armure Requiem tier 2", en: "Collect the Requiem armor pieces tier 2" } },
        { id: 4420, name: "Requiem: Experiment 3", elegy: 50, how: { fr: "Collecter les pièces d'armure Requiem tier 3", en: "Collect the Requiem armor pieces tier 3" } },
        { id: 4354, name: "Requiem: Experiment 4", elegy: 50, how: { fr: "Collecter les pièces d'armure Requiem tier 4", en: "Collect the Requiem armor pieces tier 4" } },
        { id: 4356, name: "Requiem: Experiment 5", elegy: 50, how: { fr: "Collecter les pièces d'armure Requiem tier 5", en: "Collect the Requiem armor pieces tier 5" } },
        { id: 4357, name: "Requiem: Experiment 6", elegy: 50, how: { fr: "Collecter les pièces d'armure Requiem tier 6 — complète la série", en: "Collect the Requiem armor pieces tier 6 — completes the series" } },
      ],
    },
  },

  aurora: {
    id: "aurora",
    name: "Aurora",
    type: { fr: "Accessoire", en: "Accessory" },
    expansion: "LW3",
    color: "#34d399",
    colorDim: "rgba(52,211,153,0.15)",
    icon: "*",
    description: { fr: "Accessoire légendaire — Monde vivant Saison 3", en: "Legendary Accessory — Living World Season 3" },
    resetType: "daily",
    currencies: [
      { id: "winterberry", name: "Winterberry", required: 250, icon: "WB", apiId: 79899,
        farmType: "per_char", perCharPerDay: 60, mapNote: "Bitterfrost Frontier" },
      { id: "petrified", name: "Petrified Wood", required: 250, icon: "PW", apiId: 79469,
        farmType: "per_account", perAccountPerDay: 45, mapNote: "Ember Bay + Draconis Mons" },
      { id: "jade", name: "Jade Shard", required: 250, icon: "JS", apiId: 80332,
        farmType: "per_account", perAccountPerDay: 40, mapNote: "Lake Doric" },
      { id: "fire_orchid", name: "Fire Orchid Blossom", required: 250, icon: "FO", apiId: 81127,
        farmType: "per_account", perAccountPerDay: 40, mapNote: "Draconis Mons" },
      { id: "orrian", name: "Orrian Pearl", required: 250, icon: "OP", apiId: 81706,
        farmType: "per_char_hearts", chestPerCharPerDay: 2, mapNote: "Siren's Landing",
        heartNote: { fr: "5 cœurs requis par personnage et par jour avant l'accès au coffre (~20 min)", en: "5 hearts required per character per day before chest access (~20 min)" } },
    ],
    metas: [
      { id: "bf", name: { fr: "Confins de Givramer", en: "Bitterfrost Frontier" }, subname: { fr: "Nodes de Fresh Winterberry", en: "Fresh Winterberry nodes" }, expansion: "LW3", icon: "BF",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Sorrow's Eclipse Waypoint", wpCode: "[&BH0JAAA=]",
        farmType: "per_char",
        resetNote: { fr: "soft-reset daily 01h UTC+1 (min. 5-15h après dernière récolte)", en: "daily soft-reset 01h UTC+1 (min. 5-15h after last harvest)" },
        tip: { fr: "~50-80 Winterberries par perso et par jour — 21 nodes sur la map. Thaw Elixir requis pour la zone froide. Reset : soft-reset à 01h, mais attendre 5-15h après la dernière récolte avant d'y retourner.", en: "~50-80 Winterberries per character per day — 21 nodes on the map. Thaw Elixir required for the cold zone. Reset: soft-reset at 01h, but wait 5-15h after your last harvest before returning." } },
      { id: "eb", name: { fr: "Baie des braises", en: "Ember Bay" }, subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "EB",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Savage Rise Waypoint", wpCode: "[&BNMJAAA=]",
        farmType: "per_account",
        resetNote: { fr: "soft-reset daily 01h UTC+1", en: "daily soft-reset 01h UTC+1" },
        vendor: { fr: "Seimur Oxbone — vend Fire Orchid Blossom et Petrified Wood contre karma", en: "Seimur Oxbone — sells Fire Orchid Blossom and Petrified Wood for karma" },
        vendorWp: "Savage Rise Waypoint [&BNMJAAA=]",
        tip: { fr: "~40 Lava Drops + Petrified Wood/compte/jour via nodes. Soft-reset à 01h. Le vendeur Seimur Oxbone sur place vend la currency contre karma (5/jour/perso — léger potentiel alt-swap).", en: "~40 Lava Drops + Petrified Wood/account/day via nodes. Soft-reset at 01h. Vendor Seimur Oxbone on-site sells currency for karma (5/day/character — slight alt-swap potential)." } },
      { id: "dm", name: { fr: "Mont Draconis", en: "Draconis Mons" }, subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "DM",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Heathen's Hold Waypoint", wpCode: "[&BOMJAAA=]",
        farmType: "per_account",
        resetNote: { fr: "soft-reset daily 01h UTC+1", en: "daily soft-reset 01h UTC+1" },
        vendor: { fr: "Nesa — vend Fire Orchid Blossom et Petrified Wood contre karma", en: "Nesa — sells Fire Orchid Blossom and Petrified Wood for karma" },
        vendorWp: "Heathen's Hold Waypoint [&BOMJAAA=]",
        tip: { fr: "~40 Fire Orchid + Petrified Wood/compte/jour via nodes. Soft-reset à 01h. Springer requis pour certains nodes. Vendeuse Nesa sur place (5/jour/perso — léger potentiel alt-swap).", en: "~40 Fire Orchid + Petrified Wood/account/day via nodes. Soft-reset at 01h. Springer required for some nodes. Vendor Nesa on-site (5/day/character — slight alt-swap potential)." } },
      { id: "ld", name: { fr: "Lac Doric", en: "Lake Doric" }, subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "LD",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Noran's Homestead Waypoint", wpCode: "[&BNQJAAA=]",
        farmType: "per_account",
        resetNote: { fr: "soft-reset daily 01h UTC+1", en: "daily soft-reset 01h UTC+1" },
        vendor: { fr: "Noran — vend Jade Shard contre karma", en: "Noran — sells Jade Shard for karma" },
        vendorWp: "Noran's Homestead Waypoint [&BNQJAAA=]",
        tip: { fr: "~40 Jade Shards/compte/jour via nodes. Soft-reset à 01h. Vendeur Noran sur place (5/jour/perso). Alt-swap minimal possible via le vendeur.", en: "~40 Jade Shards/account/day via nodes. Soft-reset at 01h. Vendor Noran on-site (5/day/character). Minimal alt-swap possible via vendor." } },
      { id: "sl", name: { fr: "Plage des sirènes", en: "Siren's Landing" }, subname: "Hidden Reliquary Chests", expansion: "LW3", icon: "SL",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Camp Reclamation Waypoint", wpCode: "[&BO8JAAA=]",
        farmType: "per_char_hearts",
        resetNote: { fr: "soft-reset daily 01h UTC+1", en: "daily soft-reset 01h UTC+1" },
        tip: { fr: "1 coffre gratuit + 1 payant (1,5po) par perso/jour. Les 5 hearts sont à refaire par perso avant l'accès (~20-30 min). Soft-reset à 01h. Alt-swap possible mais coûteux en temps.", en: "1 free chest + 1 paid (1.5g) per character/day. The 5 hearts must be redone per character before access (~20-30 min). Soft-reset at 01h. Alt-swap possible but time-costly." } },
      { id: "bf_meta", name: { fr: "Confins de Givramer", en: "Bitterfrost Frontier" }, subname: "Frozen Maw Meta", expansion: "LW3", icon: "BM",
        offsetUTC: 0, intervalMin: 120, durationMin: 20,
        waypoint: "Sorrow's Eclipse Waypoint", wpCode: "[&BH0JAAA=]",
        farmType: "per_account",
        resetNote: { fr: "Hero's Choice Chest : hard-reset quotidien 01h UTC+1", en: "Hero's Choice Chest: hard-reset daily 01h UTC+1" },
        tip: { fr: "Meta toutes les 2h — Hero's Choice Chest (1/compte/jour, hard-reset à 01h) + Winterberries bonus post-meta. Bonne densité de loot.", en: "Meta every 2h — Hero's Choice Chest (1/account/day, hard-reset at 01h) + bonus Winterberries post-meta. Good loot density." } },
    ],
    bounties: [],
  },

  conflux: {
    id: "conflux",
    name: "Conflux",
    type: { fr: "Anneau", en: "Ring" },
    expansion: "HoT",
    color: "#fb923c",
    colorDim: "rgba(251,146,60,0.15)",
    icon: "DI",
    description: { fr: "Anneau légendaire — exclusif Monde contre Monde", en: "Legendary Ring — World vs World exclusive" },
    resetType: "weekly",
    currencies: [
      { id: "tickets", name: "Skirmish Claim Tickets", required: 1850, icon: "SK", apiId: 26 },
      { id: "memory", name: "Memory of Battle", required: 1500, icon: "MB", apiId: 71581 },
      { id: "testimony", name: "Testimony of Heroics", required: 250, icon: "TH", apiId: 82 },
      { id: "badges", name: "Badge of Honor", required: 750, icon: "BH", apiId: 15 },
    ],
    metas: [],
    wvwActivities: [
      { id: "skirmish", name: { fr: "Piste de récompenses d'escarmouche", en: "Skirmish Reward Track" }, icon: "SR",
        limit: { fr: "365 tickets/semaine", en: "365 tickets/week" }, resetDay: "Lundi",
        tip: { fr: "Source principale de tickets. Maintenir une participation Gold+ pour maximiser les pips.", en: "Main ticket source. Maintain Gold+ participation to maximize pips." } },
      { id: "weeklies", name: { fr: "Hebdomadaires McM", en: "WvW Weeklies" }, icon: "WK",
        limit: { fr: "~150 tickets bonus/semaine", en: "~150 bonus tickets/week" }, resetDay: "Lundi",
        tip: { fr: "Compléter les objectifs hebdomadaires McM. À vérifier dans le menu Succès → McM.", en: "Complete WvW weekly objectives. Check in the Achievements → WvW menu." } },
      { id: "osr", name: { fr: "Récompenses d'objectifs évolutives", en: "Objective Scaling Rewards" }, icon: "LD",
        limit: { fr: "Variable selon activité", en: "Varies with activity" }, resetDay: "Continu",
        tip: { fr: "Rewards bonus pour capturer/défendre des objectifs à forte valeur. Rejoindre un commander actif.", en: "Bonus rewards for capturing/defending high-value objectives. Join an active commander." } },
      { id: "reward_track", name: { fr: "Piste « Don de bataille »", en: "Gift of Battle Track" }, icon: "RT",
        limit: { fr: "1 completion suffit", en: "1 completion is enough" }, resetDay: "Unique",
        tip: { fr: "Compléter le reward track 'Gift of Battle' — requis pour tous les légendaires. ~5-6 soirées.", en: "Complete the 'Gift of Battle' reward track — required for all legendaries. ~5-6 evenings." } },
    ],
    bounties: [],
  },

  warbringer: {
    id: "warbringer",
    name: "Warbringer",
    type: { fr: "Objet de dos", en: "Back item" },
    expansion: "Core",
    color: "#f87171",
    colorDim: "rgba(248,113,113,0.15)",
    icon: "WB",
    description: { fr: "Dos légendaire — exclusif Monde contre Monde (+ skin de planeur)", en: "Legendary Back item — World vs World exclusive (+ glider skin)" },
    resetType: "weekly",
    requirementNoteKey: "wb_req_note",
    currencies: [
      { id: "tickets", name: "Skirmish Claim Tickets", required: 2800, icon: "SK", apiId: 26 },
      { id: "memory",  name: "Memory of Battle",       required: 750,  icon: "MB", apiId: 71581 },
      { id: "badges",  name: "Badge of Honor",         required: 1250, icon: "BH", apiId: 15 },
      { id: "jade",    name: "Testimony of Jade Heroics", required: 500, icon: "JH", apiId: 65 },
    ],
    metas: [],
    wvwActivities: [
      { id: "skirmish", name: { fr: "Piste de récompenses d'escarmouche", en: "Skirmish Reward Track" }, icon: "SR",
        limit: { fr: "365 tickets/semaine", en: "365 tickets/week" }, resetDay: "Lundi",
        tip: { fr: "Source principale de tickets. Maintenir une participation Gold+ pour maximiser les pips.", en: "Main ticket source. Maintain Gold+ participation to maximize pips." } },
      { id: "weeklies", name: { fr: "Hebdomadaires McM", en: "WvW Weeklies" }, icon: "WK",
        limit: { fr: "~90 tickets bonus/semaine", en: "~90 bonus tickets/week" }, resetDay: "Lundi",
        tip: { fr: "Compléter les objectifs hebdomadaires McM. À vérifier dans le menu Succès → McM.", en: "Complete WvW weekly objectives. Check in the Achievements → WvW menu." } },
      { id: "war_razor", name: { fr: "Wings of War (War Razor)", en: "Wings of War (War Razor)" }, icon: "WR",
        limit: { fr: "4 paliers : 350/525/700/875 tickets", en: "4 tiers: 350/525/700/875 tickets" }, resetDay: "Unique",
        tip: { fr: "Précurseur Warcry : 4 objets de dos chez Legendary Commander War Razor (rangs 50/100/200/350). 2450 tickets au total.", en: "Warcry precursor: 4 back items from Legendary Commander War Razor (ranks 50/100/200/350). 2450 tickets total." } },
      { id: "reward_track", name: { fr: "Piste « Don de bataille » ×4", en: "Gift of Battle Track ×4" }, icon: "RT",
        limit: { fr: "4 completions requises", en: "4 completions required" }, resetDay: "Unique",
        tip: { fr: "4 Gifts of Battle nécessaires — 4 passages du reward track (~20-24 soirées au total).", en: "4 Gifts of Battle needed — 4 runs of the reward track (~20-24 evenings total)." } },
    ],
    bounties: [],
  },

  coalescence: {
    id: "coalescence",
    name: "Coalescence",
    type: { fr: "Anneau", en: "Ring" },
    expansion: "PoF",
    color: "#38bdf8",
    colorDim: "rgba(56,189,248,0.15)",
    icon: "CO",
    description: { fr: "Anneau légendaire — Raids (Wings 5-7 requis)", en: "Legendary Ring — Raids (Wings 5-7 required)" },
    resetType: "weekly",
    currencies: [
      { id: "insights",  name: "Legendary Insight", required: 150, icon: "LI", apiId: 70 },
      { id: "gaeting",   name: "Gaeting Crystal",   required: 100, icon: "GC", apiId: 39 },
      { id: "clovers",   name: "Mystic Clover",     required: 77,  icon: "MC", apiId: 19675 },
      { id: "coins",     name: "Mystic Coin",       required: 250, icon: "MN", apiId: 19976 },
    ],
    collectionNoteKeys: ["raids_li_note", "raids_wings_note"],
    raidAchievements: [
      { key: "coalescence_1", achievementId: 4035, name: "Coalescence I: Unbridled",
        tip: { fr: "Débloqué au premier kill de boss de raid. Collection de 10 objets (W5 Hall of Chains).", en: "Unlocked on first raid boss kill. 10-item collection (W5 Hall of Chains)." } },
      { key: "coalescence_2", achievementId: 4412, name: "Coalescence II: The Gift",
        tip: { fr: "Requiert Coalescence I. Alembic Apparatus : 100 Gaeting Crystals + 10 po chez Glenna (W6).", en: "Requires Coalescence I. Alembic Apparatus: 100 Gaeting Crystals + 10g from Glenna (W6)." } },
      { key: "coalescence_3", achievementId: 4805, name: "Coalescence III: Culmination",
        tip: { fr: "Requiert Coalescence II. Essences des 3 boss de W7 (Adina, Sabir, Qadim the Peerless).", en: "Requires Coalescence II. Essences from the 3 W7 bosses (Adina, Sabir, Qadim the Peerless)." } },
    ],
    metas: [],
    bounties: [],
  },

  selachimorpha: {
    id: "selachimorpha",
    name: "Selachimorpha",
    type: { fr: "Respirateur aquatique", en: "Aquabreather" },
    expansion: "VoE",
    color: "#2dd4bf",
    colorDim: "rgba(45,212,191,0.15)",
    icon: "SE",
    description: { fr: "Respirateur légendaire — Visions of Eternity (les 3 poids en un craft)", en: "Legendary Aquabreather — Visions of Eternity (all 3 weights in one craft)" },
    resetType: "daily",
    currencies: [
      { id: "notes",   name: "Research Note",  required: 5000, icon: "RN", apiId: 61 },
      { id: "clovers", name: "Mystic Clover",  required: 55,   icon: "MC", apiId: 19675 },
      { id: "shards",  name: "Obsidian Shard", required: 250,  icon: "OS", apiId: 19925 },
    ],
    raidAchievements: [
      { key: "selachi_agaleus", achievementId: 8869, name: "Acquiring Agaleus",
        tip: { fr: "Collection du précurseur en 24 étapes — démarre auprès de « Captain » Lakes au Pub Canach (Breezy Cay).", en: "24-step precursor collection — starts with \"Captain\" Lakes at Pub Canach (Breezy Cay)." } },
      { key: "selachi_diver", achievementId: 4177, name: "Master Diver",
        tip: { fr: "Étape 4 de la collection : 10 coffres immergés (Ornate Rusted Keys chez Dive Master Astora, Arche du Lion).", en: "Collection step 4: 10 sunken chests (Ornate Rusted Keys from Dive Master Astora, Lion's Arch)." } },
      { key: "selachi_shipwreck", achievementId: 8880, metaSubs: true, name: "Shipwreck Strand Mastery",
        tip: { fr: "Requis pour le Gift of Castoran Mastery — 30+ sous-achievements sur Shipwreck Strand.", en: "Required for the Gift of Castoran Mastery — 30+ sub-achievements on Shipwreck Strand." } },
      { key: "selachi_starlit", achievementId: 9057, metaSubs: true, name: "Starlit Weald Mastery",
        tip: { fr: "Requis pour le Gift of Castoran Mastery — 30+ sous-achievements sur Starlit Weald.", en: "Required for the Gift of Castoran Mastery — 30+ sub-achievements on Starlit Weald." } },
    ],
    collectionNoteKeys: ["sel_note1", "sel_note2"],
    metas: [],
    bounties: [],
  },

  eikasia: {
    id: "eikasia",
    name: "Eikasia, Mists-Grasper",
    type: { fr: "Gants", en: "Gloves" },
    expansion: "Core",
    color: "#c084fc",
    colorDim: "rgba(192,132,252,0.15)",
    icon: "EK",
    description: { fr: "Gants légendaires — Fractales quickplay (contenu gratuit)", en: "Legendary Gloves — Fractal quickplay (free content)" },
    resetType: "daily",
    currencies: [],
    raidAchievements: [
      { key: "eikasia_meta", achievementId: 8826, name: "Incursive Investigation",
        tip: { fr: "Meta-achievement — récompense : Eikasia, Mists-Grasper Choice (choix d'UN poids parmi les 3).", en: "Meta-achievement — reward: Eikasia, Mists-Grasper Choice (pick ONE of the 3 weights)." } },
      { key: "eikasia_relic", achievementId: 8823, name: "Incursive Investigation: Relic in the Mists",
        tip: { fr: "Étape 1 : compléter une fractale en quickplay et looter le coffre final, puis rapporter les Agony-Torn Gloves au Mist Stranger (Fort Marriner, Arche du Lion).", en: "Step 1: complete a quickplay fractal and loot the final chest, then bring the Agony-Torn Gloves to the Mist Stranger (Fort Marriner, Lion's Arch)." } },
      { key: "eikasia_working", achievementId: 8830, name: "Incursive Investigation: Working Together",
        tip: { fr: "Fil conducteur de la Fractalline Dust — quickplay + achievements annexes (la plupart donnent 10+ Dust).", en: "Fractalline Dust through-line — quickplay + side achievements (most grant 10+ Dust)." } },
      { key: "eikasia_r1", achievementId: 8840, name: "Incursive Investigation: First Recursion",
        tip: { fr: "150 Fractalline Dust.", en: "150 Fractalline Dust." } },
      { key: "eikasia_r2", achievementId: 8841, name: "Incursive Investigation: Second Recursion",
        tip: { fr: "300 Fractalline Dust cumulées.", en: "300 Fractalline Dust total." } },
      { key: "eikasia_r3", achievementId: 8835, name: "Incursive Investigation: Third Recursion",
        tip: { fr: "Dernière récursion avant la meta.", en: "Final recursion before the meta." } },
      { key: "eikasia_infinite", achievementId: 8814, name: "Incursive Investigation: Infinite Recursion",
        tip: { fr: "150 Dust — requis pour acheter les paires des 2 autres poids au vendor.", en: "150 Dust — required to buy the other 2 weight pairs from the vendor." } },
    ],
    collectionNoteKeys: ["eik_note1", "eik_note2"],
    metas: [],
    bounties: [],
  },

  upgrades: {
    id: "upgrades",
    name: "Legendary Upgrades",
    type: { fr: "Runes · Sigils · Relique", en: "Runes · Sigils · Relic" },
    expansion: "EoD / SotO",
    color: "#facc15",
    colorDim: "rgba(250,204,21,0.15)",
    icon: "UP",
    description: { fr: "Améliorations légendaires — swap libre de runes, sigils et relique sur tous les personnages", en: "Legendary upgrades — free rune, sigil and relic swapping across all characters" },
    resetType: "daily",
    // Totaux pour l'objectif confort 6 runes + 2 sigils + 1 relique (recettes wiki vérifiées)
    currencies: [
      { id: "provisioner", name: "Provisioner Token",        required: 450,   icon: "PT", apiId: 29 },
      { id: "lucent_pile", name: "Pile of Lucent Crystal",   required: 23250, icon: "LP", apiId: 89271 },
      { id: "clovers",     name: "Mystic Clover",            required: 205,   icon: "MC", apiId: 19675 },
      { id: "ectos",       name: "Glob of Ectoplasm",        required: 1050,  icon: "EC", apiId: 19721 },
      { id: "shards",      name: "Obsidian Shard",           required: 450,   icon: "OS", apiId: 19925 },
    ],
    raidAchievements: [
      { key: "rune_collector", achievementId: 7796, name: "Legendary Rune Collector",
        tip: { fr: "Compteur de runes liées au compte (max 7 : 6 armure + 1 respirateur). 6 suffisent pour un set terrestre complet.", en: "Account-bound rune counter (max 7: 6 armor + 1 aquabreather). 6 cover a full land set." },
        recipe: {
          fr: ["1 Rune = MF : Gift of Runes + Gift of Condensed Magic + Gift of Condensed Might + Gift of Craftsmanship",
               "Gift of Runes = 50× Mystic Aspect + 20× Mystic Clover + 100× Ectos + 50× Obsidian Shard",
               "1 Mystic Aspect (craft 75, Armorsmith/LW/Tailor) = 10× Pile of Lucent Crystal + 1× Charm of Brilliance + 1× Charm of Potence + 1× Charm of Skill",
               "→ Par rune : 500 Piles Lucent + 50 charms de CHAQUE type + 20 Clovers + 100 Ectos + 50 Obby Shards + 50 Provisioner Tokens + T6 (Condensed ×2)"],
          en: ["1 Rune = MF: Gift of Runes + Gift of Condensed Magic + Gift of Condensed Might + Gift of Craftsmanship",
               "Gift of Runes = 50× Mystic Aspect + 20× Mystic Clover + 100× Ectos + 50× Obsidian Shard",
               "1 Mystic Aspect (craft 75, Armorsmith/LW/Tailor) = 10× Pile of Lucent Crystal + 1× Charm of Brilliance + 1× Charm of Potence + 1× Charm of Skill",
               "→ Per rune: 500 Lucent Piles + 50 charms of EACH type + 20 Clovers + 100 Ectos + 50 Obby Shards + 50 Provisioner Tokens + T6 (Condensed ×2)"]
        } },
      { key: "sigil_collector", achievementId: 7788, name: "Legendary Sigil Collector",
        tip: { fr: "Compteur de sigils liés au compte (max 8 : 2 sets d'armes terrestres + aquatique). 2-4 couvrent l'essentiel.", en: "Account-bound sigil counter (max 8: 2 land weapon sets + aquatic). 2-4 cover most needs." },
        recipe: {
          fr: ["1 Sigil = MF : Gift of Sigils + Gift of Condensed Magic + Gift of Condensed Might + Gift of Craftsmanship",
               "Gift of Sigils = 75× Mystic Mote + 30× Mystic Clover + 150× Ectos + 75× Obsidian Shard",
               "1 Mystic Mote (craft 75, Artificer/Huntsman/Weaponsmith) = 10× Pile of Lucent Crystal + 1× Symbol of Control + 1× Symbol of Enhancement + 1× Symbol of Pain",
               "→ Par sigil : 750 Piles Lucent + 75 symbols de CHAQUE type + 30 Clovers + 150 Ectos + 75 Obby Shards + 50 Provisioner Tokens + T6 (Condensed ×2)"],
          en: ["1 Sigil = MF: Gift of Sigils + Gift of Condensed Magic + Gift of Condensed Might + Gift of Craftsmanship",
               "Gift of Sigils = 75× Mystic Mote + 30× Mystic Clover + 150× Ectos + 75× Obsidian Shard",
               "1 Mystic Mote (craft 75, Artificer/Huntsman/Weaponsmith) = 10× Pile of Lucent Crystal + 1× Symbol of Control + 1× Symbol of Enhancement + 1× Symbol of Pain",
               "→ Per sigil: 750 Lucent Piles + 75 symbols of EACH type + 30 Clovers + 150 Ectos + 75 Obby Shards + 50 Provisioner Tokens + T6 (Condensed ×2)"]
        } },
      { key: "relic_components", achievementId: 7829, name: "Legendary Relics: Components",
        tip: { fr: "Guide des composants de la relique (une seule requise). Lyhr peut assister le craft à la Wizard's Tower.", en: "Relic component guide (only one needed). Lyhr can assist crafting at the Wizard's Tower." },
        recipe: {
          fr: ["1 Relique = MF : Gift of Relics + Gift of Condensed Magic + Gift of Condensed Might + Gift of Craftsmanship",
               "Gift of Relics = 25× Mystic Facet + 25× Mystic Clover + 150× Ectos + 1× Gift of Research",
               "1 Mystic Facet = MF : 1× Relique (exotique, n'importe laquelle) + 750× Pile of Lucent Crystal — chance rare d'en produire 5 d'un coup !",
               "→ Pour la relique : 18 750 Piles Lucent (moins avec les procs ×5) + 25 reliques exotiques + 25 Clovers + 150 Ectos + Gift of Research + 50 Provisioner Tokens + T6"],
          en: ["1 Relic = MF: Gift of Relics + Gift of Condensed Magic + Gift of Condensed Might + Gift of Craftsmanship",
               "Gift of Relics = 25× Mystic Facet + 25× Mystic Clover + 150× Ectos + 1× Gift of Research",
               "1 Mystic Facet = MF: 1× Relic (any exotic) + 750× Pile of Lucent Crystal — rare chance to output 5 at once!",
               "→ For the relic: 18,750 Lucent Piles (less with ×5 procs) + 25 exotic relics + 25 Clovers + 150 Ectos + Gift of Research + 50 Provisioner Tokens + T6"]
        } },
    ],
    collectionNoteKeys: ["up_note1", "up_note2"],
    metas: [],
    bounties: [],
  },

  weapons: {
    id: "weapons",
    name: "Legendary Weapons",
    type: { fr: "Armes (Gen 3 — Aurene)", en: "Weapons (Gen 3 — Aurene)" },
    expansion: "EoD",
    color: "#60a5fa",
    colorDim: "rgba(96,165,250,0.15)",
    icon: "⚔",
    description: { fr: "Armes légendaires génération 3 — matrice de ciblage (16 armes)", en: "Generation 3 legendary weapons — targeting matrix (16 weapons)" },
    resetType: "weekly",
    isWeaponTracker: true,
    // IDs découverts au runtime via /v2/legendaryarmory (les 96937-96952 "consécutifs" étaient faux — seul 96937 existait)
    currenciesPerWeapon: [
      { id: "antique",    name: "Antique Summoning Stone",         perUnit: 100,  icon: "AS", apiId: 96978 },
      { id: "runestones", name: "Jade Runestone",                  perUnit: 100,  icon: "JR", apiId: 96722 },
      { id: "clovers",    name: "Mystic Clover",                   perUnit: 38,   icon: "MC", apiId: 19675 },
      { id: "lodestones", name: "Amalgamated Draconic Lodestone",  perUnit: 5,    icon: "DL", apiId: 92687 },
      { id: "notes",      name: "Research Note",                   perUnit: 3000, icon: "RN", apiId: 61 },
    ],
    currencies: [],
    collectionNoteKeys: ["wpn_note1", "wpn_note2"],
    metas: [],
    bounties: [],
  },

  t6: {
    id: "t6",
    name: "Matériaux T6",
    type: { fr: "Trophées T6 — Condensed Magic & Might", en: "T6 Trophies — Condensed Magic & Might" },
    expansion: "Global",
    color: "#fb7185",
    colorDim: "rgba(251,113,133,0.15)",
    icon: "T6",
    description: { fr: "Les 8 trophées T6 — demande transverse de presque tous les légendaires", en: "The 8 T6 trophies — cross-cutting demand from almost every legendary" },
    resetType: "daily",
    // Barres = 1 paire Condensed (200 de chaque) ; voir t6_demand pour les multiplicateurs
    currencies: [
      { id: "blood", name: "Vial of Powerful Blood", required: 200, icon: "BL", apiId: 24295 },
      { id: "venom", name: "Powerful Venom Sac",     required: 200, icon: "VE", apiId: 24283 },
      { id: "totem", name: "Elaborate Totem",        required: 200, icon: "TO", apiId: 24300 },
      { id: "dust",  name: "Pile of Crystalline Dust", required: 200, icon: "DU", apiId: 24277 },
      { id: "claw",  name: "Vicious Claw",           required: 200, icon: "CL", apiId: 24351 },
      { id: "bone",  name: "Ancient Bone",           required: 200, icon: "BO", apiId: 24358 },
      { id: "fang",  name: "Vicious Fang",           required: 200, icon: "FA", apiId: 24357 },
      { id: "scale", name: "Armored Scale",          required: 200, icon: "SC", apiId: 24289 },
    ],
    currencyNoteKeys: ["t6_demand", "t6_src1", "t6_src2", "t6_src3"],
    metas: [],
    bounties: [],
  },

  obsidian: {
    id: "obsidian",
    name: "Obsidian Armor",
    type: "Armor set",
    expansion: "SotO",
    color: "#818cf8",
    colorDim: "rgba(129,140,248,0.15)",
    icon: "⬡",
    description: "Legendary Armor — Secrets of the Obscure (Open World)",
    resetType: "daily",
    isArmorSet: true,
    pieces: 6,
    armoryApiIds: [101516, 101462, 101499, 101536, 101501, 101535, 101614, 101645, 101556, 101570, 101579, 101602, 101544, 101551, 101521, 101609, 101568, 101460],
    slots: ["head", "shoulders", "chest", "gloves", "legs", "boots"],
    weights: ["Light", "Medium", "Heavy"],
    arcanum: {
      head:      { achievementId: 7214, name: "Astral Thought",    boss: "Ignaxious",                   gift: "magical" },
      shoulders: { achievementId: 7098, name: "Astral Bearing",    boss: "Galene the Seething",         gift: "magical" },
      chest:     { achievementId: 7096, name: "Astral Heartbeat",  boss: "Nourys, Eyes of the Abyss",   gift: "magical" },
      gloves:    { achievementId: 7219, name: "Astral Grasp",      boss: "Pherus the Subjugator",       gift: "mighty" },
      legs:      { achievementId: 7240, name: "Astral Stride",     boss: "Knaebelag the Terror",        gift: "mighty" },
      boots:     { achievementId: 7051, name: "Astral Footprints", boss: "Myros the Spiteful",          gift: "mighty" },
    },
    // Coûts par pièce — "required" calculé dynamiquement selon l'objectif
    currenciesPerPiece: [
      { id: "amalgamated", name: "Amalgamated Rift Essence", perPiece: 12,   icon: "AR", apiId: 100081 },
      { id: "fine",        name: "Fine Rift Essence",        perPiece: 3000, icon: "F1", apiId: 78 },
      { id: "masterwork",  name: "Masterwork Rift Essence",  perPiece: 1200, icon: "M2", apiId: 80 },
      { id: "rare",        name: "Rare Rift Essence",        perPiece: 600,  icon: "R3", apiId: 79 },
      { id: "provisioner", name: "Provisioner Token",        perPiece: 50,   icon: "PT", apiId: 29 },
      { id: "clovers",     name: "Mystic Clover",            perPiece: 9,    icon: "MC", apiId: 19675 },
      { id: "shards",      name: "Obsidian Shard",           perPiece: 50,   icon: "OS", apiId: 19925 },
      { id: "ectos",       name: "Glob of Ectoplasm",        perPiece: 600,  icon: "EC", apiId: 19721 },
    ],
    currencies: [],
    metas: [
      { id: "obs_sw", name: "Skywatch Archipelago", subname: "Unlocking the Wizard's Tower", expansion: "SotO", icon: "SW",
        offsetUTC: 60, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "bon", next: "obs_am", nextDelayMin: 60,
        waypoint: "Droknar's Light Waypoint", wpCode: "[&BL4NAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Hero's Choice Chest → Case of Captured Lightning. Complétion de carte → Gift of Skywatch (repeatable)." },
      { id: "obs_am", name: "Amnytas", subname: "The Defense of Amnytas", expansion: "SotO", icon: "AM",
        offsetUTC: 0, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "bon", next: "obs_sw", nextDelayMin: 60,
        waypoint: "Bastion of the Natural Waypoint", wpCode: "[&BDQOAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Hero's Choice Chest → Pouch of Stardust. Complétion de carte → Gift of Amnytas (repeatable)." },
      { id: "obs_spider", name: "Inner Nayos", subname: "Into the Spider's Lair", expansion: "SotO", icon: "SL",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Citadel of Zakiros — Forward Bivouac Waypoint", wpCode: "[&BHYOAAA=]",
        resetNote: "Conditionnel — pas de timer fixe",
        tip: "Meta conditionnelle : Road to Heitor + Fangs That Gnash doivent être complétées sur la map. Citadel of Zakiros: Hero's Choice Chest → Case/Clot/Pouch au choix." },
      { id: "obs_conv_mb", name: "Convergence", subname: "Mount Balrior (public)", expansion: "JW", icon: "CV",
        offsetUTC: 0, intervalMin: 180, durationMin: 20,
        efficience: "S", population: "bon", next: "obs_conv_on", nextDelayMin: 30,
        waypoint: "Wizard's Tower — portail Convergences", wpCode: "",
        resetNote: "Coffre daily par type d'instance",
        tip: "Toutes les 3h à XX:00 UTC. Grosse source d'essences Rift gratuites (12-25/run)." },
      { id: "obs_conv_on", name: "Convergence", subname: "Outer Nayos (public)", expansion: "SotO", icon: "CV",
        offsetUTC: 30, intervalMin: 180, durationMin: 20,
        efficience: "S", population: "bon", next: "obs_conv_mb", nextDelayMin: 150,
        waypoint: "Wizard's Tower — portail Convergences", wpCode: "",
        resetNote: "Coffre daily par type d'instance",
        tip: "Toutes les 3h à XX:30 UTC (90 min après Balrior). Essences Rift gratuites + progression Suffused T2." },
    ],
    bounties: [],
  },

  prismatic: {
    id: "prismatic",
    name: "Prismatic",
    type: { fr: "Amulette", en: "Amulet" },
    expansion: "LW",
    color: "#a855f7",
    colorDim: "rgba(168,85,247,0.15)",
    icon: "❆",
    description: { fr: "Prismatic Champion's Regalia — Saisons des dragons", en: "Prismatic Champion's Regalia — Seasons of the Dragons" },
    resetType: "daily",
    currencies: [],
    metas: [],
    bounties: [],
    achievementId: 5790,
    achievementTiers: [
      { id: "tier1", name: "Tier 1 — Living World S2", icon: "◆", color: "#60a5fa",
        episodes: [
          { bit: 0,  name: "Return to Entanglement" },
          { bit: 1,  name: "Return to The Dragon's Reach, Part 1" },
          { bit: 2,  name: "Return to The Dragon's Reach, Part 2" },
          { bit: 3,  name: "Return to Echoes of the Past" },
          { bit: 4,  name: "Return to Tangled Paths" },
          { bit: 5,  name: "Return to Seeds of Truth" },
        ],
        tip: { fr: "6 épisodes LW S2. Dry Top + Silverwastes. Aucun or requis — progression pure par achievements.", en: "6 LW S2 episodes. Dry Top + Silverwastes. No gold required — pure achievement progression." } },
      { id: "tier2", name: "Tier 2 — Living World S3", icon: "◆", color: "#34d399",
        episodes: [
          { bit: 6,  name: "Return to Out of the Shadows" },
          { bit: 7,  name: "Return to Rising Flames" },
          { bit: 8,  name: "Return to A Crack in the Ice" },
          { bit: 9,  name: "Return to The Head of the Snake" },
          { bit: 10, name: "Return to Flashpoint" },
          { bit: 11, name: "Return to One Path Ends" },
        ],
        tip: { fr: "6 épisodes LW S3 — synergique avec Aurora. One Path Ends = accès Siren's Landing.", en: "6 LW S3 episodes — synergizes with Aurora. One Path Ends = access to Siren's Landing." } },
      { id: "tier3", name: "Tier 3 — Living World S4", icon: "◆", color: "#fbbf24",
        episodes: [
          { bit: 12, name: "Return to Daybreak" },
          { bit: 13, name: "Return to A Bug in the System" },
          { bit: 14, name: "Return to Long Live the Lich" },
          { bit: 15, name: "Return to A Star to Guide Us" },
          { bit: 16, name: "Return to All or Nothing" },
          { bit: 17, name: "Return to War Eternal" },
        ],
        tip: { fr: "6 épisodes LW S4 — synergique avec Vision.", en: "6 LW S4 episodes — synergizes with Vision." } },
      { id: "tier4", name: "Tier 4 — Icebrood Saga", icon: "◆", color: "#fb923c",
        episodes: [
          { bit: 18, name: "Return to Prologue: Bound by Blood" },
          { bit: 19, name: "Return to Whisper in the Dark" },
          { bit: 20, name: "Return to Shadow in the Ice" },
          { bit: 21, name: "Return to No Quarter" },
          { bit: 22, name: "Return to Jormag Rising" },
          { bit: 23, name: "Return to Champions" },
        ],
        tip: { fr: "6 épisodes Icebrood Saga. Récompense finale : Prismatic Champion's Regalia.", en: "6 Icebrood Saga episodes. Final reward: Prismatic Champion's Regalia." } },
    ],
  },
  trinkets: {
    id: "trinkets",
    name: "Trinkets",
    type: { fr: "Colifichets ×7", en: "Trinkets ×7" },
    expansion: "Multi",
    color: "#5eead4",
    colorDim: "rgba(94,234,212,0.15)",
    icon: "◈",
    description: { fr: "Colifichets légendaires restants — guide détaillé par item", en: "Remaining legendary trinkets — detailed per-item guide" },
    resetType: "daily",
    isTrinketTracker: true,
    trinketKeys: ["endless_summer", "stella_radians", "strife_unending", "orrax_manifested", "ad_infinitum", "the_ascension", "transcendence"],
  },
};

// ── Obsidian Armor : libellés slots / poids (i18n locale) ──
const OBS_SLOT_LABELS = {
  en: { head: "Head", shoulders: "Shoulders", chest: "Chest", gloves: "Gloves", legs: "Legs", boots: "Boots" },
  fr: { head: "Tête", shoulders: "Épaules", chest: "Torse", gloves: "Gants", legs: "Jambes", boots: "Bottes" },
};
const OBS_WEIGHT_LABELS = {
  en: { Light: "Light", Medium: "Medium", Heavy: "Heavy" },
  fr: { Light: "Léger", Medium: "Intermédiaire", Heavy: "Lourd" },
};

// ═══════════════════════════════════════════════════════════════
// MATÉRIAUX COMMUNS
// ═══════════════════════════════════════════════════════════════

const COMMON_MATS = [
  { id: "clovers", name: "Mystic Clover", required: 77, icon: "MC", apiId: 19675,
    tip: { fr: "Login rewards (7/mois via Chest of Loyalty), PvP/WvW reward tracks", en: "Login rewards (7/month via Chest of Loyalty), PvP/WvW reward tracks" } },
  { id: "coins", name: "Mystic Coin", required: 250, icon: "MN", apiId: 19976,
    tip: { fr: "Login quotidien principalement. ~30/mois de base.", en: "Mostly daily login. ~30/month baseline." } },
  { id: "ectos", name: "Glob of Ectoplasm", required: 250, icon: "EC", apiId: 19721,
    tip: { fr: "Salvage de rares niveau 68+. Drop abondant pendant les metas.", en: "Salvage rare gear lvl 68+. Abundant drops during metas." } },
  { id: "obsidian", name: "Obsidian Shard", required: 100, icon: "OS", apiId: 19925,
    tip: { fr: "Karma — merchants de maps LW ou Temples de Orr.", en: "Karma — LW map merchants or Temples of Orr." } },
];

// ═══════════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════════

function getDailyKey(legId) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return `gw2_${legId}_daily_${d.toISOString().slice(0, 10)}`;
}

function getWeeklyKey(legId) {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
  return `gw2_${legId}_weekly_${monday.toISOString().slice(0, 10)}`;
}

function getCurrencyKey(legId) { return `gw2_${legId}_currencies`; }
function getCommonKey() { return `gw2_common_mats`; }

function getNextMetaOccurrence(meta, now) {
  if (meta.isTimeless) return null;
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const curMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  let next = meta.offsetUTC;
  while (next <= curMin) next += meta.intervalMin;
  const extraDays = Math.floor(next / 1440);
  return new Date(todayUTC + extraDays * 86400000 + (next % 1440) * 60000);
}

// Retourne la meta "best next" avec son heure calculée dynamiquement
function getBestNext(meta, allMetas, now) {
  if (!meta.next) return null;
  const nextMeta = allMetas.find(m => m.id === meta.next);
  if (!nextMeta || nextMeta.isTimeless) return null;
  const nextOccurrence = getNextMetaOccurrence(nextMeta, now);
  if (!nextOccurrence) return null;
  const msUntil = nextOccurrence - now;
  return { meta: nextMeta, date: nextOccurrence, ms: msUntil };
}

const EFFICIENCE_COLORS = { S: "#4ade80", A: "#e2c97e", B: "#fb923c", C: "rgba(226,201,126,0.3)" };
const POPULATION_LABELS = {
  "LFG": "pop_LFG", "public": "pop_public", "bon": "pop_bon",
  "moyen": "pop_moyen", "variable": "pop_variable", "morte": "pop_morte",
};

function formatCountdown(ms) {
  if (!ms || ms <= 0) return "EN COURS";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m ${String(s % 60).padStart(2, "0")}s`;
}

function formatLocalTime(date) {
  return date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "—";
}

async function storeGet(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function storeSet(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

// ═══════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// GRAND TOTAL — moteur de calcul + composant UI
// ═══════════════════════════════════════════════════════════════

// ── Groupes de légendaires pour le sélecteur ──────────────────
const GT_GROUPS = [
  {
    id: "gen1", label: "Gen 1 — Core", color: "#c084fc",
    ids: Object.keys(SOURCES_DB?.legendaries ?? {}).filter(k => k.startsWith("gen1_") && k !== "gen1_weapon_generic").sort()
  },
  {
    id: "gen2", label: "Gen 2 — HoT / PoF", color: "#60a5fa",
    ids: Object.keys(SOURCES_DB?.legendaries ?? {}).filter(k => k.startsWith("gen2_") && k !== "gen2_weapon_generic").sort()
  },
  {
    id: "gen3", label: "Gen 3 — Aurene (EoD)", color: "#34d399",
    ids: Object.keys(SOURCES_DB?.legendaries ?? {}).filter(k => k.startsWith("gen3_") && k !== "gen3_weapon_generic").sort()
  },
  {
    id: "armors", label: "Armures", color: "#fb923c",
    ids: ["perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"]
  },
  {
    id: "standalone", label: "Standalone", color: "#f472b6",
    ids: Object.keys(SOURCES_DB?.legendaries ?? {}).filter(k =>
      !k.startsWith("gen1_") && !k.startsWith("gen2_") && !k.startsWith("gen3_") &&
      !["perfected_envoy","obsidian","triumphant_hero","ardent_glorious"].includes(k) &&
      !k.endsWith("_generic")
    ).sort()
  },
];

// ── Armor set : nb pièces requises (toujours 6) ───────────────
const ARMOR_PIECE_COUNT = 6;
const ARMOR_IDS = ["perfected_envoy","obsidian","triumphant_hero","ardent_glorious"];

// ── Farm type → couleur badge ─────────────────────────────────
const FARM_COLOR = {
  "PvE": "#4ade80",
  "PvP": "#60a5fa",
  "WvW": "#fb923c",
  "Fractals": "#a78bfa",
  "Mixte": "#e2c97e",
  "Variable": "#6b7280",
};

function farmColor(src) {
  if (!src) return FARM_COLOR["Mixte"];
  const t = (src.type || src || "").toLowerCase();
  if (t.includes("pvp") || t.includes("league")) return FARM_COLOR["PvP"];
  if (t.includes("wvw") || t.includes("skirmish") || t.includes("badge")) return FARM_COLOR["WvW"];
  if (t.includes("fractal")) return FARM_COLOR["Fractals"];
  if (t.includes("vendor") || t.includes("mystic_forge") || t.includes("map_currency") || t.includes("meta") || t.includes("salvage") || t.includes("craft") || t.includes("tp")) return FARM_COLOR["PvE"];
  return FARM_COLOR["Mixte"];
}

// ── Moteur grand total ────────────────────────────────────────
function computeGrandTotal(selectedIds) {
  const cc = SOURCES_DB?.craft_components ?? {};
  const legs = SOURCES_DB?.legendaries ?? {};
  const totals = {};   // compId → qty
  const variable = []; // composants non chiffrables

  for (const [compId, comp] of Object.entries(cc)) {
    const qty = comp.qty ?? {};
    for (const legId of selectedIds) {
      // Armes normales
      if (qty[legId] !== undefined) {
        const val = qty[legId];
        if (typeof val === "number") {
          totals[compId] = (totals[compId] ?? 0) + val;
        } else if (typeof val === "string") {
          if (!variable.find(v => v.compId === compId)) {
            variable.push({ compId, name: comp.name, note: val });
          }
        }
      }
      // Armor sets : __per_piece × 6
      const pieceKey = legId + "__per_piece";
      if (qty[pieceKey] !== undefined && ARMOR_IDS.includes(legId)) {
        const val = qty[pieceKey];
        if (typeof val === "number") {
          totals[compId] = (totals[compId] ?? 0) + val * ARMOR_PIECE_COUNT;
        }
      }
      // __full_set
      const setKey = legId + "__full_set";
      if (qty[setKey] !== undefined && ARMOR_IDS.includes(legId)) {
        const val = qty[setKey];
        if (typeof val === "number") {
          totals[compId] = (totals[compId] ?? 0) + val;
        }
      }
    }
  }
  return { totals, variable };
}

// ── Composant principal Grand Total ──────────────────────────
function GrandTotalTab({ ownedIds = new Set(), manualOwnedIds = new Set(), onToggleManual, apiKey = "", setApiKey, apiStatus = "idle", apiError = "", onDetect, stocks = {}, stockStatus = "idle", stockError = "", onFetchStocks, onSetStockManual }) {
  const t = useT();
  const [selected, setSelected] = useState({});        // legId → bool
  const [collapsed, setCollapsed] = useState({});      // groupId → bool
  const [filterFarm, setFilterFarm] = useState("all");
  const [showVariables, setShowVariables] = useState(false);
  const [showApiInput, setShowApiInput] = useState(false);
  const [editingComp, setEditingComp] = useState(null); // compId en cours d'édition manuelle
  const [editVal, setEditVal] = useState("");

  const legs = SOURCES_DB?.legendaries ?? {};
  const cc   = SOURCES_DB?.craft_components ?? {};

  // ── Sync : retirer les owned de selected quand ownedIds/manualOwnedIds change ─
  useEffect(() => {
    const allOwned = new Set([...ownedIds, ...manualOwnedIds]);
    if (allOwned.size === 0) return;
    setSelected(prev => {
      const next = { ...prev };
      for (const lid of allOwned) delete next[lid];
      return next;
    });
  }, [ownedIds, manualOwnedIds]);

  // ── Toggle légendaire ────────────────────────────────────────
  const toggle = (id) => setSelected(prev => {
    const next = { ...prev };
    if (next[id]) delete next[id]; else next[id] = true;
    return next;
  });

  // ── Select/deselect groupe ───────────────────────────────────
  const toggleGroup = (group) => {
    const allOn = group.ids.every(id => selected[id]);
    setSelected(prev => {
      const next = { ...prev };
      for (const id of group.ids) {
        if (allOn) delete next[id]; else next[id] = true;
      }
      return next;
    });
  };

  // ── Calcul grand total ───────────────────────────────────────
  const selectedIds = Object.keys(selected).filter(k => selected[k]);
  const { totals, variable } = computeGrandTotal(selectedIds);

  // ── Trier par missing desc, filtrer selon farm ───────────────
  const rows = Object.entries(totals)
    .filter(([, qty]) => qty > 0)
    .map(([compId, qty]) => {
      const comp = cc[compId] ?? {};
      const src = comp.sources?.[0] ?? {};
      const apiId = comp.apiId;
      const hasStock = apiId && (String(apiId) in stocks);
      const owned = apiId ? (stocks[String(apiId)] ?? 0) : null;
      const missing = owned !== null ? Math.max(0, qty - owned) : null;
      const pct = owned !== null ? Math.min(100, (owned / qty) * 100) : null;
      const stockKnown = owned !== null; // true si apiId connu (même si 0)
      const farmLabel =
        src.type?.includes("pvp") || src.type?.includes("league") ? "PvP" :
        src.type?.includes("wvw") || src.type?.includes("skirmish") ? "WvW" :
        src.type?.includes("fractal") ? "Fractals" :
        src.type ? "PvE" : "Mixte";
      return { compId, name: comp.name ?? compId, qty, owned, missing, pct, apiId, hasStock,
               farm: farmColor(src), farmLabel, tip: L(src.tip) ?? "" };
    })
    .filter(r => filterFarm === "all" || r.farmLabel === filterFarm)
    .sort((a, b) => {
      // Priorité : items avec missing > 0 en premier, triés par missing desc
      const ma = a.missing ?? a.qty;
      const mb = b.missing ?? b.qty;
      return mb - ma;
    });

  const farmTypes = ["all", "PvE", "WvW", "PvP", "Fractals", "Mixte"];
  const totalComponents = rows.length;
  const C = "#e2c97e";
  const D = "rgba(226,201,126,";

  return (
    <div style={{ paddingBottom: 40 }}>

      {/* ── API KEY DÉTECTION ── */}
      <div style={{ margin: "10px 14px 0" }}>
        <button
          onClick={() => setShowApiInput(!showApiInput)}
          style={{
            background: apiStatus === "ok" ? "rgba(74,222,128,0.06)" : "rgba(226,201,126,0.04)",
            border: `1px solid ${apiStatus === "ok" ? "rgba(74,222,128,0.25)" : D+"0.15)"}`,
            borderRadius: 6, padding: "7px 12px",
            color: apiStatus === "ok" ? "#4ade80" : apiStatus === "error" ? "#f87171" : D+"0.6)",
            fontFamily: "'Cinzel', serif", fontSize: 10, cursor: "pointer",
            letterSpacing: "0.08em", width: "100%", textAlign: "left",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
          <span>
            {apiStatus === "ok" ? t("gt_detected", { n: ownedIds.size, m: manualOwnedIds.size }) :
             apiStatus === "loading" ? t("gt_detecting") :
             apiStatus === "error" ? `✗ ${apiError}` :
             t("gt_autodetect")}
          </span>
          <span style={{ opacity: 0.4 }}>{showApiInput ? "▲" : "▼"}</span>
        </button>

        {showApiInput && (
          <div style={{ marginTop: 6, padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: `1px solid ${D}0.1)`, borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: D+"0.4)", fontFamily: "'Crimson Text', serif", marginBottom: 6 }}>
              {t("gt_apikey_pre")}<code style={{ color: D+"0.6)" }}>inventories</code>{t("gt_apikey_post")}
              {" "}{t("gt_apikey_flasknote")}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey && setApiKey(e.target.value)}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                style={{
                  flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${D}0.2)`,
                  borderRadius: 4, padding: "5px 8px", color: C,
                  fontFamily: "monospace", fontSize: 11, outline: "none"
                }}
              />
              <button
                onClick={() => onDetect && onDetect(apiKey)}
                disabled={apiStatus === "loading" || !apiKey.trim()}
                style={{
                  background: apiStatus === "loading" ? D+"0.04)" : "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.25)", borderRadius: 4,
                  padding: "5px 12px", color: "#4ade80",
                  fontFamily: "'Cinzel', serif", fontSize: 10, cursor: "pointer", letterSpacing: "0.05em"
                }}>
                {apiStatus === "loading" ? "⟳" : t("gt_detect_btn")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── SYNC STOCKS ── */}
      <div style={{ margin: "10px 14px 0", display: "flex", gap: 6, alignItems: "center" }}>
        <button
          onClick={() => onFetchStocks && onFetchStocks(apiKey)}
          disabled={stockStatus === "loading"}
          style={{
            flex: 1, padding: "7px 12px", borderRadius: 6, cursor: apiKey.trim() ? "pointer" : "default",
            fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.06em",
            border: `1px solid ${stockStatus === "ok" ? "rgba(74,222,128,0.25)" : stockStatus === "error" ? "rgba(248,113,113,0.25)" : "rgba(226,201,126,0.15)"}`,
            background: stockStatus === "ok" ? "rgba(74,222,128,0.06)" : stockStatus === "error" ? "rgba(248,113,113,0.06)" : "rgba(226,201,126,0.04)",
            color: stockStatus === "ok" ? "#4ade80" : stockStatus === "error" ? "#f87171" : "rgba(226,201,126,0.6)",
          }}>
          {stockStatus === "loading" ? t("gt_syncing") :
           stockStatus === "ok" ? t("gt_synced", { n: Object.keys(stocks).filter(k => !k.startsWith("_")).length }) :
           stockStatus === "error" ? `✗ ${stockError}` :
           t("gt_sync_btn")}
        </button>
        {stocks._synced_at && (
          <div style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif", flexShrink: 0, textAlign: "right" }}>
            {stocks._sync_source === "manual" ? "📦 Local" : "🔗 API"}<br/>
            {new Date(stocks._synced_at * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>

      {/* ── SÉLECTEUR LÉGENDAIRES PAR GROUPE ── */}
      <div style={{ margin: "10px 14px 0" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          color: D+"0.3)", fontFamily: "'Crimson Text', serif", marginBottom: 6 }}>
          {t("gt_legs_to_craft", { n: selectedIds.length })}
          <span style={{ textTransform: "none", letterSpacing: 0, marginLeft: 8, opacity: 0.6 }}>
            {t("gt_owned_hint_pre")}<span style={{ color: "#4ade80" }}>✓</span>{t("gt_owned_hint_post")}
          </span>
        </div>

        {GT_GROUPS.map(group => {
          const isCollapsed = collapsed[group.id];
          const allOn = group.ids.length > 0 && group.ids.every(id => selected[id]);
          const someOn = group.ids.some(id => selected[id]);

          return (
            <div key={group.id} style={{ marginBottom: 6, border: `1px solid ${D}0.1)`, borderRadius: 8, overflow: "hidden" }}>
              {/* Header groupe */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px", background: "rgba(255,255,255,0.02)",
                cursor: "pointer", userSelect: "none"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={() => toggleGroup(group)}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 3,
                    border: `1.5px solid ${group.color}`,
                    background: allOn ? group.color : someOn ? group.color + "44" : "transparent",
                    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {allOn && <span style={{ fontSize: 9, color: "#080c18", fontWeight: 900 }}>✓</span>}
                    {someOn && !allOn && <span style={{ fontSize: 9, color: group.color, fontWeight: 900 }}>−</span>}
                  </div>
                  <span style={{ fontSize: 11, color: group.color, fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
                    {group.label}
                  </span>
                  <span style={{ fontSize: 9, color: D+"0.35)", fontFamily: "'Crimson Text', serif" }}>
                    ({group.ids.filter(id => selected[id]).length}/{group.ids.length})
                  </span>
                </div>
                <button
                  onClick={() => setCollapsed(prev => ({ ...prev, [group.id]: !prev[group.id] }))}
                  style={{ background: "none", border: "none", color: D+"0.3)", cursor: "pointer", fontSize: 11, padding: "0 4px" }}>
                  {isCollapsed ? "▶" : "▼"}
                </button>
              </div>

              {/* Items du groupe */}
              {!isCollapsed && (
                <div style={{ padding: "4px 10px 8px", display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {group.ids.map(id => {
                    const leg = legs[id] ?? {};
                    const isOwnedApi = ownedIds.has(id);
                    const isOwnedManual = manualOwnedIds.has(id);
                    const isOwned = isOwnedApi || isOwnedManual;
                    const isOn = !!selected[id];
                    const label = NL(id, leg.name ?? id);
                    // Raccourcir les noms gen3 "Aurene's X"
                    const shortLabel = label.replace("Aurene's ", "").replace("Gen1 ", "").replace("Gen2 ", "");

                    return (
                      <button
                        key={id}
                        onClick={() => {
                          if (isOwnedApi) return; // API-owned : non modifiable
                          if (isOwnedManual) {
                            onToggleManual && onToggleManual(id); // décocher manuel
                          } else if (!isOn) {
                            toggle(id); // sélectionner pour craft
                          } else {
                            toggle(id); // désélectionner
                          }
                        }}
                        onContextMenu={e => {
                          e.preventDefault();
                          if (!isOwnedApi) onToggleManual && onToggleManual(id);
                        }}
                        title={isOwnedApi ? t("gt_title_api", { label }) : isOwnedManual ? t("gt_title_manual", { label }) : label}
                        style={{
                          padding: "3px 8px", borderRadius: 4, fontSize: 10, cursor: isOwnedApi ? "default" : "pointer",
                          fontFamily: "'Cinzel', serif", letterSpacing: "0.04em",
                          border: `1px solid ${isOwnedApi ? D+"0.1)" : isOwnedManual ? "rgba(74,222,128,0.35)" : isOn ? group.color : D+"0.18)"}`,
                          background: isOwnedApi ? D+"0.02)" : isOwnedManual ? "rgba(74,222,128,0.08)" : isOn ? group.color + "22" : "rgba(255,255,255,0.02)",
                          color: isOwnedApi ? D+"0.2)" : isOwnedManual ? "#4ade80" : isOn ? group.color : D+"0.5)",
                          opacity: isOwnedApi ? 0.5 : 1,
                          textDecoration: isOwned ? "line-through" : "none",
                          transition: "all 0.15s"
                        }}>
                        {isOwnedApi ? "🔗 " : isOwnedManual ? "✓ " : ""}{shortLabel}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── RÉSULTAT GRAND TOTAL ── */}
      {selectedIds.length === 0 ? (
        <div style={{ margin: "20px 14px", padding: "20px", textAlign: "center",
          border: `1px dashed ${D}0.1)`, borderRadius: 8,
          color: D+"0.25)", fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: 13 }}>
          {t("gt_empty")}
        </div>
      ) : (
        <div style={{ margin: "10px 14px 0" }}>

          {/* Résumé + filtres */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
            <div style={{ fontSize: 11, color: C, fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
              {t("gt_summary", { comp: totalComponents, n: selectedIds.length, s: selectedIds.length > 1 ? "s" : "" })}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {farmTypes.map(ft => (
                <button key={ft} onClick={() => setFilterFarm(ft)} style={{
                  padding: "2px 8px", borderRadius: 3, fontSize: 9, cursor: "pointer",
                  fontFamily: "'Cinzel', serif", letterSpacing: "0.05em",
                  border: `1px solid ${filterFarm === ft ? (FARM_COLOR[ft] ?? C) : D+"0.15)"}`,
                  background: filterFarm === ft ? (FARM_COLOR[ft] ?? C) + "22" : "rgba(255,255,255,0.02)",
                  color: filterFarm === ft ? (FARM_COLOR[ft] ?? C) : D+"0.45)",
                  transition: "all 0.15s"
                }}>
                  {ft === "all" ? t("gt_filter_all") : ft}
                </button>
              ))}
            </div>
          </div>

          {/* Resources table */}
          {rows.length === 0 ? (
            <div style={{ padding: "12px", textAlign: "center", color: D+"0.3)",
              fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: 12 }}>
              {t("gt_no_resources")}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {rows.map(({ compId, name, qty, owned, missing, pct, apiId, hasStock, farm, farmLabel, tip }) => (
                <div key={compId} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 10px", borderRadius: 5,
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${D}0.07)`,
                  transition: "background 0.12s"
                }}>
                  {/* Badge farm */}
                  <div style={{
                    width: 38, flexShrink: 0, textAlign: "center",
                    fontSize: 8, fontFamily: "'Cinzel', serif", letterSpacing: "0.04em",
                    padding: "2px 0", borderRadius: 2,
                    background: farm + "18", color: farm, border: `1px solid ${farm}33`
                  }}>
                    {farmLabel}
                  </div>
                  {/* Nom + barre de progression */}
                  <div style={{ flex: 1, fontSize: 11, color: C, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                      <div style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.04em",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {name}
                      </div>
                      {/* Qty / owned display */}
                      <div style={{ flexShrink: 0, textAlign: "right", fontFamily: "'Cinzel', serif" }}>
                        {owned !== null ? (
                          <span style={{ fontSize: 10 }}>
                            <span style={{ color: owned >= qty ? "#4ade80" : hasStock ? "#fb923c" : "rgba(226,201,126,0.4)", fontWeight: 700 }}>
                              {owned.toLocaleString("en-US")}
                            </span>
                            <span style={{ color: "rgba(226,201,126,0.3)", fontSize: 9 }}>
                              {" / "}{qty.toLocaleString("en-US")}
                            </span>
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 700,
                            color: qty >= 1000 ? "#f87171" : qty >= 500 ? "#fb923c" : qty >= 100 ? C : "#4ade80" }}>
                            {qty.toLocaleString("en-US")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Barre de progression — visible si apiId connu */}
                    {pct !== null && (
                      <div style={{ marginTop: 3, height: 4, borderRadius: 2,
                        background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 2, transition: "width 0.4s ease",
                          width: `${pct}%`,
                          background: !hasStock ? "rgba(226,201,126,0.15)"
                            : pct >= 100 ? "#4ade80"
                            : pct >= 60 ? "#e2c97e"
                            : pct >= 30 ? "#fb923c"
                            : "#f87171"
                        }} />
                      </div>
                    )}

                    {/* Tip + manquants */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 1 }}>
                      {tip && (
                        <div style={{ fontSize: 9, color: D+"0.3)", fontFamily: "'Crimson Text', serif",
                          fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                          {String(tip).slice(0, 70)}{String(tip).length > 70 ? "…" : ""}
                        </div>
                      )}
                      {missing !== null && missing > 0 && (
                        <div style={{ fontSize: 9, color: "#f87171", fontFamily: "'Cinzel', serif",
                          flexShrink: 0, marginLeft: 4, letterSpacing: "0.03em" }}>
                          −{missing.toLocaleString("en-US")}
                        </div>
                      )}
                      {missing === 0 && (
                        <div style={{ fontSize: 9, color: "#4ade80", fontFamily: "'Cinzel', serif",
                          flexShrink: 0, marginLeft: 4 }}>✓ OK</div>
                      )}
                    </div>

                    {/* Manual edit (click if source=manual or no stock) */}
                    {editingComp === compId && (
                      <div style={{ display: "flex", gap: 4, marginTop: 4, alignItems: "center" }}>
                        <input
                          type="number" min="0"
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              onSetStockManual && onSetStockManual(apiId, parseInt(editVal) || 0);
                              setEditingComp(null);
                            }
                            if (e.key === "Escape") setEditingComp(null);
                          }}
                          autoFocus
                          style={{ width: 70, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(226,201,126,0.3)",
                            borderRadius: 3, padding: "2px 6px", color: C, fontFamily: "monospace", fontSize: 11, outline: "none" }}
                        />
                        <button onClick={() => { onSetStockManual && onSetStockManual(apiId, parseInt(editVal) || 0); setEditingComp(null); }}
                          style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
                            borderRadius: 3, padding: "2px 8px", color: "#4ade80", fontSize: 10, cursor: "pointer" }}>✓</button>
                        <button onClick={() => setEditingComp(null)}
                          style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                            borderRadius: 3, padding: "2px 8px", color: "#f87171", fontSize: 10, cursor: "pointer" }}>✗</button>
                      </div>
                    )}
                  </div>

                  {/* Bouton édition manuelle */}
                  {apiId && editingComp !== compId && (
                    <button
                      onClick={() => { setEditingComp(compId); setEditVal(String(owned ?? 0)); }}
                      title="Saisir manuellement"
                      style={{ flexShrink: 0, background: "none", border: "none",
                        color: "rgba(226,201,126,0.2)", cursor: "pointer", fontSize: 11,
                        padding: "0 2px", lineHeight: 1 }}>
                      ✎
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Section variable / non chiffrable */}
          {variable.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <button onClick={() => setShowVariables(!showVariables)} style={{
                background: "none", border: `1px solid ${D}0.1)`, borderRadius: 5,
                padding: "6px 10px", color: D+"0.4)", fontFamily: "'Cinzel', serif",
                fontSize: 9, cursor: "pointer", letterSpacing: "0.08em", width: "100%", textAlign: "left"
              }}>
                {t("gt_uncountable", { n: variable.length, s: variable.length > 1 ? "s" : "", arrow: showVariables ? "▲" : "▼" })}
              </button>
              {showVariables && (
                <div style={{ marginTop: 4, padding: "8px 10px", background: "rgba(251,146,60,0.03)",
                  border: `1px solid rgba(251,146,60,0.1)`, borderRadius: 5 }}>
                  {variable.map(v => (
                    <div key={v.compId} style={{ fontSize: 10, color: "rgba(251,146,60,0.6)",
                      fontFamily: "'Crimson Text', serif", padding: "2px 0" }}>
                      <span style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.04em" }}>{NX(v.name)}</span>
                      {v.note && <span style={{ opacity: 0.6 }}> — {NX(v.note)}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default function GW2LegendaryTracker() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("gw2_lang") || "en"; } catch (_) { return "en"; }
  });
  // ⚠ Ne pas utiliser useT() ici : le Provider est défini PAR ce composant,
  // useContext y renverrait la valeur par défaut ("en") en permanence.
  const t = useCallback((key, vars) => translate(key, lang, vars), [lang]);
  const [now, setNow] = useState(new Date());
  const [selectedLeg, setSelectedLeg] = useState("vision");
  const [activeTab, setActiveTab] = useState("metas");
  const [selTrinket, setSelTrinket] = useState("endless_summer");
  const [trinketSteps, setTrinketSteps] = useState(() => {
    try { return (JSON.parse(localStorage.getItem("gw2_trinket_steps") ?? "null") ?? {}); } catch { return {}; }
  });
  CUR_LANG = lang; // sync du résolveur L() — le render racine précède les enfants
  const [frNames, setFrNames] = useState({ legs: FR_LEG_NAMES, terms: FR_TERM_MAP, stats: null });
  FR_LEG_NAMES = frNames.legs; FR_TERM_MAP = frNames.terms; // sync des résolveurs NL()/NX()
  useEffect(() => {
    if (lang !== "fr" || Object.keys(frNames.legs).length > 0) return;
    let dead = false;
    const commit = (m) => {
      if (dead) return;
      try { localStorage.setItem(NAMES_CACHE_KEY, JSON.stringify({ v: NAMES_CACHE_VER, legs: m.legs, terms: m.terms, stats: m.stats })); } catch (_) {}
      setFrNames({ legs: { ...m.legs }, terms: { ...m.terms }, stats: m.stats });
    };
    fetchFrLegNames(commit).then(commit).catch(() => {});
    return () => { dead = true; };
  }, [lang]);
  const setLangPersist = useCallback((l) => {
    setLang(l);
    try { localStorage.setItem("gw2_lang", l); } catch (_) {}
  }, []);
  useEffect(() => {
    let stored = null;
    try { stored = localStorage.getItem("gw2_lang"); } catch (_) {}
    if (stored) return;
    fetch("http://127.0.0.1:5000/health", { signal: AbortSignal.timeout(2000) })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && I18N[d.server_lang]) setLang(d.server_lang); })
      .catch(() => {});
  }, []);
  const langRef = useRef(lang);
  useEffect(() => { langRef.current = lang; }, [lang]);

  // ── Obsidian : résolution nom/poids/slot des 18 pièces via /v2/items (public, cache par langue) ──
  useEffect(() => {
    if (selectedLeg !== "obsidian") return;
    const ids = LEGENDARIES.obsidian.armoryApiIds;
    const cacheKey = `gw2_obsidian_items_${lang}_v1`;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) ?? "null");
      if (cached && Object.keys(cached).length === ids.length) { setObsItems(cached); return; }
    } catch (_) {}
    fetch(`https://api.guildwars2.com/v2/items?ids=${ids.join(",")}&lang=${lang}`)
      .then(r => (r.ok ? r.json() : null))
      .then(list => {
        if (!Array.isArray(list)) return;
        const SLOT_MAP = { Helm: "head", Shoulders: "shoulders", Coat: "chest", Gloves: "gloves", Leggings: "legs", Boots: "boots" };
        const map = {};
        for (const it of list) {
          const dt = (it && it.details) ? it.details : {};
          map[String(it.id)] = {
            name: it.name,
            weight: dt.weight_class ?? "?",
            slot: SLOT_MAP[dt.type] ?? (dt.type ?? "?"),
          };
        }
        setObsItems(map);
        try { localStorage.setItem(cacheKey, JSON.stringify(map)); } catch (_) {}
      })
      .catch(() => {});
  }, [selectedLeg, lang]);

  // ── Collections : définitions des étapes (bits) via /v2/achievements + résolution items ──
  useEffect(() => {
    const list = LEGENDARIES[selectedLeg]?.raidAchievements;
    if (!list || list.length === 0) return;
    const ids = list.map(a => a.achievementId);
    const cacheKey = `gw2_ach_bits_${selectedLeg}_${lang}_v3`;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) ?? "null");
      if (cached) { setAchBitsDefs(cached); return; }
    } catch (_) {}
    (async () => {
      try {
        const r = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${ids.join(",")}&lang=${lang}`);
        if (!r.ok) return;
        const defs = await r.json();
        const itemIds = new Set();
        for (const d of defs) for (const b of (d.bits ?? [])) {
          if (b.type === "Item" && b.id) itemIds.add(b.id);
        }
        const names = {};
        const arr = [...itemIds];
        for (let k = 0; k < arr.length; k += 150) {
          const chunk = arr.slice(k, k + 150);
          const ri = await fetch(`https://api.guildwars2.com/v2/items?ids=${chunk.join(",")}&lang=${lang}`);
          if (ri.ok) for (const it of await ri.json()) names[String(it.id)] = it.name;
        }
        const out = {};
        for (const d of defs) out[String(d.id)] = { bits: d.bits ?? [], names };
        // Métas sans bits (masteries de cartes) : lister les achievements de leur catégorie
        // — uniquement pour les entrées marquées metaSubs (les Collectors n'ont pas d'étapes listables)
        const metaIds = new Set(list.filter(a => a.metaSubs).map(a => a.achievementId));
        const metas = defs.filter(d => (d.bits ?? []).length === 0 && metaIds.has(d.id));
        if (metas.length > 0) {
          let cats = null;
          try { cats = JSON.parse(localStorage.getItem("gw2_ach_categories_v1") ?? "null"); } catch (_) {}
          if (!cats) {
            const rc = await fetch("https://api.guildwars2.com/v2/achievements/categories?ids=all");
            if (rc.ok) {
              const full = await rc.json();
              cats = full.map(c => ({ id: c.id, achievements: (c.achievements ?? []).map(x => (typeof x === "object" ? x.id : x)) }));
              try { localStorage.setItem("gw2_ach_categories_v1", JSON.stringify(cats)); } catch (_) {}
            }
          }
          if (cats) {
            for (const m of metas) {
              const cat = cats.find(c => c.achievements.includes(m.id));
              if (!cat) continue;
              const subIds = cat.achievements.filter(x => x !== m.id).slice(0, 60);
              const subs = [];
              for (let k = 0; k < subIds.length; k += 150) {
                const chunk = subIds.slice(k, k + 150);
                const rs = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${chunk.join(",")}&lang=${lang}`);
                if (rs.ok) for (const s of await rs.json()) subs.push({ id: s.id, name: s.name });
              }
              out[String(m.id)].subs = subs;
            }
          }
        }
        setAchBitsDefs(out);
        try { localStorage.setItem(cacheKey, JSON.stringify(out)); } catch (_) {}
      } catch (_) {}
    })();
  }, [selectedLeg, lang]);

  // ── Statuts des sous-achievements (métas) via Flask ──
  useEffect(() => {
    const allSubs = [];
    for (const d of Object.values(achBitsDefs)) {
      for (const s of (d.subs ?? [])) allSubs.push(s.id);
    }
    if (allSubs.length === 0) return;
    const missing = allSubs.filter(id => achSubStatus[String(id)] === undefined);
    if (missing.length === 0) return;
    (async () => {
      try {
        const oKey = (gtApiKey ?? "").trim();
        const url = `http://127.0.0.1:5000/api/achievements/status?ids=${missing.slice(0, 200).join(",")}` + (oKey ? `&key=${encodeURIComponent(oKey)}` : "");
        const r = await fetch(url);
        if (!r.ok) return;
        const data = await r.json();
        setAchSubStatus(prev => {
          const next = { ...prev, ...data };
          try { localStorage.setItem("gw2_ach_substatus", JSON.stringify(next)); } catch (_) {}
          return next;
        });
      } catch (_) { /* Flask absent */ }
    })();
  }, [achBitsDefs]);

  // ── Armes : découverte runtime via /v2/legendaryarmory + /v2/items (zéro ID hardcodé) ──
  useEffect(() => {
    if (selectedLeg !== "weapons") return;
    const cacheKey = `gw2_weapons_items_${lang}_v2`;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) ?? "null");
      if (cached && Object.keys(cached).length > 0) { setWpnItems(cached); return; }
    } catch (_) {}
    (async () => {
      try {
        const ra = await fetch("https://api.guildwars2.com/v2/legendaryarmory?ids=all");
        if (!ra.ok) return;
        const armory = await ra.json();
        const allIds = armory.map(e => e.id);
        const map = {};
        for (let k = 0; k < allIds.length; k += 150) {
          const chunk = allIds.slice(k, k + 150);
          const ri = await fetch(`https://api.guildwars2.com/v2/items?ids=${chunk.join(",")}&lang=${lang}`);
          if (!ri.ok) continue;
          for (const it of await ri.json()) {
            if (it.type !== "Weapon") continue;
            // Phase 1 : gen3 (armes d'Aurene). La langue change le nom affiché mais
            // le filtre doit rester stable → on refetche le nom EN si lang ≠ en.
            map[String(it.id)] = { name: it.name, wtype: (it.details ?? {}).type ?? "?" };
          }
        }
        // Filtre gen3 : noms EN pour la stabilité du filtre
        let enNames = {};
        if (lang !== "en") {
          const wIds = Object.keys(map);
          for (let k = 0; k < wIds.length; k += 150) {
            const chunk = wIds.slice(k, k + 150);
            const re = await fetch(`https://api.guildwars2.com/v2/items?ids=${chunk.join(",")}&lang=en`);
            if (re.ok) for (const it of await re.json()) enNames[String(it.id)] = it.name;
          }
        } else {
          for (const [id, v] of Object.entries(map)) enNames[id] = v.name;
        }
        const gen3 = {};
        for (const [id, v] of Object.entries(map)) {
          if ((enNames[id] ?? "").startsWith("Aurene's")) gen3[id] = v;
        }
        setWpnItems(gen3);
        try { localStorage.setItem(cacheKey, JSON.stringify(gen3)); } catch (_) {}
      } catch (_) {}
    })();
  }, [selectedLeg, lang]);

  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  // API Flask
  const [apiStatus, setApiStatus] = useState("idle");
  const [apiError, setApiError]   = useState("");

  // Données par légendaire
  const [dailyChecked, setDailyChecked] = useState({});
  const [weeklyChecked, setWeeklyChecked] = useState({});
  const [bountyDone, setBountyDone] = useState({});
  const [currencies, setCurrencies] = useState({});
  const [commonMats, setCommonMats] = useState({});
  const [numChars, setNumChars] = useState(1); // persos éligibles Aurora
  // Prismatic — progression achievements (bits + done via API)
  const [prismaticProgress, setPrismaticProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_prismatic_progress") ?? "null") ?? {}; } catch { return {}; }
  });

  // Aurora — progression collections (bits par sous-collection)
  const [auroraCollections, setAuroraCollections] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_aurora_collections") ?? "null") ?? {}; } catch { return {}; }
  });
  // Aurora — expanded sous-collection dans l'onglet collections
  const [auroraSubExpanded, setAuroraSubExpanded] = useState(null);

  // Vision — progression collections
  const [visionCollections, setVisionCollections] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_vision_collections") ?? "null") ?? {}; } catch { return {}; }
  });
  const [visionSubExpanded, setVisionSubExpanded] = useState(null);

  // ── Obsidian Armor : objectif par pièce, items résolus, armory brut, achievements ──
  const [obsTarget, setObsTarget] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("gw2_obsidian_target_v1") ?? "[]")); } catch { return new Set(); }
  });
  const toggleObsTarget = useCallback((id) => {
    setObsTarget(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      try { localStorage.setItem("gw2_obsidian_target_v1", JSON.stringify([...next])); } catch (_) {}
      return next;
    });
  }, []);
  const [obsItems, setObsItems] = useState(null);
  const [wpnTarget, setWpnTarget] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("gw2_weapons_target_v1") ?? "[]")); } catch { return new Set(); }
  });
  const toggleWpnTarget = useCallback((id) => {
    setWpnTarget(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      try { localStorage.setItem("gw2_weapons_target_v1", JSON.stringify([...next])); } catch (_) {}
      return next;
    });
  }, []);
  const [wpnItems, setWpnItems] = useState(null);
  const [achBitsDefs, setAchBitsDefs] = useState({});
  const [achSubStatus, setAchSubStatus] = useState(() => {
    try { return (JSON.parse(localStorage.getItem("gw2_ach_substatus") ?? "null") ?? {}); } catch { return {}; }
  });
  const [expandedAch, setExpandedAch] = useState(null);
  const [armoryRaw, setArmoryRaw] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("gw2_armory_raw_v1") ?? "[]")); } catch { return new Set(); }
  });
  const [apiAch, setApiAch] = useState(() => {
    try { return (JSON.parse(localStorage.getItem("gw2_api_achievements") ?? "null") ?? {}); } catch { return {}; }
  });
  const [obsAch, setObsAch] = useState(() => {
    try { return (JSON.parse(localStorage.getItem("gw2_obsidian_achievements") ?? "null") ?? {}); } catch { return {}; }
  });


  // Grand Total
  const [gtApiKey, setGtApiKey] = useState(() => {
    try { return localStorage.getItem("gw2_gt_apikey") ?? ""; } catch { return ""; }
  });
  const [gtOwnedIds, setGtOwnedIds] = useState(new Set());
  const [gtManualOwnedIds, setGtManualOwnedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("gw2_gt_manual_owned") ?? "[]")); } catch { return new Set(); }
  });
  const toggleGtManualOwned = useCallback((id) => {
    setGtManualOwnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("gw2_gt_manual_owned", JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);
  const [gtApiStatus, setGtApiStatus] = useState("idle");
  const [gtApiError, setGtApiError] = useState("");

  // Stocks hybride : {apiId(str) → qty, _synced_at, _sync_source}
  const [gtStocks, setGtStocks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_gt_stocks") ?? "{}"); } catch { return {}; }
  });
  const [gtStockStatus, setGtStockStatus] = useState("idle"); // idle|loading|ok|error
  const [gtStockError, setGtStockError] = useState("");

  const isGrandTotal = selectedLeg === "grand_total";
  const leg = isGrandTotal ? null : LEGENDARIES[selectedLeg];
  const isWeekly = leg?.resetType === "weekly";

  // ── Fetch depuis le serveur Flask local
  const fetchFromFlask = useCallback(async () => {
    setApiStatus("loading");
    setApiError("");
    try {
      const resp = await fetch(`http://127.0.0.1:5000/api/progression?lang=${langRef.current}`);
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      for (const [legId, vals] of Object.entries(data.currencies ?? {})) {
        const cur = await storeGet(getCurrencyKey(legId)) ?? {};
        await storeSet(getCurrencyKey(legId), { ...cur, ...vals });
      }
      if (data.achievements) {
        try { localStorage.setItem("gw2_api_achievements", JSON.stringify(data.achievements)); } catch (_) {}
        setApiAch(data.achievements);
      }
      if (data.common) {
        await storeSet(getCommonKey(), data.common);
        setCommonMats(data.common);
      }
      if (data.prismatic) {
        const pp = data.prismatic;
        localStorage.setItem("gw2_prismatic_progress", JSON.stringify(pp));
        setPrismaticProgress(pp);
      }
      // Fetch Aurora collections en parallèle
      try {
        const aKey = (gtApiKey ?? "").trim();
        const aUrl = aKey
          ? `http://127.0.0.1:5000/api/achievements/aurora?key=${encodeURIComponent(aKey)}&lang=${langRef.current}`
          : `http://127.0.0.1:5000/api/achievements/aurora?lang=${langRef.current}`;
        const aResp = await fetch(aUrl);
        if (aResp.ok) {
          const aData = await aResp.json();
          localStorage.setItem("gw2_aurora_collections", JSON.stringify(aData));
          setAuroraCollections(aData);
        }
      } catch (_) { /* Flask absent ou endpoint non dispo */ }
      // Fetch Vision collections en parallèle
      try {
        const vKey = (gtApiKey ?? "").trim();
        const vUrl = vKey
          ? `http://127.0.0.1:5000/api/achievements/vision?key=${encodeURIComponent(vKey)}&lang=${langRef.current}`
          : `http://127.0.0.1:5000/api/achievements/vision?lang=${langRef.current}`;
        const vResp = await fetch(vUrl);
        if (vResp.ok) {
          const vData = await vResp.json();
          localStorage.setItem("gw2_vision_collections", JSON.stringify(vData));
          setVisionCollections(vData);
        }
      } catch (_) { /* Flask absent ou endpoint non dispo */ }
      // Fetch Obsidian achievements en parallèle
      try {
        const oKey = (gtApiKey ?? "").trim();
        const oUrl = oKey
          ? `http://127.0.0.1:5000/api/achievements/obsidian?key=${encodeURIComponent(oKey)}&lang=${langRef.current}`
          : `http://127.0.0.1:5000/api/achievements/obsidian?lang=${langRef.current}`;
        const oResp = await fetch(oUrl);
        if (oResp.ok) {
          const oData = await oResp.json();
          localStorage.setItem("gw2_obsidian_achievements", JSON.stringify(oData));
          setObsAch(oData);
        }
      } catch (_) { /* Flask absent ou endpoint non dispo */ }
      const freshCurr = await storeGet(getCurrencyKey(selectedLeg)) ?? {};
      setCurrencies(freshCurr);
      setApiStatus("ok");
      setTimeout(() => setApiStatus("idle"), 3000);
    } catch (e) {
      setApiStatus("error");
      setApiError(e.message);
    }
  }, [selectedLeg]);

  // ── Grand Total : détection armory via Flask puis fallback direct ──────────
  const detectGtArmory = useCallback(async (keyOverride) => {
    const key = (keyOverride ?? gtApiKey ?? "").trim();
    setGtApiStatus("loading");
    setGtApiError("");

    const reverseMap = SOURCES_DB?._meta?.armory_apiid_to_legid ?? {};

    // 1. Essayer Flask (clé déjà stockée côté serveur)
    let data = null;
    let usedFlask = false;
    try {
      const flaskResp = await fetch(
        `http://127.0.0.1:5000/api/legendaryarmory?lang=${langRef.current}`,
        { headers: { "X-API-Key": key }, signal: AbortSignal.timeout(3000) }
      );
      if (flaskResp.ok) { data = await flaskResp.json(); usedFlask = true; }
    } catch (_) { /* Flask absent, continuer */ }

    // 2. Fallback : appel direct GW2 API — uniquement si clé disponible
    if (!data && key) {
      try {
        const resp = await fetch(
          `https://api.guildwars2.com/v2/account/legendaryarmory?access_token=${key.trim()}`
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        data = await resp.json();
      } catch (e) {
        setGtApiStatus("error");
        setGtApiError(e.message);
        return;
      }
    }

    const ownedSet = new Set();
    for (const item of (Array.isArray(data) ? data : [])) {
      const legIds = reverseMap[String(item.id)] ?? [];
      for (const lid of legIds) ownedSet.add(lid);
    }
    setGtOwnedIds(ownedSet);
    const rawSet = new Set((Array.isArray(data) ? data : []).map(it => Number(it.id)));
    setArmoryRaw(rawSet);
    try { localStorage.setItem("gw2_armory_raw_v1", JSON.stringify([...rawSet])); } catch (_) {}
    setGtApiStatus("ok");
    // Persister la clé
    try { localStorage.setItem("gw2_gt_apikey", key.trim()); } catch (_) {}
  }, [gtApiKey]);

  // ── Grand Total : fetch stocks bulk ─────────────────────────────────────────
  const fetchGtStocks = useCallback(async (keyOverride) => {
    const key = (keyOverride ?? gtApiKey ?? "").trim();
    // Pas de clé → on essaie quand même Flask (qui utilisera son .env)
    // Si Flask absent ET pas de clé → erreur
    setGtStockStatus("loading");
    setGtStockError("");

    // Collecter tous les apiIds valides depuis craft_components
    const cc = SOURCES_DB?.craft_components ?? {};
    const apiIds = [...new Set(
      Object.values(cc)
        .map(c => c.apiId)
        .filter(id => id && typeof id === "number")
    )];

    let data = null;
    let flaskErr = null;

    // 1. Essayer Flask via POST (évite limite URL GET)
    try {
      const resp = await fetch(
        `http://127.0.0.1:5000/api/materials/bulk?lang=${langRef.current}`,
        {
          method: "POST",
          headers: { "X-API-Key": key, "Content-Type": "application/json" },
          body: JSON.stringify({ ids: apiIds }),
          signal: AbortSignal.timeout(8000)
        }
      );
      if (resp.ok) {
        data = await resp.json();
      } else {
        const errBody = await resp.json().catch(() => ({}));
        flaskErr = `Flask HTTP ${resp.status}: ${errBody.error ?? ""}`;
      }
    } catch (e) { flaskErr = `Flask unreachable: ${e.message}`; }

    if (flaskErr) console.warn("[GT Stocks]", flaskErr);

    // 2. Fallback direct GW2 API — uniquement si clé disponible
    if (!data && key) {
      try {
        const headers = { "Authorization": `Bearer ${key.trim()}` };
        const [wResp, mResp, bResp, sResp] = await Promise.all([
          fetch("https://api.guildwars2.com/v2/account/wallet", { headers }),
          fetch("https://api.guildwars2.com/v2/account/materials", { headers }),
          fetch("https://api.guildwars2.com/v2/account/bank", { headers }),
          fetch("https://api.guildwars2.com/v2/account/inventory", { headers }),
        ]);
        const [wallet, mats, bank, shared] = await Promise.all([
          wResp.ok ? wResp.json() : [],
          mResp.ok ? mResp.json() : [],
          bResp.ok ? bResp.json() : [],
          sResp.ok ? sResp.json() : [],
        ]);
        const reqSet = new Set(apiIds);
        const stocks = {};
        for (const e of (wallet ?? [])) if (e && reqSet.has(e.id)) stocks[String(e.id)] = (stocks[String(e.id)] ?? 0) + (e.value ?? 0);
        for (const e of (mats ?? [])) if (e && reqSet.has(e.id)) stocks[String(e.id)] = (stocks[String(e.id)] ?? 0) + (e.count ?? 0);
        for (const e of (bank ?? [])) if (e && reqSet.has(e.id)) stocks[String(e.id)] = (stocks[String(e.id)] ?? 0) + (e.count ?? 0);
        for (const e of (shared ?? [])) if (e && reqSet.has(e.id)) stocks[String(e.id)] = (stocks[String(e.id)] ?? 0) + (e.count ?? 0);
        data = { stocks, synced_at: Math.floor(Date.now() / 1000), errors: [] };
      } catch (e) {
        setGtStockStatus("error");
        setGtStockError(e.message);
        return;
      }
    }

    if (!data) {
      setGtStockStatus("error");
      setGtStockError(key ? "Flask unreachable and direct API failed" : "Flask unreachable — no API key entered");
      return;
    }

    const merged = { ...data.stocks, _synced_at: data.synced_at, _sync_source: "api" };
    setGtStocks(merged);
    try { localStorage.setItem("gw2_gt_stocks", JSON.stringify(merged)); } catch (_) {}
    setGtStockStatus("ok");
  }, [gtApiKey]);

  // Manuel : mettre à jour un stock individuel
  const setGtStockManual = useCallback((apiId, qty) => {
    setGtStocks(prev => {
      const next = { ...prev, [String(apiId)]: qty, _sync_source: "manual", _synced_at: Math.floor(Date.now() / 1000) };
      try { localStorage.setItem("gw2_gt_stocks", JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, []);

  // ── Changement de légendaire — reset immédiat + chargement
  useEffect(() => {
    if (selectedLeg === "grand_total") return;
    const newLeg = LEGENDARIES[selectedLeg];
    const newIsWeekly = newLeg?.resetType === "weekly";

    setActiveTab((selectedLeg === "conflux" || selectedLeg === "warbringer") ? "wvw" : (selectedLeg === "prismatic" ? "achievements" : (selectedLeg === "obsidian" ? "pieces" : (selectedLeg === "weapons" ? "weapons" : (selectedLeg === "trinkets" ? "trinkets" : (leg?.raidAchievements ? "raids" : (selectedLeg === "t6" ? "currencies" : "metas")))))));
    setCurrencies({});
    setDailyChecked({});
    setWeeklyChecked({});
    setBountyDone({});
    setExpanded(null);

    async function load() {
      const dk = newIsWeekly ? getWeeklyKey(selectedLeg) : getDailyKey(selectedLeg);
      const daily = await storeGet(dk) ?? {};
      const weekly = await storeGet(getWeeklyKey(selectedLeg)) ?? {};
      const bounty = await storeGet(`gw2_${selectedLeg}_bounties`) ?? {};
      const curr = await storeGet(getCurrencyKey(selectedLeg)) ?? {};
      const common = await storeGet(getCommonKey()) ?? {};
      const nc = await storeGet("gw2_aurora_numchars") ?? 1;
      setDailyChecked(daily);
      setWeeklyChecked(weekly);
      setBountyDone(bounty);
      setCurrencies(curr);
      setCommonMats(common);
      setNumChars(typeof nc === "number" ? nc : 1);
    }
    load();
  }, [selectedLeg]);

  // ── Timer 1s
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Toggle activités daily/metas
  const toggleDaily = useCallback(async (id) => {
    const key = getDailyKey(selectedLeg);
    setDailyChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) delete next[id];
      storeSet(key, next);
      return next;
    });
  }, [selectedLeg]);

  // ── Toggle WvW weekly
  const toggleWeekly = useCallback(async (id) => {
    const key = getWeeklyKey(selectedLeg);
    setWeeklyChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) delete next[id];
      storeSet(key, next);
      return next;
    });
  }, [selectedLeg]);

  // ── Toggle bounty
  const toggleBounty = useCallback(async (id) => {
    const key = `gw2_${selectedLeg}_bounties`;
    setBountyDone(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) delete next[id];
      storeSet(key, next);
      return next;
    });
  }, [selectedLeg]);

  // ── Ajuster currency
  const adjustCurrency = useCallback(async (id, delta, isCommon = false) => {
    const key = isCommon ? getCommonKey() : getCurrencyKey(selectedLeg);
    const setter = isCommon ? setCommonMats : setCurrencies;
    setter(prev => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) };
      storeSet(key, next);
      return next;
    });
  }, [selectedLeg]);

  // ── Copier code WP
  const copyCode = useCallback((code, id) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  // ── Reset
  const resetDaily = useCallback(async () => {
    const key = getDailyKey(selectedLeg);
    setDailyChecked({});
    storeSet(key, {});
  }, [selectedLeg]);

  const resetBounties = useCallback(async () => {
    setBountyDone({});
    storeSet(`gw2_${selectedLeg}_bounties`, {});
  }, [selectedLeg]);

  const changeNumChars = useCallback((n) => {
    const v = Math.max(1, Math.min(9, n));
    setNumChars(v);
    storeSet("gw2_aurora_numchars", v);
  }, []);

  // ── Calculs metas
  // ── Calculs leg-dépendants (sautés en mode Grand Total) ──────
  const allTimedMetas = isGrandTotal ? [] : (leg.metas ?? []).filter(m => !m.isTimeless);
  const metasWithTiming = isGrandTotal ? [] : allTimedMetas
    .map(m => {
      const nextDate = getNextMetaOccurrence(m, now);
      const ms = nextDate ? nextDate - now : null;
      const bestNext = getBestNext(m, allTimedMetas, now);
      return { ...m, nextDate, ms, checked: !!dailyChecked[m.id], imminent: ms && ms < 600000, bestNext };
    })
    .sort((a, b) => (a.ms ?? 99999999) - (b.ms ?? 99999999));

  const timelessMetas = isGrandTotal ? [] : (leg.metas ?? []).filter(m => m.isTimeless);
  const upcoming = isGrandTotal ? [] : metasWithTiming.filter(m => !m.checked).slice(0, 3);
  const dailyCount = Object.keys(dailyChecked).length;
  const weeklyCount = Object.keys(weeklyChecked).length;

  // ── Obsidian : pièces possédées / ciblées / restantes ──
  const isObsidian = selectedLeg === "obsidian";
  const obsIds = LEGENDARIES.obsidian.armoryApiIds;
  const obsOwnedSet = new Set(obsIds.filter(id => armoryRaw.has(id)));
  const obsHasTarget = obsTarget.size > 0;
  const obsTargetOwned = obsHasTarget ? [...obsTarget].filter(id => obsOwnedSet.has(id)).length : 0;
  const obsRemainingCount = obsHasTarget
    ? Math.max(0, obsTarget.size - obsTargetOwned)
    : Math.max(0, 6 - obsOwnedSet.size);

  // ── Armes gen3 : ciblées / possédées / restantes ──
  const isWeapons = selectedLeg === "weapons";
  const wpnIds = wpnItems ? Object.keys(wpnItems).map(Number) : [];
  const wpnOwnedSet = new Set(wpnIds.filter(id => armoryRaw.has(id)));
  const wpnHasTarget = wpnTarget.size > 0;
  const wpnTargetOwned = wpnHasTarget ? [...wpnTarget].filter(id => wpnOwnedSet.has(id)).length : 0;
  const wpnRemainingCount = wpnHasTarget ? Math.max(0, wpnTarget.size - wpnTargetOwned) : 0;

  // ── Calcul progression currencies (Obsidian/Armes : requis = coût unitaire × restantes) ──
  const legCurrencies = isGrandTotal ? [] : (isObsidian
    ? (leg?.currenciesPerPiece ?? []).map(c => ({ ...c, required: c.perPiece * obsRemainingCount }))
    : (isWeapons
      ? (leg?.currenciesPerWeapon ?? []).map(c => ({ ...c, required: c.perUnit * wpnRemainingCount }))
      : (leg?.currencies ?? [])));
  const mainProgress = isGrandTotal ? [] : legCurrencies.map(cur => ({
    ...cur,
    owned: currencies[cur.id] ?? 0,
    pct: cur.required > 0 ? Math.min(100, ((currencies[cur.id] ?? 0) / cur.required) * 100) : 100,
  }));

  const legColor = isGrandTotal ? "#f472b6" : (leg?.color ?? "#e2c97e");
  const legColorDim = isGrandTotal ? "rgba(244,114,182,0.15)" : (leg?.colorDim ?? "rgba(226,201,126,0.15)");

  // ── Onglets disponibles selon légendaire
  const isPrismatic = selectedLeg === "prismatic";
  const isTrinkets = selectedLeg === "trinkets";
  const prismaticDone = prismaticProgress?.done === true;
  const prismaticBits = new Set(prismaticProgress?.bits ?? []);
  const prismaticCount = prismaticDone ? 24 : prismaticBits.size;

  const tabs = [
    ...(isPrismatic ? [{ id: "achievements", label: `✦ Achievements (${prismaticCount}/24)` }] : []),
    ...(isObsidian ? [{ id: "pieces", label: t("tab_pieces", { n: obsOwnedSet.size }) }] : []),
    ...(isWeapons ? [{ id: "weapons", label: t("tab_weapons", { n: wpnOwnedSet.size, m: wpnIds.length || 16 }) }] : []),
    ...(isTrinkets ? [{ id: "trinkets", label: NX({ fr: "◈ Colifichets", en: "◈ Trinkets" }) }] : []),
    ...(!isPrismatic && !["conflux", "warbringer", "coalescence", "selachimorpha", "eikasia", "upgrades", "weapons", "t6", "trinkets"].includes(selectedLeg) ? [{ id: "metas", label: `⏱ Metas (${dailyCount})` }] : []),
    ...(selectedLeg === "conflux" || selectedLeg === "warbringer" ? [{ id: "wvw", label: `WvW (${weeklyCount}/4)` }] : []),
    ...(leg?.raidAchievements ? [{ id: "raids", label: selectedLeg === "coalescence" ? t("tab_raids") : t("tab_collections") }] : []),
    ...(selectedLeg === "aurora" ? [{ id: "chars", label: t("tab_chars", { n: numChars }) }] : []),
    ...(selectedLeg === "aurora" ? [{ id: "collections", label: `Collections` }] : []),
    ...(selectedLeg === "vision" ? [{ id: "collections", label: `Collections` }] : []),
    ...((leg?.bounties?.length > 0) ? [{ id: "bounties", label: t("tab_bounties", { n: Object.keys(bountyDone).length }) }] : []),
    ...(!isPrismatic && (isObsidian || isWeapons || (leg?.currencies ?? []).length > 0) ? [{ id: "currencies", label: t("tab_currencies") }] : []),
    ...(!isPrismatic ? [{ id: "common", label: t("tab_common") }] : []),
  ];

  // Guard — évite le render pendant la transition de légendaire
  if (!leg && !isGrandTotal) return (
    <div style={{ background: "#080c18", color: "#e2c97e", padding: "40px", textAlign: "center", minHeight: "100vh", fontFamily: "serif" }}>
      Chargement...
    </div>
  );

  return (
    <LangContext.Provider value={lang}>
    <div style={{ fontFamily: "'Cinzel', Georgia, serif", background: "#080c18", minHeight: "100vh", color: "#e2c97e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .leg-selector { display: flex; gap: 8px; padding: 16px; border-bottom: 1px solid rgba(226,201,126,0.1); overflow-x: auto; }
        .leg-btn { flex-shrink: 0; padding: 8px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(226,201,126,0.12); border-radius: 6px; color: rgba(226,201,126,0.5); font-family: 'Cinzel', serif; font-size: 11px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.06em; }
        .leg-btn.active { color: var(--leg-color); border-color: var(--leg-color); background: var(--leg-bg); }

        .tabs { display: flex; border-bottom: 1px solid rgba(226,201,126,0.08); overflow-x: auto; }
        .tab { flex-shrink: 0; padding: 10px 14px; background: none; border: none; border-bottom: 2px solid transparent; color: rgba(226,201,126,0.35); font-family: 'Cinzel', serif; font-size: 10px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.08em; white-space: nowrap; }
        .tab.active { color: var(--leg-color); border-bottom-color: var(--leg-color); }

        .card { border: 1px solid rgba(226,201,126,0.1); border-radius: 8px; padding: 13px 15px; margin: 7px 14px; background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.18s; }
        .card:hover { background: rgba(255,255,255,0.04); border-color: rgba(226,201,126,0.2); }
        .card.checked { opacity: 0.38; }
        .card.imminent { border-color: rgba(251,146,60,0.45); box-shadow: 0 0 10px rgba(251,146,60,0.08); }

        .tip-box { margin-top: 10px; padding: 9px 12px; background: rgba(226,201,126,0.04); border-left: 2px solid rgba(226,201,126,0.25); font-family: 'Crimson Text', serif; font-style: italic; font-size: 13px; color: rgba(226,201,126,0.65); }

        .wp-btn { background: rgba(226,201,126,0.08); border: 1px solid rgba(226,201,126,0.2); color: rgba(226,201,126,0.7); border-radius: 3px; padding: 2px 7px; font-family: monospace; font-size: 10px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .wp-btn:hover { background: rgba(226,201,126,0.15); }
        .wp-btn.copied { background: rgba(74,222,128,0.12); border-color: rgba(74,222,128,0.4); color: #4ade80; }

        .check-btn { background: none; border: 1px solid rgba(226,201,126,0.25); color: #e2c97e; border-radius: 4px; padding: 4px 10px; font-family: 'Cinzel', serif; font-size: 10px; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
        .check-btn:hover { background: rgba(226,201,126,0.08); }
        .check-btn.done { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.35); color: #4ade80; }

        .prog-bar { background: rgba(255,255,255,0.06); border-radius: 3px; height: 5px; overflow: hidden; margin-top: 5px; }
        .prog-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }

        .adj-btn { background: rgba(226,201,126,0.06); border: 1px solid rgba(226,201,126,0.15); color: rgba(226,201,126,0.7); border-radius: 3px; padding: 3px 8px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.15s; }
        .adj-btn:hover { background: rgba(226,201,126,0.12); }

        .section-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(226,201,126,0.3); padding: 12px 14px 4px; font-family: 'Crimson Text', serif; }

        .upcoming-box { margin: 8px 14px; padding: 11px 13px; background: rgba(251,146,60,0.04); border: 1px solid rgba(251,146,60,0.12); border-radius: 8px; }

        .wvw-card { border: 1px solid rgba(251,146,60,0.12); border-radius: 8px; padding: 13px 15px; margin: 7px 14px; background: rgba(255,255,255,0.02); }

        .reset-info { font-size: 10px; color: rgba(226,201,126,0.2); font-family: 'Crimson Text', serif; text-align: center; padding: 6px; }
      `}</style>

      {/* ── HEADER (masqué en mode Grand Total) ── */}
      {!isGrandTotal && <div style={{ padding: "16px 14px 12px", borderBottom: "1px solid rgba(226,201,126,0.1)", background: "rgba(226,201,126,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>{leg?.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: legColor, letterSpacing: "0.08em" }}>
              {NL(leg?.id, leg?.name)}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>
              {NX(leg?.description)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <button
                onClick={() => fetchFromFlask()}
                disabled={apiStatus === "loading"}
                style={{
                  background: apiStatus === "ok" ? "rgba(74,222,128,0.1)" : apiStatus === "error" ? "rgba(248,113,113,0.1)" : "rgba(226,201,126,0.06)",
                  border: `1px solid ${apiStatus === "ok" ? "rgba(74,222,128,0.35)" : apiStatus === "error" ? "rgba(248,113,113,0.35)" : "rgba(226,201,126,0.2)"}`,
                  color: apiStatus === "ok" ? "#4ade80" : apiStatus === "error" ? "#f87171" : "rgba(226,201,126,0.7)",
                  borderRadius: "4px", padding: "3px 8px", fontSize: "10px",
                  fontFamily: "'Cinzel', serif", cursor: apiStatus === "loading" ? "wait" : "pointer",
                  letterSpacing: "0.05em", transition: "all 0.2s",
                }}>
                {apiStatus === "loading" ? "⟳ …" : apiStatus === "ok" ? "✓ OK" : apiStatus === "error" ? "✗ Err" : "⟳ API"}
              </button>
            </div>
            {apiStatus === "error" && apiError && (
              <div style={{ fontSize: "9px", color: "#f87171", fontFamily: "'Crimson Text', serif", maxWidth: "120px", textAlign: "right" }}>
                {apiError}
              </div>
            )}
            <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div style={{ fontSize: "9px", color: "rgba(226,201,126,0.2)", fontFamily: "'Crimson Text', serif" }}>
              {isWeekly ? t("header_reset_weekly") : t("header_reset_daily")}
            </div>
          </div>
        </div>
      </div>}

      {/* ── SÉLECTEUR LÉGENDAIRE ── */}
      <div className="leg-selector">
        {Object.values(LEGENDARIES).map(l => (
          <button
            key={l.id}
            className={`leg-btn ${selectedLeg === l.id ? "active" : ""}`}
            style={{ "--leg-color": l.color, "--leg-bg": l.colorDim }}
            onClick={() => setSelectedLeg(l.id)}
          >
            {l.icon} {NL(l.id, l.name)}
            <span style={{ fontSize: "9px", opacity: 0.6, marginLeft: "4px" }}>({NX(l.type)})</span>
          </button>
        ))}
        <div style={{ width: "1px", background: "rgba(226,201,126,0.12)", margin: "2px 4px", flexShrink: 0 }} />
        <button
          className={`leg-btn ${selectedLeg === "grand_total" ? "active" : ""}`}
          style={{ "--leg-color": "#f472b6", "--leg-bg": "rgba(244,114,182,0.12)", fontWeight: selectedLeg === "grand_total" ? 700 : 400 }}
          onClick={() => setSelectedLeg("grand_total")}
        >
          ⚔ Grand Total
        </button>
        <div style={{ width: "1px", background: "rgba(226,201,126,0.12)", margin: "2px 4px", flexShrink: 0 }} />
        <div style={{ display: "flex", gap: 2, flexShrink: 0, alignItems: "center" }}>
          {Object.keys(LANGS).map(l => (
            <button
              key={l}
              onClick={() => setLangPersist(l)}
              title={`Language: ${LANGS[l]}`}
              style={{
                padding: "6px 9px", borderRadius: 5, cursor: "pointer",
                fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.06em",
                border: `1px solid ${lang === l ? "#e2c97e" : "rgba(226,201,126,0.15)"}`,
                background: lang === l ? "rgba(226,201,126,0.12)" : "rgba(255,255,255,0.02)",
                color: lang === l ? "#e2c97e" : "rgba(226,201,126,0.45)",
              }}>
              {LANGS[l]}
            </button>
          ))}
            {lang === "fr" && frNames.stats && frNames.stats.fails && frNames.stats.fails.length > 0 && (
              <span title={"Échecs i18n API: " + frNames.stats.fails.join(", ")} style={{ fontSize: 9, color: "#fb923c", marginLeft: 6 }}>⚠ i18n</span>
            )}
        </div>
      </div>

      {/* ── HEADER GRAND TOTAL ── */}
      {isGrandTotal && (
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(226,201,126,0.1)", background: "rgba(226,201,126,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f472b6", letterSpacing: "0.08em", fontFamily: "'Cinzel', serif" }}>
            ⚔ Grand Total
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => fetchFromFlask()}
              disabled={apiStatus === "loading"}
              style={{
                background: apiStatus === "ok" ? "rgba(74,222,128,0.1)" : apiStatus === "error" ? "rgba(248,113,113,0.1)" : "rgba(226,201,126,0.06)",
                border: `1px solid ${apiStatus === "ok" ? "rgba(74,222,128,0.35)" : apiStatus === "error" ? "rgba(248,113,113,0.35)" : "rgba(226,201,126,0.2)"}`,
                color: apiStatus === "ok" ? "#4ade80" : apiStatus === "error" ? "#f87171" : "rgba(226,201,126,0.7)",
                borderRadius: "4px", padding: "3px 8px", fontSize: "10px",
                fontFamily: "'Cinzel', serif", cursor: apiStatus === "loading" ? "wait" : "pointer",
                letterSpacing: "0.05em",
              }}>
              {apiStatus === "loading" ? "⟳ …" : apiStatus === "ok" ? "✓ API" : apiStatus === "error" ? "✗ Err" : "⟳ API"}
            </button>
            <div style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif", textAlign: "right" }}>
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      )}

      {/* ── GRAND TOTAL (mode plein écran) ── */}
      {isGrandTotal && (
        <GrandTotalTab
          ownedIds={gtOwnedIds}
          manualOwnedIds={gtManualOwnedIds}
          onToggleManual={toggleGtManualOwned}
          apiKey={gtApiKey}
          setApiKey={setGtApiKey}
          apiStatus={gtApiStatus}
          apiError={gtApiError}
          onDetect={detectGtArmory}
          stocks={gtStocks}
          stockStatus={gtStockStatus}
          stockError={gtStockError}
          onFetchStocks={fetchGtStocks}
          onSetStockManual={setGtStockManual}
        />
      )}

      {/* ── TABS + CONTENU (masqués en mode Grand Total) ── */}
      {!isGrandTotal && <>
      <div className="tabs" style={{ "--leg-color": legColor }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════ */}
      {/* ONGLET METAS (Vision / Aurora)    */}
      {/* ══════════════════════════════════ */}
      {activeTab === "metas" && (
        <div>
          {/* Upcoming chains */}
          {upcoming.length > 0 && (
            <>
              <div className="section-label">{t("sec_upcoming")}</div>
              <div className="upcoming-box">
                {upcoming.map((m, i) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "9px", padding: i > 0 ? "6px 0 0" : "0", marginTop: i > 0 ? "6px" : "0", borderTop: i > 0 ? "1px solid rgba(226,201,126,0.06)" : "none" }}>
                    <span style={{ fontSize: "15px", width: "22px" }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>{NX(m.name)}</span>
                        {m.efficience && (
                          <span style={{ fontSize: "9px", color: EFFICIENCE_COLORS[m.efficience], background: `${EFFICIENCE_COLORS[m.efficience]}18`, border: `1px solid ${EFFICIENCE_COLORS[m.efficience]}30`, padding: "1px 5px", borderRadius: "2px" }}>
                            {m.efficience}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{NX(m.subname)}</div>
                      {m.bestNext && m.bestNext.ms < 45 * 60000 && (
                        <div style={{ fontSize: "10px", color: "rgba(74,222,128,0.7)", fontFamily: "'Crimson Text', serif", marginTop: "2px" }}>
                          → {NX(m.bestNext.meta.name)} {t("word_in")} {formatCountdown(m.bestNext.ms)}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: m.ms < 300000 ? "#fb923c" : "#e2c97e", fontFamily: "'Crimson Text', serif", fontVariantNumeric: "tabular-nums" }}>
                        {formatCountdown(m.ms)}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.3)" }}>{formatLocalTime(m.nextDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Metas avec timer */}
          {metasWithTiming.length > 0 && (
            <>
              <div className="section-label">{t("sec_scheduled")}</div>
              {metasWithTiming.map(m => (
                <div key={m.id} className={`card ${m.checked ? "checked" : ""} ${m.imminent && !m.checked ? "imminent" : ""}`}
                  onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <span style={{ fontSize: "17px", width: "26px" }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>{NX(m.name)}</span>
                        <span style={{ fontSize: "9px", color: "rgba(226,201,126,0.35)", background: "rgba(226,201,126,0.06)", padding: "1px 5px", borderRadius: "2px" }}>{m.expansion}</span>
                        {m.efficience && (
                          <span style={{ fontSize: "9px", color: EFFICIENCE_COLORS[m.efficience], background: `${EFFICIENCE_COLORS[m.efficience]}18`, border: `1px solid ${EFFICIENCE_COLORS[m.efficience]}30`, padding: "1px 5px", borderRadius: "2px" }}>
                            {m.efficience}
                          </span>
                        )}
                        {m.population && (
                          <span style={{ fontSize: "9px", color: m.population === "morte" ? "#f87171" : "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>
                            {POPULATION_LABELS[m.population] ? t(POPULATION_LABELS[m.population]) : m.population}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{NX(m.subname)}</div>
                      {m.bestNext && !m.checked && m.bestNext.ms < 45 * 60000 && (
                        <div style={{ fontSize: "10px", color: "rgba(74,222,128,0.65)", fontFamily: "'Crimson Text', serif", marginTop: "2px" }}>
                          → {NX(m.bestNext.meta.name)} {t("word_in")} {formatCountdown(m.bestNext.ms)}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", marginRight: "8px" }}>
                      <div style={{ fontSize: "12px", color: m.checked ? "rgba(226,201,126,0.25)" : m.imminent ? "#fb923c" : "#e2c97e", fontFamily: "'Crimson Text', serif", fontVariantNumeric: "tabular-nums" }}>
                        {m.checked ? "✓" : formatCountdown(m.ms)}
                      </div>
                      {!m.checked && <div style={{ fontSize: "9px", color: "rgba(226,201,126,0.25)" }}>{formatLocalTime(m.nextDate)}</div>}
                    </div>
                    <button className={`check-btn ${m.checked ? "done" : ""}`}
                      onClick={e => { e.stopPropagation(); toggleDaily(m.id); }}>
                      {m.checked ? "✓" : "+1"}
                    </button>
                  </div>
                  {expanded === m.id && (
                    <div className="tip-box">
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px", fontStyle: "normal" }}>
                        <span style={{ color: "#e2c97e", fontWeight: 600, fontSize: "12px" }}>{">> "}{m.waypoint}</span>
                        <button className={`wp-btn ${copied === m.id ? "copied" : ""}`}
                          onClick={e => { e.stopPropagation(); copyCode(m.wpCode, m.id); }}>
                          {copied === m.id ? t("btn_copied") : `${m.wpCode} [c]`}
                        </button>
                      </div>
                      {m.timerNote && (
                        <div style={{ fontStyle: "normal", fontSize: "11px", color: "rgba(226,201,126,0.5)", marginBottom: "5px" }}>
                          🕐 {m.timerNote}
                        </div>
                      )}
                      {m.resetNote && (
                        <div style={{ fontStyle: "normal", fontSize: "11px", color: "rgba(251,146,60,0.8)", marginBottom: "5px" }}>
                          [R] {NX(m.resetNote)}
                        </div>
                      )}
                      {m.bestNext && (
                        <div style={{ fontStyle: "normal", fontSize: "11px", color: "rgba(74,222,128,0.7)", marginBottom: "5px" }}>
                          {t("next_meta", { meta: m.bestNext.meta.name, sub: m.bestNext.meta.subname, time: formatLocalTime(m.bestNext.date) })}
                        </div>
                      )}
                      ⏱ ~{m.durationMin} min · {NX(m.tip)}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Metas sans timer (Aurora nodes) */}
          {timelessMetas.length > 0 && (
            <>
              <div className="section-label">{t("sec_daily")}</div>
              {timelessMetas.map(m => {
                const farmLabel = m.farmType === "per_char"
                  ? { text: t("farm_perchar", { n: numChars }), color: "#34d399" }
                  : m.farmType === "per_char_hearts"
                  ? { text: t("farm_perchar_hearts"), color: "#fb923c" }
                  : { text: t("farm_account"), color: "rgba(226,201,126,0.5)" };
                return (
                <div key={m.id} className={`card ${dailyChecked[m.id] ? "checked" : ""}`}
                  onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <span style={{ fontSize: "17px", width: "26px" }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600 }}>{NX(m.name)}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                        <span style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{NX(m.subname)}</span>
                        {m.farmType && (
                          <span style={{ fontSize: "9px", color: farmLabel.color, background: `${farmLabel.color}18`, border: `1px solid ${farmLabel.color}30`, padding: "1px 5px", borderRadius: "2px", fontFamily: "'Crimson Text', serif" }}>
                            {farmLabel.text}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className={`check-btn ${dailyChecked[m.id] ? "done" : ""}`}
                      onClick={e => { e.stopPropagation(); toggleDaily(m.id); }}>
                      {dailyChecked[m.id] ? t("btn_done_checked") : t("btn_done")}
                    </button>
                  </div>
                  {expanded === m.id && (
                    <div className="tip-box">
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px", fontStyle: "normal" }}>
                        <span style={{ color: "#e2c97e", fontWeight: 600, fontSize: "12px" }}>{">> "}{m.waypoint}</span>
                        <button className={`wp-btn ${copied === m.id ? "copied" : ""}`}
                          onClick={e => { e.stopPropagation(); copyCode(m.wpCode, m.id); }}>
                          {copied === m.id ? t("btn_copied") : `${m.wpCode} [c]`}
                        </button>
                      </div>
                      {m.resetNote && (
                        <div style={{ fontStyle: "normal", fontSize: "11px", color: "rgba(251,146,60,0.8)", marginBottom: "5px" }}>
                          [R] {NX(m.resetNote)}
                        </div>
                      )}
                      {m.vendor && (
                        <div style={{ fontStyle: "normal", fontSize: "11px", color: "rgba(52,211,153,0.8)", marginBottom: "5px" }}>
                          [V] {NX(m.vendor)}
                        </div>
                      )}
                      {NX(m.tip)}
                    </div>
                  )}
                </div>
                );
              })}
            </>
          )}

          <div style={{ padding: "12px 14px", textAlign: "center" }}>
            <button className="check-btn" onClick={resetDaily} style={{ fontSize: "9px", opacity: 0.5 }}>{t("btn_reset_daily")}</button>
            <div className="reset-info">{t("reset_info_daily")}</div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════ */}
      {/* ONGLET PERSONNAGES (Aurora)               */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === "chars" && selectedLeg === "aurora" && (
        <div>
          <div style={{ margin: "10px 14px 6px", padding: "11px 13px", background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "8px", fontFamily: "'Crimson Text', serif" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#34d399", marginBottom: "5px" }}>{t("chars_title", { name: NL("aurora", "Aurora") })}</div>
            <div style={{ fontSize: "12px", color: "rgba(226,201,126,0.65)", lineHeight: 1.6 }}>
              {t("chars_criteria_pre")}<strong>{t("chars_criteria_lvl")}</strong>{t("chars_criteria_mid")}<strong>{t("chars_criteria_ep")}</strong>{t("chars_criteria_post")}
            </div>
          </div>

          {/* Sélecteur nombre de persos */}
          <div style={{ margin: "8px 14px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>{t("chars_active_label")}</div>
                <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{t("chars_active_help")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button className="adj-btn" onClick={() => changeNumChars(numChars - 1)} style={{ width: "28px", textAlign: "center" }}>−</button>
                <span style={{ fontSize: "22px", fontWeight: 700, color: "#34d399", minWidth: "24px", textAlign: "center" }}>{numChars}</span>
                <button className="adj-btn" onClick={() => changeNumChars(numChars + 1)} style={{ width: "28px", textAlign: "center" }}>+</button>
              </div>
            </div>

            {/* Tableau rendement par currency */}
            <div style={{ borderTop: "1px solid rgba(226,201,126,0.08)", paddingTop: "10px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(226,201,126,0.3)", marginBottom: "8px", fontFamily: "'Crimson Text', serif" }}>
                {t("chars_yield")}
              </div>
              {(leg?.currencies ?? []).map(cur => {
                let perDay, note, color;
                if (cur.farmType === "per_char") {
                  perDay = numChars * cur.perCharPerDay;
                  note = t("chars_note_perchar", { n: numChars, s: numChars > 1 ? "s" : "", per: cur.perCharPerDay });
                  color = "#34d399";
                } else if (cur.farmType === "per_char_hearts") {
                  perDay = numChars * 2;
                  note = t("chars_note_chests", { n: numChars, s: numChars > 1 ? "s" : "" });
                  color = "#fb923c";
                } else {
                  perDay = cur.perAccountPerDay ?? 0;
                  note = t("chars_note_cap");
                  color = "rgba(226,201,126,0.5)";
                }
                const daysLeft = perDay > 0 ? Math.ceil(Math.max(0, cur.required - (currencies[cur.id] ?? 0)) / perDay) : "?";
                return (
                  <div key={cur.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0", borderBottom: "1px solid rgba(226,201,126,0.05)" }}>
                    <span style={{ fontSize: "14px", width: "22px" }}>{cur.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "11px", fontWeight: 600 }}>{NX(cur.name)}</div>
                      <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif" }}>{note}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color }}> {t("per_day", { n: perDay })}</div>
                      {daysLeft > 0 && (
                        <div style={{ fontSize: "9px", color: "rgba(226,201,126,0.3)" }}>{t("days_left", { n: daysLeft })}</div>
                      )}
                      {daysLeft === 0 && (
                        <div style={{ fontSize: "9px", color: "#4ade80" }}>{t("status_completed")}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Note Siren's Landing */}
          <div style={{ margin: "8px 14px", padding: "10px 13px", background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.12)", borderRadius: "8px", fontFamily: "'Crimson Text', serif" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#fb923c", marginBottom: "4px" }}>{t("chars_siren_title")}</div>
            <div style={{ fontSize: "11px", color: "rgba(226,201,126,0.6)", lineHeight: 1.5 }}>
              {t("chars_altswap_pre")}<strong>{t("chars_altswap_hearts")}</strong>{t("chars_altswap_mid")}<strong>{t("chars_altswap_cost")}</strong>{t("chars_altswap_post")}
            </div>
          </div>

          <div className="reset-info" style={{ marginTop: "8px" }}>{t("reset_info_chars")}</div>
        </div>
      )}
      {activeTab === "wvw" && (
        <div>
          <div style={{ margin: "10px 14px 6px", padding: "11px 13px", background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.12)", borderRadius: "8px", fontFamily: "'Crimson Text', serif" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: legColor, marginBottom: "5px" }}>⚔ {NL(selectedLeg, leg?.name)} — {t("wvw_label")}</div>
            <div style={{ fontSize: "12px", color: "rgba(226,201,126,0.65)", lineHeight: 1.5 }}>
              {t("wvw_reset_note_pre")}<strong>{t("wvw_reset_note_day")}</strong>{t("wvw_reset_note_post")}
            </div>
          </div>
          {leg?.requirementNoteKey && (
            <div style={{ margin: "6px 14px", padding: "9px 12px", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.18)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.6)" }}>
              {t(leg.requirementNoteKey)}
            </div>
          )}
          <div className="section-label">{t("sec_weekly")}</div>
          {(leg?.wvwActivities ?? []).map(a => (
            <div key={a.id} className="wvw-card" style={{ "--leg-color": legColor }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px", width: "26px" }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>{NX(a.name)}</div>
                  <div style={{ fontSize: "10px", color: "#fb923c", fontFamily: "'Crimson Text', serif" }}>{NX(a.limit)}</div>
                  <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif", marginTop: "2px" }}>{NX(a.tip)}</div>
                </div>
                <button className={`check-btn ${weeklyChecked[a.id] ? "done" : ""}`}
                  onClick={() => toggleWeekly(a.id)}>
                  {weeklyChecked[a.id] ? "✓" : t("btn_done")}
                </button>
              </div>
            </div>
          ))}
          <div style={{ padding: "12px 14px", textAlign: "center" }}>
            <div className="reset-info">{t("reset_info_weekly")}</div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════ */}
      {/* ONGLET ACHIEVEMENTS (Prismatic)   */}
      {/* ══════════════════════════════════ */}
      {activeTab === "achievements" && isPrismatic && (
        <div style={{ paddingBottom: 20 }}>
          {/* Barre globale */}
          <div style={{ margin: "10px 14px 0", padding: "12px 14px", background: prismaticDone ? "rgba(74,222,128,0.06)" : "rgba(168,85,247,0.06)", border: `1px solid ${prismaticDone ? "rgba(74,222,128,0.3)" : "rgba(168,85,247,0.2)"}`, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: prismaticDone ? "#4ade80" : "#a855f7", fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
                {prismaticDone ? t("prismatic_done") : t("prismatic_title")}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: prismaticDone ? "#4ade80" : "#a855f7" }}>
                {prismaticCount}<span style={{ fontSize: 10, opacity: 0.5 }}>/24</span>
              </div>
            </div>
            <div className="prog-bar">
              <div className="prog-fill" style={{ width: `${(prismaticCount/24)*100}%`, background: prismaticDone ? "linear-gradient(90deg,#4ade8080,#4ade80)" : "linear-gradient(90deg,#a855f780,#a855f7)" }} />
            </div>
            {!prismaticDone && (
              <div style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif", marginTop: 5 }}>
                {t("prismatic_synchint")}
              </div>
            )}
          </div>

          {/* Tiers */}
          {(leg?.achievementTiers ?? []).map(tier => {
            const tierBits = tier.episodes.map(e => e.bit);
            const tierDone = prismaticDone || tierBits.every(b => prismaticBits.has(b));
            const tierCount = prismaticDone ? tierBits.length : tierBits.filter(b => prismaticBits.has(b)).length;

            return (
              <div key={tier.id} style={{ margin: "8px 14px 0", border: `1px solid ${tierDone ? "rgba(74,222,128,0.2)" : tier.color+"33"}`, borderRadius: 8, overflow: "hidden" }}>
                {/* Header tier */}
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: tierDone ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.02)", cursor: "pointer" }}
                  onClick={() => setExpanded(expanded === tier.id ? null : tier.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${tierDone ? "#4ade80" : tier.color}`, background: tierDone ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {tierDone && <span style={{ fontSize: 9, color: "#4ade80" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 11, color: tierDone ? "#4ade80" : tier.color, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>{NX(tier.name)}</span>
                    <span style={{ fontSize: 9, color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif" }}>({tierCount}/{tier.episodes.length})</span>
                  </div>
                  <span style={{ fontSize: 10, color: "rgba(226,201,126,0.3)" }}>{expanded === tier.id ? "▲" : "▼"}</span>
                </div>

                {/* Épisodes */}
                {expanded === tier.id && (
                  <div style={{ padding: "4px 12px 10px" }}>
                    {tier.tip && (
                      <div style={{ fontSize: 10, color: "rgba(226,201,126,0.45)", fontFamily: "'Crimson Text', serif", marginBottom: 8, lineHeight: 1.5 }}>
                        {NX(tier.tip)}
                      </div>
                    )}
                    {tier.episodes.map(ep => {
                      const isDone = prismaticDone || prismaticBits.has(ep.bit);
                      return (
                        <div
                          key={ep.bit}
                          onClick={() => {
                            if (prismaticDone) return;
                            const next = new Set(prismaticBits);
                            if (next.has(ep.bit)) next.delete(ep.bit); else next.add(ep.bit);
                            const pp = { ...prismaticProgress, bits: [...next] };
                            setPrismaticProgress(pp);
                            localStorage.setItem("gw2_prismatic_progress", JSON.stringify(pp));
                          }}
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: prismaticDone ? "default" : "pointer", borderBottom: "1px solid rgba(226,201,126,0.04)" }}
                        >
                          <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: `1.5px solid ${isDone ? "#4ade80" : "rgba(226,201,126,0.2)"}`, background: isDone ? "rgba(74,222,128,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {isDone && <span style={{ fontSize: 9, color: "#4ade80" }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 11, color: isDone ? "#4ade80" : "rgba(226,201,126,0.55)", fontFamily: "'Crimson Text', serif", textDecoration: isDone ? "line-through" : "none", flex: 1 }}>
                            {NX(ep.name)}
                          </span>
                          <span style={{ fontSize: 9, color: "rgba(226,201,126,0.2)", fontFamily: "monospace" }}>bit {ep.bit}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════ */}
      {/* ONGLET PRIMES (Vision)            */}
      {/* ══════════════════════════════════ */}
      {activeTab === "bounties" && leg.bounties?.length > 0 && (
        <div>
          <div style={{ margin: "10px 14px 6px", padding: "11px 13px", background: legColorDim, border: `1px solid ${legColor}25`, borderRadius: "8px", fontFamily: "'Crimson Text', serif" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: legColor, marginBottom: "5px" }}>{t("bounty_train_title")}</div>
            <div style={{ fontSize: "12px", color: "rgba(226,201,126,0.65)", lineHeight: 1.5 }}>
              {t("bounty_train_desc")}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(226,201,126,0.4)", marginTop: "5px" }}>{t("bounty_train_elegy")}</div>
          </div>
          <div className="section-label">{t("sec_bounties")}</div>
          {(leg?.bounties ?? []).map(b => (
            <div key={b.id} className={`card ${bountyDone[b.id] ? "checked" : ""}`}
              onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <span style={{ fontSize: "18px", width: "26px" }}>{b.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>{NX(b.map)}</div>
                  <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{b.target} · ~{b.elegy} Elegy</div>
                </div>
                <button className={`check-btn ${bountyDone[b.id] ? "done" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleBounty(b.id); }}>
                  {bountyDone[b.id] ? "✓" : t("btn_kill")}
                </button>
              </div>
              {expanded === b.id && (
                <div className="tip-box">
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px", fontStyle: "normal" }}>
                    <span style={{ color: "#e2c97e", fontWeight: 600, fontSize: "12px" }}>{">> "}{b.waypoint}</span>
                    <button className={`wp-btn ${copied === b.id ? "copied" : ""}`}
                      onClick={e => { e.stopPropagation(); copyCode(b.wpCode, b.id); }}>
                      {copied === b.id ? t("btn_copied") : `${b.wpCode} [c]`}
                    </button>
                  </div>
                  {NX(b.tip)}
                </div>
              )}
            </div>
          ))}
          <div style={{ padding: "12px 14px", textAlign: "center" }}>
            <button className="check-btn" onClick={resetBounties} style={{ fontSize: "9px", opacity: 0.5 }}>Reset session</button>
            <div className="reset-info">{t("reset_info_bounties")}</div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* ONGLET COLLECTIONS (Aurora)                   */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === "collections" && selectedLeg === "aurora" && (() => {
        const C = "#34d399";
        const sourcesAurora = SOURCES_DB?.legendaries?.aurora;
        const ac = auroraCollections;

        // ── helpers
        const ach1 = ac.aurora_1 ?? {};
        const ach2 = ac.aurora_2 ?? {};
        const ach1Done = ach1.done ?? false;
        const ach2Done = ach2.done ?? false;
        const bits2 = new Set(ach2.bits ?? []);

        // Sentient Seed : acquis si les 4 pré-requis sont done
        // (aurora_1 bits non fiables — collection verrouillée tant que Seed pas acheté)
        const preKeys = ["aurora_pre_conspiracy","aurora_pre_token","aurora_pre_cin","aurora_pre_lessons"];
        const seedDone = ach1Done || preKeys.every(k => ac[k]?.done);

        const SUB_BIT = [
          { key: "aurora_bf",  label: "Bloodstone Fen Master" },
          { key: "aurora_eb",  label: "Ember Bay Master" },
          { key: "aurora_bfr", label: "Bitterfrost Frontier Master" },
          { key: "aurora_ld",  label: "Lake Doric Master" },
          { key: "aurora_dm",  label: "Draconis Mons Master" },
          { key: "aurora_sl",  label: "Siren's Landing Master" },
        ];
        const awk1Count = (seedDone ? 1 : 0) + SUB_BIT.filter(s => ach1Done || (ac[s.key]?.done ?? false)).length;

        return (
          <div style={{ paddingBottom: 20 }}>

            {/* ── Intro info box */}
            <div style={{ margin: "10px 14px 0", padding: "11px 13px", background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 8, fontFamily: "'Crimson Text', serif" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C, marginBottom: 4 }}>{t("aurora_col_title")}</div>
              <div style={{ fontSize: 11, color: "rgba(226,201,126,0.6)", lineHeight: 1.6 }}>
                {t("aurora_col_intro")}
                {t("aurora_syncnote")}
                {Object.keys(ac).length === 0 && <span style={{ color: "#fb923c" }}>{t("sync_to_see")}</span>}
              </div>
            </div>

            {/* ══════════════════════════════════════ */}
            {/* AURORA: AWAKENING                     */}
            {/* ══════════════════════════════════════ */}
            <div style={{ margin: "10px 14px 0" }}>
              {/* Header Awakening */}
              <div style={{ padding: "10px 13px", background: ach1Done ? "rgba(74,222,128,0.06)" : "rgba(52,211,153,0.05)", border: `1px solid ${ach1Done ? "rgba(74,222,128,0.3)" : "rgba(52,211,153,0.2)"}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ach1Done ? "#4ade80" : C, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
                    {ach1Done ? "✓ " : ""}{NX("Aurora: Awakening")}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", marginTop: 2 }}>
                    {t("aurora_reward")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: ach1Done ? "#4ade80" : C }}>{awk1Count}<span style={{ fontSize: 10, opacity: 0.5 }}>/7</span></div>
                </div>
              </div>
              {/* Barre globale Awakening */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderLeft: "1px solid rgba(52,211,153,0.2)", borderRight: "1px solid rgba(52,211,153,0.2)", padding: "6px 13px 8px" }}>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${(awk1Count/7)*100}%`, background: ach1Done ? "linear-gradient(90deg,#16a34a,#4ade80)" : `linear-gradient(90deg,${C}80,${C})` }} />
                </div>
              </div>

              {/* Sentient Seed */}
              {(() => {
                const preReqs = [
                  { key: "aurora_pre_conspiracy", label: "Conspiracy of Dunces", map: { fr: "Marais de la pierre de sang", en: "Bloodstone Fen" }, item: "Sentient Anomaly",    obj: "3 journaux White Mantle" },
                  { key: "aurora_pre_token",      label: "Token Collector",       map: { fr: "Baie des braises", en: "Ember Bay" },       item: "Sentient Aberration", obj: "40 Mursaat tokens" },
                  { key: "aurora_pre_cin",        label: "Cin Business",           map: { fr: "Lac Doric", en: "Lake Doric" },      item: "Sentient Oddity",     obj: "objets de Cin" },
                  { key: "aurora_pre_lessons",    label: "Lessons Learned",        map: { fr: "Mont Draconis", en: "Draconis Mons" },   item: "Sentient Singularity",obj: "14 recordings de Zinn" },
                ];
                const allPreDone = preReqs.every(p => (ac[p.key]?.done ?? false));
                const preReqCount = preReqs.filter(p => ac[p.key]?.done).length;
                return (
                  <div style={{ borderLeft: "1px solid rgba(52,211,153,0.2)", borderRight: "1px solid rgba(52,211,153,0.2)", borderTop: "1px solid rgba(226,201,126,0.05)" }}>
                    {/* Header Sentient Seed row */}
                    <div
                      style={{ padding: "8px 13px", background: seedDone ? "rgba(74,222,128,0.03)" : "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                      onClick={() => setAuroraSubExpanded(auroraSubExpanded === "sentient_seed" ? null : "sentient_seed")}
                    >
                      <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${seedDone ? "#4ade80" : "rgba(52,211,153,0.5)"}`, background: seedDone ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {seedDone && <span style={{ fontSize: 9, color: "#4ade80" }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: seedDone ? "#4ade80" : "rgba(226,201,126,0.8)" }}>Sentient Seed</span>
                          {!seedDone && Object.keys(ac).length > 0 && (
                            <span style={{ fontSize: 9, color: allPreDone ? "#34d399" : "#fb923c", background: allPreDone ? "rgba(52,211,153,0.1)" : "rgba(251,146,60,0.1)", border: `1px solid ${allPreDone ? "rgba(52,211,153,0.3)" : "rgba(251,146,60,0.3)"}`, borderRadius: 3, padding: "1px 5px" }}>
                              {t("prereq_count", { n: preReqCount })}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>
                          {t("sentient_seed_desc")}
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: "rgba(226,201,126,0.25)" }}>{auroraSubExpanded === "sentient_seed" ? "▲" : "▼"}</span>
                    </div>

                    {/* Expand — 4 prerequisites */}
                    {auroraSubExpanded === "sentient_seed" && (
                      <div style={{ padding: "4px 13px 10px 36px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(226,201,126,0.04)" }}>
                        <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", marginBottom: 6, fontStyle: "italic" }}>
                          {t("aurora_prereq_help")}
                          Si perdus : rachat 1000 UM chez Gharr Leadclaw <span style={{ fontFamily: "monospace", fontSize: 9, background: "rgba(226,201,126,0.08)", padding: "1px 4px", borderRadius: 3 }}>[&amp;BDMEAAA=]</span> ou Hobbs <span style={{ fontFamily: "monospace", fontSize: 9, background: "rgba(226,201,126,0.08)", padding: "1px 4px", borderRadius: 3 }}>[&amp;BDAEAAA=]</span>
                        </div>
                        {preReqs.map(p => {
                          const pDone = ac[p.key]?.done ?? false;
                          const pCurrent = ac[p.key]?.current ?? 0;
                          const pMax = ac[p.key]?.max ?? 0;
                          return (
                            <div key={p.key} style={{ padding: "5px 0", borderBottom: "1px solid rgba(226,201,126,0.04)", display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <div style={{ width: 12, height: 12, borderRadius: 2, border: `1px solid ${pDone ? "#4ade80" : "rgba(52,211,153,0.4)"}`, background: pDone ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                                {pDone && <span style={{ fontSize: 8, color: "#4ade80" }}>✓</span>}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: pDone ? "#4ade80" : "rgba(226,201,126,0.8)" }}>{p.label}</span>
                                  <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.1)", borderRadius: 3, padding: "1px 5px" }}>{NX(p.map)}</span>
                                  {!pDone && pMax > 0 && (
                                    <span style={{ fontSize: 9, color: "rgba(226,201,126,0.4)" }}>{pCurrent}/{pMax}</span>
                                  )}
                                </div>
                                <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>
                                  {p.obj} → reward: <em>{p.item}</em>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 6 sous-collections */}
              {SUB_BIT.map(({ key, label }) => {
                const subDone = ach1Done || (ac[key]?.done ?? false);
                const subAch = ac[key] ?? {};
                const subTotal = sourcesAurora?.collections?.aurora_1?.subcollections?.[key]?.total;
                const subMax = subAch.max || subTotal || "?";
                const subCurrent = subDone
                  ? subMax  // complété → current = max
                  : (subAch.current ?? 0);
                const subData = sourcesAurora?.collections?.aurora_1?.subcollections?.[key];
                const timegate = subData?.timegate;
                const items = subData?.items ?? [];
                const isOpen = auroraSubExpanded === key;

                return (
                  <div key={key} style={{ borderLeft: "1px solid rgba(52,211,153,0.2)", borderRight: "1px solid rgba(52,211,153,0.2)" }}>
                    {/* Row sous-collection */}
                    <div
                      style={{ padding: "8px 13px", background: subDone ? "rgba(74,222,128,0.03)" : "rgba(255,255,255,0.015)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid rgba(226,201,126,0.05)" }}
                      onClick={() => setAuroraSubExpanded(isOpen ? null : key)}
                    >
                      <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${subDone ? "#4ade80" : "rgba(52,211,153,0.5)"}`, background: subDone ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {subDone && <span style={{ fontSize: 9, color: "#4ade80" }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: subDone ? "#4ade80" : "rgba(226,201,126,0.85)" }}>{label}</span>
                          {timegate && <span style={{ fontSize: 9, color: "#fb923c", background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: 3, padding: "1px 5px" }}>⚠ time-gate</span>}
                        </div>
                        {/* Mini progress bar */}
                        {!subDone && subCurrent > 0 && typeof subMax === "number" && (
                          <div className="prog-bar" style={{ marginTop: 3, height: 3 }}>
                            <div className="prog-fill" style={{ width: `${Math.min(100,(subCurrent/subMax)*100)}%`, background: `linear-gradient(90deg,${C}60,${C})` }} />
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: subDone ? "#4ade80" : "rgba(226,201,126,0.5)" }}>
                          {subCurrent}<span style={{ fontSize: 9, opacity: 0.5 }}>/{subMax}</span>
                        </span>
                        <span style={{ fontSize: 10, color: "rgba(226,201,126,0.25)" }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Expand — liste des items */}
                    {isOpen && (
                      <div style={{ background: "rgba(255,255,255,0.01)", padding: "4px 13px 10px 36px", borderTop: "1px solid rgba(226,201,126,0.04)" }}>
                        {timegate && (
                          <div style={{ margin: "6px 0 8px", padding: "7px 10px", background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 5, fontSize: 11, color: "#fb923c", fontFamily: "'Crimson Text', serif" }}>
                            ⚠ {NX(timegate)}
                          </div>
                        )}
                        {items.map((item, i) => {
                          const itemDone = subDone || (subAch.bits ?? []).includes(item.bit ?? i);
                          const missing = !itemDone;
                          // Mastery story liée (bit 0 uniquement)
                          const masteryId  = item.mastery_achi_id;
                          const masteryKey = masteryId
                            ? Object.keys(ac).find(k => k.startsWith('mastery_') && SOURCES_DB?.legendaries?.aurora?.collections?.aurora_1?.subcollections?.[key]?.items?.[0]?.mastery_achi_id === masteryId)
                            : null;
                          // Retrouver la clé mastery_ dans auroraCollections via l'id
                          const masteryAch = masteryId
                            ? Object.values(ac).find((_, idx) => {
                                const keys = Object.keys(ac);
                                return keys[idx].startsWith('mastery_') && false; // on passe par masteryKey
                              })
                            : null;
                          // Lookup direct : mastery_bf <-> aurora_bf → mastery_{suffix}
                          const subSuffix   = key.replace('aurora_', '');
                          const masteryAchi = ac[`mastery_${subSuffix}`] ?? null;
                          const mCur = masteryAchi?.current ?? 0;
                          const mMax = item.mastery_max ?? masteryAchi?.max ?? 0;
                          const mReq = item.mastery_required ?? mMax;
                          const mDone = masteryAchi?.done ?? false;
                          const mPct  = mMax > 0 ? Math.min(100, (mCur / mMax) * 100) : 0;
                          const mReqPct = mMax > 0 ? (mReq / mMax) * 100 : 0;

                          return (
                          <div key={i} style={{ padding: "5px 0", borderBottom: "1px solid rgba(226,201,126,0.04)", display: "flex", gap: 8, opacity: itemDone ? 0.5 : 1 }}>
                            <div style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${itemDone ? "#4ade80" : "rgba(251,146,60,0.6)"}`, background: itemDone ? "rgba(74,222,128,0.2)" : "rgba(251,146,60,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                              {itemDone ? <span style={{ fontSize: 8, color: "#4ade80" }}>✓</span> : <span style={{ fontSize: 8, color: "rgba(251,146,60,0.7)" }}>✗</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: itemDone ? "rgba(74,222,128,0.6)" : "rgba(226,201,126,0.95)" }}>{NX(item.name)}</div>
                              {missing && <div style={{ fontSize: 10, color: "rgba(226,201,126,0.45)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>{NX(item.how)}</div>}
                              {/* Bloc Mastery story inline — bit 0 uniquement */}
                              {missing && masteryId && (
                                <div style={{ marginTop: 5, padding: "6px 8px", background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 5 }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 9, fontWeight: 600, color: mDone ? "#4ade80" : "#fb923c", fontFamily: "'Cinzel', serif", letterSpacing: "0.03em" }}>
                                      {mDone ? "✓ " : ""}{item.mastery_label}
                                    </span>
                                    <span style={{ fontSize: 9, color: mDone ? "rgba(74,222,128,0.7)" : "rgba(251,146,60,0.6)" }}>
                                      {mCur}<span style={{ opacity: 0.5 }}>/{mMax}</span>
                                    </span>
                                  </div>
                                  {/* Bar with required threshold marker */}
                                  <div style={{ position: "relative", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "visible" }}>
                                    <div style={{ height: "100%", width: `${mPct}%`, background: mDone ? "linear-gradient(90deg,#16a34a,#4ade80)" : mCur >= mReq ? "linear-gradient(90deg,#fb923c,#fbbf24)" : "linear-gradient(90deg,#b45309,#fb923c)", borderRadius: 3, transition: "width 0.3s" }} />
                                    {/* Required threshold marker */}
                                    {mReq < mMax && (
                                      <div style={{ position: "absolute", top: -2, left: `${mReqPct}%`, width: 2, height: 9, background: "rgba(251,146,60,0.8)", borderRadius: 1, transform: "translateX(-50%)" }} />
                                    )}
                                  </div>
                                  {!mDone && mCur < mReq && (
                                    <div style={{ fontSize: 8, color: "rgba(251,146,60,0.4)", marginTop: 3, fontFamily: "'Crimson Text', serif" }}>
                                      {t("aurora_req", { cur: mReq, max: mMax, left: mReq - mCur })}
                                    </div>
                                  )}
                                  {!mDone && mCur >= mReq && (
                                    <div style={{ fontSize: 8, color: "rgba(251,220,80,0.6)", marginTop: 3, fontFamily: "'Crimson Text', serif" }}>
                                      {t("aurora_threshold")}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Footer Awakening */}
              <div style={{ padding: "6px 13px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "0 0 8px 8px", borderTop: "1px solid rgba(52,211,153,0.1)", fontSize: 9, color: "rgba(226,201,126,0.25)", fontFamily: "'Crimson Text', serif" }}>
                Clique sur une sous-collection pour voir les items et tips de farm
              </div>
            </div>

            {/* ══════════════════════════════════════ */}
            {/* AURORA II: EMPOWERING                 */}
            {/* ══════════════════════════════════════ */}
            <div style={{ margin: "10px 14px 0" }}>
              {/* Header Empowering */}
              <div style={{ padding: "10px 13px", background: ach2Done ? "rgba(74,222,128,0.06)" : "rgba(52,211,153,0.05)", border: `1px solid ${ach2Done ? "rgba(74,222,128,0.3)" : "rgba(52,211,153,0.2)"}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ach2Done ? "#4ade80" : C, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
                    {ach2Done ? "✓ " : ""}{NX("Aurora II: Empowering")}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", marginTop: 2 }}>
                    {t("aurora2_reward")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: ach2Done ? "#4ade80" : C }}>
                    {ach2Done ? 21 : bits2.size}<span style={{ fontSize: 10, opacity: 0.5 }}>/21</span>
                  </div>
                </div>
              </div>
              {/* Barre */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderLeft: "1px solid rgba(52,211,153,0.2)", borderRight: "1px solid rgba(52,211,153,0.2)", padding: "6px 13px 2px" }}>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${((ach2Done ? 21 : bits2.size)/21)*100}%`, background: ach2Done ? "linear-gradient(90deg,#16a34a,#4ade80)" : `linear-gradient(90deg,${C}80,${C})` }} />
                </div>
              </div>

              {/* Note générale Empowering */}
              <div style={{ borderLeft: "1px solid rgba(52,211,153,0.2)", borderRight: "1px solid rgba(52,211,153,0.2)", padding: "7px 13px", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ fontSize: 10, color: "rgba(226,201,126,0.45)", fontFamily: "'Crimson Text', serif", fontStyle: "italic" }}>
                  {t("aurora2_help")}
                </div>
              </div>

              {/* Toggle liste complète */}
              <div
                style={{ borderLeft: "1px solid rgba(52,211,153,0.2)", borderRight: "1px solid rgba(52,211,153,0.2)", padding: "7px 13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(226,201,126,0.05)", background: "rgba(255,255,255,0.015)" }}
                onClick={() => setAuroraSubExpanded(auroraSubExpanded === "empowering" ? null : "empowering")}
              >
                <span style={{ fontSize: 11, color: "rgba(226,201,126,0.6)" }}>{t("aurora2_show_insights")}</span>
                <span style={{ fontSize: 10, color: "rgba(226,201,126,0.25)" }}>{auroraSubExpanded === "empowering" ? "▲" : "▼"}</span>
              </div>

              {auroraSubExpanded === "empowering" && (
                <div style={{ borderLeft: "1px solid rgba(52,211,153,0.2)", borderRight: "1px solid rgba(52,211,153,0.2)", padding: "4px 13px 10px 13px", background: "rgba(255,255,255,0.01)" }}>
                  {(sourcesAurora?.collections?.aurora_2?.items ?? []).map((item, i) => {
                    const done = ach2Done || bits2.has(i);
                    return (
                      <div key={i} style={{ padding: "5px 0", borderBottom: "1px solid rgba(226,201,126,0.04)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 12, height: 12, borderRadius: 2, border: `1px solid ${done ? "#4ade80" : "rgba(52,211,153,0.4)"}`, background: done ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                          {done && <span style={{ fontSize: 8, color: "#4ade80" }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: done ? "#4ade80" : "rgba(226,201,126,0.8)" }}>{NX(item.name)}</span>
                            <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.1)", borderRadius: 3, padding: "1px 5px" }}>{NX(item.map)}</span>
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{NX(item.how)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer Empowering */}
              <div style={{ padding: "6px 13px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "0 0 8px 8px", borderTop: "1px solid rgba(52,211,153,0.1)", fontSize: 9, color: "rgba(226,201,126,0.25)", fontFamily: "'Crimson Text', serif" }}>
                {t("aurora2_prereq")}
              </div>
            </div>

          </div>
        );
      })()}

      {/* ══════════════════════════════════════ */}
      {/* ONGLET COLLECTIONS — VISION          */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "collections" && selectedLeg === "vision" && (() => {
        const C = "#a78bfa"; // violet Vision
        const vc = visionCollections;
        const hasData = Object.keys(vc).length > 0;

        const v1Done = vc.vision_1?.done ?? false;
        const v2Done = vc.vision_2?.done ?? false;

        const VISIONS_OF = [
          { key: "vision_istan",       label: "Visions of Istan",             map: { fr: "Domaine d'Istan", en: "Domain of Istan" } },
          { key: "vision_kourna",      label: "Visions of Kourna",            map: { fr: "Domaine de Kourna", en: "Domain of Kourna" } },
          { key: "vision_jahai",       label: "Visions of Jahai",             map: { fr: "Promontoire de Jahai", en: "Jahai Bluffs" } },
          { key: "vision_sandswept",   label: "Visions of Sandswept Isles",   map: { fr: "Îles de Ventesable", en: "Sandswept Isles" } },
          { key: "vision_thunderhead", label: "Visions of Thunderhead Peaks", map: { fr: "Pics de Chef-Tonnerre", en: "Thunderhead Peaks" } },
          { key: "vision_dragonfall",  label: "Visions of Dragonfall",        map: { fr: "Chute draconique", en: "Dragonfall" } },
        ];
        const v1Count = VISIONS_OF.filter(v => vc[v.key]?.done).length;

        const CONVERGENCE = [
          { key: "vision_convergence_1", label: "The Convergence of Sorrow I: Elegy",   note: { fr: "6 items Elegy — liés aux Requiem Armor collections", en: "6 Elegy items — tied to the Requiem Armor collections" } },
          { key: "vision_convergence_2", label: "The Convergence of Sorrow II: Requiem", note: { fr: "6 items Requiem — suite de Elegy", en: "6 Requiem items — follow-up to Elegy" } },
        ];
        const convCount = CONVERGENCE.filter(c => vc[c.key]?.done).length;

        const REQUIEM = [
          { key: "requiem_1", label: "Requiem: Experiment 1" },
          { key: "requiem_2", label: "Requiem: Experiment 2" },
          { key: "requiem_3", label: "Requiem: Experiment 3" },
          { key: "requiem_4", label: "Requiem: Experiment 4" },
          { key: "requiem_5", label: "Requiem: Experiment 5" },
          { key: "requiem_6", label: "Requiem: Experiment 6" },
        ];
        const reqDone = REQUIEM.filter(r => vc[r.key]?.done).length;
        const elegyFromReq = reqDone * 50;

        return (
          <div style={{ paddingBottom: 20 }}>

            {/* Intro */}
            <div style={{ margin: "10px 14px 0", padding: "11px 13px", background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 8, fontFamily: "'Crimson Text', serif" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C, marginBottom: 4 }}>{t("vision_col_title")}</div>
              <div style={{ fontSize: 11, color: "rgba(226,201,126,0.6)", lineHeight: 1.6 }}>
                {t("vision_col_intro")}
                {t("vision_reqnote")}
                {!hasData && <span style={{ color: "#fb923c" }}>{t("sync_to_see")}</span>}
              </div>
            </div>

            {/* ── VISION I : Awakening ── */}
            <div style={{ margin: "10px 14px 0" }}>
              <div style={{ padding: "10px 13px", background: v1Done ? "rgba(74,222,128,0.06)" : "rgba(167,139,250,0.05)", border: `1px solid ${v1Done ? "rgba(74,222,128,0.3)" : "rgba(167,139,250,0.2)"}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: v1Done ? "#4ade80" : C, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
                    {v1Done ? "✓ " : ""}{NX("Vision I: Awakening")}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", marginTop: 2 }}>
                    {t("vision_reward_1")}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: v1Done ? "#4ade80" : C }}>{v1Count}<span style={{ fontSize: 10, opacity: 0.5 }}>/6</span></div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderLeft: `1px solid rgba(167,139,250,0.2)`, borderRight: `1px solid rgba(167,139,250,0.2)`, padding: "6px 13px 8px" }}>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${(v1Count/6)*100}%`, background: v1Done ? "linear-gradient(90deg,#16a34a,#4ade80)" : `linear-gradient(90deg,${C}80,${C})` }} />
                </div>
              </div>
              {VISIONS_OF.map((v, i) => {
                const done = vc[v.key]?.done ?? false;
                const cur  = vc[v.key]?.current ?? 0;
                const max  = vc[v.key]?.max ?? 0;
                const isLast = i === VISIONS_OF.length - 1;
                return (
                  <div key={v.key} style={{ padding: "8px 13px", background: done ? "rgba(74,222,128,0.02)" : "rgba(255,255,255,0.01)", borderLeft: `1px solid rgba(167,139,250,0.2)`, borderRight: `1px solid rgba(167,139,250,0.2)`, borderTop: "1px solid rgba(226,201,126,0.04)", borderBottom: isLast ? `1px solid rgba(167,139,250,0.2)` : "none", borderRadius: isLast ? "0 0 8px 8px" : 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${done ? "#4ade80" : "rgba(167,139,250,0.5)"}`, background: done ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {done && <span style={{ fontSize: 9, color: "#4ade80" }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: done ? "#4ade80" : "rgba(226,201,126,0.8)" }}>{NX(v.label)}</span>
                      <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", marginLeft: 7, background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.1)", borderRadius: 3, padding: "1px 5px" }}>{NX(v.map)}</span>
                    </div>
                    {hasData && !done && max > 0 && (
                      <span style={{ fontSize: 10, color: "rgba(226,201,126,0.4)" }}>{cur}/{max}</span>
                    )}
                  </div>
                );
              })}
              {/* ── Required craft: Memory Essence Encapsulator ── */}
              {(() => {
                const mee = SOURCES_DB?.craft_components?.memory_essence_encapsulator;
                if (!mee) return null;
                return (
                  <div style={{ margin: "6px 0 0", padding: "9px 13px", background: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C, fontFamily: "'Cinzel', serif", letterSpacing: "0.04em" }}>{NX("Memory Essence Encapsulator")}</span>
                        <span style={{ fontSize: 9, color: "rgba(167,139,250,0.5)", marginLeft: 7 }}>{t("x6_required")}</span>
                      </div>
                      <a href={`https://wiki.guildwars2.com/wiki/${mee.wiki}`} target="_blank" rel="noreferrer"
                        style={{ fontSize: 9, color: "rgba(167,139,250,0.5)", textDecoration: "none", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 3, padding: "1px 5px" }}>
                        wiki ↗
                      </a>
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(251,146,60,0.7)", fontFamily: "'Crimson Text', serif", marginBottom: 6 }}>
                      {t("vision_mee_craft")}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {mee.craft?.ingredients?.map(ing => (
                        <div key={ing.apiId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, color: "rgba(226,201,126,0.6)", fontFamily: "'Crimson Text', serif" }}>
                          <span>{NX(ing.name)}</span>
                          <span style={{ color: "rgba(226,201,126,0.35)" }}>×{ing.qty * 6}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 9, color: "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif", borderTop: "1px solid rgba(226,201,126,0.06)", paddingTop: 5 }}>
                      {t("vision_mee_note")}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ── VISION II : Farsight (Convergence of Sorrow) ── */}
            <div style={{ margin: "10px 14px 0" }}>
              <div style={{ padding: "10px 13px", background: v2Done ? "rgba(74,222,128,0.06)" : "rgba(167,139,250,0.05)", border: `1px solid ${v2Done ? "rgba(74,222,128,0.3)" : "rgba(167,139,250,0.2)"}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: v2Done ? "#4ade80" : C, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
                    {v2Done ? "✓ " : ""}{NX("Vision II: Farsight")}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", marginTop: 2 }}>
                    {t("vision_reward_2")}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: v2Done ? "#4ade80" : C }}>{convCount}<span style={{ fontSize: 10, opacity: 0.5 }}>/2</span></div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderLeft: `1px solid rgba(167,139,250,0.2)`, borderRight: `1px solid rgba(167,139,250,0.2)`, padding: "6px 13px 8px" }}>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${(convCount/2)*100}%`, background: v2Done ? "linear-gradient(90deg,#16a34a,#4ade80)" : `linear-gradient(90deg,${C}80,${C})` }} />
                </div>
              </div>
              {CONVERGENCE.map((c, i) => {
                const done = vc[c.key]?.done ?? false;
                const isLast = i === CONVERGENCE.length - 1;
                return (
                  <div key={c.key} style={{ padding: "8px 13px", background: done ? "rgba(74,222,128,0.02)" : "rgba(255,255,255,0.01)", borderLeft: `1px solid rgba(167,139,250,0.2)`, borderRight: `1px solid rgba(167,139,250,0.2)`, borderTop: "1px solid rgba(226,201,126,0.04)", borderBottom: isLast ? `1px solid rgba(167,139,250,0.2)` : "none", borderRadius: isLast ? "0 0 8px 8px" : 0, display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${done ? "#4ade80" : "rgba(167,139,250,0.5)"}`, background: done ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      {done && <span style={{ fontSize: 9, color: "#4ade80" }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: done ? "#4ade80" : "rgba(226,201,126,0.8)" }}>{NX(c.label)}</div>
                      <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{NX(c.note)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── REQUIEM Experiments (Elegy Mosaics) ── */}
            <div style={{ margin: "10px 14px 0" }}>
              <div
                style={{ padding: "10px 13px", background: reqDone === 6 ? "rgba(74,222,128,0.06)" : "rgba(167,139,250,0.05)", border: `1px solid ${reqDone === 6 ? "rgba(74,222,128,0.3)" : "rgba(167,139,250,0.2)"}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                onClick={() => setVisionSubExpanded(visionSubExpanded === "requiem" ? null : "requiem")}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: reqDone === 6 ? "#4ade80" : C, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
                    {reqDone === 6 ? "✓ " : ""}{t("vision_elegy_label")}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", marginTop: 2 }}>
                    {t("vision_elegy_note", { n: elegyFromReq })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: reqDone === 6 ? "#4ade80" : C }}>{reqDone}<span style={{ fontSize: 10, opacity: 0.5 }}>/6</span></div>
                  <span style={{ fontSize: 10, color: "rgba(226,201,126,0.25)" }}>{visionSubExpanded === "requiem" ? "▲" : "▼"}</span>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderLeft: `1px solid rgba(167,139,250,0.2)`, borderRight: `1px solid rgba(167,139,250,0.2)`, borderBottom: visionSubExpanded === "requiem" ? "none" : `1px solid rgba(167,139,250,0.2)`, borderRadius: visionSubExpanded === "requiem" ? 0 : "0 0 8px 8px", padding: "6px 13px 8px" }}>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${(reqDone/6)*100}%`, background: reqDone === 6 ? "linear-gradient(90deg,#16a34a,#4ade80)" : `linear-gradient(90deg,${C}80,${C})` }} />
                </div>
              </div>
              {visionSubExpanded === "requiem" && (
                <div style={{ borderLeft: `1px solid rgba(167,139,250,0.2)`, borderRight: `1px solid rgba(167,139,250,0.2)`, borderBottom: `1px solid rgba(167,139,250,0.2)`, borderRadius: "0 0 8px 8px" }}>
                  {REQUIEM.map((r, i) => {
                    const done = vc[r.key]?.done ?? false;
                    const cur  = vc[r.key]?.current ?? 0;
                    const max  = vc[r.key]?.max ?? 0;
                    return (
                      <div key={r.key} style={{ padding: "7px 13px", background: done ? "rgba(74,222,128,0.02)" : "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(226,201,126,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${done ? "#4ade80" : "rgba(167,139,250,0.4)"}`, background: done ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {done && <span style={{ fontSize: 8, color: "#4ade80" }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, fontSize: 11, color: done ? "#4ade80" : "rgba(226,201,126,0.75)" }}>{r.label}</div>
                        <div style={{ fontSize: 10, color: done ? "rgba(74,222,128,0.6)" : "rgba(167,139,250,0.5)" }}>
                          {done ? "+50 Elegy" : hasData && max > 0 ? `${cur}/${max}` : "50 Elegy"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* ══════════════════════════════════ */}
      {/* ONGLET PROGRESSION (currencies)   */}
      {/* ══════════════════════════════════ */}
      {/* ══════════════════════════════════ */}
      {/* ONGLET PIÈCES (Obsidian Armor)     */}
      {/* ══════════════════════════════════ */}
      {activeTab === "pieces" && isObsidian && (() => {
        const slotL = OBS_SLOT_LABELS[lang] ?? OBS_SLOT_LABELS.en;
        const weightL = OBS_WEIGHT_LABELS[lang] ?? OBS_WEIGHT_LABELS.en;
        // matrice poids → slot → { id, name } depuis obsItems
        const matrix = {};
        if (obsItems) {
          for (const [idStr, info] of Object.entries(obsItems)) {
            if (!matrix[info.weight]) matrix[info.weight] = {};
            matrix[info.weight][info.slot] = { id: Number(idStr), name: info.name };
          }
        }
        const goalLabel = obsHasTarget
          ? t("obs_goal", { n: obsTarget.size, o: obsTargetOwned, r: obsRemainingCount })
          : t("obs_goal_default", { r: obsRemainingCount });
        return (
          <div>
            <div className="section-label">{t("tab_pieces", { n: obsOwnedSet.size })}</div>
            <div style={{ margin: "6px 14px", padding: "10px 13px", background: "rgba(129,140,248,0.05)", border: "1px solid rgba(129,140,248,0.18)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.6)" }}>
              {t("obs_target_hint")}
            </div>
            <div style={{ margin: "6px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: legColor }}>{goalLabel}</div>
              <button className="adj-btn" onClick={() => detectGtArmory()}>{t("obs_sync")}</button>
            </div>
            {!obsItems && (
              <div style={{ margin: "10px 14px", fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: "12px", color: "rgba(226,201,126,0.45)" }}>
                {t("obs_resolving")}
              </div>
            )}
            {obsItems && LEGENDARIES.obsidian.weights.map(w => (
              <div key={w} style={{ margin: "10px 14px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(226,201,126,0.5)", marginBottom: "6px" }}>
                  {weightL[w] ?? w}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                  {LEGENDARIES.obsidian.slots.map(s => {
                    const cell = matrix[w] ? matrix[w][s] : null;
                    if (!cell) return <div key={s} />;
                    const owned = obsOwnedSet.has(cell.id);
                    const targeted = obsTarget.has(cell.id);
                    const border = owned ? "1px solid rgba(74,222,128,0.6)" : (targeted ? `1px solid ${legColor}` : "1px solid rgba(226,201,126,0.08)");
                    const bg = owned ? "rgba(74,222,128,0.07)" : (targeted ? "rgba(129,140,248,0.10)" : "rgba(255,255,255,0.02)");
                    return (
                      <div key={s}
                        onClick={() => { if (!owned) toggleObsTarget(cell.id); }}
                        title={cell.name}
                        style={{ padding: "8px 6px", borderRadius: "7px", border, background: bg, cursor: owned ? "default" : "pointer", textAlign: "center", opacity: owned || targeted ? 1 : 0.55 }}>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: owned ? "#4ade80" : (targeted ? legColor : "rgba(226,201,126,0.7)") }}>
                          {owned ? "✓ " : ""}{slotL[s] ?? s}
                        </div>
                        <div style={{ fontSize: "9px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {cell.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="section-label" style={{ marginTop: "14px" }}>{t("obs_arcanum_title")}</div>
            {LEGENDARIES.obsidian.slots.map(s => {
              const a = LEGENDARIES.obsidian.arcanum[s];
              const st = obsAch[`arcanum_${s}`] ?? {};
              const done = st.done === true;
              const cur = st.current ?? 0;
              const mx = st.max ?? 3;
              const slotL2 = (OBS_SLOT_LABELS[lang] ?? OBS_SLOT_LABELS.en)[s] ?? s;
              return (
                <div key={s} style={{ margin: "6px 14px", padding: "10px 13px", background: "rgba(255,255,255,0.02)", border: `1px solid ${done ? "rgba(74,222,128,0.4)" : "rgba(226,201,126,0.08)"}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: done ? "#4ade80" : "#e2c97e" }}>
                      {done ? "✓ " : ""}{NX(a.name)} — {slotL2}
                    </div>
                    <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>
                      {t("obs_boss", { b: a.boss })} · {a.gift === "magical" ? t("obs_gift_magical") : t("obs_gift_mighty")}
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: done ? "#4ade80" : legColor }}>
                    {done ? "✓" : `${cur}/${mx}`}
                  </div>
                </div>
              );
            })}
            <div style={{ margin: "10px 14px", padding: "10px 13px", background: "rgba(226,201,126,0.03)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.5)" }}>
              {t("obs_arcanum_note")}
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════ */}
      {/* ONGLET RAIDS (Coalescence)         */}
      {/* ══════════════════════════════════ */}
      {activeTab === "raids" && leg?.raidAchievements && (
        <div>
          <div style={{ margin: "10px 14px 6px", padding: "11px 13px", background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.65)", lineHeight: 1.5 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: legColor, marginBottom: "5px" }}>⚔ {NL(selectedLeg, leg?.name)}</div>
            {(leg?.collectionNoteKeys ?? []).map((k, i) => <div key={k} style={{ marginTop: i > 0 ? 4 : 0 }}>{t(k)}</div>)}
          </div>
          <div className="section-label">Collections</div>
          <div style={{ margin: "2px 14px 6px", fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.35)" }}>{t("bits_tap_hint")}</div>
          {(leg?.raidAchievements ?? []).map(a => {
            const st = apiAch[a.key] ?? {};
            const done = st.done === true;
            const cur = st.current ?? 0;
            const mx = st.max ?? 0;
            const locked = !done && mx === 0;
            const isOpen = expandedAch === a.key;
            const def = achBitsDefs[String(a.achievementId)];
            const doneBits = new Set(st.bits ?? []);
            return (
              <div key={a.key}
                onClick={() => setExpandedAch(isOpen ? null : a.key)}
                style={{ margin: "6px 14px", padding: "10px 13px", background: "rgba(255,255,255,0.02)", border: `1px solid ${done ? "rgba(74,222,128,0.4)" : "rgba(226,201,126,0.08)"}`, borderRadius: "8px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: done ? "#4ade80" : "#e2c97e" }}>
                    <span style={{ opacity: 0.5, marginRight: 5 }}>{isOpen ? "▾" : "▸"}</span>{done ? "✓ " : ""}{NX(a.name)}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: done ? "#4ade80" : legColor }}>
                    {done ? "✓" : (locked ? t("ach_locked") : `${cur}/${mx}`)}
                  </div>
                </div>
                <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", marginTop: "3px" }}>
                  {L(a.tip)}
                </div>
                {isOpen && (
                  <div style={{ marginTop: "8px", borderTop: "1px solid rgba(226,201,126,0.08)", paddingTop: "7px" }} onClick={e => e.stopPropagation()}>
                    {locked && (
                      <div style={{ fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(251,146,60,0.6)", marginBottom: "5px" }}>{t("bits_locked_note")}</div>
                    )}
                    {!a.recipe && !def && (
                      <div style={{ fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.4)" }}>{t("bits_loading")}</div>
                    )}
                    {a.recipe && (
                      <div style={{ marginBottom: "6px" }}>
                        {(L(a.recipe) ?? []).map((line, li) => (
                          <div key={li} style={{ fontSize: "11px", color: "rgba(226,201,126,0.65)", fontFamily: "'Crimson Text', serif", padding: "2px 0", lineHeight: 1.45 }}>
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                    {!a.recipe && def && (def.bits.length === 0 ? (
                      (def.subs && def.subs.length > 0) ? (
                        <div>
                          <div style={{ fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.4)", marginBottom: "4px" }}>
                            {t("bits_meta_note")}{Object.keys(achSubStatus).length === 0 ? " " + t("bits_meta_nostatus") : ""}
                          </div>
                          {def.subs.map(s => {
                            const ss = achSubStatus[String(s.id)] ?? {};
                            const sDone = ss.done === true;
                            return (
                              <div key={s.id} style={{ display: "flex", alignItems: "baseline", gap: "6px", padding: "2px 0", fontSize: "11px", color: sDone ? "#4ade80" : "rgba(226,201,126,0.6)" }}>
                                <span style={{ fontSize: "10px", width: 12, flexShrink: 0 }}>{sDone ? "✓" : "○"}</span>
                                <span style={{ textDecoration: sDone ? "line-through" : "none", opacity: sDone ? 0.7 : 1 }}>{s.name}{!sDone && ss.max > 0 ? ` (${ss.current}/${ss.max})` : ""}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.4)" }}>—</div>
                      )
                    ) : def.bits.map((b, i) => {
                      const stepDone = done || doneBits.has(i);
                      let label = t("bits_step", { n: i + 1 });
                      if (b.type === "Item" && b.id) { label = def.names[String(b.id)] ?? label; }
                      else if (b.type === "Text" && b.text) { label = b.text; }
                      else if (b.type === "Skin") { label = label + " (skin)"; }
                      else if (b.type === "Minipet") { label = label + " (mini)"; }
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "6px", padding: "2px 0", fontSize: "11px", color: stepDone ? "#4ade80" : "rgba(226,201,126,0.6)" }}>
                          <span style={{ fontSize: "10px", width: 12, flexShrink: 0 }}>{stepDone ? "✓" : "○"}</span>
                          <span style={{ textDecoration: stepDone ? "line-through" : "none", opacity: stepDone ? 0.7 : 1 }}>{label}</span>
                        </div>
                      );
                    }))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════ */}
      {/* ONGLET ARMES (Gen 3)               */}
      {/* ══════════════════════════════════ */}
      {activeTab === "weapons" && isWeapons && (() => {
        const goalLabel = wpnHasTarget
          ? t("wpn_goal", { n: wpnTarget.size, o: wpnTargetOwned, r: wpnRemainingCount })
          : t("wpn_goal_default");
        return (
          <div>
            <div className="section-label">{t("tab_weapons", { n: wpnOwnedSet.size, m: wpnIds.length || 16 })}</div>
            <div style={{ margin: "6px 14px", padding: "10px 13px", background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.18)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.6)" }}>
              {t("wpn_target_hint")}
            </div>
            <div style={{ margin: "6px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: legColor }}>{goalLabel}</div>
              <button className="adj-btn" onClick={() => detectGtArmory()}>{t("obs_sync")}</button>
            </div>
            {!wpnItems && (
              <div style={{ margin: "10px 14px", fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: "12px", color: "rgba(226,201,126,0.45)" }}>
                {t("wpn_resolving")}
              </div>
            )}
            {wpnItems && (
              <div style={{ margin: "10px 14px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                {[...wpnIds].sort((x, y) => ((wpnItems[String(x)] ?? {}).wtype ?? "").localeCompare((wpnItems[String(y)] ?? {}).wtype ?? "")).map(id => {
                  const cell = wpnItems[String(id)];
                  if (!cell) return <div key={id} />;
                  const owned = wpnOwnedSet.has(id);
                  const targeted = wpnTarget.has(id);
                  const border = owned ? "1px solid rgba(74,222,128,0.6)" : (targeted ? `1px solid ${legColor}` : "1px solid rgba(226,201,126,0.08)");
                  const bg = owned ? "rgba(74,222,128,0.07)" : (targeted ? "rgba(96,165,250,0.10)" : "rgba(255,255,255,0.02)");
                  return (
                    <div key={id}
                      onClick={() => { if (!owned) toggleWpnTarget(id); }}
                      title={cell.name}
                      style={{ padding: "8px 5px", borderRadius: "7px", border, background: bg, cursor: owned ? "default" : "pointer", textAlign: "center", opacity: owned || targeted ? 1 : 0.55 }}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: owned ? "#4ade80" : (targeted ? legColor : "rgba(226,201,126,0.7)") }}>
                        {owned ? "✓ " : ""}{NX(cell.wtype)}
                      </div>
                      <div style={{ fontSize: "9px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cell.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {(leg?.collectionNoteKeys ?? []).map(k => (
              <div key={k} style={{ margin: "8px 14px", padding: "10px 13px", background: "rgba(226,201,126,0.03)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.5)" }}>
                {t(k)}
              </div>
            ))}
          </div>
        );
      })()}

      {activeTab === "currencies" && (
        <div>
          <div className="section-label">{t("sec_currency", { name: leg?.name })}</div>
          {(leg?.currencyNoteKeys ?? []).map(k => (
            <div key={k} style={{ margin: "6px 14px", padding: "8px 12px", background: "rgba(226,201,126,0.03)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.55)" }}>
              {t(k)}
            </div>
          ))}
          {isWeapons && (
            <div style={{ margin: "6px 14px", padding: "8px 12px", background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.55)" }}>
              {t("wpn_goal", { n: wpnTarget.size, o: wpnTargetOwned, r: wpnRemainingCount })}
            </div>
          )}
                    {isObsidian && (
            <div style={{ margin: "6px 14px", padding: "8px 12px", background: "rgba(129,140,248,0.05)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.55)" }}>
              {t("obs_per_piece_note", { n: obsRemainingCount })}
            </div>
          )}
          {mainProgress.map(cur => (
            <div key={cur.id} style={{ margin: "6px 14px", padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ fontSize: "16px" }}>{cur.icon}</span>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600 }}>{NX(cur.name)}</div>
                    <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif" }}>
                      {t("req_missing", { req: cur.required.toLocaleString(), miss: Math.max(0, cur.required - cur.owned).toLocaleString() })}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: legColor }}>
                  {cur.owned}<span style={{ fontSize: "11px", opacity: 0.4 }}>/{cur.required}</span>
                </div>
              </div>
              <div className="prog-bar">
                <div className="prog-fill" style={{ width: `${cur.pct}%`, background: `linear-gradient(90deg, ${legColor}80, ${legColor})` }} />
              </div>
              <div style={{ display: "flex", gap: "5px", marginTop: "9px", justifyContent: "center" }}>
                {[-10, -1, +1, +5, +10, +50].map(d => (
                  <button key={d} className="adj-btn" onClick={() => adjustCurrency(cur.id, d)}>
                    {d > 0 ? `+${d}` : d}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="reset-info" style={{ marginTop: "8px" }}>{t("reset_info_progress")}</div>
        </div>
      )}

      {/* ══════════════════════════════════ */}
      {/* ONGLET MATÉRIAUX COMMUNS          */}
      {/* ══════════════════════════════════ */}
      {activeTab === "trinkets" && isTrinkets && (() => {
        const DB = (typeof SOURCES_DB !== "undefined" ? (SOURCES_DB.legendaries ?? {}) : {});
        const keys = (leg.trinketKeys ?? []).filter(k => DB[k]);
        const curKey = keys.includes(selTrinket) ? selTrinket : keys[0];
        const T = DB[curKey];
        if (!T) return <div style={{ padding: 20, color: "rgba(226,201,126,0.6)", fontFamily: "'Crimson Text', serif" }}>SOURCES_DB indisponible — rebuild requis.</div>;
        const armoryId = T.armory_api_id;
        const owned = !!armoryId && (gtOwnedIds.has(armoryId) || gtManualOwnedIds.has(armoryId));
        const toggleStep = (sk) => {
          const nx = { ...trinketSteps, [sk]: !trinketSteps[sk] };
          setTrinketSteps(nx);
          try { localStorage.setItem("gw2_trinket_steps", JSON.stringify(nx)); } catch (_) {}
        };
        const achOf = (k) => ((apiAch ?? {})[k] ?? null);
        const badge = (txt, color) => (
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, border: `1px solid ${color}`, color, letterSpacing: "0.05em", fontFamily: "'Cinzel', serif", whiteSpace: "nowrap" }}>{txt}</span>
        );
        return (
          <div>
            {/* Sous-sélecteur des 7 colifichets */}
            <div style={{ display: "flex", gap: 6, padding: "12px 14px 4px", overflowX: "auto" }}>
              {keys.map(k => {
                const e = DB[k];
                const kOwned = !!e.armory_api_id && (gtOwnedIds.has(e.armory_api_id) || gtManualOwnedIds.has(e.armory_api_id));
                return (
                  <button key={k}
                    onClick={() => setSelTrinket(k)}
                    className={`leg-btn ${curKey === k ? "active" : ""}`}
                    style={{ "--leg-color": "#5eead4", "--leg-bg": "rgba(94,234,212,0.12)", fontSize: 10 }}>
                    {kOwned ? "✓ " : ""}{NL(k, e.name)}
                  </button>
                );
              })}
            </div>

            {/* En-tête */}
            <div className="card" style={{ cursor: "default" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: "#5eead4", fontWeight: 600 }}>{NL(curKey, T.name)}</div>
                {badge(NX({ fr: ({ ring: "Anneau", accessory: "Accessoire", amulet: "Amulette", back: "Dos" })[T.slot] ?? T.slot, en: T.slot }), "rgba(226,201,126,0.55)")}
                {badge(T.expansion, "rgba(226,201,126,0.4)")}
                {badge(NXS(T.farm), "rgba(167,139,250,0.7)")}
                {armoryId
                  ? badge(owned ? NX({ fr: "✓ Possédé (armory)", en: "✓ Owned (armory)" }) : NX({ fr: "Non possédé", en: "Not owned" }), owned ? "#4ade80" : "rgba(226,201,126,0.35)")
                  : badge(NX({ fr: "apiId inconnu", en: "apiId unknown" }), "rgba(248,113,113,0.6)")}
              </div>
              <div style={{ marginTop: 8, fontFamily: "'Crimson Text', serif", fontSize: 13, color: "rgba(226,201,126,0.75)" }}>{NXS(NX(T.recipe))}</div>
              {T.note && <div style={{ marginTop: 6, fontFamily: "'Crimson Text', serif", fontSize: 12, color: "rgba(226,201,126,0.5)", fontStyle: "italic" }}>{NX(T.note)}</div>}
              {T.timegate && <div style={{ marginTop: 6, fontSize: 11, color: "#fbbf24", fontFamily: "'Crimson Text', serif" }}>⏳ {NX(T.timegate)}</div>}
            </div>

            {/* Prérequis chiffrés (ex. Strife Unending) */}
            {(T.requirements ?? []).length > 0 && (
              <>
                <div className="section-label">{NX({ fr: "Composants requis", en: "Required components" })}</div>
                {T.requirements.map((r, i) => (
                  <div key={i} className="card" style={{ cursor: "default", padding: "9px 15px" }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "rgba(226,201,126,0.8)" }}>{NXS(r.name)}</div>
                    {r.note && <div style={{ marginTop: 3, fontFamily: "'Crimson Text', serif", fontSize: 12, color: "rgba(226,201,126,0.5)" }}>{NX(r.note)}</div>}
                  </div>
                ))}
              </>
            )}

            {/* Collections / succès — progression API */}
            {(T.achievements ?? []).length > 0 && (
              <>
                <div className="section-label">{NX({ fr: "Collections & succès", en: "Collections & achievements" })}</div>
                {T.achievements.map((a) => {
                  const p = achOf(a.key);
                  const done = !!(p && p.done);
                  const hasProg = !!(p && p.max > 0);
                  const pct = hasProg ? Math.min(100, Math.round((p.current / p.max) * 100)) : 0;
                  return (
                    <div key={a.id} className="card" style={{ cursor: "default" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ color: done ? "#4ade80" : "rgba(226,201,126,0.35)", fontSize: 13 }}>{done ? "✓" : "○"}</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11.5, color: done ? "#4ade80" : "rgba(226,201,126,0.85)" }}>{NXS(a.name)}</span>
                        <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)" }}>#{a.id}</span>
                        {!done && hasProg && <span style={{ fontSize: 10, color: "#5eead4", fontFamily: "'Crimson Text', serif" }}>{p.current}/{p.max}</span>}
                        {!done && !hasProg && <span style={{ fontSize: 10, color: "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif" }}>{NX({ fr: "— (sync API pour la progression)", en: "— (sync API for progress)" })}</span>}
                      </div>
                      {!done && hasProg && (
                        <div style={{ marginTop: 6, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#5eead4", borderRadius: 2, transition: "width 0.3s" }} />
                        </div>
                      )}
                      {a.note && <div style={{ marginTop: 6, fontFamily: "'Crimson Text', serif", fontSize: 12, color: "rgba(226,201,126,0.5)" }}>{NX(a.note)}</div>}
                    </div>
                  );
                })}
              </>
            )}

            {/* Guide pas-à-pas (coche manuelle) */}
            {(T.guide ?? []).length > 0 && (
              <>
                <div className="section-label">{NX({ fr: "Guide pas-à-pas", en: "Step-by-step guide" })}</div>
                {T.guide.map((g, i) => {
                  const sk = `${curKey}:${i}`;
                  const ck = !!trinketSteps[sk];
                  return (
                    <div key={i} className={`card ${ck ? "checked" : ""}`} onClick={() => toggleStep(sk)} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: ck ? "#4ade80" : "#5eead4", minWidth: 18 }}>{ck ? "✓" : (i + 1) + "."}</span>
                      <span style={{ fontFamily: "'Crimson Text', serif", fontSize: 12.5, color: "rgba(226,201,126,0.75)", lineHeight: 1.45 }}>{NXS(NX(g))}</span>
                    </div>
                  );
                })}
              </>
            )}

            {/* Lien wiki */}
            {T.wiki && (
              <div style={{ margin: "10px 14px 18px", fontSize: 11, fontFamily: "'Crimson Text', serif" }}>
                <a href={`https://wiki.guildwars2.com/wiki/${T.wiki}`} target="_blank" rel="noreferrer" style={{ color: "rgba(94,234,212,0.7)" }}>
                  {NX({ fr: "→ Fiche wiki complète", en: "→ Full wiki page" })}
                </a>
              </div>
            )}
          </div>
        );
      })()}

      {activeTab === "common" && (
        <div>
          <div className="section-label">{t("sec_common")}</div>
          <div style={{ margin: "6px 14px", padding: "10px 13px", background: "rgba(226,201,126,0.03)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.5)" }}>
            {t("common_intro")}
          </div>
          {COMMON_MATS.map(m => {
            const owned = commonMats[m.id] ?? 0;
            const pct = Math.min(100, (owned / m.required) * 100);
            return (
              <div key={m.id} style={{ margin: "6px 14px", padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px" }}
                onClick={() => setExpanded(expanded === `cm_${m.id}` ? null : `cm_${m.id}`)}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ fontSize: "16px" }}>{m.icon}</span>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600 }}>{NX(m.name)}</div>
                      <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif" }}>
                        {t("req_missing", { req: m.required, miss: Math.max(0, m.required - owned) })}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: pct >= 100 ? "#4ade80" : "#e2c97e" }}>
                    {owned}<span style={{ fontSize: "11px", opacity: 0.4 }}>/{m.required}</span>
                  </div>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${pct}%`, background: pct >= 100 ? "linear-gradient(90deg, #16a34a, #4ade80)" : "linear-gradient(90deg, #b45309, #e2c97e)" }} />
                </div>
                {expanded === `cm_${m.id}` && (
                  <div style={{ marginTop: "9px" }}>
                    <div style={{ display: "flex", gap: "5px", justifyContent: "center", marginBottom: "8px" }}>
                      {[-10, -1, +1, +5, +10].map(d => (
                        <button key={d} className="adj-btn" onClick={e => { e.stopPropagation(); adjustCurrency(m.id, d, true); }}>
                          {d > 0 ? `+${d}` : d}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: "12px", color: "rgba(226,201,126,0.5)", textAlign: "center" }}>
                      {NX(m.tip)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="reset-info" style={{ marginTop: "8px" }}>{t("reset_info_common")}</div>
        </div>
      )}

      </>}
    </div>
    </LangContext.Provider>
  );
}
