import { formatBlogDate, type BlogPost } from "@/lib/blog";
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
    { label: "Written by", value: "DAKSH" },
    { label: "Created on", value: formatBlogDate(post.date) },
    { label: "Updated on", value: formatBlogDate(post.date) },
    { label: "Read", value: "12 MINS" },
  ];

  return (
    <aside className="flex flex-col gap-8 desk:sticky desk:top-21 desk:h-[calc(100vh-6.5rem)] desk:w-[26%] desk:min-w-[340px] desk:max-w-[460px] desk:gap-0 desk:self-start">
      <div className="flex flex-col gap-6">
        <BackButton href="/blog" label="Back to blog" icon="arrow" />
        <h1 className="tracking-display text-[24px] font-medium leading-[1.1] text-white desk:text-[40px]">
          {post.title}
        </h1>
        <div className="flex flex-col">
          {metaRows.map((row, index) => (
            <MetaRow key={index} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 desk:mt-auto">
        <TrustedStrip />
        <CtaButtons />
      </div>
    </aside>
  );
}
