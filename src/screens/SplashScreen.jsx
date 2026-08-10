import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 2400)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      className="min-h-screen md:min-h-0 md:flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-zazi-cream"
      style={{
        backgroundImage: 'url(/backgrounds/opening.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-5 zazi-fade-up">
        <img src="/logo-v.svg" alt="Zazi" className="w-40 h-auto drop-shadow-sm" />
        <p className="text-zazi-navy/70 text-base font-medium tracking-wide">Know Yourself. Grow Yourself.</p>
      </div>

      <div className="absolute bottom-14 flex gap-2">
        <div className="w-6 h-2 bg-zazi-orange rounded-full" />
        <div className="w-2 h-2 bg-zazi-teal/30 rounded-full" />
        <div className="w-2 h-2 bg-zazi-teal/30 rounded-full" />
      </div>
    </div>
  )
}
