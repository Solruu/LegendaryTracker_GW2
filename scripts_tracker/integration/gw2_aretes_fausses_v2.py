#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Retire les aretes que controle/gw2_aretes_non_sourcees montre fausses.

Usage : python3 scripts_tracker/integration/gw2_aretes_fausses_v2.py SRC DST

(v1, historique git : gift_of_adventure_voe -> Gift of Castoran Mastery.)

v2 — DEUX MONNAIES POUR UNE SEULE VOIE. Certificate of Heroics et Essence of
Animosity s'obtiennent de deux facons : chez le vendeur McM (250 / 500
Testimony of Castoran Heroics, lignes actives de la table « Acquisition ») ou
par la recette de la Forge (250 / 500 Testimony of Jade Heroics). La donnee
portait les DEUX, chacune a pleine quantite : Conflux comptait 750 Jade ET
750 Castoran, Triumphant Hero 1 500 et 1 500, Warbringer 500 et 500.

On garde Castoran : testimony_of_jade_heroics.html dit la Jade inobtenable
depuis Visions of Eternity (28/10/2025, toutes ses sources « currently
unavailable ») et l'echange 1 pour 1 contre de la Castoran chez le Heroics
Notary ; la page Conflux (plus recente) et les arbres gw2efficiency de
Conflux, Warbringer et Strife Unending ne comptent que la Castoran. Un
detenteur de Jade la convertit : rien n'est perdu a ne compter qu'une voie.

Pourquoi aucun rapport ne le voyait : les deux aretes etaient dans la donnee,
la capture ne proposait que la recette (cout vendeur ecarte par
`achat_au_choix`, prix mixtes), et ARETES_NON_SOURCEES ne signalait que la
ligne juste — celle de la Castoran.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
j = cc["testimony_of_jade_heroics"]
for parent, q in (("certificate_of_heroics", 250), ("essence_of_animosity", 500)):
    assert j["qty"].pop(parent) == q
    assert cc["testimony_of_castoran_heroics"]["qty"][parent] == q
    j["needed_for"] = [x for x in (j.get("needed_for") or []) if x != parent]
d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
