#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Le moteur de calcul, ecrit UNE fois.

POURQUOI CE FICHIER EXISTE. La cascade etait reimplementee DIX fois : neuf
scripts Python et le JSX. Elles avaient deja diverge sans que rien ne le
signale — `gw2_deplie_wiki_v10` et `gw2_arbitrages_v5` calculaient leurs totaux
en IGNORANT `alt_groups`, quand l'audit, les deux confrontations et le JSX les
appliquaient. Le deplieur decidait donc « deja compte par cascade » et « ca
casserait un total ailleurs » sur des nombres qui ne tenaient aucun compte des
choix declares.

Aucun typage n'aurait attrape ca : dix boucles bien formees qui ne disent pas la
meme chose. Ce qui l'attrape, c'est qu'il n'y en ait plus qu'une.

CE QUE LE MODELE DERIVE AU LIEU DE LE STOCKER. La donnee porte deux vues du
meme fait : `qty` dit « tel composant est exige par tel parent, en telle
quantite », et `needed_for` liste les memes parents. Sur 506 composants, 140
ont les deux qui ne concordent plus, et l'un d'eux pointe vers un legendaire
qui n'existe pas (`armor_perfected_envoy`). C'est la table parallele que les
regles du projet interdisent, dans la donnee cette fois.

Le modele ne stocke donc que les aretes, une fois, et expose `consommateurs` et
`composants` en PROPRIETES CALCULEES. Il devient impossible qu'elles divergent,
parce qu'elles n'existent pas separement. La donnee garde `needed_for` tant que
le JSX s'en sert pour son index inverse, mais plus rien ici ne le lit.

CE QUI RESTE A FAIRE APRES CE FICHIER. Le JSX porte la dixieme implementation,
et il doit la garder : le calcul se refait a chaque clic, dans le navigateur.
La parade n'est pas de la supprimer mais de la CONFRONTER — un test qui fait
tourner les deux moteurs sur les memes sources et compare tous les totaux de
tous les legendaires. Tant qu'il n'existe pas, la divergence reste possible de
ce cote-la.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

# Les armures se comptent par piece ; les suffixes disent comment. Les trois sets legendaires
# se declinent chacun en 3 poids (leger/moyen/lourd) : meme structure de dons (Prosperity/
# Prowess/Dedication), mais le cout brut ascended (Ascended Shard of Glory, marque Grandmaster)
# varie par poids -- confirme le 10/09/2026 sur Ardent Glorious (Crown leger : 100 + 3x Tailor's
# Mark ; Legplates lourd : 150 + 4x Armorsmith's Mark). Chaque suffixe de poids compte pour un
# set COMPLET de ce poids (6 pieces), pas une piece seule.
ARMURES = frozenset({"perfected_envoy", "obsidian", "triumphant_hero", "ardent_glorious"})
PIECES = 6
SUFFIXES = (("", 1), ("__per_piece", PIECES),
            ("__per_piece_light", PIECES), ("__per_piece_medium", PIECES),
            ("__per_piece_heavy", PIECES),
            ("__onetime", 1), ("__per_unit", 1), ("__full_set", 1))
PROFONDEUR = 12


@dataclass(frozen=True)
class Choix:
    """Un-parmi-N declare : `alt_groups`.

    La selection se fait par (groupe, CIBLE) et non par groupe : douze armes
    gen2 acceptent Maguuma ou Desert et repondent chacune pour elle-meme.
    `defaut` est toujours la premiere option — la voie la plus efficiente quand
    il y en a une, sinon la premiere de la liste ; l'audit le verifie.
    """
    id: str
    qty: int
    options: tuple[str, ...]
    cibles: tuple[str, ...]
    brut: dict = field(default_factory=dict, repr=False)

    @property
    def defaut(self) -> str:
        return self.options[0]

    def retenue(self, cible: str, selection: dict | None) -> str:
        if not selection:
            return self.defaut
        v = selection.get(self.id)
        if isinstance(v, str):          # ancien format : un choix pour tout
            return v
        if isinstance(v, dict):
            return v.get(cible) or self.defaut
        return self.defaut


@dataclass(frozen=True)
class Composant:
    """Un noeud de l'arbre. Ses aretes sont dans `qty`, et nulle part ailleurs."""
    id: str
    brut: dict = field(default_factory=dict, repr=False)
    modele: "Modele" = field(default=None, repr=False, compare=False)

    @property
    def nom(self) -> str:
        n = self.brut.get("name")
        return (n.get("en") or n.get("fr")) if isinstance(n, dict) else (n or self.id)

    @property
    def qty(self) -> dict:
        return self.brut.get("qty") or {}

    @property
    def cadence(self) -> list:
        return ((self.brut.get("cadence") or {}).get("sources")) or []

    @property
    def sources(self) -> list:
        return self.brut.get("sources") or []

    @property
    def consommateurs(self) -> list[str]:
        """Les parents qui l'exigent — DERIVE de `qty`, jamais stocke.

        `needed_for` dit la meme chose dans la donnee et ne la dit deja plus
        pareil pour 140 composants sur 506. On ne le lit pas.
        """
        return sorted({k.split("__")[0] for k in self.qty})

    @property
    def composants(self) -> list[str]:
        """Ses propres enfants : les composants qui le citent comme parent."""
        return sorted(c.id for c in self.modele.composants.values() if self.id in c.qty)


@dataclass(frozen=True)
class Legendaire:
    """Une cible du calcul. Toutes ne sont pas declarees : un identifiant peut
    n'exister que comme cle de `qty`, et le tracker doit quand meme le compter —
    c'est ainsi qu'on voit les cibles fantomes au lieu de les perdre."""
    id: str
    brut: dict = field(default_factory=dict, repr=False)
    declare: bool = True

    @property
    def nom(self) -> str:
        n = self.brut.get("name")
        return (n.get("en") or n.get("fr")) if isinstance(n, dict) else (n or self.id)

    @property
    def type(self) -> str | None:
        t = self.brut.get("type")
        return (t.get("en") or t.get("fr")) if isinstance(t, dict) else t

    @property
    def generation(self) -> str | None:
        for p in ("gen1_", "gen2_", "gen3_"):
            if self.id.startswith(p):
                return p[:-1]
        return None

    @property
    def collections(self) -> list:
        return self.brut.get("collections") or []

    @property
    def est_armure(self) -> bool:
        return self.id in ARMURES


class Modele:
    """Les sources chargees, et le seul endroit ou la cascade est ecrite."""

    def __init__(self, chemin: str | Path):
        self.chemin = Path(chemin)
        self.brut = json.loads(self.chemin.read_text(encoding="utf-8"))
        self._construire()

    def _construire(self):
        self.composants = {
            cid: Composant(cid, c, self) for cid, c in self.brut["craft_components"].items()
        }
        self.choix = {
            gid: Choix(gid, g.get("qty", 0), tuple(g.get("options") or ()),
                       tuple(g.get("targets") or ()), g)
            for gid, g in (self.brut.get("alt_groups") or {}).items()
        }
        declares = self.brut.get("legendaries") or {}
        vises = {k.split("__")[0] for c in self.composants.values() for k in c.qty
                 if k.split("__")[0] not in self.composants}
        self.legendaires = {lid: Legendaire(lid, v) for lid, v in declares.items()}
        for lid in sorted(vises - set(declares)):
            self.legendaires[lid] = Legendaire(lid, {}, declare=False)

    @classmethod
    def depuis(cls, data: dict, chemin=None) -> "Modele":
        """Un modele sur des sources DEJA chargees — l'audit lit son fichier
        lui-meme et ne doit pas le relire une seconde fois."""
        m = cls.__new__(cls)
        m.chemin = Path(chemin) if chemin else Path("<memoire>")
        m.brut = data
        m._construire()
        return m

    @classmethod
    def dernier(cls, dossier: str | Path = None) -> "Modele":
        """La version la plus haute du dossier. Un chemin fige devient
        introuvable des la passe suivante ; c'est arrive."""
        d = Path(dossier) if dossier else Path(__file__).resolve().parent
        return cls(max(d.glob("gw2_sources_v*.json"),
                       key=lambda p: int(p.stem.split("_v")[-1])))

    @property
    def cibles(self) -> list[str]:
        """Tout ce que `qty` vise et qui n'est pas un composant."""
        return sorted(self.legendaires)

    @property
    def fantomes(self) -> list[str]:
        return sorted(l.id for l in self.legendaires.values() if not l.declare)

    @staticmethod
    def _surcout(comp: "Composant", cible: str, faites: dict | None) -> float:
        """`qty_extras` : un surcout qui tombe tant qu'une etape de collection
        n'est pas validee. Meme regle que le JSX, au caractere pres — c'est
        cette regle-la que le test de conformite compare.

        Il ne s'ajoute QUE la ou le composant porte une cle a plat pour la
        cible. Ailleurs il n'existe pas, meme si la cascade y amene le
        composant : le JSX le calcule dans la branche de la cle a plat.
        """
        faites = faites or {}

        def faite(sub, bit):
            sc = faites.get(sub)
            if not sc:
                return False
            return bool(sc.get("done")) or bit in (sc.get("bits") or [])

        add = 0
        for x in (comp.brut.get("qty_extras") or []):
            if x.get("legendary") != cible:
                continue
            if isinstance(x.get("bits"), list):
                add += sum(1 for b in x["bits"] if not faite(x.get("sub"), b)) \
                    * x.get("amountPer", 0)
            elif not faite(x.get("sub"), x.get("bit")):
                add += x.get("amount", 0)
        return add

    def totaux(self, cible: str, selection: dict | None = None,
               detail: bool = False, surcouts: bool = False,
               collections_faites: dict | None = None,
               repartition_poids: dict | None = None):
        """Ce que le tracker AFFICHE pour une cible : cles a plat plus cascade.

        `selection` : {id_de_groupe: {cible: option}} — ou {id: option} pour
        l'ancien format. Absent, chaque groupe prend son defaut.

        `repartition_poids` : {armure: {"light": n, "medium": n, "heavy": n}}.
        Une armure legendaire est un set de 6 pieces, mais son cout brut
        ascended (Ascended Shard of Glory, marque Grandmaster) varie par
        poids -- confirme le 10/09/2026 (Ardent Glorious : leger vs lourd).
        Sans repartition fournie, chaque suffixe de poids present compte pour
        un set COMPLET (x6) — comportement de compatibilite pour l'audit et
        les confrontations, qui ne construisent pas un set reel et n'ont pas
        a choisir. Avec une repartition, seul le compte de pieces de CE poids
        s'applique (somme des trois <= 6 pour un set complet, mais rien
        n'empeche un compte partiel si toutes les pieces ne sont pas visees).

        `detail=True` rend aussi la part APPORTEE PAR LA CHAINE, seule facon de
        savoir ou une cle a plat peut ceder la place sans perdre son cout. Les
        appelants la recalculaient chacun de leur cote, et pas pareil : l'un
        oubliait la contribution des choix.
        """
        armure = cible in ARMURES
        rp = (repartition_poids or {}).get(cible)
        t: dict[str, float] = {}
        for cid, c in self.composants.items():
            q = c.qty
            for suf, mult in SUFFIXES:
                if suf in ("__per_piece", "__per_piece_light", "__per_piece_medium",
                           "__per_piece_heavy", "__full_set") and not armure:
                    continue
                if rp is not None and suf.startswith("__per_piece_"):
                    poids = suf.removeprefix("__per_piece_")
                    mult = rp.get(poids, 0)
                v = q.get(cible + suf)
                if isinstance(v, (int, float)) and not isinstance(v, bool):
                    t[cid] = t.get(cid, 0) + v * mult
                    if surcouts and suf == "":
                        t[cid] += self._surcout(c, cible, collections_faites)
        for ch in self.choix.values():
            if cible in ch.cibles:
                o = ch.retenue(cible, selection)
                t[o] = t.get(o, 0) + ch.qty
        # Les apports de la cascade sont REMPLACES a chaque tour, jamais
        # cumules : les additionner ferait grossir un total a chaque passe.
        pose: dict[str, float] = {}
        for _ in range(PROFONDEUR):
            apport: dict[str, float] = {}
            for cid, c in self.composants.items():
                for k, v in c.qty.items():
                    if isinstance(v, (int, float)) and not isinstance(v, bool) \
                            and k in self.composants and t.get(k, 0) > 0:
                        apport[cid] = apport.get(cid, 0) + v * t[k]
            for ch in self.choix.values():
                for x in ch.cibles:
                    if x in self.composants and t.get(x, 0):
                        o = ch.retenue(x, selection)
                        apport[o] = apport.get(o, 0) + ch.qty * t[x]
            bouge = False
            for cid, v in apport.items():
                if pose.get(cid, 0) != v:
                    t[cid] = t.get(cid, 0) - pose.get(cid, 0) + v
                    pose[cid] = v
                    bouge = True
            if not bouge:
                break
        return (t, pose) if detail else t

    def tous_totaux(self, selection: dict | None = None) -> dict[str, dict]:
        return {l: self.totaux(l, selection) for l in self.cibles}


if __name__ == "__main__":
    m = Modele.dernier()
    print(f"{m.chemin.name} : {len(m.composants)} composants, "
          f"{len(m.legendaires)} cibles ({len(m.fantomes)} non declarees), "
          f"{len(m.choix)} choix")
    if m.fantomes:
        print("  cibles visees par qty mais absentes de `legendaries` :")
        for f in m.fantomes:
            print(f"     {f}")
    t = m.totaux("gen1_twilight")
    for k in ("mystic_clover", "mystic_coin", "glob_of_ectoplasm", "obsidian_shard"):
        print(f"  twilight {k:20} {t.get(k, 0)}")
