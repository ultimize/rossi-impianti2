import fs from 'fs';
import path from 'path';

export default function MarchiPage() {
  const brands = [
    {
      slug: 'sime',
      name: 'Sime',
      logo: '/assets/marchi/sime.svg',
      desc: 'Caldaie a condensazione e gruppi termici ad alta efficienza per il riscaldamento.',
    },
    {
      slug: 'daikin',
      name: 'Daikin',
      logo: '/assets/marchi/daikin.svg',
      desc: 'Climatizzatori e pompe di calore tra i più efficienti e silenziosi sul mercato.',
    },
    {
      slug: 'aermec',
      name: 'Aermec',
      logo: '/assets/marchi/aermec.svg',
      desc: 'Ventilconvettori e soluzioni per la climatizzazione di ambienti civili e commerciali.',
    },
    {
      slug: 'samsung',
      name: 'Samsung',
      logo: '/assets/marchi/samsung.svg',
      desc: 'Sistemi di climatizzazione con tecnologia inverter e controllo smart.',
    },
  ];

  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="bg-bg-alt border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[72px]">
          <div className="font-plex font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-[14px]">
            Marchi trattati
          </div>
          <h1 className="font-archivo font-extrabold text-5xl md:text-[56px] leading-[1.02] tracking-[-1.5px] text-text1 mb-4">
            I marchi che installiamo
          </h1>
          <p className="text-[18px] text-text2 max-w-[600px] leading-[1.6]">
            Lavoriamo con produttori selezionati per garantire qualità, affidabilità e assistenza nel tempo.
          </p>
        </div>
      </div>

      {/* BRANDS GRID */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-20 pb-[90px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          {brands.map((brand) => {
            const logoPath = path.join(process.cwd(), 'public', brand.logo);
            const hasLogo = fs.existsSync(logoPath);

            return (
              <div
                key={brand.slug}
                className="border border-border rounded-card bg-surface p-7 md:p-9 flex flex-col md:flex-row gap-5 md:gap-[30px] items-start md:items-center shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-[3px]"
              >
                <div className="w-[150px] h-[84px] flex-none border border-border rounded-[12px] bg-bg-alt flex items-center justify-center overflow-hidden">
                  {hasLogo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      width={200}
                      height={48}
                      className="max-h-12 max-w-[120px] w-auto object-contain"
                    />
                  ) : (
                    <span className="font-archivo font-extrabold text-[22px] text-faint uppercase select-none">
                      {brand.name}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-archivo font-bold text-[24px] text-text1 mb-[6px] tracking-[-0.3px]">
                    {brand.name}
                  </h2>
                  <p className="text-[14.5px] text-text2 leading-[1.6]">
                    {brand.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[14px] text-muted text-center mt-7">
          Trattiamo inoltre numerosi altri marchi del settore termoidraulico. Chiedici un preventivo per il prodotto che desideri.
        </p>
      </div>
    </div>
  );
}
