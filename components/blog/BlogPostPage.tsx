import { Geist } from "next/font/google";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import type { BlogContentBlock, BlogPost } from "@/lib/blog";
import { BlogPostSidebar } from "./BlogPostSidebar";

// Scoped to the "Related Articles" heading only — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500"] });

/** One "Related Articles" card — date, image, category tag, heading,
    subheading, "Read Article". Same content on both sides for now. */
function RelatedArticleCard() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <p className="text-[12px] font-medium uppercase text-label-grey">JUN 24, 2026</p>
      <div className="relative h-80 w-full">
        <Image
          src="/media/Link.png"
          alt=""
          fill
          sizes="(min-width: 1200px) 25vw, 100vw"
          className="object-cover"
        />
      </div>
      {/* Extra mt-2 on top of the card's gap-3 rhythm for the spacing
          called out between the image and the tag. */}
      <div className="mt-2 flex items-center">
        <span className="h-1 w-1.5 shrink-0 bg-[#0658FC]" />
        <span className="bg-label-grey/20 px-0.5 py-px text-[12px] font-medium uppercase text-white">
          Design
        </span>
      </div>
      <p className="text-[24px] font-medium leading-tight text-white">
        What makes a website project run smoothly
      </p>
      <p className="text-[14px] leading-[1.5] text-body-grey">
        A short, practical look at the handful of decisions that keep a website
        build on schedule instead of drifting past its deadline.
      </p>
      {/* Extra mt-2 for the spacing called out before "Read Article". */}
      <p className="mt-2 text-[12px] font-medium uppercase text-white">Read Article</p>
    </div>
  );
}

/** Renders one block of `post.content` in reading order. */
function ContentBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="tracking-display text-[35px] font-medium leading-tight text-white">
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2 pl-5 text-[14px] leading-[1.6] text-body-grey marker:text-white/40 [&>li]:list-disc">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "paragraph":
      return <p className="text-[14px] leading-[1.6] text-body-grey">{block.text}</p>;
  }
}

/** Blog post detail shell — aside + divider + right-section layout, same
    treatment as /blog. Right-section content beyond the hero banner is a
    placeholder for now; the real article layout lands later. */
export function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <div className="relative flex flex-col gap-8 p-5 desk:flex-row desk:items-start desk:gap-0">
      <BlogPostSidebar post={post} />
      {/* Divider between the aside and content columns, same treatment as /blog. */}
      <div
        aria-hidden="true"
        className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
      />
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="relative h-120 w-full">
          <Image src={post.image} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        {/* gap-8 on `main` (32px) gives the spacing above/between each block. */}
        {post.content.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
        {/* gap-8 on `main` (32px) gives the spacing above this rule too. */}
        <div aria-hidden="true" className="w-full border-t-[0.5px] border-hairline" />
        <h2 className={`${geist.className} text-[40px] font-medium leading-tight text-white`}>
          Related Articles
        </h2>
        <div className="flex w-full flex-col gap-8 desk:flex-row desk:gap-6">
          <RelatedArticleCard />
          <RelatedArticleCard />
        </div>
        <Footer inset={false} />
      </main>
    </div>
  );
}