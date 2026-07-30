/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F766E", // Teal 700
          light: "#14B8A6", // Teal 500
          dark: "#115E59", // Teal 800
        },
        accent: {
          DEFAULT: "#F59E0B", // Amber 500
          light: "#FBBF24", // Amber 400
          dark: "#D97706", // Amber 600
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
