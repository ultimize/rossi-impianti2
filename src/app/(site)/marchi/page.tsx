import fs from 'fs';
import path from 'path';

export default function MarchiPage() {
  const brands = [
    { slug: 'daikin', name: 'Daikin', logo: '/assets/marchi/daikin.svg' },
    { slug: 'samsung', name: 'Samsung', logo: '/assets/marchi/samsung.svg' },
    { slug: 'aermec', name: 'Aermec', logo: '/assets/marchi/aermec.svg' },
    { slug: 'beretta', name: 'Beretta', logo: '/assets/marchi/beretta.png' },
    { slug: 'sime', name: 'Sime', logo: '/assets/marchi/sime.svg' },
    { slug: 'immergas', name: 'Immergas', logo: '/assets/marchi/immergas.jpg' },
    { slug: 'paradigma', name: 'Paradigma', logo: '/assets/marchi/paradigma.jpg' },
    { slug: 'rehau', name: 'Rehau', logo: '/assets/marchi/rehau.svg' },
    { slug: 'eurotherm', name: 'Eurotherm', logo: '/assets/marchi/eurotherm.svg' },
  ];

  return (
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-cover bg-center bg-[url('/assets/site/header-marchi.jpg')] border-b border-border min-h-[320px] flex items-center">
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
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

      {/* BRANDS GRID (BRAND WALL) */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[18px]">
          {brands.map((brand) => {
            const logoPath = path.join(process.cwd(), 'public', brand.logo);
            const hasLogo = fs.existsSync(logoPath);

            return (
              <div
                key={brand.slug}
                className="bg-surface border border-border rounded-card h-32 flex items-center justify-center p-6 transition-all duration-300 group"
              >
                {hasLogo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    width={200}
                    height={48}
                    className="max-h-12 w-auto object-contain filter grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  />
                ) : (
                  <span className="font-saira font-bold text-[22px] text-white uppercase tracking-wider select-none">
                    {brand.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[15px] text-muted text-center mt-12">
          ...e molti altri produttori selezionati.
        </p>
      </div>
    </div>
  );
}

