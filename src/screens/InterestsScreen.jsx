import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Briefcase, Code2, HeartHandshake, PenLine, TrendingUp, Newspaper, PiggyBank, FlaskConical, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { useApp } from '../context/AppContext'

const INTERESTS = [
  { id: 'career',  label: 'Career Development', icon: Briefcase,      color: '#FF8A00' },
  { id: 'tech',    label: 'Tech & Coding',       icon: Code2,          color: '#006E68' },
  { id: 'health',  label: 'Mental Health',       icon: HeartHandshake, color: '#E8603C' },
  { id: 'poetry',  label: 'Poetry & Writing',    icon: PenLine,        color: '#DE9E2E' },
  { id: 'biz',     label: 'Entrepreneurship',    icon: TrendingUp,     color: '#0D665F' },
  { id: 'news',    label: 'Youth News',          icon: Newspaper,      color: '#5F9770' },
  { id: 'finance', label: 'Financial Literacy',  icon: PiggyBank,      color: '#F4B84C' },
  { id: 'science', label: 'Science & Maths',     icon: FlaskConical,   color: '#006E68' },
]

export default function InterestsScreen() {
  const navigate = useNavigate()
  const { updateInterests } = useApp()
  const [selected, setSelected] = useState(['career', 'tech'])
  const [submitting, setSubmitting] = useState(false)

  const toggle = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const handleContinue = async () => {
    setSubmitting(true)
    await updateInterests(selected)
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col pb-8 md:max-w-lg md:mx-auto md:w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <button onClick={() => navigate('/signup')} className="flex items-center gap-1 text-zazi-navy">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => navigate('/home')} className="text-zazi-orange text-sm font-semibold">Skip</button>
      </div>

      <div className="px-6">
        <h1 className="text-2xl font-extrabold text-zazi-navy mt-2">What interests you?</h1>
        <p className="text-zazi-navy/60 text-sm mt-1">Select topics you'd like to explore (choose at least 3)</p>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-2">
          <ProgressBar pct={(selected.length / 6) * 100} color="#FF8A00" />
          <span className="text-xs text-zazi-navy/50 font-semibold whitespace-nowrap">{selected.length}/6</span>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 mt-5 grid grid-cols-2 gap-3 flex-1">
        {INTERESTS.map(({ id, label, icon: Icon, color }) => {
          const on = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className="zazi-tap relative bg-white rounded-2xl p-4 flex flex-col items-start gap-3 text-left border-2 transition-all"
              style={{ borderColor: on ? color : 'transparent' }}
            >
              {on && (
                <div
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: color }}
                >
                  <Check size={13} strokeWidth={3} className="text-white" />
                </div>
              )}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: color + '1A' }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-zazi-navy font-bold text-sm leading-tight">{label}</span>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="px-6 mt-6">
        <Button variant="primary" size="lg" full onClick={handleContinue} disabled={selected.length < 3 || submitting}>
          {submitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
