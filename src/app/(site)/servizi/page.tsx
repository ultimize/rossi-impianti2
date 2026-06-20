import Link from 'next/link';

export default function ServiziPage() {
  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-cover bg-center bg-[url('/assets/hero/servizi.png')] border-b border-border min-h-[320px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent pointer-events-none" />
        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4">
            Servizi
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] mb-4">
            Quattro aree,<br />un solo interlocutore
          </h1>
          <p className="text-[18px] text-muted max-w-[600px] leading-[1.55]">
            Progettazione e realizzazione di impianti idrotermosanitari civili e industriali. Ogni servizio comprende il <strong className="text-white">Pacchetto Completo</strong>: progettazione, documentazione e installazione.
          </p>
        </div>
      </div>

      {/* SERVICES LIST */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-20 flex flex-col gap-6">
        
        {/* Service 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-card overflow-hidden bg-surface group">
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center">
            <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-rosso uppercase mb-3">
              01 / Il nostro core
            </div>
            <h2 className="font-saira font-extrabold text-[40px] text-white uppercase mb-3.5 leading-none">
              Impianti industriali
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.65] mb-[18px]">
              Progettazione e costruzione di impianti aria, acqua, gas e metano per aziende, capannoni e imprese edili. Cantieri chiavi in mano, dal progetto esecutivo alla messa in opera.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Aria', 'Acqua', 'Gas / Metano'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="min-h-[300px] relative overflow-hidden bg-[#1d2024] bg-cover bg-center bg-[url('/assets/hero/settori.png')] flex items-end p-6">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-500" />
            <span className="relative z-10 font-saira font-semibold text-[12px] tracking-[1px] text-muted2 bg-[#101214] rounded-btn px-3 py-1.5 uppercase">
              Foto — Centrale Industriale
            </span>
          </div>
        </div>

        {/* Service 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-card overflow-hidden bg-surface group">
          <div className="min-h-[300px] relative overflow-hidden order-2 lg:order-1 bg-[#1d2024] bg-cover bg-center bg-[url('/assets/hero/servizi.png')] flex items-end p-6">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-500" />
            <span className="relative z-10 font-saira font-semibold text-[12px] tracking-[1px] text-muted2 bg-[#101214] rounded-btn px-3 py-1.5 uppercase">
              Foto — Impianto Antincendio
            </span>
          </div>
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center relative order-1 lg:order-2">
            <div className="absolute top-[32px] right-[32px] font-saira font-bold text-[12px] tracking-[1px] bg-rosso text-white rounded-btn px-2.5 py-1">
              NUOVO
            </div>
            <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-rosso uppercase mb-3">
              02 / Sicurezza
            </div>
            <h2 className="font-saira font-extrabold text-[40px] text-white uppercase mb-3.5 leading-none">
              Impianti antincendio
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.65] mb-[18px]">
              Progettazione e realizzazione di impianti antincendio per le aziende, a norma e certificati. Soluzioni dimensionate sul rischio specifico di ogni attività.
            </p>
            <div className="flex flex-wrap gap-2">
              {['A norma', 'Certificati', 'Per aziende'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Service 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-card overflow-hidden bg-surface group">
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center">
            <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-azzurro uppercase mb-3">
              03 / Comfort
            </div>
            <h2 className="font-saira font-extrabold text-[40px] text-white uppercase mb-3.5 leading-none">
              Riscaldamento
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.65] mb-[18px]">
              Caldaie a condensazione, pompe di calore, riscaldamento a pannelli radianti, solare termico e impianti a biomassa. Soluzioni efficienti per ogni esigenza.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Caldaie', 'Pompe di calore', 'Radiante', 'Solare termico'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="min-h-[300px] relative overflow-hidden bg-[#1d2024] bg-cover bg-center bg-[url('/assets/hero/chisiamo.png')] flex items-end p-6">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-500" />
            <span className="relative z-10 font-saira font-semibold text-[12px] tracking-[1px] text-muted2 bg-[#101214] rounded-btn px-3 py-1.5 uppercase">
              Foto — Centrale Termica
            </span>
          </div>
        </div>

        {/* Service 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-card overflow-hidden bg-surface group">
          <div className="min-h-[300px] relative overflow-hidden order-2 lg:order-1 bg-[#1d2024] bg-cover bg-center bg-[url('/assets/hero/marchi.png')] flex items-end p-6">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-500" />
            <span className="relative z-10 font-saira font-semibold text-[12px] tracking-[1px] text-muted2 bg-[#101214] rounded-btn px-3 py-1.5 uppercase">
              Foto — Climatizzazione
            </span>
          </div>
          <div className="p-8 md:p-[48px_44px] flex flex-col justify-center order-1 lg:order-2">
            <div className="font-saira font-extrabold text-[13px] tracking-[2px] text-azzurro uppercase mb-3">
              04 / Clima
            </div>
            <h2 className="font-saira font-extrabold text-[40px] text-white uppercase mb-3.5 leading-none">
              Condizionamento
            </h2>
            <p className="text-[15.5px] text-text2 leading-[1.65] mb-[18px]">
              Climatizzazione e raffrescamento canalizzato a pompa di calore, impianti meccanici per il ricambio dell'aria. Comfort su misura per casa, uffici e attività.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Canalizzato', 'Pompa di calore', 'Ricambio aria'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* PACCHETTO COMPLETO NOTE */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pb-24">
        <div className="bg-surface border border-border border-l-3 border-l-azzurro rounded-card p-8 md:p-[32px_36px] flex items-center justify-between gap-[30px] flex-wrap">
          <div>
            <div className="font-saira font-bold text-[13px] tracking-[2px] text-azzurro uppercase mb-2">
              Pacchetto Completo
            </div>
            <div className="font-saira font-bold text-2xl text-white uppercase">
              Progettazione · Documentazione · Installazione
            </div>
          </div>
          <Link
            href="/contatti"
            className="font-saira font-bold text-[16px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn px-7 py-3.5 transition-colors whitespace-nowrap"
          >
            Richiedi un preventivo
          </Link>
        </div>
      </div>
    </div>
  );
}
