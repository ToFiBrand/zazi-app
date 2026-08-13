import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Heart, Eye } from 'lucide-react'
import { EXPLORE_FILTERS, CONTENT_TYPES } from '../data/content'
import { useApp } from '../context/AppContext'
import { Avatar } from '../components/ui'

const TYPE_ICON = Object.fromEntries(CONTENT_TYPES.map(t => [t.id, t.icon]))

export default function ExploreScreen() {
  const navigate = useNavigate()
  const { publishedContributions } = useApp()
  const [typeFilter, setTypeFilter] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return publishedContributions.filter(c => {
      const inType = typeFilter === 'all' || c.type === typeFilter
      const inQuery = !query || c.title.toLowerCase().includes(query.toLowerCase())
      return inType && inQuery
    })
  }, [publishedContributions, typeFilter, query])

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col pb-[76px] md:pb-10">
      {/* Hero — hook question this screen answers */}
      <div className="relative w-full overflow-hidden" style={{ height: 400 }}>
        <video
          src="/video/explore.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-zazi-navy via-zazi-navy/60 to-transparent" />
        <h1 className="absolute bottom-5 left-6 right-6 text-white text-2xl font-extrabold leading-tight drop-shadow-sm z-10">
          What's the crew creating?
        </h1>
      </div>

      <div className="px-6 pt-4 pb-2">
        <div className="bg-white rounded-2xl flex items-center gap-2.5 px-4 py-3.5 shadow-soft">
          <Search size={17} className="text-zazi-navy/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm text-zazi-navy bg-transparent outline-none placeholder-zazi-navy/40"
            placeholder="Search stories, topics, people..."
          />
        </div>
      </div>

      {/* From Zazi — type filters */}
      <p className="px-6 mt-4 text-zazi-navy/40 text-[11px] font-bold uppercase tracking-wide">From Zazi</p>
      <div className="px-6 flex gap-2 overflow-x-auto no-scrollbar pb-2 mt-2">
        {EXPLORE_FILTERS.map(c => (
          <button
            key={c.id}
            onClick={() => setTypeFilter(c.id)}
            className={`zazi-tap flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              typeFilter === c.id ? 'bg-zazi-orange text-white' : 'bg-white text-zazi-navy/70 shadow-soft'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="px-6 mt-10 text-center">
          <p className="text-zazi-navy font-bold text-sm">Nothing here yet.</p>
          <p className="text-zazi-navy/50 text-xs mt-1">Be the first to share something in this category.</p>
        </div>
      ) : (
        <div className="px-6 mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map(item => {
            const TypeIcon = TYPE_ICON[item.type]
            return (
            <button key={item.id} onClick={() => navigate(`/explore/${item.id}`)} className="zazi-tap text-left">
              <div className="w-full rounded-2xl relative overflow-hidden flex items-center justify-center" style={{ height: 130, background: item.color + '1C' }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  TypeIcon && <TypeIcon size={34} style={{ color: item.color }} />
                )}
                {item.imageUrl && TypeIcon && (
                  <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <TypeIcon size={12} className="text-white" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/25 backdrop-blur rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Eye size={10} className="text-white" />
                  <span className="text-white text-[9px] font-medium">{item.views}</span>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                <Avatar avatarId={item.avatarId} size="xs" />
                <p className="text-zazi-navy/50 text-[10px] truncate">{item.author}</p>
              </div>
              <p className="text-zazi-navy font-bold text-xs leading-tight mt-1">{item.title}</p>
              <div className="flex items-center gap-1 mt-1">
                <Heart size={10} className="text-zazi-navy/30" />
                <span className="text-zazi-navy/40 text-[10px]">{item.likes}</span>
              </div>
            </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
