import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const INTERESTS = [
  { id: 'career',   label: 'Career Development', emoji: '💼', color: '#E07A2F' },
  { id: 'tech',     label: 'Tech & Coding',       emoji: '< >', color: '#3B9A8C' },
  { id: 'health',   label: 'Mental Health',       emoji: '💜', color: '#7C5CBF' },
  { id: 'poetry',   label: 'Poetry & Writing',    emoji: '✍️', color: '#E07A2F' },
  { id: 'biz',      label: 'Entrepreneurship',    emoji: '📈', color: '#F0A500' },
  { id: 'news',     label: 'Youth News',          emoji: '📰', color: '#3B9A8C' },
  { id: 'finance',  label: 'Financial Literacy',  emoji: '💰', color: '#F0A500' },
  { id: 'science',  label: 'Science & Maths',     emoji: '🔬', color: '#3B9A8C' },
]

export default function InterestsScreen() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(['career', 'tech'])

  const toggle = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div className="min-h-screen md:min-h-0 bg-zazi-cream flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button onClick={() => navigate('/signup')} className="flex items-center gap-1 text-zazi-navy">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => navigate('/home')} className="text-zazi-orange text-sm font-semibold">Skip</button>
      </div>

      <div className="px-5">
        <h1 className="text-2xl font-black text-zazi-navy mt-2">What interests you?</h1>
        <p className="text-zazi-muted text-sm mt-1">Select topics you'd like to explore (choose at least 3)</p>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-zazi-orange rounded-full transition-all"
              style={{ width: `${(selected.length / 6) * 100}%` }}
            />
          </div>
          <span className="text-xs text-zazi-muted font-medium">{selected.length}/6</span>
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-3 flex-1">
        {INTERESTS.map(({ id, label, emoji, color }) => {
          const on = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className="relative bg-white rounded-2xl p-4 flex flex-col items-start gap-3 text-left border-2 transition-all"
              style={{ borderColor: on ? color : 'transparent' }}
            >
              {/* Check badge */}
              {on && (
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: color }}
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: color + '20' }}
              >
                {emoji}
              </div>
              <span className="text-zazi-navy font-bold text-sm leading-tight">{label}</span>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="px-5 mt-6">
        <button
          onClick={() => navigate('/home')}
          disabled={selected.length < 3}
          className={`w-full font-bold py-4 rounded-2xl text-base transition-all ${
            selected.length >= 3
              ? 'bg-zazi-orange text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
