import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          50:  '#eef2ff',
          100: '#e0e7ff',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        accent: {
          DEFAULT: '#cefe08',
          dark:    '#a8cc00',
          400:     '#d4fe3a',
          500:     '#cefe08',
          600:     '#a8cc00',
          glow:    'rgba(206,254,8,0.25)',
        },
        dark: {
          DEFAULT: '#0e0e0e',
          100:     '#1a1a1a',
          200:     '#222222',
          300:     '#2a2a2a',
        },
      },
      fontFamily: {
        heading: ['Unbounded', 'sans-serif'],
        display: ['Unbounded', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        alt:     ['Poppins', 'sans-serif'],
      },
      backgroundSize: {
        '300%': '300%',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 9s ease-in-out infinite',
        'glow':        'glowAccent 2.5s ease-in-out infinite alternate',
        'spin-slow':   'spin 12s linear infinite',
        'shimmer':     'shimmer 1.5s infinite',
        'border-pulse':'borderPulse 2s ease-in-out infinite',
        'slide-up':    'slideUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        glowAccent: {
          from: { boxShadow: '0 0 20px rgba(206,254,8,0.2)' },
          to:   { boxShadow: '0 0 50px rgba(206,254,8,0.5), 0 0 80px rgba(206,254,8,0.2)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(206,254,8,0.3)' },
          '50%':      { borderColor: 'rgba(206,254,8,0.7)' },
        },
      },
      dropShadow: {
        'accent': '0 0 20px rgba(206,254,8,0.5)',
        'glow':   '0 0 40px rgba(206,254,8,0.3)',
      },
    },
  },
  plugins: [forms],
};
