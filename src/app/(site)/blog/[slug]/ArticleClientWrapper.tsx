'use client';

import React, { useState, useEffect } from 'react';

type Heading = {
  id: string;
  text: string;
};

type ArticleClientWrapperProps = {
  headings: Heading[];
  hasFaq?: boolean;
};

export default function ArticleClientWrapper({ headings, hasFaq = false }: ArticleClientWrapperProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      // Find the heading that is closest to the top of the viewport
      const headingElements = headings.map((h) => document.getElementById(h.id));
      let currentActiveId = '';

      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          // Heading is near the top of the page (within 120px)
          if (rect.top <= 120) {
            currentActiveId = headings[i].id;
          }
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (headings.length > 0) {
        // Fallback to the first one if we're near the top
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -96; // Offset for sticky header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0 && !hasFaq) return null;

  return (
    <div className="bg-surface2 border border-border rounded-card p-[22px_24px] flex flex-col">
      <div className="font-saira font-extrabold text-[13px] tracking-[0.8px] text-text uppercase mb-3.5">
        In questo articolo
      </div>
      <nav className="flex flex-col gap-[11px] font-plex text-[14px]">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => handleLinkClick(e, heading.id)}
            className={`transition-colors leading-[1.4] hover:text-rosso ${
              activeId === heading.id ? 'text-rosso font-medium' : 'text-text-2'
            }`}
          >
            {heading.text}
          </a>
        ))}
        {hasFaq && (
          <a
            href="#faq"
            onClick={(e) => handleLinkClick(e, 'faq')}
            className={`transition-colors leading-[1.4] hover:text-rosso ${
              activeId === 'faq' ? 'text-rosso font-medium' : 'text-text-2'
            }`}
          >
            Domande frequenti
          </a>
        )}
      </nav>
    </div>
  );
}
