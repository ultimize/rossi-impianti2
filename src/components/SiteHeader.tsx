'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Chi siamo', href: '/chi-siamo' },
    { label: 'Servizi', href: '/servizi' },
    { label: 'Settori', href: '/settori' },
    { label: 'Marchi trattati', href: '/marchi' },
    { label: 'News', href: '/blog' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#101214]/86 backdrop-blur-[10px] border-bottom border-border border-b font-plex">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-[18px] flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="leading-none text-decoration-none group">
          <div className="flex items-baseline gap-1.5 font-archivo">
            <span className="font-extrabold text-[22px] tracking-[-0.5px] text-white transition-colors group-hover:text-rosso">
              ROSSI IMPIANTI
            </span>
            <span className="font-semibold text-[10.5px] color-[#7c848d] text-muted2">
              srl
            </span>
          </div>
          <div className="flex gap-2.2 font-archivo font-bold text-[9px] tracking-[0.8px] mt-1">
            <span className="text-rosso">RISCALDAMENTO</span>
            <span className="text-azzurro">CONDIZIONAMENTO</span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-[21px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-saira font-semibold text-[14px] tracking-[0.5px] uppercase transition-colors hover:text-white ${
                isLinkActive(link.href) ? 'text-white' : 'text-text2'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/shop"
            className={`font-saira font-semibold text-[14px] tracking-[0.5px] uppercase transition-colors hover:text-white flex items-center gap-1.5 ${
              isLinkActive('/shop') ? 'text-white' : 'text-azzurro'
            }`}
          >
            Shop
          </Link>

          {/* Cart Icon */}
          <Link href="/shop/carrello" className="relative text-text2 hover:text-white p-1 transition-colors">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rosso text-white font-saira font-bold text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/contatti"
            className="font-saira font-bold text-[14px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn px-[18px] py-[11px] transition-all hover:-translate-y-[1px]"
          >
            Contatti
          </Link>
        </nav>

        {/* MOBILE MENU TRIGGER */}
        <div className="flex lg:hidden items-center gap-4">
          <Link href="/shop/carrello" className="relative text-text2 hover:text-white p-1 transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rosso text-white font-saira font-bold text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV PANEL */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-bg/95 backdrop-blur-[10px]">
          <nav className="flex flex-col p-6 gap-4 font-saira text-base tracking-[0.5px] uppercase font-semibold">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-border/40 transition-colors ${
                  isLinkActive(link.href) ? 'text-white' : 'text-text2'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 border-b border-border/40 transition-colors ${
                isLinkActive('/shop') ? 'text-white' : 'text-azzurro'
              }`}
            >
              Shop
            </Link>
            <Link
              href="/contatti"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center font-bold text-[14px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn py-3 transition-all"
            >
              Contatti
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
