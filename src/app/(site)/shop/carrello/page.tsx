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
    <div className="bg-bg text-text1 min-h-screen py-12">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <h1 className="font-saira font-extrabold text-4xl md:text-[50px] uppercase text-white tracking-[-1px] mb-8 pb-4 border-b border-border/50">
          Il tuo Carrello
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-surface border border-border rounded-card p-12 text-center flex flex-col items-center gap-4">
            <ShoppingBag size={48} className="text-muted2" />
            <h3 className="font-saira font-bold text-[24px] uppercase text-white">Il carrello è vuoto</h3>
            <p className="text-[14.5px] text-muted max-w-[360px]">
              Non hai ancora aggiunto prodotti al tuo carrello. Esplora il catalogo dello shop per trovare la soluzione adatta a te.
            </p>
            <Link
              href="/shop"
              className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn px-6 py-3 mt-2 transition-colors"
            >
              Torna allo Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            
            {/* Left: Cart Items List */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface border border-border rounded-card p-4.5 p-5 flex gap-5 items-center justify-between flex-wrap md:flex-nowrap"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-btn bg-[#101214] border border-border flex items-center justify-center p-1 flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Name & price */}
                  <div className="flex-grow min-w-[200px] text-left">
                    <h3 className="font-saira font-bold text-[20px] text-white uppercase leading-tight">
                      {item.name}
                    </h3>
                    <div className="text-[14.5px] text-muted font-semibold mt-1">
                      {formatPrice(item.price_cents)} cad.
                    </div>
                  </div>

                  {/* Stepper qty */}
                  <div className="flex items-center bg-[#101214] border border-[#2c3137] rounded-btn overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="px-3 py-1.5 text-text2 hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 text-[14.5px] font-semibold text-white min-w-[24px] text-center select-none">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-3 py-1.5 text-text2 hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Total & remove */}
                  <div className="flex items-center gap-5 justify-between min-w-[120px] md:justify-end">
                    <span className="text-[17px] font-bold text-white">
                      {formatPrice(item.price_cents * item.qty)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-faint hover:text-rosso p-1 transition-colors"
                      title="Rimuovi articolo"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 font-saira font-bold text-[14px] tracking-[0.5px] uppercase text-muted hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} /> Continua lo shopping
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Panel */}
            <div className="bg-surface border border-border rounded-card p-6.5 p-7 flex flex-col gap-6 text-left">
              <h3 className="font-saira font-bold text-[20px] text-white uppercase pb-2.5 border-b border-border/60">
                Riepilogo Ordine
              </h3>

              <div className="flex flex-col gap-3.5 text-[14.5px]">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotale</span>
                  <span className="text-white font-medium">
                    {subtotal.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Spedizione</span>
                  <span className="text-green-500 font-semibold">Gratis</span>
                </div>
                <div className="border-t border-border/40 my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="font-saira font-bold text-[18px] text-white uppercase">Totale</span>
                  <span className="text-[26px] font-bold text-white">
                    {total.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                <div className="text-[11px] text-muted2 text-right mt-1">IVA Inclusa</div>
              </div>

              {/* Secure Checkout Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                {/* Stripe button */}
                <button
                  onClick={() => handleCheckout('stripe')}
                  disabled={!!checkoutLoading}
                  className="font-saira font-bold text-[16px] tracking-[0.5px] uppercase text-white bg-[#635BFF] hover:bg-[#5249cf] disabled:bg-faint rounded-btn py-3.5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {checkoutLoading === 'stripe' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={18} /> Paga con Carta (Stripe)
                    </>
                  )}
                </button>

                {/* PayPal button */}
                <button
                  onClick={() => handleCheckout('paypal')}
                  disabled={!!checkoutLoading}
                  className="font-saira font-bold text-[16px] tracking-[0.5px] uppercase text-[#0d0f11] bg-[#FFC439] hover:bg-[#e2ad30] disabled:bg-faint rounded-btn py-3.5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {checkoutLoading === 'paypal' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <span>Paga con PayPal</span>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-muted2 text-center mt-2 leading-relaxed">
                Cliccando su uno dei bottoni di pagamento verrai reindirizzato sul portale sicuro di Stripe o PayPal per completare l'acquisto.
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
