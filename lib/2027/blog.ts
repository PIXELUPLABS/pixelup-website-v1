import 'server-only';
import { getBlogPosts } from '@/sanity/lib/blog-data';

export type BlogRow = { slug: string; title: string; kind: 'Comparison' | 'Guide'; date: string };

/** "2026-07-07" -> "Jul 7, 2026" */
function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** The site's articles, newest first, typed the way the 2026 site types them (by title). */
export async function getBlogRows(): Promise<BlogRow[]> {
  const posts = await getBlogPosts({ stega: false });
  return [...posts]
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      kind: /alternatives|best |compared| vs /i.test(p.title) ? 'Comparison' : 'Guide',
      date: formatDate(p.publishedDate),
    }));
}
