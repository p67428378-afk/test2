/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F4F7F4",
          100: "#E0F2E4",
          500: "#66BB6A",
          600: "#1C8A5C",
          700: "#0F4E34",
        },
      },
    },
  },
  plugins: [],
};
