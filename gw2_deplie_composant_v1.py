import json, collections, sys
E={tuple(k.split('|')):v[0] for k,v in json.load(open('/tmp/edges2.json')).items()} if __import__('os').path.exists('/tmp/edges2.json') else {}
d=json.load(open('gw2_sources_v210.json'), object_pairs_hook=collections.OrderedDict)
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
# composants ayant au moins une arete en dette
dette=collections.defaultdict(list)
for cid,c in cc.items():
    chif={str(k).split('__')[0] for k in (c.get('qty') or {})}
    for p in set(c.get('needed_for') or []):
        if p in cc and p not in chif: dette[cid].append(p)
ok=[];ko=[]
for cid,parents in sorted(dette.items()):
    qs={p:E.get((p,cid)) for p in parents}
    if any(v is None for v in qs.values()):
        ko.append((cid,'arete non chiffree : '+', '.join(p for p,v in qs.items() if v is None))); continue
    flat={k:v for k,v in (cc[cid].get('qty') or {}).items() if k.split('__')[0] not in cc and isinstance(v,int)}
    # aretes deja chiffrees + celles a ajouter
    tout={p:(cc[cid]['qty'][p] if p in cc[cid].get('qty',{}) else qs[p]) for p in
          set(parents)|{k for k in (cc[cid].get('qty') or {}) if k in cc}}
    ecarts=[]
    for k,v in flat.items():
        leg=k.split('__')[0]
        pred=sum(q*avant.get(leg,{}).get(p,0) for p,q in tout.items())
        if k!=leg: pred=None
        if pred!=v: ecarts.append((k,v,pred))
    if ecarts: ko.append((cid,f'{len(ecarts)}/{len(flat)} cles a plat non reproduites par l\'arbre — ex {ecarts[:2]}')); continue
    ok.append((cid,tout,sorted(flat)))
print(f'depliables entierement : {len(ok)} | bloques : {len(ko)}')
for cid,tout,flat in ok: print(f'  OK {cid} : aretes {tout}, {len(flat)} cles retirees')
for cid,r in ko: print(f'  -- {cid} : {r}')
for cid,tout,flat in ok:
    q=cc[cid]['qty']
    for k in flat: del q[k]
    for p,v in tout.items(): q[p]=v
apres={l:totaux(l) for l in cibles}
ec=[(l,k,avant[l].get(k,0),apres[l].get(k,0)) for l in cibles for k in set(avant[l])|set(apres[l]) if avant[l].get(k,0)!=apres[l].get(k,0)]
print(f'\nECARTS DE TOTAL : {len(ec)}')
for x in ec[:15]: print('  ',x)
# Une seule variation attendue : gift_of_adventure_voe n'etait compte nulle
# part, l'arete le rattache a Selachimorpha via gift_of_castoran_mastery.
if len(ec)<=1:
    d['_meta']['version']='v211'; d['_meta']['last_updated']='2026-09-05'
    json.dump(d, open('gw2_sources_v211.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
    print('gw2_sources_v211.json ecrit')
