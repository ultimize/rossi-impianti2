'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SiteFooter() {
  return (
    <footer className="bg-[#F6F7F9] text-text2 border-t-3 border-rosso border-t-[3px] font-plex">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[64px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr] gap-10">
        {/* Brand Column */}
        <div className="flex flex-col items-start">
          <div className="mb-5 flex flex-col">
            <Link href="/" className="leading-none text-decoration-none">
              <Image
                src="/assets/logo-rossi.png"
                alt="Rossi Impianti srl"
                width={180}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>
          <p className="text-[14.5px] leading-[1.65] text-text2 text-left max-w-[330px] mb-[22px]">
            Progettiamo e costruiamo impianti industriali chiavi in mano dal 1980. Vicenza e provincia.
          </p>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-[9px] font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-text1 border-[1.5px] border-border2 hover:border-rosso hover:text-rosso rounded-btn px-[22px] py-[11px] transition-colors"
          >
            Richiedi un preventivo <span>→</span>
          </Link>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="font-saira font-bold text-[13px] tracking-[1.5px] text-text1 uppercase mb-4">
            Navigazione
          </h4>
          <div className="flex flex-col gap-2.2 text-[14px]">
            <Link href="/chi-siamo" className="text-text2 hover:text-rosso transition-colors">
              Chi siamo
            </Link>
            <Link href="/servizi" className="text-text2 hover:text-rosso transition-colors">
              Servizi
            </Link>
            <Link href="/settori" className="text-text2 hover:text-rosso transition-colors">
              Settori
            </Link>
            <Link href="/marchi" className="text-text2 hover:text-rosso transition-colors">
              Marchi trattati
            </Link>
            <Link href="/blog" className="text-text2 hover:text-rosso transition-colors">
              News
            </Link>
            <Link href="/shop" className="text-text2 hover:text-rosso transition-colors">
              Shop
            </Link>
          </div>
        </div>

        {/* Services Column */}
        <div>
          <h4 className="font-saira font-bold text-[13px] tracking-[1.5px] text-text1 uppercase mb-4">
            Servizi
          </h4>
          <div className="flex flex-col gap-2.2 text-[14px] text-text2">
            <span>Impianti industriali</span>
            <span>Impianti antincendio</span>
            <span>Riscaldamento</span>
            <span>Condizionamento</span>
            <span>Idraulica</span>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-saira font-bold text-[13px] tracking-[1.5px] text-text1 uppercase mb-4">
            Contatti
          </h4>
          <div className="flex flex-col gap-3.2 text-[14px] leading-[1.5]">
            <div className="text-text2">
              Via Dei Fiori, 9/A
              <br />
              36040 Sarego (VI)
            </div>
            <a
              href="tel:0444820798"
              className="text-text1 hover:text-rosso font-semibold transition-colors"
            >
              0444 820798
            </a>
            <a
              href="mailto:info@rossimpiantisrl.it"
              className="text-text2 hover:text-rosso transition-colors"
            >
              info@rossimpiantisrl.it
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[22px] flex items-center justify-between gap-5 flex-wrap text-[12.5px] text-muted">
          <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
            <span>© 2026 Rossi Impianti S.r.l. — Tutti i diritti riservati</span>
            <span className="hidden sm:inline text-border/60">•</span>
            <Link href="/privacy-policy" className="hover:text-rosso transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline text-border/60">•</span>
            <Link href="/cookie-policy" className="hover:text-rosso transition-colors">
              Cookie Policy
            </Link>
            <span className="hidden sm:inline text-border/60">•</span>
            <button
              onClick={() => (window as any).openCookieSettings?.()}
              className="hover:text-rosso transition-colors text-left font-plex"
            >
              Gestione cookie
            </button>
          </div>
          <span className="tracking-[0.3px]">P.IVA 01659230245 · COD. SDI T9K4ZHO</span>
        </div>
      </div>
    </footer>
  );
}
