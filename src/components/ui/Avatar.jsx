import { avatarById } from '../../data/avatars'

const SIZES = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export default function Avatar({ avatarId, size = 'md', ring = false, className = '' }) {
  const avatar = avatarById(avatarId)
  return (
    <div
      className={`${SIZES[size]} rounded-full overflow-hidden flex-shrink-0 ${
        ring ? 'ring-4 ring-white' : ''
      } ${className}`}
    >
      <img src={avatar.file} alt={avatar.name} className="w-full h-full object-cover scale-110" />
    </div>
  )
}
