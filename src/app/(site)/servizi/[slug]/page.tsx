import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SERVIZI, getServizio, servizioGallery, servizioHero } from '@/lib/servizi';
import ServiceGallery from '@/components/ServiceGallery';

export const revalidate = 3600;

export function generateStaticParams() {
  return SERVIZI.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const s = getServizio(params.slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      images: [servizioHero(s)],
    },
  };
}

export default function ServizioPage({ params }: { params: { slug: string } }) {
  const s = getServizio(params.slug);
  if (!s) notFound();

  const images = servizioGallery(s);
  const hero = servizioHero(s);
  const accent = s.accent === 'rosso' ? 'text-rosso' : 'text-azzurro';

  return (
    <div className="bg-bg text-text1 font-plex">
      {/* BANNER */}
      <div className="bg-bg-alt border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-14 md:py-[72px] grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <nav className="flex items-center gap-2 text-[13px] text-muted mb-5">
              <Link href="/" className="hover:text-rosso transition-colors">Home</Link>
              <span>/</span>
              <Link href="/servizi" className="hover:text-rosso transition-colors">Servizi</Link>
              <span>/</span>
              <span className="text-text2">{s.name}</span>
            </nav>
            <div className={`font-plex font-semibold text-[13px] tracking-[1.4px] uppercase mb-3.5 ${accent}`}>
              {s.eyebrow}
            </div>
            <h1 className="font-archivo font-extrabold text-[40px] md:text-[52px] leading-[1.03] tracking-[-1.4px] text-text1 mb-5">
              {s.name}
            </h1>
            {s.intro.map((p, i) => (
              <p key={i} className="text-[16.5px] text-text2 leading-[1.7] mb-4 max-w-[560px]">
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 mt-5">
              {s.tags.map((tag) => (
                <span key={tag} className="text-[14px] text-text2 bg-chip rounded-pill px-[15px] py-[7px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden border border-border shadow-card">
            <Image
              src={hero}
              alt={`${s.name} — Rossi Impianti`}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* GALLERIA */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-16 md:py-[88px]">
        <div className={`font-plex font-semibold text-[13px] tracking-[1.4px] uppercase mb-3 ${accent}`}>
          Le nostre realizzazioni
        </div>
        <h2 className="font-archivo font-extrabold text-[32px] md:text-[40px] leading-[1.05] tracking-[-1px] text-text1 mb-8 md:mb-10">
          Alcuni dei nostri lavori
        </h2>
        <ServiceGallery images={images} alt={s.name} />
      </div>

      {/* CTA */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pb-[90px]">
        <div className="rounded-[22px] bg-gradient-to-br from-rosso to-rosso-hover shadow-cta px-8 md:px-[52px] py-[44px] md:py-[52px] flex items-center justify-between gap-[30px] flex-wrap">
          <h3 className="font-archivo font-extrabold text-[28px] md:text-[38px] text-white leading-[1.05] tracking-[-1px] max-w-[560px]">
            Un progetto di {s.name.toLowerCase()}? Parliamone.
          </h3>
          <Link
            href="/contatti"
            className="font-plex font-semibold text-[16px] text-rosso bg-white rounded-btn px-7 py-[15px] transition-all whitespace-nowrap hover:-translate-y-0.5"
          >
            Richiedi un preventivo
          </Link>
        </div>
      </div>
    </div>
  );
}
