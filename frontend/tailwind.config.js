
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        "colors": {
            "background": "#f8f9fa",
            "on-error": "#ffffff",
            "primary-fixed-dim": "#b1c5ff",
            "on-surface-variant": "#444650",
            "tertiary-fixed-dim": "#a9c7ff",
            "on-error-container": "#93000a",
            "secondary-fixed": "#d5e3ff",
            "on-tertiary-container": "#5090ed",
            "on-tertiary": "#ffffff",
            "surface-container-lowest": "#ffffff",
            "surface": "#f8f9fa",
            "inverse-surface": "#2e3132",
            "secondary": "#505f79",
            "surface-variant": "#e1e3e4",
            "primary-container": "#002560",
            "on-secondary-container": "#54637d",
            "on-secondary-fixed-variant": "#384760",
            "on-primary": "#ffffff",
            "secondary-fixed-dim": "#b8c7e5",
            "on-secondary-fixed": "#0b1c32",
            "on-surface": "#191c1d",
            "on-background": "#191c1d",
            "tertiary-fixed": "#d6e3ff",
            "outline-variant": "#c5c6d2",
            "inverse-primary": "#b1c5ff",
            "on-primary-container": "#708ed8",
            "on-tertiary-fixed": "#001b3d",
            "on-tertiary-fixed-variant": "#00468c",
            "surface-container": "#edeeef",
            "error-container": "#ffdad6",
            "surface-container-low": "#f3f4f5",
            "surface-dim": "#d9dadb",
            "primary": "#001237",
            "surface-container-high": "#e7e8e9",
            "on-primary-fixed": "#001946",
            "secondary-container": "#d1e0ff",
            "on-secondary": "#ffffff",
            "tertiary-container": "#002855",
            "outline": "#757682",
            "surface-container-highest": "#e1e3e4",
            "error": "#ba1a1a",
            "primary-fixed": "#dae2ff",
            "tertiary": "#001430",
            "on-primary-fixed-variant": "#224489",
            "surface-tint": "#3d5ca2",
            "surface-bright": "#f8f9fa",
            "inverse-on-surface": "#f0f1f2"
    },
    "borderRadius": {
            "DEFAULT": "0.125rem",
            "lg": "0.25rem",
            "xl": "0.5rem",
            "full": "0.75rem"
    },
    "fontFamily": {
            "headline": ["Manrope"],
            "body": ["Inter"],
            "label": ["Inter"]
    }
  },
  plugins: [],
}
}
