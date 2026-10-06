import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rossimpiantisrl.it';
  const supabase = createStaticClient();

  // Static routes
  const staticPaths = [
    '',
    '/chi-siamo',
    '/servizi',
    '/settori',
    '/marchi',
    '/contatti',
    '/blog',
  ];

  const staticUrls = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  // Fetch articles (esclusi quelli programmati con data futura)
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString());

  const articleUrls = (articles || []).map((art) => ({
    url: `${siteUrl}/blog/${art.slug}`,
    lastModified: new Date(art.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));


  return [...staticUrls, ...articleUrls];
}
