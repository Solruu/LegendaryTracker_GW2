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
    tab_cadences: "Cadences",
    cad_daily_reset: "Daily reset in",
    cad_weekly_reset: "Weekly reset in",
    cad_reset_note: "Boxes clear themselves at reset — the storage key carries the period.",
    cad_pick: "Legendaries targeted",
    cad_verified: "✓ caps checked {d}",
    cad_unverified: "⚙ caps not verified",
    cad_partial: "◐ {a}/{b} sources checked",
    cad_need: "Needed: {n}",
    cad_owned: "held {n}",
    cad_missing: "short {n}",
    cad_eta: "≈ {w} week(s) at {p}/week — around {d}",
    cad_uncapped_note: "(uncapped sources excluded from the estimate)",
    cad_nocap: "no cap",
    cad_per_day: "day",
    cad_per_week: "week",
    cad_per_season: "season",
    cad_empty: "Pick your target legendaries above to compute needs and delays.",
    cad_clear: "Clear selection",
    arb_title: "Magnetite arbitration",
    arb_intro: "Manfred sells Coins and Clovers for the same currency Coalescence consumes. Weekly budget: {b}.",
    arb_coins: "Mystic Coins bought",
    arb_clovers: "Mystic Clovers bought",
    arb_spent: "{s} of {b} spent",
    arb_left: "{n} left for Coalescence",
    arb_over: "— over budget by {n}!",
    arb_need: "Coalescence needs {n}",
    arb_weeks: "≈ {w} week(s) at this split",
    arb_never: "nothing left — Coalescence never progresses",
    arb_offcap: "Off-cap sources (Challenge Mode, trading minis to raid vendors, salvaging ascended drops, achievements) do not count against the budget — that is the real way out of the trade-off.",
    cad_not_needed: "Not required by your selection.",
    cad_nostock: "stock unknown — sync with your API key",
    bits_step: "Step {n}",
    bits_meta_req: "Meta-achievement — {n} required out of {m} eligible objectives.",
    bits_meta_left: "{n} left to reach the threshold.",
    bits_src_wiki: "✓ List curated from the wiki (checked {d}) — exact.",
    bits_src_api: "⚙ List derived from the category — it holds more achievements than the meta requires.",
    bits_src_mismatch: "⚠ {a} eligible done vs {b} counted by the game: this list is out of date.",
    bits_path: "⚡ Shortest path — the {n} cheapest remaining ({s} you can skip):",
    bits_why: "volume {v} · prerequisites {p} · {a} AP",
    bits_has_prereq: "— gated behind a prerequisite.",
    bits_counter_gap: "⚙ Counter of {n} with no step list available — flag it so Claude can source it.",
    bits_no_api: "exists in game but not exposed by the API — status cannot be tracked",
    wpn_note1: "Per weapon: precursor (craft 500) + Gift of Aurene's X + Gift of Jade Mastery + Draconic Tribute. Key totals: 100 Antique Summoning Stones (capped at 17/week: 7 from the daily Dragon's End meta, 5 from Leivas, 5 from EoD strike CMs — or TP), 100 Jade Runestones, 38 Clovers, 5 Amalgamated Draconic Lodestones, ~3000 Research Notes.",
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
    gt_stock_diag: "Stock sync returned {f} of {a} resources (source: {s}). A zero here is not an empty inventory.",
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
    chars_note_hearts: "{n} char{s} × (~20 oyster nodes + 3 daily named foes) — karma vendors on top",
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
    aurora_alt: "↔ Alternative",
    unlock_first_title: "⚠ UNLOCK BEFORE PLAYING THIS CONTENT",
    free_sources: "◈ FREE AND REPEATABLE",
    wp_order: "route {n}/21",
    proj_left: "{n} {u} left",
    proj_runs: "~{n} quickplay runs",
    proj_weeks3: "{n} weeks at 3 runs/week + weekly",
    proj_weeks_passive: "{n} weeks on the weekly alone",
    wp_order_title: "Position in the cheapest waypoint route",
    calc_link: "↗ Cost calculator (gw2efficiency, uses your own stock)",
    cur_extras_done: "✓ collection purchases already made — base requirement only",
    cur_not_sent: "⚠ 0 is not a stock: the sync source never sent this currency. Check that the local Flask server is up to date.",
    bags_missing: "⚠ Character bags could not be read — your API key is missing the 'characters' or 'inventories' scope. Anything not yet deposited is undercounted.",
    karma_note: "Shown because the total exceeds 100,000. ⚠ marks an unverified estimate.",
    aurora_src_api: "threshold read live from the API",
    aurora_src_gap: "⚠ stored threshold ({j}) differs from the API ({a}) — the API wins",
    aurora_src_wait: "threshold not yet loaded from the API",
    mastery_steps: "Eligible achievements: {d}/{n} done · {r} still needed",
    mastery_shortest: "Pick any {r} of the {s} remaining — the rest can be skipped.",
    mastery_nosteps: "⚠ no step list resolved for this meta — report it",
    mastery_nostatus: "Sync with your API key to see which ones are done.",
    mastery_src_wiki: "curated wiki list ({d}) — {o} of them are optional",
    mastery_stale: "⚠ the official counter says {c} done, this list only knows {d} — press the API button to refresh the snapshot",
    diag_title: "⚕ Data check — {n} meta(s) without a step list",
    diag_counts: "{w} curated from the wiki · {c} falling back to their API category",
    diag_none: "Every downloaded counter-meta resolves to a step list.",
    diag_threshold: "threshold {n}",
    diag_scope: "This panel only covers the legendary currently open.",
    diag_scan: "⟳ Scan every legendary (one-off)",
    diag_scanning: "Scanning…",
    diag_all_done: "Global scan: {n} achievements checked, {g} without a step list.",
    diag_counters: "{n} tiered counters (actions, kills, items owned) — nothing to curate.",
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
    tab_cadences: "Cadences",
    cad_daily_reset: "Reset quotidien dans",
    cad_weekly_reset: "Reset hebdo dans",
    cad_reset_note: "Les cases se vident seules au reset — la clé de stockage porte la période.",
    cad_pick: "Légendaires visés",
    cad_verified: "✓ plafonds vérifiés le {d}",
    cad_unverified: "⚙ plafonds non vérifiés",
    cad_partial: "◐ {a}/{b} sources vérifiées",
    cad_need: "Besoin : {n}",
    cad_owned: "possédé {n}",
    cad_missing: "manque {n}",
    cad_eta: "≈ {w} semaine(s) à {p}/sem — vers le {d}",
    cad_uncapped_note: "(sources sans plafond exclues de l'estimation)",
    cad_nocap: "sans plafond",
    cad_per_day: "jour",
    cad_per_week: "sem",
    cad_per_season: "saison",
    cad_empty: "Sélectionne tes légendaires cibles ci-dessus pour calculer besoins et délais.",
    cad_clear: "Vider la sélection",
    arb_title: "Arbitrage Magnetite",
    arb_intro: "Manfred vend Coins et Clovers contre la devise que consomme Coalescence. Budget hebdo : {b}.",
    arb_coins: "Mystic Coins achetés",
    arb_clovers: "Mystic Clovers achetés",
    arb_spent: "{s} dépensés sur {b}",
    arb_left: "{n} restants pour Coalescence",
    arb_over: "— dépassement de {n} !",
    arb_need: "Coalescence demande {n}",
    arb_weeks: "≈ {w} semaine(s) à cette répartition",
    arb_never: "plus rien — Coalescence n'avance jamais",
    arb_offcap: "Les sources hors plafond (Challenge Mode, revente de minis aux vendeurs raid, salvage d'ascendés, succès) n'entament pas le budget — c'est la vraie sortie du dilemme.",
    cad_not_needed: "Non requis par ta sélection.",
    cad_nostock: "stock inconnu — synchronise avec ta clé API",
    bits_step: "Étape {n}",
    bits_meta_req: "Méta-achievement — {n} requis sur {m} objectifs éligibles.",
    bits_meta_left: "Encore {n} pour atteindre le seuil.",
    bits_src_wiki: "✓ Liste curée depuis le wiki (vérifiée le {d}) — exacte.",
    bits_src_api: "⚙ Liste dérivée de la catégorie — elle contient plus de succès que le méta n’en exige.",
    bits_src_mismatch: "⚠ {a} éligibles faits contre {b} comptés par le jeu : cette liste est périmée.",
    bits_path: "⚡ Chemin le plus court — les {n} restants les moins coûteux ({s} à ignorer) :",
    bits_why: "volume {v} · prérequis {p} · {a} AP",
    bits_has_prereq: "— verrouillé derrière un prérequis.",
    bits_counter_gap: "⚙ Compteur de {n} sans liste d’étapes — à signaler pour sourcer le détail.",
    bits_no_api: "existe en jeu mais non exposé par l’API — statut non traçable",
    wpn_note1: "Par arme : précurseur (craft 500) + Gift of Aurene's X + Gift of Jade Mastery + Draconic Tribute. Totaux clés : 100 Antique Summoning Stones (plafond 17/sem : 7 via la méta quotidienne Trépas du dragon, 5 chez Leivas, 5 en strikes EoD CM — ou TP), 100 Jade Runestones, 38 Clovers, 5 Amalgamated Draconic Lodestones, ~3000 Research Notes.",
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
    gt_stock_diag: "La synchro a renvoyé {f} ressources sur {a} demandées (source : {s}). Un zéro ici n'est pas un inventaire vide.",
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
    chars_note_hearts: "{n} perso{s} × (~20 nœuds d'huîtres + 3 nommés quotidiens) — vendeurs karma en plus",
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
    aurora_alt: "↔ Alternative",
    unlock_first_title: "⚠ À DÉVERROUILLER AVANT DE JOUER CE CONTENU",
    free_sources: "◈ GRATUIT ET RÉPÉTABLE",
    wp_order: "trajet {n}/21",
    proj_left: "reste {n} {u}",
    proj_runs: "~{n} runs quickplay",
    proj_weeks3: "{n} sem. à 3 runs/sem. + hebdo",
    proj_weeks_passive: "{n} sem. avec le seul hebdo",
    wp_order_title: "Position dans le trajet le moins coûteux en points de passage",
    calc_link: "↗ Calculateur de coût (gw2efficiency, sur ton stock réel)",
    unlock_first_title: "⚠ UNLOCK BEFORE PLAYING THIS CONTENT",
    wp_order: "route {n}/21",
    wp_order_title: "Position in the cheapest waypoint route",
    calc_link: "↗ Cost calculator (gw2efficiency, uses your own stock)",
    cur_extras_done: "✓ achats de collection déjà faits — seul le socle reste",
    cur_not_sent: "⚠ ce 0 n'est pas un stock : la source de synchro n'a jamais envoyé cette monnaie. Vérifie que le serveur Flask local est à jour.",
    bags_missing: "⚠ Les sacs des personnages n'ont pas pu être lus — il manque la portée 'characters' ou 'inventories' à ta clé API. Tout ce qui n'est pas déposé est sous-compté.",
    karma_note: "Affiché car le total dépasse 100 000. ⚠ signale une estimation non vérifiée.",
    aurora_src_api: "seuil lu en direct dans l'API",
    aurora_src_gap: "⚠ seuil stocké ({j}) différent de l'API ({a}) — l'API fait foi",
    aurora_src_wait: "seuil pas encore chargé depuis l'API",
    mastery_steps: "Succès éligibles : {d}/{n} faits · encore {r}",
    mastery_shortest: "N'importe lesquels {r} parmi les {s} restants — le reste est facultatif.",
    mastery_nosteps: "⚠ aucune liste d'étapes résolue pour ce méta — à signaler",
    mastery_nostatus: "Synchronise avec ta clé API pour voir lesquels sont faits.",
    mastery_src_wiki: "liste curée du wiki ({d}) — dont {o} facultatifs",
    mastery_stale: "⚠ le compteur officiel annonce {c} faits, cette liste n'en connaît que {d} — appuie sur le bouton API pour rafraîchir l'instantané",
    diag_title: "⚕ Contrôle des données — {n} méta(s) sans liste d'étapes",
    diag_counts: "{w} curés depuis le wiki · {c} repliés sur leur catégorie API",
    diag_none: "Tous les métas compteurs téléchargés ont une liste d'étapes.",
    diag_threshold: "seuil {n}",
    diag_scope: "Ce panneau ne couvre que le légendaire actuellement ouvert.",
    diag_scan: "⟳ Balayer tous les légendaires (ponctuel)",
    diag_scanning: "Balayage en cours…",
    diag_all_done: "Balayage global : {n} succès contrôlés, {g} sans liste d'étapes.",
    diag_counters: "{n} compteurs à paliers (actions, kills, objets détenus) — rien à curer.",
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
const NAMES_CACHE_VER = 13; // v13 : Ardent Glorious (Ascended Shards 33, League Tickets 30)
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

// ── RequirementsBlocks : prérequis chiffrés (total + restant + stock live) ──
function RequirementsBlocks({ requirements, apiAch, currencies }) {
  if (!requirements) return null;
  return [].concat(requirements).map((RQ, rqi) => {
    const total = RQ.unitTotal ?? 0;
    const cnt = RQ.unitsFrom ? (apiAch[RQ.unitsFrom.key]?.current ?? null) : null;
    // Une collection en cours peut déjà avoir consommé des unités : si l'étape
    // déclare quels bits les consomment (unitBits), on compte ces bits.
    const doneU = RQ.unitsFrom ? (cnt ?? 0) : (RQ.perStep ?? []).reduce((s, st) => {
      const A = apiAch[st.key];
      if (!A) return s;
      if (A.done) return s + (st.units ?? 0);
      if (st.unitBits && Array.isArray(A.bits)) return s + st.unitBits.filter(b => A.bits.includes(b)).length;
      return s;
    }, 0);
    const known = RQ.unitsFrom ? (cnt != null) : (RQ.perStep ?? []).some(st => apiAch[st.key]);
    const left = Math.max(0, total - doneU);
    const nf = (v) => v.toLocaleString("fr-FR");
    return (
      <div key={rqi} style={{ margin: "8px 14px", padding: "10px 12px", background: "rgba(94,234,212,0.04)", border: "1px solid rgba(94,234,212,0.18)", borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Cinzel', serif", color: "#5eead4" }}>{RQ.title ? NX(RQ.title) : NX({ fr: "📋 Prérequis", en: "📋 Requirements" })}</span>
          <span style={{ fontSize: 10, fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.6)" }}>
            {(() => {
              const u = NX(RQ.unit) ?? "";
              return known ? NX({ fr: `reste ${left} / ${total} ${u}s`, en: `${left} / ${total} ${u}s left` })
                           : NX({ fr: `${total} ${u}s au total`, en: `${total} ${u}s total` });
            })()}
          </span>
        </div>
        {(RQ.lines ?? []).map((ln, li) => {
          const oneShotDone = ln.oneShot ? !!apiAch[ln.oneShot]?.done : false;
          let totalV = ln.fixed != null ? ln.fixed : (ln.perUnit ?? 0) * total;
          let leftV = ln.fixed != null ? (oneShotDone ? 0 : ln.fixed) : (ln.perUnit ?? 0) * left;
          let stock = ln.curKey ? (currencies?.[ln.curKey] ?? null) : null;
          if (ln.derivedFrom) {
            const srcLn = (RQ.lines ?? []).find(x => x.curKey === ln.derivedFrom);
            const srcTotal = srcLn ? (srcLn.fixed != null ? srcLn.fixed : (srcLn.perUnit ?? 0) * total) : 0;
            const srcLeft = srcLn ? (srcLn.fixed != null ? srcLn.fixed : (srcLn.perUnit ?? 0) * left) : 0;
            const held = srcLn?.curKey ? (currencies?.[srcLn.curKey] ?? 0) : 0;
            totalV = Math.ceil(srcTotal / (ln.rate || 1));
            leftV = Math.ceil(Math.max(0, srcLeft - held) / (ln.rate || 1));
            stock = null;
          }
          const ok = leftV === 0 || (stock != null && stock >= leftV);
          return (
            <div key={li} style={{ padding: "3px 0", borderTop: li ? "1px solid rgba(226,201,126,0.06)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
                <span style={{ color: "rgba(226,201,126,0.8)" }}>{ln.icon} {NX(ln.label)}</span>
                <span style={{ whiteSpace: "nowrap", fontFamily: "'Crimson Text', serif" }}>
                  <span style={{ color: ok ? "#4ade80" : "#5eead4", fontWeight: 600 }}>{nf(leftV)}</span>
                  {leftV !== totalV && <span style={{ color: "rgba(226,201,126,0.3)" }}> / {nf(totalV)}</span>}
                  {stock != null && <span style={{ color: ok ? "#4ade80" : "rgba(226,201,126,0.45)" }}> · {NX({ fr: "en stock", en: "held" })} {nf(stock)}</span>}
                </span>
              </div>
              {ln.detail && <div style={{ fontSize: 9.5, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", lineHeight: 1.4 }}>{NX(ln.detail)}</div>}
            </div>
          );
        })}
        {RQ.note && <div style={{ marginTop: 5, fontSize: 9.5, color: "rgba(251,146,60,0.7)", fontFamily: "'Crimson Text', serif", lineHeight: 1.45 }}>{NX(RQ.note)}</div>}
        {!known && <div style={{ marginTop: 4, fontSize: 9.5, fontStyle: "italic", color: "rgba(226,201,126,0.35)" }}>{NX({ fr: "Synchronise l'API pour déduire ce qui est déjà fait.", en: "Sync the API to subtract what's already done." })}</div>}
      </div>
    );
  });
}

// ── TrinketGuide : fiche guide détaillée d'un colifichet (données SOURCES_DB) ──
function TrinketGuide({ curKey, apiAch, gtOwnedIds, gtManualOwnedIds, trinketSteps, toggleStep }) {
  const DB = (typeof SOURCES_DB !== "undefined" ? (SOURCES_DB.legendaries ?? {}) : {});
  const T = DB[curKey];
  if (!T) return <div style={{ padding: 20, color: "rgba(226,201,126,0.6)", fontFamily: "'Crimson Text', serif" }}>SOURCES_DB indisponible — rebuild requis.</div>;
  const armoryId = T.armory_api_id;
  const owned = !!armoryId && (gtOwnedIds.has(armoryId) || gtManualOwnedIds.has(armoryId));
  const achOf = (k) => ((apiAch ?? {})[k] ?? null);
  const badge = (txt, color) => (
    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, border: `1px solid ${color}`, color, letterSpacing: "0.05em", fontFamily: "'Cinzel', serif", whiteSpace: "nowrap" }}>{txt}</span>
  );
  return (
    <div>
      {/* En-tête */}
      <div className="card" style={{ cursor: "default" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: "#5eead4", fontWeight: 600 }}>{NL(curKey, T.name)}</div>
          {badge(NX({
            fr: ({ ring: "Anneau", accessory: "Accessoire", amulet: "Amulette", back: "Dos", armor_set: "Set d'armure (18 pièces)", aquabreather: "Respirateur" })[T.slot] ?? T.slot,
            en: ({ armor_set: "Armor set (18 pieces)", aquabreather: "Aquabreather" })[T.slot] ?? T.slot,
          }), "rgba(226,201,126,0.55)")}
          {badge(T.expansion, "rgba(226,201,126,0.4)")}
          {badge(NXS(T.farm), "rgba(167,139,250,0.7)")}
          {(() => {
            const LE = (typeof LEGENDARIES !== "undefined" ? LEGENDARIES[curKey] : null);
            if (LE?.isArmorSet || T.slot === "armor_set") {
              const sIds = LE?.armoryApiIds ?? null;
              if (sIds) {
                const nOwned = sIds.filter(x => gtOwnedIds.has(x) || gtManualOwnedIds.has(x)).length;
                return badge(NX({ fr: `${nOwned}/${sIds.length} pièces — onglet Pièces`, en: `${nOwned}/${sIds.length} pieces — Pieces tab` }), nOwned > 0 ? "#4ade80" : "rgba(226,201,126,0.35)");
              }
              return badge(NX({ fr: "Détection par nom — onglet Pièces", en: "Name-based detection — Pieces tab" }), "rgba(94,234,212,0.55)");
            }
            return armoryId
              ? badge(owned ? NX({ fr: "✓ Possédé (armory)", en: "✓ Owned (armory)" }) : NX({ fr: "Non possédé", en: "Not owned" }), owned ? "#4ade80" : "rgba(226,201,126,0.35)")
              : badge(NX({ fr: "apiId inconnu", en: "apiId unknown" }), "rgba(248,113,113,0.6)");
          })()}
        </div>
        <div style={{ marginTop: 8, fontFamily: "'Crimson Text', serif", fontSize: 13, color: "rgba(226,201,126,0.75)" }}>{NXS(NX(T.recipe))}</div>
        {T.note && <div style={{ marginTop: 6, fontFamily: "'Crimson Text', serif", fontSize: 12, color: "rgba(226,201,126,0.5)", fontStyle: "italic" }}>{NX(T.note)}</div>}
        {T.timegate && <div style={{ marginTop: 6, fontSize: 11, color: "#fbbf24", fontFamily: "'Crimson Text', serif" }}>⏳ {NX(T.timegate)}</div>}
      </div>

      {/* Prérequis chiffrés */}
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

      {/* Collections / succès — progression API (masqué si l'onglet Collections à bits existe) */}
      {(T.achievements ?? []).length > 0 && !(typeof LEGENDARIES !== "undefined" && LEGENDARIES[curKey]?.raidAchievements) && (
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
}

// ── Groupe Trinkets : navigation à 2 niveaux (v34) ──
const TRINKET_RICH = ["vision", "aurora", "conflux", "warbringer", "coalescence", "selachimorpha", "prismatic", "strife_unending", "endless_summer", "stella_radians", "orrax_manifested", "ad_infinitum"];
const TRINKET_GUIDE_KEYS = ["the_ascension", "transcendence"];
const TRINKET_GROUP_ORDER = ["vision", "aurora", "conflux", "warbringer", "coalescence", "selachimorpha", "prismatic", "endless_summer", "stella_radians", "orrax_manifested", "ad_infinitum", "strife_unending", ...TRINKET_GUIDE_KEYS];
const MAIN_SELECTOR_ORDER = ["eikasia", "obsidian", "perfected_envoy", "triumphant_hero", "ardent_glorious", "weapons", "upgrades", "t6"];

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
      { id: "elegy", name: "Elegy Mosaic", required: 300, icon: "EM", apiId: 35 },
      { id: "gems", name: "Amalgamated Gemstone", required: 100, icon: "AG", apiId: 68063 },
      { id: "vm", name: "Volatile Magic", required: 1000, icon: "EL", apiId: 45 },
    ],
    raidTabLabel: { fr: "🔭 Visions of…", en: "🔭 Visions of…" },
    raidAchievements: [
      { key: "vis_meta_1", achievementId: 4762, name: "Vision I: Awakening",
        bitTips: {"0": {"fr": "Istan : la plus lourde des six, elle exige en plus la maîtrise Chevaucher les skyscales. À garder pour la fin si tu ne l'as pas.", "en": "Istan: the heaviest of the six, it also requires the Riding Skyscales mastery. Save it for last if you lack it."}, "1": {"fr": "Îles de Ventesable : la plus rapide, essentiellement des objets de carte. Bon point de départ.", "en": "Sandswept Isles: the fastest, mostly map items. A good starting point."}, "2": {"fr": "Kourna : 7 objets dont plusieurs derrière des événements de carte à horaires. Vérifie le timer avant de t'y mettre.", "en": "Kourna: 7 items, several behind timed map events. Check the timer before starting."}, "3": {"fr": "Jahai : couplée à la Convergence des lamentations, tu y repasseras de toute façon. À enchaîner avec l'Élégie.", "en": "Jahai: paired with the Convergence of Sorrow, you'll be back there anyway. Chain it with Elegy."}, "4": {"fr": "Pics de Chef-Tonnerre : la carte qui alimente aussi la Masse marquée de Compagnon de la forge. Double emploi, priorise-la.", "en": "Thunderhead Peaks: the map that also feeds Journeyman of the Forge's Branded Mass. Double duty, prioritise it."}, "5": {"fr": "Chute draconique : événements de carte fréquents, la collection tombe presque seule en farmant la méta.", "en": "Dragonfall: frequent map events, the collection nearly completes itself while farming the meta."}},
        unlock: { fr: "🔓 Acheter la Trance Stone chez n'importe quel Volatile Magic Collector (LW4). Prérequis compte : Skyscale + maîtrise Rift Repair. Prévoir 6 Memory Essence Encapsulators (1 par carte) et les garder en inventaire — chacun coûte 50 ectos + 10 Orichalcum Filigree + 1 Lesser Vision Crystal + 3 Xunlai Electrum Ingots chez un Volatile Magic Collector. Récompense : Shattered Gift of Prescience.", en: "🔓 Buy the Trance Stone from any Volatile Magic Collector (LWS4). Account prerequisites: Skyscale + Rift Repair mastery. Get 6 Memory Essence Encapsulators (1 per map) and keep them in your inventory — each costs 50 ectos + 10 Orichalcum Filigree + 1 Lesser Vision Crystal + 3 Xunlai Electrum Ingots from a Volatile Magic Collector. Reward: Shattered Gift of Prescience." },
        tip: { fr: "Meta des 6 cartes LW4 — se valide quand les 6 sous-collections ci-dessous sont terminées.", en: "Meta of the 6 LWS4 maps — completes once the 6 sub-collections below are done." } },
      { key: "vis_istan", achievementId: 4765, name: "Visions of Istan",
        unlock: { fr: "🔓 Débloquée par l'achat de la Trance Stone (voir Vision I) — les 6 collections de carte s'ouvrent ensemble. ⚠ Garder la Trance Stone EN INVENTAIRE pendant les étapes : les prérequis déjà remplis sont crédités rétroactivement à l'achat. Istan exige en plus la maîtrise Riding Skyscales terminée, et l'épisode « Daybreak » (étape « Eye of the Brandstorm ») pour accéder à la carte.", en: "🔓 Unlocked by purchasing the Trance Stone (see Vision I) — all 6 map collections open at once. ⚠ Keep the Trance Stone IN YOUR INVENTORY while doing the steps: already-met requirements are granted retroactively on purchase. Istan additionally requires the Riding Skyscales masteries and the 'Daybreak' episode (story step 'Eye of the Brandstorm') for map access." },
        bitTips: {
          "Vision of Equipment: Astral Weapons": { fr: "6 armes Astral ou Stellar. Prérequis : la collection « Brandstone Research » ci-dessous (timegate 7 j). Par arme : 1 Inscription of the Spearmarshal + 50 Kralkatite Ingots + 2 composants orichalque — soit ~1 350 Kralkatite Ore et 1 335 Powdered Rose Quartz pour les 6. ⚡ Les skins Astral déjà débloqués comptent, et « Astral Purification » offre de quoi faire une arme Stellar gratuitement : autant d'armes en moins.", en: "6 Astral or Stellar weapons. Prerequisite: the 'Brandstone Research' collection below (7-day timegate). Per weapon: 1 Inscription of the Spearmarshal + 50 Kralkatite Ingots + 2 orichalcum components — roughly 1,350 Kralkatite Ore and 1,335 Powdered Rose Quartz for all 6. ⚡ Already-unlocked Astral skins count, and 'Astral Purification' grants a free Stellar weapon's worth: that many fewer to craft." },
          "Vision of Dragons: Aurene": { fr: "Memory Fragment au-dessus du PoI Plaza of Resurgence : voler sur la porte d'abord, puis monter.", en: "Memory Fragment above the Plaza of Resurgence PoI: fly onto the gate first, then ascend." },
          "Vision of Allies: Taimi": { fr: "Interagir avec la Partially Corrupted Data Entry, juste à côté du Volatile Magic Collector près de Chalon Docks wp.", en: "Interact with the Partially Corrupted Data Entry, right next to the Volatile Magic Collector near Chalon Docks wp." },
          "Vision of Enemies: Warden Amala": { fr: "Vaincre Warden Amala au Mordant Crescent Great Hall EN AYANT un Memory Essence Encapsulator en inventaire. Encapsulator = 50 ectos + 10 Orichalcum Filigree + 1 Lesser Vision Crystal + 3 Xunlai Electrum Ingots, chez un Volatile Magic Collector.", en: "Defeat Warden Amala at the Mordant Crescent Great Hall WHILE holding a Memory Essence Encapsulator. Encapsulator = 50 ectos + 10 Orichalcum Filigree + 1 Lesser Vision Crystal + 3 Xunlai Electrum Ingots, from a Volatile Magic Collector." },
          "Vision of Landscapes: Domain of Istan": { fr: "Utiliser le skyscale pour atteindre la faille près de l'Astralarium.", en: "Use your skyscale to reach the rift near the Astralarium." },
          "Heavy Corsair Turban": { fr: "Récompense de TOUS les succès « Daybreak » (épisode 1 de la LS4).", en: "Reward for ALL 'Daybreak' achievements (LWS4 episode 1)." },
        },
        tip: { fr: "≈6 étapes : Dragons (Memory Fragment), Allies (interaction), Enemies (boss à vaincre avec un Memory Essence Encapsulator en inventaire), Landscapes (faille au skyscale), Equipment (chaîne de craft — voir le détail sous l'étape) et le skin de l'épisode. Fragment au-dessus du PoI Plaza of Resurgence (voler sur la porte puis monter) · Allies = Partially Corrupted Data Entry près de Chalon Docks wp · Enemies = Warden Amala au Mordant Crescent Great Hall.", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin. Fragment above the Plaza of Resurgence PoI (fly onto the gate, then ascend) · Allies = Partially Corrupted Data Entry near Chalon Docks wp · Enemies = Warden Amala at the Mordant Crescent Great Hall." } },
      { key: "vis_kourna", achievementId: 4760, name: "Visions of Kourna",
        bitTips: {
          "Heavy Corsair Jerkin": { fr: "Récompense de la maîtrise « Long Live the Lich » (38 succès sur 48 — la liste détaillée est dans le méta d'épisode ci-dessus). 💡 N'importe quel poids débloque les autres : inutile de viser le lourd. ↔ Alternative sans succès : la piste de récompense du Domaine de Kourna, puis choisir la Boîte de veste corsaire.", en: "Reward from the 'Long Live the Lich' Mastery (38 of 48 achievements — the detailed list is in the episode meta above). 💡 Any weight unlocks the others: no need to aim for heavy. ↔ Achievement-free alternative: the Domain of Kourna reward track, then pick the Corsair Jerkin Box." },
          "Vision of Dragons: Aurene": { fr: "Fragment de mémoire près de la Garnison de Zelbahn, presque à la verticale au-dessus de Dame Camilla, juste au nord du point de passage du Campement allié [&BFcLAAA=].", en: "Memory Fragment near Zelbahn Garrison, almost directly above Lady Camilla, just north of Allied Encampment Waypoint [&BFcLAAA=]." },
          "Vision of Allies: Blish": { fr: "Interagir avec l'Imprimé du journal de données, directement à l'ouest de Dame Camilla, près du Campement allié.", en: "Interact with the Data Log Printout, directly west of Lady Camilla, near the Allied Encampment." },
          "Vision of Enemies: Olori Ogun": { fr: "Vaincre le Maréchal des troupes Olori Ogun en ayant un Encapsulateur d'essence mémorielle DANS l'inventaire. ⚠ C'est l'un des six usages de l'encapsulateur : chaque carte a sa « Vision of Enemies », d'où les 6 exemplaires à prévoir. Sans l'objet en inventaire au moment du kill, rien n'est crédité.", en: "Defeat Troopmarshal Olori Ogun while holding a Memory Essence Encapsulator IN your inventory. ⚠ This is one of the encapsulator's six uses: every map has its 'Vision of Enemies', which is why 6 copies are needed. Without the item in your inventory at the kill, nothing is credited." },
          "Vision of Landscapes: Domain of Kourna": { fr: "Faille accessible en Skyscale, près du point le plus haut du Campement allié — la plus haute tour, au sud du point de passage, juste au-dessus du point de maîtrise. Suivre la magie volatile flottante et la ramasser en ENTIER ; si tu en rates, un second passage te remontre le chemin. ⚠ Ce n'est PAS une synergie avec Vision II : celle-ci n'est déverrouillée qu'une fois Vision I terminée, donc tu repasseras ici plus tard, forcément. Retiens juste l'emplacement.", en: "Rift reachable by Skyscale, near the highest point of the Allied Encampment — the tallest tower, south of the waypoint, right above the mastery point. Follow the floating Volatile Magic and collect ALL of it; if you miss some, a second pass shows the way again. ⚠ This is NOT a synergy with Vision II: that collection only unlocks once Vision I is complete, so you will necessarily come back here later. Just remember the spot." },
          "Banner of the Commander": { fr: "Fabriquer la Bannière du commandant exotique. ⚠ La recette n'est PAS apprise d'office : il faut acheter la feuille de recette chez Dame Camilla, au Campement allié [&BFcLAAA=], pour 1 po. Métier : Armurier, Travailleur du cuir ou Tailleur niveau 500. Ingrédients : 1 Hampe de bannière laquée, 1 Flamme de bannière, 25 lingots d'orichalque, 20 teintures non identifiées. ⚠ NE L'ÉQUIPE PAS : liée au compte mais liée à l'âme à l'utilisation — sur un personnage sans l'un des trois métiers, elle cesse d'être utilisable pour fabriquer sa version élevée, même déposée en banque. Garde-la en inventaire.", en: "Craft the exotic Banner of the Commander. ⚠ The recipe is NOT auto-learned: buy the recipe sheet from Lady Camilla at the Allied Encampment [&BFcLAAA=] for 1 g. Discipline: Armorsmith, Leatherworker or Tailor 500. Ingredients: 1 Lacquered Banner Pole, 1 Banner Pennon, 25 Orichalcum Ingots, 20 Unidentified Dyes. ⚠ DO NOT EQUIP IT: account bound but soulbound on use — on a character without one of the three disciplines it stops being usable to craft its ascended counterpart, even from the bank. Keep it in your inventory." },
          "Vision of Action: Domain of Kourna": { fr: "Participer à l'événement « Dance with the choya to assist Tebb's research », à l'Idole du choya [&BF4LAAA=], à la Traversée de Kodonur. Parler au Chercheur pour être transformé en choya, puis suivre la danse avec les compétences données. 80 réussites au total.", en: "Complete the 'Dance with the choya to assist Tebb's research' achievement (80 dances)." },
        },
        unlock: { fr: "🔓 Débloquée par l'achat de la Trance Stone (voir Vision I) — les 6 collections de carte s'ouvrent ensemble. ⚠ Garder la Trance Stone EN INVENTAIRE pendant les étapes : les prérequis déjà remplis sont crédités rétroactivement à l'achat. Accès carte : épisode « A Bug in the System » (Domain of Kourna).", en: "🔓 Unlocked by purchasing the Trance Stone (see Vision I) — all 6 map collections open at once. ⚠ Keep the Trance Stone IN YOUR INVENTORY while doing the steps: already-met requirements are granted retroactively on purchase. Map access: the 'A Bug in the System' episode (Domain of Kourna)." },
        tip: { fr: "≈6 étapes : Dragons (Memory Fragment), Allies (interaction), Enemies (boss à vaincre avec un Memory Essence Encapsulator en inventaire), Landscapes (faille au skyscale), Equipment (chaîne de craft — voir le détail sous l'étape) et le skin de l'épisode.", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
      { key: "vis_jahai", achievementId: 4770, name: "Visions of Jahai",
        unlock: { fr: "🔓 Débloquée par l'achat de la Trance Stone (voir Vision I) — les 6 collections de carte s'ouvrent ensemble. ⚠ Garder la Trance Stone EN INVENTAIRE pendant les étapes : les prérequis déjà remplis sont crédités rétroactivement à l'achat. Accès carte : épisode « All or Nothing » (Jahai Bluffs).", en: "🔓 Unlocked by purchasing the Trance Stone (see Vision I) — all 6 map collections open at once. ⚠ Keep the Trance Stone IN YOUR INVENTORY while doing the steps: already-met requirements are granted retroactively on purchase. Map access: the 'All or Nothing' episode (Jahai Bluffs)." },
        bitTips: {
          "Updated Record of Joko's Deeds": { fr: "Acheter chez la Marchande Hyacinth, juste à côté du point de passage du Village de Yatendi [&BH4LAAA=], pour 50 magie volatile + 8 pc. ⚠ Elle n'ouvre son stock qu'une fois la maîtrise « A Star to Guide Us » terminée — c'est le seul prérequis de la collection qui passe par un autre méta d'épisode.", en: "Buy from Trader Hyacinth, right next to Yatendi Village Waypoint [&BH4LAAA=], for 50 Volatile Magic + 8 c. ⚠ She only opens her stock once the 'A Star to Guide Us' Mastery is complete — the collection's only prerequisite routed through another episode meta." },
          "Vision of Dragons: Aurene": { fr: "Fragment de mémoire haut au-dessus du point de passage du Col de Venta [&BJMLAAA=].", en: "Memory Fragment high above Venta Pass Waypoint [&BJMLAAA=]." },
          "Vision of Allies: Braham": { fr: "Interagir avec la Lettre non distribuée, au nord-est du Repos de Mirza, au pied de l'arbre qui est dans l'eau.", en: "Interact with the Undelivered Letter, north-east of Mirza's Rest, at the base of the tree standing in the water." },
          "Vision of Enemies: Death-Branded Shatterer": { fr: "Vaincre le Bristanacier marqué par la mort, dans les Falaises de Jahai, en ayant un Encapsulateur d'essence mémorielle DANS l'inventaire. ⚠ Boss de méta : cale-toi sur le timer, l'encapsulateur doit être en poche au moment du kill.", en: "Defeat the Death-Branded Shatterer in Jahai Bluffs while holding a Memory Essence Encapsulator IN your inventory. ⚠ Meta boss: plan around the timer, the encapsulator must be on you at the kill." },
          "Vision of Landscapes: Jahai Bluffs": { fr: "Faille accessible en Skyscale, très haut au-dessus des Tours déplacées — tout en haut de la Tour du vizir déplacé.", en: "Rift reachable by Skyscale, very high above the Displaced Towers — at the very top of the Displaced Vizier's Tower." },
          "Vision of Equipment: Elegy Armor": { fr: "Terminer le succès « The Convergence of Sorrow I: Elegy », puis parler à Amira. 💡 Ce succès est déjà suivi séparément dans le tracker.", en: "Complete 'The Convergence of Sorrow I: Elegy', then speak with Amira. 💡 That achievement is already tracked separately here." },
          "Vision of Action: Jahai Bluffs": { fr: "Événement « Stop \u201CJoko\u201D from recruiting the Awakened! », à la Balafre centrale de la Marque, dans les Falaises de Jahai. 💡 L'objet est donné à la fin de l'événement, RÉUSSITE OU ÉCHEC — inutile de stresser sur le résultat, il suffit d'y participer. ⚠ L'événement ne démarre pas seul : il est précédé de « Console the Awakened loyalists », et cette chaîne amont n'est pas entièrement remontée ici. 💡 Si tu vises aussi « If I May Interrupt » (éligible à « A Star to Guide Us », le méta qui débloque le Registre de Joko ci-dessus), c'est le même événement — mais il exige un run parfait, avec seulement 3 à 5 joueurs : au-delà, la mise à l'échelle rend les barres de ténacité incassables. Les deux objectifs sont ouverts en même temps, donc l'enchaînement est réel.", en: "Event \u2018Stop \u201CJoko\u201D from recruiting the Awakened!\u2019, at Central Brand Scar in Jahai Bluffs. 💡 The item is granted at the end of the event, ON SUCCESS OR FAILURE — no need to stress about the outcome, just take part. ⚠ The event does not start on its own: it is preceded by 'Console the Awakened loyalists', and that upstream chain is not fully traced here. 💡 If you also want 'If I May Interrupt' (eligible for 'A Star to Guide Us', the meta that unlocks Joko's Record above), it is the same event — but it demands a perfect run with only 3 to 5 players: beyond that, scaling makes the defiance bars unbreakable. Both objectives are open at the same time, so the chaining is real." },
        },
        tip: { fr: "≈6 étapes : Dragons (Memory Fragment), Allies (interaction), Enemies (boss à vaincre avec un Memory Essence Encapsulator en inventaire), Landscapes (faille au skyscale), Equipment (chaîne de craft — voir le détail sous l'étape) et le skin de l'épisode.", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
      { key: "vis_sandswept", achievementId: 4774, name: "Visions of Sandswept Isles",
        unlock: { fr: "🔓 Débloquée par l'achat de la Trance Stone (voir Vision I) — les 6 collections de carte s'ouvrent ensemble. ⚠ Garder la Trance Stone EN INVENTAIRE pendant les étapes : les prérequis déjà remplis sont crédités rétroactivement à l'achat. Accès carte : épisode « Long Live the Lich » (Sandswept Isles).", en: "🔓 Unlocked by purchasing the Trance Stone (see Vision I) — all 6 map collections open at once. ⚠ Keep the Trance Stone IN YOUR INVENTORY while doing the steps: already-met requirements are granted retroactively on purchase. Map access: the 'Long Live the Lich' episode (Sandswept Isles)." },
        bitTips: {
          "Olmakhan Mantle": { fr: "Récompense de la maîtrise « A Bug in the System » (35 succès sur 47 — liste détaillée dans le méta d'épisode). ↔ Alternative sans succès : la piste de récompense des Îles Balayées.", en: "Reward from the 'A Bug in the System' Mastery (35 of 47 achievements — detailed list in the episode meta). ↔ Achievement-free alternative: the Sandswept Isles reward track." },
          "Vision of Dragons: Aurene": { fr: "Fragment de mémoire au sommet de la falaise directement au nord du point de passage d'Atholma [&BEMLAAA=], en l'air près d'un arbre.", en: "Memory Fragment atop the cliff directly north of Atholma Waypoint [&BEMLAAA=], in the air near a tree." },
          "Vision of Allies: Rox": { fr: "Interagir avec le Rapport de terrain inachevé, légèrement au nord-ouest du point de passage d'Atholma [&BEMLAAA=], sur une caisse juste en face du Villageois olmakhan et de l'Enclume de réparation.", en: "Interact with the Unfinished Field Report, slightly north-west of Atholma Waypoint [&BEMLAAA=], on a crate directly across from the Olmakhan Villager and the Repair Anvil." },
          "Vision of Enemies: Kuda's Subjects": { fr: "Vaincre les sujets d'expérience de Kuda, dans la Chambre des spécimens, en ayant un Encapsulateur d'essence mémorielle DANS l'inventaire.", en: "Defeat Kuda's test subjects in the Specimen Chamber while holding a Memory Essence Encapsulator IN your inventory." },
          "Vision of Landscapes: Sandswept Isles": { fr: "Faille accessible en Skyscale, au-dessus de la Baleine de fer, facilement atteinte depuis le point de passage d'Atholma [&BEMLAAA=]. ⚠ Ne pas la confondre avec la faille située au NORD de la Baleine de fer, qui ne compte pas.", en: "Rift reachable by Skyscale, above The Iron Whale, easily reached from Atholma Waypoint [&BEMLAAA=]. ⚠ Do not mistake it for the rift NORTH of The Iron Whale, which does not count." },
          "Vision of Equipment: Olmakhan Bandolier": { fr: "Obtenir la Bandoulière olmakhan renforcée. ⚠ Le crédit rétroactif n'est pas garanti : si l'étape ne se valide pas toute seule après l'avoir obtenue, il faut acheter l'objet « Vision of Equipment: Olmakhan Bandolier » chez Ethall.", en: "Acquire the Reinforced Olmakhan Bandolier. ⚠ Retroactive credit is not guaranteed: if the step does not tick by itself once you have it, buy the 'Vision of Equipment: Olmakhan Bandolier' item from Ethall." },
          "Vision of Action: Sandswept Isles": { fr: "Terminer l'événement « Catch as many fish as you can! », à la Jetée de bois flotté [&BDMLAAA=], sur le détroit de Panube. 💡 LE point à retenir : cet événement démarre IMMÉDIATEMENT sur une carte fraîche. Inutile de faire tout le méta Tempêtes rassemblées — change d'instance et parle à Teyrna. Sinon, il conclut la chaîne Élémentaires déchaînés → Échos de l'appel-tempête (×3) → Ancienne Rhona → Zohaqan. Déroulé : prendre un harpon dans les barils au bout des pontons, viser un Cœlacanthe, Tir de harpon pour accrocher puis Moulinet pour le sortir de l'eau ; se placer dans le cercle blanc qui apparaît derrière toi sur le ponton jusqu'à ce que le poisson soit ramené, puis le déposer dans le Panier à poissons. Les cercles des autres joueurs comptent aussi, et vous êtes deux à marquer. Les Cœlacanthes obstinés ignorent parfois le harpon : change de cible. Tuer une Ombre mystérieuse dans l'eau donne aussi de la participation.", en: "Complete the event 'Catch as many fish as you can!' at Driftwood Jetty [&BDMLAAA=], on the Strait of Panube. 💡 THE key point: this event starts IMMEDIATELY on a fresh map. No need to run the whole Gathering Storms meta — switch instance and talk to Teyrna. Otherwise it closes the chain Rampaging elementals → Stormcaller echoes (x3) → Elder Rhona → Zohaqan. How it works: grab a harpoon gun from the barrels at the dock ends, target a Coelacanth, Harpoon Shot to hook then Reel It In to yank it into the air; stand in the white circle appearing behind you on the dock until the fish is reeled in, then deposit it in the Fish Basket. Other players' circles count too, and both of you score. Stubborn Coelacanths sometimes ignore the harpoon: switch target. Killing a Mysterious Shadow in the water also grants participation." },
        },
        tip: { fr: "≈6 étapes : Dragons (Memory Fragment), Allies (interaction), Enemies (boss à vaincre avec un Memory Essence Encapsulator en inventaire), Landscapes (faille au skyscale), Equipment (chaîne de craft — voir le détail sous l'étape) et le skin de l'épisode.", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
      { key: "vis_thunderhead", achievementId: 4764, name: "Visions of Thunderhead Peaks",
        unlock: { fr: "🔓 Débloquée par l'achat de la Trance Stone (voir Vision I) — les 6 collections de carte s'ouvrent ensemble. ⚠ Garder la Trance Stone EN INVENTAIRE pendant les étapes : les prérequis déjà remplis sont crédités rétroactivement à l'achat. Accès carte : épisode « A Star to Guide Us » (Thunderhead Peaks).", en: "🔓 Unlocked by purchasing the Trance Stone (see Vision I) — all 6 map collections open at once. ⚠ Keep the Trance Stone IN YOUR INVENTORY while doing the steps: already-met requirements are granted retroactively on purchase. Map access: the 'A Star to Guide Us' episode (Thunderhead Peaks)." },
        bitTips: {
          "Heavy Corsair Leggings": { fr: "Récompense de la maîtrise « All or Nothing » (30 succès sur 39 — liste détaillée dans le méta d'épisode). ↔ Alternative sans succès : la piste de récompense des Pics de Tonnerre.", en: "Reward from the 'All or Nothing' Mastery (30 of 39 achievements — detailed list in the episode meta). ↔ Achievement-free alternative: the Thunderhead Peaks reward track." },
          "Vision of Dragons: Aurene": { fr: "Fragment de mémoire directement au-dessus de la Forge.", en: "Memory Fragment directly above The Forge." },
          "Vision of Allies: Caithe": { fr: "Interagir avec la Page déchirée, juste au sud-ouest du point de passage de la Fin de l'histoire [&BLsLAAA=].", en: "Interact with the Torn Page, just south-west of History's End Waypoint [&BLsLAAA=]." },
          "Vision of Enemies: Wrathbringer": { fr: "Vaincre le Porteur de courroux, dans le Bastion de Tonnerre, en ayant un Encapsulateur d'essence mémorielle DANS l'inventaire.", en: "Defeat the Wrathbringer in Thunderhead Keep while holding a Memory Essence Encapsulator IN your inventory." },
          "Vision of Landscapes: Thunderhead Peaks": { fr: "Faille accessible en Skyscale près des Sœurs pleureuses. Le parcours DÉMARRE dans une grotte au sud-est des Sœurs pleureuses [&BKkLAAA=] — c'est l'entrée qu'on cherche, pas la faille elle-même.", en: "Rift reachable by Skyscale near the Weeping Sisters. The trail STARTS in a cave south-east of The Weeping Sisters [&BKkLAAA=] — that entrance is what you are looking for, not the rift itself." },
          "Vision of Equipment: Dragonsblood Weapons": { fr: "Fabriquer six armes de sang de dragon différentes, puis acheter l'objet de collection chez la Maître forgeronne Hilina. ⚠ C'est de loin l'étape la plus chère de tout Vision : 360 masses marquées et 18 joyaux de serpentite exquis. À rapprocher des 300 masses marquées déjà exigées par le Don de magie éphémère — soit 660 au total, ce que l'onglet Grand total affiche désormais.", en: "Craft six different Dragonsblood weapons, then buy the collection item from Forge Master Hilina. ⚠ By far the most expensive step in all of Vision: 360 Branded Mass and 18 Exquisite Serpentite Jewels. Add the 300 Branded Mass already required by the Gift of Ephemeral Magic — 660 in total, which the Grand Total tab now shows." },
          "Vision of Action: Thunderhead Peaks": { fr: "Événement « Defend the Zephyrites from the Branded », au Havre de la symphonie, rattaché au cœur « Rallier les soldats du Pacte, les corsaires et les Zéphyrites ». Déroulé : deux Dévoreurs de siège marqués apparaissent à l'est et à l'ouest, un peu en retrait des barricades — à traiter en priorité, ils font très mal aux barricades. Trois vagues, puis Bivor Sombrecœur, un centaure marqué bourré de contrôle : l'engager vite pour qu'il ne se rabatte pas sur les barricades. ⚠ Observation d'Antoine, non tranchée : la chaîne semble partir de plusieurs bases différentes pour converger au même endroit. Le wiki ne donne qu'un seul prédécesseur, « Escorter Pepperseed jusqu'aux docks zéphyrites », suivi de « Aider Pepperseed à livrer les fournitures à la Forge ».", en: "Event 'Defend the Zephyrites from the Branded' at Symphony's Haven, tied to the 'Rally the Pact soldiers, corsairs, and Zephyrites' heart. How it goes: two Branded Siege Devourers appear east and west, slightly back from the barricades — deal with them first, they hurt the barricades badly. Three waves, then Bivor Darkheart, a Branded centaur loaded with crowd control: engage him fast so he does not turn on the barricades. ⚠ Antoine's observation, unresolved: the chain seems to start from several different bases and converge on the same place. The wiki lists only one predecessor, 'Escort Pepperseed back to the Zephyrite Docks', followed by 'Help Pepperseed deliver Zephyrite supplies to the Forge'." },
        },
        tip: { fr: "≈6 étapes : Dragons (Memory Fragment), Allies (interaction), Enemies (boss à vaincre avec un Memory Essence Encapsulator en inventaire), Landscapes (faille au skyscale), Equipment (chaîne de craft — voir le détail sous l'étape) et le skin de l'épisode.", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
      { key: "vis_dragonfall", achievementId: 4757, name: "Visions of Dragonfall",
        unlock: { fr: "🔓 Débloquée par l'achat de la Trance Stone (voir Vision I) — les 6 collections de carte s'ouvrent ensemble. ⚠ Garder la Trance Stone EN INVENTAIRE pendant les étapes : les prérequis déjà remplis sont crédités rétroactivement à l'achat. Accès carte : épisode « War Eternal » (Dragonfall).", en: "🔓 Unlocked by purchasing the Trance Stone (see Vision I) — all 6 map collections open at once. ⚠ Keep the Trance Stone IN YOUR INVENTORY while doing the steps: already-met requirements are granted retroactively on purchase. Map access: the 'War Eternal' episode (Dragonfall)." },
        bitTips: {
          "Heavy Corsair Boots": { fr: "Récompense de la maîtrise « War Eternal ». ⚠ C'est le seul méta d'épisode SANS marge : 18 succès exigés sur 18 éligibles, aucun n'est facultatif. ↔ Alternative sans succès : la piste de récompense de Chute draconique.", en: "Reward from the 'War Eternal' Mastery. ⚠ It is the only episode meta with NO slack: 18 achievements required out of 18 eligible, none optional. ↔ Achievement-free alternative: the Dragonfall reward track." },
          "Vision of Dragons: Aurene": { fr: "Fragment de mémoire au sommet du grand pilier voisin du point de passage du Commandement du Pacte [&BN4LAAA=], au-dessus de la Générale Almorra Ame-gardienne. 💡 Le plus simple est de partir du haut de l'aéronef.", en: "Memory Fragment atop the tall pillar next to Pact Command Waypoint [&BN4LAAA=], above General Almorra Soulkeeper. 💡 Easiest approach is from the top of the airship." },
          "Vision of Allies: Zafirah": { fr: "Interagir avec la Page de journal déchirée, juste à côté du Marchand elonien itinérant, près de l'Avant-poste du Pacte.", en: "Interact with the Torn Journal Page, right next to the Traveling Elonian Trader, near the Pact Outpost." },
          "Vision of Enemies: Ley-Infused Enemy": { fr: "Vaincre un ennemi infusé de lignes de faille en ayant un Encapsulateur d'essence mémorielle DANS l'inventaire. 💡 N'importe quel sous-événement de « Bonus Event: Defeat the ley-infused champion » convient — inutile de chercher un ennemi précis.", en: "Defeat a ley-infused enemy while holding a Memory Essence Encapsulator IN your inventory. 💡 Any subevent of 'Bonus Event: Defeat the ley-infused champion' works — no need to hunt a specific foe." },
          "Vision of Landscapes: Dragonfall": { fr: "Faille à l'ouest du Bassin des lamentations, sur l'île au niveau de l'eau, près de l'arbre isolé. Suivre la magie volatile jusqu'à la faille finale. ⚠ La magie doit être ramassée DANS L'ORDRE : en sauter une oblige à recommencer.", en: "Rift west of Wailing Basin, on the island at water level, near the lonely tree. Follow the Volatile Magic to the end rift. ⚠ The magic must be collected IN ORDER: skipping one forces a restart." },
          "Vision of Equipment: Dragon Champion Armor": { fr: "Terminer une classe de poids complète de l'armure Éclat des Brumes de rang 1, achetée chez le Marchand elonien itinérant, à Chute draconique.", en: "Complete one weight class of Tier 1 Mist Shard armor, purchased from the Traveling Elonian Trader in Dragonfall." },
          "Vision of Action: Dragonfall": { fr: "Terminer UN SEUL des trois événements de groupe : Récolter des braises éternelles, Récolter les larmes de Melandru dans le Domaine perdu de Melandru, ou Récolter des lieurs d'âme dans les Enfers. 💡 Observation en jeu d'Antoine, absente du wiki : ces trois chaînes partent toutes du camp principal et suivent la colonisation de leur branche sur carte fraîche, après le méta — et surtout, ce n'est PAS la dernière étape qui crédite la collection, mais l'étape de RÉCOLTE, située à peu près au milieu de la chaîne. Inutile donc d'aller au bout : dès la récolte faite, c'est validé.", en: "Complete just ONE of the three group events: Collect Eternal Embers, Collect Melandru's Tears throughout Melandru's Lost Domain, or Collect Soul Binders throughout the Underworld. 💡 Antoine's in-game observation, absent from the wiki: all three chains start at the main camp and follow their branch's colonisation on a fresh map, after the meta — and crucially, it is NOT the last step that credits the collection but the COLLECT step, roughly mid-chain. So there is no need to see it through: once the collecting is done, it ticks." },
        },
        tip: { fr: "≈6 étapes : Dragons (Memory Fragment), Allies (interaction), Enemies (boss à vaincre avec un Memory Essence Encapsulator en inventaire), Landscapes (faille au skyscale), Equipment (chaîne de craft — voir le détail sous l'étape) et le skin de l'épisode.", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
      { key: "vis_brandstone", achievementId: 4000, name: "Brandstone Research",
        unlock: { fr: "🔓 Prérequis des armes Astral. Parler à Yasna (niveau le plus bas de la bibliothèque de l'Astralarium, Domain of Istan). ⏳ TIMEGATE : 1 tâche par jour, 7 jours minimum — à lancer en tout premier. Récompense : Yasna devient marchande et vend les recettes d'armes Astral (10 Kralkatite Ore pièce).", en: "🔓 Prerequisite for Astral weapons. Talk to Yasna (lowest level of the Astralarium library, Domain of Istan). ⏳ TIMEGATE: one task per day, 7 days minimum — start this first. Reward: Yasna becomes a merchant and sells the Astral weapon recipes (10 Kralkatite Ore each)." },
        tip: { fr: "Coût total du succès : 20 Kralkatite Ore + 15 Powdered Rose Quartz.", en: "Total achievement cost: 20 Kralkatite Ore + 15 Powdered Rose Quartz." },
        bitNames: {
          0: { fr: "Jour 1 — 10 Kralkatite Ore à Yasna", en: "Day 1 — 10 Kralkatite Ore to Yasna" },
          1: { fr: "Jour 2 — 10 Branded Residues", en: "Day 2 — 10 Branded Residues" },
          2: { fr: "Jour 3 — relevés au Particle Collector sur un brandstone tombé", en: "Day 3 — Particle Collector readings on a fallen brandstone" },
          3: { fr: "Jour 4 — 10 Powdered Rose Quartz", en: "Day 4 — 10 Powdered Rose Quartz" },
          4: { fr: "Jour 5 — Astral Alignments (livre de la section interdite)", en: "Day 5 — Astral Alignments (forbidden-section book)" },
          5: { fr: "Jour 6 — Mirror Calibration Readings (escorte)", en: "Day 6 — Mirror Calibration Readings (escort)" },
          6: { fr: "Jour 7 — Blazing Kralkatite (10 Ore + 5 Rose Quartz au Beam of Light)", en: "Day 7 — Blazing Kralkatite (10 Ore + 5 Rose Quartz at the Beam of Light)" },
        },
        bitTips: {
          0: { fr: "Yasna est au niveau le plus bas de la bibliothèque centrale de l'Astralarium. ⚠ Une seule tâche par jour : passer la voir chaque jour.", en: "Yasna is on the lowest level of the Astralarium's central library. ⚠ One task per day only: check in daily." },
          1: { fr: "Les Branded Residues tombent des élémentaires branded — il y en a toujours autour d'un brandstone tombé.", en: "Branded Residues drop from branded elementals — there are always some guarding a fallen brandstone." },
          2: { fr: "Récupérer le Brandstone Multitool auprès d'un Volatile Magic Collector (ou Scholar Fatima au sommet de l'Astralarium) pour localiser les impacts. Un brandstone tombe toutes les ~15 min.", en: "Get the Brandstone Multitool from a Volatile Magic Collector (or Scholar Fatima atop the Astralarium) to locate impacts. A brandstone falls roughly every 15 min." },
          3: { fr: "Le Powdered Rose Quartz est un drop rare des nœuds présents sur les sites de brandstone. Achetable au comptoir.", en: "Powdered Rose Quartz is a rare drop from the nodes at brandstone sites. Also buyable on the TP." },
          4: { fr: "Parler au vendeur de cœur pour accéder à la section interdite de l'archive, y prendre le livre et le rapporter à Yasna.", en: "Talk to the heart vendor to access the archive's forbidden section, grab the book and bring it back to Yasna." },
          5: { fr: "Event d'escorte autour de l'Astralarium : parler à Akili quand l'icône d'event apparaît. ⚠ Akili disparaît si l'event « Stop the book-burning raid » se déclenche avant.", en: "Escort event around the Astralarium: talk to Akili when the event icon appears. ⚠ Akili vanishes if the 'Stop the book-burning raid' event starts first." },
          6: { fr: "Le Beam of Light est au sommet de l'Astralarium — y combiner les matériaux.", en: "The Beam of Light is atop the Astralarium — combine the materials there." },
        } },
      { key: "vis_astral_purif", achievementId: 3964, name: "Astral Purification",
        unlock: { fr: "🔓 Se débloque en craftant ta première arme Astral. Optionnel mais rentable : sa récompense remplace une arme Astral complète.", en: "🔓 Unlocks after crafting your first Astral weapon. Optional but worth it: its reward replaces a full Astral weapon." },
        tip: { fr: "Débloque aussi les recettes d'armes Stellar chez Yasna.", en: "Also unlocks the Stellar weapon recipes at Yasna." },
        bitTips: {
          0: { fr: "Se débloque au craft de ta PREMIÈRE arme Astral : ouvrir le courrier et donner la « Note from Yasna » à Ouissal. Récompense : un Irradiated Vision Crystal — l'ingrédient principal d'une arme Stellar, soit une arme Astral entière économisée (500 Kralkatite Ore + 500 Powdered Rose Quartz).", en: "Unlocks when you craft your FIRST Astral weapon: open your mail and give the 'Note from Yasna' to Ouissal. Reward: an Irradiated Vision Crystal — the main ingredient of a Stellar weapon, i.e. a whole Astral weapon's worth of materials saved (500 Kralkatite Ore + 500 Powdered Rose Quartz)." },
        } },
      { key: "vis_ep_lich", achievementId: 4195, metaSubs: true, name: "« Long Live the Lich » Mastery",
        unlock: { fr: "🔓 Meta d'épisode (LS4 ép.2) — récompense le skin exigé par Visions of Kourna. Aucun déblocage : les succès de l'épisode y comptent automatiquement.", en: "🔓 Episode meta (LWS4 ep.2) — rewards the skin required by Visions of Kourna. No unlock step: the episode's achievements count automatically." },
        tip: { fr: "⚠ 38 succès à compléter — le plus gros morceau de Vision I en volume, mais SANS timegate : tout est faisable d'affilée. C'est du temps de jeu, pas de l'attente.", en: "⚠ 38 achievements to complete — Vision I's biggest chunk by volume, but with NO timegate: it can all be done back to back. It costs playtime, not waiting." } },
      { key: "vis_ep_bug", achievementId: 4093, metaSubs: true, name: "« A Bug in the System » Mastery",
        unlock: { fr: "🔓 Meta d'épisode (LS4 ép.3) — récompense l'Olmakhan Mantle exigé par Visions of Sandswept Isles.", en: "🔓 Episode meta (LWS4 ep.3) — rewards the Olmakhan Mantle required by Visions of Sandswept Isles." },
        tip: { fr: "35 succès. Sans timegate. Fournit aussi la Banner of the Commander (recette de Lady Camilla) utile ailleurs dans Vision.", en: "35 achievements. No timegate. Also provides the Banner of the Commander (Lady Camilla's recipe) used elsewhere in Vision." } },
      { key: "vis_ep_star", achievementId: 4359, metaSubs: true, name: "« A Star to Guide Us » Mastery",
        unlock: { fr: "🔓 Meta d'épisode (LS4 ép.4) — récompense le skin exigé par Visions of Jahai.", en: "🔓 Episode meta (LWS4 ep.4) — rewards the skin required by Visions of Jahai." },
        tip: { fr: "Sans timegate. Attention : Visions of Jahai demande EN PLUS la collection Elegy ci-dessous.", en: "No timegate. Note: Visions of Jahai ALSO requires the Elegy collection below." } },
      { key: "vis_elegy", achievementId: 4376, name: "The Convergence of Sorrow I: Elegy",
        bitTips: {"0": {"fr": "Départ de la chaîne : la forgeronne d'armures éveillée se trouve au Refuge du soleil, à Jahai. Tout le reste en découle.", "en": "Start of the chain: the Awakened armorsmith is at Sun's Refuge, in Jahai. Everything else follows from her."}, "9": {"fr": "Point de bascule : c'est la remise des trois objets qui ouvre la seconde moitié (les mémoriaux). Ne farme pas les mémoriaux avant.", "en": "Turning point: handing over the three items opens the second half (the memorials). Don't farm memorials before this."}, "10": {"fr": "Les mémoriaux 10 à 16 sont des énigmes de lieu dans Jahai. Fais-les d'une traite avec une carte de marqueurs, sinon tu y repasseras dix fois.", "en": "Memorials 10 to 16 are location riddles across Jahai. Do them in one pass with a marker pack, otherwise you'll come back ten times."}, "17": {"fr": "« Trouver le destructeur » : c'est un combat, prévois d'être accompagné ou en build solide.", "en": "'Find the destroyer': this is a fight, bring company or a solid build."}, "18": {"fr": "Dernière étape, elle se déclenche seulement une fois les 18 précédentes validées.", "en": "Final step, it only triggers once the previous 18 are validated."}},
        unlock: { fr: "🔓 Consoler un armurier Awakened et changer le cœur d'un Sunspear (Jahai Bluffs). Une fois la collection finie, parler à Amira pour valider l'étape « Vision of Equipment: Elegy Armor ».", en: "🔓 Console an Awakened armorsmith and change a Sunspear's heart (Jahai Bluffs). Once complete, talk to Amira to validate the 'Vision of Equipment: Elegy Armor' step." },
        tip: { fr: "⚠ Demande des composants de craft (armure Elegy). Sans timegate, mais prévoir les matériaux — c'est la 2e sous-collection cachée de Visions of Jahai.", en: "⚠ Requires crafting components (Elegy armor). No timegate, but budget the materials — it's the 2nd hidden sub-collection of Visions of Jahai." } },
      { key: "vis_ep_allornothing", achievementId: 4544, metaSubs: true, name: "« All or Nothing » Mastery",
        unlock: { fr: "🔓 Meta d'épisode (LS4 ép.5) — récompense le skin exigé par Visions of Thunderhead Peaks.", en: "🔓 Episode meta (LWS4 ep.5) — rewards the skin required by Visions of Thunderhead Peaks." },
        tip: { fr: "Sans timegate. L'étape « Equipment » de cette carte passe par la collection Journeyman of the Forge ci-dessous.", en: "No timegate. This map's 'Equipment' step goes through the Journeyman of the Forge collection below." } },
      { key: "vis_forge", achievementId: 4577, name: "Journeyman of the Forge (armes Dragonsblood)",
        bitTips: {"0": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "1": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "2": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "3": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "4": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "5": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "6": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "7": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "8": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "9": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "10": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "11": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "12": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "13": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "14": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}, "15": {"fr": "Environ 60 Masse marquée par arme (960 au total pour les 16). Le vrai plafond est de 25 nœuds de Masse marquée par jour aux Pics de Chef-Tonnerre : compte 2 à 4 semaines, c'est LE timegate de Vision I.", "en": "Roughly 60 Branded Mass per weapon (960 total for all 16). The real cap is 25 Branded Mass nodes per day in Thunderhead Peaks: budget 2-4 weeks, this is THE Vision I timegate."}},
        unlock: { fr: "🔓 Nécessite d'avoir terminé l'étape d'histoire « Dragonsblood ». Les livres de recettes s'achètent ensuite 500 Volatile Magic + 5 Laurels pièce. ⚠ Après avoir crafté les 6 armes, RETOURNER voir la Forge Master Hilina et ACHETER le « Vision of Equipment » pour 5 po — sans cet achat, l'étape reste incomplète.", en: "🔓 Requires finishing the 'Dragonsblood' story step. Recipe books then cost 500 Volatile Magic + 5 Laurels each. ⚠ After crafting the 6 weapons, GO BACK to Forge Master Hilina and BUY the 'Vision of Equipment' for 5 g — without that purchase the step stays incomplete." },
        tip: { fr: "⏳ LE VRAI TIMEGATE de Vision I : 960 Branded Mass minimum, plafonnés à 25 nœuds/jour/compte (+5 par perso/jour au coffre) → compter ~2 à 4 semaines. Par arme : 60 Branded Mass + 3 Exquisite Serpentite Jewels + 2 composants T6. Total : 960 Branded Mass, 48 Serpentite, 8 000 Volatile Magic, 80 Laurels. Le Dragonsblood Impaler (lance) n'a pas de recette.", en: "⏳ Vision I's REAL timegate: 960 Branded Mass minimum, capped at 25 nodes/day/account (+5 per character/day from the chest) → allow ~2 to 4 weeks. Per weapon: 60 Branded Mass + 3 Exquisite Serpentite Jewels + 2 T6 components. Total: 960 Branded Mass, 48 Serpentite, 8,000 Volatile Magic, 80 Laurels. The Dragonsblood Impaler (spear) has no recipe." } },
      { key: "vis_ep_wareternal", achievementId: 4689, metaSubs: true, name: "« War Eternal » Mastery",
        unlock: { fr: "🔓 Meta d'épisode (LS4 ép.6) — récompense les Heavy Corsair Boots exigées par Visions of Dragonfall.", en: "🔓 Episode meta (LWS4 ep.6) — rewards the Heavy Corsair Boots required by Visions of Dragonfall." },
        tip: { fr: "18 succès. Fournit AUSSI les pièces d'armure Mist Shard exigées par l'étape « Equipment » de Dragonfall : Chasing Waterfalls (9 cascades) → casque, My Beautiful Infrastructure (10 events de pont) → gants, Life in the Underworld (10 events Olmakhan) → jambières, Cutting Weeds (10 events Mist Wardens) → bottes. Un seul poids d'armure suffit.", en: "18 achievements. ALSO provides the Mist Shard armor pieces required by Dragonfall's 'Equipment' step: Chasing Waterfalls (9 waterfalls) → helm, My Beautiful Infrastructure (10 bridge events) → gloves, Life in the Underworld (10 Olmakhan events) → leggings, Cutting Weeds (10 Mist Warden events) → boots. A single weight class is enough." } },
      { key: "vis_meta_2", achievementId: 4771, name: "Vision II: Farsight",
        unlock: { fr: "🔓 Automatique à la fin de Vision I.", en: "🔓 Automatic once Vision I completes." },
        tip: { fr: "/kneel à 20 Mastery Insights de la LS4 en restant à genoux 15 s (effet Meditative Rest) — se relever avant la fin ne valide pas. 24 existent, 4 inaccessibles (Rata Primus, Dunlon Springs et Ntouka Pond sous l'eau, Above the Umbral Battlegrounds en l'air). Récompense : Glimpse.", en: "/kneel at 20 LWS4 Mastery Insights, staying kneeled 15 s (Meditative Rest effect) — standing up early doesn't count. 24 exist, 4 unreachable (Rata Primus, Dunlon Springs and Ntouka Pond underwater, Above the Umbral Battlegrounds mid-air). Reward: Glimpse." } },
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
        reward: "Shattered Gift of Prescience",
        note: { fr: "⚠ Déblocage : acheter la Trance Stone chez n'importe quel Volatile Magic Collector (LW4). Prérequis compte : Skyscale + maîtrise Rift Repair. Prévoir 6 Memory Essence Encapsulators (1 par sous-collection, achat Volatile Magic) — les garder en inventaire pendant les 6 collections. Récompense : Shattered Gift of Prescience (à réparer ensuite en Gift of Prescience).", en: "⚠ Unlock: buy the Trance Stone from any Volatile Magic Collector (LWS4). Account prerequisites: Skyscale + Rift Repair mastery. Get 6 Memory Essence Encapsulators (1 per sub-collection, Volatile Magic purchase) — keep them in your inventory throughout the 6 collections. Reward: Shattered Gift of Prescience (repaired into the Gift of Prescience afterwards)." },
        subcollections: [
          { id: 4765, name: "Visions of Istan",             map: { fr: "Domaine d'Istan", en: "Domain of Istan" },        how: { fr: "3 étapes : Vision of Dragons (Memory Fragment à trouver), Vision of Allies (interaction avec un PNJ/objet), Vision of Enemies (vaincre le boss de zone en gardant un Memory Essence Encapsulator en inventaire). Istan : Fragment au-dessus du PoI Plaza of Resurgence (voler sur la porte puis monter) · Allies = Partially Corrupted Data Entry près de Chalon Docks wp · Enemies = Warden Amala au Mordant Crescent Great Hall.", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin. Istan: Fragment above the Plaza of Resurgence PoI (fly onto the gate, then ascend) · Allies = Partially Corrupted Data Entry near Chalon Docks wp · Enemies = Warden Amala at the Mordant Crescent Great Hall." } },
          { id: 4760, name: "Visions of Kourna",            map: { fr: "Domaine de Kourna", en: "Domain of Kourna" },       how: { fr: "3 étapes : Vision of Dragons (Memory Fragment à trouver), Vision of Allies (interaction avec un PNJ/objet), Vision of Enemies (vaincre le boss de zone en gardant un Memory Essence Encapsulator en inventaire).", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
          { id: 4770, name: "Visions of Jahai",             map: { fr: "Promontoire de Jahai", en: "Jahai Bluffs" },           how: { fr: "3 étapes : Vision of Dragons (Memory Fragment à trouver), Vision of Allies (interaction avec un PNJ/objet), Vision of Enemies (vaincre le boss de zone en gardant un Memory Essence Encapsulator en inventaire).", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
          { id: 4774, name: "Visions of Sandswept Isles",   map: { fr: "Îles de Ventesable", en: "Sandswept Isles" },        how: { fr: "3 étapes : Vision of Dragons (Memory Fragment à trouver), Vision of Allies (interaction avec un PNJ/objet), Vision of Enemies (vaincre le boss de zone en gardant un Memory Essence Encapsulator en inventaire).", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
          { id: 4764, name: "Visions of Thunderhead Peaks", map: { fr: "Pics de Chef-Tonnerre", en: "Thunderhead Peaks" },      how: { fr: "3 étapes : Vision of Dragons (Memory Fragment à trouver), Vision of Allies (interaction avec un PNJ/objet), Vision of Enemies (vaincre le boss de zone en gardant un Memory Essence Encapsulator en inventaire).", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
          { id: 4757, name: "Visions of Dragonfall",        map: { fr: "Chute draconique", en: "Dragonfall" },             how: { fr: "3 étapes : Vision of Dragons (Memory Fragment à trouver), Vision of Allies (interaction avec un PNJ/objet), Vision of Enemies (vaincre le boss de zone en gardant un Memory Essence Encapsulator en inventaire).", en: "~6 steps: Dragons (Memory Fragment), Allies (interaction), Enemies (map boss, holding a Memory Essence Encapsulator), Landscapes (skyscale rift), Equipment (crafting chain — details under the step) and the episode skin." } },
        ],
      },
      vision_2: {
        id: 4771,
        name: "Vision II: Farsight",
        reward: "Glimpse",
        note: { fr: "⚠ Correction v58 : ce n'est PAS la chaîne Requiem. Il faut faire /kneel à 20 Mastery Insights de la LS4 et RESTER à genoux 15 s (effet Meditative Rest) — se relever avant la fin ne valide pas l'étape. 24 insights existent, 20 suffisent : 4 sont inaccessibles (Rata Primus, Dunlon Springs et Ntouka Pond sous l'eau, Above the Umbral Battlegrounds en l'air). Récompense : Glimpse.", en: "⚠ v58 fix: this is NOT the Requiem chain. You must /kneel at 20 LWS4 Mastery Insights and STAY kneeling for 15 s (Meditative Rest effect) — standing up early doesn't count. 24 insights exist, 20 are enough: 4 are unreachable (Rata Primus, Dunlon Springs and Ntouka Pond underwater, Above the Umbral Battlegrounds in mid-air). Reward: Glimpse." },
        subcollections: [],
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
      { id: "karma", name: "Karma", required: 0, icon: "KA", apiId: 2, kind: "karma", showAbove: 100000,
        extras: [
          { amount: 315000, sub: "aurora_sl", bit: 1,  label: { fr: "Relique d'un dieu — Plage des sirènes", en: "God's Relic backpack — Siren's Landing" } },
          { amountPer: 7000, sub: "aurora_sl", bits: [2, 3, 4, 5, 6], label: { fr: "Faveurs des cinq dieux — 7 000 pièce", en: "Favors of the five gods — 7,000 each" } },
          { amount: 210000, sub: "aurora_ld", bit: 13, label: { fr: "Protecteur seraph — Lac Doric", en: "Seraph Protector — Lake Doric" } },
          { amount: 210000, sub: "aurora_ld", bit: 14, label: { fr: "Bâton du savant — Lac Doric", en: "Bloodstone Savant's Staff — Lake Doric" } },
          { amountPer: 7000, sub: "aurora_ld", bits: [2, 3, 4, 5, 6, 7], label: { fr: "Objets de cœur du Lac Doric — 7 000 pièce", en: "Lake Doric heart items — 7,000 each" } },
          { amountPer: 7000, sub: "aurora_eb", bits: [4, 5, 6, 7, 8], label: { fr: "Objets de cœur de la Baie des braises — 7 000 pièce", en: "Ember Bay heart items — 7,000 each" } },
          { amountPer: 7000, sub: "aurora_bfr", bits: [3, 4, 5, 6], label: { fr: "Objets de cœur des Confins de Givramer — 7 000 pièce", en: "Bitterfrost Frontier heart items — 7,000 each" } },
          { amount: 1050, sub: "aurora_bfr", bit: 13, label: { fr: "Pierre de feu grawl — élixir d'accès à The Bitter Cold", en: "Grawl Firestone — elixir granting access to The Bitter Cold" } },
          { amountPer: 7000, sub: "aurora_dm", bits: [2, 3, 4, 5], label: { fr: "Objets de cœur du Mont Draconis — 7 000 pièce", en: "Draconis Mons heart items — 7,000 each" }, estimated: true },
        ] },
      { id: "blood_ruby", name: "Blood Ruby", required: 250, icon: "BR", apiId: 79280,
        farmType: "per_account", perAccountPerDay: 12, mapNote: "Bloodstone Fen",
        aside: { fr: "Le plafond porte sur les nœuds : 35/jour/compte, rendement relevé à ~29 % — soit une dizaine de rubis par jour, pas plus. La piste de récompense du Marais rend un coffre de 50 d'un coup.", en: "The cap is on nodes: 35/day/account at a measured ~29% yield — about ten rubies a day, no more. The Bloodstone Fen reward track grants a 50-ruby strongbox in one go." },
        }, // surcoût déclaré dans SOURCES_DB.craft_components.blood_ruby.qty_extras
      { id: "winterberry", name: "Winterberry", required: 250, icon: "WB", apiId: 79899,
        farmType: "per_char", perCharPerDay: 60, mapNote: "Bitterfrost Frontier" },
      { id: "petrified", name: "Petrified Wood", required: 250, icon: "PW", apiId: 79469,
        farmType: "per_account", perAccountPerDay: 45, mapNote: "Ember Bay + Draconis Mons" },
      { id: "jade", name: "Jade Shard", required: 250, icon: "JS", apiId: 80332,
        farmType: "per_account", perAccountPerDay: 40, mapNote: "Lake Doric", },
      { id: "fire_orchid", name: "Fire Orchid Blossom", required: 250, icon: "FO", apiId: 81127,
        farmType: "per_account", perAccountPerDay: 40, mapNote: "Draconis Mons" },
      { id: "orrian", name: "Orrian Pearl", required: 250, icon: "OP", apiId: 81706,
        aside: { fr: "Hors budget : les jetons d'harmonisation coûtent 10 perles pièce, et le 2e coffre du Reliquaire d'Abaddon en demande un. ⚠ Ne confonds pas les deux plafonds : les coffres sont limités à 2 par personnage et par jour et servent au Chiffre ancien, pas aux perles.", en: "Off-budget: attunement tokens cost 10 pearls each, and the 2nd Abaddon's Reliquary chest needs one. ⚠ Don't conflate the two caps: chests are limited to 2 per character per day and feed the Ancient Cipher, not the pearls." },
        farmType: "per_char_hearts", perCharPerDay: 27, heartBundle: true, mapNote: "Siren's Landing",
        heartNote: { fr: "Circuit gratuit, par personnage et par jour : ~20 nœuds d'huîtres qui apparaissent sur les 23-25 emplacements fixes, 1 perle garantie chacun, plus 7 perles sur trois nommés quotidiens (Wyverne libérée 3, Illusion horrible 2, Larve gargantuesque 2). Les coffres engloutis ajoutent 1-2 perles au hasard. Faucille d'orichalque conseillée. En option payante : les 5 vendeurs de cœur, 3 perles chacun pour 13 440 karma au total.", en: "Free route, per character per day: ~20 oyster nodes spawning across the 23-25 fixed spots, 1 guaranteed pearl each, plus 7 pearls from three daily named foes (Unchained Wyvern 3, Horrid Illusion 2, Gargantuan Grub 2). Waterlogged Chests add a random 1-2. Orichalcum sickle recommended. Paid option: the 5 heart vendors, 3 pearls each for 13,440 karma total." } },
    ],
    raidTabLabel: { fr: "⛏ Chaîne du Henge", en: "⛏ Henge chain" },
    requirements: {
      unit: { fr: "pierre de druide", en: "druid stone" }, unitTotal: 16,
      perStep: [
        { key: "henge_3402", units: 1, unitBits: [1] },
        { key: "henge_3445", units: 3, unitBits: [2, 5, 8] },
        { key: "henge_3447", units: 5, unitBits: [2, 5, 8, 11, 14] },
        { key: "henge_3436", units: 7, unitBits: [3, 5, 7, 10, 12, 14, 16] },
      ],
      note: { fr: "⏳ Plafond strict : 5 fragments/jour/compte = 1 pierre/jour, donc 16 jours minimum. Acheter les 5 fragments CHAQUE jour même sans jouer la suite. Répartition : 1 → 3 → 5 → 7 selon l'étape. Les fragments ne sont plus vendus une fois la chaîne terminée.", en: "⏳ Hard cap: 5 fragments/day/account = 1 stone/day, so 16 days minimum. Buy the 5 fragments EVERY day even if you do nothing else. Split: 1 → 3 → 5 → 7 per step. Fragments are no longer sold once the chain is complete." },
      lines: [
        { icon: "🪙", label: { fr: "Karma", en: "Karma" }, perUnit: 4200, curKey: "karma",
          detail: { fr: "4 fragments × 1 050 karma chez les vendeurs des 4 cœurs — cœurs à refaire chaque jour", en: "4 fragments × 1,050 karma from the 4 heart vendors — hearts must be redone daily" } },
        { icon: "🔮", label: { fr: "Magie non liée", en: "Unbound Magic" }, perUnit: 1000, curKey: "unbound",
          detail: { fr: "1 fragment au vendeur de Magie non liée — sans coût en or (ne pas confondre avec ses Magic-Warped Bundles)", en: "1 fragment from the Unbound Magic vendor — no gold cost (don't confuse it with his Magic-Warped Bundles)" } },
        { icon: "🧩", label: { fr: "Fragments", en: "Fragments" }, perUnit: 5,
          detail: { fr: "5 par pierre, à combiner par double-clic", en: "5 per stone, combined by double-click" } },
        { icon: "⏳", label: { fr: "Jours (plafond quotidien)", en: "Days (daily cap)" }, perUnit: 1 },
      ],
    },
    raidAchievements: [
      { key: "henge_3402", achievementId: 3402, name: "The Druid Stone",
        bitNames: {
          0: { fr: "Instance d'histoire « Heart of the Volcano »", en: "'Heart of the Volcano' story instance" },
          1: { fr: "Druid Runestone — 5 fragments", en: "Druid Runestone — 5 fragments" },
          2: { fr: "Remettre la pierre à Kodama", en: "Hand the stone to Kodama" },
          3: { fr: "Fire Orchid à Kodama", en: "Fire Orchid to Kodama" },
          4: { fr: "Fire Orchid à Liriodendron", en: "Fire Orchid to Liriodendron" },
          5: { fr: "Fire Orchid à Broadleaf", en: "Fire Orchid to Broadleaf" },
          6: { fr: "Fire Orchid à Rosewood", en: "Fire Orchid to Rosewood" },
        },
        bitTips: {
          2: { fr: "Kodama est dans Druid's Grotto [&BMUJAAA=], Savage Rise.", en: "Kodama is inside Druid's Grotto [&BMUJAAA=], Savage Rise." },
        },
        unlock: { fr: "🔓 Se débloque en consommant le Volcano's Heart, récompense de l'instance finale « Heart of the Volcano » (LS3 ép.5 Flashpoint).", en: "🔓 Unlocked by consuming the Volcano's Heart, reward from the final 'Heart of the Volcano' instance (LWS3 ep.5 Flashpoint)." },
        tip: { fr: "Sections connues (fiche wiki de Kodama) : Saurian Rest, Imperial Rest, Webby Rest, Wurm Rest, Arcanum Rest, et « A Charged Bouquet » (5 Fire Orchids + 1 Charged Lodestone). ⚠ NE RIEN DONNER À KODAMA AVANT d'avoir débloqué cette collection : l'option d'offrir 5 Charged Lodestones et 10 Fire Orchid Blossoms apparaît plus tôt et CONSOMME les objets sans progression. 1 pierre. Acheter les 5 fragments du jour (4 aux cœurs à 1 050 karma + 1 à 1 000 Magie non liée), double-clic pour former la pierre, puis la donner à Kodama avec une Fire Orchid en inventaire (non déposée en banque).", en: "Known sections (Kodama wiki page): Saurian Rest, Imperial Rest, Webby Rest, Wurm Rest, Arcanum Rest, and 'A Charged Bouquet' (5 Fire Orchids + 1 Charged Lodestone). ⚠ DON'T GIVE ANYTHING TO KODAMA BEFORE unlocking this collection: the option to hand over 5 Charged Lodestones and 10 Fire Orchid Blossoms appears earlier and CONSUMES the items without progress. 1 stone. Buy the day's 5 fragments (4 from hearts at 1,050 karma + 1 for 1,000 Unbound Magic), double-click to form the stone, then hand it to Kodama with a Fire Orchid in your inventory (not deposited)." } },
      { key: "henge_3445", achievementId: 3445, name: "Awakening the Druid Stone",
        bitNames: {
          0: { fr: "Druid Stone (skin)", en: "Druid Stone (skin)" },
          1: { fr: "Element of the Wardbough", en: "Element of the Wardbough" },
          2: { fr: "Wardbough's Runestone", en: "Wardbough's Runestone" },
          3: { fr: "Wardbough's Rest — à Kodama", en: "Wardbough's Rest — to Kodama" },
          4: { fr: "Element of the Arbor", en: "Element of the Arbor" },
          5: { fr: "Arboreal Runestone", en: "Arboreal Runestone" },
          6: { fr: "Arboreal Rest — à Kodama", en: "Arboreal Rest — to Kodama" },
          7: { fr: "Element of the Oakhearts", en: "Element of the Oakhearts" },
          8: { fr: "Oakheart's Runestone", en: "Oakheart's Runestone" },
          9: { fr: "Oakheart's Rest — à Kodama", en: "Oakheart's Rest — to Kodama" },
          10: { fr: "Bouquet pour Kodama — 3 Fire Orchid Blossoms", en: "A Bouquet for Kodama — 3 Fire Orchid Blossoms" },
          11: { fr: "Bouquet pour Liriodendron — 3 orchidées", en: "A Bouquet for Liriodendron — 3 blossoms" },
          12: { fr: "Bouquet pour Broadleaf — 3 orchidées", en: "A Bouquet for Broadleaf — 3 blossoms" },
          13: { fr: "Bouquet pour Rosewood — 3 orchidées", en: "A Bouquet for Rosewood — 3 blossoms" },
        },
        bitTips: {
          1: { fr: "Greater Wardbough — event « Kill the greater spirit of nature » à Eternal Pool [&BL4JAAA=]. Parler à Squad Leader Perun près de Scout's Clearing [&BNAJAAA=] pour lancer la chaîne.", en: "Greater Wardbough — 'Kill the greater spirit of nature' event at Eternal Pool [&BL4JAAA=]. Talk to Squad Leader Perun near Scout's Clearing [&BNAJAAA=] to start the chain." },
          4: { fr: "Donné par le Restless Arboreal Spirit près de Seraph Observers Waypoint [&BGIAAAA=], Brisban Wildlands.", en: "Given by the Restless Arboreal Spirit near Seraph Observers Waypoint [&BGIAAAA=], Brisban Wildlands." },
          7: { fr: "Rotting Ancient Oakheart — event « Defeat the corrupted veteran oakheart » près de Greatheart Weald [&BIoGAAA=], Queensdale.", en: "Rotting Ancient Oakheart — 'Defeat the corrupted veteran oakheart' event near Greatheart Weald [&BIoGAAA=], Queensdale." },
          11: { fr: "Liriodendron : Peace Grounds [&BMkJAAA=], Savage Rise.", en: "Liriodendron: Peace Grounds [&BMkJAAA=], Savage Rise." },
          12: { fr: "Broadleaf : sur une corniche surplombant Savage Rise.", en: "Broadleaf: on a ledge above the Savage Rise." },
          13: { fr: "Rosewood : pont rocheux au-dessus d'Ancient Hollow Waypoint [&BNUJAAA=].", en: "Rosewood: rock bridge above Ancient Hollow Waypoint [&BNUJAAA=]." },
        },
        unlock: { fr: "🔓 Automatique à la fin de « The Druid Stone ». Succès caché : il n'apparaît dans le panneau qu'une fois débloqué.", en: "🔓 Automatic once 'The Druid Stone' completes. Hidden achievement: it only shows in the panel once unlocked." },
        tip: { fr: "3 pierres (≈3 jours). Tuer les champions de Draconis Mons pour leurs Elements, combiner chacun avec une pierre → Aestus / Ignis / Desecrator Runestones. ⚠ Kodama les refuse une par une : avoir LES TROIS avant de lui parler.", en: "3 stones (≈3 days). Kill the Draconis Mons champions for their Elements, combine each with a stone → Aestus / Ignis / Desecrator Runestones. ⚠ Kodama refuses them one at a time: have ALL THREE before talking to her." } },
      { key: "henge_3447", achievementId: 3447, name: "Sprouting the Druid Stone",
        bitNames: {
          0: { fr: "Living Druid Stone (skin)", en: "Living Druid Stone (skin)" },
          1: { fr: "Element of the Saurians", en: "Element of the Saurians" },
          2: { fr: "Saurian Runestone", en: "Saurian Runestone" },
          3: { fr: "Saurian Rest — à Kodama", en: "Saurian Rest — to Kodama" },
          4: { fr: "Element of the Empire", en: "Element of the Empire" },
          5: { fr: "Imperial Runestone", en: "Imperial Runestone" },
          6: { fr: "Imperial Rest — à Kodama", en: "Imperial Rest — to Kodama" },
          7: { fr: "Element of Webby", en: "Element of Webby" },
          8: { fr: "Webby Runestone", en: "Webby Runestone" },
          9: { fr: "Webby Rest — à Kodama", en: "Webby Rest — to Kodama" },
          10: { fr: "Element of the Wurm", en: "Element of the Wurm" },
          11: { fr: "Wurm Runestone", en: "Wurm Runestone" },
          12: { fr: "Wurm Rest — à Kodama", en: "Wurm Rest — to Kodama" },
          13: { fr: "Element of Arcanum", en: "Element of Arcanum" },
          14: { fr: "Arcanum Runestone", en: "Arcanum Runestone" },
          15: { fr: "Arcanum Rest — à Kodama", en: "Arcanum Rest — to Kodama" },
          16: { fr: "Charged Bouquet — Kodama : 5 orchidées + 1 Charged Lodestone", en: "A Charged Bouquet — Kodama: 5 blossoms + 1 Charged Lodestone" },
          17: { fr: "Glacial Bouquet — Liriodendron : 5 + 1 Glacial Lodestone", en: "A Glacial Bouquet — Liriodendron: 5 + 1 Glacial Lodestone" },
          18: { fr: "Onyx Bouquet — Broadleaf : 5 + 1 Onyx Lodestone", en: "An Onyx Bouquet — Broadleaf: 5 + 1 Onyx Lodestone" },
          19: { fr: "Molten Bouquet — Rosewood : 5 + 1 Molten Lodestone", en: "A Molten Bouquet — Rosewood: 5 + 1 Molten Lodestone" },
          20: { fr: "Propagation of the Fire Orchid — planter 3 graines", en: "Propagation of the Fire Orchid — plant 3 seeds" },
        },
        bitTips: {
          1: { fr: "Stonehead King — event « Slay the stonehead » (Savage Rise). Parler à Vigil Scout Premhoc au NE de Scout's Clearing [&BNAJAAA=] pour lancer l'event précédent.", en: "Stonehead King — 'Slay the stonehead' event (Savage Rise). Talk to Vigil Scout Premhoc northeast of Scout's Clearing [&BNAJAAA=] to start the preceding event." },
          4: { fr: "Emperor Mattake, Draconis Mons.", en: "Emperor Mattake, Draconis Mons." },
          7: { fr: "Webby Mother, Draconis Mons.", en: "Webby Mother, Draconis Mons." },
          10: { fr: "Bloodstone-Charged Lava Wurm, Draconis Mons.", en: "Bloodstone-Charged Lava Wurm, Draconis Mons." },
          13: { fr: "Inquest Power Suit, Draconis Mons.", en: "Inquest Power Suit, Draconis Mons." },
          20: { fr: "Fertile Soil : de l'autre côté de la grotte par rapport à Kodama, au sud, sur une corniche près du cercle de nœuds de lin.", en: "Fertile Soil: on the far side of the grotto from Kodama, to the south, on a ledge near the flax node ring." },
        },
        unlock: { fr: "🔓 Automatique à la fin d'« Awakening ». Succès caché.", en: "🔓 Automatic once 'Awakening' completes. Hidden achievement." },
        tip: { fr: "5 pierres (≈5 jours), 21 étapes en 7 sections. Étape « Propagation of the Fire Orchid » : planter la graine dans la Fertile Soil près de Kodama (Savage Rise) — ensuite une Primordial Orchid y pousse quotidiennement.", en: "5 stones (≈5 days), 21 steps across 7 sections. 'Propagation of the Fire Orchid' step: plant the seed in the Fertile Soil near Kodama (Savage Rise) — a Primordial Orchid then grows there daily." } },
      { key: "henge_3436", achievementId: 3436, name: "A Henge Away from Home",
        bitNames: {
          0: { fr: "Blooming Druid Stone (skin)", en: "Blooming Druid Stone (skin)" },
          1: { fr: "Heavy Houndskin Mantle (skin)", en: "Heavy Houndskin Mantle (skin)" },
          2: { fr: "Element of Aestus", en: "Element of Aestus" },
          3: { fr: "Aestus Runestone", en: "Aestus Runestone" },
          4: { fr: "Element of Ignis", en: "Element of Ignis" },
          5: { fr: "Ignis Runestone", en: "Ignis Runestone" },
          6: { fr: "Element of the Desecrator", en: "Element of the Desecrator" },
          7: { fr: "Desecrator Runestone", en: "Desecrator Runestone" },
          8: { fr: "Destroyer's Rest — les 3 runestones ENSEMBLE", en: "Destroyer's Rest — all 3 runestones TOGETHER" },
          9: { fr: "Element of Fire", en: "Element of Fire" },
          10: { fr: "Volcanic Runestone", en: "Volcanic Runestone" },
          11: { fr: "Element of Water", en: "Element of Water" },
          12: { fr: "Glacial Runestone", en: "Glacial Runestone" },
          13: { fr: "Element of Air", en: "Element of Air" },
          14: { fr: "Charged Runestone", en: "Charged Runestone" },
          15: { fr: "Element of Earth", en: "Element of Earth" },
          16: { fr: "Earthen Runestone", en: "Earthen Runestone" },
          17: { fr: "Elemental Rest — les 4 runestones ENSEMBLE", en: "Elemental Rest — all 4 runestones TOGETHER" },
          18: { fr: "Druid's Vision — apporter un Vision Crystal", en: "Druid's Vision — bring a Vision Crystal" },
          19: { fr: "Storm Bouquet — Kodama : 10 orchidées + 5 Charged Lodestones", en: "A Storm Bouquet — Kodama: 10 blossoms + 5 Charged Lodestones" },
          20: { fr: "Frozen Bouquet — Liriodendron : 10 + 5 Glacial", en: "A Frozen Bouquet — Liriodendron: 10 + 5 Glacial" },
          21: { fr: "Earthen Bouquet — Broadleaf : 10 + 5 Onyx", en: "An Earthen Bouquet — Broadleaf: 10 + 5 Onyx" },
          22: { fr: "Infernal Bouquet — Rosewood : 10 + 5 Molten", en: "An Infernal Bouquet — Rosewood: 10 + 5 Molten" },
          23: { fr: "Dierdre's Orchard — 3 graines, Dierdre's Steps (Mount Maelstrom)", en: "Dierdre's Orchard — 3 seeds, Dierdre's Steps (Mount Maelstrom)" },
          24: { fr: "Maguuma's Orchard — 3 graines, jardin de l'oasis (Dry Top)", en: "Maguuma's Orchard — 3 seeds, garden of the oasis (Dry Top)" },
          25: { fr: "Melandru's Orchard — 3 graines, Cathedral of Verdance (Cursed Shore)", en: "Melandru's Orchard — 3 seeds, Cathedral of Verdance (Cursed Shore)" },
          26: { fr: "Seaside Propagation — îles de l'Eastern Boiling Sea", en: "Seaside Propagation — Eastern Boiling Sea islands" },
          27: { fr: "Wind Rider Ledge Propagation", en: "Wind Rider Ledge Propagation" },
          28: { fr: "Rata Arcanum Propagation — caverne bioluminescente", en: "Rata Arcanum Propagation — bioluminescent cavern" },
          29: { fr: "Seaside Ledges Propagation — corniche au-dessus de Frothing Pedestal", en: "Seaside Ledges Propagation — ledge above Frothing Pedestal" },
          30: { fr: "Nu II Propagation — Nu II Vault", en: "Nu II Propagation — Nu II Vault" },
          31: { fr: "Ancient Hollow Propagation", en: "Ancient Hollow Propagation" },
        },
        bitTips: {
          1: { fr: "Ouvrir une Houndskin Mantle Box (récompense de maîtrise Flashpoint) — compte rétroactivement.", en: "Open a Houndskin Mantle Box (Flashpoint mastery reward) — counts retroactively." },
          9: { fr: "Fire Elementals. ⚡ Les 4 élémentaires spawnent ensemble à la Cathedral of Eternal Radiance (Malchor's Leap), ou au temple de Lyssa sous contrôle du Pacte.", en: "Fire Elementals. ⚡ All 4 elementals spawn together at the Cathedral of Eternal Radiance (Malchor's Leap), or at Lyssa's temple while Pact-controlled." },
          11: { fr: "Ice Elementals.", en: "Ice Elementals." },
          13: { fr: "Air Elementals et Sparks.", en: "Air Elementals and Sparks." },
          15: { fr: "Earth Elementals.", en: "Earth Elementals." },
          23: { fr: "Les 3 « Orchards » demandent 3 graines chacun, hors Draconis Mons.", en: "The 3 'Orchards' need 3 seeds each, outside Draconis Mons." },
        },
        unlock: { fr: "🔓 Automatique à la fin de « Sprouting » — les trois étapes précédentes sont obligatoires.", en: "🔓 Automatic once 'Sprouting' completes — all three previous steps are mandatory." },
        tip: { fr: "7 pierres (≈7 jours) + les 4 Elements élémentaires → Elemental Runestones à rendre TOUS ENSEMBLE à Kodama, puis 3 bouquets aux Maguuma Druid Spirits. ⚡ Les 4 élémentaires spawnent au même endroit à la Cathedral of Eternal Radiance (Malchor's Leap). Récompense : The Wayfarer's Henge.", en: "7 stones (≈7 days) + the 4 elemental Elements → Elemental Runestones handed to Kodama ALL AT ONCE, then 3 bouquets to the Maguuma Druid Spirits. ⚡ All 4 elementals spawn together at the Cathedral of Eternal Radiance (Malchor's Leap). Reward: The Wayfarer's Henge." } },
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
      { id: "memory", name: "Memory of Battle", required: 1750, icon: "MB", apiId: 71581 },
      { id: "jade",     name: "Testimony of Jade Heroics",     required: 250, icon: "JH", apiId: 65 },
      { id: "castoran", name: "Testimony of Castoran Heroics", required: 250, icon: "CH", apiId: 82 },
      { id: "badges", name: "Badge of Honor", required: 750, icon: "BH", apiId: 15 },
    ],
    currencyNote: { fr: "⚠ Correction v50 : la recette actuelle exige des Testimonies of JADE Heroics (le compteur pointait sur les Castoran). Les Jade ne sont plus obtenables depuis VoE — voir la note détaillée côté Warbringer ; les deux variantes sont suivies en attendant l'alignement d'ArenaNet.", en: "⚠ v50 fix: the current recipe requires Testimonies of JADE Heroics (the counter was pointing at Castoran). Jade can no longer be obtained since VoE — see the detailed note on Warbringer; both variants are tracked pending ArenaNet's alignment." },
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
      { id: "jade",     name: "Testimony of Jade Heroics",     required: 500, icon: "JH", apiId: 65 },
      { id: "castoran", name: "Testimony of Castoran Heroics", required: 500, icon: "CH", apiId: 82 },
    ],
    currencyNote: { fr: "⚠ Testimonies : les Jade (ère EoD) ne sont PLUS obtenables depuis VoE — les rank-ups McM donnent des Castoran, mais les vendeurs (Dugan, War Razor) exigent encore des Jade (incohérence signalée aux forums depuis fév. 2026, non corrigée en avril). Les deux compteurs sont suivis : si ArenaNet aligne la recette sur Castoran, le second prend le relais.", en: "⚠ Testimonies: Jade (EoD era) can NO LONGER be obtained since VoE — WvW rank-ups grant Castoran, but vendors (Dugan, War Razor) still demand Jade (inconsistency reported on the forums since Feb 2026, unfixed as of April). Both counters are tracked: if ArenaNet aligns the recipe to Castoran, the second one takes over." },
    metas: [],
    requirements: {
      unit: { fr: "dos", en: "back" }, unitTotal: 1,
      note: { fr: "⚠ Prérequis bloquants : rang McM 350 et tag de commandant (300 po) pour acheter le 4e Wings of War.", en: "⚠ Hard prerequisites: WvW rank 350 and a commander tag (300 g) to buy the 4th Wings of War." },
      lines: [
        { icon: "🎟", label: { fr: "Skirmish Claim Tickets", en: "Skirmish Claim Tickets" }, perUnit: 2800, curKey: "tickets",
          detail: { fr: "4 Wings of War (2 450) + composants · plafond 365/semaine + ~90 via les hebdos McM", en: "4 Wings of War (2,450) + components · 365/week cap + ~90 from WvW weeklies" } },
        { icon: "⏳", label: { fr: "Semaines restantes", en: "Weeks left" }, derivedFrom: "tickets", rate: 455,
          detail: { fr: "455 tickets/semaine hebdos comprises · tickets partagés avec Conflux, Strife et Triumphant Hero — les enchaîner du moins cher au plus cher", en: "455 tickets/week including weeklies · tickets shared with Conflux, Strife and Triumphant Hero — chain them cheapest first" } },
        { icon: "⚔", label: { fr: "Memories of Battle", en: "Memories of Battle" }, perUnit: 750, curKey: "memory" },
        { icon: "🛡", label: { fr: "Badges of Honor", en: "Badges of Honor" }, perUnit: 1250, curKey: "badges" },
      ],
    },
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
        unlock: { fr: "🔓 Se débloque en lootant le coffre de victoire de N'IMPORTE quel boss de raid (toutes ailes). Path of Fire requis pour le craft final.", en: "🔓 Unlocked by looting the victory chest of ANY raid boss (any wing). Path of Fire required for the final craft." },
        tip: { fr: "Débloqué au premier kill de boss de raid. Collection de 10 objets (W5 Hall of Chains).", en: "Unlocked on first raid boss kill. 10-item collection (W5 Hall of Chains)." },
        bitTips: {
          0: { fr: "Coffre en face de celui de Soulless Horror (W5), après le kill.", en: "Chest across from Soulless Horror's chest (W5), after the kill." },
          1: { fr: "Sous le pont menant à Dhuum, après les 3 premiers encounters de W5.", en: "Under the bridge leading to Dhuum, after clearing the first 3 W5 encounters." },
          2: { fr: "Derrière le trône de Dhuum, après l'avoir tué.", en: "Behind Dhuum's throne, after killing him." },
          3: { fr: "MF : Binding + Ink + Parchment + 100 Pulsing Brandsparks.", en: "MF: Binding + Ink + Parchment + 100 Pulsing Brandsparks." },
          4: { fr: "Temple of Kormir wp → NO jusqu'au perchoir à griffons, /sit 1 min (attendre l'expiration du buff).", en: "Temple of Kormir wp → NW to the griffon roost, /sit 1 min (wait for the buff to expire)." },
          5: { fr: "Salle cachée de la falaise à la cascade : tunnel des ruines naines (destroyers) ou trou dans la cascade aux Enchanted Bluffs, /sit 1 min.", en: "Hidden room at the waterfall cliff: dwarven-ruins tunnel (destroyers) or hole in the waterfall by Enchanted Bluffs, /sit 1 min." },
          6: { fr: "Derrière la cascade (en face du spot visible), /sit 1 min.", en: "Behind the waterfall (across from the visible spot), /sit 1 min." },
          7: { fr: "Est de Bonestrand wp [&BNwKAAA=] : portail chacal derrière la cascade → grotte d'Abaddon, /sit auprès d'Hasara.", en: "East of Bonestrand wp [&BNwKAAA=]: jackal portal behind the waterfall → Abaddon's cave, /sit by Hasara." },
          8: { fr: "Spot de méditation du Domain of Vabbi, /sit 1 min (voir wiki pour l'emplacement exact).", en: "Domain of Vabbi meditation spot, /sit 1 min (see wiki for the exact location)." },
          9: { fr: "Se valide automatiquement une fois les 5 méditations terminées.", en: "Completes automatically once all 5 meditations are done." },
        } },
      { key: "coalescence_2", achievementId: 4412, name: "Coalescence II: The Gift",
        bitTips: {"0": {"fr": "Appareil à alambic : chez Érudite Glenna (100 Éclats de magnétite + 10 po). ⚠ Indispensable AVANT de pouvoir ramasser le moindre flacon vide.", "en": "Alembic Apparatus: from Scholar Glenna (100 Magnetite Shards + 10 g). ⚠ Required BEFORE you can pick up any empty bottle."}, "1": {"fr": "Flacon de rage (vide) : statue orientale de Balthazar, au Temple de Balthazar, dans les Détroits de la Dévastation.", "en": "Bottle of Rage (Empty): eastern Balthazar statue, at the Temple of Balthazar, in Straits of Devastation."}, "2": {"fr": "Flacon de rage (rempli) : s'approcher du Jardin céleste du roi Joko, dans le Domaine de Vabbi — là où Balthazar est mort.", "en": "Bottle of Rage (Filled): approach King Joko's Sky Garden, in the Domain of Vabbi - where Balthazar died."}, "3": {"fr": "Flacon de mépris (vide) : petite crevasse sous le point de héros du Chaudron d'Ardence, dans les Marais de fer.", "en": "Bottle of Contempt (Empty): small crevice below The Cauldron of Searing hero point, in Iron Marches."}, "4": {"fr": "Flacon de mépris (rempli) : parler à n'importe quel PNJ Sympathisant séparatiste autour du Bastion d'Ébonhawke, dans les Champs de ruines.", "en": "Bottle of Contempt (Filled): talk to any Separatist Sympathizer NPC around the Stronghold of Ebonhawke, in Fields of Ruin."}, "5": {"fr": "Flacon de surprise (vide) : ⚠ le seul en raid. Troisième petit coffre du Pari de Mythwright, au nord de la faille de ley, accessible après Qadim.", "en": "Bottle of Surprise (Empty): ⚠ the only one inside a raid. Third small chest in Mythwright Gambit, north of the ley rift, reachable after Qadim."}, "6": {"fr": "Flacon de surprise (rempli) : sauter dans la Forge mystique de l'Arche du Lion.", "en": "Bottle of Surprise (Filled): jump into the Mystic Forge in Lion's Arch."}, "7": {"fr": "Flacon de peur (vide) : devant la statue brisée de Dwayna, légèrement au sud du défi de héros du Temple des Âges, à Queensdale.", "en": "Bottle of Fear (Empty): in front of the broken Dwayna statue, slightly south of the Temple of the Ages hero challenge, in Queensdale."}, "8": {"fr": "Flacon de peur (rempli) : ⚠ le vrai blocage. Bibliothécaire du Sanctuaire, dans la Bibliothèque sombre, via la faille au bout du Tombeau des Rois primitifs (Hautes Terres désertiques). La faille n'ouvre qu'avec « Ciel ouvert : Sanctuaire des Lanciers du soleil » (chasse au griffon) — ou avec un joueur du groupe qui l'a.", "en": "Bottle of Fear (Filled): ⚠ the real blocker. Sanctum Librarian, in The Dark Library, via the rift at the end of the Tomb of Primeval Kings (Desert Highlands). The rift only opens with 'Open Skies: Sunspear Sanctuary' (griffon hunt) - or with a party member who has it."}, "9": {"fr": "Flacon d'angoisse (vide) : sur une étagère de l'instance Repaire secret de Scarlet, derrière un mur invisible dans les cavernes sous le Prieuré de Durmand.", "en": "Bottle of Anguish (Empty): on a bookshelf in the Scarlet's Secret Lair instance, behind an invisible wall in the caverns below the Durmand Priory."}, "10": {"fr": "Flacon d'angoisse (rempli) : emote /kneel au point d'intérêt Champ des Tombés, à l'Arche du Lion.", "en": "Bottle of Anguish (Filled): use the /kneel emote at the Field of the Fallen point of interest, in Lion's Arch."}, "11": {"fr": "Flacon d'excitation (vide) : sur la table juste après l'entrée sud du labo Splorg Metamystics, en Province de Metrica.", "en": "Bottle of Excitement (Empty): on the table just past the Splorg Metamystics Lab south entrance, in Metrica Province."}, "12": {"fr": "Flacon d'excitation (rempli) : sauter dans la fontaine-portail en boucle du hall des Fractales des Brumes.", "en": "Bottle of Excitement (Filled): jump into the endlessly looping portal fountain in the Fractals of the Mists lobby."}, "13": {"fr": "Flacon de joie (vide) : à côté du quaggan Coddler, au niveau du sol du puzzle de saut de la Crique de Coddler, aux Chutes de la canopée.", "en": "Bottle of Joy (Empty): next to the quaggan Coddler, on the ground level of the Coddler's Cove jumping puzzle, in Timberline Falls."}, "14": {"fr": "Flacon de joie (rempli) : sauter dans la fontaine aux bébés quaggans, près du point d'intérêt Place mystique, à l'Arche du Lion.", "en": "Bottle of Joy (Filled): jump into the fountain with the quaggan hatchlings, near the Mystic Plaza point of interest, in Lion's Arch."}, "15": {"fr": "Flacon de honte (vide) : sous la table devant Logan Thackeray, dans l'instance du QG du Séraphin, à la Cité Divine.", "en": "Bottle of Shame (Empty): under the table in front of Logan Thackeray, inside the Seraph Headquarters instance, in Divinity's Reach."}, "16": {"fr": "Flacon de honte (rempli) : s'approcher du point d'intérêt Repaire de Glint, dans les Hautes Terres désertiques.", "en": "Bottle of Shame (Filled): approach the Glint's Lair point of interest, in the Desert Highlands."}, "17": {"fr": "Alambic alchimique complet : utiliser l'Appareil à alambic depuis l'inventaire une fois les 17 flacons faits. ⚠ Un flacon rempli ne compte qu'après son vide correspondant.", "en": "Alchemical Alembic Complete: use the Alembic Apparatus from your inventory once all 17 bottles are done. ⚠ A filled bottle only counts after its matching empty one."}},
        unlock: { fr: "🔓 Compléter Coalescence I, puis tuer un boss de Mythwright Gambit (W6) et acheter l'Alembic Apparatus chez Scholar Glenna, DANS l'instance W6 (100 Gaeting Crystals + 10 po). C'est l'achat qui active la collection.", en: "🔓 Complete Coalescence I, then kill a Mythwright Gambit (W6) boss and buy the Alembic Apparatus from Scholar Glenna, INSIDE the W6 instance (100 Gaeting Crystals + 10 g). The purchase is what activates the collection." },
        tip: { fr: "Requiert Coalescence I. Alembic Apparatus : 100 Gaeting Crystals + 10 po chez Glenna (W6), puis remplir les fioles lors des kills de W6 et double-cliquer sur l'Alembic dans l'inventaire.", en: "Requires Coalescence I. Alembic Apparatus: 100 Gaeting Crystals + 10g from Glenna (W6), then fill the vials during W6 kills and double-click the Alembic in your inventory." } },
      { key: "coalescence_3", achievementId: 4805, name: "Coalescence III: Culmination",
        bitTips: {"0": {"fr": "Essence tordue de générosité : Cardinale Adina, dans la Clé d'Ahdashim.", "en": "Twisted Essence of Generosity: Cardinal Adina, in the Key of Ahdashim."}, "1": {"fr": "Essence tordue de résolution : Cardinal Sabir, dans la Clé d'Ahdashim.", "en": "Twisted Essence of Resolve: Cardinal Sabir, in the Key of Ahdashim."}, "2": {"fr": "Essence tordue de confiance : Qadim l'Inégalé, dans la Clé d'Ahdashim. ⚠ Les 3 essences tombent dans le coffre bonus HEBDOMADAIRE : active la collection III AVANT ton clear de la semaine, sinon c'est une semaine perdue.", "en": "Twisted Essence of Trust: Qadim the Peerless, in the Key of Ahdashim. ⚠ All 3 essences drop from the WEEKLY bonus chest: enable collection III BEFORE your weekly clear, or you lose a week."}, "3": {"fr": "Carnet de méditation usé : parler à Hasara, caché dans la grotte d'Abaddon, au Val silencieux (la Désolation).", "en": "Worn Meditation Logbook: talk to Hasara, hidden in Abaddon's cave, in Silent Vale (the Desolation)."}, "4": {"fr": "Essence purifiée de générosité : Sanctuaire des Lanciers du soleil, Domaine de Vabbi, interagir avec l'Énergie étrange.", "en": "Purified Essence of Generosity: Sunspear Sanctuary, Domain of Vabbi, interact with the Strange Energy."}, "5": {"fr": "Essence purifiée de résolution : même Énergie étrange. ⚠ Les 3 essences tordues doivent être validées dans la collection, sinon l'interaction échoue.", "en": "Purified Essence of Resolve: same Strange Energy. ⚠ All 3 twisted essences must be validated in the collection, otherwise the interaction fails."}, "6": {"fr": "Essence purifiée de confiance : même Énergie étrange.", "en": "Purified Essence of Trust: same Strange Energy."}, "7": {"fr": "Carnet de méditation infusé : accordé automatiquement par l'Énergie étrange si le Carnet usé est en inventaire. Avec les 3 essences tordues déjà prises, une seule interaction valide les 4 dernières étapes d'un coup.", "en": "Infused Meditation Log Book: granted automatically by the Strange Energy if the Worn Logbook is in your inventory. With all 3 twisted essences already collected, a single interaction validates the last 4 steps at once."}},
        unlock: { fr: "🔓 Compléter Coalescence II. Nécessite Key of Ahdashim (W7). ⚠ Activer la collection AVANT ton clear hebdomadaire : les 3 Twisted Essences tombent du coffre bonus hebdo — sinon, +1 semaine.", en: "🔓 Complete Coalescence II. Requires Key of Ahdashim (W7). ⚠ Activate the collection BEFORE your weekly clear: the 3 Twisted Essences drop from the weekly bonus chest — otherwise, +1 week." },
        tip: { fr: "Requiert Coalescence II. ⚠ Activer la collection AVANT le clear hebdo : les 3 Twisted Essences tombent du coffre bonus hebdomadaire (Adina, Sabir, Qadim the Peerless). Ensuite : Worn Logbook chez Hasara (grotte d'Abaddon), puis purifier les 3 essences au Strange Energy (Sunspear Sanctuary, Vabbi, statue de Kormir).", en: "Requires Coalescence II. ⚠ Enable the collection BEFORE your weekly clear: the 3 Twisted Essences drop from the weekly bonus chest (Adina, Sabir, Qadim the Peerless). Then: Worn Logbook from Hasara (Abaddon's cave), and purify the 3 essences at the Strange Energy (Sunspear Sanctuary, Vabbi, Kormir statue)." } },
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
        bitTips: {"0": {"fr": "Point de départ : le « capitaine » naufragé se trouve au Pub Canach. Toute la chaîne en découle.", "en": "Starting point: the shipwrecked 'captain' is at Canach's Pub. The whole chain follows from him."}, "4": {"fr": "⚠ Verrou dur : « Maître de la plongée » doit être terminé en entier (10 coffres) avant de pouvoir avancer. Lance-le en tout premier, c'est le poste le plus long.", "en": "⚠ Hard gate: 'Master Diver' must be fully completed (10 chests) before you can progress. Start it first, it's the longest item."}, "6": {"fr": "Deux fractales au choix — Récif de la sirène ou Ruines aquatiques. Les deux sont en bas de la rotation, accessibles sans RA élevée.", "en": "Two fractals to choose from - Siren's Reef or Aquatic Ruins. Both sit low in the rotation, reachable without high AR."}, "8": {"fr": "Taidha Covington est un boss de monde à horaire fixe. Cale ton passage sur le timer plutôt que d'espérer tomber dessus.", "en": "Taidha Covington is a world boss on a fixed timer. Plan around the schedule rather than hoping to stumble on it."}, "9": {"fr": "Les fragments de masque (étapes 9 à 16) se collectent dans n'importe quel ordre. Regroupe ceux de Castora en une seule passe, ils sont quatre.", "en": "The mask fragments (steps 9 to 16) can be collected in any order. Group the Castora ones in a single pass, there are four of them."}, "21": {"fr": "Honneur des vagues en mode Exploration — n'importe quel chemin convient. Donjon à 5, à prévoir en LFG.", "en": "Honor of the Waves in Explorable mode - any path works. A 5-player dungeon, plan for LFG."}},
        unlock: { fr: "🔓 Parler à « Captain » Lakes au Pub Canach (Breezy Cay). Maîtrise Castoran Intuition requise pour les trésors d'aetherlocation (skimmer).", en: "🔓 Talk to 'Captain' Lakes at Pub Canach (Breezy Cay). Castoran Intuition mastery required for aetherlocation treasures (skimmer)." },
        tip: { fr: "Collection du précurseur en 24 étapes — démarre auprès de « Captain » Lakes au Pub Canach (Breezy Cay). Clés : JP Weyandt's Revenge (Sharkmaw Caverns, LA) → Tattered Note, puis 11 pièces de masque dans l'ordre libre (Shipwreck Strand, Siren's Reef, Southsun, Bloodtide, Cursed Shore, Wiley, Taidha Covington…). Maîtrise Castoran Intuition requise pour les trésors d'aetherlocation (skimmer). Finale : aider Shark dans le donjon Honor of the Waves.", en: "24-step precursor collection — starts with \"Captain\" Lakes at Pub Canach (Breezy Cay). Keys: Weyandt's Revenge JP (Sharkmaw Caverns, LA) → Tattered Note, then 11 mask pieces in any order (Shipwreck Strand, Siren's Reef, Southsun, Bloodtide, Cursed Shore, Wiley, Taidha Covington…). Castoran Intuition mastery required for aetherlocation treasures (skimmer). Finale: help Shark in the Honor of the Waves dungeon." } },
      { key: "selachi_diver", achievementId: 4177, name: "Master Diver",
        bitTips: {"0": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "1": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "2": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "3": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "4": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "5": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "6": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "7": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "8": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}, "9": {"fr": "Coffre englouti — pense à acheter tes Clés rouillées ouvragées chez la Maîtresse de la plongée Astora AVANT de partir : chaque coffre en consomme une, et il n'y a pas de vendeur sur place.", "en": "Sunken chest - remember to buy your Ornate Rusted Keys from Dive Master Astora BEFORE setting out: each chest consumes one, and there's no vendor on site."}},
        unlock: { fr: "🔓 Aucune action de déblocage : succès permanent du monde ouvert (cœur du jeu), disponible dès le niveau 80. Acheter les Ornate Rusted Keys chez Dive Master Astora (Arche du Lion) AVANT de partir : chaque coffre immergé en consomme une.", en: "🔓 No unlock step: permanent core open-world achievement, available from level 80. Buy Ornate Rusted Keys from Dive Master Astora (Lion's Arch) BEFORE heading out: each sunken chest consumes one." },
        tip: { fr: "Étape 4 de la collection : 10 coffres immergés (Ornate Rusted Keys chez Dive Master Astora, Arche du Lion).", en: "Collection step 4: 10 sunken chests (Ornate Rusted Keys from Dive Master Astora, Lion's Arch)." } },
      { key: "selachi_shipwreck", achievementId: 8880, metaSubs: true, name: "Shipwreck Strand Mastery",
        unlock: { fr: "🔓 Aucune action de déblocage : la progression suit les succès de Shipwreck Strand. 💡 À lancer tôt et à laisser courir : beaucoup de ces succès tombent en jouant la carte normalement, alors que les attaquer d'un bloc à la fin oblige à traquer les manquants un par un.", en: "🔓 No unlock step: progress simply follows the Shipwreck Strand achievements. 💡 Start early and let it run: many of these tick while playing the map normally, whereas tackling them in one block at the end forces you to hunt the missing ones one by one." },
        tip: { fr: "Requis pour le Don de maîtrise castoréenne. 36 succès exigés sur 53 éligibles — 17 sont donc facultatifs : déplie la liste, elle est triée par effort croissant et propose les moins coûteux en premier.", en: "Required for the Gift of Castoran Mastery. 36 achievements needed out of 53 eligible — 17 are therefore optional: expand the list, it is sorted by increasing effort and offers the cheapest first." } },
      { key: "selachi_starlit", achievementId: 9057, metaSubs: true, name: "Starlit Weald Mastery",
        unlock: { fr: "🔓 Aucune action de déblocage : la progression suit les succès de Starlit Weald. 💡 Même logique que Shipwreck Strand — à cumuler en jouant la carte, pas à rattraper en fin de parcours.", en: "🔓 No unlock step: progress simply follows the Starlit Weald achievements. 💡 Same logic as Shipwreck Strand — accumulate it while playing the map rather than catching up at the end." },
        tip: { fr: "Requis pour le Don de maîtrise castoréenne. 36 succès exigés sur 54 éligibles suivis — 18 sont donc facultatifs. ⚠ Un 55e objectif existe en jeu, « A Hunt for the Ages », mais l'API ne l'expose pas : le compteur officiel pourra afficher un point de plus que cette liste, sans que ce soit une erreur.", en: "Required for the Gift of Castoran Mastery. 36 achievements needed out of 54 tracked eligible — 18 are therefore optional. ⚠ A 55th objective exists in game, 'A Hunt for the Ages', but the API does not expose it: the official counter may show one more than this list, which is not an error." } },
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
      { key: "eikasia_meta", achievementId: 8826, name: "Incursive Investigation", metaSubs: true,
        unlock: { fr: "🔓 Meta : se valide quand les collections ci-dessous sont terminées. Récompense : Eikasia, Mists-Grasper Choice — choisir UN des 3 poids.", en: "🔓 Meta: completes once the collections below are done. Reward: Eikasia, Mists-Grasper Choice — pick ONE of the 3 weights." },
        tip: { fr: "Meta-achievement — récompense : Eikasia, Mists-Grasper Choice (choix d'UN poids parmi les 3).", en: "Meta-achievement — reward: Eikasia, Mists-Grasper Choice (pick ONE of the 3 weights)." } },
      { key: "eikasia_relic", achievementId: 8823, name: "Incursive Investigation: Relic in the Mists",
        unlock: { fr: "🔓 Terminer une fractale en mode quickplay (échelle 1, panneau LFG — contenu gratuit), looter le coffre final, puis apporter les Agony-Torn Gloves au Mist Stranger (Fort Marriner, Arche du Lion).", en: "🔓 Complete a quickplay fractal (scale 1, LFG panel — free content), loot the final chest, then bring the Agony-Torn Gloves to the Mist Stranger (Fort Marriner, Lion's Arch)." },
        tip: { fr: "Étape 1 : compléter une fractale en quickplay et looter le coffre final, puis rapporter les Agony-Torn Gloves au Mist Stranger (Fort Marriner, Arche du Lion).", en: "Step 1: complete a quickplay fractal and loot the final chest, then bring the Agony-Torn Gloves to the Mist Stranger (Fort Marriner, Lion's Arch)." } },
      { key: "eikasia_working", achievementId: 8830, name: "Incursive Investigation: Working Together",
        bitTips: {"0": {"fr": "Étape 1. L'Étranger des Brumes t'attend à l'entrée des fractales, à l'Aérodrome de l'Arche du Lion.", "en": "Step 1. The Mist Stranger waits at the fractal entrance, in the Lion's Arch Aerodrome."}, "9": {"fr": "⚠ Étape 2 malgré son rang dans la liste : l'API renvoie ce bit en dernier alors qu'il se joue en deuxième. Parle aux alliés juste après l'Étranger.", "en": "⚠ Step 2 despite its rank in the list: the API returns this bit last although it is played second. Talk to your allies right after the Stranger."}, "1": {"fr": "Étape 3. Session rapide uniquement — échelle 1, aucune RA ni niveau fractale requis. C'est la seule source de Poussière fractalline.", "en": "Step 3. Quickplay only - scale 1, no AR or fractal level required. It is the only source of Fractalline Dust."}, "3": {"fr": "Étape 5. Double verrou : le succès de récursion ET la fin de la semaine d'invasion. Impossible à accélérer.", "en": "Step 5. Double gate: the recursion achievement AND the end of the invasion week. Cannot be rushed."}, "5": {"fr": "Étape 6. Même schéma : deuxième récursion puis fin de la deuxième semaine. Trois semaines minimum au total.", "en": "Step 6. Same pattern: second recursion then the end of the second week. Three weeks minimum overall."}, "7": {"fr": "Étape 9. Troisième récursion, sans attente de semaine cette fois.", "en": "Step 9. Third recursion, with no week wait this time."}},
        unlock: { fr: "🔓 S'active avec « Relic in the Mists ». C'est le fil conducteur de la Fractalline Dust : la plupart des succès annexes de quickplay en rapportent 10+.", en: "🔓 Activates alongside 'Relic in the Mists'. It's the Fractalline Dust through-line: most quickplay side achievements grant 10+." },
        tip: { fr: "Fil conducteur de la Fractalline Dust — quickplay + achievements annexes (la plupart donnent 10+ Dust).", en: "Fractalline Dust through-line — quickplay + side achievements (most grant 10+ Dust)." } },
      { key: "eikasia_r1", achievementId: 8840, name: "Incursive Investigation: First Recursion", target: 150, cumulative: 150, rate: { perRun: 5, weekly: 25, unit: "Fractalline Dust" },
        unlock: { fr: "🔓 S'active après « Working Together ». Palier de 150 Fractalline Dust — la Dust se cumule automatiquement, aucun objet à rapporter.", en: "🔓 Activates after 'Working Together'. 150 Fractalline Dust tier — Dust accrues automatically, nothing to hand in." },
        tip: { fr: "1er palier : 150 Fractalline Dust (4-6 par run quickplay, +25 via l'hebdo Weekly Fractal Quickplay).", en: "1st tier: 150 Fractalline Dust (4-6 per quickplay run, +25 via the Weekly Fractal Quickplay)." } },
      { key: "eikasia_r2", achievementId: 8841, name: "Incursive Investigation: Second Recursion", target: 150, cumulative: 300, rate: { perRun: 5, weekly: 25, unit: "Fractalline Dust" },
        unlock: { fr: "🔓 S'active à la fin du 1er palier. 150 Dust de plus (300 cumulées).", en: "🔓 Activates when tier 1 completes. 150 more Dust (300 total)." },
        tip: { fr: "2e palier : 150 Dust (300 cumulées). S'active à la fin du 1er palier.", en: "2nd tier: 150 Dust (300 total). Activates when the 1st tier completes." } },
      { key: "eikasia_r3", achievementId: 8835, name: "Incursive Investigation: Third Recursion", target: 150, cumulative: 450, rate: { perRun: 5, weekly: 25, unit: "Fractalline Dust" },
        unlock: { fr: "🔓 S'active à la fin du 2e palier. 150 Dust de plus (450 cumulées) — dernier palier avant la meta.", en: "🔓 Activates when tier 2 completes. 150 more Dust (450 total) — last tier before the meta." },
        tip: { fr: "3e palier : 150 Dust (450 au total) — dernière récursion avant la meta.", en: "3rd tier: 150 Dust (450 total) — final recursion before the meta." } },
      { key: "eikasia_infinite", achievementId: 8814, name: "Incursive Investigation: Infinite Recursion", target: 150, cumulative: 150, rate: { perRun: 5, weekly: 25, unit: "Fractalline Dust" },
        unlock: { fr: "🔓 Verrouillée jusqu'à la meta. Ensuite répétable : 150 Dust = 1 paire d'un autre poids chez le vendeur. ⚠ La Dust excédentaire est perdue à chaque répétition — viser 150 pile.", en: "🔓 Locked until the meta is done. Then repeatable: 150 Dust = 1 pair of another weight from the vendor. ⚠ Excess Dust is lost on each repetition — aim for exactly 150." },
        tip: { fr: "🔒 Débloquée seulement après la meta (les 3 récursions terminées). Répétable : 150 Dust = 1 paire d'un autre poids au vendor. ⚠ La Dust excédentaire est perdue à chaque répétition — viser 150 pile.", en: "🔒 Unlocked only after the meta (all 3 recursions done). Repeatable: 150 Dust = 1 pair of another weight from the vendor. ⚠ Excess Dust is lost each repetition — aim for exactly 150." } },
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
    requirements: [
      { title: { fr: "📋 Runes légendaires", en: "📋 Legendary Runes" },
        unit: { fr: "rune", en: "rune" }, unitTotal: 7, unitsFrom: { key: "rune_collector" },
        note: { fr: "Cible : 7 (6 armure + 1 respirateur) — 6 suffisent pour un set terrestre. Les quantités ci-dessus sont recalculées d'après les runes déjà liées au compte.", en: "Target: 7 (6 armor + 1 aquabreather) — 6 cover a land set. Amounts above are recalculated from the runes already bound to your account." },
        lines: [
          { icon: "💎", label: { fr: "Piles of Lucent Crystal", en: "Piles of Lucent Crystal" }, perUnit: 500, curKey: "lucent_pile",
            detail: { fr: "50 Mystic Aspects × 10 piles · 1 pile = 10 Lucent Motes (recyclage d'objets rares/exotiques)", en: "50 Mystic Aspects × 10 piles · 1 pile = 10 Lucent Motes (salvaging rare/exotic gear)" } },
          { icon: "✨", label: { fr: "Charm of Brilliance", en: "Charm of Brilliance" }, perUnit: 50, curKey: "charm_bril" },
          { icon: "✨", label: { fr: "Charm of Potence", en: "Charm of Potence" }, perUnit: 50, curKey: "charm_pot" },
          { icon: "✨", label: { fr: "Charm of Skill", en: "Charm of Skill" }, perUnit: 50, curKey: "charm_skill" },
          { icon: "🎫", label: { fr: "Provisioner Tokens", en: "Provisioner Tokens" }, perUnit: 50, curKey: "provisioner",
            detail: { fr: "Gift of Craftsmanship · achat plafonné quotidiennement chez les Provisioners (échange d'objets crafts)", en: "Gift of Craftsmanship · daily-capped purchase from Provisioners (trade in crafted items)" } },
          { icon: "🍀", label: { fr: "Mystic Clovers", en: "Mystic Clovers" }, perUnit: 20, curKey: "clovers" },
          { icon: "🔮", label: { fr: "Globs of Ectoplasm", en: "Globs of Ectoplasm" }, perUnit: 100, curKey: "ectos" },
          { icon: "🪨", label: { fr: "Obsidian Shards", en: "Obsidian Shards" }, perUnit: 50, curKey: "shards" },
        ] },
      { title: { fr: "📋 Sigils légendaires", en: "📋 Legendary Sigils" },
        unit: { fr: "sigil", en: "sigil" }, unitTotal: 8, unitsFrom: { key: "sigil_collector" },
        note: { fr: "Cible : 8 (2 sets d'armes terrestres + aquatique) — 2 à 4 couvrent l'essentiel au quotidien.", en: "Target: 8 (2 land weapon sets + aquatic) — 2 to 4 cover most day-to-day needs." },
        lines: [
          { icon: "💎", label: { fr: "Piles of Lucent Crystal", en: "Piles of Lucent Crystal" }, perUnit: 750, curKey: "lucent_pile",
            detail: { fr: "75 Mystic Motes × 10 piles", en: "75 Mystic Motes × 10 piles" } },
          { icon: "✨", label: { fr: "Symbol of Control", en: "Symbol of Control" }, perUnit: 75, curKey: "sym_ctrl" },
          { icon: "✨", label: { fr: "Symbol of Enhancement", en: "Symbol of Enhancement" }, perUnit: 75, curKey: "sym_enh" },
          { icon: "✨", label: { fr: "Symbol of Pain", en: "Symbol of Pain" }, perUnit: 75, curKey: "sym_pain" },
          { icon: "🎫", label: { fr: "Provisioner Tokens", en: "Provisioner Tokens" }, perUnit: 50, curKey: "provisioner" },
          { icon: "🍀", label: { fr: "Mystic Clovers", en: "Mystic Clovers" }, perUnit: 30, curKey: "clovers" },
          { icon: "🔮", label: { fr: "Globs of Ectoplasm", en: "Globs of Ectoplasm" }, perUnit: 150, curKey: "ectos" },
          { icon: "🪨", label: { fr: "Obsidian Shards", en: "Obsidian Shards" }, perUnit: 75, curKey: "shards" },
        ] },
      { title: { fr: "📋 Relique légendaire", en: "📋 Legendary Relic" },
        unit: { fr: "relique", en: "relic" }, unitTotal: 1,
        note: { fr: "Une seule est utile. ⚠ Volume : 18 750 Piles Lucent (moins avec les procs ×5 du Mystic Facet) — étaler les ordres d'achat au comptoir. Lyhr (Wizard's Tower) peut forger les gifts contre 10 ectos de surcoût.", en: "Only one is useful. ⚠ Volume: 18,750 Lucent Piles (fewer with Mystic Facet ×5 procs) — spread your TP buy orders. Lyhr (Wizard's Tower) can forge the gifts for 10 extra ectos." },
        lines: [
          { icon: "💎", label: { fr: "Piles of Lucent Crystal", en: "Piles of Lucent Crystal" }, perUnit: 18750, curKey: "lucent_pile",
            detail: { fr: "25 Mystic Facets × 750 piles · chaque forge peut rarement en produire 5 d'un coup", en: "25 Mystic Facets × 750 piles · each forge can rarely yield 5 at once" } },
          { icon: "🗿", label: { fr: "Reliques exotiques", en: "Exotic relics" }, perUnit: 25,
            detail: { fr: "N'importe lesquelles — les moins chères au comptoir", en: "Any of them — cheapest on the TP" } },
          { icon: "🎫", label: { fr: "Provisioner Tokens", en: "Provisioner Tokens" }, perUnit: 50, curKey: "provisioner" },
          { icon: "🍀", label: { fr: "Mystic Clovers", en: "Mystic Clovers" }, perUnit: 25, curKey: "clovers" },
          { icon: "🔮", label: { fr: "Globs of Ectoplasm", en: "Globs of Ectoplasm" }, perUnit: 150, curKey: "ectos" },
        ] },
    ],
    raidAchievements: [
      { key: "rune_collector", achievementId: 7796, name: "Legendary Rune Collector",
        unlock: { fr: "🔓 Aucune action de déblocage : le compteur s'incrémente à chaque rune légendaire liée au compte. ⚠ Si tu possèdes déjà des runes légendaires et que le compteur reste à 0, passe à l'Arche du Lion ou à la Wizard's Tower — la visite force la mise à jour rétroactive.", en: "🔓 No unlock step: the counter increments each time a legendary rune binds to your account. ⚠ If you already own legendary runes and the counter stays at 0, visit Lion's Arch or the Wizard's Tower — the visit forces a retroactive update." },
        tip: { fr: "Compteur de runes liées au compte (max 7 : 6 armure + 1 respirateur). 6 suffisent pour un set terrestre complet. ⚠ Le vrai mur n'est pas l'or mais deux plafonds hebdomadaires : 20 trèfles mystiques et 50 jetons de fournisseur PAR rune. Six runes, c'est 120 trèfles — un coût, pas une attente : Lyhr et la Tisseuse de garde Lucirae en vendent sans aucune limite — et 300 jetons, environ 3 semaines à 105/sem. 💡 Rien dans le tracker n'exige ces runes : c'est du confort. Mais si tu les veux un jour, les trèfles et les jetons se cumulent en fond dès maintenant, sans rien décider.", en: "Account-bound rune counter (max 7: 6 armor + 1 aquabreather). 6 cover a full land set." },
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
        unlock: { fr: "🔓 Aucune action de déblocage : même logique que les runes, le compteur suit les sigils légendaires liés au compte. ⚠ Même correctif rétroactif en passant à l'Arche du Lion ou à la Wizard's Tower si le compteur ne bouge pas.", en: "🔓 No unlock step: same as runes, the counter tracks account-bound legendary sigils. ⚠ Same retroactive fix by visiting Lion's Arch or the Wizard's Tower if the counter doesn't move." },
        tip: { fr: "Compteur de sigils liés au compte (max 8 : 2 sets d'armes terrestres + aquatique). 2 à 4 couvrent l'essentiel. ⚠ Plus cher que les runes : 30 trèfles mystiques et 50 jetons de fournisseur PAR sigil, contre 20 trèfles pour une rune. Quatre sigils, c'est 120 trèfles à eux seuls — sans plafond hebdomadaire, mais 360 écus mystiques et 360 éclats spirituels derrière. 💡 Aucun légendaire du tracker n'en dépend — c'est du confort pur, à faire passer après tout le reste, mais dont les ingrédients s'accumulent en fond.", en: "Account-bound sigil counter (max 8: 2 land weapon sets + aquatic). 2-4 cover most needs." },
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
        bitTips: {"0": {"fr": "Les 8 dons de matériaux (étapes 1 à 8) consomment chacun 450 matériaux T1-T6. C'est le poste le plus coûteux : vérifie ton stockage AVANT d'acheter au comptoir.", "en": "The 8 material gifts (steps 1 to 8) each consume 450 T1-T6 materials. This is the costliest item: check your storage BEFORE buying on the trading post."}, "8": {"fr": "Lyhr, à la Tour du sorcier, fabrique ceci à ta place si la discipline te manque — inutile de monter un métier pour la relique.", "en": "Lyhr, at the Wizard's Tower, crafts this for you if you lack the discipline - no need to level a craft for the relic."}, "11": {"fr": "Notes de recherche : obtenues en décomposant des objets fabriqués avec un kit de recherche. Décompose ce que tu produis plutôt que de le vendre.", "en": "Research Notes: obtained by salvaging items crafted with a research kit. Salvage what you produce rather than selling it."}, "12": {"fr": "Essences de chance : recyclage d'équipement raffiné/chef-d'œuvre et de boules d'ectoplasme. À accumuler passivement, ne l'achète pas.", "en": "Essences of Luck: salvaged from fine/masterwork gear and globs of ectoplasm. Accumulate it passively, don't buy it."}, "15": {"fr": "Particules luisantes : recyclage de runes, cachets et reliques. Tes vieilles runes légendaires de remplacement sont la meilleure source.", "en": "Glob of Glimmering Particles: salvaged from runes, sigils and relics. Your old replacement runes are the best source."}},
        unlock: { fr: "🔓 Aucune action de déblocage : checklist de référence des composants, elle se valide au fur et à mesure. Une seule relique légendaire est utile (elle couvre tout le compte). Lyhr, à la Wizard's Tower, assiste le craft si la discipline manque.", en: "🔓 No unlock step: reference checklist of the components, it validates as you go. Only one legendary relic is useful (it covers the whole account). Lyhr, at the Wizard's Tower, can assist the craft if you lack the discipline." },
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
    type: { fr: "Armes (Gen 1/2/3 + Divers)", en: "Weapons (Gen 1/2/3 + Misc)" },
    expansion: "Multi",
    color: "#60a5fa",
    colorDim: "rgba(96,165,250,0.15)",
    icon: "⚔",
    description: { fr: "Armes légendaires — matrice de ciblage par génération (découverte runtime)", en: "Legendary weapons — per-generation targeting matrix (runtime discovery)" },
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
    // Coûts unitaires par génération (Gift of Fortune gen1 / Mystic Tribute gen2 / gen3 = currenciesPerWeapon)
    currenciesPerWeaponByGen: {
      gen1: [
        { id: "clovers",  name: "Mystic Clover",     perUnit: 77,  icon: "MC", apiId: 19675 },
        { id: "ectos",    name: "Glob of Ectoplasm", perUnit: 250, icon: "EC", apiId: 19721 },
        { id: "obsidian", name: "Obsidian Shard",    perUnit: 250, icon: "OS", apiId: 19925 },
      ],
      gen2: [
        { id: "clovers",  name: "Mystic Clover",     perUnit: 77,  icon: "MC", apiId: 19675 },
        { id: "coins",    name: "Mystic Coin",       perUnit: 250, icon: "MO", apiId: 19976 },
        { id: "obsidian", name: "Obsidian Shard",    perUnit: 250, icon: "OS", apiId: 19925 },
      ],
      other: [
        { id: "clovers",  name: "Mystic Clover",     perUnit: 38,  icon: "MC", apiId: 19675 },
      ],
    },
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

  perfected_envoy: {
    id: "perfected_envoy",
    name: "Perfected Envoy Armor",
    type: { fr: "Set d'armure", en: "Armor set" },
    expansion: "HoT",
    color: "#f87171",
    colorDim: "rgba(248,113,113,0.15)",
    icon: "⬢",
    description: { fr: "Armure légendaire — Raids (Forsaken Thicket). Skins animés uniques par poids.", en: "Legendary Armor — Raids (Forsaken Thicket). Unique animated skins per weight." },
    resetType: "weekly",
    isArmorSet: true,
    isGuideTrinket: true,
    pieces: 6,
    armoryApiIds: [80578, 80435, 80254, 80205, 80277, 80296, 80701, 80248, 80825, 80161, 80458, 80190, 80356, 80557, 80243, 80111, 80145, 80512],
    slots: ["head", "shoulders", "chest", "gloves", "legs", "boots"],
    weights: ["Light", "Medium", "Heavy"],
    // Coûts par pièce — "required" calculé dynamiquement selon l'objectif (1er set ; +25 LI/pièce via Insignia pour les suivants)
    currenciesPerPiece: [
      { id: "li",          name: "Legendary Insight", perPiece: 25, icon: "LI", apiId: 70 },
      { id: "shards",      name: "Obsidian Shard",    perPiece: 50, icon: "OS", apiId: 19925 },
      { id: "clovers",     name: "Mystic Clover",     perPiece: 15, icon: "MC", apiId: 19675 },
      { id: "provisioner", name: "Provisioner Token", perPiece: 50, icon: "PT", apiId: 29 },
    ],
    currencies: [],
    requirements: {
      unit: { fr: "pièce", en: "piece" }, unitTotal: 6,
      perStep: [{ key: "envoy_1", units: 0 }],
      note: { fr: "⏳ Le vrai timegate est le Spirit Weave d'Envoy I : 5 Spirit Threads à 1/semaine sur Gorseval — à lancer dès la première semaine, avant tout le reste.", en: "⏳ The real timegate is Envoy I's Spirit Weave: 5 Spirit Threads at 1/week from Gorseval — start it on week 1, before anything else." },
      lines: [
        { icon: "🧵", label: { fr: "Semaines de Spirit Threads", en: "Spirit Thread weeks" }, fixed: 5, oneShot: "envoy_1",
          detail: { fr: "1 thread/semaine sur Gorseval (W1) · énergiser les 5 au Chak Gerent (méta TD) — taguer les 4 lanes en énergise jusqu'à 4 d'un coup", en: "1 thread/week from Gorseval (W1) · energize all 5 at the Chak Gerent (TD meta) — tagging the 4 lanes energizes up to 4 at once" } },
        { icon: "💡", label: { fr: "Legendary Insights", en: "Legendary Insights" }, perUnit: 25, curKey: "li",
          detail: { fr: "25/pièce · +25 par Envoy Insignia (Glenna) pour les sets suivants", en: "25/piece · +25 per Envoy Insignia (Glenna) for later sets" } },
        { icon: "🎫", label: { fr: "Provisioner Tokens", en: "Provisioner Tokens" }, perUnit: 50, curKey: "provisioner",
          detail: { fr: "Gift of Craftsmanship · achat plafonné quotidiennement", en: "Gift of Craftsmanship · daily-capped purchase" } },
        { icon: "🪨", label: { fr: "Obsidian Shards", en: "Obsidian Shards" }, perUnit: 50, curKey: "shards" },
        { icon: "🍀", label: { fr: "Mystic Clovers", en: "Mystic Clovers" }, perUnit: 15, curKey: "clovers" },
      ],
    },
    raidAchievements: [
      { key: "envoy_1", achievementId: 2646, name: "Envoy Armor I: Experimental Armor",
        unlock: { fr: "🔓 Automatique au premier coffre de victoire de raid (W1–W4). ⏳ Dès la semaine 1, tuer Gorseval pour lancer les Spirit Threads (1/semaine, 5 requis).", en: "🔓 Automatic on your first raid victory chest (W1–W4). ⏳ From week 1, kill Gorseval to start the Spirit Threads (1/week, 5 needed)." },
        tip: { fr: "Débloquée au premier coffer de boss (W1–W4). ⏳ Lancer les Spirit Threads (Gorseval, 1/sem) dès la semaine 1. Récompense : set Experimental — prendre un poids DIFFÉRENT de ton futur légendaire (l'Armory rendrait le même poids obsolète).", en: "Unlocked on your first boss coffer (W1–W4). ⏳ Start the Spirit Threads (Gorseval, 1/wk) on week 1. Reward: Experimental set — pick a DIFFERENT weight than your planned legendary (the Armory would make the same weight obsolete)." },
        bitTips: {
          "Infused Living Crystal": { fr: "Living Crystal : élémentaires de terre dans la grotte à l'est de Nuhoch Lane (Ley-Line Confluence wp, TD) — tuer le groupe, puis celui derrière le mur. Infuser sur un pilier de l'arène APRÈS le kill du Vale Guardian (W1).", en: "Living Crystal: earth elementals in the cave east of Nuhoch Lane (Ley-Line Confluence wp, TD) — kill the group, then the one behind the wall. Infuse on an arena pillar AFTER killing Vale Guardian (W1)." },
          "Infused Soul Mirror": { fr: "Soul Mirror : Burnisher Kengo (temple au nord de Northwatch wp, AB — indisponible pendant certaines phases du méta). Infuser au brasier avant Gorseval (W1) : un porteur garde la torche spectrale sur TOUT le cimetière (down/swap = raté, +1 semaine), puis INTERAGIR avec le brasier (le coffre ne suffit pas).", en: "Soul Mirror: Burnisher Kengo (temple north of Northwatch wp, AB — unavailable during some meta phases). Infuse at the brazier before Gorseval (W1): one carrier keeps the spectral torch through the WHOLE cemetery (down/swap = fail, +1 week), then INTERACT with the brazier (the chest is not enough)." },
          "Tormented Aurillium": { fr: "Acheter Polished Aurillium (Faction Provisioner), puis atteindre 18 stacks de Madness pendant Twisted Castle (W3) avec l'objet utilisé.", en: "Buy Polished Aurillium (any Faction Provisioner), then reach 18 stacks of Madness during Twisted Castle (W3) with the item consumed." },
          "Auric Energy Crystal": { fr: "Energy Crystal : drop du Vale Guardian (W1). L'apporter à l'œuf de Glint (chambre intérieure de Tarir, AB) — transformation automatique.", en: "Energy Crystal: Vale Guardian drop (W1). Bring it to Glint's Egg (Tarir inner chamber, AB) — auto-transforms." },
          "Spirit Weave": { fr: "⏳ 5 Spirit Threads : 1/semaine sur Gorseval (min. 5 semaines — à lancer EN PREMIER). Énergiser au Chak Gerent (méta TD) : taguer les 4 lanes énergise jusqu'à 4 threads en un cycle. 5 énergisés → double-clic.", en: "⏳ 5 Spirit Threads: 1/week from Gorseval (min. 5 weeks — start this FIRST). Energize at Chak Gerent (TD meta): tagging all 4 lanes energizes up to 4 threads in one cycle. 5 energized → double-click." },
          "Coagulated Ectoplasm": { fr: "10 Ectoplasmic Residues → double-clic. Résidus dans les coffres cachés de W1/W2/W3 (spots fixes, cartes sur Hardstuck).", en: "10 Ectoplasmic Residues → double-click. Residues from the hidden chests in W1/W2/W3 (fixed spots, maps on Hardstuck)." },
          "Core of Flame": { fr: "Coffre de Sabetha (W1) après le kill.", en: "Sabetha's chest (W1) after the kill." },
          "Arcane Dust": { fr: "Bloodstone Powder (coffre de Matthias, W2) + Powdered Aurillium (coffre au sommet de la chambre intérieure de Tarir, fin du Sanctum Scramble — accessible en monture sans faire l'aventure). Consommer l'un des deux.", en: "Bloodstone Powder (Matthias coffer, W2) + Powdered Aurillium (chest atop Tarir's inner chamber, Sanctum Scramble end — reachable by mount without the adventure). Consume either." },
          "Mushroom Medley": { fr: "Mushroom Emperor Gills (Champion Mushroom Emperor, Order of Whispers Outpost, TD) + Noxious Mushroom Cap (Slothasor, W2) + 1 Orrian Truffle + 1 Sawgill Mushroom (CP/stock). Les 4 en inventaire → consommer Gills ou Cap.", en: "Mushroom Emperor Gills (Champion Mushroom Emperor, Order of Whispers Outpost, TD) + Noxious Mushroom Cap (Slothasor, W2) + 1 Orrian Truffle + 1 Sawgill Mushroom (TP/storage). All 4 in inventory → consume Gills or Cap." },
          "Giant Beehive": { fr: "W2 : ruche en haut d'un arbre au sud du plan d'eau près du Prison Camp — mini-JP depuis l'arbre au chemin de bois (SO), tir à distance pour la faire tomber, looter dans l'eau.", en: "W2: hive high in a tree south of the water by the Prison Camp — mini-JP from the wooden-path tree (SW), shoot it down with a ranged attack, loot in the water below." },
          "Vial of Forsaken Thicket Waters": { fr: "Après le kill de Matthias (W2), marcher dans une des 4 fontaines du temple — DANS l'instance du kill (rejoindre une autre instance ne compte pas).", en: "After killing Matthias (W2), walk into one of the temple's 4 fountains — IN the kill instance (joining another instance doesn't count)." },
          "Spirit Quest Tonic": { fr: "Se crée en consommant l'un de : Arcane Dust + Mushroom Medley + Giant Beehive + Vial of Forsaken Thicket Waters (les 4 en inventaire).", en: "Created by consuming any of: Arcane Dust + Mushroom Medley + Giant Beehive + Vial of Forsaken Thicket Waters (all 4 in inventory)." },
          "Bloodstone Fragment": { fr: "Loot direct sur Matthias (W2).", en: "Direct loot from Matthias (W2)." },
          "Bloodstone Battery (Charged)": { fr: "Batterie vide : coffre de McLeod (Escort, W3). La charger au socket du 2e étage du Command Center de Rata Novus (TD) — tourelles mortelles si le centre n'est pas repris : traverser vite en monture ou faire l'event chain.", en: "Empty battery: McLeod's chest (Escort, W3). Charge it at the 2nd-floor socket of the Rata Novus Command Center (TD) — deadly turrets if not retaken: rush through on a mount or do the event chain." },
          "Soul of the Keep": { fr: "Stone Soul : Keep Construct (W3). Puis se faire toucher par le Goop d'un Veteran Chak Lobber/Slinger et consommer le Stone Soul SOUS l'effet Goop.", en: "Stone Soul: Keep Construct (W3). Then get hit by a Veteran Chak Lobber/Slinger Goop and consume the Stone Soul WHILE under the Goop effect." },
          "Spirit Strings": { fr: "⚠ Acheter Itzel Spirit Poison (vendeur de maîtrise Itzel/Xochitl : 100 Airship Parts + 1 po) et l'avoir ACTIF en ouvrant le coffer de Keep Construct (pas le coffre d'environnement). Oubli = +1 semaine.", en: "⚠ Buy Itzel Spirit Poison (Itzel mastery vendor/Xochitl: 100 Airship Parts + 1 g) and have it ACTIVE when opening Keep Construct's coffer (not the environmental chest). Miss it = +1 week." },
          "Blood-Stone Infused Ectoplasm": { fr: "Un des 3 coffres cachés du Twisted Castle (W3) — lootable même instance clear ; plus simple en planant après l'encounter.", en: "Any of the 3 hidden chests in Twisted Castle (W3) — lootable even in a cleared instance; easier gliding after the encounter." },
          "White Mantle Ritual Goblet": { fr: "Coffre de Xera (W3) après le kill.", en: "Xera's chest (W3) after the kill." },
        }, },
      { key: "envoy_2", achievementId: 3012, name: "Envoy Armor II: Refined Armor",
        unlock: { fr: "🔓 Automatique en complétant Envoy Armor I. Le Crystalline Heart (100 Crystalline Ingots) est à crafter AVANT de commencer : il sert à chaque étape.", en: "🔓 Automatic upon completing Envoy Armor I. Craft the Crystalline Heart (100 Crystalline Ingots) BEFORE starting: it's used at every step." },
        tip: { fr: "Un seul Crystalline Heart réutilisé partout — l'activer AVANT chaque boss W4 (et après chaque wipe). Récompense : set Refined = les précurseurs — choisir le poids de TON légendaire, et ⚠ ne jamais stat-swap. Autres poids craftables ensuite (500).", en: "One Crystalline Heart reused everywhere — activate it BEFORE each W4 boss (and after every wipe). Reward: Refined set = the precursors — pick YOUR legendary's weight, and ⚠ never stat-swap. Other weights craftable afterwards (500)." },
        bitTips: {
          "Crystalline Heart": { fr: "100 Crystalline Ingots (craft 500 : 1 Fulgurite [Obsi Shard + Airship Oil + Auric Dust + Ley Line Spark] + Crystalline Ore des Noxious Pods de Dragon's Stand) → Master Craftsman d'armure à l'Arche du Lion. UN SEUL cœur sert pour toutes les étapes (réutilisable).", en: "100 Crystalline Ingots (craft 500: 1 Fulgurite [Obsi Shard + Airship Oil + Auric Dust + Ley Line Spark] + Crystalline Ore from Dragon's Stand Noxious Pods) → Armor Master Craftsman in Lion's Arch. ONE heart is reused for every step." },
          "Vine Heart": { fr: "Utiliser le Cœur après avoir participé au méta Battle for Tarir (AB) — la réussite n'est pas requise.", en: "Use the Heart after participating in the Battle for Tarir meta (AB) — success not required." },
          "Burning Heart": { fr: "Utiliser le Cœur après la fractale Volcanic.", en: "Use the Heart after the Volcanic Fractal." },
          "Frozen Heart": { fr: "Utiliser le Cœur après la fractale Snowblind.", en: "Use the Heart after the Snowblind Fractal." },
          "Windy Heart": { fr: "Se faire toucher par le Wing Buffet d'une wyverne (Patriarche/Legendary en canopée de VB, event Wyvern Cliffs, ou la Matriarche du combat Qadim) puis utiliser le Cœur.", en: "Get hit by a Wyvern's Wing Buffet (Patriarch/Legendary in VB canopy, Wyvern Cliffs event, or the Matriarch during the Qadim fight) then use the Heart." },
          "Sodden Heart": { fr: "Utiliser le Cœur après la fractale Aquatic Ruins.", en: "Use the Heart after the Aquatic Ruins Fractal." },
          "Ley-Infused Heart": { fr: "Dragon's Stand : sous la plateforme n°5 du combat final Mordremoth, utiliser le Cœur depuis le rocher le plus bas.", en: "Dragon's Stand: under platform #5 of the final Mordremoth fight, use the Heart from the lowest rock." },
          "Cultivated Heart": { fr: "Utiliser le Cœur à la Flax Node Farm de The Great Tree (TD, depuis Ogre Camp wp).", en: "Use the Heart at the Flax Node Farm in The Great Tree (TD, from Ogre Camp wp)." },
          "Penitent Heart": { fr: "Utiliser le Cœur simplement dans le Bastion of the Penitent (W4).", en: "Simply use the Heart while inside Bastion of the Penitent (W4)." },
          "Jade Heart": { fr: "⚠ Activer le Cœur AVANT Cairn (W4) et tuer le boss sans être touché par Spatial Manipulation (faire les cercles verts ; down = raté). Le CM force les verts — parfois plus simple. Réactiver après chaque wipe.", en: "⚠ Activate the Heart BEFORE Cairn (W4) and kill the boss without being hit by Spatial Manipulation (do the green circles; going down = fail). The CM forces greens — sometimes easier. Reactivate after each wipe." },
          "Protected Heart": { fr: "Activer le Cœur AVANT Mursaat Overseer (W4) et recevoir le buff Protect au moins une fois — prévenir le joueur Protect, rester près de lui.", en: "Activate the Heart BEFORE Mursaat Overseer (W4) and receive the Protect buff at least once — tell the Protect player, stick with them." },
          "Tormented Heart": { fr: "Activer le Cœur AVANT Samarog (W4) et se faire toucher par l'explosion de Rigom à 1% — demander au groupe de laisser détoner avant de pousser Rigom sous Samarog.", en: "Activate the Heart BEFORE Samarog (W4) and get hit by Rigom's 1% explosion — ask the squad to let him detonate before pushing Rigom under Samarog." },
          "Demonic Heart": { fr: "Activer le Cœur AVANT Deimos (W4) et survivre à tout l'encounter.", en: "Activate the Heart BEFORE Deimos (W4) and survive the whole encounter." },
          "Redeemed Heart": { fr: "Tous les autres cœurs faits : /kneel devant le Tree of Solitude (instance clear acceptée).", en: "All other hearts done: /kneel at the Tree of Solitude (cleared instance is fine)." },
        }, },
    ],
    metas: [],
    bounties: [],
  },
  triumphant_hero: {
    id: "triumphant_hero",
    name: "Triumphant Hero's Armor",
    type: { fr: "Set d'armure", en: "Armor set" },
    expansion: "HoT",
    color: "#fb923c",
    colorDim: "rgba(251,146,60,0.15)",
    icon: "⬟",
    description: { fr: "Armure légendaire — McM. Le plus long timegate : 7 880 tickets (~22 semaines au cap).", en: "Legendary Armor — WvW. The longest timegate: 7,880 tickets (~22 weeks at cap)." },
    resetType: "weekly",
    isArmorSet: true,
    isGuideTrinket: true,
    pieces: 6,
    armoryApiIds: [82902, 82173, 83036, 84629, 83497, 83289, 82437, 82994, 84578, 84110, 82903, 82093, 84176, 82963, 83394, 82456, 82196, 82801],
    slots: ["head", "shoulders", "chest", "gloves", "legs", "boots"],
    weights: ["Light", "Medium", "Heavy"],
    // Coûts par pièce — moyenne tickets (précurseurs 175–350 + 1095 Prowess = 7880/set)
    currenciesPerPiece: [
      { id: "tickets", name: "Skirmish Claim Tickets", perPiece: 1313, icon: "SK", apiId: 26 },
      { id: "memory",  name: "Memory of Battle",       perPiece: 500,  icon: "MB", apiId: 71581 },
      { id: "clovers", name: "Mystic Clover",          perPiece: 15,   icon: "MC", apiId: 19675 },
    ],
    currencies: [],
    requirements: {
      unit: { fr: "pièce", en: "piece" }, unitTotal: 6,
      note: { fr: "⚠ Ne jamais stat-swap un précurseur. Variante Mistforged : 9 190 tickets + rang McM requis.", en: "⚠ Never stat-swap a precursor. Mistforged variant: 9,190 tickets + WvW rank required." },
      lines: [
        { icon: "🎟", label: { fr: "Skirmish Claim Tickets", en: "Skirmish Claim Tickets" }, perUnit: 1313, curKey: "tickets",
          detail: { fr: "Précurseur (175 à 350 selon la pièce) + 1 095 pour le Gift of War Prowess", en: "Precursor (175 to 350 depending on the piece) + 1,095 for the Gift of War Prowess" } },
        { icon: "⏳", label: { fr: "Semaines restantes", en: "Weeks left" }, derivedFrom: "tickets", rate: 455,
          detail: { fr: "455/semaine hebdos comprises · l'objectif le plus long du tracker", en: "455/week including weeklies · the longest goal in the tracker" } },
        { icon: "⚔", label: { fr: "Memories of Battle", en: "Memories of Battle" }, perUnit: 500, curKey: "memory" },
        { icon: "🍀", label: { fr: "Mystic Clovers", en: "Mystic Clovers" }, perUnit: 15, curKey: "clovers" },
      ],
    },
    wvwActivities: [
      { id: "skirmish", name: { fr: "Piste de récompenses d'escarmouche", en: "Skirmish Reward Track" }, icon: "SR",
        limit: { fr: "365 tickets/semaine → ~22 semaines pour un set", en: "365 tickets/week → ~22 weeks for one set" }, resetDay: "Lundi",
        tip: { fr: "LE goulot. Participation Gold+ pour maximiser les pips. Mêmes tickets que Strife Unending — planifier l'ordre.", en: "THE bottleneck. Gold+ participation to maximize pips. Same tickets as Strife Unending — plan the order." } },
      { id: "weeklies", name: { fr: "Hebdomadaires McM", en: "WvW Weeklies" }, icon: "WK",
        limit: { fr: "~90 tickets bonus/semaine", en: "~90 bonus tickets/week" }, resetDay: "Lundi",
        tip: { fr: "Compléter les objectifs hebdomadaires McM (menu Succès → McM).", en: "Complete WvW weekly objectives (Achievements → WvW menu)." } },
      { id: "reward_tracks", name: { fr: "Reward tracks : Triumphant → WvW Exclusives", en: "Reward tracks: Triumphant → WvW Exclusives" }, icon: "RT",
        limit: { fr: "Prérequis skins T1 avant achat des précurseurs", en: "T1 skin prereq before buying precursors" }, resetDay: "Passif",
        tip: { fr: "Débloquer chaque skin Triumphant (T1) via les tracks — condition d'achat du précurseur élevé correspondant.", en: "Unlock each Triumphant (T1) skin via the tracks — purchase condition for the matching ascended precursor." } },
      { id: "memories", name: { fr: "Memories of Battle (3 000/set)", en: "Memories of Battle (3,000/set)" }, icon: "MB",
        limit: { fr: "Coffres d'escarmouche + TP", en: "Skirmish chests + TP" }, resetDay: "Passif",
        tip: { fr: "250/précurseur + 250/Gift of War Dedication. Complément achetable au TP si pressé.", en: "250/precursor + 250/Gift of War Dedication. Top up on the TP if in a hurry." } },
    ],
    metas: [],
    bounties: [],
  },
  ardent_glorious: {
    id: "ardent_glorious",
    name: "Ardent Glorious Armor",
    type: { fr: "Set d'armure", en: "Armor set" },
    expansion: "HoT",
    color: "#38bdf8",
    colorDim: "rgba(56,189,248,0.15)",
    icon: "⬠",
    description: { fr: "Armure légendaire — PvP (ligues classées). Timegate saisonnier : ~3 saisons au cap.", en: "Legendary Armor — PvP (ranked leagues). Seasonal timegate: ~3 seasons at cap." },
    resetType: "weekly",
    isArmorSet: true,
    isGuideTrinket: true,
    pieces: 6,
    armoryNamePrefix: "Ardent Glorious", // 18 IDs découverts au runtime (/v2/legendaryarmory + /v2/items)
    slots: ["head", "shoulders", "chest", "gloves", "legs", "boots"],
    weights: ["Light", "Medium", "Heavy"],
    // Coûts par pièce — set : 3200 Shards (2400 Stars of Glory + 800 précurseurs) + 300 League Tickets
    currenciesPerPiece: [
      { id: "shards",  name: "Ascended Shards of Glory", perPiece: 534, icon: "SG", apiId: 33 },
      { id: "tickets", name: "PvP League Ticket",        perPiece: 50,  icon: "LT", apiId: 30 },
      { id: "clovers", name: "Mystic Clover",            perPiece: 15,  icon: "MC", apiId: 19675 },
    ],
    currencies: [],
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
  endless_summer: {
    id: "endless_summer",
    name: "Endless Summer",
    type: { fr: "Anneau", en: "Ring" },
    expansion: "VoE",
    color: "#fbbf24",
    colorDim: "rgba(251,191,36,0.15)",
    icon: "ES",
    description: { fr: "Anneau légendaire — Castora (thème Zintl/dieu-soleil). Rachetable chez Palak pour un 2e exemplaire.", en: "Legendary ring — Castora (Zintl/sun-god theme). Re-purchasable from Palak for a 2nd copy." },
    resetType: "daily",
    isGuideTrinket: true,
    currencies: [
      { id: "sap",      name: "Aether-Rich Sap",      required: 500, icon: "AS", apiId: 83 },
      { id: "ducat",    name: "Antiquated Ducat",     required: 500, icon: "AD", apiId: 81 },
      { id: "obsidian", name: "Obsidian Shard",       required: 250, icon: "OS", apiId: 19925 },
      { id: "gems",     name: "Amalgamated Gemstone", required: 250, icon: "AG", apiId: 68063 },
      { id: "clovers",  name: "Mystic Clover",        required: 10,  icon: "MC", apiId: 19675 },
    ],
    raidAchievements: [
      { key: "summer_krait", achievementId: 9180, name: "Helping Hylek: Kill Krait",
        unlock: { fr: "🔓 Parler à Hylek Amini, au nord-est d'Eztlitl Grounds [&BEoCAAA=], pour ouvrir la chaîne du Gift of the Hylek.", en: "🔓 Talk to Hylek Amini, northeast of Eztlitl Grounds [&BEoCAAA=], to open the Gift of the Hylek chain." },
        tip: { fr: "Prérequis : parler à Hylek Amini (NE d'Eztlitl Grounds [&BEoCAAA=]), puis tuer 25 kraits au lac Nonmoa ou terminer l'événement de la Sorcière krait. 💡 Compteur de kills, pas une collection : rien à ramasser, rien à rapporter. L'événement fait tomber le compteur bien plus vite que les kills isolés — s'il est disponible, prends-le. ⚠ Sans parler à Amini d'abord, les kraits tués ne comptent pas.", en: "Prereq: talk to Hylek Amini (NE of Eztlitl Grounds [&BEoCAAA=]), then kill 25 krait at Nonmoa Lake or complete the Krait Witch event. 💡 A kill counter, not a collection: nothing to pick up, nothing to hand in. The event burns the counter far faster than lone kills — take it if it is up. ⚠ Without talking to Amini first, killed krait do not count." } },
      { key: "summer_sungod", achievementId: 9183, name: "Radiance of the Sun God", total: 20,
        bitTips: {"0": {"fr": "Le chamane Palak, à la Rive aux épaves, ouvre toute la chaîne. Les 19 étapes suivantes sont linéaires.", "en": "Shaman Palak, at Shipwreck Strand, opens the whole chain. The following 19 steps are linear."}, "1": {"fr": "⚠ Tequatl le Sans-soleil : boss de monde à horaire fixe et à forte affluence. C'est le seul vrai timegate de la collection — cale-le en premier sur le timer.", "en": "⚠ Tequatl the Sunless: fixed-schedule, high-population world boss. It's the collection's only real timegate - slot it in first using the timer."}, "9": {"fr": "Les steaks de libellule s'achètent chez le cuisinier hylek au Marais michéen. Achète-les avant de traverser la carte, l'étape 11 suit immédiatement.", "en": "The dragonfly steaks are sold by the hylek cook at Mickelson's Marsh. Buy them before crossing the map, step 11 follows immediately."}, "14": {"fr": "Énigme des zones dans le réacteur de l'Enqueste — la seule étape qui demande de la réflexion plutôt que du déplacement. Prévois du temps.", "en": "Zone puzzle in the Inquest reactor - the only step that asks for thought rather than travel. Set aside some time."}},
        unlock: { fr: "🔓 Terminer l'étape krait, puis parler à Shaman Palak (falaise au NE de Hullgarden Pier [&BMwPAAA=]). Il rachète aussi le Gift of the Hylek pour un 2e anneau.", en: "🔓 Finish the krait step, then talk to Shaman Palak (cliff NE of Hullgarden Pier [&BMwPAAA=]). He also re-sells the Gift of the Hylek for a 2nd ring." },
        tip: { fr: "Chaîne ~20 étapes avec Shaman Palak (falaise NE de Hullgarden Pier [&BMwPAAA=]) : shards à travers Tyrie (mini-donjon Tears of Itlaocol, puzzle Infinite Coil Reactor, JP Hidden Garden…). Récompense : Gift of the Hylek (rachetable chez Palak pour un 2e anneau).", en: "~20-step chain with Shaman Palak (cliff NE of Hullgarden Pier [&BMwPAAA=]): shards across Tyria (Tears of Itlaocol mini-dungeon, Infinite Coil Reactor puzzle, Hidden Garden JP…). Reward: Gift of the Hylek (re-purchasable from Palak for a 2nd ring)." } },
      { key: "selachi_shipwreck", achievementId: 8880, metaSubs: true, name: "Shipwreck Strand Mastery",
        unlock: { fr: "🔓 Aucune action de déblocage : progression liée aux succès de Shipwreck Strand (déplier pour la liste). 36 requis pour la récompense de maîtrise — partagé avec Selachimorpha, aucun double effort.", en: "🔓 No unlock step: progress tied to Shipwreck Strand achievements (expand for the list). 36 required for the mastery reward — shared with Selachimorpha, no duplicated effort." },
        tip: { fr: "36 succès requis (sur ~53). Débloque l'achat du composant clé chez le vendeur (500 monnaie de carte + 250 po + 300k karma) + récompense mastery. Partagé avec Selachimorpha.", en: "36 achievements required (of ~53). Unlocks the key component purchase from the vendor (500 map currency + 250 g + 300k karma) + mastery reward. Shared with Selachimorpha." } },
      { key: "selachi_starlit", achievementId: 9057, metaSubs: true, name: "Starlit Weald Mastery",
        unlock: { fr: "🔓 Aucune action de déblocage : progression liée aux succès de Starlit Weald (déplier pour la liste). 36 requis pour la récompense de maîtrise — partagé avec Selachimorpha, aucun double effort.", en: "🔓 No unlock step: progress tied to Starlit Weald achievements (expand for the list). 36 required for the mastery reward — shared with Selachimorpha, no duplicated effort." },
        tip: { fr: "36 succès requis (sur ~55). Même logique pour le Gift of the People (Canach, Breezy Cay [&BJEPAAA=]). Partagé avec Selachimorpha.", en: "36 achievements required (of ~55). Same logic for the Gift of the People (Canach, Breezy Cay [&BJEPAAA=]). Shared with Selachimorpha." } },
    ],
    metas: [
      { id: "hammerhart", name: { fr: "Rixe des Hammerhart !", en: "Hammerhart Rumble!" }, subname: { fr: "Shipwreck Strand", en: "Shipwreck Strand" }, expansion: "VoE", icon: "HR",
        offsetUTC: 40, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "LFG",
        waypoint: "Hammerhart Battery", wpCode: "[&BHUPAAA=]",
        tip: { fr: "World boss de Shipwreck Strand (Twisting Hollows). Accès rapide : téléporteur « Found » au Pub Canach. CC obligatoire pour percer le dôme initial ; boss jumeaux à barre de vie partagée. Source d'Aether-Rich Sap.", en: "Shipwreck Strand world boss (Twisting Hollows). Quick access: 'Found' teleporter at Pub Canach. Bring CC to burst the initial dome; twin bosses share one health bar. Aether-Rich Sap source." } },
      { id: "weald", name: { fr: "Secrets de la sylve", en: "Secrets of the Weald" }, subname: { fr: "Starlit Weald", en: "Starlit Weald" }, expansion: "VoE", icon: "SW",
        offsetUTC: 100, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "LFG",
        waypoint: "Consecrated Piazza", wpCode: "[&BG8PAAA=]",
        tip: { fr: "Méta de Starlit Weald (Cloister of Stars) : 3 excavateurs simultanés puis Gwyllian. Maîtrise des lignes de force requise (planeur/monture). Source d'Antiquated Ducats.", en: "Starlit Weald meta (Cloister of Stars): 3 simultaneous excavators then Gwyllian. Ley Line mastery required (glider/mount). Antiquated Ducat source." } },
    ],
    bounties: [],
  },
  stella_radians: {
    id: "stella_radians",
    name: "Stella Radians",
    type: { fr: "Accessoire", en: "Accessory" },
    expansion: "VoE",
    color: "#c084fc",
    colorDim: "rgba(192,132,252,0.15)",
    icon: "SR",
    description: { fr: "Accessoire légendaire — Eternity's Garden (mai 2026). Budget ~7M de karma.", en: "Legendary accessory — Eternity's Garden (May 2026). ~7M karma budget." },
    resetType: "daily",
    isGuideTrinket: true,
    currencies: [
      { id: "karma",   name: "Karma",         required: 7000000, icon: "KA", apiId: 2 },
      { id: "coins",   name: "Mystic Coin",   required: 250,     icon: "MO", apiId: 19976 },
      { id: "clovers", name: "Mystic Clover", required: 77,      icon: "MC", apiId: 19675 },
    ],
    raidAchievements: [
      { key: "stella_forge_guard", achievementId: 9330, name: "Forge Guard's Armor Collection", total: 6,
        unlock: { fr: "🔓 Catégorie « Castora » (et non Rare Collections). S'active en débloquant une première pièce Forge Guard. ⚠ Déverrouiller l'apparence d'une pièce la déverrouille pour LES TROIS poids, malgré des noms de skins différents : ne rachète jamais la même pièce dans un autre poids.", en: "🔓 'Castora' category (not Rare Collections). Activates once you unlock a first Forge Guard piece. ⚠ Unlocking one piece's skin unlocks it for ALL THREE weights, despite the different skin names: never rebuy the same piece in another weight." },
        tip: { fr: "5 PS. Déverrouiller les 6 apparences Forge Guard. Achat chez n'importe quel Alliance Field Quartermaster du Jardin de l'Éternité, plein tarif ou réduit avec un jeton. Les jetons ne tombent QUE dans le Jardin de l'Éternité : Heaume via le chapitre « So It Is Written », Épaulières via le miroir magique (Long-Lost Keepsake Box, Obscured Chests), Cuirasse via le succès de maîtrise du Jardin de l'Éternité. Récompense : Don de Repousse, composant du Don de Galdra. ⚠ Ce succès n'est pas exposé par l'API — sa progression ne peut pas être synchronisée automatiquement, coche-la à la main.", en: "5 AP. Unlock all 6 Forge Guard skins. Bought from any Alliance Field Quartermaster in Eternity's Garden, full price or reduced with a token. Tokens drop ONLY in Eternity's Garden: Helmet from the 'So It Is Written' story chapter, Shoulders from the magic mirror (Long-Lost Keepsake Box, Obscured Chests), Cuirass from the Eternity's Garden Mastery achievement. Reward: Gift of Regrowth, a Gift of Galdra component. ⚠ This achievement is not exposed by the API - its progress cannot sync automatically, tick it manually." } },
      { key: "stella_resin", achievementId: 9344, name: "Glimmering Resin Weapon Collector", total: 17,
        bitTips: {"0": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "1": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "2": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "3": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "4": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "5": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "6": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "7": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "8": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "9": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "10": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "11": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "12": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "13": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "14": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "15": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}, "16": {"fr": "17 apparences. Deux voies : fabriquer (Artificier/Chasseur/Forgeron d'armes 400) après avoir acheté la recette chez Historienne Meliza ou Intendant Brizio contre des Fragments de pierre d'ombre — 85 au total pour les 17 ; ou acheter l'arme finie, plus cher. ⚠ Le cœur de renommée doit être fait DU JOUR pour que le vendeur propose quoi que ce soit. Dans les deux cas il faut la version « Résine chromatique » de chaque arme, achetable au comptoir. Fabriquer les 17 : 170 Boules d'ectoplasme + 4 250 Notes de recherche. Les acheter : 204 ectoplasmes + 5 100 Notes + 102 Fragments. Fabriquer est nettement moins cher.", "en": "17 skins. Two routes: craft them (Artificer/Huntsman/Weaponsmith 400) after buying the recipe from Historian Meliza or Steward Brizio for Shadowstone Fragments - 85 total for all 17; or buy the finished weapon, which costs more. ⚠ The renown heart must be completed FOR THE DAY before the vendor offers anything. Either way you need the Chromatic Resin version of each weapon, available on the trading post. Crafting all 17: 170 Globs of Ectoplasm + 4,250 Research Notes. Buying them: 204 ectoplasm + 5,100 Notes + 102 Fragments. Crafting is markedly cheaper."}},
        unlock: { fr: "🔓 Rare Collections : s'active au premier skin Glimmering Resin débloqué. Crafter (recettes chez les vendeurs de cœurs d'Eternity's Garden, base = arme Rare du comptoir) revient moins cher que l'achat direct.", en: "🔓 Rare Collections: activates on your first unlocked Glimmering Resin skin. Crafting (recipes from Eternity's Garden heart vendors, base = Rare weapon from the TP) is cheaper than buying outright." },
        tip: { fr: "Rare Collections — 17 skins d'armes. Recettes/armes chez les vendeurs de cœurs d'Eternity's Garden (base : arme Rare du TP). Le craft économise monnaie de carte + Research Notes vs achat direct. Alternative : reward track VoE (PvP/McM).", en: "Rare Collections — 17 weapon skins. Recipes/weapons from Eternity's Garden heart vendors (base: Rare weapon from TP). Crafting saves map currency + Research Notes vs direct purchase. Alternative: VoE reward track (PvP/WvW)." } },
    ],
    metas: [
      { id: "shackles", name: { fr: "Entraves des Anciens", en: "Shackles of the Ancients" }, subname: { fr: "Eternity's Garden", en: "Eternity's Garden" }, expansion: "VoE", icon: "SA",
        offsetUTC: 70, intervalMin: 120, durationMin: 50,
        efficience: "A", population: "LFG",
        waypoint: "Pilgrim's Rest", wpCode: "[&BPwPAAA=]",
        tip: { fr: "Méta d'Eternity's Garden (heures impaires UTC) : rassemblement à Pilgrim's Rest dès xx:00, lancement xx:10. 3 phases ~15 min : capturer les 3 chambres de la Forge, réparer les conduits, puis Kela et l'All Seer (~xx:35). Boucle de farm principale de la carte (horaire confirmé wiki).", en: "Eternity's Garden meta (odd UTC hours): gather at Pilgrim's Rest from xx:00, starts xx:10. 3 ~15-min phases: capture the 3 Forge chambers, repair the conduits, then Kela and the All Seer (~xx:35). The map's main farm loop (schedule confirmed via wiki)." } },
    ],
    bounties: [],
  },
  orrax_manifested: {
    id: "orrax_manifested",
    name: "Orrax Manifested",
    type: { fr: "Objet de dos", en: "Back item" },
    expansion: "JW",
    color: "#818cf8",
    colorDim: "rgba(129,140,248,0.15)",
    icon: "OM",
    description: { fr: "Dos légendaire — Janthir Wilds (+ skin de planeur, 4 canaux de teinture)", en: "Legendary back item — Janthir Wilds (+ glider skin, 4 dye channels)" },
    resetType: "daily",
    isGuideTrinket: true,
    currencies: [
      { id: "tales",   name: "Tales of Dungeon Delving", required: 500, icon: "TD", apiId: 69 },
      { id: "clovers", name: "Mystic Clover",            required: 38,  icon: "MC", apiId: 19675 },
      { id: "oblige",  name: "Ursus Oblige",             required: 300, icon: "UO", apiId: 76 },
    ],
    raidAchievements: [
      { key: "orrax_mistburned_mastery", achievementId: 8582, metaSubs: true, name: "Mistburned Barrens Mastery",
        unlock: { fr: "🔓 Aucune action de déblocage : la progression avance dès que tu complètes des succès des Landes de Feu-de-Brume. 17 exigés sur 23 éligibles — 6 sont donc facultatifs, et la liste dépliée les trie par effort croissant. 💡 À laisser courir en jouant la carte : rattraper les manquants un par un en fin de parcours coûte bien plus cher.", en: "🔓 No unlock step: progress advances as you complete Mistburned Barrens achievements. 17 required out of 23 eligible — 6 are therefore optional, and the expanded list sorts them by increasing effort. 💡 Let it run while playing the map: hunting the missing ones one by one at the end costs far more." },
        tip: { fr: "Récompense : Saumon de la connaissance, composant du précurseur Orrax Contained. 💡 Rachetable au vendeur de cœur des Landes si tu le détruis — aucun risque de blocage définitif. Avec 6 objectifs facultatifs sur 23, le méta se termine en choisissant les moins coûteux plutôt qu'en visant la complétion.", en: "Reward: Salmon of Knowledge (Orrax Contained precursor component). Re-purchasable from the heart vendor if destroyed." } },
      { key: "orrax_bava_mastery", achievementId: 8769, metaSubs: true, name: "Bava Nisos Mastery",
        unlock: { fr: "🔓 Aucune action de déblocage : progression liée aux succès de Bava Nisos. 10 exigés sur 15 éligibles — c'est le méta le plus court de tout le tracker, 5 facultatifs seulement. ⚠ Plusieurs de ces succès éligibles sont classés par l'API sous « Janthir Side Stories » et non sous Bava Nisos : la liste dépliée est curée depuis le wiki, elle les inclut, mais ne cherche pas à les retrouver par catégorie en jeu.", en: "🔓 No unlock step: progress tied to Bava Nisos achievements. 10 required out of 15 eligible — the shortest meta in the whole tracker, only 5 optional. ⚠ Several of these eligible achievements are filed by the API under 'Janthir Side Stories' rather than Bava Nisos: the expanded list is curated from the wiki and includes them, but do not try to find them by category in game." },
        tip: { fr: "Récompense : Popote de camp askur, composant du précurseur. 💡 Rachetable au vendeur de cœur si tu la détruis. 10 objectifs sur 15 : c'est le méta le plus rapide de l'onglet, à faire en premier pour débloquer le précurseur sans attendre.", en: "Reward: Askur Camping Cookout (precursor component). Re-purchasable from the heart vendor if destroyed." } },
      { key: "orrax_experiments", achievementId: 8761, name: "Unknown Nightmares: Experiments in the Shadows", total: 10,
        bitTips: {"0": {"fr": "Jorvik Jorundsson, dans Bava Nisos, est la clé de tout l'onglet : lui parler ouvre d'un coup les 5 collections de dons.", "en": "Jorvik Jorundsson, in Bava Nisos, is the key to the whole tab: talking to him opens all 5 gift collections at once."}, "1": {"fr": "Deux événements au choix — celui de la Syntri de Janthir est en général plus rapide à trouver que celui des Landes.", "en": "Two events to choose from - the Janthir Syntri one is usually quicker to find than the Barrens one."}, "5": {"fr": "Puzzle de saut « Grotte du cristal du chaos », dans les Marais de fer. Prévois un deltaplane et de la patience.", "en": "'Chaos Crystal Cavern' jumping puzzle, in the Iron Marches. Bring a glider and patience."}, "7": {"fr": "Le bassin de divination est au Panthéon des Hauts Faits — pas dans Janthir. Aller-retour à anticiper.", "en": "The divination pool is in the Hall of Monuments - not in Janthir. Plan the round trip."}, "9": {"fr": "Dernière étape, purement dialoguée : elle valide la collection et débloque le composant de Orrax réprimé.", "en": "Final step, pure dialogue: it validates the collection and unlocks the Orrax Contained component."}},
        unlock: { fr: "🔓 Terminer le chapitre d'histoire « Salvation's Cost » (JW), puis parler à Jorvik Jorundsson au camp de l'Alliance (Bava Nisos, NO de Mantle's Arrival [&BGEPAAA=]) — il débloque les 5 collections d'un coup.", en: "🔓 Complete the 'Salvation's Cost' story chapter (JW), then talk to Jorvik Jorundsson at the Alliance camp (Bava Nisos, NW of Mantle's Arrival [&BGEPAAA=]) — he unlocks all 5 collections at once." },
        tip: { fr: "LA collection active (10 étapes — batterie d'éclairs, portail Godslost Swamp…). Récompense : Binding of the Dragon (composant du précurseur) + titre Transcends Perceptions.", en: "THE active collection (10 steps — lightning battery, Godslost Swamp portal…). Reward: Binding of the Dragon (precursor component) + Transcends Perceptions title." } },
      { key: "orrax_contained", achievementId: 8730, name: "Unknown Nightmares: Orrax Contained",
        bitTips: {"1": {"fr": "Ce composant tombe automatiquement à la fin de « Expériences dans les ombres » — ne le cherche pas ailleurs.", "en": "This component drops automatically at the end of 'Experiments in the Shadows' - don't look for it elsewhere."}, "3": {"fr": "Rachetable en boucle chez le vendeur de cœur de renommée des Landes de Feu-de-Brume : aucun risque de blocage définitif.", "en": "Repeatable from the Mistburned Barrens renown heart vendor: no risk of a permanent block."}, "4": {"fr": "Même filet de sécurité chez la vendeuse de la Garde Sampaguita, dans Bava Nisos.", "en": "Same safety net from the Sampaguita Guard vendor, in Bava Nisos."}},
        unlock: { fr: "🔓 Débloquée par Jorvik Jorundsson (avec les 4 autres). Se valide automatiquement au moment de forger le précurseur Orrax Contained.", en: "🔓 Unlocked by Jorvik Jorundsson (along with the other 4). Auto-completes when you forge the Orrax Contained precursor." },
        tip: { fr: "Se complète en forgeant le précurseur Orrax Contained (Binding of the Dragon + Draconic Tribute + …). Bonus : décoration de homestead.", en: "Auto-completes when forging the Orrax Contained precursor (Binding of the Dragon + Draconic Tribute + …). Bonus: homestead decoration." } },
      { key: "orrax_isles", achievementId: 8743, name: "Unknown Nightmares: Gift of the Mistburned Isles",
        bitTips: {"4": {"fr": "⚠ Maîtrise Érudit des secrets obligatoire. Si elle n'est pas montée, c'est le premier vrai blocage de l'onglet — commence par là.", "en": "⚠ Scholar of Secrets mastery required. If it isn't levelled, this is the tab's first real blocker - start here."}, "5": {"fr": "Fabrication : obsidienne mursaat, pierres de chaleur de Titan, ectoplasme et bois ancien. Armurier 400 requis.", "en": "Crafting: mursaat obsidian, Titan heat stones, ectoplasm and ancient wood. Armorsmith 400 required."}, "9": {"fr": "Complétion de carte de la Côte des basses terres. Les exemplaires supplémentaires s'achètent, donc pas besoin de viser juste du premier coup.", "en": "Lowland Shore map completion. Extra copies can be bought, so no need to get it right first time."}, "10": {"fr": "Idem pour la Syntri de Janthir : complétion de carte, puis rachat chez les cœurs de renommée.", "en": "Same for Janthir Syntri: map completion, then repurchase from the renown hearts."}, "11": {"fr": "Idem pour les Landes de Feu-de-Brume.", "en": "Same for the Mistburned Barrens."}, "12": {"fr": "Idem pour Bava Nisos. Les 4 complétions de carte sont l'essentiel du temps de cette collection — lance-les en fond.", "en": "Same for Bava Nisos. The 4 map completions are most of this collection's time - start them in the background."}},
        unlock: { fr: "🔓 Débloquée par Jorvik Jorundsson. Checklist de référence : se valide au fur et à mesure que tu réunis le gift.", en: "🔓 Unlocked by Jorvik Jorundsson. Reference checklist: validates as you assemble the gift." },
        tip: { fr: "Checklist de référence — se complète en réunissant le gift (monnaies/coffres Mistburned Barrens, Gift of Titan Understanding…).", en: "Reference checklist — completes while assembling the gift (Mistburned Barrens currencies/chests, Gift of Titan Understanding…)." } },
      { key: "orrax_shadows", achievementId: 8723, name: "Unknown Nightmares: Gift of Shadows",
        bitTips: {"3": {"fr": "Vendeurs de pièces inhabituelles des Landes de Feu-de-Brume et de Bava Nisos : les deux vendent la même chose, prends le plus proche.", "en": "Unusual Coin vendors in the Mistburned Barrens and Bava Nisos: both sell the same thing, take the closest."}, "4": {"fr": "Payable en éclats d'esprit à la forge mystique — la ressource que tu accumules sans t'en servir.", "en": "Payable in spirit shards at the Mystic Forge - the resource you accumulate without using."}, "5": {"fr": "Événements des Landes de Feu-de-Brume : farmable en boucle, aucun plafond.", "en": "Mistburned Barrens events: farmable on repeat, no cap."}, "6": {"fr": "Événements de Bava Nisos, même logique. Les deux tombent en faisant les métas de carte.", "en": "Bava Nisos events, same logic. Both drop while doing the map metas."}},
        unlock: { fr: "🔓 Débloquée par Jorvik Jorundsson. Nécessite Armorsmith 400 (recette Gift of Darkness, 10 po) — ou Ward Crafter Lucirae (Astral Ward Moon Camp) contre surcoût.", en: "🔓 Unlocked by Jorvik Jorundsson. Requires Armorsmith 400 (Gift of Darkness recipe, 10 g) — or Ward Crafter Lucirae (Astral Ward Moon Camp) for extra cost." },
        tip: { fr: "Gift of Shadows = Gift of Darkness (Armorsmith 400, recette 10 po) + Gift of Scales + Gift of Titan Understanding + Bloodstone Shard.", en: "Gift of Shadows = Gift of Darkness (Armorsmith 400, 10 g recipe) + Gift of Scales + Gift of Titan Understanding + Bloodstone Shard." } },
      { key: "orrax_feast", achievementId: 8750, name: "Unknown Nightmares: Gift of the Feast",
        bitTips: {"13": {"fr": "Trèfles mystiques : recette forge à ~33 % de réussite, ou achat direct chez les vendeurs d'attaque, de raid ou de fractales. L'achat est plus fiable que la forge.", "en": "Mystic Clovers: Mystic Forge recipe at ~33% success, or direct purchase from strike, raid or fractal vendors. Buying is more reliable than forging."}, "16": {"fr": "250 essences raffinées + 100 prodigieuses + 50 rares, uniquement en chassant les brèches. C'est le poste le plus long de la collection.", "en": "250 refined + 100 prodigious + 50 rare essences, only by hunting rifts. This is the collection's longest item."}, "17": {"fr": "⚠ Timegate de 24 h : achète la graine chez Lahar habile dans ton pavillon DÈS MAINTENANT, elle poussera pendant que tu fais le reste.", "en": "⚠ 24h timegate: buy the seed from Lahar the Skilled in your homestead RIGHT NOW, it will grow while you do the rest."}},
        unlock: { fr: "🔓 Débloquée par Jorvik Jorundsson. Nécessite le node homestead Fruits of the Shadow (Deft Lahar) — à racheter après chaque récolte.", en: "🔓 Unlocked by Jorvik Jorundsson. Requires the Fruits of the Shadow homestead node (Deft Lahar) — re-purchase after each harvest." },
        tip: { fr: "Cuisine + node homestead Fruits of the Shadow (Deft Lahar, à racheter après chaque récolte, 2-4/récolte).", en: "Cooking + Fruits of the Shadow homestead node (Deft Lahar, re-purchase after each harvest, 2-4/harvest)." } },
      { key: "orrax_final", achievementId: 8714, name: "Legendary Backpack and Glider: Orrax",
        bitTips: {"0": {"fr": "Étape unique : lier le sac à dos et le deltaplane au compte. Tout le travail est dans les 5 collections précédentes.", "en": "Single step: bind the backpack and glider to the account. All the work is in the 5 preceding collections."}},
        unlock: { fr: "🔓 Meta finale : se valide au craft du légendaire, une fois les 5 collections Unknown Nightmares terminées.", en: "🔓 Final meta: validates when crafting the legendary, once all 5 Unknown Nightmares collections are done." },
        tip: { fr: "Méta finale (catégorie Collections) — validée au craft du légendaire.", en: "Final meta (Collections category) — validated when crafting the legendary." } },
    ],
    metas: [
      { id: "titanic", name: { fr: "Un voyage titanesque", en: "A Titanic Voyage" }, subname: { fr: "Bava Nisos", en: "Bava Nisos" }, expansion: "JW", icon: "TV",
        offsetUTC: 80, intervalMin: 120, durationMin: 25,
        efficience: "B", population: "LFG",
        waypoint: "Mantle's Arrival", wpCode: "[&BGEPAAA=]",
        tip: { fr: "Méta de Bava Nisos (heures impaires UTC + 20 min). Source de Bava Nisos Shards et progression de la Bava Nisos Mastery. Jorvik Jorundsson (départ des collections Orrax) est au camp de l'Alliance, au NO du waypoint.", en: "Bava Nisos meta (odd UTC hours + 20 min). Bava Nisos Shards source and Bava Nisos Mastery progression. Jorvik Jorundsson (Orrax collections start) is at the Alliance camp, NW of the waypoint." } },
      { id: "mistburned", name: { fr: "Événements Mistburned Barrens", en: "Mistburned Barrens events" }, subname: { fr: "Shards & coffres Mursaat", en: "Shards & Mursaat caches" }, expansion: "JW", icon: "MB",
        isTimeless: true,
        waypoint: "Alliance Staging Ground", wpCode: "[&BFAPAAA=]",
        tip: { fr: "Boucle libre : événements éclair (batterie de la collection, très fréquents au NE du waypoint), coffres Mursaat Ruins (→ Mist Gate Residues), Vials of Titan Melted Liquid Obsidian, 100 Shards de carte. Progresse aussi la Mistburned Mastery.", en: "Free loop: lightning events (collection battery, very frequent NE of the waypoint), Mursaat Ruins caches (→ Mist Gate Residues), Vials of Titan Melted Liquid Obsidian, 100 map Shards. Also progresses the Mistburned Mastery." } },
    ],
    bounties: [],
  },
  ad_infinitum: {
    id: "ad_infinitum",
    name: "Ad Infinitum",
    type: { fr: "Objet de dos", en: "Back item" },
    expansion: "Core",
    color: "#7dd3fc",
    colorDim: "rgba(125,211,252,0.15)",
    icon: "AI",
    description: { fr: "Dos légendaire — Fractales des Brumes (+ skin de planeur). Timegate : ~40 jours de Research Pages.", en: "Legendary back item — Fractals of the Mists (+ glider skin). Timegate: ~40 days of Research Pages." },
    resetType: "daily",
    isGuideTrinket: true,
    currencies: [
      { id: "relics",   name: "Fractal Relic",          required: 4650, icon: "FR", apiId: 7 },
      { id: "pristine", name: "Pristine Fractal Relic", required: 240, icon: "PF", apiId: 24 },
      { id: "clovers",  name: "Mystic Clover",          required: 77,  icon: "MC", apiId: 19675 },
      { id: "coins",    name: "Mystic Coin",            required: 250, icon: "MO", apiId: 19976 },
    ],
    requirements: {
      unit: { fr: "collection", en: "collection" },
      unitTotal: 4,
      perStep: [{ key: "adinf_1", units: 1 }, { key: "adinf_2", units: 1 }, { key: "adinf_3", units: 1 }, { key: "adinf_4", units: 1 }],
      lines: [
        { icon: "📄", label: { fr: "Fractal Research Pages", en: "Fractal Research Pages" }, perUnit: 28, curKey: "pages",
          detail: { fr: "1 Fractal Journal (28 pages, double-clic sur la pile) par collection · 3/jour aux dailies recommandées (T3+), +1 par CM parmi 6 (Kinfall, Nightmare, Shattered, Sunqua, Silent Surf, Lonely Tower) → jusqu'à 9/jour en T4, +8/semaine via la Weekly Fractal Fighter's Cache", en: "1 Fractal Journal (28 pages, double-click the stack) per collection · 3/day from recommended dailies (T3+), +1 per CM out of 6 (Kinfall, Nightmare, Shattered, Sunqua, Silent Surf, Lonely Tower) → up to 9/day at T4, +8/week from the Weekly Fractal Fighter's Cache" } },
        { icon: "⏳", label: { fr: "Jours (dailies seules)", en: "Days (dailies only)" }, perUnit: 10,
          detail: { fr: "28 pages ÷ 3/jour ≈ 10 j par collection. En T4 avec les CM + la cache hebdo : 4-5 j par collection, soit ~16-20 jours au total", en: "28 pages ÷ 3/day ≈ 10 d per collection. At T4 with CMs + the weekly cache: 4-5 d per collection, i.e. ~16-20 days total" } },
        { icon: "⚫", label: { fr: "Balls of Dark Energy", en: "Balls of Dark Energy" }, fixed: 2, curKey: "energy",
          detail: { fr: "Seulement 2 à sourcer soi-même : les recyclages de Finite Result (5) et Upper Bound (9) couvrent le reste", en: "Only 2 to source yourself: salvaging Finite Result (5) and Upper Bound (9) covers the rest" } },
        { icon: "🔮", label: { fr: "Fractal Relics (Prototype)", en: "Fractal Relics (Prototype)" }, fixed: 1350, curKey: "relics", oneShot: "adinf_1",
          detail: { fr: "Prototype Fractal Capacitor chez BUY-4373 · ⚠ ne jamais le recycler, sa version améliorée sert à la collection II", en: "Prototype Fractal Capacitor from BUY-4373 · ⚠ never salvage it, its upgraded version is needed for collection II" } },
      ],
    },
    raidAchievements: [
      { key: "adinf_1", achievementId: 2351,
        bitTips: {"0": {"fr": "Défenseur d'Ascalon : chez BUY-2046 PFR, à l'Observatoire de la Serrure des Brumes, 20 Reliques fractales immaculées.", "en": "Defender of Ascalon: from BUY-2046 PFR, in the Mistlock Observatory, 20 Pristine Fractal Relics."}, "1": {"fr": "Charr-Nip : chez BUY-4373, à l'Observatoire, 100 Reliques fractales + 80 pa.", "en": "Charr-Nip: from BUY-4373, in the Mistlock Observatory, 100 Fractal Relics + 80 s."}, "2": {"fr": "Mote de défi Marécages : activer le mote et finir le fractale Marécages ÉCHELLE 1-20, avec -80 % de soins. Accessible dès maintenant à ton niveau.", "en": "Swampland Challenge Mote: activate the mote and clear the Swampland fractal at SCALE 1-20, with an 80% healing reduction. Reachable at your current level."}, "3": {"fr": "Mote de défi Ruines aquatiques : même principe, échelle 1-20, -80 % de soins. ⚠ Bug connu : les deux motes sont donnés par le COFFRE final, pense à le looter.", "en": "Aquatic Ruin Challenge Mote: same principle, scale 1-20, 80% healing reduction. ⚠ Known bug: both motes come from the final CHEST, remember to loot it."}, "4": {"fr": "Mote chronométré Kraken de jade : battre la Gueule de jade en moins de 5 minutes, fractale Océan solide échelle 20.", "en": "Jade Kraken Timed Mote: beat the Jade Maw in under 5 minutes, Solid Ocean fractal at scale 20."}, "5": {"fr": "Rapport de recherche ascalonien : chez le Chercheur du Champ de bataille urbain, DANS le fractale, contre un Journal fractal (28 Pages de recherche).", "en": "Ascalonian Fractal Field Research Paper: from the Urban Battlegrounds Field Researcher, INSIDE the fractal, for a Fractal Journal (28 Research Pages)."}, "6": {"fr": "Cœur gelé brûlant : récupérer un Cœur d'élémentaire de glace gigantesque sur le Chef chaman svanir (boss de monde, Contreforts du Voyageur), puis l'imprégner dans le Magma bouillant en fin de fractale Volcanique.", "en": "Burning Frozen Core: get a Gigantic Ice Elemental Core from the Champion Svanir Shaman Chief (world boss, Wayfarer Foothills), then imbue it in the Boiling-Hot Magma at the end of the Volcanic fractal."}, "7": {"fr": "Amas de mousse chargé : ramasser l'Amas de mousse en finissant le fractale Marécages, puis le charger au Réservoir d'énergie de l'Opticalium, en Province de Metrica.", "en": "Charged Clump of Swamp Moss: pick up the Clump of Swamp Moss by clearing the Swampland fractal, then charge it in the Energy Storage Tank at the Opticalium, in Metrica Province."}, "8": {"fr": "Condensateur fractal prototype : chez BUY-4373, 1 350 Reliques fractales. ⚠ NE LE RECYCLE PAS : il doit être conservé et amélioré pour Ad Infinitum II. La chaîne complète consomme 4 Dons d\u2019ascension (500 reliques + 25 immaculées + 20 po chacun) : montée en Élevé, en Bêta infusé, en Condensateur fractal infusé, puis la recette finale. 💡 Le Reliquaire fractal propose le Don à 25 reliques au lieu de 500, environ un jour sur sept — consulte-le quotidiennement, quatre passages te feraient économiser 1 900 reliques. Il s\u2019obtient par le succès « Recyclage élevé » : 6 objets puissants issus du recyclage d\u2019élevé, exactement les recyclages qui te fournissent les Boules d\u2019énergie sombre.", "en": "Prototype Fractal Capacitor: from BUY-4373, 1,350 Fractal Relics. ⚠ DO NOT SALVAGE IT: it must be kept and upgraded for Ad Infinitum II. The full chain consumes 4 Gifts of Ascension (500 relics + 25 pristine + 20 g each): upgrade to Ascended, to Beta Infused, to Fractal Capacitor (Infused), then the final recipe. 💡 The Fractal Reliquary offers the Gift for 25 relics instead of 500, roughly one day in seven — check it daily; four hits would save 1,900 relics. It comes from the 'Ascended Recycling' achievement: 6 powerful items from salvaging ascended gear, the very salvages that give you Balls of Dark Energy."}, "9": {"fr": "Échantillon d'infusion instable : charger une infusion d'agonie +4 au Geyser des Brumes, en fin de fractale Marécages.", "en": "Unstable Magically Charged Infusion Sample: charge a +4 Agony Infusion at the Mist Geyser, at the end of the Swampland fractal."}, "10": {"fr": "Formulaire de recrutement aetherblade : chez le Quartier-maître aetherblade, dans le fractale Capitaine Mai Trin, contre 1 Boule d'énergie sombre (recyclage d'élevé). ⚠ Aucune progression requise dans le fractale : le vendeur est dans une cabane accessible par le chemin derrière le départ.", "en": "Aetherblade Recruitment Form: from the Aetherblade Quartermaster, in the Captain Mai Trin fractal, for 1 Ball of Dark Energy (salvaged from ascended gear). ⚠ No progress needed in the fractal: the vendor sits in a cabin reached by the path behind the start."}},
        unlock: { fr: "🔓 Parler à Kelvei, the Legendary Observer (Mistlock Observatory) → elle donne « Theory of the Finite Result » → DOUBLE-CLIQUER l'item dans l'inventaire pour activer la collection. ⚠ Maîtrise Fractal Attunement requise (donc une extension) pour acheter plusieurs composants.", en: "🔓 Talk to Kelvei, the Legendary Observer (Mistlock Observatory) → she hands 'Theory of the Finite Result' → DOUBLE-CLICK the item in your inventory to activate the collection. ⚠ Fractal Attunement mastery required (so an expansion) to buy several components." },
        tip: { fr: "11 composants fractales. Kelvei (Mistlock Observatory) donne « Theory of… » pour débloquer. Fractal Journal = 28 Research Pages (timegate).", en: "11 fractal components. Kelvei (Mistlock Observatory) hands 'Theory of…' to unlock. Fractal Journal = 28 Research Pages (timegated)." } },
      { key: "adinf_2", achievementId: 2557,
        bitTips: {"0": {"fr": "Foreuse spirale des taupards : chez BUY-2046 PFR, à l'Observatoire, 30 Reliques fractales immaculées.", "en": "Dredge Spiral Drill: from BUY-2046 PFR, in the Mistlock Observatory, 30 Pristine Fractal Relics."}, "1": {"fr": "Boule de feu en fusion : chez BUY-4373, à l'Observatoire, 200 Reliques fractales + 80 pa.", "en": "Glob of Molten Fire: from BUY-4373, in the Mistlock Observatory, 200 Fractal Relics + 80 s."}, "2": {"fr": "Mote de défi Non répertorié : ⚠ ÉCHELLE 36, avec -80 % de soins. C'est ici que ton niveau fractale devient bloquant — il faut avoir débloqué l'échelle 36.", "en": "Uncategorized Challenge Mote: ⚠ SCALE 36, with an 80% healing reduction. This is where your fractal level starts to block - you need scale 36 unlocked."}, "3": {"fr": "Mote de défi Aveugle-neige : échelle 27, -80 % de soins.", "en": "Snowblind Challenge Mote: scale 27, 80% healing reduction."}, "4": {"fr": "Mote chronométré Réacteur Thaumanova : échelle 15, à finir en moins de 20 minutes. Large, aucune course.", "en": "Thaumanova Reactor Timed Mote: scale 15, to be cleared in under 20 minutes. Generous, no rush needed."}, "5": {"fr": "Rapport de recherche Alliance en fusion : contre 1 Journal fractal (28 Pages), auprès du Chercheur de la Fournaise en fusion, sur un chemin OPTIONNEL après le fractale Boss en fusion. Ne quitte pas l'instance trop vite.", "en": "Molten Alliance Field Research Paper: for 1 Fractal Journal (28 Pages), from the Molten Furnace Field Researcher, on an OPTIONAL path after the Molten Boss fractal. Don't leave the instance too quickly."}, "6": {"fr": "Croc de Gueule de jade : récupérer une Vrille de Colèreronce au coffre du Courroux de la vigne (Terres sauvages d'argent), puis l'échanger auprès du Chercheur de jade gelé, en fin de fractale Océan solide.", "en": "Jade Maw Fang: get a Vinewrath Tendril from the Vinewrath Chest (Silverwastes), then trade it with the Frozen Jade Researcher at the end of the Solid Ocean fractal."}, "7": {"fr": "Cœur d'élémentaire de glace pollinisé : Cœur pris sur le Chaman légendaire Lornarr (fractale Aveugle-neige), puis imprégné d'un Nuage de pollen pendant la Brèche, aux Terres sauvages d'argent. ⚠ Récupère le Cœur AVANT de lancer la méta, sinon c'est deux métas au lieu d'une.", "en": "Pollenated Ice Elemental Core: Core taken from Legendary Shaman Lornarr (Snowblind fractal), then imbued with a Luminescent Pollen Cloud during The Breach, in the Silverwastes. ⚠ Get the Core BEFORE starting the meta, otherwise it's two metas instead of one."}, "8": {"fr": "Condensateur fractal bêta (infusé) : c'est ici que sert le Condensateur prototype gardé en collection I. Forge mystique deux fois — d'abord en Élevé (Fiole d'essence des Brumes + Don d'Ascension + 40 Cristaux mystiques ou 240 Pierres philosophales), puis en Bêta infusé (Boule d'essence coagulée + Don d'Ascension + 250 ectoplasmes). Débloqué d'office si tu possèdes déjà un palier supérieur.", "en": "Beta Fractal Capacitor (Infused): this is where the Prototype Capacitor kept from collection I is used. Mystic Forge twice - first to Ascended (Vial of Condensed Mists Essence + Gift of Ascension + 40 Mystic Crystals or 240 Philosopher's Stones), then to Beta Infused (Glob of Coagulated Mists Essence + Gift of Ascension + 250 ectoplasm). Auto-unlocked if you already own a higher tier."}, "9": {"fr": "Échantillon d'infusion faible : charger une infusion d'agonie +6 au Geyser des Brumes, dans le fractale Fournaise en fusion.", "en": "Weak Magically Charged Infusion Sample: charge a +6 Agony Infusion at the Mist Geyser, in the Molten Furnace fractal."}, "10": {"fr": "Manuel aetherblade : chez le Quartier-maître aetherblade (fractale Mai Trin), 2 Boules d'énergie sombre. Recycler Limite finie en rend 5 : 2 pour ce manuel, 2 pour fabriquer Limite supérieure. Aucun achat nécessaire.", "en": "Aetherblade Handbook: from the Aetherblade Quartermaster (Mai Trin fractal), 2 Balls of Dark Energy. Salvaging Finite Result yields 5: 2 for this handbook, 2 to craft Upper Bound. No purchase needed."}},
        unlock: { fr: "🔓 Finir la collection I ne suffit PAS : acheter d'abord la recette du dos Tier 1 chez BUY-4373 et CRAFTER Finite Result. Ensuite seulement, retourner voir Kelvei → « Theory of the Upper Bound » → double-clic.", en: "🔓 Finishing collection I is NOT enough: first buy the Tier 1 back recipe from BUY-4373 and CRAFT Finite Result. Only then return to Kelvei → 'Theory of the Upper Bound' → double-click." },
        tip: { fr: "Recycler Finite Result → 5 Balls of Dark Energy (2 pour l'Aetherblade Handbook, 2 pour forger Upper Bound). Ice Elemental Core AVANT le méta Silverwastes.", en: "Salvage Finite Result → 5 Balls of Dark Energy (2 for the Aetherblade Handbook, 2 to craft Upper Bound). Grab the Ice Elemental Core BEFORE the Silverwastes meta." } },
      { key: "adinf_3", achievementId: 2368,
        bitTips: {"0": {"fr": "Cube de recherche de l'Enqueste sur l'énergie draconique : chez BUY-2046 PFR, à l'Observatoire de la Serrure des Brumes, 40 Reliques fractales immaculées.", "en": "Inquest Dragon Energy Research Cube: from BUY-2046 PFR, in the Mistlock Observatory, 40 Pristine Fractal Relics."}, "1": {"fr": "Essence de Sujet n°2 : chez BUY-4373, à l'Observatoire, 400 Reliques fractales + 80 pa.", "en": "Essence of Subject 2: from BUY-4373, in the Mistlock Observatory, 400 Fractal Relics + 80 s."}, "2": {"fr": "Particule de défi volcanique : activer le mote et finir la fractale Volcanique ÉCHELLE 28, avec -80 % de soins.", "en": "Volcanic Challenge Mote: activate the mote and clear the Volcanic fractal at SCALE 28, with an 80% healing reduction."}, "3": {"fr": "Particule de défi de Flanc de falaise : mote activé, Flanc de falaise ÉCHELLE 46, -80 % de soins. La description de l'objet annonce le palier core (21-50), mais la fractale ne tourne qu'aux échelles 6, 46, 68 et 94 : une seule tombe dans l'intervalle.", "en": "Cliffside Challenge Mote: mote activated, Cliffside at SCALE 46, 80% healing reduction. The item description says core tier (21-50), but the fractal only runs at scales 6, 46, 68 and 94: only one falls in range."}, "4": {"fr": "Particule de défi du boss de la Fusion : finir la fractale Boss en fusion ÉCHELLE 10 en moins de 5 minutes.", "en": "Molten Boss Timed Mote: clear the Molten Boss fractal at SCALE 10 in under 5 minutes."}, "5": {"fr": "Article de recherche sur la fractale de Thaumanova : chez le chercheur DANS le Réacteur de Thaumanova, contre 1 Journal fractal (28 Pages de recherche). C'est le timegate de la collection — 3e des 4 journaux.", "en": "Thaumanova Fractal Field Research Paper: from the researcher INSIDE the Thaumanova Reactor, for 1 Fractal Journal (28 Research Pages). This is the collection's timegate — 3rd of the 4 journals."}, "6": {"fr": "Rapport de bug du Gros Tom (Il est mort) : interagir avec les Restes du golem d'essai de Vexa, dans le puzzle de saut du Labo de Vexa (Rive d'Ardentcœur), sur la plateforme au sud-est → tu reçois le Lecteur de diagnostic. Ni Vexa ni son golem n'ont besoin d'être tués. Ensuite, analyser les restes du Gros Tom en fin de fractale Non répertorié.", "en": "Old Tom's Vital Reading (He's Dead): interact with Vexa's Test-Golem Remains in the Vexa's Lab jumping puzzle (Fireheart Rise), on the platform to the southeast → you get Vexa's Golem Diagnostic Reader. Neither Vexa nor her golem needs to be killed. Then analyse Old Tom's remains at the end of the Uncategorized fractal."}, "7": {"fr": "Trésor perdu de Rabsovich : tuer le champion Rabsovich dans le Complexe souterrain → Clé du casier ; puis ouvrir le Casier de Rabsovich au sud-ouest des Falaises de Bourreloup, zone d'excavation Dociu [&BFgCAAA=].", "en": "Rabsovich's Lost Treasure: kill Champion Rabsovich in the Underground Facility fractal → Rabsovich's Locker Key; then open Rabsovich's Locker southwest of Dredgehaunt Cliffs, Dociu Excavation area [&BFgCAAA=]."}, "8": {"fr": "Condensateur de fractale (infusé) : Forge mystique — le Condensateur fractal bêta (infusé) du palier 2 + 1 Éclat d'essence des Brumes cristallisée + 1 Don d'ascension (500 Reliques fractales chez BUY-4373) + 250 ectoplasmes. ⚠ Ne le recycle PAS maintenant : c'est lui qui fournira plus tard la Boule d'énergie sombre manquante du Diplôme étherlame (collection IV).", "en": "Fractal Capacitor (Infused): Mystic Forge — the tier 2 Beta Fractal Capacitor (Infused) + 1 Shard of Crystallized Mists Essence + 1 Gift of Ascension (500 Fractal Relics from BUY-4373) + 250 Globs of Ectoplasm. ⚠ Do NOT salvage it now: it will later provide the missing Ball of Dark Energy for the Aetherblade Diploma (collection IV)."}, "9": {"fr": "Échantillon d'infusion chargé en magie : charger une infusion d'agonie +8 au Geyser des Brumes d'Aveugle-neige. ⚠ Ne saute pas le combat de la Source élémentaire, sinon le geyser n'apparaît pas ; au lieu d'entrer dans la grotte du boss final, pars vers l'ouest.", "en": "Magically Charged Infusion Sample: charge a +8 Agony Infusion at the Mist Geyser in the Snowblind fractal. ⚠ Don't skip the Elemental Source fight or the geyser won't spawn; instead of entering the final boss cave, head west."}, "10": {"fr": "Manuel de la poignée de main étherlame secrète : chez le Quartier-maître étherlame, fractale Capitaine Mai Trin, contre 3 Boules d'énergie sombre (prises sur les 9 rendues par le recyclage de Limite supérieure). Au lieu d'avancer dans la fractale, redescends la rampe et traverse le campement étherlame.", "en": "Aetherblade Secret Handshake Tutorial Book: from the Aetherblade Quartermaster, Captain Mai Trin fractal, for 3 Balls of Dark Energy (taken from the 9 returned by salvaging Upper Bound). Instead of pushing forward, run back down the ramp and through the Aetherblade encampment."}},
        unlock: { fr: "🔓 Crafter Upper Bound (dos Tier 2), puis retourner voir Kelvei → « Theory of the Unbound » → double-clic. Recycler Finite Result une fois Upper Bound crafté (5 Balls of Dark Energy).", en: "🔓 Craft Upper Bound (Tier 2 back), then return to Kelvei → 'Theory of the Unbound' → double-click. Salvage Finite Result once Upper Bound is crafted (5 Balls of Dark Energy)." },
        tip: { fr: "Recycler Upper Bound → 9 Balls (3 Handshake Book, 5 pour forger Unbound). Récompense : précurseur Unbound — NE PAS recycler.", en: "Salvage Upper Bound → 9 Balls (3 Handshake Book, 5 to craft Unbound). Reward: Unbound precursor — DO NOT salvage." } },
      { key: "adinf_4", achievementId: 2295,
        bitTips: {"0": {"fr": "Cache-œil de pirate étherlame : chez BUY-2046 PFR, à l'Observatoire, 50 Reliques fractales immaculées.", "en": "Aetherblade Pirate Eye Patch: from BUY-2046 PFR, in the Mistlock Observatory, 50 Pristine Fractal Relics."}, "1": {"fr": "Volant d'aéronef étherlame : chez BUY-4373, 600 Reliques fractales + 80 pa.", "en": "Aetherblade Airship Steering Wheel: from BUY-4373, 600 Fractal Relics + 80 s."}, "2": {"fr": "Particule de défi du complexe souterrain : mote activé, Complexe souterrain ÉCHELLE 53, -80 % de soins. ⚠ C'est ici que le palier de fractale redevient bloquant — bien au-dessus de l'échelle 36 exigée en collection II.", "en": "Underground Facility Challenge Mote: mote activated, Underground Facility at SCALE 53, 80% healing reduction. ⚠ This is where fractal scale becomes blocking again — well above the scale 36 required in collection II."}, "3": {"fr": "Particule de défi étherlame : mote activé, fractale Étherlame ÉCHELLE 65, -80 % de soins.", "en": "Aetherblade Challenge Mote: mote activated, Aetherblade fractal at SCALE 65, 80% healing reduction."}, "4": {"fr": "Particule chronométrée de Mai Trin : finir le fractale Capitaine Mai Trin en T4 (échelles 76-100) en moins de 25 minutes. C'est le seul composant qui exige strictement le T4.", "en": "Mai Trin Timed Mote: clear the Captain Mai Trin fractal at T4 (scales 76-100) in under 25 minutes. This is the only component that strictly requires T4."}, "5": {"fr": "Article de recherche sur la fractale étherlame : chez le vendeur du fractale Capitaine Mai Trin, contre 1 Journal fractal (28 Pages de recherche) — le 4e et dernier journal.", "en": "Aetherblade Fractal Field Research Paper: from the vendor in the Captain Mai Trin fractal, for 1 Fractal Journal (28 Research Pages) — the 4th and last journal."}, "6": {"fr": "Omelette de guivre de la jungle (à la Moussu) : tuer la Grande vigne cauchemardesque dans le donjon Tonnelle du crépuscule (premier champion, avant le choix du chemin) → Œuf de guivre de la jungle ; puis le porter à la cabane du Moussu dans le fractale Marécages, accessible par le tunnel de la salle du boss une fois Fleurchasseur tué.", "en": "Jungle Wurm Omelet (Mossman Style): kill the Greater Nightmare Vine in the Twilight Arbor dungeon (first champion, before the path choice) → Jungle Wurm Egg; then bring it to Mossman's hut in the Swampland fractal, reached through the tunnel in the boss room once Bloomhunger is down."}, "7": {"fr": "Massette de l'archidevin chargée : tuer l'Archidevin légendaire dans Flanc de falaise → Massette de l'archidevin ; puis sauter au centre du Réacteur de Thaumanova explosé, en Province de Metrica. ⚠ L'accès à la zone demande une Clé matricielle.", "en": "Charged Archdiviner's Mallet: kill the Legendary Archdiviner in the Cliffside fractal → Archdiviner's Mallet; then jump into the middle of the exploded Thaumanova Reactor in Metrica Province. ⚠ Reaching the area requires a Matrix Key."}, "8": {"fr": "Échantillon d'infusion chargé en magie explosive : charger une infusion d'agonie +10 (artificier 400+ ou HdV) au Geyser des Brumes de Flanc de falaise. Passe la grille de droite en arrivant sur la plateforme du boss final ; elle ne s'ouvre qu'une fois le boss tué.", "en": "Explosive Magically Charged Infusion Sample: charge a +10 Agony Infusion (Artificer 400+ or TP) at the Mist Geyser in the Cliffside fractal. Take the gate on the right as you reach the final boss platform; it only opens once the boss is dead."}, "9": {"fr": "Diplôme étherlame : chez le Quartier-maître étherlame, fractale Capitaine Mai Trin, contre 3 Boules d'énergie sombre. ⚠ Le compte ne tombe pas juste : il en manque 1 après les 9 de Limite supérieure — recycle le Condensateur fractal (infusé) du palier 3 (rend exactement 1 Boule) ou n'importe quel élevé non-anneau.", "en": "Aetherblade Diploma: from the Aetherblade Quartermaster, Captain Mai Trin fractal, for 3 Balls of Dark Energy. ⚠ The maths doesn't quite work out: you're 1 short after the 9 from Upper Bound — salvage the tier 3 Fractal Capacitor (Infused) (yields exactly 1 Ball) or any non-ring ascended item."}, "10": {"fr": "Leçon d'arboriculture : crafter un Don de bois (250 planches de bois vieilli + 250 dur + 250 de sapin + 250 ancien ; recette chez Miyani, chasseur 400), l'avoir dans l'inventaire, finir le Champ de bataille urbain (Capitaine Ashym, n'importe quel palier) puis remettre le Don au Bûcheron ascalonien vétéran, dans le bâtiment qui s'ouvre en fin de fractale. ⚠ Le Don est consommé et non récupérable.", "en": "Lessons in Arbology: craft a Gift of Wood (250 Seasoned + 250 Hard + 250 Elder + 250 Ancient Wood Planks; recipe from Miyani, Huntsman 400), keep it in your inventory, clear the Urban Battleground fractal (Captain Ashym, any tier) then hand the Gift to the Veteran Ascalonian Woodcutter in the building that opens at the end. ⚠ The Gift is consumed and cannot be recovered."}, "11": {"fr": "Leçon de métallurgie : crafter un Don de métal (250 lingots d'orichalque + 250 de mithril + 250 d'acier sombre + 250 de platine ; recette chez Miyani, forgeron d'armes 400), finir la fractale Fournaise en fusion, puis utiliser le Don sur l'Établi de l'armurier taupard — porte latérale de la salle du boss.", "en": "Lessons in Metallurgy: craft a Gift of Metal (250 Orichalcum + 250 Mithril + 250 Darksteel + 250 Platinum Ingots; recipe from Miyani, Weaponsmith 400), clear the Molten Furnace fractal, then use the Gift on the Dredge Weaponsmith's Workbench — side door of the boss room."}, "12": {"fr": "Théorie d'Ad Infinitum : l'item de déblocage compte lui-même comme 13e composant. Kelvei ne le donne qu'après avoir FABRIQUÉ Sans limite — terminer Ad Infinitum III ne suffit pas. Il se coche donc dès l'ouverture de la collection : tu démarres à 1/13.", "en": "Theory of Ad Infinitum: the unlock item itself counts as the 13th component. Kelvei only hands it over after you have CRAFTED Unbound — completing Ad Infinitum III is not enough. It therefore ticks as soon as the collection opens: you start at 1/13."}},
        unlock: { fr: "🔓 Crafter Unbound (dos élevé — discipline 500 : Armorsmith / Leatherworker / Tailor / Weaponsmith / Huntsman / Artificer), puis Kelvei → « Theory of Ad Infinitum » → double-clic. ⚠ NE PAS recycler Unbound : c'est le précurseur final.", en: "🔓 Craft Unbound (ascended back — 500 discipline: Armorsmith / Leatherworker / Tailor / Weaponsmith / Huntsman / Artificer), then Kelvei → 'Theory of Ad Infinitum' → double-click. ⚠ Do NOT salvage Unbound: it's the final precursor." },
        tip: { fr: "13 composants, Théorie d'Ad Infinitum comprise. Le vrai mur d'échelle est ici : Complexe souterrain 53, Étherlame 65, Mai Trin chronométré en T4. Craftez Unbound puis parlez à Kelvei pour débloquer.", en: "13 components, including the Theory of Ad Infinitum. The real scale wall sits here: Underground Facility 53, Aetherblade 65, timed Mai Trin at T4. Craft Unbound then talk to Kelvei to unlock." } },
    ],
    metas: [
      { id: "adinf_dailies", name: { fr: "Dailies fractales recommandées", en: "Recommended fractal dailies" }, subname: { fr: "~3 Research Pages/jour", en: "~3 Research Pages/day" }, expansion: "Core", icon: "FD",
        isTimeless: true,
        waypoint: "Mistlock Observatory", wpCode: "[&BEwGAAA=]",
        tip: { fr: "Le timegate central : chaque Fractal Journal = 28 Research Pages, 4 journaux requis. ~3 pages/jour via les dailies recommandées → ~10 jours par collection.", en: "The core timegate: each Fractal Journal = 28 Research Pages, 4 journals required. ~3 pages/day via recommended dailies → ~10 days per collection." } },
      { id: "adinf_cms", name: { fr: "CM Sunqua / Nightmare / Shattered", en: "Sunqua / Nightmare / Shattered CMs" }, subname: { fr: "+1 page chacun", en: "+1 page each" }, expansion: "Core", icon: "CM",
        isTimeless: true,
        waypoint: "Mistlock Observatory", wpCode: "[&BEwGAAA=]",
        tip: { fr: "Chaque Challenge Mote quotidien rapporte +1 Research Page → jusqu'à 6 pages/jour au total, soit ~5 jours par collection au lieu de 10.", en: "Each daily Challenge Mote grants +1 Research Page → up to 6 pages/day total, i.e. ~5 days per collection instead of 10." } },
      { id: "adinf_kelvei", name: { fr: "Kelvei — débloquer la collection suivante", en: "Kelvei — unlock the next collection" }, subname: { fr: "Mistlock Observatory", en: "Mistlock Observatory" }, expansion: "Core", icon: "KV",
        isTimeless: true,
        waypoint: "Mistlock Observatory", wpCode: "[&BEwGAAA=]",
        tip: { fr: "Après chaque craft de dos (Finite Result → Upper Bound → Unbound), parler à Kelvei pour recevoir la « Theory of… » suivante. Recycler l'ancien dos pour les Balls of Dark Energy (5 puis 9).", en: "After each back craft (Finite Result → Upper Bound → Unbound), talk to Kelvei to receive the next 'Theory of…'. Salvage the old back for Balls of Dark Energy (5 then 9)." } },
    ],
    bounties: [],
  },
  strife_unending: {
    id: "strife_unending",
    name: "Strife Unending",
    type: { fr: "Accessoire", en: "Accessory" },
    expansion: "VoE",
    color: "#60a5fa",
    colorDim: "rgba(96,165,250,0.15)",
    icon: "SU",
    description: { fr: "Accessoire légendaire — exclusif McM (mai 2026). Visuel évolutif selon le killstreak.", en: "Legendary accessory — WvW exclusive (May 2026). Visual evolves with killstreak." },
    resetType: "weekly",
    isGuideTrinket: true,
    currencies: [
      { id: "tickets", name: "Skirmish Claim Tickets", required: 3000, icon: "SK", apiId: 26 },
      { id: "clovers", name: "Mystic Clover",          required: 45,   icon: "MC", apiId: 19675 },
      { id: "memory",  name: "Memory of Battle",       required: 250,  icon: "MB", apiId: 71581 },
    ],
    requirements: {
      unit: { fr: "accessoire", en: "accessory" }, unitTotal: 1,
      note: { fr: "Emblèmes (4 Conqueror / 40 Avenger) acquis passivement en jouant — pas de farm dédié.", en: "Emblems (4 Conqueror / 40 Avenger) accrue passively as you play — no dedicated farm." },
      lines: [
        { icon: "🎟", label: { fr: "Skirmish Claim Tickets", en: "Skirmish Claim Tickets" }, perUnit: 3000, curKey: "tickets" },
        { icon: "⏳", label: { fr: "Semaines restantes", en: "Weeks left" }, derivedFrom: "tickets", rate: 455,
          detail: { fr: "455/semaine hebdos comprises · l'objectif McM le moins cher : le faire avant Triumphant Hero", en: "455/week including weeklies · the cheapest WvW goal: do it before Triumphant Hero" } },
        { icon: "🍀", label: { fr: "Mystic Clovers", en: "Mystic Clovers" }, perUnit: 45, curKey: "clovers" },
        { icon: "⚔", label: { fr: "Memories of Battle", en: "Memories of Battle" }, perUnit: 250, curKey: "memory" },
      ],
    },
    raidAchievements: [
      { key: "strife_mists_research", achievementId: 6933, name: "Mists Research", total: 3,
        bitTips: {"0": {"fr": "Dugan est le point d'entrée. Les 7 lieux suivants sont tous en McM : fais-les en une session, carte par carte.", "en": "Dugan is the entry point. The following 7 locations are all in WvW: do them in one session, map by map."}, "1": {"fr": "Les 7 examens ne demandent aucun combat, seulement d'atteindre le lieu. Un passage en heure creuse suffit — inutile d'attendre un bus.", "en": "The 7 examinations require no combat, only reaching the spot. An off-peak run is enough - no need to wait for a zerg."}},
        unlock: { fr: "🔓 Parler à Dugan (« Hey, what's that strange glow… »), puis communier aux Hero Points McM listés — les compléter d'abord si ce n'est pas fait. Débloque l'achat de la Mistwalker Infusion.", en: "🔓 Talk to Dugan ('Hey, what's that strange glow…'), then commune at the listed WvW Hero Points — complete them first if needed. Unlocks the Mistwalker Infusion purchase." },
        tip: { fr: "Prérequis. Parler à Dugan (« Hey, what's that strange glow… »), puis communier aux Hero Points WvW indiqués (les compléter d'abord). Débloque l'achat de la Mistwalker Infusion.", en: "Prereq. Talk to Dugan ('Hey, what's that strange glow…'), then commune at the listed WvW Hero Points (complete them first). Unlocks the Mistwalker Infusion purchase." } },
      { key: "strife_unending", achievementId: 9244, name: "Mists Research: Strife Unending", total: 10,
        bitTips: {"1": {"fr": "⚠ Le gros morceau : 100 joueurs ennemis tués AVEC une infusion d'arpenteur des Brumes équipée. Équipe-la maintenant, sinon les kills ne comptent pas rétroactivement.", "en": "⚠ The big one: 100 enemy players killed WITH a Mistwalker infusion equipped. Equip it now, otherwise kills don't count retroactively."}, "3": {"fr": "Les 3 objectifs de la lisière des Brumes (forge, autel, atelier) se font en une seule visite si ton équipe tient la carte.", "en": "The 3 Edge of the Mists objectives (forge, altar, workshop) can be done in a single visit if your team holds the map."}, "6": {"fr": "Les 4 captures suivantes couvrent trois cartes différentes. Suis les objectifs de ton serveur plutôt que de forcer une carte précise.", "en": "The next 4 captures span three different maps. Follow your server's objectives rather than forcing a specific map."}},
        unlock: { fr: "🔓 Terminer Mists Research, acheter la Mistwalker Infusion et l'ÉQUIPER : les étapes ne comptent que l'infusion portée.", en: "🔓 Finish Mists Research, buy the Mistwalker Infusion and EQUIP it: steps only count while the infusion is worn." },
        tip: { fr: "10 étapes : 100 kills avec l'infusion équipée, JP Obsidian Sanctum (Phongluamthan), Forge/Altar/Workshop en Edge of the Mists (contrôlés par votre équipe), capture d'un fort ennemi en EBG, Stoic Rampart + Dreadfall Bay + Askalion Hills. Récompense : 2× Gift of the Warclaw.", en: "10 steps: 100 kills with the infusion equipped, Obsidian Sanctum JP (Phongluamthan), Forge/Altar/Workshop in Edge of the Mists (team-controlled), capture an enemy keep in EBG, Stoic Rampart + Dreadfall Bay + Askalion Hills. Reward: 2× Gift of the Warclaw." } },
    ],
    metas: [],
    wvwActivities: [
      { id: "skirmish", name: { fr: "Piste de récompenses d'escarmouche", en: "Skirmish Reward Track" }, icon: "SR",
        limit: { fr: "365 tickets/semaine → ~8 semaines pour 3000", en: "365 tickets/week → ~8 weeks for 3000" }, resetDay: "Lundi",
        tip: { fr: "Le goulot principal. Participation Gold+ pour maximiser les pips ; mêmes tickets que Conflux/Warbringer — prioriser.", en: "The main bottleneck. Gold+ participation to maximize pips; same tickets as Conflux/Warbringer — prioritize." } },
      { id: "weeklies", name: { fr: "Hebdomadaires McM", en: "WvW Weeklies" }, icon: "WK",
        limit: { fr: "~90 tickets bonus/semaine", en: "~90 bonus tickets/week" }, resetDay: "Lundi",
        tip: { fr: "Compléter les objectifs hebdomadaires McM (menu Succès → McM).", en: "Complete WvW weekly objectives (Achievements → WvW menu)." } },
      { id: "mists_research", name: { fr: "Succès « Mists Research » (prérequis)", en: "'Mists Research' achievement (prereq)" }, icon: "MR",
        limit: { fr: "Unique — débloque la Mistwalker Infusion", en: "One-time — unlocks the Mistwalker Infusion" }, resetDay: "Unique",
        tip: { fr: "Parler à Dugan, puis communier aux Hero Points McM indiqués (les compléter d'abord). Voir onglet Guide.", en: "Talk to Dugan, then commune at the listed WvW Hero Points (complete them first). See Guide tab." } },
      { id: "strife_steps", name: { fr: "Succès « Strife Unending » (10 étapes)", en: "'Strife Unending' achievement (10 steps)" }, icon: "ST",
        limit: { fr: "Unique — récompense 2× Gift of the Warclaw", en: "One-time — rewards 2× Gift of the Warclaw" }, resetDay: "Unique",
        tip: { fr: "100 kills avec l'infusion équipée, JP Obsidian Sanctum, structures EotM, fort ennemi en EBG… Détail dans l'onglet Guide.", en: "100 kills with the infusion equipped, Obsidian Sanctum JP, EotM structures, enemy keep in EBG… Details in the Guide tab." } },
      { id: "emblems", name: { fr: "Emblèmes (long terme)", en: "Emblems (long-term)" }, icon: "EM",
        limit: { fr: "Conqueror ×4 (400 objectifs) / Avenger ×40 (4000 kills)", en: "Conqueror ×4 (400 objectives) / Avenger ×40 (4,000 kills)" }, resetDay: "Passif",
        tip: { fr: "Progresse naturellement en jouant — pas de farm dédié nécessaire si le grind tickets est actif.", en: "Progresses naturally through play — no dedicated farm needed while grinding tickets." } },
    ],
    bounties: [],
  },
  trinkets: {
    id: "trinkets",
    name: "Trinkets",
    type: { fr: "Guides ×6", en: "Guides ×6" },
    expansion: "Multi",
    color: "#5eead4",
    colorDim: "rgba(94,234,212,0.15)",
    icon: "◈",
    description: { fr: "Colifichets légendaires restants — guide détaillé par item", en: "Remaining legendary trinkets — detailed per-item guide" },
    resetType: "daily",
    isTrinketTracker: true,
    trinketKeys: TRINKET_GUIDE_KEYS,
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
    tip: { fr: "Coffre du Sorcier (60 AA, 20/saison), Manfred Njallson (30 Magnetite, 15/sem), Dugan McM (5/sem), vendeur de ligue PvP (5/sem), Mystic Forge (~31% de réussite). \u26a0 Plus de Chest of Loyalty depuis 2023.", en: "Wizard's Vault (60 AA, 20/season), Manfred Njallson (30 Magnetite, 15/wk), WvW Dugan (5/wk), PvP league vendor (5/wk), Mystic Forge (~31% success). \u26a0 No Chest of Loyalty since 2023." } },
  { id: "coins", name: "Mystic Coin", required: 250, icon: "MN", apiId: 19976,
    tip: { fr: "Coffre du Sorcier (9 AA, 60/saison), Manfred Njallson (10/sem), Skirmish McM (2 Gold / 4 Diamond, sans plafond), Ley-Line Anomaly (1/j), SAB (3/sem), comptoir. \u26a0 Aucune source de connexion depuis 2023 ; Nikki, Vorri et Zazzl n'en vendent plus.", en: "Wizard's Vault (9 AA, 60/season), Manfred Njallson (10/wk), WvW Skirmish (2 Gold / 4 Diamond, no cap), Ley-Line Anomaly (1/day), SAB (3/wk), TP. \u26a0 No login source since 2023; Nikki, Vorri and Zazzl no longer stock it." } },
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
// Liste de lieux a visiter, partagee par Aurora II et Vision II : meme forme de
// donnees (name, map, waypoint.chat_code, how), donc un seul rendu.
function WaypointList({ items, isDone, copied, onCopy, orderLabel }) {
  return (
    <div>
      {items.map((item, i) => {
        const done = isDone ? isDone(i) : false;
        return (
          <div key={i} style={{ padding: "5px 0", borderBottom: "1px solid rgba(226,201,126,0.04)", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, border: `1px solid ${done ? "#4ade80" : "rgba(52,211,153,0.4)"}`, background: done ? "rgba(74,222,128,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              {done && <span style={{ fontSize: 8, color: "#4ade80" }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: done ? "#4ade80" : "rgba(226,201,126,0.8)" }}>{NX(item.name)}</span>
                <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.1)", borderRadius: 3, padding: "1px 5px" }}>{NX(item.map)}</span>
                {item.wp_order && orderLabel && (
                  <span style={{ fontSize: 9, color: "rgba(251,220,80,0.75)", background: "rgba(251,220,80,0.07)", border: "1px solid rgba(251,220,80,0.22)", borderRadius: 3, padding: "1px 5px" }}>
                    {orderLabel(item.wp_order)}
                  </span>
                )}
                {item.skip_candidate && (
                  <span style={{ fontSize: 9, color: "rgba(248,113,113,0.8)", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 3, padding: "1px 5px" }}>
                    ✂
                  </span>
                )}
                {item.waypoint?.chat_code && (
                  <ChatCode code={item.waypoint.chat_code} copied={copied} onCopy={onCopy} />
                )}
              </div>
              <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>{NX(item.how)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Code de chat d'un point de passage, copiable en un clic — comme sur le wiki.
// La cible de clic doit rester large sur mobile, d'ou le padding.
function ChatCode({ code, copied, onCopy }) {
  if (!code) return null;
  const isMe = copied === code;
  const copy = (e) => {
    e.stopPropagation();
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = code; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {}
      document.body.removeChild(ta);
    };
    try {
      if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(code).catch(fallback);
      else fallback();
    } catch (_) { fallback(); }
    onCopy(code);
  };
  return (
    <span onClick={copy} title={code}
      style={{ cursor: "pointer", userSelect: "all", fontFamily: "monospace", fontSize: 10,
               padding: "2px 6px", borderRadius: 3, whiteSpace: "nowrap",
               background: isMe ? "rgba(74,222,128,0.15)" : "rgba(94,234,212,0.07)",
               border: `1px solid ${isMe ? "rgba(74,222,128,0.5)" : "rgba(94,234,212,0.28)"}`,
               color: isMe ? "#4ade80" : "rgba(94,234,212,0.9)" }}>
      {isMe ? "✓ copié" : code}
    </span>
  );
}

function computeGrandTotal(selectedIds, collectionsByLeg) {
  const cc = SOURCES_DB?.craft_components ?? {};
  // Surcouts conditionnels : meme declaration et meme regle que l'onglet du
  // legendaire. Sans cet appel, le grand total affichait un nombre fige qui
  // ignorait les etapes deja validees.
  // Les onglets grand total et cadences sont des composants a part, sans acces a
  // l'etat des collections : on relit l'instantane persiste plutot que de faire
  // descendre la donnee par props sur deux niveaux.
  const colls = collectionsByLeg ?? (() => {
    try { return JSON.parse(localStorage.getItem("gw2_aurora_collections") ?? "null") ?? {}; }
    catch (_) { return {}; }
  })();
  const pendingExtra = (comp, legId) => {
    let add = 0;
    for (const x of (comp.qty_extras ?? [])) {
      if (x.legendary !== legId) continue;
      const sc = colls[x.sub];
      const done = (b) => sc ? ((sc.done ?? false) || (sc.bits ?? []).includes(b)) : false;
      add += Array.isArray(x.bits)
        ? x.bits.filter(b => !done(b)).length * (x.amountPer ?? 0)
        : (done(x.bit) ? 0 : (x.amount ?? 0));
    }
    return add;
  };
  const legs = SOURCES_DB?.legendaries ?? {};
  const totals = {};
  const expanded = {}; // report des intermediaires, local a cet appel   // compId → qty
  const variable = []; // composants non chiffrables

  for (const [compId, comp] of Object.entries(cc)) {
    const qty = comp.qty ?? {};
    for (const legId of selectedIds) {
      // Armes normales
      if (qty[legId] !== undefined) {
        const val = qty[legId];
        if (typeof val === "number") {
          totals[compId] = (totals[compId] ?? 0) + val + pendingExtra(comp, legId);
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
  // Developpement des intermediaires : un composant dont la quantite est indexee
  // sur un AUTRE composant (10 filigranes par encapsulateur) n'etait compte nulle
  // part, faute d'etre rattache a un legendaire. On propage en cascade, en
  // bornant la profondeur pour qu'une reference circulaire ne boucle pas.
  // L'etat reste LOCAL : l'ecrire sur les objets de SOURCES_DB survivrait d'un
  // appel a l'autre et le second calcul n'ajouterait plus rien.
  // 6 passes : la chaine Vision fait 4 niveaux (encapsulateur, cristal,
  // raffinement, materiau de base) et il faut une passe de plus pour constater
  // la stabilite.
  for (let pass = 0; pass < 6; pass++) {
    const add = {};
    for (const [compId, comp] of Object.entries(cc)) {
      for (const [key, val] of Object.entries(comp?.qty ?? {})) {
        if (typeof val !== "number" || !cc[key]) continue;
        const parent = totals[key] ?? 0;
        if (parent > 0) add[compId] = (add[compId] ?? 0) + val * parent;
      }
    }
    let changed = false;
    for (const [compId, v] of Object.entries(add)) {
      if ((expanded[compId] ?? 0) !== v) {
        totals[compId] = (totals[compId] ?? 0) - (expanded[compId] ?? 0) + v;
        expanded[compId] = v;
        changed = true;
      }
    }
    if (!changed) break;
  }

  return { totals, variable };
}

// ── Composant principal Grand Total ──────────────────────────
// ═══════════════════════════════════════════════════════════════
//  ONGLET CADENCES — ressources plafonnées, cases à cocher qui se
//  réinitialisent seules au reset, et projection de délai.
// ═══════════════════════════════════════════════════════════════

// Reset quotidien 00:00 UTC, reset hebdomadaire lundi 07:30 UTC.
// L'identifiant de période sert de clé de stockage : quand la période
// change, la clé change et les cases repartent à zéro d'elles-mêmes.
function resetPeriods(now = new Date()) {
  const nextDaily = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const dayId = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    .toISOString().slice(0, 10);
  const dow = now.getUTCDay();                 // 0 = dimanche
  const sinceMonday = (dow + 6) % 7;
  let anchor = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - sinceMonday, 7, 30);
  if (now.getTime() < anchor) anchor -= 7 * 86400000;
  const nextWeekly = anchor + 7 * 86400000;
  return {
    dayId, weekId: new Date(anchor).toISOString().slice(0, 10),
    msToDaily: nextDaily - now.getTime(), msToWeekly: nextWeekly - now.getTime(),
  };
}

function fmtDelay(ms) {
  if (ms <= 0) return "—";
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  return h >= 24 ? `${Math.floor(h / 24)}j ${h % 24}h` : `${h}h ${String(m).padStart(2, "0")}m`;
}

// Tous les légendaires ne portent pas de données `qty` (sets d'armure et
// runes/sigils passent par des pseudo-clés « __per_piece »). Les proposer au
// choix donnerait un calcul vide, donc une fausse impression de bug.
const QTY_LEG_IDS = (() => {
  const out = new Set();
  for (const c of Object.values(SOURCES_DB?.craft_components ?? {})) {
    if (c && typeof c === "object") for (const k of Object.keys(c.qty ?? {})) out.add(k);
  }
  return out;
})();

// Un objet rendu comme enfant React fait tomber TOUT l'arbre (page noire).
// Cette barrière contient la casse à l'onglet et affiche la raison, plutôt
// que de laisser l'utilisateur face à un écran vide sans console.
class TabErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ margin: 14, padding: 12, background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.35)", borderRadius: 8, color: "rgba(251,146,60,0.95)", fontSize: "12px" }}>
        <div style={{ fontWeight: 600, marginBottom: 5 }}>⚠ Cet onglet n'a pas pu s'afficher.</div>
        <div style={{ fontSize: "10.5px", opacity: 0.85, fontFamily: "monospace", wordBreak: "break-word" }}>
          {String(this.state.err?.message ?? this.state.err)}
        </div>
        <div style={{ fontSize: "10.5px", marginTop: 6, opacity: 0.7 }}>Le reste du tracker reste utilisable.</div>
      </div>
    );
  }
}

function CadencesTab({ stocks = {} }) {
  const t = useT();
  // La v88 écrivait selected[undefined] (identifiant mal lu) : cette clé fantôme
  // survit dans localStorage, compte pour 1 et ne produit aucun calcul.
  // On ne conserve que des identifiants réellement chiffrables.
  const [selected, setSelected] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("gw2_cad_sel_v1") ?? "{}");
      const clean = {};
      for (const [k, v] of Object.entries(raw)) if (v && QTY_LEG_IDS.has(k)) clean[k] = true;
      return clean;
    } catch (_) { return {}; }
  });
  const [ticks, setTicks] = useState(0);
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_cad_checks_v1") ?? "{}"); } catch (_) { return {}; }
  });
  const [showPicker, setShowPicker] = useState(false);
  const [arb, setArb] = useState(() => {
    try { const a = JSON.parse(localStorage.getItem("gw2_cad_arb_v1") ?? "null"); if (a) return a; } catch (_) {}
    return { coins: 10, clovers: 15 };
  });

  useEffect(() => { const i = setInterval(() => setTicks(x => x + 1), 30000); return () => clearInterval(i); }, []);
  useEffect(() => { try { localStorage.setItem("gw2_cad_sel_v1", JSON.stringify(selected)); } catch (_) {} }, [selected]);
  useEffect(() => { try { localStorage.setItem("gw2_cad_checks_v1", JSON.stringify(checks)); } catch (_) {} }, [checks]);
  useEffect(() => { try { localStorage.setItem("gw2_cad_arb_v1", JSON.stringify(arb)); } catch (_) {} }, [arb]);

  const P = resetPeriods(new Date());
  const cc = SOURCES_DB?.craft_components ?? {};
  const legs = SOURCES_DB?.legendaries ?? {};
  const C = "#e2c97e", D = "rgba(226,201,126,";

  const selectedIds = Object.keys(selected).filter(k => selected[k] && QTY_LEG_IDS.has(k));
  const totals = selectedIds.length ? (computeGrandTotal(selectedIds).totals ?? {}) : {};

  // Une case cochée est valable pour sa période : la clé porte l'identifiant
  // de période, donc une case d'hier n'est plus lue aujourd'hui.
  const ckey = (compId, idx, period) =>
    `${compId}|${idx}|${period === "day" ? P.dayId : period === "week" ? P.weekId : "season"}`;
  const isChecked = (compId, idx, period) => !!checks[ckey(compId, idx, period)];
  const toggleCheck = (compId, idx, period) => setChecks(prev => {
    const k = ckey(compId, idx, period), next = { ...prev };
    if (next[k]) delete next[k]; else next[k] = true;
    return next;
  });

  const rows = Object.entries(cc)
    .filter(([, c]) => c && c.cadence && (c.cadence.sources ?? []).length > 0)
    .map(([id, c]) => {
      const cad = c.cadence;
      const need = totals[id] ?? 0;
      const owned = c.apiId ? (stocks[String(c.apiId)] ?? null) : null;
      const missing = need > 0 && owned !== null ? Math.max(0, need - owned) : null;
      // Débit hebdomadaire plafonné : les sources sans plafond sont exclus
      // du calcul (ils fausseraient une projection de délai).
      let perWeek = 0, hasUncapped = false;
      for (const f of cad.sources) {
        if (f.cap == null) { hasUncapped = true; continue; }
        if (f.period === "week") perWeek += f.cap;
        else if (f.period === "day") perWeek += f.cap * 7;
      }
      const weeks = missing !== null && perWeek > 0 ? Math.ceil(missing / perWeek) : null;
      const nSrc = cad.sources.length, nVer = cad.sources.filter(f => f.verified).length;
      return { id, comp: c, cad, need, owned, missing, perWeek, hasUncapped, weeks, nSrc, nVer };
    })
    .sort((a, b) => (b.missing ?? -1) - (a.missing ?? -1));

  const eta = (w) => {
    const d = new Date(Date.now() + w * 7 * 86400000);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ margin: "12px 14px", padding: "10px 12px", background: `${D}0.04)`, border: `1px solid ${D}0.16)`, borderRadius: 8 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: "11px", color: C }}>
          <div>🌅 {t("cad_daily_reset")} <b>{fmtDelay(P.msToDaily)}</b></div>
          <div>📅 {t("cad_weekly_reset")} <b>{fmtDelay(P.msToWeekly)}</b></div>
        </div>
        <div style={{ marginTop: 6, fontSize: "10px", color: `${D}0.5)`, fontFamily: "'Crimson Text', serif" }}>
          {t("cad_reset_note")}
        </div>
      </div>

      <div style={{ margin: "0 14px 12px" }}>
        <button onClick={() => setShowPicker(!showPicker)}
          style={{ width: "100%", padding: "9px 12px", background: `${D}0.06)`, border: `1px solid ${D}0.22)`, borderRadius: 8, color: C, fontSize: "12px", cursor: "pointer", textAlign: "left" }}>
          🎯 {t("cad_pick")} — <b>{selectedIds.length}</b> {showPicker ? "▾" : "▸"}
        </button>
        {selectedIds.length > 0 && (
          <button onClick={() => setSelected({})}
            style={{ marginTop: 5, padding: "4px 9px", background: "none", border: `1px solid ${D}0.18)`, borderRadius: 6, color: `${D}0.55)`, fontSize: "10px", cursor: "pointer" }}>
            ✕ {t("cad_clear")}
          </button>
        )}
        {showPicker && (
          <div style={{ marginTop: 6, padding: "8px 10px", background: "rgba(0,0,0,0.2)", border: `1px solid ${D}0.14)`, borderRadius: 8, maxHeight: 260, overflowY: "auto" }}>
            {/* Les entrées de SOURCES_DB.legendaries n'ont pas de champ `id` :
                l'identifiant EST la clé du dictionnaire. */}
            {Object.entries(legs)
              .filter(([lid]) => QTY_LEG_IDS.has(lid))
              // `farm` est tantôt une chaîne, tantôt un objet { fr, en } (legendary_rune,
              // legendary_sigil) : sans L() React reçoit un objet en enfant et démonte l'arbre.
              .sort((a, b) => String(L(a[1].farm) ?? "").localeCompare(String(L(b[1].farm) ?? "")) ||
                              String(a[1].name ?? a[0]).localeCompare(String(b[1].name ?? b[0])))
              .map(([lid, l]) => (
              <label key={lid} style={{ display: "flex", alignItems: "center", gap: 7, padding: "3px 0", fontSize: "11px", color: selected[lid] ? C : `${D}0.55)`, cursor: "pointer" }}>
                <input type="checkbox" checked={!!selected[lid]}
                  onChange={() => setSelected(prev => { const n = { ...prev }; if (n[lid]) delete n[lid]; else n[lid] = true; return n; })} />
                <span style={{ flex: 1 }}>{NX(l.name ?? lid)}</span>
                {l.farm && <span style={{ fontSize: "9px", opacity: 0.5, flexShrink: 0 }}>{String(L(l.farm)).slice(0, 18)}</span>}
              </label>
            ))}
          </div>
        )}
      </div>

      {(() => {
        // ── ARBITRAGE MAGNETITE ──
        // Manfred vend Coins et Clovers contre la même devise que consomme
        // Coalescence : le plafond hebdomadaire ne permet pas de tout prendre.
        const mag = cc.magnetite_shard?.cadence?.sources ?? [];
        const budget = mag.find(f => f.isBudget)?.cap ?? 0;
        const coinSrc = (cc.mystic_coin?.cadence?.sources ?? []).find(f => f.magnetite);
        const cloverSrc = (cc.mystic_clover?.cadence?.sources ?? []).find(f => f.magnetite);
        if (!budget || !coinSrc || !cloverSrc) return null;

        const spent = arb.coins * coinSrc.magnetite + arb.clovers * cloverSrc.magnetite;
        const left = budget - spent;
        const magNeed = totals.magnetite_shard ?? 0;
        const magOwned = stocks["28"] ?? null;
        const magLeft = magNeed > 0 && magOwned !== null ? Math.max(0, magNeed - magOwned) : magNeed;
        const weeks = magLeft > 0 && left > 0 ? Math.ceil(magLeft / left) : null;
        const over = spent > budget;

        const Row = ({ label, val, max, cost, onCh }) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: "11px", color: `${D}0.8)` }}>
            <span style={{ flex: 1 }}>{label}</span>
            <input type="range" min={0} max={max} value={val} onChange={e => onCh(Number(e.target.value))} style={{ flex: 1.4, accentColor: "#38bdf8" }} />
            <span style={{ width: 74, textAlign: "right", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
              <b>{val}</b>/{max} · {val * cost}
            </span>
          </div>
        );

        return (
          <div style={{ margin: "0 14px 12px", padding: "10px 12px", background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 8 }}>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#38bdf8", marginBottom: 2 }}>⚖ {t("arb_title")}</div>
            <div style={{ fontSize: "10px", color: `${D}0.5)`, fontFamily: "'Crimson Text', serif", marginBottom: 7 }}>
              {t("arb_intro", { b: budget })}
            </div>
            <Row label={t("arb_coins")} val={arb.coins} max={coinSrc.cap ?? 10} cost={coinSrc.magnetite} onCh={v => setArb(a => ({ ...a, coins: v }))} />
            <Row label={t("arb_clovers")} val={arb.clovers} max={cloverSrc.cap ?? 15} cost={cloverSrc.magnetite} onCh={v => setArb(a => ({ ...a, clovers: v }))} />
            <div style={{ marginTop: 7, paddingTop: 6, borderTop: `1px solid ${D}0.1)`, fontSize: "11.5px", color: over ? "#f87171" : "#4ade80" }}>
              {t("arb_spent", { s: spent, b: budget })} — <b>{t("arb_left", { n: Math.max(0, left) })}</b>
              {over ? " " + t("arb_over", { n: spent - budget }) : ""}
            </div>
            {magNeed > 0 && (
              <div style={{ marginTop: 4, fontSize: "11px", color: `${D}0.75)` }}>
                {t("arb_need", { n: magNeed })}
                {magOwned !== null ? ` · ${t("cad_owned", { n: magOwned })}` : ` · ${t("cad_nostock")}`}
                {weeks !== null ? ` · ${t("arb_weeks", { w: weeks })}` : left <= 0 ? " · " + t("arb_never") : ""}
              </div>
            )}
            <div style={{ marginTop: 5, fontSize: "10px", color: "rgba(74,222,128,0.75)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
              💡 {t("arb_offcap")}
            </div>
          </div>
        );
      })()}

      {rows.map(r => (
        <div key={r.id} style={{ margin: "0 14px 10px", padding: "10px 12px", background: `${D}0.03)`, border: `1px solid ${D}0.14)`, borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: C }}>{r.comp.name}</div>
            <div style={{ fontSize: "10px", color: r.nVer === r.nSrc ? "#4ade80" : r.nVer === 0 ? "rgba(251,146,60,0.85)" : "#e2c97e", flexShrink: 0 }}>
              {r.nVer === r.nSrc ? t("cad_verified", { d: r.cad.sources.find(f => f.checked)?.checked ?? "" })
                : r.nVer === 0 ? t("cad_unverified")
                : t("cad_partial", { a: r.nVer, b: r.nSrc })}
            </div>
          </div>

          {r.need === 0 && selectedIds.length > 0 && (
            <div style={{ marginTop: 4, fontSize: "10.5px", color: `${D}0.4)`, fontStyle: "italic" }}>{t("cad_not_needed")}</div>
          )}
          {r.need > 0 && (
            <div style={{ marginTop: 4, fontSize: "11px", color: `${D}0.75)` }}>
              {t("cad_need", { n: r.need })}
              {r.owned !== null ? ` · ${t("cad_owned", { n: r.owned })}` : ` · ${t("cad_nostock")}`}
              {r.missing !== null ? ` · ${t("cad_missing", { n: r.missing })}` : ""}
            </div>
          )}
          {r.missing !== null && r.missing > 0 && r.perWeek > 0 && (
            <div style={{ marginTop: 3, fontSize: "11px", color: r.cad.verified ? "#4ade80" : `${D}0.45)`, fontStyle: r.cad.verified ? "normal" : "italic" }}>
              {t("cad_eta", { w: r.weeks, p: r.perWeek, d: eta(r.weeks) })}
              {r.hasUncapped ? " " + t("cad_uncapped_note") : ""}
            </div>
          )}

          <div style={{ marginTop: 7, borderTop: `1px solid ${D}0.08)`, paddingTop: 6 }}>
            {r.cad.sources.map((f, i) => {
              const per = f.period, done = isChecked(r.id, i, per);
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, padding: "2px 0", fontSize: "11px" }}>
                  <input type="checkbox" checked={done} onChange={() => toggleCheck(r.id, i, per)} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1, color: done ? "#4ade80" : `${D}0.7)`, textDecoration: done ? "line-through" : "none" }}>
                    <b>{L(f.label)}</b>
                    <span title={f.verified ? `${t("cad_verified", { d: f.checked ?? "" })}` : t("cad_unverified")}
                      style={{ fontSize: "9px", marginLeft: 4, color: f.verified ? "#4ade80" : "rgba(251,146,60,0.8)" }}>
                      {f.verified ? "✓" : "⚙"}
                    </span>
                    <span style={{ opacity: 0.75 }}> — {f.cap == null ? t("cad_nocap") : `${f.cap}/${t("cad_per_" + per)}`}{f.cost ? ` · ${L(f.cost)}` : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedIds.length === 0 && (
        <div style={{ margin: "0 14px", padding: "12px", fontSize: "11px", color: `${D}0.5)`, fontStyle: "italic", fontFamily: "'Crimson Text', serif" }}>
          {t("cad_empty")}
        </div>
      )}
    </div>
  );
}

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
        {(stocks._errors?.length > 0 || stocks._found === 0) && (
          <div style={{ margin: "6px 0", padding: "7px 10px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 6, fontSize: 10, fontFamily: "'Crimson Text', serif", color: "rgba(248,113,113,0.85)", lineHeight: 1.5 }}>
            {t("gt_stock_diag", { f: stocks._found ?? 0, a: stocks._asked ?? 0, s: stocks._sync_source ?? "?" })}
            {(stocks._errors ?? []).map((e, i) => <div key={i} style={{ marginTop: 2 }}>· {e}</div>)}
          </div>
        )}
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
  const [selTrinket, setSelTrinket] = useState(() => {
    try {
      const last = localStorage.getItem("gw2_last_trinket") ?? "";
      if (last.startsWith("guide:") && TRINKET_GUIDE_KEYS.includes(last.slice(6))) return last.slice(6);
    } catch (_) {}
    return TRINKET_GUIDE_KEYS[0];
  });
  const [trinketSteps, setTrinketSteps] = useState(() => {
    try { return (JSON.parse(localStorage.getItem("gw2_trinket_steps") ?? "null") ?? {}); } catch { return {}; }
  });
  const toggleTrinketStep = (sk) => {
    const nx = { ...trinketSteps, [sk]: !trinketSteps[sk] };
    setTrinketSteps(nx);
    try { localStorage.setItem("gw2_trinket_steps", JSON.stringify(nx)); } catch (_) {}
  };
  // Persistance du dernier colifichet consulté (QoL : réouverture du groupe)
  useEffect(() => {
    try {
      if (TRINKET_RICH.includes(selectedLeg)) localStorage.setItem("gw2_last_trinket", selectedLeg);
      else if (selectedLeg === "trinkets") localStorage.setItem("gw2_last_trinket", "guide:" + selTrinket);
    } catch (_) {}
  }, [selectedLeg, selTrinket]);
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

  // ── Prix TP (public) pour les seuils de rentabilité des composants ──
  useEffect(() => {
    const cc = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.craft_components ?? {};
    const S = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.legendaries?.[selectedLeg] ?? {};
    const ids = new Set();
    for (const g of (S.components ?? [])) {
      const t = cc[g]?.tradeoff;
      if (!t) continue;
      if (t.target_api_id) ids.add(t.target_api_id);
      for (const ing of (t.ingredients ?? [])) if (ing.apiId) ids.add(ing.apiId);
    }
    if (ids.size === 0) return;
    fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${[...ids].join(",")}`)
      .then(r => (r.ok ? r.json() : null))
      .then(list => {
        if (!Array.isArray(list)) return;
        const m = {};
        for (const p of list) m[String(p.id)] = { buy: p.buys?.unit_price ?? 0, sell: p.sells?.unit_price ?? 0 };
        setTpPrices(prev => ({ ...prev, ...m }));
      })
      .catch(() => {});
  }, [selectedLeg]);

  // ── Armor sets : rechargement de l'objectif ciblé au changement de set ──
  useEffect(() => {
    if (!LEGENDARIES[selectedLeg]?.isArmorSet) return;
    try { setObsTarget(new Set(JSON.parse(localStorage.getItem(`gw2_${selectedLeg}_target_v1`) ?? "[]"))); }
    catch (_) { setObsTarget(new Set()); }
  }, [selectedLeg]);

  // ── Armor sets : résolution nom/poids/slot des 18 pièces via /v2/items (public, cache par langue) ──
  useEffect(() => {
    if (!LEGENDARIES[selectedLeg]?.isArmorSet) return;
    setObsItems(null); // purge du set précédent (matrice re-résolue par set)
    const ids = LEGENDARIES[selectedLeg].armoryApiIds;
    const namePrefix = LEGENDARIES[selectedLeg].armoryNamePrefix; // découverte runtime si pas d'IDs hardcodés
    const cacheKey = `gw2_${selectedLeg}_items_${lang}_v1`;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) ?? "null");
      if (cached && Object.keys(cached).length > 0 && (!ids || Object.keys(cached).length === ids.length)) { setObsItems(cached); return; }
    } catch (_) {}
    const SLOT_MAP = { Helm: "head", Shoulders: "shoulders", Coat: "chest", Gloves: "gloves", Leggings: "legs", Boots: "boots" };
    const toEntry = (it) => {
      const dt = (it && it.details) ? it.details : {};
      return { name: it.name, weight: dt.weight_class ?? "?", slot: SLOT_MAP[dt.type] ?? (dt.type ?? "?") };
    };
    (async () => {
      try {
        const map = {};
        if (ids && ids.length > 0) {
          const r = await fetch(`https://api.guildwars2.com/v2/items?ids=${ids.join(",")}&lang=${lang}`);
          if (!r.ok) return;
          for (const it of await r.json()) map[String(it.id)] = toEntry(it);
        } else if (namePrefix) {
          // Découverte : /v2/legendaryarmory → /v2/items, filtre Armor + préfixe EN
          const ra = await fetch("https://api.guildwars2.com/v2/legendaryarmory?ids=all");
          if (!ra.ok) return;
          const allIds = (await ra.json()).map(e => e.id);
          const armors = {};
          for (let k = 0; k < allIds.length; k += 150) {
            const chunk = allIds.slice(k, k + 150);
            const ri = await fetch(`https://api.guildwars2.com/v2/items?ids=${chunk.join(",")}&lang=en`);
            if (!ri.ok) continue;
            for (const it of await ri.json()) {
              if (it.type === "Armor" && (it.name ?? "").startsWith(namePrefix)) armors[String(it.id)] = it;
            }
          }
          if (lang !== "en") {
            const dIds = Object.keys(armors);
            for (let k = 0; k < dIds.length; k += 150) {
              const chunk = dIds.slice(k, k + 150);
              const rl = await fetch(`https://api.guildwars2.com/v2/items?ids=${chunk.join(",")}&lang=${lang}`);
              if (rl.ok) for (const it of await rl.json()) map[String(it.id)] = toEntry(it);
            }
          } else {
            for (const [id, it] of Object.entries(armors)) map[id] = toEntry(it);
          }
        } else { return; }
        if (Object.keys(map).length === 0) return;
        setObsItems(map);
        try { localStorage.setItem(cacheKey, JSON.stringify(map)); } catch (_) {}
      } catch (_) {}
    })();
  }, [selectedLeg, lang]);

  // ── Collections : définitions des étapes (bits) via /v2/achievements + résolution items ──
  useEffect(() => {
    const list = LEGENDARIES[selectedLeg]?.raidAchievements;
    if (!list || list.length === 0) return;
    // v106 : on ajoute les métas d'épisode (bit 0 des Masters) pour lire leur seuil
    // réel — dernier palier de tiers[] — au lieu de se fier aux valeurs stockées.
    const masteryIds = [];
    (function collect(o) {
      if (Array.isArray(o)) { o.forEach(collect); return; }
      if (!o || typeof o !== "object") return;
      if (typeof o.mastery_achi_id === "number") masteryIds.push(o.mastery_achi_id);
      for (const v of Object.values(o)) collect(v);
    })((typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.legendaries?.[selectedLeg] ?? {});
    const ids = [...new Set([...list.map(a => a.achievementId), ...masteryIds])];
    // v9 : la clé intègre une empreinte de la liste d'IDs. Sans cela, tout ajout de
    // collection restait invisible derrière un cache créé avant elle (bug v78).
    let sig = 0;
    for (const c of ids.join(",")) sig = ((sig << 5) - sig + c.charCodeAt(0)) | 0;
    // ACH_DEFS_SCHEMA : à incrémenter dès que la FORME de `out` change (tierMax, subs curées…).
    // ⚠ Ne couvre PAS les changements de CONTENU éditorial : ajouter une liste dans
    // meta_eligible ne change pas la forme, et la v113 est restée invisible derrière
    // un cache d'avant la curation. D'où la signature de données ci-dessous, qui rend
    // l'oubli impossible : toute retouche des blocs éditoriaux change la clé.
    // La signature des IDs ne suffit pas : le code peut évoluer à liste constante.
    const ACH_DEFS_SCHEMA = 17; // 17 : `name` ajouté à la charge (le diagnostic affichait le requirement)
    // Signature des données éditoriales injectées dans `out` : listes curées et
    // pièges. Toute modification invalide le cache sans intervention manuelle.
    const SDB = typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {};
    let dsig = 0;
    for (const c of JSON.stringify([SDB?.meta_eligible ?? {}, SDB?.achievement_notes ?? {}])) {
      dsig = ((dsig << 5) - dsig + c.charCodeAt(0)) | 0;
    }
    const cacheKey = `gw2_ach_bits_${selectedLeg}_${lang}_s${ACH_DEFS_SCHEMA}_${(sig >>> 0).toString(36)}_${(dsig >>> 0).toString(36)}`;
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith(`gw2_ach_bits_${selectedLeg}_`) && k !== cacheKey) localStorage.removeItem(k);
      }
    } catch (_) {}
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) ?? "null");
      if (cached && cached.__schema === ACH_DEFS_SCHEMA && cached.defs) { setAchBitsDefs(cached.defs); return; }
    } catch (_) {}
    // Catégories d'achievements : volumineux et stable, mis en cache une fois pour toutes.
    const loadAchCategories = async () => {
      try {
        const c = JSON.parse(localStorage.getItem("gw2_ach_categories_v1") ?? "null");
        if (c) return c;
      } catch (_) {}
      const rc = await fetch("https://api.guildwars2.com/v2/achievements/categories?ids=all");
      if (!rc.ok) return null;
      const full = await rc.json();
      const cats = full.map(c => ({ id: c.id, achievements: (c.achievements ?? []).map(x => (typeof x === "object" ? x.id : x)) }));
      try { localStorage.setItem("gw2_ach_categories_v1", JSON.stringify(cats)); } catch (_) {}
      return cats;
    };
    (async () => {
      try {
        const r = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${ids.join(",")}&lang=${lang}`);
        if (!r.ok) return;
        const defs = await r.json();
        const itemIds = new Set(), skinIds = new Set(), miniIds = new Set();
        for (const d of defs) for (const b of (d.bits ?? [])) {
          if (!b.id) continue;
          if (b.type === "Item") itemIds.add(b.id);
          else if (b.type === "Skin") skinIds.add(b.id);
          else if (b.type === "Minipet") miniIds.add(b.id);
        }
        const names = {};
        const namesEn = {};
        const arr = [...itemIds];
        for (let k = 0; k < arr.length; k += 150) {
          const chunk = arr.slice(k, k + 150);
          const ri = await fetch(`https://api.guildwars2.com/v2/items?ids=${chunk.join(",")}&lang=${lang}`);
          if (ri.ok) for (const it of await ri.json()) names[String(it.id)] = it.name;
          if (lang !== "en") {
            const re = await fetch(`https://api.guildwars2.com/v2/items?ids=${chunk.join(",")}&lang=en`);
            if (re.ok) for (const it of await re.json()) namesEn[String(it.id)] = it.name;
          } else {
            for (const id2 of chunk) namesEn[String(id2)] = names[String(id2)];
          }
        }
        for (const [set, ep, pfx] of [[skinIds, "skins", "s"], [miniIds, "minis", "m"]]) {
          const list = [...set];
          for (let k = 0; k < list.length; k += 150) {
            const chunk = list.slice(k, k + 150);
            const rr = await fetch(`https://api.guildwars2.com/v2/${ep}?ids=${chunk.join(",")}&lang=${lang}`);
            if (rr.ok) for (const o of await rr.json()) names[pfx + String(o.id)] = o.name;
            if (lang !== "en") {
              const re2 = await fetch(`https://api.guildwars2.com/v2/${ep}?ids=${chunk.join(",")}&lang=en`);
              if (re2.ok) for (const o of await re2.json()) namesEn[pfx + String(o.id)] = o.name;
            } else {
              for (const id2 of chunk) namesEn[pfx + String(id2)] = names[pfx + String(id2)];
            }
          }
        }
        const out = {};
        for (const d of defs) {
          // Le seuil d'un meta n'est pas dans "requirement" (l'API en retire le nombre,
          // d'ou le double espace de "Complete all  X achievements") : c'est le dernier palier.
          const tierMax = (d.tiers ?? []).reduce((m, t) => Math.max(m, t.count ?? 0), 0);
          out[String(d.id)] = { bits: d.bits ?? [], names, namesEn, name: d.name ?? "", req: d.requirement ?? "", desc: d.description ?? "", lockedTxt: d.locked_text ?? "", tierMax };
        }
        // Métas AVEC bits Text (metas d'épisode : « Long Live the Lich », « All or Nothing »…) :
        // chaque bit porte le NOM d'un succès enfant. On le résout vers son ID via la catégorie
        // qui contient le méta, afin d'afficher la sous-progression (ex. « 12/24 coffres »).
        // La liste des bits est la liste officielle des objectifs éligibles — pas la catégorie
        // entière, qui contient aussi des succès ne comptant pas pour le méta.
        const textMetas = defs.filter(d => (d.bits ?? []).length > 0 && d.bits.every(b => b.type === "Text" && b.text));
        if (textMetas.length > 0) {
          const cats = await loadAchCategories();
          if (cats) {
            for (const m of textMetas) {
              const cat = cats.find(c => c.achievements.includes(m.id));
              if (!cat) continue;
              const sibIds = cat.achievements.filter(x => x !== m.id);
              const byName = {};
              for (let k = 0; k < sibIds.length; k += 150) {
                const chunk = sibIds.slice(k, k + 150);
                const rs = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${chunk.join(",")}&lang=${lang}`);
                if (rs.ok) for (const s of await rs.json()) byName[s.name] = s.id;
              }
              // Un méta d'épisode a beaucoup d'objectifs ; s'il n'en résout aucun,
              // c'est que ses bits ne désignent pas des succès (collection classique).
              const bitAch = {};
              m.bits.forEach((b, i) => { if (byName[b.text] !== undefined) bitAch[i] = byName[b.text]; });
              if (Object.keys(bitAch).length > 0) out[String(m.id)].bitAch = bitAch;
            }
          }
        }
        // Liste curée (wiki) quand elle existe : c'est la SEULE source exacte des succès
        // éligibles — l'API ne publie ni bits ni liste d'enfants pour ces métas, et la
        // catégorie en contient davantage que le méta n'en exige.
        const curated = ((typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.meta_eligible) ?? {};
        for (const d of defs) {
          const cu = curated[String(d.id)];
          if (!cu || !(cu.achievements ?? []).length) continue;
          out[String(d.id)].subs = cu.achievements.map(([id2, n2]) => ({ id: id2, name: n2 }));
          out[String(d.id)].subsSource = "wiki";
          out[String(d.id)].subsVerified = cu.verified ?? "";
          if (cu.threshold) out[String(d.id)].tierMax = cu.threshold;
        }
        // Les métas déjà curées sont exclues : inutile de télécharger toute leur catégorie.
        const curatedIds = new Set(Object.keys(((typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.meta_eligible) ?? {}));
        const metaIds = new Set(list.filter(a => a.metaSubs).map(a => a.achievementId));
        const metas = defs.filter(d => (d.bits ?? []).length === 0 && metaIds.has(d.id) && !curatedIds.has(String(d.id)));
        if (metas.length > 0) {
          const cats = await loadAchCategories();
          if (cats) {
            for (const m of metas) {
              const cat = cats.find(c => c.achievements.includes(m.id));
              if (!cat) continue;
              // Une catégorie d'épisode LW4 monte à ~112 entrées : plafond à 150.
              const subIds = cat.achievements.filter(x => x !== m.id).slice(0, 150);
              void subIds;
              const subs = [];
              for (let k = 0; k < subIds.length; k += 150) {
                const chunk = subIds.slice(k, k + 150);
                const rs = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${chunk.join(",")}&lang=${lang}`);
                if (rs.ok) for (const s of await rs.json()) subs.push({ id: s.id, name: s.name });
              }
              if (out[String(m.id)].subsSource !== "wiki") { out[String(m.id)].subs = subs; out[String(m.id)].subsSource = "category"; }
            }
          }
        }
        // Détails des succès éligibles : description, volume, prérequis, AP.
        // Tout vient de l'API — aucune saisie éditoriale, donc jamais périmé.
        const curatedSubIds = [...new Set(Object.values(out)
          .filter(d => (d.subs ?? []).length > 0)
          .flatMap(d => d.subs.map(s2 => s2.id)))];
        if (curatedSubIds.length > 0) {
          const info = {};
          for (let k = 0; k < curatedSubIds.length; k += 150) {
            const chunk = curatedSubIds.slice(k, k + 150);
            const rd = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${chunk.join(",")}&lang=${lang}`);
            if (!rd.ok) continue;
            for (const a2 of await rd.json()) {
              const tiers = a2.tiers ?? [];
              const ap = tiers.reduce((m2, t2) => m2 + (t2.points ?? 0), 0);
              const finalCount = tiers.reduce((m2, t2) => Math.max(m2, t2.count ?? 0), 0);
              // Volume réel = le plus grand des deux : nombre d'items à collecter
              // ou palier final du compteur. Les deux se recouvrent souvent.
              const vol = Math.max(finalCount, (a2.bits ?? []).length);
              const prereq = (a2.prerequisites ?? []).length;
              // Score d'effort explicable — volume, verrou de prérequis, et les AP
              // comme approximation de la difficulté (ArenaNet paie cher ce qui est dur).
              const vPts = vol >= 100 ? 3 : vol >= 25 ? 2 : vol >= 8 ? 1 : 0;
              const pPts = prereq > 0 ? 2 : 0;
              const aPts = ap >= 10 ? 3 : ap >= 5 ? 1 : 0;
              const score = vPts + pPts + aPts;
              info[String(a2.id)] = {
                req: a2.requirement ?? "", desc: a2.description ?? "",
                ap, vol, prereq, score, tier: score <= 1 ? "easy" : score <= 3 ? "med" : "hard",
              };
            }
          }
          for (const d of Object.values(out)) {
            if (!(d.subs ?? []).length) continue;
            d.subs = d.subs.map(s2 => ({ ...s2, ...(info[String(s2.id)] ?? {}) }));
          }
        }
        // Métas sans bits (masteries de cartes) : lister les achievements de leur catégorie
        // — uniquement pour les entrées marquées metaSubs (les Collectors n'ont pas d'étapes listables)
        // Détecteur d'angles morts : un succès sans bits dont le palier final dépasse 1
        // est un compteur ; s'il n'a aucune liste d'étapes, il nous manque une source.
        // Se signale tout seul plutôt que de dépendre d'un repérage manuel sur le nom.
        for (const d of defs) {
          const o = out[String(d.id)];
          if (!o || (d.bits ?? []).length > 0 || (o.subs ?? []).length > 0) continue;
          if ((o.tierMax ?? 0) > 1) o.counterNoSteps = true;
        }
        setAchBitsDefs(out);
        // Ne pas figer le cache si une meta attendait ses subs et ne les a pas (retry au prochain montage)
        const subsPending = list.some(a2 => a2.metaSubs && !(out[String(a2.achievementId)]?.subs?.length));
        if (!subsPending) { try { localStorage.setItem(cacheKey, JSON.stringify({ __schema: ACH_DEFS_SCHEMA, defs: out })); } catch (_) {} }
      } catch (_) {}
    })();
  }, [selectedLeg, lang]);

  // ── Statuts des sous-achievements (métas) via Flask ──
  useEffect(() => {
    const allSubs = [];
    for (const d of Object.values(achBitsDefs)) {
      for (const s of (d.subs ?? [])) allSubs.push(s.id);
      for (const id of Object.values(d.bitAch ?? {})) allSubs.push(id);
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
    const cacheKey = `gw2_weapons_items_${lang}_v3`; // v3 : toutes générations (gen1/gen2/gen3/divers)
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
        // Classification par génération : nom EN (stable) + plage d'ID
        const genOf = (idStr, enName) => {
          const n = Number(idStr);
          if ((enName ?? "").startsWith("Aurene's")) return "gen3";
          if (n >= 30684 && n <= 30704) return "gen1";        // les 20 originales + Eternity
          if (n < 95000) return "gen2";                        // HoT→PoF (Astralaria 76158 … Exordium 90551)
          return "other";                                      // Klobjarne Geirr, Aetheric Anchor, futurs
        };
        const all = {};
        for (const [id, v] of Object.entries(map)) {
          all[id] = { ...v, gen: genOf(id, enNames[id]) };
        }
        setWpnItems(all);
        try { localStorage.setItem(cacheKey, JSON.stringify(all)); } catch (_) {}
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
  const [masteryStepsOpen, setMasteryStepsOpen] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [diagOpen, setDiagOpen] = useState(false);
  const [diagAll, setDiagAll] = useState(null);
  const [diagScanning, setDiagScanning] = useState(false);

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
      try { localStorage.setItem(`gw2_${selectedLeg}_target_v1`, JSON.stringify([...next])); } catch (_) {}
      return next;
    });
  }, []);
  const [obsItems, setObsItems] = useState(null);
  const [wpnGen, setWpnGen] = useState(() => {
    try { return localStorage.getItem("gw2_weapons_gen") ?? "gen3"; } catch { return "gen3"; }
  });
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
  const [achManualDone, setAchManualDone] = useState(() => {
    try { return (JSON.parse(localStorage.getItem("gw2_ach_manual_done_v1") ?? "null") ?? {}); } catch { return {}; }
  });
  const toggleAchManual = (k) => {
    const nx = { ...achManualDone, [k]: !achManualDone[k] };
    if (!nx[k]) delete nx[k];
    setAchManualDone(nx);
    try { localStorage.setItem("gw2_ach_manual_done_v1", JSON.stringify(nx)); } catch (_) {}
  };
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
  // Clé API : conservée en mémoire uniquement (jamais persistée — à ressaisir par session)
  const [gtApiKey, setGtApiKey] = useState("");
  useEffect(() => { try { localStorage.removeItem("gw2_gt_apikey"); } catch (_) {} }, []); // purge de l'ancien stockage
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
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tpPrices, setTpPrices] = useState({}); // /v2/commerce/prices — public, CORS ok
  const [gtApiStatus, setGtApiStatus] = useState("idle");
  const [gtApiError, setGtApiError] = useState("");

  // Stocks hybride : {apiId(str) → qty, _synced_at, _sync_source}
  const [gtStocks, setGtStocks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_gt_stocks") ?? "{}"); } catch { return {}; }
  });
  const [gtStockStatus, setGtStockStatus] = useState("idle"); // idle|loading|ok|error
  const [gtStockError, setGtStockError] = useState("");

  const isCadences = selectedLeg === "cadences";
  const isGrandTotal = selectedLeg === "grand_total" || isCadences;
  const leg = isGrandTotal ? null : LEGENDARIES[selectedLeg];
  const isWeekly = leg?.resetType === "weekly";

  // ── Synchro directe GW2 API (CORS) — reconstruit la réponse /api/progression sans Flask ──
  const buildDirectProgressionData = useCallback(async (key) => {
    // access_token en paramètre : le header Authorization fait échouer le preflight CORS
    // sur certains navigateurs (NetworkError) — même mécanisme que le fallback armory.
    const tk = `access_token=${encodeURIComponent(key)}`;
    const [ra, rw, rm, rb, ri] = await Promise.all([
      fetch(`https://api.guildwars2.com/v2/account/achievements?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/wallet?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/materials?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/bank?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/inventory?${tk}`),
    ]);
    const bags = await readCharacterBags(tk);
    if (!ra.ok) throw new Error(`achievements HTTP ${ra.status}${ra.status === 401 || ra.status === 403 ? " (clé invalide ou permission 'progression' manquante)" : ""}`);
    if (!rw.ok) throw new Error(`wallet HTTP ${rw.status}`);
    const achList = await ra.json();
    const wallet = await rw.json();
    const mats = rm.ok ? await rm.json() : [];
    const bank = rb.ok ? await rb.json() : [];
    const shared = ri.ok ? await ri.json() : [];
    const byId = {}; for (const a of achList) byId[a.id] = a;
    const walletD = {}; for (const w of (wallet ?? [])) walletD[w.id] = w.value;
    const matD = {};
    for (const mm of (mats ?? [])) if (mm && mm.id) matD[mm.id] = (matD[mm.id] ?? 0) + (mm.count ?? 0);
    for (const bb of (bank ?? [])) if (bb && bb.id) matD[bb.id] = (matD[bb.id] ?? 0) + (bb.count ?? 0);
    for (const sh of (shared ?? [])) if (sh && sh.id) matD[sh.id] = (matD[sh.id] ?? 0) + (sh.count ?? 0);
    for (const [id3, n3] of Object.entries(bags.counts)) matD[id3] = (matD[id3] ?? 0) + n3;
    const val = (apiId) => (apiId < 1000 ? (walletD[apiId] ?? 0) : (matD[apiId] ?? 0));
    const meta = ((typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?._meta ?? {}).direct_sync ?? {};
    const keyIds = meta.achievement_key_ids ?? {};
    const norm = (a) => ({ done: a?.done === true, current: a?.current ?? 0, max: a?.max ?? 0, bits: a?.bits ?? [] });
    const achievements = {};
    for (const [k2, id2] of Object.entries(keyIds)) achievements[k2] = norm(byId[id2]);
    const currencies = {};
    const legIdsMap = meta.leg_currency_ids ?? {}; // mapping extrait de Flask — source de vérité
    for (const l of Object.values(LEGENDARIES)) {
      const d2 = {};
      for (const [ck, apiId] of Object.entries(legIdsMap[l.id] ?? {})) d2[ck] = val(apiId);
      const descs = [
        ...(l.currencies ?? []),
        ...(l.currenciesPerPiece ?? []),
        ...(l.currenciesPerWeapon ?? []),
        ...Object.values(l.currenciesPerWeaponByGen ?? {}).flat(),
      ];
      for (const c of descs) if (c.apiId && !(c.id in d2)) d2[c.id] = val(c.apiId);
      if (Object.keys(d2).length > 0) currencies[l.id] = d2;
    }
    const common = {};
    for (const c of COMMON_MATS) if (c.apiId) common[c.id] = val(c.apiId);
    // Prismatic : reconstruction (bit_map + tier_ranges extraits de Flask dans SOURCES_DB)
    let prismatic = null;
    const pm = meta.prismatic;
    const pa = byId[keyIds.prismatic ?? 5790];
    if (pm) {
      const bits = pa?.bits ?? [];
      const maps = {};
      for (const [bit, achId, name] of (pm.bit_map ?? [])) {
        const a2 = achId ? byId[achId] : null;
        maps[bit] = a2
          ? { name, done: a2.done === true, current: a2.current ?? 0, max: a2.max ?? 0 }
          : { name, done: bits.includes(bit), current: bits.includes(bit) ? 1 : 0, max: 1 };
      }
      const tiers = {};
      for (const [tn, bl] of Object.entries(pm.tier_ranges ?? {})) {
        const completed = bl.filter(b => bits.includes(b)).length;
        tiers[tn] = { completed, total: bl.length, done: completed === bl.length };
      }
      prismatic = { return_completed: bits.length, return_max: 24, done: pa?.done === true, bits_raw: bits, tiers, maps };
    }
    // Statuts compacts de tous les achievements du compte (metas / sous-collections)
    const sub = {};
    for (const a of achList) sub[String(a.id)] = { done: a.done === true, current: a.current ?? 0, max: a.max ?? 0 };
    // Collections Aurora/Vision/Obsidian : même format que les endpoints Flask dédiés
    const colls = {};
    for (const [grp, kmap] of Object.entries(meta.collection_key_ids ?? {})) {
      const out = {};
      for (const [k3, id3] of Object.entries(kmap)) out[k3] = norm(byId[id3]);
      colls[grp] = out;
    }
    // Meme inventaire agrege que celui renvoye par Flask, pour que les deux
    // chemins alimentent le grand total a l'identique.
    const stocksAll = {};
    for (const [k4, v4] of Object.entries(walletD)) stocksAll[String(k4)] = (stocksAll[String(k4)] ?? 0) + v4;
    for (const [k4, v4] of Object.entries(matD)) stocksAll[String(k4)] = (stocksAll[String(k4)] ?? 0) + v4;
    return { currencies, common, achievements, prismatic, _sub_status: sub, _collections: colls, _direct: true, _bags_ok: bags.ok, stocks: stocksAll, errors: [] };
  }, []);

  // ── Fetch : Flask local, puis repli GW2 API directe si une clé est saisie ──
  const fetchFromFlask = useCallback(async () => {
    setApiStatus("loading");
    setApiError("");
    try {
      let data = null;
      let flaskErr = null;
      // Sonde /health courte : détecte l'absence de serveur sans pénaliser un serveur lent.
      let flaskUp = false;
      try {
        const h = await fetch("http://127.0.0.1:5000/health", { signal: AbortSignal.timeout(2500) });
        flaskUp = h.ok;
      } catch (_) { flaskUp = false; }
      if (flaskUp) {
        try {
          // Pas de timeout serré ici : /api/progression enchaîne plusieurs appels
          // à l'API GW2 et dépasse couramment 10 s selon la taille du compte.
          const resp = await fetch(`http://127.0.0.1:5000/api/progression?lang=${langRef.current}`, { signal: AbortSignal.timeout(120000) });
          if (resp.ok) data = await resp.json();
          else { const j = await resp.json().catch(() => ({})); flaskErr = j.error ?? `HTTP ${resp.status}`; }
        } catch (e) { flaskErr = (e && e.name === "TimeoutError") ? "Flask n'a pas répondu en 2 min" : "Flask a échoué en cours de requête"; }
      } else {
        flaskErr = "Flask injoignable";
      }
      if (!data) {
        const dKey = (gtApiKey ?? "").trim();
        if (!dKey) throw new Error(`${flaskErr} — saisis ta clé API GW2 (champ 🔑) pour la synchro directe sans Flask`);
        data = await buildDirectProgressionData(dKey);
      }
      for (const [legId, vals] of Object.entries(data.currencies ?? {})) {
        const cur = await storeGet(getCurrencyKey(legId)) ?? {};
        // Une monnaie declaree mais absente de la charge synchronisee affichait 0,
        // indiscernable d'un stock reellement vide. On note l'ecart pour le dire.
        const L = LEGENDARIES[legId];
        const declared = [
          ...(L?.currencies ?? []),
          ...(L?.currenciesPerPiece ?? []),
          ...(L?.currenciesPerWeapon ?? []),
          ...Object.values(L?.currenciesPerWeaponByGen ?? {}).flat(),
        ].map(c => c.id);
        const notSent = declared.filter(cid => !(cid in vals));
        await storeSet(getCurrencyKey(legId), { ...cur, ...vals, __notSent: notSent, __syncedAt: Date.now() });
      }
      // L'inventaire agrege renvoye par la meme requete alimente directement le
      // grand total. Il n'existe plus de synchro separee : le bouton API remplit
      // les deux, comme il aurait toujours du.
      if (data.stocks && Object.keys(data.stocks).length > 0) {
        const merged = {
          ...data.stocks,
          _synced_at: Math.floor(Date.now() / 1000),
          _sync_source: data._direct ? "api" : "flask",
          _errors: Array.isArray(data.errors) ? data.errors : [],
          _found: Object.keys(data.stocks).length,
          _asked: Object.keys(data.stocks).length,
          _bags_ok: data._bags_ok !== false,
        };
        setGtStocks(merged);
        try { localStorage.setItem("gw2_gt_stocks", JSON.stringify(merged)); } catch (_) {}
        setGtStockStatus("ok");
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
      // Flask ne renvoie pas _sub_status : sans ce rattrapage, l'instantane des
      // sous-succes n'etait jamais rafraichi. L'effet de complement ne va chercher
      // que les ids INCONNUS, donc un succes enregistre comme non fait le restait
      // indefiniment, meme une fois termine en jeu.
      let subSnap = data._sub_status;
      if (!subSnap) {
        // gtApiKey est la seule cle detenue par le client, et elle est vide chez
        // qui passe par Flask. Ce repli ne peut donc pas sauver ce cas — c'est
        // Flask qui doit renvoyer _sub_status, ce qu'il fait depuis la v33.
        const dKey2 = (gtApiKey ?? "").trim();
        if (dKey2) {
          try {
            const rs = await fetch(`https://api.guildwars2.com/v2/account/achievements?access_token=${encodeURIComponent(dKey2)}`);
            if (rs.ok) {
              const list2 = await rs.json();
              subSnap = {};
              for (const a of list2) subSnap[String(a.id)] = { done: a?.done === true, current: a?.current ?? 0, max: a?.max ?? 0 };
            }
          } catch (_) { /* on garde l'instantane precedent */ }
        }
      }
      if (subSnap) {
        // Instantane COMPLET du compte : on remplace au lieu de fusionner, sinon
        // une valeur perimee survit a toutes les synchros suivantes.
        try { localStorage.setItem("gw2_ach_substatus", JSON.stringify(subSnap)); } catch (_) {}
        setAchSubStatus(subSnap);
      }
      // Fetch Aurora collections en parallèle
      try {
        const aKey = (gtApiKey ?? "").trim();
        const aUrl = aKey
          ? `http://127.0.0.1:5000/api/achievements/aurora?key=${encodeURIComponent(aKey)}&lang=${langRef.current}`
          : `http://127.0.0.1:5000/api/achievements/aurora?lang=${langRef.current}`;
        const aResp = await fetch(aUrl, { signal: AbortSignal.timeout(60000) });
        if (aResp.ok) {
          const aData = await aResp.json();
          localStorage.setItem("gw2_aurora_collections", JSON.stringify(aData));
          setAuroraCollections(aData);
        } else { throw new Error("flask ko"); }
      } catch (_) {
        if (data._collections?.aurora) {
          localStorage.setItem("gw2_aurora_collections", JSON.stringify(data._collections.aurora));
          setAuroraCollections(data._collections.aurora);
        }
      }
      // Fetch Vision collections en parallèle
      try {
        const vKey = (gtApiKey ?? "").trim();
        const vUrl = vKey
          ? `http://127.0.0.1:5000/api/achievements/vision?key=${encodeURIComponent(vKey)}&lang=${langRef.current}`
          : `http://127.0.0.1:5000/api/achievements/vision?lang=${langRef.current}`;
        const vResp = await fetch(vUrl, { signal: AbortSignal.timeout(60000) });
        if (vResp.ok) {
          const vData = await vResp.json();
          localStorage.setItem("gw2_vision_collections", JSON.stringify(vData));
          setVisionCollections(vData);
        } else { throw new Error("flask ko"); }
      } catch (_) {
        if (data._collections?.vision) {
          localStorage.setItem("gw2_vision_collections", JSON.stringify(data._collections.vision));
          setVisionCollections(data._collections.vision);
        }
      }
      // Fetch Obsidian achievements en parallèle
      try {
        const oKey = (gtApiKey ?? "").trim();
        const oUrl = oKey
          ? `http://127.0.0.1:5000/api/achievements/obsidian?key=${encodeURIComponent(oKey)}&lang=${langRef.current}`
          : `http://127.0.0.1:5000/api/achievements/obsidian?lang=${langRef.current}`;
        const oResp = await fetch(oUrl, { signal: AbortSignal.timeout(60000) });
        if (oResp.ok) {
          const oData = await oResp.json();
          localStorage.setItem("gw2_obsidian_achievements", JSON.stringify(oData));
          setObsAch(oData);
        } else { throw new Error("flask ko"); }
      } catch (_) {
        if (data._collections?.obsidian) {
          localStorage.setItem("gw2_obsidian_achievements", JSON.stringify(data._collections.obsidian));
          setObsAch(data._collections.obsidian);
        }
      }
      const freshCurr = await storeGet(getCurrencyKey(selectedLeg)) ?? {};
      setCurrencies(freshCurr);
      setApiStatus("ok");
      setTimeout(() => setApiStatus("idle"), 3000);
    } catch (e) {
      setApiStatus("error");
      setApiError(e.message);
    }
  }, [selectedLeg, gtApiKey, buildDirectProgressionData]);

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
    // (clé volontairement non persistée)
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

    // 1. Flask, via la MEME route que tout le reste. L'ancienne route dediee était
    // un POST JSON avec en-tête personnalisé, donc soumise à un preflight CORS, et
    // surtout elle constituait un second système de stock pour un même joueur et
    // une même clé. /api/progression agrège désormais les cinq emplacements et
    // renvoie un inventaire unique : un GET simple, aucun preflight.
    try {
      const resp = await fetch(
        `http://127.0.0.1:5000/api/progression?lang=${langRef.current}`,
        { signal: AbortSignal.timeout(120000) }
      );
      if (resp.ok) {
        const prog = await resp.json();
        if (prog.stocks && Object.keys(prog.stocks).length > 0) {
          const stocks = {};
          for (const id of apiIds) {
            const v = prog.stocks[String(id)];
            if (v !== undefined) stocks[String(id)] = v;
          }
          data = { stocks, synced_at: Math.floor(Date.now() / 1000), errors: prog.errors ?? [] };
        } else {
          flaskErr = "Flask ne renvoie pas d'inventaire agrégé — serveur antérieur à la v32";
        }
      } else {
        const errBody = await resp.json().catch(() => ({}));
        flaskErr = `Flask HTTP ${resp.status}: ${errBody.error ?? ""}`;
      }
    } catch (e) { flaskErr = `Flask injoignable : ${e.message}`; }

    if (flaskErr) console.warn("[GT Stocks]", flaskErr);

    // 2. Fallback direct GW2 API — uniquement si clé disponible
    if (!data && key) {
      try {
        // access_token en paramètre : le header Authorization fait échouer le
        // preflight CORS sur mobile — c'est pourquoi la synchro des stocks ne
        // passait pas alors que celle des succès fonctionnait.
        const tk = `access_token=${encodeURIComponent(key.trim())}`;
        const [wResp, mResp, bResp, sResp] = await Promise.all([
          fetch(`https://api.guildwars2.com/v2/account/wallet?${tk}`),
          fetch(`https://api.guildwars2.com/v2/account/materials?${tk}`),
          fetch(`https://api.guildwars2.com/v2/account/bank?${tk}`),
          fetch(`https://api.guildwars2.com/v2/account/inventory?${tk}`),
        ]);
        const [wallet, mats, bank, shared] = await Promise.all([
          wResp.ok ? wResp.json() : [],
          mResp.ok ? mResp.json() : [],
          bResp.ok ? bResp.json() : [],
          sResp.ok ? sResp.json() : [],
        ]);
        const bags2 = await readCharacterBags(tk);
        const reqSet = new Set(apiIds);
        const stocks = {};
        for (const e of (wallet ?? [])) if (e && reqSet.has(e.id)) stocks[String(e.id)] = (stocks[String(e.id)] ?? 0) + (e.value ?? 0);
        for (const e of (mats ?? [])) if (e && reqSet.has(e.id)) stocks[String(e.id)] = (stocks[String(e.id)] ?? 0) + (e.count ?? 0);
        for (const e of (bank ?? [])) if (e && reqSet.has(e.id)) stocks[String(e.id)] = (stocks[String(e.id)] ?? 0) + (e.count ?? 0);
        for (const e of (shared ?? [])) if (e && reqSet.has(e.id)) stocks[String(e.id)] = (stocks[String(e.id)] ?? 0) + (e.count ?? 0);
        for (const [id3, n3] of Object.entries(bags2.counts)) if (reqSet.has(Number(id3))) stocks[id3] = (stocks[id3] ?? 0) + n3;
        data = { stocks, synced_at: Math.floor(Date.now() / 1000), errors: [], bags_ok: bags2.ok };
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

    // Flask renvoie deja une liste d'erreurs par source et un compte de trouves ;
    // tout etait jete. Un stock a zero pouvait donc signifier « inventaire vide »
    // ou « les quatre appels ont echoue », sans moyen de distinguer.
    const found = Object.keys(data.stocks ?? {}).length;
    const merged = {
      ...data.stocks,
      _synced_at: data.synced_at,
      _sync_source: data._direct ? "api" : "flask",
      _bags_ok: data.bags_ok !== false,
      _errors: Array.isArray(data.errors) ? data.errors : [],
      _found: found,
      _asked: apiIds.length,
    };
    if (found === 0) {
      setGtStockStatus("error");
      setGtStockError((data.errors ?? []).join(" · ") || "0 ressource retournée sur " + apiIds.length + " demandées");
    }
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

    setActiveTab((selectedLeg === "conflux" || selectedLeg === "warbringer" || selectedLeg === "strife_unending") ? "wvw" : (selectedLeg === "prismatic" ? "achievements" : (newLeg?.isArmorSet ? "pieces" : (selectedLeg === "weapons" ? "weapons" : (selectedLeg === "trinkets" ? "trinkets" : (leg?.raidAchievements ? "raids" : (selectedLeg === "t6" ? "currencies" : "metas")))))));
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
  const isArmorSet = LEGENDARIES[selectedLeg]?.isArmorSet === true;
  const obsIds = (LEGENDARIES[selectedLeg]?.isArmorSet
    ? (LEGENDARIES[selectedLeg].armoryApiIds ?? (obsItems ? Object.keys(obsItems).map(Number) : []))
    : LEGENDARIES.obsidian.armoryApiIds);
  const obsOwnedSet = new Set(obsIds.filter(id => armoryRaw.has(id)));
  const obsHasTarget = obsTarget.size > 0;
  const obsTargetOwned = obsHasTarget ? [...obsTarget].filter(id => obsOwnedSet.has(id)).length : 0;
  const obsRemainingCount = obsHasTarget
    ? Math.max(0, obsTarget.size - obsTargetOwned)
    : Math.max(0, 6 - obsOwnedSet.size);

  // ── Armes gen3 : ciblées / possédées / restantes ──
  const isWeapons = selectedLeg === "weapons";
  const wpnIdsAll = wpnItems ? Object.keys(wpnItems).map(Number) : [];
  const wpnIds = wpnIdsAll.filter(id => (((wpnItems ?? {})[String(id)] ?? {}).gen ?? "gen3") === wpnGen);
  const wpnGenSet = new Set(wpnIds);
  const wpnOwnedSet = new Set(wpnIds.filter(id => armoryRaw.has(id)));
  const wpnTargetGen = [...wpnTarget].filter(id => wpnGenSet.has(id));
  const wpnHasTarget = wpnTargetGen.length > 0;
  const wpnTargetOwned = wpnHasTarget ? wpnTargetGen.filter(id => wpnOwnedSet.has(id)).length : 0;
  const wpnRemainingCount = wpnHasTarget ? Math.max(0, wpnTargetGen.length - wpnTargetOwned) : 0;
  const wpnGenCount = (g) => wpnIdsAll.filter(id => (((wpnItems ?? {})[String(id)] ?? {}).gen ?? "") === g).length;
  const wpnGenOwned = (g) => wpnIdsAll.filter(id => (((wpnItems ?? {})[String(id)] ?? {}).gen ?? "") === g && armoryRaw.has(id)).length;

  // ── Calcul progression currencies (Obsidian/Armes : requis = coût unitaire × restantes) ──
  const legCurrencies = isGrandTotal ? [] : (isArmorSet
    ? (leg?.currenciesPerPiece ?? []).map(c => ({ ...c, required: c.perPiece * obsRemainingCount }))
    : (isWeapons
      ? ((((leg?.currenciesPerWeaponByGen ?? {})[wpnGen]) ?? (leg?.currenciesPerWeapon ?? []))).map(c => ({ ...c, required: c.perUnit * wpnRemainingCount }))
      : (leg?.currencies ?? [])));
  // Achats de collection payés dans la monnaie de carte : le surcoût ne compte
  // que tant que l'étape correspondante n'est pas validée (v107).
  // Un extra peut viser une étape unique (bit + amount) ou un lot d'étapes
  // de même prix (bits[] + amountPer) : le reste dû fond au fur et à mesure.
  const extraRemaining = (x) => {
    const sc = auroraCollections?.[x.sub];
    const stepDone = (b) => sc ? ((sc.done ?? false) || (sc.bits ?? []).includes(b)) : false;
    if (Array.isArray(x.bits)) return x.bits.filter(b => !stepDone(b)).length * (x.amountPer ?? 0);
    return stepDone(x.bit) ? 0 : (x.amount ?? 0);
  };
  // Les surcoûts vivent dans SOURCES_DB.craft_components[*].qty_extras : une seule
  // déclaration, lue à la fois par l'onglet du légendaire et par le grand total.
  const extrasFromSources = (legId, apiId) => {
    const comps = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.craft_components ?? {};
    for (const c of Object.values(comps)) {
      if (c?.apiId === apiId && Array.isArray(c.qty_extras)) {
        return c.qty_extras.filter(x => x.legendary === legId);
      }
    }
    return [];
  };
  const asideFromSources = (apiId) => {
    const comps = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.craft_components ?? {};
    for (const c of Object.values(comps)) if (c?.apiId === apiId && c.aside) return c.aside;
    return null;
  };
  const withExtras = legCurrencies.map(cur => {
    const ex = [...(Array.isArray(cur.extras) ? cur.extras : []), ...extrasFromSources(selectedLeg, cur.apiId)];
    if (ex.length === 0) return { ...cur, aside: cur.aside ?? asideFromSources(cur.apiId) };
    const pending = ex.map(x => ({ ...x, amount: extraRemaining(x) })).filter(x => x.amount > 0);
    return { ...cur, aside: cur.aside ?? asideFromSources(cur.apiId), required: cur.required + pending.reduce((a, x) => a + x.amount, 0), extrasPending: pending, extrasTotal: ex.length };
  });
  // Scan global a la demande : le panneau ne voit que l'onglet courant, car
  // achBitsDefs est recharge a chaque changement de legendaire. Ce balayage
  // interroge une fois tous les metas de tous les legendaires. Volontairement
  // manuel : au demarrage il couterait un appel par onglet a chaque session.
  // Un palier sans bits n'est pas forcement un trou : beaucoup de succes comptent
  // des actions, des kills ou des objets possedes, et n'ont rien a curer. On les
  // distingue par le texte du requirement, avec une liste editoriale d'exceptions.
  const isAchievementMeta = (req) => /achievement|succ[eè]s|haut[- ]fait/i.test(req ?? "");
  const noStepsDeclared = (id) => Boolean((typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.meta_no_steps?.[String(id)]);

  // Les sacs des personnages ne sont lus par aucun des deux chemins de stock :
  // une Boule d'energie sombre fraichement recyclee y reste jusqu'au depot, et
  // s'affichait donc a zero. /v2/characters exige les portees characters ET
  // inventories : si elles manquent, on le dit au lieu de sous-compter en silence.
  const readCharacterBags = async (tk) => {
    try {
      const rc = await fetch(`https://api.guildwars2.com/v2/characters?ids=all&${tk}`);
      if (!rc.ok) return { counts: {}, ok: false };
      const counts = {};
      for (const c of await rc.json()) {
        for (const bag of (c?.bags ?? [])) {
          for (const it of (bag?.inventory ?? [])) {
            if (it && it.id) counts[it.id] = (counts[it.id] ?? 0) + (it.count ?? 1);
          }
        }
      }
      return { counts, ok: true };
    } catch (_) { return { counts: {}, ok: false }; }
  };

  const scanAllMetas = useCallback(async () => {
    const curated = new Set(Object.keys((typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.meta_eligible ?? {}));
    const targets = [];
    for (const l of Object.values(LEGENDARIES)) {
      for (const a of (l.raidAchievements ?? [])) {
        if (typeof a.achievementId === "number") targets.push([a.achievementId, l.name ?? l.id]);
      }
    }
    (function collectMastery(o, legName) {
      if (Array.isArray(o)) { o.forEach(x => collectMastery(x, legName)); return; }
      if (!o || typeof o !== "object") return;
      if (typeof o.mastery_achi_id === "number") targets.push([o.mastery_achi_id, legName]);
      for (const v of Object.values(o)) collectMastery(v, legName);
    })((typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.legendaries ?? {}, "sources");
    const byId = new Map();
    for (const [id, leg] of targets) if (!byId.has(id)) byId.set(id, leg);
    const ids = [...byId.keys()];
    const gaps = [];
    const counters = [];
    for (let k = 0; k < ids.length; k += 150) {
      const chunk = ids.slice(k, k + 150);
      try {
        const r = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${chunk.join(",")}&lang=${lang}`);
        if (!r.ok) continue;
        for (const a of await r.json()) {
          const tierMax = (a.tiers ?? []).reduce((m, t) => Math.max(m, t.count ?? 0), 0);
          if (tierMax > 1 && (a.bits ?? []).length === 0 && !curated.has(String(a.id))) {
            const counter = noStepsDeclared(a.id) || !isAchievementMeta(a.requirement);
            (counter ? counters : gaps).push({ id: a.id, name: a.name, tierMax, leg: byId.get(a.id) ?? "?", req: a.requirement });
          }
        }
      } catch (_) { /* reseau : on rend ce qu'on a */ }
    }
    return { checked: ids.length, gaps, counters };
  }, [lang]);

  const mainProgress = isGrandTotal ? [] : withExtras.map(cur => ({
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
    ...(isArmorSet ? [{ id: "pieces", label: t("tab_pieces", { n: obsOwnedSet.size }) }] : []),
    ...(isWeapons ? [{ id: "weapons", label: t("tab_weapons", { n: wpnOwnedSet.size, m: wpnIds.length || 16 }) }] : []),
    ...(isTrinkets ? [{ id: "trinkets", label: NX({ fr: "◈ Colifichets", en: "◈ Trinkets" }) }] : []),
    ...(!isPrismatic && !["conflux", "warbringer", "coalescence", "selachimorpha", "eikasia", "upgrades", "weapons", "t6", "trinkets", "strife_unending", "perfected_envoy", "triumphant_hero", "ardent_glorious"].includes(selectedLeg) ? [{ id: "metas", label: `⏱ Metas (${dailyCount})` }] : []),
    ...(selectedLeg === "conflux" || selectedLeg === "warbringer" || selectedLeg === "strife_unending" || selectedLeg === "triumphant_hero" ? [{ id: "wvw", label: `WvW (${weeklyCount}/${(leg?.wvwActivities ?? []).length})` }] : []),
    ...(leg?.isGuideTrinket ? [{ id: "guide", label: NX({ fr: "📖 Guide", en: "📖 Guide" }) }] : []),
    ...(leg?.raidAchievements ? [{ id: "raids", label: leg.raidTabLabel ? NX(leg.raidTabLabel) : (selectedLeg === "coalescence" ? t("tab_raids") : t("tab_collections")) }] : []),
    ...(selectedLeg === "aurora" ? [{ id: "chars", label: t("tab_chars", { n: numChars }) }] : []),
    ...(selectedLeg === "aurora" ? [{ id: "collections", label: `Collections` }] : []),
    ...(selectedLeg === "vision" ? [{ id: "collections", label: `Collections` }] : []),
    ...((leg?.bounties?.length > 0) ? [{ id: "bounties", label: t("tab_bounties", { n: Object.keys(bountyDone).length }) }] : []),
    ...(!isPrismatic && selectedLeg !== "trinkets" ? [{ id: "currencies", label: NX({ fr: "◆ Composants", en: "◆ Components" }) }] : []),

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

      {/* ── HEADER PLEIN ÉCRAN (Grand Total / Cadences) ── */}
      {isGrandTotal && (
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(226,201,126,0.1)", background: "rgba(226,201,126,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: isCadences ? "#38bdf8" : "#f472b6", letterSpacing: "0.08em", fontFamily: "'Cinzel', serif" }}>
            {isCadences ? `⏳ ${t("tab_cadences")}` : "⚔ Grand Total"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {/* Sans Flask (mobile), la clé API est le seul moyen de synchroniser :
                elle doit rester accessible depuis ces onglets aussi. */}
            <button className="adj-btn"
              title={NX({ fr: "Clé API GW2 — synchro directe sans Flask (mémoire de session uniquement)", en: "GW2 API key — direct sync without Flask (session memory only)" })}
              style={{ fontSize: "11px", padding: "3px 7px", opacity: (showKeyInput || gtApiKey) ? 1 : 0.55 }}
              onClick={() => setShowKeyInput(v => !v)}>🔑</button>
            {(showKeyInput || gtApiKey !== "") && (
              <input type="password" autoComplete="off" value={gtApiKey}
                onChange={(e) => setGtApiKey(e.target.value)}
                placeholder={NX({ fr: "🔑 clé API GW2 (session)", en: "🔑 GW2 API key (session)" })}
                style={{ width: 140, fontSize: 10, padding: "4px 7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(226,201,126,0.2)", borderRadius: 6, color: "#e2c97e" }} />
            )}
            <button
              onClick={() => { fetchFromFlask(); if (gtApiKey) fetchGtStocks(); }}
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
            <div style={{ fontSize: 9, color: gtStockStatus === "ok" ? "#4ade80" : gtStockStatus === "error" ? "#f87171" : "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif" }}>
              {gtStockStatus === "loading" ? "⟳" : gtStockStatus === "ok" ? `✓ ${Object.keys(gtStocks).filter(k => !k.startsWith("_")).length} stocks` : gtStockStatus === "error" ? "✗ stocks" : now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          {gtStockStatus === "error" && gtStockError && (
            <div style={{ width: "100%", fontSize: "9px", color: "#f87171", fontFamily: "'Crimson Text', serif" }}>stocks : {gtStockError}</div>
          )}
          {apiStatus === "error" && apiError && (
            <div style={{ width: "100%", fontSize: "9px", color: "#f87171", fontFamily: "'Crimson Text', serif" }}>{apiError}</div>
          )}
        </div>
      )}

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
              <button className="adj-btn"
                title={NX({ fr: "Clé API GW2 — synchro directe sans Flask (mémoire de session uniquement)", en: "GW2 API key — direct sync without Flask (session memory only)" })}
                style={{ fontSize: "11px", padding: "3px 7px", opacity: (showKeyInput || gtApiKey) ? 1 : 0.55 }}
                onClick={() => setShowKeyInput(v => !v)}>🔑</button>
              {(showKeyInput || apiStatus === "error" || gtApiKey !== "") && (
                <input type="password" autoComplete="off" value={gtApiKey}
                  onChange={(e) => setGtApiKey(e.target.value)}
                  placeholder={NX({ fr: "🔑 clé API GW2 (session)", en: "🔑 GW2 API key (session)" })}
                  title={NX({ fr: "Synchro directe sans Flask (mobile). Clé gardée en mémoire uniquement — jamais enregistrée.", en: "Direct sync without Flask (mobile). Key kept in memory only — never stored." })}
                  style={{ width: 150, fontSize: 10, padding: "4px 7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(226,201,126,0.2)", borderRadius: 6, color: "#e2c97e" }} />
              )}
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
        <button
          className={`leg-btn ${(TRINKET_GROUP_ORDER.includes(selectedLeg) || selectedLeg === "trinkets") ? "active" : ""}`}
          style={{ "--leg-color": "#5eead4", "--leg-bg": "rgba(94,234,212,0.12)" }}
          onClick={() => {
            let last = null;
            try { last = localStorage.getItem("gw2_last_trinket"); } catch (_) {}
            if (last && last.startsWith("guide:") && TRINKET_GUIDE_KEYS.includes(last.slice(6))) { setSelTrinket(last.slice(6)); setSelectedLeg("trinkets"); }
            else if (last && TRINKET_RICH.includes(last)) { setSelectedLeg(last); }
            else { setSelectedLeg("vision"); }
          }}
        >
          ◈ Trinkets
          <span style={{ fontSize: "9px", opacity: 0.6, marginLeft: "4px" }}>(14)</span>
        </button>
        {MAIN_SELECTOR_ORDER.map(id => LEGENDARIES[id]).filter(Boolean).map(l => (
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
        <button
          className={`leg-btn ${selectedLeg === "cadences" ? "active" : ""}`}
          style={{ "--leg-color": "#38bdf8", "--leg-bg": "rgba(56,189,248,0.12)", fontWeight: selectedLeg === "cadences" ? 700 : 400 }}
          onClick={() => setSelectedLeg("cadences")}
        >
          ⏳ {t("tab_cadences")}
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

      {/* ── GRAND TOTAL (mode plein écran) ── */}
      {isGrandTotal && !isCadences && (
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

      {/* ── CADENCES (mode plein écran) ── */}
      {isCadences && <TabErrorBoundary><CadencesTab stocks={gtStocks} /></TabErrorBoundary>}

      {/* ── TABS + CONTENU (masqués en mode Grand Total) ── */}
      {/* ── SOUS-SÉLECTEUR TRINKETS (14 colifichets) ── */}
      {(TRINKET_GROUP_ORDER.includes(selectedLeg) || selectedLeg === "trinkets") && (
        <div className="leg-selector" style={{ padding: "8px 16px", background: "rgba(94,234,212,0.02)" }}>
          {TRINKET_GROUP_ORDER.map(k => {
            const rich = TRINKET_RICH.includes(k);
            const e = rich ? LEGENDARIES[k] : null;
            const S = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB.legendaries?.[k] : null);
            const aid = S?.armory_api_id;
            const kOwned = !!aid && (gtOwnedIds.has(aid) || gtManualOwnedIds.has(aid));
            const active = rich ? (selectedLeg === k) : (selectedLeg === "trinkets" && selTrinket === k);
            return (
              <button key={k}
                className={`leg-btn ${active ? "active" : ""}`}
                style={{ "--leg-color": (e?.color ?? "#5eead4"), "--leg-bg": (e?.colorDim ?? "rgba(94,234,212,0.12)"), fontSize: 10, padding: "6px 10px" }}
                onClick={() => { if (rich) { setSelectedLeg(k); } else { setSelTrinket(k); setSelectedLeg("trinkets"); } }}>
                {kOwned ? "✓ " : ""}{NL(k, (e?.name ?? (S?.name ?? k)))}
              </button>
            );
          })}
        </div>
      )}

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
              {(leg?.currencies ?? []).filter(cur => cur.kind !== "karma").map(cur => {
                let perDay, note, color;
                if (cur.farmType === "per_char") {
                  perDay = numChars * cur.perCharPerDay;
                  note = t("chars_note_perchar", { n: numChars, s: numChars > 1 ? "s" : "", per: cur.perCharPerDay });
                  color = "#34d399";
                } else if (cur.farmType === "per_char_hearts") {
                  // Ne pas confondre deux plafonds distincts : les coffres du Reliquaire
                  // sont limites a 2/perso/jour et donnent le Chiffre ancien, pas les
                  // perles. Les perles viennent des 5 vendeurs de coeur, 3 chacun.
                  perDay = numChars * (cur.perCharPerDay ?? 2);
                  note = t(cur.heartBundle ? "chars_note_hearts" : "chars_note_chests", { n: numChars, s: numChars > 1 ? "s" : "" });
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
                          // L'API fait foi : tierMax = dernier palier (le seuil réel),
                          // bits.length = nombre de succès éligibles. Les valeurs stockées
                          // ne servent que de repli, et tout écart est signalé.
                          const mDef    = masteryId ? achBitsDefs?.[String(masteryId)] : null;
                          const apiReq  = mDef?.tierMax ?? 0;
                          const apiPool = (mDef?.bits ?? []).length;
                          // v112 : plus aucune valeur stockee. Le seuil vient du dernier palier
                          // de l'API, le pool de la liste curee. Les champs mastery_required /
                          // mastery_max ont ete supprimes des sources : ils avaient derive.
                          const curatedPool = (mDef?.subs ?? []).length;
                          const mReq = apiReq || 0;
                          const mMax = curatedPool || apiPool || masteryAchi?.max || mReq || 0;
                          const mGap = null;
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
                              {/* Prérequis chiffrés : total + restant selon les étapes déjà validées */}
                              {missing && item.requirements && (() => {
                                const RQ = item.requirements;
                                const sub = achSubStatus ?? {};
                                const chain = item.chain ?? [];
                                const doneUnits = chain.reduce((s, st) => s + ((st.achievementId && sub[String(st.achievementId)]?.done) ? (st.units ?? 0) : 0), 0);
                                const known = chain.some(st => st.achievementId && sub[String(st.achievementId)]);
                                const total = RQ.unit_total ?? 0;
                                const left = Math.max(0, total - doneUnits);
                                const fmt = (v, kind) => kind === "wallet" && v >= 10000 && RQ.lines.find(l => l.kind === "wallet" && l.apiId === 1)
                                  ? v : v;
                                const coin = (c) => `${Math.floor(c / 10000)} po`;
                                return (
                                  <div style={{ marginTop: 7, padding: "8px 10px", background: "rgba(94,234,212,0.04)", border: "1px solid rgba(94,234,212,0.18)", borderRadius: 6 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
                                      <span style={{ fontSize: 10, fontWeight: 600, fontFamily: "'Cinzel', serif", color: "#5eead4" }}>
                                        {NX({ fr: "📋 Prérequis", en: "📋 Requirements" })}
                                      </span>
                                      <span style={{ fontSize: 10, fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.6)" }}>
                                        {known
                                          ? NX({ fr: `reste ${left} / ${total} ${NXS(RQ.unit)}`, en: `${left} / ${total} ${NXS(RQ.unit)} left` })
                                          : NX({ fr: `${total} ${NXS(RQ.unit)} au total`, en: `${total} ${NXS(RQ.unit)} total` })}
                                      </span>
                                    </div>
                                    {(RQ.lines ?? []).map((ln, li) => {
                                      const isGold = ln.kind === "wallet" && ln.apiId === 1;
                                      const totalV = (ln.perUnit ?? 0) * total;
                                      const leftV = (ln.perUnit ?? 0) * left;
                                      const stock = ln.curKey ? (currencies?.[ln.curKey] ?? null) : ((ln.kind === "wallet" && ln.apiId) ? (gtStocks?.[String(ln.apiId)] ?? null) : null);
                                      const show = (v) => isGold ? coin(v) : v.toLocaleString("fr-FR");
                                      const ok = stock != null && stock >= leftV;
                                      return (
                                        <div key={li} style={{ padding: "3px 0", borderTop: li ? "1px solid rgba(226,201,126,0.06)" : "none" }}>
                                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
                                            <span style={{ color: "rgba(226,201,126,0.8)" }}>{ln.icon} {NX(ln.label)}</span>
                                            <span style={{ whiteSpace: "nowrap", fontFamily: "'Crimson Text', serif" }}>
                                              <span style={{ color: ok ? "#4ade80" : "#5eead4", fontWeight: 600 }}>{show(leftV)}</span>
                                              {left !== total && <span style={{ color: "rgba(226,201,126,0.3)" }}> / {show(totalV)}</span>}
                                              {stock != null && <span style={{ color: ok ? "#4ade80" : "rgba(226,201,126,0.45)" }}> · {NX({ fr: "en stock", en: "held" })} {show(stock)}</span>}
                                            </span>
                                          </div>
                                          {ln.detail && <div style={{ fontSize: 9.5, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", lineHeight: 1.4 }}>{NX(ln.detail)}</div>}
                                        </div>
                                      );
                                    })}
                                    {RQ.unit_note && <div style={{ marginTop: 5, fontSize: 9.5, color: "rgba(251,146,60,0.7)", fontFamily: "'Crimson Text', serif", lineHeight: 1.45 }}>{NX(RQ.unit_note)}</div>}
                                    {!known && <div style={{ marginTop: 4, fontSize: 9.5, fontStyle: "italic", color: "rgba(226,201,126,0.35)" }}>{NX({ fr: "Synchronise l'API pour déduire ce qui est déjà fait.", en: "Sync the API to subtract what's already done." })}</div>}
                                  </div>
                                );
                              })()}

                              {/* Chaîne de sous-collections détaillée (ex. Wayfarer's Henge) */}
                              {missing && (item.chain ?? []).length > 0 && (
                                <div style={{ marginTop: 6, borderLeft: "2px solid rgba(251,146,60,0.25)", paddingLeft: 8 }}>
                                  {item.chain.map(st => (
                                    <div key={st.n} style={{ marginBottom: 6, opacity: (st.achievementId && (achSubStatus ?? {})[String(st.achievementId)]?.done) ? 0.45 : 1 }}>
                                      <div style={{ fontSize: 10, fontWeight: 600, color: (st.achievementId && (achSubStatus ?? {})[String(st.achievementId)]?.done) ? "#4ade80" : "rgba(251,146,60,0.8)", fontFamily: "'Cinzel', serif" }}>
                                        {(st.achievementId && (achSubStatus ?? {})[String(st.achievementId)]?.done) ? "✓" : st.n + "."} {st.name}
                                        {st.units ? <span style={{ opacity: 0.6, fontWeight: 400 }}> · {st.units} 🧩</span> : null}
                                      </div>
                                      <div style={{ fontSize: 10, color: "rgba(226,201,126,0.5)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>{NX(st)}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {missing && (item.tips ?? []).length > 0 && (
                                <div style={{ marginTop: 4 }}>
                                  {item.tips.map((tp, ti) => (
                                    <div key={ti} style={{ fontSize: 10, color: "rgba(94,234,212,0.6)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5, marginTop: 2 }}>{NX(tp)}</div>
                                  ))}
                                </div>
                              )}
                              {/* Bloc Mastery story inline — bit 0 uniquement */}
                              {missing && masteryId && (
                                <div style={{ marginTop: 5, padding: "6px 8px", background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 5 }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 9, fontWeight: 600, color: mDone ? "#4ade80" : "#fb923c", fontFamily: "'Cinzel', serif", letterSpacing: "0.03em" }}>
                                      {mDone ? "✓ " : ""}{NX(item.mastery_label)}
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
                                  <div style={{ fontSize: 8, marginTop: 3, fontFamily: "'Crimson Text', serif", color: mGap ? "rgba(248,113,113,0.85)" : "rgba(226,201,126,0.28)" }}>
                                    {mGap ? t("aurora_src_gap", { j: mGap, a: apiReq }) : (apiReq > 0 ? t("aurora_src_api") : t("aurora_src_wait"))}
                                  </div>
                                  {(() => {
                                    // Détail au bit près du méta d'épisode : les bits sont des
                                    // libellés de succès, résolus en ids via la catégorie.
                                    // Une seule source d'étapes : def.subs, alimenté par le bloc
                                    // meta_eligible des sources et enrichi (volume, prérequis, AP)
                                    // par le même pipeline que les métas de Vision. Aucun chemin
                                    // parallèle ici — c'est ce qui avait fait perdre le scoring.
                                    const subs = mDef?.subs ?? [];
                                    const bits = mDef?.bits ?? [];
                                    const bitAch = mDef?.bitAch ?? {};
                                    const steps = subs.length > 0
                                      ? subs.map((c, ci) => ({ i: ci, ...c }))
                                      : bits.map((b, bi) => ({ i: bi, name: b.text ?? "", id: bitAch[bi] ?? null })).filter(st => st.name);
                                    const curated = mDef?.subsSource === "wiki" ? subs : [];
                                    if (steps.length === 0) {
                                      return apiReq > 1 ? (
                                        <div style={{ marginTop: 4, fontSize: 9, color: "rgba(248,113,113,0.8)", fontFamily: "'Crimson Text', serif" }}>
                                          {t("mastery_nosteps")}
                                        </div>
                                      ) : null;
                                    }
                                    const st = (x) => (achSubStatus ?? {})[String(x.id)] ?? null;
                                    const isDone = (x) => x.id != null && st(x)?.done === true;
                                    const doneN = steps.filter(isDone).length;
                                    const rest = steps.filter(x => !isDone(x));
                                    const need = Math.max(0, mReq - Math.max(mCur, doneN));
                                    const open = masteryStepsOpen === masteryId;
                                    return (
                                      <div style={{ marginTop: 5, borderTop: "1px solid rgba(251,146,60,0.12)", paddingTop: 4 }}>
                                        <div onClick={() => setMasteryStepsOpen(open ? null : masteryId)}
                                          style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                          <span style={{ fontSize: 9, color: "rgba(251,146,60,0.75)", fontFamily: "'Crimson Text', serif" }}>
                                            {t("mastery_steps", { d: doneN, n: steps.length, r: need })}
                                          </span>
                                          <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)" }}>{open ? "▲" : "▼"}</span>
                                        </div>
                                        {mCur > doneN && (
                                          <div style={{ fontSize: 8.5, color: "rgba(248,113,113,0.8)", fontFamily: "'Crimson Text', serif", marginTop: 1 }}>
                                            {t("mastery_stale", { c: mCur, d: doneN })}
                                          </div>
                                        )}
                                        {curated.length > 0 && (
                                          <div style={{ fontSize: 8, color: "rgba(226,201,126,0.28)", fontFamily: "'Crimson Text', serif", marginTop: 1 }}>
                                            {t("mastery_src_wiki", { d: mDef?.subsVerified || "?", o: Math.max(0, steps.length - mReq) })}
                                          </div>
                                        )}
                                        {open && (
                                          <div style={{ marginTop: 4 }}>
                                            {Object.keys(achSubStatus ?? {}).length === 0 && (
                                              <div style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif", marginBottom: 3 }}>
                                                {t("mastery_nostatus")}
                                              </div>
                                            )}
                                            {need > 0 && rest.length > need && (
                                              <div style={{ marginBottom: 5, padding: "5px 8px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.22)", borderRadius: 5 }}>
                                                <div style={{ fontSize: 9, fontWeight: 600, color: "#4ade80", marginBottom: 2, fontFamily: "'Cinzel', serif" }}>
                                                  {t("bits_path", { n: need, s: rest.length - need })}
                                                </div>
                                                <div style={{ fontSize: 9.5, fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.8)", lineHeight: 1.5 }}>
                                                  {[...rest].sort((a2, b2) => (a2.score ?? 9) - (b2.score ?? 9)).slice(0, need).map(x => x.name).join(" · ")}
                                                </div>
                                              </div>
                                            )}
                                            {[...steps]
                                              .sort((a2, b2) => (isDone(a2) === isDone(b2) ? ((a2.score ?? 9) - (b2.score ?? 9)) || a2.i - b2.i : (isDone(a2) ? 1 : -1)))
                                              .map(x => {
                                              const d2 = isDone(x);
                                              const pr = st(x);
                                              return (
                                                <div key={x.i} style={{ display: "flex", justifyContent: "space-between", gap: 6, fontSize: 9, lineHeight: 1.55, fontFamily: "'Crimson Text', serif", color: d2 ? "rgba(74,222,128,0.55)" : "rgba(226,201,126,0.7)" }}>
                                                  <span>
                                                    {d2 ? "✓" : "○"}{" "}
                                                    {!d2 && x.tier && (
                                                      <span style={{ color: x.tier === "easy" ? "#4ade80" : x.tier === "med" ? "#e2c97e" : "rgba(251,146,60,0.9)" }}>
                                                        {x.tier === "easy" ? "⚡" : x.tier === "med" ? "◐" : "▲"}{" "}
                                                      </span>
                                                    )}
                                                    {x.name}
                                                  </span>
                                                  {!d2 && pr && (pr.max ?? 0) > 1 && (
                                                    <span style={{ color: "rgba(251,146,60,0.55)", flexShrink: 0 }}>{pr.current}/{pr.max}</span>
                                                  )}
                                                </div>
                                              );
                                            })}
                                            {(() => {
                                              // Pièges que le score d'effort ne peut pas calculer : coût en or,
                                              // exclusions mutuelles, population morte. Saisie éditoriale.
                                              const notes = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.achievement_notes ?? {};
                                              const hits = rest.map(x => notes[String(x.id)]).filter(Boolean);
                                              if (hits.length === 0) return null;
                                              return hits.map((n, ni) => (
                                                <div key={ni} style={{ marginTop: 4, fontSize: 9, color: "rgba(251,146,60,0.75)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
                                                  {NX(n)}
                                                </div>
                                              ));
                                            })()}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                              {item.unlock_first && (
                                <div style={{ marginTop: 4, padding: "6px 9px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 5 }}>
                                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(248,113,113,0.95)", fontFamily: "'Cinzel', serif", letterSpacing: "0.03em", marginBottom: 2 }}>
                                    {t("unlock_first_title")}
                                  </div>
                                  <div style={{ fontSize: 10, color: "rgba(248,113,113,0.75)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
                                    {NX(item.unlock_first)}
                                  </div>
                                </div>
                              )}
                              {item.sub_chain?.calculator_url && (
                                <div style={{ marginTop: 4, fontSize: 10, fontFamily: "'Crimson Text', serif" }}>
                                  <a href={item.sub_chain.calculator_url} target="_blank" rel="noopener noreferrer"
                                     style={{ color: "rgba(94,234,212,0.9)", textDecoration: "underline" }}>
                                    {t("calc_link")}
                                  </a>
                                  {item.sub_chain.calculator_note && (
                                    <div style={{ fontSize: 9, color: "rgba(226,201,126,0.35)", marginTop: 2, lineHeight: 1.45 }}>
                                      {NX(item.sub_chain.calculator_note)}
                                    </div>
                                  )}
                                </div>
                              )}
                              {missing && item.alt && (
                                <div style={{ marginTop: 5, padding: "6px 8px", background: "rgba(94,234,212,0.04)", border: "1px solid rgba(94,234,212,0.2)", borderRadius: 5 }}>
                                  <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(94,234,212,0.9)", fontFamily: "'Cinzel', serif", letterSpacing: "0.03em", marginBottom: 3 }}>{t("aurora_alt")}</div>
                                  <div style={{ fontSize: 10, color: "rgba(94,234,212,0.65)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>{NX(item.alt)}</div>
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
                            {item.wp_order && (
                              <span title={t("wp_order_title")} style={{ fontSize: 9, color: "rgba(251,220,80,0.75)", background: "rgba(251,220,80,0.07)", border: "1px solid rgba(251,220,80,0.22)", borderRadius: 3, padding: "1px 5px" }}>
                                {t("wp_order", { n: item.wp_order })}
                              </span>
                            )}
                            {item.waypoint?.chat_code && (
                              <ChatCode code={item.waypoint.chat_code} copied={copiedCode} onCopy={setCopiedCode} />
                            )}
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
      {activeTab === "pieces" && isArmorSet && (() => {
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
            {obsItems && LEGENDARIES[selectedLeg].weights.map(w => (
              <div key={w} style={{ margin: "10px 14px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(226,201,126,0.5)", marginBottom: "6px" }}>
                  {weightL[w] ?? w}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                  {LEGENDARIES[selectedLeg].slots.map(s => {
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
            {LEGENDARIES[selectedLeg].slots.map(s => {
              const a = (LEGENDARIES[selectedLeg].arcanum ?? {})[s]; if (!a) return null;
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
          {selectedLeg === "eikasia" && (() => {
            const tier = (k) => {
              const s = apiAch[k] ?? {};
              if (s.done === true || achManualDone[k] === true) return (s.max > 0 ? s.max : 150);
              return s.current ?? 0;
            };
            const dust = tier("eikasia_r1") + tier("eikasia_r2") + tier("eikasia_r3");
            const pct = Math.min(100, Math.round((dust / 450) * 100));
            return (
              <div style={{ margin: "6px 14px", padding: "11px 13px", background: "rgba(192,132,252,0.05)", border: "1px solid rgba(192,132,252,0.18)", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#c084fc", fontFamily: "'Cinzel', serif" }}>
                    {NX({ fr: "Fractalline Dust (vers les gants)", en: "Fractalline Dust (toward the gloves)" })}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: dust >= 450 ? "#4ade80" : "#c084fc" }}>{dust} / 450</div>
                </div>
                <div style={{ marginTop: 6, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: dust >= 450 ? "#4ade80" : "#c084fc", borderRadius: 3, transition: "width 0.3s" }} />
                </div>
                <div style={{ marginTop: 6, fontSize: "11px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.5)" }}>
                  {NX({ fr: "+4-6 par run quickplay · +25/semaine (Weekly Fractal Quickplay) · progression conservée en local entre les refresh, resynchronisée via Flask.", en: "+4-6 per quickplay run · +25/week (Weekly Fractal Quickplay) · progress kept locally across refreshes, re-synced via Flask." })}
                </div>
              </div>
            );
          })()}
          <RequirementsBlocks requirements={leg?.requirements} apiAch={apiAch} currencies={currencies} />
          <div className="section-label">Collections</div>
          <div style={{ margin: "2px 14px 6px", fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.35)" }}>{t("bits_tap_hint")}</div>
          {(leg?.raidAchievements ?? []).map(a => {
            const st = apiAch[a.key] ?? {};
            const manual = achManualDone[a.key] === true;
            const done = st.done === true || manual;
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: done ? "#4ade80" : legColor }}>
                      {done ? (st.done === true ? "✓" : NX({ fr: "✓ manuel", en: "✓ manual" })) : (locked ? (a.target ? `${cur}/${a.target} 🔒` : t("ach_locked")) : `${cur}/${mx || a.target || "?"}`)}
                    </div>
                    {st.done !== true && (
                      <button className="adj-btn"
                        title={NX({ fr: "Marquer fait manuellement (utile sans synchro Flask, ex. mobile)", en: "Mark done manually (useful without Flask sync, e.g. mobile)" })}
                        style={{ fontSize: "10px", padding: "2px 7px", opacity: manual ? 1 : 0.55 }}
                        onClick={(e) => { e.stopPropagation(); toggleAchManual(a.key); }}>
                        {manual ? NX({ fr: "annuler", en: "undo" }) : "☑"}
                      </button>
                    )}
                  </div>
                </div>
                {!done && a.rate && a.target && (() => {
                  // Un compteur muet ne dit pas quand il finira. On traduit le reste
                  // en runs et en semaines, a partir de la cadence declaree sur
                  // l'entree — jamais codee en dur ici.
                  const left = Math.max(0, (a.target ?? 0) - cur);
                  if (left <= 0) return null;
                  const wkly = a.rate.weekly ?? 0;
                  const runs = a.rate.perRun ? Math.ceil(left / a.rate.perRun) : null;
                  const wkPassive = wkly ? Math.ceil(left / wkly) : null;
                  const wk3 = (a.rate.perRun && wkly) ? Math.ceil(left / (a.rate.perRun * 3 + wkly)) : null;
                  return (
                    <div style={{ marginTop: 4, fontSize: 9.5, color: "rgba(251,220,80,0.7)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
                      {t("proj_left", { n: left, u: a.rate.unit })}
                      {runs !== null && <> · {t("proj_runs", { n: runs })}</>}
                      {wk3 !== null && <> · {t("proj_weeks3", { n: wk3 })}</>}
                      {wkPassive !== null && <> · {t("proj_weeks_passive", { n: wkPassive })}</>}
                    </div>
                  );
                })()}
                <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif", marginTop: "3px" }}>
                  {L(a.tip)}
                </div>
                {a.unlock && !done && (
                  <div style={{ marginTop: 6, padding: "6px 8px", background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 6, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", color: "rgba(251,146,60,0.85)", lineHeight: 1.5 }}>
                    {NX(a.unlock)}
                  </div>
                )}
                {isOpen && (() => {
                  // Une collection peut porter, cote sources, une liste de lieux a
                  // visiter indexee par son achievementId. Meme rendu qu'Aurora II.
                  const SDB = typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {};
                  let wl = null;
                  for (const leg of Object.values(SDB?.legendaries ?? {})) {
                    for (const col of Object.values(leg?.collections ?? {})) {
                      if (col?.id === a.achievementId && Array.isArray(col.items) && col.items.some(x => x.waypoint)) wl = col;
                    }
                  }
                  if (!wl) return null;
                  return (
                    <div style={{ marginTop: 8, borderTop: "1px solid rgba(226,201,126,0.08)", paddingTop: 7 }} onClick={e => e.stopPropagation()}>
                      {wl.note && (
                        <div style={{ fontSize: 10, color: "rgba(251,220,80,0.7)", fontFamily: "'Crimson Text', serif", marginBottom: 5, lineHeight: 1.5 }}>{NX(wl.note)}</div>
                      )}
                      {wl.requirements && (
                        <div style={{ fontSize: 10, color: "rgba(251,146,60,0.75)", fontFamily: "'Crimson Text', serif", marginBottom: 6, lineHeight: 1.5 }}>{NX(wl.requirements)}</div>
                      )}
                      <WaypointList items={wl.items} copied={copiedCode} onCopy={setCopiedCode} />
                    </div>
                  );
                })()}
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
                          <div style={{ marginBottom: 6, padding: "5px 8px", background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.15)", borderRadius: 6, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.7)", lineHeight: 1.5 }}>
                            {(mx || def.tierMax) > 0 ? t("bits_meta_req", { n: mx || def.tierMax, m: def.subs.length }) : t("bits_meta_note")}
                            {mx > 0 && !done && cur < mx ? " " + t("bits_meta_left", { n: mx - cur }) : ""}
                            {Object.keys(achSubStatus).length === 0 ? " " + t("bits_meta_nostatus") : ""}
                            <div style={{ marginTop: 3, fontSize: "9.5px", opacity: 0.75 }}>
                              {def.subsSource === "wiki" ? t("bits_src_wiki", { d: def.subsVerified || "?" }) : t("bits_src_api")}
                            </div>
                            {(() => {
                              // Auto-diagnostic : si le nombre d'eligibles completes diverge du
                              // compteur officiel, la liste curee est fausse — mieux vaut le dire.
                              if (def.subsSource !== "wiki" || mx === 0 || done) return null;
                              if (Object.keys(achSubStatus).length === 0) return null;
                              const hit = def.subs.filter(s2 => achSubStatus[String(s2.id)]?.done === true).length;
                              if (hit === cur) return null;
                              return (
                                <div style={{ marginTop: 3, fontSize: "9.5px", color: "rgba(251,146,60,0.85)" }}>
                                  {t("bits_src_mismatch", { a: hit, b: cur })}
                                </div>
                              );
                            })()}
                          </div>
                          {(() => {
                            // Chemin le plus court : parmi les restants, les N moins couteux
                            // ou N = ce qu'il manque pour atteindre le seuil.
                            const need = (mx || def.tierMax || 0) - cur;
                            if (need <= 0 || done) return null;
                            const rest = def.subs.filter(s2 => achSubStatus[String(s2.id)]?.done !== true);
                            if (rest.length === 0 || rest.length <= need) return null;
                            const pick = [...rest].sort((a2, b2) => (a2.score ?? 9) - (b2.score ?? 9)).slice(0, need);
                            const spare = rest.length - need;
                            return (
                              <div style={{ marginBottom: 7, padding: "6px 9px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.22)", borderRadius: 6 }}>
                                <div style={{ fontSize: "10.5px", fontWeight: 600, color: "#4ade80", marginBottom: 3 }}>
                                  {t("bits_path", { n: need, s: spare })}
                                </div>
                                <div style={{ fontSize: "10.5px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.8)", lineHeight: 1.55 }}>
                                  {pick.map(s2 => s2.name).join(" · ")}
                                </div>
                              </div>
                            );
                          })()}
                          {[...def.subs]
                            .map((s, idx) => ({ s, idx, d: achSubStatus[String(s.id)]?.done === true }))
                            .sort((a, b) => (a.d === b.d ? ((a.s.score ?? 9) - (b.s.score ?? 9)) || a.idx - b.idx : (a.d ? 1 : -1)))
                            .map(({ s }) => {
                            const ss = achSubStatus[String(s.id)] ?? {};
                            const sDone = ss.done === true;
                            // Un succès curé sans id n'est pas exposé par l'API : pas de statut possible.
                            const noApi = typeof s.id !== "number";
                            return (
                              <div key={s.id ?? s.name} style={{ padding: "3px 0" }}>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", fontSize: "11px", color: sDone ? "#4ade80" : "rgba(226,201,126,0.6)" }}>
                                  <span style={{ fontSize: "10px", width: 12, flexShrink: 0 }}>{noApi ? "◌" : sDone ? "✓" : "○"}</span>
                                  {!sDone && s.tier && (
                                    <span title={t("bits_why", { v: s.vol ?? 0, p: s.prereq ?? 0, a: s.ap ?? 0 })}
                                      style={{ fontSize: "9.5px", flexShrink: 0, color: s.tier === "easy" ? "#4ade80" : s.tier === "med" ? "#e2c97e" : "rgba(251,146,60,0.9)" }}>
                                      {s.tier === "easy" ? "⚡" : s.tier === "med" ? "◐" : "▲"}
                                    </span>
                                  )}
                                  <span style={{ textDecoration: sDone ? "line-through" : "none", opacity: sDone ? 0.7 : 1 }}>{s.name}{!sDone && ss.max > 1 ? ` (${ss.current ?? 0}/${ss.max})` : ""}</span>
                                </div>
                                {noApi && (
                                  <div style={{ margin: "1px 0 2px 30px", fontSize: "10px", color: "rgba(251,146,60,0.6)", fontStyle: "italic" }}>{t("bits_no_api")}</div>
                                )}
                                {!sDone && (s.req || s.desc) && (
                                  <div style={{ margin: "1px 0 2px 30px", fontSize: "10px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.42)", lineHeight: 1.45 }}>
                                    {s.req || s.desc}
                                    {(s.prereq ?? 0) > 0 ? " " + t("bits_has_prereq") : ""}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize: "11px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.55)", lineHeight: 1.5 }}>
                          {def.req ? <div>🎯 {def.tierMax > 0 ? def.req.replace(/\s{2,}/, ` ${def.tierMax} `) : def.req}</div> : null}
                          {def.desc ? <div style={{ marginTop: 3, fontStyle: "italic", opacity: 0.8 }}>{def.desc}</div> : null}
                          {locked && def.lockedTxt ? <div style={{ marginTop: 3, color: "rgba(251,146,60,0.7)" }}>🔒 {def.lockedTxt}</div> : null}
                          {!def.req && !def.desc && <div style={{ fontStyle: "italic", opacity: 0.6 }}>—</div>}
                          {def.counterNoSteps && (
                            <div style={{ marginTop: 5, fontSize: "10px", color: "rgba(251,146,60,0.8)" }}>{t("bits_counter_gap", { n: def.tierMax })}</div>
                          )}
                        </div>
                      )
                    ) : <React.Fragment>
                    {mx > 0 && def.bits.length > mx && (
                      <div style={{ marginBottom: 6, padding: "5px 8px", background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.15)", borderRadius: 6, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.7)", lineHeight: 1.5 }}>
                        {t("bits_meta_req", { n: mx, m: def.bits.length })}
                        {!done && cur < mx ? " " + t("bits_meta_left", { n: mx - cur }) : ""}
                      </div>
                    )}
                    {def.bits.map((b, i) => {
                      const stepDone = done || doneBits.has(i);
                      const childId = def.bitAch?.[i];
                      const childSt = childId !== undefined ? (achSubStatus[String(childId)] ?? {}) : null;
                      let label = null;
                      if (b.type === "Item" && b.id) label = def.names?.[String(b.id)] ?? null;
                      else if (b.type === "Text" && b.text) label = b.text;
                      else if (b.type === "Skin" && b.id) { const s = def.names?.["s" + String(b.id)]; label = s ? `${s} (skin)` : null; }
                      else if (b.type === "Minipet" && b.id) { const m = def.names?.["m" + String(b.id)]; label = m ? `${m} (mini)` : null; }
                      if (!label && a.bitNames && a.bitNames[i]) label = NX(a.bitNames[i]);
                      let unnamed = false;
                      if (!label) { label = t("bits_step", { n: i + 1 }); unnamed = true; }
                      return (
                        <div key={i} style={{ padding: "2px 0" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", fontSize: "11px", color: stepDone ? "#4ade80" : "rgba(226,201,126,0.6)" }}>
                            <span style={{ fontSize: "10px", width: 12, flexShrink: 0 }}>{stepDone ? "✓" : "○"}</span>
                            <span style={{ textDecoration: stepDone ? "line-through" : "none", opacity: stepDone ? 0.7 : 1 }}>{label}</span>
                            {!stepDone && childSt && childSt.max > 1 && (
                              <span style={{ fontSize: "10px", color: legColor, opacity: 0.75, flexShrink: 0 }}>{childSt.current ?? 0}/{childSt.max}</span>
                            )}
                          </div>
                          {!stepDone && (() => {
                            const enKey = (b.type === "Item" && b.id) ? (def.namesEn?.[String(b.id)] ?? null)
                              : (b.type === "Skin" && b.id) ? (def.namesEn?.["s" + String(b.id)] ?? null)
                              : (b.type === "Minipet" && b.id) ? (def.namesEn?.["m" + String(b.id)] ?? null)
                              : (b.type === "Text" ? (b.text ?? null) : null);
                            const btip = (a.bitTips && enKey && a.bitTips[enKey]) ?? a.bitTips?.[i]
                              ?? (unnamed ? { fr: "Libellé non publié par l'API — le panneau de succès en jeu l'affiche.", en: "Label not published by the API — the in-game achievement panel shows it." } : null);
                            return btip ? (
                              <div style={{ margin: "1px 0 3px 18px", fontSize: "10px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.42)", lineHeight: 1.45 }}>{NX(btip)}</div>
                            ) : null;
                          })()}
                        </div>
                      );
                    })}
                    </React.Fragment>)}
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
            <div style={{ margin: "6px 14px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[["gen1", "Gen 1"], ["gen2", "Gen 2"], ["gen3", NX({ fr: "Gen 3 — Aurene", en: "Gen 3 — Aurene" })], ["other", NX({ fr: "Divers", en: "Misc" })]].map(([g, lbl]) => (
                <button key={g}
                  className={`leg-btn ${wpnGen === g ? "active" : ""}`}
                  style={{ "--leg-color": "#60a5fa", "--leg-bg": "rgba(96,165,250,0.12)", fontSize: 10, padding: "6px 10px" }}
                  onClick={() => { setWpnGen(g); try { localStorage.setItem("gw2_weapons_gen", g); } catch (_) {} }}>
                  {lbl}{wpnItems ? ` (${wpnGenOwned(g)}/${wpnGenCount(g)})` : ""}
                </button>
              ))}
            </div>
            <div style={{ margin: "6px 14px", padding: "8px 12px", background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.12)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.55)" }}>
              {wpnGen === "gen1" && NX({ fr: "Gen 1 : précurseur via CP, forge ou craft. Par arme : Gift of Fortune (77 clovers + 250 ectos + T6 → onglet T6) + Gift of Mastery (250 Obsidian Shards + Bloodstone Shard + Gift of Exploration + 500 monnaie de donjon).", en: "Gen 1: precursor via TP, forge or crafting. Per weapon: Gift of Fortune (77 clovers + 250 ectos + T6 → T6 tab) + Gift of Mastery (250 Obsidian Shards + Bloodstone Shard + Gift of Exploration + 500 dungeon currency)." })}
              {wpnGen === "gen2" && NX({ fr: "Gen 2 : précurseur par collections (3 tiers). Par arme : Mystic Tribute (77 clovers + 250 coins + T6 ×2 → onglet T6) + Gift of Maguuma/Desert Mastery + gift spécifique. Pas d'achat CP possible.", en: "Gen 2: precursor via collections (3 tiers). Per weapon: Mystic Tribute (77 clovers + 250 coins + 2× T6 gifts → T6 tab) + Gift of Maguuma/Desert Mastery + weapon-specific gift. Not purchasable on TP." })}
              {wpnGen === "gen3" && NX({ fr: "Gen 3 (Aurene) : précurseur craft 500 + Gift of Jade Mastery + Draconic Tribute (38 clovers). Variantes de dragons débloquées après liaison. Totaux dans l'onglet Devises.", en: "Gen 3 (Aurene): crafted 500 precursor + Gift of Jade Mastery + Draconic Tribute (38 clovers). Elder Dragon variants unlock after binding. Totals in the Currencies tab." })}
              {wpnGen === "other" && NX({ fr: "Divers : Klobjarne Geirr (lance JW — collections Janthir + Draconic Tribute) et Aetheric Anchor (VoE). Coûts spécifiques par arme — voir la fiche wiki de chacune.", en: "Misc: Klobjarne Geirr (JW spear — Janthir collections + Draconic Tribute) and Aetheric Anchor (VoE). Weapon-specific costs — check each wiki page." })}
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
            {wpnGen === "gen3" && (leg?.collectionNoteKeys ?? []).map(k => (
              <div key={k} style={{ margin: "8px 14px", padding: "10px 13px", background: "rgba(226,201,126,0.03)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.5)" }}>
                {t(k)}
              </div>
            ))}
          </div>
        );
      })()}

      {activeTab === "currencies" && (
        <div>
          {!leg?.raidAchievements && <RequirementsBlocks requirements={leg?.requirements} apiAch={apiAch} currencies={currencies} />}
          <div className="section-label">{t("sec_currency", { name: leg?.name })}</div>
          {(leg?.currencyNoteKeys ?? []).map(k => (
            <div key={k} style={{ margin: "6px 14px", padding: "8px 12px", background: "rgba(226,201,126,0.03)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.55)" }}>
              {t(k)}
            </div>
          ))}
          {leg?.currencyNote && (
            <div style={{ margin: "6px 14px", padding: "8px 12px", background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.18)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(251,146,60,0.8)", lineHeight: 1.5 }}>
              {NX(leg.currencyNote)}
            </div>
          )}
          {isWeapons && (
            <div style={{ margin: "6px 14px", padding: "8px 12px", background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.55)" }}>
              {t("wpn_goal", { n: wpnTarget.size, o: wpnTargetOwned, r: wpnRemainingCount })}
            </div>
          )}
                    {isArmorSet && (
            <div style={{ margin: "6px 14px", padding: "8px 12px", background: "rgba(129,140,248,0.05)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "8px", fontFamily: "'Crimson Text', serif", fontSize: "12px", color: "rgba(226,201,126,0.55)" }}>
              {t("obs_per_piece_note", { n: obsRemainingCount })}
            </div>
          )}
          {gtStocks?._bags_ok === false && (
            <div style={{ margin: "6px 14px", padding: "7px 11px", background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: 7, fontSize: 10, fontFamily: "'Crimson Text', serif", color: "rgba(251,146,60,0.8)" }}>
              {t("bags_missing")}
            </div>
          )}
          {mainProgress.filter(cur => !(cur.kind === "karma" && cur.required < (cur.showAbove ?? 0))).map(cur => (
            <div key={cur.id} style={{ margin: "6px 14px", padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ fontSize: "16px" }}>{cur.icon}</span>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600 }}>{NX(cur.name)}</div>
                    <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif" }}>
                      {t("req_missing", { req: cur.required.toLocaleString(), miss: Math.max(0, cur.required - cur.owned).toLocaleString() })}
                      {(cur.extrasPending ?? []).length > 0 && (
                        <div style={{ marginTop: 3 }}>
                          {cur.extrasPending.map((x, xi) => (
                            <div key={xi} style={{ fontSize: 9, color: "rgba(251,146,60,0.65)", fontFamily: "'Crimson Text', serif", lineHeight: 1.45 }}>
                              + {x.amount.toLocaleString()} — {NX(x.label)}{x.estimated ? " ⚠" : ""}
                            </div>
                          ))}
                        </div>
                      )}
                      {(currencies.__notSent ?? []).includes(cur.id) && (
                        <div style={{ marginTop: 3, fontSize: 9, color: "rgba(248,113,113,0.8)", fontFamily: "'Crimson Text', serif", lineHeight: 1.45 }}>
                          {t("cur_not_sent")}
                        </div>
                      )}
                      {(() => {
                        // Sources sans depense d'or, et repetables : l'information la
                        // plus utile a qui demarre sans stock. Elle vit dans les
                        // sources, elle n'etait affichee nulle part.
                        const comps = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.craft_components ?? {};
                        const comp = Object.values(comps).find(c => c?.apiId === cur.apiId);
                        if (!comp?.free_sources_note) return null;
                        return (
                          <div style={{ marginTop: 4, padding: "6px 9px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.22)", borderRadius: 5 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(74,222,128,0.9)", fontFamily: "'Cinzel', serif", letterSpacing: "0.03em", marginBottom: 2 }}>
                              {t("free_sources")}
                            </div>
                            <div style={{ fontSize: 10, color: "rgba(74,222,128,0.7)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
                              {NX(comp.free_sources_note)}
                            </div>
                          </div>
                        );
                      })()}
                      {cur.aside && (
                        <div style={{ marginTop: 3, fontSize: 9, color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif", lineHeight: 1.45 }}>
                          {NX(cur.aside)}
                        </div>
                      )}
                      {cur.kind === "karma" && (cur.extrasPending ?? []).length > 0 && (
                        <div style={{ marginTop: 3, fontSize: 9, color: "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif" }}>
                          {t("karma_note")}
                        </div>
                      )}
                      {cur.extrasTotal > 0 && (cur.extrasPending ?? []).length === 0 && (
                        <div style={{ marginTop: 3, fontSize: 9, color: "rgba(74,222,128,0.6)", fontFamily: "'Crimson Text', serif" }}>
                          {t("cur_extras_done")}
                        </div>
                      )}
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
      {activeTab === "trinkets" && isTrinkets && (
        <TrinketGuide
          curKey={(leg.trinketKeys ?? []).includes(selTrinket) ? selTrinket : (leg.trinketKeys ?? [])[0]}
          apiAch={apiAch} gtOwnedIds={gtOwnedIds} gtManualOwnedIds={gtManualOwnedIds}
          trinketSteps={trinketSteps} toggleStep={toggleTrinketStep} />
      )}

      {activeTab === "guide" && leg?.isGuideTrinket && (
        <TrinketGuide
          curKey={selectedLeg}
          apiAch={apiAch} gtOwnedIds={gtOwnedIds} gtManualOwnedIds={gtManualOwnedIds}
          trinketSteps={trinketSteps} toggleStep={toggleTrinketStep} />
      )}

      {activeTab === "currencies" && (() => {
        const meta = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?._meta ?? {};
        const cc = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.craft_components ?? {};
        const S = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.legendaries?.[selectedLeg] ?? {};
        const reqMap = (meta.common_required ?? {})[selectedLeg] ?? null;
        const perPiece = !!(reqMap && reqMap.perPiece);
        const mult = perPiece ? Math.max(1, obsRemainingCount || 1) : 1;
        const mats = COMMON_MATS
          .map(m => ({ ...m, req: reqMap ? reqMap[m.id] : m.required }))
          .filter(m => m.req != null)
          .map(m => ({ ...m, req: m.req * mult }));
        // Arbre des gifts : composants de tête + matériaux rattachés (index inverse needed_for)
        const tops = (S.components ?? []);
        const subsOf = (g) => Object.entries(cc).filter(([, v]) => (v.needed_for ?? []).includes(g));
        const label = (k) => (cc[k]?.name ? NXS(cc[k].name) : k.replace(/_/g, " "));
        return (
          <div>
            {mats.length > 0 && (
              <>
                <div className="section-label">{NX({ fr: "Matériaux communs", en: "Common materials" })}</div>
                {perPiece && (
                  <div style={{ margin: "2px 14px 6px", fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.4)" }}>
                    {NX({ fr: `Coût par pièce × ${mult} pièce(s) restante(s).`, en: `Per-piece cost × ${mult} remaining piece(s).` })}
                  </div>
                )}
                {mats.map(m => {
                  const owned = commonMats[m.id] ?? 0;
                  const pct = Math.min(100, (owned / m.req) * 100);
                  const open = expanded === `cm_${m.id}`;
                  return (
                    <div key={m.id} style={{ margin: "6px 14px", padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px" }}
                      onClick={() => setExpanded(open ? null : `cm_${m.id}`)}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <span style={{ fontSize: "16px" }}>{m.icon}</span>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 600 }}>{NX(m.name)}</div>
                            <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif" }}>
                              {t("req_missing", { req: m.req, miss: Math.max(0, m.req - owned) })}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: "18px", fontWeight: 700, color: pct >= 100 ? "#4ade80" : "#e2c97e" }}>
                          {owned}<span style={{ fontSize: "11px", opacity: 0.4 }}>/{m.req}</span>
                        </div>
                      </div>
                      <div style={{ marginTop: 7, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "#4ade80" : legColor, borderRadius: 2 }} />
                      </div>
                      {open && m.tip && (
                        <div style={{ marginTop: 7, fontSize: "11px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.5)" }}>{NX(m.tip)}</div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {tops.length > 0 && (() => {
              const KINDS = [
                ["advanced_craft", { fr: "◆ Crafts avancés (gifts)", en: "◆ Advanced crafts (gifts)" }],
                ["craftable",      { fr: "⚒ Craftables", en: "⚒ Craftable" }],
                ["acquire",        { fr: "🗺 À récupérer", en: "🗺 To acquire" }],
                ["precursor",      { fr: "★ Précurseurs (collections)", en: "★ Precursors (collections)" }],
              ];
              const coin = (c) => {
                const g = Math.floor(c / 10000), s = Math.floor((c % 10000) / 100);
                return g > 0 ? `${g},${String(s).padStart(2, "0")} po` : `${s} pa`;
              };
              const renderTradeoff = (t) => {
                const px = (id) => tpPrices[String(id)]?.sell ?? 0;
                const cost = (t.ingredients ?? []).reduce((s, i) => s + px(i.apiId) * i.qty, 0);
                const unit = cost / (t.yield || 1);
                const direct = px(t.target_api_id);
                if (!cost || !direct) return null;
                const craftWins = unit < direct;
                return (
                  <div style={{ marginTop: 7, padding: "7px 9px", background: "rgba(94,234,212,0.05)", border: "1px solid rgba(94,234,212,0.15)", borderRadius: 6, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
                    <div style={{ color: craftWins ? "#4ade80" : "#fbbf24", fontWeight: 600 }}>
                      {craftWins
                        ? NX({ fr: `⭐ Craft rentable — ${coin(unit)}/unité contre ${coin(direct)} à l'achat`, en: `⭐ Crafting pays off — ${coin(unit)}/unit vs ${coin(direct)} to buy` })
                        : NX({ fr: `Acheter — ${coin(direct)}/unité contre ${coin(unit)} en craft`, en: `Buy — ${coin(direct)}/unit vs ${coin(unit)} crafted` })}
                    </div>
                    <div style={{ color: "rgba(226,201,126,0.45)", marginTop: 2 }}>
                      {NX({ fr: `Rendement retenu : ${t.yield}/forge. Prix de vente immédiate, hors coffres de méta (gratuits).`, en: `Assumed yield: ${t.yield}/forge. Instant-buy prices, excluding meta chests (free).` })}
                    </div>
                  </div>
                );
              };
              const byKind = {};
              for (const g of tops) {
                const k = cc[g]?.kind ?? "acquire";
                (byKind[k] = byKind[k] ?? []).push(g);
              }
              return (
                <>
                <div className="section-label">{NX({ fr: "Arbre des composants", en: "Component tree" })}</div>
                <div style={{ margin: "2px 14px 6px", fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.35)" }}>
                  {NX({ fr: "Toucher un composant pour voir ses matériaux et leurs sources.", en: "Tap a component to see its materials and their sources." })}
                </div>
                {KINDS.filter(([k]) => (byKind[k] ?? []).length > 0).map(([k, klabel]) => (
                  <div key={k}>
                    <div style={{ margin: "10px 14px 4px", fontSize: "10px", letterSpacing: "0.08em", fontFamily: "'Cinzel', serif", color: "rgba(226,201,126,0.45)" }}>{NX(klabel)}</div>
                    {byKind[k].map(g => {
                      const C = cc[g] ?? {};
                      const subs = subsOf(g);
                      const srcs = C.sources ?? [];
                      const open = expanded === `gift_${g}`;
                      const bestSrc = C.best ? srcs.find(s => s.type === C.best) : null;
                      const stock = C.apiId ? (gtStocks?.[String(C.apiId)] ?? null) : null;
                      return (
                        <div key={g} style={{ margin: "6px 14px", padding: "11px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px" }}
                          onClick={() => setExpanded(open ? null : `gift_${g}`)}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: legColor, fontFamily: "'Cinzel', serif" }}>{open ? "▾ " : "▸ "}{label(g)}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>
                              {stock != null && <span style={{ fontSize: "11px", color: "#5eead4", fontFamily: "'Crimson Text', serif" }}>{stock}</span>}
                              <span style={{ fontSize: "10px", color: "rgba(226,201,126,0.3)", fontFamily: "'Crimson Text', serif" }}>
                                {subs.length > 0 ? NX({ fr: `${subs.length} mat.`, en: `${subs.length} mat.` }) : (srcs.length > 1 ? NX({ fr: `${srcs.length} voies`, en: `${srcs.length} routes` }) : "")}
                              </span>
                            </div>
                          </div>
                          {bestSrc && (
                            <div style={{ marginTop: 5, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", color: "rgba(74,222,128,0.85)", lineHeight: 1.45 }}>
                              ⭐ {NX(bestSrc.tip)}{C.best_reason ? <span style={{ opacity: 0.65 }}> — {NX(C.best_reason)}</span> : null}
                            </div>
                          )}
                          {!bestSrc && srcs[0]?.tip && (
                            <div style={{ marginTop: 5, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.45)", lineHeight: 1.45 }}>{NX(srcs[0].tip)}</div>
                          )}
                          {C.tradeoff && renderTradeoff(C.tradeoff)}
                          {open && (
                            <div style={{ marginTop: 8, borderTop: "1px solid rgba(226,201,126,0.08)", paddingTop: 7 }}>
                              {subs.map(([sk, sv]) => {
                                const st = sv.apiId ? (gtStocks?.[String(sv.apiId)] ?? null) : null;
                                const s0 = (sv.sources ?? [])[0];
                                return (
                                  <div key={sk} style={{ padding: "3px 0" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: "11px" }}>
                                      <span style={{ color: "rgba(226,201,126,0.75)" }}>{NXS(sv.name ?? sk)}</span>
                                      {st != null && <span style={{ color: "#5eead4", fontFamily: "'Crimson Text', serif" }}>{st}</span>}
                                    </div>
                                    {s0?.tip && <div style={{ fontSize: "10px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.4)", lineHeight: 1.4 }}>{NX(s0.tip)}</div>}
                                  </div>
                                );
                              })}
                              {srcs.filter(s => s !== bestSrc).map((s, si) => (
                                <div key={si} style={{ padding: "3px 0", fontSize: "10px", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.4)", lineHeight: 1.45 }}>
                                  ○ {NX(s.tip)}
                                </div>
                              ))}
                              {subs.length === 0 && srcs.length === 0 && (
                                <div style={{ fontSize: "10px", fontStyle: "italic", color: "rgba(226,201,126,0.35)" }}>{NX({ fr: "Détail dans l'onglet Guide.", en: "Details in the Guide tab." })}</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                </>
              );
            })()}
          </div>
        );
      })()}

      {false && activeTab === "common" && (
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

      {/* ── Diagnostic : métas sans liste d'étapes ──────────────────
          Auto-entretenu : tout méta de type compteur téléchargé qui
          n'expose ni bits ni liste curée apparaît ici. C'est la seule
          source exhaustive — le nom d'un succès ne dit pas sa nature. */}
      {(() => {
        const listless = Object.entries(achBitsDefs)
          .filter(([, d]) => (d.tierMax ?? 0) > 1 && (d.subs ?? []).length === 0 && (d.bits ?? []).length === 0)
          .map(([id, d]) => ({ id, name: d.name ?? d.req ?? id, tierMax: d.tierMax, req: d.req }));
        const gaps = listless.filter(g => !noStepsDeclared(g.id) && isAchievementMeta(g.req));
        const counters = listless.filter(g => noStepsDeclared(g.id) || !isAchievementMeta(g.req));
        const curatedN = Object.values(achBitsDefs).filter(d => d.subsSource === "wiki").length;
        const catN = Object.values(achBitsDefs).filter(d => d.subsSource === "category").length;
        if (Object.keys(achBitsDefs).length === 0) return null;
        return (
          <div style={{ margin: "14px", padding: "9px 12px", background: gaps.length > 0 ? "rgba(248,113,113,0.05)" : "rgba(74,222,128,0.04)", border: `1px solid ${gaps.length > 0 ? "rgba(248,113,113,0.25)" : "rgba(74,222,128,0.18)"}`, borderRadius: 7 }}>
            <div onClick={() => setDiagOpen(v => !v)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Cinzel', serif", letterSpacing: "0.04em", color: gaps.length > 0 ? "rgba(248,113,113,0.9)" : "rgba(74,222,128,0.8)" }}>
                {t("diag_title", { n: gaps.length })}
              </span>
              <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)" }}>{diagOpen ? "▲" : "▼"}</span>
            </div>
            {diagOpen && (
              <div style={{ marginTop: 5 }}>
                <div style={{ fontSize: 9, color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif", marginBottom: 4 }}>
                  {t("diag_scope")}
                </div>
                <button
                  onClick={() => { setDiagScanning(true); setDiagAll(null); scanAllMetas().then(r => { setDiagAll(r); setDiagScanning(false); }); }}
                  disabled={diagScanning}
                  style={{ fontSize: 9, fontFamily: "'Cinzel', serif", letterSpacing: "0.04em", padding: "3px 9px", marginBottom: 6, cursor: diagScanning ? "wait" : "pointer", background: "rgba(226,201,126,0.07)", border: "1px solid rgba(226,201,126,0.25)", borderRadius: 4, color: "rgba(226,201,126,0.8)" }}>
                  {diagScanning ? t("diag_scanning") : t("diag_scan")}
                </button>
                {diagAll && (
                  <div style={{ marginBottom: 6, paddingBottom: 5, borderBottom: "1px solid rgba(226,201,126,0.1)" }}>
                    <div style={{ fontSize: 9.5, color: "rgba(226,201,126,0.55)", fontFamily: "'Crimson Text', serif" }}>
                      {t("diag_all_done", { n: diagAll.checked, g: diagAll.gaps.length })}
                      {(diagAll.counters ?? []).length > 0 && <> {t("diag_counters", { n: diagAll.counters.length })}</>}
                    </div>
                    {diagAll.gaps.map(g => (
                      <div key={g.id} style={{ fontSize: 10, color: "rgba(226,201,126,0.7)", fontFamily: "'Crimson Text', serif", lineHeight: 1.6 }}>
                        · <span style={{ color: "rgba(248,113,113,0.8)" }}>{g.id}</span> — {g.name} ({t("diag_threshold", { n: g.tierMax })}) · {g.leg}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 9.5, color: "rgba(226,201,126,0.45)", fontFamily: "'Crimson Text', serif", marginBottom: 4 }}>
                  {t("diag_counts", { w: curatedN, c: catN })}
                  {counters.length > 0 && <> · {t("diag_counters", { n: counters.length })}</>}
                </div>
                {gaps.length === 0
                  ? <div style={{ fontSize: 10, color: "rgba(74,222,128,0.7)", fontFamily: "'Crimson Text', serif" }}>{t("diag_none")}</div>
                  : gaps.map(g => (
                      <div key={g.id} style={{ fontSize: 10, color: "rgba(226,201,126,0.7)", fontFamily: "'Crimson Text', serif", lineHeight: 1.6 }}>
                        · <span style={{ color: "rgba(248,113,113,0.8)" }}>{g.id}</span> — {g.name} ({t("diag_threshold", { n: g.tierMax })})
                      </div>
                    ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
    </LangContext.Provider>
  );
}
