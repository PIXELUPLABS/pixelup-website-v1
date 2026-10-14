'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { site } from '@/lib/2027/site';
import { StatusDots } from './ui';

// Same-page sections only, like the header.
const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Blog', href: '#news' },
  { label: 'Contact', href: '#contact' },
];

const subscribe = () => () => {};

export default function MenuToggle() {
  const [open, setOpen] = useState(false);
  // The menu renders outside the difference-blended header, but inside the page wrapper its styles are scoped to.
  // Client only: nothing to portal into on the server.
  const host = useSyncExternalStore(subscribe, () => document.querySelector('.v2027'), () => null);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    window.dispatchEvent(new CustomEvent('menu:toggle', { detail: open }));
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="hdr__menu"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="hdr__menu-label" data-open={open}>
          <span>Menu</span>
          <span>Close</span>
        </span>
      </button>
      {host &&
        createPortal(
          <div id="site-menu" className="menu" aria-hidden={!open} inert={!open}>
            <nav className="menu__nav" aria-label="Menu">
              {links.map((l, i) => (
                <a key={l.href} href={l.href} className="menu__link" style={{ '--i': i } as React.CSSProperties} onClick={() => setOpen(false)}>
                  <span>{l.label}</span>
                </a>
              ))}
            </nav>
            <div className="menu__foot">
              <span className="status">
                <StatusDots />
                <span>{site.status}</span>
              </span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </div>,
          host,
        )}
    </>
  );
}
