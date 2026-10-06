import Link from 'next/link';

export default function ChiSiamoPage() {
  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="bg-bg-alt border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[72px]">
          <div className="font-plex font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-[14px]">
            Chi siamo
          </div>
          <h1 className="font-archivo font-extrabold text-[40px] md:text-[56px] leading-[1.02] tracking-[-1.5px] text-text1 mb-4">
            Dal 1980, al fianco di Vicenza
          </h1>
          <p className="text-[18px] text-text2 max-w-[560px] leading-[1.55]">
            44 anni di impianti termoidraulici industriali e commerciali, costruiti con dedizione e precisione.
          </p>
        </div>
      </div>

      {/* STORY SECTION */}
      <div className="py-[88px] bg-bg">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="text-left">
            <h2 className="font-archivo font-extrabold text-[40px] text-text1 mb-6 tracking-[-0.8px] leading-[1.05]">
              La nostra storia
            </h2>
            <p className="text-[16.5px] text-text2 leading-[1.7] mb-[18px]">
              Nel 1980 nasce a Vicenza la ditta termoidraulica Rossi Impianti. Gestita da sempre con dedizione e precisione, è cresciuta negli anni aumentando l&apos;organico e ampliando la proposta di servizi.
            </p>
            <p className="text-[16.5px] text-text2 leading-[1.7]">
              Il nostro team di professionisti interviene sia nel pronto intervento sia in progetti di grandi impianti, mettendo competenze specifiche al servizio di aziende, imprese edili, architetti e geometri.
            </p>
          </div>
          <div className="relative min-h-[420px] rounded-[18px] overflow-hidden bg-[#dde4ea] bg-cover bg-center bg-[url('/assets/site/header-settori.jpg')] shadow-[0_30px_60px_-28px_rgba(20,30,45,.28)]" />
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="bg-bg-alt border-t border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4">
          <div className="py-11 px-8 border-r border-border text-left">
            <div className="font-archivo font-extrabold text-[48px] text-rosso leading-[0.9]">44</div>
            <div className="text-[13px] text-muted mt-2">anni di attività</div>
          </div>
          <div className="py-11 px-8 border-r border-border text-left">
            <div className="font-archivo font-extrabold text-[48px] text-text1 leading-[0.9]">1980</div>
            <div className="text-[13px] text-muted mt-2">fondata a Vicenza</div>
          </div>
          <div className="py-11 px-8 border-r border-border text-left">
            <div className="font-archivo font-extrabold text-[48px] text-text1 leading-[0.9]">4</div>
            <div className="text-[13px] text-muted mt-2">aree di servizio</div>
          </div>
          <div className="py-11 px-8 text-left">
            <div className="font-archivo font-extrabold text-[48px] text-azzurro leading-[0.9]">100%</div>
            <div className="text-[13px] text-muted mt-2">cantieri chiavi in mano</div>
          </div>
        </div>
      </div>

      {/* VALORI SECTION */}
      <div className="py-[88px] bg-bg">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <h2 className="font-archivo font-extrabold text-[40px] text-text1 mb-9 tracking-[-0.8px] text-left">
            Come lavoriamo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            {/* Competenza */}
            <div className="bg-surface border border-border rounded-card p-[36px_32px] text-left shadow-card">
              <div className="w-[50px] h-[50px] rounded-[13px] bg-rosso-tint flex items-center justify-center text-rosso mb-[18px]">
                <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                  <path d="m12 3 2.4 5 5.6.8-4 4 1 5.6L12 21l-5-2.6 1-5.6-4-4 5.6-.8z" />
                </svg>
              </div>
              <h3 className="font-archivo font-bold text-[23px] text-text1 tracking-[-0.3px] mb-2.5">
                Competenza
              </h3>
              <p className="text-[14.5px] text-text2 leading-[1.6]">
                Professionisti specializzati, dal pronto intervento ai grandi impianti industriali.
              </p>
            </div>
            {/* Pacchetto Completo */}
            <div className="bg-surface border border-border rounded-card p-[36px_32px] text-left shadow-card">
              <div className="w-[50px] h-[50px] rounded-[13px] bg-azzurro-tint flex items-center justify-center text-azzurro mb-[18px]">
                <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                  <path d="m3 7 9-4 9 4-9 4-9-4Z" />
                  <path d="M3 7v6l9 4 9-4V7" />
                </svg>
              </div>
              <h3 className="font-archivo font-bold text-[23px] text-text1 tracking-[-0.3px] mb-2.5">
                Pacchetto Completo
              </h3>
              <p className="text-[14.5px] text-text2 leading-[1.6]">
                Un solo interlocutore: progettazione, documentazione e installazione.
              </p>
            </div>
            {/* Qualità */}
            <div className="bg-surface border border-border rounded-card p-[36px_32px] text-left shadow-card">
              <div className="w-[50px] h-[50px] rounded-[13px] bg-azzurro-tint flex items-center justify-center text-azzurro mb-[18px]">
                <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                  <path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2Z" />
                  <path d="M9 21h6" />
                </svg>
              </div>
              <h3 className="font-archivo font-bold text-[23px] text-text1 tracking-[-0.3px] mb-2.5">
                Qualità
              </h3>
              <p className="text-[14.5px] text-text2 leading-[1.6]">
                Materiali selezionati e lavori eseguiti a regola d&apos;arte, su misura del cliente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-bg pb-[88px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="bg-gradient-to-br from-rosso to-[#c2160f] rounded-[22px] px-8 py-12 md:px-14 md:py-[52px] flex flex-col md:flex-row items-center justify-between gap-[30px] flex-wrap text-left shadow-cta">
            <h2 className="font-archivo font-extrabold text-[40px] text-white leading-[1.06] tracking-[-1px] m-0">
              Lavoriamo insieme al tuo impianto.
            </h2>
            <Link
              href="/contatti"
              className="font-plex font-semibold text-[17px] text-rosso bg-white rounded-[11px] px-[34px] py-[18px] hover:-translate-y-[2px] transition-all whitespace-nowrap cursor-pointer"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
