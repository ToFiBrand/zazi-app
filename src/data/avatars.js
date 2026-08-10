// The 8 Zazi character illustrations. Used for contributors, student
// creators, and the profile avatar picker — never random stock photos.
export const AVATARS = [
  { id: 'thabo',    name: 'Thabo',    persona: 'Future Builder',    file: '/avatars/thabo.svg' },
  { id: 'amahle',   name: 'Amahle',   persona: 'Creative Leader',   file: '/avatars/amahle.svg' },
  { id: 'sipho',    name: 'Sipho',    persona: 'Tech Explorer',     file: '/avatars/sipho.svg' },
  { id: 'dumisani', name: 'Dumisani', persona: 'Visionary',         file: '/avatars/dumisani.svg' },
  { id: 'kagiso',   name: 'Kagiso',   persona: 'Idea Generator',    file: '/avatars/kagiso.svg' },
  { id: 'lerato',   name: 'Lerato',   persona: 'Problem Solver',    file: '/avatars/lerato.svg' },
  { id: 'nomusa',   name: 'Nomusa',   persona: 'Community Voice',   file: '/avatars/nomusa.svg' },
  { id: 'zanele',   name: 'Zanele',   persona: 'Change Maker',      file: '/avatars/zanele.svg' },
]

export const avatarById = (id) => AVATARS.find(a => a.id === id) || AVATARS[0]
