#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""W1 : les six collections Arcanum d'Obsidienne passent dans `collections{}` (accord d'Antoine, 08/10/2026).

Usage : python3 scripts_tracker/integration/gw2_arcanum_collections_v1.py SRC DST

Derniere migration `collections{}`. Le JSX portait une table
`LEGENDARIES.obsidian.arcanum` (id, nom, boss, don) : elle devient de la
donnee, au format des collections migrees (Ad Infinitum, Henge), cle de
synchro inchangee (`arcanum_<emplacement>`, celle de Flask).
Sources :
- bits : /v2/achievements (ids 7214, 7098, 7096, 7219, 7240, 7051), croises
  avec /v2/skins, /v2/items et `legendary_armor_achievements.html` ;
- noms FR : /v2/achievements?lang=fr ;
- tableaux « Collection items » des six pages de succes (forme
  `Collectible | Type | Subtype | Related item`, sans colonne Notes) : le `how`
  vient donc des pages d'armure (Astral Ward, Rift Hunter, Oneiros-Spun) et
  des six Lifeblood (evenement qui le donne) ;
- vendeur de l'Arcanum et boss : texte d'exigence de chaque succes ;
- don (Magical / Mighty) : note de `obsidian_armor.html` (coiffe, epaules,
  torse : Gift of Magical Prosperity ; gants, jambes, bottes : Mighty).
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads(SRC.read_text(encoding="utf-8"))
obs = d["legendaries"]["obsidian"]
assert not obs.get("collections")
W = "ressources/wiki/"
SKIN = {
    "Astral Ward": ("astral_ward_armor",
        "Purchased from the Astral Ward Mage (Outfitter) or Lyhr in the Wizard's Tower, after the Astral Craft mastery. Unlocking one weight unlocks all three; a full set costs 6 Purified Rift Essences.",
        "Chez l'Astral Ward Mage (Outfitter) ou Lyhr, à la Tour du sorcier, après la maîtrise Astral Craft. Débloquer un poids débloque les trois ; un set complet coûte 6 Purified Rift Essences."),
    "Rift Hunter": ("rift_hunter_armor",
        "Rewarded for playing through the Secrets of the Obscure story, or by completing its reward track in PvP or WvW. Unlocking one weight unlocks all three.",
        "Récompense de l'histoire de Secrets of the Obscure, ou de sa piste de récompense en PvP ou McM. Débloquer un poids débloque les trois."),
    "Oneiros-Spun": ("oneiros_spun_armor",
        "Purchased from the Astral Ward Mage (Outfitter) or Lyhr in the Wizard's Tower, after the Astral Craft mastery. Unlocking one weight unlocks all three; a full set costs 6 Purified Rift Essences.",
        "Chez l'Astral Ward Mage (Outfitter) ou Lyhr, à la Tour du sorcier, après la maîtrise Astral Craft. Débloquer un poids débloque les trois ; un set complet coûte 6 Purified Rift Essences."),
}
SLOTS = [
    # cle, id, nom en, nom fr, boss, piece, skins (AW, RH, OS), lifeblood (nom, fichier, evenement, lieu), vendeur, don
    ("head", 7214, "Astral Thought", "Pensée astrale", "Ignaxious", "Helm", (11755, 11653, 11905),
     ("Lifeblood of Ignaxious", "lifeblood_of_ignaxious", "Defeat Ignaxious", "Heitor's Gate"), "Wizard's Tower", "magical"),
    ("shoulders", 7098, "Astral Bearing", "Allure astrale", "Galene the Seething", "Shoulders", (11637, 11812, 11877),
     ("Lifeblood of Galene the Seething", "lifeblood_of_galene_the_seething", "Defeat Galene the Seething", "Droknar's Light"), "Lyhr, the wizard smith", "magical"),
    ("chest", 7096, "Astral Heartbeat", "Pulsation astrale", "Nourys, the Eyes of the Abyss", "Coat", (11742, 11586, 11914),
     ("Lifeblood of Nourys, Eyes of the Abyss", "lifeblood_of_nourys_eyes_of_the_abyss", "Defeat Nourys, the Eyes of the Abyss", "The World Spire"), "Wizard's Tower", "magical"),
    ("gloves", 7219, "Astral Grasp", "Étreinte astrale", "Pherus the Subjugator", "Gloves", (11722, 11759, 11885),
     ("Lifeblood of Pherus the Subjugator", "lifeblood_of_pherus_the_subjugator", "Defeat Pherus the Subjugator", "Nyedra, Dreamer's Sanctum"), "Wizard's Tower", "mighty"),
    ("legs", 7240, "Astral Stride", "Foulée astrale", "Knaebelag the Terror", "Leggings", (11694, 11806, 11906),
     ("Lifeblood of Knaebelag the Terror", "lifeblood_of_knaebelag_the_terror", "The Fangs That Gnash", "Nyedra, Dreamer's Sanctum"), "Lyhr, the wizard smith", "mighty"),
    ("boots", 7051, "Astral Footprints", "Empreintes astrales", "Myros the Spiteful", "Boots", (11692, 11789, 11888),
     ("Lifeblood of Myros the Spiteful", "lifeblood_of_myros_the_spiteful", "Find and defeat the Kryptis patrol leaders", "The Bleeding Wastes"), "Wizard's Tower", "mighty"),
]
cols = {}
for slot, aid, en, fr, boss, piece, skins, (lb, lbf, evt, lieu), vendeur, don in SLOTS:
    page = en.lower().replace(" ", "_")
    items = []
    for bit, (ens, sid) in enumerate(zip(("Astral Ward", "Rift Hunter", "Oneiros-Spun"), skins)):
        f, how_en, how_fr = SKIN[ens]
        items.append({"bit": bit, "name": f"{ens} Heavy {piece}", "skin_id": sid,
                      "how": {"fr": None, "en": how_en}, "how_verified": True,
                      "how_ref": f"wiki, section Acquisition — {W}{f}.html",
                      "how_jsx": {"fr": how_fr, "en": how_en}, "how_fr_missing": True})
    items.append({"bit": 3, "name": lb,
                  "how": {"fr": None, "en": f"Obtained by completing {evt} at {lieu}."}, "how_verified": True,
                  "how_ref": f"wiki, section Acquisition — {W}{lbf}.html",
                  "how_jsx": {"fr": f"Donné par l'événement « {evt} » ({lieu}).", "en": f"Obtained by completing {evt} at {lieu}."},
                  "how_fr_missing": True})
    cols[f"arcanum_{slot}"] = {
        "id": aid, "key": f"arcanum_{slot}", "slot": slot,
        "name": {"fr": fr, "en": en}, "name_ref": "/v2/achievements?lang=fr et en (lu le 08/10/2026)",
        "total": 4, "total_ref": "compte des bits exposes par /v2/achievements",
        "boss": boss, "gift": don,
        "reward": f"Arcanum of {en}",
        "note": {"fr": f"Trois skins de l'emplacement et le Lifeblood de {boss}, puis l'Arcanum of {en} s'achète chez {vendeur} contre 1 Lesser Vision Crystal. Le succès demande les skins lourds, mais choisir un autre poids les débloque tous.",
                 "en": f"Three skins of the slot and {boss}'s Lifeblood, then the Arcanum of {en} is bought from {vendeur} for 1 Lesser Vision Crystal. The achievement asks for the heavy skins, but picking any weight unlocks all three."},
        "note_ref": f"wiki — {W}{page}.html (texte d'exigence et note du tableau) ; obsidian_armor.html (Lesser Vision Crystal, don)",
        "items": items, "items_ref": f"/v2/achievements (bits) et wiki, tableau « Collection items » — {W}{page}.html",
        # Chaine de deblocage, forme dominante des 133 autres collections. Le
        # texte d'exigence ne pose aucun prealable ni objet de deblocage : la
        # recompense est le droit d'acheter l'Arcanum.
        "unlock": {"achievement": en, "prerequisite": None, "unlock_item": None,
                   "reward": {"name": f"Arcanum of {en}", "wiki": f"Arcanum of {en}"}},
        "unlock_ref": f"wiki, texte d'exigence — {W}{page}.html",
    }
obs["collections"] = cols

# Portes de deblocage (collection_unlocks, 2026-08-20) : les six disaient
# « Galene the Seething vaincue » — le boss de l'epaule — et ne citaient que
# deux skins. Boss et skins remis par emplacement ; la porte de maitrise
# (Astral Craft) est gardee telle quelle.
FR_SLOT = {"head": "coiffe", "shoulders": "épaules", "chest": "torse",
           "gloves": "gants", "legs": "jambières", "boots": "bottes"}
EN_SLOT = {"head": "headgear", "shoulders": "shoulders", "chest": "chest",
           "gloves": "gloves", "legs": "leggings", "boots": "boots"}
cu = d["collection_unlocks"]
for slot, aid, en, fr, boss, *_r in SLOTS:
    u = cu[str(aid)]
    assert u["key"] == f"arcanum_{slot}" and "Galene the Seething" in u["text"]["en"], aid
    u["text"] = {
        "fr": f"🔓 Achat de l'Arcanum chez Lyhr, à la Tour du sorcier. Conditions : maîtrise Astral Craft montée (elle conditionne tout achat), apparences Astral Ward, Rift Hunter ET Oneiros-Spun débloquées pour l'emplacement {FR_SLOT[slot]}, et {boss} vaincu (son Lifeblood). 💡 Débloquer une classe de poids débloque les deux autres : 6 pièces suffisent pour les 18 apparences — ne fabrique pas trois fois la même.",
        "en": f"🔓 Buy the Arcanum from Lyhr, at the Wizard's Tower. Conditions: Astral Craft mastery levelled (it gates every purchase), Astral Ward, Rift Hunter AND Oneiros-Spun skins unlocked for the {EN_SLOT[slot]} slot, and {boss} defeated (their Lifeblood). 💡 Unlocking one weight class unlocks the other two: 6 pieces cover all 18 skins — do not craft the same one three times."}
    u["checked"] = "2026-10-08"
    u["ref"] = (f"wiki:Astral_Ward_armor + wiki:Obsidian_armor ; boss et skins : "
                f"{W}{en.lower().replace(' ', '_')}.html (08/10/2026)")
d["_meta"]["last_updated"] = "2026-10-08"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("6 collections Arcanum posees ; ecrit", DST)
