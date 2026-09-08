#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Retire quatre entrees que rien ne calcule et que rien ne peut atteindre.

TROIS COMPOSANTS MORTS.

- `gift_of_fractals` : « Gift of Fractals » n'existe pas dans le jeu. L'entree
  porte un `needed_for: [fractal_capacitor]` et un conseil d'achat chez
  BUY-2046 PFR, mais son `qty` est vide et personne ne pointe vers elle. Aucune
  des 682 captures ne mentionne ce nom.
- `legendary_shard_gen2` et `legendary_shard_gen3` : `apiId` nul, `qty` vide,
  et un `needed_for` vers `gen2_precursor` / `gen3_precursor` — deux cibles qui
  n'existent nulle part dans la base. Leur description parle de « craft a la
  discipline 500 depuis des materiaux eleves », ce qui decrit le PRECURSEUR
  lui-meme, pas un objet nomme « Legendary Shard ». Le seul objet reel portant
  ce nom est l'Enormous Chest of Legendary Shards, qui sert a convertir des
  skins d'arme, pas a en fabriquer.

UNE CIBLE FANTOME.

`upgrades` n'est pas un legendaire : elle n'existe pas dans `legendaries`. Or
l'interface ne propose au choix que les entrees de `legendaries` filtrees par
QTY_LEG_IDS — `upgrades` ne peut donc JAMAIS etre cochee, et les quatre couts
qu'elle porte ne sont comptes nulle part :

    obsidian_shard 450 | glob_of_ectoplasm 1050 | mystic_clover 205
    pile_of_lucent_crystal 23250 | mystic_clover.upgrades_combined 300

Ces chiffres sont l'agregat de 7 runes + 8 cachets + 1 relique, ecrit a cote
des trois entrees reelles `legendary_rune`, `legendary_sigil` et
`legendary_relic` qui portent chacune leur recette. Table parallele, donc, et
table parallele INERTE : elle ne corrigeait meme pas le sous-comptage qu'elle
doublait.

Ce que sa disparition rend visible, et c'est le point : la ligne
runes/cachets/reliques est INCOMPLETE. Les chaines des trois entrees reelles ne
descendent pas encore jusqu'a l'obsidienne et aux ectoplasmes — il manque les
aretes de gift_of_runes, gift_of_sigils et gift_of_relics, dont les recettes
sont pourtant capturees. L'agregat masquait ce trou sans le combler. Mieux vaut
un manque visible qu'un doublon inerte.

UNE RECETTE INVENTEE POUR REMPLIR UNE ENTREE FANTOME.

`gift_of_fractals` avait ete cree pour completer la recette de
`legendaries/fractal_capacitor`. Or cette entree porte elle-meme, depuis
longtemps, sa propre mise en garde : « aucun legendaire Fractal Capacitor
n'existe — le dos legendaire des fractales est Ad Infinitum ; conserve comme
renvoi ». Une entree qui se declare non confirmee n'a pas a porter de recette :
`recipe`, `components` et `recipe_verified` sont retires, et la cle
`mystic_tribute -> fractal_capacitor` avec eux. Le renvoi et sa note restent.

Les chiffres ne sont pas perdus : ils sont dans ce fichier, dans le message de
commit, et dans l'historique git.
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

MORTS = ["gift_of_fractals", "legendary_shard_gen2", "legendary_shard_gen3"]
FANTOME = "fractal_capacitor"  # legendaire qui se declare lui-meme non confirme
for cid in MORTS:
    c = cc.get(cid)
    if c is None:
        print(f"  {cid} : deja absent")
        continue
    assert not (c.get("qty") or {}), f"{cid} porte un qty — ne pas supprimer sans regarder"
    pointeurs = [k for k, v in cc.items() if cid in ((v.get("qty") or {}))]
    assert not pointeurs, f"{cid} est reference par {pointeurs}"
    del cc[cid]
    print(f"  supprime : {cid}")

e = d["legendaries"].get(FANTOME)
if e is not None:
    for k in ("recipe", "components", "recipe_verified"):
        e.pop(k, None)
    (cc["mystic_tribute"].get("qty") or {}).pop(FANTOME, None)
    print(f"  {FANTOME} : recette inventee retiree, le renvoi et sa note restent")

retires = {}
for cid, c in cc.items():
    q = c.get("qty") or {}
    for k in [x for x in q if x.split("__")[0] == "upgrades" or x == "upgrades_combined"]:
        retires[f"{cid}.{k}"] = q.pop(k)
    nf = c.get("needed_for")
    if isinstance(nf, list) and "upgrades" in nf:
        c["needed_for"] = [x for x in nf if x != "upgrades"]
print(f"  cible fantome `upgrades` : {len(retires)} cles retirees")
for k, v in retires.items():
    print(f"     {k} = {v}")

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{DST.name} ecrit")
