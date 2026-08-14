// Level tiers — pure function of XP (profiles.points). Computed
// client-side, same pattern as `stats`/`pillarProgress` in AppContext.jsx.
// These thresholds are mirrored in supabase/migrations/
// 0025_gamification_triggers.sql (`avatar_level_for_xp` + the inline
// level-name lookup in `award_xp`) — if you change one, change all three;
// there are only 10 tiers so this is a deliberate small duplication, not
// a shared source of truth.
export const AVATAR_LEVELS = [
  { level: 1, name: 'Explorer', minXp: 0 },
  { level: 2, name: 'Zazi Learner', minXp: 100 },
  { level: 3, name: 'Future Builder', minXp: 250 },
  { level: 4, name: 'Creator', minXp: 500 },
  { level: 5, name: 'Innovator', minXp: 850 },
  { level: 6, name: 'Problem Solver', minXp: 1300 },
  { level: 7, name: 'Entrepreneur', minXp: 1900 },
  { level: 8, name: 'Digital Pioneer', minXp: 2600 },
  { level: 9, name: 'Community Leader', minXp: 3500 },
  { level: 10, name: 'Future Shaper', minXp: 5000 },
]

export function avatarLevelForXp(xp) {
  let current = AVATAR_LEVELS[0]
  for (const tier of AVATAR_LEVELS) {
    if (xp >= tier.minXp) current = tier
  }
  return current
}

export function nextAvatarLevel(xp) {
  const current = avatarLevelForXp(xp)
  return AVATAR_LEVELS.find(t => t.level === current.level + 1) || null
}

// 0..1 progress toward the next tier (1 if already at the max tier).
export function avatarLevelProgress(xp) {
  const current = avatarLevelForXp(xp)
  const next = nextAvatarLevel(xp)
  if (!next) return 1
  return Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp))
}
