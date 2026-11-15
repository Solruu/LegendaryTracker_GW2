"""Coalescence III : lieux et conseils (15/11/2026).

Captures du 15/11 (ressources/wiki/) : worn_meditation_logbook, purified_essence_*,
infused_meditation_log_book, twisted_essence_*, hasara, sunspear_sanctuary,
strange_energy. Aucune ne porte de {{waypoint}} :
- bit 3 (Worn Meditation Logbook) : Hasara se tient aux lieux de meditation de
  Coalescence I, « such as hidden in Abbadon's cave in the Desolation » ; c'est
  le lieu de Meditation Log: The Desolation (statue d'Abaddon), dont la capture
  donne Bonestrand Waypoint -> on reprend ce point, meme source.
- bits 4-7 (Strange Energy, Sunspear Sanctuary) : pas de point de passage ; le
  wiki fait entrer depuis Spearmarshal's Lament, point d'interet de l'API
  (ressources/api/api_points_interet_20261115.json) -> regle d'Antoine : point
  d'interet faute de point de passage, zone nommee.
CORRIGE (bit 5) : « les 3 essences tordues doivent etre validees » est faux ;
chaque Purified Essence demande SA Twisted Essence (purified_essence_*.html :
« can only be obtained after getting Twisted Essence of ... »). AJOUTS sources :
Worn Meditation Logbook en inventaire requis ; Spearmarshal's Plea mene vite au
site.
"""
import json, re, glob
src = max(glob.glob("gw2_sources_v*.json"), key=lambda p: int(re.findall(r"v(\d+)", p)[0]))
num = int(re.findall(r"v(\d+)", src)[0])
d = json.load(open(src, encoding="utf-8"))
co = d["legendaries"]["coalescence"]["collections"]
it = co["coalescence_3"]["items"]
wp_deso = dict(co["coalescence_1"]["items"][7]["waypoint"])
assert wp_deso["chat_code"] == "[&BNwKAAA=]"
it[3]["waypoint"] = {"name": "Bonestrand Waypoint", "chat_code": "[&BNwKAAA=]", "verified": True, "checked": "2026-11-15",
                     "ref": "ressources/wiki/worn_meditation_logbook.html (Hasara, grotte d'Abbadon) + meditation_log_the_desolation.html (Bonestrand Waypoint)"}
poi = {"name": "Spearmarshal's Lament (point d'intérêt, entrée du Sanctuaire des Lanciers du soleil)", "chat_code": "[&BAEKAAA=]",
       "verified": True, "checked": "2026-11-15",
       "ref": "ressources/wiki/sunspear_sanctuary.html (Getting there) + ressources/api/api_points_interet_20261115.json"}
for b in (4, 5, 6, 7): it[b]["waypoint"] = dict(poi)
add_fr = " Garder le Carnet de méditation usé en inventaire ; Spearmarshal's Plea mène vite au site."
add_en = " Keep the Worn Meditation Logbook in your inventory; Spearmarshal's Plea gets you there fast."
it[4]["how_jsx"]["fr"] += add_fr; it[4]["how_jsx"]["en"] += add_en
it[5]["how_jsx"] = {"fr": "Essence purifiée de résolution : même Énergie étrange. ⚠ Chaque essence purifiée demande son essence tordue (ici celle de Sabir) déjà obtenue.",
                    "en": "Purified Essence of Resolve: same Strange Energy. ⚠ Each purified essence needs its own twisted essence (here Sabir's) already obtained."}
dst = f"gw2_sources_v{num+1}.json"
json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(src, "->", dst)
