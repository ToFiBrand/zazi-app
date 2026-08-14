import { baseAssetPath, partById } from '../../data/avatarParts'

const SIZES = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
  '3xl': 'w-full h-full', // creator-screen hero canvas — sized by its own wrapper
}

// Renders a modular avatar customization by stacking its parts in z-order.
// `state` is accepted now (idle/celebrating/...) but not yet used to swap
// assets — a future-proofing seam: a part can later gain a `states` map
// instead of a flat `asset`, and this renderer just needs to prefer
// `part.states?.[state] || part.asset`, no structural change here.
export default function AvatarRenderer({ customization, size = 'md', ring = false, state = 'idle', className = '' }) {
  if (!customization) return null
  const { baseId, skinTone, hairId, outfitId, accessoryId, headwearId, headphonesId } = customization

  const layers = [
    { key: 'base', asset: baseAssetPath(baseId, skinTone), zIndex: 0 },
    outfitId && { key: 'outfit', asset: partById('outfit', outfitId)?.asset, zIndex: 1 },
    accessoryId && { key: 'accessory', asset: partById('accessory', accessoryId)?.asset, zIndex: 2 },
    hairId && { key: 'hair', asset: partById('hair', hairId)?.asset, zIndex: 3 },
    headwearId && { key: 'headwear', asset: partById('headwear', headwearId)?.asset, zIndex: 4 },
    headphonesId && { key: 'headphones', asset: partById('headphones', headphonesId)?.asset, zIndex: 5 },
  ].filter(l => l && l.asset).sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div
      data-avatar-state={state}
      className={`${SIZES[size]} rounded-full overflow-hidden relative flex-shrink-0 bg-zazi-cream ${
        ring ? 'ring-4 ring-white' : ''
      } ${className}`}
    >
      {layers.map(l => (
        <img key={l.key} src={l.asset} alt="" className="absolute inset-0 w-full h-full" />
      ))}
    </div>
  )
}
