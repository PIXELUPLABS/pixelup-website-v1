import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { AuditForm } from "@/components/AuditForm";
import { Footer } from "@/components/Footer";
import { blogPosts, formatBlogDate, type BlogContentBlock, type BlogPost } from "@/lib/blog";
import { BlogPostSidebar } from "./BlogPostSidebar";

// Scoped to the "Related Articles" heading only — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500"] });

/** One "Related Articles" card — date, image, category tag, heading,
    description, "Read Article". Links to the related post. */
function RelatedArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex min-w-0 flex-1 flex-col gap-3">
      <p className="text-[12px] font-medium uppercase text-label-grey">
        {formatBlogDate(post.publishedDate)}
      </p>
      <div className="relative h-56.25 w-full desk:h-80">
        <Image src={post.image} alt="" fill sizes="(min-width: 1200px) 25vw, 100vw" className="object-cover object-left" />
      </div>
      {/* Extra mt-2 on top of the card's gap-3 rhythm for the spacing
          called out between the image and the tag. */}
      <div className="mt-2 flex items-end">
        <span className="h-1 w-1.5 shrink-0 bg-[#0658FC]" />
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
              fill="#0658FC"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/** Renders one block of `post.content` in reading order. */
function ContentBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="tracking-display text-[24px] font-medium leading-tight text-white desk:text-[48px]">
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3 className="tracking-display text-[20px] font-medium leading-tight text-white desk:text-[28px]">
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2 pl-5 text-[16px] leading-[1.6] text-body-grey marker:text-white/40 [&>li]:list-disc">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "paragraph":
      return <p className="text-[16px] leading-[1.6] text-body-grey">{block.text}</p>;
    case "table":
      return (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-120 border-collapse border-[0.5px] border-hairline text-left text-[16px]">
            <thead>
              <tr className="divide-x divide-hairline border-b-[0.5px] border-hairline">
                {block.headers.map((header) => (
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
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="divide-x divide-hairline">
                  {row.map((cell, cellIndex) => (
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
  }
}

/** Blog post detail shell — aside + divider + right-section layout, same
    treatment as /blog. Right-section content beyond the hero banner is a
    placeholder for now; the real article layout lands later. */
export function BlogPostPage({ post }: { post: BlogPost }) {
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="relative flex flex-col gap-8 p-4 desk:flex-row desk:items-start desk:gap-0 desk:p-5">
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
          <Image
            src={post.image}
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
          {post.content.map((block, index) => (
            <ContentBlock key={index} block={block} />
          ))}
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