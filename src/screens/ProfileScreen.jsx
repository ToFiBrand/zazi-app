import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Share2, Grid, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CONTENT_TYPES } from '../data/content'
import { Avatar, Card, Button, ProgressBar } from '../components/ui'

const STATUS_STYLE = {
  approved: { bg: '#5F977022', text: '#3F6650', label: 'Published' },
  pending:  { bg: '#F4B84C26', text: '#8A5F14', label: 'Under Review' },
  rejected: { bg: '#E8603C1F', text: '#C94B2B', label: 'Needs Changes' },
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
    if (stats.lessonsCompleted >= 1) list.push({ label: 'First Lesson Complete', emoji: '🎉', color: '#FF8A00' })
    if (stats.lessonsCompleted >= 3) list.push({ label: 'Career Explorer', emoji: '🧭', color: '#006E68' })
    if (stats.creations >= 1) list.push({ label: 'Zazi Creator', emoji: '🎨', color: '#0D665F' })
    return list
  }, [stats])

  return (
    <div className="min-h-screen bg-zazi-cream pb-[76px] md:pb-10">
      {/* Header bg */}
      <div className="h-36 relative rounded-b-[2.5rem]" style={{ background: 'linear-gradient(135deg, #FF8A00, #F4B84C)' }}>
        <div className="absolute top-5 right-6">
          <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Settings size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="flex items-end justify-between">
          <Avatar avatarId={user.avatarId} size="2xl" ring />
          <div className="flex gap-2 mb-1.5">
            <Button variant="primary" size="sm">Edit Profile</Button>
            <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft">
              <Share2 size={15} className="text-zazi-navy" />
            </button>
          </div>
        </div>

        {/* User info — limited, no email exposed */}
        <div className="mt-3.5">
          <h1 className="text-xl font-extrabold text-zazi-navy">{user.firstName} {user.lastName}</h1>
          <p className="text-zazi-navy/45 text-xs mt-0.5">Grade {user.grade} · {school?.name}</p>
          <p className="text-zazi-teal font-bold text-sm mt-1.5">Dream. Learn. Create. Lead.</p>
          <p className="text-zazi-navy/60 text-sm mt-1 leading-relaxed">{user.bio}</p>
        </div>

        {/* My Zazi Journey */}
        <Card className="mt-4 p-4">
          <p className="text-zazi-navy font-extrabold text-sm mb-3">My Zazi Journey</p>
          <div className="flex gap-6">
            {[
              { label: 'Lessons', val: stats.lessonsCompleted },
              { label: 'Creations', val: stats.creations },
              { label: 'Challenges', val: stats.challengesCompleted },
            ].map(s => (
              <div key={s.label}>
                <p className="text-zazi-navy font-extrabold text-xl">{s.val}</p>
                <p className="text-zazi-navy/45 text-[11px]">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {badges.map(b => (
              <span key={b.label} className="text-[10px] font-bold px-3 py-1.5 rounded-full text-white" style={{ background: b.color }}>
                {b.emoji} {b.label}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/contributor-application')}
          className="w-full mt-3 border-2 border-zazi-teal/25 text-zazi-teal font-bold text-xs py-3 rounded-2xl"
        >
          Become a Zazi Contributor →
        </button>
      </div>

      {/* Progress card */}
      <div className="px-6">
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-zazi-navy font-extrabold text-sm">My Progress</p>
            <span className="text-zazi-orange text-xs font-bold">Grade {user.grade}</span>
          </div>
          <div className="space-y-3">
            {pillarProgress.filter(p => p.total > 0).map(p => (
              <div key={p.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-zazi-navy/70 text-xs font-medium flex items-center gap-1.5"><p.icon size={12} style={{ color: p.color }} />{p.short}</span>
                  <span className="text-xs font-bold" style={{ color: p.color }}>{p.pct}%</span>
                </div>
                <ProgressBar pct={p.pct} color={p.color} height={6} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zazi-navy/8 mt-5 mx-6">
        <button
          onClick={() => setActiveTab('creations')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'creations' ? 'text-zazi-orange border-zazi-orange' : 'text-zazi-navy/40 border-transparent'
          }`}
        >
          <Grid size={16} /> My Creations
        </button>
      </div>

      {/* Content */}
      <div className="px-6 mt-4">
        {myContent.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-zazi-navy font-bold text-sm">You haven't created anything yet.</p>
            <p className="text-zazi-navy/50 text-xs mt-1 mb-3">Your voice belongs here.</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/create')}>Create Something</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {myContent.map(item => {
              const st = STATUS_STYLE[item.status]
              const typeInfo = CONTENT_TYPES.find(t => t.id === item.type)
              return (
                <Card key={item.id} className="p-3 flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '1C' }}>
                    <span className="text-2xl">{typeInfo?.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zazi-navy font-bold text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.text }}>
                        {st.label}
                      </span>
                      {item.status === 'pending' && <Clock size={11} className="text-zazi-navy/30" />}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
