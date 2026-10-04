#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Retire le cout de FORGE des Mystic Clovers des cles a plat.

Usage : python3 scripts_tracker/integration/gw2_cout_trefles_v1.py SRC DST

Decision d'Antoine (04/10/2026) : la voie par defaut des trefles est la piste
de recompenses PvP ou McM, plus le Wizard's Vault (20 par saison) ; la Forge
— horriblement chere — n'est qu'une voie alternative. Le trefle reste
l'exigence affichee ; ce qu'il coute depend de la voie, portee par
`cadence.sources[]` du composant. C'etait deja la regle de
parseurs/gw2_edges_wiki (v9/v10), qui refuse la recette du trefle en arete.

Or des cles a plat recopiaient l'estimation de Forge (~3,24 ectos,
obsidiennes et pieces par trefle) :
- 15 legendaires a arbre gw2efficiency : la part « trefles » de chaque cle
  est lue dans l'arbre (enfants directs des noeuds Mystic Clover) et
  retiree ; le script refuse si la cle est plus petite que cette part. Le
  reste de la cle (capacitors d'Ad Infinitum, 515 ectos d'Endless Summer...)
  est conserve. Verifie avant ecriture : apres retrait, tracker - trefles =
  arbre - trefles partout ou ils etaient egaux, les ecarts anterieurs
  (Aurora, Vision, Orrax, Klobjarne ecto) sont inchanges ;
- 35 armes gen1 et gen3 : `mystic_coin` 250. Aucune recette n'en demande
  (Gift of Fortune : 77 trefles, 250 ectos, Gift of Magic, Gift of Might ;
  gen3 : Draconic Tribute, Gift of Jade Mastery...) ; c'est le
  « ~250 Mystic Coins » de la prose des pages d'armes, cout des trefles.

Non touche : Eikasia, 80 ectos pour 18 trefles — page absente du depot, pas
d'arbre ; on ne sait pas quelle part est la Forge.
"""
import collections, json, sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RACINE / "scripts_tracker" / "parseurs"))
import gw2_parse_recipe_tree_v2 as arbre

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
OBJETS = {"Glob of Ectoplasm": "glob_of_ectoplasm", "Obsidian Shard": "obsidian_shard",
          "Mystic Coin": "mystic_coin"}
G = RACINE / "ressources" / "gw2efficiency"
CVA = "coalescence_vision_ad_infinitum.html"
ARBRES = {"aetheric_anchor": ("aetheric_anchor.html", None), "aurora": ("aurora.html", None),
          "conflux": ("conflux.html", None), "endless_summer": ("endless_summer.html", None),
          "klobjarne_geirr": ("klobjarne_geirr.html", None),
          "orrax_manifested": ("orrax_manifested.html", None),
          "selachimorpha": ("selachimorpha.html", None),
          "stella_radians": ("stella_radians.html", None),
          "strife_unending": ("strife_unending.html", None),
          "the_ascension": ("the_ascension.html", None),
          "transcendence": ("transcendence.html", None), "warbringer": ("warbringer.html", None),
          "coalescence": (CVA, "Coalescence"), "vision": (CVA, "Vision"),
          "ad_infinitum": (CVA, "Ad Infinitum")}


def part_trefles(fichier, racine):
    h = (G / fichier).read_text(encoding="utf-8", errors="replace")
    if racine:
        a, z = arbre.racines(h, ["Coalescence", "Vision", "Ad Infinitum"])[racine]
        h = h[a:z]
    ns = arbre.noeuds(h)
    out = collections.Counter()
    for i, (n, q, p) in enumerate(ns):
        if n != "Mystic Clover":
            continue
        enfant = None
        for j in range(i + 1, len(ns)):
            if ns[j][2] <= p:
                break
            enfant = ns[j][2] if enfant is None else min(enfant, ns[j][2])
            if ns[j][2] == enfant and ns[j][0] in OBJETS:
                out[OBJETS[ns[j][0]]] += ns[j][1]
    return out


journal = []


def retire(cid, leg, part):
    q = cc[cid]["qty"]
    if not q.get(leg):
        return
    assert q[leg] >= part, (cid, leg, q[leg], part)
    q[leg] -= part
    journal.append((leg, cid, q[leg] + part, q[leg]))
    if q[leg] == 0:
        del q[leg]
        ovl = cc[cid].get("qty_overlap_verified")
        if ovl and leg in ovl:
            ovl.remove(leg)


for leg, (f, r) in ARBRES.items():
    for cid, part in part_trefles(f, r).items():
        retire(cid, leg, part)

n = 0
for k in list(cc["mystic_coin"]["qty"]):
    if k.startswith(("gen1_", "gen3_")):
        assert cc["mystic_coin"]["qty"][k] == 250, k
        retire("mystic_coin", k, 250)
        n += 1
assert n == 35, n

# Notes de chevauchement ecrites pour des cles « trefles » desormais retirees.
for cid in ("glob_of_ectoplasm", "obsidian_shard"):
    note = cc[cid].get("qty_overlap_note")
    if note and all(x not in cc[cid]["qty"] for x in ("aurora", "klobjarne_geirr")):
        del cc[cid]["qty_overlap_note"]

d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
for leg, cid, a, b in journal:
    if not leg.startswith(("gen1_", "gen3_")):
        print(f"  {leg:18s} {cid:18s} {a} -> {b}")
print("gen1/gen3 : mystic_coin 250 retire sur", n, "armes ; ecrit", DST)
