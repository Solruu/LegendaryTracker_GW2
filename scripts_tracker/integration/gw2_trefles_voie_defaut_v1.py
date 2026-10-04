#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Conseils du Mystic Clover alignes sur la voie par defaut.

Usage : python3 scripts_tracker/integration/gw2_trefles_voie_defaut_v1.py SRC DST

Regle d'Antoine (04/10/2026, confirmee) : les trefles sont trop couteux en
achat ou en Forge ; l'alternative est proposee mais n'est jamais la voie par
defaut, il faut preferer la timegate — pistes de recompense PvP / McM et
Coffre du Sorcier (20 par saison).

La donnee disait l'inverse : `best: vendor` (le JSX affiche en ⭐ le premier
`sources[]` de ce type, donc Lyhr, « la source decisive ») et `cap_note`
concluait « le trefle n'est pas un timegate, c'est un cout ». Textes et `best`
seulement, aucune quantite. Les montants et plafonds restent ceux du wiki ;
la phrase « 25/semaine » de `note`, deja dementie par `cap_note` (45), est
alignee sur elle.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
c = d["craft_components"]["mystic_clover"]
S = {(s.get("type"), s.get("npc")): s for s in c["sources"]}

assert c["best"] == "vendor"
c["best"] = "reward_track"
c["best_reason"] = {
    "fr": "voie par défaut : gratuite, seulement du temps de jeu, avec les 20 trèfles par saison du Coffre du Sorcier. Vendeurs et Forge sont des alternatives coûteuses, à n'utiliser qu'en connaissance de cause.",
    "en": "default route: free, playtime only, plus the Wizard's Vault's 20 clovers per season. Vendors and the Forge are costly alternatives, only to be used knowingly."}

rt = S[("reward_track", None)]
rt["tip"] = {
    "fr": "Voie par défaut. Pistes de récompense PvP et McM : 2 trèfles pour une piste répétable, 7 pour la plupart des pistes non répétables de Monde vivant et d'extension. Gratuit, sans plafond autre que le temps de jeu.",
    "en": "Default route. PvP and WvW reward tracks: 2 clovers for a repeatable track, 7 for most non-repeatable Living World and expansion tracks. Free, no cap beyond playtime."}

ly = S[("vendor", "Lyhr / Tisseuse de garde Lucirae")]
assert "source décisive" in ly["tip"]["fr"]
ly["tip"] = {
    "fr": "Alternative, jamais la voie par défaut. 3 écus mystiques + 3 éclats d'obsidienne + 3 éclats spirituels + 5 ectoplasmes par trèfle. Sans plafond, et hors du quota de Miyani malgré un coût identique : c'est la seule voie illimitée, mais elle se paie très cher.",
    "en": "Alternative, never the default route. 3 Mystic Coins + 3 Obsidian Shards + 3 Spirit Shards + 5 Globs of Ectoplasm per clover. No cap, and outside Miyani's limit despite an identical cost: the only unlimited route, but a very expensive one."}

mf = S[("mystic_forge", None)]
mf["tip"] = {
    "fr": "Alternative coûteuse. Recette Forge mystique, sans plafond : ~31 % de chance par tentative selon les relevés communautaires. Le reste du temps elle rend des matériaux T5/T6. Rentable seulement si tu as des écus mystiques à revendre.",
    "en": "Costly alternative. Mystic Forge recipe, uncapped: ~31% chance per attempt per community measurements. The rest of the time it yields T5/T6 materials. Only worth it if you have Mystic Coins to spare."}

assert "pas un timegate" in c["cap_note"]["fr"]
c["cap_note"]["fr"] = "Il n'existe pas de plafond global de 25 trèfles par semaine : les vendeurs plafonnés totalisent 45/semaine (15 Manfred + 10 BUY-4373 + 10 Miyani + 5 Dugan + 5 PvP), et Lyhr et la Tisseuse de garde Lucirae vendent sans limite, au prix de Miyani, sans consommer son quota. Mais tous se paient en écus mystiques, éclats spirituels, obsidienne et ectoplasmes : ce sont des alternatives. La voie par défaut reste la timegate — pistes de récompense PvP / McM et 20 par saison au Coffre du Sorcier."
c["cap_note"]["en"] = "There is no global cap of 25 clovers per week: capped vendors total 45/week (15 Manfred + 10 BUY-4373 + 10 Miyani + 5 Dugan + 5 PvP), and Lyhr and Ward Crafter Lucirae sell with no limit at Miyani's price, without consuming her quota. But all of them cost Mystic Coins, Spirit Shards, Obsidian and Ectoplasm: they are alternatives. The default route remains the timegate — PvP / WvW reward tracks and 20 per season from the Wizard's Vault."

n = c["note"]
old_fr = "Total plafonné hors Mystic Forge : 15 (Manfred) + 5 (Dugan) + 5 (PvP) = 25/semaine, plus 20/saison au Coffre."
old_en = "Capped total excluding the Mystic Forge: 15 (Manfred) + 5 (Dugan) + 5 (PvP) = 25/week, plus 20/season in the Vault."
assert old_fr in n["fr"] and old_en in n["en"]
n["fr"] = n["fr"].replace(old_fr, "Voie par défaut : pistes de récompense PvP / McM et 20/saison au Coffre ; les vendeurs (45/semaine plafonnés, Lyhr sans limite) et la Forge sont des alternatives payantes.")
n["en"] = n["en"].replace(old_en, "Default route: PvP / WvW reward tracks and 20/season from the Vault; vendors (45/week capped, Lyhr unlimited) and the Forge are paid alternatives.")

f = c["free_sources_note"]
a_fr = "C'est ce qui rend le trèfle difficile : pas le temps, mais la chaîne de matériaux derrière."
a_en = "That is what makes clovers hard: not time, but the material chain behind them."
assert a_fr in f["fr"] and a_en in f["en"]
f["fr"] = f["fr"].replace(a_fr, "C'est pourquoi la timegate — pistes et Coffre du Sorcier — est la voie par défaut, et les vendeurs une alternative coûteuse.")
f["en"] = f["en"].replace(a_en, "That is why the timegate — tracks and Wizard's Vault — is the default route, and vendors a costly alternative.")

d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
