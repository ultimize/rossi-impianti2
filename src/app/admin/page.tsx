import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, FolderTree, Package, Star, ShoppingCart, ArrowRight } from 'lucide-react';

export const revalidate = 0; // Disable caching for admin panel

export default async function AdminDashboardPage() {
  const supabase = createClient();

  // Fetch counts in parallel
  const [
    { count: totalArticles },
    { count: draftArticles },
    { count: totalProducts },
    { count: outOfStockProducts },
    { count: pendingReviews },
    { count: totalOrders },
    { count: pendingOrders },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('approved', false),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const cards = [
    {
      title: 'Articoli Blog',
      count: totalArticles || 0,
      sub: `${draftArticles || 0} in bozza`,
      icon: FileText,
      color: 'border-t-rosso',
      link: '/admin/articoli',
    },
    {
      title: 'Prodotti Shop',
      count: totalProducts || 0,
      sub: `${outOfStockProducts || 0} esauriti`,
      icon: Package,
      color: 'border-t-azzurro',
      link: '/admin/prodotti',
    },
    {
      title: 'Recensioni',
      count: pendingReviews || 0,
      sub: 'da moderare',
      icon: Star,
      color: 'border-t-stella',
      link: '/admin/recensioni',
      highlight: (pendingReviews || 0) > 0,
    },
    {
      title: 'Ordini Ricevuti',
      count: totalOrders || 0,
      sub: `${pendingOrders || 0} in attesa`,
      icon: ShoppingCart,
      color: 'border-t-[#635BFF]',
      link: '/admin/ordini',
    },
  ];

  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h1 className="font-saira font-extrabold text-3xl md:text-4xl text-white uppercase tracking-tight">
          Pannello di Controllo
        </h1>
        <p className="text-[14.5px] text-muted mt-1 leading-relaxed">
          Benvenuto nel backend di Rossi Impianti. Qui puoi gestire i contenuti del sito, lo shop e-commerce e moderare le recensioni.
        </p>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-surface border border-border border-t-3 ${card.color} rounded-card p-6.5 p-6 flex flex-col justify-between`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[14px] text-muted font-bold tracking-[0.5px] uppercase font-saira">
                  {card.title}
                </span>
                <Icon size={20} className={card.highlight ? 'text-stella animate-pulse' : 'text-muted2'} />
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white leading-none mb-1">
                  {card.count}
                </div>
                <div className={`text-[12.5px] ${card.highlight ? 'text-stella font-semibold' : 'text-muted2'}`}>
                  {card.sub}
                </div>
              </div>
              <div className="border-t border-border/40 mt-5 pt-3">
                <Link
                  href={card.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rosso hover:text-white transition-colors uppercase font-saira tracking-[0.5px]"
                >
                  <span>Gestisci</span> <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick shortcuts block */}
      <div className="bg-surface border border-border rounded-card p-6 md:p-8 mt-4">
        <h2 className="font-saira font-bold text-[22px] text-white uppercase mb-5">
          Azioni Rapide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          <Link
            href="/admin/articoli?action=new"
            className="flex items-center justify-between p-4 bg-[#101214] border border-border hover:border-rosso rounded-btn group transition-all"
          >
            <div>
              <div className="font-saira font-bold text-[16px] text-white uppercase">Nuovo Articolo</div>
              <div className="text-[12.5px] text-muted mt-0.5">Scrivi e pubblica una nuova news</div>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            href="/admin/prodotti?action=new"
            className="flex items-center justify-between p-4 bg-[#101214] border border-border hover:border-azzurro rounded-btn group transition-all"
          >
            <div>
              <div className="font-saira font-bold text-[16px] text-white uppercase">Nuovo Prodotto</div>
              <div className="text-[12.5px] text-muted mt-0.5">Aggiungi un prodotto al catalogo</div>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            href="/admin/categorie"
            className="flex items-center justify-between p-4 bg-[#101214] border border-border hover:border-azzurro rounded-btn group transition-all"
          >
            <div>
              <div className="font-saira font-bold text-[16px] text-white uppercase">Gestisci Categorie</div>
              <div className="text-[12.5px] text-muted mt-0.5">Aggiungi o modifica categorie</div>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
