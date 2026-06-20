import { createStaticClient } from '@/lib/supabase/server';
import BlogClient from './BlogClient';
import type { Article, Category } from '@/lib/types';

export const revalidate = 3600; // ISR revalidate every hour

export default async function BlogPage() {
  const supabase = createStaticClient();

  // Fetch published articles with category relation
  const { data: rawArticles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
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
