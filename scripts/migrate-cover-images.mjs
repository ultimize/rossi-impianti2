/**
 * Migrazione cover articoli: dal vecchio WordPress → Supabase Storage.
 *
 * Cosa fa:
 *  1. Legge dagli articoli le cover_url che puntano ancora a rossimpiantisrl.it
 *  2. Scarica ogni immagine dal vecchio sito
 *  3. La carica nel bucket "media" di Supabase (cartella "article-covers/")
 *  4. Aggiorna articles.cover_url con la URL pubblica Supabase (CDN)
 *
 * È idempotente: le cover già su Supabase vengono saltate.
 *
 * Uso (in locale, dove hai rete verso WordPress e Supabase):
 *   node scripts/migrate-cover-images.mjs
 *   node scripts/migrate-cover-images.mjs --dry-run   # solo anteprima, non scrive nulla
 *
 * Richiede in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes('--dry-run');

const BUCKET = 'media';
const FOLDER = 'article-covers';
const OLD_HOST_MATCH = 'rossimpiantisrl.it';

// --- carica .env.local (senza dipendenze esterne) ---
function loadEnv() {
  try {
    const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    /* .env.local opzionale se le var sono già nell'ambiente */
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// slug/nome file "pulito" e stabile
function safeName(slug, originalUrl) {
  const ext = (originalUrl.split('?')[0].match(/\.(png|jpe?g|webp|gif|avif)$/i)?.[1] || 'jpg').toLowerCase();
  const base = (slug || 'cover').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  return `${base}.${ext}`;
}

function contentTypeFromExt(name) {
  const ext = name.split('.').pop().toLowerCase();
  return ({ png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' })[ext] || 'image/jpeg';
}

async function main() {
  console.log(`\n🔧 Migrazione cover → Supabase Storage (bucket "${BUCKET}/${FOLDER}")`);
  if (DRY_RUN) console.log('   [DRY RUN] nessuna scrittura verrà effettuata\n');

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, cover_url')
    .not('cover_url', 'is', null)
    .neq('cover_url', '');

  if (error) {
    console.error('❌ Errore lettura articoli:', error.message);
    process.exit(1);
  }

  const toMigrate = articles.filter(
    (a) => a.cover_url.includes(OLD_HOST_MATCH) && !a.cover_url.includes('supabase.co')
  );

  console.log(`Trovati ${articles.length} articoli con cover, di cui ${toMigrate.length} da migrare.\n`);

  let ok = 0, fail = 0;
  for (const art of toMigrate) {
    const fileName = safeName(art.slug, art.cover_url);
    const storagePath = `${FOLDER}/${fileName}`;
    try {
      process.stdout.write(`• ${art.slug}  … `);
      if (DRY_RUN) {
        console.log(`(dry-run) ${art.cover_url}  →  ${BUCKET}/${storagePath}`);
        ok++;
        continue;
      }

      // 1) scarica dal vecchio sito
      const res = await fetch(art.cover_url);
      if (!res.ok) throw new Error(`download HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());

      // 2) carica su Supabase Storage
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buf, {
          contentType: contentTypeFromExt(fileName),
          upsert: true,
          cacheControl: '31536000',
        });
      if (upErr) throw new Error(`upload: ${upErr.message}`);

      // 3) URL pubblica
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      const newUrl = pub.publicUrl;

      // 4) aggiorna DB
      const { error: updErr } = await supabase
        .from('articles')
        .update({ cover_url: newUrl })
        .eq('id', art.id);
      if (updErr) throw new Error(`update DB: ${updErr.message}`);

      console.log(`ok → ${newUrl}`);
      ok++;
    } catch (e) {
      console.log(`FALLITO (${e.message})`);
      fail++;
    }
  }

  console.log(`\n✅ Completato. Migrate: ${ok}  ·  Fallite: ${fail}`);
  if (!DRY_RUN && ok > 0) {
    console.log('Ricordati di ridistribuire il sito (le pagine SSG si rigenerano con le nuove URL).');
  }
}

main().catch((e) => {
  console.error('Errore fatale:', e);
  process.exit(1);
});
