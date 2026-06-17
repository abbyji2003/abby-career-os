import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#f8f1e7",
        parchment: "#efe3d2",
        bone: "#fbf8f2",
        linen: "#e3d3bd",
        ink: "#171513",
        graphite: "#2a2723",
        mist: "rgba(255,255,255,0.54)",
      },
      boxShadow: {
        glass: "0 24px 70px rgba(51, 43, 34, 0.12)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.66)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
