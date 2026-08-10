/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zazi: {
          orange:       '#E07A2F',
          'orange-light': '#F5915A',
          'orange-dark':  '#C4661F',
          teal:         '#3B9A8C',
          'teal-light': '#4DB6A6',
          'teal-dark':  '#2D7A6E',
          purple:       '#7C5CBF',
          'purple-light':'#9B7DD4',
          gold:         '#F0A500',
          cream:        '#FAF8F2',
          navy:         '#1C2B3A',
          'navy-light': '#2D3F52',
          muted:        '#8A9BB0',
          'input-bg':   '#F0EDE8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(28,43,58,0.08)',
        'card-hover': '0 4px 20px rgba(28,43,58,0.14)',
      },
    },
  },
  plugins: [],
}

