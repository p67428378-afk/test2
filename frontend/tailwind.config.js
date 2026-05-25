
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-tint": "#3d5ca2",
        "on-primary": "#ffffff",
        "inverse-surface": "#2d3133",
        "on-tertiary-fixed": "#390c00",
        "on-primary-fixed": "#001946",
        "on-tertiary-container": "#e17f5d",
        "background": "#f7f9fb",
        "primary-fixed": "#dae2ff",
        "surface-bright": "#f7f9fb",
        "on-surface": "#191c1e",
        "on-error": "#ffffff",
        "on-primary-fixed-variant": "#224489",
        "error-container": "#ffdad6",
        "surface-container-highest": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        "tertiary-fixed-dim": "#ffb59c",
        "surface-container-high": "#e6e8ea",
        "secondary-container": "#d5e3fc",
        "surface-variant": "#e0e3e5",
        "on-tertiary-fixed-variant": "#7a3014",
        "surface-dim": "#d8dadc",
        "secondary-fixed-dim": "#b9c7df",
        "tertiary-container": "#5d1b02",
        "outline": "#747782",
        "primary": "#001a48",
        "outline-variant": "#c4c6d2",
        "tertiary-fixed": "#ffdbd0",
        "secondary-fixed": "#d5e3fc",
        "primary-container": "#002d72",
        "on-secondary-fixed-variant": "#3a485b",
        "inverse-on-surface": "#eff1f3",
        "inverse-primary": "#b1c5ff",
        "on-secondary-fixed": "#0d1c2e",
        "surface-container": "#eceef0",
        "on-error-container": "#93000a",
        "error": "#ba1a1a",
        "on-secondary": "#ffffff",
        "secondary": "#515f74",
        "on-tertiary": "#ffffff",
        "primary-fixed-dim": "#b1c5ff",
        "surface": "#f7f9fb",
        "on-primary-container": "#7a97e2",
        "surface-container-low": "#f2f4f6",
        "on-secondary-container": "#57657a",
        "tertiary": "#3b0d00",
        "on-background": "#191c1e",
        "on-surface-variant": "#444651"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      fontFamily: {
        "headline": ["Manrope"],
        "body": ["Inter"],
        "label": ["Public Sans"]
      }
    },
  },
  plugins: [],
}
