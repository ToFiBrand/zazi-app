import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setSubmitting(true)
    setError('')
    const { error: signInError } = await signIn({ email, password })
    setSubmitting(false)
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : signInError.message)
      return
    }
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex flex-col bg-zazi-cream">
      <div className="flex items-center gap-3 px-6 pt-6 pb-2 md:max-w-lg md:mx-auto md:w-full">
        <button onClick={() => navigate('/welcome')} className="w-9 h-9 flex items-center justify-center -ml-1.5">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-zazi-navy">Log In</h1>
          <p className="text-zazi-navy/50 text-xs mt-0.5">Welcome back to Zazi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 mt-6 flex-1 flex flex-col md:max-w-lg md:mx-auto md:w-full">
        <div className="space-y-4">
          <div>
            <label className="block text-zazi-navy font-semibold text-sm mb-1.5">Email Address</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-navy/40 text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-zazi-navy font-semibold text-sm">Password</label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-zazi-orange text-xs font-semibold">
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-navy/40 text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
            />
          </div>
        </div>

        {error && (
          <p className="text-zazi-coral text-xs font-semibold mt-4 text-center">{error}</p>
        )}

        <Button type="submit" variant="primary" size="lg" full disabled={submitting || !email || !password} className="mt-6">
          {submitting ? 'Logging in...' : 'Log In'}
        </Button>

        <p className="text-center text-sm text-zazi-navy/50 mt-4">
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/signup')} className="text-zazi-orange font-semibold">Sign Up</button>
        </p>
      </form>
    </div>
  )
}
