#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""W8 : noms francais des CARTES alignes sur le client (accord d'Antoine, 09/10/2026).

v2 (09/10) : 988 est Dry Top (Cimesèche), pas The Silverwastes (1015, « Les
Contrées sauvages d'argent ») — la v1 avait pris l'id sans verifier son nom
anglais. Ajouts : Mistlock Observatory (secteur 1079 de la carte 872,
« Observatoire de Gardebrume »), Southsun Cove (873), Mad King's Realm
(royaume d'Halloween, sans id de carte : « Royaume du Roi Dément », le Roi Fou
s'appelant « Roi Dément » cote client, cf. carte 866), Détroit glacé et
Ascension ardente (noms inventes). Les champs `en` recoivent le nom ANGLAIS
quand ils portaient un nom francais.

Usage : python3 scripts_tracker/integration/gw2_noms_cartes_fr_v1.py SRC DST JSX_SRC JSX_DST

Regle (Antoine) : pour un id confirme, si l'API rend une autre valeur que la
notre, l'API a raison. Source : /v2/maps?ids=…&lang=fr et lang=en (09/10/2026),
apparies par id de carte.

Deux classes :
- FAUX : nom francais invente (« Bond de Malchor »). Remplace partout : ces
  chaines sont francaises quel que soit le champ.
- EN : nom anglais laisse dans un champ `fr`. Remplace dans les seuls champs
  `fr` (JSON) et litteraux `fr:` (JSX), sauf quand il fait partie d'un nom
  d'objet ou de succes reste en anglais (« Shard of Lowland Shore »,
  « Shipwreck Strand Lockbox », « Portable Wizard's Tower Exchange », texte
  entre « »).
L'article suit le nom : « les Marches de Bjora » -> « la Frontiere de Bjora »,
« aux Detroits » -> « au Detroit », « a Lowland Shore » -> « a la Cote des basses terres ».
"""
import json, re, sys
from pathlib import Path

# id : (nom fr API, article) ; article parmi le, la, les, l', "" (nom propre nu)
API = {
    65: ("Saut de Malchor", "le"), 1343: ("Frontière de Bjora", "la"), 51: ("Détroit de la dévastation", "le"),
    988: ("Cimesèche", ""), 1015: ("Contrées sauvages d'argent", "les"),
    873: ("Crique de Sud-Soleil", "la"), "S1079": ("Observatoire de Gardebrume", "l'"),
    "MKR": ("Royaume du Roi Dément", "le"), 1301: ("Promontoire de Jahai", "le"), 1310: ("Pics de Chef-Tonnerre", "les"),
    1271: ("Îles de Ventesable", "les"), 25: ("Marais de fer", "le"), 1045: ("Profondeurs verdoyantes", "les"),
    1052: ("Orée d'émeraude", "l'"), 22: ("Montée de Flambecœur", "la"), 73: ("Côte de la marée sanglante", "la"),
    17: ("Hinterlands harathis", "les"), 53: ("Marais de Lumillule", "le"), 29: ("Chutes de la canopée", "les"),
    39: ("Mont Maelström", "le"), 1043: ("Bassin aurique", "le"), 866: ("Labyrinthe du Roi Dément", "le"),
    1550: ("Côte des basses terres", "la"), 1575: ("Landes de Feu-de-Brume", "les"), 1554: ("Syntri de Janthir", ""),
    1595: ("Rive aux épaves", "la"), 1509: ("Tour du sorcier", "la"), 1622: ("Jardin de l'éternité", "le"),
    1593: ("Bois étoilé", "le"), 1195: ("Mont Draconis", "le"), 1041: ("Repli du dragon", "le"),
    1317: ("Chute draconique", "la"), 1452: ("Terres sauvages d'Echovald", "les"), 1206: ("Sanctuaire de Gardebrume", "le"),
    1203: ("Plage des sirènes", "la"), 1165: ("Marais de la pierre de sang", "le"), 1510: ("Archipel de l'observatoire céleste", "l'"),
    1185: ("Lac Doric", "le"), 1526: ("Nayos intérieur", ""), 1263: ("Domaine d'Istan", "le"), 50: ("Arche du Lion", "l'"),
    1175: ("Baie des braises", "la"), 1422: ("Trépas du dragon", "le"), 350: ("Cœur des Brumes", "le"),
    1210: ("Oasis de cristal", "l'"), 1211: ("Hautes-terres du désert", "les"), 1178: ("Confins de Givramer", "les"),
    1428: ("Pierre Arborea", ""), 62: ("Rivage maudit", "le"), 30: ("Détroit des gorges glacées", "le"),
    23: ("Collines de Kessex", "les"), 24: ("Champs de Gendarran", "les"), 1226: ("Désolation", "la"),
    15: ("Vallée de la reine", "la"), 1517: ("Amnytas", ""), 1228: ("Rives de l'Elon", "les"),
    1490: ("Fosse de Gyala", "la"), 1288: ("Domaine de Kourna", "le"), 1248: ("Domaine de Vabbi", "le"),
    1438: ("Néo-Kaineng", ""), 26: ("Falaises de Hantedraguerre", "les"), 1442: ("Province de Seitung", "la"),
}
# noms faux (fr invente) : (id, article du nom faux)
FAUX = {
    "Bond de Malchor": (65, "le"), "Marches de Bjora": (1343, "les"), "Détroits de la Dévastation": (51, "les"),
    "Détroit de la Dévastation": (51, "le"), "Terres sauvages d'argent": (1015, "les"), "Désolation d'argent": (1015, "la"),
    "Détroit glacé": (30, "le"), "Ascension ardente": (22, "la"), "Anse de Sud-Soleil": (873, "l'"),
    "Observatoire de la Serrure des Brumes": ("S1079", "l'"), "Sanctuaire de la Serrure des Brumes": (1206, "le"),
    "Falaises de Jahai": (1301, "les"), "Pics de Tonnerre": (1310, "les"), "Îles Balayées": (1271, "les"),
    "Marches de Fer": (25, "les"), "Profondeurs embrouillées": (1045, "les"), "Bord de Verdoyance": (1052, "le"),
    "Rive d'Ardentcœur": (22, "la"), "Côte de Sanguinis": (73, "la"), "Hautes-terres harathies": (17, "les"),
    "Marais d'Etincelys": (53, "le"), "Chutes de Cimebois": (29, "les"), "Mont Maelstrom": (39, "le"),
    "Bassin auric": (1043, "le"), "Falaises de Bourreloup": (26, "les"), "Labyrinthe du Roi Fou": (866, "le"),
}
# noms anglais (fr manquant) -> id ; anglais : pas d'article en entree
EN = {
    "Lowland Shore": 1550, "Mistburned Barrens": 1575, "Janthir Syntri": 1554, "Shipwreck Strand": 1595,
    "The Wizard's Tower": 1509, "Wizard's Tower": 1509, "Eternity's Garden": 1622, "Starlit Weald": 1593,
    "Draconis Mons": 1195, "Dragon's Stand": 1041, "Dragonfall": 1317, "The Echovald Wilds": 1452,
    "Echovald Wilds": 1452, "Mistlock Sanctuary": 1206, "Thunderhead Peaks": 1310, "Siren's Landing": 1203,
    "Bloodstone Fen": 1165, "Sandswept Isles": 1271, "Skywatch Archipelago": 1510, "Lake Doric": 1185,
    "Inner Nayos": 1526, "Domain of Istan": 1263, "Lion's Arch": 50, "Ember Bay": 1175, "Dragon's End": 1422,
    "Verdant Brink": 1052, "The Silverwastes": 1015, "Silverwastes": 1015, "Dry Top": 988,
    "Mistlock Observatory": "S1079", "Southsun Cove": 873, "Mad King's Realm": "MKR", "Heart of the Mists": 350,
    "Malchor's Leap": 65, "Queensdale": 15, "Jahai Bluffs": 1301, "Crystal Oasis": 1210,
    "Desert Highlands": 1211, "Bitterfrost Frontier": 1178, "Arborstone": 1428, "Auric Basin": 1043,
    "Tangled Depths": 1045, "Timberline Falls": 29, "Sparkfly Fen": 53, "Cursed Shore": 62,
    "Frostgorge Sound": 30, "Kessex Hills": 23, "Gendarran Fields": 24, "The Desolation": 1226,
    "Iron Marches": 25, "Bjora Marches": 1343, "Straits of Devastation": 51, "Mount Maelstrom": 39,
    "Fireheart Rise": 22, "Bloodtide Coast": 73, "Harathi Hinterlands": 17, "Elon Riverlands": 1228,
    "Gyala Delve": 1490, "Domain of Kourna": 1288, "Domain of Vabbi": 1248, "New Kaineng City": 1438,
    "Seitung Province": 1442, "Dredgehaunt Cliffs": 26,
}
SUITE_OBJET = r"(?: (?:Lockbox|Strongbox|Exchange|Exploration|Wanderlust|Mastery|Insight|Chest|Waypoint|Vista|Heart|Hero|Map|Cache|Master|Strongbox|Shard|Shards)\b)"
PREPS = r"(?:(?P<prep>(?i:chez|avec|en|à|aux|au|de la|de l'|des|du|de|d'|dans les|dans le|dans la|dans l'|dans|sur la|sur le|sur les|sur|les|le|la|l'))\s?)?"

def avec_article(prep, art, nom, maj):
    """prep : preposition/article d'origine (peut etre None)."""
    base = {"": "", "chez": "à", "en": "à", "à": "à", "aux": "à", "au": "à", "de la": "de", "de l'": "de", "des": "de", "du": "de", "de": "de",
            "d'": "de", "les": "", "le": "", "la": "", "l'": ""}
    p = prep
    lead = ""
    if p == "avec":
        lead, p = "avec ", ""
    if p and p.startswith("dans"):
        lead, p = "dans ", ""
    elif p and p.startswith("sur"):
        lead, p = "sur ", ""
    elif p is not None:
        p = base[p]
    if art == "":
        if p == "à": return "à " + nom
        if p == "de": return ("d'" if nom[0] in "AEIOUÉÈÎ" else "de ") + nom
        return lead + nom if lead else (nom)
    if p is None and lead == "":
        # nom nu (parentheses, apres « carte », valeur de champ) : l'article
        # fait partie du nom du client pour ces quatre cartes
        return {"Désolation": "La ", "Contrées sauvages d'argent": "Les ", "Tour du sorcier": "La ", "Vallée de la reine": "La ",
                "Arche du Lion": "L'"}.get(nom, "") + nom
    if p == "à":
        a = {"le": "au ", "les": "aux ", "la": "à la ", "l'": "à l'"}[art]
    elif p == "de":
        a = {"le": "du ", "les": "des ", "la": "de la ", "l'": "de l'"}[art]
    elif p == "" or lead:
        a = lead + {"le": "le ", "les": "les ", "la": "la ", "l'": "l'"}[art]
    else:  # pas de prep : nom nu (parentheses, apres « carte », etc.)
        return nom
    if maj and not lead: a = a[0].upper() + a[1:]
    return a + nom

def remplace(s, table, faux):
    """table : nom source -> id ; faux : True si le nom source porte un article francais."""
    for src in sorted(table, key=len, reverse=True):
        mid = table[src][0] if faux else table[src]
        nom, art = API[mid]
        rx = re.compile(r"(?<![\w’'])" + PREPS + re.escape(src) + r"(?![\w])", re.U)
        out, pos = [], 0
        for m in rx.finditer(s):
            avant = s[:m.start("prep") if m.group("prep") else m.start()]
            debut_nom = m.start() + (len(m.group(0)) - len(src))
            # nom d'objet ou de succes reste en anglais : on ne touche pas
            if not faux:
                if re.search(r"\b(?:of|Of|Portable|the|The|Defend|Defeat|collection)\s$", s[:debut_nom]): continue
                if re.match(SUITE_OBJET, s[debut_nom + len(src):]): continue
                if s[:debut_nom].count("«") > s[:debut_nom].count("»"): continue
                if s[:debut_nom].count("\"") % 2 == 1: continue
            prep = m.group("prep")
            maj = bool(prep) and prep[0].isupper()
            # « les Marches » sans prep en tete de phrase : garder la majuscule
            rep = avec_article(prep.lower() if prep else None, art, nom, maj)
            if prep is None and faux and art_src_libre(s, m.start()):
                rep = nom
            out.append(s[pos:m.start()]); out.append(rep); pos = m.end()
        out.append(s[pos:]); s = "".join(out)
    return s

def art_src_libre(s, i):
    return False

EN_DE = {}
for _n, _i in EN.items():
    if not _n.startswith("The ") or _i not in EN_DE: EN_DE.setdefault(_i, _n)
EN_DE.update({1509: "the Wizard's Tower", 1015: "the Silverwastes", 1226: "the Desolation", 866: "Mad King's Labyrinth"})

def corrige_en(s):
    """Champ anglais portant un nom francais invente : le nom anglais du client."""
    for src in sorted(FAUX, key=len, reverse=True):
        s = re.sub(r"(?<![\w])" + re.escape(src) + r"(?![\w])", EN_DE[FAUX[src][0]], s)
    return s

def corrige_en(s):
    """Champ anglais portant un nom de carte FRANCAIS : le nom anglais du client."""
    noms = {**{k: v[0] for k, v in FAUX.items()}}
    for mid, (nom, art) in API.items():
        if mid in EN_DE and nom != EN_DE[mid]:
            noms[nom] = mid
    for src in sorted(noms, key=len, reverse=True):
        en = EN_DE[noms[src]]
        s = re.sub(r"(?<![\w])(?:(?:La|Les|L')\s?)?" + re.escape(src) + r"(?![\w])",
                   lambda m: en[0].upper() + en[1:] if m.start() == 0 else en, s)
    return re.sub(r"\b(S\d) rien\b", r"\1 nothing", s)

def corrige(s, champ_fr, champ_en=False):
    if champ_en:
        return corrige_en(s)
    s2 = remplace(s, FAUX, True)
    if champ_fr:
        s2 = remplace(s2, EN, False)
    # « le méta Les Contrées… » : un nom a article integre apres « méta » prend « des »
    s2 = s2.replace("méta Les Contrées", "méta des Contrées")
    return s2

if __name__ == "__main__":
    SRC, DST, JS, JD = map(Path, sys.argv[1:5])
    d = json.loads(SRC.read_text(encoding="utf-8"))
    n = [0]
    journal = []
    def walk(o, fr, chemin):
        if isinstance(o, dict):
            for k, v in o.items():
                if chemin == "" and k == "_meta": continue  # changelogs : historique, on n'y touche pas
                if isinstance(v, str):
                    nv = corrige(v, fr or k == "fr", k == "en")
                    if nv != v: o[k] = nv; n[0] += 1; journal.append((chemin + "/" + k, v, nv))
                else: walk(v, fr or k == "fr", chemin + "/" + k)
        elif isinstance(o, list):
            for i, v in enumerate(o):
                if isinstance(v, str):
                    nv = corrige(v, fr)
                    if nv != v: o[i] = nv; n[0] += 1; journal.append((chemin + f"[{i}]", v, nv))
                else: walk(v, fr, chemin + f"[{i}]")
    walk(d, False, "")
    # notes Arcanum (v388) : « bought from Wizard's Tower » -> « at the Wizard's Tower »
    for c in d["legendaries"]["obsidian"]["collections"].values():
        en = c.get("note", {}).get("en", "")
        if "bought from Wizard's Tower" in en:
            c["note"]["en"] = en.replace("bought from Wizard's Tower", "bought at the Wizard's Tower"); n[0] += 1
    d["_meta"]["map_names_fr_ref"] = "noms de carte du client, /v2/maps?lang=fr apparies par id avec lang=en (lu le 09/10/2026)"
    d["_meta"]["last_updated"] = "2026-10-09"
    DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    # JSX : litteraux fr: "…"
    js = JS.read_text(encoding="utf-8"); nj = [0]
    def lit(m):
        v = m.group(2); nv = corrige(v, True)
        if nv != v: nj[0] += 1; journal.append(("JSX", v, nv))
        return m.group(1) + nv + m.group(3)
    js = re.sub(r'(\bfr:\s*")((?:[^"\\]|\\.)*)(")', lit, js)
    JD.write_text(js, encoding="utf-8")
    Path("/tmp/claude-0/w8/journal.json").write_text(json.dumps(journal, ensure_ascii=False, indent=0))
    print(f"sources : {n[0]} chaines ; JSX : {nj[0]} litteraux")
