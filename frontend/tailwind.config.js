/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Evita conflitti con i componenti MUI
  important: '#root',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF3E4',
          100: '#F3E0B8',
          200: '#E6C588',
          300: '#D9B679',
          400: '#C49E54',
          500: '#B8893E',
          600: '#8A6428',
          700: '#6E4F20',
          800: '#553D18',
          900: '#3F2D12',
        },
        ink: {
          DEFAULT: '#1C1712',
          soft: '#332A21',
        },
        ivory: {
          DEFAULT: '#FBF6EC',
          deep: '#F3E9D6',
        },
        tomato: '#7A2E2E',
        olive: '#3A4430',
        // Testo secondario del pannello admin (descrizioni, helper text).
        clay: '#6E3A22',
        danger: '#B3261E',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', '"Helvetica Neue"', 'sans-serif'],
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'bounce-soft': 'bounce-soft 2s infinite',
      },
    },
  },
  plugins: [],
}
