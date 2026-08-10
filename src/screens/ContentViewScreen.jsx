import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Heart, MessageCircle, Share2 } from 'lucide-react'
import { CONTENT_TYPES } from '../data/content'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'

const COMMENTS = [
  { id: 1, user: 'Naledi K.', avatar: '👩🏾', text: 'This is so relatable, thank you for sharing!', time: '2h ago' },
  { id: 2, user: 'Sipho M.', avatar: '👨🏾', text: 'Really well put together 🙌', time: '5h ago' },
]

export default function ContentViewScreen() {
  const navigate = useNavigate()
  const { contentId } = useParams()
  const { approvedContent } = useApp()
  const item = approvedContent.find(c => c.id === contentId) || approvedContent[0]
  const [liked, setLiked] = useState(false)
  const pillar = PILLARS.find(p => p.id === item.pillar)
  const typeInfo = CONTENT_TYPES.find(t => t.id === item.type)

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: item.title, text: item.description }) } catch { /* cancelled */ }
    }
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-zazi-cream flex flex-col items-center justify-center px-8 text-center">
        <p className="text-zazi-navy font-bold">Nothing to show yet.</p>
        <button onClick={() => navigate('/explore')} className="mt-3 text-zazi-orange font-semibold text-sm">Back to Explore</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col">
      {/* Hero */}
      <div className="relative w-full flex items-center justify-center" style={{ height: 220, background: item.color }}>
        <button onClick={() => navigate('/explore')} className="absolute top-4 left-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <span className="text-6xl">{typeInfo?.emoji || '✨'}</span>
      </div>

      {/* Content */}
      <div className="px-5 pt-4 flex-1">
        <div className="flex gap-2 mb-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: pillar?.color + '20', color: pillar?.color }}>
            {pillar?.short}
          </span>
          <span className="bg-gray-100 text-zazi-navy text-[10px] font-bold px-2 py-0.5 rounded-full">{typeInfo?.label}</span>
        </div>
        <h2 className="text-lg font-black text-zazi-navy leading-tight">{item.title}</h2>

        {/* Author */}
        <div className="flex items-center gap-2 mt-3">
          <div className="w-9 h-9 bg-zazi-orange rounded-full flex items-center justify-center text-lg">🧑🏾</div>
          <div>
            <p className="text-zazi-navy font-bold text-sm">{item.author}</p>
            <p className="text-zazi-muted text-[10px]">{item.school}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 py-3 border-y border-gray-100">
          <button onClick={() => setLiked(l => !l)} className="flex items-center gap-1.5">
            <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-zazi-muted'} />
            <span className="text-zazi-navy text-xs font-semibold">{liked ? item.likes + 1 : item.likes}</span>
          </button>
          <div className="flex items-center gap-1.5">
            <MessageCircle size={18} className="text-zazi-muted" />
            <span className="text-zazi-navy text-xs font-semibold">{item.comments}</span>
          </div>
          <button onClick={handleShare} className="flex items-center gap-1.5 ml-auto">
            <Share2 size={18} className="text-zazi-muted" />
            <span className="text-zazi-navy text-xs font-semibold">Share</span>
          </button>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-zazi-navy/70 text-sm leading-relaxed">{item.description}</p>
        </div>

        {/* Comments */}
        <div className="mt-5 mb-4">
          <h3 className="font-black text-zazi-navy text-sm mb-3">Comments</h3>
          <div className="space-y-3">
            {COMMENTS.map(c => (
              <div key={c.id} className="flex gap-2">
                <div className="w-8 h-8 bg-zazi-teal/20 rounded-full flex items-center justify-center text-base flex-shrink-0">{c.avatar}</div>
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm p-3 shadow-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zazi-navy font-bold text-xs">{c.user}</span>
                    <span className="text-zazi-muted text-[10px]">{c.time}</span>
                  </div>
                  <p className="text-zazi-navy/70 text-xs">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 bg-zazi-orange/20 rounded-full flex items-center justify-center text-base">👦🏾</div>
        <input
          className="flex-1 bg-zazi-input-bg rounded-xl px-3 py-2 text-sm text-zazi-navy placeholder-zazi-muted outline-none"
          placeholder="Add a comment... (moderated)"
        />
      </div>
    </div>
  )
}
