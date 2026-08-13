/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EBF5FF',
          100: '#D9EBFF',
          200: '#BAD6FF',
          300: '#8BBAFF',
          400: '#508DFF',
          500: '#1F65FF',
          600: '#084DE6',
          700: '#0137C1',
          800: '#012A98',
          900: '#012170',
          950: '#010B2E',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
