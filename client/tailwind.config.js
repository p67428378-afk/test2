/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        accent: "#D97706",
        surface: "#FFFFFF",
        background: "#F8FAFC",
        textPrimary: "#0F172A",
        textSecondary: "#707A8C",
        success: "#059669",
        warning: "#D97706",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
