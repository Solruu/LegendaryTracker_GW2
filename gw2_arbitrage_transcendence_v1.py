import json, collections
d=json.load(open('gw2_sources_v217.json'), object_pairs_hook=collections.OrderedDict)
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

# --- Transcendence : les huit chevauchements sont legitimes ---
# La table separe deux branches. Le Mystic Tribute descend vers 2 Gifts of
# Condensed Might/Magic, eux-memes vers 2 dons de trophees chacun : c'est la
# cascade, 400 os anciens. Le Gift of the Champion descend vers les Essences
# mystiques, qui demandent 20 os anciens et 50 gros os : c'est la cle a plat.
# Deux exigences distinctes, pas un doublon.
NOTE=("Transcendence porte deux branches distinctes pour ces trophees : le Mystic "
      "Tribute par les dons condenses, et le Gift of the Champion par les Essences "
      "mystiques (20 et 50 selon le palier). Table « Full material list » de la page "
      "Transcendence, capturee le 05/09/2026.")
for cid in ('ancient_bone','large_bone','vicious_claw','large_claw','armored_scale',
            'large_scale','vial_of_powerful_blood','vial_of_potent_blood'):
    v=cc[cid]
    v['qty_overlap_verified']=sorted(set(v.get('qty_overlap_verified') or [])|{'transcendence'})
    ex=v.get('note')
    if isinstance(ex,dict): v['note']={'fr':((ex.get('fr')+' ') if ex.get('fr') else '')+NOTE,'en':ex.get('en')}
    elif isinstance(ex,str): v['note']={'fr':ex+' '+NOTE,'en':None}
    else: v['note']={'fr':NOTE,'en':None}
print('transcendence : 8 chevauchements declares legitimes')

# --- Klobjarne : le cube figure DEUX fois dans la table, une par branche ---
# Gift of Expertise sous Gift of Janthir Wilds, Gift of Research sous Gift of
# Klobjarne Geirr. Chaque cube vaut 75 matrices : 150 au total. Les 150 a plat
# etaient donc la meme depense, comptee une seconde fois.
T=tot('klobjarne_geirr')
avant_sm=T.get('stabilizing_matrix',0)
cc['cube_stabilized_dark_energy']['qty']['gift_of_research']=1
nf=set(cc['cube_stabilized_dark_energy'].get('needed_for') or []); nf.add('gift_of_research')
cc['cube_stabilized_dark_energy']['needed_for']=sorted(nf)
T=tot('klobjarne_geirr')
arbre=75*T.get('cube_stabilized_dark_energy',0)
plat=cc['stabilizing_matrix']['qty'].get('klobjarne_geirr')
print(f'klobjarne : a plat {plat}, arbre {arbre} (cubes={T.get("cube_stabilized_dark_energy",0)})')
if arbre==plat:
    del cc['stabilizing_matrix']['qty']['klobjarne_geirr']
    print('   cle a plat retiree, la chaine suffit')
T=tot('klobjarne_geirr')
print('   stabilizing_matrix klobjarne :',avant_sm,'->',T.get('stabilizing_matrix',0))
d['_meta']['version']='v218'; d['_meta']['last_updated']='2026-09-05'
json.dump(d, open('gw2_sources_v218.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
