#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""W7 : noms francais des sous-zones de farm (accord d'Antoine, 08/10/2026).

Usage : python3 scripts_tracker/integration/gw2_zones_fr_v1.py SRC DST

Source : noms de secteur du client, lus sur l'API
/v2/continents/{c}/floors/{f}/regions/{r}/maps/{m}/sectors?lang=en et lang=fr
(08/10/2026), apparies par id de secteur — jamais une traduction de tete.
v2 (09/10) : les cinq zones des Silverwastes SONT des secteurs du client ; la
v1 les cherchait sous l'id 988, qui est Dry Top. Lues sous 1015.
Idempotent : une zone deja nommee n'est pas retouchee.
"""
import json, sys
from pathlib import Path

SRC, DST = Path(sys.argv[1]), Path(sys.argv[2])

# carte (en) -> (chemin API, {secteur en: (id, secteur fr)})
API = "/v2/continents/{}/floors/{}/regions/{}/maps/{}/sectors"
SECTEURS = {
    "Cursed Shore": (API.format(1, 1, 3, 62), {
        "Noose Road": (709, "Route de Nœudcoulant"), "Compass Plaza": (718, "Place de la boussole"),
        "Craven Blight": (710, "Débris du pleutre"), "Cathedral of Silence": (714, "Cathédrale du silence"),
        "Fields of Gold": (704, "Champs d'or")}),
    "Malchor's Leap": (API.format(1, 1, 3, 65), {
        "Cathedral of Zephyrs": (599, "Cathédrale des zéphyrs"),
        "Cathedral of Eternal Radiance": (606, "Cathédrale de la lueur éternelle"),
        "Karst Plains": (603, "Plaines de Karst"), "Drowned Brine": (596, "Mer engloutie"),
        "Valley of Lyss": (607, "Vallée de Lyss")}),
    "Straits of Devastation": (API.format(1, 1, 3, 51), {
        "Blighted Battleground": (678, "Champ de bataille ravagé"),
        "Plinth Timberland": (689, "Terres forestières de Plinthe"), "Signal Peak": (693, "Pic de signal"),
        "Waywarde Way": (701, "Sentier du rétif"), "Strait of Sacrilege": (696, "Détroit du sacrilège")}),
    "Bjora Marches": (API.format(1, 1, 1, 1343), {
        "Fallen Ruins": (1788, "Ruines des déchus"), "Fallen Mountains": (1789, "Monts des déchus"),
        "Aberrant Forest": (1774, "Forêt aberrante"), "Southern Mountains": (1773, "Monts méridionaux"),
        "Frostborn Cascades": (1794, "Cascades de Givresource")}),
    "The Silverwastes": (API.format(1, 1, 11, 1015), {
        "Southwestern Silverwastes": (1198, "Sud-ouest des Contrées sauvages d'argent"),
        "Northwestern Silverwastes": (1197, "Nord-ouest des Contrées sauvages d'argent"),
        "Southeastern Silverwastes": (1203, "Sud-est des Contrées sauvages d'argent"),
        "Northern Silverwastes": (1199, "Nord des Contrées sauvages d'argent"),
        "Sharp Valley": (1200, "Canyon acéré")}),
    "Bloodstone Fen": (API.format(1, "1|2", 10, 1165), {
        "Fragmented Wastes": (1373, "Étendues fragmentées"), "Haunted Canyons": (1366, "Canyons hantés")}),
    "Draconis Mons": (API.format(1, "1|2|3", 20, 1195), {
        "Rata Arcanum": (1463, "Rata Arcanum"), "Golemancer's Tomb": (1466, "Tombeau du golemancien"),
        "Mariner Landing": (1454, "Débarcadère du marin"), "Zeta Vault": (1453, "Coffre zêta"),
        "Savage Rise": (1460, "Cap sauvage")}),
    "Dragon's Stand": (API.format(1, 1, 10, 1041), {
        "Chak Nest": (1309, "Nid de chaks"), "Exhumed Delve": (1319, "Excavation"),
        "Southern Barbed Gate": (1307, "Porte barbelée sud"),
        "Northern Blighting Tower": (1335, "Tour viciée nord"),
        "Central Blighting Tower": (1305, "Tour viciée centrale")}),
    "Kessex Hills": (API.format(1, 1, 4, 23), {
        "Cereboth Canyon": (83, "Canyon de Cereboth"), "Viathan's Arm": (79, "Bras de Viathan")}),
    "Queensdale": (API.format(1, 1, 4, 15), {
        "The Heartwoods": (59, "Boisecœur"), "Queen's Forest": (58, "Forêt de la reine"),
        "Godslost Swamp": (68, "Marais d'Anathema"), "Phinney Ridge": (64, "Crête de Phinney")}),
    "Gendarran Fields": (API.format(1, 1, 4, 24), {
        "Overlook Caverns": (263, "Cavernes des Hauteurs"), "Provernic Crypt": (881, "Crypte de Provernic"),
        "Cornucopian Fields": (259, "Champs de Cornabonde"), "The Bloodfields": (249, "Les Champs du sang")}),
    "The Desolation": (API.format(1, 49, 12, 1226), {
        "Scorched March": (1558, "Marche calcinée"), "Sand Jackal Run": (1588, "Piste des chacals des sables"),
        "The Darklands": (1557, "Les terres noires"), "Broken Shelf": (1547, "Saillie brisée")}),
    "Mad King's Realm": (API.format(2, -27, 25, 866), {
        "Mad King's Labyrinth": (1069, "Labyrinthe du Roi Dément")}),
    "Iron Marches": (API.format(1, 1, 2, 25), {
        "Glory's Steps": (448, "Marches de la Gloire"), "Echoslab Arches": (456, "Voûtes d'Echodalle"),
        "Crystalwept Groves": (446, "Bois des larmes de cristal"), "Champion's Shield": (433, "Bouclier du Champion")}),
}

d = json.loads(SRC.read_text(encoding="utf-8"))
fh = d["trophy_matrix"]["farm_hubs"]
poses, restes = 0, []
for h in fh["hubs"]:
    chemin, table = SECTEURS.get(h["map"]["en"], (None, {}))
    for z in h["zones"]:
        en = z["name"]["en"]
        if z["name"].get("fr"):
            continue
        if en in table:
            z["name"]["fr"] = table[en][1]
            poses += 1
        else:
            restes.append(f'{h["map"]["en"]} / {en}')
fh["zones_fr_ref"] = ("noms de secteur du client, API " + API.format("c", "f", "r", "m")
                      + "?lang=fr apparies par id avec lang=en (lu le 08/10/2026)")
assert not restes, restes
d["_meta"]["last_updated"] = "2026-10-08"
DST.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{poses} noms FR poses ; sans secteur client : {', '.join(restes)}")
