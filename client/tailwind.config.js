/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2663eb",
          hover: "#1d4ed8",
          light: "#eff6ff",
        },
        accent: {
          DEFAULT: "#17a34a",
          hover: "#15803d",
          light: "#f0fdf4",
        },
        surface: "#ffffff",
        background: "#f7fafc",
        textPrimary: "#171c29",
        textSecondary: "#707a8c",
        borderColor: "#e3e8f0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
