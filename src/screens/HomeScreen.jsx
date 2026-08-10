import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Play, ChevronRight } from 'lucide-react'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'

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
      .filter(l => user.grade >= l.gradeMin && user.grade <= l.gradeMax)
      .slice(0, 2)
  }, [publishedLessons, user.grade])

  const trending = useMemo(() => approvedContent.slice(0, 2), [approvedContent])

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col pb-[70px] md:pb-8">
      {/* Header */}
      <div className="bg-zazi-orange px-5 pt-5 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-xs">Hi, {user.firstName} 👋</p>
            <h2 className="text-white text-xl font-black">Ready to build your future?</h2>
          </div>
          <button onClick={() => navigate('/notifications')} className="relative">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bell size={18} className="text-white" />
            </div>
            {unread > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">{unread}</span>
              </div>
            )}
          </button>
        </div>

        {/* Search */}
        <button onClick={() => navigate('/learn')} className="w-full bg-white/20 backdrop-blur rounded-xl flex items-center gap-2 px-3 py-2.5">
          <Search size={16} className="text-white/70" />
          <span className="text-white/60 text-sm">Search for lessons, topics...</span>
        </button>
      </div>

      {/* Continue Learning */}
      {inProgress.length > 0 && (
        <section className="mt-5 px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-zazi-navy text-base">Continue Learning</h3>
          </div>
          <div className="space-y-3">
            {inProgress.map(l => {
              const pillar = PILLARS.find(p => p.id === l.pillar)
              return (
                <button key={l.id} onClick={() => navigate(`/learn/${l.id}`)} className="w-full bg-white rounded-2xl p-3 flex gap-3 items-center shadow-card text-left">
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: l.color }}>
                    <Play size={16} className="text-white fill-white ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold" style={{ color: l.color }}>{pillar?.short}</span>
                    <p className="text-zazi-navy font-bold text-sm truncate">{l.title}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full rounded-full" style={{ width: '40%', background: l.color }} />
                    </div>
                  </div>
                  <span className="text-zazi-orange text-xs font-bold">Continue</span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="mt-5 px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-zazi-navy text-base">Featured For Grade {user.grade}</h3>
          <button onClick={() => navigate('/learn')} className="text-zazi-orange text-xs font-semibold flex items-center gap-0.5">See all <ChevronRight size={12} /></button>
        </div>
        <div className="space-y-3">
          {featured.map(l => {
            const pillar = PILLARS.find(p => p.id === l.pillar)
            return (
              <button key={l.id} onClick={() => navigate(`/learn/${l.id}`)} className="w-full text-left">
                <div className="w-full rounded-2xl overflow-hidden relative" style={{ height: 150, background: l.color }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
                      <Play size={20} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">{pillar?.name}</span>
                    <p className="text-white font-bold text-sm mt-1">{l.title}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Explore Learning Pillars */}
      <section className="mt-5 px-5">
        <h3 className="font-black text-zazi-navy text-base mb-3">Explore Learning</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PILLARS.map(p => (
            <button
              key={p.id}
              onClick={() => navigate(`/learn?pillar=${p.id}`)}
              className="bg-white rounded-2xl p-3 shadow-card text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2" style={{ background: p.color + '20' }}>
                {p.emoji}
              </div>
              <p className="text-zazi-navy font-bold text-xs leading-tight">{p.short}</p>
              <p className="text-zazi-muted text-[10px] mt-0.5 leading-tight">{p.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Trending / student creations */}
      {trending.length > 0 && (
        <section className="mt-5 px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-zazi-navy text-base">Trending From Students</h3>
            <button onClick={() => navigate('/explore')} className="text-zazi-orange text-xs font-semibold flex items-center gap-0.5">See all <ChevronRight size={12} /></button>
          </div>
          <div className="space-y-3">
            {trending.map(c => (
              <button key={c.id} onClick={() => navigate(`/explore/${c.id}`)} className="w-full bg-white rounded-2xl p-3 flex gap-3 items-center shadow-card text-left">
                <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: c.color + '30' }}>
                  <span className="text-2xl">✨</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zazi-navy font-bold text-sm truncate">{c.title}</p>
                  <p className="text-zazi-muted text-[10px] mt-0.5">{c.author} · {c.school}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Zazi Challenge */}
      <section className="mt-5 px-5">
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #E07A2F, #F0A500)' }}>
          <div>
            <p className="text-white font-black text-base">Zazi Challenge</p>
            <p className="text-white/80 text-xs mt-0.5">Create a 60-second video on your dream career</p>
            <button onClick={() => navigate('/create')} className="mt-2 bg-white text-zazi-orange font-bold text-xs px-4 py-1.5 rounded-xl">
              Take the Challenge
            </button>
          </div>
          <span className="text-4xl">🏆</span>
        </div>
      </section>

      {/* Sponsor Spotlight */}
      <section className="mt-4 mx-5 mb-2 bg-white rounded-2xl p-3 flex items-center gap-3 shadow-card">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">SB</span>
        </div>
        <div>
          <p className="text-[10px] text-zazi-muted uppercase tracking-wider">Sponsor Spotlight</p>
          <p className="text-zazi-navy text-xs font-bold">Standard Bank · Powering Financial Literacy for 24,000+ learners</p>
        </div>
      </section>
    </div>
  )
}
