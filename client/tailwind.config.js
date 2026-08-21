/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff6e00",
        accent: "#ff6e00",
        surface: "#ffffff",
        background: "#f2faff",
        text_primary: "#1a2640",
        text_secondary: "#668099",
        success: "#26bf59",
        warning: "#ffb800",
        error: "#f24040",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
