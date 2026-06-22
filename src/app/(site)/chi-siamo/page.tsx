import Link from 'next/link';

export default function ChiSiamoPage() {
  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-cover bg-center bg-[url('/assets/site/header-chisiamo.jpg')] border-b border-border min-h-[320px] flex items-center">
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent pointer-events-none" />
        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4">
            Chi siamo
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] mb-4">
            Dal 1980,<br />al fianco di Vicenza
          </h1>
          <p className="text-[18px] text-muted max-w-[560px] leading-[1.55]">
            44 anni di impianti termoidraulici civili e industriali, costruiti con dedizione e precisione.
          </p>
        </div>
      </div>

      {/* STORY SECTION */}
      <div className="py-[88px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="font-saira font-extrabold text-[44px] text-white uppercase mb-6 tracking-[-0.5px] leading-none">
              La nostra storia
            </h2>
            <p className="text-[16px] text-text2 leading-[1.65] mb-[18px]">
              Nel 1980 nasce a Vicenza la ditta termoidraulica Rossi Impianti. Gestita da sempre con dedizione e precisione, è cresciuta negli anni aumentando l'organico e ampliando la proposta di servizi.
            </p>
            <p className="text-[16px] text-text2 leading-[1.65]">
              Il nostro team di professionisti interviene sia nel pronto intervento sia in progetti di grandi impianti, mettendo competenze specifiche al servizio di aziende, imprese edili, architetti, geometri e privati.
            </p>
          </div>
          <div className="min-h-[380px] relative overflow-hidden bg-[#1d2024] rounded-card border border-border bg-cover bg-center bg-[url('/assets/hero/settori.png')] flex items-end p-6 group">
            <div className="absolute inset-0 bg-black/55 group-hover:bg-black/20 transition-all duration-500" />
            <span className="relative z-10 font-saira font-semibold text-[13px] tracking-[1px] text-muted bg-[#101214] border border-border rounded-btn px-3 py-2 uppercase">
              Foto — I nostri tecnici
            </span>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="bg-surface border-t-3 border-t-rosso border-t-[3px] border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4">
          <div className="py-10 px-8 border-r border-border/60">
            <div className="font-saira font-extrabold text-[48px] text-rosso leading-[0.9]">44</div>
            <div className="text-[13px] text-muted mt-1.5 uppercase tracking-[0.5px]">anni di attività</div>
          </div>
          <div className="py-10 px-8 border-r border-border/60">
            <div className="font-saira font-extrabold text-[48px] text-white leading-[0.9]">1980</div>
            <div className="text-[13px] text-muted mt-1.5 uppercase tracking-[0.5px]">fondata a Vicenza</div>
          </div>
          <div className="py-10 px-8 border-r border-border/60">
            <div className="font-saira font-extrabold text-[48px] text-white leading-[0.9]">4</div>
            <div className="text-[13px] text-muted mt-1.5 uppercase tracking-[0.5px]">aree di servizio</div>
          </div>
          <div className="py-10 px-8">
            <div className="font-saira font-extrabold text-[48px] text-white leading-[0.9]">∞</div>
            <div className="text-[13px] text-muted mt-1.5 uppercase tracking-[0.5px]">cantieri chiavi in mano</div>
          </div>
        </div>
      </div>

      {/* VALORI SECTION */}
      <div className="py-[88px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <h2 className="font-saira font-extrabold text-[44px] text-white uppercase mb-9 tracking-[-0.5px]">
            Come lavoriamo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface border border-border border-t-3 border-t-rosso rounded-card p-9 md:p-[36px_32px]">
              <h3 className="font-saira font-bold text-[24px] text-white uppercase mb-2.5">
                Competenza
              </h3>
              <p className="text-[14.5px] text-muted leading-[1.6]">
                Professionisti specializzati, dal pronto intervento ai grandi impianti industriali.
              </p>
            </div>
            <div className="bg-surface border border-border border-t-3 border-t-azzurro rounded-card p-9 md:p-[36px_32px]">
              <h3 className="font-saira font-bold text-[24px] text-white uppercase mb-2.5">
                Pacchetto Completo
              </h3>
              <p className="text-[14.5px] text-muted leading-[1.6]">
                Un solo interlocutore: progettazione, documentazione e installazione.
              </p>
            </div>
            <div className="bg-surface border border-border border-t-3 border-t-azzurro rounded-card p-9 md:p-[36px_32px]">
              <h3 className="font-saira font-bold text-[24px] text-white uppercase mb-2.5">
                Qualità
              </h3>
              <p className="text-[14.5px] text-muted leading-[1.6]">
                Materiali selezionati e lavori eseguiti a regola d'arte, su misura del cliente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-rosso py-16">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-7">
          <h2 className="font-saira font-extrabold text-[46px] text-white uppercase leading-[0.96] tracking-[-0.5px]">
            Lavoriamo insieme<br />al tuo impianto.
          </h2>
          <Link
            href="/contatti"
            className="font-saira font-bold text-[18px] tracking-[0.5px] uppercase text-rosso bg-white rounded-btn px-[34px] py-[18px] hover:-translate-y-[2px] transition-all whitespace-nowrap"
          >
            Contattaci
          </Link>
        </div>
      </div>
    </div>
  );
}
