#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vendeurs de coeur LW3, et conseils des metas remis d'accord avec leurs champs.

Antoine, 03/10/2026 : les vendeurs de coeur vendent des ballots de la ressource
de la carte, a condition d'avoir fini le coeur, et c'est par PERSONNAGE —
« ca m'a ete tres utile pour la kralkatite ». Le wiki donne les nombres, et ils
contredisent le « 5/jour/perso » des conseils : ce 5 etait le nombre de
VENDEURS d'Ember Bay, lu comme un plafond.

  Ember Bay     5 coeurs x Bundle of Petrified Wood (3)        = 15 / perso / jour
                wiki:Ember_Bay, section Map resources
  Draconis Mons 4 coeurs x Bundle of Fire Orchid Blossoms (3)  = 12 / perso / jour
                wiki:Draconis_Mons, section Map resources ; wiki:Tactician_Tunelle
                (1 par jour, 1 par personnage, 2 688 karma)
  Lake Doric    6 coeurs x Bundle of Jade Shards (3)           = 18 / perso / jour
                wiki:Bundle_of_Jade_Shards (six vendeurs nommes, 2 688 karma)

Ces sources rejoignent la cadence des COMPOSANTS, au format de la kralkatite
(`per_character: true`) : c'est la que la projection de delai les lit. La
cadence provisoire posee le 03/10 sur les fermes (`eb`, `dm`, `ld`) disparait,
remplacee par un `cadence_ref`.

Le wiki corrige aussi les conseils : « Seimur Oxbone » est le sous-chef de la
collection Grawnk Munch, pas un vendeur d'Ember Bay, et Ember Bay ne vend pas
de Fire Orchid. « Savage Rise » est une zone de Draconis Mons.

Coherence conseils / champs (gw2_coherence_conseils_metas_v1) :
- les fermes nomment leur ressource sans la declarer dans `rewards` : la puce
  de priorite ne pouvait pas la voir. Ajoutee quand une source la tient ;
- `co` : « priorite absolue » en dur, alors que la priorite affichee se calcule
  sur ce qu'il reste a farmer. Retire ; l'efficience S dit deja la meme chose ;
- `nk -> ew` : restitue (v2 : sans `nextDelayMin`, retire du catalogue le 03/10) (Antoine, 03/10 : « oui pourquoi pas »).
"""
import argparse, json
from collections import OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
CHECKED = "2026-10-03"

VENDEURS = {
    # ferme: (composant, nb coeurs, par ballot, ref, nom de la ressource fr/en)
    "eb": ("petrified_wood_lw3", 5, 3, "wiki:Ember_Bay — Map resources",
           ("Petrified Wood", "Petrified Wood"), "Ember Bay"),
    "dm": ("fire_orchid_blossom", 4, 3, "wiki:Draconis_Mons — Map resources ; wiki:Tactician_Tunelle",
           ("Fire Orchid Blossom", "Fire Orchid Blossom"), "Draconis Mons"),
    "ld": ("jade_shard_lw3", 6, 3, "wiki:Bundle_of_Jade_Shards",
           ("Jade Shard", "Jade Shard"), "Lake Doric"),
}
# Ressource de la ferme, et d'ou on la tient.
REWARDS = {
    "eb": ("petrified_wood_lw3", "wiki:Ember_Bay — Map resources"),
    "dm": ("fire_orchid_blossom", "wiki:Draconis_Mons — Map resources"),
    "ld": ("jade_shard_lw3", "wiki:Lake_Doric — Map resources"),
    "lw4_istan": ("volatile_magic", "cadence de volatile_magic (noeuds LW4, 50/compte/jour), deja verifiee"),
    # Les trois coeurs du Domaine d'Istan vendent la kralkatite par personnage :
    # la source est deja dans la cadence du composant (wiki:Bundle_of_Kralkatite).
    "lw4_istan#2": ("kralkatite_ore", "wiki:Bundle_of_Kralkatite — 3 vendeurs de coeur du Domaine d'Istan"),
    # Monnaies de carte de Castora : la capture dit qu'elles s'obtiennent par
    # les evenements de la carte, dont la meta fait partie.
    "hammerhart": ("aether_rich_sap", "ressources/wiki/aether_rich_sap.html — obtenue en completant les evenements de Shipwreck Strand"),
    "weald": ("antiquated_ducat", "ressources/wiki/antiquated_ducat.html — obtenue en completant les evenements de Starlit Weald"),
    "lw4_dragonfall": ("mistborn_mote", "cadence de mistborn_mote (noeuds de Dragonfall), deja verifiee"),
}
TIPS = {
    "eb": ({"fr": "~40 Petrified Wood/compte/jour via nodes. Soft-reset à 01h. Les 5 vendeurs de cœur vendent chacun un ballot de 3 Petrified Wood contre karma, une fois par jour et par personnage une fois le cœur fait : 15/perso/jour, à démultiplier avec les alts.",
            "en": "~40 Petrified Wood/account/day via nodes. Soft reset at 01h. The 5 renown heart vendors each sell a bundle of 3 Petrified Wood for karma, once per day per character once the heart is done: 15/character/day, multiplied by alts."},
           {"fr": "5 vendeurs de cœur — ballot de 3 Petrified Wood contre karma, 1/jour/perso",
            "en": "5 renown heart vendors — bundle of 3 Petrified Wood for karma, 1/day/character"}),
    "dm": ({"fr": "~40 Fire Orchid + Petrified Wood/compte/jour via nodes. Soft-reset à 01h. Springer requis pour certains nodes. Les 4 vendeurs de cœur vendent chacun un ballot de 3 Fire Orchid Blossom contre karma, une fois par jour et par personnage une fois le cœur fait : 12/perso/jour, à démultiplier avec les alts.",
            "en": "~40 Fire Orchid + Petrified Wood/account/day via nodes. Soft reset at 01h. Springer required for some nodes. The 4 renown heart vendors each sell a bundle of 3 Fire Orchid Blossom for karma, once per day per character once the heart is done: 12/character/day, multiplied by alts."},
           {"fr": "4 vendeurs de cœur (dont Tactician Tunelle) — ballot de 3 Fire Orchid Blossom contre karma, 1/jour/perso",
            "en": "4 renown heart vendors (incl. Tactician Tunelle) — bundle of 3 Fire Orchid Blossom for karma, 1/day/character"}),
    "ld": ({"fr": "~40 Jade Shards/compte/jour via nodes. Soft-reset à 01h. Les 6 vendeurs de cœur vendent chacun un ballot de 3 Jade Shard contre karma, une fois par jour et par personnage une fois le cœur fait : 18/perso/jour, à démultiplier avec les alts.",
            "en": "~40 Jade Shards/account/day via nodes. Soft reset at 01h. The 6 renown heart vendors each sell a bundle of 3 Jade Shard for karma, once per day per character once the heart is done: 18/character/day, multiplied by alts."},
           {"fr": "6 vendeurs de cœur (dont Noran) — ballot de 3 Jade Shard contre karma, 1/jour/perso",
            "en": "6 renown heart vendors (incl. Noran) — bundle of 3 Jade Shard for karma, 1/day/character"}),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out")
    a = ap.parse_args()
    d = json.loads((RACINE / a.src).read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    me, cc = d["meta_events"], d["craft_components"]

    for ferme, (cid, n, q, ref, (fr, en), carte) in VENDEURS.items():
        srcs = cc[cid].setdefault("cadence", {}).setdefault("sources", [])
        if not any("coeur" in json.dumps(s.get("label"), ensure_ascii=False).lower()
                   or "cœur" in json.dumps(s.get("label"), ensure_ascii=False).lower() for s in srcs):
            srcs.append(OrderedDict([
                ("label", {"fr": f"Ballots — {n} vendeurs de cœur, {carte}",
                           "en": f"Bundles — {n} renown heart vendors, {carte}"}),
                ("period", "day"), ("cap", n * q), ("per_character", True),
                ("cost", {"fr": f"{q} {fr} par ballot, 1 ballot par vendeur, par personnage et par jour, une fois le cœur fait. {n} cœurs, donc {n * q} par personnage et par jour. Se démultiplie avec les alts.",
                          "en": f"{q} {en} per bundle, 1 bundle per vendor per character per day, once the heart is done. {n} hearts, so {n * q} per character per day. Scales with alts."}),
                ("verified", True), ("checked", CHECKED),
                ("ref", f"{ref} ; mecanisme confirme par Antoine le 03/10/2026")]))
        m = me[ferme]
        m.pop("cadence", None)
        m["cadence_ref"] = cid
        m["tip"], m["vendor"] = TIPS[ferme]
        # Les noeuds restent par compte, mais ce qui se demultiplie, ce sont
        # les ballots : c'est l'etiquette qui guide le joueur vers ses alts.
        m["farmType"] = "per_char_hearts"
    # « Savage Rise » est une zone de Draconis Mons, pas d'Ember Bay.
    if "Savage Rise" in str(me["eb"].get("vendorWp")):
        me["eb"].pop("vendorWp", None)

    for ferme, (cid, ref) in REWARDS.items():
        m = me[ferme.split("#")[0]]
        rw = m.get("rewards") or []
        if cid not in rw:
            m["rewards"] = rw + [cid]
        m.setdefault("rewards_refs", {})  # seule table de provenance (v2)
        if not isinstance(m["rewards_refs"], dict):
            m["rewards_refs"] = {}
        m["rewards_refs"].setdefault(cid, ref)

    co = me["co"]
    for lg in ("fr", "en"):
        t = co["tip"][lg]
        co["tip"][lg] = t.replace(" — priorité absolue.", ".").replace(" - absolute priority.", ".")

    me["nk"]["next"] = ["ew"]

    for k, m in me.items():
        for f in ("cadence",):
            if f in m and k in VENDEURS:
                raise SystemExit(f"{k} porte encore une cadence")
    if a.out:
        (RACINE / a.out).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("ecrit", a.out)
    for k in list(VENDEURS) + ["co", "nk"]:
        print(k, json.dumps({f: me[k].get(f) for f in ("rewards", "cadence_ref", "next")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
