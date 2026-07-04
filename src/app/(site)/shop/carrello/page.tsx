'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CarrelloPage() {
  const { cartItems, updateQty, removeFromCart, subtotal } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState<'stripe' | 'paypal' | null>(null);

  // Formatting currency helper
  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const handleCheckout = async (provider: 'stripe' | 'paypal') => {
    if (cartItems.length === 0) return;

    setCheckoutLoading(provider);

    try {
      const itemsPayload = cartItems.map((item) => ({
        product_id: item.id,
        name: item.name,
        qty: item.qty,
        price_cents: item.price_cents,
      }));

      // Let's call the API endpoint configured on the backend
      const response = await fetch(`/api/checkout/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsPayload }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate checkout session');
      }

      const data = await response.json();

      if (data.url) {
        // Stripe checkout redirects to URL
        window.location.href = data.url;
      } else if (data.order_id) {
        // PayPal checkout could return order id or custom url
        alert(`Ordine PayPal creato con successo! ID Ordine: ${data.order_id}`);
      } else {
        alert('Checkout completato. Verrai ricontattato via email.');
      }
    } catch (err) {
      console.error(err);
      alert('Si è verificato un errore durante l\'inizializzazione del pagamento. Riprova.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="bg-bg text-text min-h-screen pt-12 pb-[90px]">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <h1 className="font-saira font-extrabold text-4xl md:text-[46px] text-text tracking-[-1px] mb-8">
          Il tuo carrello
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-surface-2 border border-border rounded-card p-16 text-center flex flex-col items-center gap-4">
            <ShoppingBag size={48} className="text-muted-2" />
            <p className="text-[17px] text-text-2 max-w-[360px]">
              Il carrello è vuoto.
            </p>
            <Link
              href="/shop"
              className="font-plex font-semibold text-[16px] text-white bg-rosso hover:bg-rosso-hover rounded-btn px-7 py-[15px] mt-2 shadow-btn transition-colors"
            >
              Vai al catalogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">

            {/* Left: Cart Items List */}
            <div className="flex flex-col gap-3.5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface border border-border rounded-card p-[18px] flex gap-5 items-center flex-wrap md:flex-nowrap shadow-card"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-[12px] bg-gradient-to-br from-bg-alt to-surface-2 border border-border flex items-center justify-center flex-shrink-0 text-faint">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-[12px]" />
                    ) : (
                      <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                      </svg>
                    )}
                  </div>

                  {/* Name & price */}
                  <div className="flex-grow min-w-[180px] text-left">
                    <h3 className="font-saira font-bold text-[20px] text-text tracking-[-0.3px] leading-tight mb-1">
                      {item.name}
                    </h3>
                    <div className="text-[13.5px] text-muted">
                      {formatPrice(item.price_cents)} cad.
                    </div>
                  </div>

                  {/* Stepper qty */}
                  <div className="flex items-center border border-border-2 rounded-btn overflow-hidden flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-[38px] h-[38px] bg-bg-alt text-text hover:text-rosso transition-colors text-[20px] leading-none"
                    >
                      −
                    </button>
                    <span className="w-[42px] text-center font-saira font-bold text-[18px] text-text select-none">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-[38px] h-[38px] bg-bg-alt text-text hover:text-rosso transition-colors text-[20px] leading-none"
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="w-[110px] text-right font-saira font-extrabold text-[20px] text-text flex-shrink-0">
                    {formatPrice(item.price_cents * item.qty)}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-faint hover:text-rosso p-1.5 transition-colors flex-shrink-0"
                    title="Rimuovi articolo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <div className="mt-1">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 font-plex font-semibold text-[14px] text-muted hover:text-rosso transition-colors"
                >
                  <ArrowLeft size={16} /> Continua lo shopping
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Panel */}
            <div className="bg-surface-2 border border-border rounded-card p-[30px] text-left">
              <h3 className="font-saira font-extrabold text-[22px] text-text mb-[22px]">
                Riepilogo
              </h3>

              <div className="flex flex-col text-[15px]">
                <div className="flex justify-between py-2.5 text-text-2">
                  <span>Subtotale</span>
                  <span className="text-text">
                    {subtotal.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                <div className="flex justify-between py-2.5 text-text-2 border-b border-border">
                  <span>Spedizione</span>
                  <span className="text-text">Calcolata al checkout</span>
                </div>
                <div className="flex justify-between pt-[18px] pb-6 font-saira font-extrabold text-[22px] text-text">
                  <span>Totale</span>
                  <span>
                    {total.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
              </div>

              {/* Secure Checkout Buttons */}
              <div className="flex flex-col gap-[11px]">
                {/* Stripe button */}
                <button
                  onClick={() => handleCheckout('stripe')}
                  disabled={!!checkoutLoading}
                  className="w-full font-plex font-semibold text-[16px] text-white bg-stripe hover:brightness-[1.08] disabled:opacity-60 rounded-btn py-[15px] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  {checkoutLoading === 'stripe' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={18} /> Paga con carta — Stripe
                    </>
                  )}
                </button>

                {/* PayPal button */}
                <button
                  onClick={() => handleCheckout('paypal')}
                  disabled={!!checkoutLoading}
                  className="w-full font-saira font-extrabold text-[18px] bg-paypal hover:brightness-[1.04] disabled:opacity-60 rounded-btn py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {checkoutLoading === 'paypal' ? (
                    <Loader2 size={18} className="animate-spin text-[#003087]" />
                  ) : (
                    <span>
                      <span className="text-[#003087]">Pay</span>
                      <span className="text-[#009cde]">Pal</span>
                    </span>
                  )}
                </button>
              </div>

              <p className="text-[12px] text-muted text-center mt-4 leading-[1.5]">
                Mockup grafico — i pagamenti Stripe e PayPal verranno collegati in fase di sviluppo.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
