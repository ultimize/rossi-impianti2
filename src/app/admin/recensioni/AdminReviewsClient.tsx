'use client';

import React, { useState } from 'react';
import { Check, Trash2, Loader2, Star, Clock, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Review } from '@/lib/types';

type AdminReviewsClientProps = {
  initialReviews: (Review & { products: { name: string } | null })[];
};

export default function AdminReviewsClient({ initialReviews }: AdminReviewsClientProps) {
  const supabase = createClient();
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.approved;
    if (filter === 'approved') return r.approved;
    return true;
  });

  const updateProductRating = async (productId: string) => {
    // 1. Fetch all approved reviews for this product
    const { data: approvedReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('approved', true);

    // 2. Compute average
    const count = approvedReviews?.length || 0;
    const average = (approvedReviews && count > 0)
      ? approvedReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / count
      : 0;

    // 3. Update product rating column
    await supabase
      .from('products')
      .update({ rating: parseFloat(average.toFixed(1)) })
      .eq('id', productId);
  };

  const handleApprove = async (id: string, productId: string) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;

      // Recalculate average rating for product
      await updateProductRating(productId);

      // Update state
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: true } : r))
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante l\'approvazione della recensione.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa recensione? questa operazione è definitiva.')) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Recalculate average rating for product
      await updateProductRating(productId);

      // Update state
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante l\'eliminazione della recensione.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            fill={s <= rating ? '#F5A623' : 'none'}
            className={s <= rating ? 'text-stella' : 'text-border-2'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-saira font-extrabold text-3xl md:text-4xl text-text uppercase tracking-tight">
          Moderazione Recensioni
        </h1>
        <p className="text-[14.5px] text-muted mt-1 leading-relaxed">
          Approva o elimina le recensioni inviate dagli utenti per i prodotti dello shop online. Solo le recensioni approvate compaiono sul sito pubblico.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border/50 pb-4">
        {[
          { label: 'Da moderare', value: 'pending' },
          { label: 'Approvate', value: 'approved' },
          { label: 'Tutte', value: 'all' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`font-saira font-bold text-[13px] tracking-[1px] uppercase rounded-btn px-4 py-2.5 transition-colors border ${
              filter === tab.value
                ? 'bg-rosso border-rosso text-white'
                : 'bg-surface border-border text-text-2 hover:text-text hover:border-border-2 hover:bg-bg-alt'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-surface border border-border rounded-card p-5.5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm"
          >
            <div className="flex-grow text-left">
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="font-semibold text-text">{rev.name}</span>
                {rev.city && <span className="text-[12.5px] text-muted">{rev.city}</span>}
                <span className="text-faint">·</span>
                <span className="text-[12px] text-muted-2 flex items-center gap-1">
                  <Clock size={12} /> {new Date(rev.created_at).toLocaleDateString('it-IT')}
                </span>
                {rev.verified && (
                  <span className="text-[9px] font-bold uppercase bg-green-500/10 text-green-600 border border-green-500/20 px-1 rounded">
                    Acquisto verificato
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                {renderStars(rev.rating)}
                <span className="text-xs font-semibold text-azzurro font-saira uppercase">
                  Prodotto: {rev.products?.name || 'Sconosciuto'}
                </span>
              </div>

              {rev.title && (
                <h4 className="font-saira font-bold text-[18px] text-text uppercase mb-1">
                  {rev.title}
                </h4>
              )}
              <p className="text-[14px] text-muted leading-relaxed max-w-[800px]">
                {rev.text}
              </p>
            </div>

            {/* Actions Pane */}
            <div className="flex gap-2.5 flex-shrink-0 w-full md:w-auto justify-end">
              {!rev.approved && (
                <button
                  onClick={() => handleApprove(rev.id, rev.product_id)}
                  disabled={loading}
                  className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-white bg-green-600 hover:bg-green-700 disabled:bg-faint rounded-btn px-4 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check size={14} /> Approvazione
                </button>
              )}
              <button
                onClick={() => handleDelete(rev.id, rev.product_id)}
                disabled={loading}
                className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn px-4 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={14} /> Elimina
              </button>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="bg-surface border border-border border-dashed rounded-card p-12 text-center text-muted flex flex-col items-center gap-3">
            <AlertTriangle size={32} className="text-faint" />
            <span>Nessuna recensione trovata in questo gruppo.</span>
          </div>
        )}
      </div>
    </div>
  );
}
