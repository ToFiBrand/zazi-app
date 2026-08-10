import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function AuthScreen() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen md:min-h-0 md:flex-1 flex flex-col bg-zazi-cream">
      {/* Logo */}
      <div className="flex justify-center pt-12 pb-2">
        <img src="/logo-v.svg" alt="Zazi" className="h-20 object-contain" />
      </div>

      {/* Hero image */}
      <div className="mx-6 mt-4 rounded-[2rem] overflow-hidden bg-zazi-teal/10 flex items-end justify-center" style={{ height: 220 }}>
        <img src="/pillars/career.svg" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Tagline */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-2xl font-extrabold text-zazi-navy text-center leading-snug">Your space to learn, create and grow</h1>
        <p className="text-zazi-navy/60 text-center text-sm mt-2">Join thousands of young South Africans building their future on Zazi.</p>
      </div>

      {/* Buttons */}
      <div className="px-7 mt-6 space-y-3">
        <Button variant="primary" size="lg" full onClick={() => navigate('/signup')}>
          Sign Up
        </Button>
        <Button variant="secondary" size="lg" full onClick={() => navigate('/home')}>
          Log In
        </Button>
      </div>

      <p className="text-zazi-navy/40 text-xs text-center mt-6 px-6 pb-8">
        By continuing, you agree to our{' '}
        <span className="text-zazi-teal font-semibold">Terms &amp; Privacy Policy</span>
      </p>
    </div>
  )
}
