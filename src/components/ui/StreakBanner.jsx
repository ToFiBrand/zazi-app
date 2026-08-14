import { useEffect, useState } from 'react'
import { Flame, Shield, X } from 'lucide-react'

// Informational, not celebratory — "streak protected" / "streak reset"
// are deliberately quiet, no-guilt moments (see supabase/migrations/
// 0025_gamification_triggers.sql's touch_streak()). Auto-dismisses so it
// never blocks the screen, and can always be dismissed early.
export default function StreakBanner({ notification, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!notification) return
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 4000)
    return () => clearTimeout(t)
  }, [notification, onDismiss])

  if (!notification) return null
  const protectedStreak = notification.type === 'streak-protected'

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 flex justify-center transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
    >
      <div className="w-full max-w-sm bg-zazi-navy rounded-2xl shadow-card px-4 py-3.5 flex items-center gap-3 zazi-fade-up">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          {protectedStreak ? <Shield size={14} className="text-zazi-teal" /> : <Flame size={14} className="text-zazi-orange" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold">{notification.title}</p>
          <p className="text-white/50 text-xs">{notification.body}</p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }} className="text-white/40 flex-shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
