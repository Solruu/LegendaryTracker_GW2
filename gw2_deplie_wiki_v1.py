import json, collections, sys
E={tuple(k.split('|')):v[0] for k,v in json.load(open('/tmp/edges2.json')).items()}
parents=collections.defaultdict(dict)
for (p,c),q in E.items(): parents[c][p]=q
d=json.load(open('gw2_sources_v214.json'), object_pairs_hook=collections.OrderedDict)
cc=d['craft_components']
ARMOR={'perfected_envoy','obsidian','triumphant_hero','ardent_glorious'}
SUF=(('',1),('__per_piece',6),('__onetime',1),('__per_unit',1),('__full_set',1))
def totaux(leg):
    tot={}; exp={}
    for cid,c in cc.items():
        q=c.get('qty') or {}
        for suf,m in SUF:
            mult = m if (suf not in ('__per_piece','__full_set') or leg in ARMOR) else 0
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
cibles=sorted({k.split('__')[0] for c in cc.values() for k in (c.get('qty') or {}) if k.split('__')[0] not in cc})
avant={l:totaux(l) for l in cibles}
faits=[]; refus=[]
for tour in range(6):
    T={l:totaux(l) for l in cibles}
    bouge=False
    for cid in sorted(cc):
        pw=parents.get(cid)
        if not pw: continue
        q=cc[cid]['qty']
        plat=[k for k,v in q.items() if k.split('__')[0] not in cc and isinstance(v,int)]
        if not plat: continue
        if any(k!=k.split('__')[0] for k in plat):
            continue                      # cles suffixees : multiplicateur different, on ne touche pas
        ok=True; ecarts=[]
        for k in plat:
            pred=sum(qq*T[k].get(p,0) for p,qq in pw.items() if p in cc)
            if pred!=q[k]: ok=False; ecarts.append((k,q[k],pred))
        if not ok:
            if cid not in [r[0] for r in refus]: refus.append((cid,ecarts[:3],len(plat)))
            continue
        for k in plat: del q[k]
        # needed_for porte le graphe affiche : une arete chiffree qui n'y
        # figure pas est comptee sans etre montree, ce que check_needed_for_chiffre
        # traite en erreur. On declare donc les deux ensemble.
        nf=set(cc[cid].get('needed_for') or [])
        for p,qq in pw.items():
            if p in cc:
                q[p]=qq; nf.add(p)
        if nf: cc[cid]['needed_for']=sorted(nf)
        faits.append((cid,dict(pw),len(plat))); bouge=True
    if not bouge: break
apres={l:totaux(l) for l in cibles}
ec=[(l,k,avant[l].get(k,0),apres[l].get(k,0)) for l in cibles for k in set(avant[l])|set(apres[l]) if avant[l].get(k,0)!=apres[l].get(k,0)]
print(f'deplies : {len(faits)} composants, {sum(f[2] for f in faits)} cles a plat retirees')
for cid,pw,n in faits: print(f'   {cid} : {n} cles -> {pw}')
print(f'\nrefuses : {len(refus)}')
for cid,ecarts,n in refus[:20]: print(f'   {cid} ({n} cles) — ex {ecarts}')
print(f'\nECARTS DE TOTAL : {len(ec)}')
for x in ec[:10]: print('  ',x)
# Le seul ecart attendu est jade_runestone : il portait 100 en direct sur seize
# gen3 ET une arete vers gift_of_the_dragon_empire ajoutee en v210, soit 200
# annonces au lieu de 100. Retirer la cle a plat corrige le double comptage.
attendu = {x for x in ec if x[1] == 'jade_runestone' and x[2] == 2 * x[3]}
if not (set(ec) - attendu):
    d['_meta']['version']='v215'; d['_meta']['last_updated']='2026-09-05'
    json.dump(d, open('gw2_sources_v215.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
    print('gw2_sources_v215.json ecrit')
