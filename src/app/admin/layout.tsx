import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, FileText, FolderTree, Package, Star, ShoppingCart, LogOut, ShieldAlert } from 'lucide-react';
import AdminLogoutButton from './AdminLogoutButton';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If there's no user, it means the middleware will handle redirecting, but let's handle it or render children directly for login
  // Note: if user is not present, we must be on /admin/login page, in which case we don't render the sidebar layout shell!
  if (!user) {
    return <div className="min-h-screen bg-bg text-text1">{children}</div>;
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Categorie', href: '/admin/categorie', icon: FolderTree },
    { label: 'Articoli', href: '/admin/articoli', icon: FileText },
    { label: 'Prodotti', href: '/admin/prodotti', icon: Package },
    { label: 'Recensioni', href: '/admin/recensioni', icon: Star },
    { label: 'Ordini', href: '/admin/ordini', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-surface-2 text-text flex flex-col md:flex-row font-plex">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-bg border-r border-border flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-baseline gap-1 font-archivo leading-none">
              <span className="font-extrabold text-[20px] text-text">ADMIN PORTAL</span>
            </div>
            <div className="flex items-center gap-1.5 text-rosso text-[11px] font-bold tracking-[0.5px] mt-2">
              <ShieldAlert size={12} />
              <span>ROSSI IMPIANTI srl</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1 font-saira font-semibold tracking-[0.5px] uppercase text-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-btn text-text-2 hover:text-text hover:bg-bg-alt border border-transparent hover:border-border transition-all"
                >
                  <Icon size={16} className="text-rosso" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info / Logout */}
        <div className="p-4 border-t border-border bg-bg-alt">
          <div className="px-4 py-2 text-xs text-muted font-plex truncate mb-2">
            Logged in as:<br />
            <span className="text-text font-medium text-xs">{user.email}</span>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}
