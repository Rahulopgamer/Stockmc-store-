/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const products: Product[] = [
  // --- LIFESTEAL PRODUCTS ---
  // RANKS
  {
    id: 'ls-rank-vip',
    name: 'VIP',
    price: 99,
    originalPrice: 149,
    desc: 'The starting rank with basic priority access and fly abilities.',
    tab: 'ranks',
    category: 'lifesteal',
    iconType: 'shield',
    features: [
      'Green [VIP] Prefix in global chat',
      'Access to /fly command in Lobby & Hub',
      '3x Exclusive Weekly Kits',
      '150 extra Claim Blocks to protect belongings',
      'Priority Queue when server gets full'
    ]
  },
  {
    id: 'ls-rank-dominion',
    name: 'DOMINION',
    price: 139,
    originalPrice: 199,
    desc: 'Unlock elemental powers, automatic feeding, and unique claim expansions.',
    tab: 'ranks',
    category: 'lifesteal',
    iconType: 'shield',
    features: [
      'Cyan [DOMINION] Deluxe Prefix',
      'Command /feed (No cooldown) in survival worlds',
      '5x Maximum Home limit (Default is 2)',
      '300 extra Claim Blocks',
      'Heart design particles on walk',
      'All VIP perks included'
    ]
  },
  {
    id: 'ls-rank-platinum',
    name: 'PLATINUM',
    price: 299,
    originalPrice: 399,
    desc: 'Heavy physical armor tier, combat healing, and premium companions.',
    tab: 'ranks',
    category: 'lifesteal',
    iconType: 'shield',
    features: [
      'Shiny Orange [PLATINUM] Animated Prefix',
      'Command /heal (60 second cooldown) in safezones',
      'Exclusive Platinum Iron Golem pet',
      '10x Home limits',
      'Keep 100% Experience points on death',
      'Access to Platinum Exclusive Kit which contains Netherite armor pieces'
    ]
  },
  {
    id: 'ls-rank-origin',
    name: 'ORIGIN',
    price: 349,
    originalPrice: 499,
    desc: 'Transcendent dimensions, inventory inspections, and economy boosters.',
    tab: 'ranks',
    category: 'lifesteal',
    iconType: 'shield',
    features: [
      'Glowing Red [ORIGIN] Gradient Prefix',
      'Command /invsee (Inspect other players live inventory)',
      '1.5x Money and Combat points multiplier booster',
      '15x Home limits',
      'All previous ranks features',
      'Origin exclusive bow with fire trail'
    ]
  },
  {
    id: 'ls-rank-titanium',
    name: 'TITANIUM',
    price: 499,
    originalPrice: 699,
    desc: 'The ultimate overlord power tier. Rule the Lifesteal arena with prestige.',
    tab: 'ranks',
    category: 'lifesteal',
    iconType: 'shield',
    isPopular: true,
    features: [
      'Rainbow Chromatic [TITANIUM] Prefix in chat',
      'Claim +10 additional hearts instantly above player max',
      'Access to /god command (Lobby only) & /fly in claim zones',
      'Server-wide notification strike with lightning sound on login',
      'Custom player title: "UNSTOPPABLE"',
      'Unlimited Homes & 1200 Claim Blocks extension'
    ]
  },

  // KEYS
  {
    id: 'ls-key-basic',
    name: 'Basic Key',
    price: 10,
    originalPrice: 15,
    desc: 'Unlocks the starter box crate with essential resource block packs.',
    tab: 'keys',
    category: 'lifesteal',
    iconType: 'key'
  },
  {
    id: 'ls-key-heroic',
    name: 'Heroic Key',
    price: 30,
    originalPrice: 45,
    desc: 'A glowing reinforced iron key with advanced survival materials inside.',
    tab: 'keys',
    category: 'lifesteal',
    iconType: 'key'
  },
  {
    id: 'ls-key-elite',
    name: 'Elite Key',
    price: 40,
    originalPrice: 60,
    desc: 'Gold-plated key containing rare diamond tool sets and protection books.',
    tab: 'keys',
    category: 'lifesteal',
    iconType: 'key'
  },
  {
    id: 'ls-key-advanced',
    name: 'Advanced Key',
    price: 59,
    originalPrice: 80,
    desc: 'Supercharged keys. High probability for ancient debris and netherite scrap.',
    tab: 'keys',
    category: 'lifesteal',
    iconType: 'key'
  },
  {
    id: 'ls-key-legendary',
    name: 'Legendary Key',
    price: 80,
    originalPrice: 120,
    desc: 'Cybernetic neon key. Guarantees top-tier God items and extra dynamic hearts.',
    tab: 'keys',
    category: 'lifesteal',
    iconType: 'key'
  },

  // COINS
  {
    id: 'ls-coins-1000',
    name: '1,000 Coins',
    price: 100,
    originalPrice: 130,
    desc: 'Small pouch of Lifesteal coins to trade for equipment with players.',
    tab: 'coins',
    category: 'lifesteal',
    iconType: 'coins'
  },
  {
    id: 'ls-coins-3000',
    name: '3,000 Coins',
    price: 150,
    originalPrice: 200,
    desc: 'Medium leather pouch filled with minted gold currency.',
    tab: 'coins',
    category: 'lifesteal',
    iconType: 'coins'
  },
  {
    id: 'ls-coins-5000',
    name: '5,000 Coins',
    price: 229,
    originalPrice: 300,
    desc: 'Large heavy sack of gold, enough to purchase robust land protections.',
    tab: 'coins',
    category: 'lifesteal',
    iconType: 'coins'
  },
  {
    id: 'ls-coins-8000',
    name: '8,000 Coins',
    price: 359,
    originalPrice: 480,
    desc: 'A gorgeous brass-reinforced chest overflowing with currency stacks.',
    tab: 'coins',
    category: 'lifesteal',
    iconType: 'coins'
  },
  {
    id: 'ls-coins-10000',
    name: '10,000 Coins',
    price: 399,
    originalPrice: 600,
    desc: 'Elite vault package. Grants astronomical wealth to finance your army.',
    tab: 'coins',
    category: 'lifesteal',
    iconType: 'coins'
  },

  // TAGS
  {
    id: 'ls-tag-warrior',
    name: '[WARRIOR] Active Tag',
    price: 49,
    originalPrice: 79,
    desc: 'Equip the glowing red warrior suffix alongside your username.',
    tab: 'tags',
    category: 'lifesteal',
    iconType: 'tag'
  },
  {
    id: 'ls-tag-god',
    name: '[GOD] Active Tag',
    price: 49,
    originalPrice: 79,
    desc: 'A high-contrast neon white divinity indicator to flash in arenas.',
    tab: 'tags',
    category: 'lifesteal',
    iconType: 'tag'
  },
  {
    id: 'ls-tag-king',
    name: '[KING] Active Tag',
    price: 49,
    originalPrice: 79,
    desc: 'A glittering golden crown text indicator so everyone honors you.',
    tab: 'tags',
    category: 'lifesteal',
    iconType: 'tag'
  },
  {
    id: 'ls-tag-immortal',
    name: '[IMMORTAL] Active Tag',
    price: 49,
    originalPrice: 79,
    desc: 'Deep cosmic purple neon styling. Shows you cannot bleed nor fade.',
    tab: 'tags',
    category: 'lifesteal',
    iconType: 'tag'
  },

  // --- SURVIVAL PRODUCTS ---
  // RANKS
  {
    id: 'sv-rank-survivor',
    name: 'SURVIVOR',
    price: 49,
    originalPrice: 79,
    desc: 'Unlock basic survival storage and kit tools to help you build.',
    tab: 'ranks',
    category: 'survival',
    iconType: 'shield',
    features: [
      'Wooden [SURVIVOR] Prefix',
      'Additional personal chest box (/pv 1)',
      'Access to daily Survivor Kit (Foods, starter iron)',
      '2x Homes limit points'
    ]
  },
  {
    id: 'sv-rank-scout',
    name: 'SCOUT',
    price: 119,
    originalPrice: 179,
    desc: 'Traverse the survival forest with swift boots and expanded trade abilities.',
    tab: 'ranks',
    category: 'survival',
    iconType: 'shield',
    features: [
      'Green [SCOUT] Custom Prefix',
      'Claim land size boosted by 500 blocks',
      'Equip leather run boots with permanent speed effect',
      'Access to auction marketplace listings max of 5 (Default 2)'
    ]
  },
  {
    id: 'sv-rank-pathfinder',
    name: 'PATHFINDER',
    price: 249,
    originalPrice: 350,
    desc: 'Discover complex items, setup automatic shops, and keep items on death panels.',
    tab: 'ranks',
    category: 'survival',
    iconType: 'shield',
    features: [
      'Sky Blue [PATHFINDER] prefix',
      'Command /condense (Quick make blocks of nuggets/gems)',
      'Configure up to 4 Player Shops to sell automatic products',
      'Keep your inventory inside Nether dimensions on death'
    ]
  },
  {
    id: 'sv-rank-explorer',
    name: 'EXPLORER',
    price: 399,
    originalPrice: 599,
    desc: 'The legendary premium survivalist rank. Unleash majestic designs.',
    tab: 'ranks',
    category: 'survival',
    iconType: 'shield',
    isPopular: true,
    features: [
      'Glow Golden [EXPLORER] Prefix in global chat',
      'Access to unlimited fly (/fly) across survival builds',
      'Create 8 complex Player chest shops',
      'Command /back to teleport back to death site',
      'Exclusive Explorer biome visual trail'
    ]
  },

  // KEYS
  {
    id: 'sv-key-rusty',
    name: 'Rusty Key',
    price: 5,
    originalPrice: 9,
    desc: 'Simple lockpick copper key containing simple tool fragments.',
    tab: 'keys',
    category: 'survival',
    iconType: 'key'
  },
  {
    id: 'sv-key-bronze',
    name: 'Bronze Key',
    price: 15,
    originalPrice: 25,
    desc: 'Solid copper keys with beautiful items and redstone engines.',
    tab: 'keys',
    category: 'survival',
    iconType: 'key'
  },
  {
    id: 'sv-key-obsidian',
    name: 'Obsidian Key',
    price: 29,
    originalPrice: 45,
    desc: 'Super heavy glowing chest key containing protective elements.',
    tab: 'keys',
    category: 'survival',
    iconType: 'key'
  },
  {
    id: 'sv-key-mythic',
    name: 'Mythic Key',
    price: 69,
    originalPrice: 99,
    desc: 'Legendary dynamic neon key containing godly build resources.',
    tab: 'keys',
    category: 'survival',
    iconType: 'key'
  },

  // COINS
  {
    id: 'sv-coins-500',
    name: '500 Gold Coins',
    price: 50,
    originalPrice: 75,
    desc: 'A hand-tied small purse to spend in the town server mall.',
    tab: 'coins',
    category: 'survival',
    iconType: 'coins'
  },
  {
    id: 'sv-coins-2000',
    name: '2,000 Gold Coins',
    price: 120,
    originalPrice: 180,
    desc: 'Robust pocket assets for buying rare decorations from builders.',
    tab: 'coins',
    category: 'survival',
    iconType: 'coins'
  },
  {
    id: 'sv-coins-5000',
    name: '5,000 Gold Coins',
    price: 200,
    originalPrice: 300,
    desc: 'Rich merchant pile to launch your town or buy beautiful spawners.',
    tab: 'coins',
    category: 'survival',
    iconType: 'coins'
  },

  // CRATES (SURVIVOR SPECIAL PLACEHOLDERS)
  {
    id: 'sv-crate-spawner',
    name: 'Spawner Crate',
    price: 80,
    originalPrice: 120,
    desc: 'Guarantees 1 random epic mob spawner (Iron Golem, Blaze, Pig, Creeper).',
    tab: 'crates',
    category: 'survival',
    iconType: 'chest'
  },
  {
    id: 'sv-crate-enchant',
    name: 'Enchantment Crate',
    price: 99,
    originalPrice: 150,
    desc: 'Grants high level custom enchantment books (Sharpness VI, Protection V books).',
    tab: 'crates',
    category: 'survival',
    iconType: 'chest'
  },
  {
    id: 'sv-crate-resource',
    name: 'Resource Crate',
    price: 39,
    originalPrice: 60,
    desc: 'A heavy crate bundle loaded with thousands of building materials.',
    tab: 'crates',
    category: 'survival',
    iconType: 'chest'
  }
];
