import { createStaticClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, Calendar, User, Clock, ArrowLeft, Check, HelpCircle } from 'lucide-react';
import ArticleClientWrapper from './ArticleClientWrapper';
import type { Article, Category } from '@/lib/types';

export const revalidate = 3600; // ISR revalidate every hour

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
    .eq('status', 'published');

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
    <div className="bg-bg text-text1 min-h-screen">
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
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-6 pb-2 text-[13px] text-muted flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} className="text-faint" />
        <Link href="/blog" className="hover:text-white transition-colors">News</Link>
        <ChevronRight size={14} className="text-faint" />
        {article.categories && (
          <>
            <span className="text-muted2">{article.categories.name}</span>
            <ChevronRight size={14} className="text-faint" />
          </>
        )}
        <span className="text-white truncate max-w-[200px] md:max-w-none">{article.title}</span>
      </div>

      {/* ARTICLE HEADER */}
      <header className="max-w-[820px] mx-auto px-6 text-center pt-8 pb-10">
        {article.categories && (
          <span
            style={{
              backgroundColor: article.categories.color_bg || '#2BB3EF',
              color: article.categories.color_text || '#ffffff',
            }}
            className="inline-block font-saira font-bold text-[12px] tracking-[1px] uppercase rounded-btn px-2.5 py-1 mb-4 shadow"
          >
            {article.categories.name}
          </span>
        )}
        <h1 className="font-saira font-extrabold text-4xl md:text-[52px] leading-tight text-white uppercase tracking-[-1px] mb-5">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-[20px] text-text2 leading-relaxed max-w-[720px] mx-auto mb-6.5 font-light">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-center gap-5 text-[13.5px] text-muted border-t border-b border-border/40 py-3.5 flex-wrap">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-rosso" />
            {article.author || 'Ufficio Tecnico Rossi Impianti'}
          </span>
          <span className="text-faint">·</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            Pubblicato il {formatDate(article.published_at)}
          </span>
          {article.read_time && (
            <>
              <span className="text-faint">·</span>
              <span className="flex items-center gap-1.5 bg-surface border border-border px-2 py-0.5 rounded-btn text-[12px]">
                <Clock size={12} className="text-azzurro" />
                {article.read_time}
              </span>
            </>
          )}
        </div>
      </header>

      {/* COVER HERO IMAGE */}
      {article.cover_url && (
        <div className="max-w-[1080px] mx-auto px-6 mb-12">
          <div className="relative h-[250px] md:h-[440px] w-full rounded-card overflow-hidden border border-border">
            <img
              src={article.cover_url}
              alt={article.cover_alt || article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ARTICLE BODY */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_248px] gap-14 items-start pb-20">
        
        {/* Left: Article content */}
        <article className="min-w-0">
          {/* Key takeaways "In sintesi" */}
          {article.takeaways && article.takeaways.length > 0 && (
            <div className="bg-surface border border-border border-l-4 border-l-rosso rounded-card p-6 md:p-7 mb-9">
              <h3 className="font-saira font-bold text-[18px] tracking-[1.5px] text-white uppercase mb-4 flex items-center gap-2">
                <Check size={18} className="text-rosso" /> In Sintesi
              </h3>
              <ul className="flex flex-col gap-3">
                {article.takeaways.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-[15px] text-text2 leading-relaxed">
                    <Check size={16} className="text-rosso flex-shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* HTML body rendering (prose) or structured rendering */}
          {article.body_html ? (
            <div
              className="prose-dark"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />
          ) : (
            <div className="prose-dark flex flex-col gap-6">
              {article.body && article.body.map((section: any, idx: number) => {
                const { h, paras, bullets } = section;
                return (
                  <div key={idx} className="mb-6">
                    {h && (
                      <h2
                        id={h.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                        className="font-saira font-extrabold text-3xl uppercase tracking-tight text-white mt-8 mb-4 scroll-mt-26"
                      >
                        {h}
                      </h2>
                    )}
                    {paras && paras.map((p: string, pIdx: number) => (
                      <p key={pIdx} className="mb-4 text-text2 leading-relaxed">{p}</p>
                    ))}
                    {bullets && (
                      <ul className="list-disc pl-5 mb-4 text-text2 leading-relaxed flex flex-col gap-1.5">
                        {bullets.map((b: string, bIdx: number) => (
                          <li key={bIdx} className="relative pl-1.5">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Collapsible FAQ widgets */}
          {article.faq && article.faq.length > 0 && (
            <div className="mt-14 pt-10 border-t border-border/40">
              <h2 className="font-saira font-extrabold text-[36px] text-white uppercase mb-8 flex items-center gap-2.5">
                <HelpCircle size={28} className="text-rosso" /> Domande Frequenti
              </h2>
              <div className="flex flex-col gap-4">
                {article.faq.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-surface border border-border rounded-card p-5.5 p-6 hover:border-border2 transition-colors"
                  >
                    <h4 className="font-saira font-bold text-[20px] text-white uppercase mb-2">
                      {q.q}
                    </h4>
                    <p className="text-[15px] text-muted leading-relaxed">
                      {q.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords / Tags */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border/30 flex flex-wrap gap-2 items-center">
              <span className="text-[13.5px] text-muted2 uppercase tracking-[1px] mr-1.5">Tag:</span>
              {article.keywords.map((kw) => (
                <span
                  key={kw}
                  className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text2 bg-surface border border-border rounded-btn px-3 py-1 hover:text-white transition-colors"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}

          {/* Bio block */}
          <div className="mt-14 bg-surface border border-border rounded-card p-6.5 p-7 flex gap-5 items-center flex-col sm:flex-row text-center sm:text-left">
            <div className="w-[64px] h-[64px] rounded-full bg-rosso text-white font-saira font-extrabold text-[28px] flex items-center justify-center flex-shrink-0 select-none">
              RI
            </div>
            <div>
              <h4 className="font-saira font-bold text-[19px] text-white uppercase mb-1">
                {article.author || 'Ufficio Tecnico Rossi Impianti'}
              </h4>
              <p className="text-[14px] text-muted leading-relaxed">
                Il dipartimento tecnico di Rossi Impianti srl si occupa della progettazione, certificazione e collaudo di impianti termoidraulici civili e industriali dal 1980.
              </p>
            </div>
          </div>

          {/* Back button */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-muted hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Torna a News
            </Link>
          </div>
        </article>

        {/* Right: Sticky Aside Index & CTA */}
        <aside className="sticky top-[104px] z-10 flex flex-col gap-6 hidden lg:flex">
          {/* Scroll-margin TOC */}
          <ArticleClientWrapper headings={tocHeadings} />

          {/* Sidebar CTA */}
          <div className="bg-surface border border-border rounded-card p-6.5 p-7 flex flex-col text-center">
            <h4 className="font-saira font-bold text-[24px] text-white uppercase leading-none mb-3">
              Hai un progetto da realizzare?
            </h4>
            <p className="text-[13.5px] text-muted leading-relaxed mb-5">
              Il nostro team è pronto ad aiutarti per progettare il tuo impianto.
            </p>
            <Link
              href="/contatti"
              className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn py-3 transition-colors text-center"
            >
              Richiedi Preventivo
            </Link>
          </div>
        </aside>
      </div>

      {/* RELATED ARTICLES */}
      {relatedArticles.length > 0 && (
        <section className="bg-surface2 border-t border-border py-16">
          <div className="max-w-[1240px] mx-auto px-6 md:px-12">
            <h3 className="font-saira font-bold text-[26px] text-white uppercase mb-8">
              Articoli Correlati
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((art) => {
                const badgeBg = art.categories?.color_bg || '#E11D17';
                const badgeText = art.categories?.color_text || '#ffffff';
                return (
                  <Link
                    key={art.id}
                    href={`/blog/${art.slug}`}
                    className="border border-border hover:border-rosso rounded-card overflow-hidden bg-surface transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group"
                  >
                    <div className="overflow-hidden h-[150px] relative bg-[#1d2024]">
                      {art.cover_url ? (
                        <img
                          src={art.cover_url}
                          alt={art.cover_alt || art.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-border to-[#2c3137] transition-transform duration-500 group-hover:scale-[1.07]" />
                      )}
                      {art.categories && (
                        <span
                          style={{ backgroundColor: badgeBg, color: badgeText }}
                          className="absolute top-3.5 left-3.5 font-saira font-bold text-[11px] tracking-[1px] uppercase rounded-btn px-2.5 py-0.5 z-10"
                        >
                          {art.categories.name}
                        </span>
                      )}
                    </div>
                    <div className="p-5.5 p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="text-[12px] text-muted2 uppercase tracking-[1px] mb-2">
                          {formatDate(art.published_at)}
                        </div>
                        <h4 className="font-saira font-bold text-[20px] text-white uppercase mb-2 line-clamp-2 leading-tight">
                          {art.title}
                        </h4>
                        <p className="text-[14px] text-muted line-clamp-2 mb-3.5 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                      <span className="font-saira font-bold text-[13px] tracking-[1px] uppercase text-rosso flex items-center gap-1 group-hover:gap-2 transition-all">
                        Leggi →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER CTA SECTION */}
      <section className="bg-rosso py-[64px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-7">
          <h2 className="font-saira font-extrabold text-4xl md:text-[46px] text-white uppercase leading-[0.96] tracking-[-0.5px] text-left">
            Costruiamo il tuo<br />progetto di riscaldamento.
          </h2>
          <Link
            href="/contatti"
            className="font-saira font-bold text-[18px] tracking-[0.5px] uppercase text-rosso bg-white rounded-btn px-[34px] py-[18px] hover:-translate-y-[2px] transition-all whitespace-nowrap"
          >
            Contattaci
          </Link>
        </div>
      </section>
    </div>
  );
}
