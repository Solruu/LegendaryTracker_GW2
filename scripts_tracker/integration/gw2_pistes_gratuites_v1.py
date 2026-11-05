#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pistes gratuites lues sur les captures : avertissements « seule piste payante » (05/11).

Usage : python3 scripts_tracker/integration/gw2_pistes_gratuites_v1.py SRC DST

`check_free_sources` signalait 40 composants dont la seule source repetable
declaree est payante — le plus souvent le comptoir, parce que la voie de jeu
n'etait pas marquee. Lecture des captures (ressources/wiki/<id>.html,
section Acquisition) et constat pose dans le champ existant
`free_sources_note`, avec sa reference :
- raffinage depuis une matiere recoltee ou recyclee (boite Recipe « Type
  Refinement ») : planches, lingots, carre de cuir, rouleau de gossamer.
  Acier et darksteel demandent en plus 1 Lump of Coal / of Primordium, a acheter : dit ;
- recolte, butin ou recyclage (sections Gathered from, Dropped by, Salvaged
  from) : jade, piments, baies, truffes, magnetites, cuir durci, doublons,
  Eye of Kormir, minerai de cuivre, orbes.
Unidentified Dye : la piste de recompense JcJ deja listee est gratuite et
repetable — marquee. Restent signales, a juste titre : les vendeurs payants
sans plafond lu (Icy Runestone, Hydrocatalytic Reagent, Seer Runestone, Sun
Bead), l'ambre gris (5 par jour, Local Legend), les plats et composants
fabriques dont un ingredient est payant. Aucune arete, aucun total.
"""
import html as H
import json
import re
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
C = d["craft_components"]
J = "2026-11-05"
W = "ressources/wiki/"
SECS = {"Gathered_from": ("récolte", "gathered"), "Dropped_by": ("butin", "drops"),
        "Salvaged_from": ("recyclage", "salvage"), "Harvested_from": ("récolte", "harvest")}


def lire(cid):
    s = Path(W + cid + ".html").read_text(encoding="utf-8")
    i = s.find('id="Acquisition"')
    j = s.find('id="Used_in"', i)
    seg = s[i:j if j > 0 else len(s)]
    secs = [k for k in re.findall(r'id="([A-Za-z_]+)"', seg) if k in SECS]
    t = re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", seg)))
    m = re.search(r"Type Refinement.*?Ingredients (\d+) ([A-Z][\w' ]+?)(?: (\d+) ([A-Z][\w' ]+?))? Show base", t)
    return secs, m


RAFFINES = ["ancient_wood_plank", "elder_wood_plank", "hard_wood_plank", "seasoned_wood_plank", "bolt_of_gossamer",
            "mithril_ingot", "orichalcum_ingot", "platinum_ingot", "iron_ingot", "steel_ingot", "darksteel_ingot",
            "cured_hardened_leather_square"]
RECOLTES = ["chunk_of_pure_jade", "ghost_pepper", "omnomberry", "orrian_truffle", "glacial_lodestone", "molten_lodestone",
            "hardened_leather_section", "silver_doubloon", "eye_of_kormir", "copper_ore", "chrysocola_orb", "opal_orb"]
for cid in RAFFINES:
    secs, m = lire(cid)
    assert m, cid
    q, nom, q2, nom2 = m.groups()
    extra_fr = f" + {q2} {nom2}" if q2 else ""
    extra_en = f" + {q2} {nom2}" if q2 else ""
    C[cid]["free_sources_note"] = {
        "fr": f"Raffinage : {q} {nom}{extra_fr} pour 1. " + ("Le minerai se récolte ; l'ingrédient d'appoint reste à acheter." if q2 else "La matière première se récolte ou se recycle, sans or."),
        "en": f"Refinement: {q} {nom}{extra_en} for 1. " + ("The ore is gathered; the extra ingredient must be bought." if q2 else "The raw material is gathered or salvaged, no gold."),
        "verified": True, "checked": J, "ref": W + f"{cid}.html, Acquisition (Recipe, Type Refinement)"}
for cid in RECOLTES:
    secs, _ = lire(cid)
    assert secs, cid
    fr = ", ".join(dict.fromkeys(SECS[s][0] for s in secs))
    en = ", ".join(dict.fromkeys(SECS[s][1] for s in secs))
    C[cid]["free_sources_note"] = {
        "fr": f"Voies gratuites et répétables lues sur la page : {fr}. Le comptoir n'est qu'un raccourci.",
        "en": f"Free repeatable routes read on the page: {en}. The trading post is only a shortcut.",
        "verified": True, "checked": J,
        "ref": W + f"{cid}.html, Acquisition (" + ", ".join(s.replace("_", " ") for s in secs) + ")"}
s = [x for x in C["unidentified_dye"]["sources"] if x.get("type") == "pvp_reward_track"]
assert len(s) == 1
s[0]["free_repeatable"] = True
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print(len(RAFFINES) + len(RECOLTES) + 1, "composants")
