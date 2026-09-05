# Pages wiki à capturer — arbre de craft chiffré

État au 05/09/2026, après `gw2_sources_v216.json` (branche d'arme intégrée).


## 94 composants sans apiId et sans page

Le tracker affiche leur besoin mais ne peut pas lire le stock : sans identifiant, la colonne « possédé » reste vide. Ce sont pour l'essentiel les dons d'arme gen1 et leurs sous-dons, créés depuis les tables « Full material list » — les quantités sont justes, l'identité ne l'est pas encore.

| composant | nom |
|---|---|
| `airship_part` | Airship Part |
| `ars_goetia` | Ars Goetia |
| `banner_pennon` | Banner Pennon |
| `banner_of_the_commander` | Banner of the Commander |
| `case_of_captured_lightning` | Case of Captured Lightning |
| `clot_of_congealed_screams` | Clot of Congealed Screams |
| `discounted_shard_of_janthir_syntri` | Discounted Shard of Janthir Syntri |
| `discounted_shard_of_lowland_shore` | Discounted Shard of Lowland Shore |
| `discounted_shard_of_mistburned_barrens` | Discounted Shard of Mistburned Barrens |
| `diviners_orichalcum_imbued_inscription` | Diviner's Orichalcum-Imbued Inscription |
| `dragonsblood_weapons` | Dragonsblood Weapons |
| `eel_statue` | Eel Statue |
| `exquisite_serpentite_jewel` | Exquisite Serpentite Jewel |
| `gift_of_arid_mastery` | Gift of Arid Mastery |
| `gift_of_blood` | Gift of Blood |
| `gift_of_bloodstone_magic` | Gift of Bloodstone Magic |
| `gift_of_bolt` | Gift of Bolt |
| `gift_of_bones` | Gift of Bones |
| `gift_of_claws` | Gift of Claws |
| `gift_of_color` | Gift of Color |
| `gift_of_compassion` | Gift of Compassion |
| `gift_of_competitive_dedication` | Gift of Competitive Dedication |
| `gift_of_crystalline_magic` | Gift of Crystalline Magic |
| `gift_of_darkness` | Gift of Darkness |
| `gift_of_draconic_mastery` | Gift of Draconic Mastery |
| `gift_of_dragon_magic` | Gift of Dragon Magic |
| `gift_of_dust` | Gift of Dust |
| `gift_of_entertainment` | Gift of Entertainment |
| `gift_of_ephemeral_magic` | Gift of Ephemeral Magic |
| `gift_of_family` | Gift of Family |
| `gift_of_fangs` | Gift of Fangs |
| `gift_of_fractals` | Gift of Fractals |
| `gift_of_frenzy` | Gift of Frenzy |
| `gift_of_frostfang` | Gift of Frostfang |
| `gift_of_gliding` | Gift of Gliding |
| `gift_of_history` | Gift of History |
| `gift_of_howler` | Gift of Howler |
| `gift_of_ice` | Gift of Ice |
| `gift_of_incinerator` | Gift of Incinerator |
| `gift_of_kamohoali_i_kotaki` | Gift of Kamohoali'i Kotaki |
| `gift_of_kraitkin` | Gift of Kraitkin |
| `gift_of_kudzu` | Gift of Kudzu |
| `gift_of_light` | Gift of Light |
| `gift_of_lightning` | Gift of Lightning |
| `gift_of_magic` | Gift of Magic |
| `gift_of_prosperity` | Gift of Magical / Mighty Prosperity |
| `gift_of_maguuma` | Gift of Maguuma |
| `gift_of_meteorlogicus` | Gift of Meteorlogicus |
| `gift_of_might` | Gift of Might |
| `gift_of_music` | Gift of Music |
| `gift_of_nature` | Gift of Nature |
| `gift_of_quip` | Gift of Quip |
| `gift_of_rodgort` | Gift of Rodgort |
| `gift_of_scales` | Gift of Scales |
| `gift_of_souls` | Gift of Souls |
| `gift_of_sunrise` | Gift of Sunrise |
| `gift_of_the_bifrost` | Gift of The Bifrost |
| `gift_of_the_dreamer` | Gift of The Dreamer |
| `gift_of_the_flameseeker_prophecies` | Gift of The Flameseeker Prophecies |
| `gift_of_the_juggernaut` | Gift of The Juggernaut |
| `gift_of_the_minstrel` | Gift of The Minstrel |
| `gift_of_the_moot` | Gift of The Moot |
| `gift_of_totems` | Gift of Totems |
| `gift_of_twilight` | Gift of Twilight |
| `gift_of_venom` | Gift of Venom |
| `gift_of_warfare` | Gift of Warfare |
| `gift_of_water` | Gift of Water |
| `gift_of_weather` | Gift of Weather |
| `gift_of_wood` | Gift of Wood |
| `gift_of_the_astral_ward` | Gift of the Astral Ward |
| `gift_of_the_catalyst` | Gift of the Catalyst |
| `gift_of_the_cosmos` | Gift of the Cosmos |
| `gift_of_the_desolation` | Gift of the Desolation |
| `gift_of_the_homesteader` | Gift of the Homesteader |
| `gift_of_the_raven_spirit` | Gift of the Raven Spirit |
| `glob_of_coagulated_mists_essence` | Glob of Coagulated Mists Essence |
| `hateful_sworl` | Hateful Sworl |
| `lacquered_banner_pole` | Lacquered Banner Pole |
| `legendary_shard_gen2` | Legendary Shards (Gen2) |
| `legendary_shard_gen3` | Legendary Shards (Gen3 / Aurene) |
| `ley_line_crystal` | Ley Line Crystal |
| `lump_of_aurillium` | Lump of Aurillium |
| `mystic_essence_of_animosity` | Mystic Essence of Animosity |
| `mystic_essence_of_annihilation` | Mystic Essence of Annihilation |
| `mystic_essence_of_carnage` | Mystic Essence of Carnage |
| `mystic_essence_of_strategy` | Mystic Essence of Strategy |
| `olmakhan_bandolier_chain` | Olmakhan Bandolier (chaîne) |
| `pouch_of_stardust` | Pouch of Stardust |
| `shark_statue` | Shark Statue |
| `spinal_blade_perfected` | Spinal Blade Back Pack (Perfected) |
| `unicorn_statue` | Unicorn Statue |
| `vial_of_liquid_flame` | Vial of Liquid Flame |
| `vial_of_quicksilver` | Vial of Quicksilver |
| `wolf_statue` | Wolf Statue |

## 29 arêtes déclarées non chiffrées, sur 21 parents

Aucune ne demande de capture : quantité connue mais dépliage partiel, arête qui saute un niveau, ou étape de collection.

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