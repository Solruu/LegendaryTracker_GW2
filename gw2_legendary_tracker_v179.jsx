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
    tab_bounties: "Bounties ({n}/5)",
    tab_common: "Materials",
    tab_currencies: "Progress",
    tab_pieces: "⬡ Pieces ({n}/18)",
    tab_collections: "✦ Collections",
    tab_weapons: "⚔ Weapons ({n}/{m})",
    wpn_target_hint: "Tap a weapon to add/remove it from your goal. ✓ = owned (armory). Counts include every generation.",
    wpn_goal: "Goal: {n} weapon(s) targeted — {o} owned, {r} remaining",
    wpn_goal_default: "No weapon selected — pick your first targets (axe, mace, hammer?).",
    wpn_resolving: "Resolving weapon names via GW2 API…",
    bits_meta_note: "Meta-achievement — its steps are the map achievements below (completion states sync via Flask).",
    bits_meta_nostatus: "Connect the Flask API to see per-achievement completion.",
    t6_src1: "Eternal Ice loop (IBS): daily strikes (~90-100 shards/day, 30-45 min) or Drakkar + Bjora chests. Conversion at Eye of the North (WP [&BBsDAAA=]) via Kjep Corrson — UNLOCK REQUIRED: buy 'Unlock Eternal Ice Trader' from Lady Camilla (hub upgrade vendor). 75 shards → pouch of 25 LW4 map currency, unlimited; also trades directly against Volatile Magic. Note: the Eternal Ice vendor works even without PoF (rare exception in the hub).",
    t6_src2: "Trophy Shipments: 250 Volatile Magic + 1g from the Volatile Magic Collectors on each LW4 map (near the main waypoints) — T5/T6 trophies worth ~2-5g each; THE volume source. Skip Material Shipments (lower tiers). Extra VM: Dragonfall meta, daily LW4 train.",
    t6_src3: "T5→T6 Mystic Forge promotion: 250 T5 + dust + spirit shards → 5-12 T6 (~35-50/stack). Profitability varies — check gw2efficiency (venom sacs and claws are often not worth it). Buy remaining deficits on the TP at the end.",
    bits_tap_hint: "Tap a collection to expand its steps.",
    bits_locked_note: "Collection locked in-game — steps shown for reference; progress will appear once unlocked.",
    bits_nodata_note: "No progress yet — the API only reports collections you have started. Steps come from the tracker's own data.",
    unlock_prereq: "Requires:",
    unlock_item: "Unlocked by:",
    unlock_reward: "Rewards:",
    bits_loading: "Loading step definitions…",
    tab_cadences: "Timegates",
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
    cad_perchar_note: "(per-character cap counted on ONE character)",
    cad_season_note: "Seasonal cap: no weekly rate. Off-seasons produce nothing — count in seasons, not weeks.",
    cad_rng_note: "Random drop: the cap bounds attempts, not gains. No end date can be given.",
    cad_uncapped_only_note: "No capped source: the pace depends only on how much you play.",
    cad_onlyopen: "Only show what I can progress now",
    cad_bucket_open: "ready now",
    cad_bucket_done: "done for the period",
    cad_bucket_locked: "gated",
    cad_all_done: "Everything capped is taken for this period — nothing more until the next reset.",
    cad_nocap: "no cap",
    cad_tag_perchar: "per character",
    cad_tag_rng: "· random drop",
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
    prog_currency: "⚙ Counter: {n} {c} to accumulate — no step list, and none exists.",
    prog_kills: "⚙ Counter: {n} {w} to defeat — no step list, and none exists.",
    prog_generic: "⚙ Counter of {n} — no step list, and none exists.",
    prog_repeatable: "Repeatable: the surplus is lost, it does not carry over.",
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
    farm_perchar: "×char",
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
    reset_info_progress: "Progress saved between sessions",
    reset_info_common: "Shared stock (bank + material storage) · Synced via Flask API",
    per_day: "~{n}/day",
    days_left: "~{n}d left",
    status_completed: "✓ Completed",
    // Chars selector
    wvw_label: "World vs World",
    bounty_train_title: "[M] Bounty Train",
    btn_kill: "Kill",
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
    t6_src1: "Circuit Eternal Ice (IBS) : strikes quotidiennes (~90-100 shards/j, 30-45 min) ou Drakkar + coffres Bjora. Conversion à l'Eye of the North (WP [&BBsDAAA=]) via Kjep Corrson — DÉBLOCAGE REQUIS : acheter 'Unlock Eternal Ice Trader' chez Lady Camilla (le PNJ d'améliorations du hub). 75 shards → sachet de 25 monnaies de carte LW4, sans limite ; échange aussi directement contre de la Volatile Magic. Note : le vendor Eternal Ice fonctionne même sans PoF (exception rare du hub).",
    t6_src2: "Trophy Shipments : 250 Volatile Magic + 1 po chez les Volatile Magic Collectors de chaque carte LW4 (près des waypoints principaux) — trophées T5/T6 valant ~2-5 po pièce ; LA source de volume. Éviter les Material Shipments (tiers inférieurs). VM en plus : meta Dragonfall, train LW4 quotidien.",
    t6_src3: "Promotion T5→T6 en Forge : 250 T5 + dust + spirit shards → 5-12 T6 (~35-50/stack). Rentabilité variable — vérifier gw2efficiency (venom sacs et claws souvent non rentables). Acheter les déficits restants au TP en fin de parcours.",
    bits_tap_hint: "Touche une collection pour déplier ses étapes.",
    bits_locked_note: "Collection verrouillée en jeu — étapes affichées à titre indicatif ; la progression apparaîtra une fois débloquée.",
    bits_nodata_note: "Aucune progression — l'API ne renvoie que les collections déjà entamées. Les étapes viennent des données du tracker.",
    unlock_prereq: "Exige :",
    unlock_item: "Débloquée par :",
    unlock_reward: "Rend :",
    bits_loading: "Chargement des définitions d'étapes…",
    tab_cadences: "Timegates",
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
    cad_perchar_note: "(plafond par personnage compté sur UN personnage)",
    cad_season_note: "Plafond saisonnier : pas de débit hebdomadaire. Les intersaisons ne produisent rien — compter en saisons, pas en semaines.",
    cad_rng_note: "Drop aléatoire : le plafond borne les tentatives, pas les gains. Aucune date de fin ne peut être donnée.",
    cad_uncapped_only_note: "Aucune source plafonnée : le rythme ne dépend que du temps de jeu.",
    cad_onlyopen: "N'afficher que ce que je peux faire avancer maintenant",
    cad_bucket_open: "à lancer",
    cad_bucket_done: "fait pour la période",
    cad_bucket_locked: "verrouillé",
    cad_all_done: "Tout ce qui est plafonné est pris pour la période — rien de plus avant le prochain reset.",
    cad_nocap: "sans plafond",
    cad_tag_perchar: "par personnage",
    cad_tag_rng: "· drop aléatoire",
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
    prog_currency: "⚙ Compteur : {n} {c} à accumuler — pas de liste d’étapes, et il n’en existe pas.",
    prog_kills: "⚙ Compteur : {n} {w} à vaincre — pas de liste d’étapes, et il n’en existe pas.",
    prog_generic: "⚙ Compteur de {n} — pas de liste d’étapes, et il n’en existe pas.",
    prog_repeatable: "Répétable : le surplus est perdu, il ne se reporte pas.",
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
    farm_perchar: "×perso",
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
    reset_info_progress: "Progression sauvegardée entre sessions",
    reset_info_common: "Stock commun partagé (banque + stockage) · Synchronisé via API Flask",
    per_day: "~{n}/jour",
    days_left: "~{n}j restants",
    status_completed: "✓ Complété",
    wvw_label: "Monde contre Monde",
    bounty_train_title: "[M] Train de primes",
    btn_kill: "Tuer",
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
// Le selecteur du JSX groupe sous des noms courts ; les sources nomment les
// memes entites au long. Une seule table de correspondance, ici.
const SOURCES_ALIAS = { prismatic: "prismatic_champions_regalia", upgrades: "upgrades_combined" };
// ── Déblocage des collections ────────────────────────────────
// Le texte dit COMMENT débloquer, la porte dit SI c'est débloqué. Les deux
// vivent dans SOURCES_DB.collection_unlocks, indexés par identifiant de succès.
const unlockOf = (achievementId) => {
  if (achievementId == null) return null;
  const DB = typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {};
  return (DB.collection_unlocks ?? {})[String(achievementId)] ?? null;
};
// Libellé lisible d'une porte. `open` vaut true (franchie), false (fermée) ou
// null (indécidable en l'état). Un null s'affiche « ❔ » : on ne masque jamais
// une collection sur une porte qu'on ne sait pas trancher, parce que masquer une
// collection jouable coûte des semaines et en afficher une de trop coûte une ligne.
const makeGateStatus = (acct) => (gate) => {
  if (!Array.isArray(gate)) return [];
  return gate.map((g) => {
    if (g?.type === "fractal_scale") {
      const lvl = acct?.fractal_level;
      return {
        open: typeof lvl === "number" ? lvl >= g.value : null,
        label: NX({ fr: `Échelle de fractale ${g.value}`, en: `Fractal scale ${g.value}` })
          + (typeof lvl === "number" ? ` (${lvl})` : ""),
      };
    }
    if (g?.type === "mastery") {
      const eq = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();
      // Voie sûre quand la fiche donne la piste et le palier : l'API rend le
      // niveau atteint par piste, et le comparer au palier tranche sans
      // dépendre d'une correspondance de noms.
      if (g.track && typeof g.tier === "number") {
        const tous = acct?.masteries_all;
        const piste = Array.isArray(tous) ? tous.find(n => eq(n, g.track)) : null;
        const niveau = acct?.mastery_levels_by_name?.[piste ?? g.track];
        if (typeof niveau === "number") {
          return {
            open: niveau >= g.tier,
            label: NX({ fr: `Maîtrise « ${g.name} » — ${g.track} palier ${g.tier} (${niveau})`,
                        en: `'${g.name}' mastery — ${g.track} tier ${g.tier} (${niveau})` }),
          };
        }
      }
      const noms = acct?.masteries_unlocked;
      const tous = acct?.masteries_all;
      // Un nom absent de TOUTE la table n'est pas une porte fermée, c'est une
      // erreur de saisie. Le signaler plutôt que d'afficher un verrou : un faux
      // verrou masquerait une collection que le joueur peut lancer.
      const inconnu = Array.isArray(tous) && !tous.some(n => eq(n, g.name));
      // null = indécidable (scope absent, ou table publique injoignable).
      // Un tableau vide, lui, est une vraie réponse : aucune maîtrise.
      const open = inconnu ? null
        : Array.isArray(noms) ? noms.some(n => eq(n, g.name)) : null;
      const manque = acct && acct.masteries_scope_ok === false;
      return {
        open,
        label: NX({ fr: `Maîtrise « ${g.name} »`, en: `'${g.name}' mastery` })
          + (inconnu ? NX({ fr: " — ⚠ nom introuvable dans la table des maîtrises", en: " — ⚠ name not found in the mastery table" }) : "")
          + (manque ? NX({ fr: " — scope « progression » absent de la clé", en: " — key lacks the 'progression' scope" }) : ""),
      };
    }
    if (g?.type === "expansion") {
      const acc = acct?.access;
      return {
        open: Array.isArray(acc) ? acc.some(a => String(a).toLowerCase().includes(String(g.name).toLowerCase())) : null,
        label: NX({ fr: `Extension ${g.name}`, en: `${g.name} expansion` }),
      };
    }
    return { open: null, label: NX(g?.note) ?? String(g?.type ?? "?") };
  });
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
      {(T.achievements ?? []).length > 0 && !T.collections && (
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
        resetNote: { fr: "soft-reset daily 01h UTC+1 (min. 5-15h après récolte)", en: "daily soft-reset 01h UTC+1 (min. 5-15h after harvest)" },
        vendor: { fr: "Traveling Elonian Trader (Chute draconique) — 5 Kralkatite/jour/compte contre VM", en: "Traveling Elonian Trader (Dragonfall) — 5 Kralkatite/day/account for VM" },
        vendorWp: "Pact Command Waypoint [&BOAKAAA=] — Dragonfall",
        tip: { fr: "Nodes de Brandstone → Volatile Magic. Soft-reset à 01h (attendre 5-15h après récolte). Cap 50 nodes/compte/jour. Vendeur Dragonfall : 5 Kralkatite/jour contre VM.", en: "Brandstone nodes → Volatile Magic. Soft-reset at 01h (wait 5-15h after harvest). Cap 50 nodes/account/day. Dragonfall vendor: 5 Kralkatite/day for VM." } },
      { id: "lw4_dragonfall", name: { fr: "Chute draconique", en: "Dragonfall" }, subname: { fr: "Nodes de Mistborn Mote", en: "Mistborn Mote nodes" }, expansion: "LW4", icon: "DF",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Pact Command Waypoint", wpCode: "[&BOAKAAA=]",
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
    // Marqueur, plus une copie. Le contenu editorial de Vision — note de
    // deblocage, recompense, sous-collections — vivait ici EN TROISIEME
    // exemplaire, apres vision_1/vision_2 et vis_meta_1/vis_meta_2 dans les
    // sources. Personne ne le lisait : l'onglet Vision rend `visionCollections`
    // pour la progression et SOURCES_DB pour les etapes.
    // Cette cle reste parce qu'elle SERT DE DRAPEAU : `!T.collections` masque la
    // liste generique de succes pour les legendaires qui ont leur propre onglet.
    // La vider preserve ce comportement a l'identique ; lui donner un vrai nom
    // demanderait de toucher a la condition, donc a d'autres legendaires.
    collections: {},
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
        // surcoûts déclarés dans SOURCES_DB.craft_components.karma.qty_extras
        },
      { id: "blood_ruby", name: "Blood Ruby", required: 250, icon: "BR", apiId: 79280, mapNote: "Bloodstone Fen",
        aside: { fr: "Le plafond porte sur les nœuds : 35/jour/compte, rendement relevé à ~29 % — soit une dizaine de rubis par jour, pas plus. La piste de récompense du Marais rend un coffre de 50 d'un coup.", en: "The cap is on nodes: 35/day/account at a measured ~29% yield — about ten rubies a day, no more. The Bloodstone Fen reward track grants a 50-ruby strongbox in one go." },
        }, // surcoût déclaré dans SOURCES_DB.craft_components.blood_ruby.qty_extras
      { id: "winterberry", name: "Winterberry", required: 250, icon: "WB", apiId: 79899, mapNote: "Bitterfrost Frontier" },
      { id: "petrified", name: "Petrified Wood", required: 250, icon: "PW", apiId: 79469, mapNote: "Ember Bay + Draconis Mons" },
      { id: "jade", name: "Jade Shard", required: 250, icon: "JS", apiId: 80332, mapNote: "Lake Doric", },
      { id: "fire_orchid", name: "Fire Orchid Blossom", required: 250, icon: "FO", apiId: 81127, mapNote: "Draconis Mons" },
      { id: "orrian", name: "Orrian Pearl", required: 250, icon: "OP", apiId: 81706,
        aside: { fr: "Hors budget : les jetons d'harmonisation coûtent 10 perles pièce, et le 2e coffre du Reliquaire d'Abaddon en demande un. ⚠ Ne confonds pas les deux plafonds : les coffres sont limités à 2 par personnage et par jour et servent au Chiffre ancien, pas aux perles.", en: "Off-budget: attunement tokens cost 10 pearls each, and the 2nd Abaddon's Reliquary chest needs one. ⚠ Don't conflate the two caps: chests are limited to 2 per character per day and feed the Ancient Cipher, not the pearls." }, mapNote: "Siren's Landing",
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
    metas: [
      { id: "bf", name: { fr: "Confins de Givramer", en: "Bitterfrost Frontier" }, subname: { fr: "Nodes de Fresh Winterberry", en: "Fresh Winterberry nodes" }, expansion: "LW3", icon: "BF",
        farmType: "per_char",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Sorrow's Eclipse Waypoint", wpCode: "[&BH0JAAA=]",
        resetNote: { fr: "soft-reset daily 01h UTC+1 (min. 5-15h après dernière récolte)", en: "daily soft-reset 01h UTC+1 (min. 5-15h after last harvest)" },
        tip: { fr: "~50-80 Winterberries par perso et par jour — 21 nodes sur la map. Thaw Elixir requis pour la zone froide. Reset : soft-reset à 01h, mais attendre 5-15h après la dernière récolte avant d'y retourner.", en: "~50-80 Winterberries per character per day — 21 nodes on the map. Thaw Elixir required for the cold zone. Reset: soft-reset at 01h, but wait 5-15h after your last harvest before returning." } },
      { id: "eb", name: { fr: "Baie des braises", en: "Ember Bay" }, subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "EB",
        farmType: "per_account",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Savage Rise Waypoint", wpCode: "[&BNMJAAA=]",
        resetNote: { fr: "soft-reset daily 01h UTC+1", en: "daily soft-reset 01h UTC+1" },
        vendor: { fr: "Seimur Oxbone — vend Fire Orchid Blossom et Petrified Wood contre karma", en: "Seimur Oxbone — sells Fire Orchid Blossom and Petrified Wood for karma" },
        vendorWp: "Savage Rise Waypoint [&BNMJAAA=]",
        tip: { fr: "~40 Lava Drops + Petrified Wood/compte/jour via nodes. Soft-reset à 01h. Le vendeur Seimur Oxbone sur place vend la currency contre karma (5/jour/perso — léger potentiel alt-swap).", en: "~40 Lava Drops + Petrified Wood/account/day via nodes. Soft-reset at 01h. Vendor Seimur Oxbone on-site sells currency for karma (5/day/character — slight alt-swap potential)." } },
      { id: "dm", name: { fr: "Mont Draconis", en: "Draconis Mons" }, subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "DM",
        farmType: "per_account",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Heathen's Hold Waypoint", wpCode: "[&BOMJAAA=]",
        resetNote: { fr: "soft-reset daily 01h UTC+1", en: "daily soft-reset 01h UTC+1" },
        vendor: { fr: "Nesa — vend Fire Orchid Blossom et Petrified Wood contre karma", en: "Nesa — sells Fire Orchid Blossom and Petrified Wood for karma" },
        vendorWp: "Heathen's Hold Waypoint [&BOMJAAA=]",
        tip: { fr: "~40 Fire Orchid + Petrified Wood/compte/jour via nodes. Soft-reset à 01h. Springer requis pour certains nodes. Vendeuse Nesa sur place (5/jour/perso — léger potentiel alt-swap).", en: "~40 Fire Orchid + Petrified Wood/account/day via nodes. Soft-reset at 01h. Springer required for some nodes. Vendor Nesa on-site (5/day/character — slight alt-swap potential)." } },
      { id: "ld", name: { fr: "Lac Doric", en: "Lake Doric" }, subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "LD",
        farmType: "per_account",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Noran's Homestead Waypoint", wpCode: "[&BNQJAAA=]",
        resetNote: { fr: "soft-reset daily 01h UTC+1", en: "daily soft-reset 01h UTC+1" },
        vendor: { fr: "Noran — vend Jade Shard contre karma", en: "Noran — sells Jade Shard for karma" },
        vendorWp: "Noran's Homestead Waypoint [&BNQJAAA=]",
        tip: { fr: "~40 Jade Shards/compte/jour via nodes. Soft-reset à 01h. Vendeur Noran sur place (5/jour/perso). Alt-swap minimal possible via le vendeur.", en: "~40 Jade Shards/account/day via nodes. Soft-reset at 01h. Vendor Noran on-site (5/day/character). Minimal alt-swap possible via vendor." } },
      { id: "sl", name: { fr: "Plage des sirènes", en: "Siren's Landing" }, subname: "Hidden Reliquary Chests", expansion: "LW3", icon: "SL",
        farmType: "per_char_hearts",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Camp Reclamation Waypoint", wpCode: "[&BO8JAAA=]",
        resetNote: { fr: "soft-reset daily 01h UTC+1", en: "daily soft-reset 01h UTC+1" },
        tip: { fr: "1 coffre gratuit + 1 payant (1,5po) par perso/jour. Les 5 hearts sont à refaire par perso avant l'accès (~20-30 min). Soft-reset à 01h. Alt-swap possible mais coûteux en temps.", en: "1 free chest + 1 paid (1.5g) per character/day. The 5 hearts must be redone per character before access (~20-30 min). Soft-reset at 01h. Alt-swap possible but time-costly." } },
      { id: "bf_meta", name: { fr: "Confins de Givramer", en: "Bitterfrost Frontier" }, subname: "Frozen Maw Meta", expansion: "LW3", icon: "BM",
        farmType: "per_account",
        offsetUTC: 0, intervalMin: 120, durationMin: 20,
        waypoint: "Sorrow's Eclipse Waypoint", wpCode: "[&BH0JAAA=]",
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
      { id: "coins",     name: "Mystic Coin",       required: 499, icon: "MN", apiId: 19976 },
    ],
    collectionNoteKeys: ["raids_li_note", "raids_wings_note"],
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
      { id: "shards",  name: "Obsidian Shard", required: 488,  icon: "OS", apiId: 19925 },
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
    // La liste des huit trophees et leurs cibles figees a 200 a disparu avec
    // la conversion de T6 en projection : TrophyMatrix chiffre desormais sur
    // la selection propre du joueur, via SOURCES_DB.trophy_matrix. Une liste
    // vide, et non le champ supprime, pour que rien ne parte lire un undefined.
    currencies: [],
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
    currencies: [
      { id: "sap",      name: "Aether-Rich Sap",      required: 500, icon: "AS", apiId: 83 },
      { id: "ducat",    name: "Antiquated Ducat",     required: 500, icon: "AD", apiId: 81 },
      { id: "obsidian", name: "Obsidian Shard",       required: 283, icon: "OS", apiId: 19925 },
      { id: "gems",     name: "Amalgamated Gemstone", required: 250, icon: "AG", apiId: 68063 },
      { id: "clovers",  name: "Mystic Clover",        required: 10,  icon: "MC", apiId: 19675 },
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
    currencies: [
      { id: "karma",   name: "Karma",         required: 7000000, icon: "KA", apiId: 2 },
      { id: "coins",   name: "Mystic Coin",   required: 499,     icon: "MO", apiId: 19976 },
      { id: "clovers", name: "Mystic Clover", required: 77,      icon: "MC", apiId: 19675 },
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
    currencies: [
      { id: "tales",   name: "Tales of Dungeon Delving", required: 500, icon: "TD", apiId: 69 },
      { id: "clovers", name: "Mystic Clover",            required: 68,  icon: "MC", apiId: 19675 },
      { id: "oblige",  name: "Ursus Oblige",             required: 1250, icon: "UO", apiId: 76 },
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
    currencies: [
      { id: "relics",   name: "Fractal Relic",          required: 4650, icon: "FR", apiId: 7 },
      { id: "pristine", name: "Pristine Fractal Relic", required: 140, icon: "PF", apiId: 24 },
      { id: "clovers",  name: "Mystic Clover",          required: 77,  icon: "MC", apiId: 19675 },
      { id: "coins",    name: "Mystic Coin",            required: 249, icon: "MO", apiId: 19976 },
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
    currencies: [
      { id: "tickets", name: "Skirmish Claim Tickets", required: 3000, icon: "SK", apiId: 26 },
      { id: "clovers", name: "Mystic Clover",          required: 45,   icon: "MC", apiId: 19675 },
      { id: "memory",  name: "Memory of Battle",       required: 500,  icon: "MB", apiId: 71581 },
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
  { id: "clovers", compId: "mystic_clover", name: "Mystic Clover", required: 77, icon: "MC", apiId: 19675,
    tip: { fr: "Coffre du Sorcier (60 AA, 20/saison), Manfred Njallson (30 Magnetite, 15/sem), Dugan McM (5/sem), vendeur de ligue PvP (5/sem), Mystic Forge (~31% de réussite). \u26a0 Plus de Chest of Loyalty depuis 2023.", en: "Wizard's Vault (60 AA, 20/season), Manfred Njallson (30 Magnetite, 15/wk), WvW Dugan (5/wk), PvP league vendor (5/wk), Mystic Forge (~31% success). \u26a0 No Chest of Loyalty since 2023." } },
  { id: "coins", compId: "mystic_coin", name: "Mystic Coin", required: 250, icon: "MN", apiId: 19976,
    tip: { fr: "Coffre du Sorcier (9 AA, 60/saison), Manfred Njallson (10/sem), Skirmish McM (2 Gold / 4 Diamond, sans plafond), Ley-Line Anomaly (1/j), SAB (3/sem), comptoir. \u26a0 Aucune source de connexion depuis 2023 ; Nikki, Vorri et Zazzl n'en vendent plus.", en: "Wizard's Vault (9 AA, 60/season), Manfred Njallson (10/wk), WvW Skirmish (2 Gold / 4 Diamond, no cap), Ley-Line Anomaly (1/day), SAB (3/wk), TP. \u26a0 No login source since 2023; Nikki, Vorri and Zazzl no longer stock it." } },
  { id: "ectos", compId: "glob_of_ectoplasm", name: "Glob of Ectoplasm", required: 250, icon: "EC", apiId: 19721,
    tip: { fr: "Salvage de rares niveau 68+. Drop abondant pendant les metas.", en: "Salvage rare gear lvl 68+. Abundant drops during metas." } },
  { id: "obsidian", compId: "obsidian_shard", name: "Obsidian Shard", required: 100, icon: "OS", apiId: 19925,
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
  // src peut etre une chaine (ancien format), un objet avec type, ou un objet
  // VIDE quand le composant n'a aucune source — et un objet vide est truthy,
  // donc `src.type || src` rendait l'objet lui-meme et .toLowerCase() cassait
  // tout l'onglet Grand Total. Vingt composants etaient dans ce cas.
  const brut = typeof src === "string" ? src : src?.type;
  const t = (typeof brut === "string" ? brut : "").toLowerCase();
  if (t.includes("pvp") || t.includes("league")) return FARM_COLOR["PvP"];
  if (t.includes("wvw") || t.includes("skirmish") || t.includes("badge")) return FARM_COLOR["WvW"];
  if (t.includes("fractal")) return FARM_COLOR["Fractals"];
  if (t.includes("vendor") || t.includes("mystic_forge") || t.includes("map_currency") || t.includes("meta") || t.includes("salvage") || t.includes("craft") || t.includes("tp")) return FARM_COLOR["PvE"];
  return FARM_COLOR["Mixte"];
}

// ── Moteur grand total ────────────────────────────────────────
// Notes editoriales : un objet des sources peut porter une douzaine de champs de
// remarques. Les brancher un par un a la main garantit d'en oublier — l'audit en
// avait 31 jamais rendus. Ce composant les rend tous, avec un ton par famille.
const NOTE_FIELDS = [
  ["not_a_source", "warn"], ["cap_note", "warn"], ["cap_notes", "warn"],
  ["daily_cap_note", "warn"], ["timegate_note", "warn"], ["time_gate", "warn"],
  ["discontinued_note", "warn"], ["chat_code_warning", "warn"],
  ["opportunistic", "good"], ["roi_note", "good"], ["route_note", "good"],
  ["interchangeable_note", "good"], ["unlock_also", "good"],
  ["qty_note", "dim"], ["apiIdNote", "dim"], ["apiId_note", "dim"],
  ["unique_note", "dim"], ["armory_note", "dim"], ["skin_note", "dim"],
  ["skin_unlock_note", "dim"], ["upgrade_note", "dim"], ["crafting_note", "dim"],
  ["full_set_li_note", "dim"], ["vendor_notes", "dim"], ["variants_note", "dim"],
  ["precursor_sources", "dim"], ["gift_unique_tip", "dim"],
  ["mystic_runestone_note", "dim"], ["timer_notes", "dim"], ["warnings", "warn"],
];
const NOTE_TONE = {
  warn: { c: "rgba(251,146,60,0.8)", b: "rgba(251,146,60,0.05)", d: "rgba(251,146,60,0.2)" },
  good: { c: "rgba(94,234,212,0.8)", b: "rgba(94,234,212,0.05)", d: "rgba(94,234,212,0.2)" },
  dim:  { c: "rgba(226,201,126,0.5)", b: "rgba(226,201,126,0.03)", d: "rgba(226,201,126,0.12)" },
};

function EditorialNotes({ obj, compact }) {
  if (!obj) return null;
  const found = NOTE_FIELDS.filter(([k]) => obj[k]);
  if (found.length === 0) return null;
  return (
    <div style={{ marginTop: 4 }}>
      {found.map(([k, tone]) => {
        const v = obj[k];
        const t = NOTE_TONE[tone] ?? NOTE_TONE.dim;
        const body = Array.isArray(v?.fr ?? v)
          ? (NX(v) ?? []).map((x, i) => <div key={i}>· {x}</div>)
          : NX(v);
        return (
          <div key={k} style={{ marginTop: 3, padding: compact ? "4px 7px" : "6px 9px", background: t.b, border: `1px solid ${t.d}`, borderRadius: 5, fontSize: compact ? 9.5 : 10, fontFamily: "'Crimson Text', serif", color: t.c, lineHeight: 1.5 }}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

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
              <FieldTip tip={item.how_jsx} NX={NX} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Code de chat d'un point de passage, copiable en un clic — comme sur le wiki.
// La cible de clic doit rester large sur mobile, d'ou le padding.
// Conseil de terrain : ce que le wiki ne dit pas.
// `how` vient du wiki — ou aller, quoi ramasser. `how_jsx` vient du jeu :
// l'objet a ne pas recycler, la cle a acheter avant de partir, l'evenement
// qui fait disparaitre le PNJ. Les deux ont ete confrontes un a un le
// 01/09/2026 : similarite mediane 0,34, et les 11 vraies redites supprimees.
// Ce qui reste ne fait pas doublon et restait invisible faute de rendu.
function FieldTip({ tip, NX }) {
  if (!tip) return null;
  const txt = NX(tip);
  if (!txt) return null;
  return (
    <div style={{
      fontSize: 10, marginTop: 3, paddingLeft: 6,
      borderLeft: "2px solid rgba(226,201,126,0.28)",
      color: "rgba(226,201,126,0.62)", fontFamily: "'Crimson Text', serif",
      lineHeight: 1.5, fontStyle: "italic",
    }}>{txt}</div>
  );
}

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
      // __onetime : cout paye une seule fois pour le compte, quel que soit le
      // nombre de pieces ou d'unites fabriquees (deblocage d'apparences).
      const onceKey = legId + "__onetime";
      if (qty[onceKey] !== undefined && typeof qty[onceKey] === "number") {
        totals[compId] = (totals[compId] ?? 0) + qty[onceKey];
      }
      // __per_unit : runes, cachets et reliques se fabriquent a l'unite. Sans
      // cible saisie, on compte UNE unite — plancher honnete plutot qu'un
      // total invente.
      const unitKey = legId + "__per_unit";
      if (qty[unitKey] !== undefined && typeof qty[unitKey] === "number") {
        totals[compId] = (totals[compId] ?? 0) + qty[unitKey];
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

// T6 n'est pas un legendaire mais une projection : la matrice des trophees porte
// sa propre selection de cibles. Le proposer dans les selecteurs de legendaires
// laissait croire qu'on peut "viser T6" comme on vise Aurora.
const SANS_GRAND_TOTAL = new Set(["t6"]);

// ── Matrice des trophées ─────────────────────────────────────
// L'onglet T6 n'est plus un pseudo-légendaire avec des cibles figées à 200 :
// c'est une projection de la sélection du joueur. Les 8 lignes sont
// rigoureusement symétriques dans le BESOIN (chaque gift demande 100/250/50/50) ;
// ce qui les différencie, c'est le stock et le prix. La matrice montre donc
// l'état, et le dépliement d'une ligne montre l'action : quel gift est
// forgeable ce soir.
function TrophyMatrix({ stocks = {}, selectedIds = {}, onTargets }) {
  const [open, setOpen] = useState(null);
  const [picker, setPicker] = useState(false);
  const [notes, setNotes] = useState(false);
  const [hubs, setHubs] = useState(false);
  // Palier affiche dans « Ou farmer ». L'etat ne peut pas etre initialise depuis
  // matrix : matrix est declare plus bas, le lire ici tombe dans la zone morte du
  // const et fait lever le composant a l'execution — esbuild, lui, compile.
  const [hubTier, setHubTier] = useState(null);
  const t = useT();
  const DB = typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {};
  const cc = DB.craft_components ?? {};
  const legs = DB.legendaries ?? {};
  const matrix = DB.trophy_matrix;
  const ids = Object.keys(selectedIds).filter(k => selectedIds[k]);
  const totals = ids.length ? (computeGrandTotal(ids).totals ?? {}) : {};

  if (!matrix?.lines?.length) return null;
  // Paliers exposes par la base ; le palier courant retombe sur le premier tant
  // que rien n'est choisi, et si le palier choisi disparait de la base.
  const hubTiers = matrix.farm_hubs?.tiers ?? [];
  const tierCle = hubTiers.some(x => x.key === hubTier) ? hubTier : (hubTiers[0]?.key ?? null);
  const stockOf = (cid) => {
    const api = cc[cid]?.apiId;
    return api != null && stocks[String(api)] != null ? stocks[String(api)] : null;
  };
  const cell = (cid) => {
    const need = totals[cid] ?? 0;
    const owned = stockOf(cid);
    const missing = owned === null ? null : Math.max(0, need - owned);
    return { need, owned, missing, pct: need > 0 && owned !== null ? Math.min(1, owned / need) : null };
  };

  return (
    <div>
      <div className="section-label">{NX({ fr: "Trophées fins", en: "Fine trophies" })}</div>
      <div style={{ margin: "2px 14px 8px", fontSize: "10.5px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(226,201,126,0.4)" }}>
        {NX({ fr: "Chaque gift demande 100 T6, 250 T5, 50 T4 et 50 T3. Le T6 ne pèse que 100 unités sur 450 : l'essentiel du volume, et l'essentiel de l'économie possible, est en T5.",
              en: "Each gift needs 100 T6, 250 T5, 50 T4 and 50 T3. T6 is only 100 units out of 450: most of the volume, and most of the possible savings, sit in T5." })}
      </div>

      {/* Notes éditoriales T6 : elles vivaient dans l'onglet Grand Total, où
          elles n'avaient rien à faire et s'affichaient tronquées. Elles
          rejoignent la matrice, dépliables pour ne pas noyer l'écran. */}
      <div style={{ margin: "0 14px 8px" }}>
        <button onClick={() => setNotes(!notes)}
          style={{ width: "100%", padding: "7px 12px", background: "rgba(226,201,126,0.04)", border: "1px solid rgba(226,201,126,0.16)", borderRadius: 8, color: "rgba(226,201,126,0.75)", fontSize: "11.5px", cursor: "pointer", textAlign: "left" }}>
          📖 {NX({ fr: "Où trouver du T6 en volume", en: "Where to find T6 in bulk" })} {notes ? "▾" : "▸"}
        </button>
        {notes && (
          <div style={{ marginTop: 6 }}>
            {["t6_src1", "t6_src2", "t6_src3"].map(k => (
              <div key={k} style={{ margin: "0 0 6px", padding: "8px 11px", background: "rgba(226,201,126,0.03)", border: "1px solid rgba(226,201,126,0.09)", borderRadius: 7, fontFamily: "'Crimson Text', serif", fontSize: "11.5px", lineHeight: 1.55, color: "rgba(226,201,126,0.6)" }}>
                {t(k)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Foyers de farm : l'information qui n'existe qu'en croisant les huit
          lignes. Elle vivait dans les tips de 32 composants, donc invisible
          tant qu'on ne dépliait pas chaque ligne une par une. */}
      {matrix.farm_hubs && (
        <div style={{ margin: "0 14px 8px" }}>
          <button onClick={() => setHubs(!hubs)}
            style={{ width: "100%", padding: "7px 12px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, color: "rgba(74,222,128,0.85)", fontSize: "11.5px", cursor: "pointer", textAlign: "left" }}>
            🗺 {NX({ fr: "Où farmer — cartes qui servent plusieurs lignes", en: "Where to farm — maps serving several lines" })} {hubs ? "▾" : "▸"}
          </button>
          {hubs && (
            <div style={{ marginTop: 6 }}>
              <div style={{ margin: "0 0 7px", fontSize: "10.5px", fontStyle: "italic", color: "rgba(226,201,126,0.45)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
                {NX(matrix.farm_hubs.note)}
              </div>
              {hubTiers.length > 1 && (
                <div style={{ display: "flex", gap: 5, margin: "0 0 7px" }}>
                  {hubTiers.map(tr => (
                    <button key={tr.key} onClick={() => setHubTier(tr.key)}
                      style={{ padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontSize: "10.5px",
                        background: tierCle === tr.key ? "rgba(74,222,128,0.14)" : "transparent",
                        border: `1px solid ${tierCle === tr.key ? "rgba(74,222,128,0.35)" : "rgba(226,201,126,0.14)"}`,
                        color: tierCle === tr.key ? "#4ade80" : "rgba(226,201,126,0.5)" }}>
                      {L(tr.label)}{tr.per_gift ? ` · ${tr.per_gift}` : ""}
                    </button>
                  ))}
                </div>
              )}
              {(matrix.farm_hubs.hubs ?? []).map((h, i) => {
                const gifts = (h.lines ?? {})[tierCle] ?? [];
                if (gifts.length === 0) return null;   // rien a servir a ce palier
                const noms = gifts.map(g =>
                  NX((matrix.lines ?? []).find(l => l.gift === g)?.label) ?? g);
                const fort = noms.length >= 2;
                return (
                  <div key={i} style={{ margin: "0 0 6px", padding: "8px 11px", background: fort ? "rgba(74,222,128,0.05)" : "rgba(226,201,126,0.03)", border: `1px solid ${fort ? "rgba(74,222,128,0.16)" : "rgba(226,201,126,0.09)"}`, borderRadius: 7 }}>
                    <div style={{ fontSize: "11.5px", color: fort ? "#4ade80" : "rgba(226,201,126,0.8)", fontWeight: 600 }}>
                      {NX(h.map)}
                      <span style={{ marginLeft: 7, fontSize: "10px", fontWeight: 400, opacity: 0.8 }}>
                        {noms.length} {noms.length > 1 ? NX({ fr: "lignes", en: "lines" }) : NX({ fr: "ligne", en: "line" })} · {noms.join(", ")}
                      </span>
                    </div>
                    <div style={{ marginTop: 3, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", lineHeight: 1.5, color: "rgba(226,201,126,0.6)" }}>
                      {NX(h.why)}
                    </div>
                    {(h.zones ?? []).length > 0 && (
                      <div style={{ marginTop: 5, borderTop: "1px solid rgba(226,201,126,0.08)", paddingTop: 4 }}>
                        {h.zones.map((z, j) => {
                          // counts vaut { gift: { t5: n, t6: n } } : on ne garde que le
                          // palier affiche, et une zone sans rien a ce palier disparait.
                          const par = Object.entries(z.counts ?? {})
                            .map(([g, v]) => [g, (v ?? {})[tierCle]])
                            .filter(([, n]) => typeof n === "number" && n > 0);
                          if (par.length === 0) return null;
                          return (
                          <div key={j} style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0 6px", padding: "1.5px 0", fontSize: "10px" }}>
                            {/* L() et non NX() : un nom de lieu est un nom propre, le
                                dictionnaire de termes n'a rien a y substituer. */}
                            <span style={{ color: "rgba(226,201,126,0.75)" }}>{L(z.name)}</span>
                            {par.map(([g, n]) => (
                              <span key={g} style={{ color: "rgba(226,201,126,0.45)", whiteSpace: "nowrap" }}>
                                {NX((matrix.lines ?? []).find(l => l.gift === g)?.label) ?? g} <b style={{ color: "rgba(74,222,128,0.6)" }}>{n}</b>
                              </span>
                            ))}
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {(matrix.farm_hubs.no_hub ?? [])
                .filter(n => (n.tiers ?? []).includes(tierCle))
                .map((n, i) => (
                <div key={i} style={{ margin: "0 0 6px", padding: "8px 11px", background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.18)", borderRadius: 7, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", lineHeight: 1.5, color: "rgba(251,146,60,0.8)" }}>
                  {NX(n.why)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ margin: "0 14px 10px" }}>
        <button onClick={() => setPicker(!picker)}
          style={{ width: "100%", padding: "9px 12px", background: "rgba(226,201,126,0.06)", border: "1px solid rgba(226,201,126,0.22)", borderRadius: 8, color: "#e2c97e", fontSize: "12px", cursor: "pointer", textAlign: "left" }}>
          🎯 {NX({ fr: "Légendaires visés", en: "Targeted legendaries" })} — <b>{ids.length}</b> {picker ? "▾" : "▸"}
        </button>
        {picker && (
          <div style={{ marginTop: 6, padding: "8px 10px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(226,201,126,0.14)", borderRadius: 8, maxHeight: 240, overflowY: "auto" }}>
            {Object.entries(legs).filter(([lid]) => QTY_LEG_IDS.has(lid) && !SANS_GRAND_TOTAL.has(lid))
              .sort((a, b) => String(a[1].name ?? a[0]).localeCompare(String(b[1].name ?? b[0])))
              .map(([lid, l]) => (
              <label key={lid} style={{ display: "flex", alignItems: "center", gap: 7, padding: "3px 0", fontSize: "11px", color: selectedIds[lid] ? "#e2c97e" : "rgba(226,201,126,0.55)", cursor: "pointer" }}>
                <input type="checkbox" checked={!!selectedIds[lid]}
                  onChange={() => onTargets(prev => { const n = { ...prev }; if (n[lid]) delete n[lid]; else n[lid] = true; return n; })} />
                <span style={{ flex: 1 }}>{NX(l.name ?? lid)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {ids.length === 0 && (
        <div style={{ margin: "0 14px 10px", padding: "9px 12px", background: "rgba(226,201,126,0.04)", border: "1px solid rgba(226,201,126,0.15)", borderRadius: 8, fontSize: "11.5px", color: "rgba(226,201,126,0.6)" }}>
          {NX({ fr: "Aucun légendaire visé : la matrice affiche ton stock, sans objectif. Sélectionne au moins un légendaire pour voir ce qu'il te manque.",
                en: "No legendary targeted: the matrix shows your stock, with no goal. Pick at least one legendary to see what you are missing." })}
        </div>
      )}

      {/* ① La matrice 8 × 4 */}
      <div style={{ margin: "0 14px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", fontVariantNumeric: "tabular-nums" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "4px 6px", color: "rgba(226,201,126,0.45)", fontWeight: 400, fontSize: "10px" }}></th>
              {(matrix.tier_labels ?? []).map((lb, i) => (
                <th key={i} style={{ padding: "4px 6px", color: "rgba(226,201,126,0.45)", fontWeight: 400, fontSize: "10px" }}>{NX(lb)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.lines.map(line => (
              <React.Fragment key={line.gift}>
                <tr onClick={() => setOpen(open === line.gift ? null : line.gift)}
                    style={{ cursor: "pointer", borderTop: "1px solid rgba(226,201,126,0.08)" }}>
                  <td style={{ padding: "5px 6px", color: "#e2c97e", whiteSpace: "nowrap" }}>
                    {open === line.gift ? "▾ " : "▸ "}{NX(line.label)}
                  </td>
                  {line.tiers.map(cid => {
                    const c = cell(cid);
                    const bg = c.pct === null ? "transparent"
                      : c.pct >= 1 ? "rgba(74,222,128,0.16)"
                      : `rgba(251,146,60,${0.05 + 0.18 * (1 - c.pct)})`;
                    return (
                      <td key={cid} style={{ padding: "5px 6px", textAlign: "center", background: bg, color: c.missing === 0 && c.need > 0 ? "#4ade80" : "rgba(226,201,126,0.8)" }}>
                        {c.need === 0 ? "—" : c.missing === null ? c.need : c.missing === 0 ? "✓" : c.missing}
                      </td>
                    );
                  })}
                </tr>
                {/* ③ Le dépliement : la ligne devient son gift */}
                {open === line.gift && (
                  <tr>
                    <td colSpan={5} style={{ padding: "6px 8px 10px", background: "rgba(0,0,0,0.18)" }}>
                      {line.tiers.map((cid, i) => {
                        const c = cell(cid);
                        const par = cc[cid]?.qty?.[line.gift] ?? 0;
                        return (
                          <div key={cid} style={{ display: "flex", gap: 8, alignItems: "baseline", padding: "2px 0", fontSize: "10.5px" }}>
                            <span style={{ width: 22, color: "rgba(226,201,126,0.4)" }}>{NX((matrix.tier_labels ?? [])[i])}</span>
                            <span style={{ flex: 1, color: "rgba(226,201,126,0.75)" }}>{cc[cid]?.name ?? cid}</span>
                            <span style={{ color: "rgba(226,201,126,0.4)" }}>{par}/gift</span>
                            <span style={{ width: 108, textAlign: "right", color: c.missing === 0 && c.need > 0 ? "#4ade80" : "rgba(226,201,126,0.8)" }}>
                              {c.owned === null ? NX({ fr: "stock inconnu", en: "stock unknown" })
                                : `${c.owned} / ${c.need}`}
                            </span>
                          </div>
                        );
                      })}
                      {/* Le lien inverse : depuis la ligne dépliée, ses foyers.
                          Sans lui, il faudrait remonter au bloc général et
                          chercher laquelle des sept cartes sert cette ligne. */}
                      {(() => {
                        const mes = (matrix.farm_hubs?.hubs ?? [])
                          .filter(h => (h.lines ?? []).includes(line.gift));
                        const sans = matrix.farm_hubs?.no_hub?.line === line.gift;
                        if (!mes.length && !sans) return null;
                        return (
                          <div style={{ marginTop: 6, paddingTop: 5, borderTop: "1px solid rgba(226,201,126,0.07)", fontSize: "10.5px", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
                            {sans ? (
                              <span style={{ color: "rgba(251,146,60,0.8)" }}>{NX(matrix.farm_hubs.no_hub.why)}</span>
                            ) : (
                              <span style={{ color: "rgba(74,222,128,0.75)" }}>
                                🗺 {mes.map(h => NX(h.map)).join(" · ")}
                                {mes.some(h => (h.lines ?? []).length > 1) &&
                                  NX({ fr: " — sert aussi d'autres lignes", en: " — also serves other lines" })}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                      {(() => {
                        // Combien de gifts sont forgeables MAINTENANT : le
                        // minimum sur les quatre paliers. C'est la seule
                        // question qui compte le soir venu.
                        const forgeables = Math.min(...line.tiers.map(cid => {
                          const owned = stockOf(cid);
                          const par = cc[cid]?.qty?.[line.gift] ?? 0;
                          return owned === null || par === 0 ? Infinity : Math.floor(owned / par);
                        }));
                        if (!isFinite(forgeables)) return null;
                        return (
                          <div style={{ marginTop: 5, fontSize: "11px", color: forgeables > 0 ? "#4ade80" : "rgba(226,201,126,0.45)" }}>
                            {forgeables > 0
                              ? NX({ fr: `🔨 ${forgeables} ${cc[line.gift]?.name ?? line.gift} forgeable(s) maintenant`,
                                     en: `🔨 ${forgeables} ${cc[line.gift]?.name ?? line.gift} craftable now` })
                              : NX({ fr: "Pas encore forgeable — le palier le plus court commande.",
                                     en: "Not craftable yet — the shortest tier is the binding one." })}
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CadencesTab({ stocks = {}, acctGates = null }) {
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
  // « Ne montrer que ce que je peux lancer ». Par defaut actif : c'est la
  // question que l'onglet doit repondre. Desactivable, parce qu'une porte
  // indecidable ne doit jamais enfermer le joueur dans une liste vide.
  const [onlyOpen, setOnlyOpen] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_cad_onlyopen") ?? "true"); } catch (_) { return true; }
  });
  const [arb, setArb] = useState(() => {
    try { const a = JSON.parse(localStorage.getItem("gw2_cad_arb_v1") ?? "null"); if (a) return a; } catch (_) {}
    return { coins: 10, clovers: 15 };
  });

  useEffect(() => { const i = setInterval(() => setTicks(x => x + 1), 30000); return () => clearInterval(i); }, []);
  useEffect(() => { try { localStorage.setItem("gw2_cad_sel_v1", JSON.stringify(selected)); } catch (_) {} }, [selected]);
  useEffect(() => { try { localStorage.setItem("gw2_cad_checks_v1", JSON.stringify(checks)); } catch (_) {} }, [checks]);
  useEffect(() => { try { localStorage.setItem("gw2_cad_arb_v1", JSON.stringify(arb)); } catch (_) {} }, [arb]);
  useEffect(() => { try { localStorage.setItem("gw2_cad_onlyopen", JSON.stringify(onlyOpen)); } catch (_) {} }, [onlyOpen]);

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

  // Index inverse : composant -> collections qui declarent dependre de lui.
  // collection_unlocks porte les portes, cadence_ref porte le lien.
  const unlocks = SOURCES_DB?.collection_unlocks ?? {};
  const gateFor = makeGateStatus(acctGates);
  const refsOf = (o) => Array.isArray(o?.cadence_ref) ? o.cadence_ref
                      : typeof o?.cadence_ref === "string" ? [o.cadence_ref] : [];
  // Un composant n'est verrouille que si TOUTES les collections qui en dependent
  // le sont. Ad Infinitum est le cas d'ecole : ses collections II a IV exigent
  // les echelles 36, 53 et 65, mais la I tourne des l'echelle 20. Bloquer les
  // Pages de recherche parce que la IV est hors de portee reviendrait a cacher
  // des semaines de farm parfaitement faisable — exactement ce qu'on veut eviter.
  const gatesBlocking = (compId) => {
    const dependantes = [];
    for (const [aid, u] of Object.entries(unlocks)) {
      if (refsOf(u).includes(compId)) { dependantes.push([aid, u]); continue; }
      // Le legendaire peut porter le lien a la place de la collection.
      for (const lid of (u?.legendary ?? [])) {
        if (refsOf(legs[lid]).includes(compId)) { dependantes.push([aid, u]); break; }
      }
    }
    if (dependantes.length === 0) return [];
    const fermees = [];
    for (const [aid, u] of dependantes) {
      // Seul un false ferme. null reste ouvert : on n'enferme jamais le joueur
      // sur une porte qu'on ne sait pas trancher.
      const bloquantes = gateFor(u.gate).filter(g => g.open === false);
      if (bloquantes.length === 0) return [];   // au moins une voie ouverte
      fermees.push({ aid, label: bloquantes[0].label });
    }
    return fermees;
  };

  const rows = Object.entries(cc)
    .filter(([, c]) => c && c.cadence && (c.cadence.sources ?? []).length > 0)
    .map(([id, c]) => {
      const cad = c.cadence;
      const need = totals[id] ?? 0;
      const owned = c.apiId ? (stocks[String(c.apiId)] ?? null) : null;
      const missing = need > 0 && owned !== null ? Math.max(0, need - owned) : null;
      // Débit hebdomadaire plafonné : les sources sans plafond sont exclus
      // du calcul (ils fausseraient une projection de délai).
      let perWeek = 0, hasUncapped = false, hasRng = false, hasSeason = false, hasPerChar = false;
      for (const f of cad.sources) {
        if (f.cap == null) { hasUncapped = true; continue; }
        // Une source RNG a bien un plafond, mais il borne les TENTATIVES et non
        // les gains : le Chiffre ancien peut tomber au premier coffre comme au
        // vingtième. L'inclure produirait une date de fin qui n'a aucun sens.
        if (f.rng) { hasRng = true; continue; }
        // Un plafond par personnage se démultiplie, mais le tracker ne compte
        // pas les rerolls. On projette donc sur UN personnage : plancher
        // honnête, jamais une promesse que le joueur ne tiendra pas.
        if (f.per_character) hasPerChar = true;
        if (f.period === "week") perWeek += f.cap;
        else if (f.period === "day") perWeek += f.cap * 7;
        // Une saison PvP dure une poignée de semaines et les intersaisons ne
        // produisent rien : on ne lisse pas, on signale.
        else if (f.period === "season") hasSeason = true;
      }
      const weeks = missing !== null && perWeek > 0 ? Math.ceil(missing / perWeek) : null;
      const nSrc = cad.sources.length, nVer = cad.sources.filter(f => f.verified).length;
      // ── Peut-on la faire avancer MAINTENANT ? ──
      // Une cadence est portee par un composant, mais les portes vivent sur les
      // collections. Le lien est cadence_ref : une collection declare que son
      // plafond est porte ailleurs. On remonte donc ce lien a l'envers.
      const bloquees = gatesBlocking(id);
      // Toutes les sources plafonnees deja cochees pour leur periode : il n'y a
      // plus rien a prendre avant le prochain reset.
      const capped = cad.sources.filter(f => f.cap != null && !f.rng);
      const doneNow = capped.length > 0 && capped.every((f, i) =>
        isChecked(id, cad.sources.indexOf(f), f.period));
      return { id, comp: c, cad, need, owned, missing, perWeek, hasUncapped, hasRng, hasSeason, hasPerChar,
               weeks, nSrc, nVer, bloquees, doneNow };
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
              .filter(([lid]) => QTY_LEG_IDS.has(lid) && !SANS_GRAND_TOTAL.has(lid))
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

      {(() => {
        // ── Trois seaux, une seule question par seau ──
        // Lancable : il reste quelque chose a prendre AVANT le prochain reset.
        // C'est la liste que le joueur ouvre le matin, et tout y est
        // parallelisable par construction — des plafonds independants ne se
        // gênent pas entre eux.
        const utiles = rows.filter(r => selectedIds.length === 0 || r.need > 0);
        const bloque = utiles.filter(r => r.bloquees.length > 0);
        const fait = utiles.filter(r => r.bloquees.length === 0 && r.doneNow);
        const lancable = utiles.filter(r => r.bloquees.length === 0 && !r.doneNow);
        return (
          <div style={{ margin: "0 14px 10px", padding: "9px 12px", background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "11.5px", color: C, cursor: "pointer" }}>
              <input type="checkbox" checked={onlyOpen} onChange={() => setOnlyOpen(v => !v)} />
              <span style={{ flex: 1 }}>{t("cad_onlyopen")}</span>
            </label>
            <div style={{ marginTop: 5, fontSize: "10.5px", color: `${D}0.6)`, fontVariantNumeric: "tabular-nums" }}>
              ▶ <b style={{ color: "#38bdf8" }}>{lancable.length}</b> {t("cad_bucket_open")}
              {fait.length > 0 && <> · ✓ {fait.length} {t("cad_bucket_done")}</>}
              {bloque.length > 0 && <> · 🔒 {bloque.length} {t("cad_bucket_locked")}</>}
            </div>
            {lancable.length === 0 && utiles.length > 0 && (
              <div style={{ marginTop: 5, fontSize: "10.5px", color: "rgba(74,222,128,0.85)" }}>{t("cad_all_done")}</div>
            )}
          </div>
        );
      })()}

      {rows
        .filter(r => selectedIds.length === 0 || r.need > 0)
        .filter(r => !onlyOpen || (r.bloquees.length === 0 && !r.doneNow))
        .map(r => (
        <div key={r.id} style={{ margin: "0 14px 10px", padding: "10px 12px", background: `${D}0.03)`, border: `1px solid ${D}0.14)`, borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: r.bloquees.length ? `${D}0.45)` : C }}>
              {r.doneNow && !r.bloquees.length ? "✓ " : ""}{r.bloquees.length ? "🔒 " : ""}{r.comp.name}
            </div>
            <div style={{ fontSize: "10px", color: r.nVer === r.nSrc ? "#4ade80" : r.nVer === 0 ? "rgba(251,146,60,0.85)" : "#e2c97e", flexShrink: 0 }}>
              {r.nVer === r.nSrc ? t("cad_verified", { d: r.cad.sources.find(f => f.checked)?.checked ?? "" })
                : r.nVer === 0 ? t("cad_unverified")
                : t("cad_partial", { a: r.nVer, b: r.nSrc })}
            </div>
          </div>

          {r.bloquees.map((b, bi) => (
            <div key={bi} style={{ marginTop: 4, fontSize: "10.5px", color: "rgba(248,113,113,0.85)" }}>
              🔒 {b.label}
            </div>
          ))}
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
              {r.hasPerChar ? " " + t("cad_perchar_note") : ""}
            </div>
          )}
          {/* Aucune projection possible : le dire, plutot que de laisser un vide
              que le joueur lirait comme « rien a faire ici ». */}
          {r.missing !== null && r.missing > 0 && r.perWeek === 0 && (r.hasSeason || r.hasRng || r.hasUncapped) && (
            <div style={{ marginTop: 3, fontSize: "11px", color: `${D}0.45)`, fontStyle: "italic" }}>
              {r.hasSeason ? t("cad_season_note") : r.hasRng ? t("cad_rng_note") : t("cad_uncapped_only_note")}
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
                    <span style={{ opacity: 0.75 }}> — {f.cap == null ? t("cad_nocap") : `${f.cap}/${t("cad_per_" + per)}`}{f.per_character ? ` ${t("cad_tag_perchar")}` : ""}{f.rng ? ` ${t("cad_tag_rng")}` : ""}{f.cost ? ` · ${L(f.cost)}` : ""}</span>
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
      const st = typeof src?.type === "string" ? src.type : "";
      const farmLabel =
        st.includes("pvp") || st.includes("league") ? "PvP" :
        st.includes("wvw") || st.includes("skirmish") ? "WvW" :
        st.includes("fractal") ? "Fractals" :
        st ? "PvE" : "Mixte";
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
    // Les collections vivent desormais dans les sources ; ce balayage ne sert
    // plus qu'a lire les seuils des metas, pas les noms d'etapes.
    const list = Object.values(
      (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})
        ?.legendaries?.[SOURCES_ALIAS[selectedLeg] ?? selectedLeg]?.collections ?? {})
      .filter(c => c && c.key)
      .map(c => ({ key: c.key, achievementId: c.id, metaSubs: c.metaSubs }));
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
        // Un compteur peut n'avoir aucune etape parce qu'il n'en existe pas :
        // les recursions d'Eikasia comptent de la Fractalline Dust, Helping
        // Hylek compte des krait tues. Le bloc `progress` des sources le dit.
        // Sans lui on alerte, avec lui on explique — meme chemin, pas de
        // branche parallele.
        const progressParId = {};
        for (const l of Object.values(
          (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.legendaries ?? {})) {
          for (const c of Object.values(l?.collections ?? {})) {
            if (c?.progress && c?.id != null) progressParId[String(c.id)] = c.progress;
          }
        }
        for (const d of defs) {
          const o = out[String(d.id)];
          if (!o || (d.bits ?? []).length > 0 || (o.subs ?? []).length > 0) continue;
          const pg = progressParId[String(d.id)];
          if (pg) { o.progress = pg; continue; }
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

  // Collections a etapes : une seule liste, quelle que soit l'origine. Les
  // sources font foi, et elles sont desormais la seule source : les blocs
  // raidAchievements du JSX ont ete supprimes le 27/08/2026.
  const collSrc = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})
    ?.legendaries?.[SOURCES_ALIAS[selectedLeg] ?? selectedLeg]?.collections;
  // Aurora, Vision et Prismatic ont AUSSI des collections{} dans les sources,
  // mais d'une autre forme, rendue par leurs blocs dedies. Le discriminant est
  // la presence de `key` : seule la forme migree la porte. Sans ce test, leur
  // onglet afficherait deux fois, et le rendu generique avec des cles vides.
  const collMigre = Object.values(collSrc ?? {}).filter(c => c && c.key);
  // Vide ETABLI : l'arme n'a pas de collection, son precurseur se forge. Sans ce
  // message l'onglet serait vide et indiscernable d'une donnee manquante.
  const collSrcNone = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})
    ?.legendaries?.[SOURCES_ALIAS[selectedLeg] ?? selectedLeg]?.collections_none;
  const collSrcOrder = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})
    ?.legendaries?.[SOURCES_ALIAS[selectedLeg] ?? selectedLeg]?.collections_order;
  const collList = collMigre.length
    ? collMigre.map(c => ({
        key: c.key,
        achievementId: c.id,
        name: c.name,
        tip: c.note,
        bitTips: Object.fromEntries(
          (c.items ?? []).filter(i => i.how).map(i => [String(i.bit), i.how])),
        steps: (c.items ?? []).map(i => ({ index: i.bit, text: i.name })),
        // Une etape peut pointer vers un composant plutot que porter un conseil :
        // ses sources et sa cadence vivent dans craft_components, on les lit la.
        bitComponents: Object.fromEntries(
          (c.items ?? []).filter(i => i.component).map(i => [String(i.bit), i.component])),
        // Une etape peut etre une autre legendaire : Eternity se forge depuis
        // Sunrise et Twilight. On y renvoie, on ne recopie pas leur chaine.
        unlock: c.unlock,
        bitLegendaries: Object.fromEntries(
          (c.items ?? []).filter(i => i.legendary).map(i => [String(i.bit), i.legendary])),
        noteAlt: c.note_alt,
      }))
    : [];   // plus de repli : raidAchievements a disparu du JSX

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
  // Portes d'eligibilite du compte : palier de fractale, maitrises, extensions.
  // null partout tant qu'aucune synchro n'a eu lieu — et null veut dire
  // "indecidable", jamais "non". La nuance decide si une collection est
  // signalee ou masquee.
  // Cibles de la matrice des trophees. Independantes de la selection de
  // l'onglet Timegates : on peut viser Vision au quotidien et chiffrer un set
  // d'Obsidienne en parallele.
  const [t6Targets, setT6Targets] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_t6_targets") ?? "{}") ?? {}; } catch (_) { return {}; }
  });
  useEffect(() => { try { localStorage.setItem("gw2_t6_targets", JSON.stringify(t6Targets)); } catch (_) {} }, [t6Targets]);
  const [acctGates, setAcctGates] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gw2_gates") ?? "null"); } catch { return null; }
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
    const [ra, rw, rm, rb, ri, rac, rms] = await Promise.all([
      fetch(`https://api.guildwars2.com/v2/account/achievements?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/wallet?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/materials?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/bank?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/inventory?${tk}`),
      // Portes d'eligibilite : le chemin direct doit rendre exactement ce que
      // rend Flask, sinon les deux synchros repondent differemment.
      fetch(`https://api.guildwars2.com/v2/account?${tk}`),
      fetch(`https://api.guildwars2.com/v2/account/masteries?${tk}`),
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
    // Portes : un echec ne vaut pas zero. masteries repond 403 sans le scope
    // "progression" — on renvoie alors null, ce que le front lit comme
    // "indecidable" et non comme "aucune maitrise".
    const acct = rac.ok ? await rac.json().catch(() => ({})) : {};
    const msList = rms.ok ? await rms.json().catch(() => null) : null;
    // /v2/account/masteries ne rend que des ids et un niveau. La table publique
    // /v2/masteries donne les noms — et `level` y est un index 0-base dans le
    // tableau `levels` de la piste, pas un rang absolu. Une porte nomme presque
    // toujours un PALIER, parce que c'est ce que le jeu affiche au joueur.
    let msNames = null, msAll = null;
    if (Array.isArray(msList)) {
      try {
        const rt = await fetch("https://api.guildwars2.com/v2/masteries?ids=all&lang=en");
        if (rt.ok) {
          const table = await rt.json();
          const byId = new Map(table.map(t => [t.id, t]));
          const set = new Set();
          for (const e of msList) {
            const tr = byId.get(e?.id);
            if (!tr || typeof e?.level !== "number") continue;
            if (tr.name) set.add(tr.name);
            (tr.levels ?? []).forEach((lv, i) => { if (i <= e.level && lv?.name) set.add(lv.name); });
          }
          msNames = [...set].sort();
          // Tous les noms connus de la table, pistes et paliers confondus. Sert
          // a distinguer « porte fermee » de « nom introuvable » : sans cette
          // liste, une faute de frappe dans gate.name se lirait comme un verrou.
          const tous = new Set();
          for (const tr of table) {
            if (tr?.name) tous.add(tr.name);
            for (const lv of tr?.levels ?? []) if (lv?.name) tous.add(lv.name);
          }
          msAll = [...tous];
        }
      } catch (_) { /* table indisponible : on reste sur null, pas sur vide */ }
    }
    const _gates = {
      fractal_level: typeof acct?.fractal_level === "number" ? acct.fractal_level : null,
      access: Array.isArray(acct?.access) ? acct.access : null,
      masteries: Array.isArray(msList)
        ? Object.fromEntries(msList.filter(m => m?.id != null).map(m => [String(m.id), m.level]))
        : null,
      masteries_unlocked: msNames,
      masteries_all: msAll,
      masteries_scope_ok: Array.isArray(msList),
    };
    return { currencies, common, achievements, prismatic, _sub_status: sub, _collections: colls, _direct: true, _bags_ok: bags.ok, stocks: stocksAll, _gates, errors: [] };
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
      // Portes d'eligibilite renvoyees par Flask. On persiste, pour que la
      // page reponde encore apres un rechargement sans synchro.
      if (data._gates) {
        try { localStorage.setItem("gw2_gates", JSON.stringify(data._gates)); } catch (_) {}
        setAcctGates(data._gates);
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
      setDailyChecked(daily);
      setWeeklyChecked(weekly);
      setBountyDone(bounty);
      setCurrencies(curr);
      setCommonMats(common);
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

  // ── Gifts condensés restants, par emplacement ──
  // Un set demande 3 Gift of Condensed Might (gants, jambières, bottes) et 3 of
  // Condensed Magic (coiffe, épaulières, plastron) : une seule par pièce, mais
  // réparties sur deux types. Le total d'un set était juste, le coût d'une
  // pièce isolée ne l'était pas — demander les gants seuls annonçait 3 de
  // chaque au lieu de 1 Might et 0 Magic.
  // La table emplacement → type vit déjà dans LEGENDARIES.obsidian.arcanum,
  // liée aux identifiants de succès. On la lit plutôt que de la redire.
  const obsGiftSplit = (() => {
    const arc = LEGENDARIES.obsidian?.arcanum ?? {};
    const ids = LEGENDARIES.obsidian?.armoryApiIdsBySlot ?? null;
    const out = { mighty: 0, magical: 0 };
    for (const [slot, info] of Object.entries(arc)) {
      const g = info?.gift;
      if (g !== "mighty" && g !== "magical") continue;
      // Sans correspondance emplacement → id d'armurerie, on ne peut pas savoir
      // quelle pièce est possédée : on répartit alors au prorata du restant,
      // ce qui reste exact sur un set complet et honnête sur un set partiel.
      if (!ids) { out[g] += 1; continue; }
      const apiId = ids[slot];
      const vise = !obsHasTarget || obsTarget.has(apiId);
      if (vise && !obsOwnedSet.has(apiId)) out[g] += 1;
    }
    if (!ids) {
      const ratio = obsRemainingCount / 6;
      return { mighty: Math.ceil(out.mighty * ratio), magical: Math.ceil(out.magical * ratio),
               exact: false };
    }
    return { ...out, exact: true };
  })();

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
    for (const [lid, l] of Object.entries(
      (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.legendaries ?? {})) {
      for (const c of Object.values(l?.collections ?? {})) {
        if (c && c.key && typeof c.id === "number") targets.push([c.id, l.name ?? lid]);
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

  // ── Onglets ───────────────────────────────────────────────
  // L'ouverture se deduit de la donnee, via SOURCES_DB.tab_contract. Aucune
  // liste d'identifiants : ajouter un legendaire ne doit rien changer ici.
  const tabs = (() => {
    const DB = typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {};
    const contract = DB.tab_contract;
    const sid = SOURCES_ALIAS[selectedLeg] ?? selectedLeg;
    const src = (DB.legendaries ?? {})[sid] ?? {};
    // Compteurs affiches dans le libelle. Purement cosmetiques : ils ne
    // decident jamais de l'ouverture d'un onglet.
    const counters = {
      collections: isPrismatic ? `${prismaticCount}/24` : null,
      pieces: isArmorSet ? String(obsOwnedSet.size) : null,
      weapons: isWeapons ? `${wpnOwnedSet.size}/${wpnIds.length || 16}` : null,
      activities: (leg?.wvwActivities?.length ?? 0) > 0
        ? `${weeklyCount}/${leg.wvwActivities.length}` : String(dailyCount),
      bounties: String(Object.keys(bountyDone).length),
    };
    const count = (field, from) => {
      const v = (from === "sources" ? src : leg ?? {})[field];
      if (Array.isArray(v)) return v.length;
      if (v && typeof v === "object") return Object.keys(v).length;
      return v ? 1 : 0;
    };
    const computed = (rule) => {
      // t6 n'est pas un legendaire mais une projection : il ne porte aucune
      // exigence materielle, donc has_material_requirement s'eteint pour lui.
      if (rule === "is_trophy_matrix") return selectedLeg === "t6";
      if (rule !== "has_material_requirement") return false;
      const cc = DB.craft_components ?? {};
      for (const comp of Object.values(cc)) {
        for (const key of Object.keys(comp?.qty ?? {})) {
          if (key === selectedLeg || key === sid || key.startsWith(selectedLeg + "__")) return true;
        }
      }
      return false;
    };
    const evaluate = (p) => {
      if (!p || typeof p !== "object") return false;
      if (Array.isArray(p.any_of)) return p.any_of.some(evaluate);
      if (p.flag) return !!(leg ?? {})[p.flag];
      if (p.computed) return computed(p.computed);
      if (p.present) return !!((p.from === "sources" ? src : leg ?? {})[p.present]);
      if (p.count) return count(p.count, p.from) >= (p.min ?? 1);
      return false;
    };
    if (!contract?.order || !contract?.tabs) return [];
    return contract.order
      .filter(id => evaluate(contract.tabs[id]?.when))
      .map(id => {
        const n = counters[id];
        return { id, label: NX(contract.tabs[id].label) + (n ? ` (${n})` : "") };
      });
  })();

  // L'onglet actif doit toujours exister dans le contrat. La chaine de
  // conditions qui posait l'onglet par defaut visait encore wvw, achievements,
  // raids, currencies et metas — cinq identifiants supprimes a la passe
  // finale. Selectionner un legendaire posait donc un onglet inexistant, et la
  // zone de contenu restait vide jusqu'a ce que le joueur clique lui-meme.
  // Cet effet retombe sur le premier onglet ouvert, et couvre aussi le cas ou
  // un onglet disparait sans changement de legendaire.
  useEffect(() => {
    if (tabs.length === 0) return;
    if (!tabs.some(t => t.id === activeTab)) setActiveTab(tabs[0].id);
  }, [tabs.map(t => t.id).join("|"), activeTab]);

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
      {isCadences && <TabErrorBoundary><CadencesTab stocks={gtStocks} acctGates={acctGates} /></TabErrorBoundary>}

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
      {activeTab === "activities" && (leg?.metas?.length ?? 0) > 0 && (
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
                  ? { text: t("farm_perchar"), color: "#34d399" }
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
      {activeTab === "activities" && (leg?.wvwActivities?.length ?? 0) > 0 && (
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
      {activeTab === "collections" && isPrismatic && (
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
                              {missing && <FieldTip tip={item.how_jsx} NX={NX} />}
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
                          <FieldTip tip={item.how_jsx} NX={NX} />
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

        // Les etapes viennent des sources, pas d'une copie locale. Le tableau
        // ne garde que la cle de progression `vc`, qui vient de la synchro API
        // et n'a pas d'equivalent cote sources, et l'id du succes qui fait le
        // pont. Les six collections Visions of, 42 etapes avec leurs conseils
        // wiki, etaient documentees depuis le 01/09 et ne s'affichaient nulle
        // part : elles vivaient dans les sources pendant que cet onglet lisait
        // une troisieme copie codee en dur ici meme.
        const VISION_SRC = ((typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})
          ?.legendaries?.vision?.collections) ?? {};
        const parIdVision = {};
        for (const c of Object.values(VISION_SRC)) {
          if (c?.id != null) parIdVision[String(c.id)] = c;
        }
        const VISIONS_OF = [
          { key: "vision_istan",       id: 4765 },
          { key: "vision_kourna",      id: 4760 },
          { key: "vision_jahai",       id: 4770 },
          { key: "vision_sandswept",   id: 4774 },
          { key: "vision_thunderhead", id: 4764 },
          { key: "vision_dragonfall",  id: 4757 },
        ].map(v => {
          const src = parIdVision[String(v.id)];
          return {
            ...v,
            src,
            label: (src?.name?.en) ?? v.key,
            map: src?.map ?? null,
            items: src?.items ?? [],
          };
        });
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
                const ouvert = visionSubExpanded === v.key;
                return (
                  <React.Fragment key={v.key}>
                  <div onClick={() => v.items.length > 0 && setVisionSubExpanded(ouvert ? null : v.key)}
                    style={{ cursor: v.items.length > 0 ? "pointer" : "default", padding: "8px 13px", background: done ? "rgba(74,222,128,0.02)" : "rgba(255,255,255,0.01)", borderLeft: `1px solid rgba(167,139,250,0.2)`, borderRight: `1px solid rgba(167,139,250,0.2)`, borderTop: "1px solid rgba(226,201,126,0.04)", borderBottom: isLast ? `1px solid rgba(167,139,250,0.2)` : "none", borderRadius: isLast ? "0 0 8px 8px" : 0, display: "flex", alignItems: "center", gap: 8 }}>
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
                    {v.items.length > 0 && (
                      <span style={{ fontSize: 10, color: "rgba(226,201,126,0.25)", marginLeft: 8 }}>
                        {ouvert ? "\u25B2" : "\u25BC"}
                      </span>
                    )}
                  </div>
                  {ouvert && (
                    <div style={{ borderLeft: "1px solid rgba(167,139,250,0.2)", borderRight: "1px solid rgba(167,139,250,0.2)", background: "rgba(0,0,0,0.12)", padding: "4px 13px 8px 33px" }}>
                      {v.items.map((item, k) => (
                        <div key={k} style={{ padding: "5px 0", borderBottom: k < v.items.length - 1 ? "1px solid rgba(226,201,126,0.05)" : "none" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(226,201,126,0.85)" }}>{item.name}</div>
                          {item.how && (
                            <div style={{ fontSize: 10, color: "rgba(226,201,126,0.45)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>{NX(item.how)}</div>
                          )}
                          <FieldTip tip={item.how_jsx} NX={NX} />
                        </div>
                      ))}
                    </div>
                  )}
                  </React.Fragment>
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
      {/* Ordre entre paliers : une contrainte de jeu, pas un detail editorial.
          Elle se lit avant la liste, sinon on decouvre trop tard qu'un palier
          en consomme un autre. */}
      {activeTab === "collections" && collList.length > 0 && collSrcOrder && (
        <div style={{ margin: "10px 14px 4px", padding: "9px 12px", background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.18)", borderRadius: 8, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", lineHeight: 1.5, color: "rgba(96,165,250,0.75)" }}>
          {NX(collSrcOrder)}
        </div>
      )}
            {activeTab === "collections" && collList.length === 0 && collSrcNone && (
        <div style={{ margin: "10px 14px", padding: "10px 13px", background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.18)", borderRadius: 8, fontSize: "11px", fontFamily: "'Crimson Text', serif", lineHeight: 1.5, color: "rgba(251,146,60,0.8)" }}>
          {NX(collSrcNone)}
        </div>
      )}
            {activeTab === "collections" && collList.length > 0 && (
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
          {collList.map(a => {
            const st = apiAch[a.key] ?? {};
            const manual = achManualDone[a.key] === true;
            const done = st.done === true || manual;
            const cur = st.current ?? 0;
            const mx = st.max ?? 0;
            // account/achievements n'expose pas les succes a progression nulle :
            // « aucune donnee » ne veut pas dire « verrouille ». On distingue.
            const noData = !done && mx === 0;
            const locked = noData && !!unlockOf(a.achievementId);
            const isOpen = expandedAch === a.key;
            // Les collections migrees portent leurs etapes dans les sources :
            // l'affichage ne depend plus du balayage runtime de l'API, qui
            // laissait « Chargement des definitions d'etapes… » indefiniment
            // tant qu'il n'avait pas ete lance a la main.
            const def = a.steps
              ? { bits: a.steps, tierMax: a.steps.length, subs: [], fromSources: true }
              : achBitsDefs[String(a.achievementId)];
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
                {/* note_alt : la note concurrente conservee quand le JSX et les
                    sources divergeaient a la migration. Elle etait ecrite mais
                    jamais affichee — mieux vaut la montrer en retrait que la
                    laisser morte dans le fichier. */}
                {a.noteAlt && (
                  <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.28)", fontFamily: "'Crimson Text', serif", fontStyle: "italic", marginTop: "3px", paddingLeft: 8, borderLeft: "2px solid rgba(226,201,126,0.12)" }}>
                    {L(a.noteAlt)}
                  </div>
                )}
                {(() => {
                  // Le deblocage vit dans les sources, indexe par identifiant de
                  // succes (collection_unlocks). Il disait COMMENT debloquer ; la
                  // porte, elle, dit SI c'est debloque, et se lit contre le compte.
                  if (done) return null;
                  const U = unlockOf(a.achievementId);
                  // L'encadre du wiki dit comment la collection s'ouvre : quel
                  // succes la precede, quel objet la declenche, ce qu'elle rend.
                  // C'est plus precis que le locked_text en prose de l'API.
                  const UB = a.unlock;
                  if (!U && !UB) return null;
                  if (!U) {
                    const l = [
                      UB.prerequisite && { k: "→", t: t("unlock_prereq"), v: UB.prerequisite.name },
                      UB.unlock_item && { k: "🔑", t: t("unlock_item"), v: UB.unlock_item.name },
                      UB.reward && { k: "🎁", t: t("unlock_reward"), v: UB.reward.name },
                    ].filter(Boolean);
                    return (
                      <div style={{ marginTop: 6, padding: "6px 8px", background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 6, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", color: "rgba(251,146,60,0.85)", lineHeight: 1.6 }}>
                        {l.map((x, xi) => (
                          <div key={xi}>{x.k} <span style={{ opacity: 0.7 }}>{x.t}</span> <b>{x.v}</b></div>
                        ))}
                      </div>
                    );
                  }
                  const gates = makeGateStatus(acctGates)(U.gate);
                  return (
                    <div style={{ marginTop: 6, padding: "6px 8px", background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 6, fontSize: "10.5px", fontFamily: "'Crimson Text', serif", color: "rgba(251,146,60,0.85)", lineHeight: 1.5 }}>
                      {NX(U.text)}
                      {gates.map((g, gi) => (
                        <div key={gi} style={{ marginTop: 4, fontSize: "10px", color: g.open === false ? "rgba(248,113,113,0.9)" : "rgba(226,201,126,0.5)" }}>
                          {g.open === false ? "🔒 " : g.open === true ? "🔓 " : "❔ "}{g.label}
                        </div>
                      ))}
                    </div>
                  );
                })()}
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
                      <EditorialNotes obj={wl} compact />
                      <WaypointList items={wl.items} copied={copiedCode} onCopy={setCopiedCode} />
                    </div>
                  );
                })()}
                {isOpen && (
                  <div style={{ marginTop: "8px", borderTop: "1px solid rgba(226,201,126,0.08)", paddingTop: "7px" }} onClick={e => e.stopPropagation()}>
                    {(locked || noData) && (
                      <div style={{ fontSize: "10px", fontStyle: "italic", fontFamily: "'Crimson Text', serif", color: "rgba(251,146,60,0.6)", marginBottom: "5px" }}>{t(locked ? "bits_locked_note" : "bits_nodata_note")}</div>
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
                          {def.progress && (
                            <div style={{ marginTop: 5, fontSize: "10px", color: "rgba(226,201,126,0.7)" }}>
                              {def.progress.kind === "currency"
                                ? t("prog_currency", { n: def.tierMax, c: def.progress.currency_label ? NX(def.progress.currency_label) : def.progress.currency })
                                : def.progress.kind === "kills"
                                  ? t("prog_kills", { n: def.tierMax, w: NX(def.progress.what) || def.progress.what })
                                  : t("prog_generic", { n: def.tierMax })}
                              {def.progress.repeatable ? " " + t("prog_repeatable") : ""}
                            </div>
                          )}
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
                            // Une etape peut renvoyer vers un composant : ses sources
                            // vivent dans craft_components, on les lit la plutot que
                            // de recopier un conseil qui divergerait.
                            const cid = a.bitComponents?.[String(i)];
                            const csrc = cid ? ((SOURCES_DB?.craft_components ?? {})[cid]?.sources ?? [])[0] : null;
                            const lref = a.bitLegendaries?.[String(i)];
                            const ltip = lref ? {
                              fr: `Légendaire à part entière : sa chaîne complète est sur sa propre fiche.`,
                              en: `A legendary in its own right: its full chain lives on its own entry.`,
                            } : null;
                            const btip = (a.bitTips && enKey && a.bitTips[enKey]) ?? a.bitTips?.[i]
                              ?? csrc?.tip
                              ?? ltip
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
          // wpnTargetGen et non wpnTarget : o et r sont deja restreints a la
          // generation affichee, compter n sur toutes les generations donnait
          // « 5 ciblees, 1 restante » sur un onglet qui n'en montre que 3.
          ? t("wpn_goal", { n: wpnTargetGen.length, o: wpnTargetOwned, r: wpnRemainingCount })
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
              {wpnGen === "other" && NX({ fr: "Divers : Klobjarne Geirr (lance JW — collections Janthir + Draconic Tribute) et Aetheric Anchor (VoE), qui est un conteneur et apparaît sous ses deux armes de sortie, Ancora Bellum (lance) et Ancora Pax (bâton). Coûts spécifiques par arme — voir la fiche wiki de chacune.", en: "Misc: Klobjarne Geirr (JW spear — Janthir collections + Draconic Tribute) and Aetheric Anchor (VoE), which is a container and shows up as its two outputs, Ancora Bellum (spear) and Ancora Pax (staff). Weapon-specific costs — check each wiki page." })}
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

      {activeTab === "components" && selectedLeg === "t6" && (
        <TabErrorBoundary>
          <TrophyMatrix stocks={gtStocks} selectedIds={t6Targets} onTargets={setT6Targets} />
        </TabErrorBoundary>
      )}

      {activeTab === "components" && selectedLeg !== "t6" && (
        <div>
          {collList.length === 0 && <RequirementsBlocks requirements={leg?.requirements} apiAch={apiAch} currencies={currencies} />}
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
              {(obsGiftSplit.mighty > 0 || obsGiftSplit.magical > 0) && (
                <div style={{ marginTop: 4, fontSize: "11px", color: "rgba(226,201,126,0.6)" }}>
                  {NX({ fr: `→ ${obsGiftSplit.mighty} Gift of Condensed Might (gants, jambières, bottes) + ${obsGiftSplit.magical} Gift of Condensed Magic (coiffe, épaulières, plastron)`,
                        en: `→ ${obsGiftSplit.mighty} Gift of Condensed Might (gloves, leggings, boots) + ${obsGiftSplit.magical} Gift of Condensed Magic (headgear, shoulders, chest)` })}
                  {!obsGiftSplit.exact && NX({ fr: " — réparti au prorata, faute de correspondance emplacement/armurerie",
                                               en: " — prorated, no slot-to-armory mapping available" })}
                </div>
              )}
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
                        if (!comp) return null;
                        if (!comp.free_sources_note) return <EditorialNotes obj={comp} compact />;
                        return (
                          <div style={{ marginTop: 4, padding: "6px 9px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.22)", borderRadius: 5 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(74,222,128,0.9)", fontFamily: "'Cinzel', serif", letterSpacing: "0.03em", marginBottom: 2 }}>
                              {t("free_sources")}
                            </div>
                            <div style={{ fontSize: 10, color: "rgba(74,222,128,0.7)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>
                              {NX(comp.free_sources_note)}
                            </div>
                            <EditorialNotes obj={comp} compact />
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

      {activeTab === "guide" && (
        <TrinketGuide
          curKey={selectedLeg}
          apiAch={apiAch} gtOwnedIds={gtOwnedIds} gtManualOwnedIds={gtManualOwnedIds}
          trinketSteps={trinketSteps} toggleStep={toggleTrinketStep} />
      )}

      {activeTab === "components" && (() => {
        const meta = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?._meta ?? {};
        const cc = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.craft_components ?? {};
        const S = (typeof SOURCES_DB !== "undefined" ? SOURCES_DB : {})?.legendaries?.[selectedLeg] ?? {};
        // Les exigences en materiaux communs sortent du meme calcul que le
        // grand total. La table _meta.common_required qui vivait ici tenait des
        // exigences DIRECTES, pas des totaux : elle annoncait 250 obsidiennes a
        // Vision quand la chaine en demande 421, et appliquait un gabarit
        // generique de 250/250/250/77 a des legendaires qui n'ont pas ces
        // exigences. Une seule source desormais.
        const totalsLeg = computeGrandTotal([selectedLeg]).totals ?? {};
        // Sets d'armure : le total est deja pose par piece dans qty, il reste a
        // le multiplier par les pieces restantes.
        const perPiece = COMMON_MATS.some(m =>
          m.compId && ((cc[m.compId]?.qty ?? {})[selectedLeg + "__per_piece"] !== undefined));
        const mult = perPiece ? Math.max(1, obsRemainingCount || 1) : 1;
        const mats = COMMON_MATS
          .map(m => ({ ...m, req: totalsLeg[m.compId] }))
          .filter(m => typeof m.req === "number" && m.req > 0)
          .map(m => ({ ...m, req: m.req * mult }));
        // Arbre des gifts : composants de tête + matériaux rattachés (index inverse needed_for)
        const tops = (S.components ?? []);
        const subsOf = (g) => Object.entries(cc).filter(([, v]) => (v.needed_for ?? []).includes(g));
        const label = (k) => (cc[k]?.name ? NXS(cc[k].name) : k.replace(/_/g, " "));
        return (
          <div>
            <div style={{ margin: "0 14px" }}><EditorialNotes obj={S} /></div>
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
