'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Cookie banner a norma GDPR con Google Consent Mode v2.
 * - Categorie: necessari (sempre on), statistici, marketing/profilazione
 * - Salva la scelta in localStorage e aggiorna il consenso a gtag
 * - Riapribile da qualsiasi punto con window.openCookieSettings()
 */

const STORAGE_KEY = 'rossi_cookie_consent';
const CONSENT_VERSION = 1;

type Consent = {
  v: number;
  ts: string;
  necessary: true;
  statistics: boolean;
  marketing: boolean;
};

function applyConsent(c: { statistics: boolean; marketing: boolean }) {
  // @ts-expect-error gtag iniettato dallo script nel layout
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    // @ts-expect-error gtag
    window.gtag('consent', 'update', {
      analytics_storage: c.statistics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied',
    });
  }
}

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (c.v !== CONSENT_VERSION) return null;
    return c;
  } catch {
    return null;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      applyConsent(stored);
    } else {
      setVisible(true);
    }
    // permette la riapertura da footer / link "Gestione cookie"
    // @ts-expect-error custom
    window.openCookieSettings = () => {
      const s = readConsent();
      setStatistics(s?.statistics ?? false);
      setMarketing(s?.marketing ?? false);
      setCustomize(true);
      setVisible(true);
    };
  }, []);

  function save(c: { statistics: boolean; marketing: boolean }) {
    const consent: Consent = {
      v: CONSENT_VERSION,
      ts: new Date().toISOString(),
      necessary: true,
      statistics: c.statistics,
      marketing: c.marketing,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      /* storage non disponibile: applico comunque il consenso a runtime */
    }
    applyConsent(consent);
    setVisible(false);
    setCustomize(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[680px] bg-bg border border-border rounded-card shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="font-saira font-extrabold text-[20px] text-white uppercase tracking-[0.5px] mb-3">
            Informativa sui cookie
          </h2>
          <p className="font-plex text-[14px] text-muted leading-relaxed mb-5">
            Questo sito utilizza cookie tecnici necessari al corretto funzionamento e,
            previo consenso, cookie statistici e di marketing/profilazione, anche di terze
            parti, per migliorare la tua esperienza. Puoi accettare tutti i cookie, rifiutare
            quelli non necessari o personalizzare le tue scelte. Per saperne di più consulta la{' '}
            <Link href="/privacy-policy" className="text-rosso underline hover:no-underline">
              Privacy Policy
            </Link>{' '}
            e la{' '}
            <Link href="/cookie-policy" className="text-rosso underline hover:no-underline">
              Cookie Policy
            </Link>
            .
          </p>

          {customize && (
            <div className="flex flex-col gap-3 mb-6 border-t border-border pt-5">
              <Row title="Necessari" desc="Indispensabili al funzionamento del sito. Sempre attivi." checked disabled />
              <Row
                title="Statistici"
                desc="Analisi anonima delle visite (es. Google Analytics)."
                checked={statistics}
                onChange={setStatistics}
              />
              <Row
                title="Marketing / Profilazione"
                desc="Cookie per annunci personalizzati e remarketing."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              onClick={() => save({ statistics: true, marketing: true })}
              className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn px-6 py-3 transition-all order-1"
            >
              Accetta tutti
            </button>
            <button
              onClick={() => save({ statistics: false, marketing: false })}
              className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white border border-border hover:border-white rounded-btn px-6 py-3 transition-all order-2"
            >
              Rifiuta non necessari
            </button>
            {customize ? (
              <button
                onClick={() => save({ statistics, marketing })}
                className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white border border-border hover:border-white rounded-btn px-6 py-3 transition-all order-3"
              >
                Salva preferenze
              </button>
            ) : (
              <button
                onClick={() => setCustomize(true)}
                className="font-saira font-semibold text-[14px] tracking-[0.5px] uppercase text-muted hover:text-white px-2 py-3 transition-colors order-3 sm:ml-auto"
              >
                Personalizza
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 md:px-8 py-3 border-t border-border bg-surface">
          <span className="font-plex text-[11px] text-muted2 uppercase tracking-[1px]">Powered by</span>
          <Image src="/adevolution.svg" alt="Adevolution" width={92} height={20} className="opacity-90" />
        </div>
      </div>
    </div>
  );
}

function Row({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-start gap-3 ${disabled ? 'opacity-70' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 accent-rosso shrink-0"
      />
      <span>
        <span className="block font-saira font-bold text-[14px] text-white uppercase tracking-[0.5px]">{title}</span>
        <span className="block font-plex text-[13px] text-muted leading-snug">{desc}</span>
      </span>
    </label>
  );
}
