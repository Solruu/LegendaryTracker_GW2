#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Complete le tableau `wiki/` de `ressources/INDEX.md` : ajoute les lignes
manquantes, ne reecrit jamais une ligne existante.

Pourquoi ce script existe : ce tableau est le dernier index encore tenu a la
main, et il a decroche cinq lots d'affilee (13 a 18). A chaque reprise les
captures arrivent au depot et les lignes ne suivent pas — jusqu'a 102 fichiers
sans ligne. Le controle d'inventaire en tete de `INDEX.md` dit pourquoi c'est
grave : « un fichier present mais absent de ce tableau est un fichier que
personne ne sait lire ».

Pourquoi il n'est PAS un generateur complet : une regeneration integrale
detruirait ce que seul un humain a su ecrire. La colonne « portee » porte des
mentions comme « collection, 16 objets » ou « section Dropped by, 120 NPC »
qu'aucune deduction ne retrouve, et la colonne « verse le » est la date de
CAPTURE, pas celle du dernier commit ayant touche le fichier — une passe de
normalisation les ecraserait toutes. Ce script se limite donc a ce qui est
mecaniquement sur : les lignes absentes.

Trois colonnes deduites, aucune inventee :
- titre  : `<h1 id="firstHeading">` lu dans la capture, comme
           `gw2_index_contenu_v3.py` ;
- portee : « article complet », sauf commentaire de filtrage
           `<!-- section « X » retiree a l'extraction ... -->` laisse par
           l'extraction, qui donne « article complet moins « X » ». Un suffixe
           `__<section>` dans le nom de fichier l'emporte. A relire a la main
           si la page merite une mention plus precise.
- date   : celle du commit qui a AJOUTE le fichier ; aujourd'hui s'il n'est pas
           encore commite.

Les lignes orphelines (une ligne sans fichier) sont signalees, jamais
supprimees : un fichier peut avoir ete renomme, c'est un arbitrage humain.

Usage :
    python3 gw2_index_wiki_v1.py            # simulation
    python3 gw2_index_wiki_v1.py --ecrire   # applique
"""
import datetime
import html as _html
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
INDEX = HERE / "ressources/INDEX.md"
WIKI = HERE / "ressources/wiki"
TITRE = re.compile(r'<h1[^>]*id="firstHeading"[^>]*>(.*?)</h1>', re.S)
FILTRE = re.compile(r"<!-- section « (.*?) » retiree a l'extraction")
LIGNE = re.compile(r"^\| `([^`]+\.html)` \|", re.M)
ENTETE = "## wiki/ — Guild Wars 2 Wiki (wiki.guildwars2.com)"


def titre(f):
    m = TITRE.search(f.read_text(encoding="utf-8", errors="ignore")[:80000])
    return re.sub(r"<[^>]+>", "", _html.unescape(m.group(1))).strip() if m else "?"


def portee(f):
    if "__" in f.stem:
        return f"section « {f.stem.split('__', 1)[1].replace('_', ' ')} » seule"
    m = FILTRE.search(f.read_text(encoding="utf-8", errors="ignore"))
    return f"article complet moins « {m.group(1)} »" if m else "article complet"


def date_ajout(f):
    d = subprocess.run(["git", "log", "--diff-filter=A", "-1", "--format=%ad",
                        "--date=short", "--", str(f.relative_to(HERE))],
                       cwd=HERE, capture_output=True, text=True).stdout.strip()
    return d or datetime.date.today().isoformat()


def main():
    md = INDEX.read_text(encoding="utf-8")
    i = md.index(ENTETE)
    j = md.index("\n## ", i + 1)

    # Les lignes des AUTRES tableaux (gw2efficiency/, etc.) comptent pour
    # « deja connue » mais jamais pour « orpheline » : leurs fichiers vivent
    # ailleurs, les chercher dans wiki/ ne prouve rien.
    connues = set(LIGNE.findall(md))
    du_bloc = set(LIGNE.findall(md[i:j]))
    fichiers = {f.name: f for f in sorted(WIKI.glob("*.html"))}
    manquants = sorted(set(fichiers) - connues)
    orphelines = sorted(du_bloc - set(fichiers))

    print(f"Captures : {len(fichiers)} | lignes : {len(connues)}")
    print(f"  sans ligne : {len(manquants)}")
    for n in manquants[:8]:
        print("   ", n)
    if len(manquants) > 8:
        print(f"    ... {len(manquants) - 8} autre(s)")
    if orphelines:
        print(f"  lignes sans fichier (NON retirees, a trancher a la main) : "
              f"{len(orphelines)}")
        for n in orphelines:
            print("   ", n)

    if not manquants:
        print("Tableau complet.")
        return 0
    if "--ecrire" not in sys.argv:
        print("\nSimulation. Relancer avec --ecrire pour appliquer.")
        return 0

    lignes = [f"| `{n}` | {titre(fichiers[n])} | {portee(fichiers[n])} | "
              f"{date_ajout(fichiers[n])} |" for n in manquants]
    INDEX.write_text(md[:j].rstrip("\n") + "\n" + "\n".join(lignes) + md[j:],
                     encoding="utf-8")
    print(f"\n{len(lignes)} ligne(s) ajoutee(s) a {INDEX.relative_to(HERE)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
