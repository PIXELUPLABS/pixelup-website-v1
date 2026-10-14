import type { Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import Cursor from '@/components/2027/Cursor';
import Experience from '@/components/2027/Experience';
import MarkCanvas from '@/components/2027/mark/MarkCanvas';
import './styles/base.css';
import './styles/chrome.css';
import './styles/sections.css';
import './styles/shell.css';

// The 2026 site's homepage (daksh6131/pixelup-labs-website-2026 @ 9ff5dd4), mounted at /2027.
// Its styles are scoped to the .v2027 wrapper below, and the root layout leaves out its Navbar and column here.

// Self-hosted so the type never depends on a third-party CDN.
const switzer = localFont({
  src: [
    { path: './fonts/Switzer-400.woff2', weight: '400' },
    { path: './fonts/Switzer-500.woff2', weight: '500' },
  ],
  variable: '--font-switzer',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
});

export const viewport: Viewport = {
  themeColor: '#0c0c0c',
  colorScheme: 'dark',
};

// Runs before the page paints: enables the motion styles (hidden intro states) only when JS and motion are available,
// and falls back to static content if the motion layer never boots.
const boot = `(function(d){var c=d.documentElement.classList;c.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){c.add('motion');setTimeout(function(){if(!c.contains('motion-live'))c.remove('motion')},5000)}})(document)`;

export default function Layout2027({ children }: { children: ReactNode }) {
  return (
    <div className={`v2027 ${switzer.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: boot }} />
      {children}
      {/* Outside the page so the mark could stay docked across /2027 routes, as it does on the 2026 site. */}
      <MarkCanvas />
      <Cursor />
      <Experience />
    </div>
  );
}
