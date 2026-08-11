import { Users, TrendingUp, Award, School as SchoolIcon, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PILLARS } from '../data/pillars'
import { SCHOOLS } from '../data/schools'

const GRADES = [7, 8, 9, 10, 11, 12]

export default function SponsorDashboard() {
  const { publishedLessons } = useApp()

  const sponsoredLessons = publishedLessons.filter(l => l.sponsor === 'Standard Bank')

  const pillarImpact = PILLARS.map(p => {
    const pillarLessons = publishedLessons.filter(l => l.pillar === p.id)
    const learners = pillarLessons.reduce((sum, l) => sum + l.completions * 6, 0)
    return { ...p, learners, lessons: pillarLessons.length }
  })
  const maxPillarLearners = Math.max(1, ...pillarImpact.map(p => p.learners))

  const gradeImpact = GRADES.map(g => {
    const gradeLessons = publishedLessons.filter(l => g >= l.gradeMin && g <= l.gradeMax)
    const learners = gradeLessons.reduce((sum, l) => sum + l.completions * 4, 0)
    return { grade: g, learners }
  })
  const maxGradeLearners = Math.max(1, ...gradeImpact.map(g => g.learners))

  const totalLearners = pillarImpact.reduce((sum, p) => sum + p.learners, 0)
  const totalCompletions = publishedLessons.reduce((sum, l) => sum + l.completions, 0)
  const totalViews = publishedLessons.reduce((sum, l) => sum + l.views, 0)
  const engagementRate = totalViews ? Math.round((totalCompletions / totalViews) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 rounded-none md:rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center">
            <span className="text-white font-black text-lg">SB</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-zazi-navy">Standard Bank</h1>
            <p className="text-zazi-muted text-sm">Financial Literacy Pillar Sponsorship · Reporting: Q3 2026</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-zazi-orange text-white font-bold text-sm px-4 py-2.5 rounded-xl">
          <Download size={16} />
          Download Report
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Learners Reached',    val: totalLearners.toLocaleString(), icon: Users,     color: '#006E68' },
          { label: 'Schools Reached',     val: SCHOOLS.length,                 icon: SchoolIcon,color: '#F4B84C' },
          { label: 'Lesson Completions',  val: totalCompletions.toLocaleString(), icon: Award,   color: '#FF8A00' },
          { label: 'Engagement Rate',     val: `${engagementRate}%`,           icon: TrendingUp,color: '#0D665F' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 shadow-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: k.color + '20' }}>
              <k.icon size={20} style={{ color: k.color }} />
            </div>
            <p className="text-3xl font-black text-zazi-navy">{k.val}</p>
            <p className="text-zazi-muted text-xs mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Impact by Pillar / Grade */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-base mb-4">Impact by Learning Pillar</h3>
          <div className="space-y-3">
            {pillarImpact.map(p => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-zazi-navy text-sm font-medium flex items-center gap-1.5"><p.icon size={13} style={{ color: p.color }} />{p.short}</span>
                  <span className="text-zazi-muted text-[10px]">{p.learners.toLocaleString()} learners</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(p.learners / maxPillarLearners) * 100}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-base mb-4">Impact by Grade</h3>
          <div className="flex items-end gap-2" style={{ height: 140 }}>
            {gradeImpact.map(g => (
              <div key={g.grade} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg"
                  style={{ height: `${(g.learners / maxGradeLearners) * 110}px`, background: 'linear-gradient(to top, #FF8A00, #F4B84C)', minHeight: 8 }}
                />
                <span className="text-[9px] text-zazi-muted">Gr {g.grade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsored Content */}
      <div className="bg-white rounded-2xl p-5 shadow-card mb-6">
        <h3 className="font-black text-zazi-navy text-base mb-4">Sponsored Content</h3>
        {sponsoredLessons.length === 0 ? (
          <p className="text-zazi-muted text-sm text-center py-4">No sponsored lessons live yet.</p>
        ) : (
          <div className="space-y-2">
            {sponsoredLessons.map(l => (
              <div key={l.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-zazi-navy font-bold text-sm">{l.title}</p>
                  <p className="text-zazi-muted text-xs">Grade {l.gradeMin}-{l.gradeMax} · {l.duration} min</p>
                </div>
                <div className="text-right">
                  <p className="text-zazi-navy font-bold text-sm">{l.views.toLocaleString()} views</p>
                  <p className="text-zazi-teal text-xs font-semibold">{l.completions} completions</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* School Reach */}
      <div className="bg-white rounded-2xl p-5 shadow-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-zazi-navy text-base">School Reach</h3>
          <span className="text-zazi-muted text-sm">{SCHOOLS.length} schools, all 9 provinces</span>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          {SCHOOLS.map(s => (
            <div key={s.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
              <span className="text-zazi-navy text-sm font-medium">{s.name}</span>
              <span className="text-zazi-muted text-xs">{s.province}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact summary */}
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1C2B3A, #2D3F52)' }}>
        <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Quarter Summary</p>
        <p className="font-black text-xl mb-1">Building Financial Confidence, One Learner at a Time</p>
        <p className="text-white/70 text-sm mb-4">
          Your sponsorship of Zazi's Financial Literacy pillar has reached {totalLearners.toLocaleString()} learners across {SCHOOLS.length} schools,
          with {totalCompletions.toLocaleString()} lesson completions this quarter.
        </p>
        <button className="bg-zazi-orange text-white font-bold text-sm px-5 py-2.5 rounded-xl">
          Download Full Report
        </button>
      </div>
    </div>
  )
}
