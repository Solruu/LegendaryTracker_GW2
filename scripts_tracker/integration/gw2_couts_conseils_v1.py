#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Etapes dont le conseil chiffre une consommation que le total ignorait (04/11).

Usage : python3 scripts_tracker/integration/gw2_couts_conseils_v1.py SRC DST

Tri des 99 etapes sans `cost` dont le texte (`how` du tableau du wiki, ou
`how_jsx`) cite « <nombre> <ressource de l'arbre> » (detecteur de
gw2_couts_etapes_v1, filtre sur `cost`). Ecartees : les 46 etapes gen1
« Legendary Weapon : X » (forge finale et Gift of <donjon>, couvertes par
l'arbre), les 23 de Stella Radians (voie butin, 04/11), les 12 Obsidian
(Purified Rift Essence deja dans obsidian__onetime), les 16 Dragonsblood
(3 000 Volatile Magic deja dans vision__onetime, « environ 60 » non source),
et Druid Runestone (henge_3402 b1 : la pierre est comptee a l'etape suivante,
The Druid's Story). Retenues, chacune sourcee :

- Incinerator I b0 Pile of Beryl Dust : 5 Beryl Orb (tableau de la collection) ;
- Rodgort III b23 Cleansing Fire : 10 Elder Wood Log (tableau de la collection) ;
- Envoy Armor I b3 Spirit Weave : 5 Spirit Thread (tableau ; `spirit_thread`
  n'avait aucun consommateur) ;
- Envoy Armor I b7 Mushroom Medley : 1 Orrian Truffle + 1 Sawgill Mushroom
  (tableau ; Sawgill Mushroom cree, feuille recoltee, sawgill_mushroom.html) ;
- Envoy Armor II b0 Crystalline Heart : 100 Crystalline Ingot
  (crystalline_heart.html : « Bring 100 Crystalline Ingots ») ;
- Coalescence II b0 Alembic Apparatus : 100 Magnetite Shard + 10 or chez Scholar
  Glenna ou les Magnetite Shard Exchange (alembic_apparatus.html). Corollaire,
  meme regle que Gift of the Hylek / Gift of Patience le 03/11 : le Gift of
  Complex Emotions est la RECOMPENSE de Coalescence II ; son vendeur (100
  magnetite + 1 or, « Requires the achievement Coalescence II ») ne sert qu'aux
  copies suivantes et sort du total ;
- Visions of Jahai b0 Updated Record of Joko's Deeds : 50 Volatile Magic chez
  Trader Hyacinth (updated_record_of_jokos_deeds.html) ; les 8 cuivres ne sont
  pas comptes (or entier), et le recyclage rend 50 Volatile Magic — signale,
  le cout reste compte (regle du 20/10 sur les couts compenses).

Au passage : les sources de Certificate of Heroics et Essence of Animosity
disaient « Testimony of Heroics » ; la monnaie en vente est Testimony of
Castoran Heroics (captures du 03/11), seule a etre comptee.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
J = "2026-11-04"
C = d["craft_components"]
W = "ressources/wiki/"


def etape(leg, col, bit):
    its = [it for it in d["legendaries"][leg]["collections"][col]["items"] if it["bit"] == bit]
    assert len(its) == 1, (leg, col, bit)
    return its[0]


def lie(enfant, parent, q):
    m = C[enfant]
    assert parent not in m.setdefault("qty", {}), (enfant, parent)
    m["qty"][parent] = q
    nf = m.setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)


def delie(enfant, parent):
    m = C[enfant]
    del m["qty"][parent]
    if parent in m.get("needed_for", []):
        m["needed_for"].remove(parent)


def pose(leg, col, bit, cout, ref):
    st = etape(leg, col, bit)
    assert "cost" not in st, (leg, col, bit, st.get("cost"))
    for k in cout:
        assert k in C, k
    st["cost"] = cout
    st["cost_ref"] = f"{ref} ; compte le {J}"


def nouveau(cid, **kw):
    assert cid not in C, cid
    C[cid] = dict(kw, verified=True, checked=J)


# --- composants nouveaux ------------------------------------------------------
nouveau("sawgill_mushroom", name="Sawgill Mushroom", apiId=73504, kind="acquire", farmable=True,
        qty={}, needed_for=[], best="gathering", ref=W + "sawgill_mushroom.html",
        sources=[{"type": "gathering", "verified": True, "checked": J, "ref": W + "sawgill_mushroom.html, Gathered from",
                  "tip": {"fr": "Récolte (Sawgill Mushrooms, Homegrown Sawgill Mushrooms) ; tombe aussi sur les champignons de Maguuma.",
                          "en": "Gathered (Sawgill Mushrooms, Homegrown Sawgill Mushrooms); also dropped by Maguuma mushrooms."}}])
nouveau("alembic_apparatus", name="Alembic Apparatus", apiId=88975, kind="acquire", farmable=True,
        qty={}, needed_for=[], best="vendor", ref=W + "alembic_apparatus.html",
        sources=[{"type": "vendor", "npc": "Scholar Glenna / Magnetite Shard Exchange", "verified": True, "checked": J,
                  "ref": W + "alembic_apparatus.html, Acquisition",
                  "cost": {"fr": "100 Magnetite Shard + 10 or", "en": "100 Magnetite Shard + 10 gold"},
                  "tip": {"fr": "Scholar Glenna (Mythwright Gambit) ou un Magnetite Shard Exchange portable : 100 Magnetite Shard + 10 or. Requis avant de ramasser la moindre bouteille vide.",
                          "en": "Scholar Glenna (Mythwright Gambit) or a portable Magnetite Shard Exchange: 100 Magnetite Shard + 10 gold. Required before picking up any empty bottle."}}])
lie("magnetite_shard", "alembic_apparatus", 100)
lie("gold_coin", "alembic_apparatus", 10)
nouveau("updated_record_of_jokos_deeds", name="Updated Record of Joko's Deeds", apiId=91013, kind="acquire", farmable=True,
        qty={}, needed_for=[], best="vendor", ref=W + "updated_record_of_jokos_deeds.html",
        sources=[{"type": "vendor", "npc": "Trader Hyacinth (Yatendi Village)", "verified": True, "checked": J,
                  "ref": W + "updated_record_of_jokos_deeds.html, Acquisition",
                  "cost": {"fr": "50 Volatile Magic + 8 cuivres", "en": "50 Volatile Magic + 8 copper"},
                  "tip": {"fr": "Trader Hyacinth, après la maîtrise « A Star to Guide Us », collection Visions of Jahai active, 1 par compte. Le recyclage rend 50 Volatile Magic.",
                          "en": "Trader Hyacinth, after the 'A Star to Guide Us' Mastery, Visions of Jahai collection active, 1 per account. Salvaging returns 50 Volatile Magic."}}])
lie("volatile_magic", "updated_record_of_jokos_deeds", 50)

# --- couts d'etape --------------------------------------------------------------
TAB = "tableau « Collection items » (how)"
pose("gen1_incinerator", "incinerator_i_the_experimental_dagger", 0, {"beryl_orb": 5}, TAB)
pose("gen1_rodgort", "rodgort_iii_rodgort_s_flame", 23, {"elder_wood_log": 10}, TAB)
pose("perfected_envoy", "envoy_1", 3, {"spirit_thread": 5}, W + "envoy_armor_i_experimental_armor.html, " + TAB)
pose("perfected_envoy", "envoy_1", 7, {"orrian_truffle": 1, "sawgill_mushroom": 1},
     W + "envoy_armor_i_experimental_armor.html, " + TAB)
pose("perfected_envoy", "envoy_2", 0, {"crystalline_ingot": 100}, W + "crystalline_heart.html, Acquisition")
pose("coalescence", "coalescence_2", 0, {"alembic_apparatus": 1}, W + "alembic_apparatus.html, Acquisition")
pose("vision", "vis_jahai", 0, {"updated_record_of_jokos_deeds": 1}, W + "updated_record_of_jokos_deeds.html, Acquisition")

# --- Gift of Complex Emotions : recompense de Coalescence II ------------------------
g = C["gift_of_complex_emotions"]
delie("magnetite_shard", "gift_of_complex_emotions")
g["sources"] = [
    {"type": "achievement_collection", "collection": "coalescence_2", "verified": True, "checked": J,
     "ref": W + "gift_of_complex_emotions.html, Achievement (« Reward: »)",
     "tip": {"fr": "Récompense de la collection « Coalescence II: The Gift » (onglet Collections) : le premier exemplaire ne coûte que la collection.",
             "en": "Reward of the \"Coalescence II: The Gift\" collection (Collections tab): the first copy costs only the collection."}},
    {"type": "vendor", "npc": "Scholar Glenna / Magnetite Shard Exchange / Wizard's Gobbler", "paid_repeatable": True,
     "verified": True, "checked": J,
     "ref": W + "gift_of_complex_emotions.html, Sold by (« Requires the achievement Coalescence II: The Gift »)",
     "tip": {"fr": "Copies suivantes, une fois la collection faite : 100 Magnetite Shard + 1 or. Alternative, jamais comptée.",
             "en": "Further copies, once the collection is done: 100 Magnetite Shard + 1 gold. Alternative, never counted."}},
]
g["best"] = "achievement_collection"
g["ref"] = W + "gift_of_complex_emotions.html"
g["verified"], g["checked"] = True, J

# --- Envoy : ingredients des dons rattaches au don, plus a la piece -------------------
# RELECTURE_RECETTES les classait « AILLEURS » : rattaches a
# perfected_envoy__per_piece au lieu du don dont la recette les cite (Gift of
# Prowess : 50 Obsidian Shard + 1 Eldritch Scroll ; Gift of Dedication :
# 5 Auric Ingot + 5 Chak Egg + 5 Reclaimed Metal Plate). Chaque don vaut 1 par
# piece : total inchange, mais la cascade passe desormais par le don, ce que
# l'arbitrage exige des que l'obsidienne arrive aussi par le Crystalline Heart.
for enfant, don, q in (("obsidian_shard", "gift_of_prowess", 50), ("eldritch_scroll", "gift_of_prowess", 1),
                       ("auric_ingot", "gift_of_dedication", 5), ("chak_egg", "gift_of_dedication", 5),
                       ("reclaimed_metal_plate", "gift_of_dedication", 5)):
    m = C[enfant]
    assert m["qty"].get("perfected_envoy__per_piece") == q and C[don]["qty"] == {"perfected_envoy__per_piece": 1}, (enfant, don)
    del m["qty"]["perfected_envoy__per_piece"]
    if not any(k.split("__")[0] == "perfected_envoy" for k in m["qty"]) and "perfected_envoy" in m.get("needed_for", []):
        m["needed_for"].remove("perfected_envoy")
    lie(enfant, don, q)

# --- chevauchement declare : obsidienne de Perfected Envoy ------------------------------
# La table « Full material list » de l'armure ecrit 300 Obsidian Shard (Gift of
# Prowess, par piece). Le Crystalline Heart d'Envoy Armor II en ajoute 100 :
# 100 Crystalline Ingot, chacun 1 Fulgurite, chacune 1 Obsidian Shard (recettes
# au depot). Les deux exigences sont reelles ; la table s'arrete a l'armure.
o = C["obsidian_shard"]
ov = o.setdefault("qty_overlap_verified", [])
if "perfected_envoy" not in ov:
    ov.append("perfected_envoy")
o["qty_overlap_note"] = {
    "fr": "Perfected Envoy : 300 par la table de l'armure (Gift of Prowess) et 100 par le Crystalline Heart "
          "d'Envoy Armor II (100 Crystalline Ingot, 1 Fulgurite chacun, 1 obsidienne chacune) — deux exigences réelles.",
    "en": "Perfected Envoy: 300 from the armor table (Gift of Prowess) and 100 from Envoy Armor II's Crystalline Heart "
          "(100 Crystalline Ingot, 1 Fulgurite each, 1 shard each) — two real requirements.",
}

# --- libelle de monnaie ---------------------------------------------------------------
for cid in ("certificate_of_heroics", "essence_of_animosity"):
    for s in C[cid]["sources"]:
        for lg, a, b in (("fr", "Testimony of Heroics", "Testimony of Castoran Heroics"),
                         ("en", "Testimony of Heroics", "Testimony of Castoran Heroics")):
            t = (s.get("tip") or {}).get(lg)
            if t and a in t and b not in t:
                s["tip"][lg] = t.replace(a, b)
        s["ref"] = W + f"{cid}.html, Acquisition (vendeurs actuels : Testimony of Castoran Heroics)"
        s["verified"], s["checked"] = True, J

d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("3 composants, 7 couts d'etape, Gift of Complex Emotions en recompense ; ecrit", DST)
