import Link from 'next/link';

export default function SettoriPage() {
  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-cover bg-center bg-[url('/assets/site/header-settori.jpg')] border-b border-border min-h-[320px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent pointer-events-none" />
        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4">
            Settori
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] mb-4">
            Per chi lavoriamo
          </h1>
          <p className="text-[18px] text-muted max-w-[600px] leading-[1.55]">
            Stesso metodo, tre contesti: l'industria, il commercio e la casa. Impianti idrotermosanitari civili e industriali, su misura.
          </p>
        </div>
      </div>

      {/* SECTORS DETAILS */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-20 flex flex-col gap-5">
        
        {/* Sector 1 */}
        <div className="border border-border border-t-3 border-t-rosso rounded-card bg-surface p-8 md:p-[48px_44px] grid grid-cols-1 md:grid-cols-[auto_1fr] gap-[40px] items-start">
          <div className="font-saira font-extrabold text-[84px] text-rosso leading-[0.8]">01</div>
          <div>
            <h2 className="font-saira font-extrabold text-[40px] text-white uppercase mb-3">Industriale</h2>
            <p className="text-[16px] text-text2 leading-[1.65] mb-[18px] max-w-[760px]">
              Realizzazione e progettazione di impianti antincendio, impianti aria, acqua, gas e metano per aziende, capannoni e imprese edili. Grandi impianti gestiti chiavi in mano, dal progetto esecutivo alla messa in opera.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Aziende & capannoni', 'Imprese edili', 'Antincendio'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sector 2 */}
        <div className="border border-border border-t-3 border-t-azzurro rounded-card bg-surface p-8 md:p-[48px_44px] grid grid-cols-1 md:grid-cols-[auto_1fr] gap-[40px] items-start">
          <div className="font-saira font-extrabold text-[84px] text-azzurro leading-[0.8]">02</div>
          <div>
            <h2 className="font-saira font-extrabold text-[40px] text-white uppercase mb-3">Commerciale</h2>
            <p className="text-[16px] text-text2 leading-[1.65] mb-[18px] max-w-[760px]">
              Impianti idrotermosanitari, climatizzazione a pompa di calore, riscaldamento e raffrescamento canalizzato, impianti meccanici per il ricambio dell'aria. Soluzioni per bar, ristoranti, negozi e uffici.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Bar & ristoranti', 'Negozi & uffici', 'Ricambio aria'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sector 3 */}
        <div className="border border-border border-t-3 border-t-azzurro rounded-card bg-surface p-8 md:p-[48px_44px] grid grid-cols-1 md:grid-cols-[auto_1fr] gap-[40px] items-start">
          <div className="font-saira font-extrabold text-[84px] text-azzurro leading-[0.8]">03</div>
          <div>
            <h2 className="font-saira font-extrabold text-[40px] text-white uppercase mb-3">Residenziale</h2>
            <p className="text-[16px] text-text2 leading-[1.65] mb-[18px] max-w-[760px]">
              Impianti idrotermosanitari, riscaldamento a pannelli radianti, solare termico, climatizzazione, installazione caldaie, impianti di irrigazione e impianti a biomassa. Il comfort di casa, su misura.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Pannelli radianti', 'Solare termico', 'Caldaie & biomassa'].map((tag) => (
                <span key={tag} className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 border border-[#2c3137] rounded-btn px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CTA SECTION */}
      <div className="bg-rosso py-16">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-7">
          <h2 className="font-saira font-extrabold text-[46px] text-white uppercase leading-[0.96] tracking-[-0.5px]">
            Qual è il tuo settore?
          </h2>
          <Link
            href="/contatti"
            className="font-saira font-bold text-[18px] tracking-[0.5px] uppercase text-rosso bg-white rounded-btn px-[34px] py-[18px] hover:-translate-y-[2px] transition-all whitespace-nowrap"
          >
            Parlane con noi
          </Link>
        </div>
      </div>
    </div>
  );
}
