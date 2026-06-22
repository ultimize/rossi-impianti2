'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SiteFooter() {
  return (
    <footer className="bg-surface2 text-muted2 border-t-3 border-rosso border-t-[3px] font-plex">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[64px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr] gap-10">
        {/* Brand Column */}
        <div className="flex flex-col items-start">
          <div className="mb-5 flex flex-col">
            <div className="flex items-baseline gap-1.5 font-archivo leading-none">
              <span className="font-extrabold text-[30px] tracking-[-0.6px] text-white">
                ROSSI IMPIANTI
              </span>
              <span className="font-semibold text-[13px] text-muted2">srl</span>
            </div>
            <div className="flex gap-2.5 font-archivo font-bold text-[11px] tracking-[1px] mt-1.5">
              <span className="text-rosso">RISCALDAMENTO</span>
              <span className="text-azzurro">CONDIZIONAMENTO</span>
            </div>
          </div>
          <p className="text-[14.5px] line-height-[1.65] text-muted text-left max-w-[330px] mb-[22px]">
            Progettiamo e costruiamo impianti industriali chiavi in mano dal 1980. Vicenza e provincia.
          </p>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-[9px] font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white border-[1.5px] border-border hover:border-rosso hover:text-rosso rounded-btn px-[22px] py-[11px] transition-colors"
          >
            Richiedi un preventivo <span>→</span>
          </Link>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="font-saira font-bold text-[13px] tracking-[1.5px] text-white uppercase mb-4">
            Navigazione
          </h4>
          <div className="flex flex-col gap-2.2 text-[14px]">
            <Link href="/chi-siamo" className="text-muted hover:text-white transition-colors">
              Chi siamo
            </Link>
            <Link href="/servizi" className="text-muted hover:text-white transition-colors">
              Servizi
            </Link>
            <Link href="/settori" className="text-muted hover:text-white transition-colors">
              Settori
            </Link>
            <Link href="/marchi" className="text-muted hover:text-white transition-colors">
              Marchi trattati
            </Link>
            <Link href="/blog" className="text-muted hover:text-white transition-colors">
              News
            </Link>
            <Link href="/shop" className="text-muted hover:text-white transition-colors">
              Shop
            </Link>
          </div>
        </div>

        {/* Services Column */}
        <div>
          <h4 className="font-saira font-bold text-[13px] tracking-[1.5px] text-white uppercase mb-4">
            Servizi
          </h4>
          <div className="flex flex-col gap-2.2 text-[14px] text-muted">
            <span>Impianti industriali</span>
            <span>Impianti antincendio</span>
            <span>Riscaldamento</span>
            <span>Condizionamento</span>
            <span>Idraulica</span>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-saira font-bold text-[13px] tracking-[1.5px] text-white uppercase mb-4">
            Contatti
          </h4>
          <div className="flex flex-col gap-3.2 text-[14px] line-height-[1.5]">
            <div className="text-muted">
              Via Dei Fiori, 9/A
              <br />
              36040 Sarego (VI)
            </div>
            <a
              href="tel:0444820798"
              className="text-white hover:text-rosso font-semibold transition-colors"
            >
              0444 820798
            </a>
            <a
              href="mailto:info@rossimpiantisrl.it"
              className="text-muted hover:text-white transition-colors"
            >
              info@rossimpiantisrl.it
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[22px] flex items-center justify-between gap-5 flex-wrap text-[12.5px] text-[#5f666e]">
          <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
            <span>© 2026 Rossi Impianti S.r.l. — Tutti i diritti riservati</span>
            <span className="hidden sm:inline text-border/60">•</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline text-border/60">•</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <span className="hidden sm:inline text-border/60">•</span>
            <button
              onClick={() => (window as any).openCookieSettings?.()}
              className="hover:text-white transition-colors text-left font-plex"
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
