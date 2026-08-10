export default function Chip({ color = '#17283A', tone = 'soft', size = 'sm', icon, children, className = '' }) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-2.5 py-1' : 'text-xs px-3 py-1.5'
  const style = tone === 'solid'
    ? { background: color, color: '#fff' }
    : { background: color + '1F', color }
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full whitespace-nowrap ${sizeClass} ${className}`}
      style={style}
    >
      {icon}
      {children}
    </span>
  )
}
