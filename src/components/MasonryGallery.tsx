'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Galleria "masonry" a colonne: le foto mantengono le proporzioni naturali
 * (nessun crop) e si aprono in un lightbox a schermo intero.
 * Usa <img> nativo (lazy) per evitare l'ottimizzatore immagini e mostrare
 * le foto già ottimizzate così come sono.
 */
export default function MasonryGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const show = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, prev, next]);

  return (
    <>
      <div className="columns-2 md:columns-3 gap-[18px] [column-fill:_balance]">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => show(i)}
            className="group mb-[18px] block w-full overflow-hidden rounded-card border border-border bg-bg-alt shadow-card hover:shadow-card-hover transition-all focus:outline-none focus:ring-2 focus:ring-rosso/40 break-inside-avoid"
            aria-label={`Apri immagine ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              loading="lazy"
              className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button onClick={close} className="absolute top-5 right-5 text-white/80 hover:text-white p-2" aria-label="Chiudi">
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-6 text-white/80 hover:text-white p-2"
            aria-label="Precedente"
          >
            <ChevronLeft size={40} />
          </button>
          <div className="relative max-w-[1100px] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={`${alt} — foto ${index + 1}`}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-[4px]"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-6 text-white/80 hover:text-white p-2"
            aria-label="Successiva"
          >
            <ChevronRight size={40} />
          </button>
          <div className="absolute bottom-5 left-0 right-0 text-center text-white/70 text-[13px] font-plex">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
