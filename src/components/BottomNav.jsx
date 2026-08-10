import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Plus, Compass, User } from 'lucide-react'

const NAV = [
  { to: '/home',    icon: Home,    label: 'Home' },
  { to: '/learn',   icon: BookOpen,label: 'Learn' },
  { to: '/create',  icon: Plus,    label: null },  // FAB
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/profile', icon: User,    label: 'Profile' },
]

export default function BottomNav() {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 z-30"
      style={{ maxWidth: 640, margin: '0 auto' }}
    >
      {NAV.map(({ to, icon: Icon, label }) =>
        label === null ? (
          <NavLink key={to} to={to} className="w-12 h-12 rounded-full bg-zazi-orange flex items-center justify-center shadow-lg -mt-4">
            <Icon size={22} className="text-white" strokeWidth={2.5} />
          </NavLink>
        ) : (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-zazi-orange' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        )
      )}
    </div>
  )
}
