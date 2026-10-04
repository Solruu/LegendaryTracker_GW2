#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pose la reference des horaires que le widget confirme sans qu'elles la citent.

L'audit v57 relevait 12 metas a horaire sans `ref` (vb, td, ab…). Toutes sont
en ACCORD dans gw2_confronte_horaires : le widget donne le meme decalage, le
meme intervalle. La source existe donc, elle n'etait simplement pas ecrite.
On l'ecrit, au format deja employe (« Widget:Event timer/data.json — <evt>,
segment « <nom> » : … »), et SEULEMENT pour une meta en accord : une meta
en ecart ou sans segment garde son trou, l'avertissement reste.

Ne touche jamais une `ref` existante.
"""
import argparse, importlib.util, json, re, sys
from collections import OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location(
    "cf", RACINE / "scripts_tracker" / "controle" / "gw2_confronte_horaires_v4.py")
_cf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_cf)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ecrire", action="store_true")
    a = ap.parse_args()
    fs = sorted(RACINE.glob("gw2_sources_v*.json"), key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    src, version = fs[-1], int(re.search(r"_v(\d+)", fs[-1].name).group(1))
    data = json.loads(src.read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    metas = data["meta_events"]
    events = json.loads((RACINE / "ressources" / "widget" / "event_timer_data.json")
                        .read_text(encoding="utf-8")).get("events") or {}
    par_carte = {}
    for k, ev in events.items():
        par_carte.setdefault(_cf.norm(ev.get("name")), []).append((k, ev))
    paires = _cf.apparie(metas, events, par_carte)
    poses, refuses = [], []
    for cle, m in metas.items():
        if not isinstance(m, dict) or m.get("isTimeless") or m.get("ref"):
            continue
        if not isinstance(m.get("offsetUTC"), int):
            continue
        p = paires.get(cle)
        if not p:
            refuses.append((cle, "sans segment au widget"))
            continue
        k, r, seg, fi = p
        # Accord exige : on ne cite pas une source qui dit autre chose.
        ok = fi is not None and fi[0] == m["offsetUTC"] and fi[1] == m.get("intervalMin")
        if not ok:
            refuses.append((cle, f"pas en accord ({fi})"))
            continue
        m["ref"] = (f"Widget:Event timer/data.json — {k}, segment « {seg.get('name')} » : "
                    "decalage et intervalle confirmes par gw2_confronte_horaires")
        # Forme complete de provenance exigee par l'audit : ref + checked + verified.
        m["checked"] = "2026-10-03"
        m["verified"] = True
        poses.append(cle)
    print(f"refs posees : {len(poses)} — {', '.join(poses)}")
    for c, why in refuses:
        print(f"   laissee : {c} ({why})")
    if a.ecrire and poses:
        dest = RACINE / f"gw2_sources_v{version + 1}.json"
        dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        print("ecrit :", dest.name)


if __name__ == "__main__":
    sys.exit(main())
