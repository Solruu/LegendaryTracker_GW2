#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Les 16 sources « unknown » restantes, lues une a une sur leur capture (05/11).

Usage : python3 scripts_tracker/integration/gw2_sources_inconnues_v1.py SRC DST

`gw2_voies_wiki_v1` (03/11) n'avait pas su les typer : pages sans sous-titre
d'acquisition (tableau de succes, liste « Contained in » nue, phrase). Lecture
manuelle, page par page (ressources/wiki/<page>.html) :

- superior_rune_of_holding : « Purchased from discipline-appropriate master
  craftsmen for 10 [Gold coin] » -> vendeur, 10 or par rune (arete gold_coin).
  Vision en demande 2 : +20 or.
- jar_of_paint_base : Tirzie the Painter (Orlaf Escarpments, Queensdale),
  1 848 karma -> arete karma. Six etapes de The Bifrost III en demandent 1 :
  +11 088 karma.
- drop_of_indigo_mushroom_milk : « Using an Indigo Mushroom while having 25 or
  more » ; la page de l'etape le chiffre (10 gouttes pour 250 champignons) ->
  arete indigo_mushroom 25. The Moot III : 1 -> 251 champignons, le nombre que
  donne la note de la page Indigo Mushroom.
- indigo_mushroom, purple_potato : recolte (noeuds de champignons — ne tombe
  qu'avec The Moot III ou The Minstrel I debloquee ; noeuds de pommes de terre).
- stick_of_butter, shallot, cheese_wedge : contenu garanti d'un lot (Chef
  Starter Kit x10, Shallots in Bulk x25, Cheese Wedges in Bulk x25), au hasard
  dans divers sacs. Aucun « Sold by » sur ces pages : pas de prix pose.
- askur_camping_cookout_backpiece, salmon_of_knowledge_backpiece : recompense
  de maitrise de carte (Bava Nisos : 10 succes ; Mistburned Barrens : 17).
- memory_of_bearkins_adversaries / _the_bearkins_hunts / _victories : succes
  de Klobjarne Geirr (boss du monde ou meta ; 250 ennemis a la lance en
  Janthir ; convergences ou raids), reinitialisables par achat de leur
  « Recollection » (prix non capture).
- harpy_feathers (8764, « Double-click to gain a pile of harpy feathers ») :
  la page est une desambiguisation ; l'entree qui correspond est « Harpy
  Feathers (consumable), a bundle sold by Forager Hitkiti in the Harathi
  Hinterlands (used in Nevermore IV) » -> vendeur, prix non capture.
- relic : objet generique (« une relique ») du Mystic Facet ; reliques de base
  par artisanat (recettes chez les maitres armuriers, travailleurs du cuir,
  tailleurs) ou au comptoir.
- symbol_ingredient : page de desambiguisation, aucun objet ; sans
  consommateur depuis v441 (`gw2_symboles_charmes_hasard_v1`).
"""
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


def page(nom):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", Path(W + nom + ".html").read_text(encoding="utf-8")))


def lie(enfant, parent, q):
    m = C[enfant]
    assert parent not in m.setdefault("qty", {}), (enfant, parent)
    m["qty"][parent] = q
    nf = m.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


def pose(cid, nouvelles, ref, best=None):
    c = C[cid]
    restes = [s for s in c.get("sources") or [] if not (isinstance(s, dict) and s.get("type") == "unknown")]
    assert len(restes) < len(c.get("sources") or []), cid
    for s in nouvelles:
        s.update({"verified": True, "checked": J, "ref": W + ref})
    c["sources"] = nouvelles + restes
    if best:
        c["best"] = best


def tip(fr, en):
    return {"fr": fr, "en": en}


t = page("superior_rune_of_holding")
assert "Purchased from discipline-appropriate master craftsmen for 10" in t
assert 'title="Gold coin"' in Path(W + "superior_rune_of_holding.html").read_text(encoding="utf-8")
pose("superior_rune_of_holding", [{"type": "vendor", "npc": "Master craftsmen", "cost": tip("10 or", "10 gold"),
     "tip": tip("Achat chez le maître artisan de la discipline : 10 or.", "Purchased from the discipline's master craftsman: 10 gold.")}],
     "superior_rune_of_holding.html, Acquisition", best="vendor")
lie("gold_coin", "superior_rune_of_holding", 10)

h = Path(W + "jar_of_paint_base.html").read_text(encoding="utf-8")
assert "Tirzie the Painter" in h and re.search(r"1,848.{0,200}alt=\"Karma\"", h, re.S)
pose("jar_of_paint_base", [{"type": "vendor", "npc": "Tirzie the Painter", "map": "Orlaf Escarpments (Queensdale)",
     "cost": tip("1 848 karma", "1,848 karma"),
     "tip": tip("Achat chez Tirzie la Peintre (Escarpements d'Orlaf, Plaine de la Reine) : 1 848 karma.",
                "Purchased from Tirzie the Painter (Orlaf Escarpments, Queensdale): 1,848 karma.")}],
     "jar_of_paint_base.html, Acquisition", best="vendor")
lie("karma", "jar_of_paint_base", 1848)

t = page("drop_of_indigo_mushroom_milk")
assert "Using an Indigo Mushroom while having 25 or more" in t and "10 Drops of Indigo Mushroom Milk from 250 Indigo Mushrooms" in t
pose("drop_of_indigo_mushroom_milk", [{"type": "craft",
     "tip": tip("Utiliser un Indigo Mushroom avec au moins 25 dans l'inventaire du personnage : 25 champignons donnent 1 goutte (10 gouttes pour 250).",
                "Use an Indigo Mushroom with 25 or more in the character's inventory: 25 mushrooms make 1 drop (10 drops from 250).")}],
     "drop_of_indigo_mushroom_milk.html, Acquisition, Related achievements", best="craft")
lie("indigo_mushroom", "drop_of_indigo_mushroom_milk", 25)

t = page("indigo_mushroom")
assert "Drops only for players who have the appropriate legendary collections unlocked" in t
pose("indigo_mushroom", [{"type": "gathering",
     "tip": tip("Récolte des nœuds de champignons (Button, Portobello, Sawgill, Varied, Orrian Truffle, Snow Truffle) — ne tombe qu'une fois The Moot III ou The Minstrel I débloquée, puis indéfiniment.",
                "Gathered from mushroom nodes (Button, Portobello, Sawgill, Varied, Orrian Truffle, Snow Truffle) — drops only once The Moot III or The Minstrel I is unlocked, then indefinitely.")}],
     "indigo_mushroom.html, Acquisition, Notes", best="gathering")
t = page("purple_potato")
assert "Harvested from potato nodes" in t
pose("purple_potato", [{"type": "gathering", "tip": tip("Récolte des nœuds de pommes de terre.", "Harvested from potato nodes.")}],
     "purple_potato.html, Acquisition", best="gathering")

for cid, lot, n, fr in (("stick_of_butter", "Chef Starter Kit", 10, "Chef Starter Kit"),
                        ("shallot", "Shallots in Bulk", 25, "Shallots in Bulk"),
                        ("cheese_wedge", "Cheese Wedges in Bulk", 25, "Cheese Wedges in Bulk")):
    t = page(cid)
    assert f"{lot} ({n}) ( guaranteed )" in t, cid
    assert "Sold by" not in t, cid
    pose(cid, [{"type": "chest",
         "tip": tip(f"Contenu garanti de {fr} (×{n}) ; au hasard dans divers sacs. La page ne cite aucun vendeur.",
                    f"Guaranteed contents of {fr} (×{n}); random in various bags. The page lists no vendor.")}],
         f"{cid}.html, Acquisition", best="chest")

for cid, carte, n, fr in (("askur_camping_cookout_backpiece", "Bava Nisos", 10, "Bava Nisos"),
                          ("salmon_of_knowledge_backpiece", "Mistburned Barrens", 17, "Mistburned Barrens")):
    t = page(cid)
    assert f"{carte} Mastery" in t and f"Complete {n} map achievements throughout {carte}" in t, cid
    pose(cid, [{"type": "achievement",
         "tip": tip(f"Récompense du succès « {carte} Mastery » : réussir {n} succès de carte à {fr}.",
                    f"Reward of the '{carte} Mastery' achievement: complete {n} map achievements in {carte}.")}],
         f"{cid}.html, Acquisition", best="achievement")

for cid, fr, en, recol in (
        ("memory_of_bearkins_adversaries", "boss du monde ou méta-événements (contenu des extensions et du Monde vivant)",
         "world bosses or meta-events (expansion and Living World content)", "Recollection of the Bearkin's Adversaries"),
        ("memory_of_the_bearkins_hunts", "vaincre 250 ennemis à la lance sur les cartes de Janthir Wilds",
         "defeat 250 enemies with spears in Janthir Wilds maps", "Recollection of the Bearkin's Hunts"),
        ("memory_of_the_bearkins_victories", "convergences de Janthir Wilds ou raids (les raids avancent plus vite)",
         "Janthir Wilds Convergences or Raids (raids grant more progress)", "Recollection of the Bearkin's Victories")):
    t = page(cid)
    assert recol in t and "Legendary Spear: Klobjarne Geirr" in t, cid
    pose(cid, [{"type": "achievement",
         "tip": tip(f"Récompense d'un succès de Klobjarne Geirr : {fr}. Réinitialisable en achetant {recol} pour une copie de plus (prix non capturé).",
                    f"Reward of a Klobjarne Geirr achievement: {en}. Resettable by purchasing {recol} for another copy (price not captured).")}],
         f"{cid}.html, Acquisition", best="achievement")

t = page("harpy_feather")
assert "Harpy Feathers (consumable) , a bundle sold by Forager Hitkiti in the Harathi Hinterlands" in t
pose("harpy_feathers", [{"type": "vendor", "npc": "Forager Hitkiti", "map": "Harathi Hinterlands",
     "tip": tip("Paquet vendu par Forager Hitkiti (Hinterlands harathis), utilisé dans Nevermore IV. Prix non capturé (la page lue est la désambiguïsation).",
                "Bundle sold by Forager Hitkiti (Harathi Hinterlands), used in Nevermore IV. Price not captured (the page read is the disambiguation).")}],
     "harpy_feather.html (desambiguisation)", best="vendor")

t = page("relic")
assert "Core relics are available through crafting and the trading post" in t
pose("relic", [{"type": "craft",
     "tip": tip("N'importe quelle relique. Reliques de base : artisanat (recettes chez les maîtres armuriers, travailleurs du cuir et tailleurs) ou comptoir ; reliques d'extension : collections, fractales, missions d'attaque, pistes, succès, histoire.",
                "Any relic. Core relics: crafting (recipes from Master Armorsmiths, Leatherworkers and Tailors) or the trading post; expansion relics: collections, fractals, strikes, reward tracks, achievements, story.")}],
     "relic.html, Acquisition", best="craft")

t = page("symbol_ingredient")
assert "This disambiguation page" in t and not C["symbol_ingredient"].get("qty")
pose("symbol_ingredient", [{"type": "acquire",
     "tip": tip("Page de désambiguïsation, aucun objet : désigne l'un des trois symboles. Plus aucun consommateur (v441).",
                "Disambiguation page, no item: stands for any of the three symbols. No consumer left (v441).")}],
     "symbol_ingredient.html")

assert not [c for c, v in C.items() if any(isinstance(s, dict) and s.get("type") == "unknown" for s in v.get("sources") or [])]
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("sources inconnues : 16 typees, 3 aretes (or, karma, champignons)")
