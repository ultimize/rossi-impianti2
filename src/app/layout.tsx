import type { Metadata } from "next";
import { IBM_Plex_Sans, Archivo } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import CookieBanner from "@/components/CookieBanner";

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
  metadataBase: new URL("https://www.rossimpiantisrl.it"),
  title: "Rossi Impianti srl — Impianti termoidraulici e climatizzazione a Vicenza",
  description:
    "Rossi Impianti srl: progettazione e installazione di impianti termoidraulici, riscaldamento, climatizzazione e antincendio a Vicenza e provincia. Cantieri chiavi in mano dal 1980.",
  keywords: [
    "impianti termoidraulici Vicenza", "riscaldamento Vicenza", "climatizzazione Vicenza",
    "impianti antincendio Vicenza", "impianti industriali", "Rossi Impianti", "Sarego",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Rossi Impianti srl",
    url: "https://www.rossimpiantisrl.it",
    title: "Rossi Impianti srl — Impianti termoidraulici e climatizzazione a Vicenza",
    description:
      "Progettazione e installazione di impianti termoidraulici, riscaldamento, climatizzazione e antincendio a Vicenza e provincia. Dal 1980.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rossi Impianti srl — Impianti a Vicenza",
    description:
      "Impianti termoidraulici, climatizzazione e antincendio a Vicenza e provincia. Dal 1980.",
  },
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
        className={`${ibmPlexSans.variable} ${archivo.variable} font-plex bg-bg text-text1 antialiased`}
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
