# Pages wiki à capturer

Calculé depuis `gw2_sources_v432.json` et `ressources/INDEX_CONTENU.json` par
`gw2_pages_a_capturer_v14.py`. **Ne pas éditer à la main** : régénérer.

Une page déjà au dépôt n'est jamais redemandée — l'index de contenu est
interrogé avant toute ligne. Chaque page à capturer figure une seule fois,
avec son URL, dans la section « URLs » en fin de fichier.


## 0 — 208 trous de l'arbre — LA PRIORITÉ

Ces composants ont des enfants dans la donnée, mais ni boîte Recipe ni
coût vendeur au dépôt : l'arbre sait qu'il faut les fabriquer, il ne sait
pas avec quoi. Tant qu'ils manquent, le calcul de bas en haut s'arrête là
et les totaux restent tributaires des coûts recopiés à plat.

| page wiki | composants qui en dépendent |
|---|---:|
| `Basic Elder Focus` | 2 |
| `Basic Elder Longbow` | 2 |
| `Basic Elder Short Bow` | 2 |
| `Basic Elder Staff` | 2 |
| `Basic Elder Wood Warhorn` | 2 |
| `Basic Mithril Axe` | 2 |
| `Basic Mithril Dagger` | 2 |
| `Basic Mithril Greatsword` | 2 |
| `Basic Mithril Hammer` | 2 |
| `Basic Mithril Mace` | 2 |
| `Basic Mithril Pistol` | 2 |
| `Basic Mithril Rifle` | 2 |
| `Basic Mithril Sword` | 2 |
| `Bronze Horn` | 2 |
| `Darksteel Horn` | 2 |
| `Iron Horn` | 2 |
| `Mithril Horn` | 2 |
| `Orichalcum Horn` | 2 |
| `Steel Horn` | 2 |
| `Ancient Focus Casing` | 1 |
| `Ancient Focus Core` | 1 |
| `Ancient Longbow Stave` | 1 |
| `Ancient Pistol Frame` | 1 |
| `Ancient Rifle Stock` | 1 |
| `Ancient Scepter Core` | 1 |
| `Ancient Scepter Rod` | 1 |
| `Ancient Short-Bow Stave` | 1 |
| `Ancient Staff Head` | 1 |
| `Ancient Staff Shaft` | 1 |
| `Ancient Torch Handle` | 1 |
| `Bronze Axe Blade` | 1 |
| `Bronze Dagger Blade` | 1 |
| `Bronze Dagger Hilt` | 1 |
| `Bronze Greatsword Blade` | 1 |
| `Bronze Greatsword Hilt` | 1 |
| `Bronze Hammer Head` | 1 |
| `Bronze Mace Head` | 1 |
| `Bronze Pistol Barrel` | 1 |
| `Bronze Rifle Barrel` | 1 |
| `Bronze Shield Backing` | 1 |
| `Bronze Shield Boss` | 1 |
| `Bronze Sword Blade` | 1 |
| `Bronze Sword Hilt` | 1 |
| `Bronze Torch Head` | 1 |
| `Bronze Warhorn Mouthpiece` | 1 |
| `Coarse String` | 1 |
| `Darksteel Axe Blade` | 1 |
| `Darksteel Dagger Blade` | 1 |
| `Darksteel Dagger Hilt` | 1 |
| `Darksteel Greatsword Blade` | 1 |
| `Darksteel Greatsword Hilt` | 1 |
| `Darksteel Hammer Head` | 1 |
| `Darksteel Mace Head` | 1 |
| `Darksteel Pistol Barrel` | 1 |
| `Darksteel Rifle Barrel` | 1 |
| `Darksteel Shield Backing` | 1 |
| `Darksteel Shield Boss` | 1 |
| `Darksteel Sword Blade` | 1 |
| `Darksteel Sword Hilt` | 1 |
| `Darksteel Torch Head` | 1 |
| `Darksteel Warhorn Mouthpiece` | 1 |
| `Elder Focus Casing` | 1 |
| `Elder Focus Core` | 1 |
| `Elder Longbow Stave` | 1 |
| `Elder Pistol Frame` | 1 |
| `Elder Rifle Stock` | 1 |
| `Elder Scepter Core` | 1 |
| `Elder Scepter Rod` | 1 |
| `Elder Short-Bow Stave` | 1 |
| `Elder Staff Head` | 1 |
| `Elder Staff Shaft` | 1 |
| `Elder Torch Handle` | 1 |
| `Green Focus Casing` | 1 |
| `Green Focus Core` | 1 |
| `Green Longbow Stave` | 1 |
| `Green Pistol Frame` | 1 |
| `Green Rifle Stock` | 1 |
| `Green Scepter Core` | 1 |
| `Green Scepter Rod` | 1 |
| `Green Short-Bow Stave` | 1 |
| `Green Staff Head` | 1 |
| `Green Staff Shaft` | 1 |
| `Green Torch Handle` | 1 |
| `Hard Focus Casing` | 1 |
| `Hard Focus Core` | 1 |
| `Hard Longbow Stave` | 1 |
| `Hard Pistol Frame` | 1 |
| `Hard Rifle Stock` | 1 |
| `Hard Scepter Core` | 1 |
| `Hard Scepter Rod` | 1 |
| `Hard Short-Bow Stave` | 1 |
| `Hard Staff Head` | 1 |
| `Hard Staff Shaft` | 1 |
| `Hard Torch Handle` | 1 |
| `Hardened String` | 1 |
| `Iron Axe Blade` | 1 |
| `Iron Dagger Blade` | 1 |
| `Iron Dagger Hilt` | 1 |
| `Iron Greatsword Blade` | 1 |
| `Iron Greatsword Hilt` | 1 |
| `Iron Hammer Head` | 1 |
| `Iron Mace Head` | 1 |
| `Iron Pistol Barrel` | 1 |
| `Iron Rifle Barrel` | 1 |
| `Iron Shield Backing` | 1 |
| `Iron Shield Boss` | 1 |
| `Iron Sword Blade` | 1 |
| `Iron Sword Hilt` | 1 |
| `Iron Torch Head` | 1 |
| `Iron Warhorn Mouthpiece` | 1 |
| `Large Ancient Haft` | 1 |
| `Large Elder Haft` | 1 |
| `Large Green Haft` | 1 |
| `Large Hard Haft` | 1 |
| `Large Seasoned Haft` | 1 |
| `Large Soft Haft` | 1 |
| `Mithril Axe Blade` | 1 |
| `Mithril Dagger Blade` | 1 |
| `Mithril Dagger Hilt` | 1 |
| `Mithril Greatsword Blade` | 1 |
| `Mithril Greatsword Hilt` | 1 |
| `Mithril Hammer Head` | 1 |
| `Mithril Mace Head` | 1 |
| `Mithril Pistol Barrel` | 1 |
| `Mithril Rifle Barrel` | 1 |
| `Mithril Shield Backing` | 1 |
| `Mithril Shield Boss` | 1 |
| `Mithril Sword Blade` | 1 |
| `Mithril Sword Hilt` | 1 |
| `Mithril Torch Head` | 1 |
| `Mithril Warhorn Mouthpiece` | 1 |
| `Orichalcum Axe Blade` | 1 |
| `Orichalcum Dagger Blade` | 1 |
| `Orichalcum Dagger Hilt` | 1 |
| `Orichalcum Greatsword Blade` | 1 |
| `Orichalcum Greatsword Hilt` | 1 |
| `Orichalcum Hammer Head` | 1 |
| `Orichalcum Mace Head` | 1 |
| `Orichalcum Pistol Barrel` | 1 |
| `Orichalcum Rifle Barrel` | 1 |
| `Orichalcum Shield Backing` | 1 |
| `Orichalcum Shield Boss` | 1 |
| `Orichalcum Sword Blade` | 1 |
| `Orichalcum Sword Hilt` | 1 |
| `Orichalcum Torch Head` | 1 |
| `Orichalcum Warhorn Mouthpiece` | 1 |
| `Rawhide String` | 1 |
| `Rugged String` | 1 |
| `Seasoned Focus Casing` | 1 |
| `Seasoned Focus Core` | 1 |
| `Seasoned Longbow Stave` | 1 |
| `Seasoned Pistol Frame` | 1 |
| `Seasoned Rifle Stock` | 1 |
| `Seasoned Scepter Core` | 1 |
| `Seasoned Scepter Rod` | 1 |
| `Seasoned Short-Bow Stave` | 1 |
| `Seasoned Staff Head` | 1 |
| `Seasoned Staff Shaft` | 1 |
| `Seasoned Torch Handle` | 1 |
| `Small Ancient Haft` | 1 |
| `Small Elder Haft` | 1 |
| `Small Green Haft` | 1 |
| `Small Hard Haft` | 1 |
| `Small Seasoned Haft` | 1 |
| `Small Soft Haft` | 1 |
| `Soft Focus Casing` | 1 |
| `Soft Focus Core` | 1 |
| `Soft Longbow Stave` | 1 |
| `Soft Pistol Frame` | 1 |
| `Soft Rifle Stock` | 1 |
| `Soft Scepter Core` | 1 |
| `Soft Scepter Rod` | 1 |
| `Soft Short-Bow Stave` | 1 |
| `Soft Staff Head` | 1 |
| `Soft Staff Shaft` | 1 |
| `Soft Torch Handle` | 1 |
| `Steel Axe Blade` | 1 |
| `Steel Dagger Blade` | 1 |
| `Steel Dagger Hilt` | 1 |
| `Steel Greatsword Blade` | 1 |
| `Steel Greatsword Hilt` | 1 |
| `Steel Hammer Head` | 1 |
| `Steel Mace Head` | 1 |
| `Steel Pistol Barrel` | 1 |
| `Steel Rifle Barrel` | 1 |
| `Steel Shield Backing` | 1 |
| `Steel Shield Boss` | 1 |
| `Steel Sword Blade` | 1 |
| `Steel Sword Hilt` | 1 |
| `Steel Torch Head` | 1 |
| `Steel Warhorn Mouthpiece` | 1 |
| `Thin String` | 1 |

### 0 ter — 16 trous dont la page est DÉJÀ au dépôt

Leur page existe mais ne porte ni boîte Recipe ni coût vendeur :
page de catégorie, de monnaie, ou objet non fabricable. Aucune
capture n'y changera rien — le trou se règle dans la donnée.

- `Astral Weapons`
- `Augur's Stone`
- `Bloodstone Shard`
- `Druid Runestone`
- `Fractal Journal`
- `Fractalline Spark`
- `Gift of the Desolation`
- `Gift of the Highlands`
- `Gift of the Oasis`
- `Gift of the Riverlands`
- `Hydrocatalytic Reagent`
- `Perfect Mist Core`
- `Raven Statue`
- `Spirit of the Finite Result`
- `Spirit of the Upper Bound`
- `Sun Bead`

## 1 — 0 tables « Full material list » manquantes

Ces cibles portent des coûts à plat mais leur page n'est pas capturée avec
sa table de matériaux. Sans elle, l'arbre ne peut pas se déplier : il
ignore ce que la cible contient réellement.

| page wiki | coûts à plat concernés |
|---|---:|

## 2 — 0 composants en arbitrage sans page au dépôt

Cités dans `ARBITRAGES.md`. Leur boîte Recipe et leur table vendeur
tranchent une partie des désaccords — en particulier si le vendeur propose
un **choix** ou une **liste**, ce que la capture aplatie ne dit pas.

| page wiki | désaccords portés |
|---|---:|

## 3 — 2 composants sans apiId ni page

Quantité juste, identité inconnue : le besoin s'affiche, la colonne
« possédé » reste vide faute de pouvoir interroger l'API.

| page wiki |
|---|
| `Gift of the Obscure` |
| `Memories of Aurene` |

## 3 bis — 0 composants dont le coût d'obtention est inconnu

Exigés par l'arbre, identifiés, mais sans page : on sait combien il en
faut, pas comment on les obtient.

| page wiki |
|---|

## 4 — 0 collections incomplètes — 0 introuvables au dépôt

Une collection est incomplète tant qu'elle n'a ni ses étapes ni sa chaîne
de déblocage, et qu'elle ne déclare pas leur absence avec `absences_ref`
— drapeau qui exige la capture prouvant qu'il n'y a rien à décrire.

La colonne « où le lire » nomme la capture qui porte l'information, et
comment elle s'y trouve : `bloc` pour l'ancre `#achievementNNNN`, `cité`
pour un lien vers cette ancre, `nommé` pour une page qui en parle sans
ancre. Beaucoup de ces succès sont des LIGNES d'une collection, pas des
articles : leur titre n'est pas une URL, et les chercher sur le wiki
renvoie 404. Rien ici ne part dans la section « URLs ».

| | succès | légendaire | id | ce qui manque | où le lire | comment |
|---|---|---|---:|---|---|---|

## URLs — 194 pages à capturer

```
https://wiki.guildwars2.com/wiki/Basic_Elder_Focus
https://wiki.guildwars2.com/wiki/Basic_Elder_Longbow
https://wiki.guildwars2.com/wiki/Basic_Elder_Short_Bow
https://wiki.guildwars2.com/wiki/Basic_Elder_Staff
https://wiki.guildwars2.com/wiki/Basic_Elder_Wood_Warhorn
https://wiki.guildwars2.com/wiki/Basic_Mithril_Axe
https://wiki.guildwars2.com/wiki/Basic_Mithril_Dagger
https://wiki.guildwars2.com/wiki/Basic_Mithril_Greatsword
https://wiki.guildwars2.com/wiki/Basic_Mithril_Hammer
https://wiki.guildwars2.com/wiki/Basic_Mithril_Mace
https://wiki.guildwars2.com/wiki/Basic_Mithril_Pistol
https://wiki.guildwars2.com/wiki/Basic_Mithril_Rifle
https://wiki.guildwars2.com/wiki/Basic_Mithril_Sword
https://wiki.guildwars2.com/wiki/Bronze_Horn
https://wiki.guildwars2.com/wiki/Darksteel_Horn
https://wiki.guildwars2.com/wiki/Iron_Horn
https://wiki.guildwars2.com/wiki/Mithril_Horn
https://wiki.guildwars2.com/wiki/Orichalcum_Horn
https://wiki.guildwars2.com/wiki/Steel_Horn
https://wiki.guildwars2.com/wiki/Ancient_Focus_Casing
https://wiki.guildwars2.com/wiki/Ancient_Focus_Core
https://wiki.guildwars2.com/wiki/Ancient_Longbow_Stave
https://wiki.guildwars2.com/wiki/Ancient_Pistol_Frame
https://wiki.guildwars2.com/wiki/Ancient_Rifle_Stock
https://wiki.guildwars2.com/wiki/Ancient_Scepter_Core
https://wiki.guildwars2.com/wiki/Ancient_Scepter_Rod
https://wiki.guildwars2.com/wiki/Ancient_Short-Bow_Stave
https://wiki.guildwars2.com/wiki/Ancient_Staff_Head
https://wiki.guildwars2.com/wiki/Ancient_Staff_Shaft
https://wiki.guildwars2.com/wiki/Ancient_Torch_Handle
https://wiki.guildwars2.com/wiki/Bronze_Axe_Blade
https://wiki.guildwars2.com/wiki/Bronze_Dagger_Blade
https://wiki.guildwars2.com/wiki/Bronze_Dagger_Hilt
https://wiki.guildwars2.com/wiki/Bronze_Greatsword_Blade
https://wiki.guildwars2.com/wiki/Bronze_Greatsword_Hilt
https://wiki.guildwars2.com/wiki/Bronze_Hammer_Head
https://wiki.guildwars2.com/wiki/Bronze_Mace_Head
https://wiki.guildwars2.com/wiki/Bronze_Pistol_Barrel
https://wiki.guildwars2.com/wiki/Bronze_Rifle_Barrel
https://wiki.guildwars2.com/wiki/Bronze_Shield_Backing
https://wiki.guildwars2.com/wiki/Bronze_Shield_Boss
https://wiki.guildwars2.com/wiki/Bronze_Sword_Blade
https://wiki.guildwars2.com/wiki/Bronze_Sword_Hilt
https://wiki.guildwars2.com/wiki/Bronze_Torch_Head
https://wiki.guildwars2.com/wiki/Bronze_Warhorn_Mouthpiece
https://wiki.guildwars2.com/wiki/Coarse_String
https://wiki.guildwars2.com/wiki/Darksteel_Axe_Blade
https://wiki.guildwars2.com/wiki/Darksteel_Dagger_Blade
https://wiki.guildwars2.com/wiki/Darksteel_Dagger_Hilt
https://wiki.guildwars2.com/wiki/Darksteel_Greatsword_Blade
https://wiki.guildwars2.com/wiki/Darksteel_Greatsword_Hilt
https://wiki.guildwars2.com/wiki/Darksteel_Hammer_Head
https://wiki.guildwars2.com/wiki/Darksteel_Mace_Head
https://wiki.guildwars2.com/wiki/Darksteel_Pistol_Barrel
https://wiki.guildwars2.com/wiki/Darksteel_Rifle_Barrel
https://wiki.guildwars2.com/wiki/Darksteel_Shield_Backing
https://wiki.guildwars2.com/wiki/Darksteel_Shield_Boss
https://wiki.guildwars2.com/wiki/Darksteel_Sword_Blade
https://wiki.guildwars2.com/wiki/Darksteel_Sword_Hilt
https://wiki.guildwars2.com/wiki/Darksteel_Torch_Head
https://wiki.guildwars2.com/wiki/Darksteel_Warhorn_Mouthpiece
https://wiki.guildwars2.com/wiki/Elder_Focus_Casing
https://wiki.guildwars2.com/wiki/Elder_Focus_Core
https://wiki.guildwars2.com/wiki/Elder_Longbow_Stave
https://wiki.guildwars2.com/wiki/Elder_Pistol_Frame
https://wiki.guildwars2.com/wiki/Elder_Rifle_Stock
https://wiki.guildwars2.com/wiki/Elder_Scepter_Core
https://wiki.guildwars2.com/wiki/Elder_Scepter_Rod
https://wiki.guildwars2.com/wiki/Elder_Short-Bow_Stave
https://wiki.guildwars2.com/wiki/Elder_Staff_Head
https://wiki.guildwars2.com/wiki/Elder_Staff_Shaft
https://wiki.guildwars2.com/wiki/Elder_Torch_Handle
https://wiki.guildwars2.com/wiki/Green_Focus_Casing
https://wiki.guildwars2.com/wiki/Green_Focus_Core
https://wiki.guildwars2.com/wiki/Green_Longbow_Stave
https://wiki.guildwars2.com/wiki/Green_Pistol_Frame
https://wiki.guildwars2.com/wiki/Green_Rifle_Stock
https://wiki.guildwars2.com/wiki/Green_Scepter_Core
https://wiki.guildwars2.com/wiki/Green_Scepter_Rod
https://wiki.guildwars2.com/wiki/Green_Short-Bow_Stave
https://wiki.guildwars2.com/wiki/Green_Staff_Head
https://wiki.guildwars2.com/wiki/Green_Staff_Shaft
https://wiki.guildwars2.com/wiki/Green_Torch_Handle
https://wiki.guildwars2.com/wiki/Hard_Focus_Casing
https://wiki.guildwars2.com/wiki/Hard_Focus_Core
https://wiki.guildwars2.com/wiki/Hard_Longbow_Stave
https://wiki.guildwars2.com/wiki/Hard_Pistol_Frame
https://wiki.guildwars2.com/wiki/Hard_Rifle_Stock
https://wiki.guildwars2.com/wiki/Hard_Scepter_Core
https://wiki.guildwars2.com/wiki/Hard_Scepter_Rod
https://wiki.guildwars2.com/wiki/Hard_Short-Bow_Stave
https://wiki.guildwars2.com/wiki/Hard_Staff_Head
https://wiki.guildwars2.com/wiki/Hard_Staff_Shaft
https://wiki.guildwars2.com/wiki/Hard_Torch_Handle
https://wiki.guildwars2.com/wiki/Hardened_String
https://wiki.guildwars2.com/wiki/Iron_Axe_Blade
https://wiki.guildwars2.com/wiki/Iron_Dagger_Blade
https://wiki.guildwars2.com/wiki/Iron_Dagger_Hilt
https://wiki.guildwars2.com/wiki/Iron_Greatsword_Blade
https://wiki.guildwars2.com/wiki/Iron_Greatsword_Hilt
https://wiki.guildwars2.com/wiki/Iron_Hammer_Head
https://wiki.guildwars2.com/wiki/Iron_Mace_Head
https://wiki.guildwars2.com/wiki/Iron_Pistol_Barrel
https://wiki.guildwars2.com/wiki/Iron_Rifle_Barrel
https://wiki.guildwars2.com/wiki/Iron_Shield_Backing
https://wiki.guildwars2.com/wiki/Iron_Shield_Boss
https://wiki.guildwars2.com/wiki/Iron_Sword_Blade
https://wiki.guildwars2.com/wiki/Iron_Sword_Hilt
https://wiki.guildwars2.com/wiki/Iron_Torch_Head
https://wiki.guildwars2.com/wiki/Iron_Warhorn_Mouthpiece
https://wiki.guildwars2.com/wiki/Large_Ancient_Haft
https://wiki.guildwars2.com/wiki/Large_Elder_Haft
https://wiki.guildwars2.com/wiki/Large_Green_Haft
https://wiki.guildwars2.com/wiki/Large_Hard_Haft
https://wiki.guildwars2.com/wiki/Large_Seasoned_Haft
https://wiki.guildwars2.com/wiki/Large_Soft_Haft
https://wiki.guildwars2.com/wiki/Mithril_Axe_Blade
https://wiki.guildwars2.com/wiki/Mithril_Dagger_Blade
https://wiki.guildwars2.com/wiki/Mithril_Dagger_Hilt
https://wiki.guildwars2.com/wiki/Mithril_Greatsword_Blade
https://wiki.guildwars2.com/wiki/Mithril_Greatsword_Hilt
https://wiki.guildwars2.com/wiki/Mithril_Hammer_Head
https://wiki.guildwars2.com/wiki/Mithril_Mace_Head
https://wiki.guildwars2.com/wiki/Mithril_Pistol_Barrel
https://wiki.guildwars2.com/wiki/Mithril_Rifle_Barrel
https://wiki.guildwars2.com/wiki/Mithril_Shield_Backing
https://wiki.guildwars2.com/wiki/Mithril_Shield_Boss
https://wiki.guildwars2.com/wiki/Mithril_Sword_Blade
https://wiki.guildwars2.com/wiki/Mithril_Sword_Hilt
https://wiki.guildwars2.com/wiki/Mithril_Torch_Head
https://wiki.guildwars2.com/wiki/Mithril_Warhorn_Mouthpiece
https://wiki.guildwars2.com/wiki/Orichalcum_Axe_Blade
https://wiki.guildwars2.com/wiki/Orichalcum_Dagger_Blade
https://wiki.guildwars2.com/wiki/Orichalcum_Dagger_Hilt
https://wiki.guildwars2.com/wiki/Orichalcum_Greatsword_Blade
https://wiki.guildwars2.com/wiki/Orichalcum_Greatsword_Hilt
https://wiki.guildwars2.com/wiki/Orichalcum_Hammer_Head
https://wiki.guildwars2.com/wiki/Orichalcum_Mace_Head
https://wiki.guildwars2.com/wiki/Orichalcum_Pistol_Barrel
https://wiki.guildwars2.com/wiki/Orichalcum_Rifle_Barrel
https://wiki.guildwars2.com/wiki/Orichalcum_Shield_Backing
https://wiki.guildwars2.com/wiki/Orichalcum_Shield_Boss
https://wiki.guildwars2.com/wiki/Orichalcum_Sword_Blade
https://wiki.guildwars2.com/wiki/Orichalcum_Sword_Hilt
https://wiki.guildwars2.com/wiki/Orichalcum_Torch_Head
https://wiki.guildwars2.com/wiki/Orichalcum_Warhorn_Mouthpiece
https://wiki.guildwars2.com/wiki/Rawhide_String
https://wiki.guildwars2.com/wiki/Rugged_String
https://wiki.guildwars2.com/wiki/Seasoned_Focus_Casing
https://wiki.guildwars2.com/wiki/Seasoned_Focus_Core
https://wiki.guildwars2.com/wiki/Seasoned_Longbow_Stave
https://wiki.guildwars2.com/wiki/Seasoned_Pistol_Frame
https://wiki.guildwars2.com/wiki/Seasoned_Rifle_Stock
https://wiki.guildwars2.com/wiki/Seasoned_Scepter_Core
https://wiki.guildwars2.com/wiki/Seasoned_Scepter_Rod
https://wiki.guildwars2.com/wiki/Seasoned_Short-Bow_Stave
https://wiki.guildwars2.com/wiki/Seasoned_Staff_Head
https://wiki.guildwars2.com/wiki/Seasoned_Staff_Shaft
https://wiki.guildwars2.com/wiki/Seasoned_Torch_Handle
https://wiki.guildwars2.com/wiki/Small_Ancient_Haft
https://wiki.guildwars2.com/wiki/Small_Elder_Haft
https://wiki.guildwars2.com/wiki/Small_Green_Haft
https://wiki.guildwars2.com/wiki/Small_Hard_Haft
https://wiki.guildwars2.com/wiki/Small_Seasoned_Haft
https://wiki.guildwars2.com/wiki/Small_Soft_Haft
https://wiki.guildwars2.com/wiki/Soft_Focus_Casing
https://wiki.guildwars2.com/wiki/Soft_Focus_Core
https://wiki.guildwars2.com/wiki/Soft_Longbow_Stave
https://wiki.guildwars2.com/wiki/Soft_Pistol_Frame
https://wiki.guildwars2.com/wiki/Soft_Rifle_Stock
https://wiki.guildwars2.com/wiki/Soft_Scepter_Core
https://wiki.guildwars2.com/wiki/Soft_Scepter_Rod
https://wiki.guildwars2.com/wiki/Soft_Short-Bow_Stave
https://wiki.guildwars2.com/wiki/Soft_Staff_Head
https://wiki.guildwars2.com/wiki/Soft_Staff_Shaft
https://wiki.guildwars2.com/wiki/Soft_Torch_Handle
https://wiki.guildwars2.com/wiki/Steel_Axe_Blade
https://wiki.guildwars2.com/wiki/Steel_Dagger_Blade
https://wiki.guildwars2.com/wiki/Steel_Dagger_Hilt
https://wiki.guildwars2.com/wiki/Steel_Greatsword_Blade
https://wiki.guildwars2.com/wiki/Steel_Greatsword_Hilt
https://wiki.guildwars2.com/wiki/Steel_Hammer_Head
https://wiki.guildwars2.com/wiki/Steel_Mace_Head
https://wiki.guildwars2.com/wiki/Steel_Pistol_Barrel
https://wiki.guildwars2.com/wiki/Steel_Rifle_Barrel
https://wiki.guildwars2.com/wiki/Steel_Shield_Backing
https://wiki.guildwars2.com/wiki/Steel_Shield_Boss
https://wiki.guildwars2.com/wiki/Steel_Sword_Blade
https://wiki.guildwars2.com/wiki/Steel_Sword_Hilt
https://wiki.guildwars2.com/wiki/Steel_Torch_Head
https://wiki.guildwars2.com/wiki/Steel_Warhorn_Mouthpiece
https://wiki.guildwars2.com/wiki/Thin_String
https://wiki.guildwars2.com/wiki/Gift_of_the_Obscure
https://wiki.guildwars2.com/wiki/Memories_of_Aurene
```
