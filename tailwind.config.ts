import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0a1628",
        primary: "#06B6D4",
        secondary: "#0EA5E9",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "aqua-gradient": "linear-gradient(135deg, #06B6D4 0%, #0EA5E9 50%, #2563EB 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
