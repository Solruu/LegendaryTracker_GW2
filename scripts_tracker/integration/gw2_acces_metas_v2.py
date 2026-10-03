#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Condition d'accès de chaque méta : quelle extension, ou quel épisode, il faut
posséder pour la lancer.

Les champs `categorie` et `acces` ont ete poses le 02/10 par une commande
jetable. C'est exactement ce que la regle du 01/10 interdit : une donnee qui
justifie un filtre doit sortir d'un script commite, qu'on peut relancer et
relire. Ce script les remplace et les regenere.

Deux sources, dans cet ordre :

1. **Le widget** (`Widget:Event timer/data.json`) donne la `category` de chaque
   evenement. Quand c'est une extension, la condition est directe : les valeurs
   sont exactement celles que `/v2/account` rend dans `access`.

2. **Les instances publiques** sont rangees par le widget sous une categorie
   commune, « Public Instances », qui ne dit rien de l'extension. Or chaque
   convergence a son entree sur une carte d'extension — on ne peut pas s'y
   rendre sans la posseder. Antoine l'a confirme en jeu le 02/10. La table
   `CONVERGENCES` ci-dessous le dit, segment par segment, et c'est elle qui
   perennise la reponse : relancer ce script la reapplique.

    python scripts_tracker/integration/gw2_acces_metas_v2.py
    python scripts_tracker/integration/gw2_acces_metas_v2.py --ecrire
"""
import argparse
import importlib.util
import json
import re
import sys
from collections import Counter, OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]

_sp = importlib.util.spec_from_file_location(
    "confronte", RACINE / "scripts_tracker" / "controle" / "gw2_confronte_horaires_v3.py")
_cf = importlib.util.module_from_spec(_sp)
_sp.loader.exec_module(_cf)

# Categorie du widget -> valeur de /v2/account.access. `None` : contenu de base.
PAR_CATEGORIE = {
    "Core Tyria": None,
    "Heart of Thorns": "HeartOfThorns",
    "Path of Fire": "PathOfFire",
    "End of Dragons": "EndOfDragons",
    "Secrets of the Obscure": "SecretsOfTheObscure",
    "Janthir Wilds": "JanthirWilds",
    "Visions of Eternity": "VisionsOfEternity",
}

# Les saisons de Living World ne sont pas dans `access` : aucun endpoint ne les
# expose. Elles restent une condition a verifier par une case locale.
SAISONS_LW = {
    "Living World Season 2": "LW2",
    "Living World Season 3": "LW3",
    "Living World Season 4": "LW4",
    "The Icebrood Saga": "IBS",
}

# Chaque convergence s'ouvre depuis une carte d'extension : pas d'acces sans
# elle. Confirme en jeu par Antoine le 02/10/2026. Le widget les range toutes
# sous « Public Instances » sans distinguer l'extension, d'ou cette table.
CONVERGENCES = {
    "Mount Balrior": "JanthirWilds",
    "Outer Nayos": "SecretsOfTheObscure",
    "Nexus of Eternity": "VisionsOfEternity",
}
# Les metas SANS timer ne sont pas dans le widget : leur extension ne peut pas
# se lire dans sa categorie. Elle se lit par la carte qui les porte.
# Gyala Delve : End of Dragons, affirme par Antoine. Inner Nayos : Secrets of the
# Obscure, « il me semble » — la nuance est gardee dans la reference, pour qu'on
# sache a quelle confiance on filtre.
SANS_TIMER = {
    "Gyala Delve": ("EndOfDragons", "Antoine, 02/10/2026"),
    "Inner Nayos": ("SecretsOfTheObscure", "Antoine, 02/10/2026, « il me semble » — a confirmer"),
}

REF_CONVERGENCES = ("entree sur une carte d'extension, pas d'acces sans elle — "
                    "confirme en jeu par Antoine le 02/10/2026")


def derniere(motif):
    fs = sorted(RACINE.glob(motif),
                key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    return (fs[-1], int(re.search(r"_v(\d+)", fs[-1].name).group(1))) if fs else (None, None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ecrire", action="store_true")
    args = ap.parse_args()

    src, version = derniere("gw2_sources_v*.json")
    data = json.loads(src.read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    metas = data["meta_events"]
    events = json.loads((RACINE / "ressources" / "widget" / "event_timer_data.json")
                        .read_text(encoding="utf-8")).get("events") or {}
    par_carte = {}
    for k, ev in events.items():
        par_carte.setdefault(_cf.norm(ev.get("name")), []).append((k, ev))
    paires = _cf.apparie(metas, events, par_carte)

    bilan, sans = Counter(), []
    for cle, m in metas.items():
        if not isinstance(m, dict):
            continue
        pose = paires.get(cle)
        if not pose:
            carte = m.get("map")
            carte = carte.get("en") if isinstance(carte, dict) else carte
            if carte in SANS_TIMER:
                acc, qui = SANS_TIMER[carte]
                m["categorie"] = carte
                m["categorie_ref"] = "meta sans timer : absente du widget, lue par sa carte"
                m["acces"] = OrderedDict([("type", "expansion"), ("access", acc),
                                          ("ref", qui), ("verified", "confirme" not in qui
                                                          and "semble" not in qui),
                                          ("checked", "2026-10-02")])
                bilan["sans_timer"] += 1
                continue
            sans.append(cle)
            for champ in ("categorie", "acces", "categorie_ref"):
                m.pop(champ, None)
            continue
        ev = events.get(pose[0]) or {}
        seg = pose[2] or {}
        cat = ev.get("category") or ""
        m["categorie"] = cat
        m["categorie_ref"] = "Widget:Event timer/data.json — champ `category` de son evenement"
        if cat == "Public Instances":
            acc = CONVERGENCES.get(seg.get("name"))
            if acc:
                m["acces"] = OrderedDict([("type", "expansion"), ("access", acc),
                                          ("ref", REF_CONVERGENCES),
                                          ("verified", True), ("checked", "2026-10-02")])
                bilan["convergence"] += 1
            else:
                m["acces"] = OrderedDict([("type", "a_preciser"),
                                          ("note", f"instance publique « {seg.get('name')} » "
                                                   "absente de la table CONVERGENCES")])
                bilan["a_preciser"] += 1
        elif cat in PAR_CATEGORIE:
            acc = PAR_CATEGORIE[cat]
            m["acces"] = (OrderedDict([("type", "core")]) if acc is None else
                          OrderedDict([("type", "expansion"), ("access", acc)]))
            bilan["core" if acc is None else "expansion"] += 1
        elif cat in SAISONS_LW:
            m["acces"] = OrderedDict([("type", "living_world"), ("saison", SAISONS_LW[cat])])
            bilan["living_world"] += 1
        else:
            m["acces"] = OrderedDict([("type", "a_preciser"), ("note", f"categorie « {cat} »")])
            bilan["a_preciser"] += 1

    print(f"metas : {len(metas)} | {dict(bilan)} | sans evenement au widget : {len(sans)}")
    if sans:
        print(f"   sans evenement : {', '.join(sans)} — conditionnelles, sans horaire")
    for cle, m in sorted(metas.items()):
        a = m.get("acces") or {}
        if a.get("type") in ("a_preciser", "living_world") or "ref" in a:
            print(f"   {cle:14} {json.dumps(a, ensure_ascii=False)[:90]}")

    if not args.ecrire:
        print("(lecture seule — relancer avec --ecrire)")
        return 0
    dest = RACINE / f"gw2_sources_v{version + 1}.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"ecrit : {dest.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
