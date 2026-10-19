# -*- coding: utf-8 -*-
"""Le moteur courant : la version la plus haute de `gw2_moteur_v*.py`.

Les outils importaient `moteur.gw2_moteur_vN` en dur : chaque version du
moteur obligeait a renumeroter tous les importeurs (v5 -> v6 : huit scripts),
pour une seule ligne changee. Ils importent desormais d'ici ; le choix se fait
par glob numerique, comme pour les sources et le JSX.
"""
import importlib
import re
from pathlib import Path

_ici = Path(__file__).resolve().parent
_dernier = max(_ici.glob("gw2_moteur_v*.py"),
               key=lambda p: int(re.search(r"_v(\d+)\.py$", p.name).group(1)))
_module = importlib.import_module(f"{__package__ or 'moteur'}.{_dernier.stem}")
Modele = _module.Modele
ARMURES = getattr(_module, "ARMURES", None)
NOM = _dernier.name
