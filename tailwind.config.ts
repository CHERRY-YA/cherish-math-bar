import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FFD6E8",
          "pink-light": "#FFF0F6",
          "pink-deep": "#FF99C8",
          mint: "#C1F0E8",
          "mint-light": "#E8F9F5",
          "mint-deep": "#80E0D0",
          sky: "#D0E8FF",
          "sky-light": "#F0F7FF",
          "sky-deep": "#99CEFF",
          yellow: "#FFF3B0",
          "yellow-light": "#FFFCE6",
          purple: "#E8D5C4",
          "purple-light": "#F3E8FF",
          lavender: "#E3D5CA",
        },
      },
      fontFamily: {
        jua: ["var(--font-jua)", "sans-serif"],
      },
      boxShadow: {
        jelly: "0 10px 25px -5px rgba(255, 153, 200, 0.4)",
        "jelly-mint": "0 10px 25px -5px rgba(128, 224, 208, 0.4)",
        "jelly-sky": "0 10px 25px -5px rgba(153, 206, 255, 0.4)",
        "pastel-soft": "0 8px 30px rgba(235, 180, 210, 0.25)",
      },
      borderRadius: {
        "4xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
