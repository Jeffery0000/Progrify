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
      animation: {
        'bounce-once': 'bounce 1s ease-in-out 1',
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
  ]
};