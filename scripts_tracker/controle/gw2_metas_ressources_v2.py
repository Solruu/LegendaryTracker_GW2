#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quelle méta sert à quoi, et pour quel légendaire.

Le postulat de depart etait « une legendaire a ses zones, mutualisons les metas
qui les animent ». Antoine l'a corrige le 01/10 : ce qui compte, c'est **ce que
la meta rend**, et si l'arbre en a encore besoin.

Le croisement se fait en deux sens, parce qu'une meta ne rend presque jamais la
ressource directement — elle rend un COFFRE, et c'est la page de la ressource
qui dit quels coffres la contiennent.

  meta  --(sa capture)-->  coffres + objets rendus directement
  ressource --(sa capture)-->  coffres qui la contiennent
                           \\--> croisement sur le nom du coffre

Puis l'arbre repond a la seule question qui compte : **cette ressource
est-elle encore demandee, et par quelle cible ?**

Une ressource est signalee PRIORITAIRE quand aucune de ses sources n'est une
piste renouvelable — ni gratuite ni payante. C'est le cas de la gemme
amalgamee, dont le cout de forge est prohibitif : la meta n'est pas une
commodite, c'est la seule voie raisonnable.

L'outil ne modifie rien. Il ecrit un rapport.

    python scripts_tracker/controle/gw2_metas_ressources_v2.py
"""
import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import unquote

RACINE = Path(__file__).resolve().parents[2]
WIKI = RACINE / "ressources" / "wiki"
COFFRE = re.compile(r"([A-Za-z'\u2019\-\. ]{3,34}): Hero's Choice Chest")
SUFFIXES = ("", "__per_piece", "__full_set", "__per_unit", "__onetime")


def derniere(motif):
    fs = sorted(RACINE.glob(motif),
                key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    return fs[-1] if fs else None


def texte(page):
    f = WIKI / f"{page}.html"
    return re.sub(r"<[^>]+>", " ", f.read_text(encoding="utf-8", errors="ignore")) \
        if f.exists() else ""


def coffres(page, borner=False):
    """Coffres cites par une page. `borner` limite a sa section d'acquisition.

    Sans bornage, la page de la gemme amalgamee rendait « The Desolation »,
    citee ailleurs qu'en « Contained in » — et la meta `de` heritait d'une
    gemme que son coffre ne contient pas. Une mention n'est pas une
    appartenance.
    """
    t = texte(page)
    if borner:
        # Le sommaire cite « Acquisition », « Contained in » et « Used in »
        # avant les sections elles-memes : partir de la premiere occurrence
        # decoupait le sommaire, 195 caracteres, et ne trouvait rien. On prend
        # la DERNIERE occurrence du titre, puis la section suivante apres elle.
        i = max(t.rfind("Contained in"), t.rfind("Acquisition"))
        if i >= 0:
            j = t.find("Used in", i)
            t = t[i:j if j > i else i + 9000]
    # Un nom de carte commence par une majuscule. Sans ce filtre, la phrase
    # « ...shared daily limit with the Janthir Syntri and Castora: Hero's
    # Choice Chest » rendait « the Janthir Syntri » et « and Castora » comme
    # s'ils contenaient la ressource. J'ai publie cette liste sans voir les
    # articles en tete : Castora n'a jamais rendu de gemme.
    return {c.strip() for c in COFFRE.findall(t)
            if c.strip() and c.strip()[0].isupper()}


def cibles_de(cc, legs, compo):
    """Legendaires atteintes en remontant les aretes qty."""
    out, vus, pile = set(), set(), [compo]
    while pile:
        n = pile.pop()
        if n in vus:
            continue
        vus.add(n)
        for parent in (cc.get(n, {}).get("qty") or {}):
            base = parent.split("__")[0]
            if base in legs:
                out.add(base)
            elif base in cc:
                pile.append(base)
    return out


def seulement_par_la_meta(comp):
    """Vrai si la meta est la seule voie renouvelable.

    La gemme amalgamee est `free_repeatable` — mais uniquement parce que la
    meta la rend. Son autre voie est la forge mystique, au cout prohibitif.
    « Prioritaire » ne veut donc pas dire « sans source », il veut dire : si tu
    sautes la meta, il ne reste rien de raisonnable.
    """
    renouv = [s for s in (comp.get("sources") or [])
              if s.get("free_repeatable") or s.get("type") in
              {"vendor", "farm", "gathering", "salvage", "reward_track", "meta_drop"}]
    return bool(renouv) and all(s.get("type") == "meta_drop" for s in renouv)


def main():
    argparse.ArgumentParser().parse_args()
    data = json.loads(derniere("gw2_sources_v*.json").read_text(encoding="utf-8"))
    cc, legs, metas = data["craft_components"], data["legendaries"], data["meta_events"]

    # 1. ressource -> coffres qui la contiennent
    par_coffre = defaultdict(set)
    sans_coffre = 0
    for cid in cc:
        trouves = coffres(cid, borner=True)
        if not trouves:
            sans_coffre += 1
        for c in trouves:
            par_coffre[c].add(cid)

    # 2. meta -> coffres cites par sa capture
    #    La page d'une meta n'est pas toujours celle de sa cle : on tente le
    #    `ref`, puis le sous-nom, puis la carte.
    def pages_de(m):
        out = []
        for v in (m.get("ref"), m.get("name"), m.get("map")):
            v = v.get("en") if isinstance(v, dict) else v
            if not v:
                continue
            v = re.sub(r"^wiki:", "", str(v)).split(" —")[0].split(" (")[0]
            out.append(re.sub(r"[^a-z0-9]+", "_", unquote(v).lower()).strip("_"))
        return [p for p in dict.fromkeys(out) if (WIKI / f"{p}.html").exists()]

    lignes = ["# Quelle méta sert à quoi", "",
              "Croisement en deux sens : la capture d'une méta nomme les **coffres** qu'elle",
              "rend, la capture d'une ressource nomme les coffres qui la **contiennent**. On",
              "croise sur le nom du coffre, puis l'arbre dit quelles cibles réclament encore",
              "la ressource.", "",
              "**PRIORITAIRE** — aucune source renouvelable, ni gratuite ni payante. La méta",
              "n'est pas une commodité, c'est la seule voie raisonnable.", ""]

    couverts, muets = 0, []
    for mk, m in sorted(metas.items()):
        pages = pages_de(m)
        trouves = set()
        for p in pages:
            trouves |= coffres(p)
        ressources = {}
        for c in trouves:
            for cid in par_coffre.get(c, ()):
                cibles = cibles_de(cc, legs, cid)
                if cibles:
                    ressources[cid] = (c, cibles)
        sn = m.get("name")
        sn = sn.get("en") if isinstance(sn, dict) else sn
        if not ressources:
            muets.append((mk, str(sn), bool(pages), sorted(trouves)))
            continue
        couverts += 1
        lignes.append(f"## `{mk}` — {sn}\n")
        lignes.append("| ressource | coffre | encore demandée par | |")
        lignes.append("|---|---|---|---|")
        for cid, (c, cibles) in sorted(ressources.items()):
            prio = " **PRIORITAIRE**" if seulement_par_la_meta(cc[cid]) else ""
            qui = ", ".join(f"`{x}`" for x in sorted(cibles)[:4])
            if len(cibles) > 4:
                qui += f" … (+{len(cibles) - 4})"
            lignes.append(f"| `{cid}` | {c} | {qui} |{prio} |")
        lignes.append("")

    lignes.append(f"## Métas sans ressource identifiée — {len(muets)}\n")
    lignes.append("| méta | sous-nom | capture trouvée | coffres cités |")
    lignes.append("|---|---|---|---|")
    for mk, sn, ok, tr in muets:
        lignes.append(f"| `{mk}` | {sn} | {'oui' if ok else '**non**'} | "
                      f"{', '.join(tr) or '—'} |")
    lignes.append("")
    lignes.append(f"Composants sans coffre cité dans leur capture : {sans_coffre} "
                  f"sur {len(cc)}. Le coffre n'est qu'une voie parmi d'autres — "
                  "ce rapport ne couvre que celle-la.")

    n = 1
    while (RACINE / f"METAS_RESSOURCES_v{n}.md").exists():
        n += 1
    (RACINE / f"METAS_RESSOURCES_v{n}.md").write_text("\n".join(lignes) + "\n",
                                                      encoding="utf-8")
    print(f"metas avec ressource identifiee : {couverts} | sans : {len(muets)}")
    print(f"coffres connus : {len(par_coffre)} | ecrit : METAS_RESSOURCES_v{n}.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
