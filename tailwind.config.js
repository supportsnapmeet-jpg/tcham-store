/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FDFAF3',
          100: '#F7EDD0',
          200: '#EED9A0',
          400: '#C9A84C',
          600: '#A07830',
          800: '#6B4F1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 25s linear infinite',
      },
    },
  },
  plugins: [],
}
