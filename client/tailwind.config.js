/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2663EB",
        secondary: "#171C29",
        accent: "#17A34A",
        surface: "#FFFFFF",
        textPrimary: "#171C29",
        textSecondary: "#707A8C",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
