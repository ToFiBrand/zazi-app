import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function ResetPasswordScreen() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // The reset link in the email signs the browser into a temporary
  // recovery session via a PASSWORD_RECOVERY auth event — wait for that
  // before allowing a submit, otherwise updateUser has nothing to act on.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const canSubmit = ready && password.length >= 6 && password === confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    const { error: updateError } = await updatePassword(password)
    setSubmitting(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zazi-cream px-6 text-center md:max-w-lg md:mx-auto">
        <div className="w-16 h-16 rounded-full bg-zazi-teal/10 flex items-center justify-center mb-5">
          <CheckCircle2 size={28} className="text-zazi-teal" />
        </div>
        <h1 className="text-2xl font-extrabold text-zazi-navy mb-2">Password updated</h1>
        <p className="text-zazi-navy/60 text-sm max-w-xs mb-8">You can now log in with your new password.</p>
        <Button variant="primary" size="lg" onClick={() => navigate('/home')}>Continue</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-zazi-cream">
      <div className="px-6 pt-6 pb-2 md:max-w-lg md:mx-auto md:w-full">
        <h1 className="text-2xl font-extrabold text-zazi-navy">Set a New Password</h1>
        <p className="text-zazi-navy/50 text-xs mt-0.5">Choose something you haven't used before</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 mt-6 flex-1 flex flex-col md:max-w-lg md:mx-auto md:w-full">
        {!ready && (
          <p className="text-zazi-navy/50 text-xs font-semibold mb-4 text-center">Verifying your reset link...</p>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-zazi-navy font-semibold text-sm mb-1.5">New Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-navy/40 text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
            />
          </div>
          <div>
            <label className="block text-zazi-navy font-semibold text-sm mb-1.5">Confirm Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Type it again"
              className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-navy/40 text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
            />
          </div>
        </div>

        {error && (
          <p className="text-zazi-coral text-xs font-semibold mt-4 text-center">{error}</p>
        )}
        {password && confirmPassword && password !== confirmPassword && (
          <p className="text-zazi-coral text-xs font-semibold mt-4 text-center">Passwords don't match.</p>
        )}

        <Button type="submit" variant="primary" size="lg" full disabled={submitting || !canSubmit} className="mt-6">
          {submitting ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  )
}
