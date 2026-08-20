/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2663EB",
        secondary: "#707A8C",
        accent: "#EB9917",
        bgLight: "#F7FAFC",
        surface: "#FFFFFF",
        borderLight: "#E3E8F0",
        textPrimary: "#171C29",
        textSecondary: "#707A8C",
        success: "#17A34A",
        warning: "#EB9917",
        error: "#DB2626",
      },
    },
  },
  plugins: [],
};
