/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#0C0C0C",
        primary: "#0C0C0C",     // black (main)
        secondary: "#FFFFFF",   // white
        muted: "#EDEDED",       // soft gray
        border: "#E5E5E5",
        "gray-mid": "#D0D0D0",
        "gray-dark": "#888888",
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["Outfit", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        "marquee": "marquee 22s linear infinite",
        "spotlight-fill": "spotlight-fill 3s linear forwards",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(22px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "spotlight-fill": { "0%": { width: "0%" }, "100%": { width: "100%" } },
      },
    },
  },
  plugins: [],
}
