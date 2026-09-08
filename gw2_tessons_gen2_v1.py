#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cree les onze tessons de precurseur gen2, chiffres par les tables du wiki.

CE QU'ILS SONT. Chaque arme gen2 a precurseur forge passe par un « Shard of X »
qui lui est propre : Shard of Resolution pour Claw of the Khan-Ur, Shard of
Endeavor pour Eureka, Shard of Liturgy pour Flames of War, et ainsi de suite.
Onze armes, onze tessons. La base n'en portait aucun — elle avait a la place
deux entrees generiques, `legendary_shard_gen2` et `legendary_shard_gen3`, sans
apiId, sans quantite, pointant vers des cibles inexistantes. Supprimees le
08/09 ; voici ce qu'elles essayaient de dire.

CE QUE LES TABLES DISENT, et c'est entierement chiffre :

    Gift of the Four Legions  ->  100 Shard of Resolution
    Shard of Resolution       ->  20 Elder Wood Plank, 30 Mithril Ingot,
                                  1 Mystic Curio, 1 Tribute to Resolution

Les quantites de troisieme colonne sont agregees sur les 100 tessons : la table
ecrit 2 000 planches et 3 000 lingots, soit 20 et 30 par tesson. Le meme motif
se repete sur les onze, avec deux barèmes — 20/30 pour les armes a une main,
30/40 pour Sharur et Exitare et Spero.

CE QUI N'EST PAS CREE ICI. Les onze « Tribute to X » et le Mystic Curio sont
cites par les tables mais sans detail : ils deviendraient des feuilles muettes.
Ils sont listes en fin de rapport plutot qu'inventes.

Aucun total etabli ne peut bouger : ces composants n'existaient pas, donc
personne ne les comptait.
"""
import collections
import json
import re
import sys
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import gw2_parse_material_list_v1 as P  # noqa: E402

SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
VER = f"v{int(SRC.stem.split('_v')[-1]) + 1}"
DST = HERE / f"gw2_sources_{VER}.json"

d = json.load(open(SRC, encoding="utf-8"), object_pairs_hook=collections.OrderedDict)
cc = d["craft_components"]


def ident(nom):
    t = unicodedata.normalize("NFKD", nom.replace("%27", "'")).encode("ascii", "ignore").decode()
    t = re.sub(r"['\u2019]", "", t)
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", t.lower())).strip("_")


def lisible(nom):
    return nom.replace("_", " ").replace("%27", "'")


# --- lecture des tables : parent -> tesson, puis tesson -> ingredients --------
vers_tesson, sous_tesson = {}, collections.defaultdict(dict)
for page in sorted(P.WIKI.glob("*.html")):
    if P._debut(page.read_text(encoding="utf-8", errors="ignore")) < 0:
        continue
    if page.stem in P.DOUBLES:
        continue
    brut = P.aretes(page)
    # Une quantite de colonne 3 est agregee sur celle de la colonne 2. La
    # colonne 2 est reconnaissable a ceci qu'elle reapparait comme TETE d'une
    # autre ligne de la meme table : c'est elle qu'on developpe.
    tetes = {t for t, _e, _q in brut}
    porte = {e: q for _t, e, q in brut if e in tetes and q}
    for tete, enfant, q in brut:
        if enfant.startswith("Shard_of_") and q:
            vers_tesson[enfant] = (tete, q)
        elif tete.startswith("Shard_of_") and q:
            div = porte.get(tete)
            if div and q % div == 0:
                sous_tesson[tete][enfant] = q // div

crees, sans_detail = [], collections.Counter()
for tesson, (parent, qte) in sorted(vers_tesson.items()):
    tid, pid = ident(tesson), ident(parent)
    if pid not in cc:
        sans_detail[f"parent inconnu : {parent}"] += 1
        continue
    if tid in cc:
        continue
    ing = sous_tesson.get(tesson) or {}
    if not ing:
        sans_detail[f"sans ingredients : {tesson}"] += 1
        continue
    qty = collections.OrderedDict([(pid, qte)])
    manquants = []
    for nom, n in sorted(ing.items()):
        cid = ident(nom)
        if cid in cc:
            cc[cid].setdefault("qty", {})[tid] = n
            nf = cc[cid].get("needed_for")
            if isinstance(nf, list) and tid not in nf:
                cc[cid]["needed_for"] = sorted(set(nf) | {tid})
        else:
            manquants.append(f"{n} {lisible(nom)}")
            sans_detail[lisible(nom)] += 1
    cc[tid] = collections.OrderedDict([
        ("name", lisible(tesson)),
        ("kind", "advanced_craft"),
        ("needed_for", [pid]),
        ("qty", qty),
        ("sources", [{"type": "mystic_forge", "tip": {
            "fr": f"Tesson de précurseur, propre à une arme. {qte} exemplaires pour "
                  f"{lisible(parent)}."
                  + (f" Ingrédients non modélisés : {', '.join(manquants)}." if manquants else ""),
            "en": f"Precursor shard, specific to one weapon. {qte} needed for "
                  f"{lisible(parent)}."
                  + (f" Ingredients not modelled: {', '.join(manquants)}." if manquants else ""),
        }}]),
        # `ref` seul laisse l'audit reclamer `checked` et `verified` : la
        # provenance n'est complete que si elle dit AUSSI d'ou et de quand.
        ("ref", f"table « Full material list » — {lisible(parent)} → {qte} {lisible(tesson)}"),
        ("checked", "2026-09-08"),
        ("verified", "tables « Full material list » des pages d'armes gen2, "
                     "colonne 3 divisee par les 100 tessons de la colonne 2"),
    ])
    crees.append((tid, pid, qte, dict(ing)))

print(f"tessons crees : {len(crees)}")
for tid, pid, qte, ing in crees:
    print(f"   {tid:28} <- {pid} x{qte} | " +
          ", ".join(f"{v} {k}" for k, v in sorted(ing.items())))
print(f"cites par les tables et non modelises : {len(sans_detail)}")
for k, v in sans_detail.most_common():
    print(f"   {k} (x{v})")

d["_meta"]["version"] = VER
d["_meta"]["last_updated"] = __import__("datetime").date.today().isoformat()
json.dump(d, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{DST.name} ecrit")
