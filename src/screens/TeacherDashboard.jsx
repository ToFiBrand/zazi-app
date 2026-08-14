import { useMemo, useState, useEffect } from 'react'
import { Upload, Users, Eye, TrendingUp, Plus, Clock, ChevronDown, BadgeCheck, Pencil } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/ui'
import { PILLARS } from '../data/pillars'

const GRADES = [7, 8, 9, 10, 11, 12]

const VERIFICATION_STYLE = {
  approved: { bg: '#5F977022', text: '#3F6650', label: 'Verified Educator' },
  pending:  { bg: '#F4B84C26', text: '#8A5F14', label: 'Verification Pending' },
  rejected: { bg: '#E8603C1F', text: '#C94B2B', label: 'Not Verified' },
  none:     { bg: '#17283A14', text: '#5A6B7A', label: 'Not Verified' },
}

const STATUS_STYLE = {
  published: { bg: '#dcfce7', text: '#16a34a', label: 'Published' },
  pending:   { bg: '#fde8e8', text: '#dc2626', label: 'Under Review' },
  rejected:  { bg: '#f3f4f6', text: '#6b7280', label: 'Rejected' },
}

const emptyDraft = {
  title: '', description: '', pillar: PILLARS[0].id, topicId: '', gradeMin: 7, gradeMax: 9,
  objective: '', resourceName: '', activity: '', discussion: '', duration: 10,
}

export default function TeacherDashboard() {
  const { user, lessons, topics, school, addLesson, updateTeacherProfile } = useApp()
  const { profile } = useAuth()
  const [showUpload, setShowUpload] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileDraft, setProfileDraft] = useState({ subjects: '', teachingGrades: [], bio: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (user) setProfileDraft({ subjects: (user.subjects || []).join(', '), teachingGrades: user.teachingGrades || [], bio: user.bio || '' })
  }, [user?.subjects, user?.teachingGrades, user?.bio])

  const topicsForPillar = topics.filter(t => t.pillar === draft.pillar)

  const teacherName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : ''
  const myLessons = useMemo(() => lessons.filter(l => l.contributorId === profile?.id), [lessons, profile])
  const totalViews = myLessons.reduce((sum, l) => sum + l.views, 0)
  const avgCompletion = myLessons.length
    ? Math.round(myLessons.reduce((sum, l) => sum + (l.completions / Math.max(l.views, 1)) * 100, 0) / myLessons.length)
    : 0

  const verification = VERIFICATION_STYLE[user?.verificationStatus] || VERIFICATION_STYLE.none

  const toggleTeachingGrade = (g) =>
    setProfileDraft(d => ({ ...d, teachingGrades: d.teachingGrades.includes(g) ? d.teachingGrades.filter(x => x !== g) : [...d.teachingGrades, g].sort() }))

  const saveProfile = async () => {
    setSavingProfile(true)
    await updateTeacherProfile({
      subjects: profileDraft.subjects.split(',').map(s => s.trim()).filter(Boolean),
      teachingGrades: profileDraft.teachingGrades,
      bio: profileDraft.bio,
    })
    setSavingProfile(false)
    setEditingProfile(false)
  }

  const set = (k) => (e) => setDraft(d => ({ ...d, [k]: e.target.value }))
  const setPillar = (e) => setDraft(d => ({ ...d, pillar: e.target.value, topicId: '' }))

  const canSubmit = draft.title.trim() && draft.topicId

  const submitLesson = () => {
    if (!canSubmit) return
    const pillar = PILLARS.find(p => p.id === draft.pillar)
    addLesson({
      title: draft.title.trim(),
      description: draft.description.trim() || 'A new lesson from a Zazi contributor.',
      pillar: draft.pillar,
      topicId: draft.topicId,
      gradeMin: Number(draft.gradeMin),
      gradeMax: Number(draft.gradeMax),
      duration: Number(draft.duration) || 10,
      contributorRole: 'Tech Educator',
      color: pillar.color,
      objectives: draft.objective ? [draft.objective] : ['To be added by contributor'],
      resource: { name: draft.resourceName || 'Lesson Resource', type: 'PDF' },
      activity: draft.activity || 'Complete the reflection activity for this lesson.',
      discussion: draft.discussion || 'What was your biggest takeaway from this lesson?',
      sponsor: null,
    })
    setDraft(emptyDraft)
    setShowUpload(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-black text-zazi-navy">Welcome, {profile?.first_name}</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center justify-center gap-2 bg-zazi-orange text-white font-bold text-sm px-4 py-2.5 rounded-xl whitespace-nowrap self-start"
        >
          <Plus size={16} />
          Create Lesson
        </button>
      </div>

      {/* Educator profile */}
      <div className="bg-white rounded-2xl p-5 shadow-card mb-6">
        <div className="flex items-start gap-4">
          <Avatar avatarId={user?.avatarId} customization={user?.avatarCustomization} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-zazi-navy font-black text-base">{teacherName}</p>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: verification.bg, color: verification.text }}
              >
                <BadgeCheck size={11} />
                {verification.label}
              </span>
            </div>
            <p className="text-zazi-muted text-xs mt-0.5">{school ? school.name : 'No school on file'}</p>

            {!editingProfile ? (
              <>
                <p className="text-zazi-navy/70 text-sm mt-2">{user?.bio || 'No bio yet.'}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(user?.subjects || []).map(s => (
                    <span key={s} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-zazi-teal/10 text-zazi-teal">{s}</span>
                  ))}
                  {(user?.teachingGrades || []).length > 0 && (
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-zazi-orange/10 text-zazi-orange">
                      Grades {user.teachingGrades.join(', ')}
                    </span>
                  )}
                </div>
                <button onClick={() => setEditingProfile(true)} className="flex items-center gap-1 text-zazi-teal text-xs font-bold mt-3">
                  <Pencil size={12} /> Edit Educator Profile
                </button>
              </>
            ) : (
              <div className="mt-3 space-y-2.5">
                <input
                  value={profileDraft.subjects}
                  onChange={e => setProfileDraft(d => ({ ...d, subjects: e.target.value }))}
                  placeholder="Subjects, comma separated (e.g. Life Orientation, Economics)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                />
                <div className="flex flex-wrap gap-1.5">
                  {GRADES.map(g => (
                    <button
                      key={g}
                      onClick={() => toggleTeachingGrade(g)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${profileDraft.teachingGrades.includes(g) ? 'bg-zazi-orange text-white' : 'bg-gray-100 text-zazi-muted'}`}
                    >
                      Gr {g}
                    </button>
                  ))}
                </div>
                <textarea
                  value={profileDraft.bio}
                  onChange={e => setProfileDraft(d => ({ ...d, bio: e.target.value }))}
                  rows={2}
                  placeholder="Short bio"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={saveProfile} disabled={savingProfile} className="bg-zazi-orange text-white text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50">
                    {savingProfile ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="text-zazi-muted text-xs font-bold px-4 py-2">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Lessons Published', val: myLessons.filter(l => l.status === 'published').length, icon: Upload,     color: '#FF8A00' },
          { label: 'Lessons Pending',   val: myLessons.filter(l => l.status === 'pending').length,   icon: Clock,      color: '#0D665F' },
          { label: 'Learners Reached',  val: totalViews.toLocaleString(),                             icon: Users,      color: '#006E68' },
          { label: 'Avg. Completion',   val: `${avgCompletion}%`,                                     icon: TrendingUp, color: '#F4B84C' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-4 shadow-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: k.color + '20' }}>
              <k.icon size={18} style={{ color: k.color }} />
            </div>
            <p className="text-2xl font-black text-zazi-navy">{k.val}</p>
            <p className="text-zazi-muted text-xs mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* My Lessons */}
      <div className="bg-white rounded-2xl p-5 shadow-card mb-6">
        <h3 className="font-black text-zazi-navy text-base mb-4">My Lessons</h3>
        {myLessons.length === 0 ? (
          <p className="text-zazi-muted text-sm text-center py-6">You haven't created any lessons yet.</p>
        ) : (
          <div className="space-y-3">
            {myLessons.map(lesson => {
              const st = STATUS_STYLE[lesson.status] || STATUS_STYLE.published
              const pillar = PILLARS.find(p => p.id === lesson.pillar)
              return (
                <div key={lesson.id} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: lesson.color + '20' }}>
                        <pillar.icon size={20} style={{ color: lesson.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-zazi-navy font-bold text-sm truncate">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: lesson.color + '20', color: lesson.color }}>
                            {pillar?.short}
                          </span>
                          <span className="text-zazi-muted text-[10px]">Gr {lesson.gradeMin}-{lesson.gradeMax}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.text }}>
                            {st.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                      <Eye size={13} className="text-zazi-muted" />
                      <span className="text-zazi-navy text-xs font-semibold">{lesson.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-zazi-muted text-[10px]">Completions</span>
                        <span className="text-xs font-bold text-zazi-teal">{lesson.completions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Lesson modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-zazi-navy text-lg">Create New Lesson</h3>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-zazi-muted font-bold">×</button>
            </div>
            <div className="space-y-3">
              <input value={draft.title} onChange={set('title')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Lesson title" />
              <textarea value={draft.description} onChange={set('description')} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" placeholder="Short description..." />
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select value={draft.gradeMin} onChange={set('gradeMin')} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none">
                    {[7,8,9,10,11,12].map(g => <option key={g} value={g}>From Grade {g}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={draft.gradeMax} onChange={set('gradeMax')} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none">
                    {[7,8,9,10,11,12].map(g => <option key={g} value={g}>To Grade {g}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
                </div>
              </div>
              <div className="relative">
                <select value={draft.pillar} onChange={setPillar} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none">
                  {PILLARS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
              </div>
              <div className="relative">
                <select value={draft.topicId} onChange={set('topicId')} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none">
                  <option value="">{topicsForPillar.length ? 'Select a topic' : 'No topics yet for this pillar'}</option>
                  {topicsForPillar.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
              </div>
              {topicsForPillar.length === 0 && (
                <p className="text-zazi-muted text-xs -mt-1">Ask an admin to add a topic for this pillar first — lessons need a topic to live under.</p>
              )}
              <input value={draft.objective} onChange={set('objective')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Main learning objective" />
              <input value={draft.activity} onChange={set('activity')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Take Action activity" />
              <input value={draft.discussion} onChange={set('discussion')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Discussion question" />
              <div className="grid grid-cols-2 gap-3">
                <input value={draft.resourceName} onChange={set('resourceName')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Resource name" />
                <input value={draft.duration} onChange={set('duration')} type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Duration (min)" />
              </div>
              <div className="border-2 border-dashed border-zazi-orange/40 rounded-xl p-5 flex flex-col items-center gap-2 bg-zazi-orange/5">
                <Upload size={24} className="text-zazi-orange" />
                <p className="text-zazi-navy text-sm font-semibold">Drop video file here</p>
                <p className="text-zazi-muted text-xs">MP4, MOV up to 500MB</p>
              </div>
              <p className="text-zazi-muted text-xs">Your lesson will be submitted for review before it's published to learners.</p>
              <button
                onClick={submitLesson}
                disabled={!canSubmit}
                className="w-full bg-zazi-orange text-white font-bold py-3.5 rounded-xl disabled:opacity-40 disabled:pointer-events-none"
              >
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
