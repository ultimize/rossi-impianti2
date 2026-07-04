import { createStaticClient } from '@/lib/supabase/server';
import Link from 'next/link';
import HomeClient from './HomeClient';
import type { Article } from '@/lib/types';

export const revalidate = 3600; // ISR revalidate every hour

export default async function HomePage() {
  const supabase = createStaticClient();

  // Fetch the latest 3 published articles with their category
  const { data: rawArticles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  const articles = (rawArticles || []) as (Article & { categories: any })[];

  return (
    <div className="bg-bg text-text1 overflow-x-clip font-plex">
      {/* HERO SECTION */}
      <section
        id="top"
        className="relative overflow-hidden flex items-center min-h-[660px] bg-[#0e1216]"
      >
        {/* Real photo */}
        <div className="absolute inset-0 bg-cover bg-[url('/assets/site/hero.jpg')] bg-[position:center_right]" />
        {/* White feather: left stays bright, photo reveals on the right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg,#ffffff 0%,#ffffff 28%,rgba(255,255,255,.94) 40%,rgba(255,255,255,.55) 53%,rgba(255,255,255,.1) 68%,rgba(255,255,255,0) 86%)',
          }}
        />
        {/* Bottom white fade */}
        <div
          className="absolute left-0 right-0 bottom-0 h-[120px]"
          style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0),#ffffff)' }}
        />
        {/* Left red bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-rosso z-[3]" />

        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 pt-[72px] pb-[80px] md:pt-[96px] md:pb-[104px] relative z-[2]">
          <div className="max-w-[600px]">
            {/* Pill eyebrow */}
            <div className="inline-flex items-center gap-[9px] bg-white border border-border rounded-pill pl-[7px] pr-[8px] py-[7px] mb-7 shadow-[0_8px_22px_-10px_rgba(20,30,45,.3)] animate-revealUp">
              <span className="inline-flex items-center gap-1.5 bg-rosso-tint rounded-pill px-[11px] py-1 font-bold text-[12px] tracking-[0.4px] text-rosso-dark uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rosso" />
                Dal 1980
              </span>
              <span className="font-medium text-[13px] text-text2 pr-2">
                Impianti industriali a Vicenza
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-archivo font-extrabold text-[44px] md:text-[68px] leading-[1.0] tracking-[-2px] text-[#13171c] mb-[22px] animate-revealUp">
              Progettiamo e costruiamo <span className="text-rosso">impianti industriali.</span>
            </h1>

            {/* Lead */}
            <p className="text-[19px] text-[#4f585f] leading-[1.6] mb-[34px] max-w-[440px] font-medium animate-revealUp">
              44 anni di cantieri a Vicenza. Aria, acqua, gas e metano — chiavi in mano, per le aziende.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 animate-revealUp">
              <Link
                href="/contatti"
                className="font-semibold text-[16px] text-white bg-rosso rounded-btn px-[30px] py-4 shadow-[0_12px_28px_-8px_rgba(225,29,23,.5)] hover:bg-rosso-hover hover:-translate-y-[2px] transition-all"
              >
                Richiedi un preventivo
              </Link>
              <Link
                href="/settori"
                className="font-semibold text-[16px] text-text1 bg-white/90 border-[1.5px] border-border2 rounded-btn px-[30px] py-4 backdrop-blur-[4px] hover:border-text1 hover:-translate-y-[2px] transition-all"
              >
                I nostri lavori
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-[34px] mt-[50px] animate-revealUp">
              <div>
                <div className="font-archivo font-extrabold text-[36px] text-[#13171c] leading-none">44</div>
                <div className="text-[13px] text-[#6b747c] mt-[5px] font-medium">anni di attività</div>
              </div>
              <div className="w-px bg-[#d3dade]" />
              <div>
                <div className="font-archivo font-extrabold text-[36px] text-[#13171c] leading-none">4</div>
                <div className="text-[13px] text-[#6b747c] mt-[5px] font-medium">aree di servizio</div>
              </div>
              <div className="w-px bg-[#d3dade]" />
              <div>
                <div className="font-archivo font-extrabold text-[36px] text-[#13171c] leading-none">100%</div>
                <div className="text-[13px] text-[#6b747c] mt-[5px] font-medium">chiavi in mano</div>
              </div>
            </div>
          </div>

          {/* Circular seal over the photo */}
          <div className="hidden md:flex absolute top-[80px] right-[60px] z-[3] w-[118px] h-[118px] rounded-full flex-col items-center justify-center text-white text-center bg-gradient-to-br from-rosso to-rosso-hover shadow-[0_0_0_9px_rgba(255,255,255,.9),0_22px_40px_-14px_rgba(225,29,23,.7)] animate-floaty">
            <span className="font-semibold text-[10px] tracking-[2px] opacity-85">DAL</span>
            <span className="font-archivo font-extrabold text-[34px] leading-none tracking-[-0.5px]">1980</span>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-bg-alt border-t border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[22px] flex items-center justify-between gap-6 flex-wrap">
          <span className="inline-flex items-center gap-2.5 text-[15px] text-text2">
            <span className="text-rosso">●</span> Cantieri chiavi in mano
          </span>
          <span className="inline-flex items-center gap-2.5 text-[15px] text-text2">
            <span className="text-azzurro">●</span> Aria · Acqua · Gas · Metano
          </span>
          <span className="inline-flex items-center gap-2.5 text-[15px] text-text2">
            <span className="text-rosso">●</span> Impianti antincendio a norma
          </span>
          <span className="inline-flex items-center gap-2.5 text-[15px] text-text2">
            <span className="text-azzurro">●</span> Vicenza e provincia
          </span>
        </div>
      </section>

      {/* SERVIZI SECTION */}
      <section id="servizi" className="bg-bg py-[96px] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[48px] items-end mb-[44px]">
            <div>
              <div className="font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-3.5">
                Cosa facciamo
              </div>
              <h2 className="font-archivo font-extrabold text-[34px] md:text-[46px] text-text1 tracking-[-1px] leading-[1.05]">
                Quattro aree, un solo interlocutore
              </h2>
            </div>
            <p className="text-[16.5px] text-text2 leading-[1.65] mb-1">
              Dalla progettazione alla messa in opera realizziamo impianti completi per l'industria, il commercio e la casa. Ogni servizio comprende il <strong className="text-text1">Pacchetto Completo</strong>.
            </p>
          </div>

          {/* Featured Industrial Card */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] border border-border rounded-[18px] overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all mb-[18px] group">
            <div className="p-8 md:p-[48px_46px] flex flex-col justify-center">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-[54px] h-[54px] rounded-[12px] flex items-center justify-center text-rosso bg-rosso-tint flex-none">
                  <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M3 21V11l6 3.2V11l6 3.2V7l6 3v11H3Z" />
                    <path d="M7 21v-3.4M13 21v-3.4M19 21v-3.4" />
                  </svg>
                </div>
                <div className="font-bold text-[12.5px] tracking-[1.4px] text-rosso uppercase">
                  01 / Il nostro core
                </div>
              </div>
              <h3 className="font-archivo font-extrabold text-[30px] md:text-[36px] text-text1 tracking-[-0.6px] mb-3.5 leading-[1.05]">
                Impianti industriali
              </h3>
              <p className="text-[16px] text-text2 leading-[1.65] mb-6 max-w-[440px]">
                Progettazione e costruzione di impianti aria, acqua, gas e metano per aziende, capannoni e imprese edili. Cantieri chiavi in mano.
              </p>
              <div className="flex flex-wrap gap-2 mb-7">
                {['Aria', 'Acqua', 'Gas', 'Metano', 'Antincendio'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[14px] text-text2 bg-chip rounded-pill px-[15px] py-[7px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/servizi"
                className="font-semibold text-[15.5px] text-rosso hover:text-rosso-hover inline-flex items-center gap-2 transition-all group-hover:gap-3 w-fit"
              >
                Scopri il settore industriale <span>→</span>
              </Link>
            </div>
            <div className="min-h-[360px] relative overflow-hidden bg-cover bg-center bg-[url('/assets/site/industriale.jpg')]" />
          </div>

          {/* Three subservices cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            {/* Card 2 — Antincendio */}
            <div className="border border-border rounded-card overflow-hidden bg-white relative shadow-card hover:shadow-card-hover hover:-translate-y-[5px] transition-all duration-300">
              <div className="absolute top-4 right-4 z-[2] font-bold text-[11px] tracking-[0.6px] bg-rosso text-white rounded-pill px-3 py-[5px]">
                NUOVO
              </div>
              <div className="p-[34px_30px_30px]">
                <div className="w-[52px] h-[52px] rounded-[13px] bg-rosso-tint flex items-center justify-center text-rosso mb-5">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M12 3c.5 2.5 3.5 4 3.5 8a3.5 3.5 0 0 1-7 0c0-1.2.6-2 .6-2 .3 1.2 1.2 1.6 1.9 1.4.9-.3 1-1.6.5-3-.3-1 .3-2.8.5-3.8Z" />
                  </svg>
                </div>
                <div className="font-bold text-[12px] tracking-[1.2px] text-rosso uppercase">
                  02 / Sicurezza
                </div>
                <h3 className="font-archivo font-bold text-[25px] text-text1 tracking-[-0.4px] mt-[7px] mb-2.5">
                  Impianti antincendio
                </h3>
                <p className="text-[14.5px] text-text2 leading-[1.6] mb-4">
                  Progettazione e realizzazione per le aziende, a norma e certificati.
                </p>
                <div className="flex flex-wrap gap-[7px]">
                  {['A norma', 'Certificati'].map((tag) => (
                    <span key={tag} className="text-[13px] text-text2 bg-chip rounded-pill px-[13px] py-[5px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 — Riscaldamento */}
            <div className="border border-border rounded-card overflow-hidden bg-white shadow-card hover:shadow-card-hover hover:-translate-y-[5px] transition-all duration-300">
              <div className="p-[34px_30px_30px]">
                <div className="w-[52px] h-[52px] rounded-[13px] bg-azzurro-tint flex items-center justify-center text-azzurro mb-5">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <rect x="5" y="4" width="14" height="15" rx="2" />
                    <path d="M9 4v15M13 4v15M17 4v15" />
                    <path d="M8 21v1M16 21v1" />
                  </svg>
                </div>
                <div className="font-bold text-[12px] tracking-[1.2px] text-azzurro uppercase">
                  03 / Comfort
                </div>
                <h3 className="font-archivo font-bold text-[25px] text-text1 tracking-[-0.4px] mt-[7px] mb-2.5">
                  Riscaldamento
                </h3>
                <p className="text-[14.5px] text-text2 leading-[1.6] mb-4">
                  Caldaie, pompe di calore, pannelli radianti e solare termico.
                </p>
                <div className="flex flex-wrap gap-[7px]">
                  {['Caldaie', 'Pompe di calore', 'Radiante'].map((tag) => (
                    <span key={tag} className="text-[13px] text-text2 bg-chip rounded-pill px-[13px] py-[5px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4 — Condizionamento */}
            <div className="border border-border rounded-card overflow-hidden bg-white shadow-card hover:shadow-card-hover hover:-translate-y-[5px] transition-all duration-300">
              <div className="p-[34px_30px_30px]">
                <div className="w-[52px] h-[52px] rounded-[13px] bg-azzurro-tint flex items-center justify-center text-azzurro mb-5">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="9" rx="2" />
                    <path d="M7 10h7" />
                    <path d="M6 18c1-1.2 2.2-1.2 3.2 0M11 18c1-1.2 2.2-1.2 3.2 0M16 18c1-1.2 2.2-1.2 3.2 0" />
                  </svg>
                </div>
                <div className="font-bold text-[12px] tracking-[1.2px] text-azzurro uppercase">
                  04 / Clima
                </div>
                <h3 className="font-archivo font-bold text-[25px] text-text1 tracking-[-0.4px] mt-[7px] mb-2.5">
                  Condizionamento
                </h3>
                <p className="text-[14.5px] text-text2 leading-[1.6] mb-4">
                  Climatizzazione e raffrescamento canalizzato a pompa di calore.
                </p>
                <div className="flex flex-wrap gap-[7px]">
                  {['Canalizzato', 'Pompa di calore'].map((tag) => (
                    <span key={tag} className="text-[13px] text-text2 bg-chip rounded-pill px-[13px] py-[5px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SETTORI SECTION */}
      <section id="settori" className="bg-bg-alt py-[96px] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[48px] items-end mb-[44px]">
            <div>
              <div className="font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-3.5">
                Settori
              </div>
              <h2 className="font-archivo font-extrabold text-[34px] md:text-[46px] text-text1 tracking-[-1px] leading-[1.05]">
                Per chi lavoriamo
              </h2>
            </div>
            <p className="text-[16.5px] text-text2 leading-[1.65] mb-1">
              Stesso metodo, tre contesti: grandi impianti per l'industria, soluzioni per il commercio e comfort su misura per la casa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            {/* 01 */}
            <div className="bg-white border border-border rounded-card p-[36px_32px] shadow-card">
              <div className="flex items-center gap-3 mb-[18px]">
                <span className="font-archivo font-extrabold text-[40px] text-rosso leading-[0.85]">01</span>
                <span className="h-[2px] flex-1 bg-[#f0d9d7]" />
              </div>
              <h3 className="font-archivo font-bold text-[26px] text-text1 tracking-[-0.4px] mb-4">
                Industriale
              </h3>
              <div className="flex flex-col gap-[11px]">
                {[
                  'Aziende, capannoni e imprese edili',
                  'Impianti aria / acqua / gas / metano',
                  'Impianti antincendio a norma',
                ].map((item) => (
                  <div key={item} className="flex gap-2.5 items-start text-[14.5px] text-text2 leading-[1.5]">
                    <span className="text-rosso font-bold">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 02 */}
            <div className="bg-white border border-border rounded-card p-[36px_32px] shadow-card">
              <div className="flex items-center gap-3 mb-[18px]">
                <span className="font-archivo font-extrabold text-[40px] text-azzurro leading-[0.85]">02</span>
                <span className="h-[2px] flex-1 bg-[#d8e9f4]" />
              </div>
              <h3 className="font-archivo font-bold text-[26px] text-text1 tracking-[-0.4px] mb-4">
                Commerciale
              </h3>
              <div className="flex flex-col gap-[11px]">
                {[
                  'Bar, ristoranti, negozi e uffici',
                  'Climatizzazione a pompa di calore',
                  'Impianti per il ricambio dell\'aria',
                ].map((item) => (
                  <div key={item} className="flex gap-2.5 items-start text-[14.5px] text-text2 leading-[1.5]">
                    <span className="text-azzurro font-bold">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 03 */}
            <div className="bg-white border border-border rounded-card p-[36px_32px] shadow-card">
              <div className="flex items-center gap-3 mb-[18px]">
                <span className="font-archivo font-extrabold text-[40px] text-azzurro leading-[0.85]">03</span>
                <span className="h-[2px] flex-1 bg-[#d8e9f4]" />
              </div>
              <h3 className="font-archivo font-bold text-[26px] text-text1 tracking-[-0.4px] mb-4">
                Residenziale
              </h3>
              <div className="flex flex-col gap-[11px]">
                {[
                  'Riscaldamento a pannelli radianti',
                  'Solare termico e climatizzazione',
                  'Caldaie, biomassa e irrigazione',
                ].map((item) => (
                  <div key={item} className="flex gap-2.5 items-start text-[14.5px] text-text2 leading-[1.5]">
                    <span className="text-azzurro font-bold">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHI SIAMO, PACCHETTO, NEWS, MARCHI, CONTATTI, CTA */}
      <HomeClient articles={articles} />
    </div>
  );
}
