import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|modal|ripple|spinner).js"
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};

export default config;
