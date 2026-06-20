import { createClient } from '@/lib/supabase/server';
import AdminCategoriesClient from './AdminCategoriesClient';
import type { Category } from '@/lib/types';

export const revalidate = 0; // Disable cache for admin panel

export default async function AdminCategoriesPage() {
  const supabase = createClient();

  // Fetch all categories
  const { data: rawCategories } = await supabase
    .from('categories')
    .select('*')
    .order('kind', { ascending: true })
    .order('name', { ascending: true });

  const categories = (rawCategories || []) as Category[];

  return <AdminCategoriesClient initialCategories={categories} />;
}
