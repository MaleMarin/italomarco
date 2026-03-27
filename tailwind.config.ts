import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "film-studio":
          "radial-gradient(circle at 50% 32%, #2a2a2a 0%, #181818 26%, #0c0c0c 52%, #030303 78%, #000000 100%)",
      },
      colors: {
        void: "#0A0A0A",
        carve: "#151515",
        mist: "#FFFFFF",
        mercury: "#E5E5E5",
        electric: "#0052FF",
        "electric-blue": "#0052FF",
        "mercury-silver": "#E5E5E5",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      perspective: {
        "1000": "1000px",
      },
    },
  },
  plugins: [],
};

export default config;
