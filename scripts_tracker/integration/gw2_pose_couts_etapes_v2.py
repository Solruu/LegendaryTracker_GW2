#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pose `cost` sur les étapes de collection qui CONSOMMENT des matériaux.

Le controle `gw2_couts_etapes_v1.py` reperait 114 etapes citant une quantite
d'une ressource de l'arbre, et prevenait lui-meme que son cumul etait gonfle :
une etape qui DECRIT la recette d'un objet deja compte (« Created by a master
craftsman with 100 Crystalline Ingots ») n'est pas une consommation.

Ce script ne retient donc qu'une forme : celle ou l'on **apporte** quelque
chose a quelqu'un. Le verbe « Bring » ouvre le texte, et ce qui suit est ce que
l'etape prend au joueur. Les sept miroirs de Vision (« Bring 10 Orichalcum
Ingots, 10 Powdered Rose Quartz… ») et les bouquets d'Aurora sont de cette
forme ; les recettes de dons gen1 n'en sont pas.

Un nom doit correspondre EXACTEMENT a un composant de l'arbre, pluriel toléré.
Un texte qui ne se resout pas entierement n'est pas pose a moitie : l'etape est
listee, a lire.

    python scripts_tracker/integration/gw2_pose_couts_etapes_v2.py
    python scripts_tracker/integration/gw2_pose_couts_etapes_v2.py --ecrire
"""
import argparse
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]


# Noms d'usage -> composant. « Fire Orchid » est le nom courant de la Fire Orchid
# Blossom : les quatre bouquets de Draconis Mons ecrivent « 10 Fire Orchids »
# quand leurs etapes soeurs ecrivent « Fire Orchid Blossoms ». Sans ce synonyme,
# ces quatre etapes restaient non posees — volontairement, puisqu'on ne pose pas
# un cout a moitie.
SYNONYMES = {
    "Fire Orchid": ("fire_orchid_blossom", "Antoine, 02/10/2026 : meme objet, nomme differemment"),
}


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
    cc = data["craft_components"]

    # Les noms les plus longs d'abord : « Charged Lodestone » avant « Lodestone ».
    noms = [(str(c.get("name") or "").strip(), cid) for cid, c in cc.items()
            if len(str(c.get("name") or "").strip()) >= 4]
    # Un meme objet peut etre nomme autrement dans le texte d'une etape. Ces
    # synonymes ne se devinent pas : chacun est confirme et dit par qui.
    noms += [(alias, cid) for alias, (cid, _qui) in SYNONYMES.items() if cid in cc]
    noms.sort(key=lambda x: -len(x[0]))

    poses, partiels = [], []
    for lk, lv in data["legendaries"].items():
        for ck, cv in (lv.get("collections") or {}).items():
            for it in (cv.get("items") or []):
                h = it.get("how") or {}
                txt = ((h.get("en") if isinstance(h, dict) else str(h or "")) or "").strip()
                txt = re.sub(r"^Hint:\s*", "", txt)
                if not txt.startswith("Bring "):
                    continue
                # On ne lit que la phrase d'apport, pas la suite (lieu, PNJ).
                apport = re.split(r"\bto\b", txt, maxsplit=1)[0]
                cout, reste = OrderedDict(), apport
                for nom, cid in noms:
                    m = re.search(r"\b(\d{1,4}|an?)\s+" + re.escape(nom) + r"s?\b",
                                  reste, re.IGNORECASE)
                    if m:
                        q = m.group(1)
                        cout[cid] = 1 if q.lower() in ("a", "an") else int(q)
                        reste = reste[:m.start()] + reste[m.end():]
                # Un nombre encore present = une ressource non resolue.
                if re.search(r"\b\d{1,4}\s+[A-Z]", reste):
                    partiels.append((lk, ck, it.get("bit"), it.get("name"), apport))
                    continue
                if cout and it.get("cost") != dict(cout):
                    it["cost"] = cout
                    it["cost_ref"] = "texte « how » de l'etape, phrase d'apport (Bring …)"
                    poses.append((lk, ck, it.get("bit"), it.get("name"), dict(cout)))

    print(f"etapes « Bring » chiffrees : {len(poses)} | non entierement resolues : {len(partiels)}")
    for lk, ck, b, nom, c in poses:
        print(f"  {lk:10} {ck:18} b{b:<3} {str(nom)[:32]:34} {c}")
    for lk, ck, b, nom, a in partiels:
        print(f"  ? {lk:10} {ck:18} b{b:<3} {str(nom)[:32]:34} {a[:70]}")
    if not args.ecrire:
        print("(lecture seule — relancer avec --ecrire)")
        return 0
    dest = RACINE / f"gw2_sources_v{version + 1}.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"ecrit : {dest.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
