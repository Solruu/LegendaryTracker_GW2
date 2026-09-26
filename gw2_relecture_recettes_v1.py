#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Relecture des recettes, legendaire par legendaire.

L'arbre est fait d'unites de craft qui s'assemblent vers un but final. La
question qui compte n'est donc pas « ce slug existe-t-il quelque part », mais :
en descendant depuis chaque legendaire, chaque noeud a-t-il les enfants que sa
capture lui donne, ni plus ni moins ?

Une mesure a plat repond mal. Comparer les titres d'ingredients aux cles de
`craft_components` donnait 196 composants en defaut et 171 ingredients
absents -- chiffre bruite par les pluriels (`Obsidian_Shards`), les apostrophes
encodees (`Philosopher%27s_Stone`) et les pages de redirection. On apparie donc
par apiId chaque fois qu'il existe : 591 des 601 composants en portent un, et
635 des 886 pages aussi. Le nom ne sert que de dernier recours, et un
appariement obtenu au singulier est signale comme tel plutot que compte pour
acquis.

Trois defauts distincts, qui n'appellent pas le meme travail :

  MANQUANT   la recette cite un ingredient qu'aucun composant ne represente.
             C'est un trou de l'arbre : il faut creer le composant, et sa page
             part en file si elle n'est pas au depot.
  NON_RELIE  l'ingredient EXISTE en composant, mais aucune arete `qty` ne le
             rattache a ce parent. Le cout ne remonte pas. C'est le defaut le
             plus sournois : rien ne manque a l'inventaire, seule la cascade
             est fausse.
  EN_TROP    un enfant declare que la recette ne cite pas. Parfois legitime
             (une voie alternative, un cout d'acquisition rattache au parent),
             donc signale sans jugement.

L'outil ne modifie rien. Il ecrit un rapport.

Usage : python3 gw2_relecture_recettes_v1.py [--rapport RELECTURE_RECETTES_v1.md]
        python3 gw2_relecture_recettes_v1.py --legendaire ad_infinitum
"""
import argparse
import json
import re
import sys
import unicodedata
from collections import defaultdict, deque
from pathlib import Path
from urllib.parse import unquote

HERE = Path(__file__).resolve().parent
SUFFIXES = ("", "__per_piece", "__full_set", "__per_unit", "__onetime")


def derniere(motif):
    fs = sorted(HERE.glob(motif), key=lambda p: int(re.search(r"_v(\d+)", p.name).group(1)))
    if not fs:
        sys.exit(f"aucun fichier {motif}")
    return fs[-1]


def slugifie(titre):
    """Titre wiki -> slug du depot. `Philosopher%27s_Stone` -> philosophers_stone."""
    t = unquote(str(titre))
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "_", t.lower()).strip("_")


def clef_nom(x):
    return re.sub(r"\s+", " ", unquote(str(x)).replace("_", " ")).strip().casefold()


class Resolveur:
    """Titre d'ingredient -> composant, par apiId d'abord, par nom en dernier."""

    def __init__(self, cc, index, legs=None):
        self.cc = cc
        self.legs = {}
        for lk, lv in (legs or {}).items():
            if not isinstance(lv, dict):
                continue
            self.legs[lk] = lk
            if lv.get("name"):
                self.legs.setdefault(clef_nom(lv["name"]), lk)
            if lv.get("wiki"):
                self.legs.setdefault(slugifie(lv["wiki"]), lk)
        self.par_page = {e["page"]: e for e in index}
        self.par_api = {}
        self.par_nom = {}
        self.par_slug = {}
        for cid, c in cc.items():
            self.par_slug[cid] = cid
            if isinstance(c.get("apiId"), int):
                self.par_api.setdefault(c["apiId"], cid)
            if c.get("name"):
                self.par_nom.setdefault(clef_nom(c["name"]), cid)

    def resoudre(self, titre):
        """(composant, comment) ; comment vaut None si rien ne repond."""
        s = slugifie(titre)
        page = self.par_page.get(s)
        if page and isinstance(page.get("api_id"), int) and page["api_id"] in self.par_api:
            return self.par_api[page["api_id"]], "apiId"
        if s in self.par_slug:
            return s, "slug"
        n = clef_nom(titre)
        if n in self.par_nom:
            return self.par_nom[n], "nom"
        if page and page.get("titre") and clef_nom(page["titre"]) in self.par_nom:
            return self.par_nom[clef_nom(page["titre"])], "titre de page"
        # Un ingredient peut etre un LEGENDAIRE : Eternity coute Sunrise et
        # Twilight, qui sont des cibles a part entiere, pas des composants.
        for cle in (s, n):
            if cle in self.legs:
                return self.legs[cle], "légendaire"
        # Dernier recours, signale. Deux formes de pluriel : le mot entier
        # (`Obsidian_Shards`) et la tete d'un groupe `X of Y`
        # (`Piles_of_Bloodstone_Dust` -> `pile_of_bloodstone_dust`).
        essais = []
        if s.endswith("s"):
            essais.append(s[:-1])
        m = re.match(r"^([a-z]+)s_of_(.+)$", s)
        if m:
            essais.append(f"{m.group(1)}_of_{m.group(2)}")
        for sing in essais:
            if sing in self.par_slug:
                return sing, "singulier (à confirmer)"
            p2 = self.par_page.get(sing)
            if p2 and isinstance(p2.get("api_id"), int) and p2["api_id"] in self.par_api:
                return self.par_api[p2["api_id"]], "singulier (à confirmer)"
            if sing in self.legs:
                return self.legs[sing], "légendaire (singulier)"
        return None, None


def enfants_declares(cc, cible):
    """Composants rattaches a `cible` par une arete qty, suffixes compris."""
    out = {}
    for cid, c in cc.items():
        for suf in SUFFIXES:
            q = (c.get("qty") or {}).get(cible + suf)
            if q is not None:
                out[cid] = (q, suf)
                break
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rapport", default=None, help="fichier de sortie (defaut : RELECTURE_RECETTES_vN.md)")
    ap.add_argument("--legendaire", default=None, help="n'analyser qu'un legendaire")
    args = ap.parse_args()

    src = derniere("gw2_sources_v*.json")
    data = json.loads(src.read_text(encoding="utf-8"))
    cc = data["craft_components"]
    index = json.loads((HERE / "ressources" / "INDEX_CONTENU.json").read_text(encoding="utf-8"))
    par_page = {e["page"]: e for e in index}
    res = Resolveur(cc, index, data.get("legendaries"))

    legs = data["legendaries"]
    cibles = [args.legendaire] if args.legendaire else sorted(legs)
    if args.legendaire and args.legendaire not in legs:
        sys.exit(f"legendaire inconnu : {args.legendaire}")

    # Une recette par noeud, prise sur SA page : celle du composant, sinon celle
    # du legendaire (champ `wiki`), sinon rien -- un noeud sans capture n'est pas
    # en defaut, il est simplement non relisible.
    def recette_de(node, leg_page=None):
        page = par_page.get(node) or (par_page.get(leg_page) if leg_page else None)
        if not page or not page.get("recettes"):
            return None, (page or {}).get("page")
        return page["recettes"][0].get("ingredients") or [], page["page"]

    total = defaultdict(int)
    par_leg = {}
    ing_manquants = defaultdict(set)

    for lk in cibles:
        lv = legs[lk]
        if not isinstance(lv, dict):
            continue
        leg_page = slugifie(unquote(lv.get("wiki") or lk))
        defauts = []
        vus = set()
        file_ = deque([(lk, leg_page)])
        while file_:
            node, page_hint = file_.popleft()
            if node in vus:
                continue
            vus.add(node)
            enfants = enfants_declares(cc, node)
            for e in enfants:
                if e not in vus:
                    file_.append((e, None))
            ing, page = recette_de(node, page_hint)
            if ing is None:
                if node in cc and not enfants:
                    total["sans_capture"] += 1
                continue
            # Un noeud SANS aucun enfant declare est une feuille assumee : le
            # modele a choisi de ne pas le decomposer (achat, voie alternative
            # rarement empruntee, agregat). Le signaler ingredient par
            # ingredient noierait le rapport -- obsidian_shard et mystic_clover
            # a eux seuls produisaient huit lignes pour une seule decision.
            # Une ligne, et on passe.
            if not enfants:
                defauts.append(("NON_DECOMPOSE", node, f"{len(ing)} ingrédients",
                                "", page, "feuille assumée"))
                total["non_decompose"] += 1
                continue
            attendus = {}
            for titre, qte in ing:
                cid, comment = res.resoudre(titre)
                if not cid:
                    defauts.append(("MANQUANT", node, titre, qte, page, None))
                    ing_manquants[unquote(str(titre))].add(node)
                    total["manquant"] += 1
                    continue
                attendus[cid] = (qte, comment)
                if cid not in enfants:
                    defauts.append(("NON_RELIE", node, titre, qte, page, comment))
                    total["non_relie"] += 1
            # La racine d'un legendaire porte en plus les totaux agreges de la
            # « Full material list » : ses enfants depassent legitimement sa
            # recette de Forge. On ne les compte pas en trop.
            if node == lk:
                continue
            for e, (q, suf) in sorted(enfants.items()):
                if e not in attendus and page:
                    defauts.append(("EN_TROP", node, e, q, page, suf or "direct"))
                    total["en_trop"] += 1
        par_leg[lk] = (len(vus), defauts)

    # Un composant est une unite de craft, pas une ligne par legendaire :
    # `mystic_clover` est atteint par 80 cibles et n'a qu'un seul defaut. On
    # regroupe donc par (defaut, noeud, objet) et on note qui le reclame --
    # 1 847 lignes tombent a ce que le depot compte vraiment de decisions.
    global_ = {}
    for lk, (n, defauts) in par_leg.items():
        for kind, node, quoi, qte, page, comment in defauts:
            cle = (kind, node, str(quoi))
            e = global_.setdefault(cle, {"qte": qte, "page": page, "comment": comment,
                                         "legs": set()})
            e["legs"].add(lk)

    ORDRE = {"MANQUANT": 0, "NON_RELIE": 1, "EN_TROP": 2, "NON_DECOMPOSE": 3}
    TITRES = {"MANQUANT": "Ingrédients qu'aucun composant ne représente",
              "NON_RELIE": "Ingrédients présents dans l'arbre mais non rattachés au parent",
              "EN_TROP": "Enfants déclarés que la recette ne cite pas",
              "NON_DECOMPOSE": "Nœuds ayant une recette et aucun enfant (feuilles assumées)"}
    compte = {k: sum(1 for c in global_ if c[0] == k) for k in ORDRE}

    lignes = ["# Relecture des recettes, légendaire par légendaire", "",
              f"Source : `{src.name}` — généré par `gw2_relecture_recettes_v1.py`.",
              "L'outil descend depuis chaque légendaire et compare, à chaque nœud, les",
              "enfants déclarés à la recette lue sur sa capture. Appariement par apiId",
              "d'abord (591 composants sur 601 en portent un), par nom en dernier recours,",
              "un appariement au singulier étant signalé comme à confirmer.", "",
              "Chaque défaut est compté **une fois**, avec la liste des légendaires qui le",
              "rencontrent : un composant est une unité de craft, pas une ligne par cible.", "",
              "| défaut | ce que ça veut dire | ce que ça coûte | nombre |",
              "|---|---|---|---:|",
              "| MANQUANT | la recette cite un ingrédient absent de l'arbre | le coût n'existe "
              f"nulle part | {compte['MANQUANT']} |",
              "| NON_RELIÉ | l'ingrédient existe mais aucune arête `qty` ne le rattache | le coût "
              f"existe et ne remonte pas — le plus sournois | {compte['NON_RELIE']} |",
              "| EN_TROP | enfant déclaré hors recette | souvent légitime (voie alternative, "
              f"coût d'acquisition) | {compte['EN_TROP']} |",
              "| NON_DÉCOMPOSÉ | recette lue, aucun enfant | décision de modélisation à revoir, "
              f"pas un bug | {compte['NON_DECOMPOSE']} |", ""]

    for kind in sorted(ORDRE, key=lambda k: ORDRE[k]):
        cles = [c for c in global_ if c[0] == kind]
        if not cles:
            continue
        lignes.append(f"## {TITRES[kind]} — {len(cles)}\n")
        lignes.append("| nœud | ingrédient / enfant | qté | lu sur | appariement | réclamé par |")
        lignes.append("|---|---|---:|---|---|---|")
        for cle in sorted(cles, key=lambda c: (-len(global_[c]["legs"]), c[1], c[2])):
            e = global_[cle]
            legs_ = sorted(e["legs"])
            qui = ", ".join(f"`{x}`" for x in legs_[:3])
            if len(legs_) > 3:
                qui += f" … (+{len(legs_) - 3})"
            lignes.append(f"| `{cle[1]}` | `{unquote(cle[2])}` | {e['qte']} | `{e['page']}` | "
                          f"{e['comment'] or '—'} | {qui} |")
        lignes.append("")

    if ing_manquants:
        lignes.append("## Ingrédients à créer, et qui les réclame\n")
        for ing, parents in sorted(ing_manquants.items()):
            lignes.append(f"- `{ing}` — réclamé par {', '.join('`%s`' % p for p in sorted(parents))}")
        lignes.append("")

    dest = args.rapport
    if not dest:
        n = 1
        while (HERE / f"RELECTURE_RECETTES_v{n}.md").exists():
            n += 1
        dest = f"RELECTURE_RECETTES_v{n}.md"
    (HERE / dest).write_text("\n".join(lignes) + "\n", encoding="utf-8")
    print("defauts distincts — " + " | ".join(f"{k} {v}" for k, v in compte.items()))
    print(f"occurrences brutes — manquants {total['manquant']} | non relies "
          f"{total['non_relie']} | en trop {total['en_trop']} | non decomposes "
          f"{total['non_decompose']}")
    print(f"ingredients distincts a creer : {len(ing_manquants)}")
    print(f"ecrit : {dest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
