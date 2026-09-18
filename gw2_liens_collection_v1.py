#!/usr/bin/env python3
"""Pose sur chaque etape de collection le lien wiki de son objet.

La description d'une etape ("Sold by BUY-2046 PFR in the Mistlock Observatory
for 20 Pristine Fractal Relic") repond rarement a la question qu'on se pose
devant elle. La page de l'objet, elle, y repond.

Ce lien n'est pas devine : la capture de la page de collection porte, pour
chaque case, un bloc `data-id="achievement<id>-bit<n>"` qui contient le lien
vers la page de l'objet. On le lit, on ne le construit pas. Une page absente
du depot ne donne pas de lien, et c'est tres bien : mieux vaut pas de lien
qu'un lien mort.

Le lien rejoint le champ `wiki`, celui que portent deja les legendaires et les
composants, avec la meme forme percent-encodee. Pas de champ parallele.

    python3 gw2_liens_collection_v1.py [sources.json] [--ecrire]
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
WIDGET = re.compile(
    r'data-id="achievement(\d+)-bit(\d+)"(.*?)(?=data-id="achievement|\Z)', re.S
)
# Le lien n'est pris QUE dans l'icone d'objet du widget. Les collections a
# etapes — « Parler au chaman hylek », « Vaincre Tequatl » — n'ont pas d'icone
# d'objet, et le premier lien de leur case pointe vers ce que la description
# cite au passage : un point de passage, une espece. Un lien vers « Waypoint »
# ne repond a rien. Sans ce filtre, 382 cases recevaient un lien de ce genre.
LIEN = re.compile(
    r'<span class="[^"]*item-icon[^"]*"[^>]*>\s*<a href="/wiki/([^"#?]+)"'
)


def liens_du_depot():
    """{(achievement_id, bit): page_wiki} lu dans toutes les captures."""
    out = {}
    for p in sorted((HERE / "ressources" / "wiki").glob("*.html")):
        h = p.read_text(encoding="utf-8", errors="ignore")
        if "widget-account-achievement" not in h:
            continue
        for m in WIDGET.finditer(h):
            l = LIEN.search(m.group(3))
            if l:
                out.setdefault((int(m.group(1)), int(m.group(2))), l.group(1))
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    ecrire = "--ecrire" in sys.argv
    if args:
        chemin = Path(args[0])
    else:
        chemin = max(HERE.glob("gw2_sources_v*.json"),
                     key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    data = json.loads(chemin.read_text(encoding="utf-8"))
    table = liens_du_depot()
    print(f"captures : {len(table)} cases liees")

    pose = deja = absent = 0
    for leg in (data.get("legendaries") or {}).values():
        for col in (leg.get("collections") or {}).values():
            aid = col.get("id")
            if not aid:
                continue
            for item in col.get("items") or []:
                page = table.get((int(aid), item.get("bit")))
                if not page:
                    absent += 1
                    continue
                if item.get("wiki") == page:
                    deja += 1
                    continue
                item["wiki"] = page
                pose += 1
    print(f"liens poses : {pose} | inchanges : {deja} | sans page : {absent}")
    if ecrire and pose:
        n = int(re.search(r"_v(\d+)", chemin.name).group(1)) + 1
        sortie = HERE / f"gw2_sources_v{n}.json"
        sortie.write_text(json.dumps(data, ensure_ascii=False, indent=1),
                          encoding="utf-8")
        print("ecrit :", sortie.name)
    elif not ecrire:
        print("Simulation. Relancer avec --ecrire pour appliquer.")


if __name__ == "__main__":
    main()
