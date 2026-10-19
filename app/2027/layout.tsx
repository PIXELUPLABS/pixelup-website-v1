import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import Shell2027 from '@/components/2027/Shell';
import './styles/base.css';
import './styles/chrome.css';
import './styles/sections.css';
import './styles/shell.css';

// The 2026 site's homepage (daksh6131/pixelup-labs-website-2026 @ 9ff5dd4), mounted at /2027.
// Its styles are scoped to the .v2027 wrapper (components/2027/Shell.tsx), and the root layout leaves out its Navbar and column here.

export const viewport: Viewport = {
  themeColor: '#0c0c0c',
  colorScheme: 'dark',
};

export default function Layout2027({ children }: { children: ReactNode }) {
  return <Shell2027>{children}</Shell2027>;
}
