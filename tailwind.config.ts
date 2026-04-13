import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0B63F6",
          50: "#EAF2FF",
          100: "#D5E4FF",
          600: "#0B63F6",
          700: "#064FC9"
        }
      }
    }
  },
  plugins: []
};

export default config;
