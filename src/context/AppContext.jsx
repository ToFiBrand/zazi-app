import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { relativeTime } from '../lib/time'
import { PILLARS, pillarById } from '../data/pillars'
import { useAuth } from './AuthContext'

const AppContext = createContext(null)

const CONTRIBUTION_AUTHOR_SELECT = '*, author:profiles!contributions_contributor_id_fkey(first_name, last_name, avatar_id, school:schools(name))'

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
    resource: { name: row.resource_name, type: row.resource_type, content: row.resource_content },
    activity: row.activity,
    discussion: row.discussion_question,
    sponsor: row.sponsor,
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
      ])
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [profile?.id, refreshLessons, refreshTopics, refreshQuizQuestions, refreshContributions, refreshProgress, refreshNotifications])

  useEffect(() => {
    if (!profile?.school_id) { setSchool(null); return }
    supabase.from('schools').select('*').eq('id', profile.school_id).single()
      .then(({ data }) => setSchool(data))
  }, [profile?.school_id])

  const user = useMemo(() => {
    if (!profile) return null
    return {
      firstName: profile.first_name,
      lastName: profile.last_name,
      grade: profile.grade,
      schoolId: profile.school_id,
      avatarId: profile.avatar_id,
      bio: profile.bio || '',
      points: profile.points,
      interests: profile.interests || [],
      role: profile.role,
      subjects: profile.subjects || [],
      teachingGrades: profile.teaching_grades || [],
      verificationStatus: profile.contributor_status,
    }
  }, [profile])

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
    setProgress(prev => {
      if (prev[lessonId]?.started) return prev
      return { ...prev, [lessonId]: { ...prev[lessonId], started: true, completed: prev[lessonId]?.completed || false, startedDate: nowIso } }
    })
    await supabase.from('lesson_progress')
      .upsert({ student_id: profile.id, lesson_id: lessonId, started: true, started_at: nowIso }, { onConflict: 'student_id,lesson_id' })
  }, [profile])

  const completeLesson = useCallback(async (lessonId) => {
    if (!profile) return
    const nowIso = new Date().toISOString()
    setProgress(prev => ({ ...prev, [lessonId]: { ...prev[lessonId], started: true, completed: true, completionDate: nowIso } }))
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, completions: l.completions + 1 } : l))
    await supabase.from('lesson_progress')
      .upsert({ student_id: profile.id, lesson_id: lessonId, started: true, completed: true, completed_at: nowIso }, { onConflict: 'student_id,lesson_id' })
    refreshNotifications(profile.id)
  }, [profile, refreshNotifications])

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
      status: 'submitted',
    }).select(CONTRIBUTION_AUTHOR_SELECT).single()
    if (error) { console.error('submitContribution failed:', error.message); return null }
    const item = mapContribution(data)
    setContributions(prev => [item, ...prev])
    return item
  }, [profile])

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
      activity: draft.activity,
      discussion_question: draft.discussion,
      duration_minutes: draft.duration,
      contributor_id: profile.id,
      contributor_name: `${profile.first_name} ${profile.last_name}`.trim(),
      contributor_role: draft.contributorRole || 'Contributor',
      avatar_id: profile.avatar_id,
      color: draft.color,
      status: 'pending',
    }).select().single()
    if (error) { console.error('addLesson failed:', error.message); return null }
    const lesson = mapLesson(data)
    setLessons(prev => [lesson, ...prev])
    return lesson
  }, [profile])

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

  const stats = useMemo(() => {
    if (!profile) return { lessonsCompleted: 0, creations: 0, challengesCompleted: 0 }
    const completedIds = Object.keys(progress).filter(id => progress[id].completed)
    const myContributions = contributions.filter(c => c.contributorId === profile.id)
    return {
      lessonsCompleted: completedIds.length,
      creations: myContributions.length,
      challengesCompleted: myContributions.filter(c => c.type === 'challenge_submission' && c.status !== 'rejected').length,
    }
  }, [progress, contributions, profile])

  const pillarProgress = useMemo(() => {
    const grade = user?.grade
    return PILLARS.map(p => {
      const pillarLessons = lessons.filter(l => l.pillar === p.id && l.status === 'published' && grade >= l.gradeMin && grade <= l.gradeMax)
      const completed = pillarLessons.filter(l => progress[l.id]?.completed).length
      const pct = pillarLessons.length ? Math.round((completed / pillarLessons.length) * 100) : 0
      return { ...p, total: pillarLessons.length, completed, pct }
    })
  }, [lessons, progress, user])

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
    lessons, publishedLessons, pendingLessons, addLesson, decideLesson,
    topics, addTopic, quizQuestions,
    progress, startLesson, completeLesson, lessonProgressPct,
    continueLesson, recommendedLessons,
    contributions, publishedContributions, pendingContributions,
    studentContributions, teacherContributions,
    submitContribution, decideContribution, setContributionFeatured,
    notifications,
    stats, pillarProgress,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
