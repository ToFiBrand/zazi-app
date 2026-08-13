import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkle } from 'lucide-react'
import { CONTENT_TYPES } from '../data/content'
import { useApp } from '../context/AppContext'
import { Card } from '../components/ui'

export default function CreateContentScreen() {
  const navigate = useNavigate()
  const { stats } = useApp()

  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      {/* Hero — hook question this screen answers */}
      <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
        <img src="/hero/create-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zazi-cream via-zazi-cream/15 to-transparent" />
        <button onClick={() => navigate('/home')} className="absolute top-5 left-5 w-9 h-9 bg-black/25 backdrop-blur rounded-full flex items-center justify-center z-10">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div className="absolute bottom-5 left-6 right-6 z-10">
          <h1 className="text-white text-2xl font-extrabold leading-tight drop-shadow-sm">What do you want to create?</h1>
          <p className="text-white/80 text-xs mt-1 drop-shadow-sm">Your voice. Your ideas. Your creativity. Your story.</p>
        </div>
      </div>

      {/* Creator stats */}
      <div className="mx-6 mt-4 rounded-3xl p-5" style={{ background: 'linear-gradient(135deg, #FF8A00, #F4B84C)' }}>
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
          {CONTENT_TYPES.map(({ id, label, sub, icon: Icon, color }) => {
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
