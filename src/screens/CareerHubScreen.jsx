import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Code2, Briefcase, Palette, HeartPulse, FlaskConical, TrendingUp, BookOpen, Wrench, Compass } from 'lucide-react'
import { Card, Button, Chip } from '../components/ui'

const FIELDS = [
  { label: 'Technology', icon: Code2, count: '1.2k', color: '#006E68' },
  { label: 'Business', icon: Briefcase, count: '980', color: '#FF8A00' },
  { label: 'Creative Arts', icon: Palette, count: '756', color: '#0D665F' },
  { label: 'Healthcare', icon: HeartPulse, count: '1.5k', color: '#E8603C' },
  { label: 'Science', icon: FlaskConical, count: '890', color: '#006E68' },
  { label: 'Finance', icon: TrendingUp, count: '1.1k', color: '#F4B84C' },
  { label: 'Education', icon: BookOpen, count: '670', color: '#5F9770' },
  { label: 'Engineering', icon: Wrench, count: '1.3k', color: '#FF8A00' },
]

const TRENDING = [
  { title: 'Software Developer', field: 'Technology', salary: 'R450k – R850k/year', color: '#006E68' },
  { title: 'Data Scientist', field: 'Technology', salary: 'R550k – R950k/year', color: '#006E68' },
  { title: 'UX Designer', field: 'Creative Arts', salary: 'R380k – R720k/year', color: '#0D665F' },
  { title: 'Financial Analyst', field: 'Finance', salary: 'R400k – R750k/year', color: '#F4B84C' },
]

export default function CareerHubScreen() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      {/* Header */}
      <div
        className="px-6 pt-6 pb-8 rounded-b-[2rem]"
        style={{ background: 'linear-gradient(135deg, #FF8A00, #F4B84C)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/home')} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white">Career Hub</h1>
            <p className="text-white/75 text-xs">Explore your future possibilities</p>
          </div>
        </div>

        {/* Quiz CTA */}
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Chip color="#0D665F">Career Quiz</Chip>
              <h3 className="text-zazi-navy font-extrabold text-base mt-1.5">Find Your Path</h3>
              <p className="text-zazi-navy/50 text-xs mt-0.5 mb-3">Take our quiz to discover careers that match your interests</p>
              <Button variant="primary" size="sm">Start Quiz</Button>
            </div>
            <div className="w-11 h-11 bg-zazi-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Compass size={20} className="text-zazi-teal" />
            </div>
          </div>
        </Card>
      </div>

      {/* Browse by Field */}
      <div className="px-6 mt-6">
        <h3 className="font-extrabold text-zazi-navy text-base mb-3">Browse by Field</h3>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(f => (
            <Card key={f.label} className="p-4 flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: f.color + '16' }}
              >
                <f.icon size={19} style={{ color: f.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-zazi-navy font-bold text-sm leading-tight">{f.label}</p>
                <p className="text-zazi-navy/40 text-[10px] mt-0.5">{f.count} opportunities</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Careers */}
      <div className="px-6 mt-6">
        <h3 className="font-extrabold text-zazi-navy text-base mb-3">Trending Careers</h3>
        <div className="space-y-2.5">
          {TRENDING.map((c, i) => (
            <Card key={i} className="px-4 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-zazi-navy font-bold text-sm">{c.title}</p>
                <p className="text-zazi-navy/40 text-[10px]">{c.field}</p>
                <p className="font-bold text-xs mt-0.5" style={{ color: c.color }}>{c.salary}</p>
              </div>
              <button className="bg-zazi-orange/10 text-zazi-orange text-xs font-bold px-3.5 py-2 rounded-full flex-shrink-0">
                Learn More
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
