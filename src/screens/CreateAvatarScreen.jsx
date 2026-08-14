import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Undo2, Shuffle, Lock, Check, ChevronLeft, Sparkles } from 'lucide-react'
import { AVATAR_PARTS, SKIN_TONES, randomCustomization, unlockHint } from '../data/avatarParts'
import { useApp } from '../context/AppContext'
import { AvatarRenderer, Button } from '../components/ui'

const CATEGORIES = [
  { id: 'base', label: 'Character' },
  { id: 'skinTone', label: 'Skin Tone' },
  { id: 'hair', label: 'Hair' },
  { id: 'outfit', label: 'Outfit' },
  { id: 'accessory', label: 'Accessory' },
  { id: 'headwear', label: 'Headwear' },
  { id: 'headphones', label: 'Headphones' },
]

const FIELD_BY_CATEGORY = {
  base: 'baseId',
  skinTone: 'skinTone',
  hair: 'hairId',
  outfit: 'outfitId',
  accessory: 'accessoryId',
  headwear: 'headwearId',
  headphones: 'headphonesId',
}

const DEFAULT_CUSTOMIZATION = {
  baseId: 'base_1',
  skinTone: 'tone-3',
  hairId: 'hair_afro',
  outfitId: 'outfit_explorer',
  accessoryId: null,
  headwearId: null,
  headphonesId: null,
}

export default function CreateAvatarScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, saveAvatarCustomization, earnedItemIds } = useApp()
  const mode = location.state?.mode === 'onboarding' ? 'onboarding' : 'edit'

  const [customization, setCustomization] = useState(user?.avatarCustomization || DEFAULT_CUSTOMIZATION)
  const [avatarName, setAvatarName] = useState(user?.avatarCustomization?.avatarName || '')
  const [activeCategory, setActiveCategory] = useState('base')
  const [history, setHistory] = useState([])
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const applyChange = (next) => {
    setHistory(h => [...h, customization])
    setCustomization(next)
  }

  const handleUndo = () => {
    if (!history.length) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setCustomization(prev)
  }

  const handleRandomize = () => {
    applyChange(randomCustomization(earnedItemIds))
  }

  const handleSelect = (category, itemId, locked) => {
    if (locked) return
    const field = FIELD_BY_CATEGORY[category]
    const isOptional = category !== 'base' && category !== 'skinTone'
    const current = customization[field]
    applyChange({ ...customization, [field]: isOptional && current === itemId ? null : itemId })
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveAvatarCustomization(customization, avatarName.trim() || null)
    setSaving(false)
    if (error) return
    if (mode === 'onboarding') {
      setJustSaved(true)
    } else {
      navigate('/profile')
    }
  }

  const items = useMemo(() => {
    if (activeCategory === 'skinTone') return SKIN_TONES
    return AVATAR_PARTS[activeCategory] || []
  }, [activeCategory])

  if (justSaved) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zazi-navy px-8 text-center zazi-fade-up">
        <AvatarRenderer customization={customization} size="2xl" ring className="mb-6" />
        <h1 className="text-white text-2xl font-extrabold">Welcome to Zazi, {user.firstName}.</h1>
        <p className="text-white/60 text-sm mt-2">Your journey starts now.</p>
        <Button variant="primary" size="lg" className="mt-8" onClick={() => navigate('/home')}>
          Enter Zazi
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-zazi-navy md:max-w-lg md:mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        {mode === 'edit' ? (
          <button onClick={() => navigate('/profile')} className="text-white/70">
            <ChevronLeft size={22} />
          </button>
        ) : <div className="w-6" />}
        <h1 className="text-white font-extrabold text-lg">Create Your Zazi</h1>
        <button
          onClick={handleUndo}
          disabled={!history.length}
          className="text-white/70 disabled:opacity-30"
          aria-label="Undo"
        >
          <Undo2 size={20} />
        </button>
      </div>

      {/* Live preview */}
      <div className="flex flex-col items-center pt-4 pb-5">
        <div
          className="w-56 h-56 rounded-full flex items-center justify-center relative"
          style={{ background: 'radial-gradient(circle, rgba(255,138,0,0.18) 0%, rgba(23,40,58,0) 70%)' }}
        >
          <AvatarRenderer customization={customization} size="3xl" className="w-48 h-48 shadow-card" ring />
        </div>
        <input
          value={avatarName}
          onChange={e => setAvatarName(e.target.value)}
          placeholder="Name your avatar"
          maxLength={20}
          className="mt-4 bg-white/10 text-white placeholder-white/40 text-center text-sm font-semibold rounded-full px-5 py-2 outline-none focus:bg-white/15"
        />
      </div>

      {/* Category tabs */}
      <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`zazi-tap flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === c.id ? 'bg-zazi-orange text-white' : 'bg-white/10 text-white/70'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Item strip */}
      <div className="flex-1 min-h-0 px-5 pt-3 pb-3 overflow-y-auto">
        <div className="grid grid-cols-4 gap-3">
          {activeCategory === 'skinTone'
            ? items.map(tone => (
                <button
                  key={tone.id}
                  onClick={() => handleSelect('skinTone', tone.id, false)}
                  className="zazi-tap flex flex-col items-center gap-1.5"
                >
                  <span
                    className="w-14 h-14 rounded-full block"
                    style={{
                      background: tone.hex,
                      boxShadow: customization.skinTone === tone.id ? '0 0 0 3px #FF8A00' : '0 0 0 2px rgba(255,255,255,0.15)',
                    }}
                  />
                  <span className="text-white/60 text-[10px]">{tone.name}</span>
                </button>
              ))
            : items.map(item => {
                const locked = item.unlockType !== 'free' && !earnedItemIds.has(item.id)
                const field = FIELD_BY_CATEGORY[activeCategory]
                const selected = customization[field] === item.id
                const previewCustomization = { ...customization, [field]: item.id }
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(activeCategory, item.id, locked)}
                    className="zazi-tap flex flex-col items-center gap-1.5 text-center"
                  >
                    <span className="relative">
                      <AvatarRenderer
                        customization={previewCustomization}
                        size="lg"
                        className={locked ? 'opacity-35 grayscale' : ''}
                        ring={selected}
                      />
                      {locked && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zazi-navy flex items-center justify-center">
                          <Lock size={10} className="text-white/70" />
                        </span>
                      )}
                      {selected && !locked && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zazi-orange flex items-center justify-center">
                          <Check size={11} strokeWidth={3} className="text-white" />
                        </span>
                      )}
                    </span>
                    <span className="text-white/60 text-[10px] leading-tight">{item.name}</span>
                    {locked && <span className="text-zazi-gold text-[9px] leading-tight px-1">{unlockHint(item)}</span>}
                  </button>
                )
              })}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-8 pt-2 flex gap-3">
        <button
          onClick={handleRandomize}
          className="zazi-tap flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="Surprise me"
        >
          <Shuffle size={18} className="text-white" />
        </button>
        <Button variant="primary" size="lg" full onClick={handleSave} disabled={saving}>
          <Sparkles size={16} className="fill-white" />
          {saving ? 'Saving...' : 'This Is Me — Save Avatar'}
        </Button>
      </div>
    </div>
  )
}
