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
        text: "#171c29",
        muted: "#707a8c",
        border: "#e3e8f0",
        success: "#17a34a",
        warning: "#eb9917",
        error: "#db2626",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
