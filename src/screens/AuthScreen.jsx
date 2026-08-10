import { useNavigate } from 'react-router-dom'

export default function AuthScreen() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen md:min-h-0 md:flex-1 flex flex-col bg-zazi-cream">
      {/* Logo */}
      <div className="flex justify-center pt-10 pb-2">
        <img src="/logo-v.png" alt="Zazi" className="h-16 object-contain" />
      </div>

      {/* Hero image placeholder */}
      <div className="mx-5 rounded-3xl overflow-hidden" style={{ height: 220 }}>
        <div className="w-full h-full flex items-end justify-center pb-0 relative"
          style={{ background: 'linear-gradient(135deg, #3B9A8C 0%, #4DB6A6 40%, #E07A2F 100%)' }}>
          {/* Decorative city bg */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end gap-1 px-4 opacity-20">
            {[60,90,120,80,100,70,95,65].map((h,i) => (
              <div key={i} className="flex-1 bg-white rounded-t" style={{ height: h }} />
            ))}
          </div>
          {/* Characters */}
          <div className="relative z-10 flex items-end gap-4 pb-0">
            <div className="text-center">
              <div className="w-24 h-32 rounded-t-2xl bg-white/20 flex items-end justify-center pb-2 backdrop-blur-sm">
                <span className="text-5xl">👩🏾‍🎓</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-28 rounded-t-2xl bg-white/20 flex items-end justify-center pb-2 backdrop-blur-sm">
                <span className="text-5xl">👨🏾‍💻</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-2xl font-black text-zazi-navy text-center">Welcome to Zazi</h2>
        <p className="text-zazi-muted text-center text-sm mt-1">Your space to learn, create, and grow</p>
      </div>

      {/* Buttons */}
      <div className="px-6 mt-6 space-y-3">
        <button
          onClick={() => navigate('/signup')}
          className="w-full bg-zazi-orange text-white font-bold py-4 rounded-2xl text-base shadow-md"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate('/home')}
          className="w-full border-2 border-zazi-orange text-zazi-orange font-bold py-4 rounded-2xl text-base"
        >
          Log In
        </button>
      </div>

      <p className="text-zazi-muted text-xs text-center mt-6 px-6">
        By continuing, you agree to our{' '}
        <span className="text-zazi-orange">Terms & Privacy Policy</span>
      </p>
    </div>
  )
}
