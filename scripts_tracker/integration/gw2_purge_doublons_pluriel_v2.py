import json, collections
d=json.load(open('gw2_sources_v212.json'), object_pairs_hook=collections.OrderedDict)
cc=d['craft_components']
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
print('avant — orrax_manifested :')
for k in ['shard_of_mistburned_barrens','shards_of_mistburned_barrens','shard_of_bava_nisos','shards_of_bava_nisos']:
    print('   ',k,avant['orrax_manifested'].get(k,0))

# 103200 est le gizmo « The End? », 104801 un Stone-Growth Longbow Skin. Les
# entrees au pluriel n'existent pas. Les vraies portent 104282 et 104855, toutes
# deux attestees deux fois sur leur page wiki.
for pluriel, singulier in [('shards_of_mistburned_barrens','shard_of_mistburned_barrens'),
                           ('shards_of_bava_nisos','shard_of_bava_nisos')]:
    a,b=cc[singulier],cc[pluriel]
    for k,v in (b.get('qty') or {}).items():
        if k not in a.get('qty',{}): a.setdefault('qty',{})[k]=v
    a['needed_for']=sorted(set(a.get('needed_for') or [])|set(b.get('needed_for') or []))
    for k,v in b.items():
        if k in ('name','apiId','kind','qty','needed_for'): continue
        if k=='sources' and isinstance(a.get('sources'),list) and isinstance(v,list):
            connus={json.dumps(x,sort_keys=True) for x in a['sources']}
            a['sources'] += [x for x in v if json.dumps(x,sort_keys=True) not in connus]
        elif k not in a or a[k] in (None,{},[]): a[k]=v
    for c in cc.values():
        q=c.get('qty') or {}
        if pluriel in q:
            if singulier in q: q.pop(pluriel)
            else: q[singulier]=q.pop(pluriel)
        if c.get('needed_for'): c['needed_for']=sorted({singulier if x==pluriel else x for x in c['needed_for']})
    del cc[pluriel]
    def ren(n):
        if isinstance(n,dict):
            for k,v in list(n.items()):
                if isinstance(v,str) and v==pluriel: n[k]=singulier
                else: ren(v)
        elif isinstance(n,list):
            for i,v in enumerate(n):
                if isinstance(v,str) and v==pluriel: n[i]=singulier
                else: ren(v)
    ren(d)
    # Depliage : l'eclat entre dans Orrax par Gift of the Mistburned Isles, a
    # 100. La cle a plat sur le legendaire faisait la meme depense une seconde
    # fois.
    q=cc[singulier]['qty']
    tree = 100*avant['orrax_manifested'].get('gift_of_the_mistburned_isles',0)
    if q.get('orrax_manifested')==tree:
        q.pop('orrax_manifested')
        cc[singulier]['needed_for']=[x for x in cc[singulier]['needed_for'] if x!='orrax_manifested']
    else:
        print(f'  !! {singulier}: a plat {q.get("orrax_manifested")} vs arbre {tree}, cle conservee')
apres={l:totaux(l) for l in cibles}
print('\napres — orrax_manifested :')
for k in ['shard_of_mistburned_barrens','shard_of_bava_nisos']:
    print('   ',k,apres['orrax_manifested'].get(k,0))
ec=[(l,k,avant[l].get(k,0),apres[l].get(k,0)) for l in cibles for k in set(avant[l])|set(apres[l]) if avant[l].get(k,0)!=apres[l].get(k,0)]
print('\nvariations:',len(ec))
for x in ec: print('  ',x)
d['_meta']['version']='v213'; d['_meta']['last_updated']='2026-09-05'
json.dump(d, open('gw2_sources_v213.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
