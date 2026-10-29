'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowSwap, Roll } from '@/components/2027/ui';

type Chapter = { n: string; title: string };

/**
 * The sticky case bar: close, client, the chapter in view and the site link, over a rule that fills with
 * reading progress. Chapters are the page's [data-chapter] sections, read from the DOM so the bar needs
 * no copy of the content.
 */
export default function CaseBar({
  client,
  closeHref,
  site,
}: {
  client: string;
  closeHref: string;
  site?: { href: string; label: string };
}) {
  const fill = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [now, setNow] = useState<Chapter | null>(null);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
    const total = String(sections.length - 1).padStart(2, '0');
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = (bar.current?.getBoundingClientRect().bottom ?? 0) + 1;
      let current: HTMLElement | undefined;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
      setNow(
        current
          ? { n: `${current.dataset.n} / ${total}`, title: current.dataset.chapter ?? '' }
          : null,
      );
      const max = document.documentElement.scrollHeight - innerHeight;
      if (fill.current) fill.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav ref={bar} className="ncs-bar" aria-label="Case study">
      <a href={closeHref} className="ncs-bar__close" aria-label="Close case study, back to work">
        <ArrowSwap rotate={180} />
        <Roll>Close</Roll>
      </a>
      <span className="ncs-bar__client">{client}</span>
      <span className="ncs-bar__chapter" aria-live="polite">
        <span className="ncs-bar__now">
          {now && (
            <>
              <b className="ncs-mono">{now.n}</b>
              <span>{now.title}</span>
            </>
          )}
        </span>
      </span>
      {site && (
        <a href={site.href} className="ncs-bar__site" target="_blank" rel="noopener noreferrer">
          <Roll>{site.label}</Roll>
          <ArrowSwap rotate={-45} />
        </a>
      )}
      <i className="ncs-bar__rule" aria-hidden="true">
        <i ref={fill} className="ncs-bar__fill" />
      </i>
    </nav>
  );
}
