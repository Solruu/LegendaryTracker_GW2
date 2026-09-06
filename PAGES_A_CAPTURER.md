# Pages wiki à capturer

État au 05/09/2026, sur `gw2_sources_v223.json`. Recalculé depuis les sources à chaque passe. `●` = capture au dépôt mais insuffisante ; `○` = jamais capturée.


## 1 — 34 tables « Full material list » qui débloqueraient le dépliage

C'est devenu la priorité. Six composants concentrent 311 coûts en dur — trèfle mystique, pièce mystique, éclat de sang, don de bataille, éclat d'obsidienne, ectoplasme — et pour la quasi-totalité de ces clés **l'arbre ne contribue rien** : il n'existe aucun chemin modélisé entre le composant et le légendaire. Ce ne sont ni une méthode ni un arbitrage qui manquent, ce sont les recettes des dons intermédiaires. Une seule table en fournit souvent plusieurs.

| | page wiki | clés débloquées |
|---|---|---|
| ○ | `Ad Infinitum` | 6 — `bloodstone_shard`, `gift_of_battle`, `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `The Ascension` | 6 — `bloodstone_shard`, `gift_of_battle`, `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ● | `The Predator` | 6 — `bloodstone_shard`, `gift_of_battle`, `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Selachimorpha` | 5 — `bloodstone_shard`, `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Aetheric Anchor (→ Ancora Pax + Ancora Bellum)` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Aurora` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Coalescence` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Conflux` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Orrax Manifested` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Stella Radians` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Strife Unending` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Vision` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `Warbringer` | 4 — `glob_of_ectoplasm`, `mystic_clover`, `mystic_coin`, `obsidian_shard` |
| ○ | `gen2_caladbolg` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen2_elegy` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen2_eordas_grip` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen2_hope_scepter` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen2_itzels_boon` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen2_lorekeeper` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen2_reaver_of_the_mists` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen2_tigris` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen3_aurenes_fang` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen3_aurenes_guard` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen3_aurenes_reckoning` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen3_aurenes_tenderness` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `gen3_aurenes_wrath` | 4 — `bloodstone_shard`, `gift_of_battle`, `mystic_clover`, `mystic_coin` |
| ○ | `Endless Summer` | 3 — `glob_of_ectoplasm`, `mystic_clover`, `obsidian_shard` |
| ○ | `Obsidian Armor` | 3 — `glob_of_ectoplasm`, `mystic_clover`, `obsidian_shard` |
| ○ | `upgrades` | 3 — `glob_of_ectoplasm`, `mystic_clover`, `obsidian_shard` |
| ○ | `Perfected Envoy Armor` | 2 — `mystic_clover`, `obsidian_shard` |
| ○ | `Ardent Glorious Armor` | 1 — `mystic_clover` |
| ○ | `Eikasia, Mists-Grasper` | 1 — `glob_of_ectoplasm` |
| ○ | `Legendary Upgrades` | 1 — `mystic_clover` |
| ○ | `Triumphant Hero's Armor` | 1 — `mystic_clover` |

## 2 — Deux recettes sans source rejouable

| | page wiki | pourquoi |
|---|---|---|
| ○ | `Gift of Condensed Might` | Sa recette — 1 de chaque don de trophée — n'est dans aucune des 448 captures, vérifié contre `INDEX_CONTENU.json`. Elle vient d'une capture d'écran. |
| ○ | `Gift of Condensed Magic` | Même chose, et sa quantité est déduite de son jumeau plutôt que lue. |

## 3 — 33 collections incomplètes

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

## 4 — 105 composants sans identifiant ni page

Quantité juste, identité non : le besoin s'affiche, la colonne « possédé » reste vide.


### 65 dons d'arme et sous-dons

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
| `Gift of Embracing Refuge` |
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
| `Gift of Recollector of Memories` |
| `Gift of Rodgort` |
| `Gift of Scales` |
| `Gift of Sharpened Tip` |
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

### 40 autres

| page wiki |
|---|
| `Airship Part` |
| `Ars Goetia` |
| `Banner Pennon` |
| `Banner of the Commander` |
| `Case of Captured Lightning` |
| `Certificate of Support` |
| `Clot of Congealed Screams` |
| `Deldrimor Steel Ingot` |
| `Deldrimor Steel Spear Head` |
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
| `Large Spiritwood Haft` |
| `Legendary Shards (Gen2)` |
| `Legendary Shards (Gen3 / Aurene)` |
| `Ley Line Crystal` |
| `Lump of Aurillium` |
| `Mystic Essence of Animosity` |
| `Mystic Essence of Annihilation` |
| `Mystic Essence of Carnage` |
| `Mystic Essence of Strategy` |
| `Olmakhan Bandolier (chaîne)` |
| `Perfect Mist Core` |
| `Pouch of Stardust` |
| `Shark Statue` |
| `Spinal Blade Back Pack (Perfected)` |
| `Spiritwood Plank` |
| `Standing Stones Timepiece` |
| `Unicorn Statue` |
| `Valkyrie Bearkin War Helm` |
| `Vial of Liquid Flame` |
| `Vial of Quicksilver` |
| `Wolf Statue` |

## 5 — 29 arêtes non chiffrées : aucune capture requise

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

Les 24 armes à collections sont documentées, 1 978 étapes sur 1 978. Les 28 armes sans collection relèvent de `BACKLOG.md`. Les précurseurs, fiches `Recipe:`, poèmes, tributs et cachets supérieurs sont portés par `collections{}` : les verser dans l'arbre créerait un double comptage.
