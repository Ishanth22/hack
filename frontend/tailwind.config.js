/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#05060a',
          900: '#090d14',
          800: '#0e1420',
          700: '#131d2e',
          600: '#1a2640',
        },
        neon: {
          cyan: '#00f5ff',
          green: '#00ff88',
          amber: '#ffb800',
          red: '#ff3d5a',
          purple: '#9d4edd',
        },
      },
    },
  },
  plugins: [],
}
