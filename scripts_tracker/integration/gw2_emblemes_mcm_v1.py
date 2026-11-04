#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Emblem of the Avenger / Emblem of the Conqueror : sources relues (05/11).

Usage : python3 scripts_tracker/integration/gw2_emblemes_mcm_v1.py SRC DST

Point du plan C21 (« sources reduites a Full material list, a relire avant
d'y toucher »). Lecture de ressources/wiki/emblem_of_the_avenger.html et
emblem_of_the_conqueror.html :
- Avenger : succes McM « Emblem of the Avenger », vaincre 100 joueurs,
  repetable a l'infini (icone Tango_repeatable_event). Vendu aussi par
  Lionguard (Fort Marriner), Mercenary (Armistice Bastion) et Skirmish
  Supervisor (McM) : 5 Avengers pour 1 Emblem of the Conqueror.
  La source unique « Full material list » ne disait rien de l'obtention.
- Conqueror : succes McM « Emblem of the Conqueror », capturer OU defendre
  100 objectifs, repetable a l'infini. Notes : les captures de ruines et de
  camps ne comptent pas ; toute defense reussie compte, camps compris. Notre
  conseil disait « capturer », excluait les camps sans nuance, et la cadence
  « unique » contredisait `free_repeatable` (Warbringer en demande 100).
  Vendu aussi par les trois memes PNJ : 100 Emblems of the Avenger.
Voie par defaut = le succes (gratuit, sans plafond). Les echanges entre
emblemes sont des voies concurrentes de la meme acquisition : citees en
option, aucun cout compte, aucune arete posee (regle de voie par defaut :
le moins cher — 1 Conqueror = 100 objectifs, contre 100 Avengers = 10 000
joueurs vaincus). Quantites et aretes inchangees.
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
cc = d["craft_components"]
J = "2026-11-05"
WK = Path("ressources/wiki")
for p in ("emblem_of_the_avenger", "emblem_of_the_conqueror"):
    h = (WK / f"{p}.html").read_text(encoding="utf-8")
    assert "This achievement is repeatable infinitely" in h, p
a = (WK / "emblem_of_the_avenger.html").read_text(encoding="utf-8")
c = (WK / "emblem_of_the_conqueror.html").read_text(encoding="utf-8")
assert "Defeat 100 players" in a and "5&#160;for&#160;1" in a
assert "Capture or defend 100 objectives" in c and "All successful <a href=\"/wiki/Repel_the_enemy_attackers\"" in c and "camp defenses" in c

PNJ_FR = "Lionguard (Fort Marriner, Arche du Lion), Mercenaire (Bastion de l'Armistice) ou Superviseur d'escarmouche (cartes McM)"
PNJ_EN = "Lionguard (Fort Marriner, Lion's Arch), Mercenary (Armistice Bastion) or Skirmish Supervisor (WvW maps)"

av = cc["emblem_of_the_avenger"]
av["sources"] = [
    {"type": "wvw_achievement",
     "tip": {"fr": "Voie par défaut. Succès McM « Emblem of the Avenger » : vaincre 100 joueurs. Répétable à l'infini, gratuit.",
             "en": "Default route. WvW achievement 'Emblem of the Avenger': defeat 100 players. Infinitely repeatable, free."},
     "free_repeatable": True, "cadence": "à volonté",
     "verified": True, "checked": J, "ref": "ressources/wiki/emblem_of_the_avenger.html, Acquisition > Achievements"},
    {"type": "wvw_vendor", "npc": PNJ_EN,
     "tip": {"fr": f"Option, non comptée : 5 Emblems of the Avenger pour 1 Emblem of the Conqueror chez {PNJ_FR}.",
             "en": f"Option, not counted: 5 Emblems of the Avenger for 1 Emblem of the Conqueror from {PNJ_EN}."},
     "verified": True, "checked": J, "ref": "ressources/wiki/emblem_of_the_avenger.html, Acquisition > Sold by"},
]
co = cc["emblem_of_the_conqueror"]
co["sources"] = [
    {"type": "wvw_achievement",
     "tip": {"fr": "Voie par défaut. Succès McM « Emblem of the Conqueror » : capturer ou défendre 100 objectifs. Les captures de camps et de ruines ne comptent pas ; toute défense réussie compte, camps compris. Répétable à l'infini, gratuit.",
             "en": "Default route. WvW achievement 'Emblem of the Conqueror': capture or defend 100 objectives. Camp and ruin captures don't count; every successful defense counts, camps included. Infinitely repeatable, free."},
     "free_repeatable": True, "cadence": "à volonté",
     "verified": True, "checked": J, "ref": "ressources/wiki/emblem_of_the_conqueror.html, Acquisition > Achievements, Notes"},
    {"type": "wvw_vendor", "npc": PNJ_EN,
     "tip": {"fr": f"Option, non comptée : 100 Emblems of the Avenger chez {PNJ_FR}.",
             "en": f"Option, not counted: 100 Emblems of the Avenger from {PNJ_EN}."},
     "verified": True, "checked": J, "ref": "ressources/wiki/emblem_of_the_conqueror.html, Acquisition > Sold by"},
]
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("emblemes : 2 composants, sources relues")
