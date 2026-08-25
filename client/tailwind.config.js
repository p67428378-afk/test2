/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2663eb",
          accent: "#17a34a",
          dark: "#171c29",
          muted: "#707a8c",
          border: "#e3e8f0",
          bg: "#f7fafc",
          input: "#f2f5fa",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
