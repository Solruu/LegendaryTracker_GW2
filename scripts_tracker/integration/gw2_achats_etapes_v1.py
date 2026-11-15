"""Couts d'achat des etapes de collection (15/11/2026, plan : « generaliser au fil des captures »).

Etapes dont le `how` dit « purchased / buy from / sold by » sans `cost`, page
capturee le 15/11 (ressources/wiki/<objet>.html, tableau du vendeur sous
« Acquisition »). Regles :
- le prix du tableau devient `cost` de l'etape, avec `cost_ref` (page, section) ;
- karma, eclats d'esprit, cristaux de difluorite : poses ; pieces d'or, d'argent,
  de cuivre : non posees (convention des livres de Hobbs du 24/10) ;
- deux lignes qui ne different que par la rarete : la rarete de l'objet du bit
  (ressources/api/api_collections_armes_20261020.json) tranche ;
- deux vendeurs a des prix differents (Dream of Peace) : non tranche, laisse ;
- Obsidian (armures Astral Ward / Oneiros-Spun : dons, Purified Rift Essence,
  500 notes de recherche piece) : non pose, decision d'Antoine attendue.
"""
import json, re, glob, html
src = max(glob.glob("gw2_sources_v*.json"), key=lambda p: int(re.findall(r"v(\d+)", p)[0]))
num = int(re.findall(r"v(\d+)", src)[0])
d = json.load(open(src, encoding="utf-8"))
A = json.load(open("ressources/api/api_collections_armes_20261020.json", encoding="utf-8"))
RAR = {"Fine": "Fine", "Masterwork": "Masterwork", "Rare": "Rare", "Basic": "Basic"}
MONNAIE = {"Karma": "karma", "Spirit Shard": "spirit_shard", "Difluorite Crystal": "difluorite_crystal"}
PIECES = {"Gold coin", "Silver coin", "Copper coin"}
fn = lambda w: re.sub(r"[^a-z0-9]+", "_", w.lower().replace("%27", "'")).strip("_")
pat = re.compile(r"(offered for purchase|purchase|buy from|sold by|bought from)", re.I)

def tableau(page):
    try: s = open(f"ressources/wiki/{page}.html", encoding="utf-8").read()
    except FileNotFoundError: return None
    i = s.find('id="Acquisition"')
    j = s.find("<table", i) if i >= 0 else -1
    if j < 0 or j - i > 4000: return None
    t = s[j:s.find("</table>", j)]
    lignes = []
    for r in re.findall(r"<tr[^>]*>(.*?)</tr>", t, re.S):
        cs = []
        for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", r, re.S):
            c = re.sub(r'<img[^>]*alt="([^"]*)"[^>]*>', r" [\1] ", c)
            cs.append(html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", c))).replace("\xa0", " ").strip())
        cout = [c for c in cs if re.search(r"\d[\d,]*\s*\[", c)]
        if cout:
            rar = next((v for c in cs for k, v in RAR.items() if c.endswith(" " + k)), None)
            lignes.append({"vendeur": cs[0], "rarete": rar,
                           "cout": {cur.strip(): int(n.replace(",", "")) for n, cur in re.findall(r"([\d,]+)\s*\[([^\]]+)\]", cout[-1])}})
    return lignes

poses, laisses = [], []
for lk, l in d["legendaries"].items():
    if lk == "obsidian": continue
    for ck, c in (l.get("collections") or {}).items():
        if not isinstance(c, dict): continue
        for it in c.get("items", []):
            if it.get("cost") or it.get("component"): continue
            h = it.get("how"); h = h.get("en") if isinstance(h, dict) else h
            if not h or not pat.search(h) or "Default route: loot" in h: continue
            page = fn(it.get("wiki") or it["name"].replace(" ", "_"))
            L = tableau(page)
            if not L: continue
            if len({json.dumps(x["cout"], sort_keys=True) for x in L}) > 1:
                rar = None
                bits = A["bitItems"].get(str(c.get("id")))
                if bits and it["bit"] < len(bits):
                    rar = (A["items"].get(str(bits[it["bit"]])) or {}).get("rarity")
                L2 = [x for x in L if x["rarete"] and x["rarete"] == rar]
                if len({json.dumps(x["cout"], sort_keys=True) for x in L2}) != 1:
                    laisses.append((lk, ck, it["bit"], it["name"], "prix differents selon le vendeur")); continue
                L = L2
            cout = L[0]["cout"]
            inconnues = [k for k in cout if k not in MONNAIE and k not in PIECES]
            if inconnues:
                laisses.append((lk, ck, it["bit"], it["name"], "monnaie non mappee : " + ", ".join(inconnues))); continue
            pose = {MONNAIE[k]: v for k, v in cout.items() if k in MONNAIE}
            if not pose:
                laisses.append((lk, ck, it["bit"], it["name"], "prix en pieces seulement, non pose (convention)")); continue
            it["cost"] = pose
            it["cost_ref"] = f"ressources/wiki/{page}.html, Acquisition ({L[0]['vendeur']}" + (f", {L[0]['rarete']}" if L[0]['rarete'] else "") + ") — 15/11/2026"
            poses.append((lk, ck, it["bit"], it["name"], pose))
for p in poses: print("POSE", *p)
for p in laisses: print("LAISSE", *p)
dst = f"gw2_sources_v{num+1}.json"
json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(src, "->", dst, "|", len(poses), "poses,", len(laisses), "laisses")
