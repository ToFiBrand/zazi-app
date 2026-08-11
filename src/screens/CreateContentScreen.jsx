import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkle } from 'lucide-react'
import { CONTENT_TYPES } from '../data/content'
import { useApp } from '../context/AppContext'
import { Card } from '../components/ui'

const COLORS = {
  post: '#006E68',
  video: '#FF8A00',
  story: '#F4B84C',
  challenge: '#E8603C',
  idea: '#0D665F',
}

export default function CreateContentScreen() {
  const navigate = useNavigate()
  const { stats } = useApp()

  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-6 pb-4">
        <button onClick={() => navigate('/home')} className="w-9 h-9 flex items-center justify-center -ml-1.5">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-zazi-navy">What do you want to create?</h1>
          <p className="text-zazi-navy/50 text-xs mt-0.5">Your voice belongs on Zazi</p>
        </div>
      </div>

      {/* Creator stats */}
      <div className="mx-6 rounded-3xl p-5" style={{ background: 'linear-gradient(135deg, #FF8A00, #F4B84C)' }}>
        <p className="text-white font-bold text-sm mb-3">Your Creator Stats</p>
        <div className="flex gap-6">
          {[
            { label: 'Creations', val: stats.creations },
            { label: 'Challenges', val: stats.challengesCompleted },
            { label: 'Lessons Done', val: stats.lessonsCompleted },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-white font-extrabold text-2xl">{s.val}</p>
              <p className="text-white/75 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What to create */}
      <div className="px-6 mt-6">
        <div className="space-y-3">
          {CONTENT_TYPES.map(({ id, label, sub, icon: Icon }) => {
            const color = COLORS[id]
            return (
              <Card
                key={id}
                as="button"
                onClick={() => navigate(`/create/${id}`)}
                className="w-full p-4 flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '16' }}>
                  <Icon size={21} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zazi-navy font-bold text-sm">{label}</p>
                  <p className="text-zazi-navy/50 text-xs mt-0.5">{sub}</p>
                </div>
                <ChevronRight size={17} className="text-zazi-orange flex-shrink-0" />
              </Card>
            )
          })}
        </div>
      </div>

      {/* Creator tip */}
      <div className="mx-6 mt-5 bg-zazi-teal/8 rounded-2xl p-4" style={{ background: '#006E680D' }}>
        <p className="text-zazi-teal font-bold text-xs flex items-center gap-1.5">
          <Sparkle size={13} className="fill-zazi-teal" /> Creator Tip
        </p>
        <p className="text-zazi-navy/60 text-xs mt-1.5 leading-relaxed">
          Every submission is reviewed by the Zazi team before it goes public — that's how we keep this space safe and credible.
        </p>
      </div>
    </div>
  )
}
