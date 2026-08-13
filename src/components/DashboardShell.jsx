import { Outlet } from 'react-router-dom'

// Admin / Sponsor / Teacher dashboards manage their own internal layout
// (already responsive) and now render full-bleed, edge to edge, on every
// screen size — no floating card, no letterboxing.
export default function DashboardShell() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
