import { createStaticClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import type { Product, Category, Review } from '@/lib/types';

export const revalidate = 3600; // ISR revalidate every hour

type Props = {
  params: { slug: string };
};

// Generates dynamic page metadata for SEO
export async function generateMetadata({ params }: Props) {
  const supabase = createStaticClient();
  const { data: prod } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!prod) {
    return {
      title: 'Prodotto non trovato | Shop Rossi Impianti',
    };
  }

  return {
    title: `${prod.name} | Shop Rossi Impianti`,
    description: prod.short || prod.description || '',
  };
}

// Pre-render static paths at build time
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select('slug')
    .eq('status', 'published');

  return (data || []).map((prod) => ({
    slug: prod.slug,
  }));
}

export default async function ProductPage({ params }: Props) {
  const supabase = createStaticClient();

  // Fetch product details
  const { data: rawProduct } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!rawProduct) {
    notFound();
  }

  const product = rawProduct as Product & { categories: Category | null };

  // Fetch approved reviews for the product
  const { data: rawReviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', product.id)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  const reviews = (rawReviews || []) as Review[];

  return (
    <ProductDetailClient
      product={product}
      reviews={reviews}
    />
  );
}
