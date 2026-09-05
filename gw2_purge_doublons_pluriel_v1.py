import json, collections
d=json.load(open('gw2_sources_v211.json'), object_pairs_hook=collections.OrderedDict)
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
print('avant — klobjarne_geirr :')
for k in ['shard_of_lowland_shore','shards_of_lowland_shore','shard_of_janthir_syntri','shards_of_janthir_syntri']:
    print('   ',k,avant['klobjarne_geirr'].get(k,0))

# Les deux entrees au pluriel n'existent pas dans le jeu : leurs apiId designent
# une Magical Cape et un Corrupted Hero Scepter. Aucun nom d'objet GW2 n'est au
# pluriel. Leur 500 sur Klobjarne n'a aucune source.
for pluriel, singulier, parent in [('shards_of_lowland_shore','shard_of_lowland_shore','gift_of_gatherer_of_the_hunt'),
                                   ('shards_of_janthir_syntri','shard_of_janthir_syntri','gift_of_gatherer_of_the_hunt')]:
    a,b=cc[singulier],cc[pluriel]
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
    # depliage : la recette de Gift of Gatherer of the Hunt demande 100 eclats,
    # et l'arbre gw2efficiency de Klobjarne n'en montre qu'un seul noeud a 100.
    q=cc[singulier]['qty']
    q.pop('klobjarne_geirr',None)
    q[parent]=100
    cc[singulier]['needed_for']=sorted(set(cc[singulier].get('needed_for') or [])|{parent})
    if 'klobjarne_geirr' in (cc[singulier].get('needed_for') or []):
        cc[singulier]['needed_for']=[x for x in cc[singulier]['needed_for'] if x!='klobjarne_geirr']
apres={l:totaux(l) for l in cibles}
print('\napres — klobjarne_geirr :')
for k in ['shard_of_lowland_shore','shard_of_janthir_syntri']:
    print('   ',k,apres['klobjarne_geirr'].get(k,0))
ec=[(l,k,avant[l].get(k,0),apres[l].get(k,0)) for l in cibles for k in set(avant[l])|set(apres[l]) if avant[l].get(k,0)!=apres[l].get(k,0)]
print('\nvariations:',len(ec))
for x in ec: print('  ',x)
d['_meta']['version']='v212'; d['_meta']['last_updated']='2026-09-05'
json.dump(d, open('gw2_sources_v212.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
