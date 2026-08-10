import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, ChevronDown, ImagePlus, CheckCircle2 } from 'lucide-react'
import { CONTENT_TYPES } from '../data/content'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'

export default function CreateSubmissionScreen() {
  const navigate = useNavigate()
  const { type } = useParams()
  const { user, school, submitContent } = useApp()
  const typeInfo = CONTENT_TYPES.find(t => t.id === type) || CONTENT_TYPES[0]

  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState(PILLARS[0].id)
  const [description, setDescription] = useState('')
  const [isChallengeResponse, setIsChallengeResponse] = useState(typeInfo.id === 'challenge')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = title.trim().length > 2 && description.trim().length > 5

  const handleSubmit = () => {
    if (!canSubmit) return
    const pillarInfo = PILLARS.find(p => p.id === pillar)
    submitContent({
      title: title.trim(),
      type: typeInfo.id,
      pillar,
      category: pillar,
      description: description.trim(),
      color: pillarInfo?.color || '#E07A2F',
      school: school?.name,
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zazi-cream flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 bg-zazi-teal/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-zazi-teal" />
        </div>
        <h2 className="text-xl font-black text-zazi-navy">Your story has been submitted.</h2>
        <p className="text-zazi-navy/70 text-sm mt-2 leading-relaxed">
          Your creation is now being reviewed by the Zazi team. We'll let you know as soon as it's live.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="mt-6 bg-zazi-orange text-white font-bold py-3.5 px-8 rounded-2xl text-sm"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="mt-2 text-zazi-navy/60 font-semibold py-2 px-8 rounded-2xl text-sm"
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
          <button onClick={() => navigate('/create')} className="w-8 h-8 flex items-center justify-center">
            <X size={20} className="text-zazi-navy" />
          </button>
          <h2 className="text-base font-black text-zazi-navy">New {typeInfo.label} {typeInfo.emoji}</h2>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Media placeholder */}
        <div>
          <label className="block text-zazi-navy font-bold text-sm mb-2">
            {typeInfo.id === 'video' ? 'Video' : typeInfo.id === 'post' ? 'Image (optional)' : 'Cover Image (optional)'}
          </label>
          <div className="border-2 border-dashed border-zazi-orange/50 rounded-2xl p-6 flex flex-col items-center gap-2 bg-zazi-orange/5">
            <div className="w-12 h-12 bg-zazi-orange/20 rounded-full flex items-center justify-center">
              <ImagePlus size={20} className="text-zazi-orange" />
            </div>
            <p className="text-zazi-navy font-bold text-sm">
              {typeInfo.id === 'video' ? 'Upload your video' : 'Add media'}
            </p>
            <p className="text-zazi-muted text-xs">MP4, JPG or PNG up to 100MB</p>
            <button className="bg-zazi-orange text-white font-bold text-sm px-5 py-2 rounded-xl mt-1">Choose File</button>
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

        {/* Challenge toggle */}
        <label className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-card cursor-pointer">
          <span className="text-zazi-navy font-semibold text-sm">This is a response to a Zazi Challenge</span>
          <button
            type="button"
            onClick={() => setIsChallengeResponse(v => !v)}
            className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ background: isChallengeResponse ? '#E07A2F' : '#e5e7eb' }}
          >
            {isChallengeResponse && <span className="text-white text-xs font-bold">✓</span>}
          </button>
        </label>

        {/* School (read-only) */}
        <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-zazi-muted text-sm">School</span>
          <span className="text-zazi-navy font-semibold text-sm">{school?.name}</span>
        </div>

        {/* Moderation notice */}
        <div className="bg-zazi-navy/5 rounded-xl px-4 py-3">
          <p className="text-zazi-navy/70 text-xs leading-relaxed">
            Your submission will be reviewed by the Zazi team before it appears publicly. This keeps Zazi safe for everyone.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full font-black py-4 rounded-2xl text-base transition-all ${
            canSubmit ? 'bg-zazi-orange text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit for Review
        </button>
      </div>
    </div>
  )
}
