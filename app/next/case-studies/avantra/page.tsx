import type { Metadata } from 'next';
import Header from '@/components/2027/Header';
import NextCaseStudy from '@/components/next/case/NextCaseStudy';
import { caseStudies } from '@/lib/case-studies';
import { projects } from '@/lib/projects';

// Avantra in the 2026 site's case study layout (its /next/case-studies/replay). A draft like /case-studies/avantra:
// kept out of search.
const study = caseStudies.avantra;
const nextIndex = projects.findIndex((p) => p.slug === 'fuseai');

export const metadata: Metadata = {
  title: study.metaTitle,
  description: study.metaDescription,
  robots: { index: false, follow: false },
  alternates: { canonical: '/case-studies/avantra' },
};

export default function NextAvantraPage() {
  return (
    <>
      <Header nav={false} contact={{ label: 'Book a call', href: '/call' }} />
      <main data-page="next-case">
        <NextCaseStudy study={study} next={projects[nextIndex]} nextIndex={nextIndex + 1} total={projects.length} />
      </main>
    </>
  );
}
