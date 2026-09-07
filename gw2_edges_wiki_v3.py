# -*- coding: utf-8 -*-
"""Extrait les aretes de l'arbre de craft depuis les captures wiki.

v3 : ECARTE LES RECETTES DE PROMOTION.

Une recette de promotion transforme en masse un materiau en son palier
superieur : 50 Bone + 5 Pile of Luminous Dust + 3 Philosopher's Stone donnent
7 Heavy Bone. Le wiki la presente dans la meme boite Recipe qu'une recette
ordinaire, et la v2 la posait donc comme une arete de l'arbre.

C'est faux, et c'est faux de deux facons. D'abord une promotion n'est pas une
exigence : aucun legendaire ne demande de promouvoir quoi que ce soit, il
demande N Heavy Bone et le joueur les obtient comme il veut. Ensuite ces
recettes relient les paliers de trophees entre eux dans les deux sens et
multiplient les chemins de la cascade : posees telles quelles, la poussiere
radiante de Coalescence passait de 100 a plus d'un milliard.

Le signal est net et sans faux positif sur le corpus : sortie > 1. Les 49
recettes concernees sont toutes des conversions de palier — trophees, bois,
minerais, tissus, cuirs, poussieres — et aucune recette de l'arbre reel ne
produit plus d'un objet a la fois. Elles sont comptees et listees, pas
silencieusement jetees.

v3 ECARTE AUSSI LES INGREDIENTS ALTERNATIFS.

Meme famille d'erreur, autre forme. Quand une page porte PLUSIEURS recettes,
ce sont des voies concurrentes, pas des exigences qui s'additionnent. Gift of
Infused Gems en a six, une par type d'orbe : la v2 posait les six et rendait
250 orbes de CHAQUE couleur obligatoires. Claw of the Khan-Ur en a deux, Gift
of Maguuma Mastery ou Gift of Desert Mastery : la v2 exigeait les deux. Les
lodestones en ont deux, Bottle of Elonian Wine ou Mystic Binding Agent.

On ne garde donc que l'INTERSECTION des ingredients de toutes les recettes
d'une page — ce que le joueur devra fournir quelle que soit la voie choisie.
Une quantite qui differe d'une voie a l'autre est ecartee au meme titre.

Les voies alternatives ne sont pas perdues : elles restent dans les captures
wiki, et c'est le champ `recipe` de la donnee qui a vocation a les porter,
puisqu'elles ne sont precisement pas chiffrables dans l'arbre.

La table VENDEUR ne sait pas distinguer les voies : elle aplatit les six orbes
de Gift of Infused Gems en une seule liste. Quand une page porte aussi des
recettes, ce sont les recettes qui tranchent : un ingredient qu'elles ont
designe comme alternatif ne peut pas revenir par le vendeur.
"""
import json, re, collections, sys
from pathlib import Path
# Le fichier de sources est resolu au plus haut _vN plutot que code en dur :
# une version figee ici devient introuvable des la passe suivante.
SRC = max(Path(__file__).resolve().parent.glob('gw2_sources_v*.json'),
          key=lambda p: int(p.stem.split('_v')[-1]))
d=json.load(open(SRC), object_pairs_hook=collections.OrderedDict)
cc=d['craft_components']
ARMOR={'perfected_envoy','obsidian','triumphant_hero','ardent_glorious'}
def norm(s): return re.sub(r'[^a-z0-9]','',s.lower())
def nom(cid):
    n=cc.get(cid,{}).get('name')
    return (n.get('en') or n.get('fr')) if isinstance(n,dict) else (n or cid)
def clean(t): return t.replace('_',' ').replace('%27',"'").replace('%C3%A9','é')
by=collections.defaultdict(set)
def sans_pluriel(x):
    # « Shard of Lowland Shore » cote wiki, « Shards of Lowland Shore » en base :
    # le pluriel est au milieu de la locution, pas a la fin, donc rstrip('s') ne
    # sert a rien. On compare des formes ou tous les 's' ont saute. C'est brutal,
    # mais le rapprochement refuse deja de trancher en cas d'ambiguite, donc une
    # collision est signalee, jamais devinee.
    return x.replace('s','')
def sans_parenthese(x):
    # « Gift of Adventure (VoE) » : le suffixe desambigue en base, le wiki ne
    # le porte pas.
    return re.sub(r'\(.*?\)','',x).strip()
for cid in cc:
    n=nom(cid)
    for v in (n, cid.replace('_',' '), sans_parenthese(n)):
        by[norm(v)].add(cid); by[sans_pluriel(norm(v))].add(cid)
    n=nom(cid)
    if '/' in n:
        g,dd=n.split('/',1)
        by[norm(g.strip())].add(cid); by[norm(dd.strip())].add(cid)
        mots=g.strip().split()
        if len(mots)>1: by[norm(' '.join(mots[:-1])+' '+dd.strip())].add(cid)
AMBIG=set()
def to_id(t,page=None):
    base=norm(clean(t))
    for k in (base, base.rstrip('s'), base+'s', sans_pluriel(base)):
        s=by.get(k)
        if not s: continue
        if len(s)==1: return next(iter(s))
        if page and page in s: return page
        AMBIG.add((t,tuple(sorted(s)))); return None
    return None
# sources : recette puis cout vendeur
edges=collections.defaultdict(dict)   # parent -> {enfant: (qty, origine)}
conflits=[]
promotions=[]
variantes={}
ecartes_alt=[]
alternatifs_de={}
for r in json.load(open('gw2_wiki_recipes_v1.json')):
    if not r['recettes']: continue
    p = r['page'] if r['page'] in cc else to_id(r['titre'] or r['page'], r['page'])
    if not p: continue
    for rc in r['recettes']:
        if rc['sortie'] > 1:
            # Promotion : voie d'acquisition alternative, pas une exigence.
            promotions.append((r['page'], rc['sortie'], rc['ingredients'][0][0]))
            continue
        variantes.setdefault(p, []).append(dict(rc['ingredients']))
for p, vs in variantes.items():
    communs = set(vs[0])
    for v in vs[1:]:
        communs &= {k for k in v if k in vs[0] and v[k] == vs[0][k]}
    alternatifs = sorted({k for v in vs for k in v} - communs)
    alternatifs_de[p] = set(alternatifs)
    if alternatifs:
        ecartes_alt.append((p, len(vs), alternatifs[:4]))
    for cible in communs:
        c = to_id(cible)
        if c: edges[p][c] = (vs[0][cible], 'recette')
for r in json.load(open('gw2_wiki_vendor_costs_v1.json')):
    if not r['couts']: continue
    p = r['page'] if r['page'] in cc else to_id(r['titre'] or r['page'], r['page'])
    if not p: continue
    for cible,q in r['couts']:
        if cible in alternatifs_de.get(p, set()): continue
        c=to_id(cible)
        if not c: continue
        if c in edges[p]:
            if edges[p][c][0]!=q: conflits.append((p,c,edges[p][c],q))
        else: edges[p][c]=(q,'vendeur')
print('promotions ecartees:',len(promotions))
print('pages a voies alternatives:',len(ecartes_alt))
for x in ecartes_alt: print('   ',x[0],f'({x[1]} recettes) ingredients non communs:',x[2])
for x in promotions: print('   ',x[0],'<-',x[2],f"(sortie {x[1]})")
print('parents chiffres:',len(edges),'| conflits recette/vendeur:',len(conflits))
for x in conflits: print('   ',x)
print('ambiguites restantes:',sorted(AMBIG))
json.dump({f'{p}|{c}':v for p,dd in edges.items() for c,v in dd.items()}, open('/tmp/edges2.json','w'))
