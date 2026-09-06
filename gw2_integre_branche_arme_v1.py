import json, re, collections, importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location('m','gw2_parse_material_list_v1.py')
M=importlib.util.module_from_spec(spec); spec.loader.exec_module(M)
rec={r['page']:r for r in json.load(open('gw2_wiki_recipes_v1.json'))}

d=json.load(open('gw2_sources_v219.json'), object_pairs_hook=collections.OrderedDict)
cc=d['craft_components']; legs=d['legendaries']
ARMOR={'perfected_envoy','obsidian','triumphant_hero','ardent_glorious'}
SUF=(('',1),('__per_piece',6),('__onetime',1),('__per_unit',1),('__full_set',1))
def totaux(leg):
    tot={}; exp={}
    for cid,c in cc.items():
        q=c.get('qty') or {}
        for suf,mm in SUF:
            mult = mm if (suf not in ('__per_piece','__full_set') or leg in ARMOR) else 0
            v=q.get(leg+suf)
            if isinstance(v,int) and mult: tot[cid]=tot.get(cid,0)+v*mult
    for _ in range(10):
        add={}
        for cid,c in cc.items():
            for k,v in (c.get('qty') or {}).items():
                if isinstance(v,int) and k in cc and tot.get(k,0)>0: add[cid]=add.get(cid,0)+v*tot[k]
        ch=False
        for cid,v in add.items():
            if exp.get(cid,0)!=v: tot[cid]=tot.get(cid,0)-exp.get(cid,0)+v; exp[cid]=v; ch=True
        if not ch: break
    return tot

def norm(s): return re.sub(r'[^a-z0-9]','',s.lower())
def clean(t): return t.replace('_',' ').replace('%27',"'")
def slug(t): return re.sub(r'[^a-z0-9]+','_',clean(t).lower()).strip('_')
def nom(cid):
    n=cc.get(cid,{}).get('name')
    return (n.get('en') or n.get('fr')) if isinstance(n,dict) else (n or cid)

idx={}
for c in cc:
    idx[norm(nom(c))]=c; idx.setdefault(norm(c.replace('_',' ')),c)
leg_par_nom={}
for lid,l in legs.items():
    n=l.get('name'); n=(n.get('en') or n.get('fr')) if isinstance(n,dict) else n
    if n: leg_par_nom[norm(n)]=lid
precs={norm(l.get('precursor') or '') for l in legs.values() if l.get('precursor')}
BRUIT={'Miyani','Mystic_Forge','Weaponsmith','Artificer','Huntsman','Leatherworker','Armorsmith',
       'Jeweler','Tailor','Chef','Scribe','Coin','Spirit_Shard','Spirit_Shards','Karma','Laurel',
       'Legendary_Crafting','Legendary_Weapons_(achievements)','Unidentified_Dye'}
def ecarte(t):
    return (t.startswith(('Recipe:','Poem_on','Tribute_to','Superior_Sigil'))
            or t.endswith('_(weapon)') or re.match(r"^Shard_(of_|o%27)", t)
            or t in BRUIT or norm(clean(t)) in precs)

# --- apiId depuis les pages, double attestation exigee ---
api={}
for p in Path('ressources/wiki').glob('*.html'):
    h=p.read_text(encoding='utf-8',errors='ignore')
    a=re.search(r'api\.guildwars2\.com/v2/items\?ids=(\d+)',h)
    g=re.search(r'data-type="item"[^>]*data-id="(\d+)"',h)
    if a and g and a.group(1)==g.group(1): api[p.stem]=int(a.group(1))

REFINE=('Ingot','Plank','Bolt_of','Leather_Section','Leather_Square')
pages=[p for p in sorted(Path('ressources/wiki').glob('*.html'))
       if 'id="Full_material_list"' in p.read_text(encoding='utf-8',errors='ignore')]

# --- aretes agregees + tetes de colonne 1 par legendaire ---
aretes={}; tetes=collections.defaultdict(dict)
for p in pages:
    if p.stem=='eternity': continue
    lid=leg_par_nom.get(norm(p.stem.replace('_',' ')))
    html=p.read_text(encoding='utf-8',errors='ignore')
    i=html.find('id="Full_material_list"'); j=html.find('<table',i); k=html.find('</table>',j)
    for rang in M._grille(html[j:k]):
        if not rang: continue
        t,q=M._cible(rang[0])
        if t and lid and not ecarte(t): tetes[lid].setdefault(t, q if q else 1)
    for par,enf,q in M.aretes(p):
        if ecarte(par) or ecarte(enf): continue
        aretes.setdefault((par,enf), q if q is not None else 1)

# --- creation des composants absents ---
crees=[]
for t in sorted({x for e in aretes for x in e} | {x for v in tetes.values() for x in v}):
    if norm(clean(t)) in idx: continue
    cid=slug(t)
    if cid in cc: continue
    don = t.startswith('Gift_of')
    raff = any(s in t for s in REFINE)
    e = collections.OrderedDict()
    e['name']=clean(t)
    if api.get(cid): e['apiId']=api[cid]
    e['kind']='advanced_craft' if don else ('refined' if raff else 'acquire')
    e['farmable']= not don
    e['qty']={}
    e['needed_for']=[]
    e['sources']=[{'type':'craft' if (don or raff) else 'acquire',
                   'tip':{'fr':None,'en':'Extrait de la section « Full material list » des pages d\'armes du wiki.'}}]
    cc[cid]=e
    idx[norm(clean(t))]=cid
    crees.append(cid)
print(f'composants crees : {len(crees)}')

def to_id(t): return idx.get(norm(clean(t)))

cibles=sorted({k.split('__')[0] for c in cc.values() for k in (c.get('qty') or {}) if k.split('__')[0] not in cc})
avant={l:totaux(l) for l in cibles}
def portee(cid, vu=None):
    if vu is None: vu=set()
    if cid in vu: return set()
    vu.add(cid); out=set()
    for k in (cc[cid].get('qty') or {}):
        b=k.split('__')[0]
        if b in cc: out |= portee(b,vu)
        else: out.add(b)
    return out

# --- rattachement des dons de tete au legendaire ---
att=0
for lid,tt in tetes.items():
    for t,q in tt.items():
        cid=to_id(t)
        if not cid: continue
        if lid in (cc[cid].get('qty') or {}): continue
        cc[cid].setdefault('qty',{})[lid]=q
        nf=set(cc[cid].get('needed_for') or []); nf.add(lid); cc[cid]['needed_for']=sorted(nf)
        att+=1
print(f'rattachements don -> legendaire : {att}')

# --- aretes internes, refusees si elles doublent un comptage existant ---
pose=0; refus=[]
for (par,enf),q in sorted(aretes.items()):
    p,c = to_id(par), to_id(enf)
    if not p or not c or p==c: continue
    if p in (cc[c].get('qty') or {}): continue
    direct={k.split('__')[0] for k in (cc[c].get('qty') or {}) if k.split('__')[0] not in cc}
    if direct & portee(p):
        refus.append((c,p,q,sorted(direct & portee(p))[:2])); continue
    cc[c].setdefault('qty',{})[p]=q
    nf=set(cc[c].get('needed_for') or []); nf.add(p); cc[c]['needed_for']=sorted(nf)
    pose+=1
print(f'aretes posees : {pose} | refusees pour double comptage : {len(refus)}')
for r in refus[:12]: print(f'   {r[0]} -> {r[1]} = {r[2]} (deja compte sur {r[3]})')

apres={l:totaux(l) for l in cibles}
ec=[(l,k,avant[l].get(k,0),apres[l].get(k,0)) for l in cibles
    for k in set(avant[l])|set(apres[l]) if avant[l].get(k,0)!=apres[l].get(k,0)]
baisses=[x for x in ec if x[3]<x[2]]
print(f'\nlignes de total modifiees : {len(ec)} | baisses : {len(baisses)}')
for x in baisses[:10]: print('   BAISSE',x)
print('exemple gen1_bolt :', {k:apres['gen1_bolt'].get(k,0) for k in
      ('gift_of_bolt','gift_of_metal','icy_runestone','orichalcum_ingot','mithril_ingot','charged_lodestone')})
d['_meta']['version']='v220'; d['_meta']['last_updated']='2026-09-05'
json.dump(d, open('gw2_sources_v220.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
