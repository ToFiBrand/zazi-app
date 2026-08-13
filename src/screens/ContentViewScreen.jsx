import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Heart, MessageCircle, Share2, SearchX, Sparkles } from 'lucide-react'
import { CONTENT_TYPES } from '../data/content'
import { PILLARS } from '../data/pillars'
import { useApp } from '../context/AppContext'
import { Avatar, Chip, Button } from '../components/ui'

const COMMENTS = [
  { id: 1, user: 'Naledi K.', avatarId: 'lerato', text: 'This is so relatable, thank you for sharing!', time: '2h ago' },
  { id: 2, user: 'Sipho M.', avatarId: 'sipho', text: 'Really well put together 🙌', time: '5h ago' },
]

export default function ContentViewScreen() {
  const navigate = useNavigate()
  const { contentId } = useParams()
  const { publishedContributions, user } = useApp()
  const item = publishedContributions.find(c => c.id === contentId)
  const [liked, setLiked] = useState(false)

  const handleShare = async () => {
    if (item && navigator.share) {
      try { await navigator.share({ title: item.title, text: item.description }) } catch { /* cancelled */ }
    }
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-zazi-cream flex flex-col items-center justify-center px-8 text-center">
        <SearchX size={30} className="text-zazi-navy/30 mb-2" />
        <h2 className="text-lg font-extrabold text-zazi-navy">This story isn't available</h2>
        <p className="text-zazi-navy/50 text-sm mt-1">It may still be under review, or the link is out of date.</p>
        <Button variant="primary" className="mt-5" onClick={() => navigate('/explore')}>Back to Explore</Button>
      </div>
    )
  }

  const pillar = PILLARS.find(p => p.id === item.pillar)
  const typeInfo = CONTENT_TYPES.find(t => t.id === item.type)

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col">
      {/* Hero */}
      <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: 220, background: item.color + '1C' }}>
        {item.imageUrl && <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <button onClick={() => navigate('/explore')} className="absolute top-4 left-4 w-9 h-9 bg-black/20 backdrop-blur rounded-full flex items-center justify-center z-10">
          <ChevronLeft size={18} className="text-white" />
        </button>
        {!item.imageUrl && (typeInfo ? <typeInfo.icon size={56} style={{ color: item.color }} /> : <Sparkles size={56} className="text-zazi-navy/30" />)}
      </div>

      {/* Content */}
      <div className="px-6 pt-5 flex-1">
        <div className="flex gap-2 mb-2.5">
          <Chip color={pillar?.color}>{pillar?.short}</Chip>
          <Chip color="#17283A">{typeInfo?.label}</Chip>
        </div>
        <h1 className="text-lg font-extrabold text-zazi-navy leading-snug">{item.title}</h1>

        {/* Author */}
        <div className="flex items-center gap-2.5 mt-4">
          <Avatar avatarId={item.avatarId} size="sm" />
          <div>
            <p className="text-zazi-navy font-bold text-sm">{item.author}</p>
            <p className="text-zazi-navy/45 text-[11px]">{item.school}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 mt-4 py-3.5 border-y border-zazi-navy/8">
          <button onClick={() => setLiked(l => !l)} className="flex items-center gap-1.5">
            <Heart size={18} className={liked ? 'fill-zazi-coral text-zazi-coral' : 'text-zazi-navy/35'} />
            <span className="text-zazi-navy text-xs font-semibold">{liked ? item.likes + 1 : item.likes}</span>
          </button>
          <div className="flex items-center gap-1.5">
            <MessageCircle size={18} className="text-zazi-navy/35" />
            <span className="text-zazi-navy text-xs font-semibold">{item.comments}</span>
          </div>
          <button onClick={handleShare} className="flex items-center gap-1.5 ml-auto">
            <Share2 size={18} className="text-zazi-navy/35" />
            <span className="text-zazi-navy text-xs font-semibold">Share</span>
          </button>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-zazi-navy/65 text-sm leading-relaxed">{item.description}</p>
        </div>

        {/* Comments */}
        <div className="mt-5 mb-4">
          <h3 className="font-extrabold text-zazi-navy text-sm mb-3">Comments</h3>
          <div className="space-y-3">
            {COMMENTS.map(c => (
              <div key={c.id} className="flex gap-2.5">
                <Avatar avatarId={c.avatarId} size="xs" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm p-3 shadow-soft">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zazi-navy font-bold text-xs">{c.user}</span>
                    <span className="text-zazi-navy/35 text-[10px]">{c.time}</span>
                  </div>
                  <p className="text-zazi-navy/65 text-xs">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment input */}
      <div className="sticky bottom-0 bg-white border-t border-zazi-navy/8 px-4 py-3 flex items-center gap-2">
        <Avatar avatarId={user.avatarId} size="xs" />
        <input
          className="flex-1 bg-zazi-input-bg rounded-full px-4 py-2.5 text-sm text-zazi-navy placeholder-zazi-navy/40 outline-none"
          placeholder="Add a comment... (moderated)"
        />
      </div>
    </div>
  )
}
