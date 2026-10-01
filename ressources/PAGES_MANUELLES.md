# Pages à capturer que l'arbre ne peut pas déduire
#
# `scripts_tracker/captures/gw2_pages_a_capturer_v14.py` fusionne ces URLs dans
# la section « URLs » de PAGES_A_CAPTURER.md, qui est un fichier GÉNÉRÉ : ce
# qu'on y écrit à la main disparaît à la régénération suivante. C'est ici qu'il
# faut écrire.
#
# Le générateur filtre par l'index de contenu : une page déjà au dépôt ne
# ressort pas, et il la signale en fin de passe pour qu'on efface sa ligne.
#
# Une ligne par URL. `#` pour un commentaire.


# ── Horaires de métas — BACKLOG § 12 ─────────────────────────────────────────
#
# 20 pages capturées le 30/09. UNE SEULE porte son horaire dans le HTML :
# The Frozen Maw, dont le tableau est écrit en wikitexte
# (`data-time-hh` / `data-time-mm`). Les 19 autres affichent leur section
# « Event schedule » par le même widget Lua qu'`Event_timers` — le HTML ne
# contient que la feuille de style, aucune heure.
#
# Capturer les pages de méta une par une ne donne donc pas les horaires.
# Avant d'en redemander, il faut savoir si le harnais peut enregistrer le DOM
# APRÈS exécution du widget ; sinon cette voie est fermée et il faut une autre
# source.
#
# Rien à capturer ici tant que ce point n'est pas tranché.

# ── Captures inutiles, à ne pas redemander ───────────────────────────────────
#
# Quatre titres de ma liste du 29/09 pointaient le mauvais TYPE de page : un
# boss ou une carte, pas la méta. Elles répondent 200 et ne portent aucun
# horaire — Octovine, Legendary Chak Gerent, Palawadan Jewel of Istan,
# Dragon's Stand. Elles restent au dépôt, elles ne servent juste pas à ça.
