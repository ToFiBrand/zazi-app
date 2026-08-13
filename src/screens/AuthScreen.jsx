import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function AuthScreen() {
  const navigate = useNavigate()
  const { signInAsGuest } = useAuth()
  const [guestLoading, setGuestLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGuest = async () => {
    setGuestLoading(true)
    setError('')
    const { error: guestError } = await signInAsGuest({ grade: '9' })
    setGuestLoading(false)
    if (guestError) {
      setError('Could not start a guest session. Please try again.')
      return
    }
    navigate('/home')
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-zazi-navy">
      {/* Image — most of the screen */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden">
        <video
          src="/video/space-to-learn.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zazi-navy to-transparent" />

        <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
          <img src="/logo-v.svg" alt="Zazi" className="h-14 object-contain drop-shadow-md" />
        </div>
      </div>

      {/* Text, just above the buttons — image gets the space */}
      <div className="flex-shrink-0 px-7 pt-3 pb-8 bg-zazi-navy">
        <div className="text-center mb-4">
          <h1 className="text-white font-extrabold text-xl leading-tight mb-1.5">Welcome to Zazi</h1>
          <p className="text-white/85 text-sm leading-relaxed max-w-sm mx-auto">
            In this city, you will learn what school doesn't always teach you. Build real-world skills in entrepreneurship, STEM, money, technology, careers and leadership.
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="primary" size="lg" full onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
          <Button variant="secondary" size="lg" full onClick={() => navigate('/login')}>
            Log In
          </Button>
          <button
            onClick={handleGuest}
            disabled={guestLoading}
            className="w-full text-center text-white/70 font-semibold text-sm py-2 disabled:opacity-50"
          >
            {guestLoading ? 'Setting things up...' : 'Continue as Guest →'}
          </button>
          {error && <p className="text-zazi-coral text-xs font-semibold text-center">{error}</p>}
        </div>

        <p className="text-white/40 text-xs text-center mt-4">
          By continuing, you agree to our{' '}
          <span className="text-white/70 font-semibold">Terms &amp; Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
