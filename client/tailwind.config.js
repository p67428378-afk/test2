/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2663eb",
        accent: "#17a34a",
        background: "#f7fafc",
        surface: "#ffffff",
        surfaceAlt: "#f2f5fa",
        textPrimary: "#171c29",
        textSecondary: "#707a8c",
        borderLight: "#e3e8f0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
