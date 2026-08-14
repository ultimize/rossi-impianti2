'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

/**
 * Modale di conferma interna all'app.
 *
 * Sostituisce `window.confirm()`: il dialog nativo del browser viene bloccato
 * silenziosamente da Chrome quando l'utente spunta "Impedisci a questa pagina di
 * creare altre finestre di dialogo" (e in alcune webview), facendo sembrare che
 * il pulsante Elimina non funzioni: il popup si chiude e non succede nulla.
 */

export type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = 'Conferma eliminazione',
  message,
  confirmLabel = 'Elimina',
  cancelLabel = 'Annulla',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Chiusura con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        className="w-full max-w-md bg-surface border border-border rounded-card shadow-xl p-6 flex flex-col gap-4 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-rosso flex-shrink-0">
            <AlertTriangle size={22} />
          </span>
          <div>
            <h3 className="font-saira font-extrabold text-[20px] text-text uppercase leading-tight">
              {title}
            </h3>
            <div className="text-[14px] text-muted mt-2 leading-relaxed">{message}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-border/40 mt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="font-saira font-bold text-[14px] tracking-[0.5px] uppercase text-muted hover:text-text bg-bg-alt border border-border hover:border-border-2 rounded-btn px-5 py-2.5 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            disabled={loading}
            className="font-saira font-bold text-[14px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn px-5 py-2.5 transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
