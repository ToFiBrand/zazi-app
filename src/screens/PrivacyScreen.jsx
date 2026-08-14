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

export default function PrivacyScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zazi-cream pb-12">
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 md:max-w-2xl md:mx-auto">
        <button onClick={() => navigate('/welcome')} className="w-9 h-9 flex items-center justify-center -ml-1.5">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-zazi-navy">Privacy Policy</h1>
          <p className="text-zazi-navy/50 text-xs mt-0.5">Last updated: 9 August 2026</p>
        </div>
      </div>

      <div className="px-6 md:max-w-2xl md:mx-auto">
        <p className="text-zazi-navy/70 text-sm leading-relaxed mb-6">
          Zazi is used by learners in Grades 7–12 across South Africa, many of whom are minors. We've
          written this policy to be honest about what we collect and why, in line with South Africa's
          Protection of Personal Information Act (POPIA).
        </p>

        <Section title="1. What we collect">
          <p><span className="font-semibold text-zazi-navy">To create an account:</span> first name, last name, email address, and a password (stored securely by our authentication provider — we never see it in plain text).</p>
          <p><span className="font-semibold text-zazi-navy">To personalise learning:</span> grade and school.</p>
          <p><span className="font-semibold text-zazi-navy">To power the platform:</span> the avatar you build, your XP, level, streaks, missions, achievements and lesson progress, and any content you choose to submit (comments, contributions, uploaded media).</p>
          <p><span className="font-semibold text-zazi-navy">Guest use:</span> if you use Zazi without an account, we only associate activity with an anonymous session — no name, email or contact details are collected unless and until you choose to save your progress.</p>
        </Section>

        <Section title="2. What we don't do">
          <p>
            We don't sell your personal information. We don't show your name, email or contact details
            to other learners, sponsors, or teachers. Where we build dashboards to understand how Zazi
            is used (for example, by grade, province, or subject area), those views are built from
            aggregated, de-identified data — not individual learner profiles.
          </p>
        </Section>

        <Section title="3. Why we collect it">
          <p>
            To run your account, track your progress accurately, personalise content to your grade,
            keep the platform safe from abuse, and understand — at an aggregate level — what's working
            so we can improve Zazi for learners across the country.
          </p>
        </Section>

        <Section title="4. Where it's stored">
          <p>
            Zazi's data is stored with Supabase (database, authentication and file storage) and the
            app itself is hosted on Vercel. Both are reputable infrastructure providers used by
            platforms worldwide; access to learner data is restricted to the Zazi team.
          </p>
        </Section>

        <Section title="5. Minors & parental awareness">
          <p>
            Many Zazi users are under 18. We collect the minimum information needed to run the
            platform (see above) and do not knowingly collect sensitive personal information beyond
            what's needed for a school-context learning tool. Parents and guardians can contact us to
            review, correct, or request deletion of their child's information at any time.
          </p>
        </Section>

        <Section title="6. Your rights">
          <p>
            Under POPIA, you (or your parent/guardian) can ask us to: tell you what personal
            information we hold about you, correct anything that's inaccurate, or delete your account
            and associated personal information. To make a request, contact the Zazi team — see the
            in-app support/contact option, or reach out via the school or organisation that
            introduced you to Zazi.
          </p>
        </Section>

        <Section title="7. Cookies & local storage">
          <p>
            Zazi uses your browser's local storage to keep you logged in between visits. We don't use
            third-party advertising trackers.
          </p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>
            As Zazi grows, this policy will be updated to reflect new features and, where needed,
            formal legal review. We'll update the date at the top of this page whenever it changes.
          </p>
        </Section>

        <div className="mt-8 bg-zazi-teal/10 rounded-xl px-4 py-3">
          <p className="text-zazi-teal text-xs font-semibold leading-relaxed">
            This is a starting policy, written to reflect what Zazi actually does today. It is not yet
            a substitute for formal POPIA legal review — something we're prioritising given how many of
            our users are minors, before Zazi reaches a wide audience.
          </p>
        </div>
      </div>
    </div>
  )
}
