"""S2 : les armures comptent par leurs recettes, plus par des cles recopiees.

Usage : python3 scripts_tracker/integration/gw2_s2_armures_recettes_v1.py SRC DST

Les onglets d'armure passent par le moteur (JSX v258, moteur v5). Le moteur
additionne les cles a plat et la chaine : une cle a plat qui RECOPIE un
ingredient deja porte par un don compte donc deux fois. Releve sur les
captures (ressources/wiki/, boites Recipe et tables « Full material list ») :

Doublons retires — l'ingredient est dans un don, pas dans la piece :
- mystic_clover, ardent_glorious__per_piece 15 : Gift of Competitive Prosperity
  (15 Mystic Clover) ;
- mystic_clover, triumphant_hero__per_piece 15 : Gift of War Prosperity (15) ;
- legendary_war_insight, triumphant_hero__per_piece 1 : Gift of War Prowess (1) ;
- ball_dark_energy, perfected_envoy__per_piece 1 : Cube of Stabilized Dark
  Energy (1 Ball), seul porteur dans la table de perfected_envoy_armor ;
- obsidian_shard, obsidian__per_piece 50 : Gift of Expertise (50) ;
- glob_of_ectoplasm, obsidian__per_piece 600 : 12 Amalgamated Rift Essence x 50
  (table de obsidian_armor : « 600 Globs of Ectoplasm » sous l'essence) ;
- pvp_league_ticket, ardent_glorious__per_piece 150 : aucune etape d'Ardent
  ne coute de tickets en direct (ARMURES_COMPETITIVES.md, 36 pieces) ; ils
  passent par les deux Records ci-dessous.

Aretes posees — recette lue, refusee jusqu'ici par le depliage parce qu'elle
fait monter un total (la cle recopiee etait plus basse que la chaine) :
- record_of_league_participation <- 20 PvP League Ticket ;
- star_of_glory <- 400 Ascended Shard of Glory ;
- jar_of_distilled_glory <- 500 + 500 Shard of Glory (deux lignes de 500) ;
- legendary_war_insight <- 1 095 WvW Skirmish Claim Ticket (achat au
  Legendary Commander War Razor, wvw_skirmish_claim_ticket.html). L'ancien
  tableau ecrit a la main l'incluait (1 313 par piece = 1 310/6 + 1 095) ;
  le moteur l'ignorait.
Transcendence passe par le meme Gift of Competitive Dedication (via Gift of
the Champion) : ses cles a plat contenaient deja Star, Jar et Record. Table
« Full material list » de transcendence.html, hors Mist Pendant (choix) :
- Ascended Shard of Glory 900 = Mist Diamond 250 + Mist-Enhanced Orichalcum
  250 + Star 400 -> cle a plat 500 ;
- Shard of Glory 2 000 = Diamond 250 + Orichalcum 250 + Gift of Glory 250 +
  Jar 1 000 + Gift of Skirmishing 250 -> cle a plat 500 (Glory et Skirmishing
  sont deja des aretes). Le total affiche passait a 2 250 : 250 en double ;
- PvP League Ticket 70 = Diamond 25 + Record 20 + Certificates 25 -> cle 25.
Conservees, deux etapes distinctes : memory_of_battle triumphant 250/piece
(etape ascendue, vendeur) en plus des 250 du Gift of War Dedication ;
shard_of_glory ardent 250/piece (etape ascendue) en plus du Jar.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
cc = d["craft_components"]
JOUR = "2026-10-14"

RETIRER = [
    ("mystic_clover", "ardent_glorious__per_piece", 15),
    ("mystic_clover", "triumphant_hero__per_piece", 15),
    ("legendary_war_insight", "triumphant_hero__per_piece", 1),
    ("ball_dark_energy", "perfected_envoy__per_piece", 1),
    ("obsidian_shard", "obsidian__per_piece", 50),
    ("glob_of_ectoplasm", "obsidian__per_piece", 600),
    ("pvp_league_ticket", "ardent_glorious__per_piece", 150),
]
POSER = [
    ("pvp_league_ticket", "record_of_league_participation", 20),
    ("ascended_shard_of_glory", "star_of_glory", 400),
    ("shard_of_glory", "jar_of_distilled_glory", 1000),
    ("skirmish_claim_ticket", "legendary_war_insight", 1095),
]
AJUSTER = [
    ("ascended_shard_of_glory", "transcendence", 900, 500),
    ("shard_of_glory", "transcendence", 1750, 500),
    ("pvp_league_ticket", "transcendence", 45, 25),
]
for comp, cle, avant, apres in AJUSTER:
    assert cc[comp]["qty"].get(cle) == avant, (comp, cle)
    cc[comp]["qty"][cle] = apres
for comp, cle, v in RETIRER:
    assert cc[comp]["qty"].get(cle) == v, (comp, cle, cc[comp]["qty"].get(cle))
    del cc[comp]["qty"][cle]
for comp, parent, v in POSER:
    assert parent in cc and parent not in cc[comp]["qty"], (comp, parent)
    cc[comp]["qty"][parent] = v
    nf = cc[comp].setdefault("needed_for", [])
    if parent not in nf:
        nf.append(parent)
    p = cc[parent]
    p["ref"] = ("ressources/wiki/wvw_skirmish_claim_ticket.html (Legendary Commander War Razor)"
                if parent == "legendary_war_insight" else f"ressources/wiki/{parent}.html (boîte Recipe)")
    p["verified"] = True
    p["checked"] = JOUR
d["_meta"]["last_updated"] = JOUR
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{len(RETIRER)} cles recopiees retirees, {len(AJUSTER)} ajustees, {len(POSER)} aretes posees")
