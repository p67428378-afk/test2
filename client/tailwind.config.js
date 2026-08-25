/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6173f5",
        accent: "#f5a826",
        surface: "#1f293b",
        background: "#0f1729",
        text_primary: "#f7fafc",
        text_secondary: "#94a3b8",
        success: "#13db48",
        warning: "#f5a826",
        error: "#f04545",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
