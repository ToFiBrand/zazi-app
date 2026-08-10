import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 2800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen md:min-h-0 md:flex-1 flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #E07A2F 0%, #F0A500 50%, #E07A2F 100%)' }}>

      {/* Animated background circles */}
      <div className="absolute w-96 h-96 rounded-full opacity-20 bg-white top-[-8rem] right-[-8rem]" />
      <div className="absolute w-64 h-64 rounded-full opacity-10 bg-white bottom-[-4rem] left-[-4rem]" />

      {/* Decorative diamond pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-5xl font-black text-zazi-orange">Z</span>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-black text-white tracking-tight">Zazi</h1>
          <p className="text-white/80 text-base mt-2 font-medium">Know Yourself. Grow Yourself.</p>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-12 flex gap-2">
        <div className="w-6 h-2 bg-white rounded-full" />
        <div className="w-2 h-2 bg-white/40 rounded-full" />
        <div className="w-2 h-2 bg-white/40 rounded-full" />
      </div>
    </div>
  )
}
