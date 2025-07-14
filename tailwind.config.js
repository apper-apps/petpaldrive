/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: '#5B4E8C',
        secondary: '#8B7AB8',
        accent: '#FF6B6B',
        surface: '#FFFFFF',
        background: '#F8F5FF',
        success: '#4ECDC4',
        warning: '#FFD93D',
        error: '#FF6B6B',
        info: '#4A90E2',
      },
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Inter', 'sans-serif'],
      },
scale: {
        '101': '1.01',
        '102': '1.02',
        '103': '1.03',
      },
      spacing: {
        '18': '4.5rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
      },
      animation: {
        'checkmark': 'checkmark 0.5s ease-out',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        checkmark: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}