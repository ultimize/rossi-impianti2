'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Truck, ShieldCheck, HeartHandshake, CheckCircle2, ArrowLeft, Check } from 'lucide-react';
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
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={size}
            fill={s <= rounded ? '#F5A623' : 'none'}
            className={s <= rounded ? 'text-stella' : 'text-[#d6dbe1]'}
          />
        ))}
      </div>
    );
  };

  const avatarPalette = ['#E11D17', '#1497D6', '#15181C', '#F5A623'];
  return (
    <div className="bg-bg text-text">
      {/* BACK LINK */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-9 pb-0">
        <Link href="/shop" className="inline-flex items-center gap-1.5 font-plex font-semibold text-[14px] text-text-2 hover:text-rosso transition-colors">
          <ArrowLeft size={16} /> Catalogo
        </Link>
      </div>

      {/* DETAIL SHEET */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-7 pb-[90px] grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 items-start">
        {/* Left Column: Image Box & Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative h-[420px] md:h-[500px] w-full rounded-[18px] overflow-hidden border border-border bg-gradient-to-br from-azzurro-tint to-[#d7e9f5] flex items-center justify-center">
            {images.length > 0 && product.image_urls && product.image_urls.length > 0 ? (
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 24 24" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" className="text-faint">
                <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
              </svg>
            )}
          </div>
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 border rounded-btn overflow-hidden p-1 flex-shrink-0 bg-surface shadow-sm ${
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
            <div className="font-plex font-bold text-[12.5px] tracking-[1.2px] uppercase text-azzurro mb-3">
              {product.categories.name}
            </div>
          )}
          <h1 className="font-saira font-extrabold text-4xl md:text-[42px] tracking-[-1px] text-text leading-[1.04] mb-3">
            {product.name}
          </h1>

          {/* Stars summary line */}
          <div className="flex items-center gap-2.5 mb-[18px]">
            {renderStars(avgRating, 18)}
            <span className="text-text font-bold text-[16px]">{avgRating}</span>
            <a href="#recensioni" className="text-[13.5px] text-muted hover:text-rosso transition-colors">
              {reviewCount} recensioni
            </a>
          </div>

          {/* Price Box */}
          <div className="mb-6 leading-none">
            <div className="font-saira font-extrabold text-[38px] text-text leading-none mb-1.5">
              {formatPrice(product.price_cents)}
            </div>
            <div className="text-[13px] text-muted">IVA inclusa · spedizione calcolata al checkout</div>
          </div>

          {/* Short description */}
          {product.short && (
            <p className="text-[16px] text-text-2 leading-[1.65] mb-7">
              {product.short}
            </p>
          )}

          {/* Cart Buttons Panel */}
          {product.in_stock && (
            <div className="flex flex-col gap-3.5 w-full mb-[22px]">
              <div className="flex gap-3.5">
                {/* Add Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow font-plex font-semibold text-[16px] text-white bg-rosso hover:bg-rosso-hover rounded-btn py-[17px] shadow-btn transition-colors text-center"
                >
                  Aggiungi al carrello
                </button>
                <Link
                  href="/shop/carrello"
                  className="font-plex font-semibold text-[16px] text-text bg-surface border-[1.5px] border-border-2 hover:border-text rounded-btn px-[26px] py-[17px] transition-colors text-center"
                >
                  Vai al carrello
                </Link>
              </div>

              {addedNotify && (
                <div className="bg-surface border border-green-500/30 text-green-600 text-[13.5px] p-3 rounded-btn text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Prodotto aggiunto!</span>
                  <Link href="/shop/carrello" className="underline font-semibold hover:text-rosso transition-colors ml-2">
                    Vai al carrello →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Quantity Stepper (kept for cart logic) */}
          {product.in_stock && (
            <div className="flex items-center gap-3 mb-[22px]">
              <span className="text-[13.5px] text-muted uppercase tracking-[0.4px] font-semibold">Quantità</span>
              <div className="flex items-center bg-surface border border-border-2 rounded-btn overflow-hidden">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="w-9 h-9 bg-bg-alt text-text hover:text-rosso transition-colors text-[20px] leading-none"
                >
                  −
                </button>
                <span className="w-10 text-center font-saira font-bold text-[18px] text-text select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  className="w-9 h-9 bg-bg-alt text-text hover:text-rosso transition-colors text-[20px] leading-none"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="w-full border border-border rounded-[14px] bg-surface-2 px-6 py-1.5 mb-[22px]">
              {product.specs.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between py-3.5 ${idx < product.specs.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <span className="text-[13.5px] text-muted uppercase tracking-[0.4px] font-semibold">
                    {s.k}
                  </span>
                  <span className="text-[14.5px] text-text font-medium">
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Secure checkout notice */}
          <div className="flex items-center gap-2.5 text-[13.5px] text-text-2">
            <ShieldCheck size={18} className="text-azzurro flex-shrink-0" />
            <span>Pagamenti sicuri con <strong className="text-text">Stripe</strong> e <strong className="text-text">PayPal</strong></span>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTED BENEFITS GRID */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { Icon: Truck, color: 'text-rosso', title: 'Spedizione tracciata', text: 'Consegna in 24/72h in tutta Italia. Gratuita per ordini sopra € 499.' },
            { Icon: ShieldCheck, color: 'text-azzurro', title: 'Garanzia ufficiale', text: '2 anni inclusi sul prodotto, estendibili fino a 5 anni con il servizio Rossi.' },
            { Icon: HeartHandshake, color: 'text-rosso', title: 'Installazione & assistenza', text: 'Montaggio e manutenzione dai tecnici Rossi a Vicenza e provincia.' },
            { Icon: CheckCircle2, color: 'text-azzurro', title: 'Reso facile', text: 'Hai 14 giorni per il reso. Rimborso garantito sul prodotto integro.' },
          ].map(({ Icon, color, title, text }) => (
            <div key={title} className="border border-border rounded-card bg-surface p-6 shadow-card">
              <Icon size={26} className={`${color} mb-3.5`} />
              <div className="font-saira font-bold text-[17px] text-text mb-1.5">{title}</div>
              <p className="text-[13.5px] text-text-2 leading-[1.5]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="recensioni" className="max-w-[1240px] mx-auto px-6 md:px-12 pt-[66px] pb-[90px] scroll-mt-[90px]">
        <div className="flex items-end justify-between flex-wrap gap-3.5 mb-7">
          <h2 className="font-saira font-extrabold text-[34px] tracking-[-0.7px] text-text">
            Recensioni dei clienti
          </h2>
          <a
            href="#scrivi-recensione"
            className="font-plex font-semibold text-[14px] text-text bg-surface border-[1.5px] border-border-2 hover:border-rosso hover:text-rosso rounded-btn px-5 py-2.5 transition-colors"
          >
            Scrivi una recensione
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">

          {/* Left Column: Summary Stats */}
          <div className="bg-surface-2 border border-border rounded-card px-7 py-[30px]">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-saira font-extrabold text-[58px] leading-[.9] text-text">{avgRating}</span>
              <span className="text-[16px] text-muted">/ 5</span>
            </div>
            <div className="mb-2">{renderStars(avgRating, 22)}</div>
            <div className="text-[13.5px] text-muted mb-[22px]">Basato su {reviewCount} recensioni verificate</div>
            {/* Distribution bars */}
            <div className="flex flex-col gap-2.5">
              {starDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2.5">
                  <span className="text-[12.5px] text-text-2 font-semibold w-[30px]">{dist.stars} ★</span>
                  <div className="flex-grow h-[7px] bg-[#e7eaee] rounded-[4px] overflow-hidden">
                    <div
                      className={`h-full rounded-[4px] ${dist.stars === 5 ? 'bg-stella' : 'bg-[#cdd4db]'}`}
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-muted w-[34px] text-right">{Math.round(dist.percentage)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: List and Submit Form */}
          <div className="flex flex-col gap-4">

            {/* Review List */}
            <div className="flex flex-col gap-4">
              {reviews.map((rev, idx) => (
                <div key={rev.id} className="border border-border rounded-card bg-surface px-6 py-[22px] shadow-card">
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div
                      className="w-[42px] h-[42px] rounded-full flex items-center justify-center flex-shrink-0 font-saira font-extrabold text-[16px] text-white select-none uppercase"
                      style={{ background: avatarPalette[idx % avatarPalette.length] }}
                    >
                      {rev.name.slice(0, 2)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-saira font-bold text-[16px] text-text">{rev.name}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.3px] uppercase text-azzurro">
                            <Check size={13} strokeWidth={2.6} /> Acquisto verificato
                          </span>
                        )}
                      </div>
                      <div className="text-[12.5px] text-muted">
                        {rev.city ? `${rev.city} · ` : ''}{new Date(rev.created_at).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex-shrink-0">{renderStars(rev.rating, 14)}</div>
                  </div>
                  {rev.title && (
                    <h4 className="font-saira font-bold text-[16px] text-text mb-1.5">
                      {rev.title}
                    </h4>
                  )}
                  <p className="text-[14.5px] text-text-2 leading-[1.6]">
                    {rev.text}
                  </p>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-muted py-6">
                  Non ci sono ancora recensioni per questo prodotto. Sii il primo a scriverne una!
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div id="scrivi-recensione" className="bg-surface border border-border rounded-card p-7 text-left shadow-card scroll-mt-[90px]">
              <h3 className="font-saira font-extrabold text-[22px] tracking-[-0.3px] text-text mb-5">
                Scrivi una recensione
              </h3>
              {reviewSubmitted ? (
                <div className="bg-bg-alt border border-green-500/30 text-green-700 p-6 rounded-card text-center flex flex-col items-center gap-2">
                  <Check size={32} className="text-green-500 animate-bounce" />
                  <h4 className="font-saira font-bold text-[18px] text-green-700">Recensione inviata!</h4>
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
                        className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5">Città</label>
                      <input
                        type="text"
                        value={reviewForm.city}
                        onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                        className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5">Valutazione *</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso cursor-pointer w-32"
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
                      className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso"
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
                      className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="font-plex font-semibold text-[15px] text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn py-3 w-40 mt-2 transition-colors"
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
