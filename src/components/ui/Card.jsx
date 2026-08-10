export default function Card({ as, interactive = false, className = '', children, ...props }) {
  const Tag = as || (interactive ? 'button' : 'div')
  return (
    <Tag
      className={`bg-white rounded-3xl shadow-card ${interactive ? 'zazi-tap text-left' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
