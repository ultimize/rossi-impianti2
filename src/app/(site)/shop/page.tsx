import { createStaticClient } from '@/lib/supabase/server';
import ShopClient from './ShopClient';
import type { Product, Category } from '@/lib/types';

export const revalidate = 3600; // ISR revalidate every hour

export default async function ShopPage() {
  const supabase = createStaticClient();

  // Fetch published products with categories
  const { data: rawProducts } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  // Fetch product categories
  const { data: rawCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('kind', 'product');

  const products = (rawProducts || []) as (Product & { categories: Category | null })[];
  const categories = (rawCategories || []) as Category[];

  return <ShopClient products={products} categories={categories} />;
}
