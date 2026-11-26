import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { stegaClean } from "@sanity/client/stega";
import { Footer } from "@/components/Footer";
import { SocialLinks } from "@/components/SocialLinks";
import {
  authorName,
  authorProfile,
  authorProfileUrl,
  authorRole,
} from "@/sanity/lib/author-links";
import { collectSources, splitBodyForCta, type BlogSource } from "@/sanity/lib/blog-body";
import { blogPostGraph, serializeJsonLd } from "@/sanity/lib/blog-structured-data";
import type { BlogPostData } from "@/sanity/lib/blog-types";
import { formatBlogDate } from "@/sanity/lib/blog-utils";
import type { SanityImageSource } from "@sanity/image-url";
import { BlogImage } from "./BlogImage";
import { BlogPostSidebar } from "./BlogPostSidebar";
import { PlaybookCta } from "./PlaybookCta";

/** End-of-article section headings (Sources, What to read next): the body's
    H2 size, so the page has one heading scale below the sidebar's H1. */
const endHeading =
  "tracking-display text-[24px] font-medium leading-[1.15] text-white desk:text-[32px]";

/** "How much does it cost?" -> "how-much-does-it-cost", for heading anchors. */
function headingId(value: unknown): string | undefined {
  const children = (value as { children?: Array<{ text?: string }> })?.children;
  if (!Array.isArray(children)) return undefined;
  const slug = stegaClean(children.map((child) => child.text || "").join(""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || undefined;
}

/** A `blogBody` image block, as projected by BLOG_POST_QUERY. */
type ArticleImageValue = {
  alt?: string;
  caption?: string;
  sourceUrl?: string;
  capturedOn?: string;
  asset?: {
    _id?: string;
    url?: string;
    metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } };
  };
};

/** One "Related Articles" card — date, image, category tag, heading,
    description, "Read Article". Links to the related post. */
function RelatedArticleCard({ post }: { post: BlogPostData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex min-w-0 flex-1 flex-col gap-3">
      <p className="text-[12px] font-medium uppercase text-label-grey">
        {formatBlogDate(post.publishedDate)}
      </p>
      {/* Same fix as the hero image and /blog's list cards: every blog
          image shares the 2084x960 aspect ratio, so desktop sizes from
          that instead of a fixed height — a fixed h-80 box was cropping
          the image on wide viewports, where the card grows wider without
          growing taller. */}
      <div className="relative h-56.25 w-full desk:aspect-2084/960 desk:h-auto">
        <BlogImage image={post.image} fill sizes="(min-width: 1200px) 25vw, 100vw" className="object-cover object-left" />
      </div>
      {/* Extra mt-2 on top of the card's gap-3 rhythm for the spacing
          called out between the image and the tag. */}
      <div className="mt-2 flex items-end">
        <span className="h-1 w-1.5 shrink-0 bg-highlight" />
        <span className="bg-label-grey/20 px-0.5 py-px text-[12px] font-medium uppercase text-white">
          {post.categories[0]}
        </span>
      </div>
      <p className="text-[24px] font-medium leading-tight text-white transition-opacity duration-200 group-hover:opacity-60">
        {post.title}
      </p>
      {/* <p className="text-[16px] leading-[1.5] text-body-grey">{post.description}</p> */}
      {/* Extra mt-2 for the spacing called out before "Read Article". gap-2
          (8px) between the text and the button. */}
      <div className="mt-2 flex items-center gap-4">
        <p className="text-[12px] font-medium uppercase text-white">Read Article</p>
        <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center bg-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M11.2173 8.80431V7.19579H9.60876V8.80431H11.2173ZM9.60876 7.19579V5.58727H8.00024V7.19579H9.60876ZM9.60876 10.4128V8.80431H8.00024V10.4128H9.60876ZM8.00024 5.58727V3.97876H6.39172V5.58727H8.00024ZM8.00024 12.0213V10.4128H6.39172V12.0213H8.00024ZM6.39172 3.97876V2.37024H4.7832V3.97876H6.39172ZM6.39172 13.6299V12.0213H4.7832V13.6299H6.39172Z"
              fill="var(--color-highlight)"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/** Body copy: 18px from desk at a 1.7 line height. */
const bodyText = "text-pretty text-[17px] leading-[1.7] text-body-grey desk:text-[18px]";

const portableTextComponents: PortableTextComponents = {
  block: {
    // Each H2 opens a section: a hairline and 40px above it, on top of the
    // column's own gap, so a long article scans as sections rather than one
    // run of paragraphs. 32px, not the old 48px: most are full questions,
    // which wrapped to three lines and outweighed the copy under them.
    // scroll-mt clears the sticky Navbar when a heading is linked to.
    h2: ({ children, value }) => (
      <h2
        id={headingId(value)}
        className="tracking-display mt-6 scroll-mt-24 text-balance border-t-[0.5px] border-hairline pt-10 text-[24px] font-medium leading-[1.15] text-white first:mt-0 first:border-t-0 first:pt-0 desk:text-[32px]"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={headingId(value)}
        className="tracking-display mt-4 scroll-mt-24 text-balance text-[20px] font-medium leading-[1.25] text-white desk:text-[24px]"
      >
        {children}
      </h3>
    ),
    normal: ({ children }) => <p className={bodyText}>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-white">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const openInNewTab = value?.openInNewTab !== false;
      return (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className={`flex flex-col gap-3 pl-6 ${bodyText} marker:text-white/40 [&>li]:list-disc [&>li]:pl-1`}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className={`flex flex-col gap-3 pl-6 ${bodyText} marker:text-white/40 [&>li]:list-decimal [&>li]:pl-1`}>
        {children}
      </ol>
    ),
  },
  types: {
    comparisonTable: ({ value }) => {
      const table = value as {
        headers?: string[];
        rows?: Array<{ _key?: string; cells?: string[] }>;
      };
      return (
        <div className="my-2 w-full overflow-x-auto">
          <table className="w-full min-w-120 border-collapse border-[0.5px] border-hairline text-left text-[16px]">
            <thead>
              <tr className="divide-x divide-hairline border-b-[0.5px] border-hairline">
                {(table.headers || []).map((header) => (
                  <th
                    key={header}
                    className="p-3 align-bottom text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {(table.rows || []).map((row, rowIndex) => (
                <tr key={row._key || rowIndex} className="divide-x divide-hairline">
                  {(row.cells || []).map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      // The first column names the row, so it reads in white.
                      className={`p-3 align-top leading-[1.5] ${cellIndex === 0 ? "text-white" : "text-body-grey"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    articleImage: ({ value }) => {
      const image = value as ArticleImageValue;
      const dimensions = image.asset?.metadata?.dimensions;
      if (!image.asset?._id || !dimensions?.width || !dimensions?.height) return null;
      // Keep the source's own aspect ratio (screenshots aren't 2084x960 like
      // the header images), capped at 1600px wide.
      const width = Math.min(1600, dimensions.width);
      const height = Math.round((width * dimensions.height) / dimensions.width);
      let sourceLabel = "";
      try {
        sourceLabel = image.sourceUrl ? new URL(image.sourceUrl).hostname.replace(/^www\./, "") : "";
      } catch {
        sourceLabel = "";
      }
      return (
        <figure className="my-2 flex w-full flex-col gap-2">
          <BlogImage
            image={{
              kind: "sanity",
              source: image as SanityImageSource,
              alt: image.alt || "",
              lqip: image.asset.metadata?.lqip,
              width: dimensions.width,
              height: dimensions.height,
            }}
            width={width}
            height={height}
            sizes="(min-width: 1200px) 70vw, 100vw"
            className="h-auto w-full border-[0.5px] border-hairline"
          />
          {image.caption || sourceLabel ? (
            <figcaption className="text-[12px] leading-[1.5] text-label-grey">
              {image.caption}
              {image.caption && sourceLabel ? " · " : null}
              {sourceLabel ? (
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white/70"
                >
                  {sourceLabel}
                </a>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

/** End-of-article author box: photo, name, role, a short bio and the
    author's LinkedIn and X as icon links. Authors without a profile entry (sanity/lib/author-links)
    still get the name and role. */
function AuthorBox({ author }: { author: string }) {
  const profile = authorProfile(author);
  const profileUrl = authorProfileUrl(author);
  const role = authorRole(author);

  return (
    <section
      aria-label="About the author"
      className="flex flex-col gap-5 border-[0.5px] border-hairline p-6 min-[700px]:flex-row"
    >
      {profile && (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white">
          <Image src={profile.avatar} alt={profile.fullName} fill sizes="56px" className="object-cover" />
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
            Written by
          </p>
          <p className="text-[20px] font-medium leading-tight text-white">
            {profile?.fullName || authorName(author)}
          </p>
          {role && <p className="text-[14px] tracking-[-0.01em] text-label-grey">{role}</p>}
        </div>
        {profile && <p className="text-pretty text-[16px] leading-[1.6] text-body-grey">{profile.bio}</p>}
        {profile ? (
          <SocialLinks
            socials={profile.socials.map((social) => ({
              ...social,
              label: `${profile.fullName} on ${social.name}`,
            }))}
          />
        ) : (
          profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-[14px] tracking-[-0.01em] text-white underline underline-offset-2 hover:text-white/70"
            >
              Profile
            </a>
          )
        )}
      </div>
    </section>
  );
}

/** Every external page the article links to, numbered in reading order.
    Open by default while the list is short; a long one (the listicles cite
    60 and more) starts collapsed under its count. */
function Sources({ sources }: { sources: BlogSource[] }) {
  if (sources.length === 0) return null;

  return (
    <details open={sources.length <= 12} className="group w-full border-y-[0.5px] border-hairline">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
        <h2 className={endHeading}>Sources</h2>
        <span className="flex shrink-0 items-center gap-3 text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
          {sources.length} {sources.length === 1 ? "link" : "links"}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-white transition-transform group-open:rotate-45 motion-reduce:transition-none"
          >
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <ol className="columns-1 gap-x-8 pb-8 min-[700px]:columns-2 min-[1600px]:columns-3">
        {sources.map((source, index) => (
          <li key={source.href} className="flex break-inside-avoid gap-3 py-1.5 text-[14px] leading-[1.4]">
            <span aria-hidden="true" className="w-6 shrink-0 font-mono text-[12px] leading-[1.65] text-white/40">
              {String(index + 1).padStart(2, "0")}
            </span>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 break-words text-white hover:underline hover:underline-offset-2"
            >
              {source.host}
              <span className="text-label-grey">{source.path}</span>
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Blog post detail shell — aside + divider + right-section layout, same
    treatment as /blog. The article runs the full width of `main` with one
    inline CTA between two of its sections, and ends on the author, the
    article's sources and what to read next. */
export function BlogPostPage({
  post,
  relatedPosts,
}: {
  post: BlogPostData;
  relatedPosts: BlogPostData[];
}) {
  const [bodyStart, bodyRest] = splitBodyForCta(post.body);
  const sources = collectSources(post.body);

  return (
    <div className="relative flex flex-col gap-8 p-4 desk:flex-row desk:items-start desk:gap-0 desk:p-5">
      {/* One graph: BlogPosting, breadcrumb, and the FAQ and agency list when the body has them. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPostGraph(post)) }}
      />
      <BlogPostSidebar post={post} />
      {/* Divider between the aside and content columns, same treatment as /blog. */}
      <div
        aria-hidden="true"
        className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
      />
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        {/* No fixed height / object-cover here on purpose — cropping to a
            fixed box was cutting the image off on some viewport heights.
            Every blog image shares the same 2084x960 aspect ratio, so
            sizing from that and letting height follow width shows the
            whole image instead. */}
        <div className="fade-up w-full [animation-delay:100ms]">
          <BlogImage
            image={post.image}
            width={2084}
            height={960}
            priority
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
        {/* Own gap-6 (24px) — tighter than main's gap-8, which is meant for
            spacing between structural sections (banner, read next, sources),
            not between individual paragraphs/headings here. */}
        <article className="fade-up flex w-full flex-col gap-6 [animation-delay:200ms]">
          <PortableText value={bodyStart} components={portableTextComponents} />
          {/* The one inline CTA: between two sections when the article has
              enough of them, otherwise after it. my-4 on top of the column
              gap sets it apart from the copy. */}
          <div className="my-4">
            <PlaybookCta />
          </div>
          {bodyRest.length > 0 && (
            <>
              <PortableText value={bodyRest} components={portableTextComponents} />
              {/* And once more to close a long article, for readers who
                  scrolled past the first one. Short articles already end
                  on the CTA above. */}
              <div className="mt-4">
                <PlaybookCta />
              </div>
            </>
          )}
        </article>
        <div className="fade-up w-full [animation-delay:300ms]">
          <AuthorBox author={stegaClean(post.author)} />
        </div>
        <div className="fade-up mb-3 flex w-full flex-col gap-8 [animation-delay:300ms]">
          <Sources sources={sources} />
          {relatedPosts.length > 0 && (
            <>
              {/* Sources closes on its own bottom rule; without a Sources
                  list this rule separates the section from the author box. */}
              {sources.length === 0 && (
                <div aria-hidden="true" className="w-full border-t-[0.5px] border-hairline" />
              )}
              <h2 className={endHeading}>What to read next</h2>
              <div className="flex w-full flex-col gap-8 desk:flex-row desk:gap-6">
                {relatedPosts.map((relatedPost) => (
                  <RelatedArticleCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </>
          )}
        </div>
        {/* Same treatment as /blog's Footer wrapper — cancels the row's
            p-5 on this wrapper only, so Footer fills the extra space via
            its own w-full without needing any change to Footer itself. */}
        <div className="-mx-4 -mb-4 desk:-mr-5 desk:-mb-5 desk:-ml-4">
          <Footer />
        </div>
      </main>
    </div>
  );
}
