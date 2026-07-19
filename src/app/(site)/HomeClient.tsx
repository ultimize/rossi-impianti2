'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Check } from 'lucide-react';
import { media } from '@/lib/media';

type HomeClientProps = {
  articles: (Article & { categories: any })[];
};

export default function HomeClient({ articles }: HomeClientProps) {
  // --- COUNTERS ANIMATION ---
  const [counts, setCounts] = useState({ years: 0, areas: 0 });
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let yearsProgress = 0;
          let areasProgress = 0;
          const yearsInterval = setInterval(() => {
            yearsProgress += 1;
            if (yearsProgress >= 44) {
              yearsProgress = 44;
              clearInterval(yearsInterval);
            }
            setCounts((prev) => ({ ...prev, years: yearsProgress }));
          }, 30);

          const areasInterval = setInterval(() => {
            areasProgress += 1;
            if (areasProgress >= 4) {
              areasProgress = 4;
              clearInterval(areasInterval);
            }
            setCounts((prev) => ({ ...prev, areas: areasProgress }));
          }, 200);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // --- CONTACT FORM STATE ---
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    messaggio: '',
    privacy: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.messaggio || !form.privacy) {
      alert('Per favore compila tutti i campi obbligatori e accetta la privacy policy.');
      return;
    }

    setStatus('loading');
    // Simulate submission
    setTimeout(() => {
      setStatus('success');
      setForm({
        nome: '',
        cognome: '',
        email: '',
        telefono: '',
        messaggio: '',
        privacy: false,
      });
    }, 1500);
  };

  // Helper to format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <>
      {/* CHI SIAMO SPOTLIGHT */}
      <section
        id="chisiamo"
        ref={countRef}
        className="bg-bg py-[96px] scroll-mt-20"
      >
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
          <div>
            <div className="font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-4">
              Il cuore dell'azienda
            </div>
            <h2 className="font-archivo font-extrabold text-[34px] md:text-[44px] text-text1 mb-5 leading-[1.06] tracking-[-1px]">
              44 anni di cantieri industriali
            </h2>
            <p className="text-[16.5px] text-text2 leading-[1.65] mb-[34px] max-w-[480px]">
              Dal 1980 progettiamo e costruiamo impianti per le aziende del territorio vicentino. Un solo interlocutore, dalla prima idea fino all'impianto acceso.
            </p>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-bg-alt rounded-[14px] p-[24px_26px]">
                <div className="font-archivo font-extrabold text-[42px] text-rosso leading-[0.9]">
                  {counts.years}
                </div>
                <div className="text-[13px] text-muted mt-2">anni di attività</div>
              </div>
              <div className="bg-bg-alt rounded-[14px] p-[24px_26px]">
                <div className="font-archivo font-extrabold text-[42px] text-text1 leading-[0.9]">1980</div>
                <div className="text-[13px] text-muted mt-2">fondata a Vicenza</div>
              </div>
              <div className="bg-bg-alt rounded-[14px] p-[24px_26px]">
                <div className="font-archivo font-extrabold text-[42px] text-text1 leading-[0.9]">
                  {counts.areas}
                </div>
                <div className="text-[13px] text-muted mt-2">aree di servizio</div>
              </div>
              <div className="bg-bg-alt rounded-[14px] p-[24px_26px]">
                <div className="font-archivo font-extrabold text-[42px] text-azzurro leading-[0.9]">100%</div>
                <div className="text-[13px] text-muted mt-2">chiavi in mano</div>
              </div>
            </div>
          </div>
          <div className="relative min-h-[460px] rounded-[18px] overflow-hidden bg-cover bg-center shadow-card-hover" style={{ backgroundImage: `url(${media('site/sede.jpg')})` }} />
        </div>
      </section>

      {/* PACCHETTO COMPLETO */}
      <section className="bg-bg-alt py-[96px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[680px] mx-auto mb-[56px]">
            <div className="font-semibold text-[13px] tracking-[1.4px] text-azzurro uppercase mb-3.5">
              Pacchetto Completo
            </div>
            <h2 className="font-archivo font-extrabold text-[34px] md:text-[46px] text-text1 mb-4 tracking-[-1px] leading-[1.05]">
              Dall'idea all'impianto acceso
            </h2>
            <p className="text-[16.5px] text-text2 leading-[1.65]">
              Un solo interlocutore, dalla prima idea fino all'impianto acceso: assistenza completa in progettazione, documentazione e installazione.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[17%] right-[17%] top-[36px] h-[2px] bg-gradient-to-r from-rosso to-azzurro opacity-30 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Step 01 */}
              <div className="text-center px-[22px]">
                <div className="w-[72px] h-[72px] rounded-[16px] bg-rosso flex items-center justify-center mx-auto mb-[22px] relative z-[1] shadow-[0_0_0_8px_#f6f7f9,0_12px_26px_-10px_rgba(225,29,23,.5)]">
                  <span className="font-archivo font-extrabold text-[30px] text-white leading-none">01</span>
                </div>
                <div className="flex justify-center text-[#b6bec6] mb-3.5">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="1.5" />
                    <path d="M3 9h18M8 9v11" />
                  </svg>
                </div>
                <h3 className="font-archivo font-bold text-[23px] text-text1 mb-2.5">Progettazione</h3>
                <p className="text-[14.5px] text-text2 leading-[1.6] max-w-[250px] mx-auto">
                  Sopralluogo, studio e progetto esecutivo dell'impianto.
                </p>
              </div>

              {/* Step 02 */}
              <div className="text-center px-[22px]">
                <div className="w-[72px] h-[72px] rounded-[16px] bg-rosso flex items-center justify-center mx-auto mb-[22px] relative z-[1] shadow-[0_0_0_8px_#f6f7f9,0_12px_26px_-10px_rgba(225,29,23,.5)]">
                  <span className="font-archivo font-extrabold text-[30px] text-white leading-none">02</span>
                </div>
                <div className="flex justify-center text-[#b6bec6] mb-3.5">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                    <path d="M7 3h8l4 4v14H7z" />
                    <path d="M15 3v4h4" />
                    <path d="M10 13h6M10 17h6" />
                  </svg>
                </div>
                <h3 className="font-archivo font-bold text-[23px] text-text1 mb-2.5">Documentazione</h3>
                <p className="text-[14.5px] text-text2 leading-[1.6] max-w-[250px] mx-auto">
                  Pratiche, certificazioni e documentazione tecnica completa.
                </p>
              </div>

              {/* Step 03 */}
              <div className="text-center px-[22px]">
                <div className="w-[72px] h-[72px] rounded-[16px] bg-rosso flex items-center justify-center mx-auto mb-[22px] relative z-[1] shadow-[0_0_0_8px_#f6f7f9,0_12px_26px_-10px_rgba(225,29,23,.5)]">
                  <span className="font-archivo font-extrabold text-[30px] text-white leading-none">03</span>
                </div>
                <div className="flex justify-center text-[#b6bec6] mb-3.5">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                    <path d="M14.7 6.3a3.7 3.7 0 0 0-4.8 4.5l-5.6 5.6 2.3 2.3 5.6-5.6a3.7 3.7 0 0 0 4.5-4.8l-2.2 2.2-2-2 2.2-2.2z" />
                  </svg>
                </div>
                <h3 className="font-archivo font-bold text-[23px] text-text1 mb-2.5">Installazione</h3>
                <p className="text-[14.5px] text-text2 leading-[1.6] max-w-[250px] mx-auto">
                  Realizzazione e messa in opera a regola d'arte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="bg-bg py-[96px] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-[40px] flex-wrap gap-4">
            <div>
              <div className="font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-3.5">
                News
              </div>
              <h2 className="font-archivo font-extrabold text-[34px] md:text-[44px] text-text1 tracking-[-1px]">
                Ultime novità
              </h2>
            </div>
            <Link
              href="/blog"
              className="font-semibold text-[15.5px] text-text1 hover:text-rosso inline-flex items-center gap-2 group transition-all"
            >
              Tutte le news <span className="group-hover:translate-x-1.5 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            {articles.map((art) => {
              const bg = art.categories?.color_bg || '#E11D17';
              const textCol = art.categories?.color_text || '#ffffff';
              return (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="border border-border rounded-card overflow-hidden bg-white shadow-card hover:shadow-card-hover hover:-translate-y-[5px] transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="overflow-hidden h-[170px] relative bg-[#dde4ea]">
                    {art.cover_url ? (
                      <Image
                        src={art.cover_url}
                        alt={art.cover_alt || art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-border to-border2 transition-transform duration-500 group-hover:scale-[1.07]" />
                    )}
                    <span
                      style={{ backgroundColor: bg, color: textCol }}
                      className="absolute top-3.5 left-3.5 font-bold text-[11px] tracking-[0.6px] uppercase rounded-pill px-3 py-[5px] z-10"
                    >
                      {art.categories?.name || 'News'}
                    </span>
                  </div>
                  <div className="p-[24px_26px_28px] flex flex-col flex-grow justify-between">
                    <div>
                      <div className="text-[12.5px] text-muted uppercase tracking-[0.8px] mb-2.5">
                        {formatDate(art.published_at)} {art.read_time ? `· ${art.read_time}` : ''}
                      </div>
                      <h3 className="font-archivo font-bold text-[21px] text-text1 tracking-[-0.3px] mb-3.5 line-clamp-2 leading-[1.2]">
                        {art.title}
                      </h3>
                      <p className="text-[14px] text-text2 line-clamp-3 mb-4 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                    <span className="font-semibold text-[14px] text-rosso inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Leggi →
                    </span>
                  </div>
                </Link>
              );
            })}

            {articles.length === 0 && (
              <div className="col-span-3 text-center py-12 text-text2">
                Nessun articolo disponibile al momento.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MARCHI */}
      <section id="marchi" className="bg-bg-alt border-t border-border py-[56px] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="font-semibold text-[13px] tracking-[1.4px] text-muted uppercase mb-[26px] text-center">
            Marchi trattati
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px]">
            {[
              { name: 'Sime', logo: '/assets/marchi/sime.svg' },
              { name: 'Daikin', logo: '/assets/marchi/daikin.svg' },
              { name: 'Aermec', logo: '/assets/marchi/aermec.svg' },
              { name: 'Samsung', logo: '/assets/marchi/samsung.svg' },
            ].map((brand) => (
              <div
                key={brand.name}
                className="h-[80px] bg-white border border-border rounded-[12px] flex items-center justify-center px-6 hover:border-rosso transition-all duration-300 grayscale hover:grayscale-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-11 max-w-[130px] w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATTI */}
      <section id="contatti" className="bg-bg py-[96px] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-[56px]">
          <div className="text-left">
            <div className="font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-3.5">
              Contatti
            </div>
            <h2 className="font-archivo font-extrabold text-[34px] md:text-[44px] text-text1 mb-7 leading-[1.06] tracking-[-1px]">
              Parliamo del tuo progetto
            </h2>
            <div className="flex flex-col gap-[18px] mb-7">
              <div>
                <div className="font-semibold text-[12.5px] tracking-[1px] text-muted uppercase mb-1">
                  Sede
                </div>
                <div className="text-[16px] text-text1">Via Dei Fiori, 9/A — 36040 Sarego (VI)</div>
              </div>
              <div className="flex gap-12 flex-wrap">
                <div>
                  <div className="font-semibold text-[12.5px] tracking-[1px] text-muted uppercase mb-1">
                    Tel / Fax
                  </div>
                  <div className="text-[16px] text-text1">0444 820798</div>
                </div>
                <div>
                  <div className="font-semibold text-[12.5px] tracking-[1px] text-muted uppercase mb-1">
                    Email
                  </div>
                  <div className="text-[16px] text-text1">info@rossimpiantisrl.it</div>
                </div>
              </div>
            </div>
            {/* Map */}
            <div className="relative h-[240px] rounded-[14px] overflow-hidden border border-border bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2799.6505276032535!2d11.41144521292492!3d45.43654567095289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477f391cf852bf43%3A0xe6432002188674a4!2sRossi%20Impianti!5e0!3m2!1sit!2sus!4v1783677720549!5m2!1sit!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Sede Rossi Impianti — Sarego (VI)"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-bg-alt border border-border rounded-[18px] p-9 md:p-[38px_36px] text-left">
            <h3 className="font-archivo font-bold text-[24px] text-text1 tracking-[-0.4px] mb-[22px]">
              Richiedi un preventivo
            </h3>
            {status === 'success' ? (
              <div className="bg-bg border border-green-500/30 text-green-600 p-6 rounded-card text-center my-6 flex flex-col items-center gap-3 shadow-sm">
                <Check size={32} className="text-green-500 animate-bounce" />
                <h4 className="font-archivo font-bold text-[20px] tracking-[-0.3px] text-text1">Richiesta Inviata!</h4>
                <p className="text-[14.5px] text-text2">Grazie per averci contattato. Ti risponderemo al più presto.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="font-semibold text-[13px] border border-border2 rounded-btn px-4 py-2 mt-4 hover:border-rosso hover:text-rosso bg-transparent transition-colors cursor-pointer"
                >
                  Nuova Richiesta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
                  <input
                    type="text"
                    placeholder="Nome"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="bg-white border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Cognome"
                    value={form.cognome}
                    onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                    className="bg-white border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso transition-colors"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-white border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso mb-3.5"
                />
                <input
                  type="tel"
                  placeholder="Telefono"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="bg-white border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso mb-3.5"
                />
                <textarea
                  placeholder="Raccontaci il tuo progetto"
                  required
                  rows={4}
                  value={form.messaggio}
                  onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                  className="bg-white border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso mb-4 resize-y"
                />
                <label className="flex items-start gap-2.5 mb-5 font-plex text-[13px] text-text2 leading-[1.4] select-none cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.privacy}
                    onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                    className="mt-0.5 accent-rosso"
                  />
                  <span>Acconsento al trattamento dei dati secondo la Privacy Policy.</span>
                </label>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full font-semibold text-[16px] text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn p-4 shadow-btn transition-all cursor-pointer"
                >
                  {status === 'loading' ? 'Invio in corso...' : 'Invia richiesta'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-bg pb-[96px] pt-0">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="rounded-[22px] p-10 md:p-[56px] flex flex-col md:flex-row items-center justify-between gap-[30px] bg-gradient-to-br from-rosso to-rosso-hover shadow-cta flex-wrap">
            <h2 className="font-archivo font-extrabold text-[32px] md:text-[42px] text-white leading-[1.06] tracking-[-1px] text-left">
              Costruiamo il tuo impianto.
            </h2>
            <Link
              href="/contatti"
              className="font-semibold text-[17px] text-rosso bg-white rounded-[11px] px-[34px] py-[18px] hover:-translate-y-[2px] transition-all whitespace-nowrap"
            >
              Richiedi un preventivo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
