import { Geist } from "next/font/google";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { AuditForm } from "@/components/AuditForm";
import { Footer } from "@/components/Footer";
import { blogPostSchema } from "@/sanity/lib/blog-schema";
import type { BlogPostData } from "@/sanity/lib/blog-types";
import { formatBlogDate } from "@/sanity/lib/blog-utils";
import { BlogImage } from "./BlogImage";
import { BlogPostSidebar } from "./BlogPostSidebar";

// Scoped to the "Related Articles" heading only — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500"] });

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
        <BlogImage image={post.image} alt="" fill sizes="(min-width: 1200px) 25vw, 100vw" className="object-cover object-left" />
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

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="tracking-display mt-4 text-[24px] font-medium leading-tight text-white desk:text-[48px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="tracking-display mt-4 text-[20px] font-medium leading-tight text-white desk:text-[28px]">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-[16px] leading-[1.6] text-body-grey">{children}</p>
    ),
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
          className="font-medium text-white underline underline-offset-2 hover:text-white/70"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex flex-col gap-2 pl-5 text-[16px] leading-[1.6] text-body-grey marker:text-white/40 [&>li]:list-disc">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="flex flex-col gap-2 pl-5 text-[16px] leading-[1.6] text-body-grey marker:text-white/40 [&>li]:list-decimal">
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
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-120 border-collapse border-[0.5px] border-hairline text-left text-[16px]">
            <thead>
              <tr className="divide-x divide-hairline border-b-[0.5px] border-hairline">
                {(table.headers || []).map((header) => (
                  <th
                    key={header}
                    className="p-3 text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey"
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
                    <td key={cellIndex} className="p-3 leading-[1.5] text-body-grey">
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
  },
};

/** Blog post detail shell — aside + divider + right-section layout, same
    treatment as /blog. Right-section content beyond the hero banner is a
    placeholder for now; the real article layout lands later. */
export function BlogPostPage({
  post,
  relatedPosts,
}: {
  post: BlogPostData;
  relatedPosts: BlogPostData[];
}) {
  return (
    <div className="relative flex flex-col gap-8 p-4 desk:flex-row desk:items-start desk:gap-0 desk:p-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema(post)) }}
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
            alt=""
            width={2084}
            height={960}
            priority
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
        {/* Own gap-5 (20px) — tighter than main's gap-8, which is meant for
            spacing between structural sections (banner, divider, related
            articles), not between individual paragraphs/headings here. */}
        <div className="fade-up flex w-full flex-col gap-5 [animation-delay:200ms]">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
        <div className="fade-up flex w-full flex-col gap-8 [animation-delay:300ms]">
          {/* gap-8 on `main` (32px) gives the spacing above this rule too. */}
          <div aria-hidden="true" className="w-full border-t-[0.5px] border-hairline" />
          <h2
            className={`${geist.className} text-[24px] font-medium leading-tight text-white desk:text-[48px]`}
          >
            Related Articles
          </h2>
          <div className="flex w-full flex-col gap-8 desk:flex-row desk:gap-6 mb-3 border-b-[0.5px] border-hairline pb-8">
            {relatedPosts.map((relatedPost) => (
              <RelatedArticleCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </div>
        <AuditForm />
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
