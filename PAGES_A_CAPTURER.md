# Pages wiki à capturer

État au 05/09/2026, sur `gw2_sources_v217.json`. Fichier unique : il remplace `PAGES_A_CAPTURER_HORS_ARMES.md` et `PAGES_A_CAPTURER_ARBRE_CRAFT.md`, qui disaient la même chose à deux dates différentes.

`●` = une capture existe au dépôt mais elle ne suffit pas ; `○` = jamais capturée. Le titre est celui de l'article sur le wiki EN. Toutes les lignes sont recalculées depuis les sources, pas recopiées d'un état antérieur.


## 1 — Deux pages qui débloquent neuf arbitrages

Priorité haute : ce sont des chiffres affichés, pas du confort. Neuf chevauchements attendent une source pour trancher entre exigence réelle et double comptage.

| | page wiki | ce qu'elle débloque |
|---|---|---|
| ○ | `Transcendence` | Les huit trophées T5/T6 : 20 en direct + 400 par les dons condensés, ou 50 + 1 000. L'arbre gw2efficiency montre deux nœuds mais ne multiplie pas par les tributs, donc il ne tranche pas. |
| ○ | `Klobjarne Geirr` | `stabilizing_matrix` : 150 en direct + 75 par le cube. Sert de toute façon, l'arme est au backlog. |

## 2 — 33 collections incomplètes

Recalculé depuis `legendaries[].collections`. Le lot 7 en avait comblé une trentaine ; il ne reste que celles-ci.

| | page wiki | légendaire | id succès | ce qui manque |
|---|---|---|---|---|
| ● | `Incursive Investigation` | Eikasia, Mists-Grasper | 8826 | sans étapes, sans unlock |
| ○ | `Incursive Investigation: First Recursion` | Eikasia, Mists-Grasper | 8840 | sans étapes, sans unlock |
| ○ | `Incursive Investigation: Infinite Recursion` | Eikasia, Mists-Grasper | 8814 | sans étapes, sans unlock |
| ○ | `Incursive Investigation: Relic in the Mists` | Eikasia, Mists-Grasper | 8823 | sans étapes, sans unlock |
| ○ | `Incursive Investigation: Second Recursion` | Eikasia, Mists-Grasper | 8841 | sans étapes, sans unlock |
| ○ | `Incursive Investigation: Third Recursion` | Eikasia, Mists-Grasper | 8835 | sans étapes, sans unlock |
| ○ | `Incursive Investigation: Working Together` | Eikasia, Mists-Grasper | 8830 | 6 conseils non vérifiés, sans unlock |
| ○ | `Helping Hylek: Kill Krait` | Endless Summer | 9180 | sans étapes, sans unlock |
| ○ | `Shipwreck Strand Mastery` | Endless Summer | 8880 | sans étapes, sans unlock |
| ○ | `Starlit Weald Mastery` | Endless Summer | 9057 | sans étapes, sans unlock |
| ○ | `Legendary Weapon: Eternity` | Eternity | 7250 | sans unlock |
| ● | `Legendary Relics: Components` | Legendary Upgrades | 7829 | 1 conseils non vérifiés |
| ○ | `Legendary Rune Collector` | Legendary Upgrades | 7796 | sans étapes, sans unlock |
| ○ | `Legendary Sigil Collector` | Legendary Upgrades | 7788 | sans étapes, sans unlock |
| ○ | `Bava Nisos Mastery` | Orrax Manifested | 8769 | sans étapes, sans unlock |
| ○ | `Legendary Backpack and Glider: Orrax` | Orrax Manifested | 8714 | 1 conseils non vérifiés, sans unlock |
| ○ | `Mistburned Barrens Mastery` | Orrax Manifested | 8582 | sans étapes, sans unlock |
| ○ | `Return to Living World` | Prismatic Champion's Regalia | 5790 | sans étapes, sans unlock |
| ○ | `Shipwreck Strand Mastery` | Selachimorpha | 8880 | sans étapes, sans unlock |
| ○ | `Starlit Weald Mastery` | Selachimorpha | 9057 | sans étapes, sans unlock |
| ● | `Forge Guard's Armor Collection` | Stella Radians | 9330 | sans unlock |
| ● | `Glimmering Resin Weapon Collector` | Stella Radians | 9344 | sans unlock |
| ○ | `Path of the Ascension I: The Thrill of Battle` | The Ascension | 2738 | sans étapes, sans unlock |
| ○ | `Path of the Ascension II: Tapestry of Sacrifice` | The Ascension | 2752 | sans étapes, sans unlock |
| ○ | `Path of the Ascension III: Monument of Legends` | The Ascension | 2725 | sans étapes, sans unlock |
| ○ | `Path of the Ascension IV: Hymn of Glory` | The Ascension | 2715 | sans étapes, sans unlock |
| ○ | `"A Bug in the System" Mastery` | Vision | 4093 | sans étapes, sans unlock |
| ○ | `"A Star to Guide Us" Mastery` | Vision | 4359 | sans étapes, sans unlock |
| ○ | `"All or Nothing" Mastery` | Vision | 4544 | sans étapes, sans unlock |
| ○ | `"Long Live the Lich" Mastery` | Vision | 4195 | sans étapes, sans unlock |
| ○ | `"War Eternal" Mastery` | Vision | 4689 | sans étapes, sans unlock |
| ● | `Vision I: Awakening` | Vision | 4762 | 6 conseils non vérifiés, sans unlock |
| ● | `Vision II: Farsight` | Vision | 4771 | sans unlock |

## 3 — 94 composants sans identifiant ni page

Leur quantité est juste, leur identité non : sans `apiId`, le tracker affiche le besoin mais laisse la colonne « possédé » vide. Presque tous viennent des tables « Full material list » versées le 05/09.


### 62 dons d'arme et sous-dons

| page wiki |
|---|
| `Gift of Arid Mastery` |
| `Gift of Blood` |
| `Gift of Bloodstone Magic` |
| `Gift of Bolt` |
| `Gift of Bones` |
| `Gift of Claws` |
| `Gift of Color` |
| `Gift of Compassion` |
| `Gift of Competitive Dedication` |
| `Gift of Crystalline Magic` |
| `Gift of Darkness` |
| `Gift of Draconic Mastery` |
| `Gift of Dragon Magic` |
| `Gift of Dust` |
| `Gift of Entertainment` |
| `Gift of Ephemeral Magic` |
| `Gift of Family` |
| `Gift of Fangs` |
| `Gift of Fractals` |
| `Gift of Frenzy` |
| `Gift of Frostfang` |
| `Gift of Gliding` |
| `Gift of History` |
| `Gift of Howler` |
| `Gift of Ice` |
| `Gift of Incinerator` |
| `Gift of Kamohoali'i Kotaki` |
| `Gift of Kraitkin` |
| `Gift of Kudzu` |
| `Gift of Light` |
| `Gift of Lightning` |
| `Gift of Magic` |
| `Gift of Magical / Mighty Prosperity` |
| `Gift of Maguuma` |
| `Gift of Meteorlogicus` |
| `Gift of Might` |
| `Gift of Music` |
| `Gift of Nature` |
| `Gift of Quip` |
| `Gift of Rodgort` |
| `Gift of Scales` |
| `Gift of Souls` |
| `Gift of Sunrise` |
| `Gift of The Bifrost` |
| `Gift of The Dreamer` |
| `Gift of The Flameseeker Prophecies` |
| `Gift of The Juggernaut` |
| `Gift of The Minstrel` |
| `Gift of The Moot` |
| `Gift of Totems` |
| `Gift of Twilight` |
| `Gift of Venom` |
| `Gift of Warfare` |
| `Gift of Water` |
| `Gift of Weather` |
| `Gift of Wood` |
| `Gift of the Astral Ward` |
| `Gift of the Catalyst` |
| `Gift of the Cosmos` |
| `Gift of the Desolation` |
| `Gift of the Homesteader` |
| `Gift of the Raven Spirit` |

### 32 autres

| page wiki |
|---|
| `Airship Part` |
| `Ars Goetia` |
| `Banner Pennon` |
| `Banner of the Commander` |
| `Case of Captured Lightning` |
| `Clot of Congealed Screams` |
| `Discounted Shard of Janthir Syntri` |
| `Discounted Shard of Lowland Shore` |
| `Discounted Shard of Mistburned Barrens` |
| `Diviner's Orichalcum-Imbued Inscription` |
| `Dragonsblood Weapons` |
| `Eel Statue` |
| `Exquisite Serpentite Jewel` |
| `Glob of Coagulated Mists Essence` |
| `Hateful Sworl` |
| `Lacquered Banner Pole` |
| `Legendary Shards (Gen2)` |
| `Legendary Shards (Gen3 / Aurene)` |
| `Ley Line Crystal` |
| `Lump of Aurillium` |
| `Mystic Essence of Animosity` |
| `Mystic Essence of Annihilation` |
| `Mystic Essence of Carnage` |
| `Mystic Essence of Strategy` |
| `Olmakhan Bandolier (chaîne)` |
| `Pouch of Stardust` |
| `Shark Statue` |
| `Spinal Blade Back Pack (Perfected)` |
| `Unicorn Statue` |
| `Vial of Liquid Flame` |
| `Vial of Quicksilver` |
| `Wolf Statue` |

## 4 — 29 arêtes non chiffrées : aucune capture requise

La quantité est connue ou l'arête relève d'un autre chemin. Elles restent là parce que le dépliage serait partiel, parce que l'arête saute un niveau, ou parce qu'il s'agit d'une étape de collection.

| parent | composants |
|---|---|
| `Amalgamated Rift Essence` | `fine_rift_essence`, `glob_of_ectoplasm`, `masterwork_rift_essence`, `rare_rift_essence` |
| `Gift of Mastery` | `bloodstone_shard`, `gift_of_battle`, `gift_of_exploration`, `obsidian_shard` |
| `Gift of Fortune` | `glob_of_ectoplasm`, `mystic_clover` |
| `Gift of Magical / Mighty Prosperity` | `gift_of_craftsmanship`, `mystic_clover` |
| `Certificate of Heroics` | `testimony_of_heroics` |
| `Essence of Animosity` | `testimony_of_heroics` |
| `Essence of Annihilation` | `skirmish_claim_ticket` |
| `Gift of Expertise` | `obsidian_shard` |
| `Gift of Infused Gems` | `amalgamated_gemstone` |
| `Gift of Maguuma Mastery` | `crystalline_ingot` |
| `Gift of Research` | `glob_of_ectoplasm` |
| `Gift of the Dragon Empire` | `antique_summoning_stone` |
| `Gift of the Feast` | `fruits_of_the_shadow` |
| `Gift of the Mistburned Isles` | `curious_mursaat_remnant` |
| `Gift of the Rider` | `trade_contract` |
| `Mist Pearl` | `skirmish_claim_ticket` |
| `Mist-Enhanced Mithril` | `skirmish_claim_ticket` |
| `Mystic Tribute` | `mystic_coin` |
| `Spark of Sentience` | `xunlai_electrum_ingot` |
| `War Commendation` | `emblem_of_the_conqueror` |
| `Warcry` | `skirmish_claim_ticket` |

## Ce qui n'est pas ici

Les 24 armes à collections sont documentées : 1 978 étapes sur 1 978 couvertes. Une étape compte comme couverte si elle porte un conseil, ou si elle renvoie à un composant ou à une autre légendaire — les renvois sont des références, jamais des copies.

Les 28 armes **sans collection** n'ont aucune chaîne de succès à documenter ; leur suivi relève de `BACKLOG.md`.

Les précurseurs, les fiches `Recipe:`, les poèmes, les tributs et les cachets supérieurs cités par les tables du wiki ne sont pas des composants d'arbre : ils sont portés par `collections{}`, et les verser ici créerait le double comptage qu'on passe son temps à traquer.
