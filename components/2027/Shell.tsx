import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import Cursor from './Cursor';
import Experience from './Experience';
import MarkCanvas from './mark/MarkCanvas';

// The 2026 site's page shell, shared by /2027 and /process. Its styles are scoped to the .v2027 wrapper, and the root
// layout leaves out its Navbar and column on both routes (components/SiteFrame.tsx).

// Self-hosted so the type never depends on a third-party CDN.
const switzer = localFont({
  src: [
    { path: '../../app/2027/fonts/Switzer-400.woff2', weight: '400' },
    { path: '../../app/2027/fonts/Switzer-500.woff2', weight: '500' },
  ],
  variable: '--font-switzer',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
});

// Runs before the page paints: enables the motion styles (hidden intro states) only when JS and motion are available,
// and falls back to static content if the motion layer never boots.
const boot = `(function(d){var c=d.documentElement.classList;c.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){c.add('motion');setTimeout(function(){if(!c.contains('motion-live'))c.remove('motion')},5000)}})(document)`;

export default function Shell2027({ children }: { children: ReactNode }) {
  return (
    <div className={`v2027 ${switzer.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: boot }} />
      {children}
      {/* Outside the page so the mark could stay docked across routes, as it does on the 2026 site. */}
      <MarkCanvas />
      <Cursor />
      <Experience />
    </div>
  );
}
