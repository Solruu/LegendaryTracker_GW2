#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pistes renouvelables lues sur les captures : 21 avertissements de l'audit (05/11).

Usage : python3 scripts_tracker/integration/gw2_pistes_renouvelables_v1.py SRC DST

`check_free_sources` signalait 21 composants exiges par 100 ou plus sans piste
renouvelable declaree. Lecture page par page (ressources/wiki/<page>.html) :
- Airship Part, Ley Line Crystal, Lump of Aurillium : « Gathered from » —
  coffres et caches des cartes (Airship Cargo garanti a Verdant Brink,
  Crystallized Supply Cache a Tangled Depths, Exalted Chest a Auric Basin) :
  gratuit, repetable ;
- Exotic Essence of Luck : « Salvaged from » (objets rares) : gratuit ;
- Fractalline Dust : 4 a 6 par fractale en Quickplay (niveau 80) et 10 par
  succes « Incursive Investigation » ; la source « Full material list »
  remplacee ;
- Refined Homestead Fiber / Metal / Wood : echange de materiaux recoltes au
  domaine (Homestead Refinement), plafonds hebdomadaires par materiau ;
- Icy Runestone : Rojan the Penitent (Frostgorge Sound, apres la reussite de
  Breaking the Claw of Jormag) pour 1 or OU 1 Mystic Runestone ; Jormag
  Defender's Kit (10). La source « 1 po chez les marchands de la Forge
  mystique » (arbres GW2Efficiency, 22/08) n'est pas sur la page : remplacee.
  L'arete or (1 par rune) est inchangee ;
- les 12 tessons gen2 (Shard of Arah...) : recette d'artisan 450, Tribute +
  Mystic Curio + lingots de mithril + planches d'ancetre, aretes deja posees
  (`gw2_curio_tributes_v1`) — leur conseil « ingredients non modelises » etait
  perime. Fabriques : `free_via_ingredients`. Option : Chest of Legendary
  Shards (3, au choix).
Aucune arete ni total touche.
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


def txt(p):
    return re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", Path(W + p + ".html").read_text(encoding="utf-8"))))


def T(fr, en):
    return {"fr": fr, "en": en}


def marque(cid, typ, ref):
    ss = [s for s in C[cid]["sources"] if s.get("type") == typ]
    assert len(ss) == 1, (cid, typ)
    ss[0].update({"free_repeatable": True, "verified": True, "checked": J, "ref": W + ref})


for cid, coffre in (("airship_part", "Airship Cargo (3-68) ( guaranteed , in Verdant Brink )"),
                    ("ley_line_crystal", "Crystallized Supply Cache"),
                    ("lump_of_aurillium", "Exalted Chest")):
    assert coffre in txt(cid), cid
    marque(cid, "map_currency", f"{cid}.html, Gathered from")
assert 'id="Salvaged_from"' in Path(W + "exotic_essence_of_luck.html").read_text(encoding="utf-8")
marque("exotic_essence_of_luck", "salvage", "exotic_essence_of_luck.html, Salvaged from")

t = txt("fractalline_dust")
assert "Completing Fractals of the Mists in Quickplay mode (4-6)" in t and "Reward: Fractalline Dust (10)" in t
C["fractalline_dust"]["sources"] = [{"type": "fractals", "free_repeatable": True, "cadence": "à volonté",
    "tip": T("4 à 6 par fractale terminée en mode Quickplay (personnages niveau 80) ; 10 par succès « Incursive Investigation » (3 incursions fractales en monde ouvert, en haut de l'heure).",
             "4-6 per Fractal completed in Quickplay mode (level 80 characters); 10 per 'Incursive Investigation' achievement (3 open-world Fractal Incursions, at the top of the hour)."),
    "verified": True, "checked": J, "ref": W + "fractalline_dust.html, Rewarded by, Achievements"}]
C["fractalline_dust"]["best"] = "fractals"

for cid in ("refined_homestead_fiber", "refined_homestead_metal", "refined_homestead_wood"):
    t = txt(cid)
    assert "Homestead Refinement" in t and "per week" in t, cid
    s = [s for s in C[cid]["sources"] if s.get("type") == "vendor"][0]
    s["free_repeatable"] = True
    s["note"] = T("Échange de matériaux récoltés au domaine : gratuit, plafonné par semaine et par matériau (voir la page).",
                  "Exchange of materials gathered in the homestead: free, capped per week and per material (see the page).")
    s["checked"] = J

t = txt("icy_runestone")
h = Path(W + "icy_runestone.html").read_text(encoding="utf-8")
seg = h[h.find('id="Sold_by"'):h.find('id="Contained_in"')]
assert seg.count("Rojan the Penitent") >= 2 and 'alt="Gold coin"' in seg and 'alt="Mystic Runestone"' in seg
assert "Jormag Defender's Kit (10) ( guaranteed )" in t
C["icy_runestone"]["sources"] = [
    {"type": "vendor", "npc": "Rojan the Penitent", "map": "Frostgorge Sound", "wpCode": "[&BNABAAA=]",
     "paid_repeatable": True, "cost": T("1 or", "1 gold"),
     "tip": T("Rojan le Pénitent (Bassin de Tremblesol, Détroit de la Hache-de-Givre), après la réussite de « Breaking the Claw of Jormag » : 1 or la rune, ou 1 Mystic Runestone.",
              "Rojan the Penitent (Earthshake Basin, Frostgorge Sound), after a successful 'Breaking the Claw of Jormag': 1 gold each, or 1 Mystic Runestone."),
     "verified": True, "checked": J, "ref": W + "icy_runestone.html, Sold by"},
    {"type": "chest", "tip": T("Contenu garanti du Jormag Defender's Kit (×10).", "Guaranteed contents of the Jormag Defender's Kit (×10)."),
     "verified": True, "checked": J, "ref": W + "icy_runestone.html, Contained in"},
] + [s for s in C["icy_runestone"]["sources"] if s.get("type") == "trading_post"]
C["icy_runestone"]["best"] = "vendor"

def vieux(s):
    # conseil perime : « ingredients non modelises » ou « Tesson de precurseur... » sans recette
    t = str(s.get("tip"))
    return s.get("type") == "mystic_forge" and ("non modélisés" in t or t.startswith("{'fr': 'Tesson de précurseur"))


FR = {"Weaponsmith": "Forgeron d'armes", "Huntsman": "Chasseur", "Artificer": "Artificier"}
n = 0
for cid, c in C.items():
    srcs = c.get("sources") or []
    if not (cid.startswith("shard_") and any(vieux(s) for s in srcs)):
        continue
    page = cid
    t = txt(page)
    m = re.search(r"Discipline (\w+) Req\. rating (\d+)", t)
    assert m and "Chest of Legendary Shards (3) ( choice )" in t, cid
    kids = {k: v["qty"][cid] for k, v in C.items() if cid in (v.get("qty") or {})}
    trib = [k for k in kids if k.startswith("tribute_")]
    assert len(trib) == 1 and kids.get("mystic_curio") == 1 and kids.get("mithril_ingot") and kids.get("elder_wood_plank"), cid
    nt = C[trib[0]]["name"]
    for s in srcs:
        if vieux(s):
            s["type"] = "craft"
            s["tip"] = T(f"Recette ({FR[m.group(1)]} {m.group(2)}) : 1 {nt} + 1 Mystic Curio + {kids['mithril_ingot']} Mithril Ingot + {kids['elder_wood_plank']} Elder Wood Plank. Option : Chest of Legendary Shards (3, au choix).",
                         f"Recipe ({m.group(1)} {m.group(2)}): 1 {nt} + 1 Mystic Curio + {kids['mithril_ingot']} Mithril Ingot + {kids['elder_wood_plank']} Elder Wood Plank. Option: Chest of Legendary Shards (3, choice).")
            s.update({"verified": True, "checked": J, "ref": W + f"{page}.html, Recipe, Contained in"})
    c["free_via_ingredients"] = True
    n += 1
assert n == 12, n
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("pistes renouvelables : 8 composants + 12 tessons")
