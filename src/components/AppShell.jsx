import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

// Bottom nav (mobile) only shows on the 5 primary tab roots — detail/sub screens
// stay full-focus, matching typical mobile app patterns.
const TAB_ROOTS = ['/home', '/learn', '/create', '/explore', '/profile']

export default function AppShell() {
  const { pathname } = useLocation()
  const showBottomNav = TAB_ROOTS.includes(pathname)

  return (
    <div className="min-h-screen bg-zazi-cream">
      <Sidebar />
      <div className="md:pl-60 flex md:justify-center">
        <div className="w-full min-h-screen" style={{ maxWidth: 640 }}>
          <Outlet />
        </div>
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  )
}
