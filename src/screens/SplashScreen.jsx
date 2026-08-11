import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 2400)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen md:min-h-0 md:flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-zazi-navy">
      {/* Soft sunrise glow behind the logo */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,138,0,0.28) 0%, rgba(255,138,0,0) 70%)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 zazi-fade-up">
        <img src="/logo-v.svg" alt="Zazi" className="w-64 h-auto drop-shadow-lg" />
        <p className="text-white/60 text-base font-medium tracking-wide">Know Yourself. Grow Yourself.</p>
      </div>

      <div className="absolute bottom-14 flex gap-2">
        <div className="w-6 h-2 bg-zazi-orange rounded-full" />
        <div className="w-2 h-2 bg-white/20 rounded-full" />
        <div className="w-2 h-2 bg-white/20 rounded-full" />
      </div>
    </div>
  )
}
