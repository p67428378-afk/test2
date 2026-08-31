/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2D1B18",
          hover: "#1A0F0D",
          light: "#4A322D",
        },
        accent: {
          DEFAULT: "#D4AF37",
          light: "#F4E8C1",
          hover: "#C29B27",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F3EE",
          warm: "#FDFBF7",
        },
        heat: {
          warning: "#E65100",
          bg: "#FFF3E0",
          cold: "#00796B",
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
