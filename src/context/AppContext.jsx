import { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { LESSONS } from '../data/lessons'
import { STUDENT_CONTENT } from '../data/content'
import { PILLARS } from '../data/pillars'
import { SCHOOLS } from '../data/schools'

const AppContext = createContext(null)

const STORAGE_KEY = 'zazi_state_v1'

const INITIAL_USER = {
  firstName: 'Thabo',
  lastName: 'Mthembu',
  grade: 10,
  schoolId: 'soweto-high',
  province: 'Gauteng',
  bio: 'Future software developer. Learning something new every week 🚀',
  avatar: '👨🏾‍💻',
  points: 240,
}

const INITIAL_NOTIFICATIONS = [
  { id: 'n-0', type: 'challenge', title: 'New challenge is live', body: 'Create a 60-second video explaining your dream career.', time: '1d ago', read: false },
]

const seedLessons = () =>
  LESSONS.map(l => ({ ...l, status: 'published', views: Math.floor(400 + Math.random() * 4000), completions: Math.floor(50 + Math.random() * 900) }))

// Persist the mutable slices of app state to localStorage so a page refresh
// on the deployed demo doesn't wipe out progress, submissions, and moderation
// decisions. Falls back to fresh seed data if nothing is stored yet, or if
// storage is unavailable/corrupted (e.g. private browsing).
function loadPersisted() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persisted = loadPersisted()

export function AppProvider({ children }) {
  const [user, setUser] = useState(persisted?.user ?? INITIAL_USER)
  const [lessons, setLessons] = useState(persisted?.lessons ?? seedLessons)
  const [progress, setProgress] = useState(persisted?.progress ?? {}) // { [lessonId]: { started, completed, startedDate, completionDate } }
  const [content, setContent] = useState(persisted?.content ?? STUDENT_CONTENT)
  const [notifications, setNotifications] = useState(persisted?.notifications ?? INITIAL_NOTIFICATIONS)
  const [moderationLog, setModerationLog] = useState(persisted?.moderationLog ?? [])

  const isFirstRender = useRef(true)
  useEffect(() => {
    // Skip the very first effect run — nothing has changed yet, no need to write.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, lessons, progress, content, notifications, moderationLog }))
    } catch {
      // Storage unavailable (quota, private mode) — state just won't survive a refresh.
    }
  }, [user, lessons, progress, content, notifications, moderationLog])

  const school = useMemo(() => SCHOOLS.find(s => s.id === user.schoolId), [user.schoolId])

  const pushNotification = useCallback((n) => {
    setNotifications(prev => [{ id: `n-${Date.now()}`, time: 'Just now', read: false, ...n }, ...prev])
  }, [])

  const updateProfile = useCallback((patch) => {
    setUser(prev => ({ ...prev, ...patch }))
  }, [])

  const startLesson = useCallback((lessonId) => {
    setProgress(prev => {
      if (prev[lessonId]?.started) return prev
      return { ...prev, [lessonId]: { started: true, completed: false, startedDate: new Date().toISOString() } }
    })
  }, [])

  const completeLesson = useCallback((lessonId) => {
    setProgress(prev => {
      if (prev[lessonId]?.completed) return prev
      return {
        ...prev,
        [lessonId]: { ...prev[lessonId], started: true, completed: true, completionDate: new Date().toISOString() },
      }
    })
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, completions: l.completions + 1 } : l))
    const lesson = lessons.find(l => l.id === lessonId)
    if (lesson) {
      pushNotification({ type: 'completion', title: 'Lesson complete! 🎉', body: `You finished "${lesson.title}".` })
    }
  }, [lessons, pushNotification])

  const submitContent = useCallback((draft) => {
    const item = {
      id: `c-${Date.now()}`,
      status: 'pending',
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      author: `${user.firstName} ${user.lastName[0]}.`,
      school: school?.name || '',
      ...draft,
    }
    setContent(prev => [item, ...prev])
    return item
  }, [user, school])

  const decideContent = useCallback((id, decision, note = '') => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: decision, moderationNote: note } : c))
    setModerationLog(prev => [{ id: `m-${Date.now()}`, contentId: id, decision, note, timestamp: new Date().toISOString() }, ...prev])
    const item = content.find(c => c.id === id)
    if (item) {
      pushNotification({
        type: decision === 'approved' ? 'approved' : 'rejected',
        title: decision === 'approved' ? 'Submission approved ✅' : 'Submission needs changes',
        body: decision === 'approved'
          ? `"${item.title}" is now live on Explore.`
          : `"${item.title}" wasn't approved. ${note || 'Check moderation notes.'}`,
      })
    }
  }, [content, pushNotification])

  const addLesson = useCallback((draft) => {
    const lesson = {
      id: `l-${Date.now()}`,
      status: 'pending',
      views: 0,
      completions: 0,
      ...draft,
    }
    setLessons(prev => [lesson, ...prev])
    return lesson
  }, [])

  const decideLesson = useCallback((id, decision) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, status: decision } : l))
    setModerationLog(prev => [{ id: `m-${Date.now()}`, lessonId: id, decision, timestamp: new Date().toISOString() }, ...prev])
    const lesson = lessons.find(l => l.id === id)
    if (lesson) {
      pushNotification({
        type: decision === 'published' ? 'lesson-approved' : 'lesson-rejected',
        title: decision === 'published' ? 'Your lesson was approved 🎉' : 'Lesson needs revisions',
        body: `"${lesson.title}" ${decision === 'published' ? 'is now published to learners.' : 'was sent back for changes.'}`,
      })
    }
  }, [lessons, pushNotification])

  const stats = useMemo(() => {
    const completedIds = Object.keys(progress).filter(id => progress[id].completed)
    const myContent = content.filter(c => c.author === `${user.firstName} ${user.lastName[0]}.`)
    return {
      lessonsCompleted: completedIds.length,
      creations: myContent.length,
      challengesCompleted: myContent.filter(c => c.type === 'challenge' && c.status !== 'rejected').length,
    }
  }, [progress, content, user])

  const pillarProgress = useMemo(() => {
    return PILLARS.map(p => {
      const pillarLessons = lessons.filter(l => l.pillar === p.id && l.status === 'published' && user.grade >= l.gradeMin && user.grade <= l.gradeMax)
      const completed = pillarLessons.filter(l => progress[l.id]?.completed).length
      const pct = pillarLessons.length ? Math.round((completed / pillarLessons.length) * 100) : 0
      return { ...p, total: pillarLessons.length, completed, pct }
    })
  }, [lessons, progress, user.grade])

  const publishedLessons = useMemo(() => lessons.filter(l => l.status === 'published'), [lessons])
  const pendingLessons = useMemo(() => lessons.filter(l => l.status === 'pending'), [lessons])
  const approvedContent = useMemo(() => content.filter(c => c.status === 'approved'), [content])
  const pendingContent = useMemo(() => content.filter(c => c.status === 'pending'), [content])

  const resetDemo = useCallback(() => {
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    setUser(INITIAL_USER)
    setLessons(seedLessons())
    setProgress({})
    setContent(STUDENT_CONTENT)
    setNotifications(INITIAL_NOTIFICATIONS)
    setModerationLog([])
  }, [])

  const value = {
    user, updateProfile, school,
    lessons, publishedLessons, pendingLessons, addLesson, decideLesson,
    progress, startLesson, completeLesson,
    content, approvedContent, pendingContent, submitContent, decideContent,
    notifications, pushNotification,
    resetDemo,
    moderationLog,
    stats, pillarProgress,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
