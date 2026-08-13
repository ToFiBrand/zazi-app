import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Play, ChevronRight, Trophy, Clock, Rocket, Cpu } from 'lucide-react'
import { PILLARS, pillarById } from '../data/pillars'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { Avatar, Card, Chip, ProgressBar } from '../components/ui'

// Entrepreneurship and Digital/AI/STEM are the platform's headline sell —
// same pillars as everywhere else (no duplication), just given outsized
// visual real estate here so they read as the flagship offer.
const FEATURED_PILLARS = [
  { pillarId: 'entrepreneurship', image: '/hero/pillar-entrepreneurship.jpg', label: 'Entrepreneurship', hook: 'Turn your idea into something real', icon: Rocket },
  { pillarId: 'digital', image: '/hero/pillar-digital.jpg', label: 'STEM, AI & Digital Skills', hook: 'Build with the tools shaping tomorrow', icon: Cpu },
]

export default function HomeScreen() {
  const navigate = useNavigate()
  const { user, publishedLessons, progress, studentContributions, notifications, continueLesson, recommendedLessons, lessonProgressPct } = useApp()
  const { isGuest } = useAuth()
  const unread = notifications.filter(n => !n.read).length

  const featured = useMemo(() => {
    return continueLesson || publishedLessons.filter(l => user.grade >= l.gradeMin && user.grade <= l.gradeMax)[0]
  }, [continueLesson, publishedLessons, user.grade])

  const featuredPillar = featured && pillarById(featured.pillar)
  const isContinuing = featured && featured.id === continueLesson?.id

  const trending = useMemo(() => studentContributions.slice(0, 2), [studentContributions])

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col pb-[76px] md:pb-10">
      {/* Hero — the hook question every visit opens with */}
      <div className="relative w-full overflow-hidden" style={{ height: 400 }}>
        <video
          src="/video/build-your-future.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-zazi-navy via-zazi-navy/60 to-transparent" />

        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <img src="/logo-h.svg" alt="Zazi" className="h-7 object-contain drop-shadow-md" />
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 bg-black/25 backdrop-blur rounded-full flex items-center justify-center">
              <Bell size={16} className="text-white" />
              {unread > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-zazi-coral rounded-full flex items-center justify-center border-2 border-zazi-navy">
                  <span className="text-white text-[8px] font-bold">{unread}</span>
                </div>
              )}
            </button>
            <button onClick={() => navigate('/profile')}>
              <Avatar avatarId={user.avatarId} size="sm" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-5 left-6 right-6 z-10">
          <p className="text-white/85 text-sm mb-1 drop-shadow-sm">Hi, {user.firstName} 👋</p>
          <h1 className="text-white text-2xl font-extrabold leading-tight drop-shadow-sm">Ready to build your future?</h1>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mt-4">
        <button onClick={() => navigate('/learn')} className="w-full bg-white rounded-2xl flex items-center gap-2.5 px-4 py-3.5 shadow-soft">
          <Search size={17} className="text-zazi-navy/40" />
          <span className="text-zazi-navy/40 text-sm">Search for lessons, topics...</span>
        </button>
      </div>

      {/* Guest banner */}
      {isGuest && (
        <div className="px-6 mt-4">
          <button
            onClick={() => navigate('/save-progress')}
            className="w-full flex items-center gap-3 bg-zazi-navy rounded-2xl px-4 py-3.5 text-left"
          >
            <div className="w-9 h-9 bg-zazi-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy size={16} className="text-zazi-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold">You're browsing as a guest</p>
              <p className="text-white/50 text-xs">Save your progress before you lose this device</p>
            </div>
            <ChevronRight size={16} className="text-white/40 flex-shrink-0" />
          </button>
        </div>
      )}

      {/* Flagship skills — the sell, front and centre */}
      <section className="mt-7 px-6">
        <h3 className="font-extrabold text-zazi-navy text-lg mb-1">Skills Worth Bragging About</h3>
        <p className="text-zazi-navy/45 text-xs mb-3">The future-facing skills Zazi is built around</p>
        <div className="grid grid-cols-2 gap-3">
          {FEATURED_PILLARS.map(f => {
            const pillar = pillarById(f.pillarId)
            return (
              <button
                key={f.pillarId}
                onClick={() => navigate(`/learn?pillar=${f.pillarId}`)}
                className="zazi-tap relative rounded-2xl overflow-hidden text-left"
                style={{ height: 168 }}
              >
                <img src={f.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zazi-navy via-zazi-navy/50 to-transparent" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <f.icon size={15} className="text-white" />
                  </span>
                </div>
                <p className="absolute bottom-2.5 left-3 right-3 text-white font-extrabold text-sm leading-tight drop-shadow-sm">{f.label}</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Featured — Continue where you left off, or start something new */}
      {featured && (
        <section className="mt-6 px-6">
          {isContinuing && (
            <p className="text-zazi-navy/50 font-bold text-xs uppercase tracking-wide mb-2">Pick up where you left off</p>
          )}
          <Card as="button" onClick={() => navigate(`/learn/${featured.id}`)} className="w-full overflow-hidden text-left">
            <div className="h-64 flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${featured.color}, ${featuredPillar.color})` }}>
              {featured.coverImageUrl ? (
                <img src={featured.coverImageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <featuredPillar.icon size={64} className="text-white/25" />
              )}
              <div className="absolute top-3 left-3">
                <Chip color={featuredPillar.color} tone="solid">{featuredPillar.short.toUpperCase()}</Chip>
              </div>
              {/* Scrim keeps the title legible over any cover image */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <h3 className="absolute bottom-4 left-4 right-4 text-white font-extrabold text-lg leading-snug drop-shadow-sm">
                {featured.title}
              </h3>
            </div>
            <div className="p-5">
              <p className="text-zazi-navy/60 text-sm leading-relaxed line-clamp-2">{featured.description}</p>
              {isContinuing ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-zazi-teal text-xs font-bold">{lessonProgressPct(featured.id)}% complete</span>
                  </div>
                  <ProgressBar pct={lessonProgressPct(featured.id)} color={featuredPillar.color} />
                </div>
              ) : (
                <span className="zazi-tap font-bold rounded-full inline-flex items-center justify-center gap-2 bg-zazi-orange text-white shadow-soft text-xs px-4 py-2.5 mt-4">
                  Start Learning <Play size={13} className="fill-white" />
                </span>
              )}
            </div>
          </Card>
        </section>
      )}

      {/* Recommended for you */}
      {recommendedLessons.length > 0 && (
        <section className="mt-7 px-6">
          <h3 className="font-extrabold text-zazi-navy text-lg mb-1">Recommended For You</h3>
          <p className="text-zazi-navy/45 text-xs mb-3">Based on your grade, interests and progress</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {recommendedLessons.map(l => {
              const pillar = pillarById(l.pillar)
              return (
                <button key={l.id} onClick={() => navigate(`/learn/${l.id}`)} className="zazi-tap flex-shrink-0 w-40 text-left">
                  <div className="w-full h-28 rounded-2xl relative overflow-hidden flex items-center justify-center" style={{ background: l.color }}>
                    {l.coverImageUrl ? (
                      <img src={l.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <pillar.icon size={26} className="text-white/85" />
                    )}
                    <div className="absolute top-2 left-2">
                      <Chip color={pillar.color} tone="solid">{pillar.short}</Chip>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/75 to-transparent" />
                    <p className="absolute bottom-1.5 left-2 right-2 text-white font-bold text-xs leading-tight line-clamp-2 drop-shadow-sm">{l.title}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Explore Zazi */}
      <section className="mt-7 px-6">
        <h3 className="font-extrabold text-zazi-navy text-lg mb-3">Explore Zazi</h3>
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
        <button onClick={() => navigate('/create')} className="zazi-tap relative w-full rounded-3xl overflow-hidden text-left" style={{ height: 160 }}>
          <img src="/hero/challenge.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zazi-navy via-zazi-navy/40 to-transparent" />
          <div className="relative z-10 p-5 h-full flex flex-col justify-end">
            <span className="inline-block bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 w-fit">ZAZI CHALLENGE</span>
            <p className="text-white font-extrabold text-lg leading-snug drop-shadow-sm">Create a 60-second video<br />on your dream career</p>
          </div>
        </button>
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
