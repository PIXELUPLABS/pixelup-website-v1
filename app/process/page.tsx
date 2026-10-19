import type { Metadata } from 'next';
import Footer from '@/components/2027/Footer';
import Header from '@/components/2027/Header';
import ProposalView from '@/components/2027/proposal/ProposalView';
import { howWeWork as p } from '@/lib/2027/process';

// A standalone page shared by link with leads before the discovery call: no site nav, not in search or the sitemap.
// The footer is the 2026 homepage's, with Daksh's address; the header's ask is a question for the call.
const DAKSH = 'daksh@pixeluplabs.com';

export const metadata: Metadata = {
  title: 'How we work - PIXELUP LABS',
  description: p.lede,
  robots: { index: false, follow: false },
  alternates: { canonical: '/process' },
};

export default function ProcessPage() {
  return (
    <>
      <Header nav={false} status="Questions before our call?" contact={{ label: 'Email Daksh', href: `mailto:${DAKSH}` }} />
      <main data-page="process">
        <ProposalView p={p} />
      </main>
      <Footer
        eyebrow={null}
        email={DAKSH}
        note="Anything you’d like covered on the call? Email Daksh."
        legal={[{ label: 'Privacy Policy', href: '/privacy' }]}
      />
    </>
  );
}
