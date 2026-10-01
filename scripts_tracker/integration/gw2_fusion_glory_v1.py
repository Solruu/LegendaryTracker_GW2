import json, collections
d=json.load(open('gw2_sources_v213.json'), object_pairs_hook=collections.OrderedDict)
cc=d['craft_components']; legs=d['legendaries']
ARMOR={'perfected_envoy','obsidian','triumphant_hero','ardent_glorious'}
def totaux(leg):
    tot={}; exp={}
    for cid,c in cc.items():
        q=c.get('qty') or {}
        for suf,mult in (('',1),('__per_piece',6 if leg in ARMOR else 0),('__onetime',1),('__per_unit',1),('__full_set',1 if leg in ARMOR else 0)):
            v=q.get(leg+suf)
            if isinstance(v,int) and mult: tot[cid]=tot.get(cid,0)+v*mult
    for _ in range(8):
        add={}
        for cid,c in cc.items():
            for k,v in (c.get('qty') or {}).items():
                if isinstance(v,int) and k in cc and tot.get(k,0)>0: add[cid]=add.get(cid,0)+v*tot[k]
        ch=False
        for cid,v in add.items():
            if exp.get(cid,0)!=v: tot[cid]=tot.get(cid,0)-exp.get(cid,0)+v; exp[cid]=v; ch=True
        if not ch: break
    return tot
cibles=sorted({k.split('__')[0] for c in cc.values() for k in (c.get('qty') or {}) if k.split('__')[0] not in cc})
avant={l:totaux(l) for l in cibles}
print('avant — transcendence :', {k:avant['transcendence'].get(k,0) for k in ('ascended_shard_of_glory','ascended_shards_of_glory')})

G,J='ascended_shard_of_glory','ascended_shards_of_glory'
a,b=cc[G],cc[J]
# La monnaie du portefeuille s'appelle « Ascended Shards of Glory » AU PLURIEL
# (id 33) ; l'objet du wiki est au singulier et n'a aucun apiId. C'est la
# monnaie qui fait foi pour lire le stock.
a['name']='Ascended Shards of Glory'
a['kind']='currency'
a['apiId']=33
a['apiIdNote']={'fr':"Identifiant de MONNAIE (portefeuille), pas d'objet : la page wiki ne porte ni lien API ni gamelink. L'ancien 69085 n'etait atteste nulle part.",'en':None}
# Le 900 du doublon sur Transcendence n'a aucune source. Les autres valeurs de
# l'entree conservee sont corroborees par la page : Mist Band (Infused) coute
# bien 150 eclats ascensionnels, comme la table « Currency for » l'indique.
for k,v in (b.get('qty') or {}).items():
    if k not in a.get('qty',{}): a.setdefault('qty',{})[k]=v
a['needed_for']=sorted(set(a.get('needed_for') or [])|set(b.get('needed_for') or []))
for k,v in b.items():
    if k in ('name','apiId','kind','qty','needed_for','apiIdNote'): continue
    if k=='sources' and isinstance(a.get('sources'),list) and isinstance(v,list):
        connus={json.dumps(x,sort_keys=True) for x in a['sources']}
        a['sources'] += [x for x in v if json.dumps(x,sort_keys=True) not in connus]
    elif k not in a or a[k] in (None,{},[]): a[k]=v
for c in cc.values():
    q=c.get('qty') or {}
    if J in q:
        if G in q: q.pop(J)
        else: q[G]=q.pop(J)
    if c.get('needed_for'): c['needed_for']=sorted({G if x==J else x for x in c['needed_for']})
for l in legs.values():
    if isinstance(l,dict) and isinstance(l.get('components'),list):
        l['components']=[G if x==J else x for x in l['components']]
        vus=set(); l['components']=[x for x in l['components'] if not (x in vus or vus.add(x))]
del cc[J]
def ren(n):
    if isinstance(n,dict):
        for k,v in list(n.items()):
            if isinstance(v,str) and v==J: n[k]=G
            else: ren(v)
    elif isinstance(n,list):
        for i,v in enumerate(n):
            if isinstance(v,str) and v==J: n[i]=G
            else: ren(v)
ren(d)
apres={l:totaux(l) for l in cibles}
print('apres — transcendence :', apres['transcendence'].get(G,0))
ec=[(l,k,avant[l].get(k,0),apres[l].get(k,0)) for l in cibles for k in set(avant[l])|set(apres[l]) if avant[l].get(k,0)!=apres[l].get(k,0)]
print('variations:',len(ec))
for x in ec: print('  ',x)
d['_meta']['version']='v214'; d['_meta']['last_updated']='2026-09-05'
json.dump(d, open('gw2_sources_v214.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
