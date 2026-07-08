import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════
// I18N — libellés de l'interface (chrome). Les libellés issus des
// données (LEGENDARIES.description/type/notes, SOURCES_DB.tip…) relèvent
// de la couche données et seront localisés via fichiers de locale séparés.
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
    reset_info_common: "Shared stock · Auto-fill via Flask API coming soon",
    per_day: "~{n}/day",
    days_left: "~{n}d left",
    status_completed: "✓ Completed",
    // Chars selector
    chars_title: "Eligible Characters — Aurora",
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
    vision_reward_2: "Reward: Gift of Prescience · Convergence of Sorrow I+II",
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
    vision_col_intro: "Vision I (Awakening) → Gift of Insight · Vision II (Farsight) → Gift of Prescience.",
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
    sec_bounties: "Primes — 5 Bounties légendaires",
    sec_currency: "Progression — {name}",
    sec_common: "Matériaux communs — tous légendaires",
    reset_info_daily: "Sauvegardé · Reset auto à 01h00 UTC+1",
    reset_info_weekly: "Reset auto lundi 07h30 UTC+1",
    reset_info_bounties: "Reset manuel · Elegy sauvegardé dans Progression",
    reset_info_chars: "Nombre de persos sauvegardé entre sessions",
    reset_info_progress: "Progression sauvegardée entre sessions",
    reset_info_common: "Stock commun partagé · Pré-remplissage via API Flask à venir",
    per_day: "~{n}/jour",
    days_left: "~{n}j restants",
    status_completed: "✓ Complété",
    chars_title: "Personnages éligibles — Aurora",
    chars_criteria_pre: "Critères : ",
    chars_criteria_lvl: "niveau 80",
    chars_criteria_mid: " + ",
    chars_criteria_ep: "LW3 épisode 3",
    chars_criteria_post: " débloqué sur le compte (A Crack in the Ice). Le Portal Scroll du Grimoire suffit pour amener les alts — pas besoin de refaire la story.",
    chars_active_label: "Persos Bitterfrost actifs",
    chars_active_help: "Ceux que tu amènes réellement farmer chaque jour",
    chars_yield: "Rendement quotidien estimé",
    chars_note_perchar: "{n} perso{s} × ~{per}/perso",
    chars_note_chests: "{n} perso{s} × 2 coffres (5 hearts/perso requis)",
    chars_note_cap: "plafond compte — alts inutiles",
    chars_siren_title: "⚠ Siren's Landing — spécificité",
    chars_altswap_pre: "Altswap possible mais coûteux : chaque perso doit compléter les ",
    chars_altswap_hearts: "5 hearts",
    chars_altswap_mid: " avant d'accéder aux coffres (~20-30 min/perso). Le 2e coffre coûte ",
    chars_altswap_cost: "1,5g",
    chars_altswap_post: ". Rentable uniquement si tu as du temps ou manques spécifiquement d'Orrian Pearls.",
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
    aurora2_reward: "Récompense : Spark of Sentience · 21 Xunlai Electrum Ingots à infuser",
    aurora2_help: "Aucun RNG ni time-gate. Avoir 21 Xunlai Electrum Ingots en inventaire, puis communier avec chaque Mastery Insight listé ci-dessous.",
    aurora2_prereq: "Prérequis : Aurora: Awakening complété · Synchronise via API pour voir les cases cochées",
    vision_col_title: "Collections Vision — prérequis au craft",
    vision_reqnote: "Les Requiem Experiments fournissent les Elegy Mosaics nécessaires.",
    vision_reward_1: "Récompense : Gift of Insight · 6 Visions of [map] LW4",
    vision_reward_2: "Récompense : Gift of Prescience · Convergence of Sorrow I+II",
    x6_required: "×6 requis",
    vision_mee_craft: "⚠ Artificer 400 · Recette à acheter (Arborstone / Juno vendors)",
    vision_mee_note: "Xunlai Electrum Ingot : recette vendor EoD (Arborstone) · Electrum Ingot + Jade Sliver ×10",
    vision_elegy_label: "Requiem Experiments — Elegy Mosaics",
    vision_elegy_note: "6 experiments × 50 Elegy · Accumulé : {n}/300 Elegy Mosaics",
    pop_LFG: "LFG actif", pop_public: "Instance publique", pop_bon: "Bien peuplé",
    pop_moyen: "Population correcte", pop_variable: "Pop. variable", pop_morte: "⚠ Pop. morte",
    req_missing: "Requis : {req} · Manque : {miss}",
    bounty_train_desc: `LFG → "Crystal Desert" → "bounty train" ou "BT". ~40 min pour les 5 maps. Pas besoin de prendre le contrat — participer au kill suffit.`,
    bounty_train_elegy: "~40–60 Elegy Mosaic par train complet",
    aurora_col_intro: "Deux collections obligatoires avant de pouvoir forger Aurora.",
    sentient_seed_desc: "Achat unique 1000 UM au Gleam of Sentience · forge les 4 Sentient* en Mystic Forge",
    aurora2_show_insights: "Voir les 21 Mastery Insights",
    vision_col_intro: "Vision I (Awakening) → Gift of Insight · Vision II (Farsight) → Gift of Prescience.",
    common_intro: "Ces matériaux font partie du Mystic Tribute requis pour tous les légendaires. Le stock est partagé entre tous tes légendaires actifs.",
    btn_reset_daily: "Reset du jour",
  },
};

const LangContext = createContext("en");

function translate(key, lang, vars) {
  const dict = I18N[lang] || I18N.en;
  let s = dict[key] ?? I18N.en[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(String(vars[k]));
  return s;
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
    type: "Accessory",
    expansion: "LW4",
    color: "#a78bfa",
    colorDim: "rgba(167,139,250,0.15)",
    icon: "V",
    description: "Legendary Accessory — Crystal Desert",
    resetType: "daily",
    currencies: [
      { id: "elegy", name: "Elegy Mosaic", required: 300, icon: "EM", apiId: null },
      { id: "gems", name: "Amalgamated Gemstone", required: 100, icon: "AG", apiId: null },
      { id: "vm", name: "Volatile Magic", required: 1000, icon: "EL", apiId: 45 },
    ],
    metas: [
      { id: "vb", name: "Verdant Brink", subname: "Night and the Enemy", expansion: "HoT", icon: "VB",
        offsetUTC: 105, intervalMin: 120, durationMin: 15,
        efficience: "A", population: "LFG", next: "td", nextDelayMin: 45,
        waypoint: "Pact Encampment Waypoint", wpCode: "[&BAgIAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Prendre le Pact Chopper → Wyvern Matriarch uniquement. Coffre : hard-reset à 01h (reset fixe, pas de timer 24h tournant)." },
      { id: "td", name: "Tangled Depths", subname: "Chak Gerent", expansion: "HoT", icon: "TD",
        offsetUTC: 30, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "LFG", next: "ab", nextDelayMin: 15,
        waypoint: "Ley-Line Confluence Waypoint", wpCode: "[&BPUHAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Hub central des 4 lanes. Taxi LFG, arriver 20 min avant. Coffre : hard-reset à 01h." },
      { id: "ab", name: "Auric Basin", subname: "Octovine", expansion: "HoT", icon: "AB",
        offsetUTC: 45, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "LFG", next: "ds", nextDelayMin: 0,
        waypoint: "Forgotten City Waypoint", wpCode: "[&BNcHAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "4 lanes simultanées, stack sur la lane la plus peuplée. Coffre : hard-reset à 01h." },
      { id: "ds", name: "Dragon's Stand", subname: "Meta complète", expansion: "HoT", icon: "DS",
        offsetUTC: 30, intervalMin: 120, durationMin: 60,
        efficience: "B", population: "LFG", next: null, nextDelayMin: null,
        waypoint: "Mordremoth's Bane Waypoint", wpCode: "[&BNMHAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Longue (~1h). Bonne source de drops en parallèle. Difficile d'enchaîner après." },
      { id: "co", name: "Crystal Oasis", subname: "Casino Blitz", expansion: "PoF", icon: "CO",
        offsetUTC: 21, intervalMin: 120, durationMin: 10,
        efficience: "S", population: "moyen", next: "er", nextDelayMin: 39,
        waypoint: "Amnoon Waypoint", wpCode: "[&BLIGAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "~10 min, ne pas rater le départ. La plus efficiente de toutes — priorité absolue." },
      { id: "er", name: "Elon Riverlands", subname: "Doppelganger", expansion: "PoF", icon: "ER",
        offsetUTC: 60, intervalMin: 120, durationMin: 15,
        efficience: "A", population: "moyen", next: "de", nextDelayMin: 30,
        waypoint: "Augury's Shadow Waypoint", wpCode: "[&BLIKAAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Faire les pré-events 'Disperse wild magic'. Coffre : hard-reset à 01h." },
      { id: "de", name: "The Desolation", subname: "Junundu Rising", expansion: "PoF", icon: "DE",
        offsetUTC: 30, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "moyen", next: "dv", nextDelayMin: 30,
        waypoint: "Shattered Ravines Waypoint", wpCode: "[&BLMKAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Junundu mount required. Skimmer useful for sulfur areas. Chest: hard-reset at 01h." },
      { id: "dv", name: "Domain of Vabbi", subname: "Forged with Fire", expansion: "PoF", icon: "FW",
        offsetUTC: 60, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "moyen", next: "co", nextDelayMin: 21,
        waypoint: "Vehjin Palace Waypoint", wpCode: "[&BA8KAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Easiest PoF meta, little coordination required. Chest: hard-reset at 01h." },
      { id: "di", name: "Domain of Istan", subname: "Palawadan", expansion: "LW4", icon: "DI",
        offsetUTC: 0, intervalMin: 120, durationMin: 20,
        efficience: "A", population: "LFG", next: null, nextDelayMin: null,
        waypoint: "Chalon Docks Waypoint", wpCode: "[&BAkLAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Très populaire, taxi LFG facile. Coffre : hard-reset à 01h." },
      { id: "sw", name: "Skywatch Archipelago", subname: "Unlocking the Wizard's Tower", expansion: "SotO", icon: "SW",
        offsetUTC: 60, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "bon", next: "am", nextDelayMin: 60,
        waypoint: "Droknar's Light Waypoint", wpCode: "[&BL4NAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "1h after reset. Flying mount required. Well-populated." },
      { id: "am", name: "Amnytas", subname: "Defense of Amnytas", expansion: "SotO", icon: "AM",
        offsetUTC: 0, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "bon", next: "sw", nextDelayMin: 60,
        waypoint: "Bastion of the Natural Waypoint", wpCode: "[&BDQOAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Au reset. Bien peuplé. S'enchaîne avec Skywatch 60 min après." },
      { id: "sp", name: "Seitung Province", subname: "Aetherblade Assault", expansion: "EoD", icon: "SP",
        offsetUTC: 90, intervalMin: 120, durationMin: 30,
        efficience: "B", population: "moyen", next: "ew", nextDelayMin: 10,
        waypoint: "Shing Jea Monastery Waypoint", wpCode: "[&BNMMAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        timerNote: "Heures impaires uniquement : 01:30 / 03:30...",
        tip: "Démarre à XX:30 heures impaires UTC. S'enchaîne naturellement avec Echovald." },
      { id: "nk", name: "New Kaineng City", subname: "Kaineng Blackout", expansion: "EoD", icon: "NK",
        offsetUTC: 0, intervalMin: 120, durationMin: 40,
        efficience: "C", population: "morte", next: null, nextDelayMin: null,
        waypoint: "Lutgardis Conservatory Waypoint", wpCode: "[&BNQMAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        timerNote: "Heures paires : 00:00 / 02:00...",
        tip: "⚠ Population quasi-inexistante hors Wizard's Vault. Opportuniste uniquement." },
      { id: "ew", name: "Echovald Wilds", subname: "Gang War", expansion: "EoD", icon: "EW",
        offsetUTC: 100, intervalMin: 120, durationMin: 35,
        efficience: "B", population: "moyen", next: null, nextDelayMin: null,
        waypoint: "Arborstone Waypoint", wpCode: "[&BLsNAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        timerNote: "Heures paires : 01:40 / 03:40...",
        tip: "2 phases : Gang War puis Junkyard. S'enchaîne depuis Seitung." },
      { id: "de2", name: "Dragon's End", subname: "Battle for Jade Sea", expansion: "EoD", icon: "DE2",
        offsetUTC: 60, intervalMin: 120, durationMin: 45,
        efficience: "C", population: "variable", next: null, nextDelayMin: null,
        waypoint: "The Jade Flats Waypoint", wpCode: "[&BNMMAAA=]",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        timerNote: "Heures impaires : 01:00 / 03:00...",
        tip: "Prépa (14 min) → bataille (~30 min). Prépa ne garantit pas la bataille. Long + coordination + risque d'échec." },
      { id: "conv", name: "Convergence Outer Nayos", subname: "Public Instance", expansion: "SotO", icon: "CV",
        offsetUTC: 90, intervalMin: 180, durationMin: 20,
        efficience: "S", population: "public", next: null, nextDelayMin: null,
        waypoint: "Rift Hunter Lounge", wpCode: "[&BOgNAAA=]",
        resetNote: "Commander's Choice Chest : hard-reset daily 01h UTC+1",
        tip: "Toutes les 3h à XX:30 UTC. Fenêtre de 10 min. Portail dans Rift Hunter Lounge au Wizard's Tower." },
      { id: "mb", name: "Convergence Mount Balrior", subname: "Public Instance", expansion: "JW", icon: "MB",
        offsetUTC: 0, intervalMin: 180, durationMin: 20,
        efficience: "S", population: "public", next: "conv", nextDelayMin: 90,
        waypoint: "Harvest Den Waypoint", wpCode: "[&BK4OAAA=]",
        resetNote: "Commander's Choice Chest : hard-reset daily 01h UTC+1",
        tip: "Toutes les 3h à XX:00 UTC. Fenêtre de 10 min. Portail dans Harvest Den, Lowland Shore. → Outer Nayos 90 min après." },
      { id: "bn", name: "Bava Nisos", subname: "A Titanic Voyage", expansion: "JW", icon: "BN",
        offsetUTC: 80, intervalMin: 120, durationMin: 25,
        efficience: "A", population: "bon", next: null, nextDelayMin: null,
        waypoint: "Mantle's Arrival Waypoint", wpCode: "[&BGEPAAA=]",
        resetNote: "Commander's Choice Chest : hard-reset daily 01h UTC+1",
        tip: "Every 2h at XX:20 UTC. Talk to Livia to start. CC required on the boss." },
      // ── Nodes LW4 — Vision (Volatile Magic + Mistborn Mote)
      { id: "lw4_istan", name: "Domain of Istan", subname: "Nodes Brandstones + VM", expansion: "LW4", icon: "OP",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Chalon Docks Waypoint", wpCode: "[&BAkLAAA=]",
        farmType: "per_account",
        resetNote: "soft-reset daily 01h UTC+1 (min. 5-15h après récolte)",
        vendor: "Traveling Elonian Trader (Dragonfall) — 5 Kralkatite/day/account for VM",
        vendorWp: "Pact Command Waypoint [&BOAKAAA=] — Dragonfall",
        tip: "Brandstone nodes → Volatile Magic. Soft-reset at 01h (wait 5-15h after harvest). Cap 50 nodes/account/day. Dragonfall vendor: 5 Kralkatite/day for VM." },
      { id: "lw4_dragonfall", name: "Dragonfall", subname: "Nodes Mistborn Mote", expansion: "LW4", icon: "DF",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Pact Command Waypoint", wpCode: "[&BOAKAAA=]",
        farmType: "per_account",
        resetNote: "soft-reset daily 01h UTC+1 (min. 5-15h après récolte)",
        vendor: "Crystal Bloom Quartermaster — Mistborn Mote contre karma (Dragonfall)",
        vendorWp: "Pact Command Waypoint [&BOAKAAA=]",
        tip: "Max 50 Mistborn Mote nodes/account/day. Soft-reset at 01h. Crystal Bloom Quartermaster on-site sells Mistborn Mote for karma (5/day — slight alt-swap potential)." },
    ],
    bounties: [
      { id: "bt_co", map: "Crystal Oasis", target: "Corrupted Facet", icon: "BT",
        waypoint: "Destiny's Gorge Waypoint", wpCode: "[&BLsKAAA=]",
        tip: "RDV habituel des bounty trains en LFG.", elegy: "4–50" },
      { id: "bt_dh", map: "Desert Highlands", target: "Ellutherius Wintergust", icon: "BF",
        waypoint: "Fortune's Vale Waypoint", wpCode: "[&BNQKAAA=]",
        tip: "Springer High Vault required for Palace of Aban.", elegy: "4–50" },
      { id: "bt_er", map: "Elon Riverlands", target: "Aetherblaze", icon: "EL",
        waypoint: "Augury's Shadow Waypoint", wpCode: "[&BLIKAAAA=]",
        tip: "Board de bounty à côté du WP meta.", elegy: "4–50" },
      { id: "bt_de", map: "The Desolation", target: "Plaguelands", icon: "DS",
        waypoint: "Bonestrand Waypoint", wpCode: "[&BKMKAAA=]",
        tip: "Skimmer recommandé pour les zones de soufre.", elegy: "4–50" },
      { id: "bt_dv", map: "Domain of Vabbi", target: "Forged Rampager", icon: "FW",
        waypoint: "Vehjin Palace Waypoint", wpCode: "[&BA8KAAA=]",
        tip: "Souvent la plus peuplée grâce aux metas Forged.", elegy: "4–50" },
    ],
    // ── Collections / achievements de progression ─────────────
    collections: {
      vision_1: {
        id: 4762,
        name: "Vision I: Awakening",
        reward: "Gift of Insight",
        note: "Compléter les 6 Visions of [map] LW4 — une par zone Crystal Desert + Dragonfall.",
        subcollections: [
          { id: 4765, name: "Visions of Istan",             map: "Domain of Istan",        how: "Compléter des events + hearts en Domain of Istan" },
          { id: 4760, name: "Visions of Kourna",            map: "Domain of Kourna",       how: "Compléter des events + hearts en Domain of Kourna" },
          { id: 4770, name: "Visions of Jahai",             map: "Jahai Bluffs",           how: "Compléter des events + hearts en Jahai Bluffs" },
          { id: 4774, name: "Visions of Sandswept Isles",   map: "Sandswept Isles",        how: "Compléter des events + hearts en Sandswept Isles" },
          { id: 4764, name: "Visions of Thunderhead Peaks", map: "Thunderhead Peaks",      how: "Compléter des events + hearts en Thunderhead Peaks" },
          { id: 4757, name: "Visions of Dragonfall",        map: "Dragonfall",             how: "Compléter des events + hearts en Dragonfall" },
        ],
      },
      vision_2: {
        id: 4771,
        name: "Vision II: Farsight",
        reward: "Gift of Prescience",
        note: "Compléter les 3 Requiem collections (Convergence of Sorrow I+II + Requiem Experiments 1–6).",
        subcollections: [
          { id: 4376, name: "The Convergence of Sorrow I: Elegy",   map: "Jahai Bluffs",  how: "Collecter les 6 Elegy items — liés aux Requiem Armor collections" },
          { id: 4362, name: "The Convergence of Sorrow II: Requiem", map: "Jahai Bluffs", how: "Collecter les 6 Requiem items — suite de Elegy" },
        ],
      },
    },
    // ── Requiem collections (source d'Elegy Mosaic) ───────────
    requiem: {
      note: "Les 6 Requiem Experiments donnent chacun 50 Elegy Mosaics. Total : 300 pour Vision. Chaque collection se complète en Jahai Bluffs via Requiem Armor sets (drop + craft).",
      experiments: [
        { id: 4344, name: "Requiem: Experiment 1", elegy: 50, how: "Collecter les pièces d'armure Requiem tier 1 (drop Branded, craft)" },
        { id: 4432, name: "Requiem: Experiment 2", elegy: 50, how: "Collecter les pièces d'armure Requiem tier 2" },
        { id: 4420, name: "Requiem: Experiment 3", elegy: 50, how: "Collecter les pièces d'armure Requiem tier 3" },
        { id: 4354, name: "Requiem: Experiment 4", elegy: 50, how: "Collecter les pièces d'armure Requiem tier 4" },
        { id: 4356, name: "Requiem: Experiment 5", elegy: 50, how: "Collecter les pièces d'armure Requiem tier 5" },
        { id: 4357, name: "Requiem: Experiment 6", elegy: 50, how: "Collecter les pièces d'armure Requiem tier 6 — complète la série" },
      ],
    },
  },

  aurora: {
    id: "aurora",
    name: "Aurora",
    type: "Accessory",
    expansion: "LW3",
    color: "#34d399",
    colorDim: "rgba(52,211,153,0.15)",
    icon: "*",
    description: "Legendary Accessory — Living World Season 3",
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
        heartNote: "5 hearts required per character per day before chest access (~20 min)" },
    ],
    metas: [
      { id: "bf", name: "Bitterfrost Frontier", subname: "Nodes Winterberries", expansion: "LW3", icon: "BF",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Sorrow's Eclipse Waypoint", wpCode: "[&BH0JAAA=]",
        farmType: "per_char",
        resetNote: "soft-reset daily 01h UTC+1 (min. 5-15h après dernière récolte)",
        tip: "~50-80 Winterberries per character per day — 21 nodes on the map. Thaw Elixir required for the cold zone. Reset: soft-reset at 01h, but wait 5-15h after your last harvest before returning." },
      { id: "eb", name: "Ember Bay", subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "EB",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Savage Rise Waypoint", wpCode: "[&BNMJAAA=]",
        farmType: "per_account",
        resetNote: "soft-reset daily 01h UTC+1",
        vendor: "Seimur Oxbone — vend Fire Orchid Blossom et Petrified Wood contre karma",
        vendorWp: "Savage Rise Waypoint [&BNMJAAA=]",
        tip: "~40 Lava Drops + Petrified Wood/account/day via nodes. Soft-reset at 01h. Vendor Seimur Oxbone on-site sells currency for karma (5/day/character — slight alt-swap potential)." },
      { id: "dm", name: "Draconis Mons", subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "DM",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Heathen's Hold Waypoint", wpCode: "[&BOMJAAA=]",
        farmType: "per_account",
        resetNote: "soft-reset daily 01h UTC+1",
        vendor: "Nesa — vend Fire Orchid Blossom et Petrified Wood contre karma",
        vendorWp: "Heathen's Hold Waypoint [&BOMJAAA=]",
        tip: "~40 Fire Orchid + Petrified Wood/account/day via nodes. Soft-reset at 01h. Springer required for some nodes. Vendor Nesa on-site (5/day/character — slight alt-swap potential)." },
      { id: "ld", name: "Lake Doric", subname: "Nodes LW3 + vendor", expansion: "LW3", icon: "LD",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Noran's Homestead Waypoint", wpCode: "[&BNQJAAA=]",
        farmType: "per_account",
        resetNote: "soft-reset daily 01h UTC+1",
        vendor: "Noran — vend Jade Shard contre karma",
        vendorWp: "Noran's Homestead Waypoint [&BNQJAAA=]",
        tip: "~40 Jade Shards/account/day via nodes. Soft-reset at 01h. Vendor Noran on-site (5/day/character). Minimal alt-swap possible via vendor." },
      { id: "sl", name: "Siren's Landing", subname: "Hidden Reliquary Chests", expansion: "LW3", icon: "SL",
        offsetUTC: 0, intervalMin: 0, durationMin: 0, isTimeless: true,
        waypoint: "Camp Reclamation Waypoint", wpCode: "[&BO8JAAA=]",
        farmType: "per_char_hearts",
        resetNote: "soft-reset daily 01h UTC+1",
        tip: "1 free chest + 1 paid (1.5g) per character/day. The 5 hearts must be redone per character before access (~20-30 min). Soft-reset at 01h. Alt-swap possible but time-costly." },
      { id: "bf_meta", name: "Bitterfrost Frontier", subname: "Frozen Maw Meta", expansion: "LW3", icon: "BM",
        offsetUTC: 0, intervalMin: 120, durationMin: 20,
        waypoint: "Sorrow's Eclipse Waypoint", wpCode: "[&BH0JAAA=]",
        farmType: "per_account",
        resetNote: "Hero's Choice Chest: hard-reset daily 01h UTC+1",
        tip: "Meta every 2h — Hero's Choice Chest (1/account/day, hard-reset at 01h) + bonus Winterberries post-meta. Good loot density." },
    ],
    bounties: [],
  },

  conflux: {
    id: "conflux",
    name: "Conflux",
    type: "Ring",
    expansion: "HoT",
    color: "#fb923c",
    colorDim: "rgba(251,146,60,0.15)",
    icon: "DI",
    description: "Legendary Ring — World vs World exclusive",
    resetType: "weekly",
    currencies: [
      { id: "tickets", name: "Skirmish Claim Tickets", required: 1850, icon: "SK", apiId: 26 },
      { id: "memory", name: "Memory of Battle", required: 1500, icon: "MB", apiId: 71581 },
      { id: "testimony", name: "Testimony of Heroics", required: 250, icon: "TH", apiId: 82 },
      { id: "badges", name: "Badge of Honor", required: 750, icon: "BH", apiId: 15 },
    ],
    metas: [],
    wvwActivities: [
      { id: "skirmish", name: "Skirmish Reward Track", icon: "SR",
        limit: "365 tickets/semaine", resetDay: "Lundi",
        tip: "Main ticket source. Maintain Gold+ participation to maximize pips." },
      { id: "weeklies", name: "WvW Weeklies", icon: "WK",
        limit: "~150 tickets bonus/semaine", resetDay: "Lundi",
        tip: "Complete WvW weekly objectives. Check in the Achievements → WvW menu." },
      { id: "osr", name: "Objective Scaling Rewards", icon: "LD",
        limit: "Variable selon activité", resetDay: "Continu",
        tip: "Rewards bonus pour capturer/défendre des objectifs à forte valeur. Rejoindre un commander actif." },
      { id: "reward_track", name: "Gift of Battle Track", icon: "RT",
        limit: "1 completion suffit", resetDay: "Unique",
        tip: "Complete the 'Gift of Battle' reward track — required for all legendaries. ~5-6 evenings." },
    ],
    bounties: [],
  },

  prismatic: {
    id: "prismatic",
    name: "Prismatic",
    type: "Amulet",
    expansion: "LW",
    color: "#a855f7",
    colorDim: "rgba(168,85,247,0.15)",
    icon: "❆",
    description: "Prismatic Champion's Regalia — Seasons of the Dragons",
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
        tip: "6 LW S2 episodes. Dry Top + Silverwastes. No gold required — pure achievement progression." },
      { id: "tier2", name: "Tier 2 — Living World S3", icon: "◆", color: "#34d399",
        episodes: [
          { bit: 6,  name: "Return to Out of the Shadows" },
          { bit: 7,  name: "Return to Rising Flames" },
          { bit: 8,  name: "Return to A Crack in the Ice" },
          { bit: 9,  name: "Return to The Head of the Snake" },
          { bit: 10, name: "Return to Flashpoint" },
          { bit: 11, name: "Return to One Path Ends" },
        ],
        tip: "6 épisodes LW S3 — synergique avec Aurora. One Path Ends = accès Siren's Landing." },
      { id: "tier3", name: "Tier 3 — Living World S4", icon: "◆", color: "#fbbf24",
        episodes: [
          { bit: 12, name: "Return to Daybreak" },
          { bit: 13, name: "Return to A Bug in the System" },
          { bit: 14, name: "Return to Long Live the Lich" },
          { bit: 15, name: "Return to A Star to Guide Us" },
          { bit: 16, name: "Return to All or Nothing" },
          { bit: 17, name: "Return to War Eternal" },
        ],
        tip: "6 épisodes LW S4 — synergique avec Vision." },
      { id: "tier4", name: "Tier 4 — Icebrood Saga", icon: "◆", color: "#fb923c",
        episodes: [
          { bit: 18, name: "Return to Prologue: Bound by Blood" },
          { bit: 19, name: "Return to Whisper in the Dark" },
          { bit: 20, name: "Return to Shadow in the Ice" },
          { bit: 21, name: "Return to No Quarter" },
          { bit: 22, name: "Return to Jormag Rising" },
          { bit: 23, name: "Return to Champions" },
        ],
        tip: "6 Icebrood Saga episodes. Final reward: Prismatic Champion's Regalia." },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// MATÉRIAUX COMMUNS
// ═══════════════════════════════════════════════════════════════

const COMMON_MATS = [
  { id: "clovers", name: "Mystic Clover", required: 77, icon: "MC", apiId: 19675,
    tip: "Login rewards (7/mois via Chest of Loyalty), PvP/WvW reward tracks" },
  { id: "coins", name: "Mystic Coin", required: 250, icon: "MN", apiId: 19976,
    tip: "Login quotidien principalement. ~30/mois de base." },
  { id: "ectos", name: "Glob of Ectoplasm", required: 250, icon: "EC", apiId: 19721,
    tip: "Salvage de rares niveau 68+. Drop abondant pendant les metas." },
  { id: "obsidian", name: "Obsidian Shard", required: 100, icon: "OS", apiId: 19925,
    tip: "Karma — merchants de maps LW ou Temples de Orr." },
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
               farm: farmColor(src), farmLabel, tip: src.tip ?? "" };
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
                    const label = leg.name ?? id;
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
                          {tip.slice(0, 70)}{tip.length > 70 ? "…" : ""}
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
                      <span style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.04em" }}>{v.name}</span>
                      {v.note && <span style={{ opacity: 0.6 }}> — {v.note}</span>}
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
  const t = useT();
  const [now, setNow] = useState(new Date());
  const [selectedLeg, setSelectedLeg] = useState("vision");
  const [activeTab, setActiveTab] = useState("metas");
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("gw2_lang") || "en"; } catch (_) { return "en"; }
  });
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

    setActiveTab(selectedLeg === "conflux" ? "wvw" : selectedLeg === "prismatic" ? "achievements" : "metas");
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

  // ── Calcul progression currencies
  const mainProgress = isGrandTotal ? [] : (leg?.currencies ?? []).map(cur => ({
    ...cur,
    owned: currencies[cur.id] ?? 0,
    pct: Math.min(100, ((currencies[cur.id] ?? 0) / cur.required) * 100),
  }));

  const legColor = isGrandTotal ? "#f472b6" : (leg?.color ?? "#e2c97e");
  const legColorDim = isGrandTotal ? "rgba(244,114,182,0.15)" : (leg?.colorDim ?? "rgba(226,201,126,0.15)");

  // ── Onglets disponibles selon légendaire
  const isPrismatic = selectedLeg === "prismatic";
  const prismaticDone = prismaticProgress?.done === true;
  const prismaticBits = new Set(prismaticProgress?.bits ?? []);
  const prismaticCount = prismaticDone ? 24 : prismaticBits.size;

  const tabs = [
    ...(isPrismatic ? [{ id: "achievements", label: `✦ Achievements (${prismaticCount}/24)` }] : []),
    ...(!isPrismatic && selectedLeg !== "conflux" ? [{ id: "metas", label: `⏱ Metas (${dailyCount})` }] : []),
    ...(selectedLeg === "conflux" ? [{ id: "wvw", label: `WvW (${weeklyCount}/4)` }] : []),
    ...(selectedLeg === "aurora" ? [{ id: "chars", label: t("tab_chars", { n: numChars }) }] : []),
    ...(selectedLeg === "aurora" ? [{ id: "collections", label: `Collections` }] : []),
    ...(selectedLeg === "vision" ? [{ id: "collections", label: `Collections` }] : []),
    ...((leg?.bounties?.length > 0) ? [{ id: "bounties", label: t("tab_bounties", { n: Object.keys(bountyDone).length }) }] : []),
    ...(!isPrismatic ? [{ id: "currencies", label: t("tab_currencies") }] : []),
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
              {leg?.name}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>
              {leg?.description}
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
            {l.icon} {l.name}
            <span style={{ fontSize: "9px", opacity: 0.6, marginLeft: "4px" }}>({l.type})</span>
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
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>{m.name}</span>
                        {m.efficience && (
                          <span style={{ fontSize: "9px", color: EFFICIENCE_COLORS[m.efficience], background: `${EFFICIENCE_COLORS[m.efficience]}18`, border: `1px solid ${EFFICIENCE_COLORS[m.efficience]}30`, padding: "1px 5px", borderRadius: "2px" }}>
                            {m.efficience}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{m.subname}</div>
                      {m.bestNext && m.bestNext.ms < 45 * 60000 && (
                        <div style={{ fontSize: "10px", color: "rgba(74,222,128,0.7)", fontFamily: "'Crimson Text', serif", marginTop: "2px" }}>
                          → {m.bestNext.meta.name} dans {formatCountdown(m.bestNext.ms)}
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
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>{m.name}</span>
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
                      <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{m.subname}</div>
                      {m.bestNext && !m.checked && m.bestNext.ms < 45 * 60000 && (
                        <div style={{ fontSize: "10px", color: "rgba(74,222,128,0.65)", fontFamily: "'Crimson Text', serif", marginTop: "2px" }}>
                          → {m.bestNext.meta.name} dans {formatCountdown(m.bestNext.ms)}
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
                        <span style={{ color: "#e2c97e", fontWeight: 600, fontSize: "12px" }}>>> {m.waypoint}</span>
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
                          [R] {m.resetNote}
                        </div>
                      )}
                      {m.bestNext && (
                        <div style={{ fontStyle: "normal", fontSize: "11px", color: "rgba(74,222,128,0.7)", marginBottom: "5px" }}>
                          {t("next_meta", { meta: m.bestNext.meta.name, sub: m.bestNext.meta.subname, time: formatLocalTime(m.bestNext.date) })}
                        </div>
                      )}
                      ⏱ ~{m.durationMin} min · {m.tip}
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
                      <div style={{ fontSize: "12px", fontWeight: 600 }}>{m.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                        <span style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{m.subname}</span>
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
                        <span style={{ color: "#e2c97e", fontWeight: 600, fontSize: "12px" }}>>> {m.waypoint}</span>
                        <button className={`wp-btn ${copied === m.id ? "copied" : ""}`}
                          onClick={e => { e.stopPropagation(); copyCode(m.wpCode, m.id); }}>
                          {copied === m.id ? t("btn_copied") : `${m.wpCode} [c]`}
                        </button>
                      </div>
                      {m.resetNote && (
                        <div style={{ fontStyle: "normal", fontSize: "11px", color: "rgba(251,146,60,0.8)", marginBottom: "5px" }}>
                          [R] {m.resetNote}
                        </div>
                      )}
                      {m.vendor && (
                        <div style={{ fontStyle: "normal", fontSize: "11px", color: "rgba(52,211,153,0.8)", marginBottom: "5px" }}>
                          [V] {m.vendor}
                        </div>
                      )}
                      {m.tip}
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
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#34d399", marginBottom: "5px" }}>{t("chars_title")}</div>
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
                      <div style={{ fontSize: "11px", fontWeight: 600 }}>{cur.name}</div>
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
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#fb923c", marginBottom: "5px" }}>⚔ Conflux — World vs World</div>
            <div style={{ fontSize: "12px", color: "rgba(226,201,126,0.65)", lineHeight: 1.5 }}>
              {t("wvw_reset_note_pre")}<strong>{t("wvw_reset_note_day")}</strong>{t("wvw_reset_note_post")}
            </div>
          </div>
          <div className="section-label">{t("sec_weekly")}</div>
          {(leg?.wvwActivities ?? []).map(a => (
            <div key={a.id} className="wvw-card" style={{ "--leg-color": legColor }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px", width: "26px" }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: "10px", color: "#fb923c", fontFamily: "'Crimson Text', serif" }}>{a.limit}</div>
                  <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif", marginTop: "2px" }}>{a.tip}</div>
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
                    <span style={{ fontSize: 11, color: tierDone ? "#4ade80" : tier.color, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>{tier.name}</span>
                    <span style={{ fontSize: 9, color: "rgba(226,201,126,0.35)", fontFamily: "'Crimson Text', serif" }}>({tierCount}/{tier.episodes.length})</span>
                  </div>
                  <span style={{ fontSize: 10, color: "rgba(226,201,126,0.3)" }}>{expanded === tier.id ? "▲" : "▼"}</span>
                </div>

                {/* Épisodes */}
                {expanded === tier.id && (
                  <div style={{ padding: "4px 12px 10px" }}>
                    {tier.tip && (
                      <div style={{ fontSize: 10, color: "rgba(226,201,126,0.45)", fontFamily: "'Crimson Text', serif", marginBottom: 8, lineHeight: 1.5 }}>
                        {tier.tip}
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
                            {ep.name}
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
            <div style={{ fontSize: "12px", fontWeight: 600, color: legColor, marginBottom: "5px" }}>[M] Bounty Train</div>
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
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>{b.map}</div>
                  <div style={{ fontSize: "10px", color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{b.target} · ~{b.elegy} Elegy</div>
                </div>
                <button className={`check-btn ${bountyDone[b.id] ? "done" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleBounty(b.id); }}>
                  {bountyDone[b.id] ? "✓" : "Kill"}
                </button>
              </div>
              {expanded === b.id && (
                <div className="tip-box">
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px", fontStyle: "normal" }}>
                    <span style={{ color: "#e2c97e", fontWeight: 600, fontSize: "12px" }}>>> {b.waypoint}</span>
                    <button className={`wp-btn ${copied === b.id ? "copied" : ""}`}
                      onClick={e => { e.stopPropagation(); copyCode(b.wpCode, b.id); }}>
                      {copied === b.id ? t("btn_copied") : `${b.wpCode} [c]`}
                    </button>
                  </div>
                  {b.tip}
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
                    {ach1Done ? "✓ " : ""}Aurora: Awakening
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
                  { key: "aurora_pre_conspiracy", label: "Conspiracy of Dunces", map: "Bloodstone Fen", item: "Sentient Anomaly",    obj: "3 journaux White Mantle" },
                  { key: "aurora_pre_token",      label: "Token Collector",       map: "Ember Bay",       item: "Sentient Aberration", obj: "40 Mursaat tokens" },
                  { key: "aurora_pre_cin",        label: "Cin Business",           map: "Lake Doric",      item: "Sentient Oddity",     obj: "objets de Cin" },
                  { key: "aurora_pre_lessons",    label: "Lessons Learned",        map: "Draconis Mons",   item: "Sentient Singularity",obj: "14 recordings de Zinn" },
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
                                  <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.1)", borderRadius: 3, padding: "1px 5px" }}>{p.map}</span>
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
                            ⚠ {timegate}
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
                              <div style={{ fontSize: 11, fontWeight: 600, color: itemDone ? "rgba(74,222,128,0.6)" : "rgba(226,201,126,0.95)" }}>{item.name}</div>
                              {missing && <div style={{ fontSize: 10, color: "rgba(226,201,126,0.45)", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>{item.how}</div>}
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
                    {ach2Done ? "✓ " : ""}Aurora II: Empowering
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
                            <span style={{ fontSize: 11, fontWeight: 600, color: done ? "#4ade80" : "rgba(226,201,126,0.8)" }}>{item.name}</span>
                            <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.1)", borderRadius: 3, padding: "1px 5px" }}>{item.map}</span>
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{item.how}</div>
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
          { key: "vision_istan",       label: "Visions of Istan",             map: "Domain of Istan" },
          { key: "vision_kourna",      label: "Visions of Kourna",            map: "Domain of Kourna" },
          { key: "vision_jahai",       label: "Visions of Jahai",             map: "Jahai Bluffs" },
          { key: "vision_sandswept",   label: "Visions of Sandswept Isles",   map: "Sandswept Isles" },
          { key: "vision_thunderhead", label: "Visions of Thunderhead Peaks", map: "Thunderhead Peaks" },
          { key: "vision_dragonfall",  label: "Visions of Dragonfall",        map: "Dragonfall" },
        ];
        const v1Count = VISIONS_OF.filter(v => vc[v.key]?.done).length;

        const CONVERGENCE = [
          { key: "vision_convergence_1", label: "The Convergence of Sorrow I: Elegy",   note: "6 items Elegy — liés aux Requiem Armor collections" },
          { key: "vision_convergence_2", label: "The Convergence of Sorrow II: Requiem", note: "6 items Requiem — suite de Elegy" },
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
                    {v1Done ? "✓ " : ""}Vision I: Awakening
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
                      <span style={{ fontSize: 11, fontWeight: 600, color: done ? "#4ade80" : "rgba(226,201,126,0.8)" }}>{v.label}</span>
                      <span style={{ fontSize: 9, color: "rgba(226,201,126,0.3)", marginLeft: 7, background: "rgba(226,201,126,0.05)", border: "1px solid rgba(226,201,126,0.1)", borderRadius: 3, padding: "1px 5px" }}>{v.map}</span>
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
                        <span style={{ fontSize: 11, fontWeight: 700, color: C, fontFamily: "'Cinzel', serif", letterSpacing: "0.04em" }}>Memory Essence Encapsulator</span>
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
                          <span>{ing.name}</span>
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
                    {v2Done ? "✓ " : ""}Vision II: Farsight
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
                      <div style={{ fontSize: 11, fontWeight: 600, color: done ? "#4ade80" : "rgba(226,201,126,0.8)" }}>{c.label}</div>
                      <div style={{ fontSize: 10, color: "rgba(226,201,126,0.4)", fontFamily: "'Crimson Text', serif" }}>{c.note}</div>
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
      {activeTab === "currencies" && (
        <div>
          <div className="section-label">{t("sec_currency", { name: leg?.name })}</div>
          {mainProgress.map(cur => (
            <div key={cur.id} style={{ margin: "6px 14px", padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(226,201,126,0.08)", borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ fontSize: "16px" }}>{cur.icon}</span>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600 }}>{cur.name}</div>
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
                      <div style={{ fontSize: "12px", fontWeight: 600 }}>{m.name}</div>
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
                      {m.tip}
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
