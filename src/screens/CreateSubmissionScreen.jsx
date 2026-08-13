import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, ChevronDown, ImagePlus, CheckCircle2 } from 'lucide-react'
import { CONTENT_TYPES } from '../data/content'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui'

export default function CreateSubmissionScreen() {
  const navigate = useNavigate()
  const { type } = useParams()
  const { user, school, submitContribution } = useApp()
  const typeInfo = CONTENT_TYPES.find(t => t.id === type) || CONTENT_TYPES[0]

  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState(PILLARS[0].id)
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = title.trim().length > 2 && description.trim().length > 5 && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    const result = await submitContribution({
      title: title.trim(),
      type: typeInfo.id,
      pillar,
      description: description.trim(),
      gradeMin: user.grade,
      gradeMax: user.grade,
    })
    setSubmitting(false)
    if (result) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zazi-cream flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 bg-zazi-teal/12 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-zazi-teal" />
        </div>
        <h2 className="text-xl font-extrabold text-zazi-navy">Your creation has been submitted to Zazi.</h2>
        <p className="text-zazi-navy/60 text-sm mt-2 leading-relaxed">
          Once reviewed, it may appear in the Zazi community.
        </p>
        <Button variant="primary" className="mt-6" onClick={() => navigate('/home')}>
          Back to Home
        </Button>
        <button
          onClick={() => navigate('/profile')}
          className="mt-1 text-zazi-navy/50 font-semibold py-2 px-8 rounded-2xl text-sm"
        >
          View My Submissions
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zazi-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/create')} className="w-9 h-9 flex items-center justify-center">
            <X size={20} className="text-zazi-navy" />
          </button>
          <h2 className="text-base font-extrabold text-zazi-navy flex items-center gap-1.5">
            <typeInfo.icon size={16} className="text-zazi-orange" /> New {typeInfo.label}
          </h2>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Media placeholder */}
        <div>
          <label className="block text-zazi-navy font-bold text-sm mb-2">
            {typeInfo.id === 'video' ? 'Video' : typeInfo.id === 'podcast' ? 'Audio (optional)' : 'Cover Image (optional)'}
          </label>
          <div className="border-2 border-dashed border-zazi-orange/40 rounded-2xl p-6 flex flex-col items-center gap-2 bg-zazi-orange/5">
            <div className="w-12 h-12 bg-zazi-orange/15 rounded-full flex items-center justify-center">
              <ImagePlus size={20} className="text-zazi-orange" />
            </div>
            <p className="text-zazi-navy font-bold text-sm">
              {typeInfo.id === 'video' ? 'Upload your video' : 'Add media'}
            </p>
            <p className="text-zazi-navy/45 text-xs">MP4, JPG or PNG up to 100MB</p>
            <Button variant="primary" size="sm" className="mt-1">Choose File</Button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-zazi-navy font-bold text-sm mb-1.5">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-zazi-navy placeholder-zazi-muted outline-none focus:ring-2 focus:ring-zazi-orange/30"
            placeholder="Give it a title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-zazi-navy font-bold text-sm mb-1.5">
            {typeInfo.id === 'idea' ? 'Describe your idea' : 'Description'}
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-zazi-navy placeholder-zazi-muted outline-none focus:ring-2 focus:ring-zazi-orange/30 resize-none"
            placeholder="Tell the Zazi community about it..."
          />
        </div>

        {/* Pillar */}
        <div>
          <label className="block text-zazi-navy font-bold text-sm mb-1.5">Learning Pillar</label>
          <div className="relative">
            <select
              value={pillar}
              onChange={e => setPillar(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-zazi-navy text-sm outline-none"
            >
              {PILLARS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
          </div>
        </div>

        {/* School (read-only) */}
        <div className="bg-zazi-input-bg rounded-2xl px-4 py-3.5 flex items-center justify-between">
          <span className="text-zazi-navy/50 text-sm">School</span>
          <span className="text-zazi-navy font-semibold text-sm">{school?.name}</span>
        </div>

        {/* Moderation notice */}
        <div className="bg-zazi-navy/5 rounded-2xl px-4 py-3.5">
          <p className="text-zazi-navy/60 text-xs leading-relaxed">
            Your submission will be reviewed by the Zazi team before it appears publicly. This keeps Zazi safe for everyone.
          </p>
        </div>

        <Button variant="primary" size="lg" full onClick={handleSubmit} disabled={!canSubmit}>
          {submitting ? 'Submitting...' : 'Submit for Review'}
        </Button>
      </div>
    </div>
  )
}
