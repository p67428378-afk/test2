/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aura: {
          gold: "#C5A059",
          amber: "#775A19",
          dark: "#2C2C2C",
          surface: "#FBF9F8",
          textPrimary: "#1B1C1C",
          textSecondary: "#4E4639",
          success: "#09A349",
          warning: "#BA8000",
          error: "#BA1A1A",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
