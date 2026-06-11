/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "on-tertiary-fixed-variant": "#703700",
        "primary-fixed-dim": "#c0c1ff",
        "on-tertiary-container": "#452000",
        "on-secondary-fixed": "#0d1c2f",
        "tertiary-fixed-dim": "#ffb783",
        "primary-container": "#8083ff",
        "secondary-container": "#3c4a5e",
        "on-primary": "#1000a9",
        "surface-container-lowest": "#0d0d15",
        "primary": "#c0c1ff",
        "on-secondary-container": "#abb9d2",
        "surface-bright": "#393841",
        "on-surface": "#e4e1ed",
        "on-primary-container": "#0d0096",
        "surface-dim": "#13131b",
        "secondary-fixed-dim": "#b9c7e0",
        "on-error-container": "#ffdad6",
        "on-tertiary": "#4f2500",
        "secondary": "#b9c7e0",
        "surface-container-high": "#292932",
        "outline-variant": "#464554",
        "primary-fixed": "#e1e0ff",
        "background": "#13131b",
        "on-background": "#e4e1ed",
        "surface-tint": "#c0c1ff",
        "surface": "#13131b",
        "surface-container": "#1f1f27",
        "on-error": "#690005",
        "secondary-fixed": "#d5e3fd",
        "tertiary-fixed": "#ffdcc5",
        "on-surface-variant": "#c7c4d7",
        "on-tertiary-fixed": "#301400",
        "tertiary": "#ffb783",
        "inverse-on-surface": "#303038",
        "surface-variant": "#34343d",
        "on-secondary": "#233144",
        "on-primary-fixed": "#07006c",
        "on-secondary-fixed-variant": "#3a485c"
      },
      spacing: {
        "stack-md": "1rem",
        "stack-lg": "2rem",
        "stack-sm": "0.5rem",
        "gutter": "1.5rem",
        "sidebar-width": "280px",
        "container-margin": "2rem"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}