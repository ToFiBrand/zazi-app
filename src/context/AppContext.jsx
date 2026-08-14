import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { relativeTime } from '../lib/time'
import { PILLARS, pillarById } from '../data/pillars'
import { starterUnlockedIds } from '../data/avatarParts'
import { masteryLabel } from '../data/xpValues'
import { useAuth } from './AuthContext'

// Deterministic "today"/"this week" period keys — daily/weekly mission
// rotation is computed from these, no scheduler needed.
function dailyPeriodKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}
function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}
function dayOfYear(date = new Date()) {
  return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
}
function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() || 7
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - day + 1)
  return d
}

const AppContext = createContext(null)

const AVATAR_CUSTOMIZATION_SELECT = 'base_id, skin_tone, hair_id, outfit_id, accessory_id, headwear_id, headphones_id, avatar_name'

const CONTRIBUTION_AUTHOR_SELECT = `*, author:profiles!contributions_contributor_id_fkey(first_name, last_name, avatar_id, school:schools(name), avatar_customization:avatar_customizations(${AVATAR_CUSTOMIZATION_SELECT}))`

function mapAvatarCustomization(row) {
  if (!row) return null
  return {
    baseId: row.base_id,
    skinTone: row.skin_tone,
    hairId: row.hair_id,
    outfitId: row.outfit_id,
    accessoryId: row.accessory_id,
    headwearId: row.headwear_id,
    headphonesId: row.headphones_id,
    avatarName: row.avatar_name,
  }
}

// Maps InterestsScreen onboarding picks to the pillars they meaningfully
// predict interest in — not every interest has a clean match, and that's fine.
const INTEREST_TO_PILLAR = {
  career: 'career',
  tech: 'digital',
  finance: 'finance',
  biz: 'entrepreneurship',
  news: 'civic',
}

function mapTopic(row) {
  return { id: row.id, pillar: row.pillar, name: row.name, description: row.description, sortOrder: row.sort_order }
}

function mapLesson(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    pillar: row.pillar,
    topicId: row.topic_id,
    gradeMin: row.grade_min,
    gradeMax: row.grade_max,
    duration: row.duration_minutes,
    contributor: row.contributor_name,
    contributorRole: row.contributor_role,
    contributorId: row.contributor_id,
    avatarId: row.avatar_id,
    color: row.color,
    objectives: row.objectives || [],
    resource: { name: row.resource_name, type: row.resource_type, content: row.resource_content, fileUrl: row.resource_file_url },
    activity: row.activity,
    discussion: row.discussion_question,
    sponsor: row.sponsor,
    videoUrl: row.video_url,
    status: row.status,
    views: row.views,
    completions: row.completions,
    hook: row.hook,
    contentBody: row.content_body,
    keyTakeaways: row.key_takeaways || [],
    videoScript: row.video_script,
    visualNotes: row.visual_notes,
    completionCriteria: row.completion_criteria,
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
    publishedAt: row.published_at,
  }
}

function mapQuizQuestion(row) {
  return { id: row.id, lessonId: row.lesson_id, question: row.question, options: row.options || [], correctIndex: row.correct_index, sortOrder: row.sort_order }
}

function mapContribution(row) {
  const a = row.author
  const pillar = pillarById(row.pillar)
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.content_type,
    contributorRole: row.contributor_role,
    pillar: row.pillar,
    category: row.pillar,
    color: pillar?.color || '#FF8A00',
    gradeMin: row.grade_min,
    gradeMax: row.grade_max,
    status: row.status,
    views: row.view_count,
    likes: row.like_count,
    comments: row.comment_count,
    createdAt: row.created_at,
    contributorId: row.contributor_id,
    author: a ? `${a.first_name} ${(a.last_name || '')[0] || ''}.`.trim() : (row.contributor_role === 'teacher' ? 'Zazi Educator' : 'Zazi Student'),
    avatarId: a?.avatar_id || 'thabo',
    avatarCustomization: mapAvatarCustomization(a?.avatar_customization),
    school: a?.school?.name || '',
    bodyText: row.body_text,
    mediaUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url,
    audioUrl: row.audio_url,
    videoUrl: row.video_url,
    imageUrl: row.image_url,
    featured: row.featured,
    moderationNotes: row.moderation_notes,
    // teacher-only fields — null for student contributions
    subject: row.subject,
    learningObjectives: row.learning_objectives || [],
    teachingContent: row.teaching_content,
    activity: row.activity,
    knowledgeCheck: row.knowledge_check,
    resource: { name: row.resource_name, content: row.resource_content },
  }
}

export const STUDENT_CONTENT_TYPES = ['podcast', 'video', 'story', 'opinion', 'creative', 'challenge_submission', 'what_i_learned', 'idea']
export const TEACHER_CONTENT_TYPES = ['video_explainer', 'audio_lesson', 'learning_activity', 'quiz', 'worksheet', 'educational_insight', 'masterclass']

function mapNotification(row) {
  return { id: row.id, type: row.type, title: row.title, body: row.body, read: row.read, time: relativeTime(row.created_at) }
}

function mapEarnedBadge(row) {
  const b = row.badge
  return { id: row.badge_id, name: b?.name, description: b?.description, icon: b?.icon, color: b?.color, earnedAt: row.earned_at }
}

function mapMission(row) {
  return {
    id: row.id, code: row.code, title: row.title, description: row.description, pillar: row.pillar,
    cadence: row.cadence, steps: row.steps || [], xpReward: row.xp_reward,
    badgeId: row.badge_id, avatarItemId: row.avatar_item_id, active: row.active, sortOrder: row.sort_order,
  }
}

function mapUserMission(row) {
  return {
    id: row.id, missionId: row.mission_id, periodKey: row.period_key, status: row.status,
    stepProgress: row.step_progress || {}, startedAt: row.started_at, completedAt: row.completed_at,
  }
}

function mapChallenge(row) {
  return {
    id: row.id, title: row.title, description: row.description, pillar: row.pillar,
    type: row.challenge_type, difficulty: row.difficulty, xpReward: row.xp_reward,
    badgeId: row.badge_id, avatarItemId: row.avatar_item_id, active: row.active,
  }
}

function mapUserChallenge(row) {
  return { challengeId: row.challenge_id, status: row.status, startedAt: row.started_at, completedAt: row.completed_at }
}

function mapXpEvent(row) {
  return { id: row.id, amount: row.amount, reason: row.reason, sourceType: row.source_type, sourceId: row.source_id, createdAt: row.created_at }
}

export function AppProvider({ children }) {
  const { profile, refreshProfile } = useAuth()

  const [lessons, setLessons] = useState([])
  const [topics, setTopics] = useState([])
  const [quizQuestions, setQuizQuestions] = useState([])
  const [progress, setProgress] = useState({})
  const [contributions, setContributions] = useState([])
  const [notifications, setNotifications] = useState([])
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatarCustomization, setAvatarCustomization] = useState(null)
  const [earnedItemIds, setEarnedItemIds] = useState(new Set())
  const [earnedBadges, setEarnedBadges] = useState([])
  const [missions, setMissions] = useState([])
  const [userMissions, setUserMissions] = useState([])
  const [challenges, setChallenges] = useState([])
  const [userChallenges, setUserChallenges] = useState([])
  const [xpEvents, setXpEvents] = useState([])
  const [leaderboard, setLeaderboard] = useState([])

  const refreshLessons = useCallback(async () => {
    const { data, error } = await supabase.from('lessons').select('*').order('created_at', { ascending: false })
    if (!error) setLessons((data || []).map(mapLesson))
  }, [])

  const refreshTopics = useCallback(async () => {
    const { data, error } = await supabase.from('topics').select('*').order('pillar').order('sort_order')
    if (!error) setTopics((data || []).map(mapTopic))
  }, [])

  const refreshQuizQuestions = useCallback(async () => {
    const { data, error } = await supabase.from('lesson_quiz_questions').select('*').order('sort_order')
    if (!error) setQuizQuestions((data || []).map(mapQuizQuestion))
  }, [])

  const refreshContributions = useCallback(async () => {
    const { data, error } = await supabase.from('contributions').select(CONTRIBUTION_AUTHOR_SELECT).order('created_at', { ascending: false })
    if (!error) setContributions((data || []).map(mapContribution))
  }, [])

  const refreshProgress = useCallback(async (studentId) => {
    if (!studentId) { setProgress({}); return }
    const { data, error } = await supabase.from('lesson_progress').select('*').eq('student_id', studentId)
    if (error) return
    const map = {}
    for (const r of data) {
      map[r.lesson_id] = { started: r.started, completed: r.completed, startedDate: r.started_at, completionDate: r.completed_at }
    }
    setProgress(map)
  }, [])

  const refreshNotifications = useCallback(async (userId) => {
    if (!userId) { setNotifications([]); return }
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30)
    if (!error) setNotifications((data || []).map(mapNotification))
  }, [])

  const markNotificationRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    await supabase.from('notifications').update({ read: true }).eq('id', id)
  }, [])

  // Absence of a row is normal (most profiles, forever) — falls back to
  // rendering the legacy static avatar exactly as before this feature existed.
  const refreshAvatarCustomization = useCallback(async (profileId) => {
    if (!profileId) { setAvatarCustomization(null); return }
    const { data, error } = await supabase.from('avatar_customizations').select(AVATAR_CUSTOMIZATION_SELECT).eq('profile_id', profileId).maybeSingle()
    if (!error) setAvatarCustomization(mapAvatarCustomization(data))
  }, [])

  const refreshUnlockedItems = useCallback(async (profileId) => {
    const starter = starterUnlockedIds()
    if (!profileId) { setEarnedItemIds(starter); return }
    const { data, error } = await supabase.from('profile_unlocked_items').select('item_id').eq('profile_id', profileId)
    if (!error) setEarnedItemIds(new Set([...starter, ...(data || []).map(r => r.item_id)]))
  }, [])

  const refreshBadges = useCallback(async (profileId) => {
    if (!profileId) { setEarnedBadges([]); return }
    const { data, error } = await supabase.from('profile_badges').select('badge_id, earned_at, badge:badges(name, description, icon, color)').eq('profile_id', profileId).order('earned_at', { ascending: false })
    if (!error) setEarnedBadges((data || []).map(mapEarnedBadge))
  }, [])

  const refreshMissions = useCallback(async () => {
    const { data, error } = await supabase.from('missions').select('*').eq('active', true).order('sort_order')
    if (!error) setMissions((data || []).map(mapMission))
  }, [])

  const refreshUserMissions = useCallback(async (profileId) => {
    if (!profileId) { setUserMissions([]); return }
    const { data, error } = await supabase.from('user_missions').select('*').eq('profile_id', profileId)
    if (!error) setUserMissions((data || []).map(mapUserMission))
  }, [])

  const refreshChallenges = useCallback(async () => {
    const { data, error } = await supabase.from('challenges').select('*').eq('active', true).order('difficulty')
    if (!error) setChallenges((data || []).map(mapChallenge))
  }, [])

  const refreshUserChallenges = useCallback(async (profileId) => {
    if (!profileId) { setUserChallenges([]); return }
    const { data, error } = await supabase.from('user_challenges').select('*').eq('profile_id', profileId)
    if (!error) setUserChallenges((data || []).map(mapUserChallenge))
  }, [])

  // Recent slice — enough to cover "this week vs last week" (14 days) and
  // a scrollable "how I earned my XP" history.
  const refreshXpEvents = useCallback(async (profileId) => {
    if (!profileId) { setXpEvents([]); return }
    const { data, error } = await supabase.from('xp_events').select('*').eq('profile_id', profileId).order('created_at', { ascending: false }).limit(200)
    if (!error) setXpEvents((data || []).map(mapXpEvent))
  }, [])

  // Opt-in only — see profiles.leaderboard_visible. Uses a SECURITY
  // DEFINER RPC (get_school_leaderboard) rather than reading xp_events
  // directly, since xp_events RLS is self-read-only by design; the RPC
  // only ever returns profiles that opted in.
  const refreshLeaderboard = useCallback(async (schoolId) => {
    if (!schoolId) { setLeaderboard([]); return }
    const { data, error } = await supabase.rpc('get_school_leaderboard', { p_school_id: schoolId })
    if (!error) setLeaderboard((data || []).map(r => ({ profileId: r.profile_id, firstName: r.first_name, avatarId: r.avatar_id, weeklyXp: r.weekly_xp })))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      await Promise.all([
        refreshLessons(),
        refreshTopics(),
        refreshQuizQuestions(),
        refreshContributions(),
        refreshProgress(profile?.id),
        refreshNotifications(profile?.id),
        refreshAvatarCustomization(profile?.id),
        refreshUnlockedItems(profile?.id),
        refreshBadges(profile?.id),
        refreshMissions(),
        refreshUserMissions(profile?.id),
        refreshChallenges(),
        refreshUserChallenges(profile?.id),
        refreshXpEvents(profile?.id),
      ])
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [profile?.id, refreshLessons, refreshTopics, refreshQuizQuestions, refreshContributions, refreshProgress, refreshNotifications, refreshAvatarCustomization, refreshUnlockedItems, refreshBadges, refreshMissions, refreshUserMissions, refreshChallenges, refreshUserChallenges, refreshXpEvents])

  useEffect(() => {
    if (!profile?.school_id) { setSchool(null); return }
    supabase.from('schools').select('*').eq('id', profile.school_id).single()
      .then(({ data }) => setSchool(data))
  }, [profile?.school_id])

  // Only fetched when the learner has actually opted in — fully inert
  // (and no request fired) otherwise.
  useEffect(() => {
    if (profile?.leaderboard_visible && profile?.school_id) {
      refreshLeaderboard(profile.school_id)
    } else {
      setLeaderboard([])
    }
  }, [profile?.leaderboard_visible, profile?.school_id, refreshLeaderboard])

  const user = useMemo(() => {
    if (!profile) return null
    return {
      firstName: profile.first_name,
      lastName: profile.last_name,
      grade: profile.grade,
      schoolId: profile.school_id,
      avatarId: profile.avatar_id,
      avatarCustomization,
      bio: profile.bio || '',
      points: profile.points,
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      lastLearningDate: profile.last_learning_date,
      streakFreezeAvailable: profile.streak_freeze_available || 0,
      leaderboardVisible: !!profile.leaderboard_visible,
      interests: profile.interests || [],
      role: profile.role,
      subjects: profile.subjects || [],
      teachingGrades: profile.teaching_grades || [],
      verificationStatus: profile.contributor_status,
    }
  }, [profile, avatarCustomization])

  const setLeaderboardOptIn = useCallback(async (visible) => {
    if (!profile) return
    await supabase.from('profiles').update({ leaderboard_visible: visible }).eq('id', profile.id)
    await refreshProfile()
  }, [profile, refreshProfile])

  // Upsert — same shape whether this is the first "Create Your Zazi" save
  // or a later edit. Optimistic local update + refetch, matching the
  // updateInterests/updateTeacherProfile pattern above.
  // Fire-and-forget — analytics never blocks the UI action it's logging,
  // and a failed insert (e.g. offline) is silently dropped, not surfaced.
  const logEvent = useCallback((eventName, metadata = {}) => {
    if (!profile) return
    supabase.from('analytics_events').insert({ profile_id: profile.id, event_name: eventName, metadata })
      .then(({ error }) => { if (error) console.error('logEvent failed:', error.message) })
  }, [profile])

  const saveAvatarCustomization = useCallback(async (customization, avatarName) => {
    if (!profile) return { error: 'not signed in' }
    const row = {
      profile_id: profile.id,
      avatar_name: avatarName || null,
      base_id: customization.baseId,
      skin_tone: customization.skinTone,
      hair_id: customization.hairId || null,
      outfit_id: customization.outfitId || null,
      accessory_id: customization.accessoryId || null,
      headwear_id: customization.headwearId || null,
      headphones_id: customization.headphonesId || null,
    }
    const { error } = await supabase.from('avatar_customizations').upsert(row, { onConflict: 'profile_id' })
    if (error) { console.error('saveAvatarCustomization failed:', error.message); return { error } }
    setAvatarCustomization({ ...customization, avatarName: avatarName || null })
    logEvent('avatar_item_equipped', { baseId: customization.baseId })
    return { error: null }
  }, [profile, logEvent])

  const updateInterests = useCallback(async (interestIds) => {
    if (!profile) return
    await supabase.from('profiles').update({ interests: interestIds }).eq('id', profile.id)
    await refreshProfile()
  }, [profile, refreshProfile])

  // Educator profile fields — subjects taught, grades taught, bio.
  const updateTeacherProfile = useCallback(async ({ subjects, teachingGrades, bio }) => {
    if (!profile) return
    await supabase.from('profiles').update({ subjects, teaching_grades: teachingGrades, bio }).eq('id', profile.id)
    await refreshProfile()
  }, [profile, refreshProfile])

  const startLesson = useCallback(async (lessonId) => {
    if (!profile) return
    const nowIso = new Date().toISOString()
    let alreadyStarted = false
    setProgress(prev => {
      if (prev[lessonId]?.started) { alreadyStarted = true; return prev }
      return { ...prev, [lessonId]: { ...prev[lessonId], started: true, completed: prev[lessonId]?.completed || false, startedDate: nowIso } }
    })
    await supabase.from('lesson_progress')
      .upsert({ student_id: profile.id, lesson_id: lessonId, started: true, started_at: nowIso }, { onConflict: 'student_id,lesson_id' })
    if (!alreadyStarted) logEvent('lesson_started', { lessonId })
  }, [profile, logEvent])

  const completeLesson = useCallback(async (lessonId) => {
    if (!profile) return
    const nowIso = new Date().toISOString()
    setProgress(prev => ({ ...prev, [lessonId]: { ...prev[lessonId], started: true, completed: true, completionDate: nowIso } }))
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, completions: l.completions + 1 } : l))
    await supabase.from('lesson_progress')
      .upsert({ student_id: profile.id, lesson_id: lessonId, started: true, completed: true, completed_at: nowIso }, { onConflict: 'student_id,lesson_id' })
    refreshNotifications(profile.id)
    refreshXpEvents(profile.id)
    logEvent('lesson_completed', { lessonId })
  }, [profile, refreshNotifications, refreshXpEvents, logEvent])

  // The checkpoint quiz (LessonDetailScreen) is otherwise 100% client-local
  // — this is the one call that persists a result, which is what lets the
  // server award quiz XP exactly once (see notify_lesson_progress_avatar
  // in 0025_gamification_triggers.sql).
  const submitQuiz = useCallback(async (lessonId, score, total) => {
    if (!profile) return
    await supabase.from('lesson_progress')
      .upsert({ student_id: profile.id, lesson_id: lessonId, quiz_completed: true, quiz_score: score, quiz_total: total }, { onConflict: 'student_id,lesson_id' })
    refreshNotifications(profile.id)
    refreshXpEvents(profile.id)
    logEvent('quiz_completed', { lessonId, score, total })
  }, [profile, refreshNotifications, refreshXpEvents, logEvent])

  // Shared entry point for both creator types — RLS decides whether the
  // insert is actually allowed based on contributor_role + content_type,
  // so a student can't slip a teacher-shaped submission through even if
  // this function were called with the wrong role by mistake.
  const submitContribution = useCallback(async (draft) => {
    if (!profile) return null
    const isTeacher = profile.role === 'teacher'
    const { data, error } = await supabase.from('contributions').insert({
      contributor_id: profile.id,
      contributor_role: isTeacher ? 'teacher' : 'student',
      content_type: draft.type,
      title: draft.title,
      description: draft.description,
      body_text: draft.bodyText,
      pillar: draft.pillar,
      grade_min: draft.gradeMin,
      grade_max: draft.gradeMax,
      image_url: draft.imageUrl,
      video_url: draft.videoUrl,
      audio_url: draft.audioUrl,
      thumbnail_url: draft.thumbnailUrl,
      // teacher-only fields — undefined/omitted for student submissions
      subject: draft.subject,
      learning_objectives: draft.learningObjectives,
      teaching_content: draft.teachingContent,
      activity: draft.activity,
      knowledge_check: draft.knowledgeCheck,
      resource_name: draft.resource?.name,
      resource_content: draft.resource?.content,
      challenge_id: draft.challengeId || null,
      status: 'submitted',
    }).select(CONTRIBUTION_AUTHOR_SELECT).single()
    if (error) { console.error('submitContribution failed:', error.message); return null }
    const item = mapContribution(data)
    setContributions(prev => [item, ...prev])
    logEvent('contribution_created', { contributionId: item.id, type: draft.type, challengeId: draft.challengeId || null })
    return item
  }, [profile, logEvent])

  const decideContribution = useCallback(async (id, decision, notes = '') => {
    if (!profile) return
    const statusMap = { approved: 'published', rejected: 'rejected', needs_changes: 'needs_changes' }
    const nextStatus = statusMap[decision] || decision
    const { error } = await supabase.from('contributions')
      .update({ status: nextStatus, moderation_notes: notes, published_at: nextStatus === 'published' ? new Date().toISOString() : null })
      .eq('id', id)
    if (error) { console.error('decideContribution failed:', error.message); return }
    setContributions(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus, moderationNotes: notes } : c))
    await supabase.from('moderation_log').insert({ moderator_id: profile.id, content_type: 'contribution', content_id: id, decision, notes })
    // Publishing may trigger avatar XP/unlocks server-side for the
    // contributor (a different user than whoever is moderating here) — that
    // lands in *their* notifications row via the DB trigger and is picked
    // up next time their own session refreshes notifications; nothing to
    // do on the moderator's side.
  }, [profile])

  const setContributionFeatured = useCallback(async (id, featured) => {
    const { error } = await supabase.from('contributions').update({ featured }).eq('id', id)
    if (error) { console.error('setContributionFeatured failed:', error.message); return }
    setContributions(prev => prev.map(c => c.id === id ? { ...c, featured } : c))
  }, [])

  const addTopic = useCallback(async ({ pillar, name, description }) => {
    const { data, error } = await supabase.from('topics')
      .insert({ pillar, name, description, sort_order: topics.filter(t => t.pillar === pillar).length + 1 })
      .select().single()
    if (error) { console.error('addTopic failed:', error.message); return null }
    const topic = mapTopic(data)
    setTopics(prev => [...prev, topic])
    return topic
  }, [topics])

  // Admin-authored — same shape/pattern as addTopic. Missions and the
  // achievement list stay SQL-seeded only for now; challenges are the one
  // gamification content type with a minimal admin authoring UI.
  const addChallenge = useCallback(async ({ title, description, pillar, challengeType, difficulty, xpReward }) => {
    const { data, error } = await supabase.from('challenges')
      .insert({ title, description, pillar, challenge_type: challengeType, difficulty, xp_reward: xpReward })
      .select().single()
    if (error) { console.error('addChallenge failed:', error.message); return null }
    const challenge = mapChallenge(data)
    setChallenges(prev => [...prev, challenge])
    return challenge
  }, [])

  // Shared by the teacher-submission form (TeacherDashboard, always lands
  // as 'pending') and admin authoring (AdminDashboard, status is explicit
  // — 'draft' or 'published', no moderation queue since the admin IS the
  // moderator). The rich-content fields (hook/contentBody/etc., added in
  // 0017_rich_lesson_content.sql) are optional and simply omitted by the
  // teacher form, which only ever set the original stub fields.
  const addLesson = useCallback(async (draft) => {
    if (!profile) return null
    const { data, error } = await supabase.from('lessons').insert({
      title: draft.title,
      description: draft.description,
      pillar: draft.pillar,
      topic_id: draft.topicId,
      grade_min: draft.gradeMin,
      grade_max: draft.gradeMax,
      objectives: draft.objectives,
      resource_name: draft.resource?.name,
      resource_type: draft.resource?.type,
      resource_content: draft.resource?.content,
      resource_file_url: draft.resource?.fileUrl || null,
      activity: draft.activity,
      discussion_question: draft.discussion,
      duration_minutes: draft.duration,
      contributor_id: profile.id,
      contributor_name: draft.contributorName || `${profile.first_name} ${profile.last_name}`.trim(),
      contributor_role: draft.contributorRole || 'Contributor',
      avatar_id: profile.avatar_id,
      color: draft.color,
      sponsor: draft.sponsor || null,
      hook: draft.hook || null,
      content_body: draft.contentBody || null,
      key_takeaways: draft.keyTakeaways || [],
      cover_image_url: draft.coverImageUrl || null,
      video_url: draft.videoUrl || null,
      status: draft.status || 'pending',
      published_at: draft.status === 'published' ? new Date().toISOString() : null,
    }).select().single()
    if (error) { console.error('addLesson failed:', error.message); return null }
    const lesson = mapLesson(data)
    setLessons(prev => [lesson, ...prev])
    if (draft.status) {
      await supabase.from('moderation_log').insert({ moderator_id: profile.id, content_type: 'lesson', content_id: lesson.id, decision: draft.status === 'published' ? 'approved' : 'draft' })
    }
    return lesson
  }, [profile])

  // Full-field edit — decideLesson (below) only ever toggles status; this
  // is for actually changing lesson content, used by admin authoring.
  const updateLesson = useCallback(async (id, draft) => {
    if (!profile) return null
    const patch = {
      title: draft.title,
      description: draft.description,
      pillar: draft.pillar,
      topic_id: draft.topicId,
      grade_min: draft.gradeMin,
      grade_max: draft.gradeMax,
      objectives: draft.objectives,
      resource_name: draft.resource?.name,
      resource_type: draft.resource?.type,
      resource_content: draft.resource?.content,
      resource_file_url: draft.resource?.fileUrl || null,
      activity: draft.activity,
      discussion_question: draft.discussion,
      duration_minutes: draft.duration,
      color: draft.color,
      sponsor: draft.sponsor || null,
      hook: draft.hook || null,
      content_body: draft.contentBody || null,
      key_takeaways: draft.keyTakeaways || [],
      cover_image_url: draft.coverImageUrl || null,
      video_url: draft.videoUrl || null,
    }
    if (draft.status) {
      patch.status = draft.status
      patch.published_at = draft.status === 'published' ? new Date().toISOString() : null
    }
    const { data, error } = await supabase.from('lessons').update(patch).eq('id', id).select().single()
    if (error) { console.error('updateLesson failed:', error.message); return null }
    const lesson = mapLesson(data)
    setLessons(prev => prev.map(l => l.id === id ? lesson : l))
    return lesson
  }, [profile])

  const deleteLesson = useCallback(async (id) => {
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) { console.error('deleteLesson failed:', error.message); return false }
    setLessons(prev => prev.filter(l => l.id !== id))
    return true
  }, [])

  // Replace-all — quiz sets are a handful of questions, so this is
  // simpler and safer than diffing per-row edits.
  const saveLessonQuiz = useCallback(async (lessonId, questions) => {
    const { error: deleteError } = await supabase.from('lesson_quiz_questions').delete().eq('lesson_id', lessonId)
    if (deleteError) { console.error('saveLessonQuiz (clear) failed:', deleteError.message); return false }
    if (questions.length === 0) { setQuizQuestions(prev => prev.filter(q => q.lessonId !== lessonId)); return true }
    const rows = questions.map((q, i) => ({
      lesson_id: lessonId, question: q.question, options: q.options, correct_index: q.correctIndex, sort_order: i,
    }))
    const { data, error } = await supabase.from('lesson_quiz_questions').insert(rows).select()
    if (error) { console.error('saveLessonQuiz (insert) failed:', error.message); return false }
    const mapped = data.map(mapQuizQuestion)
    setQuizQuestions(prev => [...prev.filter(q => q.lessonId !== lessonId), ...mapped])
    return true
  }, [])

  const decideLesson = useCallback(async (id, decision) => {
    if (!profile) return
    const { error } = await supabase.from('lessons')
      .update({ status: decision, published_at: decision === 'published' ? new Date().toISOString() : null })
      .eq('id', id)
    if (error) { console.error('decideLesson failed:', error.message); return }
    setLessons(prev => prev.map(l => l.id === id ? { ...l, status: decision } : l))
    const logDecision = decision === 'published' ? 'approved' : decision
    await supabase.from('moderation_log').insert({ moderator_id: profile.id, content_type: 'lesson', content_id: id, decision: logDecision })
  }, [profile])

  // ---- Missions ----

  // Deterministic date-based selection over the active catalog — "today's
  // mission" and "this week's mission" are pure functions of the date, no
  // scheduler/cron needed. More templates in either cadence just widen
  // the rotation automatically.
  const todaysMission = useMemo(() => {
    const daily = missions.filter(m => m.cadence === 'daily')
    if (!daily.length) return null
    return daily[dayOfYear() % daily.length]
  }, [missions])

  const weeklyMission = useMemo(() => {
    const weekly = missions.filter(m => m.cadence === 'weekly')
    if (!weekly.length) return null
    return weekly[Math.floor(dayOfYear() / 7) % weekly.length]
  }, [missions])

  const myTodaysMissionProgress = useMemo(() => {
    if (!todaysMission) return null
    return userMissions.find(um => um.missionId === todaysMission.id && um.periodKey === dailyPeriodKey()) || null
  }, [userMissions, todaysMission])

  const myWeeklyMissionProgress = useMemo(() => {
    if (!weeklyMission) return null
    return userMissions.find(um => um.missionId === weeklyMission.id && um.periodKey === isoWeekKey()) || null
  }, [userMissions, weeklyMission])

  // Today's mission is single-step and pillar-themed ("explore a career
  // pathway," etc.) — rather than making the learner separately click
  // Start then Complete, it auto-completes the moment they finish any
  // lesson in that pillar today. This is the one place a daily mission's
  // user_missions row is created straight at status='completed'.
  useEffect(() => {
    if (!profile || !todaysMission || myTodaysMissionProgress?.status === 'completed') return
    const todayStr = dailyPeriodKey()
    const qualifies = Object.entries(progress).some(([lessonId, p]) => {
      if (!p.completed || !p.completionDate || p.completionDate.slice(0, 10) !== todayStr) return false
      return lessons.find(l => l.id === lessonId)?.pillar === todaysMission.pillar
    })
    if (!qualifies) return
    supabase.from('user_missions')
      .upsert(
        { profile_id: profile.id, mission_id: todaysMission.id, period_key: todayStr, status: 'completed', completed_at: new Date().toISOString() },
        { onConflict: 'profile_id,mission_id,period_key' }
      )
      .select().single()
      .then(({ data, error }) => {
        if (error) { console.error('daily mission auto-complete failed:', error.message); return }
        setUserMissions(prev => [...prev.filter(x => x.id !== data.id), mapUserMission(data)])
        refreshNotifications(profile.id)
        refreshXpEvents(profile.id)
        refreshUnlockedItems(profile.id)
        refreshBadges(profile.id)
      })
  }, [profile, todaysMission, myTodaysMissionProgress, progress, lessons, refreshNotifications, refreshXpEvents, refreshUnlockedItems, refreshBadges])

  const startMission = useCallback(async (missionId, cadence) => {
    if (!profile) return null
    const periodKey = cadence === 'weekly' ? isoWeekKey() : dailyPeriodKey()
    const { data, error } = await supabase.from('user_missions')
      .upsert({ profile_id: profile.id, mission_id: missionId, period_key: periodKey }, { onConflict: 'profile_id,mission_id,period_key' })
      .select().single()
    if (error) { console.error('startMission failed:', error.message); return null }
    const um = mapUserMission(data)
    setUserMissions(prev => [...prev.filter(x => x.id !== um.id), um])
    logEvent('mission_started', { missionId, cadence })
    return um
  }, [profile, logEvent])

  // Ticks one step of a (typically weekly, multi-step) mission's
  // self-tracked checklist; completes the mission once every step is
  // checked, which fires the DB trigger that awards XP/badge/avatar item.
  const toggleMissionStep = useCallback(async (userMissionId, stepIndex, totalSteps) => {
    const um = userMissions.find(x => x.id === userMissionId)
    if (!um) return
    const stepProgress = { ...um.stepProgress, [stepIndex]: !um.stepProgress[stepIndex] }
    const doneCount = Object.values(stepProgress).filter(Boolean).length
    const completed = doneCount >= totalSteps
    const patch = { step_progress: stepProgress, status: completed ? 'completed' : 'in_progress', completed_at: completed ? new Date().toISOString() : null }
    const { error } = await supabase.from('user_missions').update(patch).eq('id', userMissionId)
    if (error) { console.error('toggleMissionStep failed:', error.message); return }
    setUserMissions(prev => prev.map(x => x.id === userMissionId ? { ...x, stepProgress, status: patch.status } : x))
    if (completed) {
      refreshNotifications(profile.id)
      refreshXpEvents(profile.id)
      refreshUnlockedItems(profile.id)
      refreshBadges(profile.id)
      logEvent('mission_completed', { userMissionId })
    }
  }, [userMissions, profile, refreshNotifications, refreshXpEvents, refreshUnlockedItems, refreshBadges, logEvent])

  // ---- Challenges ----

  const startChallenge = useCallback(async (challengeId) => {
    if (!profile) return null
    const { data, error } = await supabase.from('user_challenges')
      .upsert({ profile_id: profile.id, challenge_id: challengeId }, { onConflict: 'profile_id,challenge_id' })
      .select().single()
    if (error) { console.error('startChallenge failed:', error.message); return null }
    const uc = mapUserChallenge(data)
    setUserChallenges(prev => [...prev.filter(x => x.challengeId !== uc.challengeId), uc])
    logEvent('challenge_started', { challengeId })
    return uc
  }, [profile, logEvent])

  // Knowledge-type challenges only — RLS enforces this server-side too
  // (see "Users can complete their own knowledge challenges" in
  // 0024_gamification_schema.sql). Practical/creator/community challenges
  // complete automatically when a linked contribution is published.
  const completeKnowledgeChallenge = useCallback(async (challengeId) => {
    if (!profile) return
    const { error } = await supabase.from('user_challenges')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('profile_id', profile.id).eq('challenge_id', challengeId)
    if (error) { console.error('completeKnowledgeChallenge failed:', error.message); return }
    setUserChallenges(prev => prev.map(x => x.challengeId === challengeId ? { ...x, status: 'completed' } : x))
    refreshNotifications(profile.id)
    refreshXpEvents(profile.id)
    refreshUnlockedItems(profile.id)
    refreshBadges(profile.id)
    logEvent('challenge_completed', { challengeId })
  }, [profile, refreshNotifications, refreshXpEvents, refreshUnlockedItems, refreshBadges, logEvent])

  const stats = useMemo(() => {
    if (!profile) return { lessonsCompleted: 0, creations: 0, challengesCompleted: 0, streakDays: 0 }
    const completedIds = Object.keys(progress).filter(id => progress[id].completed)
    const myContributions = contributions.filter(c => c.contributorId === profile.id)

    return {
      lessonsCompleted: completedIds.length,
      creations: myContributions.length,
      // Real structured challenges (user_challenges), not the legacy
      // free-text `challenge_submission` contribution count — that stays
      // available separately via `myContributions` for anything still
      // reading it.
      challengesCompleted: userChallenges.filter(uc => uc.status === 'completed').length,
      // Real, server-tracked streak (profiles.current_streak) — replaces
      // the old client-derived-from-lesson-dates approximation now that
      // touch_streak() persists it properly.
      streakDays: profile.current_streak || 0,
    }
  }, [progress, contributions, profile, userChallenges])

  const pillarProgress = useMemo(() => {
    const grade = user?.grade
    return PILLARS.map(p => {
      const pillarLessons = lessons.filter(l => l.pillar === p.id && l.status === 'published' && grade >= l.gradeMin && grade <= l.gradeMax)
      const completed = pillarLessons.filter(l => progress[l.id]?.completed).length
      const pct = pillarLessons.length ? Math.round((completed / pillarLessons.length) * 100) : 0
      return { ...p, total: pillarLessons.length, completed, pct }
    })
  }, [lessons, progress, user])

  // "Where am I growing?" — pillarProgress (lessons) blended with
  // completed structured challenges per pillar, plus a mastery label.
  const categoryMastery = useMemo(() => {
    return pillarProgress.map(p => {
      const challengesCompleted = userChallenges
        .filter(uc => uc.status === 'completed')
        .filter(uc => challenges.find(c => c.id === uc.challengeId)?.pillar === p.id)
        .length
      return { ...p, challengesCompleted, masteryLabel: masteryLabel(p.pct) }
    })
  }, [pillarProgress, userChallenges, challenges])

  // "Me vs me" — this week's activity compared to last week's, derived
  // from the XP ledger rather than a separate tracked stat.
  const weeklyProgress = useMemo(() => {
    const thisWeekStart = startOfWeek()
    const lastWeekStart = new Date(thisWeekStart); lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    const thisWeek = xpEvents.filter(e => new Date(e.createdAt) >= thisWeekStart)
    const lastWeek = xpEvents.filter(e => new Date(e.createdAt) >= lastWeekStart && new Date(e.createdAt) < thisWeekStart)
    const sum = arr => arr.reduce((s, e) => s + e.amount, 0)
    const countOf = (arr, type) => arr.filter(e => e.sourceType === type).length
    return {
      xp: { thisWeek: sum(thisWeek), lastWeek: sum(lastWeek) },
      lessons: { thisWeek: countOf(thisWeek, 'LESSON'), lastWeek: countOf(lastWeek, 'LESSON') },
      challenges: { thisWeek: countOf(thisWeek, 'CHALLENGE'), lastWeek: countOf(lastWeek, 'CHALLENGE') },
      learningDays: {
        thisWeek: new Set(thisWeek.map(e => e.createdAt.slice(0, 10))).size,
        lastWeek: new Set(lastWeek.map(e => e.createdAt.slice(0, 10))).size,
      },
    }
  }, [xpEvents])

  // Coarse but honest — reflects only what's actually persisted (started/completed),
  // not a fabricated fine-grained percentage we have no real signal for yet.
  const lessonProgressPct = useCallback((lessonId) => {
    const p = progress[lessonId]
    if (!p) return 0
    return p.completed ? 100 : p.started ? 50 : 0
  }, [progress])

  const publishedLessons = useMemo(() => lessons.filter(l => l.status === 'published'), [lessons])
  const pendingLessons = useMemo(() => lessons.filter(l => l.status === 'pending'), [lessons])
  const publishedContributions = useMemo(() => contributions.filter(c => c.status === 'published'), [contributions])
  const pendingContributions = useMemo(() => contributions.filter(c => c.status === 'submitted' || c.status === 'under_review'), [contributions])
  const studentContributions = useMemo(() => publishedContributions.filter(c => c.contributorRole === 'student'), [publishedContributions])
  const teacherContributions = useMemo(() => publishedContributions.filter(c => c.contributorRole === 'teacher'), [publishedContributions])

  // Most recently started, not-yet-completed lesson — "Pick up where you left off"
  const continueLesson = useMemo(() => {
    const inProgress = publishedLessons
      .filter(l => progress[l.id]?.started && !progress[l.id]?.completed)
      .filter(l => user && user.grade >= l.gradeMin && user.grade <= l.gradeMax)
    if (!inProgress.length) return null
    return inProgress.sort((a, b) => new Date(progress[b.id]?.startedDate || 0) - new Date(progress[a.id]?.startedDate || 0))[0]
  }, [publishedLessons, progress, user])

  // Simple, explainable rule-based ranking — not ML, but genuinely driven by
  // grade, declared interests, and what's already been completed.
  const recommendedLessons = useMemo(() => {
    if (!user) return []
    const interestPillars = new Set((user.interests || []).map(i => INTEREST_TO_PILLAR[i]).filter(Boolean))
    const completedPillars = new Set(
      publishedLessons.filter(l => progress[l.id]?.completed).map(l => l.pillar)
    )
    return publishedLessons
      .filter(l => user.grade >= l.gradeMin && user.grade <= l.gradeMax)
      .filter(l => !progress[l.id]?.completed)
      .filter(l => l.id !== continueLesson?.id)
      .map(l => {
        let score = 0
        if (interestPillars.has(l.pillar)) score += 2
        if (!completedPillars.has(l.pillar)) score += 1
        if (progress[l.id]?.started) score += 1
        return { lesson: l, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ lesson }) => lesson)
  }, [publishedLessons, progress, user, continueLesson])

  const value = {
    loading,
    user, school, refreshProfile, updateInterests, updateTeacherProfile,
    lessons, publishedLessons, pendingLessons, addLesson, updateLesson, deleteLesson, decideLesson, saveLessonQuiz,
    topics, addTopic, quizQuestions,
    progress, startLesson, completeLesson, submitQuiz, lessonProgressPct,
    continueLesson, recommendedLessons,
    contributions, publishedContributions, pendingContributions,
    studentContributions, teacherContributions,
    submitContribution, decideContribution, setContributionFeatured,
    notifications, refreshNotifications, markNotificationRead,
    stats, pillarProgress, categoryMastery, weeklyProgress,
    saveAvatarCustomization, earnedItemIds, earnedBadges,
    refreshUnlockedItems, refreshBadges,
    missions, userMissions, todaysMission, weeklyMission,
    myTodaysMissionProgress, myWeeklyMissionProgress, startMission, toggleMissionStep,
    challenges, userChallenges, startChallenge, completeKnowledgeChallenge, addChallenge,
    xpEvents, logEvent,
    leaderboard, setLeaderboardOptIn,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
