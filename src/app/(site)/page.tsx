import { createStaticClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Sparkles, Shield, Flame, Wind, Building2, Calendar, FileText, Check } from 'lucide-react';
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
    <div className="bg-bg text-text1 overflow-x-clip">
      {/* HERO SECTION */}
      <section className="relative bg-radial-gradient min-h-[600px] lg:min-h-[700px] overflow-hidden flex items-center">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/hero/settori.png"
          className="absolute inset-0 w-100 h-100 w-full h-full object-cover opacity-78 pointer-events-none filter saturate-[0.95] contrast-[1.02]"
        >
          <source src="https://assets.mixkit.co/videos/17675/17675-360.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-bg/92 via-bg/55 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-transparent to-bg/70 pointer-events-none" />

        {/* Large Decorative "44" */}
        <div className="absolute top-[-70px] right-[-30px] font-saira font-extrabold text-[420px] leading-[0.8] text-white/5 opacity-55 tracking-[-10px] animate-floaty pointer-events-none select-none">
          44
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1.25 bg-rosso" />

        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 py-[120px] relative z-10">
          <div className="font-saira font-bold text-[15px] tracking-[4px] text-rosso uppercase mb-6 animate-revealUp">
            Impianti industriali · dal 1980
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-7xl lg:text-[96px] leading-[0.92] uppercase tracking-[-1.5px] max-w-[900px] mb-7 animate-revealUp">
            Progettiamo<br />
            e costruiamo<br />
            <span className="text-rosso">impianti industriali.</span>
          </h1>
          <p className="text-[19px] text-muted leading-[1.55] mb-10 max-w-[480px] animate-revealUp">
            44 anni di cantieri a Vicenza. Chiavi in mano, per le aziende.
          </p>
          <div className="flex flex-wrap gap-3.5 animate-revealUp">
            <Link
              href="/contatti"
              className="font-saira font-bold text-[18px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn px-[34px] py-[17px] transition-all hover:-translate-y-[2px]"
            >
              Richiedi un preventivo
            </Link>
            <Link
              href="/settori"
              className="font-saira font-bold text-[18px] tracking-[0.5px] uppercase text-white border-[1.5px] border-border hover:border-white rounded-btn px-[34px] py-[17px] transition-all hover:-translate-y-[2px]"
            >
              I nostri lavori
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE BAR */}
      <section className="bg-rosso overflow-hidden whitespace-nowrap py-4">
        <div className="inline-flex animate-marquee font-saira font-semibold uppercase tracking-[1.5px] text-[16px] text-white">
          <span>&nbsp;&nbsp;★&nbsp;&nbsp;44 anni di attività&nbsp;&nbsp;★&nbsp;&nbsp;Cantieri chiavi in mano&nbsp;&nbsp;★&nbsp;&nbsp;Aria · Acqua · Gas · Metano&nbsp;&nbsp;★&nbsp;&nbsp;Impianti antincendio&nbsp;&nbsp;★&nbsp;&nbsp;Vicenza e provincia&nbsp;&nbsp;★&nbsp;&nbsp;Pacchetto Completo&nbsp;&nbsp;</span>
          <span>&nbsp;&nbsp;★&nbsp;&nbsp;44 anni di attività&nbsp;&nbsp;★&nbsp;&nbsp;Cantieri chiavi in mano&nbsp;&nbsp;★&nbsp;&nbsp;Aria · Acqua · Gas · Metano&nbsp;&nbsp;★&nbsp;&nbsp;Impianti antincendio&nbsp;&nbsp;★&nbsp;&nbsp;Vicenza e provincia&nbsp;&nbsp;★&nbsp;&nbsp;Pacchetto Completo&nbsp;&nbsp;</span>
        </div>
      </section>

      {/* SERVIZI SECTION */}
      <section id="servizi" className="bg-bg py-[90px] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[48px] items-end mb-[40px]">
            <div>
              <div className="font-saira font-bold text-[15px] tracking-[3px] text-rosso uppercase mb-3.5">
                Cosa facciamo
              </div>
              <h2 className="font-saira font-extrabold text-4xl md:text-[56px] text-white uppercase tracking-[-0.5px] leading-[0.95]">
                Quattro aree,<br />un solo interlocutore
              </h2>
            </div>
            <p className="text-[16px] text-muted leading-[1.6] mb-1">
              Dalla progettazione alla messa in opera realizziamo impianti completi per l'industria, il commercio e la casa. Ogni servizio comprende il <strong className="text-white">Pacchetto Completo</strong>.
            </p>
          </div>

          {/* Featured Industrial Card */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] border border-border hover:border-rosso rounded-card overflow-hidden bg-surface transition-all mb-4 group">
            <div className="p-8 md:p-[48px] flex flex-col justify-center">
              <div className="flex items-center gap-3.5 mb-[18px]">
                <div className="w-[52px] h-[52px] border border-[#2c3137] rounded-btn flex items-center justify-center text-rosso bg-[#101214]">
                  <Building2 size={26} />
                </div>
                <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-rosso uppercase">
                  01 / Il nostro core
                </div>
              </div>
              <h3 className="font-saira font-extrabold text-[44px] text-white uppercase mb-3.5 leading-[0.98]">
                Impianti industriali
              </h3>
              <p className="text-[15.5px] text-muted leading-[1.6] mb-[22px] max-w-[430px]">
                Progettazione e costruzione di impianti aria, acqua, gas e metano per aziende, capannoni e imprese edili. Cantieri chiavi in mano.
              </p>
              <div className="flex flex-wrap gap-2 mb-[26px]">
                {['Aria', 'Acqua', 'Gas', 'Metano', 'Antincendio'].map((tag) => (
                  <span
                    key={tag}
                    className="font-saira font-semibold text-[14px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-3 py-1.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/servizi"
                className="font-saira font-bold text-[16px] tracking-[1px] uppercase text-white hover:text-rosso flex items-center gap-2 transition-all group-hover:gap-3"
              >
                Scopri il settore industriale <span>→</span>
              </Link>
            </div>
            <div className="min-h-[340px] relative overflow-hidden bg-cover bg-center bg-[url('/assets/hero/settori.png')]">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
              <div className="absolute left-[22px] bottom-[22px] font-saira font-semibold text-[13px] tracking-[1px] text-muted2 bg-bg rounded-btn px-[13px] py-[8px] uppercase">
                Centrale Termica
              </div>
            </div>
          </div>

          {/* Three subservices cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 2 */}
            <div className="border border-border hover:border-rosso hover:-translate-y-1 rounded-card overflow-hidden bg-surface transition-all duration-300 relative group">
              <div className="absolute top-[18px] right-[18px] z-10 font-saira font-bold text-[12px] tracking-[1px] bg-rosso text-white rounded-btn px-2.5 py-1">
                NUOVO
              </div>
              <div className="height-[150px] h-[150px] relative overflow-hidden bg-cover bg-center bg-[url('/assets/hero/servizi.png')]">
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute left-4.5 bottom-3.5 w-[46px] h-[46px] rounded-btn bg-[#101214] border border-[#2c3137] flex items-center justify-center text-rosso">
                  <Shield size={24} className="animate-flick origin-bottom" />
                </div>
              </div>
              <div className="p-7 md:p-[28px]">
                <div className="font-saira font-extrabold text-[12.5px] tracking-[2px] text-rosso uppercase">
                  02 / Sicurezza
                </div>
                <h3 className="font-saira font-extrabold text-[30px] text-white uppercase my-2">
                  Impianti antincendio
                </h3>
                <p className="text-[14px] text-muted leading-[1.55] mb-4">
                  Progettazione e realizzazione per le aziende, a norma e certificati.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-2.5 py-1">
                    A norma
                  </span>
                  <span className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-2.5 py-1">
                    Certificati
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-border hover:border-azzurro hover:-translate-y-1 rounded-card overflow-hidden bg-surface transition-all duration-300 relative group">
              <div className="height-[150px] h-[150px] relative overflow-hidden bg-cover bg-center bg-[url('/assets/hero/chisiamo.png')]">
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute left-4.5 bottom-3.5 w-[46px] h-[46px] rounded-btn bg-[#101214] border border-[#2c3137] flex items-center justify-center text-azzurro">
                  <Flame size={24} />
                </div>
              </div>
              <div className="p-7 md:p-[28px]">
                <div className="font-saira font-extrabold text-[12.5px] tracking-[2px] text-azzurro uppercase">
                  03 / Comfort
                </div>
                <h3 className="font-saira font-extrabold text-[30px] text-white uppercase my-2">
                  Riscaldamento
                </h3>
                <p className="text-[14px] text-muted leading-[1.55] mb-4">
                  Caldaie, pompe di calore, pannelli radianti e solare termico.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Caldaie', 'Pompe di calore', 'Radiante'].map((tag) => (
                    <span
                      key={tag}
                      className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="border border-border hover:border-azzurro hover:-translate-y-1 rounded-card overflow-hidden bg-surface transition-all duration-300 relative group">
              <div className="height-[150px] h-[150px] relative overflow-hidden bg-cover bg-center bg-[url('/assets/hero/marchi.png')]">
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute left-4.5 bottom-3.5 w-[46px] h-[46px] rounded-btn bg-[#101214] border border-[#2c3137] flex items-center justify-center text-azzurro">
                  <Wind size={24} className="animate-drift" />
                </div>
              </div>
              <div className="p-7 md:p-[28px]">
                <div className="font-saira font-extrabold text-[12.5px] tracking-[2px] text-azzurro uppercase">
                  04 / Clima
                </div>
                <h3 className="font-saira font-extrabold text-[30px] text-white uppercase my-2">
                  Condizionamento
                </h3>
                <p className="text-[14px] text-muted leading-[1.55] mb-4">
                  Climatizzazione e raffrescamento canalizzato a pompa di calore.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-2.5 py-1">
                    Canalizzato
                  </span>
                  <span className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-2.5 py-1">
                    Pompa di calore
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SETTORI SECTION */}
      <section id="settori" className="bg-surface2 py-[90px] border-t border-border scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[48px] items-end mb-[40px]">
            <div>
              <div className="font-saira font-bold text-[15px] tracking-[3px] text-rosso uppercase mb-3.5">
                Settori
              </div>
              <h2 className="font-saira font-extrabold text-4xl md:text-[56px] text-white uppercase tracking-[-0.5px] leading-[0.95]">
                Per chi lavoriamo
              </h2>
            </div>
            <p className="text-[16px] text-muted leading-[1.6] mb-1">
              Stesso metodo, tre contesti: grandi impianti per l'industria, soluzioni per il commercio e comfort su misura per la casa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface border border-border border-t-3 border-t-rosso rounded-card p-[38px_34px]">
              <div className="font-saira font-extrabold text-[46px] text-rosso leading-[0.85]">01</div>
              <h3 className="font-saira font-extrabold text-[30px] text-white uppercase my-4">
                Industriale
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  'Aziende, capannoni e imprese edili',
                  'Impianti aria / acqua / gas / metano',
                  'Impianti antincendio a norma',
                ].map((item) => (
                  <div key={item} className="flex gap-2.5 items-start text-[14.5px] text-text2">
                    <span className="text-rosso font-bold">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border border-t-3 border-t-azzurro rounded-card p-[38px_34px]">
              <div className="font-saira font-extrabold text-[46px] text-azzurro leading-[0.85]">02</div>
              <h3 className="font-saira font-extrabold text-[30px] text-white uppercase my-4">
                Commerciale
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  'Bar, ristoranti, negozi e uffici',
                  'Climatizzazione a pompa di calore',
                  'Impianti per il ricambio dell\'aria',
                ].map((item) => (
                  <div key={item} className="flex gap-2.5 items-start text-[14.5px] text-text2">
                    <span className="text-azzurro font-bold">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border border-t-3 border-t-azzurro rounded-card p-[38px_34px]">
              <div className="font-saira font-extrabold text-[46px] text-azzurro leading-[0.85]">03</div>
              <h3 className="font-saira font-extrabold text-[30px] text-white uppercase my-4">
                Residenziale
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  'Riscaldamento a pannelli radianti',
                  'Solare termico e climatizzazione',
                  'Caldaie, biomassa e irrigazione',
                ].map((item) => (
                  <div key={item} className="flex gap-2.5 items-start text-[14.5px] text-text2">
                    <span className="text-azzurro font-bold">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIAL SPOTLIGHT SECTION */}
      <HomeClient articles={articles} />

      {/* PACCHETTO COMPLETO SECTION */}
      <section className="bg-bg py-[90px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[48px] items-end mb-[64px]">
            <div>
              <div className="font-saira font-bold text-[15px] tracking-[3px] text-azzurro uppercase mb-3.5">
                Pacchetto Completo
              </div>
              <h2 className="font-saira font-extrabold text-4xl md:text-[56px] text-white uppercase tracking-[-0.5px] leading-[0.95]">
                Dall'idea<br />all'impianto acceso
              </h2>
            </div>
            <p className="text-[16px] text-muted leading-[1.6] mb-1">
              Un solo interlocutore, dalla prima idea fino all'impianto acceso: <strong className="text-white">assistenza cliente completa</strong> in progettazione, documentazione e installazione.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[17%] right-[17%] top-[36px] h-[2px] bg-gradient-to-r from-rosso to-azzurro opacity-40 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="text-center px-[22px]">
                <div className="width-[72px] height-[72px] w-[72px] h-[72px] rounded-[10px] bg-rosso flex items-center justify-center mx-auto mb-[22px] relative z-10 shadow-[0_0_0_8px_#101214]">
                  <span className="font-saira font-extrabold text-[32px] text-white leading-none">01</span>
                </div>
                <div className="flex justify-center text-muted2 mb-3.5">
                  <Calendar size={28} />
                </div>
                <h3 className="font-saira font-bold text-[26px] text-white uppercase mb-2.5">
                  Progettazione
                </h3>
                <p className="text-[14.5px] text-muted leading-[1.55] max-w-[250px] mx-auto">
                  Sopralluogo, studio e progetto esecutivo dell'impianto.
                </p>
              </div>

              <div className="text-center px-[22px]">
                <div className="width-[72px] height-[72px] w-[72px] h-[72px] rounded-[10px] bg-rosso flex items-center justify-center mx-auto mb-[22px] relative z-10 shadow-[0_0_0_8px_#101214]">
                  <span className="font-saira font-extrabold text-[32px] text-white leading-none">02</span>
                </div>
                <div className="flex justify-center text-muted2 mb-3.5">
                  <FileText size={28} />
                </div>
                <h3 className="font-saira font-bold text-[26px] text-white uppercase mb-2.5">
                  Documentazione
                </h3>
                <p className="text-[14.5px] text-muted leading-[1.55] max-w-[250px] mx-auto">
                  Pratiche, certificazioni e documentazione tecnica completa.
                </p>
              </div>

              <div className="text-center px-[22px]">
                <div className="width-[72px] height-[72px] w-[72px] h-[72px] rounded-[10px] bg-rosso flex items-center justify-center mx-auto mb-[22px] relative z-10 shadow-[0_0_0_8px_#101214]">
                  <span className="font-saira font-extrabold text-[32px] text-white leading-none">03</span>
                </div>
                <div className="flex justify-center text-muted2 mb-3.5">
                  <Check size={28} className="text-rosso" />
                </div>
                <h3 className="font-saira font-bold text-[26px] text-white uppercase mb-2.5">
                  Installazione
                </h3>
                <p className="text-[14.5px] text-muted leading-[1.55] max-w-[250px] mx-auto">
                  Realizzazione e messa in opera a regola d'arte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND MARKS */}
      <section className="bg-surface py-[54px] border-t border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="font-saira font-bold text-[13px] tracking-[2px] text-muted2 uppercase mb-6 text-center">
            Marchi trattati
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['SIME', 'DAIKIN', 'AERMEC', 'SAMSUNG'].map((brand) => (
              <div
                key={brand}
                className="height-[74px] h-[74px] bg-[#101214] border border-border rounded-btn flex items-center justify-center font-archivo font-extrabold text-[21px] text-[#4a525b] hover:text-white transition-colors duration-300 select-none"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
