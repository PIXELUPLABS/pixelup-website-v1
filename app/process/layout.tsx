import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import Shell2027 from '@/components/2027/Shell';
import '../2027/styles/base.css';
import '../2027/styles/chrome.css';
import '../2027/styles/sections.css';
import '../2027/styles/shell.css';
import './styles/case.css';
import './styles/proposal.css';

// How we work, the 2026 site's /how-we-work (daksh6131/pixelup-labs-website-2026), mounted at /process on the same
// shell as /2027: the 2026 design system scoped to the .v2027 wrapper, with case.css and proposal.css ported for it.

export const viewport: Viewport = {
  themeColor: '#0c0c0c',
  colorScheme: 'dark',
};

export default function ProcessLayout({ children }: { children: ReactNode }) {
  return <Shell2027>{children}</Shell2027>;
}
