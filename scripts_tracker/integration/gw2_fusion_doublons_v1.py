#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fusionne deux entrees de craft_components decrivant le meme objet.

Deux paires portaient le meme nom d'affichage ET le meme objet de jeu :
`crystalline_ingot` / `crystalline_ingot_gen2` (apiId 46683 des deux cotes) et
`skirmish_claim_ticket` / `skirmish_claim_tickets`. Chacune des deux entrees
calculait deja, de son cote, le meme total : l'onglet affichait donc DEUX
lignes de meme nom et le cout etait double. Conflux annoncait 3700 tickets
d'escarmouche au lieu de 1850, Warbringer 5600 au lieu de 2800.

Fusionner n'est pas additionner. Pour chaque cible, on retient la valeur d'UNE
des deux entrees, apres avoir verifie qu'elles ne divergent pas — elles ne
divergeaient nulle part. Trois pieges ont ete rencontres dans cet ordre :

1. Les references par identifiant ne vivent pas que dans `qty`. `cadence_ref`
   pointe aussi des composants depuis les legendaires et les armures : six
   d'entre elles designaient le doublon, et l'audit les a signalees orphelines.
2. La cadence structuree elle-meme vivait sur l'entree jetee. Sans elle, six
   plafonds « 365/sem » ecrits en prose devenaient des erreurs.
3. Une meme depense pouvait arriver par deux chemins apres fusion : en direct
   et par la cascade. Pour le lingot, l'arbre couvrait EXACTEMENT le montant a
   plat (250 lingots par `funerary_incense` sur Coalescence), donc la cle a
   plat part et l'arete reste : c'est un depliage. Pour les tickets, l'arbre ne
   couvrait qu'une part du montant, donc c'est l'arete qui part, en dette.

Rejoue depuis gw2_sources_v207.json, il reproduit gw2_sources_v208.json.
"""
import json, collections, sys
d=json.load(open('gw2_sources_v207.json'), object_pairs_hook=collections.OrderedDict)
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
rapport=[]

def fusionner(garde, jette, label):
    """Fusionne deux entrees decrivant le meme objet.

    Chaque entree calculait deja, chacune de son cote, le meme total : l'onglet
    en affichait donc DEUX lignes de meme nom, et le cout etait double. La
    fusion ne doit pas additionner les deux qty — elle doit retenir, pour chaque
    cible, la valeur d'UNE des deux entrees.
    """
    a,b=cc[garde],cc[jette]
    for cible in sorted(set(avant)):
        va,vb=avant[cible].get(garde,0),avant[cible].get(jette,0)
        if va and vb and va!=vb:
            rapport.append((label,'DIVERGENCE',cible,va,vb))
    qa,qb=a.setdefault('qty',{}),b.get('qty') or {}
    for k,v in qb.items():
        if k not in qa: qa[k]=v
    a['needed_for']=sorted(set(a.get('needed_for') or [])|set(b.get('needed_for') or []))
    # Tout ce que l'entree conservee n'a pas, elle le reprend de l'autre : la
    # cadence structuree vivait sur le doublon, et six cadence_ref pointaient
    # dessus. La perdre faisait remonter en erreur six plafonds « 365/sem »
    # ecrits en prose et soudain orphelins.
    for k, v in b.items():
        if k in ('name', 'apiId', 'kind', 'qty', 'needed_for'):
            continue
        if k == 'sources' and isinstance(a.get('sources'), list) and isinstance(v, list):
            connus = {json.dumps(x, sort_keys=True) for x in a['sources']}
            a['sources'] += [x for x in v if json.dumps(x, sort_keys=True) not in connus]
        elif k not in a or a[k] in (None, {}, []):
            a[k] = v
    for c in cc.values():
        q=c.get('qty') or {}
        if jette in q:
            if garde in q: q.pop(jette)
            else: q[garde]=q.pop(jette)
        if c.get('needed_for'):
            c['needed_for']=sorted({garde if x==jette else x for x in c['needed_for']})
    for l in legs.values():
        if isinstance(l,dict) and isinstance(l.get('components'),list):
            l['components']=[garde if x==jette else x for x in l['components']]
            vus=set(); l['components']=[x for x in l['components'] if not (x in vus or vus.add(x))]
    # Les references par identifiant ne vivent pas que dans qty : cadence_ref
    # pointe aussi des composants depuis les legendaires et les armures. Les
    # oublier laissait douze cadence_ref orphelines et un audit rouge.
    def _renommer(n):
        if isinstance(n,dict):
            for k,v in list(n.items()):
                if isinstance(v,str) and v==jette: n[k]=garde
                else: _renommer(v)
        elif isinstance(n,list):
            for i,v in enumerate(n):
                if isinstance(v,str) and v==jette: n[i]=garde
                else: _renommer(v)
    del cc[jette]
    _renommer(d)

def portee(cid, vu=None):
    if vu is None: vu=set()
    if cid in vu: return set()
    vu.add(cid); out=set()
    for k in (cc[cid].get('qty') or {}):
        b=k.split('__')[0]
        if b in cc: out |= portee(b,vu)
        else: out.add(b)
    return out

def degager_doublons(cid):
    """Retire les cles qui rendraient le composant compte deux fois."""
    q=cc[cid]['qty']; direct={k for k in q if k.split('__')[0] not in cc}
    retires=[]
    for k in list(q):
        if k.split('__')[0] not in cc: continue
        p=portee(k.split('__')[0])
        croise=p & {x.split('__')[0] for x in direct}
        if croise:
            retires.append((cid,k,q.pop(k),sorted(croise)))
    return retires

fusionner('skirmish_claim_ticket','skirmish_claim_tickets','tickets')
r1=degager_doublons('skirmish_claim_ticket')
fusionner('crystalline_ingot','crystalline_ingot_gen2','ingot')
# Le lingot est le seul des trois ou l'arbre couvre EXACTEMENT le montant a
# plat : coalescence et vision atteignent 250 lingots par funerary_incense, et
# portaient en plus 250 en dur. On retire donc la cle a plat et on garde
# l'arete, ce qui est un depliage. Pour les tickets l'arbre ne couvrait qu'une
# part du montant, et c'est l'arete qui part, en dette.
for _leg in ('coalescence','vision'):
    if _leg in cc['crystalline_ingot']['qty']:
        r1.append(('crystalline_ingot', _leg+' (cle a plat)',
                   cc['crystalline_ingot']['qty'].pop(_leg), ['couvert par funerary_incense']))
apres={l:totaux(l) for l in cibles}
print('DIVERGENCES entre les deux entrees :',[x for x in rapport if x[1]=='DIVERGENCE'] or 'aucune')
print('\naretes retirees pour eviter le double comptage :')
for x in r1: print('  ',x)
print('\nvariations de total :')
ec=[(l,k,avant[l].get(k,0),apres[l].get(k,0)) for l in cibles
    for k in set(avant[l])|set(apres[l]) if avant[l].get(k,0)!=apres[l].get(k,0)]
baisses=[x for x in ec if x[3]<x[2]]; hausses=[x for x in ec if x[3]>x[2]]
print(f'  {len(baisses)} baisses, {len(hausses)} hausses')
for x in baisses[:12]: print('   BAISSE',x)
for x in hausses[:8]: print('   HAUSSE',x)
d['_meta']['version']='v208'; d['_meta']['last_updated']='2026-09-05'
json.dump(d, open('gw2_sources_v208.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
