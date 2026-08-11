import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Headphones, BookOpen, Brain, Palette, Briefcase, Globe2 } from 'lucide-react'
import Button from '../components/ui/Button'

const FEATURES = [
  { icon: Headphones, text: 'News, podcasts & videos made for YOU' },
  { icon: BookOpen, text: 'School subjects explained in real talk' },
  { icon: Brain, text: 'Challenges that level up your mind' },
  { icon: Palette, text: 'Spaces to create, post and shine' },
  { icon: Briefcase, text: 'Career tools to plan your future' },
  { icon: Globe2, text: 'Real African stories, news and voices' },
]

const SLIDES = [
  {
    art: '/hero/onboarding-hero.svg',
    title: 'Welcome to Zazi',
    intro: 'The city of your future, where',
    focusWords: ['Current Affairs', 'News', 'Knowledge', 'Culture', 'Creativity'],
    outro: 'collide.',
    sub: "Step in, speak up and shape the world that's waiting for you.",
  },
  {
    art: '/pillars/civic.svg',
    title: "What You'll Find Here",
    features: true,
    sub: "Let's explore what matters.",
  },
  {
    art: '/pillars/leadership.svg',
    title: 'You Belong Here',
    subtitle: 'Zazi means "to know yourself"',
    body: "This is a platform made by youth, for youth. Here, your voice matters. Your ideas matter. Your story matters.",
    cta: 'Start your journey',
  },
]

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const s = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1

  return (
    <div className="min-h-screen md:min-h-0 md:flex-1 flex flex-col bg-zazi-cream">
      {/* Top */}
      <div className="flex justify-between items-center px-6 pt-6">
        <img src="/logo-h.svg" alt="Zazi" className="h-10 object-contain" />
        <button onClick={() => navigate('/login')} className="text-zazi-navy/50 text-sm font-semibold">Skip</button>
      </div>

      {/* Hero art */}
      <div className="px-4 mt-2 flex-shrink-0" key={slide}>
        <img src={s.art} alt="" className="w-full h-72 object-contain zazi-fade-up mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="flex-1 px-7 pt-4 pb-2 flex flex-col min-h-0" key={`content-${slide}`}>
        {s.subtitle && (
          <p className="text-zazi-teal font-bold text-base mb-1 zazi-fade-up">{s.subtitle}</p>
        )}
        <h1 className="text-3xl font-extrabold text-zazi-navy mb-3 leading-tight zazi-fade-up">{s.title}</h1>

        {s.focusWords ? (
          <div className="mb-2">
            <p className="text-zazi-navy/70 text-base leading-relaxed zazi-fade-up">{s.intro}</p>
            <div className="my-1">
              {s.focusWords.map((w, i) => (
                <div key={w}>
                  <p
                    className="text-zazi-orange font-extrabold text-2xl leading-[1.15] zazi-fade-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {w}
                  </p>
                  {i < s.focusWords.length - 1 && (
                    <p className="text-zazi-orange/25 font-bold text-sm leading-none my-0.5">|</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-zazi-navy/70 text-base leading-relaxed zazi-fade-up">{s.outro}</p>
          </div>
        ) : s.features ? (
          <ul className="space-y-3 mb-4">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-zazi-navy text-sm font-medium zazi-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <span className="w-9 h-9 rounded-full bg-zazi-teal/10 flex items-center justify-center flex-shrink-0">
                  <f.icon size={17} className="text-zazi-teal" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zazi-navy/70 text-base leading-relaxed mb-3 zazi-fade-up">{s.body}</p>
        )}

        {s.sub && <p className="text-zazi-navy/60 text-sm mt-auto zazi-fade-up">{s.sub}</p>}
      </div>

      {/* Dots + CTA */}
      <div className="px-7 pb-9 pt-3 flex flex-col items-center gap-5">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 26 : 8,
                background: i === slide ? '#FF8A00' : '#EFE4C9',
              }}
            />
          ))}
        </div>

        {isLast ? (
          <Button variant="primary" size="lg" full onClick={() => navigate('/login')}>
            {s.cta}
          </Button>
        ) : (
          <Button variant="primary" size="lg" full onClick={() => setSlide(v => v + 1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
