import { Sparkles, X } from 'lucide-react'
import Button from './Button'

// Generic "something rewarding just happened" overlay — reused for
// avatar-unlock, badge-earned and level-up moments (see AppShell's unlock
// watcher). Plain Tailwind, no animation dependency: the entrance relies on
// the zazi-fade-up keyframe already defined in src/index.css.
export default function CelebrationModal({ open, onClose, eyebrow, title, body, avatarPreview, onEquip }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="relative w-full max-w-sm bg-zazi-navy rounded-4xl p-6 text-center shadow-card zazi-fade-up overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,138,0,0.35) 0%, rgba(23,40,58,0) 70%)' }}
        />
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center z-10">
          <X size={15} className="text-white/70" />
        </button>

        <div className="relative z-10">
          {avatarPreview && <div className="flex justify-center mb-4">{avatarPreview}</div>}
          <p className="text-zazi-gold text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5">
            <Sparkles size={13} className="fill-zazi-gold" /> {eyebrow}
          </p>
          <h2 className="text-white text-xl font-extrabold mt-1.5">{title}</h2>
          {body && <p className="text-white/60 text-sm mt-2 leading-relaxed">{body}</p>}

          <div className="mt-6 flex flex-col gap-2.5">
            {onEquip && (
              <Button variant="primary" size="md" full onClick={onEquip}>Equip Now</Button>
            )}
            <button onClick={onClose} className="text-white/50 text-xs font-semibold py-1">
              {onEquip ? 'Save for later' : 'Nice!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
