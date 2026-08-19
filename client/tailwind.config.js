/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2663EB",
          dark: "#171C29",
          muted: "#707A8C",
          border: "#E3E8F0",
          bg: "#F7FAFC",
          accent: "#EB9917",
          success: "#17A34A",
          danger: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
