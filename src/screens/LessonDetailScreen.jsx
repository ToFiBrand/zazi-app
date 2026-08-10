import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Play, Clock, Download, CheckCircle2, MessageCircle, Zap } from 'lucide-react'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'
import { Avatar, Card, Chip, Button } from '../components/ui'

const DISCUSSION_REPLIES = [
  { id: 1, user: 'Zanele P.', avatarId: 'zanele', text: 'This really helped me understand where to start!', time: '3h ago' },
  { id: 2, user: 'Dumisani K.', avatarId: 'dumisani', text: "Didn't expect this to be so practical — trying it this week.", time: '1d ago' },
]

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
        <h2 className="text-lg font-extrabold text-zazi-navy">Lesson not found</h2>
        <p className="text-zazi-navy/50 text-sm mt-1">This lesson may have been removed or the link is out of date.</p>
        <Button variant="primary" className="mt-5" onClick={() => navigate('/learn')}>Back to Learn</Button>
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
        style={{ height: 220, background: `linear-gradient(135deg, ${lesson.color}, ${pillar?.color || lesson.color})` }}
      >
        <button onClick={() => navigate('/learn')} className="absolute top-4 left-4 w-9 h-9 bg-black/25 backdrop-blur rounded-full flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <pillar.icon size={72} className="text-white/15 absolute" />
        <button className="zazi-tap w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl relative">
          <Play size={26} className="text-zazi-orange fill-zazi-orange ml-1" />
        </button>
        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1">
          <Clock size={11} className="text-white" />
          <span className="text-white text-[11px] font-medium">{lesson.duration} min</span>
        </div>
      </div>

      <div className="px-6 pt-5 flex-1">
        <div className="flex gap-2 mb-2.5">
          <Chip color={pillar.color} icon={<pillar.icon size={11} />}>{pillar.short}</Chip>
          <Chip color="#17283A">Grade {lesson.gradeMin}-{lesson.gradeMax}</Chip>
        </div>
        <h1 className="text-xl font-extrabold text-zazi-navy leading-snug">{lesson.title}</h1>

        {/* Contributor */}
        <div className="flex items-center gap-2.5 mt-4">
          <Avatar avatarId={lesson.avatarId} size="sm" />
          <div>
            <p className="text-zazi-navy font-bold text-sm">{lesson.contributor}</p>
            <p className="text-zazi-navy/45 text-[11px]">{lesson.contributorRole}</p>
          </div>
          {lesson.sponsor && (
            <span className="ml-auto text-[10px] text-zazi-navy/40 text-right">Sponsored by<br /><b className="text-zazi-navy/70">{lesson.sponsor}</b></span>
          )}
        </div>

        {/* About */}
        <div className="mt-5">
          <h3 className="font-extrabold text-zazi-navy text-sm mb-2">About This Lesson</h3>
          <p className="text-zazi-navy/65 text-sm leading-relaxed">{lesson.description}</p>
        </div>

        {/* What you'll learn */}
        <div className="mt-5">
          <h3 className="font-extrabold text-zazi-navy text-sm mb-2.5">What You'll Walk Away Knowing</h3>
          <ul className="space-y-2">
            {lesson.objectives.map((o, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zazi-navy/75">
                <CheckCircle2 size={16} className="text-zazi-teal mt-0.5 flex-shrink-0" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* Resource */}
        <Card className="mt-5 p-3.5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-zazi-teal/10 flex items-center justify-center flex-shrink-0">
            <Download size={18} className="text-zazi-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zazi-navy font-bold text-sm truncate">{lesson.resource.name}</p>
            <p className="text-zazi-navy/40 text-[11px]">{lesson.resource.type} · Lesson resource</p>
          </div>
          <button className="text-zazi-teal text-xs font-bold flex-shrink-0">View</button>
        </Card>

        {/* Take Action */}
        <div className="mt-5 rounded-2xl p-4" style={{ background: '#FF8A0014' }}>
          <p className="text-zazi-orange font-bold text-xs flex items-center gap-1.5 mb-1.5">
            <Zap size={13} className="fill-zazi-orange" /> TAKE ACTION
          </p>
          <p className="text-zazi-navy text-sm leading-relaxed">{lesson.activity}</p>
        </div>

        {/* Discussion */}
        <div className="mt-6">
          <h3 className="font-extrabold text-zazi-navy text-sm mb-2 flex items-center gap-1.5">
            <MessageCircle size={15} /> Discussion
          </h3>
          <p className="text-zazi-navy/60 text-sm italic mb-3">{lesson.discussion}</p>
          <div className="space-y-3 mb-3">
            {DISCUSSION_REPLIES.map(r => (
              <div key={r.id} className="flex gap-2.5">
                <Avatar avatarId={r.avatarId} size="xs" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm p-3 shadow-soft">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-zazi-navy font-bold text-xs">{r.user}</span>
                    <span className="text-zazi-navy/35 text-[10px]">{r.time}</span>
                  </div>
                  <p className="text-zazi-navy/65 text-xs">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Avatar avatarId={user.avatarId} size="xs" />
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm text-zazi-navy placeholder-zazi-navy/40 outline-none shadow-soft"
              placeholder="Share your thoughts..."
            />
          </div>
          <p className="text-zazi-navy/35 text-[11px] mt-2">Comments are moderated to keep this space safe.</p>
        </div>

        {/* Completion */}
        <div className="mt-7 mb-5">
          {done || justCompleted ? (
            <div className="rounded-3xl p-5 text-center" style={{ background: '#00807614' }}>
              <p className="text-zazi-teal font-extrabold text-base">Nice work! 🎉</p>
              <p className="text-zazi-navy/60 text-sm mt-1">You've just taken another step toward your future.</p>
              {nextLesson ? (
                <Button variant="teal" size="sm" className="mt-3" onClick={() => navigate(`/learn/${nextLesson.id}`)}>
                  Next: {nextLesson.title}
                </Button>
              ) : (
                <Button variant="teal" size="sm" className="mt-3" onClick={() => navigate('/learn')}>
                  Browse More Lessons
                </Button>
              )}
            </div>
          ) : (
            <Button variant="primary" size="lg" full onClick={handleComplete}>
              Mark Lesson Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
