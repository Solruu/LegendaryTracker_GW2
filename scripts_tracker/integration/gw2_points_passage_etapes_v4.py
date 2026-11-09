#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Points de passage des etapes de collection, avec code de chat (09/11).

Usage : python3 scripts_tracker/integration/gw2_points_passage_etapes_v4.py SRC DST

v4 (09/11) : sur la page d'OBJET aussi, faute de point de passage, le point
d'interet, le panorama ou le coeur que cite son wikitexte (modeles poi, point
of interest, vista, heart) : 39 pages relues par l'API du wiki
(ressources/api/points_interet_wiki_20261109.json) et capturees ; l'id est
celui du gamelink rendu dans la capture.

v3 (09/11) : les pages de succes « a etapes » (Acquiring Agaleus, Master
Diver, Mists Research, Experiments in the Shadows, Vision I...) n'ont pas de
tableau « Collection items » : leurs lignes sont lues par leur attribut
`data-id="achievement<id>-bit<n>"`, qui donne le numero de case. Rejouable :
les etapes deja pourvues ne sont pas touchees.

v2 (09/11, apres retour d'Antoine) :
- la page de collection se retrouve aussi par le NOM de la collection
  (slug du titre) : 61 collections dont la cle ne donnait pas le nom de
  fichier (Ad Infinitum, Aurora, Envoy, Flameseeker, Kamohoali'i, Chuka...) ;
- plusieurs points de passage pour une etape : « souvent ils se valent »
  (Antoine) — on prend le PREMIER rencontre, dans l'ordre de la ligne ou de
  la page, et la reference le dit.

Demande d'Antoine (09/11) : les etapes (ex. Bottle of Rage, Coalescence II)
n'avaient pas de point de passage copiable, alors que le wiki en donne un.
Structure existante reprise telle quelle : `waypoint: {name, chat_code}` sur
l'etape (deja portee par 88 etapes d'Aurora II, Vision II, Selachimorpha,
Endless Summer) ; aucun champ nouveau.

Deux lectures, dans cet ordre :
1. la ligne de l'etape au tableau « Collection items » de sa page de collection
   (lien « ... Waypoint » apres l'icone de point de passage) ;
2. sinon, la page de l'objet de l'etape (`wiki`), capturee le 09/11 : un seul
   modele {{waypoint|...}} dans son wikitexte (lu par l'API du wiki, revision
   notee) et le gamelink correspondant dans la capture. Plusieurs points de
   passage distincts sur la page : on ne choisit pas.
Code de chat : le modele {{waypoint|...}} rend, dans la capture meme, le lien
du point de passage suivi d'un gamelink `data-type="map" data-id="<id>"` ;
l'id est lu LA, dans le contexte de la page (un meme nom existe sur plusieurs
cartes : Pact Encampment, Forgotten City, Heathen's Hold...). Le code se
calcule de cet id comme le script du wiki (octet 4, id petit-boutiste sur 4
octets, base64). Le modele accepte aussi l'id seul ({{waypoint|685}}) :
le nom est alors le texte du lien rendu dans la capture. Les 236 noms ont ete rendus par l'API du wiki le 09/11 :
ressources/api/points_de_passage_wiki_20261109.json.
"""
import base64
import html as H
import json
import re
import sys
import unicodedata
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
raw = SRC.read_text(encoding="utf-8")
d = json.loads(raw)
W = Path("ressources/wiki")
REF = json.loads(Path("ressources/api/points_de_passage_wiki_20261109.json").read_text(encoding="utf-8"))
IDS = REF["ids"]
WT = {v["from"]: v for v in REF["wikitext_waypoints"].values()}
WT.update(REF["wikitext_waypoints"])
POI_PAGES = json.loads(Path("ressources/api/points_interet_wiki_20261109.json").read_text(encoding="utf-8"))["pages"]
for _t, _v in POI_PAGES.items():
    WT.setdefault(_t, _v)
    WT.setdefault(_v["from"], _v)
GENRE = re.compile(r'<a [^>]*>([^<]+)</a>(?:<span>)?\s*—\s*(?:</span>)?(?:<input[^>]*>)?<span class="gamelink"[^>]*data-type="map" data-id="(\d+)"')


def lieux(fragment):
    """Tout lien suivi d'un gamelink de carte : point de passage, point d'interet, panorama, coeur."""
    out = []
    for n, i in GENRE.findall(fragment):
        n = n.strip()
        out.append((n if n.endswith("Waypoint") else f"{n} (point d'intérêt)", int(i)))
    return list(dict.fromkeys(out))


def code(poi):
    b = [4] + list(int(poi).to_bytes(4, "little"))
    return "[&" + base64.b64encode(bytes(b)).decode() + "]"


assert code(762) == "[&BPoCAAA=]"  # Glorious Victory Waypoint, lu sur la page Bottle of Rage (Empty)


def norm(s):
    return re.sub(r"[^a-z0-9]", "", H.unescape(s.replace("%27", "'").replace("%22", '"')).lower())


def slug(t):
    t = unicodedata.normalize("NFKD", t.replace("_", " "))
    t = "".join(c for c in t if not unicodedata.combining(c)).replace("'", "").replace("’", "")
    return re.sub(r"[^A-Za-z0-9]+", "_", t).strip("_").lower()


WPRE = re.compile(r'>([^<]+?)</a><span> — </span>(?:<input[^>]*>)?<span class="gamelink"[^>]*data-type="map" data-id="(\d+)"')


POIRE = re.compile(r'title="Point of Interest"><img[^>]*></a></span>(?:&nbsp;|\s)*<a [^>]*>([^<]+)</a>(?:<span>)? — (?:</span>)?(?:<input[^>]*>)?<span class="gamelink"[^>]*data-type="map" data-id="(\d+)"')


def interets(fragment):
    """Points d'interet (icone « Point of Interest ») suivis de leur gamelink."""
    return list(dict.fromkeys((n.strip(), int(i)) for n, i in POIRE.findall(fragment)))


def points(fragment):
    """(nom, id) distincts, dans l'ordre : le lien du modele {{waypoint}} suivi de son gamelink."""
    return list(dict.fromkeys((n.strip(), int(i)) for n, i in WPRE.findall(fragment)))


def lignes(page):
    p = W / f"{page}.html"
    if not p.exists():
        return {}
    s = p.read_text(encoding="utf-8")
    i = s.find('id="Collection_items"')
    if i < 0:
        # page de succes a etapes : lignes reperees par leur numero de case
        out = {}
        for b, r in re.findall(r'<tr class="widget-account-achievement" data-id="achievement\d+-bit(\d+)">(.*?)</tr>', s, re.S):
            out[("bit", int(b))] = points(r) or [(f"{n} (point d'intérêt)", i) for n, i in interets(r)]
        return out
    tb = s[s.find("<table", i):s.find("</table>", i)]
    out = {}
    for r in re.findall(r"<tr[^>]*>(.*?)</tr>", tb, re.S):
        cs = re.findall(r"<td[^>]*>(.*?)</td>", r, re.S)
        if len(cs) < 5:
            continue
        lien = re.findall(r'href="/wiki/([^"#]+)"', cs[1])
        if lien:
            out[norm(lien[0])] = points(r) or [(f"{n} (point d'intérêt)", i) for n, i in interets(r)]
    return out


def nom_page(ck, col):
    n = col.get("name")
    n = n.get("en") if isinstance(n, dict) else n
    for c in (ck, col.get("page"), col.get("wiki"), slug(n) if n else None):
        if c and (W / f"{c}.html").exists():
            return c
    return None


stat = {"ligne": 0, "page_objet": 0, "ambigu": 0, "ecart_modele": 0}
for l, L in d["legendaries"].items():
    for ck, col in (L.get("collections") or {}).items():
        page = nom_page(ck, col)
        rows = lignes(page) if page else {}
        for it in col.get("items") or []:
            if it.get("waypoint") or not (it.get("wiki") or ("bit", it.get("bit")) in rows):
                continue
            wps = (rows.get(norm(it["wiki"])) if it.get("wiki") else None) or rows.get(("bit", it["bit"])) or []
            if wps:
                ref = f"ressources/wiki/{page}.html, Collection items"
                if len(wps) > 1:
                    ref += f" (premier des {len(wps)} points de passage de la ligne)"
                    stat["ambigu"] += 1
                stat["ligne"] += 1
            elif not it.get("wiki"):
                continue
            else:
                titre = H.unescape(it["wiki"].replace("%27", "'").replace("%22", '"')).replace("_", " ")
                v = WT.get(titre)
                if not v:
                    continue
                cap = W / f"{slug(titre)}.html"
                if not cap.exists():
                    cap = W / f"{slug(v['from'])}.html"
                ct = cap.read_text(encoding="utf-8")
                wps = points(ct) or lieux(ct)
                if not wps:
                    continue
                ref = f"ressources/wiki/{cap.name} (revision {v['rev']})"
                if len(wps) > 1:
                    ref += f" (premier des {len(wps)} points de passage de la page)"
                    stat["ambigu"] += 1
                stat["page_objet"] += 1
            nom, poi = wps[0]
            if nom in IDS and IDS[nom]["id"] != poi:
                # meme nom sur plusieurs cartes : la page rend l'id de SON contexte,
                # c'est lui qui fait foi (le rendu nu du modele donne une autre carte).
                stat["ecart_modele"] += 1
            it["waypoint"] = {"name": nom, "chat_code": code(poi), "verified": True, "checked": "2026-11-09", "ref": ref}
out = json.dumps(d, ensure_ascii=False, indent=1)
DST.write_text(out + ("\n" if raw.endswith("\n") else ""), encoding="utf-8")
print(stat)
