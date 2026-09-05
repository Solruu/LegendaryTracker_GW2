import json, re, collections, sys
d=json.load(open('gw2_sources_v209.json'), object_pairs_hook=collections.OrderedDict)
cc=d['craft_components']
ARMOR={'perfected_envoy','obsidian','triumphant_hero','ardent_glorious'}
def norm(s): return re.sub(r'[^a-z0-9]','',s.lower())
def nom(cid):
    n=cc.get(cid,{}).get('name')
    return (n.get('en') or n.get('fr')) if isinstance(n,dict) else (n or cid)
def clean(t): return t.replace('_',' ').replace('%27',"'").replace('%C3%A9','é')
by=collections.defaultdict(set)
for cid in cc:
    by[norm(nom(cid))].add(cid); by[norm(cid.replace('_',' '))].add(cid)
    n=nom(cid)
    if '/' in n:
        g,dd=n.split('/',1)
        by[norm(g.strip())].add(cid); by[norm(dd.strip())].add(cid)
        mots=g.strip().split()
        if len(mots)>1: by[norm(' '.join(mots[:-1])+' '+dd.strip())].add(cid)
AMBIG=set()
def to_id(t,page=None):
    for k in (norm(clean(t)), norm(clean(t)).rstrip('s'), norm(clean(t))+'s'):
        s=by.get(k)
        if not s: continue
        if len(s)==1: return next(iter(s))
        if page and page in s: return page
        AMBIG.add((t,tuple(sorted(s)))); return None
    return None
# sources : recette puis cout vendeur
edges=collections.defaultdict(dict)   # parent -> {enfant: (qty, origine)}
conflits=[]
for r in json.load(open('gw2_wiki_recipes_v1.json')):
    if not r['recettes']: continue
    p = r['page'] if r['page'] in cc else to_id(r['titre'] or r['page'], r['page'])
    if not p: continue
    for rc in r['recettes']:
        for cible,q in rc['ingredients']:
            c=to_id(cible)
            if c: edges[p][c]=(q,'recette')
for r in json.load(open('gw2_wiki_vendor_costs_v1.json')):
    if not r['couts']: continue
    p = r['page'] if r['page'] in cc else to_id(r['titre'] or r['page'], r['page'])
    if not p: continue
    for cible,q in r['couts']:
        c=to_id(cible)
        if not c: continue
        if c in edges[p]:
            if edges[p][c][0]!=q: conflits.append((p,c,edges[p][c],q))
        else: edges[p][c]=(q,'vendeur')
print('parents chiffres:',len(edges),'| conflits recette/vendeur:',len(conflits))
for x in conflits: print('   ',x)
print('ambiguites restantes:',sorted(AMBIG))
json.dump({f'{p}|{c}':v for p,dd in edges.items() for c,v in dd.items()}, open('/tmp/edges2.json','w'))
