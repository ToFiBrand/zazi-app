import { avatarById } from '../../data/avatars'
import AvatarRenderer from './AvatarRenderer'

const SIZES = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
}

// `customization` (a modular avatar object — see src/data/avatarParts.js)
// takes priority when present. Every existing call site that only ever
// passed `avatarId` keeps rendering exactly as before via the legacy
// branch below — this is the entire backward-compatibility contract for
// the 8 seeded illustration avatars and everything authored under them.
export default function Avatar({ avatarId, customization, size = 'md', ring = false, className = '' }) {
  if (customization) {
    return <AvatarRenderer customization={customization} size={size} ring={ring} className={className} />
  }
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
