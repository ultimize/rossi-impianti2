'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Article, Category } from '@/lib/types';

type BlogClientProps = {
  articles: (Article & { categories: Category | null })[];
  categories: Category[];
};

export default function BlogClient({ articles, categories }: BlogClientProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Filter articles based on active category
  const filteredArticles = selectedCategorySlug
    ? articles.filter((art) => art.categories?.slug === selectedCategorySlug)
    : articles;

  // The most recent article of the filtered list is the featured one
  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  // Helper to format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="bg-bg text-text">
      {/* HERO BANNER */}
      <div className="bg-bg-alt border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-14 md:py-[72px]">
          <div className="font-plex font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-3.5">
            News
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[56px] leading-[1.02] tracking-[-1.5px] text-text mb-4">
            Novità e approfondimenti
          </h1>
          <p className="text-[18px] text-text-2 max-w-[600px] leading-[1.6]">
            Servizi, guide e aggiornamenti dal mondo Rossi Impianti.
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-14 md:pt-20 pb-16 md:pb-[90px]">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          <button
            onClick={() => setSelectedCategorySlug(null)}
            className={`font-plex font-semibold text-[13px] rounded-pill px-4 py-2 transition-all border ${
              selectedCategorySlug === null
                ? 'bg-rosso border-rosso text-white'
                : 'bg-surface border-border text-text-2 hover:text-text hover:border-border-2'
            }`}
          >
            Tutti
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`font-plex font-semibold text-[13px] rounded-pill px-4 py-2 transition-all border ${
                selectedCategorySlug === cat.slug
                  ? 'bg-rosso border-rosso text-white'
                  : 'bg-surface border-border text-text-2 hover:text-text hover:border-border-2'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 text-muted">
            Nessun articolo trovato in questa categoria.
          </div>
        ) : (
          <>
            {/* FEATURED ARTICLE (Large 2-column card) */}
            {featuredArticle && (
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] border border-border rounded-[18px] overflow-hidden bg-surface transition-shadow duration-300 shadow-card hover:shadow-card-hover group mb-10"
              >
                <div className="min-h-[300px] md:min-h-[360px] relative overflow-hidden bg-bg-alt">
                  {featuredArticle.cover_url ? (
                    <Image
                      src={featuredArticle.cover_url}
                      alt={featuredArticle.cover_alt || featuredArticle.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-border to-surface-2" />
                  )}
                  {featuredArticle.categories && (
                    <span className="absolute top-[18px] left-[18px] font-plex font-bold text-[11px] tracking-[0.6px] uppercase rounded-pill px-[13px] py-1.5 z-10 bg-rosso text-white">
                      In evidenza · {featuredArticle.categories.name}
                    </span>
                  )}
                </div>
                <div className="p-8 md:p-[44px_48px] flex flex-col justify-center">
                  <div className="text-[12.5px] text-muted uppercase tracking-[0.8px] mb-3.5">
                    {formatDate(featuredArticle.published_at)} {featuredArticle.read_time ? `· ${featuredArticle.read_time} di lettura` : ''}
                  </div>
                  <h2 className="font-saira font-extrabold text-3xl md:text-[32px] text-text mb-3.5 leading-[1.1] tracking-[-0.5px]">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-[15.5px] text-text-2 leading-[1.65] mb-[22px]">
                    {featuredArticle.excerpt}
                  </p>
                  <span className="font-plex font-semibold text-[15px] text-rosso">
                    Leggi l&apos;articolo →
                  </span>
                </div>
              </Link>
            )}

            {/* GRID OF OTHER ARTICLES */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {gridArticles.map((art) => {
                  const badgeBg = art.categories?.color_bg || '#E11D17';
                  const badgeText = art.categories?.color_text || '#ffffff';
                  return (
                    <Link
                      key={art.id}
                      href={`/blog/${art.slug}`}
                      className="border border-border rounded-card overflow-hidden bg-surface transition-all duration-300 hover:-translate-y-[5px] shadow-card hover:shadow-card-hover flex flex-col h-full group"
                    >
                      <div className="overflow-hidden h-[180px] relative bg-bg-alt">
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
                            className="absolute top-3.5 left-3.5 font-plex font-bold text-[11px] tracking-[0.6px] uppercase rounded-pill px-3 py-[5px] z-10"
                          >
                            {art.categories.name}
                          </span>
                        )}
                      </div>
                      <div className="p-[24px_26px_28px] flex flex-col flex-grow">
                        <div className="text-[12.5px] text-muted uppercase tracking-[0.8px] mb-2.5">
                          {formatDate(art.published_at)} {art.read_time ? `· ${art.read_time}` : ''}
                        </div>
                        <h2 className="font-saira font-bold text-[21px] text-text mb-2.5 leading-[1.2] tracking-[-0.3px]">
                          {art.title}
                        </h2>
                        <p className="text-[13.5px] text-text-2 mb-4 leading-[1.6]">
                          {art.excerpt}
                        </p>
                        <span className="font-plex font-semibold text-[14px] text-rosso mt-auto">
                          Leggi →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
