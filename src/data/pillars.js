export const PILLARS = [
  {
    id: 'career',
    name: 'Career & Future Readiness',
    short: 'Career',
    description: 'Discover your strengths, explore careers and plan your path.',
    emoji: '💼',
    color: '#E07A2F',
  },
  {
    id: 'finance',
    name: 'Financial Literacy & Economic Empowerment',
    short: 'Money',
    description: 'Save, budget, bank and build your financial future.',
    emoji: '💰',
    color: '#F0A500',
  },
  {
    id: 'digital',
    name: 'Digital & Media Literacy',
    short: 'Digital',
    description: 'Stay safe online, build your brand and think critically.',
    emoji: '💻',
    color: '#3B9A8C',
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship & Innovation',
    short: 'Business',
    description: 'Solve problems, build ideas and pitch like a founder.',
    emoji: '🚀',
    color: '#7C5CBF',
  },
  {
    id: 'leadership',
    name: 'Leadership, Identity & Personal Development',
    short: 'Leadership',
    description: 'Grow your confidence, voice and sense of purpose.',
    emoji: '🌟',
    color: '#C4661F',
  },
  {
    id: 'civic',
    name: 'Civic Responsibility & Social Impact',
    short: 'Community',
    description: 'Understand your rights and make a difference locally.',
    emoji: '🌍',
    color: '#2D7A6E',
  },
]

export const pillarById = (id) => PILLARS.find(p => p.id === id)
