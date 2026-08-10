import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Play, Clock } from 'lucide-react'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'

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
    <div className="min-h-screen bg-zazi-cream flex flex-col pb-[70px] md:pb-8">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-black text-zazi-navy">What do you want to learn today?</h2>
        <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-3 shadow-card mt-3">
          <Search size={16} className="text-zazi-muted" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm text-zazi-navy bg-transparent outline-none placeholder-zazi-muted"
            placeholder="Search lessons, topics..."
          />
        </div>
      </div>

      {/* Grade selector */}
      <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {GRADES.map(g => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              grade === g ? 'bg-zazi-orange text-white' : 'bg-white text-zazi-navy shadow-card'
            }`}
          >
            Grade {g}
          </button>
        ))}
      </div>

      {/* Pillars */}
      <div className="mt-4 px-5">
        <h3 className="font-black text-zazi-navy text-sm mb-2">Learning Pillars</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setPillar('all')}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              pillar === 'all' ? 'bg-zazi-navy text-white' : 'bg-white text-zazi-navy shadow-card'
            }`}
          >
            All
          </button>
          {PILLARS.map(p => (
            <button
              key={p.id}
              onClick={() => setPillar(p.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-card transition-all"
              style={{
                background: pillar === p.id ? p.color : 'white',
                color: pillar === p.id ? 'white' : '#1C2B3A',
              }}
            >
              <span>{p.emoji}</span>{p.short}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mt-5 px-5">
          <h3 className="font-black text-zazi-navy text-sm mb-3">Recommended For You</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {recommended.map(l => (
              <LessonMiniCard key={l.id} lesson={l} onClick={() => navigate(`/learn/${l.id}`)} />
            ))}
          </div>
        </section>
      )}

      {/* Lesson list */}
      <section className="mt-5 px-5 pb-2">
        <h3 className="font-black text-zazi-navy text-sm mb-3">
          {pillar === 'all' ? `Grade ${grade} Lessons` : PILLARS.find(p => p.id === pillar)?.name}
        </h3>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-card">
            <p className="text-zazi-navy font-bold text-sm">No lessons yet for this filter.</p>
            <p className="text-zazi-muted text-xs mt-1">Try another grade or pillar — more lessons are on the way.</p>
          </div>
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
    <button onClick={onClick} className="flex-shrink-0 w-40 text-left">
      <div
        className="w-full rounded-2xl relative overflow-hidden flex items-center justify-center"
        style={{ height: 96, background: lesson.color }}
      >
        <div className="w-9 h-9 bg-white/30 rounded-full flex items-center justify-center">
          <Play size={14} className="text-white fill-white ml-0.5" />
        </div>
      </div>
      <p className="text-[10px] font-bold mt-2" style={{ color: lesson.color }}>{pillar?.short}</p>
      <p className="text-zazi-navy font-bold text-xs leading-tight mt-0.5">{lesson.title}</p>
    </button>
  )
}

function LessonRow({ lesson, progress, onClick }) {
  const pillar = PILLARS.find(p => p.id === lesson.pillar)
  const pct = progress?.completed ? 100 : progress?.started ? 40 : 0
  return (
    <button onClick={onClick} className="w-full bg-white rounded-2xl p-3 flex gap-3 items-center shadow-card text-left">
      <div
        className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{ background: lesson.color }}
      >
        <Play size={16} className="text-white fill-white ml-0.5" />
        {progress?.completed && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-bold">✓</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: lesson.color + '20', color: lesson.color }}>
            {pillar?.short}
          </span>
          <span className="text-zazi-muted text-[10px] flex items-center gap-1"><Clock size={10} />{lesson.duration} min</span>
        </div>
        <p className="text-zazi-navy font-bold text-sm mt-1 truncate">{lesson.title}</p>
        <p className="text-zazi-muted text-[10px] mt-0.5">{lesson.contributor} · Grade {lesson.gradeMin}-{lesson.gradeMax}</p>
        {pct > 0 && (
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: lesson.color }} />
          </div>
        )}
      </div>
    </button>
  )
}
