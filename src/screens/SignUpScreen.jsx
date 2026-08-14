import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronLeft, Check, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { findOrCreateSchool, SA_PROVINCES } from '../lib/schools'
import { PILLARS } from '../data/pillars'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

const GRADES = [7, 8, 9, 10, 11, 12]
const CUSTOM_SCHOOL = '__custom__'

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
  const [accountType, setAccountType] = useState('student') // 'student' | 'educator'
  const [schools, setSchools] = useState([])
  const [agreed, setAgreed] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [customSchoolName, setCustomSchoolName] = useState('')
  const [customProvince, setCustomProvince] = useState('')
  const [customDistrict, setCustomDistrict] = useState('')
  const [professionalRole, setProfessionalRole] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [educatorPillar, setEducatorPillar] = useState(PILLARS[0].id)
  const [qualifications, setQualifications] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  useEffect(() => {
    supabase.from('schools').select('id, name, province').order('name')
      .then(({ data }) => setSchools(data || []))
  }, [])

  const isEducator = accountType === 'educator'
  const usingCustomSchool = schoolId === CUSTOM_SCHOOL
  const schoolReady = usingCustomSchool ? (customSchoolName.trim() && customProvince) : !!schoolId
  const studentReady = grade && schoolReady
  const educatorReady = professionalRole.trim() && qualifications.trim()
  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && password.length >= 6 && agreed
    && (isEducator ? educatorReady : studentReady)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')

    // A brand-new school can't be inserted until an account exists to own
    // the request (schools' insert policy is authenticated-only) — so for
    // a custom school, sign up first with no school attached yet, then
    // create the school and attach it as a follow-up update. Educators
    // don't have a grade/school at all.
    const { data: signUpData, error: signUpError } = await signUp({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(isEducator ? {} : { grade, schoolId: usingCustomSchool ? null : schoolId }),
    })
    if (signUpError) {
      setSubmitting(false)
      setError(signUpError.message)
      return
    }

    if (!isEducator && usingCustomSchool && signUpData?.user) {
      const { id: newSchoolId, error: schoolError } = await findOrCreateSchool({
        name: customSchoolName, province: customProvince, district: customDistrict,
      })
      if (!schoolError && newSchoolId) {
        await supabase.from('profiles').update({ school_id: newSchoolId }).eq('id', signUpData.user.id)
      }
    }

    if (isEducator && signUpData?.user) {
      // Everyone starts as 'student' — this is what puts them in the
      // review queue; approving it is what flips role to 'teacher'.
      const { error: applicationError } = await supabase.from('teacher_applications').insert({
        applicant_id: signUpData.user.id,
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        professional_role: professionalRole.trim(),
        organisation: organisation.trim() || null,
        pillar: educatorPillar,
        qualifications: qualifications.trim(),
      })
      setSubmitting(false)
      if (!applicationError) {
        setApplicationSubmitted(true)
        return
      }
      // Account exists even though the application failed to submit —
      // land them in the app; they can retry from Profile → Become a Contributor.
      navigate('/home')
      return
    }

    setSubmitting(false)
    navigate('/interests')
  }

  if (applicationSubmitted) {
    return (
      <div className="min-h-screen bg-zazi-cream flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 bg-zazi-teal/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-zazi-teal" />
        </div>
        <h2 className="text-xl font-black text-zazi-navy">Account created — application submitted</h2>
        <p className="text-zazi-navy/70 text-sm mt-2 leading-relaxed">
          Welcome to Zazi. Your educator application is now with our team for review — we'll notify you once it's approved. You have full access to explore Zazi in the meantime.
        </p>
        <button onClick={() => navigate('/home')} className="mt-6 bg-zazi-orange text-white font-bold py-3.5 px-8 rounded-2xl text-sm">
          Continue to Zazi
        </button>
      </div>
    )
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
          <p className="text-zazi-muted text-xs">{isEducator ? 'Apply to contribute as an educator or mentor' : 'Join the Zazi community'}</p>
        </div>
      </div>

      <div className="px-5 space-y-4 md:max-w-lg md:mx-auto">
        <div className="flex bg-zazi-input-bg rounded-2xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setAccountType('student')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${accountType === 'student' ? 'bg-white text-zazi-navy shadow-soft' : 'text-zazi-navy/50'}`}
          >
            I'm a Student
          </button>
          <button
            type="button"
            onClick={() => setAccountType('educator')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${accountType === 'educator' ? 'bg-white text-zazi-navy shadow-soft' : 'text-zazi-navy/50'}`}
          >
            I'm an Educator/Mentor
          </button>
        </div>

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
        {isEducator ? (
          <>
            <Field label="Professional Role">
              <input
                value={professionalRole}
                onChange={e => setProfessionalRole(e.target.value)}
                placeholder="e.g. Software Engineer, Teacher, Banker"
                className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
              />
            </Field>
            <Field label="Organisation (optional)">
              <input
                value={organisation}
                onChange={e => setOrganisation(e.target.value)}
                placeholder="Company or school name"
                className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
              />
            </Field>
            <Field label="Area of Expertise">
              <div className="relative">
                <select
                  value={educatorPillar}
                  onChange={e => setEducatorPillar(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
                >
                  {PILLARS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
              </div>
            </Field>
            <Field label="Experience & Qualifications">
              <textarea
                value={qualifications}
                onChange={e => setQualifications(e.target.value)}
                rows={4}
                placeholder="Tell us about your background and why you want to contribute..."
                className="w-full bg-zazi-input-bg rounded-xl px-4 py-3.5 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40 resize-none"
              />
            </Field>
            <div className="bg-zazi-navy/5 rounded-xl px-4 py-3">
              <p className="text-zazi-navy/70 text-xs leading-relaxed">
                Our team reviews every application before granting publishing access. You'll get full access to Zazi right away — we'll notify you once your contributor application is approved.
              </p>
            </div>
          </>
        ) : (
          <>
            <Field label="School">
              <div className="relative">
                <select
                  value={schoolId}
                  onChange={e => setSchoolId(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
                >
                  <option value="">{schools.length ? 'Select your school' : 'Loading schools...'}</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name} — {s.province}</option>)}
                  <option value={CUSTOM_SCHOOL}>➕ My school isn't listed</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
              </div>
            </Field>

            {usingCustomSchool && (
              <div className="space-y-3 bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-zazi-navy/50 text-xs">Add your school — it'll be saved so other students from your school can find it too.</p>
                <input
                  value={customSchoolName}
                  onChange={e => setCustomSchoolName(e.target.value)}
                  placeholder="School name"
                  className="w-full bg-zazi-input-bg rounded-xl px-4 py-3 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
                />
                <div className="relative">
                  <select
                    value={customProvince}
                    onChange={e => setCustomProvince(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-zazi-navy text-sm outline-none"
                  >
                    <option value="">Select province</option>
                    {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
                </div>
                <input
                  value={customDistrict}
                  onChange={e => setCustomDistrict(e.target.value)}
                  placeholder="District (optional)"
                  className="w-full bg-zazi-input-bg rounded-xl px-4 py-3 text-zazi-navy placeholder-zazi-muted text-sm outline-none focus:ring-2 focus:ring-zazi-orange/40"
                />
              </div>
            )}

            <Field label="Grade">
              <div className="relative">
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-zazi-navy text-sm outline-none"
                >
                  <option value="">Select your grade</option>
                  {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
              </div>
            </Field>
          </>
        )}

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
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-zazi-orange font-semibold" onClick={e => e.stopPropagation()}>Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-zazi-orange font-semibold" onClick={e => e.stopPropagation()}>Privacy Policy</a>
          </span>
        </label>

        {error && <p className="text-zazi-coral text-xs font-semibold text-center">{error}</p>}

        <Button variant="primary" size="lg" full onClick={handleSubmit} disabled={!canSubmit || submitting} className="mt-2">
          {submitting ? 'Creating account...' : isEducator ? 'Create Account & Apply' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-zazi-muted">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-zazi-orange font-semibold">Log In</button>
        </p>
      </div>
    </div>
  )
}
