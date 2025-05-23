/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ff',
          100: '#cceaff',
          200: '#99d6ff',
          300: '#66c1ff',
          400: '#33adff',
          500: '#1DA1F2', // Twitter Blue
          600: '#0d8ecf',
          700: '#0974a6',
          800: '#065a7f',
          900: '#04415c',
        },
        secondary: {
          50: '#f0f2f5',
          100: '#e1e4eb',
          200: '#c2cad7',
          300: '#a4afc3',
          400: '#8595af',
          500: '#677a9b',
          600: '#52627c',
          700: '#3e495d',
          800: '#29313e',
          900: '#15181f',
        },
        success: {
          500: '#00BA7C', // Twitter success green
        },
        error: {
          500: '#F4212E', // Twitter error red
        },
        warning: {
          500: '#FFAD1F', // Twitter warning yellow
        },
        background: {
          light: '#FFFFFF',
          dark: '#15202B',
        },
        text: {
          primary: {
            light: '#0F1419',
            dark: '#F7F9F9',
          },
          secondary: {
            light: '#536471',
            dark: '#8899A6',
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slight': 'bounceSlight 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSlight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};