import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MailCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const { resetPasswordForEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    setError('')
    const { error: resetError } = await resetPasswordForEmail(email.trim())
    setSubmitting(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zazi-cream px-6 text-center md:max-w-lg md:mx-auto">
        <div className="w-16 h-16 rounded-full bg-zazi-teal/10 flex items-center justify-center mb-5">
          <MailCheck size={28} className="text-zazi-teal" />
        </div>
        <h1 className="text-2xl font-extrabold text-zazi-navy mb-2">Check your email</h1>
        <p className="text-zazi-navy/60 text-sm max-w-xs mb-8">
          If an account exists for <span className="font-semibold text-zazi-navy">{email}</span>, we've sent a link to reset your password.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/login')}>Back to Log In</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-zazi-cream">
      <div className="flex items-center gap-3 px-6 pt-6 pb-2 md:max-w-lg md:mx-auto md:w-full">
        <button onClick={() => navigate('/login')} className="w-9 h-9 flex items-center justify-center -ml-1.5">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-zazi-navy">Forgot Password?</h1>
          <p className="text-zazi-navy/50 text-xs mt-0.5">We'll email you a reset link</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 mt-6 flex-1 flex flex-col md:max-w-lg md:mx-auto md:w-full">
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

        {error && (
          <p className="text-zazi-coral text-xs font-semibold mt-4 text-center">{error}</p>
        )}

        <Button type="submit" variant="primary" size="lg" full disabled={submitting || !email.trim()} className="mt-6">
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <p className="text-center text-sm text-zazi-navy/50 mt-4">
          Remembered it?{' '}
          <button type="button" onClick={() => navigate('/login')} className="text-zazi-orange font-semibold">Log In</button>
        </p>
      </form>
    </div>
  )
}
