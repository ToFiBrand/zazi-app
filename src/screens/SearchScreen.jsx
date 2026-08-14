import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search, X, Clock, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PILLARS, pillarById } from '../data/pillars'
import { CONTENT_TYPES } from '../data/content'
import { Avatar, Chip } from '../components/ui'

// A real, unified search across everything the app knows about — lessons,
// community contributions, and pillars — replacing what was previously
// just a styled button on Home that jumped straight to /learn with no way
// to actually type a query. Client-side substring matching over data
// that's already loaded: at this content scale (dozens of lessons, low
// hundreds of contributions) a search index/service would be solving a
// problem that doesn't exist yet.
export default function SearchScreen() {
  const navigate = useNavigate()
  const { publishedLessons, publishedContributions } = useApp()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const q = query.trim().toLowerCase()

  const lessonResults = useMemo(() => {
    if (!q) return []
    return publishedLessons.filter(l => l.title.toLowerCase().includes(q) || (l.description || '').toLowerCase().includes(q)).slice(0, 12)
  }, [publishedLessons, q])

  const contentResults = useMemo(() => {
    if (!q) return []
    return publishedContributions.filter(c =>
      c.title.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q) || (c.author || '').toLowerCase().includes(q)
    ).slice(0, 12)
  }, [publishedContributions, q])

  const pillarResults = useMemo(() => {
    if (!q) return []
    return PILLARS.filter(p => p.name.toLowerCase().includes(q) || p.short.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }, [q])

  const hasResults = lessonResults.length + contentResults.length + pillarResults.length > 0

  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center -ml-2 flex-shrink-0">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div className="flex-1 bg-zazi-cream rounded-2xl flex items-center gap-2.5 px-4 py-3">
          <Search size={16} className="text-zazi-navy/40 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search lessons, stories, pillars..."
            className="flex-1 bg-transparent text-sm text-zazi-navy placeholder-zazi-navy/40 outline-none min-w-0"
          />
          {query && (
            <button onClick={() => setQuery('')} className="flex-shrink-0">
              <X size={15} className="text-zazi-navy/40" />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pt-5">
        {!q ? (
          <>
            <p className="text-zazi-navy/40 text-[11px] font-bold uppercase tracking-wide mb-2.5">Browse by Pillar</p>
            <div className="flex flex-wrap gap-2">
              {PILLARS.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/learn?pillar=${p.id}`)}
                  className="zazi-tap flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold shadow-soft bg-white"
                  style={{ color: p.color }}
                >
                  <p.icon size={13} /> {p.short}
                </button>
              ))}
            </div>
          </>
        ) : !hasResults ? (
          <div className="text-center py-16">
            <Search size={28} className="text-zazi-navy/20 mx-auto mb-2" />
            <p className="text-zazi-navy font-bold text-sm">Nothing found for "{query}"</p>
            <p className="text-zazi-navy/45 text-xs mt-1">Try a different word, or browse by pillar instead.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pillarResults.length > 0 && (
              <section>
                <p className="text-zazi-navy/40 text-[11px] font-bold uppercase tracking-wide mb-2.5">Pillars</p>
                <div className="flex flex-wrap gap-2">
                  {pillarResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/learn?pillar=${p.id}`)}
                      className="zazi-tap flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold shadow-soft bg-white"
                      style={{ color: p.color }}
                    >
                      <p.icon size={13} /> {p.name}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {lessonResults.length > 0 && (
              <section>
                <p className="text-zazi-navy/40 text-[11px] font-bold uppercase tracking-wide mb-2.5">Lessons</p>
                <div className="space-y-2.5">
                  {lessonResults.map(l => {
                    const pillar = pillarById(l.pillar)
                    return (
                      <button key={l.id} onClick={() => navigate(`/learn/${l.id}`)} className="zazi-tap w-full bg-white rounded-2xl p-3 flex items-center gap-3 text-left shadow-soft">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: l.color + '20' }}>
                          {l.coverImageUrl ? <img src={l.coverImageUrl} alt="" className="w-full h-full object-cover" /> : <pillar.icon size={18} style={{ color: pillar.color }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-zazi-navy font-bold text-sm truncate">{l.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Chip color={pillar.color}>{pillar.short}</Chip>
                            <span className="text-zazi-navy/40 text-[10px] flex items-center gap-1"><Clock size={9} />{l.duration} min</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {contentResults.length > 0 && (
              <section>
                <p className="text-zazi-navy/40 text-[11px] font-bold uppercase tracking-wide mb-2.5">Community</p>
                <div className="space-y-2.5">
                  {contentResults.map(c => {
                    const typeInfo = CONTENT_TYPES.find(t => t.id === c.type)
                    return (
                      <button key={c.id} onClick={() => navigate(`/explore/${c.id}`)} className="zazi-tap w-full bg-white rounded-2xl p-3 flex items-center gap-3 text-left shadow-soft">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: c.color + '1C' }}>
                          {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover" /> : (typeInfo && <typeInfo.icon size={18} style={{ color: c.color }} />)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-zazi-navy font-bold text-sm truncate">{c.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Avatar avatarId={c.avatarId} customization={c.avatarCustomization} size="xs" />
                            <span className="text-zazi-navy/45 text-[11px] truncate">{c.author}</span>
                            <span className="text-zazi-navy/30 text-[10px] flex items-center gap-0.5 flex-shrink-0"><Heart size={9} />{c.likes}</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
