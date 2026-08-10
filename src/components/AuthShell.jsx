import { Outlet } from 'react-router-dom'

export default function AuthShell() {
  return (
    <div className="min-h-screen bg-zazi-navy flex items-center justify-center md:py-10">
      <div
        className="w-full bg-zazi-cream min-h-screen md:min-h-[720px] md:max-h-[860px] md:flex md:flex-col md:rounded-[2.5rem] md:shadow-2xl overflow-y-auto no-scrollbar"
        style={{ maxWidth: 480 }}
      >
        <Outlet />
      </div>
    </div>
  )
}
