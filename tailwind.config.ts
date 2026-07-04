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
        // Sfondi
        bg: "#FFFFFF",
        "bg-alt": "#F6F7F9",
        bgAlt: "#F6F7F9",
        surface: "#FFFFFF",
        surface2: "#F9FAFB",
        "surface-2": "#F9FAFB",
        chip: "#F4F6F8",
        // Bordi
        border: "#EBEEF1",
        border2: "#DFE4E9",
        "border-2": "#DFE4E9",
        // Testo
        text: "#15181C",
        text1: "#15181C",
        "text-hero": "#13171C",
        text2: "#5B646D",
        "text-2": "#5B646D",
        muted: "#8A929B",
        muted2: "#8A929B",
        "muted-2": "#8A929B",
        faint: "#AAB0B7",
        // Rosso brand
        rosso: {
          DEFAULT: "#E11D17",
          hover: "#C2160F",
          dark: "#B81912",
          tint: "#FFF5F4",
          "tint-border": "#F7D9D7",
        },
        "rosso-hover": "#C2160F",
        // Azzurro brand
        azzurro: {
          DEFAULT: "#1497D6",
          hover: "#0D7FB8",
          tint: "#EAF4FB",
          "tint-border": "#CFE7F6",
        },
        "azzurro-hover": "#0D7FB8",
        // Accenti
        stella: "#F5A623",
        stripe: "#635BFF",
        paypal: "#FFC439",
      },
      fontFamily: {
        // I titoli usano Archivo (restyle chiaro). Il token "saira" e'
        // ripuntato su Archivo per compatibilita' con le classi esistenti.
        saira: ["var(--font-archivo)", "sans-serif"],
        plex: ["var(--font-ibm-plex-sans)", "sans-serif"],
        archivo: ["var(--font-archivo)", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "10px",
        input: "10px",
        pill: "100px",
      },
      boxShadow: {
        card: "0 12px 30px -26px rgba(20,30,45,.22)",
        "card-hover": "0 24px 44px -24px rgba(20,30,45,.28)",
        cta: "0 30px 60px -28px rgba(225,29,23,.5)",
        btn: "0 8px 22px rgba(225,29,23,.24)",
      },
    },
  },
  plugins: [],
};
export default config;
