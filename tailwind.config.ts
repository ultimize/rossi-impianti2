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
        bg: "#101214",
        surface: "#16191d",
        surface2: "#0d0f11",
        border: "#20242a",
        border2: "#2c3137",
        text1: "#ffffff",
        text2: "#c7ccd2",
        muted: "#9aa1a9",
        muted2: "#7c848d",
        faint: "#5a626b",
        rosso: {
          DEFAULT: "#E11D17",
          hover: "#c2160f",
        },
        azzurro: "#2BB3EF",
        stella: "#F5A623",
        stripe: "#635BFF",
        paypal: "#FFC439",
      },
      fontFamily: {
        saira: ["var(--font-saira-condensed)", "sans-serif"],
        plex: ["var(--font-ibm-plex-sans)", "sans-serif"],
        archivo: ["var(--font-archivo)", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        btn: "3px",
      },
    },
  },
  plugins: [],
};
export default config;
