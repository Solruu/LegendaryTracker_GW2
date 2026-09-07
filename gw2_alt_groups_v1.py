#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Introduit `alt_groups` et y fait entrer les dons de maitrise gen2.

POURQUOI UNE STRUCTURE NEUVE. `qty` dit ce qu'il FAUT, et ne sait dire qu'une
chose a la fois : tant d'unites de tel composant pour telle cible. Elle ne sait
pas dire « 250 unites de L'UNE de ces six gemmes ». Faute de pouvoir l'ecrire,
la donnee a pris l'habitude d'ecrire les deux — et de compter les deux.

Le cas le plus net est celui des dons de maitrise. Douze armes gen2 portent a
la fois `gift_of_maguuma_mastery: 1` et `gift_of_desert_mastery: 1`, alors que
la recette de la Forge en demande UN des deux. Le tracker en reclame donc deux.
La donnee le savait deja et le disait en prose, dans `interchangeable_note` :
« Gift of Desert Mastery utilisable a la place pour toutes les armes gen2 SAUF
Astralaria, HOPE, Nevermore et Chuka and Champawat. » Une note que rien ne
calculait.

CE QUE PORTE `alt_groups`, au niveau racine des sources :

    "alt_groups": {
      "<id>": {
        "qty": 1,                      quantite par cible
        "options": [...],              composants interchangeables
        "default": "...",              option retenue tant que rien n'est choisi
        "targets": [...],              legendaires OU composants concernes
        "label": {"fr": ..., "en": ...},
        "ref": "..."                   d'ou vient l'arbitrage
      }
    }

Une seule structure, un seul chemin de calcul : le total ajoute `qty` fois la
presence de la cible a l'option CHOISIE, et a elle seule. Les options ne
gardent aucune cle `qty` pour ces cibles — sinon le compte se ferait deux fois,
ce qu'on cherche precisement a supprimer.

Les cibles peuvent etre des legendaires (presence = coche dans la selection) ou
des composants (presence = total deja calcule), pour que le meme mecanisme
serve aux gemmes du Gift of Infused Gems quand sa page sera capturee.

CE QUI N'ENTRE PAS ENCORE, et pourquoi :

- les six orbes du Gift of Infused Gems : `gift_of_rays` porte aujourd'hui
  250 de QUATRE orbes, ce qui a toutes les allures du meme defaut, mais sa page
  n'est pas au depot. On ne devine pas un cout ;
- Eternity (Sunrise + Twilight ou leurs Memories) et les lodestones (vin
  d'Elone ou agent liant) : deja ecartes a l'extraction, donc sans double
  compte a corriger. Ils entreront ici quand on voudra les AFFICHER comme
  choix, pas pour reparer un chiffre.
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

MAG, DES = "gift_of_maguuma_mastery", "gift_of_desert_mastery"
qm, qd = cc[MAG]["qty"], cc[DES]["qty"]
# Les cibles du groupe sont exactement celles que les DEUX options portent : la
# ou une seule figure, il n'y a pas de choix a offrir.
cibles = sorted(k for k in qm if k in qd)
assert cibles, "aucune cible commune — la donnee a change, verifier avant d'ecrire"
assert all(qm[k] == qd[k] == 1 for k in cibles), "quantites non unitaires, a verifier"

groupes = d.setdefault("alt_groups", collections.OrderedDict())
groupes["gen2_mastery"] = collections.OrderedDict([
    ("qty", 1),
    ("options", [MAG, DES]),
    ("default", MAG),
    ("targets", cibles),
    ("label", {
        "fr": "Don de maîtrise — un seul des deux",
        "en": "Mastery gift — one of the two",
    }),
    ("note", {
        "fr": "La recette de la Forge mystique demande un seul don de maîtrise. "
              "Astralaria, HOPE, Nevermore et Chuka and Champawat n'acceptent que "
              "Maguuma ; les douze autres laissent le choix.",
        "en": "The Mystic Forge recipe asks for a single mastery gift. Astralaria, "
              "HOPE, Nevermore and Chuka and Champawat only accept Maguuma; the "
              "other twelve leave the choice open.",
    }),
    ("ref", "gift_of_maguuma_mastery.interchangeable_note (verifie) + boites Recipe "
            "des pages d'armes gen2, deux recettes par arme"),
])
for k in cibles:
    del qm[k]
    del qd[k]

# La prose qui portait l'information est desormais calculee : la garder en
# double invite a les faire diverger.
cc[MAG].pop("interchangeable_with", None)
cc[MAG].pop("interchangeable_note", None)

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"groupe gen2_mastery : {len(cibles)} cibles, 2 options")
print("  " + ", ".join(cibles))
print(f"{DST.name} ecrit — chaque cible passe de deux dons de maitrise a un")
