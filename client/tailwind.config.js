/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2663EB",
          dark: "#1d4ed8",
          light: "#3b82f6",
        },
        accent: {
          DEFAULT: "#17A34A",
          dark: "#15803d",
        },
        surface: "#FFFFFF",
        background: "#F7FAFC",
        textPrimary: "#171C29",
        textSecondary: "#707A8C",
        borderLight: "#E3E8F0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
