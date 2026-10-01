import json, collections
d=json.load(open('gw2_sources_v216.json'), object_pairs_hook=collections.OrderedDict)
cc=d['craft_components']
def tot(leg):
    t={}; exp={}
    for cid,c in cc.items():
        v=(c.get('qty') or {}).get(leg)
        if isinstance(v,int): t[cid]=t.get(cid,0)+v
    for _ in range(10):
        add={}
        for cid,c in cc.items():
            for k,v in (c.get('qty') or {}).items():
                if isinstance(v,int) and k in cc and t.get(k,0)>0: add[cid]=add.get(cid,0)+v*t[k]
        ch=False
        for cid,v in add.items():
            if exp.get(cid,0)!=v: t[cid]=t.get(cid,0)-exp.get(cid,0)+v; exp[cid]=v; ch=True
        if not ch: break
    return t

# --- 1. chevauchements confirmes par une capture : declares, avec provenance ---
CONFIRMES={
 'bloodstone_dust':(['conflux'],"Arbre gw2efficiency de Conflux : deux noeuds distincts, 250 et 1 000."),
 'dragonite_ore':(['conflux'],"Arbre gw2efficiency de Conflux : deux noeuds distincts, 250 et 1 000."),
 'empyreal_fragment':(['conflux'],"Arbre gw2efficiency de Conflux : deux noeuds distincts, 250 et 1 000."),
 'obsidian_shard':(['coalescence'],"Arbre gw2efficiency de Coalescence : noeuds 249 et 250, le second par la fulgurite."),
 'bloodstone_shard':(['gen2_eureka'],"Table d'Eureka : un eclat sous Gift of Maguuma Mastery, un autre sous Gift of Desert Mastery."),
 'crystalline_ingot':(['gen2_eureka'],"Table d'Eureka : 250 lingots sous Gift of Maguuma Mastery, 250 autres par l'encens funeraire sous Gift of Desert Mastery."),
}
for cid,(legs_,note) in CONFIRMES.items():
    v=cc[cid]
    v['qty_overlap_verified']=sorted(set(v.get('qty_overlap_verified') or [])|set(legs_))
    v['qty_overlap_note']={'fr':note,'en':None}
print('chevauchements declares :',len(CONFIRMES))

# --- 2. gift_of_battle : la cle a plat double la chaine Gift of the Mists ---
# gift_of_battle -> gift_of_the_mists vient de la recette du wiki, et
# gift_of_the_mists -> gift_of_<arme> des tables. La chaine est sourcee aux deux
# bouts et rend exactement la valeur a plat : celle-ci fait doublon.
q=cc['gift_of_battle']['qty']
retires=[]
for k in [x for x in q if x.split('__')[0] not in cc]:
    T=tot(k.split('__')[0])
    arbre=sum(v*T.get(p,0) for p,v in q.items() if p in cc)
    if arbre==q[k] and arbre>0:
        retires.append((k,q[k])); del q[k]
print('gift_of_battle : cles a plat retirees',len(retires))
d['_meta']['version']='v217'; d['_meta']['last_updated']='2026-09-05'
json.dump(d, open('gw2_sources_v217.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
