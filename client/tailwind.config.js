/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#051424",
          surface: "#122131",
          border: "#273647",
          cyan: "#00f0ff",
          purple: "#7000ff",
          teal: "#00dbe9",
          text: "#d4e4fa",
          muted: "#849495",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
