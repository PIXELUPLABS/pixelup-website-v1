import type { Metadata } from 'next';
import About from '@/components/2027/About';
import Clients from '@/components/2027/Clients';
import Footer from '@/components/2027/Footer';
import Header from '@/components/2027/Header';
import Hero from '@/components/2027/Hero';
import News from '@/components/2027/News';
import Services from '@/components/2027/Services';
import Work from '@/components/2027/Work';
import { getBlogRows } from '@/lib/2027/blog';
import { site } from '@/lib/2027/site';

const title = 'PIXELUP LABS - Premium Brands and Websites';

// A preview of the next homepage: kept out of search so it never competes with / for the same queries.
export const metadata: Metadata = {
  title,
  description: site.description,
  alternates: { canonical: '/2027' },
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description: site.description,
    url: '/2027',
    siteName: 'PIXELUP LABS',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title, description: site.description },
};

export default async function Home2027() {
  const posts = await getBlogRows();

  return (
    <>
      <Header blogCount={posts.length} />
      <main>
        <Hero />
        <Work />
        <Clients />
        <About />
        <Services />
        <News posts={posts.slice(0, 5)} total={posts.length} />
      </main>
      <Footer />
    </>
  );
}
