#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Coffre du Sorcier : voie alternative posee sur Obsidian Shard et Vision Crystal (04/11).

Usage : python3 scripts_tracker/integration/gw2_coffre_sorcier_v1.py SRC DST

Tri page par page des 18 captures ou le cout vendeur est enveloppe de
<span class="inline-icon"> (point du plan). Aucune ne demande d'elargir le
parseur vendeur :
- infusions d'agonie +3/+5/+7/+9 : la voie vendeur (4 de l'infusion
  inferieure) est deja posee ; les lignes inline-icon cumulent les paliers
  (16 x +1 + 4 x +3) ou proposent l'echange inverse (+8 contre +9, +10 contre
  +11) : les lire fausserait les quantites ;
- Provisioner Token : catalogue de ce qu'on achete AVEC le jeton (section
  « Sold by » de ses vendeurs), pas son prix ;
- Conflux, Transcendence : echange du legendaire « Slumbering » chez Hobbs,
  sans composant au tracker ;
- Box o' Fun : Gem Store, raccourci jamais compte ;
- Emblem of the Avenger / Conqueror : echanges croises entre emblemes,
  voies concurrentes de l'acquisition deja posee ;
- Fractalline Spark : echange d'une Wizard's Infinite Mist Omnipotion
  (limite 1 par compte), alternative a la recette posee ;
- Lamplighter's Badge : 1 Gift of <carte> chez les vendeurs de carte, voie
  deja citee dans ses sources.

Les 4 autres sont des achats au Coffre du Sorcier contre Astral Acclaim, en
quantite plafonnee par saison. Mystic Clover et Mystic Coin les portent deja
en source ; Obsidian Shard et Vision Crystal non. On les ajoute en source
alternative, sans `best` ni cout compte : une voie plafonnee par saison n'est
pas la voie par defaut (regle du 09/10 : a cout egal, l'absence de timegate).
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
J = "2026-11-04"
C = d["craft_components"]
AJOUTS = {
    "obsidian_shard": (30, 20),
    "vision_crystal": (150, 4),
}
for cid, (prix, plafond) in AJOUTS.items():
    srcs = C[cid]["sources"]
    assert not any(s.get("npc") == "Coffre du Sorcier" for s in srcs), cid
    srcs.append({
        "type": "vendor", "npc": "Coffre du Sorcier",
        "tip": {"fr": f"{prix} Astral Acclaim pièce, plafond {plafond} par saison. Voie alternative, non comptée.",
                "en": f"{prix} Astral Acclaim each, capped {plafond} per season. Alternative route, not counted."},
        "verified": True, "checked": J,
        "ref": f"ressources/wiki/{cid}.html, Acquisition (Wizard's Vault)",
    })
    # plafond structure, meme forme que mystic_coin.cadence (regle d'audit :
    # un plafond chiffre en prose doit exister en cadence structuree)
    cad = C[cid].setdefault("cadence", {"sources": []})
    cad["sources"].append({
        "label": {"fr": "Coffre du Sorcier", "en": "Wizard's Vault"},
        "period": "season", "cap": plafond,
        "cost": {"fr": f"{prix} AA", "en": f"{prix} AA"},
        "verified": True, "checked": J, "ref": f"ressources/wiki/{cid}.html",
    })
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(len(AJOUTS), "sources Coffre du Sorcier ajoutees ; ecrit", DST)
