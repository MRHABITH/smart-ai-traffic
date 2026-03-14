/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        navy: {
          950: '#020817',
          900: '#0a1628',
          800: '#0f2040',
          700: '#152a54',
        },
        electric: {
          DEFAULT: '#2563eb',
          bright: '#3b82f6',
        },
        signal: {
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient-shift 6s ease infinite',
        'float': 'float-up 4s ease-in-out infinite',
        'scan': 'scan-line 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
