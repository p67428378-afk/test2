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
        "tertiary": "#ffb783",
        "on-secondary-container": "#ffdcdc",
        "on-primary-container": "#0d0096",
        "surface-container-low": "#1b1b23",
        "surface-dim": "#13131b",
        "surface-container": "#1f1f27",
        "on-secondary-fixed": "#40000c",
        "primary-fixed": "#e1e0ff",
        "on-primary-fixed": "#07006c",
        "background": "#13131b",
        "surface": "#13131b",
        "secondary-container": "#cc003c",
        "on-error": "#690005",
        "primary": "#c0c1ff",
        "inverse-surface": "#e4e1ed",
        "on-tertiary-fixed": "#301400",
        "tertiary-fixed-dim": "#ffb783",
        "on-tertiary": "#4f2500",
        "on-background": "#e4e1ed",
        "surface-container-high": "#292932",
        "error-container": "#93000a",
        "on-tertiary-fixed-variant": "#703700",
        "tertiary-container": "#d97721",
        "inverse-primary": "#494bd6",
        "surface-bright": "#393841",
        "surface-variant": "#34343d",
        "surface-container-highest": "#34343d",
        "secondary-fixed": "#ffdada",
        "tertiary-fixed": "#ffdcc5",
        "on-tertiary-container": "#452000",
        "on-secondary-fixed-variant": "#920028",
        "inverse-on-surface": "#303038",
        "error": "#ffb4ab",
        "outline": "#908fa0",
        "on-surface-variant": "#c7c4d7",
        "on-error-container": "#ffdad6",
        "on-secondary": "#68001a",
        "outline-variant": "#464554",
        "surface-container-lowest": "#0d0d15",
        "primary-container": "#8083ff",
        "secondary-fixed-dim": "#ffb3b6",
        "on-surface": "#e4e1ed",
        "on-primary-fixed-variant": "#2f2ebe",
        "on-primary": "#1000a9",
        "surface-tint": "#c0c1ff",
        "primary-fixed-dim": "#c0c1ff",
        "secondary": "#ffb3b6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "12px",
        "button-gap": "8px",
        "unit": "4px",
        "container-padding": "20px",
        "margin-page": "24px"
      },
      fontFamily: {
        "display-result": ["Inter"],
        "label-sm": ["Inter"],
        "display-result-mobile": ["Inter"],
        "history-entry": ["Inter"],
        "button-label": ["Inter"]
      },
      fontSize: {
        "display-result": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "display-result-mobile": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "history-entry": ["18px", { "lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400" }],
        "button-label": ["20px", { "lineHeight": "24px", "letterSpacing": "0.01em", "fontWeight": "500" }]
      }
    },
  },
  plugins: [],
}