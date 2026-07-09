/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dg: {
          yellow: "#FFD100",
          black: "#1A1A1A",
        },
      },
    },
  },
  plugins: [],
};
