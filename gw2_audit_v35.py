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

Seconde regle, meme raisonnement applique aux plafonds. Un plafond ecrit en
prose ("25 noeuds/jour", "365/sem") s'affiche mais ne se filtre pas : il est
invisible du calcul de cadence, donc absent des projections de delai et de tout
futur regroupement des timegates lancables en parallele. Tout plafond chiffre
doit donc exister sous forme structuree dans cadence.sources[], ou pointer vers
l'entite qui la porte via cadence_ref. Ce script echoue sinon.

Usage :
    python3 gw2_audit_v32.py gw2_sources_v214.json
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
# Champs de documentation interne : ils decrivent une convention du fichier, pas
# une information de jeu. Les rendre n'aurait aucun sens.
NOT_FOR_DISPLAY = {"_note", "note_schema", "qty_schema_note", "notes",
                   "editorial_principle", "meta_eligible_note", "achievement_notes_note",
                   "i18n_note", "i18n_zones_note", "apiid_fix_note", "armory_map_fix_note",
                   "common_required_scope", "flat_vs_chain_rule", "raw_materials_scope",
                   "recipe_tree_caveat",
                   "free_repeatable_note", "apiId_fix", "how",
                   "paid_repeatable_ref", "paid_repeatable_unknown", "total_ref", "free_sources_note_ref",
                   "note_ordering", "note_ordering_ref", "name_api", "how_fr_missing",
                   "collections_order_ref", "component_ref", "legendary_ref",
                   "collections_none_ref", "flat_removed_ref", "total_ref",
                   "total_unknown_ref", "how_ref", "cadence_ref_note"}


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
        # Un constat d'absence explicite vaut reponse : certains postes n'ont
        # reellement aucune source gratuite, et le dire est l'information utile.
        # Un composant fabrique herite du verdict de ses ingredients : le declarer
        # payant parce qu'il ne tombe pas tel quel serait faux.
        if comp.get("free_sources_note") or comp.get("free_via_ingredients"):
            continue
        srcs = comp.get("sources") or []
        if any(isinstance(s, dict) and s.get("free_repeatable") for s in srcs):
            continue
        # Payant n'est pas introuvable. Un vendeur renouvelable, meme plafonne,
        # EST une piste : c'est meme la seule pour les eclats de Janthir et le
        # Seer Runestone. On ne le signale qu'a titre indicatif, et seulement
        # quand le plafond n'est pas chiffre.
        payantes = [s for s in srcs if isinstance(s, dict) and s.get("paid_repeatable")]
        if payantes:
            if not any(s.get("paid_cap") for s in payantes):
                warnings.append(
                    f"craft_components/{cid} : seule piste payante-renouvelable, sans plafond "
                    "chiffre — la cadence d'achat reste inconnue"
                )
            continue
        warnings.append(
            f"craft_components/{cid} : exige au moins 100 unites et n'a aucune piste "
            "renouvelable, ni gratuite ni payante"
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
            # Un composant peut atteindre le legendaire PAR LA CHAINE plutot
            # qu'en direct : les six monnaies LW3 d'Aurora passent par le Gift
            # of Bloodstone Magic et le Gift of Dragon Magic. La regle datait
            # d'un temps ou tout etait a plat ; exiger une cle directe
            # signalerait comme invisible ce que la cascade voit tres bien.
            if not _atteint(cid, legid, comps):
                warnings.append(
                    f"craft_components/{cid} : declare pour '{legid}' cote JSX, et ni son qty "
                    "ni aucune chaine ne le relie a ce legendaire — invisible du grand total"
                )


# Champs qui documentent le SCHEMA, a destination de qui edite le fichier, et
# non du joueur. Les exiger a l'ecran serait un contresens : ils expliquent
# pourquoi la donnee est structuree ainsi, pas ce que le joueur doit faire.
# La convention est un suffixe ou un prefixe explicite, pas une liste de noms
# a rallonge — sans quoi on se retrouverait a y ajouter chaque avertissement
# genant, ce qui viderait la regle de son sens.
DOC_FIELD_MARKERS = ("_deprecated", "rationale", "note_id", "note_schema")
DOC_FIELD_PATHS = ("/tab_contract/", "/trophy_matrix/", "_note")


def _is_doc_field(name, path):
    return name in DOC_FIELD_MARKERS or any(m in path for m in DOC_FIELD_PATHS)


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
        # achievement_notes est indexe par id de succes : la cle est une donnee,
        # pas un nom de champ, et le rendu se fait par lookup.
        if key in NOT_FOR_DISPLAY or key.isdigit():
            continue
        # La documentation du schema n'a pas vocation a s'afficher : elle
        # explique pourquoi la donnee est structuree ainsi, a qui edite le
        # fichier. Toutes ses occurrences doivent l'etre, sinon c'est un vrai
        # champ editorial qui se cache derriere un nom de documentation.
        if all(_is_doc_field(key, p) for p in paths):
            continue
        if key not in src:
            warnings.append(
                f"champ editorial jamais rendu : '{key}' ({len(paths)} occurrence(s), "
                f"ex. {paths[0][:70]}) — ecrit dans les sources, absent du JSX"
            )


def _atteint(cid, legid, comps, profondeur=0):
    """Le composant atteint-il ce legendaire, en direct ou par la cascade ?

    On remonte de parent en parent : si un maillon de la chaine porte le
    legendaire dans son qty, le composant est bien compte. La profondeur est
    bornee pour qu'une reference circulaire ne boucle pas.
    """
    if profondeur > 8:
        return False
    qty = (comps.get(cid) or {}).get("qty")
    if not isinstance(qty, dict):
        return False
    for cle in qty:
        base = cle.split("__")[0]
        if base == legid:
            return True
        if cle in comps and _atteint(cle, legid, comps, profondeur + 1):
            return True
    return False


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
            # Les devises de portefeuille (id < 1000) ne sont pas dans le
            # referentiel materiaux : un homonyme d'objet n'y prouve rien.
            if isinstance(name, str) and isinstance(api, int) and api >= 1000:
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


CAP_PATTERNS = [
    r"(\d[\d\s\u00a0\u202f]*)\s*(?:/|par\s+)\s*(?:jour|j\b|day)\b",
    r"(\d[\d\s\u00a0\u202f]*)\s*(?:/|par\s+)\s*(?:semaine|sem\b|week|wk)\b",
    r"(?:plafonn\w+|\bcapp?\b|\bcapp\w+|limit\w+)\s*(?:a|\u00e0|de|of)?\s*(\d[\d\s\u00a0\u202f]*)",
    r"(\d[\d\s\u00a0\u202f]*)\s*(?:par|/)\s*(?:saison|season)\b",
]
CAP_RX = [re.compile(p, re.I) for p in CAP_PATTERNS]

# Le changelog decrit l'histoire du fichier, il n'exprime aucun plafond de jeu.
CAP_IGNORED_ROOTS = {"_meta"}

# Champs dont la raison d'etre est de dire qu'un plafond n'est PAS la cadence de
# l'entite. Y exiger une cadence structuree reviendrait a demander de modeliser
# une cadence qu'on vient justement d'ecarter.
CAP_DISCLAIMER_FIELDS = {"not_a_source", "aside", "discontinued_note"}


def _cap_hit(text):
    """Renvoie le premier plafond chiffre trouve dans un texte, sinon None."""
    for rx in CAP_RX:
        m = rx.search(text)
        if m:
            return m.group(0).strip()
    return None


# Familles ou une prose appartient a une entite identifiable, qui peut donc
# porter une cadence ou un cadence_ref.
CAP_FAMILIES = ("craft_components", "legendaries", "armor_sets", "collection_unlocks")


def _cap_owner(path):
    """Entite responsable d'une prose : le composant, le legendaire ou le set."""
    parts = path.strip("/").split("/")
    if parts[0] in CAP_FAMILIES and len(parts) > 1:
        return f"{parts[0]}/{parts[1]}"
    return parts[0]


def _walk_caps(node, path, hits):
    if isinstance(node, dict):
        for k, v in node.items():
            _walk_caps(v, f"{path}/{k}", hits)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            _walk_caps(v, f"{path}[{i}]", hits)
    elif isinstance(node, str):
        if any(f"/{field}" in path for field in CAP_DISCLAIMER_FIELDS):
            return
        found = _cap_hit(node)
        if found:
            hits.append((path, found))


def check_orphan_caps(data, errors, warnings):
    """Un plafond chiffre en prose doit exister en cadence structuree.

    Une phrase comme "plafonnes a 25 noeuds/jour" se lit mais ne se calcule pas.
    Elle reste donc hors des projections de delai et hors de tout regroupement
    des timegates lancables a un instant donne : le joueur voit le texte et
    refait le calcul de tete, ce qui est exactement le travail qu'on veut
    supprimer. La donnee doit vivre dans cadence.sources[] (period, cap, cost),
    la ou le calcul la lit deja.

    Echappatoire legitime et verifiable : cadence_ref, qui declare que la
    cadence structuree est portee par une autre entite. Le pointeur est
    resolu ici, et pointer vers une entite sans cadence reste une erreur.
    """
    def entity(owner):
        family, _, ident = owner.partition("/")
        if family not in CAP_FAMILIES:
            return None
        node = data.get(family, {}).get(ident)
        return node if isinstance(node, dict) else None

    def structured(owner, seen=()):
        """Vrai si l'entite porte une cadence, directement ou par pointeur."""
        node = entity(owner)
        if not isinstance(node, dict):
            return False
        cadence = node.get("cadence")
        if isinstance(cadence, dict) and cadence.get("sources"):
            return True
        # Une entite peut dependre de plusieurs plafonds distincts : Aurora est
        # bornee a la fois par la pierre runique druidique et par le lingot
        # d'electrum. cadence_ref accepte donc une liste, et il suffit qu'un
        # pointeur resolve pour que la prose ne soit plus orpheline.
        refs = node.get("cadence_ref")
        if isinstance(refs, str):
            refs = [refs]
        if not isinstance(refs, list):
            return False
        ok = False
        for ref in refs:
            if not isinstance(ref, str) or ref in seen:
                continue
            target = ref if "/" in ref else f"craft_components/{ref}"
            if entity(target) is None:
                errors.append(
                    f"{owner} : cadence_ref pointe vers '{ref}', qui n'existe pas"
                )
                continue
            if structured(target, seen + (ref,)):
                ok = True
            else:
                errors.append(
                    f"{owner} : cadence_ref pointe vers '{ref}', qui ne porte "
                    "aucune cadence structuree"
                )
        return ok

    hits = []
    for key, value in data.items():
        if key in CAP_IGNORED_ROOTS:
            continue
        _walk_caps(value, f"/{key}", hits)

    by_owner = {}
    for path, found in hits:
        by_owner.setdefault(_cap_owner(path), []).append((path, found))

    for owner in sorted(by_owner):
        if structured(owner):
            continue
        path, found = by_owner[owner][0]
        n = len(by_owner[owner])
        errors.append(
            f"{owner} : plafond '{found}' ecrit en prose ({path}) sans cadence "
            f"structuree ni cadence_ref"
            + (f" — {n} occurrences au total" if n > 1 else "")
        )

    # Cote JSX, meme defaut mais contenu editorial en cours de migration : on le
    # signale sans bloquer, la ou le JSON fait autorite et bloque.
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    text = jsx[-1].read_text(encoding="utf-8")
    lines = []
    for num, line in enumerate(text.split("\n"), 1):
        found = _cap_hit(line)
        if found:
            lines.append((num, found))
    # Regle affinee le 20/08/2026. L'ancienne version signalait TOUTE prose
    # chiffree du JSX, ce qui melait deux choses tres differentes : un plafond
    # qui n'existe nulle part ailleurs, et une phrase qui explique un plafond
    # deja structure. La seconde est utile — c'est meme le role de l'editorial —
    # et la supprimer appauvrirait l'interface sans rien gagner. Seule la
    # premiere est une faute.
    #
    # Le depart se fait sur la VALEUR : si un cap identique existe quelque part
    # dans cadence.sources[], la prose ne fait que le redire.
    caps_structures = set()
    for comp in (data.get("craft_components") or {}).values():
        cadence = comp.get("cadence")
        if not isinstance(cadence, dict):
            continue
        for src_ in cadence.get("sources") or []:
            if isinstance(src_, dict) and isinstance(src_.get("cap"), int):
                caps_structures.add(src_["cap"])

    orphelines = []
    for num, found in lines:
        nombres = {int(n) for n in re.findall(r"\d+", found.replace("\u202f", "").replace("\u00a0", ""))}
        # Une somme de plafonds structures compte comme couverte : 455/semaine
        # est 365 plus 90, deux valeurs qui existent bien en cadence.
        sommes = {a + b for a in caps_structures for b in caps_structures}
        if nombres & (caps_structures | sommes):
            continue
        orphelines.append((num, found))

    if orphelines:
        apercu = ", ".join(f"L{n} '{f}'" for n, f in orphelines[:5])
        warnings.append(
            f"{jsx[-1].name} : {len(orphelines)} plafond(s) en prose sans equivalent chiffre "
            f"dans une cadence ({apercu}) — a remonter, sous peine de rester hors du calcul"
        )


# Drapeaux portes par cadence.sources[] : ce sont des booleens, donc invisibles
# du controle des champs bilingues. Un drapeau que le JSX ne lit pas modifie une
# projection sans que rien ne le montre — le pire des silences.
CADENCE_SOURCE_FIELDS = {
    "label", "period", "cap", "cost", "verified", "checked", "ref",
    "rng", "per_character",
    # Lus par l'arbitrage Magnetite de l'onglet des cadences.
    "isBudget", "magnetite",
}


def check_cadence_flags(data, errors, warnings):
    """Chaque champ de cadence.sources[] doit exister et etre lu par le JSX.

    cap et period pilotent la projection de delai ; rng et per_character la
    corrigent. Ajouter un drapeau sans le brancher laisse une estimation fausse
    et d'apparence normale, ce qui est plus dangereux qu'une estimation absente.
    """
    seen = {}
    for cid, comp in data.get("craft_components", {}).items():
        cadence = comp.get("cadence")
        if not isinstance(cadence, dict):
            continue
        for i, src_ in enumerate(cadence.get("sources") or []):
            if not isinstance(src_, dict):
                errors.append(f"craft_components/{cid} : cadence.sources[{i}] n'est pas un objet")
                continue
            if "period" not in src_ or "cap" not in src_:
                errors.append(
                    f"craft_components/{cid} : cadence.sources[{i}] sans period ou sans cap — "
                    "illisible par la projection de delai"
                )
            for field in src_:
                seen.setdefault(field, []).append(f"{cid}[{i}]")

    unknown = sorted(set(seen) - CADENCE_SOURCE_FIELDS)
    for field in unknown:
        errors.append(
            f"cadence.sources[] : champ '{field}' non declare "
            f"(ex. {seen[field][0]}) — a ajouter a CADENCE_SOURCE_FIELDS ou a supprimer"
        )

    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    text = jsx[-1].read_text(encoding="utf-8")
    for field in sorted(seen):
        if field in CADENCE_SOURCE_FIELDS and field not in text:
            warnings.append(
                f"cadence.sources[].{field} : {len(seen[field])} occurrence(s) dans les "
                f"sources (ex. {seen[field][0]}), aucune lecture dans {jsx[-1].name} — "
                "la projection l'ignore silencieusement"
            )


# Types de porte lisibles par machine. Chacun doit correspondre a une donnee que
# l'API du compte expose reellement, sinon le filtre d'eligibilite ne peut pas
# trancher et se met a masquer des collections jouables.
# Champs supplementaires admis par type de porte. Une maitrise porte track et
# tier : l'API ne rend que des identifiants numeriques, mais elle rend aussi le
# niveau atteint par piste, et comparer ce niveau au palier suffit a trancher
# sans table de correspondance des noms.
GATE_EXTRA = {"mastery": {"track", "tier"}}

GATE_TYPES = {
    "mastery": "name",        # /v2/account/masteries (scope progression)
    "fractal_scale": "value",  # /v2/account.fractal_level
    "expansion": "name",       # /v2/account.access
    "achievement": "id",       # /v2/account/achievements
    "item": "id",              # stock agrege (banque, sacs, partage)
    "currency": "id",          # /v2/account/wallet
}
UNLOCK_FIELDS = {"legendary", "key", "text", "gate", "cadence_ref",
                 "verified", "checked", "ref"}


def check_collection_unlocks(data, errors, warnings):
    """Le deblocage des collections : prose exacte, porte testable.

    text dit COMMENT debloquer, gate dit SI c'est debloque. Seul gate se filtre.
    Une porte mal formee est pire qu'une porte absente : l'absence laisse la
    collection visible, une porte cassee peut la faire disparaitre de l'onglet
    alors que le joueur pouvait la lancer.
    """
    unlocks = data.get("collection_unlocks")
    if not isinstance(unlocks, dict):
        warnings.append("collection_unlocks absent : aucun bloc de deblocage cote sources")
        return

    legs = data.get("legendaries", {})
    for aid, entry in sorted(unlocks.items()):
        label = f"collection_unlocks[{aid}]"
        if not aid.isdigit():
            errors.append(f"{label} : la cle doit etre l'id numerique du succes")
        unknown = sorted(set(entry) - UNLOCK_FIELDS)
        if unknown:
            errors.append(f"{label} : champs inattendus {unknown}")

        text = entry.get("text")
        if not (isinstance(text, dict) and text.get("fr") and text.get("en")):
            errors.append(f"{label} : text doit porter fr et en")

        # legendary est une liste : un succes partage entre deux legendaires ne
        # doit exister qu'une fois, sous peine de deux textes qui divergent.
        owners = entry.get("legendary")
        if not (isinstance(owners, list) and owners):
            errors.append(f"{label} : legendary doit etre une liste non vide")
        else:
            for lid in owners:
                if lid not in legs:
                    errors.append(f"{label} : legendary '{lid}' absent de legendaries")

        for i, gate in enumerate(entry.get("gate") or []):
            glabel = f"{label}.gate[{i}]"
            if not isinstance(gate, dict):
                errors.append(f"{glabel} : n'est pas un objet")
                continue
            gtype = gate.get("type")
            if gtype not in GATE_TYPES:
                errors.append(
                    f"{glabel} : type '{gtype}' inconnu — l'API du compte ne sait pas "
                    f"le trancher (attendus : {', '.join(sorted(GATE_TYPES))})"
                )
                continue
            required = GATE_TYPES[gtype]
            if gate.get(required) in (None, ""):
                errors.append(f"{glabel} : type '{gtype}' exige le champ '{required}'")
            admis = {"type", required, "note"} | GATE_EXTRA.get(gtype, set())
            if gtype == "mastery" and ("track" in gate) != ("tier" in gate):
                errors.append(
                    f"{glabel} : track et tier se posent ensemble — un palier sans piste, ou "
                    "l'inverse, ne se compare a rien"
                )
            for extra in set(gate) - admis:
                errors.append(f"{glabel} : champ '{extra}' hors schema pour le type '{gtype}'")

    # Un unlock reste-t-il en dur dans le JSX ? Deux sources de verite pour la
    # meme phrase, c'est la derive garantie.
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if jsx:
        text = jsx[-1].read_text(encoding="utf-8")
        left = text.count("unlock: {")
        if left:
            warnings.append(
                f"{jsx[-1].name} : {left} bloc(s) unlock encore ecrits en dur dans le JSX — "
                "ils font doublon avec collection_unlocks depuis la migration"
            )
        if "collection_unlocks" not in text:
            warnings.append(
                "collection_unlocks n'est lu nulle part dans le JSX — les blocs de "
                "deblocage ne s'afficheront pas tant que la passe finale n'est pas faite"
            )


def check_guide_coverage(data, errors, warnings):
    """L'onglet Guide doit s'ouvrir sur la donnee, pas sur un drapeau.

    Il ne contient rien : il rend legendaries[].guide. Tant que son ouverture
    dependait d'un isGuideTrinket ecrit a la main, les deux ensembles ont
    derive — deux guides rediges que rien n'affichait, un onglet ouvert sur du
    vide. La condition doit donc etre la presence du guide lui-meme.
    """
    tabs = (data.get("tab_contract") or {}).get("tabs") or {}
    when = (tabs.get("guide") or {}).get("when") or {}
    if when.get("present") != "guide" or when.get("from") != "sources":
        errors.append(
            "tab_contract.tabs[guide].when doit etre {present: 'guide', from: 'sources'} — "
            "toute autre condition reintroduit la derive entre guides ecrits et guides affiches"
        )

    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    text = jsx[-1].read_text(encoding="utf-8")
    n = text.count("isGuideTrinket")
    if n:
        warnings.append(
            f"{jsx[-1].name} : isGuideTrinket apparait {n} fois alors que le contrat pilote "
            "desormais l'onglet Guide — drapeau residuel"
        )


def check_chars_tab_duplication(data, errors, warnings):
    """Le rendement des monnaies de carte ne doit exister qu'en cadence.

    L'onglet Persos derivait un rendement quotidien de champs propres
    (farmType, perCharPerDay, perAccountPerDay) tenus dans le JSX. Depuis que
    ces plafonds sont en cadence, les garder ferait deux chiffres pour une
    seule realite, et rien ne garantirait qu'ils bougent ensemble.
    """
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    text = jsx[-1].read_text(encoding="utf-8")
    # farmType est volontairement absent : il vit encore sur les metas, ou il
    # pilote un badge affiche. Seuls les champs de rendement chiffre faisaient
    # doublon avec la cadence.
    for field in ("perCharPerDay", "perAccountPerDay", "heartBundle"):
        n = text.count(field)
        if n:
            warnings.append(
                f"{jsx[-1].name} : {field} apparait {n} fois — le rendement des monnaies de "
                "carte vit desormais en cadence, ce champ fait doublon"
            )


TAB_PREDICATES = {"count", "flag", "present", "any_of", "computed"}
TAB_FIELDS = {"label", "when", "replaces", "rationale"}


def _tab_predicate_errors(pred, label, rules, out):
    if not isinstance(pred, dict):
        out.append(f"{label} : le predicat n'est pas un objet")
        return
    kinds = sorted(set(pred) & TAB_PREDICATES)
    if len(kinds) != 1:
        out.append(
            f"{label} : un predicat porte exactement un type parmi "
            f"{', '.join(sorted(TAB_PREDICATES))} (trouve : {kinds or 'aucun'})"
        )
        return
    kind = kinds[0]
    if kind == "any_of":
        subs = pred["any_of"]
        if not isinstance(subs, list) or not subs:
            out.append(f"{label} : any_of doit etre une liste non vide")
            return
        for i, sub in enumerate(subs):
            _tab_predicate_errors(sub, f"{label}.any_of[{i}]", rules, out)
        return
    if kind == "count" and not isinstance(pred.get("min"), int):
        out.append(f"{label} : un predicat count exige un min entier")
    if kind == "computed" and pred["computed"] not in rules:
        out.append(
            f"{label} : regle calculee '{pred['computed']}' non declaree dans "
            "tab_contract.computed_rules — une regle non nommee est une liste noire deguisee"
        )
    for extra in set(pred) - {kind, "min", "from"}:
        out.append(f"{label} : champ '{extra}' hors schema pour un predicat {kind}")


def check_tab_contract(data, errors, warnings):
    """L'ouverture d'un onglet se deduit de la donnee, jamais d'une liste d'ids.

    Une condition ecrite en dur dans le JSX oblige a modifier du code a chaque
    legendaire ajoute, et la regle n'existe alors nulle part : elle est
    eparpillee dans une negation. Le contrat la rend lisible et verifiable.
    """
    contract = data.get("tab_contract")
    if not isinstance(contract, dict):
        warnings.append("tab_contract absent : l'ouverture des onglets reste codee dans le JSX")
        return

    tabs = contract.get("tabs")
    order = contract.get("order")
    rules = contract.get("computed_rules") or {}
    if not isinstance(tabs, dict) or not tabs:
        errors.append("tab_contract.tabs doit etre un objet non vide")
        return
    if not isinstance(order, list):
        errors.append("tab_contract.order doit etre une liste")
        order = []

    missing = sorted(set(tabs) - set(order))
    extra = sorted(set(order) - set(tabs))
    if missing:
        errors.append(f"tab_contract.order : onglets definis mais jamais ordonnes {missing}")
    if extra:
        errors.append(f"tab_contract.order : onglets ordonnes mais jamais definis {extra}")
    if len(order) != len(set(order)):
        errors.append("tab_contract.order : un onglet apparait deux fois")

    for tid, spec in sorted(tabs.items()):
        label = f"tab_contract.tabs[{tid}]"
        if not isinstance(spec, dict):
            errors.append(f"{label} : n'est pas un objet")
            continue
        for unknown in sorted(set(spec) - TAB_FIELDS):
            errors.append(f"{label} : champ inattendu '{unknown}'")
        lab = spec.get("label")
        if not (isinstance(lab, dict) and lab.get("fr") and lab.get("en")):
            errors.append(f"{label} : label doit porter fr et en")
        if "when" not in spec:
            errors.append(f"{label} : aucun predicat when — l'onglet s'ouvrirait toujours")
        else:
            _tab_predicate_errors(spec["when"], f"{label}.when", rules, errors)

    for name in sorted(rules):
        if not isinstance(rules[name], dict) or not rules[name].get("fr"):
            errors.append(f"tab_contract.computed_rules[{name}] : doit etre decrite en fr et en en")

    # Un onglet remplace ne doit pas subsister sous son ancien nom.
    replaced = {old for spec in tabs.values() if isinstance(spec, dict)
                for old in (spec.get("replaces") or [])}
    for old in sorted(replaced & set(tabs)):
        errors.append(
            f"tab_contract : '{old}' est declare remplace et existe pourtant toujours comme onglet"
        )

    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    text = jsx[-1].read_text(encoding="utf-8")
    if "tab_contract" not in text:
        warnings.append(
            "tab_contract n'est lu nulle part dans le JSX — les onglets restent construits par "
            "les listes d'identifiants tant que la passe finale n'est pas faite"
        )
    for old in sorted(replaced | {"chars"}):
        if f'id: "{old}"' in text:
            warnings.append(
                f'{jsx[-1].name} : l\'onglet "{old}" est encore construit en dur alors que le '
                "contrat le remplace"
            )


# Suffixes de cle admis dans qty. Les deux premiers sont lus par le JSX ; les
# deux suivants sont declares mais pas encore branches, et l'audit le rappelle.
QTY_SUFFIXES = ("__per_piece", "__full_set", "__per_unit", "__onetime")
QTY_SUFFIXES_RENDUS = ("__per_piece", "__full_set")


def check_qty_levels(data, errors, warnings):
    """Une quantite ne veut pas dire la meme chose selon sa cle.

    Dans qty, une cle qui designe un COMPOSANT est une quantite PAR PARENT, que
    la cascade multiplie. Une cle qui designe un LEGENDAIRE est un total deja
    aplati, lu tel quel. Meme syntaxe, deux sens : c'est la source des erreurs
    de facteur constatees sur ce projet (Dragonite 250 au lieu de 100,
    reliques d'Ad Infinitum a un facteur 7, Branded Mass 300 au lieu de 660).
    Le nom d'une cle inconnue des deux mondes est une faute de frappe qui fait
    disparaitre une exigence en silence.
    """
    comps = data.get("craft_components", {})
    legs = set(data.get("legendaries", {}))
    node = data.get("armor_sets")
    if isinstance(node, dict):
        legs |= set(node)
    # Pseudo-legendaires du selecteur, sans entree propre cote sources.
    legs |= {"t6", "weapons", "trinkets", "upgrades", "prismatic", "obsidian",
             "gen1_all", "gen2_all", "gen3_all", "legendary_trinkets"}

    for cid, comp in sorted(comps.items()):
        qty = comp.get("qty")
        if not isinstance(qty, dict):
            continue
        par_parent, aplatis, inconnues = [], [], []
        for key, val in qty.items():
            if isinstance(val, str):
                continue  # quantite variable, affichee telle quelle
            if not isinstance(val, (int, float)):
                errors.append(f"craft_components/{cid} : qty['{key}'] n'est pas un nombre")
                continue
            # Suffixes du calcul des sets d'armure, resolus avant de trancher.
            base = key
            for suffix in QTY_SUFFIXES:
                if base.endswith(suffix):
                    base = base[: -len(suffix)]
            key = base
            if key in comps:
                par_parent.append(key)
            elif key in legs or key.startswith(("gen1_", "gen2_", "gen3_", "armor_")):
                aplatis.append(key)
            else:
                inconnues.append(key)
        for key in sorted(inconnues):
            errors.append(
                f"craft_components/{cid} : qty['{key}'] ne designe ni un composant ni un "
                "legendaire connu — l'exigence ne sera comptee nulle part"
            )
        # Un composant peut legitimement etre exige EN DIRECT par un legendaire
        # et PAR PARENT via un intermediaire : les gifts condenses sont demandes
        # par le Mystic Tribute et, separement, par Selachimorpha. Ce melange
        # n'est suspect que si les deux chemins aboutissent au MEME legendaire,
        # auquel cas l'exigence est comptee deux fois.
        if par_parent and aplatis:
            # La portee d'un parent est TRANSITIVE. Ne regarder qu'un cran au
            # dessus laissait passer les chaines : jade_runestone portait 100 en
            # direct sur seize gen3 ET une arete vers gift_of_the_dragon_empire,
            # dont le qty ne cite aucun legendaire mais gift_of_jade_mastery,
            # qui les cite tous. Deux cents runes de jade annoncees au lieu de
            # cent, sans un mot de l'audit.
            def _portee(cid_, vu=None):
                if vu is None:
                    vu = set()
                if cid_ in vu:
                    return set()
                vu.add(cid_)
                out = set()
                for k in (comps.get(cid_, {}).get("qty") or {}):
                    b = k.split("__")[0]
                    if b in comps:
                        out |= _portee(b, vu)
                    else:
                        out.add(b)
                return out

            # Atteindre n'est pas compter. glob_of_ectoplasm atteint Aurora par
            # huit chemins qui, tous, valent zero pour ce legendaire : la cle a
            # plat est seule a compter et il n'y a aucun doublon. On n'avertit
            # donc que si la cascade contribue REELLEMENT.
            def _total(leg):
                t, exp = {}, {}
                for c2, comp2 in comps.items():
                    v = (comp2.get("qty") or {}).get(leg)
                    if isinstance(v, int):
                        t[c2] = t.get(c2, 0) + v
                for _ in range(10):
                    add = {}
                    for c2, comp2 in comps.items():
                        for k2, v2 in (comp2.get("qty") or {}).items():
                            if isinstance(v2, int) and k2 in comps and t.get(k2, 0) > 0:
                                add[c2] = add.get(c2, 0) + v2 * t[k2]
                    bouge = False
                    for c2, v2 in add.items():
                        if exp.get(c2, 0) != v2:
                            t[c2] = t.get(c2, 0) - exp.get(c2, 0) + v2
                            exp[c2] = v2
                            bouge = True
                    if not bouge:
                        break
                return t

            atteints = set()
            for parent in par_parent:
                for lid in _portee(parent):
                    if _total(lid).get(parent, 0) > 0:
                        atteints.add(lid)
            # Un chevauchement peut etre legitime : Vision demande 250
            # ectoplasmes au titre de l'exigence commune a tous les
            # legendaires, PLUS 300 pour ses encapsulateurs. Le declarer se
            # fait entite par entite, avec provenance, et non en assouplissant
            # la regle — sinon le prochain vrai doublon passerait aussi.
            verifies = set(comp.get("qty_overlap_verified") or [])
            for lid in verifies:
                if lid not in {a.split("__")[0] for a in aplatis}:
                    warnings.append(
                        f"craft_components/{cid} : qty_overlap_verified cite '{lid}', qui n'est "
                        "pas un total aplati de ce composant — declaration obsolete"
                    )
            double = sorted(({a.split("__")[0] for a in aplatis} & atteints) - verifies)
            if double:
                warnings.append(
                    f"craft_components/{cid} : '{double[0]}' est atteint a la fois en direct et "
                    f"via {', '.join(sorted(par_parent)[:2])} — l'exigence risque d'etre comptee "
                    "deux fois"
                )

    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if jsx:
        text = jsx[-1].read_text(encoding="utf-8")
        for suffix in QTY_SUFFIXES:
            porteurs = [c for c, comp in comps.items()
                        if isinstance(comp.get("qty"), dict)
                        and any(k.endswith(suffix) for k in comp["qty"])]
            if porteurs and suffix not in text:
                warnings.append(
                    f"suffixe de qty '{suffix}' : {len(porteurs)} composant(s) l'utilisent "
                    f"(ex. {porteurs[0]}), aucune lecture dans {jsx[-1].name} — ces exigences "
                    "ne sont comptees nulle part"
                )

    # Un identifiant present des deux cotes est un piege arme : la cascade lit la
    # cle comme un composant, la boucle de depart la lit comme un legendaire. Tant
    # que le composant homonyme reste a zero, rien ne se voit ; le jour ou il
    # recoit une quantite, chaque exigence est comptee deux fois.
    # Regle durcie le 20/08/2026, une fois le dernier homonyme desamorce : ce
    # n'est plus une dette a surveiller mais une faute a refuser. Un identifiant
    # partage rend TOUTE reference ambigue, et l'ambiguite ne se voit qu'au jour
    # ou elle double une exigence.
    for cid in sorted(set(comps) & legs):
        citants = sorted(c for c, comp in comps.items()
                         if isinstance(comp.get("qty"), dict) and cid in comp["qty"])
        errors.append(
            f"'{cid}' existe a la fois comme composant et comme legendaire"
            + (f", et {len(citants)} composant(s) le citent dans qty "
               f"({', '.join(citants[:3])})" if citants else "")
            + " — renommer l'un des deux ; une cle de qty ne peut pas designer les deux a la fois"
        )

    # Une chaine doit se refermer : tout parent cite doit exister, et needed_for
    # doit refleter le meme lien que qty, sans quoi l'arbre des gifts affiche un
    # composant que le calcul ignore, ou l'inverse.
    for cid, comp in sorted(comps.items()):
        for key in (comp.get("qty") or {}):
            if key in comps and key not in legs:
                nf = comp.get("needed_for") or []
                if key not in nf:
                    warnings.append(
                        f"craft_components/{cid} : qty pointe vers '{key}' mais needed_for ne le "
                        "cite pas — l'arbre des gifts et le calcul divergent"
                    )


# _meta.common_required a ete supprime le 27/08/2026 : c'etait une table
# parallele qui portait des exigences directes la ou l'affichage attendait des
# totaux. La regle qui la comparait a qty disparait avec elle. La source unique
# est desormais craft_components[].qty, developpee par computeGrandTotal.


def check_contract_flags_exist(data, errors, warnings):
    """Un flag demande par tab_contract doit exister dans le JSX.

    Les onglets Armes et Colifichets sont restes morts sans bruit : le contrat
    demandait isWeapons et isTrinkets, le JSX ne connait que isWeaponTracker et
    isTrinketTracker. Un flag inconnu vaut undefined, donc faux, donc l'onglet
    ne s'affiche jamais et rien ne le signale.
    """
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    src = jsx[-1].read_text(encoding="utf-8")
    demandes = set(re.findall(r'"flag":\s*"([^"]+)"', json.dumps(data.get("tab_contract") or {})))
    for flag in sorted(demandes):
        if not re.search(r"\b" + re.escape(flag) + r":\s*true", src):
            errors.append(
                f"tab_contract demande le flag '{flag}', absent de {jsx[-1].name} — "
                "l'onglet ne s'affichera jamais"
            )


def check_no_parallel_common_table(data, errors, warnings):
    """Interdit la resurrection de la table parallele."""
    if "common_required" in (data.get("_meta") or {}):
        errors.append(
            "_meta.common_required est de retour — table parallele supprimee le 27/08/2026 ; "
            "les exigences en materiaux communs vivent dans craft_components[].qty"
        )

def check_obsidian_gift_split(data, errors, warnings):
    """Les gifts condenses d'Obsidienne : 3 et 3, pas 6 de chaque.

    Un set demande une seule gift par piece, mais repartie sur deux types :
    Might sur gants, jambieres et bottes, Magic sur coiffe, epaulieres et
    plastron. La table emplacement -> type vit dans le JSX, liee aux
    identifiants de succes ; la quantite vit dans les sources. Les deux doivent
    concorder, sinon le total d'un set est faux d'un facteur 2 — ce qui a
    reellement ete le cas jusqu'au 20/08/2026.
    """
    cc = data.get("craft_components", {})
    jsx = sorted(
        HERE.glob("gw2_legendary_tracker_v*.jsx"),
        key=lambda p: int(re.search(r"_v(\d+)\.jsx$", p.name).group(1)),
    )
    if not jsx:
        return
    text = jsx[-1].read_text(encoding="utf-8")
    for gid, marqueur in (("gift_of_condensed_might", "mighty"),
                          ("gift_of_condensed_magic", "magical")):
        comp = cc.get(gid)
        if not isinstance(comp, dict):
            continue
        declare = (comp.get("qty") or {}).get("obsidian__full_set")
        if declare is None:
            continue
        # Emplacements portant ce type dans le bloc arcanum du JSX.
        emplacements = len(re.findall(rf'gift:\s*"{marqueur}"', text))
        if emplacements and declare != emplacements:
            errors.append(
                f"craft_components/{gid} : qty['obsidian__full_set'] = {declare} mais "
                f"{emplacements} emplacement(s) portent gift: '{marqueur}' dans le JSX — "
                "la quantite et la repartition par emplacement divergent"
            )
    total = sum(
        len(re.findall(rf'gift:\s*"{m}"', text)) for m in ("mighty", "magical")
    )
    if total and total != 6:
        errors.append(
            f"bloc arcanum : {total} emplacements portent un gift, il en faut exactement 6"
        )


def check_recipe_components(data, errors, warnings):
    """Tout composant cite dans une recette doit exister.

    legendaries[].components enumere ce que la Forge mystique consomme. Un
    identifiant qui n'existe pas dans craft_components est un maillon absent :
    la cascade s'arrete la, et le legendaire annonce moins que son cout reel.
    C'est ainsi que Coalescence affichait zero trophee T6 et que les 21 armes
    gen1 en affichaient autant, faute des gifts Magic et Might.
    """
    cc = data.get("craft_components", {})
    for lid, leg in sorted(data.get("legendaries", {}).items()):
        if not isinstance(leg, dict):
            continue
        for cid in (leg.get("components") or []):
            if isinstance(cid, str) and cid not in cc:
                warnings.append(
                    f"legendaries/{lid} : la recette cite '{cid}', absent de craft_components — "
                    "la chaine s'arrete la, et le cout annonce est incomplet"
                )


def check_precursor_is_tier_three(data, errors, warnings):
    """Le precurseur d'une arme a collections est le titre de son palier III.

    Les collections d'une arme forment une chaine, et le TROISIEME palier est
    celui qui rend le precurseur — son titre le nomme litteralement : Bolt III:
    Zap, HOPE III: Prototype, Nevermore III: The Raven Staff. La regle vaut pour
    les 21 armes gen1 comme pour les quatre gen2 a collections, sans exception.

    Une premiere version de cette regle confrontait le precurseur a l'unlock_item
    du DERNIER palier. Elle tenait sur la gen2, qui a un palier IV ouvert par le
    precurseur, et se trompait sur toute la gen1, qui s'arrete au III : Bolt
    n'ouvre rien avec Zap, il le produit. Bolt l'a fait tomber des sa premiere
    integration. Le palier III est le point fixe des deux familles.

    C'est ainsi que les quatre gen2 de HoT etaient fausses en meme temps :
    Astralaria portait The Device, son palier I ; HOPE portait The Mechanism, qui
    appartient a Astralaria ; Nevermore et Chuka portaient des noms absents de la
    table « Precursor weapon » du wiki.
    """
    for lid, leg in sorted(data.get("legendaries", {}).items()):
        if not isinstance(leg, dict):
            continue
        prec = leg.get("precursor")
        cols = leg.get("collections")
        if not prec or not isinstance(cols, dict):
            continue
        titres = []
        for c in cols.values():
            if not isinstance(c, dict):
                continue
            nom = c.get("name")
            nom = nom.get("en") if isinstance(nom, dict) else nom
            if nom and re.search(r"\bIII\b", nom):
                titres.append(nom)
        if not titres:
            continue  # arme sans palier III : rien a confronter
        attendus = {t.split(": ", 1)[1] for t in titres if ": " in t}
        if attendus and prec not in attendus:
            errors.append(
                f"legendaries/{lid} : precursor '{prec}' mais le palier III s'intitule "
                f"{sorted(titres)} — le palier III nomme le precurseur, "
                "et la table « Precursor weapon » du wiki tranche"
            )


def check_no_flat_weapon_lists(data, errors, warnings):
    """Aucune liste plate d'armes a cote de legendaries.

    gen1_weapons, gen2_weapons et gen3_weapons decrivaient les memes armes que
    legendaries, avec les memes champs, et personne ne les lisait. Elles ont
    derive exactement comme common_required avant elles : quand v182 a retire
    douze fiches inventees de legendaries, les listes plates les ont gardees —
    Tigris promu arme a part entiere alors qu'il est le precurseur de Chuka,
    quatre Aurene's qui n'existent pas. Une donnee qui n'a qu'une source ne peut
    pas diverger d'elle-meme.
    """
    for family in ("gen1_weapons", "gen2_weapons", "gen3_weapons"):
        if family in data:
            errors.append(
                f"{family} : liste plate d'armes recreee a cote de legendaries — "
                "la fiche d'une arme vit dans legendaries et nulle part ailleurs"
            )


def check_collection_name_bilingual(data, errors, warnings):
    """Le nom d'une collection est un couple fr/en, sans exception.

    167 collections le portaient ainsi et quatre en chaine simple — celles
    d'Aurora et de Vision, les plus anciennes du fichier, ecrites avant que la
    convention existe. Le JSX les tolerait par NXS, donc rien ne cassait : la
    divergence etait invisible a l'usage et n'attendait qu'un lecteur plus strict
    pour le devenir. Une meme donnee ne se lit pas de deux formes.

    Le francais ne se fabrique pas : il vient du dump des succes. Une collection
    sans traduction connue porte fr: null, jamais une copie de l'anglais.
    """
    for lid, leg in sorted(data.get("legendaries", {}).items()):
        if not isinstance(leg, dict):
            continue
        for ck, c in sorted((leg.get("collections") or {}).items()):
            if not isinstance(c, dict):
                continue
            nom = c.get("name")
            if nom is None:
                continue
            if not isinstance(nom, dict):
                errors.append(
                    f"legendaries/{lid}/collections/{ck} : name est une chaine "
                    f"({nom!r}) — le nom d'une collection est un couple fr/en"
                )
            elif "en" not in nom or "fr" not in nom:
                errors.append(
                    f"legendaries/{lid}/collections/{ck} : name incomplet "
                    f"({sorted(nom)}) — il faut les deux cles fr et en, fr: null si inconnue"
                )
            elif isinstance(nom.get("fr"), str) and nom["fr"] == nom.get("en"):
                warnings.append(
                    f"legendaries/{lid}/collections/{ck} : name fr identique a en — "
                    "un anglais recopie dans le champ francais n'est pas une traduction"
                )


def check_gen3_precursor_suffix(data, errors, warnings):
    """Le precurseur d'une gen3 reprend le suffixe de l'arme.

    Les seize gen3 suivent une regle sans exception : Aurene's Claw se forge
    depuis Dragon's Claw, Aurene's Argument depuis Dragon's Argument. Le suffixe
    est partage, seul le prefixe change.

    Douze des seize portaient des precurseurs inventes de la forme « Focus of
    Aurene's Wisdom », et les types allaient avec, decales en cascade : Argument
    donne Focus au lieu de Pistol, Gaze Pistol au lieu de Focus. Aucune de ces
    valeurs n'existe dans le jeu. Elles ont survecu au nettoyage de v182, qui
    n'avait corrige que Fang, Flight, Tail et Wing.

    Le don, lui, ne suit PAS toujours : Aurene's Voice se forge avec le « Gift of
    Aurene's Horn ». Cette regle ne controle donc que le precurseur.
    """
    for lid, leg in sorted(data.get("legendaries", {}).items()):
        if not isinstance(leg, dict) or leg.get("gen") != "gen3":
            continue
        nom = leg.get("name") or ""
        prec = leg.get("precursor")
        if not nom.startswith("Aurene's ") or not prec:
            continue
        attendu = "Dragon's " + nom.split("'s ", 1)[1]
        if prec != attendu:
            errors.append(
                f"legendaries/{lid} : precursor '{prec}' mais l'arme s'appelle "
                f"'{nom}' — une gen3 se forge depuis '{attendu}'"
            )


def check_no_duplicate_collection_id(data, errors, warnings):
    """Deux collections d'une meme legendaire ne partagent pas un identifiant.

    Vision portait vision_1 et vis_meta_1 sur le succes 4762, vision_2 et
    vis_meta_2 sur le 4771. Les premieres avaient les champs editoriaux — note
    de deblocage, recompense, sous-collections, les 24 sanctuaires avec carte et
    point de passage. Les secondes n'avaient que les bits de l'API et le total.
    Aucun champ n'entrait en conflit, donc rien ne se contredisait a l'ecran :
    la moitie des donnees etait simplement invisible, rattachee a l'entree que
    le rendu ne regardait pas.

    C'est le motif de common_required et des listes plates d'armes, une fois de
    plus : deux entrees pour une meme chose finissent par diverger, ou par se
    partager l'information sans que personne ne s'en apercoive.
    """
    for lid, leg in sorted(data.get("legendaries", {}).items()):
        if not isinstance(leg, dict):
            continue
        vus = {}
        for ck, c in sorted((leg.get("collections") or {}).items()):
            if not isinstance(c, dict):
                continue
            aid = c.get("id")
            if aid is None:
                continue
            if aid in vus:
                errors.append(
                    f"legendaries/{lid} : les collections '{vus[aid]}' et '{ck}' portent "
                    f"toutes deux le succes {aid} — une seule entree par succes"
                )
            else:
                vus[aid] = ck


def check_needed_for_chiffre(data, errors, warnings):
    """Un lien declare dans needed_for doit porter sa quantite dans qty.

    craft_components decrit deja un arbre de craft complet : `qty` accepte comme
    cle un identifiant de COMPOSANT et non seulement de legendaire, et
    computeGrandTotal propage ces liens en cascade sur six passes. Le graphe
    existe donc, chiffre, jusqu'a la profondeur voulue.

    Mais deux champs decrivent les memes aretes. `needed_for` porte le graphe
    complet, `qty` seulement les aretes chiffrees. La mesure du 05/09/2026 donne
    100 aretes declarees dans needed_for sans quantite correspondante, et ZERO
    dans l'autre sens : `qty` est un sous-ensemble strict. Ce n'est donc pas une
    contradiction entre deux tables, c'est une table complete et une table
    partielle qui se ressemblent.

    La consequence est silencieuse et deja active. L'onglet Composants construit
    son arbre par index inverse sur needed_for, tandis que les totaux se
    calculent sur qty : un composant peut s'afficher sous un gift tout en pesant
    zero dans le cout annonce. gift_of_battle et bloodstone_shard se rangent
    ainsi sous gift_of_mastery sans y compter pour une seule unite.

    Ce controle avertit tant que les quantites manquent. Une fois les 100 aretes
    chiffrees, needed_for devient exactement derivable de qty et n'a plus lieu
    d'etre stocke : le JSX le recalculera par index inverse, et cette regle
    passera en erreur.
    """
    cc = data.get("craft_components", {})
    manquantes = []
    inverses = []
    for cid, comp in sorted(cc.items()):
        if not isinstance(comp, dict):
            continue
        declares = {p for p in (comp.get("needed_for") or []) if p in cc}
        chiffres = {
            str(k).split("__")[0]
            for k in (comp.get("qty") or {})
            if str(k).split("__")[0] in cc
        }
        for parent in sorted(declares - chiffres):
            manquantes.append(f"{cid} -> {parent}")
        for parent in sorted(chiffres - declares):
            inverses.append(f"{cid} -> {parent}")

    if manquantes:
        warnings.append(
            f"needed_for sans quantite : {len(manquantes)} arete(s) declarees et non "
            f"chiffrees dans qty — elles s'affichent dans l'arbre et pesent zero "
            f"dans les totaux. Voir DETTE_ARBRE_CRAFT.md. Liste : "
            + ", ".join(manquantes)
        )
    # Le sens inverse serait plus grave : une quantite propagee par la cascade
    # sans que l'arete soit declaree, donc un cout compte et jamais affiche.
    for lien in inverses:
        errors.append(
            f"qty sans needed_for : {lien} — la cascade compte cette arete mais "
            "l'arbre ne l'affiche pas"
        )


def check_api_id_unique(data, errors, warnings):
    """Deux composants ne peuvent pas porter le meme apiId.

    Un apiId identifie un objet du jeu. Deux entrees qui le partagent decrivent
    donc le meme objet, et l'onglet affiche deux lignes de meme nom dont les
    couts s'additionnent. C'est exactement ce qui faisait annoncer 3700 tickets
    d'escarmouche a Conflux au lieu de 1850, et 600 eclats a Klobjarne au lieu
    de 100.

    Ce controle est arrive apres coup : il aurait attrape les quatre doublons
    d'un coup, sans qu'il faille les decouvrir un par un en rapprochant des noms.
    """
    # Les identifiants de MONNAIE et d'OBJET vivent dans deux espaces separes :
    # 26 designe la monnaie « WvW Skirmish Claim Ticket » et, cote objets, tout
    # autre chose. Comparer les deux ensemble inventerait des collisions.
    cc = data.get("craft_components", {})
    par = {}
    for cid, comp in sorted(cc.items()):
        if not isinstance(comp, dict):
            continue
        ident = comp.get("apiId") or comp.get("apiId_fix")
        if isinstance(ident, int):
            par.setdefault((comp.get("kind") == "currency", ident), []).append(cid)
    for (monnaie, ident), liste in sorted(par.items()):
        if len(liste) > 1:
            errors.append(
                f"apiId {'monnaie ' if monnaie else ''}{ident} porte par {len(liste)} composants : "
                + ", ".join(liste)
                + " — deux entrees pour un meme objet, le cout est compte deux fois"
            )


def check_nom_pluriel_double(data, errors, warnings):
    """Deux composants dont les noms ne different que par des « s ».

    Aucun nom d'OBJET de Guild Wars 2 n'est au pluriel — mais les MONNAIES du
    portefeuille le sont : l'API nomme la 33 « Ascended Shards of Glory ». Le
    doublon singulier/pluriel peut donc opposer un objet invente a un vrai
    objet, ou une monnaie legitime a un objet homonyme. D'ou l'avertissement
    plutot que l'erreur.

    Quatre entrees fictives
    ont pourtant vecu dans la base sous cette forme — Shards of Lowland Shore,
    Shards of Janthir Syntri, Shards of Mistburned Barrens, Shards of Bava
    Nisos — chacune doublant le cout de son singulier. Leurs apiId designaient
    une cape, un sceptre, un gizmo et un skin d'arc long.

    check_api_id_unique ne les attrape pas : elles portaient des identifiants
    differents, faux mais distincts. Le nom est ici le seul signal. La regle
    compare des formes ou tous les « s » ont saute, ce qui rapproche aussi
    « Curious Mursaat Remnant » et « Curious Mursaat Remnants » — un vrai
    couple, l'un etant le conteneur de l'autre. C'est donc un avertissement, a
    lever au cas par cas contre /v2/items.
    """
    cc = data.get("craft_components", {})
    familles = {}
    for cid, comp in sorted(cc.items()):
        if not isinstance(comp, dict):
            continue
        n = comp.get("name")
        n = (n.get("en") or n.get("fr")) if isinstance(n, dict) else n
        if not isinstance(n, str):
            continue
        cle = re.sub(r"[^a-z0-9]", "", n.lower()).replace("s", "")
        familles.setdefault(cle, []).append((cid, n))
    for cle, liste in sorted(familles.items()):
        if len(liste) > 1:
            warnings.append(
                "noms ne differant que par des « s » : "
                + ", ".join(f"{cid} ({n})" for cid, n in liste)
                + " — a verifier contre /v2/items, aucun objet GW2 n'a de nom au pluriel"
            )


def check_lecture_colonne3(data, errors, warnings):
    """Un enfant ne doit pas couter plus cher que son parent ne le justifie.

    La table « Full material list » du wiki agrege les quantites de la colonne 3
    sur celle de la colonne 2 : « 2 Gifts of Condensed Might » suivi de
    « 2 Gift of Bones » veut dire UN don d'os par don condense, pas deux. J'ai
    lu ces nombres comme unitaires et double le cout en trophees de toutes les
    gen2 passant par un Mystic Tribute, de la v204 a la v219 — six versions.

    Le symptome etait pourtant visible : une arete enfant -> parent dont la
    quantite egale exactement la quantite du parent chez SON parent est presque
    toujours ce mauvais report. Deux dons d'os par don condense quand le tribut
    demande deux dons condenses, c'est le meme « 2 » recopie d'un cran.

    Ce controle le signale. Il ne peut pas etre une erreur : une coincidence
    numerique reste possible, et certaines recettes demandent legitimement
    autant d'un ingredient que de leur propre lot. Mais toute arete qui
    l'allume merite d'etre confrontee a la boite Recipe de la page du parent,
    pas a une table d'arme.
    """
    cc = data.get("craft_components", {})
    for cid, comp in sorted(cc.items()):
        if not isinstance(comp, dict):
            continue
        for parent, q in sorted((comp.get("qty") or {}).items()):
            p = parent.split("__")[0]
            if p not in cc or not isinstance(q, int) or q < 2:
                continue
            for grand, qg in sorted((cc[p].get("qty") or {}).items()):
                if grand.split("__")[0] in cc and qg == q:
                    warnings.append(
                        f"lecture colonne 3 a verifier : {cid} -> {p} = {q}, "
                        f"et {p} -> {grand.split('__')[0]} = {qg}. Le meme nombre "
                        "a deux crans est le symptome d'une quantite agregee lue "
                        "comme unitaire — confronter a la boite Recipe de "
                        f"{p}, pas a une table d'arme"
                    )
                    break


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

    # 11. Plafonds chiffres ecrits en prose sans cadence structuree
    check_orphan_caps(data, errors, warnings)

    # 12. Drapeaux de cadence declares et effectivement lus
    check_cadence_flags(data, errors, warnings)

    # 13. Deblocage des collections : prose complete, portes testables
    check_collection_unlocks(data, errors, warnings)

    # 14. Guides ecrits et guides affiches : meme ensemble
    check_guide_coverage(data, errors, warnings)

    # 15. Rendement des monnaies de carte : une seule source de verite
    check_chars_tab_duplication(data, errors, warnings)

    # 16. Contrat d'onglets : conditions lisibles, ordre complet
    check_tab_contract(data, errors, warnings)

    # 17. Niveaux de quantite : par parent ou total aplati
    check_qty_levels(data, errors, warnings)

    # 18. Exigences transverses : un seul emplacement, celui que le calcul lit

    # 19. Obsidienne : quantite de gifts et repartition par emplacement
    check_contract_flags_exist(data, errors, warnings)
    check_no_parallel_common_table(data, errors, warnings)
    check_obsidian_gift_split(data, errors, warnings)

    # 20. Composants de recette : tout maillon cite doit exister
    check_recipe_components(data, errors, warnings)
    check_precursor_is_tier_three(data, errors, warnings)
    check_no_flat_weapon_lists(data, errors, warnings)
    check_collection_name_bilingual(data, errors, warnings)
    check_gen3_precursor_suffix(data, errors, warnings)
    check_no_duplicate_collection_id(data, errors, warnings)

    # 30. Chaque arete de l'arbre de craft porte sa quantite
    check_needed_for_chiffre(data, errors, warnings)

    # 31. Un apiId = un objet = un composant
    check_api_id_unique(data, errors, warnings)

    # 32. Un nom au pluriel face a son singulier est presque toujours une invention
    check_nom_pluriel_double(data, errors, warnings)

    # 33. Le meme nombre a deux crans : quantite agregee lue comme unitaire
    check_lecture_colonne3(data, errors, warnings)

    # 21. Integrite de chaque entree de meta_eligible
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
