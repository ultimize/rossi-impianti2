import React from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { CartProvider } from '@/context/CartContext';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-bg text-text1">
        <SiteHeader />
        <main className="flex-grow">{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
