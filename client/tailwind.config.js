/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-error": "#ffffff",
        "primary": "#000000",
        "surface-tint": "#565e74",
        "on-surface": "#0b1c30",
        "on-tertiary-container": "#98805d",
        "inverse-primary": "#bec6e0",
        "surface-container-highest": "#d3e4fe",
        "secondary-fixed-dim": "#4edea3",
        "secondary": "#006c49",
        "primary-fixed-dim": "#bec6e0",
        "surface-container-lowest": "#ffffff",
        "inverse-surface": "#213145",
        "background": "#f8f9ff",
        "surface-container-low": "#eff4ff",
        "on-tertiary-fixed": "#271901",
        "on-secondary-container": "#00714d",
        "tertiary-fixed": "#fcdeb5",
        "on-secondary": "#ffffff",
        "tertiary": "#000000",
        "tertiary-fixed-dim": "#dec29a",
        "on-tertiary": "#ffffff",
        "inverse-on-surface": "#eaf1ff",
        "on-error-container": "#93000a",
        "primary-fixed": "#dae2fd",
        "on-secondary-fixed": "#002113",
        "on-primary-fixed": "#131b2e",
        "on-tertiary-fixed-variant": "#574425",
        "surface-container": "#e5eeff",
        "on-primary-fixed-variant": "#3f465c",
        "on-primary-container": "#7c839b",
        "surface-dim": "#cbdbf5",
        "surface": "#f8f9ff",
        "error-container": "#ffdad6",
        "on-secondary-fixed-variant": "#005236",
        "surface-variant": "#d3e4fe",
        "on-primary": "#ffffff",
        "secondary-container": "#6cf8bb",
        "outline-variant": "#c6c6cd",
        "primary-container": "#131b2e",
        "outline": "#76777d",
        "secondary-fixed": "#6ffbbe",
        "error": "#ba1a1a"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "sm": "8px",
        "unit": "4px",
        "md": "16px",
        "lg": "24px",
        "container-max": "1280px",
        "xs": "4px",
        "margin-desktop": "32px",
        "gutter": "24px",
        "xxl": "48px",
        "xl": "32px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
