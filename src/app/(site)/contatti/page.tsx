'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function ContattiPage() {
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    messaggio: '',
    privacy: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.messaggio || !form.privacy) {
      alert('Per favore compila i campi obbligatori e accetta la privacy policy.');
      return;
    }
    setStatus('loading');
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

  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-bg border-b border-border py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-left">
            <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4">
              Contatti
            </div>
            <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] text-text1 mb-4 animate-revealUp">
              Parliamo del<br />tuo progetto
            </h1>
            <p className="text-[18px] text-text2 max-w-[600px] leading-[1.55] animate-revealUp">
              Richiedi un preventivo o una consulenza: ti rispondiamo al più presto.
            </p>
          </div>
          <div className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-square rounded-card overflow-hidden shadow-lg animate-revealUp border border-border">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center filter saturate-[0.95] contrast-[1.02] bg-[url('/assets/site/header-contatti.jpg')]"
            />
          </div>
        </div>
      </div>

      {/* CONTACT INFO AND FORM */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
        {/* Info & Map Column */}
        <div className="text-left">
          <div className="flex flex-col gap-6 mb-7">
            <div>
              <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-text2 uppercase mb-1.5">
                Sede
              </div>
              <div className="text-[17px] text-text1">Via Dei Fiori, 9/A — 36040 Sarego (VI)</div>
            </div>
            <div className="flex gap-14 flex-wrap">
              <div>
                <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-text2 uppercase mb-1.5">
                  Tel / Fax
                </div>
                <div className="text-[17px] text-text1">0444 820798</div>
              </div>
              <div>
                <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-text2 uppercase mb-1.5">
                  P.IVA
                </div>
                <div className="text-[17px] text-text1">01659230245</div>
              </div>
            </div>
            <div>
              <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-text2 uppercase mb-1.5">
                Email
              </div>
              <div className="text-[17px] text-text1">info@rossimpiantisrl.it</div>
              <div className="text-[15px] text-text2 mt-0.5">amministrazione@rossimpiantisrl.it</div>
            </div>
          </div>
          {/* Map */}
          <div className="relative h-[280px] rounded-card overflow-hidden border border-border2 bg-white shadow-sm">
            <iframe
              src="https://www.google.com/maps?q=Via%20Dei%20Fiori%209%2FA%2C%2036040%20Sarego%20VI&output=embed"
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

        {/* Form Column */}
        <div className="bg-surface border border-border rounded-card p-9 md:p-[40px_38px] shadow-sm">
          <h2 className="font-saira font-extrabold text-[30px] text-text1 uppercase mb-6 text-left">
            Richiedi un preventivo
          </h2>
          {status === 'success' ? (
            <div className="bg-bg border border-green-500/20 text-green-600 p-8 rounded-card text-center flex flex-col items-center gap-3 shadow-sm">
              <Check size={36} className="text-green-500 animate-bounce" />
              <h4 className="font-saira font-bold text-[22px] uppercase text-text1">Messaggio inviato!</h4>
              <p className="text-[14.5px] text-text2 leading-relaxed">
                Grazie per la tua richiesta. Il nostro ufficio tecnico ti ricontatterà al più presto.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="font-saira font-bold uppercase text-[13px] border border-border2 px-5 py-2.5 mt-4 hover:border-rosso hover:text-rosso bg-transparent transition-colors cursor-pointer"
              >
                Invia un altro messaggio
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
                rows={5}
                value={form.messaggio}
                onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                className="bg-bg border border-border2 rounded-btn p-3.5 text-text1 font-plex text-[15px] outline-none focus:border-rosso mb-4 resize-none"
              />
              <label className="flex items-start gap-2.5 mb-5 font-plex text-[13px] text-text2 select-none cursor-pointer text-left">
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
    </div>
  );
}
