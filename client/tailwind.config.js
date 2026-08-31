/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1466bf",
          light: "#2579d8",
          dark: "#0e4b8f",
        },
        accent: {
          DEFAULT: "#149e52",
          light: "#1dc266",
          dark: "#0e733b",
        },
        background: "#f5f7fc",
        surface: "#ffffff",
        textPrimary: "#171f2e",
        textSecondary: "#6b758a",
        borderLight: "#dee3ed",
        warning: "#eb941a",
        error: "#d92d2d",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
