/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      keyframes: {
        'pet-idle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' },
        },
        'pet-easy': {
          '0%, 100%': { transform: 'scale(1) rotate(0)' },
          '30%': { transform: 'scale(1.1) rotate(5deg)' },
          '60%': { transform: 'scale(1.1) rotate(-5deg)' },
        },
        'pet-medium': {
          '0%, 100%': { transform: 'scale(1) rotate(0)' },
          '30%': { transform: 'scale(1.2) rotate(10deg)' },
          '60%': { transform: 'scale(1.2) rotate(-10deg)' },
        },
        'pet-hard': {
          '0%': { transform: 'scale(1) rotate(0) translateY(0)' },
          '30%': { transform: 'scale(1.3) rotate(15deg) translateY(-1rem)' },
          '60%': { transform: 'scale(1.3) rotate(-15deg) translateY(-1rem)' },
          '100%': { transform: 'scale(1) rotate(0) translateY(0)' },
        },
      },
      animation: {
        'bounce-once': 'bounce 1s ease-in-out 1',
        'pet-idle': 'pet-idle 2s ease-in-out infinite',
        'pet-easy': 'pet-easy 0.6s ease-in-out',
        'pet-medium': 'pet-medium 0.9s ease-in-out',
        'pet-hard': 'pet-hard 1.2s ease-in-out',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green-50',
    'bg-green-100',
    'bg-amber-50',
    'bg-amber-100',
    'bg-red-50',
    'bg-red-100',
    'border-green-500',
    'border-amber-500',
    'border-red-500',
    'text-green-600',
    'text-green-700',
    'text-green-800',
    'text-amber-600',
    'text-amber-700',
    'text-amber-800',
    'text-red-600',
    'text-red-700',
    'text-red-800',
    // Make sure all animation classes are included
    'animate-pet-idle',
    'animate-pet-easy',
    'animate-pet-medium',
    'animate-pet-hard',
    'transform',
    'transition-all',
    'duration-300'
  ]
};