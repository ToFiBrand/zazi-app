import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Play, Clock, Download, CheckCircle2, MessageCircle, Zap, SearchX, Sparkles, HelpCircle, Check, X } from 'lucide-react'
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
  const { lessons, topics, quizQuestions, progress, startLesson, completeLesson, submitQuiz, user } = useApp()
  const lesson = lessons.find(l => l.id === lessonId)
  const topic = topics.find(t => t.id === lesson?.topicId)
  const lessonQuiz = useMemo(() => quizQuestions.filter(q => q.lessonId === lessonId).sort((a, b) => a.sortOrder - b.sortOrder), [quizQuestions, lessonId])
  const [justCompleted, setJustCompleted] = useState(false)
  const [videoStarted, setVideoStarted] = useState(false)
  const [comment, setComment] = useState('')
  const [resourceOpen, setResourceOpen] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

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
        <SearchX size={30} className="text-zazi-navy/30 mb-2" />
        <h2 className="text-lg font-extrabold text-zazi-navy">Lesson not found</h2>
        <p className="text-zazi-navy/50 text-sm mt-1">This lesson may have been removed or the link is out of date.</p>
        <Button variant="primary" className="mt-5" onClick={() => navigate('/learn')}>Back to Learn</Button>
      </div>
    )
  }

  const pillar = PILLARS.find(p => p.id === lesson.pillar)
  const done = !!progress[lesson.id]?.completed
  const bodyParagraphs = (lesson.contentBody || lesson.description || '').split('\n\n').filter(Boolean)
  const quizScore = lessonQuiz.filter(q => quizAnswers[q.id] === q.correctIndex).length

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col">
      {/* Hero */}
      <div
        className={`relative w-full flex items-center justify-center flex-shrink-0 overflow-hidden ${lesson.videoUrl && videoStarted ? 'aspect-video bg-black' : ''}`}
        style={lesson.videoUrl && videoStarted ? undefined : { height: 220, background: `linear-gradient(135deg, ${lesson.color}, ${pillar?.color || lesson.color})` }}
      >
        {lesson.videoUrl && videoStarted ? (
          <video src={lesson.videoUrl} controls autoPlay playsInline poster={lesson.coverImageUrl || undefined} className="absolute inset-0 w-full h-full object-contain" />
        ) : (
          <>
            {lesson.coverImageUrl && (
              <img src={lesson.coverImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            {!lesson.coverImageUrl && <pillar.icon size={72} className="text-white/15 absolute" />}
          </>
        )}
        {!(lesson.videoUrl && videoStarted) && (
          <button onClick={() => navigate('/learn')} className="absolute top-4 left-4 w-9 h-9 bg-black/25 backdrop-blur rounded-full flex items-center justify-center z-10">
            <ChevronLeft size={18} className="text-white" />
          </button>
        )}
        {!(lesson.videoUrl && videoStarted) && (
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10">
            <Chip color={pillar.color} tone="solid" icon={<pillar.icon size={11} />}>{pillar.short}</Chip>
            <div className="bg-black/40 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1">
              <Clock size={11} className="text-white" />
              <span className="text-white text-[11px] font-medium">{lesson.duration} min</span>
            </div>
          </div>
        )}
        {lesson.videoUrl && !videoStarted && (
          <button onClick={() => setVideoStarted(true)} className="zazi-tap w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl relative z-10">
            <Play size={26} className="text-zazi-orange fill-zazi-orange ml-1" />
          </button>
        )}
        {!(lesson.videoUrl && videoStarted) && (
          <>
            {/* Scrim keeps the title legible over any cover image */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <h1 className="absolute bottom-4 left-4 right-4 text-white font-extrabold text-xl leading-snug drop-shadow-sm z-10">
              {lesson.title}
            </h1>
          </>
        )}
      </div>
      {lesson.videoUrl && videoStarted && (
        <h1 className="px-6 pt-4 text-zazi-navy font-extrabold text-xl leading-snug">{lesson.title}</h1>
      )}

      <div className="px-6 pt-5 flex-1">
        {topic && (
          <p className="text-zazi-navy/40 text-[11px] font-semibold mb-1.5">{pillar.name} · {topic.name}</p>
        )}
        <div className="flex gap-2 mb-2.5">
          <Chip color="#17283A">Grade {lesson.gradeMin}-{lesson.gradeMax}</Chip>
        </div>
        {lesson.hook && (
          <p className="text-zazi-navy/55 text-sm italic leading-relaxed mt-2">{lesson.hook}</p>
        )}

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

        {/* About / teaching content */}
        <div className="mt-5">
          <h3 className="font-extrabold text-zazi-navy text-sm mb-2">About This Lesson</h3>
          <div className="space-y-3">
            {bodyParagraphs.map((p, i) => (
              <p key={i} className="text-zazi-navy/65 text-sm leading-relaxed">{p}</p>
            ))}
          </div>
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

        {/* Key Takeaways */}
        {lesson.keyTakeaways?.length > 0 && (
          <div className="mt-5 rounded-2xl p-4 bg-zazi-navy">
            <p className="text-zazi-gold font-bold text-xs flex items-center gap-1.5 mb-2.5">
              <Sparkles size={13} /> KEY TAKEAWAYS
            </p>
            <ul className="space-y-2">
              {lesson.keyTakeaways.map((t, i) => (
                <li key={i} className="text-white/80 text-sm leading-relaxed flex gap-2">
                  <span className="text-zazi-gold flex-shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resource */}
        <Card className="mt-5 p-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-zazi-teal/10 flex items-center justify-center flex-shrink-0">
              <Download size={18} className="text-zazi-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-zazi-navy font-bold text-sm truncate">{lesson.resource.name}</p>
              <p className="text-zazi-navy/40 text-[11px]">{lesson.resource.type} · Lesson resource</p>
            </div>
            {lesson.resource.fileUrl && (
              <a href={lesson.resource.fileUrl} target="_blank" rel="noopener noreferrer" className="text-zazi-teal text-xs font-bold flex-shrink-0">
                Download
              </a>
            )}
            {lesson.resource.content && (
              <button onClick={() => setResourceOpen(v => !v)} className="text-zazi-teal text-xs font-bold flex-shrink-0">
                {resourceOpen ? 'Hide' : 'View'}
              </button>
            )}
          </div>
          {resourceOpen && lesson.resource.content && (
            <div className="mt-3.5 pt-3.5 border-t border-gray-100">
              <p className="text-zazi-navy/70 text-xs leading-relaxed whitespace-pre-line">{lesson.resource.content}</p>
            </div>
          )}
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
            <Avatar avatarId={user.avatarId} customization={user.avatarCustomization} size="xs" />
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm text-zazi-navy placeholder-zazi-navy/40 outline-none shadow-soft"
              placeholder="Share your thoughts..."
            />
          </div>
          <p className="text-zazi-navy/35 text-[11px] mt-2">Comments are moderated to keep this space safe.</p>
        </div>

        {/* Checkpoint quiz */}
        {lessonQuiz.length > 0 && (
          <div className="mt-6">
            <h3 className="font-extrabold text-zazi-navy text-sm mb-1 flex items-center gap-1.5">
              <HelpCircle size={15} /> Quick Checkpoint
            </h3>
            <p className="text-zazi-navy/50 text-xs mb-3">See how much stuck — no pressure, just a quick check.</p>
            <div className="space-y-4">
              {lessonQuiz.map((q, qi) => (
                <Card key={q.id} className="p-4">
                  <p className="text-zazi-navy font-bold text-sm mb-3">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = quizAnswers[q.id] === oi
                      const isCorrect = oi === q.correctIndex
                      let style = 'border-gray-200 bg-white text-zazi-navy/80'
                      if (quizSubmitted) {
                        if (isCorrect) style = 'border-zazi-teal bg-zazi-teal/10 text-zazi-teal'
                        else if (selected) style = 'border-zazi-coral bg-zazi-coral/10 text-zazi-coral'
                      } else if (selected) {
                        style = 'border-zazi-orange bg-zazi-orange/10 text-zazi-navy'
                      }
                      return (
                        <button
                          key={oi}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))}
                          className={`w-full text-left text-sm px-3.5 py-2.5 rounded-xl border-2 transition-colors flex items-center justify-between ${style}`}
                        >
                          {opt}
                          {quizSubmitted && isCorrect && <Check size={15} className="flex-shrink-0" />}
                          {quizSubmitted && selected && !isCorrect && <X size={15} className="flex-shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </Card>
              ))}
            </div>
            {!quizSubmitted ? (
              <Button
                variant="teal"
                size="sm"
                className="mt-3"
                disabled={Object.keys(quizAnswers).length < lessonQuiz.length}
                onClick={() => {
                  setQuizSubmitted(true)
                  submitQuiz(lesson.id, quizScore, lessonQuiz.length)
                }}
              >
                Check Answers
              </Button>
            ) : (
              <p className="text-zazi-navy font-bold text-sm mt-3">You got {quizScore} of {lessonQuiz.length} right 🎉</p>
            )}
          </div>
        )}

        {/* Completion */}
        <div className="mt-7 mb-2">
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
        {lesson.completionCriteria && !done && !justCompleted && (
          <p className="text-zazi-navy/35 text-[11px] text-center mb-5">{lesson.completionCriteria}</p>
        )}
      </div>
    </div>
  )
}
