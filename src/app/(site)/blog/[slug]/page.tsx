import { createStaticClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Clock, Check } from 'lucide-react';
import Image from 'next/image';
import ArticleClientWrapper from './ArticleClientWrapper';
import type { Article, Category } from '@/lib/types';

// Rigenerazione ogni 10 minuti: serve a far comparire da soli gli articoli
// programmati. Le modifiche dall'admin sono immediate grazie alla revalidation
// on-demand (src/app/api/revalidate/route.ts).
export const revalidate = 600;

type Props = {
  params: { slug: string };
};

// Generate metadata for SEO-first page headers
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createStaticClient();
  const { data: art } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (!art) {
    return {
      title: 'Articolo non trovato | Rossi Impianti',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rossimpiantisrl.it';
  const canonicalUrl = `${siteUrl}/blog/${art.slug}`;

  return {
    title: `${art.title} | Rossi Impianti`,
    description: art.excerpt,
    keywords: art.keywords || [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: art.title,
      description: art.excerpt || '',
      images: art.cover_url ? [{ url: art.cover_url, alt: art.cover_alt || art.title }] : [],
      publishedTime: art.published_at,
      modifiedTime: art.updated_at,
      authors: [art.author || 'Ufficio Tecnico Rossi Impianti'],
      section: art.categories?.name || 'News',
    },
    twitter: {
      card: 'summary_large_image',
      title: art.title,
      description: art.excerpt || '',
      images: art.cover_url ? [art.cover_url] : [],
    },
  };
}

// Pre-render static paths at build time
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('articles')
    .select('slug')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString());

  return (data || []).map((art) => ({
    slug: art.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const supabase = createStaticClient();

  // Fetch the article details
  const { data: rawArticle } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (!rawArticle) {
    notFound();
  }

  const article = rawArticle as Article & { categories: Category | null };

  // Fetch 3 related articles (same category, excluding current)
  const { data: rawRelated } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .eq('category_id', article.category_id)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3);

  const relatedArticles = (rawRelated || []) as (Article & { categories: Category | null })[];

  // Helper to extract headings for the Aside TOC
  const extractHeadings = (html: string | null, body: any[] | null) => {
    const headings: { id: string; text: string }[] = [];
    if (html) {
      const regex = /<h2\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        headings.push({
          id: match[1],
          text: match[2].replace(/<[^>]*>/g, '').trim(),
        });
      }
    } else if (body) {
      body.forEach((sec) => {
        if (sec.h) {
          headings.push({
            id: sec.h.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
            text: sec.h,
          });
        }
      });
    }
    return headings;
  };

  const tocHeadings = extractHeadings(article.body_html, article.body);

  // Formatting dates
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Structured Data (JSON-LD) setup
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rossimpiantisrl.it';
  const articleUrl = `${siteUrl}/blog/${article.slug}`;

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    'headline': article.title,
    'description': article.excerpt,
    'image': article.cover_url || '',
    'datePublished': article.published_at || article.updated_at,
    'dateModified': article.updated_at,
    'author': {
      '@type': 'Organization',
      'name': 'Rossi Impianti srl',
      'url': siteUrl,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Rossi Impianti srl',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/assets/logo-rossi-white.png`,
      },
    },
  };

  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'News',
        'item': `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': article.categories?.name || 'Articolo',
        'item': articleUrl,
      },
    ],
  };

  const jsonLdFaqs = article.faq && article.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': article.faq.map((q) => ({
      '@type': 'Question',
      'name': q.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': q.a,
      },
    })),
  } : null;

  return (
    <div className="bg-bg text-text min-h-screen">
      {/* INJECT JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      {jsonLdFaqs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqs) }}
        />
      )}

      {/* BREADCRUMB */}
      <div className="bg-bg-alt border-b border-border">
        <nav aria-label="Breadcrumb" className="max-w-[1080px] mx-auto px-6 md:px-12 py-[15px] text-[13px] text-muted flex items-center gap-[9px] flex-wrap">
          <Link href="/" className="text-text-2 hover:text-rosso transition-colors">Home</Link>
          <span className="text-faint">/</span>
          <Link href="/blog" className="text-text-2 hover:text-rosso transition-colors">News</Link>
          <span className="text-faint">/</span>
          {article.categories && (
            <>
              <span className="text-text-2">{article.categories.name}</span>
              <span className="text-faint">/</span>
            </>
          )}
          <span className="text-text truncate max-w-[200px] md:max-w-none">{article.title}</span>
        </nav>
      </div>

      {/* ARTICLE HEADER */}
      <header className="max-w-[820px] mx-auto px-6 md:px-12 pt-[54px]">
        {article.categories && (
          <span
            style={{
              backgroundColor: article.categories.color_bg || '#E11D17',
              color: article.categories.color_text || '#ffffff',
            }}
            className="inline-block font-plex font-bold text-[12px] tracking-[0.8px] uppercase rounded-pill px-[13px] py-1.5 mb-5"
          >
            {article.categories.name}
          </span>
        )}
        <h1 className="font-saira font-extrabold text-4xl md:text-[48px] leading-[1.05] tracking-[-1.2px] text-text mb-[22px]">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-[20px] text-text-2 leading-[1.55] mb-7">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3.5 text-[13px] text-muted border-t border-b border-border py-[18px] flex-wrap">
          <div className="w-11 h-11 rounded-full bg-rosso text-white font-saira font-extrabold text-[15px] flex items-center justify-center flex-none select-none">
            RI
          </div>
          <div className="flex-1 min-w-[160px]">
            <div className="font-plex font-bold text-[15px] text-text">
              {article.author || 'Ufficio Tecnico Rossi Impianti'}
            </div>
            <div className="text-[13px] text-muted">
              Pubblicato il {formatDate(article.published_at)}
              {article.updated_at ? ` · Aggiornato il ${formatDate(article.updated_at)}` : ''}
            </div>
          </div>
          {article.read_time && (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-text-2 border border-border-2 rounded-pill px-3.5 py-[7px]">
              <Clock size={15} className="text-muted" />
              {article.read_time} di lettura
            </span>
          )}
        </div>
      </header>

      {/* COVER HERO IMAGE */}
      {article.cover_url && (
        <div className="max-w-[1080px] mx-auto px-6 md:px-12 mt-[34px]">
          <div className="relative h-[280px] md:h-[460px] w-full rounded-[18px] overflow-hidden bg-bg-alt shadow-[0_30px_60px_-30px_rgba(20,30,45,.3)]">
            <Image
              src={article.cover_url}
              alt={article.cover_alt || article.title}
              fill
              sizes="(max-width: 1080px) 100vw, 1080px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* ARTICLE BODY */}
      <div className="max-w-[1080px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_248px] gap-12 lg:gap-[60px] items-start pt-12 pb-[70px]">
        
        {/* Left: Article content */}
        <article className="min-w-0">
          {/* Key takeaways "In sintesi" */}
          {article.takeaways && article.takeaways.length > 0 && (
            <div className="bg-surface2 border border-border border-l-[3px] border-l-rosso rounded-[14px] p-6 md:p-[24px_28px] mb-10">
              <div className="font-saira font-extrabold text-[14px] tracking-[0.6px] text-text uppercase mb-3.5">
                In sintesi
              </div>
              <div className="flex flex-col gap-[11px]">
                {article.takeaways.map((item, idx) => (
                  <div key={idx} className="flex gap-[11px] items-start text-[15px] text-text-2 leading-[1.5]">
                    <Check size={18} strokeWidth={2.2} className="text-rosso flex-none mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HTML body rendering (prose) or structured rendering */}
          {article.body_html ? (
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />
          ) : (
            <div>
              {article.body && article.body.map((section: any, idx: number) => {
                const { h, paras, bullets } = section;
                return (
                  <div key={idx}>
                    {h && (
                      <h2
                        id={h.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                        className="font-saira font-extrabold text-[28px] text-text mt-[42px] mb-4 tracking-[-0.5px] scroll-mt-24"
                      >
                        {h}
                      </h2>
                    )}
                    {paras && paras.map((p: string, pIdx: number) => (
                      <p key={pIdx} className="mb-[18px] text-[16.5px] text-[#4f585f] leading-[1.75]">{p}</p>
                    ))}
                    {bullets && (
                      <ul className="mb-[18px] flex flex-col gap-2.5 list-none p-0">
                        {bullets.map((b: string, bIdx: number) => (
                          <li key={bIdx} className="flex gap-3 items-start text-[16px] text-text-2 leading-[1.6]">
                            <span className="w-[7px] h-[7px] rounded-full bg-rosso flex-none mt-[9px]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* FAQ */}
          {article.faq && article.faq.length > 0 && (
            <>
              <h2 id="faq" className="font-saira font-extrabold text-[28px] text-text mt-[50px] mb-5 tracking-[-0.5px] scroll-mt-24">
                Domande frequenti
              </h2>
              <div className="flex flex-col gap-3">
                {article.faq.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-surface border border-border rounded-[14px] p-5 md:p-[20px_24px] shadow-card"
                  >
                    <div className="flex gap-[11px] items-start font-saira font-bold text-[18px] text-text mb-[9px]">
                      <span className="text-rosso">Q.</span>
                      <span>{q.q}</span>
                    </div>
                    <p className="text-[15px] text-text-2 leading-[1.65] pl-[26px]">
                      {q.a}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Keywords / Tags */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-9 flex flex-wrap gap-[9px]">
              {article.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[13px] text-text-2 bg-chip border border-border rounded-pill px-[13px] py-1.5"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}

          {/* Bio block */}
          <div className="mt-9 bg-surface2 border border-border rounded-card p-6 md:p-[26px_28px] flex gap-[18px] items-start flex-col sm:flex-row text-center sm:text-left">
            <div className="w-[56px] h-[56px] rounded-full bg-rosso text-white font-saira font-extrabold text-[19px] flex items-center justify-center flex-none select-none">
              RI
            </div>
            <div>
              <div className="font-saira font-bold text-[18px] text-text mb-[5px]">
                {article.author || 'Ufficio Tecnico Rossi Impianti'}
              </div>
              <p className="text-[14.5px] text-text-2 leading-[1.6]">
                Dal 1980 progettiamo e realizziamo impianti di riscaldamento, condizionamento e impianti industriali chiavi in mano a Vicenza e provincia.
              </p>
            </div>
          </div>
        </article>

        {/* Right: Sticky Aside Index & CTA */}
        <aside className="sticky top-[104px] z-10 flex-col gap-[18px] hidden lg:flex">
          {/* Scroll-margin TOC */}
          <ArticleClientWrapper headings={tocHeadings} hasFaq={!!(article.faq && article.faq.length > 0)} />

          {/* Sidebar CTA */}
          <Link
            href="/contatti"
            className="block text-center font-plex font-semibold text-[15px] text-white bg-rosso hover:bg-rosso-hover rounded-btn py-3.5 transition-colors shadow-btn"
          >
            Richiedi un preventivo
          </Link>
        </aside>
      </div>

      {/* RELATED ARTICLES */}
      {relatedArticles.length > 0 && (
        <section className="bg-bg-alt border-t border-border">
          <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-14 md:py-[60px]">
            <h2 className="font-saira font-extrabold text-[28px] text-text mb-[26px] tracking-[-0.5px]">
              Continua a leggere
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
              {relatedArticles.map((art) => {
                const badgeBg = art.categories?.color_bg || '#E11D17';
                const badgeText = art.categories?.color_text || '#ffffff';
                return (
                  <Link
                    key={art.id}
                    href={`/blog/${art.slug}`}
                    className="border border-border rounded-card overflow-hidden bg-surface transition-all duration-300 hover:-translate-y-[5px] shadow-card hover:shadow-card-hover flex flex-col h-full group"
                  >
                    <div className="overflow-hidden h-[150px] relative bg-bg-alt">
                      {art.cover_url ? (
                        <Image
                          src={art.cover_url}
                          alt={art.cover_alt || art.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-border to-surface-2" />
                      )}
                      {art.categories && (
                        <span
                          style={{ backgroundColor: badgeBg, color: badgeText }}
                          className="absolute top-3 left-3 font-plex font-bold text-[11px] tracking-[0.6px] uppercase rounded-pill px-[11px] py-1 z-10"
                        >
                          {art.categories.name}
                        </span>
                      )}
                    </div>
                    <div className="p-[20px_22px_24px] flex flex-col flex-grow">
                      <div className="text-[12px] text-muted uppercase tracking-[0.8px] mb-2">
                        {formatDate(art.published_at)}
                      </div>
                      <h3 className="font-saira font-bold text-[19px] text-text leading-[1.2] tracking-[-0.3px]">
                        {art.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
