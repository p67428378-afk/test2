/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container": "#eceef0",
        "on-secondary-fixed": "#131b2e",
        "on-primary-fixed-variant": "#653e00",
        "surface-container-highest": "#e0e3e5",
        "surface-tint": "#855300",
        "on-primary-fixed": "#2a1700",
        "background": "#f7f9fb",
        "outline": "#867461",
        "on-secondary-container": "#5c647a",
        "on-surface": "#191c1e",
        "on-error-container": "#93000a",
        "primary-fixed": "#ffddb8",
        "tertiary-fixed": "#d8e2ff",
        "on-secondary": "#ffffff",
        "tertiary-fixed-dim": "#adc6ff",
        "inverse-on-surface": "#eff1f3",
        "on-surface-variant": "#534434",
        "on-primary": "#ffffff",
        "surface-dim": "#d8dadc",
        "surface-container-lowest": "#ffffff",
        "primary": "#855300",
        "on-tertiary-fixed": "#001a42",
        "surface-bright": "#f7f9fb",
        "inverse-primary": "#ffb95f",
        "primary-fixed-dim": "#ffb95f",
        "secondary-fixed": "#dae2fd",
        "inverse-surface": "#2d3133",
        "tertiary": "#005ac2",
        "error": "#ba1a1a",
        "on-primary-container": "#613b00",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed-variant": "#004395",
        "outline-variant": "#d8c3ad",
        "secondary-fixed-dim": "#bec6e0",
        "secondary-container": "#dae2fd",
        "primary-container": "#f59e0b",
        "surface-container-low": "#f2f4f6",
        "on-tertiary-container": "#00408f",
        "on-error": "#ffffff",
        "tertiary-container": "#8ab0ff",
        "surface-variant": "#e0e3e5",
        "secondary": "#565e74",
        "on-secondary-fixed-variant": "#3f465c",
        "on-background": "#191c1e",
        "surface": "#f7f9fb",
        "surface-container-high": "#e6e8ea",
        "error-container": "#ffdad6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "stack-lg": "1.5rem",
        "container-max": "1440px",
        "margin-x": "2rem",
        "header-height": "64px",
        "gutter": "1.5rem",
        "stack-md": "1rem",
        "stack-sm": "0.5rem"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
