"""Couts d'achat : skins d'Arcanum (Obsidian) et Dream of Peace (15/11/2026, accord d'Antoine).

Obsidian — collections arcanum_* bits 0 (Astral Ward) et 2 (Oneiros-Spun) : seul
moyen d'obtention, l'achat a la Tour du sorcier (Astral Ward Mage ou Lyhr, meme
prix, maitrise Astral Craft) — ressources/wiki/astral_ward_heavy_*.html et
oneiros_spun_heavy_*.html, Acquisition. Le cout devient `cost` de l'etape.
La Purified Rift Essence etait deja comptee a plat (purified_rift_essence
qty obsidian__onetime = 12, soit 1 par skin) : elle passe dans le cout de
chaque etape et la cle a plat est RETIREE (meme total, une seule structure,
et le cout tombe quand l'etape est faite). needed_for pendants
astral_ward_armor / oneiros_spun_armor (composants inexistants) retires.

Dream of Peace (The Dreamer III, bit 16) : deux vendeurs de coeur de renom
a Warrior's Crown (Fields of Ruin), meme condition (collection active,
coeur termine) : Legionnaire Crunchbone (« Assist the charr delegation »)
1 848 karma, Vanguard Lieutenant Viles (« Support the human delegation »)
4 998 karma. Le moins cher est retenu, la condition est dite dans le conseil.
"""
import json, re, glob, html
src = max(glob.glob("gw2_sources_v*.json"), key=lambda p: int(re.findall(r"v(\d+)", p)[0]))
num = int(re.findall(r"v(\d+)", src)[0])
d = json.load(open(src, encoding="utf-8"))
C = d["craft_components"]
by = {}
for k, v in C.items():
    n = v.get("name"); n = n.get("en") if isinstance(n, dict) else n
    if n: by.setdefault(n.lower(), k)
SLOT = {"head": "helm", "shoulders": "shoulders", "chest": "coat", "gloves": "gloves", "legs": "leggings", "boots": "boots"}
def cout(page):
    s = open(f"ressources/wiki/{page}.html", encoding="utf-8").read()
    i = s.find('id="Acquisition"'); j = s.find("<table", i); t = s[j:s.find("</table>", j)]
    r = re.findall(r"<tr[^>]*>(.*?)</tr>", t, re.S)[1]
    r = re.sub(r'<img[^>]*alt="([^"]*)"[^>]*>', r" [\1] ", r)
    r = html.unescape(re.sub(r"<[^>]+>", " ", r)).replace("\xa0", " ")
    return {by[cur.strip().lower()]: int(n.replace(",", "")) for n, cur in re.findall(r"([\d,]+)\s*\[([^\]]+)\]", r)}
total_pre = 0
for slot, piece in SLOT.items():
    col = d["legendaries"]["obsidian"]["collections"][f"arcanum_{slot}"]
    for bit, prefixe in ((0, "astral_ward"), (2, "oneiros_spun")):
        it = col["items"][bit]
        page = f"{prefixe}_heavy_{piece}"
        assert it["name"].lower().replace("-", "_").replace(" ", "_") == page, (it["name"], page)
        assert not it.get("cost")
        it["cost"] = cout(page)
        it["cost_ref"] = f"ressources/wiki/{page}.html, Acquisition (Astral Ward Mage / Lyhr) — 15/11/2026"
        total_pre += it["cost"].get("purified_rift_essence", 0)
        print(slot, bit, it["cost"])
pre = C["purified_rift_essence"]
assert pre["qty"].pop("obsidian__onetime") == 12 == total_pre
pre["needed_for"] = [x for x in pre["needed_for"] if x not in ("astral_ward_armor", "oneiros_spun_armor")]
for cid, c in d["legendaries"]["gen1_the_dreamer"]["collections"].items():
    for it in c["items"]:
        if it["name"] == "Dream of Peace":
            it["cost"] = {"karma": 1848}
            it["cost_ref"] = ("ressources/wiki/dream_of_peace.html, Acquisition (Legionnaire Crunchbone, le moins cher ; "
                              "Vanguard Lieutenant Viles 4 998) + legionnaire_crunchbone.html, assist_the_charr_delegation.html — 15/11/2026")
            it["how_jsx"] = {"fr": "Rêve de paix : chez Legionnaire Crunchbone (1 848 karma), Warrior's Crown, Fields of Ruin, après le cœur « Assist the charr delegation » et collection active. Vanguard Lieutenant Viles le vend aussi, 4 998 karma (cœur « Support the human delegation »).",
                             "en": "Dream of Peace: from Legionnaire Crunchbone (1,848 karma), Warrior's Crown, Fields of Ruin, after the 'Assist the charr delegation' heart, with the collection active. Vanguard Lieutenant Viles sells it too, for 4,998 karma ('Support the human delegation' heart)."}
            print("dream", cid, it["bit"])
dst = f"gw2_sources_v{num+1}.json"
json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(src, "->", dst)
