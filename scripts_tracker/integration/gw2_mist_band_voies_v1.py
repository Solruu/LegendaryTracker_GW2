#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mist Band (Infused) : trois voies au choix, une seule comptee (20/10).

Usage : python3 scripts_tracker/integration/gw2_mist_band_voies_v1.py SRC DST

1. La bague de Conflux comptait les TROIS achats a la fois (tessons de gloire
   + reliques immaculees + tickets d'escarmouche), alors qu'un seul suffit, et
   oubliait les 2 Integrated Fractal Matrix de la voie fractale et les 250
   Memory of Battle de la voie McM (mist_band_infused.html, Acquisition).
   Chaque voie devient un composant d'achat, et les trois forment un choix
   (`alt_groups`, meme mecanique que les dons de maitrise gen2) : la voie
   choisie est la seule comptee. Defaut : fractales (decision d'Antoine,
   20/10 : joueur PvE).
2. Integrated Fractal Matrix (id 79230) : achat 10 Stabilizing Matrix + 15
   Fractal Relics chez BLING-9009 ou INFUZ-5959 ; recompense des six modes
   defi (integrated_fractal_matrix.html).
4. Contrat d'onglets : Activites s'ouvre sur la regle calculee `has_metas`.
3. Metas : ressources lues dans les conseils des composants, pour les metas
   qui n'en declaraient pas (deduction automatique des metas par legendaire).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-10-20"
W = "ressources/wiki/"
MB = "mist_band_infused"


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    assert parent not in q, (enfant, parent)
    q[parent] = n
    nf = c.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


# 1. retirer les trois voies additionnees
for cid, v in (("ascended_shard_of_glory", 150), ("shard_of_glory", 170),
               ("pristine_fractal_relic", 100), ("skirmish_claim_ticket", 350)):
    assert cc[cid]["qty"].pop(MB) == v, cid
    nf = cc[cid].get("needed_for")
    if isinstance(nf, list) and MB in nf:
        nf.remove(MB)

# 2. IFM
assert "integrated_fractal_matrix" not in cc
cc["integrated_fractal_matrix"] = {
    "name": "Integrated Fractal Matrix", "apiId": 79230, "kind": "acquire", "farmable": True,
    "qty": {}, "needed_for": [], "best": "vendor",
    "sources": [
        {"type": "vendor", "npc": "BLING-9009 / INFUZ-5959", "map": "Mistlock Observatory",
         "tip": {"fr": "10 Stabilizing Matrices + 15 reliques fractales, à l'Observatoire de Gardebrume.",
                 "en": "10 Stabilizing Matrices + 15 Fractal Relics, in the Mistlock Observatory."},
         "verified": True, "checked": J, "ref": f"{W}integrated_fractal_matrix.html, Sold by"},
        {"type": "fractals", "free_repeatable": True,
         "tip": {"fr": "Récompense des fractales en mode défi (Kinfall, Lonely Tower, Nightmare, Shattered Observatory, Silent Surf, Sunqua Peak).",
                 "en": "Reward from challenge-mode fractals (Kinfall, Lonely Tower, Nightmare, Shattered Observatory, Silent Surf, Sunqua Peak)."},
         "verified": True, "checked": J, "ref": f"{W}integrated_fractal_matrix.html, Rewarded by"}],
    "verified": True, "checked": J, "ref": f"{W}integrated_fractal_matrix.html"}

VOIES = {
    "mist_band_route_fractals": ({"fr": "Fractales (BUY-2046 PFR)", "en": "Fractals (BUY-2046 PFR)"},
                                 {"pristine_fractal_relic": 100, "integrated_fractal_matrix": 2},
                                 "BUY-2046 PFR, Observatoire de Gardebrume : 100 reliques immaculées + 2 Integrated Fractal Matrix.",
                                 "BUY-2046 PFR, Mistlock Observatory: 100 Pristine Fractal Relics + 2 Integrated Fractal Matrix."),
    "mist_band_route_pvp": ({"fr": "JcJ (vendeurs de ligue)", "en": "PvP (league vendors)"},
                            {"ascended_shard_of_glory": 150, "shard_of_glory": 170},
                            "Ascended Armor League Vendor / League Armor Vendor (Hall of Memories) : 150 Ascended Shards of Glory + 170 Shards of Glory. Les Ascended Shards viennent des paliers finaux des pistes de ligue.",
                            "Ascended Armor League Vendor / League Armor Vendor (Hall of Memories): 150 Ascended Shards of Glory + 170 Shards of Glory. Ascended Shards come from the league tracks' final tiers."),
    "mist_band_route_wvw": ({"fr": "McM (Skirmish Supervisor)", "en": "WvW (Skirmish Supervisor)"},
                            {"memory_of_battle": 250, "skirmish_claim_ticket": 350},
                            "Skirmish Supervisor (McM), Lionguard (Arche du Lion) ou Mercenary (Armistice Bastion) : 250 Memory of Battle + 350 tickets d'escarmouche — les tickets sont déjà le facteur limitant de Conflux.",
                            "Skirmish Supervisor (WvW), Lionguard (Lion's Arch) or Mercenary (Armistice Bastion): 250 Memory of Battle + 350 Skirmish Claim Tickets — tickets are already Conflux's bottleneck."),
}
for cid, (nom, cout, fr, en) in VOIES.items():
    assert cid not in cc
    cc[cid] = {"name": nom, "kind": "purchase", "farmable": True, "qty": {}, "needed_for": [],
               "wiki": "Mist_Band_(Infused)",
               "sources": [{"type": "vendor", "tip": {"fr": fr, "en": en}, "verified": True,
                            "checked": J, "ref": f"{W}mist_band_infused.html, Acquisition"}],
               "verified": True, "checked": J, "ref": f"{W}mist_band_infused.html"}
    for enfant, n in cout.items():
        arete(enfant, cid, n)
arete("stabilizing_matrix", "integrated_fractal_matrix", 10)
arete("fractal_relic", "integrated_fractal_matrix", 15)

assert "mist_band_route" not in d["alt_groups"]
d["alt_groups"]["mist_band_route"] = {
    "qty": 1, "options": list(VOIES), "default": "mist_band_route_fractals", "targets": [MB],
    "label": {"fr": "Mist Band (Infused) — un seul achat, selon ton mode de jeu",
              "en": "Mist Band (Infused) — one purchase, by game mode"},
    "note": {"fr": "Trois vendeurs vendent la même bague. Fractales par défaut (joueur PvE) ; le JcJ ne touche pas aux tickets McM ; le McM ajoute 350 tickets à la ressource qui limite déjà Conflux.",
             "en": "Three vendors sell the same ring. Fractals by default (PvE player); PvP leaves WvW tickets alone; WvW adds 350 tickets to the resource already limiting Conflux."},
    "ref": f"{W}mist_band_infused.html, Acquisition (trois vendeurs, trois prix)",
    "verified": True, "checked": J}
mb = cc[MB]
mb["sources"] = [{"type": "vendor", "tip": {
    "fr": "Un seul achat, trois vendeurs au choix : fractales, JcJ ou McM (choix « mode de jeu » de l'onglet Matériaux / Grand Total).",
    "en": "One purchase, three vendors to pick from: fractals, PvP or WvW (\"game mode\" choice in the Materials / Grand Total tab)."},
    "verified": True, "checked": J, "ref": f"{W}mist_band_infused.html, Acquisition"}]

# 3. metas : ressources sourcees par les conseils des composants
M = d["meta_events"]
AJOUTS = {
    "bf": [("fresh_winterberry", "craft_components/fresh_winterberry.sources (« Nœuds, events et métas — Confins de Givramer »)")],
    "bf_meta": [("fresh_winterberry", "craft_components/fresh_winterberry.sources (« Nœuds, events et métas — Confins de Givramer »)")],
    "sl": [("ancient_cipher", "craft_components/ancient_cipher.sources (« Coffre caché du Reliquaire »)")],
    "shackles": [("shadowstone_fragment", "craft_components/shadowstone_fragment.sources (« Shackles of the Ancients en rend 5 au coffre quotidien »)")],
    "di": [("kralkatite_ore", "craft_components/kralkatite_ore.sources (« Nodes, events et metas — Domaine d'Istan »)")],
    "mistburned": [("mursaat_obsidian_chunk", "craft_components/mursaat_obsidian_chunk.sources (Grand Chest de la méta)"),
                   ("titan_heatstone", "craft_components/titan_heatstone.sources (Grand Chest de la méta)"),
                   ("shard_of_mistburned_barrens", "craft_components/shard_of_mistburned_barrens.sources (« events, chests, meta »)"),
                   ("curious_mursaat_ruin_shard", "craft_components/curious_mursaat_ruin_shard.sources (événements des Landes)")],
    "hammerhart": [("chromatic_sap", "craft_components/chromatic_sap.sources (méta « Hammerhart Rumble! »)")],
    "weald": [("raw_enchanting_stone", "craft_components/raw_enchanting_stone.sources (méta « Secrets of the Weald »)")],
    "adinf_dailies": [("fractal_research_page", f"{W}fractal_journal.html (1 page par fractale recommandée quotidienne)")],
    "adinf_cms": [("fractal_research_page", f"{W}fractal_journal.html (1 page par fractale en mode défi)")],
}
for mid, lst in AJOUTS.items():
    m = M[mid]
    r = m.get("rewards") or []
    refs = m.get("rewards_refs") or {}
    for cid, ref in lst:
        assert cid in cc, cid
        if cid not in r:
            r.append(cid)
        refs[cid] = ref
    m["rewards"] = r
    m["rewards_refs"] = refs

# 5. Pristine Fractal Relic : sources lues sur sa page (la note « max 4-5 par
# jour » sous-estimait les coffres quotidiens).
pf = cc["pristine_fractal_relic"]
pf["sources"] = [
    {"type": "fractals_daily", "free_repeatable": True, "cadence": "quotidienne", "verified": True, "checked": J,
     "ref": f"{W}pristine_fractal_relic.html, Acquisition",
     "tip": {"fr": "Coffres des succès quotidiens de fractales : 3 par palier quotidien (4 paliers) et 1 par recommandée (3), soit le gros du revenu. Les modes défi en ajoutent.",
             "en": "Daily fractal achievement chests: 3 per daily tier (4 tiers) and 1 per recommended (3), the bulk of the income. Challenge modes add more."}},
    {"type": "challenge_mode", "free_repeatable": True, "cadence": "quotidienne", "verified": True, "checked": J,
     "ref": f"{W}pristine_fractal_relic.html, Acquisition",
     "tip": {"fr": "Fractales en mode défi : reliques immaculées en plus des dailies.",
             "en": "Challenge-mode fractals: Pristine Relics on top of the dailies."}}]
pf["ref"] = f"{W}pristine_fractal_relic.html"

# 4. onglet Activites : il s'ouvre sur les metas DEDUITES (JSX v264), plus sur
# la liste ecrite a la main, desormais reduite aux metas sans ressource.
tc = d["tab_contract"]
tc["computed_rules"]["has_metas"] = {
    "fr": "Vrai si au moins une meta est rattachee au legendaire : une meta dont une ressource (`rewards`) reste a farmer pour lui (deduite du moteur, collections faites deduites), ou une meta sans ressource declaree dans sa liste `metas`.",
    "en": "True if at least one meta is tied to the legendary: a meta whose resource (`rewards`) is still to farm for it (derived from the engine, completed collections deducted), or a resource-less meta listed in its `metas`."}
act = tc["tabs"]["activities"]["when"]["any_of"]
assert {"count": "metas", "min": 1} in act
act[act.index({"count": "metas", "min": 1})] = {"computed": "has_metas"}

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
