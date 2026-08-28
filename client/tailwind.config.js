/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2663EB",
          accent: "#3B82F6",
          bg: "#F7FAFC",
          dark: "#171C29",
          muted: "#707A8C",
          border: "#E3E8F0",
          success: "#17A34A",
          warning: "#EB9917",
          error: "#DB2626",
        },
      },
    },
  },
  plugins: [],
};
