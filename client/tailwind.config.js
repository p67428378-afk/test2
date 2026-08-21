/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6173f5",
        accent: "#6173f5",
        surface: "#1f293b",
        background: "#0f1729",
        textPrimary: "#f7fafc",
        textSecondary: "#94a3b8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
