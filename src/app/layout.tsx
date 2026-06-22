import type { Metadata } from "next";
import { Saira_Condensed, IBM_Plex_Sans, Archivo } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import CookieBanner from "@/components/CookieBanner";

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
      <Script id="consent-default" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', {
          ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
          analytics_storage:'denied', functionality_storage:'granted', security_storage:'granted',
          wait_for_update: 500
        });
      `}</Script>
      <body
        className={`${sairaCondensed.variable} ${ibmPlexSans.variable} ${archivo.variable} font-plex bg-bg text-text1 antialiased`}
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
