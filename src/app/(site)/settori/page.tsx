import Link from 'next/link';
import { media } from '@/lib/media';

export default function SettoriPage() {
  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="bg-bg-alt border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[72px]">
          <div className="font-plex font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-[14px]">
            Settori
          </div>
          <h1 className="font-archivo font-extrabold text-[56px] leading-[1.02] tracking-[-1.5px] text-text1 mb-4">
            Per chi lavoriamo
          </h1>
          <p className="text-[18px] text-text2 max-w-[620px] leading-[1.6]">
            Stesso metodo, due contesti: l'industria e il commercio. Impianti idrotermosanitari industriali e commerciali, su misura.
          </p>
        </div>
      </div>

      {/* SECTORS DETAILS */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-20 pb-[50px] flex flex-col gap-5">

        {/* Sector 1 */}
        <div className="border border-border rounded-[18px] bg-surface p-8 md:p-[46px_44px] grid grid-cols-1 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_340px] gap-10 items-center shadow-card overflow-hidden">
          <div className="font-archivo font-extrabold text-[78px] text-rosso leading-[0.8]">01</div>
          <div>
            <h2 className="font-archivo font-extrabold text-[36px] text-text1 tracking-[-0.5px] mb-3">Industriale</h2>
            <p className="text-[16px] text-text2 leading-[1.7] mb-5 max-w-[760px]">
              Realizzazione e progettazione di impianti antincendio, impianti aria, acqua, gas e metano per aziende, capannoni e imprese edili. Grandi impianti gestiti chiavi in mano, dal progetto esecutivo alla messa in opera.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Aziende & capannoni', 'Imprese edili', 'Antincendio'].map((tag) => (
                <span key={tag} className="text-[14px] text-text2 bg-chip rounded-pill px-[15px] py-[7px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block h-[220px] rounded-[14px] bg-bg-alt bg-cover bg-center" style={{ backgroundImage: `url(${media('servizi/featured/settori-industriale.jpg')})` }} />
        </div>

        {/* Sector 2 */}
        <div className="border border-border rounded-[18px] bg-surface p-8 md:p-[46px_44px] grid grid-cols-1 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_340px] gap-10 items-center shadow-card overflow-hidden">
          <div className="font-archivo font-extrabold text-[78px] text-azzurro leading-[0.8]">02</div>
          <div>
            <h2 className="font-archivo font-extrabold text-[36px] text-text1 tracking-[-0.5px] mb-3">Commerciale</h2>
            <p className="text-[16px] text-text2 leading-[1.7] mb-5 max-w-[760px]">
              Impianti idrotermosanitari, climatizzazione a pompa di calore, riscaldamento e raffrescamento canalizzato, impianti meccanici per il ricambio dell'aria. Soluzioni per bar, ristoranti, negozi e uffici.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Bar & ristoranti', 'Negozi & uffici', 'Ricambio aria'].map((tag) => (
                <span key={tag} className="text-[14px] text-text2 bg-chip rounded-pill px-[15px] py-[7px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block h-[220px] rounded-[14px] bg-bg-alt bg-cover bg-center" style={{ backgroundImage: `url(${media('servizi/climatizzazione/climatizzazione-3.jpg')})` }} />
        </div>

      </div>

      {/* CTA SECTION */}
      <div className="bg-bg pt-2.5 pb-[88px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="bg-gradient-to-br from-rosso to-rosso-hover rounded-[22px] p-[52px_56px] flex flex-wrap items-center justify-between gap-[30px] shadow-cta">
            <h2 className="font-archivo font-extrabold text-[40px] text-white leading-none tracking-[-1px]">
              Qual è il tuo settore?
            </h2>
            <Link
              href="/contatti"
              className="font-semibold text-[17px] text-rosso bg-white rounded-[11px] px-[34px] py-[18px] hover:-translate-y-[2px] transition-all whitespace-nowrap"
            >
              Parlane con noi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
