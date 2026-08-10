import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Play, Clock, Download, CheckCircle2, MessageCircle } from 'lucide-react'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'

export default function LessonDetailScreen() {
  const navigate = useNavigate()
  const { lessonId } = useParams()
  const { lessons, progress, startLesson, completeLesson, user } = useApp()
  const lesson = lessons.find(l => l.id === lessonId)
  const [justCompleted, setJustCompleted] = useState(false)
  const [comment, setComment] = useState('')

  useEffect(() => { if (lesson) startLesson(lesson.id) }, [lesson, startLesson])

  const nextLesson = useMemo(() => {
    if (!lesson) return null
    return lessons.find(l =>
      l.id !== lesson.id &&
      l.status === 'published' &&
      user.grade >= l.gradeMin && user.grade <= l.gradeMax &&
      !progress[l.id]?.completed
    )
  }, [lessons, lesson, user.grade, progress])

  const handleComplete = () => {
    completeLesson(lesson.id)
    setJustCompleted(true)
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-zazi-cream flex flex-col items-center justify-center px-8 text-center">
        <p className="text-3xl mb-2">🔍</p>
        <h2 className="text-lg font-black text-zazi-navy">Lesson not found</h2>
        <p className="text-zazi-muted text-sm mt-1">This lesson may have been removed or the link is out of date.</p>
        <button onClick={() => navigate('/learn')} className="mt-5 bg-zazi-orange text-white font-bold text-sm px-6 py-3 rounded-xl">
          Back to Learn
        </button>
      </div>
    )
  }

  const pillar = PILLARS.find(p => p.id === lesson.pillar)
  const done = !!progress[lesson.id]?.completed

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col">
      {/* Video hero */}
      <div
        className="relative w-full flex items-center justify-center flex-shrink-0"
        style={{ height: 200, background: `linear-gradient(135deg, ${lesson.color}, ${pillar?.color || lesson.color})` }}
      >
        <button onClick={() => navigate('/learn')} className="absolute top-4 left-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
          <Play size={26} className="text-zazi-orange fill-zazi-orange ml-1" />
        </div>
        <div className="absolute bottom-3 right-3 bg-black/50 rounded px-2 py-0.5 flex items-center gap-1">
          <Clock size={11} className="text-white" />
          <span className="text-white text-[11px] font-medium">{lesson.duration} min</span>
        </div>
      </div>

      <div className="px-5 pt-4 flex-1">
        <div className="flex gap-2 mb-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: pillar.color + '20', color: pillar.color }}>
            {pillar.emoji} {pillar.short}
          </span>
          <span className="bg-gray-100 text-zazi-navy text-[10px] font-bold px-2 py-0.5 rounded-full">
            Grade {lesson.gradeMin}-{lesson.gradeMax}
          </span>
        </div>
        <h2 className="text-lg font-black text-zazi-navy leading-tight">{lesson.title}</h2>

        {/* Contributor */}
        <div className="flex items-center gap-2 mt-3">
          <div className="w-9 h-9 bg-zazi-orange rounded-full flex items-center justify-center text-lg">👤</div>
          <div>
            <p className="text-zazi-navy font-bold text-sm">{lesson.contributor}</p>
            <p className="text-zazi-muted text-[10px]">{lesson.contributorRole}</p>
          </div>
          {lesson.sponsor && (
            <span className="ml-auto text-[10px] text-zazi-muted">Sponsored by <b className="text-zazi-navy">{lesson.sponsor}</b></span>
          )}
        </div>

        {/* About */}
        <div className="mt-4">
          <h3 className="font-black text-zazi-navy text-sm mb-2">About This Lesson</h3>
          <p className="text-zazi-navy/70 text-sm leading-relaxed">{lesson.description}</p>
        </div>

        {/* What you'll learn */}
        <div className="mt-4">
          <h3 className="font-black text-zazi-navy text-sm mb-2">What You'll Walk Away Knowing</h3>
          <ul className="space-y-1.5">
            {lesson.objectives.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zazi-navy/80">
                <CheckCircle2 size={15} className="text-zazi-teal mt-0.5 flex-shrink-0" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* Resource */}
        <div className="mt-4 bg-white rounded-2xl p-3 flex items-center gap-3 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-zazi-teal/20 flex items-center justify-center flex-shrink-0">
            <Download size={18} className="text-zazi-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zazi-navy font-bold text-sm truncate">{lesson.resource.name}</p>
            <p className="text-zazi-muted text-[10px]">{lesson.resource.type} · Lesson resource</p>
          </div>
          <button className="text-zazi-teal text-xs font-bold">View</button>
        </div>

        {/* Take Action */}
        <div className="mt-4 bg-zazi-orange/10 rounded-2xl p-4">
          <p className="text-zazi-orange font-bold text-xs flex items-center gap-1 mb-1">⚡ Take Action</p>
          <p className="text-zazi-navy text-sm leading-relaxed">{lesson.activity}</p>
        </div>

        {/* Discussion */}
        <div className="mt-5">
          <h3 className="font-black text-zazi-navy text-sm mb-2 flex items-center gap-1.5">
            <MessageCircle size={15} /> Discussion
          </h3>
          <p className="text-zazi-navy/70 text-sm italic mb-3">{lesson.discussion}</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zazi-orange/20 rounded-full flex items-center justify-center text-base flex-shrink-0">{user.avatar}</div>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="flex-1 bg-white rounded-xl px-3 py-2 text-sm text-zazi-navy placeholder-zazi-muted outline-none shadow-card"
              placeholder="Share your thoughts..."
            />
          </div>
          <p className="text-zazi-muted text-[10px] mt-1.5">Comments are moderated to keep this space safe.</p>
        </div>

        {/* Completion */}
        <div className="mt-6 mb-4">
          {done || justCompleted ? (
            <div className="bg-zazi-teal/10 rounded-2xl p-5 text-center">
              <p className="text-zazi-teal font-black text-base">Nice work! 🎉</p>
              <p className="text-zazi-navy/70 text-sm mt-1">You've just taken another step toward your future.</p>
              {nextLesson ? (
                <button
                  onClick={() => navigate(`/learn/${nextLesson.id}`)}
                  className="mt-3 bg-zazi-teal text-white font-bold text-sm px-6 py-3 rounded-xl"
                >
                  Next: {nextLesson.title}
                </button>
              ) : (
                <button onClick={() => navigate('/learn')} className="mt-3 bg-zazi-teal text-white font-bold text-sm px-6 py-3 rounded-xl">
                  Browse More Lessons
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full bg-zazi-orange text-white font-black py-4 rounded-2xl text-base"
            >
              Mark Lesson Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
