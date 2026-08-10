import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SLIDES = [
  {
    bg: '#FAF4E8',
    title: 'Welcome to Zazi',
    body: 'The city of your future, where current affairs news, knowledge, culture and creativity collide.',
    sub: 'Step in, speak up and shape the world that\'s waiting for you.',
    illustration: (
      <div className="w-full h-56 flex items-end justify-center pb-2 relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(180deg, #E07A2F22 0%, #F0A50022 100%)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-zazi-orange opacity-20" />
        </div>
        <div className="relative z-10 flex items-end gap-4">
          <div className="w-20 h-28 rounded-2xl bg-gradient-to-t from-zazi-orange to-zazi-gold flex items-end justify-center pb-2">
            <span className="text-white text-3xl">👩🏾</span>
          </div>
          <div className="w-20 h-24 rounded-2xl bg-gradient-to-t from-zazi-teal to-teal-400 flex items-end justify-center pb-2">
            <span className="text-white text-3xl">👨🏾</span>
          </div>
        </div>
        {/* Cityscape */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-1 px-4 opacity-30">
          {[40,60,80,55,70,45,65,50].map((h,i) => (
            <div key={i} className="flex-1 bg-zazi-teal rounded-t" style={{ height: h }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    bg: '#FAF4E8',
    title: "What You'll Find Here",
    features: [
      { emoji: '🎧', text: 'News, Podcasts & videos made for YOU' },
      { emoji: '📚', text: 'School subjects explained in real talk' },
      { emoji: '🧠', text: 'Challenges that level up your mind' },
      { emoji: '🎨', text: 'Spaces to create, post and shine' },
      { emoji: '💼', text: 'Career tools to plan your future' },
      { emoji: '🌍', text: 'Real African stories, news and voices' },
    ],
    sub: "Let's explore what matters.",
    illustration: (
      <div className="w-full h-44 flex items-end justify-center pb-2 relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(180deg, #E07A2F22 0%, #3B9A8C22 100%)' }}>
        <div className="relative z-10 flex items-end gap-3">
          <div className="w-16 h-20 rounded-2xl bg-gradient-to-t from-zazi-teal to-teal-300 flex items-end justify-center pb-2">
            <span className="text-2xl">🎧</span>
          </div>
          <div className="w-20 h-28 rounded-2xl bg-gradient-to-t from-zazi-orange to-yellow-400 flex items-end justify-center pb-2">
            <span className="text-3xl">👩🏾</span>
          </div>
          <div className="w-16 h-20 rounded-2xl bg-gradient-to-t from-purple-500 to-purple-300 flex items-end justify-center pb-2">
            <span className="text-2xl">🎙️</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    bg: '#E8F5F2',
    title: 'You Belong Here',
    subtitle: 'Zazi means "to know yourself"',
    body: 'This is a platform made by youth, for youth.\nHere, your voice matters. Your ideas matter. Your story matters.',
    cta: 'Start your journey',
    illustration: (
      <div className="w-full h-48 flex items-end justify-center pb-2 relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(180deg, #3B9A8C33 0%, #E07A2F22 100%)' }}>
        <div className="relative z-10 flex items-end gap-2">
          <div className="w-16 h-22 rounded-2xl bg-gradient-to-t from-zazi-orange to-yellow-300 flex items-end justify-center pb-1">
            <span className="text-2xl">👧🏾</span>
          </div>
          <div className="w-20 h-28 rounded-2xl bg-gradient-to-t from-zazi-teal to-teal-300 flex items-end justify-center pb-1">
            <span className="text-3xl">👩🏾</span>
          </div>
          <div className="w-16 h-22 rounded-2xl bg-gradient-to-t from-purple-500 to-purple-300 flex items-end justify-center pb-1">
            <span className="text-2xl">👦🏽</span>
          </div>
        </div>
      </div>
    ),
  },
]

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const s = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1

  return (
    <div className="min-h-screen md:min-h-0 md:flex-1 flex flex-col" style={{ background: s.bg, transition: 'background 0.4s' }}>
      {/* Skip */}
      <div className="flex justify-between items-center px-5 pt-4">
        <img src="/logo-h.png" alt="Zazi" className="h-7 object-contain" />
        <button onClick={() => navigate('/login')} className="text-zazi-muted text-sm font-medium">Skip</button>
      </div>

      {/* Illustration */}
      <div className="px-5 mt-4">{s.illustration}</div>

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-4 flex flex-col">
        {s.subtitle && (
          <p className="text-zazi-teal font-bold text-base mb-1">{s.subtitle}</p>
        )}
        <h2 className="text-2xl font-black text-zazi-navy mb-3">{s.title}</h2>

        {s.features ? (
          <ul className="space-y-2 mb-4">
            {s.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-zazi-navy text-sm">
                <span className="text-lg">{f.emoji}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zazi-navy/70 text-sm leading-relaxed whitespace-pre-line mb-3">{s.body || ''}</p>
        )}

        {s.sub && <p className="text-zazi-navy/70 text-sm mt-auto">{s.sub}</p>}
      </div>

      {/* Dots + CTA */}
      <div className="px-6 pb-8 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === slide ? 24 : 8,
                background: i === slide ? '#E07A2F' : '#ccc',
              }}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-zazi-teal text-white font-bold py-4 rounded-2xl text-base"
          >
            Start your journey
          </button>
        ) : (
          <button
            onClick={() => setSlide(s => s + 1)}
            className="w-full bg-zazi-orange text-white font-bold py-4 rounded-2xl text-base"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
