import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, CheckCircle2 } from 'lucide-react'
import { PILLARS } from '../data/pillars'

export default function ContributorApplicationScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [org, setOrg] = useState('')
  const [pillar, setPillar] = useState(PILLARS[0].id)
  const [experience, setExperience] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = name.trim() && role.trim() && experience.trim()

  if (submitted) {
    return (
      <div className="min-h-screen bg-zazi-cream flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 bg-zazi-teal/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-zazi-teal" />
        </div>
        <h2 className="text-xl font-black text-zazi-navy">Application submitted</h2>
        <p className="text-zazi-navy/70 text-sm mt-2 leading-relaxed">
          Thanks for wanting to contribute to Zazi. Our team reviews every application before granting publishing access — we'll be in touch soon.
        </p>
        <button onClick={() => navigate('/home')} className="mt-6 bg-zazi-orange text-white font-bold py-3.5 px-8 rounded-2xl text-sm">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate('/profile')} className="w-8 h-8 flex items-center">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zazi-navy">Become a Contributor</h1>
          <p className="text-zazi-muted text-xs">Share your expertise with young South Africans</p>
        </div>
      </div>

      <div className="px-5 space-y-4">
        <div>
          <label className="block text-zazi-navy font-semibold text-sm mb-1.5">Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40" />
        </div>
        <div>
          <label className="block text-zazi-navy font-semibold text-sm mb-1.5">Professional Role</label>
          <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Software Engineer, Teacher, Banker"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40" />
        </div>
        <div>
          <label className="block text-zazi-navy font-semibold text-sm mb-1.5">Organisation</label>
          <input value={org} onChange={e => setOrg(e.target.value)} placeholder="Company or school name"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40" />
        </div>
        <div>
          <label className="block text-zazi-navy font-semibold text-sm mb-1.5">Area of Expertise</label>
          <div className="relative">
            <select value={pillar} onChange={e => setPillar(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40">
              {PILLARS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-zazi-navy font-semibold text-sm mb-1.5">Experience & Qualifications</label>
          <textarea value={experience} onChange={e => setExperience(e.target.value)} rows={4}
            placeholder="Tell us about your background and why you want to contribute..."
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40 resize-none" />
        </div>

        <div className="bg-zazi-navy/5 rounded-xl px-4 py-3">
          <p className="text-zazi-navy/70 text-xs leading-relaxed">
            Approved contributors get a dashboard to create lessons. Every first lesson still goes through Zazi review before publishing.
          </p>
        </div>

        <button
          onClick={() => canSubmit && setSubmitted(true)}
          disabled={!canSubmit}
          className={`w-full font-black py-4 rounded-2xl text-base transition-all ${
            canSubmit ? 'bg-zazi-orange text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Application
        </button>
      </div>
    </div>
  )
}
