import { Mic, Video, MessageCircle, Palette, Lightbulb, Trophy } from 'lucide-react'

// The 6 Create Hub tiles. Each maps to a contributions.content_type value —
// see STUDENT_CONTENT_TYPES in AppContext for the full type vocabulary
// (opinion/what_i_learned exist in the schema for future finer-grained
// sub-selection within "Share & Tell", not yet exposed as separate tiles).
export const CONTENT_TYPES = [
  { id: 'podcast', label: 'Zazi Voices', sub: 'Create a podcast or audio story', icon: Mic, color: '#0D665F' },
  { id: 'video', label: 'Short Video', sub: 'Create a short video about something you care about', icon: Video, color: '#FF8A00' },
  { id: 'story', label: 'Share & Tell', sub: 'Tell other young people something you learned, experienced or discovered', icon: MessageCircle, color: '#006E68' },
  { id: 'creative', label: 'Creative', sub: 'Share art, photography, poetry, music, design or writing', icon: Palette, color: '#F4B84C' },
  { id: 'idea', label: 'Zazi Ideas', sub: 'Share an idea for improving your school, community or the world', icon: Lightbulb, color: '#E8603C' },
  { id: 'challenge_submission', label: 'Zazi Challenge', sub: 'Respond to an official Zazi challenge', icon: Trophy, color: '#5F9770' },
]

export const EXPLORE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'podcast', label: 'Voices' },
  { id: 'video', label: 'Videos' },
  { id: 'story', label: 'Share & Tell' },
  { id: 'creative', label: 'Creative' },
  { id: 'idea', label: 'Ideas' },
  { id: 'challenge_submission', label: 'Challenges' },
]
