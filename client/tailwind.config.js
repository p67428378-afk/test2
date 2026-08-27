/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2663EB",
          accent: "#3B82F6",
          dark: "#1D4ED8",
          light: "#EFF6FF",
        },
        editor: {
          bg: "#F7FAFC",
          surface: "#FFFFFF",
          inputBg: "#F8FAFC",
          border: "#E2E8F0",
          textPrimary: "#171C29",
          textSecondary: "#64748B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
