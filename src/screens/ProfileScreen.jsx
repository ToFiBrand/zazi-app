import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Share2, Grid, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CONTENT_TYPES } from '../data/content'

const STATUS_STYLE = {
  approved: { bg: '#dcfce7', text: '#16a34a', label: 'Published' },
  pending:  { bg: '#fef9c3', text: '#ca8a04', label: 'Under Review' },
  rejected: { bg: '#fde8e8', text: '#dc2626', label: 'Needs Changes' },
}

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, school, stats, pillarProgress, content } = useApp()
  const [activeTab, setActiveTab] = useState('creations')

  const myContent = useMemo(
    () => content.filter(c => c.author === `${user.firstName} ${user.lastName[0]}.`),
    [content, user]
  )

  const badges = useMemo(() => {
    const list = []
    if (stats.lessonsCompleted >= 1) list.push({ label: 'First Lesson Complete', emoji: '🎉', color: '#E07A2F' })
    if (stats.lessonsCompleted >= 3) list.push({ label: 'Career Explorer', emoji: '🧭', color: '#3B9A8C' })
    if (stats.creations >= 1) list.push({ label: 'Zazi Creator', emoji: '🎨', color: '#7C5CBF' })
    return list
  }, [stats])

  return (
    <div className="min-h-screen bg-zazi-cream pb-[70px] md:pb-8">
      {/* Header bg */}
      <div className="h-24 relative rounded-b-3xl" style={{ background: 'linear-gradient(135deg, #E07A2F, #F0A500)' }}>
        <div className="absolute top-4 right-5">
          <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Settings size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-9 relative z-10">
        <div className="flex items-end justify-between">
          <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl">{user.avatar}</div>
          <div className="flex gap-2 mb-1">
            <button className="bg-zazi-orange text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
              ✏️ Edit Profile
            </button>
            <button className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-card">
              <Share2 size={14} className="text-zazi-navy" />
            </button>
          </div>
        </div>

        {/* User info — limited, no email exposed */}
        <div className="mt-3">
          <h2 className="text-lg font-black text-zazi-navy">{user.firstName} {user.lastName}</h2>
          <p className="text-zazi-muted text-xs">Grade {user.grade} · {school?.name}</p>
          <p className="text-zazi-navy/70 text-sm mt-1.5 leading-relaxed">{user.bio}</p>
        </div>

        {/* My Zazi Journey */}
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-card">
          <p className="text-zazi-navy font-black text-sm mb-3">My Zazi Journey</p>
          <div className="flex gap-6">
            {[
              { label: 'Lessons Completed', val: stats.lessonsCompleted },
              { label: 'Creations', val: stats.creations },
              { label: 'Challenges', val: stats.challengesCompleted },
            ].map(s => (
              <div key={s.label}>
                <p className="text-zazi-navy font-black text-xl">{s.val}</p>
                <p className="text-zazi-muted text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {badges.map(b => (
              <span key={b.label} className="text-[10px] font-bold px-3 py-1 rounded-full text-white" style={{ background: b.color }}>
                {b.emoji} {b.label}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/contributor-application')}
          className="w-full mt-3 border border-zazi-orange/40 text-zazi-orange font-semibold text-xs py-2.5 rounded-xl"
        >
          Become a Zazi Contributor →
        </button>
      </div>

      {/* Progress card */}
      <div className="mx-5 mt-4 bg-white rounded-2xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <p className="text-zazi-navy font-bold text-sm">Learning Progress</p>
          <span className="text-zazi-orange text-xs font-semibold">Grade {user.grade}</span>
        </div>
        <div className="space-y-2">
          {pillarProgress.filter(p => p.total > 0).map(p => (
            <div key={p.id}>
              <div className="flex justify-between mb-0.5">
                <span className="text-zazi-navy/70 text-xs">{p.short}</span>
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-4 mx-5">
        <button
          onClick={() => setActiveTab('creations')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'creations' ? 'text-zazi-orange border-zazi-orange' : 'text-zazi-muted border-transparent'
          }`}
        >
          <Grid size={16} /> My Creations
        </button>
      </div>

      {/* Content */}
      <div className="px-5 mt-3">
        {myContent.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-card">
            <p className="text-zazi-navy font-bold text-sm">You haven't created anything yet.</p>
            <p className="text-zazi-muted text-xs mt-1 mb-3">Your voice belongs here.</p>
            <button onClick={() => navigate('/create')} className="bg-zazi-orange text-white font-bold text-sm px-5 py-2.5 rounded-xl">
              Create Something
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myContent.map(item => {
              const st = STATUS_STYLE[item.status]
              const typeInfo = CONTENT_TYPES.find(t => t.id === item.type)
              return (
                <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-3 items-center shadow-card">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '30' }}>
                    <span className="text-2xl">{typeInfo?.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zazi-navy font-bold text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.text }}>
                        {st.label}
                      </span>
                      {item.status === 'pending' && <Clock size={11} className="text-zazi-muted" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
