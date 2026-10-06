'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Chi siamo', href: '/chi-siamo' },
    { label: 'Servizi', href: '/servizi' },
    { label: 'Settori', href: '/settori' },
    { label: 'Lavori', href: '/lavori' },
    { label: 'Marchi', href: '/marchi' },
    { label: 'News', href: '/blog' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/[.88] backdrop-blur-[12px] border-b border-border font-plex">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="leading-none text-decoration-none flex items-center">
          <Image
            src="/assets/logo-rossi.png"
            alt="Rossi Impianti srl"
            width={640}
            height={122}
            className="h-10 w-auto object-contain"
            priority
            quality={95}
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-[26px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-plex font-medium text-[15px] transition-colors hover:text-rosso ${
                isLinkActive(link.href) ? 'text-text1' : 'text-text2'
              }`}
            >
              {link.label}
            </Link>
          ))}


          <Link
            href="/contatti"
            className="font-plex font-semibold text-[15px] text-white bg-rosso hover:bg-rosso-hover rounded-btn px-5 py-[11px] shadow-[0_4px_14px_rgba(225,29,23,.22)] transition-all hover:-translate-y-[1px]"
          >
            Contatti
          </Link>
        </nav>

        {/* MOBILE MENU TRIGGER */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-text1 focus:outline-none p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV PANEL */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white/95 backdrop-blur-[10px]">
          <nav className="flex flex-col p-6 gap-4 font-plex text-[15px] font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-border/60 transition-colors ${
                  isLinkActive(link.href) ? 'text-text1' : 'text-text2'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contatti"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center font-semibold text-[15px] text-white bg-rosso hover:bg-rosso-hover rounded-btn py-3 transition-all"
            >
              Contatti
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
