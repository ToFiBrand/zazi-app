import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-zazi-navy font-bold text-base mb-2">{title}</h2>
      <div className="text-zazi-navy/70 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export default function TermsScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zazi-cream pb-12">
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 md:max-w-2xl md:mx-auto">
        <button onClick={() => navigate('/welcome')} className="w-9 h-9 flex items-center justify-center -ml-1.5">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-zazi-navy">Terms of Service</h1>
          <p className="text-zazi-navy/50 text-xs mt-0.5">Last updated: 9 August 2026</p>
        </div>
      </div>

      <div className="px-6 md:max-w-2xl md:mx-auto">
        <p className="text-zazi-navy/70 text-sm leading-relaxed mb-6">
          Zazi is a learning platform built for South African learners in Grades 7–12. By creating an
          account or using Zazi as a guest, you (or, if you are under 18, your parent or guardian on
          your behalf) agree to these terms.
        </p>

        <Section title="1. Who can use Zazi">
          <p>
            Zazi is built for school-going learners, and also welcomes teachers, contributors and
            sponsor organisations in supporting roles. Many of our users are minors. If you are under
            18, you confirm that a parent or guardian is aware that you are using Zazi.
          </p>
        </Section>

        <Section title="2. Your account">
          <p>
            You can explore Zazi as a guest without creating an account. If you choose to save your
            progress, you'll create an account with your name, email address, password, grade and
            school. You're responsible for keeping your password private and for anything that happens
            under your account.
          </p>
        </Section>

        <Section title="3. Content on Zazi">
          <p>
            Lessons are authored by the Zazi team, verified teachers, and approved contributors, and
            are reviewed before publishing. Community contributions (comments, submissions, and shared
            content) must be your own work, respectful, and appropriate for a platform used by school
            learners. We may remove content or restrict accounts that don't meet this standard.
          </p>
          <p>
            Do not use Zazi to post anything abusive, discriminatory, sexually explicit, illegal, or
            intended to harass or endanger another learner.
          </p>
        </Section>

        <Section title="4. Gamification & rewards">
          <p>
            XP, levels, streaks, achievements and leaderboard placement are for motivation and
            recognition within Zazi. They hold no monetary value and may be adjusted, reset, or
            discontinued if we find evidence of abuse (for example, artificially inflating XP).
          </p>
        </Section>

        <Section title="5. School information">
          <p>
            If your school isn't already listed, you can add it yourself. Added schools become part of
            the shared list so other learners from your school can find and select it. Please only add
            real schools.
          </p>
        </Section>

        <Section title="6. Sponsors & teachers">
          <p>
            Organisations and teachers using Zazi's sponsor or teacher tools may access aggregated,
            non-identifying usage information relevant to their role (for example, how many learners
            engaged with a sponsored module). They do not get access to individual learners' contact
            details through Zazi.
          </p>
        </Section>

        <Section title="7. Changes & availability">
          <p>
            Zazi is under active development. Features may change, and we'll do our best to keep your
            progress, XP, and account data intact when we do. We may update these terms as the
            platform grows — we'll post the updated date at the top of this page.
          </p>
        </Section>

        <Section title="8. Ending your account">
          <p>
            You (or your parent/guardian) can ask us to close your account and delete your personal
            data at any time — see our <a href="/privacy" className="text-zazi-orange font-semibold">Privacy Policy</a> for
            how to do that.
          </p>
        </Section>

        <div className="mt-8 bg-zazi-teal/10 rounded-xl px-4 py-3">
          <p className="text-zazi-teal text-xs font-semibold leading-relaxed">
            Zazi is an early-stage platform. These terms will keep evolving as we work with legal
            advisors to make sure everything fully reflects South African law, including protections
            for learners under 18. Questions? Reach out to the Zazi team.
          </p>
        </div>
      </div>
    </div>
  )
}
