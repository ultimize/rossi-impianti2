import Link from 'next/link';
import type { Metadata } from 'next';
import { SERVIZI, servizioGallery } from '@/lib/servizi';
import MasonryGallery from '@/components/MasonryGallery';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'I nostri lavori — Rossi Impianti Vicenza',
  description:
    'Una selezione dei cantieri e delle installazioni di Rossi Impianti a Vicenza e provincia: impianti industriali, antincendio, riscaldamento, climatizzazione e idraulica.',
};

export default function LavoriPage() {
  return (
    <div className="bg-bg text-text1 font-plex">
      {/* BANNER */}
      <div className="bg-bg-alt border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-14 md:py-[72px]">
          <div className="font-plex font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-3.5">
            I nostri lavori
          </div>
          <h1 className="font-archivo font-extrabold text-[40px] md:text-[56px] leading-[1.02] tracking-[-1.5px] text-text1 mb-4">
            Cantieri e installazioni
          </h1>
          <p className="text-[18px] text-text2 max-w-[640px] leading-[1.6]">
            Una selezione dei nostri lavori a Vicenza e provincia, divisi per settore. Impianti industriali, antincendio, riscaldamento, climatizzazione e idraulica.
          </p>
        </div>
      </div>

      {/* GALLERIE PER SETTORE */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-16 md:py-[72px] flex flex-col gap-16 md:gap-[72px]">
        {SERVIZI.map((s) => {
          const accent = s.accent === 'rosso' ? 'text-rosso' : 'text-azzurro';
          return (
            <section key={s.slug} id={s.slug} className="scroll-mt-24">
              <div className="flex items-end justify-between gap-4 flex-wrap mb-7">
                <div>
                  <div className={`font-plex font-semibold text-[13px] tracking-[1.4px] uppercase mb-2 ${accent}`}>
                    {s.eyebrow}
                  </div>
                  <h2 className="font-archivo font-extrabold text-[30px] md:text-[38px] leading-[1.05] tracking-[-1px] text-text1">
                    {s.name}
                  </h2>
                </div>
                <Link
                  href={`/servizi/${s.slug}`}
                  className={`font-plex font-semibold text-[15px] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all ${accent}`}
                >
                  Scopri il servizio <span>→</span>
                </Link>
              </div>
              <MasonryGallery images={servizioGallery(s)} alt={s.name} />
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pb-[90px]">
        <div className="rounded-[22px] bg-gradient-to-br from-rosso to-rosso-hover shadow-cta px-8 md:px-[52px] py-[44px] md:py-[52px] flex items-center justify-between gap-[30px] flex-wrap">
          <h3 className="font-archivo font-extrabold text-[28px] md:text-[38px] text-white leading-[1.05] tracking-[-1px] max-w-[560px]">
            Vuoi un lavoro così anche per te?
          </h3>
          <Link
            href="/contatti"
            className="font-plex font-semibold text-[16px] text-rosso bg-white rounded-btn px-7 py-[15px] transition-all whitespace-nowrap hover:-translate-y-0.5"
          >
            Richiedi un preventivo
          </Link>
        </div>
      </div>
    </div>
  );
}
