import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#0090dd',
          hover: '#00a1f7',
          active: '#007fc4',
        },
        success: {
          DEFAULT: '#7ACCBE',
          hover: '#8cd3c7',
          active: '#68c5b5',
        },
        info: {
          DEFAULT: '#8dcadf',
          hover: '#a1d3e5',
          active: '#79c1d9',
        },
        warning: {
          DEFAULT: '#FFC870',
          hover: '#ffd28a',
          active: '#ffbe57',
        },
        danger: {
          DEFAULT: '#EF6262',
          hover: '#f17979',
          active: '#ed4b4b',
        },
        dark: {
          DEFAULT: '#3d3c3c',
          hover: '#4a4949',
          active: '#302f2f',
          sidebar: '#383737',
          header: '#484747',
        },
      },
      fontFamily: {
        digit: ['clockicons', 'Orbitron', 'Courier New', 'monospace'],
        sans: ['"Open Sans"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
