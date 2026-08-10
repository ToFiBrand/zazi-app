const VARIANTS = {
  primary:   'bg-zazi-orange text-white shadow-soft active:bg-zazi-orange-dark',
  secondary: 'bg-white text-zazi-teal border-2 border-zazi-teal active:bg-zazi-teal/5',
  tertiary:  'bg-transparent text-zazi-teal',
  dark:      'bg-zazi-navy text-white active:bg-zazi-navy-light',
  teal:      'bg-zazi-teal text-white active:bg-zazi-teal-dark',
}

const SIZES = {
  sm: 'text-xs px-4 py-2.5',
  md: 'text-sm px-5 py-3.5',
  lg: 'text-base px-6 py-4',
}

export default function Button({ variant = 'primary', size = 'md', full = false, className = '', children, ...props }) {
  return (
    <button
      className={`zazi-tap font-bold rounded-full inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
