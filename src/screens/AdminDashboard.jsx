import { useState, useEffect } from 'react'
import { Users, FileText, School, BarChart2, CheckCircle, XCircle, RotateCcw, LogOut, GraduationCap, Layers, Plus, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { PILLARS } from '../data/pillars'
import { CONTENT_TYPES } from '../data/content'

const NAV = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'moderation',label: 'Moderation', icon: FileText },
  { id: 'topics',    label: 'Topics',    icon: Layers },
  { id: 'schools',   label: 'Schools',   icon: School },
]

export default function AdminDashboard() {
  const {
    publishedLessons, pendingLessons, decideLesson,
    contributions, pendingContributions, decideContribution,
    topics, addTopic,
  } = useApp()
  const { signOut } = useAuth()
  const [activeNav, setActiveNav] = useState('analytics')
  const [schools, setSchools] = useState([])
  const [newTopic, setNewTopic] = useState({ pillar: PILLARS[0].id, name: '', description: '' })
  const [addingTopic, setAddingTopic] = useState(false)

  useEffect(() => {
    supabase.from('schools').select('*').order('name').then(({ data }) => setSchools(data || []))
  }, [])

  const handleAddTopic = async () => {
    if (!newTopic.name.trim()) return
    setAddingTopic(true)
    await addTopic({ pillar: newTopic.pillar, name: newTopic.name.trim(), description: newTopic.description.trim() })
    setAddingTopic(false)
    setNewTopic({ pillar: newTopic.pillar, name: '', description: '' })
  }

  const pendingStudentContributions = pendingContributions.filter(c => c.contributorRole === 'student')
  const pendingTeacherContributions = pendingContributions.filter(c => c.contributorRole === 'teacher')
  const totalPending = pendingContributions.length + pendingLessons.length
  const publishedContributions = contributions.filter(c => c.status === 'published')

  const CAT_DATA = PILLARS.map(p => {
    const count = publishedContributions.filter(c => c.pillar === p.id).length + publishedLessons.filter(l => l.pillar === p.id).length
    return { label: p.short, color: p.color, count }
  })
  const maxCat = Math.max(1, ...CAT_DATA.map(c => c.count))

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-zazi-navy flex flex-col py-6 w-16 md:w-56 transition-all">
        <div className="px-4 mb-6 hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-zazi-orange rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">Z</div>
          <span className="text-white font-black text-sm">Zazi Admin</span>
        </div>
        <p className="text-zazi-muted text-[10px] uppercase tracking-widest px-4 mb-2 hidden md:block">Platform Dashboard</p>

        <nav className="flex-1 px-2 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeNav === id ? 'bg-zazi-orange text-white' : 'text-gray-400 hover:bg-white/10'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="hidden md:block">{label}</span>
              {id === 'moderation' && totalPending > 0 && (
                <span className="hidden md:flex ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 items-center justify-center">{totalPending}</span>
              )}
            </button>
          ))}
        </nav>

        <button onClick={signOut} className="flex items-center gap-3 px-5 py-3 text-gray-500 hover:text-gray-300 text-sm">
          <LogOut size={16} />
          <span className="hidden md:block">Logout</span>
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
        {activeNav === 'analytics' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-black text-zazi-navy">Analytics Dashboard</h1>
              <p className="text-zazi-muted text-sm">Platform overview and insights</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Lessons',      val: publishedLessons.length, icon: GraduationCap, color: '#006E68' },
                { label: 'Contributions',      val: publishedContributions.length, icon: FileText, color: '#FF8A00' },
                { label: 'Pending Moderation', val: totalPending,            icon: Users,          color: '#0D665F' },
                { label: 'Schools',            val: schools.length,          icon: School,         color: '#F4B84C' },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-2xl p-4 shadow-card">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: k.color + '20' }}>
                    <k.icon size={18} style={{ color: k.color }} />
                  </div>
                  <p className="text-2xl font-black text-zazi-navy">{k.val}</p>
                  <p className="text-zazi-muted text-xs mt-0.5">{k.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-black text-zazi-navy text-sm mb-4">Content & Lessons by Pillar</h3>
              <div className="space-y-3">
                {CAT_DATA.map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-zazi-navy text-xs font-medium">{c.label}</span>
                      <span className="text-xs font-bold" style={{ color: c.color }}>{c.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(c.count / maxCat) * 100}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeNav === 'moderation' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-black text-zazi-navy">Content Moderation</h1>
              <p className="text-zazi-muted text-sm">Review student submissions and contributor lessons before they go live</p>
            </div>

            {/* Student contributions queue */}
            <div className="bg-white rounded-2xl p-5 shadow-card mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-zazi-navy text-sm">Student Submissions</h3>
                <span className="bg-zazi-orange text-white text-xs font-bold px-3 py-1 rounded-full">{pendingStudentContributions.length} Pending</span>
              </div>
              {pendingStudentContributions.length === 0 ? (
                <EmptyQueue />
              ) : (
                <div className="space-y-3">
                  {pendingStudentContributions.map(item => (
                    <ContributionRow key={item.id} item={item} decide={decideContribution} />
                  ))}
                </div>
              )}
            </div>

            {/* Verified educator contributions queue */}
            <div className="bg-white rounded-2xl p-5 shadow-card mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-zazi-navy text-sm">Educator Submissions</h3>
                <span className="bg-zazi-teal text-white text-xs font-bold px-3 py-1 rounded-full">{pendingTeacherContributions.length} Pending</span>
              </div>
              {pendingTeacherContributions.length === 0 ? (
                <EmptyQueue label="No educator submissions pending." />
              ) : (
                <div className="space-y-3">
                  {pendingTeacherContributions.map(item => (
                    <ContributionRow key={item.id} item={item} decide={decideContribution} />
                  ))}
                </div>
              )}
            </div>

            {/* Contributor lesson queue */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-zazi-navy text-sm">Contributor Lessons</h3>
                <span className="bg-zazi-teal text-white text-xs font-bold px-3 py-1 rounded-full">{pendingLessons.length} Pending</span>
              </div>
              {pendingLessons.length === 0 ? (
                <EmptyQueue label="No lessons awaiting review." />
              ) : (
                <div className="space-y-3">
                  {pendingLessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: lesson.color + '20' }}>
                        <GraduationCap size={18} style={{ color: lesson.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-zazi-navy font-bold text-sm truncate block">{lesson.title}</span>
                        <p className="text-zazi-muted text-xs mt-0.5">By {lesson.contributor} · Grade {lesson.gradeMin}-{lesson.gradeMax}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => decideLesson(lesson.id, 'published')} className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50">
                          <CheckCircle size={16} className="text-green-500" />
                        </button>
                        <button onClick={() => decideLesson(lesson.id, 'rejected')} className="w-8 h-8 rounded-full border-2 border-red-400 flex items-center justify-center hover:bg-red-50">
                          <XCircle size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeNav === 'topics' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-black text-zazi-navy">Topics</h1>
              <p className="text-zazi-muted text-sm">The taxonomy contributors pick from when authoring a lesson — Pillar → Topic → Lesson</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card mb-5">
              <h3 className="font-black text-zazi-navy text-sm mb-4">Add a Topic</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="relative">
                  <select
                    value={newTopic.pillar}
                    onChange={e => setNewTopic(t => ({ ...t, pillar: e.target.value }))}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none"
                  >
                    {PILLARS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
                </div>
                <input
                  value={newTopic.name}
                  onChange={e => setNewTopic(t => ({ ...t, name: e.target.value }))}
                  placeholder="Topic name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                />
                <input
                  value={newTopic.description}
                  onChange={e => setNewTopic(t => ({ ...t, description: e.target.value }))}
                  placeholder="Short description (optional)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                />
              </div>
              <button
                onClick={handleAddTopic}
                disabled={!newTopic.name.trim() || addingTopic}
                className="mt-3 flex items-center gap-2 bg-zazi-orange text-white font-bold text-sm px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:pointer-events-none"
              >
                <Plus size={16} />
                {addingTopic ? 'Adding...' : 'Add Topic'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {PILLARS.map(p => {
                const pillarTopics = topics.filter(t => t.pillar === p.id)
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-5 shadow-card">
                    <h3 className="font-black text-zazi-navy text-sm mb-3 flex items-center gap-1.5">
                      <p.icon size={14} style={{ color: p.color }} /> {p.name}
                    </h3>
                    {pillarTopics.length === 0 ? (
                      <p className="text-zazi-muted text-xs">No topics yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {pillarTopics.map(t => (
                          <div key={t.id} className="px-3 py-2.5 bg-gray-50 rounded-xl">
                            <p className="text-zazi-navy font-bold text-sm">{t.name}</p>
                            {t.description && <p className="text-zazi-muted text-xs mt-0.5">{t.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activeNav === 'schools' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-black text-zazi-navy">Schools</h1>
              <p className="text-zazi-muted text-sm">Participating schools across South Africa</p>
            </div>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {schools.map((s, i) => (
                <div key={s.id} className={`flex items-center justify-between px-5 py-3 ${i !== schools.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div>
                    <p className="text-zazi-navy font-bold text-sm">{s.name}</p>
                    <p className="text-zazi-muted text-xs">{s.district}, {s.province}</p>
                  </div>
                  <span className="text-zazi-teal text-xs font-bold">Active</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function EmptyQueue({ label = 'All caught up! No submissions pending.' }) {
  return (
    <div className="text-center py-8 text-zazi-muted text-sm">
      <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
      {label}
    </div>
  )
}

function ContributionRow({ item, decide }) {
  const typeInfo = CONTENT_TYPES.find(t => t.id === item.type)
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '20' }}>
        {typeInfo && <typeInfo.icon size={18} style={{ color: item.color }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-zazi-navy font-bold text-sm truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: item.color + '20', color: item.color }}>
            {typeInfo?.label || item.type}
          </span>
          <span className="text-zazi-muted text-[10px]">by {item.author}{item.school ? ` · ${item.school}` : ''}{item.pillar ? ` · ${item.pillar}` : ''}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => decide(item.id, 'approved')} title="Approve" className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50">
          <CheckCircle size={16} className="text-green-500" />
        </button>
        <button onClick={() => decide(item.id, 'needs_changes', 'Please review and resubmit')} title="Request Changes" className="w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center hover:bg-amber-50">
          <RotateCcw size={15} className="text-amber-500" />
        </button>
        <button onClick={() => decide(item.id, 'rejected', 'Does not meet content guidelines')} title="Reject" className="w-8 h-8 rounded-full border-2 border-red-400 flex items-center justify-center hover:bg-red-50">
          <XCircle size={16} className="text-red-400" />
        </button>
      </div>
    </div>
  )
}
