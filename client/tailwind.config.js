/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2663eb",
        accent: "#4f46e5",
        surface: "#ffffff",
        background: "#f7fafc",
        text_primary: "#171c29",
        text_secondary: "#707a8c",
        success: "#17a34a",
        warning: "#f59e0b",
        error: "#db2626",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
