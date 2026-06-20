export default function MarchiPage() {
  const brands = [
    {
      name: 'Sime',
      title: 'SIME',
      desc: 'Caldaie a condensazione e gruppi termici ad alta efficienza per il riscaldamento.',
      hoverColor: 'hover:border-rosso',
    },
    {
      name: 'Daikin',
      title: 'DAIKIN',
      desc: 'Climatizzatori e pompe di calore tra i più efficienti e silenziosi sul mercato.',
      hoverColor: 'hover:border-azzurro',
    },
    {
      name: 'Aermec',
      title: 'AERMEC',
      desc: 'Ventilconvettori e soluzioni per la climatizzazione di ambienti civili e commerciali.',
      hoverColor: 'hover:border-azzurro',
    },
    {
      name: 'Samsung',
      title: 'SAMSUNG',
      desc: 'Sistemi di climatizzazione con tecnologia inverter e controllo smart.',
      hoverColor: 'hover:border-azzurro',
    },
  ];

  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-cover bg-center bg-[url('/assets/hero/marchi.png')] border-b border-border min-h-[320px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent pointer-events-none" />
        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4">
            Marchi trattati
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] mb-4">
            I marchi che<br />installiamo
          </h1>
          <p className="text-[18px] text-muted max-w-[600px] leading-[1.55]">
            Lavoriamo con produttori selezionati per garantire qualità, affidabilità e assistenza nel tempo.
          </p>
        </div>
      </div>

      {/* BRANDS LIST */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className={`border border-border rounded-card bg-surface p-[38px_36px] flex gap-[30px] items-center transition-all duration-300 ${brand.hoverColor}`}
            >
              <div className="w-[150px] h-[84px] flex-none border border-border rounded-btn bg-[#101214] flex items-center justify-center font-archivo font-extrabold text-[24px] text-[#b8bfc6] select-none">
                {brand.title}
              </div>
              <div>
                <h2 className="font-saira font-bold text-[26px] text-white uppercase mb-1">
                  {brand.name}
                </h2>
                <p className="text-[14.5px] text-muted leading-[1.6]">
                  {brand.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[14px] text-faint mt-7.5 text-center mt-8">
          Trattiamo inoltre numerosi altri marchi del settore termoidraulico. Chiedici un preventivo per il prodotto che desideri.
        </p>
      </div>
    </div>
  );
}
