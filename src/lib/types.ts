export type Category = {
  id: string;
  slug: string;
  name: string;
  kind: 'article' | 'product';
  color_bg: string | null;
  color_text: string | null;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_html: string | null;     // WordPress article content as HTML
  body: any[] | null;           // Structured content for admin-created posts
  cover_url: string | null;
  cover_alt: string | null;
  category_id: string | null;
  author: string;
  read_time: string | null;
  keywords: string[];
  takeaways: string[];
  faq: { q: string; a: string }[];
  status: 'draft' | 'published';
  published_at: string | null;
  updated_at: string;
  wp_post_id: number | null;
  legacy_url: string | null;
  categories?: Category; // Joined category relation helper
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  price_cents: number;
  short: string | null;
  description: string | null;
  specs: { k: string; v: string }[];
  image_urls: string[];
  rating: number;
  in_stock: boolean;
  status: 'draft' | 'published';
  categories?: Category; // Joined category relation helper
};

export type Review = {
  id: string;
  product_id: string;
  name: string;
  city: string | null;
  rating: number;
  title: string | null;
  text: string | null;
  verified: boolean;
  approved: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  email: string;
  items: {
    product_id: string;
    name: string;
    qty: number;
    price_cents: number;
  }[];
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  provider: 'stripe' | 'paypal' | null;
  provider_ref: string | null;
  created_at: string;
};

export type Redirect = {
  id: string;
  from_path: string;
  to_path: string;
  status: number;
};
