// Client-side mirror of the `avatar_items` DB table (supabase/migrations/
// 0022_avatar_system.sql). DB is the source of truth for *unlock state*;
// this file is the source of truth for *asset path / z-order / display
// order*, joined by shared `item_id` strings. Adding a new avatar part is:
// one SVG file in public/avatar-parts/<category>/, one entry below, one row
// in avatar_items — no other code changes.
//
// Bust/portrait format (matches every existing Avatar render site — see
// src/data/avatars.js), 200x200 viewBox, shared head/shoulder coordinates
// across all base characters so every part aligns regardless of combo.

export const AVATAR_CATEGORIES = ['base', 'skinTone', 'hair', 'outfit', 'accessory', 'headwear', 'headphones']

export const SKIN_TONES = [
  { id: 'tone-1', name: 'Deep', hex: '#3B2417' },
  { id: 'tone-2', name: 'Espresso', hex: '#5C3A24' },
  { id: 'tone-3', name: 'Warm Brown', hex: '#7A4B2E' },
  { id: 'tone-4', name: 'Caramel', hex: '#9C6B42' },
  { id: 'tone-5', name: 'Tan', hex: '#C08A5C' },
  { id: 'tone-6', name: 'Golden', hex: '#E0AD7D' },
]

const BASE_IDS = ['base_1', 'base_2', 'base_3', 'base_4', 'base_5']

// z-index compositing order, bottom to top.
const Z = { base: 0, outfit: 1, accessory: 2, hair: 3, headwear: 4, headphones: 5 }

// unlockType/unlockRequirement/rarity mirror supabase/migrations/
// 0022_avatar_system.sql's avatar_items seed exactly, by item_id. The DB
// row is the authoritative unlock *state* (has this profile actually
// earned it); this copy exists so the creator screen can render "Unlocks
// at Level 3" style copy for locked items without a round trip, and so
// randomize/gating logic works even before a profile has ever fetched
// its unlocked-items list.
const FREE = { unlockType: 'free', unlockRequirement: null, rarity: 'common' }

export const AVATAR_PARTS = {
  base: BASE_IDS.map((id, i) => ({ id, name: `Character ${i + 1}`, zIndex: Z.base, ...FREE })),

  hair: [
    { id: 'hair_afro', name: 'Afro', asset: '/avatar-parts/hair/hair_afro.svg', zIndex: Z.hair, ...FREE },
    { id: 'hair_fade', name: 'Fade', asset: '/avatar-parts/hair/hair_fade.svg', zIndex: Z.hair, ...FREE },
    { id: 'hair_twists', name: 'Twists', asset: '/avatar-parts/hair/hair_twists.svg', zIndex: Z.hair, ...FREE },
    { id: 'hair_braids', name: 'Long Braids', asset: '/avatar-parts/hair/hair_braids.svg', zIndex: Z.hair, ...FREE },
    { id: 'hair_cornrows', name: 'Cornrows', asset: '/avatar-parts/hair/hair_cornrows.svg', zIndex: Z.hair, ...FREE },
    { id: 'hair_puff', name: 'Curly Puff', asset: '/avatar-parts/hair/hair_puff.svg', zIndex: Z.hair, ...FREE },
  ],

  outfit: [
    { id: 'outfit_explorer', name: 'Future Explorer', asset: '/avatar-parts/outfit/outfit_explorer.svg', zIndex: Z.outfit, ...FREE },
    { id: 'outfit_creative', name: 'Creative', asset: '/avatar-parts/outfit/outfit_creative.svg', zIndex: Z.outfit, ...FREE },
    { id: 'outfit_street', name: 'Street Future', asset: '/avatar-parts/outfit/outfit_street.svg', zIndex: Z.outfit, ...FREE },
    { id: 'outfit_tech', name: 'Tech Creator', asset: '/avatar-parts/outfit/outfit_tech.svg', zIndex: Z.outfit, ...FREE },
    { id: 'outfit_founder', name: 'Future Founder', asset: '/avatar-parts/outfit/outfit_founder.svg', zIndex: Z.outfit, rarity: 'rare', unlockType: 'pillar_lesson', unlockRequirement: { pillar: 'entrepreneurship', count: 1 } },
    { id: 'outfit_creator', name: 'Creator', asset: '/avatar-parts/outfit/outfit_creator.svg', zIndex: Z.outfit, rarity: 'legendary', unlockType: 'xp_level', unlockRequirement: { level: 4 } },
  ],

  accessory: [
    { id: 'accessory_wristband', name: 'Digital Wristband', asset: '/avatar-parts/accessory/accessory_wristband.svg', zIndex: Z.accessory, ...FREE },
    { id: 'accessory_chain', name: 'Chain', asset: '/avatar-parts/accessory/accessory_chain.svg', zIndex: Z.accessory, ...FREE },
    { id: 'accessory_earpiece', name: 'Smart Earpiece', asset: '/avatar-parts/accessory/accessory_earpiece.svg', zIndex: Z.accessory, rarity: 'rare', unlockType: 'xp_level', unlockRequirement: { level: 2 } },
    { id: 'accessory_pin', name: 'Circuit Pin', asset: '/avatar-parts/accessory/accessory_pin.svg', zIndex: Z.accessory, rarity: 'rare', unlockType: 'lesson_count', unlockRequirement: { count: 5 } },
  ],

  headwear: [
    { id: 'headwear_cap', name: 'Cap', asset: '/avatar-parts/headwear/headwear_cap.svg', zIndex: Z.headwear, ...FREE },
    { id: 'headwear_beanie', name: 'Beanie', asset: '/avatar-parts/headwear/headwear_beanie.svg', zIndex: Z.headwear, ...FREE },
    { id: 'headwear_round_glasses', name: 'Round Glasses', asset: '/avatar-parts/headwear/headwear_round_glasses.svg', zIndex: Z.headwear, ...FREE },
    { id: 'headwear_smart_glasses', name: 'STEM Innovator Glasses', asset: '/avatar-parts/headwear/headwear_smart_glasses.svg', zIndex: Z.headwear, rarity: 'rare', unlockType: 'pillar_lesson', unlockRequirement: { pillar: 'digital', count: 1 } },
  ],

  headphones: [
    { id: 'headphones_classic', name: 'Classic Headphones', asset: '/avatar-parts/headphones/headphones_classic.svg', zIndex: Z.headphones, ...FREE },
    { id: 'headphones_neon', name: 'Creator Headphones', asset: '/avatar-parts/headphones/headphones_neon.svg', zIndex: Z.headphones, rarity: 'rare', unlockType: 'contribution', unlockRequirement: { count: 1 } },
    { id: 'headphones_neckband', name: 'Neckband', asset: '/avatar-parts/headphones/headphones_neckband.svg', zIndex: Z.headphones, rarity: 'rare', unlockType: 'xp_level', unlockRequirement: { level: 3 } },
  ],
}

// Human-readable "how to unlock" copy for a locked item, shown in the
// creator screen. Falls back gracefully for unlock types not yet used.
export function unlockHint(item) {
  if (!item || item.unlockType === 'free') return null
  const req = item.unlockRequirement || {}
  switch (item.unlockType) {
    case 'xp_level': return `Unlocks at Level ${req.level}`
    case 'lesson_count': return `Complete ${req.count} lessons to unlock`
    case 'pillar_lesson': return `Complete a ${req.pillar} lesson to unlock`
    case 'contribution': return `Publish ${req.count} creation${req.count > 1 ? 's' : ''} to unlock`
    case 'badge': return 'Earn a badge to unlock'
    default: return 'Locked'
  }
}

// The starter set every profile can equip immediately, before earning
// anything — every `unlockType: 'free'` item across all categories.
export function starterUnlockedIds() {
  const ids = new Set()
  for (const category of Object.values(AVATAR_PARTS)) {
    for (const item of category) {
      if (item.unlockType === 'free') ids.add(item.id)
    }
  }
  return ids
}

// Bases are recolored per skin tone at asset-generation time (see
// scripts used to produce public/avatar-parts/base/*.svg) rather than at
// render time — one file per base×tone combination, named `${baseId}_${skinToneId}.svg`.
export function baseAssetPath(baseId, skinToneId) {
  return `/avatar-parts/base/${baseId}_${skinToneId}.svg`
}

export function partById(category, id) {
  if (category === 'base') return AVATAR_PARTS.base.find(p => p.id === id)
  return (AVATAR_PARTS[category] || []).find(p => p.id === id)
}

// Optional slots a customization may legitimately omit — a valid avatar
// only requires a base + skin tone; hair/outfit/etc. can be "none".
export const OPTIONAL_CATEGORIES = ['hair', 'outfit', 'accessory', 'headwear', 'headphones']

// `unlockedIds` — Set of item_ids this learner may currently equip (starter
// free items + anything earned). Randomize only ever selects from that set,
// so "Surprise Me" can never hand back a combination the learner hasn't
// actually unlocked.
export function randomCustomization(unlockedIds) {
  const allowed = (category) => AVATAR_PARTS[category].filter(p => unlockedIds.has(p.id))
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const pickOptional = (category, chance) => {
    const pool = allowed(category)
    return pool.length && Math.random() < chance ? pick(pool).id : null
  }
  return {
    baseId: pick(allowed('base')).id,
    skinTone: pick(SKIN_TONES).id,
    hairId: pick(allowed('hair')).id,
    outfitId: pick(allowed('outfit')).id,
    accessoryId: pickOptional('accessory', 0.65),
    headwearId: pickOptional('headwear', 0.45),
    headphonesId: pickOptional('headphones', 0.4),
  }
}
