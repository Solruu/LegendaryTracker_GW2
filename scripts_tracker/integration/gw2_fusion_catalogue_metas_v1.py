#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
§ 12 : le catalogue des metas devient la SEULE table. Passe unique, 03/10/2026.

Le JSX portait 20 tableaux `metas:` — 39 entrees, chacune recopiant horaire,
point de passage, conseil — pendant que `meta_events` portait le meme fait pour
26 d'entre elles. Deux tables tenues a la main, et la confrontation champ par
champ (DETTE § CN) a montre qu'elles divergeaient deja.

Ce script lit le JSX v241 (le dernier a porter ses tableaux) et les sources,
et ecrit la version suivante des sources ou chaque entree du JSX a sa place au
catalogue. Le JSX, lui, ne garde que des listes de cles : il est reecrit par la
meme passe (`--jsx-out`).

Arbitrages d'Antoine (03/10/2026), appliques ici et nulle part ailleurs :

1. `map` (ou) + `name` (quoi). `subname` disparait : ses deux usages se
   contredisaient d'une entree a l'autre, et dans les sources il portait un
   LIEU (« Wyvern Matriarch », « 4 lanes »).
2. Le conseil (`tip`) des sources l'emporte ; `resetNote` garde l'info du coffre.
3. `wpCode` de `ew` : la valeur AFFICHEE (JSX) est gardee, l'autre est au
   backlog. Meme regle pour `zak` / `obs_spider`, ecart trouve par cette passe.
4. `nk -> ew` : en attente d'explication. L'affichage actuel (aucun chainage)
   est garde ; la valeur retiree est notee dans DETTE § CO pour la restituer.
5. `shackles` : 25 minutes, celle du widget.

Six metas portaient deux cles — une par legendaire. Une seule reste : l'horaire
est le meme, verifie champ par champ avant fusion (DETTE § CO).

Toute divergence non listee ci-dessus fait echouer le script : un arbitrage ne
se devine pas.
"""
import json, re, subprocess, sys, argparse
from collections import OrderedDict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]

# Cle d'un doublon -> cle canonique du catalogue.
ALIAS = {"obs_sw": "sw", "obs_am": "am", "obs_conv_mb": "mb",
         "obs_conv_on": "conv", "titanic": "bn", "obs_spider": "zak"}

# Ou est la carte, ou est la meta, quand la convention du JSX s'inverse ou ne
# s'applique pas. Chaque valeur est prise dans les textes existants : "N" = le
# `name` du JSX, "S" = son `subname`, "cat" = la `map` deja au catalogue,
# "N+S" = les deux joints (le second est un rendement, pas un lieu), None = pas
# de carte.
SIDES = {
    "conv": ("cat", "N"), "mb": ("cat", "N"),
    "hammerhart": ("S", "N"), "weald": ("S", "N"), "shackles": ("S", "N"),
    "mistburned": (None, "N+S"), "adinf_dailies": (None, "N+S"),
    "adinf_cms": (None, "N+S"), "adinf_kelvei": ("S", "N"),
}
DEFAUT = ("N", "S")

# Champs dont la valeur du catalogue l'emporte (sources, ou arbitrage 2).
CATALOGUE_GAGNE = {"offsetUTC", "intervalMin", "durationMin", "tip"}
# Champs dont la valeur affichee (JSX) l'emporte, arbitrage 3.
JSX_GAGNE = {("ew", "wpCode"), ("zak", "wpCode"), ("zak", "waypoint")}
# Ecarts de forme, pas de valeur.
IGNORES = {"next", "timerNote", "isTimeless", "nextDelayMin"}

EXTRACT = r"""
const fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');
const out=[];const re=/\n(\s*)metas: \[/g;let m;
while((m=re.exec(s))){let i=m.index+m[0].length-1,d=0,j=i;
 for(;j<s.length;j++){const c=s[j];if(c==='['||c==='{')d++;else if(c===']'||c==='}'){d--;if(d===0)break;}
  else if(c==='"'||c==="'"||c==='`'){const q=c;j++;while(s[j]!==q){if(s[j]==='\\')j++;j++;}}}
 out.push({start:i,end:j+1,arr:eval('('+s.slice(i,j+1)+')')});}
process.stdout.write(JSON.stringify(out));
"""


def en(v):
    return v.get("en") if isinstance(v, dict) else v


def joint(a, b):
    if isinstance(a, dict) or isinstance(b, dict):
        a = a if isinstance(a, dict) else {"fr": a, "en": a}
        b = b if isinstance(b, dict) else {"fr": b, "en": b}
        return {k: f"{a.get(k)} — {b.get(k)}" for k in ("fr", "en")}
    return f"{a} — {b}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--jsx", required=True)
    ap.add_argument("--src-out")
    ap.add_argument("--jsx-out")
    a = ap.parse_args()

    src = json.loads((RACINE / a.src).read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    me = src["meta_events"]
    texte = (RACINE / a.jsx).read_text(encoding="utf-8")
    blocs = json.loads(subprocess.run(["node", "-e", EXTRACT, str(RACINE / a.jsx)],
                                      capture_output=True, text=True, check=True).stdout)
    retires = {}

    # 1. Doublons de cles DANS le catalogue : fusion sur la canonique.
    for alias, canon in ALIAS.items():
        if alias in me and canon in me:
            for f, v in me[alias].items():
                if me[canon].get(f) in (None, [], "") and v not in (None, [], ""):
                    me[canon][f] = v
            retires[alias] = me.pop(alias)

    # 2. Chaque entree du JSX rejoint son entree de catalogue.
    divergences, ecarts_doublons = [], []
    for b in blocs:
        for e in b["arr"]:
            k = ALIAS.get(e["id"], e["id"])
            cat = me.setdefault(k, OrderedDict())
            mside, nside = SIDES.get(e["id"], SIDES.get(k, DEFAUT))
            val = {"N": e.get("name"), "S": e.get("subname"), "cat": cat.get("map"), None: None}
            nom = joint(e.get("name"), e.get("subname")) if nside == "N+S" else val[nside]
            carte = val[mside]
            if e["id"] == k:          # l'entree canonique fixe le nom affiche
                cat["name"] = nom
                if carte is not None:
                    cat["map"] = carte
                else:
                    cat.pop("map", None)
            for f, v in e.items():
                if f in ("id", "name", "subname") or f in IGNORES:
                    continue
                cv = cat.get(f)
                if cv is None:
                    cat[f] = v
                elif json.dumps(cv, sort_keys=True) != json.dumps(v, sort_keys=True):
                    if (k, f) in JSX_GAGNE:
                        retires.setdefault(f"{k}.{f}", cv)
                        cat[f] = v
                        continue
                    if e["id"] != k:
                        # Copie d'un doublon (onglet Obsidienne, Orrax) : la
                        # canonique, plus complete, l'emporte ; l'ecart est dit.
                        ecarts_doublons.append((e["id"], f, cv, v))
                        continue
                    if f in CATALOGUE_GAGNE:
                        continue
                    if (k, f) in JSX_GAGNE:
                        retires.setdefault(f"{k}.{f}", cv)
                        cat[f] = v
                        continue
                    divergences.append((e["id"], f, cv, v))
            if e.get("isTimeless"):
                cat["isTimeless"] = True
                for f in ("offsetUTC", "intervalMin", "durationMin"):
                    cat.pop(f, None)
            nxt = e.get("next")
            # Le chainage d'une copie ne s'impose pas a la canonique.
            if nxt is not None and e["id"] == k:
                cat["next"] = [ALIAS.get(nxt, nxt)]
            if "nextDelayMin" in e and cat.get("nextDelayMin") is None:
                cat["nextDelayMin"] = e["nextDelayMin"]
            if e.get("timerNote") and not cat.get("timer_notes"):
                cat["timer_notes"] = e["timerNote"]

    # Le plafond ecrit en prose dans le conseil d'une ferme doit pointer vers la
    # cadence structuree qui le porte (regle de l'audit, qui ne voyait pas ces
    # textes tant qu'ils vivaient dans le JSX). Les deux composants portent deja
    # exactement « 50 noeuds par compte et par jour ».
    for k, cible in (("lw4_istan", "volatile_magic"), ("lw4_dragonfall", "mistborn_mote")):
        if k in me:
            me[k]["cadence_ref"] = cible

    # Les vendeurs de karma des cartes LW3 : « 5/jour/perso » ecrit dans le
    # conseil, structure nulle part. Le poser sur le COMPOSANT changerait les
    # delais projetes sans source — c'est a Antoine de le trancher. En
    # attendant, la prose est remontee en cadence sur la ferme elle-meme, ou
    # aucun calcul ne la lit, marquee non verifiee.
    VENDEURS_LW3 = {"eb": "Seimur Oxbone", "dm": "Nesa", "ld": "Noran"}
    for k, pnj in VENDEURS_LW3.items():
        if k in me and not me[k].get("cadence"):
            me[k]["cadence"] = {"sources": [OrderedDict([
                ("label", {"fr": f"Vendeur {pnj} — contre karma", "en": f"Vendor {pnj} — for karma"}),
                ("period", "day"), ("cap", 5), ("per_character", True),
                ("ref", "conseil editorial du JSX v241, remonte tel quel — non source"),
                ("verified", False), ("checked", "2026-10-03")])]}

    # Arbitrage 4 : nk garde l'affichage actuel.
    if me.get("nk", {}).get("next"):
        retires["nk.next"] = (me["nk"]["next"], me["nk"].get("nextDelayMin"))
        me["nk"]["next"] = []
        me["nk"]["nextDelayMin"] = None
    # `next` : toujours une liste de cles canoniques.
    for k, m in me.items():
        n = m.get("next")
        if isinstance(n, str):
            m["next"] = [n]
        if isinstance(m.get("next"), list):
            m["next"] = [ALIAS.get(x, x) for x in m["next"]]

    # Le catalogue n'a plus de `subname`. Celles qui ne venaient d'aucune entree
    # du JSX (gy, in) : la carte est deja dans `map` ; un reste qui n'est pas la
    # carte rejoint le nom.
    for k, m in me.items():
        sn = m.pop("subname", None)
        carte_en = en(m.get("map")) or ""
        if isinstance(sn, str) and carte_en and sn.startswith(carte_en + " — "):
            sn = sn[len(carte_en) + 3:]
        if sn is not None and en(sn) != en(m.get("map")) and k not in {ALIAS.get(e["id"], e["id"]) for b in blocs for e in b["arr"]}:
            m["name"] = joint(m.get("name"), sn)

    if divergences:
        print("DIVERGENCES NON ARBITREES :")
        for d in divergences:
            print("  ", d)
        sys.exit(1)

    print("ecarts des copies de doublons (la canonique l'emporte) :")
    for d in ecarts_doublons:
        print(f"   {d[0]:12} {d[1]:11} garde {json.dumps(d[2], ensure_ascii=False)[:60]} | copie {json.dumps(d[3], ensure_ascii=False)[:60]}")
    print(f"catalogue : {len(me)} metas ; doublons fusionnes : {sorted(x for x in retires if '.' not in x)}")
    print("valeurs retirees (a restituer si besoin) :")
    for x, v in retires.items():
        if "." in x:
            print(f"   {x} = {json.dumps(v, ensure_ascii=False)}")

    if a.src_out:
        (RACINE / a.src_out).write_text(json.dumps(src, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if a.jsx_out:
        # Les positions rendues par node comptent en unites UTF-16 : un emoji
        # hors plan de base en vaut deux. On decoupe donc en UTF-16, sinon
        # chaque remplacement glisse d'un cran par emoji qui le precede.
        u = texte.encode("utf-16-le")
        for b in reversed(blocs):
            cles = []
            for e in b["arr"]:
                k = ALIAS.get(e["id"], e["id"])
                if k not in cles:
                    cles.append(k)
            neuf = ("[" + ", ".join(f'"{c}"' for c in cles) + "]").encode("utf-16-le")
            u = u[:2 * b["start"]] + neuf + u[2 * b["end"]:]
        (RACINE / a.jsx_out).write_text(u.decode("utf-16-le"), encoding="utf-8")
        print("JSX : tableaux remplaces par des listes de cles")


if __name__ == "__main__":
    main()
