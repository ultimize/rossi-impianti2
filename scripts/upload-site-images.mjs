/**
 * Carica le foto del sito (gallerie servizi + immagini in evidenza + hero/sezioni Home)
 * su Supabase Storage (bucket "media", prefisso "webassets/"), così vengono servite
 * dalla CDN e alleggeriscono il caricamento delle pagine.
 *
 * Le pagine referenziano gli URL Supabase tramite src/lib/media.ts, mantenendo la
 * stessa struttura di /public/assets (es. public/assets/servizi/... -> webassets/servizi/...).
 *
 * Uso (in locale, dove hai rete verso Supabase):
 *   node scripts/upload-site-images.mjs
 *   node scripts/upload-site-images.mjs --dry-run
 *
 * Richiede in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

const BUCKET = 'media';
const PREFIX = 'webassets';
const PUBLIC_ASSETS = join(ROOT, 'public', 'assets');

// Cartelle/file (relativi a public/assets) da caricare
const TARGETS = [
  'servizi',              // intera cartella (gallerie + featured)
  'site/hero.jpg',
  'site/sede.jpg',
  'site/sede-interno.jpg',
  'site/industriale.jpg',
];

function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function walk(p) {
  const st = statSync(p);
  if (st.isDirectory()) return readdirSync(p).flatMap((f) => walk(join(p, f)));
  return [p];
}

function contentType(name) {
  const ext = name.split('.').pop().toLowerCase();
  return ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif' })[ext] || 'application/octet-stream';
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.find((b) => b.name === BUCKET)) return;
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) throw new Error(`Impossibile creare il bucket "${BUCKET}": ${error.message}`);
  console.log(`🪣 Bucket "${BUCKET}" creato (public).\n`);
}

async function main() {
  console.log(`\n🔧 Upload foto sito → Supabase Storage (${BUCKET}/${PREFIX}/)`);
  if (DRY_RUN) console.log('   [DRY RUN] nessun upload verrà effettuato\n');

  if (!DRY_RUN) await ensureBucket();

  // Raccogli tutti i file
  const files = [];
  for (const t of TARGETS) {
    const abs = join(PUBLIC_ASSETS, t);
    try {
      for (const f of walk(abs)) {
        if (/\.(jpe?g|png|webp|avif|gif)$/i.test(f)) files.push(f);
      }
    } catch {
      console.warn(`⚠️  Percorso non trovato, salto: ${t}`);
    }
  }
  console.log(`Trovati ${files.length} file da caricare.\n`);

  let ok = 0, fail = 0;
  for (const abs of files) {
    const rel = relative(PUBLIC_ASSETS, abs).split('\\').join('/'); // es. servizi/industriale/industriale-1.jpg
    const dest = `${PREFIX}/${rel}`;
    try {
      if (DRY_RUN) {
        console.log(`• (dry-run) ${rel}  →  ${BUCKET}/${dest}`);
        ok++; continue;
      }
      const buf = readFileSync(abs);
      const { error } = await supabase.storage.from(BUCKET).upload(dest, buf, {
        contentType: contentType(abs),
        upsert: true,
        cacheControl: '31536000',
      });
      if (error) throw new Error(error.message);
      console.log(`• ok  ${rel}`);
      ok++;
    } catch (e) {
      console.log(`• FALLITO ${rel} (${e.message})`);
      fail++;
    }
  }

  console.log(`\n✅ Completato. Caricate: ${ok}  ·  Fallite: ${fail}`);
  if (!DRY_RUN && ok > 0) {
    const base = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${PREFIX}`;
    console.log(`URL pubblico base: ${base}/...`);
    console.log('Ora fai il deploy: le pagine caricheranno le foto dalla CDN Supabase.');
  }
}

main().catch((e) => { console.error('Errore fatale:', e); process.exit(1); });
