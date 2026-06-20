import { createClient } from '@/lib/supabase/server';
import AdminReviewsClient from './AdminReviewsClient';
import type { Review } from '@/lib/types';

export const revalidate = 0; // Disable cache for admin panel

export default async function AdminReviewsPage() {
  const supabase = createClient();

  // Fetch all reviews with their associated product details
  const { data: rawReviews } = await supabase
    .from('reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  const reviews = (rawReviews || []) as (Review & { products: { name: string } | null })[];

  return <AdminReviewsClient initialReviews={reviews} />;
}
