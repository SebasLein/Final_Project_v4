import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#07111F',
        mist: '#D9F0FF',
        cyan: '#6EE7FF',
        violet: '#8B5CF6',
        emerald: '#22C55E',
        slateglass: 'rgba(15,23,42,0.55)'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(110,231,255,0.2), 0 20px 60px rgba(15,23,42,0.35)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)'
      }
    }
  },
  plugins: []
} satisfies Config;
