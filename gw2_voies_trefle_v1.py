#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Le trefle mystique n'a pas un cout : il a des VOIES, et le choix appartient au joueur.

Le depliage avait pose « 1 piece mystique par trefle », lu dans la boite Recipe
de la page. C'est faux de deux facons, et Antoine l'a corrige :

1. LA FORGE N'EST QU'UNE VOIE PARMI HUIT. La page l'ecrit noir sur blanc dans
   son resume d'acquisition : pistes de recompenses PvP, WvW et d'escarmouche
   (gratuites), Forge mystique, six vendeurs, coffre du Magicien, succes. Le
   chemin de farm principal, celui qui ne coute rien, ce sont les pistes PvP.
   Poser la recette en arete, c'etait declarer obligatoire un achat facultatif.

2. LA RECETTE NE REND PAS UN TREFLE. Le wiki publie sa propre recette
   « Mystic Clover Average », de sortie 0,31 : la Forge echoue deux fois sur
   trois. Un cout unitaire lu sur la recette brute est donc sous-estime d'un
   facteur trois, et c'est la reserve que j'avais nommee sans la corriger.

STRUCTURE : AUCUN CHAMP NOUVEAU. Le choix se dit avec ce qui existe deja.
`alt_groups` designe un-parmi-N composants pour une cible, et sait cibler un
composant aussi bien qu'un legendaire. Chaque voie devient donc un composant a
part entiere, portant ses propres couts comme n'importe quel intermediaire, et
le groupe choisit lequel compte. Le JSX rend le selecteur sans une ligne de
plus : il affiche tout groupe dont une cible est cochee ou chiffree.

DEFAUT : la piste de recompenses, qui ne coute rien. Les totaux affiches ne
bougent donc pas d'un point tant qu'Antoine ne choisit pas autre chose — et
s'il choisit le vendeur des fractales, les 150 reliques par trefle remontent
d'elles-memes dans l'arbre.

CE QUE JE N'INVENTE PAS. Les vendeurs Miyani et Lyhr sont cites par la page
avec quatre icones que la capture ne nomme pas (« 3 + 5 + 3 + 3 ») : la voie
existe, son cout n'est pas lisible, je ne la pose pas. La pierre philosophale
et l'ecu astral n'existent pas encore en base : la premiere est creee sans cout
— elle s'achete en eclats d'esprit, la page ne dit pas a quel taux — la seconde
aussi, le coffre du Magicien n'ayant pas de monnaie modelisee.
"""
import collections
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
VER = f"v{int(SRC.stem.split('_v')[-1]) + 1}"
DST = HERE / f"gw2_sources_{VER}.json"

d = json.load(open(SRC, encoding="utf-8"), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]
groupes = d.setdefault("alt_groups", collections.OrderedDict())

# --- 1. retirer l'arete fausse -----------------------------------------------
# Le depliage avait ramene chaque cle a plat au reliquat sur la foi de cette
# arete : 250 pieces sur une gen1 valaient 77 par les trefles plus 173 ecrits.
# L'arete tombe, le reliquat n'a plus lieu d'etre — chaque cle reprend le cout
# entier. On le calcule en rendant a chaque legendaire son nombre de trefles,
# puis on VERIFIE contre l'etat d'avant le depliage, lu dans git.
import subprocess

ARMOR = {"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"}
SUF = (("", 1), ("__per_piece", 6), ("__onetime", 1), ("__per_unit", 1),
       ("__full_set", 1))


def total_de(cid_vise, leg):
    t, exp = {}, {}
    for cid, c in cc.items():
        q = c.get("qty") or {}
        for suf, mm in SUF:
            mult = mm if (suf not in ("__per_piece", "__full_set") or leg in ARMOR) else 0
            v = q.get(leg + suf)
            if isinstance(v, (int, float)) and mult:
                t[cid] = t.get(cid, 0) + v * mult
    for g in groupes.values():
        if leg in (g.get("targets") or []):
            t[g["default"]] = t.get(g["default"], 0) + g["qty"]
    for _ in range(12):
        add = {}
        for cid, c in cc.items():
            for k, v in (c.get("qty") or {}).items():
                if isinstance(v, (int, float)) and k in cc and t.get(k, 0) > 0:
                    add[cid] = add.get(cid, 0) + v * t[k]
        for g in groupes.values():
            n = sum(t.get(x, 0) for x in (g.get("targets") or []) if x in cc)
            if n:
                add[g["default"]] = add.get(g["default"], 0) + g["qty"] * n
        bouge = False
        for cid, v in add.items():
            if exp.get(cid, 0) != v:
                t[cid] = t.get(cid, 0) - exp.get(cid, 0) + v
                exp[cid] = v
                bouge = True
        if not bouge:
            break
    return t.get(cid_vise, 0)


qmc = cc["mystic_coin"].setdefault("qty", {})
if "mystic_clover" in qmc:
    cibles = sorted({k.split("__")[0] for c in cc.values() for k in (c.get("qty") or {})
                     if k.split("__")[0] not in cc})
    trefles = {leg: total_de("mystic_clover", leg) for leg in cibles}
    retire = qmc.pop("mystic_clover")
    cc["mystic_coin"]["needed_for"] = [x for x in (cc["mystic_coin"].get("needed_for") or [])
                                       if x != "mystic_clover"]
    rendus = 0
    for leg, n in trefles.items():
        if n and isinstance(qmc.get(leg), int):
            qmc[leg] += int(n)
            rendus += 1
    cc["mystic_coin"]["qty_overlap_verified"] = [
        x for x in (cc["mystic_coin"].get("qty_overlap_verified") or [])
        if not trefles.get(x)]
    if not cc["mystic_coin"]["qty_overlap_verified"]:
        cc["mystic_coin"].pop("qty_overlap_verified", None)
    # Verification : l'etat rendu doit etre exactement celui d'avant le depliage.
    ref = json.loads(subprocess.run(
        ["git", "show", "dd88808^:gw2_sources_v241.json"], cwd=HERE,
        capture_output=True, text=True, check=True).stdout)
    avant = ref["craft_components"]["mystic_coin"]["qty"]
    ecarts = {k: (avant.get(k), qmc.get(k)) for k in set(avant) | set(qmc)
              if avant.get(k) != qmc.get(k)}
    assert not ecarts, f"restitution fausse : {ecarts}"
    print(f"arete retiree : mystic_coin <- mystic_clover ({retire}) ; "
          f"{rendus} cles rendues a leur cout entier, identiques a l'avant-depliage")

# --- 2. composants manquants, sans cout invente ------------------------------
NEUFS = {
    "philosophers_stone": ("Philosopher's Stone",
                           "Achetee en eclats d'esprit chez Miyani et les preposes a la "
                           "Forge. Le taux d'echange n'est pas lisible sur la capture.",
                           "Bought with Spirit Shards from Miyani and Mystic Forge "
                           "Attendants. The exchange rate is not readable on the capture."),
    "astral_acclaim": ("Astral Acclaim",
                       "Monnaie du coffre du Magicien, gagnee par les objectifs "
                       "hebdomadaires et saisonniers.",
                       "Wizard's Vault currency, earned from weekly and seasonal "
                       "objectives."),
}
for cid, (nom, fr, en) in NEUFS.items():
    if cid in cc:
        continue
    cc[cid] = collections.OrderedDict([
        ("name", nom), ("kind", "currency"), ("needed_for", []), ("qty", {}),
        ("sources", [{"type": "vendor", "tip": {"fr": fr, "en": en}}]),
        ("ref", "wiki Mystic Clover — section Acquisition"),
        ("checked", "2026-09-08"),
        ("verified", "cite par la page, cout non chiffre"),
    ])
    print(f"composant cree sans cout : {cid}")

# --- 3. les voies, une par composant -----------------------------------------
# Cout commun a tous les vendeurs, ecrit par la page : 2 pieces mystiques,
# 2 ectoplasmes et 2 eclats d'esprit par trefle, plus une monnaie propre.
VENDEUR = {"mystic_coin": 2, "glob_of_ectoplasm": 2, "spirit_shard": 2}
# La recette « Average » du wiki : sortie 0,31 pour 1 obsidienne, 1 piece,
# 1 ectoplasme et 6 pierres philosophales. Par trefle : 1 / 0,31 = 3,23.
FORGE = {"mystic_coin": 3.23, "glob_of_ectoplasm": 3.23, "obsidian_shard": 3.23,
         "philosophers_stone": 19.35}

# Un plafond chiffre doit exister en cadence structuree, pas seulement en prose :
# l'audit l'exige, et il a raison — une cadence en prose est invisible du calcul
# de delai, qui est la raison d'etre de ce tracker.
CADENCE = {
    "clover_forge": None,
    "clover_vendor_fractal": ("week", 10, "BUY-4373, Fractales des Brumes",
                              "BUY-4373, Fractals of the Mists"),
    "clover_vendor_raid": ("week", 15, "Manfred Njallson, raids",
                           "Manfred Njallson, raids"),
    "clover_vendor_pvp": ("week", 5,
                          "Vendeur de ligue PvP — plafond partage avec l'emblème de "
                          "victoire en tournoi",
                          "PvP League Vendor — cap shared with the Emblem of "
                          "Tournament Victory option"),
    "clover_vendor_wvw": ("week", 5, "Dugan, McM", "Dugan, WvW"),
    "clover_wizards_vault": ("season", 20, "Coffre du Magicien",
                             "Wizard's Vault"),
    "clover_lunar": ("week", 1, "Récompenses du Nouvel An lunaire",
                     "New Year Rewards"),
}

VOIES = [
    ("clover_reward_track", "Mystic Clover — piste de récompenses", {},
     {"fr": "Gratuit. Pistes PvP, WvW et d'escarmouche (Mist-Warped Bundle). "
            "Voie principale : du temps, pas de matériaux.",
      "en": "Free. PvP, WvW and Skirmish reward tracks (Mist-Warped Bundle). "
            "Main route: time, not materials."}),
    ("clover_forge", "Mystic Clover — Forge mystique", FORGE,
     {"fr": "Coût moyen : la Forge ne rend un trèfle que 31 % du temps, donc "
            "3,23 tentatives par trèfle. Chiffres de la recette « Average » du wiki.",
      "en": "Average cost: the Forge yields a clover only 31% of the time, so "
            "3.23 attempts per clover. Figures from the wiki's \"Average\" recipe."}),
    ("clover_vendor_fractal", "Mystic Clover — vendeur Fractales",
     dict(VENDEUR, fractal_relic=150),
     {"fr": "BUY-4373, plafond 10 par semaine.", "en": "BUY-4373, limit 10 per week."}),
    ("clover_vendor_raid", "Mystic Clover — vendeur Raids",
     dict(VENDEUR, magnetite_shard=30),
     {"fr": "Manfred Njallson, plafond 15 par semaine.",
      "en": "Manfred Njallson, limit 15 per week."}),
    ("clover_vendor_pvp", "Mystic Clover — vendeur PvP",
     dict(VENDEUR, pvp_league_ticket=5),
     {"fr": "Vendeur de ligue, plafond 5 par semaine (partagé avec l'emblème de "
            "victoire en tournoi).",
      "en": "League Vendor, limit 5 per week (shared with the Emblem of Tournament "
            "Victory option)."}),
    ("clover_vendor_wvw", "Mystic Clover — vendeur McM",
     {"mystic_coin": 2, "glob_of_ectoplasm": 2, "badge_of_honor": 10,
      "skirmish_claim_ticket": 20},
     {"fr": "Dugan, plafond 5 par semaine. Seule voie de vendeur qui ne demande "
            "pas d'éclat d'esprit.",
      "en": "Dugan, limit 5 per week. The only vendor route that needs no Spirit Shard."}),
    ("clover_wizards_vault", "Mystic Clover — coffre du Magicien",
     {"astral_acclaim": 60},
     {"fr": "60 écus astraux, plafond 20 par saison.",
      "en": "60 Astral Acclaim, limit 20 per season."}),
    ("clover_lunar", "Mystic Clover — Nouvel An lunaire",
     {"exotic_essence_of_luck": 10},
     {"fr": "10 essences de chance exotiques, plafond 1 par semaine. Ne demande "
            "rien d'autre.",
      "en": "10 Exotic Essences of Luck, limit 1 per week. Requires nothing else."}),
]

for cid, nom, couts, tip in VOIES:
    if cid in cc:
        continue
    cc[cid] = collections.OrderedDict([
        ("name", nom),
        ("kind", "acquisition"),
        ("needed_for", ["mystic_clover"]),
        ("qty", {}),
        ("sources", [{"type": "choice", "tip": tip}]),
        ("ref", "wiki Mystic Clover — section Acquisition, resume des voies"),
        ("checked", "2026-09-08"),
        ("verified", "voie citee par la page ; cout ecrit par la page"),
    ])
    cad = CADENCE.get(cid)
    if cad:
        per, cap, lfr, len_ = cad
        cc[cid]["cadence"] = {"sources": [{
            "label": {"fr": lfr, "en": len_},
            "period": per, "cap": cap,
            "cost": {"fr": tip["fr"], "en": tip["en"]},
            "verified": True, "checked": "2026-09-08",
            "ref": "wiki:Mystic_Clover — section Acquisition",
        }]}
    for enfant, q in couts.items():
        assert enfant in cc, f"composant absent : {enfant}"
        cc[enfant].setdefault("qty", {})[cid] = q
        nf = cc[enfant].get("needed_for")
        if isinstance(nf, list):
            cc[enfant]["needed_for"] = sorted(set(nf) | {cid})
    print(f"voie posee : {cid} ({len(couts)} couts)")

groupes["acquisition_trefle"] = collections.OrderedDict([
    ("qty", 1),
    ("options", [v[0] for v in VOIES]),
    ("default", "clover_reward_track"),
    ("targets", ["mystic_clover"]),
    ("label", {"fr": "Trèfles mystiques — comment tu les obtiens",
               "en": "Mystic Clovers — how you get them"}),
    ("note", {
        "fr": "Le trèfle n'a pas un coût, il a des voies. Par défaut les pistes de "
              "récompenses, qui ne coûtent aucun matériau : les totaux ci-dessous "
              "n'en portent donc rien. Choisis une autre voie et son prix remonte "
              "dans l'arbre. Miyani et Lyhr en vendent aussi, à un prix que la "
              "capture ne permet pas de lire.",
        "en": "A clover has no cost, it has routes. Reward tracks by default, which "
              "cost no materials, so the totals below carry none. Pick another route "
              "and its price flows back up the tree. Miyani and Lyhr sell them too, "
              "at a price the capture does not let us read."}),
    ("ref", "wiki Mystic Clover — section Acquisition"),
])
print("alt_group pose : acquisition_trefle, defaut clover_reward_track")

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{DST.name} ecrit")
