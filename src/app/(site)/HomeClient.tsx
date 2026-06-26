'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Check } from 'lucide-react';

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
      {/* 44 YEARS OF WORKS (Spotlight) */}
      <section
        id="chisiamo"
        ref={countRef}
        className="bg-surface border-t-3 border-rosso border-t-[3px] py-[90px] scroll-mt-20 border-b border-border"
      >
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="font-saira font-bold text-[15px] tracking-[3px] text-rosso uppercase mb-4.5">
              Il cuore dell'azienda
            </div>
            <h2 className="font-saira font-extrabold text-4xl md:text-[54px] text-text1 uppercase mb-9 leading-[0.96] tracking-[-1px]">
              44 anni di cantieri industriali
            </h2>
            <div className="grid grid-cols-2 gap-[1px] bg-border2 border border-border2">
              <div className="bg-bg p-6 md:p-[28px]">
                <div className="font-saira font-extrabold text-[50px] text-rosso leading-[0.9]">
                  {counts.years}
                </div>
                <div className="text-[13px] text-text2 mt-1.5 uppercase tracking-[0.5px]">
                  anni di attività
                </div>
              </div>
              <div className="bg-bg p-6 md:p-[28px]">
                <div className="font-saira font-extrabold text-[50px] text-text1 leading-[0.9]">
                  1980
                </div>
                <div className="text-[13px] text-text2 mt-1.5 uppercase tracking-[0.5px]">
                  fondata a Vicenza
                </div>
              </div>
              <div className="bg-bg p-6 md:p-[28px]">
                <div className="font-saira font-extrabold text-[50px] text-text1 leading-[0.9]">
                  {counts.areas}
                </div>
                <div className="text-[13px] text-text2 mt-1.5 uppercase tracking-[0.5px]">
                  aree di servizio
                </div>
              </div>
              <div className="bg-bg p-6 md:p-[28px]">
                <div className="font-saira font-extrabold text-[50px] text-text1 leading-[0.9]">
                  ∞
                </div>
                <div className="text-[13px] text-text2 mt-1.5 uppercase tracking-[0.5px]">
                  chiavi in mano
                </div>
              </div>
            </div>
          </div>
          <div className="min-h-[440px] relative overflow-hidden bg-cover bg-center bg-[url('/assets/site/sede.jpg')] rounded-btn flex items-end p-6 group border border-border shadow-sm">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
            <span className="relative font-saira font-semibold text-[13px] tracking-[1px] text-text2 bg-bg rounded-btn px-[13px] py-[8px] uppercase z-10 border border-border shadow-sm">
              Foto — Sede Rossi Impianti
            </span>
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section id="news" className="bg-bg-alt py-[90px] border-b border-border scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-9.5 flex-wrap gap-4">
            <div>
              <div className="font-saira font-bold text-[15px] tracking-[3px] text-rosso uppercase mb-3.5">
                News
              </div>
              <h2 className="font-saira font-extrabold text-4xl md:text-[52px] text-text1 uppercase tracking-[-0.5px]">
                Ultime novità
              </h2>
            </div>
            <Link
              href="/blog"
              className="font-saira font-bold text-[16px] tracking-[1px] uppercase text-text1 hover:text-rosso flex items-center gap-2 group transition-all"
            >
              Tutte le news <span className="group-hover:translate-x-1.5 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {articles.map((art) => {
              const bg = art.categories?.color_bg || '#E11D17';
              const textCol = art.categories?.color_text || '#ffffff';
              return (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="border border-border hover:-translate-y-1 rounded-card overflow-hidden bg-surface transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full group"
                >
                  <div className="overflow-hidden h-[160px] relative bg-bg-alt border-b border-border">
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
                      className="absolute top-3.5 left-3.5 font-saira font-bold text-[12px] tracking-[1px] uppercase rounded-btn px-2.5 py-1 z-10"
                    >
                      {art.categories?.name || 'News'}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="text-[12.5px] text-text2 uppercase tracking-[1px] mb-2.5">
                        {formatDate(art.published_at)} {art.read_time ? `· ${art.read_time}` : ''}
                      </div>
                      <h3 className="font-saira font-bold text-[23px] text-text1 uppercase mb-3.5 line-clamp-2 leading-tight">
                        {art.title}
                      </h3>
                      <p className="text-[14px] text-text2 line-clamp-3 mb-4.5 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                    <span className="font-saira font-bold text-[14px] tracking-[1px] uppercase text-rosso flex items-center gap-1 group-hover:gap-2 transition-all">
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

      {/* CONTACTS FORM */}
      <section id="contatti" className="bg-surface py-[90px] border-t-3 border-rosso border-t-[3px] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div className="text-left flex flex-col justify-between">
            <div>
              <div className="font-saira font-bold text-[15px] tracking-[3px] text-rosso uppercase mb-3.5">
                Contatti
              </div>
              <h2 className="font-saira font-extrabold text-4xl md:text-[50px] text-text1 uppercase mb-7 leading-[0.96] tracking-[-0.5px]">
                Parliamo del<br />tuo progetto
              </h2>
              <div className="flex flex-col gap-4.5 mb-7">
                <div>
                  <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-text2 uppercase mb-1">
                    Sede
                  </div>
                  <div className="text-[16px] text-text1">Via Dei Fiori, 9/A — 36040 Sarego (VI)</div>
                </div>
                <div className="flex gap-12 flex-wrap">
                  <div>
                    <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-text2 uppercase mb-1">
                      Tel / Fax
                    </div>
                    <div className="text-[16px] text-text1">0444 820798</div>
                  </div>
                  <div>
                    <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-text2 uppercase mb-1">
                      Email
                    </div>
                    <div className="text-[16px] text-text1">info@rossimpiantisrl.it</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Map Placeholder */}
            <div className="relative h-[200px] rounded-card overflow-hidden border border-border bg-bg-alt flex items-center justify-center p-6 group shadow-sm">
              <div className="absolute inset-0 bg-cover bg-center bg-[url('/assets/site/header-contatti.jpg')] opacity-20 group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none" />
              <span className="relative z-10 font-saira font-semibold text-[14px] tracking-[1px] text-text1 bg-bg border border-border2 rounded-btn px-4 py-2 uppercase shadow-sm">
                Mappa — Sarego (VI)
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#F6F7F9] border border-border2 rounded-card p-9 md:p-[38px_36px] text-left shadow-sm">
            <h3 className="font-saira font-extrabold text-[26px] text-text1 uppercase mb-5.5">
              Richiedi un preventivo
            </h3>
            {status === 'success' ? (
              <div className="bg-bg border border-green-500/30 text-green-600 p-6 rounded-card text-center my-6 flex flex-col items-center gap-3 shadow-sm">
                <Check size={32} className="text-green-500 animate-bounce" />
                <h4 className="font-saira font-bold text-[20px] uppercase text-text1">Richiesta Inviata!</h4>
                <p className="text-[14.5px] text-text2">Grazie per averci contattato. Ti risponderemo al più presto.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="font-saira font-bold uppercase text-[13px] border border-border2 px-4 py-2 mt-4 hover:border-rosso hover:text-rosso bg-transparent transition-colors cursor-pointer"
                >
                  Nuova Richiesta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
                  <input
                    type="text"
                    placeholder="Nome *"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="bg-bg border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Cognome"
                    value={form.cognome}
                    onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                    className="bg-bg border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso transition-colors"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-bg border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso mb-3.5"
                />
                <input
                  type="tel"
                  placeholder="Telefono"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="bg-bg border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso mb-3.5"
                />
                <textarea
                  placeholder="Raccontaci il tuo progetto *"
                  required
                  rows={4}
                  value={form.messaggio}
                  onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                  className="bg-bg border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso mb-4 resize-none"
                />
                <label className="flex items-start gap-2.5 mb-5 font-plex text-[13px] text-text2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.privacy}
                    onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                    className="mt-1 accent-rosso"
                  />
                  <span>Acconsento al trattamento dei dati secondo la Privacy Policy.</span>
                </label>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="font-saira font-bold text-[18px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn p-4 transition-all cursor-pointer"
                >
                  {status === 'loading' ? 'Invio in corso...' : 'Invia richiesta'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-rosso py-[70px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-7">
          <h2 className="font-saira font-extrabold text-4xl md:text-[54px] text-white uppercase leading-[0.96] tracking-[-0.5px] text-left">
            Costruiamo<br />il tuo impianto.
          </h2>
          <Link
            href="/contatti"
            className="font-saira font-bold text-[19px] tracking-[0.5px] uppercase text-rosso bg-white rounded-btn px-[38px] py-[19px] hover:-translate-y-[2px] transition-all whitespace-nowrap"
          >
            Richiedi un preventivo
          </Link>
        </div>
      </section>
    </>
  );
}
