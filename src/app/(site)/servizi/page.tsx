import Link from 'next/link';

export default function ServiziPage() {
  return (
    <div className="bg-bg text-text1 font-plex">
      {/* BANNER */}
      <div className="bg-bg-alt border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-14 md:py-[72px]">
          <div className="font-plex font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-3.5">
            Servizi
          </div>
          <h1 className="font-archivo font-extrabold text-[40px] md:text-[56px] leading-[1.02] tracking-[-1.5px] text-text1 mb-4">
            Quattro aree, un solo interlocutore
          </h1>
          <p className="text-[18px] text-text2 max-w-[620px] leading-[1.6]">
            Progettazione e realizzazione di impianti idrotermosanitari civili e industriali. Ogni servizio comprende il <strong className="text-text1 font-semibold">Pacchetto Completo</strong>: progettazione, documentazione e installazione.
          </p>
        </div>
      </div>

      {/* SERVICE BLOCKS */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-10 flex flex-col gap-5">

        {/* Service 1 — Impianti industriali */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-[18px] overflow-hidden bg-bg shadow-[0_18px_40px_-28px_rgba(20,30,45,.2)]">
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center">
            <div className="font-plex font-bold text-[12.5px] tracking-[1.4px] text-rosso uppercase mb-3.5">
              01 / Il nostro core
            </div>
            <h2 className="font-archivo font-extrabold text-[36px] text-text1 tracking-[-0.6px] leading-[1.05] mb-3.5">
              Impianti industriali
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.7] mb-5">
              Progettazione e costruzione di impianti aria, acqua, gas e metano per aziende, capannoni e imprese edili. Cantieri chiavi in mano, dal progetto esecutivo alla messa in opera.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Aria', 'Acqua', 'Gas / Metano'].map((tag) => (
                <span key={tag} className="text-[14px] text-text2 bg-chip rounded-pill px-[15px] py-[7px]">
                  {tag}
                </span>
              ))}
            </div>
            <Link href="/servizi/impianti-industriali" className="inline-flex items-center gap-1.5 mt-6 font-plex font-semibold text-[15px] text-rosso hover:gap-2.5 transition-all">
              Scopri di più e vedi la galleria <span>→</span>
            </Link>
          </div>
          <div className="min-h-[320px] relative bg-[#dde4ea] bg-cover bg-center bg-[url('/assets/servizi/industriale/industriale-1.jpg')]" />
        </div>

        {/* Service 2 — Impianti antincendio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-[18px] overflow-hidden bg-bg shadow-[0_18px_40px_-28px_rgba(20,30,45,.2)]">
          <div className="min-h-[320px] relative order-2 lg:order-1 bg-[#dde4ea] bg-cover bg-center bg-[url('/assets/servizi/antincendio/antincendio-1.jpg')]" />
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center relative order-1 lg:order-2">
            <div className="absolute top-8 right-8 font-plex font-bold text-[11px] tracking-[0.6px] bg-rosso text-white rounded-pill px-3 py-[5px]">
              NUOVO
            </div>
            <div className="font-plex font-bold text-[12.5px] tracking-[1.4px] text-rosso uppercase mb-3.5">
              02 / Sicurezza
            </div>
            <h2 className="font-archivo font-extrabold text-[36px] text-text1 tracking-[-0.6px] leading-[1.05] mb-3.5">
              Impianti antincendio
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.7] mb-5">
              Progettazione e realizzazione di impianti antincendio per le aziende, a norma e certificati. Soluzioni dimensionate sul rischio specifico di ogni attività.
            </p>
            <div className="flex flex-wrap gap-2">
              {['A norma', 'Certificati', 'Per aziende'].map((tag) => (
                <span key={tag} className="text-[14px] text-text2 bg-chip rounded-pill px-[15px] py-[7px]">
                  {tag}
                </span>
              ))}
            </div>
            <Link href="/servizi/impianti-antincendio" className="inline-flex items-center gap-1.5 mt-6 font-plex font-semibold text-[15px] text-rosso hover:gap-2.5 transition-all">
              Scopri di più e vedi la galleria <span>→</span>
            </Link>
          </div>
        </div>

        {/* Service 3 — Riscaldamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-[18px] overflow-hidden bg-bg shadow-[0_18px_40px_-28px_rgba(20,30,45,.2)]">
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center">
            <div className="font-plex font-bold text-[12.5px] tracking-[1.4px] text-azzurro uppercase mb-3.5">
              03 / Comfort
            </div>
            <h2 className="font-archivo font-extrabold text-[36px] text-text1 tracking-[-0.6px] leading-[1.05] mb-3.5">
              Riscaldamento
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.7] mb-5">
              Caldaie a condensazione, pompe di calore, riscaldamento a pannelli radianti, solare termico e impianti a biomassa. Soluzioni efficienti per ogni esigenza.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Caldaie', 'Pompe di calore', 'Radiante', 'Solare termico'].map((tag) => (
                <span key={tag} className="text-[14px] text-text2 bg-chip rounded-pill px-[15px] py-[7px]">
                  {tag}
                </span>
              ))}
            </div>
            <Link href="/servizi/riscaldamento" className="inline-flex items-center gap-1.5 mt-6 font-plex font-semibold text-[15px] text-azzurro hover:gap-2.5 transition-all">
              Scopri di più e vedi la galleria <span>→</span>
            </Link>
          </div>
          <div className="min-h-[320px] relative bg-[#dde4ea] bg-cover bg-center bg-[url('/assets/servizi/riscaldamento/riscaldamento-1.jpg')]" />
        </div>

        {/* Service 4 — Condizionamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-[18px] overflow-hidden bg-bg shadow-[0_18px_40px_-28px_rgba(20,30,45,.2)]">
          <div className="min-h-[320px] relative order-2 lg:order-1 bg-[#dde4ea] bg-cover bg-center bg-[url('/assets/servizi/climatizzazione/climatizzazione-1.jpg')]" />
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center order-1 lg:order-2">
            <div className="font-plex font-bold text-[12.5px] tracking-[1.4px] text-azzurro uppercase mb-3.5">
              04 / Clima
            </div>
            <h2 className="font-archivo font-extrabold text-[36px] text-text1 tracking-[-0.6px] leading-[1.05] mb-3.5">
              Condizionamento
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.7] mb-5">
              Climatizzazione e raffrescamento canalizzato a pompa di calore, impianti meccanici per il ricambio dell&apos;aria. Comfort su misura per casa, uffici e attività.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Canalizzato', 'Pompa di calore', 'Ricambio aria'].map((tag) => (
                <span key={tag} className="text-[14px] text-text2 bg-chip rounded-pill px-[15px] py-[7px]">
                  {tag}
                </span>
              ))}
            </div>
            <Link href="/servizi/climatizzazione" className="inline-flex items-center gap-1.5 mt-6 font-plex font-semibold text-[15px] text-azzurro hover:gap-2.5 transition-all">
              Scopri di più e vedi la galleria <span>→</span>
            </Link>
          </div>
        </div>

      </div>

      {/* PACCHETTO COMPLETO NOTE */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-6 pb-[90px]">
        <div className="bg-[#f0f8fd] border border-[#d3e9f6] rounded-card p-8 md:p-[32px_36px] flex items-center justify-between gap-[30px] flex-wrap">
          <div>
            <div className="font-plex font-bold text-[12.5px] tracking-[1.4px] text-azzurro uppercase mb-2">
              Pacchetto Completo
            </div>
            <div className="font-archivo font-bold text-[24px] text-text1 tracking-[-0.3px]">
              Progettazione · Documentazione · Installazione
            </div>
          </div>
          <Link
            href="/contatti"
            className="font-plex font-semibold text-[16px] text-white bg-rosso hover:bg-rosso-hover rounded-btn px-7 py-[15px] transition-all whitespace-nowrap shadow-[0_8px_22px_rgba(225,29,23,.24)] hover:-translate-y-0.5"
          >
            Richiedi un preventivo
          </Link>
        </div>
      </div>
    </div>
  );
}
