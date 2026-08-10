import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Heart, Eye } from 'lucide-react'
import { EXPLORE_CATEGORIES, CONTENT_TYPES } from '../data/content'
import { useApp } from '../context/AppContext'

const TYPE_EMOJI = Object.fromEntries(CONTENT_TYPES.map(t => [t.id, t.emoji]))

export default function ExploreScreen() {
  const navigate = useNavigate()
  const { approvedContent } = useApp()
  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return approvedContent.filter(c => {
      const inCat = cat === 'all' || c.category === cat
      const inQuery = !query || c.title.toLowerCase().includes(query.toLowerCase())
      return inCat && inQuery
    })
  }, [approvedContent, cat, query])

  return (
    <div className="min-h-screen bg-zazi-cream flex flex-col pb-[70px] md:pb-8">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-black text-zazi-navy mb-3">Explore</h2>
        <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-3 shadow-card">
          <Search size={16} className="text-zazi-muted" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm text-zazi-navy bg-transparent outline-none placeholder-zazi-muted"
            placeholder="Search student stories, creators..."
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {EXPLORE_CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              cat === c.id ? 'bg-zazi-orange text-white' : 'bg-white text-zazi-navy shadow-card'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="px-5 mt-8 text-center">
          <p className="text-zazi-navy font-bold text-sm">Nothing here yet.</p>
          <p className="text-zazi-muted text-xs mt-1">Be the first to share something in this category.</p>
        </div>
      ) : (
        <div className="px-5 mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map(item => (
            <button key={item.id} onClick={() => navigate(`/explore/${item.id}`)} className="text-left">
              <div className="w-full rounded-2xl relative overflow-hidden flex items-center justify-center" style={{ height: 130, background: item.color }}>
                <span className="text-3xl">{TYPE_EMOJI[item.type] || '✨'}</span>
                <div className="absolute top-2 right-2 bg-black/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Eye size={10} className="text-white" />
                  <span className="text-white text-[9px]">{item.views}</span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-zazi-navy font-bold text-xs leading-tight">{item.title}</p>
                <p className="text-zazi-muted text-[10px] mt-0.5">{item.author} · {item.school}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Heart size={10} className="text-zazi-muted" />
                  <span className="text-zazi-muted text-[10px]">{item.likes}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
