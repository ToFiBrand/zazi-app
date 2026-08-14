import { useEffect, useMemo, useState } from 'react'
import { GraduationCap, FileText, Users, School, MapPin, TrendingUp, Eye, CheckCircle2, Heart, UserPlus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PILLARS } from '../../data/pillars'

const GRADES = [7, 8, 9, 10, 11, 12]

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay() || 7
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - day + 1)
  return d
}

function weekLabel(date) {
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

function StatCard({ label, val, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: color + '20' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <p className="text-2xl font-black text-zazi-navy">{val}</p>
      <p className="text-zazi-muted text-xs mt-0.5">{label}</p>
    </div>
  )
}

function BarRow({ label, count, max, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-zazi-navy text-xs font-medium">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{count}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${max ? (count / max) * 100 : 0}%`, background: color }} />
      </div>
    </div>
  )
}

function RankedList({ items, valueLabel, icon: Icon, color }) {
  if (items.length === 0) return <p className="text-zazi-muted text-xs">Nothing published yet.</p>
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-3">
          <span className="w-5 text-zazi-muted text-xs font-bold flex-shrink-0">{i + 1}</span>
          <span className="flex-1 min-w-0 text-zazi-navy text-sm font-semibold truncate">{item.title}</span>
          <span className="flex items-center gap-1 text-xs font-bold flex-shrink-0" style={{ color }}>
            <Icon size={11} /> {item.value} {valueLabel}
          </span>
        </div>
      ))}
    </div>
  )
}

// Demographics come only from what this app already, deliberately,
// collects — grade and school (which gives province/district via the
// schools table). No names/emails/contact info are fetched or shown here;
// profiles.js's own comment states that exclusion is intentional, for
// safeguarding minors, and this dashboard keeps to that line.
export default function AnalyticsDashboard({ publishedLessons, publishedContributions, schools, totalPending }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    supabase.from('profiles').select('grade, school_id, role, created_at').then(({ data, error }) => {
      if (!cancelled && !error) setProfiles(data || [])
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const students = useMemo(() => profiles.filter(p => p.role === 'student'), [profiles])

  const gradeData = useMemo(() => {
    return GRADES.map(g => ({ label: `Grade ${g}`, count: students.filter(p => p.grade === g).length }))
  }, [students])
  const maxGrade = Math.max(1, ...gradeData.map(g => g.count))

  const schoolsById = useMemo(() => Object.fromEntries(schools.map(s => [s.id, s])), [schools])

  const provinceData = useMemo(() => {
    const counts = {}
    for (const p of students) {
      const province = schoolsById[p.school_id]?.province || 'Unknown'
      counts[province] = (counts[province] || 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }))
  }, [students, schoolsById])
  const maxProvince = Math.max(1, ...provinceData.map(p => p.count))

  const topSchools = useMemo(() => {
    const counts = {}
    for (const p of students) {
      if (!p.school_id) continue
      counts[p.school_id] = (counts[p.school_id] || 0) + 1
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([schoolId, count]) => ({ id: schoolId, title: schoolsById[schoolId]?.name || 'Unknown school', value: count }))
  }, [students, schoolsById])

  const signupData = useMemo(() => {
    const weeks = []
    const now = new Date()
    for (let i = 7; i >= 0; i--) {
      const start = startOfWeek(new Date(now.getTime() - i * 7 * 86400000))
      const end = new Date(start.getTime() + 7 * 86400000)
      const count = profiles.filter(p => {
        const created = new Date(p.created_at)
        return created >= start && created < end
      }).length
      weeks.push({ label: weekLabel(start), count })
    }
    return weeks
  }, [profiles])
  const maxSignup = Math.max(1, ...signupData.map(w => w.count))

  const roleData = useMemo(() => {
    const counts = {}
    for (const p of profiles) counts[p.role] = (counts[p.role] || 0) + 1
    return counts
  }, [profiles])

  const CAT_DATA = PILLARS.map(p => {
    const count = publishedContributions.filter(c => c.pillar === p.id).length + publishedLessons.filter(l => l.pillar === p.id).length
    return { label: p.short, color: p.color, count }
  })
  const maxCat = Math.max(1, ...CAT_DATA.map(c => c.count))

  const topByViews = useMemo(() =>
    [...publishedLessons].sort((a, b) => b.views - a.views).slice(0, 5).map(l => ({ id: l.id, title: l.title, value: l.views })),
    [publishedLessons])

  const topByCompletions = useMemo(() =>
    [...publishedLessons].sort((a, b) => b.completions - a.completions).slice(0, 5).map(l => ({ id: l.id, title: l.title, value: l.completions })),
    [publishedLessons])

  const topContent = useMemo(() =>
    [...publishedContributions].sort((a, b) => b.likes - a.likes).slice(0, 5).map(c => ({ id: c.id, title: c.title, value: c.likes })),
    [publishedContributions])

  const pillarCompletionRates = useMemo(() => {
    return PILLARS.map(p => {
      const pillarLessons = publishedLessons.filter(l => l.pillar === p.id)
      const totalViews = pillarLessons.reduce((s, l) => s + l.views, 0)
      const totalCompletions = pillarLessons.reduce((s, l) => s + l.completions, 0)
      const rate = totalViews > 0 ? Math.round((totalCompletions / totalViews) * 100) : 0
      return { label: p.short, color: p.color, count: rate }
    })
  }, [publishedLessons])
  const maxRate = 100

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-zazi-navy">Analytics Dashboard</h1>
        <p className="text-zazi-muted text-sm">Platform overview, learner demographics and content performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Lessons" val={publishedLessons.length} icon={GraduationCap} color="#006E68" />
        <StatCard label="Contributions" val={publishedContributions.length} icon={FileText} color="#FF8A00" />
        <StatCard label="Pending Moderation" val={totalPending} icon={Users} color="#0D665F" />
        <StatCard label="Schools" val={schools.length} icon={School} color="#F4B84C" />
        <StatCard label="Students" val={loading ? '—' : students.length} icon={UserPlus} color="#5F9770" />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-sm mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {gradeData.map(g => <BarRow key={g.label} label={g.label} count={g.count} max={maxGrade} color="#FF8A00" />)}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-sm mb-4 flex items-center gap-1.5"><MapPin size={14} className="text-zazi-teal" /> By Province</h3>
          {provinceData.length === 0 ? (
            <p className="text-zazi-muted text-xs">No student data yet.</p>
          ) : (
            <div className="space-y-3">
              {provinceData.map(p => <BarRow key={p.label} label={p.label} count={p.count} max={maxProvince} color="#006E68" />)}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-sm mb-4 flex items-center gap-1.5"><TrendingUp size={14} className="text-zazi-orange" /> Signups — Last 8 Weeks</h3>
          <div className="flex items-end gap-2 h-28">
            {signupData.map(w => (
              <div key={w.label} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                <span className="text-zazi-navy text-[10px] font-bold">{w.count}</span>
                <div className="w-full rounded-t-md bg-zazi-orange" style={{ height: `${Math.max(4, (w.count / maxSignup) * 90)}px` }} />
                <span className="text-zazi-muted text-[9px]">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-sm mb-4">Top Schools by Students</h3>
          <RankedList items={topSchools} valueLabel="" icon={Users} color="#0D665F" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-card mb-5">
        <h3 className="font-black text-zazi-navy text-sm mb-4">Content & Lessons by Pillar</h3>
        <div className="space-y-3">
          {CAT_DATA.map(c => <BarRow key={c.label} label={c.label} count={c.count} max={maxCat} color={c.color} />)}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-sm mb-4 flex items-center gap-1.5"><Eye size={14} className="text-zazi-orange" /> Most Viewed Lessons</h3>
          <RankedList items={topByViews} valueLabel="views" icon={Eye} color="#FF8A00" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-sm mb-4 flex items-center gap-1.5"><CheckCircle2 size={14} className="text-zazi-teal" /> Most Completed Lessons</h3>
          <RankedList items={topByCompletions} valueLabel="completions" icon={CheckCircle2} color="#006E68" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-sm mb-4 flex items-center gap-1.5"><Heart size={14} className="text-zazi-coral" /> Most Liked Community Content</h3>
          <RankedList items={topContent} valueLabel="likes" icon={Heart} color="#E8603C" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-black text-zazi-navy text-sm mb-4">Completion Rate by Pillar</h3>
          <div className="space-y-3">
            {pillarCompletionRates.map(p => <BarRow key={p.label} label={p.label} count={p.count} max={maxRate} color={p.color} />)}
          </div>
        </div>
      </div>

      <p className="text-zazi-muted text-[11px] mt-1">
        Demographics use only grade and school data — Zazi doesn't collect names, emails or contact details for students, by design.
      </p>
    </>
  )
}
