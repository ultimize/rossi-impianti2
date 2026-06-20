import { createClient } from '@/lib/supabase/server';
import AdminArticlesClient from './AdminArticlesClient';
import type { Article, Category } from '@/lib/types';

export const revalidate = 0; // Disable cache for admin panel

export default async function AdminArticlesPage() {
  const supabase = createClient();

  // Fetch all articles with categories
  const { data: rawArticles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false });

  // Fetch all article categories
  const { data: rawCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('kind', 'article')
    .order('name', { ascending: true });

  const articles = (rawArticles || []) as (Article & { categories: Category | null })[];
  const categories = (rawCategories || []) as Category[];

  return <AdminArticlesClient initialArticles={articles} categories={categories} />;
}
