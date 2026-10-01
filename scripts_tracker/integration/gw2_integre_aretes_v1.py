import json, collections, sys
E={tuple(k.split('|')):v for k,v in json.load(open('/tmp/edges2.json')).items()}
d=json.load(open('gw2_sources_v209.json'), object_pairs_hook=collections.OrderedDict)
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
def portee(cid, vu=None):
    if vu is None: vu=set()
    if cid in vu: return set()
    vu.add(cid); out=set()
    for k in (cc[cid].get('qty') or {}):
        b=k.split('__')[0]
        if b in cc: out |= portee(b,vu)
        else: out.add(b)
    return out
# aretes en dette
dette=[]
for cid,c in cc.items():
    chif={str(k).split('__')[0] for k in (c.get('qty') or {})}
    for p in set(c.get('needed_for') or []):
        if p in cc and p not in chif: dette.append((cid,p))
depli=[];comble=[];refus=[];sans=[]
for cid,p in sorted(dette):
    v=E.get((p,cid))
    if not v: sans.append((cid,p)); continue
    q,orig=v
    direct={k for k in (cc[cid].get('qty') or {}) if k.split('__')[0] not in cc}
    port=portee(p)
    croise={k for k in direct if k.split('__')[0] in port}
    if not croise: comble.append((cid,p,q,orig)); continue
    if croise!=direct:
        refus.append((cid,p,q,f'{len(croise)}/{len(direct)} cles couvertes')); continue
    pq=cc[p].get('qty') or {}
    if any(not isinstance(pq.get(k),int) for k in direct):
        refus.append((cid,p,q,'le parent atteint par une chaine, pas en direct')); continue
    rap={cc[cid]['qty'][k]/pq[k] for k in direct}
    if len(rap)!=1 or list(rap)[0]!=q:
        refus.append((cid,p,q,f'wiki {q}, table a plat implique {sorted(rap)}')); continue
    depli.append((cid,p,q,sorted(direct)))
for cid,p,q,ks in depli:
    for k in ks: del cc[cid]['qty'][k]
    cc[cid]['qty'][p]=q
for cid,p,q,orig in comble: cc[cid]['qty'][p]=q
apres={l:totaux(l) for l in cibles}
ec=[(l,k,avant[l].get(k,0),apres[l].get(k,0)) for l in cibles for k in set(avant[l])|set(apres[l]) if avant[l].get(k,0)!=apres[l].get(k,0)]
print(f'deplies {len(depli)} | combles {len(comble)} (dont vendeur: {sum(1 for x in comble if x[3]=="vendeur")}) | refus {len(refus)} | sans source {len(sans)}')
print(f'lignes de total modifiees : {len(ec)} (hausses seules : {all(x[2]<x[3] for x in ec)})')
print('\nCOMBLES vendeur:'); 
for x in comble:
    if x[3]=='vendeur': print('  ',x[0],'->',x[1],'=',x[2])
print('\nREFUS:')
for x in refus: print('  ',x[0],'->',x[1],'=',x[2],'—',x[3])
print('\nSANS SOURCE:',len(sans))
for x in sans: print('  ',x[0],'->',x[1])
d['_meta']['version']='v210'; d['_meta']['last_updated']='2026-09-05'
json.dump(d, open('gw2_sources_v210.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
