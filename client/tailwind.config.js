/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        accent: "#6366F1",
        surface: "#FFFFFF",
        background: "#F8FAFC",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#F43F5E",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
