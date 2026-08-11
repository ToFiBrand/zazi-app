import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Play, ChevronRight, Trophy, Clock } from 'lucide-react'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'
import { Avatar, Card, Chip, Button, ProgressBar } from '../components/ui'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { user, publishedLessons, progress, approvedContent, notifications } = useApp()
  const unread = notifications.filter(n => !n.read).length

  const inProgress = useMemo(() => {
    return publishedLessons
      .filter(l => progress[l.id]?.started && !progress[l.id]?.completed)
      .filter(l => user.grade >= l.gradeMin && user.grade <= l.gradeMax)
  }, [publishedLessons, progress, user.grade])

  const featured = useMemo(() => {
    return publishedLessons
      .filter(l => user.grade >= l.gradeMin && user.grade <= l.gradeMax)[0]
  }, [publishedLessons, user.grade])

  const featuredPillar = featured && PILLARS.find(p => p.id === featured.pillar)

  const trending = useMemo(() => approvedContent.slice(0, 2), [approvedContent])

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col pb-[76px] md:pb-10">
      {/* Header */}
      <div className="px-6 pt-7 pb-2 flex items-center justify-between">
        <div>
          <p className="text-zazi-navy/60 text-sm">Hi, {user.firstName} 👋</p>
          <h1 className="text-zazi-navy text-2xl font-extrabold leading-tight">Ready to build your future?</h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => navigate('/notifications')} className="relative w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-soft">
            <Bell size={18} className="text-zazi-navy" />
            {unread > 0 && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-zazi-coral rounded-full flex items-center justify-center border-2 border-zazi-cream">
                <span className="text-white text-[8px] font-bold">{unread}</span>
              </div>
            )}
          </button>
          <button onClick={() => navigate('/profile')}>
            <Avatar avatarId={user.avatarId} size="sm" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mt-3">
        <button onClick={() => navigate('/learn')} className="w-full bg-white rounded-2xl flex items-center gap-2.5 px-4 py-3.5 shadow-soft">
          <Search size={17} className="text-zazi-navy/40" />
          <span className="text-zazi-navy/40 text-sm">Search for lessons, topics...</span>
        </button>
      </div>

      {/* Featured — editorial hero card */}
      {featured && (
        <section className="mt-6 px-6">
          <Card as="div" className="w-full overflow-hidden">
            <div className="h-64 flex items-center justify-center relative bg-white">
              <img src={featuredPillar.art} alt="" className="w-full h-full object-contain scale-110" />
              <div className="absolute top-3 left-3">
                <Chip color={featuredPillar.color} tone="solid">{featuredPillar.short.toUpperCase()}</Chip>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-zazi-navy font-extrabold text-lg leading-snug">{featured.title}</h3>
              <p className="text-zazi-navy/60 text-sm mt-1 leading-relaxed line-clamp-2">{featured.description}</p>
              <Button variant="primary" size="sm" className="mt-4">
                Start Learning <Play size={13} className="fill-white" />
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Continue Learning */}
      {inProgress.length > 0 && (
        <section className="mt-7 px-6">
          <h3 className="font-extrabold text-zazi-navy text-lg mb-3">Continue Learning</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {inProgress.map(l => {
              const pillar = PILLARS.find(p => p.id === l.pillar)
              return (
                <button key={l.id} onClick={() => navigate(`/learn/${l.id}`)} className="zazi-tap flex-shrink-0 w-44 text-left">
                  <div className="w-full h-24 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ background: l.color }}>
                    <pillar.icon size={26} className="text-white/90" />
                  </div>
                  <Chip color={pillar.color} className="mt-2">{pillar.short}</Chip>
                  <p className="text-zazi-navy font-bold text-sm mt-1.5 leading-tight truncate">{l.title}</p>
                  <div className="mt-1.5"><ProgressBar pct={40} color={pillar.color} height={5} /></div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Explore Learning Pillars */}
      <section className="mt-7 px-6">
        <h3 className="font-extrabold text-zazi-navy text-lg mb-3">Explore Learning</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PILLARS.map(p => (
            <button
              key={p.id}
              onClick={() => navigate(`/learn?pillar=${p.id}`)}
              className="zazi-tap bg-white rounded-2xl p-4 shadow-soft text-left"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5" style={{ background: p.color + '18' }}>
                <p.icon size={19} style={{ color: p.color }} />
              </div>
              <p className="text-zazi-navy font-bold text-sm leading-tight">{p.short}</p>
              <p className="text-zazi-navy/50 text-xs mt-1 leading-snug">{p.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Trending / student creations */}
      {trending.length > 0 && (
        <section className="mt-7 px-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-zazi-navy text-lg">Trending From Students</h3>
            <button onClick={() => navigate('/explore')} className="text-zazi-orange text-xs font-bold flex items-center gap-0.5">See all <ChevronRight size={12} /></button>
          </div>
          <div className="space-y-3">
            {trending.map(c => (
              <Card key={c.id} interactive onClick={() => navigate(`/explore/${c.id}`)} className="w-full p-3 flex gap-3 items-center text-left">
                <Avatar avatarId={c.avatarId} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-zazi-navy font-bold text-sm truncate">{c.title}</p>
                  <p className="text-zazi-navy/50 text-xs mt-0.5 truncate">{c.author} · {c.school}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Zazi Challenge */}
      <section className="mt-7 px-6">
        <div className="rounded-3xl p-5 flex items-center justify-between relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF8A00, #F4B84C)' }}>
          <div className="relative z-10">
            <span className="inline-block bg-white/25 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2">ZAZI CHALLENGE</span>
            <p className="text-white font-extrabold text-lg leading-snug">Create a 60-second video<br />on your dream career</p>
            <button onClick={() => navigate('/create')} className="mt-3 bg-white text-zazi-orange font-bold text-xs px-4 py-2 rounded-full">
              Take the Challenge
            </button>
          </div>
          <Trophy size={56} className="text-white/25 absolute -right-2 -bottom-2" />
        </div>
      </section>

      {/* Sponsor Spotlight */}
      <section className="mt-5 mx-6 mb-2">
        <div className="bg-zazi-navy rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-zazi-gold text-xs font-bold">SB</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold flex items-center gap-1">
              <Clock size={10} /> Sponsor Spotlight
            </p>
            <p className="text-white text-xs font-bold truncate">Standard Bank · Powering Financial Literacy for 24,000+ learners</p>
          </div>
        </div>
      </section>
    </div>
  )
}
