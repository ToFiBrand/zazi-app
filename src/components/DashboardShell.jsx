import { Outlet } from 'react-router-dom'

// Admin / Sponsor / Teacher dashboards manage their own internal layout
// (already responsive). On desktop we float them as a card on a navy
// backdrop; on mobile they go full-bleed edge to edge.
export default function DashboardShell() {
  return (
    <div className="min-h-screen bg-zazi-navy md:p-8">
      <div className="mx-auto max-w-6xl">
        <Outlet />
      </div>
    </div>
  )
}
