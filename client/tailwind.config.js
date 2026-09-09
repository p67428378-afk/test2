/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          950: "#103333",
          900: "#1E4A4A",
          800: "#275E5E",
          700: "#347575",
          600: "#469191",
          300: "#6DA59E",
          100: "#E6F2F0",
          50: "#F2F8F7",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
