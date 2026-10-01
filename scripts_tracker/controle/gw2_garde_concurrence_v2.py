#!/usr/bin/env python3
"""Garde-fou de concurrence entre sessions.

Plusieurs conversations travaillent sur ce depot en parallele. Le 24/09/2026,
trois commits d'une autre session se sont intercales entre deux passes de
celle-ci, en vingt minutes, sans que rien ne le signale : l'audit `v49` a ete
decouvert au moment de s'en servir, alors qu'on croyait le depot a `v47`.

Git protege deja du pire : un `push` non force est refuse quand l'historique a
avance. Ce qu'il ne protege pas, c'est le TRAVAIL FAIT ENTRE-TEMPS — une passe
entiere ecrite sur une base perimee, a refaire.

Ce script se lance DEUX FOIS :

    python3 gw2_garde_concurrence_v2.py            # juste apres le clone
    python3 gw2_garde_concurrence_v2.py --avant-push   # juste avant de pousser

Il ne modifie rien. Il sort en 1 quand il faut s'arreter.
"""
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]  # racine du depot
# Les familles versionnees du depot : un seul fichier par famille doit exister.
FAMILLES = re.compile(r"^(gw2_[a-z0-9_]+?)_v(\d+)\.(py|json|jsx)$")


def git(*args):
    r = subprocess.run(["git", "-C", str(HERE), *args],
                       capture_output=True, text=True)
    return r.returncode, r.stdout.strip(), r.stderr.strip()


def versions(ref=None):
    """{famille: (numero, nom)} pour le repertoire courant ou une reference git."""
    # Recursif des deux cotes depuis le rangement du 30/09 : les outils sont
    # dans scripts_tracker/<domaine>/, et `ls-tree` sans -r ne rend que le
    # premier niveau. Comparer un niveau ici a un niveau en amont ne comparait
    # plus rien.
    if ref is None:
        noms = [p.name for p in HERE.rglob("*")
                if p.is_file() and ".git" not in p.relative_to(HERE).parts]
    else:
        code, out, _ = git("ls-tree", "-r", "--name-only", ref)
        if code:
            return {}
        noms = [l.rsplit("/", 1)[-1] for l in out.splitlines()]
    out = {}
    for n in noms:
        m = FAMILLES.match(n)
        if m:
            fam, num = m.group(1), int(m.group(2))
            if fam not in out or num > out[fam][0]:
                out[fam] = (num, n)
    return out


def main():
    avant_push = "--avant-push" in sys.argv
    code, _, err = git("fetch", "-q", "origin", "main")
    if code:
        print(f"ECHEC du fetch : {err}")
        return 1

    _, local, _ = git("rev-parse", "HEAD")
    _, distant, _ = git("rev-parse", "origin/main")
    _, base, _ = git("merge-base", "HEAD", "origin/main")

    if local == distant:
        print("base a jour : HEAD == origin/main")
    elif base == local:
        code, out, _ = git("log", "--oneline", "HEAD..origin/main")
        n = len(out.splitlines())
        print(f"RETARD : {n} commit(s) sont arrives sur origin/main depuis ce clone.")
        for ligne in out.splitlines():
            print(f"   {ligne}")
        print("\nUne autre session a pousse. NE PAS fusionner : recloner et")
        print("rejouer la passe sur la base a jour. Un merge melerait deux")
        print("lignees de versions et laisserait deux fichiers par famille.")
        return 1
    else:
        print("DIVERGENCE : ce clone et origin/main ont chacun des commits propres.")
        print("Recloner et rejouer la passe. Ne jamais forcer le push.")
        return 1

    # Collision de numerotation : une famille ne doit porter qu'un fichier, et
    # le numero qu'on s'apprete a creer ne doit pas exister en amont.
    locales, amont = versions(), versions("origin/main")
    souci = 0
    for fam, (num, nom) in sorted(locales.items()):
        if fam in amont and amont[fam][0] > num:
            print(f"COLLISION : {fam} est en v{num} ici et v{amont[fam][0]} en amont.")
            souci += 1
    # Depuis le rangement du 30/09, les outils versionnes vivent dans
    # scripts_tracker/<domaine>/. Un parcours non recursif de la racine ne
    # voyait plus que trois familles sur cinquante : la garde contre le doublon
    # de version etait devenue decorative sans rien dire. On descend donc dans
    # l'arborescence, en ecartant ce qui n'est pas du code du depot.
    IGNORES = {".git", "docs", "node_modules", "__pycache__"}
    doublons = {}
    for p in HERE.rglob("*"):
        if not p.is_file():
            continue
        if any(part in IGNORES for part in p.relative_to(HERE).parts):
            continue
        m = FAMILLES.match(p.name)
        if m:
            doublons.setdefault(m.group(1), []).append(str(p.relative_to(HERE)))
    for fam, noms in sorted(doublons.items()):
        if len(noms) > 1:
            print(f"DOUBLON : {fam} porte {len(noms)} fichiers — {', '.join(sorted(noms))}")
            souci += 1
    if souci:
        return 1
    print(f"{len(locales)} familles versionnees, une seule version chacune.")
    if avant_push:
        print("Feu vert pour pousser.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
