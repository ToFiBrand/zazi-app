import { useState, useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { CelebrationModal, StreakBanner, AvatarRenderer } from './ui'

// Bottom nav (mobile) only shows on the 5 primary tab roots — detail/sub screens
// stay full-focus, matching typical mobile app patterns.
const TAB_ROOTS = ['/home', '/learn', '/create', '/explore', '/profile']

// Full-screen celebration — big, rewarding, skippable.
const CELEBRATION_TYPES = {
  'avatar-unlock': { eyebrow: 'New item unlocked!', analyticsEvent: 'avatar_item_unlocked' },
  'badge-earned': { eyebrow: 'Badge earned!', analyticsEvent: 'achievement_unlocked' },
  'level-up': { eyebrow: 'Level up!', analyticsEvent: 'level_up' },
  'mission-completed': { eyebrow: 'Mission complete!', analyticsEvent: 'mission_completed' },
  'challenge-completed': { eyebrow: 'Challenge complete!', analyticsEvent: 'challenge_completed' },
  'pathway-completed': { eyebrow: 'Pathway complete!', analyticsEvent: 'pathway_completed' },
  'streak-milestone': { eyebrow: 'Streak milestone!', analyticsEvent: 'streak_extended' },
}

// Quiet, informational — no guilt, no fanfare, auto-dismisses. See
// touch_streak() in supabase/migrations/0025_gamification_triggers.sql.
const BANNER_TYPES = {
  'streak-protected': { analyticsEvent: 'streak_protected' },
  'streak-reset': { analyticsEvent: 'streak_lost' },
}

// Surfaces the "you just unlocked/earned/leveled up" moment regardless of
// which action triggered it (lesson completion, contribution approval,
// mission/challenge completion) — centralized here so it fires once, in
// one place, on any authenticated screen, rather than duplicated per
// screen. Server (SQL triggers, see 0023/0025) decides *when* this
// happens by inserting a notifications row; this just watches for one.
function useNotificationWatcher() {
  const { notifications, markNotificationRead, refreshUnlockedItems, refreshBadges, logEvent, user } = useApp()
  const { profile } = useAuth()
  const [activeCelebration, setActiveCelebration] = useState(null)
  const [activeBanner, setActiveBanner] = useState(null)

  const pendingCelebration = useMemo(
    () => notifications.find(n => !n.read && CELEBRATION_TYPES[n.type]),
    [notifications]
  )
  const pendingBanner = useMemo(
    () => notifications.find(n => !n.read && BANNER_TYPES[n.type]),
    [notifications]
  )

  useEffect(() => {
    if (pendingCelebration && !activeCelebration) setActiveCelebration(pendingCelebration)
  }, [pendingCelebration, activeCelebration])

  useEffect(() => {
    if (pendingBanner && !activeBanner) setActiveBanner(pendingBanner)
  }, [pendingBanner, activeBanner])

  const closeCelebration = () => {
    if (!activeCelebration) return
    markNotificationRead(activeCelebration.id)
    logEvent(CELEBRATION_TYPES[activeCelebration.type]?.analyticsEvent || 'celebration_dismissed', { notificationId: activeCelebration.id })
    // Locked/unlocked state in the creator screen and Profile's badge list
    // may have just changed server-side — refetch so they're current
    // without waiting for a full page reload.
    refreshUnlockedItems(profile?.id)
    refreshBadges(profile?.id)
    setActiveCelebration(null)
  }

  const closeBanner = () => {
    if (!activeBanner) return
    markNotificationRead(activeBanner.id)
    logEvent(BANNER_TYPES[activeBanner.type]?.analyticsEvent || 'streak_banner_dismissed', { notificationId: activeBanner.id })
    setActiveBanner(null)
  }

  return { activeCelebration, closeCelebration, activeBanner, closeBanner, user }
}

export default function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const showBottomNav = TAB_ROOTS.includes(pathname)
  const { activeCelebration, closeCelebration, activeBanner, closeBanner, user } = useNotificationWatcher()

  const meta = activeCelebration ? CELEBRATION_TYPES[activeCelebration.type] : null

  return (
    <div className="min-h-screen bg-zazi-cream">
      <Sidebar />
      <div className="md:pl-60 flex md:justify-center">
        <div className="w-full min-h-screen" style={{ maxWidth: 640 }}>
          <Outlet />
        </div>
      </div>
      {showBottomNav && <BottomNav />}

      <StreakBanner notification={activeBanner} onDismiss={closeBanner} />

      <CelebrationModal
        open={!!activeCelebration}
        onClose={closeCelebration}
        eyebrow={meta?.eyebrow}
        title={activeCelebration?.title || ''}
        body={activeCelebration?.body}
        avatarPreview={
          activeCelebration?.type === 'avatar-unlock' && user?.avatarCustomization
            ? <AvatarRenderer customization={user.avatarCustomization} size="2xl" ring />
            : null
        }
        onEquip={activeCelebration?.type === 'avatar-unlock' ? () => { closeCelebration(); navigate('/create-avatar') } : null}
      />
    </div>
  )
}
