'use client';

import React, { useState } from 'react';
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
      <div className="relative bg-cover bg-center bg-[url('/assets/site/header-contatti.jpg')] border-b border-border min-h-[320px] flex items-center">
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent pointer-events-none" />
        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4">
            Contatti
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] mb-4">
            Parliamo del<br />tuo progetto
          </h1>
          <p className="text-[18px] text-muted max-w-[600px] leading-[1.55]">
            Richiedi un preventivo o una consulenza: ti rispondiamo al più presto.
          </p>
        </div>
      </div>

      {/* CONTACT INFO AND FORM */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
        {/* Info & Map Column */}
        <div>
          <div className="flex flex-col gap-6 mb-7">
            <div>
              <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-muted2 uppercase mb-1.5">
                Sede
              </div>
              <div className="text-[17px] text-white">Via Dei Fiori, 9/A — 36040 Sarego (VI)</div>
            </div>
            <div className="flex gap-14 flex-wrap">
              <div>
                <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-muted2 uppercase mb-1.5">
                  Tel / Fax
                </div>
                <div className="text-[17px] text-white">0444 820798</div>
              </div>
              <div>
                <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-muted2 uppercase mb-1.5">
                  P.IVA
                </div>
                <div className="text-[17px] text-white">01659230245</div>
              </div>
            </div>
            <div>
              <div className="font-saira font-bold text-[12.5px] tracking-[1.5px] text-muted2 uppercase mb-1.5">
                Email
              </div>
              <div className="text-[17px] text-white">info@rossimpiantisrl.it</div>
              <div className="text-[15px] text-muted mt-0.5">amministrazione@rossimpiantisrl.it</div>
            </div>
          </div>
          {/* Map */}
          <div className="relative h-[280px] rounded-card overflow-hidden border border-border bg-[#101214]">
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
        <div className="bg-surface border border-border rounded-card p-9 md:p-[40px_38px]">
          <h2 className="font-saira font-extrabold text-[30px] text-white uppercase mb-6">
            Richiedi un preventivo
          </h2>
          {status === 'success' ? (
            <div className="bg-[#101214] border border-green-500/30 text-green-400 p-8 rounded-card text-center flex flex-col items-center gap-3">
              <Check size={36} className="text-green-500 animate-bounce" />
              <h4 className="font-saira font-bold text-[22px] uppercase text-white">Messaggio inviato!</h4>
              <p className="text-[14.5px] text-muted leading-relaxed">
                Grazie per la tua richiesta. Il nostro ufficio tecnico ti ricontatterà al più presto.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="font-saira font-bold uppercase text-[13px] border border-border px-5 py-2.5 mt-4 hover:border-white transition-colors"
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
                  className="bg-[#101214] border border-[#2c3137] rounded-btn p-3.5 text-white font-plex text-[15px] outline-none focus:border-rosso transition-colors"
                />
                <input
                  type="text"
                  placeholder="Cognome"
                  value={form.cognome}
                  onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                  className="bg-[#101214] border border-[#2c3137] rounded-btn p-3.5 text-white font-plex text-[15px] outline-none focus:border-rosso transition-colors"
                />
              </div>
              <input
                type="email"
                placeholder="Email *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-[#101214] border border-[#2c3137] rounded-btn p-3.5 text-white font-plex text-[15px] outline-none focus:border-rosso mb-3.5"
              />
              <input
                type="tel"
                placeholder="Telefono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="bg-[#101214] border border-[#2c3137] rounded-btn p-3.5 text-white font-plex text-[15px] outline-none focus:border-rosso mb-3.5"
              />
              <textarea
                placeholder="Raccontaci il tuo progetto *"
                required
                rows={5}
                value={form.messaggio}
                onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                className="bg-[#101214] border border-[#2c3137] rounded-btn p-3.5 text-white font-plex text-[15px] outline-none focus:border-rosso mb-4 resize-none"
              />
              <label className="flex items-start gap-2.5 mb-5 font-plex text-[13px] text-muted select-none cursor-pointer">
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
                className="font-saira font-bold text-[18px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn p-4 transition-all"
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
