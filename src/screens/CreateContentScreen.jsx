import { useNavigate } from 'react-router-dom'
import { ChevronLeft, FileText, Video, Sparkles, Trophy, Lightbulb, ChevronRight } from 'lucide-react'
import { CONTENT_TYPES } from '../data/content'
import { useApp } from '../context/AppContext'

const ICONS = { post: FileText, video: Video, story: Sparkles, challenge: Trophy, idea: Lightbulb }
const COLORS = {
  post: { color: '#3B9A8C', bg: '#3B9A8C20' },
  video: { color: '#E07A2F', bg: '#E07A2F20' },
  story: { color: '#7C5CBF', bg: '#7C5CBF20' },
  challenge: { color: '#F0A500', bg: '#F0A50020' },
  idea: { color: '#2D7A6E', bg: '#2D7A6E20' },
}

export default function CreateContentScreen() {
  const navigate = useNavigate()
  const { stats } = useApp()

  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-4">
        <button onClick={() => navigate('/home')} className="w-8 h-8 flex items-center">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h2 className="text-xl font-black text-zazi-navy">What do you want to create?</h2>
          <p className="text-zazi-muted text-xs">Your voice belongs on Zazi</p>
        </div>
      </div>

      {/* Creator stats */}
      <div className="mx-5 rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #E07A2F, #F0A500)' }}>
        <p className="text-white font-bold text-sm mb-3">Your Creator Stats</p>
        <div className="flex gap-6">
          {[
            { label: 'Creations', val: stats.creations },
            { label: 'Challenges', val: stats.challengesCompleted },
            { label: 'Lessons Done', val: stats.lessonsCompleted },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-white font-black text-2xl">{s.val}</p>
              <p className="text-white/70 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What to create */}
      <div className="px-5 mt-6">
        <div className="space-y-3">
          {CONTENT_TYPES.map(({ id, label, sub, emoji }) => {
            const Icon = ICONS[id]
            const { color, bg } = COLORS[id]
            return (
              <button
                key={id}
                onClick={() => navigate(`/create/${id}`)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-card"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-zazi-navy font-bold text-sm">{emoji} {label}</p>
                  <p className="text-zazi-muted text-xs">{sub}</p>
                </div>
                <ChevronRight size={16} className="text-zazi-orange" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Creator tip */}
      <div className="mx-5 mt-5 bg-zazi-teal/10 rounded-2xl p-4">
        <p className="text-zazi-teal font-bold text-xs flex items-center gap-1">
          <span>💡</span> Creator Tip
        </p>
        <p className="text-zazi-navy/70 text-xs mt-1">
          Every submission is reviewed by the Zazi team before it goes public — that's how we keep this space safe and credible.
        </p>
      </div>
    </div>
  )
}
