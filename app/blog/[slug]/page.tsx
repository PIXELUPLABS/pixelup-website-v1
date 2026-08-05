import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog/BlogPostPage";
import { blogImageUrl } from "@/sanity/lib/blog-schema";
import { getBlogPost, getBlogPosts, getBlogSlugs } from "@/sanity/lib/blog-data";

// Keep new Sanity-authored slugs available without requiring a fresh build.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug, { stega: false });
  if (!post) return {};
  const socialImage = post.seo.image || post.image;
  return {
    title: `${post.seo.title} - PIXELUP LABS`,
    // Without this, every post inherits the site-wide description from
    // app/layout.tsx, so all of /blog ships one duplicate snippet that
    // describes the company instead of the article.
    description: post.seo.description,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.seo.noIndex ? { index: false, follow: false } : undefined,
    // og:type=article unlocks article:published_time / article:modified_time,
    // the meta-tag freshness signal. Belt-and-braces with the BlogPosting
    // JSON-LD in BlogPostPage — different crawlers read different ones.
    openGraph: {
      type: "article",
      title: post.seo.title,
      description: post.seo.description,
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
      authors: [post.author],
      images: [
        {
          url: blogImageUrl(socialImage, 1200, 630),
          width: 1200,
          height: 630,
          alt: socialImage.alt,
        },
      ],
    },
  };
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getBlogPost(slug), getBlogPosts()]);
  if (!post) notFound();
  const relatedPosts = posts.filter((candidate) => candidate.slug !== post.slug).slice(0, 2);
  return <BlogPostPage post={post} relatedPosts={relatedPosts} />;
}
