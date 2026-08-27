/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2663EB",
          accent: "#17A34A",
          surface: "#FFFFFF",
          bg: "#F7FAFC",
          inputBg: "#F2F5FA",
          textPrimary: "#171C29",
          textSecondary: "#707A8C",
          border: "#E3E8F0",
          success: "#17A34A",
          warning: "#EAB308",
          error: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
