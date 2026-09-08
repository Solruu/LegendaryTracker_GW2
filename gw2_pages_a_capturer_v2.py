#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recalcule la file de captures wiki depuis les sources et l'index de contenu.

La version precedente de PAGES_A_CAPTURER.md etait ecrite a la main sur
gw2_sources_v223. Une file ecrite a la main vieillit en silence : elle continue
de reclamer des pages deja capturees et n'a jamais celles que la derniere passe
a rendues necessaires. Elle est donc calculee ici, a chaque fois, depuis l'etat
reel des sources et de `ressources/INDEX_CONTENU.json`.

Rien n'est reclame sans avoir ete cherche d'abord dans l'index. C'est la regle
qui a coute quatre fausses alertes : declarer un besoin bloquant pour une donnee
qui dormait dans une capture au depot.

Cinq familles, dans l'ordre de ce qu'elles debloquent :

0. LES TROUS DE L'ARBRE. Un composant qui a des enfants dans la donnee mais ni
   boite Recipe ni cout vendeur au depot : l'arbre sait qu'il faut le
   fabriquer, il ne sait pas avec quoi. C'est la seule famille qui empeche le
   calcul de bas en haut, et donc la seule vraiment bloquante. Les 197 autres
   composants sans recette n'en ont pas parce qu'il n'y en a pas : ce sont des
   feuilles qu'on farme ou qu'on achete.

1. Les tables « Full material list » manquantes. Une cible qui porte des couts
   a plat sans que sa page soit capturee avec sa table, c'est un arbre qui ne
   peut pas se deplier faute de savoir ce qu'il contient.
2. Les composants cites dans ARBITRAGES.md dont la page n'est pas au depot.
   Leur boite Recipe et leur table vendeur tranchent une partie des 181
   desaccords.
3. Les composants sans apiId ET sans page : quantite juste, identite inconnue,
   donc colonne « possede » vide dans l'interface.
4. Les collections sans etapes. ATTENTION : un succes n'a pas toujours de page
   a lui. « Incursive Investigation: Infinite Recursion » est une LIGNE de la
   page de categorie « Incursive Investigation », pas un article ; « Helping
   Hylek: Kill Krait » est un compteur de kills sans etapes par nature, et le
   restera. Demander leur page fait chercher des articles qui n'existent pas.
   Aucune URL n'est donc sortie pour cette famille : ces succes vivent dans le
   meta global, pas dans un article. La section reste, parce que la liste des
   collections incompletes est utile ; mais elle ne demande plus rien a
   capturer, elle dit ou lire.

Sortie double : `PAGES_A_CAPTURER.md` pour la lecture, `PAGES_A_CAPTURER.txt`
pour l'automatisation — une URL par ligne, rien d'autre, aucun en-tete.
"""
import json
import re
import unicodedata
from urllib.parse import quote, unquote
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = max(HERE.glob("gw2_sources_v*.json"), key=lambda p: int(p.stem.split("_v")[-1]))
WIKI = "https://wiki.guildwars2.com/wiki/"

d = json.load(open(SRC, encoding="utf-8"))
cc = d["craft_components"]
legs = d["legendaries"]
idx = {r["page"]: r for r in json.load(open(HERE / "ressources/INDEX_CONTENU.json",
                                           encoding="utf-8"))}


def slug(titre):
    """Nom de fichier de capture attendu pour un titre de page."""
    # L'apostrophe SAUTE, elle ne devient pas un separateur : la capture de
    # « Aurene's Argument » est nommee aurenes_argument, pas aurene_s_argument.
    # Traiter l'apostrophe comme un separateur faisait redemander seize pages
    # deja au depot.
    t = unicodedata.normalize("NFKD", titre).encode("ascii", "ignore").decode()
    t = re.sub(r"['\u2019]", "", t)
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", t.lower())).strip("_")


def en(v):
    return (v.get("en") or v.get("fr")) if isinstance(v, dict) else v


def titre_composant(cid):
    c = cc.get(cid, {})
    if c.get("wiki"):
        return lisible(c["wiki"])
    t = en(c.get("name")) or cid.replace("_", " ").title()
    # « Olmakhan Bandolier (chaine) » : la parenthese est une precision ajoutee
    # par la donnee, pas un homonyme du wiki. Les desambiguisations du wiki sont
    # en anglais ; celle-ci porte un accent, donc elle vient de nous.
    m = re.search(r"\s*\(([^)]*)\)\s*$", t)
    if m and any(ord(ch) > 127 for ch in m.group(1)):
        t = t[:m.start()]
    return t.strip()


INCONNUES = set()


def lisible(t):
    """Le champ `wiki` porte parfois une forme d'URL — %27 pour l'apostrophe,
    underscores pour les espaces. On revient au titre lisible : c'est lui que
    l'index nomme, et url() refera la forme d'adresse."""
    return unquote(t).replace("_", " ").strip()


def titre_cible(cle):
    """Une cible est un legendaire, une piece d'armure ou un composant."""
    if cle in legs:
        return lisible(legs[cle].get("wiki") or en(legs[cle].get("name")) or cle)
    for bloc in ("armor_sets",):
        e = (d.get(bloc) or {}).get(cle)
        if isinstance(e, dict):
            return lisible(e.get("wiki") or en(e.get("name")) or cle)
    if cle not in cc:
        INCONNUES.add(cle)
    return titre_composant(cle)


def capturee(titre, avec_table=False):
    p = slug(titre)
    r = idx.get(p)
    if r is None:
        return False
    return bool(r["table_materiaux"]) if avec_table else True


def url(titre):
    # L'apostrophe est reencodee : le wiki l'accepte nue, mais un client
    # automatise ne le fait pas toujours.
    return WIKI + quote(titre.replace(" ", "_"), safe="/_():,-")


# --- 0. trous de l'arbre --------------------------------------------------------
R_REC = {r["page"]: r for r in json.load(open(HERE / "gw2_wiki_recipes_v1.json",
                                             encoding="utf-8"))}
R_VEN = {r["page"]: r for r in json.load(open(HERE / "gw2_wiki_vendor_costs_v1.json",
                                              encoding="utf-8"))}
enfants = {}
for _cid, _c in cc.items():
    for _k in (_c.get("qty") or {}):
        _b = _k.split("__")[0]
        if _b in cc:
            enfants.setdefault(_b, set()).add(_cid)


def voie_connue(cid):
    for x in {cid, slug(titre_composant(cid))}:
        if (R_REC.get(x, {}).get("recettes") or R_VEN.get(x, {}).get("couts")):
            return True
    return False


trous = sorted(cid for cid in cc if enfants.get(cid) and not voie_connue(cid))

# --- 1. tables « Full material list » -----------------------------------------
plat = {}
for cid, c in cc.items():
    for k in (c.get("qty") or {}):
        base = k.split("__")[0]
        if base not in cc:
            plat.setdefault(base, set()).add(cid)
tables = sorted(((t, sorted(v)) for t, v in plat.items()
                 if not capturee(titre_cible(t), avec_table=True)),
                key=lambda x: (-len(x[1]), x[0]))
# Une cible sans entree connue n'a pas de page a capturer : elle a une entree a
# creer. Elle sort de la file et va en section 0.
tables = [x for x in tables if x[0] not in INCONNUES]

# --- 2. composants en arbitrage sans page -------------------------------------
arb = HERE / "ARBITRAGES.md"
en_arbitrage = []
if arb.exists():
    txt = arb.read_text(encoding="utf-8")
    cites = set(re.findall(r"\| `([a-z0-9_]+)` — ", txt))
    for line in txt.splitlines():
        if line.startswith("| `") and line.count("|") >= 7:
            cites |= set(re.findall(r"([a-z0-9_]+) \((?:recette|vendeur)\)",
                                    line.rsplit("|", 2)[-2]))
    poids = {c: len(re.findall(rf"\| `{c}` — ", txt)) for c in cites}
    en_arbitrage = sorted((c for c in cites if c in cc and not capturee(titre_composant(c))),
                          key=lambda c: (-poids.get(c, 0), c))

# --- 3. composants sans apiId ni page ------------------------------------------
sans_id = sorted(cid for cid, c in cc.items()
                 if not c.get("apiId") and not capturee(titre_composant(cid)))

# --- 4. collections sans etapes -------------------------------------------------
collections_vides = []
for lk, lv in legs.items():
    for ck, cv in (lv.get("collections") or {}).items():
        manque = []
        if not cv.get("items"):
            manque.append("sans etapes")
        if not cv.get("unlock"):
            manque.append("sans unlock")
        if manque:
            t = en(cv.get("name")) or ck
            collections_vides.append((t, en(lv.get("name")) or lk, cv.get("id"),
                                      ", ".join(manque), capturee(t)))
collections_vides.sort(key=lambda x: (x[4], x[1], x[0]))

# --- ecriture -------------------------------------------------------------------
urls, out = [], []
out.append("# Pages wiki à capturer\n")
out.append(f"Calculé depuis `{SRC.name}` et `ressources/INDEX_CONTENU.json` par")
out.append("`gw2_pages_a_capturer_v1.py`. **Ne pas éditer à la main** : régénérer.\n")
out.append("Une page déjà au dépôt n'est jamais redemandée — l'index de contenu est")
out.append("interrogé avant toute ligne. `PAGES_A_CAPTURER.txt` porte les mêmes")
out.append("pages en URLs brutes, une par ligne, pour l'automatisation.\n")

if INCONNUES:
    out.append(f"\n## 0 bis — {len(INCONNUES)} cibles citees par l'arbre sans entree connue\n")
    out.append("Ces cles portent des couts a plat mais ne correspondent ni a un legendaire,")
    out.append("ni a une piece d'armure, ni a un composant. Ce n'est pas une capture qui")
    out.append("manque, c'est une entree — souvent une variante d'ecriture d'une cle")
    out.append("existante. A regler avant de capturer quoi que ce soit pour elles.\n")
    for c in sorted(INCONNUES):
        out.append(f"- `{c}`")

out.append(f"\n## 0 — {len(trous)} trous de l'arbre — LA PRIORITÉ\n")
out.append("Ces composants ont des enfants dans la donnée, mais ni boîte Recipe ni")
out.append("coût vendeur au dépôt : l'arbre sait qu'il faut les fabriquer, il ne sait")
out.append("pas avec quoi. Tant qu'ils manquent, le calcul de bas en haut s'arrête là")
out.append("et les totaux restent tributaires des coûts recopiés à plat.\n")
out.append("| page wiki | composants qui en dépendent |")
out.append("|---|---:|")
for _c in sorted(trous, key=lambda x: (-len(enfants.get(x, ())), x)):
    _t = titre_composant(_c)
    urls.append(url(_t))
    out.append(f"| `{_t}` | {len(enfants.get(_c, ()))} |")

out.append(f"\n## 1 — {len(tables)} tables « Full material list » manquantes\n")
out.append("Ces cibles portent des coûts à plat mais leur page n'est pas capturée avec")
out.append("sa table de matériaux. Sans elle, l'arbre ne peut pas se déplier : il")
out.append("ignore ce que la cible contient réellement.\n")
out.append("| page wiki | coûts à plat concernés |")
out.append("|---|---:|")
for t, comps in tables:
    ti = titre_cible(t)
    urls.append(url(ti))
    out.append(f"| `{ti}` | {len(comps)} |")

out.append(f"\n## 2 — {len(en_arbitrage)} composants en arbitrage sans page au dépôt\n")
out.append("Cités dans `ARBITRAGES.md`. Leur boîte Recipe et leur table vendeur")
out.append("tranchent une partie des désaccords — en particulier si le vendeur propose")
out.append("un **choix** ou une **liste**, ce que la capture aplatie ne dit pas.\n")
out.append("| page wiki | désaccords portés |")
out.append("|---|---:|")
for c in en_arbitrage:
    ti = titre_composant(c)
    urls.append(url(ti))
    out.append(f"| `{ti}` | {poids.get(c, 0)} |")

out.append(f"\n## 3 — {len(sans_id)} composants sans apiId ni page\n")
out.append("Quantité juste, identité inconnue : le besoin s'affiche, la colonne")
out.append("« possédé » reste vide faute de pouvoir interroger l'API.\n")
out.append("| page wiki |")
out.append("|---|")
for c in sans_id:
    ti = titre_composant(c)
    urls.append(url(ti))
    out.append(f"| `{ti}` |")

manquantes = [x for x in collections_vides if not x[4]]
out.append(f"\n## 4 — {len(collections_vides)} collections incomplètes — "
           f"RIEN À CAPTURER\n")
out.append("Ces succès n'ont pas d'article à eux : « Incursive Investigation:")
out.append("Infinite Recursion » est une ligne de la page de catégorie, « Helping")
out.append("Hylek: Kill Krait » est un compteur de kills sans étapes par nature. Ils")
out.append("vivent dans le méta global. La liste reste parce qu'elle est utile ; la")
out.append("colonne « où le lire » dit où regarder. Aucune de ces lignes n'est dans")
out.append("`PAGES_A_CAPTURER.txt`.\n")
out.append("| | succès | légendaire | id | ce qui manque | où le lire |")
out.append("|---|---|---|---:|---|---|")
renvois = {}
for t, leg, aid, manque, cap in collections_vides:
    if cap:
        cible = t
    else:
        # Pas d'article a ce nom : on renvoie a la page du legendaire, qui
        # porte le tableau de ses collections. Une seule URL par legendaire.
        cible = titre_cible(next((k for k, v in legs.items()
                                  if (en(v.get("name")) or k) == leg), leg))
        renvois.setdefault(cible, 0)
        renvois[cible] += 1
    out.append(f"| {'●' if cap else '○'} | `{t}` | {leg} | {aid} | {manque} | "
               f"{'—' if cap else '`' + cible + '`'} |")
# Volontairement aucune URL : voir l'en-tete. Ces succes n'ont pas d'article.

(HERE / "PAGES_A_CAPTURER.md").write_text("\n".join(out) + "\n", encoding="utf-8")
vus, propres = set(), []
for u in urls:
    if u not in vus:
        vus.add(u)
        propres.append(u)
(HERE / "PAGES_A_CAPTURER.txt").write_text("\n".join(propres) + "\n", encoding="utf-8")

print(f"0 — TROUS DE L'ARBRE                 : {len(trous)}")
print(f"1 — tables materiaux manquantes      : {len(tables)}")
print(f"2 — composants en arbitrage sans page: {len(en_arbitrage)}")
print(f"3 — composants sans apiId ni page    : {len(sans_id)}")
print(f"4 — collections incompletes          : {len(collections_vides)} ({len(manquantes)} sans capture)")
print(f"PAGES_A_CAPTURER.md et .txt ecrits — {len(propres)} URLs uniques")
