# Pages à capturer que l'arbre ne peut pas déduire
#
# `gw2_pages_a_capturer_v14.py` fusionne ces URLs dans la section « URLs » de
# PAGES_A_CAPTURER.md, qui est un fichier GÉNÉRÉ : ce qu'on y écrit à la main
# disparaît à la régénération suivante. C'est ici qu'il faut écrire.
#
# Le générateur filtre par l'index de contenu : une page déjà au dépôt ne
# ressort pas, et il la signale en fin de passe pour qu'on efface sa ligne.
#
# Une ligne par URL. `#` pour un commentaire.


# ── Horaires de métas — BACKLOG § 12 ─────────────────────────────────────────
#
# Aucun endpoint de l'API ne publie d'horaire, et `Event_timers` est rendue par
# un widget Lua : son HTML n'en contient aucun. La seule source est la page de
# chaque méta. 33 entrées à horaire n'ont pas de `ref`.
#
# Les titres ci-dessous sont DÉDUITS du nom de la méta. Deux 404 et une
# redirection ont déjà coûté une passe : signale-moi ceux qui ne tombent pas
# juste plutôt que de chercher une page approchante.

https://wiki.guildwars2.com/wiki/Octovine
https://wiki.guildwars2.com/wiki/Night_and_the_Enemy
https://wiki.guildwars2.com/wiki/Chak_Gerent
https://wiki.guildwars2.com/wiki/Aetherblade_Assault
https://wiki.guildwars2.com/wiki/Kaineng_Blackout
https://wiki.guildwars2.com/wiki/Gang_War
https://wiki.guildwars2.com/wiki/Junundu_Rising
https://wiki.guildwars2.com/wiki/Forged_with_Fire
https://wiki.guildwars2.com/wiki/Doppelganger
https://wiki.guildwars2.com/wiki/Palawadan
https://wiki.guildwars2.com/wiki/The_Battle_for_the_Jade_Sea
https://wiki.guildwars2.com/wiki/Defense_of_Amnytas
https://wiki.guildwars2.com/wiki/Convergence:_Mount_Balrior
https://wiki.guildwars2.com/wiki/Unlocking_the_Wizard%27s_Tower
https://wiki.guildwars2.com/wiki/Frozen_Maw

# Métas dont je ne sais pas nommer la page — le libellé du dépôt est une
# description, pas un titre. Donne-moi le bon titre et je l'ajoute ici.
#   ds          « Full meta » — Dragon's Stand
#   bn / titanic « A Titanic Voyage » / « Bava Nisos » — les deux sens du couple
#   hammerhart  « Shipwreck Strand » / « Hammerhart Rumble! »
#   weald       « Starlit Weald » / « Secrets of the Weald »
#   shackles    « Eternity's Garden » / « Shackles of the Ancients »
#   mb          « Public Instance » — Convergence Mount Balrior
#   obs_conv_on « Outer Nayos (public) » — déjà sourcée, ref posée

# Fermes de nœuds et de vendeurs : `isTimeless`, aucun horaire à sourcer.
# Leur source est la page de carte ou de vendeur, pas un timer.
#   bf, dm, eb, ld, sl, lw4_istan, lw4_dragonfall, obs_spider, obs_am, obs_sw,
#   heatstone, mistburned, mursaat_remnants, adinf_cms, adinf_dailies,
#   adinf_kelvei
