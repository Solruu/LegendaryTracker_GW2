#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Defait ma table parallele : les voies du trefle rentrent dans `cadence.sources`.

CE QUE J'AVAIS FAIT DE FAUX. Antoine a pose la question qui tranche : la
quantite exigee (77 trefles pour le Don de fortune) et la voie d'acquisition
(10 par semaine chez BUY-4373) sont deux informations de nature differente.
Elles etaient DEJA separees dans la base, et correctement :

- `qty` porte l'exigence, par niveau, par construction ;
- `sources[]` et `cadence.sources[]` portent l'acquisition, avec les prix, les
  plafonds et les periodes. L'onglet Cadences lit `need = totals[id]`, c'est-a-
  dire l'exigence venue de l'arbre, puis somme les plafonds pour projeter un
  delai. La separation que decrit Antoine est le principe de cet onglet.

Et le trefle portait deja ses neuf voies, datees et verifiees depuis le 11
aout, avec l'avertissement que Miyani plafonne a 10 cumules entre tous les PNJ
et « AUCUN PLAFOND » sur Lyhr — le prix que j'ai demande a Antoine etait dans
nos propres sources.

J'ai quand meme cree dix composants `clover_*` et un `alt_groups` qui recopient
tout cela. Meme fait a deux endroits, dont un seul tenu a jour : la table
parallele que les regles du projet interdisent. Mon « aucun champ nouveau »
etait vrai a la lettre et faux sur le fond — je n'ai pas ajoute de champ, j'ai
ajoute une deuxieme verite.

CE QUE CE SCRIPT FAIT. Il supprime les dix composants et le groupe. `alt_groups`
revient a ce pour quoi il existe : un choix d'INGREDIENT a un niveau — Maguuma
ou Desert, une gemme parmi six, un trophee parmi sept. Le travail « par
niveau » reste valable tel quel, il ne portait pas sur le trefle.

Rien ne bouge a l'ecran : le defaut etait la piste de recompenses, qui ne coute
rien, donc l'arbre ne portait deja aucun cout de trefle.

CE QUI EST CONSERVE, ET OU. Les prix que ma passe avait etablis et qui ne
figuraient pas encore dans `cadence.sources` y sont verses — la Forge avec son
taux de 31 %, le Nouvel An lunaire, et BUY-4373 dont l'entree de cadence
manquait. Les trois pierres philosophales et l'ecu astral restent en base comme
composants sans cout : ce sont de vraies monnaies, citees par la page, pas des
voies deguisees.
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
groupes = d["alt_groups"]

VOIES = [c for c in cc if c.startswith("clover_")]
assert VOIES, "rien a defaire"

# --- 1. les entrees de cadence qui manquaient --------------------------------
cad = cc["mystic_clover"].setdefault("cadence", {}).setdefault("sources", [])
deja = {json.dumps(f.get("label"), sort_keys=True) for f in cad}
NOUVELLES = [
    {"label": {"fr": "BUY-4373 (Fractales)", "en": "BUY-4373 (Fractals)"},
     "period": "week", "cap": 10,
     "cost": {"fr": "150 reliques fractales immaculées + 2 écus + 2 ectoplasmes "
                    "+ 2 éclats spirituels",
              "en": "150 Pristine Fractal Relics + 2 coins + 2 ectoplasm + 2 spirit shards"},
     "verified": True, "checked": "2026-09-08", "ref": "wiki:Mystic_Clover"},
    {"label": {"fr": "Miyani / préposés à la Forge", "en": "Miyani / Forge Attendants"},
     "period": "week", "cap": 10,
     "cost": {"fr": "3 écus + 5 ectoplasmes + 3 éclats d'obsidienne + 3 éclats "
                    "spirituels. Plafond CUMULÉ entre tous les préposés.",
              "en": "3 coins + 5 ectoplasm + 3 obsidian shards + 3 spirit shards. "
                    "Cap SHARED across all attendants."},
     "verified": True, "checked": "2026-09-08",
     "ref": "wiki:Mystic_Clover — liens du HTML, confirmes par la table de Conflux"},
    {"label": {"fr": "Nouvel An lunaire", "en": "Lunar New Year"},
     "period": "week", "cap": 1,
     "cost": {"fr": "10 essences de chance exotiques, et rien d'autre",
              "en": "10 Exotic Essences of Luck, nothing else"},
     "verified": True, "checked": "2026-09-08", "ref": "wiki:Mystic_Clover"},
]
ajoutees = 0
for f in NOUVELLES:
    if json.dumps(f["label"], sort_keys=True) not in deja:
        cad.append(f)
        ajoutees += 1

# La Forge existait deja en cadence, mais sans son taux chiffre : c'est le seul
# nombre de cette page que je n'avais pas quand elle a ete ecrite.
for f in cad:
    if f.get("label", {}).get("en") == "Mystic Forge":
        f["cost"] = {"fr": "1 écu + 1 ectoplasme + 1 éclat d'obsidienne + 6 pierres "
                           "philosophales par TENTATIVE, et 31 % de réussite — soit "
                           "3,23 tentatives par trèfle (recette « Average » du wiki)",
                     "en": "1 coin + 1 ectoplasm + 1 obsidian shard + 6 philosopher's "
                           "stones per ATTEMPT, 31% success — 3.23 attempts per clover "
                           "(the wiki's own \"Average\" recipe)"}
        f["checked"] = "2026-09-08"

# --- 2. supprimer la table parallele -----------------------------------------
del groupes["acquisition_trefle"]
for v in VOIES:
    del cc[v]
retirees = 0
for cid, c in cc.items():
    q = c.get("qty") or {}
    for v in list(q):
        if v.startswith("clover_"):
            del q[v]
            retirees += 1
    nf = c.get("needed_for")
    if isinstance(nf, list):
        c["needed_for"] = [x for x in nf if not x.startswith("clover_")]

print(f"voies supprimees : {len(VOIES)} | aretes retirees : {retirees} | "
      f"entrees de cadence ajoutees : {ajoutees}")
print(f"groupes restants : {list(groupes)}")

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{DST.name} ecrit")
