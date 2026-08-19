/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2663EB",
          hover: "#1D4ED8",
        },
        accent: "#EB9917",
        surface: "#FFFFFF",
        background: "#F7FAFC",
        textPrimary: "#171C29",
        textSecondary: "#707A8C",
        border: "#E3E8F0",
        inputBg: "#F2F5FA",
        success: "#17A34A",
        warning: "#EB9917",
        error: "#DB2626",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
