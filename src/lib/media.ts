// Helper per gli asset immagine ospitati su Supabase Storage (bucket "media"),
// serviti dalla CDN per alleggerire il caricamento delle pagine.
// I file sono caricati con lo script scripts/upload-site-images.mjs sotto il
// prefisso "webassets/", mantenendo la stessa struttura di /public/assets.

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kbhfrqksazdrmboeuftd.supabase.co';

export const MEDIA_BASE = `${SUPABASE_URL}/storage/v1/object/public/media/webassets`;

/** Costruisce l'URL pubblico Supabase per un asset (path relativo a /public/assets). */
export const media = (path: string) => `${MEDIA_BASE}/${path.replace(/^\/+/, '')}`;
