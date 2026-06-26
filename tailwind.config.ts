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
        bg: "#FFFFFF",
        "bg-alt": "#F6F7F9",
        bgAlt: "#F6F7F9",
        surface: "#FFFFFF",
        surface2: "#F2F4F7",
        "surface-2": "#F2F4F7",
        border: "#E4E7EC",
        border2: "#D0D5DD",
        "border-2": "#D0D5DD",
        text: "#15181D",
        text1: "#15181D",
        text2: "#475467",
        "text-2": "#475467",
        muted: "#667085",
        muted2: "#98A2B3",
        "muted-2": "#98A2B3",
        faint: "#98A2B3",
        rosso: {
          DEFAULT: "#E11D17",
          hover: "#C2160F",
        },
        "rosso-hover": "#C2160F",
        azzurro: "#1B9FE0",
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
