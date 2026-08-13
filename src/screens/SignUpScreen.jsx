import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronLeft, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

const GRADES = [7, 8, 9, 10, 11, 12]

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-zazi-navy font-semibold text-sm mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function SignUpScreen() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [schools, setSchools] = useState([])
  const [agreed, setAgreed] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.from('schools').select('id, name, province').order('name')
      .then(({ data }) => setSchools(data || []))
  }, [])

  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && password.length >= 6 && grade && schoolId && agreed

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    const { error: signUpError } = await signUp({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      grade,
      schoolId,
    })
    setSubmitting(false)
    if (signUpError) {
      setError(signUpError.message)
      return
    }
    navigate('/interests')
  }

  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 md:max-w-lg md:mx-auto">
        <button onClick={() => navigate('/welcome')} className="w-8 h-8 flex items-center">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-zazi-navy">Create Account</h1>
          <p className="text-zazi-muted text-xs">Join the Zazi community</p>
        </div>
      </div>

      <div className="px-5 space-y-4 md:max-w-lg md:mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name">
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Thabo"
              className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
            />
          </Field>
          <Field label="Last Name">
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Mthembu"
              className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
            />
          </Field>
        </div>
        <Field label="Email Address">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
          />
        </Field>
        <Field label="School">
          <div className="relative">
            <select
              value={schoolId}
              onChange={e => setSchoolId(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
            >
              <option value="">{schools.length ? 'Select your school' : 'Loading schools...'}</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name} — {s.province}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
          </div>
        </Field>
        <Field label="Grade">
          <div className="relative">
            <select
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
            >
              <option value="">Select your grade</option>
              {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
          </div>
        </Field>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setAgreed(a => !a)}
            className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              agreed ? 'bg-zazi-orange border-zazi-orange' : 'border-gray-300 bg-white'
            }`}
          >
            {agreed && <Check size={12} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-sm text-zazi-navy/70">
            I agree to the{' '}
            <span className="text-zazi-orange font-semibold">Terms of Service</span>{' '}
            and{' '}
            <span className="text-zazi-orange font-semibold">Privacy Policy</span>
          </span>
        </label>

        {error && <p className="text-zazi-coral text-xs font-semibold text-center">{error}</p>}

        <Button variant="primary" size="lg" full onClick={handleSubmit} disabled={!canSubmit || submitting} className="mt-2">
          {submitting ? 'Creating account...' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-zazi-muted">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-zazi-orange font-semibold">Log In</button>
        </p>
      </div>
    </div>
  )
}
