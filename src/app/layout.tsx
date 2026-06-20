import type { Metadata } from "next";
import { Saira_Condensed, IBM_Plex_Sans, Archivo } from "next/font/google";
import "./globals.css";

const sairaCondensed = Saira_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-saira-condensed",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Rossi Impianti srl | Riscaldamento e Condizionamento Vicenza",
  description: "Progettiamo e costruiamo impianti industriali, riscaldamento, condizionamento e antincendio chiavi in mano dal 1980 a Vicenza e provincia.",
  metadataBase: new URL("https://www.rossimpiantisrl.it"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="scroll-smooth">
      <body
        className={`${sairaCondensed.variable} ${ibmPlexSans.variable} ${archivo.variable} font-plex bg-bg text-text1 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
