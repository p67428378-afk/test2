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
        "surface-container-highest": "#2d3449",
        "surface-container-low": "#131b2e",
        "secondary-fixed-dim": "#4edea3",
        "tertiary-container": "#ff516a",
        "on-primary": "#1000a9",
        "on-secondary": "#003824",
        "on-error-container": "#ffdad6",
        "primary-fixed-dim": "#c0c1ff",
        "on-tertiary-fixed-variant": "#92002a",
        "on-tertiary": "#67001b",
        "outline-variant": "#464554",
        "surface-variant": "#2d3449",
        "on-primary-fixed": "#07006c",
        "secondary": "#4edea3",
        "surface-container": "#171f33",
        "on-surface": "#dae2fd",
        "on-secondary-container": "#00311f",
        "outline": "#908fa0",
        "on-primary-fixed-variant": "#2f2ebe",
        "error": "#ffb4ab",
        "on-secondary-fixed": "#002113",
        "tertiary-fixed-dim": "#ffb2b7",
        "tertiary-fixed": "#ffdadb",
        "surface": "#0b1326",
        "surface-container-high": "#222a3d",
        "surface-dim": "#0b1326",
        "primary-fixed": "#e1e0ff",
        "on-tertiary-fixed": "#40000d",
        "inverse-primary": "#494bd6",
        "surface-container-lowest": "#060e20",
        "on-tertiary-container": "#5b0017",
        "on-background": "#dae2fd",
        "on-primary-container": "#0d0096",
        "tertiary": "#ffb2b7",
        "primary": "#c0c1ff",
        "background": "#0b1326",
        "on-secondary-fixed-variant": "#005236",
        "secondary-fixed": "#6ffbbe",
        "on-error": "#690005",
        "on-surface-variant": "#c7c4d7",
        "secondary-container": "#00a572",
        "primary-container": "#8083ff",
        "inverse-surface": "#dae2fd",
        "error-container": "#93000a",
        "surface-tint": "#c0c1ff",
        "surface-bright": "#31394d",
        "inverse-on-surface": "#283044"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "padding-container": "24px",
        "grid-gap": "12px",
        "button-size": "1fr",
        "container-width": "420px",
        "padding-display": "32px"
      },
      fontFamily: {
        "body-sm": ["Inter"],
        "button-text": ["Inter"],
        "label-md": ["Inter"],
        "display-lg": ["Inter"],
        "display-sm": ["Inter"]
      },
      fontSize: {
        "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "button-text": ["20px", { "lineHeight": "24px", "fontWeight": "600" }],
        "label-md": ["18px", { "lineHeight": "24px", "fontWeight": "500" }],
        "display-lg": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "display-sm": ["24px", { "lineHeight": "32px", "fontWeight": "600" }]
      }
    },
  },
  plugins: [],
}