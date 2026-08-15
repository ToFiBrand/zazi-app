import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Cpu, PiggyBank, Briefcase, Megaphone, Palette } from 'lucide-react'
import Button from '../components/ui/Button'

const FEATURES = [
  { icon: Rocket, text: 'Entrepreneurship & innovation' },
  { icon: Cpu, text: 'STEM, AI & digital skills' },
  { icon: PiggyBank, text: 'Real-life money smarts' },
  { icon: Briefcase, text: 'Careers & real pathways' },
  { icon: Megaphone, text: 'Leadership & communication' },
  { icon: Palette, text: 'Creativity & culture' },
]

const SLIDES = [
  {
    video: '/video/welcome.mp4',
    title: 'Welcome to Zazi',
    body: "This is the city where you build the skills school doesn't always teach — entrepreneurship, tech, money, leadership and more.",
  },
  {
    video: '/video/what-youll-find.mp4',
    title: "What You'll Find Here",
    features: true,
  },
  {
    video: '/video/you-belong.mp4',
    title: 'You Belong Here',
    subtitle: 'Zazi means "to know yourself"',
    body: 'A platform made by youth, for youth. Your voice matters. Your ideas matter. Your story matters.',
    cta: 'Start your journey',
  },
]

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const s = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1

  return (
    <div className="min-h-screen w-full md:max-w-[480px] md:mx-auto flex flex-col bg-zazi-navy">
      {/* Image — most of the screen */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden" key={slide}>
        <video
          src={s.video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover zazi-fade-up"
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zazi-navy to-transparent" />

        <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
          <img src="/logo-v.svg" alt="Zazi" className="h-14 object-contain drop-shadow-md" />
        </div>
        <button onClick={() => navigate('/welcome')} className="absolute top-6 right-6 text-white text-sm font-semibold bg-black/25 backdrop-blur px-3.5 py-1.5 rounded-full z-10">
          Skip
        </button>
      </div>

      {/* Text, just above the button — image gets the space */}
      <div className="flex-shrink-0 px-7 pt-3 pb-8 bg-zazi-navy" key={`content-${slide}`}>
        <div className="text-center mb-4">
          {s.subtitle && (
            <p className="text-zazi-gold font-bold text-sm mb-1 zazi-fade-up">{s.subtitle}</p>
          )}
          <h1 className="text-white font-extrabold text-xl leading-tight mb-1.5 zazi-fade-up">
            {s.title}
          </h1>

          {s.features ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3 text-left max-w-sm mx-auto">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-white text-[11px] font-medium leading-tight zazi-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <f.icon size={12} className="text-white" />
                  </span>
                  {f.text}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/85 text-sm leading-relaxed max-w-sm mx-auto zazi-fade-up">{s.body}</p>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 26 : 8,
                background: i === slide ? '#FF8A00' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        {isLast ? (
          <Button variant="primary" size="lg" full onClick={() => navigate('/welcome')}>
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
