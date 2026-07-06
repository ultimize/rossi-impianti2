'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ServiceGallery({
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[18px]">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => show(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-card border border-border bg-bg-alt shadow-card hover:shadow-card-hover transition-all focus:outline-none focus:ring-2 focus:ring-rosso/40"
            aria-label={`Apri immagine ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2"
            aria-label="Chiudi"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-6 text-white/80 hover:text-white p-2"
            aria-label="Precedente"
          >
            <ChevronLeft size={40} />
          </button>
          <div
            className="relative w-full max-w-[1100px] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt={`${alt} — foto ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
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
