import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/plugin/tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite],
};

export default config;
