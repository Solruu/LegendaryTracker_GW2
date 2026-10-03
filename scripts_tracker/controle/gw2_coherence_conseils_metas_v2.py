#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Les conseils des metas disent-ils la meme chose que les champs qui calculent ?

Depuis la fusion du 03/10, horaire, chainage, recompenses et acces vivent au
catalogue a cote du conseil redige. Le filtre d'acces et les puces de priorite
lisent les CHAMPS ; le joueur lit le TEXTE. Ce controle cherche ou les deux se
contredisent :

  H  horaire  — « XX:20 », « toutes les 2h » contre offsetUTC / intervalMin
  N  chainage — une autre meta nommee avec un mot d'enchainement, absente de `next`
  A  acces    — le conseil renvoie a une meta que le filtre peut masquer
               alors que celle-ci reste visible
  R  ressource— un composant nomme dans le conseil, absent de `rewards` :
               la puce de priorite ne le verra jamais
  W  point de passage — un meme code sur deux cartes (v2)
  P  priorite — superlatif dans le texte, efficience qui dit autre chose ;
               ou efficience S sans aucune recompense declaree

Lecture seule. Ecrit COHERENCE_CONSEILS_METAS_vN.md a la racine.
"""
import glob, json, re, sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
CHAINE = re.compile(r"enchaîn|enchain|chains? into|then |ensuite|puis |→ ?next|s'enchaîne", re.I)
SUPER = re.compile(r"priorit|la plus (?:efficace|rentable|efficiente)|meilleure? (?:source|meta)|best (?:source|meta)|must[- ]do|incontournable", re.I)


def txt(v):
    if isinstance(v, dict):
        return [x for x in (v.get("fr"), v.get("en")) if isinstance(x, str)]
    return [v] if isinstance(v, str) else []


def noms(v):
    return [n for n in txt(v) if n and len(n) >= 5]


def main():
    src = max(glob.glob(str(RACINE / "gw2_sources_v*.json")),
              key=lambda p: int(re.search(r"_v(\d+)", p).group(1)))
    d = json.load(open(src, encoding="utf-8"))
    me, cc = d["meta_events"], d["craft_components"]
    nom_compo = {}
    for cid, c in cc.items():
        for n in noms(c.get("name")):
            if len(n) >= 8:
                nom_compo[n.lower()] = cid
    out = {}
    for k, m in sorted(me.items()):
        textes = []
        for f in ("tip", "resetNote", "vendor", "timer_notes"):
            textes += txt(m.get(f))
        blob = " ".join(textes)
        low = blob.lower()
        lignes = []
        # H
        o, i = m.get("offsetUTC"), m.get("intervalMin")
        if isinstance(o, int) and isinstance(i, int) and i:
            for mm in re.findall(r"XX:(\d\d)", blob):
                if i % 60 == 0 and int(mm) != o % 60:
                    lignes.append(("H", f"le texte dit XX:{mm}, le decalage donne XX:{o % 60:02d}"))
            for h in re.findall(r"(?:toutes les|every) (\d+) ?h", blob, re.I):
                if int(h) * 60 != i:
                    lignes.append(("H", f"le texte dit toutes les {h}h, l'intervalle est {i} min"))
            # Heures explicites (« 01:30 / 03:30 ») : chacune doit tomber sur
            # decalage + k * intervalle, en minutes depuis 00:00 UTC.
            for hh, mm in re.findall(r"(?<![\d:X])(\d\d):(\d\d)(?![\d])", blob):
                t = int(hh) * 60 + int(mm)
                if "UTC+1" in blob and f"{hh}h" in blob:
                    continue
                if (t - o) % i != 0:
                    lignes.append(("H", f"le texte cite {hh}:{mm}, hors de decalage {o} + k x {i} min"))
        # N, A
        nxt = set(m.get("next") or [])
        for k2, m2 in me.items():
            if k2 == k:
                continue
            cites = [n for n in noms(m2.get("name")) if n.lower() in low]
            if not cites:
                continue
            phrase = next((p for p in re.split(r"(?<=[.!?])\s+", blob) if cites[0].lower() in p.lower()), "")
            if CHAINE.search(phrase) and k2 not in nxt:
                lignes.append(("N", f"nomme `{k2}` ({cites[0]}) pour enchainer, `next` = {sorted(nxt) or 'rien'}"))
            a1, a2 = m.get("acces"), m2.get("acces")
            if a2 and json.dumps(a1, sort_keys=True) != json.dumps(a2, sort_keys=True):
                cle = lambda a: (a or {}).get("access") or (a or {}).get("saison")
                if cle(a1) != cle(a2):
                    lignes.append(("A", f"renvoie a `{k2}` ({cle(a2)}) depuis une meta {cle(a1) or 'sans condition'} : masquable seule"))
        # R
        rw = set(m.get("rewards") or [])
        vus = set()
        for n, cid in nom_compo.items():
            if cid in rw or cid in vus:
                continue
            if re.search(r"(?<![a-z])" + re.escape(n) + r"(?![a-z])", low):
                vus.add(cid)
                lignes.append(("R", f"nomme « {n} » (`{cid}`), absent de rewards"))
        # P
        eff = m.get("efficience")
        if SUPER.search(blob) and eff not in ("S", "A"):
            lignes.append(("P", f"superlatif dans le texte, efficience {eff}"))
        if eff == "S" and not rw:
            lignes.append(("P", "efficience S sans aucune recompense declaree"))
        if lignes:
            out[k] = lignes
    # W (v2) : un meme code de point de passage sur deux cartes differentes.
    # Un code designe UN point de passage : l'un des deux est une copie.
    par_code = {}
    for k, m in me.items():
        c = m.get("wpCode")
        if c:
            par_code.setdefault(c, []).append((k, (m.get("map") or {}).get("en") if isinstance(m.get("map"), dict) else m.get("map")))
    for c, us in par_code.items():
        cartes = {carte for _, carte in us if carte}
        if len(cartes) > 1:
            for k, carte in us:
                out.setdefault(k, []).append(("W", f"code {c} partage avec " + ", ".join(
                    f"`{k2}` ({c2})" for k2, c2 in us if k2 != k)))
    nums = [int(re.search(r"_v(\d+)", p).group(1)) for p in glob.glob(str(RACINE / "COHERENCE_CONSEILS_METAS_v*.md"))]
    dest = RACINE / f"COHERENCE_CONSEILS_METAS_v{(max(nums) if nums else 0) + 1}.md"
    L = [f"# Cohérence conseils / champs des métas — {Path(src).name}", "",
         "Généré par `scripts_tracker/controle/gw2_coherence_conseils_metas_v2.py`. "
         "H horaire · N chaînage · A accès · R ressource · P priorité · W point de passage.", ""]
    total = 0
    for k, ls in out.items():
        L.append(f"## `{k}`")
        for c, t in ls:
            L.append(f"- **{c}** — {t}")
            total += 1
        L.append("")
    L.insert(4, f"**{total} constat(s)** sur {len(out)} méta(s).\n")
    if "--ecrire" in sys.argv:
        for p in glob.glob(str(RACINE / "COHERENCE_CONSEILS_METAS_v*.md")):
            Path(p).unlink()
        dest.write_text("\n".join(L) + "\n", encoding="utf-8")
        print("ecrit :", dest.name)
    print("\n".join(L))


if __name__ == "__main__":
    main()
