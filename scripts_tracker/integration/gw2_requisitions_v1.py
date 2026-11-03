#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Requisitions et « The Art of … » : couts d'etape des collections gen1 / gen2.

Usage : python3 scripts_tracker/integration/gw2_requisitions_v1.py SRC DST

Le reste du lot W10 (24/10) : 72 etapes « echange a un maitre artisan », sans
cout faute de wiki. Chaque page (ressources/wiki/<etape>.html, Acquisition)
dit ce qu'on remet :
- une requisition : 250 armes basiques (Basic Mithril Axe…) ou 250 pieces
  (Mithril Dagger Blade, Large Elder Haft, Thick String…) ;
- un livre « The Art of … » : les pieces de chaque palier, du bronze (ou bois
  vert, cuir brut) au Deldrimor (ou Spiritwood, Elonian), 5 ou 10 de chaque
  et 1 a 5 du dernier palier.
Deux pages servent deux collections a des quantites differentes (« For The
Dreamer, trade 250 … For Chuka and Champawat, trade 175 / 150 … ») : chaque
collection prend la sienne.

Identite et recettes des 223 objets : nom de la page -> id par la base
semantique du wiki (« Has game id »), puis /v2/items et /v2/recipes, lus le
03/11 (ressources/api/api_requisitions_armes_20261103.json). Decomposition par
la regle C7 : une recette de composant devient des aretes, un raffinage
(lingot, planche, carre de cuir, lingot de Deldrimor…) reste une feuille. Un
objet deja present (meme apiId) est repris tel quel.

Les pages sont lues par parseurs/gw2_parse_requisitions_v1 (texte de la
section Acquisition) -> ressources/api/requisitions_lues_20261103.json.
"""
import json, re, sys, unicodedata
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
J = "2026-11-03"
WK = "ressources/wiki/"
AP = "ressources/api/api_requisitions_armes_20261103.json"
A = json.loads(Path(AP).read_text(encoding="utf-8"))
IT, RC, RS, IDS = A["items"], A["recipes"], A["rsearch"], A["ids"]
# noms des matieres brutes des raffinages (minerais, rondins, sections de cuir)
NB = json.loads(Path("ressources/api/api_noms_minerais_20261103.json").read_text(encoding="utf-8"))["items"]
REQ = json.loads(Path("ressources/api/requisitions_lues_20261103.json").read_text(encoding="utf-8"))["etapes"]
VARIANTES = {  # page -> {legendaire: index de la quantite dans la page}
    "Elder Short Bow Stave Requisition": {"gen1_the_dreamer": 0, "gen2_chuka_and_champawat": 1},
    "Thick Short Bow String Requisition": {"gen1_the_dreamer": 0, "gen2_chuka_and_champawat": 1},
}


def slug(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"['’]", "", t)
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", t.lower())).strip("_")


par_api = {c["apiId"]: k for k, c in cc.items() if isinstance(c.get("apiId"), int) and c["apiId"] > 100}
crees = []


def arete(enfant, parent, n):
    c = cc[enfant]
    q = c.setdefault("qty", {})
    q[parent] = q.get(parent, 0) + n
    nf = c.setdefault("needed_for", [])
    if isinstance(nf, list) and parent not in nf:
        nf.append(parent)


def nom_de(i):
    if str(i) in IT:
        return IT[str(i)][0]
    if str(i) in NB:
        return NB[str(i)]
    k = par_api.get(int(i))
    n = (cc.get(k) or {}).get("name") if k else None
    return (n.get("en") if isinstance(n, dict) else n) or f"objet {i}"


def comp(x):
    """Composant de l'objet x : existant (apiId), sinon cree et decompose."""
    x = int(x)
    if x in par_api:
        return par_api[x]
    nom, typ, rar, lie = IT[str(x)]
    k = slug(nom)
    while k in cc:
        k += f"_{x}"
    par_api[x] = k
    rs = [RC[str(r)] for r in RS.get(str(x), []) if str(r) in RC]
    r = rs[0] if rs else None
    if r:
        rtype, sortie, n, metiers, niveau, drap, ing = r
        txt = " + ".join(f"{q} {nom_de(i)}" for i, q in ing)
        src = {"type": "craft", "verified": True, "checked": J, "ref": f"{AP} (recette {RS[str(x)][0]})",
               "tip": {"fr": f"{metiers} {niveau} : {txt}" + (f" (donne {n})" if n > 1 else "") + ".",
                       "en": f"{metiers} {niveau}: {txt}" + (f" (makes {n})" if n > 1 else "") + "."}}
    else:
        src = {"type": "unknown", "verified": True, "checked": J, "ref": f"{AP} (/v2/items {x}, sans recette)",
               "tip": {"fr": "Sans recette à l'API ; voie à lire sur sa page.", "en": "No recipe in the API; route to read on its page."}}
    raffine = bool(r) and str(r[0]).startswith("Refinement")
    cc[k] = {"name": nom, "apiId": x, "kind": "refined" if raffine else ("intermediate" if r else "material"),
             "farmable": True, "qty": {}, "needed_for": [], "sources": [src],
             "verified": True, "checked": J, "ref": AP}
    if lie:
        cc[k]["account_bound"] = True
    crees.append(k)
    if r and not raffine:
        rtype, sortie, n, metiers, niveau, drap, ing = r
        if n > 1:
            cc[k]["lot"] = n
        for i, q in ing:
            arete(comp(i), k, q)
    return k


poses = []
for l, L in d["legendaries"].items():
    if not l.startswith(("gen1_", "gen2_")):
        continue
    for ck, col in (L.get("collections") or {}).items():
        for st in col.get("items", []):
            w = st.get("wiki")
            if not w:
                continue
            page = slug(w.replace("_", " ").replace("%27", "'"))
            if page not in REQ:
                continue
            titre, lignes = REQ[page]["titre"], REQ[page]["items"]
            if titre in VARIANTES:
                lignes = [lignes[VARIANTES[titre][l]]]
            assert not st.get("cost"), (l, ck, st["bit"])
            cout = {}
            for q, nom in lignes:
                k = comp(IDS[nom])
                cout[k] = cout.get(k, 0) + q
            st["cost"] = cout
            st["cost_ref"] = f"{WK}{page}.html, Acquisition ; recettes {AP}"
            poses.append((l, ck, st["bit"], titre, sum(cout.values())))

for p in poses:
    print("etape", *p)
print(len(poses), "etapes,", len(crees), "composants crees")
d["_meta"]["last_updated"] = J
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("ecrit", DST)
