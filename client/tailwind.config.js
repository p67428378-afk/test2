/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2663EB",
        "primary-hover": "#1D4ED8",
        surface: "#FFFFFF",
        background: "#F7FAFC",
        textPrimary: "#171C29",
        textSecondary: "#707A8C",
        borderCustom: "#E3E8F0",
        inputBg: "#F2F5FA",
        success: "#17A34A",
        warning: "#EB9917",
        danger: "#DB2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
