import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Clock, Check } from 'lucide-react'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'
import { Card, Chip, Avatar, ProgressBar } from '../components/ui'

const GRADES = [7, 8, 9, 10, 11, 12]

export default function LearnScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, publishedLessons, progress } = useApp()
  const [grade, setGrade] = useState(user.grade)
  const [pillar, setPillar] = useState(searchParams.get('pillar') || 'all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return publishedLessons.filter(l => {
      const inGrade = grade >= l.gradeMin && grade <= l.gradeMax
      const inPillar = pillar === 'all' || l.pillar === pillar
      const inQuery = !query || l.title.toLowerCase().includes(query.toLowerCase())
      return inGrade && inPillar && inQuery
    })
  }, [publishedLessons, grade, pillar, query])

  const recommended = useMemo(() => {
    return filtered.filter(l => !progress[l.id]?.completed).slice(0, 3)
  }, [filtered, progress])

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col pb-[76px] md:pb-10">
      {/* Header */}
      <div className="px-6 pt-7 pb-2">
        <h1 className="text-2xl font-extrabold text-zazi-navy leading-tight">What do you want to learn today?</h1>
        <div className="bg-white rounded-2xl flex items-center gap-2.5 px-4 py-3.5 shadow-soft mt-4">
          <Search size={17} className="text-zazi-navy/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm text-zazi-navy bg-transparent outline-none placeholder-zazi-navy/40"
            placeholder="Search lessons, topics..."
          />
        </div>
      </div>

      {/* Grade selector */}
      <div className="px-6 flex gap-2 overflow-x-auto no-scrollbar pb-2 mt-3">
        {GRADES.map(g => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className={`zazi-tap flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              grade === g ? 'bg-zazi-navy text-white' : 'bg-white text-zazi-navy/70 shadow-soft'
            }`}
          >
            Grade {g}
          </button>
        ))}
      </div>

      {/* Pillars */}
      <div className="mt-5 px-6">
        <h3 className="font-extrabold text-zazi-navy text-sm mb-2.5">Learning Pillars</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setPillar('all')}
            className={`zazi-tap flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              pillar === 'all' ? 'bg-zazi-orange text-white' : 'bg-white text-zazi-navy/70 shadow-soft'
            }`}
          >
            All
          </button>
          {PILLARS.map(p => (
            <button
              key={p.id}
              onClick={() => setPillar(p.id)}
              className="zazi-tap flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold shadow-soft transition-all"
              style={{
                background: pillar === p.id ? p.color : 'white',
                color: pillar === p.id ? 'white' : '#17283A',
              }}
            >
              <p.icon size={13} />{p.short}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mt-6 px-6">
          <h3 className="font-extrabold text-zazi-navy text-sm mb-3">Recommended For You</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {recommended.map(l => (
              <LessonMiniCard key={l.id} lesson={l} onClick={() => navigate(`/learn/${l.id}`)} />
            ))}
          </div>
        </section>
      )}

      {/* Lesson list */}
      <section className="mt-6 px-6 pb-2">
        <h3 className="font-extrabold text-zazi-navy text-sm mb-3">
          {pillar === 'all' ? `Grade ${grade} Lessons` : PILLARS.find(p => p.id === pillar)?.name}
        </h3>
        {filtered.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-zazi-navy font-bold text-sm">No lessons yet for this filter.</p>
            <p className="text-zazi-navy/50 text-xs mt-1">Try another grade or pillar — more lessons are on the way.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(l => (
              <LessonRow key={l.id} lesson={l} progress={progress[l.id]} onClick={() => navigate(`/learn/${l.id}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function LessonMiniCard({ lesson, onClick }) {
  const pillar = PILLARS.find(p => p.id === lesson.pillar)
  return (
    <button onClick={onClick} className="zazi-tap flex-shrink-0 w-40 text-left">
      <div
        className="w-full rounded-2xl relative overflow-hidden flex items-center justify-center"
        style={{ height: 96, background: lesson.color }}
      >
        <pillar.icon size={26} className="text-white/85" />
      </div>
      <Chip color={pillar.color} className="mt-2">{pillar.short}</Chip>
      <p className="text-zazi-navy font-bold text-xs leading-tight mt-1.5">{lesson.title}</p>
    </button>
  )
}

function LessonRow({ lesson, progress, onClick }) {
  const pillar = PILLARS.find(p => p.id === lesson.pillar)
  const pct = progress?.completed ? 100 : progress?.started ? 40 : 0
  return (
    <Card as="button" onClick={onClick} className="w-full p-3 flex gap-3 items-center text-left">
      <div
        className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{ background: lesson.color }}
      >
        <pillar.icon size={22} className="text-white/85" />
        {progress?.completed && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><Check size={18} strokeWidth={3} className="text-white" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Chip color={pillar.color}>{pillar.short}</Chip>
          <span className="text-zazi-navy/40 text-[10px] flex items-center gap-1"><Clock size={10} />{lesson.duration} min</span>
        </div>
        <p className="text-zazi-navy font-bold text-sm mt-1 truncate">{lesson.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Avatar avatarId={lesson.avatarId} size="xs" />
          <p className="text-zazi-navy/50 text-[10px]">{lesson.contributor} · Grade {lesson.gradeMin}-{lesson.gradeMax}</p>
        </div>
        {pct > 0 && <div className="mt-1.5"><ProgressBar pct={pct} color={pillar.color} height={5} /></div>}
      </div>
    </Card>
  )
}
