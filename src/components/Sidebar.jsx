import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Plus, Compass, User, Bell, GraduationCap, LineChart, ShieldCheck } from 'lucide-react'

const PRIMARY = [
  { to: '/home',    icon: Home,    label: 'Home' },
  { to: '/learn',   icon: BookOpen,label: 'Learn' },
  { to: '/create',  icon: Plus,    label: 'Create' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/profile', icon: User,    label: 'Profile' },
]

const DASHBOARDS = [
  { to: '/teacher', icon: GraduationCap, label: 'Teacher Dashboard' },
  { to: '/sponsor',  icon: LineChart,     label: 'Sponsor Dashboard' },
  { to: '/admin',    icon: ShieldCheck,   label: 'Admin Dashboard' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-60 bg-zazi-navy px-4 py-6 z-40">
      <div className="flex items-center gap-2 px-2 mb-8">
        <img src="/logo-h.svg" alt="Zazi" className="h-11 object-contain" />
      </div>

      <nav className="flex-1 space-y-1">
        {PRIMARY.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive ? 'bg-zazi-orange text-white' : 'text-gray-300 hover:bg-white/10'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive ? 'bg-zazi-orange text-white' : 'text-gray-300 hover:bg-white/10'
            }`
          }
        >
          <Bell size={18} />
          Notifications
        </NavLink>
      </nav>

      <div className="pt-4 mt-4 border-t border-white/10">
        <p className="text-zazi-muted text-[10px] uppercase tracking-widest px-3 mb-2">Preview Dashboards</p>
        <div className="space-y-1">
          {DASHBOARDS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-white/15 text-white' : 'text-gray-400 hover:bg-white/10'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  )
}
