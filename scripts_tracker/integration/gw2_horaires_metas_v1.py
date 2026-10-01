#!/usr/bin/env python3
"""Aligne les decalages de metas sur le widget d'horaires du wiki.

Deux passes dans l'ordre impose par le projet : la base editoriale d'abord, le
JSX en dernier. A lancer depuis la racine du depot, `--ecrire` pour produire les
fichiers.

    python scripts_tracker/integration/gw2_horaires_metas_v1.py
    python scripts_tracker/integration/gw2_horaires_metas_v1.py --ecrire

## D'ou viennent les valeurs

`ressources/widget/event_timer_data.json` est la source du tableau d'horaires
du wiki (`Widget:Event timer/data.json`). Le decalage d'un segment est la
position de sa premiere occurrence dans la phase repetee, modulo l'intervalle ;
`scripts_tracker/controle/gw2_confronte_horaires_v1.py` fait le calcul et la
confrontation.

La methode est validee sur **quatorze points independants** :

- douze accords exacts avec nos valeurs existantes, sur des nombres non
  triviaux (105, 100, 80, 60, 30, 5, 0, et l'intervalle 180) ;
- une **observation en jeu** d'Antoine le 01/10/2026 : « Challenges a 22h45,
  Octovine a 23h00, rebelotte 00h45/01h00 ». Les deux horaires tombent
  exactement sur les decalages 45 et 60 que le widget annonce, et ce quelle que
  soit la convention d'heure : 22h45 comme 20h45 UTC sont de la classe « heure
  paire + 45 », 23h00 comme 21h00 de la classe « heure impaire + 00 » ;
- le **JSX portait deja 90 pour `conv`** quand `gw2_sources` portait 30. Sur ce
  point le widget et la base editoriale s'accordaient contre le JSON : c'etait
  une erreur de report dans les sources, pas une lecture.

## Les corrections

| cle | segment | sources | JSX | cible | fondement |
|---|---|---:|---:|---:|---|
| ab | Battle in Tarir (Octovine) | 45 | 45 | 60 | observation en jeu |
| de | Junundu Rising | 30 | 30 | 90 | widget |
| ds | Start advancing on the Blighting Towers | 30 | 30 | 90 | widget |
| er | The Path to Ascension: Augury Rock | 60 | 60 | 90 | widget |
| conv | Outer Nayos | 30 | **90** | 90 | widget + JSX |

`ab` est d'une autre nature : notre 45 etait le decalage du segment
**« Challenges »**, celui qui precede immediatement l'Octovine. Bon evenement,
mauvais segment.

Les trois autres corrections du widget ne correspondent a **aucun** segment de
leur evenement, donc ce ne sont pas des lectures differentes mais valides de la
meme donnee -- nos valeurs ne designaient rien :

- `de` : les segments sont a 60, 80 et 90 ; 30 n'existe pas.
- `ds` : un seul segment a horaire stable, a 90 ; 30 n'existe pas.
- `er` : a 15, 90 et 115 ; 60 n'existe pas.

Trois des quatre ecarts valaient exactement −60, ce qui ressemble a une lecture
en UTC+1 plutot qu'en UTC — hypothese, pas conclusion, puisque `er` etait a −30
et ne la suit pas.

## Pourquoi le JSX aussi

`meta_events` de `gw2_sources` et le tableau `metas` du JSX portent **tous
deux** les decalages : 36 `offsetUTC` en dur dans le JSX. Corriger le seul JSON
laisserait l'affichage sur l'ancienne valeur et les deux chemins en desaccord.
Aucune regle de l'audit ne couvre aujourd'hui cette comparaison — a signaler.
"""
import glob
import json
import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]  # racine du depot

# cle -> (valeur attendue avant, valeur cible, pourquoi)
CORRECTIONS = {
    "ab": (45, 60, "Battle in Tarir (Octovine) — observation en jeu 01/10"),
    "conv": (30, 90, "Outer Nayos — widget (le JSX portait deja 90)"),
    "de": (30, 90, "Junundu Rising — widget"),
    "ds": (30, 90, "Start advancing on the Blighting Towers — widget"),
    "er": (60, 90, "The Path to Ascension: Augury Rock — widget"),
}


def derniere(motif, extraire=r"_v(\d+)\."):
    fs = glob.glob(str(RACINE / motif))
    if not fs:
        return None, None
    f = max(fs, key=lambda p: int(re.search(extraire, Path(p).name).group(1)))
    return Path(f), int(re.search(extraire, Path(f).name).group(1))


def passe_sources(ecrire):
    actuel, version = derniere("gw2_sources_v*.json")
    if not actuel:
        print("[1/2] aucun gw2_sources_v*.json")
        return None
    suivant = RACINE / f"gw2_sources_v{version + 1}.json"
    data = json.load(open(actuel, encoding="utf-8"))
    metas = data.get("meta_events") or {}

    faits, refus = [], []
    for cle, (avant, apres, pourquoi) in CORRECTIONS.items():
        m = metas.get(cle)
        if not isinstance(m, dict):
            refus.append(f"{cle} : absent de meta_events")
            continue
        val = m.get("offsetUTC")
        if val == apres:
            refus.append(f"{cle} : deja a {apres}")
            continue
        if val != avant:
            # Ne pas corriger a l'aveugle une valeur qui a bouge depuis le
            # releve : la refuser et la signaler vaut mieux que l'ecraser.
            refus.append(f"{cle} : attendu {avant}, trouve {val} — non touche")
            continue
        m["offsetUTC"] = apres
        faits.append(f"{cle} : {avant} -> {apres}  ({pourquoi})")

    print(f"[1/2] {actuel.name} -> {suivant.name}"
          f"{'' if ecrire else '   (essai a blanc)'} : "
          f"{len(faits)} correction(s), {len(refus)} refus")
    for f in faits:
        print("      ", f)
    for r in refus:
        print("       REFUS", r)

    if ecrire and faits:
        if suivant.exists():
            sys.exit(f"{suivant.name} existe deja — ne rien ecraser")
        with open(suivant, "w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, indent=2)
        print(f"       ecrit : {suivant.name}")
    return suivant


def passe_jsx(ecrire):
    actuel, version = derniere("gw2_legendary_tracker_v*.jsx", r"_v(\d+)\.jsx$")
    if not actuel:
        print("[2/2] aucun gw2_legendary_tracker_v*.jsx")
        return None
    suivant = RACINE / f"gw2_legendary_tracker_v{version + 1}.jsx"
    texte = open(actuel, encoding="utf-8").read()

    faits, refus = [], []
    for cle, (avant, apres, _) in CORRECTIONS.items():
        # Portee : l'entree de cette cle seulement. `offsetUTC: 30` existe pour
        # plusieurs metas, dont `td` qui est juste — un remplacement global
        # casserait les bonnes valeurs.
        motif = re.compile(
            r'(\{ id: "' + re.escape(cle) + r'",.{0,4000}?offsetUTC:\s*)(-?\d+)',
            re.S)
        m = motif.search(texte)
        if not m:
            refus.append(f"{cle} : entree ou offsetUTC introuvable dans le JSX")
            continue
        val = int(m.group(2))
        if val == apres:
            refus.append(f"{cle} : deja a {apres}")
            continue
        if val != avant:
            refus.append(f"{cle} : attendu {avant}, trouve {val} — non touche")
            continue
        texte = texte[:m.start(2)] + str(apres) + texte[m.end(2):]
        faits.append(f"{cle} : {avant} -> {apres}")

    print(f"[2/2] {actuel.name} -> {suivant.name}"
          f"{'' if ecrire else '   (essai a blanc)'} : "
          f"{len(faits)} correction(s), {len(refus)} refus")
    for f in faits:
        print("      ", f)
    for r in refus:
        print("       REFUS", r)

    if ecrire and faits:
        if suivant.exists():
            sys.exit(f"{suivant.name} existe deja — ne rien ecraser")
        open(suivant, "w", encoding="utf-8", newline="").write(texte)
        print(f"       ecrit : {suivant.name}")
    return suivant


def main():
    ecrire = "--ecrire" in sys.argv
    passe_sources(ecrire)
    passe_jsx(ecrire)
    if not ecrire:
        print("\nRelancer avec --ecrire pour produire les fichiers.")
        return
    print("\nLes anciennes versions restent en place ; git garde l'historique.")
    print("Ensuite : audit (doit rester a 70), puis regeneration du HTML.")
    print("Attention : gw2_build_html_v2.py a pour defauts "
          "`gw2_legendary_tracker.jsx` et `.html`, sans version — ces fichiers "
          "n'existent plus. Lui passer --jsx et --out explicitement.")


if __name__ == "__main__":
    main()
