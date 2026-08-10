import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const FIELDS = [
  { label: 'Technology', emoji: '< >', count: '1.2k', color: '#3B9A8C' },
  { label: 'Business', emoji: '💼', count: '980', color: '#E07A2F' },
  { label: 'Creative Arts', emoji: '🎨', count: '756', color: '#7C5CBF' },
  { label: 'Healthcare', emoji: '❤️', count: '1.5k', color: '#e74c3c' },
  { label: 'Science', emoji: '🔬', count: '890', color: '#3B9A8C' },
  { label: 'Finance', emoji: '📈', count: '1.1k', color: '#F0A500' },
  { label: 'Education', emoji: '📖', count: '670', color: '#3B9A8C' },
  { label: 'Engineering', emoji: '🔧', count: '1.3k', color: '#E07A2F' },
]

const TRENDING = [
  { title: 'Software Developer', field: 'Technology', salary: 'R450k – R850k/year', color: '#3B9A8C' },
  { title: 'Data Scientist', field: 'Technology', salary: 'R550k – R950k/year', color: '#3B9A8C' },
  { title: 'UX Designer', field: 'Creative Arts', salary: 'R380k – R720k/year', color: '#7C5CBF' },
  { title: 'Financial Analyst', field: 'Finance', salary: 'R400k – R750k/year', color: '#F0A500' },
]

export default function CareerHubScreen() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      {/* Header */}
      <div
        className="px-5 pt-5 pb-8 rounded-b-3xl"
        style={{ background: 'linear-gradient(135deg, #E07A2F, #F0A500)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate('/home')} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <div>
            <h2 className="text-xl font-black text-white">Career Hub</h2>
            <p className="text-white/70 text-xs">Explore your future possibilities</p>
          </div>
        </div>

        {/* Quiz CTA */}
        <div className="bg-white rounded-2xl p-4 mt-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="bg-zazi-purple/20 text-zazi-purple text-[10px] font-bold px-2 py-0.5 rounded-full">Career Quiz</span>
              <h3 className="text-zazi-navy font-black text-base mt-1">Find Your Path</h3>
              <p className="text-zazi-muted text-xs mt-0.5 mb-3">Take our quiz to discover careers that match your interests</p>
              <button className="bg-zazi-orange text-white font-bold text-sm px-6 py-2.5 rounded-xl">
                Start Quiz
              </button>
            </div>
            <div className="w-10 h-10 bg-zazi-purple/10 rounded-xl flex items-center justify-center text-xl">📖</div>
          </div>
        </div>
      </div>

      {/* Browse by Field */}
      <div className="px-5 mt-5">
        <h3 className="font-black text-zazi-navy text-base mb-3">Browse by Field</h3>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(f => (
            <div key={f.label} className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: f.color + '20' }}
              >
                {f.emoji}
              </div>
              <div>
                <p className="text-zazi-navy font-bold text-sm">{f.label}</p>
                <p className="text-zazi-muted text-[10px]">{f.count} opportunities</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Careers */}
      <div className="px-5 mt-6">
        <h3 className="font-black text-zazi-navy text-base mb-3">Trending Careers</h3>
        <div className="space-y-2">
          {TRENDING.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-card flex items-center justify-between">
              <div>
                <p className="text-zazi-navy font-bold text-sm">{c.title}</p>
                <p className="text-zazi-muted text-[10px]">{c.field}</p>
                <p className="font-semibold text-xs mt-0.5" style={{ color: c.color }}>{c.salary}</p>
              </div>
              <button className="bg-zazi-orange/10 text-zazi-orange text-xs font-semibold px-3 py-1.5 rounded-xl">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
