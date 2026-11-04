#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Derniers apiId lisibles sur les captures, confirmes par /v2/items (05/11).

Usage : python3 scripts_tracker/integration/gw2_apiid_restants_v1.py SRC DST

Composants sans apiId dont la page est au depot : l'id du lien de jeu de
l'infobox (ressources/wiki/<page>.html), confirme par /v2/items
(ressources/api/api_ids_wiki_20261105.json) :
- fruits_of_the_shadow -> 104844 (Fruit of the Shadow) ;
- wings_of_glory_veteran -> 77522 (Veteran's Wings of Glory) ;
- gift_of_kamohoali_i_kotaki -> 19657 (Gift of Kamohoali'i Kotaki).
`so_it_is_written` n'est pas un objet : c'est le 13e chapitre de l'histoire
de Visions of Eternity, dont la Vial of Liquid Shadowstone est une
recompense garantie (so_it_is_written.html, Rewards) ; sa source « Full
material list » est remplacee par cette lecture. Les autres sans id sont des
voies de choix ou des ensembles (routes de Mist Band / Pendant, collections
d'armes, Astral Acclaim).
"""
import json
import sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
C = d["craft_components"]
J = "2026-11-05"
API = json.loads(Path("ressources/api/api_ids_wiki_20261105.json").read_text(encoding="utf-8"))["items"]
for cid, page, ident in (("fruits_of_the_shadow", "fruit_of_the_shadow", 104844),
                         ("wings_of_glory_veteran", "veterans_wings_of_glory", 77522),
                         ("gift_of_kamohoali_i_kotaki", "gift_of_kamohoalii_kotaki", 19657)):
    h = Path(f"ressources/wiki/{page}.html").read_text(encoding="utf-8")
    assert f"v2/items?ids={ident}&amp;" in h, cid
    assert API[str(ident)].replace("'", "") .lower().startswith(C[cid]["name"].replace("'", "").lower()[:5]), cid
    assert not C[cid].get("apiId"), cid
    C[cid]["apiId"] = ident
    C[cid]["apiId_ref"] = f"ressources/wiki/{page}.html (lien de jeu) + /v2/items lu le {J} (ressources/api/api_ids_wiki_20261105.json)"
h = Path("ressources/wiki/so_it_is_written.html").read_text(encoding="utf-8")
assert "Vial of Liquid Shadowstone" in h and "thirteenth chapter of the" in h
C["so_it_is_written"]["sources"] = [{"type": "reward",
    "tip": {"fr": "Chapitre d'histoire « So It Is Written » (Visions of Eternity, 13e chapitre, Sanctum of the Divine) : la Vial of Liquid Shadowstone en est une récompense garantie.",
            "en": "Story chapter 'So It Is Written' (Visions of Eternity, chapter 13, Sanctum of the Divine): the Vial of Liquid Shadowstone is a guaranteed reward."},
    "verified": True, "checked": J, "ref": "ressources/wiki/so_it_is_written.html, Rewards"}]
C["so_it_is_written"]["best"] = "reward"
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print("3 apiId poses, So It Is Written lu comme chapitre")
