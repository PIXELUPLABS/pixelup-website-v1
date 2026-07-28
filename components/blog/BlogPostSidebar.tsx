import { estimateReadTime, formatBlogDate, type BlogPost } from "@/lib/blog";
import { BackButton } from "../BackButton";
import { CtaButtons } from "../CtaButtons";
import { TrustedStrip } from "../TrustedStrip";

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center gap-4 border-b-[0.5px] border-hairline py-3">
      <p className="w-[72px] shrink-0 text-[14px] tracking-[-0.01em] text-label-grey">{label}</p>
      <p className="text-[14px] tracking-[-0.01em] text-white">{value}</p>
    </div>
  );
}

/**
 * Blog post detail aside: back-to-blog button + post title (no subheading)
 * + 4 meta rows (label / value, hairline under each, full aside width),
 * with the site's trusted-strip + CTA buttons pinned to the bottom. Same
 * width/sticky treatment as BlogSidebar — different content, not a reuse.
 */
export function BlogPostSidebar({ post }: { post: BlogPost }) {
  const metaRows = [
    { label: "Written by", value: post.author },
    { label: "Created on", value: formatBlogDate(post.publishedDate) },
    { label: "Updated on", value: formatBlogDate(post.updatedDate) },
    { label: "Read time", value: estimateReadTime(post.content) },
  ];

  return (
    <aside className="flex flex-col gap-8 desk:sticky desk:top-21 desk:flex desk:h-[calc(100vh-6.5rem)] desk:w-[26%] desk:min-w-[340px] desk:max-w-[460px] desk:gap-0 desk:self-start">
      {/* Long titles/content push this past one viewport — min-h-0 lets the
          flex-1 box shrink below its content size so overflow-y-auto can
          actually kick in, instead of the box growing and pushing the CTA
          group off the bottom of the sticky aside. */}
      <div className="no-scrollbar flex flex-col gap-8 desk:min-h-0 desk:flex-1 desk:justify-between desk:overflow-y-auto desk:pt-2">
        <div className="fade-up flex flex-col gap-6 [animation-delay:100ms]">
          <BackButton href="/blog" label="Back to blog" icon="arrow" />
          <h1 className="tracking-display text-[24px] font-medium leading-[1.1] text-white desk:text-[32px]">
            {post.title}
          </h1>
          <div className="flex flex-col">
            {metaRows.map((row, index) => (
              <MetaRow key={index} label={row.label} value={row.value} />
            ))}
          </div>
        </div>
        <div className="fade-up hidden flex-col gap-5 [animation-delay:200ms] desk:flex">
          <TrustedStrip />
          <CtaButtons />
        </div>
      </div>
    </aside>
  );
}
