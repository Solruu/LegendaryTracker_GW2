#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Retire `nextDelayMin` du catalogue des metas (accord d'Antoine, 03/10/2026).

Le champ venait des tableaux du JSX ; depuis la fusion du catalogue, plus aucun
code ne le lit : le chainage affiche (« → Ensuite : … à 01:40 ») se calcule sur
la prochaine occurrence de la meta suivante. Un champ que rien ne lit finit
faux sans que personne le voie — `nk` en portait deja un incoherent (40 min
quand l'horaire en donne 60).

L'audit v58 refuse son retour.
"""
import argparse, json
from collections import OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    d = json.loads((RACINE / a.src).read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    n = 0
    for m in d["meta_events"].values():
        if isinstance(m, dict) and "nextDelayMin" in m:
            del m["nextDelayMin"]
            n += 1
    (RACINE / a.out).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"nextDelayMin retire de {n} metas -> {a.out}")


if __name__ == "__main__":
    main()
