'use client';

import React, { useState, useEffect } from 'react';

type Heading = {
  id: string;
  text: string;
};

type ArticleClientWrapperProps = {
  headings: Heading[];
};

export default function ArticleClientWrapper({ headings }: ArticleClientWrapperProps) {
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

  if (headings.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-card p-6.5 p-7 flex flex-col">
      <h4 className="font-saira font-bold text-[14px] tracking-[2px] text-white uppercase mb-4 pb-2 border-b border-border/60">
        Indice Articolo
      </h4>
      <nav className="flex flex-col gap-3 font-plex text-[14px] text-muted">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => handleLinkClick(e, heading.id)}
            className={`hover:text-white transition-colors text-left leading-normal border-l-2 pl-3 ${
              activeId === heading.id
                ? 'text-rosso border-rosso font-medium'
                : 'border-transparent text-muted'
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
