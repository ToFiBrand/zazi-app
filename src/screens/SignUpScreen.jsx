import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { SCHOOLS } from '../data/schools'
import { useApp } from '../context/AppContext'

const GRADES = [7, 8, 9, 10, 11, 12]
const LANGS = ['English','Zulu','Xhosa','Afrikaans','Sotho','Tswana']

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
  const { updateProfile } = useApp()
  const [agreed, setAgreed] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [grade, setGrade] = useState('')
  const [schoolId, setSchoolId] = useState('')

  const canSubmit = firstName.trim() && lastName.trim() && grade && schoolId && agreed

  const handleSubmit = () => {
    if (!canSubmit) return
    const school = SCHOOLS.find(s => s.id === schoolId)
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      grade: Number(grade),
      schoolId,
      province: school?.province,
    })
    navigate('/interests')
  }

  return (
    <div className="min-h-screen md:min-h-0 bg-zazi-cream pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate('/login')} className="w-8 h-8 flex items-center">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zazi-navy">Create Account</h1>
          <p className="text-zazi-muted text-xs">Join the Zazi community</p>
        </div>
      </div>

      <div className="px-5 space-y-4">
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
            placeholder="your.email@example.com"
            className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            placeholder="Create a strong password"
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
              <option value="">Select your school</option>
              {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name} — {s.province}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Grade">
            <div className="relative">
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
              >
                <option value="">Grade</option>
                {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
            </div>
          </Field>
          <Field label="Language">
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40">
                {LANGS.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
            </div>
          </Field>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setAgreed(a => !a)}
            className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              agreed ? 'bg-zazi-orange border-zazi-orange' : 'border-gray-300 bg-white'
            }`}
          >
            {agreed && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <span className="text-sm text-zazi-navy/70">
            I agree to the{' '}
            <span className="text-zazi-orange font-semibold">Terms of Service</span>{' '}
            and{' '}
            <span className="text-zazi-orange font-semibold">Privacy Policy</span>
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full font-bold py-4 rounded-2xl text-base mt-2 transition-all ${
            canSubmit ? 'bg-zazi-orange text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Create Account
        </button>

        <p className="text-center text-sm text-zazi-muted">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-zazi-orange font-semibold">Log In</button>
        </p>
      </div>
    </div>
  )
}
