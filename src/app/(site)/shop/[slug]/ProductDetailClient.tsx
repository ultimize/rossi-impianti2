'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Truck, ShieldCheck, HeartHandshake, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import type { Product, Category, Review } from '@/lib/types';

type ProductDetailClientProps = {
  product: Product & { categories: Category | null };
  reviews: Review[];
};

export default function ProductDetailClient({ product, reviews }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const supabase = createClient();

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = product.image_urls && product.image_urls.length > 0
    ? product.image_urls
    : ['/assets/site/header-settori.jpg']; // Fallback placeholder

  // Quantity state
  const [qty, setQty] = useState(1);
  const [addedNotify, setAddedNotify] = useState(false);

  // Review Form state
  const [reviewForm, setReviewForm] = useState({
    name: '',
    city: '',
    rating: 5,
    title: '',
    text: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Format currency helper
  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price_cents: product.price_cents,
        image_url: images[0],
        slug: product.slug,
      },
      qty
    );
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.title || !reviewForm.text) {
      alert('Per favore compila tutti i campi obbligatori della recensione.');
      return;
    }

    setSubmittingReview(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          name: reviewForm.name,
          city: reviewForm.city || null,
          rating: reviewForm.rating,
          title: reviewForm.title,
          text: reviewForm.text,
          verified: false,
          approved: false, // Moderated by admin
        });

      if (error) throw error;
      setReviewSubmitted(true);
      setReviewForm({
        name: '',
        city: '',
        rating: 5,
        title: '',
        text: '',
      });
    } catch (err) {
      console.error(err);
      alert('Impossibile salvare la recensione. Riprova più tardi.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // --- REVIEW STATS ---
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
    : Number(product.rating || 0);

  const starDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return { stars, count, percentage };
  });

  const renderStars = (rating: number, size = 16) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={size}
            fill={s <= rounded ? '#F5A623' : 'none'}
            className={s <= rounded ? 'text-stella' : 'text-[#39404a]'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-bg text-text1">
      {/* BREADCRUMB */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-6 pb-2 text-[13px] text-muted flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} className="text-faint" />
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        <ChevronRight size={14} className="text-faint" />
        {product.categories && (
          <>
            <span className="text-muted2">{product.categories.name}</span>
            <ChevronRight size={14} className="text-faint" />
          </>
        )}
        <span className="text-white truncate">{product.name}</span>
      </div>

      {/* DETAIL SHEET */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 items-start">
        {/* Left Column: Image Box & Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative h-[320px] md:h-[480px] w-full rounded-card overflow-hidden border border-border bg-surface flex items-center justify-center p-6">
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 border rounded-btn overflow-hidden p-1 flex-shrink-0 bg-surface ${
                    activeImageIndex === idx ? 'border-rosso' : 'border-border'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info Panel */}
        <div className="flex flex-col items-start text-left">
          {product.categories && (
            <span className="font-saira font-bold text-[12px] tracking-[1.5px] uppercase bg-azzurro text-surface2 rounded-btn px-2.5 py-1 mb-4 shadow">
              {product.categories.name}
            </span>
          )}
          <h1 className="font-saira font-extrabold text-4xl md:text-5xl uppercase tracking-[-1px] text-white leading-none mb-3">
            {product.name}
          </h1>

          {/* Stars summary line */}
          <div className="flex items-center gap-2.5 text-[14px] text-muted mb-6">
            {renderStars(avgRating, 18)}
            <span className="text-white font-semibold">{avgRating} / 5</span>
            <span className="text-faint">·</span>
            <a href="#recensioni" className="underline hover:text-white transition-colors">
              {reviewCount} Recensioni
            </a>
            <span className="text-faint">·</span>
            <span className={`font-semibold ${product.in_stock ? 'text-green-500' : 'text-faint'}`}>
              {product.in_stock ? 'Disponibile' : 'Non Disponibile'}
            </span>
          </div>

          {/* Price Box */}
          <div className="mb-6 leading-none">
            <div className="text-[40px] font-extrabold text-white leading-none">
              {formatPrice(product.price_cents)}
            </div>
            <div className="text-[12.5px] text-muted2 mt-2.5">IVA e trasporto inclusi</div>
          </div>

          {/* Short description */}
          {product.short && (
            <p className="text-[15.5px] text-text2 leading-relaxed mb-7.5 border-b border-border/40 pb-6 mb-6">
              {product.short}
            </p>
          )}

          {/* Cart Buttons Panel */}
          {product.in_stock && (
            <div className="flex flex-col gap-3.5 w-full mb-8 pb-8 border-b border-border/40">
              <div className="flex gap-3">
                {/* Stepper */}
                <div className="flex items-center bg-surface border border-border rounded-btn overflow-hidden">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-3 text-text2 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-[16px] font-semibold text-white min-w-[32px] text-center select-none">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((prev) => prev + 1)}
                    className="px-4 py-3 text-text2 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
                {/* Add Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow font-saira font-bold text-[16px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn py-3 transition-colors text-center"
                >
                  Aggiungi al carrello
                </button>
              </div>

              {addedNotify && (
                <div className="bg-surface border border-green-500/30 text-green-400 text-[13.5px] p-3 rounded-btn text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Prodotto aggiunto!</span>
                  <Link href="/shop/carrello" className="underline font-semibold hover:text-white transition-colors ml-2">
                    Vai al carrello →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="w-full mb-6">
              <h3 className="font-saira font-bold text-[14px] tracking-[1.5px] text-white uppercase mb-3.5">
                Specifiche Tecniche
              </h3>
              <table className="w-full border-collapse border border-border text-[14px]">
                <tbody>
                  {product.specs.map((s, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-[#101214]' : 'bg-surface'}>
                      <td className="border border-border p-3 font-semibold text-muted text-left w-1/3">
                        {s.k}
                      </td>
                      <td className="border border-border p-3 text-text2 text-left">
                        {s.v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Secure checkout notice */}
          <div className="flex items-center gap-2.5 text-[12px] text-muted">
            <span className="font-semibold uppercase tracking-[0.5px] text-[10px] bg-[#20242a] px-2 py-0.5 rounded-btn">
              Pagamento Sicuro
            </span>
            <span>Accettiamo Carte di Credito (Stripe) e PayPal</span>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTED BENEFITS GRID */}
      <section className="bg-surface border-t border-b border-border py-12">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex gap-4 items-start">
            <Truck size={36} className="text-rosso flex-shrink-0" />
            <div>
              <h4 className="font-saira font-bold text-[16px] text-white uppercase mb-1">Spedizione tracciata</h4>
              <p className="text-[13px] text-muted leading-relaxed">Consegna rapida e sicura in tutta Italia con corriere espresso.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <ShieldCheck size={36} className="text-azzurro flex-shrink-0" />
            <div>
              <h4 className="font-saira font-bold text-[16px] text-white uppercase mb-1">Garanzia ufficiale</h4>
              <p className="text-[13px] text-muted leading-relaxed">24 mesi di garanzia ufficiale del produttore su tutti i componenti.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <HeartHandshake size={36} className="text-azzurro flex-shrink-0" />
            <div>
              <h4 className="font-saira font-bold text-[16px] text-white uppercase mb-1">Installazione & assistenza</h4>
              <p className="text-[13px] text-muted leading-relaxed">I nostri tecnici qualificati sono a disposizione per l'installazione.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <CheckCircle2 size={36} className="text-rosso flex-shrink-0" />
            <div>
              <h4 className="font-saira font-bold text-[16px] text-white uppercase mb-1">Reso facile</h4>
              <p className="text-[13px] text-muted leading-relaxed">Soddisfatti o rimborsati entro 14 giorni dall'acquisto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="recensioni" className="max-w-[1240px] mx-auto px-6 md:px-12 py-[80px]">
        <h2 className="font-saira font-extrabold text-[36px] text-white uppercase mb-10">
          Recensioni dei Clienti
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-14 items-start">
          
          {/* Left Column: Summary Stats */}
          <div className="flex flex-col gap-6 bg-surface border border-border rounded-card p-6.5 p-7">
            <div className="text-center">
              <div className="text-[64px] font-extrabold text-white leading-none">{avgRating}</div>
              <div className="flex justify-center my-2">{renderStars(avgRating, 22)}</div>
              <div className="text-[13.5px] text-muted">su {reviewCount} recensioni</div>
            </div>
            {/* Distribution bars */}
            <div className="flex flex-col gap-2">
              {starDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-3 text-[13px]">
                  <span className="w-3 text-right">{dist.stars}</span>
                  <Star size={12} fill="#F5A623" className="text-stella flex-shrink-0" />
                  <div className="flex-grow h-2 bg-[#101214] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stella rounded-full"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-muted2 text-right">{dist.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: List and Submit Form */}
          <div className="flex flex-col gap-12">
            
            {/* Review List */}
            <div className="flex flex-col gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="border-b border-border/40 pb-6 flex gap-4 items-start text-left">
                  <div className="w-11 h-11 rounded-full bg-[#20242a] text-white font-saira font-bold text-[18px] flex items-center justify-center flex-shrink-0 select-none uppercase">
                    {rev.name.slice(0, 2)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-semibold text-white">{rev.name}</span>
                      {rev.verified && (
                        <span className="text-[10px] font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30 rounded-btn px-1.5 py-0.5">
                          Acquisto Verificato
                        </span>
                      )}
                      <span className="text-[12px] text-muted2">
                        {rev.city ? `${rev.city} · ` : ''}{new Date(rev.created_at).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    <div className="mb-2">{renderStars(rev.rating, 14)}</div>
                    {rev.title && (
                      <h4 className="font-saira font-bold text-[17px] text-white uppercase mb-1">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-[14.5px] text-muted leading-relaxed">
                      {rev.text}
                    </p>
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-muted py-6">
                  Non ci sono ancora recensioni per questo prodotto. Sii il primo a scriverne una!
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="bg-surface border border-border rounded-card p-6.5 p-7 text-left">
              <h3 className="font-saira font-bold text-[22px] text-white uppercase mb-5">
                Scrivi una recensione
              </h3>
              {reviewSubmitted ? (
                <div className="bg-[#101214] border border-green-500/25 text-green-400 p-6 rounded-card text-center flex flex-col items-center gap-2">
                  <Check size={32} className="text-green-500 animate-bounce" />
                  <h4 className="font-saira font-bold text-[18px] uppercase text-white">Recensione inviata!</h4>
                  <p className="text-[14px] text-muted">
                    Grazie per il tuo feedback. Verrà pubblicata subito dopo l'approvazione degli amministratori.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5">Nome *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5">Città</label>
                      <input
                        type="text"
                        value={reviewForm.city}
                        onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                        className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5">Valutazione *</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso cursor-pointer w-32"
                    >
                      <option value={5}>5 Stelle</option>
                      <option value={4}>4 Stelle</option>
                      <option value={3}>3 Stelle</option>
                      <option value={2}>2 Stelle</option>
                      <option value={1}>1 Stella</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5">Titolo Recensione *</label>
                    <input
                      type="text"
                      required
                      placeholder="es. Ottimo prodotto!"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5">Testo *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Raccontaci la tua esperienza..."
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                      className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn py-3 w-40 mt-2 transition-colors"
                  >
                    {submittingReview ? 'Invio...' : 'Invia recensione'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
