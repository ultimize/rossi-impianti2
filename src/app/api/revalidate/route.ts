import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Revalidation on-demand delle pagine pubbliche.
 *
 * Le pagine /blog e /blog/[slug] usano ISR: senza questa rotta un articolo
 * appena pubblicato o modificato dall'admin compariva sul sito solo dopo la
 * scadenza della cache (fino a 1 ora), dando l'impressione che il salvataggio
 * non funzionasse. L'area admin chiama questo endpoint dopo ogni salvataggio.
 *
 * Protetta: solo utenti autenticati presenti nella tabella `admins`.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  const { data: adminCheck } = await supabase
    .from('admins')
    .select('id')
    .or(`id.eq.${user.id},email.eq.${user.email}`)
    .maybeSingle();

  if (!adminCheck) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  let slug: string | undefined;
  let previousSlug: string | undefined;
  try {
    const body = await request.json();
    slug = typeof body?.slug === 'string' ? body.slug : undefined;
    previousSlug = typeof body?.previousSlug === 'string' ? body.previousSlug : undefined;
  } catch {
    // body opzionale
  }

  const revalidated: string[] = [];

  const touch = (path: string, type?: 'page' | 'layout') => {
    revalidatePath(path, type);
    revalidated.push(path);
  };

  touch('/');
  touch('/blog');
  touch('/sitemap.xml');

  if (slug) touch(`/blog/${slug}`);
  if (previousSlug && previousSlug !== slug) touch(`/blog/${previousSlug}`);
  if (!slug) touch('/blog/[slug]', 'page');

  return NextResponse.json({ revalidated: true, paths: revalidated });
}
