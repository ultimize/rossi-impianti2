'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-cover bg-center bg-[url('/assets/site/header-news.jpg')] border-b border-border min-h-[320px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent pointer-events-none" />
        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4">
            Blog & News
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] mb-4">
            Guide, normative<br />e aggiornamenti
          </h1>
          <p className="text-[18px] text-muted max-w-[600px] leading-[1.55]">
            Le ultime notizie su incentivi, tecnologie radianti, climatizzazione e risparmio energetico a Vicenza.
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-12 pb-4 border-b border-border/50">
          <button
            onClick={() => setSelectedCategorySlug(null)}
            className={`font-saira font-bold text-[14px] tracking-[1px] uppercase rounded-btn px-5 py-2.5 transition-colors border ${
              selectedCategorySlug === null
                ? 'bg-rosso border-rosso text-white'
                : 'bg-surface border-border text-text2 hover:text-white hover:border-text2'
            }`}
          >
            Tutti gli articoli
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`font-saira font-bold text-[14px] tracking-[1px] uppercase rounded-btn px-5 py-2.5 transition-colors border ${
                selectedCategorySlug === cat.slug
                  ? 'bg-rosso border-rosso text-white'
                  : 'bg-surface border-border text-text2 hover:text-white hover:border-text2'
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
          <div className="flex flex-col gap-16">
            {/* FEATURED ARTICLE (Large 2-column card) */}
            {featuredArticle && (
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] border border-border hover:border-rosso rounded-card overflow-hidden bg-surface transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="min-h-[300px] md:min-h-[400px] relative overflow-hidden bg-[#1d2024]">
                  {featuredArticle.cover_url ? (
                    <img
                      src={featuredArticle.cover_url}
                      alt={featuredArticle.cover_alt || featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-border to-[#2c3137] transition-transform duration-500 group-hover:scale-[1.04]" />
                  )}
                  {featuredArticle.categories && (
                    <span
                      style={{
                        backgroundColor: featuredArticle.categories.color_bg || '#E11D17',
                        color: featuredArticle.categories.color_text || '#ffffff',
                      }}
                      className="absolute top-4 left-4 font-saira font-bold text-[12.5px] tracking-[1px] uppercase rounded-btn px-3 py-1.5 z-10 shadow-md"
                    >
                      {featuredArticle.categories.name}
                    </span>
                  )}
                </div>
                <div className="p-8 md:p-[48px_44px] flex flex-col justify-between">
                  <div>
                    <div className="text-[13px] text-muted uppercase tracking-[1px] mb-3">
                      {formatDate(featuredArticle.published_at)} {featuredArticle.read_time ? `· ${featuredArticle.read_time}` : ''}
                    </div>
                    <h2 className="font-saira font-extrabold text-3xl md:text-[44px] text-white uppercase mb-4 leading-none group-hover:text-rosso transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-[16px] text-text2 leading-relaxed mb-6">
                      {featuredArticle.excerpt}
                    </p>
                  </div>
                  <span className="font-saira font-bold text-[16px] tracking-[1px] uppercase text-rosso flex items-center gap-1 group-hover:gap-2 transition-all">
                    Leggi articolo →
                  </span>
                </div>
              </Link>
            )}

            {/* GRID OF OTHER ARTICLES */}
            {gridArticles.length > 0 && (
              <div>
                <h3 className="font-saira font-bold text-[20px] tracking-[2px] text-muted2 uppercase mb-6">
                  Altri articoli
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridArticles.map((art) => {
                    const badgeBg = art.categories?.color_bg || '#E11D17';
                    const badgeText = art.categories?.color_text || '#ffffff';
                    return (
                      <Link
                        key={art.id}
                        href={`/blog/${art.slug}`}
                        className="border border-border hover:border-rosso rounded-card overflow-hidden bg-surface transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group"
                      >
                        <div className="overflow-hidden h-[180px] relative bg-cover bg-center bg-[#1d2024]">
                          {art.cover_url ? (
                            <img
                              src={art.cover_url}
                              alt={art.cover_alt || art.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-border to-[#2c3137] transition-transform duration-500 group-hover:scale-[1.07]" />
                          )}
                          {art.categories && (
                            <span
                              style={{ backgroundColor: badgeBg, color: badgeText }}
                              className="absolute top-4 left-4 font-saira font-bold text-[12px] tracking-[1px] uppercase rounded-btn px-2.5 py-1 z-10"
                            >
                              {art.categories.name}
                            </span>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow justify-between">
                          <div>
                            <div className="text-[12.5px] text-muted2 uppercase tracking-[1px] mb-2.5">
                              {formatDate(art.published_at)} {art.read_time ? `· ${art.read_time}` : ''}
                            </div>
                            <h4 className="font-saira font-bold text-[23px] text-white uppercase mb-3 line-clamp-2 leading-tight">
                              {art.title}
                            </h4>
                            <p className="text-[14.5px] text-muted line-clamp-3 mb-4 leading-relaxed">
                              {art.excerpt}
                            </p>
                          </div>
                          <span className="font-saira font-bold text-[14px] tracking-[1px] uppercase text-rosso flex items-center gap-1 group-hover:gap-2 transition-all">
                            Leggi →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
