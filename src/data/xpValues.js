// Display-only mirror of the XP amounts the server actually grants (see
// `award_xp()` call sites in supabase/migrations/0025_gamification_triggers.sql).
// Used for "you'll earn +X XP" previews before an action is taken — the
// SQL triggers remain the authoritative source of what's actually
// awarded, same accepted duplication pattern as the level thresholds.
export const XP_VALUES = {
  LESSON_SHORT: 20,   // lesson duration_minutes < 10
  LESSON_FULL: 40,    // lesson duration_minutes >= 10
  QUIZ: 20,
  QUIZ_BONUS: 10,     // score >= 80%
  CONTRIBUTION: 50,
  PATHWAY: 150,       // every published lesson in a topic completed
  CHALLENGE_BY_DIFFICULTY: { 1: 50, 2: 100, 3: 200 },
  STREAK_MILESTONES: { 3: 25, 7: 50, 14: 100, 30: 250 },
}

export const DIFFICULTY_LABEL = { 1: 'Level 1', 2: 'Level 2', 3: 'Level 3' }

export const MASTERY_LEVELS = [
  { label: 'Explorer', min: 0 },
  { label: 'Practitioner', min: 25 },
  { label: 'Builder', min: 50 },
  { label: 'Innovator', min: 75 },
]

export function masteryLabel(pct) {
  let current = MASTERY_LEVELS[0]
  for (const tier of MASTERY_LEVELS) {
    if (pct >= tier.min) current = tier
  }
  return current.label
}
