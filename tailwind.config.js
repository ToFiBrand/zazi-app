/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zazi: {
          // Primary action colour
          orange:        '#FF8A00',
          'orange-light': '#FFA53D',
          'orange-dark':  '#E67A00',
          // Deep teal — headings, secondary actions, digital pillar
          teal:          '#006E68',
          'teal-light':   '#4B9992',
          'teal-dark':    '#0D665F',
          // Warm yellow — finance pillar, badges, highlights
          gold:          '#F4B84C',
          'gold-dark':    '#DE9E2E',
          // Soft green — civic/community pillar, positive status
          green:         '#9BC9A7',
          'green-dark':   '#5F9770',
          // Coral — entrepreneurship pillar accent
          coral:         '#E8603C',
          'coral-dark':   '#C94B2B',
          // Warm neutrals
          cream:         '#F8F1DF',
          'cream-dark':   '#EFE4C9',
          navy:          '#17283A',
          'navy-light':   '#243B52',
          muted:         '#6E7A8A',
          'input-bg':    '#F1E8D3',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 14px rgba(23,40,58,0.07)',
        'card-hover': '0 8px 28px rgba(23,40,58,0.14)',
        soft: '0 1px 3px rgba(23,40,58,0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
