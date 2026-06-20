import { createClient } from '@/lib/supabase/server';
import AdminProductsClient from './AdminProductsClient';
import type { Product, Category } from '@/lib/types';

export const revalidate = 0; // Disable cache for admin panel

export default async function AdminProductsPage() {
  const supabase = createClient();

  // Fetch all products with their categories
  const { data: rawProducts } = await supabase
    .from('products')
    .select('*, categories(*)')
    .order('created_at', { ascending: false });

  // Fetch all product categories
  const { data: rawCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('kind', 'product')
    .order('name', { ascending: true });

  const products = (rawProducts || []) as (Product & { categories: Category | null })[];
  const categories = (rawCategories || []) as Category[];

  return <AdminProductsClient initialProducts={products} categories={categories} />;
}
