import { Briefcase, PiggyBank, Laptop2, Rocket, Megaphone, HandHeart } from 'lucide-react'

export const PILLARS = [
  {
    id: 'career',
    name: 'Career & Future Readiness',
    short: 'Career',
    description: 'Discover your strengths, explore careers and plan your path.',
    icon: Briefcase,
    color: '#FF8A00',
    art: '/pillars/career.svg',
  },
  {
    id: 'finance',
    name: 'Financial Literacy & Economic Empowerment',
    short: 'Money',
    description: 'Save, budget, bank and build your financial future.',
    icon: PiggyBank,
    color: '#F4B84C',
    art: '/pillars/finance.svg',
  },
  {
    id: 'digital',
    name: 'Digital & Media Literacy',
    short: 'Digital',
    description: 'Stay safe online, build your brand and think critically.',
    icon: Laptop2,
    color: '#006E68',
    art: '/pillars/digital.svg',
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship & Innovation',
    short: 'Business',
    description: 'Solve problems, build ideas and pitch like a founder.',
    icon: Rocket,
    color: '#E8603C',
    art: '/pillars/entrepreneurship.svg',
  },
  {
    id: 'leadership',
    name: 'Leadership, Identity & Personal Development',
    short: 'Leadership',
    description: 'Grow your confidence, voice and sense of purpose.',
    icon: Megaphone,
    color: '#0D665F',
    art: '/pillars/leadership.svg',
  },
  {
    id: 'civic',
    name: 'Civic Responsibility & Social Impact',
    short: 'Community',
    description: 'Understand your rights and make a difference locally.',
    icon: HandHeart,
    color: '#5F9770',
    art: '/pillars/civic.svg',
  },
]

export const pillarById = (id) => PILLARS.find(p => p.id === id)
