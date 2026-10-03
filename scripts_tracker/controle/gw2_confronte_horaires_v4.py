#!/usr/bin/env python3
"""Confronte les 20 metas de gw2_sources aux 45 evenements du widget wiki.

Lecture seule. N'ecrit rien : rend un tableau a lire.

Le widget pose une frise depuis 00:00 UTC : `sequences.partial` joue une fois,
puis `sequences.pattern` se repete. L'intervalle d'un segment est donc la somme
des durees de `pattern`, et son decalage est la position de sa premiere
occurrence dans la phase repetee, modulo l'intervalle -- pas `partial` pris en
bloc, qui est seulement la duree du cycle d'amorce.
"""
import glob
import json
import re
import unicodedata
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]  # racine du depot
WIDGET = RACINE / "ressources" / "widget" / "event_timer_data.json"

# Nos libelles ne sont pas ceux du widget : « Grand Sahil Casino » ne se lit
# nulle part chez eux, le segment s'appelle « Rounds 1 to 3 » et pointe sur
# Casino Blitz. L'appariement automatique par carte + sous-nom en resout 11 sur
# 20 ; les neuf autres sont poses ici a la main, apres lecture des segments.
# `None` = le widget ne porte pas cet evenement, et ne le portera pas.
CORRESPONDANCES = {
    "co": ("pof-co", "1"),        # Rounds 1 to 3 -> Casino Blitz
    # Depuis la fusion du 03/10 le nom anglais d'`er` est « Doppelganger » (le
    # boss final), segment voisin du sien : l'appariement par nom tombait a 115.
    "er": ("pof-er", "1"),        # The Path to Ascension: Augury Rock
    "conv": ("public-con", "2"),  # Outer Nayos, la convergence SotO
    "de2": ("eod-de", "3"),       # The Battle for the Jade Sea
    "ds": ("hot-ds", "1"),        # Start advancing on the Blighting Towers
    "ew": ("eod-ew", "2"),        # Aspenwood / Junkyard
    "mb": ("public-con", "1"),    # Mount Balrior, la convergence JW
    "gy": None,                   # Gyala Delve : absent du widget
    "in": None,                   # Inner Nayos - Map Readiness : absent
    "zak": None,                  # Citadel of Zakiros : absent
}


def norm(s):
    s = unicodedata.normalize("NFKD", str(s or "")).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", s.lower())


def en(v):
    if isinstance(v, dict):
        return v.get("en") or v.get("fr") or ""
    return v or ""


def frise(ev):
    """{ref segment: (decalage, intervalle, duree)} en minutes, depuis 00:00 UTC.

    La duree etait jetee en v1 : seuls le decalage et l'intervalle etaient
    confrontes. Elle manquait -- `conv` portait 20 minutes cote JSX quand le
    widget en annonce 10, et personne ne le voyait.
    """
    seq = ev.get("sequences") or {}
    partial = seq.get("partial") or []
    pattern = seq.get("pattern") or []
    interval = sum(x.get("d", 0) for x in pattern)
    debut_pattern = sum(x.get("d", 0) for x in partial)
    out = {}
    curseur = debut_pattern
    for x in pattern:
        r = str(x.get("r"))
        if r not in out:
            out[r] = (curseur % interval if interval else curseur, interval,
                      x.get("d"))
        curseur += x.get("d", 0)
    # un segment qui n'apparait que dans `partial` n'a pas d'horaire stable
    for x in partial:
        out.setdefault(str(x.get("r")), (None, interval, None))
    return out


def apparie(metas, events, par_carte):
    """{cle meta: (evenement, ref segment, segment, (dec, inter, fenetre))}.

    L'appariement etait enferme dans `main()`. Un second outil en a ecrit un
    autre, plus simple -- par (decalage, intervalle) -- et il a joint `er` a
    « Defending Tarir (Pylons) » et la monnaie `karma` au Death-Branded
    Shatterer : des dizaines d'evenements partagent le meme couple. Un seul
    appariement, celui qui a ete valide par 17 accords, et il s'appelle d'ici.
    """
    out = {}
    for mk, m in metas.items():
        if not isinstance(m, dict):
            continue
        if m.get("isTimeless"):
            out[mk] = None
            continue
        # Depuis la fusion du 03/10 : `map` (ou) et `name` (quoi). Plus de
        # `subname`, dont les deux usages se contredisaient.
        carte = norm(en(m.get("map")))
        nom = sous = norm(en(m.get("name")))
        trouve = None
        if mk in CORRESPONDANCES:
            pose = CORRESPONDANCES[mk]
            if pose is None:
                out[mk] = None
                continue
            k, r = pose
            ev = events.get(k)
            if ev:
                seg = (ev.get("segments") or {}).get(r) or {}
                trouve = (k, r, seg, frise(ev).get(str(r)))
        for k, ev in ([] if trouve else par_carte.get(carte, [])):
            f = frise(ev)
            for r, seg in (ev.get("segments") or {}).items():
                ns = norm(seg.get("name"))
                if not ns:
                    continue
                if sous and (ns == sous or sous in ns or ns in sous):
                    trouve = (k, r, seg, f.get(str(r)))
                    break
                if nom and (ns == nom or nom in ns):
                    trouve = (k, r, seg, f.get(str(r)))
            if trouve:
                break
        out[mk] = trouve
    return out


def main():
    w = json.load(open(WIDGET, encoding="utf-8"))
    events = w["events"]
    print(f"widget {w['config'].get('version')} — {len(events)} evenements\n")

    src = max(glob.glob(str(RACINE / "gw2_sources_v*.json")),
              key=lambda p: int(re.search(r"_v(\d+)", p).group(1)))
    metas = json.load(open(src, encoding="utf-8"))["meta_events"]
    print(f"{Path(src).name} — {len(metas)} metas\n")

    # index des segments du widget
    par_carte = {}
    for k, ev in events.items():
        if not isinstance(ev, dict) or not ev.get("name"):
            continue
        par_carte.setdefault(norm(ev["name"]), []).append((k, ev))

    accords, ecarts, introuvables, durees = [], [], [], []
    # UN appariement, celui d'`apparie` : main() en portait une copie, et deux
    # copies finissent par repondre differemment.
    paires = apparie(metas, events, par_carte)
    sans_horaire = sorted(k for k, m in metas.items() if isinstance(m, dict) and m.get("isTimeless"))
    for mk, m in sorted(metas.items()):
        if not isinstance(m, dict) or m.get("isTimeless"):
            continue
        p = paires.get(mk)
        if not p:
            introuvables.append((mk, en(m.get("map")), en(m.get("name")),
                                 m.get("offsetUTC"), m.get("intervalMin")))
            continue
        k, r, seg, fi = p
        ev = events.get(k)
        trouve = (k, ev, r, seg, fi)
        k, ev, r, seg, fi = trouve
        dec, inter, duree = fi if fi else (None, None, None)
        if duree is not None and m.get("durationMin") != duree:
            durees.append((mk, en(seg.get("name")), m.get("durationMin"), duree))
        ligne = (mk, k, en(seg.get("name")), m.get("offsetUTC"), dec,
                 m.get("intervalMin"), inter, seg.get("link"), seg.get("chatlink"))
        if m.get("offsetUTC") == dec and m.get("intervalMin") == inter:
            accords.append(ligne)
        else:
            ecarts.append(ligne)

    def bloc(titre, lignes):
        print(f"== {titre} ({len(lignes)})")
        if not lignes:
            print("   (aucun)\n")
            return
        print(f"   {'cle':6} {'widget':12} {'segment':38} {'off':>5}{'→':^3}{'off':>5} "
              f"{'int':>5}{'→':^3}{'int':>5}  ref")
        for mk, k, nom, o1, o2, i1, i2, link, chat in lignes:
            print(f"   {mk:6} {k:12} {nom[:38]:38} {str(o1):>5} → {str(o2):>5} "
                  f"{str(i1):>5} → {str(i2):>5}  {link or ''}")
        print()

    bloc("ACCORD — le widget confirme nos valeurs", accords)
    bloc("ECART — a trancher", ecarts)
    print(f"== SANS CORRESPONDANCE ({len(introuvables)})")
    for mk, carte, sous, o, i in introuvables:
        print(f"   {mk:6} {carte} / {sous}  (off={o}, int={i})")
    print()

    # ce que le widget offre et que nous n'avons pas
    vus = {l[1] for l in accords + ecarts}
    print(f"== DUREES — le widget contredit nos valeurs ({len(durees)})")
    for mk, nom, nous, lui in sorted(durees):
        print(f"   {mk:6} {str(nom)[:38]:40} nous {nous} → widget {lui}")
    if not durees:
        print("   (aucune)")

    print(f"\n== SANS HORAIRE (isTimeless) — non confrontees ({len(sans_horaire)})")
    print("   " + ", ".join(sans_horaire))
    print("   Le JSX ne porte plus de table d'horaires depuis le 03/10 : le catalogue")
    print("   est la seule, il n'y a plus rien a confronter de ce cote.\n")
    print("== EVENEMENTS DU WIDGET NON RATTACHES")
    for k, ev in sorted(events.items()):
        if not isinstance(ev, dict) or not ev.get("name") or k in vus:
            continue
        f = frise(ev)
        segs = [s.get("name") for s in (ev.get("segments") or {}).values() if s.get("name")]
        inter = next((v[1] for v in f.values()), None)
        print(f"   {k:14} {ev['name'][:28]:28} int={str(inter):>5}  {len(segs)} segment(s)")


if __name__ == "__main__":
    main()
