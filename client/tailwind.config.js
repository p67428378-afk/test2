/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#725c00',
          light: '#ffe07c',
          dark: '#564500',
          container: '#ffd200',
          'on-container': '#705b00',
        },
        secondary: {
          DEFAULT: '#545f73',
          container: '#d5e0f8',
          'on-container': '#586377',
        }
      }
    },
  },
  plugins: [],
}
