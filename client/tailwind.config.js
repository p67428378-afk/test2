/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#041627",
          blue: "#0058be",
          accent: "#3b82f6",
          bg: "#f8f9ff",
          surface: "#ffffff",
          text: "#0b1c30",
          muted: "#44474c",
          success: "#09a34a",
          warning: "#eab308",
          error: "#ba1a1a",
        },
      },
    },
  },
  plugins: [],
};
