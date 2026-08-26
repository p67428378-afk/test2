/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2663eb",
          accent: "#eb9917",
          surface: "#ffffff",
          bg: "#f7fafc",
          textPrimary: "#171c29",
          textSecondary: "#707a8c",
          border: "#e3e8f0",
        },
      },
    },
  },
  plugins: [],
};
