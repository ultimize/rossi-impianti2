import { createStaticClient } from '@/lib/supabase/server';
import BlogClient from './BlogClient';
import type { Article, Category } from '@/lib/types';

// Rigenerazione ogni 10 minuti: serve a far comparire da soli gli articoli
// programmati. Le modifiche fatte dall'admin sono comunque immediate grazie
// alla revalidation on-demand (src/app/api/revalidate/route.ts).
export const revalidate = 600;

export default async function BlogPage() {
  const supabase = createStaticClient();

  // Solo articoli pubblicati la cui data di pubblicazione è già passata:
  // quelli programmati nel futuro restano nascosti dal sito.
  const { data: rawArticles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  // Fetch article categories
  const { data: rawCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('kind', 'article');

  const articles = (rawArticles || []) as (Article & { categories: Category | null })[];
  const categories = (rawCategories || []) as Category[];

  return <BlogClient articles={articles} categories={categories} />;
}
