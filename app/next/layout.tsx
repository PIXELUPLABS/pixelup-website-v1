import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import Shell2027 from '@/components/2027/Shell';
import '../2027/styles/base.css';
import '../2027/styles/chrome.css';
import '../2027/styles/shell.css';
import './styles/case.css';

// The 2026 site's /next pages (pixelup-labs-website-2026.vercel.app/next), on the same 2026 shell as /process,
// without its 3D mark (the reference case study has none).

export const viewport: Viewport = {
  themeColor: '#0c0c0c',
  colorScheme: 'dark',
};

export default function NextLayout({ children }: { children: ReactNode }) {
  return <Shell2027 mark={false}>{children}</Shell2027>;
}
