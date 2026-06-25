/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary-container": "#d97721",
        secondary: "#c0c1ff",
        "on-background": "#e4e1ed",
        outline: "#908fa0",
        primary: "#c0c1ff",
        surface: "#13131b",
        background: "#13131b",
        "primary-accent": "#6366F1",
        "primary-accent-hover": "#818CF8",
        "primary-accent-active": "#4F46E5",
        "surface-custom": "#1E293B",
        "outline-variant-custom": "#334155",
        "text-secondary-custom": "#94A3B8",
      },
      spacing: {
        md: "16px",
        "margin-desktop": "40px",
        base: "4px",
        sm: "8px",
        "margin-mobile": "16px",
        "3xl": "64px",
        xs: "4px",
        xl: "32px",
        lg: "24px",
        "2xl": "48px",
        gutter: "24px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
