#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Declare les redirections wiki que les pages utilisent, dans `wiki_redirects`.

Usage : python3 scripts_tracker/integration/gw2_redirections_wiki_v1.py SRC DST

Le champ existe (glob_of_dark_matter <- « Dark_Matter ») et parseurs/
gw2_edges_wiki_v15 le lit. Chaque ajout ici est prouve par le HTML : le lien
porte la redirection en href et le vrai nom en title.

- glob_of_ectoplasm <- « Ectoplasm » : href="/wiki/Ectoplasm"
  title="Glob of Ectoplasm", sur 9 pages du depot (dont Memory Essence
  Encapsulator, dont l'arete ecto 50 apparaissait comme non sourcee).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
for cid, red in (("glob_of_ectoplasm", "Ectoplasm"),):
    r = cc[cid].setdefault("wiki_redirects", [])
    assert red not in r
    r.append(red)
d["_meta"]["last_updated"] = "2026-10-04"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
