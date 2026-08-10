import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, XCircle, Trophy, GraduationCap, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'

const TYPE_STYLE = {
  completion:      { icon: CheckCircle2,   color: '#3B9A8C', bg: '#e8f5f2' },
  approved:        { icon: CheckCircle2,   color: '#16a34a', bg: '#dcfce7' },
  rejected:        { icon: XCircle,        color: '#dc2626', bg: '#fde8e8' },
  challenge:       { icon: Trophy,         color: '#F0A500', bg: '#fdf3e0' },
  'lesson-approved': { icon: GraduationCap, color: '#7C5CBF', bg: '#f0eaf9' },
  'lesson-rejected': { icon: GraduationCap, color: '#6b7280', bg: '#f3f4f6' },
}

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const { notifications } = useApp()

  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/home')} className="w-8 h-8 flex items-center">
            <ChevronLeft size={20} className="text-zazi-navy" />
          </button>
          <div>
            <h2 className="text-xl font-black text-zazi-navy">Notifications</h2>
            <p className="text-zazi-muted text-xs">{notifications.filter(n => !n.read).length} new updates</p>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="px-5 mt-10 text-center">
          <Bell size={28} className="text-zazi-muted mx-auto mb-2" />
          <p className="text-zazi-navy font-bold text-sm">You're all caught up.</p>
        </div>
      ) : (
        <div className="px-5 space-y-2">
          {notifications.map(item => {
            const style = TYPE_STYLE[item.type] || TYPE_STYLE.challenge
            const Icon = style.icon
            return (
              <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-3 items-start shadow-card">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: style.bg }}>
                  <Icon size={16} style={{ color: style.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zazi-navy font-bold text-xs">{item.title}</p>
                  <p className="text-zazi-navy/70 text-xs mt-0.5">{item.body}</p>
                  <p className="text-zazi-muted text-[10px] mt-1">{item.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
