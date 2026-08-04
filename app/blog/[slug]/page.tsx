import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog/BlogPostPage";
import { blogPosts } from "@/lib/blog";

// Only the slugs from lib/blog.ts exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} - PIXELUP LABS`,
    // Without this, every post inherits the site-wide description from
    // app/layout.tsx, so all of /blog ships one duplicate snippet that
    // describes the company instead of the article.
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    // og:type=article unlocks article:published_time / article:modified_time,
    // the meta-tag freshness signal. Belt-and-braces with the BlogPosting
    // JSON-LD in BlogPostPage — different crawlers read different ones.
    openGraph: {
      type: "article",
      description: post.description,
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
      authors: [post.author],
    },
  };
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  return <BlogPostPage post={post} />;
}
