/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005c55',
        'teal-dark': '#0F766E',
        'amber-alert': '#D97706',
        'slate-bg': '#F8FAFC',
        'slate-border': '#E2E8F0',
        surface: '#f7faf8',
        'on-surface': '#181c1c',
        'surface-container': '#ebefed',
        'surface-container-highest': '#e0e3e1',
        'inverse-surface': '#2d3130',
        'on-surface-variant': '#3e4947',
        'primary-container': '#0f766e',
        'on-primary-container': '#a3faef',
        'secondary-fixed': '#ffdcc3',
        outline: '#6e7977',
        'outline-variant': '#bdc9c6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
