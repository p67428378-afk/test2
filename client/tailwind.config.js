/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        secondary: "#515F74",
        accent: "#3B82F6",
        surface: "#FFFFFF",
        background: "#F8FAFC",
      },
    },
  },
  plugins: [],
};
