import Link from 'next/link';

export default function ServiziPage() {
  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-bg border-b border-border py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-left">
            <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4 animate-revealUp">
              Servizi
            </div>
            <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] text-text1 mb-4 animate-revealUp">
              Quattro aree,<br />un solo interlocutore
            </h1>
            <p className="text-[18px] text-text2 max-w-[600px] leading-[1.55] animate-revealUp">
              Progettazione e realizzazione di impianti idrotermosanitari civili e industriali. Ogni servizio comprende il <strong className="text-text1 font-bold">Pacchetto Completo</strong>: progettazione, documentazione e installazione.
            </p>
          </div>
          <div className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-square rounded-card overflow-hidden shadow-lg animate-revealUp border border-border">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center filter saturate-[0.95] contrast-[1.02] bg-[url('/assets/site/header-servizi.jpg')]"
            />
          </div>
        </div>
      </div>

      {/* SERVICES LIST */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-20 flex flex-col gap-6">
        
        {/* Service 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-card overflow-hidden bg-surface shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center text-left">
            <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-rosso uppercase mb-3">
              01 / Il nostro core
            </div>
            <h2 className="font-saira font-extrabold text-[40px] text-text1 uppercase mb-3.5 leading-none">
              Impianti industriali
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.65] mb-[18px]">
              Progettazione e costruzione di impianti aria, acqua, gas e metano per aziende, capannoni e imprese edili. Cantieri chiavi in mano, dal progetto esecutivo alla messa in opera.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Aria', 'Acqua', 'Gas / Metano'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-border2 rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="min-h-[300px] relative overflow-hidden bg-bg-alt bg-cover bg-center bg-[url('/assets/site/header-settori.jpg')] flex items-end p-6 border-l border-border">
            <span className="relative z-10 font-saira font-semibold text-[12px] tracking-[1px] text-text2 bg-bg border border-border rounded-btn px-3 py-1.5 uppercase shadow-sm">
              Foto — Centrale Industriale
            </span>
          </div>
        </div>

        {/* Service 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-card overflow-hidden bg-surface shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="min-h-[300px] relative overflow-hidden order-2 lg:order-1 bg-bg-alt bg-cover bg-center bg-[url('/assets/site/header-servizi.jpg')] flex items-end p-6 border-r border-border">
            <span className="relative z-10 font-saira font-semibold text-[12px] tracking-[1px] text-text2 bg-bg border border-border rounded-btn px-3 py-1.5 uppercase shadow-sm">
              Foto — Impianto Antincendio
            </span>
          </div>
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center relative order-1 lg:order-2 text-left">
            <div className="absolute top-[32px] right-[32px] font-saira font-bold text-[12px] tracking-[1px] bg-rosso text-white rounded-btn px-2.5 py-1">
              NUOVO
            </div>
            <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-rosso uppercase mb-3">
              02 / Sicurezza
            </div>
            <h2 className="font-saira font-extrabold text-[40px] text-text1 uppercase mb-3.5 leading-none">
              Impianti antincendio
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.65] mb-[18px]">
              Progettazione e realizzazione di impianti antincendio per le aziende, a norma e certificati. Soluzioni dimensionate sul rischio specifico di ogni attività.
            </p>
            <div className="flex flex-wrap gap-2">
              {['A norma', 'Certificati', 'Per aziende'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-border2 rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Service 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-card overflow-hidden bg-surface shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center text-left">
            <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-azzurro uppercase mb-3">
              03 / Comfort
            </div>
            <h2 className="font-saira font-extrabold text-[40px] text-text1 uppercase mb-3.5 leading-none">
              Riscaldamento
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.65] mb-[18px]">
              Caldaie a condensazione, pompe di calore, riscaldamento a pannelli radianti, solare termico e impianti a biomassa. Soluzioni efficienti per ogni esigenza.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Caldaie', 'Pompe di calore', 'Radiante', 'Solare termico'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-border2 rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="min-h-[300px] relative overflow-hidden bg-bg-alt bg-cover bg-center bg-[url('/assets/site/header-chisiamo.jpg')] flex items-end p-6 border-l border-border">
            <span className="relative z-10 font-saira font-semibold text-[12px] tracking-[1px] text-text2 bg-bg border border-border rounded-btn px-3 py-1.5 uppercase shadow-sm">
              Foto — Centrale Termica
            </span>
          </div>
        </div>

        {/* Service 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-card overflow-hidden bg-surface shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="min-h-[300px] relative overflow-hidden order-2 lg:order-1 bg-bg-alt bg-cover bg-center bg-[url('/assets/site/header-marchi.jpg')] flex items-end p-6 border-r border-border">
            <span className="relative z-10 font-saira font-semibold text-[12px] tracking-[1px] text-text2 bg-bg border border-border rounded-btn px-3 py-1.5 uppercase shadow-sm">
              Foto — Climatizzazione
            </span>
          </div>
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center order-1 lg:order-2 text-left">
            <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-azzurro uppercase mb-3">
              04 / Clima
            </div>
            <h2 className="font-saira font-extrabold text-[40px] text-text1 uppercase mb-3.5 leading-none">
              Condizionamento
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.65] mb-[18px]">
              Climatizzazione e raffrescamento canalizzato a pompa di calore, impianti meccanici per il ricambio dell'aria. Comfort su misura per casa, uffici e attività.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Canalizzato', 'Pompa di calore', 'Ricambio aria'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-border2 rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* PACCHETTO COMPLETO NOTE */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pb-24">
        <div className="bg-surface border border-border border-l-3 border-l-azzurro rounded-card p-8 md:p-[32px_36px] flex items-center justify-between gap-[30px] flex-wrap shadow-sm">
          <div className="text-left">
            <div className="font-saira font-bold text-[13px] tracking-[2px] text-azzurro uppercase mb-2">
              Pacchetto Completo
            </div>
            <div className="font-saira font-bold text-2xl text-text1 uppercase">
              Progettazione · Documentazione · Installazione
            </div>
          </div>
          <Link
            href="/contatti"
            className="font-saira font-bold text-[16px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn px-7 py-3.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            Richiedi un preventivo
          </Link>
        </div>
      </div>
    </div>
  );
}
