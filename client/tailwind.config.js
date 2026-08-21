/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1485b8",
          hover: "#0f6e99",
          light: "#e8f4f8",
        },
        secondary: "#f0f5fa",
        accent: "#0885b8",
        surface: "#ffffff",
        background: "#f5fafc",
        text: {
          primary: "#171f2e",
          secondary: "#6b7a8f",
        },
        border: "#e0e8f0",
        success: "#149e52",
        warning: "#eb9414",
        error: "#db2727",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
