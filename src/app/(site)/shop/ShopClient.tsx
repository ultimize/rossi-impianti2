'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Product, Category } from '@/lib/types';

type ShopClientProps = {
  products: (Product & { categories: Category | null })[];
  categories: Category[];
};

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Filter products based on active category
  const filteredProducts = selectedCategorySlug
    ? products.filter((prod) => prod.categories?.slug === selectedCategorySlug)
    : products;

  // Helper to format currency
  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  return (
    <div className="bg-bg text-text">
      {/* HERO BANNER */}
      <div className="bg-bg-alt border-b border-border">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-16">
          <div className="font-plex font-semibold text-[13px] tracking-[1.4px] text-rosso uppercase mb-3.5">
            Shop online
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[58px] leading-[1.02] tracking-[-1.6px] text-text mb-4">
            Climatizzatori, caldaie e accessori
          </h1>
          <p className="text-[17px] text-text-2 max-w-[540px] leading-[1.6] mb-5.5">
            Prodotti selezionati, spedizione in tutta Italia. Pagamenti sicuri con Stripe e PayPal.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-[14px] text-text-2 bg-surface border border-border rounded-pill px-3.5 py-2">
              Pagamenti — Stripe · PayPal
            </span>
            <span className="inline-flex items-center gap-2 text-[14px] text-text-2 bg-surface border border-border rounded-pill px-3.5 py-2">
              Spedizione tracciata
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-12 pb-[90px]">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <button
            onClick={() => setSelectedCategorySlug(null)}
            className={`font-plex font-semibold text-[14.5px] rounded-pill px-5 py-2.5 transition-colors border ${
              selectedCategorySlug === null
                ? 'bg-rosso border-rosso text-white'
                : 'bg-surface border-border-2 text-text-2 hover:text-text hover:border-text hover:bg-bg-alt'
            }`}
          >
            Tutti
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`font-plex font-semibold text-[14.5px] rounded-pill px-5 py-2.5 transition-colors border ${
                selectedCategorySlug === cat.slug
                  ? 'bg-rosso border-rosso text-white'
                  : 'bg-surface border-border-2 text-text-2 hover:text-text hover:border-text hover:bg-bg-alt'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-muted">
            Nessun prodotto disponibile in questa categoria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {filteredProducts.map((prod) => {
              const imageSrc = (prod.image_urls && prod.image_urls.length > 0)
                ? prod.image_urls[0]
                : '';

              return (
                <Link
                  key={prod.id}
                  href={`/shop/${prod.slug}`}
                  className="border border-border rounded-card overflow-hidden bg-surface transition-all duration-300 hover:-translate-y-[5px] shadow-card hover:shadow-card-hover flex flex-col h-full group"
                >
                  {/* Image Box */}
                  <div className="relative h-[210px] overflow-hidden bg-gradient-to-br from-bg-alt to-surface-2 flex items-center justify-center">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" className="text-faint">
                        <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                      </svg>
                    )}
                    {prod.categories && (
                      <span className="absolute top-3.5 left-3.5 font-plex font-bold text-[11px] tracking-[0.6px] uppercase bg-surface text-text-2 border border-border rounded-pill px-3 py-1.5 z-10">
                        {prod.categories.name}
                      </span>
                    )}
                    {!prod.in_stock && (
                      <span className="absolute top-3.5 right-3.5 font-plex font-bold text-[11px] tracking-[0.6px] uppercase bg-surface text-muted border border-border rounded-pill px-3 py-1.5 z-10">
                        Esaurito
                      </span>
                    )}
                  </div>

                  {/* Details Box */}
                  <div className="flex flex-col flex-grow pt-6 px-[26px] pb-7">
                    <h3 className="font-saira font-bold text-[22px] leading-[1.15] tracking-[-0.3px] text-text mb-1.5 group-hover:text-rosso transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                    {prod.short && (
                      <p className="text-[13.5px] text-muted line-clamp-2 mb-4 leading-[1.5]">
                        {prod.short}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-saira font-extrabold text-[24px] text-text leading-none">
                        {formatPrice(prod.price_cents)}
                      </span>
                      <span className="font-plex font-semibold text-[14px] text-rosso">
                        Scopri →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
