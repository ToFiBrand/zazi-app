import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate('/onboarding')}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/onboarding') }}
      className="min-h-screen w-full flex flex-col items-center pt-16 relative overflow-hidden bg-zazi-navy cursor-pointer"
    >
      <video
        src="/video/app-opening.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 flex flex-col items-center gap-3 zazi-fade-up">
        <img src="/logo-v.svg" alt="Zazi" className="w-[130px] h-auto brightness-0 drop-shadow-lg" />
        <p className="text-zazi-navy text-sm font-semibold tracking-wide">Know Yourself. Grow Yourself.</p>
      </div>

      <div className="absolute bottom-14 left-0 right-0 flex justify-center z-10">
        <p className="text-white text-sm font-bold tracking-wide bg-black/30 backdrop-blur px-4 py-2 rounded-full animate-pulse">
          Tap to begin
        </p>
      </div>
    </div>
  )
}
