/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amber: {
          800: "#8d493a",
          900: "#6e352b",
        },
        stone: {
          50: "#fbf9f6",
        },
      },
      fontFamily: {
        sans: ['"Work Sans"', "sans-serif"],
        display: ["Manrope", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
