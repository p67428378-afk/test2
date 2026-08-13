/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        festival: {
          bg: "#0F172A",
          surface: "#1E293B",
          primary: "#6366F1",
          accent: "#8B5CF6",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
