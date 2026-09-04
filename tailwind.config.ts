import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexora: {
          bg: "#0B0F17",
          card: "#111827",
          border: "#1F2937",
          blue: "#00B4D8",
          darkBlue: "#0077B6",
          accent: "#00F5D4",
        },
      },
    },
  },
  plugins: [],
};

