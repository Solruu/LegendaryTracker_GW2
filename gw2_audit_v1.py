#!/usr/bin/env python3
"""
Audit structurel de gw2_sources_*.json — a lancer avant chaque push.

Ce script existe a cause d'une erreur reelle : une liste de succes eligibles
avait ete rangee dans un champ ad hoc (mastery_eligible, porte par un item de
collection) au lieu du bloc commun meta_eligible. Elle s'affichait, mais elle
contournait le pipeline d'enrichissement — donc plus de score d'effort, plus de
descriptions, plus de chemin le plus court. Le rendu paraissait correct.

Regle : une liste de succes eligibles ne vit QUE dans meta_eligible, indexee par
l'id du meta. Aucun autre emplacement. Ce script echoue si la regle est violee.

Usage :
    python3 gw2_audit_v1.py gw2_sources_v79.json
    python3 gw2_audit_v1.py            # prend le gw2_sources_v*.json le plus recent
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

# Champs qui ressemblent a une liste curee et n'ont pas le droit d'exister
# ailleurs que dans meta_eligible.
FORBIDDEN_KEYS = {
    "mastery_eligible", "eligible", "eligibles", "meta_subs",
    "mastery_eligible_source", "mastery_eligible_checked", "mastery_eligible_note",
}

SCHEMA = {"name", "threshold", "source", "verified", "achievements", "notes"}

# Champs dont la valeur est deja fournie par l'API ou par meta_eligible. Les
# stocker cree une seconde source de verite qui derive en silence.
DUPLICATED_KEYS = {
    "mastery_required": "seuil — dernier palier de tiers[] cote API",
    "mastery_max": "pool — longueur de meta_eligible[<id>].achievements",
    "tier_max": "seuil — dernier palier de tiers[] cote API",
    "bits_count": "nombre de bits — longueur de bits[] cote API",
}


def latest_sources() -> Path:
    files = sorted(
        HERE.glob("gw2_sources_v*.json"),
        key=lambda p: int(re.search(r"_v(\d+)\.json$", p.name).group(1)),
    )
    if not files:
        sys.exit("aucun gw2_sources_v*.json trouve")
    return files[-1]


def load_ref():
    ref_path = HERE / "gw2_achievements_ref.json"
    if not ref_path.exists():
        return None
    ref = json.loads(ref_path.read_text(encoding="utf-8"))
    names = {}
    for group in ref.get("by_group", {}).values():
        for arr in group.values():
            for a in arr:
                names[a["id"]] = a["name"]
    return names


def walk_dupes(node, path, hits):
    """Champs qui redupliquent une donnee disponible ailleurs."""
    if isinstance(node, dict):
        for k, v in node.items():
            if k in DUPLICATED_KEYS:
                hits.append((f"{path}/{k}", DUPLICATED_KEYS[k]))
            walk_dupes(v, f"{path}/{k}", hits)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk_dupes(v, f"{path}[{i}]", hits)


def walk_provenance(node, path, hits):
    """Toute valeur portant ref ou verified doit porter les trois champs."""
    if isinstance(node, dict):
        marks = {k for k in ("verified", "checked", "ref") if k in node}
        if marks and marks != {"verified", "checked", "ref"}:
            # verified seul est tolere dans meta_eligible, ou il porte la date.
            if not (marks == {"verified"} and isinstance(node.get("verified"), str)):
                hits.append((path, sorted(marks), sorted({"verified", "checked", "ref"} - marks)))
        if node.get("verified") is False and not node.get("ref"):
            hits.append((path, ["verified:false"], ["ref expliquant pourquoi"]))
        for k, v in node.items():
            walk_provenance(v, f"{path}/{k}", hits)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk_provenance(v, f"{path}[{i}]", hits)


def _jsx_currency_blocks(src):
    """Extrait, par legendaire, les monnaies declarees dans son bloc currencies.

    Une meme ressource a des requis differents selon le legendaire — 250 eclats
    d'obsidienne pour une gen1, 100 pour Ad Infinitum. Comparer tous legendaires
    confondus produirait des dizaines de fausses alertes.
    """
    out = {}
    for m in re.finditer(r'currencies(?:PerPiece|PerWeapon)?:\s*\[', src):
        depth, i = 1, m.end()
        while i < len(src) and depth:
            if src[i] == "[":
                depth += 1
            elif src[i] == "]":
                depth -= 1
            i += 1
        block = src[m.end():i - 1]
        head = src[:m.start()]
        leg = None
        for hm in re.finditer(r'\n  (?:"([a-z_0-9]+)"|([a-z_0-9]+)):\s*\{', head):
            leg = hm.group(1) or hm.group(2)
        if not leg:
            continue
        for c in re.finditer(r'required:\s*(\d+)[^{}]*?apiId:\s*(\d+)|apiId:\s*(\d+)[^{}]*?required:\s*(\d+)', block):
            req = int(c.group(1) or c.group(4))
            api = int(c.group(2) or c.group(3))
            out.setdefault(leg, {})[api] = req
    return out


# Champs bilingues qui sont de la donnee de reference, non destinee au rendu.
NOT_FOR_DISPLAY = {"_note", "note_schema", "qty_schema_note", "notes",
                   "editorial_principle", "meta_eligible_note", "achievement_notes_note"}


def check_free_sources(data, errors, warnings):
    """Un composant reellement exige devrait avoir une source gratuite repetable.

    Un joueur qui se lance n'a pas de stock a echanger. Savoir qu'une ressource
    s'obtient sans or, en repetable, vaut plus qu'un prix au comptoir — et c'est
    l'information la plus souvent absente des guides.
    """
    for cid, comp in data.get("craft_components", {}).items():
        qty = comp.get("qty")
        if not isinstance(qty, dict) or not any(
            isinstance(v, int) and v >= 100 for v in qty.values()
        ):
            continue
        srcs = comp.get("sources") or []
        if not any(isinstance(s, dict) and s.get("free_repeatable") for s in srcs):
            warnings.append(
                f"craft_components/{cid} : exige au moins 100 unites mais aucune "
                "source marquee free_repeatable — le joueur sans stock n'a aucune piste"
            )


def check_missing_qty(data, errors, warnings):
    """Une monnaie declaree pour un legendaire doit avoir une qty pour lui.

    Le controle qty_vs_jsx compare les valeurs PRESENTES des deux cotes : une
    monnaie declaree dans le JSX sans quantite correspondante lui echappe
    entierement. C'est ainsi que 500 Ducats antiques et 660 masses marquees sont
    restes hors du grand total sans que rien ne le signale.
    """
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    per_leg = _jsx_currency_blocks(jsx[-1].read_text(encoding="utf-8"))
    comps = data.get("craft_components", {})
    by_api = {}
    for cid, comp in comps.items():
        if isinstance(comp.get("apiId"), int):
            by_api.setdefault(comp["apiId"], cid)

    for legid, currencies in sorted(per_leg.items()):
        for api in sorted(currencies):
            cid = by_api.get(api)
            if cid is None:
                warnings.append(
                    f"monnaie apiId {api} declaree pour '{legid}' cote JSX : "
                    "aucun composant ne la porte, elle est donc hors du grand total"
                )
                continue
            qty = comps[cid].get("qty")
            if not isinstance(qty, dict) or legid not in qty:
                warnings.append(
                    f"craft_components/{cid} : declare pour '{legid}' cote JSX "
                    "mais sans qty pour ce legendaire — invisible du grand total"
                )


def check_unrendered_fields(data, errors, warnings):
    """Un champ editorial que le JSX ne lit nulle part est du travail invisible.

    Trois fois de suite, une information exacte a dormi dans les sources sans
    jamais atteindre l'ecran : l'ecart de categorie de Bava Nisos, le cas de
    A Hunt for the Ages, les seuils reels des metas de maitrise. Le controle
    reste heuristique — il verifie que le NOM du champ apparait quelque part
    dans le JSX — mais un nom totalement absent est une certitude, pas un doute.
    """
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    src = jsx[-1].read_text(encoding="utf-8")
    bilingual = {}

    def visit(node, path):
        if isinstance(node, dict):
            for k, v in node.items():
                if isinstance(v, dict) and "fr" in v and "en" in v:
                    bilingual.setdefault(k, []).append(path + "/" + k)
                visit(v, path + "/" + k)
        elif isinstance(node, list):
            for i, v in enumerate(node):
                visit(v, f"{path}[{i}]")

    visit(data, "")
    for key, paths in sorted(bilingual.items()):
        if key in NOT_FOR_DISPLAY:
            continue
        if key not in src:
            warnings.append(
                f"champ editorial jamais rendu : '{key}' ({len(paths)} occurrence(s), "
                f"ex. {paths[0][:70]}) — ecrit dans les sources, absent du JSX"
            )


def check_qty_vs_jsx(data, errors, warnings):
    """Le qty de base d'un composant doit egaler le required du meme legendaire.

    Le rubis de sang portait 300 dans les sources et 250 dans le JSX : le meme
    fait ecrit a deux endroits, dont un incapable de decompter une etape faite.
    Un surcout appartient a qty_extras, jamais au nombre de base.
    """
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    per_leg = _jsx_currency_blocks(jsx[-1].read_text(encoding="utf-8"))
    for cid, comp in data.get("craft_components", {}).items():
        api, qty = comp.get("apiId"), comp.get("qty")
        if not isinstance(api, int) or not isinstance(qty, dict):
            continue
        for legid, val in qty.items():
            if not isinstance(val, int) or "__" in legid:
                continue
            req = per_leg.get(legid, {}).get(api)
            if req is not None and req != val:
                # Une divergence peut etre connue et non tranchee : on l'accepte
                # UNIQUEMENT si elle est declaree, datee et motivee. Sinon elle
                # bloque. Un ecart tolere en silence redeviendrait invisible.
                ack = (comp.get("qty_conflict") or {}).get(legid)
                if isinstance(ack, dict) and ack.get("jsx") == req and ack.get("note"):
                    warnings.append(
                        f"craft_components/{cid} : ecart connu sur {legid}, "
                        f"sources {val} contre JSX {req} — {ack['note']}"
                    )
                    continue
                errors.append(
                    f"craft_components/{cid} : qty[{legid}] = {val} alors que le JSX "
                    f"declare required = {req} pour {legid} — un surcout se declare "
                    "dans qty_extras, pas dans le nombre de base"
                )


def check_api_ids(data, errors, warnings):
    """Un nom connu du referentiel doit porter l'id du referentiel.

    Controle par le NOM et non par l'id : un id absent du referentiel signifie
    seulement que l'objet n'est pas en stockage materiaux, ce qui est courant et
    legitime. En revanche, si le nom declare existe au referentiel sous un AUTRE
    id, la declaration est fausse a coup sur. C'est ce qu'il s'est passe pour
    Mistborn Mote (91246 au lieu de 90783) et Petrified Wood (79294 au lieu de
    79469) : aucune erreur a l'ecran, juste un stock eternellement a zero.
    """
    ref_path = HERE / "gw2_materials_ref.json"
    if not ref_path.exists():
        warnings.append("gw2_materials_ref.json absent : controle des apiId saute")
        return
    flat = json.loads(ref_path.read_text(encoding="utf-8")).get("flat", {})
    by_name = {}
    for sid, name in flat.items():
        by_name.setdefault(name.lower(), int(sid))

    def visit(node, path):
        if isinstance(node, dict):
            name, api = node.get("name"), node.get("apiId")
            if isinstance(name, str) and isinstance(api, int):
                real = by_name.get(name.lower())
                if real is not None and real != api:
                    errors.append(
                        f"{path} : « {name} » declare apiId {api}, "
                        f"le referentiel donne {real}"
                    )
            for k, v in node.items():
                visit(v, f"{path}/{k}")
        elif isinstance(node, list):
            for i, v in enumerate(node):
                visit(v, f"{path}[{i}]")

    visit(data, "")


def check_currency_mapping(data, errors, warnings):
    """Toute monnaie declaree dans le JSX doit exister dans leg_currency_ids.

    Ce controle existe parce que le Rubis de sang avait ete declare dans la
    liste du JSX sans etre ajoute au mapping de synchro : la synchro directe le
    rattrapait par un repli, le serveur Flask non, et le stock s'affichait a
    zero selon le chemin emprunte.
    """
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        warnings.append("aucun JSX trouve : controle des monnaies saute")
        return
    src = jsx[-1].read_text(encoding="utf-8")
    mapping = (data.get("_meta", {}).get("direct_sync", {}) or {}).get("leg_currency_ids", {})
    known = {api for legmap in mapping.values() for api in legmap.values()}
    declared = {
        int(m.group(2)): m.group(1)
        for m in re.finditer(r'\{\s*id:\s*"([a-z_0-9]+)"[^}]*?apiId:\s*(\d+)', src, re.S)
    }
    for api, cid in sorted(declared.items()):
        if api not in known:
            errors.append(
                f"monnaie '{cid}' (apiId {api}) declaree dans {jsx[-1].name} "
                f"mais absente de _meta.direct_sync.leg_currency_ids"
            )


def check_karma_budgets(data, errors, warnings):
    """Somme des lignes = total, et chaque sub/bit reference doit exister."""
    def visit(node, path):
        if isinstance(node, dict):
            if "karma_budget" in node:
                kb = node["karma_budget"]
                lines = kb.get("lines") or []
                total = sum(l.get("amount", 0) for l in lines)
                if kb.get("total") != total:
                    errors.append(
                        f"{path}/karma_budget : total annonce {kb.get('total')} "
                        f"contre {total} en sommant les lignes"
                    )
                for l in lines:
                    per, bits = l.get("per"), l.get("bits")
                    if per and bits and l.get("amount") != per * len(bits):
                        errors.append(
                            f"{path}/karma_budget : ligne '{_lbl(l)}' annonce {l.get('amount')} "
                            f"contre {per} x {len(bits)}"
                        )
                    subs = node.get("subcollections") or {}
                    sub = l.get("sub")
                    if sub and subs and sub not in subs:
                        errors.append(f"{path}/karma_budget : sous-collection inconnue '{sub}'")
                    elif sub and subs:
                        known = {i.get("bit") for i in subs[sub].get("items", [])}
                        for b in ([l["bit"]] if "bit" in l else (bits or [])):
                            if known and b not in known:
                                errors.append(
                                    f"{path}/karma_budget : ligne '{_lbl(l)}' vise le bit {b} "
                                    f"absent de {sub}"
                                )
            for k, v in node.items():
                visit(v, f"{path}/{k}")
        elif isinstance(node, list):
            for i, v in enumerate(node):
                visit(v, f"{path}[{i}]")
    visit(data, "")


def _lbl(line):
    lab = line.get("label")
    return lab.get("fr", "?") if isinstance(lab, dict) else str(lab)


def walk(node, path, hits):
    if isinstance(node, dict):
        for k, v in node.items():
            if k in FORBIDDEN_KEYS:
                hits.append(f"{path}/{k}")
            walk(v, f"{path}/{k}", hits)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, f"{path}[{i}]", hits)


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else latest_sources()
    data = json.loads(path.read_text(encoding="utf-8"))
    names = load_ref()
    errors, warnings = [], []

    # 1. Aucune liste curee hors de meta_eligible
    hits = []
    for key, value in data.items():
        if key == "meta_eligible":
            continue
        walk(value, f"/{key}", hits)
    for h in hits:
        errors.append(f"liste curee hors de meta_eligible : {h}")

    # 2. Champs qui redupliquent une donnee disponible ailleurs
    dupes = []
    walk_dupes(data, "", dupes)
    for where, why in dupes:
        errors.append(f"donnee dupliquee : {where} ({why})")

    # 3. Provenance : verified / checked / ref vont ensemble
    prov = []
    walk_provenance(data, "", prov)
    for where, has, miss in prov:
        warnings.append(f"provenance incomplete : {where} porte {has}, il manque {miss}")

    # 4. Coherence des budgets karma
    check_karma_budgets(data, errors, warnings)

    # 5. Monnaies du JSX presentes dans le mapping de synchro
    check_currency_mapping(data, errors, warnings)

    # 6. Concordance nom <-> apiId contre le referentiel materiaux
    check_api_ids(data, errors, warnings)

    # 7. Quantites des composants alignees sur les requis du JSX
    check_qty_vs_jsx(data, errors, warnings)

    # 8. Monnaies declarees mais sans quantite rattachee
    check_missing_qty(data, errors, warnings)

    # 9. Sources gratuites et repetables sur les gros postes
    check_free_sources(data, errors, warnings)

    # 10. Champs editoriaux effectivement rendus
    check_unrendered_fields(data, errors, warnings)

    # 11. Integrite de chaque entree de meta_eligible
    metas = data.get("meta_eligible", {})
    if not metas:
        warnings.append("meta_eligible est vide ou absent")

    total = 0
    for mid, entry in metas.items():
        label = f"meta_eligible[{mid}]"
        if not mid.isdigit():
            errors.append(f"{label} : la cle doit etre l'id numerique du meta")
        unknown = set(entry) - SCHEMA
        if unknown:
            warnings.append(f"{label} : champs inattendus {sorted(unknown)}")
        for field in ("name", "threshold", "source", "verified", "achievements"):
            if field not in entry:
                errors.append(f"{label} : champ obligatoire manquant '{field}'")
        achievements = entry.get("achievements") or []
        total += len(achievements)

        ids = []
        for row in achievements:
            if not (isinstance(row, list) and len(row) == 2 and isinstance(row[0], int)):
                errors.append(f"{label} : entree mal formee {row!r}, attendu [id, nom]")
                continue
            ids.append(row[0])
            if names is not None and row[0] not in names:
                errors.append(f"{label} : id {row[0]} ({row[1]}) absent du referentiel")
            elif names is not None and names[row[0]] != row[1]:
                warnings.append(
                    f"{label} : id {row[0]} nomme '{row[1]}' ici, "
                    f"'{names[row[0]]}' dans le referentiel"
                )

        if len(ids) != len(set(ids)):
            dupes = sorted({i for i in ids if ids.count(i) > 1})
            errors.append(f"{label} : ids en double {dupes}")

        threshold = entry.get("threshold")
        if isinstance(threshold, int) and ids and threshold > len(ids):
            errors.append(
                f"{label} : seuil {threshold} superieur aux {len(ids)} objectifs listes — "
                "la liste est incomplete"
            )

    print(f"Fichier   : {path.name}")
    print(f"Duplications : {len(dupes)} · provenance incomplete : {len(prov)}")
    print(f"Metas     : {len(metas)} / {total} objectifs cures")
    print(f"Referentiel : {'charge' if names else 'ABSENT — validation des ids sautee'}")

    for w in warnings:
        print(f"  ATTENTION  {w}")
    for e in errors:
        print(f"  ERREUR     {e}")

    if errors:
        print(f"\nEchec : {len(errors)} erreur(s). Ne pas pousser en l'etat.")
        return 1
    print(f"\nOK{f' — {len(warnings)} avertissement(s)' if warnings else ''}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
