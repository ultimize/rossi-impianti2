'use client';

import React, { useState } from 'react';
import { ShoppingBag, Loader2, Calendar, Mail, CheckCircle2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Order } from '@/lib/types';

type AdminOrdersClientProps = {
  initialOrders: Order[];
};

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const supabase = createClient();
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante l\'aggiornamento dello stato dell\'ordine.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  // Helper colors for status badges
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'shipped':
        return 'bg-azzurro/10 text-azzurro border border-azzurro/20';
      case 'cancelled':
        return 'bg-rosso/10 text-rosso border border-rosso/20';
      default:
        return 'bg-faint/20 text-muted border border-border';
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-saira font-extrabold text-3xl md:text-4xl text-white uppercase tracking-tight">
          Gestione Ordini
        </h1>
        <p className="text-[14.5px] text-muted mt-1 leading-relaxed">
          Monitora gli acquisti e-commerce effettuati dagli utenti. Cambia lo stato dell'ordine in base all'avanzamento della spedizione o del pagamento.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border/50 pb-4 flex-wrap">
        {[
          { label: 'Tutti', value: 'all' },
          { label: 'In attesa (Pending)', value: 'pending' },
          { label: 'Pagati (Paid)', value: 'paid' },
          { label: 'Spediti (Shipped)', value: 'shipped' },
          { label: 'Annullati (Cancelled)', value: 'cancelled' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`font-saira font-bold text-[13px] tracking-[1px] uppercase rounded-btn px-4 py-2.5 transition-colors border ${
              filter === tab.value
                ? 'bg-rosso border-rosso text-white'
                : 'bg-surface border-border text-text2 hover:text-white hover:border-text2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex flex-col gap-4.5">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          return (
            <div
              key={order.id}
              className="bg-surface border border-border rounded-card overflow-hidden flex flex-col"
            >
              {/* Main Card Header */}
              <div
                onClick={() => toggleExpand(order.id)}
                className="p-5.5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-surface/60 transition-colors select-none text-left"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-saira font-bold text-[18px] text-white uppercase">
                      Ordine #{order.id.slice(0, 8)}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-btn font-saira font-bold uppercase text-[11px] tracking-[0.5px] ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[12.5px] text-muted flex items-center gap-4.5 flex-wrap mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {order.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString('it-IT')}
                    </span>
                    {order.provider && (
                      <span className="font-mono text-[11px] text-[#7c848d]">
                        Via {order.provider.toUpperCase()} ({order.provider_ref?.slice(0, 10)}...)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-5.5 self-stretch md:self-auto justify-between border-t border-border/30 pt-3 md:pt-0 md:border-0">
                  <div className="text-right">
                    <div className="text-[20px] font-extrabold text-white leading-none">
                      {formatPrice(order.total_cents)}
                    </div>
                    <span className="text-[11px] text-faint block mt-1">Totale ordine</span>
                  </div>
                  <div className="text-muted2 hover:text-white p-1">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="border-t border-border/40 p-6 bg-[#101214]/40 flex flex-col gap-6 text-left">
                  {/* Items List */}
                  <div>
                    <h4 className="font-saira font-bold text-[13px] tracking-[1.5px] text-white uppercase mb-3">
                      Articoli Acquistati
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-surface/50 border border-border/60 rounded px-4 py-2.5 text-[13.5px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{item.name}</span>
                            <span className="text-muted font-normal text-xs">x{item.qty}</span>
                          </div>
                          <span className="font-semibold text-text2">{formatPrice(item.price_cents * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Info & Status Changer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/30 items-end">
                    {/* Status Changer dropdown */}
                    <div>
                      <label className="block text-[12px] text-muted uppercase tracking-[0.5px] mb-2 font-semibold">
                        Modifica Stato Ordine
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          disabled={loading}
                          className="bg-[#101214] border border-[#2c3137] rounded-btn p-2.5 text-white font-plex text-[13.5px] outline-none cursor-pointer flex-grow disabled:opacity-50"
                        >
                          <option value="pending">In attesa (Pending)</option>
                          <option value="paid">Pagato (Paid)</option>
                          <option value="shipped">Spedito (Shipped)</option>
                          <option value="cancelled">Annullato (Cancelled)</option>
                        </select>
                      </div>
                    </div>

                    {/* Cost Summary sheet */}
                    <div className="flex flex-col gap-2 text-right text-[13.5px] font-plex">
                      <div className="flex justify-between md:justify-end gap-10">
                        <span className="text-muted">Subtotale:</span>
                        <span className="text-white font-medium">{formatPrice(order.subtotal_cents)}</span>
                      </div>
                      <div className="flex justify-between md:justify-end gap-10">
                        <span className="text-muted">Spedizione:</span>
                        <span className="text-green-500 font-semibold">{order.shipping_cents > 0 ? formatPrice(order.shipping_cents) : 'Gratis'}</span>
                      </div>
                      <div className="flex justify-between md:justify-end gap-10 font-bold text-[15px] border-t border-border/30 pt-1.5 mt-1">
                        <span className="text-white uppercase font-saira tracking-[0.5px]">Totale:</span>
                        <span className="text-white">{formatPrice(order.total_cents)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="bg-surface border border-border border-dashed rounded-card p-12 text-center text-muted flex flex-col items-center gap-3">
            <ShoppingBag size={32} className="text-faint" />
            <span>Nessun ordine trovato in questa categoria.</span>
          </div>
        )}
      </div>
    </div>
  );
}
