/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2663EB",
          accent: "#17A34A",
          surface: "#FFFFFF",
          bg: "#F7FAFC",
          dark: "#171C29",
          muted: "#707A8C",
          border: "#E3E8F0",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
