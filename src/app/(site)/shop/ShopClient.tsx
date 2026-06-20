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
    <div className="bg-bg text-text1">
      {/* HERO BANNER */}
      <div className="relative bg-cover bg-center bg-[url('/assets/hero/chisiamo.png')] border-b border-border min-h-[320px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-transparent pointer-events-none" />
        <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="font-saira font-bold text-[14px] tracking-[3px] text-rosso uppercase mb-4">
            Shop Rossi Impianti
          </div>
          <h1 className="font-saira font-extrabold text-5xl md:text-[68px] leading-[0.95] uppercase tracking-[-1px] mb-4">
            Componenti e<br />sistemi termotecnici
          </h1>
          <p className="text-[18px] text-muted max-w-[600px] leading-[1.55]">
            Soluzioni professionali per riscaldamento, condizionamento e accessori, acquistabili online.
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
            Tutti i prodotti
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

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-muted">
            Nessun prodotto disponibile in questa categoria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const imageSrc = (prod.image_urls && prod.image_urls.length > 0)
                ? prod.image_urls[0]
                : '';

              return (
                <Link
                  key={prod.id}
                  href={`/shop/${prod.slug}`}
                  className="border border-border hover:border-rosso rounded-card overflow-hidden bg-surface transition-all duration-300 hover:-translate-y-1 flex flex-col h-full justify-between group"
                >
                  <div>
                    {/* Image Box */}
                    <div className="overflow-hidden h-[200px] relative bg-[#1d2024]">
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
                        <div className="absolute inset-0 bg-gradient-to-br from-border to-[#2c3137] transition-transform duration-500 group-hover:scale-[1.05]" />
                      )}
                      {prod.categories && (
                        <span className="absolute top-4 left-4 font-saira font-bold text-[11px] tracking-[1px] uppercase bg-azzurro text-surface2 rounded-btn px-2.5 py-1 z-10 shadow">
                          {prod.categories.name}
                        </span>
                      )}
                      {!prod.in_stock && (
                        <span className="absolute top-4 right-4 font-saira font-bold text-[11px] tracking-[1px] uppercase bg-surface2 text-muted2 rounded-btn px-2.5 py-1 z-10 border border-border">
                          Esaurito
                        </span>
                      )}
                    </div>

                    {/* Details Box */}
                    <div className="p-6">
                      <h3 className="font-saira font-bold text-[24px] text-white uppercase mb-2 group-hover:text-rosso transition-colors line-clamp-1">
                        {prod.name}
                      </h3>
                      {prod.short && (
                        <p className="text-[14px] text-muted line-clamp-3 mb-4 leading-relaxed">
                          {prod.short}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="px-6 pb-6 pt-2 border-t border-border/30 flex items-center justify-between">
                    <div>
                      <div className="text-[20px] font-bold text-white leading-none">
                        {formatPrice(prod.price_cents)}
                      </div>
                      <div className="text-[11px] text-muted2 mt-1">IVA Inclusa</div>
                    </div>
                    <span className="font-saira font-bold text-[14px] tracking-[1px] uppercase text-rosso flex items-center gap-1 group-hover:gap-2 transition-all">
                      Scopri →
                    </span>
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
